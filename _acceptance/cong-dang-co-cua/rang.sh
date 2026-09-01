#!/usr/bin/env bash
# Răng hồ sơ cong-dang-co-cua — 13 chân.
#
# Bất biến gốc KHÔNG phải «có một nhánh if», mà là QUAN HỆ giữa hai bộ đọc:
# start-scan.mjs quyết định gửi ai tới thẻ, gate-card.js quyết định vẽ được cho
# ai. Con trỏ chết là chỗ hai bên bất đồng — nên chân `hai-bo-doc` đo hiệu tập
# hợp, không đo sự có mặt của chuỗi.
#
# Nếp bắt buộc, áp cho mọi chân:
#   - XƯỞNG dựng BẰNG CODE trong chính lần chạy, không fixture viết tay.
#   - Mọi đường dẫn suy từ vị trí script, không hardcode gốc kho (P150).
#   - Bản sao để tiêm lấy TRỌN cây (git archive HEAD), không chép danh sách tay.
#   - Chuỗi thông điệp RÚT từ marker trong scripts/gate-card.js, không gõ literal.
#   - Mỗi lệnh tiêm phải chứng minh nó đổi được ≥1 dòng; không đổi được thì báo
#     hỏng HẠ TẦNG, không báo xanh.
#   - Đối chứng dương chạy TRƯỚC khi tin bất kỳ chiều đỏ nào.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
[ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan <ten>"; exit 2; }
CHAN="${2:-}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
loi=0
ghim() { if [ "$2" = "0" ]; then echo "PASS: $1"; else echo "DO: $1${3:+ — $3}"; loi=1; fi; }

GC="$ROOT/scripts/gate-card.js"
CMD="$ROOT/commands/acceptance-card.md"
APR="$ROOT/commands/approve.md"
STA="$ROOT/commands/start.md"
HFL="$ROOT/skills/acceptance/references/human-facing-language.md"

# ---- hằng RÚT TỪ NGUỒN --------------------------------------------------------
pick() { sed -n "s/^const $1[[:space:]]*=[[:space:]]*'\(.*\)';.*/\1/p" "$GC" | head -1; }
M_WS="$(pick MSG_NO_WORKSPACE)"; M_DIR="$(pick MSG_NO_DOSSIER)"; M_CT="$(pick MSG_NO_CONTRACT)"
M_DONG="$(pick MSG_O_DA_DONG)";  M_HONG="$(pick MSG_HO_SO_HONG)"
for p in "MSG_NO_WORKSPACE:$M_WS" "MSG_NO_DOSSIER:$M_DIR" "MSG_NO_CONTRACT:$M_CT" \
         "MSG_O_DA_DONG:$M_DONG" "MSG_HO_SO_HONG:$M_HONG"; do
  [ -n "${p#*:}" ] || { echo "DO: rut hang ${p%%:*} tu $GC khong ra gi — phep do khong co gi de ghim"; exit 1; }
done
LOI_RA="$(node -e 'const m=require("fs").readFileSync(process.argv[1],"utf8").match(/const LOI_RA_G0 = \[(.*?)\]/s); if(!m) process.exit(3); console.log(JSON.parse("["+m[1].replace(/'"'"'/g,"\"")+"]").join("\n"))' "$GC")" \
  || { echo "DO: khong rut duoc LOI_RA_G0 tu $GC"; exit 1; }

# ---- bản sao trọn cây + lệnh tiêm chứng-minh-đổi-được -------------------------
VAT_DO="scripts/gate-card.js scripts/start-scan.mjs commands/acceptance-card.md commands/approve.md commands/start.md skills/acceptance/references/human-facing-language.md lib/workspace-record.cjs lib/nguong-o-co-hoi.cjs"
ban_sao() { # ban_sao <dich>
  if ! ( cd "$ROOT" && git diff --quiet HEAD -- $VAT_DO ); then
    ghim "cay lam viec khop HEAD" 1 "con thay doi CHUA COMMIT o vat duoc do — ban sao (git archive HEAD) se cham ban KHAC ban dang sua; commit roi chay lai"
    return 1
  fi
  mkdir -p "$1"; ( cd "$ROOT" && git archive HEAD ) | tar -x -C "$1"
}
tiem() { # tiem <nhan> <file> <lenh perl>
  # So BĂM, không so số byte. Đã vấp thật khi dựng bộ răng này: thay
  # 'xếp lại' → 'xep-lai-BIA' đổi đúng một chuỗi nhưng HAI CHUỖI DÀI BẰNG NHAU
  # (11 byte), nên phép chứng-minh-đổi-được bằng đếm byte báo «không đổi được gì»
  # và giết luôn ba chiều đỏ hợp lệ. Đếm byte là phép chứng YẾU.
  local b a; b=$(shasum -a 256 < "$2" | cut -d' ' -f1)
  perl -0pi -e "$3" "$2"
  a=$(shasum -a 256 < "$2" | cut -d' ' -f1)
  if [ "$b" = "$a" ]; then ghim "lenh tiem [$1] doi duoc vat" 1 "noi dung KHONG doi (bam $b) — neo tiem khong ton tai, phep do duoi day VO NGHIA"; return 1; fi
  return 0
}

# ---- xưởng code-sinh ----------------------------------------------------------
# Chín thư mục ô, ĐÍCH DANH. Ô 1 (vắng config.yaml) và ô 2 (vắng thư mục hồ sơ)
# là thuộc tính của GỐC CÂY, không dựng được BÊN TRONG một xưởng — chúng do chân
# `ba-ca-cu` phủ. Ghi rõ ở đây để «số phần tử viết trước» không bị lặng lẽ đổi
# thành «số ô dựng được» lúc thi công.
# Ba ô «lệch nhánh» thêm sau S4-r1: bản đầu chỉ dựng `decided`+`build`, nên
# KHÔNG bắt được ca bộ quét và bộ dựng thẻ bất đồng — hồ sơ `stage: discovery`
# kèm `decision` khác rỗng (ghi frontmatter dở dang) được bộ quét gọi «chờ chữ
# ký» trong khi thẻ nói «ý đã đóng» hoặc từ chối. Xưởng không có ô đó thì phép
# đo tuyên canh quan hệ hai bộ đọc mà chưa bao giờ chạm chỗ chúng lệch.
O_LIST="o3-trong o4-cho-dang o5-chua-chot o6-da-ky o7a-park o7b-archived o8-hong o9-hop-dong o10-bang-chung o11-disc-park o12-disc-build o13-disc-kill"
O_DEM=12
NG_CHOT='- Câu hỏi phép đo trả lời: Còn va chạm không?
- Kết quả nào là SỐNG: Bốn tuần sạch.
- Kết quả nào là CHẾT: Còn va chạm.
- Timebox: Bốn giờ.'
NG_TRONG='- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …'

opp() { # opp <thu muc> <stage> <decision> <than nguong>
  { printf -- '---\nschema_version: 1\nslug: %s\nfeature: Viec %s\nstage: %s\ndecision: %s\n---\n\n## Vấn đề & ai gặp\n\nNguoi van hanh mat mot luot moi phien.\n\n## Giả định chốt sinh tử\n\n| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |\n|---|---|---|---|---|\n| 1 | Va cham lap lai | Khong dang dung | Dem hai tuan | Chua thu |\n\n## Ngưỡng chết / ngưỡng UAT\n\n' \
      "$(basename "$1")" "$(basename "$1")" "$2" "$3"; printf '%s\n' "$4"; } > "$1/opportunity.md"
}
hop_dong() { # hop_dong <thu muc> <status>
  printf -- '---\nschema_version: 1\nfeature: Viec co hop dong\nslug: %s\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: %s\napproved_by:\napproved_at:\n---\n\n# Acceptance Contract\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n' \
    "$(basename "$1")" "$2" > "$1/contract.md"
}

