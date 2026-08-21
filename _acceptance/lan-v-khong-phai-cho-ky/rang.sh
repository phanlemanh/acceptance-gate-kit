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

mot-chu)
  # Chuỗi nhãn khai MỘT lần ở product-map.mjs; hai nơi còn lại phải chứa đúng
  # nó. Răng KHÔNG chép chuỗi vào mình — nó import hằng THẬT, nên đổi chuỗi ở
  # nguồn mà quên hai nơi kia thì răng đỏ chứ không âm thầm so chuỗi cũ.
  NOTE="$(node --input-type=module -e "
    const m = await import('file://$PM');
    process.stdout.write(m.VETO_OPEN_NOTE || '');
  ")" || { echo "RANG-LANV: khong import duoc VETO_OPEN_NOTE tu product-map.mjs"; exit 1; }
  [ -n "$NOTE" ] || { echo "RANG-LANV: VETO_OPEN_NOTE rong — khong con gi de so"; exit 1; }

  SITES="scripts/pre-merge-check.sh commands/start.md"
  # Bộ so đứng RIÊNG thành hàm: chiều đỏ dưới đây chạy CHÍNH hàm này trên bản bị
  # tiêm, chứ không chỉ kiểm rằng cú tiêm có đổi được chữ nào — đo cú tiêm thay
  # vì đo bộ so là phép đo chỉ có một lối thoát.
  so_ba_noi() {  # $1 = gốc cây cần soi; in tên từng site KHÔNG chứa nhãn
    local r="$1" site
    for site in $SITES; do
      grep -qF "$NOTE" "$r/$site" || echo "$site"
    done
  }

  lech="$(so_ba_noi "$ROOT")"
  [ -z "$lech" ] || for site in $lech; do bad "lech: $site"; done

  # Chiều đỏ cùng lượt: tiêm một chữ vào TỪNG site trên bản sao rồi chạy CHÍNH
  # bộ so — nó phải kêu ĐÚNG site đó, và chỉ site đó.
  TMP="$(mktemp -d)"
  for muc in $SITES; do
    ban="$TMP/$(printf '%s' "$muc" | tr '/' '_')"
    for site in $SITES; do
      mkdir -p "$ban/$(dirname "$site")"
      cp "$ROOT/$site" "$ban/$site"
    done
    sed "s/$NOTE/cua veto MO/g" "$ROOT/$muc" > "$ban/$muc"
    grep -qF "$NOTE" "$ban/$muc" && bad "chieu do: khong tiem duoc chu nao vao ban sao $muc"
    thay="$(so_ba_noi "$ban" | tr '\n' ' ' | sed 's/ *$//')"
    [ "$thay" = "$muc" ] || bad "chieu do $muc: bo so ky vong keu '$muc', thuc te keu '${thay:-(khong keu gi)}'"
  done

  if [ "$loi" -eq 0 ]; then
    echo "MOT-CHU OK: \"$NOTE\" == pre-merge-check.sh == commands/start.md (2 chieu do chay that)"
  else echo "MOT-CHU: $loi ĐỎ"; fi
  ;;

ban-do)
  # Chân này đo CÂY THẬT — R+ sống, bổ sung cho fixture code-sinh (fixture mới
  # là thước; cây thật là chỗ chứng minh luật có tác dụng ở đời thật).
  MAP="$ROOT/PRODUCT-MAP.md"
  BT='`'
  node "$PM" --root "$ROOT" --check >/dev/null 2>&1 \
    || bad "product-map --check do tren cay that — ban do chua ve lai?"

  sec_of() { awk -v s="$BT$1$BT" '/^## /{sec=substr($0,4)} /^- /{ if (index($0,s)) { print sec; exit } }' "$MAP"; }
  line_of() { grep -m1 -F "$BT$1$BT" "$MAP"; }

  for slug in release-2-0-0 release-2-1-0; do
    sec="$(sec_of "$slug")"
    [ "$sec" = "Đã giao" ] || bad "$slug khong nam duoi 'Đã giao' (thuc te: ${sec:-khong thay slug})"
    line_of "$slug" | grep -qF "cửa veto mở" || bad "$slug thieu chu thich cua veto mo"
  done
  # Hồ sơ ĐÃ KÝ thật phải giữ nguyên: đã giao, KHÔNG chú thích cửa mở.
  sec22="$(sec_of release-2-2-0)"
  [ "$sec22" = "Đã giao" ] || bad "release-2-2-0 (da ky) khong con duoi 'Đã giao' (thuc te: ${sec22:-khong thay})"
  line_of release-2-2-0 | grep -qF "cửa veto mở" && bad "release-2-2-0 da ky ma van gan chu thich cua veto mo"

  # Máy quét thật
  SCAN="$(node "$ROOT/scripts/start-scan.mjs" --root "$ROOT")" || { echo "RANG-LANV: start-scan that bai"; exit 1; }
  scan_err="$(printf '%s' "$SCAN" | node --input-type=module -e "
    let raw=''; for await (const c of process.stdin) raw += c;
    const j = JSON.parse(raw);
    const gates = new Set(j.groups.gates.map(g => g.slug));
    const done = new Map(j.groups.done.map(d => [d.slug, d.state]));
    const err = [];
    for (const s of ['release-2-0-0','release-2-1-0']) {
      if (gates.has(s)) err.push(s + ' van trong gates');
      if (done.get(s) !== 'lan-v-mo') err.push(s + ' state ' + (done.get(s) ?? '(khong co)') + ' != lan-v-mo');
    }
    if (done.get('release-2-2-0') !== 'signed-off') err.push('release-2-2-0 mat trang thai signed-off');
    process.stdout.write(err.join(' · '));
  ")" || { echo "RANG-LANV: khong doc duoc JSON may quet"; exit 1; }
  [ -z "$scan_err" ] || bad "may quet that: $scan_err"

  grep -qF 'lan-v-mo' "$ROOT/commands/start.md" || bad "commands/start.md khong neu trang thai lan-v-mo"
  grep -qF 'làn V' "$ROOT/commands/start.md" || bad "commands/start.md khong neu 'làn V'"

  # Chiều đỏ cùng lượt: --check phải CÓ RĂNG (bản sao có rác thì phải đỏ).
  TMP="$(mktemp -d)"
  chep_cay "$TMP/c"
  printf '\n- rac chen tay\n' >> "$TMP/c/PRODUCT-MAP.md"
  node "$PM" --root "$TMP/c" --check >/dev/null 2>&1 && bad "chieu do: --check van exit 0 tren ban sao co rac"

  if [ "$loi" -eq 0 ]; then
    echo "BAN-DO OK: 2 ho so lan V da giao · 1 ho so da ky giu signed-off · check exit 0 · /start biet lan-v-mo"
  else echo "BAN-DO: $loi ĐỎ"; fi
  ;;

*)
  echo "chan khong biet: $CHAN (cases|mutant|mot-chu|ban-do)"; exit 2 ;;
esac

[ "$loi" -eq 0 ] || exit 1
exit 0
