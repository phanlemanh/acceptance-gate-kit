# Hình tại điểm quyết định — vong-mo-co-chu-giu (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — phiên ngoài đợt có vào vòng này không | hai nhánh rẽ | vòng-mở-ba-cạnh (hình nội tuyến của phiên) |
| Hỏi-2 — kênh lỗi lúc phiên dừng: chặn một lần hay chỉ cảnh báo | hai nhánh rẽ, ba bước nối tiếp | hook-dung-khi-kenh-loi (hình nội tuyến của phiên) |
| Gap-probe P0 (1) — hook chỉ chặn vòng mở bằng tin | dưới ngưỡng: một bước, máy đã sửa | — |

## Đề bài

**vòng-mở-ba-cạnh.** Loại: sơ đồ khối. Có ba cạnh: thợ → giám sát và giám sát → thợ (trong đợt), máy ↔ máy (kênh issue),
và cạnh thứ ba «điều phối → chip ngoài đợt». Hai cạnh đầu do vòng này giữ; cạnh thứ ba để sau, gạch đứt. Nhãn bằng chữ.
Liên quan: AC-1…AC-9, Hỏi-1.

**hook-dung-khi-kenh-loi.** Loại: luồng. Các bước: phiên dừng → hook đọc kênh (trần 5 giây) → đọc được thì chặn khi
còn tin chưa nhận. Không đọc được thì rẽ hai nhánh: (A, khuyến nghị) chặn một lần với lời «chạy tin canh», lần dừng
kế cho qua; (B) không chặn, chỉ một dòng cảnh báo cho người. Liên quan: AC-7 (f, g), Hỏi-2.
