# Hạt giống — răng T1-escape tin lời tự khai của chính PR (hạng hồ sơ, danh sách hạng)

Gốc: `acceptance-gate-kit/_acceptance/t1-escape-chi-ho-so/` — đo ở lượt tái hiện của hồ sơ ấy (22/10), cùng họ với lỗ
nó vá (thứ rẻ dưới `_acceptance/` thoả răng T1-escape), khác cơ chế nên để ngoài phạm vi. Hồ sơ ấy trích lại tên tệp này
ở mục Out of scope.

## Người dùng gặp gì

Người duyệt PR thấy CI xanh và tin rằng code chịu cổng đã đi qua cổng. Hai dáng PR dưới đây đổi code T3 hay ngoài-T1 mà
không hồ sơ nào được chấm, vẫn «clean».

## 1. Hồ sơ tự khai hạng thấp

Kho mẫu `t3_paths: src/billing/**`, không khoá `signoff.required_for` (mặc định T2, T3). PR đổi `src/billing/c.js` và
thêm `_acceptance/f/contract.md` với `risk_tier: T1`:

| `risk_tier` của hồ sơ | `status` | Kết quả (kit 2.33.1) |
|---|---|---|
| T1 | draft | clean |
| T1 | approved | clean |
| T2 / T3 | draft / approved | VIOLATION [f] — hồ sơ chưa arm cổng |

Hồ sơ có `contract.md` nên vẫn là hồ sơ thật sau bản vá `t1-escape-chi-ho-so`. Vòng per-slug bỏ qua hạng ngoài
`required_for` (ARM12 — đúng thiết kế, kho tự khai). Ca GPM13 của `tests/scripts/run-tests.sh` dùng chính dáng này làm
fixture («Slug mới để T1 nên chính nó được vòng lọc tier bỏ qua»).

Hướng: so hạng tự khai của hồ sơ trong diff với hạng máy suy từ diff (có tệp T3 → đòi ít nhất một hồ sơ trong diff khai
T3). Giá: đổi hành vi ở mọi kho có PR mang hồ sơ hạng thấp hơn diff — phải đo trên các kho trước.

## 2. PR tự nới danh sách hạng ở chế độ thường

`t1_skip_globs` và `t3_paths` đọc từ `_acceptance/config.yaml` ở HEAD. PR thêm glob của chính nó vào `t1_skip_globs`
thì tệp ấy thành T1 và răng im. `--hang-pr` đã so danh sách với merge-base (`doi-danh-sach-hang` → chạy đủ); răng
T1-escape chưa.

Hướng: răng T1-escape đọc hai danh sách ở merge-base bằng cùng đường `config_list` mà `--hang-pr` đã dùng; danh sách ở
HEAD khác base → VIOLATION trừ khi PR kèm hồ sơ.

## Ngưỡng mở ô

≥ 1 PR thật ở bất kỳ kho nào qua răng T1-escape bằng một trong hai dáng trên (đếm: `git log` các commit gộp có hồ sơ mới
khai `risk_tier: T1` cùng diff chạm `t3_paths`, hoặc đổi `t1_skip_globs` cùng diff chạm glob mới thêm).