xuong() { # xuong <goc>
  local W="$1"; mkdir -p "$W/_acceptance"; printf 'schema_version: 1\n' > "$W/_acceptance/config.yaml"
  local d
  for d in $O_LIST; do mkdir -p "$W/_acceptance/$d"; done
  opp "$W/_acceptance/o4-cho-dang"  discovery ''      "$NG_CHOT"
  opp "$W/_acceptance/o5-chua-chot" discovery ''      "$NG_TRONG"
  opp "$W/_acceptance/o6-da-ky"     decided   'build' "$NG_CHOT"
  opp "$W/_acceptance/o7a-park"     decided   'park'  "$NG_CHOT"
  opp "$W/_acceptance/o7b-archived" archived  ''      "$NG_CHOT"
  opp "$W/_acceptance/o8-hong"      linh-tinh ''      "$NG_CHOT"
  opp "$W/_acceptance/o11-disc-park"  discovery 'park'     "$NG_CHOT"
  opp "$W/_acceptance/o12-disc-build" discovery 'build'    "$NG_CHOT"
  opp "$W/_acceptance/o13-disc-kill"  discovery 'kill'     "$NG_CHOT"
  hop_dong "$W/_acceptance/o9-hop-dong"    approved
  hop_dong "$W/_acceptance/o10-bang-chung" verified
  printf -- '---\nschema_version: 1\nfeature_slug: o10-bang-chung\nverdict: PASS\n---\n\n# bc\n' \
    > "$W/_acceptance/o10-bang-chung/evidence-report.md"
  # CHỐT SỐ PHẦN TỬ TRƯỚC KHI CHẠY: đếm thư mục thực sinh phải bằng danh sách
  # đích danh. Lệch = đỏ vì HẠ TẦNG, nêu tên ô thiếu, và KHÔNG chạy tiếp — nếu
  # không thì «số assert viết trước» lặng lẽ thành «số ô dựng được».
  local n; n=$(find "$W/_acceptance" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
  if [ "$n" != "$O_DEM" ]; then
    for d in $O_LIST; do [ -d "$W/_acceptance/$d" ] || echo "   thieu o: $d"; done
    ghim "xuong dung du $O_DEM o" 1 "dung duoc $n o"; return 1
  fi
  return 0
}

# the_duoc <goc> <slug> -> 0 nếu vẽ được thẻ Cổng Đáng
the_duoc() { local o; o=$( node "$1/scripts/gate-card.js" --root "$2" --slug "$3" 2>/dev/null ) || return 1
  printf '%s' "$o" | grep -qF 'Cổng Đáng — việc này có đáng làm không?'; }
# tap_dang <goc-cay> <goc-xuong> -> in các slug bộ quét xếp gate "dang"
tap_dang() { node "$1/scripts/start-scan.mjs" --root "$2" 2>/dev/null \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(j.groups.gates.filter(g=>g.gate==="dang").map(g=>g.slug).sort().join("\n"))})'; }
# tap_ve <goc-cay> <goc-xuong> -> in các slug bộ dựng vẽ được thẻ Cổng Đáng
tap_ve() { local s; for s in $O_LIST; do the_duoc "$1" "$2" "$s" && echo "$s"; done | sort; }

case "$CHAN" in

# ─────────────────────────────────────────────────────── hai-bo-doc (E1 / AC-1)
hai-bo-doc)
  W="$TMP/w"; xuong "$W" || exit 1
  A="$(tap_dang "$ROOT" "$W")"; B="$(tap_ve "$ROOT" "$W")"
  AB="$(comm -23 <(printf '%s\n' "$A") <(printf '%s\n' "$B") | grep -v '^$')"
  BA="$(comm -13 <(printf '%s\n' "$A") <(printf '%s\n' "$B") | grep -v '^$')"
  echo "   A (bo quet xep 'dang'): $(printf '%s' "$A" | tr '\n' ' ')"
  echo "   B (bo dung ve duoc)   : $(printf '%s' "$B" | tr '\n' ' ')"
  # ĐỐI CHỨNG DƯƠNG trước: cả hai tập phải khác rỗng, nếu không thì hai khẳng
  # định dưới đúng một cách vô nghĩa (không bộ đọc nào chạy).
  if [ -z "$A" ] || [ -z "$B" ]; then ghim "doi chung duong: hai bo doc deu tra ket qua" 1 "A hoac B rong"; else
    ghim "doi chung duong: hai bo doc deu tra ket qua" 0; fi
  [ -z "$AB" ] && ghim "A \\ B RONG — moi o duoc gui toi cong deu ve duoc" 0 \
                || ghim "A \\ B RONG" 1 "slug roi ra: $(printf '%s' "$AB" | tr '\n' ' ')"
  [ "$BA" = "o5-chua-chot" ] && ghim "B \\ A = dung tap o nguong-chua-chot (phan doi hop le co thuoc)" 0 \
                             || ghim "B \\ A dung nhu khai" 1 "cho 'o5-chua-chot', thay: $(printf '%s' "$BA" | tr '\n' ' ')"
  # CHIỀU ĐỎ (a): gỡ phép gán gate='0' → A\B phải khác rỗng
  MA="$TMP/ma"; ban_sao "$MA" || exit 1
  if tiem "go-gan-gate0" "$MA/scripts/gate-card.js" "s/if \(\!dec0\) gate = '0';/\/\* GO \*\//"; then
    B2="$(tap_ve "$MA" "$W")"
    AB2="$(comm -23 <(printf '%s\n' "$A") <(printf '%s\n' "$B2") | grep -v '^$')"
    [ -n "$AB2" ] && ghim "chieu do (a): go gan gate0 -> A \\ B khac rong, neu ten slug: $(printf '%s' "$AB2" | tr '\n' ' ')" 0 \
                  || ghim "chieu do (a)" 1 "go gan gate0 ma A \\ B van RONG — phep do khong bat duoc"
  fi
  # CHIỀU ĐỎ (b): bắt bộ dựng từ chối luôn ô ngưỡng chưa chốt → B\A phải sai
  MB="$TMP/mb"; ban_sao "$MB" || exit 1
  if tiem "tu-choi-o5" "$MB/scripts/gate-card.js" "s/if \(\!dec0\) gate = '0';/if \(\!dec0 \&\& require\(path.join\(__dirname,'..','lib','nguong-o-co-hoi.cjs'\)\).thresholdState\(opp0, read\(path.join\(__dirname,'..','skills','acceptance','references','opportunity-template.md'\)\)\) \!== 'chua-chot'\) gate = '0';/"; then
    B3="$(tap_ve "$MB" "$W")"
    BA3="$(comm -13 <(printf '%s\n' "$A") <(printf '%s\n' "$B3") | grep -v '^$')"
    [ "$BA3" != "o5-chua-chot" ] && ghim "chieu do (b): bo dung tu choi o5 -> khang dinh phan doi DO" 0 \
                                 || ghim "chieu do (b)" 1 "tu choi o5 ma phan doi van dung — khang dinh B \\ A khong duoc canh"
  fi
  ;;

# ────────────────────────────────────────────── nguong-chua-chot (E2 / AC-2)
nguong-chua-chot)
  # MA TRẬN TOÀN PHẦN 4 nấc × 3 khẳng định = 12 assert, viết trước.
  W="$TMP/w"; mkdir -p "$W/_acceptance"; printf 'schema_version: 1\n' > "$W/_acceptance/config.yaml"
  KD="$(node -e 'const NG=require(process.argv[1]);const fs=require("fs");console.log(NG.prefixes(fs.readFileSync(process.argv[2],"utf8")).khongDo)' \
        "$ROOT/lib/nguong-o-co-hoi.cjs" "$ROOT/skills/acceptance/references/opportunity-template.md")"
  DX="$(node -e 'const NG=require(process.argv[1]);const fs=require("fs");console.log(NG.prefixes(fs.readFileSync(process.argv[2],"utf8")).deXuat)' \
        "$ROOT/lib/nguong-o-co-hoi.cjs" "$ROOT/skills/acceptance/references/opportunity-template.md")"
  [ -n "$KD" ] && [ -n "$DX" ] || { ghim "rut hai tien to tu lib" 1 "khong rut duoc"; exit 1; }
  # TẬP NẤC RÚT TỪ LIB, không viết cứng bốn tên. Thêm một nấc trong
  # thresholdState mà quên dựng ô cho nó thì chân này phải ĐỎ vì đếm lệch —
  # lỗ S4-r1: bản đầu tuyên «quét LỚP» nhưng số phần tử là hằng gõ tay.
  NAC_LIB="$(node -e '
    const fs=require("fs"); const src=fs.readFileSync(process.argv[1],"utf8");
    const body=src.slice(src.indexOf("function thresholdState"));
    const end=body.indexOf("\nmodule.exports");
    const seg=end>0?body.slice(0,end):body;
    const s=new Set(); for(const m of seg.matchAll(/return\s+"([a-z-]+)"|return\s+'"'"'([a-z-]+)'"'"'/g)) s.add(m[1]||m[2]);
    for(const m of seg.matchAll(/\?\s*'"'"'([a-z-]+)'"'"'\s*:\s*'"'"'([a-z-]+)'"'"'/g)){ s.add(m[1]); s.add(m[2]); }
    console.log([...s].sort().join(" "));
  ' "$ROOT/lib/nguong-o-co-hoi.cjs")"
  SO_NAC=$(printf '%s' "$NAC_LIB" | wc -w | tr -d ' ')
  echo "   nac rut tu lib: $NAC_LIB (so nac = $SO_NAC)"
  [ "$SO_NAC" = "4" ] && ghim "so nac rut tu lib == so o xuong dung (4)" 0 \
    || ghim "so nac rut tu lib" 1 "lib co $SO_NAC nac ($NAC_LIB) nhung chan nay chi dung 4 o — them nac ma quen dung o"
  mkdir -p "$W/_acceptance/n1" "$W/_acceptance/n2" "$W/_acceptance/n3" "$W/_acceptance/n4"
  opp "$W/_acceptance/n1" discovery '' "$NG_TRONG"
  opp "$W/_acceptance/n2" discovery '' "$(printf -- '- Câu hỏi phép đo trả lời: %s Con va cham khong?\n- Kết quả nào là SỐNG: %s Bon tuan sach.\n- Kết quả nào là CHẾT: %s Con va cham.\n- Timebox: %s Bon gio.' "$DX" "$DX" "$DX" "$DX")"
  opp "$W/_acceptance/n3" discovery '' "$NG_CHOT"
  opp "$W/_acceptance/n4" discovery '' "- $KD vong nay khong co nguoi dung cuoi."
  DEM=0
  for n in n1 n2 n3 n4; do
    O="$(node "$GC" --root "$W" --slug $n 2>/dev/null)"; rc=$?
    ST="$(node "$GC" --root "$W" --slug $n --extract 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).cong_dang.nguong))')"
    fred=$(printf '%s' "$O" | grep -c 'class="flag fred"' || true)
    dx=$(printf '%s' "$O" | grep -o 'máy đề xuất' | wc -l | tr -d ' ')
    kd=$(printf '%s' "$O" | grep -o 'khai không đo được' | wc -l | tr -d ' ')
    # (a) mọi nấc đều VẼ ĐƯỢC, không nấc nào bị từ chối
    [ "$rc" = "0" ] && printf '%s' "$O" | grep -qF 'Cổng Đáng' \
      && { ghim "[$n=$ST] (a) ve duoc the, khong bi tu choi" 0; DEM=$((DEM+1)); } \
      || ghim "[$n=$ST] (a) ve duoc the" 1 "exit=$rc"
    # (b) cờ đỏ ngưỡng CHỈ ở nấc chưa-chốt
    if [ "$n" = "n1" ]; then [ "$fred" -ge 1 ] && { ghim "[$n] (b) co co do nguong" 0; DEM=$((DEM+1)); } || ghim "[$n] (b) co do nguong" 1 "khong thay"
    else [ "$fred" = "0" ] && { ghim "[$n=$ST] (b) KHONG co do nguong" 0; DEM=$((DEM+1)); } || ghim "[$n=$ST] (b) khong co do" 1 "van cam co do — nac nay ky duoc ma bi chan"; fi
    # (c) dấu «máy đề xuất» CHỈ ở nấc đề-xuất
    if [ "$n" = "n2" ]; then [ "$dx" -ge 1 ] && { ghim "[$n] (c) co dau may-de-xuat ($dx dong)" 0; DEM=$((DEM+1)); } || ghim "[$n] (c) dau may-de-xuat" 1 "khong thay"
    else [ "$dx" = "0" ] && { ghim "[$n=$ST] (c) KHONG co dau may-de-xuat" 0; DEM=$((DEM+1)); } || ghim "[$n=$ST] (c) khong dau de xuat" 1 "thay $dx"; fi
    [ "$n" = "n4" ] && { [ "$kd" -ge 1 ] && ghim "[n4] nhan 'khai khong do duoc' hien" 0 || ghim "[n4] nhan khai-khong-do-duoc" 1 "khong thay"; }
  done
  [ "$DEM" = "12" ] && ghim "so assert = so phan tu (4 nac x 3 = 12)" 0 || ghim "dang thuc so assert" 1 "dem duoc $DEM/12"
  # CHIỀU ĐỎ: cờ đỏ in vô điều kiện → (b) phải đỏ ở n2/n3/n4
  MA="$TMP/ma"; ban_sao "$MA" || exit 1
  if tiem "co-do-vo-dieu-kien" "$MA/scripts/gate-card.js" "s/if \(nguong === 'chua-chot'\) flags0.push/if \(true\) flags0.push/"; then
    bad=0; for n in n2 n3 n4; do node "$MA/scripts/gate-card.js" --root "$W" --slug $n 2>/dev/null | grep -q 'class="flag fred"' && bad=$((bad+1)); done
    [ "$bad" = "3" ] && ghim "chieu do: co do vo dieu kien -> ca 3 nac kia DO" 0 || ghim "chieu do co do" 1 "chi $bad/3 nac bi bat"
  fi
  ;;

# ──────────────────────────────────────────────── lan-truoc-chot (E3 / AC-3)
lan-truoc-chot)
  # THỨ TỰ, không phải sự có mặt.
  L_LAN=$(grep -n "^if (gate === '0') {" "$GC" | head -1 | cut -d: -f1)
  L_CHOT=$(grep -n "NO-DOSSIER-GUARD-BLOCK>>>" "$GC" | head -1 | cut -d: -f1)
  L_GAN=$(grep -n "if (!dec0) gate = '0';" "$GC" | head -1 | cut -d: -f1)
  if [ -z "$L_LAN" ] || [ -z "$L_CHOT" ] || [ -z "$L_GAN" ]; then
    ghim "doc duoc vi tri ba moc" 1 "lan=$L_LAN chot=$L_CHOT gan=$L_GAN"
  else
    [ "$L_GAN" -lt "$L_CHOT" ] && ghim "phep gan gate0 (dong $L_GAN) nam TRONG chot (het o dong $L_CHOT)" 0 \
                               || ghim "phep gan gate0 nam trong chot" 1 "gan o $L_GAN, chot het o $L_CHOT"
  fi
  W="$TMP/w"; xuong "$W" || exit 1
  the_duoc "$ROOT" "$W" o4-cho-dang && ghim "doi chung duong: o cho Cong Dang ve duoc the" 0 \
                                    || ghim "doi chung duong" 1 "cay hien tai khong ve duoc the"
  # MUTANT HOÁN VỊ: gỡ phép gán khỏi chốt → ô rơi xuống lời từ chối
  MA="$TMP/ma"; ban_sao "$MA" || exit 1
  if tiem "hoan-vi-go-gan" "$MA/scripts/gate-card.js" "s/congDang = true;/\/\* GO \*\//"; then
    E="$(node "$MA/scripts/gate-card.js" --root "$W" --slug o4-cho-dang 2>&1 >/dev/null)"; rc=$?
    if [ "$rc" != "0" ] && printf '%s' "$E" | grep -qF "$M_CT"; then
      ghim "mutant hoan vi: chot chan truoc -> DO dung thong diep chot" 0
    else ghim "mutant hoan vi" 1 "go phep gan ma van ve duoc the (exit=$rc) — phep do khong do duoc THU TU"; fi
  fi
  # CỜ ÉP KHÔNG MỞ ĐƯỢC LÀN — lỗ S4-r1: `--gate` đọc từ dòng lệnh TRƯỚC khi chốt
  # chạy, nên `--gate 0` xuyên qua cả chốt lẫn làn và vẽ thẻ ma. Bốn ô, mỗi ô
  # khẳng định thoát khác 0 VÀ stdout rỗng.
  mkdir -p "$W/_acceptance/o-ep"   # thư mục rỗng, không hợp đồng không ô cơ hội
  DEM=0
  for s in o9-hop-dong o10-bang-chung o3-trong o-ep; do
    O="$(node "$GC" --root "$W" --slug "$s" --gate 0 2>/dev/null)"; rc=$?
    if [ "$rc" != "0" ] && [ -z "$O" ]; then ghim "[--gate 0 tren $s] tu choi, stdout RONG" 0; DEM=$((DEM+1))
    else ghim "[--gate 0 tren $s]" 1 "exit=$rc, ${#O} byte the ma"; fi
  done
  [ "$DEM" = "4" ] && ghim "so assert co-ep = so phan tu (4)" 0 || ghim "dang thuc co-ep" 1 "dem duoc $DEM/4"
  # ĐỐI CHỨNG DƯƠNG: ô ĐỦ điều kiện thì `--gate 0` vẫn ra thẻ (cờ không phá lối đúng)
  the_duoc "$ROOT" "$W" o4-cho-dang && ghim "doi chung duong: o du dieu kien van ve duoc the" 0 \
                                    || ghim "doi chung duong co-ep" 1 "o hop le cung khong ve duoc"
  ;;

# ───────────────────────────────────────────────────── o-da-dong (E4 / AC-4)
o-da-dong)
  W="$TMP/w"; xuong "$W" || exit 1
  # Cụm mời-viết-hợp-đồng RÚT từ thân lệnh, không gõ tay.
  CUM="$(grep -oF 'chạy bước chuẩn hoá yêu cầu' "$CMD" | head -1)"
  [ -n "$CUM" ] || { ghim "rut cum moi-viet-hop-dong tu than lenh" 1 "khong tim thay"; exit 1; }
  DEM=0
  for s in o7a-park o7b-archived; do
    E="$(node "$GC" --root "$W" --slug $s 2>&1 >/dev/null)"; rc=$?
    O="$(node "$GC" --root "$W" --slug $s 2>/dev/null)"
    [ "$rc" != "0" ] && { ghim "[$s] thoat khac 0" 0; DEM=$((DEM+1)); } || ghim "[$s] thoat khac 0" 1 "exit=$rc"
    [ -z "$O" ] && { ghim "[$s] stdout RONG" 0; DEM=$((DEM+1)); } || ghim "[$s] stdout rong" 1 "${#O} byte"
    printf '%s' "$E" | grep -qF "$M_DONG" && { ghim "[$s] ghim hang y-da-dong" 0; DEM=$((DEM+1)); } || ghim "[$s] ghim hang y-da-dong" 1 "thay: $E"
    printf '%s' "$E" | grep -qF "$M_CT" && ghim "[$s] KHONG lan sang hang thieu-hop-dong" 1 "van noi 'chua co contract.md'" || { ghim "[$s] KHONG lan sang hang thieu-hop-dong" 0; DEM=$((DEM+1)); }
    printf '%s' "$E" | grep -qF "$CUM" && ghim "[$s] KHONG moi di viet hop dong" 1 "van moi" || { ghim "[$s] KHONG moi di viet hop dong" 0; DEM=$((DEM+1)); }
  done
  # ô kill dựng riêng (xưởng dùng park/archived)
  mkdir -p "$W/_acceptance/o7c-kill"; opp "$W/_acceptance/o7c-kill" decided 'kill' "$NG_CHOT"
  E="$(node "$GC" --root "$W" --slug o7c-kill 2>&1 >/dev/null)"
  printf '%s' "$E" | grep -qF "$M_DONG" && { ghim "[o7c-kill] ghim hang y-da-dong" 0; DEM=$((DEM+1)); } || ghim "[o7c-kill] ghim hang y-da-dong" 1 "thay: $E"
  [ "$DEM" = "11" ] && ghim "so assert = so phan tu (2 o x 5 + 1)" 0 || ghim "dang thuc so assert" 1 "dem duoc $DEM/11"
  # ĐỐI CHỨNG DƯƠNG: cùng fixture đổi decision về rỗng → vẽ được thẻ
  opp "$W/_acceptance/o7a-park" discovery '' "$NG_CHOT"
  the_duoc "$ROOT" "$W" o7a-park && ghim "doi chung duong: doi decision ve rong -> ve duoc the" 0 \
                                 || ghim "doi chung duong" 1 "van khong ve duoc — ba khang dinh tren co the luon dung vi ly do khac"
  ;;

