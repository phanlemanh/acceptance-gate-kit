#!/usr/bin/env bash
# Sinh workspace tối thiểu cho ca đo — fixture do code sinh (luật kit), cùng
# khuôn với fixture gate-card trong tests/scripts/run-tests.sh.
set -euo pipefail
d="_acceptance/gfeat"
mkdir -p "$d"
cat > "$d/contract.md" <<'EOF'
---
schema_version: 1
feature: Hot lead alerts
slug: gfeat
risk_tier: T3
status: approved
---
## Criteria
- AC-1: Given khách mở ≥3 lần trong 48h, When chạm dày, Then sinh touch nóng.
- AC-2: Given khách mở 2 lần, When dưới ngưỡng, Then KHÔNG sinh touch.
## Out of scope
- Realtime broadcast — hoãn.
EOF
cat > "$d/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: script
    expected: ">=3 mở → sinh touch nóng"
  - id: E2
    criterion: AC-2
    executor: script
    expected: "2 mở → KHÔNG sinh touch"
EOF
