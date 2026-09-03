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
`GOAL_TEMPLATE` trong marker `<<<GOAL-TEMPLATE … GOAL-TEMPLATE>>>` (cùng tên
marker SKILL/GUIDE đang dùng), nội dung khớp **từng byte** với hai bản kia
(khối 6 dòng). Vì sao chép chứ không đọc: `gate-card.js` thuộc plugin
acceptance-gate, khuôn sống ở plugin feature-loop + GUIDE gốc kit — đọc chéo
plugin lúc chạy là đường dẫn giòn; kit đã có nếp «một nguồn + N bản chép so
từng byte» (IDENTITY-ECHO-RULE, GATE-INVITE-CLAUSE). Răng: P85 nới từ 2 sang 3
bản; đột biến đổi một ký tự ở bất kỳ bản nào → đỏ ghim đích danh bản lệch.

**D2 · Thẻ Cổng 1 in `goal_line`.** `--extract` Cổng 1 thêm khoá `goal_line`
= khuôn gộp thành MỘT dòng (xuống dòng → khoảng trắng), `<slug>` thay bằng slug
thật; HTML in nó trong khối «VIỆC CỦA ANH» ngay dưới dòng lệnh duyệt, kèm một
câu: «Sau khi duyệt, dán dòng này để đoạn máy chạy tới cổng kế». Round-trip:
dòng trên HTML == `goal_line` của extract (đẳng thức, không phép chứa — bài
học M10 vòng 2.7). In ở MỌI thẻ Cổng 1, kể cả thẻ đang có cờ đỏ: goal phục vụ
đoạn máy *sau* khi người trả lời, bất kể câu trả lời là «duyệt» hay «sửa».

**D3 · Điểm in dời về mọi lượt người đứng trước đoạn máy.** SKILL feature-loop:
(a) S0 thêm bước «in khối GOAL-TEMPLATE ngay, TRƯỚC khi S1 chạy» — S1 có phản
biện context sạch là tiến trình nền, chính ca gây dừng; (b) Gate 1 giữ nguyên
bước in (vũ trang LẠI — khuôn goal cố ý coi «chờ input người» là hoàn thành nên
goal kết ở Cổng 1, vòng không làn V phải bật lại); (c) Gate 1.5 (T3) thêm bước
in. GUIDE mục `/goal`: «Khi nào» đổi từ «ngay sau khi duyệt Gate 1» thành ba
thời điểm + câu «làn V T2 không có cổng giữa nên lần đầu là đủ». Khuôn goal
KHÔNG đổi chữ (P85 giữ nguyên các vế đã ghim).

**D4 · Bất biến dừng gọi tên ca «tiến trình nền báo xong».** Thêm một vế vào
câu bất biến đầu SKILL: khi tiến trình nền (agent, Workflow) báo xong ở giữa
một đoạn máy → đi tiếp trong cùng lượt; «báo cáo rồi ngừng nói» là một lần
dừng ngoài thiết kế, đếm vào ba dòng số. Đây là dặn-bằng-lời — khai thẳng là
lớp 1, và là lý do D1/D2 tồn tại (vật đỡ chỗ lời trượt).

## Ngoài phạm vi

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
