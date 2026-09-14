---
schema_version: 2
feature_slug: khoi-tim-loi-tra-phi-theo-vat
verdict: PENDING-JUDGMENT
triage_failed: true
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 94aa7aec71189e772cc5d31238235935b22cfc89
human_signoff:
---

# Evidence Report: khoi-tim-loi-tra-phi-theo-vat

⚠ phân loại phạm vi KHÔNG chạy được — không lỗi nào được máy tự sửa, danh sách đầy đủ nằm trong review-findings.md, người xem lại toàn bộ trước khi ký.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6a | AC-6 | script | PASS |
| E6b | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_w40_triage_truoc_refute
  verified_at: 2026-09-14T03:00:00Z
  output: |
    PASS: W44c nonDiscriminating chua E1/E2 (baseline da duoc doi truoc khi tinh)

    Results: 491 passed, 0 failed (acceptance-verify)

- eval: E2
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-14T03:02:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E3
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_vung_vat_s4args
  verified_at: 2026-09-14T03:04:00Z
  output: |
    PASS: VV6b đối chứng dương: diff toàn tài liệu → vùng vật rỗng nhưng VẪN sinh args (hợp lệ)

    Results: 10 passed, 0 failed (s4-args-vung-vat)

- eval: E4
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_w41_vung_vat
  verified_at: 2026-09-14T03:06:00Z
  output: |
    PASS: W44c nonDiscriminating chua E1/E2 (baseline da duoc doi truoc khi tinh)

    Results: 491 passed, 0 failed (acceptance-verify)

- eval: E5
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_vung_vat_mutants
  verified_at: 2026-09-14T03:08:00Z
  output: |
    VVM2 mutant (loc bao gom) NUOT finding lien-file — rang song

    Results: 8 passed, 0 failed (vung-vat-mutants)

- eval: E6a
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6a-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_w42_w43_finding_so
  verified_at: 2026-09-14T03:10:00Z
  output: |
    W44b T7: baseline NEM LOI -> khong giet luot, baseline n-a
      PASS: W44b verdict van la REJECT (khong BLOCKED vi baseline)
    Results: 491 passed, 0 failed (acceptance-verify)

- eval: E6b
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_carry_plan_dv10
  verified_at: 2026-09-14T03:12:00Z
  output: |
      PASS: DV10 duong doc-cu: so khong co dong finding -> carriedFindings rong, khong loi

    Results: 18 passed, 0 failed

- eval: E7
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_w44_baseline_roi_gang
  verified_at: 2026-09-14T03:14:00Z
  output: |
      PASS: W44c nonDiscriminating chua E1/E2 (baseline da duoc doi truoc khi tinh)

    Results: 491 passed, 0 failed (acceptance-verify)

- eval: E8
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ktl_wf_usage_u06
  verified_at: 2026-09-14T03:16:00Z
  output: |
      PASS: U06d khong agent nao bi dem thieu thoi gian

    Results: 31 passed, 0 failed (wf-usage)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-14T03:18:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-14T03:19:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-14T03:20:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-14T03:21:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

- E2 (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`) — xanh trên CẢ HEAD lẫn baseline (baseline: green), tức không phân biệt. Cần viết lại để assert hành vi mới của vòng này (M UTANT-6 / doc_manifest fail-loud), hoặc xác nhận đây là regression-guard có chủ ý rồi ghi rõ trong tên case.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bước phân loại phạm vi (scope-triage) không chạy được — máy không xếp được finding nào vào trong/ngoài hợp đồng nên không tự sửa gì; toàn bộ 14 finding (13 ngoài hợp đồng + 1 chưa phân loại) chuyển sang review-findings.md cho người quyết ở Cổng Bằng chứng.