# ───────────────────────────────────────────────────── ho-so-hong (E5 / AC-5)
ho-so-hong)
  W="$TMP/w"; mkdir -p "$W/_acceptance"; printf 'schema_version: 1\n' > "$W/_acceptance/config.yaml"
  mkdir -p "$W/_acceptance/h1" "$W/_acceptance/h2" "$W/_acceptance/h3" "$W/_acceptance/h4"
  opp "$W/_acceptance/h1" linh-tinh ''      "$NG_CHOT"           # stage ngoài từ vựng
  opp "$W/_acceptance/h2" discovery 'bua'   "$NG_CHOT"           # decision ngoài từ vựng
  printf -- '---\nslug: h3\ndecision:\n---\n\n## Vấn đề & ai gặp\n\nx\n' > "$W/_acceptance/h3/opportunity.md"  # thiếu stage
  printf -- 'khong co frontmatter gi ca\n' > "$W/_acceptance/h4/opportunity.md"                                 # frontmatter hỏng
  DEM=0
  for h in h1:stage h2:decision h3:stage h4:stage; do
    s="${h%%:*}"; f="${h##*:}"
    E="$(node "$GC" --root "$W" --slug $s 2>&1 >/dev/null)"; rc=$?
    O="$(node "$GC" --root "$W" --slug $s 2>/dev/null)"
    [ "$rc" != "0" ] && { ghim "[$s] thoat khac 0" 0; DEM=$((DEM+1)); } || ghim "[$s] thoat khac 0" 1 "exit=$rc"
    [ -z "$O" ] && { ghim "[$s] stdout RONG" 0; DEM=$((DEM+1)); } || ghim "[$s] stdout rong" 1 "${#O} byte"
    printf '%s' "$E" | grep -qF "$M_HONG" && { ghim "[$s] ghim hang ho-so-hong" 0; DEM=$((DEM+1)); } || ghim "[$s] ghim hang ho-so-hong" 1 "thay: $E"
    printf '%s' "$E" | grep -qF "$f" && { ghim "[$s] NEU TEN field '$f'" 0; DEM=$((DEM+1)); } || ghim "[$s] neu ten field '$f'" 1 "thay: $E"
    printf '%s' "$O" | grep -qF 'Cổng Đáng' && ghim "[$s] KHONG nhan nham thanh the" 1 "van ve the" || { ghim "[$s] KHONG nhan nham thanh the" 0; DEM=$((DEM+1)); }
  done
  [ "$DEM" = "20" ] && ghim "so assert = so phan tu (4 o x 5)" 0 || ghim "dang thuc so assert" 1 "dem duoc $DEM/20"
  # ĐỐI CHỨNG DƯƠNG: sửa field về từ vựng hợp lệ → vẽ được thẻ
  opp "$W/_acceptance/h1" discovery '' "$NG_CHOT"
  the_duoc "$ROOT" "$W" h1 && ghim "doi chung duong: sua field ve tu vung -> ve duoc the" 0 \
                           || ghim "doi chung duong" 1 "van khong ve duoc"
  ;;

# ────────────────────────────────────────────────────── ba-ca-cu (E6 / AC-6)
ba-ca-cu)
  # HỒI QUY: ba ca cũ giữ nguyên văn VÀ phân biệt được từng đôi một.
  W="$TMP/w"; mkdir -p "$W/_acceptance"; printf 'schema_version: 1\n' > "$W/_acceptance/config.yaml"
  mkdir -p "$W/_acceptance/c3-trong"                      # thư mục rỗng
  TRAN="$TMP/tran"; mkdir -p "$TRAN"                      # gốc không có xưởng
  DEM=0
  run_ca() { # run_ca <nhan> <root> <slug> <hang mong doi>
    local E; E="$(node "$GC" --root "$2" --slug "$3" 2>&1 >/dev/null)"; local rc=$?
    [ "$rc" != "0" ] && { ghim "[$1] thoat khac 0" 0; DEM=$((DEM+1)); } || ghim "[$1] thoat khac 0" 1 "exit=$rc"
    printf '%s' "$E" | grep -qF "$4" && { ghim "[$1] ghim hang cua MINH" 0; DEM=$((DEM+1)); } || ghim "[$1] ghim hang cua minh" 1 "thay: $E"
    local other
    for other in "$M_WS" "$M_DIR" "$M_CT" "$M_DONG" "$M_HONG"; do
      [ "$other" = "$4" ] && continue
      if printf '%s' "$E" | grep -qF "$other"; then ghim "[$1] KHONG lan sang «$other»" 1 "co ca hai"; else DEM=$((DEM+1)); fi
    done
    ghim "[$1] phan biet duoc voi bon hang kia" 0
  }
  run_ca "khong-xuong"   "$TRAN" bat-ky    "$M_WS"
  run_ca "khong-thu-muc" "$W"    khong-co  "$M_DIR"
  run_ca "thu-muc-rong"  "$W"    c3-trong  "$M_CT"
  [ "$DEM" = "18" ] && ghim "so assert = 3 ca x (2 + 4 am) = 18" 0 || ghim "dang thuc so assert" 1 "dem duoc $DEM/18"
  # ĐỐI CHỨNG DƯƠNG: hai làn cũ còn sống
  mkdir -p "$W/_acceptance/c9" "$W/_acceptance/c10"
  hop_dong "$W/_acceptance/c9" approved
  hop_dong "$W/_acceptance/c10" verified
  printf -- '---\nschema_version: 1\nfeature_slug: c10\nverdict: PASS\n---\n\n# bc\n' > "$W/_acceptance/c10/evidence-report.md"
  node "$GC" --root "$W" --slug c9  2>/dev/null | grep -qF 'Hệ thống SẼ làm' && ghim "doi chung duong: lan Cong Pham vi con song" 0 || ghim "doi chung duong Cong Pham vi" 1 "khong ra the"
  node "$GC" --root "$W" --slug c10 2>/dev/null | grep -qF 'class="foot"'    && ghim "doi chung duong: lan Cong Bang chung con song" 0 || ghim "doi chung duong Cong Bang chung" 1 "khong ra the"
  ;;

# ─────────────────────────────────────────────── dang-thuc-ca (E7 / AC-7)
dang-thuc-ca)
  # ĐẲNG THỨC RÚT-TỪ-BÊN-VIẾT — thay ca ghim hằng số 3 cua bo rang khong-ve-the-ma.
  doan() { awk '/<<<CARD-PRECHECK-RULES/{f=1} f&&/^[0-9]+\. /{exit} f' "$1" | grep -E '^\s*- `[^`]+`[[:space:]]*→'; }
  dem_hang() { sed -n "s/^const MSG_[A-Z_]*[[:space:]]*=[[:space:]]*'.*';.*/x/p" "$1" | wc -l | tr -d ' '; }
  N="$(dem_hang "$GC")"; M="$(doan "$CMD" | wc -l | tr -d ' ')"
  [ "$N" = "$M" ] && ghim "N hang ben viet ($N) == M loi thuat than lenh ($M)" 0 || ghim "dang thuc N==M" 1 "N=$N M=$M"
  TONG=0
  for v in "$M_WS" "$M_DIR" "$M_CT" "$M_DONG" "$M_HONG"; do
    c="$(doan "$CMD" | grep -cF "$v")"
    [ "$c" = "1" ] && { ghim "«$v» ghep dung MOT loi thuat" 0; TONG=$((TONG+1)); } || ghim "«$v» ghep mot-doi-mot" 1 "co $c loi thuat"
  done
  [ "$TONG" = "5" ] && ghim "du 5 cap (so assert = so phan tu)" 0 || ghim "so cap" 1 "chi $TONG/5"
  # CHIỀU ĐỎ (a): thêm hằng ở bên viết mà không thêm lời thuật
  MA="$TMP/ma"; ban_sao "$MA" || exit 1
  if tiem "them-hang" "$MA/scripts/gate-card.js" "s/(const MSG_HO_SO_HONG[^\n]*\n)/\$1const MSG_BIA_THEM = 'gate-card: hang bia them';\n/"; then
    [ "$(dem_hang "$MA/scripts/gate-card.js")" != "$(doan "$CMD" | wc -l | tr -d ' ')" ] \
      && ghim "chieu do (a): them hang ma khong them thuat -> dang thuc DO" 0 \
      || ghim "chieu do (a)" 1 "dang thuc van XANH"
  fi
  # CHIỀU ĐỎ (b): thêm lời thuật không rút được từ hằng nào
  MB="$TMP/mb"; ban_sao "$MB" || exit 1
  if tiem "them-thuat" "$MB/commands/acceptance-card.md" "s/(   - \`gate-card: hồ sơ hỏng\`[^\n]*\n)/\$1   - \`gate-card: ca bia\` → mot loi thuat khong co hang nao.\n/"; then
    m2="$(doan "$MB/commands/acceptance-card.md" | wc -l | tr -d ' ')"
    [ "$m2" != "$N" ] && ghim "chieu do (b): them thuat khong co hang -> dang thuc DO (M=$m2 vs N=$N)" 0 \
                      || ghim "chieu do (b)" 1 "dang thuc van XANH"
  fi
  # CHIỀU ĐỎ (c): đổi chữ MỘT hằng → đúng cặp đó đỏ, bốn cặp kia còn nguyên
  MC="$TMP/mc"; ban_sao "$MC" || exit 1
  if tiem "doi-chu-mot-hang" "$MC/scripts/gate-card.js" "s/(const MSG_O_DA_DONG\s*=\s*')[^']*/\${1}gate-card: CHUOI-BIA/"; then
    v2="$(sed -n "s/^const MSG_O_DA_DONG[[:space:]]*=[[:space:]]*'\(.*\)';.*/\1/p" "$MC/scripts/gate-card.js" | head -1)"
    con=0; for other in "$M_WS" "$M_DIR" "$M_CT" "$M_HONG"; do [ "$(doan "$CMD" | grep -cF "$other")" = "1" ] && con=$((con+1)); done
    if [ "$(doan "$CMD" | grep -cF "$v2")" = "0" ] && [ "$con" = "4" ]; then
      ghim "chieu do (c): doi chu mot hang -> dung cap do DO, bon cap kia con nguyen" 0
    else ghim "chieu do (c)" 1 "mutant lam do lan hoac khong do"; fi
  fi
  ;;

