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
  # approved_by present: the normal lifecycle records Gate 1 before implemented.
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: %s\nsurfaces: [api]\nstatus: %s\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' \
    "$2" "$2" "$3" "$4" > "$d/contract.md"
  if [ -n "${5:-}" ]; then
    local v="$1/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v"
    printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: %s\nhuman_signoff: %s\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-06-20\n' \
      "$2" "$5" "${6:-}" "$2" "$v" > "$d/evidence-report.md"
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
printf -- '---\nschema_version: 1\nfeature: feat-h\nslug: feat-h\nrisk_tier: "T2"   # standard\nsurfaces: [api]\nstatus: implemented  # done coding\napproved_by: Manh Phan\n---\n' > "$d/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: feat-h\nverdict: PASS\nhuman_signoff:\n---\n' > "$d/evidence-report.md"
bash "$CHECK" "$R"; check S10 1 $?

echo "S11 required_for trailing comment does not false-scope other tiers -> pass"
R="$T/s11"; mk_feature "$R" feat-i T2 implemented PASS ""
printf 'schema_version: 1\nsignoff:\n  required_for: [T3]  # not T2 anymore\n' > "$R/_acceptance/config.yaml"
bash "$CHECK" "$R"; check S11 0 $?

echo ""
echo "--- pre-merge provenance (bypass_used / enforcement_mode) ---"
mk_prov() { # <root> <slug> <extra frontmatter line(s)> — a PASS+signed report with provenance + valid evidence
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' "$2" "$2" > "$d/contract.md"
  local v="$1/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v"
  printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\n%s\nhuman_signoff: Manh 2026-06-20\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-06-20\n' "$2" "$3" "$2" "$v" > "$d/evidence-report.md"
}
P="$T/prov"
echo "P01 bypass_used: true (no ack) -> fail"
mk_prov "$P/p01" feat-p1 "bypass_used: true"; bash "$CHECK" "$P/p01" >/dev/null; check P01 1 $?
echo "P02 enforcement_mode: warn -> clean + WARNING (warn only warns)"
mk_prov "$P/p02" feat-p2 "enforcement_mode: warn"; out="$(bash "$CHECK" "$P/p02" 2>&1)"; check P02 0 $?
case "$out" in *WARNING*feat-p2*) echo "  PASS: P02-warn"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: P02-warn (expected WARNING line)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "P03 enforcement_mode: off -> fail"
mk_prov "$P/p03" feat-p3 "enforcement_mode: off"; bash "$CHECK" "$P/p03" >/dev/null; check P03 1 $?
echo "P04 enforcement_mode: strict + bypass_used: false -> clean"
mk_prov "$P/p04" feat-p4 "$(printf 'enforcement_mode: strict\nbypass_used: false')"; bash "$CHECK" "$P/p04" >/dev/null; check P04 0 $?
echo "P05 bypass_used: TRUE (case-insensitive) -> fail"
mk_prov "$P/p05" feat-p5 "bypass_used: TRUE"; bash "$CHECK" "$P/p05" >/dev/null; check P05 1 $?
echo "P06 no provenance fields (legacy report) -> clean (backward compat)"
mk_feature "$P/p06" feat-p6 T2 implemented PASS "Manh 2026-06-20"; bash "$CHECK" "$P/p06" >/dev/null; check P06 0 $?
echo "P07 bypass_used: true + bypass_ack -> clean (human-acknowledged release)"
mk_prov "$P/p07" feat-p7 "$(printf 'bypass_used: true\nbypass_ack: Manh 2026-06-20')"; bash "$CHECK" "$P/p07" >/dev/null; check P07 0 $?
echo "P08 frontmatter-bounded: body lines 'enforcement_mode: off' / 'bypass_used: true' do NOT false-block a clean PASS"
d8="$P/p08/_acceptance/feat-p8"; mkdir -p "$d8"
printf -- '---\nschema_version: 1\nfeature: feat-p8\nslug: feat-p8\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$d8/contract.md"
v8="$P/p08/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v8"
printf -- '---\nschema_version: 1\nfeature_slug: feat-p8\nverdict: PASS\nhuman_signoff: Manh 2026-06-20\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-p8-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-06-20\n\n## Notes\nblocked-stamp example:\nenforcement_mode: off\nbypass_used: true\n' "$v8" > "$d8/evidence-report.md"
bash "$CHECK" "$P/p08" >/dev/null; check P08 0 $?
echo "P09 report with NO leading frontmatter -> fail (verdict reads empty; provenance unverifiable)"
d9="$P/p09/_acceptance/feat-p9"; mkdir -p "$d9"
printf -- '---\nschema_version: 1\nfeature: feat-p9\nslug: feat-p9\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$d9/contract.md"
printf -- 'feature_slug: feat-p9\nverdict: PASS\nhuman_signoff: Manh 2026-06-20\nenforcement_mode: off\nbypass_used: true\n' > "$d9/evidence-report.md"
bash "$CHECK" "$P/p09" >/dev/null; check P09 1 $?
echo "P10 leading-blank-then-fence frontmatter is still read -> bypass_used:true blocks"
d10="$P/p10/_acceptance/feat-p10"; mkdir -p "$d10"
printf -- '---\nschema_version: 1\nfeature: feat-p10\nslug: feat-p10\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$d10/contract.md"
printf -- '\n---\nschema_version: 1\nfeature_slug: feat-p10\nverdict: PASS\nbypass_used: true\nhuman_signoff: Manh 2026-06-20\n---\n' > "$d10/evidence-report.md"
bash "$CHECK" "$P/p10" >/dev/null; check P10 1 $?

echo "--- evidence re-check (recheck-evidence.js, wired into pre-merge) ---"
RC="$HERE/../../scripts/recheck-evidence.js"
mk_badevidence() { # <root> <slug> <evidence body> — a signed PASS whose committed evidence is the arg
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' "$2" "$2" > "$d/contract.md"
  printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nhuman_signoff: Manh 2026-06-20\n---\n\n## Evidence\n%s\n' "$2" "$3" > "$d/evidence-report.md"
}
mk_recheck_cfg() { mkdir -p "$1/_acceptance"; printf 'schema_version: 1\nrecheck: %s\n' "$2" > "$1/_acceptance/config.yaml"; }
vr="$P/r.sh"; printf '#!/bin/sh\nexit 0\n' > "$vr"
echo "R01 recheck: strict + nonzero exit in committed evidence -> block"
mk_badevidence "$P/r01" feat-r1 "$(printf -- '- eval: E1\n  run_id: feat-r1-E1-001\n  exit_code: 1\n  verifier: %s\n  verified_at: 2026-06-20' "$vr")"
mk_recheck_cfg "$P/r01" strict; bash "$CHECK" "$P/r01" >/dev/null; check R01 1 $?
echo "R02 recheck: strict + manual/heuristic verifier -> block"
mk_badevidence "$P/r02" feat-r2 "$(printf -- '- eval: E1\n  run_id: feat-r2-E1-001\n  exit_code: 0\n  verifier: manual eyeball review\n  verified_at: 2026-06-20')"
mk_recheck_cfg "$P/r02" strict; bash "$CHECK" "$P/r02" >/dev/null; check R02 1 $?
echo "R03 recheck: strict + no evidence blocks -> block"
mk_badevidence "$P/r03" feat-r3 "(no evidence blocks)"
mk_recheck_cfg "$P/r03" strict; bash "$CHECK" "$P/r03" >/dev/null; check R03 1 $?
echo "R04 recheck CLI directly: good=0, bad=1, REJECT(not enforced)=0"
node "$RC" "$P/p04/_acceptance/feat-p4/evidence-report.md" >/dev/null 2>&1; check R04a 0 $?
node "$RC" "$P/r01/_acceptance/feat-r1/evidence-report.md" >/dev/null 2>&1; check R04b 1 $?
printf -- '---\nschema_version: 1\nverdict: REJECT\n---\n' > "$P/rej.md"; node "$RC" "$P/rej.md" >/dev/null 2>&1; check R04c 0 $?
echo "R05 default (recheck: warn) + bad evidence -> NOTEd, NOT blocked (exit 0)"
mk_badevidence "$P/r05" feat-r5 "(no evidence blocks)"
out5="$(bash "$CHECK" "$P/r05" 2>&1)"; check R05 0 $?
case "$out5" in *NOTE*feat-r5*) echo "  PASS: R05-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: R05-note (expected NOTE line)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "R06 recheck: off + bad evidence -> re-check skipped (exit 0)"
mk_badevidence "$P/r06" feat-r6 "(no evidence blocks)"
mk_recheck_cfg "$P/r06" off; bash "$CHECK" "$P/r06" >/dev/null; check R06 0 $?

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

