# Thiết kế — lời mời cổng không qua nút (KY1 · `moi-cong-khong-qua-nut`)

Ngày 19/10/2026 · hạng T2 · ô cơ hội `_acceptance/moi-cong-khong-qua-nut/opportunity.md` (chủ kho: «Sửa kit: giao MacBook
Pro làm ngay»).

## Vấn đề

Kit dạy phiên NỘI DUNG lời mời cổng (điều khoản `GATE-INVITE-CLAUSE`: một câu hỏi đóng, một dòng lệnh điền sẵn khuyến
nghị, không viết sẵn chữ quyết) nhưng không nói lời mời đi qua MẶT nào. App desktop cho phiên một hộp «bước kế» có nút trả
lời; phiên thợ đặt dòng ký vào nút. App bỏ nút mở đầu «/» hay «!», nút chứa «@», cắt tin của nút ở 300 ký tự, và khi nút bị
bỏ là nút khuyến nghị thì bỏ cả câu hỏi — người không thấy lời mời. Nút còn mang «ký hay trả: ký», tức chữ quyết viết sẵn.

## Lựa chọn

1. **Một điều khoản mới, một nguồn, chép nguyên văn** — `GATE-END-TURN-CLAUSE` đặt ngay dưới `GATE-INVITE-CLAUSE` trong
   `skills/acceptance/references/human-facing-language.md`, kèm bảng chỗ chép `GATE-END-TURN-SITES` (đường dẫn + số bản
   phải có) theo đúng nếp của điều khoản mời cổng (ca P188). Điều khoản một dòng, nói ba việc: gửi trang thẻ bằng công cụ
   gửi tệp; dòng lệnh chép đúng như thẻ in vào một khối chữ `text`, ô thẻ để `___` thì giữ `___`; hộp «bước kế» ở lượt chờ
   người chỉ mang tóm tắt — không câu hỏi, không nút — kèm lý do (ba luật bỏ nút của app).
2. **Một khuôn kết lượt** — `GATE-END-TURN-TEMPLATE`, cùng tệp: tin cuối lượt mẫu (câu hỏi · khối `text` chứa dòng ký với
   `ký hay trả: ___` · dòng hộp «bước kế» dạng JSON chỉ có `recap`). Khuôn là thứ ca đo đọc được bằng máy; điều khoản là thứ
   phiên đọc.
3. **Chỗ chép**: mọi nơi đang chép `GATE-INVITE-CLAUSE` (acceptance SKILL ×2, thẻ quyết định ×1, feature-loop SKILL ×2)
   chép điều khoản mới NGAY SAU nó — nên mỗi lời mời đi kèm luật về mặt đi của nó. Gói `dieu-phoi` không đọc được tệp luật
   của gói acceptance-gate lúc chạy, nên chép nguyên văn vào: `scripts/mau/LUAT.md` (lời dặn thợ), `commands/mo-dot.md`,
   `commands/dong-dot.md` (trong khối `CHU-QUYET-CUA-NGUOI`), `commands/tiep-tuc.md` (bước báo việc chờ người).
4. **Cổng không chép thì trỏ tên**: Cổng Đáng (S0, `moi: true`) và Cổng 1.5 (S2) của feature-loop thêm «kết lượt theo
   điều khoản kết-lượt-cổng»; bước [5] «Đính» của khối hình nói gửi bằng công cụ gửi tệp.
5. **Ca đo** `tests/scripts/moi-cong-khong-qua-nut.test.mjs` (MQ-1…MQ-6), rút mọi thứ từ chính văn bản: khuôn, điều khoản,
   bảng chỗ chép, hằng tên lệnh ký của `scripts/gate-card.js` và ô quyết `ký hay trả: ___` mà thẻ in. Chiều đỏ là bản sao
   của văn bản thật bị tiêm (nhát tiêm khớp đúng một lần), thông điệp ghim.

## Không làm

- Răng máy (hook chặn lời gọi hộp «bước kế» có nút mang dòng lệnh) — là CỘNG, ngoài phạm vi chủ kho giao; khai giới hạn
  kèm ngưỡng ở hợp đồng.
- Thẻ Cổng Phạm vi điền sẵn «duyệt» trong dòng lệnh: quyết ở ADR 0022, điều khoản «chép đúng như thẻ in» giữ nguyên nó.
- Lỗi thẻ đếm eval mang sang thành đỏ (`gate-card.js`) — phiên điều phối ghi hạt giống riêng.
- Bảng khẩu lệnh trong khối `LUAT-TIN` (vòng GT2 đang sửa) — khối mới đứng ngoài khối ấy.

## Rủi ro

- Điều khoản dài làm lời dặn nặng thêm ở 9 chỗ: chấp nhận — một dòng, một nguồn, ca đo giữ khớp.
- Lời không ép được phiên: đúng, nên đường đo ở hợp đồng đếm trên bản ghi phiên thật và ngưỡng mở răng ghi ở Known limits.
