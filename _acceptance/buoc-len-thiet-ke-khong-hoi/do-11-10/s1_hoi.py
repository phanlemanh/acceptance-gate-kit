#!/usr/bin/env python3
"""Rút cặp (câu máy hỏi, câu người trả lời) trong ĐOẠN THIẾT KẾ (S1) của các vòng feature-loop crm + kit.
Đoạn S1 của một phiên: MỞ khi phiên gọi skill feature-loop hoặc brainstorming; ĐÓNG ở mốc Cổng Phạm vi
đầu tiên (skill acceptance-card, lệnh approve/signoff), hoặc khi mở đoạn mới. Một đoạn chỉ được TÍNH khi
trong đoạn phiên có ghi `_acceptance/<slug>/contract.md` (tức đây thật là S1 của một vòng) — phiên điều
phối gọi brainstorming rồi chạy cả ngày bị loại.
Một «câu hỏi» = một tin người ngay sau lượt máy dừng (tin thường) HOẶC một AskUserQuestion.
Dùng: s1_hoi.py <từ-UTC> > cap.jsonl ; đoạn bị loại in ra stderr."""
import glob, json, os, re, sys
base = os.path.expanduser('~/.claude/projects')
since = sys.argv[1]
AUTO = ('<task-notification', '<cross-session-message', '<system-reminder', '<local-command', 'Caveat:',
        '[Request interrupted', 'This session is being continued', '<command-message>', '<ci-monitor-event',
        '<user-prompt-submit-hook', 'Base directory for this skill')
OPEN_SKILL = re.compile(r'brainstorming|feature-loop:feature-loop$|^feature-loop$')
CLOSE_SKILL = re.compile(r'acceptance-card')
CLOSE_CMD = re.compile(r'<command-name>/?acceptance-gate:(approve|signoff)')
OPEN_CMD = re.compile(r'<command-name>/?(feature-loop:feature-loop|superpowers:brainstorm)')
CONTRACT = re.compile(r'_acceptance/([\w-]+)/contract\.md')

def text_of(content):
    if isinstance(content, str): return content
    return '\n'.join(x.get('text', '') for x in content or [] if isinstance(x, dict) and x.get('type') == 'text')

seen = set()
def flush(seg, meta):
    if (seg.get('tao') or seg.get('brain')) and seg['slugs']:
        print(f"DOAN {meta} {seg['start'][:16]} {','.join(sorted(seg['slugs']))} dong={seg.get('close','mo')} cap={len(seg['pairs'])}", file=sys.stderr)
    if not seg['pairs']: return
    if not (seg.get('tao') or seg.get('brain')):
        print(f"LOAI {meta} {seg['start'][:16]} {len(seg['pairs'])} cap (resume, khong tao contract)", file=sys.stderr); return
    if not seg['slugs']:
        print(f"LOAI {meta} {seg['start'][:16]} {len(seg['pairs'])} cap (khong ghi contract)", file=sys.stderr); return
    for p in seg['pairs']:
        p['slug'] = ','.join(sorted(seg['slugs'])); p['dong'] = seg.get('close', 'mo')
        print(json.dumps(p, ensure_ascii=False))

