#!/usr/bin/env bash
# kdd.sh — chạy một nhóm ca KD của hồ sơ design-gate-khong-do-duoc-ba-nguyen-nhan.
#
#   bash tests/design-eval/kdd.sh KD1           # nhóm ca theo tiền tố (luôn kèm KD0: jsdom đúng bản ghim)
#   bash tests/design-eval/kdd.sh --hoi-quy     # KD8: design-eval đầy đủ, thiếu jsdom, bản vendored
#   bash tests/design-eval/kdd.sh --lenh-ci     # in hai lệnh job CI design-eval — một nguồn cho gate.yml và ca KD8-ci
#
# jsdom vắng → cài đúng bản khoá trong package-lock.json (npm ci) rồi mới chạy.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"

lenh_ci() {
  printf '%s\n' \
    "npm ci --prefix tests/design-eval --no-audit --no-fund" \
    "DESIGN_EVAL_CAN_DOM=1 bash tests/design-eval/run-tests.sh"
}

case "${1:-}" in
  --lenh-ci) lenh_ci; exit 0 ;;
  "") echo "kdd: thiếu nhóm ca (vd KD1, --hoi-quy)" >&2; exit 4 ;;
esac

if [ ! -f "$HERE/node_modules/jsdom/package.json" ]; then
  npm ci --prefix "$HERE" --no-audit --no-fund >&2 || { echo "kdd: không cài được jsdom ghim (npm ci)" >&2; exit 3; }
fi

case "$1" in
  --hoi-quy) exec node "$HERE/khong-do-duoc.test.mjs" --ca KD0,KD8-design-eval,KD8-thieu-jsdom,KD8-vendor ;;
  *) exec node "$HERE/khong-do-duoc.test.mjs" --ca "KD0,$1" ;;
esac
