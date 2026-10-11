# Review findings: eval-goi-model-that-khong-chay (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bật model_carry_cmd làm làn chết mã 2 ở kho lớn: đầu ra git ls-tree vượt maxBuffer 1 MiB mặc định (ENOBUFS)**
  Người dùng thấy gì: Ở kho lớn như kho CRM, bật tính năng dùng lại kết quả sẽ làm lệnh ghim lại dừng hẳn với lỗi trước khi chạy bất kỳ bước kiểm nào. Tính năng không dùng được đúng ở nơi nó dành cho, và việc ghim lại thường ngày ở kho đó cũng bị chặn theo.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: high
  Đề xuất: new-contract

- **Lệnh dấu vân tay chạy trước bộ bắt tín hiệu và nằm ngoài dangChay, nên bị ngắt giữa chừng thì nó sống mồ côi**
  Người dùng thấy gì: Nếu người dùng bấm dừng đúng lúc lệnh dò phiên bản model đang treo vì mạng, lệnh dò đó có thể tiếp tục chạy ngầm mà không ai dọn, và lượt ghim lại bị ngắt cũng không được ghi nhận là bị ngắt.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **pham-vi.mjs (E12, không khai paths nên chạy lại ở mọi lượt ghim) đọc t3_paths và trạng thái hồ sơ khác lúc chạy, nên hồ sơ đã ký có thể tự hoá đỏ**
  Người dùng thấy gì: Hồ sơ này sau khi ký có thể tự chuyển đỏ về sau, không phải vì sản phẩm đổi mà vì quy định mức rủi ro của kho được siết lại. Khi đó phải cho hồ sơ nghỉ hoặc ghim lại bằng tay.
  file: `_acceptance/eval-goi-model-that-khong-chay/rang/pham-vi.mjs`
  severity: medium
  Đề xuất: known-limits

- **dem-dung-lai-model.mjs chép tay vị từ «nguồn chạy thật» của thư viện thay vì dùng chung một định nghĩa**
  Người dùng thấy gì: Công cụ đếm giữ một bản sao riêng của luật nhận ra lần chạy thật. Nếu sau này luật chính được siết mà bản sao không đổi theo, nhãn gắn cho các lần lệch sẽ sai mà không ai hay, và con số dùng để quyết định có siết tiếp hay không sẽ bị lệch.
  file: `feature-loop/scripts/dem-dung-lai-model.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lượt dừng sớm (vượt trần / bị ngắt) bỏ mất carry_lech mà tổng kết vừa báo, nên lượt sau dùng lại kết quả xanh cũ: xanh giả**
  Người dùng thấy gì: Nếu người dùng ngắt lệnh ghim lại ngay sau khi nó phát hiện kết quả chập chờn, lần chạy sau có thể dùng lại kết quả xanh cũ cho một bài kiểm đang đỏ thật và ghi nhận xanh sai. Đây là kiểu sai nhìn thấy xanh mà thực ra đỏ.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: new-contract

- **dem-dung-lai-model gán nhãn «nghi thiếu đầu vào» cho tệp chính làn ghi ở hồ sơ khác khi một làn ghim nhiều slug**
  Người dùng thấy gì: Khi một lượt ghim lại nhiều hồ sơ cùng lúc, công cụ đếm có thể báo nhầm là thiếu đầu vào chỉ vì thấy sổ do chính lượt ghim ghi ở hồ sơ khác. Số đếm dùng làm ngưỡng dừng tính năng vì thế bị thổi phồng.
  file: `feature-loop/scripts/dem-dung-lai-model.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — đo CHỈ DẪN thay vì ĐẦU RA: ma trận lớp băm rút từ khối CARRY-INPUT-LAYERS, nhưng không hàm băm nào đọc khối đó**
  Người dùng thấy gì: Nếu sau này ai thêm một loại đầu vào mới vào phép so sánh nhưng quên cập nhật danh sách khai báo, bộ kiểm tra vẫn xanh và không ai biết loại đầu vào mới ấy chưa được thử.
  file: `tests/scripts/repin-lane-dung-lai-model.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình ở AC4-eval-thuong: không có đối chứng dương, cũng không có phép phá**
  Người dùng thấy gì: Phần kiểm tra rằng bài kiểm thường (không gọi model) luôn chạy và không bị dùng lại chỉ gồm các phép kiểm không thấy điều xấu. Nếu lệnh ghim lại dừng sớm thì phần này vẫn xanh, và chưa từng được thử cho đỏ để chứng tỏ nó đo thật.
  file: `tests/scripts/repin-lane-dung-lai-model.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hai assertion trong tệp ca mới thuộc đúng lớp «âm-tính-một-mình»: một cái thiếu đối chứng dương, một cái không ghim thông điệp**
  Người dùng thấy gì: Hai chỗ kiểm tra tự động có thể báo xanh dù lệnh chưa chạy tới nơi: một chỗ không xác nhận lệnh có chạy hết, một chỗ không kiểm nội dung thông báo lỗi. Vì vậy màu xanh ở đó chưa chắc đã nghĩa là đúng.
  file: `tests/scripts/repin-lane-dung-lai-model.test.mjs`
  severity: low
  Đề xuất: known-limits

