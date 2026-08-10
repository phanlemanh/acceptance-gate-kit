# Ngôn ngữ mặt người — luật bắt buộc khi trình cho người

Nguồn quyết định: `docs/specs/workflow-v2-spec.md` §4.1 (Manh, 2026-08-01).
File này là **bản thi hành**: bộ dựng thẻ, bảng tóm tắt kế hoạch và báo cáo
checkpoint NẠP file này trước khi viết chữ đầu tiên cho người đọc. Mỗi lần
render là một lần đọc — luật không sống trong trí nhớ.

## Áp ở đâu — và KHÔNG áp ở đâu

**ÁP** cho mọi thứ trình cho người để đọc/quyết: thẻ cổng, bảng tóm tắt kế
hoạch, báo cáo checkpoint và tổng kết, tin nhắn tại điểm quyết định, handbook,
release notes.

**KHÔNG ÁP** cho mặt máy: `evals.yaml`, `run-log.jsonl`, frontmatter, phần
Given/When/Then của `contract.md`, mã nguồn, thông điệp lỗi của script, tên
file. Ở đó **tên chính xác là bắt buộc** — "dịch cho dễ đọc" một khoá
frontmatter hay một `id:` của eval là làm hỏng hợp đồng máy, không phải làm
tốt cho người.

## Sáu luật

<!-- <<<HFL-LAW-TABLE -->
| # | Luật |
|---|---|
| N1 | **Chủ ngữ là người dùng hoặc sản phẩm, không phải file.** Câu nói *người dùng sẽ thấy gì khác*, không nói *sửa gì ở đâu*. |
| N2 | **Tên kỹ thuật (file/hàm/biến/bảng) xuống cột phụ hoặc ngoặc** — không bao giờ làm chủ ngữ. |
| N3 | **Mã số là tra cứu, không phải nội dung.** Lần đầu xuất hiện ở mặt người phải kèm 3–5 chữ nói nó là gì. |
| N4 | **Một dòng một ý** — không nhồi nhiều việc vào một ô bằng dấu phân cách. |
| N5 | **Hình trước, chữ là chú thích** tại mọi điểm quyết định (bảng có cột rõ · sơ đồ · bản bấm được). Câu hỏi cho người phải trả lời được bằng có/không hoặc a/b. |
| N6 | **Không dùng biệt ngữ nội bộ chưa có trong từ điển sản phẩm.** |
<!-- HFL-LAW-TABLE>>> -->

**Ngưỡng kích hoạt sơ đồ (N5):** điểm quyết định có **từ ba bước nối tiếp hoặc
từ hai nhánh rẽ trở lên** thì bắt buộc kèm sơ đồ; ít hơn thì bảng ba cột là đủ.
Ngưỡng này đếm được — liếc là biết, không phải phán.

**Từ điển sản phẩm sống ở đâu (N6):** `CONTEXT.md` ở gốc kho đang làm. Từ chưa
có mục trong đó thì hoặc thêm mục trước, hoặc viết bằng chữ thường ai cũng
hiểu. "Từ điển sản phẩm" không phải một khái niệm trừu tượng — nó là một file.

## Hai phép thử (rẻ, làm được trong vài giây)

- **Xoá-tên-máy**: xoá hết tên file/hàm/biến/mã số khỏi câu — còn nghĩa cho
  người không đọc code thì ĐẠT; thành rỗng hoặc mơ hồ thì viết lại.
- **Người-thứ-ba**: một người trong đội không đọc code kể lại được *"sau việc
  này người dùng thấy gì khác"* không?

## Ví dụ TRƯỚC/SAU

