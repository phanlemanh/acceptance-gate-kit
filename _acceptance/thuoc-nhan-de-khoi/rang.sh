#!/usr/bin/env bash
# Răng hồ sơ thuoc-nhan-de-khoi — 8 chân, mỗi chân một AC.
# CỐ Ý không vào suite vĩnh viễn: chân ba-ca-that neo mốc BẤT BIẾN BASE-TNK
# (bản trước-sửa), để trong bộ kiểm thường trực thì mọi PR tương lai vẫn phải
# giữ mốc đó sống. Lưới vĩnh viễn là tests/scripts/label-occlusion.test.mjs.
# Mọi fixture do code sinh TRONG lần chạy; mọi chiều đỏ chạy qua CHÍNH hàm
# kiểm của chân đó cùng lượt; ROOT suy từ vị trí script, không hardcode.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
CHECK="$ROOT/diagram-design/skills/diagram-design/scripts/check_label_occlusion.py"
SKILL="$ROOT/diagram-design/skills/diagram-design"
FIGDIR="$ROOT/docs/reference/figures"
BASE_TNK="848adc9233b54a5755c4be2f49af8a01902f75f0"
PASS=0; FAIL=0
ok()   { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad()  { echo "  FAIL: $1"; FAIL=$((FAIL+1)); }
has()  { case "$2" in *"$1"*) return 0;; *) return 1;; esac; }
run()  { python3 "$CHECK" "$@" 2>&1; }

# ---- hàm kiểm dùng chung (chiều đỏ gọi CHÍNH nó, không chép công thức) ----
# kiem_do <out> <rc> <chuỗi phải có>  -> 0 nếu đúng là ĐỎ và nêu đúng chuỗi
kiem_do() { [ "$2" -eq 1 ] && has "$3" "$1"; }
# kiem_xanh <rc>
kiem_xanh() { [ "$1" -eq 0 ]; }

T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT

mk_lanh() { # <path> <text nhãn>  — fixture SVG code-sinh, nhãn + khối rời nhau
  cat > "$1" <<EOF
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="20" width="60" height="14" rx="2" fill="#f5f5f5"/>
  <text x="70" y="30" font-size="8">$2</text>
  <rect x="200" y="100" width="120" height="60" fill="#ffffff" stroke="#333"/>
</svg>
EOF
}

chan_hai_chieu() {
  mk_lanh "$T/l.svg" "NHAN THU"
  OUT="$(run "$T/l.svg")"; RC=$?
  kiem_xanh $RC && ok "lanh -> exit 0" || bad "lanh -> exit 0 (rc=$RC)"

  sed 's|</svg>|  <rect x="30" y="10" width="120" height="60" fill="#ffffff"/>\n</svg>|' "$T/l.svg" > "$T/t.svg"
  if cmp -s "$T/l.svg" "$T/t.svg"; then bad "tiem khong doi noi dung"; return; fi
  OUT="$(run "$T/t.svg")"; RC=$?
  kiem_do "$OUT" $RC 'nhan "NHAN THU"' && ok "tiem -> exit 1 + neu ten nhan" \
    || bad "tiem -> exit 1 + neu ten nhan (rc=$RC)"

  # chân WARN: nhãn bị che NHƯNG nằm trong cây scale -> bỏ qua CÓ TIẾNG
  cat > "$T/s.svg" <<'EOF'
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="scale(2)">
    <rect x="40" y="20" width="60" height="14" fill="#f5f5f5"/>
    <text x="70" y="30">TRONG SCALE</text>
    <rect x="30" y="10" width="120" height="60" fill="#ffffff"/>
  </g>
</svg>
EOF
  OUT="$(run "$T/s.svg")"; RC=$?
  if kiem_xanh $RC && has "WARN" "$OUT" && has "s.svg" "$OUT"; then
    ok "scale -> warn co tieng"
  else bad "scale -> warn co tieng (rc=$RC out=$OUT)"; fi
  # chiều đỏ của chính chân WARN: output giả thiếu WARN phải bị bắt
  if has "WARN" "OCCLUDED gia khong co canh bao"; then
    bad "ham kiem WARN khong phan biet duoc"
  else ok "chieu do chan WARN: thieu WARN -> bat duoc"; fi
}

