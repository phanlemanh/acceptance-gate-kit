# Mods của Claude Code: khảo sát và kiến nghị cho kit

**Ngày:** 2026-10-17 · **Loại:** khảo sát (finding). Tệp này không mở ô. Mọi kiến nghị bên dưới là CỘNG: chưa ô nào
được mở, và mỗi kiến nghị cần owner duyệt đích danh (ADR 0018).
**Nguồn:** tài liệu `code.claude.com/docs/en/plugins/mods/*` (tổng quan, giao diện, sự kiện, API, quản trị, kiểm thử,
tham chiếu; đọc 17/10), khai báo kiểu của bản 2.1.295, mã gói `dieu-phoi`, và hai lượt khảo sát kho cùng ngày (bề mặt
kit; nỗi đau đã đo trong `docs/findings`, `docs/plans`, bộ nhớ máy).
**Hình (chiếu của tệp này):** `assets/2026-10-17-mods-kien-nghi/trai-nghiem-sau-kien-nghi.html`, gồm hành trình một
vòng của owner và cửa sổ Claude Code sau kiến nghị.

---

## 0. Đọc trong một phút

- **Mod là mã chạy BÊN TRONG Claude Code.** Hook kiểu cũ thì chạy một script ở ngoài. Một mod làm được bốn việc mà
  hook cũ, skill và MCP không làm được:
  - vẽ lên giao diện: dải trên ô nhập, pane, dòng trạng thái, toast, và một dòng dưới câu trả lời;
  - trả lời một lệnh không qua model (0 token, chạy được cả khi Claude đang làm việc);
  - giữ trạng thái và chạy hẹn giờ giữa các lượt, tự gửi một lượt để đánh thức phiên đang rảnh;
  - nhắn tin và nghe tin giữa các phiên.
- **Kit đã dùng mod, và phần đó đã ký.** Gói `dieu-phoi` có dải trạng thái đợt, pane, lệnh `/dieu-phoi:xem` trả lời
  không qua model, và một phần đọc hạn mức. Kèm theo là răng «mod chỉ vẽ»: không nghe sự kiện cổng, không bao giờ trả
  lời «cho phép», không gửi lượt, không nhắn tin. Gói `acceptance-gate` (gói lõi mọi kho cài) và `feature-loop` chưa có
  mod nào.
- **Giá trị của mod cho kit KHÔNG nằm ở việc chặn lời gọi công cụ.** Hook kiểu cũ đã làm việc đó. Nó chạy cả ở
  `claude -p`, và luật T11 của kit cấm mod nghe sự kiện cổng là đúng. Giá trị nằm ở ba lớp nỗi đau đã đo mà hook cũ
  không với tới:
  1. **Máy khai trạng thái thay cho model.** Model nói «đang chạy» khi lượt đã dừng.
  2. **Máy in thẻ thay cho model chép lại.** Có thẻ in ra thô và bị cắt cụt.
  3. **Bộ canh và nút đánh thức là vật trong kho.** Hôm nay chúng là script trong thư mục nháp, và có lần làm phiên đứng
     yên 12 giờ.
- **Năm kiến nghị (§4), xếp theo nỗi đau đã đo trên chi phí.** K3, bộ canh và đánh thức, nên đi cùng vòng GT1 «vòng
  mở có chủ giữ». Nó cần owner nới luật «mod chỉ vẽ» cho đúng một lời gọi.
- **Một việc máy làm được ngay, không cần quyết:** `claude` trên PATH máy này là **2.1.281**. Mod cần ≥ 2.1.287 ở
  terminal, nên mọi phiên terminal hôm nay chạy KHÔNG có lớp mod đã ký. App Desktop chạy 2.1.295 nên không bị.

**Cập nhật cùng ngày, sau thăm dò** (`docs/findings/2026-10-17-tham-do-mod-desktop.md`, commit `947d4285` và
`ae477dfb`, cùng PR này). Trên Desktop 2.1.295:
- **K1 giữ.** Hook trả lời được lệnh mang khoá model-invocation. Cạm bẫy: lệnh do chính gói đó gọi thì bỏ qua hook của
  chính nó.
- **K2 giữ, thu phạm vi.** Dòng cuối lượt vào bản ghi phiên, nhưng chưa nhìn tận mắt trên màn hình. `$.agent.list()` không
  thấy tác tử Workflow (0/2), nên vế «nền» đọc từ sổ chạy.
- **K3 giữ.** `$.prompt.submit` mở được lượt khi phiên hết bận.
- **Hộp xin quyền của tác tử Workflow tới được phiên cha ở chế độ Manual** (đo lại, commit `ae477dfb`).
  `PermissionRequest` mang mã tác tử. `Notification` cũng tới, nhưng chỉ khi hộp mở quá 6″ và không mang mã tác tử.
  Ở chế độ auto thì không có hộp nào để báo.

---

## 1. Mods làm được gì: phần liên quan tới kit

| Năng lực | Cách gọi | Ghi chú cho kit |
|---|---|---|
| Dải trên ô nhập | `ui.render` trên `AbovePrompt` | Có ở Terminal và Desktop. **VS Code không có.** Mọi mod dùng chung một dải. |
| Pane bên cạnh hoặc trên ô nhập | `$.ui.open` + `ui.render` trên `Pane`; có `Button`, `Input`, `Select`, `Markdown`, `Code` | Có ở Terminal, Desktop, VS Code. Pane tự mở mà không ai bấm thì chỉ hiện từ 144 cột trở lên. |
| Dòng trạng thái, toast, dòng nhật ký | `$.ui.status` · `$.ui.toast` · `$.ui.log` | Claude không đọc các dòng này. |
| Một dòng dưới câu trả lời khi lượt kết thúc | `turn.complete` trả `{ text }` | Máy nói lời cuối của lượt. |
| Vẽ lại phần của Claude Code | Spinner, hàng công cụ, hộp hỏi `AskUserQuestion`, tin nhắn | **Không vẽ lại được hộp xin quyền.** |
| Lệnh không qua model | `$.command.register` + `command.run` trả `{ text }`; `immediate: true` cho phép chạy cả khi Claude đang làm | Đã dùng ở `/dieu-phoi:xem`. Nếu hook ném lỗi, lệnh markdown cũ chạy thay. |
| Chặn, viết lại hay tự trả lời một lời gọi công cụ | `tool.call` · `tool.check` | Hook cũ đã làm được phần này. Luật T11 cấm mod của kit dùng nó. |
| Thêm ngữ cảnh cho prompt; sửa lời nhắc hệ thống | `prompt.submit` (`context`) · `prompt.compose` · `skill.prompt` | Lời nhắc hệ thống đổi giữa các lượt thì **phá bộ nhớ đệm prompt**. |
| Theo dõi lượt và token | `turn.step` (usage từng request, có `agentId`) · `turn.complete` (tổng của lượt) · `session.usage()` | Đo được token của phiên chính, thứ hôm nay phải đếm tay. |
| Tác tử con | `agent.spawn` (đổi model, từ chối) · `$.agent.list()` (trạng thái) | **Nội dung tác tử Workflow bị ghim, không viết lại được** (khai báo kiểu 2.1.295, `AgentSpawnInput`). |
| Hẹn giờ và đánh thức | `$.clock.every/after` · `$.prompt.submit` (đợi phiên rảnh rồi mở một lượt) | Lượt mở ra kèm một câu ghi tên mod là người gửi. |
| Nhắn giữa các phiên | `$.session.send` · sự kiện `session.receive`/`session.send` | `isDelivered` nghĩa là tin đã vào hàng đợi, chưa phải đã đọc. Chưa rõ có tới được máy khác không. |
| Tệp, tiến trình, mạng, kho | `$.fs` · `$.process.run` (không qua shell, 30″) · `$.http.fetch` · `$.store` | `$.store` dùng chung mọi phiên trên máy nhưng **get/set không nguyên tử**. |
| Kiểm thử | `claude plugin test` + `claude-code/testing` (giả lập đồng hồ, kho, model, giao diện) | Chiều đỏ nằm trong bộ kiểm. CI của kit không có Claude Code. |

**Nơi chạy.** CLI cần ≥ 2.1.287, Desktop ≥ 2.1.286, VS Code ≥ 2.1.299 (VS Code không có dải). `claude -p`, Agent SDK và
phiên cloud có chạy hook nhưng **không vẽ gì**. Phiên WSL của Desktop không chạy mod.

