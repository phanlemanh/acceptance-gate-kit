#!/usr/bin/env bash
# Răng của hồ sơ khong-ve-the-ma — chốt «không có hồ sơ thì không vẽ thẻ».
#
# Nếp bắt buộc (CLAUDE.md):
#  · Mọi fixture do CODE SINH trong chính lần chạy — không có file dựng sẵn.
#  · Mọi đường dẫn SUY từ vị trí script này, không hardcode ROOT.
#  · Mọi assertion âm tính có ĐỐI CHỨNG DƯƠNG chạy trước trong cùng lượt, và
#    ghim ĐÚNG THÔNG ĐIỆP — không bao giờ chỉ tin mã thoát.
#  · Chuỗi thông điệp RÚT từ marker trong scripts/gate-card.js, không gõ literal:
#    đổi chữ ở bên viết mà phép đo vẫn xanh là thước đã chết.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
GC="$ROOT/scripts/gate-card.js"
CMDFILE="$ROOT/commands/acceptance-card.md"

PASS=0; FAIL=0
ok()   { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad()  { echo "  FAIL: $1 — $2"; FAIL=$((FAIL+1)); }
have() { case "$2" in *"$1"*) return 0;; *) return 1;; esac; }

# ---- hằng RÚT TỪ NGUỒN gate-card.js (không gõ literal) ----------------------
pick() { # <tên hằng> <file nguồn>
  sed -n "s/^const $1[[:space:]]*=[[:space:]]*'\(.*\)';.*/\1/p" "$2" | head -1
}
MSG_WS="$(pick MSG_NO_WORKSPACE "$GC")"
MSG_DIR="$(pick MSG_NO_DOSSIER "$GC")"
MSG_CT="$(pick MSG_NO_CONTRACT "$GC")"
for pair in "MSG_NO_WORKSPACE:$MSG_WS" "MSG_NO_DOSSIER:$MSG_DIR" "MSG_NO_CONTRACT:$MSG_CT"; do
  if [ -z "${pair#*:}" ]; then
    echo "HA TANG: scripts/gate-card.js khong khai hang ${pair%%:*} — phep do khong co gi de ghim"; exit 3
  fi
done

# ---- fixture code-sinh ------------------------------------------------------
mk_xuong() { mkdir -p "$1/_acceptance"; printf 'schema_version: 1\nenforcement: strict\n' > "$1/_acceptance/config.yaml"; }
mk_ho_so() { # <root> <slug>
  mkdir -p "$1/_acceptance/$2"
  cat > "$1/_acceptance/$2/contract.md" <<EOF
---
schema_version: 1
feature: Fixture $2
slug: $2
risk_tier: T2
status: draft
---
## Criteria
- AC-1: Given khách đủ điều kiện, When chạm ngưỡng, Then sinh cảnh báo.
- AC-2: Given khách dưới ngưỡng, When chạm, Then KHÔNG sinh cảnh báo.
## Out of scope
- Phát sóng thời gian thực — hoãn.
EOF
}
NEW_T() { mktemp -d "${TMPDIR:-/tmp}/kvtm.XXXXXX"; }

# chạy gate-card, trả về "<exit>|<stdout byte>|<stderr>"
run_gc() { # <script> <root> <slug> [cờ...]
  local s="$1" r="$2" g="$3"; shift 3
  local out err rc
  local ef; ef="$(mktemp "${TMPDIR:-/tmp}/kvtm-err.XXXXXX")"
  out="$(node "$s" --root "$r" --slug "$g" "$@" 2>"$ef")"; rc=$?
  err="$(cat "$ef")"; rm -f "$ef"
  printf '%s|%s|%s' "$rc" "${#out}" "$err"
}

