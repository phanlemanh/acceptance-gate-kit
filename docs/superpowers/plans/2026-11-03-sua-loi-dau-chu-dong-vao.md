# Plan: sua-loi-dau-chu-dong-vao

Hồ sơ: `_acceptance/sua-loi-dau-chu-dong-vao/` · design: `_acceptance/sua-loi-dau-chu-dong-vao/design.md` · gốc: #477.

Thứ tự: ca đo trước (một commit, đỏ trên cây chưa sửa), rồi mỗi task một commit vật. Mọi task `independent: false` —
cùng sửa lõi dieu-phoi hoặc cùng tệp ca, nên thực thi tuần tự trong phiên chính.

| Task | Files | Verify | Phục vụ |
|---|---|---|---|
| T0 ca đo đỏ | `tests/dieu-phoi/sua-loi-dau-chu-dong-vao.test.mjs`, `tests/scripts/s4-args-dev-server.test.mjs`, `tests/workflows/ui-check-tuan-tu.test.mjs`, `_acceptance/config.yaml` (ba khoá executor) | ba lệnh khoá đỏ, ghi thông điệp vào sổ | E1–E9 |
| T1 lỗi 2 | `dieu-phoi/scripts/lich.mjs` (`duPhuThuoc`, `sau_khong_co`, `hangKeTuTiep`) | `node --test --test-name-pattern='SD-[12] ' …` | E1, E2 |
| T2 lỗi 3/4 (a)(b) | `lich.mjs` (bộ giải tên), `ghi.mjs` (`ghiDon` trả lệnh chờ, `nhaKhoa` qua bộ giải), `dieu-phoi.mjs` (in lệnh chờ), `mau/LUAT.md` | SD-3, SD-4 | E3, E4 |
| T3 lỗi 3 (c) | `gop.mjs`, `dieu-phoi.mjs` (dòng in) | SD-5 | E5 |
| T4 lỗi 3 (d) | `phat-lich.mjs` (`xuLyKhoa` nhận hàm «đã gộp») | SD-6 | E6 |
| T5 lỗi 5 | `feature-loop/scripts/s4-args.mjs`, `feature-loop/workflows/acceptance-verify.js` | DS-*, UT-* | E7, E8, E9 |
| T6 hạt giống | `docs/plans/2026-10-01-hat-giong-tham-so-luot-cham-bang-tep.md` (một dòng `Gốc:`) | — | — |
| T7 suite | — | `dieu_phoi`, `scripts_*`, `workflows` | mọi eval |
