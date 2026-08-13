#!/usr/bin/env bash
# Răng đo cho hồ sơ cat-hinh-thuc — "chỉ TRỪ trong luật hành xử".
#
# Vật được giao ở đây phần lớn là SỰ VẮNG MẶT của một luật. Đó là hình dạng
# nguy hiểm nhất trong sổ vấp của kho: "assertion âm-tính-một-mình là assertion
# không sống" — grep hỏng, needle gõ sai, script chưa chạy đều cho cùng màu
# xanh. Nên MỌI phép đo âm ở đây bị buộc ba điều:
#   (a) ĐỐI CHỨNG DƯƠNG neo vào `origin/main` — cùng câu quét trên cây đó phải
#       cho >0 hit. Needle nào base=0 thì chính lưới này tuyên "phép đo không
#       sống" chứ không xanh.
#   (b) GHIM ĐÚNG THÔNG ĐIỆP đã hứa trong evals.yaml, không tin mã thoát.
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

# ── Phạm vi quét: MỘT bản, in ra để người đối chiếu ──────────────────────────
# evals.yaml đòi script IN RA phạm vi nó THỰC quét — không bắt người tin lời
# khai trong contract. Hai bên lệch nhau là lớp lỗi bên-viết-và-bên-đọc-trôi.
SCOPE=(commands skills feature-loop scripts hooks lib GUIDE.md QUICKSTART.md
       README.md CONTEXT.md)
echo "CAT-SCOPE: ${SCOPE[*]}"
sc_missing=""
for sp in "${SCOPE[@]}"; do [ -e "$ROOT/$sp" ] || sc_missing="$sc_missing $sp"; done
if [ -n "$sc_missing" ]; then
  echo "CAT-SCOPE: muc KHONG TON TAI:$sc_missing — moi so 0 duoi day vo nghia"
  exit 1
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

echo "== E1 · lớp HỎI phút (AC-1) =="
quet_am "CAT-PHUT" 'hỏi user số phút' 'how many minutes'
# chiều đỏ CHẠY THẬT: chèn lại câu cũ vào BẢN SAO rồi chạy lại chính head_hits
MUT1="$(mktemp -d)"; mkdir -p "$MUT1/feature-loop/skills/feature-loop"
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
rm -rf "$MUT1"

echo "== E1b · lớp KHẲNG ĐỊNH về phút (AC-12) =="
# Tách khỏi E1 vì mọi needle dạng CÂU HỎI đều MÙ với văn quảng cáo.
quet_am "KPI-PHUT" 'baseline_minutes' 'Giảm \*\*≥ 50%\*\*' '5[–-]10 phút' 'time_human_minutes.*điền'
MUT2="$(mktemp -d)"
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
rm -rf "$MUT2"

echo "== E9b · hỏi tuần tự (AC-13) =="
# Neo ÂM cho AC-9 (tiêu chí viết thuần dương): câu cũ có thể còn ở thân skill
# hay reference mà lệnh khởi tạo dẫn tới — agent hội đồng chỉ đọc thân lệnh nên
# vẫn diễn đúng bài và PASS, còn phiên thật vẫn phỏng vấn tuần tự.
quet_am "HOI-TUAN-TU" 'one question at a time'

echo "== E5 · luật mỗi-tin đã gỡ, khuôn cổng giữ nguyên (AC-5) =="
LAW="skills/acceptance/references/human-facing-language.md"
# (1) NEO ÂM — điều khoản tin CHỈ-BÁO kết-bằng-khối đã vắng
quet_am "MOI-TIN" 'tin chỉ-báo ghi rõ' 'CHỈ-BÁO.*vẫn kết bằng khối'
# (2)(3) đối chứng GIỮ-GÂN: hai khuôn rút qua marker, byte-equal base
rut_marker() {   # $1 = văn bản, $2 = tên marker
  printf '%s\n' "$1" | awk -v m="$2" '
    index($0, "<<<" m) { f = 1; next }
    index($0, m ">>>") { f = 0 }
    f { print }'
}
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
    # Điều khoản này CÓ đổi đúng một vế (bỏ tin chỉ-báo) theo AC-5, nên
    # byte-equal là sai kỳ vọng. Chân đúng: phạm vi «tin mời cổng» còn nguyên,
    # và vế chỉ-báo đã vắng.
    if printf '%s' "$a" | grep -q 'Mọi tin mời cổng' && ! printf '%s' "$a" | grep -q 'chỉ-báo'; then
      ok "MOI-TIN: $mk giu pham vi tin-moi-cong, da bo ve chi-bao OK"; giu_gan=$((giu_gan + 1))
    else
      bad "MOI-TIN: $mk mat pham vi tin-moi-cong hoac con ve chi-bao"
    fi
  else
    bad "MOI-TIN: khuon $mk LECH base — chip GO da cat nham sang khuon phai giu"
  fi
