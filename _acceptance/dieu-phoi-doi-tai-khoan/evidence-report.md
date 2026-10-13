---
schema_version: 2
feature_slug: dieu-phoi-doi-tai-khoan
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dec146af99c8469990455fdb947e6bb52be10543
human_signoff: manh 2026-10-11
---

# Evidence Report: dieu-phoi-doi-tai-khoan

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | script | PASS |
| E13 | AC-13 | script | PASS |
| E13b | AC-13 | test | PASS |
| E14 | AC-14 | test | PASS |
| E14b | AC-14 | test | PASS |
| E14c | AC-14 | script | PASS |
| E14d | AC-14 | judgment | PASS |
| E15 | AC-15 | test | PASS |

## Evidence

Các eval E1–E11, E13b, E14, E15 cùng chạy qua MỘT lệnh node --test gộp (bộ tests/dieu-phoi, lọc bằng grep); phần output dưới đây là đuôi in ra của lần chạy gộp đó, dùng chung cho các khối của chúng. E12 và E13 dùng chung một lần chạy kiem-mod.mjs.

- eval: E1
  run_id: minted-dieu-phoi-doi-tai-khoan-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E2
  run_id: minted-dieu-phoi-doi-tai-khoan-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E3
  run_id: minted-dieu-phoi-doi-tai-khoan-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E4
  run_id: minted-dieu-phoi-doi-tai-khoan-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E5
  run_id: minted-dieu-phoi-doi-tai-khoan-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E6
  run_id: minted-dieu-phoi-doi-tai-khoan-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E7
  run_id: minted-dieu-phoi-doi-tai-khoan-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E8
  run_id: minted-dieu-phoi-doi-tai-khoan-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E9
  run_id: minted-dieu-phoi-doi-tai-khoan-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E10
  run_id: minted-dieu-phoi-doi-tai-khoan-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E11
  run_id: minted-dieu-phoi-doi-tai-khoan-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E12
  run_id: minted-dieu-phoi-doi-tai-khoan-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_mod
  verified_at: 2026-10-11T05:27:08Z
  output: |
    PASS: DP4-13-do phan-la · tệp phần ngoài bảng MOD-SU-KIEN: hooks/mod/la.ts

- eval: E13
  run_id: minted-dieu-phoi-doi-tai-khoan-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_mod
  verified_at: 2026-10-11T05:27:08Z
  output: |
    PASS: DP4-13-do phan-la · tệp phần ngoài bảng MOD-SU-KIEN: hooks/mod/la.ts

- eval: E13b
  run_id: minted-dieu-phoi-doi-tai-khoan-E13b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E14
  run_id: minted-dieu-phoi-doi-tai-khoan-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

- eval: E14b
  run_id: minted-dieu-phoi-doi-tai-khoan-E14b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_lb
  verified_at: 2026-10-11T05:27:08Z
  output: |
    PASS: [LB2] 16 file: 0 trần, 0 uat thiếu tiền tố, 163 lệnh có tiền tố ⊆ bảng; 16 đối chứng dương tiêm; giữ-gân 0; ba chèn → đỏ

- eval: E14c
  run_id: minted-dieu-phoi-doi-tai-khoan-E14c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.dieu_phoi_validate
  verified_at: 2026-10-11T05:27:08Z
  output: |
    PASS: DP1-01b-do bo-lop-hooks · exit 1 · báo cáo nêu hooks

