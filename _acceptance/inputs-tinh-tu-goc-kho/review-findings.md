## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Lưới thường trực mới không dọn thư mục tạm — khác nếp file anh em cùng thư mục**
  Người dùng thấy gì: Mỗi lần chạy nhóm kiểm tra để lại một thư mục tạm không được dọn dẹp, khiến ổ đĩa máy chạy kiểm tra tích tụ rác theo thời gian.
  file: `tests/scripts/s4-args-judgment-inputs.test.mjs:26`
  severity: low
  Đề xuất: known-limits

- **Từ mới «dossier» cho `_acceptance/{slug}/` không có mục trong CONTEXT.md; cùng file đang dùng «workspace»**
  Người dùng thấy gì: Tài liệu hướng dẫn dùng hai tên khác nhau cho cùng một khái niệm, có thể khiến người viết eval mới hiểu nhầm.
  file: `skills/acceptance/SKILL.md:127`
  severity: low
  Đề xuất: known-limits

- **Judgment inputs that ui-check produces in the same round can never pass s4-args — the documented canonical example now exits 2 on round 1**
  Người dùng thấy gì: Khi hội đồng cần chấm một ảnh chụp màn hình vừa được tạo trong cùng vòng kiểm tra, bước chuẩn bị sẽ báo lỗi ngay và toàn bộ vòng kiểm tra dừng lại, không chấm được.
  file: `feature-loop/scripts/s4-args.mjs:139`
  severity: high
  Đề xuất: new-contract

- **`existsSync` accepts a directory, so a directory in `inputs` still produces an args file the judge cannot read**
  Người dùng thấy gì: Nếu người viết eval trỏ input vào một thư mục thay vì một file, hệ thống vẫn chấp nhận và tạo hồ sơ chấm, nhưng hội đồng sẽ không đọc được nội dung khi chấm.
  file: `feature-loop/scripts/s4-args.mjs:139`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — E7 tuyên quét LỚP (3 tiền tố × 2 cú pháp) nhưng đối chứng dương chỉ một ô, và ô KHÔNG phải cú pháp mà tài liệu thật đang dùng**
  Người dùng thấy gì: Phép kiểm tra bảo vệ quy tắc viết `inputs` mới chỉ chắc chắn bắt được một trong nhiều cách viết sai; cách viết mà tài liệu thật đang dùng chưa được xác nhận là được bắt lỗi đúng.
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:152`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ô «kiểu cũ mà không có ở đâu» được contract giao cho JI2 nhưng JI2 chưa từng cấp đường dẫn kiểu cũ; vế «không gợi ý» không có assert**
  Người dùng thấy gì: Một trong các trường hợp đường dẫn cũ hiếm gặp chưa có phép kiểm tra xác nhận thông điệp báo lỗi đúng như cam kết.
  file: `tests/scripts/s4-args-judgment-inputs.test.mjs:86`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
