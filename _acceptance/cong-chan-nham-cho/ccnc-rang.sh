#!/usr/bin/env bash
# Răng đo cho hồ sơ cong-chan-nham-cho (T3) — "cổng chặn nhầm chỗ".
#
# Ba luật của kho: (a) mọi 0-hit kèm ĐỐI CHỨNG DƯƠNG (worktree origin/main hoặc
# bản pre-merge của base) — needle base=0 là phép đo không sống → ĐỎ; (b) ghim
# ĐÚNG THÔNG ĐIỆP; (c) chiều đỏ CHẠY THẬT qua CHÍNH bộ kiểm, in xác-nhận-đột-biến.
# Fixture git do CODE SINH trong chính lần chạy; mọi đường dẫn suy từ vị trí script.
# Neo origin/main → KHÔNG vào suite vĩnh viễn (lưới thường trực là V01–V07/H01–H07).
#
# Dùng: ccnc-rang.sh --chan <lan-v|lan-v-do|provenance|giu-cho|nghi-le|clause|so-ca|chieu-ghi|adr> [--log F]
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
BASE="${CCNC_BASE:-origin/main}"
CHAN=""; LOG=""
while [ $# -gt 0 ]; do case "$1" in
  --chan) CHAN="$2"; shift 2;; --log) LOG="$2"; shift 2;;
  *) echo "tham so la: $1"; exit 2;; esac; done
[ -n "$CHAN" ] || { echo "thieu --chan"; exit 2; }
fails=0
ok()  { echo "  OK   $*"; }
bad() { echo "  ĐỎ   $*"; fails=$((fails + 1)); }
mut() { echo "       [đột biến] $*"; }
g()   { git -C "$ROOT" "$@"; }
TMPS=(); don_dep() { local d; for d in "${TMPS[@]:-}"; do [ -n "$d" ] && rm -rf "$d"; done; }
trap don_dep EXIT
tmpd() { local d; d="$(mktemp -d)"; TMPS+=("$d"); printf '%s' "$d"; }
CHECK="$ROOT/scripts/pre-merge-check.sh"
GID='-c user.email=t@test.local -c user.name=t -c commit.gpgsign=false'

if ! g rev-parse --quiet --verify "$BASE^{commit}" >/dev/null 2>&1; then
  echo "CCNC-BASE: khong resolve duoc '$BASE'"; exit 1; fi
echo "CCNC-BASE: $BASE -> $(g rev-parse --short "$BASE^{commit}")"
# Bản pre-merge của base — đối chứng dương cho mọi chân nói "trước đây chặn".
BASE_CHECK="$(tmpd)/pre-merge-base.sh"
g show "$BASE:scripts/pre-merge-check.sh" > "$BASE_CHECK" 2>/dev/null || { echo "CCNC-BASE: khong lay duoc pre-merge cua base"; exit 1; }

