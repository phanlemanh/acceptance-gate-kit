#!/usr/bin/env bash
# lop-chep-doi.sh (release-2-38-0) — bản của release-2-29-0 thêm MỘT ca: ghi chú nói «không chép gì».
# Bản 2.29 thoát 2 khi gạch «- **Lớp chép CI:…» không kể tệp nào, nên không đo được mốc mà lớp chép đứng yên
# (2.38.0: 0/36 tệp đổi từ v2.37.0). Bản này nhận tập mong đợi RỖNG chỉ khi gạch nói đúng chữ «không chép gì»,
# và vẫn đỏ khi gạch nói thế mà có tệp đổi, hay gạch kể tệp mà nói thế.
#   bash lop-chep-doi.sh <mốc-trước> <số-mục-CHANGELOG>
#   exit 0 khớp · 1 lệch (in thừa/thiếu) · 2 không rút được danh sách chép (< 20 tệp) hay gạch ghi chú vắng
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
mong=$(printf '%s\n' "$gach" | grep -oE '`[^`]+`' | tr -d '`' | sort -u | comm -12 - <(printf '%s\n' "$ds") | grep .)
khong=0; printf '%s\n' "$gach" | grep -q 'không chép gì' && khong=1
doi=$(for f in $ds; do git diff --quiet "$MOC" HEAD -- "$f" || echo "$f"; done | sort -u | grep .)
echo "lớp chép: $n tệp · đổi từ $MOC: $(echo $doi)"
echo "ghi chú $SO kể: $(echo $mong)$( [ $khong -eq 1 ] && echo '(không chép gì)')"
rc=0
if [ -z "$mong" ] && [ $khong -eq 0 ]; then
  echo "ĐỎ: gạch «Lớp chép CI» của mục $SO không kể tệp nào và không nói «không chép gì»"; exit 2
fi
[ -n "$mong" ] && [ $khong -eq 1 ] && { echo "ĐỎ: gạch nói «không chép gì» mà vẫn kể tệp: $(echo $mong)"; rc=1; }
thua=$(comm -23 <(printf '%s\n' "$doi") <(printf '%s\n' "$mong") | grep .)
thieu=$(comm -13 <(printf '%s\n' "$doi") <(printf '%s\n' "$mong") | grep .)
[ -n "$thua" ] && { echo "ĐỎ: tệp đổi mà ghi chú KHÔNG kể: $(echo $thua)"; rc=1; }
[ -n "$thieu" ] && { echo "ĐỎ: ghi chú kể tệp KHÔNG đổi: $(echo $thieu)"; rc=1; }
[ $rc -eq 0 ] && echo "XANH: đúng $(printf '%s\n' "$doi" | grep -c .) tệp đổi như ghi chú $SO kể"
exit $rc
