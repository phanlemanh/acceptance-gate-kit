#!/usr/bin/env bash
# Chạy lại TRỌN phép đo Cổng Giá trị của X1 (hồ sơ xuat-du-lieu-lo-trinh) — một lệnh, cho ngày đọc chính thức.
#   bash _acceptance/xuat-du-lieu-lo-trinh/uat/chay.sh <kho crm> <sha crm> <thư mục nháp>
# Chỉ ĐỌC crm (git archive · fetch); không commit, không push. Việc nặng (cài phụ thuộc, dựng trang) đi qua
# khoá máy nếu có `chay-nang.sh`. Kết quả ghi vào evidence/uat/ của hồ sơ; thoát 1 nếu bất kỳ vế nào đỏ.
set -u
CRM="$1"; SHA="$2"; NHAP="$3"
HERE="$(cd "$(dirname "$0")" && pwd)"; KIT="$(cd "$HERE/../../.." && pwd)"; RA="$HERE/../evidence/uat"
KHOA="$HOME/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh"
nang() { if [ -f "$KHOA" ]; then bash "$KHOA" "X1-do $1" "${@:2}"; else "${@:2}"; fi; }
mkdir -p "$RA" "$NHAP"; DO=0
SHA=$(git -C "$CRM" rev-parse "$SHA")
echo "crm $SHA · kit $(git -C "$KIT" rev-parse --short HEAD) · $(date -u +%FT%TZ)" | tee "$RA/lan-chay.txt"

# 0. Bản trích crm (không chạm cây làm việc của crm) + phụ thuộc.
T="$NHAP/crm-do"
if [ ! -f "$T/.x1-sha" ] || [ "$(cat "$T/.x1-sha")" != "$SHA" ]; then
  rm -rf "$T"; mkdir -p "$T"
  git -C "$CRM" archive "$SHA" apps packages patches tools lib scripts skills package.json bun.lock turbo.json biome.jsonc .npmrc LO-TRINH.html | tar -x -C "$T"
  (cd "$T" && nang cai-phu-thuoc bun install --frozen-lockfile --ignore-scripts) || exit 2
  echo "$SHA" > "$T/.x1-sha"
fi
cp "$T/LO-TRINH.html" "$RA/LO-TRINH.crm.html"
cp "$HERE/ban-chieu-crm.dom.tsx" "$T/apps/app/test/x1-ban-chieu-crm.dom.tsx"
dung() { (cd "$T/apps/app" && nang dung-trang env X1_RA="$1" X1_LUAT_NGAY="$KIT/skills/acceptance/references/lo-trinh-du-lieu.md" \
  ${2:+X1_TEP="$2"} TZ=Asia/Ho_Chi_Minh bun test --preload ../../packages/ui/test/setup-dom.ts ./test/x1-ban-chieu-crm.dom.tsx); }

# 1. Trang crm ở sha này đúng là một lượt vẽ của bộ vẽ crm đang dùng (vendored scripts/) trên hồ sơ hiện tại.
V="$NHAP/crm-ve"; rm -rf "$V"; mkdir -p "$V"
git -C "$CRM" archive "$SHA" LO-TRINH.html PRODUCT-MAP.md _acceptance docs | tar -x -C "$V"
(cd "$V" && git init -q && git add -A && git -c user.email=x@x -c user.name=x commit -qm s)
node "$T/scripts/product-map.mjs" --root "$V" --check > "$RA/cung-luot-ve.txt" 2>&1 || DO=1
cat "$RA/cung-luot-ve.txt"

# 2–3. Dựng trang Lộ trình từ CHÍNH tệp đó, so từng hàng với trang kit.
dung "$RA/man.json" || DO=1
node "$HERE/so-ban-chieu.mjs" so --trang "$RA/LO-TRINH.crm.html" --man "$RA/man.json" --ra "$RA/ket-qua.json" | tee "$RA/ket-qua.txt"; [ "${PIPESTATUS[0]}" = 0 ] || DO=1

# Chiều đỏ: tiêm trạng thái sai vào bản sao khối (phần người xem thấy giữ nguyên), dựng lại, so phải đỏ đúng hàng.
: > "$RA/chieu-do.txt"
while IFS='|' read -r ten khoa nhom tt; do
  node "$HERE/so-ban-chieu.mjs" tiem --trang "$RA/LO-TRINH.crm.html" --ra "$NHAP/do-$ten.html" --khoa "$khoa" --nhom "$nhom" ${tt:+--trang-thai "$tt"} | tee -a "$RA/chieu-do.txt"
  dung "$NHAP/man-do-$ten.json" "$NHAP/do-$ten.html" || DO=1
  node "$HERE/so-ban-chieu.mjs" so --trang "$NHAP/do-$ten.html" --man "$NHAP/man-do-$ten.json" --mong-do "$khoa" | tee -a "$RA/chieu-do.txt"; [ "${PIPESTATUS[0]}" = 0 ] || DO=1
done < "$HERE/chieu-do.tsv"

