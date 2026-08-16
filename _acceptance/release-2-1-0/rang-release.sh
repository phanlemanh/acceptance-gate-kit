#!/usr/bin/env bash
# Răng đo release-2-1-0 (chép khuôn release-2-1-0, thêm plugin diagram-design) — mực-đã-in + hành trình làn V. Nếp rang-veto:
# fixture code-sinh, mutant qua CHÍNH hàm kiểm, chiều đỏ in vết cùng lượt.
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
fails=0
ok(){ echo "  OK   $*"; }
bad(){ echo "  ĐỎ   $*"; fails=$((fails+1)); }
mut(){ echo "       [chiều đỏ] $*"; }
TMPS=(); trap 'for d in "${TMPS[@]:-}"; do [ -n "$d" ] && rm -rf "$d"; done' EXIT
tmpd(){ local d; d="$(mktemp -d)"; TMPS+=("$d"); printf '%s' "$d"; }
CHAN=""; [ "${1:-}" = "--chan" ] && CHAN="${2:-}"

# MỘT hàm kiểm nhận GỐC làm tham số — cây thật và bản đột biến cùng đi qua nó
kiem_manifest(){ # <gốc> → in OK/DO từng vế
  node -e '
    const fs=require("fs"), p=process.argv[1];
    const ag=JSON.parse(fs.readFileSync(p+"/.claude-plugin/plugin.json","utf8"));
    const fl=JSON.parse(fs.readFileSync(p+"/feature-loop/.claude-plugin/plugin.json","utf8"));
    const out=[];
    out.push(ag.version==="2.1.0" ? "OK|ag-version 2.1.0" : "DO|ag-version "+ag.version);
    out.push(fl.version==="2.1.0" ? "OK|fl-version 2.1.0" : "DO|fl-version "+fl.version);
    const dd=JSON.parse(fs.readFileSync(p+"/diagram-design/.claude-plugin/plugin.json","utf8"));
    out.push(/^\d+\.\d+\.\d+$/.test(dd.version) ? "OK|dd-version "+dd.version : "DO|dd-version "+dd.version);
    const need=[["ag v2.1 mô tả",ag.description.includes("v2.1.0")&&ag.description.includes("ADR 0012")],
      ["ag đủ bốn vế",/one closed question/.test(ag.description)&&/V lane exactly like the hook/.test(ag.description)&&/diagram-design/.test(ag.description)],
      ["fl v2.1 mô tả",fl.description.includes("v2.1.0")],
      ["fl pairs >=2.1.0",fl.description.includes("acceptance-gate >= 2.1.0")],
      ["dd license MIT",dd.license==="MIT"]];
    for(const [n,v] of need) out.push((v?"OK|":"DO|")+n);
    console.log(out.join("\n"));
  ' "$1"
}
kiem_docs(){ # <gốc> — GUIDE khớp version ĐỌC TỪ manifest (một nguồn)
  node -e '
    const fs=require("fs"), p=process.argv[1];
    const ag=JSON.parse(fs.readFileSync(p+"/.claude-plugin/plugin.json","utf8")).version;
    const fl=JSON.parse(fs.readFileSync(p+"/feature-loop/.claude-plugin/plugin.json","utf8")).version;
    const dd=JSON.parse(fs.readFileSync(p+"/diagram-design/.claude-plugin/plugin.json","utf8")).version;
    const g=fs.readFileSync(p+"/GUIDE.md","utf8");
    const want=`Khớp phiên bản: acceptance-gate ${ag} · feature-loop ${fl} · diagram-design ${dd}.`;
    console.log(g.includes(want) ? "OK|GUIDE khớp "+ag+" · "+fl : "DO|GUIDE không chứa: "+want);
  ' "$1"
}
doc_kq(){ while IFS='|' read -r st n; do [ -n "${st:-}" ] || continue
  [ "$st" = "OK" ] && ok "$n" || bad "$n"; done; }

if [ -z "$CHAN" ] || [ "$CHAN" = "manifest" ]; then
  echo "== chân manifest =="
  kiem_manifest "$ROOT" | doc_kq
  d="$(tmpd)"; mkdir -p "$d/.claude-plugin" "$d/feature-loop/.claude-plugin" "$d/diagram-design/.claude-plugin"
  cp "$ROOT/.claude-plugin/plugin.json" "$d/.claude-plugin/"
  cp "$ROOT/feature-loop/.claude-plugin/plugin.json" "$d/feature-loop/.claude-plugin/"
  cp "$ROOT/diagram-design/.claude-plugin/plugin.json" "$d/diagram-design/.claude-plugin/"
  sed -i.bak 's/"version": "2.1.0"/"version": "2.0.0"/' "$d/.claude-plugin/plugin.json"
  if kiem_manifest "$d" | grep -q "^DO|ag-version"; then
    mut "bản sao hạ số 2.0.0 → chân đỏ ghim ag-version (qua CHÍNH kiem_manifest)"
  else bad "CHIỀU ĐỎ KHÔNG CHẠY: hạ số mà chân vẫn xanh"; fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "docs" ]; then
  echo "== chân docs =="
  kiem_docs "$ROOT" | doc_kq
  d="$(tmpd)"; mkdir -p "$d/.claude-plugin" "$d/feature-loop/.claude-plugin" "$d/diagram-design/.claude-plugin"
  cp "$ROOT/.claude-plugin/plugin.json" "$d/.claude-plugin/"
  cp "$ROOT/feature-loop/.claude-plugin/plugin.json" "$d/feature-loop/.claude-plugin/"
  cp "$ROOT/diagram-design/.claude-plugin/plugin.json" "$d/diagram-design/.claude-plugin/"
  sed 's/acceptance-gate 2.1.0/acceptance-gate 2.0.0/' "$ROOT/GUIDE.md" > "$d/GUIDE.md"
  if kiem_docs "$d" | grep -q "^DO|"; then
    mut "bản sao GUIDE ghi số cũ → chân đỏ (một nguồn: so với manifest, không so hằng)"
  else bad "CHIỀU ĐỎ KHÔNG CHẠY: GUIDE lệch mà chân vẫn xanh"; fi
  # AC-8: hướng dẫn cài + vật mẫu skin (mực đã in)
  e8=0
  grep -q "plugin install diagram-design@acceptance-gate-kit" "$ROOT/docs/reference/DIAGRAM-RULE.md" || { bad "DIAGRAM-RULE §5 thiếu lệnh cài plugin"; e8=1; }
  grep -q "plugin install diagram-design@acceptance-gate-kit" "$ROOT/README.md" || { bad "README thiếu dòng cài diagram-design"; e8=1; }
  [ "$(head -1 "$ROOT/docs/reference/diagram-skin.md" 2>/dev/null)" = "<!-- skin: default-confirmed -->" ] || { bad "docs/reference/diagram-skin.md thiếu hoặc marker sai"; e8=1; }
  grep -qE "symlink" "$ROOT/docs/reference/DIAGRAM-RULE.md" && grep -q "gỡ symlink" "$ROOT/docs/reference/DIAGRAM-RULE.md" || { bad "§5 không dặn gỡ symlink cũ"; e8=1; }
  [ $e8 -eq 0 ] && ok "huong dan cai + skin mau"
  d8="$(tmpd)"; sed 's/plugin install diagram-design@acceptance-gate-kit/plugin install XXX/' "$ROOT/README.md" > "$d8/README.md"
  if grep -q "plugin install diagram-design@acceptance-gate-kit" "$d8/README.md"; then bad "CHIỀU ĐỎ AC-8 KHÔNG CHẠY"; else mut "bản sao README mất dòng cài → chân bắt (qua chính grep)"; fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "diff-allowlist" ]; then
  echo "== chân diff-allowlist: lời hứa «không đổi engine» CÓ THƯỚC =="
  # gap-probe P0: Out of scope hứa không đổi một dòng engine — chân này biến
  # lời trấn an thành phép đo: MỌI file trong diff phải thuộc allowlist khai
  # dưới. Fetch trước + ghim SHA base để evidence tái lập được (P2-1).
  git -C "$ROOT" fetch -q origin 2>/dev/null || bad "diff: fetch origin THẤT BẠI — không ghim được base"
  BSHA="$(git -C "$ROOT" rev-parse origin/main 2>/dev/null)"
  echo "  base origin/main = $BSHA"
  kiem_diff(){ # <danh sách file, mỗi dòng một> → in từng file lạ
    while IFS= read -r f2; do [ -n "$f2" ] || continue
      case "$f2" in
        .claude-plugin/plugin.json|feature-loop/.claude-plugin/plugin.json|.claude-plugin/marketplace.json|GUIDE.md|README.md|PRODUCT-MAP.md|_acceptance/config.yaml|_acceptance/release-2-1-0/*|diagram-design/*|docs/reference/DIAGRAM-RULE.md|docs/reference/diagram-skin.md|tests/plugins/run-tests.sh|docs/plans/*|docs/findings/*) ;;
        *) printf 'LA|%s\n' "$f2" ;;
      esac
    done; }
  la="$(git -C "$ROOT" diff --name-only "$BSHA"...HEAD | kiem_diff)"
  # đếm-vệ-sinh: diff rỗng nghĩa là chưa commit gì — chân vô nghĩa, phải đỏ
  n=$(git -C "$ROOT" diff --name-only "$BSHA"...HEAD | grep -c . || true)
  if [ "$n" -eq 0 ]; then bad "diff RỖNG so với $BSHA — chân chạy trước khi commit, vô nghĩa"
  elif [ -n "$la" ]; then bad "diff chạm file NGOÀI allowlist: $(printf '%s' "$la" | tr '\n' ' ')"
  else ok "diff $n file ⊆ allowlist (3 manifest · marketplace · GUIDE · README · bản đồ · config · workspace · gói diagram-design · DIAGRAM-RULE + skin · P196 · docs)"; fi
  # chiều đỏ qua CHÍNH kiem_diff: một danh sách có file lib/ phải bị bắt
  if printf 'lib/evidence-core.cjs\n' | kiem_diff | grep -q '^LA|lib/'; then
    mut "danh sách tiêm lib/evidence-core.cjs → kiem_diff BẮT được file ngoài allowlist"
  else bad "CHIỀU ĐỎ KHÔNG CHẠY: tiêm file engine mà kiem_diff không bắt"; fi
  # ── hai ràng buộc ÂM cho hai file «rộng» trong allowlist (gap-probe P1) ──
  # (a) tests/plugins/run-tests.sh: CHỈ THÊM — không sửa/xoá được P32 hay khoá cổng qua tests
  chi_them(){ # <diff text> → in số dòng '-' thật (bỏ header ---)
    grep -E '^-[^-]|^-$' | grep -c . || true; }
  dtest="$(git -C "$ROOT" diff "$BSHA"...HEAD -- tests/plugins/run-tests.sh)"
  nminus="$(printf '%s\n' "$dtest" | chi_them)"
  if [ -z "$dtest" ]; then ok "run-tests khong doi (khong co gi de kiem)"
  elif [ "$nminus" -eq 0 ]; then ok "run-tests chi THEM ($(printf '%s\n' "$dtest" | grep -cE '^\+[^+]') dong +, 0 dong -)"
  else bad "run-tests co $nminus dong xoa/sua — release chi duoc THEM ca"; fi
  if printf -- '-  echo "P32 x"\n+  echo "P32 y"\n' | chi_them | grep -qx 1; then mut "diff giả có 1 dòng '-' → chi_them đếm được"; else bad "CHIỀU ĐỎ chi_them KHÔNG CHẠY"; fi
  # (b) _acceptance/config.yaml: CHỈ thêm khoá executors.script.* — không đụng risk_tiers/signoff/enforcement/recheck
  dcfg="$(git -C "$ROOT" diff "$BSHA"...HEAD -- _acceptance/config.yaml)"
  cminus="$(printf '%s\n' "$dcfg" | chi_them)"
  cbad="$(printf '%s\n' "$dcfg" | grep -E '^\+[^+]' | grep -vE '^\+    [a-z0-9_]+: ' | grep -vE '^\+\s*#' | grep -c . || true)"
  ctouch="$(printf '%s\n' "$dcfg" | grep -E '^[+-]' | grep -E 'risk_tiers|^[+-]signoff|enforcement:|recheck:|t3_paths|t1_skip' | grep -c . || true)"
  if [ -z "$dcfg" ]; then ok "config khong doi"
  elif [ "$cminus" -eq 0 ] && [ "$cbad" -eq 0 ] && [ "$ctouch" -eq 0 ]; then ok "config chi them khoa executor"
  else bad "config: $cminus dong -, $cbad dong + ngoai khuon khoa, $ctouch dong cham luat cong"; fi
  if printf -- '+  t3_paths:\n' | grep -E '^[+-]' | grep -qE 't3_paths'; then mut "diff giả chạm t3_paths → bị bắt"; else bad "CHIỀU ĐỎ config KHÔNG CHẠY"; fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "lan-v" ]; then
  echo "== chân làn V trên vật thật =="
  git -C "$ROOT" fetch -q origin 2>/dev/null || true
  BSHA="$(git -C "$ROOT" rev-parse origin/main 2>/dev/null)"
  echo "  base origin/main = $BSHA"
  o="$(cd "$ROOT" && bash scripts/pre-merge-check.sh --base "$BSHA" 2>&1)"; rc=$?
  echo "  pre-merge exit=$rc (ghi nhận, không tin mã thoát một mình)"
  case "$o" in *"cửa veto đang mở"*release-2-1-0*) ok "NOTE cửa-veto có tên release-2-1-0" ;;
    *) bad "NOTE cửa-veto KHÔNG có tên hồ sơ này" ;; esac
  if printf '%s' "$o" | grep -E "^VIOLATION \[release-2-1-0\]" | grep -q "veto"; then
    bad "luật veto nổ oan trên hồ sơ này"
  else ok "0 VIOLATION nhóm veto mang tên release-2-1-0"; fi
  # ĐỐI CHỨNG DƯƠNG cho assert âm (gap-probe P1): dựng fixture code-sinh có
  # vi phạm veto THẬT, chạy CHÍNH pre-merge, chứng minh pattern grep BẮT được
  # định dạng dòng vi phạm thật — không thì «0 VIOLATION» là xanh-vĩnh-viễn.
  d="$(tmpd)"
  ( cd "$ROOT" && tar -cf - --exclude=.git --exclude=.worktrees --exclude=.claude lib scripts ) | tar -x -C "$d"
  mkdir -p "$d/_acceptance/vphạm"
  printf -- "---\nschema_version: 1\nfeature: f\nslug: vphạm\nowner: o\nrisk_tier: T2\nstatus: approved\napproved_by:\napproved_at:\nveto_state: da-veto\nveto_opened_at: 2026-08-15T00:00:00Z\n---\n\n# c\n" > "$d/_acceptance/vphạm/contract.md"
  ( cd "$d" && git init -q . && git add -A >/dev/null 2>&1 && git -c user.email=t@t -c user.name=T commit -qm b >/dev/null 2>&1 )
  o2="$( cd "$d" && bash scripts/pre-merge-check.sh --base HEAD 2>&1 )"
  if printf '%s' "$o2" | grep -E "^VIOLATION \[vphạm\]" | grep -q "veto"; then
    mut "fixture da-veto thật → pattern grep BẮT được đúng định dạng VIOLATION của pre-merge"
  else bad "ĐỐI CHỨNG DƯƠNG HỎNG: vi phạm veto thật mà pattern không bắt — assert âm ở trên vô nghĩa"; fi
fi

echo
[ "$fails" -eq 0 ] && { echo "RANG-RELEASE: XANH"; exit 0; }
echo "RANG-RELEASE: $fails chân ĐỎ"; exit 1
