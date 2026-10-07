# Review findings — lenh-dai-chay-rieng (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **VP1 requires the workflow to match tag v2.24.0 exactly, so any later prompt change turns the suite red**
  Người dùng thấy gì: Sau này ai sửa lời dặn của bước chấm, dù không liên quan lệnh chạy dài, cũng sẽ bị bộ kiểm tra báo đỏ và phải tự gỡ phép so sánh này trước khi gộp.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **The wait command has no upper limit when the start file is missing (and may read a stale finish file from an earlier attempt)**
  Người dùng thấy gì: Nếu tác tử chấm bỏ qua bước khởi chạy hoặc bước đó hỏng, lượt chấm có thể chờ mãi không có hạn chót, hoặc đọc nhầm kết quả của lần chạy trước.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **s4-args now runs the full repin-lane key check, so a bad repin-only key stops S4 in every consumer repo**
  Người dùng thấy gì: Kho nào có một cài đặt sai ở phần ghim lại hồ sơ, dù lượt chấm không dùng tới, nay sẽ bị dừng ngay khi chuẩn bị chấm, trong khi trước đây vẫn chạy được.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **A long command can pass while it is still running: the 'not finished' and 'over time' end lines are never checked by the workflow, so the verifier's own claim of exit 0 wins**
  Người dùng thấy gì: Một lệnh dài còn đang chạy hoặc đã quá hạn vẫn có thể bị ghi là đạt nếu tác tử chấm dừng chờ sớm rồi tự báo thành công, nên màu xanh lúc đó chưa chắc đáng tin.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 — fixture VIẾT TAY đúng khuôn bên đọc: hai khoá mới longRunning / evalsChayRieng không có ca round-trip từ s4-args vào workflow**
  Người dùng thấy gì: Nếu sau này đổi tên một cài đặt ở một đầu mà quên đầu kia, các bài kiểm tra vẫn xanh trong khi tính năng chạy dài và chạy riêng lặng lẽ không bật.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ LN4 không ghim thông điệp: phép HOẶC nhận đỏ ở biến thể bất kỳ trong khi lời hứa chỉ nói «khi chưa xong»**
  Người dùng thấy gì: Bài kiểm tra chống dấu hiệu giả có thể báo đã bắt được lỗi ngay cả khi chỉ bắt được một trong hai trường hợp, nên độ tin cậy của nó thấp hơn lời mô tả.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: low
  Đề xuất: known-limits

- **VP1 ties the current workflow to v2.24.0 byte for byte, so the next legitimate workflow change will fail CI (r1)**
  Người dùng thấy gì: Phép so sánh bản chấm hiện tại với bản 2.24.0 sẽ báo đỏ ở lần sửa bước chấm kế tiếp dù sửa đúng. Người phát hành lần sau sẽ phải dời mốc so sánh trước khi gộp, nếu không sẽ tưởng đó là lỗi thật.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **S4 args now stops on invalid repin_* keys unrelated to S4; CHANGELOG says only model_evals and claims 'khoá vắng = như 2.24.0' (r1)**
  Người dùng thấy gì: Kho nào khai sai một giá trị của lối ghim lại (dù không dùng tính năng mới) sẽ bị chặn ngay ở bước chấm, trong khi bản trước vẫn chạy được. Ghi chú phát hành đang nói là không có gì đổi cho kho không khai khoá mới, nên người nâng cấp có thể bị bất ngờ.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **A background long command left running by an aborted attempt can hand its old exit code to the same-round retry (r1)**
  Người dùng thấy gì: Khi một lượt chấm bị đứt giữa chừng rồi chấm lại, lệnh dài của lượt cũ có thể vẫn chạy ngầm và đưa kết quả cũ cho lượt mới. Kết quả đạt hoặc trượt có thể lấy từ lần chạy sai mà không có cảnh báo nào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **s4-args now stops S4 when any unrelated re-pin config key is invalid (r1)**
  Người dùng thấy gì: Một giá trị sai ở cấu hình ghim lại, vốn không liên quan tới lượt chấm, nay làm lượt chấm dừng ngay từ đầu ở mọi kho. Người dùng phải sửa cấu hình ấy mới chấm tiếp được.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **The over-time branch sends SIGTERM only and never checks that the tree died before the prompt says it was stopped (r1)**
  Người dùng thấy gì: Nếu lệnh dài là loại tự xử lý tín hiệu dừng, nó có thể vẫn chạy khi kit đã báo là dừng. Lệnh nặng kế tiếp sẽ chạy chồng lên nó và có thể gây lại chính lỗi tranh tài nguyên mà vòng này muốn tránh.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — đo CHỈ DẪN thay vì ĐẦU RA: luật TOOL-KILL mới (AC-4) chỉ được chấm trên tệp luật, không ca nào kiểm luật có tới prompt của lane lệnh dài (r1)**
  Người dùng thấy gì: Quy tắc dặn người chấm không coi lệnh bị đẩy nền là bị giết chỉ được kiểm trên tài liệu. Nếu quy tắc ấy vô tình bị gỡ khỏi lời dặn thật của bước chấm lệnh dài thì không phép đo nào báo, và lỗi chấm nhầm cũ có thể quay lại.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — thông điệp được ghim nhưng gộp hai điều kiện: LN3 «dấu giả kết thúc chờ» không phân biệt được «đọc mã 0» với «BLOCKED» (r1)**
  Người dùng thấy gì: Phép thử bắt lỗi đọc nhầm dấu kết thúc giả có thể báo đỏ vì một lý do khác với lý do ta muốn bắt. Kết quả thật hôm nay vẫn đúng, nhưng phép thử chưa khoá chặt điều đó.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: args longRunning/evalsChayRieng của bên ĐỌC không rút từ bên VIẾT s4-args (r1)**
  Người dùng thấy gì: Phía sinh tham số và phía đọc tham số được thử riêng, chỉ khớp nhau vì cùng một người gõ cùng tên khoá. Nếu sau này một bên đổi tên khoá mà bên kia không đổi theo, các phép thử vẫn xanh nhưng tính năng sẽ hỏng.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
