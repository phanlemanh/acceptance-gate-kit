# Hình tại điểm quyết định — Cổng Phạm vi `ho-so-nghi` (T3)

Kê từ artifact cuối S1 (sổ quyết định chờ seal · lệch so spec gốc · `[GIẢ ĐỊNH]` trong Coverage · gap-probe `human-gate1`), đếm theo ngưỡng N5: ≥3 bước nối tiếp hoặc ≥2 nhánh rẽ → cần hình.

| Điểm | Đếm | Hình |
|---|---|---|
| Chọn đường B (dòng sổ) thay A (status mới) và C (thư mục sử liệu) — sổ d-…-1 | 3 nhánh rẽ | `ba-duong.png` |
| Một hàm, bốn bộ đọc: dòng sổ → `hoSoNghi` → cổng / kiểm lại / bộ quét → bản đồ · thẻ | 3 bước nối tiếp, 4 nhánh | `mot-ham-bon-bo-doc.png` |
| Bản đồ không thêm khối: `da-nghi` chiếu vào «Đã giao», chưa thông chiếu vào «Đã bác» — sổ d-…-4 | 2 nhánh rẽ | `chieu-ban-do.png` |
| Fail-closed: dòng thiếu vế · văn xuôi · lib vắng → chấm như đang sống | dưới ngưỡng: 3 đầu vào một kết luận, 0 nhánh | — |
| Bỏ đặc tả UX, bỏ đo supersedes — sổ d-…-2, d-…-3 | dưới ngưỡng: 1 nhánh mỗi điểm | — |
| `[GIẢ ĐỊNH]` trong Coverage | 0 | — |

## Đề bài từng hình (≤5 dòng)

**ba-duong** — loại: bảng so ba cột (disposition map). Nút: A `status: retired` · B dòng sổ nghỉ · C thư mục su-lieu. Nhãn hàng: chữ ký là sử liệu · kho chạy bản cũ · cổng đọc được. B được chọn, A và C gạch kèm lý do một dòng. AC liên quan: AC-1, AC-7.

**mot-ham-bon-bo-doc** — loại: luồng (flowchart). Nút: `decisions.jsonl` dòng `type: nghi` (by · decision · at) → `hoSoNghi()` trong `lib/workspace-record.cjs` → bốn nhánh: cổng trước-merge (NOTE, bỏ 3 luật) · kiểm lại bằng chứng (NOTE, bỏ kiểm) · bộ quét (`da-nghi`) → bản đồ «Đã giao» · thẻ (dòng «đã nghỉ», không mời ký). Nhánh phụ từ hàm: «thiếu vế / văn xuôi / lib vắng → chấm như đang sống». AC: AC-1…AC-6.

**chieu-ban-do** — loại: hai nhánh nhỏ (decision). Nút: hồ sơ nghỉ → đã thông Cổng 2? → có: `da-nghi` → khối «Đã giao» · không: `da-dong-ho-so` → khối «Đã bác từ khám phá». Ghi chú: tập khối bản đồ không đổi vì bộ kiểm bản đồ ở kho đếm khối cố định. AC: AC-5.
