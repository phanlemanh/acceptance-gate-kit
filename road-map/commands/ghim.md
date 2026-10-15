---
description: Ghim một hàng lộ trình — máy không tự áp lên hàng ấy cho tới khi bỏ ghim. Chỉ người gõ.
argument-hint: <mã> hoặc <tệp>:<mã>
disable-model-invocation: true
---

Quyết của người lên lộ trình (ADR 0002 — khoá model-invocation; hồ sơ `ap-chinh-sach-lo-trinh`). Ghim chỉ ghi một dòng vào sổ tự áp (`<tệp>.so.jsonl`); tệp lộ trình không đổi, nên tuổi hàng không bị đặt lại. Báo trước đang chờ của hàng ấy bị huỷ ở lần tự áp kế.

Chỉ chạy khi đối số khớp đúng mẫu `^([A-Za-z0-9][A-Za-z0-9_./-]*:)?[A-Za-z0-9][A-Za-z0-9_.-]*$`; không khớp (có khoảng trắng, dấu, backtick, `$(...)`) thì dừng và nói đúng
một dòng — KHÔNG đưa đối số vào shell. Thay `<mã>` trong khối dưới bằng đối số (nằm trong nháy đơn) rồi chạy đúng dòng ấy.
Bản chép trong kho (`scripts/lo-trinh.mjs`) thắng bản cài: bộ ghi phải cùng phiên bản với bộ đọc CI của kho. Kho không có
bản chép thì giải `$AG` bằng `resolve-plugin.mjs` của feature-loop (`--plugin acceptance-gate --require scripts/lo-trinh.mjs`),
như lệnh `/road-map:xem`. In nguyên văn kết quả; thoát khác 0 thì in nguyên văn dòng lỗi (thoát 3 = mã có ở nhiều lộ trình —
gọi lại bằng `<tệp>:<mã>`).

<!-- <<<RM-GHIM-LENH -->
```
L=scripts/lo-trinh.mjs; [ -f "$L" ] || L="$AG/scripts/lo-trinh.mjs"; node "$L" --root . --ghim '<mã>' --write
```
<!-- RM-GHIM-LENH>>> -->