- eval: E14d
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba góc nhìn của hội đồng cùng chấm thân ban-giao.md và tiep-tuc.md là đi đúng §4.3, §4.2 bước 1 và 6 cùng các chỗ chọn 7, 8, 10, 12 của design doc. CLI đặt pha trước mọi tin nhắn thợ, phiên không tự commit, đẩy hay chuyển pha, câu báo chủ kho là một câu kèm đường lùi CLI; tiep-tuc.md đọc mức dùng trước CLI, xử lý can_doc_han_muc và khuyen_cho đúng việc, và nhắn phiên cũ thay vì mở chip khi không đổi tài khoản.
  human_override:  # chi nguoi ghi
  panel (đề xuất PASS, mọi phiếu đồng thuận, không có ý kiến trái):
  - domain-correctness: PASS — ban-giao.md đi đúng §4.3 và các chỗ chọn 7, 8, 10, 12. CLI `ban-giao` chạy trước mọi tin nhắn thợ. Tin chỉ là lời nhắc phụ, lời nhắc chính qua hook nhịp. Thợ chỉ cần commit WIP, không cần đẩy nhánh (theo T10). Dãy đang chấm S4 được để chạy hết và xếp «đang xong». Bộ phát lịch tự dựng hồ sơ và chuyển pha. Phiên chỉ báo chủ kho nguyên văn `tin`, kèm `/dieu-phoi:tiep-tuc` và đường lùi CLI qua lõi đợt, sau khi đã nhắn thợ. Phần mở đầu cấm phiên tự commit, đẩy, chuyển pha hay quyết dãy nào xong. tiep-tuc.md đọc mức dùng (`get_usage` rồi `han-muc`) ở bước 0, trước CLI `tiep-tuc`, và dạng `--nhe` cũng có bước này. `can_doc_han_muc` thì làm lại bước 0 và 1 một lần. `khuyen_cho` thì báo chờ đặt lại và «không chuyển gì thêm». Việc mở chip chỉ theo hành động CLI trả về, và khi không đổi tài khoản mà phiên cũ còn trong thanh bên thì nhắn phiên cũ thay vì mở chip.
  - operational-feasibility: PASS — ban-giao.md đi đúng §4.3 và các chỗ chọn 7, 8, 10. CLI `ban-giao` đặt pha trước mọi tin nhắn. Phiên chỉ nhắn thợ (tin là phụ, hook nhịp là chính) và không tự commit hay đẩy. Bộ phát lịch dựng `ban-giao.json` và chuyển pha. Câu báo chủ kho là đúng một câu `tin`, kèm `/dieu-phoi:tiep-tuc` và đường lùi CLI. tiep-tuc.md đọc mức dùng ở bước 0, đứng trước CLI và áp cả cho `--nhe`. `can_doc_han_muc` được đọc lại và gọi lại một lần. `khuyen_cho` chỉ báo chờ, không chuyển pha. Chỗ chọn 12 (nhắn phiên cũ thay vì mở chip khi không đổi tài khoản) có đủ. Cả hai thân lệnh đều dặn "không tự suy dãy nào xong hay cần chip" và để CLI đổi pha.
  - spec-alignment: PASS — ban-giao.md đi đúng thứ tự §4.3 và các chỗ chọn 7, 8, 10. CLI `ban-giao` đặt pha và ngừng cấp lượt trước hết. Tin nhắn thợ được nêu là phụ, lời nhắc chính qua hook nhịp. Dãy đang chấm S4 để lượt chạy hết và xếp «đang xong». Bộ phát lịch dựng hồ sơ và chuyển pha. Phiên "không tự commit, đẩy hay chuyển pha thay ai, không tự quyết dãy nào xong". Câu báo chủ kho là một câu nguyên văn `tin` của `ban-giao-dung`, mang `/dieu-phoi:tiep-tuc` và đường lùi CLI `tiep-tuc` qua lõi đợt. tiep-tuc.md có bước 0 đọc mức dùng (`get_usage` rồi `han-muc`) đứng trước CLI `tiep-tuc`, cả trong dạng `--nhe` và việc của lịch 30′ trước `danh-thuc`. `can_doc_han_muc` làm lại bước 0 và 1 một lần. `khuyen_cho` báo chờ, "Không chuyển gì thêm". Khi không đổi tài khoản và phiên cũ còn trong nhóm thì nhắn phiên đó thay vì mở chip. Không câu nào để phiên tự suy dãy nào xong hay tự đổi pha.

