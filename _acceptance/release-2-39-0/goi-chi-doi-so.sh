#!/usr/bin/env bash
# goi-chi-doi-so.sh (release-2-39-0) — `road-map/` và `tri-thuc/` chỉ đổi SỐ từ mốc trước tới HEAD:
# tập tệp đổi BẰNG đúng hai tệp khai, VÀ mọi dòng đổi trong đó là dòng "version" (vá Ngoài-1 của mốc 2.38.1 —
# bản cũ chỉ xác nhận gói có đổi tệp khai, không xác nhận nó chỉ đổi số).
#   bash goi-chi-doi-so.sh <mốc-trước>    # exit 0 khớp · 1 lệch
MOC="$1"; [ -n "$MOC" ] || { echo "usage: goi-chi-doi-so.sh <mốc-trước>" >&2; exit 2; }
d=$(git diff --name-only "$MOC" HEAD -- road-map tri-thuc | tr '\n' ' ')
x=$(git diff -U0 "$MOC" HEAD -- road-map tri-thuc | grep -E '^[-+][^-+]' | grep -v '"version":')
echo "goi chi doi so: $d"
rc=0
[ "$d" = "road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json " ] || { echo "ĐỎ: tập tệp đổi khác hai tệp khai"; rc=1; }
[ -z "$x" ] || { echo "ĐỎ: dòng đổi ngoài \"version\":"; printf '%s\n' "$x" | sed 's/^/    /'; rc=1; }
[ $rc -eq 0 ] && echo "XANH: hai gói chỉ đổi dòng version"
exit $rc
