---
schema_version: 2
feature: "cross-feature-claim-index — gap-probe S1 đọc bài học lớp-lỗi từ các feature trước qua claim-scan.mjs (index dẫn xuất, không persist)"
slug: cross-feature-claim-index
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-07-29T06:55:00Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-07-29-cross-feature-claim-index-design.md
time_human_minutes:
  gate1: 5
  gate2: 5
---

# Acceptance contract — cross-feature-claim-index

Bối cảnh 2-4 câu: Bài học lớp-lỗi hiện chết ở ranh giới slug (lớp "assertion
âm tính" tái xuất ≥9 lượt dù đã ghi văn xuôi). V1 thêm `claim-scan.mjs` dẫn
xuất claim từ `decisions.jsonl` + `gap-probe.md` của mọi slug, nạp làm input
thứ 5 cho gap-probe S1 — advisory, có trích dẫn đo được, ngưỡng sống/chết
DP-1 khai trước trong design doc.

## Criteria

- **AC-1** Given repo có ≥2 workspace slug với `decisions.jsonl` chứa entry
  `fix`/`descope` và `gap-probe.md` có `verdict: findings`, When chạy
  `claim-scan.mjs --root <repo> --slug <slug-mới> --json`, Then output chứa
  claim từ CẢ HAI nguồn (ledger + gap-probe), đúng loại đã lọc — entry
  `approach`/`revisit`/`seal` và file `verdict: clean`/`probe-failed` KHÔNG
  xuất hiện.
- **AC-2** Given một `decisions.jsonl` có dòng JSONL hỏng xen giữa các dòng
  hợp lệ VÀ một `gap-probe.md` có bảng Findings lệch khuôn hoặc frontmatter
  thiếu `at`, When chạy scan, Then nguồn hợp lệ còn nguyên claim (đối chứng
  dương cả hai phía), phần hỏng bị bỏ qua, stderr in đúng thông điệp đếm
  `skipped … in <file>` cho TỪNG file hỏng và exit code vẫn 0 — không
  crash sort vì thiếu `at`.
- **AC-3** Given `--slug X`, When workspace `X` cũng có ledger/gap-probe đủ
  điều kiện, Then không claim nào của `X` xuất hiện trong output (và đối
  chứng dương: đổi `--slug` khác thì claim của X xuất hiện).
- **AC-4** Given corpus rỗng hoặc workspace thiếu file (repo tiêu thụ mới,
  workspace cũ trước 1.14.0 không có gap-probe.md), When chạy scan, Then
  exit 0, output rỗng/thiếu phần tương ứng, không crash, không đòi migrate;
  NGƯỢC LẠI gọi thiếu `--slug` hoặc root sai → exit ≠0 kèm thông điệp usage
  (thiếu tham số KHÔNG được rơi vào nhánh "im lặng hợp lệ").
- **AC-5** Given corpus có >10 claim ứng viên, When chạy scan, Then output
  đúng 10 claim, xếp severity trước (P0>P1>P2>không-sev) recency sau, mỗi
  trường text ≤250 ký tự (cắt có dấu `…`), không id trùng.
- **AC-6** Given output `--json`, When kiểm từng claim, Then đủ trường schema
  `id / source / slug / kind / stage / sev / at / claim / lesson / pointer`
  và id đúng khuôn trích dẫn (`d-…` hoặc `<slug>#F<n>`) — khuôn id khớp
  regex đo lường trong design doc.
- **AC-7** Given SKILL.md feature-loop sau tích hợp, When đọc bước S1#7,
  Then có đủ: chạy claim-scan trước probe, truyền input thứ 5 khi có claim,
  KHÔNG truyền khi corpus rỗng, và nhánh scan-fail ghi
  `claims_input: failed` vào frontmatter gap-probe.md mà probe vẫn chạy với
  4 input (không chặn, không probe-failed).
- **AC-8** Given prompt gap-probe sau tích hợp, When đọc ý (7) mới, Then có
  đủ 3 ràng buộc: claims là advisory từ feature khác · không dùng claim để
  lật seal/descope của feature đang xét · finding dựa trên claim phải cite
  `[<id>]` nguyên văn.
- **AC-9** Given corpus thật của repo này (5 slug hiện có), When chạy scan
  smoke, Then exit 0, ≤10 claim, có ≥1 id `d-…` và ≥1 id `…#F<n>`, chạy
  xong <5 giây.
- **AC-10** (judgment) Schema claim + cách serialize đủ làm nền tầng (c)
  (G5 đọc lại được: mỗi claim truy về nguồn qua `pointer`, id ổn định qua
  các lần chạy) mà không phình V1 — không trường thừa "để dành".
- **AC-11** (judgment) Ngưỡng sống/chết DP-1 trong design doc đo được từ
  vật (grep gap-probe.md slug mới) đúng như khai — không cần hỏi agent hay
  hồi ức người.
- **AC-12** Given thay đổi đã hoàn tất (script mới + SKILL.md sửa), When
  chạy `sync-plugin-packages.sh --check`, Then exit 0 — mirror không drift
  sau thay đổi của feature này.

## Coverage

Từ morphological-scan (4 trục — thước CE trong ngoặc):

- **N — trạng thái đầu vào** (CE: dữ liệu thật 5 slug + luật đọc-cũ
  CLAUDE.md): AC-1, AC-2, AC-3, AC-4, AC-9
- **P — bước pipeline** (CE: ngành — Anthropic KG Cookbook context-builder):
  AC-1, AC-5, AC-6
- **T — điểm tích hợp** (CE: SKILL.md 1.17.1 S1#7 nguyên văn): AC-7, AC-8
- **Đ — đường đo** (CE: ngưỡng DP-1 đã chốt): AC-6, AC-11
- Bất biến đóng gói (CE: P30 + quy trình sync CLAUDE.md): AC-12
- Cross-cutting (bất biến CLAUDE.md): đối chứng dương cho mọi assertion âm
  tính — nằm trong chính lời văn AC-2/AC-3; fixture do code sinh — luật của
  evals, kiểm ở review S4.

## Out of scope

- Nguồn `review-findings.md` + `run-log.jsonl` (parser markdown 3-ngăn dễ
  vỡ; `run-log.jsonl` thuần vết chạy cơ học, không chứa bài học) — V2.
- Semantic matching claim ↔ surfaces/paths feature mới — nút chỉnh "vùng
  giữa" DP-1, chỉ mở khi vùng giữa xảy ra.
- Persist index (`--write`), render claim lên gate-card — V2, chờ GO.
- Codex parity (feature-loop-codex) — V2.
- LLM gán nhãn lớp-lỗi trong scanner — Never (giao agent tiêu thụ).
- Trí nhớ xuyên repo — Never (bất biến CLAUDE.md: kit không chứa gì phải
  chép sang repo sản phẩm thứ hai).

## Notes (Gate 2, 2026-07-29 — disposition 6 finding ngoài hợp đồng)

- **Chuyển contract mới `claim-scan-parser-hardening`** (quyết tại Cổng 2):
  (1) regex `## Findings` nuốt tới EOF → claim ma có id cite được (HIGH);
  (2) claim id thiếu/sai khuôn bị drop im lặng; (3) id trùng xuyên-feature
  không warn. Cùng lớp parser — làm một vòng loop riêng ngay sau ship.
- **Known limits:** 2 commit của vòng này (af68b58, 1d7b91f) cuốn nhầm wip
  CLAUDE.md + 3 docs discovery-gate0 dưới message claim-scan — KHÔNG rewrite
  history (đứt chuỗi verified_commit/chữ ký); bài học vận hành: cấm
  `git add -A`/`-am` trong repo self-host, add đích danh từng path.
- **Known limits:** description plugin.json 1.18.0 chưa có dòng "v1.18
  adds…" — vá trong lượt release notes kế tiếp.
