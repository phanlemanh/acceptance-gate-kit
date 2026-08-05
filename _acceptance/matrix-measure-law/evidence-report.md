---
schema_version: 2
feature_slug: matrix-measure-law
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ebbef53b953c5a6a418d57866e14b5d6109ce172
# bypass_ack:
human_signoff:
---

# Evidence Report: matrix-measure-law

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| M1 | AC-1 | test | PASS |
| M2 | AC-2 | test | PASS |
| M3 | AC-3 | test | PASS |
| M4 | AC-4 | test | PASS |
| M5 | AC-5 | test | PASS |
| M6 | AC-6 | test | PASS |
| M7 | AC-7 | test | PASS |
| M8 | AC-8 | judgment | PASS |
| M9 | AC-9 | judgment | FAIL |
| M10 | AC-10 | judgment | UNCERTAIN |
| M11 | AC-9 | judgment | PASS |

## Evidence

- eval: M1
  run_id: minted-matrix-measure-law-M1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T13:05:00Z
  output: |
    Results: 33 passed, 0 failed (measure-law-mutants.test.mjs)
    Results: 54 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: M2
  run_id: minted-matrix-measure-law-M2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T13:05:00Z
  output: |
    Results: 33 passed, 0 failed (measure-law-mutants.test.mjs)
    Results: 54 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: M3
  run_id: minted-matrix-measure-law-M3-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T13:05:00Z
  output: |
    Results: 33 passed, 0 failed (measure-law-mutants.test.mjs)
    Results: 54 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: M4
  run_id: minted-matrix-measure-law-M4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T13:05:00Z
  output: |
    Results: 33 passed, 0 failed (measure-law-mutants.test.mjs)
    Results: 54 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: M5
  run_id: minted-matrix-measure-law-M5-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T13:05:00Z
  output: |
    Results: 33 passed, 0 failed (measure-law-mutants.test.mjs)
    Results: 54 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: M6
  run_id: minted-matrix-measure-law-M6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T13:05:00Z
  output: |
    Results: 33 passed, 0 failed (measure-law-mutants.test.mjs)
    Results: 54 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: M7
  run_id: minted-matrix-measure-law-M7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-05T13:05:00Z
  output: |
    Results: 33 passed, 0 failed (measure-law-mutants.test.mjs)
    Results: 54 passed, 0 failed (skill-claims.test.mjs)
    Results: all workflow tests passed

- eval: M8
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  panel: carried từ round 1 — inputs không đổi, không chấm lại; rationale xem round đó
  proposal: PASS
  votes:
    - domain-correctness: PASS (r1)
    - operational-feasibility: PASS (r1)
    - spec-alignment: PASS (r1)
  human_override:

- eval: M9
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: FAIL
  votes:
    - domain-correctness: FAIL — Cả hai SKILL đưa đúng 4 câu cross-check lớp đo-lường vào prompt gap-probe S1#7 với văn bản khớp gần như từng chữ giữa hai file (VN: "...fixture nào viết tay đúng khuôn bên đọc · fixture nào (kể cả code-sinh) tự dựng đúng khuôn bên đọc mà không round-trip rút-từ-writer-thật · assert nào đo chuỗi-có-mặt trong khi lời hứa là quan hệ · eval nào đo CHỈ DẪN...thay vì ĐẦU RA thật"; EN tương ứng). Nhưng 2/4 câu — fixture viết tay và fixture tự dựng không round-trip — đòi critic phán một sự thật cấp triển khai (cách fixture thật sự được dựng) chỉ từ field `expected` của evals.yaml + design doc ở S1, trước khi code tồn tại và trong khi critic bị cấm đọc code repo; nếu `expected` không mô tả cách dựng fixture (trường hợp phổ biến khi evals.yaml chỉ ghi kết quả mong đợi, không ghi cơ chế), critic không có căn cứ văn bản để bắt và có thể trả "clean" đúng nghĩa đen dù bộ artifact thật sự tái phạm đúng 2 trong 4 hình dạng lịch sử đó — đây là khoảng mơ hồ cụ thể, trích dẫn được, nên câu trả lời cho AC-9 là critic KHÔNG có đủ căn cứ cho ít nhất 2/4 câu.
    - operational-feasibility: FAIL — Cả 2 SKILL đều nói rõ 4 câu cross-check lớp-đo-lường (mở trong ý-4 gap-probe) được trả lời "từ field `expected` của evals.yaml + design doc, tức KẾ HOẠCH ... không cần code, code chưa tồn tại" — nhưng schema evals.yaml trong chính 2 SKILL này không có structural slot nào bắt buộc khai cách fixture sẽ được sinh (viết tay hay round-trip từ writer thật), nên câu "fixture nào ... tự dựng đúng khuôn bên đọc mà không round-trip rút-từ-writer-thật" hoàn toàn có thể được trả "clean" đúng-chữ khi plan chỉ đơn giản im lặng về khâu này — không phải vì không có lỗ mà vì plan chưa cam kết gì để soi, và prompt đòi "kịch bản fail cụ thể" nên sự im lặng không tự động thành finding. Câu "đo chỉ dẫn thay đầu ra" cũng mơ hồ tương tự vì `cmd` ở S1 chỉ là dotted ref chưa resolve — cơ chế đọc thật (renderer đọc key hay đọc file hướng dẫn) không lộ diện cho tới khi có code, tức đúng lúc gap-probe không được phép đòi. Chỉ câu "đo từ-vựng thay quan hệ" có căn cứ vững vì so trực tiếp được giữa GWT của contract (một quan hệ) và mô tả `expected` của eval (chuỗi-có-mặt hay không) — cả hai đều là artifact tĩnh có sẵn ở S1; 3/4 câu còn lại phụ thuộc thông tin implementation chưa tồn tại nên thiếu tính khả thi vận hành thật sự cho critic pre-code.
    - spec-alignment: FAIL — Trong 4 hình dạng nêu, chỉ 2 (đo chỉ dẫn thay đầu ra; đo từ-vựng thay quan hệ) có căn cứ kiểm được từ nội dung prose của field `expected`/GWT theo đúng cách SKILL.md mô tả ("trả lời các câu này từ field expected của evals.yaml + design doc"). Hai câu còn lại — "fixture nào viết tay đúng khuôn bên đọc" và "fixture... không round-trip rút-từ-writer-thật" — hỏi về cách fixture được DỰNG (thủ công hay code-sinh, có round-trip hay không), nhưng schema evals.yaml mà cả hai SKILL.md tự định nghĩa (cmd/paths/runs/layer/expected) không có field nào ghi lại nguồn gốc fixture; đây là quyết định implementation phát sinh ở S3, S1 không bắt buộc khai nó. Vì vậy một bộ artifact S1 tái phạm đúng 2 hình dạng fixture đó sẽ không để lại bằng chứng mâu thuẫn nào trong phạm vi 4 input (design doc + contract + evals.yaml + decisions.jsonl) mà critic được phép đọc, nên critic trả "clean" ở đúng 2 câu này là hợp thức theo đúng chữ của prompt — tức prompt như hiện viết KHÔNG đủ căn cứ cấu trúc để bắt 2/4 hình dạng lịch sử được nêu.
  human_override:

- eval: M10
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — AC-10 trong contract.md khai rõ cách đếm: "S4 của CHÍNH vòng này chạy script nguồn có lens — transcript/usage có label review:measurement thật; máy trả UNCERTAIN trước khi S4 chạy, người đếm tại Cổng 2" — khớp với cơ chế dogfood mô tả trong design doc (mục "Dogfood + kích hoạt carry thật": label review:measurement đếm được trong transcript/run-log của chính vòng S4 này). Hai file input không chứa bằng chứng S4 của vòng này đã chạy (không có transcript/run-log/usage), nên đúng theo chính điều kiện AC-10 đặt ra, chưa có căn cứ tô xanh — trả UNCERTAIN là kỳ vọng bình thường tại thời điểm này, và gói đã khai đủ rõ cách người đếm tại Cổng 2.
    - operational-feasibility: UNCERTAIN — Cả hai file input chỉ mô tả thiết kế/hợp đồng, không phải bằng chứng chạy — không có run-log hay evidence-report nào cho thấy S4 của vòng này đã thực thi, nên chưa thể xác nhận label `review:measurement` xuất hiện thật trong transcript/usage. Gói có khai rõ cách đếm: AC-10 nói thẳng "máy trả UNCERTAIN trước khi S4 chạy, người đếm tại Cổng 2", và design doc mục Dogfood ghim GO-condition (1) là "S4 vòng này có label `review:measurement` chạy thật" cộng cơ chế đếm qua transcript/run-log — tức bản thân contract đã tự đóng khung câu hỏi này thành UNCERTAIN-trước-khi-chạy, đúng như tiêu chí M10 yêu cầu.
    - spec-alignment: UNCERTAIN — Trong phạm vi 2 file được cấp, không có bằng chứng S4 của vòng này đã chạy (contract.md chỉ ghi status: implemented, không có evidence-report hay run-log nào được liệt trong Input). Gói có khai rõ cách đếm: AC-10 của contract.md nêu tường minh "transcript/usage có label review:measurement thật; máy trả UNCERTAIN trước khi S4 chạy, người đếm tại Cổng 2", và design.md mục "Dogfood + kích hoạt carry thật" + ngưỡng GO(1) mô tả đúng cùng cơ chế đếm nhãn này — nên điều kiện "khai rõ cách đếm" đã thoả. Theo đúng chỉ dẫn của câu hỏi M10/AC-10: chưa có S4 chạy trong phạm vi input ⇒ UNCERTAIN, không tô xanh AC-10 trước khi S4 chạy thật.
  human_override:

- eval: M11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  votes:
    - domain-correctness: PASS — Ý (4) trong SKILL.md chứa nguyên văn tiêu chí "assertion âm tính nào thiếu đối chứng dương hoặc không ghim thông điệp", khớp chính xác hình dạng gài trong Khối A (expected chỉ có "exit khác 0 là đạt", không đối chứng dương, không ghim thông điệp) và chỉ rõ eval X1 (duy nhất trong khối) làm điểm neo dòng. Khối B có cả hai vế (nhánh exit 0 đối chứng dương + nhánh exit≠0 kèm ghim "missing required field: owner") nên không khớp bất kỳ tiêu chí nào khác trong ý (4) (ma trận toàn phần, fixture tay/round-trip, chuỗi-có-mặt-vs-quan-hệ, đo chỉ dẫn, hardcode ROOT đều không áp dụng ở đây) — không có căn cứ báo oan. Ý (4) như đang viết đủ răng cho cả hai vế của câu hỏi M11/AC-9.
    - operational-feasibility: PASS — Ý (4) trong SKILL.md liệt kê rõ mục "assertion âm tính nào thiếu đối chứng dương hoặc không ghim thông điệp" — khớp 1:1 với hình dạng gài ở Khối A: eval X1 chỉ có `expected: "...exit khác 0 là đạt"` (một nhánh âm, không đối chứng dương, không thông điệp), đủ căn cứ để critic chỉ đúng dòng `expected` của X1 và gọi tên đúng hình dạng vi phạm. Khối B sửa đúng cả hai vế (nhánh dương exit 0 + nhánh âm kèm "chứa đúng thông điệp") nên thoả trọn tiêu chí của cùng mục checklist, không có cơ sở để báo oan. Vì độ khớp giữa câu hỏi trong ý (4) và hình dạng bị gài là trực tiếp và cụ thể (không mơ hồ), critic chạy đúng ý (4) bắt được A và không báo oan B.
    - spec-alignment: PASS — Ý (4) của gap-probe nêu đích danh tiêu chí "assertion âm tính nào thiếu đối chứng dương hoặc không ghim thông điệp" — áp thẳng vào dòng `expected` của eval X1 ở Khối A (chỉ có nhánh exit≠0, không có bản sao nguyên vẹn đối chứng, không ghim message) nên critic có căn cứ chỉ đúng dòng vi phạm. Khối B thoả cả hai vế của đúng tiêu chí đó (nhánh exit 0 đối chứng dương + stderr ghim đúng chuỗi thông điệp) nên không bị chính clause này báo oan, và không clause nào khác trong ý (4) (ma trận toàn phần, fixture viết tay, round-trip, chuỗi-có-mặt, chỉ-dẫn-vs-đầu-ra, hardcode ROOT) khớp với nội dung hai khối để gây nhiễu.
  human_override:

## Analyst

M1, M2, M3, M4, M5, M6, M7 (lệnh `bash tests/workflows/run-tests.sh`) — baseline đo lại tại round này (`baseline: green` cho toàn bộ 7 eval): xanh trên cả HEAD lẫn diffBase, tức bảy eval này tiếp tục non-discriminating cho tới khi được viết lại để assert hành vi mới, hoặc được xác nhận là regression-guard có chủ ý.

## Variance

none — không có eval nào có runs > 1 trong round này (mọi block máy đều runs: 1, variance: false); không có mục variance nào cần người quyết.

## Iterations

Round 1: M8 PASS, M10 UNCERTAIN chấm xong (giữ nguyên các round sau vì input không đổi); M9, M11 chưa chốt — quay lại implementation để sửa gap-probe P0 (ranh giới high-confidence + đối chứng 2 finder cũ trong prompt review) và P2 (nguồn pin kiểm được bằng git show) tại commit 36401e1.
Round 2: M1–M7 xanh 421/421; panel chấm lại M9 → FAIL cả 3 lens (mơ hồ dấu "/" trong ý (4) vẫn cho phép fixture code-sinh-nhưng-không-round-trip lọt qua) và M11 → PASS cả 3 lens; M8/M10 carried không chấm lại. Quay lại implementation để bổ sung câu cross-check thứ 4 cho ý (4), siết đúng khe hở mà M9 nêu.
Round 3 (hiện tại): M1–M7 xanh (33+54 test passed trong measure-law-mutants.test.mjs/skill-claims.test.mjs; toàn bộ suite khác — scripts/hooks/plugins/sync-plugin-packages/product-map — cũng không lỗi); baseline đo lại → green (non-discriminating, như round 1/round 2). Panel chấm lại cả M9/M10/M11 trên gap-probe đã có đủ 4 câu cross-check: M9 vẫn FAIL cả 3 lens (thu hẹp còn 2/4 câu thiếu căn cứ pre-code, thay vì 3/4 ở round 2) và M10 vẫn UNCERTAIN (chưa có S4 chạy thật của chính vòng này để đếm label review:measurement); M11 vẫn PASS cả 3 lens; M8 carried từ round 1. failed_evals rỗng — verdict PENDING-JUDGMENT chờ người xử lý M9 (FAIL) và M10 (UNCERTAIN) ở Cổng 2.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract