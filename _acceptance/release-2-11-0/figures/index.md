# Điểm quyết định — release-2-11-0

Kê từ artifact cuối S1: 8 entry sổ quyết định chờ seal · 5 finding gap-probe (đã sửa hết,
0 mục `human-gate1`) · 0 dòng `[GIẢ ĐỊNH]` trong Coverage (mọi giá trị gắn được
`[SUY-TỪ-REPO]` hoặc `[NGÀNH]`).

| Điểm | Đếm N5 | Hình |
|---|---|---|
| Chuỗi xanh-giả bốn bước, và bản vá cắt nó ở đâu | **4 bước nối tiếp** → cần hình | `chuoi-xanh-gia.html/.png` |
| Ranh giới «sửa theo LỚP»: bảy đường thi hành vs bốn bộ đọc token cố ý giữ | **2 nhánh rẽ** + bán kính 28 chỗ trên 7 kho → cần hình | `ranh-gioi-va.html/.png` |
| Biểu thức cặp-vỏ-hợp-lệ-YAML thay vì `/^".*"$/` của bản oneflow | 2 nhánh rẽ → gộp vào hình 1 (một nút so hai bản) | (trong hình 1) |
| Descope: un-double nháy đơn · bỏ đặc-tả-UX · bỏ design-pass · bỏ ui-observed | dưới ngưỡng: 1 | — |
| Thu gọn brainstorm về một lượt máy | dưới ngưỡng: 1 | — |
| E7 dùng chính giá trị config có escape làm bằng chứng sống | dưới ngưỡng: 2 → gộp vào hình 1 | (trong hình 1) |

## Đề bài hình 1 — `chuoi-xanh-gia`

- Loại: **evidence chain** (bốn bước nối tiếp, hai làn: TRƯỚC vá / SAU vá).
- Nút làn TRƯỚC: `config.yaml: pytest -q -k 'a or b'` → `resolveConfigKey → pytest -q -k 'a or b` (mất dấu đóng) → `bash -c → exit 2` (vỡ cú pháp) → `EXPECTED_EXIT_BANNED = [97,127], 2 không bị cấm` → **`PASS` (xanh giả)**.
- Nút làn SAU: cùng đầu vào → `unquoteScalar: không phải cặp vỏ → giữ nguyên văn` → `bash -c → mã của CÔNG CỤ` → `so với expected_exit` → **`PASS chỉ khi công cụ thật trả 2`**.
- Nhãn phụ ở nút bộ giải: `/^"(?:[^"\\]|\\.)*"$/` — cặp vỏ HỢP LỆ YAML; ghi chú một dòng «bản oneflow dùng `/^".*"$/`, khác đúng một hình dạng: `"a" && echo "b"`».
- AC liên quan: AC-1 · AC-2 · AC-3.

## Đề bài hình 2 — `ranh-gioi-va`

- Loại: **layer stack / boundary map** — một cột trái «đường GIÁ-TRỊ-BỊ-THI-HÀNH» (7 nút), một cột phải «bộ đọc TOKEN — cố ý giữ» (4 nút), giữa là nút `unquoteScalar` chỉ nối sang cột trái.
- Cột trái: `resolveConfigKey` lá · `resolveConfigList` inline · `resolveConfigList` khối · `s4-args` list inline · `s4-args` list khối · `s4-args` id · `s4-args` models.
- Cột phải: `extractRunIds` · `walkEvalExits` · `extractVerifierValues` · `frontmatterField`.
- Nhãn bán kính trên cột trái: `oneflow 19 · artifact-platform 5 · crm 4 · bốn kho khác 0 · kit 0 = 28 chỗ`.
- Một dòng dưới: «tổng số khớp `^["']|["']$` trong hai tệp = 4 — bằng số nút cột phải (E4b chân 3)».
- AC liên quan: AC-4.
