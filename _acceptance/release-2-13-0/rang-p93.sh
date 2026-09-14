#!/usr/bin/env bash
# rang-p93.sh — răng của hồ sơ release-2-13-0, hai chân `im` và `do`, cho AC-5.
#
# Lời hứa: ca P93 (cặp marker duy nhất toàn kho) đo cây NGUỒN — tập tệp git THEO DÕI —
# chứ không đo kiểm kê tệp của cây LÀM VIỆC. Hình dạng lỗi này đã đếm SÁU lần qua bốn
# cửa sổ (2.12.0 gọi tên ở lượt chấm 4 và 5 của chính nó; lượt chấm 4 của vòng
# khoi-tim-loi-tra-phi-theo-vat đỏ cùng chữ ký, không tái hiện được): một tệp nháp
# không-được-theo-dõi của bất kỳ tác tử nào trong bầy chứa một cặp marker là P93 đỏ, và
# người đọc kết luận «kho có hai bản luật» về một kho hoàn toàn lành.
#
# ── PHÉP VI PHÂN: MỘT bản sao, MỘT tệp fixture, đổi ĐÚNG MỘT BIẾN ────────────────
# Hai chân chạy trên CÙNG một bản sao git mang CÙNG một vật, và chỉ khác nhau ở
# tracked-ness của đúng một tệp:
#   --chan im   fixture đặt trong bản sao, KHÔNG add  → P93 phải IM
#   --chan do   fixture đặt trong bản sao, CÓ add     → P93 phải ĐỎ, thông điệp ghim
# Vì hai chân khác nhau đúng một biến, phép đo PHÂN BIỆT được bản đã vá với bản chưa vá:
# bản chưa vá (rglob bắt-tất-cả) đỏ ở CẢ HAI chân, nên chân `im` của nó sẽ đỏ. Bản trước
# đây cho chân `do` clone HEAD trong khi chân `im` chạy cây làm việc — hai chân đo hai
# phiên bản khác nhau, và vì P93 đếm cặp bất kể tracked-ness, chân `do` XANH trên cả mã
# cũ lẫn mã mới: một chân hằng-đúng. Phản biện context sạch bắt (P0, 14/09).
#
# ── VẬT ĐANG ĐO PHẢI Ở TRONG BẢN SAO ────────────────────────────────────────────
# `git clone --local` chỉ mang HEAD. Nếu nhát vá còn ở cây làm việc, bản sao quét bằng
# mã CŨ và mọi kết luận nói về một vật khác. Nên sau khi clone, vật được CHÉP từ cây làm
# việc vào bản sao và răng KHẲNG ĐỊNH hai bản băm bằng nhau; lệch hoặc không đọc được
# thì thoát 2. Dấu vật in ra dòng PASS để bằng chứng tự phân biệt được bản.
#
# ── ĐỐI CHỨNG DƯƠNG ─────────────────────────────────────────────────────────────
# Trước khi tin bất kỳ kết luận nào: bản sao mang vật mà CHƯA có fixture phải in đúng
# một dòng PASS của P93. Không có nó thì «im» không phân biệt được với «P93 chưa từng
# chạy», và «đỏ» không phân biệt được với «kho vốn đã đỏ».
#
# Phán quyết rút TỪ DÒNG CỦA CHÍNH P93 (PASS: P93 / FAIL: P93), không từ mã thoát trọn
# suite — cùng lý do với rang-p200.sh của hồ sơ này. Và một dòng FAIL chỉ được đọc là
# «phép quét sai» khi nó mang THÔNG ĐIỆP GHIM của phép đếm cặp marker; FAIL vì chuỗi
# khác là hạ tầng, có mã riêng (phản biện context sạch bắt, P1 14/09) — nếu không, một
# máy thiếu python3 hay một thư mục nguồn đổi tên sẽ được khai thành «vật nói dối», đúng
# lớp hạ-tầng-tự-sinh-tín-hiệu-đỏ mà mốc này sinh ra để giết.
#
#   2  chưa từng chạy / không có nền để đo (suite không khởi được · ONLY_BLOCK không
#      khớp khối nào · không rút được khối marker · clone hỏng · vật trong bản sao
#      LỆCH cây làm việc · tiêm không thành)              → không có vật để đo
#   3  VẬT nói dối: chân im → P93 đỏ đúng thông điệp đếm cặp vì một tệp KHÔNG theo dõi
#                   chân do → P93 xanh dù fixture đã vào index (độ nhạy chết)
#   4  đối chứng dương hỏng: bản sao mang vật, chưa có fixture, mà P93 đã đỏ hoặc không
#      kết luận                                            → mọi chiều dưới vô nghĩa
#   5  P93 đỏ vì LÝ DO KHÁC (FAIL không mang thông điệp ghim), hoặc không đúng một dòng
#      PASS                                                → chưa kết luận được
#   8  không đọc được dấu bản răng                         → hạ tầng sau-khi-đã-chạy
#   0  xanh
#
# Giới hạn KHAI TRƯỚC (AC-5, hợp đồng): sau khi vá, một tệp nguồn MỚI chưa add/commit
# mang cặp marker trùng sẽ vô hình với P93 cho tới khi vào index. Chấp nhận được vì lưới
# trước-merge chạy trên cây đã commit; nhưng phải nói ra ở đây.
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NGUON="skills/acceptance/references/human-facing-language.md"
VAT="tests/plugins/run-tests.sh"
FIXTURE="docs/rang-p93-ban-thu.md"
BLOCK="P93"
GHIM="cap marker HFL-LAW-TABLE co 3 khoi"

