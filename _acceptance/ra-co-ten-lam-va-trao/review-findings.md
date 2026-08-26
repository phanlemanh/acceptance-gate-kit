## Trong hợp đồng

Không có finding nào ánh xạ được vào AC (rỗng).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Cut-code preservation patch already fails to apply — and no base SHA is recorded**
  Người dùng thấy gì: Nếu sau này cần khôi phục lại phần công việc Cổng Đáng đã được tách riêng, bản lưu hiện tại có thể không dùng lại được ngay, khiến một phần việc đã làm xong trước đó phải làm lại thủ công.
  file: `_acceptance/cong-dang-co-cua/discovery/phan-cong-dang.patch`
  severity: high
  Đề xuất: new-contract

- **start-scan emits `groups.considering[].flags` but commands/start.md never teaches printing them**
  Người dùng thấy gì: Khi xem mục 'đang cân nhắc', người dùng có thể không thấy được cảnh báo quá hạn cho đúng ý cần chú ý nhất, dù dữ liệu quá hạn đã được tính sẵn.
  file: `commands/start.md`
  severity: medium
  Đề xuất: known-limits

- **Committed evidence-report describes a tree that no longer exists (verified_commit 8 commits behind, verdict BLOCKED)**
  Người dùng thấy gì: Báo cáo bằng chứng đính kèm mô tả một phiên bản sản phẩm đã cũ hơn hiện tại, nên người đọc báo cáo có thể tin nhầm rằng các kiểm tra gần nhất đã chạy trên bản mới nhất.
  file: `_acceptance/ra-co-ten-lam-va-trao/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **product-map bỏ qua chốt «lời khai machine-cleared phải có vật» khi có verdict phiên nghiệm thu — bản đồ xanh trong khi bộ quét gọi HỎNG**
  Người dùng thấy gì: Một số hồ sơ được máy tự thông qua dù bằng chứng chưa đạt yêu cầu có thể hiện trên bản đồ tổng quan như thể đã hoàn tất và sẵn sàng, khiến người quyết định hiểu nhầm mức độ sẵn sàng thật sự.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thẻ Cổng Phạm vi vẫn gọi ngưỡng `chua-chot` là «đã khai ở Cổng Đáng», và không bật cờ nào — đúng ca mà chú thích ngay trên nói là đang sửa**
  Người dùng thấy gì: Thẻ tổng hợp có thể hiển thị ngưỡng nghiệm thu là 'đã khai xong' ngay cả khi người phụ trách chưa thực sự điền đủ, khiến người xem thẻ tưởng bước này đã hoàn tất trong khi chưa.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **gate-card --extract nuốt trạng thái «răng chống lách KHÔNG chạy được»: JSON trả mien_do_co_nguoi_dung=false như thể đã kiểm và sạch**
  Người dùng thấy gì: Khi công cụ kiểm tra nội bộ thiếu tài liệu cần thiết để chạy, hệ thống có thể báo 'không có vấn đề gì' thay vì báo rằng phép kiểm tra đó chưa chạy được, khiến người xem yên tâm nhầm.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Bản base cho ca so-sánh đọc-cũ dựng bằng DANH SÁCH FILE CHÉP TAY (RT13-ii)**
  Người dùng thấy gì: Nếu quy trình sản phẩm sau này thêm một tệp phụ thuộc mới, phần kiểm thử so sánh với bản cũ có thể báo lỗi hạ tầng chung chung thay vì cho ra kết quả so sánh thật, làm tốn thời gian tìm sai nguyên nhân.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **E4 khai phép đo mà THÂN CA RT4 không có (lời khai không có vật)**
  Người dùng thấy gì: Một phần kịch bản kiểm thử được coi là đã xác nhận rằng 'hồ sơ có bằng chứng lỗi luôn bị xếp đúng nhóm cảnh báo', nhưng thực ra chưa có ca kiểm thử nào chạy đúng tình huống đó, nên một lỗi liên quan có thể lọt qua mà không ai phát hiện.
  file: `_acceptance/ra-co-ten-lam-va-trao/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ vị trí (term CONTEXT.md phải nằm trong mục Gates & verbs)**
  Người dùng thấy gì: Định nghĩa thuật ngữ trong tài liệu nội bộ có thể bị dời sang mục khác trong tương lai mà không phép kiểm thử nào phát hiện, dù yêu cầu ban đầu là thuật ngữ đó phải nằm đúng mục quy định.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/cong-dang-co-cua/discovery/phan-cong-dang.patch, _acceptance/ra-co-ten-lam-va-trao/evidence-report.md, _acceptance/ra-co-ten-lam-va-trao/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.