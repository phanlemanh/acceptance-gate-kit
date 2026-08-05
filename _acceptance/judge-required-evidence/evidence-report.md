---
schema_version: 2
feature_slug: judge-required-evidence
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0684fe9c7e5b1d2e70ab59f6d3d6b2b064229e46
human_signoff:
---

# Evidence Report: judge-required-evidence

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| J1 | AC-1 | test | PASS |
| J2 | AC-2 | test | PASS |
| J3 | AC-3 | test | PASS |
| J6 | AC-6 | test | PASS |
| J4 | AC-4 | test | PASS |
| J5 | AC-5 | test | PASS |
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
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T09:00:00Z
  output: |
    Results: 62 passed, 0 failed

    Results: all workflow tests passed

- eval: J2
  run_id: minted-judge-required-evidence-J2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T09:00:00Z
  output: |
    Results: 62 passed, 0 failed

    Results: all workflow tests passed

- eval: J3
  run_id: minted-judge-required-evidence-J3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T09:00:00Z
  output: |
    Results: 62 passed, 0 failed

    Results: all workflow tests passed

- eval: J6
  run_id: minted-judge-required-evidence-J6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T09:00:00Z
  output: |
    Results: 62 passed, 0 failed

    Results: all workflow tests passed

- eval: J4
  run_id: minted-judge-required-evidence-J4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T09:00:00Z
  output: |
      PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J5
  run_id: minted-judge-required-evidence-J5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T09:00:00Z
  output: |
      PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J7
  run_id: minted-judge-required-evidence-J7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T09:00:00Z
  output: |
      PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J8
  run_id: minted-judge-required-evidence-J8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T09:00:00Z
  output: |
      PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J9
  run_id: minted-judge-required-evidence-J9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T09:00:00Z
  output: |
      PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J10
  run_id: minted-judge-required-evidence-J10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-05T09:00:00Z
  output: |
      PASS: P154 command clauses + mutant

    Results: all plugin tests passed

- eval: J11
  run_id: minted-judge-required-evidence-J11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-05T09:00:00Z
  output: |
      PASS: GCV1d contract lanh khong sinh canh bao nao

    Results: 601 passed, 0 failed

- eval: J12
  judged_by: judge-panel (fresh context, 3 lens)
  proposal: PASS
  rationale: Cả 3 lens đồng thuận PASS — quy tắc required_evidence mới (rule 5/6) chỉ thêm ràng buộc lên verdict không-PASS (mục cụ thể + chỗ lấy + câu chống evidence-shopping), không đổi tiêu chí UNCERTAIN và không tạo lối tắt biến UNCERTAIN thành cớ dễ dãi.
  votes:
    - domain-correctness: PASS — Rule 5's format ties each required_evidence item to a concrete artifact + a concrete way to get it (file/command/frame), and embeds the actionability test directly in the format ("specific enough that if this existed the verdict would change"). Rule 6 explicitly closes the evidence-shopping hole with a good/bad example pair ("add more tests" invalid vs. a named command+output valid) and a direct anti-shopping clause ("if the listed evidence would not change your verdict, do not list it") — verdict criteria for UNCERTAIN (rule 4) are unchanged by this addition, so the new field adds friction/specificity to non-PASS verdicts rather than an incentive to reach for UNCERTAIN more easily.
    - operational-feasibility: PASS — Persona (dòng 38-46) buộc required_evidence là MANDATORY khi FAIL/UNCERTAIN, omit khi PASS, và định nghĩa "ACTIONABLE" bằng cặp ví dụ invalid/valid cụ thể (không phải "thêm test" chung chung, mà "chạy config:executors.test.api và đính kèm output exit-0 cho path migrate") kèm khuôn "evidence + chỗ lấy (file/command/frame)" — đủ cho judge fresh làm đúng. Rule 6 có câu chống evidence-shopping tường minh: "nếu bằng chứng liệt kê không đổi được verdict thì đừng liệt kê nó", và UNCERTAIN (rule 4) được định nghĩa độc lập với required_evidence nên cơ chế mới không tạo lối tắt biến UNCERTAIN thành cớ dễ dãi.
    - spec-alignment: PASS — Rule 5's template (ONE concrete piece + file/command/frame + "specific enough that if this existed the verdict would change") and rule 6's worked contrast ("add more tests" invalid vs "run config:executors.test.api and attach exit-0 output for migrate path" valid) give a fresh judge an operational, action-first bar to write against. Rule 6 also names and forbids the exact dodge in the question ("Do NOT use required_evidence to dodge a verdict you already have grounds for... no evidence-shopping"), and required_evidence is a burden added on TOP of a non-PASS verdict rather than a substitute reason to reach UNCERTAIN, so it does not lower the bar for lazy UNCERTAIN.
  human_override:

- eval: J13
  judged_by: judge-panel (fresh context, 3 lens)
  proposal: FAIL
  rationale: Cả 3 lens đồng thuận FAIL trên bảng "Sổ vàng" của gold-stdout.txt — vi phạm nhiều luật human-facing-language.md (N1 chủ ngữ-slug-máy, N3 mã trần không giải nghĩa, N4/N6 thuật ngữ máy không dịch), trượt phép thử xoá-tên-máy.
  votes:
    - domain-correctness: FAIL — Bảng "Sổ vàng" dùng slug nội bộ (delta-verify-repin, matrix-measure-law...) làm chủ ngữ dòng thay vì câu tả người dùng/sản phẩm thấy gì (vi phạm N1), cột "Hạng mục" chỉ có mã trần E12/E13/M8/M9... không kèm 3-5 chữ giải nghĩa lần đầu xuất hiện (vi phạm N3), và nhiều ô "Người quyết" (vd dòng E16, M9) nhồi nhiều ý bằng dấu chấm phẩy/gạch ngang kèm thuật ngữ máy như run_id, sha, kind:repin, round-trip, charter (vi phạm N4, có dấu hiệu N6). Phép thử xoá-tên-máy: xoá E12/E16/M9/run_id/sha/kind:repin/delta-verify-repin... khỏi bảng thì phần lớn dòng mất nghĩa hoặc trống — người quyết kinh doanh không đọc code không kể lại được "máy đề xuất gì, người đã quyết gì" chỉ bằng bảng này.
      required_evidence:
        - Bản sửa cột 'Hạng mục' của bảng Sổ vàng (dòng 7-18 gold-stdout.txt) có thêm 3-5 chữ giải nghĩa ngay lần đầu mỗi mã xuất hiện (VD 'E12 (chấp nhận sửa-tay run-log)') — đúng luật N3.
        - Bản sửa cột 'Việc' đổi chủ ngữ dòng từ slug nội bộ (delta-verify-repin, matrix-measure-law, ngon-ngu-mat-nguoi...) sang câu tả người dùng/sản phẩm thấy gì khác, đẩy slug xuống ngoặc/cột phụ — đúng luật N1/N2.
        - Bản sửa ô 'Người quyết' của dòng E16 và M9 (dòng 9, 16) tách các ý đang nhồi bằng dấu chấm phẩy/gạch ngang thành các dòng riêng, thay thuật ngữ máy (run_id, sha, kind:repin, round-trip, charter) bằng chữ thường hoặc chú giải — đúng luật N4/N6.
    - operational-feasibility: FAIL — Cột "Việc" dùng thẳng slug máy (delta-verify-repin, matrix-measure-law, s4-scope-triage...) làm chủ ngữ của cả bảng, không có mô tả "người dùng/sản phẩm thấy gì khác" — vi phạm N1+N2, và trượt phép thử Xoá-tên-máy vì xoá slug thì dòng đó mất hết nghĩa. Mã hạng mục (E12, E13, E16, M8-M11) xuất hiện bare trong cột "Hạng mục" không kèm 3–5 chữ nói nó là gì lần đầu xuất hiện — vi phạm N3; phần "giám khảo đồng thuận" dùng thẳng tên lens tiếng Anh nội bộ (domain-correctness, operational-feasibility, spec-alignment) không dịch/không giải nghĩa — vi phạm N6. Người quyết định kinh doanh không đọc code sẽ không tự trả lời được "việc gì đã đổi cho người dùng" chỉ từ bảng này.
      required_evidence:
        - Bản sửa của _acceptance/judge-required-evidence/evidence/gold-stdout.txt: cột 1 đổi từ slug máy (vd. delta-verify-repin) sang một câu chủ ngữ-người-dùng/sản phẩm mô tả việc đã đổi, slug kỹ thuật lùi xuống ngoặc — kiểm bằng phép thử Xoá-tên-máy trên từng dòng của bảng 'Sổ vàng'
        - Bản sửa cùng file: lần xuất hiện đầu tiên của mỗi mã hạng mục (E12, E13, E16, M8, M9, M10, M11) trong cột 'Hạng mục' kèm 3–5 chữ nói nó kiểm cái gì, đúng luật N3 ở human-facing-language.md dòng 27
        - Bản sửa đoạn 'Các giám khảo đồng thuận tới đâu': thay domain-correctness/operational-feasibility/spec-alignment bằng tên tiếng Việt có trong CONTEXT.md (hoặc thêm mục CONTEXT.md cho ba tên này) trước khi trình cho người quyết kinh doanh, đúng luật N6
    - spec-alignment: FAIL — Cột "Việc" dùng thẳng slug tính năng (vd "delta-verify-repin", "gate-card-ac-visibility") làm chủ ngữ và cột "Hạng mục" là mã trần (E12, M9, E16...) không kèm 3-5 chữ giải nghĩa lần đầu xuất hiện — vi phạm N1/N2/N3; cột "Người quyết" đặc biệt tại các dòng UNCERTAIN/FAIL (E12, M9, M10, E16) nhồi biệt ngữ nội bộ chưa dịch (run-log, known-limits, dogfood, fixture, schema evals, charter, agent-lane, round-trip, label review:measurement) — vi phạm N6. Áp phép thử Xoá-tên-máy vào một dòng bất kỳ (vd dòng gap-probe-presence-hook) gần như rỗng nghĩa, cho thấy người quyết kinh doanh không tự đọc hiểu được "máy đề xuất gì" mà không tra cứu thêm.
      required_evidence:
        - Dòng 7 gold-stdout.txt (delta-verify-repin | E12 | UNCERTAIN): xoá hết 'delta-verify-repin', 'E12', 'run-log', 'known-limits' khỏi câu — phần còn lại không còn truyền đạt được quyết định gì; nếu bản sửa thay slug bằng mô tả người-dùng-thấy-gì và giải nghĩa mã 3-5 chữ thì verdict đổi.
        - Toàn bộ cột 'Hạng mục' (dòng 7-23): liệt kê mọi mã xuất hiện lần đầu (E9, E10, E11, E12, E13, E15, E16, M8-M11) không có 3-5 chữ chú giải theo đúng luật N3 ở file human-facing-language.md dòng 27 — nếu thêm chú giải cạnh mỗi mã lần đầu thì verdict đổi.
        - Dòng 28 gold-stdout.txt: 'domain-correctness', 'operational-feasibility', 'spec-alignment' dùng làm nhãn lens không dịch, vi phạm N6 (human-facing-language.md dòng 30) — nếu thay bằng tên lens tiếng sản phẩm hoặc chua nghĩa thì verdict đổi.
  required_evidence:
    - "[domain-correctness] Bản sửa cột 'Hạng mục' của bảng Sổ vàng (dòng 7-18 gold-stdout.txt) có thêm 3-5 chữ giải nghĩa ngay lần đầu mỗi mã xuất hiện (VD 'E12 (chấp nhận sửa-tay run-log)') — đúng luật N3."
    - "[domain-correctness] Bản sửa cột 'Việc' đổi chủ ngữ dòng từ slug nội bộ (delta-verify-repin, matrix-measure-law, ngon-ngu-mat-nguoi...) sang câu tả người dùng/sản phẩm thấy gì khác, đẩy slug xuống ngoặc/cột phụ — đúng luật N1/N2."
    - "[domain-correctness] Bản sửa ô 'Người quyết' của dòng E16 và M9 (dòng 9, 16) tách các ý đang nhồi bằng dấu chấm phẩy/gạch ngang thành các dòng riêng, thay thuật ngữ máy (run_id, sha, kind:repin, round-trip, charter) bằng chữ thường hoặc chú giải — đúng luật N4/N6."
    - "[operational-feasibility] Bản sửa của _acceptance/judge-required-evidence/evidence/gold-stdout.txt: cột 1 đổi từ slug máy (vd. delta-verify-repin) sang một câu chủ ngữ-người-dùng/sản phẩm mô tả việc đã đổi, slug kỹ thuật lùi xuống ngoặc — kiểm bằng phép thử Xoá-tên-máy trên từng dòng của bảng 'Sổ vàng'"
    - "[operational-feasibility] Bản sửa cùng file: lần xuất hiện đầu tiên của mỗi mã hạng mục (E12, E13, E16, M8, M9, M10, M11) trong cột 'Hạng mục' kèm 3–5 chữ nói nó kiểm cái gì, đúng luật N3 ở human-facing-language.md dòng 27"
    - "[operational-feasibility] Bản sửa đoạn 'Các giám khảo đồng thuận tới đâu': thay domain-correctness/operational-feasibility/spec-alignment bằng tên tiếng Việt có trong CONTEXT.md (hoặc thêm mục CONTEXT.md cho ba tên này) trước khi trình cho người quyết kinh doanh, đúng luật N6"
    - "[spec-alignment] Dòng 7 gold-stdout.txt (delta-verify-repin | E12 | UNCERTAIN): xoá hết 'delta-verify-repin', 'E12', 'run-log', 'known-limits' khỏi câu — phần còn lại không còn truyền đạt được quyết định gì; nếu bản sửa thay slug bằng mô tả người-dùng-thấy-gì và giải nghĩa mã 3-5 chữ thì verdict đổi."
    - "[spec-alignment] Toàn bộ cột 'Hạng mục' (dòng 7-23): liệt kê mọi mã xuất hiện lần đầu (E9, E10, E11, E12, E13, E15, E16, M8-M11) không có 3-5 chữ chú giải theo đúng luật N3 ở file human-facing-language.md dòng 27 — nếu thêm chú giải cạnh mỗi mã lần đầu thì verdict đổi."
    - "[spec-alignment] Dòng 28 gold-stdout.txt: 'domain-correctness', 'operational-feasibility', 'spec-alignment' dùng làm nhãn lens không dịch, vi phạm N6 (human-facing-language.md dòng 30) — nếu thay bằng tên lens tiếng sản phẩm hoặc chua nghĩa thì verdict đổi."
  human_override:

- eval: J14
  judged_by: judge-panel (fresh context, 3 lens)
  proposal: UNCERTAIN
  rationale: Cả 3 lens đồng thuận UNCERTAIN — input được cấp cho vòng chấm này không có run-log.jsonl của S4 nên không thể tự grep kind:panel để đếm proposal ≠ PASS có required_evidence hay không; AC-14 trong contract.md có khai đúng công thức đếm nhưng đó là lời khai chứ không phải bằng chứng run-log thật đã chạy.
  votes:
    - domain-correctness: UNCERTAIN — Trong phạm vi input được cấp (contract.md + design spec) không có run-log.jsonl của S4 vòng này nên không thể grep kind:panel để đếm dòng non-PASS có required_evidence hay không — đúng tình huống "chưa chấm được S4 lúc chấm". Gói Cổng 2 CÓ khai rõ cách đếm: AC-14 trong contract.md nói đúng công thức — "mọi dòng kind:panel proposal ≠ PASS phải mang required_evidence không rỗng; chưa có dòng không-PASS nào thì đo bằng harness + máy trả UNCERTAIN, người đếm tại Cổng 2" — khớp với thiết kế mục "Ngưỡng sống/chết (1) dogfood" trong design spec.
      required_evidence:
        - run-log.jsonl của S4 chính vòng judge-required-evidence này (đường dẫn dạng _acceptance/judge-required-evidence/... hoặc nơi S4 ghi log) — chạy `grep 'kind:panel' run-log.jsonl` rồi kiểm mỗi dòng có proposal khác PASS có field required_evidence không rỗng; nếu file này được đưa vào input, verdict có thể đổi thành PASS (nếu mọi dòng non-PASS đều có required_evidence, hoặc không có dòng non-PASS nào và case harness JR1/JR2 pass) hoặc FAIL (nếu có dòng non-PASS thiếu required_evidence).
    - operational-feasibility: UNCERTAIN — Danh sách Input chỉ có contract.md và design spec — không có run-log.jsonl của slug judge-required-evidence, nên không thể tự grep kind:panel để đếm proposal ≠ PASS có required_evidence hay không. Trong phạm vi cho phép, AC-14 của contract.md đã khai rõ cách người đếm tại Cổng 2 (grep kind:panel; dòng không-PASS phải mang required_evidence không rỗng; chưa có dòng không-PASS nào thì đo bằng harness case JR1/JR2, máy trả UNCERTAIN) — khớp đúng nghi thức được yêu cầu, nhưng đây là lời khai trong contract chứ không phải bằng chứng run-log thật đã chạy.
      required_evidence:
        - run-log.jsonl của vòng S4 hiện tại cho slug judge-required-evidence (đường dẫn dạng _acceptance/judge-required-evidence/run-log.jsonl hoặc tương đương) — chạy `grep '"kind":"panel"' run-log.jsonl` rồi với mỗi dòng có proposal ≠ PASS, kiểm `required_evidence` có mặt và không rỗng; nếu mọi dòng đều có thì verdict đổi thành PASS, nếu thiếu ở dòng nào thì verdict đổi thành FAIL
        - Nếu chưa có dòng kind:panel không-PASS nào: output của harness case JR1/JR2 (đường dẫn script/case trong _acceptance/judge-required-evidence/ hoặc evals/ tương ứng) xác nhận case này thực sự chạy và PASS/FAIL — để phân biệt 'chưa chạy' với 'chạy và không có non-PASS'
    - spec-alignment: UNCERTAIN — Chưa có run-log.jsonl của S4 vòng này trong phạm vi input được cấp nên không thể tự chạy grep kind:panel để đếm — đúng tình huống "bình thường lúc chấm" mà đề bài dự liệu. Gói Cổng 2 (AC-14 trong contract.md) đã khai rõ cách người đếm: mọi dòng kind:panel có proposal ≠ PASS phải mang required_evidence không rỗng, và nếu chưa có dòng không-PASS nào thì đo bằng harness (case JR1/JR2) — khớp đúng nghi thức đếm mà câu hỏi J14 yêu cầu, nên không tô xanh trước mà để người đếm tại Cổng 2.
      required_evidence:
        - Chạy S4 verify thật cho slug judge-required-evidence rồi lấy _acceptance/judge-required-evidence/run-log.jsonl, grep 'kind:panel' — nếu tồn tại dòng có proposal khác PASS mà required_evidence rỗng/thiếu thì verdict đổi thành FAIL; nếu mọi dòng không-PASS đều có required_evidence không rỗng (hoặc không có dòng không-PASS nào) thì verdict đổi thành PASS
        - Nếu run-log.jsonl chưa tồn tại (S4 chưa chạy), lấy kết quả case harness JR1/JR2 (đường dẫn cụ thể, ví dụ output test hoặc file case trong _acceptance/judge-required-evidence/ hoặc thư mục test tương ứng) chứng minh máy tự trả UNCERTAIN đúng như AC-14 mô tả khi chưa có dòng không-PASS nào
  required_evidence:
    - "[domain-correctness] run-log.jsonl của S4 chính vòng judge-required-evidence này (đường dẫn dạng _acceptance/judge-required-evidence/... hoặc nơi S4 ghi log) — chạy `grep 'kind:panel' run-log.jsonl` rồi kiểm mỗi dòng có proposal khác PASS có field required_evidence không rỗng; nếu file này được đưa vào input, verdict có thể đổi thành PASS (nếu mọi dòng non-PASS đều có required_evidence, hoặc không có dòng non-PASS nào và case harness JR1/JR2 pass) hoặc FAIL (nếu có dòng non-PASS thiếu required_evidence)."
    - "[operational-feasibility] run-log.jsonl của vòng S4 hiện tại cho slug judge-required-evidence (đường dẫn dạng _acceptance/judge-required-evidence/run-log.jsonl hoặc tương đương) — chạy `grep '\"kind\":\"panel\"' run-log.jsonl` rồi với mỗi dòng có proposal ≠ PASS, kiểm `required_evidence` có mặt và không rỗng; nếu mọi dòng đều có thì verdict đổi thành PASS, nếu thiếu ở dòng nào thì verdict đổi thành FAIL"
    - "[operational-feasibility] Nếu chưa có dòng kind:panel không-PASS nào: output của harness case JR1/JR2 (đường dẫn script/case trong _acceptance/judge-required-evidence/ hoặc evals/ tương ứng) xác nhận case này thực sự chạy và PASS/FAIL — để phân biệt 'chưa chạy' với 'chạy và không có non-PASS'"
    - "[spec-alignment] Chạy S4 verify thật cho slug judge-required-evidence rồi lấy _acceptance/judge-required-evidence/run-log.jsonl, grep 'kind:panel' — nếu tồn tại dòng có proposal khác PASS mà required_evidence rỗng/thiếu thì verdict đổi thành FAIL; nếu mọi dòng không-PASS đều có required_evidence không rỗng (hoặc không có dòng không-PASS nào) thì verdict đổi thành PASS"
    - "[spec-alignment] Nếu run-log.jsonl chưa tồn tại (S4 chưa chạy), lấy kết quả case harness JR1/JR2 (đường dẫn cụ thể, ví dụ output test hoặc file case trong _acceptance/judge-required-evidence/ hoặc thư mục test tương ứng) chứng minh máy tự trả UNCERTAIN đúng như AC-14 mô tả khi chưa có dòng không-PASS nào"
  human_override:

## Analyst

Các eval sau PASS trên CẢ head lẫn baseline (diffBase) — không phân biệt được feature với code cũ, cần người xem lại nên viết lại để assert hành vi mới hay xác nhận là regression-guard có chủ ý:

- bash tests/workflows/run-tests.sh: J1, J2, J3, J6
- bash tests/plugins/run-tests.sh: J4, J5, J7, J8, J9, J10
- bash tests/scripts/run-tests.sh: J11

## Variance

none — every multi-run eval is uniform (không có eval nào mang field `runs` > 1 trong lần chạy này).

## Iterations

Chưa có — đây là vòng verify đầu tiên (round 1); chưa có vòng trước nào để đối chiếu.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
