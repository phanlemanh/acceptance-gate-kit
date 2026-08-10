---
slug: khoi-viec-cua-anh
at: 2026-08-10T15:20:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Gap-probe: khoi-viec-cua-anh

Critic context sạch, input 4 artifact + claims xuyên feature (input 5, có
claim). Toàn bộ finding là lỗ đo-lường trong phạm vi đã chốt; không lật quyết
định ledger nào. Đã định đoạt one-pass: cả 5 sửa thẳng vào evals.yaml/design
doc trước Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E4 ghim cùng dòng `PASS: P186` với E2, không khai chiều đỏ riêng cho nhánh PASS-thuần-máy — pin không định danh nhánh, trái luật tổng-kết-phải-kèm-số-ca | Người thi công viết P186 chỉ với fixture 4-loại, quên nhánh rỗng-việc-người; suite vẫn in `PASS: P186`, E4 xanh trong khi AC-4 chưa từng chạy | Tách dòng PASS riêng cho nhánh rỗng kèm mutant gỡ mục ký | fixed: E4 đổi pin sang `PASS: P186b` + mutant riêng trên fixture rỗng |
| P1 | evals | Fixture chỉ phủ tập con nhánh Given: AC-1 khai draft HOẶC approved nhưng E1 chỉ dựng draft; AC-3 khai REJECT/BLOCKED/verdict lạ nhưng E3 chỉ dựng hai nhánh đầu — cùng lớp [stale-theo-diff-pr#F1] | gate-card.js rẽ theo status/verdict chỉ xử nhánh có fixture; hồ sơ approved hoặc verdict lạ render thẻ KHÔNG có khối mà mọi eval vẫn xanh | Mỗi nhánh Given một lượt render ghim cùng chuỗi | fixed: E1 thêm nhánh approved; E3 thêm nhánh verdict lạ |
| P1 | evals | AC-7 phán cả khuôn lời-mời nhưng inputs E7 chỉ có 3 thẻ HTML — nửa khuôn không có vật cho judge đọc | Judge chấm 3 thẻ đạt → PASS trọn AC-7 trong khi khuôn tự nó khó hiểu hoặc chứa câu tu từ mang dấu hỏi; Cổng 2 ký với nửa AC-7 chưa chấm | Thêm bản luật vào inputs + ý hỏi tương ứng | fixed: E7 thêm input human-facing-language.md + ý hỏi thứ năm |
| P2 | evals | Vế vị trí của AC-1 (cuối thẻ, trước hàng nút) không có assert quan hệ — E1 ghim chuỗi-có-mặt trong khi lời hứa là quan hệ thứ tự | Khối render đầu thẻ hoặc sau hàng nút; grep chuỗi vẫn xanh; owner vẫn sót lời-gọi — tái diễn đúng sự cố tick-park trong đề bài | Assert offset: khối sau thân thẻ, trước `.foot` | fixed: E1 thêm assert quan hệ vị trí |
| P2 | evals | Chuẩn «Trả lời mẫu gộp MỘT dòng» chưa thao-tác-hoá cho HTML — ghim nhãn và mã rời rạc, không assert cùng một dòng không ngắt | Renderer chèn `<br>`/tách `li`; grep từng chuỗi vẫn trúng; owner không chép-một-phát được câu trả-lời-gộp — mất giá trị chuẩn khối số 2 | Assert MỘT dòng text sau strip tag inline, không thẻ block/br chen giữa | fixed: E1 + E2 thêm assert một-dòng |
