# Review findings: moi-cong-khong-qua-nut (round 3)

## Trong hợp đồng

(không có finding nào map được vào AC ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E9b vẫn đỏ chập chờn vì một ca ngoài vòng (GT-07 tin-tu-den); khoá mới chỉ đổi cách in đầu ra, không gỡ nguyên nhân (r2 · tệp đã đổi)**
  Người dùng thấy gì: Bước kiểm điều phối có thể báo đỏ thất thường vì một ca không liên quan đến lời mời ở cổng, nên đôi khi lượt chấm bị từ chối dù phần việc của vòng này đã đúng. Người dùng chỉ cần chạy lại là qua, không mất dữ liệu và không ảnh hưởng gì đến lời mời cổng.
  Căn cứ: Hậu quả nhẹ: chỉ làm lượt chấm đôi khi đỏ giả, chạy lại là hết, không mất hay lộ dữ liệu; nguyên nhân nằm ở phần tin nhắn giữa các phiên mà vòng khác đang lo nên ghi là hạn chế đã biết là đủ.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **--dem tách lượt sai ở các tin chèn giữa lượt: bỏ sót lượt cổng hỏng thật, nên thước có thể đọc «0 hỏng» trong khi thực tế có (r1)**
  Người dùng thấy gì: Khi đếm số lần phiên trình thẻ rồi vẫn hiện nút hoặc câu hỏi sai chỗ trên các bản ghi thật, thước có thể bỏ sót một số lần hỏng, nên con số «0 lần hỏng» sau 14 ngày có thể đẹp hơn thực tế. Người dùng vẫn có thể thấy lời mời bị mất ở những lượt đó mà thước không báo.
  Căn cứ: Thước chỉ là bảng đồng hồ đếm sau khi ship chứ không chặn ai, lỗi chỉ làm số đếm thiếu chứ không làm hỏng lời mời; ghi rõ giới hạn để người đọc số 0 biết nó có thể thấp hơn thực tế, sửa sau không mất gì.
  file: `tests/scripts/moi-cong-khong-qua-nut.test.mjs`
  severity: high
  Đề xuất: known-limits

- **--dem coi mọi lệnh Bash có nhắc tới «gate-card.js» là một lượt cổng (grep, sed, git commit…), làm lệch cả mẫu số lẫn tử số (r1)**
  Người dùng thấy gì: Thước đếm cả những lượt chỉ có người đọc hay sửa tệp thẻ rồi coi là lượt trình thẻ, nên số lượt cổng bị thổi lên và vài lượt làm việc bình thường có thể bị tính nhầm là hỏng. Người xem con số sẽ đọc lệch về cả tổng lẫn tỉ lệ hỏng.
  Căn cứ: Hậu quả chỉ là số đếm lệch trên một bảng theo dõi, không ảnh hưởng người dùng cuối hay dữ liệu; khai giới hạn và đọc số kèm cảnh báo là đủ trước mắt, sửa sau không đắt.
  file: `tests/scripts/moi-cong-khong-qua-nut.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: AC-5 hứa «hộp chỉ có khoá recap» nhưng bộ kiểm chỉ chặn hai khoá có tên (ask, actions) (r1)**
  Người dùng thấy gì: Nếu phiên đặt câu hỏi hay nút dưới một tên trường khác tên đã biết, thước vẫn tính lượt đó là sạch dù người dùng vẫn thấy nút điền sẵn lệnh ký. Lời mời có thể vẫn lọt sai chỗ mà không bị đếm.
  Căn cứ: Lỗi chỉ nhìn thấy khi phiên dùng tên trường lạ, chưa có bằng chứng xảy ra, và thước chỉ để theo dõi sau ship; khai giới hạn rồi để số đo thật quyết có mở việc hay không.
  file: `tests/scripts/moi-cong-khong-qua-nut.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 và 4: MQ-10 dựng tay bản ghi đúng khuôn bên đọc; chế độ đếm không có đối chứng là đã thấy hộp, nên «0 lượt hỏng» không phân biệt được «không hỏng» với «không đọc ra hộp» (r1)**
  Người dùng thấy gì: Nếu cách app ghi hộp «bước kế» khác với giả định, thước sẽ báo «0 lượt hỏng» dù thật ra không đọc ra hộp nào, và người xem tin nhầm là mọi thứ ổn. Đây là khả năng báo xanh giả sau 14 ngày.
  Căn cứ: Rủi ro là một con số đo có thể sai im lặng nhưng không làm hỏng việc của người dùng; nên ghi thêm vào giới hạn đã khai rằng cách app ghi hộp là giả định, và đối chiếu bằng một bản ghi thật khi crm nhận bản vá.
  file: `tests/scripts/moi-cong-khong-qua-nut.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: MQ-3 hứa điều khoản kết lượt «đứng ngay sau» lời mời nhưng chỉ kiểm nó «có mặt trong cùng đoạn» (r1)**
  Người dùng thấy gì: Ai đó sau này chèn thêm một câu giữa lời mời và dặn dò kết lượt trong cùng đoạn thì bộ kiểm vẫn xanh. Hiện văn bản đúng nên người dùng chưa bị ảnh hưởng.
  Căn cứ: Văn bản hiện đúng và lệch chỉ có thể xảy ra nếu có người chủ động sửa xấu, hậu quả nhẹ và sửa lại bằng một dòng; chi phí siết thước vượt xa rủi ro nên ghi vết rồi thôi.
  file: `tests/scripts/moi-cong-khong-qua-nut.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3: phép gắn hai chiều của MQ-5-gan buộc luật nut-lenh vào cụm của một luật khác («không nút») (r1)**
  Người dùng thấy gì: Nếu điều khoản bỏ mất ý «nút không được mang dòng lệnh» nhưng vẫn giữ ý «không nút», bộ kiểm không báo đỏ. Điều khoản vẫn dặn phiên đúng cách vì cụm «không nút» còn đó.
  Căn cứ: Hai ý này gần như trùng nhau nên bỏ một ý không đổi hành vi dặn phiên, hậu quả rất nhẹ và dễ thấy khi đọc lại; sửa tốn công hơn lợi ích nên chấp nhận và ghi vết.
  file: `tests/scripts/moi-cong-khong-qua-nut.test.mjs`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
