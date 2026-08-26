# Bản đặc tả UX — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (tuần tự main loop — các task phụ thuộc dây chuyền khuôn→reader→test). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Khuôn đặc tả UX có marker + luật W8 advisory khớp vòng trong eval-coverage-lint + lời S1 feature-loop + bước tra mẫu — theo spec đã duyệt làn V.

**Architecture:** Writer = khuôn `ux-spec-template.md` (marker `UX-SPEC-TEMPLATE`, bảng trạng thái trong marker con `UX-STATE-TABLE`, instance GIỮ marker làm mỏ neo máy-đọc). Reader = cánh W8 trong `eval-coverage-lint.js` (advisory, cùng đường ống W1–W7), tìm design-doc qua key contract `design_doc:`, so bảng ST ↔ field `states:` của evals. Mọi fixture test RÚT từ writer qua marker (P55), không chép tay.

**Tech Stack:** Node CJS (lint), bash (suite scripts), Node ESM (tests/plugins), markdown khuôn.

**Spec:** docs/superpowers/specs/2026-08-24-dac-ta-ux-vat-hoa-cau-truc-design.md

## Global Constraints

- W8 là ADVISORY — không đổi exit-code semantics của lint (vẫn exit 1 khi có warning, fail-open khi lỗi nội bộ).
- KHÔNG đụng `scripts/pre-merge-check.sh`, `hooks/**`, `lib/**` trừ MỘT chỗ: `parseEvals` nhận thêm field `states` qua tham số (không sửa lib/eval-yaml.js).
- Chuỗi cửa miễn `"bỏ đặc-tả-UX — "` phải khớp từng ký tự ở khuôn và SKILL.
- Mọi case mới: cặp hai-chiều cùng fixture code-sinh + thông điệp ghim (MEASURE-BIRTH).
- Đường dẫn trong test suy từ vị trí script ($HERE / __dirname), cấm hardcode ROOT.
- Không sửa `skills/acceptance/references/contract-template.md` (key `design_doc:` là optional, dạy ở khuôn + SKILL — tránh đụng round-trip P115).

---

### Task 1: Khuôn `ux-spec-template.md`  (independent: false — mọi task sau đọc marker này)

**Files:**
- Create: `skills/acceptance/references/ux-spec-template.md`

**Interfaces:**
- Produces: marker `<!-- <<<UX-SPEC-TEMPLATE -->` … `<!-- UX-SPEC-TEMPLATE>>> -->`; bên trong có marker con `<!-- <<<UX-STATE-TABLE -->` bao bảng `| ST-<màn>-<trạng-thái> | <màn> | <hiển thị> | <người làm gì tiếp> |`; hai dòng nhãn `Khuôn IA:` và `Căn cứ:`; chuỗi miễn `"bỏ đặc-tả-UX — "`; ghi chú instance GIỮ marker.

- [ ] **Step 1: Viết file** — nội dung đầy đủ (đầu file: mục đích + cửa miễn + luật giữ-marker + hướng dẫn `design_doc:`/`states:`; thân: section `## Đặc tả UX` 6 mục trong marker, bảng ST mẫu 2 dòng, mục 6 với danh sách khuôn IA đóng + thang tra mẫu 2 nấc).
- [ ] **Step 2: Verify** — `sed -n '/<<<UX-SPEC-TEMPLATE/,/UX-SPEC-TEMPLATE>>>/p' skills/acceptance/references/ux-spec-template.md | grep -c 'ST-'` ≥ 2; grep đủ 6 tiêu đề mục + `Khuôn IA:` + `Căn cứ:` + chuỗi miễn.
- [ ] **Step 3: Commit** `feat(ux-spec): khuôn đặc tả UX có marker + cửa miễn + thang tra mẫu`

Phục vụ: E1 (AC-1), nền cho E2/E6–E12.

### Task 2: Cánh W8 trong `scripts/eval-coverage-lint.js`  (independent: false)

**Files:**
- Modify: `scripts/eval-coverage-lint.js`

**Interfaces:**
- Consumes: marker UX-STATE-TABLE (Task 1).
- Produces: hàm `parseStateTable(text)` → `{states: [{id,line}], badLines: [...]}` (export qua `module.exports._internal` cho test nếu cần — nhưng test chính đi qua CLI); cánh W8a/b/c/d + parse arm trong `lintFeature`; legend mở rộng.

