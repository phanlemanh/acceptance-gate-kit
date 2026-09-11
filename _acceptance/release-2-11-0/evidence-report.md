---
schema_version: 2
feature_slug: release-2-11-0
verdict: REJECT
failed_evals: [E8c]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 17ff3fcf37145e444bdfce0033efe3dfc45cce34
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
  run_id: minted-release-2-11-0-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E2
  run_id: minted-release-2-11-0-E2-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E3
  run_id: minted-release-2-11-0-E3-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4
  run_id: minted-release-2-11-0-E4-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4b
  run_id: minted-release-2-11-0-E4b-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E5
  run_id: minted-release-2-11-0-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E6
  run_id: minted-release-2-11-0-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-11T02:15:00Z
  output: |
         P200 VE: muc v2.11.0 cua feature-loop TU khai cap
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E7
  run_id: minted-release-2-11-0-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T02:15:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 (doi chung duong: so tai moc KHAC so tai cha)

- eval: E8a
  run_id: minted-release-2-11-0-E8a-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T02:15:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 863 passed, 0 failed

- eval: E8b
  run_id: minted-release-2-11-0-E8b-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-11T02:15:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E8c
  run_id: minted-release-2-11-0-E8c-r3
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-11T02:15:00Z
  output: |
    P185 khoi VIEC-CUA-ANH Cong 1: 3 ve + mau 1 dong + vi tri truoc foot (E1)
         [draft] khoi OK, 0 loi hua phut
         [approved] khoi OK, 0 loi hua phut
    MUTANT: da go 9 dong mang khoi khoi ban sao gate-card.js
      PASS: P185 khoi VIEC-CUA-ANH Cong 1 (2 nhanh status + mutant)
    P186 khoi VIEC-CUA-ANH Cong 2: du 4 loai viec + mau gop 1 dong (E2)
    MUTANT: da go nhanh liet ke judgment khoi ban sao gate-

