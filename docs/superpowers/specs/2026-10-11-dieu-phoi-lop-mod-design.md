# Lớp mod của gói `dieu-phoi` (DP6) — design

Gốc: hàng DP6 `dieu-phoi-lop-mod` trong [`docs/plans/lo-trinh-kit.json`](../../plans/lo-trinh-kit.json), dưới
Cổng Đáng của ô dù [`dieu-phoi-tho-trong-kit`](../../../_acceptance/dieu-phoi-tho-trong-kit/opportunity.md)
(build 09/10, timebox 07/11). Thiết kế chung đã duyệt 10/10:
[spec workflow §12](2026-10-10-dieu-phoi-workflow-design.md) (bảng việc của mod) và §12.3 (bốn câu chưa kiểm).
Hồ sơ: `_acceptance/dieu-phoi-lop-mod/`.

## 1. Ý định

Câu giao của hàng, nguyên văn: «Trạng thái đợt hiện ngay trong app; S4 bị chặn đúng lệnh, không chặn nhầm
lệnh chỉ đọc; thợ chờ người thì giám sát biết ngay, không phải dò nhật ký».

Ba lời hứa, và người hưởng:

| # | Lời hứa | Người hưởng | Ca gốc |
|---|---|---|---|
| H1 | Trạng thái đợt hiện ngay trong app, không mở `bang.html`, không hỏi giám sát, không tốn lượt model | Chủ kho (nhìn), phiên giám sát (đỡ một lượt mỗi lần hỏi) | Hôm nay muốn biết đợt ở đâu thì phải hỏi giám sát hoặc mở `bang.html` |
| H2 | S4 bị chặn đúng lệnh, không chặn nhầm lệnh chỉ đọc | Phiên thợ (không bị chặn oan), cả đợt (không hai S4 chồng) | crm 10/10: hook so chuỗi con chặn nhầm một lệnh chỉ đọc của giám sát |
| H3 | Thợ chờ người thì giám sát biết ngay, không phải dò nhật ký | Chủ kho (không lỡ hàng giờ), phiên giám sát | Đêm 09–10/10: S4 của K3b đứng 2 giờ 30 vì hộp duyệt quyền, không ai biết; luật 52 bắt giám sát so `journal.jsonl` |

Luật cứng từ spec §12.1 và lời giao: mod KHÔNG BAO GIỜ trả «cho phép»; hook chặn S4 không nhường cho mod;
chặn S4 không hỏi người. Chia việc với DP4: DP4 dựng khung mod (mục `modules` của gói, tệp đăng ký) và răng
an toàn T11; DP6 nối vào khung đó, không dựng khung thứ hai, và S3 của DP6 chỉ bắt đầu sau khi DP4 gộp.

## 2. Số đo trước khi thiết kế (11/10, máy M5, chỉ đọc)

### 2.1 Bộ phân loại S4 trên lệnh thật

Script `do-phan-loai.mjs` (scratchpad của phiên, sẽ vào `tests/dieu-phoi/` ở S3) chạy
`dieu-phoi/scripts/phan-loai-s4.mjs` của main `68951cef` qua mọi lời gọi công cụ trong 530 bản ghi hội thoại
ở `~/.claude/projects/`: **46.801 lệnh Bash, 340 lời gọi Workflow**.

- 418 lệnh Bash được phân loại là giữ tài nguyên (406 `s4`, 12 `duong-nen`). Phần lớn là lần chạy thật:
  `s4-args.mjs --out …` (154), `repin-lane.mjs … --write` (133), `duong-nen.mjs` (12).
- **Bỏ lọt — lần chạy thật không bị nhận ra (3 lệnh, 2 hình):**
  - `timeout 900 node …/repin-lane.mjs --root . --slug …` (2 lần, crm). `timeout` không có trong bảng vỏ bọc.
  - `env -u UV_PYTHON CLAUDE_PLUGIN_ROOT=$FL node $FL/scripts/repin-lane.mjs …` (1 lần, OneFlow). `env -u` nhận
    một giá trị ở từ kế; bộ phân loại coi `UV_PYTHON` là tên lệnh.
  - Cùng lớp, suy từ mã (không có trong bản ghi): `nice -n 10 node …` và `time -p node …` — `nice` và `time` có
    trong bảng vỏ bọc nhưng cờ của chúng thì không.
