#!/usr/bin/env bash
# Regression for the design-quality executor (scripts/design-gate.mjs + lib/design-detect.mjs).
# Mirrors the repo convention: check() PASS/FAIL on exit codes.
#
#   B-static (zero-dep) runs always.
#   B-DOM    runs only when jsdom is installed here (npm i in this folder).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
PASS_COUNT=0; FAIL_COUNT=0; SKIP_COUNT=0

check() { # <name> <expected_exit> <actual_exit>
  if [ "$2" -eq "$3" ]; then
    echo "  PASS: $1"; PASS_COUNT=$((PASS_COUNT+1))
  else
    echo "  FAIL: $1 (expected exit $2, got $3)"; FAIL_COUNT=$((FAIL_COUNT+1))
  fi
}

echo "T01 B-static recall >= baseline"
node score.mjs --assert static; check T01 0 $?

# Static can see P1 tells (side-tab) but NOT P0 contrast — so the static guard
# gates on P0,P1. The P0-only gate is DOM's job (T04/T05).
echo "T02 static gate REJECTs a P1 tell it can see (side-tab, --fail-on P0,P1)"
node "$HERE/../../scripts/design-gate.mjs" "$HERE/fixtures/f04-side-tab.html" --mode static --fail-on P0,P1 >/dev/null 2>&1
check T02 2 $?

echo "T03 static gate PASSes the clean fixture (--fail-on P0,P1)"
node "$HERE/../../scripts/design-gate.mjs" "$HERE/fixtures/f09-clean-good.html" --mode static --fail-on P0,P1 >/dev/null 2>&1
check T03 0 $?

if node -e "import('jsdom').then(()=>process.exit(0)).catch(()=>process.exit(1))" 2>/dev/null; then
  echo "T04 B-DOM recall >= baseline + P0(f03) rejected + clean(f09) passed"
  node score.mjs --assert dom; check T04 0 $?

  echo "T05 production gate (DOM) REJECTs the P0 contrast fixture f03"
  node "$HERE/../../scripts/design-gate.mjs" "$HERE/fixtures/f03-low-contrast.html" --mode dom --jsdom "$HERE" >/dev/null 2>&1
  check T05 2 $?
else
  echo "  SKIP: B-DOM tests (jsdom not installed — run 'npm i' in tests/design-eval)"
  SKIP_COUNT=$((SKIP_COUNT+2))
fi

echo "T06 design-scan.js is in sync with its build (no drift)"
node "$HERE/../../scripts/build-design-scan.mjs" --check >/dev/null 2>&1
check T06 0 $?

echo ""
echo "design-eval: $PASS_COUNT passed, $FAIL_COUNT failed, $SKIP_COUNT skipped"
[ "$FAIL_COUNT" -eq 0 ]
