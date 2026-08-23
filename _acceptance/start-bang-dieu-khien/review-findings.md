## Trong hợp đồng

- **«Vừa xong» giao việc XẾP THỨ TỰ cho model — máy quét không sort done[]**
  file: `scripts/start-scan.mjs:387`
  severity: medium
  AC: AC-4
  commands/start.md:141 dặn «in **5 việc** có `at` mới nhất (`groups.done`, xếp `at` giảm dần)», nhưng start-scan.mjs sort gates[] (dòng 381), vetoOpen[] (386), considering[] (387) mà KHÔNG sort done[]. Chạy thật trên cây này: `done: 57` phần tử, năm `at` đầu ra là 2026-08-14, 2026-08-06, 2026-08-14, 2026-08-16, 2026-07-29 — thứ tự readdir, không phải thứ tự thời gian. Vậy việc chọn «5 việc mới nhất» trong 57 mốc rơi hết vào model, đúng thứ hồ sơ này sinh ra để chấm dứt: máy quét là bộ PHÂN Ô duy nhất, thân lệnh in NGUYÊN VĂN. Trớ trêu là chính diff này vừa sửa luật sort cho gates[] (mốc rỗng xếp cuối) vì «thẻ in một thứ tự không mang tin» — cùng lớp lỗi, để sót ở đúng mảng vừa được thêm khoá `at`. Phép đo cũng không bắt được: BDK1 (tests/plugins/bang-dieu-khien.test.mjs:120-126) chỉ grep câu chỉ dẫn trong start.md, không đo ĐẦU RA của máy quét — đúng hình dạng (1) của «Thước phải gắn vào vật được giao» trong CLAUDE.md. Sửa theo nếp có sẵn: thêm `done.sort` theo `at` giảm dần với null xếp cuối, cạnh ba sort kia, rồi đổi start.md thành «lấy 5 phần tử ĐẦU».

- **vetoOpen lệch vị từ của lưới trước-merge ở hồ sơ có contract hỏng**
  file: `scripts/start-scan.mjs:248`
  severity: low
  AC: AC-5
  Chú thích ngay trên khai «Hỏi ĐÚNG câu lưới trước-merge hỏi: mọi contract.md có `veto_state: mo`, BẤT KỂ status». Thực tế `vetoOpen.push` đứng SAU `if (statusProblem) { pushHong(...); continue; }` (dòng 245-246), nên hồ sơ có cửa veto mở mà `status` hỏng/vắng thì biến mất khỏi vetoOpen. Lưới ở scripts/pre-merge-check.sh:1186-1194 chỉ đòi tồn tại contract.md rồi đọc thẳng veto_state — nó VẪN đếm. Kiểm bằng fixture code-sinh: hai hồ sơ `veto_state: mo` (một `status: khong-biet`, một thiếu `status`) cho `vetoOpen: []` trong khi lưới cộng cả hai. Hệ quả đúng bằng lớp lỗi hồ sơ này sinh ra để giết — «thẻ đếm 2 trong khi lưới đếm 16» — chỉ ở góc khác: /start và /acceptance-status nêu tên hồ sơ còn veto được, và veto-default chỉ sống nếu owner THẤY TÊN. Răng `rang-bdk.sh --chan veto-ten` không phân biệt được vì nó so đẳng thức trên cây thật, nơi `broken` đang là 0; cần một fixture code-sinh có contract hỏng + veto_state mo để phép đo có chiều đỏ.

- **Chiều đỏ đã khai KHÔNG thể đỏ (hình 3/4) — assert `/cũ nhất|chưa rõ tuổi/` được thoả sẵn bởi câu CŨ**
  file: `tests/plugins/vao-co-o.test.mjs:174`
  severity: high
  AC: AC-2
  VC6 thêm `['tuổi (cũ nhất hoặc chưa rõ tuổi)', /cũ nhất|chưa rõ tuổi/]` để đo mệnh đề MỚI của khối START-CAN-NHAC. Nhưng khối start.md giữ nguyên câu cũ «Đang cân nhắc: N ý · cũ nhất X ngày» (commands/start.md:64), nên vế trái của alternation luôn khớp: gỡ sạch câu «chưa rõ tuổi» khỏi start.md thì assert này VẪN XANH. evals.yaml E14 ③ khai đúng ngược lại — «thân start.md dặn nói «chưa rõ tuổi» khi ageTied bật», chiều đỏ «bản sao gỡ câu «chưa rõ tuổi» khỏi start.md → đỏ ở ③». Đã grep toàn bộ tests/ + rang-bdk.sh: không assert nào khác ghim chuỗi «chưa rõ tuổi» (chân `sort-tuoi` chỉ đo `ageTied` phía JSON, không chạm start.md). Nghĩa là nhánh ③ của E14 chưa bao giờ có thước.

