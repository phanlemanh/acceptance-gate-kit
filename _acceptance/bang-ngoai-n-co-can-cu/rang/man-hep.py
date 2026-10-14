#!/usr/bin/env python3
"""Răng màn hẹp của hồ sơ bang-ngoai-n-co-can-cu (AC-6, eval E6).

Dựng thẻ Cổng 2 bằng scripts/gate-card.js của CÂY cho một hồ sơ thử mười mục ngoài hợp đồng (căn cứ dài),
mở bằng Chromium không đầu ở 320 px và 1280 px, đo:
  - 320 px: trang không cuộn ngang; bốn ô của mỗi hàng xếp chồng (top tăng dần)
  - 1280 px: bốn ô của mỗi hàng cùng một dòng (cùng top)
Chiều đỏ trong cùng lượt: bản sao cây (git archive HEAD scripts lib) gỡ luật màn hẹp → 320 px cuộn ngang.

Thoát 0 xanh · 1 đo sai · 2 không đọc được ở đây (thiếu playwright / chromium / node).
Mọi đường dẫn suy từ vị trí tệp này. KHÔNG vào feature_loop.suite_keys (CI không có trình duyệt).
"""
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
try:
    from playwright.sync_api import sync_playwright
except Exception:
    print('không đọc được ở đây: playwright')
    sys.exit(2)

TMP = tempfile.mkdtemp(prefix='man-hep-')
CC = ('Lộ tiêu đề việc riêng cho người không được xem trong danh sách việc con, mức nặng; người dùng không tự gỡ '
      'được và sửa sau sẽ đắt hơn vì phải đổi luật ai thấy gì.')


def ghi(rel, s, goc=None):
    p = os.path.join(goc or KHO, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(s)


def khuon():
    src = open(os.path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), encoding='utf-8').read()
    m = re.search(r'<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>', src)
    if not m:
        print('FAIL: không rút được OOC-ITEM-TEMPLATE')
        sys.exit(1)
    return m.group(1).replace('\\n', '\n').replace('\\`', '`')


KHO = os.path.join(TMP, 'kho')
ghi('_acceptance/config.yaml', 'schema_version: 1\n')
ghi('_acceptance/demo/contract.md', '---\nschema_version: 1\nfeature: Thử màn hẹp\nslug: demo\nrisk_tier: T2\n'
    'status: verified\n---\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n')
ghi('_acceptance/demo/evidence-report.md', '---\nslug: demo\nround: 1\nverdict: PASS\nenforcement_mode: strict\n'
    'bypass_used: false\n---\n\n## Results\n\n- eval: E1\n  run_id: r1\n  exit_code: 0\n'
    '  verifier: config:executors.test.unit\n  verified_at: 2026-10-14T00:00:00Z\n')
tpl = khuon()
de_xuat = ['new-contract', 'known-limits', 'wont-fix']
muc = []
for i in range(10):
    v = {'title': 'muc %d' % (i + 1), 'plain': 'Người dùng mở khung việc thì mục Việc con biến mất mà không báo lỗi gì, '
         'dễ tưởng việc này không có việc con (mục %d).' % (i + 1), 'can_cu': CC, 'file': 'src/x.ts', 'severity': 'low',
         'proposal': de_xuat[i % 3]}
    muc.append(re.sub(r'\{(\w+)\}', lambda m: v.get(m.group(1), ''), tpl))
ghi('_acceptance/demo/review-findings.md', '# R\n\n## Ngoài hợp đồng — người quyết ở Gate 2\n\n' + '\n'.join(muc) + '\n')


def the(goc):
    try:
        r = subprocess.run(['node', os.path.join(goc, 'scripts', 'gate-card.js'), '--root', KHO, '--slug', 'demo'],
                           capture_output=True, text=True, timeout=120)
    except FileNotFoundError:
        print('không đọc được ở đây: node')
        sys.exit(2)
    if r.returncode != 0:
        print('FAIL: gate-card thoát %d: %s' % (r.returncode, r.stderr[:300]))
        sys.exit(1)
    p = os.path.join(TMP, 'the-%d.html' % abs(hash(goc)))
    with open(p, 'w', encoding='utf-8') as f:
        f.write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'
                '<body style="margin:0;padding:16px">' + r.stdout)
    return p


