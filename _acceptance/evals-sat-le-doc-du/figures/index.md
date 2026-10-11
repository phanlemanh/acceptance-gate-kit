# Hình tại Cổng Phạm vi — evals-sat-le-doc-du

Kê từ artifact cuối S1 (sổ quyết định chờ seal + lệch so với ô cơ hội). Ngưỡng N5: ≥ 3 bước nối tiếp hoặc ≥ 2 nhánh rẽ.

| Điểm | Đếm | Hình |
|---|---|---|
| d-…-1 Một bộ đọc danh sách ở lib cho ba bên gọi (T3) | 3 nhánh (lượt chấm · lượt sửa · bộ đọc vùng tệp → ghim lại / lọc / lưới) | `mot-bo-doc.html` |
| d-…-4 Cờ «danh sách không đọc được» đi đâu | 3 nhánh (dòng stderr lượt chấm · thẻ Cổng Phạm vi · thẻ Cổng Bằng chứng) | gộp vào `mot-bo-doc.html` |
| d-…-2 Không giải bí danh YAML | dưới ngưỡng: 1 bước | — |
| d-…-3 Cột khoá = cột chữ `id` | dưới ngưỡng: 1 bước | — |
| Lệch so với ô cơ hội: thêm AC-11 (lưới bên đọc) từ phản biện | dưới ngưỡng: 1 bước | — |

## Đề bài `mot-bo-doc.html`

- Loại hình: data flow (trái → phải), hai lớp: TRƯỚC (bốn bộ đọc tự viết, ba mũi tên đỏ «rơi im lặng / đọc sai») và SAU (một bộ đọc ở lib).
- Nút: `evals.yaml` (ba cách viết: thụt 4 · sát lề · neo/bí danh) → [TRƯỚC] bộ sinh tham số lượt chấm · bộ lập kế hoạch giữ-ô-xanh · bộ đọc vùng tệp ở lib · nhãn bộ chấm mẫu → [SAU] `evalListsOf` (lib) → lượt chấm · lượt sửa · ghim lại/lọc/lưới; nhánh cờ → dòng stderr · thẻ Cổng Phạm vi · thẻ Cổng Bằng chứng.
- Nhãn bằng chữ: «mất inputs/paths, exit 0» · «bỏ paths dạng khối» · «đọc tên neo thành glob» · «cờ vàng có tên».
- AC liên quan: AC-1, AC-4, AC-5, AC-6, AC-8, AC-9.
