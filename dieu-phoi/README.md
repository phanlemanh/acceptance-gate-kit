# Gói `dieu-phoi` — tầng máy của Điều phối – Thợ

Spec phương pháp: `docs/superpowers/specs/2026-10-05-orchestrator-workers-hai-tang-design.md` của kit.
Mã này **không** chứa gì riêng của kho. Mọi giá trị riêng nằm trong `dieu-phoi.config.json` và
`hang-viec.json` của đợt.

## Cài cho một kho

```
claude plugin install dieu-phoi@acceptance-gate-kit --scope project
```

Gói gắn sáu khối hook qua `hooks/hooks.json` của chính nó (chặn S4 không khoá, nhịp, chờ người ×2, lưới hết hạn
mức `StopFailure`, chặn kết lượt khi còn việc giao chưa nhận `Stop`) và một mod đọc mức dùng (`hooks/mod/`); kho không phải sửa `.claude/settings.json`. Kho chưa có đợt nào đang chạy thì mọi hook im: thoát 0, không
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
- **Câu giám sát hỏi chủ kho** (hồ sơ `khung-dot-dinh-vi`, ADR 0027 bước a). Mỗi câu phiên giám sát hỏi chủ kho
  trong chat và chờ trả lời → `node "$GOI/scripts/dieu-phoi.mjs" hoi --cau - <<'CAU_HET' … CAU_HET` (hay
  `--cau "<câu>"`) TRƯỚC khi kết lượt; lệnh in `hoi: <mã>`. Chủ kho trả lời → `hoi-xong <mã>`. Sự kiện mang kiểu
  `hoi-chu-kho` / `hoi-chu-kho-xong` và `can_phan:false`, nên Monitor của giám sát không thức vì câu của chính nó —
  không ghi câu của chính mình bằng sự kiện mang `can_phan:true`. Câu rỗng hay mã không mở → thoát 2, không ghi gì.
  `xem --json` liệt câu đang mở ở khoá `hoi_chu_kho` — khoá chỉ có khi có câu mở. Không tự đóng câu khi có tin vào
  phiên giám sát (lịch 30′ và tin liên phiên cũng vào đó): quên `hoi-xong` thì khung báo dư kèm tuổi câu.
  - Giới hạn đã khai: giám sát GỌI `hoi` là chỉ dẫn ở `/dieu-phoi:tiep-tuc`, không có máy giữ. Ngưỡng mở vòng hook
    tự ghi: ≥1 lần trên đợt thật dải báo thiếu một câu giám sát đã hỏi.
- Mỗi sự kiện `can_phan`: đọc dòng sự kiện. Với yêu cầu, ghi `tra-loi/<id>.json` gồm
  `{ket_qua, boi:"giam-sat", ly_do, luc}` và một dòng Nhật ký. Với `dich:"owner"`: gom lại, push tối
  đa 1 lần mỗi 30′.
- Mở lại bảng: `<thư mục đợt>/bang.html`. Xem nhanh: `node "$GOI/scripts/dieu-phoi.mjs" xem`. Bản máy đọc là
  `xem --json`: một dòng JSON, gồm cùng mô hình mà `xem` vẽ, cộng dãy của cwd, dòng cảnh báo hai bản và độ lệch
  múi giờ. Kho không có đợt thì in `{"dot":null}`.
- **Khung trạng thái đợt trong app** (phần mod `hooks/mod/khung.ts`, hồ sơ `trang-thai-dot-dieu-phoi-tho`). Ở mọi
  phiên trong kho có đợt, trên ô nhập có một dải một dòng:
  `Đợt <tên> · <pha> · S4: <phiên> → HH:MM · chờ lượt <n> · cần anh <n>`. «Cần anh» đếm MỌI việc đang chờ chủ
  kho bằng một hàm (`canAnh`): tệp chờ người và yêu cầu `can-nguoi` của thợ, lời báo sức khoẻ máy, câu giám sát
  đang mở.
  - Ở phiên thợ, dải thêm dãy của phiên đó. Khi giảm tải, dải mở đầu `GIẢM TẢI`.
  - Nút `xem` trên dải mở pane «Đợt» với **khung định vị** (hồ sơ `khung-dot-dinh-vi`): dòng đầu là mục tiêu đợt
    (khoá `muc_tieu` của `hang-viec.json`; vắng → cờ vàng) · tiến độ «xong <đã gộp>/<số hàng> · đang làm · đang
    chấm · chờ · rảnh» · «CẦN ANH: n» kèm từng việc — là gì, ở phiên nào, bao lâu · mỗi dãy một dòng việc mang tên
    ngắn từ tệp lộ trình (`ten_ngan`, rồi `ten`, rồi sáu từ đầu câu giao) và mã trong ngoặc — hàng không tra được
    tên mang cờ «chưa có tên trong lộ trình» · giờ địa phương tương đối. Tên tra qua `tep` + `ma` của hàng thi
    công, không có `tep` thì qua `nguon_hang` của gói. Mod đọc `xem --json --khung`; `xem --khung` in cùng khung ra
    terminal. Dòng `xem`, `xem --json` và lệnh `/dieu-phoi:xem` giữ chữ cho máy đọc như cũ.
  - Dải làm mới mỗi 20″ khi có đợt và mỗi 120″ khi không; kho không có đợt thì không có dải.
  - `/dieu-phoi:xem` trả lời ngay, không tốn lượt model. Khi mod không chạy hoặc CLI lỗi, lệnh markdown cũ trả lời
    qua model như trước.
  - Mod chỉ đọc qua CLI và vẽ: không ghi tệp đợt, không nghe sự kiện cổng nào, không trả lời «cho phép». Răng
    nằm ở `tests/dieu-phoi/kiem-khung.mjs` KH-09.
  - Giới hạn đã khai, là nhãn chứ không phải việc:
    - (1) chưa ai nhìn thấy dải trên app desktop; `plugin test` dựng cây theo bảng phần tử desktop nhưng không chạy
      phần hiển thị.
    - (2) `$.process.run` của mod trên desktop chưa được đo. Nếu nó không chạy, dải ghi «khung: không đọc được đợt»
      và lệnh rơi về đường markdown.

    Đợt đầu tiên của kho tiêu thụ chạy bản này sẽ đọc hai nhãn đó.
- Mỗi lần thức: `node "$GOI/scripts/dieu-phoi.mjs" chay`. Lệnh tự bỏ qua nếu bộ phát lịch còn sống,
  tự chạy lại nếu nó đã chết.
- **Lịch biết tệp** (hồ sơ `ky-den-gop`). Hàng chưa bắt đầu chỉ được giao khi vùng tệp nó khai (`ranh_gioi` trong
  `hang-viec.json`) không trùng tệp của PR đang mở và không trùng `ranh_gioi` của hàng đang dở ở dãy khác (đang làm,
  đã ký chưa gộp, hay đã được chọn làm hàng kế). Trùng một hàng của đợt → máy tự thêm phụ thuộc `sau` (hàng kia gộp
  xong mới bắt đầu), một dòng Nhật ký và một sự kiện `doi-ke-hoach` kiểu `them-sau`; dãy nhận hàng kế không trùng.
  Trùng PR ngoài đợt → hàng được giữ tới khi PR ấy đóng, một sự kiện `trung-tep`. PR của chính dãy không tính là
  trùng. Hàng giao đi mà không khai vùng tệp → một sự kiện `ranh-gioi-vang`, không chặn. Không dò được PR (gh lỗi,
  nhánh từ fork) → một sự kiện `trung-tep-mu`, lịch vẫn so phần hàng của đợt. Hai mẫu glob đều có ký tự đại diện thì
  so phần tĩnh đứng trước ký tự đại diện đầu — dư về phía báo trùng (`a/**/*.ts` và `a/**/*.css` bị coi là trùng).
  Lệnh `hang them <mã|việc> --day <P> [--ranh-gioi <glob,glob>]` so cùng luật lúc gán hàng, đọc tiến độ và bản chụp PR
  mà bộ phát lịch để trong `trang-thai.json` (`nhanh_mo`, tươi tới một phút).
