---
schema_version: 2
feature_slug: cham-dung-cay-dung-cho-dung
verdict: REJECT
failed_evals: []
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e3401862cc4ff586823f50111e271c0d46ef767e
human_signoff: 
---

# Evidence Report: cham-dung-cay-dung-cho-dung

⚠ REJECT dù mọi eval máy (E1–E13) PASS trên nhánh: review/scope-triage xác nhận các lỗi HIGH-SEVERITY TRONG HỢP ĐỒNG mà mã kiểm thử hiện có không chạm tới (xem `review-findings.md` mục "Trong hợp đồng" — AC-1 ×2, AC-9, AC-12). Round quay lại triển khai, không lên Gate 2.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | test | PASS |
| E13 | AC-13 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cham-dung-cay-dung-cho-dung-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdc_args_du_truong
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    PASS: chiều đỏ: thiếu suite_keys → kêu to, không sinh tệp
    PASS: mutant diffBase≠merge-base bị vế 7 phân biệt (giá trị lệch thật)
    rang[args-du-truong]: 3 pass, 0 fail

- eval: E2
  run_id: minted-cham-dung-cay-dung-cho-dung-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdc_ref_hong_keu_to
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    PASS: fail-closed: không sinh tệp args
    PASS: đối chứng dương: ref thật → exit 0, tệp sinh ra
    rang[ref-hong]: 3 pass, 0 fail

- eval: E3
  run_id: minted-cham-dung-cay-dung-cho-dung-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdc_round_tu_dem
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    PASS: không evidence-report → round 1
    PASS: chiều đỏ: section lạ → kêu to, không đoán
    rang[round-tu-dem]: 3 pass, 0 fail

- eval: E4
  run_id: minted-cham-dung-cay-dung-cho-dung-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdc_carry_da_goi
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    PASS: carry tự gọi: carried + P2 + P3 đủ
    PASS: chiều đỏ: thiếu khai carry → kêu to
    rang[carry-da-goi]: 2 pass, 0 fail

- eval: E5
  run_id: minted-cham-dung-cay-dung-cho-dung-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdc_loi_khai_pham_vi
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    PASS: vế SKILL: khối S4-ARGS-FRESHNESS chứa generated_sha + hành-động-sinh-lại
    PASS: chiều đỏ vế SKILL: bản sao rỗng ruột → phép kiểm đỏ được
    rang[loi-khai]: 4 pass, 0 fail

- eval: E6
  run_id: minted-cham-dung-cay-dung-cho-dung-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E7
  run_id: minted-cham-dung-cay-dung-cho-dung-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-cham-dung-cay-dung-cho-dung-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E9
  run_id: minted-cham-dung-cay-dung-cho-dung-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E10
  run_id: minted-cham-dung-cay-dung-cho-dung-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E11
  run_id: minted-cham-dung-cay-dung-cho-dung-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E12
  run_id: minted-cham-dung-cay-dung-cho-dung-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E13
  run_id: minted-cham-dung-cay-dung-cho-dung-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdc_skill_khong_fallback
  verified_at: 2026-08-29T10:00:00+07:00
  output: |
    PASS: chiều đỏ (b): bản sao chèn lại soạn-tay → phép kiểm đỏ được
    PASS: chiều đỏ (a): bản sao rỗng ruột → vế (a) đỏ được
    rang[skill-khong-fallback]: 4 pass, 0 fail

## Known limits

## Ngoài hợp đồng

## Analyst

E6, E7, E8, E9, E10, E11, E12 — xanh trên CẢ HAI (nhánh và baseline diffBase) nên không phân biệt được tính năng mới; hai suite (`tests/workflows/run-tests.sh`, `tests/plugins/run-tests.sh`) mang phần lớn khối lượng test mới của hồ sơ này nhưng không có ca nào riêng chỉ đỏ trên code cũ. Đề xuất: viết thêm ca mutant/chiều-đỏ riêng cho từng case mới (LP1/LP2/LP4, P194, P201...) trong hai suite này để chứng chúng thật sự phân biệt được tính năng — hoặc xác nhận có chủ ý là regression-guard nếu case đó chỉ canh hồi quy của hành vi cũ.

## Variance

none — không có eval nào chạy nhiều lần (không có eval stochastic trong vòng này).

## Iterations

Round 1: E1–E13 đều PASS trên máy, nhưng review/triage xác nhận 5 finding TRONG HỢP ĐỒNG (2 bản của cùng lỗi `s4-args.mjs` thiếu trường `steps` cho ui-check → AC-1, gloss triage thiếu `wont-fix` → AC-10, round-tally vắng ở 4 đường BLOCKED sớm → AC-9, `CD_FAIL_RE` không khớp dash/BusyBox → AC-12) — verdict REJECT, quay lại triển khai.
