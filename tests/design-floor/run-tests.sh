#!/usr/bin/env bash
# design-floor: sổ vá + rào đóng kín + bản gói (rao-dong) · bộ đo hợp đồng nhập trên bản gói (hop-dong) ·
# chiều đỏ của chính các bộ đó (tu-thu) · móc S0/S1 của vòng (moc-s0-s1, hồ sơ design-floor-moc-s0-s1). Nguồn sự
# thật: khối máy của design-floor/HOP-DONG-NHAP.md và design-floor/LOCAL-PATCHES.md. Chạy NGOẠI TUYẾN trên bản vendored
# trong kit; CI đặt DESIGN_FLOOR_KHONG_MANG=1. Hai đường chạm mạng: tests/design-floor/dong-bo.mjs (đổi ghim, đổi bản vá)
# và ca TT-THAT của moc-s0-s1.mjs (tải chỉ mục tri thức thật — in SKIP có tên khi không mạng).
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -d "$HERE/node_modules/esbuild" ] || { echo "design-floor: thiếu esbuild — chạy: npm ci --prefix tests/design-floor" >&2; exit 2; }
st=0
node "$HERE/rao-dong.mjs" || st=1
node "$HERE/hop-dong.mjs" || st=1
node "$HERE/tu-thu.mjs" || st=1
node "$HERE/moc-s0-s1.mjs" || st=1
exit "$st"
