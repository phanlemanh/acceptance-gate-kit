# Điểm quyết định Cổng Phạm vi — nhan-trang-thai-va-reality

| Điểm | Đếm | Hình |
|---|---|---|
| Thẻ Cổng 2 chọn lối theo gốc đỏ (design B2, AC-4…AC-7) | 5 nhánh rẽ | `canh-gay.html` |
| Thước chỉ-đọc trong lượt chấm (design A3, AC-3, AC-4) | 4 bước nối tiếp | `thuoc-chi-doc.html` |
| Hồ sơ đã ký `thuoc-co-cua` mất tiền đề (contract Notes) | 2 nhánh rẽ | dưới ngưỡng: câu hỏi hai lối, trình bằng chữ |
| Sáu dòng sổ chờ seal (3 approach · 3 descope) | 0 bước | dưới ngưỡng: mỗi dòng một câu |
| `[GIẢ ĐỊNH]` «đã thử lại» = hai dòng cùng round | 0 bước | dưới ngưỡng |

## Đề bài `canh-gay`
- Loại: flowchart quyết định (một đầu vào, năm đầu ra).
- Nút vào: «báo cáo lượt chấm». Rẽ: verdict PASS/PENDING → «thẻ như hôm nay» · REJECT → «khoá (như hôm nay)» · BLOCKED → rẽ theo nhãn mục chặn.
- Nhánh BLOCKED: «không phân loại được» → khoá như hôm nay · «hệ thống chết, lần đầu» → khoá, máy thử lại một lần · «hệ thống chết, đã thử lại» hoặc «không đọc được ở đây» → «ô ký MỞ: tên · ba lối · giá».
- Nhánh thêm trước mọi rẽ: có dòng «thước lệch» → khoá, chấm lại.
- AC: AC-4, AC-5, AC-6, AC-7.

## Đề bài `thuoc-chi-doc`
- Loại: sequence/quy trình bốn bước.
- Bước: (1) s4-args chụp thước (evals.yaml · rang/ · config.yaml · test kho) → `.acceptance-runs/<slug>/thuoc-truoc.json` · (2) Workflow chấm · (3) thuoc-vat --write chụp lại, so theo băm · (4a) khớp → không dòng · (4b) lệch → dòng «thuoc-lech», thoát 5 → thẻ nhãn «thước lệch».
- Ghi chú: chạm mtime cùng byte, hoặc tệp .md của hồ sơ → im.
- AC: AC-3, AC-4.
