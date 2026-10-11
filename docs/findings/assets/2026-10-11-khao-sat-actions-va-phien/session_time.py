#!/usr/bin/env python3
"""Do thoi gian phien Claude Code o cac kho dung kit acceptance-gate.

CHI DOC ~/.claude/projects/<dir>/*.jsonl (phien chinh) va <dir>/<sid>/**/*.jsonl
(tac tu con / workflow). Ghi ket qua JSON ra stdout-file (tham so 1).

Cach tinh (tom tat, chi tiet o session-time.md):
- Moi phien chinh: sap cac ban ghi co timestamp theo thoi gian; moi khoang giua
  hai ban ghi lien tiep duoc gan cho MOT trang thai:
    * co cong cu tien canh dang mo (tool_use chua co tool_result)  -> lop cua cong cu
      (nhieu cong cu song song: chia deu khoang cho cac cong cu dang mo)
    * may da tra loi xong luot (khong cong cu mo) -> "nhan roi", gan theo THU KET THUC
      khoang roi: tin nguoi (<=30' cho nguoi, >30' nguoi vang) · task-notification
      (gan cho lop cua lenh nen da sinh ra no) · tin phien khac (peer) · khac
    * con lai -> model sinh (dang nghi/viet)
- Lenh nen (Bash run_in_background, Monitor, Workflow, Agent async): thoi luong
  rieng = tool_use -> thong bao ket thuc (hoac duration_ms trong thong bao).
"""
import json, glob, os, re, sys, collections, datetime as dt

ROOT = os.path.expanduser('~/.claude/projects')
REPOS = ['crm-onehub', 'oneflow', 'media-library', 'artifact-platform',
         'floorplanstudio', 'mapposter', 'acceptance-gate-kit']
ABSENT = 30 * 60  # giay
STALL = 11 * 60   # Bash foreground toi da 10' (timeout 600000ms)

def repo_of(d):
    for r in REPOS:
        if d == '-Users-manhphan-dev-' + r or d.startswith('-Users-manhphan-dev-' + r + '-'):
            return r
    return None

def ts(s):
    return dt.datetime.fromisoformat(s.replace('Z', '+00:00')).timestamp()

# ---------------- phan lop lenh Bash ----------------
CI = [
    ('ci:gh pr checks', r'\bgh\s+pr\s+checks'),
    ('ci:gh run watch', r'\bgh\s+run\s+watch'),
    ('ci:gh run view/list/rerun', r'\bgh\s+run\s+(view|list|rerun|download)'),
    ('ci:gh api actions/checks', r'\bgh\s+api\s+\S*(actions|check-runs|check-suites|statuses|/status\b)'),
    ('ci:statusCheckRollup', r'statusCheckRollup|mergeStateStatus|mergeable'),
]
TEST = [
    ('test:repin', r'repin'),
    ('test:pre-merge-check', r'pre-?merge'),
    ('test:duong-nen', r'duong-nen'),
    ('test:run-evals', r'run-evals|eval-runner|chay-evals'),
    ('test:turbo', r'\bturbo\b'),
    ('test:bun test', r'\bbun\s+(run\s+)?test'),
    ('test:node --test', r'\bnode\b[^|;&\n]*--test\b'),
    ('test:npm/pnpm test', r'\b(npm|pnpm|yarn)\s+(run\s+)?test'),
    ('test:playwright', r'playwright\s+test'),
    ('test:vitest/jest', r'\bvitest\b|\bjest\b'),
    ('test:kit suite script', r'tests?/[\w./-]+\.(sh|mjs|cjs|js)\b|run-tests|test-all|run-all'),
    ('test:itest/check script', r'\bitest\b|check-[\w-]+\.sh'),
    ('test:typecheck/build/lint', r'\btsc\b|typecheck|\b(npm|pnpm|bun|yarn)\s+run\s+(build|lint|check)|\beslint\b|\bbiome\b|\bnext\s+build'),
]
S4 = [('s4:acceptance-verify (bash)', r'acceptance-verify|wf-usage|s4-args')]

