#!/usr/bin/env bash
# Răng hồ sơ start-bang-dieu-khien — CHẾT THEO HỒ SƠ khi merge, không vào suite
# vĩnh viễn. Sáu chân, mỗi chân neo vào một thứ mà suite chung KHÔNG nên ghim:
#   at            — sự thật của CÂY hôm nay (57 hồ sơ ra được ngày)
#   veto-ten      — sự thật của CÂY hôm nay (tập hồ sơ cửa veto mở)
#   dang-thuc     — đẳng thức máy-quét == lưới, phải dựng kho git riêng
#   bon-bo-doc    — bốn bộ đọc trên cùng một hồ sơ, round-trip WRITER→READER
#   ahead-behind  — thang so bản chung, phải dựng kho git có remote
#   sort-tuoi     — mốc rỗng xếp cuối + tuổi trùng
#
# Luật đo của repo áp cho MỌI chân: fixture do CODE SINH trong chính lần chạy;
# đường dẫn suy từ VỊ TRÍ SCRIPT, không hardcode; mỗi chân chạy ĐỐI CHỨNG DƯƠNG
# trước rồi mới phá vật thật, và đòi ĐỎ kèm THÔNG ĐIỆP GHIM — không tin mã thoát.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1
FAILS=0
do_fail() { echo "DO: $1"; FAILS=$((FAILS+1)); }
CHAN=""
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) CHAN="${2:-}"; shift 2 ;;
    *) echo "rang-bdk: tham so la $1 — chi nhan --chan <ten>"; exit 2 ;;
  esac
done
[ -n "$CHAN" ] || { echo "rang-bdk: thieu --chan"; exit 2; }

SCAN="$ROOT/scripts/start-scan.mjs"
PREMERGE="$ROOT/scripts/pre-merge-check.sh"
GATECARD="$ROOT/scripts/gate-card.js"
TMPS=()
mk() { local d; d="$(mktemp -d)"; TMPS+=("$d"); printf '%s' "$d"; }
cleanup() { for d in "${TMPS[@]:-}"; do [ -n "$d" ] && rm -rf "$d"; done; }
trap cleanup EXIT

# Bản sao cây plugin de dot bien ma khong cham cay that
plugin_copy() {
  local d="$1"
  mkdir -p "$d/scripts" "$d/lib" "$d/skills/acceptance/references"
  cp -R "$ROOT/scripts/." "$d/scripts/"
  cp -R "$ROOT/lib/." "$d/lib/"
  cp -R "$ROOT/skills/acceptance/references/." "$d/skills/acceptance/references/"
}

# git fixture: kho that, commit that, khong goi mang
git_init() {
  local d="$1"
  git -C "$d" init -q
  git -C "$d" config user.email t@t
  git -C "$d" config user.name t
}
gcommit() { git -C "$1" add -A >/dev/null 2>&1; git -C "$1" commit -q -m "${2:-x}" --allow-empty; }

contract() {  # <status> <veto_state|-> <approved_by|->
  printf -- '---\nschema_version: 1\nfeature: viec %s\nslug: %s\nowner: o@x\nrisk_tier: T2\nsurfaces: [cli]\nstatus: %s\napproved_by: %s\napproved_at: 2026-01-01T00:00:00Z\n' \
    "$2" "$2" "$1" "$([ "$4" = "-" ] && echo "" || echo "$4")"
  [ "$3" = "-" ] || printf 'veto_state: %s\nveto_opened_at: 2026-01-01T00:00:00Z\n' "$3"
  printf -- '---\n\n# Acceptance Contract: %s\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- a\n- b\n' "$2"
}

# ════════════════════════════════════════════════════════════════════════════
case "$CHAN" in

# ── at: thang ngay tren CAY THAT + fixture ba nac ───────────────────────────
at)
  N_NULL="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const n=j.groups.done.filter(d=>d.at===null).length;
    console.log(j.groups.done.length+" "+n);' "$SCAN" "$ROOT")"
  TONG="${N_NULL% *}"; NULLS="${N_NULL#* }"
  [ "$TONG" -ge 50 ] || do_fail "san dem: chi $TONG ho so da dong tren cay that — phep do chua chay"
  [ "$NULLS" -eq 0 ] || do_fail "co $NULLS ho so khong ra duoc ngay (mong 0)"

  # ba nac tren fixture code-sinh
  D="$(mk)"; git_init "$D"; mkdir -p "$D/_acceptance/w"
  echo 'schema_version: 1' > "$D/_acceptance/config.yaml"
  contract signed-off w - A > "$D/_acceptance/w/contract.md"
  printf -- '---\nschema_version: 2\nfeature_slug: w\nverdict: PASS\nhuman_signoff: Ai Do 2026-05-05\n---\n\n# Evidence Report: w\n' > "$D/_acceptance/w/evidence-report.md"
  gcommit "$D" c1
  nac() { node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const w=(j.groups.done||[]).find(x=>x.slug==="w");
    console.log(w?String(w.at):"KHONG-O-DONE");' "$1" "$D"; }
  [ "$(nac "$SCAN")" = "2026-05-05" ] || do_fail "nac 1 (human_signoff): duoc $(nac "$SCAN"), mong 2026-05-05"
  # nac 2: go chu ky, them decided_at cua opportunity
  printf -- '---\nschema_version: 2\nfeature_slug: w\nverdict: PASS\nhuman_signoff:\n---\n\n# Evidence Report: w\n' > "$D/_acceptance/w/evidence-report.md"
  printf -- '---\nschema_version: 1\nslug: w\nfeature: w\nstage: decided\ndecision: park\ndecided_at: 2026-04-04T00:00:00Z\n---\n\n## Van de & ai gap\n\nMot cau.\n' > "$D/_acceptance/w/opportunity.md"
  [ "$(nac "$SCAN")" = "2026-04-04" ] || do_fail "nac 2 (decided_at): duoc $(nac "$SCAN"), mong 2026-04-04"
  # nac 3: go ca hai, con commit
  rm "$D/_acceptance/w/opportunity.md"
  gcommit "$D" c2
  GITDAY="$(git -C "$D" log -1 --format=%cs)"
  [ "$(nac "$SCAN")" = "$GITDAY" ] || do_fail "nac 3 (git %cs): duoc $(nac "$SCAN"), mong $GITDAY"
  # CHIEU DO: ban sao go nac 3 -> phai ra null, KHONG duoc muon mtime bia moc
  M="$(mk)"; plugin_copy "$M"
  perl -0pi -e "s/^const ngayXong = \(dir, anchorPath\) => \{/const ngayXong = (dir, anchorPath) => { if (1) return null;/m" "$M/scripts/start-scan.mjs"
  grep -qF 'if (1) return null;' "$M/scripts/start-scan.mjs" || do_fail "dot bien khong doi duoc dong nao"
  [ "$(nac "$M/scripts/start-scan.mjs")" = "null" ] || do_fail "go thang ma van ra ngay ($(nac "$M/scripts/start-scan.mjs")) — co loi bia moc"
  [ "$FAILS" -eq 0 ] && echo "OK [at] — cay that $TONG ho so, 0 null; ba nac dung tren fixture; go thang -> null, khong bia moc"
  ;;

# ── veto-ten: tap ho so cua veto mo, dung vi tu cua luoi ────────────────────
veto-ten)
  # bash 3.2 (mac dinh tren macOS) khong co chi so am cho mang — giu duong dan
  # vao mot bien thay vi doc nguoc mang TMPS.
  SD="$(mk)"
  node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log((j.vetoOpen||[]).map(v=>v.slug).sort().join("\n"));' "$SCAN" "$ROOT" > "$SD/scan.txt"
  grep -l '^veto_state:[[:space:]]*mo' "$ROOT"/_acceptance/*/contract.md 2>/dev/null \
    | sed 's|.*/_acceptance/||; s|/contract.md||' | sort > "$SD/grep.txt"
  if ! diff -q "$SD/scan.txt" "$SD/grep.txt" >/dev/null; then
    do_fail "tap vetoOpen != tap grep veto_state: mo"; diff "$SD/scan.txt" "$SD/grep.txt" | head -6
  fi
  N="$(wc -l < "$SD/scan.txt" | tr -d ' ')"
  [ "$N" -ge 1 ] || do_fail "san dem: tap rong, phep do chua chay"
  # QUAN HE phan biet ban sua voi ban cu: phai co >=1 ho so signed-off trong tap.
  # KHONG ghim con so — no da troi 14 -> 16 trong dung mot ngay.
  NSO="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log((j.vetoOpen||[]).filter(v=>v.status==="signed-off").length);' "$SCAN" "$ROOT")"
  [ "$NSO" -ge 1 ] || do_fail "tap vetoOpen khong co ho so signed-off nao — nhanh cu mu dung cho do, ban nay chua sua"
  # CHIEU DO: thu ve nhanh verified nhu ban cu
  M="$(mk)"; plugin_copy "$M"
  # Dot bien: thu vetoOpen ve nhanh `verified` nhu ban CU. Doc status bang
  # frontmatterField ngay tai cho — bien `status` khai SAU cho nay (cua veto hoi
  # TRUOC chot status hong), nen dung bien la ban sao chet vi ReferenceError chu
  # khong vi vat, va ca do hoa xanh-khong-chay.
  perl -0pi -e "s/if \(\(frontmatterField\(cTxt, 'veto_state'\) \|\| ''\)\.trim\(\)\.toLowerCase\(\) === 'mo'\)/if ((frontmatterField(cTxt, 'status') || '').toLowerCase() === 'verified' \&\& (frontmatterField(cTxt, 'veto_state') || '').trim().toLowerCase() === 'mo')/" "$M/scripts/start-scan.mjs"
  grep -qF "=== 'verified' &&" "$M/scripts/start-scan.mjs" || do_fail "dot bien khong doi duoc dong nao"
  NMUT="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log((j.vetoOpen||[]).length);' "$M/scripts/start-scan.mjs" "$ROOT")"
  [ "$NMUT" -lt "$N" ] || do_fail "thu ve nhanh verified ma tap khong nho di ($NMUT vs $N) — phep do khong phan biet duoc"
  [ "$FAILS" -eq 0 ] && echo "OK [veto-ten] — $N ho so, tap == grep, $NSO ho so signed-off co mat; thu ve verified -> $NMUT (do)"
  ;;