# ────────────────────────────────────────────────────── bon-loi-ra (E8 / AC-8)
bon-loi-ra)
  W="$TMP/w"; xuong "$W" || exit 1
  O="$(node "$GC" --root "$W" --slug o4-cho-dang 2>/dev/null)"
  [ -n "$O" ] || { ghim "doi chung duong: the ve duoc" 1 "stdout rong"; exit 1; }
  ghim "doi chung duong: the ve duoc" 0
  DEM=0; i=0
  while IFS= read -r l; do
    i=$((i+1))
    printf '%s' "$O" | grep -qF ">$l</button>" && { ghim "loi ra $i «$l» co nut" 0; DEM=$((DEM+1)); } || ghim "loi ra $i «$l»" 1 "khong thay nut"
  done <<< "$LOI_RA"
  # đúng thứ tự
  THU_TU="$(printf '%s' "$O" | grep -o '<button class="b [a-z]*">[^<]*' | sed 's/.*>//' | paste -sd'|' -)"
  MONG="$(printf '%s' "$LOI_RA" | paste -sd'|' -)"
  [ "$THU_TU" = "$MONG" ] && { ghim "bon nut DUNG THU TU nguon" 0; DEM=$((DEM+1)); } || ghim "thu tu nut" 1 "thay '$THU_TU' cho '$MONG'"
  printf '%s' "$O" | grep -qF 'Đảo ngược dễ' && { ghim "co dong noi dao nguoc duoc" 0; DEM=$((DEM+1)); } || ghim "dong dao nguoc" 1 "khong thay"
  [ "$DEM" = "6" ] && ghim "so assert = 4 loi + thu tu + dao = 6" 0 || ghim "dang thuc so assert" 1 "dem duoc $DEM/6"
  # CHIỀU ĐỎ: bỏ một lối ra khỏi nguồn → đỏ nêu đúng tên lối thiếu
  MA="$TMP/ma"; ban_sao "$MA" || exit 1
  if tiem "bo-mot-loi-ra" "$MA/scripts/gate-card.js" "s/const LOI_RA_G0 = \['làm', 'lặp', 'xếp lại', 'dừng'\];/const LOI_RA_G0 = ['làm', 'lặp', 'dừng'];/"; then
    O2="$(node "$MA/scripts/gate-card.js" --root "$W" --slug o4-cho-dang 2>/dev/null)"
    printf '%s' "$O2" | grep -qF ">xếp lại</button>" \
      && ghim "chieu do: bo mot loi ra" 1 "van in nut da bo" \
      || ghim "chieu do: bo «xep lai» khoi nguon -> nut do bien mat, neu dung ten" 0
  fi
  ;;

# ───────────────────────────────────────────────── khong-viet-ho (E9 / AC-9)
khong-viet-ho)
  W="$TMP/w"; xuong "$W" || exit 1
  F="$W/_acceptance/o4-cho-dang/opportunity.md"
  # CHỨNG LỆNH ĐÃ THẬT SỰ CHẠY — làm TRƯỚC hai khẳng định âm tính.
  O="$(node "$GC" --root "$W" --slug o4-cho-dang 2>/dev/null)"; rc1=$?
  X="$(node "$GC" --root "$W" --slug o4-cho-dang --extract 2>/dev/null)"; rc2=$?
  [ "$rc1" = "0" ] && printf '%s' "$O" | grep -qF 'Cổng Đáng' \
    && ghim "lenh render THAT SU chay (exit 0 + nhan cong)" 0 || ghim "lenh render that su chay" 1 "exit=$rc1"
  [ "$rc2" = "0" ] && printf '%s' "$X" | grep -qF '"cong_dang"' \
    && ghim "lenh --extract THAT SU chay (exit 0 + khoa cong_dang)" 0 || ghim "lenh --extract that su chay" 1 "exit=$rc2"
  # (1) băm không đổi
  b1="$(shasum -a 256 "$F" | cut -d' ' -f1)"
  node "$GC" --root "$W" --slug o4-cho-dang >/dev/null 2>&1
  node "$GC" --root "$W" --slug o4-cho-dang --extract >/dev/null 2>&1
  b2="$(shasum -a 256 "$F" | cut -d' ' -f1)"
  [ "$b1" = "$b2" ] && ghim "(1) bam opportunity.md khong doi — the khong ghi gi" 0 || ghim "(1) bam khong doi" 1 "the da SUA ho so"
  # đối chứng dương cho (1): ghi một byte → phép so PHẢI đỏ
  printf 'x' >> "$F"; b3="$(shasum -a 256 "$F" | cut -d' ' -f1)"
  [ "$b1" != "$b3" ] && ghim "doi chung duong (1): ghi 1 byte -> phep so bam DO" 0 || ghim "doi chung duong (1)" 1 "phep so bam khong phan biet duoc"
  # (2) không có decision điền sẵn
  EN="$(node -e 'console.log(require(process.argv[1]).NAV_RULES["opportunity.md"].decision.enum.join(" "))' "$ROOT/lib/workspace-record.cjs")"
  bad=0; for v in $EN; do printf '%s' "$X" | grep -qE "\"decision\"[[:space:]]*:[[:space:]]*\"$v\"" && bad=$((bad+1)); done
  [ "$bad" = "0" ] && ghim "(2) dau ra KHONG chua decision dien san" 0 || ghim "(2) khong chua decision" 1 "$bad gia tri lot ra"
  # đối chứng dương cho (2): ô có decision sẵn → phép quét PHẢI bắt được
  W2="$TMP/w2"; mkdir -p "$W2/_acceptance/co-dec"; printf 'schema_version: 1\n' > "$W2/_acceptance/config.yaml"
  opp "$W2/_acceptance/co-dec" decided 'build' "$NG_CHOT"
  grep -qE '^decision: build' "$W2/_acceptance/co-dec/opportunity.md" \
    && ghim "doi chung duong (2): phep quet bat duoc decision khi no CO that" 0 \
    || ghim "doi chung duong (2)" 1 "phep quet khong bat duoc gi — assert am tinh vo nghia"
  ;;

