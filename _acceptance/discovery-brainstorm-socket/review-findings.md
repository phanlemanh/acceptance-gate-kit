# Review findings — discovery-brainstorm-socket

Ghi theo nghi thức feedback-giữa-vòng (spec v2 §6). Round 1–2: findings đã xử
tại chỗ, vết ở decisions d-10009…d-10014 và hai commit S3-fix (`b907199`,
`03f4a02`). Bảng dưới là findings ROUND 3 — round cuối theo luật dừng
d-10013: không mở round 4; mỗi mục mang đề xuất xử lý để Manh quyết tại
Cổng Bằng chứng.

| # | Nguồn | Sev | Trong hợp đồng? | Finding (đã kiểm tay) | Đề xuất |
|---|---|---|---|---|---|
| R3-1 | review r3 | vừa | **CÓ — AC-2** | Giá trị bọc quote kèm comment đuôi dòng mà comment CHỨA dấu nháy (`"acme:brainstorm" # chú thích có "quote"`) → regex bóc quote tham lam khớp nhầm dấu nháy cuối dòng → trả `null` thay vì tên. Repo khai đúng bị đối xử như chưa khai, im lặng. Sửa là một ký tự (lazy quantifier) + 1 ô ma trận. | Manh chọn: (a) sửa-có-vết + một lượt chấm khoanh vùng (round 4 có phê chuẩn người), hoặc (b) ký known-limit — hình dạng hiếm, fallback an toàn |
| R3-2 | bugs r3 | vừa | không | Section kế tiếp có khoá top-level ngoài lớp `[A-Za-z0-9_-]` (khoá bọc quote, khoá có dấu chấm) không chặn được vòng quét → `brainstorm_skill` của section LẠ bị trả về như của `discovery`. Trả rác thay vì null — nhưng cần config có hình dạng hiếm gặp. | known-limit; sửa cùng hồ sơ config-reader (đã có chip riêng) — điểm nghẽn đúng là cả lớp reader line-based |
| R3-3 | bugs r3 | thấp | không | `brainstorm_skill : value` (dấu cách trước hai chấm — YAML hợp lệ) bị bỏ qua im lặng → null. Cùng lớp "khai hợp lệ bị bỏ qua" nhưng hình dạng hiếm. | known-limit; gộp vào hồ sơ config-reader |
| R3-4 | measurement r3 | vừa | không | Thước quan hệ nhánh-null→khuôn-grill trong P166 vẫn tách làm hai assert từ-vựng (regex nhánh + includes tên file rời) — chuyển con trỏ template sang nhánh khác vẫn xanh. Ba mutant hiện có không đâm quan hệ template↔fallback. | known-limit của THƯỚC (không phải của vật); siết khi chạm P166 lần tới, cùng chuẩn với F-J ratchet |

Round 3 không sửa gì trên cây — mọi số đo của evidence-report ứng đúng
`verified_commit 03f4a02`.
