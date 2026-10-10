#!/usr/bin/env bash
# chay-p200-p33.sh — hồ sơ dieu-phoi-dong-goi-loi, AC-9 (E9).
# Chạy riêng hai khối P200 và P33 của suite plugins (ONLY_BLOCK) và giữ dòng PASS/FAIL cùng các
# dòng vế của chúng, gộp thành MỘT dòng — lượt chấm chỉ giữ vài dòng cuối của lệnh xanh, còn khoá
# `plugins` lọc bỏ dòng PASS. Mã thoát = mã của suite (khối nào đỏ thì đỏ).
set -o pipefail
GOC="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOC='P200 (VE|OK)|P33 VUNG|[[]chieu do]|PASS: P(200|33)|FAIL|^Results:'

ra200="$(ONLY_BLOCK=P200 bash "$GOC/tests/plugins/run-tests.sh" 2>&1)"; ma200=$?
ra33="$(ONLY_BLOCK='P33 no source' bash "$GOC/tests/plugins/run-tests.sh" 2>&1)"; ma33=$?

printf '%s\n%s\n' "$ra200" "$ra33" | grep -E "$LOC" | paste -sd'|' -
[ "$ma200" -eq 0 ] && [ "$ma33" -eq 0 ]
