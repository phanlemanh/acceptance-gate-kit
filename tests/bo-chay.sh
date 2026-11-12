#!/usr/bin/env bash
# tests/bo-chay.sh — phần dùng chung của bốn bộ chạy kiểm (hồ sơ luot-kiem-nhe).
#
# Hai việc, không gọi tiến trình con nào trên mỗi ca (chỉ lúc mở và lúc đóng):
#
# 1. bc_node <gốc kho> — bộ chạy TỰ XƯNG phiên bản Node nó đang chạy và TỰ SO với lời khai của kho
#    (dòng đầu `<gốc>/.nvmrc`, bỏ tiền tố `v`). So theo đúng độ chính xác người khai: khai `24` → so số
#    chính, `24.22` → so hai số, `24.22.0` → so đủ. Khớp → một dòng stdout, trả 0. Lệch, vắng, không đọc
#    được → một dòng stderr, trả 3. Bộ chạy gọi nó TRƯỚC ca đầu tiên và thoát 3 khi nó trả khác 0.
#    Chạy độc lập cho các việc không qua bộ chạy bash: `bash tests/bo-chay.sh node [<gốc>]`.
#
# 2. bc_tg_mo <bộ> <mảnh> <gốc> · bc_tg_dong — bảng thời gian TỪNG CA. bc_tg_mo đặt một bộ lọc dòng lên stdout
#    của bộ chạy; mỗi dòng kết quả ca («PASS:»/«FAIL:» ở mọi tầng) thành một hàng = khoảng từ dòng kết quả
#    trước tới dòng này. bc_tg_dong trả stdout về chỗ cũ và chờ bảng in xong. Nguồn giờ: $EPOCHREALTIME khi có (bash 5 — lượt kiểm tự động, mili
#    giây), không thì $SECONDS (bash 3.2 của macOS, giây). Tệp: ${THOI_GIAN_CA_DIR:-<gốc>/.acceptance-runs/
#    thoi-gian-ca}/<bộ>-<mảnh>.tsv, cột «giây<TAB>ca», ghi dần (lượt chết giữa chừng vẫn còn số). Cuối
#    lượt in mười ca chậm nhất; trên lượt kiểm tự động (GITHUB_ACTIONS=true) in thêm trọn bảng trong một
#    nhóm thu gọn và nối 15 ca chậm nhất vào $GITHUB_STEP_SUMMARY.

bc_node() {
  local goc="${1:-.}" tep khai chay sach k
  tep="$goc/.nvmrc"
  if [ ! -f "$tep" ]; then
    echo "node: kho chưa khai phiên bản Node (.nvmrc vắng ở $goc)" >&2
    return 3
  fi
  IFS= read -r khai < "$tep" || :
  khai="${khai%$'\r'}"
  khai="$(printf '%s' "$khai" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  sach="${khai#v}"
  case "$sach" in
    ''|*[!0-9.]*|.*|*.|*..*) echo "node: không đọc được lời khai «$khai» trong .nvmrc — ghi số phiên bản" >&2; return 3 ;;
  esac
  k="$(printf '%s' "$sach" | awk -F. '{print NF}')"
  if [ "$k" -gt 3 ]; then
    echo "node: không đọc được lời khai «$khai» trong .nvmrc — ghi số phiên bản" >&2; return 3
  fi
  chay="$(node --version 2>/dev/null)" || chay=""
  chay="${chay#v}"
  case "$chay" in
    ''|*[!0-9.]*) echo "node lệch: không chạy được node trong PATH, kho khai $khai (.nvmrc) — đổi Node rồi chạy lại" >&2; return 3 ;;
  esac
  # so k phần đầu
  local c1 c2 c3 s1 s2 s3
  IFS=. read -r c1 c2 c3 <<EOF
$chay
EOF
  IFS=. read -r s1 s2 s3 <<EOF
$sach
EOF
  if [ "$c1" != "$s1" ] || { [ "$k" -ge 2 ] && [ "$c2" != "$s2" ]; } || { [ "$k" -ge 3 ] && [ "$c3" != "$s3" ]; }; then
    echo "node lệch: đang chạy v$chay, kho khai $khai (.nvmrc) — đổi Node rồi chạy lại" >&2
    return 3
  fi
  echo "node: v$chay · kho khai $khai (.nvmrc) · khớp"
  return 0
}

