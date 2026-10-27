#!/usr/bin/env bash
# design-floor: sổ vá + rào đóng kín + bản gói (rao-dong) · bộ đo hợp đồng nhập trên bản gói (hop-dong) ·
# chiều đỏ của chính các bộ đó (tu-thu). Nguồn sự thật: khối máy của design-floor/HOP-DONG-NHAP.md và
# design-floor/LOCAL-PATCHES.md. Chạy NGOẠI TUYẾN trên bản vendored trong kit; CI đặt DESIGN_FLOOR_KHONG_MANG=1.
# Đường duy nhất chạm mạng là tests/design-floor/dong-bo.mjs (đổi ghim, đổi bản vá).
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -d "$HERE/node_modules/esbuild" ] || { echo "design-floor: thiếu esbuild — chạy: npm ci --prefix tests/design-floor" >&2; exit 2; }
st=0
node "$HERE/rao-dong.mjs" || st=1
node "$HERE/hop-dong.mjs" || st=1
node "$HERE/tu-thu.mjs" || st=1
exit "$st"
