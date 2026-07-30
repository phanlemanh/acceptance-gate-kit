# Pha 3 — gói lưới 5 món cho discovery + feature-loop (design)

*2026-07-30 · slug `pha3-goi-luoi` · T2 · Căn cứ: rollout plan (Amendment 28/07 +
30/07 S1-D visual-first + Pilot r2), retro V1 bài học B1/B4, workflow-v2 overview.
Scope ĐÓNG 5 món — mọi việc spec v2 khác nằm ngoài. Mỗi lưới sửa chữ là chính,
không xây máy mới ngoài test. Pilot r2 sẽ đo hiệu quả của chính các lưới này
(≤3 can thiệp ngoài · 0 drift lớp-B1 · Gate 1 tự in /goal).*

## Vì sao tồn tại

- **B1 (chuỗi E03 7 bước):** vật liệu ngoài vào không phân loại + không đối trọng
  (skill chuẩn-plugin của repo không được nạp) + không tầng nào hỏi platform-fit
  → máy hội tụ 8 round S4 vào một hợp đồng sai khung, người bác tại Cổng 2.
  Món 1/2/3 là ba lưới chặn đúng ba mắt xích đó.
- **B4 (/goal):** Gate 1 in gợi ý /model nhưng rớt /goal — bệnh có hồ sơ, tái
  hiện 28/07 SAU khi 1.17.1 đã thêm câu "LUÔN IN gợi ý /goal". Món 4 sửa gốc.
- **S1-D visual-first (quyết Manh 30/07):** Gate 1 duyệt UI trên bản bấm được,
  không duyệt bằng chữ. Món 5 wire skill `design-pass` (đã ship 1.26.0) vào
  câu hỏi lane của feature-loop.

## Món 1 — `opportunity-template.md`

**Vị trí:** `skills/acceptance/references/opportunity-template.md` — nằm trong
package acceptance-gate nên CẢ HAI harness đọc cùng một file (codex overlay
dùng chung `skills/`).

**Ground:** bản opportunity.md THẬT của V1 (`trang-tu-van-v2`, branch
`feat/trang-tu-van-v2` của artifact-platform). Template chép đúng các mục đã
dùng thật, không bịa mục mới:

- Frontmatter máy-đọc (khối marker `OPP-FRONTMATTER-TEMPLATE`, xem dưới):
  `schema_version` · `slug` · `feature` · `owner` · `stage`
  (discovery|decided|archived) · `decision` (build|iterate|park|kill) ·
  `decided_by` · `decided_at` (ISO UTC) · `time_human_minutes.gate0` ·
  `prototype.base_commit` · `prototype.disposition` (keep|archive).
- `## Vấn đề & ai gặp`
- `## Giả định chốt sinh tử` — bảng xếp hạng, mỗi dòng: nếu-sai-thì · phép thử
  rẻ nhất · trạng thái (re-rank sau red-team).
- `## Ngưỡng chết / ngưỡng UAT` — theo mô hình đo-tại-UAT (Amendment 28/07):
  ngưỡng KHAI tại Cổng 0, ĐO tại phiên UAT; ghi rõ đường supersede nếu phép đo đổi.
- `## Kết quả prototype`
- `## Cổng 0` — 2 câu hỏi (số phận cơ hội = `decision`, số phận code =
  `disposition`) + ngưỡng UAT chốt cùng lúc ký.
