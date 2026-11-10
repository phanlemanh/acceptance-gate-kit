# Thể hiện lỗi trong hợp đồng trên thẻ và trang bằng chứng

Ngày: 2026-11-10 · Hạng: T2 · Hồ sơ: `_acceptance/the-hien-loi-trong-hop-dong/`

## Vấn đề

Lượt chấm chỉ tự trả lại khi có lỗi trong hợp đồng mức nặng. Lỗi mức vừa để phán quyết là PASS, và nằm ở mục
«Trong hợp đồng» của bản rà soát, nơi thẻ Cổng Bằng chứng và trang bằng chứng không đọc. Kết quả: thẻ nói «máy đã xong,
ký nhanh» trong khi người ký không thấy lỗi.

Ca thật: lượt chấm 2 của `do-tuong-phan-lab-oklab`, lỗi chạm tiêu chí AC-10. Lỗ đã được ghi ở
`docs/plans/2026-10-20-hat-giong-the-pass-giau-muc-trong-hop-dong.md`, và ghi lại ở sổ của `kiem-ban-cai-loi-sua-chay-duoc`.

## Vì sao lần trước khối này bị rút, và lần này khác gì

Ngày 13/09, Cổng Bằng chứng của `cong-nguoi-doc-du-nguon` đã rút một khối cùng tên. Lý do trong sổ: đo trên hồ sơ thật thì
94% số hàng sẽ chỉ là chỗ giữ, vì bên viết cố ý để trống câu cho người đọc ở loại mục này; và sổ ghi rõ ô mở phải vá bên
viết, không phải vá thẻ.

Vòng này vá cả bên viết: bước phân loại nay buộc viết câu tiếng sản phẩm cho lỗi trong hợp đồng. Hồ sơ chấm trước bản vá
không có câu đó, nên thẻ in lời tiêu chí đã được duyệt kèm ghi chú «chưa có mô tả cho người đọc». Không có hàng nào là
chỗ giữ rỗng, và tiêu đề kỹ thuật không bao giờ lấp vào.

## Thiết kế

1. **Một bộ đọc dùng chung** cho thẻ và trang. Nó đọc mục «Trong hợp đồng», trả về danh sách lỗi và cờ «có chữ mà không
   đọc ra được».
2. **Thẻ:** có lỗi thì nhãn đầu thẻ đổi thành «còn N lỗi trong hợp đồng — cần bạn quyết», không còn lời mời ký nhanh; khối
   riêng liệt kê từng lỗi. Ô «ký hay trả» vẫn trống, thẻ chỉ nói ký nghĩa là gì.
3. **Trang bằng chứng:** cùng khối, đặt ngoài mọi mục gập; văn kỹ thuật chỉ nằm trong phần gập của khối.
4. **Bên viết:** phân loại phải viết câu cho người đọc; khuôn mục của tác tử tổng hợp đi qua đúng bộ đọc.
5. **Không đổi luật phán quyết:** lỗi mức vừa vẫn PASS, người ký quyết. Đây là câu hỏi cho chủ kho trên thẻ.

## Thứ tự làm khác thường

Mã đã được viết và commit (`24934fa7`) trước khi hồ sơ này mở, vì việc bắt đầu như một bản vá. Cổng Phạm vi vì thế duyệt
phạm vi của một bản đã có. Duyệt rồi thì lượt chấm chạy độc lập như mọi vòng; bản vá chưa đi vào nhánh chính.

## Không làm trong vòng này

Đường máy tự đi tiếp (làn V) cũng cần xét lỗi trong hợp đồng, nhưng đó là việc hạng T3, nằm ở nhánh riêng
`fix/lan-v-loi-trong-hop-dong`. Cho tới khi nhánh đó gộp, hồ sơ T2 còn lỗi vẫn có thể đi tiếp không chữ ký và không có thẻ; vì vậy đây là câu hỏi cho chủ kho trên thẻ.

## Đo thêm sau khi duyệt

Phản biện trước cổng chỉ ra phép đo hiện có còn hở, nên `evals.yaml` đã khai thêm: kiểm cấu trúc trang, kiểm bằng mắt, đường đi trọn của câu tiếng sản phẩm, đối chiếu danh sách cờ với mã trước bản vá, và quét hồ sơ thật. Các ca mới TL-11 đến TL-15 được viết ở bước làm sau khi duyệt, nên lúc này các phép đo đó còn đỏ.
