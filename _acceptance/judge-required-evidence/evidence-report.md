---
schema_version: 2
feature_slug: judge-required-evidence
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9962888ed8058d1cec02fe737ff2b22ac80d84bb
human_signoff: Manh Phan 2026-08-05
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
  run_id: minted-judge-required-evidence-J4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J4.

- eval: J5
  run_id: minted-judge-required-evidence-J5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J5.

- eval: J6
  run_id: minted-judge-required-evidence-J6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J6.

- eval: J7
  run_id: minted-judge-required-evidence-J7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J7.

- eval: J8
  run_id: minted-judge-required-evidence-J8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T10:00:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J9
  run_id: minted-judge-required-evidence-J9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T10:00:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J10
  run_id: minted-judge-required-evidence-J10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T08:35:26Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval J10.

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
  human_override: Manh Phan 2026-08-05 — J12: chuẩn y PASS (hội đồng 3/3, nghi thức làm được, có luật chống đòi-bằng-chứng-vô-hạn).

- eval: J13
  judged_by: judge-panel (fresh context, 3 lenses)
  proposal: FAIL
  rationale: |
    - domain-correctness: FAIL — Cột "Người quyết (trích 1 câu)" và "Hạng mục được chấm" của gold-stdout.txt (dòng 7-23) lặp lại nhiều biệt ngữ nội bộ tiếng Anh không dịch (known-limits, dogfood, single-source, VIOLATION/NOTE, cross-check, lens measurement/finder fresh) — vi phạm N6 rõ ràng theo human-facing-language.md. Cột "Máy đề xuất" (dòng 7-23) in nguyên enum PASS/FAIL/UNCERTAIN trong khi phần tóm tắt bên dưới (dòng 28) lại dịch cùng khái niệm thành "chưa chắc/chưa đạt" — tài liệu tự mâu thuẫn ngay ở chỗ người quyết kinh doanh đọc đầu tiên, đúng câu hỏi phán xét "chỗ nào lộ tiếng máy".
    - operational-feasibility: FAIL — Nhiều dòng trong bảng "Sổ vàng" đọc như tiếng máy chứ không phải tiếng người: cột "Việc" ở dòng judgment-question-guard lấy hẳn tên file làm chủ ngữ ("acceptance-verify.js DỪNG fail-closed khi eval thiếu field mà prompt…", dòng 14), vi phạm N1/N2; cột "Người quyết" nhiều dòng chèn biệt ngữ nội bộ chưa dịch như "dogfood" (dòng 9, 17) và "known-limits"/"fixture" (dòng 8, 18), vi phạm N6. Cột "Máy đề xuất" (dòng 7–23) chỉ in nguyên mã verdict UNCERTAIN/PASS/FAIL không kèm 3–5 chữ giải nghĩa lần đầu xuất hiện, vi phạm N3 — một người quyết kinh doanh đọc dòng 14 hay các chữ "dogfood/fail-closed/fixture" sẽ không hiểu ngay máy đề xuất gì.
    - spec-alignment: FAIL — Dòng 28 nhồi 3 lens (domain-correctness/operational-feasibility/spec-alignment) vào một câu bằng dấu "·", và dòng 29 liệt kê 9 slug kỹ thuật thô (context-ladder, docs-first-run-audit, …) nối bằng dấu phẩy trong một ngoặc — cả hai vi phạm N4 (một dòng một ý, cấm nhồi bằng dấu phân cách). Dòng 7 dùng thẳng "machine-lane" và "run_id" làm nội dung câu ở cột "Việc" thay vì đẩy xuống ngoặc/cột phụ, vi phạm N2, và hai từ này không có trong danh sách "Từ mới feature này đưa vào từ điển" của chính file luật nên cũng vi phạm N6. Người quyết kinh doanh không đọc code sẽ vấp ngay ở các chỗ này khi áp phép thử Xoá-tên-máy.
  required_evidence:
    - "[domain-correctness] gold-stdout.txt dòng 7 và 16: cụm \"known-limits\" xuất hiện nguyên văn tiếng Anh trong câu trích của người quyết (\"E12: chấp nhận known-limits.\", \"M9: known-limits.\") — cần thay bằng thuật ngữ tiếng Việt có trong CONTEXT.md hoặc câu diễn giải, nếu không verdict giữ FAIL."
    - "[domain-correctness] gold-stdout.txt dòng 9 và 17: cụm \"dogfood\" trong \"PASS bằng số đếm dogfood thật…\" và \"PASS bằng số đếm dogfood…\" là biệt ngữ nội bộ chưa dịch — cần đối chiếu CONTEXT.md xem có mục glossary cho từ này chưa; nếu không có, phải viết lại bằng chữ thường phổ thông."
    - "[domain-correctness] gold-stdout.txt dòng 10: \"E10 — Luật ranh giới section đã single-source ĐÚNG NGHĨA chưa\" dùng \"single-source\" tiếng Anh không dịch, vi phạm N6."
    - "[domain-correctness] gold-stdout.txt dòng 11, 20, 21: cụm \"VIOLATION và NOTE\" / \"VIOLATION [ledger]\" là tên thông điệp máy (log/script) được dán nguyên văn vào mô tả mặt người thay vì diễn giải, trong khi human-facing-language.md dòng 14-18 chỉ miễn trừ tên chính xác cho mặt máy (evals.yaml, run-log.jsonl…), không miễn trừ cho báo cáo trình người."
    - "[domain-correctness] gold-stdout.txt dòng 15-16: \"lens measurement\", \"finder fresh\", \"cross-check\" là thuật ngữ tiếng Anh nội bộ chưa dịch trong mô tả M8/M9."
    - "[domain-correctness] gold-stdout.txt cột \"Máy đề xuất\" (dòng 7-23) in nguyên enum PASS/FAIL/UNCERTAIN, đối chiếu với dòng 28 cùng file lại dịch cùng khái niệm thành \"chưa chắc/chưa đạt\" — cần kiểm CONTEXT.md xem PASS/FAIL/UNCERTAIN đã có mục từ điển sản phẩm chưa; nếu chưa, đây là vi phạm N6 trực tiếp ở đúng cột người quyết kinh doanh đọc đầu tiên."
    - "[operational-feasibility] gold-stdout.txt dòng 14 (cột Việc, hàng judgment-question-guard): 'acceptance-verify.js DỪNG fail-closed khi eval thiếu field mà prompt…' — chủ ngữ là tên file, có 'fail-closed/eval/field' không dịch; sửa lại theo N1/N2 (chủ ngữ là người dùng/sản phẩm, tên kỹ thuật xuống ngoặc) thì verdict đổi."
    - "[operational-feasibility] gold-stdout.txt dòng 9 và 17 (cột Người quyết): '...PASS bằng số đếm dogfood thật…' — từ 'dogfood' là biệt ngữ nội bộ chưa dịch (N6); thay bằng cụm tiếng Việt phổ thông (vd. 'số lần dùng thật trong chính kit') thì hết vi phạm ở hai dòng này."
    - "[operational-feasibility] gold-stdout.txt cột 'Máy đề xuất' toàn bộ dòng 7-23 chỉ ghi UNCERTAIN/PASS/FAIL không kèm giải nghĩa 3-5 chữ lần đầu xuất hiện (N3) — thêm chú thích ngắn kèm mã lần đầu (vd. 'UNCERTAIN (máy chưa chắc)') thì phần này đạt."
    - "[spec-alignment] Dòng 28 gold-stdout.txt: \"Theo góc nhìn: đúng nghiệp vụ (domain-correctness): 16/36 ... · vận hành được (operational-feasibility): 19/36 ... · khớp đặc tả (spec-alignment): 16/36 ...\" — cần tách thành 3 dòng/3 ô riêng để không còn vi phạm N4."
    - "[spec-alignment] Dòng 29 gold-stdout.txt: liệt kê 9 slug (context-ladder, docs-first-run-audit, findings-section-boundary, ...) nối bằng dấu phẩy trong một ngoặc — cần mỗi việc một dòng kèm tên sản phẩm, không phải slug thô nhồi chung."
    - "[spec-alignment] Dòng 7 gold-stdout.txt, cột 'Việc': \"re-pin 1 lượt machine-lane + N chữ ký cùng run_id (chống gian lận 2… (delta-verify-repin)\" — cần bỏ 'machine-lane'/'run_id' ra khỏi câu chính hoặc đưa vào ngoặc kỹ thuật; đối chiếu mục 'Từ mới feature này đưa vào từ điển' ở human-facing-language.md (dòng 127-133) không có hai từ này."
  human_override: Manh Phan 2026-08-05 — J13: known-limits. Bốn round lời phê hạ bậc rõ (cột vô nghĩa → chỉ còn biệt ngữ trong LỜI NGƯỜI KÝ và chú giải mã verdict); ba từ bị chê nằm trong trích dẫn nguyên văn quyết định của người — sổ vàng không được viết lại lời người (luật N4). Đường sửa đúng: thêm glossary CONTEXT.md + contract mới đo-đầu-ra-sổ-vàng (đã ghi backlog).

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
  human_override: Manh Phan 2026-08-05 — J14: PASS bằng số đếm dogfood: 6/6 phiếu không-PASS của chính vòng này đều kèm danh sách bằng-chứng-thiếu (run-log 4 round); vòng sửa r2/r4 bổ sung đúng danh sách của giám khảo, không đoán.
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
Round 3: J4, J5, J7, J8, J9, J10 (tests/plugins) chạy lại — PASS. J13 chấm lại trên gold-stdout mới nhất — vẫn FAIL (ngoặc treo/câu vỡ nghĩa ở dòng 7, 9, 17; nhãn lặp "hạng mục người phán tại Cổng 2" ở 5-6 dòng; "machine-lane"/"run_id"/"known-limits"/"dogfood" vẫn chưa vào HFL-GLOSSARY-TERMS; câu tiếng Anh dòng 21 chưa dịch). J14 carry-forward UNCERTAIN từ round 1. J1, J2, J3, J6, J11, J12 carry-forward PASS. Đã qua ngưỡng 3 round của template, verdict round đó chuyển REJECT để escalate cho người quyết thay vì tự động fix tiếp.
Round 4 (hiện tại): bash tests/plugins/run-tests.sh (J8, J9) chạy lại — PASS. J13 chấm lại trên gold-stdout hiện hành — vẫn FAIL, biệt ngữ máy chưa dịch còn ở nhiều dòng khác (known-limits/dogfood/single-source/VIOLATION-NOTE/cross-check/lens measurement/finder fresh, câu Việc dòng 7 dùng machine-lane/run_id làm chủ ngữ, dòng 28-29 nhồi nhiều ý một dòng) — xem rationale mới ở trên. J1, J2, J3, J4, J5, J6, J7, J10, J11, J12, J14 carry-forward (delta round này không chạm paths của các eval đó). Verdict tổng giữ PENDING-JUDGMENT: J13 (FAIL) và J14 (UNCERTAIN) cần người quyết ở Cổng 2 — đây là mục judgment chờ người, không phải máy tự fail nên không tự động REJECT dù đã qua vòng thứ 4.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-08-05, do engine đổi ở vòng gold-output-measure (sổ vàng + tài liệu luật + bộ kiểm)
run_id: repin-20260805-gold-output-measure-lane1
sha: 9962888ed8058d1cec02fe737ff2b22ac80d84bb · suites: 6 lệnh exit 0
