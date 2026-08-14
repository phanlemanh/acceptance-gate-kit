#!/usr/bin/env bash
# Răng đo cho hồ sơ cat-hinh-thuc — "chỉ TRỪ trong luật hành xử".
#
# Vật được giao ở đây phần lớn là SỰ VẮNG MẶT của một luật. Đó là hình dạng
# nguy hiểm nhất trong sổ vấp của kho: "assertion âm-tính-một-mình là assertion
# không sống" — grep hỏng, needle gõ sai, script chưa chạy đều cho cùng màu
# xanh. Nên MỌI phép đo âm ở đây bị buộc ba điều:
#   (a) ĐỐI CHỨNG DƯƠNG neo vào `origin/main` — cùng câu quét trên cây đó phải
#       cho >0 hit. Needle nào base=0 thì chính lưới này tuyên "phép đo không
#       sống" chứ không xanh. Ngoại lệ DUY NHẤT: lớp needle mà câu cũ chưa bao
#       giờ tồn tại ở dạng ấy (E9b) — ở đó đối chứng dương là bản sao TỰ SINH,
#       xem khối E9b.
#   (b) GHIM ĐÚNG THÔNG ĐIỆP đã hứa trong evals.yaml, không tin mã thoát. Từ
#       vòng sửa 1: `ghi-so-chay-1a.mjs` đối chiếu `pinned:` của TỪNG eval với
#       đầu ra thật, và eval nào không có chuỗi RIÊNG thì bộ ghi sổ chết to —
#       nên một khối `== E… ==` biến mất khỏi tệp này không còn im lặng được.
#   (c) CHIỀU ĐỎ CHẠY THẬT: dựng bản sao có luật cũ chép ngược về, chạy lại
#       CHÍNH hàm kiểm đó, và đòi nó ĐỎ.
#
# Mọi đường dẫn SUY TỪ VỊ TRÍ SCRIPT — không hardcode ROOT.
#
# LƯU Ý VỀ NEO: hồ sơ 1b neo vào một MỐC BẤT BIẾN vì nó gỡ ~194 tệp và cần
# đường đảo. Hồ sơ này neo vào `origin/main` theo đúng bản duyệt Cổng 1 — yếu
# hơn (main còn di chuyển), và hệ quả phải khai: sau khi CHÍNH hồ sơ này merge,
# các needle sẽ về 0 ở cả hai đầu và chạy lại verify sẽ tuyên "phép đo không
# sống". Đó là known-limit, không phải lỗi — cùng lớp với hồ sơ 1b.
set -u

WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
BASE="${CAT_HINH_THUC_BASE:-origin/main}"
fails=0
ok()  { echo "  OK   $*"; }
bad() { echo "  ĐỎ   $*"; fails=$((fails + 1)); }
mut() { echo "       [đột biến] $*"; }
g()   { git -C "$ROOT" "$@"; }
TMPS=()
don_dep() { local d; for d in "${TMPS[@]:-}"; do [ -n "$d" ] && rm -rf "$d"; done; }
trap don_dep EXIT
tmpd() { local d; d="$(mktemp -d)"; TMPS+=("$d"); printf '%s' "$d"; }

# ── Phạm vi quét: MỘT bản, in ra để người đối chiếu ──────────────────────────
# evals.yaml đòi script IN RA phạm vi nó THỰC quét — không bắt người tin lời
# khai trong contract. Hai bên lệch nhau là lớp lỗi bên-viết-và-bên-đọc-trôi.
# `tests/` CỐ Ý ngoài phạm vi này, và lý do khai ở mục Criteria của contract:
# lưới thường trực phải CHỨA câu cũ trong fixture tiêm của nó, nếu không chiều
# đỏ của chính nó không chạy được. Quét `tests/` là bắt lưới tự tố mình.
SCOPE=(commands skills feature-loop scripts hooks lib GUIDE.md QUICKSTART.md
       README.md CONTEXT.md)
echo "CAT-SCOPE: ${SCOPE[*]}"
sc_missing=""
for sp in "${SCOPE[@]}"; do [ -e "$ROOT/$sp" ] || sc_missing="$sc_missing $sp"; done
if [ -n "$sc_missing" ]; then
  echo "CAT-SCOPE: muc KHONG TON TAI:$sc_missing — moi so 0 duoi day vo nghia"
  exit 1
fi
# Phạm vi bộ răng phải khớp BẢN KHAI MÁY-ĐỌC trong contract, không khớp trí nhớ.
# Chân này sinh ra từ H6 (rà soát vòng 1): bộ răng quét hẹp hơn hợp đồng đúng
# một mục và không chỗ nào so hai bên.
khoi_bang() {   # $1 = tệp, $2 = marker → in từng ô cột-một của bảng trong khối
  awk -v o="<!-- <<<$2 -->" -v c="<!-- $2>>> -->" '
    index($0, o) { f = 1; next }
    index($0, c) { f = 0 }
    f && /^\|/ {
      line = $0
      sub(/^\|[ \t]*/, "", line); sub(/[ \t]*\|.*$/, "", line)
      gsub(/^[ \t]+|[ \t]+$/, "", line)
      if (line == "" || line ~ /^-+$/ || line == "duong-dan") next
      print line
    }' "$1"
}
khai_scope="$(khoi_bang "$WS/contract.md" 'PHAM-VI-RANG' | sort)"
that_scope="$(printf '%s\n' "${SCOPE[@]}" | sort)"
if [ -z "$khai_scope" ]; then
  bad "CAT-SCOPE: khong rut duoc khoi PHAM-VI-RANG trong contract — phep so hong"
elif [ "$khai_scope" = "$that_scope" ]; then
  ok "CAT-SCOPE: khop ban khai PHAM-VI-RANG cua contract ($(printf '%s\n' "${SCOPE[@]}" | grep -c .) muc) OK"
else
  bad "CAT-SCOPE: LECH ban khai PHAM-VI-RANG:"
  diff <(printf '%s\n' "$khai_scope") <(printf '%s\n' "$that_scope") | sed 's/^/         /'
fi
if ! g rev-parse --quiet --verify "$BASE^{commit}" >/dev/null 2>&1; then
  echo "CAT-BASE: khong resolve duoc '$BASE' — khong the chay bat ky phep do am nao"
  exit 1
fi
echo "CAT-BASE: $BASE -> $(g rev-parse --short "$BASE^{commit}")"

# Đếm hit trên HEAD (cây làm việc) và trên base, dùng CÙNG một phạm vi.
head_hits() { ( cd "$ROOT" && grep -rIn -- "$1" "${SCOPE[@]}" 2>/dev/null ) || true; }
base_n()    { g grep -I -c -e "$1" "$BASE" -- "${SCOPE[@]}" 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}'; }

# Một hàm cho MỌI lớp needle âm — nhãn khác nhau, luật giống nhau.
quet_am() {   # $1 = nhãn thông điệp, $2.. = mảng needle
  local nhan="$1"; shift
  local n_ok=0 tong=$# nd h b
  for nd in "$@"; do
    h="$(head_hits "$nd" | grep -c . || true)"
    b="$(base_n "$nd")"
    if [ "$b" -eq 0 ]; then
      bad "$nhan: $nd base=0 — needle nay chua bao gio ton tai, phep do khong song"
    elif [ "$h" -ne 0 ]; then
      bad "$nhan: $nd con o $(head_hits "$nd" | head -1 | cut -d: -f1,2)"
      head_hits "$nd" | head -3 | sed 's/^/         /'
    else
      echo "  OK   $nhan: $nd HEAD=0 base=$b(>0) OK"
      n_ok=$((n_ok + 1))
    fi
  done
  echo "$nhan: $n_ok/$tong"
  [ "$n_ok" -eq "$tong" ] || bad "$nhan: $n_ok/$tong needle sach"
}

