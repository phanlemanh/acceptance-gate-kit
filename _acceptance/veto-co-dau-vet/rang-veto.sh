#!/usr/bin/env bash
# Răng đo cho hồ sơ veto-co-dau-vet (đợt 2, T3) — lớp MÃ TIỀN ĐỊNH.
#
# VAI KHAI THẲNG: lớp này chạy CHÍNH hook/pre-merge/lõi kiểm trên fixture
# CODE-SINH và đòi chúng CHO/CHẶN đúng nhánh, kèm chiều đỏ trong cùng lượt.
# Nó KHÔNG đo được lời hứa hành-vi-agent (AC-6/AC-7) — đó là việc của hội
# đồng, và T3 nên verdict cuối là của NGƯỜI tại Cổng Bằng chứng.
#
# Ba luật (nếp rang-1c sau khi vá lỗ E9e):
#  (a) fixture do CODE SINH trong chính lần chạy, không chép tay;
#  (b) mutant đi qua CHÍNH checker thật, không qua bản chép của phép đo;
#  (c) mỗi chân in vết chiều-đỏ — bằng chứng phá-thử, không dựa kỷ luật.
#
# Dùng: rang-veto.sh --chan hook|hook-cu|premerge-dem|premerge-sach|ghi-nguoc|vanban|so-ca
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
CONTRACT="$WS/contract.md"
fails=0
ok(){ echo "  OK   $*"; }
bad(){ echo "  ĐỎ   $*"; fails=$((fails+1)); }
mut(){ echo "       [chiều đỏ] $*"; }
TMPS=(); trap 'for d in "${TMPS[@]:-}"; do [ -n "$d" ] && rm -rf "$d"; done' EXIT
tmpd(){ local d; d="$(mktemp -d)"; TMPS+=("$d"); printf '%s' "$d"; }
CHAN=""; [ "${1:-}" = "--chan" ] && CHAN="${2:-}"

khoi(){ awk -v o="<!-- <<<$1" -v c="$1>>> -->" '
  index($0,o){i=1;next} index($0,c){i=0} i' "$CONTRACT"; }

# ── fixture code-sinh dùng chung ────────────────────────────────────────────
gen_contract(){ # <thư mục> <slug> <hạng> <status> <dòng thêm> [<người duyệt>]
  # Người duyệt mặc định CÓ TÊN: chân Cổng-Bằng-chứng đo luật Cổng 2, nên hồ sơ
  # mẫu phải qua được Cổng 1 trước — để trống thì luật Cổng 1 nổ trước và chân
  # đo nhầm luật. (Chân đỏ đầu tiên bắt đúng lỗi fixture này.)
  mkdir -p "$1/_acceptance/$2"
  { printf -- "---\nschema_version: 1\nfeature: f\nslug: %s\nowner: o\nrisk_tier: %s\nstatus: %s\napproved_by: %s\napproved_at: 2026-08-14\n" "$2" "$3" "$4" "${6:-Manh Phan}"
    [ -n "${5:-}" ] && printf -- "%s\n" "$5"
    printf -- "---\n\n# c\n"; } > "$1/_acceptance/$2/contract.md"; }

# ── (1) cửa V ở lõi kiểm chặn-lúc-ghi ───────────────────────────────────────
if [ -z "$CHAN" ] || [ "$CHAN" = "hook" ]; then
  echo "== chân hook: cửa V =="
  out="$(node -e '
    const c=require(process.argv[1]);
    const mk=o=>"---\n"+Object.entries(o).map(([k,v])=>k+": "+v).join("\n")+"\n---\n";
    const run=(fm,old)=>c.evaluateContractWrite(mk(fm), old===null?null:mk(old));
    const base={status:"approved",approved_by:"",risk_tier:"T2"};
    const V={veto_state:"mo",veto_opened_at:"2026-08-14T10:00:00Z"};
    const cases=[
      ["a T2+V+vet CHO QUA",       {...base,...V},                                    false],
      ["b T3+V CHAN",              {...base,risk_tier:"T3",...V},                     true],
      ["c thieu vet CHAN",         {...base,veto_state:"mo"},                         true],
      ["d vet RAC CHAN",           {...base,veto_state:"mo",veto_opened_at:"xxx"},    true],
      ["e khong khoa V -> luat cu CHAN", {...base},                                   true],
      ["f khong khoa V + ten -> CHO",    {...base,approved_by:"Manh"},                false],
    ];
    for(const [n,fm,wantFail] of cases){
      const r=run(fm,{status:"draft"});
      console.log((r.anyFailure===wantFail?"OK|":"DO|")+n+"|"+(r.failures[0]||"").slice(0,54));
    }' "$ROOT/lib/evidence-core.cjs" 2>&1)"
  while IFS='|' read -r st n msg; do
    [ -n "${st:-}" ] || continue
    [ "$st" = "OK" ] && ok "hook $n ${msg:+:: $msg}" || bad "hook $n ${msg:+:: $msg}"
  done <<< "$out"
  # chiều đỏ: gỡ điều kiện hạng khỏi bản sao lõi → ca (b) phải thôi chặn
  d="$(tmpd)"; cp "$ROOT/lib/evidence-core.cjs" "$d/core.cjs"
  sed -i.bak "s/} else if (v.tier === 'T3') {/} else if (false) {/" "$d/core.cjs"
  m="$(node -e '
    const c=require(process.argv[1]);
    const mk=o=>"---\n"+Object.entries(o).map(([k,v])=>k+": "+v).join("\n")+"\n---\n";
    const r=c.evaluateContractWrite(mk({status:"approved",approved_by:"",risk_tier:"T3",veto_state:"mo",veto_opened_at:"2026-08-14T10:00:00Z"}),mk({status:"draft"}));
    console.log(r.anyFailure?"VAN-CHAN":"THOI-CHAN");' "$d/core.cjs" 2>&1)"
  [ "$m" = "THOI-CHAN" ] && mut "gỡ điều kiện hạng khỏi bản sao → T3 thôi bị chặn, tức chân (b) đo THẬT điều kiện đó" \
                          || bad "hook CHIỀU ĐỎ KHÔNG CHẠY: gỡ điều kiện hạng mà T3 vẫn chặn ($m)"
fi

# ── (2) hồi quy luật cũ: thông điệp so với MỐC, không so chính mình ─────────
if [ -z "$CHAN" ] || [ "$CHAN" = "hook-cu" ]; then
  echo "== chân hook-cũ: luật cũ nguyên văn so với BASE-V =="
  BASE="$(khoi BASE-V | tr -d '[:space:]')"
  if [ -z "$BASE" ] || ! git -C "$ROOT" cat-file -e "$BASE^{commit}" 2>/dev/null; then
    bad "hook-cũ: không đọc được mốc BASE-V ('$BASE') — phép so vô nghĩa"
  else
    d="$(tmpd)"; git -C "$ROOT" show "$BASE:lib/evidence-core.cjs" > "$d/base.cjs" 2>/dev/null
    for msg in "Gate 1 approval not recorded" "skips Gate 1"; do
      a=$(grep -Fc -- "$msg" "$d/base.cjs" || true); b=$(grep -Fc -- "$msg" "$ROOT/lib/evidence-core.cjs" || true)
      if [ "$a" -eq 0 ]; then bad "hook-cũ: thông điệp '$msg' KHÔNG có trên mốc — needle gõ theo trí nhớ"
      elif [ "$a" -eq "$b" ]; then ok "hook-cũ giữ nguyên ($b bản): $msg"
      else bad "hook-cũ LỆCH: '$msg' mốc=$a nay=$b"; fi
    done
    mut "so với mốc $BASE, KHÔNG rút bản chép từ chính cây sau sửa"
  fi
fi

# ── (3)(4)(5) pre-merge trên fixture code-sinh ──────────────────────────────
pm_fixture(){ # trả về thư mục repo giả đã commit, in ra SHA base
  local d; d="$(tmpd)"
  ( cd "$ROOT" && tar -cf - --exclude=.git --exclude=.worktrees --exclude=.claude lib scripts ) | tar -x -C "$d"
  mkdir -p "$d/_acceptance"
  ( cd "$d" && git init -q . && git add -A >/dev/null 2>&1 \
    && git -c user.email=t@t -c user.name=T commit -qm base >/dev/null 2>&1 )
  printf '%s' "$d"
}
gen_report(){ # <dir> <slug> <known> <vang?> <evidence>
  { printf -- "---\nschema_version: 1\nslug: %s\nverdict: PASS\nenforcement_mode: strict\nbypass_used: false\nverified_commit: %s\nhuman_signoff:\n---\n\n## Evidence\n\n%s\n" "$2" "$(git -C "$1" rev-parse HEAD)" "$5"
    [ "$4" != "novang" ] && printf -- "\n## Known limits\n\n%s\n\n## Ngoài hợp đồng\n\n" "$3"
  } > "$1/_acceptance/$2/evidence-report.md"; }
pm(){ ( cd "$1" && bash scripts/pre-merge-check.sh --base "$(git -C "$1" rev-parse HEAD)" 2>&1 ); }

if [ -z "$CHAN" ] || [ "$CHAN" = "premerge-sach" ]; then
  echo "== chân pre-merge: sáu điều kiện sạch =="
  d="$(pm_fixture)"
  chan_sach(){ # <nhãn> <hạng> <known> <vang> <evidence> <mong: NOTE|VIOLATION>
    rm -rf "$d"/_acceptance/*/; gen_contract "$d" s "$2" verified ""; gen_report "$d" s "$3" "$4" "$5"
    # Hỏi SỰ CÓ MẶT của VIOLATION, không đọc dòng đầu: đường không-sạch in
    # một dòng NOTE nêu lý do TRƯỚC dòng VIOLATION, nên `head -1` bắt nhầm
    # dòng giải thích và mọi ca đều đọc ra "NOTE".
    local out vio; out="$(pm "$d")"
    vio=$(printf '%s\n' "$out" | grep -cE "^VIOLATION \[s\]" || true)
    if [ "$6" = "VIOLATION" ] && [ "$vio" -gt 0 ]; then ok "sạch/$1 → VIOLATION"
    elif [ "$6" = "NOTE" ] && [ "$vio" -eq 0 ]; then ok "sạch/$1 → đi tiếp, không mời ký"
    else bad "sạch/$1 → mong $6, thấy $vio dòng VIOLATION: $(printf '%s\n' "$out" | grep -E "^(NOTE|VIOLATION) \[s\]" | head -1 | cut -c1-64)"; fi; }
  chan_sach "T2 đủ sáu"       T2 ""            ""       "ok"                 "NOTE"
  chan_sach "hạng T3"         T3 ""            ""       "ok"                 "VIOLATION"
  chan_sach "có known-limit"  T2 "- giới hạn"  ""       "ok"                 "VIOLATION"
  chan_sach "VẮNG hai mục"    T2 ""            novang   "ok"                 "VIOLATION"
  chan_sach "có UNCERTAIN"    T2 ""            ""       "verdict: UNCERTAIN" "VIOLATION"
  # bốn chân phiên chấm vòng 1 chỉ ra là ĐƯỢC HỨA mà chưa đo
  chan_verdict(){ # <nhãn> <dòng verdict> <mong>
    rm -rf "$d"/_acceptance/*/; gen_contract "$d" s T2 verified ""
    { printf -- "---\nschema_version: 1\nslug: s\n%senforcement_mode: strict\nbypass_used: %s\nverified_commit: %s\nhuman_signoff:\n---\n\n## Evidence\n\nok\n\n## Known limits\n\n\n## Ngoài hợp đồng\n\n%s\n" "$2" "${4:-false}" "$(git -C "$d" rev-parse HEAD)" "${5:-}"
    } > "$d/_acceptance/s/evidence-report.md"
    local vio; vio=$(pm "$d" | grep -cE "^VIOLATION \[s\]" || true)
    if [ "$3" = "VIOLATION" ] && [ "$vio" -gt 0 ]; then ok "sạch/$1 → VIOLATION"
    elif [ "$3" = "NOTE" ] && [ "$vio" -eq 0 ]; then ok "sạch/$1 → đi tiếp"
    else bad "sạch/$1 → mong $3, thấy $vio dòng VIOLATION"; fi; }
  chan_verdict "verdict REJECT"     "verdict: REJECT\n" VIOLATION
  chan_verdict "VẮNG khoá verdict"  ""                  VIOLATION
  chan_verdict "bypass_used true"   "verdict: PASS\n"   VIOLATION true
  chan_verdict "có finding ngoài HĐ" "verdict: PASS\n"  VIOLATION false "- một lỗi ngoài hợp đồng"
  mut "chín chân đi qua CHÍNH scripts/pre-merge-check.sh trên repo giả code-sinh"
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "premerge-dem" ] || [ "$CHAN" = "ghi-nguoc" ]; then
  # E3 và E3b từng dùng CHUNG khối này — hai eval id, một phép đo (phiên chấm
  # vòng 1 gọi tên). Nay mỗi cờ chạy đúng phần của mình.
  echo "== chân pre-merge: đếm cửa + chiều ghi-ngược =="
  d="$(pm_fixture)"
  gen_contract "$d" v1 T2 approved "veto_state: da-veto
