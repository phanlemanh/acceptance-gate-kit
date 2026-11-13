#!/usr/bin/env bash
# ba-viec-tru.sh (release-2-39-0) — đo ba việc chỉ-bớt của mốc 2.39.0 trên MỘT bản của kho (mặc định HEAD).
#   (1) mô tả của sáu tệp khai plugin ≤ 1 024 ký tự (trần của bộ kiểm tệp khai plugin, repo-setup 0.5.0);
#   (2) `scripts/rel-cua-so.sh` và `lib/eval-yaml.js` không còn, và không chỗ nhắc SỐNG nào trỏ tới chúng
#       (bỏ qua sử: CHANGELOG.md, docs/, hồ sơ _acceptance/*/ — riêng _acceptance/config.yaml vẫn đọc, trừ dòng chú thích);
#   (3) `.env` nằm trong .gitignore ở gốc kho.
# Đọc theo ref bằng git (không đọc cây làm việc), nên cùng lệnh chạy được trên bản cũ làm chiều đỏ:
#   bash ba-viec-tru.sh            # HEAD — phải exit 0
#   bash ba-viec-tru.sh v2.38.1    # trước mốc — phải exit 1 và nêu đủ ba việc
set -o pipefail
REF="${1:-HEAD}"
git rev-parse -q --verify "$REF^{commit}" >/dev/null || { echo "ĐỎ: không đọc được ref $REF"; exit 2; }
rc=0
mf=$(git ls-tree -r --name-only "$REF" | grep -E '(^|/)\.claude-plugin/plugin\.json$' | grep -v '^_acceptance/')
n=$(printf '%s\n' "$mf" | grep -c .)
[ "$n" -eq 6 ] || { echo "ĐỎ: rút được $n tệp khai plugin ở $REF, mong 6"; exit 2; }
for f in $mf; do
  len=$(git show "$REF:$f" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>console.log([...(JSON.parse(s).description||"")].length))') || { echo "ĐỎ: không đọc được $f"; exit 2; }
  if [ "$len" -le 1024 ]; then echo "  mô tả $f: $len ≤ 1024"; else echo "ĐỎ: mô tả $f dài $len > 1024"; rc=1; fi
done
for f in scripts/rel-cua-so.sh lib/eval-yaml.js; do
  if git cat-file -e "$REF:$f" 2>/dev/null; then echo "ĐỎ: $f vẫn còn ở $REF"; rc=1; else echo "  $f: không còn"; fi
done
nhac=$( { git grep -nE 'scripts/rel-cua-so\.sh|lib/eval-yaml\.js' "$REF" -- . ':(exclude)CHANGELOG.md' ':(exclude)docs/**' ':(exclude)_acceptance/**' ;
          git grep -nE 'scripts/rel-cua-so\.sh|lib/eval-yaml\.js' "$REF" -- _acceptance/config.yaml | grep -vE '^[^:]+:[^:]+:[0-9]+:[[:space:]]*#' ; } | grep . )
if [ -n "$nhac" ]; then echo "ĐỎ: còn chỗ nhắc sống tới tệp đã gỡ:"; printf '%s\n' "$nhac" | sed 's/^/    /'; rc=1; else echo "  chỗ nhắc sống: 0"; fi
if git show "$REF:.gitignore" 2>/dev/null | grep -qxE '/?\.env'; then echo "  .gitignore có .env"; else echo "ĐỎ: .gitignore ở $REF không bỏ qua .env"; rc=1; fi
[ $rc -eq 0 ] && echo "XANH: ba việc chỉ-bớt đã xong ở $REF"
exit $rc
