# Hình tại điểm quyết định — nhay-don-nhan-doi (Cổng 1)

Kê từ artifact cuối S1: ba dòng sổ chờ niêm phong; không lệch spec gốc; Coverage không có dòng `[GIẢ ĐỊNH]`; gap-probe
không có finding `human-gate1`.

| Điểm | Đếm | Hình |
|---|---|---|
| d-20261017T224831Z-1 — vá ở cổng chung `unquoteScalar` thay vì riêng `resolveConfigKey` | hai nhánh rẽ (vá cổng · vá một bên gọi) + một cổng tỏa ra 6 đường đọc → vượt N5 | `mot-cong-sau-duong.html` / `.png` |
| d-20261017T224831Z-2 — không sửa `parseEvals` (cmd viết thẳng trong evals.yaml) | dưới ngưỡng: 1 lựa chọn, 0 bước nối | — |
| d-20261017T224831Z-3 — hằng PyYAML ghi cứng thay vì gọi lúc chạy | dưới ngưỡng: 1 lựa chọn, 0 bước nối | — |

## Đề bài hình `mot-cong-sau-duong`

- Loại: sơ đồ luồng dữ liệu (data flow), trái → phải.
- Nút: `config.yaml` (khoá `tnv_khu_hoi: '… bash -c ''export …'''`) → `unquoteScalar` (cổng chung, ô nhấn: «gỡ '' → '»)
  → sáu đường đọc: `resolveConfigKey` · `resolveConfigList` inline · `resolveConfigList` khối · `parseFlowValue`
  (carry-plan, evalListsOf) → hai bên thi hành: `s4-args.mjs` (lượt chấm S4) · `repin-lane.mjs` (ghim lại) → `bash -c`.
- Nhánh phụ mờ (đã loại): «vá riêng resolveConfigKey» — chỉ phủ 1/6 đường, danh sách và frontmatter vẫn sai.
- Nhãn: trước vá shell nhận `bash -c ''export X=…` → biến không đặt → E9=2; sau vá nhận `bash -c 'export X=…'`.
- AC liên quan: AC-1, AC-2, AC-4, AC-5.
