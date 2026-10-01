---
schema_version: 2
feature_slug: nghi-van-mang-co-qua-han
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1b98fdb1d9d9066bb35bdb936c0f7599e481da68
human_signoff:
---

# Evidence Report: nghi-van-mang-co-qua-han

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nghi-van-mang-co-qua-han-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nvmcqh_rt13
  verified_at: 2026-10-01T03:13:01Z
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; cờ ⇔ điều kiện (đúng mọi ngày chạy); 34 file chứa "signed-off" đều có ca thật hoặc khai gạch; hai chiều đỏ tiêm vào đầu vào của chính phép so
    iii: 14 hồ sơ quá hạn trên cây thật (phep-kiem-sach-do-theo-vung, dac-ta-ux-vat-hoa-cau-truc, design-pass-nac-khong-dong-bo, lan-may-song-qua-bo-phan-loai, ra-co-ten-lam-va-trao, ho-so-khep-thoi-hoi, cong-dang-co-cua, nhan-trang-thai-va-reality, the-xep-nham-o-se-lam, baseline-127-tin-hieu-phan-biet, khuon-rang-dung-chung, nhanh-chinh-khong-ten-main, start-bang-dieu-khien, lenh-in-ra-phai-bam-duoc)
    iii-b: 10 fixture — park quá hạn ✓ · park chưa hạn ✗ · kill quá hạn ✓ · archived quá hạn ✓ · archived chưa hạn ✗ · release quá hạn ✓ · release chưa hạn ✗ · nghỉ quá hạn ✓ · nghỉ chưa hạn ✗ · nghỉ không hồ sơ cơ hội ✗ · mutant ×4 bắt: pk-qua · ar-qua · rl-qua · ng-qua

- eval: E2
  run_id: minted-nghi-van-mang-co-qua-han-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.nvmcqh_ho_so_nghi
  verified_at: 2026-10-01T03:13:01Z
  output: |
    Results: 38 passed, 0 failed (ho-so-nghi)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nghi-van-mang-co-qua-han-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-01T03:13:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

E2 (AC-2, node tests/scripts/ho-so-nghi.test.mjs) xanh trên cả bản nhánh lẫn bản cũ — nó là lưới hồi quy có chủ ý cho ô da-nghi, cờ nghi-thieu-ve, nghi-chua-ky và cửa veto của hồ sơ nghỉ (AC-2 đòi các hành vi này KHÔNG đổi), không chứng minh hành vi mới. E1 đỏ trên bản cũ (có phân biệt).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2 đều đạt; mười lệnh suite hồi quy đều xanh. Verdict PASS.

### Re-pin lần 1 — 2026-10-01, do chiến dịch ghim lại theo mốc 2.20.0
run_id: repin-20261001T175432Z-63647
sha: 1b98fdb1d9d9066bb35bdb936c0f7599e481da68 · suites: 10 lệnh exit 0 · evals: 2/2 eval máy đạt kỳ vọng
