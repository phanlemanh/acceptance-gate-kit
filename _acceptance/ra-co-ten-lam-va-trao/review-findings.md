## Trong hợp đồng

- **/signoff trên hồ sơ machine-cleared bị chính hook chặn nếu ghi theo thứ tự mà signoff.md dạy**
  file: `hooks/acceptance-evidence-gate.js:182`
  severity: high
  AC: AC-15
  Khối mới ở nhánh BÁO CÁO chặn mọi lượt ghi `human_signoff` vào evidence-report.md khi contract.md TRÊN ĐĨA còn `status: machine-cleared` (đọc sibling contract, không đọc ý định của lượt ghi). Nhưng commands/signoff.md bước 7 (dòng 140) dạy đúng thứ tự ngược lại: «ghi các dòng thuộc về người trong evidence-report.md (human_signoff, human_override, verdict upgrade, bypass_ack) + contract status: signed-off». Theo đúng câu đó, lượt ghi ĐẦU là báo cáo → hook exit 2. Đã dựng lại và xác nhận: fixture contract machine-cleared + veto_state mo, Write evidence-report với human_signoff → exit 2, «BLOCKED by acceptance-evidence-gate (machine-cleared × chữ ký)». Chỉ thứ tự contract-TRƯỚC mới đi qua, mà không văn bản nào (signoff.md, thông điệp của hook, CONTEXT.md) nói ra thứ tự đó — thông điệp chỉ nói «/signoff đổi status cùng lượt ghi chữ ký». Hệ quả: Cổng Bằng chứng của mọi hồ sơ làn V đã machine-cleared bị chặn cứng ở lượt đầu, người ký gặp một cổng không có lối ra viết sẵn. Bộ ca RT15 chỉ ghim rằng signoff.md CÓ CHỨA câu «kể cả khi hồ sơ đang machine-cleared» (checkMenhDe) — không ca nào chạy thật một lượt ký trên hồ sơ machine-cleared, nên lớp này xanh mà chưa bao giờ chạy. Sửa: hoặc signoff.md khai thứ tự contract-trước tường minh, hoặc hook cho qua khi lượt ghi báo cáo mang chữ ký và contract sẽ đổi cùng commit (và thông điệp phải nêu bước tiếp theo).
  Rationale: AC-15(b) đòi chuyển machine-cleared→signed-off là chuyển HỢP LỆ trong cùng lượt ghi chữ ký; hook chặn đúng thứ tự ghi mà signoff.md dạy nên đường chuyển hợp lệ đó không đi qua được.

- **Hook chặn cứng /signoff nếu báo cáo được ghi trước hợp đồng (thứ tự ghi không được khai ở đâu)**
  file: `hooks/acceptance-evidence-gate.js:182`
  severity: medium
  AC: AC-15
  Khối mới đọc `contract.md` NẰM CẠNH từ ĐĨA rồi so với payload báo cáo: hợp đồng còn `machine-cleared` mà báo cáo mang `human_signoff` → exit 2. Nhưng `/signoff` (commands/signoff.md bước 3 và bước 7) chỉ nói «`human_signoff` + contract `status: signed-off` … CÙNG lượt», không nói ghi file nào TRƯỚC — trong khi chỉ đúng MỘT thứ tự sống: hợp đồng trước, báo cáo sau. Dựng lại thật (workspace `_acceptance/y`, `enforcement: strict`, contract `status: machine-cleared, risk_tier: T2, approved_by: Manh, veto_state: mo`): đưa payload báo cáo có `human_signoff: Manh 2026-08-24` qua hook → `BLOCKED by acceptance-evidence-gate (machine-cleared × chữ ký)` / `x chữ ký người trên hồ sơ máy-thông — ký thì status phải sang signed-off …` / `HOOK EXIT=2`. Mà bước 6 của signoff.md còn nói rõ «chạy product-map SAU KHI `human_signoff` đã ghi», tức thân lệnh đang gợi ý đúng thứ tự bị chặn. Người ký thật sẽ đâm vào exit 2 giữa nghi thức. Sửa: khai thứ tự bắt buộc (contract → report) trong commands/signoff.md, hoặc cho hook chấp nhận chiều báo-cáo-trước khi hợp đồng đang `machine-cleared` và verdict/PASS hợp lệ.
  Rationale: AC-15(b) đòi chuyển machine-cleared→signed-off là đường hợp lệ cùng lượt ghi chữ ký; không văn bản nào khai thứ tự ghi bắt buộc nên đường hợp lệ đó bị chặn ở đúng lượt ký thật.

