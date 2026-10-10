# Phản biện context sạch — spec workflow 2026-10-10

Một tác tử mới chỉ đọc bốn tài liệu: spec workflow, spec ô dù, spec phương pháp 05/10, bản ghi nhu cầu
09/10. Một lượt. Kết quả: 2 P0, 3 P1, 1 P2. Cả sáu đã sửa vào spec trước khi trình chủ kho.

| Sev | Thiếu gì | Đã sửa ở |
|---|---|---|
| P0 | «Đang bàn giao» chỉ ra được nhờ phiên giám sát, mà phiên này cũng cạn hạn mức → đợt kẹt; `tiep-tuc` không nhận vào từ «đang bàn giao»; không có nguồn lời ghi danh khi thiếu `ban-giao.json` | §3 (thêm cạnh), §4.2 bước 6, §4.3 bước 4–5: đồng hồ chờ do bộ phát lịch giữ; lời ghi danh dựng từ trạng thái sống |
| P0 | Phiên sống đo bằng `list_sessions` (tách theo tài khoản) → hai thợ cùng một worktree, hai S4 chồng; luật S4 mâu thuẫn với «nhả khoá trước khi xong» | §5.1 nhịp sống qua hook; §4.2 bước 5; §4.3 bước 3 và luật S4; DP0 câu 5 |
| P1 | Mức dùng chỉ đọc khi giám sát thức (vòng tròn); số của tài khoản cũ kích hoạt bàn giao lại sau khi đổi | §4.5: phiên ngắn của lịch cũng đọc; bỏ số cũ và số trước lần nhận vai; `tiep-tuc` đọc trước khi chạy lại; đường lùi khi DP0 xấu |
| P1 | Sau khi app sập, thợ còn sống mất lệnh nền chờ khoá → khoá trống mãi | §4.2 bước 5 (nhắn giăng lại lệnh chờ), §5.1 (khoá cấp mà không có nhịp → `can_phan`) |
| P1 | `ban-giao.json` một tệp, không đánh dấu đã dùng → lần sập sau nối sai hàng; cờ «không đếm trần» dễ thành tự dối | §4.2 bước 6 (lưu lịch sử), §4.3 luật S4 (kit đếm lượt từ sổ chạy, không từ tệp bàn giao) |
| P2 | Bảng đếm chạm thấp hơn số bước thật | §7 viết lại: tách duyệt của app; «chờ hay đổi» do máy tự quyết theo chính sách đã duyệt |
