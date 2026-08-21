# Gap-probe — lan-v-khong-phai-cho-ky (vòng ba, T2, một vật)

Phản biện context sạch, 21/08, trước Cổng Phạm vi. Đầu vào: contract · evals ·
design (mục «Vòng ba») · sổ quyết định (entry descope cuối) · bài học xuyên hồ
sơ. Không đọc mã repo. (Bản ghi vòng hai T3 — 5 lỗ, 3 P0, đã vá — nằm trong git
trước commit thu phạm vi.)

**VERDICT: findings** — 5 lỗ (1 P0, 3 P1, 1 P2). Tất cả đã xử trước khi trình cổng.

| # | Lỗ | Mức | Xử |
|---|---|---|---|
| F1 | Mặt cắt đẳng thức với lưới bỏ ngoài 2/6 điều kiện (hạng · verdict) — hai điều kiện đó chỉ còn được kiểm bởi hàm kỳ vọng viết tay, trái lời AC-1 | P0 | **fixed** — LV5 thêm `V-T3`, `nguoi-T3`, `V-pending`, `nguoi-pending` (17 fixture); AC-1/E1 sửa khớp. Phép đo bắt thêm một điều thật: fixture phải chép đúng bộ `lib/` của `/acceptance-init`, không thì lưới fail-closed và «khớp» chỉ là cùng đỏ — đã ghi vào AC-1 |
| F2 | LV6 không được khai ở AC/eval nào nhưng E9 ghim đúng 6 dòng | P1 | **fixed** — LV6 = sàn đếm của chính bộ lọc (tự gọi lại file), khai ở header + E6 |
| F3 | Bảng 240 ô: không chiều đỏ riêng; trục G không khai; ô «mo vết hỏng + người duyệt + sạch» không có state | P1 | **fixed** — AC-5 khai G cố định theo nhánh veto; E7 + răng đòi LV4 đỏ ≥1 ô dưới MỖI đột biến (đã chạy: đỏ cả ba); AC-2: `xanh-sach` khi `approved_by` có tên bất kể khoá veto (lưới đọc y vậy — ca `nguoi-vet-hong` trong LV5) |
| F4 | Chân cây-thật ghim tên hồ sơ cứng — tự đỏ khi chính hồ sơ này đi làn V; kỳ vọng viết theo kết quả | P1 | **fixed** — AC-7/E8/răng đo QUAN HỆ trên mọi hồ sơ verified chưa ký (máy quét ∈ done ⇔ lưới không VIOLATION), sàn ≥2, không ghim tên |
| F5 | Context nói «fixture code-sinh từ khuôn canonical» trong khi evidence fixture viết tay (known-limits #5) | P2 | **fixed** — Context nói đúng: contract từ khuôn, evidence chưa |

**Bằng-chứng-thiếu phản biện nêu:** «`pre-merge-check.sh <kho> --base basepoint` có
chạy được trên kho ngoài không» — đã chạy thật ở LV5: được, với điều kiện kho chép
bộ `lib/` (chính là điều F1 lôi ra).

**Bài học cũ:** `cong-chan-nham-cho#F1` (chuỗi thay quan hệ) — không dẫm;
`veto-co-dau-vet#F2` (danh sách đóng thiếu điều kiện) — dẫm một nửa ở F1, đã vá.
