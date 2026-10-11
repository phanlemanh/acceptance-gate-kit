# Luật đợt <tên>

Phiên giám sát là phiên duy nhất được sửa tệp này. Các phiên thợ đọc nó trước S1.

## Cách xin tài nguyên
Mọi lần ghi vào thư mục đợt đi qua lệnh con của lõi đợt, chạy bằng Bash từ worktree của dãy — không dùng
công cụ ghi tệp (thư mục đợt nằm ngoài worktree). Lệnh con kiểm khuôn trước khi ghi; sai thì thoát 1 và
nói lý do. `<thư mục đợt>` là đường trong lời ghi danh của chip.
- Xin lượt: `node <thư mục đợt>/loi/dieu-phoi.mjs xin <loại> [--uoc-phut <n>] [--mo-merge]`;
  `loại` ∈ `s4`, `ghim-lai`, `duong-nen`, `merge`. Rồi chờ bằng lệnh nền
  `until jq -e '.phien=="<dãy>"' <thư mục đợt>/khoa/<tài nguyên>/chu.json >/dev/null 2>&1; do sleep 15; done`.
- Nhả lượt: `node <thư mục đợt>/loi/dieu-phoi.mjs nha <tài nguyên>`.
- Việc nền dài khi đang giữ khoá: chạy qua lệnh bọc. Chép đúng dòng lệnh bọc mà hook in sẵn khi
  chặn — nó mang đường tuyệt đối tới `giu-nhip.mjs` của bản gói đang cài, ví dụ
  `node <gói dieu-phoi>/scripts/giu-nhip.mjs -- node <đường>/repin-lane.mjs --root . --slug <slug> --write`.
  Lệnh bọc chạm tín hiệu sống của khoá mỗi phút tới khi lệnh con thoát, rồi trả đúng mã thoát của
  nó. Không bọc thì trong lúc anh chờ không có lời gọi công cụ nào, tín hiệu sống cũ dần, và khoá bị
  thu hồi giữa chừng. Hook chặn lệnh nặng chạy nền chưa bọc và in sẵn dòng lệnh đã bọc để chép.
- Yêu cầu: `node <thư mục đợt>/loi/dieu-phoi.mjs yeu-cau <loại> [--hang <slug>] [--tep a,b]
  [--noi-dung '<json>']` — lệnh in mã yêu cầu `<dãy>-<số>`; trả lời ở `tra-loi/<mã>.json`. Loại:
  `cham-tep` (đòi `--tep`), `viec-phu`, `hang-moi`, `chuyen-hang`, `s4-gom`, `gia-han`, `can-nguoi`, `khac`.
- Gia hạn: yêu cầu `gia-han` với `--noi-dung '{"uoc_phut":<n>,"tai_nguyen":"<tài nguyên>"}'`. `uoc_phut` là số phút xin thêm;
  `tai_nguyen` (`s4`, `duong-nen`, `merge`) bắt buộc khi đang giữ nhiều khoá. Máy duyệt khi phiên đang
  giữ đúng khoá đó và ước trong trần; được duyệt (bởi máy hay giám sát) thì hạn thuê kéo dài đúng số
  phút đó, tính từ hạn còn lại (hạn đã qua thì tính từ lúc áp).
- Hàng kế: đọc `tiep/<phiên>.json`.
- Không tự gọi `spawn_task`: việc phụ đi qua yêu cầu `viec-phu`.

## Thứ tự gộp khi tranh chấp

## Nhật ký
