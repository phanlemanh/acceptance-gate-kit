# Phép đo DP0 — đổi tài khoản trong app desktop, trên máy thật

Chủ kho chốt 09/10: trục đổi tài khoản phải đo trên máy thật, không đoán. Phép đo có ba câu hỏi:

1. Đổi tài khoản trong app desktop thì phiên cũ, lịch hẹn và lịch sử hội thoại còn hay mất?
2. Mức dùng hạn mức đọc được không, và từ đâu?
3. Một vòng thật «hết hạn mức → bàn giao → tiếp tục dưới tài khoản kia» mất gì, và tốn của người bao nhiêu câu?

## Vì sao đo vào lần đổi THẬT kế tiếp, không dựng lần đổi riêng

Mọi phiên trong app dùng chung một tài khoản, kể cả phiên giám sát và các phiên thợ của đợt crm
đang chạy. Một lần đổi «để thử» sẽ chạm cả đợt crm. Vì vậy phép đo đi kèm lần đổi mà chủ kho phải
làm dù sao: khi tài khoản đang dùng gần chạm hạn mức. Lúc chụp trạng thái «trước», tài khoản đã
dùng 76 % hạn mức tuần.

## Các bước

| Bước | Ai làm | Việc |
|---|---|---|
| 1 · Trước | máy, đã làm 09/10 14:35Z | `node chup.mjs truoc` → `truoc.json`, kèm số đọc qua công cụ của phiên: `list_sessions`, `list_groups`, `list_scheduled_tasks`, `get_usage` |
| 2 · Bàn giao tay | phiên giám sát crm | Làm bàn giao nhẹ theo bản ghi nhu cầu §4.2, bước 2–3: mỗi thợ commit phần dở thành commit WIP rồi đẩy nhánh; ghi `ban-giao.json` bằng tay (tên đợt, sha nhánh chính, mỗi dãy: hàng · bước · nhánh · đỉnh · việc chờ người). Bước này là bản giấy của hàng DP4 |
| 3 · Ngay trước khi đổi | máy (phiên bất kỳ) | `node chup.mjs truoc-doi` → `truoc-doi.json`, đọc lại bốn công cụ |
| 4 · Đổi | chủ kho | Đăng xuất, rồi đăng nhập tài khoản kia trong app. Máy không làm được bước này: đăng nhập là việc của người |
| 5 · Sau | phiên mới dưới tài khoản mới | `node chup.mjs sau` → `sau.json`, đọc lại bốn công cụ, rồi trả lời bảng kiểm dưới |
| 6 · Tiếp tục tay | phiên giám sát mới của crm | Nối lại đợt theo §4.2 «tiếp tục», bằng tay. Đếm số câu chủ kho phải gõ, số phút từ lúc đăng nhập tới lúc thợ đầu tiên chạy lại, và từng thứ bị mất |

## Bảng kiểm sau khi đổi (bước 5)

| # | Câu hỏi | Đọc bằng |
|---|---|---|
| a | Các phiên của tài khoản cũ có hiện trong danh sách phiên không? | `list_sessions` (so 140 phiên lúc trước) |
| b | Nhóm «Đợt sau-14-10» ở thanh bên còn không? | `list_groups` |
| c | Lịch hẹn nhịp 30′ còn trong danh sách, còn bật, và có chạy ở mốc kế không? | `list_scheduled_tasks`; `lastRunAt` sau giờ đổi |
| d | Bản ghi hội thoại cũ còn trên đĩa không, và có mở lại được không? | `chup.mjs` (số tệp `.jsonl`), mở thử một phiên cũ |
| e | Bộ phát lịch crm còn sống không? Worktree còn đủ không? | `chup.mjs` |
| f | Phiên bật Remote Control và tin nhắn liên phiên tới phiên cũ còn dùng được không? | `list_sessions` (`remoteControlActive`), gửi thử một tin |
| g | Mức dùng của tài khoản mới đọc được ngay không? | `get_usage` |
| h | Trường `rate_limits` có trong JSON dòng trạng thái của phiên Code tab không, và có khớp `get_usage` không? | một lệnh statusline ghi stdin ra tệp. Đây là sửa cài đặt người dùng, nên chỉ làm khi chủ kho đồng ý |
| i | Lượt chết vì hạn mức có bắn hook `StopFailure` với `error: "rate_limit"` không? | một hook ghi đầu vào ra tệp, chỉ ở một worktree thử. Cũng là sửa cài đặt, nên phải có đồng ý |
| j | Phiên đang rảnh nhận tin liên phiên thì có bắt đầu lượt mới không? (đo được không cần đổi tài khoản) | gửi thử một tin |
| k | Sau khi đổi, gói `dieu-phoi` và hook của nó còn nạp trong phiên mới của kho không? CHỈ đo được ở lần đổi ĐẦU TIÊN sau khi crm đã cài gói (dự kiến sau 20/10) | `chan-doan` mục «hook đã bắn trong phiên này» |
| l | `$.session.usage().rateLimits` của mod có số trên app desktop và khớp `get_usage` không? | mod thử, sau khi chủ kho đồng ý bật mod |

