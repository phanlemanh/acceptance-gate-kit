## Trong hợp đồng

- **Carry-forward dedupe still lets a fresh finding whose title starts with '(r…' or '(R…' silently swallow the carried item**
  file: `feature-loop/workflows/acceptance-verify.js:388`
  severity: medium
  AC: AC-3
  source: bugs
  detail: The rewritten check in chenMucCarry is `x.title.startsWith(c.title + ' (') && /^\([rR]/.test(x.title.slice(c.title.length + 1))`. It only checks that the parenthesis opens with r or R. It does not check for the round-label shape that OOC_TITLE_RE itself defines (`\([rR](?:\d+|\?)…`). A fresh, unlabelled finding on the same file whose title is the carried title plus any parenthetical starting with r/R therefore counts as 'already printed', and the carried item is never inserted. Examples: 'Lỗi X (race condition)', '(refactor)', '(Redux …)'. Reproduced by running chenMucCarry extracted from the file: input block `- **Lỗi X (race condition)**\n  file: lib/a.cjs:3` with carried {title:'Lỗi X', file:'lib/a.cjs', fromRound:1} returns the text unchanged, so the carried item disappears from review-findings.md and from the Gate 2 card with no flag. This is the AC-12 class ('a fresh, longer-titled item on the same file must not swallow the carry'). The new line widens the hole from lowercase to uppercase R as well. Fix: require the label shape, e.g. `/^\([rR](?:\d+|\?)(?:\s*[·,—–-][^()]*)?\)$/`, matching the label group of OOC_TITLE_RE.
  rationale: AC-3 có «chiều im» nêu đích danh: mục tươi cùng tệp, tên dài hơn, không được nuốt mục mang sang; finding tái hiện đúng hình này (tên tươi = tên mang sang + ngoặc mở bằng r/R) và mục mang sang biến mất.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The new reader's «run_id rỗng» test strips quotes differently from the readers it warns about, so they drift again**
  Người dùng thấy gì: Nếu một báo cáo mang mã chạy chỉ gồm toàn dấu nháy lồng nhau, hệ thống vẫn bỏ qua lặng lẽ và không hiện ghi chú cảnh báo mã chạy rỗng. Trường hợp này hiếm, người đọc báo cáo sẽ không được báo gì.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **The empty-run_id note misses quote-only values that the run_id reader strips to empty and skips**
  Người dùng thấy gì: Một số kiểu mã chạy rỗng viết bằng nhiều lớp dấu nháy vẫn lọt qua mà không có ghi chú cảnh báo, nên báo cáo trông như đủ bằng chứng trong khi thật ra thiếu mã chạy.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét LỚP «ĐỦ mọi dạng nhãn bộ đọc thẻ nhận» nhưng ma trận chỉ có điểm-case chọn tay**
  Người dùng thấy gì: Nếu ai đó vô tình bỏ hai kiểu gạch nối khỏi danh sách nhãn nhận biết, các mục ngoài hợp đồng gắn nhãn kiểu đó có thể biến mất khỏi thẻ duyệt mà không bài kiểm tra nào báo đỏ.
  file: `tests/workflows/doc-ghi-troi.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
