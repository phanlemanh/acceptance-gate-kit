## Trong hợp đồng

- **inContract bóc bằng khuôn bên VIẾT không dùng cho mục «Trong hợp đồng» → đọc ra 0, im lặng, và điều kiện xanh-sạch thứ bảy cho qua**
  file: `lib/out-of-contract.cjs:132`
  severity: high
  AC: AC-14
  detail: `inContract: inLines ? parseFindings(inLines) : []` dùng CHÍNH `parseFindings` của mục «Ngoài hợp đồng», tức đòi `- **title**` đứng một mình + các dòng `key: value` thụt lề. Bên VIẾT không như vậy: prompt synthesize (feature-loop/workflows/acceptance-verify.js:1170) chỉ áp OOC-ITEM-TEMPLATE cho mục «Ngoài hợp đồng»; với «Trong hợp đồng» nó chỉ dặn «mỗi dòng ghi thêm AC: <acRef>».

  Đo thật trên chính `_acceptance/` của kho này (chạy `ooc.parse` từng hồ sơ): 11 hồ sơ có mục «Trong hợp đồng» mang mục thật mà `inContract.length === 0` — cong-dang-co-cua 8→0, loi-moi-cong-may-sinh 7→0, measure-teeth-cleanup 7→0, lenh-in-ra-phai-bam-duoc 4→0, dac-ta-ux-vat-hoa-cau-truc 4→0, codex-script-packaging 3→0, premerge-unjudged-pass 2→0, ma-so-quyet-dinh-duy-nhat / siet-rang-cau-ve-hinh / stop-patching-law / tool-kill-duong-doc-lap 1→0.

  Hai hệ quả, cả hai LẶNG: (1) khối thẻ mới «Lỗi TRONG hợp đồng CHƯA sửa» (scripts/gate-card.js:964) không bao giờ hiện trên đúng loại hồ sơ nó sinh ra để cứu; (2) `mucChoNguoi` cộng `trong = 0` nên điều kiện xanh-sạch thứ bảy trả SẠCH. Không lưới nào bắt: `suspect_empty` (out-of-contract.cjs:138) chỉ tính trên `outLines`, mục «Trong hợp đồng» không có bộ dò điểm mù.

  TÁI HIỆN (đã chạy thật, fixture git tạm với lib/scripts chép từ nhánh này): hồ sơ `status: verified`, `verdict: PASS`, `human_signoff` rỗng, `findings_open: 0`, review-findings.md có `## Trong hợp đồng` viết dạng `### <title>` + `- file:` / `- severity:` / `- AC: AC-1` (đúng dạng 3 hồ sơ thật trong kho) → `pre-merge-check.sh` in NOTE xanh-sạch — máy đi tiếp, KHÔNG mời ký; OK PASS — làn V, máy đi tiếp không chữ ký. Một lỗi severity high TRONG phạm vi đã duyệt, chưa sửa, gộp được mà không ai nhìn thấy.

  Ghi chú: chú thích ở dòng 130-131 khai «hai mục dùng chung khuôn OOC-ITEM-TEMPLATE ở bên viết» — mệnh đề đó sai so với acceptance-verify.js.
  rationale: AC-14 yêu cầu bộ đếm out-of-contract.cjs khớp đúng số mục đã sinh bởi khuôn bên viết cho CẢ hai mục Ngoài và Trong hợp đồng; finding chứng minh mục Trong hợp đồng luôn đếm ra 0 vì khuôn khác nhau — đúng vế AC-14 thất bại.

- **`AC_SUSPECT` nới sang dạng tiêu đề nhưng `AC_XREF` không nới → cờ điểm-mù giả cho cross-reference viết bằng heading**
  file: `lib/ac-line.cjs:23`
  severity: medium
  AC: AC-9
  detail: `AC_SUSPECT` được thêm `(?:#{2,6}\s+)?` để nhận `### AC-n`, nhưng `AC_XREF` (dòng 29) vẫn là `/^\s*(?:[-*]\s+)?\*{0,2}\s*AC-\d+\s*[,;/]/` — không có tiền tố heading. Một dòng tham chiếu chéo viết dạng tiêu đề lọt qua bộ lọc xref và bị đếm là tiêu chí nghi-bỏ-sót.

  TÁI HIỆN (chạy thật): contract = "## Criteria\n- AC-1: Given a When b Then c\n\n### AC-5, AC-9 chưa có gì\n" → `acBlindSpot(t, parseACBlock(t).map(x=>x.id))` → `{"kind":"short","suspect":2,"parsed":1,"lines":[2,4],"heading":"## Criteria"}`. `parseACBlock` loại đúng dòng xref đó (parsed=1) còn `AC_SUSPECT` vẫn đếm nó (suspect=2), nên thẻ Cổng 1 nổi cờ «thiếu tiêu chí» trên một hợp đồng lành — đúng ca «cries wolf on a healthy contract» mà chú thích ngay trên AC_XREF nói là bị cấm.
  rationale: AC-9 yêu cầu acBlindSpot trả null (không kêu oan) trên hợp đồng LÀNH; finding tái hiện đúng một hợp đồng lành mà acBlindSpot vẫn kêu do AC_XREF không nới cho dạng tiêu đề — vi phạm trực tiếp vế 'không kêu oan' của AC-9.