- eval: E15
  run_id: minted-dieu-phoi-doi-tai-khoan-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp4
  verified_at: 2026-10-11T05:27:08Z
  output: |
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi
    #

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-dieu-phoi-doi-tai-khoan-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T05:27:08Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên CẢ code mới lẫn baseline diffBase — chúng chứng minh bộ kiểm chứ chưa chứng minh tính năng; nên viết lại để assert hành vi mới, hoặc xác nhận đây là regression-guard có chủ ý): E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11, E13b, E14, E15 (cùng một lệnh node --test gộp bộ tests/dieu-phoi, lọc qua grep), E14b (lệnh LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs), E14c (lệnh node tests/dieu-phoi/kiem-validate.mjs). Ghi chú: baseline xanh nghĩa là mã thoát của các lệnh này không tự phân biệt cây cũ với cây mới; bằng chứng phân biệt nằm ở các dòng «ok» theo tên ca DP4-xx mà expected đòi, người đọc Cổng 2 nên kiểm bằng output chứ không chỉ bằng mã thoát.

Baseline khong do:
- node tests/dieu-phoi/kiem-mod.mjs: bo qua baseline: tep tests/dieu-phoi/kiem-mod.mjs co o cay dang kiem nhung chua co o merge-base 68951ceff31112385da644d22e965d7878e05101 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: toàn bộ eval máy xanh (E12, E13 không đo được trên baseline vì eval mới), hội đồng chấm E14d đồng thuận PASS, verdict PASS. Phát hiện của bước review nằm ở review-findings.md.

### Re-pin lần 1 — 2026-10-11, do ghim lại sau DP4 và gộp main d0dc3dc4 (vá gate-card #311)
run_id: repin-20261011T112517Z-27231
sha: 3ad1c14a5214d9fe7497c2d3f884eb9939bbec58 · suites: 10 lệnh exit 0 · evals: 18/18 eval máy đạt kỳ vọng · ngoài làn máy: E14d (E14d không khai paths)

### Re-pin lần 2 — 2026-10-11, do sau vòng dieu-phoi-sua-truoc-dot-thu (D4·D1·B1·E2·E1) + gộp DP6, DP7-06 neo lịch sử
run_id: repin-20261011T152051Z-95655
sha: 113a4a9ae70804a9a60e2c085234f537b0fd39bc · suites: 10 lệnh exit 0 · evals: 18/18 eval máy đạt kỳ vọng · ngoài làn máy: E14d (E14d không khai paths)

### Re-pin lần 3 — 2026-10-12, do chiến dịch ghim lại 2.27.0 — 22 hồ sơ hoá cũ theo paths so v2.26.0, sau chữ ký mốc (lượt làn thứ hai)
run_id: repin-20261012T065455Z-55784
sha: 5e043c06f3347db65f3c982a357b054c1991ac1f · suites: 10 lệnh exit 0 · evals: 18/18 eval máy đạt kỳ vọng · ngoài làn máy: E14d (E14d không khai paths)

### Re-pin lần 4 — 2026-10-12, do vòng trang-thai-dot-dieu-phoi-tho sửa kiem-mod.mjs, hooks/mod/register.ts, mod-luat.mjs (phần mod khung) + gộp main 08d041a6
run_id: repin-20261012T184443Z-30763
sha: 8bb9c94e3f6b03b5b3749633f6bccf1ec4437089 · suites: 10 lệnh exit 0 · evals: 18/18 eval máy đạt kỳ vọng · ngoài làn máy: E14d (E14d không khai paths)

### Re-pin lần 5 — 2026-10-13, do gộp main 4c791556 (v2.28.0 + #334 + S3c #335) sau chữ ký Cổng 2 của trang-thai-dot-dieu-phoi-tho
run_id: repin-20261012T232028Z-56508
sha: dec146af99c8469990455fdb947e6bb52be10543 · suites: 10 lệnh exit 0 · evals: 18/18 eval máy đạt kỳ vọng · ngoài làn máy: E14d (E14d không khai paths)
