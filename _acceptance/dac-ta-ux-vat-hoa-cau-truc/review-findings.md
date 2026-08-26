# Review Findings: dac-ta-ux-vat-hoa-cau-truc — Round 7

## Trong hợp đồng

### 1. Chiều đỏ UX1-đỏ2 là tautology — mutation xoá đúng chuỗi mà assertion đi tìm
- file: `tests/plugins/ux-spec.test.mjs:64`
- severity: medium
- AC: AC-6

`const HEAD6 = '### 6. Khuôn IA đã chọn + căn cứ'` (dòng 61) chính là `'### ' + HEADINGS[5]`. Mutant ở dòng 64 là `uxSection(t.replace(HEAD6, '### 6. Ghi chú thêm'))`, còn assertion ở dòng 65 là `!hasHeading(secRenamed, HEADINGS[5])` với `hasHeading = (s, h) => s.includes('### ' + h)`. Tức là: thay chuỗi S rồi khẳng định S vắng mặt — mutation và assertion là cùng một thao tác trên cùng một chuỗi, phép kiểm chỉ chứng minh `.replace()` chạy được, không phân biệt được «bộ kiểm tiêu đề hoạt động» với «bộ kiểm tiêu đề chưa bao giờ nhìn mục 6». Hai assertion kèm theo (mục 1 và mục 4 vẫn xanh) không bị mutant chạm nên không cứu được. `docs/research/known-limits-ledger.tsv` hàng `dac-ta-ux-vat-hoa-cau-truc#19` khai lớp này đã `chet` («nay mutant khác thao tác với phép kiểm») — lời khai đó không đúng với vật ở HEAD. Mẫu đúng đã có sẵn ngay trong file: `checks.d` (dòng 96-103) quét ngữ cảnh ±400 ký tự nên bộ đọc độc lập với thao tác mutate.

AC-6 cấm rõ ràng "chiều đỏ tautology"; mutant và assertion ở đây thao tác trên cùng một chuỗi nên không phân biệt được bộ kiểm hoạt động với bộ kiểm chưa từng nhìn mục tiêu — đúng dạng bị cấm.

### 2. expected của E3 tuyên «không assert chuỗi rời trên toàn file» nhưng checks.b đúng là assert chuỗi rời trên toàn file
- file: `tests/plugins/ux-spec.test.mjs:91`
- severity: medium
- AC: AC-6

`evals.yaml` E3 (dòng 30-56) tuyên: «Mỗi mệnh đề là một PHÉP KIỂM chạy trên MỘT chuỗi ... nên chiều đỏ đi qua đúng bộ kiểm của chiều xanh — không assert chuỗi rời trên toàn file». Nhưng `checks.b = t => /design_doc: <path/.test(t) && /GIỮ NGUYÊN các marker/.test(t)` không cắt vùng nào cả — nó dò hai chuỗi ở bất kỳ đâu trong SKILL.md, khác hẳn `checks.a`/`checks.a2` (cắt bước 4) và `checks.c` (cắt bước [3]). Hệ quả: dời hai câu chỉ dẫn `design_doc:`/giữ-marker sang bất kỳ mục nào khác của SKILL — kể cả ra ngoài S1, nơi chúng mất tác dụng — thì (b) vẫn xanh. Đây đúng lớp «đo từ vựng thay vì quan hệ» mà repo đã đặt tên, và là chênh lệch giữa lời khai của phép đo với thứ phép đo thật sự làm (kế hoạch đo tự nhận nhiều hơn vật).

AC-6 đòi mỗi mệnh đề đo được phải được đo đúng chỗ qua bộ kiểm của chiều xanh; checks.b không cắt vùng mà dò chuỗi rời trên toàn file, không chứng minh được vị trí — vi phạm rõ yêu cầu chất lượng của AC-6.

### 3. UX4 compares both documents to a hand-typed third literal instead of round-tripping from the writer
- file: `tests/plugins/ux-spec.test.mjs:14`
- severity: medium
- AC: AC-6

