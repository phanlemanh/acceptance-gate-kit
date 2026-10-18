# Hình tại Cổng Phạm vi — ho-so-da-ky-giu-tuoi

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — phê phần CỘNG (lệnh giữ tươi · dòng sổ nền đỏ · nhãn «đỏ sẵn trên nền» · khoá · chế độ ghim từng hồ sơ) | 2 nhánh (phê cả gói · bỏ nhãn) + 4 bước nối tiếp → cần hình | `luong-giu-tuoi` |
| Hỏi-2 — nhãn chỉ cho eval hay cả suite chung (gap-probe P0, human-gate1) | 2 nhánh → cần hình | `luong-giu-tuoi` (nhánh suite đánh dấu trên cùng hình) |

## Đề bài `luong-giu-tuoi`

- Loại: luồng (flowchart) trái → phải, hai làn ngang: làn trên «Nhánh chính — lệnh giữ tươi», làn dưới «Vòng khác chạm hồ sơ».
- Làn trên: «Các PR gộp trong khoảng» → «Chọn hồ sơ cũ vì khoảng (hai lượt lưới trước-gộp)» → «Ghim lại từng hồ sơ, suite chạy một lần» → rẽ hai: «Xanh → hồ sơ tươi lại» · «Đỏ → chạy lại ở đầu khoảng» → rẽ ba nhỏ: «đỏ do PR #n (cặp sha)» · «đỏ sẵn trước khoảng» · «hạ tầng — không gọi tên PR»; mọi nhánh đỏ ghi «dòng nền đỏ».
- Làn dưới: «Vòng khác ghim lại hồ sơ ấy» → «Eval đỏ: cùng ca, cùng thông điệp, cùng định nghĩa, nền trên merge-base?» → «Đủ → nhãn đỏ sẵn trên nền (không phải ĐẠT), vòng đi tiếp» · «Thiếu → đỏ như hôm nay».
- Nhãn quyết định: ô «Hỏi-1: phê phần mới» đặt cạnh ba khối mới (lệnh · dòng nền đỏ · nhãn); ô «Hỏi-2: suite chung đỏ → vẫn chặn (khuyên)» gắn vào nhánh «Thiếu».
- Liên quan: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7.
