#!/usr/bin/env bash
# Răng hồ sơ het-gio-khong-phai-truot. Base tường minh origin/main, không vào
# suite vĩnh viễn, chết theo hồ sơ khi merge.
#
# ĐỔI KHUÔN ở vòng r2 (không vá tiếp): hai vòng liên tiếp sinh lỗi CÙNG LỚP
# «tuyên quét lớp, thực đo tập con» vì chân tồn-kho liệt kê case theo HÌNH DẠNG
# CÚ PHÁP (check('…') rồi thêm check(`…`) rồi đẳng thức đếm) — blacklist trên
# không gian mở thì vá xong lại thủng. Khuôn mới đặt bất biến ở ĐIỂM NGHẼN ĐẦU
# RA: mỗi callsite check() in đúng một dòng kết quả, nên
#   (a) suite phải exit 0 VÀ in "Results: N passed, 0 failed"  ← hết nuốt mã thoát
#   (b) N phải BẰNG ĐÚNG (số ca của bản base chạy thật) + (số pin hồ sơ này khai)
#       → xoá case cũ thì thiếu, thêm ca không khai thì thừa: đếm nguồn hai
#       hướng, không phụ thuộc case đó viết bằng khuôn cú pháp nào
#   (c) tên case nào ghi được nguyên văn (chuỗi nháy đơn) thì vẫn ghim nguyên văn
#       + ghim đúng dòng PASS — bắt cả đổi-tên, không chỉ xoá.
# Cả ba đi qua CÙNG một hàm kiểm, chạy HAI lượt trong một lần: cây thật (phải
# xanh) và bản sao đã tiêm (phải đỏ) — chiều đỏ là kết quả chạy, không phải lời
# hứa trong chú thích.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1
FAILS=0
do_fail() { echo "DO: $1"; FAILS=$((FAILS+1)); }
# Bản sao máy sinh phải biến mất kể cả khi răng bị ngắt giữa chừng — file lạ nằm
# lại trong tests/ là nguồn «suite đỏ oan» đã ghi sổ.
trap 'rm -f tests/workflows/acceptance-verify.base.mjs tests/workflows/acceptance-verify.mut.mjs' EXIT

TEST_FILE="tests/workflows/acceptance-verify.test.mjs"
BASE_SRC="$(git show origin/main:"$TEST_FILE" 2>/dev/null)"

# Dòng case của hồ sơ này — phải có mặt ĐÚNG NGUYÊN VĂN trong stdout.
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
  "W26 ui killedByTool -> BLOCKED"
  "W26 ui doi chung: exit 1 that -> REJECT"
  "W27 baseline killed -> n-a"
  "W27 doi chung: baseline exit 1 that -> red"
)

# kiem <file test> <nhãn lượt> → in "KIEM <nhãn>: <số lỗi>"; 0 = sạch.
# In chi tiết lỗi kèm nhãn để lượt mutant nói rõ nó đỏ vì cái gì.
kiem() {
  local file="$1" tag="$2" n=0 out rc nm passed failed n_base
  out="$(node "$file" 2>&1)"; rc=$?

  # (a) mã thoát + dòng tổng kết — không tin một mình cái nào
  if [ "$rc" -ne 0 ]; then
    echo "  [$tag] suite exit $rc"; n=$((n+1))
  fi
  passed="$(printf '%s\n' "$out" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\1/p' | tail -1)"
  failed="$(printf '%s\n' "$out" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\2/p' | tail -1)"
  if [ -z "$passed" ] || [ -z "$failed" ]; then
    echo "  [$tag] khong doc duoc dong 'Results: N passed, M failed'"; n=$((n+1))
    passed=0
  elif [ "$failed" -ne 0 ]; then
    echo "  [$tag] suite bao $failed ca do"; n=$((n+1))
  fi

  # (b) đẳng thức số ca: base chạy thật + số pin hồ sơ này khai = số ca bây giờ.
  # Thiếu ⇒ có case cũ bị xoá; thừa ⇒ có ca chưa khai trong PINS. Cả hai đều đỏ.
  if [ "$N_BASE" -lt 1 ]; then
    echo "  [$tag] SO-CA: khong chay duoc ban base — khong co moc de so"; n=$((n+1))
  elif [ "$passed" -ne "$((N_BASE + ${#PINS[@]}))" ]; then
    echo "  [$tag] SO-CA lech: $passed ca xanh, ky vong $N_BASE (base) + ${#PINS[@]} (pin) = $((N_BASE + ${#PINS[@]}))"; n=$((n+1))
  fi

  # (c) tên nguyên văn: mọi tên nháy đơn của base còn trong source + có dòng PASS
  while IFS= read -r nm; do
    [ -z "$nm" ] && continue
    if ! grep -qF "check('$nm'" "$file"; then
      echo "  [$tag] TON-KHO: case cu bi sua/xoa: $nm"; n=$((n+1)); continue
    fi
    if ! printf '%s\n' "$out" | grep -qxF "  PASS: $nm"; then
      echo "  [$tag] TON-KHO: thieu dong PASS: $nm"; n=$((n+1))
    fi
  done <<EOF_NAMES
$(printf '%s' "$BASE_SRC" | grep -o "check('[^']*'" | sed "s/^check('//;s/'\$//" | sort -u)
EOF_NAMES

  # (d) dòng case của chính hồ sơ này — khớp TRỌN dòng (grep substring từng để
  # lọt case bị đổi tên thành "<tên>x").
  for nm in "${PINS[@]}"; do
    if ! printf '%s\n' "$out" | grep -qxF "  PASS: $nm"; then
      echo "  [$tag] thieu dong PASS: $nm"; n=$((n+1))
    fi
  done

  echo "KIEM $tag: $n"
  return 0
}

