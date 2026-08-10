#!/usr/bin/env bash
# MỘT nguồn kịch bản fixture cho khối 👉 VIỆC CỦA ANH.
#
# Vì sao tồn tại: trước đây khối P186/P186b/P187 trong run-tests.sh và bộ sinh
# thẻ bằng chứng (render-viec-cua-anh-cards.sh) mỗi bên tự dựng heredoc riêng
# cho CÙNG một kịch bản. Hai bên trôi khỏi nhau thì máy đo một kịch bản còn hội
# đồng chấm một kịch bản khác, mà cả hai phép đo vẫn xanh — đúng hình dạng 3
# của bất biến "thước phải gắn vào vật được giao" (S4-r2).
#
# Dùng: source file này rồi gọi  vca_scenario <tên> <thư mục workspace>
# Tên kịch bản: gate1-draft · gate1-approved · gate2-4loai · gate2-pass-thuan-may
#               · gate2-reject · gate2-blocked · gate2-weird
# Mỗi lần gọi ghi đè trọn `<ws>/_acceptance/fx/` nên các kịch bản không rò sang nhau.

vca_scenario() {
  local name="$1" ws="$2"
  local d="$ws/_acceptance/fx"
  rm -rf "$d"; mkdir -p "$d"
  case "$name" in
    gate1-draft|gate1-approved)
      local st=draft; [ "$name" = gate1-approved ] && st=approved
      cat > "$d/contract.md" <<EOF
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: $st
---

## Criteria

- AC-1: Given a, When b, Then c.

## Coverage

- Trục duy nhất: đủ.

## Out of scope

- Hoãn x.
EOF
      ;;
    gate2-4loai)
      cat > "$d/contract.md" <<'EOF'
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
      printf '%s\n' '{"id":"d-s","type":"seal","gate":1}' '{"id":"d-p1","type":"fix","stage":"S4-r1","decision":"đổi hướng X","impact":"nhanh hơn"}' > "$d/decisions.jsonl"
      cat > "$d/evidence-report.md" <<'EOF'
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
      cat > "$d/review-findings.md" <<'EOF'
## Ngoài hợp đồng

- **globToRe unescaped**
  file: lib/x.js
  severity: P1
  proposal: known-limits
  Người dùng thấy gì: Lỗi hiếm khi tên file có dấu hỏi
EOF
      ;;
    gate2-pass-thuan-may)
      cat > "$d/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: verified
---

## Criteria

- AC-1: Given a, When b, Then c.
EOF
      cat > "$d/evidence-report.md" <<'EOF'
---
verdict: PASS
---

## Per-eval

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: abcd1234
  exit_code: 0
  verifier: bash tests/x.sh
EOF
      ;;
    gate2-reject|gate2-blocked|gate2-weird)
      cat > "$d/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: implemented
---

## Criteria

- AC-1: Given a, When b, Then c.
EOF
      local v=REJECT ev=FAIL
      [ "$name" = gate2-blocked ] && { v=BLOCKED; ev=PASS; }
      [ "$name" = gate2-weird ] && { v=WEIRD; ev=PASS; }
      printf -- '---\nverdict: %s\n---\n\n## Per-eval\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | %s |\n' "$v" "$ev" > "$d/evidence-report.md"
      ;;
    *)
      echo "vca_scenario: khong biet kich ban '$name'" >&2; return 2 ;;
  esac
}
