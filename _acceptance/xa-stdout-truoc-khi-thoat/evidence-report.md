---
schema_version: 2
feature_slug: xa-stdout-truoc-khi-thoat
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e043c06f3347db65f3c982a357b054c1991ac1f
human_signoff: manh 2026-10-11
---

# Evidence Report: xa-stdout-truoc-khi-thoat

Round 1. Cả bảy eval máy (E1–E7, cùng chạy một tệp ca `tests/scripts/xuat-du-qua-pipe.test.mjs`) và mười lệnh suite hồi quy đều xanh trên cây đã ghim. Không có eval judgment nào nên không có hội đồng chấm. Bước tìm-lỗi: 0 mục trong hợp đồng, 3 mục ngoài hợp đồng (độ nặng medium, low, low) — người quyết ở Cổng 2, đọc ở `review-findings.md`.

Về dòng bằng chứng: workflow chỉ giữ vài dòng cuối của lệnh xanh, nên dòng tổng kết `7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này` là của lượt chạy máy. Các dòng «nền: CẮT» và «PASS: XD-n» bên dưới được đối chiếu bằng một lượt chạy lại riêng, cùng cây `85593b69`, khi soạn báo cáo; lượt đó cho cùng kết quả (7 PASS, 0 KHÔNG ĐO ĐƯỢC), nên điều kiện «PASS kèm nền: CẮT» của E1–E4 và E7 thoả.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-xa-stdout-truoc-khi-thoat-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.xuat_du_qua_pipe
  verified_at: 2026-10-11T09:46:01Z
  output: |
    xuat-du-qua-pipe: 7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    nền: CẮT (dò nhận 65536 / 200000 byte)
    PASS: XD-1 thẻ Cổng 1 > 64 KB qua pipe bằng bản tệp — 346037 byte (0.1s)

- eval: E2
  run_id: minted-xa-stdout-truoc-khi-thoat-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.xuat_du_qua_pipe
  verified_at: 2026-10-11T09:46:01Z
  output: |
    xuat-du-qua-pipe: 7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    nền: CẮT (dò nhận 65536 / 200000 byte)
    PASS: XD-2 --extract Cổng 1 và Cổng 2 > 64 KB qua pipe bằng bản tệp, JSON đọc được — trích Cổng 1 182287 byte · trích Cổng 2 179020 byte (0.3s)

- eval: E3
  run_id: minted-xa-stdout-truoc-khi-thoat-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.xuat_du_qua_pipe
  verified_at: 2026-10-11T09:46:01Z
  output: |
    xuat-du-qua-pipe: 7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    nền: CẮT (dò nhận 65536 / 200000 byte)
    PASS: XD-3 thẻ Cổng 2 chưa-ký-được và ký-được > 64 KB qua pipe bằng bản tệp — chưa-ký 246555 byte · ký-được 376993 byte (0.3s)

- eval: E4
  run_id: minted-xa-stdout-truoc-khi-thoat-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.xuat_du_qua_pipe
  verified_at: 2026-10-11T09:46:01Z
  output: |
    xuat-du-qua-pipe: 7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    nền: CẮT (dò nhận 65536 / 200000 byte)
    hoàn nguyên trích Cổng 1: nhận 65536 / 182287 byte — đỏ đúng
    hoàn nguyên thẻ Cổng 1: nhận 65536 / 346037 byte — đỏ đúng
    hoàn nguyên trích Cổng 2: nhận 65536 / 179020 byte — đỏ đúng
    hoàn nguyên thẻ Cổng 2 chưa-ký: nhận 65536 / 246555 byte — đỏ đúng
    PASS: XD-4 ma trận 4 × 4 — hoàn nguyên đúng một chỗ thì đúng đường của chỗ ấy bị cắt — 16 ô (1.5s)

- eval: E5
  run_id: minted-xa-stdout-truoc-khi-thoat-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.xuat_du_qua_pipe
  verified_at: 2026-10-11T09:46:01Z
  output: |
    xuat-du-qua-pipe: 7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    PASS: XD-5 đầu ra nhỏ (5 đường + 3 hồ sơ thật × 2 cổng) không đổi byte nào — 11 cặp · hồ sơ thật bai-hoc-do-luong-vao-engine 8828/10219 B, baseline-tran-bo-qua-don 11389/22747 B, card-text-fidelity 14617/17928 B · chiều đỏ bắt «lệch byte» (8.4s)

- eval: E6
  run_id: minted-xa-stdout-truoc-khi-thoat-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.xuat_du_qua_pipe
  verified_at: 2026-10-11T09:46:01Z
  output: |
    xuat-du-qua-pipe: 7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    PASS: XD-6 người đọc đóng sớm — mã 0, không EPIPE; … stderr tiến trình con có EPIPE — đỏ đúng (0.1s)

- eval: E7
  run_id: minted-xa-stdout-truoc-khi-thoat-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.xuat_du_qua_pipe
  verified_at: 2026-10-11T09:46:01Z
  output: |
    xuat-du-qua-pipe: 7 PASS · 0 FAIL · 0 KHÔNG ĐO ĐƯỢC ở nền này
    nền: CẮT (dò nhận 65536 / 200000 byte)
    PASS: XD-7 repin-lane làn ghim lại đỏ > 64 KB qua pipe — JSON đọc được, đủ slug … nhận 65536 / 283124 byte — đỏ đúng (0.8s)

### Lệnh suite (hồi quy)

Kết quả: suite bash 837 ca xanh · mjs ba mảnh 27 + 27 + 27 ca xanh · hooks 71 ca xanh · plugins ba vùng xanh · workflows xanh · bản đồ sản phẩm khớp tệp ý định và hồ sơ.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-xa-stdout-truoc-khi-thoat-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T09:46:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào được đo là xanh trên CẢ HAI phía, vì cả bảy eval đều có baseline n-a (tệp ca là tệp mới, chạy trên code cũ không phân biệt gì). Tính phân biệt của chúng vì thế không đến từ phép so A/B mà từ chiều đỏ nằm sẵn trong tệp ca: ma trận 4 × 4 ở XD-4 (16 ô, bốn ô chéo đỏ đúng), chiều đỏ của XD-5 («lệch byte»), XD-6 (khuôn đặt-mã-sau sập), XD-7 (bản sao thoát ngay bị cắt). Đây là điều cần người biết khi đọc cột `baseline` của bảy khối trên.

Baseline khong do:

- node tests/scripts/xuat-du-qua-pipe.test.mjs: bo qua baseline: tep tests/scripts/xuat-du-qua-pipe.test.mjs co o cay dang kiem nhung chua co o merge-base 9b11cc6652b924cf6816ae1c257b2494f48a57cd — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần và là deterministic (runs: 1), không eval nào có pass_rate lẫn.

## Iterations

Round 1: bảy eval máy và mười lệnh suite đều xanh trên cây 85593b69; không eval nào trượt.

### Re-pin lần 1 — 2026-10-12, do chiến dịch ghim lại 2.27.0 — 22 hồ sơ hoá cũ theo paths so v2.26.0, sau chữ ký mốc (lượt làn thứ hai)
run_id: repin-20261012T065455Z-55784
sha: 5e043c06f3347db65f3c982a357b054c1991ac1f · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng
