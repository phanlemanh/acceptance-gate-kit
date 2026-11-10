# Đối chiếu tiêu chí với đề bài

Một tác tử mới, không đọc kho và không thấy hợp đồng, viết 33 tiêu chí chỉ từ đề bài (Hỏi-3 ở Cổng 1). Bảng dưới so chúng với
AC-1..AC-10. Ô «đã thử» là chạy thật trên cây lúc đối chiếu, bộ quét nạp vào jsdom và giả đúng trường màu tính ra.

| Tiêu chí từ đề bài | AC khớp | Lệch |
|---|---|---|
| TC-1, TC-2 tái lập hai ca trên Chrome thật | AC-8 | Không |
| TC-3 đối chiếu cùng axe-core 4.14 trên cùng trang | AC-8 một phần | Có: hồ sơ không chạy axe vì kit không phụ thuộc nó; AC-8 đối chiếu với bộ máy gốc và điểm ảnh đo lại |
| TC-4 bốn định dạng bị từ chối | AC-1 | Không |
| TC-5 bốn màu tối đạt | AC-6 | Ghim lab, oklch, oklab; `lch(10 0 0)` đã thử, đạt, chưa ghim |
| TC-6, TC-7 quy đổi có sắc độ, hue có tác dụng | AC-2 | Không. Đã thử đỏ sRGB ở lab và oklch: 4,0:1 như `rgb(255, 0, 0)` |
| TC-8, TC-9 alpha hoà với nền, đổi kết luận | AC-3 | Không |
| TC-10 alpha số và phần trăm bằng nhau, `/ 1` như không alpha | AC-3 một phần | Đã thử, đúng, chưa ghim thành ca so bằng nhau |
| TC-11 nền định dạng mới | AC-2, AC-6 | Không |
| TC-12 cổng với `--require-measured` | AC-7, AC-8 | Không |
| TC-13 hai tầng cùng kết luận | AC-1..AC-7 | Không: mỗi ca kiểm hai tầng |
| TC-14 màu sai cú pháp | AC-7 một phần | Đã thử `lab()`, `oklch(abc 0 0)`, `oklab(0.5 0)`: đều không đo được, không `NaN`; chưa ghim. Chrome không bao giờ trả các chuỗi này |
| TC-15, TC-16 định dạng lạ, nền không đọc được | AC-7 | Không |
| TC-17 màu ngoài gam | AC-2 một phần | Đã thử `oklch(0.9 0.4 150)` có và không alpha: tỉ lệ hữu hạn, chưa ghim |
| TC-18, TC-19 không đọc được không chặn phần còn lại | AC-7 | Không |
| TC-20 `rgb(238,238,238)` | AC-7 | Không |
| TC-21 `rgba` có alpha giống hệt trước | Ngược AC-3 | Có chủ ý: chủ kho đã duyệt tính alpha cho `rgba` ở Hỏi-1 |
| TC-22, TC-23 bản đóng gói khớp nguồn, tự chạy | AC-9, AC-8 | Không |
| TC-24 đỏ trước xanh sau | AC-1, MD-0 | Không |
| TC-25 có ca nhánh không đọc được | AC-7 | Không |
| TC-26 không ca cũ nào bị nới | AC-6 | Ngoại lệ đã khai: trang thử `oklch-toi` |
| TC-27..TC-33 chú thích S4 | AC-10 | Không |

## Kết luận

Không phát hiện lời hứa nào của đề bài nằm ngoài hợp đồng, nên phạm vi không đổi và không cần trình lại Cổng 1. Hợp đồng đủ ý;
bốn tiêu chí TC-5, TC-10, TC-14, TC-17 đúng khi thử nhưng chưa có ca ghim. TC-3 và TC-21 là hai chỗ lệch có lý do nêu trên.
Người ký xem hai chỗ này ở Cổng Bằng chứng.