- **Vùng đi từ cắt lượt** (hồ sơ `vung-giao-viec-tu-cat-luot`). Hàng lộ trình mang `vung` — vùng mã dự kiến theo màn,
  do lượt cắt ghi (skill `cat-luot`). Gói khai `nguon_hang` thì hàng thi công không khai `ranh_gioi` nhận `ranh_gioi` =
  `vung` của hàng lộ trình; hàng khai tay giữ nguyên. `hang them <mã>` với mã của một hàng lộ trình mà đợt chưa có
  cũng nhận vùng ấy (`--ranh-gioi` thắng). Lúc trình Cổng Phạm vi, phiên thợ của hàng có vùng chạy
  `hang vung <mã|slug> --vung <glob,glob>`: lệnh GỘP thư mục mã của thiết kế vào `ranh_gioi` (một dòng Nhật ký, một sự
  kiện `doi-ke-hoach` kiểu `vung`), từ chối glob không có thư mục tĩnh (`**`, `*.tsx`) mà không ghi gì; hàng chưa bắt
  đầu ở dãy khác được lịch so lại ở nhịp kế; hàng đang làm hay đã ký ở dãy khác mà chồng → một sự kiện `trung-tep`
  mang `luc: cong-pham-vi` (`can_phan: false`) và một dòng cảnh báo — chỉ báo, không ghi `sau`, không đụng khoá. Lộ
  trình không có `vung` và không ai gọi `hang vung` → lịch y như trước.
- **Lệnh của đợt ghi đúng hàng** (hồ sơ `lenh-dot-ghi-dung-hang`). Đơn xin lượt không cờ đọc hợp đồng các hàng của dãy
  trong worktree mà nhánh chính chưa gộp. `xin s4` lấy slug theo thứ tự `--slug` → hồ sơ đang chấm → hồ sơ đã thông chưa gộp → `tiep`
  (đang chấm = `implemented`, `verified`; đã thông = `signed-off`, `machine-cleared`, `da-cham-boi-thuc-te`); `xin
  ghim-lai` và `xin merge` bỏ bậc đang chấm. Một bậc có từ hai hồ sơ thì lệnh từ chối, in tên từng hồ sơ và lời dặn
  `--slug`, không ghi đơn. `xin duong-nen` giữ lối `tiep` (đường nền chạy trước khi hợp đồng của hàng kế
  có). `hang them` nhận mã hay slug của lộ trình: tra `hang-viec.json` → tệp lộ trình của nguồn hàng theo mã rồi theo
  slug (hàng thêm mang đúng `slug`, `ma` và vùng của hàng ấy) → đối số đã có dạng slug thì giữ nguyên → chỉ câu tự do
  mới suy slug (sáu từ đầu). `hang chay-lai <dãy>` là lệnh ngược của `hang nghi`: gỡ khoá `nghi`, một dòng Nhật ký và
  một sự kiện `doi-ke-hoach` kiểu `chay-lai`; dãy chưa nghỉ thì không làm gì; nhịp kế giao lại hàng kế cho dãy. Bộ phát
  lịch tính hồ sơ `risk_tier: T1` có trên nhánh chính là đã gộp — hồ sơ T1 không qua cổng nên giữ `draft` mãi.
- **Duyệt chạm tệp khi không dò được nhánh mở** → giám sát phán (`can_phan` nêu lỗi), không còn máy duyệt với lý do
  «không nhánh mở nào chạm». Nhánh của chính phiên xin không tính là nhánh đang sửa tệp ấy.
- **Đếm ký → gộp.** Mỗi sự kiện `hang-gop` mang giờ commit chữ ký và giờ commit gộp đọc từ nhánh chính, số lần gộp
  nhánh chính vào nhánh của PR; `dem` in `ky_den_gop` (trung vị, lớn nhất, theo hàng; hàng gộp squash vào
  `chua_do`), `gop_vao_nhanh`, `ghim_lai_sau_ky` (lượt ghim lại được cấp sau giờ ký) và `gop` (lối của lệnh gộp).

## Chặn S4 và việc chờ người