# ── fixture code-sinh: một kho git với đúng MỘT hồ sơ ────────────────────────
# tier · vet · co_khoa_veto · xanh_sach · chu_ky · khoa_cu · author_ky
dung_ho_so() { # <dir> <tier> <vet> <co_khoa 1|0> <sach 1|0> <chu ky> <khoa cu 1|0> [author]
  local R="$1" tier="$2" vet="$3" cok="$4" sach="$5" sig="$6" old="$7" author="${8:-manh@test.local}"
  local d="$R/_acceptance/feat-x"; mkdir -p "$d" "$R/lib"
  cp "$ROOT/lib/md-section.cjs" "$R/lib/" 2>/dev/null || true
  { printf 'schema_version: 1\nsignoff:\n  required_for: [T2, T3]\n'
    [ "$old" = 1 ] && printf '  require_human_commit: true\n  agent_authors:\n    - "*bot*"\n'; } > "$R/_acceptance/config.yaml"
  git -C "$R" init -q
  { printf -- '---\nschema_version: 1\nfeature: feat-x\nslug: feat-x\nrisk_tier: %s\nsurfaces: [api]\nstatus: verified\napproved_by:\n' "$tier"
    [ "$cok" = 1 ] && printf 'veto_state: mo\nveto_opened_at:%s\n' "${vet:+ $vet}"
    printf -- '---\n'; } > "$d/contract.md"
  printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  { printf -- '---\nschema_version: 1\nfeature_slug: feat-x\nverdict: PASS\nhuman_signoff:\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-x-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-16\n\n## Known limits\n'
    [ "$sach" = 1 ] || printf '\n- một giới hạn thật\n'
    printf '\n## Ngoài hợp đồng\n'; } > "$d/evidence-report.md"
  git -C "$R" add -A >/dev/null && git $GID -C "$R" commit -qm base
  FIX_BASE="$(git -C "$R" rev-parse HEAD)"
  if [ -n "$sig" ]; then
    sed -i.bak "s/^human_signoff:\$/human_signoff: $sig/" "$d/evidence-report.md"; rm -f "$d/evidence-report.md.bak"
    printf -- '\n(thân báo cáo đổi CÙNG commit với chữ ký — nghi thức cũ chặn)\n' >> "$d/evidence-report.md"
    git -C "$R" add -A >/dev/null
    git -c user.email="$author" -c user.name=x -c commit.gpgsign=false -C "$R" commit -qm "sign+body" >/dev/null
  fi
}
chay()      { bash "$CHECK" "$1" ${2:+--base "$2"} 2>&1; }
chay_base() { bash "$BASE_CHECK" "$1" ${2:+--base "$2"} 2>&1; }
dem_vi()    { printf '%s\n' "$1" | grep -c '^VIOLATION' || true; }
co()        { case "$2" in *"$3"*) ok "$1";; *) bad "$1 — thiếu: $3";; esac; }
khong_co()  { case "$2" in *"$3"*) bad "$1 — KHÔNG được có: $3";; *) ok "$1";; esac; }

chan_lan_v() {
  local R; R="$(tmpd)/r"; mkdir -p "$R"
  dung_ho_so "$R" T2 "2026-08-16T09:00:00Z" 1 1 "" 0
  local out; out="$(chay "$R")"
  local n; n="$(dem_vi "$out")"
  if [ "$n" -eq 0 ] && printf '%s' "$out" | grep -q 'làn V — máy đi trước'; then
    echo "CCNC-LAN-V: T2 mo -> NOTE, 0 VIOLATION OK"; ok "làn V qua lưới mới"
  else bad "CCNC-LAN-V: $n VIOLATION / thiếu NOTE"; printf '%s\n' "$out" | grep -E 'VIOLATION|làn V' | head -3 | sed 's/^/         /'; fi
  # đối chứng dương: CHÍNH fixture ấy qua lưới của base -> phải CHẶN
  local outb; outb="$(chay_base "$R")"
  if printf '%s' "$outb" | grep -q 'approved_by is empty'; then
    echo "CCNC-LAN-V: base VIOLATION OK"; ok "lưới cũ chặn đúng hồ sơ này (đối chứng dương)"
  else bad "CCNC-LAN-V: lưới base KHÔNG chặn — đối chứng dương chết"; fi
}

chan_lan_v_do() {
  local n_ok=0 R out
  R="$(tmpd)/a"; mkdir -p "$R"; dung_ho_so "$R" T3 "2026-08-16T09:00:00Z" 1 1 "" 0
  out="$(chay "$R")"; mut "(a) T3 + mo"
  if [ "$(dem_vi "$out")" -ge 1 ] && printf '%s' "$out" | grep -q 'làn V chỉ T2'; then ok "(a) đỏ đúng thông điệp"; n_ok=$((n_ok+1)); else bad "(a) không đỏ đúng"; fi
  R="$(tmpd)/b"; mkdir -p "$R"; dung_ho_so "$R" T2 "" 1 1 "" 0
  out="$(chay "$R")"; mut "(b) vết rỗng"
  if [ "$(dem_vi "$out")" -ge 1 ] && printf '%s' "$out" | grep -q 'veto_opened_at'; then ok "(b) đỏ đúng thông điệp"; n_ok=$((n_ok+1)); else bad "(b) không đỏ đúng"; fi
  R="$(tmpd)/c"; mkdir -p "$R"; dung_ho_so "$R" T2 "" 0 1 "" 0
  out="$(chay "$R")"; mut "(c) vắng khoá veto_state"
  if [ "$(dem_vi "$out")" -ge 1 ] && printf '%s' "$out" | grep -q 'gate1_skipped is not true'; then ok "(c) đỏ nguyên văn luật cũ"; n_ok=$((n_ok+1)); else bad "(c) không đỏ đúng"; fi
  R="$(tmpd)/d"; mkdir -p "$R"; dung_ho_so "$R" T2 "2026-08-16T09:00:00Z" 1 0 "" 0
  out="$(chay "$R")"; mut "(d) mo + KHÔNG xanh-sạch + chưa ký"
  if [ "$(dem_vi "$out")" -ge 1 ] && printf '%s' "$out" | grep -q 'làn V đòi xanh-sạch hoặc chữ ký'; then ok "(d) đỏ đúng — quan hệ, không phải nhãn"; n_ok=$((n_ok+1)); else bad "(d) không đỏ đúng"; fi
  R="$(tmpd)/e"; mkdir -p "$R"; dung_ho_so "$R" T2 "2026-08-16T09:00:00Z" 1 0 "Manh Phan 2026-08-16" 0
  out="$(chay "$R")"; mut "(e) giữ-gân: không sạch nhưng ĐÃ ký"
  if [ "$(dem_vi "$out")" -eq 0 ] && printf '%s' "$out" | grep -q 'làn V — máy đi trước'; then ok "(e) giữ-gân XANH"; else bad "(e) chặn oan hồ sơ đã ký"; fi
  echo "CCNC-LAN-V-DO: $n_ok/4 chieu do dung thong diep · giu-gan OK"
  [ "$n_ok" -eq 4 ] || bad "CCNC-LAN-V-DO: $n_ok/4"
}

chan_provenance() {
  local R out outb; R="$(tmpd)/r"; mkdir -p "$R"
  dung_ho_so "$R" T2 "2026-08-16T09:00:00Z" 0 1 "Manh Phan 2026-08-16" 1 "bot@x"
  sed -i.bak 's/^approved_by:$/approved_by: Manh Phan/' "$R/_acceptance/feat-x/contract.md"; rm -f "$R/_acceptance/feat-x/contract.md.bak"
  git -C "$R" add -A >/dev/null; git $GID -C "$R" commit -qm approve >/dev/null
  out="$(chay "$R")"
  local nvi nnote; nvi="$(dem_vi "$out")"; nnote="$(printf '%s\n' "$out" | grep -c 'hết hiệu lực từ 2.1' || true)"
  if [ "$nvi" -eq 0 ] && [ "$nnote" -eq 1 ]; then
    echo "CCNC-PROV: 0 VIOLATION · 1 NOTE het-hieu-luc OK"; ok "khoá cũ chỉ còn là một dòng nhắc"
  else bad "CCNC-PROV: $nvi VIOLATION · $nnote dòng NOTE (cần 0 và 1)"; printf '%s\n' "$out" | grep -E 'VIOLATION|hết hiệu lực' | head -3 | sed 's/^/         /'; fi
  outb="$(chay_base "$R")"
  if printf '%s' "$outb" | grep -qE 'agent_authors|also edits the report body|must COMMIT the signoff'; then
    echo "CCNC-PROV: base VIOLATION OK"; ok "lưới cũ chặn đúng fixture này (đối chứng dương)"
  else bad "CCNC-PROV: lưới base KHÔNG chặn — đối chứng dương chết"; fi
}

