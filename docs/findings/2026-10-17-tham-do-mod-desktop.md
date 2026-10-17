# Thăm dò mod trên Desktop: bốn kịch bản §12.3 và hai câu cho K1/K2

**Ngày:** 2026-10-17 · **Loại:** đo sống (finding). Tệp này không mở ô.
**Phục vụ:** hạt giống `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` §«Đo sống §12.3» (câu 1–4) và khảo
sát `docs/findings/2026-10-17-mods-claude-code-kien-nghi-cho-kit.md` (câu 5 cho K1, câu 6 cho K2; câu 3 là căn cứ của K3).
**Nơi đo:** app Desktop chạy Claude Code 2.1.295, chế độ quyền `auto`, một phiên worktree. Phiên chạy từ 14:20:54 đến
14:29:05 (giờ UTC trong nhật ký).
**Bằng chứng nằm trong hồ sơ:** thư mục `docs/findings/assets/2026-10-17-tham-do-mod-desktop/` chứa:
- `tham-do.jsonl`: 123 dòng nhật ký mod tự ghi (tệp đầy đủ, không chọn lọc);
- `ban-ghi-phien-trich.jsonl`: 20 dòng trích từ bản ghi phiên do app xuất ra (chỉ những dòng có `dp6` hoặc có thao
  tác hàng đợi);
- mã hai mod: `mod-dp6-tham-do/` và `mod-dp6-goi/`;
- gói `cau5-plugin-test/` kèm `ket-qua.log`.

---

## 0. Đọc trong một phút

| # | Câu hỏi | Kết quả | Đối chứng |
|---|---|---|---|
| 1 | Hộp xin quyền của tác tử Workflow có tới `classic.Notification` / `classic.PermissionRequest` của phiên cha không? | **Không đo được ở chế độ auto: không có hộp nào hiện ra cho người.** Bộ phân loại tự quyết cả hai lần (lần 1 cho phép, lần 2 từ chối). 0 sự kiện `Notification`/`PermissionRequest` trong cả phiên. | **Thiếu đối chứng dương:** cả phiên không có lần nào người được hỏi |
| 2 | `$.ui.open` không do người bấm, trên Desktop: `isPlaced`? `bodyColumns`? | **`isPlaced: true`**, pane đặt kiểu `dock`, **`bodyColumns: 47`** | `ui.panes()` 3″ sau cũng báo `isPlaced: true, isShown: true` |
| 3 | `$.prompt.submit` sau 60″ có đánh thức phiên Desktop không? | **Có.** Gọi đúng 60,0″ sau mốc; phiên đang bận nên lời gọi xếp hàng, và lượt của mod mở ngay khi phiên rảnh (7″ sau) | Lệnh `sleep 240` dự phòng còn 2′53″ mới hết, nên không phải nó đánh thức |
| 4 | `$.process.run(['node','-v'])` có chạy trên Desktop không? | **Có:** thoát 0, in `v24.22.0`, mất 16 ms | — |
| 5 | Hook `command.run` có trả lời được một lệnh markdown mang `disable-model-invocation: true` không? | **Có, nếu lệnh không do chính mod đó gọi.** Gọi từ một mod khác: hook trả lời, model không nhận lượt nào. `plugin test` **không trả lời được câu này** | Đối chứng dương `/dp6-ping` (lệnh mod tự đăng ký) đi cùng chiều ở cả hai lần |
| 6a | `turn.complete` trả `{ text }` có hiện dòng dưới câu trả lời trên Desktop không? | **Có trong bản ghi phiên Desktop**, thành dòng hệ thống ngay sau câu trả lời. Dòng mang tiền tố tên MỌI gói nghe `turn.complete`. **Chưa nhìn bằng mắt** trên màn hình | — |
| 6b | `$.agent.list()` có thấy tác tử Workflow đang chạy không? | **Không:** 0/2 tác tử Workflow có trong danh sách | Đối chứng dương: tác tử con thường (công cụ Agent) có trong danh sách 4/4 lần |

**K2: giữ, thu phạm vi phần «nền».** Dòng cuối lượt viết được. Nhưng `$.agent.list()` mù với tác tử Workflow, nên vế
«nền: n tác tử đang chạy» phải đọc từ sổ chạy của Workflow hoặc từ hồ sơ vòng, không đọc từ danh sách tác tử. Dòng cuối
lượt dùng chung chỗ với các gói khác cũng nghe `turn.complete` (ở đây có thêm `cc-plugin-agents-md`).

