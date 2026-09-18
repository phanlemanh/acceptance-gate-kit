---
schema_version: 2
feature_slug: release-2-16-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 85e922e944f1d9a3fa4f6fe5fe6b504e1aee2d15
human_signoff:
---

# Evidence Report: release-2-16-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E6a | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6c | AC-6 | test | PASS |
| E6d | AC-6 | test | PASS |
| E6e | AC-6 | script | PASS |
| E7 | AC-7 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-16-0-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_16
  verified_at: 2026-09-18T06:57:16Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban d9269477)

- eval: E1b
  run_id: minted-release-2-16-0-E1b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_tang_2_16
  verified_at: 2026-09-18T06:57:16Z
  output: |
    [neo] so tai CHA cua commit sinh ho so moc (e3563671, con 26bf12fe) = 2.15.0 · so trong cay lam viec = 2.16.0
    PASS: so trong cay (2.16.0) TANG theo semver so voi so tai CHA cua commit sinh ho so moc (e3563671, con 26bf12fe) = 2.15.0 — neo suy TU KHO, khong ghim sha

- eval: E2
  run_id: minted-release-2-16-0-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_16
  verified_at: 2026-09-18T06:57:16Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban dc7abe93)

- eval: E3
  run_id: minted-release-2-16-0-E3-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cua_so_vendored_2_16
  verified_at: 2026-09-18T06:57:16Z
  output: |
    PASS: vendored 9 tep chep CI + chinh tep mang khoi chep (danh sach BANG danh sach tai neo) KHONG doi ke tu lan cat so 2.15.0 (89fbc87b) toi cay lam viec (doi chung: cua so tren toan kho co 98 tep doi)

- eval: E4
  run_id: minted-release-2-16-0-E4-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cua_so_viec_meta_2_16
  verified_at: 2026-09-18T06:57:16Z
  output: |
    PASS: viec-meta 1 ho so vong sinh sau lan cat so 2.15.0 (89fbc87b) BANG khoi khai [thuoc-co-cua] · the mo phien tren cay that: vong meta dang mo n=0 [rong]

- eval: E6a
  run_id: minted-release-2-16-0-E6a-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-18T06:57:16Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 885 passed, 0 failed