done
[ "$giu_gan" -eq 2 ] && ok "MOI-TIN: 2/2 khuon giu-gan OK"
# Chân LAN: bốn bên chép nguyên văn phải đồng bộ — gỡ-một-chỗ-quên-ba-chỗ.
lan="$( ( cd "$ROOT" && grep -rIln 'kết bằng đúng MỘT khối' "${SCOPE[@]}" 2>/dev/null ) || true)"
lan_base="$(g grep -I -l -e 'kết bằng đúng MỘT khối' "$BASE" -- "${SCOPE[@]}" 2>/dev/null | grep -c . || true)"
lan_n="$(printf '%s' "$lan" | grep -c . || true)"
if [ "$lan_base" -eq 0 ]; then
  bad "MOI-TIN-CASE: base=0 — phep dem lan khong song"
elif [ "$lan_n" -gt 5 ]; then
  bad "MOI-TIN: con o $(printf '%s' "$lan" | tr '\n' ' ')"
else
  ok "MOI-TIN-CASE: base=$lan_base(>0) HEAD=$lan_n (chi con site tin-moi-cong) OK"
fi
# chiều đỏ CHẠY THẬT: chép lại điều khoản mỗi-tin vào bản sao một command
MUT5="$(mktemp -d)"; mkdir -p "$MUT5/commands"
cp "$ROOT/commands/acceptance-status.md" "$MUT5/commands/acceptance-status.md"
if ( cd "$MUT5" && grep -rq 'còn việc kế thì kết bằng đúng MỘT khối' . 2>/dev/null ); then
  bad "MOI-TIN: ban sao CHUA tiem da co dieu khoan — doi chung duong hong"
else
  printf '\n; còn việc kế thì kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE.\n' \
    >> "$MUT5/commands/acceptance-status.md"
  if ( cd "$MUT5" && grep -rln 'còn việc kế thì kết bằng đúng MỘT khối' . 2>/dev/null ) | grep -q 'acceptance-status'; then
    mut "chép lại điều khoản mỗi-tin vào bản sao acceptance-status.md → chân LAN ĐỎ đích danh"
  else
    bad "MOI-TIN: chieu do khong chay"
  fi
fi
rm -rf "$MUT5"

echo "== E6 · thẻ cổng VẪN có khối (AC-6, đối chứng giữ-gân) =="
# Đo trên ĐẦU RA của bộ dựng, KHÔNG grep mã nguồn — grep mã nguồn là đo chỉ-dẫn
# thay vì đo vật được giao (lớp đã dẫm 4 vòng ở s4-scope-triage).
CARD="$ROOT/scripts/gate-card.js"
the_cong() {   # $1 = đường dẫn gate-card.js cần chạy → in số mode CÒN khối
  local js="$1" n=0 slug out
  for slug in $(cd "$ROOT/_acceptance" && ls -d */ 2>/dev/null | tr -d '/' | head -3); do
    out="$(cd "$ROOT" && node "$js" --slug "$slug" --root . 2>/dev/null)" || continue
    printf '%s' "$out" | grep -q 'VIỆC CỦA ANH' && n=$((n + 1))
  done
  echo "$n"
}
TC="$(the_cong "$CARD")"
if [ "$TC" -ge 3 ]; then
  ok "THE-CONG: 3/3 the con khoi OK (do tren DAU RA cua bo dung, khong grep ma nguon)"
else
  bad "THE-CONG: chi $TC/3 the con khoi 👉 VIỆC CỦA ANH — chip GO da cat nham sang the cong"