echo "N03 quoted network_observed: \"clean\" without dump file -> NOTE still fires"
mk_prov "$P/n03" feat-n3 "enforcement_mode: strict"
printf -- '- eval: E4\n  run_id: feat-n3-E4-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n  network_observed: "clean"\n' >> "$P/n03/_acceptance/feat-n3/evidence-report.md"
outN3="$(bash "$CHECK" "$P/n03" 2>&1)"; check N03 0 $?
case "$outN3" in *NOTE*feat-n3*network_observed*) echo "  PASS: N03-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: N03-note (expected NOTE for quoted clean)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "N04 app-fail without file -> counted; negative vocab + prefix word -> never counted"
mk_prov "$P/n04" feat-n4 "enforcement_mode: strict"
printf -- '- eval: E5\n  run_id: feat-n4-E5-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n  network_observed: app-fail\n- eval: E6\n  run_id: feat-n4-E6-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n  network_observed: no-app-traffic\n- eval: E7\n  run_id: feat-n4-E7-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n  network_observed: cleanup-pending\n' >> "$P/n04/_acceptance/feat-n4/evidence-report.md"
outN4="$(bash "$CHECK" "$P/n04" 2>&1)"; check N04 0 $?
case "$outN4" in *"1 network_observed claim"*) echo "  PASS: N04-count (only app-fail counted)"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: N04-count (expected exactly 1 claim)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

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

# Fixture H: (Cross-Layer) mixed-case tag + "layer: Backend-Effect  # nonce note" (case + trailing comment) -> clean
H="$T/lintH/_acceptance/feat-x4"; mkdir -p "$H"
cat > "$H/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When submit order, Then order saved via API. (Cross-Layer)
## Out of scope
EOF
cat > "$H/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    expected: "order confirmation visible; marker KHONG optimistic"
  - id: E2
    criterion: AC-1
    executor: script
    layer: Backend-Effect  # nonce note
    expected: "exit 0; order row exists via API (KHONG mock)"
EOF

# Fixture I: threshold AC whose only negative marker lives in a TRAILING COMMENT -> comment is not evidence, W1 must warn
I="$T/lintI/_acceptance/feat-x5"; mkdir -p "$I"
cat > "$I/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When ≥3 opens trong 48h, Then fire hot.
## Out of scope
EOF
cat > "$I/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: "fires hot at threshold" # KHONG fire duoi nguong
EOF

# Fixture J: negative marker AFTER a # INSIDE quotes -> data, not comment; must stay clean
J="$T/lintJ/_acceptance/feat-x6"; mkdir -p "$J"
cat > "$J/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given user, When ≥3 opens trong 48h, Then fire hot.
## Out of scope
EOF
cat > "$J/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: "2 opens → van im lang #KHONG-fire boundary-tag"
EOF

echo "L11 mixed-case tag + layer value with trailing comment -> clean (case-insensitive + comment-strip)"
node "$LINT" "$T/lintH" >/dev/null; check L11 0 $?
echo "L12 negative marker only in trailing comment -> comment is not evidence, W1 warns"
node "$LINT" "$T/lintI" >/dev/null; check L12 1 $?
echo "L13 hash inside quoted value is data (marker after # kept) -> clean"
node "$LINT" "$T/lintJ" >/dev/null; check L13 0 $?

echo ""
echo "--- gate-card.js ---"
GCARD="$HERE/../../scripts/gate-card.js"
hasout() { case "$3" in *"$2"*) echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1));; *) echo "  FAIL: $1 (missing: $2)"; FAIL_COUNT=$((FAIL_COUNT+1));; esac; }

GC="$T/gcard/_acceptance/gfeat"; mkdir -p "$GC"
cat > "$GC/contract.md" <<'EOF'
---
schema_version: 1
feature: Hot lead alerts
slug: gfeat
risk_tier: T3
status: approved
---
## Criteria
- AC-1: Given khách mở ≥3 lần trong 48h, When chạm dày, Then sinh touch nóng.
- AC-2: Given khách mở 2 lần, When dưới ngưỡng, Then KHÔNG sinh touch.
- AC-9: Given chip cảnh báo, When mở trên mobile, Then rõ + đáng hành động. (judgment)
## Out of scope
- Realtime broadcast — hoãn.
EOF
cat > "$GC/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: script
    expected: "≥3 mở → sinh touch nóng"
  - id: E2
    criterion: AC-2
    executor: script
    expected: "2 mở → KHÔNG sinh touch (dưới ngưỡng)"
  - id: E9
    criterion: AC-9
    executor: judgment
    question: "chip rõ không?"
EOF

echo "G01-06 Gate 1 (no evidence-report -> auto gate 1)"
G1="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout G01 "Hệ thống SẼ làm" "$G1"
hasout G02 "Sẽ KHÔNG làm" "$G1"
hasout G03 "duyệt tiêu chí" "$G1"
hasout G04 "có ngưỡng/biên" "$G1"
hasout G05 "cần MẮT bạn" "$G1"
hasout G06 '"gate": 1' "$(node "$GCARD" --root "$T/gcard" --slug gfeat --extract 2>/dev/null)"

echo "G07-11 Gate 2 (implemented: status verified + evidence-report -> auto gate 2)"
sed -i.bak 's/^status: approved/status: verified/' "$GC/contract.md" && rm -f "$GC/contract.md.bak"
cat > "$GC/evidence-report.md" <<'EOF'
---
schema_version: 1
feature_slug: gfeat
verdict: PENDING-JUDGMENT
---
| Eval | Crit | Exec | Verdict |
|------|------|------|---------|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E9 | AC-9 | judgment | UNCERTAIN |

## Evidence
- eval: E1
  baseline: red
- eval: E2
  baseline: green
- eval: E9
  rationale: chip rendered, visual clarity needs human eye

## Analyst
E2 non-discriminating: passes on HEAD and baseline.

## Variance
none
EOF
G2="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout G07 "Việc chỉ mình bạn quyết" "$G2"
hasout G08 "cần bạn quyết" "$G2"
hasout G09 "non-discriminating" "$G2"
hasout G10 "phép kiểm máy đều đạt" "$G2"
hasout G11 '"gate": 2' "$(node "$GCARD" --root "$T/gcard" --slug gfeat --extract 2>/dev/null)"

