---
schema_version: 2
feature_slug: release-2-10-0
verdict: REJECT
failed_evals: [E3c]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 547e3582fc4503a293d902fceb92f3c700cb6b98
human_signoff:
---

# Evidence Report: release-2-10-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | FAIL |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-10-0-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
         P200 VE: muc v2.10.0 cua feature-loop TU khai cap
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E2
  run_id: minted-release-2-10-0-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
         P200 VE: muc v2.10.0 cua feature-loop TU khai cap
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E3
  run_id: minted-release-2-10-0-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 859 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-10-0-E3b-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-10-0-E3c-r2
  exit_code: 1
  verifier: config:executors.test.plugins
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
    P186 khoi VIEC-CUA-ANH Cong 2: du 4 loai viec + mau gop 1 dong (E2)
    MUTANT: da go nhanh liet ke judgment khoi ban sao gate-card.

    [Output truncated by tool at 19,857+ characters; suite ran extensively with many PASS results visible before truncation]

    Test suite completed with exit code 1 (failure)

- eval: E3d
  run_id: minted-release-2-10-0-E3d-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-10-0-E3e-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: minted-release-2-10-0-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
         P200 VE: muc v2.10.0 cua feature-loop TU khai cap
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E5
  run_id: minted-release-2-10-0-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-09T23:00:00+07:00
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

## Known limits

## Ngoài hợp đồng

## Analyst

- bash -c 'set -o pipefail; ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh | grep -F P200' → E1, E2, E4 (baseline: green — P200 pass trên cả bản cũ lẫn bản mới, không tự nó phân biệt được feature; đây là ca quy về đối chứng dương bên trong chính P200, không phải regression-guard vô tình)
- bash tests/scripts/run-tests.sh → E3 (baseline: green — suite scripts vẫn xanh trên baseline, không phân biệt)
- bash tests/hooks/run-tests.sh → E3b, E5 (baseline: green — suite hooks vẫn xanh trên baseline, không phân biệt)
- bash tests/workflows/run-tests.sh → E3d (baseline: green — suite workflows vẫn xanh trên baseline, không phân biệt)
- node scripts/product-map.mjs --root . --check → E3e (baseline: green — product-map vẫn khớp trên baseline, không phân biệt)

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
