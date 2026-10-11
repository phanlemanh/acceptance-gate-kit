# Gói `dieu-phoi` — tầng máy của Điều phối – Thợ

Spec phương pháp: `docs/superpowers/specs/2026-10-05-orchestrator-workers-hai-tang-design.md` của kit.
Mã này **không** chứa gì riêng của kho. Mọi giá trị riêng nằm trong `dieu-phoi.config.json` và
`hang-viec.json` của đợt.

## Cài cho một kho

```
claude plugin install dieu-phoi@acceptance-gate-kit --scope project
```

Gói gắn bốn hook qua `hooks/hooks.json` của chính nó (chặn S4 không khoá, nhịp, chờ người ×2); kho
không phải sửa `.claude/settings.json`. Kho chưa có đợt nào đang chạy thì mọi hook im: thoát 0, không
in gì, không tạo tệp. `acceptance-init` KHÔNG tự bật gói này — kho chọn cài.

Đường gói (dùng cho mọi lệnh dưới đây):

```
GOI=$(node <gói feature-loop>/scripts/resolve-plugin.mjs --plugin dieu-phoi)
```

## Mở đợt (phiên giám sát làm, sau khi owner duyệt thẻ khởi tạo)

1. `node "$GOI/scripts/dieu-phoi.mjs" mo <tên>`
2. Điền vào thư mục đợt:
   - `hang-viec.json`: các khối `day` (id, worktree tuyệt đối đã `realpath`, link `claude://` lấy từ
     `list_sessions`) và `hang`;
   - `dieu-phoi.config.json`: `nhanh_chinh`, `bao_ve`;
   - `LUAT.md`: phần riêng của đợt.
3. `node "$GOI/scripts/dieu-phoi.mjs" chay` — chép lõi vào `<thư mục đợt>/loi/` (kèm `PHIEN-BAN.json`)
   rồi chạy bộ phát lịch từ bản chép, để nâng gói giữa đợt không rút mất mã đang chạy.
4. Giăng Monitor, timeout 30′, hết hạn thì giăng lại:
   `tail -n0 -F <thư mục đợt>/su-kien.jsonl | grep --line-buffered '"can_phan":true'`
5. Tạo task lịch 30′ với `notifyOnCompletion`. Prompt: «đọc trang-thai.json của đợt <tên>, in một
   dòng». Task này là lưới an toàn khi app khởi động lại.
6. Tạo nhóm «Đợt <tên>» ở thanh bên, ghim phiên giám sát, mở chip cho đúng các dãy mà
   `chan-doan --json --chi-tiet` trả hành động `mo-chip`, với nguyên văn `ghi_danh` (thư mục đợt, mã phiên,
   câu «đọc LUAT.md trước S1», lệnh `/feature-loop:feature-loop <slug>`). Dãy `khong-hang` (nghỉ, hết hàng,
   chờ phụ thuộc hay Cổng Đáng) không có chip; dãy `mo-chip` đã mở chip là chờ người bấm, không mở lại.

## Tiếp tục đợt (sau khi app khởi động lại, hết ngữ cảnh, Monitor hết hạn)

Gõ `/dieu-phoi:tiep-tuc` ở bất kỳ phiên nào trong kho. CLI `tiep-tuc --phien <mã>` nhận vai giám sát, chạy
lại bộ phát lịch nếu chết, và trả kế hoạch cho từng dãy; lệnh người chỉ làm đúng kế hoạch đó (Monitor, lịch
30′, nhóm thanh bên, chip cho dãy không còn nhịp sống mà còn hàng để giao). Mỗi lần thức, phiên giám sát chạy
dạng `--nhe`.
Thợ ghi vào thư mục đợt bằng lệnh con (`xin`, `nha`, `yeu-cau`) — xem mục «Cách xin tài nguyên» của
`LUAT.md` trong thư mục đợt.

## Đổi tài khoản (hết hạn mức)