Câu h, i, l cần chủ kho đồng ý sửa cài đặt (lệnh dòng trạng thái, hook thử, mod thử); máy xin đồng ý trong lời mời của lần đo, một dòng cho cả ba.

Kết quả ghi vào `ket-qua.md` cạnh tệp này. Mỗi dòng ghi «còn», «mất» hay «khác», kèm số đo.
Đây là đầu vào của hàng DP4.

## Đã biết trước khi đo (09/10)

- App giữ danh sách phiên trong `~/Library/Application Support/Claude/claude-code-sessions/<mã>/<mã>/`,
  mỗi tài khoản một kho. Kho 333 phiên ngừng ghi lúc 06/10 16:21Z, khớp lần đổi tài khoản 05–06/10.
  Kho 184 phiên đang ghi.
- Bản ghi hội thoại (`~/.claude/projects/`) và lịch hẹn (`~/.claude/scheduled-tasks/`) nằm ngoài phần
  tách theo tài khoản.
- Bộ phát lịch là tiến trình Node tách rời; nó vẫn sống sau khi app cập nhật ngày 08/10.

## Lần đo chủ động trên M5 (quyết định chủ kho 11/10)

Chủ kho đổi ý so với mục «Vì sao đo vào lần đổi THẬT»: crm chạy ở máy khác, nên một lần đổi CHỦ ĐỘNG trên M5
không chạm đợt crm. Đo sau khi DP3 và DP7 gộp (máy rảnh); Điều phối chọn giờ và gọi chủ kho đổi. Chủ kho đồng
ý luôn ba thử nghiệm h, i, l — mỗi cái MỘT chỗ, gỡ sau khi đo. Kết quả ghi ở [ket-qua.md](ket-qua.md).

| Bước | Ai | Việc |
|---|---|---|
| 1 · Cài | phiên đo (một phiên mở trong worktree thử) | `node thu/cai.mjs --worktree <worktree thử> --mod-dir ~/.claude/dev-mods/<mã phiên đo>`. Chép mod bật câu hỏi «nạp lại nóng» — chủ kho chọn «Enable for this session» |
| 2 · Câu 2, 6 | phiên đo | Mở một phiên MỚI trong worktree thử (dòng trạng thái và hook đọc từ `.claude/settings.local.json` của nó), làm vài lượt, đọc `get_usage`, rồi `node thu/doc.mjs --worktree <worktree thử>` — so phần trăm và giờ đặt lại hai bên |
| 3 · Trước khi đổi | phiên đo | `node chup.mjs truoc-doi > truoc-doi.json`, kèm số đọc qua `list_sessions`, `list_groups`, `list_scheduled_tasks`, `get_usage` |
| 4 · Đổi | chủ kho | Đăng xuất, đăng nhập tài khoản kia trong app |
| 5 · Sau | phiên mới dưới tài khoản mới, trong worktree thử | `node chup.mjs sau > sau.json`, bốn công cụ, bảng kiểm a–l ở trên, `doc.mjs` lần nữa (câu 2, 6 dưới tài khoản mới; câu 3 chỉ có số nếu một lượt thật sự cạn hạn mức) |
| 6 · Gỡ | phiên mới | `node thu/go.mjs --worktree <worktree thử>` — khôi phục tệp cài đặt gốc, xoá mod thử; tệp số đo giữ ở `.acceptance-runs/do-tai-khoan/` |
| 7 · Ghi | phiên mới | Điền `ket-qua.md` (mỗi câu một giá trị còn · mất · khác · chưa-đo kèm số), rồi khối «Nhánh DP0» đã chọn trong hợp đồng DP4; ca `DP4-15` đối chiếu hai bên |

`cai.mjs` từ chối khi tệp cài đặt đã có `statusLine` hay hook `StopFailure` (không ghi đè cài đặt của người),
và khi đã cài mà chưa gỡ. Thử khô 11/10 trên thư mục tạm: cài → ghi → đọc → gỡ, tệp gốc khôi phục khớp băm.
