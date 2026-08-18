#!/usr/bin/env bash
# Răng đo release-2-2-0 (nếp release-2-1-0 + 5 lỗ gap-probe vá trước cổng).
# Nếp: MỘT hàm kiểm nhận GỐC; cây thật và bản đột biến cùng đi qua chính hàm đó;
# chiều đỏ in vết cùng lượt, ghim đúng thông điệp; SỐ VẾ khai trước (chân câm =
# chân đỏ, không phải chân xanh).
set -uo pipefail
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
fails=0
ok(){ echo "  OK   $*"; }
bad(){ echo "  ĐỎ   $*"; fails=$((fails+1)); }
mut(){ echo "       [chiều đỏ] $*"; }
TMPS=(); trap 'for d in "${TMPS[@]:-}"; do [ -n "$d" ] && rm -rf "$d"; done' EXIT
tmpd(){ local d; d="$(mktemp -d)"; TMPS+=("$d"); printf '%s' "$d"; }
CHAN=""; [ "${1:-}" = "--chan" ] && CHAN="${2:-}"
VER="2.2.0"
BASE_REF="${DIFF_BASE:-origin/main}"

# ── SỐ VẾ khai trước: chân nào trả ít hơn số này là chân CÂM → ĐỎ ────────────
VE_MANIFEST=6; VE_DOCS=1; VE_MOTA=5

kiem_manifest(){ # <gốc> <số dd ở base> → dòng OK|… / DO|…
  node -e '
    const fs=require("fs"), p=process.argv[1], VER=process.argv[2], DDBASE=process.argv[3];
    const rd=f=>JSON.parse(fs.readFileSync(p+f,"utf8"));
    const ag=rd("/.claude-plugin/plugin.json"), fl=rd("/feature-loop/.claude-plugin/plugin.json"), dd=rd("/diagram-design/.claude-plugin/plugin.json");
    const out=[];
    out.push(ag.version===VER ? "OK|ag-version "+VER : "DO|ag-version "+ag.version);
    out.push(fl.version===VER ? "OK|fl-version "+VER : "DO|fl-version "+fl.version);
    // QUAN HỆ, không hình dạng: vendor pin KHÔNG ĐỔI so với base
    out.push(dd.version===DDBASE ? "OK|dd-version "+dd.version+" khong doi so voi base" : "DO|dd-version doi so voi base: "+DDBASE+" -> "+dd.version);
    out.push(/^\d+\.\d+\.\d+$/.test(dd.version) ? "OK|dd-version hop semver" : "DO|dd-version khong hop semver: "+dd.version);
    out.push(ag.description.includes("v"+VER) ? "OK|ag mo ta co muc v"+VER : "DO|ag mo ta thieu muc v"+VER);
    out.push(fl.description.includes("acceptance-gate >= "+VER) ? "OK|fl khai cap ag >= "+VER : "DO|fl khong khai cap ag >= "+VER);
    console.log(out.join("\n"));
  ' "$1" "$VER" "$2" 2>&1
}
kiem_docs(){ # <gốc> — GUIDE khớp số ĐỌC TỪ manifest (một nguồn)
  node -e '
    const fs=require("fs"), p=process.argv[1];
    const rd=f=>JSON.parse(fs.readFileSync(p+f,"utf8")).version;
    const ag=rd("/.claude-plugin/plugin.json"), fl=rd("/feature-loop/.claude-plugin/plugin.json"), dd=rd("/diagram-design/.claude-plugin/plugin.json");
    const g=fs.readFileSync(p+"/GUIDE.md","utf8");
    const want=`Khớp phiên bản: acceptance-gate ${ag} · feature-loop ${fl} · diagram-design ${dd}.`;
    console.log(g.includes(want) ? "OK|GUIDE khop "+ag+" · "+fl+" · "+dd : "DO|GUIDE khong chua: "+want);
  ' "$1" 2>&1
}
kiem_mota(){ # <gốc> — mục v2.2.0 nói người dùng nhận gì + không phải migrate
  node -e '
    const fs=require("fs"), p=process.argv[1], VER=process.argv[2];
    const d=JSON.parse(fs.readFileSync(p+"/.claude-plugin/plugin.json","utf8")).description;
    const i=d.indexOf("v"+VER);
    if(i<0){ console.log("DO|mo ta khong co muc v"+VER); process.exit(0); }
    const seg=d.slice(i);
    const need=[["noi hinh tai Cong 1",/Gate 1/i.test(seg)&&/(diagram|figure|picture)/i.test(seg)],
      ["noi nguong nghiem thu tren the",/threshold/i.test(seg)],
      ["noi nhat-ky-vap",/stranger[- ]drive/i.test(seg)],
      ["noi S5 ban giao",/hands? off|hand-off/i.test(seg)],
      ["noi khong phai migrate",/nothing to migrate|no migration/i.test(seg)]];
    console.log(need.map(([n,v])=>(v?"OK|":"DO|")+n).join("\n"));
  ' "$1" "$VER" 2>&1
}
# doc_kq <số vế mong đợi> <tên chân> — chân câm (node chết, 0 dòng, thiếu vế) là ĐỎ
doc_kq(){ local want="$1" ten="$2" n=0 st nm
  while IFS='|' read -r st nm; do
    [ -n "${st:-}" ] || continue
    n=$((n+1))
    if [ "$st" = "OK" ]; then ok "$nm"; else bad "$nm"; fi
  done
  [ "$n" -eq "$want" ] || bad "chân $ten trả $n vế, khai trước $want — chân câm/hỏng không được tính là xanh"
}
dd_base(){ git -C "$ROOT" show "$BASE_REF:diagram-design/.claude-plugin/plugin.json" 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).version)}catch(e){console.log("")}})'; }
ban_sao_manifest(){ local d="$1"; mkdir -p "$d/.claude-plugin" "$d/feature-loop/.claude-plugin" "$d/diagram-design/.claude-plugin"
  cp "$ROOT/.claude-plugin/plugin.json" "$d/.claude-plugin/"
  cp "$ROOT/feature-loop/.claude-plugin/plugin.json" "$d/feature-loop/.claude-plugin/"
  cp "$ROOT/diagram-design/.claude-plugin/plugin.json" "$d/diagram-design/.claude-plugin/"
  cp "$ROOT/GUIDE.md" "$d/GUIDE.md"; }

