# Hạt giống — ba lỗ của làn ghim lại 2.23.0 (rác thư mục tạm · khoá danh sách viết dạng đơn · phép vi phân xanh rỗng)

**Ngày:** 2026-10-06 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2 (chạm `feature-loop/scripts/**`, `tests/scripts/**`, bộ răng hồ sơ).
Gốc: crm-onehub/_acceptance/kiem-cheo-sau-gop — kho tiêu thụ đầu tiên bật năm khoá của làn ghim lại.
Sinh từ Cổng Bằng chứng của `_acceptance/release-2-23-0/` (owner định tuyến 06/10: Ngoài-1, Ngoài-4, Ngoài-7 → «mở hợp đồng mới»); vật là mã của vòng `_acceptance/gia-lan-ghim-lai/`.

## Ba lỗ (chi tiết nguyên văn ở `_acceptance/release-2-23-0/review-findings.md`)

- **Ngoài-1 — bộ đo để lại thư mục tạm.** `rang/ban-sao.mjs` (`banSao`), `rang/vi-phan.mjs`
  (`chepKho`, `envLan`) và `tests/scripts/gia-lan-fixture.mjs` (`mkKho`) tạo `mkdtemp` mà không dọn; đo
  06/10 trên máy kit: 3 674 thư mục `gg-*`, 1,2 GB trong `$TMPDIR`. Mỗi lượt CI, mỗi lượt S4 hay ghim lại
  chạy tám eval `gg_ac*` cộng thêm. Mẫu dọn đã có trong kho (`trap … EXIT`, `process.on('exit', rmSync)`).
- **Ngoài-4 — khoá danh sách viết dạng giá trị đơn bị bỏ qua lặng lẽ.** `lib/lan-khoa.mjs` đọc
  `model_evals` và `repin_ci_blank_env` bằng `resolveConfigList`; viết `model_evals: crm/E3` (không gạch
  đầu dòng) trả `[]` không lỗi → eval model thật bị chạy lại (đúng điều AC-1 cấm) và env CI tắt im. Hướng
  sửa: giá trị đơn khác rỗng mà danh sách rút ra rỗng → nguồn hỏng (mã 2) gọi tên khoá, hoặc nhận như
  danh sách một phần tử. Cùng đợt: trần phút cực lớn (> 2^31−1 ms ≈ 35 790 phút) làm `setTimeout` bắn
  ngay → mọi lượt thoát 4 (Ngoài-6, đã ghi Known limits) — cùng bộ đọc khoá, sửa chung được.
- **Ngoài-7 (high) — phép vi phân AC-7 có thể xanh rỗng.** `rang/vi-phan.mjs` chỉ so BASE == SAU, không
  ghim kết cục mong đợi của từng kịch bản (write-xanh thoát 0, write-do thoát 1, skip-unchanged thật sự
  bỏ qua, sigterm-giua-lenh thật sự gửi tín hiệu giữa lệnh); recheck chỉ chạy khi SAU thoát 0; kịch bản
  SIGTERM trả cùng chuỗi «không sinh cháu» ở hai bên thì ra «giống» dù tín hiệu chưa từng gửi. Commit
  `d3d3ae72` đã bỏ dấu dương pid cháu khi sửa một lỗi sập — dấu ấy phải quay lại dưới dạng đối chứng
  dương (luật «assertion âm-tính-một-mình» của CLAUDE.md).

## Vì sao chưa làm

Mốc 2.23.0 không đổi mã cổng (GUIDE §7.1). Ba lỗ không chặn crm cài 2.23.0 nếu crm khai hai khoá danh
sách đúng dạng gạch đầu dòng và đặt trần dưới 35 790 phút — điều đó đã nằm trong lời báo cho phiên
điều phối crm. Ngưỡng mở ô: crm bật khoá và ≥1 lượt ghim lại ở crm lộ một trong ba lỗ, hoặc owner gọi tên.
