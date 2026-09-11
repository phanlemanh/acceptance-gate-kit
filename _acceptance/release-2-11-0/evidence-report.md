---
schema_version: 2
feature_slug: release-2-11-0
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cd8b3403bbc13cf886979800ef3711c50258806d
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
| E8c | AC-8 | test | PASS |
| E8d | AC-8 | test | PASS |
| E8e | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-11-0-E1-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E2
  run_id: minted-release-2-11-0-E2-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E3
  run_id: minted-release-2-11-0-E3-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4
  run_id: minted-release-2-11-0-E4-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4b
  run_id: minted-release-2-11-0-E4b-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E5
  run_id: minted-release-2-11-0-E5-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E6
  run_id: minted-release-2-11-0-E6-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-11T05:40:00Z
  output: |
         P200 VE: muc v2.11.0 cua feature-loop TU khai cap
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E7
  run_id: minted-release-2-11-0-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T05:40:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong)

- eval: E8a
  run_id: minted-release-2-11-0-E8a-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T05:40:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 863 passed, 0 failed

- eval: E8b
  run_id: minted-release-2-11-0-E8b-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-11T05:40:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E8c
  run_id: minted-release-2-11-0-E8c-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-11T05:40:00Z
  output: |
      PASS: ca lop nhin thay — LNT6 (ho so lop-bang-chung-nhin-thay)

    Results: all plugin tests passed

- eval: E8d
  run_id: minted-release-2-11-0-E8d-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-11T05:40:00Z
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E8e
  run_id: minted-release-2-11-0-E8e-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-11T05:40:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E9
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS (đề xuất panel — chờ human_override tại Gate 2, T3 bắt buộc trên MỌI judgment item)
  votes:
    - domain-correctness: PASS — Section ## Notes của contract.md chứa đủ bốn khối với nội dung số thật, không chỉ tiêu đề: (1) "Ba dòng số của luật (c)" là bảng có số cụ thể (184′, lượt chấm 1/3, lượt gọi người 4/0 và 4/1, hạ tầng đốt 0/3) kèm nguồn rút rõ (git show <sha>:contract cho status frontmatter, run-log.jsonl cho round); (2) bảng lớp vendored đủ 9 mục của INIT-CI-COPY-LIST với +/- numstat tại sha 56805d48 nêu rõ; (3) khối "Lớp lỗi TÁI PHÁT" liệt kê 5 mục cụ thể có tên hàm/file; (4) khối "Nhát cắt cho cửa sổ kế" gọi tên 3 nhát cắt cụ thể kèm khuyến nghị (b) có căn cứ. Ô "làm-xong→quyết-được" của chính mốc để trống có giải thích rõ ràng (chỉ biết sau chữ ký, ghim ở làn re-pin) chứ không phải khối rỗng.
    - operational-feasibility: PASS — Section `## Notes` chứa đủ bốn khối với nội dung thật, không chỉ tiêu đề: (1) bảng "Ba dòng số của luật (c)" có hai dòng số cụ thể (184′/1/4-0/0 cho #165; 3/4-1/3 cho hồ sơ mốc) kèm cách đếm và nguồn rút tường minh (`git show <sha>:<contract>` cho `implemented`/`signed-off`, `run-log.jsonl` cho `round`); (2) bảng lớp vendored liệt đủ 9 mục của `INIT-CI-COPY-LIST` với số +/− cụ thể, nguồn ghi rõ là "đo tại `56805d48`" qua `git diff --numstat`; (3) mục "Lớp lỗi TÁI PHÁT" nêu tên 5 lớp cụ thể kèm cơ chế; (4) "Nhát cắt cho cửa sổ kế" gọi tên nhát cắt số một cụ thể (tách hồ sơ mốc khỏi bản vá code hoặc đổi trần) kèm khuyến nghị (b) và căn cứ số. Ô "điền ở làn ghim lại" (thời gian làm-xong→quyết-được của chính mốc) là ngoại lệ được AC-9 khai trước và có lý do (chỉ biết sau chữ ký), không phải một số thiếu nguồn.
    - spec-alignment: PASS — Section `## Notes` của contract.md có đủ bốn khối và mỗi khối đều có số thật kèm nguồn rút: (1) bảng "Ba dòng số của luật (c)" nêu 184′ (nguồn `8f6a6bac`→`befa12ee`), lượt chấm 1/3 (nguồn run-log.jsonl), lượt gọi người 4/0 và 4/1 kèm giải thích chạm; (2) bảng lớp vendored đủ 9 mục (4 dòng có số +/− riêng, 5 mục gộp = 0), số đo tại sha `56805d48` qua `git diff --numstat`, kèm cả một lần tự sửa số (258/16 → 260/16) cho thấy số không phải gõ tay; (3) mục "Lớp lỗi TÁI PHÁT" liệt kê 5 lớp cụ thể có tên hàm/file; (4) mục "Nhát cắt cho cửa sổ kế" gọi tên rõ ba nhát cắt (số một có hai lối a/b kèm khuyến nghị, số hai, số ba) — vượt yêu cầu tối thiểu một chỗ cắt có tên.
  rationale: Cả ba lens đồng thuận PASS trên cùng một căn cứ (bốn khối của `## Notes` trong contract.md đều mang số có nguồn rút cụ thể, không phải văn suông); chi tiết từng lens ở "votes" trên. Hợp đồng này risk_tier T3 nên verdict tổng của báo cáo vẫn PENDING-JUDGMENT cho tới khi người tự kiểm và điền human_override trên chính mục này, bất kể ba lens đã đồng thuận PASS.
  human_override:

- eval: E10
  run_id: minted-release-2-11-0-E10-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E11
  run_id: minted-release-2-11-0-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T05:40:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong)

- eval: E12
  run_id: minted-release-2-11-0-E12-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T05:40:00Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

## Known limits

## Ngoài hợp đồng

## Analyst

E6, E8a, E8b, E8c, E8d, E8e — xanh trên cả HEAD lẫn baseline diffBase trong vòng này (E6 kiểm bất biến semver tĩnh của manifest, không phải hành vi mới; E8a/E8b/E8d/E8e là regression-guard chuẩn của suite scripts/hooks/workflows và `product-map.mjs --check`; E8c chuyển từ đỏ ở round 3 sang xanh-trên-cả-hai ở round 4 sau khi vá P185/P186 — không còn phân biệt được bản vá của riêng release-2-11-0, cần xem lại có nên viết lại thành assert hành vi mới hay xác nhận là regression-guard có chủ ý).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: E8c thất bại (`bash tests/plugins/run-tests.sh`, exit 1) — chuỗi test dừng giữa case P186 (khối VIỆC-CỦA-ANH Cổng 2), dòng cuối bị cắt tại "MUTANT: da go nhanh liet ke judgment khoi ban sao gate-" (đầu ra không tới được dòng PASS/FAIL của P186); không có lệnh fail nào khác không gắn eval — `bash tests/plugins/run-tests.sh` map trọn vẹn vào E8c. Quay lại triển khai.
Round 4: Toàn bộ 16 eval máy (E1-E8e, E10-E12) PASS, bao gồm E8c đã vá (suite plugins xanh trọn — "all plugin tests passed"); duy nhất E9 (judgment, AC-9) còn chờ human_override vì hợp đồng risk_tier T3 đòi xác nhận người trên MỌI judgment item bất kể phiếu panel — verdict tổng PENDING-JUDGMENT, chuyển Gate 2.