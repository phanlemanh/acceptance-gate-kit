# Kế hoạch thi công — goi-cheo-loi-dieu-phoi

> Hồ sơ `_acceptance/goi-cheo-loi-dieu-phoi/` (Cổng Phạm vi duyệt 14/11, `9824bf5d`) · thiết kế
> `docs/superpowers/specs/2026-11-14-goi-cheo-loi-dieu-phoi-design.md`.
> TDD: mỗi task viết ca đỏ trước — commit ca đỏ RIÊNG, rồi commit vật (chiều đỏ nằm trong lịch sử). Node 24 (`node -v`
> phải ra v24 trước mọi lượt đo). Mọi gốc kho trong thước suy từ vị trí script; fixture do mã sinh ở thư mục tạm.

Thứ tự: T1 → T2 (thước trước vật) → T3…T8 (vật; mỗi task xanh dần một ca của T2) → T9 (ca cũ) → T10 (RT13) → T11
(danh sách chép, bản đồ, suite). Mọi task `independent: false` — cùng chạm bộ dựng, suite và `scripts/`; chạy tuần tự
trong phiên chính.

## T1 — Răng một nguồn (đỏ trước)
- Files: `tests/scripts/mot-nguon-ten-va-hop-thu.test.mjs` (mới).
- Ca: GN-1 bảng `lib/ho-goi.cjs` ≡ `.claude-plugin/marketplace.json` (tên + thứ tự · tập `bat-theo-lua-chon` · tên chợ);
  GN-1-do-them / -do-dau / -do-cho trên bản sao (thư mục tạm chứa bản chép marketplace + bảng, so bằng CHÍNH hàm so của
  ca). GN-2 bốn cặp `scripts/hop-thu/<f>` ≡ `dieu-phoi/scripts/<f>` từng byte; GN-2-do sửa một byte trên bản sao. Nhát phá
  chỉ chạy khi đối chứng dương xanh; nhát không áp → FAIL «nhát phá không áp».
- Verify: chạy tệp → đỏ đúng «thiếu lib/ho-goi.cjs» và «thiếu scripts/hop-thu/hinh-dang.mjs». Commit đỏ.
- Phục vụ: E9. independent: false.

