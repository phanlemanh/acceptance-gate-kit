#!/usr/bin/env python3
"""Năm dòng số luật (c) — dòng 1, 3, 4, 5 — đọc từ VẬT máy ghi của một hồ sơ ở một ref.
Dùng: nam_dong.py <repo> <ref> <slug>[,<slug>...]   → in một dòng JSON mỗi hồ sơ.
Dòng 1: commit đầu đưa contract sang `status: implemented` → commit quyết đầu tiên (Gate 2 signoff | machine-cleared | observed);
        kèm «PASS cuối → quyết» (round-tally PASS cuối trước quyết).
Dòng 3: round-tally KHÔNG tính dòng kind:repin; đếm BLOCKED và vang-mat.
Dòng 4–5: usage-report.md — mỗi lượt: tổng token (out+in+cache_read+cache_create), out theo ba khối, wall, đường găng.
"""
import json, re, subprocess, sys
from datetime import datetime

def git(repo, *a):
    return subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True).stdout

def show(repo, ref, path):
    r = subprocess.run(['git', '-C', repo, 'show', f'{ref}:{path}'], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None

def ts(s):
    return datetime.fromisoformat(s.replace('Z', '+00:00'))

PROOF = ('machine', 'baseline', 'ui', 'judge', 'panel', 'ui-check', 'observe')
FIND = ('review', 'triage', 'refute', 'finder')
SYNTH = ('capture', 'synthesize', 'synth')

def khoi(role):
    r = role.split(':')[0].strip().lower()
    if r.startswith(PROOF): return 'vat'
    if r.startswith(FIND): return 'tim'
    if r.startswith(SYNTH): return 'tong'
    return 'khac'

def num(x):
    return int(x.replace(',', '').replace('.', '') or 0)

def usage(text):
    out = []
    for blk in re.split(r'^### ', text, flags=re.M)[1:]:
        head = blk.split('\n', 1)[0]
        rd = {'lượt': head[:60], 'tong_token': 0, 'tok_moi': 0, 'cache_read': 0, 'out': {'vat': 0, 'tim': 0, 'tong': 0, 'khac': 0}, 'wall_s': None, 'gang': None}
        m = re.search(r'^wall:\s*(\d+)s', blk, re.M)
        if m: rd['wall_s'] = int(m.group(1))
        for mm in re.finditer(r'^- \*\*[^*]+\*\*: .*?out ([\d,]+) · in ([\d,]+) · cache_read ([\d,]+) · cache_create ([\d,]+)', blk, re.M):
            g=[num(x) for x in mm.groups()]; rd['tong_token'] += sum(g); rd['tok_moi'] += g[0]+g[1]+g[3]; rd['cache_read'] += g[2]
        # bảng vai trò: | vai | agents | out | cache_read | wall s | bắt đầu | kết thúc |
        vt = re.search(r'^\| vai tro .*?\n\|[-|: ]+\n((?:\|.*\n)+)', blk, re.M)
        best = (0, None)
        if vt:
            for row in vt.group(1).strip().split('\n'):
                c = [x.strip() for x in row.strip('|').split('|')]
                if len(c) < 5: continue
                rd['out'][khoi(c[0])] += num(c[2])
                w = num(c[4]); best = max(best, (w, c[0]))
            rd['gang'] = f'{best[1]} {best[0]}s' if best[1] else None
        else:
            rd['out'] = None
        out.append(rd)
    return out

def one(repo, ref, slug):
    p = f'_acceptance/{slug}'
    res = {'slug': slug, 'ref': ref}
    c = show(repo, ref, f'{p}/contract.md')
    if c is None:
        return {**res, 'loi': 'không có contract ở ref'}
    m = re.search(r'^status:\s*(\S+)', c, re.M); res['status'] = m.group(1) if m else None
    m = re.search(r'^risk_tier:\s*(\S+)', c, re.M); res['tier'] = m.group(1) if m else None
    log = git(repo, 'log', ref, '--reverse', '--format=%H\t%aI\t%s', '--', f'{p}/contract.md').strip().split('\n')
    impl = dec = ver = None; prev = None
    for line in log:
        if not line: continue
        h, t, s = line.split('\t', 2)
        if impl is None:
            body = show(repo, h, f'{p}/contract.md') or ''
            if re.search(r'^status:\s*implemented', body, re.M): impl = (h[:8], t, s[:70])
        if dec is None:
            body2 = show(repo, h, f'{p}/contract.md') or ''
            mm = re.search(r'^status:\s*(\S+)', body2, re.M); st = mm.group(1) if mm else None
            if st in ('verified', 'machine-cleared') and prev != st: ver = (h[:8], t)
            prev = st
        if dec is None and re.match(r'(Gate 2 signoff|observed:|.*machine-cleared)', s):
            dec = (h[:8], t, s[:70])
    res['implemented'] = impl; res['quyet'] = dec
    if ver and dec: res['verified_toi_quyet_phut'] = round((ts(dec[1]) - ts(ver[1])).total_seconds() / 60)
    if impl and dec:
        res['d1_phut'] = round((ts(dec[1]) - ts(impl[1])).total_seconds() / 60)
    rl = show(repo, ref, f'{p}/run-log.jsonl') or ''
    tallies, vang, repin = [], 0, 0
    for l in rl.splitlines():
        try: r = json.loads(l)
        except Exception: continue
        k = r.get('kind')
        if k == 'repin': repin += 1; continue
        if k == 'vang-mat': vang += 1
        if k == 'round-tally': tallies.append((r.get('ts'), r.get('verdict')))
    res['luot_cham'] = len(tallies); res['verdicts'] = [v for _, v in tallies]
    res['blocked'] = sum(1 for _, v in tallies if v == 'BLOCKED'); res['vang_mat'] = vang; res['repin_bo'] = repin
    if dec:
        pas = [t for t, v in tallies if v == 'PASS' and t and ts(t) <= ts(dec[1])]
        if pas: res['pass_cuoi_toi_quyet_phut'] = round((ts(dec[1]) - ts(pas[-1])).total_seconds() / 60)
    u = show(repo, ref, f'{p}/usage-report.md')
    res['usage'] = usage(u) if u else 'không đo được — không có usage-report.md'
    return res

if __name__ == '__main__':
    repo, ref = sys.argv[1], sys.argv[2]
    for s in sys.argv[3].split(','):
        print(json.dumps(one(repo, ref, s), ensure_ascii=False))
