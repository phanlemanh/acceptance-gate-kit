# Hạt giống — việc chỉ đọc giữa các máy chưa có đường máy tự đi

Gốc: `_acceptance/vung-giao-viec-tu-cat-luot/` — ô của vòng «vùng giao việc đi từ cắt lượt» (owner phê CỘNG 27/10), neo ngoài `crm/_acceptance/bo-okr-co-so`; đề bài phanlemanh/acceptance-gate-kit#430. Ô trích lại tên tệp này ở `## Notes`.

## Người dùng gặp gì

27/10, để đếm một sổ đợt chỉ đọc ở máy khác (đầu vào của #430), chủ kho phải bấm cho phép hai lần ở hai phiên: phiên
brainstorm soạn lệnh, phiên giám sát giữ kênh chặn đăng tin GIAO kèm script lên kênh liên máy cho tới khi chủ kho bấm
tại chỗ. Máy nhận vẫn không chạy được script (bộ duyệt tự động chặn chạy mã lấy từ ngoài) và phải tự đo lại bằng
`jq`/`grep`. Một việc không ghi gì, không khó đảo, mất hai lượt gọi người.

## Hướng

Một lệnh đo chỉ đọc có sẵn trong gói đợt (cùng bản ở mọi máy) nhận yêu cầu đếm theo tên phép đo, thay cho chở script qua
kênh. Kênh chỉ chở tên phép đo và đối số.

## Vì sao chưa làm

Một ca. Phân quyền của phiên là quyết định của người, không phải thứ kit được lách.

## Ngưỡng mở ô

≥ 2 lần nữa giữa hai mốc phát hành, một phép đo chỉ đọc liên máy cần chủ kho bấm cho phép.