Khai ngưỡng ở khoá `han_muc` của `dieu-phoi.config.json` (khuôn: `{bao_truoc_pct: 80, ban_giao_pct: 90,
cho_ban_giao_phut: 20, cho_dat_lai_phut: 45}`; không khai thì bộ phát lịch không xét hạn mức). Mức dùng vào
`han-muc.json` qua lệnh con `han-muc` — từ mod của gói (`hooks/mod/`), từ `get_usage` mỗi lần giám sát thức và
mỗi lần lịch 30′ chạy. Chạm ngưỡng bàn giao (hoặc gõ `/dieu-phoi:ban-giao`): bộ phát lịch ngừng cấp lượt, thợ
nhận lời nhắc trong phiên, commit WIP và chạy `node <thư mục đợt>/loi/dieu-phoi.mjs ban-giao-xong` (kèm `--wip
"<mô tả>"` để lệnh commit hộ); máy dựng `ban-giao.json` từ git. Đổi tài khoản, mở một phiên trong kho, gõ
`/dieu-phoi:tiep-tuc`. Lưới cuối: hook `StopFailure` commit WIP khi một thợ chết vì hạn mức.

## Trong đợt

- Mỗi nhịp, bộ phát lịch kiểm hình dạng `dieu-phoi.config.json` và `hang-viec.json` (kiểu từng
  trường, đủ `han_thue_phut` cho mọi loại đơn, `bao_ve` là danh sách, không khoá lạ). Sai thì nhịp
  không cấp lượt, không duyệt yêu cầu nào, và ghi một sự kiện `loi-nhip` `can_phan` nêu đúng trường
  sai, cho tới khi tệp được sửa. Bộ phát lịch còn đòi `goc_kho` lúc khởi động.
- Bản lõi theo đợt (`loi/`) mất thì bộ phát lịch ngừng thu hồi và cấp khoá, ghi sự kiện `loi-vang`
  `can_phan` («lõi vắng») — chạy lại `chay` để chép lõi mới.
- Khoá `s4` đang giữ thì bộ phát lịch bỏ lượt `git fetch` (sự kiện `bo-fetch`), để nhánh chính trên
  remote không dời giữa một lượt chấm.
- Yêu cầu `gia-han` máy không duyệt (vượt trần, phiên giữ nhiều khoá mà không nêu) thì giám sát duyệt
  bằng `tra-loi/<id>.json` như mọi yêu cầu: `ket_qua: duyet` là đủ để nhịp kế kéo dài hạn thuê, một
  lần. Muốn cho số phút khác thì thêm `uoc_phut`; giữ nhiều khoá thì thêm `tai_nguyen`. Không áp được
  (khoá đã sang tay, thiếu số phút) thì có một sự kiện `gia-han-khong-ap` `can_phan`.
- Tệp trả lời `tra-loi/<id>.json` được kiểm khi bộ phát lịch đọc nó. Hỏng cú pháp JSON, hoặc sai hình
  dạng (không phải object, thiếu `ket_qua`, sai kiểu, khoá lạ), thì tệp bị chuyển nguyên tên vào
  `tra-loi/hong/` và có một sự kiện `tra-loi-hong` `can_phan` nêu tệp và trường sai. Các khoá và yêu cầu
  khác vẫn chạy bình thường trong cùng nhịp. Yêu cầu đó khi ấy coi như chưa trả lời: sửa bằng cách ghi
  lại `tra-loi/<id>.json` đúng hình dạng, nhịp kế đọc nó như thường.
- Khoá hợp lệ của tệp trả lời: `ket_qua`, `boi`, `ly_do`, `luc`, `voi`, `tai_nguyen`, `uoc_phut`.
- Không dùng `/loop` làm nhịp: phiên giám sát thức dậy nhờ Monitor ở bước 4 và task lịch 30′ ở bước 5 của
  phần mở đợt, cộng tin của owner.
- Mỗi sự kiện `can_phan`: đọc dòng sự kiện. Với yêu cầu, ghi `tra-loi/<id>.json` gồm
  `{ket_qua, boi:"giam-sat", ly_do, luc}` và một dòng Nhật ký. Với `dich:"owner"`: gom lại, push tối
  đa 1 lần mỗi 30′.
- Mở lại bảng: `<thư mục đợt>/bang.html`. Xem nhanh: `node "$GOI/scripts/dieu-phoi.mjs" xem`.
- Mỗi lần thức: `node "$GOI/scripts/dieu-phoi.mjs" chay`. Lệnh tự bỏ qua nếu bộ phát lịch còn sống,
  tự chạy lại nếu nó đã chết.

