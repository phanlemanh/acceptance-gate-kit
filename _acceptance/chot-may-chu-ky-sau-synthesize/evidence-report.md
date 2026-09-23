---
schema_version: 2
feature_slug: chot-may-chu-ky-sau-synthesize
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2bb83c61078d27607c9e71486ca4df9376fa4919
human_signoff:
---

# Evidence Report: chot-may-chu-ky-sau-synthesize

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E9 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-chot-may-chu-ky-sau-synthesize-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac1
  verified_at: 2026-09-23T05:37:05Z
  output: |
      PASS: CTN-AC8-go-goi go loi goi chot -> phep AC-1 bao human_signoff con gia tri
      PASS: CTN-AC8-bo-khoa bo bypass_ack khoi danh sach khoa -> phep AC-1 goi dung ten khoa
      Results: 26 passed, 0 failed (chot-truong-nguoi)

- eval: E2
  run_id: minted-chot-may-chu-ky-sau-synthesize-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac2
  verified_at: 2026-09-23T05:37:05Z
  output: |
      PASS: CTN-AC4-ben-goi ben dung args duy nhat (s4-args) ghi invokedAt dang ISO
      PASS: CTN-AC5 mot dong run-log kind chot-truong-nguoi, bon so bang dem doc lap
      Results: 26 passed, 0 failed (chot-truong-nguoi)

- eval: E3
  run_id: minted-chot-may-chu-ky-sau-synthesize-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac3
  verified_at: 2026-09-23T05:37:05Z
  output: |
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi

    Results: 26 passed, 0 failed (chot-truong-nguoi)

- eval: E4
  run_id: minted-chot-may-chu-ky-sau-synthesize-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac4
  verified_at: 2026-09-23T05:37:05Z
  output: |
    PASS: CTN-AC7-lanh doi chung duong: du ref, du hs goc -> thoat 0
    PASS: CTN-AC7-ref-le mot ref le vang -> thoat 0 + dung mot dong khai
    Results: 26 passed, 0 failed (chot-truong-nguoi)

- eval: E5
  run_id: minted-chot-may-chu-ky-sau-synthesize-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac5
  verified_at: 2026-09-23T05:37:05Z
  output: |
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi

    Results: 26 passed, 0 failed (chot-truong-nguoi)

- eval: E6
  run_id: minted-chot-may-chu-ky-sau-synthesize-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac6
  verified_at: 2026-09-23T05:37:05Z
  output: |
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi
    Results: 26 passed, 0 failed (chot-truong-nguoi)

- eval: E7
  run_id: minted-chot-may-chu-ky-sau-synthesize-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac7
  verified_at: 2026-09-23T05:37:05Z
  output: |
    co mat: bo-dung-chung-nhan-chuoi
    co mat: tieu-de-cot-doc-tron
    im: 51 bao cao crm, 51 bi cham, 0 dong ngoai bon khoa

- eval: E9
  run_id: minted-chot-may-chu-ky-sau-synthesize-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac7_nhanh
  verified_at: 2026-09-23T05:37:05Z
  output: |
      PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi

      Results: 26 passed, 0 failed (chot-truong-nguoi)

- eval: E8
  run_id: minted-chot-may-chu-ky-sau-synthesize-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ctn_ac8
  verified_at: 2026-09-23T05:37:05Z
  output: |
    PASS: CTN-AC8-moi-cot khop khoa o moi cot -> phep AC-3 bao dong output bi doi

    Results: 26 passed, 0 failed (chot-truong-nguoi)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-23T05:37:05Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-23T05:37:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-23T05:37:05Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-23T05:37:05Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-chot-may-chu-ky-sau-synthesize-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-23T05:37:05Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — moi eval feature deu red tren baseline (ke thua tu round 1, khong do lai round nay).

## Variance

none — every multi-run eval is uniform.

## Iterations

Round 1: E1–E9 (chín eval script phủ AC-1..AC-8, trong đó AC-7 phủ bởi cả E7 và E9) và năm lệnh suite hồi quy (tests/scripts, tests/hooks, tests/plugins, tests/workflows, product-map --check) đều xanh ngay lần chạy đầu — không có vòng sửa vật nào.
Round 2: cùng chín eval script và năm lệnh suite hồi quy chạy lại xanh trên commit 2bb83c61 (sau vá S4-r1 t3/AC-1 + t4/AC-2: chốt nhận frontmatter mở bằng dòng trống/«--- » có khoảng trắng cuối, và run_id/khoá viết hoa/carry theo đúng luật bên đọc); baseline không đo lại round này (P2 — evals.yaml không đổi từ lần baseline cuối). Review round này xác nhận thêm 2 finding trong hợp đồng ở AC-2 (lớp «chốt hẹp hơn bên đọc» còn sót ở dòng mở khối `- run_id:` và ở độ phủ ma trận test) — xem review-findings.md.
