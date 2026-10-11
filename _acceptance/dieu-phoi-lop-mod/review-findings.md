# Review findings: dieu-phoi-lop-mod

Round 3, verified_commit eef19323f3a4357aa7d49b8263f46fcd42490792.

## Trong hợp đồng

- **E8 (và AC-8) vẫn đòi README nói hook «bỏ qua thân heredoc» — trái với lần thu phạm vi AC-2**
  file: `_acceptance/dieu-phoi-lop-mod/evals.yaml:137`
  severity: high
  AC: AC-8
  source: conventions
  detail: Commit 6a3f1e92 (dòng 20–21 của sổ quyết định) thu luật «thân heredoc là dữ liệu». Lượt đó đã sửa E2/E3 trong evals.yaml, nhưng bỏ sót câu hỏi judgment của E8. Vế (1) vẫn hỏi: «README có đủ: hook chặn S4 nhận vỏ bọc mang cờ và bỏ qua thân heredoc, --check, --help». README sau thay đổi (dieu-phoi/README.md dòng 79–84) nói điều ngược lại: «Thân heredoc được quét như mọi dòng lệnh, nên heredoc nhắc tên một trong ba script vẫn bị chặn». contract.md AC-8 (dòng 58, ngoài vùng vật nhưng cùng nguồn) cũng còn đúng câu cũ. Hệ quả: ở lượt 3, cũng là lượt trần theo decision 21, hội đồng judge đọc đúng chữ sẽ thấy vế (1) không thoả và đề xuất FAIL E8 (REJECT ở lượt trần). Nếu judge dễ dãi thì E8 cho PASS trên một tiêu chí README không còn đáp ứng. Đây là phép đo trôi khỏi vật ngay trong lượt thu phạm vi: sửa E2/E3 mà không quét các eval khác cùng nhắc heredoc. Theo luật «sửa theo LỚP» trong CLAUDE.md thì phải soát cả file.
  rationale: AC-8 đòi README nêu hook «bỏ qua thân heredoc», còn README sau lần thu phạm vi AC-2 nói ngược (heredoc vẫn bị chặn), nên AC-8 đọc đúng chữ không thoả.

- **VO_BOC là object thường: từ lệnh trùng khoá prototype (constructor, toString, valueOf…) làm bộ phân loại ném lỗi, hook chặn S4 crash thoát 1 và mở lối cho S4**
  file: `dieu-phoi/scripts/phan-loai-s4.mjs:110`
  severity: high
  AC: AC-7
  source: bugs
  detail: Lượt này đổi VO_BOC từ một Set (`VO_BOC.has(t)`) sang một object thường, rồi tra bằng `const vb = VO_BOC[t]`. Khi từ đầu của một đoạn là khoá của Object.prototype (`constructor`, `toString`, `valueOf`, `hasOwnProperty`, `__proto__`…), `vb` là hàm hay object có thật. Có hai cách nó vỡ. (a) Gặp một cờ phía sau thì `vb.giaTri.includes` ném TypeError. (b) Không có cờ thì `i += vb.viTri` cho ra NaN, rồi `path.basename(tu[NaN])` ném «The "path" argument must be of type string». Ca thật hay gặp: thân heredoc ghi một tệp JS/TS có class. tachDoan quét thân như dòng lệnh, nên dòng `  constructor(x) {` cắt ở `(` thành đoạn ['constructor']. Đã chạy để kiểm: `cat > a.mjs <<'EOF'\nclass A {\n  constructor(x) {...}\n}\nEOF\nnode x/repin-lane.mjs --write` thì bản mới NÉM, merge-base trả 's4'. `toString -x` và `valueOf` cũng ném. Trong hook-chan-s4.mjs, chayHook gọi `phanLoai(dauVao)` ở dòng 123, NGOÀI try/catch «chặn để an toàn», nên tiến trình crash với stack trace và thoát 1. Đã chạy hook thật ở một kho KHÔNG có đợt: exit=1 kèm stack trace. Với PreToolUse, thoát 1 chỉ là lỗi không chặn. Hệ quả: (1) trong đợt, lệnh S4 đi cùng lời gọi Bash ấy KHÔNG bị chặn nữa, trong khi merge-base có chặn (fail-open); (2) ở mọi kho cài gói, kể cả kho không có đợt, mỗi lần viết class JS qua heredoc đều in lỗi hook, trái AC-7 («kho không đợt: thoát 0, stderr rỗng»). Cách sửa: tra bằng `Object.hasOwn(VO_BOC, t)`, hoặc dùng Map hay `Object.create(null)`; đồng thời đưa lời gọi phanLoai ở dòng 123 vào try.
  rationale: AC-7 đòi ở kho không có đợt hook chặn S4 im hoàn toàn (thoát 0, stderr rỗng); finding chỉ ra một lệnh ghi lớp JS qua heredoc làm hook sập và in lỗi ngay ở kho không đợt, đồng thời mở lối cho lệnh S4 đi kèm.

