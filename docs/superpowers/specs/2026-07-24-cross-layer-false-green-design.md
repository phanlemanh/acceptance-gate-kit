# Chặn false-green xuyên lớp — Tag → Pair → Wire-truth (bản tổng hợp hội đồng) — Design

**Date:** 2026-07-24

**Status:** Approved in chat (hội đồng 21-agent + bản tổng hợp 9 sửa đổi đã duyệt);
written-spec review pending

**Target:** skill `acceptance` (Phase 1/2/3 + references) + `eval-coverage-lint.js`
(W4) + workflow `acceptance-verify.js` (prompt ui/synthesize + UI_SCHEMA additive)
+ skill `feature-loop` (gap-probe line + atomic-pair carry) + codex parity
(`acceptance_ui_verifier.toml`, feature-loop-codex SKILL) + `pre-merge-check.sh`
(NOTE mới) + acceptance-init (binding `api_base`) + README Known limitations.

**Compatibility:** acceptance-gate bump minor · feature-loop bump minor (lockstep
theo GUIDE, số tương đối tại thời điểm ship). KHÔNG đụng: `hooks/`,
`lib/evidence-core.js`, `scripts/recheck-evidence.js` (evidence `schema_version`
GIỮ 2), design-loop, gate-card.js/evidence-page.js, MODEL_ROUTES. Contract/report
cũ (không tag, không vocab) hành xử y như hôm nay — backward-tolerant tuyệt đối,
không migrate.

## 1. Vì sao

**False-green xuyên lớp:** gate ghi PASS bằng bằng chứng lớp trình bày (frame đẹp,
assertion UI exit 0) trong khi định nghĩa đúng của "hoàn thành" là đường đi xuyên
lớp: user action → FE → API → backend → hiệu ứng dữ liệu thật. Ca gốc đã xảy ra
(báo cáo ducnh13 2026-07-24, đã kiểm chứng từng trích dẫn): E2E mobile PASS trong
khi API backend lỗi. Kit hiện không có luật nào buộc bằng chứng xuyên lớp:

- Luật chọn executor chọn theo **nơi-quan-sát-được** (eval-executors.md rule 3),
  không theo **lớp-đi-qua** → bộ eval của flow UI-gọi-API được phép UI-only.
- Assertion ui-check = HTTP status **của trang** + DOM marker, "SSR thì curl+grep
  đủ" (acceptance-verify.js prompt ui) — mù hoàn toàn XHR/fetch app bắn đi;
  `UI_SCHEMA` không có field network.
- Mobile không phải surface hợp lệ; simulator không có đường đọc network.

Biến thể phải cân nhắc (thước đo độ kín của thiết kế này):

| V | Biến thể | Bản chất |
|---|---|---|
| V1 | SPA client-side fetch fail sau load | page-status + DOM vẫn xanh |
| V2 | SSR + driver curl/grep | curl không chạy JS — không bao giờ thấy XHR |
| V3 | Optimistic UI / dead-button / error nuốt | UI "thành công" trước hoặc không cần backend |
| V4 | E2E runner chạy trên mock/stub sót | exit 0 thật nhưng không đụng backend thật |
| V5 | Mobile simulator | screenshot/tap/swipe only — đợt này chỉ cần lập trường |
| V6 | Eval không phân biệt (green-on-both) | đã có A/B baseline + Analyst bắt một phần — không phá |

## 2. Quy trình quyết định (hội đồng 2026-07-24)

Tiêu chí chốt với chủ kit trước khi thiết kế: ràng buộc cứng HC1 (triết lý kit:
engine/binding split, backward-tolerant, zero-dependency, hook chỉ enforce cái
máy-kiểm được) · HC2 (không mở đường tự-PASS: bằng chứng phải đối chiếu được) ·
HC3 (chặn ca chuẩn web) · HC4 (mobile: degradation stance tường minh). Trọng số:
**C1 chi phí máy/round 30% · C2 độ ồn 30%** · C3 độ kín 20% · C4 chi phí triển
khai 10% · C5 human-gate 10%.

Hội đồng: 5 designer độc lập mù lẫn nhau (eval-first / evidence-first /
server-witness / minimalist / refine-report — chỉ người cuối được xem báo cáo
gốc) × 3 giám khảo lens (cost / noise / adversarial), điểm = median, tổng hợp JS
thuần; 1 critic context sạch soi phương án thắng.

| Hạng | Giải pháp | Tổng | Ghi chú |
|---|---|---|---|
| 1 | refine-report — Tag → Pair → Wire-truth | 3.9 | thắng, giữ làm khung |
| 2 | evidence-first — network rail + schema v3 | 3.8 | `evaluateNetwork()` → wave 2 |
| 3 | eval-first — Layer-Path Pairing thuần design-time | 3.5 | graft: marker chuẩn, bind suite |
| — | server-witness — nonce witness, khóa v3 | ~~3.9~~ | LOẠI HC3 (presence ≠ authenticity); graft: nonce |
| — | minimalist | ~~3.7~~ | LOẠI HC2+HC3 (khai rail không có chỗ bám engine) |

Spec này = phương án thắng **+ 9 sửa đổi** từ critic (5 finding P0/P1/P2) và
á quân — các sửa đổi đã hòa vào từng mục §3, không liệt kê riêng.

## 3. Thiết kế wave 1 (advisory-first — 0 hook mới, 0 agent mới, 0 schema bump)

### 3.1 Tag `(cross-layer)` trong contract (Phase 1)

- SKILL.md Phase 1 step 2, cạnh luật tag `(judgment)`: criterion có When/Then đi
  qua backend (UI flow kích hoạt API call / mutation dữ liệu) PHẢI gắn
  `(cross-layer)` vào criterion text. contract-template.md ghi quy ước.
- Đây là đầu bám **deterministic** cho toàn chuỗi (rule (c), W4, gap-probe, hook
  wave 2) — thay hẳn proxy "surfaces chứa api" (vừa ồn vừa sót).
- Tag-omission là điểm yếu chấp nhận của cơ chế tag-based (xem §7); lưới bắt ở
  §3.6.

### 3.2 Pairing rule (c) + mechanics authoring (Phase 2, EVAL-GEN)

Chèn sau rule (b) trong coverage check (cùng văn phong), + caveat vào executor
selection rule 3:

> (c) **Xuyên lớp.** Criterion tag `(cross-layer)` bắt buộc ≥1 eval khai
> `layer: backend-effect` — executor `test`/`script`, `cmd` là `config:` ref —
> chứng minh backend của CHÍNH hành động đó hoạt động thật. ui-check một mình
> KHÔNG BAO GIỜ đủ làm bằng chứng cho criterion xuyên lớp.

Mechanics authoring (viết vào eval-executors.md, mục mới §Pairing mechanics):

- **Field `layer: backend-effect`** (additive như `runs:`; eval không có field →
  hành vi cũ): đầu bám máy-đọc cho W4/lint, tránh W4 bị thỏa mãn rỗng bởi
  script không-backend (design-gate của rule 2b, VLM-assert đều là `script`).
- **Effect-eval là self-driving có nonce**: lệnh tự tạo hiệu ứng theo định danh
  riêng của nó rồi assert (POST X → GET/query X) — chứng minh "đường backend này
  sống thật", KHÔNG claim chứng minh wiring UI→API.
- **CẤM authoring "GET assert hiệu-ứng-do-flow-UI-tạo"** trong wave 1: machine
  lane và ui lane chạy CÙNG một `parallel()` (acceptance-verify.js) — eval kiểu
  đó race với ui agent → FAIL/BLOCKED oan, đốt round. Sequencing (`after: ui`)
  là ứng viên wave 2, không phải đợt này.
- **Wiring UI→API chứng minh ở chính ui-check** của criterion `(cross-layer)`:
  (1) marker assert phải là **dữ liệu server-derived** (id/giá trị chỉ server
  sinh được sau flow) — không toast/DOM tĩnh; (2) **assert-sau-reload** khi flow
  là mutation (loại optimistic DOM); (3) nonce-correlation khuyến nghị: flow gõ
  một định danh phân biệt được (vd chuỗi cố định per-eval khi env được reset
  giữa round), marker/effect assert đúng bản ghi mang định danh đó.
- **Bind vào suite cmd sẵn có khi được** (itest của chính feature): dedupe của
  machine lane đưa chi phí biên ~0; MODEL_ROUTES (machine → model rẻ), A/B
  baseline, run-log, carry-forward tự áp vì đây là eval máy bình thường.