- **Chặn nhầm — lệnh chỉ đọc bị coi là S4 (3 lệnh, 2 hình):** `node --check feature-loop/scripts/repin-lane.mjs`
  (1 — kiểm cú pháp, không chạy script), `node …/s4-args.mjs --help` (2).
- 340 lời gọi Workflow: 179 `acceptance-verify.js`, phần còn lại là bản sao bọc args (`s4-dp2-r1.js`…).
  `laS4Workflow` đọc `meta.name` trong đầu tệp lúc gọi nên nhận được bản sao; không đo lại được vì nhiều bản
  sao đã bị dọn.

Kết luận: bộ phân loại theo cấu trúc (DP1 AC-10) đúng hướng nhưng vừa mở (vỏ bọc mang cờ) vừa đóng (cờ chỉ
đọc của node, `--help`). Sửa ở MỘT hàm, hook tự hưởng.

### 2.2 Đường «thợ chờ người → giám sát» hôm nay

Đọc mã của DP1–DP3 (nhánh DP3 `c0ab87b1`):

1. `hook-cho-nguoi.mjs` ghi `cho-nguoi/<dãy>.json` khi `Notification` mang `idle_prompt` hoặc
   `permission_prompt` — **nhưng trả `cho-luot` / `cho-tra-loi` và KHÔNG ghi gì khi dãy còn đơn `xin/` hoặc còn
   yêu cầu chưa trả lời**, cho cả hộp xin quyền. Một thợ đang chờ khoá mà lệnh nền chờ của nó bật hộp xin quyền
   thì đứng mãi, im lặng.
2. Bộ phát lịch thấy tệp mới thì ghi sự kiện `{loai: 'cho-nguoi', phien, hang}` — **không mang `can_phan`**
   (`phat-lich.mjs`, `suKienDem`, dựng cho lệnh đếm T14).
3. Monitor của giám sát (thân `/dieu-phoi:tiep-tuc`) lọc đúng `"can_phan":true`. Vậy **giám sát không bao giờ
   thức vì một thợ chờ người**; nó chỉ thấy khi thức vì việc khác, hoặc khi lịch 30′ của DP3 thấy giám sát đã
   ngủ quá 40′ (`danh-thuc`). Quãng lỡ có trần khoảng 70′ khi Monitor còn sống, không trần khi lịch chưa dựng.

Kết luận: H3 gãy ở hai chỗ trong lõi Node, không ở chỗ thiếu mod.

### 2.3 Bản Claude Code trên máy

- `claude` trên PATH là **2.1.281** (`~/.local/share/claude/versions/2.1.281`): chưa có mod. App desktop chạy
  **2.1.295** (`~/Library/Application Support/Claude/claude-code/2.1.295/<mã>/claude.app/Contents/MacOS/claude`),
  có `claude plugin test` và `validate` hiểu `modules`. Mod cần app ≥ 2.1.286 hoặc CLI ≥ 2.1.287 (spec §12).
- Hệ quả: kho tiêu thụ và phiên CLI cũ không có mod. **Hook thường phải tự đủ** cho mọi việc an toàn và mọi
  việc báo tin; mod chỉ thêm phần nhìn.
- `tests/dieu-phoi/kiem-validate.mjs` gọi `claude` trên PATH, nên hôm nay không kiểm được `modules` (đã báo DP4,
  chủ răng T11).

### 2.4 Kiểm tĩnh bằng `validate --strict` 2.1.295 (bản sao trong scratchpad, không nạp vào phiên nào)

