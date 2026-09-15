#!/usr/bin/env bash
# rang-ton-dong.sh — răng của hồ sơ release-2-14-0, chân `ghim-lai`.
#
# Canh MỘT điều: con số hồ sơ đang hoá cũ mà hồ sơ mốc GHI phải bằng con số lưới
# ĐANG nói hôm nay. Vì sao cần răng cho một con số: chiến dịch ghim lại bị hoãn
# mốc thứ hai liên tiếp, và mỗi lần hoãn hồ sơ lại chép con số của lần trước — số
# chép tay hoá cũ lặng lẽ rồi mốc sau đọc nó như sự thật. Bản đầu của răng này ĐỎ
# ngay lượt chạy đầu: hồ sơ chép 42, lưới nói 43.
#
# Đo bằng CHÍNH lưới trước-merge, cùng cờ và cùng mốc hồ sơ khai — không dựng phép
# đếm thứ hai. Bốn lỗ do phản biện context sạch gọi tên, đã vá ở bản này:
#   (a) mã thoát của lưới KHÔNG còn bị `|| true` nuốt — lưới gãy có mã RIÊNG (2),
#       không đội lốt «hai số lệch» (3);
#   (b) chốt «lưới đã sống» đọc DÒNG KẾT LUẬN thật, không đọc tiền tố xuất hiện
#       trong mọi thông điệp kể cả dòng lỗi của chính lưới;
#   (c) ĐỐI CHỨNG DƯƠNG: lưới phải soi được ÍT NHẤT MỘT hồ sơ, để «0 = 0» không
#       bao giờ là đường xanh sau khi chiến dịch chạy xong;
#   (d) đếm theo HỒ SƠ DUY NHẤT, không đếm dòng — lưới in hai lý do cho một hồ sơ
#       là con số đổi nghĩa mà vẫn xanh.
# Và: mốc so phải GIẢI ĐƯỢC và là tổ tiên của HEAD; mọi lần con số ấy xuất hiện
# trong hợp đồng phải trỏ về ô marker — một nguồn, các chỗ khác chép theo.
#
#   0  số hồ sơ khớp số lưới, và mọi lần xuất hiện trong hợp đồng khớp ô marker
#   2  không có nền để đo (lưới gãy · không đọc được hồ sơ · mốc so không giải được)
#   3  hai số LỆCH                                    → ca ĐỎ THẬT
#   4  hồ sơ không khai đủ cặp «số» và «mốc so»
#   5  lưới chạy nhưng không tới dòng kết luận nào
#   6  lưới không soi hồ sơ nào (đối chứng dương hỏng)
#   7  con số lặp trong văn hợp đồng LỆCH mọi nền đã khai ở marker
#   8  chốt một-nguồn KHÔNG thấy con số nào (mẫu chết lặng — đối chứng dương hỏng)
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
C="$WS/contract.md"
[ -f "$C" ] || { echo "FAIL: khong co $C" >&2; exit 2; }

KHOI="$(awk '/<!-- <<<TON-DONG-GHIM-LAI/{f=1;next} /TON-DONG-GHIM-LAI>>> -->/{f=0} f' "$C")"
SO="$(printf '%s\n' "$KHOI"  | sed -n 's/^so_stale: *\([0-9][0-9]*\).*/\1/p' | head -1)"
# Nền THỨ HAI, khai trong cùng khối marker: số hồ sơ tụt pin trên TOÀN KHO (không
# giới hạn cửa sổ). Hợp đồng cố ý nói cả hai cạnh nhau, nên chốt một-nguồn phải
# biết cả hai — bản trước chỉ biết một và sống sót nhờ dấu in đậm che con số kia.
SO2="$(printf '%s\n' "$KHOI" | sed -n 's/^so_stale_toan_kho: *\([0-9][0-9]*\).*/\1/p' | head -1)"
MOC="$(printf '%s\n' "$KHOI" | sed -n 's/^moc_so: *\([0-9a-f][0-9a-f]*\).*/\1/p' | head -1)"
[ -n "$SO" ] && [ -n "$MOC" ] || { echo "FAIL: ho so khong khai du cap so_stale + moc_so trong khoi marker" >&2; exit 4; }

git -C "$ROOT" rev-parse -q --verify "${MOC}^{commit}" >/dev/null 2>&1 || {
  echo "FAIL: moc_so '$MOC' khong giai duoc trong kho — khong co nen de do" >&2; exit 2; }
git -C "$ROOT" merge-base --is-ancestor "$MOC" HEAD 2>/dev/null || {
  echo "FAIL: moc_so '$MOC' KHONG phai to tien cua HEAD — cua so do vo nghia" >&2; exit 2; }

HEADSHA="$(git -C "$ROOT" rev-parse --short HEAD)"
BAN="$(git -C "$ROOT" status --porcelain | grep -c '' || true)"
echo "       [khai] so_stale=$SO${SO2:+ · so_stale_toan_kho=$SO2} · moc_so=$MOC · do tren HEAD=$HEADSHA (cay ${BAN} muc chua commit)" >&2

OUT="$(cd "$ROOT" && bash scripts/pre-merge-check.sh . --base "$MOC" --recheck-all 2>&1)"; RC=$?
# (b) dòng KẾT LUẬN thật, không phải tiền tố
printf '%s\n' "$OUT" | grep -qE '^pre-merge-check: (clean|[0-9]+ violation)' || {
  echo "FAIL: luoi khong toi dong ket luan (ma thoat $RC) — khong do duoc gi" >&2; exit 5; }
# (a) lưới gãy có mã riêng: exit khác 0 mà không phải vì violation
if [ "$RC" -ne 0 ] && ! printf '%s\n' "$OUT" | grep -qE '^pre-merge-check: [0-9]+ violation'; then
  echo "FAIL: luoi thoat $RC ma khong phai vi violation — luoi gay, khong phai hai so lech" >&2; exit 2; fi
# (c) đối chứng dương: lưới phải soi được ít nhất một hồ sơ
SOI="$(printf '%s\n' "$OUT" | grep -cE '^(OK|VIOLATION|NOTE) \[' || true)"
[ "$SOI" -ge 1 ] || { echo "FAIL: luoi khong soi ho so nao (0 dong per-slug) — «0 = 0» khong duoc la duong xanh" >&2; exit 6; }
# (d) đếm theo HỒ SƠ duy nhất
THAT="$(printf '%s\n' "$OUT" | sed -n 's/^VIOLATION \[\([^]]*\)\]: evidence is stale.*/\1/p' | sort -u | grep -c '' || true)"
echo "       [luoi] soi $SOI dong per-slug · $THAT ho so DUY NHAT hoa cu tai moc $MOC" >&2

[ "$SO" -eq "$THAT" ] || { echo "FAIL: so trong ho so ($SO) LECH so luoi dang noi ($THAT) — so chep tay da hoa cu" >&2; exit 3; }
# (một nguồn) mọi lần con số xuất hiện trong văn hợp đồng phải là con số ấy
# CHỈ soi câu nói tới chiến dịch — bản đầu quét mọi cụm «<số> hồ sơ» và bắt nhầm
# một MÃ THOÁT dính chữ «hồ sơ» do ngắt dòng (dòng «3 hai số lệch · 4 hồ sơ không
# khai đủ cặp»). Phép đo rộng hơn vật là phép đo đỏ oan.
# KHÔNG dùng \b quanh cụm tiếng Việt: dưới bash, BSD grep không khớp \b sau ký tự
# đa byte («sơ»), nên cả biểu thức trả RỖNG và chốt xanh vĩnh viễn vì chưa bao giờ
# khớp gì. Thử tay dưới zsh thì khớp, nên lỗi này chỉ lộ khi chạy đúng bash — đã
# dựng chiều đỏ để nó không tái diễn.
# PHẠM VI CỦA CHỐT — khai hẹp đúng thứ nó đo, sau khi DỪNG-VÁ nổ ở lượt chấm 2.
# Chốt này soi ĐÚNG những DÒNG chứa literal «ghim lại» hoặc «hoá cũ», KHÔNG quét
# trọn văn hợp đồng: cụm «69 hồ sơ» ở §5 và «4 hồ sơ» ở bảng lượt ĐO nằm trên dòng
# không mang literal nên chốt không thấy — và đó là hành vi ĐÚNG, vì hai số ấy nói
# về lượt đo chiến dịch chứ không về tồn đọng. Bản trước phát biểu toàn xưng («mọi
# lần con số xuất hiện») trong khi chỉ kiểm được bấy nhiêu; owner chọn đường «đổi
# khuôn» 15/09: lời khai phải bằng đúng phép đo, phần còn lại là việc mắt người ở
# Cổng Bằng chứng. Vá rộng mẫu ra trọn văn bản là đi ngược — nó biến chốt thành
# phép đo đỏ oan trên mọi con số hợp đồng cố ý khai cạnh nhau.
#
# GỠ ký tự định dạng markdown TRƯỚC khi so: bản trước để nguyên, nên «**71** hồ sơ»
# lọt qua chỉ vì hai dấu sao chen giữa số và chữ — phép đo tuyên «mọi lần con số
# xuất hiện» mà thực tế chỉ thấy số viết trần. Lượt chấm 1b gọi tên (hình dạng 5:
# tuyên quét LỚP nhưng chỉ có điểm-case).
TRAN="$(sed -E 's/[*_`]//g' "$C" | grep -E 'ghim lại|hoá cũ')"
HOP="$(printf '%s\n' "$TRAN" | grep -oE '[0-9]+ hồ sơ' | sort -u || true)"
# ĐỐI CHỨNG DƯƠNG (chống assertion âm-tính-một-mình): chốt chỉ có nghĩa khi nó
# THẬT SỰ nhìn thấy ít nhất một con số. Rỗng = hoặc hợp đồng thôi nói về ghim lại,
# hoặc mẫu lại chết lặng như bản dùng ký tự biên — cả hai đều KHÔNG phải đường xanh.
[ -n "$HOP" ] || { echo "FAIL: chot mot-nguon khong thay con so nao trong van hop dong — mau chet lang, khong phai duong xanh" >&2; exit 8; }
CHO="^$SO hồ sơ$"; [ -n "$SO2" ] && CHO="^($SO|$SO2) hồ sơ$"
LAC="$(printf '%s\n' "$HOP" | grep -vE "$CHO" || true)"
[ -z "$LAC" ] || { echo "FAIL: van hop dong con con so khac cac nen da khai ($SO${SO2:+ · $SO2}): $(printf '%s' "$LAC" | tr '\n' ' ')" >&2; exit 7; }

echo "PASS: so ho so hoa cu ghi trong ho so ($THAT ho so duy nhat tai moc ${MOC:0:8}, do tren HEAD $HEADSHA) BANG so luoi dang noi hom nay, va cac dong VAN HOP DONG co chua «ghim lai» hoac «hoa cu» (da go dinh dang markdown) khong mang con so ho so nao ngoai cac nen da khai o marker"
exit 0
