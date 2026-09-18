#!/usr/bin/env bash
# rang-so-tang.sh — răng của hồ sơ release-2-16-0 (CHÉP nguyên thân từ release-2-15-0), chân `so-tang`.
#
# Vì sao tồn tại: ca thường trực P200 canh số NHẤT QUÁN ở mọi bề mặt, cố ý KHÔNG
# canh «số đã tăng» (bản 18/08 từng có rồi TRỪ vì nó kéo theo một mốc di động).
# Lỗ bỏ ngỏ mà phản biện context sạch của mốc này gọi tên: quên hẳn bước nâng số
# thì hai manifest vẫn nhất quán ở số CŨ, GUIDE vẫn dẫn xuất đúng, cặp phụ thuộc
# vẫn khớp — MỌI eval xanh và một bản «phát hành 2.14.0» ra cửa mang số cũ.
#
# Răng đo QUAN HỆ, không đo giá trị: số ở cây làm việc phải LỚN HƠN theo semver số
# tại lúc HỒ SƠ MỐC NÀY ra đời. Phần chỉ-người-biết — minor hay major, và con số
# cụ thể — vẫn ở thẻ.
#
# Vì sao neo theo HỒ SƠ chứ không theo «lần cắt số gần nhất»: khi bước bump bị
# QUÊN, lần cắt gần nhất chính là mốc TRƯỚC, và so nó với số trước nữa vẫn ra «đã
# tăng» — răng xanh đúng ở ca nó sinh ra để bắt. Đã thử thật: bản đầu của răng này
# xanh trên cây chưa bump. Neo theo hồ sơ thì trước bump neo = số hiện tại → ĐỎ.
#
#   0  số đã tăng theo semver so với neo
#   2  không có nền để đo (không phải kho git · manifest vắng · số không đọc được)
#   3  số KHÔNG tăng (bằng, hoặc lùi)      → ca ĐỎ THẬT
#   4  không đọc được số tại neo           → chưa có gì để so
#   5  chạy xong nhưng không tới kết luận nào
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
G() { git -C "$ROOT" "$@"; }
G rev-parse --git-dir >/dev/null 2>&1 || { echo "DO: ROOT khong phai kho git — khong co nen de do" >&2; exit 2; }
MANIFEST=".claude-plugin/plugin.json"
doc_so() { sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1; }
ver_tai() { G show "$1:$MANIFEST" 2>/dev/null | doc_so; }

MOI="$(doc_so < "$ROOT/$MANIFEST")"
[ -n "$MOI" ] || { echo "DO: khong doc duoc so trong cay lam viec tu $MANIFEST" >&2; exit 2; }

HS="_acceptance/$(basename "$WS")/contract.md"
SINH="$(G log --diff-filter=A --format=%H -- "$HS" 2>/dev/null | tail -1)"
# NEO = CHA của commit sinh hồ sơ, không phải chính nó (sửa ở lượt chấm 2 của mốc
# 2.16.0). Vì sao: bản trước neo vào chính commit sinh hồ sơ, và điều đó chỉ đúng khi
# hồ sơ vào kho TRƯỚC bước nâng số — hai mốc trước tình cờ commit theo thứ tự ấy. Gộp
# hồ sơ và bước nâng số vào MỘT commit thì số tại neo đã là số MỚI, và răng đỏ mã 3 về
# một lần cắt số hoàn toàn lành, vĩnh viễn: neo là một commit lịch sử, chạy lại không
# chữa được. Cha của commit sinh là cây NGAY TRƯỚC khi hồ sơ tồn tại, nên nó mang số
# CŨ ở cả hai thứ tự commit.
#
# Chiều đỏ KHÔNG đổi một li: quên hẳn bước nâng số thì cha vẫn mang số cũ và cây cũng
# mang số cũ → BANG → mã 3, đúng ca răng này sinh ra để bắt. Đã thử thật hai chiều ở
# lượt sửa 1, xem khối expected của E1b.
if [ -n "$SINH" ]; then
  NEO="$(G rev-parse "${SINH}^" 2>/dev/null)"
  if [ -n "$NEO" ]; then
    NGUON="so tai CHA cua commit sinh ho so moc (${NEO:0:8}, con ${SINH:0:8})"
  else
    NEO="$SINH"
    NGUON="so tai commit sinh ho so moc (${NEO:0:8}) — commit goc, khong co cha"
  fi
else
  NEO="$(G rev-parse HEAD)"
  NGUON="so tai HEAD da commit (${NEO:0:8}) — ho so moc chua vao kho"
fi
CU="$(ver_tai "$NEO")"
[ -n "$CU" ] || { echo "DO: khong doc duoc so tai neo ${NEO:0:8}" >&2; exit 4; }
echo "       [neo] $NGUON = $CU · so trong cay lam viec = $MOI" >&2

KQ="$(MOI="$MOI" CU="$CU" node -e '
const p=s=>String(s).split(".").map(n=>parseInt(n,10));
const a=p(process.env.MOI), b=p(process.env.CU);
if (a.length<3||b.length<3||a.some(Number.isNaN)||b.some(Number.isNaN)) { console.log("XAU"); process.exit(0); }
for (let i=0;i<3;i++){ if(a[i]>b[i]){console.log("TANG");process.exit(0);} if(a[i]<b[i]){console.log("LUI");process.exit(0);} }
console.log("BANG");' 2>/dev/null)"
case "$KQ" in
  TANG) ;;
  BANG) echo "DO: so ($MOI) BANG so tai neo — buoc nang so cua moc nay CHUA CHAY" >&2; exit 3 ;;
  LUI)  echo "DO: so ($MOI) LUI so voi neo ($CU)" >&2; exit 3 ;;
  XAU)  echo "DO: so khong hop semver (neo=$CU cay=$MOI)" >&2; exit 2 ;;
  *)    echo "DO: khong toi ket luan nao khi so semver" >&2; exit 5 ;;
esac
echo "PASS: so trong cay ($MOI) TANG theo semver so voi $NGUON = $CU — neo suy TU KHO, khong ghim sha"
exit 0
