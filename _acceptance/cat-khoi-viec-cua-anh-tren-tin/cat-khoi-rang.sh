#!/usr/bin/env bash
# Răng đo cho hồ sơ cat-khoi-viec-cua-anh-tren-tin — "chỉ TRỪ trên tin mời cổng".
#
# Vật được giao là SỰ VẮNG MẶT của một khuôn + một câu điều khoản mới. Ba luật:
#   (a) mọi 0-hit kèm ĐỐI CHỨNG DƯƠNG trên `origin/main` (needle base=0 = phép đo
#       không sống → ĐỎ, không xanh);
#   (b) GHIM ĐÚNG THÔNG ĐIỆP đã hứa trong evals.yaml;
#   (c) chiều đỏ CHẠY THẬT qua CHÍNH hàm kiểm trên bản sao (cờ --tu-kiem), in
#       xác-nhận-đột-biến.
# Đường dẫn SUY TỪ VỊ TRÍ SCRIPT. Neo origin/main → KHÔNG vào suite vĩnh viễn
# (sau khi hồ sơ merge, needle về 0 hai đầu và chân khuon tự tuyên "không sống").
#
# Dùng: cat-khoi-rang.sh --chan khuon|clause|oneshot|so-ca [--log F] [--tu-kiem]
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
BASE="${CAT_KHOI_BASE:-origin/main}"
CHAN=""; LOG=""; TUKIEM=0
while [ $# -gt 0 ]; do case "$1" in
  --chan) CHAN="$2"; shift 2;; --log) LOG="$2"; shift 2;; --tu-kiem) TUKIEM=1; shift;;
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
LAW="skills/acceptance/references/human-facing-language.md"

khoi_bang() {   # $1 tệp, $2 marker → in cột một của bảng (bỏ header/---)
  awk -v o="<!-- <<<$2 -->" -v c="<!-- $2>>> -->" '
    index($0,o){f=1;next} index($0,c){f=0}
    f && /^\|/ { l=$0; sub(/^\|[ \t]*/,"",l); sub(/[ \t]*\|.*$/,"",l); gsub(/^[ \t]+|[ \t]+$/,"",l);
      if (l=="" || l ~ /^-+$/ || l=="duong-dan" || l=="ca" || l=="suite") next; print l }' "$1"
}
rut_marker() { printf '%s\n' "$1" | awk -v m="$2" 'index($0,"<<<" m){f=1;next} index($0,m ">>>"){f=0} f{print}'; }
khoi_tep() { rut_marker "$(cat "$1")" "$2"; }

if [ "$CHAN" != "so-ca" ] || [ -z "$LOG" ]; then
  if ! g rev-parse --quiet --verify "$BASE^{commit}" >/dev/null 2>&1; then
    echo "CAT-BASE: khong resolve duoc '$BASE'"; exit 1; fi
  echo "CAT-BASE: $BASE -> $(g rev-parse --short "$BASE^{commit}")"
fi

