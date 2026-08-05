## Trong hợp đồng

- **acceptance-gold.mjs parses evidence-report without skipping block scalars — log excerpts mint fake gold points**
  file: `scripts/acceptance-gold.mjs:27`
  severity: medium
  AC: AC-8
  collectGold() scans evidence-report.md line-by-line for `judged_by:`, `verdict:/proposal:` and `human_override:` with no YAML block-scalar skipping and no field allowlist. gate-card.js was explicitly hardened against this exact class (scripts/gate-card.js:340-342: "a log excerpt line like 'human_override: ...' inside output can't drop a real decision"), but the new reader re-introduces the naive parser. Reproduced: an eval block whose `output: |` excerpt contains `verdict: FAIL` and `human_override: Ghost 2026-01-01 — fake note` produces a gold point {machine: "FAIL", human: "Ghost 2026-01-01 — fake note from log"} — an invented human decision rendered into the human-facing "Sổ vàng" table, which the command doc promises is "rút từ chữ ký Cổng 2 đã có, không bịa". The excerpt can also supply the `judged_by:` line itself, so machine-eval blocks with log tails are enough to trigger it. Silent (no error, wrong data). Same bug in the mirror plugins/acceptance-gate/scripts/acceptance-gold.mjs — fix source then re-sync.
  (nguồn: bugs)
  rationale: AC-8 hứa mỗi điểm gold gồm verdict máy đề xuất và người-quyết+lý-do trích từ human_override thật; finding cho thấy cả hai trường này có thể bị bịa từ đoạn log trích dẫn trong report, phá đúng nội dung AC-8 cam kết.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **JR11a đóng băng vĩnh viễn lib/** và hooks/** trong CI — AC phạm-vi-feature bị nướng thành gate toàn-repo**
  Người dùng thấy gì: Nếu tính năng này được chấp nhận như hiện tại, mọi thay đổi trong tương lai chạm tới phần lõi dùng chung của công cụ — kể cả những thay đổi hợp lệ và cần thiết cho việc khác — sẽ luôn bị tự động chặn lại. Đội vận hành khi đó buộc phải gỡ bỏ chốt chặn này để đi tiếp, và từ đó về sau phần lõi dùng chung không còn ai bảo vệ nữa.
  file: `tests/scripts/core-untouched.test.mjs`
  severity: high
  Đề xuất: new-contract

- **P150 ghim đẳng-thức toàn-bộ stdout của gate-card so với bản merge-base — đóng băng output card cho mọi thay đổi tương lai**
  Người dùng thấy gì: Bất kỳ thay đổi nào sau này với cách hiển thị màn quyết định — kể cả thay đổi không liên quan gì tới tính năng này — có thể bị báo lỗi oan dù thực chất không có gì hỏng. Người vận hành sẽ phải tự tay bỏ qua cảnh báo đó, và theo thời gian cảnh báo dần mất tác dụng bảo vệ thật.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Trôi parity hai harness: bước gold set + G3 chỉ thêm vào commands/acceptance-report.md, bản Codex không được cập nhật**
  Người dùng thấy gì: Người dùng công cụ qua nhánh Codex sẽ nhận báo cáo thiếu hai phần thông tin (bảng tổng hợp quyết định và bảng đồng thuận) mà người dùng qua nhánh còn lại vẫn thấy đầy đủ — cùng một thao tác nhưng cho ra hai kết quả khác nhau tuỳ công cụ đang dùng.
  file: `codex/acceptance-gate/skills/acceptance-report/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **glossOf eval-id prefix collision — J1 can display J10's question gloss**
  Người dùng thấy gì: Trong một số trường hợp hiếm, bảng tổng hợp quyết định vàng có thể hiện nhầm câu hỏi của một mục khác cạnh mã số đúng. Người đọc bảng có thể hiểu nhầm mục nào đang được nói tới, dù đây chỉ là lỗi hiển thị chứ không đổi kết quả quyết định thật.
  file: `scripts/acceptance-gold.mjs`
  severity: low
  Đề xuất: known-limits

- **P154 mutant assertion is vacuous whenever a clause occurs more than once**
  Người dùng thấy gì: Cơ chế tự kiểm rằng báo cáo phải thay đổi khi một bước hướng dẫn quan trọng bị xoá có một kẽ hở: nếu nội dung đó lặp lại hai lần trong tài liệu, phép kiểm sẽ âm thầm bỏ qua việc kiểm tra thay vì báo lỗi — nghĩa là một bước quan trọng có thể bị xoá mà không ai được cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Fixture VIẾT TAY đúng khuôn bên đọc (shape 2) — P150 in ra report bằng printf thay vì sinh từ khuôn template**
  Người dùng thấy gì: Bài kiểm thử cho màn quyết định Cổng 2 dùng một bản dữ liệu mẫu viết tay thay vì bản được sinh ra từ khuôn thật của báo cáo. Nếu khuôn thật của báo cáo thay đổi sau này, phần hiển thị 'bằng chứng còn thiếu' có thể âm thầm biến mất khỏi màn quyết định thật mà không ai phát hiện ra, vì bài kiểm thử vẫn báo ổn.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Đo từ vựng thay vì quan hệ (shape 3) — JR1 assert prompt judge bằng hai substring độc lập, vế FAIL|UNCERTAIN vacuous**
  Người dùng thấy gì: Bài kiểm thử xác nhận máy chấm được nhắc phải liệt kê bằng chứng còn thiếu khi không đạt có một lỗ hổng: nó vẫn có thể báo 'ổn' ngay cả khi câu hướng dẫn quan trọng đó bị xoá khỏi lời nhắc, miễn còn sót một cụm từ khác đâu đó. Rủi ro là yêu cầu cốt lõi của tính năng — máy chấm phải nêu bằng chứng còn thiếu — có thể bị vô hiệu mà không ai biết.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Âm tính không ghim thông điệp (shape 4b) — P149 mutant leg chỉ so exit code, stderr bị ignore**
  Người dùng thấy gì: Bài kiểm thử xác nhận công cụ phát hiện đúng kiểu lỗi (báo cáo bịa nhưng ghi đạt) chỉ kiểm tra rằng công cụ CÓ báo lỗi, không kiểm tra công cụ có báo ĐÚNG loại lỗi hay không. Nếu sau này công cụ báo lỗi vì một nguyên nhân khác, bài kiểm thử vẫn báo ổn, khiến lỗi thật có thể lọt qua mà không bị phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Mutant leg có lối thoát vacuous khi clause trùng lặp (biến thể shape 4) — P154 assert `not X or count>1`**
  Người dùng thấy gì: Cơ chế tự kiểm rằng báo cáo phải thay đổi khi một bước hướng dẫn quan trọng bị xoá có một kẽ hở: nếu nội dung đó lặp lại hai lần trong tài liệu, phép kiểm sẽ âm thầm bỏ qua việc kiểm tra thay vì báo lỗi — nghĩa là một bước quan trọng có thể bị xoá mà không ai được cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).