`const MIEN = 'bỏ đặc-tả-UX — '` is a hand-typed literal, and `mienKhop` (line 143) tests `skillText.includes('"'+MIEN) && tplText.includes('"'+MIEN)` — i.e. it checks each document against that third literal rather than extracting the exemption string from the template (the writer) and asserting the SKILL carries the extracted value. This contradicts the file's own header claim on lines 2-3 ("Fixture CODE-SINH rút từ CHÍNH ux-spec-template.md qua marker") and the round-trip rule in CLAUDE.md ("khuôn của seam LLM-viết→máy-đọc phải đặt một chỗ có marker rồi test round-trip rút-từ-writer-đọc-bằng-reader"). Failure scenario: SKILL.md and ux-spec-template.md are both reworded consistently (say to "bỏ đặc-tả-UX: ") and MIEN is not updated — the real invariant (SKILL == template) still holds, but UX4 goes red and reports "chuỗi miễn lệch giữa SKILL và khuôn", which is a false diagnosis pointing at the wrong file. The inverse also holds: MIEN is edited to match a drifted SKILL and the template is never checked against the writer's actual text. This is already recorded as an open UNCERTAIN by the spec-alignment judge on evidence-report.md and is unfixed at HEAD.

AC-6 cấm rõ ràng "fixture viết tay"; hằng MIEN là literal gõ tay thay vì rút từ khuôn thật, đúng dạng bị cấm dù ca này liên quan tới cửa miễn của AC-4.

### 4. Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ — checks.b của UX3 mù vị trí, quét toàn file
- file: `tests/plugins/ux-spec.test.mjs:91`
- severity: medium
- AC: AC-6

Dòng 91: `b: t => /design_doc: <path/.test(t) && /GIỮ NGUYÊN các marker/.test(t)`. Đây là hai regex RỜI chạy trên TOÀN VĂN SKILL.md, không trích khối nào trước. Bốn phép kiểm anh em đều rút khối rồi mới đo (a/a2 rút `step4` qua `/^4\. Kết thúc brainstorm[\s\S]*?(?=\n\d+\. |\n## )/m`, c rút `b3` qua `/- \*\*\[3\] Vẽ\*\*[\s\S]*?(?=\n- \*\*\[4\])/`, d quét cửa sổ ±400 quanh mọi lần xuất hiện) — b là ngoại lệ duy nhất và cũng là phép kiểm duy nhất không có comment nêu quan hệ nó đo.

Lời hứa lại là quan hệ về VỊ TRÍ: nhãn ở dòng 118 nói «chỉ dẫn contract ghi design_doc: + giữ marker», và evals.yaml E3 khai đúng chữ «Mỗi mệnh đề là một PHÉP KIỂM chạy trên MỘT chuỗi … không assert chuỗi rời trên toàn file» — b vi phạm chính câu tuyên đó.

Đã phá vật thật để chứng: xoá TRỌN câu chỉ dẫn khỏi bước 4 của SKILL.md (`Contract ghi \`design_doc: <path design-doc>\` trong frontmatter…; GIỮ NGUYÊN các marker của khuôn (…)`) VÀ bỏ luôn mệnh đề «GIỮ NGUYÊN các marker» còn lại trong bước 4, rồi dán hai chuỗi vào một HTML-comment vô thưởng vô phạt ở CUỐI FILE → `checkB` vẫn trả `true`. Nghĩa là chỉ dẫn máy-đọc (`design_doc:` trong frontmatter contract + giữ marker) có thể biến mất khỏi chỗ S1 thật sự đọc mà ca vẫn XANH.

Chiều đỏ hiện có không bù được: dòng 124 `ok(!checks.b(mutA), …)` dùng LẠI đúng mutant của mệnh đề (a) — `cutSentence(s, 'Kế đó, VẪN TRƯỚC khi sinh 3 artifact:', 'Rồi sinh CÙNG LÚC')` cắt một mảng lớn chứa cả hai chuỗi. Nhãn của nó cũng tự thú («cùng mutant … dây máy-đọc nằm trong câu bị gỡ»). Không có mutant nào cô lập riêng mệnh đề b, nên cái đỏ đó chỉ chứng minh «cắt cả đoạn thì mất chuỗi», không chứng minh b phân biệt được chỉ-dẫn-đúng-chỗ với chuỗi-lảng-vảng-đâu-đó.

Hình dạng: #3 (assert chuỗi có mặt trong khi lời hứa là quan hệ), kèm thiếu mutant cô lập lớp cho mệnh đề b.

