---
schema_version: 1
feature: Lớp mod của gói `dieu-phoi` (DP6) — trạng thái đợt hiện ngay trong app; S4 bị chặn đúng lệnh, không chặn nhầm lệnh chỉ đọc; thợ chờ người thì giám sát biết ngay, không phải dò nhật ký
slug: dieu-phoi-lop-mod
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, sdk, docs]
status: draft
design_doc: docs/superpowers/specs/2026-10-11-dieu-phoi-lop-mod-design.md
approved_by:
approved_at:
---

# Acceptance Contract: dieu-phoi-lop-mod

## Context

Hàng DP6 của lộ trình kit, dưới Cổng Đáng của ô dù `dieu-phoi-tho-trong-kit` (build 09/10, timebox 07/11).
Câu giao: «Trạng thái đợt hiện ngay trong app; S4 bị chặn đúng lệnh, không chặn nhầm lệnh chỉ đọc; thợ chờ
người thì giám sát biết ngay, không phải dò nhật ký». Ca gốc: crm 10/10 hook chặn S4 chặn nhầm một lệnh chỉ
đọc; đêm 09–10/10 S4 của K3b đứng 2 giờ 30 vì hộp duyệt quyền mà không ai biết. Thiết kế chung đã duyệt 10/10:
spec workflow §12 và §12.3. Thiết kế thi công, số đo 11/10 và ba chỗ đi lệch §12.2: design doc ở frontmatter.

Số đo làm nền (design §2): trên 46.801 lệnh Bash thật, bộ phân loại bỏ lọt 3 lần chạy S4 thật và chặn nhầm 3
lệnh chỉ đọc; sự kiện `cho-nguoi` của bộ phát lịch không mang `can_phan` nên Monitor của giám sát không thức;
`hook-cho-nguoi` nuốt hộp xin quyền khi dãy còn đơn hay yêu cầu chờ; `claude` trên PATH máy M5 là 2.1.281
(chưa có mod).

Thuật ngữ:
- **tài nguyên** = `s4` hoặc `duong-nen`, giá trị mà `phanLoaiLenh` trả; `null` = lệnh không giữ tài nguyên.
- **vỏ bọc** = lệnh đứng trước lệnh thật và chạy nó: `timeout`, `env`, `nice`, `time`, `nohup`, `command`,
  `exec`, `caffeinate`. **cờ mang giá trị** = cờ của vỏ bọc ăn từ kế tiếp (`env -u TÊN`, `timeout -s SIG`,
  `nice -n N`…).
- **hook thật** = lệnh hook rút từ `dieu-phoi/hooks/hooks.json` (thay `${CLAUDE_PLUGIN_ROOT}`), chạy bằng
  tiến trình con với stdin JSON.
- **bộ lọc Monitor** = chuỗi `grep` trong lệnh giăng Monitor của `dieu-phoi/commands/mo-dot.md` và
  `tiep-tuc.md`, rút nguyên văn lúc chạy.
- **mô hình đợt** = kết quả `moHinh` của `dieu-phoi/scripts/mo-hinh.mjs`.
- **dải** = phần tử mod vẽ trên ô nhập (`AbovePrompt`); **pane** = khung mod mở bằng `$.ui.open`.
- **bộ kiểm mod** = `claude plugin validate --strict --json` và `claude plugin test` của một bản Claude Code
  ≥ 2.1.287.

## Criteria

