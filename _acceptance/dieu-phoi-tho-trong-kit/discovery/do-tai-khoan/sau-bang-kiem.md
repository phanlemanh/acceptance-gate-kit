# Bảng kiểm a–l — sau lần đổi tài khoản chủ động trên M5 (11/10/2026)

Đổi giữa 06:18Z (`truoc-doi`) và 06:52:27Z (kho phiên tài khoản cũ ghi lần cuối); phiên nối lại tạo 06:53:57Z.
Số đo: [sau-cong-cu.md](sau-cong-cu.md) · `sau.json`. Giá trị: còn · mất · khác · chưa-đo.

| # | Câu hỏi | Giá trị | Số đo |
|---|---|---|---|
| a | Phiên tài khoản cũ hiện trong danh sách phiên? | mất | `list_sessions` 8 phiên, toàn của tài khoản mới (mới nhất 09/10); 0/4 phiên tài khoản cũ; `get_session` DP4 → «not found» |
| b | Nhóm thanh bên còn? | khác | nhóm theo tài khoản: 3 nhóm ①②③ của tài khoản cũ không thấy; thấy «Đợt sau-14-10» (0 phiên) của tài khoản mới |
| c | Lịch hẹn 30′ còn, còn bật, chạy ở mốc kế? | chưa-đo | 0 lịch trước đổi, 0 sau — M5 không có lịch nào để quan sát |
| d | Bản ghi hội thoại cũ còn trên đĩa, mở lại được? | còn (đĩa) · chưa-đo (mở lại) | `.jsonl` kit 68→69 (+1 phiên này), crm 41, khác 96; bản ghi DP4 3990 dòng, DP6 3618 dòng còn nguyên. Mở lại từ app: không có lối — phiên không hiện trong danh sách tài khoản mới |
| e | Bộ phát lịch crm, worktree? | còn | 11/11 worktree còn, đỉnh khớp (cranky-kare aebcbde7, wizardly-gates eef19323); bộ phát lịch `khong-co-dot` cả hai lần (crm ở máy khác) |
| f | Remote Control + tin liên phiên tới phiên cũ? | mất | `send_message` tới DP4 `local_a796fa2b…`: «Message not delivered: session local_a796fa2b-d8ec-4ca5-aa5a-2e93a96b2581 not found. (delivery: undelivered; message_id: 1bd5c866-1de8-4c95-a0a3-c864998072ec)». `ListAgents`: 10 phiên Remote Control của tài khoản mới, đều offline, 0 thợ DP |
| g | Mức dùng tài khoản mới đọc được ngay? | còn | `get_usage` ngay phút đầu: Max · 5 giờ 5 % (đặt lại 09:20Z) · tuần 17 % (đặt lại 15/10 00:00Z) — khác hẳn tài khoản cũ (22 % / 20 %) |
| h | `rate_limits` ở dòng trạng thái? | chưa-đo | `doc.mjs`: 0 lần chạy (cả trước đổi); phiên mới chưa mở trong worktree thử |
| i | `StopFailure` `rate_limit`? | chưa-đo | 0 lần bắn; lần đổi chủ động không cạn hạn mức |
| j | Phiên rảnh nhận tin liên phiên bắt đầu lượt? | (không thuộc lần đổi) | đã đo cùng tài khoản — `ket-qua.md` câu 4 |
| k | Gói `dieu-phoi` + hook còn nạp sau đổi? | chưa-đo | M5 chưa cài gói cho kho nào |
| l | `$.session.usage().rateLimits` của mod? | chưa-đo (tài khoản mới) | `mod.jsonl` 41 dòng, toàn tài khoản cũ; mod nạp theo phiên, phiên mới chưa mở trong worktree thử |

## Chi phí người của lần nối lại (câu 3 bản nhẹ)

- Chủ kho gõ: **1 câu** («Nối lại vai Điều phối M5 — đọc bộ nhớ dieu-phoi-m5-noi-lai rồi làm tiếp»).
- Phút từ phiên mới tạo tới khi đo xong bước 5: ~5′ (06:53:57Z → ~06:59Z), không câu hỏi nào cho người.
- Mất khi đổi: toàn bộ đường liên lạc tới phiên thợ (danh sách, nhắn, Remote Control), nhóm thanh bên.
  Còn: bản ghi trên đĩa, worktree, nhánh, bộ nhớ dự án — đủ để một phiên mới dựng lại vai từ bộ nhớ.
