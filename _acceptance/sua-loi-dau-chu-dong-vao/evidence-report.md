---
schema_version: 2
feature_slug: sua-loi-dau-chu-dong-vao
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 007191b8d43f93742d6cd68d78b83aad9cb453c6
human_signoff: Phan Le Manh 2026-11-03
---

# Evidence Report: sua-loi-dau-chu-dong-vao

Vòng 2. Sau nhát sửa S4-r1 (fixture SD-6 dùng machine-cleared thay chữ trạng thái ký người), E1..E6 và mọi lệnh suite chạy lại đều xanh; E7..E10 mang từ vòng 1 vì delta không chạm đường dẫn của chúng.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-loi-dau-chu-dong-vao-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T01:13:52Z
  output: |
    (lệnh chung với E2..E6: bộ SD-1..SD-6 của tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs, lệnh buộc đúng 6 dòng «ok … - SD-»)
    # fail 0

- eval: E2
  run_id: minted-sua-loi-dau-chu-dong-vao-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T01:13:52Z
  output: |
    (lệnh chung với E1, E3..E6)
    # fail 0

- eval: E3
  run_id: minted-sua-loi-dau-chu-dong-vao-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T01:13:52Z
  output: |
    (lệnh chung với E1, E2, E4..E6)
    # fail 0

- eval: E4
  run_id: minted-sua-loi-dau-chu-dong-vao-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T01:13:52Z
  output: |
    (lệnh chung với E1..E3, E5, E6)
    # fail 0

- eval: E5
  run_id: minted-sua-loi-dau-chu-dong-vao-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T01:13:52Z
  output: |
    (lệnh chung với E1..E4, E6)
    # fail 0

- eval: E6
  run_id: minted-sua-loi-dau-chu-dong-vao-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_dieu_phoi
  verified_at: 2026-11-03T01:13:52Z
  output: |
    (lệnh chung với E1..E5)
    # fail 0

- eval: E7
  run_id: minted-sua-loi-dau-chu-dong-vao-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_s4_args
  verified_at: 2026-11-03T00:15:44Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-sua-loi-dau-chu-dong-vao-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_ui_tuan_tu
  verified_at: 2026-11-03T00:15:44Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-sua-loi-dau-chu-dong-vao-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sd_ui_tuan_tu
  verified_at: 2026-11-03T00:15:44Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-sua-loi-dau-chu-dong-vao-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e1
  verified_at: 2026-11-03T00:15:44Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-sua-loi-dau-chu-dong-vao-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-03T01:13:52Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1); field baseline cua tung block eval ghi n-a.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, theo round 1):
- E10 (AC-9): lệnh khoá có sẵn của hồ sơ pre-merge-doc-lib-theo-kit (bốn ca LK1). Đây là regression-guard có chủ ý cho AC-9 (vật mới không làm hỏng luật đọc «Known limits»), không phải bằng chứng cho hành vi mới.

Hội đồng chấm: không có eval judgment nào trong hợp đồng này (mọi eval là script), nên không có panel và không có mục chờ human_override.

## Variance

none — mọi eval nhiều lượt đều đồng nhất (không eval nào khai runs lớn hơn 1).

## Iterations

Round 1: REJECT — không eval nào đỏ; lệnh suite plugins vùng 3 đỏ ở ca RT13 (tệp test mới chứa chữ «signed-off» chưa khai trong BO-DOC-KHAI-GACH). Trả về thực thi.
Round 2: PASS — nhát sửa S4-r1 (fixture SD-6 dùng machine-cleared thay chữ trạng thái ký người) đưa suite plugins vùng 3 về xanh; E1..E6 và mọi lệnh suite chạy lại xanh; E7..E10 carry-forward từ round 1.

### Re-pin lần 1 — 2026-11-03, do đồng bộ main sau chữ ký (gộp #476)
run_id: repin-20261103T030301Z-31104
sha: 007191b8d43f93742d6cd68d78b83aad9cb453c6 · suites: 11 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng
