---
schema_version: 2
feature_slug: judgment-runs
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8c5452d3a8a03fcbfe63485ab8bd9ff98828a8e9
human_signoff:
---

# Evidence Report: judgment-runs

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2, AC-2b | test | PASS |
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
| E14 | AC-14 | test | PASS |
| E15 | AC-15 | script | PASS |
| E16 | AC-16 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-judgment-runs-E1-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E2
  run_id: minted-judgment-runs-E2-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E3
  run_id: minted-judgment-runs-E3-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E4
  run_id: minted-judgment-runs-E4-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E5
  run_id: minted-judgment-runs-E5-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E6
  run_id: minted-judgment-runs-E6-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E7
  run_id: minted-judgment-runs-E7-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E8
  run_id: minted-judgment-runs-E8-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E9
  run_id: minted-judgment-runs-E9-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E10
  judged_by: judge panel (3-lens: domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  votes:
  - domain-correctness: PASS — Ca hai harness co menh lenh rang buoc, khong phai dong nhac troi noi: feature-loop/SKILL.md:150 ("trinh RIENG mot khoi, KHONG duoc nen vao phan 'may da lo' — cung hang minh bach voi carried") va feature-loop-codex/SKILL.md:589-597 ("surface it as its OWN block, never folded into the machine-handled summary, same visibility rank as carry-forward"); ca hai deu neu vi du dich danh evalId+field bang ngon ngu san pham ("E10 khai runs:3...") kem viec-cua-nguoi (sua evals.yaml hoac ghi Known limits), dung dung yeu cau AC-10 va contract. Khong thay mau thuan noi bo trong ca hai file (cac cho khac chi mo ta hanh vi INERT o buoc parse, khong doi nguoc menh lenh nay).
  - operational-feasibility: PASS — Cả hai harness đều có mệnh lệnh cứng, không phải câu nhắc trôi nổi: feature-loop/skills/feature-loop/SKILL.md:150 ("Kết quả có inertFields không rỗng → trình RIÊNG một khối, KHÔNG được nén vào phần 'máy đã lo' (cùng hạng minh bạch với carry-forward)") và codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:589-597 ("surface it as its OWN block, never folded into the machine-handled summary (same visibility rank as carry-forward)") — cả hai đặt đúng ở bước xử lý mọi verdict trước/tại Cổng 2 của S4. Cả hai dùng ngôn ngữ sản phẩm nêu đích danh evalId + field (ví dụ "E10 khai runs: 3 nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn" / "E10 declares runs: 3 but a judgment eval always runs exactly once per lens") kèm việc-của-người (sửa evals.yaml hoặc ghi known limit), khớp cùng hạng minh bạch với carry-forward theo AC-10, và không mâu thuẫn với phần còn lại của mỗi file.
  - spec-alignment: PASS — Ca hai harness co menh lenh minh bach ngang hang carried (feature-loop/SKILL.md L150 "KHONG duoc nen vao phan may da lo"; codex/SKILL.md L589-597 "never folded into the machine-handled summary, same visibility rank as carry-forward"), ca hai cung dung cau vi du "E10 declares runs: 3..." bang ngon ngu san pham neu dich danh eval + field. Khong tim thay cau nao trong hai file mau thuan hoac lam yeu menh lenh nay (grep toan file cho inertFields / may da lo / machine-handled khong ra ket qua doi lap).
  human_override:

- eval: E11
  run_id: minted-judgment-runs-E11-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T09:18:47Z
  output: |
    plugins/ mirror in sync.

- eval: E12
  run_id: minted-judgment-runs-E12-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E13
  run_id: minted-judgment-runs-E13-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E14
  run_id: minted-judgment-runs-E14-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: E15
  run_id: minted-judgment-runs-E15-r7
  exit_code: 0
  baseline: red
  verifier: config:executors.script.mutation_check
  verified_at: 2026-08-04T09:21:15Z
  output: |
    PASS: [khoi phuc cau mo ta runs cu (khong neu gioi han executor)] -> DO dung case "WI7 feature-loop/workflows/acceptance-verify.js: mo ta neu gioi han test/script"

    Results: 11 dot bien deu bi bat (bang chung phan biet dat)

- eval: E16
  run_id: minted-judgment-runs-E16-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:12:03Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E12, E13, E14, E16 — tất cả chạy qua cùng lệnh `bash tests/workflows/run-tests.sh` và đều PASS trên CẢ HEAD lẫn diffBase (baseline: green). E11 (`bash scripts/sync-plugin-packages.sh --check`) cũng PASS trên cả hai phía (baseline: green) — mirror sync không phân biệt cho riêng feature này ở lần đo A/B này. Các eval này chứng minh harness còn sống chứ chưa phân biệt riêng cho feature `judgment-runs`. E15 (mutation-check, baseline: red) phân biệt được (đỏ trên code cũ, xanh sau khi feature vá).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 5: BLOCKED — mọi eval (E1-E10, E12-E16) đã đo và PASS, nhưng 3 lệnh xác minh (E11 `sync-plugin-packages.sh --check`, suite `tests/hooks/run-tests.sh`, `product-map.mjs --check`) không chạy được vì bash classifier service (claude-sonnet-5) tạm ngưng cho lệnh không-chỉ-đọc — nguyên nhân hạ tầng, không phải code/eval của feature.
Round 6: BLOCKED — lặp lại đúng nguyên nhân của round 5: mọi eval đã đo và PASS (E15 giữ baseline: red, panel 3-lens E10 giữ PASS đồng thuận), nhưng cùng 3 lệnh vẫn không chạy được vì classifier tiếp tục tạm ngưng — lần thứ 2 liên tiếp cùng lý do hạ tầng.
Round 7: REJECT — hạ tầng đã phục hồi, cả 16 eval máy đều PASS (E11 mirror-sync hết bị chặn, E15 mutation-check giữ baseline: red, panel 3-lens E10 đồng thuận PASS), nhưng vòng review/adversarial-verify của round này tìm ra 2 vi phạm hợp đồng nghiêm trọng mà không eval máy nào trong ma trận hiện tại bắt được: AC-12 — cờ ô-inert không hiện trên thẻ Cổng 2 khi verdict là BLOCKED/REJECT vì `scripts/gate-card.js:313` thoát sớm (`process.exit(0)`) trước khối đọc run-log/đẩy cờ, tái hiện trực tiếp trên workspace `_acceptance/judgment-runs` của chính feature này; AC-14(b) — thẻ Cổng 2 không tắt được cảnh báo ô-inert khi verify chạy lại CÙNG round, vì `scripts/gate-card.js:398` suy "vòng này sạch" từ SỰ VẮNG MẶT của dòng inert mới trong sổ append-only, tái hiện bằng workspace tạm dựng lại đúng kịch bản chạy-lại-cùng-round. Cả hai chi tiết đầy đủ nằm trong review-findings.md. Trả về S3: sửa hai điểm trên trong `scripts/gate-card.js` (+ đồng bộ mirror `plugins/acceptance-gate/scripts/gate-card.js`), bổ sung case WI6 phủ nhánh verdict non-PASS và nhánh round-lặp-lại, rồi verify lại CÙNG round 7.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
