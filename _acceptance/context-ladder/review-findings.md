## Trong hợp đồng

Findings: []

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Unescaped dp.context/he.guide injected into Gate 1 card HTML (XSS at human gate)**
  Người dùng thấy gì: Nội dung ghi trong sổ phiên hoặc file cấu hình có thể chứa mã HTML/script và bị hiển thị y nguyên trên thẻ quyết định mà người duyệt mở ở Cổng 1, tạo rủi ro trang hiển thị sai lệch hoặc chạy mã lạ ngay trong trình duyệt của người duyệt.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **P136 placeholder-count assertion pins strings that can never match the regression it names**
  Người dùng thấy gì: Nếu sau này cách đếm số cảnh ngữ-cảnh trên thẻ bị hỏng theo một kiểu cụ thể, hệ thống kiểm tra tự động có thể không bắt được lỗi đó và vẫn báo xanh, khiến người duyệt có thể tin thẻ đúng trong khi số cảnh hiển thị sai.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).