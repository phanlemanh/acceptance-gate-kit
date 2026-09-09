---
schema_version: 1
slug: cong-dang-co-cua
feature: Cổng Đáng có cửa — thẻ cổng thứ ba + ký một lượt bằng lệnh duyệt sẵn có
owner: phanlemanh@gmail.com
stage: scheduled
verdict:
decided_by:
decided_at:
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: Ký Cổng Đáng cho ô kế tiếp có còn là **một lượt gọi người, một PR** không, và thẻ có in đúng bốn lối ra sống không?
- Kết quả nào là SỐNG: ô kế tiếp ký xong trong 1 lượt · 1 PR · 0 chữ nào của người bị máy viết trước (verdict và căn cứ để trống tới khi người chọn) · thẻ có ≥ 2 lối ra sống thật sự bấm được
- Kết quả nào là CHẾT: vẫn ≥ 2 lượt gọi người, HOẶC máy viết sẵn verdict rồi xin gật, HOẶC thẻ in nút cho một cổng khác
- Timebox: ô thật đầu tiên đi qua; muộn nhất 2026-09-30 → park

## Người dự

Vòng nội bộ của bộ công cụ: người dùng cuối là người ký Cổng Đáng, tức chủ kho.

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | chủ kho, người ký mọi ô | người ký Cổng Đáng ở mọi repo dùng kit |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | (điền khi ký) | — |

## Thảo luận sau khi đã chấm

Máy đo trước 09/09/2026 (phiên đúc kết). Hai điều phải nói trước khi đọc số:

1. **Phạm vi đã ship KHÔNG còn làn thẻ.** Vòng 01/09 dựng trọn làn thẻ Cổng Đáng
   rồi thu về ô ở điều khoản dừng-vá (hai vòng chấm liên tiếp sinh lỗi cùng lớp);
   mã giữ ở mốc `528caaa8`, đường lấy về ở `discovery/LAY-VE-LAN-THE.md`. Phần ship
   là **ký một lượt bằng lệnh duyệt sẵn có** + hai lời thuật từ chối. Vì thế vế
   «thẻ có ≥ 2 lối ra sống thật sự bấm được» đo trên một vật không còn trong phạm
   vi; người ký quyết đọc vế này là «không áp dụng» hay ghi `[SUPERSEDED]` ở
   `opportunity.md`.
2. **Số đo là vết trong kho, không phải vết hội thoại.** «Một lượt gọi người» đọc
   qua số commit ký ô và lời owner được trích trong commit; «máy không viết verdict
   trước» không đọc được từ kho — chỉ owner biết.

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| Ô kế tiếp ký xong trong 1 lượt | 1 lượt | 4 ô ký Cổng Đáng sau 01/09: `loi-moi-cong-may-sinh` (01/09, 1 commit), `vu-trang-goal-luc-goi-ten` (03/09, ký ở commit mở ô, owner «gọi tên»), `vong-la-mot-ket-qua` (04/09, 1 commit), `duong-lui-phai-song` (08/09, 1 commit, owner «Thực hiện hết») — mỗi ô một commit ký, lời owner một cụm | SỐNG |
| 1 PR | 1 | commit ký nằm trong PR của vòng tương ứng, không PR riêng cho chữ ký (vd. `f04cb35f` trong PR 159) | SỐNG |
| 0 chữ của người bị máy viết trước | 0 | không đọc được từ kho — người ký tự chấm | người ký chấm |
| Thẻ có ≥ 2 lối ra sống bấm được | ≥ 2 | làn thẻ đã thu về ô (dừng-vá 01/09); lối ra sống ở ô là bốn giá trị `decision` (build · iterate · park · kill) và dòng việc-kế của `/start` («người: quyết có làm việc này không») | không áp dụng — người ký quyết |
| Timebox 30/09 | ô thật đầu tiên đi qua | ô đầu tiên đi qua 01/09, cùng ngày ký Cổng Đáng của chính hồ sơ này | đạt |

## Quyết định Cổng Giá trị

(người ký điền `verdict`, `decided_by`, `decided_at`, `stage: held`)