echo "G12-13 --plain overlay applies"
printf '%s' '{"feature_plain":"PLAINFEATURE","decisions":[{"id":"E9","q":"PLAINQ?"}]}' > "$T/gcard/plain.json"
G2P="$(node "$GCARD" --root "$T/gcard" --slug gfeat --plain "$T/gcard/plain.json" 2>/dev/null)"
hasout G12 "PLAINFEATURE" "$G2P"
hasout G13 "PLAINQ?" "$G2P"

echo "G14 missing --slug -> exit 2"
node "$GCARD" --root "$T/gcard" >/dev/null 2>&1; check G14 2 $?

echo "GC1-GC4 Gate 1 Coverage section (CT-S 1.13)"
GCOV="$T/gcov/_acceptance/cfeat"; mkdir -p "$GCOV"
printf -- '---\nschema_version: 1\nfeature: Cov demo\nslug: cfeat\nrisk_tier: T2\nstatus: draft\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n## Out of scope\n- x — hoãn.\n' > "$GCOV/contract.md"
GCV="$(node "$GCARD" --root "$T/gcov" --slug cfeat 2>/dev/null)"
hasout GC1 "chưa có section Coverage" "$GCV"
printf -- '\n## Coverage\n- Trục Lifecycle: tạo | sửa | xóa [thước CE: bug history 6 tháng]\n- Trục Actor: chủ SME | kế toán [CE chưa kiểm chứng]\n' >> "$GCOV/contract.md"
GCV2="$(node "$GCARD" --root "$T/gcov" --slug cfeat 2>/dev/null)"
hasout GC2 "Độ phủ AC" "$GCV2"
hasout GC3 "chưa nêu được thước đo" "$GCV2"
hasout GC4 '"coverage_missing": false' "$(node "$GCARD" --root "$T/gcov" --slug cfeat --extract 2>/dev/null)"

nothas() { case "$3" in *"$2"*) echo "  FAIL: $1 (should NOT contain: $2)"; FAIL_COUNT=$((FAIL_COUNT+1));; *) echo "  PASS: $1";; esac; }

echo "GP1-8 Gate 1 gap-probe (S1#7 — phản biện context sạch)"
GPD="$T/gprobe/_acceptance/pfeat"; mkdir -p "$GPD"
printf -- '---\nschema_version: 1\nfeature: Probe demo\nslug: pfeat\nrisk_tier: T2\nstatus: draft\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n## Out of scope\n- x — hoãn.\n## Coverage\n- Trục X: a1 [thước CE: spec]\n' > "$GPD/contract.md"
GPX="$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
hasout GP1 "Chưa có phản biện context sạch" "$GPX"
printf '%s\n' '{"id":"d-20260723T010000Z-9","type":"descope","stage":"S1","at":"2026-07-23T01:00:00Z","decision":"bỏ gap-probe — đã phản biện tay trong brainstorm","impact":"tiết kiệm 1 agent · không có phản biện context sạch"}' > "$GPD/decisions.jsonl"
GPX2="$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
hasout GP2 "Đã bỏ phản biện context sạch" "$GPX2"
nothas GP2b "Chưa có phản biện context sạch" "$GPX2"
rm -f "$GPD/decisions.jsonl"
cat > "$GPD/gap-probe.md" <<'EOF'
---
slug: pfeat
at: 2026-07-23T02:00:00Z
verdict: findings
p0: 1
p1: 1
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Thiếu AC cho nhánh lỗi import | File hỏng giữa chừng → nửa dữ liệu | 1 AC + eval err-path | fixed: thêm AC-6 |
| P1 | evals | AC-3 chưa có eval đo | AC-3 pass mà không ai kiểm | eval E7 script | human-gate1 |
EOF
GPX3="$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
hasout GP3 "Phản biện context sạch" "$GPX3"
hasout GP4 "fixed: thêm AC-6" "$GPX3"
hasout GP5 '"gap_probe"' "$(node "$GCARD" --root "$T/gprobe" --slug pfeat --extract 2>/dev/null)"
printf -- '---\nslug: pfeat\nat: 2026-07-23T02:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\nKhông còn lỗ đáng kể.\n' > "$GPD/gap-probe.md"
hasout GP6 "không còn lỗ đáng kể" "$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
printf -- '---\nslug: pfeat\nat: 2026-07-23T02:00:00Z\nverdict: probe-failed\np0: 0\np1: 0\np2: 0\n---\n' > "$GPD/gap-probe.md"
hasout GP7 "không chạy được" "$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
cat > "$GPD/gap-probe.md" <<'EOF'
---
slug: pfeat
at: 2026-07-23T02:00:00Z
verdict: findings
p0: 1
p1: 1
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Cell có pipe a|b hỏng | x | y | fixed: z |
| P1 | design | Dòng tốt | x | y | deferred: ghi chú |
EOF
GPX8="$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
hasout GP8 "1 dòng finding không đọc được" "$GPX8"
hasout GP8b "Dòng tốt" "$GPX8"
# coherence: findings mà không đọc được dòng nào (heading sai/prose) → cờ, không im lặng
printf -- '---\nslug: pfeat\nat: 2026-07-23T02:00:00Z\nverdict: findings\np0: 2\np1: 0\np2: 0\n---\n\nCritic viết prose thay vì bảng.\n' > "$GPD/gap-probe.md"
hasout GP9 "không đọc được dòng finding nào" "$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
# coherence: clean mà bảng lại có finding → mâu thuẫn phải hiện
printf -- '---\nslug: pfeat\nat: 2026-07-23T02:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n| P0 | contract | Lỗ thật | x | y | human-gate1 |\n' > "$GPD/gap-probe.md"
hasout GP10 "mâu thuẫn" "$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
# verdict lạ / file rác → cờ không-đọc-được, presence không được im lặng nuốt cảnh báo
printf -- 'garbage one-liner\n' > "$GPD/gap-probe.md"
hasout GP11 "verdict lạ/thiếu" "$(node "$GCARD" --root "$T/gprobe" --slug pfeat 2>/dev/null)"
# extract structure: đếm + rows + descoped phải đúng, không chỉ có mặt key
cat > "$GPD/gap-probe.md" <<'EOF'
---
slug: pfeat
at: 2026-07-23T02:00:00Z
verdict: findings
p0: 1
p1: 1
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Thiếu AC cho nhánh lỗi import | File hỏng giữa chừng → nửa dữ liệu | 1 AC + eval err-path | fixed: thêm AC-6 |
| P1 | evals | AC-3 chưa có eval đo | AC-3 pass mà không ai kiểm | eval E7 script | human-gate1 |
EOF
node "$GCARD" --root "$T/gprobe" --slug pfeat --extract 2>/dev/null | python3 -c '
import json, sys
d = json.load(sys.stdin)["gap_probe"]
assert d["present"] is True and d["verdict"] == "findings"
assert d["p0"] == 1 and d["p1"] == 1 and d["p2"] == 0
assert len(d["rows"]) == 2 and d["rows"][0]["disposition"].startswith("fixed") and d["rows"][1]["disposition"] == "human-gate1"
assert d["parse_dropped"] == 0 and d["descoped"] is False
'; check GP12 0 $?

echo "G15 REJECT verdict -> non-approvable card (no sign-off, no all-pass claim)"
GR="$T/gcardR/_acceptance/rfeat"; mkdir -p "$GR"
printf -- '---\nschema_version: 1\nfeature: F\nslug: rfeat\nrisk_tier: T2\nstatus: implemented\n---\n## Criteria\n- AC-1: Given x, When y, Then z.\n## Out of scope\n' > "$GR/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: rfeat\nverdict: REJECT\n---\n| Eval | Crit | Exec | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | script | REJECT |\n' > "$GR/evidence-report.md"
GRX="$(node "$GCARD" --root "$T/gcardR" --slug rfeat 2>/dev/null)"
hasout G15a "trả lại code" "$GRX"
nothas G15b "Ký duyệt" "$GRX"
nothas G15c "phép kiểm máy đều đạt" "$GRX"

