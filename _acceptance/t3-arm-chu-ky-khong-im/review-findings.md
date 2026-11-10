## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E6 đã đỏ được theo mã thoát nhưng vẫn không cho thấy đủ 63 dòng PASS và không nêu tên ca hỏng**
  Người dùng thấy gì: Khi bộ ca kiểm tra của cổng hỏng, báo cáo có thể không chỉ ra ca nào hỏng, người đọc phải chạy lại từng ca để tìm. Kết quả đỏ hay xanh vẫn đúng, không có lỗi xanh giả.
  Căn cứ: Chỉ làm báo lỗi kém rõ chứ không làm cổng cho qua nhầm, người dùng tự tìm ra ca hỏng bằng cách chạy lại, và ghi chú vào giới hạn đã biết là đủ.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ: E6 hứa thiếu tên nào thì nêu đúng tên đó, nhưng lệnh chỉ báo số đếm**
  Người dùng thấy gì: Khi thiếu một ca kiểm tra, báo cáo chỉ nói số lượng không khớp mà không gọi tên ca bị thiếu. Người đọc vẫn biết là có vấn đề nhưng phải tự dò xem ca nào.
  Căn cứ: Hậu quả nhẹ vì kết quả vẫn đỏ đúng chỗ và không mất dữ liệu, chỉ mất thêm chút công tìm ca thiếu, nên ghi nhận là giới hạn đã biết.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **HA43-do không đo máy đủ công cụ, trái lời khai «mỗi ca -do» và luật đối chứng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một ca kiểm tra về trường hợp máy thiếu node không có phép so sánh với máy đủ công cụ như các ca cùng loại. Người dùng vẫn được chặn đúng, chỉ là bằng chứng ít chặt hơn một chút.
  Căn cứ: Hành vi cho người dùng không sai và thông điệp vẫn được ghim, nên hậu quả nhẹ; có thể bổ sung sau mà không ảnh hưởng ai.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: báo cáo bằng chứng của các ca HA37-HA49 không rút từ khuôn của bên viết (r1 · tệp đã đổi)**
  Người dùng thấy gì: Các ca kiểm tra dùng báo cáo bằng chứng tự gõ tay, nên nếu khuôn báo cáo thật đổi đi thì các ca vẫn xanh dù cổng đọc sai chữ ký. Hiện tại chưa có người dùng nào bị ảnh hưởng.
  Căn cứ: Chưa gây sai lệch nào cho người dùng, chỉ là lưới an toàn có thể lỏng khi khuôn báo cáo đổi sau này; sửa được sau mà không mất dữ liệu.
  file: `tests/scripts/t3-can-ho-so-arm.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
