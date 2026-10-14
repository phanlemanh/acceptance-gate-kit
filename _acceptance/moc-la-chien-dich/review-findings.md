# Review findings: moc-la-chien-dich (round 3)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Executor E14 mới dùng reporter mặc định của node --test, nhưng expected lại ghim ký hiệu của reporter spec («✔», «ℹ fail 0»), lệch nếp TAP-cố-định của các executor dieu_phoi**
  Người dùng thấy gì: Phép kiểm tra cho mục «kho có khai lộ trình không bị thêm cờ» có thể báo đỏ nhầm khi chạy trên máy dùng phiên bản Node cũ hơn (như máy kiểm tự động của kho), dù tính năng vẫn chạy đúng. Người đọc kết quả cần biết một lần đỏ ở mục này chưa chắc là lỗi thật.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **E4 expected vẫn ghi «Kho thử có khai: khoá đó null» — trái với luật mới (khoá vắng hẳn) ngay trong cùng đoạn**
  Người dùng thấy gì: Phần mô tả kết quả mong đợi của một phép kiểm tra còn sót một câu cũ nói ngược với luật mới, nên người hay máy đọc lướt có thể hiểu nhầm kho có khai lộ trình phải nhận giá trị rỗng. Tính năng thật chạy đúng, chỉ chữ mô tả chưa sạch.
  file: `_acceptance/moc-la-chien-dich/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **LTT-san giờ đo trên bản sao đã tắt hai cờ mới, nên trang thật vượt ngưỡng độ dài 1/3 mà không ca nào bắt nữa (r2)**
  Người dùng thấy gì: Với kho có nhiều hồ sơ ngoài kế hoạch như crm, trang lộ trình sau bản này dài hơn nhiều so với lời hứa «gọn bằng một phần ba trang cũ», và kiểm thử không còn báo điều đó. Người quyết định cần chọn: chấp nhận trang dài hơn cho kho đông hồ sơ và ghi thành giới hạn đã biết, hay yêu cầu thu gọn các dòng cờ mới.
  file: `tests/scripts/xem-trang-lo-trinh.test.mjs`
  severity: high
  Đề xuất: known-limits

- **LTT-san now measures a copy with the new flags turned off, so the shipped page breaks the signed length promise and the check still passes (r2)**
  Người dùng thấy gì: Trang lộ trình mà kho thật nhận có thể dài hơn mức đã hứa với chủ kho, trong khi kiểm thử vẫn báo đạt vì đo trên bản đã tắt hai cảnh báo mới. Chủ kho cần biết điều này và quyết định chấp nhận hay yêu cầu rút gọn.
  file: `tests/scripts/xem-trang-lo-trinh.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 6 (đo cây khác thay vì cây đang kiểm): LTT-san, LTT-san-do và LTT-san-im giờ đo trên bản sao đã TẮT hai cờ mới, nên che mất việc trang thật vượt ngưỡng độ dài (r2)**
  Người dùng thấy gì: Không còn kiểm thử nào xem trang lộ trình thật, kèm hai cảnh báo mới, có bị dài quá hay vỡ bố cục hay không. Nếu trang lệch chuẩn thì người dùng chỉ phát hiện khi tự mở trang ra xem.
  file: `tests/scripts/xem-trang-lo-trinh.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay theo khuôn bên đọc): hình 'da-nghiem-thu' vẫn chép tay uat-session.md, trái với chú thích «không chép khuôn vào tệp này» của lượt sửa (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một hồ sơ mẫu dùng trong kiểm thử được viết tay thay vì lấy từ khuôn chung. Hiện không gây sai kết quả cho người dùng, chỉ có thể lệch nếu khuôn đổi sau này, nên chi phí sửa lớn hơn hậu quả.
  file: `tests/scripts/moc-chien-dich.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Suite plugins đỏ: tệp ca mới chép luật ngưỡng và chứa chữ «signed-off» mà không khai gạch (RT13, RT18) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ kiểm tra chung của kho báo đỏ vì tệp kiểm tra mới chưa được khai báo đúng chỗ. Tính năng chạy đúng nhưng mọi lượt chấm và kiểm tra tự động sau này đều đỏ cho tới khi có người khai báo hoặc sửa tệp đó.
  file: `tests/scripts/moc-chien-dich.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Khoá `loTrinhChuaKhai` luôn có mặt trong JSON quét, phá luật byte-bằng-bản-trước và làm đỏ DP2-11 khong-dot (CI gate.yml) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Thông tin quét kho khi mở việc nay luôn có thêm một mục mới, kể cả ở kho đã khai lộ trình. Một bài kiểm tra của nhánh điều phối so với bản cũ nên báo đỏ ở bước kiểm tra tự động của kho.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: new-contract

- **MC-11 trong suite thường trực ghim dữ liệu sống của lộ trình kit: dọn sạch cờ hoặc dời mốc là suite đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một bài kiểm tra gắn chặt vào kế hoạch hiện tại của kit. Khi mốc 05/11 được dời, đổi tên hoặc khi dọn hết hồ sơ ngoài kế hoạch, bài kiểm tra sẽ đỏ ở những thay đổi chẳng liên quan.
  file: `tests/scripts/moc-chien-dich.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ô cơ hội ghi hai mốc khác nhau: dòng «Mốc:» và dòng Timebox chọn mốc theo hai luật khác nhau (r1)**
  Người dùng thấy gì: Khi một việc thuộc hai mốc, ô cơ hội có thể ghi hai mốc khác nhau ở hai dòng. Người duyệt có thể thấy hai câu trả lời trái nhau về việc này thuộc mốc nào, nhưng chỉ xảy ra với việc nằm ở nhiều mốc.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **mocCuaHang coi mốc không có ngày là mốc «sớm nhất»: mốc chưa định ngày thắng mốc có ngày (r1)**
  Người dùng thấy gì: Nếu một việc thuộc cả mốc chưa có ngày lẫn mốc có ngày, phiên mở ra sẽ bị xếp vào mốc chưa có ngày. Phiên nằm sai nhóm ở thanh bên mà không có cảnh báo, chỉ với kho khai mốc kiểu này.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **tenNganMoc sinh nhóm có dấu cách đầu khi mốc chỉ có ngày, không có tên (r1)**
  Người dùng thấy gì: Với mốc chỉ có ngày mà không có tên, tên nhóm ở thanh bên bị thừa dấu cách đầu. Tên máy sinh có thể không khớp nhóm người gõ tay, nhưng chỉ ảnh hưởng thẩm mỹ.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (đo một cây khác thay vì cây đang kiểm): LT-06-mau / LT-99-mau kiểm trang mẫu trên bản sao đã TẮT hai cờ mới, không phải bộ máy được giao (r1)**
  Người dùng thấy gì: Các bài kiểm tra trang mẫu so với bản đã tắt hai cờ mới, nên chúng xanh dù trang mẫu đã commit khác trang công cụ vẽ ra hôm nay. Trang mẫu cho hội đồng đọc có thể không còn là thứ công cụ thật sinh ra.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, _acceptance/moc-la-chien-dich/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