**Tin cậy và quản trị.** Mod chạy với toàn quyền của người dùng và không có sandbox. Một mod có thể duyệt thay người
những lời gọi mà luật `ask` lẽ ra phải hỏi.
- Tài khoản Team hoặc Enterprise nạp sẵn bộ canh `sec-default`.
- Nếu quản trị tổ chức bật `allowManagedModsOnly`, mọi mod cài từ marketplace GitHub bị coi là «của người dùng» và bị
  từ chối. Các phần khác của gói vẫn chạy. Vì thế **mọi tính năng mod của kit phải có đường lùi không-mod**: kho phải
  chạy đúng như hôm nay khi mod không nạp được. `khung.ts` đã theo mẫu này.

---

## 2. Kit đang ở đâu

- **Lớp mod đã ký** (hồ sơ `dieu-phoi-lop-mod`, `trang-thai-dot-dieu-phoi-tho`):
  - `dieu-phoi/hooks/mod/register.ts` gọi hai phần: `khung.ts` (dải, pane, `/dieu-phoi:xem`) và `doc-muc-dung.ts`
    (nghe `session.measure` để đọc hạn mức).
  - Răng nằm ở `dieu-phoi/scripts/mod-luat.mjs`: bảng sự kiện theo từng phần, cấm sự kiện cổng, quét chữ «cho phép»,
    đối chiếu với `claude plugin validate`.
- **Mỗi gói chỉ được một module mod.** `validate` từ chối mục thứ hai. Nếu `acceptance-gate` có mod, nó cần khung
  giống `dieu-phoi`.
- **Lỗ đã ghi sổ của lớp mod:** nhịp làm mới của dải có thể tắt im, và khi đó dải vẽ dữ liệu cũ như dữ liệu hiện tại
  (`docs/plans/2026-10-13-hat-giong-khung-nhip-tat-im.md`).
- **Thăm dò bốn kịch bản đã soạn từ 11/10 nhưng chưa chạy**
  (`docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` §«Đo sống»). Bốn câu cần trả lời:
  1. Hộp xin quyền của tác tử Workflow có tới hook không.
  2. Pane tự mở trên Desktop có được đặt ra màn hình không.
  3. **`$.prompt.submit` có đánh thức được phiên Desktop đang rảnh không.**
  4. `$.process.run` có chạy được trên Desktop không.

  Câu 3 là căn cứ của K3 bên dưới.
- **`claude` trên PATH là 2.1.281** trên máy này (và trên M5 theo hạt giống 11/10). Phiên terminal không nạp mod.
  `kiem-mod.mjs` phải dò bản `claude` của app.

---

## 3. Đối chiếu: nỗi đau đã đo và chỗ mod giúp được

| Nỗi đau (đo được) | Hôm nay giữ bằng | Mod có giúp? | Lý do |
|---|---|---|---|
| **B. Nói «đang chạy» khi lượt đã dừng; bỏ bước in lệnh tiếp tục.** 7/14 lần dừng do máy tự chèn (26/07). Hai lần trong một phiên (02/09). Khuôn coi BLOCKED là «xong», đốt máy 4 lần trong 3 ngày. Hộp xin quyền chờ khoảng 5 giờ trong đêm (08/10). | Lời dặn trong SKILL («LUÔN IN /goal», «luôn nói đang ở stage nào») | **Có (K2)** | `turn.complete` cho máy viết dòng cuối của mỗi lượt, đọc từ hồ sơ và danh sách tác tử. Hook cũ không vẽ được. |
| **D. Sót tin và phiên đứng yên.** Sót 1, 4 rồi 4 giờ (12, 13, 15/10). Hai phiên đứng khoảng 12 giờ. 20/33 tin owner gửi là «kiểm tra các phiên». Đọc trọn kênh tốn khoảng 20 nghìn token mỗi lần, ba máy, 30′ một lần. | Script `cho-mau.sh` trong thư mục nháp; Monitor phải giăng lại mỗi 30′ | **Có (K3)** | Mod hẹn giờ gọi CLI mà không tốn token, rồi đánh thức phiên bằng `$.prompt.submit`. Hook cũ chỉ chạy khi có sự kiện, nên không đánh thức được phiên đang rảnh. |
| **F. Thẻ và trạng thái bị model chép lại.** Thẻ in thô và cắt cụt (05/08). Ghi tiếng người vào ô máy đọc làm khối biến mất im lặng trên thẻ (3 lần trong một phiên, 01/09). Model dịch JSON trạng thái thành bảng. | Marker khuôn, cộng dặn «chép NGUYÊN VĂN» | **Có (K1)** | Lệnh trả lời thẳng bằng chữ của bộ render: «kit render, không soạn» (khối ĐỊNH VỊ). |
| **A. Chạm mỗi lượt gọi người.** Lời mời 5 ô «làm tê liệt» (12/08). Máy in `/approve`, một lệnh không tồn tại (01/09). | Lời dặn «lời mời ký được ngay» | **Có thể (K4)** | Mỗi lối ra là một nút trong pane. Số lượt gọi không đổi, chỉ số chạm giảm. |
| **E. Phiên chính phải đếm token tay** (luật (c) dòng 4) | `do-vong.mjs` quét transcript sau khi xong | **Có (K5)** | `turn.step` và `turn.complete` đưa số theo từng request và tác tử. Đây là việc meta (§4, K5). |
| **C. Chạy sai cây, sai mốc so, `git add -A`, S4 ngoài khoá** | Một phần là hook cũ (`hook-chan-s4`, `acceptance-evidence-gate`), phần còn lại là lời dặn | **Không cần mod** | Hook `PreToolUse` kiểu cũ đã đủ, chạy cả ở `-p`. Luật T11 cấm mod nghe `tool.call`. Nghiệm đúng tầng của mốc so cũ là sửa ở script (hạt giống 17/10 `s4-args-moc-so-main-cuc-bo-cu`). |
| **C. Ráp tay tham số S4** (2 triệu token và khoảng 25′ mỗi lượt hỏng) | Lời dặn | **Không nên** | Mod làm được bằng cách viết lại lời gọi Workflow, nhưng đó là nghe sự kiện cổng và viết lại lời gọi. Nghiệm đúng tầng là script tự so băm (hạt giống 20/09). |
| **C. Câu nhắn của người lọt vào tác tử chấm** (mất trọn một lượt chấm khoảng 4,6 triệu token, 07/10) | Lời dặn «gõ một câu trung tính trước» | **Không làm được** | Nội dung tác tử Workflow bị ghim, `agent.spawn` không viết lại được. |
| **D. Khoá máy là cổ chai** (khoảng 31 phiên-giờ chờ) | Khoá `mkdir` nguyên tử | **Không** | `$.store` không nguyên tử. Khoá hiện tại đúng hơn. |

---

## 4. Kiến nghị

Mỗi kiến nghị ghi: làm gì · nguyên tố trace về · người hưởng · đường lùi khi không có mod · cân trên mọi kho · dự
báo năm dòng của luật (c) theo thứ tự (làm-xong→quyết-được · lượt gọi người · vòng bị hạ tầng đốt lượt · token máy/vòng ·
phút máy/lượt) · còn cần đo gì.

### K0. Nâng `claude` trên PATH của ba máy lên ≥ 2.1.287. Việc máy, không phải CỘNG vào kit.

- **Vì sao:** lớp mod đã ký không nạp trong phiên terminal. `plugin test` và `validate` của bản PATH cũng thiếu tính
  năng, nên răng `kiem-mod` phải dò bản của app.
- **Đường đảo:** cài lại bản cũ.
- **Người hưởng:** mọi phiên terminal có cài `dieu-phoi`.
- Không đổi byte nào trong kho.

### K1. Lệnh chỉ đọc trả lời không qua model. Ưu tiên 1, chi phí thấp.

- **Làm gì:** mod của `acceptance-gate` trả lời thẳng bằng chữ của bộ render, theo đúng mẫu `/dieu-phoi:xem`, cho
  bốn lệnh: `/acceptance-status`, phần quét của `/start`, `/road-map:xem`, và thẻ cổng bản chữ.
  - Cần một hàm in chữ từ JSON của `start-scan.mjs`. Hôm nay model làm việc này.
  - Thêm `immediate: true` để owner xem được trạng thái cả khi Claude đang làm.
- **Trace:** nguyên tố 2. Không còn lớp model chen giữa bộ render và người đọc. Lớp lỗi «model soạn lại thẻ» chết theo
  vật, không theo lời dặn.
- **Người hưởng:** owner đọc trạng thái tức thì với 0 token; phiên Claude bớt chép lại.
- **Đường lùi:** hook ném lỗi hoặc mod không nạp, thì lệnh markdown cũ chạy như hôm nay.
- **ADR 0002:** khoá model-invocation giữ nguyên. Mod chỉ đổi ai trả lời (script thay model), không đổi ai gọi lệnh.
  Chỉ áp cho lệnh chỉ đọc. `approve` và `signoff` không đổi.
- **Cân mọi kho:** `acceptance-gate` là gói lõi, nên phần mod phải im ở kho không có `_acceptance/`. Kho không nạp mod
  thì không đổi gì.