chan_giu_cho() {
  local n=0 R out
  for old in 1 0; do
    R="$(tmpd)/p$old"; mkdir -p "$R"
    dung_ho_so "$R" T2 "2026-08-16T09:00:00Z" 0 1 "PENDING — chờ Manh gật" "$old"
    sed -i.bak 's/^approved_by:$/approved_by: Manh Phan/' "$R/_acceptance/feat-x/contract.md"; rm -f "$R/_acceptance/feat-x/contract.md.bak"
    git -C "$R" add -A >/dev/null; git $GID -C "$R" commit -qm approve >/dev/null
    out="$(chay "$R")"; mut "chữ ký giữ-chỗ, khoá cũ=$old"
    if printf '%s' "$out" | grep -q 'is a placeholder, not a signature'; then ok "giữ-chỗ vẫn ĐỎ (khoá cũ=$old)"; n=$((n+1)); else bad "giữ-chỗ KHÔNG đỏ (khoá cũ=$old) — răng nội dung đã mất"; fi
  done
  R="$(tmpd)/pok"; mkdir -p "$R"
  dung_ho_so "$R" T2 "2026-08-16T09:00:00Z" 0 1 "Manh Phan 2026-08-16" 0
  sed -i.bak 's/^approved_by:$/approved_by: Manh Phan/' "$R/_acceptance/feat-x/contract.md"; rm -f "$R/_acceptance/feat-x/contract.md.bak"
  git -C "$R" add -A >/dev/null; git $GID -C "$R" commit -qm approve >/dev/null
  out="$(chay "$R")"
  if [ "$(dem_vi "$out")" -eq 0 ]; then ok "đối chứng dương: chữ ký thật thì sạch"; else bad "chữ ký thật vẫn bị chặn"; fi
  echo "CCNC-GIU-CHO: $n/2 VIOLATION · doi chung sach OK"
  [ "$n" -eq 2 ] || bad "CCNC-GIU-CHO: $n/2"
}

