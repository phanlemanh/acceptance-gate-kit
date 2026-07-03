# Đợt 3 — Observed Evidence + VLM Seam — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ép hành vi "đã XEM frame" vào evidence (field `observed:`, hook/CI-enforced từ schema v2) + mở seam second-opinion khác nhà (`vlm-assert` reference script, Gemini REST).

**Architecture:** Một check mới L2 OBSERVED trong `lib/evidence-core.js` (hook + recheck cùng hưởng); chuỗi hành vi ép nhìn nằm ở UI_SCHEMA + 2 prompt trong workflow verify + template/SKILL; V2 là reference script scaffold theo khuôn `ui-capture` (kit zero-dependency, script sống ở repo tiêu thụ).

**Tech Stack:** Node stdlib (không npm dep), bash test suites fixture-driven, vm harness cho workflow tests.

**Spec:** `docs/specs/2026-07-03-dot3-observed-evidence-design.md` (đã duyệt 2026-07-03).

## Global Constraints

- Kit zero-dependency: chỉ Node stdlib + bash; script V2 dùng `fetch` built-in (Node ≥ 18).
- `_acceptance/config.yaml` parser đòi indent 2-space — mọi ví dụ YAML giữ 2-space.
- Workflow scripts (`feature-loop/workflows/*.js`): cấm `Date`/`Math.random`/fs; TEXT PROMPT MỚI viết ASCII tiếng Việt KHÔNG DẤU (khớp style hiện có — test W17 pin nguyên văn).
- `lib/evidence-core.js` là single source of truth — KHÔNG thêm luật riêng ở hook/recheck; caller chỉ in message.
- Backward tolerance: enforce observed CHỈ khi frontmatter `schema_version` ≥ 2; report cũ → pre-merge NOTE.
- Messages trong core/hook/template/SKILL/eval-executors: tiếng Anh (khớp file); GUIDE.md: tiếng Việt.
- KHÔNG đụng `plugins/feature-loop-codex/` và `design-loop/`.
- **Nếp repo này (override bước Commit của skill):** KHÔNG commit/push từng task — Task 7 trình nhóm commit, CHỜ user duyệt rồi mới commit.
- Suite đầy đủ: `for t in hooks scripts plugins design-loop workflows; do bash tests/$t/run-tests.sh; done`. LƯU Ý: `tests/plugins` sẽ ĐỎ giữa chừng (root ≠ plugins/acceptance-gate) cho tới khi chạy sync ở Task 7 — expected, chỉ cần hooks/scripts/workflows xanh per-task.

---

### Task 1: Preflight (nếp bắt buộc)

**Files:** không sửa gì.

- [ ] **Step 1: main + pull**

```bash
cd /Users/manh-macmini/dev/acceptance-gate-kit
git checkout main && git pull --ff-only && git status --short
```
Expected: branch main, working tree sạch (trừ `docs/specs/2026-07-03-*.md` + `docs/plans/2026-07-03-*.md` chưa commit).

- [ ] **Step 2: full suite baseline xanh**

```bash
for t in hooks scripts plugins design-loop workflows; do echo "== $t =="; bash tests/$t/run-tests.sh || echo "SUITE $t FAILED"; done
```
Expected: cả 5 suite `0 failed`. Nếu đỏ → DỪNG, báo user (không sửa đè lên baseline đỏ).

---

### Task 2: L2 OBSERVED — evidence-core + hook + recheck (TDD)

**Files:**
- Modify: `tests/hooks/run-tests.sh` (thêm T30–T39 trước 2 dòng Results cuối)
- Modify: `lib/evidence-core.js` (hàm `evaluateObserved` + wire vào `evaluateEvidence`)
- Modify: `hooks/acceptance-evidence-gate.js` (in section L2 OBSERVED)
- Modify: `scripts/recheck-evidence.js` (in dòng L2 OBSERVED)

**Interfaces:**
- Produces: `evaluateEvidence(payload, opts)` trả thêm field `observedFailures: string[]`; `anyFailure` tính cả nó. Task 3/5 dựa trên luật: enforce chỉ khi `schema_version ≥ 2`, trigger là dòng `screenshot:` trong block `- eval:`, nội dung thực chất ≥ 20 ký tự sau khi strip `{{...}}`/comment/`|>`.

- [ ] **Step 1: Thêm test T30–T39 (RED)**

Trong `tests/hooks/run-tests.sh`, chèn NGAY TRƯỚC hai dòng cuối (`echo ""` / `echo "Results: ..."`; tức sau `rm -rf "$RL_DIR"` của T29):

