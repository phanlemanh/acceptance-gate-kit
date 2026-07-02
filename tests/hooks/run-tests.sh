#!/usr/bin/env bash
# Test runner for hooks/acceptance-evidence-gate.js
# Each case: build a PreToolUse JSON payload on stdin, assert exit code.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
HOOK="$HERE/../../hooks/acceptance-evidence-gate.js"
REPO="$HERE/fixtures/repo"
REPORT_PATH="$REPO/_acceptance/login-flow/evidence-report.md"
PASS_COUNT=0; FAIL_COUNT=0

# Mark the fixture repo as a git root so the hook's repo-root-relative
# verifier resolution stops here instead of climbing to the kit's own .git.
# A plain file is enough — the hook only checks fs.existsSync('.git').
touch "$REPO/.git"

# payload <tool_name> <file_path> <content> [old_string] -> JSON on stdout
payload() {
  node -e '
    const [tool, fp, content, oldStr] = process.argv.slice(1);
    process.stdout.write(JSON.stringify({
      tool_name: tool,
      tool_input: tool === "Edit"
        ? { file_path: fp, old_string: oldStr || "x", new_string: content }
        : { file_path: fp, content }
    }));
  ' "$1" "$2" "$3" "${4:-}"
}

check() { # <name> <expected_exit> <actual_exit>
  if [ "$2" -eq "$3" ]; then
    echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1))
  else
    echo "  FAIL: $1 (expected exit $2, got $3)"; FAIL_COUNT=$((FAIL_COUNT+1))
  fi
}

PAY_REPORT="$REPO/_acceptance/payment-flow/evidence-report.md"

GOOD_EVIDENCE='---
verdict: PASS
human_signoff:
---
## Evidence
- eval: E1
  run_id: vl-20260610-001
  exit_code: 0
  verifier: scripts/verify-login.sh
  verified_at: 2026-06-10T10:00:00Z'

echo "T01 non-target file passes through"
payload Write "$REPO/src/foo.md" "verdict: PASS" | node "$HOOK" >/dev/null; check T01 0 $?

echo "T02 PASS with full evidence + existing script verifier -> allow"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE" | node "$HOOK" >/dev/null; check T02 0 $?

echo "T03 PASS missing run_id -> block"
payload Write "$REPORT_PATH" 'verdict: PASS
exit_code: 0
verifier: scripts/verify-login.sh
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK" >/dev/null 2>/dev/null; check T03 2 $?

echo "T04 PASS with manual verifier -> block"
payload Write "$REPORT_PATH" 'verdict: PASS
run_id: x-001
exit_code: 0
verifier: manual review by team
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK" >/dev/null 2>/dev/null; check T04 2 $?

echo "T05 PASS with config:executors.test.api verifier -> allow"
payload Write "$REPORT_PATH" 'verdict: PASS
run_id: x-002
exit_code: 0
verifier: config:executors.test.api
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK" >/dev/null; check T05 0 $?

echo "T06 PASS with config: key missing from config.yaml -> block"
payload Write "$REPORT_PATH" 'verdict: PASS
run_id: x-003
exit_code: 0
verifier: config:executors.test.nonexistent
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK" >/dev/null 2>/dev/null; check T06 2 $?

echo "T07 PASS with unresolved UNCERTAIN judgment -> block"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE
- eval: E9
  judged_by: judge-subagent
  verdict: UNCERTAIN
  rationale: cannot tell if empty-state matches business intent" | node "$HOOK" >/dev/null 2>/dev/null; check T07 2 $?

echo "T08 UNCERTAIN resolved by human_override -> allow"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE
- eval: E9
  judged_by: judge-subagent
  verdict: UNCERTAIN
  rationale: cannot tell if empty-state matches business intent
  human_override: Manh Phan 2026-06-10" | node "$HOOK" >/dev/null; check T08 0 $?

echo "T09 REJECT without evidence -> always allow"
payload Write "$REPORT_PATH" 'verdict: REJECT
failed_evals: [E2, E5]' | node "$HOOK" >/dev/null; check T09 0 $?

