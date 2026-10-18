## Trong hợp đồng

Không có finding mới ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Thứ tự dòng giờ máy ở bản xem vẫn xếp theo ngày, chú thích còn khẳng định «cùng thứ tự với làn của gio-may.duBao», sai từ khi làn đổi sang phụ thuộc trước (r2)**
  Người dùng thấy gì: Ở phần giờ máy theo mốc của bản xem chữ, các dòng có thể xếp theo ngày chứ không theo thứ tự máy thật sự chạy khi có mốc phụ thuộc ngược ngày. Ngày ghi trên từng dòng vẫn đúng, nên người đọc chỉ thấy thứ tự hơi khác chứ không thấy số sai.
  Căn cứ: Hậu quả nhẹ: chỉ lệch thứ tự hiển thị, không sai số liệu, không mất dữ liệu, và người dùng đọc ngày trên từng dòng vẫn hiểu đúng.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai ca chiều đỏ mới của lượt sửa (RD-10-do-phu, RD-10-kho-do) không được E10 ghim dòng PASS (r2)**
  Người dùng thấy gì: Hai phép thử phụ mới thêm vào lượt sửa chạy được và đang đạt, nhưng bộ chấm chưa ghi tên chúng vào danh sách bắt buộc phải có. Nếu sau này ai đó lỡ gỡ chúng đi, bộ chấm vẫn báo xanh dù một phần kiểm tra đã mất.
  Căn cứ: Hiện giờ không ảnh hưởng người dùng nào: phép thử vẫn chạy và đạt, rủi ro chỉ xuất hiện nếu về sau bị gỡ nhầm, và thêm hai dòng vào danh sách là việc rẻ.
  file: `_acceptance/road-map-de-dung/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Machine-hours lane runs an unrelated later milestone before the prerequisite of an earlier one, so the earlier milestone is falsely marked overloaded (r2)**
  Người dùng thấy gì: Khi có ba mốc mà mốc gần hạn nhất phụ thuộc vào một mốc xa hạn, trang và bản xem có thể báo «quá tải» sai cho mốc gần hạn nhất và ghi ngày bắt đầu muộn hơn thực tế. Có cách xếp khác kịp hạn, nhưng người xem sẽ tưởng mốc đó không kịp.
  Căn cứ: Hậu quả vừa: có thể khiến người đọc lo nhầm về một mốc gần hạn, nhưng chỉ xảy ra ở cấu hình hiếm (ba mốc, một mốc độc lập chen giữa), không mất dữ liệu và người dùng tự đối chiếu được; sửa cần đổi cách xếp làn nên đắt hơn một chỉnh nhỏ.
  file: `scripts/gio-may.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert có mặt thay cho quan hệ), còn sót ở vế khối dữ liệu của RD-10-kho: năm khoá mới bị xoá trước khi so, không đối với giá trị tính từ tệp (r2)**
  Người dùng thấy gì: Phép kiểm trên năm kho thật chưa đối chiếu giá trị của năm trường mới trong dữ liệu hiển thị, nên nếu số việc còn lại hay việc gắn vào mốc bị sai ở kho thật thì phép kiểm này vẫn xanh. Các phép kiểm khác trên kho thử và bản chụp crm vẫn đang canh phần này.
  Căn cứ: Hậu quả nhẹ: phần này vẫn được canh một phần ở chỗ khác và trang hiển thị đọc cùng nguồn dữ liệu, nên người dùng ít khả năng gặp số sai mà không ai phát hiện; thêm phép so sẽ tốn công mà lợi ích hẹp.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hồ sơ trỏ sai script sinh bản chụp crm: lo-trinh-chup-crm.mjs là một script khác, có sẵn từ trước (r1)**
  Người dùng thấy gì: Người đọc hồ sơ làm theo chỉ dẫn sẽ chạy nhầm công cụ chụp dữ liệu và không dựng lại được bản chụp của vòng này. Sản phẩm chạy đúng, chỉ có tài liệu hướng dẫn sai tên.
  Căn cứ: Nhẹ: không ảnh hưởng người dùng sản phẩm, chỉ làm người bảo trì mất thời gian khi dựng lại dữ liệu mẫu, và sửa một dòng chữ rất rẻ.
  file: `_acceptance/road-map-de-dung/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Phần tử dung_tren rỗng khớp nhầm với mốc không có `ma`: báo sai cờ dung-tren-moc và mất dòng «mã không có» (r1)**
  Người dùng thấy gì: Khi lộ trình có một mục phụ thuộc bị để trống, hệ thống cảnh báo nhầm rằng việc đó đứng trên một mốc thật và nuốt mất cảnh báo đúng là mục phụ thuộc không có mã. Người đọc có thể bị chỉ sai chỗ cần sửa.
  Căn cứ: Nhẹ: chỉ xảy ra khi tệp lộ trình bị sửa tay sai, không mất dữ liệu, cảnh báo sai nhưng người dùng tự sửa lại tệp được.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Trang cũ nhận hai cờ vàng «vẽ lại bằng bộ kit mới» cho cùng một lần vẽ lại (r1)**
  Người dùng thấy gì: Với trang lộ trình vẽ từ rất sớm, người đọc thấy hai dòng cảnh báo cùng bảo vẽ lại trang, trong khi tài liệu hứa đúng một dòng. Chỉ gây rườm, không làm sai nội dung.
  Căn cứ: Nhẹ: chỉ thừa một dòng nhắc, người dùng vẽ lại trang một lần là hết, không mất dữ liệu.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Luật dữ liệu giả có hai bản cài đặt độc lập (răng cắt lượt và bộ đọc chung) dù comment khai «MỘT nguồn» (r1)**
  Người dùng thấy gì: Cùng một luật kiểm dữ liệu giả được viết ở hai nơi, nên sau này sửa một nơi mà quên nơi kia thì lúc cắt lượt và lúc đọc có thể báo khác nhau. Hiện chưa có người dùng nào gặp sai lệch cụ thể.
  Căn cứ: Rủi ro tương lai chứ chưa gây hại hôm nay; gộp hai bản đòi đụng nhiều chỗ nên đáng ghi lại hơn là sửa vội.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **A task listed in several milestones has its hours counted again for each one in the lane (r1)**
  Người dùng thấy gì: Khi một việc được liệt ở nhiều mốc, giờ máy của việc đó bị cộng lại ở mỗi mốc nên ngày dự kiến của các mốc sau bị đẩy muộn hơn thực tế. Người đọc có thể thấy ngày giao dự kiến xa hơn mức cần.
  Căn cứ: Vừa: chỉ làm ngày dự kiến thiên về muộn (an toàn hơn là sớm), không mất dữ liệu, người dùng tự bỏ trùng việc ở lộ trình được.
  file: `scripts/gio-may.mjs`
  severity: medium
  Đề xuất: known-limits

- **Milestones-section header claims hidden milestones have no tasks, which is false when the task was shown under an earlier milestone (r1)**
  Người dùng thấy gì: Dòng tiêu đề khối Mốc nói một số mốc là chưa gắn việc nào, nhưng thực ra có mốc đã gắn việc mà việc đó đã hiện ở mốc trước. Người đọc hiểu nhầm lý do mốc bị ẩn.
  Căn cứ: Nhẹ: chỉ sai một câu giải thích, danh sách việc hiển thị vẫn đúng và không mất dữ liệu.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Display model puts undated milestones first, so they take shared tasks — the opposite of the machine-hours lane (r1)**
  Người dùng thấy gì: Khi một việc nằm ở cả mốc chưa có ngày và mốc có ngày, trang hiện việc đó dưới mốc chưa có ngày, ngược với cách tính giờ máy. Người đọc thấy việc nhóm khác nơi ngày dự kiến tính.
  Căn cứ: Nhẹ: chỉ xảy ra với mốc chưa có ngày dùng chung việc, không mất dữ liệu, người dùng chỉnh lại lộ trình là xong.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp): RD-1-do và RD-1-do2 ghim một nhãn do chính ca tự gắn theo tên ca con, không ghim thông điệp của vật; nhãn của RD-1-do còn khớp hai ca con (r1)**
  Người dùng thấy gì: Ca kiểm chiều đỏ của luật bỏ mốc ngoài có thể vẫn báo đúng dù lỗi xảy ra ở chỗ khác, nên khó tin hoàn toàn rằng nó bắt đúng chỗ. Người dùng sản phẩm không bị ảnh hưởng trực tiếp.
  Căn cứ: Nhẹ với người dùng: chỉ làm bộ kiểm kém chặt, vật vẫn chạy đúng, và siết lại ca đo là việc nội bộ tách riêng được.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp): RD-9-do ghim mã ô '|qua|co|' do ca tự sinh, còn thông điệp E9 khai «mốc đã khép vẫn bị báo» không có ở đâu trong mã (r1)**
  Người dùng thấy gì: Ca kiểm chiều đỏ của dòng gom mốc đã qua ngày ghim vào tên ô do chính ca tự đặt, nên chưa chứng minh được nó bắt đúng lỗi báo nhầm mốc đã khép. Người dùng không thấy khác biệt nào.
  Căn cứ: Nhẹ với người dùng: chỉ là bộ kiểm lỏng hơn lời khai, vật chạy đúng theo hợp đồng và có thể siết sau.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là quan hệ): RD-1 ca 'moc-ngoai-va-hang' hứa «thoát 1 CHỈ VÌ [moc-ngoai-da-bo]» nhưng chỉ kiểm dòng ấy có mặt (r1)**
  Người dùng thấy gì: Ca kiểm không loại trừ được việc hệ thống báo thêm lỗi sai bên cạnh lỗi mốc ngoài, nên một lỗi báo thừa có thể lọt qua. Người dùng có thể thấy thêm một dòng lỗi không đáng có ở ca hiếm.
  Căn cứ: Nhẹ: lỗi báo thừa chỉ gây nhiễu, không làm mất dữ liệu, và người dùng đọc là phân biệt được.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên phủ nhưng không có assert): E5 hứa «details mở chứa slug khi có» mà bộ đọc RD-5 xoá trọn nội dung details và không assert slug nào (r1)**
  Người dùng thấy gì: Chưa có phép đo nào kiểm rằng khi mở một dòng việc thì thấy tên hồ sơ; nếu chỗ này hỏng thì không ai biết qua bộ kiểm. Người dùng có thể mở dòng ra mà không thấy tên hồ sơ.
  Căn cứ: Nhẹ: chỉ là chi tiết phụ khi mở rộng dòng, người dùng tải lại hoặc xem nguồn là thấy, và thêm phép đo sau rất rẻ.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): RD-3 kiểm «khối VAN-HANH không dạy tạo mốc ngoài» bằng regex hai cụm, không có ca đỏ cho vế này (r1)**
  Người dùng thấy gì: Phép kiểm rằng hướng dẫn cắt lượt không dạy tạo mốc ngoài chỉ bắt hai cách viết cố định, nên nếu sau này ai dạy bằng câu chữ khác thì không bị phát hiện. Hiện hướng dẫn chưa sai.
  Căn cứ: Nhẹ: chỉ là lưới an toàn hẹp cho thay đổi tương lai, không có hậu quả với người dùng hôm nay, và bổ sung ca đỏ sau không đắt.
  file: `tests/scripts/road-map-de-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