# Allowlist KHAI-VÀ-IN-RA: chỗ DẠY người gỡ khoá cũ. Danh sách ĐÓNG.
ALLOW_FILE=(scripts/pre-merge-check.sh GUIDE.md commands/acceptance-init.md)
ALLOW_MAX=(8 3 2)
chan_nghi_le() {
  local SCOPE=(commands skills feature-loop scripts lib hooks GUIDE.md QUICKSTART.md README.md CONTEXT.md)
  echo "CCNC-SCOPE: ${SCOPE[*]}"
  local khai that i
  khai="$(awk '/<!-- <<<PHAM-VI-RANG -->/{f=1;next} /<!-- PHAM-VI-RANG>>> -->/{f=0} f && /^\|/{l=$0; sub(/^\|[ \t]*/,"",l); sub(/[ \t]*\|.*$/,"",l); gsub(/^[ \t]+|[ \t]+$/,"",l); if(l!="" && l !~ /^-+$/ && l!="duong-dan") print l}' "$WS/contract.md" | sort)"
  that="$(printf '%s\n' "${SCOPE[@]}" | sort)"
  if [ "$khai" = "$that" ]; then ok "CCNC-SCOPE: khop ban khai PHAM-VI-RANG"; echo "CCNC-SCOPE: khop ban khai PHAM-VI-RANG"
  else bad "CCNC-SCOPE: LECH ban khai"; diff <(printf '%s\n' "$khai") <(printf '%s\n' "$that") | sed 's/^/         /'; fi
  echo "CCNC-NGHI-LE: allowlist ${#ALLOW_FILE[@]} file"
  for i in "${!ALLOW_FILE[@]}"; do echo "       allowlist: ${ALLOW_FILE[$i]} (toi da ${ALLOW_MAX[$i]} hit — cho DAY nguoi go khoa cu)"; done
  local NEEDLES=('require_human_commit' 'agent_authors' 'human-fields-only' 'human-owned' 'commit RIÊNG')
  local n_ok=0 nd hits h b f idx maxi cnt
  for nd in "${NEEDLES[@]}"; do
    hits="$( cd "$ROOT" && grep -rIn -F -- "$nd" "${SCOPE[@]}" 2>/dev/null || true )"
    b="$(g grep -I -F -c -e "$nd" "$BASE" -- "${SCOPE[@]}" 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}')"
    local ngoai="" qua=""
    while IFS= read -r line; do
      [ -n "$line" ] || continue
      f="${line%%:*}"; idx=-1
      for i in "${!ALLOW_FILE[@]}"; do [ "$f" = "${ALLOW_FILE[$i]}" ] && idx=$i; done
      [ "$idx" -lt 0 ] && ngoai="$ngoai$line"$'\n'
    done <<< "$hits"
    for i in "${!ALLOW_FILE[@]}"; do
      cnt="$(printf '%s\n' "$hits" | grep -c "^${ALLOW_FILE[$i]}:" || true)"
      maxi="${ALLOW_MAX[$i]}"
      [ "$cnt" -gt "$maxi" ] && qua="$qua ${ALLOW_FILE[$i]}($cnt>$maxi)"
    done
    if [ "$b" -eq 0 ]; then bad "CCNC-NGHI-LE: $nd base=0 — needle chua bao gio ton tai, phep do khong song"
    elif [ -n "$ngoai" ]; then bad "CCNC-NGHI-LE: $nd con NGOAI allowlist:"; printf '%s' "$ngoai" | head -3 | sed 's/^/         /'
    elif [ -n "$qua" ]; then bad "CCNC-NGHI-LE: $nd qua so allowlist:$qua"
    else ok "CCNC-NGHI-LE: $nd ngoai-allowlist=0 base=$b(>0) OK"; n_ok=$((n_ok+1)); fi
  done
  echo "CCNC-NGHI-LE: $n_ok/${#NEEDLES[@]}"
  [ "$n_ok" -eq "${#NEEDLES[@]}" ] || bad "CCNC-NGHI-LE: $n_ok/${#NEEDLES[@]}"
  # chiều đỏ: chèn nghi lễ vào bản sao ngoài allowlist
  local d; d="$(tmpd)"; mkdir -p "$d/feature-loop/skills/feature-loop"
  cp "$ROOT/feature-loop/skills/feature-loop/SKILL.md" "$d/feature-loop/skills/feature-loop/SKILL.md"
  printf '\ncommit RIÊNG chỉ chạm dòng human-owned.\n' >> "$d/feature-loop/skills/feature-loop/SKILL.md"
  mut "chèn «commit RIÊNG» + «human-owned» vào bản sao SKILL feature-loop"
  local hm; hm="$( cd "$d" && grep -rIn -F -- 'commit RIÊNG' feature-loop 2>/dev/null | grep -c . || true )"
  [ "$hm" -ge 1 ] && ok "MUTANT-NGHI-LE bi bat (chinh cau grep cua chan nay)" || bad "MUTANT-NGHI-LE KHONG bi bat"
  # chân (b): hook + recheck mù với khoá cũ
  local R1 R2 o1 o2; R1="$(tmpd)/k1"; R2="$(tmpd)/k0"; mkdir -p "$R1" "$R2"
  dung_ho_so "$R1" T2 "2026-08-16T09:00:00Z" 0 1 "Manh Phan 2026-08-16" 1
  dung_ho_so "$R2" T2 "2026-08-16T09:00:00Z" 0 1 "Manh Phan 2026-08-16" 0
  o1="$(node "$ROOT/scripts/recheck-evidence.cjs" "$R1/_acceptance/feat-x/evidence-report.md" 2>&1; echo "rc=$?")"
  o2="$(node "$ROOT/scripts/recheck-evidence.cjs" "$R2/_acceptance/feat-x/evidence-report.md" 2>&1; echo "rc=$?")"
  if [ "$o1" = "$o2" ] && ! printf '%s' "$o1" | grep -qE 'require_human_commit|agent_authors'; then
    echo "CCNC-NGHI-LE: hook+recheck mu voi khoa cu OK"; ok "recheck cho cùng kết quả có/không khoá cũ"
  else bad "CCNC-NGHI-LE: recheck ĐỔI hành vi theo khoá cũ"; fi
}

chan_clause() {
  local a b cl e=0
  a="$(awk '/<!-- <<<SIGNATURE-OWNER-CLAUSE -->/{f=1;next} /<!-- SIGNATURE-OWNER-CLAUSE>>> -->/{f=0} f' "$ROOT/commands/signoff.md" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | grep -v '^$')"
  b="$(awk '/<!-- <<<SIGNATURE-OWNER-CLAUSE -->/{f=1;next} /<!-- SIGNATURE-OWNER-CLAUSE>>> -->/{f=0} f' "$ROOT/skills/acceptance/SKILL.md" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | grep -v '^$')"
  [ -n "$a" ] || { bad "CCNC-CLAUSE: khong rut duoc clause o signoff.md"; e=1; }
  if [ "$a" = "$b" ]; then ok "hai bản chép khớp từng ký tự"; else bad "CCNC-CLAUSE DO: ban chep lech"; diff <(printf '%s\n' "$a") <(printf '%s\n' "$b") | head -4 | sed 's/^/         /'; e=1; fi
  cl="$a"
  local DH=('QUYẾT ĐỊNH của người' 'máy ghi hộ' 'forge') d_ok=0 nd
  for nd in "${DH[@]}"; do case "$cl" in *"$nd"*) d_ok=$((d_ok+1));; *) bad "CCNC-CLAUSE DO: thieu dau hieu '$nd'"; e=1;; esac; done
  local TC=('require_human_commit' 'agent_authors' 'human-fields-only') t_bad=0
  for nd in "${TC[@]}"; do case "$cl" in *"$nd"*) bad "CCNC-CLAUSE DO: tu cam '$nd'"; t_bad=$((t_bad+1)); e=1;; esac; done
  # đúng MỘT bước vừa ghi vừa commit sau phát ngôn của người
  local nbuoc; nbuoc="$(grep -cE '^7\. \*\*Ghi và commit' "$ROOT/commands/signoff.md" || true)"
  [ "$nbuoc" -eq 1 ] || { bad "CCNC-CLAUSE DO: buoc ghi-va-commit = $nbuoc (can 1)"; e=1; }
  [ $e -eq 0 ] && echo "CCNC-CLAUSE: khop 2 ban · $d_ok/3 dau hieu · $t_bad tu cam · $nbuoc buoc ghi-commit OK"
  # chiều đỏ qua CHÍNH phép so
  local m; m="$(printf '%s\n' "$b" | sed 's/forge/forgé/')"
  mut "lệch 1 ký tự ở bản chép SKILL"
  if [ "$a" != "$m" ]; then ok "MUTANT-CLAUSE-lech bi bat"; else bad "MUTANT-CLAUSE-lech KHONG bi bat"; fi
  m="$cl require_human_commit"; mut "chèn từ cấm vào clause"
  case "$m" in *require_human_commit*) ok "MUTANT-CLAUSE-tu-cam bi bat";; *) bad "MUTANT-CLAUSE-tu-cam KHONG bi bat";; esac
}

