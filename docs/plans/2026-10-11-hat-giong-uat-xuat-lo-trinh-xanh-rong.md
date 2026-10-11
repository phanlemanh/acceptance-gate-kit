# Hạt giống — bản kiểm cuối của phiên nghiệm thu xuất lộ trình xanh rỗng

Gốc: `_acceptance/dieu-phoi-doi-tai-khoan/` (lượt chấm 1 ngày 11/10/2026 soi cả mã đã gộp từ #302 vì mốc so cũ —
Ngoài-4, Ngoài-9, Ngoài-25 trong `review-findings.md`, owner: mở hợp đồng mới). Vật nằm ở hồ sơ
`_acceptance/xuat-du-lieu-lo-trinh/` (`uat/chay.sh`). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo
ngoài (ngưỡng ở cuối).

## Lỗ

1. **Chiều đỏ của bước quét mã bị mất trong pipe (Ngoài-9, nặng).** Ba mutant chạy trong
   `{ …; node quet-ma-lt1.mjs --mong-do … || DO=1; … } | tee …`; vế trái của pipe chạy trong subshell (bash 3.2 trên
   macOS, không `lastpipe`) nên `DO=1` không về shell chính — `DO=0; { false || DO=1; } | cat; echo $DO` in 0. Bước
   tiêm (`python3 … assert`, `sed`) lỗi cũng không đặt `DO=1`. Kết quả: «KẾT: XANH» khi chiều đỏ hỏng.
2. **Vế «kho không khai lộ trình» xanh khi 0 kho (Ngoài-4, Ngoài-25).** `kho="$HOME/dev/$ten"; [ -d "$kho" ] ||
   continue` bỏ lặng radar và oneflow khi máy không có hai kho ấy; không đếm số kho đã đo. Chủ kho đã chuyển máy,
   và `uat-session.md` dặn lần đọc chính thức 30/10 chỉ cần chạy lại `uat/chay.sh` một lần — trên máy khác nó in
   xanh trên 0 kho. Cùng tệp: `KHOA` gõ cứng đường crm của máy tác giả, worktree `kit-v226` dùng lại mà không kiểm.

## Hướng

(1) gom `DO` qua tệp trạng thái hoặc chạy vế trái không qua pipe, và mọi bước tiêm thất bại đặt `DO=1` có tên;
(2) nhận danh sách kho qua đối số, đếm số kho thật sự đo, coi 0 kho hay thiếu kho đã khai là ĐỎ có tên. Mỗi vế một
cặp ca hai chiều (mutant không tiêm được → đỏ; kho vắng → đỏ; đủ kho, mã lành → xanh).

Ngưỡng mở ô: lần đọc chính thức 30/10 của phiên nghiệm thu `xuat-du-lieu-lo-trinh` — trước lần chạy đó, hoặc ngay
khi một lần chạy `uat/chay.sh` trên máy khác in «KẾT: XANH».
