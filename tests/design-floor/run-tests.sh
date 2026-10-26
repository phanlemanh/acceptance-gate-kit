#!/usr/bin/env bash
# design-floor bước 1: rào đóng kín + bộ đo hợp đồng nhập + chiều đỏ của chính hai bộ đó.
# Nguồn sự thật: design-floor/HOP-DONG-NHAP.md (khối máy). Cần mạng ở lượt đầu để lấy bản
# upstream đã ghim về cache ($DESIGN_FLOOR_CACHE, mặc định $TMPDIR/design-floor-upstream/<commit>).
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -d "$HERE/node_modules/esbuild" ] || { echo "design-floor: thiếu esbuild — chạy: npm ci --prefix tests/design-floor" >&2; exit 2; }
st=0
node "$HERE/rao-dong.mjs" || st=1
node "$HERE/hop-dong.mjs" || st=1
node "$HERE/tu-thu.mjs" || st=1
exit "$st"