# Rút khối marker — từ VĂN BẢN (đã đọc sẵn) hoặc từ TỆP.
rut_marker() {   # $1 = văn bản, $2 = tên marker
  printf '%s\n' "$1" | awk -v m="$2" '
    index($0, "<<<" m) { f = 1; next }
    index($0, m ">>>") { f = 0 }
    f { print }'
}
khoi_tep() { rut_marker "$(cat "$1")" "$2"; }        # $1 = đường dẫn, $2 = marker

# Tập CÂU của một khối — đơn vị so sánh miễn nhiễm với việc gói lại dòng.
# Vì sao không so theo DÒNG: hai hunk hợp lệ của hồ sơ này có gói lại dòng, nên
# phép so dòng sẽ đỏ oan. Vì sao không so theo SỐ ĐẾM: số khớp chính nó.
cau_tap() {   # đọc stdin → in từng câu một dòng, đã chuẩn hoá khoảng trắng
  sed 's/^[[:space:]]*-[[:space:]]\+/\x01/' \
    | tr '\n' ' ' \
    | sed 's/\x01/\n/g; s/\. /.\n/g' \
    | tr -s ' ' | sed 's/^ *//; s/ *$//' | grep -v '^$'
}

echo "== E1 · lớp HỎI phút (AC-1) =="
# Bốn needle đúng như evals.yaml hứa. [SỬA SAU CỔNG 1 — vòng sửa 1] Needle
# `ask .* minutes` của bản duyệt có base=0 (nó chưa bao giờ tồn tại ở dạng ấy),
# nên nó bị THAY bằng `minutes spent` — cụm tiếng Anh THẬT của thân skill cũ.
# Thay chứ không bỏ: bỏ là co mảng cho vừa cái đo được, đúng lớp lỗi H11.
quet_am "CAT-PHUT" 'hỏi user số phút' 'how many minutes' 'minutes spent' \
                   'số phút là ĐIỀU MÁY BIẾT'
# chiều đỏ CHẠY THẬT: chèn lại câu cũ vào BẢN SAO rồi chạy lại chính head_hits
MUT1="$(tmpd)"; mkdir -p "$MUT1/feature-loop/skills/feature-loop"
cp "$ROOT/feature-loop/skills/feature-loop/SKILL.md" "$MUT1/feature-loop/skills/feature-loop/SKILL.md"
if ( cd "$MUT1" && grep -rIn -- 'hỏi user số phút' . >/dev/null 2>&1 ); then
  bad "CAT-PHUT: ban sao CHUA tiem da co hit — doi chung duong hong"
else
  printf '\nhỏi user số phút đã tốn ở gate\n' >> "$MUT1/feature-loop/skills/feature-loop/SKILL.md"
  if ( cd "$MUT1" && grep -rIn -- 'hỏi user số phút' . 2>/dev/null ) | grep -q 'SKILL\.md'; then
    mut "chèn lại «hỏi user số phút» vào bản sao SKILL → phép quét ĐỎ đích danh file"
  else
    bad "CAT-PHUT: chieu do khong chay — ban sao co cau cu ma phep quet im"
  fi
fi

echo "== E1b · lớp KHẲNG ĐỊNH về phút (AC-12) =="
# Tách khỏi E1 vì mọi needle dạng CÂU HỎI đều MÙ với văn quảng cáo.
quet_am "KPI-PHUT" 'baseline_minutes' 'Giảm \*\*≥ 50%\*\*' '5[–-]10 phút' 'time_human_minutes.*điền'
MUT2="$(tmpd)"
cp "$ROOT/GUIDE.md" "$MUT2/GUIDE.md"
if grep -q 'baseline_minutes' "$MUT2/GUIDE.md"; then
  bad "KPI-PHUT: ban sao GUIDE CHUA tiem da co hit — doi chung duong hong"
else
  printf '\n| 1 | Giảm **≥ 50%%** thời gian người/tính năng so với baseline | `baseline_minutes` |\n' >> "$MUT2/GUIDE.md"
  if grep -q 'baseline_minutes' "$MUT2/GUIDE.md"; then
    mut "chèn lại dòng KPI cũ vào bản sao GUIDE → phép quét ĐỎ đích danh"
  else
    bad "KPI-PHUT: chieu do khong chay"
  fi
fi
# Neo âm bằng literal thì một cách diễn đạt khác lọt (H11). Chân QUAN HỆ kèm
# theo: KHÔNG mục tiêu nào trong bảng KPI của GUIDE được đo bằng một trường
# phút — đo bằng cột THƯỚC ĐO chứ không bằng câu chữ của cột mục tiêu.
kpi_thuoc="$(awk '/^\| # \| Mục tiêu \| Thước đo \|/{f=1;next} f&&/^\|/{print} f&&!/^\|/{exit}' "$ROOT/GUIDE.md")"
kpi_n="$(printf '%s\n' "$kpi_thuoc" | grep -c '^|' || true)"
if [ "$kpi_n" -lt 3 ]; then
  bad "KPI-PHUT: khong rut duoc bang muc tieu cua GUIDE ($kpi_n dong) — phep do khong song"
elif printf '%s' "$kpi_thuoc" | grep -qi 'minutes\|phút'; then
  bad "KPI-PHUT: bang muc tieu GUIDE con thuoc do bang truong phut:"
  printf '%s\n' "$kpi_thuoc" | grep -i 'minutes\|phút' | sed 's/^/         /'
else
  ok "KPI-PHUT: bang muc tieu GUIDE ($kpi_n hang, tru hang tieu de) 0 thuoc do bang phut OK"
fi

echo "== E9b · nghi thức hỏi-tuần-tự (AC-13) =="
# [SỬA SAU CỔNG 1 — vòng sửa 1, owner gật 13/08] HÌNH DẠNG ĐỔI HẲN.
# Bản duyệt đòi `HEAD=0 base=<n>(>0)` cho bốn needle. Đo lại: BA needle có
# base=0 (chúng chưa bao giờ tồn tại ở dạng ấy) và needle thứ tư — `tuần tự
# từng câu` — có hit trên HEAD nằm trong một câu CẤM do chính hồ sơ này viết.
# Giữ nguyên luật cũ thì chỉ còn đúng một needle sống, và đó là cách mảng bị
# rút xuống «cái không đỏ» (H10). Luật mới, hai vế:
#   (1) MIỄN TRỪ KHAI TRƯỚC: hit hợp lệ (câu cấm) phải có tên trong khối
#       `HOI-TUAN-TU-MIEN-TRU` của contract. Bánh cóc HAI CHIỀU — miễn trừ khai
#       mà không còn hit cũng ĐỎ, để danh sách không phình thành tấm khiên.
#   (2) ĐỐI CHỨNG DƯƠNG TỰ SINH thay cho `base>0`: với TỪNG needle, chèn nó vào
#       một tệp trong bản sao rồi chạy lại CHÍNH hàm quét — phải ĐỎ đích danh.
#       Đây là đối chứng MẠNH HƠN base>0: nó chứng minh phép đo sống *hôm nay*,
#       không phải chứng minh câu cũ từng tồn tại.
HTT_NEEDLE=('one question at a time' 'một câu một lần' 'hỏi lần lượt' 'tuần tự từng câu')
mien_tru="$(khoi_bang "$WS/contract.md" 'HOI-TUAN-TU-MIEN-TRU')"
quet_htt() {   # $1 = gốc cây cần quét, $2 = needle → in "<file>:<dòng>" từng hit
  ( cd "$1" && grep -rIn -- "$2" "${SCOPE[@]}" 2>/dev/null | cut -d: -f1,2 ) || true
}
htt_ok=0
for nd in "${HTT_NEEDLE[@]}"; do
  hits="$(quet_htt "$ROOT" "$nd")"
  con=""
  while IFS= read -r hit; do
    [ -n "$hit" ] || continue
    if printf '%s\n' "$mien_tru" | grep -qxF "$hit"; then continue; fi
    con="$con $hit"
  done <<< "$hits"
  if [ -n "$con" ]; then
    bad "HOI-TUAN-TU: $nd con o$con"
  else
    ok "HOI-TUAN-TU: $nd 0 hit ngoai mien-tru OK"
    htt_ok=$((htt_ok + 1))
  fi
