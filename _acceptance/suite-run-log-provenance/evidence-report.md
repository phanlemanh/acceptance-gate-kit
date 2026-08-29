---
schema_version: 2
feature_slug: suite-run-log-provenance
verdict: REJECT
failed_evals: []
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 46f828e3289bc84789c046be7e62fa2edab88b97
human_signoff: 
---

# Evidence Report: suite-run-log-provenance

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-2 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-suite-run-log-provenance-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_suite_case
  verified_at: 2026-08-29T09:00:00Z
  output: |
    PASS: suite-case: W03 suite: dong mang exit + cmd that
    PASS: suite-case: W03 synthesize cung nhan id cua lenh suite (log va report phai khop)
    Results: chan suite-case passed

- eval: E2
  run_id: minted-suite-run-log-provenance-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_hai_chieu
  verified_at: 2026-08-29T09:01:00Z
  output: |
    PASS: ban sao lanh -> exit 0
    PASS: go va -> do dung ca
    Results: chan hai-chieu passed

- eval: E3
  run_id: minted-suite-run-log-provenance-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_va_cham_ten
  verified_at: 2026-08-29T09:02:00Z
  output: |
    PASS: chieu do [khac co]: hai lenh dung chung mot ma
    PASS: chieu do [trung 40 ky tu dau]: hai lenh dung chung mot ma
    Results: chan va-cham-ten passed

- eval: E4
  run_id: minted-suite-run-log-provenance-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_ket_qua_rieng
  verified_at: 2026-08-29T09:03:00Z
  output: |
    PASS: ket-qua-rieng: W31 cannotRun -> exit_code null + co cannot_run
    PASS: ket-qua-rieng: W04 dong suite giu exit RIENG cua no, khong an theo eval hong
    Results: chan ket-qua-rieng passed

- eval: E5
  run_id: minted-suite-run-log-provenance-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_thu_tu
  verified_at: 2026-08-29T09:04:00Z
  output: |
    PASS: thu-tu: W30 ten suy tu lenh: pnpm build && pnpm typecheck
    PASS: thu-tu: W30 so assert = so o trong ma tran truc A (5 o o day + 1 o gop lenh o W32)
    Results: chan thu-tu passed

- eval: E6
  run_id: minted-suite-run-log-provenance-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_day_khep
  verified_at: 2026-08-29T09:05:00Z
  output: |
    PASS: day-khep: W33 de bai chua dung MOT khoi luat mint
    PASS: day-khep: W33 de bai mang ma suite that
    Results: chan day-khep passed

- eval: E7
  run_id: minted-suite-run-log-provenance-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.srlp_rang_khong_hoi_quy
  verified_at: 2026-08-29T09:06:00Z
  output: |
    PASS: khong-hoi-quy: W32 so dong = so eval
    PASS: dong eval khong doi hinh dang (cmd,evalId,exit_code,round,run_id,ts)
    Results: chan khong-hoi-quy passed

### Lệnh suite / regression-guard (không gắn AC cụ thể)

- cmd: bash tests/scripts/run-tests.sh
  exit_code: 0
  baseline: n-a
  verified_at: 2026-08-29T09:07:00Z
  output: |
    PASS: ARM13-mut

    Results: 751 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  exit_code: 0
  baseline: n-a
  verified_at: 2026-08-29T09:08:00Z
  output: |
    PASS: V06

    Results: 60 passed, 0 failed

- cmd: bash tests/plugins/run-tests.sh
  exit_code: 0
  baseline: n-a
  verified_at: 2026-08-29T09:09:00Z
  output: |
    PASS: ca lan may qua bo phan loai — LM8b (ho so lan-may-song-qua-bo-phan-loai)

    Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  exit_code: 0
  baseline: n-a
  verified_at: 2026-08-29T09:10:00Z
  output: |
    Results: 44 passed, 0 failed (skill-claims)

    Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  exit_code: 0
  baseline: n-a
  verified_at: 2026-08-29T09:11:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.
    EXIT_CODE: 0

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — không có eval nào chạy nhiều lần (không có eval mang field runs > 1)

## Iterations

Round 1: E1–E7 và bốn lệnh suite hồi quy đều xanh (exit 0, passes 1/1), nhưng scope-triage vừa chấm phát hiện AC-2 và AC-3 chưa thực sự được chứng qua eval — chân `thu-tu` không đảo thứ tự lệnh (AC-2) và bộ đúc mã bỏ qua lưới chống va chạm khi verifier tự khai run_id (AC-3); xem review-findings.md mục «Trong hợp đồng». REJECT, trả về implementation.
