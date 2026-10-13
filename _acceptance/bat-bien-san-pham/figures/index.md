# Hình tại điểm quyết định — bat-bien-san-pham (Cổng Phạm vi)

Kê từ artifact cuối S1: 14 dòng sổ chờ seal (12 máy đã quyết · 2 câu chỉ-người) · 0 dòng `[GIẢ ĐỊNH]` ở
Coverage · 0 finding phản biện `human-gate1`.

| Điểm | Đếm | Hình |
|---|---|---|
| Cơ chế cả vòng: tệp luật → nạp ở thiết kế → câu hỏi Cổng Phạm vi; diff → bộ soi → ô SP ở Cổng Bằng chứng | 5 bước nối tiếp, 2 nhánh rẽ (theo luật / phạm luật) | cần hình — `co-che` |
| Hỏi-1: bỏ bản mẫu nhìn | 2 nhánh, 1 bước | dưới ngưỡng: lựa chọn nhị phân một bước, chữ trên thẻ đủ |
| Hỏi-2: điền sẵn «sửa vật» ở ô SP | 2 nhánh, 1 bước — nằm trong hình `co-che` (nhánh Cổng Bằng chứng) | gộp vào `co-che` |
| 12 lựa chọn máy đã quyết | mỗi dòng 1 bước | dưới ngưỡng |

## Đề bài `co-che`

- Loại: flowchart hai làn (bước thiết kế · lượt chấm) hội về hai thẻ cổng có sẵn.
- Nút: PRODUCT-INVARIANTS.md (của kho) → dòng nạp ở bước thiết kế → lựa chọn «theo luật» (máy đã quyết, mã SP cạnh căn cứ) | «phạm luật» (câu hỏi «Phạm luật SP-n» trên thẻ Cổng Phạm vi); diff của vòng → bộ soi dấu hiệu → luat-cham.json → khối «Luật sản phẩm bị chạm» + ô «SP-n: sửa vật» trên thẻ Cổng Bằng chứng.
- Nhánh phụ: kho không có tệp → «không đổi gì» (đường tắt xám).
- Ghi chú trên hình: máy không sửa tệp luật · không thêm cổng.
- AC liên quan: AC-2, AC-3, AC-5, AC-8, AC-10.
