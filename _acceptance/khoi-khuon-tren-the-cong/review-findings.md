# Review findings: khoi-khuon-tren-the-cong (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **theCong1 tự viết lại vị từ «mặt người nhìn» thay vì gọi lib/lop-nhin-thay.cjs (luật một nguồn), và kết quả đã lệch**
  Người dùng thấy gì: Nếu hồ sơ ghi loại giao diện bằng chữ hoa (ví dụ UI hoặc Web), thẻ Cổng Phạm vi vẫn coi đó là giao diện nhưng thẻ Cổng 1 không nhắc rằng bước đọc thiết kế chưa chọn nhóm khuôn nào.
  Căn cứ: Hậu quả nhẹ: chỉ mất một lời nhắc trên thẻ ở ca ghi chữ hoa hiếm gặp, không mất dữ liệu, và người ký vẫn thấy hồ sơ là giao diện ở các thẻ khác.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Băm màn mẫu có hai bản sao ở bên ghi và bên đọc của khuon-nap.json, trái với chính nguyên tắc vòng này dùng cho dongLech**
  Người dùng thấy gì: Nếu sau này một nơi đổi cách băm màn mẫu mà nơi kia không đổi theo, thẻ sẽ báo sai rằng màn mẫu đã bị sửa, hoặc không báo khi nó thật sự bị sửa.
  Căn cứ: Hiện chưa gây hại vì hai bản đang khớp; chỉ thành vấn đề khi có người sửa một phía, và khi đó lỗi lộ ra ngay trên thẻ nên dễ phát hiện và sửa rẻ.
  file: `scripts/design-floor-khuon.mjs`
  severity: low
  Đề xuất: known-limits

- **Đường design_doc trong frontmatter được đọc thẳng, không chuẩn hoá như bộ đọc sẵn có**
  Người dùng thấy gì: Một hồ sơ cố tình trỏ tài liệu thiết kế ra ngoài thư mục kho sẽ khiến thẻ đọc một tệp ngoài kho để lấy mục Thẻ việc.
  Căn cứ: Giá trị này do chính chủ kho viết trong hồ sơ của họ nên không có kẻ ngoài nào lợi dụng được; hậu quả chỉ là thẻ hiện nội dung lạ, người dùng tự sửa hồ sơ là xong.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: wont-fix