## Chặn S4 và việc chờ người

- **Hook chặn S4 nhận ra lệnh đúng theo cấu trúc lời gọi**, không so chuỗi con. Lệnh chạy `repin-lane.mjs`,
  `s4-args.mjs` hay `duong-nen.mjs` vẫn bị nhận ra khi đứng sau một lệnh bọc kèm cờ: `timeout`, `env` (kể cả
  `-u`, `-C`, `-P`, `-S`), `nice -n`, `time -p`, `nohup`, `command`, `exec -a`, `caffeinate -t/-w`. Không bị
  chặn: `node --check`/`node -c` (kiểm cú pháp) và lời gọi có `--help` (cả ba script dừng ở cờ lạ trước khi
  làm việc). Thân heredoc được quét như mọi dòng lệnh, nên heredoc nhắc tên một trong ba script vẫn bị chặn —
  xem giới hạn dưới.
- **Lời chặn nêu sẵn lệnh xin lượt** khi cwd thuộc một dãy: sau câu cũ và câu «chờ lượt» (DP7), thêm
  «Lệnh xin lượt (chạy nguyên văn từ worktree của dãy): node <thư mục đợt>/loi/dieu-phoi.mjs xin s4» (đợt chưa
  `chay` thì lõi của gói). Ngoài mọi dãy, hoặc đợt có `hang-viec.json` không đọc được (khi ấy `xin` cũng không
  chạy), lời chặn y như cũ.
- **Hộp xin quyền ở phiên thợ luôn thành việc chờ người** (`cho-nguoi/<dãy>.json`), kể cả khi dãy đang chờ
  lượt hay chờ trả lời. Thông báo «đang rảnh» thì vẫn im khi dãy đang chờ.
- **Giám sát thức ngay khi thợ chờ người**: sự kiện `cho-nguoi` mang `can_phan`, `loai_cho` và `tin` (≤ 200 ký
  tự), nên Monitor của giám sát (lọc `"can_phan":true`) thức trong một nhịp của bộ phát lịch.

Giới hạn đã khai, kèm ngưỡng mở lại:

- **Heredoc nhắc tên script S4 bị chặn kể cả khi thân chỉ là dữ liệu** (`cat > tep <<'EOF'` có nhắc
  `repin-lane.mjs`, `python3 - <<'PY'` ghi sổ có tên script). Đo 11/10: 2 trên 46.801 lời gọi Bash. Viết tệp bằng
  công cụ Write thay `cat <<EOF`. Luật «thân là dữ liệu» đã dựng rồi thu lại ở hồ sơ `dieu-phoi-lop-mod`: hai lượt
  chấm liền tìm ra lệnh S4 lọt qua bộ đọc đối số của trình thông dịch (cờ `-o pipefail`, chuyển hướng `2>&1` trên
  dòng mở). Ngưỡng mở lại (khuôn danh sách đóng bên tiêu thụ, ở hạt giống
  `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`): một lần đo lại bản ghi thấy > 10 lời gọi heredoc chặn
  nhầm.
- **chưa đo: hộp quyền của tác tử Workflow có tới hook chờ người không.** Ngưỡng: đợt thử có ≥ 1 lượt S4 đứng
  vì hộp quyền mà không có tệp chờ người. Phép đo đã soạn ở hạt giống
  `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`.
- Bộ phân loại là bộ đọc cú pháp shell rút gọn: biến mở rộng thành tên script, `eval`, alias, lệnh bọc viết đủ
  đường (`/usr/bin/env -u X …`), cờ gộp (`env -iu X`) và `gtimeout` không được hiểu. Ngưỡng: ≥ 1 lời gọi S4
  thật lọt qua hook trong đợt thử.
- Tệp chờ người do hộp xin quyền ghi chỉ gỡ khi người gửi một lời nhắc ở phiên thợ (`UserPromptSubmit`); duyệt
  hộp mà không gõ gì thì tệp ở lại tới lời nhắc kế, nên «việc chờ» có thể còn một mục đã xong. Gỡ theo lời gọi
  công cụ kế tiếp cần biết hộp thuộc tác tử nào — chưa đo (hạt giống, câu 1 §12.3). Ngưỡng: đợt thử có ≥ 1 lần
  giám sát báo chủ kho một việc chờ đã xong.
