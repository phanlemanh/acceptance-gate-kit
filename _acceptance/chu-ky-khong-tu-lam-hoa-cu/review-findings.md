# Review Findings: chu-ky-khong-tu-lam-hoa-cu (round 5)

## Trong hợp đồng

### Hình dạng 3 — RB3 assert «1 ph 45 s» bỏ neo, quét trọn signoff.md trong khi thông điệp hứa về đoạn 7a-bis
- file: `tests/scripts/routing-baseline-t1.test.mjs:207`
- severity: low
- AC: AC-3
- source: measurement

Dòng 203-206 làm đúng nghi thức neo (lấy `a = indexOf('**7a-bis — bản ghi mốc')`, `b = indexOf('**7b — làn máy TRƯỚC chữ ký')`, kiểm neo rồi mới `assert.doesNotMatch(so.slice(a, b), /vài giây/)`). Dòng 207 kế bên bỏ neo: `assert.match(so, /1 ph 45 s/, 'bước 7a-bis phải nêu số đo thật của chính nó')` grep TRỌN tệp. Lời hứa trong thông điệp là quan hệ «con số nằm trong đoạn của bước 7a-bis»; phép đo là «chuỗi có mặt đâu đó trong tệp». Chuyển con số sang một ghi chú ở bước khác, hoặc viết lại 7a-bis không còn số, vẫn XANH. Cùng hình dạng ở dòng 209 (`assert.match(so, /git add …routing-baseline\.txt…/)` với thông điệp «7c phải đưa bản ghi mốc vào commit chữ ký» — cũng quét trọn tệp thay vì đoạn 7c). Finding này đã được ghi ở review-findings.md của lượt chấm 3 (mục Trong hợp đồng, AC-3) và vẫn còn nguyên ở HEAD.

AC-3 nêu đích danh yêu cầu «neo đoạn văn phải được kiểm trước khi assert đọc nó (neo trôi → assert hoá rỗng im lặng)»; assert «1 ph 45 s» grep trọn tệp không qua neo là đúng thất bại của điều khoản này, và chính finding ghi rõ đã được lượt chấm 3 xếp «Trong hợp đồng, AC-3» và vẫn còn nguyên ở HEAD.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Số đo phút MÁY trong commands/signoff.md viết tắt «1 ph 45 s» — né lớp lint LOP-PHUT thay vì đi đường khai miễn trừ**
  Người dùng thấy gì: Cách viết số đo thời gian trong hướng dẫn ký có thể khiến một công cụ rà soát khác của kit không nhận diện được, nên về sau nếu ai đó gõ lại số đo theo cách thường, công cụ đó có thể không cảnh báo đúng lúc.
  file: `commands/signoff.md`
  severity: medium
  Đề xuất: known-limits

- **RB2c "chiều im" là assertion chết — phép sửa tay là no-op**
  Người dùng thấy gì: Bài kiểm tra bảo vệ việc sửa tay hồ sơ của người khác không bị ghi đè thực ra chưa từng thử đúng tình huống đó, nên nếu sau này công cụ vô tình ghi đè lên sửa tay, sẽ không có cảnh báo nào bật lên.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: high
  Đề xuất: known-limits

- **E7 khai một chiều đỏ không tồn tại: executors.test.scripts không hề grep**
  Người dùng thấy gì: Báo cáo kết quả kiểm tra tự nhận đã xác minh hai bài kiểm cụ thể chạy thành công, nhưng thực chất chỉ kiểm tra bộ kiểm tra nói chung không lỗi — nếu hai bài đó bị bỏ sót âm thầm, báo cáo vẫn báo ổn.
  file: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **--skip-unchanged loại trừ trọn _acceptance/** nên bỏ qua cả khi chính định nghĩa phép đo đổi**
  Người dùng thấy gì: Khi người vận hành sửa chính định nghĩa của phép đo rút gọn, hệ thống có thể vẫn coi cây là không đổi và bỏ qua chạy lại — nghĩa là thay đổi định nghĩa đó chưa chắc được kiểm chứng ngay lập tức.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Regex verified_commit dùng \s* nên nuốt xuống dòng — nhánh «pin vắng» là mã chết, lý do in ra sai**
  Người dùng thấy gì: Khi một hồ sơ ký chưa có mã ghim, thông điệp giải thích lý do bỏ qua tính năng rút gọn có thể hiển thị sai và gây khó hiểu, dù hành vi an toàn của hệ thống (không bỏ qua) vẫn đúng.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — RB2c «chiều IM»: phép tiêm là NO-OP, assert thoái hoá thành «chuỗi có mặt»**
  Người dùng thấy gì: Bài kiểm tra bảo vệ việc sửa tay hồ sơ của người khác không bị ghi đè thực ra chưa từng thử đúng tình huống đó, nên nếu sau này công cụ vô tình ghi đè lên sửa tay, sẽ không có cảnh báo nào bật lên.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — E7: expected khai ghim hai chuỗi PASS, cmd chỉ đọc mã thoát của suite**
  Người dùng thấy gì: Báo cáo kết quả kiểm tra tự nhận đã xác minh hai bài kiểm cụ thể chạy thành công, nhưng thực chất chỉ kiểm tra bộ kiểm tra nói chung không lỗi — nếu hai bài đó bị bỏ sót âm thầm, báo cáo vẫn báo ổn.
  file: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 1 — RB2e tự xưng ROUND-TRIP nhưng đo bằng grep mã nguồn + một assert tautology**
  Người dùng thấy gì: Bài kiểm tra tự nhận đã xác minh hai nơi sinh dữ liệu dùng chung một nguồn logic, nhưng thực chất chỉ kiểm tra có dòng khai gọi nguồn đó, không kiểm tra logic có thật sự được dùng chung — nếu sau này logic bị tách ra hai bản riêng, sẽ không có cảnh báo.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — RB3-IM: chiều IM không chạy RB3, chỉ lặp lại một tautology chuỗi**
  Người dùng thấy gì: Bài kiểm tra tự nhận đã thử tình huống sửa văn bản ngoài phạm vi không ảnh hưởng, nhưng phép so sánh nó dùng không thể phát hiện sai lệch thật — nếu tính năng có lỗi đúng ở điểm này, bài kiểm tra sẽ không phát hiện.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — SK6 grep CHANGELOG bằng chuỗi đã có mặt ở cây gốc, không phân biệt được vòng này**
  Người dùng thấy gì: Bài kiểm tra xác nhận nhật ký thay đổi đã ghi lại đúng nội dung của vòng này, nhưng cụm từ nó tìm vốn đã có sẵn từ trước khi vòng này bắt đầu — nếu mục ghi chú của vòng này bị xoá nhầm, bài kiểm tra vẫn báo ổn.
  file: `tests/scripts/repin-lane-skip-unchanged.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — RB4/A2 tuyên quét «MỌI văn bản của kit» nhưng là danh sách 5 tệp gõ tay, thiếu SKILL.md**
  Người dùng thấy gì: Bài kiểm tra tự nhận rà soát toàn bộ tài liệu của kit để đảm bảo tên bước không lạc hậu, nhưng thực tế chỉ rà một danh sách tệp cố định, bỏ sót một tài liệu hướng dẫn quan trọng — nếu tên bước cũ còn sót lại đúng ở tài liệu đó, sẽ không bị phát hiện.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