# ─────────────────────────────────────────────────── mot-nguon (E11 / AC-10)
mot-nguon)
  ba_ben() { # ba_ben <goc cay> -> in "ve|anh-xa|ngu-phap"
    node -e '
      const fs=require("fs"), p=process.argv[1];
      const ve=JSON.parse("["+fs.readFileSync(p+"/scripts/gate-card.js","utf8").match(/const LOI_RA_G0 = \[(.*?)\]/s)[1].replace(/'"'"'/g,"\"")+"]");
      const ax=fs.readFileSync(p+"/commands/approve.md","utf8").match(/<<<G0-ANH-XA\n([\s\S]*?)\nG0-ANH-XA>>>/)[1].trim().split("\n").map(l=>l.split("->")[0].trim());
      const np=fs.readFileSync(p+"/skills/acceptance/references/human-facing-language.md","utf8")
        .match(/<<<GATE-ONESHOT-SLOTS -->\n([\s\S]*?)\n<!-- GATE-ONESHOT-SLOTS>>>/)[1]
        .split("\n").filter(l=>l.startsWith("g0 ")).map(l=>l.slice(3));
      console.log([ve.join(","), ax.join(","), ve.filter(x=>np.includes(x)).join(",")].join("|"));
    ' "$1"
  }
  R0="$(ba_ben "$ROOT")"; VE="${R0%%|*}"; rest="${R0#*|}"; AX="${rest%%|*}"; NP="${rest##*|}"
  echo "   ben ve: $VE"; echo "   anh xa: $AX"; echo "   ngu phap (giao): $NP"
  [ "$VE" = "$AX" ] && ghim "ben VE == bang anh xa (dung thu tu)" 0 || ghim "ben ve == anh xa" 1 "'$VE' vs '$AX'"
  [ "$VE" = "$NP" ] && ghim "ben VE == ngu phap cau gop" 0 || ghim "ben ve == ngu phap" 1 "'$VE' vs '$NP'"
  # BA LƯỢT TIÊM RIÊNG — mot ben hong khong che hai ben kia
  i=0
  for spec in "ve:scripts/gate-card.js:s/'xếp lại'/'xep-lai-BIA'/" \
              "anh-xa:commands/approve.md:s/^xếp lại -> park/xep-lai-BIA -> park/m" \
              "ngu-phap:skills/acceptance/references/human-facing-language.md:s/^g0 xếp lại/g0 xep-lai-BIA/m"; do
    i=$((i+1)); nhan="${spec%%:*}"; r="${spec#*:}"; f="${r%%:*}"; cmd="${r#*:}"
    MD="$TMP/m$i"; ban_sao "$MD" || exit 1
    if tiem "$nhan" "$MD/$f" "$cmd"; then
      RR="$(ba_ben "$MD" 2>/dev/null)" || RR="LOI"
      v="${RR%%|*}"; rr="${RR#*|}"; a="${rr%%|*}"; n="${rr##*|}"
      if [ "$RR" = "LOI" ] || [ "$v" != "$a" ] || [ "$v" != "$n" ]; then
        ghim "chieu do [$nhan]: doi mot ben -> ba ben lech, phep do DO" 0
      else ghim "chieu do [$nhan]" 1 "doi $f ma ba ben van khop — phep do khong doc ben do"; fi
    fi
  done
  ;;

# ──────────────────────────────────────────────────── ban-giao (E12 / AC-11)
ban-giao)
  vi_tri() { # vi_tri <file> <chuoi> -> so dong dau tien
    grep -nF "$2" "$1" | head -1 | cut -d: -f1
  }
  L_THE=$(vi_tri "$STA" 'acceptance-card <slug>`; riêng cổng `dang`')
  L_KY=$(vi_tri "$STA" 'acceptance-gate:approve <slug> <lối>')
  if [ -z "$L_THE" ] || [ -z "$L_KY" ]; then ghim "tim duoc hai ve trong buoc ban giao" 1 "the=$L_THE ky=$L_KY"
  else
    [ "$L_THE" -le "$L_KY" ] && ghim "the (dong $L_THE) nam TRUOC lenh ky (dong $L_KY)" 0 || ghim "thu tu the-truoc-ky" 1 "the=$L_THE ky=$L_KY"
  fi
  # tên lệnh ký phải khớp thân lệnh duyệt CÓ THẬT
  [ -f "$APR" ] && grep -q "Chế độ Cổng Đáng" "$APR" \
    && ghim "than lenh duyet CO muc che do Cong Dang" 0 || ghim "than lenh duyet co che do" 1 "khong thay muc"
  # đối chứng dương: lối gia-tri (song tu truoc) van rut duoc
  vi_tri "$STA" 'acceptance-gate:uat-session <slug>' >/dev/null && ghim "doi chung duong: loi gia-tri van rut duoc" 0 || ghim "doi chung duong gia-tri" 1 "khong thay"
  # CHIỀU ĐỎ (a): đổi tên lệnh ký thành tên không tồn tại
  MA="$TMP/ma"; ban_sao "$MA" || exit 1
  if tiem "doi-ten-lenh" "$MA/commands/start.md" "s/acceptance-gate:approve <slug> <lối>/acceptance-gate:khong-ton-tai <slug> <lối>/"; then
    grep -qF 'acceptance-gate:approve <slug> <lối>' "$MA/commands/start.md" \
      && ghim "chieu do (a)" 1 "van thay ten cu" || ghim "chieu do (a): doi ten lenh ky -> phep do DO" 0
  fi
  # CHIỀU ĐỎ (b): đảo thứ tự hai vế
  MB="$TMP/mb"; ban_sao "$MB" || exit 1
  # Hoán vị bằng node cho chắc — regex nhiều dòng trên văn bản có dấu là chỗ dễ
  # tự dối: khớp hụt thì mutant không chạy mà phép đo vẫn báo xanh.
  bam1="$(shasum -a 256 < "$MB/commands/start.md" | cut -d' ' -f1)"
  node -e '
    const fs=require("fs"), p=process.argv[1];
    const L=fs.readFileSync(p,"utf8").split("\n");
    const i=L.findIndex(l=>l.includes("acceptance-card <slug>`; riêng cổng `dang`"));
    const j=L.findIndex(l=>l.includes("acceptance-gate:approve <slug> <lối>"));
    if(i<0||j<0||i===j) process.exit(3);
    const t=L[i]; L[i]=L[j]; L[j]=t;
    fs.writeFileSync(p,L.join("\n"));
  ' "$MB/commands/start.md" || { ghim "lenh tiem [dao-thu-tu] doi duoc vat" 1 "khong tim thay hai dong de hoan vi"; }
  bam2="$(shasum -a 256 < "$MB/commands/start.md" | cut -d' ' -f1)"
  if [ "$bam1" = "$bam2" ]; then ghim "lenh tiem [dao-thu-tu] doi duoc vat" 1 "noi dung KHONG doi"
  else
    l1=$(grep -nF 'acceptance-card <slug>`; riêng cổng `dang`' "$MB/commands/start.md" | head -1 | cut -d: -f1)
    l2=$(grep -nF 'acceptance-gate:approve <slug> <lối>' "$MB/commands/start.md" | head -1 | cut -d: -f1)
    if [ -n "$l1" ] && [ -n "$l2" ] && [ "$l1" -gt "$l2" ]; then ghim "chieu do (b): dao thu tu -> phep do DO" 0
    else ghim "chieu do (b)" 1 "dao roi ma thu tu van dung (l1=$l1 l2=$l2)"; fi
  fi
  ;;

