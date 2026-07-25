# Cross-layer Rail Wave 2 — Mobile Surface + CI Pairing Teeth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface `mobile` first-class (làn eval `test` qua runner native) + VIOLATION cặp-eval tại pre-merge (răng CI cho pairing rule (c)) + đồng hồ đo `network_observed` trong /acceptance-report — evidence schema GIỮ v2, hooks/lib không đụng.

**Spec:** `docs/superpowers/specs/2026-07-25-cross-layer-wave2-mobile-design.md` (đọc trước khi làm bất kỳ task nào).

**Architecture:** Răng đặt ở merge boundary (`pre-merge-check.sh` — đọc sẵn contract + evals, chặn mọi runtime), KHÔNG đặt ở hook write-time. Mobile không có executor mới — chỉ là binding `config:executors.test.e2e_mobile` chạy machine lane sẵn có. Backend-target là human-glance có chỗ bám máy (dòng Notes + lint W5 advisory). `plugins/*` là bản SINH — regenerate ở task cuối.

**Tech Stack:** bash (pre-merge awk line-based), Node.js no-dep (lint), markdown skill/command docs.

## Global Constraints

- Evidence `schema_version` GIỮ **2** — CẤM sửa `hooks/`, `lib/evidence-core.js`, `scripts/recheck-evidence.js`. DoD: `git diff --stat main -- hooks/ lib/ scripts/recheck-evidence.js` RỖNG.
- Tên máy-đọc NHẤT QUÁN (đã có từ wave 1): tag `(cross-layer)`, field `layer: backend-effect`, warning mới `W5`, dòng contract `Mobile backend target: local|staging|mock`.
- Pairing VIOLATION chỉ áp cho feature ĐANG bị gate (status `implemented|verified|signed-off`, tier thuộc `required_for`) — draft/approved để W4 advisory lo. Fail-open: thiếu `evals.yaml` → NOTE, không block.
- Parse quote/comment/case-tolerant đồng ngữ nghĩa với `fieldVal` của lint (strip `"`/`'`, strip ` # comment`, so sánh `backend-effect` case-insensitive).
- Ngôn ngữ khớp file đích: references/SKILL/README/codex = English; `feature-loop/skills/feature-loop/SKILL.md` = tiếng Việt có dấu.
- `plugins/**` không sửa tay — `scripts/sync-plugin-packages.sh` ở Task 8. KHÔNG đụng frontmatter `version: 1.14.0` của codex feature-loop SKILL (bị P05b + skill-routing pin — bài học wave 1).
- Mỗi task: chạy suite liên quan trước khi commit; commit riêng từng task.

---

### Task 1: Lint W5 — surfaces mobile thiếu dòng "Mobile backend target:" (TDD)

**Files:**
- Modify: `scripts/eval-coverage-lint.js` (header comment ~:18-20, lintFeature sau block W4 ~:140, footer ~:186)
- Test: `tests/scripts/run-tests.sh` (chèn sau block L13, hiện ~:412-413)

**Interfaces:**
- Consumes: contract frontmatter dòng `surfaces: [...]`; dòng quy ước `Mobile backend target:` bất kỳ đâu trong contract.
- Produces: warning `W5` — Task 3/4/7 tham chiếu đúng tên này và đúng dòng quy ước `Mobile backend target: local|staging|mock`.

- [ ] **Step 1: Viết test fail — 3 fixture + L14/L15/L16**

Trong `tests/scripts/run-tests.sh`, tìm:

```sh
echo "L13 hash inside quoted value is data (marker after # kept) -> clean"
node "$LINT" "$T/lintJ" >/dev/null; check L13 0 $?
```

Chèn NGAY SAU đó:

```sh
# Fixture K: surfaces include mobile, contract has NO "Mobile backend target:" line -> W5
K="$T/lintK/_acceptance/feat-m1"; mkdir -p "$K"
cat > "$K/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api, mobile]
---
## Criteria
- AC-1: Given user taps pay, When order submits, Then confirmation screen shows.
## Out of scope
EOF
cat > "$K/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0; e2e mobile flow green"
EOF

# Fixture L: mobile + backend-target line in ## Notes -> clean
L="$T/lintL/_acceptance/feat-m2"; mkdir -p "$L"
cat > "$L/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api, mobile]
---
## Criteria
- AC-1: Given user taps pay, When order submits, Then confirmation screen shows.
## Out of scope
## Notes
Mobile backend target: staging — shared QA backend, seeded nightly.
EOF
cat > "$L/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0; e2e mobile flow green"
EOF

# Fixture M: no mobile surface -> W5 never fires
M="$T/lintM/_acceptance/feat-m3"; mkdir -p "$M"
cat > "$M/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api, ui]
---
## Criteria
- AC-1: Given user taps pay, When order submits, Then confirmation screen shows.
## Out of scope
EOF
cat > "$M/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0; flow green"
EOF

echo "L14 surfaces include mobile, no backend-target line -> warn (W5)"
node "$LINT" "$T/lintK" >/dev/null; check L14 1 $?
echo "L15 mobile + Mobile backend target line -> clean"
node "$LINT" "$T/lintL" >/dev/null; check L15 0 $?
echo "L16 no mobile surface -> W5 silent"
node "$LINT" "$T/lintM" >/dev/null; check L16 0 $?
```

- [ ] **Step 2: Chạy để thấy fail**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "L1[456]"`
Expected: `FAIL: L14 (expected exit 1, got 0)`; L15/L16 PASS (hành vi hiện tại đã exit 0).

- [ ] **Step 3: Implement W5 trong `scripts/eval-coverage-lint.js`**

3a. Header comment — chèn NGAY SAU 3 dòng mô tả W4 (khối ` *   W4 ...`):

```js
 *   W5  a contract whose `surfaces:` include mobile but carries no
 *       "Mobile backend target: local|staging|mock" line — the Gate-1 human
 *       cannot eyeball the V4 (mock-vs-real) risk of the paired backend eval
```

3b. `lintFeature` — chèn NGAY SAU vòng `for` của W4 (trước dòng `const oos = outOfScopeBullets(contractText);`):

```js
  // W5 — mobile backend-target presence (advisory): the kit never verifies the
  // VALUE (engine/binding split; a machine cannot check the word "real") — it
  // only checks the line EXISTS so the Gate-1 human has something to eyeball.
  if (/^surfaces:.*\bmobile\b/im.test(contractText)
      && !/mobile backend target\s*:/i.test(contractText)) {
    warns.push(`[${slug}] W5 surfaces include mobile but the contract has no "Mobile backend target:" line (## Notes) — declare local|staging|mock so the Gate-1 human can eyeball the V4 risk.`);
  }
```

3c. Footer — thay:

```js
  console.log('\nW1 = a bounded/threshold criterion needs a just-below should-NOT-fire (boundary) eval; W3 = give the out-of-scope half real negative evals; W4 = a (cross-layer) criterion needs a paired layer: backend-effect eval.');
```

bằng:

```js
  console.log('\nW1 = a bounded/threshold criterion needs a just-below should-NOT-fire (boundary) eval; W3 = give the out-of-scope half real negative evals; W4 = a (cross-layer) criterion needs a paired layer: backend-effect eval; W5 = a mobile-surface contract needs a "Mobile backend target:" line.');
```

- [ ] **Step 4: Chạy full suite scripts**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -2`
Expected: `0 failed` (L01-L13 + N/PM/S/P/R cũ nguyên xanh — fixture cũ không có `surfaces:` chứa mobile).

- [ ] **Step 5: Commit**

```bash
git add scripts/eval-coverage-lint.js tests/scripts/run-tests.sh
git commit -m "feat(lint): W5 — contract mobile thiếu dòng 'Mobile backend target:' (advisory, presence-only — máy không xác thực giá trị)"
```

---

### Task 2: Pre-merge — VIOLATION cặp-eval cross-layer (TDD)

**Files:**
- Modify: `scripts/pre-merge-check.sh` (chèn SAU block Gate-1 `approved_by`/`gate1_skipped` — kết thúc bằng `fi` — và TRƯỚC dòng `report="$dir/evidence-report.md"`)
- Test: `tests/scripts/run-tests.sh` (chèn sau block N04, hiện ~:173)

**Interfaces:**
- Consumes: tag `(cross-layer)` trong `## Criteria` của contract; field `criterion:` + `layer:` trong `evals.yaml` (quote/comment/case-tolerant).
- Produces: VIOLATION chặn merge — README (Task 4) và eval-executors §Mobile mechanics (Task 3) tham chiếu hành vi "pre-merge blocks the merge".

