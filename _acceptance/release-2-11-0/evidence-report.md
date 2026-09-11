---
schema_version: 2
feature_slug: release-2-11-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4d61b2a332e6cb8c4f7824946c0679b814c005e4
human_signoff: Manh Phan 2026-09-11
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
  run_id: minted-release-2-11-0-E1-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E1 (AC-1); frame/output goc xem Iterations round 5 va evidence-report round 5.

- eval: E2
  run_id: minted-release-2-11-0-E2-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E2 (AC-2); frame/output goc xem Iterations round 5 va evidence-report round 5.

- eval: E3
  run_id: minted-release-2-11-0-E3-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E3 (AC-3); frame/output goc xem Iterations round 5 va evidence-report round 5.

- eval: E4
  run_id: minted-release-2-11-0-E4-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E4 (AC-4); frame/output goc xem Iterations round 5 va evidence-report round 5.

- eval: E4b
  run_id: minted-release-2-11-0-E4b-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E4b (AC-4); frame/output goc xem Iterations round 5 va evidence-report round 5.

- eval: E5
  run_id: minted-release-2-11-0-E5-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E5 (AC-5); frame/output goc xem Iterations round 5 va evidence-report round 5.

- eval: E6
  run_id: minted-release-2-11-0-E6-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-11T03:48:56Z
  output: |
         P200 VE: muc v2.11.0 cua feature-loop TU khai cap
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E7
  run_id: minted-release-2-11-0-E7-r4
  exit_code: 0
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T01:18:21Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta round 5 va round 6 khong cham paths cua eval E7 (AC-7); frame/output goc xem Iterations round 4 va evidence-report round 4.

- eval: E8a
  run_id: minted-release-2-11-0-E8a-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T03:48:56Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 863 passed, 0 failed

