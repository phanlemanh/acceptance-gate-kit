# Review findings: khung-dot-dinh-vi (round 2)

## Trong hợp đồng

Không có finding nào trong hợp đồng ở round 2.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Rule for short task names copied from the kit has drifted, with no marker and no round-trip test (r1)**
  Người dùng thấy gì: Khoảng một nửa tên việc trên khung có thể hiện thêm một dấu « thừa ở đầu, nên tên hơi khác với tên người thấy ở trang lộ trình. Việc vẫn nhận ra được, chỉ xấu và lệch chữ.
  Căn cứ: Hậu quả nhẹ và chỉ về hiển thị, không mất dữ liệu; người dùng vẫn đọc ra việc và mã vẫn đi kèm, còn sửa sau rẻ vì chỉ là chuẩn hoá lại tên.
  file: `dieu-phoi/scripts/nguon-hang.mjs`
  severity: medium
  Đề xuất: known-limits

- **Opening a batch now tells the session to hand-edit the batch's work list, bypassing its only writer (r1)**
  Người dùng thấy gì: Khi mở đợt, phiên được dặn sửa tay danh sách việc của đợt, nên nếu có phiên khác ghi cùng lúc thì thay đổi có thể đè nhau và không để lại dấu vết trong sổ.
  Căn cứ: Hậu quả chỉ xảy ra khi hai bên ghi trùng thời điểm, hiếm lúc mở đợt và người dùng gỡ được bằng cách khai lại mục tiêu; sửa đúng cách cần thêm đường ghi có khoá nên đáng làm thành việc riêng.
  file: `dieu-phoi/commands/mo-dot.md`
  severity: medium
  Đề xuất: new-contract

- **Red-path case KH-07-do pins too generic a message (r1)**
  Người dùng thấy gì: Phép kiểm tự động cho việc pane vẽ nhầm lại chữ cũ có thể báo đỏ vì một lỗi khác cùng ca, nên khó biết đúng nguyên nhân. Người dùng cuối không thấy gì.
  Căn cứ: Chỉ làm bộ kiểm kém chính xác hơn khi báo lỗi, không làm hỏng sản phẩm và không mất dữ liệu; sửa sau rẻ nhưng không cấp bách.
  file: `tests/dieu-phoi/kiem-khung.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2: KD-8 dùng fixture viết tay đúng khuôn bên đọc (so_hang, da_gop); không đi vòng từ bên viết gop_da_bao/hang (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu có ngày phần đếm số hàng đã gộp đếm sai, phép kiểm tự động vẫn xanh và dòng tiến độ có thể hiện số sai mà không ai báo.
  Căn cứ: Hiện chưa có số sai nào được thấy, chỉ là lưới kiểm chưa phủ đường này; nếu lỗi xảy ra người dùng chỉ thấy một con số tiến độ lệch và tự đối chiếu được, nên ghi lại là đủ.
  file: `tests/dieu-phoi/khung-dinh-vi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: KD-6b gọi thẳng docTenViec với tham chiếu nguồn viết tay; nhánh nguon_hang trong cấu hình đợt → xem --json --khung chưa được đo (r1 · tệp đã đổi)**
  Người dùng thấy gì: Với đợt khai nguồn việc trong cấu hình riêng, chưa có phép kiểm nào chạy trọn đường để chắc tên việc hiện đúng trên khung. Nếu đường này hỏng, khung có thể hiện cờ thiếu tên mà bộ kiểm vẫn xanh.
  Căn cứ: Hỏng ở đây chỉ làm tên việc hiện thành cờ vàng chứ không chặn khung hay mất dữ liệu; người dùng vẫn thấy mã việc nên tự tra được, còn dựng thêm phép kiểm trọn đường khá tốn.
  file: `tests/dieu-phoi/khung-dinh-vi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: phần khung của KD-6b chỉ có assert âm tính, không có đối chứng dương rằng dòng việc tồn tại và mang tên (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm tên việc trên khung có thể xanh dù khung không có dòng việc nào, nên không bảo đảm mọi việc đều hiện kèm tên.
  Căn cứ: Chỉ làm lưới kiểm kém chắc, không ảnh hưởng gì tới người dùng cuối; bổ sung một phép đếm dòng việc sau này rẻ.
  file: `tests/dieu-phoi/khung-dinh-vi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: ca đỏ KH-07-do pane-chu-xem ghim thông điệp bằng phép HOẶC quá rộng /Expected|toEqual/ (r1)**
  Người dùng thấy gì: Phép kiểm cho việc pane vẽ nhầm chữ cũ có thể báo đỏ vì một lý do khác, nên khó biết đúng nguyên nhân. Người dùng cuối không thấy ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm báo lỗi kém chính xác, không đụng sản phẩm hay dữ liệu; trùng với một phát hiện khác nên sửa một lần là đủ và có thể để sau.
  file: `tests/dieu-phoi/kiem-khung.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
