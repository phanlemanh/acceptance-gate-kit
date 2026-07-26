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

# So chuỗi (check chỉ so exit code — dùng `-eq` nên chuỗi làm nó nổ dưới set -u).
same() { # <name> <expected> <actual>
  if [ "$2" = "$3" ]; then
    echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1))
  else
    echo "  FAIL: $1 (expected [$2], got [$3])"; FAIL_COUNT=$((FAIL_COUNT+1))
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

# PREMERGE_FIXTURE_DIR=<path> giữ fixture lại sau khi suite chạy xong — cần khi
# sinh evidence/premerge-messages.txt từ stdout THẬT (Task 6 của plan).
# BẮT BUỘC trỏ RA NGOÀI repo (vd /tmp/...): fixture dựng `_acceptance/<slug>/`,
# mà răng T1-escape của pre-merge coi mọi path khớp `*/_acceptance/*` là "PR có
# kèm gate artifact" — để trong repo là tự mở đường vòng qua chính cái răng đó.
T="${PREMERGE_FIXTURE_DIR:-$(mktemp -d)}"
[ -n "${PREMERGE_FIXTURE_DIR:-}" ] || trap 'rm -rf "$T"' EXIT
mkdir -p "$T"

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
echo "PM07 eval block mở bằng criterion (không phải id) + comment trên criterion -> vẫn paired, clean"
mk_xl "$P/pm07" feat-xl7 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)' '  - criterion: AC-1  # main flow
    id: E2
    executor: test
    layer: backend-effect
    expected: "order row exists via API"'
bash "$CHECK" "$P/pm07" >/dev/null; check PM07 0 $?
echo "PM08 cùng 1 AC tag ở 2 bullet, thiếu cặp -> đúng 1 VIOLATION (không nhân đôi)"
mk_xl "$P/pm08" feat-xl8 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)
- AC-1: Given app, When retry, Then order not duplicated. (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "e2e mobile green"'
outPM8="$(bash "$CHECK" "$P/pm08" 2>&1)"; check PM08 1 $?
n8="$(printf '%s\n' "$outPM8" | grep -c 'is tagged (cross-layer) but no eval')"
case "$n8" in 1) echo "  PASS: PM08-once"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM08-once (expected 1 violation line, got $n8)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "PM09 heading '## criteria' viết thường -> teeth vẫn quét, thiếu cặp = VIOLATION"
d9="$P/pm09/_acceptance/feat-xl9"; mkdir -p "$d9"
printf -- '---\nschema_version: 1\nfeature: feat-xl9\nslug: feat-xl9\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\napproved_at: 2026-07-25\n---\n## criteria\n- AC-1: Given app, When submit, Then saved. (cross-layer)\n## Out of scope\n' > "$d9/contract.md"
printf -- 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "green"\n' > "$d9/evals.yaml"
v9="$P/pm09/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v9"
printf -- '---\nschema_version: 1\nfeature_slug: feat-xl9\nverdict: PASS\nhuman_signoff: Manh 2026-07-25\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-xl9-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-07-25\n' "$v9" > "$d9/evidence-report.md"
bash "$CHECK" "$P/pm09" >/dev/null; check PM09 1 $?
echo "PM10 '### nhóm phụ' giữa ## Criteria, AC tag nằm SAU sub-heading -> teeth vẫn quét, thiếu cặp = VIOLATION"
mk_xl "$P/pm10" feat-xl10 '- AC-1: Given app, When view list, Then rows shown.
### Nhóm phụ — luồng đặt hàng
- AC-2: Given app, When submit order, Then order saved via API. (cross-layer)' '  - id: E1
    criterion: AC-2
    executor: test
    expected: "e2e mobile green"'
