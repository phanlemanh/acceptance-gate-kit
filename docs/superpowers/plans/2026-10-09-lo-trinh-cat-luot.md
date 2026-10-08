# Kế hoạch — lo-trinh-cat-luot (lát 2, hàng L2)

Hồ sơ `_acceptance/lo-trinh-cat-luot/` · design `docs/superpowers/specs/2026-10-08-lo-trinh-cat-luot-design.md`
· T2, Cổng Phạm vi làn V 09/10. Mọi task tuần tự (`independent: false`): răng, khuôn và skill rút từ nhau.

| # | Việc | Tệp | Kiểm từng bước | Phục vụ |
|---|---|---|---|---|
| 1 | Khuôn bản phạm vi (marker `PHAM-VI-MA`) + khuôn lộ trình thêm `dot`/`phu`/`chan_troi` | `skills/acceptance/references/pham-vi-template.md` · `lo-trinh-template.json` | LT-13 xanh | E1 E4 |
| 2 | Răng + nhịp, chỉ đọc | `scripts/cat-luot.mjs` (mới) | ca LT-130…LT-137 | E1–E8 |
| 3 | `kiemKhuon` đọc `phu`/`chan_troi`; dòng bước kế theo bảng ô → câu | `scripts/lo-trinh.mjs` | LT-139, LT-141, suite lộ trình | E4 E11 E12 E13 |
| 4 | Skill cắt lượt (marker `CAT-LUOT-RANG`, `CAT-LUOT-NHIP`, `CAT-LUOT-SAU-LUAT`) | `skills/cat-luot/SKILL.md` | LT-138 | E9 E10 |
| 5 | Ca đo LT-130…LT-141 + LTT-buoc-ke, mỗi ca kèm chiều đỏ | `tests/scripts/lo-trinh.test.mjs` · `tests/scripts/xem-trang-lo-trinh.test.mjs` | chạy hai tệp | mọi E |
| 6 | Term «Bản phạm vi», «Cắt lượt», «Chân trời» · GUIDE · CHANGELOG | `CONTEXT.md` · `GUIDE.md` · `CHANGELOG.md` | P96, P127, P30 | — |
| 7 | Vẽ lại trang mẫu hồ sơ đã ký nếu đổi (bước kế), chụp lại ảnh; bốn mảnh suite + plugins + workflows + bản đồ xanh; hợp đồng `implemented` | `_acceptance/*/mau/` | suite | — |

Lựa chọn chịu lực: bảng ô → câu bước kế là hằng một chỗ trong `scripts/lo-trinh.mjs`, ca LT-139 so với
bảng viết sẵn trong ca (không rút từ mã); bộ đọc bản phạm vi rút khuôn từ khối marker của tệp khuôn lúc
chạy test (round-trip writer/reader).
