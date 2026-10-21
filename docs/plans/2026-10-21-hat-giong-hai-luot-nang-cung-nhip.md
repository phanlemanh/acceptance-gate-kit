# Hạt giống — hai lượt nặng được cấp cùng một nhịp trên cùng một số chỗ trống

Gốc: acceptance-gate-kit/_acceptance/suc-khoe-cho-trong-va-toc-do/ — `review-findings.md` lượt chấm 1, mục Ngoài-6
(«Hai lane nặng (s4 và duong-nen) được cấp cùng một nhịp dựa trên cùng một số chỗ trống, không trừ phần lane kia sẽ
dùng», tệp `dieu-phoi/scripts/phat-lich.mjs`). Chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 2026-10-21; theo luật
kho, lối ấy ghi hạt giống này, KHÔNG tạo ô. Hợp đồng của ô gốc trích lại tệp này ở `## Notes`.

## Người dùng gặp gì

Khi một lượt chấm và một lượt đường nền cùng chờ, bộ phát lịch xét cả hai với cùng một số chỗ trống đọc đầu nhịp và có
thể cấp cả hai, dù chỗ trống chỉ đủ cho một. Máy rơi vào đúng tình trạng nghẹt mà thước chỗ trống sinh ra để tránh;
lượt nào chạy lúc nghẹt thì được gắn nhãn và chấm lại, nên hại là phút máy, không phải phán quyết sai.

## Vì sao không sửa trong vòng SK1

Phạm vi đã duyệt chỉ hứa xét chỗ cho TỪNG loại lượt (AC-3); không tiêu chí nào nói về hai lượt cùng nhịp. Nghiệm cần
trừ dần nhu cầu đã cấp khỏi chỗ trống trong cùng nhịp (và chọn thứ tự khi không đủ cho cả hai) — một quyết định về ưu
tiên giữa hai loại lượt, kèm ca đo hai lượt chồng nhau.

## Ngưỡng mở ô

≥ 1 lần trong sổ đo của một máy có hai dòng `chong: true` cấp cùng một nhịp mà ít nhất một dòng `ha_tang: true` — tức
cấp chồng đã thật sự làm hỏng một lượt. Đếm bằng `dieu-phoi.mjs hieu-chuan` cùng sổ `do-lan.jsonl`.