| Luật | TRƯỚC (ngôn ngữ máy) | SAU (ngôn ngữ mặt người) |
|---|---|---|
| N1 | Bộ dựng thẻ đọc thêm khoá độ phủ từ hợp đồng | Người duyệt thấy ngay bộ tiêu chí đã phủ hết những gì |
| N2 | Sửa bước lập kế hoạch trong SKILL của vòng lặp | Bước trình kế hoạch nạp bản luật trước khi viết (trong SKILL của vòng lặp) |
| N3 | Phục vụ AC-7, E12 | Phục vụ AC-7 (luật chỉ nằm một chỗ) và E12 (khuôn áp mọi lần trình) |
| N4 | Thêm marker, sửa bên đọc, thêm phép đo, chạy đóng gói | Bốn dòng riêng, mỗi dòng một việc |
| N5 | Ba đoạn văn mô tả một luồng có ba nhánh | Một sơ đồ ba nhánh, chữ là chú thích dưới hình |
| N6 | Bật CT-S cho slug này | Bật lưới chống sót tiêu chí cho việc này |

## Khuôn bảng tóm tắt kế hoạch

Dùng cho MỌI lần trình kế hoạch hoặc tiến độ cho người. Cột một phải qua được
phép thử Xoá-tên-máy. Một dòng một việc — cấm nhồi nhiều việc vào một ô bằng
dấu chấm giữa hay dấu chấm phẩy.

<!-- <<<PLAN-SUMMARY-TABLE-TEMPLATE -->
| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| <một câu, chủ ngữ là người dùng hoặc sản phẩm> | `<tên kỹ thuật>` | <mã> (<3–5 chữ nói nó là gì>) |
| Người duyệt đọc được bảng kế hoạch bằng tiếng sản phẩm | `human-facing-language.md` | AC-1 (bản luật đủ sáu điều) |
<!-- PLAN-SUMMARY-TABLE-TEMPLATE>>> -->

## Hình tại điểm quyết định

Vượt ngưỡng N5 thì bắt buộc có hình. **Hình là thứ người nhận NHÌN THẤY, không
phải một định dạng.** Chọn cách vẽ theo mặt phẳng đang trình, không theo thói
quen — tra bảng dưới đây.

<!-- <<<DECISION-DRAW-MECHANISMS -->
Danh sách đóng các cơ chế vẽ:
`hình vẽ nội tuyến của phiên` ·
`trang HTML gửi kèm` ·
`hình bằng ký tự trong khối mã` ·
`khối mermaid`.
<!-- DECISION-DRAW-MECHANISMS>>> -->

<!-- <<<DECISION-DIAGRAM-SURFACES -->
| Mặt phẳng đang trình | Vẽ bằng | Mặc định |
|---|---|---|
| Khung hội thoại | hình vẽ nội tuyến của phiên | ✔ mặc định |
| Panel bên hoặc file mở được | trang HTML gửi kèm | khi cần soi lâu, cần cuộn |
| Terminal thuần | hình bằng ký tự trong khối mã | chốt cuối, luôn chạy |
| Tài liệu trong kho | khối mermaid | khi hình sống trong tài liệu |
<!-- DECISION-DIAGRAM-SURFACES>>> -->

<!-- <<<DECISION-PICTURE-TEST -->
**Phép thử nhìn-thấy-hình:** thứ người nhận nhận được có phải là HÌNH chưa? Ca
trượt điển hình: dán một khối mã vào mặt phẳng thiếu bộ vẽ — người nhận thấy mã,
còn khó đọc hơn một cái bảng.
<!-- DECISION-PICTURE-TEST>>> -->

Nhãn nút chịu đúng N1/N2: nhãn là chữ cho người, tên file xuống chú thích dưới
hình. Khối dưới đây là ví dụ cho **một mặt phẳng cụ thể — tài liệu trong kho**,
là một trong các cách vẽ liệt kê ở bảng tra; chép nó sang mặt phẳng khác là ca
trượt của phép thử ngay trên.

<!-- <<<DECISION-DIAGRAM-TEMPLATE -->
```mermaid
graph LR
  A[Người duyệt mở thẻ] --> B{Đủ ba bước<br/>hoặc hai nhánh?}
  B -->|có| C[Kèm hình]
  B -->|không| D[Bảng ba cột là đủ]
```
<!-- DECISION-DIAGRAM-TEMPLATE>>> -->

Câu dưới đây là bản gốc DUY NHẤT của chỉ dẫn về hình trong vòng lặp tính năng.
Hai harness chép nguyên văn, không tự diễn đạt.

