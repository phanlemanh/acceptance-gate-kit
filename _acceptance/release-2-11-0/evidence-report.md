---
schema_version: 2
feature_slug: release-2-11-0
verdict: REJECT
failed_evals: [E8c]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d383e95806ff97e802a9e515417c8c7614b6e3b8
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
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-11-0-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E2
  run_id: minted-release-2-11-0-E2-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E3
  run_id: minted-release-2-11-0-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4
  run_id: minted-release-2-11-0-E4-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4b
  run_id: minted-release-2-11-0-E4b-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E5
  run_id: minted-release-2-11-0-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E6
  run_id: minted-release-2-11-0-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-11T09:00:00Z
  output: |
         P200 VE: muc v2.11.0 cua feature-loop TU khai cap
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E7
  run_id: minted-release-2-11-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T09:00:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 (doi chung duong: chinh moc do cham diagram-design/)

- eval: E8a
  run_id: minted-release-2-11-0-E8a-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 863 passed, 0 failed

- eval: E8b
  run_id: minted-release-2-11-0-E8b-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-11T09:00:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E8c
  run_id: minted-release-2-11-0-E8c-r2
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-11T09:00:00Z
  output: |
    MUTANT-PHUT: da chen lai ' · ~5 phut' vao phu de the Cong 2
         MUTANT-PHUT bi bat dung — chan khong-hua-phut (chinh doan cham cua P185/P186) DO
         doi chung duong: the nguyen ven qua duoc chan khong-hua-phut OK
    MUTANT-2: da go ma eval khoi item 'Viec
    (output truncated - 19854 characters)

- eval: E8d
  run_id: minted-release-2-11-0-E8d-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-11T09:00:00Z
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E8e
  run_id: minted-release-2-11-0-E8e-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-11T09:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E9
  run_id: minted-release-2-11-0-E9-r2
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  verifier: judgment panel (domain-correctness, operational-feasibility, spec-alignment)
  verified_at: 2026-09-11T09:00:00Z
  votes:
    - domain-correctness: PASS — Section ## Notes của contract.md có đủ bốn khối với nội dung thật, không chỉ tiêu đề: (1) bảng "Ba dòng số của luật (c)" có đủ 4 cột số (thời gian 184′, lượt chấm 1/2, lượt gọi người 4/0 và 3/1, hạ tầng đốt 0/2) kèm nguồn rút cụ thể (sha `8f6a6bac`→`befa12ee`, `run-log.jsonl`, so sánh với TB 417′ mốc trước); (2) bảng lớp vendored đủ 9 mục (4 file có số +/− riêng, 5 file gộp một dòng "0") đo tại sha `56805d48` từ `git diff --numstat 04069351..HEAD`, kèm cả một lỗi tự phát hiện (258/16 vs 260/16) chứng tỏ số được đọc thật chứ không gõ tay; (3) "Lớp lỗi TÁI PHÁT" liệt 5 mục có tên cụ thể (bóc nháy vô điều kiện, danh sách CI, ba-dòng-số-là-văn, TOOL-KILL-RULE, lỗ `id` mới); (4) "Nhát cắt cho cửa sổ kế" gọi tên 3 nhát cắt cụ thể kèm hai lối (a)/(b) và khuyến nghị rõ ràng. Không khối nào trơ số hay không nói được nguồn.
    - operational-feasibility: PASS — Section `## Notes` của contract.md có đủ bốn khối với nội dung thật, không chỉ tiêu đề: (1) bảng "Ba dòng số của luật (c)" có số cụ thể (184′, lượt chấm 1/2, lượt gọi người 4/0 và 3/1, hạ tầng đốt 0 và 2) kèm nguồn rút rõ (`git show <sha>:<contract>` với sha đặt tên `8f6a6bac`/`befa12ee`, `run-log.jsonl` field `round`); (2) bảng lớp vendored liệt đủ 9 mục của INIT-CI-COPY-LIST (4 dòng riêng + 1 dòng gộp 5 file) kèm +/- tại sha `56805d48` nêu rõ nguồn là `git diff --numstat 04069351..HEAD`; (3) mục "Lớp lỗi TÁI PHÁT" gọi tên cụ thể 5 lớp lỗi kèm bằng chứng (vd. `frontmatterField` tự vá cùng lớp ở S4-r5, danh sách CI 4/9 mục đổi); (4) mục "Nhát cắt cho cửa sổ kế" gọi tên MỘT nhát cắt số một cụ thể (hồ sơ mốc đừng mang bản vá code) kèm hai lối (a)/(b) và khuyến nghị rõ ràng, cộng nhát cắt số hai/ba bổ sung.
    - spec-alignment: PASS — Section `## Notes` của contract.md chứa đủ bốn khối, mỗi khối có số thật kèm nguồn rút: (1) "Ba dòng số của luật (c)" có bảng số (184′, lượt chấm 1/2, lượt người 4/0 và 3/1, đốt 0/2) và văn giải thích nguồn — sha cụ thể (`8f6a6bac`, `befa12ee`) qua `git show <sha>:<contract>` và `run-log.jsonl` field `round`; (2) bảng lớp vendored đủ 9 mục (4 dòng riêng + 1 dòng gộp 5 tên) với +/− số dòng đo tại sha `56805d48` qua `git diff --numstat`; (3) "Lớp lỗi TÁI PHÁT" liệt 5 mục có tên cụ thể (bóc nháy vô điều kiện, TOOL-KILL-RULE...) kèm dẫn chứng mốc trước; (4) "Nhát cắt cho cửa sổ kế" gọi tên nhát cắt số một cụ thể (mốc phát hành đừng mang bản vá code) kèm hai lối và khuyến nghị. Không khối nào chỉ có tiêu đề rỗng.
  rationale: Ba lens đồng thuận PASS trên cùng bốn tiêu chí (bảng ba dòng số có nguồn, bảng lớp vendored đủ 9 mục có nguồn diff, lớp lỗi tái phát gọi tên cụ thể, nhát cắt cho cửa sổ kế gọi tên rõ) — không có dissent.

