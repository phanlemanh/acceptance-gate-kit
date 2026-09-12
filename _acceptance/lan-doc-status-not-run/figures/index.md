# Điểm quyết định — đếm ngưỡng N5

Kê từ artifact cuối S1: 4 entry sổ quyết định chờ seal · 5 finding gap-probe (đã sửa hết,
0 mục `human-gate1`) · 0 dòng `[GIẢ ĐỊNH]` trong Coverage · 0 chỗ design lệch spec có sẵn.

| Điểm | Đếm | Hình |
|---|---|---|
| Một nguồn ở `lib/evidence-core.cjs` (entry approach #1) | 4 bước nối tiếp: `evals.yaml` → định nghĩa dùng chung → bên đọc `machineEvalIds` → bên viết `repin-lane.mjs` → dòng pin | **cần hình** — `mot-nguon.html` |
| Hai vế chống đường lách (entry approach #2) | 2 nhánh rẽ: vế 2 thoả → loại ô, pin nói ra · vế 2 hở → dừng exit 2 có tên | **cần hình** — `hai-ve.html` |
| Bỏ đặc-tả-UX (descope) | 1 bước, không nhánh | dưới ngưỡng: 1 |
| Bỏ ui-observed (descope) | 1 bước, không nhánh | dưới ngưỡng: 1 |

## Đề bài hình 1 — `mot-nguon.html`

- Loại: sơ đồ luồng dữ liệu, 5 nút.
- Nút: `evals.yaml (có ô khai không-chạy)` · `định nghĩa dùng chung trong lib/evidence-core.cjs` ·
  `bên ĐỌC: machineEvalIds → checkRepinEvals` · `bên VIẾT: repin-lane.mjs` ·
  `dòng pin: evals_exit + evals_not_run`.
- Nhãn bằng chữ: mũi tên từ định nghĩa toả sang HAI bên phải ghi «cùng một tập id»;
  ghi chú bản CŨ bằng nét đứt: bên viết có bộ lọc riêng → «hai bản luật».
- AC liên quan: AC-1, AC-3, AC-6.

## Đề bài hình 2 — `hai-ve.html`

- Loại: sơ đồ rẽ nhánh, 1 nút hỏi + 2 nhánh kết.
- Nút hỏi: «ô khai không-chạy — báo cáo đã ký có mã thoát cho nó không?».
- Nhánh KHÔNG: `loại ô khỏi tập` → `pin ghi evals_not_run` → `dòng sha: nối hậu tố`.
- Nhánh CÓ: `dừng exit 2, chưa ghi byte nào` → `thông điệp gọi tên hồ sơ + id + cả hai vế`.
- AC liên quan: AC-4, AC-6.