CHAN=""
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) [ $# -ge 2 ] || { echo "rang-p93: --chan thieu gia tri" >&2; exit 2; }
      CHAN="$2"; shift 2 ;;
    *) echo "rang-p93: tham so la: $1" >&2; exit 2 ;;
  esac
done
case "$CHAN" in im|do) ;; *) echo "rang-p93: --chan phai la 'im' hoac 'do' (thay: '${CHAN}')" >&2; exit 2 ;; esac

git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1 || {
  echo "DO: ROOT (${ROOT}) khong phai kho git — khong co nen de do" >&2; exit 8; }

# Dấu bản răng, suy từ chính tệp đang chạy (P150) — bằng chứng tự phân biệt được bản.
TEP="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
DAU="$(git -C "$ROOT" hash-object "$TEP" 2>/dev/null | cut -c1-8)"
[ -n "$DAU" ] || { echo "DO: khong doc duoc dau ban rang cua ${TEP}" >&2; exit 8; }

# Fixture RÚT TỪ NGUỒN, không gõ tay: khối marker HFL-LAW-TABLE của tệp luật.
KHOI="$(awk '/<!-- <<<HFL-LAW-TABLE -->/{f=1} f{print} /<!-- HFL-LAW-TABLE>>> -->/{if(f){exit}}' "$ROOT/$NGUON" 2>/dev/null)"
printf '%s\n' "$KHOI" | grep -q '<<<HFL-LAW-TABLE' && printf '%s\n' "$KHOI" | grep -q 'HFL-LAW-TABLE>>>' || {
  echo "DO: khong rut duoc khoi marker HFL-LAW-TABLE tu ${NGUON} — khong co fixture de tiem" >&2; exit 2; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
BS="$TMP/ban-sao"
git clone --quiet --local "$ROOT" "$BS" 2>/dev/null || {
  echo "DO: khong clone duoc kho vao ban sao — khong co nen de do" >&2; exit 2; }

# VẬT ĐANG ĐO: chép từ cây làm việc rồi KHẲNG ĐỊNH hai băm bằng nhau.
cp "$ROOT/$VAT" "$BS/$VAT" 2>/dev/null || { echo "DO: khong chep duoc ${VAT} vao ban sao" >&2; exit 2; }
H_ROOT="$(git -C "$ROOT" hash-object "$ROOT/$VAT" 2>/dev/null)"
H_BS="$(git -C "$ROOT" hash-object "$BS/$VAT" 2>/dev/null)"
if [ -z "$H_ROOT" ] || [ "$H_ROOT" != "$H_BS" ]; then
  echo "DO: ban sao KHONG mang vat dang do — bam ${VAT} lech (cay lam viec '${H_ROOT}' vs ban sao '${H_BS}')" >&2
  exit 2
fi
DAU_VAT="$(printf '%s' "$H_ROOT" | cut -c1-8)"
git -C "$BS" add "$VAT" >/dev/null 2>&1 || { echo "DO: khong add duoc vat vao index ban sao" >&2; exit 2; }

chay() { ( cd "$BS" && ONLY_BLOCK="$BLOCK" bash tests/plugins/run-tests.sh 2>&1 ); }
dem() { printf '%s\n' "$1" | grep -c "$2" || true; }
chua_chay() { # $1 = OUT, $2 = RC
  { [ "$2" -eq 127 ] || [ "$2" -eq 126 ]; } && return 0
  [ -z "$1" ] && return 0
  printf '%s\n' "$1" | grep -qF 'khong khop khoi nao' && return 0
  printf '%s\n' "$1" | grep -qF "$BLOCK" || return 0
  return 1
}

# ── ĐỐI CHỨNG DƯƠNG: bản sao mang vật, CHƯA có fixture ───────────────────────────
OUT0="$(chay)"; RC0=$?
if chua_chay "$OUT0" "$RC0"; then
  echo "DO: P93 chua tung chay tren ban sao mang vat (rc=${RC0})" >&2; exit 2; fi
if [ "$(dem "$OUT0" "FAIL: $BLOCK")" != "0" ] || [ "$(dem "$OUT0" "PASS: $BLOCK")" != "1" ]; then
  echo "DO: doi chung duong hong — ban sao mang vat, chua co fixture, ma P93 khong xanh sach:" >&2
  printf '%s\n' "$OUT0" | grep -F "$BLOCK" >&2 || true
  exit 4
fi

printf '%s\n' "$KHOI" > "$BS/$FIXTURE"
[ -s "$BS/$FIXTURE" ] || { echo "DO: khong ghi duoc fixture ${FIXTURE} vao ban sao" >&2; exit 2; }

if [ "$CHAN" = "do" ]; then
  git -C "$BS" add "$FIXTURE" >/dev/null 2>&1 || { echo "DO: git add fixture that bai" >&2; exit 2; }
  git -C "$BS" ls-files --error-unmatch "$FIXTURE" >/dev/null 2>&1 || {
    echo "DO: fixture KHONG vao index — tiem khong thanh" >&2; exit 2; }
else
  # Chân im: fixture phải THẬT SỰ không được theo dõi, nếu không «im» là im vì chưa tiêm.
  if git -C "$BS" ls-files --error-unmatch "$FIXTURE" >/dev/null 2>&1; then
    echo "DO: fixture lai DUOC theo doi trong ban sao — fixture sai hinh" >&2; exit 2; fi
fi

OUT="$(chay)"; RC=$?
if chua_chay "$OUT" "$RC"; then echo "DO: P93 chua tung chay sau khi tiem (rc=${RC})" >&2; exit 2; fi
printf '%s\n' "$OUT" | grep -F "$BLOCK" || true
NF="$(dem "$OUT" "FAIL: $BLOCK")"; NP="$(dem "$OUT" "PASS: $BLOCK")"
CO_GHIM=1; printf '%s\n' "$OUT" | grep -qF "$GHIM" || CO_GHIM=0

if [ "$CHAN" = "im" ]; then
  if [ "$NF" != "0" ]; then
    if [ "$CO_GHIM" = "1" ]; then
      echo "DO: P93 DO vi mot tep KHONG theo doi trong ban sao — phep quet van do cay LAM VIEC, khong do cay NGUON (vat ${DAU_VAT})" >&2
      exit 3
    fi
    echo "DO: P93 do vi LY DO KHAC (khong mang thong diep '${GHIM}') — ha tang, khong phai ket luan ve vat:" >&2
    printf '%s\n' "$OUT" | grep -F "FAIL: $BLOCK" >&2 || true
    exit 5
  fi
  [ "$NP" = "1" ] || { echo "DO: so dong PASS: P93 khong phai 1 (doc duoc '${NP}') — chua ket luan duoc" >&2; exit 5; }
  echo "PASS: P93 IM truoc fixture KHONG theo doi trong ban sao mang vat (doi chung duong: ban sao chua tiem XANH; fixture rut tu nguon; vat ${DAU_VAT}; rang ban ${DAU})"
  exit 0
fi

# --chan do
if [ "$NF" = "0" ]; then
  echo "DO: fixture DA vao index ma P93 van XANH — do nhay chet (vat ${DAU_VAT})" >&2; exit 3; fi
[ "$CO_GHIM" = "1" ] || {
  echo "DO: P93 do nhung thieu thong diep ghim '${GHIM}' — do vi ly do khac:" >&2
  printf '%s\n' "$OUT" | grep -F "FAIL: $BLOCK" >&2 || true
  exit 5; }
echo "PASS: P93 DO dung thong diep khi fixture vao index, cung ban sao va cung vat voi chan im (doi chung duong: ban sao chua tiem XANH; vat ${DAU_VAT}; rang ban ${DAU})"
