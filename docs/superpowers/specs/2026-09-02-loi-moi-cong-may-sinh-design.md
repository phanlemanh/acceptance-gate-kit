# Design — loi-moi-cong-may-sinh (T3)

> Vòng meta duy nhất cửa sổ 2.6→2.7 (owner «gọi tên» 01/09). Nguồn: ô
> `_acceptance/loi-moi-cong-may-sinh/opportunity.md` (decided/build) · luật
> lời-mời + luật (c) trong CLAUDE.md · findings 01/09 (audit · điều-chỉ-người-biết
> · rà-soát-hệ-thống N3/N4) · hình tham chiếu `docs/plans/assets/v27-03`.

## Bài toán một câu

Lời mời cổng đang là văn máy soạn tự do nên né hết ba cơ chế chống-nghi-thức đã
ship; chuyển nó thành **vật máy sinh trên thẻ**, và thẻ chỉ được hỏi người
điều-chỉ-người-biết.

## Bảy quyết định thiết kế

**D1 · Câu gộp máy-sinh (`one_shot`).** `gate-card.js` tính MỘT chuỗi lệnh
hoàn chỉnh cho từng cổng và in trong khối «VIỆC CỦA ANH» + xuất qua
`--extract` (khoá `one_shot`):
- Cổng 1: `/acceptance-gate:approve <slug> duyệt` (hoặc `sửa: ___` khi thẻ có
  cờ chặn).
- Cổng 2: `/acceptance-gate:signoff <slug> Ngoài-1: <đề-xuất-máy>; …;
  cắt/hoãn: đồng ý cắt; Treo: phê hết; ký hay trả: ___`.
Luật điền: mọi ô CÓ khuyến nghị máy → điền sẵn nguyên văn; ô loại-5 không có
khuyến nghị và CHỮ QUYẾT → để `___`. Tên lệnh lấy từ hằng một-nguồn (marker
`ONE-SHOT-CMD`), KHÔNG gõ literal ở chỗ render — lớp «lệnh in ra phải bấm
được» được máy giữ thay vì trí nhớ.

**D2 · Phân loại mục thẻ theo nguồn căn cứ** (bảng ánh xạ đóng, đặt cạnh marker
trong gate-card.js — một nguồn):
| Mục hiện tại | Loại | Render mới |
|---|---|---|
| gap-probe + review + chiều đỏ | 3 | khối «PHÁN QUYẾT ĐỐI KHÁNG»: verdict · p0/p1/p2 · disposition đếm · dòng «chiều đỏ đã chạy» |
| «Xác nhận cắt/hoãn» (scope đã duyệt Cổng 1) | 1 | dòng báo + điền sẵn `cắt/hoãn: đồng ý cắt` trong one_shot; đổi ý = người sửa ô đó |
| Treo (provisional descope/approach/fix có sổ + đường đảo) | 1 | nhóm gọn thành dòng báo đếm + điền sẵn `Treo: phê hết`; RIÊNG mục nào contract/ledger đánh dấu khó-đảo → tách thành ô loại-5 |
| Ngoài-N (ba lối sống, nhận nợ hay mở việc) | 5 | giữ ô hỏi, đề xuất máy điền sẵn trong one_shot |
| judgment / UNCERTAIN eval | 5 | giữ nguyên (đã đúng) |
| **Mục KHÔNG khớp hàng nào** (không gian mục là MỞ: cờ mới, khối mới, schema đời sau) | **5 — hàng MẶC ĐỊNH** | Ô HỎI — đoán về phía rơi-về-người; nuốt-quyết-định là chiều cấm (gap-probe P1, lớp blacklist-trên-không-gian-mở) |
Phép thử in ngay trên thẻ cho mục loại-5: «anh biết điều gì máy không có?».