echo "G16 T3 judgment with verdict PASS + no override -> still a required decision"
GT="$T/gcardT/_acceptance/tfeat"; mkdir -p "$GT"
printf -- '---\nschema_version: 1\nfeature: F\nslug: tfeat\nrisk_tier: T3\nstatus: verified\n---\n## Criteria\n- AC-1: Given a, When b, Then c. (judgment)\n## Out of scope\n' > "$GT/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: tfeat\nverdict: PENDING-JUDGMENT\n---\n| Eval | Crit | Exec | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | judgment | PASS |\n\n## Evidence\n- eval: E1\n  rationale: looks fine\n' > "$GT/evidence-report.md"
hasout G16 "Việc chỉ mình bạn quyết" "$(node "$GCARD" --root "$T/gcardT" --slug tfeat 2>/dev/null)"

echo "G17 a 'human_override' / 'baseline' line INSIDE output: | must not drop the decision or inflate counts"
GO="$T/gcardO/_acceptance/ofeat"; mkdir -p "$GO"
printf -- '---\nschema_version: 1\nfeature: F\nslug: ofeat\nrisk_tier: T2\nstatus: verified\n---\n## Criteria\n- AC-1: Given a, When b, Then c. (judgment)\n## Out of scope\n' > "$GO/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: ofeat\nverdict: PENDING-JUDGMENT\n---\n| Eval | Crit | Exec | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | judgment | UNCERTAIN |\n\n## Evidence\n- eval: E1\n  rationale: needs eyes\n  output: |\n    log human_override: faker 2020-01-01\n    baseline: green\n' > "$GO/evidence-report.md"
GOX="$(node "$GCARD" --root "$T/gcardO" --slug ofeat 2>/dev/null)"
hasout G17a "Việc chỉ mình bạn quyết" "$GOX"
nothas G17b "canh hồi quy" "$GOX"

echo "G18 slug traversal -> exit 2"
node "$GCARD" --root "$T/gcard" --slug '../evil' >/dev/null 2>&1; check G18 2 $?

echo "G19 malformed --plain -> still renders (exit 0, degrades to raw card)"
printf '%s' 'this is { not json' > "$T/bad.json"
node "$GCARD" --root "$T/gcard" --slug gfeat --plain "$T/bad.json" >/dev/null 2>&1; check G19 0 $?

echo "G20-21 quoted/commented verdict normalized + evidence-complete green flag"
GQ="$T/gcardQ/_acceptance/qfeat"; mkdir -p "$GQ"
printf -- '---\nschema_version: 1\nfeature: F\nslug: qfeat\nrisk_tier: T2\nstatus: verified\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n## Out of scope\n' > "$GQ/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: qfeat\nverdict: "PASS"  # verified\n---\n| Eval | Crit | Exec | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | script | PASS |\n\n## Evidence\n- eval: E1\n  run_id: qfeat-E1-001\n  exit_code: 0\n  verifier: config:executors.script.x\n  baseline: red\n' > "$GQ/evidence-report.md"
GQX="$(node "$GCARD" --root "$T/gcardQ" --slug qfeat 2>/dev/null)"
hasout G20 "ký nhanh" "$GQX"
hasout G21 "bằng chứng máy đầy đủ" "$GQX"

echo "D01-08 decisions.jsonl on gate-card"
# Gate 1 khi CHƯA có ledger → 1 dòng info trung tính
sed -i.bak 's/^status: verified/status: approved/' "$GC/contract.md" && rm -f "$GC/contract.md.bak"
rm -f "$GC/evidence-report.md"
G1D="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout D01 "chưa ghi quyết định nào" "$G1D"
# Ledger: 2 entry thật (descope sau approach — card phải đảo descope lên đầu) + seal + 1 dòng hỏng + 1 provisional
cat > "$GC/decisions.jsonl" <<'EOF'
{"id":"d-20260706T010000Z-1","type":"approach","stage":"S1","at":"2026-07-06T01:00:00Z","decision":"Dùng polling thay webhook","impact":"đơn giản hơn · trễ tối đa 60s"}
{"id":"d-20260706T010100Z-2","type":"descope","stage":"S1","at":"2026-07-06T01:01:00Z","decision":"KHÔNG làm realtime broadcast","impact":"tiết kiệm 1 sprint · user chờ refresh"}
not-json-line
{"id":"d-20260706T020000Z-3","type":"seal","gate":1,"at":"2026-07-06T02:00:00Z"}
{"id":"d-20260706T030000Z-4","type":"fix","stage":"S4-r1","at":"2026-07-06T03:00:00Z","decision":"Fix bằng debounce 300ms","impact":"tránh double-fire · thêm 300ms trễ"}
EOF
G1L="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout D02 "Quyết định &amp; trade-off" "$G1L"
hasout D03 "KHÔNG làm realtime broadcast" "$G1L"
hasout D04 "1 dòng ledger hỏng" "$G1L"
# descope đứng TRƯỚC approach trong HTML
case "$G1L" in *"KHÔNG làm realtime broadcast"*"Dùng polling thay webhook"*) echo "  PASS: D05";  PASS_COUNT=$((PASS_COUNT+1));; *) echo "  FAIL: D05 (descope not first)"; FAIL_COUNT=$((FAIL_COUNT+1));; esac
hasout D06 '"decisions"' "$(node "$GCARD" --root "$T/gcard" --slug gfeat --extract 2>/dev/null)"
# Gate 2: provisional (sau seal) tách khối "CHƯA duyệt"
sed -i.bak 's/^status: approved/status: verified/' "$GC/contract.md" && rm -f "$GC/contract.md.bak"
cat > "$GC/evidence-report.md" <<'EOF'
---
schema_version: 1
feature_slug: gfeat
verdict: PASS
---
| Eval | Crit | Exec | Verdict |
|------|------|------|---------|
| E1 | AC-1 | script | PASS |
## Evidence
- eval: E1
  run_id: abcd1234
  exit_code: 0
  verifier: config:executors.test.api
EOF
G2L="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout D07 "CHƯA duyệt" "$G2L"
hasout D08 "Fix bằng debounce 300ms" "$G2L"

echo "D09 decisions_plain overlay is HTML-escaped (no raw injection)"
printf '%s' '{"decisions_plain":[{"id":"d-20260706T030000Z-4","p":"<img src=x> đổi sang debounce"}]}' > "$T/gcard/dplain.json"
G2E="$(node "$GCARD" --root "$T/gcard" --slug gfeat --plain "$T/gcard/dplain.json" 2>/dev/null)"
case "$G2E" in *"<img src=x>"*) echo "  FAIL: D09 (raw <img src=x> in output)"; FAIL_COUNT=$((FAIL_COUNT+1));; *"&lt;img"*) echo "  PASS: D09"; PASS_COUNT=$((PASS_COUNT+1));; *) echo "  FAIL: D09 (overlay not applied/escaped)"; FAIL_COUNT=$((FAIL_COUNT+1));; esac

echo "D10 ledger without seal -> ALL entries provisional at Gate 2 (none silently approved)"
cat > "$GC/decisions.jsonl" <<'EOF'
{"id":"d-20260706T040000Z-5","type":"approach","stage":"S1","at":"2026-07-06T04:00:00Z","decision":"Chọn SQLite thay Postgres","impact":"zero-ops · giới hạn 1 writer"}
{"id":"d-20260706T040100Z-6","type":"descope","stage":"S1","at":"2026-07-06T04:01:00Z","decision":"KHÔNG làm multi-tenant","impact":"gọn scope · sau này phải tách db"}
EOF
G2N="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout D10a "CHƯA duyệt" "$G2N"
hasout D10b "Chọn SQLite thay Postgres" "$G2N"
hasout D10c "KHÔNG làm multi-tenant" "$G2N"
case "$G2N" in *"Đã duyệt từ Gate 1"*) echo "  FAIL: D10d (approved block should be absent without seal)"; FAIL_COUNT=$((FAIL_COUNT+1));; *) echo "  PASS: D10d"; PASS_COUNT=$((PASS_COUNT+1));; esac

echo ""
echo "DSC01-03 design-static-check --require-html"
DSC="$HERE/../../design-loop/scripts/design-static-check.mjs"
mkdir -p "$T/dsc/src"; printf '.x{color:var(--color-text)}\n' > "$T/dsc/src/a.css"
node "$DSC" "$T/dsc/src" --require-html >/dev/null 2>&1; check DSC01 3 $?
ROUT="$(node "$DSC" "$T/dsc/src" --require-html 2>&1)"
hasout DSC02 "require-html" "$ROUT"
node "$DSC" "$T/dsc/src" >/dev/null 2>&1; check DSC03 0 $?   # không flag → hành vi cũ giữ nguyên

echo ""
echo "SG1-4 design-config-patch --surface-globs"
DCP="$HERE/../../design-loop/scripts/design-config-patch.mjs"
mkdir -p "$T/sg"; printf 'executors:\n  test:\n    api: "npm test"\n  script:\n    smoke_sv_design: "npm run smoke:sv-design"\n' > "$T/sg/config.yaml"
node "$DCP" --config "$T/sg/config.yaml" --surface-globs "apps/web/**,packages/ui/**" --write >/dev/null 2>&1
grep -q '^design:$' "$T/sg/config.yaml"; check SG1 0 $?
grep -q 'surface_globs: \[apps/web/\*\*, packages/ui/\*\*\]' "$T/sg/config.yaml"; check SG2 0 $?
node "$DCP" --config "$T/sg/config.yaml" --surface-globs "khac/**" --write >/dev/null 2>&1
grep -c '^design:$' "$T/sg/config.yaml" | grep -qx '1'; check SG3 0 $?   # idempotent — không nhân đôi
grep -qx '    smoke_sv_design: "npm run smoke:sv-design"' "$T/sg/config.yaml"; check SG4 0 $?   # key bảo vệ sống sót byte-y-nguyên sau 2 lần --write

echo ""
echo "--- evidence-page.js ---"
EP="$HERE/../../scripts/evidence-page.js"
EPR="$T/evp"; de="$EPR/_acceptance/epf"; mkdir -p "$de/evidence"
: > "$de/evidence/E3-step1.png"; : > "$de/evidence/E3-step2.png"
printf -- '---\nfeature: EP demo\nslug: epf\nrisk_tier: T3\n---\n## Criteria\n- AC-1: Given x, Then z.\n' > "$de/contract.md"
cat > "$de/evidence-report.md" <<'EOF'
---
schema_version: 1
feature_slug: epf
verdict: PENDING-JUDGMENT
verified_by: subagent
enforcement_mode: strict
bypass_used: false
human_signoff:
---
| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E3 | AC-1 | ui-check | PASS |
| E9 | AC-1 | judgment | UNCERTAIN |

## Evidence
- eval: E1
  run_id: epf-E1-001
  exit_code: 0
  verifier: config:executors.script.smoke
  verified_at: 2026-06-20
  output: |
    ok 1 - fires hot at >=3
    PASS (3 assertions)
- eval: E3
  run_id: epf-E3-001
  exit_code: 0
  verifier: scripts/v.sh
  verified_at: 2026-06-20
  screenshot: evidence/E3-step1.png
- eval: E9
  judged_by: panel
  verdict: UNCERTAIN
  rationale: cần mắt người.
  human_override:

## Analyst
E8 non-discriminating: green cả hai phía.

## Variance
none

## Iterations
Round 1: pass.

## Gate 2 checklist (human)
- [ ] Soi block
EOF
echo "EP01 render -> exit 0 + prints path"
EPOUT="$(node "$EP" --root "$EPR" --slug epf 2>/dev/null)"; check EP01 0 $?
H="$(cat "$EPOUT" 2>/dev/null)"
hasout EP02 "PENDING-JUDGMENT" "$H"
hasout EP03 "epf-E1-001" "$H"
hasout EP04 "ok 1 - fires hot at" "$H"
hasout EP04b "PASS (3 assertions)" "$H"
hasout EP05 'data-n="2"' "$H"
hasout EP06 "CHƯA điền" "$H"
hasout EP07 "không phân biệt" "$H"
echo "EP08 invalid slug -> exit 2"
node "$EP" --root "$EPR" --slug '../evil' >/dev/null 2>&1; check EP08 2 $?
echo "EP09 malicious screenshot src (http/traversal) is rejected — absent from page"
ds="$EPR/_acceptance/epsec"; mkdir -p "$ds/evidence"
printf -- '---\nfeature: sec\nslug: epsec\n---\n' > "$ds/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: epsec\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n| Eval | Criterion | Executor | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | ui-check | PASS |\n\n## Evidence\n- eval: E1\n  run_id: epsec-E1-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n  screenshot: http://evil.test/x.png?leak=1\n' > "$ds/evidence-report.md"
SEC="$(node "$EP" --root "$EPR" --slug epsec 2>/dev/null)"
nothas EP09 "evil.test" "$(cat "$SEC" 2>/dev/null)"

echo ""
echo "--- Gate-1 approval recorded (approved_by / gate1_skipped) ---"
echo "A01 implemented + empty approved_by + no gate1_skipped -> fail"
RA="$T/a01"; da="$RA/_acceptance/feat-a1"; mkdir -p "$da"
printf -- '---\nschema_version: 1\nfeature: feat-a1\nslug: feat-a1\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by:\n---\n' > "$da/contract.md"
va="$RA/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$va"
printf -- '---\nschema_version: 1\nfeature_slug: feat-a1\nverdict: PASS\nhuman_signoff: Manh 2026-07-02\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-a1-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-07-02\n' "$va" > "$da/evidence-report.md"
outA="$(bash "$CHECK" "$RA" 2>&1)"; check A01 1 $?
case "$outA" in *approved_by*) echo "  PASS: A01-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: A01-msg (expected approved_by violation)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "A02 gate1_skipped: true + empty approved_by -> clean + NOTE"
RB="$T/a02"; db="$RB/_acceptance/feat-a2"; mkdir -p "$db"
printf -- '---\nschema_version: 1\nfeature: feat-a2\nslug: feat-a2\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by:\ngate1_skipped: true\n---\n' > "$db/contract.md"
vb="$RB/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$vb"
printf -- '---\nschema_version: 1\nfeature_slug: feat-a2\nverdict: PASS\nhuman_signoff: Manh 2026-07-02\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-a2-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-07-02\n' "$vb" > "$db/evidence-report.md"
outB="$(bash "$CHECK" "$RB" 2>&1)"; check A02 0 $?
case "$outB" in *NOTE*gate1_skipped*) echo "  PASS: A02-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: A02-note (expected gate1_skipped NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo ""
echo "--- verified_commit staleness (V1) ---"
GIT_ID="-c user.email=t@test.local -c user.name=tester -c commit.gpgsign=false"
mk_git_repo() { # <root> — git repo: src/app.js + t1 globs config + implemented feat-vc (approved), committed
  local R="$1"; mkdir -p "$R/src" "$R/_acceptance/feat-vc"
  git -C "$R" init -q
  printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n' > "$R/_acceptance/config.yaml"
  printf 'code v1\n' > "$R/src/app.js"
  printf -- '---\nschema_version: 1\nfeature: feat-vc\nslug: feat-vc\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$R/_acceptance/feat-vc/contract.md"
  printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm impl
}
wr_report() { # <root> <verified_commit> — PASS report pinned to <verified_commit>, committed
  printf -- '---\nschema_version: 1\nfeature_slug: feat-vc\nverdict: PASS\nverified_commit: %s\nhuman_signoff: Manh 2026-07-02\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-vc-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-07-02\n' "$2" > "$1/_acceptance/feat-vc/evidence-report.md"
  git -C "$1" add -A >/dev/null && git $GIT_ID -C "$1" commit -qm evidence
}

