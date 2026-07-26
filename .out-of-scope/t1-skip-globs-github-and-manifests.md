# Miễn trừ `.github/**` và `.claude-plugin/plugin.json` khỏi `t1_skip_globs` — ĐÃ TỪ CHỐI

**Trạng thái:** từ chối 2026-07-26 trong feature `t1-escape-event-scope`.
**Ledger:** `d-20260727T040100Z-202`.

## Đề xuất là gì

Commit hạ tầng (bump version, đồng bộ bản sao, chỉnh CI) làm cổng đỏ. Cách sửa
nhanh nhất trông có vẻ là nới `risk_tiers.t1_skip_globs` cho hai nhóm path hay
xuất hiện trong loại commit đó:

- `.github/**`
- `.claude-plugin/plugin.json` và `.codex-plugin/plugin.json`

## Vì sao bác

**`.github/**` — đổi CI có thể TẮT cổng.** Đây đúng là thứ răng T1-escape sinh
ra để bắt: một PR sửa workflow để bỏ bước pre-merge, hoặc đổi `--base` thành ref
không resolve được, là một PR thay đổi mức bảo vệ của repo. Miễn trừ nó nghĩa là
lớp bảo vệ tự cho phép bị gỡ mà không cần hồ sơ nghiệm thu nào.

**Manifest khai được `hooks`.** `plugin.json` không chỉ chứa `version`; nó khai
cả hook và điểm nối. Miễn trừ TRỌN file để tiện cho việc bump version là mở một
lỗ rộng hơn nhiều so với vấn đề đang chữa.

**Vấn đề thật đã được giải chỗ khác, rẻ hơn:**

1. `plugins/**` (bản sao sinh máy) ĐƯỢC miễn trừ — an toàn vì P30 canh
   `mirror == nguồn` ở luật độc lập; case `P41` là RED bắt buộc chứng minh điều đó.
2. Bump version thuộc **S3**, không phải S5 (GUIDE) — bump trước khi verify thì
   không có gì stale.
3. `P03`/`P22` thôi ghim số version bằng literal — bump không còn sửa suite.

## Prior requests

- **2026-07-26** — cân nhắc trong lúc thiết kế `t1-escape-event-scope`, bác ngay
  ở bước thiết kế (ledger `d-202`), trước khi viết dòng mã nào.

## Nếu đề xuất này quay lại

Nó sẽ quay lại, và sẽ quay lại đúng lúc đau: lần release kế tiếp mà cổng đỏ,
phản xạ tự nhiên là "thêm nốt hai path đó vào skip_globs". Trước khi làm, phải
trả lời được:

1. Nếu `.github/**` là T1, cái gì còn chặn một PR gỡ chính bước pre-merge ra khỏi CI?
2. Nếu `plugin.json` là T1, cái gì còn chặn một thay đổi khai thêm hook mà không qua cổng?

Không trả lời được thì câu trả lời vẫn là không. Nguyên nhân thật của cơn đau
gần như luôn là **thứ tự** (bump ở S5 thay vì S3) hoặc **luật khác** (staleness
chưa có phạm vi sự kiện — xem task riêng), không phải phạm vi `t1_skip_globs`.
