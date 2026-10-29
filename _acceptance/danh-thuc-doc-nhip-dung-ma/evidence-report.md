---
schema_version: 2
feature_slug: danh-thuc-doc-nhip-dung-ma
verdict: REJECT
failed_evals: ["E1","E2","E3","E4","E5","E6","E7","E8","E9"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c06209442bae5aabf9842b894885920d0f26d7f0
human_signoff:
---

# Evidence Report: danh-thuc-doc-nhip-dung-ma

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
| E9 | AC-9 | test | FAIL |
| E9b | AC-9 | test | PASS |

## Evidence

Chín eval E1–E9 cùng đo qua MỘT lệnh gom (suite `tests/dieu-phoi/**/*.test.mjs` lọc theo dòng TC1-). Lệnh ấy thoát khác 0 nên cả chín eval bị tính chưa đạt. Đoạn đuôi đầu ra mà bước chụp giữ lại bị cắt trước khi tới dòng `not ok` đầu tiên, nên báo cáo này KHÔNG nêu được ca nào đỏ; không suy đoán thêm.

- eval: E1
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E1-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (đoạn đuôi bị cắt ở cuối bước chụp; không thấy dòng not ok trong phần giữ lại)

- eval: E2
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E2-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (cùng lệnh gom với E1; đoạn đuôi bị cắt)

- eval: E3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E3-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (cùng lệnh gom với E1; đoạn đuôi bị cắt)

- eval: E4
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E4-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    (cùng lệnh gom với E1; đoạn đuôi giữ lại không chứa dòng nào của TC1-04)

- eval: E5
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E5-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 ...
    (cùng lệnh gom với E1; đoạn đuôi bị cắt)

- eval: E6
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E6-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    (cùng lệnh gom với E1; đoạn đuôi giữ lại không chứa dòng nào của TC1-06)

- eval: E7
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E7-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    (cùng lệnh gom với E1; đoạn đuôi giữ lại không chứa dòng nào của TC1-07)

- eval: E8
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E8-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    (cùng lệnh gom với E1; đoạn đuôi giữ lại không chứa dòng nào của TC1-08)
    Ghi nhận thêm: evals.yaml của E8 vẫn khai «in số dòng --phien <mã phiên này>: 6», trong khi ca hiện tại (sau commit c0620944) đếm và in 7.

- eval: E9
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-29T05:10:14Z
  output: |
    (cùng lệnh gom với E1; dòng tổng kết «# fail» không nằm trong phần đuôi giữ lại nên không xác nhận được «# fail 0»)

- eval: E9b
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1_hai_moi_truong
  verified_at: 2026-10-29T05:10:14Z
  output: |
    hai-moi-truong: XANH — cùng tập dòng ok

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r4
  exit_code: 1
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_hooks_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r4
  exit_code: 1
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_workflows_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_scripts_product_map_mjs_root_check-r4
  exit_code: 1
  verified_at: 2026-10-29T05:10:14Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r4
  exit_code: 0
  verified_at: 2026-10-29T05:10:14Z

Đầu ra đáng chú ý của các lệnh suite đỏ (lệnh không gắn eval nào):
- mjs:1/3 kết thúc bằng «Results: 38 passed, 1 failed»; phần đuôi giữ lại chỉ có dòng PASS nên chưa nêu được tên ca đỏ.
- vung:1 báo hai ca đỏ: «P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)» và «P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)».
- product-map --check báo «PRODUCT-MAP.md lệch với hồ sơ xưởng» và «LO-TRINH.html lệch với tệp ý định và hồ sơ» (chạy lại `node scripts/product-map.mjs --root .` là lệnh máy gợi ý). Hai ca vung:1 và lệnh này cùng chạm bản đồ sản phẩm, nhưng báo cáo chưa chứng minh chúng chung một nguyên nhân.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 3).

none — khong co eval nao khong-phan-biet duoc liet ke; lenh suite xanh-ca-hai-phia la regression-guard binh thuong.

Baseline khong do: moi eval E1–E9b va 11 lenh suite hoi quy (n-a, round nay khong do baseline moi).

## Variance

none — every multi-run eval is uniform (moi eval round nay chay mot lan, deterministic)

## Iterations

Round 1: REJECT — E9b chập chờn ca cũ dưới tải; AC-8 đo chuỗi thay vì quan hệ theo từng dòng. Returned to implementation.
Round 2: REJECT chỉ vì suite (P179 sổ known-limits thiếu hàng; LT-99-mau ENOTEMPTY); các eval của hợp đồng đều xanh. Returned to implementation: thêm 7 hàng sổ known-limits, dọn thư mục tạm có thử lại.
Round 3: PASS — 10 eval mang từ round 2 (delta không chạm paths), 11 lệnh suite xanh ở sha e208665fba6bbf3069b2d079c64448b8010ac180. Ký 2026-10-26; ghim lại lần 1 ở sha 34a8e97654508ecc6a92e70972bc8dc8752dd19e sau gộp origin/main (#413 design-gate): 11 lệnh suite xanh, 10/10 eval máy đạt.
Round 4: REJECT — sau gộp origin/main 979620ae (#440 thêm bước 6 «hoi» vào tiep-tuc.md) làn ghim lại đỏ ở TC1-08 (commit 30bde32e); commit c0620944 sửa ca TC1-08 đếm 7 dòng và nói rõ mã app ở bước 6, rồi chấm lại. Kết quả lượt này: lệnh gom E1–E9 vẫn thoát khác 0 (đoạn đuôi đầu ra không cho biết ca đỏ); suite mjs:1/3 còn 1 ca đỏ chưa rõ tên; vung:1 đỏ P122 và P126; product-map --check báo PRODUCT-MAP.md và LO-TRINH.html lệch. E9b xanh; 8 lệnh suite còn lại xanh. Returned to implementation: lấy đầu ra đầy đủ của lệnh gom để biết chính xác ca đỏ, làm mới bản đồ sản phẩm, rồi chấm lại.
