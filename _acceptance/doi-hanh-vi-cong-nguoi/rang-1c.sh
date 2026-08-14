#!/usr/bin/env bash
# Răng đo cho hồ sơ doi-hanh-vi-cong-nguoi (1c) — lớp MÁY.
#
# VAI KHAI THẲNG (Notes của contract): lớp này CHỈ chứng **mực đã in** —
# chuỗi luật cũ vắng trên cây sửa VÀ hiện >0 lần trên mốc BASE-1C bằng CÙNG
# một lệnh; số bản chép khớp bản GHIM; đẳng thức số ca. Nó KHÔNG chứng được
# lời hứa hành vi ("agent đọc chỉ dẫn rồi hành xử thế nào") — thứ đó là việc
# của bốn eval hội đồng, BẮT BUỘC trước Cổng Bằng chứng (owner, Cổng 0 14/08).
# Ba câu bị CẤM ở đây vì đã chứng minh là hằng đúng ở hồ sơ 1a: "đo QUAN HỆ",
# "so TẬP CÂU", "đối chứng dương TỰ SINH".
#
# Mỗi chân bị buộc ba điều:
#   (a) ĐỐI CHỨNG DƯƠNG neo vào MỐC BẤT BIẾN `BASE-1C` đọc từ contract (không
#       `origin/main` — main còn di chuyển, và sau khi hồ sơ này merge thì
#       needle về 0 ở cả hai đầu, phép đo tự chết).
#   (b) GHIM ĐÚNG THÔNG ĐIỆP đã hứa trong evals.yaml, không tin mã thoát.
#   (c) CHIỀU ĐỎ CHẠY THẬT trong CÙNG lượt: dựng bản sao code-sinh, tiêm lỗi,
#       chạy lại CHÍNH hàm kiểm đó, đòi nó ĐỎ đúng thông điệp. Mutant phải
#       CHẠY ĐƯỢC — đỏ vì vật hỏng, không vì crash. Vết in ra là bằng chứng
#       phá-thử; không có vết thì eval không có quyền xanh (gap-probe P1).
#
# Mọi đường dẫn SUY TỪ VỊ TRÍ SCRIPT — không hardcode ROOT.
#
# Dùng: rang-1c.sh --chan g1|manifest|g3|g4|so-ca-asserts   (vắng cờ: chạy hết)
#
# Chân g2 (hạng mục T1) ĐÃ RA khỏi hồ sơ ở vòng thu phạm vi 14/08 — xem
# [THU PHẠM VI] trong contract. Không để lại chân chết ở đây: một chân quét
# nhóm needle rỗng sẽ XANH vĩnh viễn mà không đo gì.
set -u

WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
CONTRACT="$WS/contract.md"
fails=0
ok()  { echo "  OK   $*"; }
bad() { echo "  ĐỎ   $*"; fails=$((fails + 1)); }
mut() { echo "       [chiều đỏ] $*"; }
g()   { git -C "$ROOT" "$@"; }
TMPS=()
don_dep() { local d; for d in "${TMPS[@]:-}"; do [ -n "$d" ] && rm -rf "$d"; done; }
trap don_dep EXIT
tmpd() { local d; d="$(mktemp -d)"; TMPS+=("$d"); printf '%s' "$d"; }

CHAN="${2:-}"
[ "${1:-}" = "--chan" ] || CHAN=""

# ── Bản khai máy-đọc: MỘT nguồn, đọc từ contract ────────────────────────────
khoi() {  # $1 = tên marker → in thân khối
  awk -v o="<!-- <<<$1" -v c="$1>>> -->" '
    index($0, o) { inb = 1; next }
    index($0, c) { inb = 0 }
    inb { print }
  ' "$CONTRACT"
}
BASE="$(khoi BASE-1C | tr -d '[:space:]')"
if [ -z "$BASE" ]; then
  echo "RANG-1C: KHONG doc duoc BASE-1C tu contract — moi doi chung duong vo nghia"
  exit 1
fi
if ! g cat-file -e "$BASE^{commit}" 2>/dev/null; then
  echo "RANG-1C: moc BASE-1C '$BASE' KHONG ton tai trong kho — vat hong, khong phai duong truyen"
  exit 1
fi
echo "RANG-1C-BASE: $BASE"

# Phạm vi quét needle: VAT-1C TRỪ tests/** (khai ở contract; lưới thường trực
# phải chứa chuỗi cũ trong fixture tiêm của nó — quét tests là bắt lưới tự tố).
# bash 3.2 (macOS) không có `mapfile` — đọc bằng while, giữ script chạy được
# ở mọi máy đội. Mutant không chạy được là mutant vô nghĩa; script đo cũng vậy.
SCOPE=()
while IFS= read -r v; do
  [ -n "$v" ] || continue
  case "$v" in tests/*) ;; *) SCOPE+=("$v") ;; esac
done < <(khoi VAT-1C | sed '/^[[:space:]]*$/d')
if [ "${#SCOPE[@]}" -eq 0 ]; then
  echo "RANG-1C: pham vi quet RONG — bo rang khong do gi"
  exit 1
fi
echo "RANG-1C-SCOPE: ${SCOPE[*]}"
thieu=""
for sp in "${SCOPE[@]}"; do [ -e "$ROOT/$sp" ] || thieu="$thieu $sp"; done
if [ -n "$thieu" ]; then
  echo "RANG-1C: muc KHONG TON TAI:$thieu — moi so 0 duoi day vo nghia"
  exit 1
fi

# ── Hàm kiểm dùng chung cho bốn chân needle ─────────────────────────────────
# dem_head <needle>  : số hit trên CÂY ĐANG KIỂM (phải 0)
# dem_base <needle>  : số hit trên MỐC (phải >0 — đối chứng dương)
# MỘT hàm đếm duy nhất, nhận GỐC làm tham số: cây thật và bản đột biến đi qua
# CHÍNH nó. Bản trước có hai phép đếm chép tay (một cho cây thật, một trong
# nhánh chiều-đỏ) — mutant khi ấy chứng minh cho bản chép, không cho checker.
dem_tai() {   # $1 = gốc cây, $2 = needle
  local goc="$1" n="$2" tong=0 c
  for sp in "${SCOPE[@]}"; do
    [ -e "$goc/$sp" ] || continue
    c=$(grep -rFc -- "$n" "$goc/$sp" 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}')
    tong=$((tong + c))
  done
  printf '%s' "$tong"
}
dem_head() { dem_tai "$ROOT" "$1"; }
dem_base() {
  local n="$1" tong=0 c
  for sp in "${SCOPE[@]}"; do
    c=$(g grep -F -c -- "$n" "$BASE" -- "$sp" 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}')
    tong=$((tong + c))
  done
  printf '%s' "$tong"
}

chan_needle() {   # $1 = nhóm (G1..G4), $2 = mô tả chân
  local nhom="$1" mota="$2" n head base sohit=0 loi=0
  while IFS='|' read -r g_ n; do
    [ "$g_" = "$nhom" ] || continue
    sohit=$((sohit + 1))
    head="$(dem_head "$n")"
    base="$(dem_base "$n")"
    if [ "$base" -eq 0 ]; then
      bad "$nhom needle CHET (base=0, go theo tri nho): $n"
      loi=1
    elif [ "$head" -ne 0 ]; then
      bad "$nhom con dau vet luat cu: '$n' — $head hit tren cay sua (base $base)"
      loi=1
    else
      ok "$nhom head=0 base=$base ← $n"
    fi
  done < <(khoi NEEDLE-1C | sed '/^[[:space:]]*$/d')
  if [ "$sohit" -eq 0 ]; then
    bad "$nhom KHONG co needle nao trong NEEDLE-1C — chan rong, khong phai chan xanh"
    return
  fi
  # (c) CHIỀU ĐỎ: chép nguyên phạm vi ra bản sao, tiêm lại MỘT chuỗi luật cũ,
  # chạy lại CHÍNH phép đếm — phải ĐỎ. Mutant chạy được (file có thật, grep
  # chạy bình thường) nên đỏ là vì vật hỏng, không vì crash.
  local d n1 dem
  d="$(tmpd)"
  n1="$(khoi NEEDLE-1C | sed '/^[[:space:]]*$/d' | awk -F'|' -v k="$nhom" '$1==k {print substr($0, index($0,"|")+1); exit}')"
  for sp in "${SCOPE[@]}"; do
    mkdir -p "$d/$(dirname "$sp")"; cp -R "$ROOT/$sp" "$d/$sp"
  done
  local victim
  victim="$(find "$d" -type f -name '*.md' | head -1)"
  if [ -z "$victim" ]; then
    bad "$nhom chieu do KHONG dung duoc ban sao — khong co tep de tiem"
    return
  fi
  # đối chứng: bản sao SẠCH phải cho 0 (nếu không, phép đo đang đo nhầm cây)
  if [ "$(dem_tai "$d" "$n1")" -ne 0 ]; then
    bad "$nhom CHIEU DO hong: ban sao SACH da cho >0 hit truoc khi tiem"
    return
  fi
  printf '\n%s\n' "$n1" >> "$victim"
  dem="$(dem_tai "$d" "$n1")"     # ← CHÍNH hàm đếm dùng cho cây thật
  if [ "$dem" -gt 0 ]; then
    mut "$nhom ban tiem CO $dem hit → phep dem BAT duoc luat cu quay lai ($mota)"
  else
    bad "$nhom CHIEU DO KHONG CHAY: tiem chuoi vao ban sao ma phep dem van 0 — phep do khong song"
  fi
}

# ── Chân 1/3/4/5: bốn nhóm needle ───────────────────────────────────────────
if [ -z "$CHAN" ] || [ "$CHAN" = "g1" ]; then
  echo "== chân G1: khối 👉 thôi làm luật mỗi-tin =="
  chan_needle G1 "khoi moi-tin"
  # luật MỚI phải có mặt, không chỉ luật cũ vắng (âm-tính-một-mình là không sống)
  LAW="$ROOT/skills/acceptance/references/human-facing-language.md"
  if grep -qF "KHÔNG đeo khối" "$LAW" && grep -qF "nói thẳng máy đang làm gì tiếp" "$LAW"; then
    ok "G1 ban luat CO luat moi cho tin chi-bao"
  else
    bad "G1 ban luat THIEU luat moi cho tin chi-bao — cat ma khong dat lai"
  fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "g3" ]; then
  echo "== chân G3: quét độ phủ thôi phỏng vấn =="
  chan_needle G3 "scan phong van"
  SC="$ROOT/skills/morphological-scan/SKILL.md"
  if grep -qF "[SUY-TỪ-REPO:" "$SC" && grep -qF "TỰ DỰNG" "$SC" && grep -qF "gạch MỘT lượt tại Cổng 1" "$SC"; then
    ok "G3 skill quet CO khuon nhan nguon moi + tu dung + gom mot luot gach"
  else
    bad "G3 skill quet THIEU mot trong ba ve: [SUY-TỪ-REPO: / TU DUNG / gom mot luot gach"
  fi
  if grep -qF '`[SP]`' "$SC"; then
    bad "G3 nhan cu [SP] van con trong skill quet"
  else
    ok "G3 nhan cu [SP] da sach"
  fi
fi

if [ -z "$CHAN" ] || [ "$CHAN" = "g4" ]; then
  echo "== chân G4: khởi tạo một-lần-gạch =="
  chan_needle G4 "init tuan tu"
  IN="$ROOT/commands/acceptance-init.md"
  if grep -qF "PROBE the repo first" "$IN" && grep -qF "# cần anh" "$IN" && grep -qF "single turn" "$IN"; then
    ok "G4 lenh khoi tao CO do-repo-truoc + mot luot + o '# cần anh'"
  else
    bad "G4 lenh khoi tao THIEU mot trong ba ve: PROBE / single turn / '# cần anh'"
  fi
fi

# ── Chân 2: manifest — so BA chiều, không tự tham chiếu ─────────────────────
if [ -z "$CHAN" ] || [ "$CHAN" = "manifest" ]; then
  echo "== chân manifest: bản chép khớp bản GHIM =="
  LAW="$ROOT/skills/acceptance/references/human-facing-language.md"
  khoi_law() {  # $1 = marker trong bản luật
    awk -v o="<!-- <<<$1 -->" -v c="<!-- $1>>> -->" '
      index($0, o) { inb = 1; next } index($0, c) { inb = 0 } inb { print }
    ' "$LAW"
  }
  dieu_khoan() {  # $1 = marker → thân điều khoản một dòng
    awk -v o="<!-- <<<$1 -->" -v c="<!-- $1>>> -->" '
      index($0, o) { inb = 1; next } index($0, c) { inb = 0 } inb { print }
    ' "$LAW" | sed '/^[[:space:]]*$/d'
  }
  CL_INVITE="$(dieu_khoan GATE-INVITE-CLAUSE)"
  CL_ONESHOT="$(dieu_khoan GATE-ONESHOT-CLAUSE)"
  [ -n "$CL_INVITE" ] && [ -n "$CL_ONESHOT" ] || { bad "manifest: khong rut duoc dieu khoan qua marker"; }

  # chiều 1: manifest SỐNG khớp bản GHIM trong contract (chống tự-loại-câu-chịu-lực)
  # MỘT hàm rút manifest, nhận TỆP LUẬT làm tham số — bản thật và bản đột biến
  # đi qua chính nó (cùng lý do với dem_tai ở trên).
  manifest_tu() {   # $1 = tệp bản luật → dòng `MARKER|site|số`, đã sắp
    local f="$1" mk
    for mk in GATE-INVITE-SITES GATE-ONESHOT-SITES; do
      awk -v o="<!-- <<<$mk -->" -v c="<!-- $mk>>> -->" -v k="$mk" '
        index($0, o) { inb = 1; next } index($0, c) { inb = 0 }
        inb && NF == 2 { print k "|" $1 "|" $2 }
      ' "$f"
    done | sort
  }
  song="$(manifest_tu "$LAW")"
  ghim="$(khoi MANIFEST-KY-VONG-1C | sed '/^[[:space:]]*$/d' | sort)"
  if [ "$song" = "$ghim" ]; then
    ok "manifest song KHOP ban ghim ($(printf '%s\n' "$ghim" | wc -l | tr -d ' ') site)"
  else
    bad "manifest song LECH ban ghim — site bien khoi manifest la DO, khong duoc roi khoi tap dem"
    diff <(printf '%s\n' "$ghim") <(printf '%s\n' "$song") | sed 's/^/       /'
  fi

  # chiều 2: từng site đủ SỐ bản chép nguyên văn điều khoản bản MỚI
  while IFS='|' read -r mk site so; do
    [ -n "${site:-}" ] || continue
    case "$mk" in GATE-INVITE-SITES) cl="$CL_INVITE" ;; *) cl="$CL_ONESHOT" ;; esac
    if [ ! -f "$ROOT/$site" ]; then bad "manifest site KHONG TON TAI: $site"; continue; fi
    thay=$(grep -Fc -- "$cl" "$ROOT/$site" 2>/dev/null || printf 0)
    if [ "$thay" -eq "$so" ]; then
      ok "manifest $site: $thay/$so ban chep nguyen van"
    else
      bad "manifest $site: thay $thay ban, khai $so — them/bot mot cho moi-cong la quyet dinh nguoi"
    fi
  done < <(printf '%s\n' "$ghim")

  # chiều 3: giữ-gân — khối tại cổng KHÔNG bị cắt lan
  TPL="$(awk '/<!-- <<<YOUR-MOVE-BLOCK-TEMPLATE -->/{i=1;next} /<!-- YOUR-MOVE-BLOCK-TEMPLATE>>> -->/{i=0} i' "$LAW")"
  if printf '%s' "$TPL" | grep -qF "làm gì" && printf '%s' "$TPL" | grep -qF "ở đâu" \
     && printf '%s' "$TPL" | grep -qF "trả lời dạng" && printf '%s' "$TPL" | grep -qF "___"; then
    ok "giu-gan: khuon khoi tai cong con nguyen ba ve + cho trong"
  else
    bad "giu-gan DO: khuon khoi tai cong bi cat lan — hang muc 1 chi go nghia vu moi-tin"
  fi

  # (c) CHIỀU ĐỎ: bản sao gỡ MỘT site khỏi manifest sống → chiều 1 phải ĐỎ
  d="$(tmpd)"; cp "$LAW" "$d/law.md"
  bo="$(printf '%s\n' "$ghim" | awk -F'|' '$1=="GATE-ONESHOT-SITES"{print $2; exit}')"
  awk -v b="$bo" '!(index($0, b) && NF==2)' "$d/law.md" > "$d/law2.md"
  if cmp -s "$d/law.md" "$d/law2.md"; then
    bad "manifest CHIEU DO KHONG TAC DUNG — khong go duoc site nao khoi ban sao"
  elif [ "$(manifest_tu "$d/law.md")" != "$song" ]; then
    bad "manifest CHIEU DO hong: ban sao SACH da lech ban that truoc khi tiem"
  else
    # bản đột biến đi qua CHÍNH manifest_tu, rồi CHÍNH phép so của chiều 1
    song2="$(manifest_tu "$d/law2.md")"
    if [ "$song2" = "$ghim" ]; then
      bad "manifest CHIEU DO KHONG CHAY: go site '$bo' ma phep so voi ban ghim VAN KHOP"
    else
      mut "manifest ban dot bien mat '$bo' → phep so voi ban ghim DO ($(printf '%s\n' "$song2" | grep -c . ) vs $(printf '%s\n' "$ghim" | grep -c . ) dong)"
    fi
  fi
fi

# ── Chân 6: đẳng thức số ca + assert-đã-gỡ ──────────────────────────────────
if [ -z "$CHAN" ] || [ "$CHAN" = "so-ca-asserts" ]; then
  echo "== chân số-ca + assert-đã-gỡ =="
  # (a) ĐẲNG THỨC SỐ CA — chân này SINH RA TỪ MỘT LỖ THẬT (phiên chấm vòng 1,
  # 14/08): `expected` của E9e hứa "đọc SO-CA-KY-VONG-1C rồi chạy lại phương
  # pháp đếm từng suite", nhưng bộ răng KHÔNG có một dòng mã nào cho vế đó —
  # số ca khi ấy do người chấm đếm tay từ đầu ra. Eval xanh mà lời hứa không
  # có răng: đúng lớp "bên viết và bên đọc trôi khỏi nhau". Nay đo thật.
  #
  # Phương pháp đếm KHÁC NHAU theo suite, ghim theo nếp so-ca.sh của hồ sơ 1b:
  #   plugins   → đếm dòng ca (suite KHÔNG in tổng)
  #   workflows → cộng ĐÚNG 6 dòng `Results:` (6 tệp con; thiếu dòng là ĐỎ vì
  #               thiếu, không âm thầm cộng ra tổng nhỏ hơn)
  #   scripts/hooks → dòng `Results:` CUỐI (fixture in dòng Results ở giữa)
  dem_suite() {   # $1 = tên suite, $2 = file log
    case "$1" in
      plugins)   grep -cE '^  PASS: ' "$2" ;;
      workflows) awk '/^Results: [0-9]+ passed/{n++; s+=$2} END{if(n!=6) print "DONG-THIEU:" n; else print s+0}' "$2" ;;
      *)         grep -E '^Results: [0-9]+ passed' "$2" | tail -1 | awk '{print $2+0}' ;;
    esac
  }
  lenh_suite() {
    case "$1" in
      plugins)   echo "bash tests/plugins/run-tests.sh" ;;
      workflows) echo "bash tests/workflows/run-tests.sh" ;;
      scripts)   echo "bash tests/scripts/run-tests.sh" ;;
      hooks)     echo "bash tests/hooks/run-tests.sh" ;;
    esac
  }
  dlog="$(tmpd)"
  while read -r suite mong; do
    [ -n "${suite:-}" ] || continue
    ( cd "$ROOT" && $(lenh_suite "$suite") ) > "$dlog/$suite.log" 2>&1
    rc=$?
    thay="$(dem_suite "$suite" "$dlog/$suite.log")"
    case "$thay" in
      DONG-THIEU:*) bad "so-ca $suite: thieu dong tong ket (${thay#DONG-THIEU:}/6) — DO vi THIEU, khong cong ra tong nho hon"; continue ;;
    esac
    if [ "$rc" -ne 0 ]; then
      bad "so-ca $suite: suite DO (exit $rc) — day la kieu hong KHAC voi lech so ca, doc rieng"
    elif [ "$thay" = "$mong" ]; then
      ok "so-ca $suite: $thay = $mong (dang thuc, doc tu SO-CA-KY-VONG-1C)"
    else
      bad "so-ca $suite: so ca lech ky vong: $mong -> $thay"
    fi
  done < <(khoi SO-CA-KY-VONG-1C | sed '/^[[:space:]]*$/d' | awk 'NF==2')
  # chiều đỏ cho chân đẳng thức: log bản sao bị tiêm thêm một dòng ca → phép
  # đếm THẬT (dem_suite) phải ra số khác
  if [ -f "$dlog/plugins.log" ]; then
    truoc="$(dem_suite plugins "$dlog/plugins.log")"
    cp "$dlog/plugins.log" "$dlog/plugins-mut.log"
    printf '  PASS: ca tiem\n' >> "$dlog/plugins-mut.log"
    sau="$(dem_suite plugins "$dlog/plugins-mut.log")"
    if [ "$sau" -ne "$truoc" ]; then
      mut "so-ca log tiem them 1 ca: $truoc -> $sau → phep dem THAT bat duoc lech"
    else
      bad "so-ca CHIEU DO KHONG CHAY: them ca vao log ma phep dem khong doi"
    fi
  fi

  ADG="tests/plugins/asserts-da-go.txt"
  # (b) ĐẲNG THỨC 0 dòng mới so với BASE-1C (bản khai [SỬA SAU CỔNG 1 — 14/08])
  base_dong=$(g show "$BASE:$ADG" 2>/dev/null | wc -l | tr -d ' ')
  head_dong=$(wc -l < "$ROOT/$ADG" | tr -d ' ')
  if [ "$base_dong" -eq 0 ]; then
    bad "assert-da-go: doc tren moc cho 0 dong — doi chung hong, khong phai vat hong"
  elif [ "$head_dong" -eq "$base_dong" ]; then
    ok "assert-da-go DANG THUC: $head_dong = $base_dong dong (0 dong moi, dung ban khai)"
  else
    bad "assert-da-go LECH: base $base_dong -> head $head_dong; thua mot dong la che mot assert con song"
  fi
  if grep -qF "044968e" "$ROOT/$ADG" && grep -qiE "P161.*(KHONG|KHÔNG)" "$ROOT/$ADG"; then
    ok "assert-da-go CO loi khai gioi han banh coc P161 sau moc 044968e"
  else
    bad "assert-da-go THIEU loi khai gioi han banh coc P161 — hop dong 1a tung tuyen nguoc (H8)"
  fi
  # (c) CHIỀU ĐỎ cho chân đẳng thức: bản sao thêm một dòng → phải lệch
  d="$(tmpd)"; cp "$ROOT/$ADG" "$d/adg.txt"; printf '# dong tiem\n' >> "$d/adg.txt"
  if [ "$(wc -l < "$d/adg.txt" | tr -d ' ')" -ne "$base_dong" ]; then
    mut "so-ca ban tiem lech khoi moc → phep so DANG THUC bat duoc dong them"
  else
    bad "so-ca CHIEU DO KHONG CHAY: them dong vao ban sao ma phep dem khong doi"
  fi
fi

echo
if [ "$fails" -eq 0 ]; then
  echo "RANG-1C: XANH — moi chan co doi chung duong tren $BASE va chieu do chay that"
  exit 0
fi
echo "RANG-1C: $fails chan DO"
exit 1