- **E8 (và AC-8, card-plain) vẫn đòi README nói hook «bỏ qua thân heredoc» sau khi lượt này thu luật đó**
  file: `_acceptance/dieu-phoi-lop-mod/evals.yaml:137`
  severity: medium
  AC: AC-8
  source: bugs
  detail: Commit 6a3f1e92 thu luật «thân heredoc là dữ liệu»: heredoc nhắc tên script S4 nay bị chặn. Commit đó cập nhật E2 và E3 trong evals.yaml, nhưng câu hỏi judge của E8 vẫn ghi «(1) README có đủ: hook chặn S4 nhận vỏ bọc mang cờ và bỏ qua thân heredoc, --check, --help», và AC-8 trong contract.md:58 cũng vậy. README mới viết đúng điều ngược lại («Thân heredoc được quét như mọi dòng lệnh, nên heredoc nhắc tên một trong ba script vẫn bị chặn»). Vì thế judge E8 chỉ có hai ngả, ngả nào cũng hỏng: FAIL vế (1) vì một yêu cầu trái với hành vi đã ship, hoặc PASS một tiêu chí mà chữ của nó không thoả. card-plain.json cũng trôi theo cùng nhát thu: AC-2 hứa «Sẽ KHÔNG chặn … lệnh ghi tệp mà thân văn bản nhắc tên script», AC-3 hứa «chứng rằng bản cũ sai đúng chín ca» (nay là 7). Người đọc thẻ ở cổng sẽ thấy lời hứa trái với vật. Cách sửa: sửa vế (1) của E8 và AC-8 thành «heredoc nhắc tên script vẫn bị chặn — giới hạn đã khai», và render lại card-plain.
  rationale: Cùng gốc với finding đầu tiên của mục này: AC-8 và câu hỏi chấm E8 còn đòi README nói «bỏ qua thân heredoc» trong khi README và AC-2 đã thu luật đó.

