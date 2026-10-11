# Hình tại điểm quyết định — dieu-phoi-lop-mod (Cổng Phạm vi)

Kê từ artifact cuối S1: dòng sổ chờ seal, chỗ design lệch spec §12.2, finding gap-probe xử lý `human-gate1`
(không có), dòng `[GIẢ ĐỊNH]` trong Coverage (không có).

| Điểm | Đếm | Hình |
|---|---|---|
| d-…-1 Mod không chặn S4, hook giữ vai (lệch §12.2 dòng «Chặn S4») | 2 nhánh (mod chặn / hook chặn) trên một chuỗi 4 bước (lời gọi → hook của mod → hook thường → bộ phân loại) | `lop-hook-va-mod` |
| d-…-2 H3 sửa ở lõi Node (lệch §12.2 dòng «Tự bắt việc chờ người») | chuỗi 5 bước (hộp quyền → hook chờ người → tệp → bộ phát lịch → sự kiện → Monitor), gãy ở 2 bước | `cho-nguoi-den-giam-sat` |
| d-…-3 Đo §12.3 bằng mod thăm dò — câu xin đồng ý | chuỗi 6 bước, 2 chạm người, 1 nhánh (đối chứng dương có / không) | `tham-do-mot-lan` |
| d-…-4 Không thay Monitor | dưới ngưỡng: 1 bước, 0 nhánh | — |
| d-…-5 … d-…-8 bỏ design-pass, đặc-tả-UX, ui-observed, đường-đo | dưới ngưỡng: mỗi dòng 1 bước, 0 nhánh | — |

## Đề bài từng hình

### `lop-hook-va-mod` — ai làm gì giữa hook thường và mod
- Loại: sơ đồ lớp (layer stack) hai cột «hook thường / lõi Node» và «mod (chỉ khi app ≥ 2.1.286, CLI ≥ 2.1.287)».
- Nút: Lời gọi Bash/Workflow · Hook chặn S4 (`hook-chan-s4.mjs`) · Bộ phân loại (`phan-loai-s4.mjs`, MỘT hàm) ·
  Hook chờ người · Bộ phát lịch · CLI `xem --json` · Mod: dải trên ô nhập · Mod: pane · Mod: `/dieu-phoi:xem`.
- Nhãn chữ: mod «không chặn, không cho phép, không ghi tệp đợt»; hook «chạy ở mọi bản, không nhường mod»;
  mũi tên CLI → mod «đọc mỗi 20″».
- AC liên quan: AC-1, AC-2, AC-3, AC-7, AC-8, AC-9, AC-10.

### `cho-nguoi-den-giam-sat` — thợ chờ người tới giám sát: gãy ở đâu, sửa ở đâu
- Loại: luồng ngang 5 bước, đánh dấu hai chỗ gãy hôm nay bằng màu cảnh báo, chú thích sửa bên dưới.
- Nút: Hộp xin quyền ở phiên thợ → `hook-cho-nguoi` → `cho-nguoi/<dãy>.json` → bộ phát lịch → dòng
  `su-kien.jsonl` → Monitor của giám sát (`grep "can_phan":true`).
- Nhãn chữ: gãy 1 «dãy còn đơn xin/ → hook im» (sửa: AC-4); gãy 2 «sự kiện không có can_phan → Monitor không
  thức» (sửa: AC-5). Một nhánh phụ có dấu hỏi: «hộp quyền của tác tử Workflow có tới hook không? → đo (AC-6)».
- AC liên quan: AC-4, AC-5, AC-6.

### `tham-do-mot-lan` — lần đo sống xin đồng ý ở cổng này
- Loại: luồng dọc 6 bước, hai bước có biểu tượng người.
- Nút: Anh đồng ý ở Cổng Phạm vi → máy chép mod chỉ quan sát vào `~/.claude/dev-mods/<phiên DP6>/dp6-tham-do/` →
  app hỏi «Enable hot reloading» (anh bấm Enable) → kịch bản 1: tác tử Workflow gọi `eval true`, hộp hiện (anh
  bấm Deny) → kịch bản 2–4 tự chạy (dải/pane, tự đánh thức, `node` từ mod) → máy xoá thư mục mod, ghi bảng năm
  hàng vào `evidence/`.
- Nhãn chữ: nhánh «đối chứng dương không có → chạy lại một lần với lệnh khác → vẫn không: ghi "không đo"»;
  «mod chỉ chạy trong phiên DP6, mọi hook trả nguyên».
- AC liên quan: AC-6.