- `hooks.json` khai CÙNG LÚC `hooks` (lệnh thường) và `modules` → validate qua.
- Module chỉ import được tệp tương đối và `"claude-code"`. `phan-loai-s4.mjs` (import `node:path`) bị từ chối:
  «cannot import "node:path" … a hooks module imports its own files by relative path and "claude-code", nothing
  else». `mo-hinh.mjs` (thuần) thì qua.
- `validate --json` liệt kê theo từng module: «hooks: …», «gating hook without .catch: …», «calls: …» — răng đọc
  được tập sự kiện một mod nghe mà không phải tự phân tích TypeScript.

### 2.5 Bốn câu §12.3 — tài liệu kiểu 2.1.295 trả tới đâu

Nguồn: `claude-code.d.ts` và `reference.md` của skill `plugin-authoring` 2.1.295 (D = số dòng d.ts, R = reference).
[K] tài liệu khẳng định · [S] suy luận · [Đ] phải đo sống.

| # | Câu | Tài liệu nói | Còn phải đo |
|---|---|---|---|
| 1 | Mod có nhận `tool.call` và hộp duyệt quyền của tác tử con trong Workflow không? | Tác tử con gọi công cụ thì mod nhận `tool.call` riêng, có `agentId` [K] (D12653-60, D12755-56). Tác tử Workflow «carry ids no list names» (D199-200) [S: có `agentId`]. Hộp duyệt quyền do engine tự vẽ, mod chỉ thêm dòng bằng `$.ui.notice` [K] (D9356-57). `classic.PermissionRequest` có `agent_id` khi bắn từ tác tử con [K] (D835-38) | Hộp quyền của tác tử **Workflow** có bắn `classic.Notification permission_prompt` / `classic.PermissionRequest` ở phiên cha không [Đ] — quyết định H3 có phủ ca K3b hay phải khai giới hạn |
| 2 | Khung mod có hiện ở phiên mở từ chip, bề rộng nào? | `AbovePrompt` chỉ ở bề mặt terminal và desktop [K] (D10253); `Pane` bắn trên mọi bề mặt (D10310); pane mở «không được hỏi» (timer, `session.start`) chỉ đặt từ 144 cột terminal, mở «được hỏi» (lệnh người gõ, nút người bấm) thì đặt ở mọi bề rộng [K] (D14118-28) | Ngưỡng 144 có áp cho desktop không; phiên mở từ chip có nạp mod không [Đ] |
| 3 | `session.send` có tới khi phiên nhận đang giữa lượt không? | «Delivered» = đã xếp vào hàng của bên nhận, chưa ai đọc; bên nhận có thể giữ cho người [K] (D11612-16). Tin của phiên khác tới «as a turn of its own or delivered into a running one» [K] (D8897-901). Đo phụ 11/10: tin liên phiên của app gửi tới phiên DP4 đang giữa lượt trả `queued` | Không cần cho thiết kế này (§3, N3) |
| 4 | Mod ở giám sát có tự đánh thức phiên đó (thay Monitor) không? | Có: `$.prompt.submit` xếp một prompt thành lượt riêng khi phiên rảnh, «so background work can wake a quiet session» [K] (R158-163, D2936-42); hẹn giờ bằng `$.clock` [K] | Có chạy trên phiên desktop không [Đ] |

Phần [Đ] đo bằng một mod thăm dò chỉ quan sát, xin ở Cổng Phạm vi (§6).

## 3. Nguyên tắc thiết kế — chốt từ số đo

- **N1. Mod chỉ làm điều chỉ mod làm được:** vẽ trong app, và trả lời một lệnh mà không qua model. Mọi việc
  hook thường làm được thì ở hook. Lý do: §2.3 — mod vắng ở CLI cũ; và §12.1 — hook không bao giờ nhường.
- **N2. Mod của DP6 không nghe sự kiện nào gác cổng công cụ hay quyền** (`tool.call`, `tool.check`,
  `classic.PreToolUse`, `classic.PermissionRequest`). «Không bao giờ cho phép» khi ấy thoả theo cấu trúc: không
  có hook thì không có nhánh nào trả lời được. Răng đọc từ `validate --json` (§2.4), bổ sung — không thay — răng
  T11 của DP4.