# ── dang-thuc: may quet == luoi tren CUNG mot kho git ───────────────────────
dang-thuc)
  D="$(mk)"; git_init "$D"
  mkdir -p "$D/_acceptance"
  echo 'schema_version: 1' > "$D/_acceptance/config.yaml"
  # Hai ho so veto mo o HAI status khac nhau — dung cho nhanh cu mu
  mkdir -p "$D/_acceptance/a-verified" "$D/_acceptance/b-signed" "$D/_acceptance/c-sach"
  contract verified  a-verified mo A > "$D/_acceptance/a-verified/contract.md"
  printf -- '---\nschema_version: 2\nfeature_slug: a-verified\nverdict: PASS\nhuman_signoff:\n---\n\n# Evidence Report: a\n' > "$D/_acceptance/a-verified/evidence-report.md"
  contract signed-off b-signed  mo A > "$D/_acceptance/b-signed/contract.md"
  contract draft      c-sach    -  -  > "$D/_acceptance/c-sach/contract.md"
  gcommit "$D" base
  BASE="$(git -C "$D" rev-parse HEAD)"

  dem_scan() { node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log((j.vetoOpen||[]).map(v=>v.slug).sort().join(","));' "$SCAN" "$D"; }
  dem_luoi() { bash "$PREMERGE" "$D" --base "$BASE" 2>&1 | grep 'cửa veto đang mở' \
    | sed 's/.*chưa veto://' | tr ' ' '\n' | grep -v '^$' | sort | paste -sd, - ; }

  S1="$(dem_scan)"; L1="$(dem_luoi)"
  [ "$S1" = "$L1" ] || do_fail "doi chung duong LECH — may quet [$S1] vs luoi [$L1]"
  case "$S1" in *a-verified*) ;; *) do_fail "fixture mu: thieu ho so verified" ;; esac
  case "$S1" in *b-signed*) ;; *) do_fail "fixture mu: thieu ho so signed-off (dung nhanh cu mu)" ;; esac

  # PHA THU: them mot ho so veto_state: mo -> CA HAI phai cung tang dung 1
  N1="$(printf '%s' "$S1" | tr ',' '\n' | grep -c .)"
  mkdir -p "$D/_acceptance/d-them"
  contract verified d-them mo A > "$D/_acceptance/d-them/contract.md"
  printf -- '---\nschema_version: 2\nfeature_slug: d-them\nverdict: PASS\nhuman_signoff:\n---\n\n# Evidence Report: d\n' > "$D/_acceptance/d-them/evidence-report.md"
  gcommit "$D" them
  S2="$(dem_scan)"; L2="$(dem_luoi)"
  N2="$(printf '%s' "$S2" | tr ',' '\n' | grep -c .)"
  M2="$(printf '%s' "$L2" | tr ',' '\n' | grep -c .)"
  [ "$S2" = "$L2" ] || do_fail "sau khi them: may quet [$S2] vs luoi [$L2] — lech"
  [ "$N2" -eq $((N1+1)) ] || do_fail "may quet khong tang dung 1: $N1 -> $N2"
  [ "$M2" -eq $((N1+1)) ] || do_fail "luoi khong tang dung 1: $N1 -> $M2"

  # CHIEU DO: ban sao bo mot ho so khoi vetoOpen -> dang thuc phai vo
  M="$(mk)"; plugin_copy "$M"
  perl -0pi -e "s/^      vetoOpen\.push\(/      if (slug !== 'b-signed') vetoOpen.push(/m" "$M/scripts/start-scan.mjs"
  grep -qF "if (slug !== 'b-signed') vetoOpen.push(" "$M/scripts/start-scan.mjs" || do_fail "dot bien khong doi duoc dong nao"
  SM="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log((j.vetoOpen||[]).map(v=>v.slug).sort().join(","));' "$M/scripts/start-scan.mjs" "$D")"
  [ "$SM" != "$L2" ] || do_fail "bo mot ho so ma dang thuc van dung — phep do khong song"
  case "$SM" in *b-signed*) do_fail "dot bien khong co tac dung" ;; esac

  [ "$FAILS" -eq 0 ] && echo "OK [dang-thuc] — may quet == luoi tren cung kho git ($N1 -> $N2, ca hai cung tang 1); bo mot ho so -> dang thuc vo"
  ;;

# ── bon-bo-doc: bon bo doc tren cung mot ho so, round-trip WRITER->READER ───
bon-bo-doc)
  TPL="$ROOT/skills/acceptance/references/evidence-report-template.md"
  [ -f "$TPL" ] || { echo "DO: khong thay khuon cua ben VIET: $TPL"; exit 1; }
  # Fixture KHONG duoc test tu go theo khuon ma ben DOC dang cho. Hai nguon that:
  #   (1) khuon frontmatter cua ben VIET — bon khoa duoi day CO trong khuon.
  #   (2) mot HO SO THAT trong cay ma may quet xep «may di tiep» — manh hon dung
  #       lai tu khuon, vi no la thu ben VIET da sinh ra that.
  # GHI SO: hai muc «Known limits» / «Ngoài hợp đồng» ma ben DOC doi (sau dieu
  # kien xanh-sach) KHONG co trong khuon writer — chung chi song trong van xuoi
  # skill. Do la mot seam viet<->doc thieu mot-nguon, NGOAI pham vi vong nay
  # (thuoc o ra-co-ten-lam-va-trao); ghi thanh finding ngoai hop dong o Cong 2.
  for k in 'verdict:' 'bypass_used:' 'enforcement_mode:' 'human_signoff:'; do
    grep -q "^$k" "$TPL" || do_fail "khuon writer thieu khoa '$k' — round-trip vo, fixture dang go tay"
  done
  [ "$FAILS" -eq 0 ] || { echo "DO: khuon writer khong dung duoc lam nguon"; exit 1; }

  # Chon HO SO THAT: hoi chinh may quet xem cai nao dang la «may di tiep»
  SRC="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const h=(j.groups.done||[]).find(d=>/^may-di-tiep/.test(d.stateKey));
    console.log(h?h.slug:"");' "$SCAN" "$ROOT")"
  [ -n "$SRC" ] || { echo "DO: cay khong co ho so «may di tiep» nao — phep do khong co vat that de neo"; exit 1; }

  D="$(mk)"; git_init "$D"; mkdir -p "$D/_acceptance/x"
  echo 'schema_version: 1' > "$D/_acceptance/config.yaml"
  cp "$ROOT/_acceptance/$SRC/contract.md" "$D/_acceptance/x/contract.md"
  cp "$ROOT/_acceptance/$SRC/evidence-report.md" "$D/_acceptance/x/evidence-report.md"
  # doi slug trong frontmatter cho khop thu muc; KHONG cham gi khac
  perl -0pi -e "s/^slug: .*$/slug: x/m" "$D/_acceptance/x/contract.md"
  perl -0pi -e "s/^feature_slug: .*$/feature_slug: x/m" "$D/_acceptance/x/evidence-report.md"
  # Bao dam khoa sap bi pha CO MAT. Khong ho so «may di tiep» nao cung khai
  # bypass_used (khoa mac dinh false nen ban ghi co the bo qua), va khi no vang
  # thi lenh tiem ben duoi im lang khong doi gi — PHEP PHA HOA VO HIEU, doi
  # chung duong xanh gia. Khoa nay do khuon ben VIET khai (da kiem o tren) nen
  # them vao la hop le, khong phai bia.
  grep -q '^bypass_used:' "$D/_acceptance/x/evidence-report.md" \
    || perl -0pi -e "s/^verdict:/bypass_used: false\nverdict:/m" "$D/_acceptance/x/evidence-report.md"
  grep -q '^bypass_used:' "$D/_acceptance/x/evidence-report.md" \
    || do_fail "khong dat duoc khoa bypass_used vao fixture — phep pha se vo hieu"
  gcommit "$D" c1

  doc_scan() { node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const it=[...(j.groups.gates||[]),...(j.groups.inProgress||[]),...(j.groups.done||[])].find(x=>x.slug==="x");
    console.log(it?it.stateKey:"KHONG-THAY");' "${1:-$SCAN}" "$D"; }
  doc_card() { node "${1:-$GATECARD}" --root "$D" --slug x --gate 2 2>/dev/null; }
  # Truyen qua BIEN MOI TRUONG, khong qua argv: product-map.mjs co chot isMain so
  # process.argv[1] voi chinh no, nen dat duong dan cua no vao argv lam no tuong
  # dang chay nhu lenh chinh roi bat loi "tham so la".
  doc_map()  { PM="$ROOT/scripts/product-map.mjs" FX="$D" node -e '
    (async()=>{const {renderProductMap}=await import("file://"+process.env.PM);
      const t=renderProductMap(process.env.FX);
      const m=t.match(/^## (.+)$/gm)||[];
      console.log(m.filter(h=>{const i=t.indexOf(h);const nx=t.indexOf("\n## ",i+1);
        return /`x`/.test(t.slice(i,nx<0?undefined:nx));}).join("|")||"KHONG-O-DAU");
    })();'; }

  # ── SACH + veto mo: 0/3 bo doc co vi tu duoc moi ky ──
  ST="$(doc_scan)"
  [ "$ST" = "may-di-tiep-veto-mo" ] || do_fail "may quet: mong may-di-tiep-veto-mo tren ho so THAT ($SRC), duoc $ST"
  H="$(doc_card)"
  printf '%s' "$H" | grep -qF 'Ký duyệt' && do_fail "the cong MOI KY mot ho so may da di tiep"
  printf '%s' "$H" | grep -qF 'ký nhanh' && do_fail "the cong con chu 'ky nhanh' cho ho so xanh-sach"
  printf '%s' "$H" | grep -qF 'máy đi tiếp — cửa veto còn mở' || do_fail "the cong khong in chu cua bang"
  # Soi CA THE, khong chi chip va nut: round 1 cua S4 bat duoc mot ho so ma chip
  # noi «may da di tiep» con khoi VIEC-CUA-ANH van dan «Ky hay tra» — mau thuan
  # ngay trong chinh the. Do het moi loi moi-ky.
  for needle in 'Ký hay trả' 'ký hay trả: ___' 'Ký duyệt' 'ký nhanh'; do
    printf '%s' "$H" | grep -qF "$needle" && do_fail "the con loi moi ky «$needle» cho ho so may da di tiep"
  done
  printf '%s' "$H" | grep -qF 'veto hay để yên' || do_fail "the khong dua ra loi VETO thay cho loi ky"
  # Bo doc thu ba (bang trang thai) la THAN LENH — model thi hanh, khong co
  # renderer de doc dau ra. Do CHI DAN bang grep la hinh dang (1) cua luat
  # «thuoc phai gan vao vat duoc giao». Nen do DUNG DUONG DU LIEU ma chinh chi
  # dan khai: no bao chay may quet roi in `label`/`viecKe` NGUYEN VAN, vay mo
  # phong dung buoc do va assert chu ra bang chu cua BANG.
  AS_MD="$ROOT/commands/acceptance-status.md"
  grep -q 'STATUS-NHAN' "$AS_MD" || do_fail "bang trang thai khong con khoi STATUS-NHAN"
  grep -q 'start-scan.mjs' "$AS_MD" || do_fail "bang trang thai khong doc tu may quet"
  grep -qF '`label` NGUYÊN VĂN' "$AS_MD" || do_fail "bang trang thai khong dan in label nguyen van"
  AS_OUT="$(BANG="$ROOT/scripts/trang-thai-ho-so.cjs" node -e '
    const {execFileSync}=require("child_process");
    const B=require(process.env.BANG);
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const it=[...(j.groups.gates||[]),...(j.groups.inProgress||[]),...(j.groups.done||[])].find(x=>x.slug==="x");
    if(!it){console.log("KHONG-THAY");process.exit(0);}
    const c=B.TRANG_THAI[it.stateKey];
    // dung ba cot ma than lenh dan in: Tinh trang | Viec ke | co moi ky khong
    console.log((it.label===c.nhan&&it.viecKe===c.viecKe?"KHOP-BANG":"LECH-BANG")+"|"+it.label);
  ' "$SCAN" "$D")"
  case "$AS_OUT" in
    KHOP-BANG\|*) ;;
    *) do_fail "bo doc bang trang thai: chu khong rut tu bang ($AS_OUT)" ;;
  esac
  printf '%s' "$AS_OUT" | grep -qF 'máy đi tiếp' || do_fail "bo doc bang trang thai in chu moi ky cho ho so may da di tiep: $AS_OUT"
  MAP1="$(doc_map)"
  case "$MAP1" in *"Đang làm"*) ;; *) do_fail "ban do: mong o «Đang làm», duoc $MAP1" ;; esac

  # ── DOI CHUNG DUONG: pha vat that (bypass_used) -> 3/3 PHAI moi ky ──
  perl -0pi -e "s/^bypass_used:.*$/bypass_used: true/m" "$D/_acceptance/x/evidence-report.md"
  grep -q '^bypass_used: true' "$D/_acceptance/x/evidence-report.md" \
    || do_fail "dot bien khong doi duoc dong nao — phep pha vat that vo hieu"
  ST2="$(doc_scan)"
  [ "$ST2" = "cho-cong-bang-chung" ] || do_fail "doi chung duong: chua sach ma may quet noi $ST2"
  HC="$(doc_card)"
  for needle in 'Ký duyệt' 'Ký hay trả' 'ký hay trả: ___'; do
    printf '%s' "$HC" | grep -qF "$needle" || do_fail "doi chung duong: ho so CHUA sach ma the thieu loi ky «$needle» — phep do chua bao gio chay"
  done
  MAP2="$(doc_map)"
  [ "$MAP1" = "$MAP2" ] || do_fail "ban do doi o giua hai chieu ($MAP1 -> $MAP2) — no co y KHONG mang vi tu"
  AS_OUT2="$(BANG="$ROOT/scripts/trang-thai-ho-so.cjs" node -e '
    const {execFileSync}=require("child_process");
    const B=require(process.env.BANG);
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const it=[...(j.groups.gates||[]),...(j.groups.inProgress||[]),...(j.groups.done||[])].find(x=>x.slug==="x");
    if(!it){console.log("KHONG-THAY");process.exit(0);}
    const c=B.TRANG_THAI[it.stateKey];
    console.log((it.label===c.nhan?"KHOP-BANG":"LECH-BANG")+"|"+it.label);
  ' "$SCAN" "$D")"
  printf '%s' "$AS_OUT2" | grep -qF 'chờ chữ ký — Cổng Bằng chứng' \
    || do_fail "doi chung duong: bo doc bang trang thai khong doi sang chu moi ky khi ho so chua sach ($AS_OUT2)"
  [ "$AS_OUT" != "$AS_OUT2" ] || do_fail "bo doc bang trang thai cho CUNG mot chu o ca hai chieu — no khong phan biet duoc"
  perl -0pi -e "s/^bypass_used:.*$/bypass_used: false/m" "$D/_acceptance/x/evidence-report.md"
  [ "$(doc_scan)" = "may-di-tiep-veto-mo" ] || do_fail "khoi phuc vat that that bai"

  # ── CHIEU DO 1: go mot khoa khoi khuon WRITER -> phai neu ten khoa ──
  M="$(mk)"; plugin_copy "$M"
  perl -0pi -e 's/^bypass_used:.*$//m' "$M/skills/acceptance/references/evidence-report-template.md"
  grep -q '^bypass_used:' "$M/skills/acceptance/references/evidence-report-template.md" \
    && do_fail "chieu do 1: dot bien khong go duoc khoa khoi khuon writer"
  OUT1="$(TPLDIR="$M" bash "$ROOT/_acceptance/start-bang-dieu-khien/rang-bdk.sh" --chan bon-bo-doc-tpl 2>&1)"
  printf '%s' "$OUT1" | grep -qF "khuon writer thieu khoa 'bypass_used:'" \
    || do_fail "chieu do 1: go khoa khoi khuon writer ma khong do neu ten khoa (duoc: $OUT1)"

  # ── CHIEU DO 2: the cong khoi phuc chip vo dieu kien -> moi ky lai ──
  perl -0pi -e "s/const MAY_DI_TIEP = .*/const MAY_DI_TIEP = false;/" "$M/scripts/gate-card.js"
  grep -qF 'const MAY_DI_TIEP = false;' "$M/scripts/gate-card.js" || do_fail "chieu do 2: dot bien khong doi duoc dong nao"
  printf '%s' "$(doc_card "$M/scripts/gate-card.js")" | grep -qF 'Ký duyệt' \
    || do_fail "chieu do 2: khoi phuc chip vo dieu kien ma the van khong moi ky — phep do khong song"

  # ── CHIEU DO 3: may quet chet -> the giu hanh vi cu KEM co vang ──
  M3="$(mk)"; plugin_copy "$M3"
  echo 'process.exit(3)' >> "$M3/scripts/start-scan.mjs"
  H3="$(doc_card "$M3/scripts/gate-card.js")"
  printf '%s' "$H3" | grep -qF 'Chưa đọc được trạng thái làn V' || do_fail "chieu do 3: may quet chet ma the KHONG bat co vang — im lang tuyen sach"
  printf '%s' "$H3" | grep -qF 'Ký duyệt' || do_fail "chieu do 3: may quet chet ma the khong giu hanh vi cu"

  [ "$FAILS" -eq 0 ] && echo "OK [bon-bo-doc] — neo vao HO SO THAT ($SRC); sach+veto-mo: 0/3 bo doc co vi tu moi ky; pha vat that: 3/3 moi ky; ban do dung yen ca hai chieu; 3 chieu do song"
  ;;

