---
schema_version: 1
slug: design-gate-khong-do-duoc-ba-nguyen-nhan
feature: Cổng thiết kế của kit trả KHÔNG-ĐO-ĐƯỢC kèm lý do, không REJECT, khi CSS không đọc được, khi nền khai ở tổ tiên bị bỏ qua, hay khi chữ gradient cắt theo chữ
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: FL1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng FL1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626` — chưa có trang: trang nền, trang đợt design-floor-2710
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Cổng thiết kế của kit trả KHÔNG-ĐO-ĐƯỢC kèm lý do, không REJECT, khi CSS không đọc được, khi nền khai ở tổ tiên bị bỏ qua, hay khi chữ gradient cắt theo chữ

Vì sao: Gốc: acceptance-gate-kit/_acceptance/design-gate-che-do-chat/ — cổng thiết kế đã có trạng thái KHÔNG-ĐO-ĐƯỢC cho đích không phải HTML, nhưng đo chéo 26/10 thấy P0 tương phản sai 5/8 lần và lặng lẽ REJECT 3/5 tệp vì ba nguyên nhân. Trang acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Năm P0 sai của đo chéo 26/10, tái lập bằng fixture do mã sinh, đều ra KHÔNG-ĐO-ĐƯỢC đúng lý do; ba ca tương phản thật trên CSS đọc được vẫn REJECT; ba đột biến gỡ từng nhánh đỏ đúng ca» chưa?
- Kết quả nào là SỐNG: [đề xuất] Năm P0 sai của đo chéo 26/10, tái lập bằng fixture do mã sinh, đều ra KHÔNG-ĐO-ĐƯỢC đúng lý do; ba ca tương phản thật trên CSS đọc được vẫn REJECT; ba đột biến gỡ từng nhánh đỏ đúng ca
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Năm P0 sai của đo chéo 26/10, tái lập bằng fixture do mã sinh, đều ra KHÔNG-ĐO-ĐƯỢC đúng lý do; ba ca tương phản thật trên CSS đọc được vẫn REJECT; ba đột biến gỡ từng nhánh đỏ đúng ca» khi hết timebox
- Timebox: [đề xuất] hết 29/10/2026 — ước ~4 giờ máy (một lượt chấm S4 + đường nền), ~3 % hạn mức tuần.

## Đếm trước khi sửa (máy, 27/10)

Ba kho tiêu thụ có 37 eval cổng thiết kế chạy chế độ dom (crm 3 · artifact-platform 23 · onehub-invest 11), tất cả
đã ký. Hôm nay **0 eval nào đang REJECT** vì ba nguyên nhân; không kho nào dựa vào các REJECT ấy để chặn thật.

- Lịch sử có **2 REJECT sai** đúng lớp này, cả hai ở crm lượt 1, cả hai đã được kho tự né: `cua-vao-noi-tieng-viet`
  E16 (chữ trắng trên trắng 1,0:1 vì màu nền viết bằng biến CSS không giải được; trình duyệt thật đo 14,96:1) và
  `tong-quan-va-khung-noi-tieng-viet` E18 (cùng hình dạng; kho viết lại bộ chấm để LỌC BỎ hẳn `low-contrast`).
- **1 REJECT đúng** phải giữ: artifact-platform `core-dispatch-k9` E8 lượt 1 (chữ #8a887f trên trắng 3,6:1), kho sửa vật.
- Ràng buộc đã biết: bộ chấm E20 của crm đòi đúng chữ `PASS`, nên trang CSS không đọc được mà KHÔNG có phát hiện tương
  phản nào phải giữ nguyên `PASS` — đổi nó thành KHÔNG-ĐO-ĐƯỢC là đổi mặc định, mọi kho trả giá.

Tái lập đo chéo 26/10 bằng bản kit hiện hành: đúng 8 lần báo P0 tương phản, 5 sai trên 3 tệp (f01 · hyper-gloss ·
jang). Cơ chế đo lại khác lời tóm ở trang tri thức ở hai chỗ: hyper-gloss sai vì **chữ gradient** (tô trong suốt), không
phải vì nền body; jang sai vì **nền khai ở body** (`background: var(--bg)`) bị bỏ, trang ấy đồng thời có tệp CSS không
phân tích được. Ba nguyên nhân vẫn đủ cả ba; một trang có thể mang hai.
