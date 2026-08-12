#!/usr/bin/env bash
# Răng đo SỰ VẮNG MẶT cho hồ sơ luu-kho-codex-va-nghi-le-design.
#
# Vật được giao ở hồ sơ này phần lớn là thứ KHÔNG còn nữa. Đó là hình dạng nguy
# hiểm nhất trong sổ vấp của kho: "assertion âm-tính-một-mình là assertion không
# sống" — grep hỏng, đường dẫn gõ sai, script chưa chạy đều cho cùng một màu
# xanh. Nên MỌI phép đo âm ở đây bị buộc ba điều:
#   (a) ĐỐI CHỨNG DƯƠNG neo vào mốc `truoc-luu-kho-2026-08` (bất biến; KHÔNG
#       dùng origin/main vì nó còn di chuyển). Mốc VẮNG → ĐỎ, không bỏ qua.
#   (b) GHIM ĐÚNG THÔNG ĐIỆP, không tin mã thoát.
#   (c) CHIỀU ĐỎ CHẠY THẬT: dựng bản sao có vật bị lưu kho chép ngược về, chạy
#       lại CHÍNH hàm kiểm đó, và đòi nó ĐỎ.
#
# Mọi đường dẫn SUY TỪ VỊ TRÍ SCRIPT — không hardcode ROOT (lớp lỗi đã ghi sổ:
# phép đo so với checkout của tác giả thay vì cây đang kiểm).
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TAG="truoc-luu-kho-2026-08"
fails=0
ok()   { echo "  OK   $*"; }
bad()  { echo "  ĐỎ   $*"; fails=$((fails + 1)); }
mut()  { echo "       [đột biến] $*"; }

g() { git -C "$ROOT" "$@"; }

# ── Chân sống-còn: mốc phải tồn tại. Thiếu mốc thì MỌI đối chứng dương bên dưới
#    vô nghĩa, nên fail-closed ngay, không chạy tiếp cho có màu. ───────────────
check_tag_exists() {
  local tag="$1"
  g rev-parse -q --verify "refs/tags/$tag^{commit}" >/dev/null 2>&1
}
if ! check_tag_exists "$TAG"; then
  echo "LUU-KHO-TAG: thieu tag doi chung — khong the chay bat ky phep do am nao"
  exit 1
fi
TAG_SHA="$(g rev-parse "$TAG^{commit}")"

echo "== E1 · mốc đảo =="
echo "LUU-KHO-TAG: $TAG -> $TAG_SHA"
for p in codex design-loop plugins; do
  if g ls-tree -d --name-only "$TAG" -- "$p" | grep -q .; then
    ok "LUU-KHO-TAG: cây của mốc có $p/"
  else
    bad "LUU-KHO-TAG: cây của mốc THIẾU $p/ — mốc trỏ sai chỗ"
  fi
done
# Mốc phải là CHA TRỰC TIẾP của commit gỡ đầu tiên. Quan hệ tổ-tiên KHÔNG đủ:
# nó cho phép chèn commit khác vào giữa, tức cây của mốc không còn là "ngay
# trước khi gỡ".
FIRST_CUT="$(g log --format=%H --reverse "$TAG..HEAD" -- codex design-loop plugins | head -1)"
if [ -z "$FIRST_CUT" ]; then
  bad "LUU-KHO-TAG: khong tim thay commit go dau tien"
else
  PARENT="$(g rev-parse "$FIRST_CUT^")"
  if [ "$PARENT" = "$TAG_SHA" ]; then
    ok "LUU-KHO-TAG: la cha cua commit go dau tien OK"
  else
    bad "LUU-KHO-TAG: khong phai cha truc tiep cua commit go dau tien ($PARENT != $TAG_SHA)"
  fi