echo "T10 Edit tool with PASS missing evidence -> block"
payload Edit "$REPORT_PATH" 'verdict: PASS
nothing else here' | node "$HOOK" >/dev/null 2>/dev/null; check T10 2 $?

echo "T11 bypass env -> allow"
payload Write "$REPORT_PATH" 'verdict: PASS
nothing else' | ACCEPTANCE_GATE_BYPASS=1 node "$HOOK" >/dev/null; check T11 0 $?

echo "T12 enforcement: warn in config -> allow with warning"
WARN_REPO="$HERE/fixtures/repo-warn"
mkdir -p "$WARN_REPO/_acceptance/feat-x"
sed 's/^enforcement: strict/enforcement: warn/' \
  "$REPO/_acceptance/config.yaml" > "$WARN_REPO/_acceptance/config.yaml"
payload Write "$WARN_REPO/_acceptance/feat-x/evidence-report.md" 'verdict: PASS
nothing else' | node "$HOOK" >/dev/null 2>/dev/null; check T12 0 $?

echo "T13 full template render incl. verified_by attribution line -> allow"
payload Write "$REPORT_PATH" '---
schema_version: 1
feature_slug: login-flow
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
human_signoff:
---

# Evidence Report: login-flow

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: lf-E1-20260610
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z

- eval: E4
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: error message matches tone guideline' | node "$HOOK" >/dev/null; check T13 0 $?

echo "T14 comment-only human_override placeholder does NOT resolve UNCERTAIN -> block"
payload Write "$REPORT_PATH" '---
verdict: PASS
---
- eval: E1
  run_id: ok-1
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z
- eval: E4
  judged_by: judge-subagent
  verdict: UNCERTAIN
  rationale: unsure about empty-state copy
  human_override:   # placeholder' | node "$HOOK" >/dev/null 2>/dev/null; check T14 2 $?

echo "T15 honest REJECT with per-eval judgment PASS inside -> allow"
payload Write "$REPORT_PATH" '---
verdict: REJECT
failed_evals: [E1]
---
- eval: E1
  run_id: x-100
  exit_code: 1
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z
- eval: E4
  judged_by: judge-subagent
  verdict: PASS
  rationale: copy is fine' | node "$HOOK" >/dev/null; check T15 0 $?

echo "T16 PENDING-JUDGMENT with unresolved UNCERTAIN -> allow (report must reach Gate 2)"
payload Write "$REPORT_PATH" '---
verdict: PENDING-JUDGMENT
human_signoff:
---
- eval: E1
  verdict: PASS
  run_id: x-200
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z
- eval: E4
  judged_by: judge-subagent
  verdict: UNCERTAIN
  rationale: ambiguous empty-state' | node "$HOOK" >/dev/null; check T16 0 $?

echo "T17 T3 feature: judgment PASS without human_override -> block"
payload Write "$PAY_REPORT" '---
verdict: PASS
---
- eval: E1
  run_id: pf-1
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z
- eval: E2
  judged_by: judge-subagent
  verdict: PASS
  rationale: receipt format looks correct' | node "$HOOK" >/dev/null 2>/dev/null; check T17 2 $?

echo "T18 PASS report containing a failed eval exit_code 1 -> block"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE
- eval: E2
  run_id: vl-20260610-002
  exit_code: 1
  verifier: scripts/verify-login.sh
  verified_at: 2026-06-10T10:05:00Z" | node "$HOOK" >/dev/null 2>/dev/null; check T18 2 $?

echo "T19 surgical Edit upgrading PENDING-JUDGMENT -> PASS on evidenced file -> allow"
UPGRADE_DIR="$REPO/_acceptance/upgrade-flow"
mkdir -p "$UPGRADE_DIR"
cat > "$UPGRADE_DIR/evidence-report.md" <<'EOF'
---
schema_version: 1
feature_slug: upgrade-flow
verdict: PENDING-JUDGMENT
human_signoff:
---
- eval: E1
  run_id: uf-1
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z
- eval: E4
  judged_by: judge-subagent
  verdict: UNCERTAIN
  rationale: was unsure
  human_override: Manh Phan 2026-06-10
