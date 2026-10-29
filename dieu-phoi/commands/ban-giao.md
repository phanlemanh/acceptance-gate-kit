---
description: Bàn giao đợt Điều phối – Thợ trước khi đổi tài khoản — ngừng cấp lượt mới, nhắc thợ commit WIP và báo xong, máy dựng hồ sơ bàn giao từ git, rồi báo một câu để tài khoản kia tiếp tục bằng một lệnh.
argument-hint: [lý do]
---

Chạy ở phiên giám sát. Bộ phát lịch cũng tự vào bàn giao khi mức dùng chạm ngưỡng của đợt (chính sách chủ kho đã
duyệt ở thẻ khởi tạo), nên lệnh này còn là lệnh giám sát chạy khi nhận sự kiện `cham-han-muc`. Phần tính được do
CLI làm; phiên chỉ nhắn thợ và báo người — không tự commit, đẩy hay chuyển pha thay ai, không tự quyết dãy nào xong.
CLI: `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" <lệnh con>`.

Các bước, đúng thứ tự:

1. **CLI bàn giao.** Lấy mã phiên này bằng công cụ phiên của app, rồi
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" ban-giao --ly-do "$ARGUMENTS" --phien <mã phiên này> --json`.
   Mã phiên này là mã app `local_…` mà công cụ phiên của app trả — đánh thức nhắn giám sát bằng mã ấy; máy tự ghi mã CLI
   của phiên (biến `CLAUDE_CODE_SESSION_ID`) vào vai để đọc nhịp. Ngoài app (không có công cụ phiên) dùng mã CLI.
   Đợt sang «đang bàn giao»: bộ phát lịch ngừng cấp lượt mới, kể cả đơn đã nằm trong hàng chờ. Thoát 1 → nói
   nguyên lý do một dòng và DỪNG. Đợt đã đang bàn giao thì lệnh chỉ cập nhật hồ sơ bàn giao (chạy lại được).
2. **Nhắn từng phiên thợ** trong `can_nhan` (tin liên phiên, cùng tài khoản): «bàn giao: dừng ở ranh giới gần nhất,
   commit WIP, rồi chạy `node <thư mục đợt>/loi/dieu-phoi.mjs ban-giao-xong` từ worktree của dãy (kèm
   `--wip "<mô tả>"` để lệnh commit hộ)». Tin chỉ là lời nhắc phụ: lời nhắc chính tự hiện trong phiên thợ qua hook
   nhịp của gói. Dãy đang chạy lượt chấm thì để lượt chạy hết — dãy đó được xếp «đang xong».
3. **Chờ.** Giăng Monitor như thường. Bộ phát lịch tự dựng hồ sơ bàn giao (`ban-giao.json`, từ git và thư mục đợt)
   khi mọi dãy đã báo xong hoặc khi hết hạn chờ, rồi chuyển đợt sang «chờ tiếp tục» và phát sự kiện `ban-giao-dung`.
4. **Báo chủ kho** đúng một câu: nguyên văn trường `tin` của sự kiện `ban-giao-dung` — câu đó mang
   `/dieu-phoi:tiep-tuc` và đường lùi cho trường hợp lệnh chưa nạp trong phiên mới sau khi đổi tài khoản: đọc
   mức dùng (`get_usage` rồi `han-muc --nguon get-usage`) rồi `node <thư mục đợt>/loi/dieu-phoi.mjs tiep-tuc --phien <mã phiên này> --json` (mã app `local_…` của phiên mới; máy tự ghi mã CLI). Chủ kho không ngồi trước máy
   thì đẩy kèm một thông báo. Không hỏi gì thêm.
