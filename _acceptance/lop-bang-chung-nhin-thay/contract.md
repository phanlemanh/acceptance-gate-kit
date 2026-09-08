---
schema_version: 1
feature: Lớp bằng chứng nhìn-thấy — hợp đồng có mặt người nhìn phải có ≥1 eval ui-check (`layer: ui-observed`); răng W8 ba tầng (lint · thẻ · pre-merge NOTE), một nguồn cho surfaces, đường bỏ có tên
slug: lop-bang-chung-nhin-thay
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/** (lib/lop-nhin-thay.cjs mới + lib/nguong-o-co-hoi.cjs) + scripts/pre-merge-check.sh
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-09-07T22:00:36Z
design_doc: docs/superpowers/specs/2026-09-08-lop-bang-chung-nhin-thay-design.md
---

# Acceptance Contract: lop-bang-chung-nhin-thay

## Context

Từ 01/09 hồ sơ chạm web ở repo tiêu thụ không còn frame ở Cổng Bằng chứng, dù đường ống
chụp/hiển thị của kit nguyên vẹn: luật S2 «executor cơ học nhất» gán hết tiêu chí mặt người nhìn cho
`test`/`script`, và kit chỉ có một chiều luật lớp (`(cross-layer)` → `backend-effect`),
thiếu chiều ngược «bằng chứng lớp mã không đủ cho bề mặt người nhìn». Hồ sơ này đặt tên
lớp đó (`layer: ui-observed`, neo máy ở bản khai = `executor: ui-check`; đính chính S4-r3: lưới ghi
`acceptance-evidence-gate.js` KHÔNG đòi screenshot trên block ui-check, răng của frame là card Cổng Bằng chứng
đọc báo cáo — xem Notes), buộc mỗi hợp đồng có mặt người nhìn có ≥1 eval `ui-check` (theo hợp
đồng, không theo AC), dùng lại nguyên bộ răng của W4 nhưng tầng cuối là NOTE kèm ngưỡng
đang đếm, gom «mặt người nhìn» về một nguồn (alias `web`/`web-ui` → `ui`), và mở đường
bỏ có tên `bỏ ui-observed — `. **Đề xuất CỘNG dưới luật nới 07/09** (CLAUDE.md): trace
nguyên tố 2 — bằng chứng không tự dối; người hưởng: người ký Cổng Bằng chứng nhìn frame
thay vì tên ca máy, máy có rail `observed`; không thêm lượt gọi người.

Source input: điều tra phiên 08/09/2026 (oneflow/chong-mat-khoa-byo-giao-dien
`surfaces: [web]`, 0 eval `ui-check`) + Lối C owner duyệt 08/09. Thiết kế:
`docs/superpowers/specs/2026-09-08-lop-bang-chung-nhin-thay-design.md` (§6 = quét không gian).

## Criteria

- AC-1: Given `lib/lop-nhin-thay.cjs` (mới) sau hồ sơ, When nạp module và đọc khuôn, Then module xuất `SURFACE_ENUM` (mảng), `SURFACE_ALIAS` (`web` → `ui`, `web-ui` → `ui`), `laMatNguoiNhin(surfaces)` (true cho `[ui]`, `[web]`, `[web-ui]`, `[api, web]`; false cho `[api]`, `[cli]`, `[mobile]`, `[api, mobile]`), `tokenLa(surfaces)` (trả các token ngoài enum ∪ alias, bỏ qua chú thích sau `#`), `coUiObserved(evals)` (true khi ∃ eval `executor: ui-check`, bất kể có `layer:` hay không — đọc-cũ), `nhanLacCho(evals)` (trả id các eval `layer: ui-observed` mà executor ≠ `ui-check`), hằng `UI_OBSERVED_DESCOPE` = `bỏ ui-observed — `; **round-trip khuôn ↔ lib**: `SURFACE_ENUM` **bằng** danh sách rút từ chú thích dòng `surfaces:` của khối `CONTRACT-FRONTMATTER-TEMPLATE` (bản sao khuôn bỏ một giá trị → đỏ nêu giá trị); `coNguoiDungCuoi` của `lib/nguong-o-co-hoi.cjs` trả true cho `[web]` và `[web-ui]` (mutant: bản tại `main` trả false cho `[web]` — chiều đỏ có sẵn), false cho `[api]`; **mutant một-nguồn (gap-probe F3)**: bản sao cây (`lib/` + `scripts/` chép trọn) bỏ `web` khỏi `SURFACE_ALIAS` → cả ba bộ đọc trỏ bản sao đổi kết quả cho `[web]`: `coNguoiDungCuoi` false · `gate-card.js --extract` `ui_observed.applicable: false` · lint không dòng W8; bản lành cả ba chiều ngược (3 bộ đọc × 2 chiều, số assert = 6).
- AC-2: Given fixture hồ sơ code-sinh (contract từ `CONTRACT-FRONTMATTER-TEMPLATE`), When chạy `scripts/eval-coverage-lint.js`, Then (a) `surfaces: [ui]` + evals chỉ `test`/`script` → exit 1, stdout có dòng `W8` nêu slug và cụm «không có eval `ui-check`» và chú giải `W8 =` ở dòng cuối; (b) cùng fixture thêm một eval `executor: ui-check` + `layer: ui-observed` → exit 0; (c) `[web]` và `[web-ui]` → như (a); (d) chỉ `[mobile]` → không dòng W8; (e) `[api, cli]` → không dòng W8; (f) `layer: ui-observed` trên eval `executor: test` → dòng W8 ghim «lạc chỗ» kèm id eval, kể cả khi hợp đồng đã có `ui-check` thật; (g) đọc-cũ: eval `executor: ui-check` không có `layer:` → không dòng W8; (h) `surfaces: [ui, kiosk]` → dòng W8 ghim token `kiosk`, và nghĩa vụ `ui-check` vẫn được chấm riêng; (i) đối chứng cả kho: chạy lint trên `_acceptance/` thật của kit → 0 dòng W8; (j) chế độ gốc kho + `decisions.jsonl` có entry `descope` bắt đầu đúng `bỏ ui-observed — ` → không dòng W8 nghĩa vụ (chuỗi rút từ hằng lib, không gõ tay); (k) entry `bỏ ui-observed:` (dấu hai chấm) → W8 như (a); (l) chế độ `--files` (không có sổ) → W8 như (a). **Dấu hiệu quét dương cho mọi ca vắng-W8 (gap-probe F2):** fixture (d)(e)(g)(j) chèn thêm một AC ngưỡng không eval âm để W1 nổ — stdout PHẢI có `W1` cùng lần chạy mà không có `W8`; ca (i) ghim stdout có «no coverage gaps detected» hoặc ≥1 dòng cảnh báo lớp khác; chiều đỏ của lớp: một fixture cố ý ghi contract sai đường → ca ĐỎ vì thiếu dấu hiệu quét.
- AC-3: Given fixture workspace code-sinh với `status: draft`, When chạy `scripts/gate-card.js` (Cổng Phạm vi) với `--extract` và render HTML, Then (a) `[ui]` + không `ui-check` + không descope → `ui_observed: {applicable: true, present: false, descoped: null}` và HTML có cờ `fwarn` ghim «chưa có bằng chứng lớp nhìn-thấy»; (b) cùng fixture + entry `descope` với `decision` bắt đầu đúng `bỏ ui-observed — ` → `descoped: <id>` và cờ `finfo` nêu id, không còn `fwarn`; (c) có eval `ui-check` → `present: true`, không cờ; (d) `[api]` → `applicable: false`, không cờ; (e) `[mobile]` → `applicable: false`; (f) `[web]` → `applicable: true` (alias); đối chứng seam: `decision` bắt đầu `bỏ ui-observed:` (dấu hai chấm) **không** được nhận → vẫn `fwarn`.
- AC-4: Given fixture workspace `status: verified` có `evidence-report.md` hợp lệ (dựng từ `evidence-report-template.md`), When chạy `gate-card.js` (Cổng Bằng chứng) với `--extract` và render, Then **`present` đọc trên BÁO CÁO, không trên bản khai (gap-probe F1)**: (a) `[ui]` + evals có eval `ui-check` E10 mà block E10 trong báo cáo không đạt (verdict/`exit_code` ≠ 0, hoặc không có `screenshot:`) → `ui_observed: {applicable: true, present: false, declared: 1, passed: 0, descoped: null}` và HTML có cờ ghim «Bằng chứng lớp nhìn-thấy: KHÔNG có» kèm id E10; (b) đối chứng dương cùng fixture: block E10 PASS (`exit_code: 0`, có `screenshot:`) → `present: true`, không cờ, dòng nêu «1 eval `ui-check` đạt»; (c) `[ui]` + không eval `ui-check` nào → `declared: 0`, cờ «KHÔNG có»; (d) entry `bỏ ui-observed — ` ghi SAU seal → nằm trong `decisions_provisional` (khối «CHƯA duyệt») và cờ chuyển sang nêu id; (e) `[cli]` → `applicable: false` (dấu hiệu đã đọc) và HTML không có cụm «lớp nhìn-thấy».
- AC-5: Given repo git fixture với hợp đồng gated trong diff (`surfaces: [ui]`, evidence PASS đã ký), When chạy `scripts/pre-merge-check.sh --base <ref>`, Then (a) không eval `ui-check` → exit 0 và stdout có `NOTE [<slug>]:` ghim «mặt người nhìn» + «không eval `ui-check`» + nêu ngưỡng «2 hợp đồng … một mốc phát hành» + `approved_at` của hợp đồng (đọc frontmatter, không gõ tay — để mốc phát hành đếm «ký trong cửa sổ» bằng một lượt grep); (b) có entry `bỏ ui-observed — ` → NOTE nêu id entry; (c) có `ui-check` → không dòng NOTE lớp nhìn-thấy; (d) `[api, mobile]` (fixture `mk_xl` sẵn có) → không dòng NOTE lớp nhìn-thấy; (e) `[web]` → NOTE như (a); (f) không có `evals.yaml` → không NOTE lớp nhìn-thấy (hồ sơ chưa qua eval-gen — luật ≥1-eval của Cổng 1 lo); (g) lib thiếu (bản sao xoá `lib/lop-nhin-thay.cjs`) → một dòng NOTE «không kiểm được» (fail-open có tiếng), exit 0; (h) cùng fixture (a) chạy `--recheck-all` → dòng NOTE giống (a) (gap-probe F5: đường đếm ngưỡng không chỉ nằm ở diff); (i) entry `bỏ ui-observed:` (dấu hai chấm) → NOTE như (a), không nêu id (gap-probe F4). **Dấu hiệu quét dương cho (c)(d)(f):** stdout có `rules ran=` và (c)(d) có dòng gated nêu slug. Diff của `pre-merge-check.sh` so `main` CHỈ THÊM dòng (luật DV5).
- AC-6: Given bảy văn bản nghi thức sau hồ sơ, When đọc với phạm vi cắt đúng, Then (i) `skills/acceptance/SKILL.md` Phase 2 có mục mới nêu `layer: ui-observed`, cụm «theo hợp đồng» và chuỗi `bỏ ui-observed — `; (ii) `feature-loop/skills/feature-loop/SKILL.md` dòng evals ở S1 có mệnh đề «≥1 eval `ui-check`» cho surface mặt người nhìn, và prompt gap-probe (4) có cụm «mặt người nhìn mà không eval `ui-check`»; (iii) `skills/acceptance/references/eval-executors.md` có section heading chứa «Pairing mechanics — `layer: ui-observed`»; (iv) `CONTEXT.md` term **Layer** nhắc `ui-observed` và term **Surface** nhắc alias `web` → `ui`; (v) `contract-template.md` chú thích `surfaces:` liệt đủ `SURFACE_ENUM` (đã đo ở AC-1); (vi) `commands/acceptance-init.md` 3b nhắc `@playwright/cli` làm lệnh `capture.ui`; (vii) chuỗi `bỏ ui-observed — ` trong (i) và (ii) **bằng** hằng `UI_OBSERVED_DESCOPE` của lib (round-trip ba đầu); bản sao gỡ từng mệnh đề → reader trên bản sao ĐỎ nêu mệnh đề.

## Coverage

- Trục A — vật mới: lib một-nguồn | luật S2 | W8 lint | cờ card Cổng 1 | cờ card Cổng 2 | NOTE pre-merge | câu gap-probe | alias surfaces | descope có tên | gợi ý playwright-cli [thước CE: sáu mục owner duyệt 08/09 — mỗi mục ≥1 ô; AC-1..AC-6 phủ 10/10]
- Trục B — bộ đọc: eval-coverage-lint | gate-card | pre-merge | nguong-o-co-hoi | acceptance SKILL | feature-loop SKILL | eval-executors | CONTEXT | contract-template | acceptance-init [thước CE: `grep -l backend-effect` toàn repo (ngoài `_acceptance/`, `docs/`, tests) = tập bộ đọc của luật gương; mỗi file có ca ở AC-2..AC-6 hoặc có lý do gạch bên dưới]
- Trục C — chiều: dương | đỏ ghim thông điệp | đọc-cũ (`ui-check` không nhãn) | mutant cô lập lớp (mobile · api · web · nhãn lạc chỗ · dấu hai chấm) | round-trip hằng (enum ↔ khuôn, descope ↔ SKILL) [thước CE: MEASURE-BIRTH-CLAUSE; `[NGÀNH: ISTQB test levels — component vs system]` phân biệt lớp mã / lớp người nhìn]
- Ô gạch có lý do: lưới ghi × W8 (`acceptance-evidence-gate.js` đã giữ frame+observed trên mọi `ui-check` — răng có sẵn) · s4-args/acceptance-verify × W8 (không đổi luồng chạy, chỉ đổi luồng sinh eval) · evidence-page × W8 (không đụng, frame S4 có lại thì slideshow tự sống) · `hooks/` không chạm dù T3 do `lib/`.

## Out of scope

- NOTE → VIOLATION ở pre-merge: chờ ngưỡng đếm (2 hợp đồng mặt người nhìn ký không frame trong một mốc phát hành).
- Nghĩa vụ theo từng AC có vế Then «người thấy»: chờ ngưỡng, owner chốt theo hợp đồng.
- Đưa frame design-pass (S1-D) lên card/trang Cổng Bằng chứng: bản mẫu trước Cổng 1 cạnh bằng chứng là bẫy hallucinated completion.
- Kit ship browser hay lệnh chụp: chụp là của repo qua `capture.ui`; kit chỉ gợi ý.
- Migrate hồ sơ cũ (thêm `layer:` hay sửa `surfaces: web`): đọc-cũ, không bắt.
- Sửa `evidence-page.js`, thêm lưới ghi mới, đếm frame thật trong `evidence/` ở pre-merge (Later).

## Notes

- Neo máy của W8 là `executor: ui-check` (lưới ghi `acceptance-evidence-gate.js` schema v2 đã chặn block thiếu `screenshot:`/`observed:`); `layer: ui-observed` là nhãn khai để luật ghép cặp đọc đối xứng + răng lạc chỗ. Lý do không neo nhãn: hồ sơ cũ vào diff ở chiến dịch ghim lại sẽ sinh NOTE giả, hỏng số đếm ngưỡng.
- Giới hạn khai: pre-merge W8 chỉ chạy khi có `node` + lib (NOTE «không kiểm được» khi thiếu); không có bản awk lùi vì tầng này là NOTE, không chặn.
- Giới hạn khai: ở Cổng 1 và pre-merge nghĩa vụ đo ở tầng `evals.yaml` (bản khai); ở Cổng 2 card đọc block của eval `ui-check` trong `evidence-report.md` (đạt = `exit_code: 0` + `screenshot:`), chưa đếm file frame trong `evidence/` — ca «khai rồi agent chết» đã có răng riêng (`ui-check agent bi skip/chet` → BLOCKED).
- Known limits (ký sau S4-r3, council 08/09 — chỉ-TRỪ, không round 4): (1) LNT1 chạy lint trên bản sao mutant chỉ ghim nhánh nghĩa vụ VẮNG, chưa ghim dấu hiệu bản sao đã chạy (hình dạng 4); (2) LNT6 (iv)(vi) kiểm hai câu luật bằng chuỗi có mặt, chưa kiểm quan hệ alias `web`→`ui` và `@playwright/cli`→`capture.ui` (hình dạng 3). **Ngưỡng đang đếm:** lần đầu một hồ sơ có mặt người nhìn ở repo tiêu thụ ship không frame mà W8/thẻ/NOTE đều im → mở hợp đồng T2 docs+tests vá cả hai, cùng bảy mục nhỏ ngoài hợp đồng (NOTE nuốt lỗi lib · regex chú thích `\s*#` · `html()` bỏ mã thoát · chiều đỏ có sẵn dựa nhánh `main` · `LNT_AVAILABLE` không ai đọc). Ca PM-LNT-dv5 (diff so nhánh `main`) đã GỠ khỏi suite sau round 3: DV5 «chỉ thêm dòng» được chứng ở bằng chứng ba round, không phải luật vĩnh viễn của suite.
- Quy tắc đếm ngưỡng (D3): đếm slug PHÂN BIỆT có NOTE lớp nhìn-thấy mà `approved_at` nằm trong cửa sổ giữa hai mốc phát hành; hồ sơ cũ bị kéo vào diff ở chiến dịch ghim lại có `approved_at` cũ nên loại được bằng chính dòng NOTE.