chan_ba_ca_that() {
  git -C "$ROOT" show "$BASE_TNK:docs/reference/figures/kien-truc-ho-so-la-truc.svg" > "$T/a.svg" 2>/dev/null
  git -C "$ROOT" show "$BASE_TNK:docs/reference/figures/trang-thai-ho-so.svg" > "$T/b.svg" 2>/dev/null
  if [ ! -s "$T/a.svg" ] || [ ! -s "$T/b.svg" ]; then
    bad "khong rut duoc file tu moc BASE-TNK"; return; fi
  OUT="$(run "$T/a.svg" "$T/b.svg")"; RC=$?
  [ "$RC" -eq 1 ] || bad "base phai exit 1, duoc $RC"
  for n in "GHI STATUS" "HÌNH ĐÍNH THẺ" "S5 GIAO"; do
    has "nhan \"$n\"" "$OUT" && ok "base neu nhan $n" || bad "base THIEU nhan $n"
  done
  # đối chứng dương cùng lượt: bản đã sửa ở cây hiện tại phải XANH
  OUT2="$(run "$FIGDIR/kien-truc-ho-so-la-truc.svg" "$FIGDIR/trang-thai-ho-so.svg")"; RC2=$?
  kiem_xanh $RC2 && ok "doi chung: ban da sua -> exit 0" \
    || bad "doi chung: ban da sua -> exit 0 (rc=$RC2 out=$OUT2)"
}

chan_nhan_con_song() {
  OUT="$(run "$FIGDIR"/*.svg "$FIGDIR"/*.html)"; RC=$?
  kiem_xanh $RC && ok "figures sach" || bad "figures sach (rc=$RC out=$OUT)"
  # (a) chuỗi nhãn còn trong ĐÚNG file nguồn — chặn sửa-bằng-xoá
  for pair in "GHI STATUS|kien-truc-ho-so-la-truc" "HÌNH ĐÍNH THẺ|kien-truc-ho-so-la-truc" "S5 GIAO|trang-thai-ho-so"; do
    n="${pair%%|*}"; f="${pair##*|}"
    for ext in html svg; do
      grep -q -- "$n" "$FIGDIR/$f.$ext" && ok "($ext) $n con trong $f" \
        || bad "$n mat khoi $f.$ext"
    done
  done
  # (b) 3 nhãn còn TRONG TẦM thước — chặn sửa-bằng-xoá-mask.
  # Đo QUAN HỆ «nhãn nằm trên một dòng LABEL», không phải hai phép có-mặt rời
  # nhau (S4-r1 finding: `has LABEL` ∧ `has "<n>"` xanh cả khi tên nhãn chỉ
  # xuất hiện trong một dòng OCCLUDED và không dòng LABEL nào chứa nó).
  L="$(run --list "$FIGDIR/kien-truc-ho-so-la-truc.svg" "$FIGDIR/trang-thai-ho-so.svg")"
  co_dong_label() { printf '%s\n' "$2" | grep -q "^LABEL .*\"$1\"$"; }
  for n in "GHI STATUS" "HÌNH ĐÍNH THẺ" "S5 GIAO"; do
    co_dong_label "$n" "$L" && ok "thuoc van thay $n" || bad "$n ngoai tam thuoc"
  done
  # chiều đỏ của chính phép (b): output chỉ có dòng OCCLUDED mang tên nhãn,
  # không có dòng LABEL nào — phép đo QUAN HỆ phải bắt được, phép có-mặt thì không
  GIA='OCCLUDED x.svg nhan "GHI STATUS" khoi [0,0,9,9] chong 1.0x1.0px'
  co_dong_label "GHI STATUS" "$GIA" \
    && bad "chieu do (b2): dong OCCLUDED bi doc nham thanh LABEL" \
    || ok "chieu do (b2): chi co OCCLUDED -> khong tinh la thay nhan"
  # chiều đỏ (b): bản sao xoá MASK (giữ text) -> nhãn biến khỏi --list
  sed 's|<rect x="300" y="246" width="60" height="14" rx="2" fill="#f5f5f5"/>||' \
    "$FIGDIR/kien-truc-ho-so-la-truc.svg" > "$T/nomask.svg"
  if cmp -s "$FIGDIR/kien-truc-ho-so-la-truc.svg" "$T/nomask.svg"; then
    bad "tiem xoa mask khong doi noi dung"; return; fi
  L2="$(run --list "$T/nomask.svg")"
  has '"GHI STATUS"' "$L2" && bad "chieu do (b): xoa mask van thay nhan" \
    || ok "chieu do (b): xoa mask -> nhan ngoai tam thuoc"
}