- [ ] **Step 1: Viết test fail — PM01-PM06, chèn NGAY SAU block N04** (sau dòng `case "$outN4" in ... esac`):

```sh
echo ""
echo "--- pre-merge cross-layer pairing teeth (wave 2) ---"
mk_xl() { # <root> <slug> <criteria-lines> <evals-body> [status] — gated feature + valid signed PASS report
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  local st="${5:-implemented}"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: T2\nsurfaces: [api, mobile]\nstatus: %s\napproved_by: Manh Phan\napproved_at: 2026-07-25\n---\n## Criteria\n%s\n## Out of scope\n## Notes\nMobile backend target: staging — QA backend.\n' "$2" "$2" "$st" "$3" > "$d/contract.md"
  if [ -n "$4" ]; then printf -- 'evals:\n%s\n' "$4" > "$d/evals.yaml"; fi
  local v="$1/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v"
  printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nhuman_signoff: Manh 2026-07-25\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-07-25\n' "$2" "$2" "$v" > "$d/evidence-report.md"
}
echo "PM01 tagged (cross-layer) + evals thiếu layer: backend-effect -> VIOLATION (block)"
mk_xl "$P/pm01" feat-xl1 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "e2e mobile green"'
bash "$CHECK" "$P/pm01" >/dev/null; check PM01 1 $?
echo "PM02 tagged + paired layer: backend-effect -> clean"
mk_xl "$P/pm02" feat-xl2 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "e2e mobile green"
  - id: E2
    criterion: AC-1
    executor: test
    layer: backend-effect
    expected: "order row exists via API"'
bash "$CHECK" "$P/pm02" >/dev/null; check PM02 0 $?
echo "PM03 tagged nhưng KHÔNG có evals.yaml -> NOTE (fail-open), exit 0"
mk_xl "$P/pm03" feat-xl3 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)' ''
outPM3="$(bash "$CHECK" "$P/pm03" 2>&1)"; check PM03 0 $?
case "$outPM3" in *NOTE*feat-xl3*pairing*) echo "  PASS: PM03-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM03-note (expected pairing NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "PM04 không tag cross-layer -> block pairing im lặng"
mk_xl "$P/pm04" feat-xl4 '- AC-1: Given app, When submit order, Then order saved via API.' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "e2e mobile green"'
outPM4="$(bash "$CHECK" "$P/pm04" 2>&1)"; check PM04 0 $?
case "$outPM4" in *cross-layer*) echo "  FAIL: PM04-silent (unexpected pairing output)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: PM04-silent"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
echo "PM05 layer quoted/mixed-case/trailing-comment + layer TRƯỚC criterion -> vẫn tính là paired, clean"
mk_xl "$P/pm05" feat-xl5 '- AC-1: Given app, When submit order, Then order saved via API. (Cross-Layer)' '  - id: E2
    executor: script
    layer: "Backend-Effect"  # nonce note
    criterion: "AC-1"
    expected: "order row exists via API"'
bash "$CHECK" "$P/pm05" >/dev/null; check PM05 0 $?
echo "PM06 feature draft (chưa gated) -> ngoài scope, exit 0"
mk_xl "$P/pm06" feat-xl6 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "e2e mobile green"' draft
bash "$CHECK" "$P/pm06" >/dev/null; check PM06 0 $?
```

