---
slug: baseline-tran-bo-qua-don
at: 2026-10-08T04:35:32Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Gap-probe — baseline-tran-bo-qua-don

Phản biện context sạch (tác tử con chỉ đọc contract.md, evals.yaml, khoá executor btbd_* và tệp claim-scan).
Không có design doc, decisions.jsonl hay opportunity.md cho hồ sơ này. Chạy sau khi vật đã có (vòng sửa
lỗi hạ tầng do owner giao thẳng); mọi mục sửa bằng ca đo mới trong cùng tệp ca, không đổi hành vi.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Không ghim quan hệ trần tổng + trần lệnh với trần 600 s của công cụ | Đổi TRAN_TONG lên 900 thì công cụ cắt ở 600 s trước khi het-tran-tong kịp phát, cả làn BLOCKED mà BH5 vẫn xanh | Rút hai trần từ prompt, assert tổng + biên dọn < 600 | fixed: ca BH7 (trần tổng + 15 < timeout trong prompt, trần lệnh ≤ trần tổng); lý do qua-tran đã lấy số từ dòng dấu do lệnh phát, không từ hằng |
| P1 | contract | AC-2 không nói tiến trình treo nằm ở tầng nào | Lính canh chỉ giết pid con thì cháu (lệnh thật bun run test bọc shell) sống, giữ tài nguyên | Ca có cháu ngủ + mutant giết pid con | fixed: fixture BT dùng bash t/cham.sh (sleep là hậu duệ dưới lớp bọc); đột biến BM8 thay dung bằng kill -TERM pid con thì cháu sống sót, ca đỏ |
| P1 | evals | Lệnh executor chỉ grep PASS theo ID, vế zsh có thể im lặng bỏ qua | macOS chạy lệnh trong zsh; dò zsh hỏng thì mọi ID vẫn PASS từ bash | Đòi vế zsh chạy khi máy có zsh | fixed: ca BZ0 đỏ trên darwin khi vắng zsh, thông điệp ghim «zsh co tren may ma khong chay»; BZ0 vào khoá btbd_tran_that |
| P2 | contract | Trục hình dạng lệnh thiếu dạng bash -c có $(node tệp) của chính kho kit | Bộ đoán tệp không nhận tệp trong chuỗi -c thì baseline chạy tệp ca chưa có ở gốc, đỏ vô nghĩa | Thêm hàng lệnh btbd đã giải nguyên văn | fixed: ca BH8 dùng lệnh btbd_tran_that rút từ config, tệp ca là ứng viên bỏ qua, lệnh có mặt nguyên văn |
| P2 | evals | Khai «đầu ra lệnh eval không giả được dấu» mà không ca nào đo | Lệnh in __BL giả; nếu đầu ra lọt lên stdout thì bộ đọc ghi sai mã | Lệnh in dấu giả rồi thoát 3, chạy shell thật | fixed: ca BT8 (bash + zsh) — stdout chỉ có dấu thật xong 3, __BL_XONG đúng một lần ở cuối |