- eval: E8b
  run_id: minted-release-2-11-0-E8b-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-11T03:48:56Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E8c
  run_id: minted-release-2-11-0-E8c-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-11T03:48:56Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E8d
  run_id: minted-release-2-11-0-E8d-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-11T03:48:56Z
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E8e
  run_id: minted-release-2-11-0-E8e-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-11T03:48:56Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E9
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS (đề xuất panel — chờ human_override tại Gate 2, T3 bắt buộc trên MỌI judgment item bất kể phiếu panel)
  verified_at: 2026-09-11T03:48:56Z
  votes:
    - domain-correctness: PASS — Section `## Notes` của contract.md chứa đủ bốn khối với nội dung thật, có số và nguồn rút cụ thể: (1) bảng "Ba dòng số của luật (c)" có 184′/3h04, lượt chấm=1 và 3, lượt gọi người 4/0 và 4/1, hạ tầng đốt 0 và 3, kèm nguồn `git show <sha>:<contract>` và `run-log.jsonl` (ô làm-xong→quyết-được của chính hồ sơ mốc được khai rõ là cố ý để trống, dẫn chiếu Known limits vì chỉ biết sau chữ ký — không phải bỏ sót); (2) bảng "Lớp vendored" đủ 9 mục INIT-CI-COPY-LIST với số +/− tại sha `56805d48` (kèm chuyện S4 tự bắt lỗi số +258/-16 vs 260/16); (3) "Lớp lỗi TÁI PHÁT" liệt 5 mục cụ thể có dẫn chứng (frontmatterField S4-r5, 4/9 mục CI, TOOL-KILL-RULE 3 mốc liên tiếp...); (4) "Nhát cắt cho cửa sổ kế" gọi tên 3 nhát cắt cụ thể kèm hai lối (a)/(b) và khuyến nghị.
    - operational-feasibility: PASS — Section `## Notes` của contract.md chứa đủ bốn khối với nội dung số thật, không chỉ tiêu đề: (1) "Ba dòng số của luật (c)" có bảng số (184′, 1 lượt chấm, 4/0 lượt gọi người, 0 hạ tầng đốt cho vòng #165; 3/4-1/3 cho hồ sơ mốc) kèm nguồn rút tường minh (`git show <sha>:contract` cho status, `run-log.jsonl` round, sha cụ thể 8f6a6bac/befa12ee); (2) "Lớp vendored" có bảng đủ 9 mục (4 dòng riêng + 1 dòng gộp 5 file) với số +/- dòng đo tại sha `56805d48` qua `git diff --numstat`; (3) "Lớp lỗi TÁI PHÁT" liệt kê 5 mục cụ thể có tên hàm/file và bằng chứng; (4) "Nhát cắt cho cửa sổ kế" gọi tên 3 nhát cắt cụ thể kèm hai lối chọn (a)/(b) và khuyến nghị. Trường hợp duy nhất thiếu số ("làm-xong→quyết-được" của chính hồ sơ mốc) được giải thích rõ là cố ý hoãn tới làn re-pin sau chữ ký (đúng logic AC-9 tự khai), không phải một khối rỗng.
    - spec-alignment: PASS — Section `## Notes` của contract.md chứa đủ bốn khối với nội dung số thật, không chỉ tiêu đề: (1) "Ba dòng số của luật (c)" có bảng 184′/1/4-0/0 và 3/4-1/3 kèm nguồn rút tường minh (sha `8f6a6bac`→`befa12ee`, `run-log.jsonl` round); (2) "Lớp vendored" liệt đủ 9 mục của INIT-CI-COPY-LIST (4 dòng riêng + 1 dòng gộp 5 file) với +/- tại sha `56805d48` nêu tên; (3) "Lớp lỗi TÁI PHÁT" gọi tên 5 lớp cụ thể kèm căn cứ; (4) "Nhát cắt cho cửa sổ kế" gọi tên ba nhát cắt kèm số (2.9.0=2, 2.10.0=2, 2.11.0=3; hai lối a/b có giá cụ thể).
  rationale: Cả ba lens đồng thuận PASS trên cùng một căn cứ (bốn khối của `## Notes` trong contract.md đều mang số có nguồn rút cụ thể, không phải văn suông); chi tiết từng lens ở "votes" trên. Vòng này 16 eval máy đều PASS (E8c đã hết đứt-giữa-chuỗi) nên verdict tổng của báo cáo là PENDING-JUDGMENT — duy nhất E9 còn chờ. Hợp đồng risk_tier T3 nên PASS panel vẫn cần human_override tại Gate 2 trên chính mục này trước khi được tính là chốt, bất kể ba lens đã đồng thuận PASS.
  human_override: Manh Phan 2026-09-11 — Đạt. Chấm trên khối «Ba dòng số» ĐÃ SỬA sau lượt chấm 6 (6 lượt chấm · gọi người 7 trong thiết kế + 1 ngoài · hạ tầng đốt 5, mỗi số có nguồn), không phải bản hội đồng máy đã đọc.

- eval: E10
  run_id: minted-release-2-11-0-E10-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E10 (AC-10); frame/output goc xem Iterations round 5 va evidence-report round 5.

- eval: E11
  run_id: minted-release-2-11-0-E11-r4
  exit_code: 0
  verifier: config:executors.script.moc_diagram_khong_doi
  verified_at: 2026-09-11T01:18:21Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta round 5 va round 6 khong cham paths cua eval E11 (AC-11); frame/output goc xem Iterations round 4 va evidence-report round 4.

- eval: E12
  run_id: minted-release-2-11-0-E12-r5
  exit_code: 0
  verifier: config:executors.script.bo_giai_nhay
  verified_at: 2026-09-11T02:35:02Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta round 6 khong cham paths cua eval E12 (AC-12); frame/output goc xem Iterations round 5 va evidence-report round 5.

## Known limits

## Ngoài hợp đồng

## Analyst

E6, E8a, E8b, E8c, E8d, E8e — xanh trên cả HEAD lẫn baseline diffBase trong vòng này (E6 kiểm bất biến semver tĩnh của manifest, không phải hành vi mới của round 6; E8a/E8b/E8d là regression-guard chuẩn của suite scripts/hooks/workflows; E8e là regression-guard của `product-map.mjs --check`). E8c gia nhập danh sách non-discriminating round này (khác round 5, khi nó đỏ trên HEAD) vì lần chạy này đi trọn suite plugins không đứt giữa chừng và cũng xanh trên baseline diffBase.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: E8c thất bại (`bash tests/plugins/run-tests.sh`, exit 1) — chuỗi test dừng giữa case P186 (khối VIỆC-CỦA-ANH Cổng 2), dòng cuối bị cắt tại "MUTANT: da go nhanh liet ke judgment khoi ban sao gate-" (đầu ra không tới được dòng PASS/FAIL của P186); không có lệnh fail nào khác không gắn eval — `bash tests/plugins/run-tests.sh` map trọn vẹn vào E8c. Quay lại triển khai.
Round 4: Toàn bộ 16 eval máy (E1-E8e, E10-E12) PASS, bao gồm E8c đã vá (suite plugins xanh trọn — "all plugin tests passed"); duy nhất E9 (judgment, AC-9) còn chờ human_override vì hợp đồng risk_tier T3 đòi xác nhận người trên MỌI judgment item bất kể phiếu panel — verdict tổng PENDING-JUDGMENT, chuyển Gate 2.
Round 5: E8c thất bại lại (`bash tests/plugins/run-tests.sh`, exit 1) — lần này chuỗi test dừng muộn hơn round 3, sau khi case MUTANT-PHUT của P186 đã qua ("MUTANT-PHUT bi bat dung ... OK"), nhưng cắt giữa case MUTANT-2 (đã gỡ mã eval khỏi item 'Ví dụ'), không tới được dòng PASS/FAIL của case đó; 16 eval máy còn lại (bao gồm E7/E11 carry-forward từ round 4) vẫn PASS, E9 (judgment) panel vẫn đồng thuận PASS nhưng chưa được tính vì verdict tổng đã REJECT. Quay lại triển khai.
Round 6: Lệnh E8c được bọc lại `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'` để mã thoát phản ánh đúng suite thay vì bị TOOL cắt giữa chừng — exit 0, "Results: all plugin tests passed", không còn đứt giữa case như round 3/5. Toàn bộ 16 eval máy (E1-E8e, E10-E12) PASS (E1-E5,E4b,E10,E12 carry-forward từ round 5; E7,E11 carry-forward từ round 4; E6,E8a-E8e chạy lại tươi). Duy nhất E9 (judgment, AC-9) còn chờ — hợp đồng risk_tier T3 đòi human_override trên MỌI judgment item bất kể phiếu panel đã đồng thuận PASS cả ba lens. Verdict tổng PENDING-JUDGMENT, chuyển Gate 2.

### Re-pin lần 1 — 2026-09-11, do hoá cũ do chính commit chữ ký
run_id: repin-20260911T065627Z-20732
sha: 4d61b2a332e6cb8c4f7824946c0679b814c005e4 · suites: 5 lệnh exit 0 · evals: 16/16 eval máy đạt kỳ vọng
