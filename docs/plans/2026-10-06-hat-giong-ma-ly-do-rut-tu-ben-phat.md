# Hạt giống — bộ kiểm tài liệu mã lý do của bộ lọc paths rút từ chỗ phát mã, không từ khối khai báo

**Ngày:** 2026-10-06 · **Trạng thái:** hạt giống (SỔ, chưa là ô).
Gốc: acceptance-gate-kit/_acceptance/loc-paths-dong-mac-dinh/ — Ngoài-5 của lượt chấm 2 (mức cao), owner định tuyến «mở hợp đồng mới» ở Cổng Bằng chứng 06/10.

## Hình dạng

Chân `tai-lieu` (E9) và ca SBP16 lấy danh sách mã lý do từ khối marker `PATHS-LY-DO` trong
`lib/evidence-core.cjs` rồi đòi GUIDE §7.1 nêu đủ. Nhưng mảng `PATHS_LY_DO` không được mã nào đọc:
`phanLoaiMucPaths` và `staleByPaths` trả mã bằng chuỗi viết riêng. Thêm một mã mới vào bộ phân loại
mà quên thêm vào mảng thì GUIDE thiếu mã đó mà E9 vẫn xanh (hình dạng 1/2 của luật «thước gắn vào vật»).

## Hướng nghiệm (chưa chọn)

Bộ phân loại và bộ lọc trả mã qua chính mảng `PATHS_LY_DO` (tra theo tên, mã lạ thì ném), hoặc phép đo
rút mã bằng cách chạy bộ lọc trên ma trận dạng D và gom mọi `reason` thật sự phát ra.

## Ngưỡng mở ô

Lần đầu bộ lọc paths thêm một mã lý do mới, hoặc owner gọi tên.