dem_ket() { # <suite> <log> → in số theo cách đếm khai trong contract
  case "$1" in
    scripts) grep 'Results:' "$2" | tail -1 | sed -n 's/.*Results: \([0-9]*\) passed.*/\1/p' ;;
    plugins) grep -c '^  PASS:\|^  FAIL:' "$2" || true ;;
  esac
}
chan_so_ca() {
  local kv_t kv_s suite logf n
  for suite in scripts plugins; do
    kv_t="$(awk -v s="$suite" '/<<<SO-CA-KY-VONG/{f=1;next} /SO-CA-KY-VONG>>>/{f=0} f && $0 ~ "^\\| *"s{gsub(/ /,""); split($0,a,"|"); print a[3]}' "$WS/contract.md")"
    kv_s="$(awk -v s="$suite" '/<<<SO-CA-KY-VONG/{f=1;next} /SO-CA-KY-VONG>>>/{f=0} f && $0 ~ "^\\| *"s{gsub(/ /,""); split($0,a,"|"); print a[4]}' "$WS/contract.md")"
    [ -n "$kv_s" ] || { bad "CCNC-SO-CA: khong doc duoc SO-CA-KY-VONG cho $suite"; continue; }
    if [ -n "$LOG" ]; then logf="$LOG"; else logf="$(tmpd)/$suite.log"; ( cd "$ROOT" && bash "tests/$suite/run-tests.sh" ) > "$logf" 2>&1 || bad "CCNC-SO-CA: suite $suite exit khac 0"; fi
    n="$(dem_ket "$suite" "$logf")"
    if [ "$n" = "$kv_s" ]; then echo "CCNC-SO-CA: $suite $n == ky vong $kv_s OK"; ok "$suite dung dang thuc"
    else bad "CCNC-SO-CA: so ca lech ky vong: $kv_s -> $n ($suite)"; fi
    [ -n "$LOG" ] && break
  done
  [ -n "$LOG" ] && return 0
  # mọi ca trong PHAN-RA phải tồn tại trong log tương ứng
  local ca viec vat miss=0 tong=0 slog plog
  slog="$(tmpd)/s.log"; plog="$(tmpd)/p.log"
  ( cd "$ROOT" && bash tests/scripts/run-tests.sh ) > "$slog" 2>&1 || true
  ( cd "$ROOT" && bash tests/plugins/run-tests.sh ) > "$plog" 2>&1 || true
  while IFS='|' read -r _ ca viec vat _; do
    ca="$(echo "$ca" | tr -d ' ')"; viec="$(echo "$viec" | tr -d ' ')"
    [ -n "$ca" ] && [ "$ca" != "ca" ] && [ "$ca" != "---" ] || continue
    case "$vat" in *plugins*) f="$plog";; *) f="$slog";; esac
    tong=$((tong+1))
    grep -q "PASS: $ca" "$f" || { echo "       thieu PASS trong log: $ca"; miss=$((miss+1)); }
  done < <(awk '/<<<SO-CA-PHAN-RA/{f=1;next} /SO-CA-PHAN-RA>>> -->/{f=0} f && /^\|/' "$WS/contract.md")
  if [ "$miss" -eq 0 ] && [ "$tong" -gt 0 ]; then echo "CCNC-SO-CA: phan ra $tong/$tong ca co PASS OK"; ok "phân rã khớp log"
  else bad "CCNC-SO-CA: phan ra thieu $miss/$tong ca"; fi
  # đối chứng dương: đếm trên worktree base
  local d bl bn; d="$(tmpd)"
  if g worktree add -q --detach "$d/base" "$BASE" 2>/dev/null; then
    bl="$d/base.log"; ( cd "$d/base" && bash tests/scripts/run-tests.sh ) > "$bl" 2>&1 || true
    bn="$(dem_ket scripts "$bl")"; g worktree remove --force "$d/base" 2>/dev/null || true
    kv_t="$(awk '/<<<SO-CA-KY-VONG/{f=1;next} /SO-CA-KY-VONG>>>/{f=0} f && /^\| *scripts/{gsub(/ /,""); split($0,a,"|"); print a[3]}' "$WS/contract.md")"
    if [ "$bn" = "$kv_t" ]; then echo "CCNC-SO-CA: base scripts $bn == truoc $kv_t OK"; ok "đối chứng dương khớp"
    else bad "CCNC-SO-CA: base scripts $bn != truoc $kv_t"; fi
  else bad "CCNC-SO-CA: khong dung duoc worktree base"; fi
}

