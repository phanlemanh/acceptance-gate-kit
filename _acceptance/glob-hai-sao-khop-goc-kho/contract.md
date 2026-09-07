---
schema_version: 1
feature: Bộ khớp glob của cổng hiểu `**/` là không-hoặc-nhiều thư mục — `**/*.md` bắt cả markdown ở gốc kho
slug: glob-hai-sao-khop-goc-kho
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: approved
design_doc: docs/superpowers/specs/2026-09-08-glob-hai-sao-khop-goc-kho-design.md
approved_by: Manh Phan
approved_at: 2026-09-08
---

# Acceptance Contract: glob-hai-sao-khop-goc-kho

## Context

Repo tiêu thụ khai `**/*.md` trong `risk_tiers.t1_skip_globs` để nói «mọi
markdown là tài liệu», nhưng bộ khớp glob duy nhất của cổng (`match_globs`,
`scripts/pre-merge-check.sh`) là `case` của bash, nơi `**/` đòi ít nhất một
dấu `/`. Hệ quả đo được ở CRM 07/09: bốn hồ sơ đã ký bị báo stale trong một
ngày chỉ vì commit thuần tài liệu vào `AGENTS.md`/`CLAUDE.md` ở gốc kho; hồ sơ
ký lúc 18:03 cũ lúc 18:23 vì sáu dòng ghi chú. Người hưởng: chủ repo tiêu thụ
(lời khai được hiểu đúng nghĩa; cảnh báo stale giữ giá trị) — nguyên tố 2,
bằng chứng không tự dối theo cả hai chiều. Vòng này cộng ngữ nghĩa `**/`
(không-hoặc-nhiều thư mục, đúng gitignore/minimatch), không đổi nghĩa `*`.

Source input: docs/findings/2026-09-07-file-chi-dan-may-va-luat-stale.md (owner duyệt mở ô 08/09)

## Criteria

- AC-1: Given repo git có `t1_skip_globs: ["**/*.md"]` và hồ sơ signed-off ghim `verified_commit` tại HEAD, When `AGENTS.md` ở gốc kho đổi sau đó (commit mới), Then `pre-merge-check.sh` exit 0 và stdout KHÔNG có dòng «evidence is stale».
- AC-2: Given cùng cấu hình AC-1, When `docs/d.md` (một cấp) và `apps/app/README.md` (nhiều cấp) đổi sau verify, Then exit 0, không dòng stale — hành vi cũ không hồi quy.
- AC-3: Given cùng cấu hình AC-1, When `src/app.js` đổi sau verify, Then VIOLATION «evidence is stale» đích danh slug kèm dòng `src/app.js`, exit 1 — thước còn răng sau khi nới.
- AC-4: Given cùng cấu hình AC-1, When `AGENTS.mdx` ở gốc kho đổi sau verify, Then VIOLATION stale kèm dòng `AGENTS.mdx` — phép nới chỉ áp cho đoạn `**/`, không nới đuôi.
- AC-5: Given `t1_skip_globs: ["a/**/b.md"]`, When `a/b.md` đổi sau verify, Then exit 0, không dòng stale — `**/` ở giữa mẫu cũng là không-hoặc-nhiều thư mục.
- AC-6: Given `t1_skip_globs: ["*.md"]`, When `AGENTS.md` và `docs/d.md` đổi sau verify, Then exit 0, không dòng stale — ngữ nghĩa `*` vượt `/` giữ nguyên.
- AC-7: Given `t3_paths: ["**/auth/**", "**/Dockerfile"]`, `t1_skip_globs: ["*"]`, nhánh base và PR đổi `auth/x.js` (một cấp) và `Dockerfile` (gốc kho) không kèm `_acceptance/`, When chạy với `--base`, Then VIOLATION «T3 paths (t3_paths) changed» kèm cả hai dòng `auth/x.js` và `Dockerfile`, exit 1 — cùng bộ khớp phục vụ T3, nới theo chiều bảo vệ, kể cả đường dẫn gốc.
- AC-8: Given bản sao trọn `scripts/` + `lib/` của cây đang kiểm, When bản sao nguyên vẹn chạy fixture AC-1 thì exit 0 không stale (đối chứng dương), rồi gỡ dòng mang marker `GLOB-DOUBLESTAR-ZERO-DIRS` (xác nhận đột biến đã áp bằng đếm dòng) và chạy lại, Then VIOLATION stale kèm `AGENTS.md`, exit 1 — chiều đỏ của phép nới.
- AC-10: Given `t1_skip_globs: ["docs/**", "CHANGELOG.md"]` (không mẫu nào chứa `**/`), When `docs/a.md`, `docs/x/y.md` và `CHANGELOG.md` đổi sau verify, Then exit 0 và không dòng stale (đối chứng đỏ cùng ca: `docs2/a.md` đổi → VIOLATION stale kèm `docs2/a.md`) — glob không chứa `**/` đi qua bộ sinh biến thể nguyên vẹn, không bị tách sai tại hai dấu sao không có `/` theo sau.
- AC-9: Given `GUIDE.md`, When đọc hàng `risk_tiers.t1_skip_globs` của bảng config §8, Then hàng đó nêu ngữ nghĩa glob: `*` vượt `/`, `**/` là không-hoặc-nhiều thư mục, có ví dụ `**/*.md` bắt `AGENTS.md`.

## Coverage

Quét bằng morphological-scan, preset ma trận ca đo (chi tiết ở design doc).

- Trục A · hình dạng glob: tên đích danh | `*.ext` | `dir/**` | `**/X` tiền tố | `a/**/b` giữa | `?`/`[…]` [thước CE: gitignore pattern format · minimatch README · mọi glob đang khai ở config kit, CRM, template acceptance-init]
- Trục B · hình dạng đường dẫn: gốc không `/` | một cấp | nhiều cấp | cùng tên khác đuôi [thước CE: đầu ra `git diff --name-only` — tương đối, không `./`]
- Trục C · nơi gọi: `stale_files` | phân loại diff T1-escape | `t3_paths` [thước CE: grep `match_globs` trong script — đúng 3 nơi]
- Core 10 ô → AC-1..AC-10 (thêm a1·b1·c1 và a3·b2/b3·c1 từ gap-probe P1; a4·b1·c3 có ca thật trong AC-7 từ gap-probe P2). Later: `?`/`[…]` (bash đã hỗ trợ, chưa consumer nào khai). Never: minimatch đầy đủ — đổi nghĩa `*.md` đang sống (entry approach d-…); nơi gọi T1-escape riêng — dùng chung `DIFF_*` với T3, AC-7 đi qua đúng nhánh phân loại.

## Out of scope

- Không đổi thông điệp VIOLATION stale để gợi ý glob.
- Không chạm `_acceptance/config.yaml` của CRM hay repo tiêu thụ nào.
- Không thêm ngữ nghĩa cho `?`, `[…]`, hay `**` đứng một mình.
- Không đổi nghĩa `*` (vẫn vượt `/`).

## Notes

- Không eval `judgment`: mọi khẳng định máy chấm được (tiền lệ stale-theo-diff-pr, cùng file lõi cưỡng chế).
- Răng vào suite vĩnh viễn `tests/scripts/run-tests.sh` (khối VC), không `rang.sh` riêng — luật của `pre-merge-check.sh` sống ở đó (VC01–VC12).