fi
# chiều đỏ CHẠY THẬT: gỡ khối khỏi bản sao gate-card.js rồi chạy lại chính hàm
MUT6="$(mktemp -d)"
sed 's/VIỆC CỦA ANH/VIEC-DA-BI-GO/g' "$CARD" > "$MUT6/gate-card.js"
if ! grep -q 'VIEC-DA-BI-GO' "$MUT6/gate-card.js"; then
  bad "THE-CONG: buoc tiem KHONG go duoc khoi khoi ban sao — chieu do khong chay"
elif [ "$(the_cong "$MUT6/gate-card.js")" -eq 0 ]; then
  mut "gỡ khối khỏi bản sao gate-card.js → THE-CONG MAT khoi ở mọi thẻ"
else
  bad "THE-CONG: ban sao da go khoi ma van dem duoc the con khoi — phep do khong song"
fi
rm -rf "$MUT6"

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
# chiều đỏ CHẠY THẬT: xoá một dòng sổ vàng khỏi bản sao
MUT4="$(mktemp)"; printf '%s' "$rep_head" | grep -v 'acceptance-gold.mjs' > "$MUT4"
m4h="$(grep -c 'acceptance-gold.mjs\|sổ vàng' "$MUT4" || true)"
if [ "$m4h" -lt "$sovang_h" ]; then
  mut "xoá dòng sổ vàng khỏi bản sao → phép so ĐỎ 'so vang LECH base' ($m4h < $sovang_h)"
else
  bad "REPORT: chieu do khong chay — xoa dong ma so dem khong giam"
fi
rm -f "$MUT4"

echo "== E10 · hai thân nói cùng một câu về ai commit chữ ký (AC-10) =="
S1="$ROOT/commands/signoff.md"; S2="$ROOT/skills/acceptance/SKILL.md"
if grep -q 'The user (not you) fills' "$S2"; then
  bad "AI-COMMIT: hai than LECH: skills/acceptance/SKILL.md con cau cu 'The user (not you) fills'"
elif grep -q 'own commit' "$S1" && grep -qi 'explicitly instruct you to commit' "$S2"; then
  ok "AI-COMMIT: hai than dong bo OK (nguoi tu commit HOAC ra lenh tuong minh)"
else
  bad "AI-COMMIT: hai than LECH: khong tim thay cau dong bo o mot trong hai ben"
fi
# đối chứng dương: base PHẢI có câu cũ, nếu không thì chân này chưa từng đo gì
if g show "$BASE:skills/acceptance/SKILL.md" 2>/dev/null | grep -q 'The user (not you) fills'; then
  mut "base còn câu cũ «The user (not you) fills» → chân này phân biệt được hai cây"
else
  bad "AI-COMMIT: base khong co cau cu — doi chung duong hong, chan nay khong song"
fi

echo "== E3 · ngữ pháp một-lượt-gõ vẫn NHẬN vế phút và bỏ qua (AC-3) =="
# Chip này GỠ một luật nhưng KHÔNG được chặn người quen tay. Chân dương.
gram=0
for f in commands/approve.md commands/signoff.md skills/acceptance/references/human-facing-language.md; do
  if tr '\n' ' ' < "$ROOT/$f" | tr -s ' ' | grep -q 'phút <số>' \
     && tr '\n' ' ' < "$ROOT/$f" | tr -s ' ' | grep -q 'ĐƯỢC CHẤP NHẬN'; then
    gram=$((gram + 1))
  else
    bad "ONESHOT: mat ve chap-nhan-bo-qua o $f — nguoi quen tay se bi chan"
  fi
done
[ "$gram" -eq 3 ] && ok "ONESHOT-SITE: 3/3 than dong bo ve chap-nhan-bo-qua OK"
# Không được ghi nữa: hai thân lệnh cổng phải hết chỗ GHI trường phút
if grep -q 'time_human_minutes' "$ROOT/commands/approve.md" "$ROOT/commands/signoff.md"; then
  bad "ONESHOT: con moi khai phut o than lenh cong"
else
  ok "ONESHOT: hai than lenh cong het cho GHI truong phut OK"
fi

echo
if [ "$fails" -gt 0 ]; then
  echo "CAT-HINH-THUC-RANG: $fails phép đo ĐỎ"
  exit 1
fi
echo "CAT-HINH-THUC-RANG: tất cả phép đo xanh"
exit 0
