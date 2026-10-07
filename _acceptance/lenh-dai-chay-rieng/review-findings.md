# Review findings — lenh-dai-chay-rieng (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **VP1 ties the current workflow to v2.24.0 byte for byte, so the next legitimate workflow change will fail CI**
  Người dùng thấy gì: Phép so sánh bản chấm hiện tại với bản 2.24.0 sẽ báo đỏ ở lần sửa bước chấm kế tiếp dù sửa đúng. Người phát hành lần sau sẽ phải dời mốc so sánh trước khi gộp, nếu không sẽ tưởng đó là lỗi thật.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **S4 args now stops on invalid repin_* keys unrelated to S4; CHANGELOG says only model_evals and claims 'khoá vắng = như 2.24.0'**
  Người dùng thấy gì: Kho nào khai sai một giá trị của lối ghim lại (dù không dùng tính năng mới) sẽ bị chặn ngay ở bước chấm, trong khi bản trước vẫn chạy được. Ghi chú phát hành đang nói là không có gì đổi cho kho không khai khoá mới, nên người nâng cấp có thể bị bất ngờ.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **A background long command left running by an aborted attempt can hand its old exit code to the same-round retry**
  Người dùng thấy gì: Khi một lượt chấm bị đứt giữa chừng rồi chấm lại, lệnh dài của lượt cũ có thể vẫn chạy ngầm và đưa kết quả cũ cho lượt mới. Kết quả đạt hoặc trượt có thể lấy từ lần chạy sai mà không có cảnh báo nào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **s4-args now stops S4 when any unrelated re-pin config key is invalid**
  Người dùng thấy gì: Một giá trị sai ở cấu hình ghim lại, vốn không liên quan tới lượt chấm, nay làm lượt chấm dừng ngay từ đầu ở mọi kho. Người dùng phải sửa cấu hình ấy mới chấm tiếp được.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **The over-time branch sends SIGTERM only and never checks that the tree died before the prompt says it was stopped**
  Người dùng thấy gì: Nếu lệnh dài là loại tự xử lý tín hiệu dừng, nó có thể vẫn chạy khi kit đã báo là dừng. Lệnh nặng kế tiếp sẽ chạy chồng lên nó và có thể gây lại chính lỗi tranh tài nguyên mà vòng này muốn tránh.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — đo CHỈ DẪN thay vì ĐẦU RA: luật TOOL-KILL mới (AC-4) chỉ được chấm trên tệp luật, không ca nào kiểm luật có tới prompt của lane lệnh dài**
  Người dùng thấy gì: Quy tắc dặn người chấm không coi lệnh bị đẩy nền là bị giết chỉ được kiểm trên tài liệu. Nếu quy tắc ấy vô tình bị gỡ khỏi lời dặn thật của bước chấm lệnh dài thì không phép đo nào báo, và lỗi chấm nhầm cũ có thể quay lại.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — thông điệp được ghim nhưng gộp hai điều kiện: LN3 «dấu giả kết thúc chờ» không phân biệt được «đọc mã 0» với «BLOCKED»**
  Người dùng thấy gì: Phép thử bắt lỗi đọc nhầm dấu kết thúc giả có thể báo đỏ vì một lý do khác với lý do ta muốn bắt. Kết quả thật hôm nay vẫn đúng, nhưng phép thử chưa khoá chặt điều đó.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: args longRunning/evalsChayRieng của bên ĐỌC không rút từ bên VIẾT s4-args**
  Người dùng thấy gì: Phía sinh tham số và phía đọc tham số được thử riêng, chỉ khớp nhau vì cùng một người gõ cùng tên khoá. Nếu sau này một bên đổi tên khoá mà bên kia không đổi theo, các phép thử vẫn xanh nhưng tính năng sẽ hỏng.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
