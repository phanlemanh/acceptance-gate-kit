## Trong hợp đồng

- **AC-3 và AC-6 vẫn tuyên phần phạm vi đã cắt — hợp đồng lệch khỏi vật giao**
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md:32`
  severity: high
  AC: AC-3
  AC-3 (dòng 32) đòi SKILL có chỉ dẫn «evals khai `states:`» — mệnh đề đó đã bị cắt ở round 4; SKILL.md ở HEAD không còn nhắc `states:` và eval E3 (expected) cũng không đo nó, nên AC-3 xanh mà một vế của nó chưa bao giờ được kiểm. AC-6 (dòng 35) đòi «MỌI cánh (W8a/W8b/W8c/parse) có cặp hai-chiều» — bốn cánh này không còn tồn tại, nên AC-6 là điều kiện rỗng, trong khi E6 (bộ đo duy nhất của AC-6) chỉ hỏi về UX1/UX3/UX4. Chính scope-triage round 5 đã nêu đích danh «AC-3 còn tuyên mệnh đề `states:` đã bị cắt ở round 4» và ở HEAD vẫn chưa sửa. Hợp đồng là ý-định-chốt-trước (nguyên tố 1): khi phạm vi bị thu, tiêu chí phải viết lại theo vật thật, nếu không màu xanh của S4 không phủ được điều hợp đồng nói.

- **Chiều đỏ tautology bị hội đồng FAIL vẫn còn nguyên; eval đo nó (E9) bị xoá thay vì sửa, và không có dòng «song» trong sổ hạn chế**
  file: `tests/plugins/ux-spec.test.mjs:92`
  severity: medium
  AC: AC-6
  Round 5 hội đồng FAIL E9 với hai dẫn chứng cụ thể: UX3c — `checks.c = t => /vẽ TỪ section Đặc tả UX/.test(t)` (dòng 92) và `mutC = s.replace('vẽ TỪ section Đặc tả UX', 'vẽ theo cảm nhận')` (dòng 108), assert ở dòng 119 — mutation và assertion thao tác trên đúng một chuỗi, phép kiểm chỉ chứng minh `.replace()` chạy; UX1-đỏ2 — dòng 61-66 cắt đúng chuỗi HEAD6 ra khỏi văn bản rồi kiểm HEAD6 vắng mặt bằng chính `.includes()`. Cả hai còn nguyên ở HEAD (đã đọc file, chạy suite: 25/25 PASS). Cách xử lý ở hai commit cuối là XOÁ E9 (bộ đo) chứ không sửa vật — đúng lớp lỗi «hạ thước cho vừa vật» mà repo đã đặt tên; và `docs/research/known-limits-ledger.tsv` không có entry `song` nào cho nó (chỉ #12 cho cánh W8 bị cắt), trong khi E6 hiện vẫn đứng đó hỏi «chiều đỏ nào là tautology?» trên chính UX1/UX3. Hoặc sửa hai chiều đỏ đi qua một bộ đọc độc lập với thao tác mutate (như `checks.d` đã làm: quét ngữ cảnh ±400 ký tự), hoặc mở một dòng `song` trong sổ hạn chế — không được để nó biến mất cùng với eval.

- **AC-3 đòi SKILL dạy evals khai `states:` — mệnh đề đã cắt, không có trong vật, không eval nào đo**
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md:32`
  severity: medium
  AC: AC-3
  AC-3 tuyên: "...contract ghi `design_doc:`, evals khai `states:`...". `grep -n "states:" feature-loop/skills/feature-loop/SKILL.md` không trả về dòng nào — SKILL.md không hề dạy điều đó. Bộ kiểm của E3 (tests/plugins/ux-spec.test.mjs, `checks` a/a2/b/c/d) cũng không có mệnh đề nào cho `states:`. Nên AC-3 là một tiêu chí KHÔNG được vật thoả và KHÔNG được phép đo nào bắt: E3 vẫn xanh trong khi AC-3 sai. Chính report vòng 5 đã nêu đúng lỗi này (_acceptance/dac-ta-ux-vat-hoa-cau-truc/evidence-report.md:146 — "AC-3 còn tuyên mệnh đề `states:` đã bị cắt ở round 4") và nó chưa được sửa. Kịch bản fail: người ký Cổng 2 đọc AC-3 XANH và tin rằng evals đã có dây `states:` — quyết định trên một câu không đúng sự thật. Sửa: gỡ mệnh đề `states:` khỏi AC-3, đúng theo phạm vi đã thu 24/08.

