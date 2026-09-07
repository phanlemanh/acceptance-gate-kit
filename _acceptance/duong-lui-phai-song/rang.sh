#!/usr/bin/env bash
# Răng hồ sơ duong-lui-phai-song — mỗi chân dựng fixture CODE-SINH (fixture.mjs:
# kho git tạm có lib/scripts vendored, một hồ sơ, hai commit), có đối chứng dương
# và chiều đỏ ghim thông điệp. Chiều đỏ của PHÉP ĐO: bản sao trọn `scripts lib`
# của kit bị tiêm một phép thay thế nguyên văn (mũi tiêm phải trúng đúng 1 lần,
# mutant phải chạy được), rồi fixture dựng lại với vendorFrom=bản sao.
# Đường dẫn suy từ vị trí script; không hardcode ROOT.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
PASS=0; FAIL=0
ok()  { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad() { echo "  DO: $1"; FAIL=$((FAIL+1)); }
done_chan() { echo "Results: chan ${CHAN} $( [ $FAIL -eq 0 ] && echo passed || echo FAILED ) (${PASS} pass, ${FAIL} do)"; [ $FAIL -eq 0 ] || exit 1; exit 0; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

CHAN=""
while [ $# -gt 0 ]; do case "$1" in --chan) CHAN="$2"; shift 2;; *) echo "rang.sh: tham số lạ $1"; exit 3;; esac; done
[ -n "$CHAN" ] || { echo "rang.sh: thiếu --chan"; exit 3; }

# mk_repo '<json opts>' → FX_ROOT, FX_A, FX_B
mk_repo() {
  local out; out="$(node "$HERE/fixture.mjs" "$1")" || { echo "rang.sh: fixture.mjs lỗi với $1"; exit 3; }
  FX_ROOT="$(printf '%s\n' "$out" | sed -n 1p)"; FX_A="$(printf '%s\n' "$out" | sed -n 2p)"; FX_B="$(printf '%s\n' "$out" | sed -n 3p)"
}
# pmc <root> [args…] → OUT (stdout+stderr), RC; VIOL = số dòng VIOLATION
pmc() { local root="$1"; shift; OUT="$(bash "$root/scripts/pre-merge-check.sh" "$root" "$@" 2>&1)"; RC=$?; VIOL="$(printf '%s\n' "$OUT" | grep -c '^VIOLATION' || true)"; }
# copy_tree [sha] → COPY: bản sao TRỌN scripts + lib (+ commands, skills, feature-loop, tests khi cần)
copy_tree() {
  local d="$TMP/copy-$RANDOM"; mkdir -p "$d"
  if [ -n "${1:-}" ]; then git -C "$KIT" archive "$1" scripts lib | tar -x -C "$d"
  else rsync -a --exclude .git --exclude node_modules --exclude .claude --exclude _acceptance --exclude docs "$KIT/" "$d/"; fi
  COPY="$d"
}
# inject <tên> <file tương đối trong COPY> <trước> <sau> — thay nguyên văn đúng 1 lần; mutant phải chạy được
inject() {
  local name="$1" rel="$2" before="$3" after="$4" f="$COPY/$2"
  COUNT=$(python3 - "$f" "$before" "$after" <<'PY'
import sys
f,b,a=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(f,encoding='utf8').read(); n=s.count(b)
if n==1: open(f,'w',encoding='utf8').write(s.replace(b,a))
print(n)
PY
)
  if [ "$COUNT" != "1" ]; then bad "đột biến $name: mẫu nguyên văn khớp $COUNT lần (cần đúng 1) — mũi tiêm KHÔNG trúng"; return 1; fi
  if cmp -s "$KIT/$rel" "$f"; then bad "đột biến $name: bản sao BẰNG bản thật sau khi tiêm"; return 1; fi
  case "$rel" in
    *.sh) bash -n "$f" 2>/dev/null || { bad "đột biến $name: mutant lỗi cú pháp bash"; return 1; } ;;
    *.cjs|*.mjs|*.js) node --check "$f" 2>/dev/null || { bad "đột biến $name: mutant lỗi cú pháp node"; return 1; } ;;
  esac
  ok "đột biến $name: mũi tiêm trúng, mutant chạy được"
}
has() { printf '%s\n' "$1" | grep -qF -- "$2"; }

case "$CHAN" in
  fixture-song)
    # Đối chứng dương của KHUÔN: fixture nguyên vẹn đi làn V xanh-sạch qua lưới; phá một
    # mục → lưới đòi chữ ký. Mọi chân sau dựa vào hai chiều này.
    mk_repo '{}'
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "NOTE [fx]: xanh-sạch" && [ "$VIOL" = 0 ]; then ok "fixture nguyên vẹn: xanh-sạch, 0 VIOLATION"; else bad "fixture nguyên vẹn không xanh-sạch (rc=$RC): $(printf '%s\n' "$OUT" | grep -E 'VIOLATION|NOTE \[fx\]' | head -3)"; fi
    mk_repo '{"sections":"## Known limits\n- có nội dung thật\n\n## Ngoài hợp đồng\n"}'
    pmc "$FX_ROOT" --base "$FX_A"
    # Làn V (approved_by rỗng) không sạch → lưới đòi chữ ký ngay ở chốt Cổng 1, gọi tên mục bẩn.
    if has "$OUT" "VIOLATION [fx]: status=verified but approved_by is empty — làn V đòi xanh-sạch hoặc chữ ký (mục «Known limits» có nội dung)"; then ok "fixture bẩn một mục: lưới đòi chữ ký, gọi tên mục"; else bad "fixture bẩn mà lưới không đòi chữ ký: $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -2)"; fi
    ;;
  *) echo "rang.sh: chân lạ '$CHAN'"; exit 3 ;;
esac
done_chan