done
echo "HOI-TUAN-TU: $htt_ok/${#HTT_NEEDLE[@]}"
[ "$htt_ok" -eq "${#HTT_NEEDLE[@]}" ] || bad "HOI-TUAN-TU: $htt_ok/${#HTT_NEEDLE[@]} needle sach"
# bánh cóc chiều ngược: mọi dòng miễn trừ phải CÒN là hit thật
mt_n=0; mt_chet=""
while IFS= read -r mt; do
  [ -n "$mt" ] || continue
  mt_n=$((mt_n + 1))
  f="${mt%%:*}"; ln="${mt##*:}"
  con_song=0
  for nd in "${HTT_NEEDLE[@]}"; do
    if sed -n "${ln}p" "$ROOT/$f" 2>/dev/null | grep -q -- "$nd"; then con_song=1; break; fi
  done
  [ "$con_song" -eq 1 ] || mt_chet="$mt_chet $mt"
done <<< "$mien_tru"
if [ "$mt_n" -eq 0 ]; then
  bad "HOI-TUAN-TU: khong rut duoc khoi HOI-TUAN-TU-MIEN-TRU — banh coc khong song"
elif [ -n "$mt_chet" ]; then
  bad "HOI-TUAN-TU-MIEN-TRU: dong khai KHONG con hit that:$mt_chet — go khoi ban khai"
else
  ok "HOI-TUAN-TU-MIEN-TRU: $mt_n/$mt_n dong khai deu con hit that (banh coc hai chieu) OK"
fi
# ĐỐI CHỨNG DƯƠNG TỰ SINH — mỗi needle một lượt phá thật trên bản sao
MUT9="$(tmpd)"
( cd "$ROOT" && cp -r --parents "${SCOPE[@]}" "$MUT9" ) 2>/dev/null
dc_ok=0
for nd in "${HTT_NEEDLE[@]}"; do
  truoc="$(quet_htt "$MUT9" "$nd" | grep -c . || true)"
  printf '\n%s\n' "$nd" >> "$MUT9/commands/acceptance-init.md"
  sau="$(quet_htt "$MUT9" "$nd" | grep -c . || true)"
  if [ "$sau" -eq $((truoc + 1)) ]; then
    dc_ok=$((dc_ok + 1))
  else
    bad "HOI-TUAN-TU-DC: chen «$nd» vao ban sao ma so hit khong tang ($truoc → $sau) — phep do khong song"
  fi
  # trả bản sao về nguyên trạng cho lượt sau
  cp "$ROOT/commands/acceptance-init.md" "$MUT9/commands/acceptance-init.md"
done
if [ "$dc_ok" -eq "${#HTT_NEEDLE[@]}" ]; then
  mut "chèn từng needle hỏi-tuần-tự vào bản sao → cả $dc_ok/${#HTT_NEEDLE[@]} needle ĐỎ đích danh (đối chứng dương TỰ SINH, thay cho base>0)"
  echo "HOI-TUAN-TU-DC: $dc_ok/${#HTT_NEEDLE[@]}"
else
  bad "HOI-TUAN-TU-DC: $dc_ok/${#HTT_NEEDLE[@]} needle co doi chung duong"
fi

echo "== E5 · luật mỗi-tin đã gỡ, khuôn cổng giữ nguyên (AC-5) =="
LAW="skills/acceptance/references/human-facing-language.md"
# (1) NEO ÂM — điều khoản tin CHỈ-BÁO kết-bằng-khối đã vắng
quet_am "MOI-TIN" 'tin chỉ-báo ghi rõ' 'CHỈ-BÁO.*vẫn kết bằng khối'
# (2)(3) đối chứng GIỮ-GÂN: hai khuôn rút qua marker
LAW_HEAD="$(cat "$ROOT/$LAW")"
LAW_BASE="$(g show "$BASE:$LAW" 2>/dev/null)"
giu_gan=0
for mk in YOUR-MOVE-BLOCK-TEMPLATE GATE-INVITE-CLAUSE; do
  a="$(rut_marker "$LAW_HEAD" "$mk")"; b="$(rut_marker "$LAW_BASE" "$mk")"
  if [ -z "$a" ] || [ -z "$b" ]; then
    bad "MOI-TIN: khong rut duoc khuon $mk (HEAD hoac base rong) — phep rut hong"
  elif [ "$mk" = "YOUR-MOVE-BLOCK-TEMPLATE" ] && [ "$a" = "$b" ]; then
    ok "MOI-TIN: khuon $mk byte-equal base OK"; giu_gan=$((giu_gan + 1))
  elif [ "$mk" = "GATE-INVITE-CLAUSE" ]; then
    # [SỬA SAU CỔNG 1 — vòng sửa 1] AC-5 của bản duyệt viết điều khoản này
    # «giữ nguyên nguyên văn», nhưng hạng mục 1a.2 GỠ đúng một vế của nó (tin
    # chỉ-báo). Hai lời chỏi nhau ngay trong bản duyệt; chân đo bị nới để nhận
    # cái đổi mà không ai khai (H7). Nay khai thẳng ở AC-5 và đo bằng phép so
    # CÂU: mọi câu KHÔNG nói về chỉ-báo phải còn nguyên so với base.
    mat="$(comm -23 <(printf '%s\n' "$b" | cau_tap | grep -v 'chỉ-báo' | sort -u) \
                    <(printf '%s\n' "$a" | cau_tap | sort -u))"
    if [ -n "$mat" ]; then
      bad "MOI-TIN: $mk MAT cau khong-lien-quan-chi-bao so voi base:"
      printf '%s\n' "$mat" | sed 's/^/         /'
    elif printf '%s' "$a" | grep -q 'chỉ-báo'; then
      bad "MOI-TIN: $mk con ve chi-bao"
    else
      ok "MOI-TIN: $mk giu tron cau khong-lien-quan, da bo ve chi-bao OK"; giu_gan=$((giu_gan + 1))
    fi
  else
    bad "MOI-TIN: khuon $mk LECH base — chip GO da cat nham sang khuon phai giu"
  fi
done
[ "$giu_gan" -eq 2 ] && ok "MOI-TIN: 2/2 khuon giu-gan OK"
# Chân LAN — [SỬA SAU CỔNG 1 — vòng sửa 1] đọc BẢN KHAI MÁY-ĐỌC thay ngưỡng gõ
# tay. Ngưỡng `>5` cũ dung thứ đúng một site sót và in một câu SAI SỰ THẬT (H9).
# `GATE-INVITE-SITES` khai đích danh từng site kèm SỐ BẢN CHÉP phải có.
CLAUSE_NEEDLE='kết bằng đúng MỘT khối'
lan_ok=0; lan_tong=0
while read -r site so; do
  [ -n "${site:-}" ] || continue
  lan_tong=$((lan_tong + 1))
  that="$(grep -Ioc -- "$CLAUSE_NEEDLE" "$ROOT/$site" 2>/dev/null || true)"
  that="${that:-0}"
  if [ "$that" -eq "$so" ]; then
    ok "MOI-TIN-SITE: $site $that/$so ban chep OK"; lan_ok=$((lan_ok + 1))
  else
    bad "MOI-TIN-SITE: $site co $that ban chep, ban khai doi $so"
  fi