- **Hình dạng 5 — AC-13 tuyên «BỐN bên gọi», ca CN13 đo ba bên + chính bộ bóc (một phần tử tự-đúng)**
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs:591`
  severity: high
  AC: AC-13
  detail: AC-13 của contract.md gọi TÊN bốn bên đọc: `scripts/gate-card.js`, `scripts/evidence-page.js`, `scripts/eval-coverage-lint.js`, và nhánh node của răng cross-layer trong `scripts/pre-merge-check.sh`; E13 chép lại đúng danh sách đó. Nhưng `doBon()` (dòng 553–591) trả về `{ soLib, soThe, lintThieu, soTrang }`: bên thứ tư được đo là `lib/ac-line.cjs` gọi trực tiếp qua tiến trình con (dòng 559–563), còn `pre-merge-check.sh` KHÔNG hề được gọi trong CN13. Hai hệ quả: (a) phần tử `pre-merge-check.sh` của lớp «mọi bên gọi» không có assert nào — ma trận thiếu đúng một phần tử so với lớp đã tuyên, đúng mẫu P105; (b) phần tử thay thế nó là tautology w.r.t. mũi tiêm: mũi tiêm ở dòng 606–611 sửa chính `lib/ac-line.cjs` (`const h = l.match(AC_HEAD);` → `const h = null;`), nên `soLib` đổi theo định nghĩa chứ không chứng minh thêm điều gì; assert `if (do_.soLib === 5) lech.push('lib')` (dòng 616) không thể đỏ vì lý do nào khác. Phụ: E13 khai hợp đồng «9 tiêu chí», code dựng 5 (dòng 536).
  rationale: AC-13 yêu cầu xác minh đủ BỐN bên đọc, gồm nhánh node của pre-merge-check.sh; finding chứng minh test không hề gọi tới bên thứ tư này, nên AC-13 thiếu bằng chứng cho đúng phần đã tuyên trong chính AC.

- **Hình dạng 3 — AC-11 hứa hai nhánh trả CÙNG TẬP id, CN11 chỉ assert hai chuỗi có mặt trong output**
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs:664`
  severity: high
  AC: AC-11
  detail: AC-11 khai quan hệ: «lưới in VIOLATION cho đúng id đó ở CẢ HAI nhánh — hai nhánh trả CÙNG tập id trên cùng hợp đồng». CN11 đo bằng `const noiXL = (out) => /cross-layer/i.test(out) && /AC-1/.test(out);` (dòng 664) rồi chỉ kiểm `noiXL(coNode)` và `noiXL(khongNode)` — không bao giờ rút tập id của từng nhánh và cũng không so hai tập với nhau, nên hợp đồng có nhiều tiêu chí xuyên lớp mà hai nhánh ra hai tập khác nhau vẫn xanh. Thêm hai chỗ làm phép đo yếu hơn nữa: (1) hai vị từ khớp ĐỘC LẬP trên TRỌN output, không đòi cùng một dòng VIOLATION; ở lượt `khongNode`, `scripts/pre-merge-check.sh:1658` LUÔN in NOTE «cross-layer teeth graded with the built-in awk pattern…» mỗi khi `AC_LINE_FALLBACK_SEEN` bật, nên vế `/cross-layer/i` là hằng-đúng và assert nhánh awk teo về «chuỗi AC-1 xuất hiện đâu đó»; (2) cần `khongNode` (dòng 660: `env.PATH = '/usr/bin:/bin'`) nhưng KHÔNG tự kiểm rằng PATH đó thật sự không có `node` — chính tệp này làm đúng phép tự kiểm ấy ở `ve2VangNode()` (dòng 496–503) nhưng CN11 không gọi nó. Trên một máy/CI có `/usr/bin/node`, lượt «nhánh awk» của CN11 âm thầm chạy lại nhánh node và ca xanh trong khi nhánh awk chưa từng được đo. Cuối cùng, ca không có ô đối chứng im lặng (thêm eval `layer: backend-effect` → cả hai nhánh không kêu) mà E11 đã khai là «đối chứng dương TRƯỚC».
  rationale: AC-11 yêu cầu hai nhánh (node/awk) trả CÙNG tập id trên cùng hợp đồng; finding chứng minh test không so sánh tập id nào cả mà chỉ kiểm hai vị từ độc lập trên toàn output, nên phần 'cùng tập id' của AC-11 chưa được xác minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Mục «Trong hợp đồng» không có bộ dò sai-khuôn, và `mucChoNguoi` bỏ qua `suspect_empty`**
  Người dùng thấy gì: Thẻ chờ-người có thể lặng lẽ bỏ sót một số việc cần bạn quyết, khiến bạn tưởng đã đủ trong khi thực ra vẫn còn việc chưa được liệt kê ra.
  file: `lib/out-of-contract.cjs`
  severity: high
  Đề xuất: new-contract