- eval: E6b
  run_id: minted-release-2-16-0-E6b-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-18T06:57:16Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E6c
  run_id: minted-release-2-16-0-E6c-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-18T06:57:16Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E6d
  run_id: minted-release-2-16-0-E6d-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-18T06:57:16Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E6e
  run_id: minted-release-2-16-0-E6e-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-18T06:57:16Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E7
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Đủ năm khối Notes (dòng số/vendored/lỗi tái phát/chiến dịch ghim lại/nhát cắt kế), bảng năm dòng đúng hai cột kèm nguồn rút mỗi ô, dòng 2 tách trong/ngoài thiết kế và gọi tên lý do (CRLF bị lượt chấm 2 bỏ sót). Bốn phép đối chiếu đều khớp khi tính lại từ usage-report.md: (i) 1,53/23,25/21,96/5,09/2,97 M, S4 gộp 30,02 M, vòng gộp 54,80 M khớp tổng out+in+cache_read+cache_create của các bảng per-model từng lượt; (ii) 22,5/75,6/1,9 · 28,1/65,6/6,3 · 50,5/41,6/7,9 và gộp 25,7/71,2/3,1% cùng tìm-lỗi tuyệt đối 18,49 M khớp khi cộng out+cache_read (không cache_create) theo bảng vai trò, refute+review vào tìm-lỗi và machine+judge+baseline vào chứng-minh-vật; (iv) 71,2% so đúng số 9,5% ở Notes §1 hợp đồng 2.15.0 kèm giải thích mẫu số khác (làn ui 91% ở R1) và so tuyệt đối 18,49 M với 8,30 M — đúng số nguồn. Bảy điều bất lợi đều nói thẳng nguyên văn, §5 gọi tên nhiều chỗ cắt và có định đoạt router (giữ nguyên theo Q3 17/09), §4 nói đúng ba số 14/72, 60, 0.
    - operational-feasibility: PASS — Đủ năm khối Notes (năm dòng số · vendored · lỗi tái phát · chiến dịch ghim lại · nhát cắt kế); bảng năm dòng đủ hai cột với nguồn rút hoặc "không đo được kèm lý do" ở mọi ô, dòng 2 tách trong/ngoài thiết kế và gọi tên lý do (phát hiện CRLF lượt chấm 2 bỏ sót). Tự tính lại cả bốn phép đối chiếu từ usage-report.md và khớp chính xác từng chữ số: (i) 1,53/23,25/21,96/5,09/2,97 M, S4 gộp 30,02 M, vòng gộp 54,80 M; (ii) ba tỉ lệ từng lượt 22,5/75,6/1,9 · 28,1/65,6/6,3 · 50,5/41,6/7,9 và gộp 25,7/71,2/3,1% với tìm-lỗi tuyệt đối 18,49 M; (iii) hai khoảng thời gian dòng 1 (2h36, 1h28) tự nhất quán và phù hợp mốc seal gate trong decisions.jsonl; (iv) 71,2% so 9,5% của R1 được trích đúng kèm giải thích mẫu số (làn ui 91%) khiến hai số không so thẳng được. Cả bảy điều bất lợi được nói thẳng không che giấu, mục 5 định đoạt router và gọi tên nhiều chỗ cắt, mục 4 nói đúng ba số 14/72, 60, 0.
    - spec-alignment: PASS — Cả bốn phép đối chiếu khớp từng chữ số khi tính lại từ usage-report.md (dòng 4: 1,53/23,25/21,96/5,09/2,97 M, S4 gộp 30,02 M, vòng gộp 54,80 M; dòng 4b: 22,5/75,6/1,9 · 28,1/65,6/6,3 · 50,5/41,6/7,9, gộp 25,7/71,2/3,1% với tìm-lỗi tuyệt đối 18,49 M) và giờ tác giả các commit (53aa1f08 20:29, b9f8766e 23:05, 57b6eda1 21:37, f49709ef 15:10, c30cf544 15:59, 618b66ab 16:13) khớp đúng dòng 1–2; số 9,5% của R1 và lời giải thích về làn ui cũng khớp hợp đồng 2.15.0. Năm khối Notes đủ mặt, bảng năm dòng đủ hai cột có nguồn rút hoặc lý do không đo được, dòng 2 tách trong/ngoài thiết kế kèm lý do, bảy điều bất lợi đều được nói thẳng (kể cả điều owner bắt phát hiện trong hợp đồng, nằm ở ô dòng 2), mục 5 gọi tên nhiều chỗ cắt và định đoạt router, mục 4 nói đúng ba số 14/72, 60, 0.
  rationale: Hội đồng ba lăng kính đồng thuận PASS sau khi mỗi lăng kính tự tính lại độc lập bốn phép đối chiếu số từ usage-report.md và khớp từng chữ số; bảy điều bất lợi được §7 nói thẳng không che giấu, năm khối Notes bắt buộc đều có mặt, bảng năm dòng đủ hai cột kèm nguồn, dòng 2 tách trong/ngoài thiết kế kèm lý do, mục 5 gọi tên nhát cắt và định đoạt router.

## Known limits

## Ngoài hợp đồng

## Analyst

- E6a (`bash tests/scripts/run-tests.sh`)
- E6b (`bash tests/hooks/run-tests.sh`)
- E6c (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`)
- E6d (`bash tests/workflows/run-tests.sh`)
- E6e (`node scripts/product-map.mjs --root . --check`)

Năm lệnh trên xanh trên cả nhánh HEAD lẫn diffBase: đây là các regression-guard toàn kho có chủ ý (bộ test/lint/product-map chạy mỗi vòng, không đặc thù cho feature release-2-16-0), không phải eval phân biệt được feature này.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E5 (rang-ghim-lai.mjs, AC-5 khi đó còn trong phạm vi) FAIL — script gọi sai API `expectedExits()` (trả `{byId, errs}`, không phải map trực tiếp) nên mọi kỳ vọng đỏ đọc thành 0. Returned to implementation.
Round 2: mọi eval máy XANH, nhưng E7 (judgment) có lăng kính operational-feasibility UNCERTAIN — thiếu bằng chứng giờ tác giả ba commit để đối chiếu Notes §1. Returned to implementation.
Round 3: mọi eval máy XANH, nhưng E7 có lăng kính spec-alignment FAIL — tỉ lệ token S4 round 2 tính sai trong Notes §1 (28,1/65,6/6,3% thay vì con số đúng); chạm trần 3 vòng của T3. Owner quyết ở Cổng Bằng chứng (quyết định B): THU PHẠM VI, gỡ AC-5 và AC-8 cùng eval E5/E8 và rang-ghim-lai.mjs — mở lại vòng cho lượt chấm này.
