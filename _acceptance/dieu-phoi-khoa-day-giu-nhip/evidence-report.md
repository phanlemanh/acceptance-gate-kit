---
schema_version: 2
feature_slug: dieu-phoi-khoa-day-giu-nhip
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1be36d83c2645a8ea67b54b4130939f60e5a67f6
human_signoff:
---

# Evidence Report: dieu-phoi-khoa-day-giu-nhip

Round 1. Cả sáu eval của hợp đồng (E1–E6) đều chạy và ra mã thoát 0. Verdict là REJECT vì hai lệnh suite hồi quy không gắn eval nào trả mã thoát khác 0: `tests/plugins/run-tests.sh --manh vung:1` (hai ca P122, P126) và `node scripts/product-map.mjs --root . --check` (PRODUCT-MAP.md và LO-TRINH.html lệch). `failed_evals` để rỗng vì không eval nào của hợp đồng đỏ. Chi tiết ở mục «Lệnh suite (hồi quy)» và `## Iterations`.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-13T09:32:18Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    (đuôi TAP dùng chung của một lệnh node --test cho E1–E6)

- eval: E2
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-13T09:32:18Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    (đuôi TAP dùng chung của một lệnh node --test cho E1–E6)

- eval: E3
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-13T09:32:18Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    (đuôi TAP dùng chung của một lệnh node --test cho E1–E6)

- eval: E4
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-13T09:32:18Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    (đuôi TAP dùng chung của một lệnh node --test cho E1–E6)

- eval: E5
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-13T09:32:18Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    (đuôi TAP dùng chung của một lệnh node --test cho E1–E6)

- eval: E6
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-13T09:32:18Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    (đuôi TAP dùng chung của một lệnh node --test cho E1–E6)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-10-13T09:32:18Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-dieu-phoi-khoa-day-giu-nhip-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-13T09:32:18Z

Hai lệnh suite không gắn eval trả mã thoát khác 0, và chúng là lý do của verdict REJECT:

- `tests/plugins/run-tests.sh --manh vung:1` báo hai ca đỏ: «P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)» và «P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)». Dòng tổng kết: «Results: 2 failed».
- `node scripts/product-map.mjs --root . --check` báo «PRODUCT-MAP.md lệch với hồ sơ xưởng» và «LO-TRINH.html lệch với tệp ý định và hồ sơ»; sửa bằng `node scripts/product-map.mjs --root .`. Hai ca P122 và P126 cùng chạm bản đồ sản phẩm nên rất có thể cùng gốc với lệnh này; đây là nhận định từ tên ca, chưa được máy chứng minh.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên bản HEAD lẫn baseline diffBase):

- Lệnh `node --test "tests/dieu-phoi/**/*.test.mjs"` (gộp E1–E6) ra baseline: green. Cả sáu eval của lệnh này không chứng minh được riêng từng cái là đỏ trên mã cũ ở mức baseline; chiều đỏ của từng AC phải dựa vào các ca «-do» nằm trong chính bộ test (DP10-01-do, DP8-09-do, DP3-10-do, DP10-05-do) chứ không dựa vào baseline. Cần người xác nhận đây là mức phân biệt chấp nhận được.

Baseline không đo: các lệnh suite hồi quy ra baseline n-a theo kết quả máy; không có lý do riêng nào được truyền kèm.

## Variance

none — every multi-run eval is uniform (mọi eval chạy runs: 1, deterministic).

## Iterations

Round 1: không eval hợp đồng nào đỏ (E1–E6 đều qua); REJECT vì hai lệnh suite hồi quy không gắn eval đỏ — plugins vung:1 (P122, P126) và product-map --check (PRODUCT-MAP.md, LO-TRINH.html lệch). Returned to implementation.
