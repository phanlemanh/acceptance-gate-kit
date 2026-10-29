## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Kiểm hook của tiep-tuc coi mọi tệp nhịp cũ là bằng chứng hook đang chạy, không xét tuổi**
  Người dùng thấy gì: Nếu phiên giám sát từng có hook rồi gói bị nâng hoặc gỡ giữa chừng, hệ thống vẫn tưởng hook đang chạy. Chủ kho nhận lời báo «giám sát không có nhịp sống, hãy chạy lại vai giám sát», nhưng làm theo thì không chữa được, vì nguyên nhân thật là thiếu hook.
  Căn cứ: Chỉ xảy ra ở ca hẹp (gói đổi giữa phiên), hậu quả là một lời báo sai hướng chứ không mất dữ liệu; người dùng tự gỡ bằng cách mở phiên mới nạp lại gói, và có thể sửa sau mà không đắt.
  file: `dieu-phoi/scripts/tiep-tuc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chẩn đoán gọi bằng mã CLI báo sai giám sát «thiếu», dù lời dặn nói mã CLI cũng nhận**
  Người dùng thấy gì: Khi phiên giám sát tự chẩn đoán bằng mã CLI của chính nó, bảng chẩn đoán báo giám sát «thiếu» dù phiên đang đảm nhận vai. Phiên có thể bị đẩy đi chạy lại lệnh nhận vai một cách vô ích.
  Căn cứ: Hậu quả nhẹ: chỉ là một dòng báo thiếu sai và một bước chạy thừa, không mất dữ liệu; người dùng thử lại bằng mã app là qua, và sửa sau không tốn kém.
  file: `dieu-phoi/scripts/chan-doan.mjs`
  severity: low
  Đề xuất: known-limits

- **TC1-08 ghim cứng số dòng `--phien <mã phiên này>` (== 7): mọi bước mới đúng luật vẫn làm ca đỏ (r4 · tệp đã đổi)**
  Người dùng thấy gì: Hiện lời dặn trong các lệnh vẫn đúng, người dùng không thấy gì sai. Chỉ là mỗi khi có thêm một bước mới nhắc mã phiên, bộ kiểm của kit lại báo đỏ oan và người bảo trì phải sửa số đếm bằng tay.
  Căn cứ: Hậu quả nhẹ và chỉ chạm người bảo trì kit, không làm mất hay lộ dữ liệu của người dùng; báo đỏ oan tự lộ ngay ở lần chạy kế và sửa một con số là xong, nên ghi lại như hạn chế đã biết.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận viết trước): test đổi số đếm từ 6 lên 7 cho khớp vật, còn evals.yaml E8 vẫn ghi 6 (r4)**
  Người dùng thấy gì: Lời dặn cho người dùng trong các lệnh vẫn đúng, nhưng bản khai kiểm thử ghi số cũ nên người chấm đọc theo bản khai sẽ thấy lệch một đơn vị. Ngoài ra chưa có ca nào chứng minh rằng bước mới mà quên nói «mã app» thì bộ kiểm sẽ đỏ.
  Căn cứ: Hậu quả nhẹ vì chỉ lệch tài liệu kiểm thử nội bộ và một chiều đỏ còn thiếu cho bước mới, người dùng không mất dữ liệu và kit vẫn chạy đúng; sửa sau rẻ nên ghi lại như hạn chế đã biết.
  file: `_acceptance/danh-thuc-doc-nhip-dung-ma/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Bước 5 của tiep-tuc.md nói «mã CLI cũng nhận» cho chan-doan --phien, nhưng chan-doan báo giam-sat «thieu» khi nhận mã CLI (r2 · tệp đã đổi)**
  Người dùng thấy gì: Lời dặn bảo phiên có thể đưa mã CLI vào lệnh chẩn đoán, nhưng làm vậy chẩn đoán báo sai là chưa có giám sát. Phiên làm theo lời dặn có thể chạy lại bước nhận vai bằng mã CLI và tự đổi vai giám sát về mã không đúng, tức là lặp lại lỗi vòng này đi sửa.
  Căn cứ: Hậu quả vừa phải: chỉ xảy ra khi phiên đưa mã CLI vào lệnh chẩn đoán, không mất dữ liệu và chạy lại bằng mã app là gỡ được, còn sửa là bỏ một vế lời dặn hoặc chỉnh một chỗ so khớp nên rẻ.
  file: `dieu-phoi/commands/tiep-tuc.md`
  severity: medium
  Đề xuất: new-contract

- **Nhánh chạy lại có thể đổi kết quả đỏ thành xanh (CHẬP CHỜN), nhưng chưa ca nào thử chiều đỏ của nhánh này (r2)**
  Người dùng thấy gì: Công cụ so hai môi trường có thể chấp nhận một ca thỉnh thoảng đỏ là chập chờn mà chưa ai thử xem nó có bao giờ nhận nhầm một ca đỏ thật hay không. Người dùng cuối không bị ảnh hưởng, chỉ là độ tin của thước kiểm giảm một chút.
  Căn cứ: Hậu quả nhẹ với người dùng vì đây là công cụ kiểm nội bộ, suite trọn vẹn vẫn đòi không có ca hỏng, và vá thước của thước đang bị đóng băng đến mốc phát hành kế.
  file: `tests/dieu-phoi/hai-moi-truong.mjs`
  severity: low
  Đề xuất: known-limits

