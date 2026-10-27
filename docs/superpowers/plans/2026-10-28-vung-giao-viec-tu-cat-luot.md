# Kế hoạch — vung-giao-viec-tu-cat-luot

Hồ sơ `_acceptance/vung-giao-viec-tu-cat-luot/` · thiết kế `docs/superpowers/specs/2026-10-28-vung-giao-viec-tu-cat-luot-design.md`.
Thi công tuần tự trong phiên chính (các task chạm chung `trung-tep.mjs`/`hang.mjs` và chung tệp ca — không task nào
`independent: true`). Mỗi task: viết ca trước (đỏ), rồi vật (xanh), rồi ca chiều đỏ trên bản sao.

## Task 1 — phép so vùng dùng chung và độ rộng (dieu-phoi)

**Files:**
- Modify: `dieu-phoi/scripts/trung-tep.mjs` — thêm `coThuMucTinh(glob)` (đoạn tĩnh trước ký tự đại diện đầu có `/`, hay
  glob không ký tự đại diện) và `gopVung(cu, moi)` (hợp, giữ thứ tự, bỏ trùng).
- Test: `tests/dieu-phoi/loi/vung-giao-viec.test.mjs` (khung tệp, ca dùng chung).

verify: `node --test tests/dieu-phoi/loi/vung-giao-viec.test.mjs` · phục vụ E10, E11 · independent: false

## Task 2 — răng phủ cắt lượt (CV-1…CV-4)

**Files:**
- Modify: `scripts/cat-luot.mjs` — khối `VUNG-GIAO-CHEP` (bản chép nguyên văn `khop` + `mauGiao`), cờ hàng
  `vung-qua-rong`, `vung-sai-kieu` (lỗi), `chua-khai-vung`, `vung-chi-ho-so` (cảnh báo) chỉ ở hàng trong đợt; cờ cấp đợt
  `vung-trung-moi-hang` (lỗi, từ ba hàng khai vùng, mọi cặp chồng).
- Modify: `skills/cat-luot/SKILL.md` — khối `CAT-LUOT-VUNG` (luật vùng theo màn, khung giữ cả khu, không `_acceptance/`),
  thêm `vung` vào danh sách trường lượt cắt, năm dòng cờ vào bảng `CAT-LUOT-BANG-CO`.
- Modify: `skills/acceptance/references/lo-trinh-template.json` — `vung` ở các hàng mẫu.
- Create: `tests/scripts/cat-luot-vung.test.mjs`.

verify: `node tests/scripts/cat-luot-vung.test.mjs` · phục vụ E1, E3, E4, E5 · independent: false

## Task 3 — gói đợt chép vùng (VG-1, VG-4)

**Files:**
- Modify: `dieu-phoi/scripts/nguon-hang.mjs` — `docHangLoTrinh` trả thêm `vung` khi hàng lộ trình có mảng chuỗi khác rỗng.
- Modify: `dieu-phoi/scripts/goi-dot.mjs` — `apNguonHang`: hàng thi công không `ranh_gioi` nhận `ranh_gioi = vung`.

verify: `node --test tests/dieu-phoi/loi/vung-giao-viec.test.mjs` · phục vụ E2, E6 · independent: false

## Task 4 — `hang them` lấy vùng lộ trình (VG-5)

**Files:**
- Modify: `dieu-phoi/scripts/hang.mjs` — `themHangTrongKhoa`: không `--ranh-gioi`, không hàng gốc trong đợt, cấu hình có
  `nguon_hang` → tìm mã trong lộ trình (docHangLoTrinh) lấy `vung`.

verify: như trên · phục vụ E7 · independent: false

## Task 5 — khai vùng ở Cổng Phạm vi (VG-7, VG-8)

**Files:**
- Modify: `dieu-phoi/scripts/hang.mjs` — `khaiVung(thuMuc, khoa, vung)`: từ chối glob không thư mục tĩnh (không ghi
  byte), gộp vào `ranh_gioi`, một dòng Nhật ký + sự kiện `doi-ke-hoach` kiểu `vung`; so hàng đang dở/đã ký ở dãy khác
  (trang-thai) → mỗi hàng chồng một sự kiện `trung-tep` `luc: cong-pham-vi`, `can_phan: false`, và một cảnh báo.
- Modify: `dieu-phoi/scripts/dieu-phoi.mjs` — lối `hang vung <mã|slug> --vung <glob,glob>`.
- Modify: `feature-loop/skills/feature-loop/SKILL.md` — khối con `TRONG-DOT-VUNG` trong TRONG-DOT: dòng lệnh khai vùng
  trước thẻ Cổng Phạm vi khi hàng có vùng.
- Modify: `dieu-phoi/README.md` — mục lịch biết tệp.

verify: như trên · phục vụ E10, E11 · independent: false

## Task 6 — phát lại và vi phân (VG-6, VG-9)

**Files:**
- Test: `tests/dieu-phoi/loi/vung-giao-viec.test.mjs` — VG-6 (bản phát lại qua răng + docGoi + motNhip theo kịch bản)
  và VG-9 (git archive bản gốc `goc-so`, năm nhịp, so bốn đầu ra + docGoi; VG-9-do).
- Fixture: `tests/dieu-phoi/fixtures/dot-chong-vung/` (đã dựng ở bước thiết kế).

verify: như trên + `node --test --test-name-pattern="DP1-07" tests/dieu-phoi/dong-goi.test.mjs` · phục vụ E8, E9, E12 ·
independent: false

## Task 7 — lưới chung

- `bash tests/scripts/run-tests.sh --manh mjs:1/3` … và `node --test "tests/dieu-phoi/**/*.test.mjs"`; ca đã có của lịch
  biết tệp (C-…, DP7-08) phải xanh nguyên.