- [ ] **Step 2: Chạy để thấy fail**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "PM0[1-6]"`
Expected: `FAIL: PM01 (expected exit 1, got 0)` và `FAIL: PM03-note`; PM02/PM04/PM05/PM06 PASS sẵn (hành vi hiện tại không có check → exit 0).

- [ ] **Step 3: Implement — chèn vào `scripts/pre-merge-check.sh`**, NGAY SAU `fi` đóng block Gate-1 (block `if [ -z "$approved_by" ]; then ... esac fi`) và TRƯỚC `report="$dir/evidence-report.md"`:

```sh
  # Cross-layer pairing teeth (wave 2): a gated feature whose contract tags a
  # criterion (cross-layer) MUST pair it with >=1 eval declaring
  # layer: backend-effect in evals.yaml — otherwise this merge would ride on
  # UI-only evidence for a UI→API→backend path. Write-time stays advisory
  # (lint W4); this is the merge-boundary backstop for every runtime.
  # Fail-open: evals.yaml missing → NOTE, never a block.
  xl_acs="$(awk '/^#/{insec=0} /^##[[:space:]]+Criteria/{insec=1; next} insec && tolower($0) ~ /^[[:space:]]*[-*].*\(cross-layer\)/ { if (match($0, /AC-[0-9]+/)) print substr($0, RSTART, RLENGTH) }' "$contract")"
  if [ -n "$xl_acs" ]; then
    if [ ! -f "$dir/evals.yaml" ]; then
      echo "NOTE [$slug]: cross-layer criteria declared but no evals.yaml — pairing unverifiable (fail-open)"
    else
      # Buffer per eval block then flush: `layer:` may appear BEFORE `criterion:`
      # in a hand-written evals.yaml — printing at layer-time would miss those.
      xl_paired="$(awk '
        function flush() { if (lay=="backend-effect" && crit!="") print crit }
        tolower($0) ~ /^[[:space:]]*-[[:space:]]*id:/ { flush(); crit=""; lay="" }
        tolower($0) ~ /^[[:space:]]*criterion:[[:space:]]*/ {v=$0; sub(/^[^:]*:[[:space:]]*/,"",v); gsub(/["'\'']/,"",v); sub(/[[:space:]]+#.*$/,"",v); sub(/[[:space:]]+$/,"",v); crit=v}
        tolower($0) ~ /^[[:space:]]*layer:[[:space:]]*/ {v=tolower($0); sub(/^[^:]*:[[:space:]]*/,"",v); gsub(/["'\'']/,"",v); sub(/[[:space:]]+#.*$/,"",v); sub(/[[:space:]]+$/,"",v); lay=v}
        END { flush() }
      ' "$dir/evals.yaml" | sort -u)"
      while IFS= read -r xac; do
        [ -n "$xac" ] || continue
        if ! printf '%s\n' "$xl_paired" | grep -qx "$xac"; then
          echo "VIOLATION [$slug]: $xac is tagged (cross-layer) but no eval of it declares layer: backend-effect — a cross-layer criterion would merge on UI-only evidence; add the paired test/script eval, or untag it with the human's sign-off at Gate 1"
          violations=$((violations+1))
        fi
      done <<XLACS
$xl_acs
XLACS
    fi
  fi
```

- [ ] **Step 4: Chạy full suite scripts**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -2`
Expected: `0 failed` — mọi fixture cũ (S/P/R/N/A/V/L) không có tag trong Criteria nên block im lặng; PM01-06 xanh.

- [ ] **Step 5: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): VIOLATION cặp-eval — criterion (cross-layer) thiếu layer: backend-effect chặn merge (răng CI của pairing rule (c); fail-open khi thiếu evals.yaml)"
```

---

### Task 3: References — contract-template + eval-executors (§Mobile mechanics)

**Files:**
- Modify: `skills/acceptance/references/contract-template.md` (dòng surfaces ~:31, Frontmatter rules ~:7-21)
- Modify: `skills/acceptance/references/eval-executors.md` (bảng executor row `test` :8, rule 3b sau rule 3, §Mobile mechanics TRƯỚC `## ui-check mechanics` :133)

**Interfaces:**
- Consumes: W5 + dòng `Mobile backend target:` (Task 1), hành vi pre-merge (Task 2).
- Produces: §Mobile mechanics — nguồn sự thật Task 4/7 trỏ tới bằng cụm "eval-executors §Mobile mechanics".

- [ ] **Step 1: contract-template.md — 2 edit**

1a. Thay dòng:

```
surfaces: [{{api|cli|sdk|ui, comma-separated}}]
```

bằng:

```
surfaces: [{{api|cli|sdk|ui|mobile, comma-separated}}]
```

1b. Trong "Frontmatter rules:", chèn bullet MỚI ngay SAU bullet `gate1_skipped: true`:

```
- `surfaces` may include `mobile`: app flows driven by the repo's native E2E
  runner (XCUITest / Espresso / Maestro / Detox…). The runner's exit code is
  UI-LAYER evidence only — a `(cross-layer)` criterion on mobile REQUIRES its
  paired `layer: backend-effect` eval (pre-merge BLOCKS the merge otherwise),
  and the contract's ## Notes carries a `Mobile backend target:
  local|staging|mock` line (lint W5 checks presence; the human eyeballs the value)
```

- [ ] **Step 2: eval-executors.md — 3 edit**

2a. Bảng executor, thay row:

```
| `test` | api / backend / sdk | Machine (exit code) | run_id, exit_code, verifier, verified_at |
```

bằng:

```
| `test` | api / backend / sdk / mobile flow (native E2E runner) | Machine (exit code) | run_id, exit_code, verifier, verified_at |
```

2b. Chèn rule 3b — NGAY SAU block rule 3 (kết thúc `...never sufficient cross-layer evidence.`), TRƯỚC `4. Criterion containing words like...`:

```
3b. Criterion observable only through the MOBILE app → still `test`, bound to
   `config:executors.test.e2e_mobile` — the runner's exit code is UI-LAYER
   evidence only (see §Mobile mechanics below). Never `ui-check`: there is no
   browser, no network log, no `network_observed` on this lane.
```

2c. Chèn section MỚI ngay TRƯỚC `## ui-check mechanics` (tức sau bullet cuối của §Pairing mechanics, `...ordinary machine eval.`):

```markdown
## Mobile mechanics — surface `mobile`

Mobile flows are ordinary `test` evals — no new executor. The binding is
`config:executors.test.e2e_mobile` (XCUITest: `xcodebuild test -project
App.xcodeproj -scheme AppUITests -destination 'platform=iOS Simulator,name=…'`;
Espresso: `./gradlew connectedAndroidTest`), so the machine lane's dedupe, A/B
baseline, run-log and carry-forward all apply automatically.

- **Evidence class:** the runner's exit code is UI-LAYER evidence only —
  simulators have no network-reading path, so `network_observed` does not
  exist on this lane. ALL cross-layer truth lives in the paired
  `layer: backend-effect` eval; a `(cross-layer)` criterion with no pair is
  BLOCKED at merge by `pre-merge-check.sh` (CI teeth of pairing rule (c)).
- **Simulator absent on the verify machine** → the runner cannot start →
  `cannotRun` → verdict BLOCKED, never a silent skip or a downgrade.
- **Operational stance:** declare `paths:` on mobile evals (P1 carry-forward
  skips the slow suite on delta rounds that do not touch the app); do NOT put
  the mobile e2e command into `feature_loop.suite_keys` — a slow, flaky suite
  re-run every round burns the 3-round cap.
- **Backend target (V4 risk):** each mobile feature's contract carries one
  line in `## Notes` — `Mobile backend target: local|staging|mock — <note>`.
  Lint W5 checks the line EXISTS; the Gate-1 human eyeballs the VALUE (a mock
  target means the paired eval proves the backend path, not the deployment).
  The kit never machine-verifies "real" (engine/binding split).
```

- [ ] **Step 3: Verify + Commit**

Run: `grep -c "mobile" skills/acceptance/references/contract-template.md skills/acceptance/references/eval-executors.md && grep -n "Mobile mechanics" skills/acceptance/references/eval-executors.md`
Expected: count ≥2 và ≥6; section hiện đúng 1 lần + các tham chiếu.

```bash
git add skills/acceptance/references/contract-template.md skills/acceptance/references/eval-executors.md
git commit -m "docs(references): surface mobile — enum + rule 3b + §Mobile mechanics (làn test native, UI-layer evidence, backend-target human-glance)"
```

---

### Task 4: acceptance SKILL root + acceptance-init + README

**Files:**
- Modify: `skills/acceptance/SKILL.md` (Phase 1 step 4 ~:99-101, Degradation table cuối ~:291-292)
- Modify: `commands/acceptance-init.md` (sau câu hỏi c2 ~:19, template executors ~:36)
- Modify: `README.md` (thay bullet mobile trong Known limitations)

- [ ] **Step 1: SKILL.md Phase 1 step 4 — thay**

```
4. Set frontmatter: `risk_tier` (from Phase 0), `status: draft`,
   `surfaces` (only surfaces this feature actually touches), and
```

bằng:

```
4. Set frontmatter: `risk_tier` (from Phase 0), `status: draft`,
   `surfaces` (only surfaces this feature actually touches; `mobile` = native
   E2E app flows — see eval-executors.md §Mobile mechanics), and
```

- [ ] **Step 2: SKILL.md Degradation table — thêm row CUỐI bảng** (sau row `dev_server.url / api_base not (fully) configured…`):

```
| Mobile e2e runner needs a simulator/emulator absent on the verify machine | cannotRun → BLOCKED + reason — never a silent skip or a downgrade |
```

- [ ] **Step 3: acceptance-init.md — 2 edit**

3a. Chèn sau block câu hỏi `c2.` (kết thúc `...offer to scaffold a reference (step 3b).`):

```
   c3. Mobile surface? The native E2E runner command →
       `executors.test.e2e_mobile` (XCUITest: `xcodebuild test -project
       App.xcodeproj -scheme AppUITests -destination 'platform=iOS
       Simulator,name=iPhone 16'`; Espresso: `./gradlew connectedAndroidTest`).
       Remind: each mobile feature's contract carries a `Mobile backend
       target: local|staging|mock` line in ## Notes (lint W5 checks presence;
       the Gate-1 human eyeballs the value).
```

3b. Trong config template, chèn sau dòng `    api: "<from 2a>"`:

```yaml
    # e2e_mobile: "<from 2c3>"   # native E2E runner (xcodebuild test … / ./gradlew connectedAndroidTest) — exit code = UI-layer evidence only
```

- [ ] **Step 4: README.md — THAY trọn bullet mobile hiện tại** (4 dòng bắt đầu `- **Mobile flows are UI-layer evidence only (this wave)**...` kết thúc `...adopts the kit.`) bằng:

```markdown
- **Mobile is a first-class surface (1.20) with CI teeth — but UI-layer
  evidence only**: mobile flows run through the repo's native E2E runner
  (`executors.test.e2e_mobile`); simulators have no network-reading path, so
  the runner's exit code never proves network truth. `pre-merge-check.sh` now
  BLOCKS the merge when a `(cross-layer)` criterion has no paired
  `layer: backend-effect` eval. The backend target (local|staging|mock) is a
  human-eyeballed contract line — lint W5 checks presence only; the kit never
  machine-verifies "real".
```

- [ ] **Step 5: Verify + Commit**

Run: `grep -n "e2e_mobile\|Mobile backend target" commands/acceptance-init.md | head -4 && grep -c "first-class surface (1.20)" README.md && grep -c "simulator/emulator absent" skills/acceptance/SKILL.md`
Expected: init 3-4 hit; README = 1; SKILL = 1.

```bash
git add skills/acceptance/SKILL.md commands/acceptance-init.md README.md
git commit -m "docs(acceptance+init+README): surface mobile — degradation simulator BLOCKED, scaffold e2e_mobile, bullet Known limitations mới (CI teeth)"
```

---

### Task 5: /acceptance-report — đồng hồ đo network

**Files:**
- Modify: `commands/acceptance-report.md` (bước Scan :15-23, bước Print :33-43)

**Interfaces:**
- Produces: format dòng "Network truth (advisory rail): ..." — Task 7 chép nguyên sang codex skill.

- [ ] **Step 1: Bước 1 Scan — chèn bullet sau bullet `run-log.jsonl`:**

```
   - `evidence-report.md` body when present: every `network_observed:` value —
     first token after the colon, quotes stripped; values starting `n-a` all
     count into the `n-a` bucket (covers `n-a (driver)` and `n-a (tool-error:
     …)`);
```

- [ ] **Step 2: Bước 3 Print — chèn bullet sau bullet `Hygiene counts`:**

```
   - Network truth (advisory rail): `clean N · app-fail N · no-app-traffic N ·
     third-party-only N · n-a N · unscoped N · unscoped-partial N — K features
     with data`. One action line per feature carrying `app-fail` (an in-scope
     failure was recorded) or `no-app-traffic` on a `(cross-layer)` criterion
     (dead-button signal). When K ≥ 5, add: "đủ mẫu vận hành — cân nhắc
     máy-kiểm hóa network (schema v3, spec wave 2 §5)".
```

- [ ] **Step 3: Verify + Commit**

Run: `grep -c "network_observed\|Network truth" commands/acceptance-report.md`
Expected: ≥2.

```bash
git add commands/acceptance-report.md
git commit -m "feat(report): đồng hồ đo network_observed — phân bố 7 bucket + action line + ngưỡng ≥5 feature để cân nhắc schema v3"
```

---

### Task 6: feature-loop SKILL — mobile không kích hoạt làn design

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (S0 mục 5, dòng :73)

- [ ] **Step 1: Nối vào CUỐI dòng 73** (sau `...trước khi tốn công S1-D (fidelity sẽ skip).`):

```
 Surface `mobile` KHÔNG phải web-UI surface: không kích hoạt CT1/CT2/làn design (design-loop là web-only) — flow mobile đi làn eval `test` qua `config:executors.test.e2e_mobile` (xem eval-executors.md §Mobile mechanics).
```

- [ ] **Step 2: Verify + Commit**

Run: `grep -c "e2e_mobile" feature-loop/skills/feature-loop/SKILL.md`
Expected: 1.

```bash
git add feature-loop/skills/feature-loop/SKILL.md
git commit -m "docs(feature-loop): surface mobile không kích hoạt CT1/làn design — đi làn test e2e_mobile"
```

---

### Task 7: Codex parity — acceptance SKILL + acceptance-report skill + feature-loop-codex SKILL

**Files:**
- Modify: `codex/acceptance-gate/skills/acceptance/SKILL.md` (Phase 1 step 4 + Degradation table — cùng anchor văn bản English như root)
- Modify: `codex/acceptance-gate/skills/acceptance-report/SKILL.md` (section `## 1. Scan` + section Print)
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (sau đoạn lane-names D0/D1/D2, ~:144-145)

KHÔNG đụng `plugins/**` (bản sinh) và KHÔNG đụng frontmatter `version:` của feature-loop-codex SKILL.

- [ ] **Step 1: codex acceptance SKILL — 2 edit Y NGUYÊN VĂN Task 4 Step 1 + Step 2** (chép lại để đọc độc lập):

1a. Thay `   \`surfaces\` (only surfaces this feature actually touches), and` bằng:

```
   `surfaces` (only surfaces this feature actually touches; `mobile` = native
   E2E app flows — see eval-executors.md §Mobile mechanics), and
```

1b. Thêm row cuối Degradation table:

```
| Mobile e2e runner needs a simulator/emulator absent on the verify machine | cannotRun → BLOCKED + reason — never a silent skip or a downgrade |
```

- [ ] **Step 2: codex acceptance-report SKILL — 2 edit:**

2a. Trong `## 1. Scan`, chèn bullet sau bullet `run-log.jsonl`:

```
- `evidence-report.md` body when present: every `network_observed:` value —
  first token after the colon, quotes stripped; values starting `n-a` all
  count into the `n-a` bucket (covers `n-a (driver)` and `n-a (tool-error: …)`);
```

2b. Trong section Print (mục liệt kê output, sau dòng/bullet hygiene counts), chèn:

```
- Network truth (advisory rail): `clean N · app-fail N · no-app-traffic N ·
  third-party-only N · n-a N · unscoped N · unscoped-partial N — K features
  with data`. One action line per feature carrying `app-fail` or
  `no-app-traffic` on a `(cross-layer)` criterion. When K ≥ 5, add: "đủ mẫu
  vận hành — cân nhắc máy-kiểm hóa network (schema v3, spec wave 2 §5)".
```

- [ ] **Step 3: codex feature-loop-codex SKILL — chèn đoạn sau paragraph lane-names** (sau câu `**D2** = CT1 plus CT2. They are presentation terms only.`):

```
A `mobile` surface is NOT a web-UI surface: it never turns CT1/CT2 on
(design-loop is web-only). Mobile flows take the ordinary `test` lane via
`config:executors.test.e2e_mobile` (eval-executors §Mobile mechanics) — exit
code is UI-layer evidence; the paired `layer: backend-effect` eval carries the
cross-layer truth, and pre-merge blocks the merge when the pair is missing.
```

- [ ] **Step 4: Verify + chạy codex tests**

Run: `grep -c "e2e_mobile\|Mobile mechanics\|simulator/emulator absent" codex/acceptance-gate/skills/acceptance/SKILL.md codex/acceptance-gate/skills/acceptance-report/SKILL.md codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md && bash tests/codex/run-tests.sh 2>&1 | tail -2`
Expected: mỗi file ≥1; codex suite 0 failed.

- [ ] **Step 5: Commit**

```bash
git add codex/
git commit -m "feat(codex-parity): surface mobile — degradation simulator, network metrics trong acceptance-report, mobile ≠ design-lane"
```

---

### Task 8: Version bump + pin suite + sync mirrors + full sweep

**Files:**
- Modify: `.claude-plugin/plugin.json` (1.19.0 → 1.20.0 + nối câu description), `.codex-plugin/plugin.json` (version-only → 1.20.0), `codex/acceptance-gate/.codex-plugin/plugin.json` (→ 1.20.0), `feature-loop/.claude-plugin/plugin.json` (1.16.0 → 1.16.1 + nối câu), `codex/feature-loop-codex/.codex-plugin/plugin.json` (→ 1.16.1)
- Modify: `scripts/sync-plugin-packages.sh` (echo → `acceptance-gate@1.20.0 feature-loop-codex@1.16.1`, giữ `design-loop@0.3.0`)
- Modify: `tests/plugins/run-tests.sh` pin literals: P03 ×2 `1.19.0`→`1.20.0`; P04 `1.16.0`→`1.16.1`; P22: codex-acceptance `1.19.0`→`1.20.0`, codex-feature-loop `1.16.0`→`1.16.1`, root-claude `1.19.0`→`1.20.0`, feature-loop `1.16.0`→`1.16.1` (design-loop `0.3.0` GIỮ; equality-asserts GIỮ)
- Regenerate: `plugins/**` bằng script

- [ ] **Step 1: Bump + descriptions**

`.claude-plugin/plugin.json` description nối vào CUỐI chuỗi (trước nháy đóng):

```
 v1.20 makes mobile a first-class surface (native-E2E test lane, UI-layer evidence only, W5 backend-target presence check) and gives pairing rule (c) CI teeth — pre-merge BLOCKS a (cross-layer) criterion with no layer: backend-effect eval — plus a network_observed distribution readout in /acceptance-report.
```

`feature-loop/.claude-plugin/plugin.json` description nối:

```
 v1.16.1 clarifies that a mobile surface never triggers the design lane (CT1/CT2 are web-only).
```

- [ ] **Step 2: Regenerate + kiểm**

Run: `bash scripts/sync-plugin-packages.sh && git status --short plugins/ | head -20`
Expected: chỉ các file thuộc wave này đổi trong plugins/.

- [ ] **Step 3: Full sweep + DoD invariant**

Run: `for s in scripts workflows hooks codex plugins; do printf "%s: " $s; bash tests/$s/run-tests.sh 2>&1 | tail -1; done && git diff --stat main -- hooks/ lib/ scripts/recheck-evidence.js && echo INVARIANT-EMPTY`
Expected: 5 suite 0 failed (hooks PHẢI 51/51 nguyên); dòng cuối `INVARIANT-EMPTY` không kèm diff nào phía trên nó.

- [ ] **Step 4: Commit cuối**

```bash
git add .claude-plugin/plugin.json .codex-plugin/plugin.json codex/acceptance-gate/.codex-plugin/plugin.json feature-loop/.claude-plugin/plugin.json codex/feature-loop-codex/.codex-plugin/plugin.json scripts/sync-plugin-packages.sh tests/plugins/run-tests.sh plugins/
git commit -m "feat(release): acceptance-gate 1.20.0 + feature-loop 1.16.1 — cross-layer wave 2: surface mobile first-class + răng CI cặp-eval + đồng hồ đo network; sync mirrors"
```

---

## Definition of done (đối chiếu spec)

- §3.1 → Task 1 (W5) + 3 (template/mechanics) + 4 (SKILL/init/README); §3.2 → Task 2; §3.3 → Task 5 + 7; §3.4 → Task 4 (README) + 6 + 7; §6 row 14 → Task 8.
- Bất biến: `git diff --stat main -- hooks/ lib/ scripts/recheck-evidence.js` RỖNG; tests/hooks 51/51 + tests/workflows xanh NGUYÊN VẸN.