fi
# Chân này gọi MẠNG, nên nó có hai kiểu hỏng khác hẳn nhau và màu đỏ phải nói
# được là kiểu nào: "mốc chưa đẩy lên" (vật hỏng — chặn merge) khác hẳn "không
# hỏi được remote" (đường truyền hỏng — chạy lại là xong). Gộp hai thứ vào một
# thông điệp thì một lần mạng chập đọc y như một hồ sơ thiếu đường đảo, và
# người đọc sẽ học cách phớt lờ đúng cái chân sống-còn nhất. Thử 3 lượt để nuốt
# cú chập ngắn; hết 3 lượt vẫn không hỏi được thì vẫn ĐỎ (fail-closed: không
# chứng minh được là đã đẩy thì không được coi như đã đẩy).
LS_OUT=""; LS_RC=1
for _try in 1 2 3; do
  LS_OUT="$(g ls-remote --tags origin 2>/dev/null)"; LS_RC=$?
  [ "$LS_RC" -eq 0 ] && [ -n "$LS_OUT" ] && break
  sleep 2
done
if [ "$LS_RC" -ne 0 ] || [ -z "$LS_OUT" ]; then
  bad "LUU-KHO-TAG: khong hoi duoc remote sau 3 luot — chua chung minh duoc moc da day (loi duong truyen, KHONG phai loi ho so)"
elif printf '%s' "$LS_OUT" | grep -q "$TAG_SHA"; then
  ok "LUU-KHO-TAG: co tren remote OK"
else
  bad "LUU-KHO-TAG: chua day len remote"
fi
# chiều đỏ: gọi lại chính hàm kiểm với tên mốc bịa
if check_tag_exists "truoc-luu-kho-KHONG-CO"; then
  bad "LUU-KHO-TAG: ham kiem mốc xanh voi tag bia — phep do khong song"
else
  mut "tên mốc bịa → hàm kiểm ĐỎ đúng như mong đợi"
fi

echo "== E2 · sáu vật đã lưu kho =="
GONE=(codex tests/codex scripts/codex-self-script-refs.tsv .agents design-loop tests/design-loop)
path_check() {   # $1 = cây làm việc cần soi
  local base="$1" n=0 bad_local=0 p
  for p in "${GONE[@]}"; do
    local at_head=1 at_tag=0
    [ -e "$base/$p" ] || at_head=0
    g ls-tree --name-only "$TAG" -- "$p" | grep -q . && at_tag=1
    if [ "$at_head" -eq 1 ]; then
      echo "LUU-KHO-PATH: $p con tren HEAD"; bad_local=1
    elif [ "$at_tag" -eq 0 ]; then
      echo "LUU-KHO-PATH: $p khong co o tag — doi chung duong hong, assertion nay khong song"; bad_local=1
    else
      n=$((n + 1))
    fi
  done
  echo "LUU-KHO-PATH: $n/${#GONE[@]}"
  return $bad_local
}
if OUT="$(path_check "$ROOT")" && printf '%s' "$OUT" | grep -q "LUU-KHO-PATH: ${#GONE[@]}/${#GONE[@]}"; then
  ok "LUU-KHO-PATH: ${#GONE[@]}/${#GONE[@]} vang o HEAD, co o tag OK"
else
  printf '%s\n' "$OUT" | sed 's/^/       /'
  bad "LUU-KHO-PATH: có vật lệch (xem trên)"
fi
# chiều đỏ: chép `codex/` từ mốc về một bản sao rồi chạy lại CHÍNH hàm trên
MUTDIR="$(mktemp -d)"
mkdir -p "$MUTDIR/codex"
g archive "$TAG" codex 2>/dev/null | tar -x -C "$MUTDIR" 2>/dev/null
if OUT2="$(path_check "$MUTDIR")"; printf '%s' "$OUT2" | grep -q "LUU-KHO-PATH: codex con tren HEAD"; then
  mut "chép codex/ từ mốc về bản sao → ĐỎ đúng thông điệp"
else
  bad "LUU-KHO-PATH: chieu do khong chay — ban sao co codex/ ma van xanh"
fi
rm -rf "$MUTDIR"

echo "== E3 · marketplace =="
mkt_check() {
  node -e '
    const fs = require("fs");
    const d = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const names = (d.plugins || []).map(p => p.name).sort();
    process.stdout.write(names.join(","));
  ' "$1"
}
NAMES="$(mkt_check "$ROOT/.claude-plugin/marketplace.json")"
if [ "$NAMES" = "acceptance-gate,feature-loop" ]; then
  ok "LUU-KHO-MKT: claude 2 plugin (acceptance-gate, feature-loop) OK"
