#!/usr/bin/env bash
# Chứng minh chiều đỏ: mọi ca -do của tệp ca mới phải đỏ trên bản cũ, vì bản cũ cho `pre-merge-check: clean`.
# HA20-do là ngoại lệ đã khai: bản cũ chặn nó bằng luật khác, nên chỉ ghim thiếu thông điệp của luật mới.
# CHIEU_DO_REF đổi bản đem đo (mặc định v2.38.0). Thoát 0: đúng · 1: sai, nêu tên ca · 2: mù, không có bản để đo.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cd "$HERE/../../.." && pwd)"
REF="${CHIEU_DO_REF:-v2.38.0}"
TEPCA="$KIT/tests/scripts/t3-can-ho-so-arm.test.mjs"

git -C "$KIT" rev-parse -q --verify "$REF^{commit}" >/dev/null 2>&1 || { echo "chieu-do: MU — khong co ban $REF"; exit 2; }
TMPD="$(mktemp -d "${TMPDIR:-/tmp}/chieu-do.XXXXXX")"
trap 'rm -rf "$TMPD"' EXIT
git -C "$KIT" archive "$REF" | tar -x -C "$TMPD" || { echo "chieu-do: MU — khong dung duoc cay $REF"; exit 2; }
cp "$TEPCA" "$TMPD/tests/scripts/t3-can-ho-so-arm.test.mjs"

CAC_CA="$(grep -oE "^ca\('HA[0-9]+-do'" "$TEPCA" | sed -E "s/^ca\('//; s/'$//")"
[ -n "$CAC_CA" ] || { echo "chieu-do: MU — khong doc duoc danh sach ca"; exit 2; }

sai=0; so=0
for c in $CAC_CA; do
  so=$((so+1))
  dong="$(node "$TMPD/tests/scripts/t3-can-ho-so-arm.test.mjs" "$c" 2>&1 | grep -E "^(PASS|FAIL): $c")"
  case "$c" in
    HA20-do) mau='thiếu thông điệp' ;;
    *) mau='pre-merge-check: clean' ;;
  esac
  case "$dong" in
    "FAIL: $c"*"$mau"*) echo "do dung: $c" ;;
    *) echo "SAI: $c khong do dung kieu tren $REF — ${dong:-khong co ket qua}" | cut -c1-300; sai=$((sai+1)) ;;
  esac
done

GPM="$KIT/tests/scripts/run-tests.sh"
for mau in 'check GPM13 0' 'nothas GPM13a'; do
  grep -qF "$mau" "$GPM" || { echo "SAI: run-tests.sh mat phep kiem «$mau»"; sai=$((sai+1)); }
done

if [ "$sai" -ne 0 ]; then echo "chieu-do: DO — $sai sai tren $so ca, ban $REF"; exit 1; fi
echo "chieu-do: XANH — $so ca -do deu do dung kieu tren $REF, GPM13 con du hai phep kiem"
