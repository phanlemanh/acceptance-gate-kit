# Hạt giống — thẻ Cổng Bằng chứng liệt các thước đã ký mà hàng này sắp làm gãy

Gốc: `_acceptance/vung-giao-viec-tu-cat-luot/` — ô của vòng «vùng giao việc đi từ cắt lượt» (owner phê CỘNG 27/10), neo ngoài `crm/_acceptance/bo-okr-co-so`; đề bài phanlemanh/acceptance-gate-kit#430. Ô trích lại tên tệp này ở `## Notes`.

## Người dùng gặp gì

Thước đã ký của hàng khác gãy chỉ lộ ra **sau** khi hàng phá đã gộp, ở lượt ghim của hàng bị phá. Mỗi lần là một câu
hỏi cho chủ kho ngoài ba cổng thiết kế, trong lúc khoá máy ngồi chờ. Đợt vỏ khu Mục tiêu: 6/17 lượt ghim không xanh trọn
vì lý do này (VK6 → VK8, VK6 → SV6, quyết định D5 → VK12).

## Hướng

Ở lượt chấm của hàng phá, chạy lại thước đã ký của các hồ sơ có vùng đo giao với diff của nhánh; thước nào đỏ thì hiện
một dòng trên thẻ Cổng Bằng chứng («hàng này đổi hành vi mà <hồ sơ>/<E> đang khoá»). Người ký quyết luôn trong cổng sẵn
có: không thêm lượt gọi.

## Vì sao chưa làm

Sau vòng vùng giao việc, chỉ còn ca khác tệp mà chung hành vi (thành phần dùng chung, dữ liệu chung). Chưa biết ca ấy
còn bao nhiêu. Thêm phép chạy vào lượt chấm là thêm phút máy cho mọi hàng.

## Ngưỡng mở ô

≥ 2 câu hỏi «thước gãy vì hàng khác» ngoài cổng trong một đợt chạy trên bản có vòng vùng giao việc.
