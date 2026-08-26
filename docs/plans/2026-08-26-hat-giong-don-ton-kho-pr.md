# Hạt giống — dọn tồn kho PR (26/08)

Kho đang mở **tám** PR, tuổi từ 1 đến 21 ngày. Soi từng cái thì thấy đây không
phải «tám việc chờ gộp» mà là **bốn nhóm khác hẳn nhau**, và gộp nhầm nhóm sẽ
làm hỏng thứ vừa dựng.

## Nhóm 1 — gộp được ngay (3)

Chỉ tài liệu và hồ sơ cơ hội, **không chạm engine**, cổng đã xanh, gộp thử sạch.

| PR | Nội dung |
|---|---|
| #60 | tổng kết 16/08 + đề bài đợt 3 |
| #105 | mở ô «thẻ xếp nhầm ô sẽ làm» |
| #108 | mở ô «nghi thức hình ở mọi cổng dừng-chờ-người» |

Không cần quyết gì. Rủi ro gần bằng không, đường đảo là hoàn tác một lượt gộp.

## Nhóm 2 — chạy cổng rồi gộp (2)

Không chạm engine, nhưng **chưa lượt kiểm nào chạy**.

| PR | Nội dung |
|---|---|
| #96 | khảo sát bậc 3 cho biến thể agent của lái-thử (có bản mẫu kèm) |
| #97 | hạt giống «vlm-assert phải khai là bản nhận-nuôi» |

Việc cần làm là bấm cho cổng chạy rồi gộp, không phải quyết gì.

## Nhóm 3 — nội dung ĐÃ BỊ VƯỢT QUA (1)

**#102** ghi «ghim lại lần 3» trỏ về một mốc cũ. Trên `main` hồ sơ ấy đã ở **lần
5**, trỏ mốc mới hơn. Gộp thẳng là **lùi mốc ghim** và chèn một bản ghi trùng —
tức làm hỏng đúng thứ nghi thức ghim-lại sinh ra để giữ.

Phần còn lại của #102 (đóng cổng Giá trị đang treo) có thể vẫn cần. Việc đúng là
**tách phần đó ra một PR mới trên `main` hiện tại**, rồi đóng #102.

## Nhóm 4 — cần quyết của người (2)

| PR | Vì sao không tự quyết được |
|---|---|
| #24 (21 ngày) | Nó sửa **cây song sinh đã lưu kho** từ 12/08. Gộp là **dựng lại bản sao phải giữ đồng bộ** — thứ hiến pháp kho đã bỏ. Nội dung có thể vẫn đúng, nhưng phải viết lại cho một cây nguồn. |
| #26 (21 ngày) | Chính nó tự khai *«CHƯA MERGE ĐƯỢC — mở để đọc và bàn»*, chưa qua cổng, chưa chữ ký. Nó là **bàn luận**, không phải hàng chờ gộp. Và 3139 dòng chạm engine sống, sau 21 ngày engine đã đổi nhiều. |

Câu hỏi cho người: **việc trong hai PR này còn muốn không?** Còn thì mở ô mới
trên `main` hiện tại; không thì đóng có lý do. Cả hai đều KHÔNG nên gộp nguyên
trạng.

## Cái chip này KHÔNG làm

- Không gộp #24 và #26 nguyên trạng — xem nhóm 4.
- Không tự viết lại nội dung của chúng: viết lại là một ô riêng có tiêu chí của nó.
- Không đụng mốc ghim đã có trên `main`.

## Thước

Sau chip: số PR mở về **≤ 2**, và mỗi PR còn lại phải trả lời được «đang chờ ai,
chờ gì». PR không trả lời được câu đó là tồn kho, không phải việc đang chạy.
