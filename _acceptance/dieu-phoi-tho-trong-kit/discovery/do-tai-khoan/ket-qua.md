# Kết quả phép đo DP0 — đổi tài khoản trong app desktop

Quy trình: [README.md](README.md). Quyết định chủ kho 11/10 (sổ `dieu-phoi-doi-tai-khoan`, dòng `by: manh`):
đo bằng MỘT lần đổi tài khoản CHỦ ĐỘNG trên máy M5 sau khi DP3 và DP7 gộp; đồng ý ba thử nghiệm h, i, l, mỗi
cái một chỗ, gỡ sau khi đo. Bộ đo: [thu/](thu/).

Trạng thái: **đã đo lần đổi chủ động** (11/10, đổi 06:18Z → 06:52Z, đổi về ~06:56Z) — câu 1, 6 đo được; câu 2 suy gián tiếp; câu 3, 5 chưa đo được trên M5 (lý do ở từng dòng). Số đo: [truoc-doi.json](truoc-doi.json) · [sau.json](sau.json) · [sau-cong-cu.md](sau-cong-cu.md) · [sau-bang-kiem.md](sau-bang-kiem.md). Bộ đo h, i, l đã gỡ 11/10 sau lần đổi về. Bảng dưới là đầu vào của hàng DP4: ca `DP4-15` đối chiếu cột
«Giá trị» với mục «Nhánh DP0» của hợp đồng `_acceptance/dieu-phoi-doi-tai-khoan/contract.md`. Giá trị là một
trong `còn` · `mất` · `khác` · `chưa-đo`.

<!-- <<<KET-QUA-DP0 -->
| Câu | Câu hỏi (spec workflow §11) | Giá trị | Số đo / lý do |
|---|---|---|---|
| 1 | Sau khi đổi, phiên cũ, nhóm thanh bên, lịch 30′ còn hiện và còn chạy? | mất | dưới tài khoản mới: `list_sessions` 0/4 phiên tài khoản cũ, `get_session` phiên DP4 «not found», tin liên phiên tới phiên DP4 «undelivered», 3 nhóm ①②③ không thấy (chỉ nhóm của tài khoản mới); lịch: 0 trước và sau — M5 không có lịch để quan sát. Đổi về (06:57Z): Điều phối + 3 thợ DP hiện lại, đủ 3 nhóm đúng số phiên, phiên DP4 chạy tiếp với ngữ cảnh còn nguyên. Bản ghi `.jsonl`, worktree, nhánh, bộ nhớ dự án còn suốt — mỗi tài khoản một kho phiên |
| 2 | `rate_limits` của dòng trạng thái có trên app desktop và khớp `get_usage`? | mất | suy GIÁN TIẾP (sau đổi và đổi về vẫn 0 lần gọi): lệnh dòng trạng thái (thử nghiệm h) cài vào `.claude/settings.local.json` của worktree cranky-kare lúc 11/10 03:03Z; phiên DP4 chạy trong chính worktree đó nhiều lượt sau, 0 lần gọi (không có `statusline.jsonl`; mod cùng phiên vẫn ghi `mod.jsonl` tới 04:35Z). Chưa loại trừ: app chỉ đọc `statusLine` lúc mở phiên — phiên mới vào worktree này không mở được (xem dưới) |
| 3 | `StopFailure` bắn với `error: "rate_limit"` khi một lượt chết vì hạn mức? | chưa-đo | lần đổi chủ động không cạn hạn mức — hook thử (i) 0 lần bắn trước và sau đổi; đã gỡ |
| 5 | Sau khi đổi, gói `dieu-phoi` và hook còn nạp trong phiên mới của kho? | chưa-đo | máy M5 chưa cài gói `dieu-phoi` cho kho nào; phiên nối lại dưới tài khoản mới mở ở kho chính, không ở worktree thử |
| 6 | `$.session.usage().rateLimits` của mod có số trên app desktop và khớp `get_usage`? | còn | 11/10 03:53Z, mod thử (chỉ chạy ở phiên đo) ghi lúc nạp: five_hour 6 % đặt lại 08:10:00Z · seven_day 15 % đặt lại 13/10 00:00Z; `get_usage` cùng lúc: 6 % đặt lại 08:09:59.547Z · 15 % đặt lại 12/10 23:59:59.547Z — khớp, giờ đặt lại của mod làm tròn tới phút. Đọc lại: 06:17Z mod 22 % · 19 % / `get_usage` 22 % · 20 %; sau khi đổi về 06:57Z mod 24 % · 20 % / `get_usage` 24 % · 20 % (cùng giờ đặt lại 08:10Z của tài khoản cũ). Dưới tài khoản mới chưa đo — mod nạp theo phiên, không phiên nào mở trong worktree thử |
<!-- KET-QUA-DP0>>> -->

## Phát hiện phụ — app không mở phiên mới vào worktree có sẵn

11/10, chủ kho thử mở phiên mới chọn nhánh `claude/cranky-kare-4e5cd2` bằng nút chọn nhánh của app desktop: app
báo «Couldn't check out the branch» — nó checkout nhánh vào kho chính, mà nhánh đã bị worktree giữ. Kho chính
không bị đụng. Hệ quả cho bàn giao: tài khoản mới không mở được phiên vào đúng worktree của dãy bằng nút nhánh;
đường đi là mở phiên trong thư mục worktree (lời ghi danh của chip `tiep-tuc` mang đường worktree của dãy).

## Câu 4 — không thuộc lần đổi

Phiên đang rảnh nhận tin liên phiên thì có bắt đầu lượt mới không? Hồ sơ DP3 khai đây là giới hạn (ngưỡng: đợt
thử crm ~26/10). Quan sát 11/10 trên M5, app desktop, CÙNG tài khoản, công cụ `send_message` của app (Điều phối M5
gom, thợ DP4 thêm một lần):

| Trạng thái phiên nhận | Kết quả công cụ | Phiên nhận làm gì | Lần quan sát |
|---|---|---|---|
| rảnh | «delivered; its turn has started on it» | bắt đầu lượt mới, trả lời tin | 4: «Đồng bộ OneHub từ GitHub» (hai tin), «Điều tra hạ tầng S4» (một tin), «Điều phối M5 đóng gói» (tin của thợ DP4, 02:19Z) |
| đang giữa lượt | «queued … runs it when that clears» | xử lý sau khi lượt đang chạy kết thúc, không chen giữa lượt | 2: phiên DP3, phiên DP7 |

Kết luận đo được: phiên rảnh → bắt đầu lượt ngay; phiên bận → xếp hàng tới hết lượt. Chưa đo: phiên rảnh dưới tài
khoản KHÁC (tin liên phiên chỉ trong cùng tài khoản — spec workflow §10), và phiên của app vừa khởi động lại.

## Số nền trước khi đổi (đọc 11/10 ~02:23Z qua `get_usage`)

Gói Max: cửa sổ 5 giờ 23 % (đặt lại 03:09:59Z) · tuần mọi model 12 % (đặt lại 12/10 23:59Z) · tuần Fable 0 %.
