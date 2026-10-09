---
schema_version: 2
feature_slug: release-2-26-0
verdict: REJECT
failed_evals: [E3c, E3e]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8291bf639d4b385592e13906e7a677e4556cf908
human_signoff:
---

# Evidence Report: release-2-26-0

Round 1. Hai eval AC-3 do (E3c, E3e), cung MOT goc: `PRODUCT-MAP.md` da cu so voi ho so xuong o commit dang cham. Cac eval con lai xanh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | FAIL |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | FAIL |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-26-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-26-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-26-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-26-0-E3f-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-26-0-E3g-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-26-0-E3h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: 25 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-26-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-26-0-E3c-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-09T09:13:26Z
  output: |
    FAIL: P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)
    FAIL: P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)
    Results: 2 failed
  note: Ca hai ca do deu dung chung mot assert — chay `product-map.mjs --check` tren cay hien tai ma ban do da lech (P122 dong cuoi, P126 ca doi chung duong). Cung goc voi E3e.

- eval: E3i
  run_id: minted-release-2-26-0-E3i-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-26-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-26-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-26-0-E3e-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-09T09:13:26Z
  output: |
    PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-26-0-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2260_cua_so
  verified_at: 2026-10-09T09:13:26Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-26-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2260_dd_giu
  verified_at: 2026-10-09T09:13:26Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-26-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-09T09:13:26Z
  output: |
    Results: all plugin tests passed

## Known limits

## Ngoài hợp đồng

## Analyst

Eval khong-phan-biet (xanh tren CA HEAD lan baseline — chung minh harness, khong chung minh feature; la regression-guard co chu y, hoac can viet lai de assert hanh vi moi):

- E1, E2, E3j, E6 (cung lenh vung 3 cua suite plugins). Luu y: P200 la ca moi cua moc nay nhung baseline van xanh; ngoai le nay nen duoc nguoi doc Cong 2 xem — neu co chu y chi la guard, giu; neu muon chung minh P200 bat duoc moc cu thi chieu do nam trong 5 dot bien cua chinh P200 chu khong phai o ket qua tong cua vung.
- E3 (mảnh bash), E3f, E3g, E3h (ba mảnh mjs), E3b (hooks), E3i (vùng 2), E3d (workflows): regression-guard thuong truc.
- E4 (cua so ho so duoc ky), E5 (diagram-design giu so 2.7.1): xanh ca hai phia vi baseline cua hai eval nay tinh theo moc c01e5bf2; chieu do cua chung nam trong chinh lenh (chay voi tap «x» / voi moc 1b98fdb1) da do khi mo ho so.

E3c va E3e: xanh tren baseline nhung DO tren HEAD — nghia la day la HOI QUY do chinh ho so nay dua vao, khong phai eval khong-phan-biet.

Nguyen nhan chung cua hai eval do: commit mo ho so 8493dfa7 ve lai `PRODUCT-MAP.md` khi hop dong con `status: draft`; commit a8e0498d doi hop dong sang `implemented` ma khong ve lai ban do, nen viec release-2-26-0 doi o tu «Cho duyet pham vi» sang «Dang lam» trong ban ve lai nhung ban da commit chua doi. Lenh `node scripts/product-map.mjs --root .` o cay hien tai se ve lai dung ban do; viec ve lai la phan sua cua vong tiep theo (khong thuoc vai tro cham).

## Variance

none — every multi-run eval is uniform (moi eval chay 1 lan, deterministic; khong eval nao co pass_rate lech).

## Judgment

Khong co judgment item: ho so nay khong khai eval judgment, nen khong co hoi dong nao duoc de xuat va khong co human_override nao phai dien.

## Iterations

Round 1: E3c, E3e failed — PRODUCT-MAP.md cu so voi ho so xuong sau khi hop dong chuyen sang implemented (commit a8e0498d khong ve lai ban do sau commit mo ho so 8493dfa7); P122 va P126 do theo. Returned to implementation.
