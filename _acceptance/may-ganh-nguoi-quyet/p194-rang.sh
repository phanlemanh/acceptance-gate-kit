#!/usr/bin/env bash
# E1/E2/E3 — RANG CUA P194: chay suite plugins roi GHIM DUNG cac dong cua case
# P194 trong stdout, thay vi tin ma thoat cua tron suite.
#
# Vi sao co script nay (gap-probe P0, S4 r3): `config:executors.test.plugins`
# tra verdict bang exitCode cua CA suite — suite tren origin/main cung exit 0,
# nen E1..E4 la eval KHONG PHAN BIET duoc cay cu voi cay moi. Xoa/doi ten khoi
# `run "P194 ..."` thi suite van xanh va 4 eval van PASS trong khi khong mot
# phep do moi nao chay. Script nay bat dieu do do dich danh.
#
# Duong dan suy tu vi tri script (khong hardcode ROOT).
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 2
OUT="$(bash tests/plugins/run-tests.sh 2>&1)"; ST=$?
ERR=0
kêu() { echo "P194-RANG LOI: $*"; ERR=1; }

[ "$ST" -eq 0 ] || kêu "suite plugins khong xanh"

# 1) case P194 phai THAT SU chay va PASS (khong chi suite xanh)
printf '%s\n' "$OUT" | grep -q "PASS: P194" \
  || kêu "khong thay dong 'PASS: P194' — case khong chay (bi xoa/doi ten/ONLY_BLOCK?)"

# 2) ba dong dem cua P194 phai co mat — moi dong mot lop quan he
for D in "MAY-GANH-GRAMMAR:" "MAY-GANH-BODY:" "MAY-GANH-COMPAT:"; do
  printf '%s\n' "$OUT" | grep -q "$D" || kêu "thieu dong dem $D"
done

# 3) so chieu do CHAY THAT phai >= 9 va dong tong ket phai KHOP so dem duoc
#    (lop tong-ket-khong-kem-so-ca: dong in literal thi con so khong la bang
#     chung gi ca — o day doi chieu voi so dong MUT-* DA in ra)
MUTS="$(printf '%s\n' "$OUT" | grep -c "^MUT-[0-9]*:")"
[ "$MUTS" -ge 9 ] || kêu "chi thay $MUTS chieu do chay that (phai >= 9)"
SUM="$(printf '%s\n' "$OUT" | grep -o "P194 OK ([^)]*[0-9]* chieu do" | grep -o "[0-9]* chieu do" | grep -o "^[0-9]*")"
[ -n "$SUM" ] || kêu "dong tong ket P194 khong khai so chieu do"
[ "$SUM" = "$MUTS" ] || kêu "dong tong ket khai $SUM chieu do nhung dem duoc $MUTS"

# 4) moi mutant phai co dong xac-nhan-dot-bien VA dong DO tuong ung
DOS="$(printf '%s\n' "$OUT" | grep -c "MUT-[0-9]* DO ")"
[ "$DOS" -ge "$MUTS" ] || kêu "co $MUTS mutant nhung chi $DOS dong 'MUT-n DO' (mutant khong bi bat?)"

if [ "$ERR" -eq 0 ]; then
  echo "P194-RANG OK (PASS: P194 + 3 dong dem + $MUTS chieu do chay that, tong ket khop so dem)"
  exit 0
fi
exit 1
