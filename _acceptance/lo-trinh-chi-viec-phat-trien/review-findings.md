# Review findings: lo-trinh-chi-viec-phat-trien (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Engine SKILL now quotes the judged crm sample's own cases, so the E9 judge can no longer tell a skill that generalises from one that memorised the sample**
  Người dùng thấy gì: Hướng dẫn cắt lượt đang dùng ví dụ lấy từ chính bản mẫu của crm dùng để chấm, nên một lần chấm đạt có thể chỉ cho thấy hướng dẫn chép đúng đáp án chứ chưa chứng minh nó dạy được cách cắt cho kho khác. Cần ghi rõ giới hạn này khi đọc kết quả chấm.
  file: `skills/cat-luot/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Rule 2 has the cutting session write the placeholder «chủ kho» into `ai`, which turns «owner unknown» into a value the check accepts, with nothing machine-held to flag it**
  Người dùng thấy gì: Khi phạm vi không nói ai làm việc vận hành, phiên cắt điền tạm «chủ kho» và nhờ người gộp PR sửa lại. Hệ thống không nhắc nếu người ấy quên, nên trang lộ trình có thể hiện một người phụ trách chưa ai thật sự nhận.
  file: `skills/cat-luot/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Two new red-side checks pin text that the failure message always contains, so they cannot show the failure has the intended cause**
  Người dùng thấy gì: Hai phép kiểm báo đỏ khi có lỗi, nhưng chỉ cho biết ca nào hỏng chứ không cho biết hỏng vì lý do đã định, nên một lỗi khác trong cùng ca cũng làm chúng đỏ giống hệt. Độ tin cậy của hai phép kiểm này thấp hơn vẻ ngoài.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): LT-169 tìm `mo_lai_khi` trong SKILL như một «trường răng đọc», nhưng răng không đọc trường này**
  Người dùng thấy gì: Hệ thống chỉ kiểm hướng dẫn có nhắc đến mốc mở lại của chân trời, không kiểm kết quả cắt có thật sự ghi mốc đó. Nếu phiên cắt bỏ trống hoặc ghi một mốc không tồn tại, không phép kiểm nào báo đỏ.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **A blank or null `dung_tren` entry gets blamed on an unrelated mốc ngoài that has no `ma` (r1)**
  Người dùng thấy gì: Khi một hàng trong lộ trình có chỗ «đứng trên» để trống, hệ thống vẫn báo lỗi nhưng có thể gán nhầm sang một việc vận hành không liên quan. Người cắt lộ trình có thể sửa sai chỗ, nhưng không có lỗi nào bị lọt qua.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **Two new red-side checks look only at exit code 1 and never pin the expected message (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai phép kiểm chỉ xác nhận «có báo đỏ» mà không xác nhận báo đỏ vì đúng lý do. Nếu sau này lỗi khác gây đỏ thay thế, phép kiểm vẫn xanh và không ai biết lỗi cũ đã mất.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **E6's written formula for the expected count is not what the LT-168 check computes (r1 · tệp đã đổi)**
  Người dùng thấy gì: Câu mô tả cách giám khảo tính số dòng cảnh báo thêm không khớp với cách phép đo thật tính. Hôm nay kết quả vẫn trùng nên không sai số liệu, nhưng giám khảo đọc công thức có thể hiểu lệch.
  file: `_acceptance/lo-trinh-chi-viec-phat-trien/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **A milestone of the current batch with a malformed `hang` passes with exit 0, and the skill's own classifier tells the session not to fix it (r1)**
  Người dùng thấy gì: Nếu phiên cắt lộ trình khai sai chỗ gắn việc cho một việc vận hành của đợt mình, hệ thống chỉ cảnh báo mờ và còn khuyên bỏ qua. Việc vận hành đó có thể mang ngày sai mà không ai bị chặn.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **An empty or null `dung_tren` entry is misreported as waiting on an operations milestone when any such milestone has no `ma` (r1)**
  Người dùng thấy gì: Một chỗ «đứng trên» để trống có thể bị báo thành đang chờ một việc vận hành chưa từng nhắc tới. Người đọc được chỉ sai hướng sửa, lỗi thật vẫn bị chặn.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — LT-171-do ghim «K2», chữ luôn có trong khuôn thông điệp lỗi (bảng phủ in đủ 11 mã) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm «bỏ một mã khỏi bảng phủ thì phải báo đỏ» dùng một chữ ghim luôn xuất hiện trong thông báo. Nó có thể xanh nhầm khi lỗi đến từ nguyên nhân khác, nên bằng chứng ít sắc hơn vẻ ngoài.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — LT-167 đối chứng «vào đợt» chỉ kết luận từ mã thoát 1, không ghim thông điệp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi chuyển các hàng sang đợt đang cắt, phép kiểm chỉ xác nhận hệ thống báo đỏ mà không xác nhận cả ba loại lỗi đều đỏ. Nếu một loại bị hạ xuống cảnh báo thì có thể không ai nhận ra.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
