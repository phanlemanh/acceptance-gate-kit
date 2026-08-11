#!/usr/bin/env bash
# E5 (AC-5) — khong-troi-VAT-CAM: chip (3b) chi doi tang day-model (khoi
# GRAMMAR + 6 than lenh co-cau-hoi); ben VIET cau mau (scripts/gate-card.js),
# vat chip (2)/(2)b (YOUR-MOVE-BLOCK-TEMPLATE, GATE-INVITE-CLAUSE,
# GATE-INVITE-SITES) VA tang may-doc chip (3) (GATE-ONESHOT-SLOTS/-CLAUSE/
# -SITES) KHONG duoc doi mot byte. So voi BASE TUONG MINH origin/main —
# khong dung `git diff` tran (sau commit thi cong no luon rong => chot xanh
# chan khong, lo P1 chip (2)b).
#
# Duong dan suy tu vi tri script (khong hardcode ROOT — bai thuoc-gan-vao-
# checkout-tac-gia).
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 2
BASE="${1:-origin/main}"
ERR=0
kêu() { echo "NO-DRIFT LOI: $*"; ERR=1; }

git rev-parse --verify "$BASE" >/dev/null 2>&1 || { echo "NO-DRIFT LOI: khong giai duoc base $BASE"; exit 2; }

# (a) diff name-only KHONG duoc chua ben VIET cau mau
DIFF="$(git diff --name-only "$BASE"...HEAD)" || { echo "NO-DRIFT LOI: git diff that bai"; exit 2; }
[ -n "$DIFF" ] || kêu "diff rong so voi $BASE — phep do khong the ket luan (chay tren nhanh chua commit gi?)"
if printf '%s\n' "$DIFF" | grep -qx "scripts/gate-card.js"; then
  kêu "scripts/gate-card.js NAM TRONG diff — ben VIET cau mau da bi cham (pham vi hop dong cam)"
else
  echo "NO-DRIFT: scripts/gate-card.js OK (khong nam trong diff so $BASE)"
fi

# (b) SAU khoi rut qua marker phai byte-equal giua base va HEAD:
#     3 vat chip (2)/(2)b + 3 khoi tang may-doc chip (3)
LAW="skills/acceptance/references/human-facing-language.md"
rut() { # <marker> <noi dung file tren stdin>
  awk -v m="$1" '
    $0 ~ ("<!-- <<<" m " -->") { inb = 1; next }
    $0 ~ ("<!-- " m ">>> -->") { inb = 0 }
    inb { print }
  '
}
BASE_LAW="$(git show "$BASE:$LAW" 2>/dev/null)" || { echo "NO-DRIFT LOI: khong doc duoc $LAW tai $BASE"; exit 2; }
HEAD_LAW="$(cat "$LAW")" || exit 2
for M in YOUR-MOVE-BLOCK-TEMPLATE GATE-INVITE-CLAUSE GATE-INVITE-SITES GATE-ONESHOT-SLOTS GATE-ONESHOT-CLAUSE GATE-ONESHOT-SITES; do
  A="$(printf '%s\n' "$BASE_LAW" | rut "$M")"
  B="$(printf '%s\n' "$HEAD_LAW" | rut "$M")"
  if [ -z "$A" ]; then
    kêu "$M rut duoc RONG tai $BASE — marker doi ten? (phep do khong the ket luan)"
  elif [ "$A" = "$B" ]; then
    echo "NO-DRIFT: $M OK (byte-equal $BASE vs HEAD)"
  else
    kêu "$M DA DOI so voi $BASE — vat cam cua chip (2)/(2)b/(3) khong duoc cham"
  fi
done

if [ "$ERR" -eq 0 ]; then
  echo "NO-DRIFT OK (1 diff-check + 6 vat byte-equal so $BASE)"
  exit 0
fi
exit 1
