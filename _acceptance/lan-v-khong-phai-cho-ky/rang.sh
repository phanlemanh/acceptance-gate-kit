#!/usr/bin/env bash
# Răng hồ sơ lan-v-khong-phai-cho-ky. Bốn chân, mỗi chân in CHIỀU ĐỎ trong cùng
# lượt. Hai luật của răng này, cố ý khác nếp cũ của kit:
#   · KHÔNG chạy trọn suite — răng gọi thẳng file ca (2 phút → vài giây).
#   · `cmd:` khai bằng ĐƯỜNG DẪN, không thêm khoá vào _acceptance/config.yaml
#     (áp trước câu 1 của hạt giống «ba chỗ tích luỹ không có đường ra»).
# ROOT suy từ VỊ TRÍ SCRIPT, không từ cwd: S4 gọi lệnh từ thư mục khác gốc thì
# `--root .` đo một cây khác cây đang kiểm.
set -u

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SELF="$ROOT/_acceptance/lan-v-khong-phai-cho-ky/rang.sh"
[ -f "$SELF" ] || { echo "RANG-LANV: ROOT suy sai — $SELF khong ton tai"; exit 1; }
CASES="$ROOT/tests/plugins/lan-v.test.mjs"
PM="$ROOT/scripts/product-map.mjs"

[ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan cases|mutant|mot-chu|ban-do"; exit 2; }
CHAN="${2:-}"

loi=0
bad() { echo "  ĐỎ   $1"; loi=$((loi + 1)); }
TMP=""
cleanup() { [ -n "$TMP" ] && rm -rf "$TMP"; }
trap cleanup EXIT

# Bản sao cây để đột biến. Chép TRỌN (trừ ba thư mục nặng/không liên quan) —
# liệt kê từng file là blacklist, và bản sao thiếu file thì "đỏ" chỉ nói lên
# việc thiếu file chứ không nói gì về hành vi đang đo.
chep_cay() {  # $1 = đích
  rsync -a --exclude .git --exclude node_modules --exclude .claude "$ROOT/" "$1/" \
    || { echo "RANG-LANV: rsync that bai"; exit 1; }
}

case "$CHAN" in

cases)
  out="$(node "$CASES" 2>&1)"; st=$?
  for id in LV1 LV2 LV3 LV4 LV5 LV6 LV7; do
    printf '%s\n' "$out" | grep -q "^PASS: $id " \
      || bad "thieu dong 'PASS: $id ...' trong stdout cua lan-v.test.mjs"
  done
  if printf '%s\n' "$out" | grep -q '^FAIL: LV'; then
    bad "co dong FAIL: LV — $(printf '%s\n' "$out" | grep '^FAIL: LV' | head -1)"
  fi
  [ "$st" -eq 0 ] || bad "lan-v.test.mjs exit $st (ky vong 0)"
  if [ "$loi" -eq 0 ]; then echo "CASES OK: 7 ca LV xanh tren cay that"; else echo "CASES: $loi ĐỎ"; fi
  ;;

mutant)
  # Mutant đi qua CHÍNH ca kiểm. Đối chứng dương chạy trên CÙNG CÁCH CHÉP: bản A
  # không tiêm phải XANH TRƯỚC khi tin bản B đỏ — nếu không, "bản sao thiếu thứ
  # gì đó" cũng cho màu đỏ và răng báo OK trong khi vị từ chưa từng chạy.
  TMP="$(mktemp -d)"
  chep_cay "$TMP/A"; chep_cay "$TMP/B"

  outA="$(LV_CASES=LV1,LV7 node "$TMP/A/tests/plugins/lan-v.test.mjs" 2>&1)"; stA=$?
  if [ "$stA" -ne 0 ] || ! printf '%s\n' "$outA" | grep -q '^PASS: LV1 '; then
    bad "ban sao nguyen ven khong chay duoc (exit $stA) — moi ket luan ve ban tiem deu vo nghia"
    echo "MUTANT: $loi ĐỎ"; exit 1
  fi

  # Đột biến 1 — gỡ nhánh V ở bản đồ (marker LAN-V-MO).
  grep -q 'LAN-V-MO' "$TMP/B/scripts/product-map.mjs" || bad "marker LAN-V-MO khong thay — mutant khong ghim duoc vao dau"
  perl -0pi -e "s/if \(status === 'verified' && lanVMo\(/if (false && lanVMo(/" "$TMP/B/scripts/product-map.mjs"
  grep -q 'if (false && lanVMo(' "$TMP/B/scripts/product-map.mjs" || bad "dot bien 1 khong doi duoc dong nao"
  out1="$(LV_CASES=LV1 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
  printf '%s\n' "$out1" | grep -q '^FAIL: LV1 ' || bad "dot bien 1: LV1 khong do"
  printf '%s\n' "$out1" | grep -qE 'van nam trong gates|ban do van xep' \
    || bad "dot bien 1: LV1 do nhung khong ghim dung cau (nhan duoc: $(printf '%s\n' "$out1" | head -1))"

  # Đột biến 2 — nới điều kiện PASS trong vị từ (marker LAN-V-PASS). Phục hồi
  # bản B về nguyên gốc trước, để hai đột biến không chồng lên nhau.
  cp "$PM" "$TMP/B/scripts/product-map.mjs"
  grep -q 'LAN-V-PASS' "$TMP/B/scripts/product-map.mjs" || bad "marker LAN-V-PASS khong thay"
  perl -0pi -e "s/\.toUpperCase\(\) !== 'PASS'\) return false;/.toUpperCase() === 'PENDING-JUDGMENT') return false;/" "$TMP/B/scripts/product-map.mjs"
  grep -q "=== 'PENDING-JUDGMENT') return false;" "$TMP/B/scripts/product-map.mjs" || bad "dot bien 2 khong doi duoc dong nao"
  out2="$(LV_CASES=LV7 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
  printf '%s\n' "$out2" | grep -q '^FAIL: LV7 ' \
    || bad "dot bien 2: LV7 khong do — bang su-that khong bat duoc viec noi long dieu kien PASS"
  printf '%s\n' "$out2" | grep -q 'verdict=REJECT' \
    || bad "dot bien 2: LV7 do nhung khong ghim toa do o REJECT (nhan duoc: $(printf '%s\n' "$out2" | head -1))"

  if [ "$loi" -eq 0 ]; then
    echo "MUTANT OK: 2 dot bien chay that, moi cai ghim dung cau; doi chung duong ban sao nguyen ven xanh"
  else echo "MUTANT: $loi ĐỎ"; fi
  ;;

*)
  echo "chan khong biet: $CHAN (cases|mutant|mot-chu|ban-do)"; exit 2 ;;
esac

[ "$loi" -eq 0 ] || exit 1
exit 0
