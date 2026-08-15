# Hạt giống — hỏi-theo-mặt-phẳng: câu hỏi là thứ người BẤM ĐƯỢC, không phải một khuôn chữ

*Trạng thái: **HẠT GIỐNG, chờ Cổng 0**. Xếp SAU đợt 2 của bản neo 12/08 —
đợt 2 giảm SỐ câu hỏi (veto-có-dấu-vết), hạt giống này giảm GIÁ của mỗi câu
còn lại; làm ngược là đánh bóng những câu hỏi sắp biến mất. Sinh 14/08 từ
nhận xét của owner: khối 👉 đang là một form chữ trong khi harness có cơ chế
hỏi-bấm-được (một chạm thay vì một lượt gõ).*

## Ý định

Khối 👉 VIỆC CỦA ANH giữ vai **hợp đồng nội dung** (ba vế
làm-gì / ở-đâu / trả-lời-dạng-gì); còn **bề mặt trình câu hỏi thì tra bảng
theo mặt phẳng**, đúng khuôn hồ sơ `hinh-theo-mat-phang` đã ký cho hình:

| Mặt phẳng đang trình | Hỏi bằng | Ghi chú |
|---|---|---|
| Phiên tương tác có cơ chế hỏi-bấm-được | câu hỏi bấm-được của harness | ngả khuyến nghị đứng đầu kèm căn cứ |
| Thẻ cổng (HTML) | khối 👉 trên thẻ như hiện nay | thẻ là chỗ đọc-và-quyết, câu trả lời đi qua lệnh cổng/một-lượt-gõ |
| Terminal thuần / CI / phiên không tương tác | khối 👉 dạng chữ | chốt cuối, luôn chạy |

Ngữ pháp câu gộp (`GATE-ONESHOT-GRAMMAR`) KHÔNG đổi — nó là đường trả lời
cho mặt phẳng chữ và cho người thích gõ; bề mặt bấm chỉ là một cách *nhập*
cùng một câu trả lời.

## Bậc thang khi-nào-hỏi (chuẩn hoá — gom các luật đang rải)

Phép thử gốc: *chốt này là LƯỚI hay CÂU HỎI?* — có lưới (CI, đảo rẻ) thì
không hỏi.

| Nấc | Điều kiện | Máy làm | Bề mặt |
|---|---|---|---|
| 0 — không hỏi | máy chắc + đảo rẻ + có lưới | làm, báo 1 dòng, cửa veto | tin chỉ-báo (không khối — đã ship 1c) |
| 1 — xác nhận một chạm | máy suy được, cần minh bạch (danh tính, cách hiểu trội) | hiển thị lại + căn cứ; khẳng định/im lặng = gật | bấm-được, ngả «đúng như trên» đầu |
| 2 — quyết định đóng | đánh-đổi thật / khó-đảo / phán-xét | liệt ngả thật + khuyến nghị kèm căn cứ | **bấm-được — chỗ hợp nhất** |
| 3 — chỉ người biết | không ứng viên (tên khi cạn, đề bài, lý do trả) | hỏi mở — đường cùng, đúng một câu | chat tự do; có danh sách thì liệt ra |

## Năm ranh giới an toàn (điều kiện để nút-bấm KHÔNG phạm luật không-điền-sẵn)

Nút bấm là một câu trả lời viết sẵn — nó chỉ hợp luật (gốc ADR 0002 + lớp
lỗi mồi-dán-đồng-ý) khi giữ đủ:

1. **Một lần hỏi = MỘT quyết định** (luật quá-tải 12/08: khuôn nhiều chỗ
   trống vẫn là nhiều quyết định).
2. **Cấm ngả GỘP** — không bao giờ có nút «phê hết + ký»; «Ký» đứng một mình
   thì bấm được (cái bấm là phát ngôn của người).
3. **≥2 lối ra sống** — nguyên tố 3; chỉ một ngả hợp lý = trạm thu phí →
   quay về nấc 0.
4. **Khuyến nghị đứng đầu kèm căn cứ ngắn** — máy gánh suy nghĩ, không giấu
   chính kiến, không hỏi mở khi có ngả trội.
5. **Ô tự do luôn mở + ghi NGUYÊN VĂN** lựa chọn/lời gõ vào sổ quyết định —
   dấu vết ngang bằng đường gõ; trả lời ngoài ngả → nhận nguyên văn, mơ hồ
   thì nêu cách hiểu trội kèm căn cứ (nấc 1), không nuốt lặng lẽ.

Ca khớp đẹp: bước «gạch một lượt» của quét độ phủ = một câu hỏi chọn-nhiều.
Nhiều mục treo tại Cổng Bằng chứng = một lần ngồi, mỗi mục một câu riêng
trong cùng lượt hỏi — không trộn thành một câu.

## Đo bằng gì

Lời hứa là HÀNH VI (agent chọn bề mặt + giữ 5 ranh giới) → bộ đo chính là
**hội đồng phiên sạch theo giao thức 1c** (agent hành động không tool, nạp
thẳng, đáp án viết trước ở thư mục riêng, điều kiện trượt viết theo HÀNH VI
không theo vị trí — bài học hạt giống T1). Lớp máy chỉ nhận vai mực-đã-in
(bảng tra + ranh giới có mặt trong bản luật, bản chép khớp manifest).

## Việc của owner tại Cổng 0

Gật/cắt: (a) bảng tra bề mặt; (b) năm ranh giới; (c) thứ tự SAU đợt 2.
Trong lúc chờ, hành xử phiên (dùng bề mặt bấm-được cho nấc 1–2) là việc
từng phiên tự áp được — không cần sửa kit, không cần cổng.
