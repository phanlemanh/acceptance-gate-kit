#!/usr/bin/env bash
# RANG cua ho so t1-escape-slug-only.
#
# Vi sao co script nay: `config:executors.test.scripts` tra verdict bang ma
# thoat cua CA suite, ma suite tren main cung exit 0 — nen mot eval "suite
# xanh" KHONG PHAN BIET duoc cay cu voi cay moi. Xoa TE21/TE22 khoi suite thi
# suite van xanh va eval van PASS trong khi khong phep do nao chay. Cung bai
# hoc da ghi o p194-rang.sh.
#
# Ba lop:
#   1) cac case MOI phai THAT SU chay va PASS (ghim dung dong trong stdout)
#   2) DOT BIEN tren chinh vat: khoi phuc dong `case` cu -> lo phai TAI XUAT
#      HIEN. Day la lop duy nhat chung minh phep do doc dung thu no tuong.
#   3) lan toa sang consumer: mirror plugin dong bo + version da bump
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 2
ERR=0
keu() { echo "RANG LOI: $*"; ERR=1; }

# ── 1) case moi phai chay that ───────────────────────────────────────────────
OUT="$(bash tests/scripts/run-tests.sh 2>&1)"; ST=$?
[ "$ST" -eq 0 ] || keu "suite scripts khong xanh"
for L in "PASS: TE21a" "PASS: TE21b" "PASS: TE21c" "PASS: TE22a" "PASS: TE22b" "PASS: TE23a"; do
  printf '%s\n' "$OUT" | grep -q "$L" || keu "khong thay '$L' — case khong chay (bi xoa/doi ten?)"
done
printf '%s\n' "$OUT" | grep -q "PASS: DV5 scripts/pre-merge-check.sh" \
  || keu "DV5 additive-only khong PASS tren pre-merge-check.sh"

# ── 2) DOT BIEN: khoi phuc dong `case` cu -> lo phai tai xuat hien ───────────
# Fixture: mot PR doi file ma non-T1 VA sua _acceptance/config.yaml, khong co
# thu muc slug nao. Ban VA phai chan; ban CU phai lot. Neu ca hai cung xu ly
# giong nhau thi phep do nay mu, va script bao loi.
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
R="$T/repo"
mkdir -p "$R/_acceptance" "$R/src" "$R/docs"
cat > "$R/_acceptance/config.yaml" <<'YAML'
schema_version: 1
enforcement: strict
risk_tiers:
  t1_skip_globs:
    - "docs/**"
signoff:
  required_for: [T2, T3]
YAML
printf 'v1\n' > "$R/src/app.js"
git -C "$R" init -q 2>/dev/null
git -C "$R" add -A >/dev/null 2>&1
git -c user.email=t@t -c user.name=t -C "$R" commit -qm base >/dev/null 2>&1
BASE="$(git -C "$R" rev-parse HEAD)"
printf 'v2\n' >> "$R/src/app.js"
printf '\n# cham vao cau hinh, khong phai bang chung\n' >> "$R/_acceptance/config.yaml"
git -C "$R" add -A >/dev/null 2>&1
git -c user.email=t@t -c user.name=t -C "$R" commit -qm change >/dev/null 2>&1

VA="$(bash "$ROOT/scripts/pre-merge-check.sh" "$R" --base "$BASE" 2>&1)"
printf '%s\n' "$VA" | grep -q "VIOLATION \[PR\]" \
  || keu "ban VA khong chan fixture (le ra phai nо) — rang mu"
printf '%s\n' "$VA" | grep -q "src/app.js" \
  || keu "ban VA chan nhung khong liet dung file ma vi pham"

# dot bien: dung lai dong `case` cu (mot nhanh, gate_touched=1 cho MOI duong dan)
MUT="$T/pre-merge-check-mutant.sh"
python3 - "$ROOT/scripts/pre-merge-check.sh" "$MUT" <<'PY'
import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
new = ('    case "$f" in\n'
       '      _acceptance/*/*|*/_acceptance/*/*) gate_touched=1; continue ;;\n'
       '      _acceptance/*|*/_acceptance/*) continue ;;\n'
       '    esac\n')
old = '    case "$f" in _acceptance/*|*/_acceptance/*) gate_touched=1; continue ;; esac\n'
if new not in s:
    print('MUTANT-LOI: khong thay khoi case da va — vat da doi hinh, sua rang.sh')
    sys.exit(3)
open(dst, 'w', encoding='utf-8').write(s.replace(new, old, 1))
PY
if [ $? -ne 0 ]; then keu "khong dung duoc dot bien"; else
  CU="$(bash "$MUT" "$R" --base "$BASE" 2>&1)"
  if printf '%s\n' "$CU" | grep -q "VIOLATION \[PR\]"; then
    keu "ban CU cung chan fixture — phep do KHONG phan biet duoc cu voi moi"
  else
    echo "DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan"
  fi
fi

# ── 3) lan toa sang consumer ────────────────────────────────────────────────
A="$(shasum scripts/pre-merge-check.sh | cut -d' ' -f1)"
B="$(shasum plugins/acceptance-gate/scripts/pre-merge-check.sh | cut -d' ' -f1)"
[ "$A" = "$B" ] || keu "mirror plugin LECH nguon ($A vs $B) — consumer cai plugin van dinh lo"
for M in .claude-plugin/plugin.json .codex-plugin/plugin.json \
         plugins/acceptance-gate/.codex-plugin/plugin.json \
         codex/acceptance-gate/.codex-plugin/plugin.json; do
  grep -q '"version": "1.40.1"' "$M" || keu "$M chua bump len 1.40.1"
done

[ "$ERR" -eq 0 ] && echo "RANG OK (6 dong case + DV5 + dot bien + mirror + 4 manifest)"
exit "$ERR"
