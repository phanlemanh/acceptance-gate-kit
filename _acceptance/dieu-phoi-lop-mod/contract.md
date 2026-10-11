---
schema_version: 1
feature: Hàng DP6, phần lõi Node — S4 bị chặn đúng lệnh, không chặn nhầm lệnh chỉ đọc; thợ chờ người thì giám sát thức ngay, không phải dò nhật ký (phần mod chỉ vẽ tách sang hạt giống)
slug: dieu-phoi-lop-mod
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, docs]
status: implemented
design_doc: docs/superpowers/specs/2026-10-11-dieu-phoi-lop-mod-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T03:26:07Z
---

# Acceptance Contract: dieu-phoi-lop-mod

## Context

Hàng DP6 của lộ trình kit, dưới Cổng Đáng của ô dù `dieu-phoi-tho-trong-kit` (build 09/10, timebox 07/11).
Câu giao: «Trạng thái đợt hiện ngay trong app; S4 bị chặn đúng lệnh, không chặn nhầm lệnh chỉ đọc; thợ chờ
người thì giám sát biết ngay, không phải dò nhật ký». Ca gốc: crm 10/10 hook chặn S4 chặn nhầm một lệnh chỉ
đọc; đêm 09–10/10 S4 của K3b đứng 2 giờ 30 vì hộp duyệt quyền mà không ai biết. Thiết kế chung đã duyệt 10/10:
spec workflow §12.

Ngày 11/10 Điều phối M5 tách phạm vi (design §0): hai lỗi lõi đo được ở S1 làm hỏng đúng đợt thử crm ~26/10
(gói bản mốc 25/10), nên vế 2 và vế 3 ở lại hàng này và đi S3 ngay sau Cổng Phạm vi; vế 1 (khung trạng thái
trong app), đo sống §12.3 và răng của mod sang hạt giống `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`,
chờ khung mod của DP4.

Số đo làm nền (design §2): trên 367 lời gọi Bash duy nhất bị phân loại dương trong bản ghi thật, bộ phân loại
bỏ lọt 3 lần chạy S4 thật (`timeout …`, `env -u …`) và chặn nhầm 6 lời gọi không chạy script nào (thân
heredoc, `node --check`, `--help`); sự kiện `cho-nguoi` của bộ phát lịch không mang `can_phan` nên Monitor của giám sát
không thức; `hook-cho-nguoi` nuốt hộp xin quyền khi dãy còn đơn hay yêu cầu chờ. DP3 (PR #303) không sửa ba
tệp này.

Thuật ngữ:
- **tài nguyên** = `s4` hoặc `duong-nen`, giá trị mà `phanLoaiLenh` trả; `null` = lời gọi không giữ tài nguyên.
- **vỏ bọc** = lệnh đứng trước lệnh thật và chạy nó: `timeout`, `env`, `nice`, `time`, `nohup`, `command`,
  `exec`, `caffeinate`. **cờ mang giá trị** = cờ của vỏ bọc ăn từ kế tiếp (`env -u TÊN`, `timeout -s SIG`…).
- **thân heredoc** = các dòng giữa dòng mở `<<DELIM` (hay `<<-`, `<<'DELIM'`, `<<"DELIM"`) và dòng đóng `DELIM`.
- **lời gọi thật** = chín lời gọi Bash đo 11/10 ở design §2.1 (3 bỏ lọt, 6 chặn nhầm), định danh bằng (tệp bản
  ghi, `tool_use_id`).
- **hook thật** = lệnh hook rút từ `dieu-phoi/hooks/hooks.json` (thay `${CLAUDE_PLUGIN_ROOT}`), chạy bằng
  tiến trình con với stdin JSON.
- **bộ lọc Monitor** = chuỗi `grep` trong lệnh giăng Monitor của `dieu-phoi/commands/mo-dot.md` và
  `tiep-tuc.md`, rút nguyên văn lúc chạy.

## Criteria

- AC-1: Given ma trận viết trước gồm 41 dạng vỏ bọc của design §4 C1 (8 vỏ bọc, kể cả cờ mang giá trị `timeout -s/-k`, `env -u/-C/-P/-S`, `nice -n`, `exec -a`, `caffeinate -t/-w`) nhân với mỗi script giữ tài nguyên (`repin-lane.mjs` → `s4`, `s4-args.mjs` → `s4`, `duong-nen.mjs` → `duong-nen`), cộng hai chuỗi vỏ bọc lồng và 3 lời gọi thật bỏ lọt, When phân loại bằng `phanLoaiLenh`, Then mỗi ô trả đúng tài nguyên (số assert = số ô = 132: 41 × 3 + 2 chuỗi lồng × 3 + 3 lời gọi thật, in ra); hook thật ở một đợt có khoá `s4` do dãy khác giữ thoát 2 cho mọi ô `s4`, và thoát 0 khi khoá thuộc chính dãy gọi (đối chứng). Chiều đỏ, mỗi đột biến chạy trên bản sao sau khi bản lành xanh: (a) gỡ `timeout` khỏi bảng vỏ bọc → đỏ ĐÚNG tập ô chứa token `timeout`, tập rút bằng code từ ma trận (in số; kiểm 0 < số < tổng) · (b) khai `caffeinate -t` là cờ trần → đỏ đúng tập ô chứa `caffeinate -t`.
- AC-2: Given ma trận viết trước gồm (i) lời gọi chỉ đọc — `node --check <script>`, `node -c <script>`, `node <script> --help` cho cả ba script, (ii) ma trận heredoc năm hình × ba script — thân có nháy đơn nhắc `node <script>`, thân có nháy kép nhắc `node <script>`, thân `<<-` thụt tab, thân thiếu dòng đóng, và thân KHÔNG nháy chứa `$(node <script> --root .)`, (iii) 6 lời gọi thật chặn nhầm, (v) «kiểm cú pháp rồi chạy thật» `node --check <script> && node <script> --write` cho cả ba script, (iv) bốn lời gọi âm đã có (`grep -n s4-args …`, `cat …/repin-lane.mjs`, `node --test …repin-lane-lop-cu.test.mjs`, `git grep repin-lane`), When phân loại, Then ô chỉ đọc (i), bốn lời gọi thật `--check`/`--help` của (iii) và bốn lời gọi âm trả `null`; mọi ô heredoc (ii), hai lời gọi thật heredoc của (iii) và ô «kiểm cú pháp rồi chạy thật» VẪN bị chặn — heredoc nhắc tên script giữ tài nguyên bị chặn kể cả khi thân chỉ là dữ liệu, giới hạn đã khai, luật «thân là dữ liệu» thu tại điểm dừng-vá (số assert = số ô = 37, in ra); hook thật ở đợt có khoá `s4` do dãy khác giữ thoát 0 và stderr rỗng cho các ô `null`, thoát 2 cho các ô heredoc mang `s4`, trong khi `node <script>` trần thì thoát 2 (đối chứng trên cùng đợt). Tiền đề «`--help` chỉ đọc» được chứng trên script thật: mỗi script trong ba, chạy với `--root <kho thử> --help`, thoát khác 0, stderr nêu «cờ không nhận diện được», cây kho thử không đổi (so băm). Chiều đỏ, tập ô rút bằng code từ ma trận: (a) gỡ nhánh cờ kiểm cú pháp của node → đỏ đúng các ô `--check`/`-c` · (b) đột biến giả lập lại luật «thân heredoc là dữ liệu» (ngừng đọc từ dấu `<<` đầu tiên) → đỏ đúng các ô kỳ vọng bị chặn mà có `<<`. Heredoc và các dạng `<<` không lọt: ma trận chống lọt 15 ô viết trước — here-string `<<<`, thân heredoc đưa cho trình thông dịch đọc stdin (`bash <<…`, `sh -s`, `… | bash`, `node` không tệp script, `bash` kèm cờ mang giá trị `-o pipefail`, `-euo pipefail`, `--rcfile <tệp>`), số học `$((1<<n))` và `(( … << … ))`, chú thích `#` nhắc `<<EOF`, dấu đóng có gạch `EOF-X`, `bash <tệp> <<…` — mỗi ô trả đúng tài nguyên VÀ bộ phân loại ở mốc bản cũ (AC-3) cho cùng kết quả; đột biến (b) đỏ đúng các ô có `<<` của ma trận này.
- AC-3: Given bản ghi hội thoại của máy đo và script `tests/dieu-phoi/rut-lenh-that.mjs` với danh sách chín định danh (tệp, `tool_use_id`) viết trong script, When chạy script rút, Then nó ghi `tests/dieu-phoi/fixtures/lenh-that-2026-10-11.jsonl` gồm đúng chín dòng (3 nhãn tài nguyên, 6 nhãn `null`), mỗi dòng mang định danh nguồn, nhãn kỳ vọng và lời gọi đã ẩn danh (không còn tên người dùng của máy, không còn đường scratchpad); chạy lần hai cho tệp giống hệt (so băm); ca kiểm nguồn so tệp ca đã commit bằng nhau với đầu ra script khi máy có bản ghi, và in «bỏ qua: không có bản ghi hội thoại» khi thiếu thư mục bản ghi hoặc thiếu một tệp nguồn nào (máy khác, bản ghi đã dọn) — không đỏ. Nhãn so với bản mới: nhãn của tệp ca, trừ hai lời gọi heredoc chặn nhầm mang nhãn «bị chặn» (giới hạn đã khai của AC-2). Mốc bản cũ của mọi ca so sánh là một commit CỐ ĐỊNH của nhánh chính trước DP6 (`08ba287d`, merge PR #307), không phải merge-base sống — ca kiểm chứng mốc là tổ tiên của HEAD, và đối chứng: merge-base sống trong tình huống sau khi gộp (merge-base của HEAD với chính nó) cho 0 dòng lệch, tức cách ấy đỏ trên nhánh chính. Bộ phân loại ở mốc bản cũ (git archive trọn `dieu-phoi/`) cho kết quả SAI ở bảy dòng — ba lời gọi S4 bỏ lọt và bốn lời gọi `--check`/`--help` chặn nhầm (đối chứng rằng chúng đúng là ca lệch); bộ phân loại sau thay đổi cho đúng nhãn ở cả chín.
- AC-4: Given một đợt có khoá `s4` do dãy P2 giữ, dựng trong một kho thử mà đường có dấu cách và ký tự `$` (và một kho mà đường chỉ có dấu cách), When hook thật chặn một lệnh S4 từ worktree của dãy P1 và một lệnh S4 từ gốc kho (ngoài mọi dãy), Then lời chặn của ca P1 giữ nguyên câu cũ và câu «chờ lượt» của DP7 (AC-6) làm tiền tố, rồi nêu thêm đúng một lệnh xin lượt `node <lõi> xin s4` — lõi của đợt khi đợt đã `chay`, không thì lõi của gói — với đường bọc an toàn cho shell; lời chặn của ca gốc kho y như merge-base và không nêu lệnh xin; đợt có `hang-viec.json` không đọc được thì cũng không nêu lệnh xin (lệnh ấy cũng không chạy được ở đó); lệnh `xin` RÚT từ lời chặn (không chép tay), chạy bằng shell từ worktree P1, thoát 0 và tạo đúng `xin/P1-s4.json` mà `kiemDon` nhận (round-trip lời chặn → bên ghi thật).
- AC-5: Given ma trận viết trước 2 loại thông báo (`permission_prompt`, `idle_prompt`) × 3 trạng thái dãy (không chờ gì · còn đơn `xin/` · còn yêu cầu chưa trả lời) = 6 hàng, When hook thật nhận `Notification` từ worktree của dãy P1, Then `permission_prompt` ghi `cho-nguoi/P1.json` ở cả 3 trạng thái; `idle_prompt` ghi ở «không chờ gì» và không ghi ở hai trạng thái còn lại (luật cũ giữ nguyên); số assert = 6. Chiều đỏ: bản sao khôi phục lệnh trả sớm cho mọi loại → hàng (`permission_prompt`, còn đơn) và (`permission_prompt`, còn yêu cầu) đỏ, bốn hàng kia không.
- AC-6: Given một đợt dựng bằng `mo` thật, When hook thật ghi `cho-nguoi/P1.json` từ một `Notification` `permission_prompt` (tin 300 ký tự) rồi một nhịp của bộ phát lịch thật chạy, rồi một nhịp nữa, Then `su-kien.jsonl` có đúng MỘT dòng `loai: "cho-nguoi"` mang `can_phan: true`, `phien: "P1"`, `loai_cho: "permission_prompt"` và `tin` ≤ 200 ký tự; dòng đó khớp MỌI bộ lọc Monitor rút từ `mo-dot.md` và `tiep-tuc.md` (số bộ lọc rút được = 2; chạy chính `grep` đó trên dòng); `viecCho` của DP3 liệt kê việc chờ này đúng một lần. Đợt nâng: đợt dựng và chạy nhịp bằng bộ phát lịch ở mốc bản cũ của AC-3 (git archive trọn `dieu-phoi/`), có sẵn một tệp chờ người, rồi một nhịp của bản mới → nhịp thoát bình thường, `nhip_cuoi` tiến, không thêm dòng `cho-nguoi` nào cho tệp bản cũ đã báo; sau đó tệp chờ người ấy được hook thật của bản mới ghi lại (lúc mới) và một nhịp → đúng 1 dòng mới mang `can_phan` (đối chứng dương trên cùng đợt). Chiều đỏ: bản sao bỏ `can_phan` → ca đỏ nêu «bộ lọc Monitor không khớp» kèm tên tệp lệnh.
- AC-7: Given cây sau thay đổi, When chạy suite `tests/dieu-phoi/**`, Then mọi ca DP1, DP2, DP3 (và DP4, DP7 khi đã gộp) có ở điểm rẽ của nhánh DP6 xanh nguyên tên; `tests/dieu-phoi/loi/` không đổi so với điểm rẽ ấy — hai lời hứa neo vào LỊCH SỬ (khuôn DP3-11/DP7-10): commit gộp nhánh DP6 có trong lịch sử thì so [điểm rẽ hai cha, cha-2], chưa gộp thì so [merge-base, HEAD]; chiều đỏ trên kho git dựng bằng code (gộp nhánh DP6 rồi một vòng sau chạm `loi/`): neo lịch sử xanh, merge-base sống đỏ; ca nào phải đổi vì sự kiện `cho-nguoi` có thêm khoá thì có dòng sổ nêu tên ca và lý do; ở kho không có đợt, hook chặn S4 và hook chờ người im (thoát 0, stderr rỗng, cây không đổi — DP1-02 không đổi). Bộ phân loại không ném với từ lệnh trùng khoá của `Object.prototype` (`constructor`, `toString`, `valueOf`, `hasOwnProperty`, `__proto__`, `isPrototypeOf` — đứng đầu lệnh, sau vỏ bọc, làm tên script): trả `null`, còn heredoc ghi một class JS rồi chạy `node <script>` vẫn trả tài nguyên; hook ở kho không đợt im với lệnh ấy, ở đợt có khoá của dãy khác thì chặn; bộ phân loại ném vì lỗi chưa biết (tiêm trên bản sao) thì hook ngoài đợt im, trong đợt chặn để an toàn với thông điệp «lỗi nội bộ».
- AC-8: Given cây kit, When đọc `dieu-phoi/README.md`, spec workflow §12 và hạt giống `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`, Then README có mục nêu: hook chặn S4 nhận vỏ bọc mang cờ và bỏ qua `--check`/`-c`, `--help`, còn heredoc nhắc tên script giữ tài nguyên vẫn bị chặn kể cả khi thân chỉ là dữ liệu (giới hạn đã khai kèm ngưỡng); lời chặn nêu lệnh xin lượt; hộp xin quyền luôn thành việc chờ người và đánh thức giám sát; giới hạn đã khai kèm ngưỡng (design §6, gồm «chưa đo: hộp quyền của tác tử Workflow»); §12.2 của spec workflow sửa cho khớp hai chỗ đi lệch ở design §3 và trỏ design doc này cùng hạt giống; hạt giống mang dòng `Gốc:` trỏ `_acceptance/dieu-phoi-lop-mod/`.

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix.

- Chân sản phẩm: [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md] §12 (đã duyệt), [SUY-TỪ-REPO: dieu-phoi/scripts/phan-loai-s4.mjs], [SUY-TỪ-REPO: dieu-phoi/scripts/hook-cho-nguoi.mjs], [SUY-TỪ-REPO: dieu-phoi/scripts/phat-lich.mjs] và số đo 11/10 trên bản ghi thật (design §2.1).
- Chân ngành: [NGÀNH: GNU coreutils — `timeout(1)`, `env(1)`, `nice(1)`; BSD `env(1)` của macOS (`-0iv`, `-u name`, `-C altwd`, `-P altpath`, `-S string`, đọc bằng `man env` trên máy 11/10), `caffeinate(8)` (`-disu`, `-t`, `-w`)] cho cú pháp vỏ bọc mang cờ; [NGÀNH: POSIX shell — mục «Here-Document» của Shell Command Language: thân là dữ liệu, thân không nháy vẫn được mở rộng tham số và thay lệnh] cho luật heredoc.

Trục:
- Trục A · điểm chạm: bộ phân loại | lời chặn của hook | hook chờ người | bộ phát lịch (sự kiện) | tài liệu. [thước CE: spec workflow §12.2 hai dòng «Chặn S4», «Tự bắt việc chờ người»; design §4]
- Trục B · hình lời gọi (H2): chạy thật trần | qua vỏ bọc không cờ | qua vỏ bọc có cờ mang giá trị | qua `bash -c` / `env -S` | thân heredoc (có nháy, không nháy, `<<-`, thiếu dòng đóng) | chỉ đọc bằng cờ của node | chỉ đọc bằng `--help` | lệnh khác nhắc tên script. [thước CE: bản ghi thật 11/10 + man page của vỏ bọc + POSIX Here-Document]
- Trục C · trạng thái dãy và đợt: kho không đợt | đợt không khoá | khoá do dãy khác | khoá do chính dãy | dãy còn đơn chờ | dãy còn yêu cầu chờ | đợt nâng từ bộ phát lịch cũ. [thước CE: design §2.2 + ma trận DP3 AC-3]

Phân loại:
- **Core:** A=bộ phân loại × B (vỏ bọc) → AC-1 · A=bộ phân loại × B (heredoc, chỉ đọc, âm) → AC-2 · lời gọi thật rút từ bản ghi → AC-3 · A=lời chặn → AC-4 · A=hook chờ người × C (không chờ / còn đơn / còn yêu cầu) → AC-5 · A=bộ phát lịch × C (đợt thường / đợt nâng) → AC-6 · không vỡ DP1–DP4, kho không đợt → AC-7 · tài liệu → AC-8.
- **Later:**
  - Vế 1 của câu giao (khung trạng thái trong app), đo sống §12.3, răng của mod — hạt giống `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`, chờ DP4.
  - Hộp quyền của tác tử Workflow có tới hook chờ người không — đo cùng hạt giống ấy (câu 1 của §12.3).
- **Never:**
  - Mod chặn S4 hoặc tự ghi đơn `xin/` khi chặn — design §3: cùng hàm với hook thì cùng quyết định; tự ghi đơn khuếch đại phân loại sai thành khoá cấp oan.
  - Báo giám sát bằng `session.send` từ phiên thợ — C2 đã làm Monitor thức.
  - Hook `Stop` bắt «kết lượt chờ người» — lợi ≤ 60″ so với `idle_prompt`, giá một hook mỗi lượt.
  - Trình phân tích shell đầy đủ (biến mở rộng thành tên script, `eval`, alias) — giới hạn đã khai có ngưỡng (design §6).
- **Cross-cutting:** ma trận viết trước, số assert = số ô, cho mọi tiêu chí nhiều ô (AC-1, AC-2, AC-5); tập ô của mỗi đột biến rút bằng code từ ma trận; round-trip từ bên viết thật sang bên đọc thật ở AC-3 (bản ghi → tệp ca → bộ phân loại), AC-4 (lời chặn → `xin`), AC-6 (hook → bộ phát lịch → bộ lọc Monitor); kho không đợt im ở AC-7.

## Out of scope

- Vế 1 của câu giao — dải trạng thái trên ô nhập, pane, `/dieu-phoi:xem` không qua model, CLI `xem --json` — và đo sống §12.3: hạt giống `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`.
- Mod đọc mức dùng, khung mod, ca quét «không bao giờ cho phép» — DP4.
- Thợ đứng im với đơn trong `xin/` mà không còn lệnh nền chờ — không phải «chờ người»; ghi hạt giống nếu đợt thử vấp.
- Đổi luật `idle_prompt` khi dãy còn đơn hoặc yêu cầu chờ — giữ nguyên (thợ rảnh chờ lượt là đúng).
- `danh-thuc` và lịch 30′ của DP3 — không đổi.

## Notes

- Hai chỗ đi lệch spec §12.2 (design §3) là lựa chọn máy trong khung đã duyệt, căn cứ là luật đã khai (giữ đơn
  giản; mỗi tệp trao tay một bên viết là CLI; hook không nhường mod); mỗi chỗ một dòng sổ `approach`. Phép tách
  phạm vi là quyết định của Điều phối M5, một dòng sổ `descope`. Cửa veto mở ở Cổng Phạm vi.
- S3 bắt đầu sau khi gộp `origin/main` có DP3 (PR #303) vào nhánh bằng merge; không chờ DP4.
- Giới hạn đã khai: ca kiểm nguồn của AC-3 chỉ chạy trên máy có bản ghi hội thoại; CI in «bỏ qua».
- Giới hạn đã khai: hộp quyền của tác tử Workflow có tới hook chờ người không — chưa đo; ngưỡng mở lại: đợt thử
  crm có ≥ 1 lượt S4 đứng vì hộp quyền mà không có tệp chờ người.
- Giới hạn đã khai (thu tại điểm dừng-vá 11/10, sổ dòng 20): heredoc nhắc tên script giữ tài nguyên bị chặn kể cả
  khi thân chỉ là dữ liệu — 2 trên 46.801 lời gọi Bash đo 11/10; thợ viết tệp bằng công cụ Write thay `cat <<EOF`.
  Ngưỡng mở lại (khuôn danh sách đóng bên tiêu thụ, ghi ở hạt giống): một lần đo lại bản ghi theo design §2.1 thấy
  > 10 lời gọi heredoc chặn nhầm.
- Giới hạn đã khai: bộ phân loại là bộ đọc cú pháp shell rút gọn; ngưỡng: ≥ 1 lời gọi S4 thật lọt qua hook trong
  đợt thử.
