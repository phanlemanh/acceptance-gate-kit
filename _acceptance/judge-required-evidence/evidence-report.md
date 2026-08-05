---
schema_version: 2
feature_slug: judge-required-evidence
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: df5322de29414a5597c7e0dd8ac58231c230aeb5
human_signoff:
---

# Evidence Report: judge-required-evidence

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| J1 | AC-1 | test | PASS |
| J2 | AC-2 | test | PASS |
| J3 | AC-3 | test | PASS |
| J4 | AC-4 | test | PASS |
| J5 | AC-5 | test | PASS |
| J6 | AC-6 | test | PASS |
| J7 | AC-7 | test | PASS |
| J8 | AC-8 | test | PASS |
| J9 | AC-9 | test | PASS |
| J10 | AC-10 | test | PASS |
| J11 | AC-11 | test | PASS |
| J12 | AC-12 | judgment | PASS |
| J13 | AC-13 | judgment | FAIL |
| J14 | AC-14 | judgment | UNCERTAIN |

## Evidence

- eval: J1
  run_id: minted-judge-required-evidence-J1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J1.

- eval: J2
  run_id: minted-judge-required-evidence-J2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J2.

- eval: J3
  run_id: minted-judge-required-evidence-J3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J3.

- eval: J4
  run_id: minted-judge-required-evidence-J4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T16:45:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J5
  run_id: minted-judge-required-evidence-J5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T16:45:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J6
  run_id: minted-judge-required-evidence-J6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J6.

- eval: J7
  run_id: minted-judge-required-evidence-J7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T16:45:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J8
  run_id: minted-judge-required-evidence-J8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T16:45:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J9
  run_id: minted-judge-required-evidence-J9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T16:45:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J10
  run_id: minted-judge-required-evidence-J10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T16:45:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J11
  run_id: minted-judge-required-evidence-J11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J11.

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: J12
  judged_by: judge-panel (fresh context, 3 lenses)
  verdict: PASS
  rationale: |
    panel giữ nguyên từ round 1 — inputs không đổi, không chấm lại; rationale xem round 1.
    - domain-correctness: PASS (r1)
    - operational-feasibility: PASS (r1)
    - spec-alignment: PASS (r1)
  human_override:

- eval: J13
  judged_by: judge-panel (fresh context, 3 lenses)
  verdict: FAIL
  rationale: |
    - domain-correctness: FAIL — gold-stdout.txt lộ tiếng máy ở nhiều chỗ: dòng 7 nhét "run_id"/"machine-lane" thẳng vào mệnh đề chính thay vì xuống ngoặc (vi phạm N2) và cả hai từ này không có trong 5 mục HFL-GLOSSARY-TERMS của human-facing-language.md — vi phạm N6; dòng 21 (hạng mục E15) để nguyên câu tiếng Anh máy "All three lenses agree every VIOLATION/NOTE line names the…" chưa dịch, trượt phép thử Xoá-tên-máy; và "known-limits" (dòng 7, 16) là biệt ngữ chưa có trong từ điển. Ngoài ra nhãn "hạng mục người phán tại Cổng 2" lặp y hệt ở 5 dòng (11-14, 20, 22, 23) không cho biết máy đã đề xuất gì cụ thể, thất bại đúng câu hỏi cốt lõi của AC-13 dù không hẳn là vi phạm N-rule đơn lẻ.
    - operational-feasibility: FAIL — Cột "Việc" và "Hạng mục được chấm" trong gold-stdout.txt bị cắt bằng dấu "…" giữa chừng mà không đóng ngoặc đang mở, tạo câu vỡ nghĩa/ngoặc lệch nhau (ví dụ dòng 7 "...run_id (chống gian lận 2… (delta-verify-repin)", dòng 9 "Nếu chưa (bình…", dòng 17 "Nếu chưa (bình thường…") — người quyết kinh doanh đọc không ra ý câu, vi phạm N1 (câu phải trọn nghĩa cho người đọc). Song song đó, 6 dòng (E10/E11/E12/E13/E15/E16 ở dòng 11, 12, 13, 14, 20, 22, 23) đều mang đúng một cụm nhãn rỗng "hạng mục người phán tại Cổng 2" lặp lại cho các việc hoàn toàn khác nhau, không cho biết máy thật sự đề xuất trên tiêu chí gì — vi phạm N3 (mã số lần đầu xuất hiện phải kèm 3-5 chữ nói nó LÀ GÌ, không phải nhãn chung chung dùng chung cho mọi mã).
    - spec-alignment: FAIL — Dòng 7 của bảng "Sổ vàng" (gold-stdout.txt) đặt tiếng máy làm chủ ngữ và không dịch: "re-pin 1 lượt machine-lane + N chữ ký cùng run_id (chống gian lận 2… (delta-verify-repin)" — vi phạm N1 (chủ ngữ phải là người dùng/sản phẩm, không phải mô tả cơ chế máy) và N6 (biệt ngữ "machine-lane", "run_id" không có mục trong danh sách từ điển feature này). Cột "Người quyết" cũng lộ biệt ngữ chưa dịch/chưa gloss ở dòng 7 và 9: "chấp nhận known-limits" và "PASS bằng số đếm dogfood thật" — "known-limits", "dogfood" không nằm trong glossary N6 của chính file luật (chỉ có mặt người/mặt máy/lỗ-kit/mặt phẳng/nhìn-thấy-hình). Một người quyết kinh doanh đọc dòng 7 sẽ không hiểu "máy đề xuất gì trên cái gì" vì cả mô tả việc lẫn lý do quyết đều là tiếng máy chưa qua phép thử Xoá-tên-máy.
  required_evidence:
    - "[domain-correctness] gold-stdout.txt dòng 7: cụm 'machine-lane' và 'run_id' nằm trong mệnh đề chính của cột Việc (không trong ngoặc) — sửa để hai tên kỹ thuật này xuống ngoặc/cột phụ theo N2 thì verdict đổi."
    - "[domain-correctness] human-facing-language.md dòng 128-133 (HFL-GLOSSARY-TERMS): danh sách 5 từ không có 'machine-lane', 'run_id', 'known-limits' — cần bổ sung mục từ điển cho các từ này hoặc thay bằng tiếng Việt thường mới hết vi phạm N6."
    - "[domain-correctness] gold-stdout.txt dòng 21 (hạng mục E15): câu tiếng Anh nguyên văn 'All three lenses agree every VIOLATION/NOTE line names the…' chưa dịch — dịch sang tiếng Việt mặt người thì hết vi phạm N6/phép thử Xoá-tên-máy."
    - "[domain-correctness] gold-stdout.txt dòng 11-14, 20, 22, 23: nhãn lặp 'hạng mục người phán tại Cổng 2' cho 5 mục E9-E13 khác nhau — thay bằng mô tả cụ thể 3-5 chữ mỗi mục (đúng N3) thì mới trả lời được 'máy đề xuất gì' cho từng dòng."
    - "[operational-feasibility] Sửa cách sinh cột \"Việc\"/\"Hạng mục được chấm\" trong gold-stdout.txt để chuỗi bị rút gọn không cắt ngay giữa một ngoặc đang mở — đối chiếu lại đúng ba dòng: dòng 7 (\"...run_id (chống gian lận 2… (delta-verify-repin)\"), dòng 9 (\"Nếu chưa (bình…\"), dòng 17 (\"Nếu chưa (bình thường…\") trong _acceptance/judge-required-evidence/evidence/gold-stdout.txt; nếu cả ba dòng này đọc trọn câu (không còn ngoặc treo/dấu ba chấm cắt ngang câu) thì verdict đổi."
    - "[operational-feasibility] Thay cụm nhãn rỗng \"hạng mục người phán tại Cổng 2\" ở các dòng 11, 12, 13, 14, 20, 22, 23 của cùng file gold-stdout.txt bằng nội dung tiêu chí thực tế riêng của từng mã E10/E11/E12/E13/E15/E16 (khác nhau theo từng việc) — nếu mỗi dòng cho thấy nội dung phân biệt được thay vì nhãn dùng chung, verdict đổi."
    - "[spec-alignment] Sửa lại nội dung cột 'Việc' dòng 7 của gold-stdout.txt (việc delta-verify-repin) theo mẫu N1: câu chủ ngữ là người dùng/sản phẩm ('người dùng/người duyệt thấy gì khác'), đẩy 'machine-lane', 'run_id' xuống backtick phụ hoặc ngoặc — rồi chạy lại phép thử Xoá-tên-máy trên câu đó, còn nghĩa mới tính là qua."
    - "[spec-alignment] Thêm mục 'known-limits' và 'dogfood' vào bảng HFL-GLOSSARY-TERMS trong human-facing-language.md (hoặc CONTEXT.md) rồi re-run acceptance-gold.mjs để cột 'Người quyết' ở dòng 7 và 9 của gold-stdout.txt không còn thuật ngữ chưa gloss — đối chiếu lại bằng phép thử Xoá-tên-máy trên đúng hai dòng đó."
  human_override:

- eval: J14
  judged_by: judge-panel (fresh context, 3 lenses)
  verdict: UNCERTAIN
  rationale: |
    panel giữ nguyên từ round 1 — inputs không đổi, không chấm lại; rationale xem round 1.
    - domain-correctness: UNCERTAIN (r1)
    - operational-feasibility: UNCERTAIN (r1)
    - spec-alignment: UNCERTAIN (r1)
  required_evidence:
    - "(xem round 1 — panel carried, không chấm lại; danh sách required_evidence gốc theo 3 lens đều xoay quanh: chạy `grep 'kind:panel' run-log.jsonl` của _acceptance/judge-required-evidence/run-log.jsonl và kiểm mọi dòng proposal khác PASS có required_evidence không rỗng — nếu có, hoặc nếu chưa có dòng non-PASS nào và case harness JR1/JR2 pass, verdict đổi thành PASS; nếu thiếu ở dòng nào, verdict đổi thành FAIL)"
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

## Analyst

carried tu round 1 — baseline khong do lai round nay.

- bash tests/workflows/run-tests.sh: J1, J2, J3, J6
- bash tests/plugins/run-tests.sh: J4, J5, J7, J8, J9, J10
- bash tests/scripts/run-tests.sh: J11

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: J1-J7, J10-J12 PASS; J13 FAIL (Sổ vàng còn tiếng máy trần, vi phạm N3/N6 human-facing-language.md); J14 UNCERTAIN (chưa có dòng kind:panel trong run-log để chấm). Trở lại implementation sửa gold-stdout wording.
Round 2: J8, J9 (gold set/G3 trên corpus thật) chạy lại — PASS. J13 chấm lại trên gold-stdout mới — vẫn FAIL, biệt ngữ máy còn sót nhiều dòng. J14 carry-forward UNCERTAIN từ round 1 (chưa có input mới để chấm lại). J1-J7, J10-J12 carry-forward PASS (delta không chạm paths của các eval này).
Round 3 (hiện tại): J4, J5, J7, J8, J9, J10 (tests/plugins) chạy lại — PASS. J13 chấm lại trên gold-stdout mới nhất — vẫn FAIL (ngoặc treo/câu vỡ nghĩa ở dòng 7, 9, 17; nhãn lặp "hạng mục người phán tại Cổng 2" ở 5-6 dòng; "machine-lane"/"run_id"/"known-limits"/"dogfood" vẫn chưa vào HFL-GLOSSARY-TERMS; câu tiếng Anh dòng 21 chưa dịch — xem rationale ở trên). J14 carry-forward UNCERTAIN từ round 1 (chưa có input mới để chấm lại). J1, J2, J3, J6, J11, J12 carry-forward PASS (delta không chạm paths của các eval này). Đây là round 3 verify: theo ngưỡng dừng vòng lặp của template (tối đa 3 round rồi escalate), verdict chuyển REJECT và cần người quyết xem lại thay vì tiếp tục một vòng fix tự động nữa.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract