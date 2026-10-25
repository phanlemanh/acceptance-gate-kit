# Hạt giống — khối tri_thuc khai sai làm sập thẻ Cổng Phạm vi và lệnh đếm

**Ngày:** 2026-10-25 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa đúng tầng (bên đọc kiểm `cfg.loi` trước khi giải đường).
Gốc: `_acceptance/vong-don-le-tra-tri-thuc/` — Ngoài-3 và Ngoài-5 (cùng một lỗi) của Cổng Bằng chứng 25/10, chủ kho chọn «mở hợp đồng mới».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/vong-don-le-tra-tri-thuc/contract.md` trích lại tệp này.

## Số đo

- TT5 thêm vào `xetCanCu` (`scripts/tri-thuc-tra.cjs`) dòng `const rieng = !giaiGoc(root, cfg).trongKho;` (sửa hạt giống kho
  riêng thiếu tiền tố) mà không kiểm `cfg.loi` trước. Khối `tri_thuc` khai mà thiếu cả `noi` lẫn `kho.duong` → `docTriThuc` trả
  `noi: null`, `giaiGoc` gọi `path.resolve(root, null)` và ném `TypeError`.
- Không lớp nào bắt: `can-cu-s1.cjs --slug`, `--dem` và `gate-card.js --extract` (gọi `phanLoaiSo` không bọc try) đều thoát 1
  kèm stack trace. Bộ máy trước vòng (`396c08f8`) xếp cùng dòng `do` `tri-thuc-sai`, `--dem` thoát 0 — đây là lùi.
- Chỉ lộ khi cấu hình gõ sai; chưa kho tiêu thụ nào khai `tri_thuc` lúc ghi hạt giống.

## Đề xuất (chưa làm)

1. Trong `xetCanCu`: `cfg.loi.length` → trả `{ lop: 'do', ma: 'tri-thuc-sai' }` (hoặc mã riêng) TRƯỚC khi gọi `giaiGoc`; hoặc chỉ
   tính `rieng` khi `cfg.kho && cfg.kho.duong` — cùng nếp `theCong1` (cờ `CO.khoiLoi`) và `traMoTa` (kiểm `cfg.loi` trước).
2. Ca đo hai chiều: khối `tri_thuc` thiếu `noi` lẫn `kho.duong` + một dòng S1 mang `can_cu.tri_thuc` → bộ xếp ra `do`, thẻ dựng
   được với cờ «khối tri_thuc lỗi», `--dem` thoát 0; bản tiêm bỏ phép kiểm → thoát 1 ghim `paths[1]`.

Ngưỡng mở thành ô: kho đầu tiên khai `tri_thuc` nhận bản phát hành có TT5.
