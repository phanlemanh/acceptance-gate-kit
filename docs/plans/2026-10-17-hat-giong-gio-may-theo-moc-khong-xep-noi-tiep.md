# Hạt giống — giờ máy theo mốc không xếp các mốc nối tiếp nhau

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ trước (sửa cách tính ngày trong khối sẵn có; không thêm khối, không thêm khoá).
Gốc: `_acceptance/lo-trinh-gio-may/` — AC-4 chỉ xếp nối tiếp hai mốc khi hàng của mốc sau `dung_tren` hàng của mốc trước.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- Đo 17/10 08:50Z trên crm `onehub` b1666c3ac, `lo-trinh.mjs --xem` của kit 2.32.0, khối «Giờ máy theo mốc»:
  - OKR · Khu Mục tiêu dễ đi (mục tiêu 20/10): «bắt đầu ~17/10 · ~11,5–19 giờ máy · hoàn tất dự kiến 17/10»;
  - Hạn cứng 14/12: «bắt đầu ~17/10 · ~5–8,5 giờ máy · hoàn tất dự kiến 17/10»;
  - R3 lên production 18/12: «bắt đầu ~17/10 · ~35,5–53,5 giờ máy · hoàn tất dự kiến 19/10».
- Cùng lần đo, Kho tài liệu (mục tiêu 04/11) và Việc và Dự án (mục tiêu 24/10) cũng «bắt đầu ~17/10 · hoàn tất 17/10».
- Năm mốc của ba lộ trình cùng bắt đầu hôm nay trên cùng một máy: ngày «hoàn tất dự kiến» của từng mốc đúng một mình,
  sai khi đọc chung — R3 không thể xong 19/10 khi mọi mốc trước nó cũng đang chạy.

## Gốc

`duBao` (`scripts/gio-may.mjs`, dòng 153–164): `batDau = gioTuNgay(today)`, chỉ dời khi một hàng của mốc
`dung_tren` một hàng chưa giao thuộc mốc khác. Không có hàng đợi năng lực: mốc độc lập coi như có máy riêng.
`hoanTat = batDau + giữa khoảng giờ + giờ chờ` cộng giờ liên tục 24/24, nên 6,75 giờ máy từ 00:00Z vẫn «xong hôm nay».
Hai giả định — năng lực vô hạn, máy chạy suốt ngày — đúng với một mốc, hỏng khi lộ trình có nhiều mốc mở.

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

1. **Xếp nối tiếp theo ngày mục tiêu:** mốc chưa khép sắp theo `ngay`; `batDau` của mốc k = max(hôm nay, hoàn tất mốc
   k−1, ràng buộc `dung_tren` sẵn có). Một lộ trình một hàng đợi; nhiều lộ trình cùng kho → khai rõ «mỗi lộ trình tính riêng».
2. **Giờ máy mỗi ngày:** đọc từ số đo vòng đã giao (trung vị giờ máy/ngày) khi đủ vòng; chưa đủ → giữ 24/24 kèm nhãn
   «chưa đo nhịp ngày», như nhãn «chưa có giờ chờ đo» hiện có.
3. Chiều đỏ: hai mốc độc lập M1 (mục tiêu D), M2 (mục tiêu D+5) → bắt đầu M2 = hoàn tất M1; bản sao giữ `batDau = today`
   → ca đỏ nêu M2; đối chứng dương: một mốc duy nhất → dòng không đổi so với 2.32.0.

**Người hưởng:** owner (đọc «hoàn tất dự kiến» thành lịch thật để hẹn với người dùng) và điều phối (thấy mốc nào trượt trước).

**Kho không gặp sự cố này được gì, mất gì:** kho một mốc mở không thấy gì đổi. Mất: kho đang dựa ngày dự kiến hiện tại
sẽ thấy ngày lùi — cờ «quá tải» xuất hiện nhiều hơn, đúng với thực tế.

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc một lần owner hẹn ngày với người dùng theo «hoàn tất dự kiến» rồi trượt vì mốc khác chạy trước.
