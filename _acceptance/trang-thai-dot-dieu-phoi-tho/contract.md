---
schema_version: 1
feature: «Trạng thái đợt Điều phối – Thợ hiện ngay trong app, không phải mở trang hay dò nhật ký»
slug: trang-thai-dot-dieu-phoi-tho
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, ui]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-12-trang-thai-dot-dieu-phoi-tho-design.md
approved_by: manh
approved_at: 2026-10-12
---

# Acceptance Contract: trang-thai-dot-dieu-phoi-tho

## Context

Đây là hàng DP6b: phần mod của DP6, tách ra ngày 11/10 vì phải chờ khung mod của DP4. Trạng thái đợt Điều phối – Thợ
hiện sẵn trong app qua ba đường:
- lệnh `dieu-phoi.mjs xem --json`;
- một dải một dòng trên ô nhập, bấm thì mở pane;
- lệnh `/dieu-phoi:xem`, trả lời không qua model.

Mod chỉ đọc qua CLI và vẽ, theo chính sách «mod chỉ vẽ» chủ kho ký ở Cổng Đáng 12/10. Đợt crm 04/10 có 20/33 tin chủ
kho gửi điều phối là hỏi trạng thái.

Nguồn đầu vào: `_acceptance/trang-thai-dot-dieu-phoi-tho/opportunity.md` (Cổng Đáng: build) · hạt giống
`docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` · thiết kế `docs/superpowers/specs/2026-10-12-trang-thai-dot-dieu-phoi-tho-design.md`.

Thuật ngữ:
- **kho thử có đợt** = thư mục git tạm dựng bằng CLI thật của gói (`mo` rồi `pha dang-chay`), hàng việc có dãy P1–P8
  với worktree thật, `trang-thai.json` chép từ `tests/dieu-phoi/fixtures/dot-crm-0910`.
- **bản cũ** = thư mục `dieu-phoi/` ở commit cố định `f59d9547` (lấy trọn bằng `git archive`, không theo merge-base).
- **engine thật** = Claude Code ≥ 2.1.287 có `plugin test`, tìm như `tests/dieu-phoi/kiem-mod.mjs`.
- **môi trường cô lập** = bỏ mọi biến `CLAUDE_*`/`ANTHROPIC_*`, rồi đặt `CLAUDE_CONFIG_DIR=<thư mục tạm>`,
  `ANTHROPIC_API_KEY=<chuỗi giả>`, `ANTHROPIC_BASE_URL=http://127.0.0.1:9`. Trong môi trường này, mọi lần gọi model đều
  lộ thành `api_error` và không chạm tài khoản nào.

## Criteria

- AC-1: Given kho thử có đợt, When chạy `xem --json` theo ma trận cwd viết sẵn — (a) gốc kho · (b) worktree P3 ·
  (c) thư mục con của worktree P3 · (d) một worktree không thuộc dãy nào — Then:
  - mỗi hàng thoát 0, stderr rỗng, stdout đúng một dòng JSON;
  - các khoá ngoài `day_cua_cwd`, `canh_bao`, `mui_gio_phut` bằng sâu `moHinh(trang-thai.json, { nhom, hangViec })`
    tính trên CÙNG tệp;
  - `day_cua_cwd` lần lượt là `null`, `"P3"`, `"P3"`, `null`;
  - `canh_bao` là `null`;
  - `mui_gio_phut` bằng `-new Date().getTimezoneOffset()` dưới cùng `TZ`, mà test đặt thành `Asia/Ho_Chi_Minh`, tức 420.

  Số assert bằng 4, in ra. Chiều đỏ: bản sao bỏ khoá `day_cua_cwd` → hàng (b) đỏ, nêu «day_cua_cwd».
