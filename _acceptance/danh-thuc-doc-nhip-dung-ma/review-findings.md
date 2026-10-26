## Trong hợp đồng

- **Hình dạng 3/5: TC1-08 kiểm «chuỗi có mặt ở đâu đó trong tệp» trong khi lời hứa là QUAN HỆ theo từng dòng --phien**
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs:393`
  severity: medium
  AC: AC-8
  detail: AC-8 hứa «mỗi lời dặn --phien nói rõ là mã app», và E8 ghi «mỗi dòng có «--phien» trong khối lệnh của phiên giám sát thì đoạn quanh nó có «mã app» và «local_»». Nhưng `thieuLoiDan` chỉ là `s.includes('mã app `local_…`') && s.includes('máy tự ghi mã CLI')` trên CẢ tệp: câu chỉ cần xuất hiện một lần là tệp qua. Câu ấy không bị ràng vào dòng --phien nào. Thực tế ban-giao.md có hai lời dặn --phien của giám sát: dòng 14 (`ban-giao --phien`) có câu, còn dòng 27 (`tiep-tuc --phien <mã phiên này>` cho giám sát mới) không có câu nào quanh nó. tiep-tuc.md có thêm dòng 55 (`chan-doan ... --phien <mã phiên này>`). Phép đo vẫn xanh. Ngoài ra «số tệp: 3» in `Object.keys(vb).length` của hằng LENH, nên con số này luôn bằng 3, không đếm số dòng --phien. Không có ma trận viết trước cho từng dòng --phien, nên số assert không bằng số phần tử.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **`vai --giam-sat <X>` gắn mã CLI của phiên GỌI vào giám sát mới X: đánh thức và chẩn đoán đọc nhịp của sai phiên**
  Người dùng thấy gì: Khi một giám sát trao vai cho giám sát mới, hệ thống có thể coi giám sát mới là còn sống nhờ nhịp của giám sát cũ. Nếu giám sát mới chết thì chủ kho không được báo.
  Căn cứ: Lỗi làm đúng lỗi «báo sai là còn sống» mà vòng này chữa, nhưng chỉ xảy ra ở đường trao vai, và tự hết khi giám sát mới chạy lệnh tiếp tục; sửa riêng một vòng nhỏ thì rẻ.
  file: `dieu-phoi/scripts/vai.mjs`
  severity: high
  Đề xuất: new-contract

- **TC1-09 đặt một bất biến lúc gộp (sha ghim cứng + sổ của hồ sơ này) vào suite thường trực: vòng sau sửa bất kỳ ca nào ở tests/dieu-phoi là CI đỏ**
  Người dùng thấy gì: Sau khi gộp, người sửa một ca kiểm thử cũ ở nhóm điều phối ở vòng sau sẽ bị CI đỏ cho tới khi ghi thêm dòng vào sổ quyết định. Việc này gây vướng cho người làm kit, người dùng cuối không thấy.
  Căn cứ: Hậu quả chỉ là báo đỏ giả và mất ít phút ghi sổ cho vòng sau, không mất dữ liệu; có thể ghi thành giới hạn đã biết rồi gỡ sau.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: high
  Đề xuất: known-limits

- **TC1-06 so trọn đầu ra `chan-doan --chi-tiet` với gói ở sha ghim: vòng sau thêm hay đổi bất kỳ mục chẩn đoán nào là đỏ**
  Người dùng thấy gì: Mỗi lần sau này thêm hay đổi một mục trong báo cáo chẩn đoán, kiểm thử này sẽ đỏ dù tính năng đánh thức vẫn đúng. Người dùng kit không bị ảnh hưởng, chỉ người sửa kit phải cập nhật phép so.
  Căn cứ: Gây báo đỏ giả cho vòng sau chứ không làm sai kết quả cho người dùng; người sửa kit tự gỡ được bằng cách thu hẹp phép so.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **`vai --giam-sat <X>` ghi mã CLI của phiên GỌI lệnh làm phien_cli của giám sát mới X**
  Người dùng thấy gì: Khi giám sát cũ giao vai cho phiên khác, nhịp của giám sát cũ bị tính cho phiên mới, nên phiên mới đã chết vẫn bị coi là đang sống và chủ kho không được báo.
  Căn cứ: Một giám sát mới chết mà không ai báo là hậu quả thật, nhưng chỉ xảy ra ở đúng lúc trao vai và tự lành khi phiên mới chạy lệnh tiếp tục; sửa nhỏ, rẻ.
  file: `dieu-phoi/scripts/vai.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5: TC1-09 tuyên «tập ca đổi thân BẰNG tập khai trong sổ» trên mọi ca, nhưng bộ tách khối chỉ thấy test( ở cột 0**
  Người dùng thấy gì: Kiểm thử bảo vệ các ca cũ chỉ nhận ra một số kiểu ca bị đổi nội dung. Nếu ai đó sửa một ca kiểu khác, hệ thống có thể không báo.
  Căn cứ: Điểm mù chỉ làm lọt thay đổi thầm lặng ở các ca kiểm thử, không ảnh hưởng người dùng cuối, và còn lưới review ở vòng sau.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: ma trận ba hàng của TC1-02 chỉ chạy qua đường `mo` (ghiVai), không qua `tiep-tuc`, dù AC-2 đặt `tiep-tuc` làm hành động chính**
  Người dùng thấy gì: Các trường hợp biến môi trường sai hoặc vắng chỉ được thử khi mở đợt, chưa thử khi giám sát chạy lệnh tiếp tục. Nếu đường tiếp tục có lỗi riêng thì chưa có kiểm thử bắt được.
  Căn cứ: Mức nhẹ, chỉ là khoảng trống kiểm thử; nếu lỗi có thật thì hậu quả là mã phiên ghi nhầm, người dùng chạy lại lệnh là sửa được.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
