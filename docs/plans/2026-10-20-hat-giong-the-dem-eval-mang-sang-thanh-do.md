# Hạt giống KY2 — thẻ Cổng Bằng chứng đếm eval mang sang thành chưa đạt

Gốc: `crm-onehub/_acceptance/sua-sau-chay-that/` — tái hiện ở tệp `evidence/the-dem-sai-tai-hien.md` của hồ sơ ấy (M5
báo 19/10). Ô ghi hạt giống này: `_acceptance/release-2-33-1/` (hồ sơ mốc 2.33.1 trích lại tên tệp ở `## Notes`).

## Người dùng gặp gì

Ở một lượt chấm có eval mang sang từ lượt trước, bảng eval của báo cáo ghi ô phán quyết kèm hậu tố, dạng «PASS
(carried…)». Thẻ Cổng Bằng chứng đếm mọi ô ấy là chưa đạt: M5 tái hiện trên một hồ sơ thật — thẻ báo 8 eval đỏ, thật chỉ
có 2. Người ký đọc một con số sai ở đúng chỗ phải quyết, và mất thời gian đối chiếu tay với báo cáo.

## Đọc mã (kit, `main` b9090673)

- `scripts/gate-card.js:1035` — bộ đọc bảng lấy NGUYÊN ô phán quyết rồi viết hoa: «PASS (carried…)» thành «PASS
  (CARRIED…)».
- `scripts/gate-card.js:1095` — đếm đạt bằng `r.verdict === 'PASS'`: ô có hậu tố không bao giờ đạt.
- `scripts/gate-card.js:1262` — liệt eval hỏng bằng `r.verdict !== 'PASS'`: ô có hậu tố vào danh sách đỏ.

Chưa đo: bên viết hậu tố (bộ tổng hợp của lượt chấm, hay phiên viết lại báo cáo) và số kho đang ghi dạng này.

## Ngưỡng mở ô

≥ 1 lần nữa thẻ Cổng Bằng chứng ở một kho báo số eval đỏ khác số eval đỏ của báo cáo, vì hậu tố sau chữ PASS.
