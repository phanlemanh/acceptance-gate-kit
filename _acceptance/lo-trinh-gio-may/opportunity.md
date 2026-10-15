---
schema_version: 1
slug: lo-trinh-gio-may
feature: Người nhìn lộ trình thấy mỗi hàng và mỗi mốc ước bằng giờ máy và phần trăm hạn mức tuần; ngày mốc do máy tính từ tổng giờ máy, mốc quá tải có cờ vàng, và mỗi vòng khép ghi giờ máy cùng token thật để ước lần sau sát hơn
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-15T07:38:15Z   # chủ kho gõ «đáng: build · ngưỡng: nhận» ở Cổng Đáng 15/10 — xác nhận luôn ngoại lệ luật (b)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM6
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM6 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — 19/10/2026 (chủ kho gọi tên cả gói 15/10, RM6 nằm trong gói).

Gốc: kit/_acceptance/ap-chinh-sach-lo-trinh/ — chủ kho 15/10, nói ở phiên điều phối MacBook Pro và chuyển cho phiên RM2:
«người dùng kit nhìn roadmap là vòng làm của MÁY, không phải của người»; ước cả khối lượng token để dễ hình dung.
RM2 không gộp ý này (đổi ý định giữa vòng là một Cổng Đáng mới) và gửi nó sang hạt giống
`docs/plans/2026-10-15-hat-giong-gio-may-va-token-lo-trinh.md`. Hạt giống và hồ sơ gốc hiện nằm trên nhánh RM2; khi RM2
gộp thì chúng có trên `main`.

**Ai đau:** chủ kho, và mọi kho tiêu thụ có lộ trình (crm có ba tệp lộ trình). Hôm nay ngày mốc do người hoặc máy gõ
tay theo nhịp ngày-người. Nó không nói được bao giờ việc xong, cũng không nói được tốn bao nhiêu. Ngày 14/10 hết hạn mức
tuần, phải đổi tài khoản giữa ngày.

**Ý định (chủ kho 15/10, luật ước đã phổ biến ba máy):**
- Mỗi hàng ước bằng giờ máy, không theo ngày người.
- Ngày mốc là đầu RA máy tính: bắt đầu dự kiến, cộng giờ máy, cộng giờ chờ đã đo, ra ngày hoàn tất dự kiến. Ngày chủ
  kho gõ chỉ là «mục tiêu»; dự kiến trễ mục tiêu thì cờ vàng «mốc quá tải», không chặn.
- Token đo trước, ước sau: mỗi vòng khép ghi số thật (phần chấm và phiên thợ). Chỉ ước cho hàng mới khi đã có ≥ 5 vòng
  đo. Hiện cho người bằng «% hạn mức tuần», không bằng token thô.
- Không thêm cổng, không thêm lượt gọi người.

**Số đo trước — thước «trước» của Cổng Giá trị** (máy đo 15/10 từ lịch sử git của `docs/plans/lo-trinh-kit.json` và
tag phát hành):
- Năm mốc phát hành đã khép mà có ngày gõ trước (2.25 → 2.29) đều lệch ngày phát hành thật **3–14 ngày**, trung vị
  **9 ngày**. Chi tiết: 2.25 gõ 15/10, ra 09/10 · 2.26 gõ 18/10, ra 09/10 · 2.27 gõ 23/10, ra 12/10 · 2.28 gõ 27/10,
  ra 13/10 · 2.29 gõ 16/10, ra 13/10. Cả năm lần, ngày gõ bị ghi đè bằng ngày thật đúng hôm phát hành, nên trang lộ
  trình không bao giờ cho thấy độ lệch.
- Kit có 110 hồ sơ mang báo cáo chi phí phần chấm. **0 hồ sơ** ghi giờ máy hay token của phiên thợ — dòng 4 của luật
  (c) vẫn «phiên chính đếm tay».
- Số đo được thì máy đã có: mỗi worktree một thư mục bản ghi phiên (106 thư mục trên máy này). Ví dụ vòng RM2: phiên
  thợ chạy 7 giờ đồng hồ, 0,40 triệu token ra, 172 triệu token đọc bộ đệm. Hạn mức tuần đọc được bằng phần trăm (sáng
  15/10: 23 %).

