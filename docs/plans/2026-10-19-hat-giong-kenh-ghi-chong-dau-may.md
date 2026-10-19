# Hạt giống — đồng bộ kênh liên máy ghi đè dấu «đã đến» / «chấp nhận» mà phiên vừa ghi

Gốc: acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/ — `review-findings.md` lượt chấm 2, mục Ngoài-4 và Ngoài-9
(tệp `dieu-phoi/scripts/tin-kenh.mjs`, severity medium và low, cùng một gốc). Chủ kho chọn «mở hợp đồng mới» ở Cổng
Bằng chứng 2026-10-19; theo luật kho, lối ấy ghi hạt giống này, KHÔNG tạo ô. Ô gốc `_acceptance/vong-mo-co-chu-giu/`
trích lại tệp này ở `## Notes` của hợp đồng.

## Người dùng gặp gì

Khi bộ canh nền (`tin canh --cho`) đang đồng bộ kênh mà phiên cùng lúc ghi nhận «đã đến», «chấp nhận» hay «kết lượt khi
chưa nhận», dấu ấy có thể bị xoá. Vòng việc kẹt ở bước chờ người giao chấp nhận dù họ đã nghe, sổ báo vòng còn mở, và
người dùng không tự gỡ được.

## Vì sao không vá trong vòng GT1

Lần đồng bộ đọc trạng thái kênh, chờ mạng tới 15 giây, rồi ghi đè trọn tệp; hook ghi dấu máy vào cùng tệp bằng
đọc-sửa-ghi. Nghiệm cần một cơ chế chống ghi đè (dấu máy ghi chỉ-thêm vào tệp riêng như nơi chứa của đợt, hoặc gộp lại
phần dấu máy ngay trước lần ghi) và một phép đo hai bên ghi cùng lúc — phạm vi đã duyệt chỉ đo tuần tự.

## Ngưỡng mở ô

≥ 1 vòng trên kênh thật kẹt ở «chờ chấp nhận» sau khi người giao đã thấy lời xong, hoặc ≥ 1 máy chạy `tin canh --cho`
thường trực trên một kho tiêu thụ đã cài mốc chứa GT1.
