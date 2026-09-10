---
schema_version: 2
feature_slug: release-2-11-0
verdict: REJECT
failed_evals: [E8c]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8c3529506853d3521c6851265c1669359862040d
human_signoff:
---

# Evidence Report: release-2-11-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E4b | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8a | AC-8 | test | PASS |
| E8b | AC-8 | test | PASS |
| E8c | AC-8 | test | FAIL |
| E8d | AC-8 | test | PASS |
| E8e | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-11-0-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-10T09:00:00Z
  output: |
         [chieu do] BG4 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (doi chung duong xanh, bam doi, ghim BG1+BG3+BG4)
    bo-giai-nhay OK (6 chan)

- eval: E2
  run_id: minted-release-2-11-0-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-10T09:00:00Z
  output: |
         [chieu do] BG4 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (doi chung duong xanh, bam doi, ghim BG1+BG3+BG4)
    bo-giai-nhay OK (6 chan)

- eval: E3
  run_id: minted-release-2-11-0-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-10T09:00:00Z
  output: |
         [chieu do] BG4 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (doi chung duong xanh, bam doi, ghim BG1+BG3+BG4)
    bo-giai-nhay OK (6 chan)

- eval: E4
  run_id: minted-release-2-11-0-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-10T09:00:00Z
  output: |
         [chieu do] BG4 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (doi chung duong xanh, bam doi, ghim BG1+BG3+BG4)
    bo-giai-nhay OK (6 chan)

- eval: E4b
  run_id: minted-release-2-11-0-E4b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-10T09:00:00Z
  output: |
         [chieu do] BG4 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (doi chung duong xanh, bam doi, ghim BG1+BG3+BG4)
    bo-giai-nhay OK (6 chan)

- eval: E5
  run_id: minted-release-2-11-0-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-10T09:00:00Z
  output: |
         [chieu do] BG4 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (doi chung duong xanh, bam doi, ghim BG1+BG3+BG4)
    bo-giai-nhay OK (6 chan)

- eval: E6
  run_id: minted-release-2-11-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-10T09:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E7
  run_id: minted-release-2-11-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-10T09:00:00Z
  output: |
    PASS: diagram-design KHONG doi trong cua so, giu 2.7.0 (doi chung duong: lib/ CO doi)

- eval: E8a
  run_id: minted-release-2-11-0-E8a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-10T09:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 863 passed, 0 failed

- eval: E8b
  run_id: minted-release-2-11-0-E8b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-10T09:00:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E8c
  run_id: minted-release-2-11-0-E8c-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-10T09:00:00Z
  output: |
    MUTANT: da go nhanh liet ke judgment khoi ban sao gate-card.js
    MUTANT-PHUT: da chen lai ' · ~5 phut' vao phu de the Cong 2
         MUTANT-PHUT bi bat dung — chan khong-hua-phut (chinh doan cham cua P185/P186) DO
         doi chung duong: the nguyen ven qua duoc chan khong-hua-phut OK
    MUTANT-2: da go ma eval khoi item 'V

- eval: E8d
  run_id: minted-release-2-11-0-E8d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-10T09:00:00Z
  output: |

    Results: all workflow tests passed
    EXIT_CODE: 0