# ═══════════════════ chân khuon (E1 · AC-1) ════════════════════════════════
chan_khuon() {
  SCOPE=(commands skills feature-loop scripts GUIDE.md QUICKSTART.md README.md CONTEXT.md)
  echo "CAT-SCOPE: ${SCOPE[*]}"
  for sp in "${SCOPE[@]}"; do [ -e "$ROOT/$sp" ] || { echo "CAT-SCOPE: muc KHONG TON TAI: $sp"; exit 1; }; done
  local khai that
  khai="$(khoi_bang "$WS/contract.md" PHAM-VI-RANG | sort)"; that="$(printf '%s\n' "${SCOPE[@]}" | sort)"
  if [ -z "$khai" ]; then bad "CAT-SCOPE: khong rut duoc PHAM-VI-RANG"
  elif [ "$khai" = "$that" ]; then ok "CAT-SCOPE: khop ban khai PHAM-VI-RANG"
  else bad "CAT-SCOPE: LECH ban khai PHAM-VI-RANG"; diff <(printf '%s\n' "$khai") <(printf '%s\n' "$that") | sed 's/^/         /'; fi
  # Loại trừ KHAI-VÀ-IN-RA: thẻ (gate-card.js) giữ khuôn liệt kê — Out of scope.
  local NEEDLES=('YOUR-MOVE-BLOCK-TEMPLATE' 'mỗi mục đủ 3 vế' 'câu tu từ mang dấu hỏi'
                 'Trả lời mẫu (một dòng, điền vào chỗ trống)' 'khối 👉' 'kết bằng đúng MỘT khối')
  local LOAI_TRU=('Trả lời mẫu (một dòng, điền vào chỗ trống)' 'khối 👉')
  QUET_ROOT="${QUET_ROOT:-$ROOT}"
  loai_tru() { local x; for x in "${LOAI_TRU[@]}"; do [ "$x" = "$1" ] && return 0; done; return 1; }
  head_hits() { local out; out="$( cd "$QUET_ROOT" && grep -rIn -F -- "$1" "${SCOPE[@]}" 2>/dev/null || true )"
    if loai_tru "$1"; then printf '%s\n' "$out" | grep -v '^scripts/gate-card.js:' | grep . || true; else printf '%s\n' "$out" | grep . || true; fi; }
  base_n() { g grep -I -F -c -e "$1" "$BASE" -- "${SCOPE[@]}" 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}'; }
  local n_ok=0 tong=${#NEEDLES[@]} nd h b
  for nd in "${NEEDLES[@]}"; do
    loai_tru "$nd" && echo "CAT-KHUON: loai tru gate-card.js cho $nd — the giu nguyen, Out of scope"
    h="$(head_hits "$nd" | grep -c . || true)"; b="$(base_n "$nd")"
    if [ "$b" -eq 0 ]; then bad "CAT-KHUON: $nd base=0 — needle chua bao gio ton tai, phep do khong song"
    elif [ "$h" -ne 0 ]; then bad "CAT-KHUON: $nd con o $(head_hits "$nd" | head -1 | cut -d: -f1,2)"; head_hits "$nd" | head -3 | sed 's/^/         /'
    else ok "CAT-KHUON: $nd HEAD=0 base=$b(>0) OK"; n_ok=$((n_ok+1)); fi
  done
  echo "CAT-KHUON: $n_ok/$tong"; [ "$n_ok" -eq "$tong" ] || bad "CAT-KHUON: $n_ok/$tong needle sach"
  if [ "$TUKIEM" -eq 1 ]; then
    local d; d="$(tmpd)"; mkdir -p "$d/feature-loop/skills/feature-loop"
    for sp in "${SCOPE[@]}"; do cp -R "$ROOT/$sp" "$d/$sp"; done
    printf '\nMọi tin mời cổng kết bằng khối YOUR-MOVE-BLOCK-TEMPLATE.\n' >> "$d/feature-loop/skills/feature-loop/SKILL.md"
    mut "chèn YOUR-MOVE-BLOCK-TEMPLATE vào bản sao SKILL feature-loop"
    local hm; hm="$( QUET_ROOT="$d" head_hits 'YOUR-MOVE-BLOCK-TEMPLATE' | grep -c . || true )"
    [ "$hm" -ge 1 ] && ok "MUTANT-KHUON bi bat: HEAD=$hm o bản sao (chinh head_hits)" || bad "MUTANT-KHUON KHONG bi bat — phep do chet"
  fi
}

# ═══════════════════ chân clause (E2 · AC-2) ═══════════════════════════════
kiem_clause() {   # $1 = văn bản bản luật → in ĐỎ/OK, trả 0/1
  local law="$1" cl sec e=0
  cl="$(rut_marker "$law" GATE-INVITE-CLAUSE | tr '\n' ' ' | tr -s ' ' | sed 's/^ *//; s/ *$//')"
  [ -n "$cl" ] || { echo "CAT-CLAUSE DO: khong rut duoc GATE-INVITE-CLAUSE"; return 1; }
  local nd
  [ "$(printf '%s' "$cl" | grep -o '\.' | wc -l | tr -d ' ')" = "1" ] || { echo "CAT-CLAUSE DO: khong phai MOT cau (so dau cham != 1)"; e=1; }
  local DH=('một câu hỏi đóng' 'ngả máy khuyên' 'một chữ' 'làm gì tiếp') d_ok=0
  for nd in "${DH[@]}"; do case "$cl" in *"$nd"*) d_ok=$((d_ok+1));; *) echo "CAT-CLAUSE DO: thieu dau hieu '$nd'"; e=1;; esac; done
  local TC=('khối' 'vế' 'chỗ trống' 'Trả lời mẫu' 'YOUR-MOVE') t_bad=0
  for nd in "${TC[@]}"; do case "$cl" in *"$nd"*) echo "CAT-CLAUSE DO: tu cam '$nd'"; t_bad=$((t_bad+1)); e=1;; esac; done
  # section = từ heading «## Mời cổng» tới heading kế
  sec="$(printf '%s\n' "$law" | awk '/^## Mời cổng/{f=1} f && /^## / && !/^## Mời cổng/{f=0} f{print}')"
  # Luật âm đo ở DẠNG BULLET ĐẬM (mở đầu dòng), không đo chuỗi trôi nổi trong
  # section — clause cũng chứa «không hỏi phút» nên đo chuỗi trôi nổi thì mutant
  # xoá bullet vẫn xanh (m3 tự bắt lỗ này ở lượt chạy đầu).
  local LA=('Máy không viết sẵn câu trả lời của người' 'Máy không hỏi phút' 'Tin chỉ-báo không hỏi') l_ok=0
  for nd in "${LA[@]}"; do
    if printf '%s\n' "$sec" | grep -q -F -- "- **$nd."; then l_ok=$((l_ok+1)); else echo "CAT-CLAUSE DO: thieu luat am '$nd'"; e=1; fi; done
  [ $e -eq 0 ] && echo "CAT-CLAUSE: 1 cau · $d_ok/${#DH[@]} dau hieu · $t_bad tu cam · $l_ok/${#LA[@]} luat am OK"
  return $e
}
chan_clause() {
  local law; law="$(cat "$ROOT/$LAW")"
  if kiem_clause "$law"; then ok "clause that XANH (doi chung duong)"; else bad "clause that DO"; fi
  if [ "$TUKIEM" -eq 1 ]; then
    local m out
    m="$(printf '%s\n' "$law" | sed 's/một chữ là đủ/một câu là đủ/')"; mut "m1 xoá dấu hiệu 'một chữ'"
    out="$(kiem_clause "$m" || true)"; case "$out" in *"thieu dau hieu 'một chữ'"*) ok "m1 bi bat";; *) bad "m1 KHONG bi bat: $out";; esac
    m="$(printf '%s\n' "$law" | sed 's/không ô trống, không mã bắt buộc/không ô trống, mỗi mục ba vế/')"; mut "m2 chèn từ 'vế'"
    out="$(kiem_clause "$m" || true)"; case "$out" in *"tu cam 'vế'"*) ok "m2 bi bat";; *) bad "m2 KHONG bi bat: $out";; esac
    m="$(printf '%s\n' "$law" | sed 's/^- \*\*Máy không hỏi phút\.\*\*.*$/- (đã gỡ)/')"; mut "m3 xoá luật âm phút"
    out="$(kiem_clause "$m" || true)"; case "$out" in *"thieu luat am 'Máy không hỏi phút'"*) ok "m3 bi bat";; *) bad "m3 KHONG bi bat: $out";; esac
    m="$(printf '%s\n' "$law" | sed 's/^- \*\*Tin chỉ-báo không hỏi\.\*\*.*$/- (đã gỡ)/')"; mut "m4 xoá luật âm chỉ-báo"
    out="$(kiem_clause "$m" || true)"; case "$out" in *"thieu luat am 'Tin chỉ-báo không hỏi'"*) ok "m4 bi bat";; *) bad "m4 KHONG bi bat: $out";; esac
  fi
}