for d in sorted(os.listdir(base)):
    if d.startswith('-Users-manhphan-dev-crm'): kho = 'crm'
    elif d.startswith('-Users-manhphan-dev-acceptance-gate-kit'): kho = 'kit'
    else: continue
    dd = d.split('worktrees-')[-1][:28] if 'worktrees' in d else 'goc'
    for f in sorted(glob.glob(os.path.join(base, d, '*.jsonl'))):
        ses = os.path.basename(f)[:8]
        seg = None; last_asst = ''; pending_ask = {}
        for l in open(f, errors='replace'):
            try: r = json.loads(l)
            except Exception: continue
            if r.get('isSidechain'): continue
            t = r.get('timestamp') or ''
            typ = r.get('type'); content = (r.get('message') or {}).get('content')
            if seg and not seg.get('close') and t and seg.get('last') and t[:13] > seg['last'][:13] and (int(t[8:10])*24+int(t[11:13])) - (int(seg['last'][8:10])*24+int(seg['last'][11:13])) > 6: seg['close'] = 'nghi'
            if seg and t: seg['last'] = t
            if typ == 'assistant':
                for x in content if isinstance(content, list) else []:
                    if not isinstance(x, dict): continue
                    if x.get('type') == 'text' and x.get('text', '').strip(): last_asst = x['text']
                    if x.get('type') != 'tool_use': continue
                    nm = x.get('name'); inp = x.get('input') or {}
                    if nm == 'Skill':
                        sk = inp.get('skill', '')
                        if OPEN_SKILL.search(sk):
                            if seg is None or seg.get('close'):
                                if seg: flush(seg, f'{kho} {dd} {ses}')
                                seg = {'start': t, 'pairs': [], 'slugs': set()}
                            if 'brainstorm' in sk: seg['brain'] = True
                        elif CLOSE_SKILL.search(sk) and seg and not seg.get('close'):
                            seg['close'] = 'the'
                    if nm in ('Write', 'Edit') and seg and not seg.get('close'):
                        m = CONTRACT.search(inp.get('file_path', ''))
                        if m: seg['slugs'].add(m.group(1))
                        if m and nm == 'Write': seg['tao'] = True
                    if nm == 'Bash' and seg and not seg.get('close'):
                        m = CONTRACT.search(inp.get('command', ''))
                        if m and ('>' in inp.get('command', '') or 'cat <<' in inp.get('command', '')): seg['slugs'].add(m.group(1))
                    if nm == 'AskUserQuestion': pending_ask[x.get('id')] = inp
                    if seg and not seg.get('close'):
                        blob = json.dumps(inp, ensure_ascii=False)
                        if nm == 'Bash' and re.search(r'gate-card|acceptance-card', blob): seg['close'] = 'the'
                        if nm in ('Edit', 'Write') and 'contract.md' in inp.get('file_path', '') and re.search(r'status: approved', blob): seg['close'] = 'approved'
                continue
            if typ != 'user' or r.get('isMeta') or r.get('isCompactSummary'): continue
            if isinstance(content, list):
                trs = [x for x in content if isinstance(x, dict) and x.get('type') == 'tool_result']
                for tr in trs:
                    q = pending_ask.pop(tr.get('tool_use_id'), None)
                    if q is None or not seg or seg.get('close') or t < since: continue
                    ans = tr.get('content'); ans = ans if isinstance(ans, str) else text_of(ans)
                    seg['pairs'].append({'ts': t[:19], 'kho': kho, 'dir': dd, 'ses': ses, 'kieu': 'ask',
                                         'hoi': json.dumps(q.get('questions'), ensure_ascii=False)[:2500], 'tra_loi': (ans or '')[:700]})
                if trs: continue
            txt = text_of(content).strip()
            if not txt: continue
            if CLOSE_CMD.search(txt):
                if seg and not seg.get('close'): seg['close'] = 'approve'
                continue
            if OPEN_CMD.search(txt):
                if seg: flush(seg, f'{kho} {dd} {ses}')
                seg = {'start': t, 'pairs': [], 'slugs': set()}
                continue
            if txt.startswith('<cross-session-message') and seg and not seg.get('close') and t >= since:
                seg['pairs'].append({'ts': t[:19], 'kho': kho, 'dir': dd, 'ses': ses, 'kieu': 'chuyen',
                                     'hoi': last_asst[-2000:], 'tra_loi': txt[:900]})
                continue
            if txt.startswith(AUTO) or '<command-name>' in txt: continue
            if not seg or seg.get('close') or t < since: continue
            u = r.get('uuid')
            if u in seen: continue
            seen.add(u)
            seg['pairs'].append({'ts': t[:19], 'kho': kho, 'dir': dd, 'ses': ses, 'kieu': 'tin',
                                 'hoi': last_asst[-2000:], 'tra_loi': txt[:700]})
        if seg: flush(seg, f'{kho} {dd} {ses}')
