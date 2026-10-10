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
6. Tạo nhóm «Đợt <tên>» ở thanh bên, ghim phiên giám sát, mở chip cho từng phiên thợ. Lời dặn của
   chip gồm thư mục đợt, mã phiên, ranh giới, và câu «đọc LUAT.md trước S1».

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