outPM10="$(bash "$CHECK" "$P/pm10" 2>&1)"; check PM10 1 $?
case "$outPM10" in *"AC-2 is tagged (cross-layer)"*) echo "  PASS: PM10-ac2"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM10-ac2 (sub-heading cắt cụt vùng quét Criteria)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "PM11 paths: chứa glob dạng key-like (kể cả TRƯỚC layer:) trong eval đã paired -> clean, không VIOLATION oan"
mk_xl "$P/pm11" feat-xl11 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    paths:
      - src/api:v2/**
      - api:v2/**
    layer: backend-effect
    expected: "order row exists via API"'
outPM11="$(bash "$CHECK" "$P/pm11" 2>&1)"; check PM11 0 $?
case "$outPM11" in *cross-layer*) echo "  FAIL: PM11-clean (glob trong paths: bị hiểu nhầm là mở eval block)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: PM11-clean"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
echo "PM12 eval block mở bằng key NGOÀI danh sách quen (surface:) -> KHÔNG được rò layer sang block sau (chống false-green)"
mk_xl "$P/pm12" feat-xl12 '- AC-1: Given app, When submit, Then saved via API.
- AC-2: Given app, When pay, Then charged via API. (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    layer: backend-effect
    expected: "ok"
  - surface: mobile
    id: E2
    criterion: AC-2
    executor: ui-check
    expected: "chip hien thi"'
outPM12="$(bash "$CHECK" "$P/pm12" 2>&1)"; check PM12 1 $?
case "$outPM12" in *"AC-2 is tagged (cross-layer)"*) echo "  PASS: PM12-noleak"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM12-noleak (layer của block trước rò sang block sau = FALSE-GREEN)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

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

# Fixture N: "mobile" chỉ xuất hiện trong criterion prose, surfaces KHÔNG có mobile -> W5 im lặng
N5="$T/lintN/_acceptance/feat-m4"; mkdir -p "$N5"
cat > "$N5/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api, ui]   # mobile maybe later
---
## Criteria
- AC-1: Given a mobile-width viewport, When user taps pay, Then confirmation shows.
## Out of scope
EOF
cat > "$N5/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0"
EOF

# Fixture O: mobile surface + dòng backend target có khoảng trắng đôi -> W5 im lặng
O5="$T/lintO/_acceptance/feat-m5"; mkdir -p "$O5"
cat > "$O5/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api, mobile]
---
## Criteria
- AC-1: Given app, When submit, Then saved.
## Out of scope
## Notes
Mobile  backend  target: local — simulator + local API.
EOF
cat > "$O5/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0"
EOF

echo "L17 'mobile' chỉ trong prose + comment trên dòng surfaces -> W5 im lặng"
node "$LINT" "$T/lintN" >/dev/null; check L17 0 $?
echo "L18 mobile surface + backend target khoảng trắng đôi -> W5 im lặng"
node "$LINT" "$T/lintO" >/dev/null; check L18 0 $?

# ─── W6 vocab lint (Đợt 2) — contract dùng alias nằm trong _Avoid_ của CONTEXT.md
# repo TIÊU THỤ. Backward-tolerant: repo không có CONTEXT.md -> W6 im lặng hoàn toàn.

mk_w6() { # <rootdir> <slug> <context.md content|-> <contract prose>
  local R="$1" S="$2" CTX="$3" PROSE="$4"
  mkdir -p "$R/_acceptance/$S"
  [ "$CTX" != "-" ] && printf '%s\n' "$CTX" > "$R/CONTEXT.md"
  { printf -- '---\nrisk_tier: T2\nstatus: approved\n---\n## Criteria\n'
    printf -- '- AC-1: %s\n' "$PROSE"
    printf -- '## Out of scope\n'; } > "$R/_acceptance/$S/contract.md"
  printf 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "exit 0"\n' \
    > "$R/_acceptance/$S/evals.yaml"
}

CTX_STD='# Shop

## Language

**Order**:
A customer request to buy items.
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment.
_Avoid_: Bill'

# Q: alias trần trong prose -> W6 nổ (RED cơ bản)
mk_w6 "$T/w6Q" feat-v1 "$CTX_STD" 'Given cart, When user confirms the Purchase, Then receipt shows.'
# R: KHÔNG có CONTEXT.md, cùng prose vi phạm -> im lặng (backward-tolerant)
mk_w6 "$T/w6R" feat-v2 "-" 'Given cart, When user confirms the Purchase, Then receipt shows.'
# S: alias trong inline code span -> không nổ
mk_w6 "$T/w6S" feat-v3 "$CTX_STD" 'Given cart, When handler `Purchase.commit()` runs, Then receipt shows.'
# U: alias là substring của từ dài hơn (Bill -> billing) -> không nổ (word boundary)
mk_w6 "$T/w6U" feat-v5 "$CTX_STD" 'Given cart, When the billing job runs, Then receipt shows.'

# V: allowlist — `_Allow_` che cụm hợp lệ NHƯNG alias trần vẫn phải nổ (RED NGOÀI allowlist).
CTX_ALLOW='# Shop

## Language

**Gate**:
A human stop.
_Avoid_: checkpoint
_Allow_: design checkpoint'
# V1: chỉ dùng cụm được allow -> im lặng
mk_w6 "$T/w6V1" feat-v6 "$CTX_ALLOW" 'Given surface, When the design checkpoint runs, Then P0 floor holds.'
# V2: cụm allow XUẤT HIỆN nhưng CÒN một alias trần chỗ khác -> vẫn phải nổ
mk_w6 "$T/w6V2" feat-v7 "$CTX_ALLOW" 'Given the design checkpoint passes, When a second checkpoint is added, Then it blocks.'

# W: alias tiếng Việt có dấu -> nổ (word boundary phải unicode-aware)
CTX_VN='# Kho

## Language

**Đơn hàng**:
Yêu cầu mua của khách.
_Avoid_: đơn mua'
# prose tránh mọi từ khoá THRESHOLD_RE ("biên", số + đơn vị…) để L26 chỉ có thể
# đỏ vì W6 — pass-vì-W1 là false green đã bắt được một lần ở vòng RED.
mk_w6 "$T/w6W" feat-v8 "$CTX_VN" 'Given giỏ hàng, When khách xác nhận đơn mua, Then hệ thống ghi nhận.'

# X: fenced code block -> không nổ
mkdir -p "$T/w6X/_acceptance/feat-v9"
printf '%s\n' "$CTX_STD" > "$T/w6X/CONTEXT.md"
cat > "$T/w6X/_acceptance/feat-v9/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
---
## Criteria
- AC-1: Given cart, When confirmed, Then receipt shows.
## Notes
```sql
SELECT * FROM Purchase WHERE id = 1;
```
## Out of scope
EOF
printf 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "exit 0"\n' > "$T/w6X/_acceptance/feat-v9/evals.yaml"

echo "L19 alias trần trong prose + có CONTEXT.md -> warn (W6)"
node "$LINT" "$T/w6Q" >/dev/null; check L19 1 $?
echo "L20 repo KHÔNG có CONTEXT.md -> W6 im lặng (backward-tolerant)"
node "$LINT" "$T/w6R" >/dev/null; check L20 0 $?
echo "L21 alias trong inline code span -> W6 im lặng"
node "$LINT" "$T/w6S" >/dev/null; check L21 0 $?
echo "L22 alias trong fenced code block -> W6 im lặng"
node "$LINT" "$T/w6X" >/dev/null; check L22 0 $?
echo "L23 alias là substring của từ dài hơn -> W6 im lặng (word boundary)"
node "$LINT" "$T/w6U" >/dev/null; check L23 0 $?
echo "L24 chỉ dùng cụm _Allow_ -> W6 im lặng"
node "$LINT" "$T/w6V1" >/dev/null; check L24 0 $?
echo "L25 có cụm _Allow_ NHƯNG còn alias trần -> vẫn warn (RED ngoài allowlist)"
node "$LINT" "$T/w6V2" >/dev/null; check L25 1 $?
echo "L26 alias tiếng Việt có dấu -> warn (unicode boundary)"
node "$LINT" "$T/w6W" >/dev/null; check L26 1 $?
# Y: alias của term này là MỘT TỪ TRONG term chuẩn khác ("tier" bị cấm cho
# Layer, nhưng "Risk tier" lại là term chuẩn) -> dùng đúng term chuẩn KHÔNG nổ,
# mà alias trần vẫn nổ. Bắt được nhờ dogfood W6 trên chính CONTEXT.md của kit.
CTX_NEST='# Kit

## Language

**Risk tier**:
Mức nghi thức của feature.
_Avoid_: level

**Layer**:
Tầng hệ thống mà evidence chạm tới.
_Avoid_: tier'
mk_w6 "$T/w6Y1" feat-v10 "$CTX_NEST" 'Given contract, When Risk tier is T3, Then the gate runs.'
mk_w6 "$T/w6Y2" feat-v11 "$CTX_NEST" 'Given contract, When the eval declares a tier, Then it pairs.'

echo "L28 alias nằm trong term chuẩn khác -> W6 im lặng khi dùng đúng term"
node "$LINT" "$T/w6Y1" >/dev/null; check L28 0 $?
echo "L29 cùng glossary, alias trần -> vẫn warn (guard không nuốt vi phạm thật)"
node "$LINT" "$T/w6Y2" >/dev/null; check L29 1 $?

echo "L27 W6 nêu đúng alias + term chuẩn trong thông điệp"
# hasout() chưa được định nghĩa ở điểm này của file — dùng grep trực tiếp.
W6OUT="$(node "$LINT" "$T/w6Q" 2>&1)"
case "$W6OUT" in *"W6"*) check L27a 0 0;; *) check L27a 0 1;; esac
case "$W6OUT" in *"Purchase"*) check L27b 0 0;; *) check L27b 0 1;; esac
case "$W6OUT" in *"Order"*) check L27c 0 0;; *) check L27c 0 1;; esac

# Fixture P: '### nhóm phụ' trong ## Criteria, AC ngưỡng nằm SAU sub-heading, thiếu should-NOT-fire -> W1 phải nổ
P5="$T/lintP/_acceptance/feat-s1"; mkdir -p "$P5"
cat > "$P5/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api]
---
## Criteria
- AC-1: Given user, When mở app, Then thấy dashboard.
### Nhóm phụ — ngưỡng cảnh báo
- AC-2: Given user, When ≥3 opens trong 48h, Then fire hot.
## Out of scope
EOF
cat > "$P5/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0"
  - id: E2
    criterion: AC-2
    executor: script
    expected: "exit 0; fires hot"
EOF

echo "L19 '### nhóm phụ' trong ## Criteria -> AC ngưỡng phía sau vẫn được quét, W1 nổ"
outL19="$(node "$LINT" "$T/lintP" 2>&1)"; check L19 1 $?
case "$outL19" in *AC-2*) echo "  PASS: L19-ac2"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L19-ac2 (sub-heading cắt cụt vùng quét Criteria)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo ""
echo "--- gate-card.js ---"
GCARD="$HERE/../../scripts/gate-card.js"
ROOT_REAL_GC="$(cd "$HERE/../.." && pwd)"
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

# '### nhóm phụ' trong ## Criteria KHÔNG được cắt cụt decision card — human duyệt Gate 1
# trên card thiếu AC là false-green ở tầng con người, nặng hơn răng CI im lặng.
GSUB="$T/gsub/_acceptance/sfeat"; mkdir -p "$GSUB"
cat > "$GSUB/contract.md" <<'EOF'
---
schema_version: 1
feature: Sub-heading card
slug: sfeat
risk_tier: T3
status: approved
---
## Criteria
- AC-1: Given user, When mở app, Then thấy dashboard.
### Nhóm phụ — luồng thanh toán
- AC-2: Given giỏ hàng, When bấm trả tiền, Then tạo đơn qua API.
- AC-3: Given thẻ hỏng, When trả tiền, Then KHÔNG tạo đơn.
## Out of scope
- Realtime broadcast — hoãn.
EOF
printf -- 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "green"\n' > "$GSUB/evals.yaml"
# Card cố ý in GWT đời thường, KHÔNG in mã AC-n — nên assert trên nội dung tiêu chí.
GSUBOUT="$(node "$GCARD" --root "$T/gsub" --slug sfeat 2>/dev/null)"
echo "GS1 AC-2 (ngay sau '### nhóm phụ') vào nhóm 'SẼ làm' của card"
hasout GS1 "tạo đơn qua API" "$GSUBOUT"
echo "GS2 AC-3 (cuối section, sau sub-heading) vào nhóm 'sẽ KHÔNG làm' của card"
hasout GS2 "KHÔNG tạo đơn" "$GSUBOUT"

# ─── TM: khối "Từ vựng chốt ở feature này" trên thẻ Cổng 1 (Đợt 2) ──────────
# Delta glossary = git diff CONTEXT.md so với base. gate-card CHỈ đụng git khi
# được truyền --glossary-base (giữ tính thuần-đọc-file cho mọi lối gọi khác).
TMID="-c user.email=t@test.local -c user.name=tester -c commit.gpgsign=false"
mk_tm() { # <root> <CONTEXT v1 | -> ; trả BASE sha qua biến TM_BASE
  local R="$1" V1="$2"; mkdir -p "$R/_acceptance/feat-tm"
  git -C "$R" init -q
  printf -- '---\nrisk_tier: T2\nstatus: draft\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n## Out of scope\n' \
    > "$R/_acceptance/feat-tm/contract.md"
  printf 'evals:\n  - id: E1\n    criterion: AC-1\n    expected: "exit 0"\n' > "$R/_acceptance/feat-tm/evals.yaml"
  [ "$V1" != "-" ] && printf '%s\n' "$V1" > "$R/CONTEXT.md"
  git -C "$R" add -A >/dev/null && git $TMID -C "$R" commit -qm base
  TM_BASE="$(git -C "$R" rev-parse HEAD)"
}

# TM-A: thêm term MỚI sau base
RA="$T/tmA"; mk_tm "$RA" '# Shop

## Language

**Order**:
A customer request.
_Avoid_: Purchase'
BASE_A="$TM_BASE"
printf '\n**Refund**:\nMoney returned after a cancelled Order.\n_Avoid_: chargeback\n' >> "$RA/CONTEXT.md"
TMA="$(node "$GCARD" --root "$RA" --slug feat-tm --glossary-base "$BASE_A" 2>/dev/null)"

# TM-B: repo KHÔNG có CONTEXT.md
RB2="$T/tmB"; mk_tm "$RB2" "-"; BASE_B="$TM_BASE"
TMB="$(node "$GCARD" --root "$RB2" --slug feat-tm --glossary-base "$BASE_B" 2>/dev/null)"

# TM-C: có CONTEXT.md nhưng KHÔNG truyền --glossary-base
TMC="$(node "$GCARD" --root "$RA" --slug feat-tm 2>/dev/null)"

# TM-D: có base nhưng CONTEXT.md không đổi
RD="$T/tmD"; mk_tm "$RD" '# Shop

## Language

**Order**:
A customer request.
_Avoid_: Purchase'
TMD="$(node "$GCARD" --root "$RD" --slug feat-tm --glossary-base "$TM_BASE" 2>/dev/null)"

# TM-E: SỬA _Avoid_ của term đã có (không thêm heading mới) -> vẫn phải nêu term
RE2="$T/tmE"; mk_tm "$RE2" '# Shop

## Language

**Order**:
A customer request.
_Avoid_: Purchase'
BASE_E="$TM_BASE"
printf '# Shop\n\n## Language\n\n**Order**:\nA customer request.\n_Avoid_: Purchase, transaction\n' > "$RE2/CONTEXT.md"
TME="$(node "$GCARD" --root "$RE2" --slug feat-tm --glossary-base "$BASE_E" 2>/dev/null)"

# GPP: hook và gate-card phải khớp CÙNG luật descope (contract gap-probe AC-4).
# Lệch nhau thì cùng một entry cho hook cho qua còn thẻ vẫn phất cờ vàng.
GPP="$T/gpparity"; mkdir -p "$GPP/_acceptance/pf"
printf -- '---\nschema_version: 1\nfeature: F\nslug: pf\nrisk_tier: T3\nstatus: draft\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n## Out of scope\n' > "$GPP/_acceptance/pf/contract.md"
printf 'evals:\n  - id: E1\n    criterion: AC-1\n    expected: "exit 0"\n' > "$GPP/_acceptance/pf/evals.yaml"
printf '%s\n' '{"id":"d-7","type":"descope","decision":"  Bỏ gap-probe — thụt đầu + viết hoa"}' > "$GPP/_acceptance/pf/decisions.jsonl"
GPPOUT="$(node "$GCARD" --root "$GPP" --slug pf 2>/dev/null)"
echo "GPP1 descope thụt-đầu+viết-hoa -> thẻ nhận là ĐÃ BỎ có chủ đích, không phất cờ 'Chưa có phản biện'"
nothas GPP1 "Chưa có phản biện context sạch (gap-probe)" "$GPPOUT"
# Luật khớp descope phải KHOAN DUNG khoảng trắng đầu: decisions.jsonl do người
# hoặc agent viết tay, "  Bỏ gap-probe — ..." là hợp lệ.
# Bản cũ ghim regex VÀO gate-card.js bằng grep -F. Đó chính là hình dạng mà
# AC-19 (contract v3-r2) cấm: nó biến "luật sống ở đâu" thành một bất biến của
# test, nên mọi nỗ lực gộp hai bản cài đặt đều bị chính test này chặn. Nay răng
# đúng chỗ hơn: luật sống ở lib (GPM20f đo hành vi), gate-card PHẢI đi qua lib
# (P38 đo cấu trúc), và ở đây chỉ giữ ca đầu-cuối trên chính thẻ.
echo "GPP2 the khoan dung leading-space qua CHINH lib (khong ghim regex vao gate-card)"
same GPP2 "descoped|d-9" "$(node -e '
  const L = require(process.argv[1]);
  const r = L.classify({ probeText: "", ledgerText: process.argv[2] });
  process.stdout.write(r.outcome + "|" + (r.id || ""));
' "$ROOT_REAL_GC/lib/gap-probe.js" '{"id":"d-9","type":"descope","decision":"  Bỏ gap-probe — x"}')"

echo "TM1 term MỚI sau base -> khối Từ vựng nêu tên term"
hasout TM1 "Refund" "$TMA"
echo "TM2 repo không có CONTEXT.md -> KHÔNG có khối Từ vựng, không cờ"
nothas TM2 "Từ vựng" "$TMB"
echo "TM3 có CONTEXT.md nhưng thiếu --glossary-base -> cờ info, không khối"
hasout TM3 "glossary-base" "$TMC"
echo "TM4 có base, CONTEXT.md không đổi -> nói rõ không thêm/sửa term"
hasout TM4 "không thêm" "$TMD"
echo "TM5 sửa _Avoid_ của term cũ -> vẫn nêu term (không chỉ bắt heading mới)"
hasout TM5 "Order" "$TME"
echo "TM6 --extract có glossary_delta"
TMX="$(node "$GCARD" --root "$RA" --slug feat-tm --glossary-base "$BASE_A" --extract 2>/dev/null)"
hasout TM6 "glossary_delta" "$TMX"

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

echo "EP10 '### nhóm phụ' trong ## Criteria -> text của AC phía sau vẫn lên evidence page"
dsub="$EPR/_acceptance/epsub"; mkdir -p "$dsub"
printf -- '---\nfeature: EP sub\nslug: epsub\nrisk_tier: T3\n---\n## Criteria\n- AC-1: Given x, Then z.\n### Nhóm phụ — thanh toán\n- AC-2: Given gio hang, Then charged via API.\n' > "$dsub/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: epsub\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n| Eval | Criterion | Executor | Verdict |\n|--|--|--|--|\n| E1 | AC-2 | script | PASS |\n\n## Evidence\n- eval: E1\n  run_id: epsub-E1-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n' > "$dsub/evidence-report.md"
SUBP="$(node "$EP" --root "$EPR" --slug epsub 2>/dev/null)"
hasout EP10 "charged via API" "$(cat "$SUBP" 2>/dev/null)"

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

echo ""
echo "--- resolve-plugin.mjs (bỏ glob-vào-cache: chọn theo semver, không theo ls) ---"
RESOLVE="$HERE/../../feature-loop/scripts/resolve-plugin.mjs"
RPC="$T/rpcache"   # <cache-root>/<marketplace>/<plugin>/<version>/
mk_ver() { # <version> [--no-require]
  local d="$RPC/mkt/acceptance-gate/$1"; mkdir -p "$d/skills/acceptance/references"
  [ "${2:-}" = "--no-require" ] || printf 'personas\n' > "$d/skills/acceptance/references/judge-personas.md"
}
# Đúng cái bẫy đã chứng minh: ls sắp xếp theo chữ -> "1.9.2" đứng CUỐI.
mk_ver 1.9.2; mk_ver 1.11.2; mk_ver 1.18.0; mk_ver 1.20.1
RP_OUT="$(node "$RESOLVE" --plugin acceptance-gate --cache-root "$RPC" \
  --require skills/acceptance/references/judge-personas.md 2>&1)"; RP_ST=$?
echo "RP01 chọn semver cao nhất (1.20.1), KHÔNG phải bản cuối theo thứ tự chữ (1.9.2)"
check RP01 0 "$RP_ST"
case "$RP_OUT" in *"/1.20.1"*) check RP01b 0 0;; *) echo "     got: $RP_OUT"; check RP01b 0 1;; esac
case "$RP_OUT" in *"/1.9.2"*) echo "     REGRESSION: chọn nhầm 1.9.2"; check RP01c 0 1;; *) check RP01c 0 0;; esac

# Bản mới nhất CÀI HỎNG (thiếu file --require) -> phải bỏ qua, lùi về 1.18.0,
# tuyệt đối không trả về một thư mục rỗng rồi để agent chết ở bước sau.
RPC2="$T/rpcache2"; RPC_SAVE="$RPC"; RPC="$RPC2"
mk_ver 1.18.0; mk_ver 1.20.1 --no-require; RPC="$RPC_SAVE"
RP2="$(node "$RESOLVE" --plugin acceptance-gate --cache-root "$RPC2" \
  --require skills/acceptance/references/judge-personas.md 2>&1)"
echo "RP02 bản cao nhất thiếu file bắt buộc -> bỏ qua, lùi bản hợp lệ"
case "$RP2" in *"/1.18.0"*) check RP02 0 0;; *) echo "     got: $RP2"; check RP02 0 1;; esac

echo "RP03 không tìm thấy gì -> exit 1 + thông điệp nêu chỗ đã tìm và cách cài"
RP3="$(node "$RESOLVE" --plugin khong-ton-tai --cache-root "$RPC" --require x.md 2>&1)"; RP3_ST=$?
check RP03 1 "$RP3_ST"
case "$RP3" in *"claude plugin install"*) check RP03b 0 0;; *) check RP03b 0 1;; esac

echo "RP04 --root <path> bỏ qua tìm kiếm (dùng cho test/bản vendor)"
RP4="$(node "$RESOLVE" --plugin acceptance-gate --root "$RPC/mkt/acceptance-gate/1.11.2" \
  --require skills/acceptance/references/judge-personas.md 2>&1)"; RP4_ST=$?
check RP04 0 "$RP4_ST"
case "$RP4" in *"/1.11.2"*) check RP04b 0 0;; *) check RP04b 0 1;; esac

echo "RP05 --root trỏ chỗ thiếu file bắt buộc -> exit 1 (không tin lời khai)"
node "$RESOLVE" --plugin acceptance-gate --root "$RPC/mkt" --require skills/acceptance/references/judge-personas.md >/dev/null 2>&1
check RP05 1 $?

echo "U01 wf-usage.mjs unit suite (feature-loop/scripts — dedupe/label/totals/--latest)"
UOUT="$(node "$HERE/wf-usage.test.mjs" 2>&1)"; UST=$?
[ "$UST" -eq 0 ] || printf '%s\n' "$UOUT"
check U01 0 "$UST"

# ─── Gap-probe presence at the merge boundary (GPM*) ─────────────────────────
ROOT_REAL="$(cd "$HERE/../.." && pwd)"
# Gọi CHÍNH hàm trong pre-merge-check.sh, không chép regex sang test — chép là
# test và code lệch nhau lúc nào không biết.
GPR="$T/gp"
mk_gp_repo() { # <case> — repo git tối thiểu; trả BASE sha qua GP_BASE
  local R="$GPR/$1"; rm -rf "$R"; mkdir -p "$R/_acceptance" "$R/src"
  git init -q "$R"
  printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n  t3_paths:\n    - "src/**"\n' > "$R/_acceptance/config.yaml"
  printf 'v1\n' > "$R/src/app.js"
  git -C "$R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$R" commit -qm base
  GP_BASE="$(git -C "$R" rev-parse HEAD)"
}
# gp_feature <root> <slug> <tier> <status>
# Feature SẠCH MỌI MẶT KHÁC: có evidence-report PASS + chữ ký, để violation duy
# nhất có thể nổ là luật gap-probe. Fixture thiếu evidence sẽ đỏ vì lý do khác
# và mọi assert exit-code thành xanh-rỗng (đã dẫm ở vòng RED đầu).
gp_feature() {
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: %s\nsurfaces: [api]\nstatus: %s\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' \
    "$2" "$2" "$3" "$4" > "$d/contract.md"
  case "$4" in
    implemented|verified|signed-off)
      local v="$1/verify-$2.sh"; printf '#!/bin/sh\nexit 0\n' > "$v"
      printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nhuman_signoff: Manh Phan 2026-06-20\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-06-20\n' \
        "$2" "$2" "$v" > "$d/evidence-report.md" ;;
  esac
}
gp_commit() { git -C "$1" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$1" commit -qm change; }

echo "GPM11 gap_probe: bien the hop le nhan dung, sai chinh ta -> canh bao cau hinh"
mk_gp_repo gp11a; R="$GPR/gp11a"; gp_feature "$R" feat-q T3 implemented
printf 'gap_probe: "required"\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GPM11a 1 $?
mk_gp_repo gp11b; R="$GPR/gp11b"; gp_feature "$R" feat-q T3 implemented
printf 'gap_probe: Required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GPM11b 1 $?
mk_gp_repo gp11c; R="$GPR/gp11c"; gp_feature "$R" feat-q T3 implemented
printf 'gap_probe: requird\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
# Fixture này có feature T3 implemented KHÔNG evidence-report -> BẮT BUỘC phải
# còn một VIOLATION nữa sau khi cảnh báo config in ra. Assert exit code + sự
# hiện diện của violation phía sau là cách duy nhất phân biệt "cảnh báo rồi chạy
# tiếp" với "cảnh báo rồi chết giữa chừng, exit 0". Bản đầu chỉ hasout stdout
# nên xanh trong khi cổng đã chết hoàn toàn.
GP11C="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; GPM11C_ST=$?
hasout GPM11c "gap_probe" "$GP11C"
hasout GPM11c2 "requird" "$GP11C"
check GPM11c3 1 "$GPM11C_ST"
# Bằng chứng script CHẠY ĐẾN HẾT chứ không chết giữa chừng: dòng tổng kết cuối
# cùng phải có mặt. Đây mới là thứ phân biệt "cảnh báo rồi đi tiếp" với "cảnh
# báo rồi abort" — fixture này sạch mọi mặt khác nên không có violation nào khác
# để mà tìm.
hasout GPM11c4 "pre-merge-check:" "$GP11C"
nothas GPM11c5 "unbound variable" "$GP11C"
# AC-11 (v3-r2): "không âm thầm" CHƯA đủ — cấm cả rơi về advisory có tiếng động.
# Fixture này có feat-q T3 implemented thiếu gap-probe: nếu script hạ về advisory
# thì sẽ in đúng câu NOTE advisory. Không được có câu đó.
nothas GPM11c6 "advisory, không chặn merge" "$GP11C"

echo "GPM1 required + thieu ca file lan descope + slug TRONG diff -> VIOLATION"
mk_gp_repo gpm1; R="$GPR/gpm1"; gp_feature "$R" feat-b T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM1="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; GPM1ST=$?
check GPM1 1 "$GPM1ST"
hasout GPM1msg "gap-probe" "$GPM1"
hasout GPM1slug "feat-b" "$GPM1"

echo "GPM2 advisory -> NOTE, khong chan"
mk_gp_repo gpm2; R="$GPR/gpm2"; gp_feature "$R" feat-b T3 implemented
printf 'gap_probe: advisory\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM2="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM2 0 $?
hasout GPM2note "gap-probe" "$GPM2"
nothas GPM2noviol "VIOLATION [feat-b]" "$GPM2"

echo "GPM2b khoa gap_probe VANG -> y het advisory"
mk_gp_repo gpm2b; R="$GPR/gpm2b"; gp_feature "$R" feat-b T3 implemented; gp_commit "$R"
GPM2B="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM2b 0 $?
hasout GPM2bnote "gap-probe" "$GPM2B"

echo "GPM3 off -> khong in gi ve gap-probe"
mk_gp_repo gpm3; R="$GPR/gpm3"; gp_feature "$R" feat-b T3 implemented
printf 'gap_probe: off\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM3="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM3 0 $?
# AC-3 cũ đọc theo Ý: LUẬT im lặng (không NOTE/VIOLATION/marker). Dòng sổ
# luật-đã-chạy (`declared-off gap-probe` + dòng tổng kết) là kế toán của
# premerge-rules-ledger AC-3 — bảng đã duyệt Cổng 1 bắt buộc nó HIỆN cả khi
# off, nên lọc riêng ra khỏi assertion im-lặng (ledger d-…-fix ghi vết).
GPM3F="$(printf '%s\n' "$GPM3" | grep -vE '^(ran|declared-off) |^pre-merge-check: rules ')"
nothas GPM3silent "gap-probe" "$GPM3F"
same GPM3ledger 1 "$(printf '%s\n' "$GPM3" | grep -cx 'declared-off gap-probe')"

echo "GPM4 contract T1 + required -> khong xet (thua huong loc REQUIRED_FOR)"
mk_gp_repo gpm4; R="$GPR/gpm4"; gp_feature "$R" feat-t1 T1 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM4="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM4 0 $?
nothas GPM4silent "phản biện" "$GPM4"

echo "GPM10 status draft va approved + required -> khong in gi"
mk_gp_repo gpm10; R="$GPR/gpm10"
gp_feature "$R" feat-d T3 draft; gp_feature "$R" feat-e T3 approved
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM10="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM10 0 $?
nothas GPM10a "phản biện" "$GPM10"
# Cùng lớp với GPM3silent: lọc dòng sổ kế toán (ledger ghi `ran gap-probe` —
# luật vũ trang, scope rỗng vì draft/approved bị lọc) khỏi assertion im-lặng.
GPM10F="$(printf '%s\n' "$GPM10" | grep -vE '^(ran|declared-off) |^pre-merge-check: rules ')"
nothas GPM10b "gap-probe" "$GPM10F"

echo "GPM13 slug NGOAI diff -> khong xet; khong --base -> bo qua kem NOTE"
mk_gp_repo gpm13; R="$GPR/gpm13"; gp_feature "$R" feat-old T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM_B2="$(git -C "$R" rev-parse HEAD)"
# PR phải mang MỘT thay đổi dưới _acceptance/ để thoả răng T1-escape (nếu không
# nó nổ VIOLATION riêng và case này đỏ sai lý do). Slug mới để T1 nên chính nó
# được vòng lọc tier bỏ qua — thứ duy nhất còn có thể nói là luật gap-probe.
printf 'v2\n' >> "$R/src/app.js"; gp_feature "$R" feat-new T1 implemented; gp_commit "$R"
GPM13="$(bash "$CHECK" "$R" --base "$GPM_B2" 2>&1)"; check GPM13 0 $?
nothas GPM13a "phản biện" "$GPM13"
# Bản cũ assert exit 0 ở đây — tức GHIM chính vế fail-open mà gap-probe v3 (P0-2)
# lật: "không có --base" là một trong bốn lý do luật không cưỡng chế được, và ở
# mode required thì không cưỡng chế được = không cho merge. NOTE rồi exit 0 là
# kênh chết đã giết contract v1 (ledger d-114).
GPM13B="$(bash "$CHECK" "$R" 2>&1)"; check GPM13b 1 $?
hasout GPM13b2 "GAP-PROBE: NOT ENFORCED reason=" "$GPM13B"
hasout GPM13c "gap-probe" "$GPM13B"

echo "GPM5 verdict clean va findings -> im lang o mode required"
for v in clean findings; do
  mk_gp_repo "gpm5$v"; R="$GPR/gpm5$v"; gp_feature "$R" feat-c T3 implemented
  printf -- '---\nslug: feat-c\nat: 2026-07-26T00:00:00Z\nverdict: %s\n---\n' "$v" > "$R/_acceptance/feat-c/gap-probe.md"
  printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
  OUT="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check "GPM5-$v" 0 $?
  nothas "GPM5-$v-silent" "phản biện" "$OUT"
done

echo "GPM5c fixture SAO CHEP nguyen van dau ra that cua S1#7 -> im lang"
mk_gp_repo gpm5c; R="$GPR/gpm5c"; gp_feature "$R" feat-c T3 implemented
head -8 "$ROOT_REAL/_acceptance/gap-probe-presence-hook/gap-probe.md" > "$R/_acceptance/feat-c/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM5C="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM5c 0 $?
nothas GPM5c-silent "phản biện" "$GPM5C"

echo "GPM6 file rong / verdict rac / verdict CHI o than bai -> coi nhu THIEU"
mk_gp_repo gpm6a; R="$GPR/gpm6a"; gp_feature "$R" feat-c T3 implemented
: > "$R/_acceptance/feat-c/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GPM6a 1 $?

mk_gp_repo gpm6b; R="$GPR/gpm6b"; gp_feature "$R" feat-c T3 implemented
printf -- '---\nslug: feat-c\nverdict: rac\n---\n' > "$R/_acceptance/feat-c/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GPM6b 1 $?

mk_gp_repo gpm6c; R="$GPR/gpm6c"; gp_feature "$R" feat-c T3 implemented
printf '# Bao cao\n\nBang finding trich: verdict: clean\n' > "$R/_acceptance/feat-c/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GPM6c 1 $?

echo "GPM7 entry descope -> khong violation, NOTE neu id"
mk_gp_repo gpm7; R="$GPR/gpm7"; gp_feature "$R" feat-f T3 implemented
printf '%s\n' '{"id":"d-77","type":"descope","decision":"bỏ gap-probe — quá nhỏ"}' > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM7="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM7 0 $?
hasout GPM7id "d-77" "$GPM7"

echo "GPM7b descope thut dau + viet hoa -> van khop (cung luat gate-card.js)"
mk_gp_repo gpm7b; R="$GPR/gpm7b"; gp_feature "$R" feat-f T3 implemented
printf '%s\n' '{"id":"d-78","type":"descope","decision":"  Bỏ gap-probe — viết hoa"}' > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM7B="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM7b 0 $?
hasout GPM7bid "d-78" "$GPM7B"

echo "GPM7c dong JSON hong + entry hop le -> van khop (parse khoan dung)"
mk_gp_repo gpm7c; R="$GPR/gpm7c"; gp_feature "$R" feat-f T3 implemented
printf '%s\n' 'khong-phai-json' '{"id":"d-79","type":"descope","decision":"bỏ gap-probe — ok"}' > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GPM7c 0 $?

echo "GPM7d entry descope KHONG phai gap-probe -> KHONG duoc coi la van thoat"
mk_gp_repo gpm7d; R="$GPR/gpm7d"; gp_feature "$R" feat-f T3 implemented
printf '%s\n' '{"id":"d-80","type":"descope","decision":"bỏ mockup — không có UI"}' > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GPM7d 1 $?

echo "GPM8 verdict probe-failed -> NOTE, khong violation"
mk_gp_repo gpm8; R="$GPR/gpm8"; gp_feature "$R" feat-g T3 implemented
printf -- '---\nslug: feat-g\nverdict: probe-failed\n---\n' > "$R/_acceptance/feat-g/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GPM8="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GPM8 0 $?
hasout GPM8note "probe-failed" "$GPM8"

# E12 GÁC CỔNG cho judge E9: judge chỉ chấm được nếu gói bằng chứng có ĐỦ 4 dạng
# thông điệp. Thiếu gác này thì file chỉ có VIOLATION là judge vẫn PASS trong khi
# 3 NOTE kia trống nghĩa — đúng lỗi d-109, lần đó có mắt người bắt, lần này không.
# ── GPM12: evidence cho judge E9 phải được SINH LẠI rồi diff byte-đối-byte ──
# Bản cũ chỉ đếm 4 nhãn — đo sự ĐẦY ĐỦ, không đo tính XÁC THỰC (gap-probe v3
# P1-5). Thông điệp trong script đổi mà file evidence không đổi thì nó vẫn xanh,
# và judge E9 chấm một bản chụp lỗi thời rồi cho PASS.
echo "GPM12 sinh lai premerge-messages.txt tu 4 fixture roi diff byte-doi-byte"
GPMSG="$ROOT_REAL/_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt"
gp_msg_run() { # <nhãn fixture> <mode> <trạng thái: missing|descoped|probe-failed>
  mk_gp_repo "msg$1"; local R="$GPR/msg$1"
  gp_feature "$R" "$1" T3 implemented
  printf 'gap_probe: %s\n' "$2" >> "$R/_acceptance/config.yaml"
  case "$3" in
    descoped)     printf '%s\n' '{"id":"d-77","type":"descope","decision":"bỏ gap-probe — nhỏ"}' > "$R/_acceptance/$1/decisions.jsonl" ;;
    probe-failed) printf -- '---\nslug: %s\nverdict: probe-failed\n---\n' "$1" > "$R/_acceptance/$1/gap-probe.md" ;;
  esac
  gp_commit "$R"
  printf '\n── fixture %s ──\n' "$1"
  # Lọc theo NHÃN dòng, không theo nội dung: giữ trọn câu để diff thấy được mọi
  # thay đổi chữ nghĩa. Loại dòng tổng kết vì nó chứa số violation của fixture.
  # Lọc theo CHỦ ĐỀ (dòng nói về gap-probe), không theo nhãn: giữ TRỌN CÂU nên
  # mọi đổi chữ vẫn hiện ra ở diff. Loại các NOTE của luật khác (verified_commit,
  # run-log) vì chúng là nhiễu với judge E9 và trôi theo feature không liên quan.
  bash "$CHECK" "$R" --base "$GP_BASE" 2>&1 | grep -E '^(VIOLATION|NOTE|GAP-PROBE)' | grep -iE 'gap-probe|phản biện'
}
GP12NEW="$(mktemp)"
{
  printf '%s\n' '# Thông điệp luật gap-probe ở merge boundary — SINH bởi tests/scripts/run-tests.sh (GPM12).'
  printf '%s\n' '# KHÔNG sửa tay: suite sinh lại file này mỗi lần chạy và diff byte-đối-byte.'
  gp_msg_run feat-b required missing
  gp_msg_run feat-c advisory missing
  gp_msg_run feat-f required descoped
  gp_msg_run feat-g required probe-failed
} > "$GP12NEW" 2>&1
if [ "${GPM12_WRITE:-0}" = "1" ]; then
  cp "$GP12NEW" "$GPMSG"; echo "  (GPM12_WRITE=1 — đã ghi lại $GPMSG)"
fi
if diff -u "$GPMSG" "$GP12NEW" > "$T/gpm12.diff" 2>&1; then
  check GPM12 0 0
else
  echo "     evidence LỆCH với thông điệp hiện tại:"; head -20 "$T/gpm12.diff" | sed 's/^/     /'
  check GPM12 0 1
fi
# 4 nhãn vẫn phải đủ — diff bắt trôi chữ, cái này bắt trôi PHẠM VI (mất hẳn một
# nhánh thì diff vẫn "khớp" nếu evidence cũng được sinh lại thiếu nhánh đó).
GP12M="$(cat "$GP12NEW")"
hasout GPM12a "VIOLATION" "$GP12M"
hasout GPM12b "advisory, không chặn merge" "$GP12M"
hasout GPM12c "theo ledger" "$GP12M"
hasout GPM12d "probe-failed" "$GP12M"

# Ba case cho HẠ TẦNG diff-scope. Cả 3 lỗi HIGH của v2 đều nằm ở đây chứ không
# ở luật gap-probe: hạ tầng fail-open trong một script cưỡng chế nguy hiểm hơn
# chính luật nó chở. Luật bất di bất dịch: KHÔNG BAO GIỜ được im lặng coi phạm
# vi là "đã biết và rỗng".
echo "GPM14 _acceptance/ KHONG o git root -> luat VAN chay (khong tat im lang)"
R="$GPR/gpm14"; rm -rf "$R"; mkdir -p "$R/pkg/_acceptance/feat-x" "$R/pkg/src"
git init -q "$R"
printf 'schema_version: 1\ngap_probe: required\nrisk_tiers:\n  t3_paths:\n    - "src/**"\n' > "$R/pkg/_acceptance/config.yaml"
printf 'v1\n' > "$R/pkg/src/a.js"
git -C "$R" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$R" commit -qm base
GPM14_B="$(git -C "$R" rev-parse HEAD)"
gp_feature "$R/pkg" feat-x T3 implemented
git -C "$R" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$R" commit -qm feat
GPM14="$(bash "$CHECK" "$R/pkg" --base "$GPM14_B" 2>&1)"; check GPM14 1 $?
hasout GPM14a "phản biện" "$GPM14"
# AC-18 (khai lại đích danh, contract v3-r2): hình dạng path KHÔNG được làm luật
# tắt im lặng. Bản v2 neo `^` nên monorepo thấy luật tắt hoàn toàn — và bộ eval
# v3 đã đánh rơi chính răng này (gap-probe P0-1). Assert VIOLATION chứ không chỉ
# "có chữ phản biện": một marker NOT ENFORCED cũng chứa chữ đó.
hasout GPM14b "VIOLATION [feat-x]" "$GPM14"
nothas GPM14c "GAP-PROBE: NOT ENFORCED" "$GPM14"

echo "GPM15 git diff FAIL (lich su roi nhau) -> phai BAO BO QUA, khong tin pham vi rong"
R="$GPR/gpm15"; rm -rf "$R"; mkdir -p "$R/_acceptance/feat-b" "$R/src"
git init -q "$R"
printf 'schema_version: 1\ngap_probe: required\nrisk_tiers:\n  t3_paths:\n    - "src/**"\n' > "$R/_acceptance/config.yaml"
printf 'x\n' > "$R/src/a.js"
git -C "$R" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$R" commit -qm main
GPM15_MAIN="$(git -C "$R" rev-parse --abbrev-ref HEAD)"   # tên nhánh gốc (main hay master tuỳ máy)
git -C "$R" checkout -q --orphan other; git -C "$R" rm -rqf . 2>/dev/null || true
printf 'y\n' > "$R/z.txt"; git -C "$R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$R" commit -qm orphan
GPM15_ORPH="$(git -C "$R" rev-parse HEAD)"
# Quay lại nhánh gốc bằng TÊN — `checkout -` không đáng tin ở repo vừa init, và
# nếu HEAD kẹt trên orphan thì base lại là tổ tiên của HEAD, diff rc=0 và case
# này xanh RỖNG (đã dẫm).
git -C "$R" checkout -q "$GPM15_MAIN"
gp_feature "$R" feat-b T3 implemented
git -C "$R" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$R" commit -qm feat
# AC-17 (khai lại đích danh, contract v3-r2): `git diff` thoát != 0 thì phạm vi
# là KHÔNG BIẾT, không phải "rỗng". Bản v2 chỉ đòi in "skipped" rồi exit 0 —
# fail-open có tiếng động. Ở mode required nay là VIOLATION.
GPM15="$(bash "$CHECK" "$R" --base "$GPM15_ORPH" 2>&1)"; GPM15ST=$?
hasout GPM15  "GAP-PROBE: NOT ENFORCED reason=" "$GPM15"
hasout GPM15b "git diff" "$GPM15"
check  GPM15c 1 "$GPM15ST"
nothas GPM15d "pre-merge-check: clean" "$GPM15"

# Parity thẻ↔pre-merge phải kiểm TRỌN không gian hoa/thường + khoảng trắng, không
# chỉ một ca. Bản trước chỉ có "  Bỏ gap-probe" nên lệch 3/5 ca mà test vẫn xanh:
# thẻ nhận "BỎ GAP-PROBE"/"bỏ Gap-Probe" còn awk không; awk nhận "bỏ  gap-probe"
# (hai space) còn thẻ không. Comment thì vẫn khẳng định "cùng luật".
echo "GPM16 van thoat descope: the va pre-merge phai khop tren CUNG bo ca"
# Bản cũ source hàm awk trong pre-merge-check.sh — hàm đó đã bị gỡ (Task 3), và
# việc nó tồn tại chính là thứ AC-19 cấm. Nay đo hai lối vào THẬT: lib (đường
# gate-card đi) và pre-merge chạy end-to-end.
GPM16_FAIL=0
for s in "bỏ gap-probe — x" "Bỏ gap-probe — x" "BỎ gap-probe — x" "  bỏ gap-probe — x" "bỏ GAP-PROBE — x"; do
  mk_gp_repo gpm16; R="$GPR/gpm16"; gp_feature "$R" feat-p T3 implemented
  printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
  printf '%s\n' "{\"id\":\"d-9\",\"type\":\"descope\",\"decision\":\"$s\"}" > "$R/_acceptance/feat-p/decisions.jsonl"
  gp_commit "$R"
  lib="$(node "$ROOT_REAL/lib/gap-probe.js" classify "$R/_acceptance/feat-p" | cut -f1)"
  pm=N; bash "$CHECK" "$R" --base "$GP_BASE" 2>&1 | grep -q "BỎ có chủ đích" && pm=Y
  want=Y; [ "$lib" = "descoped" ] || want=N
  if [ "$lib" != "descoped" ] || [ "$pm" != "Y" ]; then
    echo "     lệch: \"$s\" lib=$lib pre-merge=$pm (cần descoped/Y)"; GPM16_FAIL=1
  fi
done
check GPM16 0 "$GPM16_FAIL"

# ── GPM17/18/19: SÀN fail-CLOSED + marker máy-đọc ───────────────────────────
# Kênh "NOTE rồi exit 0" đã giết contract v1 (ledger d-114) và suýt giết v3
# (gap-probe P0-2). Ở `required`, KHÔNG cưỡng chế được = KHÔNG cho merge.
# Giả lập "thiếu lib" bằng một bản sao script KHÔNG có lib/ bên cạnh.
GPFAKE="$T/nolib"; mkdir -p "$GPFAKE/scripts"
cp "$ROOT_REAL/scripts/pre-merge-check.sh" "$GPFAKE/scripts/"

echo "GPM18 thieu lib/gap-probe.js -> required CHAN, advisory chi NOTE"
mk_gp_repo gpm18r; R="$GPR/gpm18r"; gp_feature "$R" feat-n T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP18="$(bash "$GPFAKE/scripts/pre-merge-check.sh" "$R" --base "$GP_BASE" 2>&1)"; GP18ST=$?
check  GPM18a 1 "$GP18ST"
hasout GPM18a2 "GAP-PROBE: NOT ENFORCED reason=" "$GP18"
hasout GPM18a3 "VIOLATION [gap-probe]" "$GP18"
mk_gp_repo gpm18a; R="$GPR/gpm18a"; gp_feature "$R" feat-n T3 implemented
printf 'gap_probe: advisory\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP18A="$(bash "$GPFAKE/scripts/pre-merge-check.sh" "$R" --base "$GP_BASE" 2>&1)"; check GPM18b 0 $?
hasout GPM18b2 "GAP-PROBE: NOT ENFORCED reason=" "$GP18A"
nothas GPM18b3 "VIOLATION" "$GP18A"
# `off` phai IM hoan toan, ke ca khi luat khong chay duoc (AC-3 khong co ngoai le)
mk_gp_repo gpm18o; R="$GPR/gpm18o"; gp_feature "$R" feat-n T3 implemented
printf 'gap_probe: off\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP18O="$(bash "$GPFAKE/scripts/pre-merge-check.sh" "$R" --base "$GP_BASE" 2>&1)"
nothas GPM18c "GAP-PROBE" "$GP18O"

echo "GPM19 marker dung MOT dong + dong tong ket phai KHAI da tat"
same   GPM19a 1 "$(printf '%s\n' "$GP18" | grep -c 'GAP-PROBE: NOT ENFORCED')"
hasout GPM19b "gap-probe: KHÔNG cưỡng chế" "$GP18"
# khong co --base -> CUNG mot loi ra (marker), khong phai mot kenh NOTE rieng
mk_gp_repo gpm19c; R="$GPR/gpm19c"; gp_feature "$R" feat-n T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP19C="$(bash "$CHECK" "$R" 2>&1)"; GP19CST=$?
hasout GPM19c "GAP-PROBE: NOT ENFORCED reason=" "$GP19C"
check  GPM19d 1 "$GP19CST"
# advisory + khong --base: marker co, VIOLATION khong
mk_gp_repo gpm19e; R="$GPR/gpm19e"; gp_feature "$R" feat-n T3 implemented
printf 'gap_probe: advisory\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP19E="$(bash "$CHECK" "$R" 2>&1)"; check GPM19e 0 $?
hasout GPM19f "GAP-PROBE: NOT ENFORCED reason=" "$GP19E"

# ── GPM21: CÙNG bảng đầu vào qua CẢ HAI lối vào, khớp TỪNG ca ───────────────
# GPM20 đo lib. P38 đo cấu trúc. Cái còn thiếu là: hai lối vào có cho cùng kết
# luận không. Một ca đại diện không đủ — v2 lệch 3/5 ca mà test vẫn xanh.
echo "GPM21 parity theo bang: decision card vs pre-merge, tung ca mot"
GPM21_FAIL=0
gp_pair() { # <nhãn> <ledger-json|rỗng> <kỳ vọng: descoped|missing>
  # Hai lối vào hỏi CÙNG một câu trên CÙNG một ledger, nhưng ở hai chặng vòng
  # đời khác nhau: thẻ Cổng 1 đọc contract `approved`, pre-merge chỉ xét từ
  # `implemented`. Nên fixture phải có hai bản contract — ledger thì y hệt.
  mk_gp_repo gpm21; local R="$GPR/gpm21"
  gp_feature "$R" feat-t T3 implemented
  printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
  [ -n "$2" ] && printf '%s\n' "$2" > "$R/_acceptance/feat-t/decisions.jsonl"
  gp_commit "$R"
  # lối vào A: pre-merge chạy END-TO-END (không phải lib trực tiếp)
  local A=missing
  bash "$CHECK" "$R" --base "$GP_BASE" 2>&1 | grep -q "BỎ có chủ đích" && A=descoped
  # lối vào B: decision card Cổng 1 — cùng ledger, contract ở `approved`
  local C="$GPR/gpm21card"; rm -rf "$C"; mkdir -p "$C/_acceptance/feat-t"
  gp_feature "$C" feat-t T3 approved
  [ -n "$2" ] && printf '%s\n' "$2" > "$C/_acceptance/feat-t/decisions.jsonl"
  local B; B="$(node "$GCARD" --root "$C" --slug feat-t --extract 2>/dev/null | node -e '
    let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
      try { process.stdout.write(JSON.parse(s).gap_probe.descoped ? "descoped" : "missing"); }
      catch (e) { process.stdout.write("ERR"); }
    })')"
  if [ "$A" != "$3" ] || [ "$B" != "$3" ]; then
    echo "     LỆCH [$1]: pre-merge=$A card=$B cần=$3"; GPM21_FAIL=$((GPM21_FAIL+1))
  fi
}
gp_pair "thuong"        '{"id":"d-1","type":"descope","decision":"bỏ gap-probe — x"}'  descoped
gp_pair "hoa"           '{"id":"d-2","type":"descope","decision":"BỎ gap-probe — x"}'  descoped
gp_pair "space-dau"     '{"id":"d-3","type":"descope","decision":"   bỏ gap-probe"}'   descoped
gp_pair "gap-probe-hoa" '{"id":"d-4","type":"descope","decision":"bỏ GAP-PROBE"}'      descoped
gp_pair "json-hong"     '{"id":"d-5","type":"descope","decision":"bỏ gap-probe,,,'     missing
gp_pair "type-khac"     '{"id":"d-6","type":"approach","decision":"bỏ gap-probe"}'     missing
gp_pair "decision-khac" '{"id":"d-7","type":"descope","decision":"bỏ mockup"}'         missing
gp_pair "ledger-vang"   ''                                                             missing
check GPM21 0 "$GPM21_FAIL"

# ── GPM20: bảng đầu vào chạy thẳng vào lib/gap-probe.js ─────────────────────
# Đo CHÍNH mã sản phẩm, không chép luật sang test. GPM16 của v2 xanh giả vì
# chép regex; đây là cùng bài học, áp ở tầng lib.
GPLIB="$ROOT_REAL/lib/gap-probe.js"
gp_classify() { # <probeText> <ledgerText> -> "outcome|id"
  node -e '
    const L = require(process.argv[1]);
    const r = L.classify({ probeText: process.argv[2], ledgerText: process.argv[3] });
    process.stdout.write(r.outcome + "|" + (r.id || ""));
  ' "$GPLIB" "$1" "$2" 2>&1
}
echo "GPM20 bang 8 dau vao -> lib phan loai dung tung ca"
same GPM20a "ok|" "$(gp_classify '---
verdict: clean
---
' '')"
same GPM20b "ok|" "$(gp_classify '---
verdict: FINDINGS
---
' '')"
same GPM20c "probe-failed|" "$(gp_classify '---
verdict: probe-failed
---
' '')"
# verdict trong THÂN BÀI không được tính (AC-6)
same GPM20d "missing|" "$(gp_classify '# tieu de

verdict: clean
' '')"
# frontmatter có nhưng verdict lạ (AC-6)
same GPM20e "missing|" "$(gp_classify '---
verdict: xanh
---
' '')"
# van thoát descope: viết hoa + khoảng trắng đầu (AC-7)
same GPM20f "descoped|d-1" "$(gp_classify '' '{"id":"d-1","type":"descope","decision":"  BỎ gap-probe — khong can"}')"
# dòng JSON HỎNG KHÔNG được mở van thoát (AC-13, fail-CLOSED)
same GPM20g "missing|" "$(gp_classify '' '{"id":"d-2","type":"descope","decision":"bỏ gap-probe — hong,,,')"
# entry descope nhưng decision khác -> không mở van
same GPM20h "missing|" "$(gp_classify '' '{"id":"d-3","type":"descope","decision":"bỏ mockup"}')"

# ── TE: cờ --no-t1-escape ────────────────────────────────────────────────────
# Fixture: repo có src/app.js (t3_paths) + docs/, KHÔNG có _acceptance/<slug>/
# trong diff → răng T1-escape có cớ để nổ.
te_repo() { # <case> <file cần đổi> [--with-plugins-glob] -> đặt TE_R, TE_B
  mk_gp_repo "$1"; TE_R="$GPR/$1"; TE_B="$GP_BASE"
  if [ "${3:-}" = "--with-plugins-glob" ]; then
    # config fixture của mk_gp_repo chỉ có docs/**; thêm plugins/** cho ca AC-7/14
    sed -i.bak 's|    - "docs/\*\*"|    - "docs/**"\n    - "plugins/**"|' "$TE_R/_acceptance/config.yaml"
    rm -f "$TE_R/_acceptance/config.yaml.bak"
    git -C "$TE_R" add -A >/dev/null
    git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm globs
    TE_B="$(git -C "$TE_R" rev-parse HEAD)"
  fi
  mkdir -p "$(dirname "$TE_R/$2")"; printf 'v2\n' >> "$TE_R/$2"
  git -C "$TE_R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm change
}

echo "TE1 KHONG co co -> hanh vi Y HET hom nay (backward compat)"
te_repo te1 src/app.js
TE1="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; TE1ST=$?
hasout TE1  "VIOLATION [PR]" "$TE1"
check  TE1b 1 "$TE1ST"
nothas TE1c "T1-ESCAPE: NOT ENFORCED" "$TE1"

echo "TE2 co co -> rang tat, khong VIOLATION [PR]"
te_repo te2a src/app.js
TE2A="$(bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1)"; check TE2a 0 $?
nothas TE2a2 "VIOLATION [PR]" "$TE2A"
# Chống XANH-RỖNG: trước khi script biết cờ, nó coi "--no-t1-escape" là ROOT,
# không thấy _acceptance/ và thoát 0 ngay — TE2a/TE2a2 xanh mà luật chưa chạy
# lần nào. Hai assert dưới đây phân biệt "đúng" với "không chạy".
nothas TE2a3 "no _acceptance/" "$TE2A"
hasout TE2a4 "pre-merge-check:" "$TE2A"
te_repo te2b src/app.js
TE2B="$(bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1)"
nothas TE2b2 "T3 paths (t3_paths) changed" "$TE2B"

echo "TE3 khi tat phai keu to: hai chuoi NGUYEN VAN, moi cai dung MOT dong"
same TE3a 1 "$(printf '%s\n' "$TE2A" | grep -cF 'T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise')"
same TE3b 1 "$(printf '%s\n' "$TE2A" | grep -cF 'pre-merge-check: T1-escape: KHÔNG cưỡng chế trong lần chạy này (xem dòng marker NOT ENFORCED ở trên)')"

echo "TE4 co co van KHONG tat luat gap-probe"
mk_gp_repo te4; R="$GPR/te4"; gp_feature "$R" feat-z T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
TE4="$(bash "$CHECK" "$R" --base "$GP_BASE" --no-t1-escape 2>&1)"; TE4ST=$?
hasout TE4  "chưa qua phản biện context sạch" "$TE4"
check  TE4b 1 "$TE4ST"

echo "TE5 co co van KHONG tat luat per-slug (chu ky)"
mk_gp_repo te5; R="$GPR/te5"; gp_feature "$R" feat-y T3 implemented
sed -i.bak 's/^human_signoff:.*/human_signoff:/' "$R/_acceptance/feat-y/evidence-report.md" && rm -f "$R/_acceptance/feat-y/evidence-report.md.bak"
gp_commit "$R"
# DOI CHUNG DUONG truoc: fixture chua go chu ky phai XANH, neu khong TE5 chi
# chung minh "co violation nao do" chu khong phai luat chu ky. Bat bien #4.
mk_gp_repo te5ok; ROK="$GPR/te5ok"; gp_feature "$ROK" feat-y T3 implemented; gp_commit "$ROK"
TE5OK="$(bash "$CHECK" "$ROK" --base "$GP_BASE" --no-t1-escape 2>&1)"; check TE5ctrl 0 $?
TE5="$(bash "$CHECK" "$R" --base "$GP_BASE" --no-t1-escape 2>&1)"; TE5ST=$?
check  TE5a 1 "$TE5ST"
nothas TE5b "pre-merge-check: clean" "$TE5"
hasout TE5c "human_signoff is empty" "$TE5"

echo "TE7 diff CHI plugins/ -> rang khong no"
te_repo te7 plugins/acceptance-gate/scripts/x.js --with-plugins-glob
TE7="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"
nothas TE7a "VIOLATION [PR]" "$TE7"
hasout TE7b "pre-merge-check:" "$TE7"

echo "TE14 diff HON HOP (plugins/ + non-T1) -> VAN no, liet DUNG file non-T1"
te_repo te14 plugins/acceptance-gate/scripts/x.js --with-plugins-glob
printf 'v3\n' >> "$TE_R/src/app.js"
git -C "$TE_R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm mixed
TE14="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"
hasout TE14a "VIOLATION [PR]" "$TE14"
hasout TE14b "src/app.js" "$TE14"
nothas TE14c "plugins/acceptance-gate" "$TE14"

echo "TE15 diff CHI file T1 thuan -> khong no (true-negative)"
te_repo te15 docs/note.md
TE15="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check TE15 0 $?
nothas TE15b "VIOLATION [PR]" "$TE15"

# ── TE17: bằng chứng cho judge phải SINH LẠI rồi diff byte-đối-byte ─────────
# Cùng khuôn GPM12: đếm nhãn chỉ đo sự ĐẦY ĐỦ, không đo tính XÁC THỰC. Thông
# điệp đổi mà file evidence không đổi thì judge chấm một bản chụp lỗi thời.
echo "TE17 sinh lai evidence/t1escape-messages.txt roi diff byte-doi-byte"
TEMSG="$ROOT_REAL/_acceptance/t1-escape-event-scope/evidence/t1escape-messages.txt"
te_msg_run() { # <nhãn> <có cờ: yes|no>
  te_repo "msg$1" src/app.js
  printf '\n== fixture %s (rang %s) ==\n' "$1" "$2"
  if [ "$2" = "yes" ]; then
    bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1 | grep -E 'T1-ESCAPE|T1-escape|VIOLATION \[PR\]|^NOTE: (lớp đang tắt|rủi ro khi tắt)'
  else
    bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1 | grep -E 'T1-ESCAPE|T1-escape|VIOLATION \[PR\]|^NOTE: (lớp đang tắt|rủi ro khi tắt)'
  fi
}
TE17NEW="$(mktemp)"
{
  printf '%s\n' '# Thông điệp răng T1-escape — SINH bởi tests/scripts/run-tests.sh (TE17).'
  printf '%s\n' '# KHÔNG sửa tay: suite sinh lại file này mỗi lần chạy và diff byte-đối-byte.'
  te_msg_run bat no
  te_msg_run tat yes
} > "$TE17NEW" 2>&1
if [ "${TE17_WRITE:-0}" = "1" ]; then cp "$TE17NEW" "$TEMSG"; echo "  (TE17_WRITE=1 — đã ghi lại)"; fi
if diff -u "$TEMSG" "$TE17NEW" > "$T/te17.diff" 2>&1; then
  check TE17 0 0
else
  echo "     evidence LỆCH với thông điệp hiện tại:"; head -20 "$T/te17.diff" | sed 's/^/     /'
  check TE17 0 1
fi
# Bat troi PHAM VI: mat han mot nhanh thi diff van khop neu evidence cung sinh thieu
TE17M="$(cat "$TE17NEW")"
hasout TE17a "VIOLATION [PR]" "$TE17M"
hasout TE17b "T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise" "$TE17M"
hasout TE17c "pre-merge-check: T1-escape: KHÔNG cưỡng chế" "$TE17M"

# ── TE16: DELTA của cờ trên chính triệu chứng gốc ───────────────────────────
# Fixture GIỮ verified_commit — cấm bỏ field đó để có màu xanh (AC-17). Vì thế
# lần chạy CÓ cờ vẫn còn violation staleness: đó là luật KHÁC, tiền đề khác,
# ngoài phạm vi feature này. Đo DELTA chứ không đo "clean".
echo "TE16 cung commit, chay hai lan: co co thi mat VIOLATION [PR]"
mk_gp_repo te16; TE16R="$GPR/te16"
gp_feature "$TE16R" feat-done T3 signed-off
git -C "$TE16R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE16R" commit -qm feat
TE16_PIN="$(git -C "$TE16R" rev-parse HEAD)"
printf 'verified_commit: %s\n' "$TE16_PIN" > "$T/te16.pin"
python3 - "$TE16R/_acceptance/feat-done/evidence-report.md" "$TE16_PIN" <<'TE16PY'
import io,sys
p,sha=sys.argv[1],sys.argv[2]
t=io.open(p,encoding='utf-8').read()
t=t.replace('verdict: PASS','verdict: PASS\nverified_commit: '+sha,1)
io.open(p,'w',encoding='utf-8').write(t)
TE16PY
git -C "$TE16R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE16R" commit -qm pin
TE16_BASE="$(git -C "$TE16R" rev-parse HEAD)"
# commit "ha tang": cham t3_paths, KHONG file nao duoi _acceptance/
printf 'v9\n' >> "$TE16R/src/app.js"
git -C "$TE16R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE16R" commit -qm infra

TE16_OFF="$(bash "$CHECK" "$TE16R" --base "$TE16_BASE" 2>&1)"
TE16_ON="$(bash "$CHECK" "$TE16R" --base "$TE16_BASE" --no-t1-escape 2>&1)"
hasout TE16a "VIOLATION [PR]" "$TE16_OFF"
nothas TE16b "VIOLATION [PR]" "$TE16_ON"
# AC-17: violation con lai phai duoc NEU TEN, va fixture PHAI con verified_commit
hasout TE16c "evidence is stale" "$TE16_ON"
hasout TE16d "verified_commit" "$(cat "$TE16R/_acceptance/feat-done/evidence-report.md")"

echo "TE18 co la = loi cung, KHONG duoc nuot thanh ROOT"
mk_gp_repo te18; R="$GPR/te18"; gp_feature "$R" feat-w T3 implemented; gp_commit "$R"
TE18="$(bash "$CHECK" "$R" --no-t1escape --base "$GP_BASE" 2>&1)"; TE18ST=$?
check  TE18a 2 "$TE18ST"
hasout TE18b "unknown option" "$TE18"
nothas TE18c "nothing to check" "$TE18"
# MOT gach cung la loi go — ban chi bat `--*` de lot `-no-t1-escape` y nguyen
TE18D="$(bash "$CHECK" "$R" -no-t1-escape --base "$GP_BASE" 2>&1)"; check TE18d 2 $?
hasout TE18d2 "unknown option -no-t1-escape" "$TE18D"
nothas TE18e "nothing to check" "$TE18D"
# Positional thu hai: dung mot thu muc CO THAT, neu khong exit 2 roi ra tu chot
# `-d` khac va case nay xanh ngay ca khi chot ROOT_SET bi go (da kiem bang dot
# bien — dung lop loi ma CLAUDE.md bat biren #4 cam).
TE18F="$(bash "$CHECK" "$R" "$R" --base "$GP_BASE" 2>&1)"; check TE18f 2 $?
hasout TE18f2 "unexpected argument" "$TE18F"
TE18G="$(bash "$CHECK" "$GPR/khong-ton-tai" --base "$GP_BASE" 2>&1)"; check TE18g 2 $?
hasout TE18g2 "root not a directory" "$TE18G"
# Co KHONG duoc lam GIA TRI cua --base/--slug: `--base --no-t1-escape` tung nuot
# co ke lam ref, base khong bao gio resolve, ca rang T1-escape lan gap-probe bo
# qua, script in `clean` va thoat 0.
TE18H="$(bash "$CHECK" "$R" --base --no-t1-escape 2>&1)"; check TE18h 2 $?
hasout TE18h2 "--base requires a value (got option --no-t1-escape)" "$TE18H"
TE18I="$(bash "$CHECK" "$R" --slug --base 2>&1)"; check TE18i 2 $?
# Base DUOC KHAI ma khong resolve != khong khai base. Cai sau la bo-qua-co-tin-
# hieu; cai truoc la nguoi van hanh da YEU CAU pham vi ma may khong tinh duoc.
TE18J="$(bash "$CHECK" "$R" --base khong-co-ref-nay 2>&1)"; check TE18j 2 $?
hasout TE18j2 "VIOLATION [scope]" "$TE18J"
# Doi chung: KHONG truyen base van la bo-qua-co-tin-hieu, khong phai loi cung
TE18K="$(bash "$CHECK" "$R" 2>&1)"; check TE18k 0 $?

