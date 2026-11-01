# Review findings: run-id-danh-sach-cho-phep (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Script đo mã ngắn chép tay luật hình dạng run_id và hàm bóc chuỗi thay vì rút từ khối RUN-ID-HINH, nên vi phạm luật một nguồn mà chính vòng này dựng**
  Người dùng thấy gì: Các con số về mã ngắn trong hồ sơ đến từ một công cụ đo có bản chép riêng của luật. Nếu luật đổi sau này, công cụ vẫn in số cũ mà không báo, nên số trong hồ sơ có thể lệch thực tế.
  Căn cứ: Chỉ ảnh hưởng độ tin cậy của một con số tham khảo trong hồ sơ, không đổi kết quả chấm hay dữ liệu của người dùng, và ghi chú thêm là đủ.
  file: `_acceptance/run-id-danh-sach-cho-phep/do/do-ma-ngan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Script đo mã ngắn nuốt lỗi git và in số 0 giống hệt kết quả đo thật**
  Người dùng thấy gì: Nếu chạy công cụ đo trên một đường dẫn kho sai, nó vẫn in toàn số 0 như thể kho sạch. Người đọc có thể hiểu nhầm là không có mã ngắn nào.
  Căn cứ: Hậu quả nhẹ vì công cụ chỉ chạy tay để lấy số tham khảo, các số đã trích có mẫu số thật, và người chạy tự phát hiện được khi chạy lại.
  file: `_acceptance/run-id-danh-sach-cho-phep/do/do-ma-ngan.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 (fixture/luật viết tay đúng khuôn bên đọc, không round-trip rút từ writer): do-ma-ngan.mjs chép tay luật RUN-ID-HINH và hàm chuẩn hoá mã thay vì rút từ khối marker**
  Người dùng thấy gì: Công cụ đo mã ngắn dùng bản chép riêng của luật nên có thể trôi khỏi luật thật của bộ chấm. Các số khai trong hồ sơ chỉ đúng tại thời điểm đo.
  Căn cứ: Số liệu chỉ để tham khảo cho giới hạn đã khai, không ảnh hưởng người dùng, và khai thẳng là số đo ngày 31/10 là đủ.
  file: `_acceptance/run-id-danh-sach-cho-phep/do/do-ma-ngan.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 3/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/run-id-danh-sach-cho-phep/do/do-ma-ngan.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
