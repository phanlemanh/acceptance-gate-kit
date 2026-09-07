---
schema_version: 2
feature_slug: release-2-9-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a36ee24537807800f5801856771b2413d5e3b433
human_signoff:
---

# Evidence Report: release-2-9-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-9-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-07T10:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E2
  run_id: minted-release-2-9-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-07T10:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E3
  run_id: minted-release-2-9-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T10:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 797 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-9-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-07T10:00:00Z
  output: |
      PASS: V06

    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-9-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-07T10:00:00Z
  output: |
      PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 14 dot bien (co ca chi-EN, ca 3 ve deu co chieu do) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-9-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-07T10:00:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-9-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-07T10:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: minted-release-2-9-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-07T10:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

## Known limits

## Ngoài hợp đồng

## Analyst

E1, E2, E6 — cmd `bash -c 'set -o pipefail; ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh | grep -F P200'`: xanh trên cả HEAD lẫn baseline (diffBase). Chiều đỏ của ba eval này sống bên TRONG chính P200 (5 đột biến + đối chứng dương bản sao nguyên vẹn, không có bước chạy tay ở vòng này) nên baseline green không phải dấu hiệu thiếu phân biệt của bản thân eval — nhưng vì lệnh cat-so tổng quát pass trên cả hai cây, vẫn liệt kê đúng theo tiêu chí đối chiếu A/B.

E3 — cmd `bash tests/scripts/run-tests.sh`: suite hồi quy xanh trên cả hai phía (guard, không phân biệt tính năng này riêng).

E3b — cmd `bash tests/hooks/run-tests.sh`: suite hồi quy xanh trên cả hai phía.

E3c — cmd `bash tests/plugins/run-tests.sh`: suite hồi quy xanh trên cả hai phía.

E3d — cmd `bash tests/workflows/run-tests.sh`: suite hồi quy xanh trên cả hai phía.

E3e — cmd `node scripts/product-map.mjs --root . --check`: suite hồi quy xanh trên cả hai phía.

## Variance

none — không có eval nào trong vòng này chạy nhiều lần (runs>1), nên không có pass_rate hỗn hợp cần người quyết.

## Iterations

Round 1: E1, E2, E3, E3b, E3c, E3d, E3e, E6 tất cả PASS ngay từ vòng đầu — không có vòng nào bị trả về implementation.