- **Chế độ Cổng Đáng của /approve tự mâu thuẫn về tiền tố [đề xuất]; thẻ không cắm cờ cho trạng thái đó**
  file: `commands/approve.md:156`
  severity: low
  AC: AC-8
  Bước 1 của «Chế độ Cổng Đáng»: «`làm`/`lặp` mà ô ngưỡng còn `…` (hoặc còn `[đề xuất]`) và không có dòng «Không đo được — » → TỪ CHỐI». Bước 2 ngay dưới: «Gỡ tiền tố `[đề xuất]` khỏi mọi bullet ngưỡng: ký là nhận». Hai câu loại trừ nhau — nếu bước 1 từ chối khi còn `[đề xuất]` thì bước 2 không bao giờ chạy được, và đường «máy đề xuất → người ký là nhận» (lý do khối `OPP-DE-XUAT-PREFIX` ra đời) chết. Ba bộ đọc khác đang theo vế «`[đề xuất]` là đã điền», không theo bước 1: `lib/nguong-o-co-hoi.cjs` trả trạng thái riêng `de-xuat` (≠ `chua-chot`); `scripts/start-scan.mjs` `thresholdFilled = thresholdState(oTxt) !== 'chua-chot'` → hồ sơ còn `[đề xuất]` vẫn được xếp vào «chờ Cổng Đáng»; `scripts/gate-card.js` gate 0 chỉ cắm cờ đỏ khi `nguong0 === 'chua-chot'` — thẻ `de-xuat` sạch cờ, còn gắn chip «máy đề xuất — anh sửa hoặc nhận», tức mời ký. Kết quả: máy trình thẻ không cờ, người gõ «làm», rồi chính lệnh đó từ chối. Sửa: chốt một nghĩa (khuyến nghị: bỏ vế «hoặc còn `[đề xuất]`» ở bước 1, giữ bước 2), hoặc nếu giữ thì thẻ và start-scan phải cắm cờ cho `de-xuat`.
  Rationale: AC-8(i) đòi thân approve.md vừa có bước 'gỡ tiền tố [đề xuất]: ký là nhận' vừa có răng chối từ chỉ dựa trên dấu `…`; bản thật thêm điều kiện chối cả khi còn [đề xuất], tự mâu thuẫn với chính bước gỡ tiền tố đó.

- **Assertion âm-tính-một-mình: đẳng thức cờ ở RT13(iii) RỖNG trên cây thật và không có chiều đỏ nào (E13 hứa một chiều đỏ không được dựng)**
  file: `tests/plugins/ra-co-ten.test.mjs:670`
  severity: high
  AC: AC-13
  Vòng lặp dòng 672–687 khai là «CỜ đo bằng QUAN HỆ» cho `qua-timebox` và `nguong-chua-chot`. Chạy `node scripts/start-scan.mjs --root .` trên chính cây này: TẤT CẢ ~70 phần tử đều có `flags: []`, và Notes của contract tự khai «0 hồ sơ stage: archived, 5 hồ sơ có timebox … cả 5 còn hạn». Nên mọi assert ở dòng 681 và 686 chỉ so `false !== false` — cả hai vế của đẳng thức chưa từng bật một lần nào. Không có đối chứng dương (không hồ sơ nào mang cờ để chứng minh vế trái bật được) và không có lệnh tiêm nào: khác hẳn (iv) ở dòng 716/725 và (ii) ở dòng 736 vốn đều tiêm vào đầu vào rồi chạy lại phép so. `_acceptance/ra-co-ten-lam-va-trao/evals.yaml` E13 `expected` ghi đích danh chiều đỏ «tiêm một hồ sơ tạm có Timebox quá hạn mà chặn cờ → đỏ nêu vế đẳng thức trượt» — chiều đỏ đó không có trong file ca. Thêm nữa dòng 672 chỉ quét `['gates','inProgress','done']`, bỏ `considering` — mà phần tử `considering` CÓ khoá `flags` (xem tests/plugins/vao-co-o.test.mjs:73 vừa sửa để ghim khoá đó), nên cờ gắn nhầm ở nhóm «đang cân nhắc» không bộ đo nào nhìn.
  Rationale: AC-13(iii) đòi đẳng thức cờ hai chiều có bằng chứng thật ở cả hai vế cộng chiều đỏ tiêm theo evals E13; ca hiện tại chưa từng bật vế nào và thiếu hẳn chiều đỏ đó.

- **Tuyên quét LỚP nhưng thiếu ca cô lập: «ma trận toàn phần 4 ca biên» của RT17 chỉ cô lập được 3 vế**
  file: `tests/plugins/ra-co-ten.test.mjs:888`
  severity: medium
  AC: AC-17
  AC-17 và evals E17 tuyên «ma trận toàn phần 4 ca biên (tắt từng vế), mỗi ca một assert». Mảng `CA` (dòng 875–879) chỉ có 3 fixture, mỗi cái tắt đúng một vế. Vế thứ tư — «`opportunity.md` có» — được «đo» ở dòng 889–893 bằng fixture `mkWs(root,'zz',{contract:{status:'draft'}})`: fixture này tắt HAI vế cùng lúc (có contract ∧ vắng ô cơ hội), và assert của nó (`String(ex.gate) === '0'`) đã được bảo đảm sẵn bởi vế «có contract» mà `CA[0]` vừa chứng. Gỡ hẳn điều kiện «`opportunity.md` có» khỏi bộ tự nhận của gate-card thì cả bốn ca vẫn xanh. Muốn cô lập phải dựng workspace KHÔNG contract và KHÔNG opportunity. Chiều đỏ ở dòng 895–917 cũng chỉ tiêm vế `decision`, ba vế còn lại không có mutant.
  Rationale: AC-17 đòi ma trận toàn phần bốn ca biên mỗi ca cô lập đúng một vế; ca thứ tư trong file thật tắt hai vế cùng lúc nên không cô lập được vế 'có opportunity.md'.

- **Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ giữa thân lệnh ký và hành vi thẻ (RT17)**
  file: `tests/plugins/ra-co-ten.test.mjs:856`
  severity: medium
  AC: AC-17
  Bình luận dòng 854 viết «Bốn vế RÚT TỪ thân lệnh ký, không chép tay», nhưng `VE` (dòng 856–861) là bốn regex GÕ TAY trong file ca, đối chiếu bằng `re.test(ap)` trên TOÀN BỘ `commands/approve.md` (dòng 862) — không cắt phạm vi, không đi qua `checkMenhDe` nên không có mutant DỜI/ĐỔI như mọi hàng mệnh đề khác trong file. Quan trọng hơn: bốn ca hành vi (mảng `CA`, dòng 875) cũng gõ tay và KHÔNG dẫn xuất từ `VE`. Không có chỗ nào nối hai bên, nên lời hứa của AC-17 («bốn vế … rút từ chính thân `commands/approve.md` rồi đối chiếu với hành vi thật») không được đo: nếu approve.md khai một vế thứ năm, hoặc đổi một vế, ma trận hành vi vẫn y nguyên và ca vẫn xanh. So sánh RT8 dòng 796–800, nơi round-trip thật sự được dựng (rút nhãn `g0` từ khối SLOTS rồi đòi mọi nhãn có mặt trong approve.md).
  Rationale: AC-17 đòi bốn vế điều kiện nhận rút từ chính thân commands/approve.md rồi đối chiếu với hành vi thật; bốn vế và bốn ca hành vi trong file đều gõ tay, không có đường nối round-trip nào giữa hai bên.