- eval: E8d
  run_id: minted-release-2-11-0-E8d-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-11T02:15:00Z
  output: |
      PASS: skill-claims.test.mjs: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E8e
  run_id: minted-release-2-11-0-E8e-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-11T02:15:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E9
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS (đề xuất panel — chờ human_override tại Gate 2)
  votes:
    - domain-correctness: PASS — Section `## Notes` của contract.md có đủ bốn khối với nội dung thật, không chỉ tiêu đề: (1) bảng "Ba dòng số của luật (c)" ghi đủ 184′/3h04, số lượt chấm (1 và 3), lượt gọi người tách trong/ngoài thiết kế (4/0 và 4/1), số vòng bị hạ tầng đốt (0 và 3), mỗi số dẫn nguồn cụ thể (sha `8f6a6bac`→`befa12ee`, `run-log.jsonl` field `round`, so sánh với TB 417′ mốc trước); (2) bảng "Lớp vendored" liệt đủ 9 mục của INIT-CI-COPY-LIST kèm +/- dòng (vd `+321/-17`, `+48/-1`) đo tại sha `56805d48`, kèm cả một lần tự-sửa số (258/16 → 260/16) cho thấy số này đọc từ lệnh thật; (3) "Lớp lỗi TÁI PHÁT" gọi tên 5 lớp cụ thể kèm bằng chứng định vị (frontmatterField tự vá ở S4-r5, danh sách CI-copy trễ, TOOL-KILL-RULE đốt 3 mốc liên tiếp, lỗ `id` bọc nháy ở `parseEvals`); (4) "Nhát cắt cho cửa sổ kế" gọi tên rõ MỘT nhát cắt số một (tách bản vá khỏi hồ sơ mốc, hoặc sửa trần theo "=số cổng thiết kế") kèm khuyến nghị (b) và căn cứ số (3 mốc liên tiếp trượt trần, nguyên nhân cấu trúc T3=3 cổng).
    - operational-feasibility: PASS — Section `## Notes` của contract.md chứa đủ bốn khối với số thật có nguồn rút: (1) bảng "Ba dòng số của luật (c)" — 184′/3h04 (nguồn: sha implemented 8f6a6bac → signed-off befa12ee), lượt chấm =1 và =3 (nguồn run-log.jsonl), lượt gọi người 4/0 và 4/1 kèm giải thích chạm/lượt, hạ tầng đốt 0 và 3 kèm mô tả cụ thể từng lượt bị tool-kill; (2) bảng lớp vendored liệt đủ 9 mục (4 dòng có số +/− tại sha `56805d48`, 5 dòng gộp "0"), có dẫn lệnh `git diff --numstat 04069351..HEAD`; (3) mục "Lớp lỗi TÁI PHÁT" gọi tên rõ 2 lớp tái phát (bóc-nháy-vô-điều-kiện ba mốc liên tiếp, TOOL-KILL-RULE ba mốc liên tiếp) kèm bằng chứng cụ thể; (4) mục "Nhát cắt cho cửa sổ kế" gọi tên ba nhát cắt cụ thể (mốc mang vá code / TOOL-KILL-RULE thiếu răng / phiên nghiệm thu gộp) kèm số minh hoạ (2.9.0=2, 2.10.0=2, 2.11.0=3 lượt gọi người). Một ô (thời gian làm-xong→quyết-được của chính hồ sơ mốc) để trống có chủ đích với lý do tường minh (chỉ biết sau chữ ký, ghi rõ ở Known limits) — không phải khối rỗng-không-số.
    - spec-alignment: PASS — Section `## Notes` của contract.md có đủ bốn khối với nội dung số cụ thể, không chỉ tiêu đề: (1) bảng "Ba dòng số của luật (c)" có 184′/3/4-1/3 kèm nguồn rút rõ (`git show <sha>:contract` cho `implemented`/`signed-off`, `run-log.jsonl` cho lượt chấm); (2) "Lớp vendored" liệt đủ 9 mục của INIT-CI-COPY-LIST với +/- dòng cụ thể tại sha `56805d48` từ `git diff --numstat`; (3) "Lớp lỗi TÁI PHÁT" liệt 5 mục gọi tên cụ thể (bóc nháy vô điều kiện, danh sách CI trễ, ba-dòng-số-là-văn, TOOL-KILL-RULE không răng, lỗ id parseEvals); (4) "Nhát cắt cho cửa sổ kế" gọi tên nhát cắt số một cụ thể (tách bản vá khỏi hồ sơ mốc hoặc sửa trần theo số cổng thiết kế) kèm khuyến nghị (b) và căn cứ số.
  rationale: Cả ba lens đồng thuận PASS trên cùng một căn cứ (bốn khối của `## Notes` trong contract.md đều mang số có nguồn rút cụ thể, không phải văn suông); chi tiết từng lens ở "votes" trên.
  human_override:

- eval: E10
  run_id: minted-release-2-11-0-E10-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E11
  run_id: minted-release-2-11-0-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T02:15:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 (doi chung duong: so tai moc KHAC so tai cha)

- eval: E12
  run_id: minted-release-2-11-0-E12-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:15:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

## Known limits

## Ngoài hợp đồng

## Analyst

E8a, E8b, E8d, E8e — xanh trên cả HEAD lẫn baseline diffBase (regression-guard bình thường của suite scripts/hooks/workflows và `product-map.mjs --check`, không phải phép đo phân biệt riêng của tính năng release-2-11-0).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: E8c thất bại (`bash tests/plugins/run-tests.sh`, exit 1) — chuỗi test dừng giữa case P186 (khối VIỆC-CỦA-ANH Cổng 2), dòng cuối bị cắt tại "MUTANT: da go nhanh liet ke judgment khoi ban sao gate-" (đầu ra không tới được dòng PASS/FAIL của P186); không có lệnh fail nào khác không gắn eval — `bash tests/plugins/run-tests.sh` map trọn vẹn vào E8c. Quay lại triển khai.