else
  bad "LUU-KHO-MKT: tap plugin la [$NAMES], mong [acceptance-gate,feature-loop]"
fi
[ -e "$ROOT/.agents/plugins/marketplace.json" ] \
  && bad "LUU-KHO-MKT: .agents/plugins/marketplace.json van con" \
  || ok "LUU-KHO-MKT: .agents/plugins/marketplace.json vang OK"
TAGMKT="$(mktemp)"; g show "$TAG:.claude-plugin/marketplace.json" > "$TAGMKT" 2>/dev/null
TAGN="$(mkt_check "$TAGMKT")"
if [ "$(printf '%s' "$TAGN" | tr ',' '\n' | grep -c .)" -eq 3 ]; then
  ok "LUU-KHO-MKT: tag co 3 entry OK"
else
  bad "LUU-KHO-MKT: tag co [$TAGN] — doi chung duong hong"
fi
# chiều đỏ: thêm lại entry design-loop vào bản sao
MUTMKT="$(mktemp)"
node -e '
  const fs = require("fs");
  const d = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  d.plugins.push({ name: "design-loop", source: { source: "./design-loop" } });
  fs.writeFileSync(process.argv[2], JSON.stringify(d));
' "$ROOT/.claude-plugin/marketplace.json" "$MUTMKT"
if printf '%s' "$(mkt_check "$MUTMKT")" | grep -q "design-loop"; then
  mut "thêm lại entry design-loop vào bản sao → phép đọc thấy 'con entry design-loop'"
else
  bad "LUU-KHO-MKT: chieu do khong chay"
fi
rm -f "$TAGMKT" "$MUTMKT"

echo "== E4 · tham chiếu sống =="
# Phạm vi quét SỐNG. `docs/` và `_acceptance/` cố ý NGOÀI phạm vi (sử liệu).
# `tests/` KHÔNG nằm trong phép quét văn bản này, và đây là quyết định có lý do
# chứ không phải nới lỏng: trong `tests/`, "không còn con trỏ sống" được cưỡng
# chế bằng thứ MẠNH HƠN GREP — đẳng thức số ca của AC-11 cộng suite phải XANH.
# Một con trỏ sống sót trong test thì test ĐỎ, không cần grep mới biết. Cái mà
# grep còn bắt được trong `tests/` chỉ còn hai loại, và cả hai đều là sử liệu:
# chú thích ghi VÌ SAO một vật bị lưu kho, và chuỗi fixture cố ý mang tên đường
# dẫn đã chết để chứng minh luật không còn khớp nó nữa. Cấm hai loại đó là bắt
# cuốn sổ ghi-những-gì-đã-xoá không được nhắc tới thứ đã xoá.
SCOPE=(commands skills feature-loop scripts lib hooks GUIDE.md QUICKSTART.md
       README.md CONTEXT.md CLAUDE.md .github .claude-plugin)
# Needle `plugins/` neo vào GỐC KHO: chuỗi trần khớp luôn `tests/plugins/`, là
# bộ kiểm CÒN SỐNG (sửa-sau-Cổng-1 12/08).
# `mirror_sync` KHÔNG ở đây: khoá đó sống trong `_acceptance/config.yaml`, mà
# `_acceptance/` cố ý ngoài phạm vi quét — để nó lại thì needle cho tag=0 và
# chính lưới này tuyên "phép đo không sống". Nó được E10 đo bằng trình đọc khoá.
# `P30` phải ghim ĐÚNG TIÊU ĐỀ ca đã chết: `P30` trần khớp luôn ca
# "P30 Claude decision commands" đang SỐNG — needle bắt nhầm vật.
# `.agents` phải ở dạng ĐƯỜNG DẪN: chuỗi trần khớp luôn `t.agents` trong bộ
# đếm token của wf-usage.mjs — needle bắt nhầm vật, không phải cây bẩn.
# `/design-push` bỏ khỏi mảng: đo trên mốc cho 0 hit trong phạm vi sống, tức
# lệnh đó chưa bao giờ được nhắc ở đây — giữ lại thì chính lưới này tuyên
# "needle chua bao gio ton tai".
# Ca `P30 plugins/ mirror` sống trong `tests/` nên KHÔNG thuộc phép quét văn bản
# này — E10 đo nó trực tiếp bằng một chân riêng trên chính tệp bộ kiểm.
NEEDLES=(codex 'In Codex' '\.agents/' design-loop '/design-init' '/design-mockup'
         sync-plugin-packages 'plugins/acceptance-gate')
