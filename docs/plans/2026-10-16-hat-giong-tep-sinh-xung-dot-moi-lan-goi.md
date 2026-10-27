# Hạt giống — tệp sinh `PRODUCT-MAP.md` / `LO-TRINH.html` xung đột ở mọi lần nhánh chính dời

**Ngày:** 2026-10-16 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (bớt lượt push và phút máy của mỗi PR).
Gốc: crm-onehub/_acceptance/ke-hoach-sinh-viec — PR #432 phải gộp lại nhánh chính và push lại 3 lần trong một giờ
(16/10 02:19Z–03:45Z), mỗi lần chỉ vì hai tệp sinh xung đột; đọc kênh crm-onehub#375 cùng khung giờ.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

Kho crm, nhánh chính `onehub`, 16/10 02:19Z → 03:45Z. Năm PR gộp nối đuôi: #434 → #417 → #435 → #433 → #431.

- Mỗi lần nhánh chính dời, mọi PR đang chờ mà có chạm lộ trình hay hồ sơ đều xung đột ở `LO-TRINH.html` hoặc
  `PRODUCT-MAP.md`. Cả hai tệp do `scripts/product-map.mjs` sinh trọn từ nguồn (tệp lộ trình JSON + hồ sơ
  `_acceptance/`), nên hai bên sửa nguồn KHÁC NHAU vẫn đụng nhau ở tệp sinh.
- PR #432: đỉnh `3c13a1976` → `9070c050a` → `b5f60e895` → `23929ff4e`. Ba lần push lại, mỗi lần pre-push của kho
  chạy trọn suite khoảng 10′ trên làn nặng duy nhất của máy, nên một PR khác đang chờ làn bị ngắt giữa lượt ghim lại
  hai lần.
- PR #417 (chỉ lộ trình): một lần gộp lại vì `LO-TRINH.html`, thêm ~15′ pre-push.
- Lỗi đi kèm cùng lớp: một lần dựng bằng bản `product-map.mjs` của plugin (khác bản đã chép vào kho) cho
  `PRODUCT-MAP.md` lệch 3 dòng, và CI đỏ ở bước `--check`.

Điều phối máy thứ hai của kho (crm-onehub#375, 03:45Z) phải giữ nhánh chính đứng yên cho một PR để cắt vòng lặp. Đó
là biện pháp tạm bằng lời, không phải nghiệm.

## Gốc

Tệp sinh được commit vào PR, và `--check` ở CI đòi tệp trong PR khớp nguồn trên chính đỉnh PR. Vì thế mỗi PR tự vẽ
lại bản đồ, và mọi lần nhánh chính dời đều thành xung đột văn bản ở một tệp mà không người nào sửa tay.

## Đề xuất (chưa làm — meta đóng băng, chờ owner gọi tên)

Thứ tự theo luật «sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho»:

1. **Bộ đọc khoan dung (rẻ nhất, không đổi mặc định).** `product-map.mjs` in kèm một dòng `.gitattributes` gợi ý
   (`PRODUCT-MAP.md merge=ours`, `LO-TRINH.html merge=ours`, kèm `git config merge.ours.driver true` vì `ours`
   không phải driver dựng sẵn của git) và lệnh gộp xong thì sinh lại. Git không còn dừng ở
   tệp sinh, còn `--check` vẫn bắt bản vẽ sai sau gộp. Chiều đỏ: gộp mà quên sinh lại thì `--check` đỏ đúng chỗ.
2. **Bật thêm theo lựa chọn.** Kho khai `ban_do.sinh_sau_gop: true` thì `--check` ở CI PR chỉ cảnh báo, và một job
   sau gộp trên nhánh chính tự sinh rồi commit hai tệp. Kho không bật thì không đổi gì.
3. Không đổi mặc định cho mọi kho trước khi (1) đo được trên ít nhất hai kho.

**Người hưởng:** máy (bớt ~10–15′ pre-push và một lượt gộp cho mỗi PR mỗi lần nhánh chính dời) và owner (bớt giờ
chờ từ làm-xong tới gộp). Nguyên tố 2: `--check` vẫn là thước, chỉ bỏ xung đột văn bản vô nghĩa.

**Kho không gặp sự cố này được gì, mất gì:** kho không khai lộ trình hoặc ít PR song song thì không đổi gì ở (1),
vì merge driver chỉ chạy khi có xung đột. Mất: một dòng `.gitattributes` mỗi kho chọn bật.

## Ngưỡng mở thành ô

Owner gọi tên, hoặc ≥ 2 kho tiêu thụ ghi được ≥ 3 lần gộp lại vì tệp sinh trong một ngày.

**Lần vấp thứ hai (26/10) — ngưỡng ĐỦ.** onehub-invest, đợt `dieu-phoi-dot0-cam-mau` 25–26/10: gần như mỗi lần gộp
xung đột ở hai tệp sinh, hồ sơ phải ghim lại liên tục (số của giám sát đợt). Kho thứ hai → điều kiện «≥ 2 kho tiêu thụ»
đã có. Xem `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md` mục 1.
