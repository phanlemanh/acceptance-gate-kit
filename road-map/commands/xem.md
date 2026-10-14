---
description: Xem rà soát lộ trình của kho hiện tại — hàng nào nên dời mốc, chờ điều kiện hay bác, kèm căn cứ. Chỉ đọc.
argument-hint: (không đối số)
---

Chỉ đọc, chạy được ở mọi phiên trong kho. Giải `$AG` bằng `resolve-plugin.mjs` của feature-loop
(`--plugin acceptance-gate --require scripts/lo-trinh.mjs`, như bước 1 của `/acceptance-gate:acceptance-card`), rồi
chạy đúng dòng trong khối dưới và in nguyên văn kết quả, mỗi dòng một đề xuất. Không in gì nghĩa là không có đề xuất
nào — nói đúng một dòng như vậy. Kho chưa khai lộ trình (thoát 1) thì nói đúng một dòng như vậy, kèm chỗ khai
(`lo_trinh.tep` trong `_acceptance/config.yaml`). Lệnh không ghi tệp nào và không đổi kế hoạch — người quyết dời, chờ
hay bác bằng một PR sửa tệp lộ trình.

<!-- <<<RM-XEM-LENH -->
```
node "$AG/scripts/lo-trinh.mjs" --root . --ra-soat
```
<!-- RM-XEM-LENH>>> -->