- AC-2: Given ma trận viết sẵn, When chạy `xem --json`, Then:
  - (a) kho không đợt → stdout đúng từng byte `{"dot":null}\n`, thoát 0, stderr rỗng;
  - (b) cwd là thư mục tạm ngoài git → như (a);
  - (c) đợt chưa có `trang-thai.json` → thoát 0, JSON có `dot` bằng tên đợt, `pha` bằng pha của `dieu-khien.json`,
    `chua_co_nhip: true`;
  - (d) `trang-thai.json` hỏng → thoát 1, stderr bắt đầu `dieu-phoi: `, stdout rỗng.

  Chiều đỏ: bản sao trả `{}` khi không đợt → hàng (a) đỏ, nêu byte nhận được.
- AC-3: Given kho thử, When chạy `xem` KHÔNG cờ bằng gói HEAD và bằng bản cũ trên ma trận — (a) có nhịp · (b) chưa
  có nhịp · (c) không đợt · (d) có nhịp và `.claude/settings.json` còn hook gọi `scripts/dieu-phoi/` — Then stdout,
  stderr và mã thoát của hai bản bằng nhau từng byte ở mọi hàng. Đối chứng dương: hàng (d) in dòng `cảnh báo:`.
  Chiều đỏ: bản sao HEAD đổi một chữ trong `veXem` → hàng (a) đỏ, nêu «(a)» và hai dòng khác nhau.
- AC-4: Given `dieu-phoi/scripts/khung.mjs` và `chuXem` của `mo-hinh.mjs`, When gọi theo ma trận viết sẵn, Then mỗi
  hàng khớp chuỗi chép từ thiết kế §2.2 (không rút từ mã) theo đúng quan hệ hàng đó nêu.

  Ma trận `veDai` (đầu vào dựng tay theo hình của `xem --json`):
  - (a) `{dot:null}` → `null`;
  - (b) `{loi}` → `khung: không đọc được đợt`;
  - (c) chưa có nhịp → bằng `Đợt sau-14-10 · dang-chay · chưa có nhịp`;
  - (d) có nhịp, khoá `s4` của P5 hạn `2026-10-10T00:47:30.085Z`, lệch 420 → chứa `S4: P5 → 07:47`;
  - (e) không khoá `s4` → chứa `S4: trống`;
  - (f) không khoá `s4`, `cho_may` có giá trị → chứa `S4: chờ khoá máy`;
  - (g) `giam_tai: true` → mở đầu `GIẢM TẢI · `;
  - (h) `day_cua_cwd: "P3"` → kết thúc ` · Dãy P3: t173 · dang`;
  - (i) `cot: 40` → dài đúng 40 ký tự, ký tự cuối `…`;
  - (j) hai mục `cho_nguoi` và `can_nguoi` có giá trị → chứa `cần anh 3`;
  - (k) như (d) nhưng lệch 0 → chứa `S4: P5 → 00:47`;
  - (l) như (d) nhưng lệch −300 → chứa `S4: P5 → 19:47`.

  Hai hàng (k), (l) có độ lệch khác `TZ` của tiến trình test, nên giờ phải tính từ `mui_gio_phut`, không từ giờ máy.

  Ma trận `chuXem`:
  - (m) `{dot:null}` → `không có đợt nào đang chạy`;
  - (n) chưa có nhịp → `chưa có nhịp nào · pha dang-chay`;
  - (o) có nhịp → bằng `veXem` của cùng mô hình;
  - (p) `canh_bao` có giá trị → thêm đúng một dòng cuối là `canh_bao`.

  Số assert bằng 16, in ra.

  Round-trip trên kho thử mở bằng `mo sau-14-10`: đầu vào là `JSON.parse` của stdout THẬT mà `xem --json` in ra. Dòng
  mong đợi viết TRỌN tay, số đếm tay từ `trang-thai.json` của fixture (8 đơn chờ, 0 việc chờ người), và so bằng nhau:
  - (R1) có nhịp, cwd gốc kho → `Đợt sau-14-10 · dang-chay · S4: P5 → 07:47 · chờ lượt 8 · cần anh 0`;
  - (R2) có nhịp, cwd worktree P3 → dòng (R1) + ` · Dãy P3: t173 · dang`;
  - (R3) chưa có nhịp → `Đợt sau-14-10 · dang-chay · chưa có nhịp`;
  - (R4) `trang-thai.json` mang `trang_thai: "giam-tai"` → `GIẢM TẢI · ` + dòng (R1);
  - (R5) `trang-thai.json` bỏ khoá `s4` và mang `cho_may: "kho-khac"` →
    `Đợt sau-14-10 · dang-chay · S4: chờ khoá máy · chờ lượt 8 · cần anh 0`.

  `chuXem` cũng round-trip trên kho thử:
  - (R6–R8) với các trạng thái có nhịp, chưa có nhịp và có cảnh báo, `chuXem` của cùng JSON bằng stdout của `xem`
    (bỏ ký tự xuống dòng cuối);
  - (R9) kho không đợt → `dieu-phoi: ` + `chuXem({dot:null})` bằng stderr của `xem`.

  Ngoài ra `khung.mjs` có 0 dòng `import`. Chiều đỏ:
  - bản sao `khung.mjs` bỏ nhánh giảm tải → hàng (g) và (R4) đỏ, nêu tên hàng;
  - bản sao đếm `chờ lượt` từ một khoá khác của mô hình → (R1) đỏ;
  - bản sao tính giờ bằng giờ máy, bỏ qua `mui_gio_phut` → (k) và (l) đỏ, nêu độ lệch.
- AC-5: Given `claude plugin test` của engine thật trên bản sao gói kèm tệp ca dải, With `$.process.run` trả stdout
  THẬT mà `xem --json` in ra trong cùng lượt (kho thử có đợt, cwd là worktree P3), When dựng `AbovePrompt` ở LẦN
  LƯỢT bề mặt `terminal` và `desktop`, Then:
  - `Text` của dải bằng `veDai(cùng JSON, { cot: bodyColumns − 8 })`;
  - có `Button` khoá `xem`, bấm thì một hook bên dưới của `ui.open` nhận `id: 'dieu-phoi-dot'`;
  - stdout là `{"dot":null}` → dải không có `Text` nào của gói;
  - `run` ném lỗi → `Text` là `khung: không đọc được đợt`;
  - `hasSurvey: true` → dải không có `Text` nào của gói.

  Ca nào cũng chạy ở cả hai bề mặt. Chiều đỏ: bản sao `khung.ts` bỏ nhánh `veDai(...) === null → next(e)` → ca không
  đợt đỏ, nêu tên ca.
- AC-6: Given `claude plugin test` với đồng hồ giả, When `session.start` chạy rồi đồng hồ được đẩy tới theo ma trận,
  Then:
  - `session.start` xong mà chưa có lời gọi `process.run` nào;
  - sau 1 ms có đúng một lời gọi:
    - argv bằng `['node', '<gốc gói>/scripts/dieu-phoi.mjs', 'xem', '--json']`;
    - cwd là cwd phiên;
    - `timeoutMs` là 10000;
  - kho có đợt: đẩy thêm 20000 ms → lời gọi thứ hai;
  - kho không đợt: đẩy thêm 20000 ms → vẫn một lời gọi, đẩy tới tổng 120000 ms → lời gọi thứ hai;
  - lời gọi lỗi → lần kế sau 20000 ms.

  Chiều đỏ: bản sao đặt chu kỳ không đợt bằng 20000 → ca không đợt đỏ, nêu «120000».
- AC-7: Given `claude plugin test` như AC-5, When bấm nút `xem` rồi dựng `Pane` `dieu-phoi-dot` ở `terminal` và
  `desktop`, Then:
  - dãy chữ của các `Text` theo thứ tự bằng các dòng của stdout THẬT mà `xem` (không cờ) in ra trên cùng kho thử
    (round-trip CLI → mod);
  - pane dựng trước lần đọc đầu → `đang đọc đợt…`;
  - lỗi đọc → dòng đầu là `khung: không đọc được đợt`.

  Mod không gọi `ui.open` ở `session.start` hay khi hẹn giờ chạy: đếm lời gọi `ui.open` trước lần bấm là 0. Chiều đỏ:
  bản sao gọi `ui.open` trong `session.start` → ca đếm đỏ.
