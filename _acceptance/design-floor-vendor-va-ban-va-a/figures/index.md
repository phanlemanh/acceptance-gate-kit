# Hình tại Cổng Phạm vi — design-floor-vendor-va-ban-va-a

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 phê CỘNG (đưa mã + bản gói + sổ vá vào kit) — gồm đường từ bản ghim tới bản gói giao đi | 5 bước nối tiếp → cần hình | `duong-vendor.html` / `.png` |
| d-…-2 cách giao: bản gói vs dựng lúc chạy | 2 nhánh, một nhánh chết → dưới ngưỡng: 1 nhánh sống | — |
| d-…-4 danh sách chép 124 → 126 | 1 bước → dưới ngưỡng | — |
| d-…-5 bản vá A chạm 3 tệp | 1 bước → dưới ngưỡng | — |
| d-…-7 pr_upstream → ban_va | 3 nhánh đỏ của bên đọc, cùng một bước → dưới ngưỡng (nêu bằng chữ ở AC-7) | — |

## Đề bài hình `duong-vendor`

- Loại: luồng ngang (pipeline) năm chặng, mỗi chặng một phép đo canh nó ở dưới.
- Chặng: (1) bản ghim upstream `a7ad5f1` (mạng, chỉ khi đổi ghim) → (2) chép 126 tệp của tệp khoá → (3) áp bản vá của sổ LOCAL-PATCHES (A đã áp; B·C·D chờ) → (4) dựng bản gói một tệp `dist/ui.mjs` (vỏ của kit + đóng kín + gói npm ghim) → (5) bộ đo chạy bản gói (DF-01…09).
- Phép đo dưới mỗi chặng: (2) VA-01 + FN-01 · (3) VA-01 băm sau + FN-01 đảo vá · (4) BG-01 dựng lại so byte · (5) DF-07/DF-08 xanh nhờ A; DF-01·03·04·05·06 còn đỏ có chủ đích (chờ B, C).
- Một vạch ngang chia «chỉ khi đổi ghim/đổi vá: dong-bo.mjs --write (có mạng)» với «mỗi PR: CI ngoại tuyến».
- AC liên quan: AC-1, AC-2, AC-3, AC-4, AC-5, AC-9.
