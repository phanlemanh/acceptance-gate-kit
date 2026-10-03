# Kế hoạch: lo-trinh-tren-du-lieu-that

Hồ sơ `_acceptance/lo-trinh-tren-du-lieu-that/` · design `docs/superpowers/specs/2026-10-03-lo-trinh-tren-du-lieu-that-design.md`.
TDD: mỗi bước commit test đỏ trước, rồi vật. Mọi ca trong `tests/scripts/lo-trinh.test.mjs`.

1. **Bảng ô hồ sơ thật của crm.** Script `tests/scripts/lo-trinh-chup-crm.mjs --crm <bản sao>` chạy
   `classify` của bản đồ trên từng slug mà lộ trình OKR trỏ, ghi `_nguon.ho_so_onehub` (slug → khoá ô,
   slug không có thư mục thì vắng) + `_nguon.ho_so_onehub_nguon` (nhánh, sha) vào fixture crm-okr.
   `_nguon.ho_so` cũ giữ nguyên cho ca lát 1. → AC-3.
2. **Khoá nhiều tệp** (`lo-trinh-khoa.cjs`): `cacTepTuConfig`, cắt khối `lo_trinh:` cột 0, chuỗi /
   khối / dòng, gộp tệp lặp + cờ. `khoaTuConfig` = phần tử đầu. → AC-8.
3. **Nhóm + không-hồ-sơ** (`suyTrangThai`): bảng NHOM theo khoá ô; cờ khác nhóm; nhánh slug vắng hồ
   sơ + khai đã giao/đang làm → «Không suy được» + cờ. → AC-1, AC-2.
4. **Nối hai chiều**: quét `opportunity.md` lấy `lo_trinh_ma`/`lo_trinh_tep` một lần mỗi lần phân
   tích kho; hàm chung `hoSoCuaHang(dong)` cho bộ vẽ và `--mo-o`; thứ tự ưu tiên design §2. → AC-4.
5. **Nhiều lộ trình**: `phanTichKho` trả mảng; trang một tệp giữ byte; trang nhiều tệp có mục lục +
   section; cờ kho-cấp (tệp lặp, hồ sơ trỏ tệp không khai, mã không ở đâu) vào lộ trình đầu. → AC-9.
6. **CLI**: `--hang <tệp>:<mã>`, thoát 3 khi mã ở nhiều tệp; `--mo-o` (`--slug`, `--owner`), suy slug,
   đọc khuôn `OPP-FRONTMATTER-TEMPLATE` + `OPP-DE-XUAT-PREFIX` lúc chạy. → AC-5, AC-6.
7. **start-scan**: `loTrinh = {trang, trangCo, ds, dong}`; dòng thẻ dựng sẵn; cảnh báo bản đồ chưa
   bật; mốc không gắn hàng. **product-map**: dòng liên kết trong `PRODUCT-MAP.md` khi khai. → AC-10, AC-11.
8. **Thân lệnh**: `commands/start.md` (in nguyên `loTrinh.dong`, hàng kế ở câu hỏi bước 4);
   SKILL feature-loop S0 (khối `S0-MO-O`, bảng `S0-MO-O-THOAT`, mẫu đối số mới); LT-18-luat của lát 1
   đổi theo luật mã thoát mới (hồ sơ cũ ghim lại bằng làn). GUIDE: đoạn nhiều lộ trình + mục 7. → AC-7, AC-10.
9. **Đo trên crm thật**: chạy bộ vẽ trên bản sao crm, chép trang vào `do-crm-onehub.html`. → AC-12.
10. Suite đủ + `pre-merge-check.sh . --base origin/main` + P179, rồi S4.
