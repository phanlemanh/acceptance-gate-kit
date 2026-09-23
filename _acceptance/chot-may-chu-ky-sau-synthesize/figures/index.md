# Điểm quyết định tại Cổng Phạm vi — chot-may-chu-ky-sau-synthesize

Kê từ artifact cuối S1: 5 dòng sổ chờ seal · 1 chỗ design lệch hạt giống (luật vị trí trường,
thêm từ gap-probe) · 0 dòng `[GIẢ ĐỊNH]` · 0 finding gap-probe xử lý `human-gate1`.

| Điểm | Đếm | Hình |
|---|---|---|
| Vế 2 — phê răng bên đọc hay để hạt giống | hai nhánh rẽ (phê → thêm AC, nâng T3, duyệt lại · không phê → hạt giống kèm số đo) | cần hình: `ve-2-hai-loi` |
| Luồng chốt sau synthesize | ba bước nối tiếp (tác tử viết → chốt máy → BLOCKED hoặc report + dòng run-log) | cần hình: `luong-chot` |
| Luật vị trí trường (lệch hạt giống) | dưới ngưỡng: một bước, không rẽ | — |
| Sổ: bỏ đặc-tả-UX · hàm trong marker · nói ra bằng run-log · không chữa ngược | dưới ngưỡng: mỗi dòng một bước | — |

## Đề bài hình

### ve-2-hai-loi
- Loại: cây quyết định hai nhánh.
- Gốc: «Vế 2 — răng bên đọc (CỘNG)».
- Nhánh «phê»: thêm AC răng bên đọc · vòng nâng T3 (chạm lib/, recheck) · đỏ ngay 13+12 hồ sơ (verified_at sớm hơn run-log), 0+6 (muộn hơn commit), 37+6 (chữ ký không có commit ký) — cần nợ có tên hoặc luật hẹp hơn · thêm Gate 1.5.
- Nhánh «không phê» (khuyến nghị): vòng giữ T2 · số đo ghi vào hạt giống · lỗ còn lại: chữ ký do phiên tự viết ngoài /signoff, override trong khối vô hướng.
- AC liên quan: Out of scope của hợp đồng; Notes giới hạn đã khai.

### luong-chot
- Loại: luồng ba bước.
- Nút: tác tử tổng hợp trả chuỗi báo cáo → chốt máy (ba khoá người → rỗng · verified_at → giờ engine, chỉ ở vị trí trường) → nhánh: có verified_at mà thiếu invokedAt → BLOCKED gọi tên · ngược lại → report trả vòng chính + (nếu đổi) một dòng run-log kind chot-truong-nguoi.
- AC liên quan: AC-1, AC-2, AC-3, AC-4, AC-5.
