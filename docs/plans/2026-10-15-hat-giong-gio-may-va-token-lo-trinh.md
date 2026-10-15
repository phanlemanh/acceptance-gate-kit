# Hạt giống — lộ trình tính theo giờ máy và khối lượng token

Gốc: kit/_acceptance/ap-chinh-sach-lo-trinh/ — ý định bổ sung chủ kho nói ở phiên điều phối MacBook Pro 15/10, chuyển cho
phiên RM2 sau khi Cổng Đáng của RM2 đã ký. RM2 không gộp nó: đổi ý định trong vòng là một Cổng Đáng mới, và bốn phần dưới
đẩy RM2 từ 11 lên ≥ 17 tiêu chí (trần 12). Thẻ Cổng Phạm vi của RM2 nêu chỗ này kèm lối đảo.

## Lời chủ kho (qua phiên điều phối, 15/10)

- «Tôi muốn áp luật cho road-map là tính theo giờ máy».
- Ước cả khối lượng token cho mỗi hàng / mốc, cạnh giờ máy, để người dùng kit hình dung được.

## Cách hiểu của máy — chủ kho xác nhận ở Cổng Đáng của vòng riêng

1. **Giờ máy mỗi hàng.** Mỗi hàng lộ trình mang ước «giờ máy». Máy sinh ước từ số đo lịch sử: hạng × số tiêu chí; nguồn là
   dấu thời gian trong sổ quyết định, sổ chạy và báo cáo chi phí S4. Người sửa được ước. Không ước theo ngày người.
2. **Ngày mốc là đầu RA.** Ngày mốc = tổng giờ máy của các hàng ÷ sức máy. Sức máy tính theo khoá máy (một việc nặng mỗi lúc)
   cộng độ trễ cổng người đã đo. Mốc gõ tay mà tổng giờ máy vượt sức trước ngày đó → cờ vàng «mốc quá tải». Không chặn.
3. **Hiệu chuẩn.** Đóng vòng thì ghi giờ máy thật đã tiêu, so với ước, để hiệu chuẩn lần ước kế. Tái dùng dòng 5 của luật
   (c) (phút máy/lượt chấm), không dựng thước mới.
4. **Token: đo trước, ước sau.**
   (a) Đóng vòng thì ghi token thật của vòng = S4 (đã có trong báo cáo chi phí) + phiên thợ (cộng từ transcript; hôm nay kit
   chưa đo phần này — dòng 4 của luật (c) ghi «phiên chính đếm tay»).
   (b) Chỉ ước token cho hàng mới khi đã có ≥ 5 vòng đo thật.
   (c) Đơn vị hiện cho người là «% hạn mức tuần» kèm token ra, không phải token thô: cache_read lớn gấp ~100 lần token ra mà rẻ.

5. **Bắt đầu và hoàn tất dự kiến của mốc** (bổ sung của chủ kho 15/10, chuyển qua phiên điều phối):
   - «bắt đầu dự kiến»: máy tính từ `dung_tren`, hàng chờ của khoá máy, lô, và việc máy khác đang chặn;
   - «hoàn tất dự kiến» = bắt đầu + Σ giờ máy + giờ chờ đã đo;
   - cả hai tách khỏi «mục tiêu» (ngày chủ kho đặt, tuỳ chọn); dự kiến trễ mục tiêu thì máy nói ra;
   - khép vòng thì ghi giờ bắt đầu, giờ máy và giờ chờ thật.

## Số làm nền (điều phối đo 15/10)

- TH1 ở crm: từ mở tới ký ≈ 4 giờ; sau khi ký ≈ 20 giờ vẫn chưa lên production, và trong quãng ấy máy chỉ làm ≈ 2 giờ.

- 9 vòng kit cỡ 10–12 tiêu chí: S4 chạy 2–3 lượt, 65–228 phút; từ mở tới ký 3–10 giờ khi không bị chặn; gộp kit 1–1,5 giờ.
- 5 vòng kit, chỉ phần S4: token ra 71k–219k; cache_read 11–30 triệu; 5.000–8.400 giây tác tử mỗi vòng.
- Ước phần còn lại của gói road-map: khoảng 26–33 giờ máy (RM2 8–10 · RM4 5–6 · RM5 6–7 · RM3 6–8 cộng phần M5 · cắt bản
  1,5–2).

## Ràng buộc khi mở

- Thêm khoá vào khuôn lộ trình là đổi schema, nên phải có đường đọc-cũ: hàng không có khoá thì máy tự ước và hiện cờ vàng.
  Đây là CỘNG — chủ kho duyệt đích danh ở Cổng Phạm vi của vòng đó.
- Cỡ vòng: bốn phần trên có thể vượt 12 tiêu chí. Chỗ cắt tự nhiên: phần 3 và phần 4 (b)–(c) sang vòng sau, vì chúng cần
  ≥ 5 vòng đo thật trước khi ước được.
- Điểm nối với RM2: tự áp chỉ đọc ngày mốc, không quan tâm ngày ấy gõ tay hay máy tính ra. Ngày mốc thành đầu ra không đổi
  hợp đồng RM2.
