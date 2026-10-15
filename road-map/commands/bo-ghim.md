---
description: Bỏ ghim một hàng lộ trình — máy lại được tự áp lên hàng ấy. Chỉ người gõ.
argument-hint: <mã> hoặc <tệp>:<mã>
disable-model-invocation: true
---

Quyết của người lên lộ trình (ADR 0002 — khoá model-invocation; hồ sơ `ap-chinh-sach-lo-trinh`). Bỏ ghim chỉ ghi một dòng vào sổ tự áp. Đề xuất vừa bị trả lại vẫn bị chặn cho tới khi căn cứ của nó đổi.

Chỉ chạy khi đối số khớp đúng mẫu `^([A-Za-z0-9][A-Za-z0-9_./-]*:)?[A-Za-z0-9][A-Za-z0-9_.-]*$`; không khớp (có khoảng trắng, dấu, backtick, `$(...)`) thì dừng và nói đúng
một dòng — KHÔNG đưa đối số vào shell. Thay `<mã>` trong khối dưới bằng đối số (nằm trong nháy đơn) rồi chạy đúng dòng ấy.
Bản chép trong kho (`scripts/lo-trinh.mjs`) thắng bản cài: bộ ghi phải cùng phiên bản với bộ đọc CI của kho. Kho không có
bản chép thì giải `$AG` bằng `resolve-plugin.mjs` của feature-loop (`--plugin acceptance-gate --require scripts/lo-trinh.mjs`),
như lệnh `/road-map:xem`. In nguyên văn kết quả; thoát khác 0 thì in nguyên văn dòng lỗi (thoát 3 = mã có ở nhiều lộ trình —
gọi lại bằng `<tệp>:<mã>`).

<!-- <<<RM-BO-GHIM-LENH -->
```
L=scripts/lo-trinh.mjs; [ -f "$L" ] || L="$AG/scripts/lo-trinh.mjs"; node "$L" --root . --bo-ghim '<mã>' --write
```
<!-- RM-BO-GHIM-LENH>>> -->
