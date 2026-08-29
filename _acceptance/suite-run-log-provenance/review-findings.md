## Trong hợp đồng

### Assertion âm-tính-một-mình: chiều đỏ của thẻ Cổng 2 kết luận từ VẮNG MẶT chuỗi — thẻ sập cũng cho PASS
- file: `_acceptance/suite-run-log-provenance/rang.sh:291`
- severity: high
- AC: AC-7

Trong `tiem_bo_doc`, nhánh thẻ (bd3/bd4) chạy `printf '%s' "$out" | grep -qF "CHƯA đủ trường" || thay=0` với `thay` khởi tạo 1. `$out` là stdout của `node scripts/gate-card.js` chạy trong bản sao ĐÃ TIÊM. Khi gate-card.js không chạy được (lỗi cú pháp, thiếu file, exit≠0) thì `$out` rỗng, grep trượt, `thay=0` và răng ghim `PASS: chieu do [gate-card.js/...]: go nhanh -> sai chu lo ra`. Nghĩa là chân này không phân biệt được «gỡ đúng nhánh nên cờ biến mất» với «thẻ chưa bao giờ chạy» — đúng hình dạng assertion âm-tính-một-mình mà CLAUDE.md cấm. Không có đối chứng dương TRÊN BẢN TIÊM (đối chứng dương duy nhất ở vòng `for fx` chạy trên $ROOT, cây lành, không phải bản sao). ĐO ĐƯỢC: thay biểu thức tiêm của bd3 bằng `s/^const fs = require/const fs = requireBROKEN/` — một thay đổi KHÔNG chạm nhánh LOP-DOC nào, chỉ làm gate-card.js sập — răng vẫn in `PASS: chieu do [gate-card.js/fx-nohead]: go nhanh -> sai chu lo ra` và `Results: chan bo-doc passed`. Nhánh trang bằng chứng (bd1/bd2) KHÔNG mắc lỗi này vì nó đòi chuỗi PHẢI CÓ MẶT (`grep -qF "$ma" && thay=0`), nên sập là đỏ. Sửa theo lớp: bản tiêm phải chứng minh thẻ vẫn chạy được (vd đòi thẻ vẫn in một mốc bất biến khác, hoặc kiểm exit code của node) trước khi tin «mất cờ» là bằng chứng.

**Vì sao thuộc AC-7:** AC-7 đòi mỗi lớp đóng khối có một ca cô lập chứng minh 'gỡ đúng lớp đó thì phép đo phải đỏ'; ca cho lớp thẻ Cổng 2 kết luận từ sự vắng mặt của một chuỗi nên không phân biệt được 'gỡ đúng lớp' với 'thẻ sập hoàn toàn', tức ca cô lập đó không thật sự tồn tại như AC-7 yêu cầu.

### Tuyên quét lớp nhưng thiếu ô: bất biến «đổi thứ tự khai không đổi mã» (AC-2) chỉ đo trên bộ lệnh KHÔNG va chạm — nhánh hậu tố hoàn toàn không có thước
- file: `tests/workflows/acceptance-verify.test.mjs:1837`
- severity: high
- AC: AC-2

