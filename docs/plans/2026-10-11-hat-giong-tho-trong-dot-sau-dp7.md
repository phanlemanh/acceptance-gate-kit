# Hạt giống — hai lỗ của phiên thợ trong đợt sau DP7

Gốc: `_acceptance/dieu-phoi-feature-loop-trong-dot/` (lượt chấm 1 ngày 11/10/2026, Cổng Bằng chứng ký 11/10 —
Ngoài-2, Ngoài-3, Ngoài-5 (trùng Ngoài-3), owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở
thành ô khi có neo ngoài — một đợt thử thật (crm ~26/10, OneFlow ~27/10) vấp đúng lỗ.

## Lỗ

1. **Hai hàng trùng `ma` khác `tep` — bên đọc vẫn khoá theo mã (Ngoài-2).** Sau AC-12, `mo` ghi được hai
   hàng mã `X` (một `tep: a.json`, một `tep: b.json`) và `kiemHangViec` nhận cả hai. Nhưng `chonHangKe`/
   `duPhuThuoc` (`dieu-phoi/scripts/lich.mjs`) giải `sau: ['X']` bằng hàng ĐẦU mang mã đó, `timHang`
   (`hang.mjs`) chỉ chạm hàng đầu, và `docNhomKeHoach` (`nguon-hang.mjs`) là Map theo mã nên nhóm kế hoạch
   của hai hàng đè nhau trên bảng đợt.
2. **`trong-dot.mjs` gộp mọi lỗi của `tho` thành «lõi chưa có lệnh tho» (Ngoài-3, Ngoài-5).** Tệp đợt hỏng
   (`hang-viec.json` sai khuôn, `tiep/<dãy>.json` hay `dieu-khien.json` không phải JSON) làm `tho` thoát 1;
   `trong-dot.mjs` bỏ stderr và in chẩn đoán sai, khối TRONG-DOT dặn «bỏ qua khối», nên thợ chạy như ngoài
   đợt — tự hỏi người, không xin lượt.

## Hướng

(1) `kiemHangViec` cảnh báo hoặc chặn mã trùng khi `sau`/lệnh `hang` không phân biệt được, hoặc khoá
(tệp, mã) xuyên mọi bên đọc; (2) `trong-dot.mjs` tách «lõi thiếu lệnh tho» (khớp dòng «dùng:» của CLI) khỏi
«tho lỗi», và in kèm dòng stderr đầu tiên ở ca sau. Mỗi mục một cặp ca hai chiều trên cùng fixture.

Ngưỡng mở ô: ≥1 đợt thử thật vấp một trong hai lỗ, có sự kiện trong `su-kien.jsonl` hoặc dòng Nhật ký của
đợt làm neo.
