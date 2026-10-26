---
description: Nối lại đợt Điều phối – Thợ sau khi app khởi động lại, phiên giám sát hết ngữ cảnh, Monitor hết hạn hay đổi tài khoản — nhận vai giám sát, chạy lại bộ phát lịch nếu chết, giăng lại Monitor và lịch 30′, và chỉ mở chip cho dãy không còn phiên sống. Dạng --nhe cho mỗi lần thức.
argument-hint: [--nhe]
---

Chạy được từ bất kỳ phiên nào trong kho: phiên gọi lệnh này trở thành **phiên giám sát** của đợt. Phần tính
được do CLI làm; phiên chỉ làm việc mà chỉ công cụ của app làm được, và làm ĐÚNG hành động CLI trả cho từng
dãy — không tự suy dãy nào cần chip. Lệnh không tự đổi pha của đợt: đợt đang `tam-dung` chờ chữ «chạy tiếp»
của người, đợt `nhap` chờ thẻ khởi tạo; chỉ khi đợt đang bàn giao tài khoản thì CLI rời hai pha bàn giao về đúng
pha trước đó. CLI: `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" <lệnh con>`.

Các bước, đúng thứ tự:

0. **Đọc mức dùng.** Gọi `get_usage` (công cụ phiên của app), rồi
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" han-muc --nguon get-usage --phien <mã phiên này> --doc '<kết quả get_usage>'`.
   Kho không có đợt thì lệnh in `khong-co-dot` — đi tiếp bước 1 (bước 1 sẽ dừng).
1. **CLI tiếp tục.** Lấy mã phiên này bằng công cụ phiên của app, rồi
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" tiep-tuc --phien <mã phiên này> --json $ARGUMENTS`.
   Mã phiên này là mã app `local_…` mà công cụ phiên của app trả — đánh thức nhắn giám sát bằng mã ấy; máy tự ghi mã CLI
   của phiên (biến `CLAUDE_CODE_SESSION_ID`) vào vai để đọc nhịp. Ngoài app (không có công cụ phiên) dùng mã CLI.
   CLI nhận vai giám sát (dạng `--nhe` chỉ ghi lúc thức), chạy lại bộ phát lịch nếu đã chết, và trả
   `ke_hoach` cho từng dãy. Thoát 1 «không có đợt» → nói một dòng và DỪNG.
2. **Phiên đã thôi vai.** Kết quả có `thoi_vai: true` → dừng Monitor đang giăng của phiên này, không ghi gì
   vào thư mục đợt, báo đúng một dòng «phiên này đã thôi giám sát đợt <tên>» và DỪNG.
   Đợt đang bàn giao tài khoản thì kết quả có thể mang:
   - `can_doc_han_muc`: phiên này chưa có lần đọc mức dùng còn hiệu lực — làm lại bước 0 rồi bước 1, một lần.
   - `khuyen_cho`: tài khoản hiện tại đã quá ngưỡng báo trước — báo chủ kho một dòng «tài khoản này đã dùng <pct>%
     cửa sổ <cua_so>, đặt lại lúc <dat_lai> — chờ đặt lại, hoặc đổi tài khoản khác rồi gõ lại /dieu-phoi:tiep-tuc».
     Không chuyển gì thêm; đi tiếp bước 3.
   - `ban_giao` với `trang_thai: da-tiep-tuc`: đợt đã rời bàn giao về pha trước; nói một dòng kèm mã bàn giao.
   Kết quả có `hook_thieu: true` (cả dạng `--nhe`): phiên này mở trước khi cài hay nâng gói nên hook của gói không nạp —
   đánh thức không thấy nhịp của nó. Nói nguyên `hook_thieu_cau` một dòng cho chủ kho rồi đi tiếp; việc đúng là mở phiên
   giám sát mới và gõ lại `/dieu-phoi:tiep-tuc`.
