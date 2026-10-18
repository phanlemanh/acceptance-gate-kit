#!/usr/bin/env bash
# Tái hiện sự cố crm-onehub#375 (17/10): vẽ trang lộ trình trong một worktree --detach sạch thì trang lấy tín hiệu ở
# thư mục chính của kho, CI vẽ từ cây đang kiểm → `product-map --check` đỏ «lệch».
# Dùng: bash tai-hien.sh <ref của kit, vd v2.32.0>   — mọi thứ dựng trong thư mục tạm, không ghi vào cây kit.
set -euo pipefail
KIT=$(cd "$(dirname "$0")/../../.." && pwd); REF=${1:-v2.32.0}
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
MAY="$T/may"; mkdir -p "$MAY"; git -C "$KIT" archive "$REF" scripts lib skills commands road-map dieu-phoi feature-loop | tar -x -C "$MAY"
K="$T/kho"; git init -q -b main "$K"; git -C "$K" config user.email x@y.z; git -C "$K" config user.name Thu
mkdir -p "$K/_acceptance" "$K/tin-hieu/kho" "$K/tin-hieu/gom" "$K/docs"
printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: docs/lo-trinh.json\ntin_hieu:\n  nguon: [tin-hieu/kho]\n  gom: tin-hieu/gom\n' > "$K/_acceptance/config.yaml"
echo '{"schema":1,"ten":"LT","moc":[],"hang":[],"da_bac":[]}' > "$K/docs/lo-trinh.json"
y() { printf '{"phien":"P1","loai":"tin-hieu","hang":null,"noi_dung":{"tieu_de":"%s"},"luc":"2026-10-16T05:00:00Z"}\n' "$2" > "$K/tin-hieu/kho/$1.json"; }
: > "$K/tin-hieu/kho/.gitkeep"; : > "$K/tin-hieu/gom/.gitkeep"; y kho-1 "Ý một"
git -C "$K" add -A; git -C "$K" commit -qm "C0: một ý đã theo dõi"
git -C "$K" switch -qc moi; y kho-2 "Ý hai"; y kho-3 "Ý ba"; git -C "$K" add -A; git -C "$K" commit -qm "C1: thêm hai ý (như #452)"
git -C "$K" switch -q main                     # thư mục chính lùi nền ở C0
y nguoi-x-1 "Ý chưa theo dõi ở thư mục chính"  # ý gửi bằng /road-map:gui, chưa commit
W="$T/wt"; git -C "$K" worktree add -q --detach "$W" moi
echo "== vẽ trong worktree --detach sạch ($REF)"; node "$MAY/scripts/product-map.mjs" --root "$W" >/dev/null
echo "id trên trang: $(grep -o 'nguoi-x-1\|kho-[0-9]' "$W/LO-TRINH.html" | sort -u | tr '\n' ' ')"
git -C "$W" add -A; git -C "$W" commit -qm "vẽ lại trang"; SHA=$(git -C "$W" rev-parse HEAD)
C="$T/ci"; git clone -q --no-hardlinks "$K" "$C"; git -C "$C" checkout -q "$SHA"
echo "== CI: product-map --check trên bản tải sạch"; set +e; node "$MAY/scripts/product-map.mjs" --root "$C" --check; echo "mã thoát: $?"
