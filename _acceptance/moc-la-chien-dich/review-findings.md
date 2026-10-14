## Trong hợp đồng

- **Eval E7 ghim dòng «PASS: MC-6 ma-thoat» mà bộ kiểm không bao giờ in ra**
  file: `_acceptance/moc-la-chien-dich/evals.yaml:107`
  severity: medium
  AC: AC-7
  source: bugs
  detail: Phần expected của E7 (khối YAML gấp `>`, nối thành một dòng) đòi stdout có "PASS: MC-6 ma-thoat". Bộ kiểm chỉ in `ok('MC-7 ma-thoat', ...)`, tức dòng «PASS: MC-7 ma-thoat» (tests/scripts/moc-chien-dich.test.mjs:366). Đã chạy lại: đầu ra có «PASS: MC-7 ma-thoat», không có dòng MC-6 ma-thoat. Vì vậy E7 đòi một dòng không tồn tại. Hệ quả: hoặc lượt chấm đỏ oan, hoặc phần mã thoát của AC-7 (S0-MO-O-THOAT) không được ghim đúng dòng của nó. Lý do thuộc hợp đồng: E7 là phép đo của vế mã thoát bốn ca S0-MO-O-THOAT trong AC-7.

- **Eval E7 ghim dòng «PASS: MC-6 ma-thoat», nhưng tệp ca không bao giờ in dòng này (nó in «PASS: MC-7 ma-thoat»)**
  file: `_acceptance/moc-la-chien-dich/evals.yaml:107`
  severity: medium
  AC: AC-7
  source: measurement
  detail: Lỗi ghim cụ thể trong phép đo của vòng. Phần expected của E7 đòi stdout có «PASS: MC-6 ma-thoat». Ca mã thoát ở moc-chien-dich.test.mjs dòng 366 in `ok('MC-7 ma-thoat', …)`. Chạy `MC_CASES=MC-7,MC-6` thì stdout chỉ có «PASS: MC-7 ma-thoat», không có dòng nào khớp chuỗi E7 ghim. Theo luật chính evals.yaml đã khai («lệnh xanh mà thiếu dòng ghim là ĐỎ»), E7 sẽ đỏ dù vật đúng. Nếu bộ chấm khoan dung bỏ qua chỗ lệch, thì phép so mã thoát 0/1/2/3 với bộ máy gốc lại không được ghim ở eval nào. Cùng lỗi với mục trên: eval ghim sai dòng cho phép đo mã thoát của AC-7.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Suite plugins đỏ: tệp ca mới chép luật ngưỡng và chứa chữ «signed-off» mà không khai gạch (RT13, RT18)**
  Người dùng thấy gì: Bộ kiểm tra chung của kho báo đỏ vì tệp kiểm tra mới chưa được khai báo đúng chỗ. Tính năng chạy đúng nhưng mọi lượt chấm và kiểm tra tự động sau này đều đỏ cho tới khi có người khai báo hoặc sửa tệp đó.
  file: `tests/scripts/moc-chien-dich.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Khoá `loTrinhChuaKhai` luôn có mặt trong JSON quét, phá luật byte-bằng-bản-trước và làm đỏ DP2-11 khong-dot (CI gate.yml)**
  Người dùng thấy gì: Thông tin quét kho khi mở việc nay luôn có thêm một mục mới, kể cả ở kho đã khai lộ trình. Một bài kiểm tra của nhánh điều phối so với bản cũ nên báo đỏ ở bước kiểm tra tự động của kho.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: new-contract

- **MC-11 trong suite thường trực ghim dữ liệu sống của lộ trình kit: dọn sạch cờ hoặc dời mốc là suite đỏ**
  Người dùng thấy gì: Một bài kiểm tra gắn chặt vào kế hoạch hiện tại của kit. Khi mốc 05/11 được dời, đổi tên hoặc khi dọn hết hồ sơ ngoài kế hoạch, bài kiểm tra sẽ đỏ ở những thay đổi chẳng liên quan.
  file: `tests/scripts/moc-chien-dich.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ô cơ hội ghi hai mốc khác nhau: dòng «Mốc:» và dòng Timebox chọn mốc theo hai luật khác nhau**
  Người dùng thấy gì: Khi một việc thuộc hai mốc, ô cơ hội có thể ghi hai mốc khác nhau ở hai dòng. Người duyệt có thể thấy hai câu trả lời trái nhau về việc này thuộc mốc nào, nhưng chỉ xảy ra với việc nằm ở nhiều mốc.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **mocCuaHang coi mốc không có ngày là mốc «sớm nhất»: mốc chưa định ngày thắng mốc có ngày**
  Người dùng thấy gì: Nếu một việc thuộc cả mốc chưa có ngày lẫn mốc có ngày, phiên mở ra sẽ bị xếp vào mốc chưa có ngày. Phiên nằm sai nhóm ở thanh bên mà không có cảnh báo, chỉ với kho khai mốc kiểu này.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **tenNganMoc sinh nhóm có dấu cách đầu khi mốc chỉ có ngày, không có tên**
  Người dùng thấy gì: Với mốc chỉ có ngày mà không có tên, tên nhóm ở thanh bên bị thừa dấu cách đầu. Tên máy sinh có thể không khớp nhóm người gõ tay, nhưng chỉ ảnh hưởng thẩm mỹ.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (đo một cây khác thay vì cây đang kiểm): LT-06-mau / LT-99-mau kiểm trang mẫu trên bản sao đã TẮT hai cờ mới, không phải bộ máy được giao**
  Người dùng thấy gì: Các bài kiểm tra trang mẫu so với bản đã tắt hai cờ mới, nên chúng xanh dù trang mẫu đã commit khác trang công cụ vẽ ra hôm nay. Trang mẫu cho hội đồng đọc có thể không còn là thứ công cụ thật sinh ra.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/moc-la-chien-dich/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
