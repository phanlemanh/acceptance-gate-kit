---
schema_version: 1
slug: cong-dang-co-cua
feature: Cổng Đáng có cửa — thẻ cổng thứ ba + ký một lượt bằng lệnh duyệt sẵn có
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng Đáng điền
decided_by: Manh Phan
decided_at: 2026-09-01T02:07:52Z   # ISO UTC — mốc phát ngôn ký trong hội thoại 01/09
prototype:
  base_commit: de27babc1f8136b83ea08f8694fe744a4ecee557
  disposition: cây TRƯỚC lúc cắt — lấy về bằng `git archive`, KHÔNG bằng bản vá
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

**Vết mới 2026-09-01 — đo trên kho tiêu thụ, không phải trên kit.** Bản cài 2.5.0 chạy ở
`crm`. Ô `mot-phien-mot-cay` (ngưỡng đã điền, `gate: "dang"`) đi đúng đường nghi thức chỉ:
`/start` bước 4 bàn giao sang thẻ, bộ dựng thẻ thoát mã 2. Từ hôm chốt «thẻ ma» (29/08) con
trỏ chết KHÔNG còn im lặng ra thẻ rỗng nữa — nó ra một lời từ chối, và lời từ chối ấy nói SAI
nguyên nhân: nó bảo hồ sơ «chưa có hợp đồng», rồi thân lệnh ghép ca đó với việc kế «chạy bước
chuẩn hoá yêu cầu». Nhưng hợp đồng sinh ở S1, SAU Cổng Đáng — chính `start.md` viết vậy. Người
đọc được chỉ đi ngược thứ tự của kit. Cùng lúc, `/start` của chính kho kit trình NĂM ô ở Cổng
Đáng (`the-xep-nham-o-se-lam` · `cong-dang-co-cua` · `lan-may-thong-duong-ghi` ·
`phep-kiem-sach-do-theo-vung` · `hinh-o-moi-cong-dung-cho-nguoi`) — cả năm dội cùng một mã 2,
kể cả chính ô này. Ô đang chờ ký nằm sau đúng con trỏ chết mà nó xin phép dẹp.

**Ràng buộc kỹ thuật mới, phải khai trước khi mở vòng:** cây ghim `de27babc` (24/08) có phần
Cổng Đáng nhưng KHÔNG có chốt «không có hồ sơ thì không vẽ thẻ» — chốt đó vào sau, 29/08
(`184a3646`), và nó nằm ở đầu file, TRƯỚC đoạn tự nhận cổng. Bê nguyên cây ghim về thì chốt
chặn trước, làn Cổng Đáng thành mã chết. Nên hai vết trên là MỘT vết: chốt phải học ca thứ tư
(«có ô cơ hội, chưa tới lượt có hợp đồng») thì làn cổng thứ ba mới sống. Phép đo hiện ghim ba
thông điệp đó bằng tên biến ở bốn chỗ trong `_acceptance/khong-ve-the-ma/rang.sh` — hồ sơ đã
ký, nên vòng sau thêm răng của nó kèm con trỏ «thay thế», không sửa ngược hợp đồng đã ký.

## Vì sao tách khỏi hồ sơ `ra-co-ten-lam-va-trao`

Phần này ĐÃ được dựng và đã qua phép đo riêng của nó trong vòng `ra-co-ten-lam-va-trao`
(thẻ Cổng Đáng bốn trạng thái ngưỡng · chế độ ký của `/approve` với răng chiều đỏ · bàn
giao `/start` · slot `g0` trong ngữ pháp câu gộp). Nhưng năm vòng nghiệm thu của hồ sơ đó
cho thấy **ba mặt phẳng người trong một vòng là quá rộng để hội tụ**: mỗi vòng sửa lại lộ
một lỗ mới ở chỗ khác. Owner chọn cắt đôi (24/08, tại Cổng Bằng chứng vòng 5).

Mã đã gỡ khỏi nhánh kia và giữ NGUYÊN VẸN ở `discovery/phan-cong-dang.patch` — vòng sau
khôi phục bằng một lượt áp bản vá, rồi dựng thước riêng cho nó.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Ký Cổng Đáng cho ô kế tiếp có còn là **một lượt gọi người, một PR** không, và thẻ có in đúng bốn lối ra sống không?
- Kết quả nào là SỐNG: ô kế tiếp ký xong trong 1 lượt · 1 PR · 0 chữ nào của người bị máy viết trước (verdict và căn cứ để trống tới khi người chọn) · thẻ có ≥ 2 lối ra sống thật sự bấm được
- Kết quả nào là CHẾT: vẫn ≥ 2 lượt gọi người, HOẶC máy viết sẵn verdict rồi xin gật, HOẶC thẻ in nút cho một cổng khác
- Timebox: ô thật đầu tiên đi qua; muộn nhất 2026-09-30 → park

## Out of scope từ khám phá

- Lệnh thứ bảy cho Cổng Đáng — hiến pháp kit là «chỉ TRỪ, không CỘNG»; dùng lệnh duyệt sẵn có.
- Đổi khuôn ô cơ hội — khuôn đã có bốn lối ra và hai tiền tố máy đọc từ hồ sơ trước.
