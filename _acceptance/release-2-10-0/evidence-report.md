---
schema_version: 2
feature_slug: release-2-10-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 339b81dc051f04ccaf2330d705bc078b1c07c6f7
human_signoff:
---

# Evidence Report: release-2-10-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-10-0-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E2
  run_id: minted-release-2-10-0-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E3
  run_id: minted-release-2-10-0-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 859 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-10-0-E3b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-10-0-E3c-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
      PASS: ca lop nhin thay — LNT6 (ho so lop-bang-chung-nhin-thay)

    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-10-0-E3d-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-10-0-E3e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: minted-release-2-10-0-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E5
  run_id: minted-release-2-10-0-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-10T05:41:55+07:00
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round trước — baseline không đo lại round này.

none — mọi field "baseline:" ở trên ghi "n-a" (P2: evals.yaml không đổi từ lần baseline cuối, nên round này không đo lại; xem round 2 để biết baseline: green trên P200/scripts/hooks/workflows/product-map).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3, E3b, E3d, E3e, E4 đều PASS (exit 0), nhưng E3c (trọn suite
`bash tests/plugins/run-tests.sh`, không lọc) không có kết quả — agent verify bị
skip/chết giữa chừng. Verdict tổng = BLOCKED (không phải REJECT: không eval nào
thất bại, chỉ một lệnh chưa chạy xong).

Round 2: E3c chạy trọn suite thật lần này (exit 1) — case P186 (khối VIỆC-CỦA-ANH
Cổng 2, mutant «đã gỡ nhánh liệt kê judgment khỏi bản sao gate-card») đỏ, tức suite
plugins CHƯA xanh trên cây hiện tại. Tám eval còn lại (E1, E2, E3, E3b, E3d, E3e,
E4, E5) đều PASS. Verdict tổng = REJECT — failed_evals: [E3c]. Trả về S3 để điều
tra/sửa case P186 trước vòng kế tiếp.

Round 3: E3c chạy lại trọn suite plugins (`bash tests/plugins/run-tests.sh`) sau
khi case P186 được sửa ở S3 — exit 0, "Results: all plugin tests passed". Cả
chín eval (E1, E2, E3, E3b, E3c, E3d, E3e, E4, E5) đều PASS, không eval nào
thất bại hay treo UNCERTAIN. Verdict tổng = PASS.
