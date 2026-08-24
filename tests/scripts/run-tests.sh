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

echo "--- evidence re-check (recheck-evidence.cjs, wired into pre-merge) ---"
RC="$HERE/../../scripts/recheck-evidence.cjs"
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
# PM06 đổi thước có hợp đồng (hồ sơ status-chua-arm-cong, 18/08): fixture mk_xl
# LUÔN viết một evidence-report PASS đã ký, nên «draft + có evidence» chính là
# hồ sơ chưa arm cổng — nay VIOLATION đích danh thay vì im lặng. Lời hứa gốc
# của ca (luật pairing cross-layer NGOÀI phạm vi cho draft) vẫn giữ: không dòng
# cross-layer nào.
echo "PM06 feature draft CÓ evidence -> chưa arm cổng (exit 1), luật pairing vẫn ngoài scope"
mk_xl "$P/pm06" feat-xl6 '- AC-1: Given app, When submit order, Then order saved via API. (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "e2e mobile green"' draft
outPM6="$(bash "$CHECK" "$P/pm06" 2>&1)"; check PM06 1 $?
case "$outPM6" in *"chưa arm cổng"*) echo "  PASS: PM06-arm"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM06-arm (expected VIOLATION chưa arm cổng)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
case "$outPM6" in *cross-layer*) echo "  FAIL: PM06-silent (pairing rule ran on draft)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: PM06-silent"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
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

# PM13/PM14 — răng nay chấm trên lib/ac-line.cjs (nguồn dùng chung), không phải
# khuôn awk riêng. Hai ca đo đúng hai chỗ awk và parser dùng chung khác nhau.
echo "PM13 nhãn **(cross-layer)** chen giữa id và ':' -> vẫn bắt được (không rụng)"
mk_xl "$P/pm13" feat-xl13 '- AC-1 **(cross-layer)**: Given app, When submit order, Then order saved via API.' '  - id: E1
    criterion: AC-1
    executor: ui-check
    expected: "toast hien"'
outPM13="$(bash "$CHECK" "$P/pm13" 2>&1)"; check PM13 1 $?
case "$outPM13" in *"AC-1 is tagged (cross-layer)"*) echo "  PASS: PM13-bold"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM13-bold (nhãn chen giữa làm răng trượt)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

# Đây là ca awk KHÔNG làm được: `- **AC-5, AC-9 chưa có gì** (cross-layer)` là
# văn xuôi tham chiếu chéo, không phải tiêu chí. Khuôn awk in ra AC-5 -> VIOLATION
# GIẢ chặn merge oan. parseAC loại nó bằng AC_XREF.
echo "PM14 dòng THAM CHIẾU CHÉO có chữ (cross-layer) -> KHÔNG được thành VIOLATION"
mk_xl "$P/pm14" feat-xl14 '- AC-1: Given app, When submit, Then saved via API.
- **AC-5, AC-9 chua co gi** (cross-layer)' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "ok"'
outPM14="$(bash "$CHECK" "$P/pm14" 2>&1)"; check PM14 0 $?
case "$outPM14" in *"AC-5 is tagged"*) echo "  FAIL: PM14-xref (tham chiếu chéo bị chấm như tiêu chí = VIOLATION GIẢ)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: PM14-xref"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac

# ── PM15/PM16/PM17: trục ĐƯỜNG LÙI (thiếu node/lib) + phép đo có răng ──────────
# Ba ô này trước đây KHÔNG có case nào: suite chỉ chạy trên máy có node + lib,
# nên nhánh awk-đường-lùi và khối đè lib đều chưa từng bị đo. Hồ sơ
# _acceptance/premerge-ac-line/ (AC-4, AC-5, AC-7) đòi đúng ba ô này.
PMROOT="$(cd "$HERE/../.." && pwd)"

# PM15 (AC-4) — thiếu lib/ac-line.cjs thì răng VẪN phải cắn. Đây là điều kiện bắt
# buộc để giữ khuôn awk lại: bỏ awk cho "một nguồn duy nhất" sẽ TẮT răng chặn
# trên máy thiếu node — chiều hỏng tệ nhất cho một cổng CHẶN.
# Bản sao script đặt cạnh một thư mục KHÔNG có lib/ (khuôn GPFAKE tái dùng).
PMNOLIB="$T/pmnolib"; mkdir -p "$PMNOLIB/scripts"
cp "$CHECK" "$PMNOLIB/scripts/pre-merge-check.sh"
mk_xl "$P/pm15" feat-xl15 '- AC-1 **(cross-layer)**: Given app, When submit order, Then order saved via API.' '  - id: E1
    criterion: AC-1
    executor: ui-check
    expected: "toast hien"'
echo "PM15 thiếu lib/ac-line.cjs -> răng cross-layer VẪN cắn (không tắt im lặng)"
outPM15="$(bash "$PMNOLIB/scripts/pre-merge-check.sh" "$P/pm15" 2>&1)"; check PM15 1 $?
case "$outPM15" in *"AC-1 is tagged (cross-layer)"*) echo "  PASS: PM15-teeth"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM15-teeth (đường lùi làm răng TẮT — cổng chặn mất hiệu lực trên máy thiếu node)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
# Đối chứng dương: CÙNG fixture trên bản có lib/ cũng phải đỏ. Không có vế này
# thì PM15 xanh cả khi nó đỏ vì một lý do khác hẳn (fixture hỏng, slug sai…).
outPM15b="$(bash "$CHECK" "$P/pm15" 2>&1)"; check PM15b 1 $?
case "$outPM15b" in *"AC-1 is tagged (cross-layer)"*) echo "  PASS: PM15b-doichung"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM15b-doichung (đường lib không đỏ trên cùng fixture)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

# PM16 (AC-5) — đường lùi phải CÓ TIẾNG, và đúng MỘT tiếng cho cả lần chạy.
# Bài học của cả loạt sửa này là sự lệch ÂM THẦM; một đường lùi im lặng dựng lại
# đúng cái bẫy đó, còn mỗi slug một dòng thì thành nhiễu và người ta học cách bỏ qua.
mk_xl "$P/pm16" feat-xl16a '- AC-1: Given app, When submit, Then saved via API.' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "ok"'
mk_xl "$P/pm16" feat-xl16b '- AC-1: Given app, When pay, Then charged via API.' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "ok"'
mk_xl "$P/pm16" feat-xl16c '- AC-1: Given app, When refund, Then refunded via API.' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "ok"'
echo "PM16 ba slug cùng dính đường lùi -> ĐÚNG MỘT dòng NOTE cho cả lần chạy"
outPM16="$(bash "$PMNOLIB/scripts/pre-merge-check.sh" "$P/pm16" 2>&1)"
n16="$(printf '%s\n' "$outPM16" | grep -c '^NOTE: cross-layer teeth graded with the built-in awk')"
same PM16-once 1 "$n16"
# Nửa âm: có node + lib thì đường lùi KHÔNG chạy, nên KHÔNG được in dòng nào.
# Thiếu vế này, một `echo` vô điều kiện vẫn làm PM16-once xanh.
outPM16b="$(bash "$CHECK" "$P/pm16" 2>&1)"
n16b="$(printf '%s\n' "$outPM16b" | grep -c '^NOTE: cross-layer teeth graded with the built-in awk')"
same PM16b-silent 0 "$n16b"

# PM17 (AC-7) — mutation: XOÁ đúng dòng đè kết quả của lib, giữ nguyên mọi thứ
# khác (node + lib vẫn đủ). Không có case này thì "đã dùng nguồn dùng chung" là
# lời khẳng định, không phải phép đo: khuôn awk rộng hơn nên đa số fixture cho
# cùng kết quả ở cả hai đường, và suite vẫn xanh kể cả khi khối đè bị xoá.
# Tiêm bằng NO-OP `:`, KHÔNG xoá trắng dòng: xoá trắng để lại `then` rỗng, bash
# từ chối parse, và case sẽ "đỏ" vì script hỏng chứ không vì khối đè mất tác
# dụng — đúng một 0-hit-giả mặc áo mutation. Vì thế răng dưới đây kiểm HAI vế:
# (a) bước tiêm chạm được file, (b) bản tiêm VẪN là bash hợp lệ. Thiếu (b) thì
# "khác file" là lời khẳng định rỗng.
PMMUT="$T/pmmut"; mkdir -p "$PMMUT/scripts" "$PMMUT/lib"
cp "$PMROOT"/lib/*.js "$PMMUT/lib/" 2>/dev/null
sed 's/^      xl_acs="\$xl_from_lib"$/      :/' "$CHECK" > "$PMMUT/scripts/pre-merge-check.sh"
echo "PM17 mutation vô hiệu khối đè lib -> phép đo phải ĐỎ đích danh (chống 0-hit-giả)"
if cmp -s "$CHECK" "$PMMUT/scripts/pre-merge-check.sh"; then
  echo "  FAIL: PM17-mut (bước tiêm KHÔNG chạm được file — case sẽ xanh mà không kiểm gì)"; FAIL_COUNT=$((FAIL_COUNT+1))
elif ! bash -n "$PMMUT/scripts/pre-merge-check.sh" 2>/dev/null; then
  echo "  FAIL: PM17-mut (bản tiêm không phải bash hợp lệ — nó sẽ 'đỏ' vì hỏng cú pháp, không vì mất khối đè)"; FAIL_COUNT=$((FAIL_COUNT+1))
else
  echo "  PASS: PM17-mut (bước tiêm chạm file VÀ bản tiêm vẫn parse được)"; PASS_COUNT=$((PASS_COUNT+1))
  # Đối chứng dương: bản NGUYÊN VẸN phải sạch trên cùng fixture trước đã.
  outPM17a="$(bash "$CHECK" "$P/pm14" 2>&1)"
  case "$outPM17a" in *"AC-5 is tagged"*) echo "  FAIL: PM17-pristine (bản nguyên vẹn đã đỏ sẵn — phép đo không chứng minh gì)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: PM17-pristine"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
  outPM17="$(bash "$PMMUT/scripts/pre-merge-check.sh" "$P/pm14" 2>&1)"
  case "$outPM17" in *"AC-5 is tagged"*) echo "  PASS: PM17-red"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM17-red (vô hiệu khối đè mà cổng vẫn sạch -> khối đè KHÔNG phải thứ đang quyết định kết quả)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
fi

# PM18 (#36) — criterion TRÍCH DẪN Dấu cross-layer trong code span KHÔNG được
# thành VIOLATION. Một hồ sơ giải thích Dấu cho người mới là chuyện bình thường
# trong repo dạy chính khái niệm đó; trước bản sửa nó bị CHẶN MERGE.
mk_xl "$P/pm18" feat-xl18 '- AC-1: Given hồ sơ giải thích Dấu `(cross-layer)` cho người mới, When đọc, Then hiểu được — tiêu chí NÀY không mang Dấu đó.' '  - id: E1
    criterion: AC-1
    executor: test
    expected: "ok"'
echo "PM18 criterion TRÍCH DẪN Dấu trong code span -> KHÔNG được thành VIOLATION"
outPM18="$(bash "$CHECK" "$P/pm18" 2>&1)"; check PM18 0 $?
case "$outPM18" in *"AC-1 is tagged"*) echo "  FAIL: PM18-quote (trích dẫn Dấu bị chấm như mang Dấu = VIOLATION GIẢ chặn merge)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: PM18-quote"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac

# Mutation: gỡ dòng ĐÈ (`out.delete`) thì phải ĐỎ lại. Không có vế này thì
# PM18 xanh kể cả khi dòng đè bị xoá — 0-hit-giả. Răng hai vế như PM17: bước
# tiêm chạm được file VÀ bản tiêm vẫn parse được (xoá cả dòng nên JS vẫn hợp lệ).
PMMUT2="$T/pmmut2"; mkdir -p "$PMMUT2/scripts" "$PMMUT2/lib"
cp "$PMROOT"/lib/*.js "$PMMUT2/lib/" 2>/dev/null
sed '/out.delete(a.id)/d' "$CHECK" > "$PMMUT2/scripts/pre-merge-check.sh"
if cmp -s "$CHECK" "$PMMUT2/scripts/pre-merge-check.sh"; then
  echo "  FAIL: PM18-mut (bước tiêm KHÔNG chạm được file)"; FAIL_COUNT=$((FAIL_COUNT+1))
elif ! bash -n "$PMMUT2/scripts/pre-merge-check.sh" 2>/dev/null; then
  echo "  FAIL: PM18-mut (bản tiêm không phải bash hợp lệ — sẽ 'đỏ' vì hỏng cú pháp)"; FAIL_COUNT=$((FAIL_COUNT+1))
else
  echo "  PASS: PM18-mut (bước tiêm chạm file VÀ bản tiêm vẫn parse được)"; PASS_COUNT=$((PASS_COUNT+1))
  outPM18m="$(bash "$PMMUT2/scripts/pre-merge-check.sh" "$P/pm18" 2>&1)"
  case "$outPM18m" in *"AC-1 is tagged"*) echo "  PASS: PM18-red"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM18-red (gỡ dòng đè mà cổng vẫn sạch -> dòng đè không phải thứ đang quyết định)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
fi

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
surfaces: [api]
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
surfaces: [api]   # mobile maybe later
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

# ── Nhà viết criterion mà khuôn HẸP cũ nuốt im lặng (lib/ac-line.cjs) ──────────
# Mọi fixture cross-layer phía trên đặt nhãn ở CUỐI câu, nên suite này chưa bao
# giờ chạm dạng "nhãn chen giữa id và dấu hai chấm" — đó là lý do lỗi sống sót.
# Đo thật (oneflow, 07/08/2026): 7 dòng ở 5 hợp đồng ĐÃ KÝ vô hình với lint.

# Fixture Q: nhãn (cross-layer) ĐẬM chen giữa id và dấu hai chấm + eval CHỈ có ui
# -> W4 phải nổ. Trước thay đổi này: parser bỏ dòng, W4 im, exit 0 (false-green).
Q="$T/lintQ/_acceptance/feat-xl-bold"; mkdir -p "$Q"
cat > "$Q/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api]
---
## Criteria
- AC-1: Given user, When mở app, Then thấy dashboard.
- AC-2 **(cross-layer)**: Given user, When submit order, Then order saved via API.
## Out of scope
EOF
cat > "$Q/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0"
  - id: E2
    criterion: AC-2
    executor: ui-check
    expected: "toast hiện 'đã lưu'"
EOF

echo "L30 nhãn **(cross-layer)** chen giữa id và ':' -> AC vẫn đọc được, W4 nổ"
outL30="$(node "$LINT" "$T/lintQ" 2>&1)"; check L30 1 $?
case "$outL30" in *"AC-2 is tagged (cross-layer)"*) echo "  PASS: L30-w4"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L30-w4 (nhãn giữa id và ':' làm AC vô hình = FALSE-GREEN)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

# Fixture R: chú thích amendment nghiêng chen giữa id và dấu hai chấm, AC có
# ngưỡng, evals thiếu should-NOT-fire -> W1 phải nổ trên AC đó.
R="$T/lintR/_acceptance/feat-amend"; mkdir -p "$R"
cat > "$R/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api]
---
## Criteria
- AC-1: Given user, When mở app, Then thấy dashboard.
- AC-2 *(sửa lời 05/08 — xem Amendment)*: Given user, When ≥3 opens trong 48h, Then fire hot.
## Out of scope
EOF
cat > "$R/evals.yaml" <<'EOF'
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

echo "L31 chú thích *(sửa lời …)* chen giữa id và ':' -> AC vẫn đọc được, W1 nổ"
outL31="$(node "$LINT" "$T/lintR" 2>&1)"; check L31 1 $?
case "$outL31" in *"W1 AC-2"*) echo "  PASS: L31-w1"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L31-w1 (chú thích giữa id và ':' làm AC vô hình)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

# Fixture S: dòng TRÔNG như criterion mà parser không đọc nổi -> W7 phải kêu.
# `- **AC-2**` trống (không có chữ nào sau id) là dạng parseAC() cố tình trả null.
S5="$T/lintS/_acceptance/feat-blind"; mkdir -p "$S5"
cat > "$S5/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api]
---
## Criteria
- AC-1: Given user, When mở app, Then thấy dashboard.
- **AC-2**
## Out of scope
EOF
cat > "$S5/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0"
EOF

echo "L32 dòng trông như criterion mà không parse -> W7 kêu (không nuốt im lặng)"
outL32="$(node "$LINT" "$T/lintS" 2>&1)"; check L32 1 $?
case "$outL32" in *"W7"*) echo "  PASS: L32-w7"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L32-w7 (criterion hỏng bị bỏ qua im lặng — đúng lỗ đã giấu lỗi này)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "L33 contract lành KHÔNG bị W7 (cry-wolf guard)"
outL33="$(node "$LINT" "$T/lintB" 2>&1)"
case "$outL33" in *"W7"*) echo "  FAIL: L33-nowolf (contract lành bị W7)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: L33-nowolf"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac

# L37 (#36) — nửa lint của PM18: criterion TRÍCH DẪN Dấu trong code span không
# được sinh W4. Cùng luật `uncoded()` mà `judgment` đã theo từ đầu.
TV="$T/lintV/_acceptance/feat-quote"; mkdir -p "$TV"
cat > "$TV/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api]
---
## Criteria
- AC-1: Given hồ sơ giải thích Dấu `(cross-layer)` cho người mới, When đọc, Then hiểu được — tiêu chí NÀY không mang Dấu đó.
## Out of scope
EOF
cat > "$TV/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: "exit 0"
EOF
echo "L37 criterion TRÍCH DẪN Dấu cross-layer trong code span -> KHÔNG sinh W4"
outL37="$(node "$LINT" "$T/lintV" 2>&1)"
case "$outL37" in *"W4 AC-1"*) echo "  FAIL: L37-quote (trích dẫn Dấu bị chấm như mang Dấu — W4 bắn giả)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: L37-quote"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac

echo "L34 dạng ĐÚNG '- AC-n: **(cross-layer)** …' vẫn nổ W4 khi thiếu cặp (không hồi quy)"
outL34="$(node "$LINT" "$T/lintE2" 2>&1)"; check L34 1 $?
case "$outL34" in *"(cross-layer)"*) echo "  PASS: L34-w4"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L34-w4"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

# ── NEG_RE biết từ vựng đối-chứng của kit ────────────────────────────────────
# Eval kiểu-detector viết theo nếp nhà khai ca should-not-fire bằng câu
# "đối chứng dương … xanh" (thước phải IM trên vật nguyên vẹn) — không có chữ
# "không/NOT/suppress" nào. NEG_RE cũ mù chữ đó nên W1 bắn giả trên hồ sơ thật
# (E2 context-ladder, lộ ra khi parseAC mở rộng vùng nhìn ở L30/L31).
# Hai chiều trên CÙNG fixture, chỉ khác đúng câu đối chứng — đổi được kết luận.
U="$T/lintU/_acceptance/feat-doichung"; mkdir -p "$U"
cat > "$U/contract.md" <<'EOF'
---
risk_tier: T2
status: approved
surfaces: [api]
---
## Criteria
- AC-1: Given SKILL, When kiểm luật, Then bắt buộc kèm ≥1 cảnh ngữ-cảnh.
## Out of scope
EOF
cat > "$U/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    expected: >
      mutation xoá luật → đỏ ghim thông điệp; đối chứng dương xanh trước.
EOF

echo "L35 expected khai ca âm bằng 'đối chứng dương xanh' -> W1 phải IM"
outL35="$(node "$LINT" "$T/lintU" 2>&1)"
case "$outL35" in *"W1 AC-1"*) echo "  FAIL: L35-negvocab (NEG_RE mù từ vựng đối-chứng của kit — W1 bắn giả)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: L35-negvocab"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac

echo "L35b gỡ câu đối chứng khỏi CÙNG fixture -> W1 nổ đúng AC-1 (phép đo còn răng)"
sed -i.bak 's/; đối chứng dương xanh trước\.//' "$U/evals.yaml" && rm -f "$U/evals.yaml.bak"
outL35b="$(node "$LINT" "$T/lintU" 2>&1)"; check L35b 1 $?
case "$outL35b" in *"W1 AC-1"*) echo "  PASS: L35b-w1"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L35b-w1 (gỡ đối chứng mà W1 vẫn im — từ vựng mới nuốt luôn ca thật)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

# ── W8a: feature chạm UI đã có đặc tả UX chưa (phạm vi THU 24/08) ────────────
# Cánh khớp-vòng (khai↔đo) và cánh đoán-chay đã CẮT — hạt giống riêng. Còn lại
# một câu hỏi trả lời bằng SỰ CÓ MẶT của vật. Fixture design-doc RÚT từ writer
# thật (ux-spec-template.md) qua marker; mọi ghim là NGUYÊN CÂU cảnh báo (không
# dùng mảnh chuỗi cũng xuất hiện trong dòng chú giải cuối — bài học r3/r4).
UXTPL="$HERE/../../skills/acceptance/references/ux-spec-template.md"
ux_section() { sed -n '/<<<UX-SPEC-TEMPLATE/,/UX-SPEC-TEMPLATE>>>/p' "$UXTPL" | sed -E 's/\{\{([^}]*)\}\}/\1/g'; }

mk_ux_fixture() { # <root> [surfaces] [design_doc-line]
  local d="$1/_acceptance/feat-ux"; mkdir -p "$d" "$1/docs"
  ux_section > "$1/docs/design.md"
  printf -- '---\nschema_version: 1\nfeature: feat-ux\nslug: feat-ux\nrisk_tier: T2\nsurfaces: [%s]\nstatus: approved\n%s---\n## Criteria\n- AC-1: Given a, When b, Then c.\n' \
    "${2:-ui}" "${3-design_doc: docs/design.md$'\n'}" > "$d/contract.md"
  printf 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "exit 0"\n' > "$d/evals.yaml"
}
ux_flags() { node "$LINT" "$1" 2>&1 | grep -E "^  \[feat-ux\] W8" || true; }
ux_case() { # <nhãn> <root> <quiet|nguyên-câu-ghim>
  local o; o="$(ux_flags "$2")"
  if [ "$3" = "quiet" ]; then
    if [ -z "$o" ]; then echo "  PASS: [W8A]-$1"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: [W8A]-$1 (kỳ vọng im, nhận: $o)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi
  else
    case "$o" in *"$3"*) echo "  PASS: [W8A]-$1"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: [W8A]-$1 (kỳ vọng ghim «$3», nhận: $o)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
  fi
}

echo "[W8A] MA TRẬN có-đặc-tả-UX — 7 ô, mỗi ô ghim NGUYÊN CÂU"
RUX1="$T/uxa1"; mk_ux_fixture "$RUX1"
ux_case "o1-lanh" "$RUX1" quiet
RUX2="$T/uxa2"; mk_ux_fixture "$RUX2" ui ""
ux_case "o2-chua-tro" "$RUX2" "W8a surfaces có ui nhưng contract chưa trỏ đặc tả UX"
RUX3="$T/uxa3"; mk_ux_fixture "$RUX3"; rm "$RUX3/docs/design.md"
ux_case "o3-con-tro-chet" "$RUX3" "W8a design_doc không đọc được: docs/design.md"
RUX4="$T/uxa4"; mk_ux_fixture "$RUX4" ui "design_doc: ../../../../etc/hosts
"
ux_case "o4-ngoai-cay" "$RUX4" "W8a design_doc trỏ ra ngoài cây repo"
RUX5="$T/uxa5"; mk_ux_fixture "$RUX5"; sed -i.bak 's/UX-STATE-TABLE/UX-XXX-TABLE/g' "$RUX5/docs/design.md" && rm -f "$RUX5/docs/design.md.bak"
ux_case "o5-thieu-marker" "$RUX5" "thiếu bảng UX-STATE-TABLE (marker)"
# o6 — ô NUỐT LUẬT (bài học r4): marker còn, bảng rỗng thì phải ĐỎ ĐƯỢC
RUX6="$T/uxa6"; mk_ux_fixture "$RUX6"; grep -v '^| ST-' "$RUX6/docs/design.md" > "$RUX6/docs/d2" && mv "$RUX6/docs/d2" "$RUX6/docs/design.md"
ux_case "o6-bang-rong" "$RUX6" "có bảng UX-STATE-TABLE nhưng KHÔNG dòng trạng thái nào"
# o7 — đọc-cũ: hồ sơ không opt-in thì im; thêm ui vào thì sống lại (chiều sống)
RUX7="$T/uxa7"; mk_ux_fixture "$RUX7" cli ""
ux_case "o7-doc-cu" "$RUX7" quiet
sed -i.bak 's/^surfaces: \[cli\]$/surfaces: [ui]/' "$RUX7/_acceptance/feat-ux/contract.md" && rm -f "$RUX7"/_acceptance/feat-ux/contract.md.bak
ux_case "o7-live" "$RUX7" "W8a surfaces có ui nhưng contract chưa trỏ đặc tả UX"
# o8 — hồ sơ ĐÃ KÝ miễn hồi tố, và chiều sống của miễn
RUX8="$T/uxa8"; mk_ux_fixture "$RUX8" ui ""
sed -i.bak 's/^status: approved$/status: signed-off/' "$RUX8/_acceptance/feat-ux/contract.md" && rm -f "$RUX8"/_acceptance/feat-ux/contract.md.bak
ux_case "o8-da-ky-mien" "$RUX8" quiet
sed -i.bak 's/^status: signed-off$/status: approved/' "$RUX8/_acceptance/feat-ux/contract.md" && rm -f "$RUX8"/_acceptance/feat-ux/contract.md.bak
ux_case "o8-live" "$RUX8" "W8a surfaces có ui nhưng contract chưa trỏ đặc tả UX"
# o9 — chế độ --files: sentinel root=null, KHÔNG dò tên slug
RUX9="$T/uxa9"; mk_ux_fixture "$RUX9"
outF="$(cd / && node "$LINT" --files "$RUX9/_acceptance/feat-ux/contract.md" "$RUX9/_acceptance/feat-ux/evals.yaml" 2>&1)"
case "$outF" in *"con trỏ đặc tả UX chết"*) echo "  FAIL: [W8A]-o9-files (phán bừa theo cwd)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: [W8A]-o9-files"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
case "$outF" in *"chế độ --files không có repo root"*) echo "  PASS: [W8A]-o9-note"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: [W8A]-o9-note (bỏ qua im lặng)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
RUXN2="$T/uxa10"; mkdir -p "$RUXN2/_acceptance/files" "$RUXN2/docs"; ux_section > "$RUXN2/docs/design.md"
printf -- '---\nslug: files\nrisk_tier: T2\nsurfaces: [ui]\nstatus: approved\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n' > "$RUXN2/_acceptance/files/contract.md"
printf 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n' > "$RUXN2/_acceptance/files/evals.yaml"
case "$(node "$LINT" "$RUXN2" 2>&1)" in *"chế độ --files"*) echo "  FAIL: [W8A]-o10-slug-files"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: [W8A]-o10-slug-files"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
case "$(node "$LINT" "$RUXN2" 2>&1)" in *"chưa trỏ đặc tả UX"*) echo "  PASS: [W8A]-o10-live"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: [W8A]-o10-live"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

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

# Nhánh PASS PHẢI tăng PASS_COUNT như check/same/hasout: bản cũ in PASS mà
# không đếm, nên dòng "Results: N passed" thiếu 41 case và không đối chiếu
# được với số dòng PASS thật. Không phải false-green (FAIL vẫn đếm và suite
# vẫn exit 1), nhưng một con số không đáng tin thì không dùng để kiểm chứng
# được việc gì cả.
nothas() { case "$3" in *"$2"*) echo "  FAIL: $1 (should NOT contain: $2)"; FAIL_COUNT=$((FAIL_COUNT+1));; *) echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1));; esac; }

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

# DSC01-03 (design-static-check --require-html) và SG1-4 (design-config-patch
# --surface-globs) đã ĐI THEO design-loop khi lưu kho (hồ sơ
# luu-kho-codex-va-nghi-le-design, Cổng 1 duyệt 2026-08-12). Bảy assert đó gọi
# THẲNG hai script trong design-loop/scripts/, nên chúng chết cùng thư mục ấy.
# Đây là lý do bảy assert rời khỏi bộ đếm của suite. Số CHỐT của cùng lượt sửa
# là 686 = 671 − 7 + 22 (AC-17/AC-19 thêm RS01–RS06 trong chính commit này) —
# con số khai TRƯỚC trong hợp đồng, ở khối máy-đọc `SO-CA-KY-VONG`.
# [SỬA SAU CỔNG 1 — 13/08, vòng sửa 2] Câu cũ ở đây ghi "671 xuống 664" và
# dừng lại ở đó, tức để một mẫu số CHẾT nằm ngay cạnh vết mổ (F13). Ai đọc chú
# thích này để tra đẳng thức sẽ lấy 664 rồi 'chữa' bản khai cho khớp — đúng lớp
# bên-viết-và-bên-đọc-trôi-khỏi-nhau mà bản khai máy-đọc sinh ra để chặn.

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
' "$ROOT_REAL_GC/lib/gap-probe.cjs" '{"id":"d-9","type":"descope","decision":"  Bỏ gap-probe — x"}')"

echo "TM1 term MỚI sau base -> khối Từ vựng nêu tên term"
hasout TM1 "Refund" "$TMA"
echo "TM2 repo không có CONTEXT.md -> KHÔNG có khối Từ vựng, không cờ"
nothas TM2 "Từ vựng" "$TMB"
echo "TM3 có CONTEXT.md nhưng thiếu --glossary-base -> KHÔNG cờ, không khối (lenh-in-ra-phai-bam-duoc AC-5: cờ này nói với agent, đã bỏ)"
nothas TM3 "glossary-base" "$TMC"
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

# EP11/EP12 — nhãn chen giữa id và dấu hai chấm. Khuôn cũ ở đây là bản sao HẸP
# NHẤT trong ba (bullet phải `-`, tách phải `:`), nên nó rụng cả hai nhà viết mà
# hợp đồng thật đang dùng. Hậu quả không phải cảnh báo thiếu mà là TRANG KÝ cụt:
# card in mỗi id trần, người ký Cổng 2 không thấy tiêu chí đòi gì.
echo "EP11 nhãn **(cross-layer)** chen giữa id và ':' -> text tiêu chí vẫn lên trang"
dxl="$EPR/_acceptance/epxl"; mkdir -p "$dxl"
printf -- '---\nfeature: EP xl\nslug: epxl\nrisk_tier: T3\n---\n## Criteria\n- AC-1 **(cross-layer)**: Given gio hang, Then charged via API.\n' > "$dxl/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: epxl\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n| Eval | Criterion | Executor | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | script | PASS |\n\n## Evidence\n- eval: E1\n  run_id: epxl-E1-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n' > "$dxl/evidence-report.md"
XLP="$(node "$EP" --root "$EPR" --slug epxl 2>/dev/null)"
hasout EP11 "charged via API" "$(cat "$XLP" 2>/dev/null)"

echo "EP12 chú thích *(sửa lời …)* chen giữa id và ':' -> text tiêu chí vẫn lên trang"
dam="$EPR/_acceptance/epam"; mkdir -p "$dam"
printf -- '---\nfeature: EP am\nslug: epam\nrisk_tier: T3\n---\n## Criteria\n- AC-1 *(sua loi 05/08 — xem Amendment)*: Given gio hang, Then refunded via API.\n' > "$dam/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: epam\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n| Eval | Criterion | Executor | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | script | PASS |\n\n## Evidence\n- eval: E1\n  run_id: epam-E1-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n' > "$dam/evidence-report.md"
AMP="$(node "$EP" --root "$EPR" --slug epam 2>/dev/null)"
hasout EP12 "refunded via API" "$(cat "$AMP" 2>/dev/null)"

echo "EP13 tag (judgment) vẫn bị gỡ khỏi text hiển thị (không hồi quy)"
dj="$EPR/_acceptance/epj"; mkdir -p "$dj"
printf -- '---\nfeature: EP j\nslug: epj\nrisk_tier: T3\n---\n## Criteria\n- AC-1: (judgment) Given phien dai dien, Then trai nghiem mach lac.\n' > "$dj/contract.md"
printf -- '---\nschema_version: 1\nfeature_slug: epj\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n| Eval | Criterion | Executor | Verdict |\n|--|--|--|--|\n| E1 | AC-1 | judgment | PASS |\n\n## Evidence\n- eval: E1\n  run_id: epj-E1-001\n  exit_code: 0\n  verifier: scripts/v.sh\n  verified_at: 2026-06-20\n' > "$dj/evidence-report.md"
JP="$(node "$EP" --root "$EPR" --slug epj 2>/dev/null)"
hasout EP13 "trai nghiem mach lac" "$(cat "$JP" 2>/dev/null)"
nothas EP13b "(judgment)" "$(cat "$JP" 2>/dev/null)"

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

# (18bbe72 — luật pin-phantom upstream từ artifact-platform) fixture này là
# clone ĐẦY ĐỦ nên pin không tồn tại = pin MA → VIOLATION ghim thông điệp;
# chỉ clone chứng-minh-được-là-nông mới còn NOTE. Đối chứng dương = VC03 ngay
# trên (cùng khuôn fixture, pin thật → exit 0).
echo "VC04 phantom pin trong clone đầy đủ -> VIOLATION ghim 'is a phantom' (hết NOTE câm)"
R="$T/vc04"; mk_git_repo "$R"; wr_report "$R" deadbeefdeadbeefdeadbeefdeadbeefdeadbeef
outV="$(bash "$CHECK" "$R" 2>&1)"; check VC04 1 $?
case "$outV" in *"is a phantom"*feat-vc*|*feat-vc*"is a phantom"*) echo "  PASS: VC04-phantom"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC04-phantom (expected VIOLATION ghim 'is a phantom')"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

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
echo "--- staleness theo diff PR (stale-theo-diff-pr: phạm vi theo slug_in_diff) ---"
# Fixture HỖN HỢP code-sinh tái hiện floorplanstudio (AC-5): 2 slug cũ
# signed-off tên xếp TRƯỚC theo alphabet + 1 slug mới trong diff PR. Mọi lần
# chạy đều qua `env -u PRE_MERGE_BASE` (gap-probe P2-3: env lọt làm ca no-base
# đổi nghĩa). Tham số: <newpin> clean|stale (pin của slug mới tại HEAD hay tại
# base), <fire> 0|1 (thêm feat-old-c chữ-ký-trống — đối chứng dương should-FIRE
# của B: slug ngoài diff mang lỗi KHÁC staleness vẫn phải nổ), <oldpin>
# real|phantom (feat-old-a ghim SHA ma — ca squash-merge floorplanstudio).
mk_mixed_repo() { # <root> <newpin> <fire> <oldpin>
  local R="$1" newpin="$2" fire="$3" oldpin="$4" olds s
  rm -rf "$R"; mkdir -p "$R/src" "$R/_acceptance"
  git init -q "$R"
  printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n' > "$R/_acceptance/config.yaml"
  printf 'code v1\n' > "$R/src/app.js"
  printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  olds="feat-old-a feat-old-b"; [ "$fire" = 1 ] && olds="$olds feat-old-c"
  for s in $olds; do
    mkdir -p "$R/_acceptance/$s"
    printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' "$s" "$s" > "$R/_acceptance/$s/contract.md"
  done
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c1-impl
  MIX_C1="$(git -C "$R" rev-parse HEAD)"
  for s in $olds; do
    local pin="$MIX_C1" sign="Manh 2026-08-01"
    [ "$s" = feat-old-a ] && [ "$oldpin" = phantom ] && pin="deadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
    [ "$s" = feat-old-c ] && sign=""   # chữ ký TRỐNG — luật khác staleness phải nổ (VC07-fire)
    printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nverified_commit: %s\nhuman_signoff: %s\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-01\n' "$s" "$pin" "$sign" "$s" > "$R/_acceptance/$s/evidence-report.md"
  done
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c2-evidence
  git -C "$R" branch basepoint
  MIX_BASE="$(git -C "$R" rev-parse HEAD)"
  mkdir -p "$R/_acceptance/feat-zz-new"
  printf -- '---\nschema_version: 1\nfeature: feat-zz-new\nslug: feat-zz-new\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\napproved_at: 2026-08-10\n---\n' > "$R/_acceptance/feat-zz-new/contract.md"
  printf 'code v2\n' > "$R/src/app.js"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c3-pr
  MIX_C3="$(git -C "$R" rev-parse HEAD)"
  local newvc="$MIX_C3"; [ "$newpin" = stale ] && newvc="$MIX_BASE"
  printf -- '---\nschema_version: 1\nfeature_slug: feat-zz-new\nverdict: PASS\nverified_commit: %s\nhuman_signoff: Manh 2026-08-10\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-zz-new-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-10\n' "$newvc" > "$R/_acceptance/feat-zz-new/evidence-report.md"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c4-evidence
}
STALE_NOTE="NOTE: staleness scope"

echo "VC07 hỗn hợp 2-cũ-ngoài-diff + 1-mới-sạch, --base -> exit 0, sử liệu im lặng, luật khác vẫn chạy"
R="$T/vc07"; mk_mixed_repo "$R" clean 0 real
out7="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check VC07 0 $?
hasout VC07-oka "OK [feat-old-a]" "$out7"
hasout VC07-okb "OK [feat-old-b]" "$out7"
hasout VC07-oknew "OK [feat-zz-new]" "$out7"
nothas VC07-nostale "evidence is stale" "$out7"
nothas VC07-nonote "$STALE_NOTE" "$out7"

echo "VC07-fire đối chứng dương: slug ngoài diff chữ-ký-trống -> luật signoff VẪN nổ (chỉ staleness bị thu phạm vi)"
R="$T/vc07f"; mk_mixed_repo "$R" clean 1 real
out7f="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check VC07-fire 1 $?
hasout VC07-fire-msg "human_signoff is empty" "$out7f"
hasout VC07-fire-slug "VIOLATION [feat-old-c]" "$out7f"
nothas VC07-fire-nostale "evidence is stale" "$out7f"

echo "VC08 slug MỚI trong diff bị stale -> đỏ đích danh slug mới, slug cũ vẫn OK trong CÙNG lần chạy"
R="$T/vc08"; mk_mixed_repo "$R" stale 0 real
out8="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check VC08 1 $?
hasout VC08-oka "OK [feat-old-a]" "$out8"
hasout VC08-okb "OK [feat-old-b]" "$out8"
case "$out8" in *"VIOLATION [feat-zz-new]: evidence is stale"*src/app.js*) echo "  PASS: VC08-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC08-msg (expected stale VIOLATION đích danh feat-zz-new + src/app.js)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
same VC08-stale-count 1 "$(printf '%s\n' "$out8" | grep -c 'evidence is stale')"

echo "VC09 hồ sơ CŨ bị chạm (vào diff) -> mất quyền im lặng, stale nổ lại"
R="$T/vc09"; mk_mixed_repo "$R" clean 0 real
printf 'ghi chú hậu kiểm\n' > "$R/_acceptance/feat-old-a/note.md"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c5-touch-old
out9="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check VC09 1 $?
case "$out9" in *"VIOLATION [feat-old-a]: evidence is stale"*) echo "  PASS: VC09-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC09-msg (expected stale VIOLATION trên feat-old-a bị chạm)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
hasout VC09-okb "OK [feat-old-b]" "$out9"

echo "VC10 không --base -> fallback kiểm TẤT như cũ + đúng MỘT dòng NOTE hằng"
R="$T/vc10"; mk_mixed_repo "$R" clean 0 real
out10="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" 2>&1)"; check VC10 1 $?
same VC10-stale-count 2 "$(printf '%s\n' "$out10" | grep -c 'evidence is stale')"
same VC10-note-count 1 "$(printf '%s\n' "$out10" | grep -cF "$STALE_NOTE")"

echo "VC10b base là orphan (diff KHÔNG dựng được dù --base có mặt) -> cùng màu fallback, không tắt im"
R="$T/vc10b"; mk_mixed_repo "$R" clean 0 real
# $GIT_ID bắt buộc: commit-tree đòi ident; CI không có user.email global nên
# thiếu nó là "empty ident name" → OB rỗng → base không resolve → exit 2 oan
# (đã cắn thật ở run 31383617449 — local xanh vì máy dev có identity).
OB="$(git $GIT_ID -C "$R" commit-tree "$(git -C "$R" mktree </dev/null)" -m orphan </dev/null)"
git -C "$R" branch orphanbase "$OB"
out10b="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base orphanbase 2>&1)"; check VC10b 1 $?
same VC10b-stale-count 2 "$(printf '%s\n' "$out10b" | grep -c 'evidence is stale')"
same VC10b-note-count 1 "$(printf '%s\n' "$out10b" | grep -cF "$STALE_NOTE")"

echo "VC11 mutant gỡ guard: control chép trọn scripts/+lib/ phải XANH trước, mutant xác-nhận-đột-biến rồi phải ĐỎ"
MUTD="$T/vc11-tool"; rm -rf "$MUTD"; mkdir -p "$MUTD"
cp -R "$HERE/../../scripts" "$MUTD/scripts"
cp -R "$HERE/../../lib" "$MUTD/lib"
R="$T/vc07"   # dùng lại fixture VC07 (clean) — control phải cùng kết cục với bản thật
outc="$(env -u PRE_MERGE_BASE bash "$MUTD/scripts/pre-merge-check.sh" "$R" --base basepoint 2>&1)"; check VC11-control 0 $?
nothas VC11-control-nofallback "not vendored" "$outc"
nothas VC11-control-nostale "evidence is stale" "$outc"
sed '/# STALE-DIFF-SCOPE-GUARD$/ s/.*/  if false; then # STALE-DIFF-SCOPE-GUARD/' "$MUTD/scripts/pre-merge-check.sh" > "$MUTD/scripts/pre-merge-check.mut" \
  && mv "$MUTD/scripts/pre-merge-check.mut" "$MUTD/scripts/pre-merge-check.sh"
# XÁC NHẬN đột biến đã áp TRƯỚC khi đọc kết quả (luật sổ vấp: mọi lượt phá vật
# phải in dấu hiệu xác nhận, không tin lệnh chạy trót lọt):
same VC11-mut-applied 1 "$(grep -c '^  if false; then # STALE-DIFF-SCOPE-GUARD$' "$MUTD/scripts/pre-merge-check.sh")"
outm="$(env -u PRE_MERGE_BASE bash "$MUTD/scripts/pre-merge-check.sh" "$R" --base basepoint 2>&1)"; check VC11-mutant 1 $?
case "$outm" in *"VIOLATION [feat-old-a]: evidence is stale"*) echo "  PASS: VC11-mutant-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC11-mutant-msg (mutant gỡ guard mà slug cũ không stale — ca không phân biệt được)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "VC12 pin MA trên sử liệu ngoài diff -> im lặng TRỌN khối; chạm hồ sơ -> phantom VIOLATION nổ lại"
R="$T/vc12"; mk_mixed_repo "$R" clean 0 phantom
out12="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check VC12 0 $?
nothas VC12-nophantom "is a phantom" "$out12"
printf 'ghi chú hậu kiểm\n' > "$R/_acceptance/feat-old-a/note.md"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c5-touch-phantom
out12b="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check VC12-touched 1 $?
case "$out12b" in *"VIOLATION [feat-old-a]"*"is a phantom"*|*"is a phantom"*"feat-old-a"*) echo "  PASS: VC12-touched-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: VC12-touched-msg (expected phantom VIOLATION đích danh feat-old-a khi hồ sơ vào diff)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo ""
echo "--- recheck theo diff PR (1.41.0: phạm vi theo slug_in_diff + cờ --recheck-all) ---"
# Fixture CODE-SINH tái hiện đúng ca đã cắn: một đợt đã merge gỡ một khoá
# `executors.script.*` khỏi config, và MỌI hồ sơ đã ký có eval trỏ khoá đó lập
# tức chặn mọi PR sau — dù không hồ sơ nào trong số đó nằm trong diff, và không
# hồ sơ nào sửa được mà không viết vào vật đã ký.
# Verifier của hai hồ sơ cũ là `config:executors.script.gone_key` — khoá KHÔNG
# có trong config, nên `recheck-evidence.cjs` đỏ đúng thông điệp thật
# ("config key not found or empty"), không phải một lỗi bịa cho dễ.
# Mọi lần chạy đều qua `env -u PRE_MERGE_BASE` (env lọt làm ca no-base đổi nghĩa).
mk_recheck_scope_repo() { # <root> <fire> — fire=1 thêm hồ sơ ngoài diff mang lỗi KHÁC
  local R="$1" fire="$2" olds s
  rm -rf "$R"; mkdir -p "$R/src" "$R/_acceptance"
  git init -q "$R"
  printf 'schema_version: 1\nrecheck: strict\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n' > "$R/_acceptance/config.yaml"
  printf 'code v1\n' > "$R/src/app.js"
  printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  olds="feat-old-a feat-old-b"; [ "$fire" = 1 ] && olds="$olds feat-old-c"
  for s in $olds; do
    mkdir -p "$R/_acceptance/$s"
    printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' "$s" "$s" > "$R/_acceptance/$s/contract.md"
  done
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c1-impl
  local C1; C1="$(git -C "$R" rev-parse HEAD)"
  for s in $olds; do
    local sign="Manh 2026-08-01"
    [ "$s" = feat-old-c ] && sign=""   # lỗi KHÁC recheck — đối chứng dương should-FIRE
    printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nverified_commit: %s\nhuman_signoff: %s\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: config:executors.script.gone_key\n  verified_at: 2026-08-01\n' "$s" "$C1" "$sign" "$s" > "$R/_acceptance/$s/evidence-report.md"
  done
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c2-evidence
  git -C "$R" branch basepoint
  mkdir -p "$R/_acceptance/feat-zz-new"
  printf -- '---\nschema_version: 1\nfeature: feat-zz-new\nslug: feat-zz-new\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\napproved_at: 2026-08-10\n---\n' > "$R/_acceptance/feat-zz-new/contract.md"
  # PR này CỐ Ý không đụng file nào ngoài `_acceptance/` — đụng thì hai hồ sơ cũ
  # (pin ở C1) thành STALE, luật staleness nổ TRƯỚC và `continue` trước khi tới
  # luật re-check, nên ca đo nhầm luật khác. Bản đầu của fixture này có
  # `code v2` và RS02/RS04 đỏ đúng vì lý do đó — giữ ghi chú để không ai thêm lại.
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c3-pr
  local C3; C3="$(git -C "$R" rev-parse HEAD)"
  printf -- '---\nschema_version: 1\nfeature_slug: feat-zz-new\nverdict: PASS\nverified_commit: %s\nhuman_signoff: Manh 2026-08-10\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-zz-new-E1-001\n  exit_code: 0\n  verifier: %s/verify.sh\n  verified_at: 2026-08-10\n' "$C3" "$R" > "$R/_acceptance/feat-zz-new/evidence-report.md"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c4-evidence
}
RS_SKIP_NOTE="slug ngoài diff PR không được re-check"
RS_FAIL_MSG="fails re-check"

echo "RS01 hai hồ sơ cũ hỏng-recheck NGOÀI diff + 1 hồ sơ mới sạch, --base -> exit 0"
R="$T/rs01"; mk_recheck_scope_repo "$R" 0
rs1="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check RS01 0 $?
hasout RS01-ok-a "OK [feat-old-a]" "$rs1"
hasout RS01-ok-new "OK [feat-zz-new]" "$rs1"
nothas RS01-norecheck "$RS_FAIL_MSG" "$rs1"
hasout RS01-note "$RS_SKIP_NOTE" "$rs1"

echo "RS02 KHÔNG --base -> fallback kiểm TẤT như cũ + đúng MỘT dòng NOTE hằng"
R="$T/rs02"; mk_recheck_scope_repo "$R" 0
rs2="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" 2>&1)"; check RS02 1 $?
same RS02-count 2 "$(printf '%s\n' "$rs2" | grep -c "$RS_FAIL_MSG")"
same RS02-note 1 "$(printf '%s\n' "$rs2" | grep -c 'recheck scope — no PR diff scope')"

echo "RS03 --recheck-all ép quét TOÀN BỘ dù có phạm vi diff (đường cứu cho thước-thôi-hồi-tố)"
R="$T/rs03"; mk_recheck_scope_repo "$R" 0
rs3="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint --recheck-all 2>&1)"; check RS03 1 $?
same RS03-count 2 "$(printf '%s\n' "$rs3" | grep -c "$RS_FAIL_MSG")"
hasout RS03-note "recheck scope — --recheck-all" "$rs3"

echo "RS04 hồ sơ CŨ bị chạm (vào diff) -> mất quyền im lặng, recheck nổ lại"
R="$T/rs04"; mk_recheck_scope_repo "$R" 0
printf 'ghi chú hậu kiểm\n' > "$R/_acceptance/feat-old-a/note.md"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c5-touch-old
rs4="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check RS04 1 $?
case "$rs4" in *"VIOLATION [feat-old-a]: committed evidence $RS_FAIL_MSG"*) echo "  PASS: RS04-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: RS04-msg (expected recheck VIOLATION đích danh feat-old-a khi hồ sơ vào diff)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
hasout RS04-ok-b "OK [feat-old-b]" "$rs4"

echo "RS05-fire đối chứng dương: hồ sơ ngoài diff mang lỗi KHÁC -> luật khác VẪN nổ (chỉ recheck bị thu)"
R="$T/rs05"; mk_recheck_scope_repo "$R" 1
rs5="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check RS05-fire 1 $?
hasout RS05-fire-msg "human_signoff is empty" "$rs5"
nothas RS05-fire-norecheck "$RS_FAIL_MSG" "$rs5"

echo "RS06 mutant gỡ guard: control chép trọn scripts/+lib/ phải XANH trước, mutant xác-nhận rồi phải ĐỎ"
MUTR="$T/rs06-tool"; rm -rf "$MUTR"; mkdir -p "$MUTR"
cp -R "$HERE/../../scripts" "$MUTR/scripts"
cp -R "$HERE/../../lib" "$MUTR/lib"
R="$T/rs01"   # dùng lại fixture RS01 (sạch) — control phải cùng kết cục với bản thật
rsc="$(env -u PRE_MERGE_BASE bash "$MUTR/scripts/pre-merge-check.sh" "$R" --base basepoint 2>&1)"; check RS06-control 0 $?
nothas RS06-control-norecheck "$RS_FAIL_MSG" "$rsc"
sed '/# RECHECK-DIFF-SCOPE-GUARD$/ s/.*/  if false; then # RECHECK-DIFF-SCOPE-GUARD/' "$MUTR/scripts/pre-merge-check.sh" > "$MUTR/scripts/pre-merge-check.mut" \
  && mv "$MUTR/scripts/pre-merge-check.mut" "$MUTR/scripts/pre-merge-check.sh"
# XÁC NHẬN đột biến đã áp TRƯỚC khi đọc kết quả (luật sổ vấp: mọi lượt phá vật
# phải in dấu hiệu xác nhận, không tin lệnh chạy trót lọt):
same RS06-mut-applied 1 "$(grep -c '^  if false; then # RECHECK-DIFF-SCOPE-GUARD$' "$MUTR/scripts/pre-merge-check.sh")"
rsm="$(env -u PRE_MERGE_BASE bash "$MUTR/scripts/pre-merge-check.sh" "$R" --base basepoint 2>&1)"; check RS06-mutant 1 $?
case "$rsm" in *"VIOLATION [feat-old-a]: committed evidence $RS_FAIL_MSG"*) echo "  PASS: RS06-mutant-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: RS06-mutant-msg (mutant gỡ guard mà hồ sơ cũ không đỏ — ca không phân biệt được)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

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
echo "--- chữ ký Cổng 2: khoá cũ hết hiệu lực + làn V ở luật Gate-1 (ADR 0012) ---"
# Từ hồ sơ cong-chan-nham-cho (16/08): lớp CHỨNG-MINH-chữ-ký-bằng-commit đã gỡ.
# H01–H07 giữ nguyên FIXTURE nhưng đổi KỲ VỌNG: mọi hình dạng commit đều clean,
# và khoá cũ trong config chỉ đổi lấy MỘT dòng NOTE hết-hiệu-lực. Răng NỘI DUNG
# chữ ký (giữ-chỗ) không nằm ở đây — nó ở UJ3, và vẫn đỏ.
LEGACY_NOTE="hết hiệu lực từ 2.1"
mk_hs() { # <root> <config signoff block (may be empty)> [signoff value in FIRST commit]
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
hs_note() { # <nhãn> <output> <expect-note: 1|0>
  case "$2" in
    *"$LEGACY_NOTE"*) if [ "$3" = 1 ]; then echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: $1 (NOTE hết-hiệu-lực in ra dù config KHÔNG khai khoá cũ)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi ;;
    *) if [ "$3" = 0 ]; then echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: $1 (thiếu NOTE hết-hiệu-lực cho config còn khai khoá cũ)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi ;;
  esac
}

echo "H01 không khai khoá + chữ ký sinh cùng commit với báo cáo -> clean, KHÔNG NOTE"
R="$T/h01"; mk_hs "$R" "" "Manh 2026-07-02"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H01 0 $?
hs_note H01-note "$outH" 0

echo "H02 khoá cũ ON + chữ ký ở commit riêng -> clean + NOTE hết-hiệu-lực"
R="$T/h02"; mk_hs "$R" "$(printf 'signoff:\n  require_human_commit: true')"
hs_sign "$R"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H02 0 $?
hs_note H02-note "$outH" 1

echo "H03 khoá cũ ON + chữ ký CÙNG commit với thân báo cáo -> clean (trước 2.1: VIOLATION)"
R="$T/h03"; mk_hs "$R" "$(printf 'signoff:\n  require_human_commit: true')" "Manh 2026-07-02"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H03 0 $?
hs_note H03-note "$outH" 1