- **N3. Mod không đọc tệp đợt trực tiếp và không ghi gì.** Mọi số liệu nó vẽ đến từ CLI
  `dieu-phoi.mjs xem --json`, tức CÙNG hàm `moHinh` của `xem` và `bang.html` (spec §16 T8: ba bề mặt đợt vẽ từ
  một hàm).

### 3.1 Chỗ đi lệch spec §12.2 — ghi sổ, cửa veto mở

| Spec §12.2 nói | DP6 làm | Vì sao |
|---|---|---|
| Mod nghe `tool.call` của Workflow và Bash, phân loại, không có lượt thì ghi đơn `xin/` rồi trả `deny` | **Mod không chặn S4.** Hook giữ nguyên vai chặn; DP6 sửa bộ phân loại (§2.1) và lời chặn nêu đúng lệnh CLI xin lượt | Mod nằm TRÊN hook thường trong chuỗi `tool.call` (R81: `$.tool.call` raise `classic.PreToolUse` dưới mọi hook của plugin), cùng một hàm phân loại → cùng quyết định; thêm nhánh chặn thứ hai chỉ thêm một bề mặt có thể trả lời sai. Tự ghi đơn `xin/` khi chặn sẽ khuếch đại mọi lần phân loại sai thành một lượt khoá bị cấp oan; khối «Trong đợt» của DP7 đã dạy thợ xin lượt bằng CLI trước S4 |
| Mod nghe `PermissionRequest` và `turn.complete` ở phiên thợ, ghi `cho-nguoi/`, báo giám sát bằng `session.send` | **H3 sửa ở lõi Node:** hộp xin quyền không bao giờ bị nuốt; sự kiện `cho-nguoi` mang `can_phan` nên Monitor thức | Hai chỗ gãy đo được ở §2.2 đều trong lõi; sửa ở đó thì kho CLI cũ cũng hưởng. `session.send` cần địa chỉ phiên giám sát mà mod không có cách đối chiếu tin cậy với `vai.json` |
| Mod ở giám sát có thể thay Monitor (§12.3 câu 4) | **Đo, không dựng.** Kết quả đo vào hạt giống «bỏ Monitor» | Không lời hứa nào của hàng cần nó; Monitor + lịch 30′ của DP3 đã có |

## 4. Thành phần

### C1. Bộ phân loại S4 — sửa theo số đo (H2)

Tệp: `dieu-phoi/scripts/phan-loai-s4.mjs` (một hàm cho hook; mod không gọi nó — N2).

- **Vỏ bọc mang cờ.** Sau một vỏ bọc, bỏ qua cờ của nó và giá trị của cờ mang giá trị, rồi mới đọc lệnh. Danh
  sách đóng, viết trước — 41 dạng (nguồn: GNU coreutils `timeout(1)`, `env(1)`, `nice(1)`; BSD `env(1)` và
  `caffeinate(8)` đọc bằng `man` trên máy 11/10; builtin `time`, `command`, `exec` của bash):

  | Vỏ bọc | Dạng (từ đứng sau vỏ bọc, trước `node`) | Số |
  |---|---|---|
  | `timeout` | `900` · `-s KILL 900` · `--signal=KILL 900` · `-k 10 900` · `--kill-after=10 900` · `-f 900` · `--foreground 900` · `-p 900` · `--preserve-status 900` · `-v 900` | 10 |
  | `env` | `A=1` · `-i A=1` · `-0 A=1` · `-u UV_PYTHON` · `--unset=UV_PYTHON` · `-C /tmp` · `--chdir=/tmp` · `-P /opt/x` · `-v` · `-S '<lệnh>'` · `--split-string='<lệnh>'` | 11 |
  | `nice` | (trần) · `-n 10` · `--adjustment=10` | 3 |
  | `time` | (trần) · `-p` | 2 |
  | `nohup` | (trần) | 1 |
  | `command` | (trần) · `-p` | 2 |
  | `exec` | (trần) · `-a ten` · `-c` · `-l` | 4 |
  | `caffeinate` | (trần) · `-d` · `-i` · `-m` · `-s` · `-u` · `-t 3600` · `-w 4242` | 8 |

  Cờ mang giá trị (ăn từ kế): `timeout -s`, `-k`; `env -u`, `-C`, `-P`, `-S`; `nice -n`; `exec -a`;
  `caffeinate -t`, `-w`. Thời lượng của `timeout` là một từ bắt buộc. `env -S`/`--split-string=` tách chuỗi rồi
  phân loại lại như `bash -c`. Giá trị trong ma trận cố ý không trùng tên lệnh (`3600`, `/opt/x`), để một cờ
  khai sai là cờ trần thì ô ấy đỏ.
