# Cross-layer rail wave 2 — Surface mobile + răng CI cho cặp-eval (schema GIỮ v2) — Design

**Date:** 2026-07-25

**Status:** Approved in chat (scope + approach A1 + design sections đã duyệt);
written-spec review pending

**Target:** contract-template (surfaces enum) + eval-executors (§Mobile
mechanics, rule 3b) + acceptance SKILL root/codex + `eval-coverage-lint.js`
(W5) + `pre-merge-check.sh` (VIOLATION cặp-eval) + `commands/acceptance-report.md`
& codex skill (đồng hồ đo network) + acceptance-init (binding `e2e_mobile`) +
feature-loop SKILL root/codex (1 câu CT1) + README Known limitations.

**Compatibility:** acceptance-gate 1.19.0 → **1.20.0** · feature-loop 1.16.0 →
**1.16.1** (docs 1 câu; lockstep + pin-suite cập nhật literal). KHÔNG đụng:
`hooks/`, `lib/evidence-core.js`, `scripts/recheck-evidence.js` — evidence
`schema_version` **GIỮ 2**, wave thứ ba liên tiếp (bất biến kiểm bằng
`git diff --stat main -- hooks/ lib/ scripts/recheck-evidence.js` = rỗng).
Contract cũ không surfaces mobile, evals cũ không layer: — hành xử y nguyên;
backward-tolerant tuyệt đối.

## 1. Vì sao — và vì sao KHÔNG phải "wave 2 nguyên bản"

Trigger thật: **đã có repo mobile** (XCUITest/Espresso) chuẩn bị dùng kit —
đúng điều kiện spec wave 1 §5 đặt cho phần mobile. Khi soi lại thì "wave 2
nguyên bản" (siết `network_observed` bằng schema v3) KHÔNG phục vụ trigger này:

- Trên mobile, `network_observed` **luôn `n-a (driver)`** theo thiết kế —
  hook network không thêm lớp bảo vệ nào cho đúng ca ducnh13.
- Luật scoping network chưa từng chạy trên feature thật nào (rail wave 1 mới
  merge, `_acceptance/` chưa có contract nào mang tag) → siết bây giờ là rủi
  ro HẠ TẦNG (api_base sai, browser tool khác nhau, chuỗi hành trình
  prompt-level chưa bị stress) trả bằng REJECT/BLOCKED oan tại write-time —
  dạng ồn đắt nhất, đúng thứ C2 (30%) cấm.
- Thứ thật sự chặn false-green mobile là **cặp eval**: criterion
  `(cross-layer)` phải có bằng chứng `layer: backend-effect`. Wave 1 để luật
  này ở advisory (W4 + gap-probe + human). Wave 2 này cho nó RĂNG — nhưng ở
  đúng tầng rẻ và an toàn.

**Insight phân tầng (quyết định kiến trúc của wave):** hook write-time kiểm
*tính xác thực của bằng chứng trong report*; còn "cặp eval đầy đủ" là thuộc
tính của *bộ artifact* (contract + evals.yaml) — và kit đã có sẵn một máy
enforce đọc cả hai file đó ở merge boundary: `pre-merge-check.sh` (chặn mọi
runtime, kể cả Codex và sửa tay ngoài hook). Đặt răng ở đó = 0 surface parser
mới trong hook, 0 schema bump.

## 2. Quyết định thiết kế (đã duyệt trong chat)

