# Review findings: o-mo-viec-mang-nguon (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **S0-MO-O not updated for the new lazy dependencies: plugin root check lacks the three knowledge modules and the knowledge template, and a missing module surfaces as exit 1 = 'work description'**
  Người dùng thấy gì: Nếu bản cài plugin trên máy bị đồng bộ dở và thiếu một tệp tri thức, lệnh mở ô cho hàng có đợt sẽ không dừng với thông báo rõ ràng. Nó bị hiểu nhầm là người dùng gõ một mô tả việc tự do và đi tiếp sai hướng.
  Căn cứ: Hậu quả nhẹ vì chỉ xảy ra khi bản cài plugin bị đồng bộ dở, không mất dữ liệu, người dùng tự gỡ được bằng cách cập nhật lại plugin, và việc sửa có thể làm riêng ở một vòng sau.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **docDongNguon nhận nhầm mọi dòng chữ tự do mở bằng «Nguồn:» thành dòng Nguồn của máy (r1)**
  Người dùng thấy gì: Một ô viết tay có câu bắt đầu bằng «Nguồn:» có thể bị máy coi là đã có dòng nguồn của nó, nên sau này thẻ có thể báo «có nguồn nhưng rỗng hoặc lệch» thay vì «không có dòng nguồn». Hiện chưa có thẻ nào đọc dòng này nên chưa ai thấy sai.
  Căn cứ: Hậu quả chỉ là một nhãn gây hiểu nhầm trên thẻ ở bước sau, không mất dữ liệu, người dùng đổi câu chữ là hết, và bước dùng bộ đọc này chưa tồn tại nên sửa lúc nối vào thẻ sẽ rẻ hơn.
  file: `scripts/tri-thuc-nguon.cjs`
  severity: medium
  Đề xuất: known-limits

- **Dòng «Nguồn:» ghi đường tuyệt đối của máy chạy vào ô cơ hội được commit (r1)**
  Người dùng thấy gì: Khi kho tri thức riêng vắng, ô cơ hội được lưu vào kho có thể mang đường thư mục cá nhân của người mở ô, và trên máy khác đường ấy sai.
  Căn cứ: Chỉ xảy ra khi kho riêng vắng, hậu quả là một dòng gợi ý sai đường và lộ tên thư mục cá nhân trong kho nội bộ, người dùng sửa tay dòng đó được và sửa sau không đắt.
  file: `scripts/tri-thuc.mjs`
  severity: low
  Đề xuất: known-limits

- **chonTrang báo «chưa có trang: mã X» dù trang đợt đã mang mã X — mâu thuẫn với lint ma-khong-co-trang của TT1 (r1)**
  Người dùng thấy gì: Khi chỉ trang đợt mang các mã của hàng, ô vẫn ghi «chưa có trang: mã …» dù tri thức đã có, trong khi kiểm tra của kho báo đủ. Người ở Cổng Đáng có thể tưởng thiếu tri thức và đi tìm hoặc viết thêm không cần thiết.
  Căn cứ: Thông tin sai nằm ngay trên thứ người quyết đọc nên có thể gây việc thừa, nhưng không mất dữ liệu và người đọc đối chiếu kho là thấy; sửa đúng tầng nên làm thành việc riêng với ca thử riêng.
  file: `scripts/tri-thuc.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lỗi bất kỳ khi chọn trang bị nuốt vào dòng «Nguồn:», CLI vẫn thoát 0, không in gì ra stderr (r1)**
  Người dùng thấy gì: Nếu việc chọn trang hỏng vì lỗi bất ngờ, ô vẫn được mở và chỉ có một dòng chữ nói lỗi bên trong ô, không có cảnh báo nào cho người đang chạy lệnh.
  Căn cứ: Ô vẫn mở được đúng như chủ đích không chặn việc, người đọc ô thấy ngay dòng lỗi, và đây là tình huống hiếm do hạ tầng hỏng; chấp nhận và ghi lại là đủ.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Lỗi ném ra từ kiemNguonPhamVi làm răng phủ thoát 1 («đỏ») thay vì 2 («không chạy được») (r1)**
  Người dùng thấy gì: Khi phần kiểm nguồn của bản phạm vi hỏng vì hạ tầng, lệnh kiểm vẫn báo «đỏ» như thể bản phạm vi sai, nên người cắt lượt có thể đi sửa nhầm bản phạm vi.
  Căn cứ: Chỉ xảy ra khi hạ tầng tri thức hỏng, thông điệp lỗi vẫn in ra nên người dùng thử lại hoặc nhận ra được, và không có dữ liệu bị mất.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: assertion chỉ nhìn mã thoát — ON-3-thieu-tep-mutant không ghim thông điệp (r1)**
  Người dùng thấy gì: Bài thử xác nhận «bên đọc cũ không nạp mô-đun tri thức» có thể vẫn xanh vì một lỗi khác, nên màu xanh đó chứng được ít hơn nó tự nói.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ làm một bài thử kém sắc, và mở thêm vòng đo thước của thước đang bị luật chiều rộng chặn.
  file: `tests/scripts/o-mo-viec-mang-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: ba hàng đầu ma trận ON-4 chỉ đếm số đường trỏ, trong khi lời hứa là các đường trỏ CÒN LẠI (r1)**
  Người dùng thấy gì: Bài thử cho ba tình huống thiếu trang chỉ kiểm số đường trỏ còn lại chứ không kiểm đúng từng đường, nên một lỗi chọn nhầm trang cùng số lượng sẽ lọt.
  Căn cứ: Đây là độ chặt của bài thử chứ không phải lỗi đã thấy ở sản phẩm, trường hợp chọn nhầm cùng số lượng rất hiếm và chính các ca khác đã so danh sách đầy đủ.
  file: `tests/scripts/o-mo-viec-mang-nguon.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2: fixture bản phạm vi PV() viết tay theo khuôn bên đọc, không rút từ khối PHAM-VI-MA của khuôn (r1)**
  Người dùng thấy gì: Bản phạm vi dùng trong bài thử được viết tay, nên nếu khuôn bản phạm vi đổi dạng, các bài thử này vẫn xanh trong khi người cắt lượt chép theo khuôn mới.
  Căn cứ: Rủi ro chỉ xuất hiện khi khuôn đổi dạng về sau, các ca khác ở kho đã rút từ khuôn thật làm lưới, và sửa lúc đó rẻ hơn bây giờ.
  file: `tests/scripts/o-mo-viec-mang-nguon.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
