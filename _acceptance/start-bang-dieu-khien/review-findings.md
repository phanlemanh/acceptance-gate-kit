Ghi chú: cả 14 eval (E1–E14) trong hồ sơ này đều thuộc executor `test`/`script` — không eval nào là `judgment`, nên vòng này không có judge panel nào để đề xuất; không có mục UNCERTAIN nào cần `human_override`.

## Trong hợp đồng

(không có finding nào map được vào AC — mọi finding sống của vòng verify này đều rơi ngoài phạm vi 12 AC đã ký.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Cùng một ánh xạ verdict→stateKey được viết HAI lần, hai hình dạng khác nhau, cách nhau 15 dòng**
  Người dùng thấy gì: Nếu sau này hệ thống có thêm một loại kết quả chấm mới, thẻ có thể hiển thị hai câu trạng thái khác nhau cho cùng một việc tuỳ giai đoạn hồ sơ — chưa xảy ra hôm nay nhưng có thể xảy ra trong tương lai.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **veto_state đọc bằng tay thay vì qua `vetoGateState()` của lib/evidence-core.cjs**
  Người dùng thấy gì: Nếu sau này luật nhận diện 'veto đang mở' thay đổi ở một nơi khác trong hệ thống, thẻ ở đây có thể không cập nhật theo và đếm sai số hồ sơ còn veto được — chưa xảy ra hôm nay.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **`ngayXong` nuốt lỗi IO không-phải-ENOENT, trái luật đọc hồ sơ khai ngay đầu file**
  Người dùng thấy gì: Trong một số trường hợp lỗi hệ thống hiếm gặp khi đọc báo cáo bằng chứng, thẻ có thể lặng lẽ hiện một ngày 'vừa xong' không chính xác mà không có cảnh báo nào cho owner biết dữ liệu đó không đáng tin.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Comment ở config.yaml khai «răng chết theo hồ sơ khi merge» — tiền lệ trong chính file nói ngược lại**
  Người dùng thấy gì: Các bài kiểm của những hồ sơ đã xong không tự dọn đi như ghi chú mô tả — theo thời gian bộ kiểm tự động sẽ phình to hơn, nhưng không ảnh hưởng tới thẻ /start mà owner đang xem.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **ngayXong() dates UAT-closed records by the Gate-2 signoff, never by the UAT verdict**
  Người dùng thấy gì: Với một việc vừa được nghiệm thu (release/iterate/kill), ngày 'vừa xong' trên thẻ hiện là ngày Cổng Bằng chứng ký trước đó, không phải ngày quyết định thật gần đây nhất — việc mới đóng hôm nay có thể bị thẻ xếp như đã cũ nhiều tháng và rơi khỏi danh sách 'vừa xong'.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: new-contract

- **ngayXong() presents the Worth-Gate decision date as a completion date**
  Người dùng thấy gì: Với các việc máy đang tự làm tiếp mà chưa cần người ký, ngày 'vừa xong' trên thẻ có thể là ngày cơ hội này được duyệt bắt đầu (có khi từ rất lâu), chứ không phải ngày việc đó thật sự có tiến triển gần đây.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: new-contract

- **gate-card falls back to the sign-inviting card with no flag when the scanner puts the slug in broken[]**
  Người dùng thấy gì: Khi một hồ sơ có trạng thái không nhận dạng được (ví dụ do gõ sai chính tả), thẻ ký duyệt vẫn hiện đầy đủ nút 'Ký duyệt' như hồ sơ bình thường, không cảnh báo gì cho owner biết dữ liệu phía sau có thể sai — hạn chế này đã được biết trước và cố ý chưa sửa trong đợt này.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **ngayXong() swallows non-ENOENT read errors on evidence-report.md**
  Người dùng thấy gì: Trong một số trường hợp lỗi hệ thống hiếm gặp, thẻ có thể lặng lẽ hiện sai ngày 'vừa xong' cho một việc mà không có dấu hiệu nào báo dữ liệu đó không chắc chắn.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **acceptance-card.md unconditionally tells the model to print the signoff command, contradicting the no-sign card**
  Người dùng thấy gì: Với một số hồ sơ, thẻ vừa nói 'không có nút ký cho trạng thái này' vừa đưa ngay lệnh ký ở dòng ngay dưới — hai câu mâu thuẫn nhau khiến owner có thể bấm nhầm lệnh ký cho một việc chưa sẵn sàng để ký.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: new-contract

- **implemented + PASS/PENDING-JUDGMENT is labelled "code xong, chưa ai chấm"**
  Người dùng thấy gì: Trong một khoảng thời gian ngắn giữa lúc máy chấm xong và lúc hồ sơ chính thức cập nhật, thẻ có thể vẫn ghi 'chưa ai chấm' dù thực ra đã có kết quả chấm — có thể gây hiểu lầm nhỏ, thoáng qua về tiến độ.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **BDK4 pins the string "FILES.length !== 16" instead of asserting the three gate bodies are in the scan universe**
  Người dùng thấy gì: Nếu sau này có người vô tình bỏ sót một trong ba lệnh cổng khỏi phạm vi được kiểm tự động, hệ thống kiểm sẽ không phát hiện ra — lỗi có thể âm thầm lọt qua cho tới khi owner tự nhận ra trên thẻ.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: low
  Đề xuất: known-limits

- **BDK2's STATUS-NHAN allowlist assertion iterates over an empty list**
  Người dùng thấy gì: Bộ kiểm nhãn trạng thái hiện không có gì để kiểm nên sẽ không phát hiện nếu sau này có một nhãn trạng thái bịa xuất hiện trên thẻ — rủi ro chữ sai lọt qua mà không bị chặn lại.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» cho một lời hứa là QUAN HỆ thứ tự (done[] xếp theo `at`)**
  Người dùng thấy gì: Nếu về sau máy quét vô tình sắp xếp sai thứ tự các việc 'vừa xong', không có phép kiểm tự động nào phát hiện — thẻ có thể liệt kê việc cũ lẫn vào mục 'vừa xong' mà không ai nhận ra ngay.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP («rút MỌI nhãn ứng viên») nhưng vòng lặp chạy trên tập RỖNG**
  Người dùng thấy gì: Bộ kiểm nhãn hiện không thực sự quét được nội dung nào, nên nếu sau này có nhãn trạng thái tự chế xuất hiện ở một chỗ khác trên thẻ, hệ thống sẽ không cảnh báo.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert chuỗi `FILES.length !== 16` trong file test khác thay cho quan hệ THÀNH VIÊN của ba thân cổng**
  Người dùng thấy gì: Nếu sau này có người vô tình bỏ một trong ba lệnh cổng ra khỏi phạm vi được kiểm, hệ thống kiểm sẽ không phát hiện — lệnh đó có thể quay lại dạng chữ không bấm được mà không ai biết.
  file: `tests/plugins/bang-dieu-khien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — grep một TỪ («thước») cho một mệnh đề ràng buộc**
  Người dùng thấy gì: Bộ kiểm luật 'chỉ xếp hạng khi có thước' hiện chỉ tìm từ 'thước' xuất hiện đâu đó trong đoạn, nên nếu sau này ai viết nhầm câu theo hướng ngược lại, hệ thống kiểm vẫn báo qua — rủi ro luật bị đảo ngược mà không bị phát hiện.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có mục nào — mọi finding trên đã qua refuter.)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