- AC-8: Given engine thật trong môi trường cô lập, When chạy `claude -p "/dieu-phoi:xem" --plugin-dir <bản sao gói>
  --output-format json` theo ma trận kho thử — (a) có nhịp · (b) chưa có nhịp · (c) không đợt · (d) có cảnh báo hai
  bản — Then:
  - mỗi hàng có `is_error: false`, `num_turns: 0`, `total_cost_usd: 0`;
  - `result` bằng đúng `dieu-phoi: ` + chữ `xem` không cờ in cho cùng kho: stdout bỏ ký tự xuống dòng cuối; riêng
    hàng (c) là stderr bỏ tiền tố `dieu-phoi: ` và ký tự xuống dòng cuối.

  Số assert bằng 4, in ra.

  Đường lùi, chạy SAU khi hàng (a) xanh trong cùng lượt: (e) gói CÓ mod, nhưng `trang-thai.json` của kho thử hỏng nên
  CLI thoát 1 như AC-2 (d). Kỳ vọng hook ném lỗi, engine bỏ qua hook và chạy lệnh markdown, tức `num_turns ≥ 1`,
  `terminal_reason: api_error`, và `result` không mở đầu bằng `dieu-phoi: khung`.

  Chiều đỏ, mỗi chiều chạy SAU khi hàng (a) xanh trên cùng kho:
  - bản sao đổi matcher lệnh sang tên khác → `num_turns ≥ 1`, `terminal_reason: api_error`;
  - bản sao gỡ `modules` khỏi `hooks.json`, đúng phiên không có mod → như trên. Lệnh markdown vẫn chạy và đi tới
    model như cũ.

  Không tìm thấy engine thật → FAIL nêu đúng điều đó.
- AC-9: Given gói và engine thật, When chạy `claude plugin validate --strict --json` và `kiemKhungMod`, Then:
  - bảng `MOD-SU-KIEN` có dòng `./mod/khung.ts` và `register.ts` gọi `dangKyKhung(on)`;
  - `kiemKhungMod` trả rỗng;
  - hợp sự kiện quét chữ bằng tập `validate` thấy;
  - tập `gatingHooks` bằng đúng `[command.run{command=dieu-phoi:xem}]`, và hook đó KHÔNG có `.catch` (`hasCatch:
    false`): hook hỏng phải được engine bỏ qua để lệnh markdown chạy, đường lùi mà AC-8 (e) đo;
  - không dòng nào của bảng chứa sự kiện trong `SU_KIEN_CONG`;
  - chính sách «mod chỉ vẽ»: dòng `calls:` mà `validate` báo cho module không chứa lời gọi ghi hay gửi nào —
    `$.fs.write`, `$.fs.remove`, `$.store.set`, `$.session.send`, `$.session.append`, `$.prompt.submit`, `$.tool.*`,
    `$.command.run`; và mọi argv viết thẳng của `$.process.run` trong `khung.ts` kết thúc bằng `'xem', '--json'`.

  Năm chiều đỏ trên bản sao, mỗi chiều kiểm riêng bước tiêm đã áp:
  - dòng bảng của `khung.ts` thêm `tool.call` cùng `on('tool.call', …)` → lỗi nêu `khung.ts` và `tool.call`;
  - thêm `on('prompt.submit', …)` vào bảng và tệp → `gatingHooks` lệch, nêu `prompt.submit`;
  - thêm một nhánh `decision: 'allow'` → lỗi `hooks/mod/khung.ts:<dòng> trả lời cho phép`;
  - thêm một lời gọi `$.fs.write` vào `khung.ts` → lỗi nêu `$.fs.write`;
  - đổi argv của `$.process.run` thành lệnh con `pha` → lỗi nêu `khung.ts` và argv.

  Ca DP4-12 và DP4-13 của hồ sơ đã ký vẫn xanh.