- **Hình dạng 1: E8 vẫn hỏi README có nói «bỏ qua thân heredoc» hay không, tức là đo văn mô tả theo một lời hứa đã thu, trái với hành vi thật mà DP6-02 ghim**
  file: `_acceptance/dieu-phoi-lop-mod/evals.yaml:137`
  severity: medium
  AC: AC-8
  source: measurement
  detail: Vế (1) câu hỏi của judge E8 vẫn đòi «README có đủ: hook chặn S4 nhận vỏ bọc mang cờ và bỏ qua thân heredoc, --check, --help». Hàng 20 của sổ quyết định (revisit S4-r2) đã thu luật «thân là dữ liệu». Lượt đó sửa E2/E3 nhưng bỏ sót E8, và AC-8 của contract cũng vẫn giữ chữ «bỏ qua thân heredoc». Hành vi thật thì ngược lại: phan-loai-s4.mjs quét thân heredoc như mọi dòng lệnh, DP6-02 chi-doc-heredoc/hook-im khẳng định mọi ô heredoc bị chặn, và README dòng 83 viết đúng điều đó («Thân heredoc được quét như mọi dòng lệnh… vẫn bị chặn»). Vì vậy E8 cho một trong hai kết cục sai. Judge đọc đúng chữ thì chấm FAIL một README đúng. Nếu ai đó sửa README thành hứa bỏ qua heredoc thì judge chấm PASS một tài liệu nói sai hành vi. Phép đo bám vào lời mô tả cũ chứ không bám vào đầu ra của bộ phân loại.
  rationale: Cùng gốc với hai finding AC-8 ở trên: câu chấm E8 và chữ AC-8 bám vào lời hứa «bỏ qua thân heredoc» đã bị AC-2 thu lại, nên AC-8 không thể thoả cùng lúc với hành vi thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **DP6-03 lech-o-goc vẫn lấy bản «cũ» từ merge-base sống (HEAD vs origin/main), nên đỏ trên main ngay khi gộp (còn từ r1, tệp đã sửa lượt này)**
  Người dùng thấy gì: Phép thử so bản chặn lệnh mới với «bản cũ» lấy từ lịch sử đang chạy. Ngay khi gộp vào nhánh chính, bản cũ trở thành chính bản mới nên phép thử báo đỏ trên nhánh chính và mọi nhánh sau dù không có lỗi thật, làm kẹt các lượt kiểm tự động cho đến khi ghim lại một mốc cũ cố định.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 6 (mang sang r1, còn ở các dòng đổi lượt này): mốc «bản cũ» rút từ merge-base SỐNG nên lech-o-goc đỏ ngay khi gộp, còn so sánh ngang merge-base mới thêm ở khong-lot thành tự so với chính nó**
  Người dùng thấy gì: Mốc «bản cũ» của các phép so sánh đang lấy từ lịch sử đang chạy; sau khi gộp, bản cũ trùng bản mới nên một phép thử đỏ oan trên nhánh chính, còn phép so ở nhóm lệnh không bỏ lọt trở thành tự so với chính nó, luôn xanh và không còn đo được gì.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Đột biến khong-lot-than-la-du-lieu: tập ô kỳ vọng đỏ = toàn bộ ma trận (15/15), thiếu kiểm số &lt; tổng**
  Người dùng thấy gì: Phép thử chứng minh luật «phần văn bản đi kèm lệnh chỉ là dữ liệu» chỉ kiểm rằng mọi trường hợp đều đỏ khi phá luật, không còn trường hợp nào đứng yên để đối chứng; nếu bộ chặn lệnh hỏng hoàn toàn thì phép thử này vẫn xanh. Rủi ro thấp vì một phép thử khác trong cùng bộ đã kiểm chiều đứng yên của đúng luật này.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4: đột biến khong-lot-than-la-du-lieu làm đỏ 15/15 ô, không còn ô nào đối chứng chiều im, nên phép so tập suy biến thành «đỏ hết»**
  Người dùng thấy gì: Phép thử luật «phần văn bản đi kèm lệnh chỉ là dữ liệu» không còn trường hợp đối chứng nào đứng yên, nên nếu bộ chặn lệnh hỏng toàn phần thì phép thử vẫn cho kết quả giống hệt. Hậu quả thật gần như không có vì chiều đứng yên của luật này đã được kiểm ở một phép thử khác.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3: lech-o-goc gõ cứng con số 7, trong khi AC-3 hứa ĐÚNG bảy lời gọi nào sai (ba bỏ lọt, bốn --check/--help) — lời hứa là quan hệ tập, assert chỉ là số đếm**
  Người dùng thấy gì: Phép thử chỉ đếm đủ bảy chỗ bản cũ nhận diện sai, không kiểm đó có đúng là bảy chỗ đã hứa (ba lệnh bị bỏ lọt, bốn lệnh chỉ đọc bị chặn nhầm). Nếu bản cũ sai ở chỗ khác mà vẫn đủ bảy thì phép thử vẫn xanh; hậu quả thấp vì bản cũ là một mốc đã cố định.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4: phần mới của hook-im kết luận «hook chặn heredoc» chỉ từ mã thoát 2, không ghim thông điệp, trong khi hook có một đường thoát 2 khác là lỗi nội bộ (chặn để an toàn)**
  Người dùng thấy gì: Phép thử khẳng định lệnh bị chặn chỉ dựa vào việc nó bị từ chối, không kiểm lý do từ chối. Nếu bộ chặn từ chối vì lỗi nội bộ thay vì vì khoá đang do dãy khác giữ thì phép thử vẫn xanh, nên có thể che mất một lỗi thật.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Bản vá «cờ mang giá trị của shell» chỉ sửa một trong hai bộ đọc argv bash cùng tệp; `bash -o pipefail -c '<S4>'` vẫn lọt (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu lệnh chạy kiểm định S4 được gõ qua bash kèm tuỳ chọn như pipefail, chốt chặn không nhận ra nó, nên hai dãy việc vẫn có thể chạy S4 cùng lúc dù một dãy đang giữ lượt. Lỗi này có từ trước vòng này, không phải do vòng này gây ra.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Cổng «bỏ qua» của ca nguồn chép lại cách rút đường của rut(), và fixture dựng theo khuôn bên đọc (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này cách tìm bản ghi hội thoại thay đổi, bài kiểm thử có thể báo «bỏ qua» sai hoặc báo lỗi không đúng chỗ. Sản phẩm hiện tại vẫn đúng; hậu quả chỉ là bài kiểm thử kém tin cậy hơn ở lần sửa sau.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Cùng lớp với lượt sửa R1 mà chưa vá: phanLoaiTu coi giá trị của -o/-O/--rcfile là tệp script, nên `bash -o pipefail -c '…'` lọt (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một số cách gõ lệnh chạy kiểm định S4 qua bash kèm tuỳ chọn (ví dụ pipefail) vẫn đi qua chốt chặn, nên có thể có hai dãy chạy S4 trùng nhau mà không bị cản. Đây là chỗ hở có sẵn từ trước, vòng này chưa đóng nó.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Dấu đóng heredoc có nháy chứa dấu cách làm lệch trạng thái nháy và nuốt phần còn lại của lệnh (r2 · tệp đã đổi)**
  Người dùng thấy gì: Với một kiểu viết khối lệnh rất hiếm (dấu kết thúc có chứa khoảng trắng), chốt chặn đọc sai và bỏ sót lệnh chạy S4 nằm phía sau, nên lệnh đó đi qua dù một dãy khác đang giữ lượt. Rất ít gặp trong thực tế.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **doThongDich bỏ qua `env -S '<shell>'`, nên thân heredoc đưa cho shell qua env -S thành dữ liệu (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi nội dung lệnh được đưa cho một shell thông qua lớp bọc đặc biệt của env, chốt chặn coi nội dung đó là dữ liệu và không chặn, dù shell vẫn chạy nó. Trường hợp này rất hiếm, hậu quả là một lệnh S4 có thể chạy trong lúc dãy khác đang giữ lượt.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: bản sửa «bash kèm cờ mang giá trị» nói là phủ cả lớp nhưng ma trận khong-lot chỉ có ba điểm, và bốn đột biến của chính luật mới vẫn qua toàn bộ suite (r2 · tệp đã đổi)**
  Người dùng thấy gì: Bộ kiểm thử chưa đủ chặt để phát hiện nếu sau này ai đó vô tình làm hỏng cách chốt chặn xử lý vài tuỳ chọn bash ít gặp; hiện tại chốt chặn vẫn chạy đúng. Hậu quả chỉ xuất hiện ở lần sửa sau, khi lỗi có thể lọt qua mà không ai thấy.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **DP6-03 lech-o-goc lấy bản «cũ» từ merge-base sống, nên đỏ ở CI của main ngay sau khi gộp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ngay khi nhánh này gộp vào nhánh chính, một bài kiểm tra của bộ chặn lệnh sẽ báo đỏ dù không có gì hỏng, vì bản «cũ» nó so sánh lúc đó đã chính là bản mới. Kiểm tra tự động của nhánh chính bị đỏ và các vòng sau bị vướng; hai bài kiểm tra khác vẫn xanh nhưng không còn kiểm được gì.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **can_phan gắn cho mọi sự kiện cho-nguoi, nên mỗi yêu cầu can-nguoi của DP7 đánh thức giám sát hai lần (r1)**
  Người dùng thấy gì: Mỗi lần một thợ gửi yêu cầu cần người quyết, giám sát bị đánh thức hai lần cho cùng một việc, và lần thứ hai không nói việc đó của ai. Giám sát có thể coi đó là một việc chờ người riêng và báo người dùng thừa một lần.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **DP6-04 hang-viec-hong kết luận «xin thật sự từ chối» chỉ từ mã thoát khác 0, không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một bài kiểm tra xác nhận lệnh xin lượt bị từ chối khi hàng việc hỏng, nhưng chỉ nhìn việc nó thất bại chứ không kiểm lý do. Nếu lệnh hỏng vì nguyên nhân khác, bài vẫn xanh và lỗi thật có thể bị che.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **`#` đứng ngay sau `)` / `))` bị coi là mở chú thích, nuốt phần còn lại của dòng: lọt lệnh S4 phía sau (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một dạng lệnh hiếm, có dấu # dính liền sau dấu ngoặc đóng, bị hiểu nhầm là chú thích nên phần lệnh phía sau lọt qua khoá. Khi đó hai phiên có thể cùng chạy một việc lẽ ra phải chờ lượt.
  file: `dieu-phoi/scripts/phan-loai-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 — mốc «bản cũ» rút từ merge-base SỐNG của checkout (HEAD vs origin/main), không ghim vào lịch sử: DP6-03 lech-o-goc đỏ ngay khi gộp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Sau khi nhánh này gộp vào nhánh chính, bài kiểm tra «bộ chặn lệnh cũ sai chín lời gọi thật» sẽ đỏ dù không có gì hỏng, vì bản cũ lúc đó đã là bản mới. Hai bài kiểm tra khác sẽ xanh nhưng không còn đo gì, nên người dùng tưởng được bảo vệ khi nâng cấp mà thực ra không.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 1 — DP6-07 ten-ca-cu đo tên ca KHAI trong mã nguồn, không đo dòng «ok» của lượt chạy (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra «ca cũ không bị mất» chỉ đếm tên ca còn được khai trong mã, không đếm ca thật sự chạy xanh. Một ca bị tắt đi vẫn được tính là còn, nên có thể mất một lớp bảo vệ mà không ai hay.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — DP6-04 loi-chan: lời hứa là QUAN HỆ với lời chặn của merge-base, assert chỉ là tiền tố regex + vắng chuỗi con (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra lời chặn chỉ xem câu mở đầu và sự vắng một cụm từ, chưa so trọn với lời chặn của bản cũ. Nếu phần đuôi của lời chặn bị đổi sai, bài vẫn xanh và người dùng có thể nhận lời chặn khác hẳn mà không ai báo.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-04 hang-viec-hong: «xin thật sự từ chối» chỉ assert mã thoát khác 0, không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra «lệnh xin lượt bị từ chối khi hàng việc hỏng» chỉ nhìn việc lệnh thất bại mà không xem vì sao thất bại. Lệnh hỏng vì lý do khác cũng cho cùng kết quả xanh, nên lỗi thật có thể bị che.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-02 tien-de-help: thoát khác 0 và «băm cây trước == sau» cũng đúng khi KHÔNG có --help, nên hai vế đó không đo gì (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai vế kiểm tra «xem trợ giúp không làm đổi gì» vẫn xanh dù không có cờ trợ giúp, nên chưa chứng minh được điều cần chứng. Nếu một script khi chạy trợ giúp lại làm thay đổi kho, bộ kiểm tra có thể không báo.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — DP6-03 tep-ca: kiểm ẩn danh theo tên người dùng của MÁY CHẠY, không có đối chứng dương cho anDanh (r1 · tệp đã đổi)**
  Người dùng thấy gì: Việc kiểm «tệp ca không lộ tên người dùng» chỉ có nghĩa trên máy của tác giả; ở máy khác bài vẫn xanh dù tên tác giả có lọt vào. Tên người dùng có thể đi kèm bản phát hành mà không bị bắt.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture tay đúng khuôn bên đọc: DP6-05 tự ghi xin/P1-s4.json, yeu-cau/P1-1.json; giuKhoa tự ghi khoa/s4/chu.json (r1 · tệp đã đổi)**
  Người dùng thấy gì: Vài bài kiểm tra tự tạo tệp «đơn xin» và «yêu cầu» bằng tay thay vì để chính lệnh thật tạo ra. Nếu cách đặt tên của lệnh thật đổi, các bài vẫn xanh trong khi việc báo «đang chờ người» ngoài đời có thể đã mất.
  file: `tests/dieu-phoi/lop-mod.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/dieu-phoi-lop-mod/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