- **Contract trỏ tới AC-10/AC-11 không tồn tại và AC-6 đo cánh W8 đã cắt**
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md:53`
  severity: low
  AC: AC-6
  Hợp đồng chỉ có AC-1…AC-6, nhưng: dòng 42 (## Coverage) viết "Ô Core → AC-1…AC-11"; dòng 53 (## Đường đo) viết "Thước: feature không chạm UI 0 cờ · ... · bảo đảm bởi: AC-10" — AC-10 không tồn tại, nên thước đó KHÔNG có AC nào bảo đảm; dòng 35 (AC-6) đòi "MỌI cánh (W8a/W8b/W8c/parse) có cặp hai-chiều" trong khi bốn cánh đó đã bị cắt trọn và không case nào tồn tại — E6 (judgment) lại hỏi về UX1/UX3/UX4, tức eval và criterion đo hai thứ khác nhau. Ngoài ra Out of scope còn giữ câu "đường đọc-cũ W8 im lặng khi không opt-in" cho một cánh không còn. Hệ quả: bảng ngưỡng tại Cổng Giá trị đọc con trỏ chết, người ký không truy được thước về AC nào.

- **Tuyên quét LỚP nhưng chỉ có điểm-case — AC-6 tuyên «MỌI cánh (W8a/W8b/W8c/parse)» trong khi lớp đó rỗng và E6 chỉ hỏi 3 ca**
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml:88`
  severity: high
  AC: AC-6
  AC-6 (contract.md:35) hứa một LỚP: «MỌI cánh (W8a/W8b/W8c/parse) có cặp hai-chiều trên CÙNG fixture code-sinh + thông điệp ghim». Không cánh nào trong bốn cánh đó còn tồn tại: `grep -n "W8" scripts/eval-coverage-lint.js` chỉ trả về comment của W5, và `grep -n "W8" tests/scripts/run-tests.sh` trả về rỗng (9 case W8 của commit 97d26a4f đã bị cắt ở fdb67d1c). E6 — eval DUY NHẤT map vào AC-6 — không đo lớp đã tuyên mà đổi sang một câu hỏi judgment trên ba điểm-case rời (UX1, UX3, UX4). Kết quả: số assert = 0 trên tập được tuyên, và AC-6 XANH vĩnh viễn bất kể bộ ca có hình dạng gì, vì judge được hỏi về một tập khác hẳn tập mà criterion đặt tên. Ma trận toàn phần viết-trước (mỗi cánh một ô) không có, và cũng không thể có — tập rỗng.

- **Tuyên quét LỚP nhưng chỉ có điểm-case — mệnh đề «evals khai `states:`» của AC-3 không có assert nào và không có trong vật**
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml:36`
  severity: medium
  AC: AC-3
  AC-3 (contract.md:32) liệt kê danh sách mệnh đề mà S1 phải có, trong đó có «contract ghi `design_doc:`, evals khai `states:`». E3 — eval duy nhất của AC-3 — chỉ liệt kê (a)(a2)(b)(c)(d), không có vế `states:`, và `checks` trong tests/plugins/ux-spec.test.mjs:77-101 cũng chỉ có đúng năm phép kiểm đó. `grep -c "states:" feature-loop/skills/feature-loop/SKILL.md` = 0, nghĩa là mệnh đề này KHÔNG có trong vật mà AC-3 vẫn xanh. Danh sách mệnh đề của criterion và danh sách assert không khớp phần tử, nên phần thiếu đi qua cổng không ai thấy. (Cùng dây: contract.md:42 «Ô Core → AC-1…AC-11» và contract.md:53 «bảo đảm bởi: AC-10» trỏ vào AC-10/AC-11 không tồn tại — contract chỉ có AC-1..AC-6.)

## Chưa adversarial-verify (refuter chết)

(không có mục nào)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Khuôn ux-spec-template.md hứa một phép đo (cánh W8) không tồn tại trong engine**
  Người dùng thấy gì: Tài liệu hướng dẫn đang nói rằng có một bước kiểm tự động canh chừng mẫu này, nhưng bước đó không tồn tại — nếu ai đó xoá hay bỏ trống phần hướng dẫn, sẽ không có gì báo động, trong khi tài liệu khiến người đọc tin là có.
  file: `skills/acceptance/references/ux-spec-template.md:6`
  severity: high
  Đề xuất: known-limits

- **Con trỏ chết trong contract/evals: AC-10, AC-11, E7–E9, «đầu ra lint» đều không tồn tại**
  Người dùng thấy gì: Hồ sơ quyết định có vài chỗ trỏ tới tiêu chí và số đo không tồn tại, khiến người đọc hồ sơ khó lần ra bằng chứng thật khi xem lại.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md:53`
  severity: medium
  Đề xuất: known-limits

