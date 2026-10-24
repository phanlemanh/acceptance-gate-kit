# Review findings: thiet-ke-nap-tri-thuc (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khai `paths` thiếu tệp mà eval thật sự chạy, nên lượt sửa sau có thể bê kết quả xanh cũ sang dù vật đã đổi**
  Người dùng thấy gì: Ở các lượt chấm lại sau này, một số kiểm tra có thể không được chạy lại dù tệp liên quan đã đổi, nên kết quả xanh cũ có thể bị mang sang. Người dùng cuối không thấy ngay, nhưng độ tin của lượt chấm sau bị giảm.
  Căn cứ: Chỉ ảnh hưởng độ tin của các lượt chấm lại, không làm mất hay lộ dữ liệu; lượt chấm đầy đủ vẫn bắt được, và sửa sau rẻ vì chỉ là khai báo.
  file: `_acceptance/thiet-ke-nap-tri-thuc/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Lệnh approve chưa đọc khoá chặn mới `tri_thuc.chan`, khác tiền lệ cỡ hợp đồng ngay cạnh**
  Người dùng thấy gì: Thẻ báo chưa vào được Cổng Phạm vi, nhưng người gõ thẳng lệnh duyệt vẫn ký được hồ sơ còn thiếu dòng tra tri thức. Việc chặn chỉ dựa vào thẻ, không có khoá ở lệnh ghi chữ ký.
  Căn cứ: Người ký phải cố ý gõ lệnh bỏ qua thẻ mới gặp, hậu quả nhẹ và đảo được; các điều kiện chặn khác hôm nay cũng hoạt động như vậy.
  file: `commands/approve.md`
  severity: low
  Đề xuất: known-limits

- **Đường trỏ tới kho riêng không mang tiền tố kho lọt qua chốt tri-thuc-kem-trich: câu trích của kho riêng vẫn được xếp «máy đã quyết» và đi ra JSON của thẻ**
  Người dùng thấy gì: Nếu một dòng căn cứ trỏ vào trang của kho riêng mà viết thiếu tiền tố kho và kèm câu trích, câu trích đó vẫn được xếp như đã quyết và in ra thẻ. Nội dung riêng tư của kho riêng có thể lộ ra ở nơi người khác đọc được.
  Căn cứ: Có thể làm lộ nội dung kho riêng và một khi đã in ra thẻ thì khó thu hồi, nhưng chỉ xảy ra khi người viết dòng căn cứ viết sai khuôn; nên sửa thành việc riêng có ca thử đúng chỗ này.
  file: `scripts/tri-thuc-tra.cjs`
  severity: medium
  Đề xuất: new-contract

- **paths của E10 và E5 thiếu chính những tệp eval chạy hoặc phụ thuộc, nên lượt sau có thể mang màu xanh cũ sang mà không chạy lại**
  Người dùng thấy gì: Ở các lượt chấm lại sau này, một số kiểm tra có thể không chạy lại dù tệp nó phụ thuộc đã đổi, nên màu xanh cũ có thể bị mang sang. Người dùng cuối không thấy ngay nhưng lượt chấm sau kém đáng tin hơn.
  Căn cứ: Chỉ giảm độ tin của lượt chấm lại, không mất hay lộ dữ liệu; sửa rẻ vì chỉ là khai báo, và trùng với một finding khác nên xử lý chung.
  file: `_acceptance/thiet-ke-nap-tri-thuc/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc) + 3 (assert chuỗi có mặt trên chính chuỗi test tự viết): khóa khong_doc ở TN-3 hàng 2–3**
  Người dùng thấy gì: Bài kiểm tra cho trường hợp máy không đọc được kho riêng dùng chuỗi tự viết, nên nếu hướng dẫn ghi dòng này đổi chỗ, bài kiểm tra vẫn xanh. Người dùng có thể gặp trường hợp không đọc được kho riêng mà không ai biết là đã hỏng.
  Căn cứ: Rủi ro chỉ xuất hiện khi sau này ai đó đổi hướng dẫn mà không đổi bài kiểm tra; hành vi hôm nay đúng và sửa sau không đắt.
  file: `tests/scripts/thiet-ke-nap-tri-thuc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (ghim mã thoát, không ghim thông điệp): TN-4 hàng 6 chỉ kiểm thoát 2**
  Người dùng thấy gì: Khi chạy lệnh tự tải kho riêng trên kho chưa khai tri thức, bài kiểm tra chỉ biết là lệnh báo lỗi, chưa biết có đúng lý do không. Người dùng vẫn nhận lỗi, chỉ là thông báo có thể khó hiểu hơn nếu hỏng.
  Căn cứ: Hậu quả nhẹ, người dùng chỉ thấy một thông báo lỗi và thử lại được; thêm một dòng kiểm tra không đáng mở việc riêng.
  file: `tests/scripts/thiet-ke-nap-tri-thuc.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (assertion âm tính một mình): bộ dò cờ đỏ tri thức (coDo / nhánh fred của coTriThuc) chưa ca nào chứng minh là bắt được**
  Người dùng thấy gì: Bài kiểm tra khẳng định không có cờ đỏ khi đủ tra, nhưng chưa có ca nào chứng minh bộ dò cờ đỏ thật sự bắt được. Nếu giao diện đổi kiểu cờ, kiểm tra vẫn xanh dù người dùng không còn thấy cờ.
  Căn cứ: Dòng đỏ đã được kiểm bằng nội dung chữ ở hai ca chặn nên người dùng vẫn được cảnh báo hôm nay; thiếu đối chứng chỉ là rủi ro về sau và sửa rẻ.
  file: `tests/scripts/thiet-ke-nap-tri-thuc.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/thiet-ke-nap-tri-thuc/evals.yaml, commands/approve.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