chan_fill_trong_suot() {
  cat > "$T/f.svg" <<'EOF'
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="20" width="60" height="14" fill="#f5f5f5"/>
  <text x="70" y="30">FILL THU</text>
  <rect x="30" y="10" width="120" height="60" fill="none" stroke="#333"/>
  <rect x="30" y="10" width="120" height="60" fill="#ffffff" fill-opacity="0.3"/>
</svg>
EOF
  OUT="$(run "$T/f.svg")"; RC=$?
  kiem_xanh $RC && ok "trong suot khong bao oan" || bad "trong suot khong bao oan (rc=$RC out=$OUT)"
  sed 's|</svg>|  <rect x="30" y="10" width="120" height="60" fill="#ffffff"/>\n</svg>|' "$T/f.svg" > "$T/f2.svg"
  if cmp -s "$T/f.svg" "$T/f2.svg"; then bad "tiem duc khong doi noi dung"; return; fi
  OUT="$(run "$T/f2.svg")"; RC=$?
  kiem_do "$OUT" $RC 'nhan "FILL THU"' && ok "duc -> do" || bad "duc -> do (rc=$RC)"
}

chan_html_inline() {
  cat > "$T/h.html" <<'EOF'
<!doctype html><html><body>
<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="60" height="14" fill="#f5f5f5"/>
  <text x="40" y="20">KHOI MOT</text>
</svg>
<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="60" height="14" fill="#f5f5f5"/>
  <text x="40" y="20">KHOI HAI</text>
</svg>
</body></html>
EOF
  OUT="$(run "$T/h.html")"; RC=$?
  kiem_xanh $RC && ok "html lanh -> exit 0" || bad "html lanh -> exit 0 (rc=$RC out=$OUT)"
  # tiêm CHỈ vào khối 2 (dòng cuối trước </body>)
  awk '{ if ($0 ~ /KHOI HAI/) { print; print "  <rect x=\"5\" y=\"5\" width=\"120\" height=\"60\" fill=\"#ffffff\"/>" } else print }' \
    "$T/h.html" > "$T/h2.html"
  if cmp -s "$T/h.html" "$T/h2.html"; then bad "tiem html khong doi noi dung"; return; fi
  OUT="$(run "$T/h2.html")"; RC=$?
  if kiem_do "$OUT" $RC 'nhan "KHOI HAI"' && ! has 'nhan "KHOI MOT"' "$OUT"; then
    ok "html tiem -> do dung nhan"
  else bad "html tiem -> do dung nhan (rc=$RC out=$OUT)"; fi
}

chan_suite_case() {
  CASE="$ROOT/tests/scripts/label-occlusion.test.mjs"
  [ -f "$CASE" ] || { bad "thieu case label-occlusion.test.mjs"; return; }
  grep -q '/Users/' "$CASE" && bad "hardcode ROOT trong case" || ok "case khong hardcode ROOT"
  # Chạy TRỌN SUITE, không gọi thẳng file case (S4-r1 finding: gọi thẳng là đo
  # VẬT THAY THẾ — không chứng minh được run-tests.sh thật sự dispatch case này,
  # đúng nếp p194 mà expected của E7 viện dẫn). Ghim cả dòng tiêu đề file.
  OUT="$(cd "$ROOT" && bash tests/scripts/run-tests.sh 2>&1)"; RC=$?
  [ "$RC" -eq 0 ] || bad "suite scripts exit $RC"
  has "=== label-occlusion.test.mjs ===" "$OUT" \
    && ok "suite THAT SU dispatch label-occlusion.test.mjs" \
    || bad "suite khong dispatch label-occlusion.test.mjs"
  for d in "PASS: figures hien tai sach" "PASS: tong nhan phat hien >=" "PASS: mutant code-sinh -> do dung thong diep"; do
    has "$d" "$OUT" && ok "suite ghim [$d]" || bad "suite THIEU dong [$d]"
  done
  # chiều đỏ của chính chân: stdout giả thiếu dòng phải bị bắt
  has "PASS: figures hien tai sach" "chi co dong khac" \
    && bad "ham kiem dong khong phan biet duoc" || ok "chieu do: stdout thieu dong -> bat duoc"
}

