# Bản phạm vi — bản đồ khuôn trong nền thiết kế của kit (31/10/2026)

Gốc: crm-onehub `docs/plan/pham-vi-ban-do-khuon-3010.md` — bản phạm vi của kho thứ nhất (BK1–BK4), chủ kho duyệt 30/10.

**Tệp này là gì.** Phần KIT của mạch «giao diện không đồng nhất giữa các màn → bản đồ khuôn». Chủ kho 31/10: «Phân tích
và đề xuất cho tôi cắt lượt bản đồ khuôn cho design-floor của kit», rồi «cắt lượt phải dẫn đến kho tri thức cùng các tài
liệu để đảm bảo không mất bối cảnh». Năm mã dưới đây cắt hết vào **mục chờ điều kiện** (`chan_troi` của
`docs/plans/lo-trinh-kit.json`), KHÔNG thành hàng: tệp không mở ô, không mở hồ sơ, không đổi engine.

## 1. Vì sao chưa có hàng nào

| Điều chặn | Căn cứ | Hôm nay (31/10) |
|---|---|---|
| Thứ tự chủ kho chốt: kho thứ nhất chạy thử → kho thứ hai khai cùng hình dạng → kit rút cơ chế | finding §13 QĐ-2 | crm chưa chạy vòng nào: BK1, BK2 chưa mở; BK3 dừng ở Cổng Đáng |
| Ô chỉ mở khi có neo ngoài | `CLAUDE.md` «Ô chỉ mở khi có NEO NGOÀI»; finding §13 M-4 | chưa có hồ sơ vòng thử nào của crm đã ký để trỏ về |
| Giữa hai mốc được một kho nhận: tối đa một vòng meta, chủ kho gọi tên | `CLAUDE.md` luật chiều rộng (b) | 2.36.0 vừa phát hành 31/10, chưa kho nào nhận |
| Hàng sau đứng trên dữ liệu thật của hàng trước | skill `cat-luot`, luật 2 | lược đồ tệp bản đồ phải rút từ tệp crm dựng thật ở BK1 |

Bốn mã là CỘNG (KH1, KH2, KH4, KH5): khi mở, chủ kho phê đích danh ở Cổng Phạm vi của chính hàng (ADR 0018). Từ 31/10
máy MacBook Pro không chạy crm nữa; tín hiệu «vòng thử đã ký» về qua kênh liên máy kit #308.

## 2. Trạng thái phía crm lúc cắt (đọc 31/10 trên nhánh `onehub` `a3138b29c`)

- `docs/plan/lo-trinh-okr.json` có ba hàng: BK1 `khung-chung-ngan-ban-ghi` (đứng trên SV9, SV10) · BK2
  `rang-giu-khung-ngan` (đứng trên BK1; câu giao đã gánh luôn ảnh ngăn mới cạnh ngăn deal của BK4) · BK3
  `rang-khung-trang-mo`.
- Ô BK3 `_acceptance/rang-khung-trang-mo/` dừng ở Cổng Đáng, nhánh `chore/rang-khung-trang-mo`.
- `design/patterns/` chưa có trên `onehub`: tệp bản đồ đầu tiên là vật của BK1.

<!-- <<<PHAM-VI-MA -->
```
dot: ban-do-khuon-kit-3110
dang: chuoi
nguon: acceptance-gate-kit-tri-thuc:wiki/chu-de/ban-do-khuon.md#07ce066535c66b90e25103a5b7e8edca3c62d294

- `KH1` — S4 chấm vật theo khuôn: vòng dựng màn ngoài khuôn bị trả lại, gọi đúng tên tệp và khối cấm; kho không khai bản đồ thì không đổi gì
- `KH2` — thẻ Cổng Phạm vi và Cổng Bằng chứng có khối «Khuôn»; S1 đọc màn mẫu trước khi chọn phương án; đối tượng mới chỉ thêm một chạm ở cổng sẵn có
- `KH3` — bước thiết kế chụp màn mới cạnh màn mẫu, cùng khổ và cùng trạng thái
- `KH4` — sinh đoạn cấu hình lint cấm nhập theo vùng từ bản đồ khuôn
- `KH5` — lúc bật nền thiết kế, máy đề xuất bản đồ nháp từ mã và liệt kê màn đang lệch
```
<!-- PHAM-VI-MA>>> -->

## 3. Chi tiết cho người mở hàng sau này

