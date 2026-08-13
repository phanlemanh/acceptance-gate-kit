#!/usr/bin/env bash
# so-ca.sh — chân MÁY cho đẳng thức số ca của AC-11.
#
# Vì sao tồn tại: E12/E7/E13/E14 đều hứa đỏ ghim
# "LUU-KHO-SUITE: so ca lech ky vong: <truoc> -> <sau>". Rà soát đối kháng vòng
# 1 tìm ra thông điệp đó KHÔNG có trong bất kỳ mã nào — con số 145 chỉ suy được
# bằng ĐẾM TAY dòng `PASS:`. Nghĩa là AC-11, trụ cột chống gỡ-quá-tay của cả hồ
# sơ, là một phép đo DO NGƯỜI ĐẾM: lần chạy sau mất 20 ca vẫn in "all plugin
# tests passed" và trả 0, và không lưới nào thấy.
#
# Ba luật của script này:
#   (a) Con số kỳ vọng KHÔNG gõ ở đây. Nó đọc từ khối `SO-CA-KY-VONG` trong
#       `contract.md` — bên KHAI và bên ĐO dùng chung MỘT bản, không hai bản
#       chép (lớp lỗi "bên viết và bên đọc trôi khỏi nhau", CLAUDE.md).
#   (b) ĐẲNG THỨC, không phải sàn `≥`. Ba suite ở đây bị CHỦ Ý làm teo; sàn thì
#       lúc đỏ đường thoát rẻ nhất là hạ số xuống mức vừa đo, và phép đo mất
#       đúng lý do nó tồn tại.
#   (c) "Số ca lệch" và "có ca đỏ" là HAI kiểu hỏng khác nhau, mỗi kiểu một
#       thông điệp. Gộp chúng thì một ca đỏ đọc y hệt một đợt gỡ quá tay, và
#       người đọc log học cách phớt lờ cả hai.
#
# Cách đếm KHÁC NHAU theo suite, và đây là chỗ dễ lẫn nhất (đã ghi trong nhật ký
# thi công): suite `scripts` có HAI con số cùng đúng — bộ đếm nội bộ in
# `Results: 671 passed` và số dòng `PASS:` thô là 737. Suite `plugins` thì
# ngược lại: nó KHÔNG in tổng số ca (chỉ "all plugin tests passed"), nên phải
# đếm dòng. Ghim phương pháp theo từng suite thay vì đoán.
#
# Dùng:
#   so-ca.sh                              chạy cả bốn suite, assert cả bốn đẳng thức
#   so-ca.sh --suite plugins              chạy đúng một suite
#   so-ca.sh --suite hooks --keep-log F   chạy và giữ log tại F
#   so-ca.sh --suite hooks --log F        KHÔNG chạy; đếm trên log có sẵn
#                                         (đường của CHIỀU ĐỎ: mutate log rồi
#                                         cho đi qua CHÍNH bộ đếm này)
set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
CONTRACT="$HERE/contract.md"

# Phương pháp đếm theo suite — xem chú thích đầu file.
#   case-lines      : đếm dòng `  PASS: ` + `  FAIL: ` (suite KHÔNG tự in tổng)
#   results-last    : dòng `Results:` CUỐI CÙNG, và nó phải nằm ở ĐUÔI log
#   results-sum:<n> : cộng đúng <n> dòng `Results:` (suite gồm <n> tệp con)
#
# Vì sao phải chia nhỏ đến mức này (bài học của chính vòng sửa 1): bản đầu dùng
# `results-sum` cho cả ba suite có dòng `Results:` và `scripts` đếm ra **730**
# thay vì 664. Nguyên nhân: nhiều ca của suite `scripts` dựng runner con rồi
# CHẠY nó, nên đầu ra có bảy dòng `Results:` của FIXTURE (kể cả một dòng
# "2 passed, 1 failed" cố ý đỏ) trộn lẫn với dòng tổng kết thật ở cuối. Đếm
# cộng dồn ở đó là đọc đầu ra của đồ chơi thành số ca của bộ kiểm.
#   · `scripts`/`hooks` → dòng CUỐI, và phải ở đuôi log (fixture in ở giữa).
#   · `workflows` → cộng, nhưng ĐÚNG 6 dòng: suite này gồm sáu tệp, mỗi tệp tự
#     in tổng kết riêng. Ghim số dòng để nếu một tệp chết giữa chừng (không in
#     nổi dòng tổng kết — đã xảy ra thật, xem AC-11) thì ĐỎ vì thiếu dòng chứ
#     không âm thầm cộng ra một tổng nhỏ hơn.
method_of() {
  case "$1" in
    plugins)   echo case-lines ;;
    workflows) echo results-sum:6 ;;
    scripts)   echo results-last ;;
    hooks)     echo results-last ;;
    *)         echo "" ;;
  esac
}
cmd_of() {
  case "$1" in
    plugins)   echo "bash tests/plugins/run-tests.sh" ;;
    workflows) echo "bash tests/workflows/run-tests.sh" ;;
    scripts)   echo "bash tests/scripts/run-tests.sh" ;;
    hooks)     echo "bash tests/hooks/run-tests.sh" ;;
    *)         echo "" ;;
  esac
}

