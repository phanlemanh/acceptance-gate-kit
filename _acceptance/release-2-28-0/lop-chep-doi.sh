#!/usr/bin/env bash
# lop-chep-doi.sh — tệp nào của lớp chép CI (khối INIT-CI-COPY-LIST của acceptance-init) đổi byte từ mốc trước.
# Vì sao: mục 2.28.0 của CHANGELOG bảo kho tiêu thụ «chép lại MỘT tệp»; lời đó phải khớp vật, không khớp trí nhớ.
#   bash lop-chep-doi.sh <mốc-trước> <tệp đổi mong đợi...>
#   exit 0 khớp · 1 lệch (in thừa/thiếu) · 2 không rút được danh sách (đếm canh: phải có ≥ 20 tệp)
set -o pipefail
MOC="$1"; shift || true
[ -n "$MOC" ] || { echo "usage: lop-chep-doi.sh <mốc-trước> <tệp...>" >&2; exit 2; }
ds=$(awk '/<<<INIT-CI-COPY-LIST/,/INIT-CI-COPY-LIST>>>/' commands/acceptance-init.md \
  | grep -oE '\$\{CLAUDE_PLUGIN_ROOT\}/[^ `"]+' | sed 's#^\${CLAUDE_PLUGIN_ROOT}/##' | sort -u)
n=$(printf '%s\n' "$ds" | grep -c .)
[ "$n" -ge 20 ] || { echo "ĐỎ: chỉ rút được $n tệp từ INIT-CI-COPY-LIST — khối đổi khuôn?"; exit 2; }
doi=$(for f in $ds; do git diff --quiet "$MOC" HEAD -- "$f" || echo "$f"; done | sort -u)
mong=$(printf '%s\n' "$@" | grep . | sort -u)
echo "lớp chép: $n tệp · đổi từ $MOC: $(echo $doi)"
thua=$(comm -23 <(printf '%s\n' "$doi") <(printf '%s\n' "$mong") | grep .)
thieu=$(comm -13 <(printf '%s\n' "$doi") <(printf '%s\n' "$mong") | grep .)
rc=0
[ -n "$thua" ] && { echo "ĐỎ: tệp đổi mà mốc KHÔNG kể: $(echo $thua)"; rc=1; }
[ -n "$thieu" ] && { echo "ĐỎ: mốc kể tệp KHÔNG đổi: $(echo $thieu)"; rc=1; }
[ $rc -eq 0 ] && echo "XANH: đúng $(printf '%s\n' "$doi" | grep -c .) tệp đổi như mốc kể"
exit $rc
