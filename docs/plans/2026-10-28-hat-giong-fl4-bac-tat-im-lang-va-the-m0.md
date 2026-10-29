# Hạt giống — lệnh bậc design-floor tắt hay nâng bậc im lặng, và ca THE-M0 đỏ oan sau FL4

**Ngày:** 2026-10-28 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Quyết:** chủ kho chọn «mở hợp đồng mới» cho
Ngoài-1, Ngoài-3, Ngoài-16, Ngoài-17, Ngoài-18 ở Cổng Bằng chứng của hồ sơ `_acceptance/design-floor-moc-s0-s1/` (sổ
quyết định, các dòng `stage: gate2` mang `decision: "Ngoài-<n>: mở hợp đồng mới"`).
Gốc: `_acceptance/design-floor-moc-s0-s1/` — năm mục rà soát của lượt chấm S4 #1 và #3 (một mục mức nặng).

Hai nhóm, đều đã chạy thử trên vật của FL4:

1. **Lệnh bậc đọc sai trạng thái của kho mà không báo** (`scripts/design-floor-bac.mjs`).
   - *Nuốt lỗi liệt kê tệp* (Ngoài-3). `git ls-files` chạy với bộ đệm mặc định 1 MiB và mọi lỗi bị nuốt thành danh
     sách rỗng: kho lớn (một kho tiêu thụ đã sát ngưỡng) đọc ra M0 với lý do «không khớp tệp nào» — sai cả bậc lẫn lý do.
   - *Đường dẫn có dấu* (Ngoài-18). Chạy không có `-z` nên git đặt đường dẫn có ký tự ngoài ASCII trong ngoặc kép
     kèm mã thoát; mẫu `design.surface_globs` không bao giờ khớp, kho có thư mục giao diện tên tiếng Việt đọc ra M0.
   - *Niêm phong rỗng* (Ngoài-17). `design_floor.niem_phong: null` hay `~` đọc thành chuỗi khác rỗng nên kho nhảy
     lên M3 dù chưa ai niêm phong — từ FL5, M3 nghĩa là mọi kiểm đều chặn.

   Hướng sửa: `ls-files -z` với bộ đệm đủ lớn; lỗi git thành lý do riêng («không đọc được danh sách tệp»), không
   gộp vào M0; giá trị rỗng kiểu YAML (`null`, `~`, `""`) coi như chưa khai. Mỗi chỗ một ca hai chiều trong
   `tests/design-floor/moc-s0-s1.mjs` (đối chứng dương: kho nhỏ / tên ASCII / niêm phong có giá trị).

2. **Ca THE-M0 so trọn thẻ Cổng Phạm vi với bản ở điểm rẽ** (Ngoài-1, Ngoài-16 trùng; `tests/design-floor/moc-s0-s1.mjs`).
   Lời hứa AC-7 là «hồ sơ không có `design-floor.json` thì khối Sàn thiết kế không đổi gì», nhưng ca so cả HTML thẻ
   dựng bằng `scripts/` ở điểm rẽ khỏi nhánh chính: mọi PR sau FL4 đổi cách in thẻ Cổng Phạm vi vì lý do khác sẽ đỏ
   ca này với thông điệp đổ lỗi cho design-floor.

   Hướng sửa: so thẻ dựng hai lần trên CÙNG cây — một lần có, một lần không có `design-floor.json` — và đòi phần
   khác nhau đúng bằng khối «Sàn thiết kế»; giữ đột biến hiện có làm chiều đỏ.

**Mở thành ô khi:** trước khi FL5 bật chặn theo bậc (nhóm 1 quyết bậc nào chặn), hoặc khi một PR đổi cách in thẻ
Cổng Phạm vi đỏ ca THE-M0 (nhóm 2), hoặc chủ kho gọi tên.
