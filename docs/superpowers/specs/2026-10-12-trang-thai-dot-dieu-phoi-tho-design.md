# Trạng thái đợt Điều phối – Thợ hiện ngay trong app (DP6b) — thiết kế

Hồ sơ: `_acceptance/trang-thai-dot-dieu-phoi-tho/` · hàng lộ trình DP6b (mốc 01/11, không cắt số) · Cổng Đáng ký
12/10 (manh: «làm · ngưỡng như ô · mod chỉ vẽ»). Đầu vào: hạt giống
`docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` (ba lời hứa + răng), spec workflow
`docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` §12.2 hàng «Khung trạng thái đợt», §13 hàng «Đang chạy
— xem», §16 T8. Khung mod của DP4 (`_acceptance/dieu-phoi-doi-tai-khoan`) và lõi DP6 (`_acceptance/dieu-phoi-lop-mod`)
đã ở `main` (f59d9547).

## 1. Ý định (chốt ở Cổng Đáng, không đổi trong vòng)

Chủ kho thấy đợt đang ở đâu mà không phải hỏi phiên giám sát, mở `bang.html` hay dò nhật ký. Đợt crm 04/10: 20/33 tin
chủ kho gửi điều phối là hỏi trạng thái. Chính sách: **mod chỉ vẽ** — chỉ đọc qua CLI, không ghi tệp đợt, không bao
giờ cho phép một lời gọi công cụ; nghi ngờ thì không vẽ; «chưa nhìn thấy dải trên desktop» là NHÃN trên thẻ, reality
(đợt crm đầu tiên) đọc nó.

## 2. Ba đơn vị

```
 phiên (desktop/terminal)                       gói dieu-phoi
 ┌──────────────────────────┐   $.process.run   ┌──────────────────────────────┐
 │ hooks/mod/khung.ts        │ ───────────────▶ │ scripts/dieu-phoi.mjs xem --json│
 │  session.start → hẹn giờ  │ ◀─── JSON ────── │   xemJson(cwd) ─┐               │
 │  ui.render AbovePrompt    │                  │ scripts/mo-hinh.mjs moHinh ◀───┘│
 │  ui.render Pane           │  import thuần    │   veXem (đã có)  chuXem (mới)    │
 │  command.run dieu-phoi:xem│ ───────────────▶ │ scripts/khung.mjs veDai (mới)    │
 └──────────────────────────┘                  └──────────────────────────────┘
```

### 2.1 CLI `xem --json` (lời hứa 1)

Hàm mới `xemJson(cwd)` trong `dieu-phoi.mjs`, MỘT dòng JSON ra stdout, thoát 0 ở mọi ca có thể trả lời:

| Ca | Đầu ra |
|---|---|
| Không có đợt (không symlink `dieu-phoi-hien-tai`, hoặc cwd không thuộc kho git) | `{"dot":null}` |
| Có đợt, chưa có `trang-thai.json` | `{"dot":<tên từ hang-viec.json>,"pha":<pha>,"chua_co_nhip":true,"day_cua_cwd":…,"canh_bao":…,"mui_gio_phut":…}` |
| Có đợt, có nhịp | mọi khoá của `moHinh(tt, {nhom, hangViec})` (cùng tham số `xem` dùng) + `day_cua_cwd`, `canh_bao`, `mui_gio_phut` |

- `day_cua_cwd` = `phienCuaCwd(hang-viec, cwd)` — CÙNG hàm hai hook và `tho` dùng (dãy có worktree chứa cwd), `null`
  ở gốc kho hay worktree ngoài dãy.
- `canh_bao` = `canhBaoHaiBan(gốc kho)` (chuỗi hoặc `null`) — cùng dòng cảnh báo `xem` thường in.
- `mui_gio_phut` = `-new Date().getTimezoneOffset()` của tiến trình CLI: mod chạy trong môi trường không Node, nên giờ
  `HH:MM` của hạn khoá tính bằng độ lệch máy báo, không đoán múi giờ của môi trường mod.
- Tệp đợt hỏng (JSON không đọc được) → thoát 1, stderr `dieu-phoi: …` như mọi lệnh con; mod coi đó là lỗi đọc.

`xem` không cờ KHÔNG đổi một byte (stdout, stderr, mã thoát) — hàm `xem(cwd)` giữ nguyên, kể cả dòng
`else dong = veXem(moHinh(…` mà ca đỏ DP2-01-do của hồ sơ đã ký tiêm vào. `xemJson` là hàm riêng dùng chung `moHinh`,
`phienCuaCwd`, `canhBaoHaiBan`, `docNhomKeHoach` — không chép logic.

### 2.2 Hàm vẽ thuần `scripts/khung.mjs` và `chuXem` (một mô hình, bốn bề mặt)

`khung.mjs` KHÔNG import gì (module mod chỉ nhận tệp tương đối và `claude-code`; `validate` đã từ chối
`phan-loai-s4.mjs` vì `node:path`). Xuất:

- `veDai(kq, { cot })` → chuỗi một dòng hoặc `null`:
  - `kq.dot === null` → `null` (dải im).
  - `kq.loi` → `khung: không đọc được đợt`.
  - chưa có nhịp → `Đợt <tên> · <pha> · chưa có nhịp`.
  - có nhịp → `Đợt <tên> · <pha> · S4: <phiên> → HH:MM · chờ lượt <n> · cần anh <n>`; khoá `s4` trống →
    `S4: trống`; `cho_may` có giá trị → `S4: chờ khoá máy`.
    - `chờ lượt` = số đơn trong `hang_cho`; `cần anh` = số mục `cho_nguoi` + 1 nếu `can_nguoi` có giá trị (cả hai
      đều là việc chờ chủ kho).
    - `day_cua_cwd` có giá trị → nối ` · Dãy <id>: <hàng ?? —> · <tiến độ ?? —>` của dãy đó trong `day`.
    - `giam_tai` → chuỗi mở đầu `GIẢM TẢI · `.
  - `cot` (= `bodyColumns` của dải) → chuỗi dài hơn bị cắt còn `cot` ký tự, ký tự cuối là `…`.
- `CHU_KY_MS = { co_dot: 20000, khong_dot: 120000 }` và `chuKy(kq)` — nhịp làm mới (§2.3).

`chuXem(kq)` (mới, trong `mo-hinh.mjs` cạnh `veXem`) → đúng chữ `xem` thường in cho cùng trạng thái:
`không có đợt nào đang chạy` · `chưa có nhịp nào · pha <pha>` · `veXem(kq)`; thêm dòng `canh_bao` khi có.
Pane và câu trả lời `/dieu-phoi:xem` đều là `chuXem`. Không ai viết lại chữ của `xem` lần thứ hai.

### 2.3 Phần mod `hooks/mod/khung.ts` → `dangKyKhung(on)` (lời hứa 2, 3)

`register.ts` thêm đúng một dòng `dangKyKhung(on)`; bảng `MOD-SU-KIEN` thêm một dòng cho `./mod/khung.ts`.

- **Đọc.** `docDot($)` gọi `$.process.run(['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'xem', '--json'],
  { cwd: await $.session.cwd(), timeoutMs: 10000 })`.
  - Thoát 0 và stdout là JSON → lưu `{ kq, loi: null }`.
  - Thoát khác 0, JSON hỏng hay `run` ném lỗi → lưu `{ kq: null, loi: <một dòng> }`.
  - Lưu vào `$.state` (atom `{ plugin: 'dieu-phoi', key: 'khung' }`, khế ước kiểu ở `dieu-phoi/types/index.d.ts`,
    `plugin.json` khai `"types"`). Bản vẽ đọc atom nên tự vẽ lại khi giá trị đổi.
- **Nhịp.**
  - `session.start` KHÔNG chờ lần đọc: hẹn `$.clock.after(1, nhip)` rồi trả `next(e)`, nên lời gọi CLI không làm chậm
    lượt đầu.
  - `nhip` đọc xong thì hẹn lần kế sau `chuKy(kq)`: 20″ khi có đợt (kể cả khi đọc lỗi), 120″ khi `{"dot":null}`.
  - Nạp lại mod thì hẹn giờ cũ mất và `session.start` chạy lại (tài liệu kiểu 2.1.295).
- **Dải.** `ui.render` `{ component: 'AbovePrompt' }`:
  - `hasSurvey`, chưa có lần đọc nào, hay `veDai` trả `null` → `next(e)` (không vẽ gì).
  - Ngược lại vẽ `Box` gồm `Text` = `veDai(kq, { cot: bodyColumns − 8 })` và `Button` khoá `xem`, nhãn `xem`.
  - Bấm nút thì gọi `$.ui.open({ id: 'dieu-phoi-dot', title: 'Đợt <tên>' })`. Bấm là «được hỏi», nên pane đặt ở mọi
    bề rộng.
- **Pane.** `ui.render` `{ component: 'Pane', requestId: 'dieu-phoi-dot' }`: một `Text` cho mỗi dòng của `chuXem(kq)`.
  - Khi có lỗi đọc, pane vẽ dòng `khung: không đọc được đợt` kèm lý do.
  - Chưa có lần đọc nào → `đang đọc đợt…`.
  - Mod không bao giờ mở pane khi không ai hỏi.
- **Lệnh.** `command.run` `{ command: 'dieu-phoi:xem' }`:
  - Đọc CLI ngay (không dùng bản đã lưu), cập nhật atom, mở pane, rồi trả `{ text: chuXem(kq) }`. Hook không đọc
    `next`, nên lệnh markdown không chạy và không có lượt model.
  - Lời gọi CLI lỗi → hook NÉM lỗi. Engine bỏ qua hook hỏng và chạy lệnh markdown `commands/xem.md` như cũ (tài liệu
    kiểu: «A hook that fails is skipped»). Đường cũ vì thế là đường lùi, không phải nhánh code thứ hai.
  - Đã đo trên engine thật 2.1.295 (thăm dò vứt đi 12/10, §6): hook trên tên lệnh markdown của gói trả lời với
    `num_turns: 0` và `total_cost_usd: 0`. Kết quả hiện là `dieu-phoi: <text>`.

Sự kiện phần này nghe: `session.start`, `ui.render`, `command.run` (cộng `ui.press` nếu `validate` báo nút bấm là
một sự kiện của module — bảng khai ĐÚNG tập `validate` thấy, răng DP4-13 so bằng nhau). Không `tool.call`,
`tool.check`, `classic.*`, `prompt.*`.

### 2.4 Răng an toàn (tổng quát hoá răng T11 của DP4)

`mod-luat.mjs` hôm nay chỉ cấm sự kiện cổng cho riêng dòng `doc-muc-dung.ts`. Đổi thành: **không dòng nào của bảng
`MOD-SU-KIEN` được chứa sự kiện trong `SU_KIEN_CONG`**. Lỗi ghi tên tệp phần và sự kiện. Cộng một răng mới đọc từ
`validate --strict --json`: tập `gatingHooks` của gói BẰNG đúng `[command.run{command=dieu-phoi:xem}]`, ghi nhận theo
khoá `hook`. Hook trả lời lệnh của gói là cổng duy nhất được phép có. Hook này cố ý KHÔNG có `.catch` (`hasCatch:
false`): hook hỏng phải được engine bỏ qua để lệnh markdown chạy. Phần sau này thêm một cổng (`prompt.submit`,
`tool.call`…) thì răng đỏ, nêu hook.

Nửa «chỉ đọc» của chính sách cũng có răng, không chỉ nửa «không cho phép»:
- dòng `calls:` mà `validate` báo cho module không được chứa lời gọi ghi hay gửi nào (`$.fs.write`, `$.fs.remove`,
  `$.store.set`, `$.session.send`, `$.session.append`, `$.prompt.submit`, `$.tool.*`, `$.command.run`);
- mọi argv viết thẳng của `$.process.run` trong `khung.ts` phải kết thúc bằng `'xem', '--json'`, tức không gọi lệnh
  con nào làm đổi trạng thái đợt.

## 3. Đo — mỗi phép đo có chiều đỏ trên cùng fixture

