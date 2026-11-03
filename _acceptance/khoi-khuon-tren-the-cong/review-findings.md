## Trong hợp đồng

- **Chiều đỏ KK-4-do2 là xanh rỗng: mutant ném ReferenceError, không mô phỏng «chỉ kiểm tệp nạp tồn tại»**
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs:293`
  severity: medium
  AC: AC-4
  source: bugs
  detail: KK-4-do2 tiêm `if (!chon) {` thành `if (!napCo) {`. Tên `napCo` không được định nghĩa ở đâu (grep scripts/lib ra rỗng), nên theCong1 ném `ReferenceError: napCo is not defined` cho mọi hồ sơ, và gate-card biến nó thành cờ «không dựng được khối Khuôn». Tôi chạy thử bản sao bị tiêm trên hồ sơ surfaces [ui] và nhận `khuon_g1 = {"dong":[],"co":["không dựng được khối Khuôn: napCo is not defined"]}`. Như vậy mọi hàng của ma trận đều đỏ vì hạ tầng sập (a, b, c, g, h, h2, i mất cờ; d, e, f có cờ thừa), và ca chỉ ghim chuỗi «nạp không chọn mà không cờ» có mặt trong danh sách lỗi. AC-4 đòi chiều đỏ là «bản sao chỉ kiểm tệp nạp tồn tại → hàng (g) đỏ». Mutant hiện tại không tách được (g) bắt đúng lớp lỗi với một bản bộ đọc sập bất kỳ, nên nó vi phạm bất biến «assertion âm tính một mình» của kho. Cần một mutant chạy được về ngữ nghĩa, ví dụ coi «có khuon-nap.json» là đã chọn, và ghim rằng chỉ hàng (g) đỏ.
  rationale: AC-4 đòi chiều đỏ là bản sao chỉ kiểm tệp nạp tồn tại làm hàng (g) đỏ; mutant hiện tại làm cả bộ đọc sập nên không chứng minh đúng chiều đỏ đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **theCong1 tự viết lại cách đọc «có mặt người nhìn» thay vì gọi lib/lop-nhin-thay.cjs, trái luật một nguồn đã khai**
  Người dùng thấy gì: Hồ sơ khai loại giao diện bằng chữ viết hoa (ví dụ UI) sẽ không được nhắc «chưa ghi đã chọn nhóm khuôn nào» trên thẻ duyệt, trong khi các phần khác của cùng thẻ vẫn coi đó là hồ sơ giao diện.
  Căn cứ: Hậu quả nhẹ: chỉ mất một lời nhắc ở thẻ, không mất dữ liệu, người ký vẫn thấy các khối khác; sửa sau rẻ và hiếm gặp vì hồ sơ thường khai chữ thường.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Cờ vàng của khối Khuôn ở Cổng 1 nằm trong nhóm «thông tin, không cần trả lời», không vào danh sách «Cần chú ý trước khi duyệt»**
  Người dùng thấy gì: Cờ cảnh báo của khối Khuôn nằm dưới nhãn «thông tin, không cần trả lời», nên người ký có thể lướt qua dù cờ đang đòi họ đọc lại màn mẫu hoặc trả lời một câu hỏi.
  Căn cứ: Cờ vẫn hiện trên thẻ nên không mất thông tin, chỉ dễ bị bỏ sót; người ký tự phát hiện được khi đọc thẻ, và đổi chỗ đặt sau này rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Các hàng «im» d/e/f của KK-4 xanh cả khi thẻ không dựng được: k1 trả mặc định rỗng làm ca chỉ còn một chiều âm**
  Người dùng thấy gì: Nếu thẻ duyệt hỏng hẳn, ba trường hợp «không được cảnh báo» vẫn báo xanh, nên bộ kiểm tra có thể cho người ký tin sai rằng khối Khuôn im lặng đúng chỗ.
  Căn cứ: Rủi ro chỉ ở bộ kiểm tra, không chạm người dùng cuối; thẻ hỏng sẽ lộ ngay ở các hàng khác, và vá thêm kiểm chứng dương rất rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca từ chối bằng exit 2 không ghim thông điệp (KK-1 r5, KK-2 r3)**
  Người dùng thấy gì: Hai ca từ chối lệnh sai có thể xanh vì một lý do khác với lý do đáng ra, nên bộ kiểm tra không chứng minh lệnh bị từ chối đúng nguyên nhân.
  Căn cứ: Người dùng vẫn bị từ chối lệnh sai như mong đợi; chỉ độ chặt của kiểm tra yếu hơn, sửa sau rẻ và không gây mất dữ liệu.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Bộ đọc Thẻ việc (docTheViec) không có ca round-trip với khuôn bên viết UX-SPEC-TEMPLATE; fixture viết tay đúng khuôn bên đọc**
  Người dùng thấy gì: Nếu sau này ai đổi tên một trường trong khuôn Thẻ việc mà không sửa chỗ đọc, mọi hồ sơ sinh từ khuôn thật sẽ hiện «Thẻ việc: chưa điền» trong khi kiểm tra vẫn xanh.
  Căn cứ: Lỗi chỉ xảy ra khi khuôn bị đổi, hiện chưa xảy ra; hậu quả là thẻ hiển thị sai chứ không mất dữ liệu, nhưng đã đo được lớp lỗi này tái diễn ở kho nên đáng một việc riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **theCong1 tự chép từ vựng mặt người nhìn (MAT_NGUOI) và so phân biệt hoa thường, lệch với lib/lop-nhin-thay.cjs**
  Người dùng thấy gì: Hồ sơ khai giao diện bằng chữ viết hoa như UI hoặc Web sẽ không nhận lời nhắc chưa ghi nhóm khuôn trên thẻ duyệt, dù các phần khác của thẻ vẫn coi là giao diện.
  Căn cứ: Hậu quả nhẹ và hiếm: mất một lời nhắc, không mất dữ liệu, người ký vẫn có các khối khác; sửa sau rẻ.
  file: `scripts/ban-do-khuon.cjs`
  severity: low
  Đề xuất: known-limits

- **Nhóm đã chọn biến khỏi bản đồ chỉ thành dòng thông tin, không có cờ**
  Người dùng thấy gì: Nếu nhóm đã chọn bị xoá khỏi bản đồ khuôn, thẻ duyệt chỉ ghi một dòng thông tin, không cảnh báo, nên người ký không biết lựa chọn của bước trước đã mồ côi.
  Căn cứ: Tình huống hiếm (phải xoá hoặc làm hỏng bản đồ sau khi chọn) và hậu quả là bước chấm không theo nhóm đã chọn; người ký vẫn thấy dòng thông tin nên không mất dữ liệu.
  file: `scripts/ban-do-khuon.cjs`
  severity: low
  Đề xuất: known-limits

- **Giá trị rỗng của --nhom / --nhom-moi lọt qua kiểm tra, lệnh thoát 0 mà không ghi lựa chọn**
  Người dùng thấy gì: Chạy lệnh chọn nhóm với giá trị rỗng sẽ báo thành công mà không ghi lựa chọn nào, và chỉ lộ muộn ở thẻ duyệt bằng cờ chưa ghi đã chọn.
  Căn cứ: Chỉ xảy ra khi ô trong hướng dẫn bị điền rỗng; lỗi tự lộ ở thẻ duyệt và người chạy lại lệnh là xong, không mất dữ liệu.
  file: `scripts/design-floor-khuon.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay cho quan hệ): vế «GUIDE §5.2 nêu --nhom» của KK-8 luôn đúng sẵn**
  Người dùng thấy gì: Nếu ai xoá câu hướng dẫn cờ chọn nhóm khỏi sách hướng dẫn, bộ kiểm tra vẫn xanh, nên tài liệu có thể mất chỉ dẫn mà không ai biết.
  Căn cứ: Chỉ ảnh hưởng độ tin của kiểm tra tài liệu, không gây lỗi khi chạy; người dùng tự đọc thấy thiếu và sửa tài liệu rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert khuôn chuỗi thay cho quan hệ bằng-nhau với bản KH1): dòng số đo Cổng 2 «không đổi chữ» chỉ được so bằng regex**
  Người dùng thấy gì: Nếu một thay đổi sau này làm đổi cách đếm số tệp theo khuôn hay nợ cũ trên thẻ Cổng 2, bộ kiểm tra vẫn xanh và người ký có thể thấy số liệu khác trước mà không hay biết.
  Căn cứ: Hiện chưa có bằng chứng số đã đổi; rủi ro là số trên thẻ lệch âm thầm ở lần sửa sau, người ký đọc sai được nhưng không mất dữ liệu, và thêm phép so sánh rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
