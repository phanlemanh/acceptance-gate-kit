# Hình tại điểm quyết định — khuon-loi (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 · duyệt phần cộng (bộ đọc + lệnh khuôn + dòng thẻ) | 5 bước nối tiếp (S0 đếm · S1 nạp + ghim · bước chấm · sau lượt chấm ghi số đo · thẻ Cổng Bằng chứng) | `khuon-trong-vong.html` |
| Hỏi-2 · thay vế (b) của KH-C1 bằng hai thước | 4 bước nối tiếp (bộ kiểm kit đỏ/im → cắt mốc 2.37.0 → kho nhận cài + 1 vòng giao diện thật → 21 ngày đếm) + 2 nhánh kết (sống · chết → vòng 2 nằm yên) | `hai-thuoc.html` |
| Hỏi-3 · mẫu chữ hay chờ DFK-C1 | dưới ngưỡng: 1 lựa chọn, 2 lối, không bước nối | — |
| Hỏi-4 · lưới khuôn ở s4-args hay chỉ cờ vàng (thêm sau gap-probe) | dưới ngưỡng: 1 lựa chọn, 2 lối, không bước nối | — (hình 1 vẽ trước AC-11 nên không có nút lưới) |

## Đề bài hình 1 — `khuon-trong-vong`

- Loại: flowchart ngang, một làn.
- Nút: «S0 · --dem: khuôn N nhóm» → «S1 · --nap: chỉ mục nhóm + ghim băm (khuon-nap.json)» → «S4 · eval --kiem: lệch / nợ cũ / không đo» → «sau lượt chấm · --write: khuon-cham.json» → «Cổng Bằng chứng: một dòng Khuôn + cờ vàng».
- Nhánh phụ dưới S4: «lint của kho» gọi cùng «bộ đọc ban-do-khuon.cjs» (mũi tên hai nút cùng đọc «design/patterns/<nhóm>.md»).
- Chú thích góc: «không có design/patterns/ → mọi bước im» (AC-8).
- AC: AC-1, AC-2, AC-3, AC-7, AC-8, AC-9, AC-10.

## Đề bài hình 2 — `hai-thuoc`

- Loại: timeline ngang.
- Mốc: «trong vòng: ma trận đỏ + im, 2 mutant (bộ kiểm kit)» → «cắt 2.37.0» → «onehub-quy-hang cài + bước chấm chạy ≥1 vòng giao diện thật» → «21 ngày: đếm vòng đồng nhất lại mới · lệch lọt».
- Hai nhánh cuối: «0 vòng đồng nhất lại · <2 lệch lọt → SỐNG» · «không kho nào chạy / còn sửa tay danh sách / hạ tầng đốt lượt → vòng 2 nằm yên».
- Dải xám phía trên: «vế cũ: răng bắt ≥1 lệch thật qua ≥3 vòng — số bắt tiến về 0 khi răng tốt (0 lệch / 2 vòng có số đo)».
- AC: AC-3, AC-4, AC-5, AC-7 (Đường đo).

PNG: chụp bằng Chrome headless từ chính tệp HTML — `export-diagram` cần Playwright cho Python, máy chưa cài.