if [ -z "$CHAN" ] || [ "$CHAN" = "manifest" ]; then
  echo "== chân manifest =="
  DDB="$(dd_base)"
  if [ -z "$DDB" ]; then bad "không đọc được số diagram-design ở base $BASE_REF — chân fail-closed"; else
    ok "base $BASE_REF có diagram-design $DDB"
    kiem_manifest "$ROOT" "$DDB" | doc_kq "$VE_MANIFEST" manifest
    d="$(tmpd)"; ban_sao_manifest "$d"
    sed -i.bak "s/\"version\": \"$VER\"/\"version\": \"2.1.0\"/" "$d/.claude-plugin/plugin.json"
    kiem_manifest "$d" "$DDB" | grep -q "^DO|ag-version" \
      && mut "bản sao hạ số 2.1.0 → ĐỎ ghim ag-version (qua CHÍNH kiem_manifest)" \
      || bad "CHIỀU ĐỎ KHÔNG CHẠY: hạ số mà chân vẫn xanh"
    d2="$(tmpd)"; ban_sao_manifest "$d2"
    node -e 'const fs=require("fs"),p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,"utf8"));j.description=j.description.replace("acceptance-gate >= 2.2.0","acceptance-gate >= 2.1.0");fs.writeFileSync(p,JSON.stringify(j,null,2));' "$d2/feature-loop/.claude-plugin/plugin.json"
    kiem_manifest "$d2" "$DDB" | grep -q "^DO|fl khong khai cap" \
      && mut "bản sao để cặp cũ >= 2.1.0 → ĐỎ ghim cặp phiên bản" \
      || bad "CHIỀU ĐỎ KHÔNG CHẠY: cặp lệch mà chân vẫn xanh"
    d3="$(tmpd)"; ban_sao_manifest "$d3"
    node -e 'const fs=require("fs"),p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,"utf8"));j.version="9.9.9";fs.writeFileSync(p,JSON.stringify(j,null,2));' "$d3/diagram-design/.claude-plugin/plugin.json"
    kiem_manifest "$d3" "$DDB" | grep -q "^DO|dd-version doi so voi base" \
      && mut "bản sao nâng vendor pin 9.9.9 → ĐỎ ghim «đổi so với base» (quan hệ, không hình dạng)" \
      || bad "CHIỀU ĐỎ KHÔNG CHẠY: pin đổi mà chân vẫn xanh"
    d4="$(tmpd)"; ban_sao_manifest "$d4"; printf '{ hong' > "$d4/.claude-plugin/plugin.json"
    n4="$(kiem_manifest "$d4" "$DDB" | grep -c '^\(OK\||DO\)|')"
    [ "${n4:-0}" -lt "$VE_MANIFEST" ] \
      && mut "bản sao manifest JSON hỏng → chân câm ($n4 vế) và doc_kq xếp ĐỎ, không lọt thành xanh" \
      || bad "CHIỀU ĐỎ KHÔNG CHẠY: manifest hỏng mà vẫn đủ vế"
  fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "docs" ]; then
  echo "== chân docs =="
  kiem_docs "$ROOT" | doc_kq "$VE_DOCS" docs
  d="$(tmpd)"; ban_sao_manifest "$d"
  sed "s/acceptance-gate $VER/acceptance-gate 2.1.0/" "$ROOT/GUIDE.md" > "$d/GUIDE.md"
  kiem_docs "$d" | grep -q "^DO|" \
    && mut "bản sao GUIDE ghi số cũ → ĐỎ (một nguồn: so với manifest, không so hằng)" \
    || bad "CHIỀU ĐỎ KHÔNG CHẠY: GUIDE lệch mà chân vẫn xanh"
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "mo-ta" ]; then
  echo "== chân mô tả người-dùng-nhận-gì =="
  kiem_mota "$ROOT" | doc_kq "$VE_MOTA" mo-ta
  d="$(tmpd)"; ban_sao_manifest "$d"
  node -e 'const fs=require("fs"),p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,"utf8"));j.description=j.description.replace(/stranger[- ]drive/gi,"XXX");fs.writeFileSync(p,JSON.stringify(j,null,2));' "$d/.claude-plugin/plugin.json"
  kiem_mota "$d" | grep -q "^DO|noi nhat-ky-vap" \
    && mut "bản sao xoá tên nhật-ký-vấp → ĐỎ ghim đúng vế" \
    || bad "CHIỀU ĐỎ KHÔNG CHẠY: mô tả thiếu vế mà chân vẫn xanh"
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "ba-ca" ]; then
  echo "== chân ba ca kiểm của ba hồ sơ trong mốc =="
  kiem_ba_ca(){ # <file run-tests.sh> → OK|/DO| cho từng ca
    local f="$1" c
    for c in P197 P198 P199; do
      grep -q "^run \"$c " "$f" && echo "OK|$f co ca $c" || echo "DO|thieu ca $c trong bo kiem"
    done; }
  kiem_ba_ca "$ROOT/tests/plugins/run-tests.sh" | doc_kq 3 ba-ca-cau-truc
  d="$(tmpd)"; grep -v '^run "P199 ' "$ROOT/tests/plugins/run-tests.sh" > "$d/run-tests.sh"
  kiem_ba_ca "$d/run-tests.sh" | grep -q "^DO|thieu ca P199" \
    && mut "bản sao gỡ dòng chạy P199 → ĐỎ ghim đúng ca thiếu (qua CHÍNH kiem_ba_ca)" \
    || bad "CHIỀU ĐỎ KHÔNG CHẠY: gỡ ca mà chân vẫn xanh"
  echo "  (chạy suite plugins một lượt để ghim ba dòng PASS — không tin mã thoát một mình)"
  o="$(cd "$ROOT" && bash tests/plugins/run-tests.sh 2>&1)"; rc=$?
  echo "  suite plugins exit=$rc"
  for c in P197 P198 P199; do
    printf '%s' "$o" | grep -q "PASS: $c " && ok "suite in PASS: $c" || bad "suite KHÔNG in PASS: $c"
  done
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "lan-v" ]; then
  echo "== chân làn V trên vật thật (chạy CHÍNH lưới trước-merge) =="
  git -C "$ROOT" fetch -q origin 2>/dev/null || true
  BSHA="$(git -C "$ROOT" rev-parse "$BASE_REF" 2>/dev/null || true)"
  if [ -z "$BSHA" ]; then bad "không giải được base $BASE_REF — chân fail-closed"; else
    echo "  base $BASE_REF = $BSHA"
    o="$(cd "$ROOT" && bash scripts/pre-merge-check.sh --base "$BSHA" 2>&1)"; rc=$?
    echo "  pre-merge exit=$rc (ghi nhận, không tin mã thoát một mình)"
    case "$o" in *"cửa veto đang mở"*release-2-2-0*) ok "NOTE cửa-veto có tên release-2-2-0" ;;
      *) bad "NOTE cửa-veto KHÔNG có tên hồ sơ này" ;; esac
    if printf '%s' "$o" | grep -E "^VIOLATION \[release-2-2-0\]" | grep -q "veto"; then
      bad "luật veto nổ oan trên hồ sơ này"
    else ok "0 VIOLATION nhóm veto mang tên release-2-2-0"; fi
    # ĐỐI CHỨNG DƯƠNG 1 — vi phạm veto THẬT phải bị CHÍNH pre-merge bắt
    d="$(tmpd)"
    ( cd "$ROOT" && tar -cf - --exclude=.git --exclude=.claude lib scripts ) | tar -x -C "$d"
    mkdir -p "$d/_acceptance/vpham"
    printf -- "---\nschema_version: 1\nfeature: f\nslug: vpham\nowner: o\nrisk_tier: T2\nstatus: approved\napproved_by:\napproved_at:\nveto_state: da-veto\nveto_opened_at: 2026-08-18T00:00:00Z\n---\n\n# c\n" > "$d/_acceptance/vpham/contract.md"
    ( cd "$d" && git init -q . && git add -A >/dev/null 2>&1 && git -c user.email=t@t -c user.name=T commit -qm b >/dev/null 2>&1 )
    o2="$( cd "$d" && bash scripts/pre-merge-check.sh --base HEAD 2>&1 )"
    printf '%s' "$o2" | grep -E "^VIOLATION \[vpham\]" | grep -q "veto" \
      && mut "fixture da-veto thật → pattern bắt đúng định dạng VIOLATION của lưới" \
      || bad "ĐỐI CHỨNG DƯƠNG HỎNG: vi phạm veto thật mà pattern không bắt — assert âm ở trên vô nghĩa"
    # ĐỐI CHỨNG DƯƠNG 2 — QUAN HỆ mo ⇔ xanh-sạch: mo + báo cáo KHÔNG sạch phải ĐỎ
    e="$(tmpd)"
    ( cd "$ROOT" && tar -cf - --exclude=.git --exclude=.claude lib scripts ) | tar -x -C "$e"
    mkdir -p "$e/_acceptance/khongsach"
    printf -- "---\nschema_version: 1\nfeature: f\nslug: khongsach\nowner: o\nrisk_tier: T2\nstatus: verified\napproved_by:\napproved_at:\nveto_state: mo\nveto_opened_at: 2026-08-18T00:00:00Z\n---\n\n# c\n" > "$e/_acceptance/khongsach/contract.md"
    printf -- "---\nschema_version: 2\nfeature_slug: khongsach\nverdict: PASS\nfailed_evals: []\nverified_by: x\nenforcement_mode: strict\nbypass_used: false\nverified_commit: 0000000000000000000000000000000000000000\nhuman_signoff:\n---\n\n## Known limits\n\n- một giới hạn còn treo\n" > "$e/_acceptance/khongsach/evidence-report.md"
    ( cd "$e" && git init -q . && git add -A >/dev/null 2>&1 && git -c user.email=t@t -c user.name=T commit -qm b >/dev/null 2>&1 )
    o3="$( cd "$e" && bash scripts/pre-merge-check.sh --base HEAD 2>&1 )"
    printf '%s' "$o3" | grep -qE "^VIOLATION \[khongsach\]" \
      && mut "fixture mo + Known limits KHÔNG rỗng → lưới ĐỎ: quan hệ mo ⇔ xanh-sạch có răng" \
      || bad "QUAN HỆ KHÔNG ĐƯỢC ĐO: mo mà báo cáo không sạch vẫn lọt qua lưới"
  fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "diff-allowlist" ]; then
  echo "== chân phạm vi diff (allowlist ĐÓNG) =="
  trong_allowlist(){ case "$1" in
      .claude-plugin/plugin.json|feature-loop/.claude-plugin/plugin.json|GUIDE.md|PRODUCT-MAP.md|_acceptance/config.yaml) return 0 ;;
      _acceptance/release-2-2-0/*) return 0 ;;
      *) return 1 ;; esac; }
  if ! git -C "$ROOT" rev-parse --verify -q "$BASE_REF" >/dev/null; then
    bad "không giải được base '$BASE_REF' — chân fail-closed, KHÔNG bỏ qua"
  else
    mapfile -t DIFF < <(git -C "$ROOT" diff --name-only "$BASE_REF"...HEAD)
    # ĐỐI CHỨNG DƯƠNG: diff RỖNG là chân mù, không phải chân sạch
    if [ "${#DIFF[@]}" -eq 0 ]; then bad "diff RỖNG so với $BASE_REF — chân này không kết luận được gì (đối chứng dương hỏng)"
    else
      ok "diff có ${#DIFF[@]} file"
      for loi in .claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json GUIDE.md; do
        printf '%s\n' "${DIFF[@]}" | grep -qx "$loi" && ok "diff có vật lõi: $loi" || bad "diff THIẾU vật lõi của một lần cắt số: $loi"
      done
      ngoai=0
      for f in "${DIFF[@]}"; do trong_allowlist "$f" || { bad "file NGOÀI allowlist: $f"; ngoai=$((ngoai+1)); }; done
      [ "$ngoai" -eq 0 ] && ok "diff nằm trọn trong allowlist đóng"
    fi
    # sửa chưa commit cũng phải nằm trong allowlist (diff BASE...HEAD mù với nó)
    chua=0
    while IFS= read -r l; do
      f="${l:3}"; [ -z "$f" ] && continue
      trong_allowlist "$f" || { bad "sửa CHƯA COMMIT ngoài allowlist: $f"; chua=$((chua+1)); }
    done < <(git -C "$ROOT" status --porcelain)
    [ "$chua" -eq 0 ] && ok "không có sửa chưa commit nào ngoài allowlist"
    trong_allowlist "skills/uat-session/SKILL.md" \
      && bad "CHIỀU ĐỎ KHÔNG CHẠY: allowlist nuốt cả file engine" \
      || mut "đường dẫn engine giả lập (skills/uat-session/SKILL.md) bị CHÍNH hàm lọc loại"
  fi
fi

echo
[ "$fails" -eq 0 ] && { echo "RANG-RELEASE 2.2.0: XANH"; exit 0; }
echo "RANG-RELEASE 2.2.0: $fails vế ĐỎ"; exit 1