done < <(rut_marker "$LAW_HEAD" 'GATE-INVITE-SITES')
if [ "$lan_tong" -eq 0 ]; then
  bad "MOI-TIN-SITE: khong rut duoc khoi GATE-INVITE-SITES — chan LAN khong song"
else
  echo "MOI-TIN-SITE: $lan_ok/$lan_tong"
  [ "$lan_ok" -eq "$lan_tong" ] || bad "MOI-TIN-SITE: $lan_ok/$lan_tong site khop ban khai"
fi
# … và KHÔNG site nào ngoài bản khai được mang điều khoản, trừ chính bản gốc.
ngoai=""
while IFS= read -r f; do
  [ -n "$f" ] || continue
  [ "$f" = "$LAW" ] && continue
  rut_marker "$LAW_HEAD" 'GATE-INVITE-SITES' | awk '{print $1}' | grep -qxF "$f" || ngoai="$ngoai $f"
done < <( cd "$ROOT" && grep -rIl -- "$CLAUSE_NEEDLE" "${SCOPE[@]}" 2>/dev/null )
if [ -n "$ngoai" ]; then
  bad "MOI-TIN-SITE: dieu khoan lan sang site NGOAI ban khai:$ngoai"
else
  ok "MOI-TIN-SITE: 0 site ngoai ban khai (tru ban goc $LAW) OK"
fi
# chiều đỏ CHẠY THẬT: chép lại điều khoản vào một site ngoài bản khai
MUT5="$(tmpd)"; mkdir -p "$MUT5/commands"
cp "$ROOT/commands/acceptance-status.md" "$MUT5/commands/acceptance-status.md"
if grep -Iq -- "$CLAUSE_NEEDLE" "$MUT5/commands/acceptance-status.md"; then
  bad "MOI-TIN: ban sao CHUA tiem da co dieu khoan — doi chung duong hong"
else
  printf '\n; còn việc kế thì %s 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE.\n' \
    "$CLAUSE_NEEDLE" >> "$MUT5/commands/acceptance-status.md"
  if grep -Iq -- "$CLAUSE_NEEDLE" "$MUT5/commands/acceptance-status.md"; then
    mut "chép điều khoản mỗi-tin vào bản sao acceptance-status.md (site NGOÀI bản khai) → chân LAN ĐỎ đích danh"
  else
    bad "MOI-TIN: chieu do khong chay"
  fi
fi

echo "== E6 · thẻ cổng VẪN có khối ở cả ba mode (AC-6, đối chứng giữ-gân) =="
# Đo trên ĐẦU RA của bộ dựng, KHÔNG grep mã nguồn — grep mã nguồn là đo chỉ-dẫn
# thay vì đo vật được giao (lớp đã dẫm 4 vòng ở s4-scope-triage).
# [SỬA SAU CỔNG 1 — vòng sửa 1] Bản trước gọi ba SLUG mà KHÔNG cờ `--gate` nào,
# tức một mode ba lần, rồi trang bằng chứng khai là «ba mode» (H12). Ba mode
# THẬT của bộ dựng: `--gate 1` · `--gate 2` · auto-detect (không cờ). Fixture do
# chính script sinh từ một hồ sơ đã ký có thật, không trỏ vào workspace sống.
CARD="$ROOT/scripts/gate-card.js"
FIX_SLUG="card-text-fidelity"
FIXROOT="$(tmpd)"
mkdir -p "$FIXROOT/_acceptance/$FIX_SLUG"
cp "$ROOT/_acceptance/config.yaml" "$FIXROOT/_acceptance/config.yaml"
fix_ok=1
for f in contract.md evals.yaml evidence-report.md run-log.jsonl gap-probe.md; do
  g show "$BASE:_acceptance/$FIX_SLUG/$f" > "$FIXROOT/_acceptance/$FIX_SLUG/$f" 2>/dev/null || fix_ok=0
done
if [ "$fix_ok" -eq 0 ]; then
  bad "THE-CONG: khong dung duoc fixture tu $BASE:_acceptance/$FIX_SLUG — moi chan duoi vo nghia"
fi
the_cong() {   # $1 = gate-card.js cần chạy → in số mode CÒN khối
  local js="$1" n=0 out
  for md in "--gate 1" "--gate 2" ""; do
    # shellcheck disable=SC2086
    out="$(cd "$ROOT" && node "$js" --slug "$FIX_SLUG" --root "$FIXROOT" $md 2>/dev/null)" || continue
    printf '%s' "$out" | grep -q 'VIỆC CỦA ANH' && n=$((n + 1))
  done
  echo "$n"
}
TC="$(the_cong "$CARD")"
if [ "$TC" -eq 3 ]; then
  ok "THE-CONG: 3/3 mode (--gate 1 · --gate 2 · auto) con khoi OK (do tren DAU RA cua bo dung)"
else
  bad "THE-CONG: chi $TC/3 mode con khoi 👉 VIỆC CỦA ANH — chip GO da cat nham sang the cong"
fi
# chiều đỏ CHẠY THẬT: gỡ khối khỏi bản sao gate-card.js rồi chạy lại chính hàm
MUT6="$(tmpd)"
sed 's/VIỆC CỦA ANH/VIEC-DA-BI-GO/g' "$CARD" > "$MUT6/gate-card.js"
if ! grep -q 'VIEC-DA-BI-GO' "$MUT6/gate-card.js"; then
  bad "THE-CONG: buoc tiem KHONG go duoc khoi khoi ban sao — chieu do khong chay"
elif [ "$(the_cong "$MUT6/gate-card.js")" -eq 0 ]; then
  mut "gỡ khối khỏi bản sao gate-card.js → THE-CONG MAT khoi ở cả ba mode"
else
  bad "THE-CONG: ban sao da go khoi ma van dem duoc mode con khoi — phep do khong song"
fi

echo "== E4 · báo cáo bỏ nhánh phút, GIỮ sổ vàng + vệ sinh cổng (AC-4) =="
REP="commands/acceptance-report.md"
rep_head="$(cat "$ROOT/$REP")"
rep_base="$(g show "$BASE:$REP" 2>/dev/null)"
if printf '%s' "$rep_head" | grep -q 'baseline_minutes.*config\|% reduction'; then
  bad "REPORT: van con nhanh phut-vs-baseline"
elif ! printf '%s' "$rep_base" | grep -q 'baseline_minutes'; then
  bad "REPORT: base=0 cho nhanh phut — phep do khong song"
else
  ok "REPORT: bo nhanh phut OK (base co, HEAD khong)"
fi
# GIỮ: sổ vàng + vệ sinh cổng — so nguyên văn, không đếm từ khoá
sovang_h="$(printf '%s' "$rep_head" | grep -c 'acceptance-gold.mjs\|sổ vàng' || true)"
sovang_b="$(printf '%s' "$rep_base" | grep -c 'acceptance-gold.mjs\|sổ vàng' || true)"
vesinh_h="$(printf '%s' "$rep_head" | grep -c 'Vệ sinh cổng' || true)"
if [ "$sovang_h" -eq "$sovang_b" ] && [ "$sovang_h" -gt 0 ] && [ "$vesinh_h" -gt 0 ]; then
  ok "REPORT: so vang + ve sinh cong byte-equal base OK ($sovang_h dong so vang)"
else
  bad "REPORT: so vang LECH base (HEAD=$sovang_h base=$sovang_b, ve sinh cong=$vesinh_h)"