AC-6 đòi mỗi mệnh đề đo được có mutant cô lập đi qua chính bộ kiểm của nó; đã phá thử thật cho thấy checks.b không có mutant riêng và không đo quan hệ vị trí — vi phạm trực tiếp yêu cầu AC-6.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thẻ Cổng 2 và sổ quyết định tuyên «hội đồng PASS» trong khi báo cáo bằng chứng là REJECT/UNCERTAIN**
  Người dùng thấy gì: Thẻ trình cho người ký ghi rằng các hội đồng đã đồng ý ĐẠT, nhưng báo cáo bằng chứng đứng sau nó thực ra ghi kết quả CHƯA ĐẠT hoặc CHƯA CHẮC — người ký có nguy cơ duyệt nhầm dựa trên thông tin sai lệch với bằng chứng thật.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/card-plain.json`
  severity: high
  Đề xuất: known-limits

- **UX_CASES gõ sai tên ca → chạy 0 assertion, exit 0 (xanh im lặng); hai file ca anh em đều có lưới này**
  Người dùng thấy gì: Nếu ai đó gõ nhầm hoặc sau này đổi tên một ca kiểm tra, hệ thống có thể báo 'đã kiểm xong, mọi thứ ổn' dù thực ra không kiểm tra gì cả — dễ gây nhầm tưởng an toàn khi chạy thủ công hoặc khi tên ca thay đổi.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: high
  Đề xuất: known-limits

- **verified_commit của báo cáo bằng chứng cũ hơn hai commit đã sửa chính vật được đo**
  Người dùng thấy gì: Báo cáo bằng chứng đang mô tả một phiên bản mã cũ hơn phiên bản thật sự cần xét duyệt — nếu chuyển thẳng sang ký mà không xác minh lại, người ký có thể dựa trên bằng chứng đã lỗi thời so với mã hiện tại.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Ba hình tầng-2 mới thiếu colophon mà DIAGRAM-RULE §3 bắt buộc**
  Người dùng thấy gì: Ba hình minh hoạ mới không ghi rõ chúng được vẽ từ tài liệu và phiên bản nào — sau này khó biết hình có còn khớp với tài liệu gốc hay đã lỗi thời.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/figures/duong-den-chu-ky.html`
  severity: low
  Đề xuất: known-limits

- **Evidence blocks E1–E4 record output from an unrelated feature's test case**
  Người dùng thấy gì: Bốn khối bằng chứng của các kiểm tra máy đang dán kết quả chạy của một tính năng khác hẳn, không phải kết quả thật của các kiểm tra thuộc tính năng này — báo cáo không thật sự chứng minh điều nó tuyên bố đã đạt.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **ux-spec.test.mjs drops the unknown-case guard — a bad UX_CASES value exits 0 with zero assertions**
  Người dùng thấy gì: Nếu ai đó gõ nhầm hoặc sau này đổi tên một ca kiểm tra, hệ thống có thể báo 'đã kiểm xong, mọi thứ ổn' dù thực ra không kiểm tra gì cả — dễ gây nhầm tưởng an toàn khi chạy thủ công hoặc khi tên ca thay đổi.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Contract title and PRODUCT-MAP row still advertise the machine check that was cut**
  Người dùng thấy gì: Tên gọi công khai của tính năng và bản đồ sản phẩm vẫn nhắc tới một phần kiểm tra tự động đã bị bỏ khỏi vòng này — người đọc bản đồ có thể tưởng nhầm là có kiểm tra máy trong khi thực ra không có.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md`
  severity: medium
  Đề xuất: known-limits

- **verified_commit predates the test and evals changes it is supposed to certify**
  Người dùng thấy gì: Báo cáo bằng chứng được ghim vào một mốc mã cũ hơn các thay đổi mà nó đáng lẽ phải xác nhận — nếu sau này ai đó chỉ đổi kết quả duyệt mà không chạy xác minh lại, bằng chứng sẽ không còn đúng với mã thật.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evidence-report.md`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 6/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/dac-ta-ux-vat-hoa-cau-truc/card-plain.json, _acceptance/dac-ta-ux-vat-hoa-cau-truc/evidence-report.md, _acceptance/dac-ta-ux-vat-hoa-cau-truc/figures/duong-den-chu-ky.html, _acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
