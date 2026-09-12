## Trong hợp đồng

### NARROW_NET_BLIND=1 trong chu_ky_gia_tri là dòng CHẾT — đặt trong subshell của command substitution
- file: `scripts/pre-merge-check.sh:482`
- severity: high
- source: conventions
- AC: AC-13
- rationale: AC-13 đòi khi engine không nạp được, lượt chạy phải in một NOTE nói rõ đang chạy bằng bản lùi; cờ NARROW_NET_BLIND bị mất trong subshell nên NOTE đó không bao giờ in ra qua đường chu_ky_gia_tri, đúng lỗ AC-13 mô tả.
- detail: `chu_ky_gia_tri` chỉ được gọi ĐÚNG MỘT chỗ (dòng 1061: `signoff="$(chu_ky_gia_tri "$report")"`), tức luôn chạy trong subshell của `$(...)`. Gán `NARROW_NET_BLIND=1` ở dòng 482 vì thế KHÔNG BAO GIỜ tới được shell cha, nên khối `if [ -n "$NARROW_NET_BLIND" ]` ở dòng 1572 không in gì từ đường này. Đã kiểm bằng repro tối giản: `f(){ FLAG=1; printf fallback; }; v="$(f)"` → `FLAG=[]`.

  Chính chú thích ngay trên dòng 1061 dựa vào cơ chế này: «Engine vắng → lùi về front_field (khai ở NOTE của lưới giữ-chỗ)» — lời hứa đó không được giữ bởi dòng 482.

  Kịch bản hỏng cụ thể: hồ sơ `status: machine-cleared` mang `human_signoff = Manh 2026-09-12` (dạng `=`, engine NHẬN, `front_field` KHÔNG — regex engine là `/^human_signoff[ \t]*[:=]/i`, còn front_field là `sed -n "s/^human_signoff:[[:space:]]*//p"`). Thiếu node/lib → `chu_ky_gia_tri` lùi về front_field → `$signoff` rỗng → luật «chữ ký người trên hồ sơ máy-thông» ở dòng 1136 KHÔNG nổ, và cờ mù bị nuốt nên lượt chạy không khai rằng phép đọc chữ ký đang chạy bằng bản lùi. Tương tự với hồ sơ verdict≠PASS: `continue` ở dòng 1141 xảy ra TRƯỚC `placeholder_signoff` (chỗ duy nhất còn set được cờ), nên lượt chạy im lặng hoàn toàn về việc engine vắng.

  Chân `chan-lui-engine.mjs` không bắt được: nó chỉ đi qua đường `placeholder_signoff` (dòng 455), nơi hàm được gọi TRỰC TIẾP nên cờ propagate bình thường — đúng hình dạng «phép đo không gắn vào vật» mà CLAUDE.md ghi.

  Hướng: cho `chu_ky_gia_tri` in cờ mù ra cùng dòng kết quả (thêm một trường tab) rồi cho bên gọi tự set, hoặc dùng file/marker trong `$TMPDIR` như các seam khác, hoặc gọi hàm ngoài command substitution rồi đọc biến toàn cục như `signoff_that` đang làm với `$SIGNOFF_THAT`.

### signoff_that hỏng-im-lặng khi vắng engine: dòng tổng cửa veto và NOTE làn V nói đúng câu mà CONTEXT.md vừa cấm
- file: `scripts/pre-merge-check.sh:486`
- severity: medium
- source: conventions
- AC: AC-13
- rationale: AC-13 đòi chữ ký thật không bị chặn oan khi engine vắng và phải có NOTE khai đang chạy bản lùi; signoff_that trả về 'chưa ký' cho hồ sơ đã ký thật mà không bật cờ, vi phạm cả hai vế AC-13.
- detail: `signoff_that` trả 1 («chưa ký») cho MỌI hồ sơ khi thiếu node hoặc thiếu `lib/evidence-core.cjs`, và KHÔNG đặt `NARROW_NET_BLIND` — khác hẳn hai hàm anh em ngay cạnh (`placeholder_signoff` dòng 455, `chu_ky_gia_tri` dòng 482) vốn đều đánh dấu. Chú thích khai báo cờ ở dòng 57–59 tự nói ra luật: «một luật im lặng không chạy là luật không còn».

  Hai chỗ đọc đều bị: dòng 846 (`elif signoff_that "$dir"`) và dòng 1436 (`if [ "$vstate" = "mo" ] && signoff_that "$dir"`). Vắng engine, một hồ sơ ĐÃ KÝ THẬT sẽ (a) rơi xuống nhánh cũ và in `NOTE [slug]: làn V — máy đi trước… cửa veto mở`, và (b) được `case mo)` đếm vào `VETO_OPEN_N`. Đó chính xác là hai câu mà mục `_Avoid_` mới thêm ở CONTEXT.md cấm: «gọi hồ sơ ĐÃ KÝ là «còn veto được»». Lượt chạy không khai gì cả.

  Nhánh `chan-lui-engine.mjs` không phủ ca này (nó chỉ dựng hồ sơ chữ-ký-giữ-chỗ đi qua `placeholder_signoff`), nên không có chiều đỏ nào bắt được.

  Hướng: đặt `NARROW_NET_BLIND=1` (hoặc một cờ mù riêng cho vị từ chữ ký) ở đúng nhánh không nạp được engine của `signoff_that` — hàm này được gọi trực tiếp, không qua command substitution, nên cờ propagate được, khác hẳn trường hợp `chu_ky_gia_tri`.

