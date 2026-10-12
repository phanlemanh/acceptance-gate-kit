# Hình tại Cổng Phạm vi — ci-cua-kho-bo-job-nang

Kê từ artifact cuối S1 (sổ quyết định chờ seal · chỗ lệch hàng lộ trình · gap-probe), đếm ngưỡng N5 (≥3 bước nối
tiếp hoặc ≥2 nhánh rẽ → cần hình).

| Điểm | Đếm | Hình |
|---|---|---|
| d-1 — chế độ của chính cổng thay script riêng (ba lối: chế độ · script JS · script bash rút hàm) | 3 nhánh | `mot-nguon.png` |
| d-2 — PR đổi danh sách hạng thì chạy đủ | thang 6 bước nối tiếp (bước 5) | `thang-phan-loai.png` |
| d-3 — thoát 0 cho mọi phán quyết + nối dây `!cancelled()` ở GUIDE (P0 gap-probe) | 4 nhánh (bảng bốn hàng) | `noi-day-ci.png` |
| d-4 — bỏ đặc tả UX | dưới ngưỡng: 0 nhánh | — |
| d-5 — không làm bit PR nháp | dưới ngưỡng: 1 bước | — |
| Hạng T3 thay T2 của hàng lộ trình | dưới ngưỡng: 1 bước | — |

## Đề bài

**mot-nguon** (sơ đồ khối, so sánh): một tiến trình `pre-merge-check.sh` — khối đọc config (`config_list`) →
khối phạm vi diff (`git diff base...HEAD`) → khối «Phân loại diff-chịu-cổng» (`match_globs`) → rẽ hai: cổng
(T1-escape, per-slug) | chế độ `--hang-pr` (ba dòng). Bên cạnh, hai lối đã loại, mờ: script JS (`globToRe` —
`*.md` vs `docs/a.md`: bash khớp, JS không) · script bash rút hàm bằng `sed` (khớp nối của crm #369). AC-1, AC-2.

**thang-phan-loai** (lưu đồ dọc, sáu bậc, mỗi bậc rẽ phải ra «chạy đủ»): 1 cổng dừng sớm → `khong-phan-loai-duoc`
· 2 cấu hình hỏng → `cau-hinh-loi` · 3 không có phạm vi diff → `khong-co-pham-vi-diff` · 4 diff rỗng → `diff-rong`
· 5 danh sách hạng đổi → `doi-danh-sach-hang` · 6 phân loại → T3 / T2 (chạy) · ho-so / T1 (bỏ job nặng). Nhãn
«nghi ngờ thì chạy đủ». AC-3, AC-4, AC-5.

**noi-day-ci** (luồng hai job + bảng): job `hang-pr` (checkout `fetch-depth: 0` → lấy kit → `--hang-pr`) → job
`test` với `if: !cancelled() && cham_vat != 'false'`. Bảng bốn hàng: xanh + false → bỏ · xanh + true → chạy ·
xanh + đầu ra vắng → chạy · `hang-pr` đỏ → chạy. Ghi chú: thiếu `!cancelled()` thì hàng 4 thành «bỏ» và job bị
bỏ báo Success. AC-10, AC-7.