| Trục | Quyết định |
|---|---|
| Scope | Mobile first-class + răng CI cặp-eval + đồng hồ đo network. KHÔNG siết `network_observed` (deferred có điều kiện — §5) |
| Mobile mechanics | KHÔNG executor mới: mobile flow = eval `test` thường, binding `config:executors.test.e2e_mobile` (XCUITest `xcodebuild test…` / Espresso `gradlew connectedAndroidTest`), chạy machine lane sẵn có (dedupe, baseline, run-log, carry-forward, MODEL_ROUTES) |
| Bằng chứng mobile | Exit code runner = bằng chứng **LỚP UI** (degradation row wave 1 giữ nguyên); sự thật xuyên lớp nằm trọn ở paired `layer: backend-effect` eval |
| Răng cặp-eval | `pre-merge-check.sh` VIOLATION (chặn merge) khi feature gated có AC tag `(cross-layer)` mà evals.yaml không có eval nào của AC đó khai `layer: backend-effect`. Write-time GIỮ advisory (W4) |
| Backend-target (V4 mobile) | Human-glance có chỗ bám máy: dòng quy ước trong contract `## Notes` + lint W5 advisory. KHÔNG claim máy kiểm được chữ "real" (bài học server-witness DQ HC2) |
| Đồng hồ đo | `/acceptance-report` đếm phân bố `network_observed` — dữ liệu quyết định siết network sau này |
| Design-lane | Surface `mobile` KHÔNG kích hoạt CT1/design-loop (web-only) — 1 câu trong feature-loop SKILL |
| Hook/schema | Không đụng — bất biến wave thứ ba |

## 3. Chi tiết

### 3.1 Surface `mobile`

**contract-template.md:** dòng frontmatter thành
`surfaces: [{{api|cli|sdk|ui|mobile, comma-separated}}]`; Frontmatter rules
thêm 1 gạch: `mobile` = app flows driven by the repo's native E2E runner
(XCUITest/Espresso/Maestro/Detox…), evidence is UI-layer only.

**eval-executors.md:**
- Bảng executor, row `test`: surface `api / backend / sdk` → `api / backend /
  sdk / mobile flow (native E2E runner)`.
- Executor selection rules, chèn **rule 3b** sau rule 3:
  > 3b. Criterion observable only through the MOBILE app → still `test`,
  > bound to `config:executors.test.e2e_mobile` — the runner's exit code is
  > UI-LAYER evidence only (see §Mobile mechanics). Never `ui-check` (no
  > browser, no network log).
- Section mới **§Mobile mechanics** (sau §Pairing mechanics):
  - Binding `config:executors.test.e2e_mobile`; ví dụ scaffold cho XCUITest
    và Espresso; simulator/emulator vắng trên máy verify → `cannotRun` →
    BLOCKED (không bao giờ silent skip).
  - `network_observed` không tồn tại trên làn này — mọi sự thật xuyên lớp
    thuộc paired `layer: backend-effect` eval; criterion `(cross-layer)`
    mobile bị **CI chặn merge** khi thiếu cặp (§3.2).
  - Vận hành: mobile eval NÊN khai `paths:` (carry-forward P1 đỡ chạy lại
    suite chậm); KHÔNG đưa e2e mobile vào `feature_loop.suite_keys` (chạy mỗi
    round → đốt round vì chậm/flaky).
  - Backend-target: mỗi feature mobile ghi 1 dòng trong contract `## Notes`:
    `Mobile backend target: local|staging|mock — <ghi chú>`. Gate-1 human
    liếc dòng này (mock ⇒ hiểu rõ paired eval đang chứng minh gì); máy KHÔNG
    xác thực giá trị (engine/binding split) — chỉ W5 nhắc sự hiện diện.

**skills/acceptance/SKILL.md (root + codex overlay):** Phase 1 step 4 nhắc
`mobile` trong surfaces; Degradation table thêm row:
`| Mobile e2e runner needs a simulator/emulator absent on the verify machine | cannotRun → BLOCKED + reason — never a silent skip or a downgrade |`

**Lint W5** (`eval-coverage-lint.js`, advisory pattern W1/W3/W4): frontmatter
`surfaces:` chứa `mobile` mà toàn văn contract không có dòng khớp
`/^\s*Mobile backend target:/im` → warn
`W5 surfaces include mobile but the contract has no "Mobile backend target:" line (## Notes) — declare local|staging|mock so the Gate-1 human can eyeball the V4 risk.`
Footer thêm định nghĩa W5. Fixtures fire/no-fire/no-mobile.

