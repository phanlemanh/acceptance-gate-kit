#!/usr/bin/env bash
# Răng hồ sơ design-pass-nac-khong-dong-bo — AC-12 «câu chết phải chết».
#
# CỐ Ý KHÔNG vào suite vĩnh viễn: đối chứng dương neo vào mốc git CỐ ĐỊNH
# BASE-DPNKDB đọc từ contract. Neo vào origin/main thì sau khi hồ sơ này gộp,
# cả hai đầu đều 0 → phép đo tự chết mà vẫn xanh. Răng chết theo hồ sơ khi gộp.
#
# Ba chân, một hàm đếm DÙNG CHUNG, cùng một glob thư mục ở cả hai đầu:
#   (1) đối chứng dương — mỗi kim ở MỐC phải đếm đúng số đã khai
#   (2) cây đang kiểm — mọi kim phải đếm 0
#   (3) chân tiêm — tiêm kim vào một file THỨ BA dưới hai thư mục, phải đếm ≥1
#       (chứng minh phép đếm quét TRỌN thư mục chứ không chỉ hai file đã biết)
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # suy từ vị trí script
ROOT="$(cd "$HERE/../.." && pwd)"
CONTRACT="$HERE/contract.md"
[ -f "$CONTRACT" ] || { echo "khong tim thay contract: $CONTRACT"; exit 1; }

SHA="$(sed -n 's/^\*\*BASE-DPNKDB:\*\* `\([0-9a-f]\{40\}\)`.*/\1/p' "$CONTRACT")"
[ -n "$SHA" ] || { echo "khong doc duoc BASE-DPNKDB tu contract"; exit 1; }

# Hàm đếm DÙNG CHUNG cho cả ba chân: $1 = gốc cây, $2 = kim.
# Phạm vi là THƯ MỤC (skills + feature-loop), không phải danh sách file — hai đầu
# lệch phạm vi là chỗ trốn: base quét trọn cây mà cây hiện tại chỉ quét hai file
# đã biết thì một bản chép còn sót ở file thứ ba vẫn cho màu xanh.
dem() {
  # grep thoát 1 khi KHÔNG khớp — không-khớp chính là kết quả ĐÚNG ở chân 2, nên phải
  # tha. Nhưng CHỈ tha đúng mã đó: `|| true` trần tha luôn mã ≥2 (thư mục biến mất,
  # không đọc được, grep hỏng) và `2>/dev/null` xoá nốt thông điệp — khi ấy MỌI kim ra 0
  # và chân 2 in xanh trên một cây chưa hề được quét. Đó là «đỏ hạ tầng đội lốt xanh
  # vật», đúng lớp mà chú thích ở chỗ khác trong file này đã cảnh báo (S4-r3 finding).
  [ -d "$1/skills" ] && [ -d "$1/feature-loop" ] || {
    echo "HA TANG: thieu thu muc de quet duoi \"$1\" (skills / feature-loop)" >&2; return 2; }
  local out rc
  out="$(grep -rF -- "$2" "$1/skills" "$1/feature-loop" 2>&1)"; rc=$?
  if [ "$rc" -ge 2 ]; then
    echo "HA TANG: grep thoat $rc khi quet \"$1\": $out" >&2; return 2
  fi
  [ "$rc" -eq 1 ] && { echo 0; return 0; }
  printf '%s\n' "$out" | wc -l | tr -d ' '
}

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
BASE="$TMP/base"; INJ="$TMP/inj"
mkdir -p "$BASE" "$INJ"
# TRỌN cây hai thư mục — chép danh sách file tay là bản base thiếu file (lớp lỗi P150)
git -C "$ROOT" archive "$SHA" skills feature-loop | tar -x -C "$BASE"
cp -R "$ROOT/skills" "$ROOT/feature-loop" "$INJ/"

# Danh sách kim ĐÓNG đọc TỪ contract (marker), không hardcode trong script
KIMS="$(sed -n '/<<<DEAD-SENTENCE-NEEDLES/,/DEAD-SENTENCE-NEEDLES>>>/p' "$CONTRACT" | grep '|' || true)"
[ -n "$KIMS" ] || { echo "khong doc duoc DEAD-SENTENCE-NEEDLES tu contract"; exit 1; }

fails=0
first_kim=""
while IFS='|' read -r kim so; do
  kim="${kim%$'\r'}"; so="${so%$'\r'}"   # file CRLF: CR dính vào số làm `[` thoát 2
  [ -z "${kim:-}" ] && continue
  [ -z "$first_kim" ] && first_kim="$kim"

  # `set -e` KHÔNG áp cho lệnh trong điều kiện của if/elif: `[ "$b" -ne "$so" ]` với
  # $so dị dạng thoát 2 kèm «integer expression expected», elif bị coi là SAI, và nửa
  # ĐỐI CHỨNG DƯƠNG của AC-12 biến mất im lặng trong khi script vẫn in OK (S4-r2).
  # Nên kiểm hình dạng TRƯỚC khi so, và số khai dị dạng là ĐỎ chứ không phải bỏ qua.
  case "$so" in
    ''|*[!0-9]*)
      echo "CHAN 1 DO: so khai cua kim \"$kim\" khong phai so nguyen: \"$so\""
      fails=$((fails + 1)); continue;;
  esac

  # (1) đối chứng dương ở MỐC
  b="$(dem "$BASE" "$kim")"
  if [ "$b" -eq 0 ]; then
    echo "CHAN 1 DO: doi chung duong chet — kim \"$kim\" khong co o moc BASE-DPNKDB ($SHA)"
    fails=$((fails + 1))
  elif [ "$b" -ne "$so" ]; then
    echo "CHAN 1 DO: kim \"$kim\" o moc dem $b, contract khai $so"
    fails=$((fails + 1))
  fi

  # (2) cây đang kiểm phải sạch
  c="$(dem "$ROOT" "$kim")"
  if [ "$c" -ne 0 ]; then
    echo "CHAN 2 DO: cau chet van song — kim \"$kim\" con $c cho trong cay:"
    grep -rlF -- "$kim" "$ROOT/skills" "$ROOT/feature-loop" 2>/dev/null | sed 's/^/    /'
    fails=$((fails + 1))
  fi
done <<< "$KIMS"

# (3) chân tiêm — file THỨ BA, không phải hai file đã sửa
TARGET="$INJ/skills/acceptance/SKILL.md"
[ -f "$TARGET" ] || { echo "CHAN 3 DO: khong tim thay file thu ba de tiem"; exit 1; }
printf '\n%s\n' "$first_kim" >> "$TARGET"
inj="$(dem "$INJ" "$first_kim")"
if [ "$inj" -lt 1 ]; then
  echo "CHAN 3 DO: chan tiem khong do — phep dem khong quet tron thu muc (tiem vao skills/acceptance/SKILL.md ma dem ra $inj)"
  fails=$((fails + 1))
fi

if [ "$fails" -gt 0 ]; then
  echo "cau-chet: $fails chan do"
  exit 1
fi
echo "cau-chet OK (moc $SHA: moi kim dung so khai · cay dang kiem: 0 · chan tiem: bat duoc)"