- **dem-dung-lai-model.mjs đưa sha đọc từ run-log vào argv của git diff mà không kiểm tra**
  Người dùng thấy gì: Công cụ đếm đọc mã phiên bản từ sổ chạy mà không kiểm tra hình dạng. Nếu sổ bị sửa tay hoặc hỏng, công cụ có thể ghi ra một tệp dù hứa chỉ đọc, hoặc báo không so được mà không nói lý do.
  file: `feature-loop/scripts/dem-dung-lai-model.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «MỌI khoá LAN-KHOA bật» cho AC-9 nhưng chỉ có hai điểm-case rời; evals.yaml E9 khai một phép đo không tồn tại**
  Người dùng thấy gì: Bộ kiểm tra khuôn ghi sổ chưa chạy một lượt có đủ mọi tính năng bật cùng lúc cùng với lần chạy chập chờn, nên thứ tự các trường trong sổ ở tình huống đó chưa được chứng. Mô tả trong hồ sơ nói đã bật đủ nhưng thực tế chưa.
  file: `_acceptance/eval-goi-model-that-khong-chay/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ của chan.mjs không chạy đối chứng dương trên chính bản sao SAU-G3 nguyên vẹn**
  Người dùng thấy gì: Công cụ thử cố tình phá để xem bộ kiểm có đỏ chưa kiểm rằng bản gốc nguyên vẹn chạy xanh trước khi phá. Nếu môi trường trôi, có thể báo bắt được lỗi trong khi nguyên nhân thật không phải do phép phá.
  file: `_acceptance/eval-goi-model-that-khong-chay/rang/chan.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — AC4-ma-tran là bảng tra song song, không lái ca: chỉ kiểm id có trong ALL, không kiểm ca đó đo đúng lý do**
  Người dùng thấy gì: Nếu sau này có thêm một lý do mới khiến làn luôn chạy lại model mà bị ánh xạ nhầm vào ca có sẵn, bộ kiểm tra vẫn xanh dù chưa ai thử lý do mới đó.
  file: `tests/scripts/repin-lane-dung-lai-model.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — dòng «nguồn không có» của AC10-dem dựng tay đúng khuôn bên đọc, lời chú thích nói là «sửa từ dòng làn ghi»**
  Người dùng thấy gì: Một ca kiểm tra công cụ đếm dùng dòng sổ viết tay thay vì dòng do làn thật ghi, nên con số mong đợi ở ca đó chỉ đúng vì dòng viết tay thiếu phần tổng kết. Sổ thật có thể đếm lệch một đơn vị ở đúng dòng ấy, không ảnh hưởng quyết định nào.
  file: `tests/scripts/repin-lane-dung-lai-model.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