**D3 · Luật rơi bậc (N4).** ĐẢO CHIỀU MẶC ĐỊNH (gap-probe P1): mọi trạng thái
NGOÀI {file parse được ∧ verdict thuộc tập đã khai} ⇒ rơi bậc — gồm verdict
`probe-failed`, file vắng khi `required`, VÀ file có mặt nhưng không đọc được
(frontmatter vỡ, verdict token lạ — trạng thái có thật trong xưởng, claim-scan
01/09 skip hàng loạt). Khi rơi bậc ⇒ khối PHÁN QUYẾT ĐỐI KHÁNG thay bằng khối cảnh báo «đối
kháng không chạy được — phần vượt-nhận-thức RƠI VỀ ANH», các mục loại-3 render
như loại-5, và `one_shot` KHÔNG điền sẵn (người phải đọc vật). Chữ ký không
được nói «đối kháng đã hội tụ» khi nó chưa chạy.

**D4 · OOC hết fail-quiet.** `lib/out-of-contract.js` thêm `suspect_empty:
true` khi mục «Ngoài hợp đồng» có ≥N ký tự nội dung (sau khi bỏ câu mở đầu
chuẩn) mà parse ra 0 finding; thẻ render cờ vàng gọi tên file + khuôn
OOC-ITEM-TEMPLATE. Vết thật: vòng 2.6.0 khối rơi khỏi thẻ ngay trước lúc ký.

**D5 · Token đề xuất lạ.** `proposal` ngoài {new-contract, known-limits,
wont-fix} → giữ nguyên chuỗi thô, thẻ in cờ vàng «đề xuất không đọc được:
'<raw>' — dùng: known-limits · new-contract · wont-fix» thay vì câu sai «máy
chưa đề xuất hướng nào».

**D6 · Cột SẼ/KHÔNG hết dò chữ 'không' giữa câu.** Thay `NEG_RE.test(thenOf)`
(substring) bằng phép dò ĐẦU vế Then: chỉ xếp «sẽ KHÔNG làm» khi Then mở đầu
bằng từ chối/chặn (`^\s*(KHÔNG\b|không\b|chặn\b|từ chối|refuse|reject)` —
`không\b` chữ thường đầu vế TÍNH là từ chối, kể cả không kèm «được»; gap-probe
P2);
fixture đo là CHÍNH contract của release-2-5-0/2-6-0 (round-trip từ hồ sơ
thật, nơi AC-1/AC-2/AC-6 từng bị xếp nhầm).

**D7 · Nới echo danh tính.** Sửa TẠI NGUỒN
`skills/acceptance/references/human-facing-language.md` (khối
GATE-ONESHOT-GRAMMAR): `git config user.name` và `signoff.approvers` khớp
tuyệt đối một-ứng-viên → ghi thẳng + HIỂN THỊ LẠI sau khi ghi, bỏ lượt chờ
Enter; mọi ca khác giữ echo-trước. Hai thân lệnh approve/signoff chép nguyên
văn theo nếp một-nguồn sẵn có (răng đồng bộ hiện hành canh).

## Ngoài phạm vi

- KHÔNG đổi hook, pre-merge, recheck (t3_paths chỉ chạm `lib/out-of-contract.js`).
- KHÔNG dựng bộ phân loại NLP — ánh xạ loại theo NGUỒN DỮ LIỆU cấu trúc (bảng
  đóng D2), không đoán ngữ nghĩa.
- KHÔNG lấy lại làn thẻ Cổng Đáng (vẫn ở ô, cây ghim 528caaa8).
- KHÔNG đổi ngữ nghĩa chữ ký trong hook (ADR 0002 nguyên vẹn).

## Thước

Mọi hành vi mới có ca trong lưới thường trực `tests/scripts` (fixture code-sinh
+ round-trip từ marker; chiều đỏ mỗi ca gọi đúng thứ nó canh); D7 canh bằng
răng đồng bộ nguồn-bản-chép hiện có. Số nghiệm thu cuối (≤3 lượt · 0 ngoài
thiết kế · 1 chạm/lượt) đo ở vòng ĐẦU TIÊN chạy dưới thẻ mới — khai trong ô,
đọc ở ba-dòng-số mốc kế.