EOF
payload Edit "$UPGRADE_DIR/evidence-report.md" 'verdict: PASS' 'verdict: PENDING-JUDGMENT' | node "$HOOK" >/dev/null; check T19 0 $?
rm -rf "$UPGRADE_DIR"

echo "T20 legit existing script with blocklist-looking name -> allow"
payload Write "$REPORT_PATH" 'verdict: PASS
run_id: x-300
exit_code: 0
verifier: scripts/verify-human-readable.sh
verified_at: 2026-06-10T10:00:00Z' | node "$HOOK" >/dev/null; check T20 0 $?

echo "T21 Edit with \$& new_string is judged literally, not regex-expanded -> block"
DOLLAR_DIR="$REPO/_acceptance/dollar-flow"
mkdir -p "$DOLLAR_DIR"
cat > "$DOLLAR_DIR/evidence-report.md" <<'EOF'
---
verdict: PENDING-JUDGMENT
---
- eval: E1
  run_id: df-1
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z
EOF
payload Edit "$DOLLAR_DIR/evidence-report.md" '---
verdict: PASS
---
$&' '---
verdict: PENDING-JUDGMENT
---
- eval: E1
  run_id: df-1
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z' | node "$HOOK" >/dev/null 2>/dev/null; check T21 2 $?
rm -rf "$DOLLAR_DIR"

echo "T22 PASS report containing a judgment verdict FAIL -> block"
payload Write "$REPORT_PATH" "$GOOD_EVIDENCE
- eval: E5
  judged_by: judge-subagent
  verdict: FAIL
  rationale: empty-state copy contradicts AC-2" | node "$HOOK" >/dev/null 2>/dev/null; check T22 2 $?

echo "T23 T3 tier detected despite trailing comment on risk_tier line -> block judgment w/o override"
COMMENT_REPORT="$REPO/_acceptance/comment-flow/evidence-report.md"
payload Write "$COMMENT_REPORT" '---
verdict: PASS
---
- eval: E1
  run_id: cf-1
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-06-10T10:00:00Z
- eval: E2
  judged_by: judge-subagent
  verdict: PASS
  rationale: totals match ledger sample' | node "$HOOK" >/dev/null 2>/dev/null; check T23 2 $?

echo "T24 enforcement: warn with inline comment is honored -> allow"
WARN2_REPO="$HERE/fixtures/repo-warn2"
mkdir -p "$WARN2_REPO/_acceptance/feat-y"
cat > "$WARN2_REPO/_acceptance/config.yaml" <<'EOF'
schema_version: 1
enforcement: warn   # strict | warn | off
EOF
payload Write "$WARN2_REPO/_acceptance/feat-y/evidence-report.md" 'verdict: PASS
nothing else' | node "$HOOK" >/dev/null 2>/dev/null; check T24 0 $?

echo "T25 PASS with valid verified_commit SHA -> allow"
payload Write "$REPORT_PATH" '---
verdict: PASS
verified_commit: 0123456789abcdef0123456789abcdef01234567
---
- eval: E1
  run_id: vc-0001
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-07-02T10:00:00Z' | node "$HOOK" >/dev/null; check T25 0 $?

echo "T26 PASS with malformed verified_commit (not a hex SHA) -> block"
payload Write "$REPORT_PATH" '---
verdict: PASS
verified_commit: HEAD-cua-nhanh
---
- eval: E1
  run_id: vc-0002
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-07-02T10:00:00Z' | node "$HOOK" >/dev/null 2>/dev/null; check T26 2 $?

echo "T27 verified_commit-looking line in BODY only (log excerpt) -> allow"
payload Write "$REPORT_PATH" '---
verdict: PASS
---
- eval: E1
  run_id: vc-0003
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-07-02T10:00:00Z
  output: |
    log: verified_commit: not-a-sha-here' | node "$HOOK" >/dev/null; check T27 0 $?

echo ""
echo "--- contract guard (Gate 1 integrity) ---"
CON_DIR="$REPO/_acceptance/guard-flow"
CONTRACT="$CON_DIR/contract.md"

