## Trong hợp đồng



## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Eval-lane rule now has no đường-đọc-cũ and no diff scope — kit's own CI is red with 49 violations on every run, and every consumer repo vendoring this pre-merge blocks every PR until all signed records are re-pinned; CLAUDE.md invariants not amended**
  Người dùng thấy gì: Mỗi lần merge, hệ thống kiểm tra tự động (CI) có thể báo đỏ vì một số hồ sơ cũ chưa được cập nhật lại theo mốc mới nhất. Đây là giới hạn đã biết, được ghi nhận và không được khắc phục trong bản này — sẽ cần một chiến dịch cập nhật riêng ở mốc phát hành kế tiếp.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: known-limits

- **khong-can-nguoi.mjs --write builds an on-disk write path from an unvalidated --slug; existing CLI pattern (gate-card.js) validates slug shape**
  Người dùng thấy gì: Công cụ ghi 'đã dọn xong' bằng dòng lệnh không kiểm tra kỹ tên hồ sơ nhập vào, nên về lý thuyết có thể ghi nhầm ra ngoài đúng thư mục nếu ai đó gõ sai tên cố ý. Rủi ro thấp vì chỉ người vận hành nội bộ chạy lệnh này; đây là giới hạn đã biết, chưa khắc phục trong bản này.
  file: `scripts/khong-can-nguoi.mjs`
  severity: medium
  Đề xuất: known-limits

- **Sau khi ghi da-veto, MỌI lần ghi lại contract machine-cleared đều bị hook chặn với lý do sai**
  Người dùng thấy gì: Sau khi một người đã bấm 'từ chối' (veto) một hồ sơ, các lần sửa/ghi chú tiếp theo trên chính hồ sơ đó có thể bị hệ thống chặn nhầm với thông báo sai lý do (nói 'chưa được duyệt' dù thực ra đã có quyết định veto). Người dùng cần đổi trạng thái hồ sơ về bản nháp hoặc điền người duyệt để ghi tiếp được — đây là giới hạn đã biết trong bản này.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — su-lieu đo bản base bằng ref trôi origin/main, không phải mốc cố định; sau merge phép so tự hoá rỗng**
  Người dùng thấy gì: Một bài kiểm tra tự động đo lại bằng chứng có thể luôn báo 'đạt' sau khi nhánh này được gộp vào chính, vì nó so sánh với phiên bản mới nhất thay vì một mốc cố định trong lịch sử — nghĩa là phần này của bộ tự kiểm sẽ không tự phát hiện lỗi mới phát sinh sau đó. Đây là giới hạn đã biết, chưa khắc phục trong bản này.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — ô (6) ket-ghi «thiếu cờ → exit 3» chỉ ghim mã thoát, không ghim thông điệp**
  Người dùng thấy gì: Một bài kiểm thử nội bộ chỉ kiểm tra mã lỗi trả về mà chưa kiểm tra đúng nội dung thông báo lỗi, nên nếu công cụ sau này đổi sang báo lỗi khác nhưng tình cờ trùng mã, bài kiểm thử vẫn báo đạt nhầm. Không ảnh hưởng người dùng cuối — chỉ là lỗ hổng nhỏ trong khâu tự kiểm tra, ghi nhận là giới hạn đã biết.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).