- **Thước đo một LUẬT KHÁC với vật: oracle của RT13(iii) lệch khỏi lib/nguong-o-co-hoi.cjs ở đúng hai chỗ lib tự khai là bẫy**
  file: `tests/plugins/ra-co-ten.test.mjs:680`
  severity: medium
  AC: AC-13
  Dòng 680 tính `expQua = date != null && date < Date.now()`, trong khi luật sản phẩm `quaTimebox` (lib/nguong-o-co-hoi.cjs:66) là `d + 86400000 <= now` — hạn «muộn nhất <ngày>» BAO GỒM ngày đó. Đúng ngày hạn, hai bên trả ngược nhau. Dòng 684 tính `chot` bằng «mọi bullet ĐANG CÓ đều đã điền», trong khi `thresholdState` (lib/nguong-o-co-hoi.cjs:47–51) đòi ĐỦ nhãn của KHUÔN mới cho `chot` — đây chính xác là bản lệch mà header của lib (dòng 4–7) ghi lại là lỗi vòng 1: «bản thứ ba đã lệch ngay khi ra đời: nó chỉ đòi «mọi bullet ĐANG CÓ đều đã điền», không đòi ĐỦ nhãn của khuôn». Lib được tách ra làm LUẬT DUY NHẤT nhưng ca đo lại chép lại luật lần nữa, và chép lại đúng dạng đã lệch. Hôm nay không lộ vì đẳng thức rỗng (xem finding RT13(iii)); không có ca nào ở nơi khác ghim biên +1 ngày — RT12 (dòng 468–476) chỉ dùng 2000-01-01 / 2999-12-31, cách biên rất xa.
  Rationale: AC-13(iii) đòi cờ đo đúng quan hệ thật của sản phẩm; oracle trong ca lại chép lại một luật khác (đã lệch) so với lib chuẩn, đúng hai điểm mà lib tự khai từng lệch trước đây.

- **Quét không gian mở của RT13(iv) rơi về miễn-trừ-theo-lời-khai cho đúng ba bộ đọc trùng tên file**
  file: `tests/plugins/ra-co-ten.test.mjs:705`
  severity: low
  AC: AC-13
  `coCa = f => khaiPaths.has(f) && testSrc.includes(f.split('/').pop())` (dòng 705). Vế thứ hai được thêm — theo bình luận dòng 701–704 — để chặn «miễn trừ theo LỜI KHAI» (thêm tên vào một dòng `paths` là tắt được răng). Nhưng nó so theo BASENAME. Trong tập `git grep -l signed-off` hiện tại có ba bộ đọc cùng basename `SKILL.md` (`skills/uat-session/SKILL.md`, `skills/acceptance/SKILL.md`, `feature-loop/skills/feature-loop/SKILL.md`); chỉ cần MỘT trong ba được nhắc trong file ca là `testSrc.includes('SKILL.md')` đúng cho cả ba. Với đúng nhóm file mà phép quét cần phân biệt nhất, vế thứ hai vô hiệu và răng thoái hoá về `khaiPaths.has(f)` — tức là chính lỗ mà nó được thêm vào để vá. Bộ đọc SKILL.md thứ tư chỉ cần được thêm tên vào một dòng `paths` của evals.yaml là qua răng mà không cần một assert nào.
  Rationale: AC-13(iv) đòi quét không gian mở chống 'miễn trừ theo lời khai'; so khớp theo tên file ngắn cho phép một trong ba file trùng tên che luôn hai file còn lại, đúng lỗ mà điều kiện này được thêm để vá.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hồ sơ ĐÃ KÝ bị sửa để giữ phép đo xanh — trái doctrine «_acceptance/ cũ là sử liệu bất biến» (ADR 0010)**
  Người dùng thấy gì: Một hợp đồng khác đã được duyệt và ký từ trước bị chỉnh sửa lại chỉ để một phép đếm nội bộ tiếp tục báo đạt, đi ngược quy tắc hồ sơ đã ký là tài liệu lịch sử không được động vào.
  file: `_acceptance/card-text-fidelity/contract.md`
  severity: high
  Đề xuất: new-contract

- **product-map nuốt lỗi fail-closed của lib ngưỡng, trong khi hai bộ đọc anh em chết to**
  Người dùng thấy gì: Khi một tệp cấu hình cần thiết bị thiếu (ví dụ do sao chép không đầy đủ), bảng tổng quan lặng lẽ xếp một hồ sơ đã xong việc vào nhóm 'đang chờ quyết định giá trị' mà không báo lỗi gì, trong khi các màn hình liên quan khác đúng lúc đó báo lỗi rõ ràng.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: new-contract

- **Thẻ Cổng Đáng đã có nhưng commands/acceptance-card.md chưa biết cổng thứ ba tồn tại**
  Người dùng thấy gì: Khi dùng lệnh xem thẻ quyết định cho một cơ hội đang chờ ký ở cổng đầu tiên, phần hướng dẫn của lệnh đó vẫn mô tả sai loại cổng và cách đọc thẻ, khiến người dùng có thể không biết cách ký hoặc hiểu nhầm nội dung thẻ.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: new-contract

- **start-scan gắn cờ cho cả bốn nhóm, thân /start chỉ dạy in cờ cho nhóm cổng**
  Người dùng thấy gì: Các cảnh báo quan trọng như 'hồ sơ đã quá hạn xét lại' hoặc 'ngưỡng chưa chốt' được gắn vào nhiều hồ sơ ở các nhóm khác nhau trên bảng điều khiển, nhưng màn hình /start chỉ in cảnh báo cho một nhóm — cảnh báo ở các nhóm còn lại không hiện ra cho người dùng thấy.
  file: `commands/start.md`
  severity: medium
  Đề xuất: new-contract

- **product-map nuốt lỗi khi phân loại ô ngưỡng — hai bộ đọc kết luận trái nhau**
  Người dùng thấy gì: Khi tệp cấu hình dùng để phân loại ngưỡng bị thiếu, bảng tổng quan không báo lỗi mà lặng lẽ đưa ra kết luận trái ngược với những gì các màn hình kiểm tra khác đang nói về cùng một hồ sơ — người xem hai màn hình sẽ thấy hai câu trả lời khác nhau cho cùng một câu hỏi.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **Bộ quét và bản đồ dán nhãn «bằng chứng xanh-sạch» cho lời khai machine-cleared mà không bao giờ kiểm**
  Người dùng thấy gì: Bảng điều khiển gắn nhãn 'bằng chứng đã sạch, không ai cần làm gì' cho một hồ sơ máy tự thông qua dù chưa hề kiểm tra các điều kiện thực sự chứng minh điều đó — kể cả khi bằng chứng thật có kết luận thất bại rõ ràng, nhãn trên bảng vẫn nói mọi thứ ổn.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: new-contract

- **Thẻ Cổng Phạm vi coi dòng «Không đo được — …» là ngưỡng đã khai, rồi đòi «Đường đo»**
  Người dùng thấy gì: Khi một hồ sơ đã khai rõ 'ngưỡng này không đo được', thẻ duyệt vẫn coi như ngưỡng đã điền đủ và đòi thêm một mục 'Đường đo' — người duyệt bị yêu cầu làm một việc vô nghĩa hoặc phải mở thêm một mục miễn trừ thừa trước khi có thể ký.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình / xanh-không-chạy: id khai trong ALL_IDS mà không có thân → suite XANH im lặng**
  Người dùng thấy gì: Một số kịch bản kiểm thử được khai tên trong danh sách nhưng thực tế không có nội dung kiểm tra nào chạy — bộ kiểm thử vẫn báo 'đạt' y hệt như khi kịch bản đó chạy đầy đủ, nên một phần việc kiểm tra có thể biến mất mà không ai nhận ra.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Fixture viết tay đúng khuôn BÊN ĐỌC: bộ xương ô cơ hội không rút từ opportunity-template.md**
  Người dùng thấy gì: Một số kịch bản kiểm thử tự dựng dữ liệu mẫu theo đúng khuôn mà phần đọc dữ liệu mong đợi, thay vì lấy từ mẫu gốc mà người thật sẽ điền vào hồ sơ — nếu mẫu gốc đổi định dạng mà phần đọc chưa kịp cập nhật theo, các kịch bản này vẫn báo đạt dù sản phẩm thật đã hỏng.
  file: `tests/plugins/ra-co-ten.test.mjs`
  severity: medium
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 2/17 lỗi rơi vào file không bộ đo nào phủ (_acceptance/card-text-fidelity/contract.md, commands/acceptance-card.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.