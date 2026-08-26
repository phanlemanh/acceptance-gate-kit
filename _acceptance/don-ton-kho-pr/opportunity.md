---
schema_version: 1
slug: don-ton-kho-pr
feature: Dọn tồn kho PR — danh sách PR mở phải nói đúng việc đang chạy, không phải kho hàng cũ
owner: manh@mstar.vn
stage: discovery
decision:
decided_by:
decided_at:
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Người hưởng: **chủ kho** — người mở danh sách PR để biết đang có gì chạy dở.

Ngày 26/08 kho mở **tám** PR, tuổi 1 đến 21 ngày. Soi từng cái thì chúng là **bốn
nhóm khác hẳn nhau**, và danh sách không phân biệt được:

- ba cái chỉ tài liệu, cổng xanh, gộp được ngay;
- hai cái không chạm engine nhưng chưa lượt kiểm nào chạy;
- một cái **nội dung đã bị vượt qua** — nó ghi «ghim lại lần 3» trỏ mốc cũ trong
  khi `main` đã ở lần 5, nên gộp thẳng là **lùi mốc ghim**;
- hai cái 21 ngày mà một cái sửa **cây song sinh đã lưu kho**, cái kia **tự khai
  là bàn luận chứ không phải hàng chờ gộp**.

Cái giá không phải ở dung lượng mà ở **lời nói dối của danh sách**: nhìn vào tưởng
có tám việc đang chạy, thật ra có hai. Và một trong tám nếu gộp nhầm sẽ phá đúng
thứ nghi thức ghim-lại sinh ra để giữ.

## Vì sao bây giờ

Hai ô vừa ship (làn máy · design-pass) đều chạm engine, nên mọi nhánh cũ đều lùi
xa thêm. Càng để lâu, khoảng cách càng lớn và «gộp» càng biến thành «viết lại».

## Đã làm trong đợt này (26/08)

- **Đóng hai** cái 21 ngày, mỗi cái kèm lý do và chỗ đi tiếp nếu còn muốn.
- **Gộp năm** cái thuộc nhóm rẻ (ba cái cổng đã xanh, hai cái chỉ cần chạy cổng).
- **Để lại một** cái phải tách làm lại vì nội dung đã bị vượt qua.

Phát lộ khi làm: gộp năm PR liên tiếp làm **bản đồ xưởng lệch** — mỗi PR mang bản
đồ đúng TẠI LÚC nó gộp, nên từ lượt thứ hai trở đi bản đồ trên `main` thiếu hồ sơ
mà lượt trước vừa thêm. Cổng của từng PR xanh thật, `main` vẫn đỏ. Đây là hiệu ứng
dây chuyền của một **tệp máy sinh** qua các lượt gộp nối nhau, cùng họ với hiệu
ứng dây chuyền của mốc ghim bằng chứng.

## Ngưỡng

- **Sống:** số PR mở về **≤ 2**, và mỗi cái còn lại trả lời được «đang chờ ai, chờ
  gì». PR không trả lời được câu đó là tồn kho, không phải việc đang chạy.
- **Chết:** một PR bị gộp nhầm làm hỏng mốc ghim hoặc dựng lại cây đã lưu kho.

## Ngoài phạm vi

- Không tự viết lại nội dung của hai PR đã đóng — viết lại là ô riêng có tiêu chí
  của nó.
- Không dựng cơ chế tự động chặn PR quá hạn: chưa biết ngưỡng đúng, và một luật
  đặt sai còn tệ hơn không có.