CHAN="${2:-}"; [ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan <ten>"; exit 2; }
echo "=== rang khong-ve-the-ma · chan: $CHAN ==="

case "$CHAN" in

# ---------------------------------------------------------------- vang-thu-muc
vang-thu-muc)
  T="$(NEW_T)"; mk_xuong "$T"; mk_ho_so "$T" ho-so-that
  # ĐỐI CHỨNG DƯƠNG TRƯỚC: bản nguyên vẹn phải XANH trên hồ sơ có thật.
  r="$(run_gc "$GC" "$T" ho-so-that)"; rc="${r%%|*}"; rest="${r#*|}"; len="${rest%%|*}"
  if [ "$rc" = "0" ] && [ "$len" -gt 500 ]; then ok "doi-chung-duong (ho so that: exit 0, $len byte the)"
  else bad "doi-chung-duong" "ho so CO THAT ma khong ve duoc the (exit=$rc, $len byte) — fixture hong, moi ket luan do phia duoi vo nghia"; fi
  # CHIỀU ĐỎ: hồ sơ vắng.
  r="$(run_gc "$GC" "$T" ho-so-ma)"; rc="${r%%|*}"; rest="${r#*|}"; len="${rest%%|*}"; err="${rest#*|}"
  [ "$rc" != "0" ] && ok "AC-1 ma thoat khac 0 (=$rc)" || bad "AC-1 ma thoat" "exit 0 cho slug khong ton tai"
  [ "$len" = "0" ]  && ok "AC-1 stdout RONG (0 byte the)" || bad "AC-1 stdout" "in $len byte the cho ho so khong ton tai"
  have "$MSG_DIR" "$err" && ok "AC-1 ghim thong diep «$MSG_DIR»" || bad "AC-1 thong diep" "stderr khong chua «$MSG_DIR»: $err"
  ;;

# ------------------------------------------------------------ liet-ho-so-that
liet-ho-so-that)
  T="$(NEW_T)"; mk_xuong "$T"; mk_ho_so "$T" alpha-that; mk_ho_so "$T" beta-that
  r="$(run_gc "$GC" "$T" ho-so-ma)"; err="${r#*|}"; err="${err#*|}"
  have "ho-so-ma" "$err"   && ok "AC-2 neu dung ten vua go"      || bad "AC-2 ten go" "stderr khong nhac «ho-so-ma»: $err"
  have "alpha-that" "$err" && ok "AC-2 liet ho so that alpha"    || bad "AC-2 liet alpha" "stderr khong liet «alpha-that»: $err"
  have "beta-that"  "$err" && ok "AC-2 liet ho so that beta"     || bad "AC-2 liet beta"  "stderr khong liet «beta-that»: $err"
  # CHIỀU ĐỎ của chính danh sách: dựng lại xưởng CHỈ còn alpha → beta phải BIẾN MẤT.
  T2="$(NEW_T)"; mk_xuong "$T2"; mk_ho_so "$T2" alpha-that
  r2="$(run_gc "$GC" "$T2" ho-so-ma)"; err2="${r2#*|}"; err2="${err2#*|}"
  if have "beta-that" "$err2"; then bad "AC-2 danh sach that" "«beta-that» van hien du xuong khong co no — danh sach la chuoi cung, khong doc he thong tep"
  else ok "AC-2 danh sach doc tu he thong tep that (beta bien mat khi xuong khong co)"; fi
  have "alpha-that" "$err2" && ok "AC-2 alpha van con trong xuong rut gon" || bad "AC-2 alpha rut gon" "mat luon alpha: $err2"
  ;;

