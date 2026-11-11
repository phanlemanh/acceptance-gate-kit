# Hạt giống — mảnh PR của bộ workflows và bộ điều phối thiếu zsh

Gốc: acceptance-gate-kit/_acceptance/luot-kiem-nhe/ — Ngoài-1 và Ngoài-2 của Cổng Bằng chứng (11/11/2026), chủ kho chọn
«mở hợp đồng mới».

Từ vòng `luot-kiem-nhe`, lượt kiểm của PR chạy theo mảnh. Chỉ các mảnh bộ kiểm script cài zsh; mảnh «hooks + workflows +
bản đồ» và mảnh «dieu-phoi» không cài. Vài ca của hai bộ ấy tự bỏ qua vế zsh khi máy không có zsh
(`tests/workflows/doi-chung-chay-duoc.test.mjs` DC2b, `tests/workflows/baseline-tran-bo-qua-don.test.mjs` vế zsh,
`tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`), nên lỗi chỉ lộ dưới zsh chỉ bị bắt ở lượt trọn sau khi gộp.

Nhát sửa: đặt `zsh: true` cho hai mảnh ấy trong `.github/workflows/gate.yml`, và thêm vào ca LKN-AC1 khẳng định mọi mảnh
chạy cùng môi trường vỏ lệnh với lượt trọn (chiều đỏ: bản sao đặt `zsh: false` cho một mảnh có ca dùng zsh → đỏ gọi tên
mảnh). Giá ước: một vòng T2 nhỏ, khoảng 2 giờ máy.

## Thêm 11/11 tối — bước cài zsh là điểm đỏ oan chung của tám mảnh

Lượt kiểm của PR #499 tại `58e119c2` đỏ hai lần liền (lượt gốc và lượt chạy lại) ở đúng một chỗ: bước «cài zsh» hết trần
5 phút vì máy lượt kiểm không phân giải được tên miền kho gói Ubuntu («Temporary failure resolving 'archive.ubuntu.com'»),
trước khi có ca kiểm nào chạy. Trước vòng `luot-kiem-nhe` bước này chạy một lần mỗi lượt; nay chạy ở tám mảnh bộ kiểm
script, nên một sự cố mạng làm đỏ cả tám. Cùng vòng nhỏ với nhát sửa zsh ở trên: cài zsh có thử lại và trần riêng, hoặc
lưu sẵn gói zsh giữa các lượt, và đếm số lượt đỏ vì bước cài trong cửa sổ phát hành kế.
