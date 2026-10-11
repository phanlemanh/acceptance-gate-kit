#!/usr/bin/env python3
"""B. Doc ho so _acceptance/*/ cua cac kho (CHI DOC). In JSON tong hop ra tham so 1.

- run-log.jsonl: round-tally (verdict/vong), repin + repin-do (wall_s), eval (exit),
  finding (inContract), vang-mat / loai-tac-tu-vang / infra-* (ha tang), thuoc-lech.
- usage-report.md: '### S4 ... (N agent, X out-tok)' + 'wall: Ns' + bang vai tro.
Phan lop REJECT = TIN HIEU co ghi trong cung (ho so, vong) — mot vong co the nhieu tin hieu.
"""
import json, glob, os, re, sys, collections

DEV = os.path.expanduser('~/dev')
REPOS = ['crm-onehub', 'oneflow', 'media-library', 'artifact-platform',
         'floorplanstudio', 'mapposter', 'acceptance-gate-kit']

def load(f):
    out = []
    for l in open(f, errors='replace'):
        try:
            j = json.loads(l)
        except Exception:
            continue
        if isinstance(j, dict):
            out.append(j)
    return out

def main():
    res = {}
    for repo in REPOS:
        R = dict(dossiers=0, with_tally=0, rounds=0, verdict=collections.Counter(), reject_sig=collections.Counter(),
                 reject_rounds=0, reject_nosig=0, repin_lines=0, repin_wall_lines=0, repin_wall_s=0, repin_do=0,
                 repin_do_wall_s=0, usage_rounds=0, usage_wall_s=[], usage_outtok=[], usage_role_s=collections.Counter(),
                 rounds_per_dossier=[], ts_min=None, ts_max=None, tok_lines=0, per=[])
        for d in sorted(glob.glob(f'{DEV}/{repo}/_acceptance/*/')):
            slug = os.path.basename(d.rstrip('/'))
            rl = os.path.join(d, 'run-log.jsonl')
            if not os.path.exists(rl):
                continue
            R['dossiers'] += 1
            L = load(rl)
            tallies = [j for j in L if j.get('kind') == 'round-tally']
            for j in L:
                t = j.get('ts')
                if isinstance(t, str) and t[:4] == '2026':
                    R['ts_min'] = min(R['ts_min'] or t, t); R['ts_max'] = max(R['ts_max'] or t, t)
                if any(k in j for k in ('tokens', 'out_tok', 'subagent_tokens', 'usage')):
                    R['tok_lines'] += 1
            rounds = sorted({j.get('round') for j in tallies if j.get('round') is not None}, key=lambda x: (str(type(x)), x))
            if tallies:
                R['with_tally'] += 1
                R['rounds'] += len(rounds)
                R['rounds_per_dossier'].append(len(rounds))
            for j in tallies:
                R['verdict'][j.get('verdict')] += 1
            # tin hieu REJECT theo vong
            byr = collections.defaultdict(list)
            for j in L:
                byr[j.get('round')].append(j)
            for j in tallies:
                if j.get('verdict') != 'REJECT':
                    continue
                R['reject_rounds'] += 1
                rr = byr.get(j.get('round'), [])
                sig = set()
                for x in rr:
                    k = x.get('kind')
                    ec = x.get('exit_code')
                    if k is None and 'evalId' in x and isinstance(ec, int) and ec != 0 and not x.get('cannot_run') and not x.get('carried_from_round'):
                        sig.add('eval-do (ma hoac thuoc)')
                    if k == 'finding' and x.get('inContract') and x.get('ts') == j.get('ts'):
                        sig.add('finding trong hop dong (ma)')
                    if k in ('vang-mat', 'loai-tac-tu-vang'):
                        sig.add('ha tang (tac tu vang/chet)')
                    if k in ('infra-recheck', 'infra-rerun'):
                        ce = x.get('chay_lai_exit')
                        if isinstance(ce, list) and ce and all(e == 0 for e in ce):
                            sig.add('chap chon (chay lai xanh)')
                        else:
                            sig.add('ha tang (infra-*)')
                    if k == 'thuoc-lech':
                        sig.add('thuoc lech')
                if (j.get('blocked') or 0) > 0 or (j.get('expected') and j.get('returned') is not None and j['returned'] < j['expected']):
                    sig.add('ha tang (blocked/thieu ket qua)')
                for s in sig:
                    R['reject_sig'][s] += 1
                if not sig:
                    R['reject_nosig'] += 1
            for j in L:
                if j.get('kind') == 'repin':
                    R['repin_lines'] += 1
                    if j.get('wall_s'):
                        R['repin_wall_lines'] += 1; R['repin_wall_s'] += j['wall_s']
                if j.get('kind') == 'repin-do':
                    R['repin_do'] += 1
                    if j.get('wall_s'):
                        R['repin_do_wall_s'] += j['wall_s']
            ur = os.path.join(d, 'usage-report.md')
            if os.path.exists(ur):
                txt = open(ur, errors='replace').read()
                for blk in re.split(r'^### S4', txt, flags=re.M)[1:]:
                    R['usage_rounds'] += 1
                    m = re.search(r'\((\d+) agent, ([\d,]+) out-tok\)', blk)
                    if m:
                        R['usage_outtok'].append(int(m.group(2).replace(',', '')))
                    m = re.search(r'^wall: (\d+)s', blk, flags=re.M)
                    if m:
                        R['usage_wall_s'].append(int(m.group(1)))
                    for row in re.finditer(r'^\| (baseline|machine|ui|review|triage|refute|capture|synthesize|judge) \| \d+ \| [\d,]+ \| [\d,]+ \| (\d+) \|', blk, flags=re.M):
                        R['usage_role_s'][row.group(1)] += int(row.group(2))
            R['per'].append(dict(slug=slug, rounds=len(rounds), verdicts=[j.get('verdict') for j in tallies]))
        R['verdict'] = dict(R['verdict']); R['reject_sig'] = dict(R['reject_sig']); R['usage_role_s'] = dict(R['usage_role_s'])
        res[repo] = R
    json.dump(res, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)

if __name__ == '__main__':
    main()