**acceptance-init:** câu hỏi mới (sau 2c2): mobile surface? → thu lệnh runner
→ config template thêm dòng comment trong `executors.test`:
`# e2e_mobile: "xcodebuild test -project App.xcodeproj -scheme AppUITests -destination 'platform=iOS Simulator,name=iPhone 16'"   # or: "./gradlew connectedAndroidTest" — exit code = UI-layer evidence only`
kèm 1 câu nhắc quy ước backend-target per-feature.

### 3.2 Răng CI — VIOLATION cặp-eval trong `pre-merge-check.sh`

Vị trí: vòng per-slug hiện có, SAU block Gate-1 (`approved_by`/`gate1_skipped`),
TRƯỚC `report="$dir/evidence-report.md"` — tức chỉ chạm feature đang bị gate
(status `implemented|verified|signed-off`, tier thuộc `required_for`); draft/
approved để W4 lo ở Gate 1.

Luật (awk một pass mỗi file, quote/comment/case-tolerant — đồng bộ ngữ nghĩa
với `fieldVal` của lint):
1. Contract `## Criteria`: thu các `AC-n` có `(cross-layer)` (case-insensitive).
   Không có AC nào → bỏ qua toàn bộ block.
2. Có AC tagged mà `evals.yaml` không tồn tại → **NOTE** `pairing unverifiable
   — cross-layer criteria declared but no evals.yaml` (fail-open).
3. Parse `evals.yaml` theo block `- id:`: lấy `criterion:` + `layer:` (strip
   quote, strip ` # comment`, so sánh `backend-effect` case-insensitive) → tập
   AC có bằng chứng backend.
4. Mỗi AC tagged ∉ tập đó → **VIOLATION** (violations+1, chặn merge):
   `AC-x is tagged (cross-layer) but no eval of it declares layer:
   backend-effect — a cross-layer criterion would merge on UI-only evidence;
   add the paired test/script eval, or untag it with the human's sign-off at
   Gate 1.`

Đây là backstop mọi runtime. Ghi chú trong script comment: đây là răng của
pairing rule (c); write-time giữ advisory theo phân tầng §1.

### 3.3 Đồng hồ đo network — `/acceptance-report`

`commands/acceptance-report.md` (+ `codex/acceptance-gate/skills/acceptance-report/SKILL.md`):
- Bước Scan thêm: mỗi `evidence-report.md`, thu các giá trị
  `network_observed:` (word đầu sau dấu hai chấm, strip quote).
- Bước Print thêm: dòng
  `Network truth (advisory rail): clean N · app-fail N · no-app-traffic N · third-party-only N · n-a N · unscoped N · unscoped-partial N — K feature có dữ liệu`
  (bucket `n-a` gộp cả `n-a (driver)` lẫn `n-a (tool-error: …)` — so khớp
  theo prefix `n-a`)
  + liệt kê slug có `app-fail`/`no-app-traffic` (mỗi cái 1 dòng action item);
  khi K ≥ 5 in thêm: `đủ mẫu vận hành — cân nhắc máy-kiểm hóa network
  (schema v3, xem spec wave 2 §5)`.
- Read-only guarantee giữ nguyên.

### 3.4 Ranh giới design-lane + README

- `feature-loop/skills/feature-loop/SKILL.md` (S0 mục CT1 signals) + bản
  codex: thêm 1 câu — surface `mobile` KHÔNG phải web-UI surface: không kích
  hoạt CT1/CT2/design-loop; làn design chỉ áp cho `ui`.
- README Known limitations: bullet mobile wave 1 được THAY bằng bản mới:
  mobile surface first-class từ 1.20; criterion `(cross-layer)` mobile thiếu
  paired eval giờ bị **pre-merge chặn merge** (không còn thuần kỷ luật);
  network trên mobile vẫn `n-a` vĩnh viễn wave này; backend-target là
  human-glance + W5, máy không xác thực.

## 4. Cái KHÔNG làm (ghi để khỏi tái thảo luận)

