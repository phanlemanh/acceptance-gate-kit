---
schema_version: 2
feature_slug: judgment-runs
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 163899889f171465173877f5a87469c10122dfd9
human_signoff:
---

# Evidence Report: judgment-runs

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | judgment | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | test | PASS |
| E13 | AC-13 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-judgment-runs-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E2
  run_id: minted-judgment-runs-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E3
  run_id: minted-judgment-runs-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E4
  run_id: minted-judgment-runs-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E5
  run_id: minted-judgment-runs-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E6
  run_id: minted-judgment-runs-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E7
  run_id: minted-judgment-runs-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E8
  run_id: minted-judgment-runs-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E9
  run_id: minted-judgment-runs-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E10
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale:
    - domain-correctness: PASS — Cả hai harness đều có mệnh lệnh tường minh ở đúng bước: feature-loop/SKILL.md:150 ("Mọi verdict") và codex SKILL.md:589-597 (Gate 2 block) đều buộc trình inertFields thành khối RIÊNG, "cùng hạng minh bạch với carried"/"same visibility rank as carry-forward", tường minh KHÔNG được nén vào "máy đã lo"/"machine-handled summary". Cả hai đều viết bằng ngôn ngữ sản phẩm nêu đích danh eval+field (ví dụ "E10 khai runs: 3 nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn") kèm việc-của-người cụ thể, và không mâu thuẫn với phần còn lại của mỗi file (chỗ "máy đã lo" khác trong cùng file chỉ áp cho usage-summary/fidelity-WARN, không chạm inertFields).
    - operational-feasibility: PASS — Cả hai harness đều có mệnh lệnh buộc (không phải nhắc qua): feature-loop/skills/feature-loop/SKILL.md:150 nói "Kết quả có inertFields không rỗng → trình RIÊNG một khối, KHÔNG được nén vào phần 'máy đã lo' (cùng hạng minh bạch với carried)" kèm ví dụ ngôn ngữ sản phẩm "E10 khai runs: 3 nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn"; codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:589-597 trong chính section "## Gate 2" nói "When result.inertFields is non-empty, surface it as its OWN block, never folded into the machine-handled summary (same visibility rank as carry-forward)" với ví dụ tương đương bằng tiếng Anh. Cả hai đều nêu đích danh eval+field, đặt cùng hạng minh bạch với carry-forward, và không có phần nào khác trong cùng file mâu thuẫn (danh sách base package ở feature-loop:166 và các khối cảnh báo khác như CT2 ở :172 theo đúng khuôn "thêm khối riêng vào gói Gate 2", không phải một danh sách đóng loại trừ inertFields). Codex đặt chỉ dẫn trong "## Gate 2" thay vì một bullet tên "Mọi verdict" như bản Claude, nhưng vẫn là câu lệnh bắt buộc ngay trong đoạn "Present one package" — không phải gợi ý trôi nổi.
    - spec-alignment: PASS — Cả hai harness đều có mệnh lệnh rõ trong bước verdict/Gate 2: feature-loop SKILL.md dòng 150 nói "Kết quả có inertFields không rỗng → trình RIÊNG một khối, KHÔNG được nén vào phần 'máy đã lo' (cùng hạng minh bạch với carried)"; codex SKILL.md dòng 589-597 nói "surface it as its OWN block, never folded into the machine-handled summary (same visibility rank as carry-forward)" — cả hai cùng hạng minh bạch với carry-forward, không nén. Cả hai đều buộc viết bằng ngôn ngữ sản phẩm nêu đích danh eval+field (ví dụ "E10 khai runs: 3 nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn" / "E10 declares runs: 3 but a judgment eval always runs exactly once per lens") kèm việc-của-người (sửa evals.yaml hoặc ghi known limit), và không mâu thuẫn với phần còn lại của mỗi file (định nghĩa inertFields ở bước parse evals.yaml của cả hai file khớp với mô tả ở bước verdict/Gate 2).
  human_override:

- eval: E11
  run_id: minted-judgment-runs-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T00:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E12
  run_id: minted-judgment-runs-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E13
  run_id: minted-judgment-runs-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E12, E13 (bash tests/workflows/run-tests.sh) và E11 (bash scripts/sync-plugin-packages.sh --check) — pass trên cả HEAD lẫn baseline diffBase, tức không phân biệt được nhờ đâu mà xanh. Cần xem lại: hoặc viết lại eval để assert hành vi mới của tính năng judgment-runs, hoặc xác nhận đây là regression-guard có chủ ý (suite chung, không riêng cho feature này) và ghi nhận như vậy.

## Variance

Field khai mà máy không dùng: E10 khai `runs: 3` nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn, và ba góc nhìn đã là cách hấp thụ sai số. Giá trị đó bị bỏ qua — sửa evals.yaml (đổi loại eval hoặc bỏ field) hoặc chấp nhận và ghi vào phần hạn chế đã biết.

## Iterations

Round 1: E1–E9, E11–E13 (machine) pass trên HEAD, tất cả non-discriminating trên baseline (xem Analyst); E10 (judgment) — panel 3 góc nhìn đồng thuận PASS, chờ human_override bắt buộc theo luật T3 trước khi verdict tổng được nâng lên PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