DO = '''() => {
  const de = document.documentElement;
  const hang = [...document.querySelectorAll('table.ngoai tbody tr:not(.nhom)')];
  const tops = hang.map(tr => [...tr.querySelectorAll('td')].map(td => Math.round(td.getBoundingClientRect().top)));
  return { sw: de.scrollWidth, cw: de.clientWidth, tops };
}'''


def do(p, b, rong):
    pg = b.new_page(viewport={'width': rong, 'height': 800})
    pg.goto('file://' + p)
    kq = pg.evaluate(DO)
    pg.close()
    return kq


# Bản sao cây gỡ luật màn hẹp (nhát tiêm khớp đúng một lần).
SAO = os.path.join(TMP, 'sao')
os.makedirs(SAO)
subprocess.run('git -C "%s" archive HEAD scripts lib feature-loop commands skills | tar -x -C "%s"' % (ROOT, SAO),
               shell=True, check=True)
# Bản sao phải là CÂY đang kiểm, không phải HEAD: chép đè gate-card.js của cây (có thể chưa commit).
gc_cay = open(os.path.join(ROOT, 'scripts', 'gate-card.js'), encoding='utf-8').read()
khop = re.findall(r'@media \(max-width:560px\)\{[^\n]*\}\}', gc_cay)
if len(khop) != 1:
    print('FAIL: nhát tiêm luật màn hẹp khớp %d lần (phải 1)' % len(khop))
    sys.exit(1)
with open(os.path.join(SAO, 'scripts', 'gate-card.js'), 'w', encoding='utf-8') as f:
    f.write(gc_cay.replace(khop[0], ''))

loi = []
try:
    with sync_playwright() as pw:
        try:
            b = pw.chromium.launch()
        except Exception as e:
            print('không đọc được ở đây: chromium (%s)' % str(e).splitlines()[0])
            sys.exit(2)
        p_cay = the(ROOT)
        h = do(p_cay, b, 320)
        n = len(h['tops'])
        xep = sum(1 for t in h['tops'] if len(t) == 4 and all(t[i] < t[i + 1] for i in range(3)))
        cuon = 1 if h['sw'] > h['cw'] else 0
        print('man-hep 320: cuon-ngang=%d xep-chong=%d/%d' % (cuon, xep, n))
        if n != 10 or cuon or xep != n:
            loi.append('320 px: %d hàng, cuộn ngang=%d (scrollWidth %d > %d), xếp chồng %d' % (n, cuon, h['sw'], h['cw'], xep))
        r = do(p_cay, b, 1280)
        cung = sum(1 for t in r['tops'] if len(t) == 4 and len(set(t)) == 1)
        print('man-hep 1280: cung-dong=%d/%d' % (cung, len(r['tops'])))
        if len(r['tops']) != 10 or cung != 10:
            loi.append('1280 px: cùng dòng %d/%d' % (cung, len(r['tops'])))
        # Chiều đỏ — chỉ tin khi chiều xanh ở trên đã đúng.
        # Gỡ luật màn hẹp: bảng co lại và chữ tự xuống dòng (không cuộn ngang — đo 14/10), cái mất là xếp chồng:
        # bốn ô bị ép thành bốn cột ~70 px. Tín hiệu đỏ vì thế là «không xếp chồng ở 320».
        d = do(the(SAO), b, 320)
        xep_d = sum(1 for t in d['tops'] if len(t) == 4 and all(t[i] < t[i + 1] for i in range(3)))
        if xep_d == 0 and len(d['tops']) == 10:
            print('do OK: khong xep chong o 320 (0/10)')
        else:
            loi.append('chiều đỏ không đỏ: gỡ luật màn hẹp mà 320 px vẫn xếp chồng %d/%d' % (xep_d, len(d['tops'])))
        b.close()
finally:
    subprocess.run(['rm', '-rf', TMP])

if loi:
    for x in loi:
        print('FAIL: ' + x)
    sys.exit(1)
print('man-hep: PASS')