### 3.3 Lint W4 (advisory, pattern W1/W3)

`eval-coverage-lint.js`: `parseACs` thêm `crossLayer:
/\(cross-layer\)/i.test(...)` (cùng dạng detect `(judgment)` hiện có);
`parseEvals` bắt thêm 2 field `executor:` và `layer:` (regex trong loop sẵn có).

> W4: AC tag `(cross-layer)` mà trong các eval CỦA CHÍNH AC ĐÓ (khớp field
> `criterion`) không eval nào mang `layer: backend-effect` → "UI-only evidence
> cho criterion xuyên lớp — cần ≥1 eval hiệu ứng backend (test/script,
> layer: backend-effect)".

Advisory đúng nghĩa W1/W3: exit 1 để human đọc ở Gate 1 (đường trình hiện có:
SKILL Phase 2 step 4 + `/approve`), KHÔNG auto-block, fail-open khi parse lỗi.
KHÔNG sửa gate-card.js (nó không gọi lint — đã kiểm chứng; không đổi trong đợt
này). Fixture test fire/no-fire vào harness `tests/scripts/` sẵn có.

### 3.4 Network-truth trong ui agent sẵn có (runtime, advisory)

Prompt ui-check (acceptance-verify.js) thêm khối sau bullet `observed`:

- Driver là browser tool có đường đọc network (Claude Browser / Chrome MCP /
  Playwright: `read_network_requests` + `read_console_messages`): SAU khi drive
  flow, đọc failed requests + console errors, dump thô vào
  `evidence/E{id}-network.txt`, trả field `networkObserved` theo vocab §3.4.1.
  Request FAIL-eligible fail → `exitCode ≠ 0` kể cả frame đẹp (mở rộng rail
  `observed:` từ pixels sang wire).
- `UI_SCHEMA` thêm 1 field **optional** `networkObserved` (string) — structured
  output nội bộ workflow, không phải evidence schema; output cũ không vỡ; field
  tự chảy vào payload synthesize qua spread hiện có.

#### 3.4.1 Vocab chữ (né bẫy L1 CONSISTENCY — tiền lệ `baseline: red/green/n-a`)

`network_observed:` trong report chỉ nhận CHỮ; mọi status/exit số thô nằm trong
`E{id}-network.txt`, CẤM lọt vào report (report PASS không được chứa token exit
khác 0 / `verdict: FAIL`).

| Vocab | Nghĩa | Verdict eval |
|---|---|---|
| `clean` | CÓ traffic app-scope quan sát được, tất cả OK | không đổi |
| `no-app-traffic` | cửa sổ drive không thấy request nào tới app-scope | không FAIL — nhưng là cờ dead-button cho criterion `(cross-layer)` (human soi ở Gate 2) |
| `third-party-only` | chỉ third-party fail, app-scope sạch | không đổi |
| `app-fail` | ≥1 request FAIL-eligible fail | eval FAIL (exit ≠ 0) |
| `n-a (driver)` | driver không đọc được network (curl+grep, mobile, capture-only) | không FAIL — gánh chuyển sang pairing §3.2 |
| `n-a (tool-error: <lý do>)` | tool đọc network tự lỗi/rỗng bất thường | không FAIL, ghi lý do vào outputTail |
| `unscoped` | chưa khai `dev_server.url`/`api_base` | note-only, không bao giờ FAIL |
| `unscoped-partial` | thấy XHR tới origin lạ ngoài scope đã khai | note-only — Gate 2 thấy "có traffic ngoài scope" thay vì bị trấn an |

`clean` BẮT BUỘC hàm ý "đã thấy traffic" — không có traffic phải ghi
`no-app-traffic`. Đóng nước đi fake-`clean` rẻ nhất ở tầng ngữ nghĩa; đối chiếu
máy ở §3.8 và hook ở wave 2.

#### 3.4.2 Luật scoping FAIL-eligible (viết nguyên văn vào eval-executors.md §Network truth)

1. FAIL-eligible = fetch/XHR có URL khớp origin `dev_server.url` HOẶC bất kỳ
   prefix nào trong `dev_server.api_base` (**list**, §3.9). Analytics, CDN,
   tracker, mọi third-party: KHÔNG BAO GIỜ FAIL — gộp `third-party-only`.