**K3: giữ.** Hẹn giờ cộng `$.prompt.submit` mở được một lượt khi phiên hết bận, mà không có người. Lượt ấy tới model kèm
dòng «The dp6-tham-do plugin sent a message», nên model biết đó không phải lời người.

Thêm cho K1: hướng K1 đứng được, vì khoá `disable-model-invocation` không chặn hook trả lời. Cạm bẫy phải ghi vào thiết
kế: lệnh do chính gói đó gọi bằng `$.command.run` thì bỏ qua hook của chính gói đó.

---

## 1. Cách đo

- **Hai mod chỉ quan sát**, nằm trong thư mục mod của phiên, chỉ chạy khi `$.session.id()` khớp mã phiên
  `de9f201d-…`.
  - `dp6-tham-do` là mã của phụ lục hạt giống 11/10, đổi mã phiên, đường nhật ký và mốc 1–6. Mọi hook quan sát trả
    `next(e)` nguyên vẹn; không hook nào trả allow, deny hay decision.
  - Hai ngoại lệ có tên, đều là chính câu cần đo: `command.run` trả `{ text }` cho đúng hai lệnh của mod (câu 5), và
    `turn.complete` trả thêm một dòng đúng một lần sau mốc 6 (câu 6).
  - `dp6-goi` chỉ nghe `session.start` để gọi lệnh từ ngoài (câu 5, §2.5).
- **Mốc kịch bản:** phiên chạy lệnh Bash `true # dp6-kich-ban <n> <dau|cuoi>`; mod thấy lệnh qua `tool.call` rồi ghi
  dòng mốc.
- **Chạm người:** một lần, bật hot reload (14:20:54). Lần bấm Deny dự kiến trong kế hoạch không xảy ra, vì không hộp xin
  quyền nào tới người (§2.1). Không có lượt gọi người nào ngoài thiết kế.
- **Dọn sau đo:** gỡ cả hai mod khỏi thư mục mod của phiên lúc 14:29. Tệp `.claude/dp6-tham-do-tu-choi.txt` do lần 1 của
  câu 1 tạo ra đã xoá sau khi đọc lại nội dung. `settings.local.json` giữ nguyên băm
  `bea332b47682333cf672ac9a66d0032b9dc24488` trước và sau.

---

## 2. Kết quả từng câu, kèm dòng nhật ký làm chứng

Dòng trích nguyên văn từ `tham-do.jsonl` (số đầu dòng là số dòng trong tệp). Đuôi dài cắt bằng `…`.

### 2.1 Câu 1: hộp xin quyền của tác tử Workflow

**Lần 1.** Tác tử Workflow ghi một tệp mới vào `.claude/` của worktree. Mod thấy `tool.check` mang `agentId` của tác
tử, với `decision: "ask"`. **0,53″** sau, lời gọi đã chạy xong; không hộp nào hiện cho người. Bộ phân loại của chế độ
auto đã duyệt thay.

```
37:{"luc":"2026-10-17T14:24:10.591Z","su_kien":"tool.check","tool":"Write","agentId":"a18ab005e2b1feb73","decision":"ask","reason":"Claude requested permissions to edit …/.claude/dp6-tham-do-tu-choi.txt which is a s…"}
38:{"luc":"2026-10-17T14:24:11.117Z","su_kien":"tool.call","tool":"Write","agentId":"a18ab005e2b1feb73",…,"isError":null,"text":"File created successfully at: …"}
```

**Lần 2.** Tác tử ghi lại `settings.local.json` với nội dung y hệt từng byte. Bộ phân loại từ chối **5,3″** sau, lý do
«Self-Modification». Cũng không hộp nào tới người.

```
61:{"luc":"2026-10-17T14:25:30.690Z","su_kien":"tool.check","tool":"Write","agentId":"aa6406216ffdc22f2","decision":"ask",…}
63:{"luc":"2026-10-17T14:25:35.988Z","su_kien":"tool.call","tool":"Write","agentId":"aa6406216ffdc22f2",…,"isError":true,"text":"Permission for this action was denied by the Claude Code aut…"}
```

**Lần 3** (lặp lại lời ghi bị từ chối, để thử nhánh «auto quay về hỏi người»). Bộ phân loại chặn ngay ở lời gọi Workflow,
lý do «Auto-Mode Bypass» (dòng 72–73). Sau đó nó chặn thêm hai lệnh mốc rỗng cùng lý do. Máy dừng câu 1 ở đây, không thử
lại.

**Đếm:** `grep -c 'classic.Notification\|classic.PermissionRequest' tham-do.jsonl` → **0**, trên 123 dòng và 29 lời gọi
công cụ được ghi.

**Phán quyết:** câu hỏi của hạt giống giả định có một hộp xin quyền. **Ở chế độ auto giả định đó sai:** mọi lời gọi của
tác tử Workflow do bộ phân loại tự quyết, cho phép hay từ chối, nên không có hộp nào để «nuốt» hay để tới hook. Còn
**nhánh không-auto vẫn chưa đo.** Lý do là thiếu đối chứng dương: cả phiên chưa có hộp nào thật sự hiện cho người, nên
«0 sự kiện» chưa phân biệt được «hook không nghe» với «không có gì để nghe».

Hệ quả cho DP6: ở chế độ auto, vế «không nuốt hộp xin quyền» không có ca K3b để phủ. Ca chờ hộp quyền khoảng 5 giờ ngày
08/10 phải đến từ một phiên không ở chế độ auto. Câu hỏi ấy còn mở cho phiên chế độ `default`.

Hai điều đo được thêm, có ích cho răng T11 của DP4:
- Mod nhận `tool.check` của tác tử Workflow kèm `agentId`, và quyết định ghi ở đó là `ask`, tức trước khi bộ phân loại
  quyết. Kết quả thật của bộ phân loại chỉ đọc được trong chữ của `tool.call`.
- Hook `tool.call` vẫn chạy và vẫn thấy lệnh khi bộ phân loại từ chối lời gọi: hai dòng mốc 82–83 được ghi cho hai lệnh
  bị từ chối.

### 2.2 Câu 2: pane mở không do người bấm

```
14:{"luc":"2026-10-17T14:23:29.968Z","su_kien":"ui.open","kich_ban":2,"duoc_hoi":false,"isPlaced":true,"reason":null}
15:{"luc":"2026-10-17T14:23:32.971Z","su_kien":"ui.panes","kich_ban":2,"panes":[{"id":"dp6-tham-do","isPlaced":true,"isShown":true}]}
32:{"luc":"2026-10-17T14:24:05.543Z","su_kien":"ui.render:Pane","surface":"desktop","bodyColumns":47,"placement":"dock"}
117:{"luc":"2026-10-17T14:29:02.713Z","su_kien":"ui.render:Pane","surface":"desktop","bodyColumns":47,"placement":"dock"}
```

- Desktop đặt pane ngay, không theo ngưỡng 144 cột của terminal. Pane ở kiểu `dock`, bề rộng thân **47 cột**.
- **Lần vẽ đầu tới 35,6″ sau lời mở**, không ngay khi mở. Dòng 117 là lần vẽ lại sau khi mod nạp lại.
- Hệ quả cho dải và pane của `khung.ts`: phần vẽ phải đọc được ở 47 cột, và không được coi «đã mở» là «đã vẽ».

Dải trên ô nhập cũng vẽ trên Desktop: dòng 2, `ui.render:AbovePrompt`, `surface: "desktop"`, 35″ sau khi nạp.

### 2.3 Câu 3: `$.prompt.submit` đánh thức phiên

```
86:{"luc":"2026-10-17T14:26:29.321Z","kich_ban":3,"moc":"dau"}
103:{"luc":"2026-10-17T14:27:29.324Z","su_kien":"prompt.submit:goi","kich_ban":3}
105:{"luc":"2026-10-17T14:27:36.142Z","su_kien":"prompt.submit:xong","kich_ban":3,"ket_qua":"{\"text\":\"dp6 thăm dò, kịch bản 3: …\",\"origin\":{\"kind\":\"plugin\",\"name\":…"}
```

Bản ghi phiên (`ban-ghi-phien-trich.jsonl`):

```
{"timestamp": "2026-10-17T14:27:29.325Z", "type": "queue-operation", "operation": "enqueue", "content": "dp6 thăm dò, kịch bản 3: …"}
{"timestamp": "2026-10-17T14:27:36.056Z", "type": "queue-operation", "operation": "dequeue", …}
{"timestamp": "2026-10-17T14:27:36.059Z", "type": "user", "content": "The dp6-tham-do plugin sent a message:\ndp6 thăm dò, kịch bản 3: …"}
```

- Lời gọi bắn đúng 60,0″ sau mốc.
- Lúc 14:27:29 phiên đang bận: lượt thứ hai của câu 5 chạy từ 14:27:26,5 tới 14:27:36,05. Lời gọi vào hàng đợi; lượt
  trước kết thúc thì 6 ms sau lượt của mod mở.
