# Review findings: thuoc-biet-truoc-khong-phan-duoc (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 — RT13 (iii-b) tuyên cờ quá hạn «cắt ngang mọi ô» nhưng ma trận vẫn gõ tay từng lối; lối da-giao qua nhánh verified vẫn thiếu cờ**
  Người dùng thấy gì: Một hồ sơ đã được ký nhận xong nhưng quá hạn theo dõi có thể không hiện cờ cảnh báo quá hạn trên bảng trạng thái. Chỉ lộ ra khi gặp đúng một hồ sơ thật rơi vào lối đó; không ảnh hưởng tới việc chặn câu hỏi không trả lời được của hội đồng chấm.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **E5's paths miss most of the files its one-source check scans, so carry-forward can keep an old PASS after the pattern is copied elsewhere (r1)**
  Người dùng thấy gì: Nếu sau này ai đó chép bộ dò sang một tệp khác trong lúc sửa lỗi, kết quả «đạt» của lần chấm trước có thể được giữ nguyên mà không chạy lại, nên bản sao đó có thể lọt mà vẫn hiện màu xanh. Hôm nay chưa có bản sao nào; rủi ro chỉ xuất hiện ở các vòng sửa tương lai.
  file: `_acceptance/thuoc-biet-truoc-khong-phan-duoc/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (+3): JI12 tuyên «khuôn bộ dò chỉ ở MỘT module» (cả lớp bản sao) nhưng chỉ dò MỘT chuỗi nguyên văn cho mỗi khuôn (r1)**
  Người dùng thấy gì: Kiểm tra «bộ dò chỉ có một nguồn» chỉ phát hiện được bản sao chép y nguyên chữ; một bản sao viết lại khác chữ hoặc thiếu một nhánh sẽ không bị báo. Hiện chưa có bản sao nào, nên người dùng chưa bị ảnh hưởng, nhưng sự bảo đảm «một nguồn» yếu hơn lời tuyên bố.
  file: `tests/scripts/s4-args-judgment-inputs.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: ở các chân chiều đỏ của rang.sh, dòng ghim cũng hiện ra khi bản sao hỏng vì hạ tầng — bản sao chưa tiêm chưa bao giờ chạy xanh (r1)**
  Người dùng thấy gì: Nếu bản sao dùng để thử đột biến bị hỏng vì lý do môi trường, bài thử vẫn có thể báo «đã bắt được lỗi» dù thực ra chưa thử đúng. Xác suất thấp và chỉ làm giảm độ tin của một kiểm tra phụ, không đổi hành vi sản phẩm.
  file: `_acceptance/thuoc-biet-truoc-khong-phan-duoc/rang.sh`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