- **Chỉ đọc.** `node --check|-c <script>` (kiểm cú pháp) và `<script> … --help` không giữ tài nguyên. Vế
  `--help` an toàn vì cả ba script (`repin-lane.mjs`, `s4-args.mjs`, `duong-nen.mjs`) đọc HẾT đối số trước khi
  làm việc và dừng ở cờ lạ («cờ không nhận diện được»); `--help` là cờ lạ ở cả ba. Ca đo chứng lại tiền đề này
  trên script thật, để một ngày script nhận `--help` mà vẫn chạy thì ca đỏ.
- Phần còn lại giữ nguyên: tách đoạn ở `&& || ; | &` xuống dòng và ngoặc, đệ quy qua `bash -c` (trần 8), `giu-nhip
  … --`, `node --test` không phải S4.
- Ma trận ca viết TRƯỚC (số assert = số ô), gồm 41 dạng × 3 script, nguyên văn đã ẩn danh của sáu lệnh lệch ở
  §2.1, và hai chuỗi vỏ bọc lồng (`nohup nice -n 5 timeout 900 node …`, `env -u X caffeinate -i node …`). Tập ô
  mà mỗi đột biến chiều đỏ phải làm đỏ được RÚT bằng code từ ma trận (lọc ô theo token của vỏ bọc bị đột biến),
  không gõ số tay; ca kiểm trước khi ghim rằng 0 < số ô rút được < tổng số ô.

**Lời chặn.** `hook-chan-s4.mjs` hôm nay dặn «Ghi đơn xin/<phiên>-s4.json … rồi chờ», tức mời viết tay một tệp
mà DP3 đã giao cho CLI (`xin`). Lời mới nêu đúng lệnh `node <thư mục đợt>/loi/dieu-phoi.mjs xin <tài nguyên>`
(lõi đã chép vào đợt, spec §16 T4), đường được bọc an toàn cho shell bằng hàm `nhayDon` sẵn có (nháy đơn khi có
ký tự đặc biệt), và, khi cwd không thuộc dãy nào, nói rằng chỉ phiên thợ của một dãy xin được lượt.

### C2. Thợ chờ người → giám sát thức (H3)

- `hook-cho-nguoi.mjs`: `permission_prompt` **luôn** ghi tệp chờ người, kể cả khi dãy còn đơn `xin/` hoặc yêu
  cầu chưa trả lời. `idle_prompt` giữ luật cũ (đang chờ lượt hay chờ trả lời thì im — thợ rảnh là đúng).
- `phat-lich.mjs` (`suKienDem`): sự kiện `cho-nguoi` của một tệp chờ người MỚI mang thêm `can_phan: true`,
  `loai_cho` (`permission_prompt` / `idle_prompt`) và `tin` cắt ≤ 200 ký tự. Một tệp một sự kiện, như cũ; đợt nâng
  từ bộ phát lịch cũ vẫn nạp im. `viec-cho.mjs` của DP3 đã loại sự kiện `cho-nguoi` khỏi danh sách việc chờ (đã
  có nguồn tệp), nên không đếm đôi.
- Round-trip là thước: tệp do hook THẬT ghi → nhịp của bộ phát lịch thật → dòng `su-kien.jsonl` khớp đúng bộ lọc
  Monitor, rút NGUYÊN VĂN từ `dieu-phoi/commands/tiep-tuc.md`, không chép tay.
- Ca K3b (hộp quyền của tác tử Workflow) phụ thuộc câu 1 của §2.5: đo được rằng `Notification permission_prompt`
  bắn ở phiên cha → C2 phủ ca này, README gói ghi một dòng. Không bắn → README gói và mục «việc chờ» khai giới hạn
  «mù: hộp quyền của tác tử Workflow» kèm ngưỡng mở lại, luật 52 của crm còn nguyên giá trị.

### C3. Khung trạng thái đợt trong app (H1) — phần mod

Tệp: một phần dưới khung mod của DP4 (dự kiến `dieu-phoi/hooks/mod/khung.ts`; tên cuối theo khung DP4), cộng
hàm vẽ thuần `dieu-phoi/scripts/khung.mjs` (không import gì — mod import được, `node --test` kiểm được).

- **Dữ liệu.** CLI `xem --json` (mới) in mô hình `moHinh` dạng JSON, cộng `day_cua_cwd` (dãy mà cwd thuộc, hoặc
  `null`). Không có đợt → `{"dot":null}`, thoát 0. Mod gọi nó bằng
  `$.process.run(['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'xem', '--json'], { cwd: $.session.cwd() })`
  ở `session.start` và mỗi 20 giây (`$.clock.every`), giữ kết quả trong `$.state`. `cwd` truyền tường minh vì
  `day_cua_cwd` và việc tìm đợt đều suy từ nó. Không đợt → không vẽ, giãn nhịp hỏi xuống 120 giây.
  Lời gọi lỗi (không chạy được `node`, thoát khác 0, JSON hỏng) → dải hiện đúng một dòng «khung: không đọc được
  đợt — <lý do ngắn>», không im lặng.
  **Nhánh dự phòng, chỉ mở khi đo sống (§6 hàng 5) cho thấy `$.process.run(['node', …])` không chạy được trên
  phiên desktop:** mod đọc thẳng `trang-thai.json` và `hang-viec.json` bằng `$.fs.read` qua đường liên kết đợt ở
  checkout chính (suy từ tệp `.git` của worktree), rồi gọi `moHinh` import trực tiếp — vẫn MỘT hàm mô hình, chỉ
  đổi đường lấy dữ liệu; đổi nhánh phải có dòng sổ `revisit`.
- **Dải trên ô nhập** (`ui.render` trên `AbovePrompt`, bề mặt terminal và desktop): một dòng
  `Đợt <tên> · <pha> · S4: <phiên> → HH:MM · chờ lượt <n> · cần anh <n>`; ở phiên thợ thêm
  `Dãy <id>: <hàng> · <tiến độ>`; giảm tải thì đầu dòng là `GIẢM TẢI`. Có một nút «xem» mở pane (bấm nút là
  «được hỏi», nên pane đặt ở mọi bề rộng — tránh ngưỡng 144 cột của §2.5 câu 2).
- **Pane** (`$.ui.open`, `ui.render` trên `Pane`): khoá đang giữ và hạn thuê, hàng chờ lượt, việc cần anh kèm
  liên kết phiên, các dãy với hàng, tiến độ, nhóm kế hoạch — cùng nội dung `bang.html`.
- **`/dieu-phoi:xem` không qua model.** Mod nghe `command.run` của lệnh này và trả `{ text }` bằng `veXem` của
  cùng mô hình, đồng thời mở pane. Phiên không có mod (CLI cũ) chạy tệp lệnh markdown như hôm nay; tệp lệnh
  không đổi. Chưa kiểm: một hook `command.run` trả lời được lệnh markdown của chính gói không (tài liệu: hook
  trả `{ text }` mà không gọi `next` thì «runs no command», D1829-32) — kiểm bằng `claude plugin test` ở S3; không
  được thì mod đăng ký lệnh riêng tên `dot` (`/dot`) và dải trỏ tới nó.
