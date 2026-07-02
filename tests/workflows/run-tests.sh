#!/usr/bin/env bash
# Unit tests for the feature-loop Workflow scripts' PURE layer.
# harness.mjs loads the REAL files in a vm realm with faithful stand-ins for
# the Workflow harness globals (agent/parallel/pipeline/phase/log) — so the
# deterministic logic (dedupe, merge, verdict routing, run-log, model routing)
# is pinned by tests without spawning a single agent.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
fail=0

for f in "$HERE"/*.test.mjs; do
  echo "=== $(basename "$f") ==="
  node "$f" || fail=1
  echo ""
done

if [ "$fail" -ne 0 ]; then
  echo "Results: workflow tests FAILED"
  exit 1
fi
echo "Results: all workflow tests passed"
