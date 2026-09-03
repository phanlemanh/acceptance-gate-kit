# Design — vu-trang-goal-luc-goi-ten (T2)

> Vòng meta duy nhất cửa sổ 2.7→2.8 (owner «gọi tên» 03/09 sau hình v28-01).
> Nguồn: ô `_acceptance/vu-trang-goal-luc-goi-ten/opportunity.md` · hồ sơ mốc
> 2.7.0 § chỗ cắt gọi tên · findings 02/09 + 26/07.

## Bài toán một câu

`/goal` là lớp máy-giữ duy nhất cho «máy chạy tới cổng người», nhưng do người
vũ trang và vũ trang sai chỗ; biến dòng `/goal` thành **vật thẻ in ra** và in nó
ở **mọi lượt người đứng trước một đoạn máy**.

## Bốn quyết định thiết kế

**D1 · Bản chép thứ ba của khuôn goal trong `gate-card.js`.** Hằng
`GOAL_TEMPLATE` là template literal nhiều dòng trong marker `<<<GOAL-TEMPLATE …
GOAL-TEMPLATE>>>` (cùng tên marker SKILL/GUIDE đang dùng). Nghĩa đo được của
«khớp»: nội dung giữa hai dấu `` ` `` của hằng, sau `strip()`, bằng đúng khối
giữa rào ``` của SKILL và của GUIDE sau `strip()` — chính nghĩa P85 đang dùng
(bằng-nhau-sau-strip), đồng thời ghim **6 dòng** ở cả ba (gap-probe S1 P1: chữ
«từng byte» không có nghĩa cho bản JS). Vì sao chép chứ không đọc: `gate-card.js` thuộc plugin
acceptance-gate, khuôn sống ở plugin feature-loop + GUIDE gốc kit — đọc chéo
plugin lúc chạy là đường dẫn giòn; kit đã có nếp «một nguồn + N bản chép so
từng byte» (IDENTITY-ECHO-RULE, GATE-INVITE-CLAUSE). Răng: P85 nới từ 2 sang 3
bản; đột biến đổi một ký tự ở bất kỳ bản nào → đỏ ghim đích danh bản lệch.

**D2 · Thẻ Cổng 1 in `goal_line`.** `--extract` Cổng 1 thêm khoá `goal_line`
= khuôn gộp thành MỘT dòng (xuống dòng → một khoảng trắng), **mọi** lần xuất
hiện của `<slug>` (khuôn có hai) thay bằng slug thật — `replaceAll`, và test
dựng kỳ vọng bằng phép thay ĐỘC LẬP (đếm số `<slug>` còn sót = 0), không chép
`.replace` của bên viết. HTML in nó trong khối «VIỆC CỦA ANH» trong một phần tử
có mỏ neo riêng `<div class="mach goal">` đặt ngay sau `<div class="mach">` của
dòng lệnh duyệt, kèm câu «Sau khi trả lời (duyệt hay sửa), dán dòng này để đoạn
máy chạy tới cổng kế». Round-trip: `<b>` trong `.mach.goal` == `goal_line` của
extract (đẳng thức, không phép chứa — bài học M10 vòng 2.7). In ở MỌI thẻ Cổng
1, kể cả thẻ đang có cờ đỏ. Thẻ Cổng 1 của hồ sơ làn V (máy đi trước, không ai
duyệt): vẫn in — thẻ là vật; ai mở thẻ sau vẫn thấy — nhưng người KHÔNG ngồi
đó, nên với làn V điểm vũ trang thật là D3(a), không phải thẻ này.