bc__us() { # đặt bc__bay = thời điểm hiện tại theo micro giây, không tạo tiến trình con
  if [ -n "${EPOCHREALTIME:-}" ]; then
    local t="${EPOCHREALTIME/,/.}"
    local giay="${t%.*}" le="${t#*.}000000"
    le="${le:0:6}"
    bc__bay=$(( giay * 1000000 + 10#$le ))
  else
    bc__bay=$(( SECONDS * 1000000 ))
  fi
}

bc__giay() { printf '%d.%03d' $(( $1 / 1000000 )) $(( ($1 % 1000000) / 1000 )); }

bc_tg_ca() { # <tên ca> — ghi một hàng: thời gian từ hàng trước tới giờ
  [ -n "${bc__tep:-}" ] || return 0
  bc__us
  local d=$(( bc__bay - bc__truoc ))
  bc__truoc=$bc__bay
  local ten="${1//$'\t'/ }"
  printf '%d.%03d\t%s\n' $(( d / 1000000 )) $(( (d % 1000000) / 1000 )) "${ten:0:160}" >> "$bc__tep"
}

bc__tom_tat() {
  bc__us
  local tong=$(( bc__bay - bc__dau )) n tab
  tab="$(printf '\t')"
  n="$(grep -c '' "$bc__tep" 2>/dev/null)" || n=0
  local nhan="$bc__bo/$bc__manh"
  echo ""
  echo "Thời gian từng ca ($nhan): $n ca · tổng $(bc__giay "$tong") s · chậm nhất:"
  sort -t "$tab" -k1,1nr "$bc__tep" | head -n 10 | awk -F '\t' '{ printf "  %10s s  %s\n", $1, $2 }'
  if [ "${GITHUB_ACTIONS:-}" = true ]; then
    echo "::group::Thời gian từng ca ($nhan) — trọn bảng $n ca"
    sort -t "$tab" -k1,1nr "$bc__tep" | awk -F '\t' '{ printf "%10s s  %s\n", $1, $2 }'
    echo "::endgroup::"
    if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
      {
        echo "### Thời gian từng ca — $nhan"
        echo ""
        echo "$n ca · tổng $(bc__giay "$tong") s · 15 ca chậm nhất"
        echo ""
        echo "| Giây | Ca |"
        echo "|---:|---|"
        sort -t "$tab" -k1,1nr "$bc__tep" | head -n 15 | awk -F '\t' '{ gsub(/\|/, "\\|", $2); printf "| %s | %s |\n", $1, $2 }'
        echo ""
      } >> "$GITHUB_STEP_SUMMARY"
    fi
  fi
}

# Bộ lọc dòng: chuyển nguyên mọi dòng stdout của bộ chạy, và ghi một hàng cho mỗi dòng KẾT QUẢ CA mà bộ chạy in
# (sau khoảng trắng đầu dòng là «PASS:» hay «FAIL:») — ở mọi tầng: hàm ghi đạt/trượt của bộ chạy, chỗ tự ghi giữa
# thân bộ chạy, và ca con của tệp ca chạy bên trong. Đơn vị «ca» vì thế là chính dòng kết quả người đọc nhật ký thấy.
bc__loc() {
  local l t
  while IFS= read -r l || [ -n "$l" ]; do
    printf '%s\n' "$l"
    t="${l#"${l%%[![:space:]]*}"}"
    case "$t" in PASS:*|FAIL:*) bc_tg_ca "$t" ;; esac
  done
  bc__tom_tat
  : > "$bc__tep.xong"
}

bc_tg_mo() { # <bộ> <mảnh> <gốc> — mở bảng và đặt bộ lọc lên stdout của bộ chạy
  local bo="$1" manh="${2:-all}" goc="${3:-.}"
  case "$manh" in all|'') manh=tron ;; esac
  manh="$(printf '%s' "$manh" | tr ':/' '--')"
  bc__bo="$bo"; bc__manh="$manh"
  bc__dir="${THOI_GIAN_CA_DIR:-$goc/.acceptance-runs/thoi-gian-ca}"
  bc__tep=""
  mkdir -p "$bc__dir" 2>/dev/null || return 0
  bc__tep="$bc__dir/$bo-$manh.tsv"
  { : > "$bc__tep"; } 2>/dev/null || { bc__tep=""; return 0; }
  rm -f "$bc__tep.xong"
  bc__us; bc__dau=$bc__bay; bc__truoc=$bc__bay
  exec 8>&1
  exec 1> >(bc__loc)
  bc__loc_mo=1
}

bc_tg_dong() { # trả stdout về chỗ cũ, chờ bộ lọc in xong bảng (tối đa 10 giây)
  [ -n "${bc__loc_mo:-}" ] || return 0
  bc__loc_mo=""
  exec 1>&8 8>&-
  local i=0
  while [ ! -f "$bc__tep.xong" ] && [ "$i" -lt 100 ]; do sleep 0.1; i=$((i + 1)); done
  rm -f "$bc__tep.xong"
}

# Chạy độc lập: `bash tests/bo-chay.sh node [<gốc>]` — gốc mặc định là gốc kho suy từ vị trí tệp này.
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  case "${1:-}" in
    node) bc_node "${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"; exit $? ;;
    *) echo "dùng: bash tests/bo-chay.sh node [<gốc kho>]" >&2; exit 2 ;;
  esac
fi