- **Việc nền ngoài dãy giữ khoá** — ví dụ kiểm chéo đêm của kho xin khoá `s4` với phiên riêng (không phải mã một
  dãy), không qua hook `PostToolUse` nên không bao giờ có nhịp phiên: giữ nhịp KHOÁ bằng `chamNhip` của
  `hook-nhip.mjs` (gọi đều tay trong lúc giữ) hoặc chạy qua `giu-nhip.mjs`. Bộ phát lịch coi khoá có nhịp khoá từ
  lúc cấp là còn sống và không báo `khoa-khong-nhip`; thôi chạm nhịp thì hạn thuê thu hồi khoá như mọi khoá. Khoá
  của dãy cũng thế: dãy chờ một lượt dài (đường nền, S4, ghim lại) chạy qua `giu-nhip.mjs` như `LUAT.md` dặn thì
  không bị báo dù phiên không gọi công cụ nào; khoá của dãy không có nhịp phiên lẫn nhịp khoá từ lúc cấp vẫn bị báo.
  Chỉ worktree đang giữ khoá chạm được nhịp khoá của nó.
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
- **Mù — chưa đo: hộp quyền của tác tử Workflow có tới giám sát không.** Hook chờ người nghe sự kiện `Notification`
  (`permission_prompt`) của phiên; hộp quyền bật ra bên trong một tác tử của Workflow (lượt chấm S4 chạy như thế)
  có thể không bắn sự kiện đó ở phiên cha. Chưa đo thì coi là KHÔNG tới: S4 đứng vì hộp quyền có thể không
  có tệp chờ người, giám sát không thức, bảng không hiện. Mọi kho chạy đợt bằng gói **khai trong phần riêng của
  đợt** (`LUAT-rieng.md` khi mở bằng `/dieu-phoi:mo-dot`) một luật: thợ đứng chờ người — kể cả chờ hộp quyền trong
  lượt chấm — thì tự ghi yêu cầu `can-nguoi`, không chỉ hỏi bằng chữ trong hội thoại. Khuôn `LUAT.md` của gói
  chưa mang luật này; kho đã có nó trong luật đợt của mình thì giữ nguyên khi chuyển. Giữ cho tới khi phép đo trả
  «tới». Ngưỡng: đợt thử có ≥ 1 lượt S4 đứng vì
  hộp quyền mà không có tệp chờ người. Phép đo đã soạn ở hạt giống
  `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` (câu 1 §12.3).
- **Một số dạng cú pháp shell làm lệnh S4 thật lọt khoá** (đo lại trên bộ phân loại của bản này, 12/10):
  `--help` nằm trong chú thích `#` (miễn trừ `--help` đọc mọi từ sau tên script), here-string `<<<`,
  `env -S'<lệnh>'` dính liền cờ, `bash -o pipefail -c '…'` (có từ trước DP6). Giá khi lọt: hai S4 chạy chồng
  trên một máy — chậm hơn và dễ chạm trần thời gian, **không sai kết quả** (mỗi lượt chấm vẫn chấm đúng cây của
  nó). Ngược lại `command -v <đường>/repin-lane.mjs` bị chặn nhầm. Heredoc kèm chuyển hướng (`bash <<'EOF' 2>&1 |
  tail`) từng lọt dưới luật «thân là dữ liệu»; luật ấy đã thu lại nên dạng này nay bị chặn. Mỗi mục một dòng ở
  `docs/research/known-limits-ledger.tsv` (hồ sơ `dieu-phoi-lop-mod`, Ngoài-1/2/3/18/27/29).
- Bộ phân loại là bộ đọc cú pháp shell rút gọn: biến mở rộng thành tên script, `eval`, alias, lệnh bọc viết đủ
  đường (`/usr/bin/env -u X …`), cờ gộp (`env -iu X`) và `gtimeout` không được hiểu. Ngưỡng: ≥ 1 lời gọi S4
  thật lọt qua hook trong đợt thử.
- **Nghiệm đúng tầng cho hai mục trên — hạt giống «S4 tự xưng»:** chính `repin-lane.mjs`, `s4-args.mjs` và
  `duong-nen.mjs` tự lấy và kiểm khoá tài nguyên lúc khởi, hook chặn chỉ còn là lưới phụ. Lớp «lệnh S4 lọt qua bộ
  đọc cú pháp» đã đổi da ba lần trong một vòng (vỏ bọc mang cờ → thân heredoc cho trình thông dịch kèm cờ mang giá
  trị → heredoc kèm chuyển hướng), nên vá thêm bộ phân loại là đuổi theo tháp. Ngưỡng mở thành việc: ≥ 1 lượt S4
  thật lọt khoá sau khi DP6 gộp, đếm ở sổ chạy của đợt thử. Hạt giống: mục «S4 tự xưng» của
  `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`.
- Tệp chờ người do hộp xin quyền ghi chỉ gỡ khi người gửi một lời nhắc ở phiên thợ (`UserPromptSubmit`); duyệt
  hộp mà không gõ gì thì tệp ở lại tới lời nhắc kế, nên «việc chờ» có thể còn một mục đã xong. Gỡ theo lời gọi
  công cụ kế tiếp cần biết hộp thuộc tác tử nào — chưa đo (hạt giống, câu 1 §12.3). Ngưỡng: đợt thử có ≥ 1 lần
  giám sát báo chủ kho một việc chờ đã xong.