- **hai-moi-truong.mjs: ca đỏ ở CẢ HAI lần chạy trọn suite bị hạ thành «CHẬP CHỜN» và thoát 0 chỉ vì chạy lẻ thì xanh; mã thoát của suite (a.ma/b.ma) không vào phán quyết (r2)**
  Người dùng thấy gì: Một ca hỏng ổn định khi chạy cả bộ nhưng xanh khi chạy riêng sẽ bị công cụ so hai môi trường báo xanh. Lỗi đó vẫn bị bước chạy trọn bộ riêng bắt, nên chỉ là một lớp kiểm bị yếu đi.
  Căn cứ: Hậu quả nhẹ vì lớp kiểm chạy trọn bộ vẫn bắt được ca hỏng, người dùng cuối không chạm tới, và sửa thước của thước nằm ngoài phạm vi vòng này.
  file: `tests/dieu-phoi/hai-moi-truong.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ca TC1-09 hai-moi-truong-so chỉ đưa Set viết tay vào caNghi, không lần nào chạy bộ phân tích TAP trong chay() hay nhánh hạ đỏ thành CHẬP CHỜN (r2 · tệp đã đổi)**
  Người dùng thấy gì: Công cụ so hai môi trường chưa được thử với đầu ra thật của bộ kiểm, nên một ca chỉ bị bỏ qua ở một môi trường có thể lọt qua mà vẫn báo xanh. Hôm nay chưa có ca nào như vậy, nên chưa gây sai lệch thật.
  Căn cứ: Là lỗ tiềm ẩn chưa gây hại, chỉ ảnh hưởng độ tin của công cụ kiểm nội bộ, và ghi giới hạn kèm ngưỡng đếm rẻ hơn mở thêm vòng đo thước.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **`vai --giam-sat <X>` gắn mã CLI của phiên GỌI vào giám sát mới X: đánh thức và chẩn đoán đọc nhịp của sai phiên (r1)**
  Người dùng thấy gì: Khi một giám sát trao vai cho giám sát mới, hệ thống có thể coi giám sát mới là còn sống nhờ nhịp của giám sát cũ. Nếu giám sát mới chết thì chủ kho không được báo.
  Căn cứ: Lỗi làm đúng lỗi «báo sai là còn sống» mà vòng này chữa, nhưng chỉ xảy ra ở đường trao vai, và tự hết khi giám sát mới chạy lệnh tiếp tục; sửa riêng một vòng nhỏ thì rẻ.
  file: `dieu-phoi/scripts/vai.mjs`
  severity: high
  Đề xuất: new-contract

- **TC1-09 đặt một bất biến lúc gộp (sha ghim cứng + sổ của hồ sơ này) vào suite thường trực: vòng sau sửa bất kỳ ca nào ở tests/dieu-phoi là CI đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Sau khi gộp, người sửa một ca kiểm thử cũ ở nhóm điều phối ở vòng sau sẽ bị CI đỏ cho tới khi ghi thêm dòng vào sổ quyết định. Việc này gây vướng cho người làm kit, người dùng cuối không thấy.
  Căn cứ: Hậu quả chỉ là báo đỏ giả và mất ít phút ghi sổ cho vòng sau, không mất dữ liệu; có thể ghi thành giới hạn đã biết rồi gỡ sau.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: high
  Đề xuất: known-limits

- **TC1-06 so trọn đầu ra `chan-doan --chi-tiet` với gói ở sha ghim: vòng sau thêm hay đổi bất kỳ mục chẩn đoán nào là đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Mỗi lần sau này thêm hay đổi một mục trong báo cáo chẩn đoán, kiểm thử này sẽ đỏ dù tính năng đánh thức vẫn đúng. Người dùng kit không bị ảnh hưởng, chỉ người sửa kit phải cập nhật phép so.
  Căn cứ: Gây báo đỏ giả cho vòng sau chứ không làm sai kết quả cho người dùng; người sửa kit tự gỡ được bằng cách thu hẹp phép so.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **`vai --giam-sat <X>` ghi mã CLI của phiên GỌI lệnh làm phien_cli của giám sát mới X (r1)**
  Người dùng thấy gì: Khi giám sát cũ giao vai cho phiên khác, nhịp của giám sát cũ bị tính cho phiên mới, nên phiên mới đã chết vẫn bị coi là đang sống và chủ kho không được báo.
  Căn cứ: Một giám sát mới chết mà không ai báo là hậu quả thật, nhưng chỉ xảy ra ở đúng lúc trao vai và tự lành khi phiên mới chạy lệnh tiếp tục; sửa nhỏ, rẻ.
  file: `dieu-phoi/scripts/vai.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5: TC1-09 tuyên «tập ca đổi thân BẰNG tập khai trong sổ» trên mọi ca, nhưng bộ tách khối chỉ thấy test( ở cột 0 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Kiểm thử bảo vệ các ca cũ chỉ nhận ra một số kiểu ca bị đổi nội dung. Nếu ai đó sửa một ca kiểu khác, hệ thống có thể không báo.
  Căn cứ: Điểm mù chỉ làm lọt thay đổi thầm lặng ở các ca kiểm thử, không ảnh hưởng người dùng cuối, và còn lưới review ở vòng sau.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: ma trận ba hàng của TC1-02 chỉ chạy qua đường `mo` (ghiVai), không qua `tiep-tuc`, dù AC-2 đặt `tiep-tuc` làm hành động chính (r1 · tệp đã đổi)**
  Người dùng thấy gì: Các trường hợp biến môi trường sai hoặc vắng chỉ được thử khi mở đợt, chưa thử khi giám sát chạy lệnh tiếp tục. Nếu đường tiếp tục có lỗi riêng thì chưa có kiểm thử bắt được.
  Căn cứ: Mức nhẹ, chỉ là khoảng trống kiểm thử; nếu lỗi có thật thì hậu quả là mã phiên ghi nhầm, người dùng chạy lại lệnh là sửa được.
  file: `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
