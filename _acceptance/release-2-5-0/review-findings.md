## Trong hợp đồng

Không có finding nào ánh xạ được vào AC (rỗng).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **NOTE FOR UPGRADERS in v2.5.0 prints a verify-by-content grep that matches nothing**
  Người dùng thấy gì: Người nâng cấp làm đúng theo hướng dẫn kiểm tra trong ghi chú phát hành sẽ luôn thấy kết quả trống, tưởng bản cài của mình đã cũ và cứ lặp lại việc gỡ rồi cài lại — vô ích, không sửa được gì.
  file: `.claude-plugin/plugin.json`
  severity: high
  Đề xuất: known-limits

- **Kit's own pre-merge gate blocks this diff: release-2-5-0 implemented with neither clean evidence nor approval**
  Người dùng thấy gì: Ở thời điểm này bản phát hành chưa được duyệt và ký chính thức nên chưa thể đưa vào nhánh chính — bốn phép kiểm tra báo xanh không có nghĩa là đã sẵn sàng phát hành.
  file: `_acceptance/release-2-5-0/contract.md`
  severity: low
  Đề xuất: known-limits

- **Verify-by-content grep in v2.5.0 upgrade note can never match the shipped file**
  Người dùng thấy gì: Người nâng cấp làm theo bước kiểm tra được in trong ghi chú sẽ không bao giờ thấy kết quả khớp, dẫn tới kết luận sai là bản cài chưa cập nhật và lặp lại thao tác gỡ-cài không cần thiết.
  file: `.claude-plugin/plugin.json`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
