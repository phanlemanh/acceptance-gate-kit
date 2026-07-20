#!/usr/bin/env bash
# ux-ui-craft layout-meter tests — analyze() pure core under plain node.
#
# The HTML fixtures in fixtures/ are BROWSER-verified (jsdom has no layout
# engine): open each in a real browser, evaluate measure_layout.js, run
# __measureLayout(), and compare against the invariants in
# fixtures/expected-*.json. This runner covers the pure core only and says so.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if node "$HERE/analyze-tests.js"; then
  echo "  SKIP: fixture HTML checks need a real browser (see header comment)"
  echo
  echo "Results: all ux-ui-craft tests passed"
  exit 0
else
  echo
  echo "Results: analyze() tests FAILED"
  exit 1
fi