**D3 · Điểm in dời về mọi lượt người đứng NGAY TRƯỚC một đoạn máy.** Gap-probe
S1 (P0) bác bản đầu «in ở S0»: S0#2/#3 có câu xác nhận T1 và slug, S1#1 là
brainstorm hỏi-đáp — đều là lượt chờ người, và khuôn goal cố ý coi «chờ input
người» là hoàn thành, nên goal vũ trang ở S0 kết ngay ở câu hỏi đầu tiên. Ba
điểm đúng, đều là lượt người đã có sẵn: (a) **mỗi câu xin duyệt thiết kế của
brainstorm** — skill brainstorming (bản đang cài) có câu «xin duyệt — dừng chờ
đồng ý» với hình dạng biết trước, nhưng có thể nhiều câu và không biết trước câu
nào cuối (gap-probe vòng 2), nên SKILL S1 dặn: mọi câu xin duyệt thiết kế in kèm
dòng `/goal` («nếu đồng ý, dán luôn dòng này cùng câu trả lời»), và S1#5 nói rõ
dòng in kèm đó KHÔNG phải một cổng (không đụng luật «gộp thành MỘT Gate 1»);
đây là lượt người trước đoạn máy S1-đuôi → Cổng 1, và với làn V T2 không chạm
UI là lượt người CUỐI của cả vòng. Ca brainstorm không hỏi gì (như chính vòng
này) không có lượt để vũ trang — khai chưa phủ; (b) **Cổng 1** giữ bước in, nay là
vật thẻ (D2) — vòng không làn V phải vũ trang lại vì goal đã kết ở cổng; (c)
**Gate 1.5** — không có mục riêng, là mệnh đề trong S2#3 «T3: GATE 1.5 — trình
tóm tắt plan … chờ duyệt»: thêm vế «kèm dòng /goal» vào chính mệnh đề đó (lớp
lời, không thẻ). GUIDE mục `/goal`: «Khi nào» đổi từ «ngay sau khi duyệt Gate
1» thành ba thời điểm + câu «làn V T2: lượt cuối brainstorm là lần duy nhất».
Khuôn goal KHÔNG đổi chữ (P85 giữ nguyên các vế đã ghim). Máy không biết trước
câu hỏi nào là cuối — nên điểm (a) là dặn cho câu XÁC NHẬN (câu có hình dạng
biết trước), không phải cho mọi câu hỏi.

**D4 · Bất biến dừng gọi tên ca «tiến trình nền báo xong».** Thêm một vế vào
câu bất biến đầu SKILL: khi tiến trình nền (agent, Workflow) báo xong ở giữa
một đoạn máy → đi tiếp trong cùng lượt; «báo cáo rồi ngừng nói» là một lần
dừng ngoài thiết kế, đếm vào ba dòng số. Đây là dặn-bằng-lời — khai thẳng là
lớp 1, và là lý do D1/D2 tồn tại (vật đỡ chỗ lời trượt).

**D5 · Đuôi S1 hết chỗ để ngừng: gap-probe chạy ĐỒNG BỘ.** SKILL S1#7 nay
dispatch phản biện context sạch ở chế độ chờ-trong-lượt (không nền): máy đợi
kết quả rồi đi tiếp render thẻ Cổng 1 trong cùng lượt. Với làn V T2, từ câu xác
nhận thiết kế tới Cổng 1 không còn lượt trở về nào để máy «báo rồi ngừng»; goal
(a) chỉ còn phải đỡ S2→S4, nơi Workflow S3/S4 mỗi đợt trả về đúng một lần.
Đề xuất của gap-probe S1; là TRỪ một chỗ ngừng, không thêm cơ chế.

## Ngoài phạm vi

- `g1Blocked` của thẻ Cổng 1 không nhìn P0 của gap-probe (thẻ vẫn điền sẵn
  «duyệt» khi còn P0 chưa định đoạt, trái điều kiện làn V của SKILL) — gap-probe
  S1 quan sát ngoài phạm vi; ô riêng, trình Cổng 2 như mục ngoài hợp đồng.

- Hook `Stop` do plugin giữ (lớp 2) — mở chỉ khi mốc 2.8.0 còn đếm thấy dừng
  khi goal đã bật. Ghi ngưỡng, không dựng trước.
- Làn thẻ Cổng Đáng (in goal trên thẻ Cổng Đáng) — ô riêng, cây ghim 528caaa8;
  lúc «làm» vẫn là skill in (dặn) cho tới khi làn đó mở.
- Đo hành vi phiên bằng harness — không có; thước là ba dòng số mốc 2.8.0.
- Đổi mã cổng (hooks/ lib/ pre-merge/recheck) — không chạm; T2.

## Thước

D1/D2: lưới thường trực `tests/scripts` (fixture code-sinh; khuôn RÚT qua marker
từ gate-card.js và so với SKILL/GUIDE; đột biến ba chiều) + P85 nới 3 bản. D3/D4:
grep văn chỉ dẫn qua marker/neo chữ — **đo chỉ dẫn, không đo đầu ra** (khai Known
limits, cùng lớp findings 02/09); đầu ra đo ở ba dòng số mốc kế. Chính vòng này
đi S4 qua Workflow `acceptance-verify` — nếp L0, có run-log do workflow sinh.
