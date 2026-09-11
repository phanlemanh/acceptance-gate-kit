---
schema_version: 2
feature_slug: release-2-11-0
verdict: REJECT
failed_evals: ["E8c"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cdae2b588cd05876cb55ccbfef7786a4abb187be
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
  run_id: minted-release-2-11-0-E1-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E2
  run_id: minted-release-2-11-0-E2-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E3
  run_id: minted-release-2-11-0-E3-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4
  run_id: minted-release-2-11-0-E4-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E4b
  run_id: minted-release-2-11-0-E4b-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E5
  run_id: minted-release-2-11-0-E5-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E6
  run_id: minted-release-2-11-0-E6-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-11T02:52:33Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E7
  run_id: minted-release-2-11-0-E7-r4
  exit_code: 0
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T01:18:21Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta round 5 khong cham paths cua eval E7 (AC-7); frame/output goc xem Iterations round 4 va evidence-report round 4.

- eval: E8a
  run_id: minted-release-2-11-0-E8a-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T02:52:33Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 863 passed, 0 failed

- eval: E8b
  run_id: minted-release-2-11-0-E8b-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-11T02:52:33Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E8c
  run_id: minted-release-2-11-0-E8c-r5
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-11T02:52:33Z
  output: |
    P186 khoi VIEC-CUA-ANH Cong 2: du 4 loai viec + mau gop 1 dong (E2)
    MUTANT: da go nhanh liet ke judgment khoi ban sao gate-card.js
    MUTANT-PHUT: da chen lai ' · ~5 phut' vao phu de the Cong 2
         MUTANT-PHUT bi bat dung — chan khong-hua-phut (chinh doan cham cua P185/P186) DO
         doi chung duong: the nguyen ven qua duoc chan khong-hua-phut OK
    MUTANT-2: da go ma eval khoi item 'Vi
    [OUTPUT TRUNCATED - test ran to completion]

- eval: E8d
  run_id: minted-release-2-11-0-E8d-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-11T02:52:33Z
  output: |
    Results: all workflow tests passed

- eval: E8e
  run_id: minted-release-2-11-0-E8e-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-11T02:52:33Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E9
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS (đề xuất panel — chờ human_override tại Gate 2, T3 bắt buộc trên MỌI judgment item; verdict tổng round này là REJECT vì E8c thất bại nên panel này không tự nâng báo cáo lên PASS/PENDING-JUDGMENT)
  verified_at: 2026-09-11T02:52:33Z
  votes:
    - domain-correctness: PASS — Section `## Notes` chứa đủ bốn khối với nội dung thật, không chỉ tiêu đề: (1) "Ba dòng số của luật (c)" có bảng số cụ thể (184′, lượt chấm 1/3, 4/0 và 4/1, hạ tầng đốt 0/3) kèm nguồn rút rõ (sha `8f6a6bac`→`befa12ee`, `run-log.jsonl`, frontmatter từng revision qua `git show <sha>:<contract>`); (2) bảng "Lớp vendored" liệt đủ 9 mục của INIT-CI-COPY-LIST với số +/- cụ thể, nguồn ghi rõ là `git diff --numstat 04069351..HEAD` đo tại sha `56805d48`; (3) "Lớp lỗi TÁI PHÁT" liệt 5 mục cụ thể có dẫn chứng (S4-r5, `docs/research/so-vap-trien-khai.md`, hai lượt tool-kill có sha/chi tiết); (4) "Nhát cắt cho cửa sổ kế" gọi tên rõ ba nhát cắt kèm căn cứ số (trượt trần 3 mốc liên tiếp, 2 lối a/b có khuyến nghị). Riêng ô "làm-xong→quyết-được" của chính hồ sơ này để trống ("điền ở làn ghim lại") nhưng được AC-9 khai trước là Known limit hợp lệ (chỉ biết sau chữ ký), không phải khối rỗng hình thức.
    - operational-feasibility: PASS — Section `## Notes` của contract.md chứa đủ bốn khối, mỗi khối có số thật kèm nguồn rút: (1) "Ba dòng số của luật (c)" có bảng 2 vòng với số cụ thể (184′, lượt chấm 1/3, gọi người 4/0 và 4/1, hạ tầng đốt 0/3), nguồn ghi rõ là revision sha (`8f6a6bac`→`befa12ee`) và `run-log.jsonl`; (2) "Lớp vendored" liệt đủ 9 mục của INIT-CI-COPY-LIST (4 dòng riêng + 1 dòng gộp 5 file "0") với số +/- đo tại sha `56805d48` qua `git diff --numstat`; (3) "Lớp lỗi TÁI PHÁT" liệt 5 mục cụ thể có dẫn chứng (frontmatterField tại S4-r5, docs/research, v.v.); (4) "Nhát cắt cho cửa sổ kế" gọi tên 3 nhát cắt cụ thể kèm căn cứ số (ba mốc trượt trần, dòng 3 đốt lượt chấm). Không khối nào chỉ có tiêu đề trống.
    - spec-alignment: PASS — Section `## Notes` của contract.md có đủ bốn khối với nội dung số thật, không chỉ tiêu đề: (1) bảng "Ba dòng số của luật (c)" có 184′/1/4-0/0 và 3/4-1/3 kèm nguồn rút rõ (`git show <sha>:contract` cho status, `run-log.jsonl` round cho lượt chấm) — riêng ô làm-xong→quyết-được của chính hồ sơ này để trống nhưng được chính AC-9 khai rõ là nằm ngoài phạm vi AC-9 và ghim sau ở làn re-pin, không phải số bị giấu; (2) bảng lớp vendored liệt đủ 9 mục (4 dòng riêng + 5 mục gộp một dòng) với +/- tại sha `56805d48` có nêu nguồn (`git diff --numstat`); (3) mục "Lớp lỗi TÁI PHÁT" gọi tên 5 lớp cụ thể kèm căn cứ; (4) mục "Nhát cắt cho cửa sổ kế" gọi tên ba nhát cắt cụ thể kèm khuyến nghị.
  rationale: Cả ba lens đồng thuận PASS trên cùng một căn cứ — bốn khối của `## Notes` trong contract.md đều mang số có nguồn rút cụ thể, không phải văn suông; chi tiết từng lens ở "votes" trên. Hợp đồng risk_tier T3 nên PASS panel vẫn cần human_override tại Gate 2 trên chính mục này trước khi được tính là chốt; vòng này báo cáo tổng dừng ở REJECT (E8c thất bại) nên E9 quay lại chờ ở vòng kế, không phải vì panel bất đồng.
  human_override:

- eval: E10
  run_id: minted-release-2-11-0-E10-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

- eval: E11
  run_id: minted-release-2-11-0-E11-r4
  exit_code: 0
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T01:18:21Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta round 5 khong cham paths cua eval E11 (AC-11); frame/output goc xem Iterations round 4 va evidence-report round 4.

- eval: E12
  run_id: minted-release-2-11-0-E12-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:52:33Z
  output: |
         [chieu do] BG7 -> DO
    PASS: BG5 chieu do tren ban sao TRON CAY (3 dot bien, doi chung duong xanh, bam doi, ghim BG1+BG3+BG4+BG7)
    bo-giai-nhay OK (9 chan)

## Known limits

## Ngoài hợp đồng

## Analyst

E6, E8a, E8b, E8d, E8e — xanh trên cả HEAD lẫn baseline diffBase trong vòng này (E6 kiểm bất biến semver tĩnh của manifest, không phải hành vi mới của round 5; E8a/E8b/E8d là regression-guard chuẩn của suite scripts/hooks/workflows; E8e là regression-guard của `product-map.mjs --check`). E8c KHÔNG nằm trong danh sách này vì round 5 nó đỏ (exit 1) — regression thật, không phải non-discriminating.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: E8c thất bại (`bash tests/plugins/run-tests.sh`, exit 1) — chuỗi test dừng giữa case P186 (khối VIỆC-CỦA-ANH Cổng 2), dòng cuối bị cắt tại "MUTANT: da go nhanh liet ke judgment khoi ban sao gate-" (đầu ra không tới được dòng PASS/FAIL của P186); không có lệnh fail nào khác không gắn eval — `bash tests/plugins/run-tests.sh` map trọn vẹn vào E8c. Quay lại triển khai.
Round 4: Toàn bộ 16 eval máy (E1-E8e, E10-E12) PASS, bao gồm E8c đã vá (suite plugins xanh trọn — "all plugin tests passed"); duy nhất E9 (judgment, AC-9) còn chờ human_override vì hợp đồng risk_tier T3 đòi xác nhận người trên MỌI judgment item bất kể phiếu panel — verdict tổng PENDING-JUDGMENT, chuyển Gate 2.
Round 5: E8c thất bại lại (`bash tests/plugins/run-tests.sh`, exit 1) — lần này chuỗi test dừng muộn hơn round 3, sau khi case MUTANT-PHUT của P186 đã qua ("MUTANT-PHUT bi bat dung ... OK"), nhưng cắt giữa case MUTANT-2 (đã gỡ mã eval khỏi item 'Ví dụ'), không tới được dòng PASS/FAIL của case đó; 16 eval máy còn lại (bao gồm E7/E11 carry-forward từ round 4) vẫn PASS, E9 (judgment) panel vẫn đồng thuận PASS nhưng chưa được tính vì verdict tổng đã REJECT. Quay lại triển khai.