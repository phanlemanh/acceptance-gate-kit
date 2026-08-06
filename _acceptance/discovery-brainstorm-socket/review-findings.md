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

## Round 4 (Manh phê chuẩn vượt trần, khoanh vùng R3-1)

R3-1 ĐÓNG: 4 hình dạng quote+comment đều đọc ra tên đúng; ô ma trận mới giết
được bản tham lam (kiểm bằng tiêm mutant vào bản sao cây). Ma trận 26 ô.

Nhưng round 4 lộ ra **khuôn giải sai của cả vòng** + một vi phạm in-contract:

| # | Sev | Trong hợp đồng? | Finding (kiểm tay) | Đề xuất |
|---|---|---|---|---|
| R4-1 | **nặng** | **CÓ — AC-4** | Bộ lọc đuôi file của P167 bỏ sót 6 thân prompt agent `.toml`, `check_contrast.py`, `codex-self-script-refs.tsv`. Tiêm `product-management:brainstorm` vào `acceptance_judge.toml` → P167 vẫn OK exit 0. Đúng loại file dễ bị hardcode tên plugin nhất lại nằm ngoài vùng quét; chốt per-cây không cứu vì nó đếm file ĐÃ QUA bộ lọc | Sửa: quét theo DANH SÁCH LOẠI TRỪ (nhị phân/ảnh) thay vì danh sách cho phép, + ô đối chứng tiêm vào `.toml` |
| R4-2 | **nặng** | không (nhưng là gốc của cả vòng) | Kit ĐÃ CÓ reader config dùng chung `lib/evidence-core.js resolveConfigKey`; ổ cắm anh em `design_pass.host_embed` đọc bằng đúng nó (`scripts/gate-card.js:275`). Tôi tự viết parser THỨ BA. Tiền đề d-10002 sai cả hai vế (hàm đã có → chỉ gọi, không sửa lib → không phải T3; consumer thứ hai có từ 1.30.x). Đo tay: reader chung ĐÚNG SẴN ở CRLF · quote+comment-chứa-nháy · `key : value` · section-lạ-kế — tức 4 hình dạng tôi mất 4 round để vá | **Thay `configScalar` bằng `resolveConfigKey` + guard hình dạng ở ngoài** — xoá cả lớp thay vì vá hình dạng thứ năm |
| R4-3 | vừa | không | Bản vá "nới thụt đầu dòng" (r1) NGƯỢC hợp đồng repo (`acceptance-init.md:38` "2-space REQUIRED", pre-merge coi thụt lẻ là VIOLATION). Hậu quả thật: repo thụt 4 → ổ cắm đọc được nhưng `map.enabled=false` → thẻ `/start` nói dối "repo chưa bật bản đồ" | GỠ 2 ô thụt-lẻ khỏi ma trận; đi cùng R4-2 |
| R4-4 | vừa | không | Ổ cắm không có ở `GUIDE.md` §5.2 lẫn khuôn `acceptance-init` → repo tiêu thụ không có đường nào biết mà khai; vế dương không tới tay consumer | d-10005 đã hoãn có chủ đích chờ F-A; tối thiểu thêm 1 dòng chú thích trong khuôn init |
| R4-5 | thấp | không | `NULL`, `Null`, `true`, `False` lọt guard thành tên skill | Đi cùng R4-2 (guard hình dạng viết lại) |
| R4-6 | vừa/thấp | không | Hai lỗ thước còn lại: bằng chứng E1/E2/E3 ghim thông điệp của case KHÁC; quan hệ fallback→khuôn-grill vẫn đo bằng `includes` rời | Siết khi chạm P166 lần tới |

**Verdict round 4 KHÔNG dùng làm căn cứ ký được**: `triageFailed=true` lần thứ
hai (cùng nguyên nhân round 1 — khoá ghép đường dẫn giữa hai lane review), nên
finding in-contract R4-1 không được phép kéo verdict xuống. Cùng lớp giả xanh
đã ghi ở d-10009.