- eval: E8e
  run_id: minted-release-2-11-0-E8e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-10T09:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E9
  run_id: minted-release-2-11-0-E9-r1
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  verifier: judgment panel (domain-correctness, operational-feasibility, spec-alignment)
  verified_at: 2026-09-10T09:00:00Z
  votes:
    - domain-correctness: PASS — Cả bốn khối đều có trong section `## Notes` của contract.md với nội dung thật, không chỉ tiêu đề: (1) bảng "Ba dòng số" cho vòng #165 có số cụ thể (184′/3h04, 1 lượt chấm, 4/0 lượt gọi người, 0 bị đốt) kèm nguồn rút (sha `8f6a6bac`→`befa12ee`, `run-log.jsonl`); ba ô của riêng hàng "hồ sơ mốc" ghi "điền ở làn ghim lại" nhưng có giải thích rõ vì sao (số làm-xong→quyết-được của chính mốc chỉ biết sau chữ ký, nêu tường minh ở Known limits) chứ không phải bỏ trống hình thức. (2) Bảng lớp vendored đủ 9 mục của INIT-CI-COPY-LIST với số +/− cụ thể, nguồn `git diff --numstat 04069351..HEAD`. (3) Lớp lỗi tái phát liệt kê 4 mục cụ thể có tên hàm/file. (4) Nhát cắt kế gọi tên rõ "hồ sơ mốc đừng mang bản vá code" kèm hai lối (a)/(b) và khuyến nghị.
    - operational-feasibility: PASS — Section `## Notes` của contract.md có đủ bốn khối với nội dung thật, không chỉ tiêu đề: (1) bảng "Ba dòng số" có số cụ thể (184′, 1 lượt chấm, 4/0 và 3/0 lượt gọi người, 0 vòng bị đốt) kèm cách đếm nêu rõ nguồn (frontmatter từng revision qua git show, run-log.jsonl); phần "điền ở làn ghim lại" cho hồ sơ mốc tự nó là được giải thích minh bạch (Known limits: thời gian chỉ biết sau chữ ký), không phải chỗ trống vô cớ. (2) Bảng lớp vendored liệt đủ 9 mục (4 mục có +/− cụ thể, 5 mục còn lại = 0) và ghi rõ nguồn đo (`git diff --numstat 04069351..HEAD`). (3) Lớp lỗi tái phát gọi tên 4 mục cụ thể có dẫn chứng (frontmatterField S4-r5, docs/research/so-vap-trien-khai.md, v.v.). (4) Nhát cắt kế gọi tên cụ thể ("hồ sơ mốc phát hành đừng mang bản vá code") kèm hai lối và khuyến nghị rõ ràng.
    - spec-alignment: PASS — Section `## Notes` của contract.md có đủ bốn khối với nội dung THẬT, không chỉ tiêu đề: (1) bảng "Ba dòng số của luật (c)" có số cụ thể cho vòng #165 (184′, 1 lượt chấm, 4/0, 0/1) kèm nguồn rút rõ (sha `8f6a6bac`→`befa12ee`, `run-log.jsonl` field `round`), hàng của chính hồ sơ mốc có 3/0 lượt gọi người với nguồn liệt kê 3 cổng cụ thể (Phạm vi/Gate 1.5/Bằng chứng), ba ô còn lại ghi "điền ở làn ghim lại" kèm lý do (chỉ biết sau chữ ký) — khớp đúng ngoại lệ mà chính AC-9 và Known limits đã khai trước, không phải bỏ trống tuỳ tiện; (2) bảng lớp vendored liệt đủ 9 mục của INIT-CI-COPY-LIST (4 dòng riêng + 1 dòng gộp 5 tên) kèm số +/− cụ thể và nguồn `git diff --numstat 04069351..HEAD`; (3) khối "Lớp lỗi TÁI PHÁT" có 4 mục cụ thể, dẫn chứng tên hàm/file/khoảng cách dòng; (4) khối "Nhát cắt cho cửa sổ kế" gọi tên rõ MỘT chỗ cắt (mốc phát hành không nên mang vá code) kèm hai lối cụ thể và khuyến nghị chọn (b) có căn cứ tiền lệ 2.7.0.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval xanh-cả-hai-phía (không phân biệt bản mới với baseline — chứng minh harness, không phải feature; xem lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E8a (`bash tests/scripts/run-tests.sh`) — suite scripts xanh trên cả HEAD lẫn diffBase.
- E8b (`bash tests/hooks/run-tests.sh`) — suite hooks xanh trên cả HEAD lẫn diffBase.
- E8d (`bash tests/workflows/run-tests.sh`) — suite workflows xanh trên cả HEAD lẫn diffBase.
- E8e (`node scripts/product-map.mjs --root . --check`) — bản đồ xưởng khớp trên cả HEAD lẫn diffBase.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E8c failed (`bash tests/plugins/run-tests.sh`, suite plugins — MUTANT-2 "da go ma eval khoi item" không bị bắt dừng trong bản đột biến gate-card.js) — exit 1. Trả về giai đoạn implementation.