# ── RL: sổ luật-đã-chạy — `clean` phải được chứng minh ──────────────────────
# Fixture chuẩn: repo git có MỘT slug ngoài diff (vòng per-slug có việc thật),
# diff chỉ chạm docs -> mọi luật chạy trọn, không violation. Đây là đối chứng
# dương dùng chung của cả nhóm RL.
rl_repo() { # <case> — đặt TE_R (root) + TE_B (base sha)
  mk_gp_repo "$1"; TE_R="$GPR/$1"
  gp_feature "$TE_R" feat-rl T3 implemented
  git -C "$TE_R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm feat
  TE_B="$(git -C "$TE_R" rev-parse HEAD)"
  mkdir -p "$TE_R/docs"; printf 'v2\n' >> "$TE_R/docs/note.md"
  git -C "$TE_R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm docs
}

echo "RL1 repo sach: ca ba luat chay, tong ket dung MOT lan, khong declared-off"
rl_repo rl1
RL1="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL1 0 $?
hasout RL1a "pre-merge-check: clean" "$RL1"
same RL1b 1 "$(printf '%s\n' "$RL1" | grep -cx 'ran per-slug')"
same RL1c 1 "$(printf '%s\n' "$RL1" | grep -cx 'ran gap-probe')"
same RL1d 1 "$(printf '%s\n' "$RL1" | grep -cx 'ran t1-escape')"
same RL1e 1 "$(printf '%s\n' "$RL1" | grep -c '^pre-merge-check: rules ran=')"
hasout RL1f "pre-merge-check: rules ran=3 declared-off=0 expected=3" "$RL1"
# RL3c (âm, AC-3): luật KHÔNG tắt thì KHÔNG được có dòng declared-off nào
same RL3c 0 "$(printf '%s\n' "$RL1" | grep -c '^declared-off ')"