# ------------------------------------------------------------- thieu-hop-dong
thieu-hop-dong)
  # MA TRAN TOAN PHAN: 3 fixture x 2 luot goi = 6 o, viet truoc, so assert = so phan tu.
  # O «chi evidence-report.md» la o quan trong nhat: no di duong DOAN CONG khac han,
  # nen chot dat SAU buoc doan cong se lam dung o nay ve tron the Cong 2.
  T="$(NEW_T)"; mk_xuong "$T"
  mkdir -p "$T/_acceptance/o-rong"
  mkdir -p "$T/_acceptance/o-bang-chung"; printf -- '---\nslug: o-bang-chung\nverdict: PASS\n---\n# bc\n' > "$T/_acceptance/o-bang-chung/evidence-report.md"
  mkdir -p "$T/_acceptance/o-evals"; printf 'schema_version: 1\nevals: []\n' > "$T/_acceptance/o-evals/evals.yaml"
  O=0
  for fx in o-rong o-bang-chung o-evals; do
    for mode in doan-cong gate2; do
      O=$((O+1))
      if [ "$mode" = "gate2" ]; then r="$(run_gc "$GC" "$T" "$fx" --gate 2)"; else r="$(run_gc "$GC" "$T" "$fx")"; fi
      rc="${r%%|*}"; rr="${r#*|}"; len="${rr%%|*}"; err="${rr#*|}"
      lab="[$fx/$mode]"
      [ "$rc" != "0" ] && ok "AC-3 $lab ma thoat khac 0 (=$rc)" || bad "AC-3 $lab ma thoat" "exit 0 — ve the cho ho so khong co hop dong"
      [ "$len" = "0" ]  && ok "AC-3 $lab stdout RONG"            || bad "AC-3 $lab stdout" "in $len byte"
      have "$MSG_CT" "$err" && ok "AC-3 $lab ghim «$MSG_CT»"     || bad "AC-3 $lab thong diep" "stderr: $err"
      if have "$MSG_DIR" "$err"; then bad "AC-3 $lab phan biet" "lan thong diep ca vang-thu-muc"; else ok "AC-3 $lab phan biet duoc voi ca vang-thu-muc"; fi
    done
  done
  [ "$O" = "6" ] && ok "AC-3 ma tran du 6 o (so assert = so phan tu)" || bad "AC-3 ma tran" "chay $O o, khai 6"
  # DOI CHUNG DUONG 1: them contract.md vao chinh thu muc rong -> XANH.
  mk_ho_so "$T" o-rong
  r="$(run_gc "$GC" "$T" o-rong)"; rc="${r%%|*}"; rr="${r#*|}"; len="${rr%%|*}"
  { [ "$rc" = "0" ] && [ "$len" -gt 500 ]; } && ok "AC-3 doi-chung-duong (them contract.md -> exit 0, $len byte)" \
    || bad "AC-3 doi-chung-duong" "them contract.md ma van khong ve duoc (exit=$rc, $len byte)"
  # DOI CHUNG DUONG 2: hop dong + bang chung -> the Cong 2 van ve duoc.
  mk_ho_so "$T" o-bang-chung
  r="$(run_gc "$GC" "$T" o-bang-chung)"; rc="${r%%|*}"; rr="${r#*|}"; len="${rr%%|*}"
  { [ "$rc" = "0" ] && [ "$len" -gt 500 ]; } && ok "AC-3 doi-chung-duong Cong 2 (hop dong + bang chung -> exit 0, $len byte)" \
    || bad "AC-3 doi-chung-duong Cong 2" "chot da giet duong Cong 2 hop le (exit=$rc, $len byte)"
  ;;

# ------------------------------------------------------------- chua-mo-xuong
chua-mo-xuong)
  T="$(NEW_T)"   # KHONG mk_xuong: goc tran, chua co _acceptance/config.yaml
  r="$(run_gc "$GC" "$T" bat-ky)"; rc="${r%%|*}"; rest="${r#*|}"; len="${rest%%|*}"; err="${rest#*|}"
  [ "$rc" != "0" ] && ok "AC-4 ma thoat khac 0 (=$rc)" || bad "AC-4 ma thoat" "exit 0 khi xuong chua mo"
  [ "$len" = "0" ]  && ok "AC-4 stdout RONG"            || bad "AC-4 stdout" "in $len byte the"
  have "$MSG_WS" "$err" && ok "AC-4 ghim thong diep «$MSG_WS»" || bad "AC-4 thong diep" "stderr khong chua «$MSG_WS»: $err"
  if have "$MSG_DIR" "$err" || have "$MSG_CT" "$err"; then bad "AC-4 phan biet" "lan thong diep cua ca khac"
  else ok "AC-4 phan biet duoc voi AC-1 va AC-3"; fi
  # DOI CHUNG DUONG: mo xuong -> nhanh doi sang ca vang-thu-muc.
  mk_xuong "$T"
  r="$(run_gc "$GC" "$T" bat-ky)"; err="${r#*|}"; err="${err#*|}"
  have "$MSG_DIR" "$err" && ok "AC-4 doi-chung-duong (mo xuong -> doi sang thong diep vang-thu-muc)" \
    || bad "AC-4 doi-chung-duong" "mo xuong roi ma thong diep khong doi: $err"
  ;;

