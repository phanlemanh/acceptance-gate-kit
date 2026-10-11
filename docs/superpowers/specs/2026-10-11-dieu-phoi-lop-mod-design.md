# Chặn S4 đúng lệnh và đánh thức giám sát khi thợ chờ người (DP6, phần lõi Node) — design

Gốc: hàng DP6 `dieu-phoi-lop-mod` trong [`docs/plans/lo-trinh-kit.json`](../../plans/lo-trinh-kit.json), dưới
Cổng Đáng của ô dù [`dieu-phoi-tho-trong-kit`](../../../_acceptance/dieu-phoi-tho-trong-kit/opportunity.md)
(build 09/10, timebox 07/11). Thiết kế chung đã duyệt 10/10:
[spec workflow §12](2026-10-10-dieu-phoi-workflow-design.md) và §12.3. Hồ sơ: `_acceptance/dieu-phoi-lop-mod/`.

## 0. Tách phạm vi (11/10, Điều phối M5)

Câu giao của hàng, nguyên văn: «Trạng thái đợt hiện ngay trong app; S4 bị chặn đúng lệnh, không chặn nhầm
lệnh chỉ đọc; thợ chờ người thì giám sát biết ngay, không phải dò nhật ký».

S1 đo được hai lỗi ở lõi Node đang chạy (§2) làm hỏng đúng đợt thử crm ~26/10, đợt chạy gói bản mốc 25/10 — trong
khi DP6 ở mốc 01/11 và phần mod cần khung mod của DP4 (chưa gộp). Điều phối tách:

- **Ở lại DP6, đi S3 ngay sau Cổng Phạm vi, nhắm mốc 25/10:** vế 2 (chặn S4 đúng lệnh) và vế 3 (giám sát biết
  ngay) — cả hai sửa ở lõi Node, không cần mod.
- **Sang hạt giống** [`docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`](../../plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md):
  vế 1 (dải trạng thái trên ô nhập, pane, `/dieu-phoi:xem` không qua model), đo sống bốn câu §12.3 bằng mod thăm
  dò, và răng của mod. Thiết kế, sự thật tài liệu kiểu 2.1.295 và kế hoạch đo đã chép sang đó; chờ DP4 gộp.

Slug hồ sơ giữ `dieu-phoi-lop-mod` để hàng DP6 của lộ trình còn trỏ đúng hồ sơ.

## 1. Ý định của phần còn lại

| # | Lời hứa | Người hưởng | Ca gốc |
|---|---|---|---|
| H2 | S4 bị chặn đúng lệnh, không chặn nhầm lệnh chỉ đọc | Phiên thợ (không bị chặn oan), cả đợt (không hai S4 chồng nhau) | crm 10/10: hook so chuỗi con chặn nhầm một lệnh chỉ đọc của giám sát; DP1 AC-10 đã đổi sang phân loại theo cấu trúc |
| H3 | Thợ chờ người thì giám sát biết ngay, không phải dò nhật ký | Chủ kho (không lỡ hàng giờ), phiên giám sát | Đêm 09–10/10: S4 của K3b đứng 2 giờ 30 vì hộp duyệt quyền, không ai biết; luật 52 của crm bắt giám sát so `journal.jsonl` |

Luật cứng từ spec §12.1 và lời giao giữ nguyên: chặn S4 không hỏi người; hook chặn S4 không nhường cho mod (hàng
này không thêm mod nào).

## 2. Số đo trước khi thiết kế (11/10, máy M5, chỉ đọc)

### 2.1 Bộ phân loại S4 trên lệnh thật

Script đo (scratchpad của phiên DP6) chạy `dieu-phoi/scripts/phan-loai-s4.mjs` của main `68951cef` qua mọi lời gọi
công cụ trong 530 tệp bản ghi hội thoại ở `~/.claude/projects/`: **46.801 lời gọi Bash** (tính cả bản chép trong
bản ghi tác tử con), **367 lời gọi Bash duy nhất** (theo `tool_use_id`) bị phân loại là giữ tài nguyên.

