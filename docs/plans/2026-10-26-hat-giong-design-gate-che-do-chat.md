# Hạt giống — design-gate chế độ chặt `--require-measured` (vòng dở, bàn giao MacBook Pro)

**Ngày:** 2026-10-26 · **Trạng thái:** hạt giống (SỔ) — vòng `design-gate-che-do-chat` đã dựng tới Cổng Phạm vi rồi
dừng; chủ kho (26/10) bảo ghi lại thành hạt giống và chuyển MacBook Pro. **Loại:** bật thêm theo lựa chọn (CỘNG).
Gốc: `_acceptance/design-gate-che-do-chat/` — crm 25/10, vòng VK10 `che-do-soan-bo-okr`: static trên `.tsx` trả
`KHONG-DO-DUOC` mà thoát 0; ngưỡng mở lại «≥1 kho xin» của `_acceptance/nen-dieu-kien-va-static-khong-do-duoc/` tới.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/design-gate-che-do-chat/contract.md` trích lại tệp này.

```
MAY_GIAO:   Mac Studio (phiên con của V1 · đợt vo-khu-muc-tieu, kho crm)
MAY_NHAN:   MacBook Pro
NHANH:      vong/design-gate-chat-khong-do-duoc   (cắt từ origin/main 0e095648 = v2.34.0)
TRANG_THAI: contract draft — Cổng Phạm vi CHƯA ký; một câu hỏi người: Hỏi-1 (phê CỘNG cờ + mã 5)
TIEP_TUC:   /feature-loop:feature-loop design-gate-che-do-chat  → vào thẳng Cổng Phạm vi
```

## Đã có trên nhánh

- Ba vật S1: design doc `docs/superpowers/specs/2026-10-25-design-gate-che-do-chat-design.md`, hợp đồng 8 tiêu chí,
  `evals.yaml` 8 eval (khoá `executors.script.dgc_*` trong `_acceptance/config.yaml`), sổ 8 dòng (1 câu hỏi · 5 máy quyết
  · 2 bị thay), `gap-probe.md` (1 P0 human-gate1 · 2 P1 · 2 P2, đã định đoạt), hình `figures/hoi-1-ba-loi.png`, thẻ.
- Bộ ca `tests/scripts/design-gate-che-do-chat.test.mjs` — commit RIÊNG trước bản sửa (chiều đỏ trong lịch sử: trên bản
  chưa sửa 4/6 ca đỏ đúng chỗ). Sau sửa 7/7 xanh, năm đột biến đỏ đúng ô; bộ ca vòng trước 3/3 xanh.
- Bản sửa `scripts/design-gate.mjs` + `skills/acceptance/references/design-ui-check.md` + mục CHANGELOG chưa phát hành.

## Hành vi (khi được phê)

- `--require-measured`: đích không phải HTML → thoát **5** (static và dom; dom quyết bằng đuôi trước khi nạp jsdom).
  Lỗi chặn static thấy được trên `.tsx` vẫn REJECT 2. HTML không đổi. Vắng cờ: không mã thoát nào đổi.

## Chưa làm

1. **Cổng Phạm vi** — chủ kho trả lời Hỏi-1 (`/acceptance-gate:approve design-gate-che-do-chat ___`). Lối khác: B không phê
   (kho tự đọc `do_duoc`), C đổi mặc định (crm 57 eval + artifact-platform 23 khoá đỏ cùng lúc).
2. **Đường nền chạy lại trên cây sạch.** Bản ghi `duong-nen.md` đỏ ba chân (`scripts_mjs_3`, `plugins_vung_1`,
   `product_map`) là do vòng: phiên giao sửa tệp giữa lúc suite chạy và thư mục hồ sơ mới làm bản đồ lệch. Đối chứng:
   cả ba lệnh XANH trên một worktree sạch `origin/main` 0e095648 (25/10). Bản đồ đã vẽ lại trong commit vật S1.
3. S2 → S5: kế hoạch ngắn, lượt chấm S4, Cổng Bằng chứng, PR.

## Số đo bàn giao cho crm (chỉ đọc, crm main b32a1495f)

- 61 khoá `*_san_thiet_ke` chạy static trên `.tsx` → 61 eval / 61 hồ sơ (56 signed-off · 1 machine-cleared · 4 `not-run`).
  Nhận bản mới: 0 eval đổi màu. Thêm cờ: 57 eval đỏ, mã eval 1 (vòng `|| exit 1`), muốn thấy 5 dùng `|| exit $?`.
- Kit 2.34.0 bỏ lặng cờ lạ: thêm `--require-measured` trước khi nhận bản mang cờ thì vẫn xanh rỗng.
- Static không thấy màu kể cả trên HTML; dom thấy nhưng mù `@layer` Tailwind v4 — hạt giống
  `docs/plans/2026-10-25-hat-giong-design-gate-dom-mu-tailwind-v4.md`.

Ngưỡng mở lại thành vòng: chủ kho trả lời Hỏi-1, hoặc MacBook Pro nhận và gọi `/feature-loop:feature-loop design-gate-che-do-chat`.
