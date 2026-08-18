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
N_OLD=0
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
  # sanity counter (grep 0-hit thường là grep hỏng, không phải vật sạch)
  if [ "$N_OLD" -lt 1 ]; then
    do_fail "TON-KHO: 0 case cu rut duoc tu diffBase — grep nguon hong"
  else
    echo "PASS: TON-KHO $N_OLD case cu nguyen van"
  fi
fi

if [ "$FAILS" -gt 0 ]; then
  echo "RANG-HGKPT: $FAILS loi"
  exit 1
fi
echo "RANG-HGKPT OK (${#PINS[@]} pin + $N_OLD ton kho)"