# -------------------------------------------------------------------- extract
extract)
  T="$(NEW_T)"; mk_xuong "$T"; mk_ho_so "$T" ho-so-that; mkdir -p "$T/_acceptance/ho-so-rong"
  T0="$(NEW_T)"
  for ca in "ho-so-ma:$T:$MSG_DIR" "ho-so-rong:$T:$MSG_CT" "bat-ky:$T0:$MSG_WS"; do
    g="${ca%%:*}"; rest="${ca#*:}"; r0="${rest%%:*}"; needle="${rest#*:}"
    r="$(run_gc "$GC" "$r0" "$g" --extract)"; rc="${r%%|*}"; rr="${r#*|}"; len="${rr%%|*}"; err="${rr#*|}"
    [ "$rc" != "0" ] && ok "AC-5 [$g] --extract thoat khac 0 (=$rc)" || bad "AC-5 [$g] ma thoat" "--extract exit 0"
    [ "$len" = "0" ]  && ok "AC-5 [$g] --extract stdout RONG"        || bad "AC-5 [$g] stdout" "in $len byte JSON"
    have "$needle" "$err" && ok "AC-5 [$g] ghim «$needle»"           || bad "AC-5 [$g] thong diep" "stderr: $err"
  done
  # DOI CHUNG DUONG: --extract tren ho so DU van in JSON parse duoc.
  out="$(node "$GC" --root "$T" --slug ho-so-that --extract 2>/dev/null)"; rc=$?
  if [ "$rc" = "0" ] && printf '%s' "$out" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);if(!("gate" in j))process.exit(1)})' 2>/dev/null; then
    ok "AC-5 doi-chung-duong (--extract ho so du: JSON hop le co khoa gate)"
  else bad "AC-5 doi-chung-duong" "chot da giet duong --extract hop le (exit=$rc)"; fi
  ;;

# ---------------------------------------------------------- doi-chung-duong
doi-chung-duong)
  T="$(NEW_T)"; mk_xuong "$T"; mk_ho_so "$T" ho-so-that
  out="$(node "$GC" --root "$T" --slug ho-so-that 2>/dev/null)"; rc=$?
  [ "$rc" = "0" ] && ok "AC-6 ho so du: ma thoat 0" || bad "AC-6 ma thoat" "exit=$rc tren ho so du"
  have "Hệ thống SẼ làm" "$out" && ok "AC-6 the con khoi «Hệ thống SẼ làm»"  || bad "AC-6 khoi se-lam" "the thieu khoi cam ket"
  have "Sẽ KHÔNG làm"    "$out" && ok "AC-6 the con khoi «Sẽ KHÔNG làm»"     || bad "AC-6 khoi khong-lam" "the thieu khoi khong-lam"
  # RANG CUA CHINH PHEP DO: ban sao TRON THU MUC scripts+lib, go khoi chot,
  # thi ca AC-1 phai XANH lai. Khong phan biet duoc thi phep do o tren vo nghia.
  M="$(NEW_T)"; cp -R "$ROOT/scripts" "$M/scripts"; cp -R "$ROOT/lib" "$M/lib"
  before=$(wc -c < "$M/scripts/gate-card.js")
  perl -0pi -e 's/\/\/ <<<NO-DOSSIER-GUARD-BLOCK.*?\/\/ NO-DOSSIER-GUARD-BLOCK>>>//s' "$M/scripts/gate-card.js"
  after=$(wc -c < "$M/scripts/gate-card.js")
  if [ "$before" = "$after" ]; then bad "AC-6 tiem mutant" "lenh tiem KHONG doi duoc mot dong nao ($before byte) — marker NO-DOSSIER-GUARD-BLOCK khong ton tai"
  else
    ok "AC-6 tiem mutant doi duoc vat ($before -> $after byte)"
    r="$(run_gc "$M/scripts/gate-card.js" "$T" ho-so-ma)"; rc="${r%%|*}"; rr="${r#*|}"; len="${rr%%|*}"
    if [ "$rc" = "0" ] && [ "$len" -gt 500 ]; then ok "AC-6 mutant khong-chot VE LAI the ma (exit 0, $len byte) — phep do phan biet duoc co-chot/khong-chot"
    else bad "AC-6 rang phep do" "go chot roi ma van khong ve the ma (exit=$rc, $len byte) — phep do o tren co the luon xanh vi ly do khac"; fi
  fi
  ;;