# 4. Quét mã trang: không luật suy trạng thái ngoài so ngày — đối chứng + ba bản sao bị tiêm.
node "$HERE/quet-ma-lt1.mjs" --goc "$T" --ra "$RA/quet-ma.json" | tee "$RA/quet-ma.txt"; [ "${PIPESTATUS[0]}" = 0 ] || DO=1
sao() { rm -rf "$NHAP/quet-$1"; mkdir -p "$NHAP/quet-$1"; (cd "$T" && tar -cf - apps/app/components/lo-trinh apps/app/lib/lo-trinh apps/app/lib/messages/lo-trinh.ts "apps/app/app/(app)/[slug]/lo-trinh" packages/validation/src/lo-trinh-du-lieu.ts) | tar -x -C "$NHAP/quet-$1"; }
sao m1; python3 - "$NHAP/quet-m1/apps/app/components/lo-trinh/viec.ts" <<'EOF'
import sys;p=sys.argv[1];s=open(p).read();a='				khoa: `${lo.tep}#${h.ma}`,'
assert a in s; open(p,'w').write(s.replace(a,a+'\n				nhom_trang_thai: h.trang_thai.startsWith("Đã giao") ? "da-giao" : h.nhom_trang_thai,'))
EOF
sao m2; printf '\nexport const keHoach = () => readFileSync(path.join(process.cwd(), "docs/plan/lo-trinh-okr.json"), "utf8");\n' >> "$NHAP/quet-m2/apps/app/lib/lo-trinh/doc-tep.ts"
sao m3; sed -i.bak 's/x.tien_do = va(x.tien_do, .tien_do.);/x.tien_do = va(x.tien_do, "tien_do") ;/' "$NHAP/quet-m3/apps/app/lib/lo-trinh/doc-du-lieu.js" && rm -f "$NHAP/quet-m3/apps/app/lib/lo-trinh/doc-du-lieu.js.bak"
{ echo "## m1 — suy nhóm từ chữ trạng thái"; node "$HERE/quet-ma-lt1.mjs" --goc "$NHAP/quet-m1" --mong-do 'h.trang_thai.startsWith("Đã giao")' || DO=1
  echo "## m2 — đọc tệp kế hoạch"; node "$HERE/quet-ma-lt1.mjs" --goc "$NHAP/quet-m2" --mong-do 'docs/plan/lo-trinh-okr.json' || DO=1
  echo "## m3 — bộ đọc chép lệch kit"; node "$HERE/quet-ma-lt1.mjs" --goc "$NHAP/quet-m3" --mong-do 'x.tien_do = va' || DO=1; } | tee "$RA/quet-ma-chieu-do.txt"

# 5. Kho không khai lộ trình: ca LT-113 (+ chiều đỏ) của kit trên bản phát hành 2.26.0, và phép vi phân
#    2.25.0 → 2.26.0 trên hai kho thật không khai (radar, oneflow).
W="$NHAP/kit-v226"; [ -d "$W" ] || git -C "$KIT" worktree add -q --detach "$W" v2.26.0
(cd "$W" && LT_CASES=LT-113,LT-113-do node tests/scripts/lo-trinh.test.mjs) > "$RA/kho-khong-khai.txt" 2>&1 || DO=1
for v in 2.25.0 2.26.0; do d="$NHAP/kit-$v"; [ -d "$d" ] || { mkdir -p "$d"; git -C "$KIT" archive "v$v" scripts lib skills | tar -x -C "$d"; }; done
for r in radar:origin/master oneflow:origin/main; do
  ten=${r%%:*}; nhanh=${r#*:}; kho="$HOME/dev/$ten"; [ -d "$kho" ] || continue
  git -C "$kho" fetch -q origin; s=$(git -C "$kho" rev-parse --short "$nhanh")
  for v in 2.25.0 2.26.0; do c="$NHAP/kk-$ten-$v"; rm -rf "$c"; mkdir -p "$c"; git -C "$kho" archive "$nhanh" | tar -x -C "$c"
    (cd "$c" && git init -q && git add -A && git -c user.email=x@x -c user.name=x commit -qm s); node "$NHAP/kit-$v/scripts/product-map.mjs" --root "$c" > /dev/null 2>&1
    doi=$(cd "$c" && git status --porcelain --untracked-files=all | wc -l | tr -d ' '); echo "$ten@$s vẽ bằng $v: $doi tệp đổi" >> "$RA/kho-khong-khai.txt"; [ "$doi" = 0 ] || DO=1; done
  if diff -rq --exclude=.git "$NHAP/kk-$ten-2.25.0" "$NHAP/kk-$ten-2.26.0" > /dev/null; then echo "$ten@$s: cây sau 2.25.0 == cây sau 2.26.0, không LO-TRINH.html" >> "$RA/kho-khong-khai.txt"; else echo "$ten@$s: CÂY KHÁC" >> "$RA/kho-khong-khai.txt"; DO=1; fi
done
cat "$RA/kho-khong-khai.txt"
echo "KẾT: $([ $DO = 0 ] && echo XANH || echo ĐỎ)" | tee -a "$RA/lan-chay.txt"; exit $DO