# ── Con số kỳ vọng: rút từ khối có MARKER trong hợp đồng ─────────────────────
# Khuôn đặt MỘT chỗ (contract.md), đọc bằng đúng một hàm. Khối vắng → ĐỎ ngay,
# không mặc định về số nào: một phép đo mất bản khai thì nó không còn đo gì.
KY_VONG_OPEN='<!-- <<<SO-CA-KY-VONG -->'
KY_VONG_CLOSE='<!-- SO-CA-KY-VONG>>> -->'
ky_vong() {   # $1 = tên suite → in "<truoc> <sau>"
  awk -v o="$KY_VONG_OPEN" -v c="$KY_VONG_CLOSE" -v s="$1" '
    index($0, o) { f = 1; next }
    index($0, c) { f = 0 }
    f && $0 ~ /^\|/ {
      gsub(/[ \t]/, "", $0)
      n = split($0, a, "|")
      if (n >= 4 && a[2] == s) { print a[3], a[4] }
    }
  ' "$CONTRACT"
}

fails=0
run_one() {   # $1 = suite, $2 = log có sẵn (rỗng = chạy thật), $3 = nơi giữ log (có thể rỗng)
  local suite="$1" given_log="$2" keep="$3"
  local method cmd log rc n passed failed pair truoc sau

  method="$(method_of "$suite")"
  cmd="$(cmd_of "$suite")"
  if [ -z "$method" ]; then
    echo "LUU-KHO-SUITE: khong biet suite '$suite'"; fails=$((fails + 1)); return
  fi

  pair="$(ky_vong "$suite")"
  if [ -z "$pair" ]; then
    echo "LUU-KHO-SUITE: $suite KHONG co dong khai trong khoi SO-CA-KY-VONG cua contract.md — phep do khong co ban khai de so"
    fails=$((fails + 1)); return
  fi
  truoc="${pair% *}"; sau="${pair#* }"

  if [ -n "$given_log" ]; then
    log="$given_log"; rc=0
    [ -f "$log" ] || { echo "LUU-KHO-SUITE: khong doc duoc log $log"; fails=$((fails + 1)); return; }
  else
    log="$(mktemp)"
    ( cd "$ROOT" && eval "$cmd" ) > "$log" 2>&1; rc=$?
    [ -n "$keep" ] && cp "$log" "$keep"
  fi

  local nres want_res tail_gap
  nres="$(grep -cE '^Results: [0-9]+ passed, [0-9]+ failed' "$log" || true)"
  case "$method" in
    case-lines)
      passed="$(grep -cE '^  PASS: ' "$log" || true)"
      failed="$(grep -cE '^  FAIL: ' "$log" || true)"
      ;;
    results-last)
      if [ "$nres" -eq 0 ]; then
        echo "LUU-KHO-SUITE: $suite KHONG in duoc dong tong ket nao — suite chet giua chung, so ca khong do duoc"
        fails=$((fails + 1)); return
      fi
      # Dòng tổng kết THẬT nằm ở đuôi. Fixture in ở giữa tệp, nên nếu dòng
      # `Results:` cuối cùng không sát đuôi thì cái ta vừa đọc là của đồ chơi.
      tail_gap="$(awk '/^Results: [0-9]+ passed, [0-9]+ failed/ { last = NR } NF { end = NR } END { print end - last }' "$log")"
      if [ "$tail_gap" -gt 2 ]; then
        echo "LUU-KHO-SUITE: $suite dong Results cuoi cach duoi log $tail_gap dong co noi dung — day khong phai tong ket cua suite"
        fails=$((fails + 1)); return
      fi
      passed="$(awk '/^Results: [0-9]+ passed, [0-9]+ failed/ { p = $2; f = $4 } END { print p + 0 }' "$log")"
      failed="$(awk '/^Results: [0-9]+ passed, [0-9]+ failed/ { p = $2; f = $4 } END { print f + 0 }' "$log")"
      ;;
    results-sum:*)
      want_res="${method#results-sum:}"
      if [ "$nres" -ne "$want_res" ]; then
        echo "LUU-KHO-SUITE: $suite co $nres dong tong ket (mong $want_res) — mot tep con khong in noi tong ket, tong cong ra se NHO HON that"
        fails=$((fails + 1)); return
      fi
      passed="$(awk '/^Results: [0-9]+ passed, [0-9]+ failed/ { s += $2 } END { print s + 0 }' "$log")"
      failed="$(awk '/^Results: [0-9]+ passed, [0-9]+ failed/ { s += $4 } END { print s + 0 }' "$log")"
      ;;
  esac
  n=$((passed + failed))

  # HAI kiểu hỏng, HAI thông điệp — xem luật (c) ở đầu file.
  if [ "$n" -ne "$sau" ]; then
    echo "LUU-KHO-SUITE: so ca lech ky vong: $truoc -> $n (khai $truoc -> $sau, chenh $((n - sau)))"
    echo "               so ca lech nghia la GO QUA TAY hoac GO SOT — di tim ca, KHONG sua so"
    fails=$((fails + 1))
    return
  fi
  if [ "$failed" -ne 0 ]; then
    echo "LUU-KHO-SUITE: $suite du $sau ca nhung $failed ca DO — day la ca hong, KHONG phai so ca lech"
    fails=$((fails + 1))
    return
  fi
  if [ -z "$given_log" ] && [ "$rc" -ne 0 ]; then
    echo "LUU-KHO-SUITE: $suite du $sau ca, 0 ca do, nhung suite tra rc=$rc — ha tang hong hoac khoi thoat lac"
    fails=$((fails + 1))
    return
  fi
  echo "LUU-KHO-SUITE: $suite $truoc -> $sau OK"
  # In lại dòng tổng kết CỦA CHÍNH SUITE để bằng chứng vẫn còn câu gốc — bọc
  # suite trong một script khác mà nuốt luôn đầu ra của nó thì trang bằng chứng
  # mỏng đi đúng chỗ người đọc cần soi. Chỉ in NHỮNG DÒNG PHÉP ĐẾM THẬT SỰ DÙNG:
  # kèm cả dòng của fixture vào đây là mời người đọc cộng nhầm lần nữa.
  case "$method" in
    results-last) grep -E '^Results: [0-9]+ passed' "$log" | tail -1 | sed 's/^/               /' ;;
    results-sum:*) grep -E '^Results: [0-9]+ passed' "$log" | sed 's/^/               /' ;;
    case-lines)   grep -E 'all plugin tests passed|^Results: ' "$log" | tail -1 | sed 's/^/               /' ;;
  esac
  echo "               (dem theo phuong phap '$method': $passed xanh + $failed do)"
}

SUITE=""; LOG=""; KEEP=""
while [ $# -gt 0 ]; do
  case "$1" in
    --suite)    SUITE="$2"; shift 2 ;;
    --log)      LOG="$2"; shift 2 ;;
    --keep-log) KEEP="$2"; shift 2 ;;
    *) echo "so-ca.sh: co lam '$1'" >&2; exit 2 ;;
  esac
done

if [ -n "$SUITE" ]; then
  run_one "$SUITE" "$LOG" "$KEEP"
else
  [ -z "$LOG" ] || { echo "so-ca.sh: --log doi hoi --suite" >&2; exit 2; }
  for s in plugins workflows scripts hooks; do run_one "$s" "" ""; done
fi

if [ "$fails" -gt 0 ]; then
  echo "LUU-KHO-SUITE: $fails dang thuc so ca DO"
  exit 1
fi
echo "LUU-KHO-SUITE: dang thuc so ca khop ban khai"
exit 0
