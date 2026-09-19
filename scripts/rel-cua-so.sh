#!/usr/bin/env bash
# rel-cua-so.sh — hồ sơ ĐƯỢC KÝ trong một cửa sổ phát hành, suy từ kho.
#
# Vì sao tồn tại: hợp đồng mốc kể «cửa sổ này có gì» bằng tay, và lời kể ấy đã
# SAI ngay bản nháp đầu của 2.17.0 (kể 2, thật 3). Tiền tố commit KHÔNG phải
# slug — `feat(duong-nen)` là phạm vi, hồ sơ là `nen-cong-cu-lenh-shell` — nên
# phép rút theo tiền tố cho kết quả sai; quan hệ đúng là TRẠNG THÁI hợp đồng.
#
#   scripts/rel-cua-so.sh <mốc-trước> <slug...>    # so tập rút với tập mong đợi
#   exit 0 khớp · 1 lệch (in thừa/thiếu có tên) · 2 usage
set -o pipefail
MOC="$1"; shift || true
[ -n "$MOC" ] || { echo "usage: rel-cua-so.sh <mốc-trước> <slug...>" >&2; exit 2; }
[ $# -gt 0 ] || { echo "usage: rel-cua-so.sh <mốc-trước> <slug...>" >&2; exit 2; }
rut() {
  for f in $(git log --format= --name-only "$MOC"..HEAD -- '_acceptance/*/contract.md' | sort -u); do
    [ -f "$f" ] || continue
    s=$(basename "$(dirname "$f")")
    case "$s" in release-*) continue ;; esac
    [ "$(grep -m1 '^status:' "$f" | awk '{print $2}')" = signed-off ] || continue
    [ "$(git show "$MOC:$f" 2>/dev/null | grep -m1 '^status:' | awk '{print $2}')" = signed-off ] && continue
    echo "$s"
  done | sort -u
}
got=$(rut); mong=$(printf '%s\n' "$@" | sort -u)
thua=$(comm -23 <(printf '%s\n' "$got") <(printf '%s\n' "$mong"))
thieu=$(comm -13 <(printf '%s\n' "$got") <(printf '%s\n' "$mong"))
echo "rút từ kho: $(echo $got)"
echo "mốc kể    : $(echo $mong)"
rc=0
[ -n "$thua" ] && { echo "ĐỎ: hồ sơ ĐƯỢC KÝ trong cửa sổ mà mốc KHÔNG kể: $(echo $thua)"; rc=1; }
[ -n "$thieu" ] && { echo "ĐỎ: mốc kể hồ sơ KHÔNG được ký trong cửa sổ: $(echo $thieu)"; rc=1; }
[ $rc -eq 0 ] && echo "XANH: hai tập bằng nhau"
exit $rc
