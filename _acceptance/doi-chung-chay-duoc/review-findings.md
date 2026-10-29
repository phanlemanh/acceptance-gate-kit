# Review findings — doi-chung-chay-duoc (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lỗi ghi tệp ở tầng hạ tầng bị gắn nhãn sai thành «tác tử chép kịch bản sai», nhãn còn khẳng định đã đổi tên sang .sai dù việc đó không xảy ra**
  Người dùng thấy gì: Khi máy không ghi được tệp kịch bản vì lỗi môi trường (đĩa đầy, thư mục bị khoá), báo cáo vẫn dừng đúng chỗ nhưng nói nhầm rằng tác tử chép sai và tệp đã bị đổi tên. Người đọc thẻ sẽ đi tìm lỗi sai chỗ và không thấy nguyên nhân thật.
  Căn cứ: Hậu quả nhẹ vì lượt chấm vẫn bị chặn an toàn, không mất dữ liệu và không cho qua nhầm, chỉ làm lời giải thích sai; tình huống này hiếm và chạy lại sau khi môi trường ổn là hết.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — Đo CHỈ DẪN thay vì ĐẦU RA: DC6b/DC6c lấy lỗi «No such tool available: Write» từ chính bộ mô phỏng, mà bộ mô phỏng chỉ dò chữ trong đề bài**
  Người dùng thấy gì: Một phép kiểm tự động chứng minh yếu hơn lời nó tuyên bố: nó chỉ cho thấy đề bài cũ có nhắc công cụ ghi, chứ không cho thấy tác tử cũ thật sự báo lỗi đó. Người dùng không thấy khác biệt nào, nhưng độ tin cậy của một dòng trong báo cáo thấp hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm và hành vi tác tử thật đã có bản ghi riêng kiểm chứng; chỉ cần ghi rõ giới hạn của phép kiểm, sửa sau không gấp.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: DC9c trên đầu ra rỗng không phân biệt được bộ chấm cũ, có thêm phép HOẶC làm lối thoát**
  Người dùng thấy gì: Một phép kiểm trên bản ghi tác tử cũ có thể xanh dù tác tử không làm gì, nên nó không tách được bộ chấm cũ khỏi bộ chấm mới. Người dùng không bị ảnh hưởng, chỉ là một bằng chứng trong hồ sơ yếu hơn vẻ ngoài.
  Căn cứ: Hậu quả nhẹ, chỉ làm một bằng chứng kém sắc và không làm sản phẩm chạy sai; chi phí dựng thêm đối chứng cao hơn lợi ích nên ghi giới hạn là đủ.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: đột biến DC8b chỉ đòi có một lý do hạ tầng bất kỳ, không ghim thông điệp**
  Người dùng thấy gì: Một phép thử phá cố ý chỉ kiểm có một lý do lỗi hạ tầng nào đó, nên nếu một lưới khác bắt thay thì vẫn xanh. Người dùng không thấy gì, nhưng không chắc đúng cơ chế cần bảo vệ đang được kiểm.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm và lưới chính vẫn chặn đúng; chỉ làm một phép thử phụ kém chặt, ghi giới hạn rồi sửa khi có vòng sau.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **DC8b checks only that some infrastructure reason exists, and the comment above it names a cause that is no longer what happens (r2)**
  Người dùng thấy gì: Một phép kiểm nội bộ báo đỏ đúng lúc nhưng không phân biệt được vì sao đỏ, và chú thích bên cạnh nói sai nguyên nhân. Người dùng không thấy lỗi nào; chỉ là phép kiểm này kém tin cậy hơn vẻ ngoài của nó.
  Căn cứ: Hậu quả nhẹ vì sản phẩm vẫn chạy đúng và chỉ có lời chú thích cùng độ chặt của phép kiểm bị lệch; sửa sau rẻ, không mất dữ liệu.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lỗi ghi tệp (mkdir/cat hỏng vì quyền, sandbox, đĩa) bị gán nhầm là «tác tử chép kịch bản sai», và chữ lỗi thật bị nuốt khỏi lý do (r2)**
  Người dùng thấy gì: Khi môi trường chặn việc ghi kịch bản (không đủ quyền, đĩa đầy), báo cáo lượt chấm đổ lỗi sai cho tác tử chép nhầm và giấu mất dòng lỗi thật. Người đọc sẽ mất thời gian đoán nguyên nhân, nhưng lượt chấm vẫn dừng an toàn và không cho kết quả sai.
  Căn cứ: Không mất dữ liệu và không cho xanh giả, chỉ làm lời giải thích sai nên người dùng khó chẩn đoán hơn; chạy lại hoặc đọc nhật ký là gỡ được, và chỉ gặp khi môi trường chặn ghi.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (kèm 1): chữ «No such tool available: Write» mà DC6b ghim là chuỗi do chính ca viết, không phải đầu ra đo được (r2)**
  Người dùng thấy gì: Phép kiểm cho bản cũ chỉ chứng minh bộ đọc chuyển đúng chữ lỗi được bơm vào, chưa chứng minh tác tử thật của bản cũ in ra đúng chữ ấy. Người dùng không bị ảnh hưởng; chỉ là bằng chứng cho bản cũ yếu hơn lời hứa.
  Căn cứ: Chỉ ảnh hưởng độ chắc của bằng chứng về bản đã bỏ, không đụng sản phẩm đang chạy; hợp đồng đã khai giới hạn này nên ghi lại là đủ.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (dạng gần): DC9 phát lại qua blob bộ chấm đã ghim, không qua bộ chấm của cây đang kiểm (r2)**
  Người dùng thấy gì: Phép kiểm trên tác tử thật dùng bản bộ chấm đã đóng băng, nên nếu sau này bộ chấm bị sửa hỏng thì phép kiểm này vẫn xanh. Hôm nay hai bản trùng nhau nên người dùng chưa gặp vấn đề.
  Căn cứ: Hợp đồng đã khai giới hạn này và hôm nay hai bản giống hệt nhau; rủi ro chỉ xuất hiện ở vòng sửa sau và có thể gỡ bằng cách ghi lại bản ghi khi đổi lệnh ghi.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: DC8a ghi trong tên ca là «xong 0», «tệp đúng từng byte» và «chạy lệnh ấy trọn», nhưng chỉ assert tên dấu kết cùng hai trường tổng (r2)**
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
