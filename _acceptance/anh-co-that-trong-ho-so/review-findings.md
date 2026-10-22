# Review findings: anh-co-that-trong-ho-so (vòng 2)

## Trong hợp đồng

Không có phát hiện nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lệnh đo kho thật (E9) thoát 0, tức khớp, khi không so được hồ sơ nào**
  Người dùng thấy gì: Khi chạy phép đo trên kho thật mà không so được hồ sơ nào, lệnh vẫn báo toàn số 0 như thể mọi thứ khớp. Người đọc có thể tưởng kho đã được kiểm và an toàn trong khi thực ra chưa đo được gì.
  Căn cứ: Chỉ ảnh hưởng người chạy tay phép đo kho (không ảnh hưởng người dùng cuối), nhìn dòng «lỗi đọc» hay «0 hồ sơ» là nhận ra, và chạy lại không mất gì; nên ghi thành giới hạn đã biết.
  file: `tests/scripts/anh-co-that-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bộ xét ảnh mới nhận tên tệp có '#', '?', '%' và đưa thẳng vào src mà không mã hoá URL: thẻ tính có ảnh nhưng trang hiện ảnh vỡ**
  Người dùng thấy gì: Nếu tên tệp ảnh trong hồ sơ có ký tự lạ như dấu thăng hay dấu hỏi, thẻ vẫn báo «có ảnh» nhưng trang bằng chứng hiện ảnh vỡ. Người ký thấy ô ảnh trống dù thẻ nói đạt.
  Căn cứ: Hiếm gặp vì tên ảnh do máy đặt theo mẫu, hậu quả nhẹ (chỉ ảnh không hiện, không mất dữ liệu) và người dùng đổi tên tệp là xong.
  file: `scripts/anh-ho-so.cjs`
  severity: low
  Đề xuất: known-limits

- **Mô tả trong evals.yaml lệch với mã: «git archive adab9a82 scripts lib» trong khi mã bung cả skills/**
  Người dùng thấy gì: Lời mô tả cách dựng bản cũ để so sánh nói thiếu một thư mục so với thực tế. Người đọc hồ sơ có thể hiểu hơi sai cách đo, nhưng kết quả đo không đổi.
  Căn cứ: Chỉ là lệch một dòng chú thích trong hồ sơ nội bộ, không làm sai kết quả nào của người dùng và sửa lại bất cứ lúc nào chỉ tốn một dòng.
  file: `_acceptance/anh-co-that-trong-ho-so/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Trang bằng chứng nói «thẻ không tính eval này là có ảnh» trong khi thẻ VẪN tính nó đạt (screenshot: hỏng + có ảnh evidence/&lt;id&gt;-*.png)**
  Người dùng thấy gì: Trong trường hợp hồ sơ khai đường ảnh sai nhưng vẫn có ảnh đặt đúng tên trong thư mục bằng chứng, thẻ báo đạt còn trang lại hiện cờ đỏ nói thẻ không tính ảnh. Người ký thấy hai nơi nói ngược nhau về cùng một ảnh.
  Căn cứ: Ảnh vẫn hiện đúng và chữ ký không bị chặn nên không mất dữ liệu, nhưng cờ đỏ sai có thể làm người ký nghi ngờ thừa; ca này hiếm và đọc kỹ là hiểu.
  file: `scripts/evidence-page.js`
  severity: medium
  Đề xuất: known-limits

- **Lệnh đo kho thoát 0 («khớp») khi không đo được gì: mọi thẻ lỗi, hoặc kho không có hồ sơ ui-check**
  Người dùng thấy gì: Khi mọi hồ sơ đều không đọc được, hoặc kho không có hồ sơ nào cần so, phép đo vẫn in «khớp» với toàn số 0. Người chạy có thể hiểu nhầm là kho sạch.
  Căn cứ: Chỉ làm người chạy tay phép đo hiểu nhầm trong chốc lát, dòng «lỗi đọc» in kèm giúp nhận ra, chạy lại không mất gì; nên ghi thành giới hạn đã biết.
  file: `tests/scripts/anh-co-that-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bộ đếm độc lập của lệnh đo kho lệch luật thật với tệp evidence/&lt;id&gt;.png: báo lệch khi không có lệch**
  Người dùng thấy gì: Với một hồ sơ hiếm có ảnh đặt tên không kèm đuôi mô tả, phép đo kho có thể báo «lệch» dù thẻ làm đúng luật. Người chạy đo sẽ thấy báo động giả và phải tự kiểm lại.
  Căn cứ: Chỉ gây báo động giả cho người chạy phép đo, không ảnh hưởng thẻ hay chữ ký của ai; dạng tên này hiếm và chi phí sửa lớn hơn hậu quả.
  file: `tests/scripts/anh-co-that-kho.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3: chỉ so tập hợp chuỗi có mặt, trong khi lời hứa là quan hệ loại giá trị → nguyên nhân; kỳ vọng từng hàng lại lấy từ chính bảng LY_DO của vật**
  Người dùng thấy gì: Nếu sau này ai đó đảo nhầm lời giải thích giữa hai loại thiếu ảnh, phép kiểm hiện tại vẫn xanh và người ký sẽ đọc nguyên nhân sai. Hôm nay lời giải thích đang đúng.
  Căn cứ: Chưa gây hại cho người dùng hôm nay vì nguyên nhân đang in đúng; rủi ro chỉ xảy ra nếu có sửa sai sau này, và nên khai thành giới hạn đo lường thay vì dựng thêm một vòng đo.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: ma trận viết trước thiếu một phần tử của chính bảng luật — dạng `\\máy\…` (UNC) của hàng «đường tuyệt đối»**
  Người dùng thấy gì: Đường dẫn kiểu ổ mạng của máy khác chưa được phép kiểm tự động bảo vệ; nếu ai làm hỏng cách nhận ra dạng này, bộ kiểm vẫn xanh. Người ký có thể thấy nguyên nhân thiếu ảnh bị ghi sai cho dạng đường này.
  Căn cứ: Dạng đường mạng này rất hiếm trong hồ sơ thật, hậu quả chỉ là ghi sai nguyên nhân (ảnh vẫn bị báo thiếu), nên chấp nhận và ghi giới hạn.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: nhát tiêm (i) và (ii) của LNT9 không ghim thông điệp mà eval E7 hứa («thực tế present true»)**
  Người dùng thấy gì: Một phép kiểm lỗi cố ý chỉ báo đúng tên hàng bị lật, chưa nói rõ thẻ đã tính ảnh sai ra sao. Người đọc báo lỗi khi phép kiểm đỏ sẽ có ít chi tiết hơn lời hứa.
  Căn cứ: Phép kiểm vẫn có đối chứng xanh và vẫn đỏ đúng chỗ nên rủi ro bỏ sót thấp, người dùng không bị ảnh hưởng; sửa chỉ để câu chữ khớp hơn nên không đáng mở việc.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
