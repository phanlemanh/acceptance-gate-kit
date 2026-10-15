## Trong hợp đồng

- **Thẻ khởi động báo «! cửa tín hiệu: 1 tệp không đọc được» khi thư mục nguồn chưa có, dù không có tệp nào hỏng**
  AC: AC-8
  file: `scripts/start-scan.mjs:710`
  severity: medium
  source: bugs
  detail: chuaGom → docTinHieu đẩy vào `loi` câu «nguồn tín hiệu không phải thư mục có thật» khi thư mục `tin_hieu.nguon` chưa tồn tại. Đây là trạng thái thường gặp: kho mới khai cửa mà chưa ai gửi gì, hoặc một bản clone mới. Tệp tín hiệu cố ý nằm ngoài git cho tới khi gom, mà git không giữ thư mục rỗng, nên clone xong là không có thư mục ấy. start-scan lại đếm mọi mục của `cg.loi` thành «N tệp không đọc được — sửa ở nguồn rồi gom». Đã chạy lại: kho khai `tin_hieu` (nguon tin-hieu/kho) và `lo_trinh`, không tạo thư mục tin-hieu/kho; thẻ in thêm `! cửa tín hiệu: 1 tệp không đọc được — sửa ở nguồn rồi gom`, còn bộ máy gốc không in dòng này. Như vậy có hai lỗi: (a) thẻ cảnh báo sai về một tệp không hề tồn tại; (b) vi phạm cam kết AC-8 «0 ý chờ gom → thẻ giống từng byte bản gốc». Ca CT-8-khong không bắt được vì fixture kho() luôn tạo sẵn tin-hieu/kho/.gitkeep. Cách sửa: coi «thư mục nguồn chưa có» là 0 ý, hoặc chỉ đếm những lỗi thật sự đến từ tệp.
  rationale: AC-8 đòi «0 tín hiệu chưa gom → thẻ giống từng byte bộ máy gốc»; kho khai cửa mà chưa có thư mục nguồn là 0 tín hiệu nhưng thẻ lại in thêm dòng cảnh báo sai.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tệp tín hiệu do bộ xét ghi lấy tên theo mã yêu cầu của đợt (`<dãy>-<số>`), nên đụng nhau giữa các đợt: từ đợt thứ hai trở đi, ý không chặn lại đánh thức giám sát**
  Người dùng thấy gì: Từ đợt thứ hai của cùng một kho, nhiều ý mới không chặn vẫn bị đẩy về cho giám sát phán như cũ, vì tên tệp của ý trùng với ý đợt trước chưa gom. Tức là tính năng «ý mới không đánh thức giám sát» chỉ chạy tốt ở đợt đầu.
  Căn cứ: Hậu quả nặng với mục đích chính của tính năng nhưng không mất ý nào (ý vẫn được giữ lại và đẩy về cho người phán), người dùng tự xử được, và sửa cần đổi cách đặt tên nên nên làm thành một việc riêng.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: high
  Đề xuất: new-contract

- **Dòng nhắc «Cửa tín hiệu: N ý chờ gom» chỉ hiện khi kho khai cả lộ trình; kho chỉ khai cửa thì không bao giờ thấy lời nhắc mà lệnh gửi hứa**
  Người dùng thấy gì: Kho chỉ bật cửa tín hiệu mà không khai lộ trình sẽ không thấy lời nhắc «còn N ý chờ gom» khi mở phiên, dù vẫn gửi ý được. Ý vẫn nằm trong kho nhưng có thể bị quên gom.
  Căn cứ: Hậu quả nhẹ vì không mất dữ liệu và ý vẫn gom được thủ công, chỉ thiếu lời nhắc cho kho cấu hình theo kiểu ít gặp; ghi giới hạn là đủ.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai ý khác nhau mà không có tieu_de bị gộp làm một trong im lặng và không bao giờ vào cửa tín hiệu (hang-moi theo khuôn cau_giao bị mất)**
  Người dùng thấy gì: Hai ý mới khác nhau nhưng đều không có tiêu đề (như việc mới theo khuôn chuẩn) bị coi là một và ý thứ hai biến mất mà không báo lỗi. Người gửi chỉ nhận câu «trùng yêu cầu» sai.
  Căn cứ: Mất ý thật một cách im lặng nên hậu quả khá nặng, và người dùng không tự phát hiện được; nhưng chỉ xảy ra khi hai ý đến sát nhau trong 24 giờ và sửa rẻ nên nên làm sớm bằng việc riêng.
  file: `dieu-phoi/scripts/yeu-cau.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 (âm-tính-một-mình, thiếu đối chứng dương): CT-6-do được truyền lanhOk = true cứng thay vì kết quả của ca lành CT-6**
  Người dùng thấy gì: Một ca kiểm tra nội bộ có thể báo xanh khi chạy riêng lẻ dù bản lành đã lệch. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng độ tin của một phép đo khi chạy lẻ, chạy đủ bộ thì vẫn được che, và không đụng tới sản phẩm người dùng nên chấp nhận.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (âm-tính-một-mình, không ghim thông điệp): CT-7-rong chỉ kiểm mã thoát 2 và việc không có tệp**
  Người dùng thấy gì: Một ca kiểm tra nội bộ cho lệnh gửi ý không phân biệt được lý do từ chối khi gửi câu rỗng. Người dùng cuối không thấy khác biệt.
  Căn cứ: Chỉ làm phép đo lỏng hơn một chút, không ảnh hưởng người dùng và không mất dữ liệu nên không đáng mở việc.
  file: `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
