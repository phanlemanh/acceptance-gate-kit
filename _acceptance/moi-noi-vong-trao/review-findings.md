## Trong hợp đồng

(none)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Artifact máy-đọc mới (stranger-drive.md / «nhật-ký-vấp») + term «Vòng TRAO», «Lái-thử Người-lạ» vào SKILL.md engine mà CONTEXT.md không có entry**
  Người dùng thấy gì: Thuật ngữ mới trong tài liệu vận hành (nhật-ký-vấp, Vòng TRAO, Lái-thử Người-lạ) chưa được ghi vào từ điển chuẩn của kit, có thể khiến tài liệu sau này dùng tên khác nhau cho cùng một khái niệm và gây nhầm lẫn khi tra cứu.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **S5 feature-loop trỏ «docs/lai-thu-nguoi-la.md của kit» — đường dẫn không giải được từ plugin feature-loop ở repo tiêu thụ**
  Người dùng thấy gì: Dòng hướng dẫn bàn giao có thể trỏ tới một tài liệu không tồn tại trong các dự án dùng kit, khiến người đọc tìm theo đường dẫn đó mà không thấy gì.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Thẻ Cổng Phạm vi coi khuôn chưa điền («…») là ngưỡng đã khai — không cờ vàng**
  Người dùng thấy gì: Nếu người dùng sao chép nguyên khuôn ngưỡng nghiệm thu mà chưa điền số liệu thật, thẻ vẫn hiển thị như đã khai đầy đủ thay vì cảnh báo, khiến quyết định có thể dựa trên một ngưỡng chưa có thật.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **chk_uat: bullet «File vắng» tràn qua hết §1 — quan hệ nhánh→kết cục lỏng hơn lời hứa**
  Người dùng thấy gì: Đây là công cụ kiểm tra nội bộ dùng để xác nhận tính năng, không phải phần người dùng cuối thấy hay thao tác; rủi ro chỉ là các lần kiểm sau này có thể kém chính xác nếu nội dung liên quan bị dịch chuyển vị trí.
  file: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture tĩnh, không round-trip trong lần chạy) — transcript-E4/E5 là bài làm ĐÓNG BĂNG, judge chấm lại vẫn PASS dù SKILL đổi**
  Người dùng thấy gì: Hai bài chấm dùng để xác nhận tính năng bàn giao sang phiên nghiệm thu và đọc nhật-ký-vấp là văn bản cố định, có thể tiếp tục báo đạt dù hành vi thật sau này thay đổi, khiến người quyết định tin nhầm rằng tính năng vẫn đúng như kỳ vọng.
  file: `_acceptance/moi-noi-vong-trao/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert 'một trong hai chuỗi có mặt' trong khi lời hứa là QUAN HỆ trạng thái→cờ) — has_flag gộp cờ «chưa khai ngưỡng» với cờ «không đọc được» cho ô rỗng/thiếu**
  Người dùng thấy gì: Bài kiểm cảnh báo 'chưa khai ngưỡng' có thể vẫn báo đạt dù thẻ hiển thị nhầm sang cảnh báo khác, khiến việc xác nhận tính năng kém tin cậy hơn mức đã công bố.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).