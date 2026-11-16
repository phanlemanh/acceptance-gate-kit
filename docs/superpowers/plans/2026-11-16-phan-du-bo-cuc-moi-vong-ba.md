# Kế hoạch — phan-du-bo-cuc-moi-vong-ba

Thiết kế: `docs/superpowers/specs/2026-11-16-phan-du-bo-cuc-moi-vong-ba-design.md` · hợp đồng:
`_acceptance/phan-du-bo-cuc-moi-vong-ba/contract.md`. Verify mỗi việc chạy bằng Node 24 (`.nvmrc`).

Lệnh thử một tệp ở hai bố cục (dùng cho mọi việc K4): `node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/thu-tep.mjs <tệp>` —
chạy tệp ở cây đang đứng và trong kho mới tạm (bước 6 bỏ qua tệp ấy), in số PASS/FAIL hai phía và dòng đỏ đầu.

| # | Việc | Tệp | Verify | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Commit đầu: ghim MOC_MA_TRAN ở bang-ten-lo-trinh + ca SP-GOC-GHIM; nhánh chính hết đỏ | `tests/scripts/bang-ten-lo-trinh.test.mjs` | tệp xanh ở cây đang đứng và trong bản sao có origin/main = HEAD | E1, E2 | false (đầu tiên) |
| 2 | `tests/hai-bo-cuc.mjs` + răng bền `tests/scripts/hai-bo-cuc.test.mjs` (bốn ô) | hai tệp mới | `node tests/scripts/hai-bo-cuc.test.mjs` | E3 | false (sau 1) |
| 3 | K4-MP: `bo-cuc.test.mjs`, `bang-ten-lo-trinh.test.mjs` đi qua haiCay + bộ dịch | hai tệp | `thu-tep.mjs` cả hai, hai bố cục | E4 | false (sau 2) |
| 4 | K4-RG: `recheck-goc-goi-loi.test.mjs` qua bộ dịch (RG-2 giữ merge-base sống, bung qua `boPhan`/`pathspec`) | một tệp | `thu-tep.mjs` | E7 | true |
| 5 | K4-LT nhóm a: `lo-trinh`, `lo-trinh-du-lieu-ngay`, `lo-trinh-gio-may`, `moc-chien-dich`, `xem-trang-lo-trinh`, `road-map-de-dung` | 6 tệp | `thu-tep.mjs` từng tệp | E5 | true |
| 6 | K4-LT nhóm b: `ap-chinh-sach-lo-trinh`, `ra-soat-lo-trinh`, `ve-lo-trinh-doc-tin-hieu-cua-cay`, `cua-tin-hieu-giua-chien-dich`, `cua-tin-hieu-goc-moi-worktree`, `o-mo-viec-mang-nguon`, `kho-moi-cai-goi-road-map`, `tin-hieu` | 8 tệp | như trên | E5 | true |
| 7 | K4-TB: `doc-jsx-va-ban-do-hong`, `khoi-khuon-tren-the-cong`, `ban-do-khuon-roi-nhom`, `cham-lai-khong-tu-doi`, `dai-tom-tat-dem-dung`, `khuon-loi`, `chi-tep-vat-keo-xet-lai`, `ntr-trang-thai` | 8 tệp | như trên | E6 | true |
| 8 | Rà lớp merge-base: `rang/ra-lop-merge-base.md`; ghim mốc mọi tệp nhóm A | bảng + tệp nhóm A | `giu-khoa-3.mjs --sau-gop` | E2 | false (sau 1, 4–7) |
| 9 | Thước: `giu-khoa-3.mjs` + bộ tự kiểm `giu-khoa-3.test.mjs` (luật tĩnh hai chiều, routing-baseline ba ca); CA_CANH chiều đỏ | `rang/` | `--tinh`; bộ tự kiểm | E8–E10 | false (sau 3–7) |
| 10 | `gui-b2.md` bốn mục; ảnh chụp bảng vá B2; `--ghi-gui-b2` | hồ sơ | `--tinh` | E10 | false (cuối) |

Mỗi tệp K4 sửa xong: thêm vào khối GUI-B2-TU-DUNG của `gui-b2.md` cùng commit (luật tĩnh đòi khớp).
