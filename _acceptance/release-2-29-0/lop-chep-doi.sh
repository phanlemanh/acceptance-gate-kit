#!/usr/bin/env bash
# lop-chep-doi.sh — tệp nào của lớp chép CI (khối INIT-CI-COPY-LIST của acceptance-init) đổi byte từ mốc trước,
# so với ĐÚNG danh sách ghi chú nhận của CHANGELOG bảo kho tiêu thụ chép lại.
# Vì sao: Ngoài-1 của release-2-28-0 (Known limits) — bản 2.28 so với danh sách gõ tay trong lệnh, không đọc lại
# ghi chú; sửa ghi chú mà quên sửa danh sách thì phép kiểm vẫn đạt. Bản này RÚT danh sách mong đợi từ gạch
# «- **Lớp chép CI:** …» trong mục «## <số>» của CHANGELOG.md (mọi `đường/tệp` trong backtick của gạch đó, kể cả
# dòng nối tiếp, mà nằm trong danh sách chép).
#   bash lop-chep-doi.sh <mốc-trước> <số-mục-CHANGELOG>
#   exit 0 khớp · 1 lệch (in thừa/thiếu) · 2 không rút được danh sách chép (< 20 tệp) hay gạch ghi chú vắng/rỗng
set -o pipefail
MOC="$1"; SO="$2"
[ -n "$MOC" ] && [ -n "$SO" ] || { echo "usage: lop-chep-doi.sh <mốc-trước> <số-mục-CHANGELOG>" >&2; exit 2; }
ds=$(awk '/<<<INIT-CI-COPY-LIST/,/INIT-CI-COPY-LIST>>>/' commands/acceptance-init.md \
  | grep -oE '\$\{CLAUDE_PLUGIN_ROOT\}/[^ `"]+' | sed 's#^\${CLAUDE_PLUGIN_ROOT}/##' | sort -u)
n=$(printf '%s\n' "$ds" | grep -c .)
[ "$n" -ge 20 ] || { echo "ĐỎ: chỉ rút được $n tệp từ INIT-CI-COPY-LIST — khối đổi khuôn?"; exit 2; }
gach=$(awk -v so="$SO" '
  $0 ~ "^## " so "( |$)" { f=1; next }  f && /^## / { exit }
  f && /^- \*\*Lớp chép CI:/ { g=1; print; next }
  g && /^  / { print; next }  g { exit }' CHANGELOG.md)
[ -n "$gach" ] || { echo "ĐỎ: mục «## $SO» của CHANGELOG không có gạch «- **Lớp chép CI:…»"; exit 2; }
mong=$(printf '%s\n' "$gach" | grep -oE '`[^`]+`' | tr -d '`' | sort -u | comm -12 - <(printf '%s\n' "$ds"))
[ -n "$mong" ] || { echo "ĐỎ: gạch «Lớp chép CI» của mục $SO không kể tệp nào thuộc danh sách chép"; exit 2; }
doi=$(for f in $ds; do git diff --quiet "$MOC" HEAD -- "$f" || echo "$f"; done | sort -u)
echo "lớp chép: $n tệp · đổi từ $MOC: $(echo $doi)"
echo "ghi chú $SO kể: $(echo $mong)"
thua=$(comm -23 <(printf '%s\n' "$doi") <(printf '%s\n' "$mong") | grep .)
thieu=$(comm -13 <(printf '%s\n' "$doi") <(printf '%s\n' "$mong") | grep .)
rc=0
[ -n "$thua" ] && { echo "ĐỎ: tệp đổi mà ghi chú KHÔNG kể: $(echo $thua)"; rc=1; }
[ -n "$thieu" ] && { echo "ĐỎ: ghi chú kể tệp KHÔNG đổi: $(echo $thieu)"; rc=1; }
[ $rc -eq 0 ] && echo "XANH: đúng $(printf '%s\n' "$doi" | grep -c .) tệp đổi như ghi chú $SO kể"
exit $rc