### `NARROW_NET_BLIND=1` trong `chu_ky_gia_tri` bị mất vì chạy trong subshell — lưới đọc chữ ký bằng bản lùi hẹp hơn mà KHÔNG nói ra
- file: `scripts/pre-merge-check.sh:482`
- severity: medium
- source: bugs
- AC: AC-13
- rationale: Cùng lỗ với AC-13: khi engine vắng, lưới phải in NOTE khai đang dùng bản lùi; cờ bị mất qua subshell nên lượt chạy im lặng dùng ngữ pháp hẹp hơn mà không báo, đúng điều AC-13 cấm.
- failure_scenario: Repo tiêu thụ mang cổng vào mà thiếu lib/ (hoặc thiếu node): hồ sơ ký bằng `human_signoff = <tên>` bị chặn với thông điệp «human_signoff is empty», và lần chạy KHÔNG in dòng NOTE khai rằng lưới giữ-chỗ/bộ đọc chữ ký không chạy được — người vận hành đi sửa dòng chữ ký thay vì copy lib/.
- detail: `chu_ky_gia_tri()` (dòng 478–484) bật cờ `NARROW_NET_BLIND=1` ở dòng 482 khi không gọi được engine, rồi lùi về `front_field`. Nhưng chỗ gọi DUY NHẤT của hàm này là dòng 1061 `signoff="$(chu_ky_gia_tri "$report")"` — command substitution chạy trong SUBSHELL, nên phép gán không bao giờ tới được shell cha. Hệ quả: dòng NOTE ở 1572 («lưới giữ-chỗ của chữ ký KHÔNG chạy được lượt này…») không in ra, dù bộ đọc chữ ký vừa tụt xuống một ngữ pháp HẸP HƠN nguồn (`front_field` chỉ nhận `human_signoff:`, không nhận `=`, không nhận hoa-thường, không nhận khoảng trắng trước dấu ngăn — đúng ba hình dạng mà lượt đổi khuôn này vừa mở). Đây là lớp «luật im lặng không chạy là luật không còn» mà chính chú thích dòng 57–59 dựng cờ này để chặn. REPRO (đã chạy): hồ sơ T2, Cổng 1 có chữ duyệt, verdict PASS, `human_signoff = Manh Phan 2026-09-11` (khoá dấu bằng), mục «Known limits» có nội dung nên không xanh-sạch. Engine CÓ → exit 0, không vi phạm. Gỡ `lib/evidence-core.cjs` → exit 1 với «VIOLATION [s]: verdict PASS but human_signoff is empty (Gate 2 pending)» và BLIND note = false. Tức cổng chặn một hồ sơ ĐÃ KÝ, báo sai lý do («rỗng»), và nuốt im lời khai rằng bộ đọc đang chạy suy giảm. Trong các ca mà `placeholder_signoff` (dòng 1140) có chạy thì cờ được bật nhờ dòng 455 của hàm đó, nên lỗi bị che — mọi ca `continue` trước 1140 (chốt rỗng ở 1116, verdict≠PASS, xung đột machine-cleared) đều lộ. Sửa: gọi `chu_ky_gia_tri` không qua subshell (ví dụ cho hàm gán vào một biến toàn cục thay vì in ra stdout), hoặc để hàm tự in dòng NOTE/ghi marker ra một tệp tạm mà shell cha đọc lại.