- **Bỏ lọt — lần chạy thật không bị nhận ra (3 lời gọi, 2 hình):**
  - `timeout 900 node $K/feature-loop/scripts/repin-lane.mjs --root . --slug …` (2 lần, crm 12/09). `timeout`
    không có trong bảng vỏ bọc.
  - `env -u UV_PYTHON CLAUDE_PLUGIN_ROOT=$FL node $FL/scripts/repin-lane.mjs …` (1 lần, OneFlow 17/09). `env -u`
    ăn một giá trị ở từ kế; bộ phân loại coi `UV_PYTHON` là tên lệnh.
  - Cùng lớp, suy từ mã (không có trong bản ghi): `nice -n 10 node …`, `time -p node …` — `nice`, `time` có trong
    bảng vỏ bọc nhưng cờ của chúng thì không.
- **Chặn nhầm — lời gọi không chạy script nào mà bị coi là S4 (6 lời gọi, 3 hình):**
  - Thân heredoc đọc như lệnh (2): `cat > tests/scripts/repin-lane.test.mjs <<'EOF' …` và một khối
    `python3 - … <<'PY' …` — dòng trong thân nhắc `node …/repin-lane.mjs` nên bị coi là lần chạy.
  - `node --check feature-loop/scripts/repin-lane.mjs` (2) — kiểm cú pháp, không chạy script; một trong hai lời gọi
    có kèm một heredoc Python vô hại (thân không kích gì), nên chỉ luật `--check` gỡ được nó.
  - `node …/s4-args.mjs --help` (2, crm 09/09 và 13/09).
- Mô phỏng ba luật mới của §4 C1 trên mọi lời gọi dương: đúng sáu lời gọi trên (cộng một lệnh `--help` của chính
  phiên đo hôm nay) đổi sang null; KHÔNG lời gọi nào có lần chạy thật đổi sang null. Ba lời gọi khác có
  `node --check …` mà vẫn dương là đúng — cùng lệnh ấy còn chạy thật `repin-lane.mjs … --write`.
- Định danh (tệp bản ghi, `tool_use_id`) của chín lời gọi trên (3 bỏ lọt, 6 chặn nhầm) đã rút được; ca kiểm ở S3
  rút lại đúng chúng từ bản ghi bằng một script trong `tests/dieu-phoi/`, không gõ tay (§4 C1).

Kết luận: bộ phân loại theo cấu trúc (DP1 AC-10) đúng hướng nhưng vừa mở (vỏ bọc mang cờ) vừa đóng (thân heredoc,
cờ chỉ đọc). Sửa ở MỘT hàm; hook chặn S4 dùng hàm đó nên tự hưởng.

### 2.2 Đường «thợ chờ người → giám sát» hôm nay

Đọc mã của DP1–DP3 (DP3 ở PR phanlemanh/acceptance-gate-kit#303, đỉnh `7d2df3b0`; DP3 không sửa ba tệp dưới):

1. `hook-cho-nguoi.mjs` ghi `cho-nguoi/<dãy>.json` khi `Notification` mang `idle_prompt` hoặc `permission_prompt`
   — **nhưng trả `cho-luot` / `cho-tra-loi` và KHÔNG ghi gì khi dãy còn đơn `xin/` hoặc còn yêu cầu chưa trả lời**,
   cho cả hộp xin quyền. Một thợ đang chờ khoá mà lệnh nền chờ của nó bật hộp xin quyền thì đứng mãi, im lặng.
2. Bộ phát lịch thấy tệp mới thì ghi sự kiện `{loai: 'cho-nguoi', phien, hang}` — **không mang `can_phan`**
   (`phat-lich.mjs`, `suKienDem`, dựng cho lệnh đếm T14).
3. Monitor của giám sát (thân `/dieu-phoi:mo-dot` và `/dieu-phoi:tiep-tuc`) lọc đúng `"can_phan":true`. Vậy
   **giám sát không bao giờ thức vì một thợ chờ người**. DP3 thêm đường dự phòng: `danh-thuc` của lịch 30′ nhắn
   giám sát khi nó ngủ quá 40′ mà còn việc chờ (gồm tệp chờ người) — quãng lỡ có trần khoảng 70′, không phải «ngay».

Kết luận: H3 gãy ở hai chỗ trong lõi Node; DP3 không chạm hai chỗ đó, nên không có phần nào phải bỏ khỏi DP6.

### 2.3 Vì sao sửa ở hook, không ở mod

`claude` trên PATH máy M5 là 2.1.281 (chưa có mod); app desktop chạy 2.1.295. Mod chỉ có ở app ≥ 2.1.286, CLI ≥
2.1.287. Kho tiêu thụ và phiên CLI cũ không có mod, nên mọi việc an toàn (chặn S4) và báo tin (chờ người) phải đủ
ở hook thường.

## 3. Chỗ đi lệch spec §12.2 — ghi sổ, cửa veto mở

| Spec §12.2 nói | DP6 làm | Vì sao |
|---|---|---|
| Mod nghe `tool.call` của Workflow và Bash, phân loại, không có lượt thì ghi đơn `xin/` rồi trả `deny` | **Không mod nào chặn S4.** Hook giữ vai chặn; DP6 sửa bộ phân loại (§2.1) và lời chặn nêu đúng lệnh CLI xin lượt | Mod nằm trên hook thường trong chuỗi `tool.call` và cùng một hàm phân loại → cùng quyết định; nhánh chặn thứ hai chỉ thêm một bề mặt có thể trả lời sai. Tự ghi đơn `xin/` khi chặn biến mỗi lần phân loại sai thành một khoá cấp oan; khối «Trong đợt» của DP7 đã dạy thợ xin lượt bằng CLI trước S4 |
| Mod nghe `PermissionRequest` và `turn.complete` ở phiên thợ, ghi `cho-nguoi/`, báo giám sát bằng `session.send` | **Sửa ở lõi Node:** hộp xin quyền không bao giờ bị nuốt; sự kiện `cho-nguoi` mang `can_phan` nên Monitor thức | Hai chỗ gãy đo được ở §2.2 đều trong lõi; sửa ở đó thì kho CLI cũ cũng hưởng. `session.send` cần địa chỉ phiên giám sát mà mod không đối chiếu được tin cậy với `vai.json` |

## 4. Thành phần

### C1. Bộ phân loại S4 — sửa theo số đo (H2)

Tệp: `dieu-phoi/scripts/phan-loai-s4.mjs` (một hàm cho hook chặn S4).

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
- **ĐÃ THU 11/10 tại điểm dừng-vá (sổ quyết định hồ sơ, dòng 20) — thân heredoc được quét như mọi dòng lệnh, như
  merge-base; heredoc nhắc tên script giữ tài nguyên bị chặn kể cả khi thân chỉ là dữ liệu (giới hạn đã khai, 2 trên
  46.801 lời gọi đo).** Vì sao thu: luật dưới đây cần một mô hình đủ của argv trình thông dịch, và hai lượt chấm liền
  tìm ra lệnh S4 lọt qua chính chỗ ấy (`bash -o pipefail <<EOF` ở lượt 1, `bash <<'EOF' 2>&1 | tail` ở lượt 2). Khuôn
  thay thế an toàn theo hướng chặn — thân là dữ liệu CHỈ khi lệnh nhận thuộc một danh sách đóng không chạy thân
  (`cat`/`tee` ghi tệp, `git commit -F -`) và không đổ vào ống — ở hạt giống
  `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`. Đoạn dưới giữ làm sử liệu, KHÔNG còn là hành vi:
- ~~**Thân heredoc là dữ liệu, không phải lệnh.**~~ Gặp `<<DELIM`, `<<-DELIM`, `<<'DELIM'`, `<<"DELIM"`: các dòng từ
  sau dòng mở tới dòng bằng đúng `DELIM` (với `<<-` thì bỏ tab đầu dòng) không được tách thành đoạn lệnh. Thân
  không nháy (`<<DELIM`) vẫn bị shell thay `$(…)` và backtick, nên chỉ phần trong `$(…)` và backtick của thân ấy
  được phân loại; thân có nháy thì bỏ trọn. Thiếu dòng đóng → coi thân kéo tới hết chuỗi (shell cũng làm thế).
  NGOẠI LỆ (soát toàn nhánh 11/10): cùng dòng mở có một trình thông dịch đọc stdin — `bash`/`sh`/`zsh` không `-c` và
  không tệp script (hoặc có `-s`), kể cả qua ống `… | bash`; `node` không tệp script — thì thân CHÍNH LÀ lệnh: thân
  shell phân loại như lệnh, thân JS nhắc tên một script giữ tài nguyên coi như chạy nó. `<<<` là here-string (không
  thân). Không mở heredoc trong số học `((…))`/`$((…))` và trong chú thích `#`; dấu mở là trọn một từ shell đã gỡ
  nháy (`EOF-X`). Ma trận chống lọt 12 ô giữ các luật này, mỗi ô dương cũng bị bộ phân loại merge-base chặn.
- **Chỉ đọc.** `node --check|-c <script>` (kiểm cú pháp) và `<script> … --help` không giữ tài nguyên. Vế
  `--help` an toàn vì cả ba script (`repin-lane.mjs`, `s4-args.mjs`, `duong-nen.mjs`) đọc HẾT đối số trước khi
  làm việc và dừng ở cờ lạ («cờ không nhận diện được»); `--help` là cờ lạ ở cả ba. Ca đo chứng lại tiền đề này
  trên script thật, để một ngày script nhận `--help` mà vẫn chạy thì ca đỏ.
- Phần còn lại giữ nguyên: tách đoạn ở `&& || ; | &` xuống dòng và ngoặc, đệ quy qua `bash -c` (trần 8), `giu-nhip
  … --`, `node --test` không phải S4.
- **Ca kiểm.** Ma trận viết TRƯỚC (số assert = số ô): 41 dạng × 3 script, hai chuỗi vỏ bọc lồng
  (`nohup nice -n 5 timeout 900 node …`, `env -u X caffeinate -i node …`), ma trận heredoc (có nháy, không nháy có
  `$(node …repin-lane.mjs)`, `<<-`, thiếu dòng đóng), ô «kiểm cú pháp rồi chạy thật» (`node --check <script> &&
  node <script> --write` — vẫn dương), và chín lời gọi thật ở §2.1. Chín lời gọi thật vào tệp ca
  `tests/dieu-phoi/fixtures/lenh-that-2026-10-11.jsonl`, do script `tests/dieu-phoi/rut-lenh-that.mjs` rút từ bản
  ghi theo (tệp, `tool_use_id`) và ẩn danh đường người dùng; mỗi dòng mang định danh nguồn và nhãn kỳ vọng. Ca
  kiểm nguồn chạy lại script rút trên bản ghi của máy và so bằng nhau với tệp ca; máy không có bản ghi (CI) thì
  ca ấy in một dòng «bỏ qua: không có bản ghi hội thoại» — giới hạn đã khai, các ca phân loại vẫn chạy trên tệp ca.
  Tập ô mà mỗi đột biến chiều đỏ phải làm đỏ được RÚT bằng code từ ma trận (lọc ô theo token của vỏ bọc hay cờ bị
  đột biến), không gõ số tay; ca kiểm trước khi ghim rằng 0 < số ô rút được < tổng số ô.
  Từ lần thu 11/10: mọi ô heredoc và hai lời gọi heredoc thật kỳ vọng BỊ CHẶN; đột biến giả lập lại luật «thân là
  dữ liệu» (ngừng đọc từ `<<` đầu tiên) phải đỏ đúng các ô kỳ vọng bị chặn mà có `<<`; bộ phân loại ở mốc bản cũ sai
  bảy trong chín lời gọi thật (hai lời gọi heredoc: cả hai bản cùng chặn).
  «Mốc bản cũ» của mọi ca so sánh là một commit CỐ ĐỊNH của nhánh chính trước DP6 (`08ba287d`, merge PR #307),
  không phải merge-base sống: sau khi gộp, merge-base của nhánh chính với chính nó là HEAD và ca so sánh sẽ đỏ trên
  CI của nhánh chính (Cổng Bằng chứng 11/10, chủ kho chọn sửa trước khi ký).

**Lời chặn** (sửa 11/10 sau khi gộp DP7: DP7 AC-6, đã ký, giữ nguyên câu cũ làm tiền tố và thêm câu «chờ lượt» khi cwd
thuộc dãy, ngoài dãy y như cũ — DP6 nhường, chỉ NỐI THÊM lệnh xin lượt sau câu của DP7, không bỏ câu cũ; đoạn dưới
là bản S1, giữ để đối chiếu). `hook-chan-s4.mjs` hôm nay dặn «Ghi đơn xin/<phiên>-s4.json … rồi chờ», tức mời viết tay một tệp
mà DP3 đã giao cho CLI (`xin`). Lời mới nêu đúng lệnh `node <thư mục đợt>/loi/dieu-phoi.mjs xin <tài nguyên>`
(lõi đã chép vào đợt, spec §16 T4), đường được bọc an toàn cho shell bằng hàm `nhayDon` sẵn có (nháy đơn khi có
ký tự đặc biệt; với một đối số đường, dấu cách cũng tính là đặc biệt), và, khi cwd không thuộc dãy nào, nói rằng chỉ
phiên thợ của một dãy xin được lượt. Khi `hang-viec.json` của đợt không đọc được, chính `xin` cũng không chạy được
(nó cần tệp ấy để biết dãy), nên lời chặn giữ lời dặn cũ — đường đọc-cũ; nhờ vậy 84 ca lõi chuyển từ crm (vốn dựng
đợt không có `hang-viec.json`) và hai răng «lõi không đổi» của DP2, DP3 giữ nguyên.

### C2. Thợ chờ người → giám sát thức (H3)

- `hook-cho-nguoi.mjs`: `permission_prompt` **luôn** ghi tệp chờ người, kể cả khi dãy còn đơn `xin/` hoặc yêu
  cầu chưa trả lời. `idle_prompt` giữ luật cũ (đang chờ lượt hay chờ trả lời thì im — thợ rảnh là đúng).
- `phat-lich.mjs` (`suKienDem`): sự kiện `cho-nguoi` của một tệp chờ người MỚI mang thêm `can_phan: true`,
  `loai_cho` (`permission_prompt` / `idle_prompt`) và `tin` cắt ≤ 200 ký tự. Một tệp một sự kiện, như cũ; đợt nâng
  từ bộ phát lịch cũ vẫn nạp im. `viec-cho.mjs` của DP3 đã loại sự kiện `cho-nguoi` khỏi danh sách việc chờ (đã
  có nguồn tệp), nên không đếm đôi; `danh-thuc` của DP3 không đổi.
- Round-trip là thước: tệp do hook THẬT ghi → nhịp của bộ phát lịch thật → dòng `su-kien.jsonl` khớp đúng bộ lọc
  Monitor, rút NGUYÊN VĂN từ `dieu-phoi/commands/mo-dot.md` và `tiep-tuc.md`, không chép tay.
- Ca K3b (hộp quyền của tác tử Workflow): hook `Notification` có bắn cho hộp đó ở phiên cha không là câu 1 của
  §12.3 — chưa đo, chuyển cùng phần mod sang hạt giống. README gói khai giới hạn «chưa đo: hộp quyền của tác tử
  Workflow có tới hook chờ người không» kèm ngưỡng mở lại.

## 5. Ngoài phạm vi

- Vế 1 của câu giao (khung trạng thái trong app), đo sống §12.3, răng của mod — hạt giống
  `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`.
- Mod đọc mức dùng, khung mod, răng T11 — DP4.
- Báo giám sát bằng `session.send` từ phiên thợ — bỏ: Monitor đã thức nhờ C2.
- Hook `Stop` để bắt «kết lượt chờ người» ngay thay vì chờ `idle_prompt` 60″ — bỏ: lợi ≤ 60″, giá là một hook
  mỗi lượt của mọi phiên trong kho.
- Đơn chờ khoá mà không còn lệnh nền chờ (thợ đứng im với đơn trong `xin/`) — không phải «chờ người»; nếu đợt
  thử vấp, ghi hạt giống.

## 6. Giới hạn đã khai

- Ca kiểm nguồn của chín lời gọi thật chỉ chạy được trên máy có bản ghi hội thoại; CI in «bỏ qua». Ngưỡng: không
  — các ca phân loại vẫn chạy trên tệp ca ở mọi nơi.
- Hộp quyền của tác tử Workflow có tới hook chờ người không — chưa đo (hạt giống). Ngưỡng mở lại: đợt thử crm có
  ≥ 1 lần một lượt S4 đứng vì hộp quyền mà không có tệp chờ người.
- Bộ phân loại vẫn là bộ đọc cú pháp shell rút gọn, không phải trình phân tích shell đầy đủ (biến mở rộng thành
  tên script, `eval`, alias không được hiểu). Ngưỡng: ≥ 1 lời gọi S4 thật lọt qua hook trong đợt thử, nhận ra bằng
  sự kiện hai khoá S4 chồng nhau.

## 7. Thứ tự thi công (để S2)

1. Gộp `origin/main` (có DP3) vào nhánh trước S3, bằng merge.
2. C1: bộ phân loại (vỏ bọc, heredoc, chỉ đọc), script rút lời gọi thật và tệp ca, lời chặn.
3. C2: hook chờ người, sự kiện `cho-nguoi` mang `can_phan`.
4. Tài liệu: README gói (mục chặn S4 và chờ người, giới hạn đã khai), sửa spec workflow §12.2 cho khớp §3 (luật
   §16: hàng mở vòng thì sửa mục gốc).
