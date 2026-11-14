#!/usr/bin/env bash
# Răng hai chiều của ca MC-11 (hồ sơ mc11-ten-kho), mọi ca trên CÙNG một fixture: bản clone của cây đang kiểm ở thư mục
# tên «kho-ten-khac» (khác tên kho chính). Gốc kho suy từ vị trí script, không hardcode.
#   MCK-1  vật lành: tệp ca của cây đang kiểm → exit 0 + «PASS: MC-11» (đối chứng dương cho MCK-2/4/5).
#   MCK-2  thay đúng tệp ca bằng bản chữ cứng 0c4e503b → exit ≠ 0 + «FAIL: MC-11 — ten_phien «… (kho-ten-khac)»».
#   MCK-3  ca bảng gach-va-ngoac vẫn truyền kho tường minh và ghim chữ; đổi chữ ghim ten_phien của nó trên bản clone rồi
#          chạy tệp ca → MC-6 đỏ gọi tên gach-va-ngoac (ca bảng thật sự so ten_phien).
#   MCK-4  phá dấu « · » trong tenChienDich (scripts/lo-trinh.mjs) → MC-11 đỏ ở ten_phien VÀ MC-6 đỏ ở gach-va-ngoac
#          (MC-11 vẫn thật sự so ten_phien; ca bảng vẫn giữ chiều đỏ của định dạng).
#   MCK-5  phá tenKho trả rỗng → MC-11 đỏ «tenKho trả rỗng».
# Nhát phá thay đúng một chỗ (không khớp đúng một lần → thoát 3, hạ tầng); mỗi nhát chỉ chạy khi MCK-1 xanh.
set -u
GOC="$(cd "$(dirname "$0")/../../.." && pwd)"
CU=0c4e503b
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
D="$TMP/kho-ten-khac"; CA=tests/scripts/moc-chien-dich.test.mjs; LT=scripts/lo-trinh.mjs
git clone -q --shared --no-checkout "$GOC" "$D" || { echo "HẠ TẦNG: clone hỏng"; exit 3; }
git -C "$D" checkout -q "$(git -C "$GOC" rev-parse HEAD)" || { echo "HẠ TẦNG: checkout hỏng"; exit 3; }
# Cây đang kiểm có thể mang thay đổi chưa commit ở vật — chép hai tệp vật của cây vào bản clone.
cp "$GOC/$CA" "$D/$CA"; cp "$GOC/$LT" "$D/$LT"; cp "$D/$CA" "$TMP/ca.lanh"; cp "$D/$LT" "$TMP/lt.lanh"
[ "$(basename "$(dirname "$(git -C "$D" rev-parse --path-format=absolute --git-common-dir)")")" = kho-ten-khac ] \
  || { echo "HẠ TẦNG: bản clone không mang tên kho-ten-khac"; exit 3; }
pha() { # pha <tệp> <chuỗi cũ> <chuỗi mới> — thay đúng một lần
  node -e 'const fs=require("fs");const [f,a,b]=process.argv.slice(1);const s=fs.readFileSync(f,"utf8");const n=s.split(a).length-1;if(n!==1){console.error("HẠ TẦNG: nhát phá khớp "+n+" lần trong "+f);process.exit(3)}fs.writeFileSync(f,s.replace(a,b))' "$1" "$2" "$3" || exit 3
}
chay() { (cd "$D" && node "$CA" 2>&1); }
lanh() { cp "$TMP/ca.lanh" "$D/$CA"; cp "$TMP/lt.lanh" "$D/$LT"; }
DONG_BANG="['gach-va-ngoac', { hang: { ma: 'MC1', ten_ngan: 'Mốc là chiến dịch' }, kho: 'acceptance-gate-kit' }, { moc: 'Tinh chỉnh sau hai đợt thử 05/11', ten_phien: 'MC1 · Mốc là chiến dịch (acceptance-gate-kit)'"
kiem_bang() { grep -qF "$DONG_BANG" "$1"; }
sai=0; ok() { echo "PASS: $1"; }; hong() { echo "FAIL: $1"; sai=1; }

OUT="$(chay)"; E=$?
if [ $E -eq 0 ] && grep -q '^  PASS: MC-11 ' <<<"$OUT"; then ok "MCK-1 vật lành xanh ở thư mục kho-ten-khac (exit 0, PASS: MC-11)"; LANH=1
else hong "MCK-1 vật lành ở kho-ten-khac: exit $E"; grep -E 'MC-11|Results' <<<"$OUT"; LANH=0; fi

if [ $LANH -eq 1 ]; then
  git -C "$GOC" show "$CU:$CA" > "$D/$CA" || { echo "HẠ TẦNG: không lấy được bản $CU"; exit 3; }
  OUT="$(chay)"; E=$?
  if [ $E -ne 0 ] && grep -qF 'FAIL: MC-11 — ten_phien «MC1 · Mốc là chiến dịch (kho-ten-khac)»' <<<"$OUT"; then ok "MCK-2 bản chữ cứng ($CU) đỏ với thông điệp ghim (exit $E)"
  else hong "MCK-2 bản chữ cứng không đỏ đúng thông điệp: exit $E"; grep -E 'MC-11|Results' <<<"$OUT"; fi
  lanh
else hong "MCK-2 không chạy — vật lành chưa xanh trên cùng fixture"; fi

if kiem_bang "$D/$CA"; then
  if [ $LANH -eq 1 ]; then
    # Nhát phá đổi chữ ghim ten_phien của ca bảng trên bản clone rồi CHẠY tệp ca: ca bảng phải thật sự so ten_phien,
    # nên MC-6 phải đỏ gọi tên gach-va-ngoac (không chỉ là chữ có mặt trong nguồn).
    pha "$D/$CA" "ten_phien: 'MC1 · Mốc là chiến dịch (acceptance-gate-kit)', nhom: 'Tinh chỉnh" "ten_phien: 'MC1 · Mốc là chiến dịch (sai-ghim)', nhom: 'Tinh chỉnh"
    OUT="$(chay)"; E=$?
    if [ $E -ne 0 ] && grep -E '^  FAIL: MC-6 ' <<<"$OUT" | grep -qF 'gach-va-ngoac:'
    then ok "MCK-3 ca bảng gach-va-ngoac vẫn truyền kho tường minh và ghim chữ định dạng (đổi chữ ghim trên bản sao → MC-6 đỏ ở gach-va-ngoac)"
    else hong "MCK-3 phép kiểm ca bảng không đỏ khi dòng ca bảng bị đổi: exit $E"; grep -E 'MC-6|Results' <<<"$OUT"; fi
    lanh
  else hong "MCK-3 không chạy — vật lành chưa xanh trên cùng fixture"; fi
else hong "MCK-3 ca bảng gach-va-ngoac đã đổi"; fi

if [ $LANH -eq 1 ]; then
  pha "$D/$LT" '`${chuoi(hang.ma)} · ${tenNganHang(hang)} (${kho})`' '`${chuoi(hang.ma)} - ${tenNganHang(hang)} (${kho})`'
  OUT="$(chay)"; E=$?
  if [ $E -ne 0 ] && grep -qF 'FAIL: MC-11 — ten_phien «MC1 - Mốc là chiến dịch (kho-ten-khac)»' <<<"$OUT" && grep -E '^  FAIL: MC-6 ' <<<"$OUT" | grep -qF 'gach-va-ngoac:'
  then ok "MCK-4 phá dấu phân cách tenChienDich → MC-11 đỏ ở ten_phien và MC-6 đỏ ở gach-va-ngoac (exit $E)"
  else hong "MCK-4 phá dấu phân cách không làm MC-11 và gach-va-ngoac đỏ đúng: exit $E"; grep -E 'MC-11|MC-6|Results' <<<"$OUT"; fi
  lanh
  pha "$D/$LT" 'if (d) return path.basename(path.dirname(d));' "if (d) return '';"
  OUT="$(chay)"; E=$?
  if [ $E -ne 0 ] && grep -E '^  FAIL: MC-11 ' <<<"$OUT" | grep -qF 'tenKho trả rỗng'; then ok "MCK-5 tenKho trả rỗng → MC-11 đỏ «tenKho trả rỗng» (exit $E)"
  else hong "MCK-5 tenKho rỗng không làm MC-11 đỏ đúng: exit $E"; grep -E 'MC-11|Results' <<<"$OUT"; fi
  lanh
else hong "MCK-4 không chạy — vật lành chưa xanh trên cùng fixture"; hong "MCK-5 không chạy — vật lành chưa xanh trên cùng fixture"; fi

[ $sai -eq 0 ] && echo "mc11-ten-kho chieu-do: 5 passed, 0 failed" || echo "mc11-ten-kho chieu-do: có ca FAIL"
exit $sai
