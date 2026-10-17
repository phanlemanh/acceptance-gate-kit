# Hạt giống — rà soát lộ trình không xét mốc ngoài đã quá ngày

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ trước (thêm một luật vào khối «Rà soát» sẵn có; không thêm lệnh, không thêm cổng).
Gốc: `_acceptance/ra-soat-lo-trinh/` — AC-1 cố ý chỉ coi mốc `phat-hanh` là mốc chiến dịch, nên luật `moc-qua-ngay` chỉ chạm HÀNG.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- Đo 17/10 08:50Z trên crm `onehub` b1666c3ac, `lo-trinh.mjs --xem` của kit 2.32.0: lộ trình OKR in «Rà soát: không có
  đề xuất», trong khi tệp có bốn mốc đã quá ngày mà không có ngày khép (`that`):
  `m-1009` (09/10, `den` 12/10 cũng đã qua) · `m-1013n` (13/10) · `m-1014` (14/10, `loai: han-cung`) · `m-1014d` (14/10).
  Ba trong bốn là `loai: ngoai`; cả bốn có `hang: []`.
- Lộ trình Kho tài liệu cùng lần đo: mốc `ngoai` «Chạy thật — mọi phòng ban tự nạp…» 14/10, không `that`, cũng không hiện.
- Buổi tổng kết ba máy 17/10 phải rà mốc bằng tay; lộ trình kit cũng mang bốn mốc crm đã qua ngày cho tới đợt dọn 17/10
  mà máy không báo dòng nào.

## Gốc

`raSoat` (`scripts/lo-trinh.mjs`, khoảng dòng 1159–1180) lặp trên `kq.dong` — từng HÀNG. Mốc chỉ vào cuộc như ngày của
chiến dịch chứa hàng (`MOC_CHIEN_DICH` = `loai: phat-hanh`). Mốc không có hàng, hoặc mốc `ngoai` / `han-cung`, không bao
giờ sinh đề xuất. Bộ đọc cũng không đọc trường `that` — tệp crm khai ngày khép mà kit không dùng. Kết quả: «Rà soát:
không có đề xuất» nói một điều mà lộ trình không đúng — mốc của người đã trễ mà không ai được báo.

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

1. **Luật rà mới `moc-chua-khep`:** mốc có `ngay` hợp lệ < hôm nay, không có ngày khép, và (không có hàng HOẶC mọi
   hàng đã giao) → một dòng «mốc «…» đã qua ngày dd/mm, chưa ghi ngày khép» trong khối Rà soát. Chỉ cờ, không tự áp.
2. **Ngày khép:** đọc `that` nếu tệp có; khuôn kit chưa khai trường này → đường đọc-cũ, mốc không khai thì cờ như (1).
3. Chiều đỏ: ma trận mốc {ngoai · han-cung · phat-hanh} × {đã qua · chưa tới} × {có `that` · không}; bản sao bỏ luật →
   ca đỏ nêu đúng tên mốc; đối chứng dương: mốc đã qua có `that` → im.

**Người hưởng:** owner và phiên điều phối (buổi tổng kết không phải dò mốc bằng mắt trên ba máy).

**Kho không gặp sự cố này được gì, mất gì:** kho ghi `that` đều đặn không thấy gì mới. Mất: kho có nhiều mốc cũ chưa khép
sẽ thấy một loạt dòng ở lần chạy đầu — cần trần dòng hoặc gom «n mốc chưa khép».

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc lần thứ hai một buổi tổng kết phải rà mốc bằng tay vì khối Rà soát im.