- `## Thước đo thành công → ứng viên criterion` (đo-sau-ship)
- `## Bảng nợ kế thừa` (CHỈ khi `disposition: keep`)
- `## Out of scope từ khám phá`
- **`## Nguồn ngoài & phạm vi kế thừa` (TRƯỜNG MỚI — lưới B1):** bảng liệt kê
  TỪNG món vật liệu ngoài repo (gói spec, prototype cũ, design system khác,
  code mẫu…), mỗi món phân loại một trong hai:
  - **triết-lý/logic** — kế thừa được (engine, luật nghiệp vụ, ngưỡng, thuật toán);
  - **ngôn-ngữ-thiết-kế/hình-thái** — mặc định **KHÔNG** kế thừa: chuẩn của repo
    tiêu thụ THẮNG; muốn kế thừa phải khai đích danh vào bảng này VÀ có người ký
    tại Cổng 0 (cột `người ký`).
  Không phân loại = chưa đủ điều kiện ký Cổng 0. (V1: gói E03 vào nguyên khối,
  DNA hình thái đi theo triết lý — chính là ô trống mà trường này lấp.)

**Khuôn marker + round-trip (bất biến "thước gắn vào vật được giao"):**
frontmatter mẫu đặt giữa hai marker HTML-comment
`<<<OPP-FRONTMATTER-TEMPLATE` … `OPP-FRONTMATTER-TEMPLATE>>>`, placeholder dạng
`{slug}`. Test P82 (P55-style): (1) rút khuôn từ CHÍNH file template qua marker
→ điền giá trị mẫu → đọc bằng reader thật `lib/evidence-core.js
frontmatterField()` (reader frontmatter chuẩn của kit — hook/CI dùng cùng hàm)
→ mọi key top-level (`slug`/`stage`/`decision`/`decided_by`/`decided_at`/`owner`)
phải trả đúng giá trị (đối chứng dương); (2) đột biến — xoá dòng `---` đóng →
`frontmatterField` phải trả null (đối chứng âm, ghim hành vi). Key lồng
(`prototype.*`, `time_human_minutes.*`) reader hiện không đọc — reader thật của
Cổng 0 là việc F-B; marker để test F-B nâng cấp sau, không xây reader mới ở đây.

## Món 2 — gap-probe thêm câu platform-fit

S1#7 (Claude) mục cross-check bắt buộc (ý 4) thêm MỘT vế:
"artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không; skill/quy định
nào của repo LẼ RA phải nạp mà chưa nạp?".
Codex SKILL step 8 thêm cùng vế (tiếng Anh) vào danh sách cross-checks.
Test P84 grep-pin cả hai file.

## Món 3 — S1 bắt nạp skill chuẩn-plugin/DS của repo tiêu thụ

