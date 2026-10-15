# Hạt giống — cờ giả «hồ sơ trỏ hàng không có» sau khi máy tự áp

Gốc: kit/_acceptance/ap-chinh-sach-lo-trinh/ — mục Ngoài-11 ở Cổng Bằng chứng 15/10, chủ kho chọn «mở hợp đồng mới».

**Chuyện gì xảy ra:** máy tự áp «chờ điều kiện» (luật xếp lại) hay «bác» (luật hồ sơ đã bác) cho một hàng ĐÃ CÓ hồ sơ nhận
nó qua `lo_trinh_ma`. Hàng rời `hang` sang `chan_troi` hoặc `da_bac`, nên bộ đọc sinh cờ «hồ sơ X ghi lo_trinh_ma A — không
có hàng A». Kế hoạch hiện một cờ lỗi giả sau mỗi lần máy dời như thế, dù không có gì sai.

**Vì sao không sửa trong RM2:** sửa cần đổi cách bộ đọc nối hồ sơ với hàng (tìm cả trong `chan_troi` và `da_bac`). Việc này
chạm phân tích trạng thái, ngoài phạm vi đã duyệt của RM2.

**Ứng viên hướng sửa (chưa quyết):** bộ đọc coi mã nằm trong `chan_troi` hoặc `da_bac` là một hàng có thật cho phép nối hồ
sơ — không nổi cờ «không có hàng», trạng thái hiện theo khối đích.
