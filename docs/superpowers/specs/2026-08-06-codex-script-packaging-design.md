# codex-script-packaging — gói Codex phải mang đủ script mà chỉ dẫn của nó gọi

**Ngày:** 2026-08-06 · **Slug:** `codex-script-packaging` · **Tier:** T2 ·
**Nguồn:** chip tồn từ vòng judge-required-evidence — feature tiêu thụ #3 pha Đo.

## Vấn đề (đã quét cả lớp, không chỉ ca được nêu tên)

Chỉ dẫn của gói Codex bảo người dùng chạy
`node <plugin>/scripts/carry-plan.mjs …` cho vòng sửa sau khi bị trả lại,
nhưng hàm dựng gói (`build_feature_loop` trong `sync-plugin-packages.sh`) chỉ
chép đúng **một** file: `resolve-plugin.mjs`. Con trỏ chết: người dùng Codex đi
theo chỉ dẫn sẽ gặp lỗi "không tìm thấy file", và mất luôn cơ chế mang-kết-quả
sang vòng sau (thứ đắt nhất trong vòng lặp).

Quét toàn bộ chỉ dẫn của cả ba gói Codex, rút mọi tham chiếu dạng
`${PLUGIN_ROOT}/scripts/…` hoặc `<plugin>/scripts/…` (tức trỏ vào **chính gói
mình**, khác với trỏ sang gói bạn qua bộ giải): **1/6 tham chiếu là con trỏ
chết** — đúng `carry-plan.mjs`. Các tham chiếu còn lại hợp lệ.

Nhưng lỗ thật không phải một file thiếu: **không có phép đo nào canh quan hệ
đó**. Thêm một script mới vào chỉ dẫn mà quên chép vào gói thì hôm nay không
gì đỏ.

## Approach đã chọn (A) — chốt quan hệ, kèm việc chép file

1. Chép `carry-plan.mjs` vào gói Codex (một dòng trong hàm dựng gói; script
   chỉ dùng thư viện lõi của Node nên không kéo theo phụ thuộc nào).
2. **Chốt máy cho cả lớp:** rút mọi tham chiếu script-gói-mình TỪ chỉ dẫn thật
   bằng biểu thức, đối chiếu với danh sách file thật trong gói đã dựng. Thiếu →
   đỏ, nêu đích danh gói + tên file + chỉ dẫn nào nhắc.

Loại: (B) chỉ chép file, không chốt — lỗ mở lại ở lần thêm script kế tiếp;
(C) chép trọn `feature-loop/scripts/` sang gói Codex — kéo theo hai script mà
chỉ dẫn Codex không dùng, và làm gói phình vô cớ.

## Phép đo

- Đo trên **gói đã dựng thật** (mirror sau sync), không đo mã nguồn.
- Rút danh sách bằng biểu thức từ chỉ dẫn thật; **không hardcode tên file**.
- Sanity counter: số tham chiếu rút được > 0 (0 hit thường là biểu thức hỏng).
- **Đối chứng dương bắt buộc:** tiêm một tham chiếu giả vào bản sao chỉ dẫn →
  phép đo phải đỏ, nêu đúng tên file bịa.
- Script phải **chạy được** từ vị trí trong gói, không chỉ tồn tại.
- Không ngưỡng dung sai nào — thiếu 1 là đỏ (bài học vòng trước).

## Out of scope

- Hợp nhất hai bản chỉ dẫn Claude/Codex.
- Đổi cách bộ giải tìm gói bạn.
- Thêm script mới nào ngoài việc chép cái đã có.
