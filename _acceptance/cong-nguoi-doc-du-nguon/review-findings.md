## Trong hợp đồng

- **parseACBlock nuốt tiêu chí dạng gạch-đầu-dòng nằm sau một tiêu chí dạng tiêu đề**
  Người dùng thấy gì: Khi một hợp đồng liệt kê tiêu chí bằng tiêu đề rồi tiếp theo bằng gạch đầu dòng, bộ đọc tiêu chí trung tâm của kit có thể bỏ sót hoặc gộp nhầm một tiêu chí vào thân của tiêu chí tiêu đề đứng trước nó, khiến thẻ Cổng 1, bộ tính độ phủ eval, trang bằng chứng và bộ kiểm xuyên lớp trước khi gộp mã đều nhìn thấy một danh sách tiêu chí khác với hợp đồng thật.
  file: `lib/ac-line.cjs`
  severity: medium
  Đề xuất: vá `parseACBlock` để mọi dòng gạch-đầu-dòng hợp lệ luôn được đưa qua `parseAC` thay vì bị nuốt vào thân tiêu đề trước đó; đã ghi nhận nhưng CHƯA vá trong lượt chấm này — chuyển sang vòng vá kế tiếp trước khi ký Cổng 2.
  AC: AC-7

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Điều kiện thứ bảy fail-OPEN khi review-findings.md VẮNG, kể cả khi chính báo cáo khai findings_open > 0**
  Người dùng thấy gì: Nếu báo cáo tự động đã ghi rõ còn nhiều việc chờ người quyết, nhưng tệp rà soát chi tiết lại bị mất hoặc chưa lưu, hệ thống có thể vẫn coi hồ sơ là sạch và cho gộp, trái với chính điều báo cáo vừa khai.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: new-contract

- **Đường đọc-cũ (doiCu) hạ VIOLATION xuống NOTE trên hai nhánh KHÔNG đi qua cửa GHI — hồ sơ MỚI vẫn vào được**
  Người dùng thấy gì: Một hồ sơ vừa hoàn tất có thể lọt qua vòng kiểm trước khi gộp mã mà không bị chặn lại, chỉ vì bước soạn báo cáo tự động quên ghi đúng một dòng thông tin — không ai biết việc đó đã xảy ra.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **product-map và start-scan không đọc cờ doiCu — bản đồ/bộ quét gọi HỎNG cho hồ sơ mà lưới trước-merge chỉ NOTE**
  Người dùng thấy gì: Bảng tổng quan sản phẩm và bộ quét trạng thái có thể hiện một hồ sơ là 'hỏng' trong khi vòng kiểm trước khi gộp mã chỉ coi đó là một lưu ý nhẹ, khiến người xem hai nơi khác nhau thấy hai kết luận trái ngược về cùng một hồ sơ.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: new-contract

- **`ledgerText` là tham số chết nhưng vẫn được ba bên gọi đọc từ đĩa**
  Người dùng thấy gì: Hệ thống vẫn tốn thời gian mở một tệp sổ quyết định trong mỗi lượt kiểm dù kết quả đọc được không còn dùng vào việc gì — không ảnh hưởng người dùng, chỉ lãng phí một chút thời gian xử lý.
  file: `lib/evidence-core.cjs`
  severity: low
  Đề xuất: known-limits

- **dieuKienFindings bỏ qua cờ ngoRong — mục rà soát sai khuôn được kết luận là SẠCH**
  Người dùng thấy gì: Nếu bản rà soát của một hồ sơ viết sai khuôn (có nội dung nhưng máy không đếm ra được mục nào) trong khi báo cáo tự động khai đúng số 0, hệ thống có thể kết luận hồ sơ đó sạch dù thực chất bản rà soát chưa đọc được đúng cách và không đủ tin cậy để kết luận như vậy.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: new-contract

