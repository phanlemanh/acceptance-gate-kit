# Hình tại Cổng Phạm vi — pre-merge-doc-lib-theo-kit

| Điểm | Đếm | Hình |
|---|---|---|
| d-…-2 bộ giải: cạnh script trước, gốc kho sau | 2 nhánh rẽ × 3 bố cục kho → cần hình | `bo-giai-thu-vien.html` |
| d-…-3 giữ đường lùi về gốc kho | dưới ngưỡng: 1 nhánh (nằm trong hình trên) | — |
| d-…-4 sửa ở kit, không bắt kho chép | dưới ngưỡng: 1 bước | — |
| d-…-5 hạng T3 | dưới ngưỡng: 1 bước | — |
| d-…-6 không sửa bộ dựng kho thử cũ | dưới ngưỡng: 1 bước | — |
| d-…-7 bỏ coverage-scan | dưới ngưỡng: 1 bước | — |

## Đề bài `bo-giai-thu-vien`

- Loại hình: flowchart quyết định (một ô hỏi, hai nhánh) + ba làn kho ở dưới.
- Nút: «lưới cần tệp thư viện X» → hỏi «X có cạnh script không?» → có: «đọc X cạnh script (cùng bản với script)» · không: «đọc lib/X của gốc kho (như trước vòng)».
- Ba làn kết quả: kho cài theo plugin (không lib/) → nhánh có → qua lưới · kho có lớp chép, chạy bản chép → nhánh có, X cạnh script CHÍNH là bản chép → không đổi · script chép lẻ thiếu thư viện → nhánh không → như trước vòng.
- Nhãn bằng chữ tiếng Việt, không tên hàm. AC liên quan: AC-1, AC-2, AC-3, AC-4.
