## Trong hợp đồng

(không có finding nào round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Preflight S0 không --require tool-kill-rule.md — lệch bản acceptance-gate bị bắt muộn ở S4 thay vì S0**
  Người dùng thấy gì: Nếu kho dùng kit đang giữ bản cache cũ chưa có luật xử lý lệnh bị ngắt, việc thiếu bản cập nhật chỉ lộ ra ở gần cuối quy trình thay vì được cảnh báo ngay từ đầu, khiến người dùng mất công làm lại một đoạn dài trước khi phát hiện.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Hai từ vựng run-log cho cùng một sự kiện tool-kill: workflow ghi cannot_run, đường độc lập ghi killed_by_tool**
  Người dùng thấy gì: Khi một lệnh kiểm tra bị hệ thống ngắt giữa chừng, hai đường xử lý khác nhau trong kit ghi lại sự việc này bằng hai tên gọi khác nhau trong nhật ký, có thể gây nhầm lẫn khi người đọc đối chiếu log giữa hai đường.
  file: `skills/acceptance/references/tool-kill-rule.md`
  severity: medium
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ (mục 2: killed_by_tool CẠNH exit_code null)**
  Người dùng thấy gì: Phép kiểm tra tự động cho phần ghi nhật ký của tính năng này lỏng hơn mức nó tự mô tả — một số trường hợp ghi sai định dạng vẫn có thể trót lọt qua mà không bị phát hiện.
  file: `_acceptance/tool-kill-duong-doc-lap/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (W25 JS khong con ban chep: !src.includes(SIGNATURE) không có đối chứng dương trong suite)**
  Người dùng thấy gì: Bài kiểm tra đảm bảo mã nguồn không còn giữ bản sao luật thừa có thể mất khả năng bắt lỗi sau khi hồ sơ này được gộp vào nhánh chính, vì phần kiểm tra nghiêm ngặt nhất hiện đang nằm trong một tệp tạm sẽ bị dọn đi sau đó.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