def strip_prefix(cmd):
    c = cmd.strip()
    # bo cac tien to cd X &&, VAR=x, export
    for _ in range(6):
        c2 = re.sub(r'^(cd\s+("[^"]*"|\S+)\s*(&&|;)\s*|[A-Z_][A-Z0-9_]*=("[^"]*"|\S*)\s+|export\s+[^;&]*(;|&&)\s*)', '', c)
        if c2 == c:
            break
        c = c2.strip()
    return c

def classify_cmd(cmd):
    loop = re.search(r'\b(while|until|for)\b', cmd) and re.search(r'\bsleep\b', cmd)
    for lab, rx in CI:
        if re.search(rx, cmd):
            if loop:
                return 'ci', 'ci:poll loop (sleep+gh)'
            return 'ci', lab
    if loop and re.search(r'\bgh\b', cmd):
        return 'ci', 'ci:poll loop (sleep+gh)'
    for lab, rx in TEST:
        if re.search(rx, cmd):
            return 'test', lab
    for lab, rx in S4:
        if re.search(rx, cmd):
            return 's4', lab
    if re.search(r'wait-ci', cmd):
        return 'ci', 'ci:wait-ci script'
    if re.search(r'chay-suite|campaign', cmd):
        return 'test', 'test:kit suite script'
    if re.search(r'workflows/wf_|journal\.jsonl|evidence-report', cmd) and re.search(r'\b(until|while|tail\s+-f)\b', cmd):
        return 's4', 's4:poll workflow journal'
    if re.search(r'\brun\s+dev\b|service:dev|\b(npm|pnpm)\b[^\n]*\bstart\b|tsx\s+\S*(server|http)|next\s+dev|\bvite\b(?!st)', cmd):
        return 'devserver', 'devserver'
    if loop:
        return 'poll', 'poll:sleep-loop doi file cuc bo'
    if re.search(r'\btail\s+(-n\s*[+\d]+\s+)?-f\b', cmd):
        return 'poll', 'poll:tail -f'
    c = strip_prefix(cmd)
    if re.search(r'\bgit\s+push\b', cmd):
        return 'git', 'git:push'
    if re.match(r'git\b', c):
        if re.match(r'git\s+(-C\s+\S+\s+)?(fetch|pull|merge|rebase)', c):
            return 'git', 'git:fetch/pull/merge/rebase'
        if re.match(r'git\s+(-C\s+\S+\s+)?worktree', c):
            return 'git', 'git:worktree'
        return 'git', 'git:other'
    if re.match(r'gh\b', c):
        if re.match(r'gh\s+pr\s+(create|merge|edit|ready|comment)', c):
            return 'git', 'gh:pr write'
        return 'git', 'gh:other'
    if re.match(r'sleep\b', c):
        return 'other', 'other:sleep'
    tok = re.split(r'[\s;|&]+', c)[0][:30] if c else '?'
    tok = os.path.basename(tok)
    return 'other', 'other:' + tok

def classify_tool(name, inp):
    if name == 'Bash':
        return classify_cmd(inp.get('command', ''))
    if name == 'Monitor':
        coarse, fine = classify_cmd(inp.get('command', ''))
        if coarse == 'ci':
            return 'ci', 'ci:Monitor'
        return coarse if coarse != 'other' else 'other', 'monitor:' + fine
    if name == 'ScheduleWakeup':
        txt = json.dumps(inp, ensure_ascii=False)
        if re.search(r'\bCI\b|checks|gh run|PR', txt):
            return 'ci', 'ci:ScheduleWakeup'
        return 'other', 'other:ScheduleWakeup'
    if name == 'Workflow':
        sp = str(inp.get('scriptPath', '')) + ' ' + str(inp.get('name', ''))
        if 'execute-parallel' in sp:
            return 'workflow', 'workflow:S3 execute-parallel'
        if re.search(r'acceptance-verify|s4', sp):
            return 's4', 's4:Workflow acceptance-verify'
        return 'workflow', 'workflow:other'
    if name == 'Agent':
        return 'agent', 'agent:' + str(inp.get('subagent_type') or 'general')
    if name == 'AskUserQuestion':
        return 'human_ask', 'human:AskUserQuestion'
    if name.startswith('mcp__Claude_Browser') or name.startswith('mcp__claude-in-chrome'):
        return 'tool', 'tool:browser'
    if name.startswith('mcp__ccd_session_mgmt') or name in ('SendMessage', 'ListAgents'):
        return 'tool', 'tool:session-mgmt'
    return 'tool', 'tool:' + name

