#!/usr/bin/env python3
"""Sinh hai hình cho docs/findings/2026-09-22-tong-ket-cach-moi-cua-so-2-18.md.
Hình là CHIẾU của hai bảng chữ trong bản ấy (§2 dòng 1, §3 dòng 2) — số chép từ bảng, sửa ở bảng rồi chạy lại.
Chạy: python3 ve_hinh.py  (ghi hai tệp .html cạnh script)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PAPER, INK, MUTED, SOFT, RULE, ACCENT = '#f5f5f5', '#2d3142', '#4f5d75', '#636b80', 'rgba(45,49,66,0.12)', '#eb6c36'
SEG = {  # tên lớp: (fill, stroke, chữ)
    'G': ('rgba(45,49,66,0.14)', INK, 'Cổng trong thiết kế'),
    'M': ('rgba(235,108,54,0.14)', ACCENT, 'Máy hỏi ngoài thiết kế'),
    'H': ('rgba(79,93,117,0.05)', SOFT, 'Hạ tầng / hệ thống sập'),
    'may': ('rgba(79,93,117,0.14)', MUTED, 'Máy: code xong → bằng chứng xong'),
    'nguoi': ('rgba(235,108,54,0.14)', ACCENT, 'Người: bằng chứng xong → quyết'),
}
# §3 bảng dòng 2 — chạm (tin người) theo lớp
DONG2 = [
    ('Đối chứng: tháp thước (18–20/09)', {'G': 6, 'M': 6, 'H': 3}),
    ('dieu-phoi-30-ngay-dau · T3', {'G': 3, 'M': 9, 'H': 4}),
    ('sua-luu-tru-dieu-phoi · T3', {'G': 4, 'M': 8, 'H': 0}),
    ('ke-hoach-la-mot-ban-ghi · T3', {'G': 3, 'M': 7, 'H': 0}),
    ('chi-quan-tri-sua-duoc-truong · T3', {'G': 3, 'M': 0, 'H': 0}),
    ('Sáu vòng crm T2 còn lại (gộp)', {'G': 12, 'M': 6, 'H': 6}),
    ('kit nhan-trang-thai-va-reality · T3', {'G': 4, 'M': 0, 'H': 3}),
    ('kit ho-so-khep-thoi-hoi · T3', {'G': 4, 'M': 0, 'H': 7}),
]
# §2 bảng dòng 1 — phút: (code xong→bằng chứng xong, bằng chứng xong→quyết)
DONG1 = [
    ('Đối chứng: thuoc-khai-dung-tieng', (1485 - 48, 48)),
    ('dieu-phoi-30-ngay-dau', (1150 - 9, 9)),
    ('quan-ly-danh-muc-30-ngay', (93 - 42, 42)),
    ('noi-bon-nut-dieu-phoi', (63 - 13, 13)),
    ('ke-hoach-la-mot-ban-ghi', (45 - 6, 6)),
    ('sua-luu-tru-dieu-phoi', (39 - 11, 11)),
    ('kit nhan-trang-thai-va-reality', (211 - 41, 41)),
    ('kit ho-so-khep-thoi-hoi', (232 - 19, 19)),
]
X0, W, PITCH, Y0 = 320, 560, 44, 72
def rect(x, y, w, key):
    f, s, _ = SEG[key]
    return (f'<rect x="{x}" y="{y}" width="{w}" height="20" fill="{PAPER}"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="20" rx="2" fill="{f}" stroke="{s}" stroke-width="1"/>')
def txt(x, y, s, size=12, fill=INK, mono=False, anchor='start', weight=400):
    fam = "'Geist Mono', monospace" if mono else "'Geist', sans-serif"
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-family="{fam}" text-anchor="{anchor}" font-weight="{weight}">{s}</text>'
def page(title, eyebrow, svg, notes):
    return f'''<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist:wght@400;600&family=Geist+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>*{{box-sizing:border-box;margin:0;padding:0}}body{{font-family:'Geist',sans-serif;background:{PAPER};color:{INK};padding:3rem 2rem}}
.frame{{max-width:1100px;margin:0 auto}}.eyebrow{{font-family:'Geist Mono',monospace;font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;color:{MUTED};margin-bottom:.5rem}}
h1{{font-family:'Instrument Serif',serif;font-size:2rem;font-weight:400;margin-bottom:1.5rem}}svg{{width:100%;min-width:760px;display:block}}
ul{{margin:1.25rem 0 0 1.1rem;font-size:.9rem;line-height:1.55;color:{MUTED}}}footer{{margin-top:1.5rem;padding-top:.75rem;border-top:1px solid {RULE};font-family:'Geist Mono',monospace;font-size:.7rem;color:{SOFT}}}</style>
</head><body><div class="frame"><p class="eyebrow">{eyebrow}</p><h1>{title}</h1>
{svg}
<ul>{''.join(f'<li>{n}</li>' for n in notes)}</ul>
<footer>Nguồn chữ: docs/findings/2026-09-22-tong-ket-cach-moi-cua-so-2-18.md · sinh bởi ve_hinh.py cạnh tệp này — sửa bảng ở nguồn rồi chạy lại, không sửa tay hình.</footer>
</div></body></html>'''
def legend(y, keys):
    out = [f'<line x1="40" y1="{y}" x2="960" y2="{y}" stroke="{RULE}" stroke-width="0.8"/>', txt(40, y + 24, 'CHÚ GIẢI', 8, MUTED, True)]
    x = 140
    for k in keys:
        f, s, name = SEG[k]
        out.append(f'<rect x="{x}" y="{y + 12}" width="20" height="16" rx="2" fill="{f}" stroke="{s}"/>')
        out.append(txt(x + 28, y + 24, name, 11, INK))
        x += 260
    return ''.join(out)
def hinh1():
    mx = max(sum(v.values()) for _, v in DONG2); scale = W / mx
    parts = [f'<rect width="100%" height="100%" fill="{PAPER}"/>', txt(X0, 52, 'SỐ TIN NGƯỜI (CHẠM) TRONG CỬA SỔ VÒNG', 8, MUTED, True)]
    for i, (name, v) in enumerate(DONG2):
        y = Y0 + i * PITCH; x = X0
        parts.append(txt(40, y + 14, name, 12, INK, weight=600 if i == 0 else 400))
        for k in 'GMH':
            if v[k]:
                w = round(v[k] * scale / 4) * 4
                parts.append(rect(x, y, w, k))
                parts.append(txt(x + w / 2, y + 14, v[k], 9, SEG[k][1], True, 'middle', 600))
                x += w
        parts.append(txt(x + 12, y + 14, f'= {sum(v.values())}', 9, MUTED, True))
    ly = Y0 + len(DONG2) * PITCH + 8
    parts.append(legend(ly, 'GMH'))
    svg = f'<svg viewBox="0 0 1000 {ly + 48}" xmlns="http://www.w3.org/2000/svg">{"".join(parts)}</svg>'
    notes = ['Hàng trên cùng là nhóm đối chứng — hai vòng tháp thước chạy theo cách cũ.',
             'Khối cam là câu máy hỏi giữa vòng: ở ba vòng crm T3 nó lớn hơn khối cổng thiết kế; 28 câu trả lời trong cửa sổ không câu nào chọn khác khuyến nghị.',
             'Khối nhạt là tin người phải gửi vì máy hay harness sập («Try again», «Dừng nó», đổi máy) — hai vòng kit mang phần lớn khối này.',
             'Không tính tin người tự khởi (gộp PR, hỏi tiến độ, giao việc mới): máy không gọi những tin ấy.']
    open(os.path.join(HERE, 'luot-goi-nguoi-theo-lop.html'), 'w').write(page('Lượt gọi người theo lớp — cửa sổ 2.18', 'Hình 1 · tổng kết cách mới', svg, notes))
def hinh2():
    parts = [f'<rect width="100%" height="100%" fill="{PAPER}"/>', txt(X0, 52, 'TỈ LỆ TRONG TỔNG PHÚT · CODE XONG → QUYẾT (TỔNG Ở BÊN PHẢI)', 8, MUTED, True)]
    for i, (name, (m, n)) in enumerate(DONG1):
        y = Y0 + i * PITCH; T = m + n
        parts.append(txt(40, y + 14, name, 12, INK, weight=600 if i == 0 else 400))
        wm = round(m / T * W / 4) * 4; wn = max(8, W - wm); wm = W - wn
        parts.append(rect(X0, y, wm, 'may')); parts.append(rect(X0 + wm, y, wn, 'nguoi'))
        parts.append(txt(X0 + wm / 2, y + 14, f'{m} ph', 9, MUTED, True, 'middle', 600))
        parts.append(txt(X0 + W + 12, y + 14, f'người {n} ph · tổng {T} ph', 9, INK, True))
    ly = Y0 + len(DONG1) * PITCH + 8
    parts.append(legend(ly, ['may', 'nguoi']))
    svg = f'<svg viewBox="0 0 1000 {ly + 48}" xmlns="http://www.w3.org/2000/svg">{"".join(parts)}</svg>'
    notes = ['Mỗi hàng chuẩn hoá về 100 % tổng phút của chính vòng ấy; tổng thật in bên phải — hai vòng dài nhất (1 485 và 1 150 phút) là hai vòng có lượt chấm bị đốt.',
             'Đoạn cam — người đọc bằng chứng rồi quyết — là phần nhỏ ở mọi vòng mới: trung vị 7,5 phút ở mười vòng crm.',
             'Đoạn xám là máy: lượt chấm S4, kể cả lượt bị hạ tầng đốt. Chỗ cắt thời gian nằm ở đây, không nằm ở cổng.']
    open(os.path.join(HERE, 'thoi-gian-lam-xong-quyet-duoc.html'), 'w').write(page('Code xong → quyết được: máy hay người?', 'Hình 2 · tổng kết cách mới', svg, notes))
hinh1(); hinh2()
