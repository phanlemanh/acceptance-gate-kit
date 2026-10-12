# Hạt giống — ba lỗ còn lại của gói dieu-phoi sau vòng ổn định trước đợt r2

Gốc: `_acceptance/dieu-phoi-on-dinh-r2/` (Cổng Bằng chứng lượt chấm 2, chủ kho ký 12/10/2026 — Ngoài-5, Ngoài-10,
Ngoài-13: mở hợp đồng mới; Ngoài-1: ghi Known limits kèm hạt giống theo lời Điều phối M5). Hạt giống là SỔ, không
phải ô: chỉ mở thành ô khi có neo ngoài — đợt chạy `r2` của crm (~16/10) hay kho thứ hai vấp đúng lỗ.

## Lỗ

1. **Bộ đọc YAML theo dòng của `kiem-chuyen` còn lọt dạng hợp lệ khác (Ngoài-1, Ngoài-7 lượt 2).** Lượt 2 vá hai
   dạng (danh sách một dòng có `#<id>`, mục eval ở cột 0); eval viết flow mapping `- { id: E1, cmd: … }` và danh
   sách thụt ngang khoá cha (`  suite_keys:\n  - …`) vẫn đọc thành rỗng, nên executor sống bị xếp `executor-chet`
   và lệnh báo «sạch» giả. Đây là lớp thứ hai cùng tên trong một vòng (luật dừng-vá) — hướng là ĐỔI KHUÔN, không
   vá thêm dạng: bộ đọc khoan dung + cờ vàng — khối eval không đọc được `id`, hay khoá danh sách có mặt mà đọc ra 0
   mục, thì dòng ở lại nhóm phải sửa và CLI in một cờ vàng nêu tệp.
2. **`xem --kiem-chuyen --chi-tiet` cụt ở 64 KB khi chạy qua pipe (Ngoài-5 lượt 2).** CLI ghi stdout rồi
   `process.exit` ngay; qua pipe phần sau 65 536 byte mất mà mã thoát vẫn như thường. Hướng: thoát trong callback
   của lần ghi (nếp đã vá ở bộ dựng thẻ, PR #311).
3. **Khoá `hang-viec.khoa` không che hai bên viết Nhật ký khác (Ngoài-10, Ngoài-13 lượt 2 = Ngoài-3, 6 lượt 1).**
   `pha` và `nhat-ky` ghi `LUAT.md` bằng đọc-sửa-ghi trần, ngoài khoá; chạy đúng lúc các chip đang `ghi-danh` thì
   một dòng Nhật ký có thể mất. Hướng: mọi lời gọi `ghiNhatKy` đi qua cùng khoá.

## Ngưỡng mở ô

- Lỗ 1: một kho thứ hai dùng `xem --kiem-chuyen` có `evals.yaml` viết flow mapping hay danh sách không thụt.
- Lỗ 2: một lần giám sát đọc `--chi-tiet` qua pipe thấy đầu ra cụt.
- Lỗ 3: đợt thật mất một dòng Nhật ký trong lúc nhiều chip ghi danh.

Khi đó ô mang `Gốc:` trỏ hồ sơ của đợt ấy.
