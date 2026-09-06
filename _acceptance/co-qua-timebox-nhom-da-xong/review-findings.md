## Trong hợp đồng

(không có finding nào ánh xạ được vào một AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hồ sơ ký ở Cổng 1 khai một hệ quả phụ mà mã không thể sinh ra: mục da-nghiem-thu-* KHÔNG BAO GIỜ mang mien-do-co-nguoi-dung**
  Người dùng thấy gì: Tài liệu bàn giao ghi rằng một số hồ sơ đã nghiệm thu có thể được gắn thêm một dấu hiệu phụ về miền dữ liệu người dùng, nhưng trên thực tế dấu hiệu đó sẽ không bao giờ xuất hiện. Người đọc tài liệu có thể hiểu nhầm là khả năng này đang hoạt động trong khi nó chưa từng chạy.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khoá executor mới chèn giữa khối kvtm_* của hồ sơ khác; comment đầu khối khai «+ changelog» dù không có khoá changelog**
  Người dùng thấy gì: Một mục cấu hình kiểm thử nội bộ mới bị chèn xen vào giữa cấu hình của một tính năng khác, kèm một dòng ghi chú nhắc tới một hạng mục không có thật. Đây là vấn đề tổ chức nội bộ, không ảnh hưởng người dùng cuối, nhưng có thể gây nhầm lẫn cho người bảo trì sau này.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Contract note claims an unreachable side effect (`mien-do-co-nguoi-dung` on `da-nghiem-thu-*`)**
  Người dùng thấy gì: Tài liệu bàn giao mô tả một hiệu ứng phụ mà thực tế hệ thống không thể tạo ra được. Đây thuần là sai lệch giữa tài liệu và hành vi thực tế, không ảnh hưởng tới việc vận hành hay kết quả người dùng nhận được.
  file: `_acceptance/co-qua-timebox-nhom-da-xong/contract.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture uat-session.md VIẾT TAY đúng khuôn bên đọc, không rút từ khuôn writer (UAT-FRONTMATTER-TEMPLATE)**
  Người dùng thấy gì: Một phần dữ liệu dùng để kiểm thử được soạn tay thay vì tạo tự động từ khuôn chuẩn của hệ thống. Nếu khuôn chuẩn đó thay đổi sau này, bài kiểm tra có thể không phát hiện ra sự không khớp, khiến lỗi tương tự lọt qua mà không ai biết.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — E1–E3 ghim chuỗi «park chưa hạn ✗ · archived chưa hạn ✗ · release chưa hạn ✗» nhưng chuỗi ấy là LITERAL cố định trong pass(), không rút từ MA_TRAN/kết quả soi**
  Người dùng thấy gì: Một phần thông báo kết quả kiểm thử được viết cứng thành câu chữ cố định thay vì tính ra từ dữ liệu đang thực sự được kiểm tra. Vì vậy nếu sau này một trường hợp kiểm thử bị bỏ sót, báo cáo vẫn có thể hiển thị như mọi thứ đã được kiểm tra đầy đủ, khiến người xem báo cáo tin nhầm vào mức độ an toàn của bản phát hành.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 2/5 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, _acceptance/co-qua-timebox-nhom-da-xong/contract.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
