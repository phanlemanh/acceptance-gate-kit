#!/usr/bin/env bash
# Chạy đúng các ca LV<k> được nêu của tests/plugins/lan-v.test.mjs, ghim dòng PASS của từng ca: chọn nhầm tên thì không xanh.
HERE="$(cd "$(dirname "$0")" && pwd)"
out="$(node "$HERE/../../../tests/plugins/lan-v.test.mjs" "$@" 2>&1)"; rc=$?
printf '%s\n' "$out" | tail -n 25
[ "$rc" -eq 0 ] || exit 1
for c in "$@"; do printf '%s\n' "$out" | grep -q "^PASS: $c " || { echo "chay-ca: thieu PASS cua $c"; exit 1; }; done
