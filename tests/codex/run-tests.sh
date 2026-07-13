#!/usr/bin/env bash
set -u

HERE="$(cd "$(dirname "$0")" && pwd)"
failures=0

for test_file in "$HERE"/*.test.mjs; do
  echo "=== $(basename "$test_file") ==="
  if ! node "$test_file"; then
    failures=$((failures + 1))
  fi
  echo
done

if [ "$failures" -ne 0 ]; then
  echo "Results: $failures Codex suite(s) failed"
  exit 1
fi

echo "Results: all Codex suites passed"