echo "C01 new contract at status draft -> allow"
payload Write "$CONTRACT" '---
schema_version: 1
feature: Guard flow
slug: guard-flow
risk_tier: T2
status: draft
approved_by:
---
# Acceptance Contract' | node "$HOOK" >/dev/null; check C01 0 $?

echo "C02 set status approved WITH approved_by -> allow"
payload Write "$CONTRACT" '---
status: approved
approved_by: Manh Phan
---' | node "$HOOK" >/dev/null; check C02 0 $?

echo "C03 set status approved with EMPTY approved_by -> block"
payload Write "$CONTRACT" '---
status: approved
approved_by:
---' | node "$HOOK" >/dev/null 2>/dev/null; check C03 2 $?

echo "C04 approved w/ empty approved_by but gate1_skipped: true -> allow (audited escape hatch)"
payload Write "$CONTRACT" '---
status: approved
approved_by:
gate1_skipped: true
---' | node "$HOOK" >/dev/null; check C04 0 $?

echo "C05 Edit draft -> implemented with empty approved_by -> block (Gate-1 jump)"
mkdir -p "$CON_DIR"
cat > "$CONTRACT" <<'EOF'
---
schema_version: 1
slug: guard-flow
risk_tier: T2
status: draft
approved_by:
---
EOF
payload Edit "$CONTRACT" 'status: implemented' 'status: draft' | node "$HOOK" >/dev/null 2>/dev/null; check C05 2 $?

echo "C06 Edit draft -> implemented with approved_by filled -> allow"
cat > "$CONTRACT" <<'EOF'
---
schema_version: 1
slug: guard-flow
risk_tier: T2
status: draft
approved_by: Manh Phan
---
EOF
payload Edit "$CONTRACT" 'status: implemented' 'status: draft' | node "$HOOK" >/dev/null; check C06 0 $?
rm -rf "$CON_DIR"

echo "C07 NEW contract born at implemented, empty approved_by -> block"
payload Write "$REPO/_acceptance/fresh-flow/contract.md" '---
status: implemented
approved_by:
---' | node "$HOOK" >/dev/null 2>/dev/null; check C07 2 $?

echo "C08 implemented -> verified (approved earlier) -> allow"
mkdir -p "$CON_DIR"
cat > "$CONTRACT" <<'EOF'
---
status: implemented
approved_by: Manh Phan
---
EOF
payload Edit "$CONTRACT" 'status: verified' 'status: implemented' | node "$HOOK" >/dev/null; check C08 0 $?
rm -rf "$CON_DIR"

echo "C09 contract violation under enforcement: warn -> allow with warning"
WARNC_REPO="$HERE/fixtures/repo-warn-c"
mkdir -p "$WARNC_REPO/_acceptance/feat-z"
cat > "$WARNC_REPO/_acceptance/config.yaml" <<'EOF'
schema_version: 1
enforcement: warn
EOF
payload Write "$WARNC_REPO/_acceptance/feat-z/contract.md" '---
status: approved
approved_by:
---' | node "$HOOK" >/dev/null 2>/dev/null; check C09 0 $?

echo ""
echo "--- run-log reconciliation (run_id must exist in machine-written log) ---"
RL_DIR="$REPO/_acceptance/rl-flow"
mkdir -p "$RL_DIR"
printf '%s\n' '{"ts":"2026-07-02T00:00:00Z","round":1,"evalId":"E1","run_id":"rl-real-001","exit_code":0,"cmd":"pnpm test"}' > "$RL_DIR/run-log.jsonl"

echo "T28 run-log exists but report run_id NOT in it -> block"
payload Write "$RL_DIR/evidence-report.md" '---
verdict: PASS
---
- eval: E1
  run_id: rl-FAKE-001
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-07-02T10:00:00Z' | node "$HOOK" >/dev/null 2>/dev/null; check T28 2 $?

echo "T29 run-log exists and report run_id matches -> allow"
payload Write "$RL_DIR/evidence-report.md" '---
verdict: PASS
---
- eval: E1
  run_id: rl-real-001
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-07-02T10:00:00Z' | node "$HOOK" >/dev/null; check T29 0 $?
rm -rf "$RL_DIR"

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
