# Cross-layer False-green Rail (wave 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chặn false-green xuyên lớp (UI PASS trong khi backend lỗi) bằng rail advisory-first: tag `(cross-layer)` + pairing `layer: backend-effect` + lint W4 + network-truth vocab trong ui-check — 0 hook mới, 0 agent mới, evidence schema GIỮ v2.

**Spec:** `docs/superpowers/specs/2026-07-24-cross-layer-false-green-design.md` (đọc trước khi làm bất kỳ task nào).

**Architecture:** Trụ design-time (contract tag → pairing rule (c) ở EVAL-GEN → lint W4 → gap-probe cross-check) trả chi phí ở Gate 1; trụ runtime chỉ là chỉ dẫn thêm cho ui agent sẵn có (đọc network qua browser tool, vocab chữ né bẫy L1 CONSISTENCY); chuỗi hành trình `network_observed` được vá ở MỌI điểm viết report (synthesize / standalone / codex). `plugins/*` là bản SINH — không sửa tay, chạy `scripts/sync-plugin-packages.sh` ở task cuối.

**Tech Stack:** Node.js (no-dep line-based parsers), bash test harness, markdown skill docs, Workflow script (vm-sandboxed JS).

## Global Constraints

- Evidence `schema_version` GIỮ **2** — CẤM sửa `hooks/`, `lib/evidence-core.js`, `scripts/recheck-evidence.js` trong wave này.
- Report PASS không bao giờ được chứa token exit khác 0 (`exit_code:`, `exit=`) hay chuỗi `verdict: FAIL` — mọi field/văn bản mới dùng **vocab chữ**: `clean | no-app-traffic | third-party-only | app-fail | n-a (driver) | n-a (tool-error: <lý do>) | unscoped | unscoped-partial`; số status thô nằm trong `evidence/E{id}-network.txt`.
- Tên máy-đọc dùng NHẤT QUÁN toàn kit: tag `(cross-layer)` (criterion text), field eval `layer: backend-effect`, field kết quả ui `networkObserved` (UI_SCHEMA), dòng report `network_observed:`.
- Ngôn ngữ khớp file đích: `skills/acceptance/**`, `references/**`, `README.md`, codex SKILL = **English**; `feature-loop/skills/feature-loop/SKILL.md` = **tiếng Việt có dấu**; prompt trong `acceptance-verify.js` = **tiếng Việt KHÔNG dấu** (đúng style file).
- `plugins/acceptance-gate/`, `plugins/feature-loop-codex/`, `plugins/design-loop-codex/` là bản SINH (rm-rf + rsync) — không edit tay; regenerate ở Task 9.
- Mỗi task: chạy test suite liên quan trước khi commit; commit riêng từng task.

---

### Task 1: Lint W4 — `(cross-layer)` thiếu eval `layer: backend-effect` (TDD)

**Files:**
- Modify: `scripts/eval-coverage-lint.js` (parseACs :51-58, parseEvals :65-80, lintFeature :84-109, header comment :13-17, footer :147)
- Test: `tests/scripts/run-tests.sh` (chèn sau block L07, hiện ở dòng ~249-250)

**Interfaces:**
- Consumes: format `contract.md` (`## Criteria` bullet `- AC-n: ... (cross-layer)`) và `evals.yaml` (per-eval `executor:`, field mới `layer:`).
- Produces: warning W4 (advisory, exit 1) — Task 3/4/8 tham chiếu tên "W4" và field `layer: backend-effect` đúng chính tả này.

- [ ] **Step 1: Viết test fail — 3 fixture + L08/L09/L10**

Trong `tests/scripts/run-tests.sh`, tìm block L07 (kết thúc phần `--- eval-coverage-lint.js ---`):

```sh
echo "L07 no _acceptance dir -> clean"
mkdir -p "$T/lintE"; node "$LINT" "$T/lintE" >/dev/null; check L07 0 $?
```

Chèn NGAY SAU đó:

```sh
# Fixture E2: (cross-layer) AC + only ui-check eval (no backend-effect pair)
E2="$T/lintE2/_acceptance/feat-x1"; mkdir -p "$E2"
cat > "$E2/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When submit order, Then order saved via API. (cross-layer)
## Out of scope
EOF
cat > "$E2/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    expected: "order confirmation visible; marker KHONG optimistic"
EOF

# Fixture F: (cross-layer) AC + paired layer: backend-effect eval -> clean
F="$T/lintF/_acceptance/feat-x2"; mkdir -p "$F"
cat > "$F/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When submit order, Then order saved via API. (cross-layer)
## Out of scope
EOF
cat > "$F/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    expected: "order confirmation visible; marker KHONG optimistic"
  - id: E2
    criterion: AC-1
    executor: script
    layer: backend-effect
    expected: "exit 0; order row exists via API (KHONG mock)"
EOF

# Fixture G: (cross-layer) AC + script eval WITHOUT layer field (design-gate style) -> still warn
G="$T/lintG/_acceptance/feat-x3"; mkdir -p "$G"
cat > "$G/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When submit order, Then order saved via API. (cross-layer)
## Out of scope
EOF
cat > "$G/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    expected: "order confirmation visible; marker KHONG optimistic"
  - id: E7
    criterion: AC-1
    executor: script
    expected: "design gate exit 0; KHONG P0 a11y"
EOF

echo "L08 cross-layer AC, ui-check only -> warn (W4)"
node "$LINT" "$T/lintE2" >/dev/null; check L08 1 $?
echo "L09 cross-layer AC with layer: backend-effect pair -> clean"
node "$LINT" "$T/lintF" >/dev/null; check L09 0 $?
echo "L10 cross-layer AC, script eval without layer field -> still warn (W4 vacuous-pair guard)"
node "$LINT" "$T/lintG" >/dev/null; check L10 1 $?
```

- [ ] **Step 2: Chạy để thấy fail**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "L0[89]|L10"`
Expected: `FAIL: L08 (expected exit 1, got 0)` và `FAIL: L10 (expected exit 1, got 0)`; L09 PASS (lint hiện bỏ qua nên exit 0 trùng kỳ vọng).

- [ ] **Step 3: Implement W4 trong `scripts/eval-coverage-lint.js`**

3a. `parseACs` (dòng ~55) — thay:

```js
    if (m) acs.push({ id: m[1], text: m[2], judgment: /\(judgment\)/i.test(m[2]) });
```

bằng:

```js
    if (m) acs.push({ id: m[1], text: m[2], judgment: /\(judgment\)/i.test(m[2]), crossLayer: /\(cross-layer\)/i.test(m[2]) });
