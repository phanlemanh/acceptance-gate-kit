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
