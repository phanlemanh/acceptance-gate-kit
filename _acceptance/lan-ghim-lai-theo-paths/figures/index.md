# Hình tại Cổng Phạm vi — lan-ghim-lai-theo-paths

| Điểm | Đếm | Hình |
|---|---|---|
| d-1 bộ lọc đặt SAU luật cũ (chỉ thu) + d-4 cờ chiến dịch + d-2 hợp gồm ô ngoài làn máy + ma trận M (hồ sơ nào giữ luật cũ) | 4 bước nối tiếp, 4 nhánh rẽ | `duong-hoa-cu.html` |
| d-3 hai khoá mặc định TẮT | dưới ngưỡng: 1 nhánh | — |
| d-5 bỏ đặc tả UX | dưới ngưỡng: 0 | — |
| d-6 không chọn theo đồ thị phụ thuộc | dưới ngưỡng: 1 nhánh | — |
| d-7 lib mang bản khớp glob riêng | dưới ngưỡng: 1 nhánh | — |
| [GIẢ ĐỊNH] suite crm song song cùng mã thoát | dưới ngưỡng: 0 | — |

## Đề bài `duong-hoa-cu`

- Loại: flowchart dọc, một đường chính + các nhánh rẽ về «luật cũ».
- Nút chính: «Tệp đổi từ pin» → «Luật cũ: bỏ `_acceptance/` + `t1_skip_globs`» → «Bộ lọc theo `paths`» → «Còn tệp? → hoá cũ / không → NOTE bỏ qua (slug + tệp)».
- Nhánh rẽ về «giữ danh sách luật cũ»: khoá vắng/`all` · cờ chiến dịch `--stale-all` · không chạy được bộ lọc (thiếu node/lib, lỗi → NOTE) · hồ sơ: eval máy thiếu `paths` / không có hoặc hỏng `evals.yaml` / hợp `paths` rỗng.
- Chú thích: hợp `paths` gồm cả ô ui-check/judgment; bộ lọc chỉ BỚT dòng nên không thể đỏ chỗ hôm nay xanh.
- AC liên quan: AC-1…AC-7, AC-10.