- Ca kiểm «nguồn» của chín lời gọi thật (`tests/dieu-phoi/rut-lenh-that.mjs`) chỉ chạy trên máy có bản ghi
  hội thoại; nơi khác (CI) in «bỏ qua» — các ca phân loại vẫn chạy trên tệp ca đã commit.

## Phiên thợ trong đợt

Phiên thợ không cần ai dặn nó đang trong đợt: S0 của `/feature-loop` chạy `trong-dot.mjs` của gói
feature-loop (chỉ đọc). Kho không có đợt → lệnh không in gì và vòng chạy y như cũ. Có đợt → nó gọi lệnh
`tho --json` của bản lõi trong thư mục đợt và nhận một JSON: dãy của phiên (theo worktree trong
`hang-viec.json`), pha, quyền tự merge, hàng kế (đọc từ `tiep/<dãy>.json`) và `viec_ke` — việc kế của thợ khi
xong một hàng:

- `mo-hang` — hàng kế đã có quyết build (hồ sơ, ô `decision: build`, hoặc hàng phát sinh giám sát đã thêm):
  thợ tự mở nó trong cùng phiên.
- `cho-nhip` — bộ phát lịch chưa thấy hàng vừa xong; thợ chờ một nhịp rồi đọc lại.
- `bao-giam-sat` — hàng kế chưa có quyết build (hoặc đã quyết park, kill, iterate): thợ không mở, báo giám sát.
  Ở đợt mở từ gói bộ phát lịch đã không giao những hàng ấy, nên đây là lưới cho ca quyết đổi sau nhịp.
- `cho` — dãy nghỉ, chờ phụ thuộc, chờ Cổng Đáng (`cong-dang`), hoặc đợt không ở pha đang chạy.
- `xong` — dãy hết hàng.

Ở đợt mở từ gói, bộ phát lịch chỉ giao hàng đã quyết build — quyết đọc bằng cùng hàm với thẻ khởi tạo và
thợ (`quyetCua` của `the.mjs`): hàng chưa có chữ build bị bỏ qua (dãy hết hàng giao được thì `cho: cong-dang`),
ô đã quyết park, kill, iterate không vào đợt. Đợt dựng tay (không gói) giữ lối cũ: Cổng Đáng của hàng nằm ở S0
của thợ.

Quyền tự merge do người trả ở thẻ khởi tạo, giám sát ghi bằng `pha dang-chay --tu-merge co|khong`; vắng thì
thợ đọc là không tự merge. Mọi lần thợ ghi vào thư mục đợt (xin lượt, nhả lượt, yêu cầu `can-nguoi`,
`hang-moi`) theo mục «Cách xin tài nguyên» của `LUAT.md` của đợt. Yêu cầu `can-nguoi` chưa trả lời hiện ở danh
sách chờ người của bảng đợt và được lệnh đếm tính một lần.

## Chuyển từ bản lõi chép tay trong kho

Kho từng chép lõi vào cây của mình và gắn hook trong `.claude/settings.json` thì trong lúc chuyển hai
bản cùng đọc một thư mục đợt và ra cùng quyết định. `xem` in một dòng cảnh báo khi settings của kho còn
hook gọi bản cũ. `xem --kiem-chuyen` liệt kê mọi chỗ trong kho còn trỏ bản cũ (settings, hook git,
`package.json`, eval của hồ sơ, `LUAT.md` của đợt) — sạch thì in `kiem-chuyen: sach`.

## Đóng đợt

`node "$GOI/scripts/dieu-phoi.mjs" dong`, sau khi owner duyệt thẻ đóng đợt. Lệnh dừng bộ phát lịch và
gỡ symlink, nên hook im. Sau đó: xoá task lịch, lưu trữ phiên thợ, dọn worktree đã gộp (kiểm
`git status --porcelain` trước), viết báo cáo đợt.

## Đường lùi

`dieu-phoi.mjs dong` là đủ. `LUAT.md` và `khoa/` vẫn dùng tay được theo cách ngày 04/10.