- **Cờ «vật chạm nhóm khác» (co2) bỏ sót tệp mang nợ cũ hoặc không đo được**
  Người dùng thấy gì: Khi vòng chọn một nhóm khuôn nhưng thực ra sửa màn của nhóm khác, thẻ Cổng Bằng chứng có thể không cảnh báo nếu màn ấy đã có lệch từ trước hoặc dùng cách nạp động.
  Căn cứ: Người ký có thể bỏ sót việc vòng làm lệch nhóm khuôn đã chọn, nhưng đây là cảnh báo bổ trợ chứ không chặn việc gì, và lệch vẫn hiện ở các dòng số đo khác trên thẻ.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ (tên trường ↔ giá trị Thẻ việc)**
  Người dùng thấy gì: Nếu sau này bộ đọc Thẻ việc ghép nhầm giá trị sang sai nhãn (ví dụ gán việc chính vào ô ai dùng), bộ kiểm thử hiện tại vẫn báo xanh nên lỗi có thể lọt tới người ký.
  Căn cứ: Chưa có lỗi thật nào xảy ra; rủi ro chỉ là một thay đổi sau này hiển thị sai nhãn trên thẻ mà người đọc tinh ý vẫn nhận ra được.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: không có round-trip bước chấm (writer) → thẻ Cổng 2 (reader) cho lời hứa «dongLech một nguồn»**
  Người dùng thấy gì: Nếu dòng lệch in ở bước chấm và dòng lệch trên thẻ Cổng 2 sau này khác chữ nhau, bộ kiểm thử vẫn xanh nên người ký có thể thấy hai cách diễn đạt khác nhau cho cùng một lệch.
  Căn cứ: Hậu quả chỉ là chữ hiển thị lệch nhau giữa hai nơi, không mất dữ liệu và không đổi phán quyết; sửa sau rẻ khi phát hiện.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: tuyên «A{không khai}×mọi B×mọi C» nhưng KK-6 chỉ có điểm-case B{không nạp}**
  Người dùng thấy gì: Ca kho không khai bản đồ mới được thử với hồ sơ chưa nạp khuôn; hồ sơ đã nạp sẵn rồi kho gỡ bản đồ chưa được thử, nên chưa biết thẻ có đổi hay không ở trường hợp hiếm đó.
  Căn cứ: Trường hợp kho đã nạp rồi gỡ bản đồ rất hiếm và nếu có thì chỉ thấy thêm một khối trên thẻ, không hại dữ liệu.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: assertion âm-tính-một-mình chỉ dựa mã thoát 2, không ghim thông điệp**
  Người dùng thấy gì: Hai ca từ chối tên nhóm sai chưa chứng minh lệnh bị từ chối đúng lý do, nên một lỗi khác cũng thoát cùng mã vẫn khiến ca báo xanh.
  Căn cứ: Chỉ làm yếu bộ kiểm thử, người dùng cuối không bị ảnh hưởng, và ghim thêm thông điệp sau này là việc nhỏ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4) — cờ chiMot chỉ vá hai ca KK-4, các ca «-do» còn lại vẫn coi «bộ đọc sập» là «bắt đúng lỗi» (r2)**
  Người dùng thấy gì: Khối «Khuôn» trên thẻ hai cổng vẫn hiện đúng cho người dùng. Chỉ có một số phép thử nội bộ ở chiều đỏ có thể báo xanh dù lỗi được tiêm làm hỏng cả bộ đọc, nên một lỗi thật sau này có thể lọt qua mà không ai thấy.
  Căn cứ: Không ảnh hưởng người dùng hôm nay và không mất dữ liệu; chỉ làm một số phép thử kém chặt, sửa sau vẫn rẻ nên ghi giới hạn kèm ngưỡng đếm và ship như hiện tại.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **theCong1 tự viết lại cách đọc «có mặt người nhìn» thay vì gọi lib/lop-nhin-thay.cjs, trái luật một nguồn đã khai (r1)**
  Người dùng thấy gì: Hồ sơ khai loại giao diện bằng chữ viết hoa (ví dụ UI) sẽ không được nhắc «chưa ghi đã chọn nhóm khuôn nào» trên thẻ duyệt, trong khi các phần khác của cùng thẻ vẫn coi đó là hồ sơ giao diện.
  Căn cứ: Hậu quả nhẹ: chỉ mất một lời nhắc ở thẻ, không mất dữ liệu, người ký vẫn thấy các khối khác; sửa sau rẻ và hiếm gặp vì hồ sơ thường khai chữ thường.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Cờ vàng của khối Khuôn ở Cổng 1 nằm trong nhóm «thông tin, không cần trả lời», không vào danh sách «Cần chú ý trước khi duyệt» (r1)**
  Người dùng thấy gì: Cờ cảnh báo của khối Khuôn nằm dưới nhãn «thông tin, không cần trả lời», nên người ký có thể lướt qua dù cờ đang đòi họ đọc lại màn mẫu hoặc trả lời một câu hỏi.
  Căn cứ: Cờ vẫn hiện trên thẻ nên không mất thông tin, chỉ dễ bị bỏ sót; người ký tự phát hiện được khi đọc thẻ, và đổi chỗ đặt sau này rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Các hàng «im» d/e/f của KK-4 xanh cả khi thẻ không dựng được: k1 trả mặc định rỗng làm ca chỉ còn một chiều âm (r1)**
  Người dùng thấy gì: Nếu thẻ duyệt hỏng hẳn, ba trường hợp «không được cảnh báo» vẫn báo xanh, nên bộ kiểm tra có thể cho người ký tin sai rằng khối Khuôn im lặng đúng chỗ.
  Căn cứ: Rủi ro chỉ ở bộ kiểm tra, không chạm người dùng cuối; thẻ hỏng sẽ lộ ngay ở các hàng khác, và vá thêm kiểm chứng dương rất rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca từ chối bằng exit 2 không ghim thông điệp (KK-1 r5, KK-2 r3) (r1)**
  Người dùng thấy gì: Hai ca từ chối lệnh sai có thể xanh vì một lý do khác với lý do đáng ra, nên bộ kiểm tra không chứng minh lệnh bị từ chối đúng nguyên nhân.
  Căn cứ: Người dùng vẫn bị từ chối lệnh sai như mong đợi; chỉ độ chặt của kiểm tra yếu hơn, sửa sau rẻ và không gây mất dữ liệu.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Bộ đọc Thẻ việc (docTheViec) không có ca round-trip với khuôn bên viết UX-SPEC-TEMPLATE; fixture viết tay đúng khuôn bên đọc (r1)**
  Người dùng thấy gì: Nếu sau này ai đổi tên một trường trong khuôn Thẻ việc mà không sửa chỗ đọc, mọi hồ sơ sinh từ khuôn thật sẽ hiện «Thẻ việc: chưa điền» trong khi kiểm tra vẫn xanh.
  Căn cứ: Lỗi chỉ xảy ra khi khuôn bị đổi, hiện chưa xảy ra; hậu quả là thẻ hiển thị sai chứ không mất dữ liệu, nhưng đã đo được lớp lỗi này tái diễn ở kho nên đáng một việc riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **theCong1 tự chép từ vựng mặt người nhìn (MAT_NGUOI) và so phân biệt hoa thường, lệch với lib/lop-nhin-thay.cjs (r1)**
  Người dùng thấy gì: Hồ sơ khai giao diện bằng chữ viết hoa như UI hoặc Web sẽ không nhận lời nhắc chưa ghi nhóm khuôn trên thẻ duyệt, dù các phần khác của thẻ vẫn coi là giao diện.
  Căn cứ: Hậu quả nhẹ và hiếm: mất một lời nhắc, không mất dữ liệu, người ký vẫn có các khối khác; sửa sau rẻ.
  file: `scripts/ban-do-khuon.cjs`
  severity: low
  Đề xuất: known-limits

