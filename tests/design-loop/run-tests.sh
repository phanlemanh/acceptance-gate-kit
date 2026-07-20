#!/usr/bin/env bash
# design-loop fixture tests — design-static-check.mjs.
#
# D03/D04 pin the parseColor transparent-regex regression: the old pattern
# rgba?\([^)]*,\s*0\s*\)$ treated EVERY rgb() whose last channel is 0 (black,
# pure red/orange/yellow) as transparent, silently skipping it from the
# contrast-AA BLOCK layer.
#
# Contrast cases need jsdom; the runner reuses tests/design-eval/node_modules
# (design-static-check's own fallback when run from the repo root). Without
# jsdom they SKIP loudly rather than fail.
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SC="$ROOT/design-loop/scripts/design-static-check.mjs"
FIX="$ROOT/tests/design-loop/fixtures"
cd "$ROOT" # design-static-check probes ./tests/design-eval for jsdom from cwd

failures=0
pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1"; failures=$((failures + 1)); }

expect_exit() { # <name> <want-exit> <cmd...>
  local name="$1" want="$2"
  shift 2
  local out got
  out="$("$@" 2>&1)"
  got=$?
  if [ "$got" -eq "$want" ]; then
    pass "$name"
  else
    fail "$name (exit $got, want $want)"
    echo "$out" | head -6 | sed 's/^/    /'
  fi
}

echo "token-only (source mode)"
expect_exit "D01 raw hex outside the token layer REJECTs" 2 node "$SC" "$FIX/src-raw-hex"
expect_exit "D02 var()-only source PASSes (hex allowed in --token: lines)" 0 node "$SC" "$FIX/src-clean"
expect_exit "D07 raw px in spacing property REJECTs (layout-token-only)" 2 node "$SC" "$FIX/src-raw-px"
expect_exit "D08 token-def px + var() fallback + allow-list PASSes" 0 node "$SC" "$FIX/src-px-clean"
expect_exit "D09 Tailwind arbitrary spacing value REJECTs" 2 node "$SC" "$FIX/src-raw-px-tsx"
expect_exit "D10 violation with trailing --token comment still REJECTs (comment-bypass regression)" 2 node "$SC" "$FIX/src-raw-px-comment"

echo "contrast-AA (rendered mode)"
if node -e "require.resolve('jsdom', { paths: ['$ROOT/tests/design-eval'] })" >/dev/null 2>&1; then
  expect_exit "D03 black text on black bg REJECTs (parseColor regression)" 2 node "$SC" --html "$FIX/f-black-on-black.html"
  expect_exit "D04 white text on black bg PASSes (effectiveBg regression)" 0 node "$SC" --html "$FIX/f-white-on-black.html"
  expect_exit "D05 rgba alpha-0 text stays skipped (transparent by design)" 0 node "$SC" --html "$FIX/f-alpha-zero.html"
  expect_exit "D06 #999 on white REJECTs (hex path sanity)" 2 node "$SC" --html "$FIX/f-low-contrast.html"
else
  echo "  SKIP: D03-D06 need jsdom — npm install in tests/design-eval first"
fi

if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi

echo
echo "Results: all design-loop tests passed"
exit 0
