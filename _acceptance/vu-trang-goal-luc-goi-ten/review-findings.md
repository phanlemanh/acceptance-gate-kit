# Review findings — vu-trang-goal-luc-goi-ten (round 3)

## Trong hợp đồng

- **Hình dạng 2 (biến thể) — kỳ vọng goal_line dựng bằng ĐÚNG công thức của bên viết, chỉ đổi nguồn khuôn; AC-2 khai «không chép hàm thay của bên viết»** (`tests/scripts/gate-card-goal.test.mjs:36`, severity low, nguồn measurement) — Dòng 36: `expectLine = slug => SKILL_TPL.trim().split('\n').join(' ').split('<slug>').join(slug)` — trùng từng bước với bên viết `scripts/gate-card.js:110` `goalLine = s => GOAL_TEMPLATE.trim().split('\n').join(' ').split('<slug>').join(s)`. Chú thích dòng 27-30 tự gọi «chép công thức bên viết là hình dạng 2» rồi chỉ đổi NGUỒN (SKILL thay vì hằng) chứ không đổi PHÉP: lỗi nằm trong công thức (vd khuôn có `\r\n`, khoảng trắng đầu dòng bị gộp thành hai space) thì hai bên cùng sai, GL01 vẫn xanh. Hai assert độc lập kèm theo (không còn `<slug>`, không còn `\n`, dòng 42-43) chỉ phủ một phần; kỳ vọng độc lập thật là dựng từ 6 dòng SKILL bằng phép nối/thay khác (vd regex `\s*\n\s*` → ' ' + đếm đúng 2 lần thay) rồi so đẳng thức. Vì sao tính vào hợp đồng: AC-2 cấm trực tiếp việc test chép lại hàm thay-thế của bên viết để dựng kỳ vọng, và finding chứng minh test hiện tại chép đúng công thức đó (chỉ đổi nguồn khuôn) — trực diện làm AC-2 thất bại. AC: AC-2

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Suite tests/scripts ĐỎ tại HEAD: LM20 lệch routing-baseline — dòng hồ sơ này ghi khi thẻ còn BLOCKED, 094c9ead đổi trạng thái hồ sơ mà không sinh lại (lặp đúng lớp sổ cái #1 vừa đóng)**
  Người dùng thấy gì: Bộ kiểm tra tự động toàn kho đang báo đỏ vì dữ liệu đối chiếu của một tính năng khác (đã xong từ trước) bị lỗi thời sau thay đổi lần này — không phải do tính năng /goal đang xét sai, nhưng cần làm mới dữ liệu đó trước khi coi bộ kiểm tra là sạch.
  file: `_acceptance/loi-moi-cong-may-sinh/routing-baseline.txt`
  severity: high
  Đề xuất: known-limits

- **run-log-minted.mjs nạp lib của kit từ --root (cây bị kiểm) thay vì từ vị trí script — trái mọi caller hiện có của lib/eval-yaml.js; test phải cấy shim vào fixture để script chạy được**
  Người dùng thấy gì: Công cụ kiểm chứng bằng chứng vẫn chạy đúng trong kho hiện tại, nhưng có thể bị lỗi nếu một dự án khác cài công cụ này làm plugin — rủi ro chỉ xuất hiện ngoài kho gốc.
  file: `tests/scripts/run-log-minted.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca --usage dương dùng file usage-report.md THẬT của hồ sơ trên cây làm việc thay vì round-trip trong lần chạy (U03 đã có sẵn) — và che một trôi thật: regex bên đọc ép run id hex trong khi bên viết chỉ là basename thư mục**
  Người dùng thấy gì: Bài kiểm cho phần bằng chứng «mục sử dụng công cụ» dùng lại dữ liệu có sẵn thay vì tự dựng lại từ một lần chạy thật, nên nếu khâu sinh dữ liệu đó hỏng ở tình huống khác, bài kiểm này có thể không phát hiện ra — hạn chế đã được ghi nhận trước khi làm tính năng.
  file: `tests/scripts/run-log-minted.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đối chiếu ngược tập id đòi dòng run_id cho MỌI id trong evals.yaml, nhưng bên viết không bao giờ ghi dòng như vậy cho eval `executor: judgment` (chỉ có `kind: panel`) → hồ sơ có eval phán là đỏ oan trên vòng Workflow đúng**
  Người dùng thấy gì: Nếu một hồ sơ tính năng khác dùng bước đánh giá do hội đồng chấm (không phải kiểm thử máy), công cụ kiểm chứng có thể báo lỗi oan dù hồ sơ đó đã làm đúng quy trình — hồ sơ /goal đang xét không có bước đánh giá kiểu này nên không bị ảnh hưởng.
  file: `tests/scripts/run-log-minted.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ không chạm UI (surfaces: [cli]) thiếu entry descope «bỏ đặc-tả-UX — …» mà SKILL S1#4 bắt buộc; ba hồ sơ tự-host gần nhất đều có**
  Người dùng thấy gì: Hồ sơ thiếu một dòng ghi chú nội bộ giải thích vì sao tính năng này không cần bước thiết kế giao diện — chỉ là thiếu sổ sách nội bộ, không ảnh hưởng tới việc thẻ và tính năng hoạt động đúng.
  file: `_acceptance/vu-trang-goal-luc-goi-ten/decisions.jsonl`
  severity: low
  Đề xuất: known-limits

- **Thân lệnh acceptance-card.md nói `goal_line` «ở cuối danh sách» nhưng nó đứng thứ 3/4 trong danh sách và ngay sau `one_shot` trong JSON --extract**
  Người dùng thấy gì: Một câu hướng dẫn nội bộ mô tả sai vị trí của một trường dữ liệu trong danh sách — chỉ là lỗi diễn đạt trong tài liệu dành cho người soạn tin mời, không ảnh hưởng tới nội dung thẻ quyết định thật.
  file: `commands/acceptance-card.md`
  severity: low
  Đề xuất: known-limits

- **Suite scripts ĐỎ tại HEAD (LM20) — baseline định tuyến của hồ sơ mới ghim theo thẻ BLOCKED vòng 1, trong khi evidence-report ghi E2/E3 PASS «797/0»**
  Người dùng thấy gì: Bộ kiểm tra tự động toàn kho đang báo đỏ vì dữ liệu đối chiếu của một tính năng khác bị lỗi thời sau thay đổi lần này, trong khi báo cáo bằng chứng của chính vòng này lại đo từ trước khi lệch xảy ra — cần làm mới dữ liệu đối chiếu đó trước khi khép hồ sơ.
  file: `_acceptance/loi-moi-cong-may-sinh/routing-baseline.txt`
  severity: high
  Đề xuất: known-limits

- **run-log-minted: phép đối chiếu ngược «mọi id evals.yaml phải có dòng eval» ĐỎ SAI với mọi hồ sơ có eval judgment — bên viết không bao giờ ghi dòng không-kind cho judgment**
  Người dùng thấy gì: Nếu một hồ sơ tính năng khác dùng bước đánh giá do hội đồng chấm, công cụ kiểm chứng có thể báo lỗi oan dù quy trình đã đúng — hồ sơ /goal đang xét không có bước này nên không bị ảnh hưởng.
  file: `tests/scripts/run-log-minted.mjs`
  severity: medium
  Đề xuất: known-limits

- **run-log-minted: luật «hai dong cho mot eval» mâu thuẫn với chính lời hứa «vòng chạy lại cùng round có nhiều ts» — fixture ca «hai ts» không đúng hình dạng bên viết nên mâu thuẫn tàng hình**
  Người dùng thấy gì: Nếu quy trình xác minh phải chạy lại nhiều lần trong cùng một vòng, công cụ kiểm tra có thể báo lỗi trùng lặp một cách oan uổng — tình huống này chưa xảy ra với hồ sơ /goal đang xét nên chưa chặn kết quả hiện tại.
  file: `tests/scripts/run-log-minted.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — ca «--usage DUONG» đọc bản chụp đã commit thay vì round-trip qua wf-usage.mjs; regex bên đọc tự đoán hình dạng run-id mà bên viết không cam kết**
  Người dùng thấy gì: Bài kiểm cho phần bằng chứng «mục sử dụng công cụ» dùng dữ liệu có sẵn thay vì tự dựng lại từ một lần chạy thật, nên có thể bỏ lọt một số định dạng hợp lệ khác — hạn chế đã được ghi nhận trước khi làm tính năng.
  file: `tests/scripts/run-log-minted.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1/3 — vế «acceptance-card.md ben DOC» chỉ grep câu trong file chỉ dẫn; lời hứa là bên đọc thuật ĐÚNG câu bên viết in, không phép đo nào nối hai bên**
  Người dùng thấy gì: Câu hướng dẫn nội bộ cho việc soạn tin mời hiện đúng nội dung nhưng chưa có cơ chế tự động đảm bảo nó luôn khớp câu thật hiển thị trên thẻ — nếu sau này câu thật đổi mà quên sửa hướng dẫn, sẽ không có cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — đột biến GL02 chỉ assert «khác goal_line», không ghim giá trị mong đợi; `got2 === null` cũng qua**
  Người dùng thấy gì: Một bài kiểm nội bộ chưa đủ chặt để phân biệt hai kiểu lỗi khác nhau trong tình huống hiếm, nhưng phép kiểm chính — dòng chữ mục tiêu trên thẻ phải khớp chính xác — vẫn hoạt động đúng như mong đợi.
  file: `tests/scripts/gate-card-goal.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture run-log viết tay đúng khuôn bên đọc (khai «CODE-SINH theo hợp đồng bên viết» nhưng không gọi bên viết); đã khai Known limits #5**
  Người dùng thấy gì: Một phần dữ liệu mẫu dùng để kiểm bằng chứng được viết tay theo đúng khuôn máy đọc thay vì lấy trực tiếp từ một lần chạy thật — giới hạn này đã được ghi nhận trước khi làm tính năng.
  file: `tests/scripts/run-log-minted.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