# Miễn trừ, khai TRƯỚC khi đo, kèm chân ĐỎ-NGOÀI-DANH-SÁCH ở E4b/E4c:
#   1. skills/ux-ui-craft/SKILL.md — "a design-loop" là DANH TỪ CHUNG
#   2. hai plugin.json — trường description là NHẬT KÝ PHIÊN BẢN (sử liệu)
#   3. tests/plugins/asserts-da-go.txt — SỔ KHAI các assert đã gỡ; theo đúng
#      định nghĩa nó chép nguyên văn những dòng trỏ vật đã lưu kho. Quét nó là
#      đòi cuốn sổ ghi-những-gì-đã-xoá không được nhắc tới thứ đã xoá.
MIENTRU_RE='^skills/ux-ui-craft/SKILL\.md:|^\.claude-plugin/plugin\.json:|^feature-loop/\.claude-plugin/plugin\.json:|^tests/plugins/asserts-da-go\.txt:'
ref_hits() {   # $1 = cây, $2 = needle → in các dòng khớp (đã trừ miễn trừ)
  local base="$1" needle="$2" f
  ( cd "$base" && grep -rIn -- "$needle" "${SCOPE[@]}" 2>/dev/null ) | grep -Ev "$MIENTRU_RE" || true
}
n_ok=0
for nd in "${NEEDLES[@]}"; do
  head_n="$(ref_hits "$ROOT" "$nd" | grep -c . || true)"
  tag_n="$(g grep -I -c -e "$nd" "$TAG" -- commands skills feature-loop scripts lib hooks \
             GUIDE.md QUICKSTART.md README.md CONTEXT.md CLAUDE.md .github .claude-plugin 2>/dev/null \
           | awk -F: '{s+=$NF} END{print s+0}')"
  if [ "$tag_n" -eq 0 ]; then
    bad "LUU-KHO-REF: $nd tag=0 — needle nay chua bao gio ton tai, phep do khong song"
  elif [ "$head_n" -ne 0 ]; then
    bad "LUU-KHO-REF: $nd HEAD=$head_n"
    ref_hits "$ROOT" "$nd" | head -3 | sed 's/^/         /'
  else
    echo "  OK   LUU-KHO-REF: $nd HEAD=0 tag=$tag_n(>0) OK"
    n_ok=$((n_ok + 1))
  fi
done
echo "LUU-KHO-REF: $n_ok/${#NEEDLES[@]}"
[ "$n_ok" -eq "${#NEEDLES[@]}" ] || bad "LUU-KHO-REF: $n_ok/${#NEEDLES[@]} needle sạch"
# Miễn trừ phải ĐÚNG số dòng đã khai — allowlist phình ra là cách lưới fail-loud
# hoá fail-silent.
mt_ux="$( ( cd "$ROOT" && grep -rIn -- design-loop skills/ux-ui-craft/SKILL.md 2>/dev/null ) | grep -c . || true)"
if [ "$mt_ux" -eq 1 ]; then
  ok "LUU-KHO-REF: mien tru 1/1 dong da khai OK"
else
  bad "LUU-KHO-REF: mien tru ux-ui-craft co $mt_ux dong (khai 1)"
fi

echo "== E4b · ĐỎ-NGOÀI-DANH-SÁCH (miễn trừ ux-ui-craft) =="
UXDIR="$(mktemp -d)"
cp -R "$ROOT/skills/ux-ui-craft" "$UXDIR/ux-ui-craft"
ux_scan() { ( cd "$1" && grep -rIn -- design-loop . 2>/dev/null ) | grep -v '/SKILL\.md:' || true; }
if [ -z "$(ux_scan "$UXDIR/ux-ui-craft")" ]; then
  ok "LUU-KHO-REF: ban sao ux-ui-craft chua tiem XANH truoc (doi chung duong)"
  printf '\nWhere design-loop is wired, this line is a fresh dead pointer.\n' \
    >> "$UXDIR/ux-ui-craft/references/layout-craft.md"
  HIT="$(ux_scan "$UXDIR/ux-ui-craft")"
  if printf '%s' "$HIT" | grep -q 'layout-craft\.md'; then
    mut "tiêm design-loop vào references/layout-craft.md → ĐỎ ghim đúng file vừa tiêm"
  else
    bad "LUU-KHO-REF: mien tru che ca thu muc — tiem file khac ma luoi im"
  fi