| Đơn vị | Thước | Chiều đỏ ghim thông điệp |
|---|---|---|
| CLI `xem --json` | node test trong kho thử có đợt dựng bằng CLI thật, `trang-thai.json` chép từ `tests/dieu-phoi/fixtures/dot-crm-0910`; so bằng nhau với `moHinh` tính trên CÙNG tệp + ba khoá thêm | bản sao bỏ `day_cua_cwd` / trả `{}` khi không đợt → ca nêu khoá thiếu |
| `xem` không đổi | so stdout/stderr/mã thoát của `xem` HEAD với `xem` của commit cố định f59d9547 (`git archive`, trọn thư mục `dieu-phoi`) trên ma trận 4 trạng thái | bản sao đổi một chữ trong `veXem` → ca nêu trạng thái lệch |
| `veDai` / `chuXem` | ma trận viết sẵn, số assert = số hàng; hai hàng có độ lệch múi giờ khác `TZ` của tiến trình test. Round-trip DẢI: đầu vào là JSON.parse(stdout THẬT của `xem --json`) ở năm trạng thái kho thử, so bằng nhau với dòng TRỌN viết tay từ fixture (đếm tay 8 đơn chờ). Round-trip `chuXem` == stdout của `xem` | bản sao bỏ nhánh giảm tải · đếm chờ lượt từ khoá khác · tính giờ bằng giờ máy → hàng nêu tên đỏ |
| mod (dải, pane, nhịp, lệnh) | `claude plugin test` trên bản sao gói, chạy cả bảng phần tử `terminal` lẫn `desktop`; `process.run` trả stdout THẬT của `xem --json` sinh trong cùng lượt (round-trip CLI → mod); đồng hồ giả | bản sao đổi `chuKy` / bỏ `next(e)` khi không đợt → ca nêu tên |
| lệnh qua engine thật | `claude -p "/dieu-phoi:xem" --plugin-dir <bản sao gói> --output-format json` trong kho thử, môi trường cô lập (bỏ mọi `CLAUDE_*`/`ANTHROPIC_*`, `CLAUDE_CONFIG_DIR` tạm, khoá API giả, `ANTHROPIC_BASE_URL=http://127.0.0.1:9`). Đường tới model chết nên mọi lần gọi model đều lộ thành `api_error`, cả hai chiều không tốn token và không chạm tài khoản. Hàng đường lùi: gói CÓ mod, CLI lỗi → engine bỏ qua hook, lệnh markdown chạy | bản sao đổi matcher lệnh, và bản sao gỡ `modules` (phiên không mod) → `terminal_reason: api_error`: lệnh markdown chạy như cũ và đi tới model |
| răng | `kiemKhungMod` + `gatingHooks` và `calls` của `validate` + argv viết thẳng | năm mutant: dòng bảng có `tool.call` · thêm hook `prompt.submit` · nhánh trả `allow` · thêm `$.fs.write` · argv lệnh con `pha` |

Máy không có Claude Code ≥ 2.1.287 có `plugin test` → FAIL nêu đúng điều đó, không bao giờ xanh khi chưa chạy (cùng
luật `kiem-mod.mjs`). CI của kit không có Claude Code: hai thước mod và engine chạy ở lượt chấm trên máy.

## 4. Giới hạn đã khai (nhãn, không phải việc)

- **Chưa nhìn thấy dải trên desktop.** `plugin test` dựng cây theo bảng phần tử của từng bề mặt, nhưng không chạy
  phần sơn của bề mặt. Engine thật chỉ đo được ở chế độ không giao diện, nơi không có dải. Reality đọc nhãn này ở
  đợt crm đầu tiên: ngưỡng «dải hiện ở mọi phiên desktop».
- **`$.process.run` trên desktop chưa đo** (giả định 2 của ô). Nếu nó không chạy, dải ghi đúng «khung: không đọc
  được đợt», còn lệnh rơi về đường markdown cũ. Mod không vẽ sai, chỉ không vẽ. Nhánh dự phòng (mod đọc tệp đợt
  bằng `$.fs` rồi gọi `moHinh`) để Later, ngưỡng: đợt crm đầu tiên thấy dải báo lỗi đọc trên desktop.
- AbovePrompt chỉ có ở terminal và desktop (tài liệu kiểu D10253). Ở VS Code và mobile chỉ có lệnh và pane.

## 5. Lựa chọn đã loại

- **Lệnh mod riêng `/dot`** (đăng ký qua `$.command.register`, «answers its own command», không phải cổng). Đã loại:
  thêm một tên lệnh thứ hai cho cùng việc. Thăm dò cho thấy hook trên `dieu-phoi:xem` chạy được, và hook hỏng thì lùi
  về lệnh markdown, an toàn hơn một lệnh mod chết im.
- **Mod đọc thẳng tệp đợt bằng `$.fs`.** Đã loại làm đường chính: phải chép luật «thư mục đợt là đâu» (symlink, gốc
  kho chính qua `git rev-parse --git-common-dir`) vào môi trường không Node, thành hai bên đọc trôi nhau. CLI là MỘT
  bên đọc.
- **`$.clock.every(20000)` cố định.** Đã loại: kho không có đợt sẽ gọi node mỗi 20″ ở mọi phiên. `after` nối chuỗi
  cho đổi chu kỳ theo kết quả lần đọc.
