# Review findings: suc-khoe-cho-trong-va-toc-do (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hai tiến trình cùng đọc-sửa-ghi tệp do-dang-chay/<tài nguyên>.json mà không có khoá: có thể mất mã thoát, lý do hạ tầng hoặc nhãn dưới tải**
  Người dùng thấy gì: Hiếm khi, nếu thợ nhả khoá đúng lúc bộ phát lịch đang cập nhật, một lượt bị máy nghẹt giết có thể bị ghi nhầm là lượt sạch và làm lệch con số nhu cầu hiệu chuẩn. Khi đó không có dấu vết nào báo điều này.
  Căn cứ: Chỉ xảy ra khi hai việc trùng khít thời điểm nên hiếm, hậu quả là một số hiệu chuẩn lệch nhẹ chứ không mất việc của người dùng, và các lượt sau tự kéo số về đúng.
  file: `dieu-phoi/scripts/ghi.mjs`
  severity: medium
  Đề xuất: known-limits

- **E11 nói DP1-07 quét cả tệp số đo thật mới trong tests/dieu-phoi/loi/, nhưng phép quét không chạm thư mục đó**
  Người dùng thấy gì: Bộ kiểm tuyên là đã quét tệp số đo chụp từ máy thật để chắc không lọt tên riêng của kho khách, nhưng thực tế tệp đó không được quét. Kho kit công khai nên nếu sau này ai đó dán tên kho vào tệp ấy thì bộ kiểm vẫn báo xanh.
  Căn cứ: Hôm nay nội dung tệp đã đọc và sạch nên chưa lộ gì, nhưng nếu lọt thì dữ liệu nằm trên kho công khai và khó thu hồi, trong khi sửa lại rẻ.
  file: `_acceptance/suc-khoe-cho-trong-va-toc-do/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Xoá ca đơn vị cũ làm mất chiều «văn bản hỏng thì không giảm tải» cho áp lực và load**
  Người dùng thấy gì: Không còn ca kiểm nào giữ lời hứa rằng số đo áp lực bị hỏng thì máy không bị giảm tải oan. Nếu sau này ai đó sửa nhầm chỗ này, đợt có thể lại bị giảm tải oan mà không bộ kiểm nào báo.
  Căn cứ: Hành vi hiện tại đúng nên người dùng chưa chịu gì, chỉ mất lưới bắt lỗi tương lai, và thêm lại ca kiểm là việc rẻ.
  file: `tests/dieu-phoi/loi/suc-khoe.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Danh sách loại lượt nặng khai hai lần ở hai module, bên ghi và bên kiểm có thể trôi khỏi nhau**
  Người dùng thấy gì: Danh sách các loại làn nặng được viết tay ở hai nơi. Khi sau này thêm một loại làn mới mà quên một nơi, cấu hình hợp lệ có thể bị từ chối hoặc một số cấu hình bị bỏ qua.
  Căn cứ: Chưa gây lỗi nào hôm nay, chỉ phát sinh khi có người thêm loại làn mới và lúc đó lỗi lộ ra ngay nên người dùng tự thấy và sửa được.
  file: `dieu-phoi/scripts/hinh-dang.mjs`
  severity: low
  Đề xuất: known-limits