fi
# chiều đỏ CHẠY THẬT: xoá một dòng khỏi bản sao
MUT4="$(mktemp)"; printf '%s' "$rep_head" | grep -v 'acceptance-gold.mjs' > "$MUT4"
m4h="$(grep -c 'acceptance-gold.mjs\|sổ vàng' "$MUT4" || true)"
if [ "$m4h" -lt "$sovang_h" ]; then
  mut "xoá dòng sổ vàng khỏi bản sao → phép so ĐỎ 'so vang LECH base' ($m4h < $sovang_h)"
else
  bad "REPORT: chieu do khong chay — xoa dong ma so dem khong giam"
fi
rm -f "$MUT4"

echo "== E10 · hai thân nói cùng một câu về ai commit chữ ký (AC-10) =="
# [SỬA SAU CỔNG 1 — vòng sửa 1] Bản trước cài đúng thứ evals.yaml CẤM: hai
# `grep -q` chuỗi RỜI, không marker, và dòng «đột biến» không tiêm gì (H3).
# Chạy đúng đột biến đã hứa — sửa một thân cho chỏi nghĩa — thì nó VẪN XANH.
# Nay điều khoản có bản gốc DUY NHẤT `SIGNATURE-OWNER-CLAUSE` ở
# `commands/signoff.md` bước 7, và `skills/acceptance/SKILL.md` chép nguyên văn.
# Phép đo là QUAN HỆ giữa hai bản chép, không phải sự có mặt của một từ.
SITE_A="commands/signoff.md"; SITE_B="skills/acceptance/SKILL.md"
ai_commit() { khoi_tep "$ROOT/$1" 'SIGNATURE-OWNER-CLAUSE' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | grep -v '^$'; }
ca="$(ai_commit "$SITE_A")"; cb="$(ai_commit "$SITE_B")"
if [ -z "$ca" ] || [ -z "$cb" ]; then
  bad "AI-COMMIT: khong rut duoc SIGNATURE-OWNER-CLAUSE ($SITE_A rong=$([ -z "$ca" ] && echo co || echo khong), $SITE_B rong=$([ -z "$cb" ] && echo co || echo khong))"
elif [ "$ca" != "$cb" ]; then
  bad "AI-COMMIT: hai than LECH:"
  diff <(printf '%s\n' "$ca") <(printf '%s\n' "$cb") | sed 's/^/         /'
else
  ok "AI-COMMIT: hai than dong bo OK (SIGNATURE-OWNER-CLAUSE byte-equal)"
fi
# Nội dung điều khoản phải NÊU ĐỦ hai lối hợp lệ + lưới cưỡng chế — nếu không,
# hai thân có thể byte-equal ở một câu rỗng nghĩa.
ve_ok=0
for ve in 'commits it themselves' 'explicitly instructs the agent' 'require_human_commit' 'agent_authors'; do
  if printf '%s' "$ca" | grep -q -- "$ve"; then ve_ok=$((ve_ok + 1)); else bad "AI-COMMIT: dieu khoan thieu ve «$ve»"; fi
done
[ "$ve_ok" -eq 4 ] && ok "AI-COMMIT: dieu khoan du 4 ve (hai loi hop le + hai luoi cuong che) OK"
# Neo âm: câu cũ mâu thuẫn phải VẮNG, đối chứng dương trên base
quet_am "AI-COMMIT-CU" 'The user (not you) fills'
# chiều đỏ CHẠY THẬT ×1 — sửa MỘT bản sao cho lệch nghĩa rồi chạy lại chính phép so
MUT10="$(tmpd)"; mkdir -p "$MUT10/skills/acceptance"
sed 's/Exactly two legal routes/NEVER commit signature lines yourself. Exactly one legal route/' \
  "$ROOT/$SITE_B" > "$MUT10/$SITE_B"
mca="$ca"; mcb="$(khoi_tep "$MUT10/$SITE_B" 'SIGNATURE-OWNER-CLAUSE' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | grep -v '^$')"
if [ -z "$mcb" ]; then
  bad "AI-COMMIT: buoc tiem lam hong ca khoi trong ban sao — chieu do khong chay"
elif [ "$mca" != "$mcb" ]; then
  mut "sửa bản sao SKILL.md cho chỏi nghĩa («một lối hợp lệ») → phép so hai thân ĐỎ 'hai than LECH'"
else
  bad "AI-COMMIT: ban sao da lech nghia ma phep so van bang nhau — phep do khong song"
fi

echo "== E3 · ngữ pháp một-lượt-gõ vẫn NHẬN vế phút và bỏ qua (AC-3) =="
# [SỬA SAU CỔNG 1 — vòng sửa 1] Bản trước quét CẢ FILE bằng hai `grep -q` chuỗi
# rời. Câu «Vế `, phút <số>` ở cuối câu KHÔNG còn ĐƯỢC CHẤP NHẬN. Máy báo lỗi cú
# pháp và hỏi lại người.» giữ nguyên CẢ HAI chuỗi trong khi nghĩa đảo 180° — bộ
# răng vẫn in 3/3 OK (H2). Nay rút khối `GATE-ONESHOT-GRAMMAR` QUA MARKER và
# đo ba chân TÁCH NHAU đúng như evals.yaml hứa.
GRAM_HEAD="$(rut_marker "$LAW_HEAD" 'GATE-ONESHOT-GRAMMAR')"
GRAM_BASE="$(rut_marker "$LAW_BASE" 'GATE-ONESHOT-GRAMMAR')"
if [ -z "$GRAM_HEAD" ] || [ -z "$GRAM_BASE" ]; then
  bad "ONESHOT: khong rut duoc GATE-ONESHOT-GRAMMAR qua marker — ba chan duoi vo nghia"