Kiến trúc đầy đủ ở finding §11; bảng dưới chỉ ghi phần mỗi mã gánh và chỗ đọc.

| Mã | Gánh (finding §11.2) | Cỡ ước | Đọc trước khi mở |
|---|---|---|---|
| KH1 | bộ đọc + bộ đo lược đồ `design/patterns/<nhóm>.md` · lệnh khuôn chế độ `kiem` · tệp `_acceptance/<slug>/khuon-cham.json` · dòng S0 · thước hai chiều §11.5 | ~10 | §11.3 hình dạng tệp, §11.4 hàng S4, §11.5, §11.6; tệp bản đồ thật của crm sau BK1 |
| KH2 | chế độ `nap` ở S1 bước 0d · khối «Khuôn» trên thẻ Cổng 1 và Cổng 2 (`scripts/gate-card.js`) | ~8 | §11.4 hàng S1, Cổng 1, Cổng 2; đếm lượt người §11.4 |
| KH3 | bước chụp đối chiếu trong skill `design-pass` | ~6 | §5.2 gạch cuối; dòng «màn mẫu» của crm (BK2) |
| KH4 | chế độ `goi-y-lint` | ~6 | §10 H3; luật oxlint của crm sau BK2 |
| KH5 | chế độ `de-xuat`, gắn vào lệnh bật một lần của DFK1 | ~8 | §11.4 hàng «Khởi tạo kho»; bản phạm vi DFK `docs/plans/pham-vi-design-floor-kho-moi-2910.md` |

**Một điểm chốt ở Cổng Phạm vi của KH1:** bộ đọc JSX của S4 (DFK-C1) chỉ mở sau 10 vòng DO1 của invest. KH1 có thể không
chờ: bản đầu kiểm «tệp có nhập khối cấm» và «gốc có dựng khuôn» theo mẫu chữ, khai giới hạn sót ca viết lách khéo kèm
ngưỡng đếm; hoặc chờ DFK-C1. Lựa chọn thuộc chủ kho ở cổng ấy.

## 4. Đường đọc lại bối cảnh — đọc theo thứ tự

1. **Kho tri thức kit** (riêng tư) `acceptance-gate-kit-tri-thuc:wiki/chu-de/ban-do-khuon.md` (băm ở dòng `nguon` trên) —
   nguyên lý chung, cơ chế, bài học ux-kit, thứ tự đã chốt. Dòng `nguon` của trang trỏ bảy tệp thô bất biến ở
   `raw/2026-10-30-ban-do-khuon-tai-lieu/` (finding · tám hình · kiến trúc), `raw/2026-10-30-ban-do-khuon-ux-kit/`
   (gói ux-kit) và `raw/2026-10-30-ban-do-khuon-phien/` (trích phiên, chữ duyệt). Trang nối chéo
   `wiki/chu-de/design-floor.md` (trục token, DFK).
2. **Finding của kit** [`docs/findings/2026-10-30-ui-dong-nhat-giua-cac-man.md`](../findings/2026-10-30-ui-dong-nhat-giua-cac-man.md)
   (PR #451): §0 một phút → §5.2 phần của kit → §7 nguyên lý mọi kho → §10.3 sau khi học ux-kit → §11 kiến trúc, giai
   đoạn, hai chiều của thước → §13 sổ quyết định QĐ-1…QĐ-7.
3. **Hình:** [`assets/2026-10-30-kien-truc-ban-do-khuon.html`](../findings/assets/2026-10-30-kien-truc-ban-do-khuon.html)
   (duyệt cuối) · [`assets/2026-10-30-ui-dong-nhat-giua-cac-man.html`](../findings/assets/2026-10-30-ui-dong-nhat-giua-cac-man.html)
   (tám hình).
4. **Kho tri thức crm** (riêng tư) `crm-onehub-nguon:wiki/chu-de/ban-do-khuon.md#c9d74eaf0b846ddf5f3c2d50c9bf729045eec214`
   — phần riêng của crm: tệp, màn, chữ duyệt của chủ kho.
5. **crm** `docs/plan/pham-vi-ban-do-khuon-3010.md` (PR crm-onehub #591) — BK1–BK4, tệp chạm, thứ tự; và hàng BK1–BK3
   trong `docs/plan/lo-trinh-okr.json`.
6. **Nền thiết kế của kit:** bản phạm vi DFK (PR #446) — hàng chờ DFK-C1, DFK-C3 là nguyên liệu của KH1 và KH5.