# ─────────────────────────────────────────────────────── rang-ky (E13 / AC-12)
rang-ky)
  khoi() { sed -n '/<<<G0-RANG-CHAN/,/G0-RANG-CHAN>>>/p' "$1"; }
  B="$(khoi "$APR")"
  [ -n "$B" ] && ghim "khoi marker G0-RANG-CHAN co mat" 0 || { ghim "khoi marker G0-RANG-CHAN" 1 "khong thay"; exit 1; }
  MENH="nguong-chua-chot-chan-lam-va-lap nguon-ngoai-chua-phan-loai-chan-lam-va-lap xep-lai-va-dung-khong-can-nguong"
  DEM=0
  for m in $MENH; do
    printf '%s' "$B" | grep -qx "$m" && { ghim "menh de «$m» nam tren DONG RIENG" 0; DEM=$((DEM+1)); } || ghim "menh de «$m»" 1 "khong nam tren dong rieng"
  done
  [ "$DEM" = "3" ] && ghim "du 3 menh de (so assert = so phan tu)" 0 || ghim "so menh de" 1 "chi $DEM/3"
  # CHIỀU ĐỎ: gỡ ĐÚNG một dòng → đúng mệnh đề đó đỏ, hai mệnh đề kia còn nguyên
  for m in $MENH; do
    MD="$TMP/mk-$m"; ban_sao "$MD" || exit 1
    grep -vx "$m" "$MD/commands/approve.md" > "$MD/tmp.md" && mv "$MD/tmp.md" "$MD/commands/approve.md"
    B2="$(khoi "$MD/commands/approve.md")"
    con=0; for o in $MENH; do [ "$o" = "$m" ] && continue; printf '%s' "$B2" | grep -qx "$o" && con=$((con+1)); done
    if printf '%s' "$B2" | grep -qx "$m"; then ghim "chieu do [$m]" 1 "go dong roi ma van thay — menh de khong nam tren dong rieng"
    elif [ "$con" = "2" ]; then ghim "chieu do [$m]: go dung mot dong -> dung menh de do DO, hai menh de kia con nguyen" 0
    else ghim "chieu do [$m]" 1 "mutant lam do lan ($con/2 menh de kia con lai)"; fi
  done
  ;;

# ────────────────────────────────────────────── anh-xa-du-hang (E14 / AC-13)
anh-xa-du-hang)
  # ĐỦ HÀNG, không phải CÓ MẶT. Bit lo ma bon eval kia khong thay: the in du bon
  # nhan va ba van ban liet du bon nhan thi chung xanh het, nhung neu bang anh xa
  # chi dan duoc HAI gia tri may thi nguoi ky «xep lai» van khong ghi duoc.
  doc() { # doc <goc cay> -> in "sohang|nhan,...|giatri,...|enum,..."
    node -e '
      const fs=require("fs"), p=process.argv[1];
      const m=fs.readFileSync(p+"/commands/approve.md","utf8").match(/<<<G0-ANH-XA\n([\s\S]*?)\nG0-ANH-XA>>>/);
      if(!m){ console.log("0|||"); process.exit(0); }
      const rows=m[1].trim().split("\n").filter(Boolean).map(l=>l.split("->").map(s=>s.trim()));
      const {NAV_RULES}=require(p+"/lib/workspace-record.cjs");
      console.log([rows.length, rows.map(r=>r[0]).join(","), rows.map(r=>r[1]).join(","),
                   NAV_RULES["opportunity.md"].decision.enum.join(",")].join("|"));
    ' "$1"
  }
  IFS='|' read -r NH NHAN GIA EN <<< "$(doc "$ROOT")"
  echo "   so hang: $NH · nhan: $NHAN · gia tri: $GIA · enum lib: $EN"
  [ "$NH" = "4" ] && ghim "(a) bang anh xa DU BON HANG" 0 || ghim "(a) du bon hang" 1 "co $NH hang"
  s1="$(printf '%s' "$GIA" | tr ',' '\n' | sort | tr '\n' ' ')"
  s2="$(printf '%s' "$EN"  | tr ',' '\n' | sort | tr '\n' ' ')"
  [ "$s1" = "$s2" ] && ghim "(b) tap gia tri may == enum decision cua lib" 0 || ghim "(b) tap gia tri == enum lib" 1 "'$s1' vs '$s2'"
  VE="$(printf '%s' "$LOI_RA" | tr '\n' ',' | sed 's/,$//')"
  [ "$NHAN" = "$VE" ] && ghim "(c) tap nhan == bon loi ra ben ve (dung thu tu)" 0 || ghim "(c) nhan == ben ve" 1 "'$NHAN' vs '$VE'"
  # CHIỀU ĐỎ (1): gỡ một hàng
  MA="$TMP/ma"; ban_sao "$MA" || exit 1
  if tiem "go-mot-hang" "$MA/commands/approve.md" "s/^xếp lại -> park\n//m"; then
    IFS='|' read -r nh2 _ _ _ <<< "$(doc "$MA")"
    [ "$nh2" != "4" ] && ghim "chieu do (1): go hang «xep lai» -> DO, con $nh2 hang" 0 || ghim "chieu do (1)" 1 "van du bon hang"
  fi
  # CHIỀU ĐỎ (2): đổi một giá trị máy thành chuỗi ngoài từ vựng
  MB="$TMP/mb"; ban_sao "$MB" || exit 1
  if tiem "gia-tri-la" "$MB/commands/approve.md" "s/^xếp lại -> park/xếp lại -> gia-tri-la/m"; then
    IFS='|' read -r _ _ g2 e2 <<< "$(doc "$MB")"
    t1="$(printf '%s' "$g2" | tr ',' '\n' | sort | tr '\n' ' ')"; t2="$(printf '%s' "$e2" | tr ',' '\n' | sort | tr '\n' ' ')"
    [ "$t1" != "$t2" ] && ghim "chieu do (2): gia tri ngoai tu vung -> DO" 0 || ghim "chieu do (2)" 1 "van khop enum"
  fi
  # CHIỀU ĐỎ (3): thêm giá trị hợp lệ mới vào LIB mà không thêm hàng
  MC="$TMP/mc"; ban_sao "$MC" || exit 1
  if tiem "them-enum-lib" "$MC/lib/workspace-record.cjs" "s/enum: \['build', 'iterate', 'park', 'kill'\]/enum: ['build', 'iterate', 'park', 'kill', 'hoan']/"; then
    IFS='|' read -r _ _ g3 e3 <<< "$(doc "$MC")"
    t1="$(printf '%s' "$g3" | tr ',' '\n' | sort | tr '\n' ' ')"; t2="$(printf '%s' "$e3" | tr ',' '\n' | sort | tr '\n' ' ')"
    [ "$t1" != "$t2" ] && ghim "chieu do (3): them gia tri vao lib ma khong them hang -> DO (phep do doc LIB that)" 0 \
                       || ghim "chieu do (3)" 1 "khong doi — phep do dang chep san bon chuoi thay vi doc lib"
  fi
  ;;

*) echo "chan khong biet: '$CHAN'"; exit 2 ;;
esac

exit "$loi"