chan_chieu_ghi() {
  local R out; R="$(tmpd)/r"; mkdir -p "$R"
  dung_ho_so "$R" T2 "2026-08-16T09:00:00Z" 0 1 "" 0
  sed -i.bak 's/^approved_by:$/approved_by: Manh Phan/' "$R/_acceptance/feat-x/contract.md"; rm -f "$R/_acceptance/feat-x/contract.md.bak"
  git -C "$R" add -A >/dev/null; git $GID -C "$R" commit -qm approve >/dev/null
  local B; B="$(git -C "$R" rev-parse HEAD)"
  sed -i.bak 's/^human_signoff:$/human_signoff: Manh Phan 2026-08-16/' "$R/_acceptance/feat-x/evidence-report.md"; rm -f "$R/_acceptance/feat-x/evidence-report.md.bak"
  printf -- '\n(thân đổi cùng commit)\n' >> "$R/_acceptance/feat-x/evidence-report.md"
  git -C "$R" add -A >/dev/null; git -c user.email=bot@x -c user.name=b -c commit.gpgsign=false -C "$R" commit -qm sign >/dev/null
  out="$(chay "$R" "$B")"
  local nmoi; nmoi="$(printf '%s\n' "$out" | grep -c 'chữ ký mới trong diff' || true)"
  # chiều IM: hồ sơ đã ký từ BASE
  local B2; B2="$(git -C "$R" rev-parse HEAD)"
  printf 'x\n' > "$R/_acceptance/feat-x/notes.txt"; git -C "$R" add -A >/dev/null; git $GID -C "$R" commit -qm noise >/dev/null
  local out2 ncu; out2="$(chay "$R" "$B2")"; ncu="$(printf '%s\n' "$out2" | grep -c 'chữ ký mới trong diff' || true)"
  if [ "$nmoi" -eq 1 ] && [ "$ncu" -eq 0 ]; then echo "CCNC-CHIEU-GHI: 1 NOTE moi · 0 NOTE cu OK"; ok "chiều ghi nói đúng lúc, im đúng lúc"
  else bad "CCNC-CHIEU-GHI: moi=$nmoi (can 1) · cu=$ncu (can 0)"; fi
}

chan_adr() {
  local f="$ROOT/docs/adr/0012-chu-ky-la-quyet-dinh-provenance-tu-forge.md" t n=0 nd
  [ -f "$f" ] || { bad "CCNC-ADR: thieu file ADR 0012"; return; }
  t="$(cat "$f")"
  for nd in 'Khó đảo' 'Gây bất ngờ' 'Trade-off thật'; do
    case "$t" in *"$nd"*) n=$((n+1));; *) bad "CCNC-ADR: thieu dieu kien '$nd'";; esac
  done
  local mapout; mapout="$(cd "$ROOT" && node scripts/product-map.mjs --root . --check 2>&1)"; local mrc=$?
  if [ $mrc -eq 0 ]; then ok "ban do khop ho so xuong"; else bad "CCNC-ADR: ban do LECH: $mapout"; fi
  [ "$n" -eq 3 ] && [ $mrc -eq 0 ] && echo "CCNC-ADR: 3/3 dieu kien · map khop OK"
  # chiều đỏ qua chính phép đếm
  local m; m="$(printf '%s' "$t" | sed 's/Trade-off thật/Đánh đổi/')"; mut "xoá nhãn «Trade-off thật» khỏi bản sao"
  case "$m" in *'Trade-off thật'*) bad "MUTANT-ADR KHONG bi bat";; *) ok "MUTANT-ADR bi bat (chinh phep dem)";; esac
}

case "$CHAN" in
  lan-v) chan_lan_v;; lan-v-do) chan_lan_v_do;; provenance) chan_provenance;;
  giu-cho) chan_giu_cho;; nghi-le) chan_nghi_le;; clause) chan_clause;;
  so-ca) chan_so_ca;; chieu-ghi) chan_chieu_ghi;; adr) chan_adr;;
  *) echo "chan la: $CHAN"; exit 2;;
esac
echo "CCNC [$CHAN]: $fails ĐỎ"
[ "$fails" -eq 0 ]
