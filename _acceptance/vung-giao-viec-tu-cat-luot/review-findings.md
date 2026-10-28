# Review findings — vung-giao-viec-tu-cat-luot (round 2)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 (và 3): quan hệ «cờ vùng bật khi LỘ TRÌNH đã có hàng khai vung» chỉ có hai điểm-case ở hai đầu mút, toàn bộ hàng đều trong đợt; mutant thu điều kiện về trongDot sống qua mọi ca**
  Người dùng thấy gì: Khi một kho đã khai vùng ở đợt cũ mà đợt mới cắt quên khai, hệ thống có thể mất im lặng lời nhắc «chưa khai vùng». Bộ kiểm hiện chưa bắt được trường hợp này, nên nếu sau này ai đó vô tình thu hẹp cổng thì không có gì báo đỏ. Hôm nay cách làm thật vẫn chạy đúng.
  Căn cứ: Hậu quả nhẹ: chỉ là lời nhắc bị thiếu, không mất dữ liệu, chặn việc hay làm chấm sai. Người dùng vẫn tự thấy khi lịch không xếp nối tiếp. Việc sửa chỉ là thêm một ca kiểm và có thể ghi lại như một giới hạn đã biết.
  file: `tests/scripts/cat-luot-vung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Phép so chồng chép nguyên văn từ gói dieu-phoi vào răng cắt lượt, dựa trên một tiền đề sai; bản chép thứ hai coThuMucTinh không có ca nào so với bản gốc (r1 · tệp đã đổi)**
  Người dùng thấy gì: Luật nhận biết vùng quá rộng nằm ở hai chỗ riêng. Nếu sau này một chỗ được sửa mà chỗ kia không, bước cắt lượt và bước khai vùng ở Cổng Phạm vi có thể đối xử khác nhau với cùng một vùng, và không ca kiểm nào báo.
  Căn cứ: Hiện hai chỗ đang khớp nhau nên người dùng chưa gặp gì; chỉ là rủi ro lệch dần khi có người sửa, và khi lệch thì chỉ gây báo sai hoặc không báo vùng rộng, không mất dữ liệu.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bộ đọc lộ trình của gói đợt nhận vung quá rộng («**», «*.tsx») mà không cờ nào, trong khi lệnh hang vung từ chối đúng các glob đó (r1)**
  Người dùng thấy gì: Nếu tệp lộ trình có một hàng khai vùng quá rộng như toàn bộ kho, lịch sẽ coi hàng đó chồng với mọi hàng khác và xếp cả đợt chạy nối tiếp từng hàng, mà không có cảnh báo nào cho người dùng biết vì sao đợt chậm.
  Căn cứ: Chỉ làm đợt chạy chậm hơn chứ không làm hỏng hay mất việc, và người dùng gỡ được bằng cách sửa vùng trong lộ trình; sửa sau không đắt nhưng cần một quyết định về cách báo.
  file: `dieu-phoi/scripts/nguon-hang.mjs`
  severity: medium
  Đề xuất: known-limits

- **README liệt kê các bên viết hang-viec.json dưới khoá chưa thêm lệnh hang vung (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn còn thiếu một lệnh trong danh sách các lệnh được bảo vệ khi ghi chung, nên người đọc có thể không biết lệnh khai vùng cũng được bảo vệ như các lệnh khác. Phần chạy thật không bị ảnh hưởng.
  Căn cứ: Chỉ là một dòng tài liệu cũ, không ảnh hưởng người dùng khi chạy, sửa lúc nào cũng rẻ.
  file: `dieu-phoi/README.md`
  severity: low
  Đề xuất: known-limits

- **Sự kiện trung-tep ở Cổng Phạm vi mất dấu thời gian: khoá `luc: 'cong-pham-vi'` ghi đè giờ ghi sự kiện (r1)**
  Người dùng thấy gì: Các sự kiện trùng tệp sinh ra ở Cổng Phạm vi không có giờ thật, nên bảng đếm theo ngày hoặc sắp xếp theo giờ sẽ đọc sai hoặc bỏ qua chúng mà không báo.
  Căn cứ: Không mất dữ liệu quyết định và chỉ ảnh hưởng số đếm theo ngày của loại sự kiện hiếm này, nhưng phải đổi cả hợp đồng lẫn ca kiểm nên cần một vòng riêng.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: new-contract

- **`hang them <mã lộ trình>` lấy vùng của hàng lộ trình nhưng không lấy slug và mã: hàng mới mang slug đoán từ mã và không có `ma` (r1)**
  Người dùng thấy gì: Khi thêm việc giữa đợt bằng mã của lộ trình, hàng mới có thể mang tên hồ sơ khác với hồ sơ thật của hàng đó, nên tiến độ của hàng có thể không nối được về lộ trình và người xem thấy hai hàng rời nhau.
  Căn cứ: Gây nhầm lẫn khi theo dõi tiến độ nhưng không mất việc, người dùng khai tay đúng tên hồ sơ để tránh được; sửa cần chạm hợp đồng nên nên làm thành vòng riêng.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: new-contract

- **Vùng lấy từ lộ trình không qua phép kiểm «có thư mục tĩnh», nên vùng quá rộng (`**`, `*.tsx`) lọt vào ranh_gioi và xếp hàng chồng với mọi hàng mà không báo gì (r1)**
  Người dùng thấy gì: Một hàng lộ trình khai vùng quá rộng sẽ làm lịch xếp mọi hàng chạy nối tiếp mà không báo, khiến đợt chậm đi không rõ lý do.
  Căn cứ: Chỉ làm chậm chứ không mất dữ liệu, người dùng tự sửa được vùng trong lộ trình, và đây là cùng một giới hạn đã nêu ở lỗi trước.
  file: `dieu-phoi/scripts/nguon-hang.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» thay cho quan hệ: VG-8 đếm cảnh báo «nêu y» bằng /\by\b/, mà regex này khớp cả chữ «chạy» trong đuôi cố định của mọi cảnh báo (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm cảnh báo ở Cổng Phạm vi chỉ biết có cảnh báo, chưa chắc nó nêu đúng hàng đang chồng vùng, nên nếu sau này cảnh báo nêu nhầm hàng thì kiểm tra vẫn xanh.
  Căn cứ: Hiện hành vi thật đúng nên người dùng chưa chịu hậu quả; rủi ro chỉ là một lỗi tương lai lọt qua kiểm tra, và siết lại ca kiểm rẻ.
  file: `tests/dieu-phoi/vung-giao-viec.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» thay cho quan hệ: CV-2 kiểm «lỗi R10 nêu glob **» bằng includes('**'), mà glob hợp lệ app/x/** của cùng hàng cũng thoả (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm chưa phân biệt được thông báo lỗi chỉ đúng phần vùng quá rộng với việc nêu cả phần vùng hợp lệ, nên nếu thông báo sau này chỉ nhầm vùng thì người dùng có thể bị chỉ sai chỗ sửa mà kiểm tra vẫn xanh.
  Căn cứ: Hiện thông báo đúng; rủi ro chỉ là chỉ sai chỗ sửa trong tương lai, không mất dữ liệu và người dùng đọc lại là thấy.
  file: `tests/scripts/cat-luot-vung.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay theo khuôn của bên đọc: VG-8 tự ghi trang-thai.json thay vì để motNhip (bên viết) sinh ra (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu cách ghi tiến độ hàng đang làm đổi dạng sau này, lệnh khai vùng có thể ngừng báo được hàng đang làm chồng vùng mà phép kiểm vẫn xanh, nên người dùng mất cảnh báo mà không ai biết.
  Căn cứ: Hiện chưa xảy ra và khi xảy ra chỉ mất một cảnh báo không chặn; nhưng khó phát hiện nếu không có ca kiểm đi vòng đầy đủ, nên nên ghi lại để theo dõi.
  file: `tests/dieu-phoi/vung-giao-viec.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «cùng luật» nhưng chỉ có điểm-case: coThuMucTinh có hai bản (răng và gói dieu-phoi) mà không ca nào so hai bản trên cùng một ma trận (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai chỗ cùng kiểm vùng có quá rộng không chưa được đối chiếu với nhau, nên một chỗ có thể sau này nhận vùng mà chỗ kia từ chối, làm người dùng thấy lúc cắt lượt báo lỗi nhưng lúc khai vùng ở Cổng Phạm vi lại cho qua.
  Căn cứ: Hiện hai chỗ đang khớp, nếu lệch thì chỉ gây không nhất quán chứ không mất dữ liệu, và gộp chung với lỗi chép bản luật ở trên.
  file: `tests/scripts/cat-luot-vung.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
