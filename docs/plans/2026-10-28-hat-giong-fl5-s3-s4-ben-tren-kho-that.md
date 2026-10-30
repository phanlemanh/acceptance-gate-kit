# Hạt giống — móc cuối S3 và S4 của design-floor bền trên kho thật sau FL5

**Ngày:** 2026-10-28 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Quyết:** chủ kho chọn «mở hợp đồng mới» cho
Ngoài-1, Ngoài-2, Ngoài-3, Ngoài-4, Ngoài-5 ở Cổng Bằng chứng của hồ sơ `_acceptance/design-floor-moc-s3-s4/` (sổ
quyết định, các dòng `stage: gate2` mang `decision: "Ngoài-<n>: mở hợp đồng mới"`).
Gốc: `_acceptance/design-floor-moc-s3-s4/` — năm mục rà soát của lượt chấm S4 #1 (một mục mức nặng).

Hai nhóm, đều đã dựng lại trên vật của FL5:

1. **S4 chặn oan vì tệp nhị phân** (Ngoài-3, mức nặng; `scripts/design-floor-s4.mjs`). Lệnh đọc mọi tệp diff khớp
   `design.surface_globs` như chữ rồi tìm hex thô; ảnh và font trong vùng giao diện cho chuỗi khớp ngẫu nhiên. Đo trên
   kho kit: 58/146 tệp png/jpg/woff2/ico đang theo dõi có ít nhất một chỗ khớp. Hướng sửa: bỏ qua tệp nhị phân (byte
   NUL, hay `git diff --numstat` báo `-`), ca hai chiều với một ảnh thật trong fixture.

2. **S3 chưa bền khi cây không sạch hay lệnh hỏng** (`scripts/design-floor-s3.mjs`).
   - *Việc dở lẫn vào commit máy* (Ngoài-1, Ngoài-4 trùng). Chỉ đích autofix được kiểm bẩn từ trước; tệp người đang sửa
     mà lệnh sinh lại ghi tiếp vẫn vào commit «design-floor S3». Chiều ngược: tệp dẫn xuất đã sinh sẵn chưa commit mà
     lệnh sinh lại cho ra đúng nội dung ấy thì bị bỏ ngoài commit, không cảnh báo.
   - *Lần chạy lại kẹt* (Ngoài-2). Lệnh sinh lại hỏng (hay autofix lỗi ở trang thứ hai) thì trang máy đã sửa nằm lại trên
     cây; chạy lại theo đúng đường SKILL chỉ thì thoát 2 vì chính trang ấy.
   - *Trang lớn* (Ngoài-5). Gọi bản gói với bộ đệm đầu ra mặc định 1 MB: `autofix --write --json` ghi tệp rồi mới in
     phong bì chứa cả trang, nên trang lớn bị ghi mà lệnh báo lỗi.

   Hướng sửa: mọi tệp bẩn sẵn mà lệnh làm đổi → thoát 2 gọi tên tệp như đích autofix; lỗi ở bước autofix hay sinh lại
   thì hoàn lại các trang máy đã ghi (máy giữ đường đảo); bộ đệm đầu ra đủ lớn hoặc bỏ `--json` khi ghi. Mỗi chỗ một ca
   hai chiều trong `tests/design-floor/moc-s3-s4.mjs`.

**Mở thành ô khi:** trước khi một kho tiêu thụ nối `executors.design.floor` hay khai `design_floor.sinh_lai` (thí
điểm DO1), hoặc chủ kho gọi tên.