- **Bên VIẾT đếm findings_open kể cả mục «Chưa phân loại», bên ĐỌC không — lệch chắc chắn ở mọi lượt triage hỏng**
  Người dùng thấy gì: Khi bước phân loại lỗi tự động bị trục trặc, con số 'còn bao nhiêu việc chờ người quyết' mà báo cáo ghi có thể khác với con số hệ thống tự đếm ra, khiến người vận hành dễ đi sửa nhầm chỗ và mất thời gian tìm nguyên nhân thật.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **review-findings.md KHÔNG ĐỌC ĐƯỢC bị đọc thành VẮNG TỆP → kết luận sạch**
  Người dùng thấy gì: Nếu tệp rà soát của một hồ sơ bị lỗi khi đọc (ví dụ hỏng hoặc thiếu quyền) chứ không đơn thuần là không tồn tại, bảng tổng quan có thể vẫn báo hồ sơ đó sạch, che giấu mất một lỗi hạ tầng thật cần được chú ý.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **Răng thứ bảy treo vào một khoá frontmatter do LLM viết, không lưới nào cưỡng chế sự có mặt**
  Người dùng thấy gì: Việc một hồ sơ có bị chặn lại trước khi gộp mã hay không đang phụ thuộc vào việc bước soạn báo cáo tự động có nhớ viết đúng một dòng thông tin hay không; quên dòng đó thì hồ sơ vẫn lọt qua mà không ai hay biết.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3 — assert MÃ THOÁT của một trục khác thay vì QUAN HỆ giữa các con số đã hứa (E17/do-ban-kinh)**
  Người dùng thấy gì: Con số dùng làm bằng chứng để chứng minh tính năng này hoạt động đúng có thể không thực sự phản ánh điều được công bố, vì phép đo tự động chỉ kiểm một phần rất nhỏ trong khi lời hứa bao trùm nhiều phần hơn.
  file: `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 6 — đường dẫn mặc định trỏ ~/dev, đo máy tác giả thay vì cây đang kiểm**
  Người dùng thấy gì: Các con số dùng làm bằng chứng cho tính năng này được đo trên máy của người viết chứ không phải trên đúng bản mã đang được xét duyệt, nên trên máy hoặc môi trường khác con số đó có thể sai hoặc phép đo thất bại hoàn toàn.
  file: `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — evals khai «chiều đỏ mũi tiêm» cho từng ca nhưng 10/15 ca không có mũi tiêm nào**
  Người dùng thấy gì: Phần lớn các bài kiểm tra dùng để chứng minh tính năng này đúng chưa từng được thử với một trường hợp lỗi thật để xem chúng có phát hiện ra không, nên chưa có gì chắc chắn các bài kiểm tra đó thật sự bắt được lỗi khi lỗi xảy ra.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — E1/E4 khai ma trận CŨ (còn phép trừ sổ), ngược với hợp đồng và với ca đang chạy**
  Người dùng thấy gì: Tài liệu mô tả cách kiểm thử tính năng này còn ghi theo quy tắc cũ đã bị thay đổi, có thể khiến người đọc sau hiểu nhầm cách tính năng thực sự hoạt động.
  file: `_acceptance/cong-nguoi-doc-du-nguon/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — CN07 tuyên «ma trận 12 hình dạng» nhưng không hằng nào ngoài bảng ghim số ô**
  Người dùng thấy gì: Một bài kiểm tra tự nhận là kiểm đủ nhiều trường hợp nhưng số trường hợp đó không được ràng buộc chặt với nội dung thật, nên nếu vô tình bớt đi một trường hợp, bài kiểm tra vẫn báo đạt.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — CN02 đo THỨ TỰ CHUỖI trong mã nguồn thay vì quan hệ hành vi, và mũi tiêm (c) tự chèn đúng chuỗi nó đếm**
  Người dùng thấy gì: Một bài kiểm tra chỉ soi xem đoạn mã có chứa đúng những từ khoá nhất định theo đúng thứ tự chứ không thực sự kiểm kết quả đầu ra; viết lại đoạn mã theo cách khác — dù đúng hay sai — đều có thể làm bài kiểm tra báo nhầm.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — khẳng định của CN10 tự tắt khi đối chứng dương đổi chữ**
  Người dùng thấy gì: Một bài kiểm tra dùng để đảm bảo thẻ không tuyên bố nhầm 'đã đầy đủ bằng chứng' có thể tự ngừng kiểm tra điều đó nếu câu chữ hiển thị trên thẻ đổi đi một chút, mà không ai nhận ra bài kiểm tra đã mất tác dụng.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/16 lỗi rơi vào file không bộ đo nào phủ (scripts/product-map.mjs, _acceptance/cong-nguoi-doc-du-nguon/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.