- **Khuôn tính `findings_open` ở bên VIẾT khác khuôn ở bên ĐỌC**
  Người dùng thấy gì: Tài liệu hướng dẫn cách đếm việc còn chờ có thể không khớp với cách máy thực sự đếm, dễ khiến báo cáo ghi sai số mà người viết không hề hay biết.
  file: `skills/acceptance/references/evidence-report-template.md`
  severity: medium
  Đề xuất: known-limits

- **Nhãn định đoạt là chỉ số VỊ TRÍ nhưng sổ quyết định là append-only — trừ nhầm nhãn đời trước**
  Người dùng thấy gì: Một quyết định từ vòng trước có thể vô tình bị tính là đã xử lý cho một mục hoàn toàn mới ở vòng sau, khiến hồ sơ hiện ra sạch trong khi vẫn còn việc thật chưa ai quyết.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: new-contract

- **`_fjson` không khai `local` trong `xanh_sach_check` — rò ra phạm vi toàn cục**
  Người dùng thấy gì: Chưa có tác động nào tới kết quả bạn thấy — đây là một chi tiết kỹ thuật nội bộ chưa gây sai lệch nào trong thực tế.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: wont-fix

- **Vắng khoá `findings_open` hạ VIOLATION xuống NOTE, mà không mã nào GHI khoá đó → làn V vẫn gộp hồ sơ còn mục chờ người**
  Người dùng thấy gì: Một hồ sơ mới lỡ quên ghi một dòng trong báo cáo có thể trôi qua cổng gộp mã dù vẫn còn việc cần bạn quyết, mà không ai được cảnh báo rõ ràng.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **Bên VIẾT và bên ĐỌC của `findings_open` dùng HAI định nghĩa khác nhau**
  Người dùng thấy gì: Báo cáo xác minh có thể bị chặn gộp mã một cách oan uổng vì hai phần của hệ thống đếm số việc còn chờ theo hai cách khác nhau, dù cả hai đều đúng theo cách hiểu riêng của mình.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **`mucChoNguoi` trừ mọi nhãn được NHẮC trong dòng sổ gate2, kể cả nhãn nói rõ là CHƯA quyết → sạch giả**
  Người dùng thấy gì: Một ghi chú nói rõ 'chưa quyết' trong sổ quyết định vẫn có thể vô tình làm hồ sơ hiện ra sạch, khiến việc thật sự cần bạn xem lại bị bỏ sót.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 6 — phép đo bán kính quét `~/dev` của tác giả, không quét cây đang kiểm**
  Người dùng thấy gì: Các con số minh hoạ quy mô vấn đề trong hồ sơ này có thể không tái lập được trên máy khác, khiến người đọc sau khó tự kiểm chứng độ lớn thật của vấn đề.
  file: `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — 10/18 eval khai «chiều đỏ / mũi tiêm» mà ca thi hành không hề có, kèm thông điệp ghim không tồn tại trong mã**
  Người dùng thấy gì: Nhiều minh chứng tự động trong hồ sơ này tuyên đã thử cả trường hợp lỗi lẫn trường hợp đúng, nhưng thực ra chỉ chạy một chiều — nghĩa là một phần bằng chứng đứng sau chữ ký của bạn đáng tin cậy hơn thực tế.
  file: `_acceptance/cong-nguoi-doc-du-nguon/evals.yaml`
  severity: high
  Đề xuất: new-contract

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
