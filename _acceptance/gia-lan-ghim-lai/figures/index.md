# Hình tại điểm quyết định — gia-lan-ghim-lai (Cổng 1)

Kê từ artifact cuối S1: 10 dòng sổ chờ seal · 4 chỗ thiết kế đổi so với spec duyệt sáng 06/10
(sau phản biện) · 3 dòng `[GIẢ ĐỊNH]` ở Coverage · 1 finding phản biện xử lý `human-gate1`.
Gộp theo câu hỏi người ký phải trả lời; đếm ngưỡng N5 trên LUỒNG mà điểm đó quyết.

| Điểm | Gồm | Đếm | Hình |
|---|---|---|---|
| Đ1 — một tệp test đổi thì hồ sơ nào phải ghim lại | d-3, d-8, G3, AC-1/AC-2 | 5 bước nối tiếp + 3 nhánh rẽ | `doi-tep-test.html` |
| Đ2 — khi nào một eval được carry | d-5, G1, AC-9/10/11 | 5 bước nối tiếp + 2 nhánh rẽ | `carry-mot-eval.html` |
| Làn ghim lại sau vòng — năm điểm đứng ở đâu, phần nào bật mặc định | d-1, d-4, d-6, d-7, finding P1-b (human-gate1) | 7 bước nối tiếp + 3 nhánh rẽ | `lan-sau-vong.html` |
| Đ5 — dừng một lệnh khi hết trần hay bị ngắt, kể cả làn lồng | G2, AC-5/AC-6 | 4 bước nối tiếp | `dung-mot-lenh.html` |
| Bỏ đặc tả UX (d-2) | — | dưới ngưỡng: 1 bước | — |
| Răng chạy trên bản archive cố định (d-9) | — | dưới ngưỡng: 1 bước (chọn mốc so) | — |
| Không đưa phát lại R1g thành eval (d-10) | — | dưới ngưỡng: 1 bước | — |

## Đề bài từng hình (≤5 dòng)

### doi-tep-test — sơ đồ luồng (flowchart)
- Vào: «một tệp đổi sau pin của hồ sơ P». Nút: khớp `test_globs`? (không → luật cũ: hoá cũ) →
  `paths` của P có glob nhắm thước khớp tệp? (có → hoá cũ) → lệnh của P giải được trọn? (không →
  giữ mọi thước: hoá cũ + NOTE) → lệnh gọi tên tệp? (có → hoá cũ; không → bỏ tệp + NOTE).
- Nhánh chú thích lưới: «thước không gọi tên mà hỏng → suite của làn hồ sơ sở hữu + CI đỏ».
- Ví dụ R1g dưới hình: `zalo-va` (E7 gọi tên) → hoá cũ ~25 phút; `tra-loi-tin-nhac` (E11 `apps/**`) → không.
- AC liên quan: AC-1, AC-2 (T3, T4, T19, T21), G3.

### carry-mot-eval — sơ đồ luồng
- Vào: «eval máy E của hồ sơ, lượt ghim lại». Nút: khoá carry bật? → E có `paths`? → lệnh giải
  được trọn? → cây sạch? → có lượt `repin` xanh của chính hồ sơ mà E CHẠY THẬT, cùng băm? → nguồn
  ≤ 7 ngày? → cặp (E, băm) chưa từng `carry_lech`? → CARRY (mang mã nguồn); mọi «không» → CHẠY.
- Khối phụ «băm = khối eval + lệnh đã giải + tệp khớp paths ∪ tệp lệnh gọi tên + env khai».
- Chú thích: suite không bao giờ carry; bên đọc kiểm chuỗi nguồn, tuổi so với dòng chống lưng.
- AC liên quan: AC-9, AC-10, AC-11, G1.

### lan-sau-vong — sơ đồ quy trình (process, ngang)
- Bước: bắt đầu (đồng hồ trần chạy) → bỏ qua nếu cây bằng pin (Đ1 lọc thước) → suite (Đ3: biến
  khoá rỗng — THAY) → chạy lại lệnh đỏ một lần (Đ4) → eval: carry hoặc chạy (Đ2) → chạy lại (Đ4,
  trừ eval model thật) → ghi pin / dấu đỏ → TỔNG KẾT.
- Dải dưới: «trần / tín hiệu → dừng lệnh, thoát 4 / 128+n» cắt ngang mọi bước.
- Đánh dấu khác màu: phần BẬT MẶC ĐỊNH (tổng kết, bắt tín hiệu, giết cả cây) vs phần SAU KHOÁ.
- AC liên quan: AC-3…AC-8; điểm đổi mặc định cho mọi kho (d-7).

### dung-mot-lenh — sơ đồ tuần tự (sequence)
- Vai: làn ngoài · lệnh (bash) · làn trong (lồng) · lệnh của làn trong · cháu bẫy SIGTERM.
- Bước: hết trần / nhận tín hiệu → làn ngoài THU danh sách hậu duệ theo `ppid` + nhóm → SIGTERM cả
  danh sách → chờ 10 giây → SIGKILL mọi pid còn sống trong danh sách → ghi `repin-do` → thoát 4 / 128+n.
- Chú thích: vì sao thu trước — làn trong bị SIGKILL thì hẹn giờ của nó chết theo.
- AC liên quan: AC-5 (B1–B3), AC-6, G2.