- Ca kiểm «nguồn» của chín lời gọi thật (`tests/dieu-phoi/rut-lenh-that.mjs`) chỉ chạy trên máy có bản ghi
  hội thoại; nơi khác (CI) in «bỏ qua» — các ca phân loại vẫn chạy trên tệp ca đã commit.

## Phiên thợ trong đợt

**Ghi danh worktree.** Chip của app luôn dựng worktree MỚI tên ngẫu nhiên, nên gói đợt không biết trước worktree của dãy — gói khai chỗ giữ (ví dụ `/CHUA-CO-WORKTREE/P1`). Việc đầu tiên của phiên mở từ chip, trước S1, chạy từ worktree của chip: `node <thư mục đợt>/loi/dieu-phoi.mjs ghi-danh <dãy>` (lời ghi danh của chip mang sẵn dòng lệnh này). Lệnh ghi gốc worktree của phiên vào `day[<dãy>].worktree` của `hang-viec.json`, thêm một dòng Nhật ký và một sự kiện `ghi-danh`; chạy lại thì không làm gì. Lệnh từ chối và không ghi byte nào khi: dãy không có trong đợt · worktree này đã là của dãy khác · cwd là gốc kho chính · không có đợt · dãy còn phiên ở worktree cũ (hành động `khong`, `nhan-giang-lai` hay `cho-nguoi` — đọc cùng hàm với `tiep-tuc`, nên dãy nào được mời chip thì phiên chip ghi danh được). Worktree cũ đã chết thì bị đè: đơn còn chờ của dãy theo sang worktree mới, giữ giờ xin; nhánh cũ còn checkout ở worktree cũ, lệnh in cách gỡ. Lúc mở đợt từ gói, dãy có worktree chưa tồn tại nhận dấu `cho-ghi-danh/<dãy>.json`: `chan-doan` và `tiep-tuc` xếp dãy ấy như dãy không phiên sống (thường `mo-chip`), không `worktree-mat`; đợt mở bằng bản gói cũ không có dấu thì giữ hành vi cũ. Mọi bên viết `hang-viec.json` (ghi danh, `hang day-len|them|nghi|chay-lai|vung`) giữ khoá `hang-viec.khoa` nên tám chip bấm cùng lúc không mất bản ghi.

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
thợ đọc là không tự merge.

**Gộp dưới khoá merge** (hồ sơ `ky-den-gop`): thợ giữ khoá `merge` chạy `node <thư mục đợt>/loi/dieu-phoi.mjs gop <số PR>`.
Lệnh gộp bằng `gh pr merge <n> --merge --match-head-commit <sha>` (không bao giờ `--auto`) khi CI xanh trên đúng đầu
nhánh, hồ sơ trên đầu nhánh đã ký hay đã thông, và (a) nhánh đã chứa đỉnh nhánh chính, hoặc (b) kho bật
`"gop_khong_chay_lai_ci": true` trong `dieu-phoi.config.json` và tệp PR tự thêm (so với merge-base) không giao tệp của
các commit vào nhánh chính kể từ merge-base. Chủ kho chấp nhận rủi ro của (b) ngày 23/10/2026: lỗi lọt qua thì CI trên
nhánh chính sau gộp bắt. Thoát 0 = đã gộp · 4 = trùng tệp, khoá tắt hay CI chưa xanh — gộp nhánh chính vào nhánh, chờ
CI theo lệ của kho, chạy lại · 1 = chặn (PR nháp, hồ sơ chưa ký, không giữ khoá, đợt không cho tự gộp). `gop <n> --xet
--slug <s>` chỉ in quyết định, không gộp, không đòi khoá — cho giám sát và người. Mỗi lần chạy ghi một sự kiện `gop`. Mọi lần thợ ghi vào thư mục đợt (xin lượt, nhả lượt, yêu cầu `can-nguoi`,
`hang-moi`) theo mục «Cách xin tài nguyên» của `LUAT.md` của đợt. Yêu cầu `can-nguoi` chưa trả lời hiện ở danh
sách chờ người của bảng đợt và được lệnh đếm tính một lần.

## Giao tiếp giữa các phiên (lệnh `tin`)

Hồ sơ `vong-mo-co-chu-giu` (GT1). Mỗi yêu cầu giữa các phiên — giám sát với thợ trong đợt, máy với máy trên kênh issue
— là một vòng mở có mã, đi theo thang chín nấc: đã nói · đã tới · đã nghe · đã hiểu · đã đáp · đã hứa · đang làm · đã
giao · người giao chấp nhận. Luật đầy đủ cho phiên thợ nằm ở khối `LUAT-TIN` của `scripts/mau/LUAT.md`.