- [ ] **Step 1: parse phía contract** — trong `lintFeature`, đọc `design_doc:` từ frontmatter contract (`/^design_doc:\s*(.+)$/im` + `fieldVal`), đọc `surfaces` (đã có `surfacesLine`). Thêm tham số `root` cho `lintFeature(slug, contractText, evalsText, glossary, root)`; `--files` mode truyền `process.cwd()`.
- [ ] **Step 2: parse phía evals** — `parseEvals` gọi với field list thêm `'states'`; parse giá trị dạng flow list một dòng: `states.replace(/^\[|\]$/g,'').split(',').map(s=>s.trim()).filter(Boolean)`.
- [ ] **Step 3: parseStateTable** — trích block giữa `<<<UX-STATE-TABLE` và `UX-STATE-TABLE>>>`; mỗi dòng bắt đầu `| ST-`: khớp `/^\|\s*(ST-[A-Za-z0-9_-]+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|\s*$/` → state; không khớp → badLines.
- [ ] **Step 4: cánh W8** — điều kiện vào: `hasUi = /\bui\b/i.test(surfacesLine)` hoặc có key `design_doc`. Nhánh:
  - key vắng ∧ hasUi → `W8a … chưa trỏ (design_doc:) …`
  - key có, file `readSafe(path.join(root, dd))` null → `W8a … không đọc được: <path> …`
  - file có, thiếu marker → `W8a … thiếu bảng UX-STATE-TABLE …`
  - có bảng: badLines → mỗi dòng `W8 (parse) dòng trạng thái không parse được: <line>`; mỗi ST không nằm trong ∪states của evals → `W8b trạng thái <ST> khai trước nhưng không eval nào đo`; mỗi id trong states của eval không có trong bảng → `W8c eval <id> đo trạng thái <ST> không có trong bảng khai trước`; dòng `Khuôn IA:` non-empty ∧ dòng `Căn cứ:` rỗng/`…`/vắng → `W8d mục Khuôn IA chưa có căn cứ — máy đoán chay`.
  - không key ∧ không ui → return sớm (đọc-cũ im lặng).
- [ ] **Step 5: legend** — nối vào dòng legend cuối: `W8 = bảng trạng thái khai trước và eval states: phải khớp vòng hai chiều (a thiếu/chưa trỏ · b khai-không-đo · c đo-không-khai · d khuôn IA thiếu căn cứ) — ADVISORY.`
- [ ] **Step 6: Verify tay nhanh** — dựng fixture tạm /tmp bằng sed-trích từ khuôn, chạy `node scripts/eval-coverage-lint.js <root>` xem đủ 4 cánh + 0-cờ pos.
- [ ] **Step 7: Commit** `feat(lint): cánh W8 khớp vòng đặc tả UX (advisory, đọc-cũ im lặng)`

Phục vụ: E2, E6–E10, E12.

### Task 3: Case suite scripts (W8-pos, W8B, W8C, W8A×3, W8P, W8O, W8D)  (independent: false)

**Files:**
- Modify: `tests/scripts/run-tests.sh` (append block sau block lint hiện có)

- [ ] **Step 1: helper trích-từ-writer** — trong block mới: `UXTPL="$HERE/../../skills/acceptance/references/ux-spec-template.md"`; `ux_section() { sed -n '/<<<UX-SPEC-TEMPLATE/,/UX-SPEC-TEMPLATE>>>/p' "$UXTPL"; }` — MỌI fixture design-doc sinh từ `ux_section` (rồi mutate bằng sed/awk trên bản sao), không viết tay bảng.
- [ ] **Step 2: fixture chuẩn** — hàm `mk_ux_fixture <root> <slug>`: contract frontmatter có `surfaces: [ui]` + `design_doc: docs/design.md`; `docs/design.md` = `ux_section`; evals.yaml khai `states:` đủ mọi ST trong bảng mẫu (danh sách ST lấy bằng `grep -o 'ST-[A-Za-z0-9_-]*'` TỪ bản trích — không gõ tay).
- [ ] **Step 3: 9 case** — mỗi case chạy `node "$LINT" "$R"`, bắt stdout, dùng `check`/`same` + `grep -q` ghim chuỗi đúng như evals expected: pos (exit 0 nhánh «no coverage gaps» — chú ý fixture không được dính W1/W3: AC không threshold, không Out-of-scope bullet); W8B xoá 1 dòng ST khỏi evals→ chờ… (đúng chiều: xoá khỏi states của evals, giữ bảng → grep "ST-…" + "không eval nào đo"); W8C thêm ST-ma vào states; W8A gỡ key / trỏ file ma (grep "không đọc được") / gỡ marker (grep "UX-STATE-TABLE"); W8P chèn dòng `| ST-hong |` cụt cột (grep "không parse được") VÀ kiểm cờ W8b của dòng lành vẫn chạy; W8O contract surfaces [cli] không key → stdout KHÔNG chứa "W8" (đối chứng sống: thêm ui vào surfaces → có W8a); W8D xoá chữ sau `Căn cứ:` (grep "chưa có căn cứ"). Nhãn echo: `S-UX1`…; dòng PASS ghim của evals là `PASS: [W8B]`… → dùng `check "[W8B] …" …`.
- [ ] **Step 4: chạy** `bash tests/scripts/run-tests.sh` → 0 FAIL.
- [ ] **Step 5: Commit** `test(scripts): 9 case W8 — fixture rút từ khuôn, cặp hai chiều ghim thông điệp`

Phục vụ: E6–E10, E12 (một nửa E2).