2. Trong tập FAIL-eligible: connection-error / timeout / status ≥500 → FAIL.
   4xx → FAIL TRỪ KHI `expected` của chính eval khai tường minh status đó
   (ca should-NOT-fire 401/403/404 không bị đánh oan).
3. Static asset (sourcemap, favicon, ảnh/font) kể cả app-origin → note, không
   FAIL. Document request của trang đã có assertion page-status sẵn lo.
4. Thiếu binding → `unscoped`; driver mù → `n-a (driver)`; tool lỗi →
   `n-a (tool-error)`. Cả ba không bao giờ FAIL.
5. Residual chấp nhận CÓ CHỦ ĐÍCH: job/poller nền bắn 5xx vào app-scope trong
   cửa sổ drive → vẫn FAIL (5xx trên API của chính app trong lúc drive không
   bao giờ là "clean"); van xả = `human_override` ở Gate 2 với lý do ghi lại.

### 3.5 Chuỗi hành trình `network_observed` (chống fabrication-by-default)

- **Synthesize prompt** (acceptance-verify.js): với block eval ui-check, chép
  NGUYÊN VĂN `networkObserved` vào field `network_observed:`; kết quả ui THIẾU
  field → ghi `n-a (driver)`; TUYỆT ĐỐI KHÔNG tự suy ra `clean` (đối xứng luật
  run_id/baseline đã có trong chính prompt đó).
- **Đường standalone acceptance-gate** (SKILL.md Phase 3): verify-subagent không
  đọc eval-executors.md → chép luật scoping + vocab (dạng nén) vào chính
  instruction block Phase 3 step 1-2, chỗ subagent thật sự đọc.
- **Codex**: `acceptance_ui_verifier.toml` (bản codex/ authoring) ghi lập trường
  thật thay vì parity danh nghĩa: harness codex thường không có đường đọc
  network → `network_observed: n-a (driver)` mặc định, chỉ claim khác khi
  harness thật sự có tool; feature-loop-codex SKILL bước viết report chép cùng
  luật copy-verbatim/missing→n-a. Degradation codex ghi thành văn.
- **Template** (evidence-report-template.md): dòng `network_observed:` ADVISORY
  (hook KHÔNG enforce wave này — đúng vòng đời rail `observed:` thời tiền-v2)
  + vocab + pointer file txt + cấm token thô.

### 3.6 Gap-probe cross-check #4 (feature-loop) + lập trường standalone

- Prompt gap-probe S1#7, mục cross-check (4) thêm: "· criterion nào When/Then đi
  qua backend mà THIẾU tag `(cross-layer)` hoặc chỉ có eval lớp UI
  (ui-check/judgment)". Đây là lưới bắt tag-omission trong flow chính.
- Standalone acceptance-gate KHÔNG có gap-probe: ghi thành văn (README Known
  limitations) rằng ở standalone, lưới tag-omission chỉ còn lint W4 (khi tag có)
  + human Gate 1 — cùng hạng tin cậy W1/W3, không claim hơn.

### 3.7 Atomic-pair carry-forward (feature-loop S4, chuẩn bị args P1)

1 câu luật, 0 code engine: eval thuộc criterion tag `(cross-layer)` chỉ được vào
`carriedEvals` khi TOÀN BỘ eval của criterion đó đủ điều kiện carry; bất kỳ
thành viên nào phải chạy lại → chạy lại cả cặp. Đóng ca "delta chỉ chạm frontend
→ ui-check chạy lại nhưng bằng chứng backend là đồ round cũ" (regression wiring
lọt qua đúng cơ chế tiết kiệm token Đợt 5).

### 3.8 Pre-merge NOTE (máy-kiểm rẻ, chưa cần hook)

`pre-merge-check.sh`: report có `network_observed: clean` hoặc `app-fail` mà
`evidence/E{id}-network.txt` tương ứng không tồn tại → **NOTE** "network vocab
không có file chứng" (không block — đúng vòng đời advisory; là chỗ bám cho hook
wave 2). Grep line-based như phần còn lại của script.

### 3.9 Binding `dev_server.api_base` (acceptance-init, optional)

