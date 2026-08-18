#!/usr/bin/env bash
# Răng hồ sơ het-gio-khong-phai-truot — ghim ĐÚNG dòng case W25–W27 trong
# stdout suite workflows (nếp p194: không tin mã thoát trọn suite — trên
# diffBase suite cũng xanh nên exit code không phân biệt cây cũ/mới) + chân
# tồn-kho đếm-nguồn (AC-7: không sửa case cũ). Base tường minh origin/main,
# không vào suite vĩnh viễn, chết theo hồ sơ khi merge.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1
FAILS=0
do_fail() { echo "DO: $1"; FAILS=$((FAILS+1)); }

TEST_FILE="tests/workflows/acceptance-verify.test.mjs"
OUT="$(node "$TEST_FILE" 2>&1)"

# ── Chân 1: ghim dòng case mới (tự-phá-thử từng pin trên bản sao stdout) ─────
PINS=(
  "W25 rule rut tu marker"
  "W25 machine prompt chua TOOL-KILL-RULE"
  "W25 ui prompt chua TOOL-KILL-RULE"
  "W25 baseline prompt chua TOOL-KILL-RULE"
  "W25 schema killedByTool"
  "W25 dung 3 luot noi suy rule"
  "W25 mutant machine: xoa rule -> chi machine do"
  "W25 mutant ui: xoa rule -> chi ui do"
  "W25 mutant baseline: xoa rule -> chi baseline do"
  "W26 killedByTool -> BLOCKED"
  "W26 reason agent giu nguyen van"
  "W26 reason trong -> khuon ghim bi cong cu giet"
  "W26 doi chung: exit 1 that -> REJECT"
  "W26 run-log ghi cannot_run, khong ghi exit gia"
  "W27 baseline killed -> n-a"
  "W27 doi chung: baseline exit 1 that -> red"
)
for nm in "${PINS[@]}"; do
  # -x khớp TRỌN dòng ("  PASS: <tên>" đúng khuôn 2-space của harness):
  # grep substring từng để lọt case bị đổi tên thành "<tên>x" (phá thử 18/08).
  if ! printf '%s\n' "$OUT" | grep -qxF "  PASS: $nm"; then
    do_fail "thieu dong PASS: $nm"
    continue
  fi
  # tự-phá-thử (splice-cam): bản sao stdout xoá đúng dòng → grep phải trượt
  MUT="$(printf '%s\n' "$OUT" | grep -vxF "  PASS: $nm")"
  if printf '%s\n' "$MUT" | grep -qxF "  PASS: $nm"; then
    do_fail "tu-pha-thu khong do duoc: $nm"
  fi
done

# ── Chân 2: tồn-kho — tên case rút từ diffBase (đếm nguồn, không hardcode) ───
# Vòng r1 bắt lớp «lọc theo hình-dạng-cú-pháp là blacklist»: bản rút chỉ bắt
# check('...') nháy đơn, mù với 11 callsite check(`...`) trên base (đúng khối
# ma trận mutation — lớp phòng thủ đắt nhất của suite), nên xoá cả khối đó vẫn
# xanh. Chữa theo LỚP, không vá điểm: rút HAI khuôn, và đóng không gian bằng
# đẳng thức đếm-nguồn — tổng callsite của base phải bằng (nháy đơn + backtick),
# lệch ⇒ có khuôn thứ ba (nháy kép, xuống dòng…) chưa ai phủ ⇒ ĐỎ.
# Khác biệt hai lớp: tên nháy đơn là literal → assert cả NGUYÊN VĂN trong source
# lẫn dòng PASS trong stdout; tên backtick sinh lúc chạy → chỉ assert THÂN
# template còn nguyên văn trong source (không có dòng PASS nào để ghim).
N_OLD=0
N_TPL=0
BASE_SRC="$(git show origin/main:"$TEST_FILE" 2>/dev/null)"
if [ -z "$BASE_SRC" ]; then
  do_fail "TON-KHO: khong doc duoc origin/main:$TEST_FILE"
else
  while IFS= read -r nm; do
    [ -z "$nm" ] && continue
    if ! grep -qF "check('$nm'" "$TEST_FILE"; then
      do_fail "TON-KHO: case cu bi sua/xoa: $nm"
      continue
    fi
    if ! printf '%s\n' "$OUT" | grep -qxF "  PASS: $nm"; then
      do_fail "TON-KHO: thieu dong PASS: $nm"
      continue
    fi
    N_OLD=$((N_OLD+1))
  done <<EOF_NAMES
$(printf '%s' "$BASE_SRC" | grep -o "check('[^']*'" | sed "s/^check('//;s/'\$//" | sort -u)
EOF_NAMES

  # lớp 2: case đặt tên bằng template literal — thân template phải còn nguyên văn
  while IFS= read -r tpl; do
    [ -z "$tpl" ] && continue
    if ! grep -qF "check(\`$tpl\`" "$TEST_FILE"; then
      do_fail "TON-KHO-TPL: case cu (ten dong) bi sua/xoa: $tpl"
      continue
    fi
    N_TPL=$((N_TPL+1))
  done <<EOF_TPL
$(printf '%s' "$BASE_SRC" | grep -o 'check(`[^`]*`' | sed 's/^check(`//;s/`$//' | sort -u)
EOF_TPL

  # đóng không gian: đẳng thức số nguồn — mọi callsite check( của base phải rơi
  # vào ĐÚNG một trong hai khuôn đã phủ; lệch = khuôn thứ ba chưa ai đo.
  N_CALL="$(printf '%s\n' "$BASE_SRC" | grep -c "check(")"
  N_SQ="$(printf '%s\n' "$BASE_SRC" | grep -o "check('" | wc -l | tr -d ' ')"
  N_BT="$(printf '%s\n' "$BASE_SRC" | grep -o 'check(`' | wc -l | tr -d ' ')"
  if [ "$N_CALL" -ne "$((N_SQ + N_BT))" ]; then
    do_fail "TON-KHO-MA-TRAN: $N_CALL callsite check( tren base nhung chi phu $N_SQ nhay-don + $N_BT backtick — co khuon thu ba chua do"
  else
    echo "PASS: TON-KHO-MA-TRAN $N_CALL callsite = $N_SQ nhay-don + $N_BT backtick"
  fi
  # chiều đỏ CHẠY THẬT cho chính đẳng thức trên (base là mốc bất biến nên không
  # phá được ở đầu kia): tiêm một callsite khuôn-thứ-ba vào BẢN SAO trong bộ nhớ
  # của base rồi chạy lại đúng ba phép đếm — phải lệch.
  MUT_SRC="$(printf '%s\n%s\n' "$BASE_SRC" '  check("khuon thu ba", true);')"
  M_CALL="$(printf '%s\n' "$MUT_SRC" | grep -c "check(")"
  M_SQ="$(printf '%s\n' "$MUT_SRC" | grep -o "check('" | wc -l | tr -d ' ')"
  M_BT="$(printf '%s\n' "$MUT_SRC" | grep -o 'check(`' | wc -l | tr -d ' ')"
  if [ "$M_CALL" -ne "$((M_SQ + M_BT))" ]; then
    echo "PASS: TON-KHO-MA-TRAN tu-pha-thu: khuon thu ba bi bat ($M_CALL != $M_SQ + $M_BT)"
  else
    do_fail "TON-KHO-MA-TRAN tu-pha-thu KHONG do duoc — dang thuc dem khong phan biet"
  fi
  # sanity counter (grep 0-hit thường là grep hỏng, không phải vật sạch)
  if [ "$N_OLD" -lt 1 ] || [ "$N_TPL" -lt 1 ]; then
    do_fail "TON-KHO: rut duoc $N_OLD ten tinh / $N_TPL ten dong tu diffBase — grep nguon hong"
  else
    echo "PASS: TON-KHO $N_OLD case cu nguyen van"
    echo "PASS: TON-KHO-TPL $N_TPL case ten dong nguyen van"
  fi
fi

if [ "$FAILS" -gt 0 ]; then
  echo "RANG-HGKPT: $FAILS loi"
  exit 1
fi
echo "RANG-HGKPT OK (${#PINS[@]} pin + $N_OLD ton kho)"
