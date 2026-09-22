#!/usr/bin/env python3
"""Dòng 2 luật (c): lượt gọi người mỗi vòng, TÁCH trong/ngoài thiết kế, đọc từ tin.jsonl (tin_nguoi.py).
Lớp của một tin người:
  G  cổng trong thiết kế — lệnh approve/signoff/observed/start; tin «build»/«Cổng Đáng»; «Duyệt» Gate 1.5 (T3); «Ký»/«tôi ký» đi liền chữ ký (chạm của cùng lượt)
  M  máy hỏi NGOÀI thiết kế — người trả lời một câu máy hỏi (chọn/duyệt phần/A,…/đồng ý theo khuyên/lối N/điền sẵn)
  H  hạ tầng/hệ thống — tin người phải gửi vì máy/harness chết hoặc kẹt (Try again, Dừng, restart, sandbox, đổi máy, Tiếp tục sau sập)
  T  người tự khởi — việc người tự giao (merge, tiến độ, việc mới, /goal, /model): không phải máy gọi
Gán vòng: (kho, thư mục phiên, [bắt đầu, kết thúc) UTC) — bảng CUA_SO dưới đây, suy từ giờ commit hồ sơ và tin mở/đóng vòng."""
import json, re, sys, collections
G = re.compile(r'^(build|Cổng Đáng|build cả|Cổng Đáng|Ký$|Duyệt$|Duyệt kế hoạch|Đồng ý như kiến nghị và tôi ký)', re.I)
M = re.compile(r'^(chọn|duyệt phần|[Aa], |[Đđ]ồng ý|gật|[Ll]ối \d|ổn, đi|Giết PID|Điền sẵn|Review cả|nghỉ cả|sang mục|[a-z]( [a-z])+$)')
H = re.compile(r'(Try again|Dửng nó|Dừng nó|restart|sandbox|docker|đổi tài khoản|đổi máy|[Hh]andoff|mở mạng|^Tiếp tục$|^Tiếp tục (tính năng|sua-luu)|Kiểm tra (các|lại các) agent|gỡ goal|Trả hạ tầng)', re.I)
GATE_CMD = re.compile(r'^acceptance-gate:(approve|signoff|observed|start)\b')
CRM_A = ('zen-brattain-ac74d0', 'goc')
CUA_SO = [  # (vòng, kho, thư mục phiên, từ, tới)
    ('dieu-phoi-30-ngay-dau', 'crm', CRM_A, '2026-09-20T11:00', '2026-09-21T07:45'),
    ('loi-vao-dieu-phoi-30-ngay', 'crm', CRM_A, '2026-09-21T07:45', '2026-09-21T09:30'),
    ('quan-ly-danh-muc-30-ngay', 'crm', CRM_A, '2026-09-21T09:30', '2026-09-21T13:29'),
    ('bang-cot-loi-va-nhan', 'crm', CRM_A, '2026-09-21T13:29', '2026-09-21T13:51'),
    ('noi-bon-nut-dieu-phoi', 'crm', CRM_A, '2026-09-21T13:51', '2026-09-21T15:43'),
    ('sua-luu-tru-dieu-phoi', 'crm', CRM_A, '2026-09-21T22:14', '2026-09-22T00:50'),
    ('khuon-mat-bo-phan', 'crm', CRM_A, '2026-09-22T00:50', '2026-09-22T02:09'),
    ('chi-quan-tri-sua-duoc-truong', 'crm', CRM_A, '2026-09-22T02:09', '2026-09-22T02:59'),
    ('chi-quan-tri-sua-duoc-truong', 'crm', ('zen-brattain-ac74d0',), '2026-09-22T02:59', '2026-09-22T03:19'),
    ('ke-hoach-la-mot-ban-ghi', 'crm', ('goc',), '2026-09-22T02:59', '2026-09-22T07:13'),
    ('moi-phia-deu-thay-ke-hoach (chưa xong)', 'crm', ('goc',), '2026-09-22T07:13', '2026-09-23T00:00'),
    ('khai-lang-gioi-thieu', 'crm', ('mystifying-wiles-84ba51',), '2026-09-21T15:15', '2026-09-21T22:56'),
    ('rollout 2.18.0 + observed ×6 (crm)', 'crm', ('mystifying-wiles-84ba51',), '2026-09-21T14:00', '2026-09-21T15:15'),
    ('đối chứng thuoc-/ho-so-khai-dung-tieng', 'crm', ('busy-chatterjee-fc04e2','thuoc-lat-3a'), '2026-09-18T00:00', '2026-09-21T00:00'),
    ('dieu-phoi-30-ngay-dau (trước 20/09 11:00)', 'crm', CRM_A, '2026-09-19T20:00', '2026-09-20T11:00'),
    ('nhan-trang-thai-va-reality', 'kit', ('zen-edison-7766af',), '2026-09-21T05:00', '2026-09-21T12:29'),
    ('release-2-18-0 + ghim lại', 'kit', ('zen-edison-7766af',), '2026-09-21T12:29', '2026-09-21T22:58'),
    ('ho-so-khep-thoi-hoi', 'kit', ('sweet-lumiere-b79aa8',), '2026-09-21T23:00', '2026-09-22T07:14'),
    ('release-2-18-1', 'kit', ('sweet-lumiere-b79aa8',), '2026-09-22T07:14', '2026-09-22T08:40'),
    ('cài 2.18.1 lên crm (đang chạy)', 'kit', ('sweet-lumiere-b79aa8',), '2026-09-22T08:40', '2026-09-23T00:00'),
]
def lop(r):
    t = r['txt']
    if r['loai'] == 'lenh':
        return 'G' if GATE_CMD.match(t) else 'T'
    if G.search(t): return 'G'
    if M.search(t): return 'M'
    if H.search(t): return 'H'
    return 'T'
rows = [json.loads(l) for l in open(sys.argv[1])]
out = collections.OrderedDict()
for vong, kho, dirs, a, b in CUA_SO:
    d = out.setdefault(vong, {'G': [], 'M': [], 'H': [], 'T': []})
    for r in rows:
        if r['loai'] == 'tu-dong' or r['kho'] != kho or r['dir'] not in dirs or not (a <= r['ts'] < b): continue
        if kho == 'crm' and r['dir'] == 'goc' and r['ses'].startswith('633a'): continue  # phiên tháp thước (đối chứng) chạy ở thư mục gốc
        d[lop(r)].append(r['ts'][5:16] + ' ' + r['txt'][:70])
def luot(xs, gap=10):
    from datetime import datetime
    ts = sorted(datetime.fromisoformat('2026-' + x[:11]) for x in xs); n = 0; prev = None
    for t in ts:
        if prev is None or (t - prev).total_seconds() > gap * 60: n += 1
        prev = t
    return n
for v, d in out.items():
    print(f"{v}: G={len(d['G'])}ch/{luot(d['G'],3)}l  M={len(d['M'])}ch/{luot(d['M'])}l  H={len(d['H'])}ch/{luot(d['H'])}l  T={len(d['T'])}")
    for k in (sys.argv[2] if len(sys.argv)>2 else 'GMH').replace('X',''):
        for x in d[k]: print(f'   {k} {x}')
