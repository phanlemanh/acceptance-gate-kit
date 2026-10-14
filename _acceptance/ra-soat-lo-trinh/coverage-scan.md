# Quét hình thái — ra-soat-lo-trinh

Nguồn: `docs/findings/2026-10-14-kien-truc-roadmap-plugin.md` §8 (quét 14/10, skill `morphological-scan`, preset
entity-feature) — chép phần áp cho vòng 1 («chỉ cờ»).

## Ngữ cảnh
- Sản phẩm: lộ trình của kit nghiệm thu — chân sản phẩm `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]` (ba danh sách ô,
  `chan_troi`, `da_bac`) + số đo 14/10 trên crm `d0351bcd` và kit · chân ngành `[NGÀNH: GitHub actions/stale]`,
  `[NGÀNH: Linear — auto-close]`, `[NGÀNH: Shape Up — không backlog]` (kiểm qua web 14/10).

## Trục
- A · Vị trí hàng: mốc chiến dịch đã qua ngày | mốc chiến dịch chưa tới | mốc người/sự kiện (`ngoai`, `han`, `han-cung`, `su-kien`) | không thuộc mốc  [thước CE: `moc[].loai`, `moc[].ngay`]
- B · Trạng thái: chưa có hồ sơ | đang mở | đã giao | xếp lại (hồ sơ / tự khai) | đã bác | hỏng | không suy được  [thước CE: `SECTIONS` của product-map, `suyTrangThai`]
- C · Chính sách: không khai | khai đúng | khai sai | hàng ghim  [thước CE: B′ §6 + actions/stale]
- D · Mặt hiện: thẻ khởi động | lệnh chữ | lệnh JSON | trang (không đổi) | cắt lượt | gói road-map  [thước CE: B′ §11]

## Core (vòng 1 — chỉ cờ)
1. Ba luật sự thật (mốc chiến dịch qua ngày · xếp lại · đã bác) trên ma trận A × B → AC-1
2. Phép đếm đúng + chính sách tuổi/trần/ghim → AC-2 (S2 của B′ §8)
3. Tuổi theo lịch sử, sống qua đánh lại mã → AC-3 (S3)
4. «Mốc chiến dịch» = `loai` vắng hoặc `phat-hanh` → AC-1 (S4)
5. Hàng có hồ sơ đóng khác → đề xuất theo hồ sơ → AC-1 (S1)

## Later
- Báo trước một nhịp · trần thao tác · tự áp · bộ ghi · lệnh ghim/tra-lai (S5) — vòng 2.
- Rà soát mục «chờ điều kiện» theo `mo_lai_khi` (S6) · luật ưu tiên hai luật ngược nhau (S7) · chính sách ở thẻ mở đợt (S8, vùng M5).

## Never
- Đụng hàng có hồ sơ đang mở · tự chấm điểm ưu tiên · xoá hẳn hàng · rà soát mốc của người.

## Cross-cutting
- Kho không có đề xuất: thẻ giống từng byte (AC-4) · trang tất định (AC-6) · lệnh chỉ đọc (AC-5) · chữ «chờ điều kiện» (AC-8).
