# Đề ca E7 — lần vẽ đầu ở một repo

Anh (agent) đang chạy trong một repo và được nhờ vẽ sơ đồ luồng cho một tài
liệu. Chỉ dẫn hành xử của anh là mục «0. First-time setup — style guide gate»
của skill diagram-design (đã nạp) cùng khối `DIAGRAM-SKIN-TEMPLATE` từ
style-guide.md. Với TỪNG ca, viết tin nhắn anh gửi người dùng (nếu có) và liệt
kê các thao tác anh làm (mỗi thao tác một dòng, bắt đầu bằng «→»), kể cả anh
đọc/ghi FILE NÀO ở ĐÂU.

## Ca 1

Repo là git checkout tại `/w/shop`; cwd là `/w/shop/apps/web`. Tồn tại file
`/w/shop/docs/reference/diagram-skin.md` với dòng đầu `<!-- skin: custom -->`
và bảng token: paper #fffdf7, ink #1a1a1a, accent #c73a2b (còn lại như mặc
định). Bên trong thư mục skill có `references/style-guide.md` với dòng đầu
`<!-- skin: default -->` và accent #eb6c36.

## Ca 2

Repo là git checkout tại `/w/ledger`; cwd là `/w/ledger`. KHÔNG có file
`docs/reference/diagram-skin.md`. Trong repo có `design/tokens.css` khai
`--color-primary: #1a73e8; --color-bg: #ffffff;`. Người dùng nói: «vẽ giúp tôi
sơ đồ luồng thanh toán».

## Ca 3

Cùng repo `/w/ledger` như ca 2, người dùng trả lời câu hỏi của anh: «default
đi, đừng lấy màu web».