- **Khoá cũ swap_gb, rss_gb được nhận rồi bỏ qua im lặng, không có cờ vàng; nhánh «cần người» theo RSS thành mã chết**
  Người dùng thấy gì: Kho nào từng tự chỉnh ngưỡng swap hay bộ nhớ sẽ bị mất hàng rào đó mà không được báo gì trên màn hình theo dõi. Một số đoạn mã đọc trường «cần người» giờ không bao giờ chạy nữa.
  Căn cứ: Việc ngưỡng cũ hết tác dụng là chủ đích của bản này nên không mất dữ liệu, người dùng chỉ thiếu một lời báo và có thể gỡ cấu hình cũ bất cứ lúc nào.
  file: `dieu-phoi/scripts/suc-khoe.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai lane nặng (s4 và duong-nen) được cấp cùng một nhịp dựa trên cùng một số chỗ trống, không trừ phần lane kia sẽ dùng**
  Người dùng thấy gì: Khi hai làn nặng cùng chờ, bộ phát lịch có thể cho cả hai chạy cùng lúc dù chỗ trống chỉ đủ cho một, nên máy vẫn có thể bị nghẹt đúng kiểu mà tính năng này muốn tránh.
  Căn cứ: Hậu quả vừa phải vì máy chậm đi và các lượt dưới tải được gắn nhãn và thử lại, nhưng đây là lỗ hổng thật của chính mục tiêu chặn nghẹt nên đáng làm thành việc riêng.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **Đơn chờ vì khoá đang bận bị ghi lý do «thiếu chỗ» và phát sự kiện thieu-cho**
  Người dùng thấy gì: Một đơn đang xếp hàng chỉ vì làn kia còn đang chạy lại hiện lý do «thiếu chỗ» trên bảng và lệnh xem. Người đọc có thể tưởng máy hết bộ nhớ trong khi thực ra chỉ đang chờ lượt.
  Căn cứ: Chỉ là nhãn lý do hiển thị sai, đơn vẫn được cấp đúng lượt khi khoá nhả nên không mất việc, nhưng nó làm lệch số đếm chờ oan.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đua đọc-sửa-ghi giữa lệnh nhả và nhịp có thể làm mất --ma/--ha-tang một cách im lặng, rồi lượt bị hạ tầng đốt lọt vào mẫu sạch**
  Người dùng thấy gì: Hiếm khi một lượt bị máy giết hoặc đã khai do hạ tầng lại bị ghi như lượt bình thường, nên làm lệch nhẹ số nhu cầu hiệu chuẩn mà không để lại dấu vết.
  Căn cứ: Xác suất thấp và chỉ làm lệch một con số hiệu chuẩn, không mất việc của người dùng, các lượt sau kéo số về đúng.
  file: `dieu-phoi/scripts/do-lan.mjs`
  severity: low
  Đề xuất: known-limits

- **Lượt không lấy được commit (null) khoá luôn quyền thử lại cho mọi commit sau đó**
  Người dùng thấy gì: Nếu hệ thống không đọc được mã phiên bản của vật, các lượt dưới tải sau đó bị coi như đã thử lại rồi và không được thử lại nữa. Người đọc cũng không biết vì sao.
  Căn cứ: Chỉ xảy ra khi việc đọc phiên bản bị lỗi, vốn hiếm, và hậu quả là một lượt bị tính đỏ thay vì được chấm lại; người dùng chấm lại tay được.
  file: `dieu-phoi/scripts/do-lan.mjs`
  severity: low
  Đề xuất: known-limits

- **Luật thợ bảo đọc sự kiện luot-duoi-tai sau khi nhả, nhưng sự kiện chỉ được ghi ở nhịp kế**
  Người dùng thấy gì: Hướng dẫn cho thợ bảo đọc kết quả «được thử lại hay không» ngay sau khi nhả, nhưng kết quả đó chỉ có ở nhịp sau. Thợ đọc sớm sẽ không thấy gì và không biết làm tiếp thế nào.
  Căn cứ: Chỉ là hướng dẫn thiếu một câu về việc chờ, không mất dữ liệu, thợ đọc lại sau một nhịp là có và sửa lời hướng dẫn rất rẻ.
  file: `dieu-phoi/scripts/mau/LUAT.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc: SK-08 nuôi nhuCau và hieu-chuan bằng dòng sổ dựng tay, không round-trip từ bên ghi khepLuot**
  Người dùng thấy gì: Bộ kiểm hiệu chuẩn dùng dòng sổ dựng tay nên nếu sau này bên ghi sổ thật làm rớt hay ghi sai một trường, bộ kiểm vẫn xanh. Khi đó hiệu chuẩn có thể âm thầm không dùng được số đo thật.
  Căn cứ: Hiện chưa có lỗi nào ở sản phẩm, chỉ là lưới bắt lỗi tương lai còn thủng, và nếu lỗi xảy ra thì hiệu chuẩn dùng số cấu hình thay thế chứ không mất việc.
  file: `tests/dieu-phoi/loi/suc-khoe-nhip.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: hàng 'xem «Cần anh»' của SK-04 không thể đỏ vì veXem không bao giờ render can_nguoi**
  Người dùng thấy gì: Một dòng kiểm xác nhận rằng màn hình xem không hiện «Cần anh» không thể báo đỏ trong bất kỳ trường hợp nào. Nếu sau này màn hình xem lại in dòng đó, bộ kiểm vẫn không phát hiện.
  Căn cứ: Hôm nay màn hình xem đúng nên người dùng không bị ảnh hưởng, và bảng chính vẫn có hàng kiểm đỏ được cho cùng lỗi nên rủi ro thấp.
  file: `tests/dieu-phoi/loi/suc-khoe-nhip.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
