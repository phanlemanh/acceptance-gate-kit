# Hạt giống — loại tác tử chấm chưa từng nạp được: gói đã cài không mang `agents/`, lời giải thích của SKILL chẩn sai

Gốc: `_acceptance/tac-tu-cham-chi-cham-khong/run-log.jsonl` (ba dòng `loai-tac-tu-vang` ngày 09/10/2026), cùng
ba dòng nữa ở run-log DP2 `dieu-phoi-mo-dot-mot-lenh`, lượt 1–3 ngày 10/10. Hạt giống là SỔ, không phải ô.

## Gốc rễ

`feature-loop/agents/` (`cham-lenh`, `cham-doc`, `cham-ui`) vào `main` qua PR #294 (`81679f2c`, 08:06 +07 ngày
10/10). PR này KHÔNG nâng version: `plugin.json` vẫn ghi `2.26.0`, và thẻ `v2.26.0` (`200ce7bb`) không chứa thư
mục ấy. Bản đã cài là `~/.claude/plugins/cache/acceptance-gate-kit/feature-loop/2.26.0`, lấy từ `3d81d1b4` (bản
marketplace kéo lúc 07:27 +07). Bản này không có `agents/`. Trên máy hiện không gói nào có `agents/`, nên danh
sách «Available agents» chỉ còn loại dựng sẵn. Ở máy cũ ngày 09/10, danh sách ấy CÓ `feature-dev:*`, nghĩa là
tác tử của gói vẫn nạp được vào `agent()` của Workflow; chỉ riêng gói này không mang loại nào.

Trong kho kit, S4 chạy `acceptance-verify.js` của CÂY (mới hơn bản phát hành), nên lần nào cũng xin loại mà bản
đã cài chưa có. Mỗi lượt chấm có đúng một `failed` mang `agentId: ""` trong journal (`agents_error: 1`). Đó là
lời gọi `agent()` đầu tiên mang `agentType`; sau nó cờ `loaiVangCaLuot` bật và các lời gọi còn lại đi thẳng
không loại. Lỗi này cùng gốc, không phải lỗi thứ hai.

Hệ quả cần nói thẳng: lời hứa của ô (vai chấm không cầm bút) chưa chạy chiều xanh lần nào, qua 6/6 lượt quan
sát. Thước N của hợp đồng đã TRỪ các lượt có dòng `loai-tac-tu-vang`, nên số không tự dối.

## Đề xuất

1. Máy và cấu hình cài gói, không chạm mã: các loại tác tử chỉ tới máy qua mốc kế (2.27.0). Sau mốc ấy chạy
   `uninstall` rồi `install`, đừng dùng `update`, vì cache khoá theo version và `update` báo «already at
   latest». Kiểm `ls …/feature-loop/<ver>/agents/`, rồi MỞ PHIÊN MỚI.
2. Mã kit (SKILL `feature-loop`, câu về `loaiTacTuVang`): câu hiện tại nói lượt rơi là do «phiên mở trước khi cài
   gói», và «mở phiên mới thì lượt kế có loại». Ở kho kit giữa hai mốc, và ở mọi kho cài bản không có
   `agents/`, mở phiên mới KHÔNG chữa được. Hướng: main loop đọc thư mục `agents/` của bản gói đang nạp, rồi in
   đúng một trong hai lý do: «gói đã cài chưa mang loại (chờ mốc)» hoặc «phiên mở trước khi cài».

Ngưỡng mở ô: sau khi một kho tiêu thụ đã cài một mốc có `agents/` và đã mở phiên mới, mà vẫn có ≥1 dòng
`loai-tac-tu-vang`.