### Task 4: `tests/plugins/ux-spec.test.mjs` (UX1–UX4) + wire runner  (independent: false)

**Files:**
- Create: `tests/plugins/ux-spec.test.mjs`
- Modify: `tests/plugins/run-tests.sh` (thêm block gọi theo nếp `--ids` như vao-co-o)

- [ ] **Step 1: viết 4 ca theo nếp vao-co-o.test.mjs** (ALL_IDS, --ids, want(), đường dẫn suy từ __dirname): UX1 khuôn đủ 6 tiêu đề mục + marker con + chuỗi miễn (đỏ trên bản sao: gỡ marker → ghim "UX-SPEC-TEMPLATE thiếu UX-STATE-TABLE"; gỡ mục 6 → ghim tên mục); UX2 round-trip P55: trích section, sinh fixture (fs, tmpdir), chạy CHÍNH lint qua spawnSync — pos 0 cờ + số ST reader thấy == số dòng trích (so bằng: mọi ST trong bản trích xuất hiện trong stdout khi xoá states tương ứng…— cách đo: xoá TOÀN BỘ states → đếm số dòng W8b == số ST trích); chiều đỏ: giữ evals đủ, xoá 1 dòng ST khỏi design fixture → stdout có W8c ghim ĐÚNG id đó; UX3 quan hệ trong SKILL feature-loop (4 mệnh đề a–d của E3, mỗi mệnh đề một assert ghim); UX4 chuỗi miễn khớp từng ký tự giữa SKILL và khuôn (đỏ: bản sao đổi một bên → ghim "chuỗi miễn lệch").
- [ ] **Step 2: wire vào run-tests.sh** theo đúng khuôn block vao-co-o (lặp `--ids`).
- [ ] **Step 3: chạy** `node tests/plugins/ux-spec.test.mjs` → 0 fail (UX3 sẽ ĐỎ vì SKILL chưa sửa — đó là thứ tự đúng TDD; chuyển Task 5 rồi quay lại xanh). Ghi chú: chạy UX1/UX2/UX4 trước bằng `UX_CASES=UX1,UX2,UX4`.
- [ ] **Step 4: Commit** `test(plugins): UX1–UX4 — round-trip khuôn→reader, khớp chuỗi miễn`

Phục vụ: E1–E4, E11.

### Task 5: Lời S1 feature-loop SKILL.md  (independent: false — UX3/UX4 đo nó)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md`

- [ ] **Step 1: S1#4** — trước đoạn «sinh CÙNG LÚC», thêm: feature chạm UI → điền section `## Đặc tả UX` vào design-doc theo khuôn `ux-spec-template.md` của plugin acceptance-gate (resolve qua resolve-plugin.mjs, thêm `--require skills/acceptance/references/ux-spec-template.md` vào lệnh resolve sẵn có), GIỮ marker; contract ghi `design_doc: <path>`; eval máy/ui của trạng thái khai `states: [ST-…]`; máy điền MỘT lượt; mục Khuôn IA: không tự chắc (≥2 khuôn khả dĩ) → tra mẫu thang 2 nấc (công cụ tra mẫu thị trường nếu phiên có, vd MCP Mobbin → vết 1 dòng; không → chọn từ danh sách khuôn có tên); bỏ = entry descope auto-draft `"bỏ đặc-tả-UX — <lý do 1 dòng>"`.
- [ ] **Step 2: S1#6** — thay câu «Feature chạm UI thì design-doc phải có dòng state-matrix; THIẾU → nhắc bổ sung, KHÔNG dừng vòng.» bằng «Feature chạm UI thì design-doc phải có section Đặc tả UX theo khuôn `ux-spec-template.md` (một nguồn — thay dòng state-matrix cũ); THIẾU → nhắc bổ sung, KHÔNG dừng vòng.»
- [ ] **Step 3: nghi thức hình bước [3]** — thêm một câu: feature chạm UI → hình luồng/màn vẽ TỪ section Đặc tả UX của design-doc (hình là chiếu của khuôn, không vẽ tay).
- [ ] **Step 4: chạy** `node tests/plugins/ux-spec.test.mjs` (đủ 4 ca xanh) + `ONLY_BLOCK=feature-loop bash tests/plugins/run-tests.sh` cho các case pin SKILL hiện có + grep CONTEXT.md `_Avoid_` không dính từ mới.
- [ ] **Step 5: Commit** `feat(feature-loop): S1 điền đặc tả UX trước 3 artifact + thang tra mẫu + hình vẽ từ khuôn`

Phục vụ: E3, E4, E5.

### Task 6: Chạy trọn 4 suite + product-map check  (independent: false)

- [ ] **Step 1:** `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh && node scripts/product-map.mjs --root . --check` → tất cả 0 FAIL.
- [ ] **Step 2:** sửa mọi đỏ phát sinh (case cũ pin câu SKILL đã đổi…), commit `fix: …` từng chỗ.