echo "H04 khoá cũ ON + chữ ký chỉ có ở cây làm việc (chưa commit) -> clean"
R="$T/h04"; mk_hs "$R" "$(printf 'signoff:\n  require_human_commit: true')"
sed -i.bak 's/^human_signoff:$/human_signoff: Manh 2026-07-02/' "$R/_acceptance/feat-hs/evidence-report.md" && rm -f "$R/_acceptance/feat-hs/evidence-report.md.bak"
bash "$CHECK" "$R" >/dev/null 2>&1; check H04 0 $?

echo "H05 commit Gate-2 điền cả human_override và nâng verdict -> clean"
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

echo "H06 agent_authors khớp author của commit chữ ký -> clean + NOTE (khoá đã chết)"
R="$T/h06"; mk_hs "$R" "$(printf 'signoff:\n  agent_authors:\n    - "*bot*"')"
hs_sign "$R" "claude-bot@agents.local"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H06 0 $?
hs_note H06-note "$outH" 1

echo "H07 khoá cũ ON nhưng không phải git repo -> clean + NOTE hết-hiệu-lực (thôi nói 'unverifiable')"
R="$T/h07"; d7="$R/_acceptance/feat-hs"; mkdir -p "$d7"
printf 'schema_version: 1\nsignoff:\n  require_human_commit: true\n' > "$R/_acceptance/config.yaml"
printf -- '---\nschema_version: 1\nfeature: feat-hs\nslug: feat-hs\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n' > "$d7/contract.md"
v7="$R/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v7"
printf -- '---\nschema_version: 1\nfeature_slug: feat-hs\nverdict: PASS\nhuman_signoff: Manh 2026-07-02\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-hs-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-07-02\n' "$v7" > "$d7/evidence-report.md"
outH="$(bash "$CHECK" "$R" 2>&1)"; check H07 0 $?
hs_note H07-note "$outH" 1

echo ""
echo "--- làn V ở luật Gate-1 của lưới trước-merge (V01–V05) ---"
# Hook ghi-lúc-viết cho làn V đi từ đợt 2; lưới biên merge phải hiểu ĐÚNG như
# thế. Cửa mở khi ĐỦ: veto_state=mo · vết giờ parse được · T2 · VÀ (xanh-sạch
# HOẶC đã ký). Vế cuối là QUAN HỆ — `mo` gõ tay lên hồ sơ không sạch mà chưa ai
# ký thì vẫn chặn (gap-probe P0 của hồ sơ cong-chan-nham-cho).
mk_v() { # <root> <tier> <veto_opened_at> <có khoá veto_state? 1|0> <sạch? 1|0> <chữ ký>
  local R="$1" tier="$2" vat="$3" hasv="$4" clean="$5" sig="$6"
  local d="$R/_acceptance/feat-v"; mkdir -p "$d" "$R/lib"
  printf 'schema_version: 1\nsignoff:\n  required_for: [T2, T3]\n' > "$R/_acceptance/config.yaml"
  cp "$HERE/../../lib/md-section.cjs" "$R/lib/" 2>/dev/null || true
  git -C "$R" init -q
  { printf -- '---\nschema_version: 1\nfeature: feat-v\nslug: feat-v\nrisk_tier: %s\nsurfaces: [api]\nstatus: verified\napproved_by:\n' "$tier"
    [ "$hasv" = 1 ] && printf 'veto_state: mo\nveto_opened_at:%s\n' "${vat:+ $vat}"
    printf -- '---\n'; } > "$d/contract.md"
  printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  { printf -- '---\nschema_version: 1\nfeature_slug: feat-v\nverdict: PASS\nhuman_signoff:%s\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-v-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-16\n\n## Known limits\n' "${sig:+ $sig}"
    [ "$clean" = 1 ] || printf '\n- một giới hạn thật, nên hồ sơ này KHÔNG xanh-sạch\n'
    printf '\n## Ngoài hợp đồng\n'; } > "$d/evidence-report.md"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm base
}
v_msg() { # <nhãn> <output> <chuỗi phải có>
  case "$2" in *"$3"*) echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1)) ;;
    *) echo "  FAIL: $1 (thiếu thông điệp: $3)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
}

echo "V01 T2 + mo + vết hợp lệ + bằng chứng xanh-sạch -> NOTE làn V, clean"
R="$T/v01"; mk_v "$R" T2 "2026-08-16T09:00:00Z" 1 1 ""
outV="$(bash "$CHECK" "$R" 2>&1)"; check V01 0 $?
v_msg V01-note "$outV" "làn V — máy đi trước"

echo "V02 T3 + mo -> VIOLATION (làn V chỉ T2)"
R="$T/v02"; mk_v "$R" T3 "2026-08-16T09:00:00Z" 1 1 ""
outV="$(bash "$CHECK" "$R" 2>&1)"; check V02 1 $?
v_msg V02-msg "$outV" "làn V chỉ T2"

echo "V03 mo + veto_opened_at rỗng -> VIOLATION (vết không đọc được)"
R="$T/v03"; mk_v "$R" T2 "" 1 1 ""
outV="$(bash "$CHECK" "$R" 2>&1)"; check V03 1 $?
v_msg V03-msg "$outV" "veto_opened_at"

echo "V04 mo + T2 + vết OK nhưng KHÔNG xanh-sạch và chưa ký -> VIOLATION (quan hệ, không phải nhãn)"
R="$T/v04"; mk_v "$R" T2 "2026-08-16T09:00:00Z" 1 0 ""
outV="$(bash "$CHECK" "$R" 2>&1)"; check V04 1 $?
v_msg V04-msg "$outV" "làn V đòi xanh-sạch hoặc chữ ký"

echo "V04b giữ-gân: cùng hồ sơ KHÔNG sạch nhưng ĐÃ ký -> NOTE làn V, clean"
R="$T/v04b"; mk_v "$R" T2 "2026-08-16T09:00:00Z" 1 0 "Manh Phan 2026-08-16"
outV="$(bash "$CHECK" "$R" 2>&1)"; check V04b 0 $?
v_msg V04b-note "$outV" "làn V — máy đi trước"

echo "V05 vắng khoá veto_state -> VIOLATION nguyên văn luật cũ (đối chứng)"
R="$T/v05"; mk_v "$R" T2 "" 0 1 ""
outV="$(bash "$CHECK" "$R" 2>&1)"; check V05 1 $?
v_msg V05-msg "$outV" "gate1_skipped is not true"

echo "V06 chữ ký mới xuất hiện trong diff PR -> NOTE chiều-ghi (lưới thay lớp 2)"
R="$T/v06"; mk_v "$R" T2 "2026-08-16T09:00:00Z" 1 1 ""
sed -i.bak 's/^approved_by:$/approved_by: Manh Phan/' "$R/_acceptance/feat-v/contract.md" && rm -f "$R/_acceptance/feat-v/contract.md.bak"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm approve
VBASE="$(git -C "$R" rev-parse HEAD)"
sed -i.bak 's/^human_signoff:$/human_signoff: Manh Phan 2026-08-16/' "$R/_acceptance/feat-v/evidence-report.md" && rm -f "$R/_acceptance/feat-v/evidence-report.md.bak"
printf -- '\n(thân báo cáo đổi CÙNG commit với chữ ký — nghi thức cũ sẽ chặn)\n' >> "$R/_acceptance/feat-v/evidence-report.md"
git -C "$R" add -A >/dev/null && git -c user.email=bot@x -c user.name=bot -c commit.gpgsign=false -C "$R" commit -qm "sign+body"
outV="$(bash "$CHECK" "$R" --base "$VBASE" 2>&1)"; check V06 0 $?
v_msg V06-note "$outV" "chữ ký mới trong diff"

echo "V07 hồ sơ đã ký từ BASE -> KHÔNG in NOTE chiều-ghi (chỉ nói khi chữ ký MỚI)"
R="$T/v07"; mk_v "$R" T2 "2026-08-16T09:00:00Z" 1 1 "Manh Phan 2026-08-16"
sed -i.bak 's/^approved_by:$/approved_by: Manh Phan/' "$R/_acceptance/feat-v/contract.md" && rm -f "$R/_acceptance/feat-v/contract.md.bak"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm approve
VBASE="$(git -C "$R" rev-parse HEAD)"
printf 'x\n' > "$R/_acceptance/feat-v/notes.txt"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm noise
outV="$(bash "$CHECK" "$R" --base "$VBASE" 2>&1)"; check V07 0 $?
case "$outV" in *"chữ ký mới trong diff"*) echo "  FAIL: V07-quiet (in NOTE chiều-ghi cho chữ ký đã có từ BASE)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;;
  *) echo "  PASS: V07-quiet"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac

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

# B02 đổi thước có hợp đồng (hồ sơ status-chua-arm-cong, 18/08): PR đổi code
# t3 kèm một hồ sơ DRAFT — răng T1-escape vẫn thoả (không VIOLATION [PR]),
# nhưng hồ sơ ấy chưa arm nên không luật nào chấm code đó: đúng lỗ vòng 4
# release-2-2-0. Nay per-slug nổ «chưa arm cổng», exit 1.
echo "B02 PR touches t3 path AND carries a DRAFT _acceptance/<slug>/ -> T1-escape satisfied, but slug chưa arm cổng -> exit 1"
R="$T/b02"; mk_pr "$R"; BASE="$(git -C "$R" rev-parse HEAD)"
printf 'charge()\n' > "$R/src/billing/charge.js"
mkdir -p "$R/_acceptance/billing-fix"
printf -- '---\nschema_version: 1\nfeature: billing fix\nslug: billing-fix\nrisk_tier: T3\nsurfaces: [api]\nstatus: draft\napproved_by:\n---\n' > "$R/_acceptance/billing-fix/contract.md"
git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
outB2="$(bash "$CHECK" "$R" --base "$BASE" 2>&1)"; check B02 1 $?
case "$outB2" in *"VIOLATION [PR]"*) echo "  FAIL: B02-t1 (T1-escape phải vẫn thoả)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: B02-t1"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
case "$outB2" in *"[billing-fix]: hồ sơ có bằng chứng nhưng status chưa arm cổng"*"src/billing/charge.js"*) echo "  PASS: B02-arm"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: B02-arm (expected chưa arm cổng nêu tên file t3)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

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
' "$HERE/../../lib/evidence-core.cjs" "$R/_acceptance/config.yaml"; check CP01-resolve 0 $?

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
' "$HERE/../../lib/evidence-core.cjs" "$R/_acceptance/config.yaml"; check CP04-resolve 0 $?

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

# Mọi *.test.mjs trong thư mục này PHẢI chạy — file test không được wire là
# test không sống (S4-r1 phát hiện md-section.test.mjs chưa từng chạy trong CI).
# Dùng `check` (bộ đếm THẬT của runner này) — `pass`/`fail` chỉ tồn tại ở
# tests/plugins/run-tests.sh; gọi nhầm chúng ở đây làm test đỏ vẫn cho suite
# exit 0 (S4-r2 bắt: vá "test không chạy" bằng lỗ "verdict bị vứt").
_MJS_SEEN=0
for _f in "$HERE"/*.test.mjs; do
  [ -e "$_f" ] || continue
  case "$_f" in */wf-usage.test.mjs) continue;; esac
  _MJS_SEEN=$((_MJS_SEEN+1))
  echo "=== $(basename "$_f") ==="
  # BẮT rc VÀO BIẾN TRƯỚC. Bản cũ viết `node "$_f"; check "$(basename "$_f")" 0 $?`
  # — bash khai triển đối số TRƯỚC khi gọi `check`, nên `$(basename ...)` chạy
  # trước và GHI ĐÈ `$?` bằng mã thoát của `basename` (luôn 0). Hệ quả: MỌI
  # *.test.mjs đỏ vẫn được ghi PASS, suite in "0 failed" và thoát 0. Đo tại chỗ
  # 2026-08-13: `core-untouched.test.mjs` đỏ từ trước mà suite vẫn xanh trọn.
  # Đúng lớp runner-nuốt-mã-thoát đã ghi sổ, lần này ở tests/scripts.
  node "$_f"; _mjs_rc=$?
  _mjs_name="$(basename "$_f")"
  check "$_mjs_name" 0 "$_mjs_rc"
done
# 0 hit chính là chế độ hỏng đã xảy ra một lần — phải ĐỎ, không im lặng.
check "co it nhat mot *.test.mjs duoc chay" 1 "$([ "$_MJS_SEEN" -ge 1 ] && echo 1 || echo 0)"
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
  # Message MANG TÊN CASE là chống-chớp-tắt, không phải trang trí. Trước đây mọi
  # fixture có CÙNG cây + CÙNG author + CÙNG message "base", nên sha base chỉ còn
  # phụ thuộc dấu-thời-gian-giây: các repo dựng trong cùng MỘT giây ra sha Y HỆT
  # (đo được: ba lần gọi liên tiếp cho cùng một sha). Hệ quả: một case lỡ đưa
  # GP_BASE của repo KHÁC cho pre-merge-check vẫn XANH, và chỉ ĐỎ khi hai lần
  # commit rơi qua ranh giới giây — TE5 từng sống đúng kiểu đó (~2/8 lần chạy,
  # exit 2 "base không resolve" + mất hết message per-slug). Ghim base riêng cho
  # từng repo ở call-site (TE4_B/TE5_B...) chỉ vá TỪNG chỗ; sha riêng từng
  # fixture vá cả LỚP — xem GPB1 ngay dưới.
  git -c user.email=t@t -c user.name=t -C "$R" commit -qm "base $1"
  GP_BASE="$(git -C "$R" rev-parse --quiet --verify 'HEAD^{commit}' 2>/dev/null || true)"
  # Fail-loud: git init/commit hỏng thì GP_BASE rỗng, và mọi case downstream đỏ
  # bằng "base không resolve" — một triệu chứng ở RẤT XA nguyên nhân. Chết ngay
  # tại chỗ, nêu đúng fixture nào, thay vì để cả suite đoán.
  [ -n "$GP_BASE" ] || { echo "FATAL: mk_gp_repo $1 — không tạo được base commit trong $R" >&2; exit 1; }
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

# ── GPB: hợp đồng của chính mk_gp_repo ─────────────────────────────────────
# Cả rừng case GPM*/TE*/RL* dưới đây đứng trên một giả định chưa từng ai ghim:
# sha base của fixture này KHÔNG dùng được cho fixture kia. Ngày giả định đó sai
# (mọi base commit y hệt nhau), lỗi lẫn-repo ở TE5 sống 100% số lần chạy mà chỉ
# lộ ~1/4. Ghim luôn cái giả định — đây là thước gắn vào chính con dao dựng
# fixture, không phải vào một case dùng nó.
echo "GPB1 mk_gp_repo: moi fixture MOT sha base rieng, khong dung cheo duoc"
mk_gp_repo gpb1a; GPB1A="$GP_BASE"
mk_gp_repo gpb1b; GPB1B="$GP_BASE"
[ -n "$GPB1A" ] && [ -n "$GPB1B" ]; check GPB1a 0 $?
[ "$GPB1A" != "$GPB1B" ]; check GPB1b 0 $?
# ĐỐI CHỨNG DƯƠNG: sha của chính nó PHẢI resolve trong repo của nó — nếu không,
# GPB1d dưới xanh vì "chẳng sha nào resolve" chứ không vì tính riêng biệt.
git -C "$GPR/gpb1a" rev-parse --quiet --verify "$GPB1A^{commit}" >/dev/null 2>&1; check GPB1c 0 $?
# ...và sha của repo KIA thì KHÔNG. Đây mới là thứ khiến lỗi lẫn-repo đỏ 100%.
git -C "$GPR/gpb1a" rev-parse --quiet --verify "$GPB1B^{commit}" >/dev/null 2>&1; check GPB1d 1 $?

echo "GPB2 mk_gp_repo fail-loud: khong dung duoc repo -> FATAL + exit ngay tai cho"
GPB2OUT="$(GPR="/dev/null/khong-the-tao"; mk_gp_repo gpb2 2>&1)"; GPB2ST=$?
check  GPB2a 1 "$GPB2ST"
hasout GPB2b "FATAL: mk_gp_repo gpb2" "$GPB2OUT"

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
  lib="$(node "$ROOT_REAL/lib/gap-probe.cjs" classify "$R/_acceptance/feat-p" | cut -f1)"
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

echo "GPM18 thieu lib/gap-probe.cjs -> required CHAN, advisory chi NOTE"
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

# ── GPM20: bảng đầu vào chạy thẳng vào lib/gap-probe.cjs ─────────────────────
# Đo CHÍNH mã sản phẩm, không chép luật sang test. GPM16 của v2 xanh giả vì
# chép regex; đây là cùng bài học, áp ở tầng lib.
GPLIB="$ROOT_REAL/lib/gap-probe.cjs"
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
mk_gp_repo te4; R="$GPR/te4"; TE4_B="$GP_BASE"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
gp_feature "$R" feat-z T3 implemented; gp_commit "$R"
TE4="$(bash "$CHECK" "$R" --base "$TE4_B" --no-t1-escape 2>&1)"; TE4ST=$?
hasout TE4  "chưa qua phản biện context sạch" "$TE4"
check  TE4b 1 "$TE4ST"
# DOI CHUNG DUONG (no #2 handoff 2026-07-26): cung fixture nhung DA co
# gap-probe.md hop le -> voi CUNG co --no-t1-escape van exit 0. Thieu no, TE4
# chi chung minh "co violation nao do" chu khong phai luat gap-probe — dung
# lop bat bien #4 CLAUDE.md.
mk_gp_repo te4ok; ROK4="$GPR/te4ok"; TE4OK_B="$GP_BASE"
printf 'gap_probe: required\n' >> "$ROK4/_acceptance/config.yaml"
gp_feature "$ROK4" feat-z T3 implemented
printf -- '---\nslug: feat-z\nat: 2026-07-26T00:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\nKhông còn lỗ đáng kể.\n' > "$ROK4/_acceptance/feat-z/gap-probe.md"
gp_commit "$ROK4"
TE4OK="$(bash "$CHECK" "$ROK4" --base "$TE4OK_B" --no-t1-escape 2>&1)"; check TE4ctrl 0 $?
nothas TE4ctrl2 "chưa qua phản biện context sạch" "$TE4OK"

