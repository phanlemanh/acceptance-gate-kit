# Review findings — design-gate-che-do-chat (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Có cờ --require-measured mà gặp lỗi chặn thì báo 'thoát 5' nhưng thật ra thoát 2**
  Người dùng thấy gì: Khi bật chế độ chặt và tệp có lỗi chặn thấy được, kết quả vẫn đúng là bị từ chối, nhưng dòng giải thích lại ghi nhầm là mã 5 trong khi mã thật là 2. Người đọc log có thể hiểu sai lý do, nhưng quyết định chặn không sai.
  Căn cứ: Hậu quả nhẹ: chỉ lệch chữ trong dòng giải thích, kết luận từ chối vẫn đúng và không mất dữ liệu; người dùng đọc lại là hiểu, sửa sau không đắt nên ghi lại là đủ.
  file: `scripts/design-gate.mjs`
  severity: medium
  Đề xuất: known-limits

- **Nhánh chặt chạy trước khi kiểm --mode, nên mode sai cũng nhận mã 5 kèm tên mode lạ**
  Người dùng thấy gì: Nếu gõ sai tên chế độ kèm cờ chặt, công cụ vẫn báo là không đo được thay vì báo lỗi cách dùng. Chỉ xảy ra khi gõ nhầm, người dùng thấy tên chế độ lạ trong thông báo và tự sửa được.
  Căn cứ: Hậu quả nhẹ: chỉ xảy ra khi gõ sai lệnh, thông báo vẫn hiện tên chế độ sai nên người dùng tự nhận ra và chạy lại; không mất dữ liệu.
  file: `scripts/design-gate.mjs`
  severity: low
  Đề xuất: known-limits

- **Strict dom mode returns 5 for a component file that does not exist, so an eval pinned to expected_exit: 5 still passes on a wrong or deleted path**
  Người dùng thấy gì: Ở chế độ chặt kiểm giao diện thật, nếu đường dẫn tệp bị gõ sai hoặc tệp đã bị xoá, công cụ vẫn báo kết quả «không đo được» như bình thường. Một bài kiểm đã khai đúng kết quả đó sẽ vẫn xanh dù tệp không còn, tức là xanh rỗng.
  Căn cứ: Hậu quả vừa: không mất dữ liệu nhưng có thể che việc tệp biến mất, và chỉ ảnh hưởng kho nào ghim kết quả «không đo được» ở chế độ giao diện thật. Hợp đồng đã chủ ý chấp nhận hành vi này, nên ghi giới hạn và dặn kho kiểm đường dẫn riêng là hợp lý.
  file: `scripts/design-gate.mjs`
  severity: medium
  Đề xuất: known-limits

- **Static strict mode on a non-HTML file with a blocking finding says 'thoát 5' on stderr and in JSON, but exits 2**
  Người dùng thấy gì: Khi bật chế độ chặt và tệp có lỗi chặn, thông báo và bản ghi kết quả nói là mã 5 nhưng công cụ thực tế trả mã 2. Ai đọc hoặc phân tích chữ trong thông báo sẽ hiểu sai mã thoát, dù quyết định từ chối đúng.
  Căn cứ: Hậu quả nhẹ: chỉ sai chữ trong lý do, kết luận từ chối đúng và người dùng chạy lại là thấy mã thật; sửa sau không đắt nên ghi lại là đủ.
  file: `scripts/design-gate.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
