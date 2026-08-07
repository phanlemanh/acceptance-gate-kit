---
slug: measure-birth-certificate
at: 2026-08-07T09:30:56Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E5 nhánh bản-gỡ là âm-tính-một-mình: không assert mỗi lượt đóng vai đã CHẠY XONG và sinh sản phẩm khác rỗng — cùng lớp fail-open danh-sách-rỗng [codex-script-packaging#F2] | Lượt bản-gỡ crash/timeout → record ghi "không sinh cặp" → E5 xanh trên lượt chưa bao giờ chạy | Bất biến: cả 4 lượt có artifact bài-làm khác rỗng + dấu hoàn-thành; mutation làm rỗng một lượt → đỏ ghim tên lượt | fixed: AC-5 + E5 thêm bất biến artifact-khác-rỗng + mutation làm-rỗng-một-lượt |
| P1 | evals | E6 bộ đếm corpus không có đối chứng dương và mutation không phá quan hệ ≥ — cùng lớp hằng-đúng [d-20260807T041000Z-3390] | Khuôn mục lệch pattern → đếm ra 0 → "ledger ≥ 0" luôn xanh dù thiếu hàng chục mục | Đối chứng dương bộ đếm (1 hồ sơ đã biết > 0) + mutation xoá K dòng ledger dưới số đếm → đỏ ghim quan hệ ≥ | fixed: AC-6 + E6 thêm đối chứng dương bộ đếm + mutation quan hệ ≥ |
| P1 | contract | Không AC nào đo kênh GIAO: design khai bump 1.27.0/1.39.0 + GOTCHA cache-không-refresh nhưng contract chỉ đọc file trên đĩa | SKILL sửa xong, version đứng → harness nạp bản cũ, mệnh đề không bao giờ tới agent thật; E1–E8 vẫn xanh → ký feature chết-lúc-giao | AC mới: khối tồn tại → version 2 gói (cả mirror) ≥ mốc; mutation hạ version → đỏ ghim tên gói | fixed: thêm AC-9 + E9 (kênh giao, phủ cả twin + mirror) |
| P1 | evals | E8 tập "case P mới" không định nghĩa nguồn — tập-khai bằng tập-tìm-được, lớp hằng-đúng [measure-teeth-cleanup#F1] [codex-script-packaging#F1] | Case mới đặt id lệch khuôn quét (hoặc thêm ở vòng S4) → rơi khỏi tập soi → case một-chiều ship mà E8 xanh | Khối marker khai đích danh id; kiểm quan hệ tập-hợp khai↔tìm bằng nhau; mutation gỡ 1 id → đỏ ghim id | fixed: AC-8 + E8 viết lại theo khối-khai-đích-danh + quan-hệ-tập-hợp |
| P2 | evals | E4 tin gốc gói resolver trả mà không assert nằm TRONG cây đang kiểm — hình dạng (4) thước-gắn-vật (CLAUDE.md) | Mutation xoá mục trong bản sao nhưng resolver trỏ plugin đã cài → đọc bản lành → nhánh mutation không đỏ đúng | Assert đường dẫn resolver là tiền tố trong cây kiểm, suy từ vị trí script; hai nhánh chạy cùng gốc | fixed: E4 thêm assert gốc-trong-cây-kiểm + hai nhánh cùng gốc |

Ghi chú: không finding nào lật quyết định đã ghi trong decisions.jsonl. Ánh xạ
AC↔eval sau sửa: 9/9 đủ 1:1. Input thứ 5 (claim-scan) có claim — 4/5 finding
cite bài học cũ đúng id.