- Lệnh `sleep 240` dự phòng (nổ 14:26:29) chỉ xong lúc 14:30:29. Vậy thứ đánh thức phiên là mod.
- **Giới hạn khai:** ca đo là «xếp hàng khi bận, mở khi rảnh», chưa phải «gọi vào một phiên đã rảnh từ lâu». Tài liệu
  (reference.md 158–163) tả hai ca này là một đường, và K3 cần đúng hành vi đã đo: tin tới thì phiên mở lượt ngay khi
  rảnh.

### 2.4 Câu 4: `$.process.run` trên Desktop

```
8:{"luc":"2026-10-17T14:23:25.707Z","kich_ban":4,"moc":"dau"}
9:{"luc":"2026-10-17T14:23:25.723Z","su_kien":"process.run","kich_ban":4,"exitCode":0,"stdout":"v24.22.0","stderr":""}
```

Nhánh chính của hạt giống (mod gọi CLI `dieu-phoi.mjs xem --json`) dùng được trên Desktop. Không cần nhánh dự phòng
`$.fs` + `moHinh`.

### 2.5 Câu 5: `command.run` và lệnh markdown mang khoá model

**Đường `claude plugin test` (2.1.295)**, gói `cau5-plugin-test/` có bản chép nguyên `commands/acceptance-status.md`:

```
CAU5 run text = "cau5: hook trả lời thay lệnh markdown" duoiDuocGoi = 0
CAU5 doi chung text = "DUOI:cau5:lenh-khac"
(fail) liệt kê: … TypeError: $.command.list is not a function.
```

- Bộ kiểm chỉ chứng minh được rằng hook bắt đúng tên lệnh.
- Nó **không mô hình hoá bảng lệnh**: tên không tồn tại (`cau5:lenh-khac`) vẫn chạy, và `$.command.list` không có. Vì
  thế nó không biết lệnh markdown hay khoá `disable-model-invocation`.
- **Phán quyết: `plugin test` không trả lời được câu 5.** Phải đo sống.

**Đo sống, lần 1**: `dp6-tham-do` tự gọi `$.command.run` cho cả hai lệnh. Hook `command.run` của chính nó **không chạy
lần nào**: không có dòng `"su_kien":"command.run"` nào trước 14:29. Đối chứng `/dp6-ping` báo chưa ai trả lời, còn bản
sao lệnh markdown thì tới model:

```
94:{"luc":"2026-10-17T14:26:44.792Z","su_kien":"command.run:xong","kich_ban":5,"command":"dp6-ping","text":"dp6-tham-do registered /dp6-ping but no command.run hook answered it: …"}
```

Đối chứng cũng đỏ, nên chiều đỏ của lệnh markdown **không kết luận được gì**. Nguyên nhân: «every hook but the calling
one» bỏ qua hook của chính gói đang gọi. Lần 1 có hai chuỗi chạy vì mốc 5 nổ hai lần (14:23:44, rồi lần hai ở lệnh bị từ
chối 14:26:29), và cả hai chuỗi xếp hàng tới khi phiên rảnh.

**Đo sống, lần 2**: một mod KHÁC (`dp6-goi`) gọi hai lệnh lúc nạp:

```
118:{"luc":"2026-10-17T14:29:04.694Z","nguon":"dp6-goi","su_kien":"command.run:goi","kich_ban":5,"command":"dp6-ping"}
119:{"luc":"2026-10-17T14:29:04.746Z","su_kien":"command.run","command":"dp6-ping","origin":{"kind":"plugin","name":"dp6-goi"}}
120:{"luc":"2026-10-17T14:29:04.748Z","nguon":"dp6-goi","su_kien":"command.run:xong","kich_ban":5,"command":"dp6-ping","text":"dp6-tham-do: dp6-ping được hook trả lời (đối chứng dương)"}
122:{"luc":"2026-10-17T14:29:04.868Z","su_kien":"command.run","command":"dp6-tham-do:acceptance-status","origin":{"kind":"plugin","name":"dp6-goi"}}
123:{"luc":"2026-10-17T14:29:04.871Z","nguon":"dp6-goi","su_kien":"command.run:xong","kich_ban":5,"command":"dp6-tham-do:acceptance-status","text":"dp6-tham-do · câu 5: hook command.run trả lời thay lệnh markdown mang disable-model-invocation"}
```

- Đối chứng dương xanh, và lệnh markdown mang khoá được hook trả lời.
- Model **không nhận lượt nào** (khác lần 1). Phiên chỉ được đánh thức bởi lệnh `sleep` dự phòng.
- `$.command.list()` liệt kê bản sao với `source: "plugin"` (dòng 22). Tên lệnh mà hook thấy là `<gói>:<lệnh>`.

