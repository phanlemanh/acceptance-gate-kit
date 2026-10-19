---
description: Đóng đợt Điều phối – Thợ đang chạy — trình thẻ đóng đợt, (khi người duyệt) hoàn tất merge dở, dừng bộ phát lịch, gỡ symlink, rồi dọn phiên và viết báo cáo đợt.
argument-hint: (không đối số)
---

Chạy trong phiên giám sát. CLI: `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" <lệnh con>`, ở gốc kho.

<!-- <<<CHU-QUYET-CUA-NGUOI -->
Chữ quyết chỉ nhận từ người gõ: chữ duyệt thẻ đóng đợt, hàng phát sinh nào giữ, lớp phủ ưu tiên nào đưa
vào lộ trình. Máy CHÉP đúng chữ ấy vào `--ly-do` của lệnh `pha` và vào bản phạm vi; máy không tự sinh
chữ ấy, không điền sẵn chữ quyết vào dòng mời.
Kết lượt chờ người bằng chữ thường, không qua nút: lượt có trang thẻ (`card.html`; Cổng Bằng chứng thêm `evidence-page.html`) thì gửi trang ấy bằng công cụ gửi tệp của phiên (`SendUserFile`), phiên không có công cụ ấy thì in đường dẫn trang; dòng lệnh hay dòng trả lời mẫu nằm trong một khối `` ```text ``, chép đúng như thẻ in — ô thẻ để `___` thì giữ `___`, máy không tự điền chữ quyết; hộp «bước kế» của app (`wrap_up`) ở lượt này chỉ mang phần tóm tắt, không câu hỏi và không nút, vì app bỏ nút mở đầu «/» hay «!» hoặc chứa «@», cắt tin của nút ở 300 ký tự, và bỏ nút khuyến nghị thì mất luôn câu hỏi.
<!-- CHU-QUYET-CUA-NGUOI>>> -->

Các bước, đúng thứ tự:

1. **Thẻ đóng đợt.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" the dong --json`. Trình bằng
   tiếng sản phẩm: hàng phát sinh trong đợt (người chọn hàng nào giữ — các hàng giữ đi vào lộ trình qua
   skill cắt lượt, bản phạm vi khoá `dot` = tên đợt, trong một PR có người gộp); lớp phủ ưu tiên đã đổi
   trong đợt (hỏi một lần có đưa vào tệp lộ trình không).
2. **Chờ người duyệt.** Một câu hỏi đóng, ô chữ quyết để trống.
3. **Hoàn tất merge dở.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" pha dang-dong --boi <tên người duyệt> --ly-do "<chữ duyệt nguyên văn>"`.
   Bộ phát lịch chỉ còn cấp `merge`; chờ tới khi `xem` không còn khoá `merge` hay đơn `merge`.
4. **Đóng.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" dong` — dừng bộ phát lịch, nhả khoá
   s4 cấp máy nếu đợt đang giữ, gỡ symlink; hook im.
5. **Dọn.** Xoá lịch 30′ của đợt; lưu trữ phiên thợ; với mỗi worktree đã gộp, kiểm
   `git status --porcelain` trước rồi mới dọn; viết báo cáo đợt (số đếm:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" dem --json`).