## T2 — Bộ dựng bố cục mới + chiều đỏ + vi phân (đỏ trước)
- Files: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`, `…/rang/vi-phan-cu.mjs`, `…/rang/luat-doi-chu.mjs`
  (bảng xếp + luật đổi chữ chép từ kịch bản, một chỗ cho cả hai script).
- Bộ dựng: `--ref <sha>` (git archive) hoặc cây đang kiểm (git ls-files + tệp chưa commit); dời theo bảng xếp, áp năm
  luật đổi chữ + luật chợ lên `plugins/**`, viết lại `marketplace.json`; «bản cài lõi mới» = chép riêng
  `plugins/acceptance-gate/`. Ca BC-2…BC-8 đúng `expected` của E2–E8. `--chieu-do`: CD-0 cây đang kiểm xanh, rồi bản
  `593e6837` đỏ CD-2…CD-8 với thông điệp ghim.
- Vi phân: ma trận kho tiêu thụ viết sẵn (tin_hieu có/không × lộ trình bật/không × chan có/không + chợ fork), mỗi kho
  chép lớp CI của đúng bản đang chạy; lệnh: plugin-declare `--list`/khai thử, khởi tạo lộ trình (khai thử), luật chặn,
  `tin-hieu --rang`, `gui-tin-hieu`; cộng kho kit bố cục cũ cho `start-scan`. VP-DO tự phá; VP-HT phá
  `scripts/hop-thu/cua-tin-hieu.mjs` trên bản sao cây rồi chạy ca cửa tín hiệu có sẵn → phải đỏ.
- Verify: bộ dựng trên cây hiện tại đỏ BC-2…BC-8 đúng thông điệp; vi phân VP xanh (vật chưa đổi), VP-HT đỏ (hộp thư
  chưa có). Commit đỏ.
- Phục vụ: E1–E8, E10. independent: false.

## T3 — Bảng tên `lib/ho-goi.cjs`
- Files: `lib/ho-goi.cjs` (mới): `CHO`, `GOI` theo design §3; hàm `tenTheoVai(vai)`, `danhSach()`.
- Verify: GN-1 + ba nhát phá xanh. Phục vụ: E9. independent: false.

## T4 — Hộp thư
- Files: `scripts/hop-thu/{hinh-dang,cau-hinh,dot,cua-tin-hieu}.mjs` (chép từng byte), `scripts/tin-hieu.mjs`,
  `scripts/gui-tin-hieu.mjs` (import `./hop-thu/…`).
- Verify: GN-2 xanh; BC-2 xanh; `tin_hieu` xanh. Phục vụ: E2, E9. independent: false.

## T5 — Khai plugin + lộ trình
- Files: `scripts/plugin-declare.mjs`, `scripts/lo-trinh-khoi-tao.mjs`, `lib/chan-lo-trinh.cjs`.
- Hai nhánh: có `<gói>/.claude-plugin/marketplace.json` → đọc tệp như cũ; vắng → bảng tên. Luật chặn: chỉ thay hằng
  tên bằng `tenTheoVai('lo-trinh')`.
- Verify: BC-4, BC-5 xanh; `plugins`, `kho_moi_cai_goi_road_map`, `kho_cam_ket_co_lo_trinh` xanh; vi phân xanh.
- Phục vụ: E4, E5, E11. independent: false.

## T6 — Dò kho kit
- Files: `scripts/start-scan.mjs` (`metaOpen`): ứng viên manifest = gốc + `source` của từng mục `marketplace.json` ở gốc;
  tên lõi từ bảng; mốc theo đúng đường đã chọn.
- Verify: BC-6 xanh; dòng start-scan của vi phân xanh. Phục vụ: E6. independent: false.

## T7 — Kiểm bản cài nhận gói theo vật
- Files: `scripts/kiem-ban-cai.mjs`: hàm xuất `goiMang(mf, cay, rel)`; ba lời gọi `p(...)` dùng nó.
- Verify: BC-7 xanh; `kiem_ban_cai_loi_sua` xanh. Phục vụ: E7. independent: false.

## T8 — feature-loop tự host
- Files: `feature-loop/scripts/goc-loi-tu-host.mjs` (mới), `giu-tuoi.mjs`, `thuoc-vat.mjs`, `carry-plan.mjs`.
- Verify: BC-8 xanh; suite `workflows` xanh. Phục vụ: E8. independent: false.

## T9 — Ca cửa tín hiệu có sẵn
- Files: `tests/scripts/{tin-hieu,cua-tin-hieu-giua-chien-dich,cua-tin-hieu-goc-moi-worktree}.test.mjs`: nạp
  `scripts/hop-thu/` ở phía kit; mọi nhát phá vào tệp dùng chung áp lên CẢ hai bản.
- Verify: E13, E14, E15 xanh; VP-HT xanh. Phục vụ: E1, E13–E15. independent: false.

## T10 — RT13 chỉ so hồ sơ có ở mốc
- Files: `tests/plugins/ra-co-ten.test.mjs` (ca RT13): phép so cũ↔mới lọc hồ sơ có `contract.md` tại `cb38ea01`; dòng
  khai của hồ sơ sau mốc bỏ qua; chiều đỏ (ii) chọn dòng khai của hồ sơ có ở mốc; hai nhát mới trên bản sao cây (hồ sơ
  sau mốc khác lớp → im; hồ sơ có ở mốc đổi lớp không khai → đỏ). Đo chéo trên bản kéo tạm `delivery-loop`: RT13 xanh.
- Verify: E17 xanh. Phục vụ: E17. independent: false.

## T11 — Danh sách chép + bản đồ + suite đủ
- Files: `commands/acceptance-init.md` (ba mục hộp thư + `lib/ho-goi.cjs` `[only-if-declared: lo_trinh]`),
  `PRODUCT-MAP.md`, `LO-TRINH.html`.
- Verify: BC-3 xanh; `--chieu-do` 8/8; vi phân xanh; `suite_keys` + `plugins` + `dieu_phoi` xanh.
- Phục vụ: E3, E1, E10, E12. independent: false.
