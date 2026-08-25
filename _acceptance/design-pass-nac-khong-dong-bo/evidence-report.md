---
schema_version: 2
feature_slug: design-pass-nac-khong-dong-bo
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 562b6dd603443f01a431239a4e26650318d4772d
human_signoff:
---

# Evidence Report: design-pass-nac-khong-dong-bo

Toàn bộ 8 eval máy (test) + 1 eval script đều xanh, kể cả đối chứng dương và baseline đỏ đúng như ma trận mutant đã khai. Verdict tổng vẫn REJECT vì vòng scope-triage của review-findings tìm thấy 8 lỗi THẬT map vào hợp đồng (5× AC-10, 1× AC-12, 2× AC-14) — xem review-findings.md mục "Trong hợp đồng" để tái lập.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-13 | test | PASS |
| E13 | AC-12 | script | PASS |
| E15 | AC-15 | test | PASS |
| E14 | AC-14 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-design-pass-nac-khong-dong-bo-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-design-pass-nac-khong-dong-bo-E8-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-design-pass-nac-khong-dong-bo-E9-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-design-pass-nac-khong-dong-bo-E10-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-design-pass-nac-khong-dong-bo-E11-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-design-pass-nac-khong-dong-bo-E12-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E13
  run_id: minted-design-pass-nac-khong-dong-bo-E13-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.dpnkdb_cau_chet
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
    cau-chet OK (moc c444c512f8f2b2c2b2fba59d4780d9fcff6c6071: moi kim dung so khai · cay dang kiem: 0 · chan tiem: bat duoc)

- eval: E15
  run_id: minted-design-pass-nac-khong-dong-bo-E15-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T09:40:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E14
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  rationale: Ba lens đều UNCERTAIN vì evals.yaml của hồ sơ (chứa mốc neo MUTANT-MATRIX cần đối chiếu số mutant khai với số mutant thực thi trong test.mjs/rang-cau-chet.sh) không có tên trong danh sách Input được cấp cho hội đồng — không lens nào có căn cứ để khẳng định "đủ như đã khai" hay chỉ ra vế thiếu.
  votes:
    - domain-correctness: UNCERTAIN — Câu hỏi trọng tâm đòi đối chiếu với BẢNG MA TRẬN MUTANT khai giữa mốc neo MUTANT-MATRIX ở đầu evals.yaml, nhưng evals.yaml không có trong Input (chỉ có test file + rang-cau-chet.sh + persona). Các phần đọc được trong phạm vi cho phép (mọi mutant đi qua hàm chung với chiều xanh, thông điệp lỗi ghim tên vế/khoá, mỗi lệnh tiêm có guard chống no-op, E13 hai đầu dùng cùng glob) đều không thấy vi phạm, nhưng thiếu bảng khai gốc nên không thể khẳng định "ĐỦ".
    - operational-feasibility: UNCERTAIN — Không có mốc neo MUTANT-MATRIX để đối chiếu thì không thể phán "đủ như đã khai" hay "thiếu vế" — đúng tình huống thiếu ngữ cảnh. Các phần kiểm được trong phạm vi (đối chứng dương chạy trước mutant, mutant đi qua bộ đọc thật, guard chặn no-op, fixture rút từ khuôn qua block(), thông điệp lỗi ghim tên vế cụ thể, quét trọn glob bắt được file thứ ba ngoài bảng khai) không đủ để kết luận toàn câu vì thiếu chính mốc so sánh mà câu hỏi yêu cầu dùng.
    - spec-alignment: UNCERTAIN — Câu hỏi cốt lõi đòi đối chiếu với bảng MUTANT-MATRIX ở đầu evals.yaml, nhưng evals.yaml không có tên trong Input nên không có căn cứ biết con số khai là bao nhiêu. Các vế còn lại (đi qua chính bộ kiểm chiều xanh, fixture code-sinh từ marker, thông điệp đỏ ghim tên vế, glob hai đầu khớp, chân quét trọn glob kèm mutant file-thứ-ba) kiểm chứng được và có vẻ đạt trong hai file đã đọc, nhưng thiếu mảnh trung tâm nên không thể chốt PASS hay FAIL cho toàn câu.
  required_evidence:
    - Bổ sung evals.yaml của hồ sơ _acceptance/design-pass-nac-khong-dong-bo/ (đoạn giữa marker <<<MUTANT-MATRIX ... MUTANT-MATRIX>>> ở đầu file) vào danh sách Input, để đối chiếu số mutant/chân khai cho từng AC (AC-1, AC-8, AC-9, AC-10, AC-11, AC-12, AC-13, AC-15) với số mutant thực thi đếm được trong design-pass-nac.test.mjs (DP1=6, DP8=5, DP9=2, DP10=2, DP11=5, DP12=4, DP13=2) và trong rang-cau-chet.sh; nếu số khớp đủ thì verdict đổi sang PASS, nếu thiếu vế thì đổi sang FAIL.
  human_override:

## Analyst

E1, E8, E9, E10, E11, E12, E15 — non-discriminating trên `bash tests/plugins/run-tests.sh` (baseline: green, tức xanh trên cả code cũ và code mới). Bảy eval này chưa phân biệt được feature với hạ tầng; cân nhắc viết lại để assert hành vi MỚI (nấc phản ứng, khuôn options/divergence, ổ cắm design_pass.ds_skill…) hoặc xác nhận có chủ ý là regression-guard.

## Variance

none — không eval nào có `runs` > 1 trong vòng này (không có eval ngẫu nhiên).

## Iterations

Round 1: nhiều assert chết + 11 mutant còn thiếu trong ma trận bị review bắt — sửa theo lớp (5876722c).
Round 2: số hiệu mutant tự mâu thuẫn giữa hai mô tả sau lượt đính chính — sửa (8706e8f9); S4-r2 BLOCKED vì 6/6 lệnh máy không chạy được (hạ tầng), hội đồng ma trận mutant PASS trên input carried.
Round 3 (hiện tại): 6 lệnh máy chạy sạch, 8 eval feature xanh (bao gồm đối chứng dương/baseline đỏ đúng ma trận), nhưng scope-triage của review-findings tìm ra 8 lỗi thật map vào hợp đồng (AC-10 ×5, AC-12 ×1, AC-14 ×2) — REJECT, quay lại triển khai.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