### `signoff_that` trả «chưa ký» khi vắng engine mà không bật cờ khai báo — danh sách «owner chưa veto» im lặng quay về hành vi cũ
- file: `scripts/pre-merge-check.sh:486`
- severity: low
- source: bugs
- AC: AC-13
- rationale: Cùng lỗ với AC-13: hồ sơ đã ký thật bị báo sai là còn veto khi engine vắng, và không có NOTE khai bản lùi đang chạy — vi phạm cả hai điều kiện AC-13 đặt ra cho ca engine vắng.
- failure_scenario: Cổng chạy ở cây thiếu lib/evidence-core.cjs hoặc thiếu node: mọi hồ sơ `veto_state: mo` đã có chữ ký người đều xuất hiện lại trong dòng tổng «owner chưa veto», và lần chạy không in bất kỳ NOTE nào khai rằng vị từ chữ ký không kiểm được.
- detail: `signoff_that()` (dòng 486–500) `return 1` khi `node "$CHU_KY_LIB" chu-ky-that` thất bại (dòng 495), và KHÔNG đặt `NARROW_NET_BLIND`. Hai chỗ gọi — dòng 846 (NOTE làn V) và dòng 1436 (nhãn `mo-da-ky` trước phép đếm `VETO_OPEN_N`) — vì thế lặng lẽ rơi về hành vi trước bản sửa: hồ sơ ĐÃ KÝ lại bị đếm và bị nêu tên ở dòng tổng «cửa veto đang mở — N hồ sơ máy đã đi trước mà owner chưa veto». Chú thích dòng 490–491 khai đây là «chiều an toàn», nhưng chiều an toàn ở đây nói một câu SAI VỀ SỰ THẬT với người đọc (đúng thứ CONTEXT.md vừa thêm vào mục _Avoid_: «gọi hồ sơ ĐÃ KÝ là còn veto được / owner chưa veto»), nên nó phải nói ra, giống mọi đường suy giảm khác trong tệp này (gap-probe, ac-line, lớp nhìn-thấy đều có NOTE riêng). REPRO (đã chạy): hồ sơ `status: draft`, `veto_state: mo`, `human_signoff: Manh Phan 2026-09-11`. Engine CÓ → không có dòng tổng. Gỡ `lib/evidence-core.cjs` → «NOTE: cửa veto đang mở — 1 hồ sơ máy đã đi trước mà owner chưa veto: s», BLIND note = false. Vòng lặp chính bỏ qua hồ sơ draft nên `placeholder_signoff` không chạy, không có gì che lỗi. Sửa: đặt `NARROW_NET_BLIND=1` ở nhánh không gọi được engine của `signoff_that` (hàm này được gọi trực tiếp, không trong subshell, nên phép gán ở đây propagate được).

### Hình dạng 4 — chiều đỏ DUY NHẤT của AC-7 chỉ so SỐ LƯỢNG VIOLATION, và bản sao chết cũng cho cùng màu xanh
- file: `_acceptance/cua-veto-sau-chu-ky/chan-khong-noi.mjs:44`
- severity: high
- source: measurement
- AC: AC-7
- rationale: AC-7 tự quy định rõ chiều đỏ phải ghim mã thoát đổi và thông điệp «bản sửa đổi luật chặn»; bản triển khai chỉ so số lượng VIOLATION và nuốt mã thoát, không đáp ứng đúng yêu cầu chiều đỏ mà chính AC-7 nêu.
- detail: Dòng 39–47: tiêm `; continue` vào bản sao lưới rồi kết luận bằng `if (vMut.length >= vLanh.length) → ĐỎ`. Không ghim MỘT dòng VIOLATION nào phải biến mất, chỉ so số đếm. `F.runPremerge` (fixture.mjs) nuốt mã thoát (`bash -c '...; echo "__MA__$?"'`) nên một bản sao CHẾT (lỗi cú pháp do tiêm, thiếu tệp, node hỏng) cho `vMut = []`, tức `0 < vLanh.length` → chiều đỏ tự tuyên «đã chạy» trong khi đột biến chưa bao giờ thi hành. Thêm nữa `vLanh` (dòng 43) là lưới BASE chạy trên chính kho ĐÃ tiêm, không phải lưới HEAD chưa tiêm, nên khi số giảm phép đo không tách được «`continue` nuốt chốt bằng chứng» với «base vốn in nhiều VIOLATION hơn». Đối chiếu ngay dưới: chiều đỏ 2 (dòng 52–61) làm đúng — ghim cả mã thoát 97 lẫn chuỗi «LỖI HẠ TẦNG». Vá đúng lớp: ghim đích danh dòng VIOLATION phải mất + đòi mã thoát khác của bản lành HEAD chưa tiêm.

