---
slug: nen-cay-ban-dong-dau
at: 2026-09-24T10:00:00Z
verdict: findings
p0: 0
p1: 1
p2: 4
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Ca chỉ bắt được lỗi khi dòng đích ĐỨNG ĐẦU danh sách porcelain, mà không ca nào kiểm điều đó; chiều đỏ chỉ là lời khai «đo ở S3» | Fixture có sẵn một dòng xếp trước dòng đích, trim() chạm dòng khác, CB1/CB2 xanh cả trên bản chưa vá — phép đo không phân biệt đọc đúng với chưa gặp lỗi | Ca so đủ porcelain trước lượt và kiểm dòng đầu sau lượt; đột biến đặt lại trim() chạy trong lượt | fixed: mọi ca chụp porcelain thô trước/sau, kiểm bằng nhau tiền điều kiện + dòng đầu; thêm NEN-CB5 đột biến (bản chép chưa tiêm xanh trước) — AC-5, E5 |
| P2 | contract, evals | AC-4 hứa NEN0…NEN9 mà E4 liệt tay thiếu NEN5/6/7/9 | Bản vá làm hỏng NEN5 mà E4 vẫn xanh nếu lệnh lọc theo tên | Lệnh chạy trọn tệp, 0 failed, ghim đủ tên | fixed: AC-4 và E4 đòi tệp ca thoát 0 với 0 FAIL và ghim đủ 13 tên NEN + NEN-TD1…6; lệnh ncb_cay_ban chạy trọn tệp |
| P2 | evals | paths của E2–E4 thiếu duong-nen-fixture.mjs | Sửa fixture sau khi ký không làm bằng chứng E2/E3 hoá cũ | Thêm fixture vào paths | fixed: cả năm eval khai duong-nen-fixture.mjs |
| P2 | contract | Ô xoá tệp ` D` hoãn bằng giả định về cách vá | Bản vá chỉ đặt lại dấu cách cho mã M, ` D` vẫn cụt mà ba ca xanh | Thêm biến thể suite xoá README.md | fixed: NEN-CB4 (xoá) vào AC-1, ` D` lên Core |
| P2 | contract | Triệu chứng thật ở 0c4eb404 không nói sau vá sẽ ra gì — [nen-cong-cu-lenh-shell#F1] | Owner tưởng dòng đỏ ấy là oan, sau vá vẫn đỏ, phải gọi người thêm lượt | Ghi trước kết quả mong đợi sau vá | fixed: Notes ghi — tệp ấy bị sửa THẬT trong lượt (phiên ghi song song), sau vá đọc đúng `_acceptance/config.yaml`, vẫn đỏ; bản vá đổi tên, không xoá dòng |
