# Review Findings: o-chi-mo-khi-co-neo-ngoai (round 4)

## Trong hợp đồng

### Chiều «hạt giống mồ côi im» vẫn là assertion rỗng — lần này rỗng theo cấu trúc, không theo sơ suất
- file: `tests/plugins/vao-co-o.test.mjs:383`
- severity: high
- source: conventions
- AC: AC-2

Khối mới (dòng 375–387) định nghĩa `moCoi` = slug hạt giống trong `docs/plans` mà `_acceptance/<slug>` KHÔNG tồn tại, rồi lọc `neoErrs(accDir, TEMPLATE)` lấy lỗi bắt đầu bằng `<slug>:`. Nhưng `neoErrs` duyệt đúng `readdirSync(accDir)` và mọi lỗi nó sinh ra đều mang tiền tố là tên một thư mục CÓ trong `_acceptance`. Hai tập rời nhau theo định nghĩa, nên `neu` luôn `[]` — không mutant nào, không hồi quy nào làm ca này đỏ. Đo thật trên cây: `moCoi` = 6 slug (1c-doi-hanh-vi-cong-nguoi, bai-hoc-tuan-do-luong, go-lop-chung-minh-chu-ky, vlm-assert-phai-khai-la-nhan-nuoi, khop-vong-dac-ta-ux, do-loi-hua-van-xuoi); giao với `readdirSync('_acceptance')` = rỗng. Thêm nữa, luật cũ «mọi hạt giống phải có ô» trước đây sống TRONG chính VC8 (bản 418295d0 dòng 251–282), không ở bên đọc sản phẩm nào — nên «nếu ai cắm lại luật cũ vào bất kỳ bên đọc nào thì ca này đỏ» không đúng: `neoErrs` là vị từ nội bộ của test, không gọi start-scan/product-map. Phần duy nhất còn sống là guard `!moCoi.length` — và nó lại ghim VC8 vào trạng thái cây (mở ô cho cả 6 hạt giống mồ côi, một việc hợp lệ, sẽ làm VC8 đỏ vì hạ tầng). Hệ quả: dòng PASS «hạt giống mồ côi im (đo trên cây thật)» và câu expected của E2 («chiều này đo trên CÂY THẬT (6 hạt giống mồ côi có thật, không tên nào bị gọi)») đang tuyên một chiều đo không tồn tại — đúng lớp lỗi t4 mà lượt chấm 3b đã bắt, chỉ đổi da.

