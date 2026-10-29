## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **DC8b checks only that some infrastructure reason exists, and the comment above it names a cause that is no longer what happens**
  Người dùng thấy gì: Một phép kiểm nội bộ báo đỏ đúng lúc nhưng không phân biệt được vì sao đỏ, và chú thích bên cạnh nói sai nguyên nhân. Người dùng không thấy lỗi nào; chỉ là phép kiểm này kém tin cậy hơn vẻ ngoài của nó.
  Căn cứ: Hậu quả nhẹ vì sản phẩm vẫn chạy đúng và chỉ có lời chú thích cùng độ chặt của phép kiểm bị lệch; sửa sau rẻ, không mất dữ liệu.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lỗi ghi tệp (mkdir/cat hỏng vì quyền, sandbox, đĩa) bị gán nhầm là «tác tử chép kịch bản sai», và chữ lỗi thật bị nuốt khỏi lý do**
  Người dùng thấy gì: Khi môi trường chặn việc ghi kịch bản (không đủ quyền, đĩa đầy), báo cáo lượt chấm đổ lỗi sai cho tác tử chép nhầm và giấu mất dòng lỗi thật. Người đọc sẽ mất thời gian đoán nguyên nhân, nhưng lượt chấm vẫn dừng an toàn và không cho kết quả sai.
  Căn cứ: Không mất dữ liệu và không cho xanh giả, chỉ làm lời giải thích sai nên người dùng khó chẩn đoán hơn; chạy lại hoặc đọc nhật ký là gỡ được, và chỉ gặp khi môi trường chặn ghi.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (kèm 1): chữ «No such tool available: Write» mà DC6b ghim là chuỗi do chính ca viết, không phải đầu ra đo được**
  Người dùng thấy gì: Phép kiểm cho bản cũ chỉ chứng minh bộ đọc chuyển đúng chữ lỗi được bơm vào, chưa chứng minh tác tử thật của bản cũ in ra đúng chữ ấy. Người dùng không bị ảnh hưởng; chỉ là bằng chứng cho bản cũ yếu hơn lời hứa.
  Căn cứ: Chỉ ảnh hưởng độ chắc của bằng chứng về bản đã bỏ, không đụng sản phẩm đang chạy; hợp đồng đã khai giới hạn này nên ghi lại là đủ.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (dạng gần): DC9 phát lại qua blob bộ chấm đã ghim, không qua bộ chấm của cây đang kiểm**
  Người dùng thấy gì: Phép kiểm trên tác tử thật dùng bản bộ chấm đã đóng băng, nên nếu sau này bộ chấm bị sửa hỏng thì phép kiểm này vẫn xanh. Hôm nay hai bản trùng nhau nên người dùng chưa gặp vấn đề.
  Căn cứ: Hợp đồng đã khai giới hạn này và hôm nay hai bản giống hệt nhau; rủi ro chỉ xuất hiện ở vòng sửa sau và có thể gỡ bằng cách ghi lại bản ghi khi đổi lệnh ghi.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: DC8a ghi trong tên ca là «xong 0», «tệp đúng từng byte» và «chạy lệnh ấy trọn», nhưng chỉ assert tên dấu kết cùng hai trường tổng**
  Người dùng thấy gì: Tên của một phép kiểm hứa kiểm cả nội dung từng byte và kết quả chạy trọn, nhưng thực tế chỉ kiểm vài điểm. Nếu lệnh bị cắt xén bên trong mà vẫn chạy tới cuối thì phép kiểm này không bắt được; người dùng chưa gặp sự cố nào.
  Căn cứ: Hậu quả nhẹ vì phép đo byte đầy đủ trên shell thật đã có ở chỗ khác trong bộ kiểm, nên chỗ hở này được che phần lớn; thêm vế kiểm sau rẻ nhưng không đáng mở việc riêng.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Khi tác tử bỏ dòng mở của lệnh ghi, kịch bản đối chứng vẫn chạy trọn, nhưng lượt chấm ghi là chưa chạy dòng nào (r1)**
  Người dùng thấy gì: Khi tác tử chép thiếu dòng đầu của lệnh ghi, phép đối chứng vẫn bị loại đúng nhưng sổ lượt chấm ghi là kịch bản chưa chạy dòng nào, trong khi thật ra nó đã chạy. Kết quả chấm không đổi, chỉ có số đếm chẩn đoán trong sổ bị lệch.
  Căn cứ: Nhẹ: người dùng không nhận kết quả sai, không mất dữ liệu, chỉ một dòng ghi chú chẩn đoán nói lệch nguyên nhân, và sửa sau vẫn rẻ.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1+2 (đo chỉ dẫn + fixture viết tay): DC6b ghim chữ «No such tool available: Write» do chính bộ mô phỏng của ca bịa ra, trong khi tác tử thật trả rỗng (r1)**
  Người dùng thấy gì: Một ca kiểm khẳng định lượt chấm cũ báo đúng câu lỗi thiếu công cụ ghi, nhưng câu ấy do chính ca kiểm tự dựng, còn tác tử thật khi đó trả về rỗng. Người dùng không bị ảnh hưởng, chỉ là bằng chứng này yếu hơn vẻ ngoài của nó.
  Căn cứ: Nhẹ: chỉ ảnh hưởng độ tin của một ca kiểm, không đổi hành vi sản phẩm, và hợp đồng đã khai rõ phần mô phỏng này là giới hạn.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (phép HOẶC làm chỗ trốn, đối chứng không phân biệt): DC9c chấp nhận dauRa rỗng, tức không tách được «đề bài cũ hỏng» khỏi «tác tử không chạy gì» (r1)**
  Người dùng thấy gì: Ca kiểm về lượt chấm cũ vẫn xanh với bất kỳ đầu ra rỗng nào, nên không phân biệt được đề bài cũ hỏng với tác tử không chạy gì. Người dùng không thấy khác biệt, chỉ là ca kiểm này chứng minh ít hơn tên của nó.
  Căn cứ: Nhẹ: không ảnh hưởng người dùng cuối, ca kiểm vẫn bắt được hồi quy chính của bản sửa, và siết lại sau rất rẻ.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (tên ca hứa nhiều hơn assert): DC8a tuyên «kịch bản chạy lệnh nhiều dòng ấy xong 0» nhưng không kiểm kết quả của lệnh (r1)**
  Người dùng thấy gì: Ca kiểm lệnh nhiều dòng hứa rằng kịch bản chạy xong trọn vẹn nhưng không thật sự kiểm kết quả chạy. Nếu lệnh bị cắt dở mà vẫn in đủ dấu, ca này vẫn báo xanh, nên người dùng có thể tin hơn mức nó đáng được tin.
  Căn cứ: Nhẹ: lỗi nằm ở độ chặt của ca kiểm chứ không ở sản phẩm, các ca khác vẫn chạy shell thật, và bổ sung một dòng kiểm sau này rất rẻ.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