- AC-1: Given ma trận viết trước gồm 41 dạng vỏ bọc của design §4 C1 (bảng 8 vỏ bọc, kể cả cờ mang giá trị `timeout -s/-k`, `env -u/-C/-P/-S`, `nice -n`, `exec -a`, `caffeinate -t/-w`) nhân với mỗi script giữ tài nguyên (`repin-lane.mjs` → `s4`, `s4-args.mjs` → `s4`, `duong-nen.mjs` → `duong-nen`), cộng nguyên văn đã ẩn danh của ba lệnh bỏ lọt đo 11/10 và hai chuỗi vỏ bọc lồng, When phân loại bằng `phanLoaiLenh`, Then mỗi ô trả đúng tài nguyên (số assert = số ô = 128, in ra); hook thật ở một đợt có khoá `s4` do dãy khác giữ thì thoát 2 cho mọi ô `s4`, và thoát 0 khi khoá thuộc chính dãy gọi (đối chứng). Chiều đỏ, mỗi đột biến chạy trên bản sao sau khi bản lành xanh: (a) gỡ `timeout` khỏi bảng vỏ bọc → đỏ ĐÚNG tập ô chứa token `timeout`, tập này rút bằng code từ ma trận (in số; kiểm 0 < số < tổng) · (b) khai `caffeinate -t` là cờ trần → đỏ đúng tập ô chứa `caffeinate -t`.
- AC-2: Given ma trận viết trước gồm lệnh chỉ đọc — `node --check <script>`, `node -c <script>`, `node <script> --help` cho cả ba script, nguyên văn đã ẩn danh của ba lệnh chặn nhầm đo 11/10 — và bốn lệnh âm đã có (`grep -n s4-args …`, `cat …/repin-lane.mjs`, `node --test …repin-lane-lop-cu.test.mjs`, `git grep repin-lane`), When phân loại, Then mỗi ô trả `null` (số assert = số ô = 16, in ra); hook thật ở đợt có khoá `s4` do dãy khác giữ thoát 0 và stderr rỗng cho các ô đó, trong khi cùng script không cờ chỉ đọc thì thoát 2 (đối chứng trên cùng đợt). Tiền đề «`--help` chỉ đọc» được chứng trên script thật: mỗi script trong ba, chạy với `--root <kho thử> --help`, thoát khác 0, stderr nêu «cờ không nhận diện được» và cây kho thử không đổi (so băm). Chiều đỏ: bản sao gỡ nhánh cờ kiểm cú pháp của node (`--check` và `-c`) → đỏ ĐÚNG tập ô chứa `--check` hoặc `-c` của node, rút bằng code từ ma trận (in số; kiểm 0 < số < tổng).
- AC-3: Given một đợt có khoá `s4` do dãy P2 giữ, dựng trong một kho thử mà đường có dấu cách và ký tự `$`, When hook thật chặn một lệnh S4 từ worktree của dãy P1 và một lệnh S4 từ gốc kho (ngoài mọi dãy), Then stderr của ca P1 chứa lệnh xin lượt `node <thư mục đợt>/loi/dieu-phoi.mjs xin s4` với đường thật của lượt chạy được bọc an toàn cho shell, và không còn chuỗi «Ghi đơn xin/»; stderr của ca gốc kho nói chỉ phiên thợ của một dãy xin được lượt và không nêu lệnh `xin`; lệnh `xin` RÚT từ stderr (không chép tay), chạy bằng shell từ worktree P1, thoát 0 và tạo đúng `xin/P1-s4.json` mà `kiemDon` nhận (round-trip lời chặn → bên ghi thật).
- AC-4: Given ma trận viết trước 2 loại thông báo (`permission_prompt`, `idle_prompt`) × 3 trạng thái dãy (không chờ gì · còn đơn `xin/` · còn yêu cầu chưa trả lời) = 6 hàng, When hook thật nhận `Notification` từ worktree của dãy P1, Then `permission_prompt` ghi `cho-nguoi/P1.json` ở cả 3 trạng thái; `idle_prompt` ghi ở «không chờ gì» và không ghi ở hai trạng thái còn lại (luật cũ giữ nguyên); số assert = 6. Chiều đỏ: bản sao khôi phục lệnh trả sớm cho mọi loại → hàng (`permission_prompt`, còn đơn) và (`permission_prompt`, còn yêu cầu) đỏ, bốn hàng kia không.
- AC-5: Given một đợt dựng bằng `mo` thật, When hook thật ghi `cho-nguoi/P1.json` từ một `Notification` `permission_prompt` (tin 300 ký tự) rồi một nhịp của bộ phát lịch thật chạy, rồi một nhịp nữa, Then `su-kien.jsonl` có đúng MỘT dòng `loai: "cho-nguoi"` mang `can_phan: true`, `phien: "P1"`, `loai_cho: "permission_prompt"` và `tin` ≤ 200 ký tự; dòng đó khớp MỌI bộ lọc Monitor rút từ `mo-dot.md` và `tiep-tuc.md` (số bộ lọc rút được = 2; chạy chính `grep` đó trên dòng); `viecCho` của DP3 liệt kê việc chờ này đúng một lần. Đợt nâng: đợt dựng và chạy nhịp bằng bộ phát lịch của merge-base (git archive trọn `dieu-phoi/`), có sẵn một tệp chờ người, rồi một nhịp của bản mới → nhịp thoát bình thường, `nhip_cuoi` tiến, 0 dòng `cho-nguoi` (nạp im); sau đó một tệp chờ người MỚI của P3 và một nhịp → đúng 1 dòng mang `can_phan` (đối chứng dương trên cùng đợt). Chiều đỏ: bản sao bỏ `can_phan` → ca đỏ nêu «bộ lọc Monitor không khớp» kèm tên tệp lệnh.
- AC-6: Given chủ kho đồng ý ở Cổng Phạm vi cho mod thăm dò chỉ quan sát `dp6-tham-do` trong phiên DP6 (design §6), When chạy bốn kịch bản của design §6, Then `_acceptance/dieu-phoi-lop-mod/evidence/tham-do.jsonl` có nhật ký do mod ghi, mỗi kịch bản có dòng mở và đóng; `tham-do-12-3.md` có bảng năm hàng (bốn câu §12.3 + hàng 5 «mod gọi được `node` trên desktop»), mỗi hàng một kết quả kèm nguồn `tham-do.jsonl#L<n>` nằm trong cửa sổ của đúng kịch bản, hoặc trích tài liệu kiểu có số dòng; §2.5 của design khớp bảng. Câu 1 chỉ được kết luận khi đối chứng dương có mặt — dòng `tool.call` mang `agentId` của tác tử Workflow với kết quả bị người từ chối trong cửa sổ kịch bản 1 — và quyết một trong hai nhánh: có dòng `classic.Notification` `permission_prompt` trong cửa sổ đó thì README gói ghi «C2 phủ hộp quyền của tác tử Workflow»; không có thì README khai «mù: hộp quyền của tác tử Workflow» kèm ngưỡng mở lại. Hàng 5 «không gọi được» thì C3 đi nhánh dự phòng của design, có dòng sổ `revisit`. Thư mục mod thăm dò không còn trên đĩa sau lần đo. Chủ kho không đồng ý, hoặc đối chứng dương không có sau hai lần → các hàng ghi «không đo» kèm lý do, README khai cả hai giới hạn (câu 1 và phiên mở từ chip).
- AC-7: Given một đợt dựng bằng `mo` thật có khoá `s4` do P2 giữ, một đơn chờ, một tệp chờ người, When chạy `dieu-phoi.mjs xem --json` từ worktree P1 và từ gốc kho, Then đầu ra là JSON của mô hình đợt — so bằng nhau với `moHinh` của cùng `trang-thai.json` và `hang-viec.json` — cộng `day_cua_cwd` (`"P1"` từ worktree P1, `null` từ gốc kho); các số khoá, chờ lượt, chờ người trong JSON bằng các số trong dòng `xem` thường của cùng đợt; kho không có đợt → in `{"dot":null}` và thoát 0. `xem` không cờ in như trước (so bằng nhau với đầu ra của merge-base trên cùng đợt).
- AC-8: Given đầu ra `xem --json` thật của ba đợt sinh trong lượt — (a) đợt có khoá `s4` của P2 tới 14:30 (giờ địa phương, ca ghim `TZ`), 2 đơn chờ, 1 chờ người, gọi từ worktree P1 · (b) cùng đợt gọi từ gốc kho · (c) đợt đang giảm tải — và đầu ra của kho không đợt (d), When hàm vẽ thuần của khung (`dieu-phoi/scripts/khung.mjs`) dựng dải, và mod được mount qua `claude plugin test` trên CẢ hai bề mặt `terminal` và `desktop` với `process.run` trả đúng các đầu ra đó, Then văn bản dải BẰNG dòng viết trước của từng hàng — (a) `Đợt <tên> · <pha> · S4: P2 → 14:30 · chờ lượt 2 · cần anh 1` rồi `Dãy P1: <hàng> · <tiến độ>` · (b) như (a) bỏ dòng `Dãy` · (c) mở đầu `GIẢM TẢI` · (d) không vẽ gì — và hai bề mặt cho cùng kết quả; lời gọi `process.run` mà mod gửi được ghi lại và bằng `['node', <plugin.root>/scripts/dieu-phoi.mjs, 'xem', '--json']` với `cwd` = cwd của phiên; `process.run` trả lỗi → dải hiện một dòng «khung: không đọc được đợt». Dữ liệu mẫu của ca `plugin test` so bằng nhau với đầu ra CLI thật sinh lại trong cùng lượt (lệch → đỏ «dữ liệu mẫu cũ hơn CLI»). Chiều đỏ: bản sao mod bỏ `cwd` khỏi lời gọi → ca đỏ nêu «cwd».
- AC-9: Given mod nạp qua `claude plugin test` với đầu ra `xem --json` của đợt (a) ở AC-8, When chạy lệnh `/dieu-phoi:xem` và khi bấm nút «xem» trên dải, Then lệnh trả `{ text }` bằng đúng `veXem` của cùng mô hình mà không gọi model, và cả hai đường mở pane chứa khoá đang giữ kèm hạn thuê, hàng chờ lượt, việc cần anh kèm liên kết phiên và từng dãy; tệp `dieu-phoi/commands/xem.md` không đổi so với merge-base (phiên không có mod chạy nó như cũ). Nếu hook `command.run` không trả lời được lệnh markdown của chính gói, mod đăng ký lệnh riêng `dot` và vế «lệnh» của tiêu chí đo trên `/dot` — đổi đường phải có dòng sổ `revisit`.
- AC-10: Given gói `dieu-phoi` sau thay đổi, When chạy bộ kiểm mod (bản tìm theo thứ tự `DIEU_PHOI_CLAUDE_BIN` → bản của app desktop → `claude` trên PATH nếu ≥ 2.1.287), Then báo cáo validate sạch lỗi; tập sự kiện mà các tệp mod của DP6 nghe ⊆ {`session.start`, `ui.render`, `ui.press`, `command.run`} (đẳng thức tập in ra) — không có `tool.call`, `tool.check`, `classic.PreToolUse`, `classic.PermissionRequest`; `hooks.json` vẫn khai `PreToolUse` → `hook-chan-s4.mjs` cho `Workflow|Bash`; không tệp nào của gói đọc một tệp dấu do mod ghi; răng T11 của DP4 xanh trên cả tệp của DP6. Không tìm được bản ≥ 2.1.287 → ĐỎ nêu lý do, không bao giờ xanh khi chưa chạy. Chiều đỏ: bản sao thêm một hook `tool.check` vào tệp khung → đỏ nêu tệp và «tool.check».
- AC-11: Given cây sau thay đổi, When chạy suite `tests/dieu-phoi/**`, Then mọi ca DP1, DP2, DP3 (và DP4 khi đã gộp) xanh nguyên tên; `tests/dieu-phoi/loi/` không đổi so với merge-base; ca nào phải đổi vì sự kiện `cho-nguoi` có thêm khoá thì có dòng sổ nêu tên ca và lý do; ở kho không có đợt, hook chặn S4 và hook chờ người im (thoát 0, stderr rỗng, cây không đổi — DP1-02 không đổi).
- AC-12: Given cây kit, When đọc `dieu-phoi/README.md` và spec workflow §12, Then README có mục «Lớp mod» nêu: điều kiện bản (app ≥ 2.1.286, CLI ≥ 2.1.287), mod làm gì (dải, pane, `/dieu-phoi:xem` không qua model), mod KHÔNG làm gì (không chặn S4, không trả «cho phép», không ghi tệp đợt), và các giới hạn đã khai kèm ngưỡng (design §7 và nhánh của AC-6); §12.2 của spec workflow sửa cho khớp ba chỗ đi lệch ở design §3.1 (dòng «Chặn S4», «Tự bắt việc chờ người») và trỏ design doc này.

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix.