# ------------------------------------------------------------------ than-lenh
than-lenh)
  BLOCK="$(sed -n '/<<<CARD-PRECHECK-RULES/,/CARD-PRECHECK-RULES>>>/p' "$CMDFILE")"
  if [ -z "$BLOCK" ]; then bad "AC-7 khoi luat" "commands/acceptance-card.md khong co khoi marker CARD-PRECHECK-RULES"
  else
    ok "AC-7 khoi marker CARD-PRECHECK-RULES co mat"
    for luat in chay-chot-truoc-khi-render khong-render khong-ghi-card-html thuat-lai-tieng-san-pham; do
      have "$luat" "$BLOCK" && ok "AC-7 luat «$luat» co mat" || bad "AC-7 luat «$luat»" "khoi thieu menh de nay"
    done
    for luat in chay-chot-truoc-khi-render khong-render khong-ghi-card-html thuat-lai-tieng-san-pham; do
      MD="$(NEW_T)"; MC="$MD/cmd.md"
      grep -v "^[[:space:]]*$luat[[:space:]]*$" "$CMDFILE" > "$MC"
      MB="$(sed -n '/<<<CARD-PRECHECK-RULES/,/CARD-PRECHECK-RULES>>>/p' "$MC")"
      if have "$luat" "$MB"; then bad "AC-7 mutant «$luat»" "go dong roi ma van thay — menh de khong nam tren dong rieng"
      else ok "AC-7 mutant «$luat» do dung menh de bi go"; fi
    done
  fi
  # QUAN HE THU TU (khong chi su-co-mat): khoi tien de phai dung TRUOC moi buoc
  # render va moi cho ghi card.html nam NGOAI khoi.
  thu_tu() { # <file> -> in "<dong cuoi khoi>|<dong render som nhat>"; rong = thieu du kien
    node -e '
      const fs=require("fs"); const L=fs.readFileSync(process.argv[1],"utf8").split(/\r?\n/);
      let bs=-1,be=-1;
      L.forEach((l,i)=>{ if(l.includes("<<<CARD-PRECHECK-RULES")&&bs<0)bs=i; if(l.includes("CARD-PRECHECK-RULES>>>"))be=i; });
      if(bs<0||be<0){ process.stdout.write(""); process.exit(0); }
      let first=-1;
      L.forEach((l,i)=>{ if(i>=bs&&i<=be) return;
        if(l.includes("--plain")||l.includes("**Render**")||l.includes("card.html")){ if(first<0||i<first) first=i; } });
      process.stdout.write(be+"|"+first);
    ' "$1"
  }
  tt="$(thu_tu "$CMDFILE")"
  if [ -z "$tt" ]; then bad "AC-7 thu tu" "khong doc duoc khoi tien de de do thu tu"
  else
    be="${tt%%|*}"; fr="${tt#*|}"
    if [ "$fr" = "-1" ]; then bad "AC-7 thu tu" "khong tim thay buoc render nao trong than lenh — phep do khong co gi de so"
    elif [ "$be" -lt "$fr" ]; then ok "AC-7 thu tu: khoi tien de (dong $be) dung TRUOC buoc render dau tien (dong $fr)"
    else bad "AC-7 thu tu" "khoi tien de (dong $be) nam SAU buoc render (dong $fr) — nguoi van thay the ma"; fi
    # MUTANT HOAN VI: doi tron khoi tien de xuong cuoi file -> phai DO.
    MD="$(NEW_T)"; MC="$MD/cmd.md"
    node -e '
      const fs=require("fs"); const L=fs.readFileSync(process.argv[1],"utf8").split(/\r?\n/);
      let bs=-1,be=-1;
      L.forEach((l,i)=>{ if(l.includes("<<<CARD-PRECHECK-RULES")&&bs<0)bs=i; if(l.includes("CARD-PRECHECK-RULES>>>"))be=i; });
      const blk=L.slice(bs,be+1); const rest=L.slice(0,bs).concat(L.slice(be+1));
      fs.writeFileSync(process.argv[2], rest.concat(blk).join("\n"));
    ' "$CMDFILE" "$MC"
    mt="$(thu_tu "$MC")"; mbe="${mt%%|*}"; mfr="${mt#*|}"
    if [ -z "$mt" ]; then bad "AC-7 mutant hoan vi" "ban sao mat khoi tien de — lenh tiem hong"
    elif [ "$mbe" -lt "$mfr" ]; then bad "AC-7 rang thu tu" "doi khoi xuong cuoi ma phep do van XANH — phep do khong bat duoc thu tu"
    else ok "AC-7 mutant hoan vi: doi khoi xuong cuoi -> phep do DO dung nhu ky vong"; fi
  fi
  ;;

