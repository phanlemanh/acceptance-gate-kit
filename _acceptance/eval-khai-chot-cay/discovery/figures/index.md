# Kê điểm quyết định + đếm ngưỡng N5 — eval-khai-chot-cay

Máy kê từ tạo phẩm cuối S1: 6 entry sổ chờ seal · 1 finding gap-probe xử lý
`human-gate1` · 0 dòng `[GIẢ ĐỊNH]` trong Coverage. Không kê AC/GWT từng dòng.

| Điểm | Đếm | Hình |
|---|---|---|
| Chọn lối A trong bốn lối (A · B · C · D) — sổ dòng 1 + 4 | **4 nhánh rẽ** → vượt | `bon-loi.html` |
| Đường lùi cho 11 hồ sơ đã ký: cờ vàng ↔ VIOLATION (hai tiền lệ kéo hai phía) | **2 nhánh rẽ** → vượt | gộp vào `bon-loi.html` (là trục dọc của hình) |
| Nghĩa vụ do MÁY DÒ kích hoạt, do NGƯỜI KHAI trả — sổ dòng 2 + 3 + 6 | **5 bước nối tiếp** → vượt | `dong-chay-nghia-vu.html` |
| `errs` phải có bộ đọc (AC-13, sinh từ phản biện) | 2 bộ đọc + 1 đường rơi thầm → vượt | gộp vào `dong-chay-nghia-vu.html` |
| Nếp `surfaces` của kit (finding P1 `human-gate1`) | dưới ngưỡng: 1 quyết định nhị phân, 0 bước trung gian | — |
| Bỏ đặc-tả-UX (sổ dòng 5) | dưới ngưỡng: ca rỗng | — |

## Đề bài hình 1 — `bon-loi.html`

- loại hình: **so ngưỡng / bảng quyết định bốn lối** (không phải flowchart)
- nút: A «khai + lint hẹp + đếm» · B «chỉ đếm» · C «chặn ở tầng cưỡng chế» · D «kit ship helper»
- nhãn bằng chữ, mỗi lối hai dòng: ĐƯỢC GÌ / MẤT GÌ, lấy nguyên văn từ bảng mục 6 design doc
- đánh dấu A là khuyến nghị; đánh dấu C bằng số **11 hồ sơ đã ký đỏ ngay**
- AC liên quan: AC-11 (sàn hồi quy) là thứ lối C phá vỡ

## Đề bài hình 2 — `dong-chay-nghia-vu.html`

- loại hình: **luồng** từ trái sang phải, một nhánh rẽ ba
- nút theo thứ tự: `evals.yaml cmd` → `giải config: ref` → `bộ dò HẸP` → rẽ ba theo
  `tree_pin`: «khai có chốt» · «khai none + lý do» · «VẮNG» → hai bộ đọc:
  `W9 cờ vàng ở Cổng Phạm vi` và `dòng đếm ở Cổng Bằng chứng`
- vẽ thêm nhánh thứ tư `khai SAI` đi vào `errs` → CẢ HAI bộ đọc (AC-13)
- vẽ nhánh «bộ dò IM» bằng nét đứt, nhãn «giới hạn đã khai: URL trốn trong config con»
- AC liên quan: AC-3 (bộ dò) · AC-4/AC-5 (W9) · AC-9 (dòng đếm) · AC-13 (errs)