- eval: E10
  run_id: minted-release-2-11-0-E10-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E11
  run_id: minted-release-2-11-0-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T09:00:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 (doi chung duong: chinh moc do cham diagram-design/)

- eval: E12
  run_id: minted-release-2-11-0-E12-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T09:00:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

## Known limits

## Ngoài hợp đồng

## Analyst

Eval xanh-cả-hai-phía (không phân biệt bản mới với baseline — chứng minh harness, không phải feature; xem lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E6 (`bash -c 'set -o pipefail; ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh | grep -F P200'`) — P200 xanh trên cả HEAD lẫn diffBase.
- E8a (`bash tests/scripts/run-tests.sh`) — suite scripts xanh trên cả HEAD lẫn diffBase.
- E8b (`bash tests/hooks/run-tests.sh`) — suite hooks xanh trên cả HEAD lẫn diffBase.
- E8d (`bash tests/workflows/run-tests.sh`) — suite workflows xanh trên cả HEAD lẫn diffBase.
- E8e (`node scripts/product-map.mjs --root . --check`) — bản đồ xưởng khớp trên cả HEAD lẫn diffBase.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E8c failed (`bash tests/plugins/run-tests.sh`, suite plugins — MUTANT-2 "da go ma eval khoi item" không bị bắt dừng trong bản đột biến gate-card.js) — exit 1. Trả về giai đoạn implementation.
Round 2: E8c failed again (`bash tests/plugins/run-tests.sh`, suite plugins — MUTANT-PHUT bị chặn đúng (DO), nhưng MUTANT-2 "da go ma eval khoi item" vẫn không bị chặn; đầu ra bị TOOL cắt ở 19854 ký tự nên không đọc được dòng kết luận đầy đủ) — exit 1. Trả về giai đoạn implementation.