- **Dự báo năm dòng:** ↓ · = · = · ↓ (bớt token xem trạng thái) · =.
- **Cần đo:** `command.run` có bắt được lệnh mang `disable-model-invocation` không. `/dieu-phoi:xem` không mang khoá
  này, nên phải kiểm bằng `claude plugin test`.

### K2. Dòng sự thật cuối lượt. Ưu tiên 2.

- **Làm gì:** khi một lượt kết thúc (`turn.complete`), mod in một dòng dưới câu trả lời. Dòng này đọc từ hồ sơ và từ
  `$.agent.list()`, không đọc từ lời model:
  `Vòng <slug> · <trạng thái hợp đồng> · nền: <n> tác tử đang chạy | không gì đang chạy · kế: <một lệnh>`.
  - Có thể thêm `$.ui.status` một dòng cho giai đoạn của vòng.
  - Model không thể khai «đang chạy» trái với dòng nằm ngay dưới lời nó.
- **Trace:** nguyên tố 2, và dạng nghiệm đúng tầng của hiến pháp: biến lời dặn «LUÔN IN /goal» và «luôn nói stage»
  thành vật-máy-giữ.
- **Người hưởng:** owner không còn ngồi chờ một thứ không chạy.
- **Đường lùi:** không mod thì như hôm nay. Phần này chỉ quan sát: không nghe sự kiện cổng, không trả lời «cho phép».
- **Cân mọi kho:** im khi phiên không ở trong một vòng.
- **Dự báo năm dòng:** ↓ · ↓ (lượt gọi ngoài thiết kế) · = · = · =.
- **Cần đo, hai câu:**
  1. Dòng `{ text }` của `turn.complete` có hiện trên Desktop không. Tài liệu chỉ tả terminal.
  2. `$.agent.list()` có thấy tác tử Workflow chạy nền không. Hạt giống 11/10 ghi tác tử Workflow mang id nhưng không có
     trong danh sách. Nếu không thấy, dòng nền đọc từ `run-log` của vòng.
- **Ghi chú:** dùng lại nhịp của `khung.ts`, nên phải sửa lỗ «nhịp tắt im» trong phần dùng chung (bọc `try/finally` và
  hiện tuổi dữ liệu) cùng lúc làm K2, không mở ô riêng.

### K3. Bộ canh và đánh thức là vật trong kho: phần răng cho GT1. Ưu tiên 1 về nỗi đau, phụ thuộc thăm dò.

- **Làm gì:** phần mod của `dieu-phoi` hẹn giờ gọi các lệnh `tin canh` và `tin so` của GT1. Đây là CLI node, không gọi
  model. Mod vẽ vòng mở và vòng quá hạn lên dải đã có. Khi có tin cho phiên này mà phiên đang rảnh, mod gửi một câu ngắn
  bằng `$.prompt.submit` để đánh thức nó.
  - Tin giữa các phiên trên cùng một máy có thể ghi NHẬN tự động qua `session.receive`.
  - Máy thay owner làm «nhịp tim» và thay thư mục nháp làm bộ canh.
- **Trace:** nguyên tố 3. Người về biên; owner thôi làm lượt «kiểm tra các phiên».
- **Người hưởng:** owner, cùng các phiên thợ và phiên điều phối của ba máy.
- **Xung đột cần owner quyết:** răng «mod chỉ vẽ» (`mod-luat.mjs`) cấm `$.prompt.submit`. K3 cần nới đúng một lời gọi
  đó, cho đúng một phần mod, kèm răng mới: chỉ gửi khi phiên rảnh, gửi tối đa N lần mỗi giờ, và câu gửi đi lấy từ khuôn
  (máy không soạn). Việc nới này là CỘNG.
- **Đường lùi:** không mod thì `tin canh` chạy tay như thiết kế GT1. Hook dừng chặn kết lượt khi còn tin chưa NHẬN vẫn
  là hook cũ.