**Luật chiều rộng (b):** đây là vòng meta thứ tư trong cửa sổ sau 2.30 (MC1, RM1, RM2, RM6). Nó nằm trong gói «road-map
hoàn tất theo B′» mà chủ kho gọi tên 15/10. Chữ ký ở cổng này xác nhận ngoại lệ, như RM2. Hồ sơ mốc kế sẽ đếm.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Giờ máy của một vòng đo được từ bản ghi phiên: tổng các khoảng hoạt động, tách khỏi giờ chờ | Ngày tính ra không sát hơn ngày gõ tay | Đo vòng RM2 từ bản ghi: 7 giờ đồng hồ, tách được khoảng chờ cổng | Đã thử một vòng — đọc được |
| 2 | Bản ghi phiên tìm được theo hồ sơ (một worktree, một vòng) | Không gom được token phiên thợ | Đếm thư mục worktree có bản ghi tạo `contract.md` của đúng một hồ sơ | Chưa thử |
| 3 | Quy đổi token ra % hạn mức tuần đủ ổn định để ước | % hiện ra là số trang trí | Hai lần đọc hạn mức tuần cách nhau một ngày, so với token máy đếm | Chưa thử |
| 4 | Lịch sử đủ ≥ 5 vòng đo ngay khi gộp (đo bù từ bản ghi cũ) | Cột token chỉ có «chưa ước» tới khi đủ năm vòng mới | Đo bù năm vòng kit gần nhất | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: ở mốc phát hành đầu tiên BẮT ĐẦU sau khi RM6 lên `main`, ngày hoàn tất máy dự
  báo lúc mốc bắt đầu (đóng băng trong sổ dự báo, không phải ngày tính lại hôm khép) lệch ngày khép thật bao nhiêu, và
  mỗi vòng khép trong mốc ấy có giờ máy + token thật cạnh số ước không?
- Kết quả nào là SỐNG: lệch ≤ 1 ngày (nền: trung vị 9 ngày, tốt nhất 3 ngày), và 100 % vòng khép trong
  mốc có giờ máy + token thật cạnh số ước.
- Kết quả nào là CHẾT: lệch ≥ 3 ngày (không tốt hơn mốc gõ tay tốt nhất), hoặc có vòng khép thiếu số đo.
- Ở giữa (ITERATE): lệch 2 ngày — đọc sổ dự báo xem lệch ở giờ máy hay ở giờ chờ.
- Timebox: 2026-11-05 (mốc «Tinh chỉnh sau hai đợt thử»). Tới hạn mà chưa mốc nào bắt đầu sau khi RM6 gộp →
  «chưa đọc được ở đây», không phải CHẾT.

## Kết quả prototype

Không dựng prototype — việc nội bộ của bộ công cụ; đo tại mốc thật sau khi gộp.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Luật ước giờ máy (T2 4–7h · T3 7–10h · gộp +1–1,5h · cắt bản 1,5–2h) | lời chủ kho 15/10, đã phổ biến ba máy (kit #308, crm #375) | triết-lý/logic | có | |
| Hạt giống bốn + một phần | `docs/plans/2026-10-15-hat-giong-gio-may-va-token-lo-trinh.md` (nhánh RM2) | triết-lý/logic | có | |

## Cổng 0

- **decision = build** Căn cứ: lời chủ kho 15/10 + gói B′ đã gọi tên; số trước cho thấy mốc gõ tay lệch trung vị 9 ngày.
- **disposition = —** Căn cứ: không prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** nhận nguyên ngưỡng máy đề xuất (lệch ≤ 1 ngày SỐNG · ≥ 3 ngày CHẾT · hạn đọc 05/11).

## Thước đo thành công → ứng viên criterion

- Sổ dự báo đóng băng ngày hoàn tất dự kiến lúc mốc bắt đầu → AC sổ dự báo + lệnh đọc độ lệch.
- Mỗi vòng khép có một dòng đo thật (giờ máy · giờ chờ · token phần chấm · token phiên thợ) cạnh số ước → AC đo vòng khép.

## Out of scope từ khám phá

- Ước token theo từng tiêu chí, hay theo từng model — chỉ ước theo hạng hàng.
- Xếp lịch song song nhiều phiên trên một máy — giả định mỗi máy một làn tuần tự (khoá máy giữ một việc nặng mỗi lúc).
- Đo giờ máy ở máy khác máy đang chạy lệnh — bản ghi phiên chỉ có ở máy đã chạy vòng.
