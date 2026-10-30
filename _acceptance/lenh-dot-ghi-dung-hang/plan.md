# Kế hoạch thi công — lenh-dot-ghi-dung-hang (T2, không có Gate 1.5)

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Ca kiểm TC2 viết trước, đỏ trên mã cũ (commit riêng, đứng trước vật) | `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs` | E1–E9 (mọi ca của vòng) |
| Lượt xin chấm, ghim lại, gộp mang đúng việc theo bậc | `dieu-phoi/scripts/ghi.mjs` | AC-1, AC-2 (đơn đúng hàng) |
| Lịch coi hồ sơ T1 trên nhánh chính là đã gộp — một hàm dùng chung với lượt xin | `dieu-phoi/scripts/phat-lich.mjs` | AC-7 (T1 đã gộp) |
| Thêm việc theo mã hay tên lộ trình mang đúng tên, mã, vùng | `dieu-phoi/scripts/hang.mjs`, `nguon-hang.mjs` | AC-3, AC-4 (thêm việc đúng) |
| Lệnh cho dãy chạy lại | `dieu-phoi/scripts/hang.mjs`, `dieu-phoi.mjs` | AC-5, AC-6 (chạy lại) |
| Hướng dẫn của gói nói thứ tự chọn việc, thêm việc theo lộ trình, lệnh chạy lại | `dieu-phoi/README.md`, `commands/tiep-tuc.md` | AC-9 (lời dặn) |

Tuần tự (một tệp ca chung, vật đụng chung `hang.mjs`) — không task nào `independent`. Verify mỗi bước:
`node --test tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`; cuối: suite `tests/dieu-phoi/**/*.test.mjs` (AC-8, AC-10).