veto_opened_at: 2026-08-14T10:00:00Z" ""
  ( cd "$d" && git add -A >/dev/null && git -c user.email=t@t -c user.name=T commit -qm v >/dev/null )
  B="$(git -C "$d" rev-parse HEAD)"
  o="$( cd "$d" && bash scripts/pre-merge-check.sh --base "$B" 2>&1 )"
  case "$o" in *"veto_state=da-veto chưa xử"*) ok "da-veto chưa xử → VIOLATION" ;; *) bad "da-veto chưa xử KHÔNG nổ" ;; esac
  gen_contract "$d" v1 T2 approved "veto_state: mo
veto_opened_at: 2026-08-14T10:00:00Z" ""
  ( cd "$d" && git add -A >/dev/null && git -c user.email=t@t -c user.name=T commit -qm flip >/dev/null )
  o="$( cd "$d" && bash scripts/pre-merge-check.sh --base "$B" 2>&1 )"
  case "$o" in *"da-veto -> mo mà KHÔNG có entry sổ"*) ok "ghi-ngược không vết → VIOLATION" ;; *) bad "ghi-ngược KHÔNG bị bắt" ;; esac
  case "$o" in *"cửa veto đang mở — 1 hồ sơ"*) ok "NOTE đếm cửa mở, đích danh slug" ;; *) bad "NOTE đếm cửa KHÔNG in" ;; esac
  printf '{"id":"d1","type":"fix","decision":"xử veto: quay lại phạm vi"}\n' > "$d/_acceptance/v1/decisions.jsonl"
  ( cd "$d" && git add -A >/dev/null && git -c user.email=t@t -c user.name=T commit -qm led >/dev/null )
  o="$( cd "$d" && bash scripts/pre-merge-check.sh --base "$B" 2>&1 )"
  case "$o" in *"veto đã xử"*) ok "giữ-gân: có entry sổ → CHO QUA, không chặn oan" ;; *) bad "giữ-gân ĐỎ: đường xử hợp lệ vẫn bị chặn" ;; esac
  # vế KHÔNG-ĐƯỢC-KÊU-OAN: không hồ sơ nào có cửa veto → im lặng hoàn toàn
  rm -rf "$d"/_acceptance/*/; gen_contract "$d" q T2 verified ""
  ( cd "$d" && git add -A >/dev/null && git -c user.email=t@t -c user.name=T commit -qm q >/dev/null )
  o="$( cd "$d" && bash scripts/pre-merge-check.sh --base "$B" 2>&1 )"
  if printf '%s' "$o" | grep -q "cửa veto đang mở"; then bad "kêu oan: không cửa nào mở mà vẫn in NOTE đếm"
  elif printf '%s' "$o" | grep -q "veto_state"; then bad "kêu oan: luật veto nổ trên hồ sơ không có khoá"
  else ok "không cửa veto → im lặng, luật mới KHÔNG kêu oan"; fi
  # chân XOÁ HẲN khoá khỏi hồ sơ đã rời draft
  gen_contract "$d" v2 T2 approved "veto_state: mo
veto_opened_at: 2026-08-14T10:00:00Z" ""
  ( cd "$d" && git add -A >/dev/null && git -c user.email=t@t -c user.name=T commit -qm v2 >/dev/null )
  B2="$( git -C "$d" rev-parse HEAD )"
  gen_contract "$d" v2 T2 approved "" ""
  ( cd "$d" && git add -A >/dev/null && git -c user.email=t@t -c user.name=T commit -qm gone >/dev/null )
  o="$( cd "$d" && bash scripts/pre-merge-check.sh --base "$B2" 2>&1 )"
  case "$o" in *"khoá veto_state biến mất"*) ok "xoá hẳn khoá khỏi hồ sơ đã rời draft → VIOLATION" ;;
    *) bad "xoá khoá KHÔNG bị bắt" ;; esac
  mut "sáu chân đi qua CHÍNH pre-merge trên repo giả, mỗi lượt một commit thật"
fi

# ── (6) tầng luật văn bản ───────────────────────────────────────────────────
if [ -z "$CHAN" ] || [ "$CHAN" = "vanban" ]; then
  echo "== chân luật văn bản: ba vế mới có mặt =="
  A="$ROOT/skills/acceptance/SKILL.md"; F="$ROOT/feature-loop/skills/feature-loop/SKILL.md"
  chan_ve(){ grep -qF -- "$2" "$1" && ok "văn bản: $3" || bad "văn bản THIẾU: $3 ($(basename "$1"))"; }
  chan_ve "$A" "Cổng Bằng chứng xanh-sạch" "vế xanh-sạch thôi mời ký (bản gốc)"
  chan_ve "$A" "Cổng Phạm vi T2 — máy chốt hợp đồng rồi ĐI TIẾP" "vế V ở Cổng Phạm vi (bản gốc)"
  chan_ve "$A" "nghi thức bắt-người-gõ-lệnh-nối tự tan" "vế lệnh-nối tự tan"
  chan_ve "$A" "KHÓ-ĐẢO luôn thắng xanh-sạch" "vế khó-đảo thắng xanh-sạch"
  chan_ve "$F" "khó-đảo LUÔN thắng" "vế khó-đảo (bản vòng lặp)"
  chan_ve "$F" "veto_state: mo" "vế V (bản vòng lặp)"
  d="$(tmpd)"; cp "$A" "$d/a.md"; sed -i.bak 's/KHÓ-ĐẢO luôn thắng xanh-sạch/xoá/' "$d/a.md"
  grep -qF "KHÓ-ĐẢO luôn thắng xanh-sạch" "$d/a.md" \
    && bad "văn bản CHIỀU ĐỎ KHÔNG CHẠY: xoá vế mà grep vẫn thấy" \
    || mut "bản đột biến mất vế khó-đảo → chân tương ứng sẽ ĐỎ"
fi

# ── (7) đẳng thức + sàn số ca ───────────────────────────────────────────────
if [ -z "$CHAN" ] || [ "$CHAN" = "so-ca" ]; then
  echo "== chân số ca: đẳng thức VÀ sàn =="
  dem(){ case "$1" in
    plugins) grep -cE '^  PASS: ' "$2" ;;
    workflows) awk '/^Results: [0-9]+ passed/{n++;s+=$2} END{if(n!=6) print "DONG-THIEU:" n; else print s+0}' "$2" ;;
    *) grep -E '^Results: [0-9]+ passed' "$2" | tail -1 | awk '{print $2+0}' ;; esac; }
  dl="$(tmpd)"
  san(){ khoi SO-CA-SAN-V | awk -v k="$1" '$1==k{print $2}'; }
  while read -r suite mong; do
    [ -n "${suite:-}" ] || continue
    ( cd "$ROOT" && bash "tests/$suite/run-tests.sh" ) > "$dl/$suite.log" 2>&1
    thay="$(dem "$suite" "$dl/$suite.log")"; s="$(san "$suite")"
    case "$thay" in DONG-THIEU:*) bad "số ca $suite: thiếu dòng tổng (${thay#DONG-THIEU:}/6)"; continue ;; esac
    if [ "$thay" != "$mong" ]; then bad "số ca $suite lệch kỳ vọng: $mong -> $thay"
    elif [ -n "$s" ] && [ "$thay" -lt "$s" ]; then bad "số ca $suite DƯỚI SÀN: sàn $s, thấy $thay"
    else ok "số ca $suite: $thay = $mong (≥ sàn ${s:-?})"; fi
  done < <(khoi SO-CA-KY-VONG-V | awk 'NF==2')
  if [ -f "$dl/plugins.log" ]; then
    t="$(dem plugins "$dl/plugins.log")"; cp "$dl/plugins.log" "$dl/m.log"; printf '  PASS: ca tiem\n' >> "$dl/m.log"
    [ "$(dem plugins "$dl/m.log")" -ne "$t" ] && mut "log tiêm thêm 1 ca: $t -> $(dem plugins "$dl/m.log")" \
      || bad "số ca CHIỀU ĐỎ KHÔNG CHẠY"
  fi
fi

echo
[ "$fails" -eq 0 ] && { echo "RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt"; exit 0; }
echo "RANG-VETO: $fails chân ĐỎ"; exit 1