Config template thêm 1 dòng comment: `# api_base: [<prefix-1>, <prefix-2>]` —
LIST prefix URL API thật app gọi (đa-service: auth + data API...). Thiếu →
scope mặc định = origin `dev_server.url` (key sẵn có — đa số repo khỏi đụng
config); thiếu cả dev_server → rail chạy `unscoped`. Engine/binding split giữ
nguyên; config cũ không vỡ.

### 3.10 Degradation rows + Known limitations

Degradation table (SKILL.md) thêm:

| Situation | Action |
|---|---|
| Driver không đọc được network (curl+grep SSR không chạy JS, mobile simulator, capture-only) | ui-check chỉ là bằng chứng LỚP UI, `network_observed: n-a (driver)`; criterion `(cross-layer)` BẮT BUỘC có paired `layer: backend-effect` eval — thiếu → W4 + gap-probe + Gate 1 hiện cờ |
| `dev_server`/`api_base` chưa khai đủ (app đa-origin) | network rail note-only (`unscoped` / `unscoped-partial`), không FAIL |

README Known limitations thêm các bullet §7.

## 4. Đối chiếu coverage V1-V6

| V | Kết luận | Cơ chế |
|---|---|---|
| V1 SPA fetch fail | **Chặn, 2 lớp** | network rail `app-fail` + effect-eval đỏ khi backend hỏng |
| V2 SSR curl-blind | **Chặn qua pairing** | degradation row tuyên bố UI-layer-only → bắt buộc effect-eval (curl API/DB trực tiếp, không cần JS); network rail KHÔNG claim ca này |
| V3 optimistic/dead-button | **Chặn với authoring chuẩn mới** | marker server-derived + assert-sau-reload (wiring) + `no-app-traffic` cờ dead-button + effect-eval (backend health). Error-nuốt-nhưng-XHR-có-bắn → network rail bắt trực tiếp |
| V4 mock/stub sót | **Một phần (residual thành văn)** | pairing buộc eval máy độc lập với suite E2E; A/B Analyst sẵn có bắt green-on-both; kit KHÔNG verify semantics binding (ranh HC1) → Known limitations |
| V5 mobile | **Lập trường (đúng đề bài)** | UI-layer-only + bắt buộc paired eval; không network rail, không surface mới |
| V6 không phân biệt | **Không phá** | effect-eval là eval máy thường → tự chảy vào baseline/Analyst hiện hữu |

## 5. Wave 2/3 (queued, không thuộc spec này)

- **Wave 2 — máy-kiểm hóa:** evidence `schema_version: 3` + `evaluateNetwork()`
  trong evidence-core copy pattern `evaluateObserved` (~30 dòng): PASS report có
  eval thuộc criterion `(cross-layer)` (đầu bám: tag + `layer:` đã có từ wave 1)
  mà block ui-check thiếu `network_observed:` hợp lệ / vocab `clean|app-fail`
  thiếu file chứng → hook block; v<3 tolerated + pre-merge NOTE. Cân nhắc
  sequencing `after: ui` cho effect-eval kiểu GET-sau-flow.
- **Wave 3:** surface `mobile` first-class khi có ≥1 repo mobile thật dùng kit;
  `backend-log-assert` chỉ khi có correlation id (S4 chạy ui-check song song —
  log interleave).

## 6. Files touched (authoring; bản plugins/ sinh bằng `scripts/sync-plugin-packages.sh`)

| # | File | Thay đổi |
|---|---|---|
| 1 | `skills/acceptance/SKILL.md` | Phase 1 tag rule · Phase 2 rule (c) · Phase 3 khối scoping/vocab cho verify-subagent · degradation rows |
| 2 | `skills/acceptance/references/contract-template.md` | quy ước tag `(cross-layer)` |
| 3 | `skills/acceptance/references/eval-executors.md` | caveat rule 3 · §Pairing mechanics (layer field, nonce, marker chuẩn, cấm racy, bind suite) · §Network truth (scoping + vocab) |
| 4 | `skills/acceptance/references/evidence-report-template.md` | dòng `network_observed:` advisory + vocab + cấm token thô |
| 5 | `feature-loop/workflows/acceptance-verify.js` | khối network trong prompt ui · `UI_SCHEMA.networkObserved` optional · luật copy-verbatim/missing→n-a trong prompt synthesize |
| 6 | `feature-loop/skills/feature-loop/SKILL.md` | gap-probe cross-check line · atomic-pair carry (S4 P1) |
| 7 | `scripts/eval-coverage-lint.js` | W4 + parse `executor:`/`layer:`/crossLayer |
| 8 | `tests/scripts/run-tests.sh` (+ fixtures) | W4 fire / no-fire / no-tag |
| 9 | `scripts/pre-merge-check.sh` | NOTE network vocab ↔ file chứng |
| 10 | `commands/acceptance-init.md` | comment `api_base: [..]` (list) |
| 11 | `README.md` | Known limitations bullets |
| 12 | `codex/acceptance-gate/skills/acceptance/SKILL.md` | overlay parity mục 1 |
| 13 | `codex/feature-loop-codex/agent-templates/acceptance_ui_verifier.toml` | lập trường network thật (`n-a (driver)` mặc định) |
| 14 | `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` | gap-probe line · atomic-pair · bước report: copy-verbatim/n-a |

