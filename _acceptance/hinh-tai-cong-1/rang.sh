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
# Duong dan suy tu vi tri script (khong hardcode ROOT).
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 2
OUT="$(ONLY_BLOCK=P197 bash tests/plugins/run-tests.sh 2>&1)"; ST=$?
ERR=0
keu() { echo "P197-RANG LOI: $*"; ERR=1; }

[ "$ST" -eq 0 ] || keu "suite (ONLY_BLOCK=P197) khong xanh (exit $ST)"
printf '%s\n' "$OUT" | grep -q "PASS: P197" \
  || keu "khong thay dong 'PASS: P197' — case khong chay (bi xoa/doi ten?)"

# so dot bien CHAY THAT phai >= 22 va dong tong ket phai KHOP so dem duoc
MUTS="$(printf '%s\n' "$OUT" | grep -c "^P197-MUT-[0-9]*: .* DO dung")"
[ "$MUTS" -ge 22 ] || keu "chi thay $MUTS dot bien chay that (phai >= 22)"
SUM="$(printf '%s\n' "$OUT" | grep -o "P197 OK: doi chung duong + [0-9]* dot bien" | grep -o "[0-9]* dot bien" | grep -o "^[0-9]*")"
[ -n "$SUM" ] || keu "dong tong ket P197 khong khai so dot bien"
[ "$SUM" = "$MUTS" ] || keu "dong tong ket khai $SUM dot bien nhung dem duoc $MUTS"

# tung thong diep ghim cua AC-8 phai xuat hien trong mot dong DO
for M in "cau ve hinh lech khuon mot-nguon" "nam buoc sai thu tu" "thieu dau vet dem" \
         "thieu nguon entry sổ quyết định chờ seal" "thieu nguon lệch spec/plan gốc" \
         "thieu nguon \[GIẢ ĐỊNH\]" "thieu nguon human-gate1" "thieu dieu kien dung-nguoi" \
         "thieu duong skill vang" "thieu buoc nhin" "thieu dong duoi-nguong" "thieu duong dung lai figures" \
         "thieu gioi han ve lai mot lan" "thieu dong 0-diem-vuot" "thieu nhan buoc \[2\] Đếm" "thieu khoi Hinh tai diem quyet dinh"; do
  printf '%s\n' "$OUT" | grep -q "DO dung (GATE 1: $M)" || keu "thieu chieu do ghim '$M'"
done

if [ "$ERR" -ne 0 ]; then echo "P197-RANG DO"; exit 1; fi
echo "P197-RANG OK: PASS P197 · $MUTS dot bien chay that · 16 thong diep ghim co mat"
exit 0
