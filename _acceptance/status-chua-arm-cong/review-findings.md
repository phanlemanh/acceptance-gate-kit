# Review Findings: status-chua-arm-cong (round 1)

## Trong hợp đồng

_Không có finding nào map được vào một AC ở vòng này._

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Eval E3 ghim slug «[feat-new]» mà ARM05 thật in «[feat-arm]» — seam viết→đọc trôi**
  Người dùng thấy gì: Tài liệu mô tả cách kiểm tra tính năng dùng một tên ví dụ khác với tên mà bài kiểm tra thật sự chạy, nên người đọc tài liệu để đối chiếu sẽ không tìm thấy đúng chuỗi đã hứa — tính năng vẫn hoạt động đúng, chỉ tài liệu đối chiếu bị lệch tên.
  file: `_acceptance/status-chua-arm-cong/evals.yaml:49`
  severity: medium
  Đề xuất: known-limits

- **Luật (b) nổ oan khi PR có cả hồ sơ armed lẫn hồ sơ chưa arm — tiền đề «hồ sơ này đang thoả T1-escape» sai**
  Người dùng thấy gì: Nếu một PR gộp chung một tính năng đã hoàn tất bằng chứng với một tính năng khác còn đang nháp, hệ thống có thể báo lỗi chặn PR cho tính năng đang nháp dù nó không cần được chặn — cần cân nhắc riêng có nên coi đây là hành vi mong muốn hay cần sửa.
  file: `scripts/pre-merge-check.sh:686`
  severity: medium
  Đề xuất: known-limits

- **Vế (b) mượn tiền đề T1-escape nhưng không tôn trọng `--no-t1-escape` (ADR 0005)**
  Người dùng thấy gì: Trên một nhánh phát hành có cờ tắt kiểm tra đặc biệt, hệ thống vẫn có thể chặn nhầm một thay đổi hạ tầng hợp lệ dù đã in thông báo nói rằng kiểm tra đó đang tắt — hai thông báo mâu thuẫn nhau có thể gây nhầm lẫn.
  file: `scripts/pre-merge-check.sh:686`
  severity: low
  Đề xuất: known-limits

- **Lời hứa của eval E3/thiết kế nêu '[feat-new]' nhưng assertion thật ghim '[feat-arm]' (ARM05)**
  Người dùng thấy gì: Tài liệu thiết kế và bài kiểm tra dùng hai tên ví dụ khác nhau cho cùng một tình huống, nên đối chiếu tài liệu với kết quả kiểm tra thật sẽ không khớp chữ — bản thân tính năng vẫn hoạt động đúng.
  file: `_acceptance/status-chua-arm-cong/evals.yaml:47`
  severity: low
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' trong khi lời hứa là 'ĐÚNG MỘT hàng bảng' (rang.sh count_row)**
  Người dùng thấy gì: Công cụ tự động dùng để xác nhận tài liệu hướng dẫn có đúng một dòng thông báo mới có thể bị đánh lừa bởi một ghi chú văn xuôi tình cờ nhắc cùng cụm từ, khiến việc xác nhận không hoàn toàn đáng tin dù tài liệu hiện tại vẫn đúng.
  file: `_acceptance/status-chua-arm-cong/rang.sh:10`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/5 lỗi rơi vào file không bộ đo nào phủ (_acceptance/status-chua-arm-cong/evals.yaml, _acceptance/status-chua-arm-cong/rang.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
