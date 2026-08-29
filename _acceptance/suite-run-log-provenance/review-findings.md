## Trong hợp đồng

- **Tuyên quét LỚP nhưng chỉ có điểm-case: dòng run-log của LỆNH SUITE không có phép so tập-khoá nào — bỏ `round` vẫn xanh 389/389**
  file: `tests/workflows/acceptance-verify.test.mjs:90`
  severity: low
  AC: AC-1
  detail: Dòng run-log của EVAL có phép so hình dạng TOÀN PHẦN: chân `khong-hoi-quy` trong _acceptance/suite-run-log-provenance/rang.sh (dòng 197–233) chạy cùng một fixture qua hai writer rồi so `Object.keys(l).sort()`, và eval E7 khai đích danh bộ khoá `ts,round,evalId,run_id,exit_code,cmd`. Dòng SUITE — thành viên MỚI của cùng lớp «dòng run-log» — không có phép so tương ứng: fixture của khoa.mjs khai `suiteCommands: []` (rang.sh dòng 205) nên nó không bao giờ nhìn thấy dòng SUITE, và phía test chỉ có các assert điểm cho từng trường rời (W03 `suiteLine.evalId`/`run_id` dòng 91–95, W03 `lines.every(l => l.ts === ...)` dòng 87, DV6 `lines.every(l => l.sha === SHA)` dòng 1347, W31 `exit_code`/`cannot_run`, W03 `cmd`). Trường `round` rơi khỏi mọi assert.

    Đo được, không suy diễn: tôi dựng bản sao `git archive HEAD`, xoá đúng `round: args.round,` khỏi khối push dòng SUITE (feature-loop/workflows/acceptance-verify.js:632, chỉ dòng SUITE — dòng eval ở 643 giữ nguyên) rồi chạy lại suite: `Results: 389 passed, 0 failed`. Cả tám chân răng cũng xanh, vì chúng chỉ grep các tên ca đó trong stdout. Phá đúng vật mà phép đo không đỏ = lớp phòng thủ chưa sống.

    Hiện tại chưa có bộ đọc engine nào lọc run-log theo `round` (lib/evidence-core.cjs `loadRunLogIds` không đọc trường này), nên đây là lỗ đo chứ chưa phải false-green đang chảy máu — nhưng nó đúng hình dạng 5: lớp «dòng run-log» được tuyên bằng một ma trận khoá toàn phần cho một nhánh và chỉ bằng điểm-case cho nhánh còn lại. Vá rẻ: cho khoa.mjs khai một `suiteCommands` rồi so tập khoá của CẢ hai loại dòng (số assert = số loại dòng), thay vì chỉ `result.runLog[0]`.
  rationale: AC-1 đòi dòng sổ của lệnh suite mang «ts/round như mọi dòng khác»; finding chứng minh bằng phép tiêm thật rằng không phép đo nào (kể cả tám chân răng) đỏ khi trường round bị xoá khỏi dòng SUITE, tức yêu cầu này của AC-1 hiện không được lưới nào canh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Giới hạn đã khai trong hợp đồng nói sai số vật được canh ("ba file" vs sáu) — người ký đọc lời khai lệch**
  Người dùng thấy gì: Phần liệt kê giới hạn mà người ký đọc trước khi duyệt đang ghi sai số lượng tệp thật đang được canh, có thể khiến người ký hiểu nhầm phạm vi bảo vệ hẹp hơn thực tế.
  file: `_acceptance/suite-run-log-provenance/contract.md:150`
  severity: medium
  Đề xuất: known-limits

- **Không phép đo nào bắt bản chấm phải THẬT SỰ mang khối lệnh suite — seam LLM-viết→máy-đọc chỉ được canh một chiều**
  Người dùng thấy gì: Nếu máy soạn bản chấm bỏ hẳn phần ghi lệnh canh hồi quy, hệ thống vẫn có thể báo xanh và cho ký duyệt mà người đọc không thấy dấu vết lệnh đó từng chạy.
  file: `feature-loop/workflows/acceptance-verify.js:957`
  severity: medium
  Đề xuất: new-contract

- **Chú thích đầu răng nói "bảy chân" trong khi script có tám**
  Người dùng thấy gì: Ghi chú mô tả tệp kiểm tra nói ít bước hơn số thật đang chạy, có thể khiến người đọc sau này đánh giá nhầm phạm vi đang được canh gác.
  file: `_acceptance/suite-run-log-provenance/rang.sh:2`
  severity: low
  Đề xuất: known-limits

- **Thông điệp ghim trong evals.yaml lệch một chữ với thông điệp răng thật in ra**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm ghi sai một chữ trong thông điệp mong đợi, khiến người đối chiếu kết quả bằng tài liệu đó có thể xác nhận nhầm.
  file: `_acceptance/suite-run-log-provenance/evals.yaml:38`
  severity: low
  Đề xuất: known-limits

- **GCS1b is a dead assertion — gate-card.js never prints run_id values, so it passes whether or not the fix is present**
  Người dùng thấy gì: Một phép kiểm tự động trong bộ kiểm luôn báo đạt bất kể sửa đúng hay sai nên không còn tác dụng canh gác, nhưng một phép kiểm khác đứng cạnh vẫn đang canh đúng chỗ đó nên chưa có lỗ hổng thật sự lọt ra ngoài.
  file: `tests/scripts/run-tests.sh:1673`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/6 lỗi rơi vào file không bộ đo nào phủ (_acceptance/suite-run-log-provenance/contract.md, _acceptance/suite-run-log-provenance/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
