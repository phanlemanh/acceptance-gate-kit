## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Ghost-row fix applied only to claim-scan — gate-card/evidence-page section() still ingests tables under sub-headings inside ## Findings**
  Người dùng thấy gì: Thẻ quyết định Gate 1 và trang bằng chứng vẫn có thể hiển thị một dòng phát hiện không có thật khi ghi chú nằm lồng dưới một tiêu đề phụ trong mục Findings, dù chỉ số claim đã được sửa đúng — người xem thẻ có thể thấy một cảnh báo giả không khớp với dữ liệu thật.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **PH8 mutation-control assertion is vacuous — it can never fail**
  Người dùng thấy gì: Một phép kiểm chống hồi quy trong bộ test hiện không thực sự có khả năng phát hiện lỗi — nếu về sau có người vô tình làm hỏng logic chính mà nó đang bảo vệ, bộ test có thể vẫn báo xanh thay vì cảnh báo đỏ.
  file: `tests/workflows/claim-scan.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).