- Hàm vẽ thuần nhận mô hình, trả cây phần tử theo bảng phần tử của bề mặt (`$.ui.resolve(e)`), nên một hàm cho
  cả terminal và desktop.

### C4. Răng an toàn của phần DP6

- Các tệp mod của DP6 qua `validate --strict --json` của một bản ≥ 2.1.287: bộ kiểm tìm bản theo thứ tự biến
  `DIEU_PHOI_CLAUDE_BIN` → bản của app desktop → `claude` trên PATH nếu ≥ 2.1.287; không tìm được thì ĐỎ nêu lý
  do, không bao giờ xanh khi chưa chạy (cùng luật `kiem-validate.mjs`). Tập sự kiện các tệp DP6 nghe ⊆
  {`session.start`, `ui.render`, `ui.press`, `command.run`}; có một sự kiện ngoài tập (nhất là bốn sự kiện của
  N2) → đỏ nêu tệp và sự kiện.
- `hooks.json` vẫn khai `PreToolUse` → `hook-chan-s4.mjs` cho `Workflow|Bash`; không tệp nào của gói đọc một dấu
  do mod ghi. DP6 chạy thêm răng T11 của DP4 trên các tệp của mình (dùng lại, không chép).

## 5. Ngoài phạm vi

- Mod đọc mức dùng (`session.measure`) — DP4.
- Khung mod (mục `modules`, tệp đăng ký), ca quét «không bao giờ cho phép» và bộ tìm bản `claude` — DP4; DP6
  dùng lại.
- Thay Monitor bằng mod tự đánh thức — đo (§6), kết quả vào hạt giống; không dựng.
- Báo giám sát bằng `session.send` từ phiên thợ — bỏ: Monitor đã thức nhờ C2; địa chỉ phiên không đối chiếu
  được tin cậy.
- Hook `Stop` để bắt «kết lượt chờ người» ngay thay vì chờ `idle_prompt` 60″ — bỏ: lợi ≤ 60″, giá là một hook
  mỗi lượt của mọi phiên trong kho.
- Đơn chờ khoá mà không còn lệnh nền chờ (thợ đứng im với đơn trong `xin/`) — không phải «chờ người»; nếu đợt
  thử vấp, ghi hạt giống.

## 6. Đo sống §12.3 — mod thăm dò (xin ở Cổng Phạm vi)

Một mod chỉ quan sát, tên `dp6-tham-do`, đặt ở `~/.claude/dev-mods/<mã phiên DP6>/dp6-tham-do/`, chỉ nạp vào
phiên DP6 khi chủ kho bấm «Enable hot reloading for this session» (câu app tự hỏi khi tệp đầu tiên được ghi).

- Mod tự kiểm `$.session.id()` bằng mã phiên DP6 ghi cứng trong mod; khác thì không nghe gì, không ghi gì (điều
  kiện Điều phối đặt cho mọi mod đo trên máy M5 ngày 11/10).
- Mọi hook trả `next(e)` nguyên vẹn; nghe `tool.call` (ghi cả kết quả của `next`: `isError`, đoạn đầu `text`),
  `tool.check` (đọc kết quả của `next`), `classic.Notification`, `classic.PermissionRequest` (không trả `decision`
  nào), `turn.complete`, `session.receive`, `ui.render` của `AbovePrompt`/`Pane`; mỗi sự kiện một dòng JSON
  (`luc`, `su_kien`, `agentId`/`agent_id`, `tool`, `notification_type`, `ket_qua`, `kich_ban`) ghi bằng `$.fs` thẳng
  vào `_acceptance/dieu-phoi-lop-mod/evidence/tham-do.jsonl` của worktree DP6 — không ghi scratchpad, để lượt chấm
  (sau khi DP4 gộp) còn đọc được.
