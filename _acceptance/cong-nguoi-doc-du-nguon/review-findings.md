## Trong hợp đồng

Hai mục. Cả hai là fail-SILENT, và cả hai đã được chủ vòng đo lại bằng tay trên
corpus thật — bán kính ghi ngay trong từng mục. DỪNG-VÁ đã nổ: đây là lần thứ BA
liên tiếp một lượt sửa đẻ ra lỗi cùng lớp, nên máy KHÔNG tự vá tiếp.

- **parseACBlock cắt cụt thân tiêu chí ở MỌI dòng mở đầu bằng `#` — mất cả chữ lẫn tag (cross-layer)/(judgment)**
  Trong `parseACBlock`, dòng `if (/^#{1,6}\s/.test(l)) { chot(); continue; }` đóng khối tiêu chí đang mở ở BẤT KỲ dòng nào bắt đầu bằng `#` + khoảng trắng — kể cả `#` là chú thích shell nằm trong khối mã ``` của thân tiêu chí, và kể cả tiêu đề h1 mà `lib/md-section.cjs` CỐ Ý coi là NỘI DUNG (chú thích dòng 56–59 của md-section.cjs: «dòng `# guidance` là CONTENT»; luật `same-or-higher` chỉ đóng ở h2–h6). Hai bộ duyệt vì thế bất đồng về ranh giới.

  Đo được trên cây này:

  ```
  ### AC-1 — nhãn
  Given a, When b, Then c.
  ```bash
  # lệnh mẫu
  node x.js
  ```
  Then bản ghi tồn tại qua API. (cross-layer)
  ```

  → parseACBlock trả `[{"id":"AC-1","gwt":"nhãn: Given a, When b, Then c. ```bash","crossLayer":false}]`.

  Ba hệ quả, đều LẶNG (không cờ, không cảnh báo):
  1. Thẻ Cổng 1 và Cổng 2 (`scripts/gate-card.js:405`, `:726`) cùng trang bằng chứng (`scripts/evidence-page.js:68`) hiện một tiêu chí CỤT — người ký duyệt trên chữ thiếu, mà `acBlindSpot` IM vì n == m (số tiêu chí bóc được vẫn đúng, chỉ THÂN bị cắt).
  2. `crossLayer` thành false → răng pairing cross-layer (lint W4 và nhánh node của pre-merge) không bắn: bằng chứng UI-only chống lưng một đường UI→API→backend.
  3. `judgment` thành false → tiêu chí cần phán đoán người bị chấm như tiêu chí máy kiểm được.

  Điều kiện kích hoạt rất thường gặp trong chính kit này: hợp đồng hay trích lệnh trong khối mã, và chú thích shell mở đầu bằng `# `.
  BÁN KÍNH ĐO TAY (chủ vòng, 1 243 hợp đồng / 22 kho): **0**. Có 35 hồ sơ khai
  tiêu chí bằng tiêu đề, KHÔNG hồ sơ nào có dòng `#` trong thân tiêu chí. Đây là
  hình dạng tiềm ẩn, chưa cháy. Ngưỡng đang đếm: ≥1 hợp đồng rơi vào hình dạng đó.
  file: `lib/ac-line.cjs:181`
  severity: high
  AC: AC-7

- **contentLines: nhánh VĂN XUÔI không loại dòng tiêu đề — dấu `###` lọt vào thẻ và dính liền đoạn văn**
  Nhánh gạch-đầu-dòng của chính hàm này CỐ Ý loại heading khỏi phần nối (`else if (mo && !/^\s*#{1,6}\s/.test(l))`), nhưng nhánh văn xuôi mới thêm (vòng `for (const l of raws)` ở ~dòng 118) không có lưới đó: mọi dòng không trắng, không phải hàng phân cách đều được đẩy vào `doan` hoặc nối vào đoạn đang mở — kể cả `### Trục A`. Đo thật trên cây này:

  ```
  node -e 'const {section,contentLines}=require("./lib/md-section.cjs");
  const t=["## Coverage","","Câu mở đầu.","### Trục A","Nội dung A.","","---","","Nội dung B."].join("\n");
  console.log(contentLines(section(t,"Coverage")))'
  → [ 'Câu mở đầu. ### Trục A Nội dung A.', 'Nội dung B.' ]
  ```

  Hai hệ quả trên đúng bề mặt người đọc mà hồ sơ này sinh ra để chữa (scripts/gate-card.js:647 in `covLines` qua `esc(stripMd(t))`, và `stripMd` KHÔNG bóc dấu `#`): (a) thẻ Cổng Phạm vi in nguyên chuỗi `### Trục A` như thể nó là chữ của hợp đồng; (b) chữ của hai mục con khác nhau bị dán thành MỘT dòng, tức thẻ trình bày một câu không có trong hợp đồng — cùng lớp «bịa ra một hàng không có trong hợp đồng» mà chú thích ngay trên (dòng ~110) đã cấm cho nhánh BẢNG. Phụ: `LA_PHAN_CACH` khớp cả `---`, và nhánh này `continue` mà KHÔNG đóng đoạn, nên văn trước và sau một đường kẻ ngang cũng bị nối. Vá đúng tầng: trong vòng văn xuôi, coi `/^\s*#{1,6}\s/` và `LA_PHAN_CACH` là ranh giới đóng đoạn (đặt `dangMo = false`) và bỏ dòng tiêu đề, đúng như nhánh gạch đầu dòng đang làm.
  BÁN KÍNH ĐO TAY (244 mục Coverage): **0**. Có 22 mục đi qua nhánh văn xuôi,
  KHÔNG mục nào chứa dòng tiêu đề. Đây là HỒI QUY do chính bản vá `a14b3dbd` viết
  để đóng một phát hiện của lượt 6. Ngưỡng đang đếm: ≥1 mục văn xuôi có tiêu đề con.
  file: `lib/md-section.cjs:118`
  severity: medium
  AC: AC-15

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **W6 (glossary) vẫn khoá cứng mục `Criteria` trong khi parseACs đã đọc thêm `Acceptance Criteria`**
  Người dùng thấy gì: Nếu hợp đồng nghiệm thu đặt tên mục tiêu chí theo cách viết mới, phần rà từ ngữ cấm dùng có thể không chạy trên mục đó mà không có cảnh báo nào, khiến câu chữ không mong muốn có thể lọt qua.
  file: `scripts/eval-coverage-lint.js`
  severity: low
  Đề xuất: known-limits

