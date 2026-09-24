# Đường nền chạy lệnh bằng môi trường người gọi — design

Hồ sơ: `_acceptance/nen-chay-bang-moi-truong-nguoi-goi/` · T2 · 2026-09-24

## Vấn đề (tái hiện được)

Đường nền (`feature-loop/scripts/duong-nen.mjs`) tra công cụ (`command -v`) và chạy suite
bằng `spawnSync('bash', ['-lc', …])`. Shell ĐĂNG NHẬP nạp lại profile của máy và đặt lại
PATH, nên máy đo một máy KHÁC máy người gọi đang đứng.

Đo ở crm-onehub 24/09 (worktree `beautiful-thompson-16c095`, vòng `mot-duong-ghi-phong-ban`):

| Cách gọi | `node -v` | `command -v node` |
|---|---|---|
| người gọi (fnm) | v24.15.0 | `~/.local/state/fnm_multishells/…/bin/node` |
| `bash -lc` | v22.18.0 | `/usr/local/bin/node` |
| `bash -c` + `env: process.env` | v24.15.0 | như người gọi |

Suite `executors.script.build_khong_cache` (`bunx turbo run build --force`) đỏ ở
`apps/agent` với «eve requires Node.js >=24. You are running v22.18.0» → đường nền ghi
`nen suite: DO SAN executors.script.build_khong_cache ma 1` trên cây chưa chạm — báo động
giả. Cùng lệnh ở shell thường, hoặc qua `repin-lane.mjs` (`bash -c` + `env: process.env`),
xanh.

## Thiết kế

Một cửa duy nhất `bashNguoiGoi(lenh, thamSo, o)` trong khối marker `BASH-NGUOI-GOI`:
`spawnSync('bash', ['-c', lenh, ...thamSo], { cwd: root, env: process.env, ...o })` — cùng
cách `repin-lane.mjs` chạy lệnh. Cả hai chân đi qua nó: tra `command -v "$1"` ở chân công
cụ và chạy từng lệnh ở chân suite. Hai chân nay không thể lệch nhau: nếu một chân dùng
shell đăng nhập còn chân kia không, «có công cụ» và «suite chạy được» lại đo hai máy khác
nhau.

Không đổi: thứ tự tuần tự của suite (khối `SUITE-TUAN-TU`), luật từ đầu của chân công cụ,
chân lưới (gọi `bash <pre-merge-check.sh>`, không qua `-c`), chân engine.

Phạm vi quét: lệnh và số đếm ở Notes của contract (bash/sh/zsh × `-lc`, `-ilc`, `'-l'`,
`--login`, trên scripts lib hooks feature-loop workflows commands skills) — 1 dòng khớp,
là chú thích của khối mới; đường nền là chỗ duy nhất từng gọi shell đăng nhập.

## Kiểm (hai chiều, cùng một fixture)

Fixture dựng đúng cơ chế, không phụ thuộc máy: HOME tạm có `.bash_profile` với
`export PATH=/usr/bin:/bin` (mô phỏng profile đặt lại PATH); một công cụ
`nen-cong-cu-rieng-xyz` chỉ nằm trong thư mục bin tạm ở ĐẦU PATH của người gọi; khoá
`executors.test.a` (vừa là executor vừa là suite key) chạy `nen-cong-cu-rieng-xyz --chay`.

- NEN-ENV1 (đối chứng dương): có công cụ → mã 0, bốn chân bằng NEN0, đúng một bullet
  «không có».
- NEN-ENV2 (chiều đỏ, cùng fixture, chỉ khác «có công cụ»): công cụ vắng thật → mã 1, hai
  bullet — tập BẰNG ĐÚNG — ghim nguyên văn `nen cong-cu: THIEU nen-cong-cu-rieng-xyz (khoa executors.test.a)`
  và `nen suite: DO SAN executors.test.a ma 127`.
- NEN-ENV3 (đột biến): bản chép `feature-loop/` chạy ENV1 XANH trước (bản chép lành); rồi
  đổi `['-c',` → `['-lc',` trong thân khối `BASH-NGUOI-GOI` (assert đúng 1 chỗ và tệp đổi
  thật) → ENV1 phải đỏ với tập bullet bằng đúng hai dòng trên. Một bản vá chỉ sửa một chân
  không qua được.
- NEN-ENV4 (hình dạng THẬT của crm — gap-probe P1): công cụ có ở cả hai nơi; profile đặt
  một thư mục «hệ thống» tạm chứa bản mồi `exit 42` lên đầu PATH đăng nhập. Bản thật xanh;
  bản đột biến `-lc` cho `cong_cu: xanh` và đúng một dòng `nen suite: DO SAN … ma 42` —
  giống crm, nơi chân công cụ xanh còn suite đỏ một dòng. Bản vá yếu «giữ `-lc`, nối PATH
  người gọi vào cuối» qua ENV1/ENV2 nhưng đỏ ở ENV4 (phá thử tay 24/09).
- NEN4b: bản đột biến song song gọi shell giống bản thật (`-c` + env), chỉ khác biến đồng
  thời; guard mũi tiêm trỏ vòng `bashNguoiGoi(`.
- Chiều đỏ nằm trong lịch sử: commit ca kiểm `71f97b8f` đứng trước commit vá `3ba8edc0`;
  ở `71f97b8f` fixture ENV1 đỏ với hai dòng (THIEU + mã 127 — hình dạng của ca công cụ
  vắng, không phải hình dạng một-dòng-mã-1 của crm; hình dạng crm do ENV4 mang), ENV3 đỏ vì
  khối chưa có.

## Neo ngoài (đọc máy tác giả — không là eval)

Chạy lại đường nền trên worktree crm thật (sha `28db6702`) bằng script đã vá: `suite: xanh`
— `build_khong_cache` qua. Đỏ còn lại `THIEU merge-base` ×2 thuộc lớp #216 (script chạy
lượt ấy chưa gộp #216). Tệp `duong-nen.md` của vòng crm trả về bản commit.
