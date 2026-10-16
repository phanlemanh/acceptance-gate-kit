# Hạt giống — cửa tín hiệu: bên ghi và bên đọc một gốc kho

Gốc: _acceptance/lo-trinh-du-lieu-ngay-du-kien/ — mục Ngoài-7 và Ngoài-11 của Cổng Bằng chứng RM6c (16/10), chủ kho chọn
«mở hợp đồng mới». Hai mục do lượt chấm 1 của RM6c soi nhầm vào mã RM3 (`cua-tin-hieu-giua-chien-dich`) vì mốc so cũ;
lỗi là thật và thuộc vùng cửa tín hiệu. Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài.

## Việc

Bộ xét của đợt (`dieu-phoi/scripts/phat-lich.mjs`) ghi ý không chặn được vào cửa tín hiệu ở **gốc kho chính**
(`gocKhoChinh`, `--git-common-dir`). Lệnh `/road-map:gui` (`scripts/gui-tin-hieu.mjs`), dòng đếm «N ý chờ gom» trên thẻ mở
phiên (`start-scan.mjs`) và phiên gom (`tin-hieu.mjs --root .`) lại đọc/ghi theo **cây hiện tại**. Ở phiên chạy trong
worktree — cách kit thường chạy — ý người gửi nằm chưa theo dõi trong `<worktree>/<tin_hieu.nguon>`: thẻ mở phiên không
đếm, phiên gom không thấy, xoá worktree là mất ý mà không báo, dù lệnh đã nói «đã ghi».

Hướng: mọi bên ghi và bên đọc của cùng cửa dùng chung một gốc (gốc kho chính), kèm ca kiểm trên kho thử CÓ worktree.

## Ngưỡng mở

Một ý người gửi bị mất hay không được gom thật ở một kho tiêu thụ, hoặc chủ kho gọi tên.