echo "VC01 nothing changed after verify (only _acceptance/ commits) -> clean"
R="$T/vc01"; mk_git_repo "$R"; VC="$(git -C "$R" rev-parse HEAD)"; wr_report "$R" "$VC"
bash "$CHECK" "$R" >/dev/null; check VC01 0 $?

echo "VC02 code file committed AFTER verified_commit -> fail (stale evidence)"
R="$T/vc02"; mk_git_repo "$R"; VC="$(git -C "$R" rev-parse HEAD)"; wr_report "$R" "$VC"
printf 'code v2\n' > "$R/src/app.js"; git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm drift
outV="$(bash "$CHECK" "$R" 2>&1)"; check VC02 1 $?
case "$outV" in *stale*src/app.js*|*src/app.js*stale*) echo "  PASS: VC02-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC02-msg (expected stale + changed file)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "VC03 only t1_skip_globs files changed after verify (docs/**) -> clean"
R="$T/vc03"; mk_git_repo "$R"; VC="$(git -C "$R" rev-parse HEAD)"; wr_report "$R" "$VC"
mkdir -p "$R/docs"; printf 'notes\n' > "$R/docs/notes.txt"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm docs
bash "$CHECK" "$R" >/dev/null; check VC03 0 $?

echo "VC04 verified_commit unknown to this clone -> NOTE, not a violation"
R="$T/vc04"; mk_git_repo "$R"; wr_report "$R" deadbeefdeadbeefdeadbeefdeadbeefdeadbeef
outV="$(bash "$CHECK" "$R" 2>&1)"; check VC04 0 $?
case "$outV" in *NOTE*feat-vc*) echo "  PASS: VC04-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC04-note (expected NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "VC05 legacy report without verified_commit in a git repo -> NOTE, clean"
R="$T/vc05"; mk_git_repo "$R"
printf -- '---\nschema_version: 1\nfeature_slug: feat-vc\nverdict: PASS\nhuman_signoff: Manh 2026-07-02\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-vc-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-07-02\n' > "$R/_acceptance/feat-vc/evidence-report.md"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm evidence
outV="$(bash "$CHECK" "$R" 2>&1)"; check VC05 0 $?
case "$outV" in *NOTE*verified_commit*) echo "  PASS: VC05-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC05-note (expected no-verified_commit NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "VC06 UNCOMMITTED code drift after verify -> fail (working tree counts)"
R="$T/vc06"; mk_git_repo "$R"; VC="$(git -C "$R" rev-parse HEAD)"; wr_report "$R" "$VC"
printf 'code v2 uncommitted\n' > "$R/src/app.js"
bash "$CHECK" "$R" >/dev/null 2>&1; check VC06 1 $?

echo ""
echo "--- run-log reconciliation (run_id must exist in machine-written log) ---"
mk_rl() { # <root> <slug> <report run_id> — implemented+approved feature, signed PASS report with <run_id>
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' "$2" "$2" > "$d/contract.md"
  local v="$1/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v"
  printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nhuman_signoff: Manh 2026-07-02\n---\n\n## Evidence\n- eval: E1\n  run_id: %s\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-07-02\n' "$2" "$3" "$v" > "$d/evidence-report.md"
}
rl_log() { # <root> <slug> <run_id> — one machine-written log line
  printf '%s\n' "{\"ts\":\"2026-07-02T00:00:00Z\",\"round\":1,\"evalId\":\"E1\",\"run_id\":\"$3\",\"exit_code\":0,\"cmd\":\"pnpm test\"}" >> "$1/_acceptance/$2/run-log.jsonl"
}

echo "RL01 recheck strict + run_id present in log -> clean"
R="$T/rl01"; mk_rl "$R" feat-rl1 feat-rl1-E1-001; rl_log "$R" feat-rl1 feat-rl1-E1-001
mk_recheck_cfg "$R" strict; bash "$CHECK" "$R" >/dev/null; check RL01 0 $?

echo "RL02 recheck strict + run_id NOT in log -> block"
R="$T/rl02"; mk_rl "$R" feat-rl2 feat-rl2-FAKE-999; rl_log "$R" feat-rl2 feat-rl2-E1-001
mk_recheck_cfg "$R" strict
outR="$(bash "$CHECK" "$R" 2>&1)"; check RL02 1 $?
case "$outR" in *run-log*|*run_id*) echo "  PASS: RL02-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: RL02-msg (expected run-log mismatch message)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "RL03 no run-log.jsonl (older flow) -> NOTE + clean (tolerant)"
R="$T/rl03"; mk_rl "$R" feat-rl3 feat-rl3-E1-001
mk_recheck_cfg "$R" strict
outR="$(bash "$CHECK" "$R" 2>&1)"; check RL03 0 $?
case "$outR" in *NOTE*run-log*) echo "  PASS: RL03-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: RL03-note (expected no-run-log NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "RL04 default (recheck: warn) + run_id NOT in log -> NOTEd, NOT blocked"
R="$T/rl04"; mk_rl "$R" feat-rl4 feat-rl4-FAKE-999; rl_log "$R" feat-rl4 feat-rl4-E1-001
outR="$(bash "$CHECK" "$R" 2>&1)"; check RL04 0 $?
case "$outR" in *"NOTE [feat-rl4]: committed evidence fails re-check"*) echo "  PASS: RL04-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: RL04-note (expected re-check NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "RL05 malformed log line is skipped; valid line still reconciles -> clean"
R="$T/rl05"; mk_rl "$R" feat-rl5 feat-rl5-E1-001
printf '%s\n' 'this is { not json' >> "$R/_acceptance/feat-rl5/run-log.jsonl"
rl_log "$R" feat-rl5 feat-rl5-E1-001
mk_recheck_cfg "$R" strict; bash "$CHECK" "$R" >/dev/null; check RL05 0 $?

echo "RL06 recheck CLI directly: matched=0, mismatched=1"
node "$RC" "$T/rl01/_acceptance/feat-rl1/evidence-report.md" >/dev/null 2>&1; check RL06a 0 $?
node "$RC" "$T/rl02/_acceptance/feat-rl2/evidence-report.md" >/dev/null 2>&1; check RL06b 1 $?

echo ""
echo "--- human-signoff provenance (signoff.require_human_commit / agent_authors) ---"
mk_hs() { # <root> <config signoff block (may be empty)> [signoff value in FIRST commit]
  # git repo: implemented+approved feature, PASS report committed at "verify time";
  # 3rd arg non-empty = report is born ALREADY signed (the self-sign smell).
  local R="$1"; local d="$R/_acceptance/feat-hs"; mkdir -p "$d"
  { printf 'schema_version: 1\n'; [ -n "$2" ] && printf '%s\n' "$2"; } > "$R/_acceptance/config.yaml"
  git -C "$R" init -q
  printf -- '---\nschema_version: 1\nfeature: feat-hs\nslug: feat-hs\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$d/contract.md"
  printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  printf -- '---\nschema_version: 1\nfeature_slug: feat-hs\nverdict: PASS\nhuman_signoff:%s\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-hs-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-07-02\n' "${3:+ $3}" > "$d/evidence-report.md"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm verify
}
hs_sign() { # <root> [author email] — signoff-only edit, committed separately
  local R="$1"; local rep="$R/_acceptance/feat-hs/evidence-report.md"
  sed -i.bak 's/^human_signoff:$/human_signoff: Manh 2026-07-02/' "$rep" && rm -f "$rep.bak"
  git -C "$R" add -A >/dev/null && git -c user.email="${2:-manh@test.local}" -c user.name=t -c commit.gpgsign=false -C "$R" commit -qm signoff
}

echo "H01 flag OFF + signoff born with the report (same commit) -> clean (no new enforcement)"
R="$T/h01"; mk_hs "$R" "" "Manh 2026-07-02"
bash "$CHECK" "$R" >/dev/null; check H01 0 $?

echo "H02 flag ON + signoff in its own human-fields-only commit -> clean"
R="$T/h02"; mk_hs "$R" "$(printf 'signoff:\n  require_human_commit: true')"
hs_sign "$R"
bash "$CHECK" "$R" >/dev/null; check H02 0 $?

echo "H03 flag ON + signoff in the SAME commit as the report body -> fail"
R="$T/h03"; mk_hs "$R" "$(printf 'signoff:\n  require_human_commit: true')" "Manh 2026-07-02"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H03 1 $?
case "$outH" in *signoff*) echo "  PASS: H03-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: H03-msg (expected signoff violation)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "H04 flag ON + signoff only in the working tree (uncommitted) -> fail"
R="$T/h04"; mk_hs "$R" "$(printf 'signoff:\n  require_human_commit: true')"
sed -i.bak 's/^human_signoff:$/human_signoff: Manh 2026-07-02/' "$R/_acceptance/feat-hs/evidence-report.md" && rm -f "$R/_acceptance/feat-hs/evidence-report.md.bak"
bash "$CHECK" "$R" >/dev/null 2>&1; check H04 1 $?

echo "H05 flag ON + Gate-2 commit also fills human_override and upgrades verdict -> clean (human fields allowlisted)"
R="$T/h05"; d5="$R/_acceptance/feat-hs"; mkdir -p "$d5"
printf 'schema_version: 1\nsignoff:\n  require_human_commit: true\n' > "$R/_acceptance/config.yaml"
git -C "$R" init -q
printf -- '---\nschema_version: 1\nfeature: feat-hs\nslug: feat-hs\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$d5/contract.md"
printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
printf -- '---\nschema_version: 1\nfeature_slug: feat-hs\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-hs-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-07-02\n- eval: E2\n  judged_by: judge-subagent\n  verdict: UNCERTAIN\n  rationale: needs human eyes\n  human_override:\n' > "$d5/evidence-report.md"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm verify
sed -i.bak -e 's/^verdict: PENDING-JUDGMENT$/verdict: PASS/' -e 's/^human_signoff:$/human_signoff: Manh 2026-07-02/' -e 's/^  human_override:$/  human_override: Manh 2026-07-02/' "$d5/evidence-report.md" && rm -f "$d5/evidence-report.md.bak"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm gate2
bash "$CHECK" "$R" >/dev/null; check H05 0 $?

echo "H06 agent_authors blocklist matches the signoff-commit author -> fail (independent knob)"
R="$T/h06"; mk_hs "$R" "$(printf 'signoff:\n  agent_authors:\n    - "*bot*"')"
hs_sign "$R" "claude-bot@agents.local"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H06 1 $?
case "$outH" in *agent_authors*|*author*) echo "  PASS: H06-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: H06-msg (expected author violation)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo ""
echo "--- T1-escape backstop (PR base: --base / PRE_MERGE_BASE) ---"
mk_pr() { # <root> — git repo at "main" state: config with t1/t3 globs, one base src file, committed
  local R="$1"; mkdir -p "$R/_acceptance" "$R/src/billing" "$R/docs"
  printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n  t3_paths:\n    - "src/billing/**"\n' > "$R/_acceptance/config.yaml"
  printf 'base\n' > "$R/src/app.js"
  git -C "$R" init -q
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm base
}

echo "B01 PR touches t3 path, no _acceptance artifacts in PR -> fail"
R="$T/b01"; mk_pr "$R"; BASE="$(git -C "$R" rev-parse HEAD)"
printf 'charge()\n' > "$R/src/billing/charge.js"; git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
outB="$(bash "$CHECK" "$R" --base "$BASE" 2>&1)"; check B01 1 $?
case "$outB" in *T3*src/billing/charge.js*|*src/billing/charge.js*) echo "  PASS: B01-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: B01-msg (expected t3 offender listed)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "B02 PR touches t3 path AND carries _acceptance/<slug>/ artifacts -> backstop satisfied"
R="$T/b02"; mk_pr "$R"; BASE="$(git -C "$R" rev-parse HEAD)"
printf 'charge()\n' > "$R/src/billing/charge.js"
mkdir -p "$R/_acceptance/billing-fix"
printf -- '---\nschema_version: 1\nfeature: billing fix\nslug: billing-fix\nrisk_tier: T3\nsurfaces: [api]\nstatus: draft\napproved_by:\n---\n' > "$R/_acceptance/billing-fix/contract.md"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
bash "$CHECK" "$R" --base "$BASE" >/dev/null; check B02 0 $?

echo "B03 PR touches only t1_skip_globs files -> clean"
R="$T/b03"; mk_pr "$R"; BASE="$(git -C "$R" rev-parse HEAD)"
printf 'notes\n' > "$R/docs/notes.txt"; git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm docs
bash "$CHECK" "$R" --base "$BASE" >/dev/null; check B03 0 $?

echo "B04 no base provided -> backstop skipped with NOTE, clean"
R="$T/b04"; mk_pr "$R"
printf 'charge()\n' > "$R/src/billing/charge.js"; git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
outB="$(bash "$CHECK" "$R" 2>&1)"; check B04 0 $?
case "$outB" in *NOTE*backstop*) echo "  PASS: B04-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: B04-note (expected backstop-skipped NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "B05 non-T1 file (outside t1_skip_globs, not t3), no _acceptance in PR -> fail"
R="$T/b05"; mk_pr "$R"; BASE="$(git -C "$R" rev-parse HEAD)"
printf 'v2\n' > "$R/src/app.js"; git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
bash "$CHECK" "$R" --base "$BASE" >/dev/null 2>&1; check B05 1 $?

echo "B06 PRE_MERGE_BASE env works like --base"
R="$T/b06"; mk_pr "$R"; BASE="$(git -C "$R" rev-parse HEAD)"
printf 'charge()\n' > "$R/src/billing/charge.js"; git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
PRE_MERGE_BASE="$BASE" bash "$CHECK" "$R" >/dev/null 2>&1; check B06 1 $?

echo "H07 flag ON but not a git repo -> NOTE, clean (unverifiable)"
R="$T/h07"; d7="$R/_acceptance/feat-hs"; mkdir -p "$d7"
printf 'schema_version: 1\nsignoff:\n  require_human_commit: true\n' > "$R/_acceptance/config.yaml"
printf -- '---\nschema_version: 1\nfeature: feat-hs\nslug: feat-hs\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$d7/contract.md"
v7="$R/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v7"
printf -- '---\nschema_version: 1\nfeature_slug: feat-hs\nverdict: PASS\nhuman_signoff: Manh 2026-07-02\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-hs-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-07-02\n' "$v7" > "$d7/evidence-report.md"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H07 0 $?
case "$outH" in *"signoff provenance"*) echo "  PASS: H07-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: H07-note (expected unverifiable NOTE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo ""
echo "--- config.yaml 2-space lint + config-patch.mjs (single splice path) ---"
CP="$HERE/../../scripts/config-patch.mjs"

echo "CF01 config with a TAB -> fail (kit parsers are indent-based)"
R="$T/cf01"; mkdir -p "$R/_acceptance"
printf 'schema_version: 1\nexecutors:\n\ttest: "x"\n' > "$R/_acceptance/config.yaml"
bash "$CHECK" "$R" >/dev/null 2>&1; check CF01 1 $?

echo "CF02 config with odd (3-space) indent -> fail"
R="$T/cf02"; mkdir -p "$R/_acceptance"
printf 'schema_version: 1\nexecutors:\n   api: "x"\n' > "$R/_acceptance/config.yaml"
bash "$CHECK" "$R" >/dev/null 2>&1; check CF02 1 $?

echo "CP01 add feature_loop.suite_keys (--write) -> appended + .bak + resolvable"
R="$T/cp01"; mkdir -p "$R/_acceptance"
printf 'schema_version: 1\nexecutors:\n  test:\n    api: "pnpm test"\n' > "$R/_acceptance/config.yaml"
node "$CP" --config "$R/_acceptance/config.yaml" --key feature_loop.suite_keys --value "[executors.test.api]" --write >/dev/null 2>&1; check CP01 0 $?
[ -f "$R/_acceptance/config.yaml.bak" ]; check CP01-bak 0 $?
node -e '
const core = require(process.argv[1]);
const v = core.resolveConfigKey(require("fs").readFileSync(process.argv[2], "utf8"), "feature_loop.suite_keys");
process.exit(v && v.indexOf("executors.test.api") >= 0 ? 0 : 1);
' "$HERE/../../lib/evidence-core.js" "$R/_acceptance/config.yaml"; check CP01-resolve 0 $?

echo "CP02 key already exists -> abort exit 2, file unchanged"
before="$(cat "$R/_acceptance/config.yaml")"
node "$CP" --config "$R/_acceptance/config.yaml" --key feature_loop.suite_keys --value "[x]" --write >/dev/null 2>&1; check CP02 2 $?
[ "$before" = "$(cat "$R/_acceptance/config.yaml")" ]; check CP02-unchanged 0 $?

echo "CP03 dry-run by default -> exit 0, file unchanged"
R="$T/cp03"; mkdir -p "$R/_acceptance"
printf 'schema_version: 1\n' > "$R/_acceptance/config.yaml"
before="$(cat "$R/_acceptance/config.yaml")"
node "$CP" --config "$R/_acceptance/config.yaml" --key feature_loop.suite_keys --value "[a]" >/dev/null 2>&1; check CP03 0 $?
[ "$before" = "$(cat "$R/_acceptance/config.yaml")" ]; check CP03-unchanged 0 $?

echo "CP04 nested key lands INSIDE the existing parent; siblings intact"
R="$T/cp04"; mkdir -p "$R/_acceptance"
printf 'schema_version: 1\nexecutors:\n  script:\n    cli: "./s.sh"\nsignoff:\n  required_for: [T2, T3]\n' > "$R/_acceptance/config.yaml"
node "$CP" --config "$R/_acceptance/config.yaml" --key executors.script.smoke --value '"./smoke.sh"' --write >/dev/null 2>&1; check CP04 0 $?
node -e '
const core = require(process.argv[1]);
const t = require("fs").readFileSync(process.argv[2], "utf8");
const ok = core.resolveConfigKey(t, "executors.script.smoke") === "./smoke.sh"
  && core.resolveConfigKey(t, "executors.script.cli") === "./s.sh"
  && String(core.resolveConfigKey(t, "signoff.required_for")).indexOf("T2") >= 0;
process.exit(ok ? 0 : 1);
' "$HERE/../../lib/evidence-core.js" "$R/_acceptance/config.yaml"; check CP04-resolve 0 $?

echo "CP05 missing --key -> usage error exit 4"
node "$CP" --config "$R/_acceptance/config.yaml" >/dev/null 2>&1; check CP05 4 $?

echo ""
echo "--- observed NOTE (schema v1 report with screenshot evidence) ---"
echo "OBS01 v1 report with screenshot lacking observed -> pass + NOTE"
R="$T/obsnote"; mk_feature "$R" feat-obs T2 implemented PASS "Manh Phan 2026-06-10"
printf '  screenshot: evidence/E1-step1.png\n' >> "$R/_acceptance/feat-obs/evidence-report.md"
out="$(bash "$CHECK" "$R" 2>&1)"; rc=$?
check OBS01-exit 0 $rc
printf '%s' "$out" | grep -q 'observed' ; check OBS01-note 0 $?

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

# V04/V05: exit contract on garbage API responses — no network; --import preloads
# a module that replaces globalThis.fetch before the script's top-level runs.
echo "V04 API 200 with unparseable JSON body -> exit 2 (cannot-run, not NO)"
MOCK_JSON="$T/vlm-mock-badjson.mjs"
cat > "$MOCK_JSON" <<'EOF'
globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => { throw new Error('unexpected token'); }, text: async () => 'garbage' });
EOF
GEMINI_API_KEY=dummy node --import "file://$MOCK_JSON" "$VLM" "$IMG" "is a video player visible?" 2>/dev/null; check V04 2 $?

echo "V05 API non-OK whose body read throws -> exit 2"
MOCK_TEXT="$T/vlm-mock-badtext.mjs"
cat > "$MOCK_TEXT" <<'EOF'
globalThis.fetch = async () => ({ ok: false, status: 500, text: async () => { throw new Error('boom'); } });
EOF
GEMINI_API_KEY=dummy node --import "file://$MOCK_TEXT" "$VLM" "$IMG" "is a video player visible?" 2>/dev/null; check V05 2 $?

echo "V06 default model pinned to gemini-3.5-flash (URL asserted; YES -> exit 0)"
MOCK_URL="$T/vlm-mock-url.mjs"
cat > "$MOCK_URL" <<'EOF'
globalThis.fetch = async (url) => {
  if (!String(url).includes('/models/gemini-3.5-flash:generateContent')) {
    return { ok: false, status: 404, text: async () => 'wrong model url: ' + url };
  }
  return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: 'YES' }] } }] }) };
};
EOF
env -u VLM_MODEL GEMINI_API_KEY=dummy node --import "file://$MOCK_URL" "$VLM" "$IMG" "is a video player visible?" >/dev/null 2>/dev/null; check V06 0 $?

echo "U01 wf-usage.mjs unit suite (feature-loop/scripts — dedupe/label/totals/--latest)"
UOUT="$(node "$HERE/wf-usage.test.mjs" 2>&1)"; UST=$?
[ "$UST" -eq 0 ] || printf '%s\n' "$UOUT"
check U01 0 "$UST"

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
