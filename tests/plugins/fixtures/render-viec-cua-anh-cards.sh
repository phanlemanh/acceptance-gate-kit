#!/usr/bin/env bash
# Sinh 3 thẻ bằng chứng của chip ② (khối 👉 VIỆC CỦA ANH) bằng CHÍNH
# scripts/gate-card.js của cây đang kiểm, từ fixture code-sinh trong lần chạy.
#
# Vì sao tồn tại: E7 (judgment) chấm ba file HTML dưới
# `_acceptance/khoi-viec-cua-anh/evidence/`. Nếu chúng là ảnh chụp đóng băng thì
# renderer đổi mà judge vẫn chấm bản cũ — "snapshot không ghim vào corpus sống"
# (S4-r1, finding đo-lường). P190 gọi script này rồi so byte-đối-byte, nên ba
# file kia luôn là VẬT ĐƯỢC GIAO của cây hiện tại.
#
# Kịch bản fixture KHÔNG viết ở đây: nó nằm ở `viec-cua-anh-scenarios.sh` mà
# khối P186/P186b/P187 trong run-tests.sh cũng source — một chỗ giữ kịch bản,
# hai bên đọc lại (S4-r2: hai bản heredoc chép tay từng trôi khỏi nhau).
#
# Dùng: render-viec-cua-anh-cards.sh <thư mục đích>
# ROOT suy từ vị trí script (không hardcode checkout của tác giả).
set -euo pipefail
OUT="${1:?can thu muc dich}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"
. "$HERE/viec-cua-anh-scenarios.sh"
WS="$(mktemp -d)"
trap 'rm -rf "$WS"' EXIT
mkdir -p "$OUT"

emit() { # emit <kịch bản> <tên file>
  vca_scenario "$1" "$WS"
  { printf '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">\n'
    node "$ROOT/scripts/gate-card.js" --root "$WS" --slug fx; } > "$OUT/$2"
}

emit gate1-draft          p185-card-gate1.html
emit gate2-4loai          p186-card-gate2.html
emit gate2-reject         p187-card-gate2-reject.html
