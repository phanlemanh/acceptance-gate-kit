---
schema_version: 2
feature_slug: judge-required-evidence
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9f4d4d4081c659c79175cfbdf1761072c5ff0588
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
  run_id: minted-judge-required-evidence-J8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T10:05:00Z
  output: |
    PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J9
  run_id: minted-judge-required-evidence-J9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T10:05:00Z
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
  human_override:

- eval: J13
  judged_by: judge-panel (fresh context, 3 lenses)
  verdict: FAIL
  rationale: |
    - domain-correctness: FAIL — Sổ vàng vẫn lộ tiếng máy ở nhiều chỗ: nhiều mã AC (E9, E10, E11, E13, E15 ở các dòng gap-probe-presence-hook, premerge-rules-ledger, gate-card-ac-visibility, t1-escape-event-scope, premerge-unjudged-pass) xuất hiện trơ trọi không kèm 3-5 chữ giải nghĩa, vi phạm N3. Ô "Người quyết" của dòng delta-verify-repin/E16 và matrix-measure-law/M10 nhồi nhiều sự kiện kỹ thuật (run_id, sha, agent-lane, label review:measurement, source:measurement) bằng dấu phẩy vào một câu, vừa vi phạm N4 (một dòng một ý) vừa vi phạm N6 (biệt ngữ nội bộ chưa có trong từ điển sản phẩm — các từ này không có trong HFL-GLOSSARY-TERMS). Người quyết kinh doanh không đọc code sẽ không hiểu ngay các mã và jargon đó là gì.
    - operational-feasibility: FAIL — Cột "Việc" và các trích dẫn quyết định nhồi thẳng biệt ngữ máy chưa dịch (run_id, sha, machine-lane, agent-lane, kind:repin, known-limits, re-pin) làm chủ ngữ/nội dung chính thay vì đẩy xuống ngoặc kèm giải nghĩa 3–5 chữ — phép thử Xoá-tên-máy trên dòng 7 ("re-pin 1 lượt machine-lane + N chữ ký cùng run_id…") cho câu rỗng nghĩa với người không đọc code. Danh sách 9 slug thô ở dòng 29 (context-ladder, docs-first-run-audit…) bày nguyên văn không dịch, vi phạm N1/N2/N6 của file luật thứ hai.
    - spec-alignment: FAIL — Nhiều ô "Hạng mục được chấm" trong bảng chỉ có mã trần không kèm 3-5 chữ giải nghĩa (vi phạm N3: "Mã số là tra cứu, không phải nội dung"), nên người quyết kinh doanh không đọc code sẽ không hiểu hạng mục đó chấm cái gì khi lần đầu gặp — phép thử Xoá-tên-máy trả về rỗng ("E9 | PASS | Manh Phan 2026-07-28" xoá mã đi thì không còn nghĩa). Cột "Máy đề xuất/Người quyết" và cột "Việc" thì đạt N1/N2 (chủ ngữ đúng, tên kỹ thuật đã xuống ngoặc).
  required_evidence:
    - "[domain-correctness] gold-stdout.txt dòng 11 (hàng gap-probe-presence-hook): sửa 'E9' thành có kèm 3-5 chữ nói nó kiểm gì (vd 'E9 — <mô tả ngắn>') — nếu bản sửa xuất hiện thì hết vi phạm N3 ở dòng này; áp tương tự cho dòng 20 (E10, premerge-rules-ledger), dòng 12-13 (E11/E12, gate-card-ac-visibility), dòng 21 (E15), dòng 23 (E13, t1-escape-event-scope)."
    - "[domain-correctness] gold-stdout.txt dòng 9 (hàng delta-verify-repin/E16): viết lại cụm 'run_id repin-20260805-delta-verify-repin-lane1, sha c1f781d, đúng 1 agent-lane' bằng tiếng sản phẩm không có run_id/sha/agent-lane, tách thành câu riêng thay vì nhồi bằng dấu phẩy — nếu bản viết lại này thay thế thì đổi verdict."
    - "[domain-correctness] gold-stdout.txt dòng 17 (hàng matrix-measure-law/M10): viết lại 'label review:measurement chạy ở 3/3 round S4 (usage-report), lens trả finding source:measurement cả 3 round (2+4+3)' bỏ các tên trường máy (label, lens, source:measurement) sang tiếng người hoặc xuống chú thích — nếu có bản thay thế thì đổi verdict."
    - "[operational-feasibility] gold-stdout.txt dòng 7: cột Việc = 're-pin 1 lượt machine-lane + N chữ ký cùng run_id (chống gian lận 2… (delta-verify-repin)' — vi phạm N1 (chủ ngữ là kỹ thuật, không phải người dùng/sản phẩm) và N6 (machine-lane, run_id, re-pin là biệt ngữ nội bộ không kèm giải nghĩa) đối chiếu human-facing-language.md dòng 25 (N1) và dòng 30 (N6)"
    - "[operational-feasibility] gold-stdout.txt dòng 9: trích dẫn quyết định '...19 dòng kind:repin cùng run_id repin-20260805-delta-verify-repin-lane1, sha c1f781d, đúng 1 agent-lane trong…' — tên trường máy (kind:repin, run_id, sha, agent-lane) làm nội dung chính thay vì xuống cột phụ/ngoặc, vi phạm N2 (human-facing-language.md dòng 26)"
    - "[operational-feasibility] gold-stdout.txt dòng 29: liệt kê 9 slug kỹ thuật thô 'context-ladder, docs-first-run-audit, findings-section-boundary, gate-card-ac-visibility, hinh-theo-mat-phang, judgment-question-guard, pha3-goi-luoi, product-map-uat-session, start-scan-hardening' không có bản dịch tiếng người kèm theo — vi phạm N1/N2, đối chiếu bảng TRƯỚC/SAU ở human-facing-language.md dòng 50-57"
    - "[operational-feasibility] gold-stdout.txt các dòng 7,16 dùng thuật ngữ 'known-limits' không có 3-5 chữ giải nghĩa lần đầu xuất hiện — vi phạm N3 (human-facing-language.md dòng 27)"
    - "[spec-alignment] gold-stdout.txt dòng 11: ô Hạng mục được chấm chỉ ghi 'E9' trần, không có 3-5 chữ mô tả — vi phạm N3; nếu thêm mô tả (vd 'E9 — <ý eval đó chấm gì>') thì verdict đổi"
    - "[spec-alignment] gold-stdout.txt các dòng 12,13,14,20,21,22,23: cùng hình dạng — 'E11', 'E12', 'E10', 'E10', 'E15', 'E11', 'E13' đều xuất hiện trần không kèm giải nghĩa dù các dòng 8,9,10,15,16,17,18 (cùng cột) đều có mô tả kèm sau dấu '—'; cần sửa ĐỒNG LOẠT cả lớp (không chỉ dòng 11) để qua N3 và phép thử Xoá-tên-máy"
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
Round 2 (hiện tại): J8, J9 (gold set/G3 trên corpus thật) chạy lại — PASS. J13 chấm lại trên gold-stdout mới — vẫn FAIL, biệt ngữ máy còn sót nhiều dòng (xem rationale ở trên). J14 carry-forward UNCERTAIN từ round 1 (chưa có input mới để chấm lại). J1-J7, J10-J12 carry-forward PASS (delta không chạm paths của các eval này).

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
