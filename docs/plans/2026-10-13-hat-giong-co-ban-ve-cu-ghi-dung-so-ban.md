# Hạt giống — cờ «bản vẽ cũ» và tài liệu khối dữ liệu phải ghi đúng số bản chứa câu cho người gửi

Gốc: `_acceptance/cau-tin-hieu-nguoi-gui/` (Cổng Bằng chứng ký 13/10/2026 — Ngoài-8, owner: mở hợp đồng mới;
cùng lỗ với Ngoài-1, owner ghi Known limits). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài.

## Lỗ

Cờ vàng `CO_BAN_VE_CU` trong `scripts/tin-hieu.mjs` và ba dòng của `skills/acceptance/references/lo-trinh-du-lieu.md`
ghi «kit ≥ 2.28». Vòng dời khỏi 2.28 (lệnh điều phối 12/10); `v2.28.0` đã phát hành mà không có `cau_nguoi_gui`.
Kho nâng lên 2.28.0 rồi vẽ lại trang vẫn thấy cờ bảo «vẽ lại bằng kit ≥ 2.28».

## Hướng

Lượt cắt mốc đầu tiên chứa vòng này thay số bản ở bốn chỗ (chuỗi cờ, chú thích ngay trên, ba dòng tài liệu) bằng
đúng số mốc; hoặc bỏ số bản khỏi chuỗi cờ («vẽ lại bằng bản kit có câu cho người gửi»). Ca CN-7 ghim thêm số bản
khớp phiên bản của gói.

Ngưỡng mở ô: lượt cắt mốc chứa vòng này mà chưa sửa bốn chỗ — hoặc một kho tiêu thụ báo cờ không tắt sau khi vẽ lại.
