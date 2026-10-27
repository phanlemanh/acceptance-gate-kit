# Hạt giống — giao việc theo nhịp của khoá chấm, không theo dãy rảnh

Gốc: `_acceptance/vung-giao-viec-tu-cat-luot/` — ô của vòng «vùng giao việc đi từ cắt lượt» (owner phê CỘNG 27/10), neo ngoài `crm/_acceptance/bo-okr-co-so`; đề bài phanlemanh/acceptance-gate-kit#430. Ô trích lại tên tệp này ở `## Notes`.

## Người dùng gặp gì

Cả dòng việc chỉ đi nhanh bằng một khoá máy chấm. Dãy dựng rảnh vì chờ khoá thì được giao hàng kế, nên kho «đã ký chưa
gộp» đầy lên; kho ấy mục theo mỗi lần gộp (VK8 chờ hơn 12 giờ, năm lượt ghim). Bộ phát lịch không có giới hạn nào cho
kho này — lịch biết tệp chỉ xét trùng tệp, không xét sức khoá.

## Hướng

Đợt chỉ mở hàng mới khi số hàng «ký chưa gộp» dưới một ngưỡng; thước thành công của đợt là kết quả gộp mỗi giờ khoá.
Số `ky_den_gop` của `dieu-phoi.mjs dem` (2.34.0) là tín hiệu điều khiển sẵn có.

## Vì sao chưa làm

Đổi cách điều phối ở mọi kho; vòng vùng giao việc đã tự giới hạn phần chồng vùng. Hàng không chồng vùng ít làm hoá cũ
nhau nếu vùng đo của thước hẹp.

## Ngưỡng mở ô

Trên bản có vòng vùng giao việc, một đợt có trung vị ký → gộp > 4 giờ mà nguyên nhân không phải trùng vùng (đọc từ
`dem`: `ghim_lai_sau_ky` và `ky_den_gop`).
