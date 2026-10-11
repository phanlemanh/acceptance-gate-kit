---
description: Nối lại đợt Điều phối – Thợ sau khi app khởi động lại, phiên giám sát hết ngữ cảnh, Monitor hết hạn hay đổi tài khoản — nhận vai giám sát, chạy lại bộ phát lịch nếu chết, giăng lại Monitor và lịch 30′, và chỉ mở chip cho dãy không còn phiên sống. Dạng --nhe cho mỗi lần thức.
argument-hint: [--nhe]
---

Chạy được từ bất kỳ phiên nào trong kho: phiên gọi lệnh này trở thành **phiên giám sát** của đợt. Phần tính
được do CLI làm; phiên chỉ làm việc mà chỉ công cụ của app làm được, và làm ĐÚNG hành động CLI trả cho từng
dãy — không tự suy dãy nào cần chip. Lệnh không đổi pha của đợt: đợt đang `tam-dung` chờ chữ «chạy tiếp»
của người, đợt `nhap` chờ thẻ khởi tạo. CLI: `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" <lệnh con>`.

Các bước, đúng thứ tự:

1. **CLI tiếp tục.** Lấy mã phiên này bằng công cụ phiên của app, rồi
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" tiep-tuc --phien <mã phiên này> --json $ARGUMENTS`.
   CLI nhận vai giám sát (dạng `--nhe` chỉ ghi lúc thức), chạy lại bộ phát lịch nếu đã chết, và trả
   `ke_hoach` cho từng dãy. Thoát 1 «không có đợt» → nói một dòng và DỪNG.
2. **Phiên đã thôi vai.** Kết quả có `thoi_vai: true` → dừng Monitor đang giăng của phiên này, không ghi gì
   vào thư mục đợt, báo đúng một dòng «phiên này đã thôi giám sát đợt <tên>» và DỪNG.
3. **Việc của app — chỉ tạo cái còn thiếu.** Giăng Monitor (timeout 30′):
   `tail -n0 -F <thư mục đợt>/su-kien.jsonl | grep --line-buffered '"can_phan":true'`. Lịch 30′ của đợt
   chưa có thì tạo: mỗi lần chạy gọi `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" danh-thuc --json`
   rồi làm đúng `hanh_dong` — `nhan-giam-sat`: gửi tin liên phiên tới phiên `phien` với nguyên văn `cau` ·
   `bao-chu-kho`: đẩy thông báo cho chủ kho với nguyên văn `cau` · `khong`: không làm gì. Nhóm «Đợt <tên>»
   ở thanh bên chưa có (sau đổi tài khoản thanh bên tách) thì dựng lại và ghim phiên này.
4. **Mỗi dãy theo `ke_hoach`** — một hành động, một việc:
   - `mo-chip`: mở chip cho dãy với nguyên văn `ghi_danh` CLI dựng (thư mục đợt, «đọc LUAT.md», lệnh
     `/feature-loop:feature-loop <slug>`).
   - `nhan-giang-lai`: nhắn phiên của dãy «tiếp tục: giăng lại lệnh chờ» — lệnh nền chờ khoá chết theo app.
   - `khong`: không làm gì.
   - `worktree-mat`: báo người — dựng lại worktree hay cho dãy nghỉ (`hang nghi`) là quyết định của người.
   - `cho-nguoi`: không mở chip; đưa vào «việc chờ anh» ở bước 5.
   - `chua-biet`: không mở chip; nói người kiểm thanh bên xem dãy còn phiên không (đợt chưa có nhịp sống).
5. **Chẩn đoán lại.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chan-doan --json --chi-tiet --phien <mã phiên này>`.
   Báo người đúng một khối: «đợt <tên> chạy lại · k dãy cần bấm chip · việc chờ anh: …» (mục `viec-cho`,
   cũ nhất trước). Còn mục `thieu` mà phiên làm được → làm tiếp mục đó, không báo xong.

**Dạng `--nhe`** (mỗi lần phiên giám sát thức): bước 1 với `--nhe`, bước 2, phần Monitor của bước 3, và
bước 5 — không dựng lại lịch, nhóm hay chip. Nhờ vậy Monitor hết hạn được giăng lại ngay ở lần thức kế.
