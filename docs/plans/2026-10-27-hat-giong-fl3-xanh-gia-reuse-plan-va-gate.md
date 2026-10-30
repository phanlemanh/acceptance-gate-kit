# Hạt giống — ba chỗ xanh giả còn lại của lệnh chấm thiết kế sau FL3 (design-floor)

**Ngày:** 2026-10-27 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Quyết:** chủ kho chọn «mở hợp đồng mới» cho
Ngoài-2, Ngoài-6, Ngoài-7, Ngoài-8 ở Cổng Bằng chứng của hồ sơ `_acceptance/design-floor-ban-va-b-c-d/` (sổ quyết
định, các dòng `stage: gate2` mang `decision: "Ngoài-<n>: mở hợp đồng mới"`).
Gốc: `_acceptance/design-floor-ban-va-b-c-d/` — bốn mục rà soát của lượt chấm S4 #1 (một mục mức nặng).

Ba chỗ bản gói `design-floor/dist/ui.mjs` còn báo đạt khi lẽ ra không được, đều đã chạy thử trên bản gói:

1. **Kiểm kế hoạch dùng lại đọc mẫu ở thư mục đang đứng** (Ngoài-2, Ngoài-7 trùng). `reuse-plan check` vẫn nạp
   `<cwd>/design/patterns/*.md` vào bảng tên mẫu dù bản vá C đã bỏ tự dò; cùng kế hoạch, cùng `--file`/`--tokens`, thêm
   một tệp mẫu vào thư mục chạy đổi mã thoát 2 → 0. FL4/FL5 chạy lệnh ở gốc kho tiêu thụ, nơi thư mục mẫu gần như luôn
   có mặt. DF-02 không bắt vì mồi chỉ đặt ở thư mục cha.
2. **Đường tệp token gõ sai vẫn đạt** (Ngoài-6, mức nặng). `reuse-plan check` chỉ kiểm cờ `--tokens` có mặt, không
   kiểm tệp tồn tại: đường sai thoát 0 thay vì 3.
3. **Cổng tổng đạt cho trang không có khai báo CSS nào** (Ngoài-8). `gate` thoát 0 với độ phủ token rỗng 100 %, trong
   khi `token-coverage` trên cùng trang thoát 5.

Hướng sửa: một bản vá cục bộ E trong sổ `design-floor/LOCAL-PATCHES.md`, mỗi chỗ một phép đo hai chiều trong
`tests/design-floor/hop-dong.mjs` (đối chứng dương: thư mục chạy sạch / tệp token có thật / trang có CSS).

**Mở thành ô khi:** trước khi FL4 hoặc FL5 nối `reuse-plan check` hay `gate` vào một bước của vòng làm việc, hoặc chủ
kho gọi tên.
