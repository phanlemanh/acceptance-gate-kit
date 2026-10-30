# Hạt giống — design-gate dom mù màu Tailwind v4 và bỏ lặng cờ lạ

**Ngày:** 2026-10-25 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** thước nói sai trên kho tiêu thụ (bộ dò dom + bộ đọc tham số của `scripts/design-gate.mjs`).
Gốc: báo cáo phiên V1 của kho crm, vòng VK10 `che-do-soan-bo-okr` (kit 2.34.0), 25/10 — gửi sang phiên kit trong lúc vòng `_acceptance/design-gate-che-do-chat/` chờ Cổng Phạm vi.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/design-gate-che-do-chat/contract.md` trích lại tệp này.

## Số đo (của crm, chưa dựng lại ở kit)

1. **dom mù màu Tailwind v4.** jsdom bỏ mọi luật trong `@layer`; Tailwind v4 đặt utility trong `@layer utilities`.
   Phần tử mang `.text-\[\#e5e5e5\]` cho computed `color: rgb(0,0,0)`, `font-size: 16px`; HTML chữ #e5e5e5 trên nền
   trắng ra 0 P0 ở `--mode dom`. crm né bằng cách ghi computed style vào `style` nội dòng lúc lưu HTML.
2. **Cờ lạ bị bỏ lặng.** `parseArgs` bỏ qua mọi token `--x` không biết (vd `--html`, `--require-html` của
   design-static-check); đường dẫn trần đi sau thành đích chấm. Hệ quả cho vòng `design-gate-che-do-chat`: kho thêm
   `--require-measured` mà vẫn chạy bản kit cũ thì cờ bị nuốt, eval vẫn xanh rỗng.
3. **Nền rgba bán trong suốt so như nền đặc** ở dom → low-contrast giả (3,5:1 thay vì ~14:1).
4. Tầng P0 chỉ có `low-contrast`, `gray-on-color`, `text-overflow`, `broken-image`, `body-text-viewport-edge`;
   `design-system-color` nằm trong danh sách bỏ (`lib/p-tiers.json`).

## Đề xuất (chưa làm)

1. Cờ lạ → BLOCKED mã 4 nêu tên cờ. Ràng buộc đã biết: crm truyền `--target <tệp>` ở 61 khoá và nó chạy được vì bị
   bỏ qua — phải nhận `--target` làm bí danh của đích trước khi đỏ cờ lạ, nếu không mọi khoá crm đổi màu (đổi mặc
   định, mọi kho trả giá — đo cờ lạ đang dùng ở mọi kho trước).
2. dom: phát hiện stylesheet có `@layer` mà jsdom bỏ → KHONG-DO-DUOC có lý do riêng, thay vì PASS; hoặc làm phẳng
   `@layer` trước khi nạp. Cần jsdom trong suite chung để đo (CỘNG).
3. Nền rgba: lỗi bộ dò vendored (Impeccable) — báo thượng nguồn hoặc vá có ghi trong NOTICE.

Ngưỡng mở thành ô: crm (hoặc kho thứ hai) đưa một eval dom vào hồ sơ ký mà màu là tiêu chí, hoặc owner gọi tên.