```bash
echo ""
echo "--- L2 OBSERVED (schema v2: screenshot blocks must be inspected) ---"

OBS_V2='---
schema_version: 2
verdict: PASS
---
## Evidence
- eval: E1
  run_id: ob-001
  exit_code: 0
  verifier: scripts/verify-login.sh
  verified_at: 2026-07-03T10:00:00Z
  screenshot: evidence/E1-step1.png'

echo "T30 v2 PASS screenshot block WITHOUT observed -> block"
payload Write "$REPORT_PATH" "$OBS_V2" | node "$HOOK" >/dev/null 2>/dev/null; check T30 2 $?

echo "T31 v2 PASS screenshot block WITH substantive observed -> allow"
payload Write "$REPORT_PATH" "$OBS_V2
  observed: form login hien thi day du, sau submit chuyen sang /dashboard voi user menu" | node "$HOOK" >/dev/null; check T31 0 $?

echo "T32 v2 observed is template placeholder -> block"
payload Write "$REPORT_PATH" "$OBS_V2
  observed: {{mo ta noi dung frame o day, du 20 ky tu}}" | node "$HOOK" >/dev/null 2>/dev/null; check T32 2 $?

echo "T33 v2 observed too short -> block"
payload Write "$REPORT_PATH" "$OBS_V2
  observed: ok" | node "$HOOK" >/dev/null 2>/dev/null; check T33 2 $?

echo "T34 v1 screenshot without observed -> tolerated (backward)"
payload Write "$REPORT_PATH" '---
schema_version: 1
verdict: PASS
---
- eval: E1
  run_id: ob-002
  exit_code: 0
  verifier: scripts/verify-login.sh
  verified_at: 2026-07-03T10:00:00Z
  screenshot: evidence/E1-step1.png' | node "$HOOK" >/dev/null; check T34 0 $?

echo "T35 v2 block WITHOUT screenshot needs no observed -> allow"
payload Write "$REPORT_PATH" '---
schema_version: 2
verdict: PASS
---
- eval: E1
  run_id: ob-003
  exit_code: 0
  verifier: scripts/verify-login.sh
  verified_at: 2026-07-03T10:00:00Z' | node "$HOOK" >/dev/null; check T35 0 $?

echo "T36 v2 multi-line observed (pipe block) -> allow"
payload Write "$REPORT_PATH" "$OBS_V2
  observed: |
    frame 1 hien thi form login voi 2 truong nhap
    frame 2 hien thi dashboard sau khi dang nhap thanh cong" | node "$HOOK" >/dev/null; check T36 0 $?

echo "T37 v2 .html fallback screenshot without observed -> block"
payload Write "$REPORT_PATH" '---
schema_version: 2
verdict: PASS
---
- eval: E2
  run_id: ob-004
  exit_code: 0
  verifier: scripts/verify-login.sh
  verified_at: 2026-07-03T10:00:00Z
  screenshot: evidence/E2-step1.html' | node "$HOOK" >/dev/null 2>/dev/null; check T37 2 $?

echo "T38 v2 PENDING-JUDGMENT screenshot without observed -> allow (enforced at PASS upgrade)"
payload Write "$REPORT_PATH" '---
schema_version: 2
verdict: PENDING-JUDGMENT
---
- eval: E1
  run_id: ob-005
  exit_code: 0
  verifier: scripts/verify-login.sh
  verified_at: 2026-07-03T10:00:00Z
  screenshot: evidence/E1-step1.png' | node "$HOOK" >/dev/null; check T38 0 $?

echo "T39 Edit upgrading v2 PENDING-JUDGMENT -> PASS without observed -> block"
UP2="$REPO/_acceptance/obs-up"
mkdir -p "$UP2"
cat > "$UP2/evidence-report.md" <<'EOF'
---
schema_version: 2
verdict: PENDING-JUDGMENT
---
- eval: E1
  run_id: ob-006
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-07-03T10:00:00Z
  screenshot: evidence/E1-step1.png
EOF
payload Edit "$UP2/evidence-report.md" 'verdict: PASS' 'verdict: PENDING-JUDGMENT' | node "$HOOK" >/dev/null 2>/dev/null; check T39 2 $?
rm -rf "$UP2"
```

- [ ] **Step 2: Chạy — xác nhận RED**

```bash
bash tests/hooks/run-tests.sh
```
Expected: T30, T32, T33, T37, T39 FAIL (expected exit 2, got 0); T31/T34/T35/T36/T38 pass; T01–T29 + C01–C09 giữ nguyên pass.

- [ ] **Step 3: Implement `evaluateObserved` trong `lib/evidence-core.js`**

Chèn SAU block `loadRunLogIds` (sau dòng `return ids;` + `}` của nó, trước section `// ─── Verifier extraction`):

