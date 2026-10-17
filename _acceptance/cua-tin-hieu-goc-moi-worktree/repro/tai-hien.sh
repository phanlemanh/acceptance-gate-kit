#!/usr/bin/env bash
# Tái hiện lỗi gốc cửa tín hiệu khác nhau giữa worktree và thư mục chính (hàng RM3b).
# Dùng: bash tai-hien.sh <gốc kho kit> <sha bộ máy> <thư mục tạm>
# Chỉ ghi vào <thư mục tạm>; không đụng kho kit ngoài `git archive`.
set -u
KIT=$1; SHA=$2; R=$3
rm -rf "$R"; mkdir -p "$R/may" "$R/kho" "$R/dot"/{khoa,xin,yeu-cau,tra-loi,cho-nguoi,tiep}
git -C "$KIT" archive "$SHA" scripts lib skills commands road-map dieu-phoi feature-loop tests/dieu-phoi/loi/mau-thu.mjs | tar -x -C "$R/may"
K=$R/kho; WT=$R/wt; D=$R/dot
git init -q -b main "$K"; git -C "$K" config user.name "Chủ Kho Thử"; git -C "$K" config user.email x@y.z
mkdir -p "$K/_acceptance" "$K/tin-hieu/kho" "$K/tin-hieu/gom"
printf 'schema_version: 1\ntin_hieu:\n  nguon: [tin-hieu/kho]\n  gom: tin-hieu/gom\n' > "$K/_acceptance/config.yaml"
touch "$K/tin-hieu/kho/.gitkeep" "$K/tin-hieu/gom/.gitkeep"; git -C "$K" add -A; git -C "$K" commit -qm init
git -C "$K" worktree add -q "$WT" -b thu-wt
doc() { node "$R/may/scripts/tin-hieu.mjs" --root "$1" --chua-gom | python3 -c "import json,sys;print([t['id'] for t in json.load(sys.stdin)['tin_hieu']])"; }
echo "bộ máy: $SHA"
echo "=== 1. Người gửi ý từ worktree, đúng dòng khối RM-GUI-LENH (--root .)"
(cd "$WT" && node "$R/may/scripts/gui-tin-hieu.mjs" --root . --noi-dung - <<'Y_MOI'
Ý gửi từ worktree
Y_MOI
); echo "thoát $?"
echo "=== 2. Tệp nằm ở đâu"; echo "worktree: $(ls "$WT/tin-hieu/kho" | tr '\n' ' ')"; echo "kho chính: $(ls "$K/tin-hieu/kho" | tr '\n' ' ')"
echo "=== 3. Bộ đọc ở thư mục chính: $(doc "$K")"
echo "=== 4. Bộ đọc trong worktree: $(doc "$WT")"
cat > "$R/thu.mjs" <<JS
import fs from 'node:fs'; import path from 'node:path';
const MAU = await import('$R/may/tests/dieu-phoi/loi/mau-thu.mjs');
fs.writeFileSync(path.join('$D','dieu-phoi.config.json'), JSON.stringify({...MAU.CFG_PHAT_LICH, goc_kho: '$K'}));
fs.writeFileSync(path.join('$D','hang-viec.json'), JSON.stringify(MAU.hangViecHai({dot:'thu', w1:'$WT', w2:'$K', link:true})));
fs.writeFileSync(path.join('$D','yeu-cau','P1-1.json'), JSON.stringify({phien:'P1',loai:'viec-phu',hang:'a',noi_dung:{tieu_de:'Ý thợ nêu trong worktree'},luc:'2026-10-16T05:00:00Z'}));
const IO={nowMs:()=>Date.parse('2026-10-16T05:10:00Z'),chay:(c,a)=>{if(c==='sysctl'&&a[0]==='vm.swapusage')return 'total = 24576.00M  used = 1024.00M  free = 1.00M';if(c==='sysctl'&&a.includes('kern.memorystatus_vm_pressure_level'))return '1';if(c==='sysctl')return '{ 3.00 2.00 1.00 }';if(c==='ps')return '102400 node\n';if(c==='gh')return '[]';if(c==='git'&&a[0]==='show')throw new Error('x');return '';}};
await (await import('$R/may/dieu-phoi/scripts/phat-lich.mjs')).motNhip('$D', IO);
console.log('trả lời đợt:', JSON.parse(fs.readFileSync(path.join('$D','tra-loi','P1-1.json'),'utf8')).ket_qua);
JS
echo "=== 5. Thợ ở worktree gửi việc phụ qua đợt (gốc kho của đợt = thư mục chính)"; node "$R/thu.mjs"
echo "kho chính: $(ls "$K/tin-hieu/kho" | tr '\n' ' ')"; echo "worktree: $(ls "$WT/tin-hieu/kho" | tr '\n' ' ')"
echo "=== 6. Hai bộ đọc: thư mục chính $(doc "$K") · worktree $(doc "$WT")"
echo "=== 7. Dọn worktree"; git -C "$K" worktree remove "$WT" 2>&1 | sed 's#'"$R"'#<tạm>#'; git -C "$K" worktree remove --force "$WT" && echo "dọn --force: xong"
echo "=== 8. Sau khi dọn, thư mục chính còn thấy: $(doc "$K")"
