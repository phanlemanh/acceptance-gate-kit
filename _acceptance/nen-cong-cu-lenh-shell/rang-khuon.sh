#!/usr/bin/env bash
# Răng của AC-7 — ô `cong_cu` trong bảng «Bốn chân» của khuôn đường nền phải phát biểu
# luật mới (chỉ tra khi từ đầu là tên chương trình · bỏ qua thì in lý do ra stderr).
# Đường dẫn suy từ vị trí script, không hardcode ROOT. Cùng nếp không-vào-suite-vĩnh-viễn
# với các bộ răng hồ sơ khác: nó chết theo hồ sơ khi merge.
#
# Chiều đỏ chạy TRONG CÙNG LƯỢT: bản sao gỡ hai vế khỏi ô ấy phải làm chính hàm kiểm này
# thoát khác 0. Không có chiều đỏ thì «xanh» không phân biệt được «lời đã khớp vật» với
# «grep chưa bao giờ khớp gì».
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
KHUON="$ROOT/skills/acceptance/references/duong-nen-template.md"

# kiem <tệp> — thoát 0 khi ô cong_cu mang ĐỦ hai vế, khác 0 khi thiếu vế nào.
kiem() {
  local f="$1" o
  [ -f "$f" ] || { echo "THIEU KHUON $f"; return 2; }
  o="$(grep -F '| `cong_cu` |' "$f" || true)"
  [ -n "$o" ] || { echo "KHONG THAY O cong_cu TRONG BANG BON CHAN"; return 3; }
  printf '%s\n' "$o" | grep -q 'tên chương trình' || { echo "O cong_cu THIEU VE «tên chương trình»"; return 4; }
  printf '%s\n' "$o" | grep -q 'stderr' || { echo "O cong_cu THIEU VE «stderr»"; return 5; }
  return 0
}

# Chiều xanh — vật thật.
if kiem "$KHUON"; then
  echo "PASS: KH1 o cong_cu mang du hai ve cua luat tu-dau"
else
  echo "FAIL: KH1 o cong_cu thieu ve (ma $?)"
  exit 1
fi

# Chiều đỏ — bản sao gỡ hai vế khỏi ĐÚNG ô ấy; cùng hàm kiểm phải đỏ.
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
awk '
  /^\| `cong_cu` \|/ { print "| `cong_cu` | mo ta da bi go trong ban dot bien | mot tu dau khong co tren may |"; next }
  { print }
' "$KHUON" > "$TMP/khuon-do.md"
if kiem "$TMP/khuon-do.md" >/dev/null 2>&1; then
  echo "FAIL: KH2 chieu do KHONG do — ham kiem khong phan biet duoc ban go ve"
  exit 1
fi
# Bản đột biến phải KHÁC bản gốc (chống ca «awk không khớp dòng nào» cho màu xanh giả).
if cmp -s "$KHUON" "$TMP/khuon-do.md"; then
  echo "FAIL: KH2 ban dot bien TRUNG ban goc — buoc go ve chua chay"
  exit 1
fi
echo "PASS: KH2 ban go ve lam chinh ham kiem do (va ban dot bien khac ban goc)"
