# Hạt giống — lệnh giữ tươi ở kho nhiều gói nội bộ quy nhầm lỗi của PR thành «đỏ sẵn trước khoảng»

Gốc: acceptance-gate-kit/_acceptance/ho-so-da-ky-giu-tuoi/ — `review-findings.md` lượt chấm 2, mục Ngoài-6
(tệp `feature-loop/scripts/giu-tuoi.mjs`, severity high). Chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 2026-10-18;
theo luật kho, lối ấy ghi hạt giống này, KHÔNG tạo ô. Ô gốc `_acceptance/ho-so-da-ky-giu-tuoi/` trích lại tệp này ở
`## Notes` của hợp đồng.

## Người dùng gặp gì

Ở kho nhiều gói nội bộ, một thay đổi làm hỏng gói có thể bị ghi nhầm là «đỏ sẵn từ trước», không gọi tên thay đổi gây
lỗi. Về sau các vòng khác gặp đúng lỗi đó được cho đi tiếp như thể lỗi cũ — lỗi thật lọt về phía xanh, im lặng.

## Vì sao không vá trong vòng K-A

Cây tạm của lần chạy lại ở đầu khoảng được nối tới thư mục phụ thuộc của đỉnh (sửa ô duyệt thêm AC-4 lượt 1). Ở kho mà
thư mục ấy chứa mã gói nội bộ (liên kết workspace), lần chạy ở đầu khoảng thật ra chạy mã gói của ĐỈNH — nên lỗi do PR
cũng hiện ở đầu khoảng. Nghiệm cần thiết kế riêng (dựng phụ thuộc theo đúng sha đầu khoảng, hoặc nhận ra liên kết
workspace và từ chối quy) và phải đo trên kho có phụ thuộc thật.

## Ngưỡng mở ô

≥ 1 lần lệnh giữ tươi chạy trên một kho tiêu thụ có gói nội bộ liên kết (workspace) — sau ngày kho ấy cài mốc chứa K-A
— hoặc ≥ 1 dòng nền `nen-do` mang `ket_cuc` «đỏ sẵn trước khoảng» mà người lần ra là do PR trong khoảng.