- Chân sản phẩm: [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md] §12 (đã duyệt), [SUY-TỪ-REPO: dieu-phoi/scripts/phan-loai-s4.mjs], [SUY-TỪ-REPO: dieu-phoi/scripts/hook-cho-nguoi.mjs], [SUY-TỪ-REPO: dieu-phoi/scripts/phat-lich.mjs] và số đo 11/10 trên 46.801 lệnh thật (design §2.1).
- Chân ngành: [NGÀNH: GNU coreutils — `timeout(1)`, `env(1)`, `nice(1)`; BSD `env(1)` của macOS (`-0iv`, `-u name`, `-C altwd`, `-P altpath`, `-S string`, đọc bằng `man env` trên máy 11/10), `caffeinate(8)` (`-disu`, `-t`, `-w`)] cho cú pháp vỏ bọc mang cờ; [NGÀNH: Claude Code 2.1.295 — bảng phần tử `AbovePrompt` (terminal, desktop) và luật đặt pane 144 cột trong `claude-code.d.ts`] cho bề mặt khung.

Trục:
- Trục A · điểm chạm: bộ phân loại (lõi Node) | lời chặn của hook | hook chờ người | bộ phát lịch (sự kiện) | CLI `xem --json` | dải | pane | lệnh `/dieu-phoi:xem` | bộ kiểm mod | tài liệu. [thước CE: spec workflow §12.2 bốn chỗ dùng + §16 T8; design §4]
- Trục B · hình lệnh (H2): chạy thật trần | qua vỏ bọc không cờ | qua vỏ bọc có cờ mang giá trị | qua `bash -c` / `env -S` | chỉ đọc bằng cờ của node | chỉ đọc bằng `--help` | lệnh khác nhắc tên script. [thước CE: corpus 46.801 lệnh 11/10 + man page của vỏ bọc]
- Trục C · trạng thái dãy và đợt: kho không đợt | đợt không khoá | khoá do phiên khác | dãy còn đơn chờ | dãy còn yêu cầu chờ | giảm tải | đợt nâng từ bộ phát lịch cũ. [thước CE: §2.2 design + ma trận DP3 AC-3]
- Trục D · bản và bề mặt: CLI không mod (2.1.281) | terminal có mod | desktop có mod, phiên người mở | desktop có mod, phiên mở từ chip. [thước CE: design §2.3, §2.5 câu 2]

