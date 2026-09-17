## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **duong-nen: dirty-tree and suite checks run while S1 writes files in parallel, so the loop's own files are reported as infrastructure red (r1)**
  Người dùng thấy gì: Khi bước đầu tiên của vòng chạy nền trong lúc người vẫn đang soạn hồ sơ thiết kế và hợp đồng, hệ thống có thể báo nhầm là có lỗi hạ tầng chỉ vì các tệp đang được soạn dở, khiến người bị hỏi thêm những câu không cần thiết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: medium
  Đề xuất: known-limits

- **duong-nen: the kit repo is never detected as self-hosted with SKILL's command, so the engine check compares the worktree with the plugin cache (r1)**
  Người dùng thấy gì: Khi dùng đúng theo cách gọi mặc định trong tài liệu hướng dẫn, việc kiểm tra hạ tầng ngay trong kho của kit có thể báo nhầm là engine không khớp phiên bản dù thực tế không có gì sai, khiến người bị hỏi thêm một câu không cần thiết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình 5 (tuyên quét ma trận mà các ô không độc lập): chiều đỏ của DN3-IM ở ô 2 và ô 3 là đỏ do dư của ô trước (r1)**
  Người dùng thấy gì: Bài kiểm để đảm bảo máy không bỏ sót thay đổi định nghĩa phép đo có lỗ hổng khiến một phần phép thử không thực sự chứng minh điều nó tuyên bố — khó biết chắc hành vi bỏ-qua có đúng ở mọi trường hợp hay chỉ đúng nhờ trùng hợp.
  file: `tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình 3 (lời hứa là quan hệ từng ô, nhưng fixture cho các giá trị trùng nhau): GT1 không phân biệt được dòng đếm bị đặt nhầm ô (r1)**
  Người dùng thấy gì: Bài kiểm cho thẻ hiển thị số liệu vật/thước có thể vẫn báo xanh ngay cả khi các con số bị hiển thị nhầm cột, vì các giá trị mẫu dùng để kiểm trùng nhau.
  file: `tests/scripts/gate-card-thuoc-vat.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình 3 (round-trip với giá trị trùng): GN4/GN1 không phát hiện được thẻ đọc nhầm chân nền (r1)**
  Người dùng thấy gì: Bài kiểm cho thẻ hiển thị trạng thái hạ tầng có thể vẫn báo xanh ngay cả khi thẻ đọc nhầm giá trị giữa các mục, vì mẫu kiểm dùng giá trị trùng nhau và không kiểm đủ phần hiển thị.
  file: `tests/scripts/gate-card-duong-nen.test.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).