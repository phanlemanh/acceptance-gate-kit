# Hạt giống — hàng lộ trình thiếu slug bị báo nhầm «chưa xong»

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ trước (cờ ở bộ đọc sẵn có; không thêm khoá bắt buộc, không đổi mặc định).
Gốc: `_acceptance/ra-soat-lo-trinh/` — luật `moc-qua-ngay` đề xuất «dời mốc» cho hàng mà bộ suy trạng thái xếp «Chưa mở».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- Lộ trình kit trước đợt dọn 17/10: 50 hàng, 15 hàng không có `slug`. 13 hàng suy đúng «đã giao» nhờ hồ sơ khai
  `lo_trinh_ma` trong `opportunity.md`. **2 hàng xếp sai** — A3 (`ngoai-n-tu-dinh-tuyen`, đã phát hành v2.27.0) và DP8
  (`dieu-phoi-on-dinh-r2`, v2.28.0): `--xem` in «Kế: A3 · DP8» và «Rà soát: 2 đề xuất — 2 dời mốc».
  Cả hai hồ sơ `signed-off` nhưng không có `opportunity.md`, nên không có lối nào nối hàng với hồ sơ.
- Ba lộ trình crm (`onehub` b1666c3ac, đo 17/10): OKR 4/138 hàng không slug, Kho tài liệu 1/17, Việc và Dự án 4/15 —
  9 hàng, cả 9 khai `trang_thai` và suy theo lời; **0 xếp sai** (5 «xong», 1 «chưa mở» đúng — hàng 8b còn nằm ngoài phạm
  vi `canh-kr-okr`, 3 «để sau»).
- Tổng bốn lộ trình: 24 hàng không slug, 2 xếp sai, cả 2 ở kho kit. Đợt dọn 17/10 gắn slug tay cho A3, DP8.

## Gốc

`suyTrangThai` (`scripts/lo-trinh.mjs`, khoảng dòng 218–247) tìm hồ sơ theo thứ tự: thư mục của `slug` → đúng một hồ sơ
nhận qua `lo_trinh_ma` → lời khai `trang_thai`. Hàng không slug, không lời khai, mà hồ sơ không có `opportunity.md`
(vòng mở thẳng không qua Cổng Đáng) rơi về «Chưa mở» im lặng. Máy không có cờ nào nói «hàng này có thể đã xong».

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

1. **Cờ vàng ở bộ đọc:** hàng «Chưa mở» không slug mà một hồ sơ trong `_acceptance/` có `slug` trùng `suySlug(cau_giao)`
   hoặc contract nhắc mã hàng → «hàng A3 có thể đã có hồ sơ X — gắn `slug`». Không tự gắn, không tự xếp «xong».
2. **Rà soát:** không đề xuất «dời mốc» cho hàng mang cờ (1) — đề xuất sai là lượt gọi người ngoài thiết kế.
3. Chiều đỏ: hàng không slug + hồ sơ signed-off không `opportunity.md` → cờ nêu đúng mã và slug; đối chứng dương: hàng
   có slug hoặc có lời khai → im.

**Người hưởng:** điều phối và owner (khối Kế / Rà soát không mời dời mốc một việc đã phát hành).

**Kho không gặp sự cố này được gì, mất gì:** crm khai `trang_thai` cho mọi hàng không slug — không thấy gì mới. Mất: một
lượt quét hồ sơ mỗi lần đọc, chỉ cho hàng không slug.

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc lần thứ hai một hàng đã phát hành hiện ở «Kế» vì thiếu slug.