- Kịch bản, mỗi kịch bản mở và đóng bằng một dòng `{"kich_ban": n, "moc": "dau"|"cuoi"}`:
  (1) một Workflow một tác tử chạy một lệnh mà chế độ auto luôn hỏi (`eval true`) → hộp quyền hiện, chủ kho bấm
  **Deny** → câu 1. **Đối chứng dương:** kịch bản 1 chỉ có giá trị khi trong cửa sổ của nó có dòng `tool.call`
  mang `agentId` của tác tử Workflow với kết quả bị từ chối bởi người (hộp đã thật sự hiện); không có → kịch bản
  «không hợp lệ», chạy lại một lần với lệnh khác (`rmdir "$bien"`), vẫn không → câu 1 ghi «không đo được».
  (2) Mod vẽ một dải và mở một pane không được hỏi → ghi `isPlaced`, `bodyColumns`, `surface` → câu 2 (phần
  desktop). (3) Hết lượt, hẹn 60″ rồi `$.prompt.submit` một câu cố định đúng một lần → lượt mới có bắt đầu không
  → câu 4. (4) `$.process.run(['node', '-v'], { cwd })` → mod gọi được `node` trên desktop không → **hàng 5** của
  bảng (không thuộc §12.3 nhưng C3 cần; quyết nhánh dự phòng của C3). Câu 3 không cần đo (§3.1).
- Gỡ: máy xoá thư mục mod ngay sau lần đo; hot reload chỉ sống trong phiên DP6.
- Chạm người: một dòng đồng ý ở Cổng Phạm vi, một lần bấm Enable, một lần bấm Deny.
- Kết quả vào `_acceptance/dieu-phoi-lop-mod/evidence/tham-do-12-3.md` (bảng năm hàng: bốn câu §12.3 + hàng 5,
  mỗi hàng dẫn `tham-do.jsonl#L<n>` hoặc trích tài liệu kiểu) và sửa §2.5 của tài liệu này. Kết quả làm đổi một
  tiêu chí → dòng sổ `revisit`, tiêu chí sửa trước S2.

Câu 2 phần «phiên mở từ chip» không đo được bằng hot reload (chỉ phiên DP6 nạp mod). Khai giới hạn; đo ở đợt
thử crm (~26/10) khi gói có mod được cài theo kho.

## 7. Đường đo và giới hạn đã khai

- Không có hồ sơ cơ hội riêng (hàng chạy dưới Cổng Đáng của ô dù); ngưỡng SỐNG của ô dù không gồm DP6 (spec
  workflow §9). Bỏ mục «Đường đo» bằng dòng sổ có tên.
- Giới hạn: khung không hiện ở phiên CLI < 2.1.287 và app < 2.1.286 — các phiên đó vẫn có `xem` qua model và
  `bang.html`. Ngưỡng: không — đó là điều kiện bản, không phải lỗi.
- Giới hạn: phiên mở từ chip có nạp mod và có dải không — chưa đo (§6). Ngưỡng mở lại: đợt thử crm có ≥ 1 phiên
  thợ không thấy dải.
- Giới hạn: hỏi CLI mỗi 20 giây ở mọi phiên trong kho có đợt (8 phiên ≈ 24 tiến trình node mỗi phút, mỗi tiến
  trình đọc vài tệp JSON). Ngưỡng: bộ đếm tải của đợt (`suc-khoe`) báo giảm tải vì CPU trong đợt thử.

## 8. Thứ tự thi công (để S2)

1. C1 và C2 — lõi Node, không phụ thuộc khung mod; có thể làm ngay khi S3 mở.
2. `xem --json` và `khung.mjs` (thuần) — không phụ thuộc khung mod.
3. Phần mod của C3 và răng C4 — sau khi DP4 gộp, nối vào khung của DP4.
4. Tài liệu: README gói (mục «Lớp mod»), sửa spec workflow §12.2 cho khớp §3.1 (luật §16: hàng mở vòng thì sửa
   mục gốc).
