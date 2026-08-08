#!/usr/bin/env bash
# AC-7 — audit MỌI lối gọi node nội tuyến trong pre-merge-check.sh.
#
# Vì sao tách khỏi phép quét chung (AC-6): các đoạn `node -e '…require(…)'`
# KHÔNG nêu tên file trong chuỗi require — chúng nhận đường dẫn qua biến
# ($WSREC_LIB, $AC_LINE_LIB, $GP_LIB), nên một grep theo tên file có thể xanh
# trong khi biến vẫn trỏ .js. Ở đây đo BIẾN: mọi biến *_LIB và mọi tham số
# đường-dẫn-file truyền cho node phải kết thúc bằng .cjs.
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PM="$ROOT/scripts/pre-merge-check.sh"
[ -f "$PM" ] || { echo "FAIL: không thấy $PM" >&2; exit 2; }

# Mọi dòng gán biến trỏ tới một file dưới lib/ hoặc scripts/
assigns="$(grep -nE '^[[:space:]]*(RECHECK|GP_LIB|WSREC_LIB|AC_LINE_LIB)=' "$PM")"
n_assign="$(printf '%s\n' "$assigns" | grep -c . )"
# Mọi lối gọi node
calls="$(grep -nE '\bnode (-e|"\$|\$)' "$PM")"
n_call="$(printf '%s\n' "$calls" | grep -c . )"

echo "sanity: ${n_assign} biến đường-dẫn-lib · ${n_call} lối gọi node trong pre-merge-check.sh"
printf '%s\n' "$assigns" | sed 's/^/  gán:  /'
printf '%s\n' "$calls"   | sed 's/^/  gọi:  /'

rc=0
if [ "$n_assign" -lt 3 ] || [ "$n_call" -lt 3 ]; then
  echo "FAIL: sanity counter dưới sàn (mong ≥3 gán và ≥3 lối gọi) — phép nhận diện hỏng, kết luận vô nghĩa" >&2
  rc=1
fi

# Mọi biến đường-dẫn-lib phải kết thúc .cjs
bad_assign="$(printf '%s\n' "$assigns" | grep -vE '\.cjs"?$' | grep -E '=' || true)"
if [ -n "$bad_assign" ]; then
  echo "FAIL: biến đường-dẫn-lib KHÔNG trỏ .cjs (sẽ nổ ReferenceError trong repo type:module):" >&2
  printf '%s\n' "$bad_assign" | sed 's/^/    /' >&2
  rc=1
fi

# Mọi tham số file .js truyền cho node ở BẤT KỲ đâu trong file
bad_js="$(grep -nE 'node[^|]*[A-Za-z_/.-]+\.js\b' "$PM" | grep -v '^\s*#' || true)"
if [ -n "$bad_js" ]; then
  echo "FAIL: còn lối gọi node trỏ file .js:" >&2
  printf '%s\n' "$bad_js" | sed 's/^/    /' >&2
  rc=1
fi

# Đoạn `node -e` require sibling theo tên (md-section cạnh ac-line) — kiểm nguyên văn
sib="$(grep -nE 'dirname "\$AC_LINE_LIB"\)/[a-z-]+\.' "$PM" || true)"
if [ -n "$sib" ] && ! printf '%s\n' "$sib" | grep -q '\.cjs'; then
  echo "FAIL: require sibling trong node -e không trỏ .cjs: $sib" >&2
  rc=1
fi

[ "$rc" -eq 0 ] && echo "INLINE-NODE OK"
exit "$rc"