chan_taste_gate() {
  [ -f "$SKILL/scripts/check_label_occlusion.py" ] && ok "script ton tai canh check_overflow" \
    || bad "thieu scripts/check_label_occlusion.py"
  [ -f "$SKILL/scripts/check_overflow.py" ] || bad "check_overflow.py bien mat (sai duong dan?)"
  # rút ĐÚNG section §9 — đo quan hệ nằm-trong-§9, không grep toàn file
  S9="$(awk '/^## 9\./{f=1} /^## 1[0-9]\./{f=0} f' "$SKILL/SKILL.md")"
  [ -n "$S9" ] || { bad "khong rut duoc section 9"; return; }
  has "check_label_occlusion.py" "$S9" && ok "muc nam trong §9" || bad "muc khong nam trong §9"
  # chiều đỏ: bản sao xoá dòng khỏi §9 (chuỗi vẫn còn ở §12) -> phải đỏ
  awk '/^## 9\./{f=1} /^## 1[0-9]\./{f=0} { if (f && /check_label_occlusion.py/) next; print }' \
    "$SKILL/SKILL.md" > "$T/skill-mut.md"
  echo "## 12. ghi chu check_label_occlusion.py o ngoai §9" >> "$T/skill-mut.md"
  if cmp -s "$SKILL/SKILL.md" "$T/skill-mut.md"; then bad "tiem SKILL.md khong doi noi dung"; return; fi
  S9M="$(awk '/^## 9\./{f=1} /^## 1[0-9]\./{f=0} f' "$T/skill-mut.md")"
  has "check_label_occlusion.py" "$S9M" \
    && bad "chieu do: muc ngoai §9 van duoc tinh" || ok "chieu do: muc ngoai §9 -> bat duoc"
  grep -q "check_label_occlusion" "$SKILL/LOCAL-PATCHES.md" \
    && ok "LOCAL-PATCHES co entry" || bad "LOCAL-PATCHES thieu entry"
}