### Hình dạng 4 — chiều đỏ của chan-van-ban tiêm vào BẢN SAO CỦA CHÍNH PHÉP ĐO, và vế `_Avoid_` không có chiều đỏ nào
- file: `_acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs:79`
- severity: medium
- source: measurement
- AC: AC-11
- rationale: AC-11(c) tự nêu chiều đỏ: gỡ từng vật (gồm _Avoid_) khỏi CONTEXT.md phải ĐỎ; phép đo hiện tại không có chiều đỏ nào cho vế _Avoid_, không đáp ứng đúng yêu cầu AC-11(c).
- detail: `goVat()` (dòng 62–70) chép ba tệp ra thư mục tạm, xoá đúng chuỗi mà vị từ đang grep, rồi chấm bằng một vị từ `ktr` VIẾT LẠI TAY (dòng 73, 75–78, 80) chứ không gọi lại chính hàm trong bảng `vat` (dòng 18–37). Phép này chỉ chứng «String.includes hoạt động»; nó không chạm vật thật nào, và nếu vị từ thật trôi khỏi bản chép thì chiều đỏ vẫn xanh. Cụ thể: chiều đỏ 3 (dòng 79–80) gỡ `'ĐÓNG cửa veto'` và `ktr` chỉ kiểm lại đúng chuỗi đó — tức chỉ đánh vào vế `i > 0` của vị từ dòng 32–36; vế thứ hai `t.slice(i, i + 1200).includes('_Avoid_')` KHÔNG có chiều đỏ nào, nên xoá `_Avoid_` khỏi CONTEXT.md (hoặc đẩy nó ra ngoài cửa sổ 1200 ký tự) không làm phép đo nào đỏ, trong khi AC-11(c) đòi đúng vật đó.

### Hình dạng 4 — chiều đỏ của chan-lan-can kết luận CHỈ từ vắng mặt, không chứng bản sao còn chạy
- file: `_acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs:77`
- severity: medium
- source: measurement
- AC: AC-8
- rationale: AC-8 đòi luật «làn V hạng T3 → VIOLATION» vẫn nổ trên hồ sơ đã ký; chiều đỏ hiện tại là assertion âm-tính-một-mình, không ghim thông điệp VIOLATION thay thế để chứng bản sao còn sống, không đáp ứng đúng yêu cầu kiểm chứng của AC-8.
- detail: Dòng 73–80: tiêm điều kiện `&& ! signoff_that "$dir"` vào bản sao rồi kết luận bằng `if (outMut.includes('làn V chỉ T2')) → ĐỎ`, tức toàn bộ chiều đỏ nằm trên một assertion ÂM TÍNH. `F.runPremerge` nuốt mã thoát, nên mọi nguyên nhân làm bản sao không in được gì (tiêm hỏng cú pháp, lưới chết sớm, kho fixture thiếu tệp) đều cho cùng màu «chiều đỏ đã chạy». Không có vế nào ghim rằng bản sao vẫn sống — ví dụ ghim VIOLATION THAY THẾ mà nhánh else phải in («Gate 1 approval was never recorded») hoặc ghim mã thoát. Các chân khác trong cùng hồ sơ (chan-tong dòng 42, chan-quet dòng 56) làm đúng bằng assertion DƯƠNG trên thứ đột biến sinh ra.

### Hình dạng 4 — chiều đỏ 2 của chan-lui-engine chấp nhận «NOTE biến mất» như thể «NOTE in danh sách rỗng»
- file: `_acceptance/cua-veto-sau-chu-ky/chan-lui-engine.mjs:88`
- severity: low
- source: measurement
- AC: AC-13
- rationale: AC-13 đòi câu NOTE «một nguồn» luôn in danh sách thật không bao giờ rỗng và phải kiểm đúng quan hệ đó; chiều đỏ 2 dùng `|| ''` nên coi NOTE biến mất hoàn toàn giống NOTE in danh sách rỗng, không kiểm đúng yêu cầu AC-13.
- detail: Dòng 88–92: `const dongMut = outNote.split('\n').find(l => l.includes('SHORT FIXED prefix list')) || '';` rồi `if (/pending\*/.test(dongMut)) → chiều đỏ KHÔNG chạy`. Toán tử `|| ''` biến ca «không tìm thấy dòng NOTE» thành ca PASS: nếu đột biến (thay `$(node "$CHU_KY_LIB" bang-mau 2>/dev/null)` bằng dạng nháy hỏng) làm lưới chết sớm hoặc làm cả dòng NOTE không in ra, phép đo vẫn báo «chiều đỏ đã chạy». Lời hứa của AC-13 là QUAN HỆ «dòng NOTE VẪN in nhưng danh sách RỖNG», nên assertion phải hai vế: dòng NOTE phải CÒN (`dongMut !== ''`) VÀ danh sách trong nó phải rỗng. Vế dương của chân (dòng 29–33 trên bản lành) không che được ca này vì nó chạy trên một kho khác chưa tiêm.

