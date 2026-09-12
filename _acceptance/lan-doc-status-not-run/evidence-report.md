---
schema_version: 2
feature_slug: lan-doc-status-not-run
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 49055b78cd201b6522101ad7f25a2a84bb36aabf
human_signoff:
---

# Evidence Report: lan-doc-status-not-run

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-1 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: repin-20260912T133019Z-89995
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_mot_nguon
  verified_at: 2026-09-12T13:30:19Z
  output: |
    · L01 chiều đỏ: bản tiêm ĐỎ, ghim «hai bên trả tập khác nhau»
      ✓ L01 hai bên trả CÙNG một tập id
    lan-status-not-run: 1/1 ca xanh

- eval: E2
  run_id: repin-20260912T133017Z-87743
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_bo_qua_that
  verified_at: 2026-09-12T13:30:17Z
  output: |
    · L02 chiều đỏ: bản tiêm ĐỎ, ghim «(lượt CÓ --write)»
      ✓ L02 ô khai không-chạy KHÔNG được thi hành (cả hai lượt: không và CÓ --write)
    lan-status-not-run: 1/1 ca xanh

- eval: E3
  run_id: repin-20260912T133022Z-18683
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_ben_doc_nhan
  verified_at: 2026-09-12T13:30:22Z
  output: |
    · L03 chiều đỏ: bản tiêm ĐỎ, ghim «lacks eval»
      ✓ L03 bên đọc nhận pin thiếu id đã khai, vẫn chặn id CHẠY ĐƯỢC bị thiếu
    lan-status-not-run: 1/1 ca xanh

- eval: E4
  run_id: repin-20260912T133022Z-47521
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_hai_ve
  verified_at: 2026-09-12T13:30:22Z
  output: |
    · L04 chiều đỏ: bản tiêm ĐỎ, ghim «L04 phải thoát 2»
      ✓ L04 khai không-chạy mà báo cáo đã ký có mã thoát → dừng, chưa ghi byte nào
    lan-status-not-run: 1/1 ca xanh

- eval: E5
  run_id: repin-20260912T133019Z-35850
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_pin_cu
  verified_at: 2026-09-12T13:30:19Z
  output: |
    REPIN x re-pin lane "repin-20260908T035246Z-95429" evals_exit lacks eval(s) E1 declared in evals.yaml (executor test/script) — the lane did not re-run them at 7d12ffad4010829598ded702b80a2ff8d12eb189; run a NEW lane
      ✓ L05 pin CŨ do writer thật (bản trước vá) ghi vẫn xanh với bên đọc mới; corpus hiện có không hồ sơ nào hoá đỏ
    lan-status-not-run: 1/1 ca xanh

- eval: E6
  run_id: repin-20260912T133025Z-54264
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_noi_ra
  verified_at: 2026-09-12T13:30:25Z
  output: |
    · L06 chiều đỏ: bản tiêm ĐỎ, ghim «sai tập/thứ tự id»
      ✓ L06 pin nói ra ô không đo ở CẢ HAI chỗ
    lan-status-not-run: 1/1 ca xanh

- eval: E7
  run_id: repin-20260912T133023Z-38996
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_ca_that
  verified_at: 2026-09-12T13:30:23Z
  output: |
    repin-lane: LÀN ĐỎ — không ghi gì (suite [0]; eval đỏ: s1/E14=4). Khắc phục nguyên nhân rồi chạy làn MỚI (run_id mới); không ký mù.
      ✓ L07 hình dạng OneFlow 12/09: 14 ô máy, một ô không-chạy trỏ lệnh thoát 4
    lan-status-not-run: 1/1 ca xanh

- eval: E8
  run_id: minted-lan-doc-status-not-run-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gllc_ma_tran_export
  verified_at: 2026-09-12T13:30:30Z
  output: |
    PASS: GL03 ma trận xoá-export × hai hồ sơ (G so byte · N có tên) + quan hệ tên dùng ⊆ bảng (5.8s)

    Results: 1 passed, 0 failed

- eval: E9
  run_id: L08
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_bo_loc_rong
  verified_at: 2026-09-12T13:30:31Z
  output: |
    lan-status-not-run: bộ lọc LSNR_CASES=KHONG-CO-CA-NAY khớp 0 ca — không có gì chạy
      ✓ L08 lưới bộ lọc rỗng: LSNR_CASES không khớp ca nào → thoát 2 kèm thông điệp
    lan-status-not-run: 1/1 ca xanh

- eval: E10
  run_id: repin-20260912T133022Z-90067
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_chuan_hoa
  verified_at: 2026-09-12T13:30:22Z
  output: |
    · L09 chiều đỏ: bản tiêm ĐỎ, ghim «ở ĐƯỜNG GHI»
      ✓ L09 chuẩn hoá bảy hình dạng lời khai
    lan-status-not-run: 1/1 ca xanh

- eval: E11
  run_id: repin-20260912T133025Z-93315
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lsnr_cho_xuat_hien
  verified_at: 2026-09-12T13:30:25Z
  output: |
    · L10 chiều đỏ: bản tiêm ĐỎ, ghim «bảng ca lệch bản khai»
      ✓ L10 chỉ TRƯỜNG thật mới tính, bốn chỗ khác không
    lan-status-not-run: 1/1 ca xanh

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-lan-doc-status-not-run-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-12T13:31:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lan-doc-status-not-run-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-12T13:32:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-doc-status-not-run-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-12T13:33:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lan-doc-status-not-run-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-12T13:34:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lan-doc-status-not-run-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-12T13:35:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

E8 (GLLC_CASES=GL03 node tests/scripts/repin-lane-lop-cu.test.mjs) — pass trên cả HEAD lẫn baseline (đo ở round 1, không đo lại round này vì evals.yaml không đổi). Đây là ca thường trực lớp-cũ (regression-guard cho ma trận xoá-export của repin-lane-lop-cu.test.mjs), không phải một eval mới sinh ra để đo tính năng lan-doc-status-not-run, nên non-discriminating trên diffBase là kỳ vọng đúng — không cần viết lại thành eval mới, chỉ xác nhận đây là regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: tất cả 11 eval script (E1-E11) và 5 lệnh suite hồi quy đều xanh (exit 0); 10/11 eval có baseline: red (đối chứng dương), E8 baseline: green là regression-guard lớp-cũ có chủ ý. Không có vòng quay lại implementation.
Round 2: chạy lại toàn bộ 11 eval + 5 lệnh suite trên verified_commit 49055b78cd201b6522101ad7f25a2a84bb36aabf (sau repin/ghim lại), tất cả xanh (exit 0); evals.yaml không đổi từ baseline cuối (round 1) nên baseline không đo lại round này — mọi block eval ghi baseline: n-a; E8 vẫn là ca non-discriminating do bản chất regression-guard lớp-cũ (carried từ round 1, xem mục Analyst). Không có vòng quay lại implementation.
