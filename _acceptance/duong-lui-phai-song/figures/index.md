# Hình tại điểm quyết định — duong-lui-phai-song (Cổng Phạm vi, T3)

Kê từ artifact cuối S1 (sổ quyết định 9001–9008, Coverage, gap-probe). Ngưỡng N5: từ ba bước
nối tiếp hoặc từ hai nhánh rẽ → cần hình.

| Điểm quyết định | Đếm | Hình |
|---|---|---|
| 9001 — một vòng T3 cho cả năm mục, đường cắt khai trước (bỏ lát 1 nếu chạm trần) | 2 nhánh (đi trọn · cắt lát 1) × 3 bước chấm | `01-mot-vong-hai-lat.svg` |
| 9003 — lệnh ký: làn máy TRƯỚC commit, ghim lại CÙNG lượt khi hoá cũ (AC-4, AC-5) | 4 bước nối tiếp (7a→7b→7c→8) + 2 nhánh (làn đỏ · hoá cũ) | `02-lenh-ky-lan-truoc.svg` |
| 9002 — đường ghi ô kết là script tự kiểm (AC-8, AC-9) + veto có tay nắm (AC-6) — hai cửa của người | 2 nhánh mỗi cửa (đủ điều kiện · không; veto · để yên) | `03-hai-cua-cua-nguoi.svg` |
| 9004 — chế độ nghiêm: không chạy được là vi phạm; làn V bị kiểm hoá cũ (AC-1, AC-2) | 3 đường không chạy được × 2 chế độ; nhánh xanh-sạch có kiểm stale | `04-hai-cua-cua-may.svg` |
| 9005/9006 — hai descope (thuế định tuyến kit-only · mục rỗng ở bước tổng hợp) | dưới ngưỡng: 1 nhánh mỗi entry (không làm) | — |
| 9007/9008 — bỏ đặc-tả-UX, bỏ design-pass | dưới ngưỡng: không có nhánh (vòng không chạm giao diện) | — |
| Coverage: 0 dòng `[GIẢ ĐỊNH]` | dưới ngưỡng: 0 | — |

## Đề bài từng hình (≤5 dòng)

### 01-mot-vong-hai-lat
Loại: sơ đồ luồng có nhánh. Nút: «Cổng Phạm vi» → «S3: (e)(c)(d)(d′)» → «S3: (a)(b)» → «S4 chấm
(≤3 vòng)» → {«PASS → Cổng Bằng chứng» | «chạm trần → thu phạm vi: ship lát 2, bỏ lát 1»}. Nhãn bằng
chữ: «lát 2 làm trước vì đau đã đo (5 CI đỏ, 1 hồ sơ mục rỗng, bế tắc làn)». AC liên quan: tất cả;
đường cắt = Out of scope.

### 02-lenh-ky-lan-truoc
Loại: sơ đồ trình tự bốn bước. Nút: «7a ghi trường người» → «7b làn máy trên cây làm việc (không
ghi)» → {đỏ: «KHÔNG commit, in dòng đỏ, dừng» | xanh: «7c commit chữ ký + file làn đòi»} → «8 lưới
trước-merge» → {stale chính slug: «làn ghim lại --write, commit, lưới lại» | sạch} → «READY (0
violation) → S5 push». Chú thích: hôm nay bước 7 commit trước, bước 8 soi sau → 5 CI đỏ hai mốc. AC-4, AC-5.

### 03-hai-cua-cua-nguoi
Loại: hai luồng cạnh nhau. Trái (ô kết): «S4 PASS» → «khong-can-nguoi --write» → {đủ 6 điều kiện + T2:
«status: machine-cleared» (tự kiểm cùng luật lưới ghi) | thiếu: «exit 2 nêu điều kiện, không ghi»}.
Phải (veto): «lời mời cổng in ‹veto hay để yên›» → {«veto: lý do» → «da-veto + sổ + commit, máy dừng,
lưới chặn» | «để yên» → «không làm gì, cửa vẫn mở»}. AC-6..AC-9.

### 04-hai-cua-cua-may
Loại: hai bảng-luồng. Trái (soi lại): ba đường không chạy được (script vắng · node vắng · exit 2) ×
{strict: VIOLATION có tên đường | warn: NOTE}. Phải (làn V): «hồ sơ xanh-sạch trong diff» → «có file mã
đổi sau verified_commit?» → {có: VIOLATION «làn V — evidence is stale» | không: NOTE xanh-sạch, đi tiếp};
ghi chú h1: ranh tiêu đề về #{2,6}. AC-1..AC-3.