- Trong đợt: `node <thư mục đợt>/loi/tin.mjs <KHẨU LỆNH> <đích hoặc mã> ["một câu"]`; nơi chứa là `<thư mục đợt>/tin.jsonl`.
  Yêu cầu cũ `yeu-cau/` hiện trên sổ như câu hỏi có mã; tệp của nó không đổi.
- Trên kênh liên máy: mỗi máy chạy một lần `node "$GOI/scripts/tin.mjs" vai --kenh <chủ>/<kho>#<số> --may <tên>` từ
  worktree giữ kênh, rồi thêm `--kenh <chủ>/<kho>#<số>` vào mọi lệnh. Trạng thái nằm ở `.acceptance-runs/tin/` của kho
  (tên máy không vào cấu hình commit). Bộ canh: `tin canh --kenh … [--cho]` — không bắt lại được tin cuối thì thoát 3.
- Đo ngưỡng «mọi yêu cầu có trả lời trỏ về mã»: `tin so --kenh … --tu <ngày> --json` in thẳng phán quyết.
- Hook: phần đưa tin chạy bên trong `hook-nhip` và `hook-cho-nguoi` (không thêm mục hook); khối `Stop` gọi `hook-tin.mjs`.
  Kho không đợt, không kênh thì cả ba im. `tin tat` / `tin bat` tắt hay bật cho một worktree.

Giới hạn đã khai, kèm ngưỡng mở lại:

- **Khớp câu «sẽ giao» với ý định là phán xét của người giao**; máy chỉ đặt hai câu cạnh nhau. Ngưỡng: ≥ 1 ca thợ làm
  lệch ý định mà câu «sẽ giao» đã khai đúng.
- **Chấp nhận bằng im lặng** có thể đóng một vòng người giao chưa đọc kỹ; cửa `MỞ LẠI` 24 giờ. Ngưỡng: ≥ 1 ca phát hiện
  sai sau 24 giờ.
- **Tin tới phiên đang ngủ chỉ đến ở lượt kế của phiên đó.**
- **Nhận biết tác tử con dựa vào khuôn stdin của Claude Code** (trường `agent_id`). Ngưỡng: ≥ 1 ca tin bị đưa vào tác tử con.
- **Hook kênh chỉ thấy tin mới khi đồng bộ được.** Ngưỡng: ≥ 1 ca tin kênh bị sót > 30′ trong khi hook đã báo lỗi kênh.
- **Danh tính máy trên issue tự khai.**
- **Phiên thợ mở bằng chip ngoài đợt chưa được phủ** (chủ kho chọn 18/10, Cổng Phạm vi GT1).

## Chuyển từ bản lõi chép tay trong kho

Kho từng chép lõi vào cây của mình và gắn hook trong `.claude/settings.json` thì trong lúc chuyển hai
bản cùng đọc một thư mục đợt và ra cùng quyết định. `xem` in một dòng cảnh báo khi settings của kho còn
hook gọi bản cũ. `xem --kiem-chuyen` liệt kê mọi chỗ trong kho còn trỏ bản cũ (settings, hook git,
`package.json`, eval của hồ sơ, `LUAT.md` của đợt, và import hay require TƯƠNG ĐỐI trong tệp mã mà đường giải
rơi vào thư mục bản cũ — `../dieu-phoi/dot.mjs` từ một thư mục cạnh nó dưới `scripts/`) và tách hai nhóm:

- **phải sửa** — in từng dòng `kiem-chuyen: <tệp>:<dòng>`; hết dòng phải sửa thì in `kiem-chuyen: sach`. Mã thoát
  0 khi không còn dòng phải sửa, 1 khi còn, 2 khi lỗi.
- **lịch sử** — để nguyên (sửa vật đã ký làm hồ sơ hoá cũ); in ĐÚNG MỘT dòng tổng `kiem-chuyen: lich-su <n> dòng
  — <lớp> <k> · …`, thêm `--chi-tiet` để in từng dòng `kiem-chuyen lich-su: <tệp>:<dòng> · <lớp>`. Bảy lớp, neo vào
  khuôn kit: `khai-boi-kho` (kho tự khai, dưới) · `ho-so` (mọi tệp dưới `_acceptance/<slug>/` trừ `evals.yaml`) ·
  `eval-chet` (dòng trong khối eval `status: not-run`) · `eval-ngoai-lan-may` (khối `judgment`/`ui-check` của hồ sơ
  đã thông — làn ghim lại không chạy chúng) · `executor-chet` (khoá `executors.<nhóm>.<khoá>` mà không eval sống
  nào gọi và `feature_loop.suite_keys` không nêu) · `tai-lieu` (`docs/**`) · `lo-trinh` (`LO-TRINH.html`).