## Coverage

Quét bằng morphological-scan (preset test-matrix) ở S1. Chân sản phẩm lấy từ repo. Chân ngành: mục thanh trạng thái
VS Code (chữ ngắn cộng lệnh mở chi tiết) và dòng trạng thái tmux (làm mới theo chu kỳ) — một chỉ báo thường trực, bấm
thì mở chi tiết.

- Trục A · bề mặt: `xem --json` | `xem` chữ | dải | pane | lệnh `/dieu-phoi:xem` [thước CE: hạt giống DP6b mục 1–3 ·
  spec workflow §13 hàng «Đang chạy — xem» — SUY-TỪ-REPO]
- Trục B · trạng thái đợt khi đọc: không đợt | chưa nhịp | đang chạy | giảm tải | đọc lỗi [thước CE: các nhánh của
  `xem()` trong `dieu-phoi/scripts/dieu-phoi.mjs` + `giam_tai` của `mo-hinh.mjs` — SUY-TỪ-REPO]
- Trục C · vai phiên theo cwd: gốc kho (giám sát) | worktree của một dãy | worktree ngoài dãy [thước CE:
  `phienCuaCwd` trong `dieu-phoi/scripts/dot.mjs` — SUY-TỪ-REPO]
- Trục D · môi trường chạy: có mod + terminal | có mod + desktop | không mod | engine không chạy được tiến trình
  [thước CE: tài liệu kiểu 2.1.295 D10253/D10310 + giả định 2 của ô]
- Đi chéo mọi ô Core: mod chỉ vẽ (không cổng ngoài lệnh của gói, không «cho phép»); không làm chậm lúc mở phiên; dải
  một dòng theo `bodyColumns`.
- Core → AC: A1×B×C → AC-1, AC-2 · A2×B → AC-3 · A3×B×C → AC-4, AC-5 · nhịp → AC-6 · A4 → AC-7 · A5×B×D(có mod/không
  mod) → AC-8 · đi chéo → AC-9.
- Later — D4: engine không chạy được tiến trình trên desktop → nhánh dự phòng `$.fs` + `moHinh`. Đã khai Known limits, ngưỡng ở Notes.
- Later — dải ở VS Code và mobile: engine không phát `AbovePrompt` ở hai bề mặt này (D10253); hai bề mặt đó vẫn có lệnh và pane.
- Never — mod ghi tệp đợt hay chặn S4: trái chính sách «mod chỉ vẽ».
- Never — pane tự mở khi không ai hỏi: trái lời hứa «được hỏi» của hạt giống.

## Đường đo

- Thước: chủ kho hỏi trạng thái — SỐNG ≤ 2 lần/ngày · iterate ≥ 5 (chép nguyên ngưỡng của ô) · số từ: đếm tay tin chủ kho gửi phiên giám sát trong
  bản ghi phiên của đợt crm đầu tiên chạy bản này, cùng cách finding `docs/findings/2026-10-05-doi-phien-co-dieu-phoi.md`
  §4.4 đã đếm · bảo đảm bởi: đã có sẵn: bản ghi phiên của app
- Thước: dải hiện ở mọi phiên desktop · số từ: mắt chủ kho trong đợt crm đầu tiên (nhãn «chưa nhìn thấy trên desktop»
  của vòng này) · bảo đảm bởi: AC-5 (cây dựng hợp lệ theo bảng phần tử `desktop`); phần sơn thì reality đọc
- Thước: `/dieu-phoi:xem` 0 token model · số từ: `num_turns`/`total_cost_usd` của engine thật · bảo đảm bởi: AC-8
- Thước: dải không lệch `xem` (≥ 3 lần đối chiếu) · số từ: dải và `xem` chạy cùng lúc trong đợt crm · bảo đảm bởi:
  AC-4 và AC-7 (một hàm, round-trip CLI → mod)
