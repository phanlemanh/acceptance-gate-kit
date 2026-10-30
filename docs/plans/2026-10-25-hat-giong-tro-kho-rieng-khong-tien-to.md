# Hạt giống — đường trỏ kho riêng thiếu tiền tố lọt chốt chặn câu trích

**Ngày:** 2026-10-25 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa đúng tầng (bên đọc xác định kho riêng theo kết quả giải đường, không theo chữ).
Gốc: `_acceptance/thiet-ke-nap-tri-thuc/` — Ngoài-3 của Cổng Bằng chứng 25/10, chủ kho chọn «mở hợp đồng mới».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/thiet-ke-nap-tri-thuc/contract.md` trích lại tệp này.

## Số đo

- `xetCanCu` (`scripts/tri-thuc-tra.cjs`) chỉ đỏ `tri-thuc-kem-trich` khi đường trỏ CÓ tiền tố `<kho>:`. Ở kho khai
  `tri_thuc.kho`, `tri-thuc.mjs --con-tro` giải đường trỏ KHÔNG tiền tố vào gốc kho riêng — nên `wiki/x.md#<băm>`
  vẫn khớp trang kho riêng (thoát 0).
- Lượt chấm 1 dựng lại được trên kho tạm: căn cứ `{"tri_thuc":"wiki/x.md#<băm>","trich":"…","tep":"wiki/x.md"}` ra
  «máy đã quyết»; cùng trang có tiền tố ra đỏ. Câu trích đi tiếp vào `can_cu.da_quyet[].trich` của `gate-card --extract`.
- Chỉ lộ khi người viết dòng căn cứ viết sai khuôn; chưa kho nào khai `tri_thuc` lúc ghi hạt giống.

## Đề xuất (chưa làm)

1. Xác định «kho riêng» bằng `giaiGoc(...).trongKho === false` (tri-thuc-khoa.cjs), không bằng có/không tiền tố; hoặc
   đỏ mọi đường trỏ không tiền tố khi kho đã khai `kho.duong`.
2. Ca đo hai chiều: đường trỏ không tiền tố kèm `trich` ở kho khai kho riêng → đỏ; cùng đường ở kho chỉ khai `noi` → xanh.
3. Gộp được vào hàng TT5 (cùng vùng bộ xếp căn cứ).

Ngưỡng mở thành ô: kho đầu tiên khai `tri_thuc.kho` nhận bản phát hành có TT4.
