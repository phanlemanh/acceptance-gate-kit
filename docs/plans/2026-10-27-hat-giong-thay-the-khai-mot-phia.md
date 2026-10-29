# Hạt giống — khai «thay thế» một phía, từ hồ sơ của hàng mới

Gốc: `_acceptance/vung-giao-viec-tu-cat-luot/` — ô của vòng «vùng giao việc đi từ cắt lượt» (owner phê CỘNG 27/10), neo ngoài `crm/_acceptance/bo-okr-co-so`; đề bài phanlemanh/acceptance-gate-kit#430. Ô trích lại tên tệp này ở `## Notes`.

## Người dùng gặp gì

Khi một hàng cố ý đổi hành vi mà thước đã ký của hàng trước khoá, kit cho thước cũ nghỉ bằng con trỏ `superseded_by`.
Con trỏ ấy phải ghi vào `evals.yaml` của **hồ sơ cũ đã ký**, và chỉ có hiệu lực khi hồ sơ mới đã ký (`chungThayBoi`
trong `lib/evidence-core.cjs`). Đợt vỏ khu Mục tiêu (crm, 25–27/10) đã dùng lối này: VK6 cho nghỉ 12 eval của 5 hồ sơ
khác. Sửa hồ sơ đã ký của người khác làm PR của VK6 hoá cũ dây chuyền — VK6 là PR ghim nhiều nhất đợt (8 lần).

## Hướng

Cái bắt tay hai đầu đã nằm trong hợp đồng mới (thẻ `<slug cũ>/<id cũ>` đứng riêng). Bên đọc có thể nhận con trỏ chỉ từ
phía hồ sơ mới, khai từ Cổng Phạm vi, có hiệu lực khi hồ sơ mới ký — không chạm hồ sơ cũ.

## Vì sao chưa làm

Khi vòng «vùng giao việc đi từ cắt lượt» chạy, hàng chồng vùng chỉ bắt đầu sau khi hàng trước gộp, nên thước của nó
viết trên hành vi mới; số ca cần «thay thế» có thể về gần 0. Đổi bên đọc của luật thay thế là đổi đường verdict.

## Ngưỡng mở ô

≥ 2 PR trong một đợt chạy trên bản có vòng vùng giao việc vẫn phải sửa `evals.yaml` của hồ sơ đã ký khác để khai
`superseded_by`.
