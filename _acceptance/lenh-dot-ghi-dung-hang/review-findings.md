# Review findings: lenh-dot-ghi-dung-hang (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **`hang them <mã lộ trình>` now writes `ma` on the new row, so the scheduler holds it at «chờ Cổng Đáng» and the lane gets no work**
  Người dùng thấy gì: Khi giám sát thêm một hàng bằng mã lộ trình giữa chừng đợt, dãy đó có thể dừng chờ người duyệt thay vì tự nhận việc ở nhịp kế. Như vậy thêm một lượt gọi người ngoài thiết kế và làn đó nhàn rỗi cho tới khi có người trả lời.
  Căn cứ: Hậu quả khá nặng vì làn đứng chờ và phát sinh lượt gọi người không dự tính, nhưng người dùng tự gỡ được bằng cách duyệt hàng hoặc sửa tay; sửa đòi quyết định về cách đối xử hàng mới thêm nên cần một việc riêng có hợp đồng.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: high
  Đề xuất: new-contract

- **`daGopTrenNhanhChinh` reads `risk_tier` with a raw regex instead of the package's frontmatter reader `truongFm`**
  Người dùng thấy gì: Một hồ sơ mức rủi ro cao nhất nhưng viết theo kiểu khác (ví dụ có ngoặc kép) sẽ không được tính là đã gộp, và dãy có thể kẹt ở hàng đó. Chỉ gặp khi hồ sơ viết lệch khuôn thường dùng.
  Căn cứ: Hiếm gặp vì hồ sơ thường viết đúng khuôn, và người dùng tự gỡ được bằng cách sửa lại dòng cho đúng khuôn; ghi giới hạn là đủ.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: low
  Đề xuất: known-limits

- **`ghi.mjs` reads `nhanh_chinh` from the raw config with a silent `'main'` fallback, skipping the validator the scheduler uses**
  Người dùng thấy gì: Nếu cấu hình của kho thiếu hoặc sai tên nhánh chính, lệnh xin lượt chấm âm thầm so với nhánh mặc định trong khi bộ phát lịch báo lỗi rõ. Hai bên có thể bất đồng về việc hồ sơ nào đã gộp.
  Căn cứ: Chỉ xảy ra khi cấu hình đã hỏng, và bộ phát lịch vẫn báo lỗi nên người dùng sẽ biết để sửa; hậu quả nhẹ và không mất dữ liệu.
  file: `dieu-phoi/scripts/ghi.mjs`
  severity: low
  Đề xuất: known-limits

- **hoSoChuaGop gộp mọi lỗi git thành «chưa gộp», kể cả khi nhánh chính không đọc được**
  Người dùng thấy gì: Khi máy không đọc được nhánh chính, đơn xin chấm có thể ghi nhầm cho một hồ sơ đã gộp từ lâu, hoặc bị từ chối với lý do «nhiều ứng viên» mà không nói nguyên nhân thật. Máy không in cảnh báo nào.
  Căn cứ: Chỉ xảy ra khi kho hỏng cấu hình hay mất kết nối nhánh chính; đơn ghi nhầm có thể bị phát hiện và huỷ, không mất dữ liệu, nhưng lời báo lỗi gây khó hiểu cho người dùng.
  file: `dieu-phoi/scripts/ghi.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp, chỉ có điểm-case): hàng 'nhip-khong-t1' của ma trận đọc-cũ AC-8 không bao giờ chạm nhánh bộ phát lịch đã đổi**
  Người dùng thấy gì: Phép kiểm tra rằng kho không dùng tính năng mới thì không bị đổi kết quả chưa thật sự thử ca thường gặp nhất là hồ sơ thường đã gộp. Nếu có sai lệch ở ca đó, bài kiểm này sẽ không báo.
  Căn cứ: Mã chạy thật không sai, chỉ có một phép đo kiểm chưa phủ hết; một ca khác trong bộ kiểm vẫn bắt phần lớn lớp lỗi này nên ghi giới hạn là đủ.
  file: `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): chốt 'mỗi hàng có ít nhất một tệp để so' ở TC2-08 luôn đúng, và mã thoát của lệnh bị bỏ qua**
  Người dùng thấy gì: Với một vài kiểu lệnh cũ, bài kiểm xanh cả khi cả bản cũ lẫn bản mới cùng không làm gì. Nó chưa phân biệt được «giống nhau» với «không ai chạy».
  Căn cứ: Không ảnh hưởng người dùng trực tiếp, chỉ làm bộ kiểm kém nhạy ở một hàng; sửa dễ nhưng không cấp bách nên ghi giới hạn.
  file: `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): TC2-06 kết luận 'không đổi byte nào' bằng phép băm nhưng chưa từng thấy phép băm đổi**
  Người dùng thấy gì: Bài kiểm khẳng định lệnh chạy lại trên dãy vắng không đổi gì trong thư mục đợt, nhưng phép băm dùng để khẳng định chưa từng được thấy nó đổi khi có ghi thật. Nếu phép băm hỏng, bài kiểm vẫn xanh.
  Căn cứ: Rủi ro thấp vì mã thoát và thông điệp của ca đã được ghim riêng, người dùng không bị ảnh hưởng; thêm đối chứng tốn công hơn nhiều so với hậu quả nên chấp nhận và ghi vết.
  file: `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