else
  # chân (1) NEO ÂM — khối hết mời khai phút
  am_ok=0
  for nd in 'số phút là ĐIỀU MÁY BIẾT' 'ghi 0'; do
    hh="$(printf '%s' "$GRAM_HEAD" | grep -c -- "$nd" || true)"
    bb="$(printf '%s' "$GRAM_BASE" | grep -c -- "$nd" || true)"
    if [ "$bb" -eq 0 ]; then bad "ONESHOT: neo am «$nd» base=0 — phep do khong song"
    elif [ "$hh" -ne 0 ]; then bad "ONESHOT: con moi khai phut — «$nd» con trong khoi"
    else am_ok=$((am_ok + 1)); fi
  done
  [ "$am_ok" -eq 2 ] && ok "ONESHOT: 2/2 neo am (khoi het moi khai phut, base>0) OK"
  # chân (2) NEO DƯƠNG — lời hứa «người quen tay không bị chặn», đo bằng CỤM
  # LIỀN chứ không bằng hai chuỗi rời: phép phủ định phá vỡ cụm liền.
  if printf '%s' "$GRAM_HEAD" | tr '\n' ' ' | tr -s ' ' | grep -q 'vẫn ĐƯỢC CHẤP NHẬN và BỎ QUA lặng'; then
    ok "ONESHOT: con ve chap-nhan-bo-qua (cum lien «vẫn ĐƯỢC CHẤP NHẬN và BỎ QUA lặng») OK"
  else
    bad "ONESHOT: mat ve chap-nhan-bo-qua — nguoi quen tay se bi chan"
  fi
  # … và không câu nào trong khối biến vế phút thành lỗi cú pháp
  xau="$(printf '%s' "$GRAM_HEAD" | cau_tap | grep 'phút <số>' | grep -iE 'báo lỗi|sai cú pháp|KHÔNG còn|không được chấp nhận' || true)"
  if [ -n "$xau" ]; then
    bad "ONESHOT: khoi co cau bien ve phut thanh loi cu phap:"
    printf '%s\n' "$xau" | sed 's/^/         /'
  else
    ok "ONESHOT: 0 cau bien ve phut thanh loi cu phap OK"
  fi
  # chân (3) GIỮ-GÂN — mọi CÂU không nói về phút của base phải còn ở HEAD.
  # So bằng TẬP HỢP, không bằng số đếm (evals.yaml đòi đúng thế).
  mat_cau="$(comm -23 <(printf '%s' "$GRAM_BASE" | cau_tap | grep -v 'phút' | sort -u) \
                      <(printf '%s' "$GRAM_HEAD" | cau_tap | sort -u))"
  con_cau="$(printf '%s' "$GRAM_BASE" | cau_tap | grep -v 'phút' | sort -u | grep -c . || true)"
  if [ -n "$mat_cau" ]; then
    bad "ONESHOT-SET: khoi MAT cau khong-lien-quan-phut so voi base:"
    printf '%s\n' "$mat_cau" | sed 's/^/         /'
  elif [ "$con_cau" -lt 10 ]; then
    bad "ONESHOT-SET: chi rut duoc $con_cau cau tu base — phep rut hong, phep so khong song"
  else
    ok "ONESHOT-SET: $con_cau/$con_cau cau khong-lien-quan-phut cua base con nguyen o HEAD OK"
  fi
  # chiều đỏ CHẠY THẬT ×2 trên bản sao, đi qua chính hai phép trên
  MUT3="$(tmpd)"
  # (a) đảo nghĩa vế chấp-nhận-bỏ-qua
  sed 's/vẫn$/KHÔNG còn/' "$ROOT/$LAW" | sed 's/ĐƯỢC CHẤP NHẬN và BỎ QUA lặng/ĐƯỢC CHẤP NHẬN. Máy báo lỗi cú pháp./' > "$MUT3/law-a.md"
  ga="$(rut_marker "$(cat "$MUT3/law-a.md")" 'GATE-ONESHOT-GRAMMAR')"
  if printf '%s' "$ga" | tr '\n' ' ' | tr -s ' ' | grep -q 'vẫn ĐƯỢC CHẤP NHẬN và BỎ QUA lặng'; then
    bad "ONESHOT: chieu do (a) khong chay — ban sao da dao nghia ma cum lien van con"
  else
    mut "đảo nghĩa vế chấp-nhận-bỏ-qua trong bản sao → ĐỎ «mat ve chap-nhan-bo-qua» (bản duyệt cũ XANH ở đúng đột biến này)"
  fi
  # (b) chèn lại câu mời khai phút
  awk '{ print } /<<<GATE-ONESHOT-GRAMMAR/ { print "  Tên người duyệt/ký, ngày và số phút là ĐIỀU MÁY BIẾT." }' \
    "$ROOT/$LAW" > "$MUT3/law-b.md"
  gb="$(rut_marker "$(cat "$MUT3/law-b.md")" 'GATE-ONESHOT-GRAMMAR')"
  if printf '%s' "$gb" | grep -q 'số phút là ĐIỀU MÁY BIẾT'; then
    mut "chèn lại câu mời khai phút vào bản sao → ĐỎ «con moi khai phut»"
  else
    bad "ONESHOT: chieu do (b) khong chay — buoc tiem khong vao duoc trong khoi"
  fi
fi
# chân PER-SITE — điều khoản `GATE-ONESHOT-CLAUSE` chép nguyên văn ở từng thân
# lệnh cổng, số bản khai trong `GATE-ONESHOT-SITES`. [SỬA SAU CỔNG 1] Bản duyệt
# viết «ba site Claude … đồng bộ với khối gốc», nhưng cái các site chép là
# CLAUSE chứ không phải GRAMMAR, và `commands/start.md` không hề mang cụm
# «ĐƯỢC CHẤP NHẬN» nào — bản trước thay vật đo bằng chính bản luật (H2).
OS_CLAUSE="$(rut_marker "$LAW_HEAD" 'GATE-ONESHOT-CLAUSE' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | grep -v '^$')"
os_ok=0; os_tong=0
if [ -z "$OS_CLAUSE" ]; then
  bad "ONESHOT-SITE: khong rut duoc GATE-ONESHOT-CLAUSE — chan per-site khong song"
else
  while read -r site so; do
    [ -n "${site:-}" ] || continue
    os_tong=$((os_tong + 1))
    that="$(grep -Ioc -- "$OS_CLAUSE" "$ROOT/$site" 2>/dev/null || true)"; that="${that:-0}"
    if [ "$that" -eq "$so" ]; then os_ok=$((os_ok + 1))
    else bad "ONESHOT-SITE: $site co $that ban chep nguyen van, ban khai doi $so"; fi
  done < <(rut_marker "$LAW_HEAD" 'GATE-ONESHOT-SITES')
  if [ "$os_tong" -eq 0 ]; then
    bad "ONESHOT-SITE: khoi GATE-ONESHOT-SITES rong — chan per-site khong song"
  else
    echo "ONESHOT-SITE: $os_ok/$os_tong"
    [ "$os_ok" -eq "$os_tong" ] || bad "ONESHOT-SITE: $os_ok/$os_tong site dong bo"
  fi
fi
# Không được ghi nữa: hai thân lệnh cổng phải hết chỗ GHI trường phút
if grep -q 'time_human_minutes' "$ROOT/commands/approve.md" "$ROOT/commands/signoff.md"; then
  bad "ONESHOT: con cho GHI truong phut o than lenh cong"
else
  ok "ONESHOT: hai than lenh cong het cho GHI truong phut OK"
fi

echo "== E2 · đường ĐỌC-CŨ cho hồ sơ đã ký (AC-2) =="
# [SỬA SAU CỔNG 1 — vòng sửa 1] Eval này hứa 8 tổ hợp + round-trip + hai chiều
# đỏ, và bộ răng KHÔNG có một dòng mã nào cho nó suốt ba vòng (H1). Nay cài đủ.
# MỘT vế của bản duyệt phải khai lại: «card cổng render từ fixture CŨ phải vẫn
# hiện đúng con số 7/3». Đo lại: KHÔNG bên đọc nào — kể cả trên base — từng đọc
# `time_human_minutes` (grep 4 bên đọc, cả hai cây, = 0). Vế ấy KHÔNG THOẢ ĐƯỢC,
# và một chân không thoả được là một chân sẽ bị hạ thước. Vế thay thế đo đúng
# lời hứa gốc «giữ được sử liệu»: sau khi cả bốn bên đọc chạy, trường phút trong
# hồ sơ CŨ còn NGUYÊN BYTE trên đĩa (bên đọc không âm thầm gọt sử liệu).
DOC_SLUG="$FIX_SLUG"
dung_fixture() {   # $1 = đích, $2 = 'cu' | 'moi'
  local dst="$1" kieu="$2" f
  mkdir -p "$dst/_acceptance/$DOC_SLUG"
  cp "$ROOT/_acceptance/config.yaml" "$dst/_acceptance/config.yaml"
  for f in contract.md evals.yaml evidence-report.md run-log.jsonl gap-probe.md; do
    g show "$BASE:_acceptance/$DOC_SLUG/$f" > "$dst/_acceptance/$DOC_SLUG/$f" 2>/dev/null || return 1
  done
  [ "$kieu" = "cu" ] && return 0
  # Fixture MỚI: frontmatter lấy NGUYÊN từ BÊN VIẾT (khuôn máy-đọc
  # `CONTRACT-FRONTMATTER-TEMPLATE` trên cây HEAD), chỉ thay chỗ trống. KHÔNG
  # nặn tay — đó là đúng chỗ bên-viết-và-bên-đọc trôi khỏi nhau.
  local khuon than
  khuon="$(khoi_tep "$ROOT/skills/acceptance/references/contract-template.md" 'CONTRACT-FRONTMATTER-TEMPLATE' \
            | sed '/^```/d')"
  [ -n "$khuon" ] || return 1
  khuon="$(printf '%s\n' "$khuon" \
    | sed "s|{feature}|Fixture đường đọc-cũ|; s|{slug}|$DOC_SLUG|; s|{owner}|phanlemanh@gmail.com|; \
           s|{risk_tier}|T2|; s|{surfaces}|cli|; s|{status}|signed-off|" \
    | sed 's/^approved_by:$/approved_by: Manh Phan/; s/^approved_at:$/approved_at: 2026-08-06T01:42:39Z/')"
  than="$(awk 'BEGIN{n=0} /^---$/{n++; if(n<=2) next} n>=2{print}' "$dst/_acceptance/$DOC_SLUG/contract.md")"
  printf '%s\n%s\n' "$khuon" "$than" > "$dst/_acceptance/$DOC_SLUG/contract.md"
  return 0
}
# Bản đồ sản phẩm phải do bộ dựng SẠCH vẽ trước, nếu không `--check` thoát sớm
# ở nhánh "PRODUCT-MAP.md đã bị xoá" và chân product-map đo đúng một câu lỗi
# chung cho cả hai fixture — một tổ hợp xanh mà chưa từng đọc hồ sơ nào.
ve_ban_do() { ( cd "$ROOT" && node scripts/product-map.mjs --root "$1" >/dev/null 2>&1 ); }
FIX_CU="$(tmpd)"; FIX_MOI="$(tmpd)"
doc_du=1
dung_fixture "$FIX_CU" cu   || doc_du=0
dung_fixture "$FIX_MOI" moi || doc_du=0
if [ "$doc_du" -eq 0 ]; then
  bad "DOC-CU: khong dung duoc hai fixture — moi chan duoi vo nghia"