- **Hỏi lại chủ kho về chữ trên dải.** Không hỏi: khuôn dải đã ở hạt giống và spec §12.2 mà chủ kho đồng ý đưa vào
  10/10. Đổi chữ sau này rẻ, chỉ sửa một hàm thuần.

## 6. Thăm dò engine thật (12/10, vứt đi, trong scratchpad phiên)

- **Gói thăm dò.** Tên `dieu-phoi`, gồm `commands/xem.md` cộng một module `command.run { command: 'dieu-phoi:xem' }`
  gọi `$.process.run(['node','-e',…])`.
- **`validate --strict` 2.1.295.** Báo `gating hook without .catch: command.run{command=dieu-phoi:xem}` và
  `calls: $.process.run`.
- **`claude -p "/dieu-phoi:xem" --plugin-dir …`.**
  - Chiều xanh: `num_turns 0`, `total_cost_usd 0`, `result: "dieu-phoi: PROBE-OK 0 tu-cli"`.
  - Cùng lệnh với `ANTHROPIC_BASE_URL` chết: vẫn xanh, chạy dưới 1 giây.
  - Bản sao matcher `dieu-phoi:xem2`: thoát 1, `terminal_reason: api_error`.

  Kết luận: giả định 3 của ô đúng trên engine thật; `$.process.run` chạy được ở chế độ không giao diện.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: mở phiên trong kho có đợt → dải hiện trên ô nhập sau lần đọc đầu (≤ 1 nhịp) → bấm `xem` → pane chi tiết
  (điểm ra: Esc / dấu đóng của engine)
- Biên: kho không đợt → không có dải; đợt chưa có nhịp → dải «chưa có nhịp»; phiên thợ → dải thêm dãy của mình
- Lỗi & quay lại: CLI lỗi → dải «khung: không đọc được đợt», nhịp kế tự thử lại; `/dieu-phoi:xem` khi mod lỗi → lệnh
  markdown cũ trả lời (qua model)

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Dải trên ô nhập | Nói đợt đang ở đâu trong một dòng | tự hiện khi có đợt / nút `xem` → pane |
| Pane «Đợt <tên>» | Toàn văn `xem`: khoá, dãy, chờ người | nút `xem` hay `/dieu-phoi:xem` / Esc |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-dai-khong-dot | Dải | không vẽ gì (engine giữ chỗ trống) | — |
| ST-dai-chua-nhip | Dải | `Đợt <tên> · <pha> · chưa có nhịp` | chờ nhịp đầu |
| ST-dai-dang-chay | Dải | `Đợt <tên> · <pha> · S4: <phiên> → HH:MM · chờ lượt <n> · cần anh <n>` + nút `xem` | bấm `xem` khi `cần anh` > 0 |
| ST-dai-tho | Dải | như trên + ` · Dãy <id>: <hàng> · <tiến độ>` | — |
| ST-dai-giam-tai | Dải | mở đầu `GIẢM TẢI · ` | mở pane xem lý do |
| ST-dai-loi | Dải | `khung: không đọc được đợt` | chờ nhịp kế; vẫn còn `/dieu-phoi:xem` |
| ST-pane-dang-doc | Pane | `đang đọc đợt…` | chờ |
| ST-pane-du | Pane | các dòng của `xem` | Esc |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Dải luôn một dòng, cắt theo `bodyColumns` với `…` ở cuối; nút `xem` không có phím tắt riêng (engine cấp ctrl+x tab
  vào dải).
- Làm mới 20″ khi có đợt, 120″ khi không; `/dieu-phoi:xem` luôn đọc mới.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| `Box`/`Text`/`Button` của bảng phần tử engine | dùng | chỉ phần tử engine vẽ được ở AbovePrompt/Pane |
| `veXem` (`mo-hinh.mjs`) | dùng | chữ của pane = chữ của `xem` |
| `veDai`, `chuXem` | tạo | hàm thuần, một nguồn cho dải và lệnh |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: bảng-điều-khiển (dashboard-first)
Căn cứ: luồng hiển nhiên, một khuôn khả dĩ: một chỉ báo trạng thái thường trực, bấm thì mở chi tiết. Đây là hình
dạng của mục thanh trạng thái VS Code (chữ ngắn kèm lệnh mở chi tiết) và dòng trạng thái tmux (làm mới theo chu kỳ).
Không tra thêm.
<!-- UX-SPEC-TEMPLATE>>> -->
