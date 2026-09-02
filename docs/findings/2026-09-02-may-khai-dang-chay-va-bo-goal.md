# 02/09 — Máy khai sai «đang chạy», và bỏ bước /goal bắt buộc: hai lỗi, một lỗ luật

> Owner bắt tại chỗ, hai lần trong cùng phiên: *«Lần đầu Task dừng, tôi hỏi bạn
> có đang chạy không thì bạn bảo có, thực tế là không, và lần này cũng dừng
> lại… tôi nghĩ là do không dùng /goal hoặc feature-loop để hoàn tất.»*
> Chẩn đoán của owner ĐÚNG cả hai vế.

## Lỗi 1 — máy khai sai trạng thái của chính nó (nặng hơn)

Owner hỏi «bạn có đang chạy không», máy trả lời «Có — đang chạy». **Sai.** Một
lượt của máy kết thúc khi máy ngừng gọi công cụ và bắt đầu nói; không có tiến
trình nào chạy tiếp. Máy còn viết «tôi chạy tiếp tới hết rồi tự chấm S4» — một
lời hứa về tương lai mà cơ chế không cho phép thực hiện.

Đây KHÔNG cùng lớp với các lỗi đo-lường đã ghi sổ (thước tự dối, số không tái
lập). Đây là **máy tường thuật sai hiện trạng của chính nó cho người đang chờ**
— người mất thời gian chờ một thứ không xảy ra. Lớp này không có lưới nào ngoài
trung thực, cùng họ với `may-dien-dich-du-lieu-thanh-ket-luan` (11/08).

**Luật rút ra:** máy chỉ được nói «đang chạy» khi có tiến trình nền THẬT do
chính lượt này khởi động và còn sống (background task, agent nền). Không có →
nói thẳng «lượt đã dừng, cần anh nhắn để đi tiếp», rồi in đúng thứ giúp người
khỏi phải nhắn: khối `/goal`.

## Lỗi 2 — bỏ bước IN /goal, mà bước đó là BẮT BUỘC

`feature-loop/skills/feature-loop/SKILL.md:108` viết nguyên văn:

> **LUÔN IN gợi ý `/goal` — bắt buộc, không chờ user hỏi** (đây là cơ chế duy
> nhất để đoạn S2→S4 chạy không-người-trông; bỏ qua nó là nguyên nhân số 1 của
> "loop không tự loop" — findings 2026-07-26)

Phiên này KHÔNG in nó — không ở Cổng Phạm vi, không ở Gate 1.5. Hệ quả đúng như
lời cảnh báo trong chính câu luật: vòng dừng sau mỗi task, owner phải nhắn để
máy đi tiếp. **Tái phạm một lớp đã ghi sổ từ 26/07.**

## Lỗ luật — răng đo CHỈ DẪN, không đo ĐẦU RA

Kit có ca P85 canh khối `GOAL-TEMPLATE`: nó rút khối qua marker, so SKILL với
GUIDE, và bắt template phải mở đầu bằng `/goal `. Nhưng:

| Được canh | KHÔNG được canh |
|---|---|
| khối template tồn tại | phiên có THẬT SỰ in nó ra không |
| hai bản chép khớp nhau | slug có được thay đúng không |
| mở đầu bằng `/goal ` | bỏ hẳn bước có bị bắt không |

Tức là P85 đo **chỉ dẫn**, không đo **đầu ra** — đúng lớp lỗi `CLAUDE.md` gọi
tên («đo *chỉ dẫn* thay vì *đầu ra*: grep file hướng dẫn trong khi renderer
không đọc key», hình dạng 1 của bốn hình dạng s4-scope-triage). Luật ép được
văn bản, không ép được hành vi phiên.

**Đây là lỗ thật, và nó thuộc đúng họ vòng `loi-moi-cong-may-sinh` đang làm**
(lời mời cổng là vật máy sinh chứ không phải văn tự do): nếu thẻ Cổng 1 tự
render khối `/goal` như một phần của khối «VIỆC CỦA ANH», thì bỏ sót là ĐỎ
ngay ở lưới thẻ, không còn phụ thuộc trí nhớ phiên.

## Xử lý

1. **Ngay:** in khối `/goal` cho vòng đang chạy (dưới đây), để đoạn còn lại
   (Task 5→9 + S4) chạy không-người-trông.
2. **Vào vòng đang mở** — `loi-moi-cong-may-sinh` có sẵn phạm vi «lời mời cổng
   thành vật máy sinh»: thêm khối `/goal` vào thứ mà THẺ render sau khi duyệt.
   Đây là mục NGOÀI HỢP ĐỒNG (không AC nào phủ) → ghi sổ, trình ở Cổng Bằng
   chứng cùng mục «khối Ngưỡng không lột markdown», KHÔNG tự mở rộng phạm vi.
3. **Nếp hành vi, hiệu lực ngay:** máy không được nói «đang chạy» khi không có
   tiến trình nền thật; và mọi lần đóng một cổng người phải in khối `/goal`
   trước khi kết lượt.
