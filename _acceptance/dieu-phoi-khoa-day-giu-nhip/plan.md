# Kế hoạch: dieu-phoi-khoa-day-giu-nhip (DP10)

T2, tuần tự, TDD (commit ca đo đứng trước commit vật). Không task nào `independent`.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ |
|---|---|---|---|---|
| 1 | Ca đo trước vá: ma trận trục D 10 hàng (đối chứng vắng nhịp phiên, `ly_do`), DP10-01/-do, DP10-02, DP10-04, DP10-05/-do, DP10-06; DP8-09-do theo lời gọi mới; DP3-10-do tắt `chamNhip` của hook trong bản sao | `tests/dieu-phoi/on-dinh-r2.test.mjs`, `tests/dieu-phoi/tiep-tuc.test.mjs` | chạy `--test-name-pattern '^(DP8-09\|DP10-\|DP3-10)'`: ĐỎ đúng lý do (nửa P1 `[1,1,1,1,1]`) | E1–E6 |
| 2 | Vá: bỏ dòng loại dãy, thôi luồn `hangViec`, `ly_do` nêu nhịp khoá; README đoạn việc nền | `dieu-phoi/scripts/phat-lich.mjs`, `dieu-phoi/README.md` | cùng lệnh: XANH; rồi trọn `executors.test.dieu_phoi_sdt` | E1–E5 |
| 3 | Sổ: một dòng `fix` cho mỗi ca đã ký đổi thân | `decisions.jsonl` | DP10-06 xanh | E6 |