W34 dùng `const BO = ['npm run build', 'pnpm itest:ci', 'bash tests/hooks/run-tests.sh']` — ba lệnh cho ba tên KHÁC nhau, nên `demTenSuite[t]` luôn = 1, `tenDuyNhat` trả tên trần và `bamSuite()` KHÔNG BAO GIỜ được gọi. Nhưng chính chỗ mà comment của bản vá cảnh báo về thứ tự lại nằm trong nhánh hậu tố: «Hậu tố băm suy từ CHÍNH chuỗi lệnh (không phải chỉ số mảng) nên đổi thứ tự khai suiteCommands không đổi mã» và «Đếm TRƯỚC rồi mới gắn hậu tố cho MỌI thành viên của nhóm trùng (không phải "ai tới sau thì gắn")» (feature-loop/workflows/acceptance-verify.js, khối `bamSuite` / `demRidSuite`). Mệnh đề đó không có ca nào đo. ĐO ĐƯỢC: thay thân `bamSuite` bằng `const bamSuite = (s) => 'i' + machine.findIndex(x => x.cmd === s)` — tức làm hậu tố phụ thuộc THỨ TỰ khai `suiteCommands`, đúng cái AC-2 cấm — kết quả `Results: 384 passed, 0 failed`. W28 không đỏ (nó chỉ đòi hai mã KHÁC nhau, vẫn đúng), W34 không đỏ (không có cặp va chạm), W35 không đỏ, và chân răng `thu-tu` cũng xanh vì bản tiêm của nó (rang.sh:167) gỡ hẳn `tenDuyNhat` chứ không chạm `bamSuite`. Ô còn thiếu: chạy W34 thêm một lần với bộ lệnh CÓ va chạm (vd `['cd apps/web && pnpm build', 'cd apps/api && pnpm build']`) rồi so map cmd→run_id giữa hai thứ tự.

**Vì sao thuộc AC-2:** AC-2 cấm mã hậu tố phụ thuộc thứ tự khai (không chứa chỉ số mảng) đúng ở nhánh xử lý tên trùng; không có lệnh nào trong lưới thường trực từng chạm nhánh đó, nên vi phạm đúng điều AC-2 cấm sẽ trôi qua mà không bị phát hiện.

### Assert quan hệ bị hạ thành «hai giá trị khác nhau»: ô va-chạm-40-ký-tự (W28c) xanh cả khi va chạm không còn tồn tại
- file: `tests/workflows/acceptance-verify.test.mjs:1688`
- severity: medium
- AC: AC-3

Biến thể c của W28 (`'bash tests/integration/regression/run-tests-alpha.sh'` vs `...-beta.sh`) tồn tại để đo lời hứa QUAN HỆ: «hai lệnh rút về CÙNG một tên gốc thì phải nhận hai mã». Nhưng cả hai assert của nó — `idA !== idB` và `tenA !== tenB` — chỉ đo tính KHÁC NHAU, không đo tiền đề là hai lệnh có thật sự đụng tên gốc hay không. Ca này vì thế xanh luôn cả khi nhánh cắt 40 ký tự (thứ tạo ra va chạm) biến mất. ĐO ĐƯỢC: nới `.slice(0, 40)` trong `tenSuite` thành `.slice(0, 400)` — hai lệnh khi đó ra hai tên khác nhau ngay từ đầu, chưa bao giờ chạm nhánh chống va chạm — suite vẫn `384 passed, 0 failed`, và chân răng `va-cham-ten` vẫn ghim đủ ba dòng PASS. Thiếu bước khẳng định `tenSuite(a) === tenSuite(b)` (hoặc một chứng cứ tương đương rằng nhóm trùng có ≥2 thành viên) trước khi kết luận hậu tố đã làm việc.

