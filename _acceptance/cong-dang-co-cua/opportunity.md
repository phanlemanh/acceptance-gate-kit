---
schema_version: 1
slug: cong-dang-co-cua
feature: Cổng Đáng có cửa — thẻ cổng thứ ba + ký một lượt bằng lệnh duyệt sẵn có
owner: phanlemanh@gmail.com
stage: discovery            # discovery | decided | archived
decision:                   # build | iterate | park | kill — người ký Cổng Đáng điền
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Cổng Đáng là nơi owner quyết «có làm việc này không» — quyết định đắt nhất của cả dây, vì
ý định phải chốt TRƯỚC khi làm. Nhưng nó là cổng duy nhất không có nghi thức đứng tên: ba
cổng kia có lệnh riêng, Cổng Đáng chỉ có tám dòng chú thích trong khuôn ô. Hệ quả đo được
(audit 22/08 §3 A1–A2): `/start` bàn giao cổng này sang thẻ chỉ biết hai cổng khác nên in
một thẻ RỖNG có nút sai; ngưỡng và chữ ký tách thành **hai lượt gọi người, hai PR**, mà
lượt thứ hai chỉ còn một câu trả lời hợp lý là «ừ» — đúng định nghĩa trạm thu phí. Trong
một ngày (22/08) ba ô được ký theo **ba đường khác nhau**, không đường nào để lại cùng một
loại vết.

**Người trả giá:** owner (gọi hai lần cho một quyết định) và máy (mỗi phiên phát minh lại
nghi thức, nên cùng một việc ba phiên làm ba kiểu).

## Vì sao tách khỏi hồ sơ `ra-co-ten-lam-va-trao`

Phần này ĐÃ được dựng và đã qua phép đo riêng của nó trong vòng `ra-co-ten-lam-va-trao`
(thẻ Cổng Đáng bốn trạng thái ngưỡng · chế độ ký của `/approve` với răng chiều đỏ · bàn
giao `/start` · slot `g0` trong ngữ pháp câu gộp). Nhưng năm vòng nghiệm thu của hồ sơ đó
cho thấy **ba mặt phẳng người trong một vòng là quá rộng để hội tụ**: mỗi vòng sửa lại lộ
một lỗ mới ở chỗ khác. Owner chọn cắt đôi (24/08, tại Cổng Bằng chứng vòng 5).

Mã đã gỡ khỏi nhánh kia và giữ NGUYÊN VẸN ở `discovery/phan-cong-dang.patch` — vòng sau
khôi phục bằng một lượt áp bản vá, rồi dựng thước riêng cho nó.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] Ký Cổng Đáng cho ô kế tiếp có còn là **một lượt gọi người, một PR** không, và thẻ có in đúng bốn lối ra sống không?
- Kết quả nào là SỐNG: [đề xuất] ô kế tiếp ký xong trong 1 lượt · 1 PR · 0 chữ nào của người bị máy viết trước (verdict và căn cứ để trống tới khi người chọn) · thẻ có ≥ 2 lối ra sống thật sự bấm được
- Kết quả nào là CHẾT: [đề xuất] vẫn ≥ 2 lượt gọi người, HOẶC máy viết sẵn verdict rồi xin gật, HOẶC thẻ in nút cho một cổng khác
- Timebox: [đề xuất] ô thật đầu tiên đi qua; muộn nhất 2026-09-30 → park

## Out of scope từ khám phá

- Lệnh thứ bảy cho Cổng Đáng — hiến pháp kit là «chỉ TRỪ, không CỘNG»; dùng lệnh duyệt sẵn có.
- Đổi khuôn ô cơ hội — khuôn đã có bốn lối ra và hai tiền tố máy đọc từ hồ sơ trước.
