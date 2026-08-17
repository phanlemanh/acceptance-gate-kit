#!/usr/bin/env bash
# E1–E8 — RANG CUA P197: chay CHI khoi P197 cua suite plugins roi GHIM DUNG cac
# dong cua case trong stdout, thay vi tin ma thoat cua tron suite.
#
# Vi sao (Analyst S4-r1): `config:executors.test.plugins` tra verdict bang exit
# code CA suite — suite tren diffBase (chua co P197) cung exit 0, nen E1..E8 la
# eval KHONG PHAN BIET duoc cay cu voi cay moi. Script nay bat dieu do dich danh:
# tren diffBase, ONLY_BLOCK=P197 khong khop khoi nao → suite tu do (fail de
# khong xanh gia) → rang DO. Cung nep p194-rang.sh; khong vao suite vinh vien.
#
# Tap thong diep KHONG chep tay (siet-rang-cau-ve-hinh AC-3): P197 tu in moi
# thong diep no co the phat thanh mot dong `P197-M: <msg>`; rang doc tap do tu
# stdout roi doi MOI msg phai co dong `DO dung (<msg>)`. Doi bang M o P197 thi
# rang tu theo — mot nguon. RANG_STDOUT_FILE=<file> → doc stdout tu file (duong
# round-trip de rang cua ho so siet-rang pha thu hai chieu).
#
# Duong dan suy tu vi tri script (khong hardcode ROOT).
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 2
if [ -n "${RANG_STDOUT_FILE:-}" ]; then
  OUT="$(cat "$RANG_STDOUT_FILE")"; ST=0
else
  OUT="$(ONLY_BLOCK=P197 bash tests/plugins/run-tests.sh 2>&1)"; ST=$?
fi
ERR=0
keu() { echo "P197-RANG LOI: $*"; ERR=1; }

[ "$ST" -eq 0 ] || keu "suite (ONLY_BLOCK=P197) khong xanh (exit $ST)"
printf '%s\n' "$OUT" | grep -q "PASS: P197" \
  || keu "khong thay dong 'PASS: P197' — case khong chay (bi xoa/doi ten?)"

# tap thong diep do P197 khai (mot nguon) — san 21 (18 khoa - 2 template + 4 nguon + 5 nhan = 25 hien tai)
SAN=21
K="$(printf '%s\n' "$OUT" | sed -n 's/^P197-M: //p')"
NK="$(printf '%s\n' "$K" | grep -c .)"
[ "$NK" -ge "$SAN" ] || keu "so P197-M < san ($NK < $SAN)"
CNT="$(printf '%s\n' "$OUT" | sed -n 's/^P197-M-COUNT: //p' | tail -1)"
[ -n "$CNT" ] || keu "thieu dong P197-M-COUNT"
[ "$NK" = "$CNT" ] || keu "so P197-M khong khop P197-M-COUNT ($NK vs $CNT)"

# tung thong diep phai co mot dong DO tuong ung
while IFS= read -r m; do
  [ -n "$m" ] || continue
  printf '%s\n' "$OUT" | grep -qF "DO dung ($m)" || keu "thieu chieu do ghim '$m'"
done <<< "$K"

# so dot bien CHAY THAT >= so thong diep, va dong tong ket phai KHOP so dem duoc
MUTS="$(printf '%s\n' "$OUT" | grep -c "^P197-MUT-[0-9]*: .* DO dung")"
[ "$MUTS" -ge "$NK" ] || keu "chi thay $MUTS dot bien chay that (< $NK thong diep)"
SUM="$(printf '%s\n' "$OUT" | grep -o "P197 OK: doi chung duong + [0-9]* dot bien" | grep -o "[0-9]* dot bien" | grep -o "^[0-9]*")"
[ -n "$SUM" ] || keu "dong tong ket P197 khong khai so dot bien"
[ "$SUM" = "$MUTS" ] || keu "dong tong ket khai $SUM dot bien nhung dem duoc $MUTS"

if [ "$ERR" -ne 0 ]; then echo "P197-RANG DO"; exit 1; fi
echo "P197-RANG OK: PASS P197 · $MUTS dot bien chay that · $NK thong diep (tu P197-M) deu da do"
exit 0
