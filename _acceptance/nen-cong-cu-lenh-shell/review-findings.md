## Trong hợp đồng

[]

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chân cong_cu bỏ tra nhưng vẫn khai «xanh» trong duong-nen.md — lệch nếp bo-qua của chân luoi/engine**
  Người dùng thấy gì: Khi mọi lệnh cấu hình trong một dự án dùng biến môi trường để dựng đường dẫn, công cụ có thể báo trạng thái 'ổn' dù chưa thực sự kiểm tra được công cụ nào — người duyệt cần biết đây là giới hạn đã biết, không phải bằng chứng đầy đủ.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: high
  Đề xuất: known-limits

- **Vị từ tenChuongTrinh bỏ sót tilde — cùng lớp báo động giả vẫn còn theo chính thước POSIX §2.6 hợp đồng viện dẫn**
  Người dùng thấy gì: Một lệnh dùng dấu ngã (~) để trỏ tới thư mục cá nhân vẫn có thể bị báo thiếu công cụ dù công cụ đó thực sự có trên máy.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: medium
  Đề xuất: known-limits

- **E8 khai sai về chi phí chạy: răng hồi quy CÓ thêm một lượt chạy trọn tệp ca**
  Người dùng thấy gì: Một ghi chú nội bộ về chi phí kiểm thử không khớp với thực tế; điều này không ảnh hưởng tới tính năng người dùng thấy, chỉ có thể làm số liệu chi phí máy trong hồ sơ nội bộ bị lệch.
  file: `_acceptance/nen-cong-cu-lenh-shell/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Răng KH2 kết luận «đỏ» chỉ từ exit≠0 — bước tiêm hỏng vẫn cho màu xanh**
  Người dùng thấy gì: Một phép kiểm tra tự động cho quy tắc mới có thể báo 'đạt' ngay cả khi bước giả lập lỗi bị hỏng và chưa từng thực sự chạy — nghĩa là kết quả 'đạt' đó có thể không đáng tin như báo cáo thể hiện.
  file: `_acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh`
  severity: high
  Đề xuất: new-contract

- **E8 khai «không thêm lượt chạy nào cho cùng tệp ca» — răng hồi quy tự chạy lại trọn tệp ca**
  Người dùng thấy gì: Một ghi chú nội bộ về chi phí kiểm thử không khớp với thực tế; không ảnh hưởng tính năng người dùng, chỉ có thể làm số liệu chi phí máy trong hồ sơ nội bộ bị lệch.
  file: `_acceptance/nen-cong-cu-lenh-shell/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: KH2 kết luận từ «exit khác 0», vứt thông điệp — bước gỡ-vế hỏng vẫn cho XANH (đã tái lập)**
  Người dùng thấy gì: Một phép kiểm tra tự động cho quy tắc mới có thể báo 'đạt' ngay cả khi bước giả lập lỗi bị hỏng và chưa từng thực sự chạy — nghĩa là kết quả 'đạt' đó có thể không đáng tin như báo cáo thể hiện.
  file: `_acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh`
  severity: high
  Đề xuất: new-contract

- **Ma trận thiếu toàn phần: lớp «ĐỦ hai vế» chỉ có MỘT bản đột biến gỡ cả hai — nhánh return 5 («stderr») không lần nào được chạy đỏ**
  Người dùng thấy gì: Một nhánh của quy tắc mới (thông báo qua kênh lỗi khi bỏ qua) hiện không có phép kiểm tra nào bảo đảm nó không âm thầm hỏng trong tương lai.
  file: `_acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh`
  severity: medium
  Đề xuất: new-contract

- **Đối chứng dương của NEN-TD5 chạy trên BẢN CHÉP KHÁC với bản bị tiêm — trái đúng lời chính ca và E6 khai «HAI lượt trên CÙNG một bản chép»**
  Người dùng thấy gì: Một phép kiểm chứng nội bộ dùng để loại trừ báo lỗi giả không so sánh đúng hai lượt trên cùng một bản sao, nên hiện tại thiên về báo lỗi oan hơn là bỏ sót lỗi thật — rủi ro thực tế thấp.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Chiều xanh của NEN-TD6 kết luận từ «0 bullet» mà không kiểm lượt chạy có ra tệp/chân xanh — vắng đối chứng cùng lượt**
  Người dùng thấy gì: Một phép kiểm nội bộ cho bản vá có thể báo 'đã sửa xong' ngay cả khi lượt chạy thử không sinh ra kết quả nào để so sánh, thay vì thực sự xác nhận bản vá hoạt động.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

[]

⚠ Cụm ngoài vùng phủ: 5/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nen-cong-cu-lenh-shell/evals.yaml, _acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
