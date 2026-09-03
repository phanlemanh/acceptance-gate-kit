## Trong hợp đồng

- **PRODUCT-MAP.md không vẽ lại khi status draft→implemented — CI đỏ ngay ở HEAD**
  file: `PRODUCT-MAP.md:12`
  severity: high
  AC: AC-3
  detail: Commit 0e411b28 lật `_acceptance/release-2-8-0/contract.md:8` từ `status: draft` sang `status: implemented` nhưng KHÔNG chạy lại bộ sinh bản đồ. Chạy `node scripts/product-map.mjs --root . --check` ở HEAD → exit 1 («PRODUCT-MAP.md lệch với hồ sơ xưởng»). Bản đồ hiện vẫn xếp `release-2-8-0` ở «Chờ duyệt phạm vi 1 việc» (dòng 12 + mục dòng 41–43) trong khi hồ sơ đã sang «Đang làm» (đúng phải là «Chờ duyệt phạm vi chưa có» + «Đang làm 3 việc»).

  Hai chỗ nó vi phạm luật đã khai:
  1. `.github/workflows/gate.yml:37` chạy đúng lệnh này mỗi lần push → nhánh `release/2-8-0` đang đỏ CI.
  2. Chính hồ sơ này khai AC-3 và eval E3e (`_acceptance/release-2-8-0/evals.yaml:48-53`) là «exit 0 — PRODUCT-MAP.md khớp hồ sơ xưởng (bản đồ vẽ lại cùng commit mở hồ sơ)». Commit đầu (e3215399) trả nếp đó; commit thứ hai phá nó.

  Đây cùng HỌ với chỗ cắt mà chính mốc này gọi tên cho cửa sổ kế («1 CI đỏ hậu-chữ-ký/mốc này, mục tiêu 0») — chỉ khác là lần này nổ ở bước đổi TRẠNG THÁI chứ không ở bước ghi chữ ký, tức lớp lỗi rộng hơn ô đang mở. Sửa: chạy `node scripts/product-map.mjs --root .` rồi amend/commit cùng lượt đổi status.
  source: conventions

- **PRODUCT-MAP.md stale at HEAD — CI gate and two plugin tests fail**
  file: `PRODUCT-MAP.md:12`
  severity: high
  AC: AC-3
  detail: Commit 0e411b28 flipped `_acceptance/release-2-8-0/contract.md:8` from `status: draft` to `status: implemented` but did not regenerate PRODUCT-MAP.md. That status change crosses a bucket boundary (`cho-duyet` -> `dang-dung`), so the committed map is now wrong on three lines: line 12 still says `Chờ duyệt phạm vi<br/>1 việc` (should be `chưa có`), line 13 says `Đang làm<br/>2 việc` (should be `3 việc`), and the `## Chờ duyệt phạm vi` section at line 41 should be gone with the release-2-8-0 entry moved under `## Đang làm`.

  Verified on a clean working tree at HEAD (`git status --porcelain` empty):
  - `node scripts/product-map.mjs --root . --check` -> exit 1, `PRODUCT-MAP.md lệch với hồ sơ xưởng`. This is exactly the CI step at `.github/workflows/gate.yml:37`, so the branch is red.
  - `bash tests/plugins/run-tests.sh` -> `Results: 2 failed`: `P122 buoc lam moi ban do nam SAU buoc ghi field cong` (AssertionError: `PRODUCT-MAP.md cua kit lech voi ho so xuong`) and `P126 PRODUCT-MAP.md mien tru t1 + --check canh that` (AssertionError: `doi chung duong hong: ban do cua kit dang lech san` — the positive control cannot even establish a green baseline, so P126's red-direction assertion is disabled too).
  - The other three suites are green: scripts 796/0, hooks 60/0, workflows 44/0.

  This directly contradicts the dossier under review: AC-3 states "chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp", and eval E3e in `_acceptance/release-2-8-0/evals.yaml` expects "exit 0 — PRODUCT-MAP.md khớp hồ sơ xưởng". Fix: run `node scripts/product-map.mjs --root .` and commit the regenerated map alongside the status change (this is the ordering P122 exists to enforce).

  Absolute paths: /Users/manhphan/dev/acceptance-gate-kit/PRODUCT-MAP.md · /Users/manhphan/dev/acceptance-gate-kit/_acceptance/release-2-8-0/contract.md
  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bản vá theo LỚP làm nửa chừng: manifest feature-loop còn nguyên câu «byte-equal» đã bị bắt là sai**
  Người dùng thấy gì: Một dòng ghi chú giải thích cách công cụ tự kiểm tra vẫn dùng cách diễn đạt cũ đã biết là không chính xác, có thể khiến người đọc ghi chú phát hành hiểu nhầm cách tính năng đó hoạt động.
  file: `feature-loop/.claude-plugin/plugin.json`
  severity: medium
  Đề xuất: known-limits

- **E3e viết thẳng lệnh thay vì khoá config — tái phát lần 3, disposition «proposed» chưa bao giờ được áp**
  Người dùng thấy gì: Hiện chưa ảnh hưởng gì vì hai cách viết đang cho cùng kết quả, nhưng nếu cấu hình đo lường được cập nhật sau này, bước kiểm tra này có thể không cập nhật theo và báo kết quả không còn đúng thực tế.
  file: `_acceptance/release-2-8-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Third copy of the "byte-equal" claim left unfixed in feature-loop manifest**
  Người dùng thấy gì: Một dòng ghi chú giải thích cách công cụ tự kiểm tra vẫn dùng cách diễn đạt cũ đã biết là không chính xác, có thể khiến người đọc ghi chú phát hành hiểu nhầm cách tính năng đó hoạt động.
  file: `feature-loop/.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