Vì sao trong hợp đồng: AC-2 nêu đích danh «hạt giống docs/plans/*-hat-giong-* không có ô → IM (đảo chiều VC8 cũ)»; finding chỉ ra chiều này không có phép đo nào có thể đỏ, tức AC-2 chưa được chứng minh.

### Chuyển `fmv` sang `frontmatterField` không có chiều đỏ: chép lại y nguyên bộ đọc cũ, cả bộ VC1–VC9 vẫn xanh
- file: `tests/plugins/vao-co-o.test.mjs:73`
- severity: high
- source: conventions
- AC: AC-2

Đường A của S4-r3 thay bộ đọc chép tay bằng `frontmatterField` của lib, và evals.yaml E2 (dòng 30–31) tuyên «Bộ đọc frontmatter HỎI lib `frontmatterField`, không chép: khoá để trống thôi nuốt dòng kế, và dòng `status:` trong thân bài thôi đầu độc cửa miễn trừ». Không phép đo nào ghim lời tuyên đó. Thực nghiệm: thay dòng 73 về đúng bản chép cũ `const fmv = (t,k) => { const m = t.match(new RegExp(\`^${k}:\\s*(.*?)\\s*(#.*)?$\`,'m')); return m ? m[1].trim() : ''; };` rồi chạy `node tests/plugins/vao-co-o.test.mjs` → exit 0, cả VC1–VC9 đều PASS (đã khôi phục file, `git status` sạch). Cụ thể VC9 không có ca nào đặt `status:` trong THÂN BÀI của một hồ sơ mốc chưa ký để chứng minh cửa miễn trừ không bị đầu độc, và không ca nào có khoá frontmatter để trống không kèm comment để chứng minh cú nuốt dòng kế đã chết. Contract AC-2 đòi «Mọi lần đọc frontmatter đi qua `frontmatterField` của lib, không chép lại» — bất biến của repo là mệnh đề đó phải có chiều đỏ gọi đúng vật, nếu không thì «đã hỏi lib» và «vẫn đang chép» cho cùng một màu xanh. Cũng lưu ý lời tuyên về `status:` thân bài nằm ở E2 (cmd `neo_vc8`) trong khi cửa miễn trừ chỉ chạy ở VC9 (E3), nên ngay cả khi dựng ca thì nó phải nằm ở E3.

Vì sao trong hợp đồng: AC-2 ghi rõ «Mọi lần đọc frontmatter đi qua frontmatterField của lib, không chép lại»; finding chứng minh bằng thực nghiệm rằng không phép đo nào phân biệt hai cách đọc, nên vế này của AC-2 chưa được đảm bảo.

### Chiều «hạt giống mồ côi IM» vẫn là assertion không thể đỏ — bản vá r3 chưa đóng lỗi r3b
- file: `tests/plugins/vao-co-o.test.mjs:383`
- severity: high
- source: bugs
- AC: AC-2

Commit HEAD (58ba3177) tuyên «chiều hạt giống mồ côi có vật thật», và VC8 nay in «hạt giống mồ côi im (đo trên cây thật)». Nhưng vế so sánh vẫn rỗng theo CẤU TRÚC:

  const moCoi = readdirSync(plansDir).filter(...).map(...).filter(sl => !existsSync(path.join(accDir, sl)));
  const neu = neoErrs(accDir, TEMPLATE).filter(e => moCoi.some(sl => e.startsWith(sl + ':')));

`moCoi` chỉ giữ slug KHÔNG có thư mục trong `_acceptance`, còn `neoErrs` chỉ phát mã lỗi dạng `<slug>:` với `slug` lấy từ `readdirSync(accDir)`. Hai tập rời nhau theo định nghĩa, nên `neu` là [] với MỌI cây và MỌI nội dung hồ sơ.

Failure scenario: cắm lại luật cũ «mọi hạt giống phải có ô» vào bất kỳ bên đọc nào (kể cả vào chính `neoErrs` dưới dạng một vòng quét `docs/plans`) — nhánh `neu.length` không bao giờ chạy tới, VC8 vẫn XANH và vẫn in «hạt giống mồ côi im (đo trên cây thật)». Nhánh duy nhất còn sống là `if (!moCoi.length)`, tức nó chỉ canh việc cây thật còn ≥1 hạt giống mồ côi, không canh hành vi của phép đo.

Đây đúng lớp lỗi mà review-findings.md mục «Chân hạt giống mồ côi IM của VC8 là assertion rỗng» đã bắt ở lượt chấm 3b — bản vá đổi mã nhưng không đổi tính hằng-đúng. Ngoài ra dòng 371 `W(r, 'docs/plans/2026-01-01-hat-giong-mo-coi.md', …)` là tàn dư của bản cũ: tệp vẫn được ghi vào fixture và vẫn không bên đọc nào chạm tới.

Để chiều này có vật, phép đo phải có một bên đọc THẬT sự đọc `docs/plans` (ví dụ: chạy một vị từ «ô nào bị gọi tên» trên tập hợp gồm cả seed slug, hoặc dựng fixture có seed mồ côi + bên đọc hiện hành rồi đòi tập lỗi rỗng, kèm mutant cắm lại luật cũ để bản tiêm phải ĐỎ).

Vì sao trong hợp đồng: Cùng vế «hạt giống không có ô → IM» của AC-2; finding đo trực tiếp trên cây thật cho thấy hai tập hợp so sánh rời nhau theo định nghĩa, nên vế này của AC-2 vẫn không có chiều đỏ.

### Răng VC9 nhận lời khai PHỦ ĐỊNH làm tên kho — «chưa có kho nào» qua cổng
- file: `tests/plugins/vao-co-o.test.mjs:133`
- severity: medium
- source: bugs
- AC: AC-3

`khoErrs` bác giá trị bằng một DANH SÁCH ĐÓNG trên không gian mở:

  const BAC_KHO = new Set(['', 'chưa có', '(chưa có)', 'không', '—', '…']);
  const ok = !BAC_KHO.has(val) && val.split(/[,\s·]+/).filter(Boolean).some(k => /^[a-z0-9][a-z0-9._-]+$/.test(k));

Bất kỳ chữ nào ngoài đúng 6 chuỗi đó chỉ cần chứa MỘT token ascii thường ≥2 ký tự là qua. Chạy thử vị từ này:
  «Kho chờ nhận: chưa có kho nào»        → IM (token «kho» khớp dạng tên kho)
  «Kho chờ nhận: chưa có kho tiêu thụ nào» → IM
  «Kho chờ nhận: không có kho nào»       → IM
  «Kho chờ nhận: none»                   → IM
  «Kho chờ nhận: chưa có»                → ĐỎ (chỉ khớp vì trùng nguyên văn danh sách)

Tức cách viết TỰ NHIÊN NHẤT để khai «chưa kho nào nhận» lại đi qua răng, trong khi luật mà răng này canh là «mốc chỉ cắt khi CÓ kho chờ nhận». Thêm một chữ vào cuối dòng placeholder là thoát: «chưa có — sẽ điền sau» cũng IM.

Giới hạn đã khai trong hợp đồng («răng không kiểm tên kho có tồn tại — kit không chứa danh mục kho») KHÔNG phủ ca này: đây không phải chuyện tên kho có thật hay không, mà là dòng đọc ra NGHĨA PHỦ ĐỊNH vẫn được đếm là một tên kho. Lớp lỗi đã có tên trong sổ: «Blacklist trên không gian mở» / «đảo chiều mặc định». Lối ra cùng lớp: bắt CẢ DÒNG khớp một dạng đóng (ví dụ danh sách token, mỗi token phải khớp trọn `^[a-z0-9][a-z0-9._-]+$` và không token nào là chữ Việt), thay vì `.some()` trên các mảnh.

Vì sao trong hợp đồng: AC-3 đòi dòng mang «giá trị bác» phải đỏ; finding chứng minh nhiều cách viết phủ định tự nhiên (không nằm trong đúng 6 chuỗi liệt kê) vẫn được coi là tên kho hợp lệ, tức vế «giá trị bác → đỏ» của AC-3 thất bại. Đây không phải giới hạn «kiểm tên kho có tồn tại» đã khai ở Out of scope.

### Hình dạng 4 (assertion âm-tính-một-mình / hằng-đúng): chiều «hạt giống mồ côi IM» của VC8 vẫn là tautology sau bản vá r3
- file: `tests/plugins/vao-co-o.test.mjs:383`
- severity: high
- source: measurement
- AC: AC-2

Bản vá 58ba3177 tuyên đã dựng lại chiều đặc hiệu «trên CÂY THẬT» (comment dòng 372-375), nhưng assertion mới vẫn không thể đỏ được.

`moCoi` được định nghĩa là các slug hạt giống mà `!existsSync(path.join(accDir, sl))` — tức KHÔNG có thư mục dưới `_acceptance/`. `neoErrs(accDir, ...)` lại chỉ sinh lỗi bằng cách `for (const slug of readdirSync(accDir))` và push `${slug}: …`. Hai tập hợp rời nhau theo định nghĩa, nên `neu = neoErrs(...).filter(e => moCoi.some(sl => e.startsWith(sl + ':')))` LUÔN rỗng. Đo thật trên cây hiện tại: moCoi = [1c-doi-hanh-vi-cong-nguoi, bai-hoc-tuan-do-luong, go-lop-chung-minh-chu-ky, vlm-assert-phai-khai-la-nhan-nuoi, khop-vong-dac-ta-ux, do-loi-hua-van-xuoi]; giao với entries của `_acceptance/` = [].

Failure scenario: cắm lại luật cũ «mọi hạt giống phải có ô» vào bất kỳ bên đọc nào (kể cả vào chính `neoErrs` dưới dạng một vòng quét `docs/plans`) — nhánh `neu.length` không bao giờ chạy tới, VC8 vẫn XANH và vẫn in «hạt giống mồ côi im (đo trên cây thật)». Nhánh duy nhất còn sống là `if (!moCoi.length)`, tức nó chỉ canh việc cây thật còn ≥1 hạt giống mồ côi, không canh hành vi của phép đo.

Đây đúng lớp lỗi mà review-findings.md mục «Chân hạt giống mồ côi IM của VC8 là assertion rỗng» đã bắt ở lượt chấm 3b — bản vá đổi cơ chế (fixture → cây thật) nhưng giữ nguyên khuyết tật. Ngoài ra dòng 371 `W(r, 'docs/plans/2026-01-01-hat-giong-mo-coi.md', …)` là tàn dư của bản cũ: tệp vẫn được ghi vào fixture và vẫn không bên đọc nào chạm tới.

Hệ quả lên lời khai: dòng PASS của VC8, E2 («(im 1) hạt giống mồ côi → im — chiều này đo trên CÂY THẬT (6 hạt giống mồ côi có thật, không tên nào bị gọi)») và AC-2 đều tuyên một chiều chưa từng được chứng minh.

Vì sao trong hợp đồng: Cùng vế của AC-2 như hai finding trên; finding lặp lại phép đo thực nghiệm cho thấy tập hợp so sánh luôn rỗng, nên AC-2 chưa có chiều đỏ cho vế hạt giống mồ côi.

### Hình dạng 1 (đo CHỈ DẪN/thứ khác thay vì ĐẦU RA) + hình dạng 4: E4 tuyên về decisions.jsonl nhưng cmd `neo_vc8` không đọc sổ quyết định
- file: `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml:49`
- severity: high
- source: measurement
- AC: AC-4

E4 khai `cmd: config:executors.script.neo_vc8` = `VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs … grep -qF "PASS: [VC8]"` (config.yaml:376), còn `expected` đòi hai vế:
(a) «VC8 chạy trên ROOT (cây thật) không nêu slug nào thiếu Gốc» — vế này VC8 có đo;
(b) «sổ quyết định của vòng có một dòng «rà tồn kho» nêu hai số: ô thêm Gốc · ô về archived» — VC8 KHÔNG có một dòng mã nào đọc `decisions.jsonl` (grep toàn tệp: 0 tham chiếu). Không eval nào khác trong evals.yaml chạm tệp đó.

AC-4 còn đòi thêm «0 mốc chưa ký thiếu Kho chờ nhận» — vế đó nằm ở VC9/E3, không nằm trong `neo_vc8`, nên E4 cũng không đo được nó.

Failure scenario: xoá hẳn dòng `rà tồn kho` khỏi `_acceptance/o-chi-mo-khi-co-neo-ngoai/decisions.jsonl` (hoặc sửa hai con số 17/6 thành số bịa) — `neo_vc8` vẫn exit 0, vẫn in `PASS: [VC8]`, E4 vẫn PASS. Evidence-report dòng 60-67 xác nhận chính điều đó: output của E4 chỉ là dòng PASS của VC8, không có mẩu bằng chứng nào về sổ.

Tức phần (b) của AC-4 là mệnh đề không có phép đo: nó được chấm PASS bằng đầu ra của một phép đo nói về chuyện khác.

Vì sao trong hợp đồng: AC-4 đòi cả «0 ô discovery thiếu Gốc và 0 mốc chưa ký thiếu Kho chờ nhận» lẫn «số ô Gốc/archived in trong sổ quyết định»; finding chứng minh eval E4 gán cho AC-4 không đọc sổ quyết định và không phủ vế mốc chưa ký, nên AC-4 chưa được đo đủ.

### Hình dạng 3 (assert «chuỗi/token có mặt» thay cho QUAN HỆ được hứa): cửa «giá trị bác» của VC9 xanh trước mọi lời từ chối dài hơn hai chữ
- file: `tests/plugins/vao-co-o.test.mjs:133`
- severity: medium
- source: measurement
- AC: AC-3

AC-3 hứa một quan hệ: mốc chưa ký phải khai «≥1 kho tiêu thụ đang chờ bản mới», và phải đỏ khi dòng mang giá trị bác («chưa có», «không», «—», «…»). `khoErrs` hiện thực nó bằng `!BAC_KHO.has(val) && val.split(/[,\s·]+/).filter(Boolean).some(k => /^[a-z0-9][a-z0-9._-]+$/.test(k))` — tức «có TOKEN nào đó trong dòng trông giống slug ascii», chứ không phải «dòng này nêu một kho».

`BAC_KHO` chỉ khớp NGUYÊN VĂN cả giá trị, nên chỉ chặn được đúng 6 chuỗi. Bất kỳ lời từ chối nào dài hơn đều lọt, vì chính chữ `kho` (không dấu, 3 ký tự ascii) khớp `^[a-z0-9][a-z0-9._-]+$`. Chạy thẳng vị từ này:
  'media-library'                 -> IM (đúng)
  'chưa có'                       -> ĐỎ (đúng)
  'chưa có kho tiêu thụ nào'      -> IM  ← fail-open
  '— chưa có kho nào, sẽ bổ sung sau' -> IM  ← fail-open
  'không có kho nào cho bản này'  -> IM  ← fail-open

Failure scenario: một mốc `release-2-17-0` ở `status: draft` ghi `Kho chờ nhận: chưa có kho tiêu thụ nào` — VC9 im, cây thật «0 mốc chưa ký thiếu Kho chờ nhận», mốc được cắt đúng thứ luật 18/09 sinh ra để chặn. Ma trận fixture của VC9 (dòng 452-456) chỉ có một ca bác duy nhất, đúng dạng nguyên-văn-một-cụm, nên không phân biệt được «cửa đang canh quan hệ» với «cửa đang đếm token ascii».

Vì sao trong hợp đồng: Cùng vế «giá trị bác → đỏ» của AC-3 như finding trên; finding chứng minh cửa chỉ khớp nguyên văn 6 chuỗi đóng, để lọt mọi câu từ chối tự nhiên dài hơn — quan hệ AC-3 hứa (đang canh) chưa được thực thi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Luật (b) đổi mẫu số nhưng bộ đếm vòng meta vẫn neo vào mốc CẮT SỐ (r3)**
  Người dùng thấy gì: Con số vòng công việc phụ hiển thị trên thẻ có thể sai ngay sau khi đổi số phiên bản, dù chưa có kho nào thực sự nhận bản phát hành mới — dễ khiến người đọc thẻ hiểu nhầm giới hạn đã được nới ra sớm hơn thực tế.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **Neo trỏ hồ sơ NGAY TRONG KHO NÀY cũng không được kiểm tồn tại (r3)**
  Người dùng thấy gì: Một dòng khai 'nguồn gốc' trỏ tới hồ sơ không tồn tại vẫn được chấp nhận mà không báo lỗi, kể cả khi hồ sơ đó lẽ ra kiểm tra được ngay trong cùng dự án.
  file: `skills/acceptance/references/opportunity-template.md`
  severity: medium
  Đề xuất: known-limits

- **Răng VC9 không có chân «bên VIẾT dặn điền» — lời dặn `Kho chờ nhận:` không được phép đo nào ghim (r3)**
  Người dùng thấy gì: Người viết hồ sơ phát hành mới có thể không biết cần điền dòng khai 'kho chờ nhận' vì không tài liệu hướng dẫn nào nhắc tới yêu cầu này, và chỉ phát hiện ra khi bị từ chối.
  file: `skills/acceptance/references/contract-template.md`
  severity: medium
  Đề xuất: known-limits

- **PR kéo hai hồ sơ vòng khác vào diff → pre-merge chặn merge (2 VIOLATION stale) (r2)**
  Người dùng thấy gì: PR này kéo theo hai hồ sơ của vòng khác không liên quan, có thể khiến việc gộp mã bị chặn lại giữa chừng vì hệ thống kiểm tra tưởng nhầm hai hồ sơ đó đã lỗi thời.
  file: `_acceptance/release-2-0-0/contract.md`
  severity: high
  Đề xuất: known-limits

- **Khuôn hợp đồng giao cho repo tiêu thụ nhận thêm dòng chỉ dành cho mốc phát hành của kit (r1)**
  Người dùng thấy gì: Mỗi hợp đồng mới tạo cho một tính năng bất kỳ đều có thêm một dòng ghi chú chỉ dành riêng cho các đợt phát hành của kit, dù tính năng đó không phải là một đợt phát hành.
  file: `skills/acceptance/references/contract-template.md`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ ĐÃ KÝ vao-co-o-ra-co-ten còn ghim VC8 theo nghĩa đã bị đảo, re-check vẫn xanh (r1)**
  Người dùng thấy gì: Một hồ sơ đã được duyệt trước đó vẫn hiển thị đạt trong các lần kiểm tra lại sau này, dù tiêu chí thật sự đứng sau kết quả đó đã bị thay đổi.
  file: `_acceptance/vao-co-o-ra-co-ten/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
