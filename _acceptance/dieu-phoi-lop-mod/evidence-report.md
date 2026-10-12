---
schema_version: 2
feature_slug: dieu-phoi-lop-mod
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e043c06f3347db65f3c982a357b054c1991ac1f
human_signoff: manh 2026-10-11
---

# Evidence Report: dieu-phoi-lop-mod

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-dieu-phoi-lop-mod-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp6
  verified_at: 2026-10-11T10:31:47Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-dieu-phoi-lop-mod-E2-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp6
  verified_at: 2026-10-11T10:31:47Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-dieu-phoi-lop-mod-E3-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp6
  verified_at: 2026-10-11T10:31:47Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-dieu-phoi-lop-mod-E4-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp6
  verified_at: 2026-10-11T10:31:47Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-dieu-phoi-lop-mod-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp6
  verified_at: 2026-10-11T10:31:47Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-dieu-phoi-lop-mod-E6-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp6
  verified_at: 2026-10-11T10:31:47Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-dieu-phoi-lop-mod-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp6
  verified_at: 2026-10-11T10:31:47Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

### Judgment (E8)

Panel giu nguyen tu round 6 — inputs khong doi, khong cham lai; rationale xem round do.

- eval: E8
  judged_by: judge panel (carried from round 6, fresh-context)
  verdict: PASS
  rationale: Panel giu nguyen tu round 6 — inputs khong doi, khong cham lai; rationale tung judge xem round 6.
  votes:
    - domain-correctness: PASS (r6)
    - operational-feasibility: PASS (r6)
    - spec-alignment: PASS (r6)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_hooks_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dieu-phoi-lop-mod-SUITE-bash_tests_workflows_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-dieu-phoi-lop-mod-SUITE-node_scripts_product_map_mjs_root_check-r7
  exit_code: 0
  verified_at: 2026-10-11T11:40:43Z

## Known limits

## Ngoài hợp đồng

## Analyst

Carried tu round 6 — baseline khong do lai round nay. Field baseline cua tung eval ghi n-a (round nay khong do).

Eval khong-phan-biet mang tu luot baseline round 6 (lenh gop `node --test` tren tests/dieu-phoi, cac ca DP1..DP7): E1, E2, E3, E4, E5, E6, E7. Danh sach nay chua do lai o round 7; nguoi doc Cong 2 can nhac viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y. Cac lenh suite xanh o ca hai phia la regression-guard binh thuong, khong liet ke.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 6: tien kiem P179 tra lai — thieu dong so known-limits cua ho so (commit a34b55a0 them 29 dong so); E1-E7 va hoi dong E8 da chay xanh o round nay.
Round 7: PASS — chay lai 10 lenh suite o HEAD a34b55a0; E1-E8 carry-forward tu round 6 vi delta khong cham paths cua eval.

### Re-pin lần 1 — 2026-10-11, do gộp main có vá gate-card #311 và DP4 #312 (181cdad1)
run_id: repin-20261011T124817Z-61441
sha: 7215f806ae2f653095ddf34c7a010774ec95c874 · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths) · AC không có chốt máy: AC-8

### Re-pin lần 2 — 2026-10-11, do gộp main có #313 (56015d2b)
run_id: repin-20261011T133747Z-29663
sha: a258d6b2a5af0888090772f349cb7e510d8df62f · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths) · AC không có chốt máy: AC-8

### Re-pin lần 3 — 2026-10-12, do chiến dịch ghim lại 2.27.0 — 22 hồ sơ hoá cũ theo paths so v2.26.0, sau chữ ký mốc (lượt làn thứ hai)
run_id: repin-20261012T065455Z-55784
sha: 5e043c06f3347db65f3c982a357b054c1991ac1f · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths) · AC không có chốt máy: AC-8
