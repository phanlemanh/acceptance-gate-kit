## Trong hợp đồng

Không có finding nào trong hợp đồng ở vòng này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **s4-args.mjs: vòng dò nhánh chính main/master/develop/trunk là mã chết — hụt nhánh đầu là exit 2 ngay**
  Người dùng thấy gì: Nếu chạy chấm điểm trên một nhánh chính không có tên 'main' (ví dụ 'master') và không có mạng để kiểm tra remote, bước chuẩn bị dữ liệu chấm sẽ dừng lại với lỗi ngay lập tức thay vì tự thử các tên nhánh khác như đã hứa, buộc người dùng phải tự khai nhánh bằng tay.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: new-contract

- **normInfra nuốt tín hiệu phân biệt của lane baseline: exit 127 «script feature chưa tồn tại ở commit gốc» thành n-a thay vì red**
  Người dùng thấy gì: Khi tính năng mới thêm hẳn một lệnh hoặc script chưa tồn tại ở phiên bản cũ (tình huống rất phổ biến), báo cáo bằng chứng có thể ghi nhầm thành 'không đo được' thay vì 'sai trên bản cũ' — làm mất loại bằng chứng so sánh trước/sau đáng tin nhất để người ký duyệt dựa vào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **Enum ba ngăn OOC vẫn có nguồn thứ hai: nhánh render của thẻ Cổng 2 gõ tay danh sách, không neo vào khối marker**
  Người dùng thấy gì: Nếu sau này có người thêm một lựa chọn phân loại mới cho nhóm việc ngoài hợp đồng, thẻ quyết định ở Cổng 2 có thể hiển thị nhầm dòng 'Máy chưa đề xuất hướng nào' cho lựa chọn đó thay vì tên thật, vì thẻ đang chép tay danh sách thay vì lấy từ nguồn chung.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Fallback nhánh chính trong s4-args.mjs là mã chết — `git()` gọi `die()`/`process.exit`, `catch` không bao giờ chạy**
  Người dùng thấy gì: Nếu chạy chấm điểm trên một nhánh chính không có tên 'main' và không có mạng để kiểm tra remote, bước chuẩn bị dữ liệu chấm sẽ dừng lại với lỗi ngay lập tức thay vì tự thử các tên nhánh khác như đã hứa, buộc người dùng phải tự khai nhánh bằng tay.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: new-contract

- **Lane baseline: exit 127 bị phân loại thành hạ tầng → mất tín hiệu «eval CÓ phân biệt» (red → n-a)**
  Người dùng thấy gì: Khi tính năng mới thêm hẳn một lệnh hoặc script chưa tồn tại ở phiên bản cũ, báo cáo bằng chứng có thể ghi nhầm thành 'không đo được' thay vì 'sai trên bản cũ' — làm mất loại bằng chứng so sánh trước/sau đáng tin nhất để người ký duyệt dựa vào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **round-tally-read.mjs: dòng tally hỏng JSON bị bỏ im lặng với exit 0 — đúng thứ file này hứa không để xảy ra**
  Người dùng thấy gì: Nếu một dòng ghi nhận kết quả vòng chấm bị lỗi giữa chừng (ví dụ tiến trình bị dừng đột ngột), hệ thống đếm số vòng có thể âm thầm bỏ qua dòng đó mà không báo lỗi, khiến số liệu tổng kết bị thiếu trong khi vẫn trông như đang chạy bình thường.
  file: `feature-loop/scripts/round-tally-read.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: chiều đỏ của vế 7 kết luận từ «exit khác 0», và cái chết là HẠ TẦNG chứ không phải đột biến**
  Người dùng thấy gì: Phép kiểm tra tự động cho việc tính đúng 'điểm mốc so sánh' của bước chuẩn bị dữ liệu chấm hiện chưa thực sự chứng minh được điều đó — nếu logic này bị hỏng trong tương lai, bộ kiểm tra vẫn có thể báo 'đạt' một cách nhầm lẫn.
  file: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh`
  severity: high
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» thay cho QUAN HỆ: mutant LP4 không làm ĐỎ assert nào của LP3 — nó chỉ tự kiểm chính phép tiêm**
  Người dùng thấy gì: Phép kiểm tra chống rò rỉ đường dẫn thư mục giữa hai luồng chấm điểm hiện chưa thực sự bắt được lỗi rò rỉ nếu nó xảy ra theo một cách viết mã hơi khác — một dạng lỗi này có thể lọt qua trong tương lai mà không ai phát hiện.
  file: `tests/workflows/lane-pin.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» thay cho QUAN HỆ: chiều đỏ RS6 là hằng-đúng — nguồn đột biến không bao giờ được chạy**
  Người dùng thấy gì: Phép kiểm tra đảm bảo 'danh sách lựa chọn phân loại chỉ có một nguồn duy nhất' hiện chưa thực sự chạy qua đường xử lý thật của hệ thống, nên nếu sau này có ai chép tay lại danh sách này ở một nơi khác, phép kiểm tra sẽ không phát hiện ra.
  file: `tests/workflows/round-signal.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case: RS2 tự xưng «TOÀN PHẦN / MỌI đường» nhưng chốt bằng ngưỡng sàn `sites >= 2` và một danh sách gõ tay**
  Người dùng thấy gì: Phép kiểm tra 'mọi nơi sinh ra dòng ghi nhận kết quả vòng chấm đều được kiểm tra' hiện chỉ đếm đủ số lượng tối thiểu, nên nếu sau này có ai thêm một nơi sinh dòng mới, phép kiểm tra có thể không phát hiện ra nơi đó chưa được kiểm chứng.
  file: `tests/workflows/round-signal.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Fixture VIẾT TAY đúng khuôn bên đọc: run-log của ca carry được printf theo bộ lọc của carry-plan, không round-trip từ writer thật**
  Người dùng thấy gì: Bài kiểm tra chức năng 'mang kết quả cũ sang vòng chấm mới' hiện dùng dữ liệu mẫu tự soạn tay thay vì dữ liệu do chính hệ thống sinh ra, nên nếu định dạng dữ liệu thật thay đổi sau này, chức năng có thể âm thầm ngừng hoạt động mà bài kiểm tra vẫn báo đạt.
  file: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: chiều đỏ (b) của skill-khong-fallback chèn đúng chuỗi mình sắp grep**
  Người dùng thấy gì: Phép kiểm tra đảm bảo tài liệu hướng dẫn không còn công thức soạn tay cũ hiện chưa thực sự chứng minh được điều đó một cách chắc chắn, vì cách kiểm tra có thể luôn báo đạt bất kể nội dung thực tế thay đổi ra sao.
  file: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/12 lỗi rơi vào file không bộ đo nào phủ (feature-loop/scripts/round-tally-read.mjs, _acceptance/cham-dung-cay-dung-cho-dung/rang.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.