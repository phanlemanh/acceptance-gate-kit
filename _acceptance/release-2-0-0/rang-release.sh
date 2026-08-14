#!/usr/bin/env bash
# Răng đo release-2-0-0 — mực-đã-in + hành trình làn V. Nếp rang-veto:
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
    out.push(ag.version==="2.0.0" ? "OK|ag-version 2.0.0" : "DO|ag-version "+ag.version);
    out.push(fl.version==="2.0.0" ? "OK|fl-version 2.0.0" : "DO|fl-version "+fl.version);
    const need=[["ag v2 mô tả",ag.description.includes("v2.0.0")&&ag.description.includes("veto")],
      ["ag đủ ba vế",/hard-to-reverse/.test(ag.description)&&/clean/.test(ag.description)],
      ["fl v2 mô tả",fl.description.includes("v2.0.0")],
      ["fl pairs >=2.0.0",fl.description.includes("acceptance-gate >= 2.0.0")]];
    for(const [n,v] of need) out.push((v?"OK|":"DO|")+n);
    console.log(out.join("\n"));
  ' "$1"
}
kiem_docs(){ # <gốc> — GUIDE khớp version ĐỌC TỪ manifest (một nguồn)
  node -e '
    const fs=require("fs"), p=process.argv[1];
    const ag=JSON.parse(fs.readFileSync(p+"/.claude-plugin/plugin.json","utf8")).version;
    const fl=JSON.parse(fs.readFileSync(p+"/feature-loop/.claude-plugin/plugin.json","utf8")).version;
    const g=fs.readFileSync(p+"/GUIDE.md","utf8");
    const want=`Khớp phiên bản: acceptance-gate ${ag} · feature-loop ${fl}.`;
    console.log(g.includes(want) ? "OK|GUIDE khớp "+ag+" · "+fl : "DO|GUIDE không chứa: "+want);
  ' "$1"
}
doc_kq(){ while IFS='|' read -r st n; do [ -n "${st:-}" ] || continue
  [ "$st" = "OK" ] && ok "$n" || bad "$n"; done; }

if [ -z "$CHAN" ] || [ "$CHAN" = "manifest" ]; then
  echo "== chân manifest =="
  kiem_manifest "$ROOT" | doc_kq
  d="$(tmpd)"; mkdir -p "$d/.claude-plugin" "$d/feature-loop/.claude-plugin"
  cp "$ROOT/.claude-plugin/plugin.json" "$d/.claude-plugin/"
  cp "$ROOT/feature-loop/.claude-plugin/plugin.json" "$d/feature-loop/.claude-plugin/"
  sed -i.bak 's/"version": "2.0.0"/"version": "1.42.0"/' "$d/.claude-plugin/plugin.json"
  if kiem_manifest "$d" | grep -q "^DO|ag-version"; then
    mut "bản sao hạ số 1.42.0 → chân đỏ ghim ag-version (qua CHÍNH kiem_manifest)"
  else bad "CHIỀU ĐỎ KHÔNG CHẠY: hạ số mà chân vẫn xanh"; fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "docs" ]; then
  echo "== chân docs =="
  kiem_docs "$ROOT" | doc_kq
  d="$(tmpd)"; mkdir -p "$d/.claude-plugin" "$d/feature-loop/.claude-plugin"
  cp "$ROOT/.claude-plugin/plugin.json" "$d/.claude-plugin/"
  cp "$ROOT/feature-loop/.claude-plugin/plugin.json" "$d/feature-loop/.claude-plugin/"
  sed 's/acceptance-gate 2.0.0/acceptance-gate 1.41.0/' "$ROOT/GUIDE.md" > "$d/GUIDE.md"
  if kiem_docs "$d" | grep -q "^DO|"; then
    mut "bản sao GUIDE ghi số cũ → chân đỏ (một nguồn: so với manifest, không so hằng)"
  else bad "CHIỀU ĐỎ KHÔNG CHẠY: GUIDE lệch mà chân vẫn xanh"; fi
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
        .claude-plugin/plugin.json|feature-loop/.claude-plugin/plugin.json|GUIDE.md|PRODUCT-MAP.md|_acceptance/config.yaml|_acceptance/release-2-0-0/*) ;;
        *) printf 'LA|%s\n' "$f2" ;;
      esac
    done; }
  la="$(git -C "$ROOT" diff --name-only "$BSHA"...HEAD | kiem_diff)"
  # đếm-vệ-sinh: diff rỗng nghĩa là chưa commit gì — chân vô nghĩa, phải đỏ
  n=$(git -C "$ROOT" diff --name-only "$BSHA"...HEAD | grep -c . || true)
  if [ "$n" -eq 0 ]; then bad "diff RỖNG so với $BSHA — chân chạy trước khi commit, vô nghĩa"
  elif [ -n "$la" ]; then bad "diff chạm file NGOÀI allowlist: $(printf '%s' "$la" | tr '\n' ' ')"
  else ok "diff $n file ⊆ allowlist (2 manifest · GUIDE · bản đồ · config · workspace)"; fi
  # chiều đỏ qua CHÍNH kiem_diff: một danh sách có file lib/ phải bị bắt
  if printf 'lib/evidence-core.cjs\n' | kiem_diff | grep -q '^LA|lib/'; then
    mut "danh sách tiêm lib/evidence-core.cjs → kiem_diff BẮT được file ngoài allowlist"
  else bad "CHIỀU ĐỎ KHÔNG CHẠY: tiêm file engine mà kiem_diff không bắt"; fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "lan-v" ]; then
  echo "== chân làn V trên vật thật =="
  git -C "$ROOT" fetch -q origin 2>/dev/null || true
  BSHA="$(git -C "$ROOT" rev-parse origin/main 2>/dev/null)"
  echo "  base origin/main = $BSHA"
  o="$(cd "$ROOT" && bash scripts/pre-merge-check.sh --base "$BSHA" 2>&1)"; rc=$?
  echo "  pre-merge exit=$rc (ghi nhận, không tin mã thoát một mình)"
  case "$o" in *"cửa veto đang mở"*release-2-0-0*) ok "NOTE cửa-veto có tên release-2-0-0" ;;
    *) bad "NOTE cửa-veto KHÔNG có tên hồ sơ này" ;; esac
  if printf '%s' "$o" | grep -E "^VIOLATION \[release-2-0-0\]" | grep -q "veto"; then
    bad "luật veto nổ oan trên hồ sơ này"
  else ok "0 VIOLATION nhóm veto mang tên release-2-0-0"; fi
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
