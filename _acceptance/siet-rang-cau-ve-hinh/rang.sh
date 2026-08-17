#!/usr/bin/env bash
# E1–E8 — RANG CUA HO SO siet-rang-cau-ve-hinh: ghim DUNG dong stdout cua P90 /
# P197 / P198 (khong tin exit code tron suite), pha thu hai chieu rang cua
# hinh-tai-cong-1 tren stdout THAT (RANG_STDOUT_FILE), pha thu ma tran nhan tren
# ban sao suite, va giu tinh phan biet cua rang cu tren moc diffBase.
# Nep p194: song-chet theo ho so, khong vao suite vinh vien. Moi thu gan ho so
# (rang.sh cua hinh-tai-cong-1, moc 8d1e135) do O DAY, khong o P198.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 2
TMP="$(mktemp -d)"; CP="tests/plugins/_rang-siet-copy.sh"
trap 'rm -rf "$TMP" "$CP"; git worktree prune 2>/dev/null' EXIT
ERR=0; keu() { echo "SIET-RANG LOI: $*"; ERR=1; }
has() { printf '%s\n' "$1" | grep -qF -- "$2" || keu "$3"; }
cnt() { printf '%s\n' "$1" | grep -cF -- "$2"; }

O90="$(ONLY_BLOCK="P90 tam" bash tests/plugins/run-tests.sh 2>&1)"; S90=$?
O197="$(ONLY_BLOCK=P197 bash tests/plugins/run-tests.sh 2>&1)"; S197=$?
O198="$(ONLY_BLOCK=P198 bash tests/plugins/run-tests.sh 2>&1)"; S198=$?
[ $S90 -eq 0 ] && [ $S197 -eq 0 ] && [ $S198 -eq 0 ] || keu "suite khoi P90/P197/P198 khong xanh ($S90/$S197/$S198)"

# AC-2 / E2 — P90 canh moi ban chep
has "$O90" "PASS: P90" "khong thay PASS: P90"
for m in m3 m4 m3b; do has "$O90" "P90-COPIES: $m do (1/2 ban chep)" "P90 thieu chieu do $m (1/2 ban chep)"; done

# AC-3..6 — P197
has "$O197" "PASS: P197" "khong thay PASS: P197"
NM="$(cnt "$O197" "P197-M: ")"; [ "$NM" -ge 21 ] || keu "P197-M < 21 ($NM)"
[ "$(cnt "$O197" "tach doan ")" -ge 5 ] || keu "thieu dong 'tach doan' (can 5)"
for k in bo_qua dieu_kien skill_vang nhin dung_lai; do has "$O197" "P197-TACH-$k: presence_only van xanh" "thieu P197-TACH-$k"; done
for l in "[1] Kê" "[2] Đếm" "[3] Vẽ" "[4] Nhìn" "[5] Đính"; do has "$O197" "DO dung (GATE 1: thieu nhan buoc $l)" "thieu chieu do nhan $l"; done
has "$O197" "P197-P90CHECK: xanh tren xoa-khoi, do tren sua-mot-chu" "thieu P197-P90CHECK"

# AC-1 / AC-7 — P198
has "$O198" "PASS: P198" "khong thay PASS: P198"
for c in a-hai-ban-dung b-sua-giua c-sua-4-chu-dau d-sua-4-chu-cuoi e-xoa-mot-ban f-xoa-ca-hai; do has "$O198" "P198-CA-$c OK" "thieu ca fixture $c"; done
has "$O198" "P198 OK: 6 ca fixture · 4 kiem cau truc · 4 dot bien" "dong tong ket P198 lech"

