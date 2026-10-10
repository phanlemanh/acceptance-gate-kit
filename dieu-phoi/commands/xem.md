---
description: Xem đợt Điều phối – Thợ đang chạy — pha, khoá đang giữ, hàng chờ lượt, chờ người, tiến độ từng dãy kèm nhóm kế hoạch. Chỉ đọc.
argument-hint: (không đối số)
---

Chỉ đọc, chạy được ở mọi phiên trong kho:

`node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" xem`

In nguyên văn kết quả. Không có đợt nào đang chạy thì nói đúng một dòng như vậy. Có dòng cảnh báo
(hook bản cũ còn trong settings của kho) thì giữ nguyên dòng đó. Muốn mở bảng đợt: `bang.html` trong
thư mục đợt.
