---
schema_version: 1
slug: nhanh-chinh-khong-ten-main
feature: Bước chuẩn bị dữ liệu chấm phải dò được nhánh chính không tên main
owner: phanlemanh@gmail.com
stage: scheduled
verdict:
decided_by:
decided_at:
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: repo tiêu thụ có nhánh chính không tên `main` (và không với được remote) có tự chấm được không, hay vẫn phải khai nhánh bằng tay?
- Kết quả nào là SỐNG: trên fixture repo dựng nhánh `master`, không remote: bước chuẩn bị dữ liệu chấm sinh trọn args với mốc so sánh ĐÚNG (bằng phép tính merge-base độc lập), không cần cờ khai tay; và ca nhánh chính không thuộc bốn tên biết trước thì thông điệp là câu có hướng dẫn («truyền --diff-base»), không phải vết đổ của tiến trình.
- Kết quả nào là CHẾT: vẫn phải khai nhánh bằng tay cho ca `master`, hoặc lời khai trong SKILL phải hạ xuống cho khớp mã (tức nhận thua bằng cách sửa lời hứa).
- Timebox: ship trước 2026-09-05; quá timebox → park, ghi sổ.

## Người dự

Vòng nội bộ của bộ công cụ: người dùng cuối là chủ kho và các repo tiêu thụ có
nhánh chính không tên `main`. Số đo lấy từ phép kiểm chạy trên fixture.

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | chủ kho, người ký | repo tiêu thụ chạy nhánh `master` / không remote |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | (điền khi ký) | — |

## Thảo luận sau khi đã chấm

Máy đo trước 09/09/2026: chạy `node tests/scripts/s4-args-main-branch.test.mjs`
trên `main` tại `fedbfd4d`. Ca kiểm dựng kho tạm bằng mã (fixture code-sinh), không
phải kho thật của một repo tiêu thụ — đó là giới hạn của phép đo. Cờ `qua-timebox`
trên thẻ nói về hạn ship 05/09 của ô (hồ sơ ký Cổng Bằng chứng 29/08 → trong hạn);
cửa sổ đo Cổng Giá trị không có hạn riêng.

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| Fixture nhánh không phải `main`, sinh trọn args, mốc bằng merge-base độc lập, không cờ khai tay | đạt | SA1 PASS «mốc BẰNG merge-base độc lập, khác HEAD»; SA3 PASS «giải qua origin/<tên>, mốc BẰNG merge-base độc lập» | SỐNG |
| Nhánh chính ngoài bốn tên biết trước → thông điệp có hướng dẫn, không phải vết đổ | đạt | SA2 PASS «kêu to nêu tên remote khai, không sinh tệp» + đối chứng dương «trả ref main về → sinh args»; SA4 PASS «lối thoát --diff-base VẪN SỐNG khi remote không hỏi được» | SỐNG |
| Lời khai trong SKILL không bị hạ xuống cho khớp mã | không đổi | `git log -p` của SKILL từ 29/08: dòng «detect nhánh chính bằng `git remote show origin`» được thay bằng «nhánh chính không detect được → script exit có tên, truyền `--diff-base`» — lời hứa được nói rõ hơn theo đúng mã, không hạ | SỐNG |
| Ship trước 05/09 | đạt | ký Cổng Bằng chứng 29/08 | SỐNG |

## Quyết định Cổng Giá trị

(người ký điền `verdict`, `decided_by`, `decided_at`, `stage: held`)