### Hình dạng 3 — chan-note/CVS1 assert «chuỗi có mặt trong output» trong khi lời hứa là quan hệ ⟨hồ sơ s ↔ câu đã-đóng⟩
- file: `_acceptance/cua-veto-sau-chu-ky/chan-note.mjs:13`
- severity: low
- source: measurement
- AC: AC-1
- rationale: AC-1 đòi lưới in ĐÚNG MỘT dòng NOTE [<slug>] chứa câu đã-đóng; test hiện tại chỉ kiểm chuỗi có mặt bất kỳ đâu trong output, không ghim đúng quan hệ slug↔dòng mà AC-1 yêu cầu.
- detail: Dòng 13 `const coDong = out.includes(F.CAU_GHIM)` chấm sự có mặt của câu «cửa veto đã đóng bằng chữ ký» ở BẤT KỲ đâu trong đầu ra, còn `soDong` (dòng 16, đếm đúng dòng `NOTE [s]`) chỉ được dùng cho vế `if (soDong > 1)` (dòng 21). Hệ quả: `soDong === 0` mà câu xuất hiện ở một dòng khác (dòng tổng, một NOTE toàn cục, một câu văn khác thêm sau này) vẫn PASS — đúng ca mà E1 khai là phải bắt: «đúng MỘT dòng NOTE [s] chứa …». Cùng lỗ ở lưới thường trực tests/scripts/cua-veto-sau-chu-ky.test.mjs:29 (`dong: out.includes(F.CAU_GHIM)`). Vá: đổi `coDong` thành `soDong === 1`, tức ghim quan hệ slug ↔ câu thay vì sự có mặt của chuỗi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **DV5u-mutant chép lại luật thay vì chạy qua luật — chiều đỏ không gắn vào vật**
  Người dùng thấy gì: Một phần bài kiểm tra tự dựng lại quy tắc để tự chấm, nên nếu quy tắc chống nới-lỏng bị suy yếu âm thầm sau này, phép kiểm này có thể không phát hiện ra.
  file: `tests/scripts/additive-only.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Căn cứ của mục ALLOWED_REMOVALS khai sai: vế «Rewording the line is NOT a fix» đã MẤT khỏi cả cây, không «giữ nguyên ý»**
  Người dùng thấy gì: Một dòng ghi chú giải thích trong mã nguồn không còn khớp sự thật, có thể khiến người sửa code sau này hiểu sai lý do một quy tắc cũ được phép đổi.
  file: `tests/scripts/additive-only.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chú thích khai `[ -n "$_vsig" ]` «không còn tới được» là sai — nhánh vẫn sống với chữ ký giữ-chỗ**
  Người dùng thấy gì: Một ghi chú trong mã nói sai rằng một đoạn xử lý đã ngừng hoạt động, có thể khiến người sửa code sau này vô tình xoá nhầm một đường xử lý đang chạy thật.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — E5 tuyên đo TRÊN HAI BỘ ĐỌC (paths có pre-merge-check.sh) nhưng chan-quet.mjs không chạy lưới lần nào**
  Người dùng thấy gì: Một kịch bản kiểm tra tự động cho tính năng này có thể không thực sự chạy đủ cả hai công cụ liên quan cùng lúc, nên một lỗi hồi quy ở một trong hai công cụ có thể lọt qua mà không bị phát hiện.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-quet.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — DV5u-mutant chấm trên BẢN CHÉP viết tay của phép đo, không hề gọi phép đo DV5u**
  Người dùng thấy gì: Một phần bài kiểm tra tự dựng lại quy tắc để tự chấm thay vì gọi đúng quy tắc thật, nên nếu quy tắc gốc bị nới lỏng sau này, phép kiểm này có thể không phát hiện ra.
  file: `tests/scripts/additive-only.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 6/14 lỗi rơi vào file không bộ đo nào phủ (_acceptance/cua-veto-sau-chu-ky/chan-khong-noi.mjs, _acceptance/cua-veto-sau-chu-ky/chan-quet.mjs, _acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs, _acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs, _acceptance/cua-veto-sau-chu-ky/chan-lui-engine.mjs, _acceptance/cua-veto-sau-chu-ky/chan-note.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