# ── bon-bo-doc-tpl: chi kiem khuon WRITER (chieu do 1 goi lai chinh minh) ───
bon-bo-doc-tpl)
  TPL="${TPLDIR:-$ROOT}/skills/acceptance/references/evidence-report-template.md"
  for k in 'verdict:' 'bypass_used:' 'enforcement_mode:' 'human_signoff:'; do
    grep -q "^$k" "$TPL" || do_fail "khuon writer thieu khoa '$k' — round-trip vo, fixture dang go tay"
  done
  [ "$FAILS" -eq 0 ] && echo "OK [bon-bo-doc-tpl]"
  ;;

# ── ahead-behind: thang so BAN CHUNG truoc, khong goi mang ──────────────────
ahead-behind)
  U="$(mk)"; git_init "$U"; mkdir -p "$U/_acceptance"; echo 'schema_version: 1' > "$U/_acceptance/config.yaml"
  gcommit "$U" u1; git -C "$U" branch -M main
  gj() { node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log(JSON.stringify(j.git));' "${2:-$SCAN}" "$1"; }
  val() { printf '%s' "$1" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(String(JSON.parse(s)[process.argv[1]])));' "$2"; }

  # chan 1: co origin/main, nhanh lui 1 commit
  C="$(mk)"; git clone -q "$U" "$C"
  gcommit "$U" u2
  git -C "$C" fetch -q origin
  J1="$(gj "$C")"
  [ "$(val "$J1" behind)" = "1" ] || do_fail "chan 1: behind mong 1, duoc $(val "$J1" behind)"
  [ "$(val "$J1" compareRef)" = "origin/main" ] || do_fail "chan 1: compareRef mong origin/main, duoc $(val "$J1" compareRef)"

  # chan 2: nhanh tinh nang DA PUSH va KHOP nhanh tren cung cua no, nhung ban chung di truoc 2
  git -C "$C" checkout -qb feat
  git -C "$C" push -q origin feat 2>/dev/null
  git -C "$C" branch --set-upstream-to=origin/feat feat >/dev/null 2>&1
  gcommit "$U" u3
  git -C "$C" fetch -q origin
  J2="$(gj "$C")"
  [ "$(val "$J2" compareRef)" = "origin/main" ] || do_fail "chan 2: phai so BAN CHUNG truoc, duoc $(val "$J2" compareRef)"
  B2="$(val "$J2" behind)"
  [ "$B2" -ge 2 ] || do_fail "chan 2: behind mong >= 2 (ban chung di truoc), duoc $B2"

  # chan 3: khong co origin/main, chi co nhanh tren cung -> @{u}
  git -C "$C" push -q origin --delete main 2>/dev/null
  git -C "$C" fetch -q --prune origin 2>/dev/null
  git -C "$C" update-ref -d refs/remotes/origin/main 2>/dev/null
  git -C "$C" update-ref -d refs/remotes/origin/HEAD 2>/dev/null
  J3="$(gj "$C")"
  [ "$(val "$J3" compareRef)" = "@{u}" ] || do_fail "chan 3: mong @{u} lam nac cuoi, duoc $(val "$J3" compareRef)"

  # chan 4: khong remote nao -> null CA BA, KHONG phai 0
  N="$(mk)"; git_init "$N"; mkdir -p "$N/_acceptance"; echo 'schema_version: 1' > "$N/_acceptance/config.yaml"; gcommit "$N" n1
  J4="$(gj "$N")"
  for k in ahead behind compareRef; do
    [ "$(val "$J4" "$k")" = "null" ] || do_fail "chan 4: $k mong null (chua biet), duoc $(val "$J4" "$k") — 0 la 'da khop', khac han"
  done

  # chan 5: 0 luot goi mang — remote tro duong dan khong ton tai, do bang dong ho
  git -C "$N" remote add origin /khong/ton/tai/repo.git
  T0="$(date +%s)"; GIT_TERMINAL_PROMPT=0 node "$SCAN" --root "$N" >/dev/null 2>&1; RC=$?; T1="$(date +%s)"
  [ "$RC" -eq 0 ] || do_fail "chan 5: remote hong lam may quet chet (exit $RC)"
  [ $((T1-T0)) -le 5 ] || do_fail "chan 5: mat $((T1-T0))s — co ve dang goi mang"

  # chan 6 (van ban): than lenh dan noi khi behind > 0 va noi 'chua biet' khi null
  grep -qF 'đang sau bản chung' "$ROOT/commands/start.md" || do_fail "chan 6: start.md khong dan noi khi cay sau ban chung"
  grep -qF 'chưa so được với bản' "$ROOT/commands/start.md" || do_fail "chan 6: start.md khong dan noi 'chua biet' khi khong so duoc"

  # CHIEU DO: dao thang (uu tien @{u}) -> chan 2 phai do
  M="$(mk)"; plugin_copy "$M"
  perl -0pi -e "s/for \(const cand of \[head, 'origin\/main', 'origin\/master', '\@\{u\}'\]\)/for (const cand of ['\@{u}', head, 'origin\/main', 'origin\/master'])/" "$M/scripts/start-scan.mjs"
  grep -qF "for (const cand of ['@{u}'," "$M/scripts/start-scan.mjs" || do_fail "dot bien khong doi duoc dong nao"
  C2="$(mk)"; git clone -q "$U" "$C2"; git -C "$C2" checkout -qb feat2
  git -C "$C2" push -q origin feat2 2>/dev/null; git -C "$C2" branch --set-upstream-to=origin/feat2 feat2 >/dev/null 2>&1
  gcommit "$U" u4; git -C "$C2" fetch -q origin
  JM="$(gj "$C2" "$M/scripts/start-scan.mjs")"
  [ "$(val "$JM" compareRef)" = "@{u}" ] || do_fail "chieu do: dao thang ma compareRef khong doi ($(val "$JM" compareRef))"
  [ "$(val "$JM" behind)" = "0" ] || do_fail "chieu do: dao thang phai noi doi 'behind 0' (khop nhanh rieng), duoc $(val "$JM" behind)"

  [ "$FAILS" -eq 0 ] && echo "OK [ahead-behind] — 6 chan: ban chung truoc, @{u} la nac cuoi, khong remote -> null, 0 goi mang; dao thang -> noi doi behind 0 (do)"
  ;;

# ── sort-tuoi: moc rong xep CUOI + tuoi trung ──────────────────────────────
sort-tuoi)
  D="$(mk)"; git_init "$D"; mkdir -p "$D/_acceptance"; echo 'schema_version: 1' > "$D/_acceptance/config.yaml"
  # hai cong gia-tri moc RONG (signed-off duong A, chua co uat-session)
  for s in a-gia-tri b-gia-tri; do
    mkdir -p "$D/_acceptance/$s"
    contract signed-off "$s" - A > "$D/_acceptance/$s/contract.md"
    printf -- '---\nschema_version: 1\nslug: %s\nfeature: %s\nstage: decided\ndecision: build\ndecided_at: 2026-01-01T00:00:00Z\n---\n\n## Van de & ai gap\n\nMot cau.\n' "$s" "$s" > "$D/_acceptance/$s/opportunity.md"
  done
  # hai cong pham-vi CO moc
  for s in c-draft d-draft; do
    mkdir -p "$D/_acceptance/$s"; contract draft "$s" - - > "$D/_acceptance/$s/contract.md"
  done
  gcommit "$D" c1
  ORD="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const g=j.groups.gates;
    const iR=g.map((x,i)=>[i,!String(x.since||"")]).filter(x=>x[1]).map(x=>x[0]);
    const iC=g.map((x,i)=>[i,!!String(x.since||"")]).filter(x=>x[1]).map(x=>x[0]);
    if(!iR.length||!iC.length){console.log("MU");process.exit(0);}
    console.log(Math.min(...iR)>Math.max(...iC)?"RONG-CUOI":"RONG-DAU");' "${1:-$SCAN}" "$D")"
  [ "$ORD" = "RONG-CUOI" ] || do_fail "moc rong khong xep cuoi: $ORD"

  # tuoi trung: ba y, HAI y chung mot dau thoi gian
  for s in y1 y2 y3; do
    mkdir -p "$D/_acceptance/$s"
    printf -- '---\nschema_version: 1\nslug: %s\nfeature: y %s\nstage: discovery\ndecision:\n---\n\n## Van de & ai gap\n\nMot cau.\n\n## Nguong chet / nguong UAT\n\n- Cau hoi: ...\n' "$s" "$s" > "$D/_acceptance/$s/opportunity.md"
  done
  git -C "$D" add -A >/dev/null 2>&1
  git -C "$D" commit -q -m "hai y cung mot commit" -- _acceptance/y1 _acceptance/y2 >/dev/null 2>&1
  sleep 1
  git -C "$D" add -A >/dev/null 2>&1; git -C "$D" commit -q -m "y3 rieng mot commit" >/dev/null 2>&1
  TIED="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const c=j.groups.considering;
    console.log(c.map(x=>x.slug+":"+(x.ageTied?"T":"F")).sort().join(" "));' "$SCAN" "$D")"
  case "$TIED" in
    *y1:T*) ;; *) do_fail "y1 phai ageTied=true (chung commit voi y2): $TIED" ;;
  esac
  case "$TIED" in
    *y2:T*) ;; *) do_fail "y2 phai ageTied=true: $TIED" ;;
  esac
  case "$TIED" in
    *y3:F*) ;; *) do_fail "y3 phai ageTied=false (commit rieng): $TIED" ;;
  esac

  # DOI CHUNG DUONG: doi hai cong rong thanh CO moc -> thu tu thuan theo moc, ageTied khong lien quan
  for s in a-gia-tri b-gia-tri; do
    printf -- '---\nschema_version: 1\nslug: %s\nstage: held\nverdict:\ndecided_at: 2026-06-0%s T00:00:00Z\n---\n\n# UAT\n' "$s" "1" > "$D/_acceptance/$s/uat-session.md"
  done
  ORD2="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log(j.groups.gates.every(x=>String(x.since||"")) ? "MOI-CONG-CO-MOC" : "CON-CONG-RONG");' "$SCAN" "$D")"
  [ "$ORD2" = "MOI-CONG-CO-MOC" ] || do_fail "doi chung duong: dat moc cho hai cong ma van con cong rong ($ORD2)"

  # CHIEU DO: ban sao khoi phuc sort cu -> moc rong len dau
  rm -f "$D/_acceptance/a-gia-tri/uat-session.md" "$D/_acceptance/b-gia-tri/uat-session.md"
  M="$(mk)"; plugin_copy "$M"
  perl -0pi -e 's/gates\.sort\(\(a, b\) => \{\n  const ea = .*?\n  if \(ea !== eb\).*?\n  return String\(a\.since\)\.localeCompare\(String\(b\.since\)\);\n\}\);/gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));/s' "$M/scripts/start-scan.mjs"
  grep -qF 'gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));' "$M/scripts/start-scan.mjs" || do_fail "dot bien khong doi duoc dong nao"
  ORDM="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    const g=j.groups.gates;
    const iR=g.map((x,i)=>[i,!String(x.since||"")]).filter(x=>x[1]).map(x=>x[0]);
    const iC=g.map((x,i)=>[i,!!String(x.since||"")]).filter(x=>x[1]).map(x=>x[0]);
    console.log(Math.min(...iR)>Math.max(...iC)?"RONG-CUOI":"RONG-DAU");' "$M/scripts/start-scan.mjs" "$D")"
  [ "$ORDM" = "RONG-DAU" ] || do_fail "chieu do: khoi phuc sort cu ma moc rong khong len dau ($ORDM)"

  # CHIEU DO 2: ban sao go ageTied -> khoa vang
  M2="$(mk)"; plugin_copy "$M2"
  perl -0pi -e 's/for \(const c of considering\) c\.ageTied = dem\.get\(c\.since\) > 1;//' "$M2/scripts/start-scan.mjs"
  TM="$(node -e '
    const {execFileSync}=require("child_process");
    const j=JSON.parse(execFileSync("node",[process.argv[1],"--root",process.argv[2]],{encoding:"utf8",maxBuffer:1e8}));
    console.log(j.groups.considering.every(x=>x.ageTied===undefined)?"KHOA-VANG":"CON-KHOA");' "$M2/scripts/start-scan.mjs" "$D")"
  [ "$TM" = "KHOA-VANG" ] || do_fail "chieu do 2: go ageTied ma khoa van con ($TM)"

  [ "$FAILS" -eq 0 ] && echo "OK [sort-tuoi] — moc rong xep cuoi; ageTied dung tren 2-chung-commit + 1-rieng; doi chung duong dat moc -> het cong rong; 2 chieu do song"
  ;;

*) echo "rang-bdk: chan la '$CHAN' — nhan: at | veto-ten | dang-thuc | bon-bo-doc | ahead-behind | sort-tuoi"; exit 2 ;;
esac

[ "$FAILS" -eq 0 ] || { echo "rang-bdk [$CHAN]: $FAILS loi"; exit 1; }
exit 0