Phân loại:
- **Core:** A=bộ phân loại × B (mọi giá trị) → AC-1, AC-2 · A=lời chặn → AC-3 · A=hook chờ người × C (không chờ / còn đơn / còn yêu cầu) → AC-4 · A=bộ phát lịch × C (đợt thường / đợt nâng) → AC-5 · §12.3 → AC-6 · A=`xem --json` × C → AC-7 · A=dải × C × D (terminal, desktop) → AC-8 · A=pane, lệnh → AC-9 · A=bộ kiểm mod → AC-10 · không vỡ DP1–DP4, kho không đợt → AC-11 · tài liệu → AC-12.
- **Later:**
  - D=desktop, phiên mở từ chip: không đo được bằng hot reload (chỉ phiên DP6 nạp mod) — đo ở đợt thử crm ~26/10 (design §7).
  - Thay Monitor bằng mod tự đánh thức — đo ở AC-6 câu 4, dựng ở hạt giống nếu đo được.
- **Never:**
  - Mod chặn S4 hoặc tự ghi đơn `xin/` khi chặn — design §3.1: cùng hàm với hook thì cùng quyết định; tự ghi đơn khuếch đại phân loại sai thành khoá cấp oan.
  - Báo giám sát bằng `session.send` từ phiên thợ — C2 đã làm Monitor thức; địa chỉ phiên không đối chiếu được với `vai.json`.
  - Hook `Stop` bắt «kết lượt chờ người» — lợi ≤ 60″ so với `idle_prompt`, giá một hook mỗi lượt.
  - D=CLI không mod × dải/pane — điều kiện bản, không phải lỗi; phiên đó vẫn có `xem` qua model và `bang.html`.
