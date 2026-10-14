---
schema_version: 1
slug: ra-soat-lo-trinh
feature: Chủ kho mở thẻ khởi động và thấy ngay hàng nào của lộ trình cần rà soát — dời mốc, chờ điều kiện hay bác — kèm căn cứ máy đọc, mà máy không sửa tệp lộ trình và không thêm lượt gọi người
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Chủ kho mở thẻ khởi động và thấy ngay hàng nào của lộ trình cần rà soát — dời mốc, chờ điều kiện hay bác — kèm căn cứ máy đọc, mà máy không sửa tệp lộ trình và không thêm lượt gọi người

Vì sao: Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — lộ trình chỉ có cửa vào, không có cửa ra: OKR crm 125 hàng từng có, 1 hàng rời; 18–19/35 lần sửa lộ trình kit là xếp lại bằng tay. Hướng B′ chủ kho duyệt 14/10 (docs/findings/2026-10-14-kien-truc-roadmap-plugin.md)

Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — tệp `BAN-GIAO.md` viết tay lúc đổi tài khoản 14/10; số đo lộ trình crm ở
`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md` §2 và §8.

**Ai đau:** chủ kho. Lộ trình chỉ có cửa vào (cắt lượt, gom tín hiệu, sửa tay), không có cửa ra: không gì nhắc hàng
nào đã quá mốc, hàng nào đã bị xếp lại mà vẫn nằm trong kế hoạch. Mỗi lần xếp lại là một phiên máy sửa JSON bằng tay
theo phản xạ (kit: 18–19/35 lần sửa), và câu «hàng nào cần dời» quay về người.

**Ý định (chủ kho 14/10, duyệt B′):** vòng ngoài của lộ trình sống trong lõi; rà soát lên thẻ ở cổng đã có, không
thêm lượt gọi người; gói `road-map` mang tên đồng dáng các gói khác. Vòng này là lát «chỉ cờ».

**Số đo trước (14/10, bộ máy gốc + luật viết riêng, không chính sách):**
- crm `d0351bcd`: OKR 0 đề xuất · Kho tài liệu 0 · Việc và Dự án 3 (`DA6`, `DA7`, `DA8` tự khai «xếp lại»). Hàng «Kế
  tiếp» chưa có hồ sơ: OKR 16 · Kho tài liệu 2 · Việc và Dự án 5 — giá trị lớn ở crm đến khi kho khai trần/tuổi.
- kit: `A3`, `DP8` thuộc mốc phát hành đã qua ngày mà chưa giao.

**Ngoại lệ luật chiều rộng (b):** chủ kho gọi tên vòng 14/10 («mở và thực hiện cho plugin road-map luôn») khi vòng
meta MC1 của cửa sổ sau 2.30 còn mở — vòng meta thứ hai trong một cửa sổ; đếm vào hồ sơ mốc kế.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Ở lần mở thẻ đầu tiên sau mốc khép kế tiếp, mọi hàng của mốc đã khép mà chưa giao và chưa có hồ sơ đang mở đều hiện đề xuất kèm căn cứ trên thẻ — chủ kho không phải hỏi «hàng nào cần dời»» chưa?
- Kết quả nào là SỐNG: [đề xuất] Ở lần mở thẻ đầu tiên sau mốc khép kế tiếp, mọi hàng của mốc đã khép mà chưa giao và chưa có hồ sơ đang mở đều hiện đề xuất kèm căn cứ trên thẻ — chủ kho không phải hỏi «hàng nào cần dời»
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Ở lần mở thẻ đầu tiên sau mốc khép kế tiếp, mọi hàng của mốc đã khép mà chưa giao và chưa có hồ sơ đang mở đều hiện đề xuất kèm căn cứ trên thẻ — chủ kho không phải hỏi «hàng nào cần dời»» khi hết timebox
- Timebox: [đề xuất] 2026-11-05 (mốc Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo)