- **Cân mọi kho:** `dieu-phoi` là gói kho tự chọn cài. Kho không có đợt hay kênh khai trong cấu hình thì phần này im.
- **Dự báo năm dòng:** ↓↓ (trễ tin: trung vị 103′ ở #308) · ↓ · = · ↓ (khoảng 20 nghìn token × 3 máy × mỗi 30′) · =.
- **Cần đo trước khi duyệt:** kịch bản 3 của thăm dò 11/10 (`$.prompt.submit` có đánh thức phiên Desktop đang rảnh
  không). Kịch bản trả lời «không» thì K3 thu lại chỉ còn phần vẽ.

### K4. Thẻ cổng trong pane, mỗi lối ra một nút. Sau K1, chỉ khi owner muốn.

- **Làm gì:** Cổng Phạm vi và Cổng Bằng chứng mở thẻ đã render trong một pane. Mỗi lối ra là một `Button`; bấm nút thì
  chạy đúng script ghi chữ ký. Người bấm, máy chỉ dịch ý muốn thành trường hồ sơ, đúng luật «cái người gõ là Ý MUỐN,
  không phải cú pháp».
- **Trace:** nguyên tố 3, mục tiêu ≤1 chạm mỗi lượt.
- **Rủi ro, ghi thẳng:**
  1. Chạm ADR 0002 ở chỗ định nghĩa «người gọi».
  2. Bấm dễ hơn gõ, nên dễ thành trạm thu phí. Chỉ dùng cho mục đã phân loại «chỉ người biết».
  3. Owner nói 16/10 «chưa thấy nhu cầu GUI». Câu đó nói về bản đồ ba máy; K4 chỉ đổi chỗ hiện thẻ đã có.
- **Đường lùi:** lệnh gõ như hôm nay.
- **Dự báo năm dòng:** ↓ · = (số lượt không đổi, chỉ số chạm giảm) · = · = · =.

### K5. Đồng hồ máy theo vòng: token phiên chính và phút, máy tự đo. Việc META, đóng băng.

- **Làm gì:** dùng `turn.step` và `turn.complete` (usage theo `agentId`) để ghi số theo vòng, thay phần «phiên chính
  đếm tay» của dòng 4 trong luật (c).
- **Vì sao chưa làm:** đây là sửa THƯỚC của kit. Luật chiều rộng (b) cho tối đa một vòng meta giữa hai mốc mà một kho
  tiêu thụ đã nhận, và chỉ khi owner gọi tên. Ghi ở đây để mốc sau còn dấu.

---

## 5. Không nên làm, kèm lý do

- **Dời hook chặn sang mod** (S4 ngoài khoá, cổng bằng chứng, `git add -A`, cây bẩn). Hook cũ đã đủ và chạy cả ở
  `claude -p`. Mod chỉ thêm rủi ro: nó có thể duyệt thay người, và nếu ném lỗi thì hook bị bỏ qua, lời gọi đi thẳng.
  Luật T11 cấm điều này là đúng.
- **Dùng `$.ui.ask` giữ một lời gọi rủi ro để chờ người.** Mỗi lần như vậy thêm một lượt gọi người, ngược thước đo
  North Star.
- **Bơm luật vào lời nhắc hệ thống bằng `prompt.compose` hay `skill.prompt`.** Phá bộ nhớ đệm prompt mỗi khi chữ đổi,
  và vẫn chỉ là lời. Nếu cần ngữ cảnh mỗi lượt, `UserPromptSubmit` kiểu cũ đã thêm được.
- **Dùng `$.model.complete` để phân loại.** Tốn tiền của người dùng, không tất định, và không có chiều đỏ.
- **Dùng `$.store` làm khoá hay sổ dùng chung.** Get/set không nguyên tử, và tài liệu nói rõ hai phiên sẽ đè nhau.
- **Vẽ lại hộp xin quyền.** Không làm được: hộp này không phải render site.

---

## 6. Đường đi đề xuất

1. **K0.** Máy làm khi owner gật cài trên ba máy; đảo được.
2. **Chạy thăm dò bốn kịch bản** (mã đã soạn, đã qua `validate --strict` 2.1.295). Cần hai chạm: bật hot reload, và
   bấm Deny một hộp quyền. Kết quả là căn cứ cho K2 và K3, và trả lời luôn câu mở của DP6 về hộp quyền tác tử Workflow.
3. **K3 vào vòng GT1** (mốc 2.33.0) như một tiêu chí, nếu thăm dò ra «có» và owner duyệt nới «mod chỉ vẽ» cho một lời
   gọi đánh thức.
4. **K1 và K2 thành một vòng T2 của `acceptance-gate`**, sau mốc mà một kho nhận (luật (b)). Vòng này dựng khung mod
   một-module giống `dieu-phoi` cho gói lõi.
5. **K4 sau K1**, nếu owner muốn. **K5** nằm ở mốc sau, khi owner gọi tên.