- **Cross-cutting:** ma trận viết trước, số assert = số ô, cho mọi tiêu chí nhiều ô (AC-1, AC-2, AC-4, AC-8); round-trip từ bên viết thật sang bên đọc thật ở AC-3 (lời chặn → `xin`), AC-5 (hook → bộ phát lịch → bộ lọc Monitor), AC-7/AC-8 (CLI → hàm vẽ → mod); kho không đợt im ở AC-7, AC-8, AC-11.

## Out of scope

- Mod đọc mức dùng (`session.measure`, `han-muc`) — DP4.
- Khung mod (mục `modules` của `hooks.json`, tệp đăng ký), ca quét «không bao giờ cho phép» và bộ tìm bản `claude` — DP4; DP6 nối vào và chạy lại răng của DP4.
- Thay Monitor bằng mod tự đánh thức giám sát — chỉ đo (AC-6 câu 4); dựng thì mở từ hạt giống.
- Thợ đứng im với đơn trong `xin/` mà không còn lệnh nền chờ — không phải «chờ người»; ghi hạt giống nếu đợt thử vấp.
- Đổi luật `idle_prompt` khi dãy còn đơn hoặc yêu cầu chờ — giữ nguyên (thợ rảnh chờ lượt là đúng).

## Notes

- Ba chỗ đi lệch spec §12.2 (design §3.1) là lựa chọn máy trong khung đã duyệt, căn cứ là luật đã khai (giữ
  đơn giản; mỗi tệp trao tay một bên viết là CLI; hook không nhường mod); mỗi chỗ một dòng sổ `approach`, cửa veto
  mở ở Cổng Phạm vi.
- S3 chia hai đợt (design §8): lõi Node (AC-1–AC-5, AC-7) không phụ thuộc khung mod; phần mod (AC-8–AC-10) chỉ
  bắt đầu sau khi DP4 gộp vào main và nối vào khung của DP4.
- Giới hạn đã khai: khung không hiện ở phiên CLI < 2.1.287 và app < 2.1.286. Phiên mở từ chip có dải hay không —
  chưa đo; ngưỡng mở lại: đợt thử crm có ≥ 1 phiên thợ không thấy dải.
- Giới hạn đã khai: mỗi phiên trong kho có đợt hỏi CLI 20″ một lần; ngưỡng: đợt thử báo giảm tải vì CPU.
