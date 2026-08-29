## Trong hợp đồng

- **Bằng chứng của chính vòng này KHÔNG cho thấy hành vi mới: 5 lệnh suite, 0 dòng SUITE- trong sổ chạy**
  file: `_acceptance/suite-run-log-provenance/run-log.jsonl:1`
  severity: high
  AC: AC-1
  `_acceptance/config.yaml` khai 5 suite_keys (executors.test.scripts/hooks/plugins/workflows + executors.script.product_map), và evidence-report.md của vòng này (dòng 105-150) liệt kê đúng 5 khối lệnh suite đó. KHÔNG lệnh nào trong 5 lệnh này trùng cmd của bất kỳ eval nào trong workspace (E1-E7 đều là `bash _acceptance/suite-run-log-provenance/rang.sh --chan …`), nên nhánh gộp-lệnh (AC-6/W32) không áp. Theo AC-1 và khối mới ở acceptance-verify.js:620-638, run-log.jsonl phải có 5 dòng `evalId: "SUITE-…"`. Thực tế: run-log.jsonl có đúng 7 dòng eval + 1 dòng baseline, `grep SUITE-` trả về rỗng; và cả 5 khối suite trong bản chấm đều VẮNG dòng `run_id`, tức vi phạm chính luật bản mẫu mà cùng commit này thêm vào ("Dòng `run_id` là BẮT BUỘC", evidence-report-template.md:177). Lời khai `verified_commit: 46f828e3` là commit ĐÃ có mã vá. Nghĩa là hoặc vòng S4 chạy bằng engine khác (bản cài) chứ không phải cây đang sửa — đúng lớp "thước không gắn vào vật được giao" — hoặc mã vá không cắn ở đường thật. Dù nhánh nào, hồ sơ đưa lên Cổng 2 hiện KHÔNG chứng được AC-1 đầu-cuối trên chính kho kit, trong khi mọi eval E1-E7 xanh (chúng chỉ chạy harness vm-realm, không chạy đường thật).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Diff làm đúng việc contract khai là NGOÀI phạm vi (đổi khuôn bản chấm)**
  Người dùng thấy gì: Tài liệu hợp đồng vẫn ghi rằng khuôn bản chấm không đổi, trong khi bản chấm thực tế đã có thêm một mục riêng cho lệnh kiểm hồi quy — người đọc hợp đồng ở cổng duyệt có thể hiểu nhầm về phạm vi thật của thay đổi.
  file: `_acceptance/suite-run-log-provenance/contract.md`
  severity: medium
  Đề xuất: known-limits

- **evals.yaml hứa chiều đỏ / số ô mà rang.sh không dựng**
  Người dùng thấy gì: Tài liệu mô tả các phép kiểm tự động nói rằng có nhiều trường hợp và nhiều ca được kiểm hơn số thực sự đang chạy — người xem báo cáo có thể tin nhầm mức độ kỹ lưỡng của việc kiểm tra.
  file: `_acceptance/suite-run-log-provenance/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Khối lệnh suite mới ghi đè run_id/verified_at của eval CUỐI trên trang bằng chứng Cổng 2**
  Người dùng thấy gì: Khi một vòng có kèm lệnh kiểm hồi quy, trang thẻ quyết định mà người ký đọc ở cổng bằng chứng có thể hiển thị sai mã chạy và thời điểm xác minh — gán nhầm bằng chứng của một tiêu chí cho một lệnh kiểm khác, khiến người ký có thể tin nhầm nguồn gốc bằng chứng mình đang duyệt.
  file: `scripts/evidence-page.js`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — assertion không sống: ca W36 đặt tên lớp lỗi «khoá prototype» nhưng phá đúng vật thì phép đo vẫn XANH**
  Người dùng thấy gì: Phép kiểm tự động bảo vệ cho việc phân biệt tên lệnh trùng nhau không thực sự phát hiện được nếu cơ chế này bị hỏng trong một lần sửa sau — một lỗi ở đúng chỗ nhạy cảm có thể lọt qua mà không ai được cảnh báo.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 6 — danh sách «vật được đo» viết tay khiến răng chấm bản HEAD thay vì cây đang sửa mà không kêu**
  Người dùng thấy gì: Cơ chế tự kiểm của hồ sơ này có thể lặng lẽ so sánh với phiên bản mã nguồn cũ thay vì bản đang sửa khi một số file liên quan còn thay đổi chưa lưu, khiến kết quả kiểm trông đúng dù chưa chắc đã đúng với bản mới nhất.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/6 lỗi rơi vào file không bộ đo nào phủ (_acceptance/suite-run-log-provenance/run-log.jsonl, _acceptance/suite-run-log-provenance/contract.md, _acceptance/suite-run-log-provenance/evals.yaml, scripts/evidence-page.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