- **Nhóm đã chọn biến khỏi bản đồ chỉ thành dòng thông tin, không có cờ (r1)**
  Người dùng thấy gì: Nếu nhóm đã chọn bị xoá khỏi bản đồ khuôn, thẻ duyệt chỉ ghi một dòng thông tin, không cảnh báo, nên người ký không biết lựa chọn của bước trước đã mồ côi.
  Căn cứ: Tình huống hiếm (phải xoá hoặc làm hỏng bản đồ sau khi chọn) và hậu quả là bước chấm không theo nhóm đã chọn; người ký vẫn thấy dòng thông tin nên không mất dữ liệu.
  file: `scripts/ban-do-khuon.cjs`
  severity: low
  Đề xuất: known-limits

- **Giá trị rỗng của --nhom / --nhom-moi lọt qua kiểm tra, lệnh thoát 0 mà không ghi lựa chọn (r1)**
  Người dùng thấy gì: Chạy lệnh chọn nhóm với giá trị rỗng sẽ báo thành công mà không ghi lựa chọn nào, và chỉ lộ muộn ở thẻ duyệt bằng cờ chưa ghi đã chọn.
  Căn cứ: Chỉ xảy ra khi ô trong hướng dẫn bị điền rỗng; lỗi tự lộ ở thẻ duyệt và người chạy lại lệnh là xong, không mất dữ liệu.
  file: `scripts/design-floor-khuon.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay cho quan hệ): vế «GUIDE §5.2 nêu --nhom» của KK-8 luôn đúng sẵn (r1)**
  Người dùng thấy gì: Nếu ai xoá câu hướng dẫn cờ chọn nhóm khỏi sách hướng dẫn, bộ kiểm tra vẫn xanh, nên tài liệu có thể mất chỉ dẫn mà không ai biết.
  Căn cứ: Chỉ ảnh hưởng độ tin của kiểm tra tài liệu, không gây lỗi khi chạy; người dùng tự đọc thấy thiếu và sửa tài liệu rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert khuôn chuỗi thay cho quan hệ bằng-nhau với bản KH1): dòng số đo Cổng 2 «không đổi chữ» chỉ được so bằng regex (r1)**
  Người dùng thấy gì: Nếu một thay đổi sau này làm đổi cách đếm số tệp theo khuôn hay nợ cũ trên thẻ Cổng 2, bộ kiểm tra vẫn xanh và người ký có thể thấy số liệu khác trước mà không hay biết.
  Căn cứ: Hiện chưa có bằng chứng số đã đổi; rủi ro là số trên thẻ lệch âm thầm ở lần sửa sau, người ký đọc sai được nhưng không mất dữ liệu, và thêm phép so sánh rẻ.
  file: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
