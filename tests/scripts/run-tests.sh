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
echo "--- pre-merge provenance (bypass_used / enforcement_mode) ---"
mk_prov() { # <root> <slug> <extra frontmatter line(s)> — a PASS+signed report with provenance
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\n---\n' "$2" "$2" > "$d/contract.md"
  printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\n%s\nhuman_signoff: Manh 2026-06-20\n---\n' "$2" "$3" > "$d/evidence-report.md"
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
printf -- '---\nschema_version: 1\nfeature: feat-p8\nslug: feat-p8\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\n---\n' > "$d8/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: feat-p8\nverdict: PASS\nhuman_signoff: Manh 2026-06-20\n---\n\n## Notes\nblocked-stamp example:\nenforcement_mode: off\nbypass_used: true\n' > "$d8/evidence-report.md"
bash "$CHECK" "$P/p08" >/dev/null; check P08 0 $?
echo "P09 report with NO leading frontmatter -> fail (verdict reads empty; provenance unverifiable)"
d9="$P/p09/_acceptance/feat-p9"; mkdir -p "$d9"
printf -- '---\nschema_version: 1\nfeature: feat-p9\nslug: feat-p9\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\n---\n' > "$d9/contract.md"
printf -- 'feature_slug: feat-p9\nverdict: PASS\nhuman_signoff: Manh 2026-06-20\nenforcement_mode: off\nbypass_used: true\n' > "$d9/evidence-report.md"
bash "$CHECK" "$P/p09" >/dev/null; check P09 1 $?
echo "P10 leading-blank-then-fence frontmatter is still read -> bypass_used:true blocks"
d10="$P/p10/_acceptance/feat-p10"; mkdir -p "$d10"
printf -- '---\nschema_version: 1\nfeature: feat-p10\nslug: feat-p10\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\n---\n' > "$d10/contract.md"
printf -- '\n---\nschema_version: 1\nfeature_slug: feat-p10\nverdict: PASS\nbypass_used: true\nhuman_signoff: Manh 2026-06-20\n---\n' > "$d10/evidence-report.md"
bash "$CHECK" "$P/p10" >/dev/null; check P10 1 $?

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

nothas() { case "$3" in *"$2"*) echo "  FAIL: $1 (should NOT contain: $2)"; FAIL_COUNT=$((FAIL_COUNT+1));; *) echo "  PASS: $1";; esac; }

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

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
