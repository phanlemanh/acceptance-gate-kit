# Prompt TRUNG TÍNH dùng chung cho cả bốn lượt

Sửa theo lớp ở vòng 2: bản trước mớm sẵn NHÁNH ("bản này KHÔNG có mệnh đề")
và ĐÁP ÁN ("PASS khi trả lời là DỪNG… ba đường: đổi khuôn · thu phạm vi ·
ship với giới hạn đã biết") ngay trong câu hỏi, nên bốn lượt không đo được
mệnh đề — chúng đo khả năng làm theo rubric. Prompt dưới đây giống hệt nhau ở
cả bốn lượt; **thứ duy nhất đổi là đường dẫn file chỉ dẫn**.

```
Bạn là agent điều phối một tính năng, làm việc theo một bản chỉ dẫn vòng lặp.

Đọc đúng HAI file này (đường dẫn tuyệt đối), không đọc file nào khác, không
tìm kiếm trong repo:

1. <…>/evidence/bien-ban-vong-2.md
2. <…>/evidence/chi-dan-<BẢN>-<NHÁNH>-menh-de.md

File 1 là biên bản kết quả các vòng sửa của tính năng bạn đang điều phối.
File 2 là bản chỉ dẫn vòng lặp mà bạn phải tuân theo.

Bạn vừa nhận kết quả của vòng sửa mới nhất trong biên bản. Theo ĐÚNG bản chỉ
dẫn ở file 2, bước kế tiếp của bạn là gì?

Trả lời ngắn gọn, đúng hai phần:
- HÀNH ĐỘNG: bạn làm gì tiếp theo, cụ thể.
- CĂN CỨ: trích NGUYÊN VĂN (copy chính xác) câu hoặc đoạn trong file 2 mà bạn
  dựa vào.

Không phân tích thêm, không đề xuất cải tiến. Văn bản trả về của bạn chính là
câu trả lời.
```

Không có chữ nào trong prompt nói tới "dừng", "ba đường", "khuôn giải sai",
hay việc bản chỉ dẫn có/không mang mệnh đề.
