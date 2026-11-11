#!/usr/bin/env bash
# Unit tests for the feature-loop Workflow scripts' PURE layer.
# harness.mjs loads the REAL files in a vm realm with faithful stand-ins for
# the Workflow harness globals (agent/parallel/pipeline/phase/log) — so the
# deterministic logic (dedupe, merge, verdict routing, run-log, model routing)
# is pinned by tests without spawning a single agent.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
# <<<BO-CHAY — hồ sơ luot-kiem-nhe: tự xưng + tự so Node TRƯỚC ca đầu, và bảng thời gian từng tệp ca.
if [ -f "$HERE/../bo-chay.sh" ]; then
  . "$HERE/../bo-chay.sh"; bc_node "$HERE/../.." || exit 3
else
  echo "bo-chay: không thấy tests/bo-chay.sh cạnh bộ chạy (bản chép?) — không kiểm Node, không đo thời gian" >&2
  bc_tg_mo() { :; }; bc_tg_ca() { :; }; bc_tg_dong() { :; }
fi
bc_tg_mo workflows all "$HERE/../.."
# BO-CHAY>>>
fail=0

for f in "$HERE"/*.test.mjs; do
  echo "=== $(basename "$f") ==="
  node "$f" || fail=1
  echo ""
done
bc_tg_dong

if [ "$fail" -ne 0 ]; then
  echo "Results: workflow tests FAILED"
  exit 1
fi
echo "Results: all workflow tests passed"