# ---------------- phan loai tin "user" ----------------
def text_of(content):
    if isinstance(content, str):
        return content
    out = []
    for b in content or []:
        if isinstance(b, dict) and b.get('type') == 'text':
            out.append(b.get('text', ''))
    return '\n'.join(out)

def user_kind(j):
    c = j['message'].get('content')
    if isinstance(c, list) and any(isinstance(b, dict) and b.get('type') == 'tool_result' for b in c):
        return 'tool_result'
    o = j.get('origin') or {}
    k = o.get('kind')
    t = text_of(c).lstrip()
    if k == 'task-notification' or t.startswith('<task-notification>'):
        return 'notif'
    if k == 'peer' or t.startswith('Another Claude session') or t.startswith('<cross-session-message') or t.startswith('<agent-message'):
        return 'agentmsg' if t.startswith('<agent-message') else 'peer'
    if t.startswith('<ci-monitor-event>'):
        return 'ci_event'
    if k == 'human':
        return 'human'
    if j.get('isMeta'):
        return 'meta'
    if t.startswith('<local-command') or t.startswith('<system-reminder>') or t.startswith('[Image'):
        return 'meta'
    if t.startswith('<command-name>') or t.startswith('<command-message>'):
        return 'human'
    if t.startswith('<'):
        return 'meta'
    if not t:
        return 'meta'
    return 'human'

def queued_kind(a):
    p = (a.get('prompt') or '')
    if not isinstance(p, str):
        p = text_of(p)
    p = p.lstrip()
    mode = a.get('commandMode')
    if mode == 'task-notification' or p.startswith('<task-notification>'):
        return 'notif'
    if p.startswith('<cross-session-message') or p.startswith('Another Claude session'):
        return 'peer'
    if p.startswith('<agent-message'):
        return 'agentmsg'
    if p.startswith('<ci-monitor-event>'):
        return 'ci_event'
    if a.get('isMeta') or p.startswith('<'):
        return 'meta'
    return 'human'

NOTIF_TU = re.compile(r'<tool-use-id>(toolu_\w+)</tool-use-id>')
NOTIF_TID = re.compile(r'<task-id>([\w:_-]+)</task-id>')
NOTIF_ST = re.compile(r'<status>(\w+)</status>')
NOTIF_DUR = re.compile(r'<duration_ms>(\d+)</duration_ms>')
NOTIF_TOK = re.compile(r'<subagent_tokens>(\d+)</subagent_tokens>')
POLL_RX = re.compile(r'tasks/(\w+)\.output')
AGENTMSG_FROM = re.compile(r'<agent-message from="(\w+)"')

def parse_push(cmd):
    out = []
    for m in re.finditer(r'\bgit\s+((?:-C\s+\S+\s+)?)push\b([^;&|\n]*)', cmd):
        args = [a for a in m.group(2).split() if not a.startswith('-')]
        ref = args[1] if len(args) >= 2 else (args[0] if len(args) == 1 and '/' in args[0] and args[0] != 'origin' else None)
        if ref:
            ref = ref.split(':')[-1].lstrip('+')
        out.append(ref)
    return out

