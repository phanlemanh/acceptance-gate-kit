# Hình tại điểm quyết định — lan-v-giu-loi-trong-hop-dong

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 mức lỗi nào giữ hồ sơ | 2 nhánh rẽ (mọi mức · từ mức vừa) | `duong-phan-xet` |
| Hỏi-2 hồ sơ đã máy thông qua từ trước | 2 nhánh rẽ (chỉ xét khi đổi trong PR · xét lại tất cả) | `duong-phan-xet` |
| Hỏi-3 hồ sơ đã chấm chưa ký | 2 nhánh rẽ (giữ ở mọi PR · chỉ khi đổi trong PR) | nằm ở nhánh «Chưa» của `duong-phan-xet` |
| Bộ đọc đặt ở lõi | 0 nhánh, 1 bước | dưới ngưỡng: 0 nhánh · 1 bước |
| Vế mới đứng ở đuôi luật | 0 nhánh, 1 bước | dưới ngưỡng: 0 nhánh · 1 bước |
| Mục sai khuôn thì giữ | 1 nhánh, 1 bước | dưới ngưỡng: 1 nhánh · 1 bước |

## Đề bài `duong-phan-xet`

- Loại hình: flowchart một trang, đọc dọc, nói tiếng sản phẩm, không tên hàm hay tên tệp.
- Nút vào: «Hồ sơ T2 có phán quyết đạt, chưa có chữ ký người».
- Rẽ 1: «Máy đã thông qua hồ sơ này từ trước?» → có, và PR không đổi hồ sơ: «Không xét lại, đi tiếp» (nhãn Hỏi-2). Có, và PR đổi hồ sơ: đi tiếp xuống Rẽ 2. Chưa: đi tiếp xuống Rẽ 2.
- Rẽ 2: «Mục lỗi trong hợp đồng nói gì?» → không có lỗi: «Đi tiếp không cần ký». Có lỗi, ở bất kỳ mức nào: «Giữ lại, người phải đọc và ký» (nhãn Hỏi-1). Có chữ mà máy không đọc được: «Giữ lại, người soi».
- Ghi chú dưới hình: «Hồ sơ đã có chữ ký người không đi qua sơ đồ này». AC liên quan: AC-1, AC-3, AC-4, AC-5, AC-6.
