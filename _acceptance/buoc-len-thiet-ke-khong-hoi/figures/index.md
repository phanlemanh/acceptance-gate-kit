# Hình tại điểm quyết định — buoc-len-thiet-ke-khong-hoi (Cổng Phạm vi)

Kê từ vật cuối S1: sổ quyết định (16 dòng chờ chốt, trong đó 3 câu hỏi cho người, 3 dòng bị thay) ·
chỗ lệch spec gốc (ô cơ hội: ứng viên 8, 9, 10 không vào hợp đồng) · gap-probe không còn mục `human-gate1`
· Coverage không có dòng `[GIẢ ĐỊNH]`.

| Điểm | Đếm | Hình |
|---|---|---|
| Cơ chế: một lựa chọn ở bước thiết kế đi tới đâu (phân loại → máy quyết / câu hỏi / đỏ → thẻ → duyệt hoặc lật) | 4 nhánh + 4 bước nối tiếp | `co-che.html` |
| Ba câu hỏi cho chủ kho (phần CỘNG · câu gộp áp lối khác · bỏ bản mẫu nhìn), mỗi câu hai lối có giá | 3 × 2 nhánh | `ba-cau-hoi.html` |
| Ứng viên 8, 10 của ô không vào hợp đồng (dòng bỏ có căn cứ) | 1 bước, không rẽ — dưới ngưỡng: 1 | — |
| 13 dòng máy đã quyết còn lại | mỗi dòng 1 lựa chọn đã quyết — dưới ngưỡng: 1 | — (thẻ in từng dòng kèm căn cứ) |

## Đề bài `co-che.html` (sơ đồ luồng, ≤ 5 dòng)
- Nút: «Lựa chọn ở bước thiết kế» → «Trỏ được căn cứ có từ trước vòng?» / «Chỉ còn một lối?» / «Chỉ người biết hoặc khó-đảo?» → «Máy quyết, ghi sổ kèm căn cứ» / «Thành câu hỏi Hỏi-n» / «Đỏ — dòng lệnh duyệt để trống».
- Tiếp: hai nhánh đầu vào khối «Máy đã quyết — anh lật được», nhánh câu hỏi vào «Câu chỉ anh trả lời được»; cả hai tới «Thẻ Cổng Phạm vi» → «duyệt» (nhận khuyến nghị) hoặc «sửa:» → «dòng lật ghi sổ (đếm cho ngưỡng)».
- Nhãn chữ thường, không tên tệp. AC: AC-1, AC-4, AC-5, AC-7.

## Đề bài `ba-cau-hoi.html` (cây lựa chọn, ≤ 5 dòng)
- Ba nhánh gốc: Hỏi-1 «Duyệt phần CỘNG?» · Hỏi-2 «Câu gộp áp lối khác: hàng sau hay làm ngay?» · Hỏi-3 «Bỏ bản mẫu nhìn?».
- Mỗi nhánh hai lá: lối máy khuyên (tô đậm) và lối khác, mỗi lá một dòng giá.
- Hỏi-1 khuyên: duyệt (giữ chiều đỏ) — khác: chỉ viết lại lời dặn, mất chiều đỏ, bỏ 7 tiêu chí.
- Hỏi-2 khuyên: hàng riêng ngay sau — khác: làm ngay, chạm lệnh duyệt, thêm ~2 tiêu chí. Hỏi-3 khuyên: bỏ, nhìn ảnh ở Cổng Bằng chứng — khác: chạy bản mẫu, thêm một lượt gọi (vượt trần 4).
- AC: AC-1, AC-5, AC-9.
