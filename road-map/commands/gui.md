---
description: Gửi một ý vào cửa tín hiệu của kho hiện tại — ý được ghi lại và xử ở mốc khép, không gọi ai giữa chừng.
argument-hint: <một câu nói điều anh gặp>
---

Chạy được ở mọi phiên trong kho, không khoá: gửi một ý không phải là quyết định (hồ sơ `cua-tin-hieu-giua-chien-dich`,
B′ §11). Giải `$AG` bằng `resolve-plugin.mjs` của feature-loop (`--plugin acceptance-gate --require
scripts/gui-tin-hieu.mjs`, như `/road-map:xem`; kho tự host kit đặt `AG=.`), rồi chạy đúng khối dưới, thay
`<câu của người>` bằng NGUYÊN VĂN `$ARGUMENTS`. Câu đi qua heredoc có nháy nên shell không đụng tới backtick hay `$(…)`
trong câu — đừng chuyển nó vào dấu nháy kép của dòng lệnh.

<!-- <<<RM-GUI-LENH -->
```
node "$AG/scripts/gui-tin-hieu.mjs" --root . --noi-dung - <<'Y_MOI'
<câu của người>
Y_MOI
```
<!-- RM-GUI-LENH>>> -->

In nguyên văn dòng lệnh trả về («đã ghi, xử ở mốc khép — <tệp>»), không thêm hứa hẹn nào khác. Thoát 1 → kho chưa khai
cửa: in nguyên văn dòng ấy, không tự sửa cấu hình. Thoát 2 → câu rỗng: hỏi lại đúng một câu. Thoát 3 → in nguyên văn lỗi.
Ý nằm trên đĩa của kho, chưa vào git, tới khi phiên gom (skill `gom-tin-hieu`) commit nó cùng bản gom; thẻ khởi động
nhắc số ý chờ gom.