3. **Việc của app — chỉ tạo cái còn thiếu.** Giăng Monitor (timeout 30′):
   `tail -n0 -F <thư mục đợt>/su-kien.jsonl | grep --line-buffered '"can_phan":true'`. Lịch 30′ của đợt
   chưa có thì tạo theo khuôn dưới (cùng khuôn với bước 6 của `/dieu-phoi:mo-dot`).
<!-- <<<LICH-30 -->
   Mỗi lần lịch 30′ chạy: gọi `get_usage` rồi
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" han-muc --nguon get-usage --phien <mã phiên ngắn> --doc '<kết quả>'`,
   rồi `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" danh-thuc --json`
   rồi làm đúng `hanh_dong` — `nhan-giam-sat`: gửi tin liên phiên tới phiên `phien` với nguyên văn `cau` ·
   `bao-chu-kho`: đẩy thông báo cho chủ kho với nguyên văn `cau` · `khong`: không làm gì.
<!-- LICH-30>>> -->
   Nhóm «Đợt <tên>» ở thanh bên chưa có (sau đổi tài khoản thanh bên tách) thì dựng lại và ghim phiên này.
4. **Mỗi dãy theo `ke_hoach`** — một hành động, một việc:
   - `mo-chip`: mở chip cho dãy với nguyên văn `ghi_danh` CLI dựng (thư mục đợt, «đọc LUAT.md», lệnh
     `/feature-loop:feature-loop <slug>`). Dãy có `da_ban_giao: true` mà KHÔNG đổi tài khoản, và phiên cũ của dãy
     còn trong nhóm «Đợt <tên>» ở thanh bên → nhắn phiên đó «tiếp tục» thay vì mở chip.
   - `nhan-giang-lai`: nhắn phiên của dãy «tiếp tục: giăng lại lệnh chờ» — lệnh nền chờ khoá chết theo app.
   - `khong`: không làm gì.
   - `worktree-mat`: báo người — dựng lại worktree hay cho dãy nghỉ (`hang nghi`) là quyết định của người.
   - `cho-nguoi`: không mở chip; đưa vào «việc chờ anh» ở bước 5.
   - `chua-biet`: không mở chip; nói người kiểm thanh bên xem dãy còn phiên không (đợt chưa có nhịp sống).
   - `khong-hang`: không mở chip; nói một dòng «dãy <id>: <ly_do>» (nghỉ, hết hàng, chờ phụ thuộc hay Cổng Đáng).
5. **Chẩn đoán lại.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chan-doan --json --chi-tiet --phien <mã phiên này>`.
   Báo người đúng một khối: «đợt <tên> chạy lại · k dãy cần bấm chip · việc chờ anh: …» — k = số mục `day:*`
   mang hành động `mo-chip` (chip vừa mở ở bước 4: mục `du`, không mở lại); việc chờ là mục `viec-cho`, cũ nhất
   trước. Còn mục `thieu` mà phiên làm được → làm tiếp mục đó, không báo xong.
   Kết lượt chờ người bằng chữ thường, không qua nút: lượt có trang thẻ (`card.html`; Cổng Bằng chứng thêm `evidence-page.html`) thì gửi trang ấy bằng công cụ gửi tệp của phiên (`SendUserFile`), phiên không có công cụ ấy thì in đường dẫn trang; dòng lệnh hay dòng trả lời mẫu nằm trong một khối `` ```text ``, chép đúng như thẻ in — ô thẻ để `___` thì giữ `___`, máy không tự điền chữ quyết; hộp «bước kế» của app (`wrap_up`) ở lượt này chỉ mang phần tóm tắt, không câu hỏi và không nút, vì app bỏ nút mở đầu «/» hay «!» hoặc chứa «@», cắt tin của nút ở 300 ký tự, và bỏ nút khuyến nghị thì mất luôn câu hỏi.

**Dạng `--nhe`** (mỗi lần phiên giám sát thức): bước 0 (đọc mức dùng: `get_usage` rồi `han-muc`), bước 1 với `--nhe`, bước 2, phần Monitor của bước 3, và
bước 5 — không dựng lại lịch, nhóm hay chip. Nhờ vậy Monitor hết hạn được giăng lại ngay ở lần thức kế.
