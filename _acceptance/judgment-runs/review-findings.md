# Review Findings: judgment-runs (round 4)

## Trong hợp đồng

(không có finding nào ánh xạ được vào AC ở vòng này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Cờ ô-inert trên thẻ Cổng 2 không lọc theo round — cảnh báo đã sửa vẫn hiện mãi**
  Người dùng thấy gì: Sau khi bạn sửa xong cảnh báo và chạy lại, thẻ duyệt ở Cổng 2 vẫn có thể tiếp tục hiện cảnh báo cũ dù lỗi đã hết — người ký có thể hiểu nhầm là bạn chưa sửa.
  file: `scripts/gate-card.js:389`
  severity: high
  Đề xuất: known-limits

- **Lớp phòng thủ lọc câu inert khỏi cờ phương-sai bị vô hiệu chỉ bằng một lần ngắt dòng**
  Người dùng thấy gì: Nếu câu cảnh báo dài bị xuống dòng khi hiển thị, thẻ duyệt có thể hiện nhầm một cảnh báo đỏ nặng thay vì cảnh báo vàng đúng, hoặc bỏ mất cảnh báo cần thiết — gây hiểu sai mức độ nghiêm trọng khi ký.
  file: `scripts/gate-card.js:405`
  severity: medium
  Đề xuất: known-limits

- **Đặt tên mới "sổ chạy" cho run-log.jsonl trùng nghĩa với "sổ luật-đã-chạy" đã có trong CONTEXT.md**
  Người dùng thấy gì: Từ "sổ chạy" có thể bị hiểu lẫn giữa hai khái niệm khác nhau trong tài liệu, khiến người đọc sau này khó xác định đúng cái nào đang được nói tới.
  file: `feature-loop/workflows/acceptance-verify.js:684`
  severity: low
  Đề xuất: known-limits

- **Card shows stale inert warning after the author fixed evals.yaml**
  Người dùng thấy gì: Sau khi sửa lỗi và chạy lại, thẻ duyệt vẫn có thể hiện cảnh báo cũ đã không còn đúng, khiến người ký nhầm rằng vấn đề chưa được xử lý.
  file: `scripts/gate-card.js:389`
  severity: high
  Đề xuất: known-limits

- **Inert warning disappears silently when the run-log line has no `note` field**
  Người dùng thấy gì: Với một số bản ghi cũ, thẻ duyệt có thể không hiện cảnh báo nào cả — cả cảnh báo đúng lẫn cảnh báo sai đều biến mất mà không có dấu hiệu gì báo cho người ký biết.
  file: `scripts/gate-card.js:406`
  severity: medium
  Đề xuất: known-limits

- **WI8 sanity counter depends on an unrelated feature workspace's evals.yaml**
  Người dùng thấy gì: Nếu ai đó sửa một tính năng cũ không liên quan, bộ kiểm tự động của tính năng này có thể báo lỗi giả — làm chậm việc phát hành dù tính năng vẫn hoạt động đúng.
  file: `tests/workflows/acceptance-verify.test.mjs:1028`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