echo "TE5 co co van KHONG tat luat per-slug (chu ky)"
mk_gp_repo te5; R="$GPR/te5"; TE5_B="$GP_BASE"
gp_feature "$R" feat-y T3 implemented
sed -i.bak 's/^human_signoff:.*/human_signoff:/' "$R/_acceptance/feat-y/evidence-report.md" && rm -f "$R/_acceptance/feat-y/evidence-report.md.bak"
gp_commit "$R"
# DOI CHUNG DUONG truoc: fixture chua go chu ky phai XANH, neu khong TE5 chi
# chung minh "co violation nao do" chu khong phai luat chu ky. Bat bien #4.
# GHIM BASE RIENG cho tung repo: mk_gp_repo GHI DE GP_BASE, nen dung GP_BASE
# cua te5ok cho repo te5 la sai — no chi xanh khi hai repo tao trong CUNG mot
# giay (tree y het + timestamp trung -> sha trung). Lech giay thi base khong
# resolve, script exit 2 o VIOLATION [scope], va TE5a "expected 1 got 2".
mk_gp_repo te5ok; ROK="$GPR/te5ok"; TE5OK_B="$GP_BASE"
gp_feature "$ROK" feat-y T3 implemented; gp_commit "$ROK"
TE5OK="$(bash "$CHECK" "$ROK" --base "$TE5OK_B" --no-t1-escape 2>&1)"; check TE5ctrl 0 $?
TE5="$(bash "$CHECK" "$R" --base "$TE5_B" --no-t1-escape 2>&1)"; TE5ST=$?
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
# TE16c ĐẢO CHIỀU theo hợp đồng stale-theo-diff-pr (1.39.2, Cổng 1 ký
# 2026-08-10): fixture này CHÍNH LÀ ca chặn-vì-lịch-sử — feat-done đã
# signed-off, commit hạ tầng không chạm hồ sơ nó, nên trước 1.39.2 dòng stale
# của nó là "violation còn lại được nêu tên" (AC-17 hồ sơ t1-escape-event-scope)
# nhưng nay sử liệu ngoài diff im lặng THEO THIẾT KẾ (AC-2 hồ sơ mới; VC07/VC12
# ghim chiều im lặng, VC09 ghim chiều chạm-là-nổ-lại). Vế "tắt răng phải kêu
# to" của AC-17 vẫn được giữ nguyên bằng assert declared-off ngay dưới.
nothas TE16c "evidence is stale" "$TE16_ON"
hasout TE16c2 "T1-ESCAPE: NOT ENFORCED" "$TE16_ON"
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
# Ghim thong diep (bat bien #4): exit 2 mot minh khong phan biet duoc "chot -*
# cua --slug bat dung" voi cac duong exit 2 khac (unexpected argument, root
# not a directory...). Case duy nhat cua khoi nay tung thieu pin — review
# round 7 premerge-rules-ledger bat.
hasout TE18i2 "--slug requires a value (got option --base)" "$TE18I"
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
hasout RL1f "pre-merge-check: rules ran=4 declared-off=0 expected=4" "$RL1"
# RL3c (âm, AC-3): luật KHÔNG tắt thì KHÔNG được có dòng declared-off nào
same RL3c 0 "$(printf '%s\n' "$RL1" | grep -c '^declared-off ')"

echo "RL3a co --no-t1-escape -> dong so NGUYEN VAN 'declared-off t1-escape'"
rl_repo rl3a
RL3A="$(bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1)"; check RL3a1 0 $?
same RL3a2 1 "$(printf '%s\n' "$RL3A" | grep -cx 'declared-off t1-escape')"
same RL3a3 0 "$(printf '%s\n' "$RL3A" | grep -cx 'ran t1-escape')"
hasout RL3a4 "pre-merge-check: rules ran=3 declared-off=1 expected=4" "$RL3A"
hasout RL3a5 "pre-merge-check: clean" "$RL3A"

echo "RL3b gap_probe: off trong config -> 'declared-off gap-probe'"
rl_repo rl3b
printf 'gap_probe: off\n' >> "$TE_R/_acceptance/config.yaml"
git -C "$TE_R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm cfg
RL3B="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL3b1 0 $?
same RL3b2 1 "$(printf '%s\n' "$RL3B" | grep -cx 'declared-off gap-probe')"
same RL3b3 0 "$(printf '%s\n' "$RL3B" | grep -cx 'ran gap-probe')"
hasout RL3b4 "pre-merge-check: rules ran=3 declared-off=1 expected=4" "$RL3B"
hasout RL3b5 "pre-merge-check: clean" "$RL3B"

echo "RL4 khong --base + advisory -> exit Y HET TE18k, so khop qua marker"
rl_repo rl4
RL4="$(bash "$CHECK" "$TE_R" 2>&1)"; check RL4a 0 $?
same RL4b 1 "$(printf '%s\n' "$RL4" | grep -cx 'declared-off gap-probe')"
same RL4c 1 "$(printf '%s\n' "$RL4" | grep -cx 'declared-off t1-escape')"
same RL4d 1 "$(printf '%s\n' "$RL4" | grep -cx 'ran per-slug')"
hasout RL4e "pre-merge-check: rules ran=2 declared-off=2 expected=4" "$RL4"
hasout RL4f "pre-merge-check: clean" "$RL4"

# Ghi chú tiêm tự-tố-cáo: nếu pattern awk/sed không khớp (nguồn trôi), bản sao
# y hệt bản gốc -> case expect exit 2 FAIL (got 0) — không có đường xanh giả.
#
# Bản sao PHẢI giữ nguyên layout `scripts/` cạnh `lib/`: script resolve
# GP_LIB bằng `$(dirname $0)/../lib/gap-probe.cjs`, nên copy vào $T phẳng làm
# luật gap-probe rơi vào nhánh not-enforced — bản sao "nguyên vẹn" đã lệch
# sẵn và mọi kết luận từ nó là kết luận về một script KHÁC. Đối chứng dương
# RL2ctrl2 chính là thứ bắt được điều đó.
RLCP="$T/rlcp"; mkdir -p "$RLCP/scripts"
cp -R "$ROOT_REAL/lib" "$RLCP/lib"

echo "RL2 tiem vo hieu khoi gap-probe -> VIOLATION [ledger] dich danh, exit 2"
mk_gp_repo rl2; R="$GPR/rl2"; gp_feature "$R" feat-rl2 T3 implemented; gp_commit "$R"
RL2CP="$RLCP/scripts/rl2-check.sh"; cp "$CHECK" "$RL2CP"
RL2OK="$(bash "$RL2CP" "$R" --base "$GP_BASE" 2>&1)"; check RL2ctrl 0 $?
same RL2ctrl2 1 "$(printf '%s\n' "$RL2OK" | grep -cx 'ran gap-probe')"
awk '
  /Gap-probe presence/ { hdr=1 }
  hdr && /if \[ "\$GAP_PROBE_MODE" != "off" \] && slug_in_diff/ && !done { sub(/if .*then/, "if false; then"); done=1 }
  { print }
' "$CHECK" > "$RL2CP"
RL2OUT="$(bash "$RL2CP" "$R" --base "$GP_BASE" 2>&1)"; RL2ST=$?
check  RL2a 2 "$RL2ST"
nothas RL2b "pre-merge-check: clean" "$RL2OUT"
hasout RL2c "VIOLATION [ledger]: luật gap-probe không chạy và không khai tắt" "$RL2OUT"
hasout RL2d "lỗi NỘI TẠI của cổng pre-merge" "$RL2OUT"
# RL5c: lan VIOLATION [ledger] VAN in dong tong ket, va n+m != k la bang chung
hasout RL5c "pre-merge-check: rules ran=3 declared-off=0 expected=4" "$RL2OUT"

echo "RL9 tiem pha vong per-slug (bien the CHUA TUNG va) -> diem nghen bat"
mk_gp_repo rl9; R="$GPR/rl9"; gp_feature "$R" feat-rl9 T3 implemented; gp_commit "$R"
RL9CP="$RLCP/scripts/rl9-check.sh"; cp "$CHECK" "$RL9CP"
RL9OK="$(bash "$RL9CP" "$R" --base "$GP_BASE" 2>&1)"; check RL9ctrl 0 $?
sed 's|^for dir in "\$ACC"/\*/; do$|for dir in "$ACC"/khong-ton-tai-*/; do|' "$CHECK" > "$RL9CP"
RL9OUT="$(bash "$RL9CP" "$R" --base "$GP_BASE" 2>&1)"; RL9ST=$?
check  RL9a 2 "$RL9ST"
nothas RL9b "pre-merge-check: clean" "$RL9OUT"
hasout RL9c "VIOLATION [ledger]: luật per-slug không chạy và không khai tắt" "$RL9OUT"

echo "RL7b ghi so mot ten KHONG co trong EXPECTED -> ten la, exit 2"
rl_repo rl7
RL7CP="$RLCP/scripts/rl7-check.sh"; cp "$CHECK" "$RL7CP"
RL7OK="$(bash "$RL7CP" "$TE_R" --base "$TE_B" 2>&1)"; check RL7ctrl 0 $?
sed 's|^REQUIRED_FOR="T2 T3"$|REQUIRED_FOR="T2 T3"\nledger_mark ran khoi-la|' "$CHECK" > "$RL7CP"
RL7OUT="$(bash "$RL7CP" "$TE_R" --base "$TE_B" 2>&1)"; RL7ST=$?
check  RL7b1 2 "$RL7ST"
hasout RL7b2 "VIOLATION [ledger]: tên lạ khoi-la — cập nhật EXPECTED" "$RL7OUT"
hasout RL7b3 "pre-merge-check: rules ran=5 declared-off=0 expected=4" "$RL7OUT"
nothas RL7b4 "pre-merge-check: clean" "$RL7OUT"

echo "RL5b exit 2 o parse -> KHONG in dong tong ket so"
RL5B="$(bash "$CHECK" "$TE_R" --tuy-chon-la 2>&1)"; check RL5b1 2 $?
nothas RL5b2 "pre-merge-check: rules ran=" "$RL5B"
# Pin thong diep (bat bien #4 — review round 8): khong pin thi case nay khong
# phan biet duoc "chot co-la bat dung" voi bat ky duong exit-2 nao khac.
hasout RL5bmsg "unknown option --tuy-chon-la" "$RL5B"

# ── RL14: gia tri PHAM VI rong = loi to, khong phai skip im (nợ chip 33ca1add)
# Lop loi: operator DA khai pham vi (co --base/--slug/PRE_MERGE_BASE) nhung gia
# tri rong — kieu CI `--base "$VAR"` voi VAR unset, hoac $(rev-parse) chet trong
# command substitution. Ban cu roi ve nhanh "no PR base given": gap-probe +
# t1-escape cung declared-off, repo sach exit 0 — khai-roi-ma-nhu-khong-khai.
# Doctrine ADR 0004/0006: da khai thi khong resolve duoc phai exit 2.
echo "RL14 gia tri pham vi RONG -> exit 2 keo thong diep, khong roi ve skip"
rl_repo rl14
# doi chung duong: cung fixture, base THAT -> clean exit 0
RL14OK="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL14ctrl 0 $?
hasout RL14ctrl2 "pre-merge-check: clean" "$RL14OK"
# a) --base ""
RL14A="$(bash "$CHECK" "$TE_R" --base "" 2>&1)"; check RL14a 2 $?
hasout RL14a2 '--base requires a value (got empty string' "$RL14A"
nothas RL14a3 "no PR base given" "$RL14A"
nothas RL14a4 "pre-merge-check: clean" "$RL14A"
# b) PRE_MERGE_BASE set nhung RONG (phan biet voi khong-set: khong-set van la
# bo-qua-co-tin-hieu hop le nhu TE18k)
RL14B="$(PRE_MERGE_BASE="" bash "$CHECK" "$TE_R" 2>&1)"; check RL14b 2 $?
hasout RL14b2 "PRE_MERGE_BASE is set but empty" "$RL14B"
# doi chung: KHONG set env -> van duong skip-co-NOTE cu, exit 0
RL14BOK="$(bash "$CHECK" "$TE_R" 2>&1)"; check RL14bctrl 0 $?
hasout RL14bctrl2 "no PR base given" "$RL14BOK"
# c) --slug "" — cung lop: loc theo slug rong thi khong dir nao khop, moi slug
# bi bo qua ma van clean; khai-loc-rong phai no to
RL14C="$(bash "$CHECK" "$TE_R" --base "$TE_B" --slug "" 2>&1)"; check RL14c 2 $?
hasout RL14c2 '--slug requires a value (got empty string' "$RL14C"
# d) env rong NHUNG co --base tuong minh -> co override env theo convention
# chung, KHONG do oan (S4 round 8: ban dau no truoc vong parse, den ca lenh
# co ref that cung exit 2 kem goi y sua tro sai cho)
RL14D="$(PRE_MERGE_BASE="" bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL14d 0 $?
hasout RL14d2 "pre-merge-check: clean" "$RL14D"
# e) VIOLATION [scope] phai ra STDOUT nhu moi dong VIOLATION khac — CI chi grep
# stdout khong duoc nhan exit 2 tran khong ly do
RL14E="$(bash "$CHECK" "$TE_R" --base khong-co-ref-nay 2>/dev/null)"; check RL14e 2 $?
hasout RL14e2 "VIOLATION [scope]" "$RL14E"

# ── RL15: bo loc/pham vi KHAI ma khong dung duoc -> no to (round 9, cung lop)
echo "RL15 bo loc --slug go sai va base-khai-tren-root-khong-git -> exit 2"
rl_repo rl15
# doi chung duong: --slug DUNG (feat-rl co that trong fixture) van chay tron
RL15OK="$(bash "$CHECK" "$TE_R" --base "$TE_B" --slug feat-rl 2>&1)"; check RL15ctrl 0 $?
hasout RL15ctrl2 "pre-merge-check: clean" "$RL15OK"
# a) --slug go sai (khong rong, khong khop thu muc nao) — tung loc sach moi
# slug roi in clean
RL15A="$(bash "$CHECK" "$TE_R" --base "$TE_B" --slug feat-khong-ton-tai 2>&1)"; check RL15a 2 $?
hasout RL15a2 "matches no directory under _acceptance/" "$RL15A"
nothas RL15a3 "pre-merge-check: clean" "$RL15A"
# b) --slug + root khong co _acceptance/ — khai bo loc ma khong co gi de loc
RL15BD="$T/rl15b-root"; rm -rf "$RL15BD"; mkdir -p "$RL15BD"
RL15B="$(bash "$CHECK" "$RL15BD" --slug feat-x 2>&1)"; check RL15b 2 $?
hasout RL15b2 "no _acceptance/ under" "$RL15B"
# doi chung: KHONG --slug thi van la nothing-to-check exit 0 nhu cu (RL6 giu)
RL15BOK="$(bash "$CHECK" "$RL15BD" 2>&1)"; check RL15bctrl 0 $?
hasout RL15bctrl2 "nothing to check" "$RL15BOK"
# c) base DA KHAI nhung root khong phai git repo — tung ha ve skip+declared-off
RL15CD="$T/rl15c-root"; rm -rf "$RL15CD"; mkdir -p "$RL15CD/_acceptance"
printf 'schema_version: 1\n' > "$RL15CD/_acceptance/config.yaml"
RL15C="$(bash "$CHECK" "$RL15CD" --base main 2>&1)"; check RL15c 2 $?
hasout RL15c2 "git không dùng được trên" "$RL15C"
nothas RL15c3 "pre-merge-check: clean" "$RL15C"
# doi chung: cung root khong-git, KHONG khai base -> van chay va exit 0 nhu cu
# (cac fixture S-case khong-git song nho duong nay — khong duoc pha)
RL15COK="$(bash "$CHECK" "$RL15CD" 2>&1)"; check RL15cctrl 0 $?
# d) round 7 bat lo TRONG guard vua them: gia tri co `/` hay `.`/`..` qua duoc
# -d nhung khong bao gio khop basename nao -> tung lai clean gia
RL15D1="$(bash "$CHECK" "$TE_R" --base "$TE_B" --slug "feat-rl/" 2>&1)"; check RL15d1 2 $?
hasout RL15d1m "is not a plain slug name" "$RL15D1"
RL15D2="$(bash "$CHECK" "$TE_R" --base "$TE_B" --slug . 2>&1)"; check RL15d2 2 $?
hasout RL15d2m "is not a plain slug name" "$RL15D2"
RL15D3="$(bash "$CHECK" "$TE_R" --base "$TE_B" --slug .. 2>&1)"; check RL15d3 2 $?
hasout RL15d3m "is not a plain slug name" "$RL15D3"
nothas RL15d4 "pre-merge-check: clean" "$RL15D1$RL15D2$RL15D3"

echo "RL6 dem loi thoat exit 0 bang may — DUNG HAI loi (AC-6)"
RL6N="$(grep -vE '^[[:space:]]*#' "$CHECK" | grep -c 'exit 0')"
same RL6a 2 "$RL6N"
# DOI CHUNG DOT BIEN: phep dem phai THAY duoc mot loi thoat tiem them, neu
# khong RL6a chi chung minh "con so hom nay bang 2" chu khong phai "phep dem
# song". Bat bien #4.
RL6CP="$RLCP/scripts/rl6-check.sh"; { cat "$CHECK"; printf '\nexit 0\n'; } > "$RL6CP"
RL6M="$(grep -vE '^[[:space:]]*#' "$RL6CP" | grep -c 'exit 0')"
same RL6b 3 "$RL6M"

echo "RL7a ten duy nhat o call-site ledger_mark == EXPECTED, hai chieu (AC-7c)"
rl_names() { # <file> — ten duy nhat o call-site (loai dong dinh nghia ham)
  grep -E 'ledger_mark (ran|declared-off) ' "$1" | grep -v 'ledger_mark()' \
    | sed -E 's/.*ledger_mark (ran|declared-off) ([a-z0-9-]+).*/\2/' | sort -u
}
rl_exp() { sed -n 's/^LEDGER_EXPECTED="\(.*\)"$/\1/p' "$1" | tr ' ' '\n' | sort -u; }
RL7NAMES="$(rl_names "$CHECK")"; RL7EXP="$(rl_exp "$CHECK")"
same RL7a1 "$RL7EXP" "$RL7NAMES"
same RL7a2 4 "$(printf '%s\n' "$RL7EXP" | grep -c .)"
RL7CP2="$RLCP/scripts/rl7a-check.sh"; { cat "$CHECK"; printf '\nledger_mark ran khoi-moi\n'; } > "$RL7CP2"
[ "$(rl_names "$RL7CP2")" != "$(rl_exp "$RL7CP2")" ]; check RL7a3 0 $?

echo "RL5a k tinh tu EXPECTED — cam tautology n+m o cho in (AC-5)"
RL5LINE="$(grep 'pre-merge-check: rules ran=' "$CHECK" | grep -v '^[[:space:]]*#')"
same   RL5a1 1 "$(printf '%s\n' "$RL5LINE" | grep -c .)"
hasout RL5a2 'expected=$LEDGER_K' "$RL5LINE"
RL5K="$(grep -E '^[[:space:]]*LEDGER_K=' "$CHECK")"
hasout RL5a3 'LEDGER_K=$#' "$RL5K"
nothas RL5a4 'LEDGER_RAN_N' "$RL5K"
nothas RL5a5 'LEDGER_OFF_N' "$RL5K"

echo "RL11a enforcement off -> so tat theo, KHONG dong ledger nao (AC-11)"
rl_repo rl11a
printf 'enforcement: off\n' >> "$TE_R/_acceptance/config.yaml"
git -C "$TE_R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm enf
RL11A="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL11a1 0 $?
same   RL11a2 0 "$(printf '%s\n' "$RL11A" | grep -cE '^(ran|declared-off) ')"
nothas RL11a3 "pre-merge-check: rules ran=" "$RL11A"
hasout RL11a4 "pre-merge-check: clean" "$RL11A"

echo "RL11b enforcement warn KHONG ha diem nghen — so lech van exit 2 (AC-11)"
mk_gp_repo rl11b; R="$GPR/rl11b"; RL11_B="$GP_BASE"
gp_feature "$R" feat-w T3 implemented
printf 'enforcement: warn\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
RL11CP="$RLCP/scripts/rl11-check.sh"; cp "$CHECK" "$RL11CP"
RL11OK="$(bash "$RL11CP" "$R" --base "$RL11_B" 2>&1)"; check RL11ctrl 0 $?
hasout RL11ctrl2 "pre-merge-check: rules ran=" "$RL11OK"   # warn KHONG tat so
sed 's|^for dir in "\$ACC"/\*/; do$|for dir in "$ACC"/khong-ton-tai-*/; do|' "$CHECK" > "$RL11CP"
RL11B="$(bash "$RL11CP" "$R" --base "$RL11_B" 2>&1)"; check RL11b1 2 $?
hasout RL11b2 "VIOLATION [ledger]: luật per-slug không chạy và không khai tắt" "$RL11B"

# ── RL11c: PARITY hai parser cua khoa `enforcement`, theo BANG ─────────────
# `enforcement` la khoa DUY NHAT ca hook (write-time) lan pre-merge (merge
# boundary) cung doc. Moi bat dong deu cung hinh dang fail-open: hook giu
# strict trong khi so o pre-merge tat IM LANG. Round 1 chi ghim MOT bien the
# (`OFF` hoa) roi de ho chieu nhay — dung lop loi bat bien #4 CLAUDE.md cam.
# Nen do bang BANG, va do CA HAI ben tren CUNG mot chuoi, khong chep luat sang
# test: ben hook goi thang regex that trong hooks/acceptance-evidence-gate.js.
echo "RL11c parity \`enforcement\`: pre-merge va hook phai dong y tung bien the"
RL11C_FAIL=0
rl_enf_pair() { # <nhãn> <DÒNG (hoặc nhiều dòng) nguyên văn> <kỳ vọng: on|off>
  # Nhan DONG nguyen van chu khong phai gia tri: cac chieu lech round 3 review
  # bat duoc deu nam NGOAI phan gia tri (space truoc dau hai cham, dong trung
  # khoa) — parametrize theo gia tri thi khong bao gio dien ta duoc chung.
  # on  = ca hai VAN enforce (so bat, hook != off)
  # off = ca hai cung tat  (so tat, hook == off)
  mk_gp_repo "rl11c$1"; local R="$GPR/rl11c$1"; local B="$GP_BASE"
  gp_feature "$R" feat-e T3 implemented
  printf '%s\n' "$2" >> "$R/_acceptance/config.yaml"
  gp_commit "$R"
  # ben A: pre-merge chay END-TO-END — so co bat khong?
  local A=off
  bash "$CHECK" "$R" --base "$B" 2>&1 | grep -q '^pre-merge-check: rules ran=' && A=on
  # ben B: ap CHINH regex trong nguon hook len CUNG config text — DOC RA tu
  # file, khong chep tay sang test (chep tay la cach GPM16 cua v2 tung xanh
  # gia). Khong trich duoc regex -> NOREGEX -> case DO, khong im lang bo qua.
  local Bv; Bv="$(node -e '
    const fs = require("fs");
    const src = fs.readFileSync(process.argv[1], "utf8");
    const m = src.match(/configText\.match\(\/(.+)\/([a-z]*)\)/);
    if (!m) { process.stdout.write("NOREGEX"); process.exit(0); }
    const hit = process.argv[2].match(new RegExp(m[1], m[2]));
    process.stdout.write(hit && hit[1] === "off" ? "off" : "on");
  ' "$ROOT_REAL/hooks/acceptance-evidence-gate.js" "$2")"
  if [ "$A" != "$3" ] || [ "$Bv" != "$3" ]; then
    echo "     LECH [$1 = <$2>]: pre-merge=$A hook=$Bv can=$3"
    RL11C_FAIL=$((RL11C_FAIL+1))
  fi
}
rl_enf_pair strict    'enforcement: strict'       on
rl_enf_pair off       'enforcement: off'          off
rl_enf_pair hoa       'enforcement: OFF'          on
rl_enf_pair nhaykep   'enforcement: "off"'        on
rl_enf_pair nhaydon   "enforcement: 'off'"        on
rl_enf_pair chuthich  'enforcement: off   # tam'  off
rl_enf_pair la        'enforcement: khong-hop-le' on
# round 3 review: hai chieu lech NGOAI phan gia tri — space truoc dau hai cham
# (YAML hop le, hook nhan) va dong-trung-khoa (hook nhay qua dong rac, match
# dong hop le dau tien)
rl_enf_pair spacecolon 'enforcement : off'        off
rl_enf_pair trungkhoa  'enforcement: rac
enforcement: off'                                 off
check RL11c 0 "$RL11C_FAIL"

echo "RL13 classifier hong o MOT slug, chay o slug kia -> DUNG MOT dong so"
# Lo that tim duoc o S4 round 1: hai one-shot doc lap (declared-off trong
# gap_probe_not_enforced, ran trong vong lap) cung ghi trong lan chay HON HOP
# -> chokepoint dem 2 -> exit 2. Bien mot suy giam advisory (thiet ke chi NOTE)
# thanh chan cung, VA nuot dong tong ket violation that.
mk_gp_repo rl13; R="$GPR/rl13"; RL13_B="$GP_BASE"
gp_feature "$R" feat-a T3 implemented
gp_feature "$R" feat-b T3 implemented
# feat-a mang MOT violation THAT (go chu ky) — ve thu hai cua finding: exit 2
# cua chokepoint tung nuot ca ket luan chan-merge that su cua lan chay.
sed -i.bak 's/^human_signoff:.*/human_signoff:/' "$R/_acceptance/feat-a/evidence-report.md"
rm -f "$R/_acceptance/feat-a/evidence-report.md.bak"
gp_commit "$R"
# node gia: exit 0 cho feat-a, exit 1 khi doi so co chua "feat-b"
RL13BIN="$T/rl13-bin"; rm -rf "$RL13BIN"; mkdir -p "$RL13BIN"
for b in bash sh sed awk grep head tail sort tr cut basename dirname wc cat git env uname date diff mktemp rm; do
  p="$(command -v "$b" 2>/dev/null)"; [ -n "$p" ] && ln -sf "$p" "$RL13BIN/$b"
done
REALNODE="$(command -v node)"
printf '#!/bin/sh\nfor a in "$@"; do case "$a" in *feat-b*) exit 1 ;; esac; done\nexec %s "$@"\n' "$REALNODE" > "$RL13BIN/node"
chmod +x "$RL13BIN/node"
# DOI CHUNG DUONG: node that (khong gia) -> ca hai slug chay -> dung 1 dong `ran`
RL13OK="$(bash "$CHECK" "$R" --base "$RL13_B" 2>&1)"
same RL13ctrl 1 "$(printf '%s\n' "$RL13OK" | grep -cx 'ran gap-probe')"
same RL13ctrl2 0 "$(printf '%s\n' "$RL13OK" | grep -cx 'declared-off gap-probe')"
RL13="$(env PATH="$RL13BIN" bash "$CHECK" "$R" --base "$RL13_B" 2>&1)"; RL13ST=$?
# Chot fixture: node gia PHAI that su hong o feat-b, neu khong ca case vo nghia
hasout RL13fix "GAP-PROBE: NOT ENFORCED reason=node lib/gap-probe.cjs classify thất bại trên feat-b" "$RL13"
# DUNG MOT dong so cho gap-probe, va la declared-off (chay MOT PHAN = khai tat)
same   RL13a 1 "$(printf '%s\n' "$RL13" | grep -cE '^(ran|declared-off) gap-probe$')"
same   RL13b 1 "$(printf '%s\n' "$RL13" | grep -cx 'declared-off gap-probe')"
nothas RL13c "VIOLATION [ledger]" "$RL13"
# Violation THAT cua feature phai duoc ket luan binh thuong (exit 1), khong bi
# exit 2 cua chokepoint nuot mat
check  RL13d 1 "$RL13ST"
hasout RL13e "violation(s) — merge blocked" "$RL13"
nothas RL13f "lỗi NỘI TẠI của cổng" "$RL13"

echo "RL12 node vang o advisory -> declared-off gap-probe qua *_not_enforced (AC-12)"
mk_gp_repo rl12; R="$GPR/rl12"; RL12_B="$GP_BASE"
gp_feature "$R" feat-n T3 implemented; gp_commit "$R"
RL12OK="$(bash "$CHECK" "$R" --base "$RL12_B" 2>&1)"; check RL12ctrl 0 $?
same RL12ctrl2 1 "$(printf '%s\n' "$RL12OK" | grep -cx 'ran gap-probe')"   # doi chung: CO node -> ran
NOB="$T/rl12-bin"; rm -rf "$NOB"; mkdir -p "$NOB"
for b in bash sh sed awk grep head tail sort tr cut basename dirname wc cat git env uname date diff mktemp rm; do
  p="$(command -v "$b" 2>/dev/null)"; [ -n "$p" ] && ln -sf "$p" "$NOB/$b"
done
# Chot fixture: PATH cat DUNG la khong co node (neu con node thi ca case do
# nghia — no se do `ran gap-probe` va RL12b/c bat ngay, nhung noi ro o day).
# Do trong TIEN TRINH MOI, dung nhu lan chay that ben duoi: bash cache duong
# dan lenh trong hash table cua CHINH tien trinh no, nen `command -v node` o
# shell suite (da chay node hang chuc lan) van tra ve duong dan cu bat ke PATH.
if env PATH="$NOB" bash -c 'command -v node' >/dev/null 2>&1; then
  echo "     PATH cat VAN con node — fixture hong"; check RL12fix 0 1
else
  check RL12fix 0 0
fi
RL12OUT="$(env PATH="$NOB" bash "$CHECK" "$R" --base "$RL12_B" 2>&1)"; RL12ST=$?
check  RL12a 0 "$RL12ST"
same   RL12b 1 "$(printf '%s\n' "$RL12OUT" | grep -cx 'declared-off gap-probe')"
same   RL12c 0 "$(printf '%s\n' "$RL12OUT" | grep -cx 'ran gap-probe')"
hasout RL12d "GAP-PROBE: NOT ENFORCED" "$RL12OUT"
hasout RL12e "pre-merge-check: clean" "$RL12OUT"

# ── RL10: bang chung cho judge phai SINH LAI roi diff byte-doi-byte ─────────
# Cung khuon TE17/GPM12: dem nhan chi do su DAY DU, khong do tinh XAC THUC.
# Thong diep doi ma file evidence khong doi thi judge cham mot ban chup cu.
echo "RL10 sinh lai evidence/ledger-messages.txt roi diff byte-doi-byte"
RLMSG="$ROOT_REAL/_acceptance/premerge-rules-ledger/evidence/ledger-messages.txt"
RL10NEW="$(mktemp)"
{
  printf '%s\n' '# Thông điệp sổ luật-đã-chạy — SINH bởi tests/scripts/run-tests.sh (RL10).'
  printf '%s\n' '# KHÔNG sửa tay: suite sinh lại file này mỗi lần chạy và diff byte-đối-byte.'
  printf '\n== lần chạy sạch (mọi luật chạy) ==\n'
  rl_repo rl10a
  bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1 | grep -E '^(ran|declared-off) |^pre-merge-check: rules |^pre-merge-check: clean'
  printf '\n== tắt có khai báo (--no-t1-escape) ==\n'
  rl_repo rl10b
  bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1 | grep -E '^(ran|declared-off) |^pre-merge-check: rules '
  printf '\n== sổ lệch (khối gap-probe bị vô hiệu trong bản sao) ==\n'
  mk_gp_repo rl10c; R="$GPR/rl10c"; RL10_B="$GP_BASE"
  gp_feature "$R" feat-m T3 implemented; gp_commit "$R"
  RL10CP="$RLCP/scripts/rl10-check.sh"
  awk '
    /Gap-probe presence/ { hdr=1 }
    hdr && /if \[ "\$GAP_PROBE_MODE" != "off" \] && slug_in_diff/ && !done { sub(/if .*then/, "if false; then"); done=1 }
    { print }
  ' "$CHECK" > "$RL10CP"
  bash "$RL10CP" "$R" --base "$RL10_B" 2>&1 | grep -E '^VIOLATION \[ledger\]|^NOTE: VIOLATION \[ledger\]|^pre-merge-check: rules '
} > "$RL10NEW" 2>&1
if [ "${RL10_WRITE:-0}" = "1" ]; then cp "$RL10NEW" "$RLMSG"; echo "  (RL10_WRITE=1 — đã ghi lại)"; fi
if diff -u "$RLMSG" "$RL10NEW" > "$T/rl10.diff" 2>&1; then
  check RL10 0 0
else
  echo "     evidence LECH voi thong diep hien tai:"; head -20 "$T/rl10.diff" | sed 's/^/     /'
  check RL10 0 1
fi
# Chong troi PHAM VI: mat han mot nhanh thi diff van khop neu evidence cung
# sinh thieu — nen ghim tung nhanh co mat trong ban vua sinh.
RL10M="$(cat "$RL10NEW")"
hasout RL10a "VIOLATION [ledger]: luật gap-probe không chạy và không khai tắt" "$RL10M"
hasout RL10b "lỗi NỘI TẠI của cổng pre-merge" "$RL10M"
hasout RL10c "declared-off t1-escape" "$RL10M"
hasout RL10d "pre-merge-check: rules ran=4 declared-off=0 expected=4" "$RL10M"

# ── UJ: PASS chưa ai phán (premerge-unjudged-pass) ─────────────────────────
UJR="$T/uj"; mkdir -p "$UJR"

# uj_repo <case> [config-thêm] — repo fixture; trả BASE sha qua UJ_BASE.
# Sha riêng từng fixture (cùng lý do như mk_gp_repo): cây + author + message
# giống hệt thì sha chỉ phụ thuộc dấu-thời-gian-giây, và một case lỡ đưa base
# của repo KHÁC vẫn xanh.
uj_repo() {
  R="$UJR/$1"; rm -rf "$R"; mkdir -p "$R/_acceptance"
  { printf 'schema_version: 1\n'
    printf 'signoff:\n  required_for: [T2, T3]\n'
    [ -n "${2:-}" ] && printf '%s\n' "$2"
    printf '  require_human_commit: false\n'
  } > "$R/_acceptance/config.yaml"
  git init -q "$R"
  git -C "$R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$R" commit -qm "uj base $1"
  UJ_BASE="$(git -C "$R" rev-parse --quiet --verify 'HEAD^{commit}' 2>/dev/null || true)"
  [ -n "$UJ_BASE" ] || { echo "FATAL: uj_repo $1 — không tạo được base commit trong $R" >&2; exit 1; }
}

# uj_slug <root> <slug> <contract-frontmatter|-> <chữ ký|SKIP>
#   "-"    ở tham số 3 = KHÔNG tạo contract.md
#   "SKIP" ở tham số 4 = KHÔNG tạo evidence-report.md
uj_slug() {
  d="$1/_acceptance/$2"; mkdir -p "$d"
  if [ "$3" != "-" ]; then printf -- '---\n%s\n---\n' "$3" > "$d/contract.md"; fi
  if [ "$4" != "SKIP" ]; then
    printf '#!/bin/sh\nexit 0\n' > "$1/verify-$2.sh"
    printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nhuman_signoff: %s\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: verify-%s.sh\n  verified_at: 2026-06-20\n' \
      "$2" "$4" "$2" "$2" > "$d/evidence-report.md"
  fi
}
uj_full() { printf 'schema_version: 1\nfeature: f\nslug: %s\nrisk_tier: T3\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\napproved_at: 2026-06-10' "$1"; }

echo "UJ6 evidence khai PASS nhung KHONG co contract.md -> VIOLATION, khong tang hinh"
uj_repo uj6 '  approvers: ["Manh Phan"]'; R="$UJR/uj6"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
uj_slug "$R" feat-ghost - "Manh Phan 2026-06-20"
UJ6="$(bash "$CHECK" "$R" 2>&1)"; UJ6ST=$?
check  UJ6a 1 "$UJ6ST"
hasout UJ6b "VIOLATION [feat-ghost]: no contract.md" "$UJ6"
nothas UJ6c "pre-merge-check: clean" "$UJ6"
hasout UJ6d "OK [feat-ok]" "$UJ6"

echo "UJ7 tu khai da phat hanh nhung THIEU risk_tier -> VIOLATION neu dich danh field"
uj_repo uj7 '  approvers: ["Manh Phan"]'; R="$UJR/uj7"
uj_slug "$R" feat-notier 'schema_version: 1
feature: f
slug: feat-notier
surfaces: [api]
status: signed-off
approved_by: Manh Phan' "Manh Phan 2026-06-20"
UJ7="$(bash "$CHECK" "$R" 2>&1)"; check UJ7a 1 $?
hasout UJ7b "contract has no risk_tier" "$UJ7"
hasout UJ7c "VIOLATION [feat-notier]" "$UJ7"

echo "UJ8 THIEU status -> VIOLATION; UJ8neg draft/approved -> im lang (ca duoi nguong)"
uj_repo uj8 '  approvers: ["Manh Phan"]'; R="$UJR/uj8"
uj_slug "$R" feat-nostatus 'schema_version: 1
feature: f
slug: feat-nostatus
risk_tier: T3
surfaces: [api]
approved_by: Manh Phan' "Manh Phan 2026-06-20"
UJ8="$(bash "$CHECK" "$R" 2>&1)"; check UJ8a 1 $?
hasout UJ8b "contract has no status" "$UJ8"
for st in draft approved; do
  uj_repo "uj8n-$st" '  approvers: ["Manh Phan"]'; R="$UJR/uj8n-$st"
  uj_slug "$R" feat-wip "schema_version: 1
feature: f
slug: feat-wip
risk_tier: T3
surfaces: [api]
status: $st
approved_by: Manh Phan" SKIP
  UJ8N="$(bash "$CHECK" "$R" 2>&1)"; check "UJ8neg-$st" 0 $?
  nothas "UJ8neg-$st-2" "VIOLATION" "$UJ8N"
done

echo "UJ9 contract khai signed-off, thieu risk_tier, KHONG co evidence -> VIOLATION"
uj_repo uj9 '  approvers: ["Manh Phan"]'; R="$UJR/uj9"
uj_slug "$R" feat-noev 'schema_version: 1
feature: f
slug: feat-noev
surfaces: [api]
status: signed-off
approved_by: Manh Phan' SKIP
# Chot fixture: KHONG duoc co evidence-report.md, neu khong case nay do nhanh
# evidence chu khong do nhanh contract cua claims_released.
[ ! -f "$R/_acceptance/feat-noev/evidence-report.md" ]; check UJ9fix 0 $?
UJ9="$(bash "$CHECK" "$R" 2>&1)"; check UJ9a 1 $?
hasout UJ9b "VIOLATION [feat-noev]" "$UJ9"

echo "UJ10 scaffold bo hoang -> IM LANG (doi chung duong cua nhom tang hinh)"
uj_repo uj10 '  approvers: ["Manh Phan"]'; R="$UJR/uj10"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
mkdir -p "$R/_acceptance/feat-empty"
UJ10="$(bash "$CHECK" "$R" 2>&1)"; check UJ10a 0 $?
nothas UJ10b "feat-empty" "$UJ10"
hasout UJ10c "pre-merge-check: clean" "$UJ10"

echo "UJ3 chu ky giu-cho trong commit NGUOI dung nghi thuc -> VAN VIOLATION"
# require_human_commit KHONG cuu duoc lop nay: no kiem AI commit va commit do
# cham dong nao, khong kiem noi dung co phai mot cai ten. Fixture phai dung
# DUNG nghi thuc hai commit, neu khong case do vi luat require_human_commit.
uj3_repo() { # <case> <chữ ký>
  uj_repo "$1" '  approvers: ["Manh Phan"]'
  sed -i.bak 's/^  require_human_commit: false$/  require_human_commit: true/' "$R/_acceptance/config.yaml"
  rm -f "$R/_acceptance/config.yaml.bak"
  uj_slug "$R" feat-h "$(uj_full feat-h)" ""
  git -C "$R" add -A >/dev/null
  git -c user.email=m@m -c user.name=Manh -C "$R" commit -qm "evidence(feat-h): may viet"
  sed -i.bak "s/^human_signoff:.*/human_signoff: $2/" "$R/_acceptance/feat-h/evidence-report.md"
  rm -f "$R/_acceptance/feat-h/evidence-report.md.bak"
  git -C "$R" add -A >/dev/null
  git -c user.email=m@m -c user.name=Manh -C "$R" commit -qm "signoff(feat-h): ky"
}
# DOI CHUNG DUONG truoc: CUNG nghi thuc hai commit, chu ky THAT -> exit 0.
# Thieu no, UJ3 chi chung minh "co violation nao do" chu khong phai luat moi.
uj3_repo uj3ok "Manh Phan 2026-06-20"; UJ3OK="$(bash "$CHECK" "$R" 2>&1)"
check  UJ3ctrl 0 $?
hasout UJ3ctrl2 "pre-merge-check: clean" "$UJ3OK"
uj3_repo uj3 "PENDING — chờ Manh gật"; UJ3="$(bash "$CHECK" "$R" 2>&1)"
check  UJ3a 1 $?
hasout UJ3b "is a placeholder, not a signature" "$UJ3"

echo "UJ5 KHONG khai approvers -> luoi den bat, MOT dong NOTE cho ca lan chay"
for ph in PENDING TBD TODO 'n/a' none unsigned waiting '>' '|' '-' '<name> <date>'; do
  uj_repo uj5 ''; R="$UJR/uj5"
  uj_slug "$R" feat-p "$(uj_full feat-p)" "$ph"
  bash "$CHECK" "$R" >/dev/null 2>&1; check "UJ5-[$ph]" 1 $?
done
uj_repo uj5n ''; R="$UJR/uj5n"
uj_slug "$R" feat-a "$(uj_full feat-a)" "PENDING"
uj_slug "$R" feat-b "$(uj_full feat-b)" "TBD"
UJ5N="$(bash "$CHECK" "$R" 2>&1)"
same   UJ5n2 2 "$(printf '%s\n' "$UJ5N" | grep -c 'is a placeholder, not a signature')"
# DOI CHUNG DUONG: cung config khong-khai, chu ky that phai VAN qua
uj_repo uj5c ''; R="$UJR/uj5c"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
UJ5C="$(bash "$CHECK" "$R" 2>&1)"; check UJ5ctrl 0 $?
hasout UJ5ctrl2 "pre-merge-check: clean" "$UJ5C"

echo "UJ18 chu ky RONG -> thong diep chot RONG song sot, dung thu tu"
for cfg in '  approvers: ["Manh Phan"]' ''; do
  uj_repo uj18 "$cfg"; R="$UJR/uj18"
  uj_slug "$R" feat-e "$(uj_full feat-e)" ""
  UJ18="$(bash "$CHECK" "$R" 2>&1)"; check "UJ18-exit" 1 $?
  hasout "UJ18-msg" "verdict PASS but human_signoff is empty (Gate 2 pending)" "$UJ18"
  nothas "UJ18-order" "is a placeholder, not a signature" "$UJ18"
  nothas "UJ18-order2" "is a placeholder, not a signature" "$UJ18"
done

echo "UJ17 luat moi song o MOI che do goi (AC-16)"
# Luat moi nam trong vong per-slug — vong do chay o MOI che do goi. Neu ai do
# boc no vao nhanh chi song khi co --base (nhanh cua gap-probe va T1-escape,
# hai luat loc theo diff PR) thi suite van xanh trong khi consumer goi khong
# base — dung che do da gay incident #255 — khong duoc bao ve gi.
uj_repo uj17 '  approvers: ["Manh Phan"]'; R="$UJR/uj17"; UJ17B="$UJ_BASE"
uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
uj_slug "$R" feat-ghost - "Manh Phan 2026-06-20"
git -C "$R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$R" commit -qm change
uj17_run() { # <nhãn> <cờ...>
  lbl="$1"; shift
  UJ17="$(bash "$CHECK" "$R" "$@" 2>&1)"; UJ17ST=$?
  check  "UJ17-$lbl-exit" 1 "$UJ17ST"
  hasout "UJ17-$lbl-sig"  "is a placeholder, not a signature" "$UJ17"
}
uj17_run base --base "$UJ17B"
uj17_run nobase
uj17_run slug --slug feat-pending
# Nhom tang hinh cung phai song o che do khong-base
UJ17G="$(bash "$CHECK" "$R" 2>&1)"; hasout UJ17-ghost "no contract.md" "$UJ17G"
# O AM: --slug tro slug KHAC thi slug do KHONG bi xet (dung thiet ke co loc)
uj_repo uj17n '  approvers: ["Manh Phan"]'; R="$UJR/uj17n"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
UJ17N="$(bash "$CHECK" "$R" --slug feat-ok 2>&1)"; check UJ17neg 0 $?
nothas UJ17neg2 "feat-pending" "$UJ17N"

echo "UJ11 enforcement off/warn/strict KHONG ha luat moi (AC-11)"
# BANG chu khong mot gia tri: mot mode lot la fail-open im lang.
for mode in off warn strict; do
  uj_repo "uj11-$mode" '  approvers: ["Manh Phan"]'; R="$UJR/uj11-$mode"
  printf 'enforcement: %s\n' "$mode" >> "$R/_acceptance/config.yaml"
  uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
  uj_slug "$R" feat-ghost - "Manh Phan 2026-06-20"
  UJ11="$(bash "$CHECK" "$R" 2>&1)"; check "UJ11-$mode" 1 $?
  hasout "UJ11-$mode-sig"   "is a placeholder, not a signature" "$UJ11"
  hasout "UJ11-$mode-ghost" "no contract.md" "$UJ11"
done

echo "UJ12 stdout + so luat + idempotent (AC-12)"
uj_repo uj12 '  approvers: ["Manh Phan"]'; R="$UJR/uj12"; UJ12B="$UJ_BASE"
uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
git -C "$R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$R" commit -qm change
# (a) VIOLATION ra STDOUT — chay 2>/dev/null van thay. CI chi grep stdout.
UJ12A="$(bash "$CHECK" "$R" --base "$UJ12B" 2>/dev/null)"
hasout UJ12a "is a placeholder, not a signature" "$UJ12A"
# (b) so luat KHONG doi o CA HAI che do — luat moi nam TRONG luat per-slug da
# co so, khong phai luat thu tu.
hasout UJ12b1 "pre-merge-check: rules ran=4 declared-off=0 expected=4" "$UJ12A"
UJ12C="$(bash "$CHECK" "$R" 2>&1)"
hasout UJ12b2 "pre-merge-check: rules ran=2 declared-off=2 expected=4" "$UJ12C"
# (c) idempotent
UJ12D="$(bash "$CHECK" "$R" --base "$UJ12B" 2>&1)"
UJ12E="$(bash "$CHECK" "$R" --base "$UJ12B" 2>&1)"
same UJ12c "$UJ12D" "$UJ12E"

echo "UJ14 tiem dot bien: vo hieu tung nhanh -> DUNG case tuong ung doi mau"
# Khong co phep do nay thi moi case UJ tren khong phan biet duoc "bat dung loi"
# voi "chua bao gio chay" — bat bien assertion-am-tinh-mot-minh cua CLAUDE.md,
# va chinh la thu da de hinh dang 4 song sot trong ban va cua repo tieu thu.
#
# Ban sao PHAI giu layout scripts/ canh lib/: script resolve lib qua ../lib, nen
# copy vao thu muc phang lam ban "nguyen ven" da lech san va moi ket luan tu no
# la ket luan ve mot script KHAC. Doi chung UJ14ctrl bat duoc dieu do.
UJCP="$T/ujcp"; rm -rf "$UJCP"; mkdir -p "$UJCP/scripts"
cp -R "$ROOT_REAL/lib" "$UJCP/lib"
UJMUT="$UJCP/scripts/uj-check.sh"

# Fixture do rieng cho tung nhanh
uj_repo ujm_blk ''; UJM_BLK="$UJR/ujm_blk"
uj_slug "$UJM_BLK" feat-p "$(uj_full feat-p)" "PENDING"
uj_repo ujm_noc '  approvers: ["Manh Phan"]'; UJM_NOC="$UJR/ujm_noc"
uj_slug "$UJM_NOC" feat-ghost - "Manh Phan 2026-06-20"
uj_repo ujm_fld '  approvers: ["Manh Phan"]'; UJM_FLD="$UJR/ujm_fld"
uj_slug "$UJM_FLD" feat-notier 'schema_version: 1
feature: f
slug: feat-notier
surfaces: [api]
status: signed-off
approved_by: Manh Phan' "Manh Phan 2026-06-20"
uj_repo ujm_ctr '  approvers: ["Manh Phan"]'; UJM_CTR="$UJR/ujm_ctr"
uj_slug "$UJM_CTR" feat-noev 'schema_version: 1
feature: f
slug: feat-noev
surfaces: [api]
status: signed-off
approved_by: Manh Phan' SKIP

# DOI CHUNG: ban sao KHONG tiem phai DO dung nhu ban goc tren ca 6 fixture.
# Thieu buoc nay, moi "UJ14-* xanh" duoi day co the chi la ban sao khong chay.
cp "$CHECK" "$UJMUT"
for f in "$UJM_BLK" "$UJM_NOC" "$UJM_FLD" "$UJM_CTR"; do
  # CHOT MA THOAT TRUOC khi goi check: mot $(...) trong danh sach doi so chay
  # NGAY LUC BUNG va ghi de $?, nen `check "x-$(basename "$f")" 1 $?` do mac
  # thoat cua basename chu khong phai cua cong. Vong dau da dam dung bay nay.
  bash "$UJMUT" "$f" >/dev/null 2>&1; ujrc=$?
  ujlbl="$(basename "$f")"
  check "UJ14ctrl-$ujlbl" 1 "$ujrc"
done

# Ban sao phai VAN LA MOT SCRIPT CHAY DUOC. Day KHONG phai chi tiet thua:
# uj_mut ky vong mutant thoat 0, ma `bash <file rong>` cung thoat 0 — nen mot bo
# loc hong (awk/sed loi cu phap, ghi ra file rong hoac cut ngang) cho ra XANH
# GIA o chinh phep do dung de chan xanh gia. `diff` mot minh khong bat duoc:
# file rong DUNG LA khac ban goc.
uj_mut_usable() { # <file> — 0 iff con la script dung nghia
  [ -s "$1" ] || return 1
  bash -n "$1" 2>/dev/null || return 1
  [ "$(wc -l < "$1")" -ge "$(( $(wc -l < "$CHECK") - 3 ))" ] || return 1
  return 0
}
uj_mut() { # <nhãn> <bộ lọc sinh bản sao> <fixture phải chuyển XANH>
  eval "$2" > "$UJMUT" 2>/dev/null
  # (a) ban sao phai KHAC ban goc — khong khop nghia la nguon da troi
  if diff -q "$CHECK" "$UJMUT" >/dev/null 2>&1; then
    echo "     TIEM THAT BAI [$1]: bo loc khong khop, nguon da troi"
    check "UJ14-$1" 0 1; return
  fi
  # (b) ...va van phai chay duoc
  if ! uj_mut_usable "$UJMUT"; then
    echo "     TIEM THAT BAI [$1]: ban sao khong con la script chay duoc ($(wc -l < "$UJMUT")/$(wc -l < "$CHECK") dong)"
    check "UJ14-$1" 0 1; return
  fi
  bash "$UJMUT" "$3" >/dev/null 2>&1; check "UJ14-$1" 0 $?
}
uj_mut blk 'sed "s|if placeholder_signoff \\\"\$signoff\\\"; then|if false; then|" "$CHECK"' "$UJM_BLK"
# Hai call-site cua claims_released co van ban Y HET nhau, nen tach bang THU TU
# xuat hien (awk dem lan khop) chu khong bang noi dung.
uj_mut noc 'awk "/if claims_released/ { n++; if (n==1) { sub(/if claims_released .*; then/, \"if false; then\") } } { print }" "$CHECK"' "$UJM_NOC"
uj_mut fld 'awk "/if claims_released/ { n++; if (n==2) { sub(/if claims_released .*; then/, \"if false; then\") } } { print }" "$CHECK"' "$UJM_FLD"
uj_mut ctr 'sed "s|      implemented\|verified\|signed-off) return 0 ;;|      __khong_bao_gio__) return 0 ;;|" "$CHECK"' "$UJM_CTR"

echo "UJ14g uj_mut_usable phai TU CHOI ban sao khong chay duoc (meta-test cua chinh guard)"
# Guard nay la thu duy nhat chan xanh-gia cua UJ14. Neu no khong song thi moi
# "UJ14-* PASS" o tren co the chi la mot file rong thoat 0.
: > "$T/ujg-empty.sh";                       uj_mut_usable "$T/ujg-empty.sh"; check UJ14g-rong  1 $?
cp "$CHECK" "$T/ujg-ok.sh";                  uj_mut_usable "$T/ujg-ok.sh";    check UJ14g-nguyen 0 $?
head -20 "$CHECK" > "$T/ujg-cut.sh";         uj_mut_usable "$T/ujg-cut.sh";   check UJ14g-cut   1 $?
{ cat "$CHECK"; printf '\nif [ 1\n'; } > "$T/ujg-bad.sh"; uj_mut_usable "$T/ujg-bad.sh"; check UJ14g-cuphap 1 $?

echo "UJ14b tiem CHE DO GOI: boc chot chu ky sau --base -> UJ17-nobase phai do"
# Chung minh UJ17 la assertion SONG chu khong phai xanh-vinh-vien: neu luat chu
# ky bi boc vao nhanh chi song khi co --base thi lan chay KHONG base phai lot.
awk '/^  if placeholder_signoff "\$signoff"; then$/ { print "  if [ -n \"$BASE\" ] && placeholder_signoff \"$signoff\"; then"; next } { print }' "$CHECK" > "$UJMUT"
if diff -q "$CHECK" "$UJMUT" >/dev/null 2>&1 || ! uj_mut_usable "$UJMUT"; then
  echo "     TIEM THAT BAI [UJ14b]: bo loc khong khop hoac ban sao hong"; check UJ14b 0 1
else
  bash "$UJMUT" "$UJM_BLK" >/dev/null 2>&1; UJ14BST=$?
  bash "$UJMUT" "$UJM_BLK" --base "$(git -C "$UJM_BLK" rev-parse HEAD)" >/dev/null 2>&1; UJ14BST2=$?
  check UJ14b-nobase 0 "$UJ14BST"    # khong base -> lot (dung dieu UJ17 chan)
  check UJ14b-base   1 "$UJ14BST2"   # co base    -> van chan
fi

echo "UJ16 sinh lai evidence/unjudged-messages.txt roi diff byte-doi-byte"
# Cung khuon RL10/TE14: dem nhan chi do su DAY DU, khong do tinh XAC THUC.
# Bang chung cho judge phai duoc SINH LAI trong CHINH lan chay nay, neu khong
# judge dang cham mot ban chup cu ma khong ai biet no con dung khong.
UJMSG="$ROOT_REAL/_acceptance/premerge-unjudged-pass/evidence/unjudged-messages.txt"
UJ16NEW="$(mktemp)"
{
  printf '%s\n' '# Thông điệp luật PASS-chưa-ai-phán — SINH bởi tests/scripts/run-tests.sh (UJ16).'
  printf '%s\n' '# KHÔNG sửa tay: suite sinh lại file này mỗi lần chạy và diff byte-đối-byte.'
  printf '\n== chữ ký giữ-chỗ ==\n'
  uj_repo m2 ''; uj_slug "$UJR/m2" feat-p "$(uj_full feat-p)" "TBD"
  bash "$CHECK" "$UJR/m2" 2>&1 | grep -E '^VIOLATION'
  printf '\n== slug tàng hình: không có contract.md ==\n'
  uj_repo m4 '  approvers: ["Manh Phan"]'; uj_slug "$UJR/m4" feat-ghost - "Manh Phan 2026-06-20"
  bash "$CHECK" "$UJR/m4" 2>&1 | grep -E '^VIOLATION'
  printf '\n== slug tàng hình: thiếu risk_tier ==\n'
  uj_repo m5 '  approvers: ["Manh Phan"]'
  uj_slug "$UJR/m5" feat-notier 'schema_version: 1
feature: f
slug: feat-notier
surfaces: [api]
status: signed-off
approved_by: Manh Phan' "Manh Phan 2026-06-20"
  bash "$CHECK" "$UJR/m5" 2>&1 | grep -E '^VIOLATION'
} > "$UJ16NEW" 2>&1
if [ "${UJ16_WRITE:-0}" = "1" ]; then cp "$UJ16NEW" "$UJMSG"; echo "  (UJ16_WRITE=1 — đã ghi lại)"; fi
if diff -u "$UJMSG" "$UJ16NEW" > "$T/uj16.diff" 2>&1; then
  check UJ16 0 0
else
  echo "     evidence LECH voi thong diep hien tai:"; head -20 "$T/uj16.diff" | sed 's/^/     /'
  check UJ16 0 1
fi
# Chong troi PHAM VI: mat han mot nhanh thi diff van khop neu evidence CUNG
# sinh thieu — nen ghim tung nhanh co mat trong ban VUA SINH, khong phai trong
# file da commit.
UJ16M="$(cat "$UJ16NEW")"
hasout UJ16b "is a placeholder, not a signature" "$UJ16M"
hasout UJ16d "no contract.md" "$UJ16M"
hasout UJ16e "contract has no risk_tier" "$UJ16M"


# ─── GCV1 — canh bao mu criterion phai di RA DUONG NGUOI DUYET NHIN ──────────
# Ghep cap voi P62/P64 (don vi) theo mau GPM21: mot luat, hai loi vao. Mot canh
# bao chi ton tai trong ham thi khong ai thay — no phai nam trong HTML card that.
echo "GCV1 canh bao mu criterion tren card THAT (2 ca keu + 1 ca im)"
GCV="$T/gcv/_acceptance"
mk_gcv() { # <slug> <heading> <than>
  mkdir -p "$GCV/$1"
  { echo '---'; echo 'schema_version: 1'; echo "feature: probe $1"; echo "slug: $1";
    echo 'risk_tier: T2'; echo 'status: draft'; echo 'approved_by:'; echo '---'; echo '';
    echo "$2"; echo ''; shift 2; for l in "$@"; do echo "$l"; done; } > "$GCV/$1/contract.md"
}
mk_gcv blankcase '## Criteria' '- **AC-1**' '- **AC-2**' '- **AC-3**'
mk_gcv headcase  '## Acceptance criteria' '- AC-1: Given x, Then y.' '- AC-2: Given x, Then y.'
mk_gcv okcase    '## Criteria' '- AC-1: Given x, Then y.' '- AC-2: Given x, Then y.'
# Nhanh CUT (AC-11) cung phai ra toi card THAT, khong chi song o tang don vi:
# vai criterion khuon chuan xen giua khuon la -> parse duoc mot phan.
mk_gcv cutcase '## Criteria' '- AC-1: Given x, Then y.' '- AC-2: Given x, Then y.' '- **AC-3**' '- **AC-4**' '- **AC-5**' '- **AC-6**'
GCV_CUT="$(node "$GCARD" --root "$T/gcv" --slug cutcase --gate 1 2>&1)"
GCV_BLANK="$(node "$GCARD" --root "$T/gcv" --slug blankcase --gate 1 2>&1)"
GCV_HEAD="$(node "$GCARD" --root "$T/gcv" --slug headcase --gate 1 2>&1)"
GCV_OK="$(node "$GCARD" --root "$T/gcv" --slug okcase --gate 1 2>&1)"
hasout "GCV1a khuon la -> card neu KHONG doc duoc criterion nao" "KHÔNG đọc được criterion nào" "$GCV_BLANK"
hasout "GCV1b heading lech -> card neu ten heading sai" "## Acceptance criteria" "$GCV_HEAD"
hasout "GCV1c card mu phai bao dung KHONG duyet" "đừng duyệt" "$GCV_BLANK"
hasout "GCV1e nhanh CUT ra toi card that: card neu doc THIEU" "Đọc THIẾU" "$GCV_CUT"
hasout "GCV1f card cut cung bao dung duyet" "đừng duyệt" "$GCV_CUT"
case "$GCV_OK" in
  *"KHÔNG đọc được criterion nào"*|*"Đọc THIẾU"*)
    echo "  FAIL: GCV1d contract lanh bi canh bao (cry-wolf)"; FAIL_COUNT=$((FAIL_COUNT+1));;
  *) echo "  PASS: GCV1d contract lanh khong sinh canh bao nao"; PASS_COUNT=$((PASS_COUNT+1));;
esac

echo ""
echo "--- status-chua-arm-cong: hồ sơ chưa arm cổng không được tàng hình (ARM01–ARM12) ---"
# Fixture CODE-SINH bằng git, hai commit: c1 = base (config t1/t3 + src/app.js
# + core/k.js + docs/n.txt), c2 = nhánh PR (hồ sơ + thay đổi theo <pr>). Mọi
# lượt chạy `env -u PRE_MERGE_BASE`. Ma trận toàn phần viết trước trong thiết
# kế 2026-08-18-status-chua-arm-cong-design.md: mỗi ô ĐỎ ghim đúng câu, mỗi ô
# XANH kèm DẤU DƯƠNG cổng-đã-chạy (dòng sổ luật expected=4, hoặc dòng verdict
# nguyên văn) — không có ca âm-tính-một-mình.
ARM_MSG="hồ sơ có bằng chứng nhưng status chưa arm cổng"
mk_arm() { # <root> <status> <ev yes|no> <pr code|docs|t3|none> [<tier>] [<extra armed slug: yes>]
  local R="$1" st="$2" ev="$3" pr="$4" tier="${5:-T2}" extra="${6:-no}"
  rm -rf "$R"; mkdir -p "$R/src" "$R/core" "$R/docs" "$R/_acceptance/feat-arm"; git init -q "$R"
  printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n  t3_paths:\n    - "core/**"\n' > "$R/_acceptance/config.yaml"
  printf 'v1\n' > "$R/src/app.js"; printf 'c1\n' > "$R/core/k.js"; printf 'x\n' > "$R/docs/n.txt"
  printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  if [ "$extra" = yes ]; then
    # slug cũ ĐÃ ở base: approved + REJECT, ngoài diff PR (sử liệu)
    printf -- '---\nschema_version: 1\nfeature: old\nslug: feat-old\nrisk_tier: T2\nsurfaces: [api]\nstatus: approved\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' > "$R/_acceptance/feat-arm/contract.md"
    mv "$R/_acceptance/feat-arm" "$R/_acceptance/feat-old"; mkdir -p "$R/_acceptance/feat-arm"
    printf -- '---\nschema_version: 1\nfeature_slug: feat-old\nverdict: REJECT\nhuman_signoff:\n---\n' > "$R/_acceptance/feat-old/evidence-report.md"
  fi
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm base
  if [ "$pr" != none ] || [ "$st" != none ]; then
    if [ "$st" != none ]; then
      printf -- '---\nschema_version: 1\nfeature: f\nslug: feat-arm\nrisk_tier: %s\nsurfaces: [api]\nstatus: %s\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' "$tier" "$st" > "$R/_acceptance/feat-arm/contract.md"
      [ "$ev" = yes ] && printf -- '---\nschema_version: 1\nfeature_slug: feat-arm\nverdict: REJECT\nhuman_signoff:\n---\n' > "$R/_acceptance/feat-arm/evidence-report.md"
    else
      rmdir "$R/_acceptance/feat-arm" 2>/dev/null || true
    fi
    case "$pr" in code) printf 'v2\n' > "$R/src/app.js" ;; docs) printf 'y\n' > "$R/docs/n.txt" ;; t3) printf 'c2\n' > "$R/core/k.js" ;; esac
    git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
  fi
}
arm_run() { # <root> [--base] → stdout vào ARM_OUT, exit vào ARM_RC
  if [ "${2:-}" = "--base" ]; then ARM_OUT="$(env -u PRE_MERGE_BASE bash "$CHECK" "$1" --base HEAD~1 2>&1)"; ARM_RC=$?
  else ARM_OUT="$(env -u PRE_MERGE_BASE bash "$CHECK" "$1" 2>&1)"; ARM_RC=$?; fi
}

echo "ARM01 đối chứng dương: implemented + REJECT + PR đổi code → cổng CHẠY (verdict nổ), KHÔNG dòng chưa-arm"
mk_arm "$T/arm01" implemented yes code; arm_run "$T/arm01" --base
check ARM01 1 $ARM_RC
hasout "ARM01-verdict" "VIOLATION [feat-arm]: verdict=REJECT (must be PASS to merge)" "$ARM_OUT"
nothas "ARM01-noarm" "$ARM_MSG" "$ARM_OUT"

echo "ARM02 chiều đỏ (a) — tái hiện vòng 4: approved + REJECT + PR đổi code → chưa arm cổng"
mk_arm "$T/arm02" approved yes code; arm_run "$T/arm02" --base
check ARM02 1 $ARM_RC
hasout "ARM02-msg" "VIOLATION [feat-arm]: $ARM_MSG" "$ARM_OUT"
hasout "ARM02-verdict" "verdict=REJECT" "$ARM_OUT"

echo "ARM03 chiều đỏ (b): draft, không evidence, PR đổi src/app.js → chưa arm cổng nêu tên file"
mk_arm "$T/arm03" draft no code; arm_run "$T/arm03" --base
check ARM03 1 $ARM_RC
hasout "ARM03-msg" "VIOLATION [feat-arm]: $ARM_MSG" "$ARM_OUT"
hasout "ARM03-file" "PR đổi code chịu cổng (src/app.js" "$ARM_OUT"

echo "ARM04 đường đọc-cũ (hạt giống): draft, không evidence, PR chỉ đổi docs/ → clean + dấu dương"
mk_arm "$T/arm04" draft no docs; arm_run "$T/arm04" --base
check ARM04 0 $ARM_RC
nothas "ARM04-noarm" "$ARM_MSG" "$ARM_OUT"
hasout "ARM04-ran" "expected=4" "$ARM_OUT"

echo "ARM05 đường đọc-cũ (sử liệu): slug cũ approved+REJECT ngoài diff, slug mới armed trong diff → không nổ cho slug cũ"
mk_arm "$T/arm05" implemented yes code T2 yes; arm_run "$T/arm05" --base
nothas "ARM05-old-quiet" "[feat-old]: $ARM_MSG" "$ARM_OUT"
hasout "ARM05-new-judged" "VIOLATION [feat-arm]: verdict=REJECT (must be PASS to merge)" "$ARM_OUT"
hasout "ARM05-ran" "expected=4" "$ARM_OUT"

echo "ARM06 không --base (fail-safe a): approved + REJECT → nổ như xét mọi slug"
mk_arm "$T/arm06" approved yes code; arm_run "$T/arm06"
check ARM06 1 $ARM_RC
hasout "ARM06-msg" "VIOLATION [feat-arm]: $ARM_MSG" "$ARM_OUT"

echo "ARM07 không --base (đọc-cũ): draft không evidence → clean (S04 vẫn đúng) + dấu dương"
mk_arm "$T/arm07" draft no code; arm_run "$T/arm07"
check ARM07 0 $ARM_RC
nothas "ARM07-noarm" "$ARM_MSG" "$ARM_OUT"
hasout "ARM07-ran" "expected=4" "$ARM_OUT"

echo "ARM08 T1-escape không đổi (nhánh non-T1): PR đổi src/app.js KHÔNG kèm _acceptance/ → thông điệp nguyên văn"
mk_arm "$T/arm08" none no code; arm_run "$T/arm08" --base
check ARM08 1 $ARM_RC
hasout "ARM08-msg" "VIOLATION [PR]: non-T1 files changed (outside t1_skip_globs) but the PR carries NO _acceptance/<slug>/ artifacts" "$ARM_OUT"
hasout "ARM08-ran" "expected=4" "$ARM_OUT"

echo "ARM08b T1-escape không đổi (nhánh t3): PR đổi core/k.js KHÔNG kèm _acceptance/ → thông điệp nguyên văn"
mk_arm "$T/arm08b" none no t3; arm_run "$T/arm08b" --base
check ARM08b 1 $ARM_RC
hasout "ARM08b-msg" "VIOLATION [PR]: T3 paths (t3_paths) changed but the PR carries NO _acceptance/<slug>/ artifacts" "$ARM_OUT"
hasout "ARM08b-file" "core/k.js" "$ARM_OUT"
hasout "ARM08b-ran" "expected=4" "$ARM_OUT"

echo "ARM09 (b) độc lập với status: approved, không evidence, PR đổi code → chưa arm cổng"
mk_arm "$T/arm09" approved no code; arm_run "$T/arm09" --base
check ARM09 1 $ARM_RC
hasout "ARM09-msg" "VIOLATION [feat-arm]: $ARM_MSG" "$ARM_OUT"
hasout "ARM09-file" "PR đổi code chịu cổng (" "$ARM_OUT"

echo "ARM10 (a) độc lập với (b): approved + REJECT, PR chỉ đổi docs/ → vẫn nổ theo evidence"
mk_arm "$T/arm10" approved yes docs; arm_run "$T/arm10" --base
check ARM10 1 $ARM_RC
hasout "ARM10-msg" "VIOLATION [feat-arm]: $ARM_MSG" "$ARM_OUT"
hasout "ARM10-verdict" "verdict=REJECT" "$ARM_OUT"

echo "ARM11 (b) qua nhánh t3_paths: draft, không evidence, PR đổi core/k.js → chưa arm cổng nêu tên file t3"
mk_arm "$T/arm11" draft no t3; arm_run "$T/arm11" --base
check ARM11 1 $ARM_RC
hasout "ARM11-msg" "VIOLATION [feat-arm]: $ARM_MSG" "$ARM_OUT"
hasout "ARM11-file" "PR đổi code chịu cổng (core/k.js" "$ARM_OUT"

echo "ARM12 tier ngoài required_for: T1 + approved + REJECT + PR đổi code → im như cũ + dấu dương"
mk_arm "$T/arm12" approved yes code T1; arm_run "$T/arm12" --base
check ARM12 0 $ARM_RC
nothas "ARM12-noarm" "$ARM_MSG" "$ARM_OUT"
hasout "ARM12-ran" "expected=4" "$ARM_OUT"

# Lượt phá-thử (MEASURE-BIRTH-CLAUSE): bản sao script gỡ vế (a) → ARM02 phải
# ĐỎ đích danh; đối chứng: bản sao nguyên vẹn vẫn xanh trên cùng fixture.
echo "ARM13 mutant: bản sao pre-merge gỡ vế (a) → ARM02 mất dòng chưa-arm (phép đo phân biệt được)"
ARM_MUT="$T/arm-mut.sh"; cp "$CHECK" "$ARM_MUT"
ARM_MUT_OUT_OK="$(env -u PRE_MERGE_BASE bash "$ARM_MUT" "$T/arm02" --base HEAD~1 2>&1)"
sed -i.bak 's/if \[ -f "\$dir\/evidence-report.md" \] \&\& { \[ "\$DIFF_READY" -eq 0 \] || slug_in_diff "\$slug"; }; then/if false; then/' "$ARM_MUT"
ARM_MUT_OUT="$(env -u PRE_MERGE_BASE bash "$ARM_MUT" "$T/arm02" --base HEAD~1 2>&1)"
if [ "$ARM_MUT_OUT_OK" = "$ARM_MUT_OUT" ]; then echo "  FAIL: ARM13 (mutant không đổi output — sed không trúng, phép đo không sống)"; FAIL_COUNT=$((FAIL_COUNT+1)); else echo "  PASS: ARM13"; PASS_COUNT=$((PASS_COUNT+1)); fi
hasout "ARM13-ctrl" "verdict=REJECT đã có" "$ARM_MUT_OUT_OK"
nothas "ARM13-mut" "verdict=REJECT đã có" "$ARM_MUT_OUT"
rm -f "$ARM_MUT" "$ARM_MUT.bak"

echo ""
echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ] || exit 1
