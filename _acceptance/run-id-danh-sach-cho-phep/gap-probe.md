---
slug: run-id-danh-sach-cho-phep
at: 2026-10-31T16:05:00Z
verdict: findings
p0: 1
p1: 1
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ bỏ quét độ phủ khẳng định đã kê đủ ô, nhưng ma trận 12 mã rác không có ca nào canh riêng vế độ dài dưới, vế ký tự đầu, vế độ dài trên — mã ngắn duy nhất (`abc`) vốn đã bị chặn vì không có chữ số [kiem-ban-cai-loi-sua-chay-duoc#F2] | Bản vá nới `{3,199}` thành `{0,199}` hoặc bỏ neo ký tự đầu thì sáu ca vẫn xanh trong khi `L08`, `-12ab` lọt vào sổ rồi được mang sang | Thêm `L08`, `-12ab`, mã 201 ký tự vào ma trận AC-1/AC-2 cùng số assert; hai đột biến cô lập mỗi vế phải đỏ | fixed: ma trận thêm `L08` `-12ab` `_ab12` mã-201 (16 mã rác) và mã-200 làm biên dương (9 mã hợp lệ); RH1-do thêm ba đột biến cô lập trên khối (độ dài dưới, ký tự đầu, độ dài trên), mỗi cái giữ đúng mã vế ấy chặn; dòng sổ bỏ quét thay bằng dòng mới |
| P1 | design | Cân trên mọi kho mới đo trên run-log của kit, chưa đo trên sổ của các kho sẽ nhận 2.36.2; chưa nói lớp đối chiếu báo cáo↔sổ ra sao khi sổ ghi mã đúc mà đầu ra lệnh có mã thật | Kho có công cụ in mã chỉ toàn chữ hay có `/`: sổ ghi `minted-…`, tác tử tổng hợp chép mã thật vào báo cáo, lớp đối chiếu đổi phán quyết ở kho nhận | Đếm số dòng không đạt luật trên run-log các kho tiêu thụ; khác 0 thì ca có sổ mã đúc + đầu ra mã thật | fixed: đo 31/10 — crm 296/14 431 (58 chỉ thiếu chữ số, phần lớn mã 12 chữ thường phiên crm khai; còn lại chuỗi mô tả, danh sách, nháy, dấu huyền), onehub-invest 16/2 793 (mã có khoảng trắng), onehub-quy-hang 0/710 — ghi vào Coverage, Notes và sổ. Phán quyết không đổi: báo cáo chép mã từ bản đồ bộ chấm truyền xuống (cùng mã với sổ), không từ đầu ra lệnh; mất liên kết tới mã công cụ là giới hạn đã khai |
| P2 | evals | E3 đọc lại mã trên dòng `run_id: <mã>` tự dựng, không rút từ khuôn báo cáo bên viết thật | Báo cáo thật bọc mã trong dấu huyền hay bảng, bộ đọc cắt lệch, RH3 vẫn xanh | Rút dòng từ khuôn báo cáo có marker rồi mới đọc; đột biến khuôn chứng chiều đỏ | fixed: RH3 chép mã vào khối rút từ marker SUITE-BLOCK-TEMPLATE của khuôn báo cáo; đột biến bọc `{run_id}` trong dấu huyền đọc ra mã kèm dấu (lệch) |