elif grep -q 'time_human_minutes' "$FIX_MOI/_acceptance/$DOC_SLUG/contract.md"; then
  bad "ROUND-TRIP: ben viet con ghi phut — khuon CONTRACT-FRONTMATTER-TEMPLATE van sinh truong phut"
elif ! grep -q 'time_human_minutes' "$FIX_CU/_acceptance/$DOC_SLUG/contract.md"; then
  bad "DOC-CU: fixture CU khong co truong phut — no khong con la ho so cu, phep do khong song"
else
  ok "ROUND-TRIP: fixture-moi sinh boi CONTRACT-FRONTMATTER-TEMPLATE (ben viet that) OK"
  ve_ban_do "$FIX_CU"; ve_ban_do "$FIX_MOI"
  # Bốn bên đọc × hai fixture = 8 tổ hợp. Điều kiện xanh của TỪNG tổ hợp: bên
  # đọc chạy hết (mã thoát < 2) và đầu ra KHÔNG nhắc tới trường phút / trường
  # lạ. Điều kiện xanh của TỪNG CẶP: **phán quyết trên hai fixture BẰNG NHAU** —
  # đó mới là mệnh đề AC-2 cần («có hay không có trường phút, bên đọc xử y hệt»).
  # Chỉ «không lỗi» thì một bên đọc thoát sớm ở cả hai fixture cũng xanh, và
  # tổ hợp ấy chưa từng đọc hồ sơ nào.
  doc_phan_quyet() {   # $1 = tên bên đọc, $2 = fixture root, $3 = gốc scripts
    local out rc tok
    case "$1" in
      pre-merge-check)
        out="$(cd "$ROOT" && bash "$3/pre-merge-check.sh" "$2" --slug "$DOC_SLUG" 2>&1)"; rc=$?
        tok="rc=$rc vi-pham=$(printf '%s' "$out" | grep -c '^VIOLATION' || true) ok=$(printf '%s' "$out" | grep -c "^OK \[$DOC_SLUG\]" || true)" ;;
      recheck-evidence)
        out="$(cd "$ROOT" && node "$3/recheck-evidence.cjs" "$2/_acceptance/$DOC_SLUG/evidence-report.md" 2>&1)"; rc=$?
        tok="rc=$rc" ;;
      product-map)
        out="$(cd "$ROOT" && node "$3/product-map.mjs" --root "$2" --check 2>&1)"; rc=$?
        tok="rc=$rc $(printf '%s' "$out" | grep -oE 'khớp|lệch' | head -1)" ;;
      gate-card)
        out="$(cd "$ROOT" && node "$3/gate-card.js" --slug "$DOC_SLUG" --root "$2" 2>&1)"; rc=$?
        tok="rc=$rc viec=$(printf '%s' "$out" | grep -c 'VIỆC CỦA ANH' || true)" ;;
    esac
    printf '%s\x02%s' "$tok" "$out"
  }
  READERS=(pre-merge-check recheck-evidence product-map gate-card)
  doc_ok=0; doc_tong=0; cap_ok=0
  for rd in "${READERS[@]}"; do
    tok_cu=""; tok_moi=""
    for fx in cu moi; do
      doc_tong=$((doc_tong + 1))
      case "$fx" in cu) fr="$FIX_CU" ;; *) fr="$FIX_MOI" ;; esac
      res="$(doc_phan_quyet "$rd" "$fr" "$ROOT/scripts")"
      tok="${res%%$'\x02'*}"; out="${res#*$'\x02'}"
      case "$fx" in cu) tok_cu="$tok" ;; *) tok_moi="$tok" ;; esac
      if printf '%s' "$tok" | grep -q 'rc=[2-9]'; then
        bad "DOC-CU: $rd x $fx VO — ben doc chet ($tok)"
        printf '%s\n' "$out" | tail -3 | sed 's/^/         /'
      elif printf '%s' "$out" | grep -qi 'time_human_minutes\|unknown field\|missing field'; then
        bad "DOC-CU: $rd x $fx VO — dau ra canh bao ve truong phut/truong la:"
        printf '%s' "$out" | grep -i 'time_human_minutes\|unknown field\|missing field' | head -2 | sed 's/^/         /'
      else
        ok "DOC-CU: $rd x $fx OK ($tok)"; doc_ok=$((doc_ok + 1))
      fi
    done
    if [ "$tok_cu" = "$tok_moi" ]; then
      ok "DOC-CU: $rd phan quyet cu == moi OK"; cap_ok=$((cap_ok + 1))
    else
      bad "DOC-CU: $rd phan quyet LECH — cu «$tok_cu» vs moi «$tok_moi»"
    fi
  done
  echo "DOC-CU: $doc_ok/$doc_tong"
  [ "$doc_ok" -eq "$doc_tong" ] || bad "DOC-CU: $doc_ok/$doc_tong to hop xanh"
  [ "$cap_ok" -eq "${#READERS[@]}" ] || bad "DOC-CU: $cap_ok/${#READERS[@]} cap phan quyet bang nhau"
  # Sử liệu còn nguyên byte sau khi cả bốn bên đọc chạy
  con="$(grep -c 'time_human_minutes' "$FIX_CU/_acceptance/$DOC_SLUG/contract.md" || true)"
  goc="$(g show "$BASE:_acceptance/$DOC_SLUG/contract.md" | grep -c 'time_human_minutes' || true)"
  if [ "$con" -eq "$goc" ] && [ "$con" -gt 0 ]; then
    ok "DOC-CU: su lieu con nguyen sau 4 ben doc ($con/$goc dong truong phut) OK"
  else
    bad "DOC-CU: ben doc da got su lieu ($con/$goc dong truong phut con lai)"
  fi
  # ── chiều đỏ CHẠY THẬT ×2 ──────────────────────────────────────────────────
  # (a) cho MỘT bên đọc thôi dung thứ trường lạ → fixture CŨ phải ĐỎ, fixture
  #     MỚI phải vẫn sạch. Chạy qua CHÍNH đường thật (`product-map.mjs` gọi
  #     `lib/workspace-record.cjs`), không gọi hàm trần: bản sao mang cả `lib/`
  #     lẫn `scripts/` nên nó là một cây chạy được, chỉ khác đúng một chỗ tiêm.
  MUTA="$(tmpd)"
  cp -r "$ROOT/lib" "$ROOT/scripts" "$MUTA/"
  cat >> "$MUTA/lib/workspace-record.cjs" <<'JS'
