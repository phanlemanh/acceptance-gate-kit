# Hình tại điểm quyết định — design-gate-che-do-chat (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1: phê CỘNG cờ `--require-measured` + mã 5 (sổ d-…-7, gap-probe P0 human-gate1) | 3 nhánh rẽ → cần hình | `hoi-1-ba-loi.html` |
| d-…-3 cờ phủ cả dom, quyết trước jsdom | 1 lối, 2 bước → dưới ngưỡng | — |
| d-…-8 mã riêng 5 | 1 lối (mã khác đều chết) → dưới ngưỡng | — |

## Đề bài `hoi-1-ba-loi`

- Loại: cây quyết định ngang, một gốc ba nhánh (decision tree).
- Gốc: «eval gọi design-gate trên .tsx — hôm nay: KHONG-DO-DUOC mà mã 0 → xanh rỗng (crm 61 eval, artifact-platform 23 khoá dom)».
- Nhánh A (khuyến nghị, tô nhấn): «Phê cờ --require-measured · mã 5» → «không kho nào đổi màu khi nhận bản» → «kho tự thêm cờ khi muốn chặn: crm 57 eval đỏ (mã 1 qua vòng `|| exit 1`)».
- Nhánh B: «Không phê — kho tự đọc do_duoc (bậc 1)» → «kit 0 dòng» → «mỗi kho tự viết bộ đọc JSON bọc lệnh».
- Nhánh C: «Đổi mặc định» → «mọi kho đổi màu ở lượt ghim kế» → «crm 57 eval + artifact-platform 23 khoá đỏ cùng lúc».
- AC liên quan: AC-1, AC-4, AC-5, AC-8.