## 7. Known limitations (ghi README, nguyên văn rút gọn)

1. **Tag-omission:** quên gắn `(cross-layer)` → W4/pairing im lặng; lưới còn lại
   là gap-probe (feature-loop) + human Gate 1; standalone chỉ còn lint + human.
   Chấp nhận — cùng tầng tin cậy advisory-at-Gate-1 với W1/W3; không thêm
   heuristic detector vì ồn.
2. **V4 residual:** kit xác thực bằng chứng của eval đã khai, không xác thực môi
   trường mà binding `config:` trỏ tới (ranh engine/binding split) — effect-eval
   bind vào mock là việc human soi binding ở Gate 1 + Analyst green-on-both.
3. **Fake-`clean` còn hở tới wave 2:** `network_observed` wave này là advisory
   (không hook); đã thu hẹp bằng ngữ nghĩa `clean`-phải-có-traffic +
   `no-app-traffic` + pre-merge NOTE file chứng.
4. **Flaky app-origin trong cửa sổ drive → FAIL** là lập trường (không retry/
   debounce wave này); van xả `human_override` có ghi lý do.
5. **Mobile:** bằng chứng lớp UI only đợt này; xuyên lớp trên mobile dựa hoàn
   toàn vào paired backend eval.

## 8. Test plan

- `tests/scripts/`: W4 — 3 fixture (tag + thiếu `layer:` → fire; tag + có
  `layer: backend-effect` → no-fire; không tag → no-fire); giữ W1/W3 cases xanh.
- `tests/workflows/acceptance-verify.test.mjs`: case mới — kết quả ui mang
  `networkObserved` đi qua merge/synthesize payload nguyên vẹn; kết quả ui KHÔNG
  có field → payload không vỡ (UI_SCHEMA additive).
- `tests/hooks/`: KHÔNG đổi (schema giữ 2) — chạy lại để chứng minh không vỡ.
- Pre-merge NOTE: fixture report + evidence dir trong test shell hiện có của
  `tests/plugins/` hoặc case shell mới cạnh pre-merge (NOTE-only, không block).
- Chạy `scripts/sync-plugin-packages.sh` + diff plugins/ để chứng minh mirror đủ.

## 9. Chi phí & rủi ro

- **Run-time/round:** 0 agent mới, 0 lệnh pipeline mới; ui agent sẵn có thêm 1
  lần đọc network + 1 Write txt (~vài trăm token/ui-eval); effect-eval là eval
  máy thường trong lane sẵn có (dedupe + model rẻ + carry-forward, trừ luật
  atomic-pair). Không phá thành quả token MODEL_ROUTES 1.9.1.
- **Ồn:** mọi tín hiệu mới hoặc advisory hoặc FAIL-chỉ-khi-app-scope-fail; ba
  trạng thái n-a/unscoped không bao giờ FAIL; residual poller nền là lập trường
  có van xả.
- **Human-gate:** Gate 1 chỉ thêm cờ khi thiếu pairing; Gate 2 thêm 1 dòng vocab
  tự-giải-thích mỗi ui-eval; txt chỉ mở khi FAIL/nghi ngờ.
- **Rủi ro chính:** kỷ luật authoring (tag, marker server-derived) là hàng rào
  mềm wave 1 — đã thành văn ở Known limitations, máy-kiểm hóa dồn cho wave 2 khi
  đầu bám (tag + layer field + vocab + file chứng) đã có sẵn từ wave này.
