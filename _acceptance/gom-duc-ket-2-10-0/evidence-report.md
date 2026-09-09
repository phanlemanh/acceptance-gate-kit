---
schema_version: 2
feature_slug: gom-duc-ket-2-10-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d72fa37098066ff90a812aaf821f7c2755da1113
human_signoff: Manh Phan 2026-09-09
---

# Evidence Report: gom-duc-ket-2-10-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | script | PASS |
| E7 | AC-7 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-gom-duc-ket-2-10-0-E1-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_lnt_do
  verified_at: 2026-09-09T09:29:44Z
  output: |
    PASS: [LNT1] lib một nguồn: vị từ 8 giá trị, alias, round-trip khuôn, mutant ba bộ đọc + dấu hiệu bản sao đã chạy
    PASS: [LNT6] bảy văn bản nghi thức chép luật; (iv)(vi) đo quan hệ alias/chỗ đứng; gỡ từng mệnh đề → đỏ đúng tên

- eval: E2
  run_id: minted-gom-duc-ket-2-10-0-E2-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_c1_nho
  verified_at: 2026-09-09T09:29:44Z
  output: |
      PASS: NO3 — ba bộ đọc + hai đường cắt hội tụ trên 4 fixture; mutant \s*# bị bắt
      PASS: NO4 — 1 helper đọc stdout thẻ đều bỏ ANSI (ma trận toàn phần + chiều đỏ của phép quét)
    lnt-no: OK (NO1, NO2, NO3, NO4)

- eval: E3
  run_id: minted-gom-duc-ket-2-10-0-E3-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k1
  verified_at: 2026-09-09T09:29:44Z
  output: |
      PASS: W37 doi chung duong
      PASS: W37 doi chung duong: duong lanh CO goi synthesize
      PASS: W37 doi chung duong verdict khong BLOCKED

- eval: E4
  run_id: minted-gom-duc-ket-2-10-0-E4-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k2
  verified_at: 2026-09-09T09:29:44Z
  output: |
      PASS: DT4 — ba mutant (nhánh chờ · cảnh báo approvers · bản chép trôi) đều bị bắt đích danh
      PASS: DT5 — neo P191/P194: GHI THẲNG là neo dương, Enter-xác-nhận là neo âm
    danh-tinh: OK (DT1, DT2, DT3, DT4, DT5)

- eval: E5
  run_id: minted-gom-duc-ket-2-10-0-E5-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k3
  verified_at: 2026-09-09T09:29:44Z
  output: |
    PASS: PV5 — L47 đã gỡ; L42m chứng bản sao đã chạy
    PASS: PV6 — thiếu md-section.cjs: không ném, chấm cả tài liệu, nói ra một dòng
    w6-w8-pham-vi: OK (PV1, PV2, PV3, PV4, PV5, PV6)

- eval: E5b
  run_id: minted-gom-duc-ket-2-10-0-E5b-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k3_cay_that
  verified_at: 2026-09-09T09:29:44Z
  output: |
    crm | 0 | 9 | 5
    chứng-một-lần: 3/3 cây tiêu thụ có mặt ở dev-root=/Users/manh-macmini/dev
    PASS: CAY-THAT (4 cây)

- eval: E7
  run_id: minted-gom-duc-ket-2-10-0-E7-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k5
  verified_at: 2026-09-09T09:29:44Z
  output: |
      PASS: S5D2 — bốn giá trị của SKILL == khuôn config (một nguồn)
      PASS: S5D3 — mutant gỡ khối / đổi mặc định đều bị bắt
    s5-ship-default: OK (S5D1, S5D2, S5D3)

- eval: E10
  run_id: minted-gom-duc-ket-2-10-0-E10-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gdk_k8
  verified_at: 2026-09-09T09:29:44Z
  output: |
      PASS: SD1 --carry-anchor → deltaFiles = đúng file đã đổi (ngoài _acceptance/)
      PASS: SD2 --no-carry → không khoá deltaFiles (làn conventions đọc trọn diff như cũ)
    Results: 2 passed, 0 failed (s4-args-delta)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_scripts_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-09-09T09:29:44Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_hooks_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-09-09T09:29:44Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_plugins_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-09-09T09:29:44Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_workflows_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-09-09T09:29:44Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-gom-duc-ket-2-10-0-SUITE-node_scripts_product_map_mjs_root_check-r6
  exit_code: 0
  verified_at: 2026-09-09T09:29:44Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: REJECT — 13 eval + 5 suite xanh nhưng rà soát xác nhận 11 lỗi thật (1 trong hợp đồng), lỗi lớp fail-open staleScope. Returned to implementation.
Round 3: REJECT — 5 finding thật, cùng LỚP fail-open staleScope với round 2. Returned to implementation.