```js
// ─── Observed inspection (L2 OBSERVED — schema v2+) ────────────────────────

// A `screenshot:` in an evidence block proves a frame was SAVED; `observed:`
// proves someone LOOKED at it. From template schema_version 2, every
// screenshot-bearing block in a PASS-family report must describe what is
// visible in the frames (>= OBSERVED_MIN_CHARS substantive chars after
// stripping {{...}} placeholders, comments and YAML block markers). Older
// reports (schema < 2 / absent) are tolerated here — pre-merge-check.sh NOTEs
// them instead.
const OBSERVED_MIN_CHARS = 20;

function evaluateObserved(payload) {
  const failures = [];
  const sv = parseInt(frontmatterField(payload, 'schema_version') || '', 10);
  if (!(sv >= 2)) return failures;
  const lines = String(payload).split('\n');
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*-\s+eval\s*[:=]/i.test(lines[i])) starts.push(i);
  }
  for (let b = 0; b < starts.length; b++) {
    const block = lines.slice(starts[b], b + 1 < starts.length ? starts[b + 1] : lines.length);
    if (!block.some(l => /^\s*screenshot\s*[:=]/i.test(l))) continue;
    const evalId = (block[0].match(/^\s*-\s+eval\s*[:=]\s*(\S+)/i) || [])[1] || `#${b + 1}`;
    let content = null;
    for (let i = 0; i < block.length; i++) {
      const m = block[i].match(/^\s*observed\s*[:=]\s*(.*)$/i);
      if (!m) continue;
      const parts = [m[1]];
      for (let j = i + 1; j < block.length; j++) {
        if (/^\s*(?:-\s+)?[\w-]+\s*[:=]/.test(block[j])) break; // next field line
        parts.push(block[j]);
      }
      content = parts.join(' ');
      break;
    }
    const substantive = (content || '')
      .replace(/\{\{[^}]*\}\}/g, '')   // template placeholders don't count
      .replace(/(^|\s)#[^\n]*/g, '')   // comments don't count
      .replace(/[|>]/g, ' ')           // YAML block markers
      .trim();
    if (substantive.length < OBSERVED_MIN_CHARS) {
      failures.push(
        `eval ${evalId}: screenshot evidence without substantive observed: ` +
        `(${content === null ? 'field missing' : 'placeholder/too short'}) — ` +
        `the verifier must OPEN each saved frame (multimodal Read) and describe what is visible vs expected`
      );
    }
  }
  return failures;
}
```

- [ ] **Step 4: Wire vào `evaluateEvidence`**

Trong `evaluateEvidence`, SAU block `runLogFailure` (sau `}` đóng `if (fileDir) {...}` của run-log) và TRƯỚC dòng `const anyFailure = ...`:

```js
  // L2 OBSERVED — schema v2+ only (backward-tolerant; see evaluateObserved).
  const observedFailures = evaluateObserved(payload);
```

Sửa dòng anyFailure + return:

```js
  const anyFailure = missing.length > 0 || authFailures.length > 0 || !!judgmentFailure || !!consistencyFailure || !!runLogFailure || observedFailures.length > 0;
  return { missing, consistencyFailure, authFailures, judgmentFailure, runLogFailure, observedFailures, anyFailure };
```

Cập nhật comment đầu file (dòng 4): `(L1 SHAPE, L1 CONSISTENCY, L2 SUBSTANCE, L2 OBSERVED, L3 JUDGMENT)`.

- [ ] **Step 5: In failure ở hook**

Trong `hooks/acceptance-evidence-gate.js`, SAU block `if (r.runLogFailure) {...}` (trước `lines.push('A PASS verdict is only valid...`):

```js
    if (r.observedFailures && r.observedFailures.length) {
      lines.push('L2 OBSERVED — screenshot evidence not inspected:');
      lines.push(...r.observedFailures.map(x => `  x ${x}`));
      lines.push('');
    }
```

Cập nhật comment header hook (sau dòng L2 SUBSTANCE): thêm dòng
`* L2 OBSERVED   — schema v2: screenshot-bearing block lacks a substantive observed:`.

- [ ] **Step 6: In failure ở recheck**

Trong `scripts/recheck-evidence.js`, sau dòng `if (r.runLogFailure) out.push(...)`:

```js
for (const o of r.observedFailures || []) out.push(`  L2 OBSERVED    x ${o}`);
```

- [ ] **Step 7: Chạy — GREEN + không vỡ suite scripts**

```bash
bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh
```
Expected: hooks 100% pass (T30–T39 xanh); scripts giữ nguyên xanh (fixtures đều schema v1 → tolerated).

---

### Task 3: pre-merge NOTE cho report v1 có screenshot thiếu observed (TDD)

**Files:**
- Modify: `tests/scripts/run-tests.sh` (thêm case OBS01 trước 2 dòng Results cuối)
- Modify: `scripts/pre-merge-check.sh` (NOTE sau block run-log NOTE, ~dòng 293)

**Interfaces:**
- Consumes: helper `front_field`, biến `$report`/`$slug` có sẵn trong vòng lặp per-slug của pre-merge-check.sh; helper `mk_feature` của test suite (viết report schema v1).

- [ ] **Step 1: Test OBS01 (RED)** — chèn trước 2 dòng Results cuối của `tests/scripts/run-tests.sh`:

```bash
echo ""
echo "--- observed NOTE (schema v1 report with screenshot evidence) ---"
echo "OBS01 v1 report with screenshot lacking observed -> pass + NOTE"
R="$T/obsnote"; mk_feature "$R" feat-obs T2 implemented PASS "Manh Phan 2026-06-10"
printf '  screenshot: evidence/E1-step1.png\n' >> "$R/_acceptance/feat-obs/evidence-report.md"
out="$(bash "$CHECK" "$R" 2>&1)"; rc=$?
check OBS01-exit 0 $rc
printf '%s' "$out" | grep -q 'observed' ; check OBS01-note 0 $?
```

- [ ] **Step 2: Chạy — RED**

```bash
bash tests/scripts/run-tests.sh
```
Expected: OBS01-exit pass, OBS01-note FAIL (chưa có NOTE).

- [ ] **Step 3: Implement NOTE** — trong `scripts/pre-merge-check.sh`, NGAY SAU block run-log NOTE:

```bash
  if [ ! -f "$dir/run-log.jsonl" ]; then
    echo "NOTE [$slug]: no run-log.jsonl (older verify flow) — run_id provenance is not machine-logged; report run_ids are unreconciled. Re-verify to generate the log."
  fi
```

thêm:

```bash
  # observed (schema v2): older reports with screenshot evidence never faced the
  # inspected-frames bar — tolerated, but must be visible.
  sv="$(front_field "$report" schema_version)"
  case "$sv" in (*[!0-9]*|'') sv=1 ;; esac
  if [ "$sv" -lt 2 ] \
     && grep -qiE '^[[:space:]]*screenshot[[:space:]]*[:=]' "$report" \
     && ! grep -qiE '^[[:space:]]*observed[[:space:]]*[:=]' "$report"; then
    echo "NOTE [$slug]: schema v$sv report has screenshot evidence without observed: — frame inspection was not machine-enforced for this report. Re-verify with template v2 to enforce."
  fi
```

- [ ] **Step 4: Chạy — GREEN**

```bash
bash tests/scripts/run-tests.sh
```
Expected: 100% pass (OBS01 xanh, các case cũ không đổi — NOTE không đổi exit code).

---

### Task 4: Workflow — UI_SCHEMA `observed` + 2 prompt (TDD)

**Files:**
- Modify: `tests/workflows/acceptance-verify.test.mjs` (thêm W17 trước `summary('acceptance-verify')`)
- Modify: `feature-loop/workflows/acceptance-verify.js` (UI_SCHEMA ~dòng 57; prompt ui agent ~dòng 266; prompt synthesize ~dòng 447)

**Interfaces:**
- Consumes: harness `runWorkflow/check/byLabel` + `responder` có sẵn trong test file.
- Produces: kết quả ui agent có field `observed` (string) — spread `...r` sẵn có đưa nó vào `machine[]` → `machineForReportB` → JSON trong prompt synthesize (không cần code dẫn thêm).

- [ ] **Step 1: Test W17 (RED)** — chèn trước `summary('acceptance-verify');`:

```js
console.log('W17 observed evidence: UI_SCHEMA + prompts (Đợt 3 — AI đổi phải chủ động sửa test)');
{
  const uEval = { id: 'E5', criterion: 'AC-5', executor: 'ui-check', steps: ['open /'], expected: '200' };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [uEval], suiteCommands: [] }), responder({
    'ui:E5': { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/E5-step1.png', observed: 'trang dashboard hien thi user menu va bang so lieu' },
  }));
  const ui = byLabel(calls, 'ui:')[0];
  check('W17 UI_SCHEMA has observed property', !!(ui.opts.schema && ui.opts.schema.properties && ui.opts.schema.properties.observed));
  check('W17 ui prompt instructs opening frames with Read', /MO TUNG file frame/.test(ui.prompt));
  check('W17 ui prompt: frame contradicting Expected => FAIL', /MAU THUAN Expected/.test(ui.prompt));
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W17 synthesize carries observed value into report payload', synth.prompt.includes('trang dashboard hien thi user menu'));
  check('W17 synthesize instructs the observed field + schema v2', /observed/.test(synth.prompt) && /schema v2/.test(synth.prompt));
}
```

- [ ] **Step 2: Chạy — RED**

```bash
bash tests/workflows/run-tests.sh
```
Expected: 5 check W17 FAIL; W01–W16 pass.

- [ ] **Step 3: UI_SCHEMA** — trong `acceptance-verify.js`, thêm property vào `UI_SCHEMA.properties` (sau `screenshotPath`):

```js
    observed: { type: 'string', description: 'mo ta NOI DUNG nhin thay trong TUNG frame da luu (da mo bang Read, doi chieu expected); chuoi rong neu cannotRun/khong co frame' },
```

(KHÔNG thêm vào `required` — case cannotRun không có frame; prompt + hook là 2 tầng ép.)

- [ ] **Step 4: Prompt ui agent** — sau bullet `- Evidence file: ...` (dòng bắt đầu `` `- Evidence file: mkdir -p ...` ``), thêm bullet mới:

```js
      `- observed (BAT BUOC khi co frame): MO TUNG file frame vua luu bang Read (anh doc truc tiep; .html doc noi dung file) roi VIET field observed = thay gi CU THE trong tung frame, doi chieu Expected. KHONG viet observed tu tri nho lenh/steps — phai doc file that. Neu noi dung frame MAU THUAN Expected → assertion do FAIL: exitCode phai khac 0 du lenh exit 0.\n` +
```

- [ ] **Step 5: Prompt synthesize** — trong chuỗi prompt synthesize, sửa đoạn:

old:
```
block cua eval ui-check ghi them field "screenshot:" = screenshotPath tu ket qua
```
new:
```
block cua eval ui-check ghi them field "screenshot:" = screenshotPath tu ket qua VA field "observed:" = observed tu ket qua (template schema v2 — hook CHAN report PASS co screenshot: ma thieu observed: thuc chat ≥20 ky tu; neu ket qua ui THIEU observed → TU MO tung frame evidence da luu bang Read va viet observed truoc khi ghi report, KHONG bia)
```

- [ ] **Step 6: Chạy — GREEN**

```bash
bash tests/workflows/run-tests.sh
```
Expected: 100% pass (W17 xanh; W13 default responder không có observed vẫn PASS — workflow không gate, hook gate).

---

### Task 5: Template v2 + SKILL.md + eval-executors (docs hành vi — acceptance-gate)

**Files:**
- Modify: `skills/acceptance/references/evidence-report-template.md`
- Modify: `skills/acceptance/SKILL.md` (Phase 3 step 1 + step 2)
- Modify: `skills/acceptance/references/eval-executors.md` (ui-check mechanics)

- [ ] **Step 1: Template — bump schema + example + Field notes**

(a) Trong template body (sau `---8<---`): `schema_version: 1` → `schema_version: 2`.

(b) Block E3 example, sau dòng `screenshot: evidence/E3-step1.png   # first frame; ...` thêm:

```
  observed: |
    {{1-3 lines describing what is actually VISIBLE in the frames, cross-checked
    against the eval's expected — written AFTER opening each frame with a
    multimodal Read. >= 20 substantive chars; placeholders do not count.}}
```

(c) Thêm đoạn Field-notes mới NGAY TRƯỚC đoạn `Provenance (CI-enforced, ...)`:

```
Observed (hook-enforced from schema_version 2): every evidence block carrying a
`screenshot:` (PNG frames or the .html fallback) must also carry `observed:` —
1-3 lines describing what is actually VISIBLE in the saved frames, written only
AFTER opening each frame with a multimodal Read, cross-checked against the
eval's `expected`. Describe the content, not the command. If what you see
contradicts `expected`, that eval FAILS even when the command exited 0. If the
verify machinery supplied no observed text (older workflow), the report writer
must Read the frames and write it before claiming PASS. The hook blocks a v2
PASS report whose screenshot blocks lack a substantive observed (>= 20 chars
after stripping placeholders); schema_version < 2 reports are tolerated and
pre-merge NOTEs them.
```

(d) Trong `Verdict rules:` bullet `PASS`, sau câu "sanitize pasted logs." thêm:
`Screenshot-bearing blocks additionally need a substantive observed: (see Field notes).`

- [ ] **Step 2: SKILL.md Phase 3**

(a) Step 1 (chuỗi instruction cho verify subagent), sau câu `Never mark PASS without captured output.` thêm:

```
For every ui-check: after saving frames, OPEN each frame with a multimodal
Read and record observed: — 1-3 lines of what is visible vs expected; a
frame contradicting expected means that eval FAILS even with exit 0; never
write observed from memory.
```

(b) Step 2 bullet `ui-check`, sau `screenshot:` = the first frame.` thêm câu:
`Read each saved frame and record observed: in its report block (schema-v2 reports without it are hook-blocked).`

- [ ] **Step 3: eval-executors.md — ui-check mechanics**

Trong section `## ui-check mechanics`, thêm bullet SAU bullet `- **Capture a frame per state transition**...`:

```
- **Look at what you saved** — after writing the frames, open each one with a
  multimodal Read and record `observed:` in the report block (template schema
  v2, hook-enforced): what is actually visible, cross-checked against
  `expected`. A frame that contradicts `expected` fails the eval even when the
  assertion command exited 0. This is the anti-"saved but never looked" rail.
```

- [ ] **Step 4: Sanity suites**

```bash
bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh
```
Expected: xanh (docs không đổi hành vi test).

---

### Task 6: V2 — vlm-assert reference + init 3c + docs (TDD)

**Files:**
- Modify: `tests/scripts/run-tests.sh` (thêm V01–V03 trước 2 dòng Results cuối, sau OBS01)
- Create: `skills/acceptance/references/vlm-assert.reference.mjs`
- Modify: `commands/acceptance-init.md` (bước 3c + 2 dòng comment trong YAML mẫu)
- Modify: `skills/acceptance/references/eval-executors.md` (subsection VLM cuối file)

**Interfaces:**
- Produces: script `vlm-assert.reference.mjs` — `node <script> <image> "<closed YES/NO question>"`; exit 0=YES, 1=NO, 2=cannot-run (usage/ảnh không đọc được/thiếu key/lỗi API/câu trả lời không phải YES-NO); env `GEMINI_API_KEY` (bắt buộc), `VLM_MODEL` (default `gemini-2.5-flash`).
- Thứ tự check cứng (tests dựa vào): args → đọc ảnh → key → network. Không network trong test.

- [ ] **Step 1: Tests V01–V03 (RED)** — chèn sau case OBS01:

```bash
echo ""
echo "--- vlm-assert.reference.mjs (V2 seam — no network in tests) ---"
VLM="$HERE/../../skills/acceptance/references/vlm-assert.reference.mjs"

echo "V01 missing args -> exit 2 + usage"
node "$VLM" 2>/dev/null; check V01 2 $?

echo "V02 unreadable image -> exit 2 (before key/network)"
GEMINI_API_KEY=dummy node "$VLM" "$T/nonexistent.png" "is a video player visible?" 2>/dev/null; check V02 2 $?

echo "V03 missing GEMINI_API_KEY -> exit 2 (before network)"
IMG="$T/vlm-img.png"; printf 'fake-png-bytes' > "$IMG"
env -u GEMINI_API_KEY node "$VLM" "$IMG" "is a video player visible?" 2>/dev/null; check V03 2 $?
```

- [ ] **Step 2: Chạy — RED**

```bash
bash tests/scripts/run-tests.sh
```
Expected: V01–V03 FAIL (script chưa tồn tại → node exit 1, expected 2).

- [ ] **Step 3: Viết `skills/acceptance/references/vlm-assert.reference.mjs`**

```js
#!/usr/bin/env node
/* vlm-assert.reference.mjs — REFERENCE implementation of `executors.ui.vlm_assert`.
 *
 * A CROSS-FAMILY second opinion on a saved UI frame: a different model family
 * (default: Gemini) re-reads the screenshot and answers ONE closed YES/NO
 * question. This is an ASSERTION, not a judge — open quality questions
 * ("does it look good?") are judgment/design-loop territory (No blind VLM
 * judge). Same-family graders share "looks done" bias; a second family cuts
 * correlated error on exactly the evidence class where hallucinated
 * completion lives (screenshots).
 *
 * The Acceptance-Gate Kit ships NO API dependency — this is a starting point
 * you OWN; it lives in YOUR repo with YOUR key. Adopt:
 *   cp <plugin>/skills/acceptance/references/vlm-assert.reference.mjs scripts/vlm-assert.mjs
 *   export GEMINI_API_KEY=...           # your key, your env/secret manager
 *   _acceptance/config.yaml:
 *     executors:
 *       ui:
 *         vlm_assert: "node scripts/vlm-assert.mjs"
 * Evals point at a thin per-assertion wrapper (see eval-executors.md) because
 * a script eval's cmd carries no per-eval args.
 *
 * Usage: node scripts/vlm-assert.mjs <image> "<closed YES/NO question>"
 * Exit:  0 = YES · 1 = NO · 2 = cannot run (usage/image/key/API/non-YES-NO)
 *        — 2 maps to cannotRun/BLOCKED in the verify lane, never false-green.
 * Env:   GEMINI_API_KEY (required), VLM_MODEL (default gemini-2.5-flash —
 *        check Google's current model list; swap provider = 1 URL + 1 payload).
 * Node >= 18 (built-in fetch). Zero npm dependency.
 */
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

const [image, question] = process.argv.slice(2);
if (!image || !question) {
  console.error('usage: vlm-assert <image> "<closed YES/NO question>"');
  process.exit(2);
}

let b64;
try {
  b64 = readFileSync(image).toString('base64');
} catch (e) {
  console.error(`vlm-assert: cannot read image ${image}: ${e.message}`);
  process.exit(2);
}

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('vlm-assert: GEMINI_API_KEY not set');
  process.exit(2);
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' }[extname(image).toLowerCase()] || 'image/png';
const MODEL = process.env.VLM_MODEL || 'gemini-2.5-flash';

let res;
try {
  res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [
        { inline_data: { mime_type: MIME, data: b64 } },
        { text: `Answer with exactly one word, YES or NO. ${question}` },
      ] }],
      generationConfig: { temperature: 0 },
    }),
  });
} catch (e) {
  console.error(`vlm-assert: network error: ${e.message}`);
  process.exit(2);
}
if (!res.ok) {
  console.error(`vlm-assert: API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(2);
}
const data = await res.json();
const text = String(
  data && data.candidates && data.candidates[0] && data.candidates[0].content
    && data.candidates[0].content.parts
    ? data.candidates[0].content.parts.map(p => p.text || '').join(' ')
    : ''
).trim().toUpperCase();
const word = (text.match(/\b(YES|NO)\b/) || [])[1];
if (!word) {
  console.error(`vlm-assert: non-YES/NO answer: "${text.slice(0, 120)}"`);
  process.exit(2);
}
console.log(`${word} — ${question}`);
process.exit(word === 'YES' ? 0 : 1);
```

- [ ] **Step 4: Chạy — GREEN**

```bash
bash tests/scripts/run-tests.sh
```
Expected: 100% pass (V01: usage exit 2; V02: ảnh không đọc được exit 2 trước khi chạm key; V03: thiếu key exit 2 trước network).

- [ ] **Step 5: `commands/acceptance-init.md` — bước 3c + YAML mẫu**

(a) Trong YAML mẫu (block `executors:`), sau 2 dòng `design:`, thêm:

```yaml
  # ui:                                                # optional (step 3c): cross-family VLM
  #   vlm_assert: "node scripts/vlm-assert.mjs"        # second opinion on saved UI frames