# AC-3 (i)/(ii) — rang cua hinh-tai-cong-1 tren stdout THAT roi tung ban sao sua MOT dong
R1=_acceptance/hinh-tai-cong-1/rang.sh
printf '%s\n' "$O197" > "$TMP/p197.out"
RANG_STDOUT_FILE="$TMP/p197.out" bash "$R1" >/dev/null 2>&1 || keu "rang hinh-tai-cong-1 khong OK tren stdout that"
MSG="GATE 1: thieu buoc nhin"
grep -vF "DO dung ($MSG)" "$TMP/p197.out" > "$TMP/p197-i.out"
OUTI="$(RANG_STDOUT_FILE="$TMP/p197-i.out" bash "$R1" 2>&1)"; [ $? -ne 0 ] || keu "rang khong DO khi xoa dong DO dung"
has "$OUTI" "thieu chieu do ghim '$MSG'" "rang khong ghim dung msg khi xoa dong DO dung"
grep -vF "P197-M: $MSG" "$TMP/p197.out" > "$TMP/p197-ii.out"
OUTII="$(RANG_STDOUT_FILE="$TMP/p197-ii.out" bash "$R1" 2>&1)"; [ $? -ne 0 ] || keu "rang khong DO khi xoa dong P197-M"
has "$OUTII" "so P197-M khong khop P197-M-COUNT" "rang khong ghim khong-khop-COUNT khi xoa dong P197-M"
grep -q 'for M in "' "$R1" && keu "rang hinh-tai-cong-1 con danh sach tay"

# AC-5 — ma tran nhan: ban sao suite bo mot dot bien nhan → P197 DO ghim 'ma tran chua toan phan'
sed 's/^for l in LABELS:$/for l in LABELS[:4]:/' tests/plugins/run-tests.sh > "$CP"   # bo dot bien nhan cuoi
grep -q 'for l in LABELS\[:4\]:' "$CP" || keu "sed ban sao suite khong doi gi — dot bien nhan khong duoc bo"
OUTN="$(ONLY_BLOCK=P197 bash "$CP" 2>&1)"; rm -f "$CP"
has "$OUTN" "ma tran chua toan phan" "bo dot bien nhan ma P197 khong do 'ma tran chua toan phan'"
has "$OUTN" "thieu nhan buoc [5] Đính" "P197 do ma tran nhung khong ghim dung nhan thieu [5] Đính"

# AC-8 — tinh phan biet: rang cua hinh-tai-cong-1 phai DO tren moc diffBase (khoi GATE 1 chua co)
BASE=8d1e135682633ba22c44d253e90b0f404043722b   # moc PR #62 tach nhanh — song trong ho so, khong trong suite
# Doi chung DUONG truoc (khoi da chay), roi ghim DUNG thong diep — khong tin exit code mot minh
# (bat bien CLAUDE.md «assertion am-tinh-mot-minh la assertion khong song»).
if git cat-file -e "$BASE^{commit}" 2>/dev/null; then
  if git worktree add -q "$TMP/base" "$BASE" 2>"$TMP/wt.err"; then
    mkdir -p "$TMP/base/_acceptance/hinh-tai-cong-1" && cp "$R1" "$TMP/base/_acceptance/hinh-tai-cong-1/rang.sh" \
      || keu "khong chep duoc rang vao worktree base"
    OUTB="$(bash "$TMP/base/_acceptance/hinh-tai-cong-1/rang.sh" 2>&1)"; STB=$?
    [ "$STB" -ne 0 ] || keu "rang hinh-tai-cong-1 XANH tren diffBase — mat tinh phan biet"
    has "$OUTB" "P197-RANG DO" "rang tren base khong in 'P197-RANG DO' (do vi ly do khac: exit $STB)"
    has "$OUTB" "khong thay dong 'PASS: P197'" "rang tren base khong ghim 'khong thay dong PASS: P197' — khoi GATE 1 chua co la ly do phai thay"
    git worktree remove --force "$TMP/base" 2>/dev/null || keu "khong go duoc worktree base"
  else
    keu "khong tao duoc worktree base: $(head -1 "$TMP/wt.err")"
  fi
else
  keu "khong co commit $BASE trong repo (shallow clone?) — chan diffBase khong chay duoc"
fi

if [ "$ERR" -ne 0 ]; then echo "SIET-RANG DO"; exit 1; fi
echo "SIET-RANG OK: P90 3 ban chep · P197 $NM msg + 5 tach + 5 nhan · P198 6 ca · rang cu 2 chieu do + phan biet diffBase"
exit 0