- Thước: CHẾT — mod cho một lời gọi công cụ chạy không qua hỏi quyền · số từ: `validate --strict` + `kiemKhungMod` ·
  bảo đảm bởi: AC-9
- Thước: CHẾT — mod treo hay làm chậm phiên · số từ: `session.start` không chờ CLI, `timeoutMs` 10000 · bảo đảm bởi:
  AC-6

## Out of scope

- Đo sống §12.3 câu 1: hộp quyền của tác tử Workflow có tới hook `Notification` không. Ngoài câu giao «trạng thái hiện trong app», nên vẫn ở hạt giống.
- Đo sống §12.3 câu 3 (`session.send` giữa lượt) và câu 4 (mod tự đánh thức thay Monitor). Ngoài câu giao, nên vẫn ở hạt giống.
- Mod ghi tệp đợt, chặn S4, hay nghe `tool.call`, `tool.check`, `classic.*`, `prompt.*`.
- Nhánh dự phòng đọc tệp đợt bằng `$.fs` khi `$.process.run` không chạy trên desktop. Để Later, có ngưỡng ở Notes.
- Sửa `bang.html`, bộ phát lịch, luật heredoc, «S4 tự xưng», hay `can_phan` đánh thức hai lần.
- Đổi chữ của `xem` không cờ, hay đổi `commands/xem.md`.
- Cắt số, gắn tag. Bản phát hành gom về mốc 01/11.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits (nhãn trạng thái, KHÔNG phải việc — chính sách Cổng Đáng):
  - **Chưa nhìn thấy dải trên desktop.** `plugin test` dựng cây theo bảng phần tử `desktop` nhưng không sơn. Engine
    thật chỉ đo ở chế độ không giao diện. Reality đọc nhãn này ở đợt crm đầu tiên.
  - **`$.process.run` trên desktop chưa đo** (giả định 2 của ô). Nếu nó không chạy, dải ghi «khung: không đọc được đợt»
    và lệnh rơi về đường markdown qua model. Ngưỡng mở nhánh `$.fs`: đợt crm đầu tiên thấy dải báo lỗi đọc trên desktop.
- Known limits ghi ở Cổng Bằng chứng lượt 2 (manh, 13/10):
  - **Ngoài-1 — ba ca đỏ KH-04-do mới ghim nhãn hàng, chưa ghim thông điệp** (`tests/dieu-phoi/khung.test.mjs`). Nếu
    bản tiêm làm bộ vẽ dải ném lỗi, mọi hàng đều đỏ nên ca đỏ vẫn xanh. Ca đó không phân biệt «bắt đúng lỗi» với
    «bộ vẽ hỏng». Cùng lớp với nhát sửa sau lượt 1; dừng vá theo điều khoản dừng-vá.
  - **Ngoài-2 — `mo-hinh.mjs` không có răng «không import».** Mod import `chuXem` từ tệp lõi dùng chung này, nhưng
    ca `KH-04 khung-khong-import` chỉ canh `khung.mjs`. Ai thêm `import` vào `mo-hinh.mjs` thì module mod không nạp,
    kéo theo phần đọc mức dùng của DP4, và chỉ lượt chấm có Claude Code mới thấy.
  - **Ngoài-5 — vòng nhịp có thể tắt im, dải giữ dữ liệu cũ** (lỗi ngoài khối try trong `nhip`/`docDot`). Đã mở
    thành hạt giống `docs/plans/2026-10-13-hat-giong-khung-nhip-tat-im.md`.
- Hai thước mod và engine (AC-5 tới AC-9) cần Claude Code trên máy. CI của kit không có, nên chúng chạy ở lượt chấm,
  như `dieu_phoi_mod` và `dieu_phoi_validate` của DP4.
- Repo chưa khai `feature_loop.ui_standards_skill`, nên artifact UI không có đối trọng chuẩn nội. Bảng phần tử của
  engine là ràng buộc nền.