Kho tự khai lịch sử riêng bằng khoá tuỳ chọn `dieu_phoi.lich_su` trong `_acceptance/config.yaml` — danh sách,
mỗi mục là glob đường tệp, hoặc `<đường evals.yaml>#<id>` cho MỘT khối eval sống được miễn (ví dụ eval lấy đường
bản cũ làm tệp mẫu). Vắng khoá thì không khai gì. Hàm `kiemChuyen` (xuất từ `dieu-phoi.mjs`) vẫn trả MỌI dòng như
2.27; `phanLopChuyen` trả hai nhóm.

Thứ tự chuyển, chạy ở quãng lặng (không lượt S4 nào đang chạy):

1. `claude plugin install dieu-phoi@acceptance-gate-kit --scope project` ở cây gốc VÀ mỗi cây phụ có phiên.
   Bộ đệm gói khoá theo số phiên bản: báo «already at latest» mà `claude plugin list --json` vẫn ghi số cũ thì
   `claude plugin uninstall dieu-phoi@acceptance-gate-kit --scope project` rồi cài lại.
2. `node "$GOI/scripts/dieu-phoi.mjs" xem --kiem-chuyen`, rồi gỡ mọi dòng nó in thuộc nhóm **đang chạy**: khối hook
   trong `.claude/settings*.json` gọi bản cũ, hook git, `package.json`, eval của hồ sơ đang mở, `LUAT.md` của đợt
   đang chạy, import tương đối; eval sống của hồ sơ đã ký thì khai «thay bởi» (`status: not-run` +
   `superseded_by`) chứ không sửa thân; sau đó gỡ chính thư mục lõi chép tay của kho (lệnh bỏ qua thư mục bản cũ
   nên không liệt kê nó). Điểm dừng là `kiem-chuyen: sach` (đo trên một kho tiêu thụ thật 12/10: trước khi gỡ 680 dòng, 125 phải
   sửa — gồm 4 dòng import tương đối của một thư mục cạnh lõi cũ và 100 dòng eval sống của 5 hồ sơ đã ký; sau khi gỡ
   690 dòng, 5 phải sửa — eval của chính hồ sơ chuyển và một eval lấy đường cũ làm tệp mẫu, cả năm kho tự khai ở
   `dieu_phoi.lich_su`). Gỡ và cài nằm trong CÙNG một commit để không có khoảng hai bản hook cùng chạy.
3. Kiểm không bắn đôi: khối hook bản cũ mở đầu bằng `[ -f "$CLAUDE_PROJECT_DIR/<thư mục bản cũ>/hook-….mjs" ] ||
   exit 0`, nên nó im hẳn khi thư mục bản cũ đã gỡ. «Không bắn đôi» = `kiem-chuyen` không còn dòng nào ở
   `.claude/settings*.json` + thư mục bản cũ không còn + `xem` không in dòng cảnh báo hook bản cũ. Trong khoảng đã cài gói mà chưa gỡ, mỗi `Notification` chạy hai bản
   `hook-cho-nguoi` ghi đè cùng tệp `cho-nguoi/<dãy>.json` (bộ phát lịch có thể đếm hai lần chờ người) — vì vậy
   gỡ và cài cùng một commit.
4. Khai luật «thợ chờ người thì ghi `can-nguoi`» trong phần riêng của đợt — xem giới hạn «Mù» ở trên.

## Đóng đợt

`node "$GOI/scripts/dieu-phoi.mjs" dong`, sau khi owner duyệt thẻ đóng đợt. Lệnh dừng bộ phát lịch và
gỡ symlink, nên hook im. Sau đó: xoá task lịch, lưu trữ phiên thợ, dọn worktree đã gộp (kiểm
`git status --porcelain` trước), viết báo cáo đợt.

## Đường lùi

`dieu-phoi.mjs dong` là đủ. `LUAT.md` và `khoa/` vẫn dùng tay được theo cách ngày 04/10.