- KHÔNG enforce `network_observed` / schema v3 / `evaluateNetwork()` — xem §5.
- KHÔNG executor `mobile-check` / driving simulator MCP (repo có runner thật).
- KHÔNG `backend-log-assert` (vẫn thiếu correlation id — S4 song song).
- KHÔNG máy-xác-thực backend-target (engine/binding split).
- KHÔNG sửa spec wave 1 (bản ghi lịch sử); spec này supersede phần "wave 2/3"
  của nó.

## 5. Điều kiện siết network (schema v3) — để wave sau quyết bằng dữ liệu

Từ đồng hồ đo §3.3: khi **≥5 feature** có dữ liệu `network_observed` thật VÀ
không ghi nhận ca oan (app-fail sai do scoping/nhiễu), thì mở wave "schema v3
+ `evaluateNetwork()` copy pattern `evaluateObserved`" như spec wave 1 §5 đã
phác — lúc đó cân nhắc thêm sequencing `after: ui`. Trước ngưỡng đó, mọi đề
xuất siết network phải kèm dữ liệu.

## 6. Files touched (authoring; plugins/ sinh bằng `scripts/sync-plugin-packages.sh`)

| # | File | Thay đổi |
|---|---|---|
| 1 | `skills/acceptance/references/contract-template.md` | surfaces enum + mobile + frontmatter note |
| 2 | `skills/acceptance/references/eval-executors.md` | bảng test row · rule 3b · §Mobile mechanics |
| 3 | `skills/acceptance/SKILL.md` | Phase 1 surfaces note · degradation row simulator |
| 4 | `scripts/eval-coverage-lint.js` | W5 + footer |
| 5 | `tests/scripts/run-tests.sh` | fixtures W5 (L14-L16) + PM-cases pre-merge (PM01-PM06) |
| 6 | `scripts/pre-merge-check.sh` | block VIOLATION cặp-eval (§3.2) |
| 7 | `commands/acceptance-report.md` | đồng hồ đo network (§3.3) |
| 8 | `commands/acceptance-init.md` | câu hỏi mobile + scaffold `e2e_mobile` |
| 9 | `README.md` | bullet mobile mới (Known limitations) |
| 10 | `feature-loop/skills/feature-loop/SKILL.md` | 1 câu CT1: mobile ≠ design-lane |
| 11 | `codex/acceptance-gate/skills/acceptance/SKILL.md` | parity mục 3 |
| 12 | `codex/acceptance-gate/skills/acceptance-report/SKILL.md` | parity mục 7 |
| 13 | `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` | parity mục 10 |
| 14 | manifests + `scripts/sync-plugin-packages.sh` echo + `tests/plugins/run-tests.sh` pin | 1.20.0 / 1.16.1 |

## 7. Test plan

- **PM-cases (pre-merge pairing):** PM01 tagged + thiếu cặp → exit 1 (VIOLATION);
  PM02 tagged + có `layer: backend-effect` → clean; PM03 tagged + evals.yaml
  vắng → exit 0 + NOTE; PM04 không tag → block không chạy; PM05 quote/comment/
  mixed-case (`layer: "Backend-Effect"  # note`) → clean; PM06 feature draft
  (chưa gated) → ngoài scope, exit 0.
- **W5:** L14 mobile thiếu dòng target → warn; L15 có dòng → clean; L16 không
  mobile → clean.
- **Bất biến:** tests/hooks 51/51 + tests/workflows xanh NGUYÊN VẸN (không
  đụng schema/workflow); `git diff --stat main -- hooks/ lib/
  scripts/recheck-evidence.js` rỗng; pin-suite P03/P04/P22 literal mới.

## 8. Chi phí & rủi ro (đã duyệt trong chat)

- Răng cặp-eval là rủi ro **deterministic, do con người** (over-tagging →
  VIOLATION oan → sửa artifact là hết), không phụ thuộc driver/hạ tầng — khác
  bản chất với siết network. Fail-open khi thiếu file.
- Mobile e2e chậm/flaky: đã chặn bằng lập trường vận hành (paths, không
  suite_keys) + cannotRun→BLOCKED.
- Chi phí run-time mỗi round: 0 thay đổi (mobile eval là eval test thường;
  pairing check chạy ở CI; metrics chạy khi human gọi /acceptance-report).