- **Đo CHỈ DẪN thay vì ĐẦU RA (hình 1) — bộ đọc acceptance-status được đếm là 1 trong «3/3 bộ đọc» nhưng chỉ đo bằng hai lệnh grep tĩnh trên file hướng dẫn**
  file: `_acceptance/start-bang-dieu-khien/rang-bdk.sh:257`
  severity: medium
  AC: AC-8
  Chân `bon-bo-doc` tuyên «sach+veto-mo: 0/3 bo doc co vi tu moi ky; pha vat that: 3/3 moi ky» (dòng 296) và E8 khai ba bộ đọc có vị từ là «máy quét · thẻ cổng · acceptance-status». Nhưng bộ đọc acceptance-status chỉ được đo bằng `grep -q 'STATUS-NHAN' "$ROOT/commands/acceptance-status.md"` và `grep -q 'start-scan.mjs' ...` (dòng 257-258) — hai chuỗi trong file CHỈ DẪN của cây thật, không phụ thuộc fixture `$D`, không sinh ra đầu ra nào để soi. Nặng hơn: ở nhánh ĐỐI CHỨNG DƯƠNG (đặt `bypass_used: true`, dòng 263-273) không có một assert nào cho acceptance-status cả — chỉ ST2 (máy quét), HC (thẻ) và MAP2 (bản đồ). Vậy con số «3/3» thực tế chỉ có 2 bộ đọc được chạy trên fixture ở cả hai chiều; nhánh thứ ba là văn bản tĩnh một chiều.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **gate-card: slug rơi vào broken[] thì im lặng quay về lối cũ, không cờ vàng**
  Người dùng thấy gì: Khi một hồ sơ có lỗi dữ liệu ẩn mà không rơi vào nhóm sạch nào, thẻ ký vẫn hiển thị như bình thường — nút Ký duyệt vẫn hiện — mà không có cảnh báo cho owner biết máy chưa xác định được trạng thái thật của hồ sơ này.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **ngayXong() dates UAT-closed records by their Gate-2 signoff, not the UAT verdict — «Vừa xong» list shows/orders the wrong day**
  Người dùng thấy gì: Với một vòng đã kết thúc bằng phiên nghiệm thu, mục «Vừa xong» ghi theo ngày của lần ký hợp đồng trước đó thay vì ngày thật sự kết thúc gần đây, nên một việc vừa xong hôm nay có thể bị xếp như đã cũ nhiều tháng và rơi khỏi danh sách việc vừa làm.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: new-contract

- **acceptance-card.md now unconditionally tells the model to print the signoff command, contradicting the new no-sign card**
  Người dùng thấy gì: Với một số hồ sơ mà máy đã tự đi tiếp và không cần ký, thẻ có thể vẫn in ra hướng dẫn owner gõ lệnh ký duyệt ngay bên dưới — mâu thuẫn với chính thông báo phía trên rằng hồ sơ này không có nút ký.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: new-contract

- **ngayXong swallows non-ENOENT read errors on evidence-report.md, against the file's own stated doctrine**
  Người dùng thấy gì: Nếu việc đọc hồ sơ bằng chứng gặp trục trặc bất thường (không phải do thiếu file), máy âm thầm bỏ qua lỗi đó và hiển thị ngày sai hoặc bỏ trống, thay vì báo cho owner biết có điều gì đó không đọc được.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **gate-card.js now shells out to git on every Gate-2 card, invalidating its documented purity invariant**
  Người dùng thấy gì: Một ghi chú kỹ thuật trong mã nguồn nói thẻ không chạm vào git đã trở nên lỗi thời so với cách nó vận hành thật — không ảnh hưởng gì tới những gì owner thấy trên thẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **`implemented` + verdict PASS/PENDING-JUDGMENT is labelled «code xong, chưa ai chấm» although the machine has graded it**
  Người dùng thấy gì: Với một hồ sơ mà máy đã chấm xong và đạt, thẻ vẫn có thể ghi nhãn như thể chưa ai chấm — chữ hiển thị không khớp thực tế, dù việc owner cần làm tiếp theo không đổi.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **Assert "chuỗi có mặt" trong khi lời hứa là QUAN HỆ tập hợp (hình 3) — BDK4 ghim hằng `FILES.length !== 16` thay vì kiểm ba thân cổng có nằm trong vũ trụ quét**
  Người dùng thấy gì: Cách kiểm tra tự động cho việc ba lệnh in ra đúng dạng bấm được có một lỗ hổng: nó vẫn có thể báo đạt ngay cả khi một trong ba lệnh đó không còn thật sự được kiểm tra, khiến owner khó biết chắc lời hứa này còn đứng vững.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Assertion trên vũ trụ LUÔN RỖNG, không đối chứng dương (hình 4) — allowlist STATUS-NHAN chạy 0 vòng lặp**
  Người dùng thấy gì: Bài kiểm tra cho việc thẻ không tự chế nhãn hiện đang kiểm một vùng luôn trống, nên quy tắc này chưa thật sự được xác nhận qua chạy máy — nếu sau này có ai vô tình thêm nhãn tự chế, bài kiểm tra sẽ không phát hiện ra.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case (hình 5) — round-trip «máy quét rút chữ TỪ bảng» chỉ chạm 6/20 khoá**
  Người dùng thấy gì: Việc bảo đảm mọi trạng thái hồ sơ đều hiện đúng cùng một chữ ở mọi nơi mới được kiểm chứng trên một phần nhỏ các trạng thái có thể xảy ra — phần lớn còn lại vẫn có nguy cơ hiện chữ lệch nhau mà chưa được phát hiện.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phép đo không thể đỏ (hình 4) — «0 lượt gọi mạng» đo bằng đồng hồ với remote là ĐƯỜNG DẪN CỤC BỘ**
  Người dùng thấy gì: Lời hứa rằng máy không gọi mạng khi tính vị trí so với bản chung hiện chưa có cách kiểm tra đáng tin cậy — phép thử hiện tại không phân biệt được «không gọi mạng» với «gọi mạng nhưng thất bại ngay», nên một lượt gọi mạng ẩn vẫn có thể lọt qua mà không bị phát hiện.
  file: `_acceptance/start-bang-dieu-khien/rang-bdk.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 5/14 lỗi rơi vào file không bộ đo nào phủ (tests/plugins/bang-dieu-khien.test.mjs, _acceptance/start-bang-dieu-khien/rang-bdk.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
