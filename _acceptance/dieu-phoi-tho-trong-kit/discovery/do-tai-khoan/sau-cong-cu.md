# Bốn công cụ phiên — sau khi đổi tài khoản (bước 5)

Đọc 11/10/2026 ~06:54Z từ phiên «Điều phối M5 nối lại» (`local_36045b6a-7ff5-4b58-a5b1-452a9842e437`,
tạo 06:53:57Z, mở ở kho chính `/Users/manhphan/dev/acceptance-gate-kit`, KHÔNG ở worktree thử — xem ghi chú cuối).
So với `truoc-doi.json` (06:18Z, đọc từ phiên Thợ DP4 dưới tài khoản cũ).

| Công cụ | Trước đổi (06:18Z) | Sau đổi (06:54Z) |
|---|---|---|
| `list_sessions` | 4 phiên không lưu trữ ngoài phiên gọi: Thợ DP6 (chạy), Điều phối M5 đóng gói (ghim), Thợ DP7, Sửa build artifact-platform; 3 bật Remote Control | 8 phiên không lưu trữ, phiên mới nhất 09/10 13:51Z («Orchestrator-Worker setup hai máy», crm-onehub); KHÔNG phiên nào của tài khoản cũ; 0 bật Remote Control; 0 đang chạy |
| `get_session` Thợ DP4 `local_a796fa2b…` | (chính phiên gọi) | `Session … not found.` |
| `list_groups` | 3 nhóm: ① Đóng gói Điều phối – Thợ (DP) 4 · ② crm · okr:mau 2 · ③ Xong · chờ dọn 2 | 1 nhóm: «Đợt sau-14-10» 0 phiên |
| `list_scheduled_tasks` | 0 | 0 |
| `get_usage` | Max · 5 giờ 22 % (đặt lại 08:10Z) · tuần mọi model 20 % (đặt lại 13/10 00:00Z) · Fable 0 % | Max · 5 giờ 5 % (đặt lại 09:20Z) · tuần mọi model 17 % (đặt lại 15/10 00:00Z) · Fable 0 % |
| `ListAgents` | — | 10 phiên ngang hàng, tất cả «Remote Control · offline», không có thợ DP nào |

## `chup.mjs sau` so `truoc-doi`

- Kho phiên app: kho 14 phiên (tài khoản cũ) ghi cuối 06:52:27Z rồi dừng; kho 12 phiên (ghi cuối 09/10 13:51Z)
  thành 13 phiên, ghi 06:54:03Z → tài khoản mới là tài khoản đã dùng tới 09/10, mỗi tài khoản một kho phiên.
- Bản ghi hội thoại `.jsonl`: kit 68 → 69 (+1 = chính phiên này), crm 41, khác 96 — không mất tệp nào.
  Bản ghi thợ DP4 (`9bd31cbb…`, 3990 dòng) và DP6 (`bbb12524…`, 3618 dòng) còn trên đĩa, ghi cuối 06:53Z.
- Worktree: đủ 11, gồm cranky-kare (aebcbde7) và wizardly-gates (eef19323).
- Lịch hẹn trên đĩa 0 → 0; bộ phát lịch crm `khong-co-dot` (crm chạy máy khác).
- `chup.mjs` in `fatal: cannot change to '/Users/manhphan/dev/crm'` ra stderr — đường crm cứng trong bộ chụp
  không có trên M5; không ảnh hưởng số khác.

## `thu/doc.mjs --worktree cranky-kare-4e5cd2`

`h · dòng trạng thái: 0 lần chạy` · `i · StopFailure: 0 lần bắn` · `l · mod: 41 dòng`, dòng cuối five_hour 23 % /
seven_day 19 % (đặt lại 08:10Z / 13/10) — toàn bộ ghi dưới tài khoản CŨ. Mod thử nạp theo phiên, nên phiên mới
dưới tài khoản mới chưa sinh dòng nào; câu l dưới tài khoản mới cần một phiên mở trong worktree thử.

Ghi chú: phiên này mở ở kho chính theo đường nối lại một-câu của Điều phối, không ở worktree thử như README bước 5
viết — app không mở phiên vào worktree có sẵn bằng nút nhánh (phát hiện phụ ở `ket-qua.md`).
