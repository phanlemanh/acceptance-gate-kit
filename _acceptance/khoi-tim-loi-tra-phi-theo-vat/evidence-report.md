---
schema_version: 2
feature_slug: khoi-tim-loi-tra-phi-theo-vat
verdict: REJECT
failed_evals: [E4]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1b73b4628e2479473118b1a4dea9f44b8fe67ee1
human_signoff:
---

# Evidence Report: khoi-tim-loi-tra-phi-theo-vat

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | PASS |
| E6a | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w40_triage_truoc_refute
  verified_at: 2026-09-14T09:00:00Z
  output: |
    PASS: W40 dung MOT refuter

    PASS: W47 doi chung: diff khong cham ma do -> KHONG spawn measurement

    Results: 499 passed, 0 failed (acceptance-verify)

- eval: E2
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E2-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-14T06:53:21Z
  carried_from_round: 1
  carry_note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_vung_vat_s4args
  verified_at: 2026-09-14T09:02:00Z
  output: |
    PASS: VV6b đối chứng dương: diff toàn tài liệu → vùng vật rỗng nhưng VẪN sinh args (hợp lệ)

    Results: 10 passed, 0 failed (s4-args-vung-vat)

- eval: E4
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E4-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ktl_w41_vung_vat
  verified_at: 2026-09-14T09:04:00Z
  output: |
    W47 config.yaml la MA DO — sua chuoi lenh phai kich hoat lens measurement
      PASS: W47 diff chi cham _acceptance/config.yaml -> CO call review:measurement
      PASS: W47 doi chung: diff khong cham ma do -> KHONG spawn measurement

    Results: 499 passed, 0 failed (acceptance-verify)

    Test verification: grep did NOT find "PASS: W41 triage KHONG nhan finding ho so" in output — dòng thật in ra là "PASS: W41 triage KHONG nhan finding ho so/tai lieu", assert của evals.yaml đang ghim sai chuỗi (xem review-findings.md, mục evals.yaml expected sai).

- eval: E5
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_vung_vat_mutants
  verified_at: 2026-09-14T09:06:00Z
  output: |
    PASS: VVM2 mutant (loc bao gom) NUOT finding lien-file — rang song

    Results: 10 passed, 0 failed (vung-vat-mutants)

- eval: E6a
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w42_w43_finding_so
  verified_at: 2026-09-14T09:08:00Z
  output: |
    W47 config.yaml la MA DO — sua chuoi lenh phai kich hoat lens measurement
      PASS: W47 diff chi cham _acceptance/config.yaml -> CO call review:measurement
      PASS: W47 doi chung: diff khong cham ma do -> KHONG spawn measurement

    Results: 499 passed, 0 failed (acceptance-verify)

- eval: E7
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w44_baseline_roi_gang
  verified_at: 2026-09-14T09:10:00Z
  output: |
    Results: 499 passed, 0 failed (acceptance-verify)

- eval: E8
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_wf_usage_u06
  verified_at: 2026-09-14T09:12:00Z
  output: |
    Results: 34 passed, 0 failed (wf-usage)

    Test verification: grep found "PASS: U06 md co bang wall" in output (matches "PASS: U06 md co bang wall theo vai tro")

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-14T09:14:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-14T09:16:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-14T09:18:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-14T09:20:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-14T09:22:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

- E2 — pass trên cả HEAD lẫn baseline (non-discriminating): lệnh suite plugins (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`) xanh trên cả cây hiện tại lẫn diffBase, nên tự thân chưa chứng minh được hành vi mới của vòng này. Cần viết thêm case assert đúng hành vi mới (đổi khuôn writer/reader) hoặc xác nhận đây là regression-guard có chủ đích cho suite plugins nói chung, không cần viết lại.

## Variance

none — every multi-run eval is uniform.

## Iterations

Round 1: triage_failed (phân loại phạm vi không chạy được) — verdict PENDING-JUDGMENT, 13 mục eval trả về đủ nhưng toàn bộ 13 finding rơi ngoài hợp đồng chờ người soát, không mục nào máy tự sửa. Returned to implementation: fix 8 finding thật (94aa7aec), rồi 5 finding thêm ở round 1b — config.yaml hỏng YAML là nặng nhất (85d3deae), rồi ĐỔI KHUÔN bên viết truyền KẾT QUẢ / bên đọc thôi khớp glob (1b73b462, STOP-PATCHING).