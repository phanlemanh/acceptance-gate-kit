# Review findings — doi-chung-chay-duoc (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khi tác tử bỏ dòng mở của lệnh ghi, kịch bản đối chứng vẫn chạy trọn, nhưng lượt chấm ghi là chưa chạy dòng nào**
  Người dùng thấy gì: Khi tác tử chép thiếu dòng đầu của lệnh ghi, phép đối chứng vẫn bị loại đúng nhưng sổ lượt chấm ghi là kịch bản chưa chạy dòng nào, trong khi thật ra nó đã chạy. Kết quả chấm không đổi, chỉ có số đếm chẩn đoán trong sổ bị lệch.
  Căn cứ: Nhẹ: người dùng không nhận kết quả sai, không mất dữ liệu, chỉ một dòng ghi chú chẩn đoán nói lệch nguyên nhân, và sửa sau vẫn rẻ.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1+2 (đo chỉ dẫn + fixture viết tay): DC6b ghim chữ «No such tool available: Write» do chính bộ mô phỏng của ca bịa ra, trong khi tác tử thật trả rỗng**
  Người dùng thấy gì: Một ca kiểm khẳng định lượt chấm cũ báo đúng câu lỗi thiếu công cụ ghi, nhưng câu ấy do chính ca kiểm tự dựng, còn tác tử thật khi đó trả về rỗng. Người dùng không bị ảnh hưởng, chỉ là bằng chứng này yếu hơn vẻ ngoài của nó.
  Căn cứ: Nhẹ: chỉ ảnh hưởng độ tin của một ca kiểm, không đổi hành vi sản phẩm, và hợp đồng đã khai rõ phần mô phỏng này là giới hạn.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (phép HOẶC làm chỗ trốn, đối chứng không phân biệt): DC9c chấp nhận dauRa rỗng, tức không tách được «đề bài cũ hỏng» khỏi «tác tử không chạy gì»**
  Người dùng thấy gì: Ca kiểm về lượt chấm cũ vẫn xanh với bất kỳ đầu ra rỗng nào, nên không phân biệt được đề bài cũ hỏng với tác tử không chạy gì. Người dùng không thấy khác biệt, chỉ là ca kiểm này chứng minh ít hơn tên của nó.
  Căn cứ: Nhẹ: không ảnh hưởng người dùng cuối, ca kiểm vẫn bắt được hồi quy chính của bản sửa, và siết lại sau rất rẻ.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (tên ca hứa nhiều hơn assert): DC8a tuyên «kịch bản chạy lệnh nhiều dòng ấy xong 0» nhưng không kiểm kết quả của lệnh**
  Người dùng thấy gì: Ca kiểm lệnh nhiều dòng hứa rằng kịch bản chạy xong trọn vẹn nhưng không thật sự kiểm kết quả chạy. Nếu lệnh bị cắt dở mà vẫn in đủ dấu, ca này vẫn báo xanh, nên người dùng có thể tin hơn mức nó đáng được tin.
  Căn cứ: Nhẹ: lỗi nằm ở độ chặt của ca kiểm chứ không ở sản phẩm, các ca khác vẫn chạy shell thật, và bổ sung một dòng kiểm sau này rất rẻ.
  file: `tests/workflows/doi-chung-chay-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