else
  bad "LUU-KHO-REF: ban sao ux-ui-craft chua tiem da DO — doi chung duong hong"
fi
rm -rf "$UXDIR"

echo "== E4c · ĐỎ-NGOÀI-DANH-SÁCH (miễn trừ nhật ký phiên bản) =="
# Miễn trừ chỉ che TRƯỜNG description của hai manifest đã khai. Tiêm vào một
# trường khác, hoặc vào manifest thứ ba, thì lưới PHẢI đỏ.
PJ="$(mktemp -d)"
node -e '
  const fs = require("fs");
  const d = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  d.interface = d.interface || {};
  d.interface.longDescription = "Wire design-loop before using this plugin.";
  fs.writeFileSync(process.argv[2] + "/plugin.json", JSON.stringify(d, null, 2));
' "$ROOT/.claude-plugin/plugin.json" "$PJ"
FIELD_HIT="$(node -e '
  const fs = require("fs");
  const d = JSON.parse(fs.readFileSync(process.argv[1] + "/plugin.json", "utf8"));
  const bad = Object.entries(d).filter(([k, v]) =>
    k !== "description" && JSON.stringify(v).includes("design-loop")).map(([k]) => k);
  process.stdout.write(bad.join(","));
' "$PJ")"
if [ "$FIELD_HIT" = "interface" ]; then
  mut "tiêm design-loop vào interface.longDescription → ĐỎ ghim đúng trường ngoài miễn trừ"
else
  bad "LUU-KHO-REF: mien tru nhat-ky-phien-ban che ca TEP thay vi mot truong (thay: [$FIELD_HIT])"
fi
# đối chứng dương: trên bản THẬT, ngoài `description` không trường nào dính
REAL_HIT="$(node -e '
  const fs = require("fs");
  for (const p of process.argv.slice(1)) {
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(d))
      if (k !== "description" && JSON.stringify(v).includes("design-loop")) process.stdout.write(p + ":" + k + " ");
  }
' "$ROOT/.claude-plugin/plugin.json" "$ROOT/feature-loop/.claude-plugin/plugin.json")"
[ -z "$REAL_HIT" ] \
  && ok "LUU-KHO-REF: hai manifest chi dinh o truong description OK" \
  || bad "LUU-KHO-REF: manifest dinh design-loop NGOAI description: $REAL_HIT"
rm -rf "$PJ"

echo "== E5 · nhánh UI trỏ design-pass =="
lane_section() {   # rút ĐÚNG mục "Làn design", không quét cả file
  awk '/^## Làn design/{f=1;next} /^## /{f=0} f' "$1"
}
FLS="$ROOT/feature-loop/skills/feature-loop/SKILL.md"
SEC="$(lane_section "$FLS")"
[ -n "$SEC" ] || bad "LUU-KHO-CT2: khong rut duoc muc Lan design — phep rut hong"
e5=0
printf '%s' "$SEC" | grep -q 'design-pass'        || { bad "LUU-KHO-CT2: muc Lan design khong neu design-pass"; e5=1; }
printf '%s' "$SEC" | grep -q 'design-gate'        || { bad "LUU-KHO-CT2: muc Lan design khong neu eval design-gate"; e5=1; }
printf '%s' "$SEC" | grep -q 'ui-check'           || { bad "LUU-KHO-CT2: muc Lan design khong neu eval ui-check"; e5=1; }
printf '%s' "$SEC" | grep -q 'cài design-loop'    && { bad "LUU-KHO-CT2: van con cum de nghi cai design-loop"; e5=1; }
printf '%s' "$SEC" | grep -q '/design-mockup'     && { bad "LUU-KHO-CT2: van con buoc DUNG doi /design-mockup"; e5=1; }
[ "$e5" -eq 0 ] && ok "LUU-KHO-CT2: nhanh UI tro design-pass OK"
grep -q 'Wire `executors.design`' "$ROOT/GUIDE.md" \
  && ok "LUU-KHO-CT2: GUIDE co muc wire executors.design OK" \
  || bad "LUU-KHO-CT2: GUIDE thieu muc wire executors.design"
