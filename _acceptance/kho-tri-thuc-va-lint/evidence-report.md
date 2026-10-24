---
schema_version: 2
feature_slug: kho-tri-thuc-va-lint
verdict: REJECT
failed_evals: [E1, E2, E3, E4, E5, E6, E7, E8, E9b, E10b]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8ff7695b657ff88e4cc36103fb0beb9a9153c1a8
human_signoff:
---

# Evidence Report: kho-tri-thuc-va-lint

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |
| E8 | AC-8 | test | FAIL |
| E9 | AC-9 | script | PASS |
| E9b | AC-9 | test | FAIL |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | FAIL |

## Evidence

- eval: E1
  run_id: minted-kho-tri-thuc-va-lint-E1-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: đuôi đầu ra không chứa dòng của ca KT-1; lệnh chạy chung cho E1-E8 và E9b thoát khác 0 nên máy tính cả nhóm vào failed_evals.
  output: |
    Results: 1 ca đỏ
    (đuôi đầu ra chỉ còn từ ca KT-2 trở đi, không thấy dòng PASS hay FAIL của KT-1)

- eval: E2
  run_id: minted-kho-tri-thuc-va-lint-E2-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: dòng PASS của ca này có trong đuôi, nhưng lệnh chung thoát khác 0 (ca KT-8 đỏ) nên máy tính cả nhóm vào failed_evals.
  output: |
    PASS: KT-2 — đạt

- eval: E3
  run_id: minted-kho-tri-thuc-va-lint-E3-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: dòng PASS của ca này có trong đuôi, nhưng lệnh chung thoát khác 0 (ca KT-8 đỏ) nên máy tính cả nhóm vào failed_evals.
  output: |
    KT-3-do: khuôn tiêm → 3 dòng trang-thieu-nguon
    PASS: KT-3 — đạt

- eval: E4
  run_id: minted-kho-tri-thuc-va-lint-E4-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: dòng PASS của ca này có trong đuôi, nhưng lệnh chung thoát khác 0 (ca KT-8 đỏ) nên máy tính cả nhóm vào failed_evals.
  output: |
    KT-4 ma trận: 11 hàng
      1. trang thiếu khoá nguon → 1|lỗi: [trang-thieu-nguon] wiki/chu-de/chu-de.md: thiếu khoá nguon
      5. raw sửa một byte → 1|lỗi: [raw-bi-sua] raw/2026-10-24-vi-du/ghi-chu.md: băm khác dòng trong nguon.md
      8. mã không có trang (--pham-vi) → 1|lỗi: [ma-khong-co-trang] docs/plans/pham-vi-tri-thuc-2410.md: mã A1 của đợt tri-thuc-2410 không nằm trong ma của trang nào
      11. raw trong kho công khai → 1|lỗi: [raw-trong-kho-cong-khai] raw/2026-10-24-vi-du: kho công khai không giữ tài liệu thô — chuyển sang kho riêng (khai tri_thuc.kho)
    PASS: KT-4 — đạt

- eval: E5
  run_id: minted-kho-tri-thuc-va-lint-E5-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: dòng PASS của ca này có trong đuôi, nhưng lệnh chung thoát khác 0 (ca KT-8 đỏ) nên máy tính cả nhóm vào failed_evals.
  output: |
    KT-5: 11 mutant × 11 hàng
      mutant 1: X..........
      mutant 6: .....X.....
      mutant 11: ..........X
    PASS: KT-5 — đạt

- eval: E6
  run_id: minted-kho-tri-thuc-va-lint-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: dòng PASS của ca này có trong đuôi, nhưng lệnh chung thoát khác 0 (ca KT-8 đỏ) nên máy tính cả nhóm vào failed_evals.
  output: |
    PASS: KT-6 — đạt

- eval: E7
  run_id: minted-kho-tri-thuc-va-lint-E7-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: dòng PASS của ca này có trong đuôi, nhưng lệnh chung thoát khác 0 (ca KT-8 đỏ) nên máy tính cả nhóm vào failed_evals.
  output: |
    KT-7 ma trận: 5 hàng
    PASS: KT-7 — đạt

- eval: E8
  run_id: minted-kho-tri-thuc-va-lint-E8-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  output: |
    KT-8-mutant: bên đọc cũ nạp mô-đun tri thức → đỏ
    FAIL: KT-8 — đối chứng dương: bộ máy đủ tệp không xanh — 1
    PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node <M>/scripts/product-map.mjs --root .
    LO-TRINH.html lệch với tệp ý đị

- eval: E9
  run_id: minted-kho-tri-thuc-va-lint-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-10-24T04:08:24Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · dieu-phoi cung so · road-map cung so · tri-thuc cung so · GUIDE dan xuat · muc mo ta cua chinh so do (8 dot bien, mot loi thoat)

- eval: E9b
  run_id: minted-kho-tri-thuc-va-lint-E9b-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T04:08:24Z
  ghi_chu: dòng PASS của ca này có trong đuôi, nhưng lệnh chung thoát khác 0 (ca KT-8 đỏ) nên máy tính cả nhóm vào failed_evals.
  output: |
    PASS: KT-9 — đạt
    Results: 1 ca đỏ

- eval: E10
  run_id: minted-kho-tri-thuc-va-lint-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-24T04:08:24Z
  output: |
    Results: 291 passed, 0 failed (lo-trinh)

- eval: E10b
  run_id: minted-kho-tri-thuc-va-lint-E10b-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-10-24T04:08:24Z
  output: |
    FAIL: P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)
    FAIL: P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 2 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kho-tri-thuc-va-lint-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kho-tri-thuc-va-lint-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-10-24T04:08:24Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kho-tri-thuc-va-lint-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-24T04:08:24Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Baseline khong do:
- node tests/scripts/kho-tri-thuc-va-lint.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash -c 'set -o pipefail; ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh | grep -F P200': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/scripts/lo-trinh.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không phân biệt (xanh cả trên HEAD lẫn baseline): không có eval nào bị ghi nhận, nhưng danh sách này không đo được ở round này vì baseline bị chặn hạ tầng — không có căn cứ để nói eval nào có phân biệt hay không.

Lệnh fail không gắn eval: `bash tests/scripts/run-tests.sh --manh mjs:3/3` (đuôi hiện «Results: 35 passed, 1 failed», ca đỏ không nằm trong đuôi), `bash tests/plugins/run-tests.sh --manh vung:1` (đỏ ở P122 và P126, cùng hai ca với E10b), `node scripts/product-map.mjs --root . --check` (báo PRODUCT-MAP.md và LO-TRINH.html lệch với hồ sơ — cùng thông điệp với ca KT-8 của E8).

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, không có eval ngẫu nhiên).

## Iterations

Round 1: E1, E2, E3, E4, E5, E6, E7, E8, E9b, E10b failed — nhóm E1-E8 và E9b dùng chung một lệnh kiểm; đuôi đầu ra cho thấy ca KT-8 đỏ ở đối chứng dương (PRODUCT-MAP.md và LO-TRINH.html của cây lệch với hồ sơ xưởng), các ca KT-2 đến KT-7 và KT-9 in PASS nhưng máy tính cả nhóm đỏ theo mã thoát chung, KT-1 không nằm trong đuôi; E10b đỏ ở P122 và P126 (P126 nói về PRODUCT-MAP.md và --check, cùng nguồn nghi vấn với KT-8 nhưng chưa kiểm chứng riêng). Returned to implementation.