chan_quet_vung_ngoai() {
  EV="$HERE/evidence/quet-vung-ngoai.md"
  [ -f "$EV" ] || { bad "thieu evidence/quet-vung-ngoai.md"; return; }
  # CHẠY LẠI thước ngay lúc verify — số trong báo cáo phải tái lập được
  cd "$ROOT" || return
  LIVE="$(python3 "$CHECK" _acceptance/*/figures/*.svg _acceptance/*/figures/*.html \
          diagram-design/skills/diagram-design/assets/example-*.html 2>&1)"
  LN=$(ls _acceptance/*/figures/*.svg _acceptance/*/figures/*.html \
       diagram-design/skills/diagram-design/assets/example-*.html 2>/dev/null | wc -l | tr -d ' ')
  LO=$(printf '%s\n' "$LIVE" | grep -c '^OCCLUDED')
  RN=$(sed -n 's/^tong_file_san: *\([0-9][0-9]*\).*/\1/p' "$EV" | head -1)
  RO=$(sed -n 's/^tong_occluded: *//p' "$EV" | head -1)
  # tong_file là SÀN, không phải hằng: hồ sơ KHÁC thêm/bớt hình tầng-2 là hợp lệ
  # và không được làm răng này đỏ vì hạ tầng (nếp «hằng đếm theo mốc» đã ghi sổ).
  # Số CA và DANH SÁCH vẫn giữ đẳng thức — đó mới là lời khai phải tái lập được.
  [ "$LN" -ge "$RN" ] && ok "so file >= san bao cao ($LN >= $RN)" \
    || bad "bao cao lech lan chay: file thuc $LN < san khai $RN"
  [ "$LO" = "$RO" ] && ok "so ca khop lan chay ($LO)" || bad "bao cao lech lan chay: ca $RO vs $LO"
  MISS=0
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    grep -qF -- "$line" "$EV" || { echo "    thieu trong bao cao: $line"; MISS=1; }
  done <<EOF
$(printf '%s\n' "$LIVE" | grep '^OCCLUDED')
EOF
  [ "$MISS" -eq 0 ] && ok "danh sach ca khop lan chay" || bad "bao cao lech lan chay: danh sach"
  # lời hứa report-only: diff so FORK-POINT của nhánh, KHÔNG so BASE-TNK.
  # Pathspec dùng :(glob) + ** — S4-r1 đo thật: '_acceptance/*/figures' KHÔNG
  # khớp gì kể cả khi có file thật bị chạm (git dùng WM_PATHNAME nên `*` không
  # vượt `/`), tức vế này ĐANG luôn rỗng ⇒ luôn xanh: assertion âm-tính-một-mình.
  MB="$(git -C "$ROOT" merge-base HEAD origin/main 2>/dev/null)"
  if [ -z "$MB" ]; then bad "khong xac dinh duoc merge-base voi origin/main"; return; fi
  cham_vung_ngoai() { # <ref> -> in danh sách file vùng ngoài bị chạm
    git -C "$ROOT" diff --name-only "$1" \
      -- ':(glob)_acceptance/*/figures/**' \
         ':(glob)diagram-design/skills/diagram-design/assets/**' \
      | grep -v '^_acceptance/thuoc-nhan-de-khoi/'
  }
  CHAM="$(cham_vung_ngoai "$MB")"
  [ -z "$CHAM" ] && ok "report-only: khong cham vung ngoai" \
    || { bad "cham vung ngoai:"; printf '    %s\n' $CHAM; }
  # CHIỀU ĐỎ cùng lượt: dựng một file trong vùng ngoài rồi gọi CHÍNH hàm trên —
  # không bắt được nghĩa pathspec lại chết, và cái xanh ở trên là xanh giả.
  # Probe vào thư mục RIÊNG dùng-một-lần, KHÔNG mượn thư mục của hồ sơ khác
  # (lượt S4-r1 tôi mượn rồi rmdir và xoá mất 2 file thật của cong-chan-nham-cho).
  PROBE="$ROOT/_acceptance/rang-probe-tnk/figures"
  mkdir -p "$PROBE" && : > "$PROBE/.rang-probe.svg"
  git -C "$ROOT" add -N "$PROBE/.rang-probe.svg" >/dev/null 2>&1
  BAT="$(cham_vung_ngoai "$MB")"
  git -C "$ROOT" rm -q --cached "$PROBE/.rang-probe.svg" >/dev/null 2>&1
  rm -rf "$ROOT/_acceptance/rang-probe-tnk"
  case "$BAT" in
    *.rang-probe.svg*) ok "chieu do: guard BAT duoc file vung ngoai";;
    *) bad "chieu do: guard KHONG bat duoc file vung ngoai (pathspec chet)";;
  esac
}

case "${2:-}" in
  hai-chieu)        chan_hai_chieu;;
  ba-ca-that)       chan_ba_ca_that;;
  nhan-con-song)    chan_nhan_con_song;;
  fill-trong-suot)  chan_fill_trong_suot;;
  html-inline)      chan_html_inline;;
  suite-case)       chan_suite_case;;
  taste-gate)       chan_taste_gate;;
  quet-vung-ngoai)  chan_quet_vung_ngoai;;
  *) echo "Usage: rang.sh --chan <hai-chieu|ba-ca-that|nhan-con-song|fill-trong-suot|html-inline|suite-case|taste-gate|quet-vung-ngoai>"; exit 2;;
esac

echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] || exit 1
