# Hình tại điểm quyết định — cong-nguoi-doc-du-nguon

Kê theo bước [1]–[2] của nghi thức. Nguồn: `contract.md`, sổ quyết định, design doc.
Hình là CHIẾU của nguồn chữ, không bao giờ là nguồn.

| Điểm quyết định | Đếm N5 | Hình |
|---|---|---|
| `d-…-4` Đường đọc-cũ neo vào khoá `findings_open` | **4 nhánh rẽ** (khoá khớp/lệch/vắng × vật rỗng/có) | `luat-thu-bay.html` |
| `d-…-6` + `d-…-7` Một bộ đọc cho mỗi vật, hai bên cùng rút | **4 bước nối tiếp** (vật → bộ đọc → vị từ → hai bản dựng) | `mot-bo-doc.html` |
| `d-…-5` Widen cross-layer không đường đọc-cũ | 1 nhánh, căn cứ là một con số | dưới ngưỡng: 1 |
| `d-…-3` Hoãn `parseEvals` | 1 nhánh, có ngưỡng mở lại | dưới ngưỡng: 1 |
| `d-…-1`, `d-…-2` Bỏ đặc-tả-UX và design-pass | 0 nhánh (không surface web-UI) | dưới ngưỡng: 0 |

## Đề bài hình 1 — `luat-thu-bay.html`

Loại: bảng quyết định (cây rẽ nhánh 2 tầng).
Nút: `review-findings.md` có n mục → báo cáo có khoá `findings_open`? → khoá khớp n?
Bốn lá, nhãn bằng chữ người đọc: **xanh-sạch** · **VIOLATION — mời ký** ·
**VIOLATION — lời khai lệch vật** · **NOTE + cờ vàng — hồ sơ đời trước**.
Ghi rõ một nhánh phụ: cửa GHI (`khong-can-nguoi --write`) KHÔNG đi qua khoá, luôn đọc vật.
AC liên quan: AC-1, AC-4, AC-5, AC-6.

## Đề bài hình 2 — `mot-bo-doc.html`

Loại: sơ đồ luồng ngang, 4 tầng.
Nút: hai VẬT (`review-findings.md` · mục tiêu chí của `contract.md`) → hai BỘ ĐỌC
(`lib/out-of-contract.cjs` · `lib/ac-line.cjs`) → vị từ dùng chung trong
`lib/evidence-core.cjs` → năm BÊN ĐỌC (`pre-merge-check.sh` · `khong-can-nguoi.mjs` ·
`gate-card.js` · `eval-coverage-lint.js` · `evidence-page.js`).
Đánh dấu bằng chữ, không bằng màu đơn thuần: đường nét đứt = đường HÔM NAY đang thiếu
(bên đọc không tới được vật). AC liên quan: AC-2, AC-3, AC-7, AC-8, AC-11.