```

3b. `parseEvals` — thay dòng init cur:

```js
    if (idM) { if (cur) evals.push(cur); cur = { id: idM[1].trim(), criterion: '', expected: '' }; continue; }
```

bằng:

```js
    if (idM) { if (cur) evals.push(cur); cur = { id: idM[1].trim(), criterion: '', expected: '', executor: '', layer: '' }; continue; }
```

và chèn NGAY SAU cặp `const eM = ...; if (eM) ...`:

```js
    const xM = line.match(/^\s*executor:\s*(.+)$/);
    if (xM) cur.executor = xM[1].trim().replace(/^["']|["']$/g, '');
    const lM = line.match(/^\s*layer:\s*(.+)$/);
    if (lM) cur.layer = lM[1].trim().replace(/^["']|["']$/g, '');
```

3c. `lintFeature` — chèn NGAY SAU vòng `for (const ac of acs) {...}` của W1 (trước block `const oos = ...`):

```js
  // W4 — cross-layer pairing (tag-keyed, deterministic): a criterion tagged
  // (cross-layer) whose evals carry NO `layer: backend-effect` member has
  // UI-only evidence for a cross-layer path. Executor-type alone is NOT enough
  // (rule-2b design-gate scripts / VLM wrappers are `script` too) — the layer
  // field is the machine-readable pairing anchor.
  for (const ac of acs) {
    if (!ac.crossLayer) continue;
    const es = evalsFor(ac.id);
    if (!es.length) continue;              // zero-eval is the existing ≥1-eval Gate-1 rule's job
    if (!es.some(e => e.layer === 'backend-effect')) {
      warns.push(`[${slug}] W4 ${ac.id} is tagged (cross-layer) but none of its ${es.length} eval(s) declares layer: backend-effect — UI-only evidence for a cross-layer criterion; add ≥1 test/script eval asserting the backend effect.`);
    }
  }
```

3d. Header comment (sau dòng mô tả W3, dòng ~17) — chèn:

```js
 *   W4  a criterion tagged (cross-layer) whose evals include NO member with
 *       `layer: backend-effect` (UI-only evidence for a UI→API→backend path;
 *       executor-type alone is spoofable by design-gate/VLM `script` evals)
```

3e. Footer (dòng ~147) — thay:

```js
  console.log('\nW1 = a bounded/threshold criterion needs a just-below should-NOT-fire (boundary) eval; W3 = give the out-of-scope half real negative evals.');
```

bằng:

```js
  console.log('\nW1 = a bounded/threshold criterion needs a just-below should-NOT-fire (boundary) eval; W3 = give the out-of-scope half real negative evals; W4 = a (cross-layer) criterion needs a paired layer: backend-effect eval.');
```

- [ ] **Step 4: Chạy test pass toàn suite scripts**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -3`
Expected: `0 failed` (L01-L07 cũ vẫn xanh — fixture cũ không có tag nên W4 im lặng).

- [ ] **Step 5: Commit**

```bash
git add scripts/eval-coverage-lint.js tests/scripts/run-tests.sh
git commit -m "feat(lint): W4 — criterion (cross-layer) thiếu eval layer: backend-effect (advisory, tag-keyed, chống thỏa-mãn-rỗng bởi script không-backend)"
```

---

### Task 2: acceptance-verify.js — network truth trong ui agent + synthesize copy-verbatim (TDD)

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (UI_SCHEMA :69-81, prompt ui :300-313, prompt synthesize :549-556)
- Test: `tests/workflows/acceptance-verify.test.mjs` (chèn trước dòng `summary(...)` cuối file; W-số tiếp theo — file hiện dùng tới W16, dùng W17/W18, nếu đã bị chiếm thì +1)

**Interfaces:**
- Consumes: kết quả ui agent (schema UI_SCHEMA) — field mới OPTIONAL `networkObserved` (string, vocab chữ).
- Produces: payload synthesize chứa `networkObserved` nguyên văn; chỉ dẫn synthesize ghi dòng `network_observed:` (Task 3 template + Task 8 codex dùng đúng tên này).

- [ ] **Step 1: Viết test fail (2 case)**

Chèn TRƯỚC dòng `summary('acceptance-verify')` ở cuối `tests/workflows/acceptance-verify.test.mjs`:

```js
console.log('W17 network-truth: UI_SCHEMA optional networkObserved + prompt rail + synthesize passthrough');
{
  const uiEval = { id: 'E3', criterion: 'AC-3', executor: 'ui-check', steps: ['open /x'], expected: 'ok', evidence_required: [] };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [uiEval], suiteCommands: [] }), responder({
    'ui:E3': { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/E3-step1.png', observed: 'thay man hinh ok', networkObserved: 'clean' },
  }));
  const ui = calls.find(c => c.label === 'ui:E3');
  check('W17 UI_SCHEMA declares networkObserved as OPTIONAL', !!ui.opts.schema.properties.networkObserved && !ui.opts.schema.required.includes('networkObserved'));
  check('W17 ui prompt carries the network rail + vocab', ui.prompt.includes('NETWORK TRUTH') && ui.prompt.includes('no-app-traffic') && ui.prompt.includes('n-a (driver)'));
  const synth = calls.find(c => c.label === 'synthesize:report');
  check('W17 synthesize payload carries networkObserved verbatim', synth.prompt.includes('"networkObserved":"clean"'));
  check('W17 synthesize instructs copy-verbatim + n-a fallback, never invented clean', synth.prompt.includes('network_observed') && synth.prompt.includes('n-a (driver)') && synth.prompt.includes('KHONG tu suy'));
}
console.log('W18 network-truth additive: ui result WITHOUT networkObserved still PASS (backward)');
{
  const uiEval = { id: 'E3', criterion: 'AC-3', executor: 'ui-check', steps: ['open /x'], expected: 'ok', evidence_required: [] };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [uiEval], suiteCommands: [] }), responder());
  check('W18 verdict PASS without networkObserved', result.verdict === 'PASS', result.verdict);
}
```

- [ ] **Step 2: Chạy để thấy fail**

Run: `bash tests/workflows/run-tests.sh 2>&1 | grep -E "W17|W18"`
Expected: 4 dòng `FAIL: W17 ...`; `PASS: W18` (hành vi cũ đã additive-safe).

- [ ] **Step 3: Implement 3 chỗ trong `feature-loop/workflows/acceptance-verify.js`**

3a. `UI_SCHEMA` — chèn sau property `observed` (dòng ~76), KHÔNG thêm vào `required`:

```js
    networkObserved: { type: 'string', description: 'NETWORK TRUTH vocab CHU: clean | no-app-traffic | third-party-only | app-fail | n-a (driver) | n-a (tool-error: <ly do>) | unscoped | unscoped-partial — theo luat scoping trong prompt; driver khong doc duoc network → "n-a (driver)"; TUYET DOI khong ghi so status/exit vao field nay' },
```

3b. Prompt ui-check — chèn 1 bullet MỚI ngay SAU bullet `- observed (BAT BUOC khi co frame): ...` (dòng ~310), TRƯỚC bullet `- exitCode=0 CHI khi MOI assertion pass...`:

```js
      `- NETWORK TRUTH (mo rong rail observed tu pixels sang wire): NEU driver la browser tool co duong doc network (read_network_requests / read_console_messages hoac tuong duong) — SAU khi chay xong steps: doc failed requests + console errors, dump tho vao evidence/${e.id}-network.txt (mkdir -p truoc). Luat scoping: FAIL-eligible = fetch/XHR toi origin cua config dev_server.url HOAC prefix trong dev_server.api_base (co the la LIST); third-party (analytics/CDN/tracker) KHONG BAO GIO fail; static asset (.map/favicon/anh/font) ke ca app-origin → chi note. Trong tap FAIL-eligible: connection-error/timeout/status tu 500 tro len → eval FAIL: exitCode phai khac 0 KE CA khi frame dep; loi 4xx → FAIL TRU KHI expected cua eval khai dung status do. Dien field networkObserved bang VOCAB CHU (cam so status/exit): "clean" = CO thay traffic app-scope va tat ca OK — khong thay request app nao thi PHAI ghi "no-app-traffic" (cam ghi clean khi khong co traffic); "third-party-only" = chi third-party fail; "app-fail" = co request FAIL-eligible fail; "unscoped" = config chua khai dev_server.url/api_base; "unscoped-partial" = thay XHR toi origin la ngoai scope da khai (note-only); driver khong doc duoc network (curl+grep, capture-only) → "n-a (driver)"; tool doc network tu loi → "n-a (tool-error: <ly do ngan>)" kem chi tiet trong outputTail. Cac gia tri n-a/unscoped/no-app-traffic KHONG lam eval fail.\n` +
```

3c. Prompt synthesize — trong template literal của `const report = await agentT(...)` (dòng ~550), chèn đoạn sau NGAY SAU câu kết thúc `...KHONG bia)): ${JSON.stringify(machineForReportB)}` (cùng dòng, trước `\nrun_id cua TUNG eval:`):

```
\nNETWORK TRUTH (advisory — schema v2 GIU NGUYEN, hook KHONG kiem field nay): moi block eval ui-check ghi them field "network_observed:" = chep NGUYEN VAN field networkObserved tu ket qua ui o tren; ket qua ui KHONG co field nay → ghi "n-a (driver)". TUYET DOI KHONG tu suy ra "clean". Vocab chu duy nhat: clean | no-app-traffic | third-party-only | app-fail | n-a (driver) | n-a (tool-error) | unscoped | unscoped-partial — CAM ghi so status/exit tho hay chu 'verdict: FAIL' vao report (bay L1 CONSISTENCY; so tho nam trong evidence/E{id}-network.txt).
```

- [ ] **Step 4: Chạy test pass**

Run: `bash tests/workflows/run-tests.sh 2>&1 | tail -3`
Expected: `0 failed` (mọi W-case cũ xanh — field additive, prompt chỉ thêm bullet).

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(feature-loop): network truth trong ui agent S4 — networkObserved optional + luat scoping app-origin + synthesize copy-verbatim/n-a (khong tu suy clean)"
```

---

### Task 3: References — eval-executors + contract-template + evidence-report-template

**Files:**
- Modify: `skills/acceptance/references/eval-executors.md` (:74-81 lint note, :87 rule 3, sau :99 section mới, trong §ui-check mechanics sau bullet observed :107-113)
- Modify: `skills/acceptance/references/contract-template.md` (:47-51 Criteria note + example)
- Modify: `skills/acceptance/references/evidence-report-template.md` (sau đoạn Observed :37-47; body block E3 :116-125)

**Interfaces:**
- Consumes: tên `W4`, field `layer: backend-effect`, vocab từ Task 1/2.
- Produces: §"Pairing mechanics" + §"Network truth" — văn bản nguồn-sự-thật mà Task 4 (SKILL) tóm tắt và Task 8 (codex) sao chép.

- [ ] **Step 1: eval-executors.md — 4 chỗ**

1a. Cuối đoạn "Boundary + should-NOT-fire" (dòng ~79-81), thay câu:

```
The `eval-coverage-lint` script flags threshold criteria whose evals never assert this (W1) and
out-of-scope items with zero negative evals (W3); advisory, surfaced at Gate 1.
```

bằng:

```
The `eval-coverage-lint` script flags threshold criteria whose evals never assert this (W1),
out-of-scope items with zero negative evals (W3), and `(cross-layer)` criteria
with no `layer: backend-effect` eval (W4); advisory, surfaced at Gate 1.
```

1b. Rule 3 (dòng 87) — thay:

```
3. Criterion observable only through the browser → `ui-check`.
```

bằng:

```
3. Criterion observable only through the browser → `ui-check`. CAVEAT: for a
   criterion tagged `(cross-layer)` this rule picks the UI half only — pairing
   rule (c) (SKILL.md Phase 2) additionally REQUIRES a `layer: backend-effect`
   eval; a ui-check alone is never sufficient cross-layer evidence.
```

1c. Chèn section MỚI ngay sau rule 6 (dòng ~99), TRƯỚC `## ui-check mechanics`:

```markdown
## Pairing mechanics — `(cross-layer)` criteria

A criterion whose When/Then crosses the backend (a UI flow triggering an API
call / data mutation) is tagged `(cross-layer)` in the contract (Phase 1). Its
eval set MUST contain, besides the UI-half eval:

- **≥1 backend-effect eval** — executor `test`/`script`, `cmd` a `config:`
  ref, declaring the machine-readable field `layer: backend-effect` (additive,
  like `runs:`; lint W4 keys off this field — executor type alone is spoofable
  by rule-2b design-gate scripts). It proves "this backend path really works".
- **Self-driving with its own nonce**: the command creates the effect under an
  identifier of its own and asserts it (POST X → GET/query X). It does NOT
  claim to prove UI→API wiring.
- **NEVER author "GET-asserts-the-effect-the-UI-flow-created"**: the machine
  lane and the ui lane run in the SAME parallel() — such an eval races the ui
  agent (fails when scheduled first) and burns a round. Sequencing (`after:
  ui`) is a wave-2 candidate, not available now.
- **Wiring is proven in the ui-check itself**: its asserted marker must be
  server-derived data (an id/value only the server can produce for this flow,
  never a static toast/optimistic DOM); for mutations, assert AFTER a reload;
  recommended nonce-correlation — the flow types a distinguishable identifier
  (e.g. a fixed per-eval string when the env resets between rounds) and both
  the marker and the backend-effect eval assert the record carrying it.
- **Bind to an existing suite command when possible** (the feature's own
  itest): machine-lane dedupe makes the marginal cost ~0; MODEL_ROUTES, A/B
  baseline, run-log and carry-forward apply automatically since this is an
  ordinary machine eval.
```

1d. Trong `## ui-check mechanics`, chèn bullet MỚI ngay sau bullet `**Look at what you saved**` (dòng ~108-113):

```markdown
- **Network truth** (extends the `observed:` rail from pixels to the wire) —
  when the driver is a browser tool with a network log
  (`read_network_requests` / `read_console_messages` or equivalent): after
  driving the flow, dump failed requests + console errors to
  `evidence/E{id}-network.txt` and record `network_observed:` with WORDS ONLY:
  `clean | no-app-traffic | third-party-only | app-fail | n-a (driver) |
  n-a (tool-error: <reason>) | unscoped | unscoped-partial`. Scoping law:
  FAIL-eligible = fetch/XHR to the `dev_server.url` origin or any prefix in
  `dev_server.api_base` (a LIST); third-party (analytics/CDN/trackers) never
  fails; static assets (.map/favicon/images/fonts) never fail even on the app
  origin; within FAIL-eligible, connection-error/timeout/5xx FAILS the eval
  even when frames look right, and 4xx fails unless the eval's `expected`
  declares that exact status. `clean` REQUIRES seen app traffic — zero app
  requests must be recorded `no-app-traffic`, never `clean`. Raw status
  numbers stay in the txt file — NEVER in the report (L1 CONSISTENCY blocks
  nonzero-exit tokens in a PASS report; word-vocab follows the
  `baseline: red/green/n-a` precedent). Drivers with no network path
  (curl+grep SSR, capture-only, mobile simulators) record `n-a (driver)` —
  the cross-layer burden then rests entirely on the paired
  `layer: backend-effect` eval.
```

- [ ] **Step 2: contract-template.md — quy ước tag + ví dụ**

Thay đoạn (dòng ~47-51):

```
{{5-15 criteria. Each MUST be Given/When/Then and independently checkable.
Tag criteria that require business judgment with (judgment).}}

- AC-1: Given {{precondition}}, When {{action}}, Then {{observable outcome}}.
- AC-2: Given {{precondition}}, When {{action}}, Then {{observable outcome}}. (judgment)
```

bằng:

```
{{5-15 criteria. Each MUST be Given/When/Then and independently checkable.
Tag criteria that require business judgment with (judgment).
Tag criteria whose When/Then crosses the backend — a UI flow triggering an API
call / data mutation — with (cross-layer): Phase 2 pairing rule (c), lint W4
and the gap-probe cross-check all key off this tag.}}

- AC-1: Given {{precondition}}, When {{action}}, Then {{observable outcome}}.
- AC-2: Given {{precondition}}, When {{action}}, Then {{observable outcome}}. (judgment)
- AC-3: Given {{precondition}}, When {{user submits the form}}, Then {{the record exists via API}}. (cross-layer)
```

- [ ] **Step 3: evidence-report-template.md — đoạn guidance + field trong body**

3a. Chèn đoạn MỚI ngay sau đoạn "Observed (hook-enforced from schema_version 2)..." (sau dòng 47):

```markdown
Network truth (wave 1 — ADVISORY, not hook-enforced; the hook stays schema v2):
a ui-check block may carry `network_observed:` — WORDS ONLY, following the
`baseline: red/green/n-a` precedent: `clean` (app traffic seen, all OK — zero
app traffic must be `no-app-traffic`, never `clean`), `third-party-only`,
`app-fail` (an in-scope request failed → that eval FAILS), `n-a (driver)`
(driver cannot read network: curl+grep, capture-only, mobile), `n-a
(tool-error: <reason>)`, `unscoped` (no dev_server.url/api_base configured),
`unscoped-partial` (XHR seen to an origin outside the declared scope). Raw
status numbers live in `evidence/E{id}-network.txt`, NEVER in the report — a
PASS report must stay free of nonzero exit tokens. Copy the value verbatim
from the verifier result; a missing value is `n-a (driver)`, never an
invented `clean`. pre-merge NOTEs a `clean`/`app-fail` claim whose txt file is
missing.
```

3b. Trong body template, block `- eval: E3` (dòng ~116-125) — chèn sau dòng `observed: |` + placeholder của nó:

```
  network_observed: {{clean|no-app-traffic|third-party-only|app-fail|n-a (driver)|n-a (tool-error)|unscoped|unscoped-partial}}   # words only — raw statuses live in evidence/E3-network.txt
```

- [ ] **Step 4: Verify bằng grep**

Run: `grep -c "cross-layer" skills/acceptance/references/eval-executors.md skills/acceptance/references/contract-template.md && grep -c "network_observed" skills/acceptance/references/evidence-report-template.md skills/acceptance/references/eval-executors.md`
Expected: mọi count ≥ 1; thêm `grep -n "backend-effect" skills/acceptance/references/eval-executors.md` ra ≥ 3 dòng.

- [ ] **Step 5: Commit**

```bash
git add skills/acceptance/references/eval-executors.md skills/acceptance/references/contract-template.md skills/acceptance/references/evidence-report-template.md
git commit -m "docs(references): pairing mechanics (cross-layer) + network truth vocab/scoping — nguồn sự thật cho rail xuyên lớp wave 1"
```

---

### Task 4: skills/acceptance/SKILL.md — Phase 1 tag, Phase 2 rule (c), Phase 3 scoping inline, Degradation

**Files:**
- Modify: `skills/acceptance/SKILL.md` (Phase 1 step 2 :92-93, Phase 2 step 4 :122-138, Phase 3 step 1 :158-177 + step 2 ui-check :189-195, Degradation :254-266)

**Interfaces:**
- Consumes: W4 (Task 1), vocab + luật scoping (Task 3 — Phase 3 chép bản NÉN vì verify-subagent standalone KHÔNG đọc eval-executors.md).
- Produces: rule (c) — văn bản mà Task 8 chép nguyên sang codex SKILL.

- [ ] **Step 1: Phase 1 step 2 — thay**

```
2. Write 5-15 criteria, each Given/When/Then, each independently checkable.
   Tag business-judgment criteria with `(judgment)`.
```

bằng:

```
2. Write 5-15 criteria, each Given/When/Then, each independently checkable.
   Tag business-judgment criteria with `(judgment)`. Tag criteria whose
   When/Then crosses the backend (a UI flow triggering an API call / data
   mutation) with `(cross-layer)` — pairing rule (c), lint W4 and the
   gap-probe cross-check key off this tag.
```

- [ ] **Step 2: Phase 2 step 4 — "two rules" → "three rules" + rule (c) + câu lint**

Thay dòng `4. Coverage check — two rules:` bằng `4. Coverage check — three rules:`.

Chèn NGAY SAU block rule (b) (sau câu "...each is a should-NOT-fire assertion in disguise."):

```
   (c) **Cross-layer pairing.** Every criterion tagged `(cross-layer)` MUST
       have ≥1 eval declaring `layer: backend-effect` (executor `test`/`script`,
       `cmd` a `config:` ref) proving the backend effect of THAT action —
       a ui-check alone is NEVER sufficient evidence for a cross-layer
       criterion. Author it self-driving with its own nonce (POST X → assert X);
       never author "GET-asserts-what-the-UI-flow-created" (races the parallel
       ui lane). The ui-check half must assert a server-derived marker (and
       re-assert after reload for mutations). See eval-executors.md §Pairing
       mechanics.
```

Thay câu lint cuối step 4:

```
   should-NOT-fire case (W1) and out-of-scope items with zero negative evals (W3).
```

bằng:

```
   should-NOT-fire case (W1), out-of-scope items with zero negative evals (W3),
   and `(cross-layer)` criteria with no `layer: backend-effect` eval (W4).
```

- [ ] **Step 3: Phase 3 step 1 — nối khối network vào instruction quote**

Trong đoạn instruction của verify-subagent (kết thúc `...the overall verdict is PENDING-JUDGMENT, never PASS."`), chèn TRƯỚC dấu nháy đóng:

```
 For every ui-check where the driver can read network traffic (a browser tool
   with read_network_requests or equivalent): after driving the flow, dump
   failed requests + console errors to evidence/E{id}-network.txt and record
   network_observed: with WORDS ONLY — clean | no-app-traffic |
   third-party-only | app-fail | n-a (driver) | n-a (tool-error: <reason>) |
   unscoped | unscoped-partial. FAIL-eligible = fetch/XHR to the
   dev_server.url origin or an api_base prefix; third-party and static assets
   never fail; in-scope connection-error/timeout/5xx FAILS that eval even when
   frames look right; 4xx fails unless the eval's expected declares that exact
   status. clean REQUIRES seen app traffic (none seen = no-app-traffic). No
   network path = n-a (driver) — never an invented clean. Raw statuses stay in
   the txt file, never in the report.
```

Và trong step 2 bullet `ui-check`, sau câu "...Read each saved frame and record observed: in its report block (schema-v2 reports without it are hook-blocked).", chèn:

```
Record network evidence per the instruction above when the driver allows;
     copy `network_observed:` verbatim into the block (missing → `n-a (driver)`).
```

- [ ] **Step 4: Degradation table — thêm 2 row cuối bảng**

```
| Driver cannot read network (curl+grep SSR runs no JS; mobile simulator; capture-only) | ui-check counts as UI-LAYER evidence only — `network_observed: n-a (driver)`; a `(cross-layer)` criterion REQUIRES its paired `layer: backend-effect` eval; missing pair → W4 + gap-probe + Gate-1 flag |
| `dev_server.url` / `api_base` not (fully) configured — multi-origin app | network rail is note-only (`unscoped` / `unscoped-partial`), never FAILs |
```

- [ ] **Step 5: Verify + Commit**

Run: `grep -n "three rules\|cross-layer\|network_observed\|n-a (driver)" skills/acceptance/SKILL.md | head -12`
Expected: rule (c) + Phase 1 tag + Phase 3 block + 2 degradation rows đều hiện.

```bash
git add skills/acceptance/SKILL.md
git commit -m "docs(acceptance): rule (c) cross-layer pairing + network scoping inline cho verify-subagent standalone + degradation rows driver-mù-network"
```

---

### Task 5: feature-loop SKILL.md — gap-probe cross-check + atomic-pair carry + authoring nhắc tag

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (S1#4 evals bullet :73, S1#7 cross-check (4) :87, S4#1 P1 carry :~126-127)

**Interfaces:**
- Consumes: tag `(cross-layer)`, field `layer: backend-effect` (Task 1/3).
- Produces: luật atomic-pair — Task 8 chép bản English sang codex feature-loop SKILL.

- [ ] **Step 1: S1 step 4, bullet evals.yaml — nối vào cuối câu "...thiếu `paths` → eval LUÔN chạy lại (mặc định an toàn)":**

```
; criterion tag `(cross-layer)` → thêm ≥1 eval `layer: backend-effect` theo Pairing mechanics của eval-executors.md (ui-check một mình không bao giờ đủ cho criterion xuyên lớp)
```

- [ ] **Step 2: S1#7 — mở rộng cross-check (4)**

Thay đoạn `(4) cross-check bắt buộc: AC nào không có eval đo · GWT nào không đo được · trục Coverage nào không có AC;` bằng:

```
(4) cross-check bắt buộc: AC nào không có eval đo · GWT nào không đo được · trục Coverage nào không có AC · criterion nào When/Then đi qua backend mà THIẾU tag (cross-layer) hoặc chỉ có eval lớp UI (ui-check/judgment);
```

- [ ] **Step 3: S4#1, mục P1 — nối vào cuối bullet P1 (sau "...Suite commands LUÔN chạy lại."):**

```
**Atomic-pair (cross-layer):** eval thuộc criterion tag `(cross-layer)` chỉ được vào `carriedEvals` khi TOÀN BỘ eval của criterion đó đủ điều kiện carry — bất kỳ thành viên nào phải chạy lại → chạy lại CẢ CẶP (bằng chứng backend và bằng chứng lớp UI của cùng một flow phải cùng round; cấm ghép bằng chứng backend round cũ với UI round mới).
```

- [ ] **Step 4: Verify + Commit**

Run: `grep -n "cross-layer" feature-loop/skills/feature-loop/SKILL.md`
Expected: 3 hit (S1#4, S1#7, S4#1).

```bash
git add feature-loop/skills/feature-loop/SKILL.md
git commit -m "docs(feature-loop): gap-probe bắt tag-omission xuyên lớp + luật atomic-pair carry-forward P1"
```

---

### Task 6: pre-merge-check.sh — NOTE vocab-không-file-chứng (TDD)

**Files:**
- Modify: `scripts/pre-merge-check.sh` (chèn sau block NOTE observed-v2, dòng ~294-302, TRƯỚC block re-check)
- Test: `tests/scripts/run-tests.sh` (chèn sau block R06, dòng ~148-150)

**Interfaces:**
- Consumes: dòng `network_observed:` trong report (Task 2/3), file `evidence/E{id}-network.txt`.
- Produces: NOTE (không block) — chỗ bám cho hook wave 2.

- [ ] **Step 1: Viết test fail — N01/N02, chèn sau R06:**

```sh
echo "N01 network_observed: clean WITHOUT dump file -> NOTE, exit 0"
mk_prov "$P/n01" feat-n1 "enforcement_mode: strict"
printf -- '- eval: E3\n  run_id: feat-n1-E3-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n  network_observed: clean\n' >> "$P/n01/_acceptance/feat-n1/evidence-report.md"
outN="$(bash "$CHECK" "$P/n01" 2>&1)"; check N01 0 $?
case "$outN" in *NOTE*feat-n1*network_observed*) echo "  PASS: N01-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: N01-note (expected network NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "N02 network_observed: clean WITH dump file -> no network NOTE"
mk_prov "$P/n02" feat-n2 "enforcement_mode: strict"
printf -- '- eval: E3\n  run_id: feat-n2-E3-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n  network_observed: clean\n' >> "$P/n02/_acceptance/feat-n2/evidence-report.md"
mkdir -p "$P/n02/_acceptance/feat-n2/evidence"; printf 'no failed requests\n' > "$P/n02/_acceptance/feat-n2/evidence/E3-network.txt"
outN2="$(bash "$CHECK" "$P/n02" 2>&1)"
case "$outN2" in *network_observed*) echo "  FAIL: N02 (unexpected network NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: N02"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
```

- [ ] **Step 2: Chạy để thấy fail**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "N01|N02"`
Expected: `FAIL: N01-note` (script chưa in NOTE); N01/N02 exit-checks PASS sẵn.

- [ ] **Step 3: Implement — chèn vào `scripts/pre-merge-check.sh` NGAY SAU block NOTE "schema v$sv report has screenshot evidence..." (sau dòng ~302), TRƯỚC comment "# Re-verify the COMMITTED evidence...":**

```sh
  # network truth (wave 1, advisory): a claim-bearing network_observed (clean /
  # app-fail) must have its dump file on disk — vocab without evidence is NOTEd,
  # never blocked (nothing network-related is hook-enforced until schema v3).
  net_missing=0
  while IFS= read -r eid; do
    [ -n "$eid" ] || continue
    [ -f "$dir/evidence/${eid}-network.txt" ] || net_missing=$((net_missing+1))
  done <<NETIDS
$(awk 'tolower($0) ~ /^[[:space:]]*-[[:space:]]*eval:/ {id=$NF} tolower($0) ~ /^[[:space:]]*network_observed[[:space:]]*[:=][[:space:]]*(clean|app-fail)/ {print id}' "$report")
NETIDS
  if [ "$net_missing" -gt 0 ]; then
    echo "NOTE [$slug]: $net_missing network_observed claim(s) (clean/app-fail) with no evidence/E{id}-network.txt on disk — vocab without a dump file (advisory until schema v3)"
  fi
```

- [ ] **Step 4: Chạy test pass toàn suite scripts**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -3`
Expected: `0 failed` (case cũ không có `network_observed:` nên awk in rỗng → không NOTE).

- [ ] **Step 5: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): NOTE network_observed clean/app-fail thiếu file chứng E{id}-network.txt — đóng đường bịa 0-chi-phí, chỗ bám cho hook wave 2"
```

---

### Task 7: acceptance-init `api_base` (list) + README Known limitations

**Files:**
- Modify: `commands/acceptance-init.md` (câu hỏi 2c :11, template `dev_server` :55-57)
- Modify: `README.md` (cuối section `## Known limitations (v1)` :243+)

- [ ] **Step 1: acceptance-init — câu hỏi 2c, thay**

```
   c. Dev server start command + URL (for ui-check evals)
```

bằng:

```
   c. Dev server start command + URL (for ui-check evals). If the app calls
      APIs on OTHER origins (auth service, data API…), also collect their URL
      prefixes → `dev_server.api_base` (a LIST — scopes the ui-check network
      rail; missing → scope defaults to the url's origin)
```

- [ ] **Step 2: acceptance-init — template, chèn sau dòng `  url: "<from 2c>"`:**

```yaml
  # api_base: ["<api prefix 1>", "<api prefix 2>"]   # optional LIST: real API URL prefixes when they differ from url's origin (multi-service apps). Scopes the network rail; omit → scope = url origin.
```

- [ ] **Step 3: README — thêm 3 bullet vào CUỐI danh sách Known limitations (sau bullet cuối cùng hiện có của section):**

```markdown
- **The cross-layer rail (wave 1) is advisory and tag-keyed**: forgetting to
  tag a criterion `(cross-layer)` silences W4 + pairing rule (c) — the
  remaining nets are the feature-loop gap-probe cross-check and the human at
  Gate 1 (standalone acceptance-gate runs have no gap-probe: lint + human
  only). `network_observed:` is not hook-enforced until evidence schema v3; a
  fabricated `clean` is narrowed — not blocked — by the
  clean-requires-traffic vocab rule (`no-app-traffic`) and the pre-merge
  dump-file NOTE.
- **The kit validates evidence of declared evals, not the environment a
  `config:` binding points at**: a `layer: backend-effect` eval bound to a
  mock passes mechanically (engine/binding split) — the nets are the Gate-1
  human review of bindings and the A/B Analyst green-on-both flag.
- **Mobile flows are UI-layer evidence only (this wave)**: simulators have no
  network-reading path, so cross-layer truth on mobile rests entirely on the
  paired `layer: backend-effect` eval. A first-class `mobile` surface is
  queued until a real mobile repo adopts the kit.
```

- [ ] **Step 4: Verify + Commit**

Run: `grep -n "api_base" commands/acceptance-init.md && grep -c "cross-layer" README.md`
Expected: 2 hit trong acceptance-init; count ≥ 2 trong README.

```bash
git add commands/acceptance-init.md README.md
git commit -m "docs(init+README): binding dev_server.api_base dạng list + 3 bullet Known limitations cho rail xuyên lớp wave 1"
```

---

### Task 8: Codex parity — acceptance SKILL overlay + ui_verifier.toml + feature-loop-codex SKILL

**Files:**
- Modify: `codex/acceptance-gate/skills/acceptance/SKILL.md` (Phase 1 step 2 :100-101, Phase 2 step 4 :130-146, Phase 3 step 1 :176-182, cuối bảng `## Degradation table` :270+)
- Modify: `codex/feature-loop-codex/agent-templates/acceptance_ui_verifier.toml` (toàn bộ `developer_instructions`)
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (step 6 :230-235, step 7 :236-239, step 8 cross-checks :250-252, step 8-delta :365-372, step 10 :382-388, step 15 :423+)

**Interfaces:**
- Consumes: đúng các khối văn bản Task 3/4/5 (English). KHÔNG đụng `plugins/**` (bản sinh).

- [ ] **Step 1: codex acceptance SKILL.md — áp 4 khối Y HỆT Task 4** (file này cùng cấu trúc English với root; các khối chép lại nguyên văn để executor không phải mở Task 4):

1a. Phase 1 step 2 — thay `Tag business-judgment criteria with \`(judgment)\`.` bằng:

```
   Tag business-judgment criteria with `(judgment)`. Tag criteria whose
   When/Then crosses the backend (a UI flow triggering an API call / data
   mutation) with `(cross-layer)` — pairing rule (c), lint W4 and the
   gap-probe cross-check key off this tag.
```

1b. Phase 2 step 4: `two rules` → `three rules`; chèn sau rule (b):

```
   (c) **Cross-layer pairing.** Every criterion tagged `(cross-layer)` MUST
       have ≥1 eval declaring `layer: backend-effect` (executor `test`/`script`,
       `cmd` a `config:` ref) proving the backend effect of THAT action —
       a ui-check alone is NEVER sufficient evidence for a cross-layer
       criterion. Author it self-driving with its own nonce (POST X → assert X);
       never author "GET-asserts-what-the-UI-flow-created" (races the parallel
       ui lane). The ui-check half must assert a server-derived marker (and
       re-assert after reload for mutations). See eval-executors.md §Pairing
       mechanics.
```

và thay câu lint `...(W1) and out-of-scope items with zero negative evals (W3).` bằng `...(W1), out-of-scope items with zero negative evals (W3), and \`(cross-layer)\` criteria with no \`layer: backend-effect\` eval (W4).`

1c. Phase 3 step 1 instruction quote — chèn TRƯỚC dấu nháy đóng của đoạn instruction (kết thúc `...the overall verdict is PENDING-JUDGMENT, never PASS."`):

```
 For every ui-check where the driver can read network traffic (a browser tool
   with read_network_requests or equivalent): after driving the flow, dump
   failed requests + console errors to evidence/E{id}-network.txt and record
   network_observed: with WORDS ONLY — clean | no-app-traffic |
   third-party-only | app-fail | n-a (driver) | n-a (tool-error: <reason>) |
   unscoped | unscoped-partial. FAIL-eligible = fetch/XHR to the
   dev_server.url origin or an api_base prefix; third-party and static assets
   never fail; in-scope connection-error/timeout/5xx FAILS that eval even when
   frames look right; 4xx fails unless the eval's expected declares that exact
   status. clean REQUIRES seen app traffic (none seen = no-app-traffic). No
   network path = n-a (driver) — never an invented clean. Raw statuses stay in
   the txt file, never in the report.
```

1d. Cuối `## Degradation table` — thêm 2 row:

```
| Driver cannot read network (curl+grep SSR runs no JS; mobile simulator; capture-only) | ui-check counts as UI-LAYER evidence only — `network_observed: n-a (driver)`; a `(cross-layer)` criterion REQUIRES its paired `layer: backend-effect` eval; missing pair → W4 + gap-probe + Gate-1 flag |
| `dev_server.url` / `api_base` not (fully) configured — multi-origin app | network rail is note-only (`unscoped` / `unscoped-partial`), never FAILs |
```

- [ ] **Step 2: `codex/feature-loop-codex/agent-templates/acceptance_ui_verifier.toml` — thay toàn bộ file bằng:**

```toml
name = "acceptance_ui_verifier"
description = "Acceptance Gate UI verifier that captures observed visual evidence without editing product code."
model = "gpt-5.6-sol"
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
developer_instructions = """
Act only as an S4 UI grader. Do not edit product code. Run the approved UI steps, manage the dev server safely, save the required frames or HTML evidence, inspect every saved frame, and report observed behavior against the expected result. A contradictory frame is FAIL even when the command exits zero.
Network truth: this harness normally has NO network-reading path — then record network_observed: n-a (driver); never claim otherwise. Only when a network-capable browser tool is actually driving: dump failed requests + console errors to evidence/E{id}-network.txt and record WORDS ONLY (clean | no-app-traffic | third-party-only | app-fail | n-a (driver) | n-a (tool-error: <reason>) | unscoped | unscoped-partial). clean REQUIRES seen app traffic — zero app requests is no-app-traffic, never clean. FAIL-eligible = fetch/XHR to the dev_server.url origin or an api_base prefix; third-party and static assets never fail; in-scope connection-error/timeout/5xx FAILS the eval even when frames look right; 4xx fails unless the eval's expected declares that exact status. Raw status numbers stay in the txt file, never in report fields.
"""
```

- [ ] **Step 3: codex feature-loop-codex SKILL.md — 5 chỗ:**

3a. Step 6 (evals) — nối vào cuối câu "...an eval without `paths` always reruns (safe default).":

```
 A criterion tagged `(cross-layer)` additionally needs ≥1 `test`/`script` eval
   declaring `layer: backend-effect` (pairing rule (c); lint W4 keys off both —
   a ui-check alone is never sufficient cross-layer evidence).
```

3b. Step 8 cross-checks — thay `(4) mandatory cross-checks: ACs with no eval, GWTs that cannot be measured, Coverage axes with no AC;` bằng:

```
(4) mandatory
   cross-checks: ACs with no eval, GWTs that cannot be measured, Coverage axes
   with no AC, and criteria whose When/Then crosses the backend but lack the
   `(cross-layer)` tag or carry UI-layer evals only (ui-check/judgment);
```

3c. Step 8-delta (P1) — nối sau "Suite commands always rerun.":

```
 Atomic-pair: an eval belonging to a `(cross-layer)` criterion may carry
   forward ONLY when every eval of that criterion is carry-eligible; if any
   member must rerun, rerun the whole pair (backend evidence and UI-layer
   evidence of one flow must come from the same round).
```

3d. Step 10 (ui-check) — nối vào cuối step (sau "...save asserted HTML and record the fallback."):

```
 This harness normally cannot read network traffic — record
    `network_observed: n-a (driver)` for ui-check blocks unless a
    network-capable browser tool is actually driving; never invent `clean`.
```

3e. Step 15 (report) — nối sau câu "...Mint stable ids like `minted-<slug>-<evalId>-r<round>` when the command has no run id.":

```
 Copy `network_observed:` verbatim from the ui verifier result; a missing
    value is `n-a (driver)` — never a synthesized `clean`. Words only; raw
    statuses stay in `evidence/E{id}-network.txt`.
```

- [ ] **Step 4: Verify + chạy codex tests**

Run: `grep -c "cross-layer\|network_observed" codex/acceptance-gate/skills/acceptance/SKILL.md codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md codex/feature-loop-codex/agent-templates/acceptance_ui_verifier.toml && bash tests/codex/run-tests.sh 2>&1 | tail -3`
Expected: mọi count ≥ 1; codex suite `0 failed` (routing/runner tests không pin prose SKILL).

- [ ] **Step 5: Commit**

```bash
git add codex/
git commit -m "feat(codex-parity): rule (c) + network stance thật cho lane Codex — ui_verifier n-a (driver) mặc định, report copy-verbatim, atomic-pair, gap-probe cross-check"
```

---

### Task 9: Version bump + sync mirrors + full test sweep

**Files:**
- Modify: `.claude-plugin/plugin.json` (version 1.18.0 → 1.19.0 + nối câu vào description)
- Modify: `feature-loop/.claude-plugin/plugin.json` (1.15.0 → 1.16.0 + nối câu)
- Modify: `codex/acceptance-gate/.codex-plugin/plugin.json`, `codex/feature-loop-codex/.codex-plugin/plugin.json` (đọc file, bump version field lên 1.19.0 / 1.16.0 tương ứng)
- Modify: `scripts/sync-plugin-packages.sh` (:49 dòng echo)
- Regenerate: `plugins/**` (bằng script, không sửa tay)
- Modify: `.codex-plugin/plugin.json` (root — version 1.19.0, P03 assert đẳng thức với `.claude-plugin`)
- Modify: `tests/plugins/run-tests.sh` (pin suite P03/P04/P22 — literal version mới)

- [ ] **Step 1: Bump versions**

`.claude-plugin/plugin.json`: `"version": "1.18.0"` → `"version": "1.19.0"`; nối vào CUỐI chuỗi description (trước dấu nháy đóng):

```
 v1.19 adds the cross-layer false-green rail (wave 1): a (cross-layer) contract tag + backend-effect pairing rule + lint W4 + an advisory network-truth vocab (network_observed) in ui-check evidence with app-origin scoping, plus degradation stances for network-blind drivers (curl/mobile).
```

`feature-loop/.claude-plugin/plugin.json`: `"version": "1.15.0"` → `"version": "1.16.0"`; nối vào cuối description:

```
 v1.16 wires network truth into the S4 ui agent (optional networkObserved passthrough + copy-verbatim synthesize rule), adds the gap-probe cross-layer cross-check and atomic-pair carry-forward for (cross-layer) criteria.
```

2 file codex plugin.json: mở từng file, đổi giá trị `"version"` thành `1.19.0` (acceptance-gate) / `1.16.0` (feature-loop-codex). `scripts/sync-plugin-packages.sh` dòng cuối: thay `acceptance-gate@1.18.0 feature-loop-codex@1.14.0` bằng `acceptance-gate@1.19.0 feature-loop-codex@1.16.0` (giữ `design-loop@0.3.0`).

- [ ] **Step 2: Regenerate mirrors + kiểm diff**

Run: `bash scripts/sync-plugin-packages.sh && git status --short plugins/ | head -20`
Expected: các file plugins/acceptance-gate/{skills,scripts}/… + plugins/feature-loop-codex/… đổi tương ứng — KHÔNG có diff nào ngoài các file wave này.

- [ ] **Step 3: Full test sweep**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -2 && bash tests/workflows/run-tests.sh 2>&1 | tail -2 && bash tests/hooks/run-tests.sh 2>&1 | tail -2 && bash tests/codex/run-tests.sh 2>&1 | tail -2 && bash tests/plugins/run-tests.sh 2>&1 | tail -2`
Expected: cả 5 suite `0 failed` — đặc biệt tests/hooks PHẢI xanh nguyên vẹn (chứng minh evidence schema v2 không bị đụng).

- [ ] **Step 4: Commit cuối**

```bash
git add .claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json codex/acceptance-gate/.codex-plugin/plugin.json codex/feature-loop-codex/.codex-plugin/plugin.json scripts/sync-plugin-packages.sh plugins/
git commit -m "feat(release): acceptance-gate 1.19.0 + feature-loop 1.16.0 — cross-layer false-green rail wave 1 (Tag → Pair → Wire-truth); sync mirrors"
```

---

## Definition of done (đối chiếu spec)

- §3.1 tag → Task 3 (template) + 4 + 8; §3.2 pairing/mechanics → Task 3 + 4 + 8; §3.3 W4 → Task 1; §3.4 network-truth runtime → Task 2 + 3; §3.5 chuỗi hành trình → Task 2 (synthesize) + 4 (Phase 3) + 8 (codex); §3.6 gap-probe → Task 5 + 8, lập trường standalone → Task 7 (README); §3.7 atomic-pair → Task 5 + 8; §3.8 pre-merge NOTE → Task 6; §3.9 api_base → Task 7; §3.10 degradation + Known limitations → Task 4 + 7 + 8.
- Bất biến: tests/hooks xanh nguyên vẹn; không file nào trong `hooks/`, `lib/`, `scripts/recheck-evidence.js` bị đổi (`git diff --stat main -- hooks/ lib/ scripts/recheck-evidence.js` phải RỖNG).