**Giới hạn khai:** nguồn gọi đã đo là `plugin` (một gói khác). Nguồn `composer` (người gõ) chưa đo, vì đo nó tốn một chạm
người. Với `composer` không có «hook đang gọi» nào để bỏ qua, nên theo tài liệu mọi hook đều chạy.

### 2.6 Câu 6: dòng cuối lượt, và danh sách tác tử

**6a.** Mod ghi dòng (dòng 91), và bản ghi phiên Desktop có dòng hệ thống ngay sau câu trả lời của lượt:

```
91:{"luc":"2026-10-17T14:26:44.729Z","su_kien":"turn.complete:dong-duoi","kich_ban":6,"text":"dp6-tham-do · câu 6: dòng này do mod trả qua turn.complete { text }"}
{"timestamp": "2026-10-17T14:26:44.731Z", "type": "system", "subtype": "informational", "content": "dp6-tham-do+cc-plugin-agents-md: dp6-tham-do · câu 6: dòng này do mod trả qua turn.complete { text }"}
```

- Tiền tố `dp6-tham-do+cc-plugin-agents-md` gộp tên mọi gói đang nghe `turn.complete`, kể cả một gói đã cài khác.
  Người đọc không biết dòng của gói nào.
- **Chưa nhìn bằng mắt** dòng đó trên màn hình Desktop. Chụp màn hình cần cấp quyền điều khiển máy, tức thêm một chạm
  người, nên không chi.
- Nhãn của vế này: *không đọc được ở đây*. Đường gỡ rẻ: lần đầu chạy K2, người nhìn một lần.

**6b.** Đối chứng dương: tác tử con thường do công cụ Agent mở. Hai tác tử Workflow: `a18ab005…` và `aa640621…`.

```
35:{… "su_kien":"agent.list","vi_sao":"tool.call-cua-tac-tu","agentId":"a26d5186047c7039e","co_agentId_trong_ds":true,"so":1,…"status":"running"…}
39:{… "su_kien":"agent.list","vi_sao":"tool.call-cua-tac-tu","agentId":"a18ab005e2b1feb73","co_agentId_trong_ds":false,"so":1,…}
58:{… "su_kien":"agent.list","vi_sao":"tool.call-cua-tac-tu","agentId":"aa6406216ffdc22f2","co_agentId_trong_ds":false,"so":1,…}
88:{… "su_kien":"agent.list","vi_sao":"moc-6",…,"so":1,"ds":[{"id":"a26d5186047c7039e",…,"status":"completed",…}]}
```

- Danh sách thấy tác tử con thường ở cả bốn lần: `running`, `waiting`, `completed`.
- Hai tác tử Workflow thì không lần nào có trong danh sách, kể cả lúc chúng đang gọi công cụ.
- Khớp khai báo kiểu 2.1.295: «a workflow's are not» (`claude-code.d.ts`, chú thích của `agent.list`).

---

## 3. Kết luận cho K2, K3 (và K1)

- **K1: giữ.** Khoá `disable-model-invocation` không chặn hook `command.run` trả lời lệnh markdown, nên mod trả lời thay
  được `/acceptance-status` mà ADR 0002 vẫn nguyên. Thiết kế phải ghi: lệnh do chính gói đó gọi bằng `$.command.run`
  không qua hook của gói đó. Kiểm thử của K1 cũng không đặt được trên `plugin test` cho vế «lệnh markdown có khoá».
- **K2: giữ, thu phạm vi phần «nền».** Dòng `{ text }` vào được bản ghi phiên Desktop.
  - Vế «nền: n tác tử đang chạy» KHÔNG đọc từ `$.agent.list()`: danh sách mù với tác tử Workflow, 0/2.
  - Vế đó phải đọc sổ chạy của Workflow hoặc hồ sơ vòng.
  - Dòng mang tiền tố gộp tên mọi gói nghe `turn.complete`; thiết kế phải tính chỗ dùng chung này.
- **K3: giữ.** `$.prompt.submit` mở được lượt khi phiên hết bận, không cần người. Điều kiện cần của K3 đã có; phần còn lại
  vẫn là quyết định của owner về việc nới «mod chỉ vẽ» cho một lời gọi.
- **Câu 1 của DP6:** ở chế độ auto không có hộp quyền nào để nghe. Nhánh không-auto còn mở, cần một phiên chế độ
  `default`. Đó là chỗ duy nhất có hộp hỏi người để làm đối chứng dương.