# ═══════════════════ chân oneshot (E4 · AC-4) ══════════════════════════════
kiem_oneshot() {   # $1 = thư mục gốc cây cần kiểm (ROOT hoặc bản sao); base đọc từ git
  local R="$1" e=0 cl f n
  cl="$(khoi_tep "$R/$LAW" GATE-ONESHOT-CLAUSE | tr -d '\n')"
  case "$cl" in *"Đầu ra theo bản luật ngôn ngữ mặt người."*) ;; *) echo "CAT-ONESHOT DO: clause thieu cau moi"; e=1;; esac
  case "$cl" in *"khối 👉"*|*"YOUR-MOVE"*) echo "CAT-ONESHOT DO: clause con nhac khoi/YOUR-MOVE"; e=1;; esac
  local base_cl; base_cl="$(rut_marker "$(g show "$BASE:$LAW")" GATE-ONESHOT-CLAUSE | tr -d '\n')"
  case "$base_cl" in *"khối 👉"*) ;; *) echo "CAT-ONESHOT DO: base KHONG co ve khoi — doi chung duong hong"; e=1;; esac
  n=0; for f in approve signoff start acceptance-init acceptance-status acceptance-report; do
    if grep -qF -- "$cl" "$R/commands/$f.md"; then n=$((n+1)); else echo "CAT-ONESHOT DO: ban chep lech: commands/$f.md"; e=1; fi; done
  local dg; dg="$(diff <(rut_marker "$(g show "$BASE:$LAW")" GATE-ONESHOT-GRAMMAR; rut_marker "$(g show "$BASE:$LAW")" GATE-ONESHOT-SLOTS) \
                     <(khoi_tep "$R/$LAW" GATE-ONESHOT-GRAMMAR; khoi_tep "$R/$LAW" GATE-ONESHOT-SLOTS) | grep '^[<>]' || true)"
  local exp=$'<   (cùng bất biến với khuôn YOUR-MOVE ở trên, cùng gốc ADR 0002).\n>   (cùng bất biến với luật âm mời-cổng ở trên, cùng gốc ADR 0002).'
  [ "$dg" = "$exp" ] || { echo "CAT-ONESHOT DO: GRAMMAR/SLOTS doi ngoai con tro cho phep"; printf '%s\n' "$dg" | sed 's/^/         /'; e=1; }
  [ $e -eq 0 ] && echo "CAT-ONESHOT: clause moi · $n/6 ban chep · grammar+slots chi doi 1 con tro OK"
  return $e
}
chan_oneshot() {
  if kiem_oneshot "$ROOT"; then ok "oneshot that XANH"; else bad "oneshot that DO"; fi
  if [ "$TUKIEM" -eq 1 ]; then
    local d out; d="$(tmpd)"; mkdir -p "$d/commands" "$d/skills/acceptance/references"
    cp "$ROOT"/commands/*.md "$d/commands/"; cp "$ROOT/$LAW" "$d/$LAW"
    sed -i.bak 's/Đầu ra theo bản luật ngôn ngữ mặt người\./Đầu ra theo bản luật ngôn ngữ mặt ngươi./' "$d/commands/start.md"; mut "m1 lệch 1 ký tự bản chép commands/start.md"
    out="$(kiem_oneshot "$d" || true)"; case "$out" in *"ban chep lech: commands/start.md"*) ok "m1 bi bat";; *) bad "m1 KHONG bi bat: $out";; esac
    cp "$ROOT/commands/start.md" "$d/commands/start.md"
    sed -i.bak 's/^g2 Treo$/g2 Treo\ng2 Ngoai-moi/' "$d/$LAW"; mut "m2 chèn 1 dòng vào SLOTS bản sao"
    out="$(kiem_oneshot "$d" || true)"; case "$out" in *"GRAMMAR/SLOTS doi ngoai con tro cho phep"*) ok "m2 bi bat";; *) bad "m2 KHONG bi bat: $out";; esac
  fi
}

# ═══════════════════ chân so-ca (E6 · AC-6) ════════════════════════════════
dem_log() { grep -c '^  PASS:\|^  FAIL:' "$1" || true; }
chan_so_ca() {
  local kv_truoc kv_sau logf
  kv_truoc="$(awk '/<<<SO-CA-KY-VONG/{f=1;next} /SO-CA-KY-VONG>>>/{f=0} f && /^\| *plugins/{gsub(/ /,""); split($0,a,"|"); print a[3]}' "$WS/contract.md")"
  kv_sau="$(awk '/<<<SO-CA-KY-VONG/{f=1;next} /SO-CA-KY-VONG>>>/{f=0} f && /^\| *plugins/{gsub(/ /,""); split($0,a,"|"); print a[4]}' "$WS/contract.md")"
  [ -n "$kv_truoc" ] && [ -n "$kv_sau" ] || { bad "CAT-SO-CA: khong doc duoc SO-CA-KY-VONG"; return; }
  if [ -n "$LOG" ]; then logf="$LOG"; echo "CAT-SO-CA: dem tren log co san $LOG"
  else logf="$(tmpd)/plugins.log"; ( cd "$ROOT" && bash tests/plugins/run-tests.sh ) > "$logf" 2>&1; local ex=$?
    [ $ex -eq 0 ] && ok "CAT-SO-CA: suite plugins exit 0" || bad "CAT-SO-CA: suite plugins exit $ex (co ca do — khac voi lech so ca)"; fi
  local n; n="$(dem_log "$logf")"
  [ "$n" = "$kv_sau" ] && ok "CAT-SO-CA: plugins $n == ky vong $kv_sau OK" || bad "CAT-SO-CA: so ca lech ky vong: $kv_sau -> $n"
  # phân rã
  local giu_ok=0 giu_n=0 go_ok=0 go_n=0 ca viec
  while IFS='|' read -r _ ca viec _; do ca="$(echo "$ca" | tr -d ' ')"; viec="$(echo "$viec" | tr -d ' ')"
    [ -n "$ca" ] && [ "$ca" != "ca" ] && [ "$ca" != "---" ] || continue
    if [ "$viec" = "giu" ]; then giu_n=$((giu_n+1)); grep -q "^  PASS: $ca " "$logf" && giu_ok=$((giu_ok+1)) || echo "       thieu PASS: $ca"
    else go_n=$((go_n+1)); if grep -q "^  PASS: $ca \|^  FAIL: $ca " "$logf"; then echo "       ca go van in: $ca"; else go_ok=$((go_ok+1)); fi
         grep -q "$ca" "$ROOT/tests/plugins/run-tests.sh" && { bad "CAT-SO-CA: $ca con trong suite"; }; fi
  done < <(awk '/<<<SO-CA-PHAN-RA/{f=1;next} /SO-CA-PHAN-RA>>>/{f=0} f && /^\|/' "$WS/contract.md")
  [ "$giu_ok" = "$giu_n" ] && [ "$go_ok" = "$go_n" ] && ok "CAT-SO-CA: giu $giu_ok/$giu_n co PASS · go $go_ok/$go_n vang OK" || bad "CAT-SO-CA: phan ra lech (giu $giu_ok/$giu_n · go $go_ok/$go_n)"
  if [ -z "$LOG" ]; then
    local d bl; d="$(tmpd)"; g worktree add -q --detach "$d/base" "$BASE" 2>/dev/null || { bad "CAT-SO-CA: khong dung duoc worktree base"; return; }
    bl="$d/base.log"; ( cd "$d/base" && bash tests/plugins/run-tests.sh ) > "$bl" 2>&1 || true
    local bn; bn="$(dem_log "$bl")"; g worktree remove --force "$d/base" 2>/dev/null || true
    [ "$bn" = "$kv_truoc" ] && ok "CAT-SO-CA: base $bn == truoc $kv_truoc OK" || bad "CAT-SO-CA: base $bn != truoc $kv_truoc — doi chung duong hong"
  fi
  if [ "$TUKIEM" -eq 1 ]; then
    local m; m="$(tmpd)/mut.log"; grep -v '^  PASS: P185 ' "$logf" > "$m"; mut "cắt dòng PASS: P185 khỏi log"
    local mn; mn="$(dem_log "$m")"; [ "$mn" != "$kv_sau" ] && ok "MUTANT-SO-CA bi bat: so ca lech ky vong: $kv_sau -> $mn" || bad "MUTANT-SO-CA KHONG bi bat"
  fi
}

case "$CHAN" in
  khuon) chan_khuon;; clause) chan_clause;; oneshot) chan_oneshot;; so-ca) chan_so_ca;;
  *) echo "chan la: $CHAN"; exit 2;;
esac
echo "CAT-KHOI [$CHAN]: $fails ĐỎ"
[ "$fails" -eq 0 ]
