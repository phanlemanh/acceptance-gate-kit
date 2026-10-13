#!/bin/bash
# Đo 11/10 cho ô bat-bien-san-pham: múi giờ của tổ chức ghi cứng trong crm.
# Chạy: bash do-mui-gio.sh <đường kho crm> <sha>   (chỉ đọc; không checkout)
set -euo pipefail
K="$1"; S="$2"
cd "$K"
LOC=( 'apps/*' 'packages/*' ':!*test*' ':!*spec*' ':!*.md' ':!*/proto/*' ':!*package.json' )
echo "# Đo 11/10 — múi giờ của tổ chức trong crm"
echo
echo "Kho \`crm\`, cây \`$S\` (\`origin/onehub\` lúc đo). Lệnh sinh tệp này: \`do-mui-gio.sh\` cùng thư mục — chỉ đọc."
echo
echo "## 1. Tệp mã sản phẩm khai múi giờ Việt Nam (\`Asia/Ho_Chi_Minh\` hoặc \`+07:00\`)"
echo
echo "Bỏ test, spec, bản mẫu \`proto\`, tài liệu, \`package.json\`."
echo
echo '```'
git grep -n -E 'Asia/Ho_Chi_Minh|\+07:00' "$S" -- "${LOC[@]}" | sed "s#^$S:##" | cut -c1-150
echo '```'
echo
echo "Số tệp: **$(git grep -l -E 'Asia/Ho_Chi_Minh|\+07:00' "$S" -- "${LOC[@]}" | wc -l | tr -d ' ')** · số dòng: **$(git grep -c -E 'Asia/Ho_Chi_Minh|\+07:00' "$S" -- "${LOC[@]}" | awk -F: '{s+=$NF} END{print s}')**"
echo
echo "## 2. Hàm «ngày/giờ Việt Nam» tự dựng"
echo
echo '```'
git grep -n -E '(function|const) (ngayVN|dauNgayVN|thangVN|homNayVN|homNayVn|gioVN)\b' "$S" -- "${LOC[@]}" | sed "s#^$S:##" | cut -c1-150
echo '```'
echo
echo "## 3. Chỗ khai múi giờ trong khuôn dữ liệu"
echo
N=$( (git grep -n -i -E 'timezone|timeZone|muiGio|mui_gio' "$S" -- '*.prisma' || true) | wc -l | tr -d ' ')
echo "Số dòng nhắc múi giờ trong \`*.prisma\`: **$N** — múi giờ không phải cấu hình của không gian làm việc."
echo
echo "## 4. Lựa chọn về múi giờ trong sổ quyết định của mọi hồ sơ"
echo
echo "Số hồ sơ: **$(git ls-tree -d --name-only "$S" _acceptance/ | wc -l | tr -d ' ')**. Dòng sổ nhắc «múi giờ»/«timezone», tách theo bước và người quyết:"
echo
echo '```'
git grep -h -i -E 'múi giờ|timezone' "$S" -- '_acceptance/*/decisions.jsonl' | python3 -c '
import sys, json, collections
c = collections.Counter()
for l in sys.stdin:
    try: d = json.loads(l)
    except Exception: continue
    nguoi = "người" if d.get("decided_by") else "máy"
    c[(str(d.get("stage","")), nguoi)] += 1
for (st, ai), n in sorted(c.items()): print(f"{st:10} {ai:5} {n}")
'
echo '```'
echo
echo "Mọi dòng NGƯỜI quyết trong số đó (hồ sơ · bước · đầu câu):"
echo
echo '```'
git grep -i -E 'múi giờ|timezone' "$S" -- '_acceptance/*/decisions.jsonl' | python3 -c '
import sys, json
for l in sys.stdin:
    f, _, j = l.partition(".jsonl:")
    try: d = json.loads(j)
    except Exception: continue
    if d.get("decided_by"):
        print(f.split("/")[-2], "·", d.get("stage"), "·", d.get("decision","")[:110])
'
echo '```'
echo
echo "## 5. Hồ sơ neo: \`okr-soat-anh-luot-3\`"
echo
echo "Hai mục ngoài hợp đồng về múi giờ (thứ tự trong \`review-findings.md\`):"
echo
echo '```'
git show "$S:_acceptance/okr-soat-anh-luot-3/review-findings.md" | awk '/^## Ngoài hợp đồng/{f=1;next} f && /^- \*\*/{n++; if ($0 ~ /giờ Việt Nam|Vietnam timezone/) print "Ngoài-"n": "substr($0,3)}'
echo '```'
echo
echo "Cách chúng được quyết — dòng Known limits trong \`contract.md\`:"
echo
echo '```'
git show "$S:_acceptance/okr-soat-anh-luot-3/contract.md" | grep -E '^- Ngoài-1 và Ngoài-7' | cut -c1-400
echo '```'
echo
echo "## 6. Vòng riêng đã tốn cho lỗi múi giờ"
echo
for s in zalo-gio-theo-mui-gio-xuong ngay-gieo-theo-gio-vn; do
  f=$(git show "$S:_acceptance/$s/contract.md")
  echo "- \`$s\` — $(printf '%s\n' "$f" | grep -c -E '^- AC-[0-9]+') tiêu chí, $(printf '%s\n' "$f" | grep -m1 -E '^status:')"
done