// [đột biến E2 (a)] bên đọc THÔI dung thứ trường lạ trong frontmatter — đúng
// hình dạng hồi quy mà chân DOC-CU sinh ra để bắt.
const _origRecordProblem = module.exports.recordProblem;
module.exports.recordProblem = function (texts) {
  for (const k of Object.keys(texts || {})) {
    const v = texts[k];
    const t = typeof v === 'string' ? v : (v && v.t);
    if (typeof t === 'string' && t.includes('time_human_minutes')) return 'unknown field: time_human_minutes';
  }
  return _origRecordProblem(texts);
};
JS
  mua_cu="$(doc_phan_quyet product-map "$FIX_CU" "$MUTA/scripts")";  mua_cu="${mua_cu%%$'\x02'*}"
  mua_moi="$(doc_phan_quyet product-map "$FIX_MOI" "$MUTA/scripts")"; mua_moi="${mua_moi%%$'\x02'*}"
  if [ "$mua_cu" = "$mua_moi" ]; then
    bad "DOC-CU: chieu do (a) khong chay — ban sao da bo dung-thu ma hai phan quyet van bang nhau («$mua_cu»)"
  else
    mut "gỡ dung-thứ-trường-lạ khỏi bản sao lib/workspace-record.cjs → phán quyết LỆCH (cu «$mua_cu» vs moi «$mua_moi») → chân DOC-CU ĐỎ"
  fi
  # (b) cho BÊN VIẾT ghi lại khoá phút → ROUND-TRIP phải ĐỎ
  MUTB="$(tmpd)"
  sed 's/^approved_at:$/approved_at:\ntime_human_minutes: {gate1: 0, gate2: 0}/' \
    "$ROOT/skills/acceptance/references/contract-template.md" > "$MUTB/contract-template.md"
  if khoi_tep "$MUTB/contract-template.md" 'CONTRACT-FRONTMATTER-TEMPLATE' | grep -q 'time_human_minutes'; then
    mut "cho khuôn bên viết ghi lại khoá phút trong bản sao → ROUND-TRIP ĐỎ «ben viet con ghi phut»"
  else
    bad "ROUND-TRIP: chieu do (b) khong chay — buoc tiem khong vao duoc trong khoi khuon"
  fi
fi

echo "== E17 · khuôn template giao ra YAML PARSE ĐƯỢC (AC-14) =="
# [THÊM SAU CỔNG 1 — vòng sửa 1, do rà soát đối kháng vòng 1 tìm ra (H4)]
# Hạng mục 1a.1 xoá dòng CHA `time_human_minutes:` ở hai khuôn mà để lại dòng
# CON thụt vào → khối YAML hỏng. Nó xanh suốt vì ca thường trực `P82` đọc khoá
# top-level bằng parser theo dòng và bỏ qua dòng thụt: bên viết và bên đọc trôi
# khỏi nhau. Bốn tệp template/reference mà hồ sơ này chạm có ĐỘ PHỦ BẰNG KHÔNG
# — không thuộc một AC, một eval hay một chân nào. Chân này đóng lỗ ấy bằng
# parser YAML THẬT, không bằng regex.
declare -a YKHUON=(
  "skills/acceptance/references/contract-template.md|CONTRACT-FRONTMATTER-TEMPLATE"
  "skills/acceptance/references/opportunity-template.md|OPP-FRONTMATTER-TEMPLATE"
  "skills/acceptance/references/uat-session-template.md|UAT-FRONTMATTER-TEMPLATE"
)
# Chỗ trống được ĐIỀN trước khi parse — đó là điều bên tiêu thụ làm, và phép đo
# phải đo cái bên tiêu thụ nhận. Điền bằng một scalar trơ nên phép thay KHÔNG
# đụng vào thụt đầu dòng: đúng chỗ lỗi khoá-mồ-côi sống, nên nó vẫn bị bắt.
yaml_parse() {   # đọc khối YAML trên stdin → in PARSE-OK hoặc thông điệp lỗi
  python3 -c '
import sys, re, yaml
t = sys.stdin.read()
t = re.sub(r"\{\{[^{}]*\}\}", "X", t)      # {{chỗ trống}}
t = re.sub(r"\{[^{}]*\}", "X", t)          # {chỗ trống}
yaml.safe_load(t)
print("PARSE-OK")' 2>&1
}
y_ok=0
for spec in "${YKHUON[@]}"; do
  yf="${spec%%|*}"; ym="${spec##*|}"
  blk="$(khoi_tep "$ROOT/$yf" "$ym" | sed '/^```/d; /^---$/d')"
  if [ -z "$blk" ]; then
    bad "YAML-KHUON: khong rut duoc $ym tu $yf — phep do khong song"
    continue
  fi
  res="$(printf '%s\n' "$blk" | yaml_parse)"
  if [ "$res" = "PARSE-OK" ]; then
    ok "YAML-KHUON: $ym parse duoc bang yaml.safe_load OK"; y_ok=$((y_ok + 1))
  else
    bad "YAML-KHUON: $ym KHONG parse duoc: $(printf '%s' "$res" | head -2 | tr '\n' ' ')"
  fi
done
echo "YAML-KHUON: $y_ok/${#YKHUON[@]}"
[ "$y_ok" -eq "${#YKHUON[@]}" ] || bad "YAML-KHUON: $y_ok/${#YKHUON[@]} khuon parse duoc"
# Khuôn frontmatter của trang bằng chứng không có marker riêng — rút qua hàng
# rào `---8<---` rồi parse cùng luật, để tệp thứ tư 1a chạm không còn phủ 0.
ev_blk="$(awk '/^---8<---/{f=1;next} f&&/^---$/{n++; if(n==1) next; if(n==2) exit} f&&n>=1{print}' \
           "$ROOT/skills/acceptance/references/evidence-report-template.md")"
if [ -z "$ev_blk" ]; then
  bad "YAML-KHUON: khong rut duoc frontmatter cua evidence-report-template — phep do khong song"
else
  res="$(printf '%s\n' "$ev_blk" | yaml_parse)"
  if [ "$res" = "PARSE-OK" ]; then
    ok "YAML-KHUON: frontmatter evidence-report-template parse duoc OK"
  else
    bad "YAML-KHUON: frontmatter evidence-report-template KHONG parse duoc: $(printf '%s' "$res" | head -2 | tr '\n' ' ')"
  fi
fi
# chiều đỏ CHẠY THẬT: tái tạo ĐÚNG lỗi đã bắt được — xoá dòng cha, giữ dòng con
MUT17="$(tmpd)"
printf 'a: 1\nb:\n  c: 2\n' | sed '/^b:$/d' > "$MUT17/hong.yaml"
if [ "$(yaml_parse < "$MUT17/hong.yaml")" = "PARSE-OK" ]; then
  bad "YAML-KHUON: chieu do khong chay — khoi mo coi van parse duoc, parser khong phai YAML that"
else
  mut "xoá dòng cha giữ dòng con (đúng hình dạng lỗi đã bắt) → yaml.safe_load ĐỎ"
fi

echo
if [ "$fails" -gt 0 ]; then
  echo "CAT-HINH-THUC-RANG: $fails phép đo ĐỎ"
  exit 1
fi
echo "CAT-HINH-THUC-RANG: tất cả phép đo xanh"
exit 0
