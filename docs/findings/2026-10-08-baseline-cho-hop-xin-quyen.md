# Làn đối chứng S4 «treo 5 giờ» là chờ hộp xin quyền, không phải lệnh treo (08/10/2026)

Hồ sơ sửa: `_acceptance/baseline-tran-bo-qua-don/`. Sự cố: crm, đợt điều phối sau-14-10, hồ sơ
`khung-ban-ghi-kara`, lượt `wf_f425c910-a3b` (kit 2.24.0), 07/10.

## Báo cáo ban đầu và chỗ nó lệch

Báo cáo ban đầu: lệnh dạng `bun run test -- "cd apps/api && bun test …"` treo khoảng 5 giờ, tác tử lặp
lại cùng lô lệnh. Vật nói khác:

| Thời điểm (UTC) | Nguồn | Sự kiện |
|---|---|---|
| 15:45:15 | transcript tác tử `baseline:diffBase` | gọi Bash: vòng `while read … bash -c "cd \"$WT\" … && $c"` cho 8 lệnh đầu (không có `bun run test`) |
| 15:45:15 | `~/Library/Logs/Claude/main.log` | `Emitted tool permission request ccefa32f… for Bash in session local_e8cb8231…` |
| 20:44:49 | `ps` của phiên giám sát | không có tiến trình nào của lệnh đó — lệnh CHƯA chạy |
| 20:45:17 | main.log | `respondToToolPermission … decision=once` (owner bấm, 03:45 giờ máy) |
| 20:45:17 | mtime `cmds.txt`, `out1..8.log` | lệnh chạy và xong trong 3 giây — cả 8 lệnh «had no matches» |
| 20:45:23 | main.log | yêu cầu quyền thứ hai (lô có `bun run test …`) |
| 20:47:29 | main.log | `Permission request … aborted` — workflow bị dừng tay |

Phiên ở `bypassPermissions` (main.log `[permissionMode] spawn … effective=bypassPermissions`). Lượt 08:32
giờ máy cùng ngày: tác tử baseline của một lượt S4 khác, vòng `eval "$c"`, cũng bị hỏi (người bấm sau 3
giây). Mọi lệnh khung máy `BOC_LENH` kit sinh: chưa lần nào bị hỏi.

## Cơ chế

Kiểm tra an toàn có sẵn của Claude Code hỏi người cho lệnh nó không phân tích được: script `-c`/eval có
thể chứa `rm`, và xoá có đích là biến không phân giải được. Phiên sửa đo lại hai lần qua chính công cụ
Bash: `bash -c '…rm…'` bị chặn («passes a shell -c script that runs rm»); bản đầu của lệnh kit sinh bị chặn
vì `rmdir "$T0"` với `T0=$(dirname …)`. Bản cuối (không `eval`/`bash -c "$biến"`/`rm`/`rmdir`) chạy qua.

Gốc ở kit: prompt cũ để tác tử TỰ CHẾ cách chạy nhiều lệnh. Tác tử chọn vòng lặp chạy lệnh từ biến — đúng
hình dạng bị hỏi. Workflow chạy nền, ban đêm, không ai thấy hộp; harness không có trần cho `agent()`.

## Phụ: baseline vô nghĩa ở đây

Mọi eval của hồ sơ đo tệp kiểm MỚI; ở merge-base tệp chưa có, nên «chạy trên code cũ» chỉ đo việc tệp
vắng. Bản sửa bỏ qua các lệnh ấy, ghi lý do vào báo cáo.

## Giới hạn còn lại

Hộp xin quyền đến trước khi lệnh chạy; không trần nào trong lệnh chặn được, và luật của kiểm tra an toàn
không do kit giữ. Ngưỡng mở lại ở Notes của hợp đồng.
