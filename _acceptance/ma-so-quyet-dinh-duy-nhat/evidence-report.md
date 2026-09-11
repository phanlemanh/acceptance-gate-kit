---
schema_version: 2
feature_slug: ma-so-quyet-dinh-duy-nhat
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (đường VERIFY độc lập, 4 lệnh chạy tuần tự — entry d-20260911T092728Z-10)
enforcement_mode: strict
bypass_used: false
verified_commit: 4defd90ddda384353a2d719744a56f86a73ba1bb
human_signoff:
---

# Evidence Report: ma-so-quyet-dinh-duy-nhat

Round 2. Một phiên tươi chạy tuần tự bốn suite trên cây `4defd90d` (working tree sạch); mỗi eval đối
chiếu với dòng ghim `PASS: DKnn` hoặc dòng tổng kết của chính lệnh. run-log do shell tính lúc chạy.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-7 | test | PASS |
| E9 | AC-7 | test | PASS |
| E10 | AC-7 | test | PASS |
| E11 | AC-8 | test | PASS |
| E12 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: ma-so-quyet-dinh-duy-nhat-E1-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK07 lenh append SKILL (nguyen van): ba dong CUNG mot giay -> ba id khac nhau d-<UTC>-<n>, bash + zsh
    PASS: DK08 pha vat that ben viet: bo phan dem dong khoi lenh -> CUNG lenh ghi DO voi dung thong diep
    PASS: DK13 lenh SKILL voi cau THAT (nhay don, %, $, backtick, \"): ghi nguyen van, bash + zsh; bo nhay heredoc -> DO

- eval: E2
  run_id: ma-so-quyet-dinh-duy-nhat-E2-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK01 --extract: moi dong so co khoa rieng; id duy nhat giu nguyen, id trung thanh id#k theo thu tu SO
    PASS: DK12 ma trung vat qua dau niem Cong 1: da duyet #1 #2, Treo #3; dem Treo truoc -> DO

- eval: E3
  run_id: ma-so-quyet-dinh-duy-nhat-E3-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK02 Cong 1 round-trip: overlay theo khoa extract -> moi dong so hien DUNG cau cua no, khong dong nao lap
    PASS: DK04 Cong 2 Treo round-trip: ba dong chung id -> ba cau rieng, dung thu tu Treo-1..3

- eval: E4
  run_id: ma-so-quyet-dinh-duy-nhat-E4-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK03 Cong 1 doc-cu: overlay theo id TRAN cua id trung bi bo qua (in chu goc), id duy nhat van dich; stderr noi ro
    PASS: DK05 Cong 2 doc-cu: overlay id tran cua id trung -> Treo in chu goc, ba dong khac nhau

- eval: E5
  run_id: ma-so-quyet-dinh-duy-nhat-E5-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK06 pha vat that: khoi phuc lookup cu (x.id === e.id) -> CUNG fixture doc-cu DO voi dung thong diep

- eval: E6
  run_id: ma-so-quyet-dinh-duy-nhat-E6-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK09 overlay di dang (null trong mang, object thay mang) -> the van ra, in chu goc; bo guard -> sap

- eval: E7
  run_id: ma-so-quyet-dinh-duy-nhat-E7-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    Results: 863 passed, 0 failed

- eval: E8
  run_id: ma-so-quyet-dinh-duy-nhat-E8-r2-20260911T093245Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-11T09:38:05Z
  output: |
    Results: all plugin tests passed

- eval: E9
  run_id: ma-so-quyet-dinh-duy-nhat-E9-r2-20260911T093815Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-11T09:38:17Z
  output: |
    Results: 70 passed, 0 failed

- eval: E10
  run_id: ma-so-quyet-dinh-duy-nhat-E10-r2-20260911T093826Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-11T09:38:28Z
  output: |
    Results: 51 passed, 0 failed
    Results: all workflow tests passed

- eval: E11
  run_id: ma-so-quyet-dinh-duy-nhat-E11-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK10 approve.md + signoff.md tro toi DEC-ID-RECIPE, 0 dang ma cu; chen lai d-<next> -> DO dung thong diep

- eval: E12
  run_id: ma-so-quyet-dinh-duy-nhat-E12-r2-20260911T092918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:32:37Z
  output: |
    PASS: DK11 khuon phan tu overlay (acceptance-card.md) dien bang key extract -> moi dong dung cau; doi ten truong id->key -> DO

## Known limits

## Ngoài hợp đồng

## Analyst

n-a — không chạy baseline trên cây diffBase (đường verify độc lập, entry d-20260911T092728Z-10). Khả năng
phân biệt vật hỏng được chứng ngay trong ca: DK06, DK08, DK09, DK10, DK11, DK12, DK13 đều chạy đối chứng
dương trên cùng fixture rồi phá đúng vật trong bản sao và ra đúng thông điệp hoặc giá trị đã ghim.

## Variance

none — mọi eval tất định.

## Iterations

Round 1 (`f150bcd8`): E8 đỏ vì PRODUCT-MAP.md chưa vẽ lại sau khi thêm hồ sơ; reviewer tươi bắt khuôn mã hỏng khi câu có dấu nháy đơn (trong hợp đồng AC-1, high) — sửa cả hai trong `4defd90d`.
Round 2 (`4defd90d`): 12/12 eval đạt; reviewer tươi vòng 2 sạch — 0 finding trong hợp đồng, 0 ngoài hợp đồng (chi tiết `review-findings.md`).