if [ -z "$BASE_SRC" ]; then
  do_fail "khong doc duoc origin/main:$TEST_FILE"
  echo "RANG-HGKPT: $FAILS loi"
  exit 1
fi

# ── Mốc: chạy CHÍNH bản base (đặt cùng thư mục để đường dẫn tương đối đúng —
# bản sao ở /tmp chết vì resolve sai, và một mutant chết-vì-lý-do-khác không
# chứng minh được gì). Đuôi .mut.mjs/.base.mjs không khớp glob *.test.mjs của
# run-tests.sh nên không lọt vào suite vĩnh viễn.
BASE_FILE="tests/workflows/acceptance-verify.base.mjs"
printf '%s\n' "$BASE_SRC" > "$BASE_FILE"
BASE_OUT="$(node "$BASE_FILE" 2>&1)"; BASE_RC=$?
N_BASE="$(printf '%s\n' "$BASE_OUT" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\1/p' | tail -1)"
N_BASE_FAIL="$(printf '%s\n' "$BASE_OUT" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\2/p' | tail -1)"
rm -f "$BASE_FILE"
if [ "$BASE_RC" -ne 0 ] || [ -z "${N_BASE:-}" ] || [ "${N_BASE_FAIL:-1}" -ne 0 ]; then
  do_fail "MOC-BASE: ban base khong chay sach (exit $BASE_RC, passed=${N_BASE:-?}, failed=${N_BASE_FAIL:-?}) — khong co moc de so ca"
  N_BASE=0
else
  echo "PASS: MOC-BASE ban base chay sach: $N_BASE ca"
fi

# ── Lượt 1: cây thật phải SẠCH ──────────────────────────────────────────────
N_THAT="$(kiem "$TEST_FILE" that | sed -n 's/^KIEM that: //p')"
[ "${N_THAT:-1}" -eq 0 ] || do_fail "cay that KHONG sach: $N_THAT loi (chi tiet o tren)"

# ── Lượt 2: bản sao đã tiêm phải ĐỎ, và đỏ vì ĐÚNG ba lý do đã tuyên ─────────
# Ba mũi tiêm trên MỘT bản sao (không đụng cây thật): xoá một case cũ tên tĩnh ·
# xoá một case cũ tên động (khuôn mà bản vá r1 phải đắp thêm mới thấy) · đổi tên
# một pin của hồ sơ. Mũi 1+2 làm số ca tụt dưới sàn ⇒ (b) bắt được mà không cần
# biết case đó viết bằng khuôn cú pháp nào.
MUT_FILE="tests/workflows/acceptance-verify.mut.mjs"
python3 - "$TEST_FILE" "$MUT_FILE" <<'EOF_PY'
import re, sys
src = open(sys.argv[1]).read()
# Vô hiệu hoá callsite bằng cách đổi tên hàm (KHÔNG xoá dòng: lời gọi trải nhiều
# dòng nên xoá một dòng phá cú pháp, và một mutant chết-vì-cú-pháp không chứng
# minh phép đo phân biệt được gì). Ca bị đổi tên hàm không in dòng nào ⇒ số ca
# tụt đúng 1 cho mỗi mũi.
src = src.replace("import { runWorkflow, check, summary }",
                  "const noop = () => {};\nimport { runWorkflow, check, summary }", 1)
# mũi 1: một case cũ tên TĨNH biến mất
src = re.sub(r"check\('W01", "noop('W01", src, count=1)
# mũi 2: một case cũ tên ĐỘNG biến mất (khuôn mà bản vá r1 phải đắp thêm mới thấy)
src = re.sub(r"check\(`", "noop(`", src, count=1)
# mũi 3: đổi tên một pin của hồ sơ (số ca không đổi — chỉ chân tên bắt được)
src = src.replace("check('W26 killedByTool -> BLOCKED'", "check('W26 killedByTool -> BLOCKEDx'", 1)
open(sys.argv[2], 'w').write(src)
EOF_PY
MUT_OUT="$(kiem "$MUT_FILE" mutant)"
N_MUT="$(printf '%s\n' "$MUT_OUT" | sed -n 's/^KIEM mutant: //p')"
printf '%s\n' "$MUT_OUT" | grep -v '^KIEM ' | head -6 | sed 's/^/  (mutant) /'
rm -f "$MUT_FILE"

if [ "${N_MUT:-0}" -eq 0 ]; then
  do_fail "TU-PHA-THU: ban sao da tiem 3 loi van SACH — ham kiem khong phan biet"
else
  # đỏ chưa đủ: phải đỏ vì ĐÚNG các lý do đã tuyên (sàn tồn-kho · tên tĩnh · pin)
  printf '%s\n' "$MUT_OUT" | grep -q "SO-CA lech" \
    || do_fail "TU-PHA-THU: mat mui SO-CA (xoa ca cu khong lam lech dang thuc so ca)"
  printf '%s\n' "$MUT_OUT" | grep -q "TON-KHO: case cu bi sua/xoa: W01" \
    || do_fail "TU-PHA-THU: mat mui ten-tinh (xoa case W01 khong bi bat)"
  printf '%s\n' "$MUT_OUT" | grep -q "thieu dong PASS: W26 killedByTool -> BLOCKED" \
    || do_fail "TU-PHA-THU: mat mui pin (doi ten pin khong bi bat)"
  echo "PASS: TU-PHA-THU ban sao tiem 3 loi -> $N_MUT loi, du 3 mui"
fi

if [ "$FAILS" -gt 0 ]; then
  echo "RANG-HGKPT: $FAILS loi"
  exit 1
fi
echo "RANG-HGKPT OK (${#PINS[@]} pin + san ton kho theo so ca + tu-pha-thu 3 mui)"
