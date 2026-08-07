## Trong hợp đồng

Không có finding nào ánh xạ được vào AC trong lần review này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Luật pin-phantom mới làm đỏ chính cổng CI của kit: 29 hồ sơ _acceptance/ ghim commit không tồn tại, diff không re-pin**
  Người dùng thấy gì: Lần chạy kiểm tra tự động (CI) kế tiếp của kho mã sẽ báo lỗi và chặn việc gộp mã mới, vì gần 30 hồ sơ nghiệm thu cũ đang tham chiếu tới một bản ghi lịch sử không còn tồn tại. Cần một đợt cập nhật riêng cho các hồ sơ đó trước khi có thể tiếp tục gộp mã.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **PM17 nuốt lỗi cp lib — case có thể xanh mà không còn đo khối đè**
  Người dùng thấy gì: Trong một tình huống hiếm (thư mục thư viện liên quan bị đổi chỗ hoặc thiếu), một bài kiểm tra tự động có thể báo 'đạt' trong khi thực ra không còn kiểm tra đúng phần quan trọng nhất của nó, khiến lỗi thật có nguy cơ lọt qua mà không ai nhận ra.
  file: `tests/scripts/run-tests.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (scripts/pre-merge-check.sh, tests/scripts/run-tests.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
