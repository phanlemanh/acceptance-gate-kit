# Hạt giống — bộ chọn trang tính mã mà trang đợt đã mang

**Ngày:** 2026-10-24 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa đúng tầng (một bộ đọc, hai bên khớp).
Gốc: `_acceptance/o-mo-viec-mang-nguon/` — Ngoài-4 của Cổng Bằng chứng 24/10, chủ kho chọn «mở hợp đồng mới».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-mo-viec-mang-nguon/contract.md` trích lại tệp này.

## Số đo

- `chonTrang` (`scripts/tri-thuc.mjs`) loại trang đợt `wiki/dot/<dot>.md` ra trước khi gom mã, nên mã nào chỉ trang
  đợt mang thì dòng «Nguồn:» của ô vẫn kết bằng «chưa có trang: mã <x>».
- Lint `ma-khong-co-trang` của TT1 gom mã từ MỌI trang, kể cả trang đợt — cùng kho, hai bên đọc nói ngược nhau.
- Lượt chấm 1 của hồ sơ dựng lại được: một trang nền + trang đợt `ma: [A1, A2]`, không trang chủ đề → `thieu` =
  `["mã A1", "mã A2"]` trong khi lint xanh. Ca ON-1/ON-4 không chạm vì mọi mã của trang đợt đều có trang chủ đề riêng.

## Đề xuất (chưa làm)

1. Chốt nghĩa «trang mang mã» ở MỘT chỗ (khuôn tri thức), rồi `chonTrang` và lint cùng đọc nghĩa ấy.
2. Ca đo hai chiều: kho chỉ có trang đợt mang mã → dòng «Nguồn:» không có «chưa có trang»; gỡ mã khỏi trang đợt → có.

Ngưỡng mở thành ô: ≥ 1 ô thật ở một kho đã khai `tri_thuc` mang «chưa có trang: mã …» mà lint của kho ấy xanh.