echo "RL3a co --no-t1-escape -> dong so NGUYEN VAN 'declared-off t1-escape'"
rl_repo rl3a
RL3A="$(bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1)"; check RL3a1 0 $?
same RL3a2 1 "$(printf '%s\n' "$RL3A" | grep -cx 'declared-off t1-escape')"
same RL3a3 0 "$(printf '%s\n' "$RL3A" | grep -cx 'ran t1-escape')"
hasout RL3a4 "pre-merge-check: rules ran=2 declared-off=1 expected=3" "$RL3A"
hasout RL3a5 "pre-merge-check: clean" "$RL3A"

echo "RL3b gap_probe: off trong config -> 'declared-off gap-probe'"
rl_repo rl3b
printf 'gap_probe: off\n' >> "$TE_R/_acceptance/config.yaml"
git -C "$TE_R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm cfg
RL3B="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL3b1 0 $?
same RL3b2 1 "$(printf '%s\n' "$RL3B" | grep -cx 'declared-off gap-probe')"
same RL3b3 0 "$(printf '%s\n' "$RL3B" | grep -cx 'ran gap-probe')"
hasout RL3b4 "pre-merge-check: rules ran=2 declared-off=1 expected=3" "$RL3B"
hasout RL3b5 "pre-merge-check: clean" "$RL3B"

echo "RL4 khong --base + advisory -> exit Y HET TE18k, so khop qua marker"
rl_repo rl4
RL4="$(bash "$CHECK" "$TE_R" 2>&1)"; check RL4a 0 $?
same RL4b 1 "$(printf '%s\n' "$RL4" | grep -cx 'declared-off gap-probe')"
same RL4c 1 "$(printf '%s\n' "$RL4" | grep -cx 'declared-off t1-escape')"
same RL4d 1 "$(printf '%s\n' "$RL4" | grep -cx 'ran per-slug')"
hasout RL4e "pre-merge-check: rules ran=1 declared-off=2 expected=3" "$RL4"
hasout RL4f "pre-merge-check: clean" "$RL4"

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
