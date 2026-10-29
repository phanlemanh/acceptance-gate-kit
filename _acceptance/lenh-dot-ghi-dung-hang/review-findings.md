# Review findings: lenh-dot-ghi-dung-hang (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **hang them theo mã/slug lộ trình giờ ghi thêm `ma`, nên hàng ấy âm thầm phải chờ Cổng Đáng; không có ca kiểm nào chạy bộ phát lịch trên hàng thêm**
  Người dùng thấy gì: Khi giám sát thêm một hàng giữa đợt bằng mã hay slug của lộ trình, hàng đó có thể không được giao việc ngay như trước mà phải đợi người duyệt ở Cổng Đáng. Nếu không ai biết điều này, đợt có thể đứng im ở hàng ấy mà không có lời giải thích.
  Căn cứ: Hậu quả vừa phải: không mất dữ liệu, người dùng gỡ được bằng cách duyệt hàng ở Cổng Đáng hoặc thêm hàng không theo mã, nhưng nó đổi hành vi cũ của mọi kho dùng lệnh thêm hàng nên nên ghi rõ thành giới hạn đã biết; sửa sau vẫn rẻ.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): hàng 'nhip-khong-t1' của ma trận đọc-cũ TC2-08 không bao giờ chạm nhánh bộ phát lịch vừa đổi**
  Người dùng thấy gì: Phép kiểm xác nhận hành vi cũ của bộ phát lịch không đổi chưa thử trường hợp hợp đồng đã nằm trên nhánh chính. Nếu hành vi cũ ở trường hợp đó bị đổi ngoài ý muốn, bộ kiểm sẽ không báo.
  Căn cứ: Hậu quả nhẹ vì trường hợp này vẫn có ca kiểm riêng với giá trị kỳ vọng viết tay, chỉ thiếu phép so cũ-mới trực tiếp; ghi thành giới hạn đã biết là đủ, thêm ca sau rẻ.
  file: `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): chốt 'ít nhất một tệp để so' ở TC2-08 luôn đúng với hàng 'them-hang-co-san' và 'nghi', và mã thoát của lệnh bị bỏ qua**
  Người dùng thấy gì: Phép so sánh cũ-mới cho hai loại lệnh có thể báo xanh dù cả hai bản đều không chạy được, nên màu xanh ở đó chưa chắc chứng minh hai bản giống nhau thật.
  Căn cứ: Hậu quả nhẹ và không chạm người dùng cuối: chỉ làm bộ kiểm kém nhạy trong một tình huống hiếm là cả hai bản cùng hỏng, người bảo trì tự phát hiện ở các ca khác; ghi lại là đủ.
  file: `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): TC2-06 kết luận 'không đổi byte nào' bằng bamThuMuc mà chưa từng cho thấy phép băm đổi khi có ghi thật**
  Người dùng thấy gì: Phép kiểm khẳng định lệnh sai không làm thay đổi thư mục đợt chưa chứng minh được rằng nó sẽ báo động khi thư mục đợt bị ghi thật. Nếu phép đo ấy hỏng âm thầm thì lỗi ghi nhầm có thể lọt qua.
  Căn cứ: Hậu quả nhẹ vì chỉ là bộ kiểm có thể mù trong một tình huống hiếm, không mất dữ liệu của người dùng; thêm đối chứng sau rất rẻ nên ghi thành giới hạn đã biết.
  file: `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
