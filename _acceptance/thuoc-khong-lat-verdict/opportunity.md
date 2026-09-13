---
schema_version: 1
slug: thuoc-khong-lat-verdict
feature: Phát hiện rà soát KHÔNG lật verdict — verdict chỉ đỏ khi phép đo hoặc lệnh suite đỏ; phát hiện lên thẻ kèm bán kính, người quyết
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

Vòng `cong-nguoi-doc-du-nguon` chạy **8 lượt chấm** và gọi người **9 lần**, so trần
thiết kế là 3 lượt và 4 lần. Giá trị đo được ĐỨNG YÊN từ lượt 5: 139 hồ sơ, 1 110
tiêu chí, 29 mục Coverage. Ba lượt cuối không đưa thêm một tiêu chí nào tới kho
tiêu thụ.

Ba dòng số của vòng, đối chiếu luật chiều rộng:

| Thước | Trần | Vòng này |
|---|---:|---:|
| Lượt gọi người | 4 (T3) | 9 |
| Lượt chấm | 3 | 8 |
| Lượt bị hạ tầng đốt | 0 | 2 |

**Người trả giá là owner**, ở số lần phải gõ; và **chín kho tiêu thụ**, ở việc bản
phát hành 2.12.0 bị giữ lại sau mỗi lượt.

## Gốc rễ — đo được, không suy diễn

Ở lượt 6, 7, 8 **mọi phép đo và lệnh suite đều xanh**. Verdict vẫn đỏ:

- **Lượt 6 → PASS**, nhưng rà soát trả 7 phát hiện nên chủ vòng vá tiếp.
- **Lượt 7 → REJECT** vì `triageHighInContract` — một phát hiện của TÁC TỬ, không
  phải một phép đo của hợp đồng (`acceptance-verify.js:1042`).
- **Lượt 8 → REJECT** vì MỘT lệnh suite đỏ **do hạ tầng**: đầu ra tác tử khớp khuôn
  `permissions-allow-deny` nên bị trung hoà. Cùng chuỗi lệnh chạy tại chỗ hai lần:
  exit 0 cả hai.

Bán kính của MỌI phát hiện từ lượt 6 đến 8, chủ vòng đo tay trên 1 243 hợp đồng
thật của 22 kho: **0**, trừ hai bộ đọc đã có ô riêng (2 và 9 hồ sơ).

Bốn chỗ rò, mỗi chỗ trace về một nguyên tố:

1. **Verdict bị quyết bởi ý kiến tác tử** (nguyên tố 1). Owner chốt «tốt» ở Cổng
   Phạm vi; `:1042` cho phép máy định nghĩa lại sau khi làm xong.
2. **Phát hiện không mang bán kính** (nguyên tố 3). Tác tử ghi «high», kit chặn;
   chủ vòng phải tự đo mới biết là 0. Lỗi hình dạng bán kính 0 ở lớp trình bày
   không phải đánh-đổi, cũng không phải khó-đảo.
3. **Ống kính đo-thước chạy MỌI lượt** (luật chiều rộng (a)). Phần lớn phát hiện
   lượt 6–8 là «hình dạng 3/4/5» về chính các ca kiểm — đúng thứ luật cấm.
4. **Không có lối ra không tốn lượt.** DỪNG-VÁ nổ hai lần; cả ba lối nó đưa đều
   cần thêm một lượt chấm. Owner không có nút «tôi chấp nhận, ship» — đúng định
   nghĩa trạm thu phí.

Và **hạ tầng tự sinh tín hiệu đỏ** hai lần trong cùng vòng: lượt 5 đọc
`MODULE_NOT_FOUND` thành «đỏ có phân biệt»; lượt 8 đọc trung-hoà-đầu-ra thành
«suite hỏng».

## Ngả sửa (chưa quyết) — toàn TRỪ

1. **Gỡ `:1042`.** Verdict đỏ chỉ khi `blocked` hoặc có phép đo / lệnh suite đỏ.
   Phát hiện rà soát vẫn vào báo cáo và lên thẻ, không lật verdict. Người quyết.
2. **Phát hiện muốn tới bàn người phải mang bán kính đo được.** Bán kính 0 vào ô,
   không vào cổng. Đây là luật «phân loại theo nguồn căn cứ trước khi mời» đã có,
   áp cho phát hiện thay vì cho mục hợp đồng.
3. **Ống kính đo-thước chỉ chạy lượt ĐẦU của một hồ sơ.** Từ lượt hai, lưới thường
   trực là trần — đúng luật chiều rộng (a) đang ghi.
4. **DỪNG-VÁ phải có một lối ra không tốn lượt:** chuyển mục trong hợp đồng thành
   giới hạn bằng một chạm, máy tính lại verdict từ nhật ký sẵn có.
5. **Lệnh đỏ trong tác tử mà xanh khi chạy lại tại chỗ → ghi là hạ tầng**, loại
   khỏi verdict, đếm vào dòng «hạ tầng đốt lượt» của mốc phát hành. Bản mẫu đã
   chạy thật: `_acceptance/cong-nguoi-doc-du-nguon/phan-lop-ha-tang.cjs`, có đối
   chứng dương (lệnh đỏ tất định → `vat`) và giới hạn đã đo (lệnh chập chờn 50/50
   bị gọi nhầm ≈1/4 ở `--lan 2`, nên phân lớp `ha-tang` đòi thêm một dấu hiệu độc
   lập từ nhật ký workflow).
6. **Trần ba lượt có răng:** sau lượt ba, lối ra chỉ còn ký-với-giới-hạn hoặc cắt.

## Nhịp đề xuất

Ngả 1, 3, 5 là phép TRỪ nhỏ, có răng đo được ngay → gộp vào **mốc phát hành 2.12.0**.
Ngả 2, 4, 6 cần thiết kế (khuôn bán kính, lối một-chạm, răng của trần) → vòng riêng
SAU 2.12.0, đúng luật «meta-work đóng băng, mở sau mốc phát hành gần nhất».

Phép đo hai chiều bắt buộc cho ngả 1: một hồ sơ mẫu có phép đo ĐỎ → verdict REJECT
như cũ; một hồ sơ mẫu mọi phép đo XANH kèm một phát hiện `high` trong hợp đồng →
verdict KHÔNG đỏ, và phát hiện ấy vẫn hiện đủ trên thẻ.
