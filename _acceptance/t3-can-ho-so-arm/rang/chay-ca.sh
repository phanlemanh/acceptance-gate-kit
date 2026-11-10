#!/usr/bin/env bash
# Chạy đúng các ca HA<k> được nêu, ghim số ca chọn và dòng PASS của từng ca: chọn nhầm tên thì không xanh.
HERE="$(cd "$(dirname "$0")" && pwd)"
out="$(node "$HERE/../../../tests/scripts/t3-can-ho-so-arm.test.mjs" "$@" 2>&1)"; rc=$?
printf '%s\n' "$out" | tail -n 25
[ "$rc" -eq 0 ] || exit 1
printf '%s\n' "$out" | grep -qxF "Results: $# passed, 0 failed" || { echo "chay-ca: thieu dong Results cho $# ca"; exit 1; }
for c in "$@"; do printf '%s\n' "$out" | grep -qxF "PASS: $c" || { echo "chay-ca: thieu PASS cua $c"; exit 1; }; done
