# Review Findings: khoi-viec-cua-anh (round 2)

## Trong hợp đồng

### 1. Dòng "Trả lời mẫu" ở thẻ Cổng 2 điền sẵn NGUYÊN một câu duyệt-tất-cả, kể cả «Ký» và verdict của các mục chỉ người mới chấm được
- file: `scripts/gate-card.js:519`
- severity: high
- AC: AC-2
- source: conventions

`ymParts` không gom DẠNG trả lời mà gom sẵn một PHƯƠNG ÁN đã chọn cho từng mục, rồi in thành một dòng chép-một-phát. Bằng chứng E7 do chính bộ sinh của feature này render (`_acceptance/khoi-viec-cua-anh/evidence/p186-card-gate2.html`):

    Trả lời mẫu (một dòng): «Ngoài-1 ghi Known limits; E9 Đạt; đồng ý cắt; phê hết quyết định treo; Ký»

Các dòng tạo ra nó:

    :509  ymParts.push(lbl + (f.proposal === 'new-contract' ? ' mở hợp đồng mới' : ' ghi Known limits'));
    :513  ymParts.push(esc(d.id) + ' Đạt');
    :518  ymParts.push('Ký');

Dòng :513 là chỗ nặng nhất: `decisions` chính là các eval máy KHÔNG chấm được (UNCERTAIN, hoặc mọi judgment ở T3) — ngay phía trên thẻ máy tự nói "Máy: chưa chắc… (cần mắt người)" — mà câu mẫu đã điền sẵn «Đạt». Dòng :509 thì điền sẵn đề xuất của chính máy cho việc mà khối trên vừa tuyên là "bạn quyết".

So với nhánh Cổng 1 (:350) — nơi câu mẫu giữ CẢ HAI ngả: «Duyệt» — hoặc «Sửa: nêu điều cần đổi» — sự bất đối xứng cho thấy đây là trôi chứ không phải chủ ý: ở cổng KÝ, đường rẻ nhất cho owner mệt-vòng-lặp là copy nguyên dòng, và dòng đó có nghĩa "đồng ý mọi thứ + ký". Contract AC-2 chỉ đòi "nêu đủ các mã/nhãn đang hiện cùng DẠNG trả lời từng loại" — dạng, không phải kết luận; nên bản hiện tại vượt AC theo hướng bất lợi.

Điều này va thẳng lõi bất khả nhượng "chữ ký người" + ADR 0002 (khoá model-invocation 6 thao tác cổng người): kit khoá không cho máy GỌI cổng, rồi lại tự viết sẵn câu trả lời của người tại cổng.

Còn một điểm phụ cùng dòng: `esc()` được áp vào `d.id` trước khi ghép vào `ymParts`, nên nếu id chứa ký tự cần escape thì câu mẫu người-copy-paste sẽ chứa entity HTML (`&lt;`…) thay vì mã thật — mã trong câu mẫu phải khớp mã người thấy trong khối được trỏ.

### 2. Gate-2 card hands the human a copy-paste "approve everything" reply, including for FAILed judgments
- file: `scripts/gate-card.js:519`
- severity: high
- AC: AC-2
- source: bugs

The new `👉 VIỆC CỦA ANH` block builds `ymParts` by pushing an *affirmative verdict* for every open human decision — `'<id> Đạt'` (513), `'<label> ghi Known limits' / 'mở hợp đồng mới'` (509), `'đồng ý cắt'` (515), `'phê hết quyết định treo'` (516), `'Ký'` (518) — then renders them as `Trả lời mẫu (một dòng): «…»` (519). The card literally invites the gate owner to paste one line that passes every item and signs.

Reproduced on the real script (T3 contract, verdict PENDING-JUDGMENT, one judgment row the panel already judged FAIL):

    node scripts/gate-card.js --root <ws> --slug fx
    → Trả lời mẫu (một dòng): «E9 Đạt; Ký»

The panel said FAIL; the machine's model answer says Đạt and Ký.

This contradicts the feature's own contract AC-2 (`_acceptance/khoi-viec-cua-anh/contract.md`), which asks the composite line to state "cùng dạng trả lời từng loại" — the *form* of the answer, not a pre-decided verdict. It also contradicts the Gate-1 block written in the same commit (line 348), which correctly offers both branches: `«Duyệt» — hoặc «Sửa: nêu điều cần đổi»`. Per-item lines in `ymItems` also state both options; only the composite collapses to approve-only.

Mirror `plugins/acceptance-gate/scripts/gate-card.js` is byte-identical, so it ships the same way. No case in the suite asserts anything about the *content* of the verdicts in the sample line — P186 only checks that the codes `E9`, `Ngoài-1`, `Ký` appear in it.

### 3. Out-of-contract sample answer defaults to "ghi Known limits" even when the machine explicitly made no proposal
- file: `scripts/gate-card.js:509`
- severity: medium
- AC: AC-2
- source: bugs

`ymParts.push(lbl + (f.proposal === 'new-contract' ? ' mở hợp đồng mới' : ' ghi Known limits'))` treats a tri-state as a binary. `lib/out-of-contract.js:30` initialises `proposal: ''`, and the finding renderer 8 lines above (line 500-502) correctly distinguishes three cases, printing `'Máy chưa đề xuất hướng nào.'` when proposal is empty or unrecognised.

Reproduced with a review-findings.md entry that has `severity: P0` and no `proposal:` line:

    card body → `Ngoài-1 · Mất dữ liệu khi bấm nút X` / `Máy chưa đề xuất hướng nào.`
    same card → `Trả lời mẫu (một dòng): «Ngoài-1 ghi Known limits; Ký»`

So a P0 out-of-contract bug the machine declined to recommend a disposition for gets a pre-filled "ship it as a known limit" in the line the human is told to copy. Same defect ships in `plugins/acceptance-gate/scripts/gate-card.js`.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **GATE-INVITE-CLAUSE chỉ ship cho Claude — bản Codex của skill `acceptance` và `acceptance-card` không có mệnh đề, và P188 mù với chỗ đó**
  Người dùng thấy gì: Người dùng gọi thẳng skill acceptance hoặc lệnh thẻ acceptance-card trên Codex (không đi qua vòng lặp tính năng) sẽ không thấy hướng dẫn "việc của anh" ở tin mời vào cổng, nên có thể không biết mình cần làm gì tiếp theo.
  file: `codex/acceptance-gate/skills/acceptance/SKILL.md`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Fixture sinh 3 thẻ bằng chứng E7 là bản chép tay thứ hai của fixture P186 — hai bên có thể trôi khỏi nhau mà cả P186 lẫn P190 đều xanh**
  Người dùng thấy gì: Nếu bộ tạo bằng chứng và bộ kiểm thử tự động sau này lệch kịch bản với nhau, thẻ bằng chứng đưa cho người ký duyệt ở Cổng 2 có thể không còn khớp với những gì máy thực sự đã kiểm tra, mà không ai được cảnh báo.
  file: `tests/plugins/fixtures/render-viec-cua-anh-cards.sh`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **P185: unchecked python3 fixture rewrite, and the two status branches render byte-identically**
  Người dùng thấy gì: Rủi ro nằm ở độ tin cậy của bộ kiểm thử tự động, hiện chưa ảnh hưởng người dùng vì hai trạng thái hồ sơ liên quan vốn hiển thị giống hệt nhau trên thẻ.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **P188 round-trip enumerates copies by a 3-word anchor and never asserts a count, so a deleted or head-drifted copy stays green**
  Người dùng thấy gì: Nếu sau này một bản chép của câu mời vào cổng bị xoá nhầm khỏi một nơi đang dùng, hệ thống kiểm tra tự động có thể không phát hiện ra, khiến người dùng ở đó mất hướng dẫn mà không ai biết để sửa.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **P150's declared closed list of intentional render deltas omits the new "Ngoài-<n> · " prefix**
  Người dùng thấy gì: Hiện chưa ảnh hưởng người dùng; đây là một lỗ hổng tiềm ẩn trong bộ kiểm thử tự động có thể khiến một thay đổi hợp lệ trong tương lai bị báo nhầm là lỗi.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Evidence PROVENANCE.md records a sha older than the cards it describes**
  Người dùng thấy gì: Ghi chú nguồn gốc của bộ bằng chứng đang ghi sai phiên bản mã đã sinh ra nó; người xét duyệt dựa vào ghi chú này có thể lầm tưởng bằng chứng cũ hơn thực tế, dù nội dung ba thẻ vẫn đúng với bản mới nhất.
  file: `_acceptance/khoi-viec-cua-anh/evidence/PROVENANCE.md`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 5 + 3: AC-2 hứa "mỗi mục đủ 3 vế" (ma trận mục × vế) nhưng chỉ có 3 assert chuỗi-có-mặt trên CẢ khối**
  Người dùng thấy gì: Nếu sau này một mục hướng dẫn trong thẻ Cổng 2 bị rút gọn thiếu phần "ở đâu" hoặc "trả lời dạng gì", bộ kiểm tự động hiện tại có thể không phát hiện, khiến người dùng nhận thẻ thiếu hướng dẫn mà không ai được cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 3: assert "E9"/"Ngoài-1 có mặt" được thoả bởi CHÍNH dòng Trả-lời-mẫu, không phân biệt được "có liệt mục" với "chỉ có trong câu mẫu"**
  Người dùng thấy gì: Nếu sau này một mục việc-người bị xoá khỏi phần liệt kê chi tiết của thẻ, bộ kiểm tự động có thể vẫn báo qua vì mã việc đó còn xuất hiện ở dòng trả lời mẫu, khiến người dùng nhận thẻ thiếu mục mà không ai biết.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 4: chiều-đỏ của P189 là tautology `str.replace` trong bộ nhớ — không chạy lại checker, và vùng đo trượt sang GATE-INVITE-CLAUSE nên xoá trọn "Luật đi kèm khuôn" vẫn XANH**
  Người dùng thấy gì: Nếu phần luật giải thích khối hướng dẫn bị xoá nhầm khỏi tài liệu, hệ thống kiểm tra tự động hiện có thể không phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 5: AC-4 khai "đúng MỘT mục ký-hay-trả đủ 3 vế" nhưng nhánh PASS-thuần-máy chỉ đếm vế "làm gì:"**
  Người dùng thấy gì: Nếu ở tình huống thẻ PASS không có việc gì cần người làm, mục "ký hay trả lời" duy nhất trên thẻ bị rút gọn thiếu phần "ở đâu" hoặc "trả lời dạng gì", bộ kiểm tự động hiện tại có thể không phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