**Vì sao thuộc AC-3:** AC-3 liệt kê rõ ba hình dạng va chạm (a)(b)(c) và đòi «phải cùng đạt, không được đóng một ô rồi tuyên cả lớp»; ca cho hình (c) chỉ kiểm tra hai giá trị khác nhau mà không xác nhận tiền đề là có va chạm thật, nên hình (c) chưa thật sự đạt như AC-3 yêu cầu.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Report leaves «Known limits» + «Ngoài hợp đồng» empty → workspace merges with NO Gate-2 signature**
  Người dùng thấy gì: Khi hai mục ghi giới hạn đã biết và việc ngoài phạm vi bị để trống trong báo cáo, hệ thống tự động cho việc gộp trôi qua mà không mời người ký duyệt — dù dữ liệu về giới hạn và ngoài phạm vi thực ra đã có sẵn ở nơi khác trong cùng hồ sơ.
  file: `_acceptance/suite-run-log-provenance/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Evidence is stale: AC-7/E8 never verified, yet the Gate-2 card announces «7/7 · bằng chứng máy đầy đủ»**
  Người dùng thấy gì: Thẻ trình ký báo rằng bằng chứng máy đã đầy đủ, nhưng phần kiểm tra cho đúng thay đổi vừa thêm gần đây chưa từng được chạy lại sau khi mã nguồn tiếp tục đổi — người ký có thể ký trên bằng chứng đã lỗi thời.
  file: `_acceptance/suite-run-log-provenance/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **rang.sh --chan bo-doc: positive control is absence-only and passes when evidence-page.js never runs**
  Người dùng thấy gì: Phép kiểm chống rò rỉ mã sang trang bằng chứng có thể báo đạt ngay cả khi trang bằng chứng đó chưa từng được tạo ra thành công — nên một lỗi thật ở khâu này có nguy cơ không bị phát hiện.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **rang.sh --chan bo-doc writes fixture workspaces into the live _acceptance/ tree, cleaned up only on the happy path**
  Người dùng thấy gì: Khi lượt kiểm tra bị ngắt giữa chừng, nó có thể để lại hai bộ hồ sơ tính năng giả ngay trong kho thật, khiến các công cụ khác đếm nhầm chúng là tính năng thật đang chờ xử lý.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Template still says the run-log gets one line per eval only**
  Người dùng thấy gì: Tài liệu hướng dẫn viết báo cáo vẫn mô tả sổ chạy chỉ ghi một dòng cho mỗi tiêu chí, dù nay còn có thêm dòng cho lệnh chạy chung — người đọc tài liệu này để hiểu cách đọc sổ chạy sẽ bị hiểu sai.
  file: `skills/acceptance/references/evidence-report-template.md`
  severity: low
  Đề xuất: known-limits

- **AC-7/E8 never ran: PASS evidence report omits the eval covering the two changed readers**
  Người dùng thấy gì: Báo cáo được đánh dấu ĐẠT toàn phần, nhưng phần kiểm tra đúng hai nơi hiển thị bằng chứng vừa được sửa lại không có mặt trong báo cáo — người ký nhìn thấy 'đạt' trong khi phần quan trọng nhất của lượt sửa này chưa được xác minh lại.
  file: `_acceptance/suite-run-log-provenance/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Positive control for the evidence-page reader fails open when the script produces nothing**
  Người dùng thấy gì: Phép kiểm chống rò rỉ mã sang trang bằng chứng có thể báo đạt ngay cả khi trang đó chưa từng được tạo ra thành công — nên một lỗi thật ở khâu này có nguy cơ không bị phát hiện.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **bo-doc chân writes fixture workspaces into the real repo with no trap to clean them up**
  Người dùng thấy gì: Khi lượt kiểm tra bị ngắt giữa chừng, nó có thể để lại hai bộ hồ sơ tính năng giả ngay trong kho thật, khiến các công cụ khác đếm nhầm chúng là tính năng thật đang chờ xử lý.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Ma trận tên (W30): assert đếm ô là hằng tự-so-mình, và trục ô không phủ tập nhánh của `tenSuite`**
  Người dùng thấy gì: Bảng đối chiếu các dạng câu lệnh tự so một con số với chính nó thay vì so với danh sách dạng câu lệnh thật cần phủ, và bỏ sót một số dạng thật — nên một dạng câu lệnh có thể không được kiểm tra mà không ai nhận ra.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assert chết trên thẻ Cổng 2: `nothas GCS1b` soi một chuỗi mà gate-card.js không bao giờ in**
  Người dùng thấy gì: Một phép kiểm trên thẻ trình ký không bao giờ có thể báo lỗi dù có chuyện gì xảy ra, vì nó dò tìm một thứ mà thẻ chưa từng hiển thị — tạo cảm giác thẻ được kiểm hai lớp trong khi thực ra chỉ có một.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/13 lỗi rơi vào file không bộ đo nào phủ (_acceptance/suite-run-log-provenance/evidence-report.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.