```

(b) Sau bước 3b, thêm:

```markdown
3c. **(optional) Scaffold the external-VLM second opinion.** If the user wants a
    cross-model check on saved UI frames (a different model family re-reads the
    screenshots and answers closed YES/NO questions), copy
    `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/vlm-assert.reference.mjs`
    into the repo as `scripts/vlm-assert.mjs`; tell them to set `GEMINI_API_KEY`
    (the script calls Gemini REST via Node's built-in fetch — zero npm
    dependency; override the model with `VLM_MODEL`), and add the
    `executors.ui.vlm_assert` key above. Evals use it through a thin
    per-assertion wrapper — closed questions only, opt-in per eval (see the
    acceptance skill's eval-executors reference). The script + key live in the
    REPO, NOT in the plugin.
```

- [ ] **Step 6: eval-executors.md — subsection VLM (cuối file)**

````markdown
## External VLM second-opinion (optional, opt-in per eval)

A cross-family model (default: Gemini) re-reads a saved frame and answers ONE
closed YES/NO question — an assertion, not a judge. Same-family graders share
"looks done" bias; a second family reduces correlated error on exactly the
evidence class where hallucinated completion lives (screenshots).

- Scaffold: `/acceptance-init` step 3c copies `vlm-assert.reference.mjs` →
  `scripts/vlm-assert.mjs` (repo-owned; `GEMINI_API_KEY` env; exit 0=YES,
  1=NO, 2=cannot-run → the verify lane maps 2 to BLOCKED, never false-green).
- Per-eval wiring: image + question are eval-specific and a `script` eval only
  has `cmd` — so each assertion is a thin repo wrapper the eval points at
  (a script path is an authentic verifier, same as `scripts/verify-ui-login.sh`
  in the report template):

  ```yaml
  - id: E6
    criterion: AC-5
    executor: script
    cmd: scripts/vlm/video-player-visible.sh
    expected: "exit 0 — frame shows a rendered video player >= 300px wide"
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  ```

  ```sh
  #!/bin/sh
  # scripts/vlm/video-player-visible.sh
  exec node scripts/vlm-assert.mjs \
    _acceptance/video-plugin/evidence/E3-step2.png \
    "Does this frame show a rendered video player at least 300 pixels wide?"
  ```

- CLOSED questions only ("is X visible?", "does the page show Y?"). OPEN
  quality questions ("does it look good / on-brand?") stay `judgment` /
  design-loop — No blind VLM judge.
- Opt-in per eval: Phase 2 EVAL-GEN never adds these automatically.
````

---

### Task 7: GUIDE + bump 1.10.0 + sync + full suite → DỪNG chờ duyệt commit

**Files:**
- Modify: `GUIDE.md` (mục 4, mục 7, mục 8)
- Modify: `.claude-plugin/plugin.json` (1.9.2 → 1.10.0)
- Modify: `feature-loop/.claude-plugin/plugin.json` (1.9.0 → 1.10.0)
- Chạy: `scripts/sync-plugin-packages.sh` (đồng bộ `.codex-plugin` + `plugins/acceptance-gate/`)

- [ ] **Step 1: GUIDE.md**

(a) Mục 4 (Bên trong S4 VERIFY), thêm bullet vào phần mô tả ui-check:

```markdown
- **Observed (v1.10):** agent ui-check phải MỞ từng frame đã lưu (Read đa
  phương thức) và ghi `observed:` — thấy gì cụ thể, đối chiếu expected — vào
  block evidence. Frame mâu thuẫn expected = eval FAIL dù lệnh exit 0. Hook
  chặn report PASS (schema v2) có `screenshot:` mà thiếu `observed:` thực chất
  — đóng lỗ "chụp mà không xem".
```

(b) Mục 7 (bảng tra cứu enforcement), thêm hàng:

```markdown
| L2 OBSERVED | Report PASS schema v2: block có `screenshot:` thiếu `observed:` thực chất (≥20 ký tự, không placeholder) | Hook (khi ghi) + CI recheck | Mở từng frame bằng Read, viết observed thật; report cũ (v1) chỉ bị NOTE |
```

(bám đúng format bảng hiện có của mục 7 — đọc bảng rồi khớp cột.)

(c) Mục 8 (Tinh chỉnh), thêm subsection:

```markdown
### 8.x Second-opinion khác nhà cho frame UI (tùy chọn)

Grader cùng một nhà model chia sẻ cùng thiên kiến "trông-có-vẻ-xong". Kit mở
seam cho một model khác nhà (mặc định Gemini) đọc lại frame đã lưu và trả lời
MỘT câu hỏi đóng YES/NO — là assertion, không phải judge:

- `/acceptance-init` bước 3c scaffold `scripts/vlm-assert.mjs` (script sống ở
  repo, key `GEMINI_API_KEY` của repo — kit không ôm dependency).
- Mỗi assertion = một wrapper mỏng (`scripts/vlm/<ten>.sh`) mà eval `script`
  trỏ tới; exit 0=YES, 1=NO, 2=không-chạy-được → BLOCKED, không bao giờ
  xanh-giả.
- CHỈ câu hỏi đóng ("có thấy video player không?"); câu hỏi mở về thẩm mỹ
  thuộc judgment/design-loop — No blind VLM judge. Opt-in từng eval, EVAL-GEN
  không tự thêm.
```

- [ ] **Step 2: Bump versions**

```bash
node -e "
const fs=require('fs');
for (const [p,v] of [['.claude-plugin/plugin.json','1.10.0'],['feature-loop/.claude-plugin/plugin.json','1.10.0']]) {
  const j=JSON.parse(fs.readFileSync(p,'utf8')); j.version=v;
  fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
  console.log(p,'->',v);
}"
```

- [ ] **Step 3: Sync gói**

```bash
bash scripts/sync-plugin-packages.sh
```
Expected: `Synced .../plugins/acceptance-gate (version 1.10.0)`.

- [ ] **Step 4: Full suite**

```bash
for t in hooks scripts plugins design-loop workflows; do echo "== $t =="; bash tests/$t/run-tests.sh || echo "SUITE $t FAILED"; done
```
Expected: 5/5 suite `0 failed` (plugins xanh lại sau sync).

- [ ] **Step 5: DỪNG — trình nhóm commit, chờ user duyệt (KHÔNG tự commit)**

Đề xuất 4 nhóm:
1. `feat(gate): observed evidence — L2 OBSERVED core/hook/recheck, template v2, SKILL + eval-executors, pre-merge NOTE, tests`
2. `feat(loop): ui-check observed — UI_SCHEMA + verify/synthesize prompts + W17`
3. `feat(acceptance): external-VLM second-opinion seam — vlm-assert reference, init 3c, eval-executors docs, tests`
4. `Release: acceptance-gate 1.10.0, feature-loop 1.10.0 — Đợt 3 observed evidence + VLM seam (sync gói, GUIDE, spec + plan)`

---

## Self-review (đã chạy khi viết plan)

- **Spec coverage:** §3.1–3.3 → Task 2+3; §3.4 → Task 4+5; §4 → Task 6; §5 test plan → T30–T39/OBS01/V01–V03/W17 + packaging qua suite plugins; §6 → Task 7 + Task 1 preflight. Không còn mục spec nào thiếu task.
- **Placeholder scan:** không còn TBD/`...`-code; mọi bước code có nội dung đầy đủ. (`{{...}}` trong template là nội dung chủ đích của template, không phải placeholder của plan.)
- **Type consistency:** field `observedFailures` (core → hook/recheck) dùng thống nhất; `observed` (UI_SCHEMA/result/report field) thống nhất; exit-code contract của vlm-assert (0/1/2) khớp giữa script, tests và docs; ngưỡng 20 ký tự thống nhất core/template/GUIDE.