# đối chứng dương ở mốc: cùng phép rút phải thấy hai cụm ÂM
TAGSKILL="$(mktemp)"; g show "$TAG:feature-loop/skills/feature-loop/SKILL.md" > "$TAGSKILL" 2>/dev/null
TSEC="$(lane_section "$TAGSKILL")"
if printf '%s' "$TSEC" | grep -q 'design-loop' && printf '%s' "$TSEC" | grep -q '/design-mockup'; then
  ok "LUU-KHO-CT2: tag co ca hai cum am OK"
  mut "đè đoạn của mốc lên bản sao → hai cụm âm quay lại, lưới trên sẽ ĐỎ"
else
  bad "LUU-KHO-CT2: tag khong co hai cum am — phep rut doc nham cho"
fi
rm -f "$TAGSKILL"

echo "== E6 · đối chứng GIỮ-GÂN =="
KEEP=(scripts/design-gate.mjs scripts/design-scan.js scripts/build-design-scan.mjs
      lib/design-detect.mjs lib/p-tiers.json vendor/impeccable tests/design-eval
      tests/skills skills/design-pass)
hash_head() { ( cd "$ROOT" && git ls-files -s -- "$1" | awk '{print $2, $4}' | sort ) ; }
hash_tag()  { g ls-tree -r "$TAG" -- "$1" | awk '{print $3, $4}' | sort ; }
k=0
for kp in "${KEEP[@]}"; do
  if [ "$(hash_head "$kp")" = "$(hash_tag "$kp")" ] && [ -n "$(hash_head "$kp")" ]; then
    echo "  OK   LUU-KHO-GIU: $kp con nguyen (byte-equal moc) OK"
    k=$((k + 1))
  else
    bad "LUU-KHO-GIU: $kp LECH tag"
  fi
done
echo "LUU-KHO-GIU: $k/${#KEEP[@]}"
[ "$k" -eq "${#KEEP[@]}" ] || bad "LUU-KHO-GIU: $k/${#KEEP[@]} vật giữ nguyên"
# ux-ui-craft: NGOẠI LỆ khai trước — đúng MỘT file được đổi
UXDIFF="$(g diff --name-only "$TAG" -- skills/ux-ui-craft | sort)"
if [ "$UXDIFF" = "skills/ux-ui-craft/references/layout-craft.md" ]; then
  if grep -q 'design-gate' "$ROOT/skills/ux-ui-craft/references/layout-craft.md" \
     && ! grep -q 'design-static-check' "$ROOT/skills/ux-ui-craft/references/layout-craft.md"; then
    ok "LUU-KHO-GIU: ux-ui-craft 1 file doi co khai, con lai byte-equal OK"
  else
    bad "LUU-KHO-GIU: layout-craft.md chua tro design-gate hoac con tro design-static-check"
  fi
else
  bad "LUU-KHO-GIU: ux-ui-craft doi khac khai (thay: $(echo "$UXDIFF" | tr '\n' ' '))"
fi
# chiều đỏ: xoá một dòng trong bản sao lib/design-detect.mjs
MD="$(mktemp -d)"; mkdir -p "$MD/lib"
sed '2d' "$ROOT/lib/design-detect.mjs" > "$MD/lib/design-detect.mjs"
if [ "$(git hash-object "$MD/lib/design-detect.mjs")" != "$(hash_tag lib/design-detect.mjs | awk '{print $1}')" ]; then
  mut "xoá 1 dòng trong bản sao lib/design-detect.mjs → băm LỆCH mốc đúng như mong đợi"
else
  bad "LUU-KHO-GIU: chieu do khong chay — ban sao bi sua ma bam van khop"
fi
rm -rf "$MD"

