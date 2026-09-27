---
schema_version: 1
slug: cham-khong-tu-dot-luot
feature: Lượt chấm không tự đốt lượt — lượt chặn vì hạ tầng mang nhãn hạ tầng và thử lại cùng round thay vì đếm vào trần; mã thoát là vật máy đọc, không phải điều tác tử đoán; thẻ Cổng Phạm vi hiện đủ điều người ký cần; bảng chi phí S4 và ảnh bằng chứng đọc được trở lại
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-09-27T07:31:17Z   # owner «Đồng ý mở vòng» 27/09 sau ba lượt phản biện trong phiên; máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: crm/_acceptance/cap-nhat-tuan-okr — vòng chấm 2 và 3 của lượt 4 OKR BLOCKED mà 0 lỗi sản phẩm: E21 bị tác tử khai `exitCode: 1` ở cả hai vòng trong khi lệnh thoát 0, nhãn `vat` khoá thử-lại, hai round đốt, owner phải cho vòng 4 (2 round · 46 phút · 3,9 M token · ≥ 4 tin)
Gốc: crm/_acceptance/quen-mat-khau — round 3 BLOCKED chỉ vì `bun run test`: tác tử khai `killedByTool` khi output bị harness lưu ra tệp; bộ chấm bỏ cờ khỏi sổ, dòng SUITE mang lý do tự do ra nhãn null → khoá → owner gõ `--round 3` tay
Gốc: crm/_acceptance/okr-soat-anh-luot-3 — round 1 BLOCKED, dòng SUITE duy nhất «Output cut off mid-execution…» → nhãn null → khoá
Gốc: crm/_acceptance/cap-nhat-tuan-okr — thẻ Cổng Phạm vi: 8 mục «sẽ không làm» còn một câu tóm, 5 dòng dịch `OOS-*` rơi im; gap-probe có hai bảng phản biện, thẻ chỉ đọc bảng đầu (5 phát hiện vắng)

**Ai gặp:** owner (lượt gọi ngoài thiết kế: «cho vượt trần», `--round` tay; chữ ký Cổng Phạm vi
trên thẻ thiếu mục) · phiên Claude Code chạy vòng ở mọi kho tiêu thụ (round đốt vì hạ tầng, REJECT
giả sửa lỗi không có) · chi phí máy mỗi vòng.

**Cơn đau, đo 26–27/09** (sổ: `docs/findings/2026-09-26-loi-kit-tu-luot-4-okr.md` §3, §6–§10):
quét 63 lượt BLOCKED trên crm · oneflow · media-library: 11 lượt tự thử lại đúng thiết kế, 53 khoá;
2 round đốt chắc chắn do hạ tầng (cap-nhat-tuan-okr r2, r3), 2 lượt khoá chỉ vì dòng SUITE lý do
tự do (quen-mat-khau r3, okr-soat-anh-luot-3 r1), 13 lượt khoá chỉ vì mã thoát mà sổ không phân biệt
mã thật với mã đoán. Harness lưu output dài ra tệp và chỉ hiện 2 KB đầu (đo trực tiếp 27/09: 74 KB,
dấu cuối còn nguyên trong tệp) — tác tử đọc preview đứt thành «bị giết».

Hồ sơ này là **vòng meta duy nhất** giữa mốc 2.18.4 (crm đã cài ở gốc và 9/16 cây) và mốc kế crm sẽ
cài — owner gọi tên 27/09 (luật chiều rộng (b)).

## Giả định chốt sinh tử

1. **Dấu mã thoát chỉ THẮNG khi nó nói lệnh đã chạy xong; nó không biến hạ tầng thành vật.** Tác tử
   khai không-chạy-được vì môi trường mà lệnh thoát ≠ 0 thì vẫn là hạ tầng. Sai nếu một ca «thiếu
   env» từng BLOCKED nay thành REJECT.
2. **Bọc lệnh ở tầng prompt, không đổi chuỗi lệnh trong args** — chuỗi lệnh là khoá của dedupe,
   carry-forward, tên `SUITE-*`, run_id. Sai nếu một khoá ấy đổi.
3. **Không thêm trạng thái, không thêm bề mặt, không đổi schema hồ sơ** — nhãn vẫn `mu`/`chet`/`vat`/
   null; thẻ đọc khoan dung bản dịch cũ. Sai nếu kho tiêu thụ phải di trú hồ sơ.
4. **Kho không gặp sự cố không đổi phán quyết** khi vật không đổi (luật 26/09).

## Ngưỡng chết / ngưỡng UAT

- **Ngưỡng UAT:** sau khi crm cài 2.18.5, trên ≥ 10 lượt chấm kế tiếp ở crm: 0 lần owner phải cho
  vượt trần hoặc gõ `--round` vì hạ tầng; mọi round-tally BLOCKED mà mọi mục là hạ tầng có trạng
  thái `mo` hoặc `chet-lan-dau` (đếm bằng `canhGay` của `lib/nhan-canh-gay.cjs`).
- **Ngưỡng chết (đảo B7):** trên 10 lượt chấm đầu ở một kho KHÔNG có sự cố trước đó, > 1 lượt BLOCKED
  với lý do «ma thoat khong doc duoc» → gỡ vế «không dấu mà khai 0 → không PASS», giữ vế «dấu thắng».
