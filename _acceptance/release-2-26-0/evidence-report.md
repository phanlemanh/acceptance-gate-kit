---
schema_version: 2
feature_slug: release-2-26-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 325b60670fe48eb99a67a2a0f106bdb4d35d882f
human_signoff:
---

# Evidence Report: release-2-26-0

Round 2. Cả 15 eval xanh ở commit đang chấm. Hai eval đỏ của round 1 (E3c, E3e) xanh trở lại vì bản đồ sản phẩm đã được vẽ lại sau khi hồ sơ sang implemented.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-26-0-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-26-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-26-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-26-0-E3f-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-26-0-E3g-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-26-0-E3h-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: 25 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-26-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-26-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-26-0-E3i-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-26-0-E3j-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-26-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-26-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-09T09:41:14Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-26-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2260_cua_so
  verified_at: 2026-10-09T09:41:14Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-26-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2260_dd_giu
  verified_at: 2026-10-09T09:41:14Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-26-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:41:14Z
  output: |
    Results: all plugin tests passed

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi). Field baseline cua moi block ghi n-a.

Eval khong-phan-biet (xanh tren CA HEAD lan baseline round 1 — chung minh harness, khong chung minh feature; la regression-guard co chu y):

- E1, E2, E3j, E6 (cung lenh vung 3 cua suite plugins). P200 la ca moi cua moc nay nhung baseline van xanh; chieu do nam trong 5 dot bien cua chinh P200 chu khong phai o ket qua tong cua vung. Neu chi la guard thi giu.
- E3 (manh bash), E3f, E3g, E3h (ba manh mjs), E3b (hooks), E3i (vung 2), E3d (workflows): regression-guard thuong truc.
- E4 (cua so ho so duoc ky), E5 (diagram-design giu so 2.7.1): xanh ca hai phia vi baseline tinh theo moc c01e5bf2; chieu do cua chung nam trong chinh lenh (chay voi tap «x» / voi moc 1b98fdb1), da do khi mo ho so.

## Variance

none — every multi-run eval is uniform (moi eval chay 1 lan, deterministic; khong eval nao co pass_rate lech).

## Judgment

Khong co judgment item: ho so nay khong khai eval judgment, nen khong co hoi dong nao duoc de xuat va khong co human_override nao phai dien.

## Iterations

Round 1: E3c, E3e failed — PRODUCT-MAP.md cu so voi ho so xuong sau khi hop dong chuyen sang implemented (commit a8e0498d khong ve lai ban do sau commit mo ho so 8493dfa7); P122 va P126 do theo. Returned to implementation.
Round 2: ca 15 eval xanh o commit 325b6067 — ban do da ve lai o commit 6ca5dd0a (sua S4-r1), E3c va E3e xanh tro lai; khong eval nao do.
