# Điểm quyết định tại Cổng Phạm vi — cham-khong-tu-dot-luot

Kê từ artifact cuối S1 (sổ quyết định chờ seal · chỗ lệch so với findings 26/09 §9.2 · dòng
`[GIẢ ĐỊNH]` của Coverage · phát hiện gap-probe đẩy người: 0). Ngưỡng N5: từ ba bước nối tiếp hoặc
từ hai chỗ rẽ → cần hình.

| Điểm | Đếm | Hình |
|---|---|---|
| D1 · B7 — dấu mã thoát thắng khi nào (sổ d-…-1, lệch §9.2: phân ca thay dấu-thắng-tuyệt-đối) | 4 chỗ rẽ nối nhau (cannotRun? · killedByTool? · có dấu? · dấu bằng 0? / khai 0?) → 8 lá | `b7-phan-ca.html` + `.png` |
| D2 · B12+ — dòng SUITE lý do tự do ra `mu` (sổ d-…-2, thêm so với §9.2) | 1 chỗ rẽ | dưới ngưỡng: 1 rẽ |
| D3 · bỏ B6 lớp (b) (sổ d-…-3, lệch §9.2) | 1 chỗ rẽ | dưới ngưỡng: 1 rẽ |
| D4 · B8 thu gọn, bỏ vế phát hiện (sổ d-…-4, lệch §9.2) | 1 chỗ rẽ | dưới ngưỡng: 1 rẽ |
| D5 · không bọc lane baseline/ui (sổ d-…-5) | 1 chỗ rẽ | dưới ngưỡng: 1 rẽ |
| D6 · bỏ đặc-tả-UX (sổ d-…-6) | 1 chỗ rẽ | dưới ngưỡng: 1 rẽ |
| D7 · bỏ design-pass (sổ d-…-7) | 1 chỗ rẽ | dưới ngưỡng: 1 rẽ |
| D8 · `[GIẢ ĐỊNH]` ngưỡng lưu-ra-tệp của harness > 8 000 byte | 0 rẽ (một giả định, đo ở lượt chấm đầu) | dưới ngưỡng: 0 rẽ |

## Đề bài hình — b7-phan-ca

- **Loại hình:** cây quyết định (flowchart rẽ nhánh), đọc trái→phải hoặc trên→dưới.
- **Nút rẽ (theo thứ tự):** (1) tác tử khai `cannotRun`? → (2a) nếu có: `killedByTool`? · (2b) nếu không: dòng `__EXIT=<n>` có trong đầu ra? → (3) các rẽ tiếp theo đúng bảng AC-2 của contract.
- **Tám lá (nhãn bằng chữ, lấy nguyên từ AC-2):** hàng 1 mã = dấu (cứu đỏ sai, hình E21) · hàng 8 mã = dấu (kéo xanh sai về đỏ) · hàng 2 killed + dấu → mã = dấu, lệnh đã chạy xong · hàng 3 killed không dấu → hạ tầng `killed_by_tool` · hàng 4 cannotRun khác + dấu 0 → 0 · hàng 5 cannotRun khác + dấu ≠ 0 / không dấu → giữ hạ tầng (không REJECT) · hàng 6 không dấu khai ≠ 0 → giữ mã · hàng 7 không dấu khai 0 → «ma thoat khong doc duoc», không đạt.
- **Tô màu ngữ nghĩa:** lá ra «hạ tầng / thử lại cùng round» một màu; lá ra «mã thật → đạt hoặc REJECT» một màu khác; hàng 7 (vế mới có ngưỡng chết) đánh dấu riêng.
- **AC liên quan:** AC-1, AC-2, AC-3 · ghi chú dưới hình: «Luật chỉ áp lane machine (lệnh eval + suite); lane ui và baseline không bị chạm».