# ---------------- doc mot phien chinh ----------------
def analyze_main(path, repo):
    recs = []
    tools = {}       # id -> dict
    bg_map = {}      # task id -> tool id
    notif_end = collections.defaultdict(list)  # tool id -> [(t, status, dur, tok)]
    human_n = 0; human_q = 0; peer_n = 0; ask_n = 0
    pushes = []
    gates = []
    branch_last = None
    first = last = None
    with open(path) as fh:
        for line in fh:
            try:
                j = json.loads(line)
            except Exception:
                continue
            t = j.get('timestamp')
            typ = j.get('type')
            if not t:
                continue
            try:
                T = ts(t)
            except Exception:
                continue
            if j.get('gitBranch'):
                branch_last = j.get('gitBranch')
            if typ == 'assistant':
                tus = []
                for b in j['message'].get('content', []) or []:
                    if isinstance(b, dict) and b.get('type') == 'tool_use':
                        inp = b.get('input') or {}
                        co, fi = classify_tool(b['name'], inp)
                        if co in ('other', 'poll') or fi.startswith('monitor:'):
                            m = POLL_RX.search(inp.get('command', '') or '')
                            if m and m.group(1) in bg_map and bg_map[m.group(1)] in tools:
                                src = tools[bg_map[m.group(1)]]
                                co, fi = src['coarse'], src['fine'] + ' (poll)'
                        tools[b['id']] = dict(name=b['name'], inp=inp, start=T, end=None, coarse=co, fine=fi,
                                              bg=False, branch=branch_last)
                        tus.append(b['id'])
                        if b['name'] == 'AskUserQuestion':
                            ask_n += 1
                        if (b['name'] == 'Skill' and 'acceptance-card' in str(inp.get('skill', ''))) or \
                           (b['name'] == 'Bash' and re.search(r'gate-card|acceptance-card', inp.get('command', ''))):
                            gates.append(T)
                        if b['name'] == 'Bash' and 'git push' in inp.get('command', ''):
                            for ref in parse_push(inp['command']):
                                pushes.append(dict(t=T, ref=(ref if ref not in (None, 'HEAD') else branch_last), branch=branch_last, id=b['id']))
                recs.append(('A', T, tus))
            elif typ == 'user':
                k = user_kind(j)
                res = []
                if k == 'tool_result':
                    for b in j['message']['content']:
                        if isinstance(b, dict) and b.get('type') == 'tool_result':
                            res.append(b.get('tool_use_id'))
                    tur = j.get('toolUseResult')
                    if isinstance(tur, dict) and res:
                        tid = res[0]
                        bgid = None
                        if tur.get('backgroundTaskId'):
                            bgid = tur['backgroundTaskId']
                        elif tur.get('status') == 'async_launched' or tur.get('isAsync'):
                            bgid = tur.get('taskId') or tur.get('agentId')
                        elif tid in tools and tools[tid]['name'] == 'Monitor' and tur.get('taskId'):
                            bgid = tur['taskId']
                        if bgid:
                            bg_map[bgid] = tid
                            if tid in tools:
                                tools[tid]['bg'] = True
                        if tid in tools and tools[tid]['name'] == 'Bash':
                            tools[tid]['out'] = str(tur.get('stdout', ''))[-300:] + str(tur.get('stderr', ''))[-300:]
                txt = text_of(j['message'].get('content'))
                notif = None
                if k == 'notif':
                    notif = txt
                elif k == 'agentmsg':
                    m = AGENTMSG_FROM.search(txt)
                    notif = '<task-id>%s</task-id>' % m.group(1) if m else None
                if k == 'human':
                    human_n += 1
                if k == 'peer':
                    peer_n += 1
                recs.append(('U', T, k, res, notif))
            elif typ == 'attachment':
                a = j.get('attachment') or {}
                if a.get('type') == 'queued_command':
                    qk = queued_kind(a)
                    p = a.get('prompt') if isinstance(a.get('prompt'), str) else text_of(a.get('prompt'))
                    if qk == 'human':
                        human_q += 1
                    if qk == 'peer':
                        peer_n += 1
                    if qk in ('notif', 'agentmsg'):
                        if qk == 'agentmsg':
                            m = AGENTMSG_FROM.search(p or '')
                            p = '<task-id>%s</task-id>' % m.group(1) if m else ''
                        recs.append(('N', T, p))  # notification giua luot: chi dung cho thoi luong nen
                    continue
                recs.append(('X', T))
            else:
                recs.append(('X', T))
            first = T if first is None else min(first, T)
            last = T if last is None else max(last, T)
    if not recs:
        return None
    recs.sort(key=lambda r: r[1])

    # gan ket thuc cong cu + thong bao nen
    def note_notif(T, txt):
        if not txt:
            return
        tus = NOTIF_TU.findall(txt)
        tids = NOTIF_TID.findall(txt)
        st = NOTIF_ST.search(txt); st = st.group(1) if st else 'event'
        dur = NOTIF_DUR.search(txt); dur = int(dur.group(1)) if dur else None
        tok = NOTIF_TOK.search(txt); tok = int(tok.group(1)) if tok else None
        ids = set(tus) | {bg_map[x] for x in tids if x in bg_map}
        for i in ids:
            notif_end[i].append((T, st, dur, tok))
        return ids

    buckets = collections.Counter()       # coarse/state -> giay
    fine_b = collections.Counter()        # fine -> giay (cong cu tien canh + nen gan vao roi)
    open_fg = {}
    last_role = 'U'
    idle = 0.0
    idle_list = []
    model_gaps = []
    prevT = recs[0][1]
    for r in recs:
        T = r[1]
        g = max(0.0, T - prevT)
        if g > 0:
            if open_fg:
                share = g / len(open_fg)
                for tid in open_fg:
                    ti = tools[tid]
                    key = ti['coarse']
                    # phan vuot tran: Bash/Read/... > 11' = vuot timeout toi da 10' cua Bash
                    # -> gan 'stall' (uoc: cho duyet quyen / may ngu), khong gan cho lop lenh
                    lim = None
                    if ti['name'] == 'AskUserQuestion':
                        lim = ABSENT
                    elif ti['name'] not in ('Agent', 'Workflow', 'TaskOutput', 'Monitor'):
                        lim = STALL
                    if lim is not None:
                        a0 = max(prevT, ti['start']); el0 = a0 - ti['start']; el1 = T - ti['start']
                        within = max(0.0, min(el1, lim) - el0) / len(open_fg) if el1 > 0 else share
                        within = min(within, share)
                        over = share - within
                        if ti['name'] == 'AskUserQuestion':
                            buckets['fg:human_ask'] += within; buckets['human_absent'] += over
                        else:
                            buckets['fg:' + key] += within; fine_b['fg|' + ti['fine']] += within
                            buckets['stall'] += over
                        continue
                    buckets['fg:' + key] += share
                    fine_b['fg|' + ti['fine']] += share
            elif last_role == 'A':
                idle += g
            else:
                buckets['gap_unknown' if g > ABSENT else 'model'] += g
                if g >= 60:
                    model_gaps.append(g)
        prevT = T
        kind = r[0]
        if kind == 'A':
            if idle:
                # tiep tuc sinh khong co tin chen; > 30' = khoang trong khong ro (resume/may ngu)
                buckets['gap_unknown' if idle > ABSENT else 'model'] += idle; idle = 0.0
            for tid in r[2]:
                open_fg[tid] = True
            last_role = 'A'
        elif kind == 'U':
            k, res, notif = r[2], r[3], r[4]
            for tid in res:
                if tid in tools and tools[tid]['end'] is None:
                    tools[tid]['end'] = T
                open_fg.pop(tid, None)
            ids = None
            if notif:
                ids = note_notif(T, notif)
            orphan = bool(notif) and ('previous session' in notif or 'previous Claude Code process' in notif)
            if k == 'meta':
                continue
            if k == 'human' and open_fg:
                # nguoi ngat: dong moi cong cu dang mo
                for tid in list(open_fg):
                    if tools[tid]['end'] is None:
                        tools[tid]['end'] = T
                open_fg.clear()
            if idle:
                if k == 'human':
                    lab = 'human_absent' if idle > ABSENT else 'human_wait'
                    buckets[lab] += idle
                    idle_list.append(idle)
                elif orphan:
                    buckets['human_absent' if idle > ABSENT else 'human_wait'] += idle  # mo lai phien cu
                elif k in ('notif', 'agentmsg'):
                    cls = None
                    for i in (ids or []):
                        if i in tools:
                            cls = tools[i]; break
                    if cls:
                        buckets['bgwait:' + cls['coarse']] += idle
                        fine_b['bgwait|' + cls['fine']] += idle
                    else:
                        buckets['bgwait:unknown'] += idle
                elif k == 'ci_event':
                    buckets['bgwait:ci'] += idle
                    fine_b['bgwait|ci:desktop ci-monitor'] += idle
                elif k == 'peer':
                    buckets['peer_wait' if idle <= ABSENT else 'peer_wait_long'] += idle
                elif k == 'tool_result':
                    buckets['gap_unknown' if idle > ABSENT else 'model'] += idle
                else:
                    buckets['other_wait'] += idle
                idle = 0.0
            last_role = 'U'
        elif kind == 'N':
            note_notif(T, r[2])
    if idle:
        buckets['tail_idle'] += idle

    # thoi luong lenh nen
    bg = []
    for tid, ti in tools.items():
        if not ti['bg']:
            continue
        ends = notif_end.get(tid, [])
        dur = None; tok = None; st = None
        final = [e for e in ends if e[1] in ('completed', 'failed', 'killed', 'stopped')]
        if final:
            e = final[0]
            st = e[1]
            dur = e[2] / 1000 if e[2] else e[0] - ti['start']
            tok = e[3]
        elif ends:
            st = 'events-only'
            dur = ends[-1][0] - ti['start']
        bg.append(dict(name=ti['name'], coarse=ti['coarse'], fine=ti['fine'], start=ti['start'], dur=dur, status=st, tok=tok,
                       cmd=(ti['inp'].get('command') or ti['inp'].get('scriptPath') or ti['inp'].get('description') or '')[:160]))
    fgcalls = []
    for tid, ti in tools.items():
        if ti['bg'] or ti['end'] is None:
            continue
        fgcalls.append(dict(name=ti['name'], coarse=ti['coarse'], fine=ti['fine'], dur=ti['end'] - ti['start'],
                            cmd=(ti['inp'].get('command') or '')[:200] if ti['name'] in ('Bash', 'Monitor') else ti['name']))
    for p in pushes:
        ti = tools.get(p['id'], {})
        p['out'] = ti.get('out', '')
    return dict(path=path, repo=repo, first=first, last=last, buckets=dict(buckets), fine=dict(fine_b),
                human=human_n, human_queued=human_q, peer=peer_n, ask=ask_n, bg=bg, fg=fgcalls,
                pushes=pushes, idle_list=idle_list, gates=gates, model_gaps=model_gaps,
                ci_calls=sorted(ti['start'] for ti in tools.values() if ti['coarse'] == 'ci'))