Thêm bước S1 (Claude + Codex): feature chạm UI → đọc key config
**`feature_loop.ui_standards_skill`** (đề xuất key mới; giá trị = tên skill của
repo tiêu thụ, vd `create-onehub-plugin`):
- Key CÓ → BẮT BUỘC invoke skill đó TRƯỚC khi sinh 3 artifact (đối trọng nội
  đặt lên bàn cân cùng lúc với vật liệu ngoài — quy luật meta #1 của retro).
- Key VẮNG → ghi chú đúng 1 dòng vào gói Gate 1 ("repo chưa khai
  ui_standards_skill — artifact UI không có đối trọng chuẩn nội"), KHÔNG chặn.
Test P86 grep-pin key + hành vi vắng-key ở cả hai harness.

## Món 4 — Gate 1 in mặc định gợi ý /goal (sửa gốc B4)

**Chẩn đoán gốc:** SKILL 1.17.1 đã lệnh "LUÔN IN gợi ý /goal theo template mục
/goal trong GUIDE" — nhưng package feature-loop KHÔNG ship GUIDE.md (chỉ
acceptance-gate ship). Agent runtime ở repo tiêu thụ không mở được template →
paraphrase hoặc rớt. Lưới: **nhúng template nguyên văn vào chính SKILL**, trong
khối marker `<<<GOAL-TEMPLATE` … `GOAL-TEMPLATE>>>`; Gate 1 in khối đó đã điền
slug, mặc định, không chờ hỏi. GUIDE giữ bản của nó (văn cảnh người đọc) và
được bọc CÙNG marker.

**Chống trôi 2 bản (bất biến seam một-chỗ-có-marker):** test P85 rút khối từ
CẢ HAI file, assert (a) bằng nhau từng ký tự sau chuẩn hoá fence; (b) tính chất
nội dung: bắt đầu `/goal`, chứa điều kiện `verified`, chứa lối thoát escalate
(`REJECT quá 3 round`), KHÔNG chứa `signed-off` làm đích goal; (c) đối chứng âm:
đột biến một bản trong bản sao → so sánh phải đỏ. Codex Gate 1 đã in gợi ý
/goal native (dòng ~314) — không sửa, chỉ không phá.

## Món 5 — Wire S1-D: câu hỏi lane → design-pass

Khối "Câu hỏi lane" của SKILL (đang hỏi design-mockup ceremony vs static-only)
đổi thành nghi thức S1-D:
- **Feature chạm UI** (không phụ thuộc `executors.design.*` — design-pass là
  in-harness, chỉ cần Browser pane) → **chạy skill `design-pass` (plugin
  acceptance-gate ≥ 1.26.0, ĐÃ ship) TRƯỚC Gate 1**; descope phải là entry
  `descope` CÓ TÊN trong ledger (không có đường bỏ im lặng).
- **Gate 1 với UI feature: trình bản bấm được** (proto/URL từ design-pass) cùng
  thẻ — Gate 1 không duyệt UI bằng chữ.
Bảng CT1/CT2 + máy design-loop cũ GIỮ NGUYÊN (đường đọc-cũ cho workspace đang
giữa vòng; khai tử ceremony là việc F-D). Test P87 grep-pin câu lane mới +
mệnh đề descope-có-tên + dòng Gate-1-bản-bấm-được.
Codex KHÔNG wire ở lượt này: package codex chưa ship design-pass — đã có entry
revisit `d-20260730T050548Z-4723` (ledger design-pass-skill, đợt audit
marketplace kế).

## Test & giao hàng

- Test mới P82–P88 vào `tests/plugins/run-tests.sh` (executor
  `config:executors.test.plugins`); mọi nhánh âm có đối chứng dương + ghim đúng
  thông điệp/hành vi; grep có sanity counter (path tường minh). Sau gap-probe:
  P85 ghim thêm (a) lệnh in-mặc-định-đã-điền-slug trong mục GATE 1 tham chiếu
  đích danh khối marker, (b) thứ tự dương-trước-âm-sau + thông điệp mismatch
  nêu tên 2 file, (c) dòng `/goal` native của codex SKILL còn nguyên; P83 ghim
  anchor "không phân loại = chưa đủ điều kiện ký Cổng 0"; P88 mới: semver
  acceptance-gate ≥ 1.27.0, feature-loop ≥ 1.19.0 + description có từ khoá
  hành vi mới (AC-12 — release có chủ đích).
- Mirror: sửa `skills/` + `codex/` → chạy `scripts/sync-plugin-packages.sh` và
  commit mirror CÙNG lượt (P30 canh độc lập).
- Version: acceptance-gate 1.26.0 → **1.27.0** (thêm reference template);
  feature-loop 1.18.1 → **1.19.0** (4 lưới hành vi S1/Gate 1); description 2
  plugin.json (Claude + codex) nối đoạn hành vi mới theo giọng hiện có.
- GUIDE chỉ nhận marker quanh template /goal sẵn có — không viết mục mới.

## Out of scope (chốt tại Gate 1)

- Codex wire design-pass (món 5) — chờ đợt audit marketplace (revisit đã ghi).
- Máy-enforce /goal bằng hook — brief cấm xây máy ngoài test.
- Khai tử CT1/CT2/design-mockup ceremony — F-D.
- Reader máy đọc opportunity.md ở S0 + card mode Cổng 0 — F-A/F-B.
- Mọi hạng mục spec v2 khác (B3 cap round, B5 kênh giữa vòng, B6 trạng thái
  đóng vòng, B7 worktree-mặc-định).
