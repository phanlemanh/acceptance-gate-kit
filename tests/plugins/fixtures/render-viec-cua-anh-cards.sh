#!/usr/bin/env bash
# Sinh 3 thẻ bằng chứng của chip ② (khối 👉 VIỆC CỦA ANH) bằng CHÍNH
# scripts/gate-card.js của cây đang kiểm, từ fixture code-sinh trong lần chạy.
#
# Vì sao tồn tại: E7 (judgment) chấm ba file HTML dưới
# `_acceptance/khoi-viec-cua-anh/evidence/`. Nếu chúng là ảnh chụp đóng băng thì
# renderer đổi mà judge vẫn chấm bản cũ — "snapshot không ghim vào corpus sống"
# (S4-r1, finding đo-lường). P190 gọi script này rồi so byte-đối-byte, nên ba
# file kia luôn là VẬT ĐƯỢC GIAO của cây hiện tại.
#
# Dùng: render-viec-cua-anh-cards.sh <thư mục đích>
# ROOT suy từ vị trí script (không hardcode checkout của tác giả).
set -eu
OUT="${1:?can thu muc dich}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
WS="$(mktemp -d)"
trap 'rm -rf "$WS"' EXIT
mkdir -p "$WS/_acceptance/fx" "$OUT"

hdr() { printf '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">\n'; }
card() { node "$ROOT/scripts/gate-card.js" --root "$WS" --slug fx; }

# ── thẻ Cổng 1 (status draft) ────────────────────────────────────────────────
cat > "$WS/_acceptance/fx/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given a, When b, Then c.

## Coverage

- Trục duy nhất: đủ.

## Out of scope

- Hoãn x.
EOF
{ hdr; card; } > "$OUT/p185-card-gate1.html"

# ── thẻ Cổng 2 ký được (PENDING-JUDGMENT, đủ 4 loại việc-người) ──────────────
cat > "$WS/_acceptance/fx/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: verified
---

## Criteria

- AC-1: Given a, When b, Then c. (judgment)

## Out of scope

- Hoãn x.
EOF
printf '%s\n' '{"id":"d-s","type":"seal","gate":1}' '{"id":"d-p1","type":"fix","stage":"S4-r1","decision":"đổi hướng X","impact":"nhanh hơn"}' > "$WS/_acceptance/fx/decisions.jsonl"
cat > "$WS/_acceptance/fx/evidence-report.md" <<'EOF'
---
verdict: PENDING-JUDGMENT
---

## Per-eval

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E9 | AC-1 | judgment | UNCERTAIN |

## Evidence

- eval: E9
  judged_by: panel
  rationale: máy chưa chắc
EOF
cat > "$WS/_acceptance/fx/review-findings.md" <<'EOF'
## Ngoài hợp đồng

- **globToRe unescaped**
  file: lib/x.js
  severity: P1
  proposal: known-limits
  Người dùng thấy gì: Lỗi hiếm khi tên file có dấu hỏi
EOF
{ hdr; card; } > "$OUT/p186-card-gate2.html"

# ── thẻ Cổng 2 KHÔNG ký được (REJECT) ───────────────────────────────────────
cat > "$WS/_acceptance/fx/evidence-report.md" <<'EOF'
---
verdict: REJECT
---

## Per-eval

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
EOF
{ hdr; card; } > "$OUT/p187-card-gate2-reject.html"
