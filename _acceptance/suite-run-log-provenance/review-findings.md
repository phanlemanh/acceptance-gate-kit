## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Seam LLM-viết→máy-đọc: hai bộ đọc mới chỉ có fixture VIẾT TAY, không round-trip từ marker SUITE-BLOCK-TEMPLATE**
  Người dùng thấy gì: Nếu sau này ai đó đổi cách trình bày phần kết quả của lệnh kiểm tra tổng thể trong bản chấm, các bài tự kiểm liên quan có thể không phát hiện ra vì chúng dùng dữ liệu mẫu tự đánh máy theo hình dạng cũ thay vì lấy từ đúng khuôn đang dùng — rủi ro là lỗi gán nhầm kết quả có thể quay lại mà không ai được cảnh báo.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Quét lớp hụt một bộ đọc: scripts/acceptance-gold.mjs không nhận nhánh đóng-khối, và lời khai «đây là bộ đọc cuối» không có phép đo nào giữ**
  Người dùng thấy gì: Có một nơi khác trong hệ thống đọc cùng loại dữ liệu nhưng chưa được trang bị cách phòng lỗi giống hai nơi kia; hiện tại nó chưa hiển thị sai vì nó không dùng tới phần dữ liệu liên quan, nhưng nếu sau này có người thêm dữ liệu mới vào đó thì nơi này có thể hiển thị nhầm kết quả của lệnh kiểm tra tổng thể thành kết quả của một tiêu chí, mà không có cảnh báo nào.
  file: `scripts/evidence-page.js`
  severity: low
  Đề xuất: known-limits

- **tenSuite bỏ mất tên script của `yarn run <script>` — mọi lệnh yarn đều đúc tên `SUITE-run`**
  Người dùng thấy gì: Với một cách viết lệnh bằng yarn cụ thể (dạng có thêm chữ 'run'), tên hiển thị trong sổ theo dõi bị rút gọn sai thành chữ 'run' thay vì tên thật của lệnh. Hai lệnh khác nhau vẫn không bị lẫn kết quả với nhau, chỉ là người đọc sổ khó nhận ra lệnh nào ứng với dòng nào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **`cmp -s` trả 2 (không so được) bị đọc thành «tiêm đổi được nội dung» — chân bảo vệ mù với ca CHƯA-BAO-GIỜ-CHẠY**
  Người dùng thấy gì: Đây là lỗi trong công cụ tự kiểm nội bộ dùng để thử nghiệm, không phải trong tính năng đưa tới người dùng: ở một tình huống hiếm khi bước dựng bản sao để thử lỗi bị hỏng hoàn toàn, công cụ có thể báo nhầm là 'đã thử lỗi thành công' dù chưa thử được gì. Bước kiểm kế tiếp vẫn phát hiện ra vấn đề nên kết luận cuối cùng không sai, chỉ là dấu vết kiểm tra ở bước này không đáng tin.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture khối LỆNH SUITE viết tay đúng khuôn bên ĐỌC, không round-trip từ SUITE-BLOCK-TEMPLATE**
  Người dùng thấy gì: Nếu sau này bản mẫu báo cáo về phần kết quả của lệnh kiểm tra tổng thể bị thay đổi hình dạng, một số bài tự kiểm sẽ không nhận ra vì chúng vẫn tự dựng lại dữ liệu mẫu theo hình dạng cũ thay vì theo đúng bản mẫu hiện hành — nguy cơ lỗi gán nhầm kết quả quay lại mà không bị phát hiện.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Họ hàng hình dạng 6 — lưới chống-trôi của ban_sao dùng DANH SÁCH FILE TAY, nên chiều đỏ chấm cây HEAD chứ không cây đang sửa**
  Người dùng thấy gì: Đây là hạn chế đã được biết trước và owner đã chấp nhận khi ký: công cụ tự kiểm nội bộ chỉ theo dõi một danh sách tệp liên quan được liệt kê sẵn bằng tay. Nếu sau này có thêm tệp mới mà quên bổ sung vào danh sách, công cụ sẽ không phát hiện thay đổi chưa lưu ở tệp đó — đây là hạn chế của quy trình tự kiểm nội bộ, không phải lỗi của tính năng gửi tới người dùng.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).