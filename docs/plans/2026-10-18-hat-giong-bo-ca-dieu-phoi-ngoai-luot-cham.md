# Hạt giống — bộ ca điều phối không nằm trong bộ ca của lượt chấm, chỉ CI thấy

**Ngày:** 2026-10-18 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa lỗ đo (không thêm cổng).
Gốc: `acceptance-gate-kit/_acceptance/road-map-de-dung/` — `decisions.jsonl` dòng `fix` stage `gate2-ci` (18/10): lượt chấm 3 PASS, CI của PR #381 đỏ ở `DP2-11 khong-dot`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/road-map-de-dung/contract.md` (mục Notes) trích lại tệp này.

## Số đo

- `_acceptance/config.yaml` khai năm khoá chạy `tests/dieu-phoi/**` (`dieu_phoi`, `dieu_phoi_dp2`, `dieu_phoi_dp7`,
  `dieu_phoi_plugins`, `moc_chien_dich_dp211`) nhưng `feature_loop.suite_keys` (11 khoá) không gồm khoá nào trong số đó.
- CI (`.github/workflows`, bước «dieu-phoi suite») chạy trọn `node --test "tests/dieu-phoi/**/*.test.mjs"` (418 ca).
- RD1 (`road-map-de-dung`): ba lượt chấm xanh 11/11 bộ ca, ký Cổng Bằng chứng, rồi CI đỏ 1/418 (DP2-11 khong-dot so thẻ
  khởi động với bản nhánh chính) → một lần sửa sau chữ ký + một làn ghim lại.

## Gốc

Danh sách bộ ca của lượt chấm và danh sách bước của CI là hai nguồn viết tay, không phép đo nào so hai danh sách.

## Hướng (chưa quyết)

Hoặc thêm khoá `dieu_phoi` vào `feature_loop.suite_keys` (giá: thêm phút máy mỗi lượt chấm), hoặc một ca so tập lệnh
CI với tập lệnh lượt chấm và khai đích danh phần chỉ-CI. Ngưỡng mở ô: lần thứ hai một hồ sơ đã ký bị CI đỏ ở bộ ca không
nằm trong lượt chấm.