# ---------------- tac tu con: chi thoi gian Bash ----------------
def analyze_sub(path):
    starts = {}
    out = []
    with open(path) as fh:
        for line in fh:
            if '"tool_use"' not in line and '"tool_result"' not in line:
                continue
            try:
                j = json.loads(line)
            except Exception:
                continue
            t = j.get('timestamp')
            if not t:
                continue
            T = ts(t)
            if j.get('type') == 'assistant':
                for b in j['message'].get('content', []) or []:
                    if isinstance(b, dict) and b.get('type') == 'tool_use':
                        inp = b.get('input') or {}
                        if b['name'] in ('Bash', 'Monitor') and inp.get('run_in_background'):
                            continue
                        starts[b['id']] = (T, b['name'], inp)
            elif j.get('type') == 'user' and isinstance(j['message'].get('content'), list):
                for b in j['message']['content']:
                    if isinstance(b, dict) and b.get('type') == 'tool_result' and b.get('tool_use_id') in starts:
                        T0, name, inp = starts.pop(b['tool_use_id'])
                        co, fi = classify_tool(name, inp)
                        out.append(dict(name=name, coarse=co, fine=fi, dur=T - T0,
                                        cmd=(inp.get('command') or '')[:200] if name == 'Bash' else name,
                                        push=parse_push(inp.get('command', '')) if name == 'Bash' and 'git push' in inp.get('command', '') else []))
    return out

def main():
    outp = sys.argv[1]
    res = dict(main=[], sub=collections.defaultdict(list), dirs={})
    for d in sorted(os.listdir(ROOT)):
        repo = repo_of(d)
        if not repo:
            continue
        full = os.path.join(ROOT, d)
        mains = sorted(glob.glob(os.path.join(full, '*.jsonl')))
        subs = [f for f in glob.glob(os.path.join(full, '*', '**', '*.jsonl'), recursive=True)]
        res['dirs'][d] = dict(repo=repo, mains=len(mains), subs=len(subs))
        for f in mains:
            r = analyze_main(f, repo)
            if r:
                r['dir'] = d
                res['main'].append(r)
        for f in subs:
            for c in analyze_sub(f):
                c['file'] = f.replace(ROOT, '')
                res['sub'][repo].append(c)
    with open(outp, 'w') as fh:
        json.dump(res, fh, ensure_ascii=False)

if __name__ == '__main__':
    main()