- **evidence-report.md ở HEAD là bản REJECT cũ, lệch commit và lệch bộ eval**
  Người dùng thấy gì: Báo cáo bằng chứng hiện tại đang mô tả một phiên bản cũ, khác với những gì đang được giao — người xem báo cáo để quyết định có thể đọc nhầm nội dung không còn đúng nữa.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evidence-report.md:1`
  severity: medium
  Đề xuất: known-limits

- **Hai fixture W5 có sẵn bị gỡ `ui` khỏi surfaces — vết thừa của phạm vi đã cắt**
  Người dùng thấy gì: Hai bộ dữ liệu thử việc vẫn còn dùng được bị chỉnh sửa không cần thiết, làm giảm độ giống thực tế của chúng cho các lần kiểm sau — không ảnh hưởng tới người dùng cuối.
  file: `tests/scripts/run-tests.sh:719`
  severity: low
  Đề xuất: known-limits

- **scripts/eval-coverage-lint.js bị chạm chỉ để thêm hai dòng trắng**
  Người dùng thấy gì: Một phần máy đo bị chạm nhẹ không cần thiết (chỉ thêm khoảng trắng), khiến người xem thay đổi tưởng nhầm là có sửa logic — không ảnh hưởng hành vi thật.
  file: `scripts/eval-coverage-lint.js:156`
  severity: low
  Đề xuất: known-limits

- **Khuôn ux-spec-template.md hứa cánh lint W8 đã bị cắt — lưới an toàn giả cho consumer**
  Người dùng thấy gì: Tài liệu hướng dẫn nhắc tới một lưới an toàn máy đã bị gỡ bỏ khỏi hệ thống — người dùng tài liệu có thể yên tâm sai rằng có máy đang canh, dẫn tới bỏ sót lỗi mà không ai phát hiện.
  file: `skills/acceptance/references/ux-spec-template.md:6`
  severity: high
  Đề xuất: known-limits

- **UX_CASES id không tồn tại → chạy 0 assertion, exit 0 (xanh im lặng)**
  Người dùng thấy gì: Có một cách chạy thử từng ca bằng tên gọi — nếu gõ sai tên, việc kiểm tra âm thầm không chạy gì cả nhưng vẫn báo kết quả 'qua', dễ khiến người kiểm tin nhầm là đã kiểm trong khi thực chất chưa kiểm gì.
  file: `tests/plugins/ux-spec.test.mjs:21`
  severity: high
  Đề xuất: known-limits

- **known-limits-ledger: 5 hàng đánh dấu «chet» bởi cánh W8 không còn tồn tại**
  Người dùng thấy gì: Sổ ghi nhận các giới hạn đã biết đang đánh dấu một số mục là 'đã đóng' nhưng vấn đề nền của chúng chưa được giải quyết ở nơi khác — người đọc sổ sau này có thể tin nhầm rằng rủi ro đó đã hết.
  file: `docs/research/known-limits-ledger.tsv:172`
  severity: medium
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì ĐẦU RA — kế hoạch đo và khuôn được đo đều trỏ vào cánh lint W8 đã bị gỡ khỏi cây**
  Người dùng thấy gì: Kế hoạch đo và tài liệu hướng dẫn đều nhắc tới một bước kiểm tự động đã không còn tồn tại trong hệ thống — người đọc có thể tin nhầm có máy đang canh trong khi thực chất chỉ có người soi bằng mắt.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml:4`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case — comment đầu evals.yaml chứng AC-11 bằng E6–E9 không tồn tại**
  Người dùng thấy gì: Ghi chú trong kế hoạch đo trỏ tới các tiêu chí và phép thử không tồn tại, làm kế hoạch trông đầy đủ hơn thực tế và gây khó khăn khi người sau muốn kiểm lại độ phủ thật.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml:7`
  severity: medium
  Đề xuất: known-limits

- **Assert chuỗi có mặt trong khi lời hứa là QUAN HỆ — checks.b/checks.c grep toàn file dù E3 tuyên «không assert chuỗi rời trên toàn file»**
  Người dùng thấy gì: Một phép kiểm tự động dò nội dung ở bất kỳ đâu trong toàn tài liệu thay vì đúng chỗ nó phải xuất hiện — nếu nội dung bị dời sang chỗ sai, phép kiểm vẫn báo qua dù cấu trúc tài liệu đã lệch vị trí.
  file: `tests/plugins/ux-spec.test.mjs:91`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 12/17 lỗi rơi vào file không bộ đo nào phủ (_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md, _acceptance/dac-ta-ux-vat-hoa-cau-truc/evidence-report.md, tests/scripts/run-tests.sh, scripts/eval-coverage-lint.js, docs/research/known-limits-ledger.tsv, _acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
