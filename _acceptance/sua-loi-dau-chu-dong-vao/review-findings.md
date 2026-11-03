# Review findings: sua-loi-dau-chu-dong-vao

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Usage string của CLI vẫn ghi `nha <tài nguyên>` sau khi `nha` nhận cả tên loại**
  Người dùng thấy gì: Khi thợ gõ sai lệnh và đọc dòng hướng dẫn, dòng này vẫn mô tả cách gọi cũ nên có thể lệch với mẫu trong luật của đợt. Lệnh vẫn chạy đúng, chỉ có chữ hướng dẫn chưa khớp.
  Căn cứ: Hậu quả nhẹ: chỉ gây bối rối khi đọc hướng dẫn, không mất dữ liệu, thợ gõ lại theo mẫu trong luật là chạy được, và sửa sau rất rẻ.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: low
  Đề xuất: known-limits

- **Lệnh chờ do máy sinh không bọc nháy đường khoá — thư mục đợt có dấu cách thì chờ mãi mà không báo lỗi**
  Người dùng thấy gì: Nếu kho nằm dưới một thư mục có dấu cách trong tên, thợ chạy lệnh chờ do máy đưa sẽ đứng chờ mãi mà không có thông báo lỗi nào, kể cả khi khoá đã được cấp. Người dùng chỉ thấy thợ im lặng không làm gì.
  Căn cứ: Chỉ xảy ra với kho đặt ở đường dẫn có dấu cách nên ít gặp, nhưng khi gặp thì thợ treo vô hạn không báo lỗi, người dùng khó đoán nguyên nhân; không mất dữ liệu và có lối thoát là tự nhả khoá hoặc dời kho, nên ghi lại giới hạn rồi sửa ở vòng sau.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3/2 — SD-3 tuyên round-trip lệnh chờ nhưng chỉ rút ĐƯỜNG khoá, không kiểm vị từ `.phien=="<dãy>"` của lệnh in ra**
  Người dùng thấy gì: Bài kiểm chưa chứng minh được rằng lệnh chờ gắn đúng tên dãy của thợ. Nếu về sau lệnh này in sai tên dãy, bài kiểm vẫn xanh trong khi thợ chờ mãi không được cấp khoá.
  Căn cứ: Hiện lệnh chạy đúng nên người dùng chưa gặp gì; rủi ro chỉ nằm ở lần sửa sau có thể làm hỏng lệnh chờ mà không ai biết ngay, sửa bổ sung bài kiểm sau này rẻ và không gấp.
  file: `tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