<!-- <<<LOOP-PICTURE-CLAUSE -->
Điểm quyết định vượt ngưỡng N5 thì kèm hình; chọn cách vẽ bằng bảng tra `DECISION-DIAGRAM-SURFACES` theo mặt phẳng đang trình, và kiểm lại bằng phép thử nhìn-thấy-hình.
<!-- LOOP-PICTURE-CLAUSE>>> -->

## Khối "👉 VIỆC CỦA ANH" — lời-gọi-hành-động chuẩn

Đề bài gốc: sổ vấp 2026-08-10 (hành vi owner #8) — việc-cần-làm rải giữa thân
bài, câu tu từ lẫn câu hỏi thật, không nói trả-lời-dạng-gì. Chuẩn dưới đây áp
cho MỌI tin trình cho người tại điểm quyết định: thẻ cổng render khối bằng máy
(`scripts/gate-card.js`, cả ba mode), tin nhắn do phiên viết theo khuôn:

<!-- <<<YOUR-MOVE-BLOCK-TEMPLATE -->
👉 VIỆC CỦA ANH
1. <làm gì — một hành động, chủ ngữ là người> — ở đâu: <phiên/thẻ/file cần mở> — trả lời dạng: «<khuôn câu trả lời>»
2. <mục kế, cùng ba vế; mỗi việc một dòng, đúng thứ tự cần trả lời>
Trả lời mẫu (một dòng, điền vào chỗ trống): «<mã mục 1>: ___; <mã mục 2>: ___»
<!-- YOUR-MOVE-BLOCK-TEMPLATE>>> -->

Luật đi kèm khuôn:

- Ba vế là bắt buộc từng mục: làm gì · ở đâu · trả lời dạng gì. Câu mẫu
  trả-lời-gộp nằm trên MỘT dòng.
- **Câu mẫu là KHUÔN DẠNG có chỗ trống, KHÔNG phải câu trả lời điền sẵn.** Máy
  nêu mã mục và các ngả chọn được; máy KHÔNG BAO GIỜ điền sẵn lựa chọn, verdict
  hay chữ "đồng ý/Đạt/Ký" thay người — kể cả khi chính máy đã đề xuất một ngả ở
  chỗ khác trên cùng trang. Vì sao đặt bất biến ở đây thay vì sửa từng bộ dựng:
  kit khoá không cho máy GỌI thao tác cổng (ADR 0002), nên để máy viết sẵn câu
  TRẢ LỜI của người tại cổng là vòng qua chính khoá đó — đường rẻ nhất cho một
  người đang mệt vòng lặp là dán nguyên dòng, và dòng đó có nghĩa "đồng ý mọi
  thứ + ký". Ca thật: thẻ Cổng 2 của chip khối-việc-của-anh từng render
  «Ngoài-1 ghi Known limits; E9 Đạt; đồng ý cắt; phê hết quyết định treo; Ký»
  trong khi E9 là mục máy vừa tự khai "chưa chắc, cần mắt người" (S4-r2).
- Tin CHỈ-BÁO — không có việc cho người — vẫn kết bằng khối, đúng một dòng:
  `👉 VIỆC CỦA ANH: không cần làm gì — <máy đang làm gì tiếp>`.
- CẤM câu tu từ mang dấu hỏi: mọi dấu hỏi trong tin phải thuộc một mục việc
  có "trả lời dạng" khai sẵn.

Câu dưới đây là bản gốc DUY NHẤT của điều khoản mời-cổng. Bốn bên dùng (vòng
lặp tính năng hai harness, skill acceptance, lệnh thẻ) chép nguyên văn, không
tự diễn đạt.

<!-- <<<GATE-INVITE-CLAUSE -->
Mọi tin mời cổng (duyệt hay ký) kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn `YOUR-MOVE-BLOCK-TEMPLATE` trong bản luật ngôn ngữ mặt người: mỗi mục đủ 3 vế làm-gì / ở-đâu / trả-lời-dạng-gì, kèm câu mẫu trả-lời-gộp MỘT dòng ở dạng khuôn có chỗ trống (máy không điền sẵn lựa chọn thay người); tin chỉ-báo ghi rõ "không cần làm gì"; cấm câu tu từ mang dấu hỏi.
<!-- GATE-INVITE-CLAUSE>>> -->

Danh sách dưới đây là các mặt mời-cổng NGUỒN — phạm vi do người quyết, nên nó
được khai tay. Phần dễ trôi thì KHÔNG khai tay: phép đo tự suy mọi bản dựng
dưới `plugins/` và mọi overlay cùng đuôi đường dẫn dưới `codex/` của từng mục,
rồi đòi bản nào cũng chứa điều khoản. Lỗ đã dẫm (S4-r2): bốn bản Claude được
sửa, hai overlay Codex tương ứng thì không — mà overlay GHI ĐÈ bản Claude
trong gói Codex, nên gói phát hành mời cổng không chịu luật, còn phép đo dùng
danh sách tay thì mù vĩnh viễn với khoảng trống đó.

<!-- <<<GATE-INVITE-SITES -->
skills/acceptance/SKILL.md
commands/acceptance-card.md
feature-loop/skills/feature-loop/SKILL.md
codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md
codex/acceptance-gate/skills/acceptance/SKILL.md
codex/acceptance-gate/skills/acceptance-card/SKILL.md
<!-- GATE-INVITE-SITES>>> -->

## Từ mới feature này đưa vào từ điển

Mỗi từ dưới đây phải có mục trong `CONTEXT.md` — nếu không, chính kit vi phạm
luật N6 nó vừa đặt ra.

<!-- <<<HFL-GLOSSARY-TERMS -->
- mặt người
- mặt máy
- lỗ-kit
- mặt phẳng
- nhìn-thấy-hình
- known-limits
- dogfood
- single-source
- run_id
- machine-lane
- fixture
- carry
- kind:panel
<!-- HFL-GLOSSARY-TERMS>>> -->

## Biệt ngữ trong lời ký — chú giải thay vì viết lại

Lời người ký là nguyên văn, luật N4 CẤM viết lại nó. Nhưng lời ký hay mang
biệt ngữ nội bộ mà người quyết kinh doanh không có nghĩa vụ biết. Đường ra:
**chú giải**. Mỗi từ dưới đây, khi xuất hiện trong thứ trình cho người, được
kèm một dòng nghĩa ở khối "Từ điển" cuối trang — lời người giữ nguyên, người
đọc vẫn hiểu. Từ nào vào khối này PHẢI có trong `HFL-GLOSSARY-TERMS` ở trên
(và do đó có mục trong `CONTEXT.md`) — phép đo P155 canh quan hệ đó.

<!-- <<<SIGNOFF-JARGON-GLOSS -->
- known-limits — giới hạn đã biết, người ký chấp nhận trước khi phát hành
- dogfood — chính đội tự dùng sản phẩm mình làm để thử
- single-source — một chỗ duy nhất giữ sự thật, nơi khác đọc lại
- run_id — mã một lượt chạy, dùng để đối chiếu bằng chứng
- machine-lane — làn máy chạy trọn bộ kiểm, không có người can thiệp
- fixture — hồ sơ dựng sẵn để thử, không phải hồ sơ thật
- carry — mang kết quả lượt trước sang lượt sau thay vì chạy lại
- kind:panel — dòng biên bản hội đồng trong sổ chạy của máy
<!-- SIGNOFF-JARGON-GLOSS>>> -->

## Vi phạm tại cổng — người duyệt có quyền TRẢ LẠI

Thấy vi phạm ở thứ được trình, người duyệt **trả lại tại cổng** — không phải
duyệt cho xong rồi góp ý sau. Trả lại là một lỗ của bộ công cụ, không phải lỗi
của người viết: ghi vào sổ quyết định `_acceptance/<slug>/decisions.jsonl` một
entry `revisit` có `decision` bắt đầu đúng chuỗi `lỗ-kit — ngôn ngữ mặt người`
kèm câu vi phạm, để đợt nâng bộ thẻ đọc lại bằng số thay vì bằng trí nhớ.
