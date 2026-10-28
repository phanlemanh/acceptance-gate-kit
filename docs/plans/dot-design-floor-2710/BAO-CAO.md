# Báo cáo đợt design-floor-2710

Đợt đầu tiên kho kit tự chạy bằng gói `dieu-phoi` của chính nó. Mở 27/10 03:53Z, chủ kho duyệt thẻ khởi tạo 03:56Z
(«Duyệt, Đồng ý» = build cả năm hàng + quyền tự gộp), đóng 28/10 05:26Z sau khi chủ kho gõ «duyệt đóng đợt».

## Đã giao

| Hàng | Việc | PR | Lượt chấm |
|---|---|---|---|
| FL1 | Cổng thiết kế trả KHÔNG-ĐO-ĐƯỢC kèm lý do, không REJECT oan | #434 | 4 (vượt trần 3, chủ kho chọn chấm thêm) |
| FL2 | Vendor lõi gọn Design OS + sổ LOCAL-PATCHES + bản vá A | #427 | 1 |
| FL3 | Bản vá B, C, D | #429 | 1 (lượt đầu bị hạ tầng đốt, chạy lại) |
| FL4 | Móc S0 và S1 | #433 | 3 |
| FL5 | Móc cuối S3 và S4 | #438 | 1 |

Hai dãy: D1 = FL1; D2 = FL2 → FL3 → FL4 → FL5. Mốc «Phát hành 2.x kế tiếp — design-floor-2710» trong
`docs/plans/lo-trinh-kit.json` gắn từng hàng khi hợp đồng duyệt (#426, #428, #431, #437). FL-C1 vẫn là mục chờ điều kiện.
Gói đợt và việc bật gói ở kho kit: #425. Không hàng phát sinh, không lớp phủ ưu tiên.

## Số đếm (`dem --json` lúc đóng)

- Lượt gọi chủ kho: 15 cho 5 hàng — FL1 6 · FL2 3 · FL3 1 · FL4 2 · FL5 3. FL1 vượt trần T3 (4) vì hai lần trả lại ở
  Cổng Bằng chứng và một lần chọn lối ra ở trần lượt.
- Ký → gộp: đo được 1 hàng (FL3, 58 phút); ba hàng `chua_do`.
- Gộp nhánh chính vào nhánh trước gộp: 2 (FL3). Ghim lại sau ký: 0.
- Hạn mức tuần dùng tới lúc đóng: 35 %.

## Sự cố

- **Token đăng nhập bị thu hồi giữa lượt chấm FL3 (27/10 ~11:33Z):** 25/39 tác tử lỗi, lượt BLOCKED vì hạ tầng; chạy lại.
- **Áp lực bộ nhớ mức 2 kéo dài:** giảm tải bật tắt nhiều lần; một lượt FL4 chạy dưới tải phải chấm lại và chờ ~30′ vì
  thiếu chỗ (cần 14 GB). Một nhịp `sysctl` hết giờ, một lần `git fetch` lỗi thoáng qua.
- **Bộ phân quyền tự động chặn `git push` ở phiên FL1** sau khi ký; chủ kho tự đẩy, giám sát không đẩy thay.

## Chỗ vấp của gói (ghi lại, chưa mở việc — luật đóng băng việc-kit giữa hai mốc)

1. Khuôn lịch 30′ trong `commands/mo-dot.md` không có `tiep-tuc --phien <mã> --nhe`; thiếu nó thì `danh-thuc` báo nhầm
   «giám sát không có nhịp sống» và sự kiện cũ cứ tính là việc chờ.
2. Cổng ký ở phiên thợ không gỡ yêu cầu `can-nguoi` của chính cổng đó; giám sát phải đóng tay bằng `tra-loi … da-xong`
   (15 lần trong đợt).
3. Phiên thợ mở trước khi bật gói không có hook → không có nhịp sống, khoá thuê bị thu hồi khi chạy lệnh dài không bọc.
4. Bộ phát lịch hoãn `git fetch` khi có khoá `s4` nên không thấy hàng vừa gộp tới khi lượt chấm khác xong; giám sát
   cho dãy mở hàng kế trước.
5. Giờ ở trường `at` của sổ quyết định do tác tử tự viết lệch giờ thật ở hai phiên (giờ máy +07 gắn Z).
6. Checkout chính của kho đứng ở nhánh docs cũ → `nguon_hang` đọc lộ trình lệch; gói đợt khai hàng tay có slug.

## Hạt giống sinh trong đợt

`docs/plans/2026-10-27-hat-giong-design-gate-khoi-dieu-kien.md` · `2026-10-27-hat-giong-fl2-ngoai-1.md` ·
`2026-10-27-hat-giong-fl3-xanh-gia-reuse-plan-va-gate.md` · `2026-10-28-hat-giong-fl4-bac-tat-im-lang-va-the-m0.md` ·
`2026-10-28-hat-giong-fl5-s3-s4-ben-tren-kho-that.md`.
