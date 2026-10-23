---
schema_version: 2
feature_slug: ky-den-gop
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e9c18ae7789ba1f525c39575e0bed7ad9d267a92
human_signoff:
---

# Evidence Report: ky-den-gop

Round 3. Cả mười eval của hợp đồng được mang từ round trước (delta không chạm paths của chúng); round này chạy lại mười một lệnh suite hồi quy, tất cả xanh.

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

## Evidence

- eval: E1
  run_id: minted-ky-den-gop-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T15:47:31Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval
    AC-1: ca C-2, C-3, C-7, C-12 (hai hàng kế trùng vùng → một hàng mang sau; Y ở ky chặn, Y ở gop không chặn; mọi hàng trùng → cho trung-tep)

- eval: E2
  run_id: minted-ky-den-gop-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T15:47:31Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval
    AC-2: ca C-4, C-8 (PR feat/ngoai sửa phiếu → hàng z, sự kiện trung-tep; PR feat/P2 quy về hàng Y)

- eval: E3
  run_id: minted-ky-den-gop-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T15:47:31Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval
    AC-3: ca C-10 (moi-phieu mang sau Y; moi-trong có cảnh báo thiếu ranh_gioi; Z sang P2 mang ranh_gioi)

- eval: E4
  run_id: minted-ky-den-gop-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T15:47:31Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval
    AC-4: ca C-9, C-11, C-13 (gh hỏng → trung-tep-mu; lịch so bằng bản chụp PR cũ; C-13 giữ bản chụp tốt khi nhịp có yêu cầu chờ)

- eval: E5
  run_id: minted-ky-den-gop-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T15:47:31Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval
    AC-5: ca C-5, C-6 (lỗi dò nhánh mở thành can_phan; nhanhLoi null → duyet)

- eval: E6
  run_id: minted-ky-den-gop-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval
    AC-6: ca I-1, I-2, I-3, I-6, I-7 (đường gộp nhanh: không tệp trùng, CI nhánh chính, khoá gop_khong_chay_lai_ci, sáu hàng chặn)

- eval: E7
  run_id: minted-ky-den-gop-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval
    AC-7: ca I-4, I-5 (lời gọi merge duy nhất kèm --match-head-commit; khoá merge không do P1 giữ thì ném)

- eval: E8
  run_id: minted-ky-den-gop-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval
    AC-8: ca H-1 … H-6 (đẩy nhánh, PR sẵn sàng theo thứ tự lời gọi gh; khối PR-SAN-SANG chạy được)

- eval: E9
  run_id: minted-ky-den-gop-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T15:47:31Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval
    AC-9: ca DG-1, DG-2, DG-3, DG-4 (đồng hồ ký→gộp 195 phút, squash → ky_luc null, trung vị và ghim lại sau ký)

- eval: E10
  run_id: minted-ky-den-gop-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T15:47:31Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval
    AC-10: KDG-M0 (bản sao lành xanh) và 23 dòng KDG-M, mỗi nhát tiêm đỏ đúng ca nêu tên (22 nhát của AC-10 + nhát S4-r1 → C-13)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ky-den-gop-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ky-den-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ky-den-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ky-den-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ky-den-gop-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ky-den-gop-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ky-den-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-23T16:41:49Z

Kết quả đầu ra cuối của từng lệnh suite round 3: bash 841 passed, 0 failed · mjs 1/3 36 passed, 0 failed · mjs 2/3 36 passed, 0 failed · mjs 3/3 36 passed, 0 failed · hooks 71 passed, 0 failed · plugins vung 1, 2, 3 đều «all plugin tests passed» · workflows «all workflow tests passed» · product-map «LO-TRINH.html khớp tệp ý định và hồ sơ» · kiem-ban-cai «BỎ QUA: KB — không phải lượt cắt mốc (số 2.33.1 = gốc vòng)». Giờ trong khối suite là mức ngày (giờ chính xác nằm ở run-log).

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet). Ghi chú: round 3 không đo lại baseline cho các eval mang từ round trước; cột baseline của chúng ghi n-a vì lượt này không đo.

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (round 3 không có eval nào chạy nhiều lần; mọi eval và lệnh suite đều deterministic, runs 1).

## Iterations

Round 1: S4-r1 bị REJECT — lỗi của đường xét chạm tệp khi gh hỏng; sửa ở commit 56d2a8ae (bản chụp tốt không bị ghi đè khi nhịp có yêu cầu chờ), thêm ca C-13 và nhát tiêm thứ 23 cho AC-10.
Round 2: S4-r2 bị REJECT — sổ known-limits thiếu hàng cho đề xuất của lượt 1; đã ghi 10 dòng sổ known-limits (commit e9c18ae7).
Round 3: các eval mang từ round 1 và 2 (delta không chạm paths), mười một lệnh suite chạy lại xanh trên e9c18ae7 — verdict PASS.