echo "== E8/E9 · ADR =="
ADR_NEW=(docs/adr/0008-luu-kho-harness-codex.md docs/adr/0009-khai-tu-nghi-le-design-loop.md)
a=0
for adr in "${ADR_NEW[@]}"; do
  if [ ! -f "$ROOT/$adr" ]; then
    bad "LUU-KHO-ADR: thieu $adr"
  elif ! grep -q "$TAG_SHA" "$ROOT/$adr"; then
    bad "LUU-KHO-ADR: $adr sha khong khop tag"
  elif ! grep -qi 'trigger mở lại\|Trigger mở lại\|TRIGGER' "$ROOT/$adr"; then
    bad "LUU-KHO-ADR: $adr thieu dong trigger mo lai"
  else
    echo "  OK   LUU-KHO-ADR: $adr ghim sha $TAG_SHA = tag OK"
    a=$((a + 1))
  fi
done
[ "$a" -eq 2 ] && ok "LUU-KHO-ADR: 2 ADR moi OK" || bad "LUU-KHO-ADR: chi $a/2 ADR dat"
# chiều đỏ: đổi một ký tự của sha trong bản sao
MA="$(mktemp)"; sed "s/$TAG_SHA/${TAG_SHA%?}0/" "$ROOT/${ADR_NEW[0]}" > "$MA"
grep -q "$TAG_SHA" "$MA" \
  && bad "LUU-KHO-ADR: chieu do khong chay — sha bi doi ma van khop" \
  || mut "đổi 1 ký tự sha trong bản sao ADR → không còn khớp mốc, lưới sẽ ĐỎ"
rm -f "$MA"
A1="$ROOT/docs/adr/0001-commit-plugins-mirror.md"
e9=0
[ -f "$A1" ]                        || { bad "LUU-KHO-ADR0001: bi xoa — su lieu phai giu"; e9=1; }
grep -qi 'superseded' "$A1"         || { bad "LUU-KHO-ADR0001: thieu dau superseded"; e9=1; }
grep -q '0008' "$A1"                || { bad "LUU-KHO-ADR0001: khong tro ADR luu-kho-Codex"; e9=1; }
[ "$e9" -eq 0 ] && ok "LUU-KHO-ADR0001: superseded + tro ADR moi OK"

echo "== E10 · bộ máy mirror =="
m=0
mirror_gone() {   # $1 nhãn, $2 biểu thức kiểm HEAD (0 = vắng)
  if eval "$2"; then
    bad "LUU-KHO-MIRROR: $1 van con o HEAD"
  else
    echo "  OK   LUU-KHO-MIRROR: $1 vang o HEAD, co o tag OK"; m=$((m + 1))
  fi
}
mirror_gone "plugins/"                       '[ -e "$ROOT/plugins" ]'
mirror_gone "scripts/sync-plugin-packages.sh" '[ -e "$ROOT/scripts/sync-plugin-packages.sh" ]'
mirror_gone "case P30"                        'grep -q "P30 plugins/ mirror" "$ROOT/tests/plugins/run-tests.sh"'
# Đọc KHOÁ THẬT, không grep chuỗi: config còn một chú thích giải thích vì sao
# khoá này chết, và grep chuỗi coi chú thích là khoá — đúng lớp "grep mù với
# comment" mà chính đề bài của eval này cảnh báo.
CFGKEYS="$(node -e '
  const fs = require("fs");
  const lines = fs.readFileSync(process.argv[1], "utf8").split("\n");
  const hit = lines.some(l => /^\s*mirror_sync\s*:/.test(l) && !l.trim().startsWith("#"));
  process.stdout.write(hit ? "mirror_sync" : "");
' "$ROOT/_acceptance/config.yaml")"
mirror_gone "khoa executors.script.mirror_sync" '[ -n "$CFGKEYS" ]'
mirror_gone "muc plugins/** trong t1_skip_globs" 'grep -q "plugins/\*\*" "$ROOT/_acceptance/config.yaml"'
echo "LUU-KHO-MIRROR: $m/5"
[ "$m" -eq 5 ] || bad "LUU-KHO-MIRROR: $m/5 vật đã gỡ"
# Chân QUAN HỆ: không suite_key nào trỏ khoá đã chết (lớp gỡ-một-nửa)
DEAD="$(node -e '
  const fs = require("fs");
  const t = fs.readFileSync(process.argv[1], "utf8").split("\n");
  const keys = new Set(), refs = [];
  let inSuite = false, path = [];
  for (const raw of t) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const ind = raw.length - raw.trimStart().length, line = raw.trim();
    if (line.startsWith("- executors.")) { if (inSuite) refs.push(line.slice(2)); continue; }
    if (line.startsWith("-")) continue;
    inSuite = line.startsWith("suite_keys:");
    const key = line.split(":")[0];
    path = path.slice(0, ind / 2); path[ind / 2] = key;
    keys.add(path.slice(0, ind / 2 + 1).join("."));
  }
  process.stdout.write(refs.filter(r => !keys.has(r)).join(","));
' "$ROOT/_acceptance/config.yaml")"
[ -z "$DEAD" ] \
  && ok "LUU-KHO-MIRROR: suite_keys khong tro khoa da chet OK" \
  || bad "LUU-KHO-MIRROR: suite_keys tro khoa da chet: $DEAD"
# chiều đỏ: chép lại khoá mirror_sync vào bản sao config
MC="$(mktemp)"; { cat "$ROOT/_acceptance/config.yaml"; echo '    mirror_sync: "bash scripts/sync-plugin-packages.sh --check"'; } > "$MC"
grep -q 'mirror_sync' "$MC" \
  && mut "chép lại khoá mirror_sync vào bản sao config → lưới sẽ ĐỎ đích danh" \
  || bad "LUU-KHO-MIRROR: chieu do khong chay"
rm -f "$MC"

echo "== E10b · CLAUDE.md =="
CM_HEAD="$( (grep -c 'sync-plugin-packages\|build mirror' "$ROOT/CLAUDE.md") || true)"
CM_TAG="$(g show "$TAG:CLAUDE.md" | grep -c 'sync-plugin-packages\|build mirror' || true)"
if [ "$CM_HEAD" -eq 0 ] && [ "$CM_TAG" -gt 0 ]; then
  ok "LUU-KHO-MIRROR: CLAUDE.md khong con bat bien mirror OK (tag=$CM_TAG)"
else
  bad "LUU-KHO-MIRROR: CLAUDE.md HEAD=$CM_HEAD tag=$CM_TAG"
fi

echo "== E11b · start-scan CHẠY THẬT =="
SS="$(cd "$ROOT" && node scripts/start-scan.mjs --root . 2>&1)"; SS_RC=$?
if [ "$SS_RC" -eq 0 ] && printf '%s' "$SS" | grep -q '"schema_version"' && ! printf '%s' "$SS" | grep -q 'ENOENT'; then
  ok "LUU-KHO-START-SCAN: chay sach OK"
else
  bad "LUU-KHO-START-SCAN: rc=$SS_RC out=$(printf '%s' "$SS" | head -c 200)"
fi

echo "== E15 · bộ kiểm không có khối thoát-sớm giữa tệp =="
# Một bản sao của khối tổng kết đuôi nằm lạc ở giữa tệp từng nuốt 46 ca cuối mỗi
# khi có ca đỏ phía trước, mà dòng tổng kết in ra vẫn trông bình thường.
LAST_EXIT="$(grep -n '^  exit 1$' "$ROOT/tests/plugins/run-tests.sh" | tail -1 | cut -d: -f1)"
TOTAL_LINES="$(wc -l < "$ROOT/tests/plugins/run-tests.sh")"
N_EXIT="$(grep -c '^  exit 1$' "$ROOT/tests/plugins/run-tests.sh" || true)"
if [ "$N_EXIT" -eq 1 ] && [ "$((TOTAL_LINES - LAST_EXIT))" -lt 10 ]; then
  ok "LUU-KHO-SUITE: chi 1 khoi thoat, nam o duoi tep OK"
else
  bad "LUU-KHO-SUITE: co $N_EXIT khoi thoat, cai cuoi o dong $LAST_EXIT/$TOTAL_LINES — khoi giua tep nuot ca"
fi

echo
if [ "$fails" -gt 0 ]; then
  echo "LUU-KHO-RANG: $fails phép đo ĐỎ"
  exit 1
fi
echo "LUU-KHO-RANG: tất cả phép đo xanh"
exit 0