# ----------------------------------------------------------------- round-trip
round-trip)
  # Ghim CAP mot-doi-mot, khong ghim TAP: moi hang phai nam CUNG DONG voi mot loi
  # thuat RIENG, va so dong thuat bang dung so hang (thua cung do). Dan ca ba hang
  # vao mot khoi chu thich chung KHONG qua duoc luoi nay.
  # PHAM VI DEM: chi trong BUOC tien de (tu khoi marker toi buoc danh so ke tiep),
  # khong phai ca file — than lenh dung dau "→" o nhieu cho khac, dem ca file thi
  # dang thuc vo nghia va "thua cung do" khong con noi len dieu gi.
  doan_thuat() { # in ra cac dong thuat cua RIENG buoc tien de
    node -e '
      const fs=require("fs"); const L=fs.readFileSync(process.argv[1],"utf8").split(/\r?\n/);
      let be=-1; L.forEach((l,i)=>{ if(l.includes("CARD-PRECHECK-RULES>>>")) be=i; });
      if(be<0){ process.exit(0); }
      let end=L.length;
      for(let i=be+1;i<L.length;i++){ if(/^[0-9]+\. /.test(L[i])){ end=i; break; } }
      // DONG THUAT = dong gach dau dong mo bang mot chuoi hang trong nhay nguoc
      // VA co dau thuat. Van xuoi co dau thuat ("Ma thoat khac 0 -> DUNG") KHONG
      // phai loi thuat cua mot ca cu the, nen khong tinh — dinh nghia chat de
      // dang thuc "thua cung do" con noi len dieu gi.
      const RE=/^\s*- `[^`]+`\s*\u2192/;
      process.stdout.write(L.slice(be+1,end).filter(l=>RE.test(l)).join("\n"));
    ' "$CMDFILE"
  }
  THUAT="$(doan_thuat)"
  dem_cap() { # <chuoi> -> so dong thuat CUA BUOC TIEN DE co chua chuoi
    printf '%s\n' "$THUAT" | grep -c -- "$1"
  }
  TONG=0
  for pair in "MSG_NO_WORKSPACE:$MSG_WS" "MSG_NO_DOSSIER:$MSG_DIR" "MSG_NO_CONTRACT:$MSG_CT"; do
    n="${pair%%:*}"; v="${pair#*:}"
    c="$(dem_cap "$v")"
    if [ "$c" = "1" ]; then ok "AC-8 «$v» ghep dung MOT loi thuat rieng (rut tu $n)"; TONG=$((TONG+1))
    elif [ "$c" = "0" ]; then bad "AC-8 $n" "khong co dong thuat nao chua «$v» — hai ben da troi khoi nhau"
    else bad "AC-8 $n" "co $c dong thuat chua «$v» — cap khong con mot-doi-mot"; fi
  done
  SODONG="$(printf '%s\n' "$THUAT" | grep -c .)"
  if [ "$SODONG" = "3" ]; then ok "AC-8 dang thuc: 3 dong thuat = 3 hang rut duoc"
  else bad "AC-8 dang thuc so luong" "than lenh co $SODONG dong thuat, hang rut duoc 3 — thua hay thieu deu la troi"
  fi
  [ "$TONG" = "3" ] && ok "AC-8 du 3 cap (so assert = so phan tu)" || bad "AC-8 so cap" "chi ghep duoc $TONG/3 cap"
  # BA MUTANT RIENG: doi TUNG chuoi mot o ben VIET -> moi mutant chi duoc lam do
  # dung cap cua no; hai cap kia phai con nguyen.
  for n in MSG_NO_WORKSPACE MSG_NO_DOSSIER MSG_NO_CONTRACT; do
    MD="$(NEW_T)"; cp "$GC" "$MD/gate-card.js"
    perl -0pi -e "s/(const $n\s*=\s*')[^']*/\${1}gate-card: CHUOI-BIA-$n/s" "$MD/gate-card.js"
    v2="$(pick "$n" "$MD/gate-card.js")"
    v1="$(pick "$n" "$GC")"
    if [ "$v2" = "$v1" ]; then bad "AC-8 tiem [$n]" "lenh tiem khong doi duoc hang"
    elif [ "$(dem_cap "$v2")" != "0" ]; then bad "AC-8 rang [$n]" "than lenh chua ca chuoi BIA — phep do khong phan biet duoc"
    else
      ok "AC-8 mutant [$n]: doi chu ben viet -> cap do dung cho"
      # hai cap kia phai CON NGUYEN (mutant khong lam do lan)
      con=0
      for other in "$MSG_WS" "$MSG_DIR" "$MSG_CT"; do
        [ "$other" = "$v1" ] && continue
        [ "$(dem_cap "$other")" = "1" ] && con=$((con+1))
      done
      [ "$con" = "2" ] && ok "AC-8 mutant [$n] khong lam do lan hai cap kia" || bad "AC-8 mutant [$n] lam do lan" "chi con $con/2 cap kia nguyen"
    fi
  done
  ;;

# ----------------------------------------------------------------- suite-case
suite-case)
  # Ghim theo DANH SACH TEN, khong theo so dem tran: thieu mot ten la do, thua
  # mot ten cung do (thua = danh sach khai da loi thoi so voi bo kiem).
  KHAI="GM01 GM02 GM03 GM04 GM05 GM06"
  OUT="$(cd "$ROOT" && bash tests/scripts/run-tests.sh 2>&1)"
  # chieu 1: moi ten khai phai co dong PASS trong stdout
  for c in $KHAI; do
    have "PASS: $c" "$OUT" && ok "suite co dong «PASS: $c»" || bad "suite thieu $c" "khong thay dong «PASS: $c» — case khai ma khong chay"
  done
  # chieu 2: moi ten GM* xuat hien trong stdout phai nam trong danh sach khai
  THAY="$(printf '%s\n' "$OUT" | sed -n 's/^[[:space:]]*\(PASS\|FAIL\): \(GM[0-9][0-9]*\).*/\2/p' | sort -u | tr '\n' ' ')"
  THUA=""
  for t in $THAY; do case " $KHAI " in *" $t "*) ;; *) THUA="$THUA $t";; esac; done
  if [ -z "$THUA" ]; then ok "suite khong co case GM* nao ngoai danh sach khai"
  else bad "danh sach khai loi thoi" "bo kiem co case ngoai khai:$THUA — sua danh sach trong evals.yaml cung luot"; fi
  # khong mot case GM* nao duoc FAIL
  if printf '%s\n' "$OUT" | grep -q '^[[:space:]]*FAIL: GM'; then bad "case GM* do" "$(printf '%s\n' "$OUT" | grep '^[[:space:]]*FAIL: GM' | head -3)"
  else ok "khong case GM* nao FAIL"; fi
  ;;

# ----------------------------------------------------------------- suite-tong
suite-tong)
  # Khong tin ma thoat cua tron suite: mot tep case ngung nap thi runner van thoat 0
  # voi IT case hon. Do bang SO, doi chieu voi ban base dung `git archive` TRON CAY
  # (khong chep danh sach file tay — vat duoc do goi them script moi la base thieu
  # file, do vi HA TANG chu khong vi vat).
  tong() { printf '%s\n' "$1" | sed -n 's/^Results: \([0-9][0-9]*\) passed, \([0-9][0-9]*\) failed$/\1 \2/p' | tail -1; }
  OUT_NEW="$(cd "$ROOT" && bash tests/scripts/run-tests.sh 2>&1)"
  R_NEW="$(tong "$OUT_NEW")"
  if [ -z "$R_NEW" ]; then bad "doc tong moi" "khong doc duoc dong «Results: <n> passed, <m> failed»"; else
    n_new="${R_NEW%% *}"; m_new="${R_NEW##* }"
    [ "$m_new" = "0" ] && ok "cay hien tai: 0 case fail" || bad "cay hien tai fail" "$m_new case fail"
    B="$(NEW_T)"
    if (cd "$ROOT" && git archive origin/main) | tar -x -C "$B" 2>/dev/null && [ -f "$B/tests/scripts/run-tests.sh" ]; then
      OUT_BASE="$(cd "$B" && bash tests/scripts/run-tests.sh 2>&1)"
      R_BASE="$(tong "$OUT_BASE")"
      if [ -z "$R_BASE" ]; then bad "doc tong base" "ban base khong in duoc dong Results — ha tang, khong phai vat"
      else
        n_base="${R_BASE%% *}"
        can=$((n_base+6))
        if [ "$n_new" -ge "$can" ]; then ok "so case: base $n_base -> moi $n_new (>= $can, du 6 case moi, khong mat case nao)"
        else bad "so case tut" "base $n_base, moi $n_new — can it nhat $can; case bien mat ma ma thoat van 0"; fi
      fi
    else bad "dung base" "git archive origin/main that bai — khong co doi chung de so"; fi
  fi
  ;;

*) echo "chan khong biet: $CHAN"; exit 2;;
esac

echo "--- chan $CHAN: $PASS pass, $FAIL fail ---"
[ "$FAIL" = "0" ]
