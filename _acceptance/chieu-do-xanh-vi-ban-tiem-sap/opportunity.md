---
schema_version: 1
slug: chieu-do-xanh-vi-ban-tiem-sap
feature: Chiều đỏ xanh vì bản tiêm SẬP — assertion âm-tính-một-mình tái sinh ở GL04
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

Ca `GL04` trong `tests/scripts/repin-lane-lop-cu.test.mjs` kết luận «bắt được» từ
việc bản tiêm KHÔNG chạy, chứ không từ việc bản tiêm chạy và cho kết quả khác. Bản
tiêm sập bằng `TypeError` cũng cho đúng màu ấy.

Đây là LỚP mà hiến pháp kit gọi tên: *«Assertion âm-tính-một-mình là assertion
không sống … case không phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy"»*, và
luật ghi rõ phải sửa theo LỚP — quét cả tệp tìm mọi ca cùng hình dạng, đừng chỉ vá
ca bị nêu tên.

**Người trả giá:** mọi vòng dựa vào làn ghim lại. Một lớp bảo vệ tự khai là đang
canh, nhưng phép đo của nó không phân biệt được vật lành với vật hỏng.

**Phát hiện ở:** vòng `cong-nguoi-doc-du-nguon` lượt chấm 8, định đoạt Ngoài-6 tại
Cổng Bằng chứng 13/09/2026.

## Ngả sửa (chưa quyết)

1. Bản tiêm phải qua `node --check` trước khi tin màu của nó, và ca phải ghim ĐÚNG
   THÔNG ĐIỆP mong đợi chứ không chỉ mã thoát — đúng khuôn `banTiem()` mà hồ sơ
   `cong-nguoi-doc-du-nguon` vừa dựng và đã chạy thật.
2. Quét CẢ tệp `repin-lane-lop-cu.test.mjs` tìm mọi ca cùng hình dạng, không chỉ GL04.

Phép đo hai chiều bắt buộc: một bản tiêm SẬP phải làm ca ĐỎ CÓ TÊN («bản tiêm không
qua node --check»), khác hẳn màu của một bản tiêm chạy được và cho kết quả khác.