- **carry-plan.mjs crossLayerACs không được nới cùng parseACBlock → atomic-pair tắt lặng lẽ**
  Người dùng thấy gì: Một số bằng chứng đã duyệt có thể được giữ nguyên không kiểm lại dù phần liên quan trên một mặt khác của cùng tính năng đã thay đổi và lẽ ra phải được kiểm lại cùng lúc, khiến người ký duyệt tin nhầm là mọi phần đều đã được xác minh mới nhất.
  BÁN KÍNH ĐO TAY (1 243 hợp đồng): **9 hồ sơ** có tiêu chí xuyên lớp mà thư viện
  thấy còn tệp này không thấy — ap-media-roadmap và artifact-platform mỗi kho một
  hồ sơ ba mã, crm bốn hồ sơ. Đây là mục DUY NHẤT trong chín mục có bán kính SỐNG,
  và là bộ đọc thứ NĂM chưa hồ sơ nào khai.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: high
  Đề xuất: new-contract

- **Nhánh node của răng cross-layer trong pre-merge-check.sh vẫn đọc theo DÒNG → cổng chặn tắt lặng với hợp đồng dạng tiêu đề**
  Người dùng thấy gì: Với một số hợp đồng viết tiêu chí theo kiểu tiêu đề, bước chặn tự động trước khi gộp mã có thể bỏ sót một loại lỗi (tiêu chí cần bằng chứng ở cả giao diện lẫn máy chủ) mà không báo cho người biết, dù nơi khác vẫn hiển thị tiêu chí đầy đủ.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert "chuỗi có mặt" trong khi lời hứa của contentLines là QUAN HỆ giữa các dòng**
  Người dùng thấy gì: Bài kiểm tra tự động cho phần hiển thị nội dung bao phủ có thể không phát hiện được khi hai đoạn nội dung khác nhau trong hợp đồng bị gộp nhầm thành một câu, nên một lỗi hiển thị dạng này có nguy cơ lọt qua mà tưởng là đã kiểm xong.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ba nhánh mới của contentLines tuyên là lớp nhưng không có ô nào trong ma trận**
  Người dùng thấy gì: Ba hành vi mới vừa thêm cho việc đọc phần nội dung bao phủ (nối dòng dài, nhận thêm kiểu gạch phân cách, bỏ qua mục còn để trống khuôn mẫu) hiện chưa có phép thử nào canh riêng, nên nếu sau này một trong ba việc đó bị làm sai, sẽ không có cảnh báo tự động nào bật lên.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — SO_O_RIENG khai 5 ô ngoài bảng nhưng không assert nào ghim con số đó**
  Người dùng thấy gì: Bộ đếm dùng để canh bài kiểm tra khỏi bị âm thầm rút bớt nội dung chỉ được nhắc bằng một dòng chữ hiển thị, không có phép thử nào thật sự kiểm tra con số đó — nên nếu sau này bài kiểm tra bị cắt bớt, sẽ không ai được cảnh báo.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ô đối chứng «heading LỆCH» của P69 không còn lệch, nhánh quét-cả-tệp mất phép đo**
  Người dùng thấy gì: Một bài kiểm tra dùng để đảm bảo hệ thống không tự ý tìm tiêu chí ở nơi khác khi đặt sai tên mục đã vô tình mất tác dụng sau một thay đổi gần đây, nên nếu hành vi đó thật sự có lỗi trong tương lai, bài kiểm tra này sẽ không còn bắt được.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/9 lỗi rơi vào file không bộ đo nào phủ (feature-loop/scripts/carry-plan.mjs, scripts/pre-merge-check.sh, tests/plugins/run-tests.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.