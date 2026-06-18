#!/usr/bin/env bash
# Tests for scripts/pre-merge-check.sh + scripts/eval-coverage-lint.js using throwaway fixture repos.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
CHECK="$HERE/../../scripts/pre-merge-check.sh"
PASS_COUNT=0; FAIL_COUNT=0

check() { # <name> <expected_exit> <actual_exit>
  if [ "$2" -eq "$3" ]; then
    echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1))
  else
    echo "  FAIL: $1 (expected exit $2, got $3)"; FAIL_COUNT=$((FAIL_COUNT+1))
  fi
}

mk_feature() { # <root> <slug> <tier> <status> [verdict] [signoff]
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: %s\nsurfaces: [api]\nstatus: %s\n---\n' \
    "$2" "$2" "$3" "$4" > "$d/contract.md"
  if [ -n "${5:-}" ]; then
    printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: %s\nhuman_signoff: %s\n---\n' \
      "$2" "$5" "${6:-}" > "$d/evidence-report.md"
  fi
}

T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT

echo "S01 T2 signed-off feature -> pass"
R="$T/s01"; mk_feature "$R" feat-a T2 implemented PASS "Manh Phan 2026-06-10"
bash "$CHECK" "$R"; check S01 0 $?

echo "S02 T2 implemented, PASS but no signoff -> fail"
R="$T/s02"; mk_feature "$R" feat-b T2 implemented PASS ""
bash "$CHECK" "$R"; check S02 1 $?

echo "S03 T2 implemented, no evidence report at all -> fail"
R="$T/s03"; mk_feature "$R" feat-c T2 implemented
bash "$CHECK" "$R"; check S03 1 $?

echo "S04 draft contract (not yet implemented) -> pass (not in scope)"
R="$T/s04"; mk_feature "$R" feat-d T2 draft
bash "$CHECK" "$R"; check S04 0 $?

echo "S05 REJECT verdict -> fail (cannot merge rejected feature)"
R="$T/s05"; mk_feature "$R" feat-e T3 implemented REJECT ""
bash "$CHECK" "$R"; check S05 1 $?

echo "S06 --slug filters to one feature"
R="$T/s06"
mk_feature "$R" feat-ok T2 implemented PASS "Manh Phan 2026-06-10"
mk_feature "$R" feat-bad T2 implemented PASS ""
bash "$CHECK" "$R" --slug feat-ok; check S06 0 $?
bash "$CHECK" "$R" --slug feat-bad; check S06b 1 $?

echo "S07 no _acceptance dir -> pass (kit not adopted here)"
R="$T/s07"; mkdir -p "$R"
bash "$CHECK" "$R"; check S07 0 $?

echo "S08 config signoff.required_for [T3] exempts T2 features"
R="$T/s08"; mk_feature "$R" feat-f T2 implemented PASS ""
printf 'schema_version: 1\nsignoff:\n  required_for: [T3]\n' > "$R/_acceptance/config.yaml"
bash "$CHECK" "$R"; check S08 0 $?

echo "S09 template placeholder comment in human_signoff does NOT count as signed -> fail"
R="$T/s09"; mk_feature "$R" feat-g T2 implemented PASS '# Gate 2 — human writes "<name> <ISO date>" AFTER review'
bash "$CHECK" "$R"; check S09 1 $?

echo "S10 quoted/commented risk_tier still gated (matches hook tolerance) -> fail when unsigned"
R="$T/s10"; d="$R/_acceptance/feat-h"; mkdir -p "$d"
printf -- '---\nschema_version: 1\nfeature: feat-h\nslug: feat-h\nrisk_tier: "T2"   # standard\nsurfaces: [api]\nstatus: implemented  # done coding\n---\n' > "$d/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: feat-h\nverdict: PASS\nhuman_signoff:\n---\n' > "$d/evidence-report.md"
bash "$CHECK" "$R"; check S10 1 $?

echo "S11 required_for trailing comment does not false-scope other tiers -> pass"
R="$T/s11"; mk_feature "$R" feat-i T2 implemented PASS ""
printf 'schema_version: 1\nsignoff:\n  required_for: [T3]  # not T2 anymore\n' > "$R/_acceptance/config.yaml"
bash "$CHECK" "$R"; check S11 0 $?

echo ""
echo "--- eval-coverage-lint.js ---"
LINT="$HERE/../../scripts/eval-coverage-lint.js"

# Fixture A: threshold AC + single happy-path eval (no should-NOT-fire)
A="$T/lintA/_acceptance/feat-t1"; mkdir -p "$A"
cat > "$A/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When ≥3 opens trong 48h, Then fire hot.
## Out of scope
EOF
cat > "$A/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: script
    expected: "exit 0; fires hot"
EOF

# Fixture B: threshold AC + a should-NOT-fire eval (well covered)
B="$T/lintB/_acceptance/feat-t2"; mkdir -p "$B"
cat > "$B/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When ≥3 opens trong 48h, Then fire hot.
## Out of scope
EOF
cat > "$B/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: "fires hot tai nguong >=3"
  - id: E2
    criterion: AC-1
    expected: "KHONG fire khi 2 opens (duoi nguong)"
EOF

# Fixture C: non-threshold AC + out-of-scope bullets but zero negative evals
C="$T/lintC/_acceptance/feat-t3"; mkdir -p "$C"
cat > "$C/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user logs in, When submit valid token, Then redirect to dashboard.
## Out of scope
- Anonymous de-anonymisation.
- SMS channel.
EOF
cat > "$C/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: "redirect ok"
EOF

# Fixture D: judgment threshold AC (exempt)
D="$T/lintD/_acceptance/feat-t4"; mkdir -p "$D"
cat > "$D/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given tone, When >=3 retries, Then message appropriate. (judgment)
## Out of scope
EOF
cat > "$D/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: judgment
    expected: "tone ok"
EOF

echo "L01 threshold AC, single happy-path eval -> warn"
node "$LINT" "$T/lintA" >/dev/null; check L01 1 $?
echo "L02 threshold AC WITH should-NOT-fire eval -> clean"
node "$LINT" "$T/lintB" >/dev/null; check L02 0 $?
echo "L03 out-of-scope bullets, zero negative evals -> warn (W3)"
node "$LINT" "$T/lintC" >/dev/null; check L03 1 $?
echo "L04 judgment threshold AC is exempt -> clean"
node "$LINT" "$T/lintD" >/dev/null; check L04 0 $?
echo "L05 --files mode flags the single-eval threshold -> warn"
node "$LINT" --files "$A/contract.md" "$A/evals.yaml" >/dev/null; check L05 1 $?
echo "L06 --slug targets the clean feature -> clean"
node "$LINT" "$T/lintB" --slug feat-t2 >/dev/null; check L06 0 $?
echo "L06b --slug targets the warning feature -> warn"
node "$LINT" "$T/lintA" --slug feat-t1 >/dev/null; check L06b 1 $?
echo "L07 no _acceptance dir -> clean"
mkdir -p "$T/lintE"; node "$LINT" "$T/lintE" >/dev/null; check L07 0 $?

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
