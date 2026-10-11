# Review findings — dieu-phoi-doi-tai-khoan (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Thẻ khởi tạo hỏi thêm «khau-vi-han-muc» nhưng không có đường nào ghi câu trả lời của người: câu hỏi chỉ còn một lối ra**
  Người dùng thấy gì: Chủ kho được hỏi muốn báo trước và bàn giao ở mức hạn mức nào, nhưng câu trả lời không được ghi vào đợt. Đợt vẫn chạy với số mặc định (80 và 90) dù chủ kho chọn số khác.
  file: `dieu-phoi/scripts/the.mjs`
  severity: high
  Đề xuất: new-contract

- **Lịch 30′ mà mo-dot dựng không gọi get_usage, han-muc hay danh-thuc; tiep-tuc chỉ dựng lịch khi chưa có nên không bao giờ thay nó**
  Người dùng thấy gì: Đợt mở bằng lệnh mở đợt thông thường có đồng hồ nhắc 30 phút nhưng đồng hồ đó không đọc hạn mức và không đánh thức giám sát. Cảnh báo sắp hết hạn mức và thông báo có việc chờ người vì thế không tự đến, còn tài liệu mô tả đồng hồ này làm nhiều hơn thực tế.
  file: `dieu-phoi/commands/mo-dot.md`
  severity: medium
  Đề xuất: new-contract

- **tiep-tuc.md: nhận khuyen_cho (tài khoản đã quá ngưỡng) vẫn đi tiếp bước 4 và mở chip thợ trong khi đợt còn ở pha ★**
  Người dùng thấy gì: Sau khi đổi sang tài khoản đã gần hết hạn mức, hệ thống khuyên chờ nhưng giám sát vẫn mở lại các phiên thợ dưới tài khoản đó và báo đợt đã chạy lại. Thợ vì thế tiêu nốt đúng phần hạn mức mà việc bàn giao muốn giữ.
  file: `dieu-phoi/commands/tiep-tuc.md`
  severity: medium
  Đề xuất: new-contract

- **chay.sh của Cổng Giá trị X1 cho XANH khi không đo kho nào ở vế «kho không khai lộ trình»**
  Người dùng thấy gì: Bản kiểm cuối của phiên nghiệm thu xuất dữ liệu lộ trình có thể báo xanh dù không đo được kho nào, chẳng hạn khi chạy trên máy không có hai kho cần đo. Người ký có thể tưởng kết quả đã được kiểm trong khi thực tế chưa.
  file: `_acceptance/xuat-du-lieu-lo-trinh/uat/chay.sh`
  severity: medium
  Đề xuất: new-contract

- **ban-giao.mjs tự đọc lại dấu và lịch sử bàn giao, đi ngược «MỘT nơi đọc» của dau.mjs (nhập docDau và lichSuMoiNhat mà không dùng)**
  Người dùng thấy gì: Hai nơi cùng đọc dấu bàn giao nhưng theo hai luật khác nhau, nên một dấu sai khuôn vẫn có thể bị chép vào lịch sử bàn giao. Hôm nay chưa thấy sai kết quả nhưng về sau dễ lệch nhau.
  file: `dieu-phoi/scripts/ban-giao.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai bản chép của luật «hàng kế của dãy»: slugKeCua (ghi.mjs) và slugCuaDay (muc-day.mjs)**
  Người dùng thấy gì: Cùng một dãy việc được tính 'việc kế tiếp' ở hai nơi bằng hai bản chép giống nhau. Hôm nay kết quả trùng, nhưng sửa một nơi mà quên nơi kia thì đơn xin lượt và hồ sơ bàn giao sẽ nêu hai việc khác nhau cho cùng một dãy.
  file: `dieu-phoi/scripts/muc-day.mjs`
  severity: low
  Đề xuất: known-limits

- **kiemMoiTruong đọc cấu hình đợt thô, bỏ qua bộ kiểm docCauHinh rồi chạy `sh -c` trên giá trị chưa kiểm**
  Người dùng thấy gì: Nếu ai đó sửa tay tệp cấu hình đợt sai khuôn, lệnh chẩn đoán sẽ chết thay vì báo thiếu gì, đúng lúc chủ kho đang mở hoặc tiếp tục đợt.
  file: `dieu-phoi/scripts/moi-truong.mjs`
  severity: low
  Đề xuất: known-limits

- **CONTEXT.md: mục «Đợt (điều phối)» vẫn kê chuỗi pha cũ, thiếu hai pha ★**
  Người dùng thấy gì: Từ điển thuật ngữ của kit vẫn mô tả vòng đời đợt theo chuỗi trạng thái cũ, thiếu hai trạng thái bàn giao mới, nên người đọc thuật ngữ sẽ hiểu sai các trạng thái của đợt.
  file: `CONTEXT.md`
  severity: low
  Đề xuất: known-limits

- **chay.sh: DO=1 trong khối `{ … } | tee` bị mất — chiều đỏ của bước quét mã hỏng mà KẾT vẫn XANH**
  Người dùng thấy gì: Bản kiểm cuối của phiên nghiệm thu xuất dữ liệu lộ trình luôn báo xanh ở bước quét mã, kể cả khi phép thử đảo chiều không chạy được hoặc hỏng. Người ký nhận bằng chứng xanh trong khi một phần bằng chứng chưa từng được chạy.
  file: `_acceptance/xuat-du-lieu-lo-trinh/uat/chay.sh`
  severity: high
  Đề xuất: new-contract

- **lanDocHieuLuc nhận lần đọc của phiên đã bàn giao → đợt lặng lẽ vào bàn giao lại trên tài khoản mới**
  Người dùng thấy gì: Sau khi đổi tài khoản, nếu một phiên thợ của tài khoản cũ vẫn chạy và báo mức dùng cao, đợt có thể bị kéo vào bàn giao ngay trên tài khoản mới mà không có thông báo nào, rồi lại bảo chủ kho đổi tài khoản lần nữa.
  file: `dieu-phoi/scripts/han-muc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hook StopFailure bỏ qua vĩnh viễn mọi phiên trong phien_da_biet, kể cả phiên cũ đã được nhắn tiếp tục**
  Người dùng thấy gì: Nếu một phiên cũ được nhắn tiếp tục sau khi đổi tài khoản rồi lại chết vì hết hạn mức, lưới an toàn cuối không chạy và việc dở của thợ không được lưu thành bản nháp.
  file: `dieu-phoi/scripts/hook-het-han-muc.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phụ thuộc `sau` tra theo mã đơn độc trong khi DP7 AC-12 cho trùng mã giữa hai lộ trình**
  Người dùng thấy gì: Khi hai lộ trình có chung mã việc, việc phụ thuộc có thể bị tính theo việc của lộ trình kia, nên một việc có thể được mở sớm khi việc nó phải chờ chưa xong, hoặc phải chờ nhầm.
  file: `dieu-phoi/scripts/goi-dot.mjs`
  severity: medium
  Đề xuất: new-contract

- **Khoá daBao gồm chuỗi dat_lai → mod (làm tròn phút) và get_usage (mili-giây) phát trùng sự kiện can_phan**
  Người dùng thấy gì: Khi hai nguồn đọc hạn mức báo giờ đặt lại lệch vài trăm mili-giây cho cùng một cửa sổ, giám sát có thể bị đánh thức hoặc nhắn chủ kho hai lần cho cùng một cảnh báo.
  file: `dieu-phoi/scripts/han-muc.mjs`
  severity: low
  Đề xuất: known-limits

- **ban-giao-xong đòi hết đơn nhưng pha bàn giao không cấp lượt và không có lệnh rút đơn**
  Người dùng thấy gì: Thợ đang xếp hàng chờ lượt kiểm thử khi nhận lời nhắc bàn giao không báo xong được, nên dãy đó phải chờ hết hạn chờ (mặc định 20 phút) mới được bàn giao. Đơn cũ còn có thể được cấp cho phiên đã chết sau khi tiếp tục.
  file: `dieu-phoi/scripts/ban-giao.mjs`
  severity: low
  Đề xuất: known-limits

- **chan-doan nuốt mọi lỗi của keHoachDay → mọi mục day:* biến mất không báo**
  Người dùng thấy gì: Nếu một tệp trạng thái của đợt bị hỏng, lệnh chẩn đoán lặng lẽ bỏ qua các dãy việc và có thể báo không có gì cần làm, trong khi lệnh tiếp tục lại báo lỗi.
  file: `dieu-phoi/scripts/chan-doan.mjs`
  severity: low
  Đề xuất: known-limits

- **trong-dot.mjs đọc mọi lỗi của `tho` thành «lõi chưa có lệnh tho» và bỏ stderr**
  Người dùng thấy gì: Khi lõi đợt gặp lỗi thật, phiên thợ chỉ thấy câu 'lõi chưa có lệnh' sai lý do rồi chạy như ngoài đợt: hỏi lại chủ kho, xin duyệt ở phiên thợ và chạy kiểm thử cuối mà không xin lượt.
  file: `feature-loop/scripts/trong-dot.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): răng «không bao giờ cho phép» khai bốn đường nhưng ca đỏ chỉ tiêm dạng chuỗi 'allow'**
  Người dùng thấy gì: Phép thử cho chốt chặn 'lớp mở rộng không được tự trả lời thay người' mới thử một trong bốn cách viết đã khai. Nếu ba cách còn lại hỏng thì không phép thử nào đỏ, nên hai trong bốn đường tự duyệt thay người chưa có bằng chứng chặn.
  file: `tests/dieu-phoi/doi-tai-khoan.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (lời hứa là QUAN HỆ, chỉ đo một điểm): cham_lai_cung_round «theo status hồ sơ» chỉ thử với status implemented**
  Người dùng thấy gì: Dấu 'chấm lại cùng vòng' trên bản bàn giao mới được thử với một trạng thái hồ sơ. Nếu logic sai ở trạng thái khác thì phép thử vẫn xanh, và bản bàn giao có thể khuyên chấm lại cùng vòng sai.
  file: `tests/dieu-phoi/doi-tai-khoan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (quan hệ đo ở giá trị suy biến): co_wip trong DP4-06 tu-git luôn false ở mọi hàng**
  Người dùng thấy gì: Dấu hiệu 'có bản lưu dở' trên bản bàn giao chưa từng được thử ở trường hợp thật sự có bản lưu dở. Nếu nó luôn báo không có thì phép thử vẫn xanh.
  file: `tests/dieu-phoi/doi-tai-khoan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: hai quan hệ argv/cwd mà AC-12(a) hứa không được so — ca mod chỉ đếm số lời gọi**
  Người dùng thấy gì: Phép thử cho phần đọc mức dùng của lớp mở rộng chỉ đếm số lần gọi, không so mã phiên và thư mục làm việc được truyền đi. Nếu sai một trong hai thì lần đọc có thể rơi vào đợt khác mà phép thử vẫn xanh.
  file: `tests/dieu-phoi/kiem-mod.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): DP4-14 ban-giao-md grep lời mô tả câu báo trong .md, còn câu thật là trường `tin` do code sinh**
  Người dùng thấy gì: Phép thử câu báo chủ kho chỉ kiểm lời dặn trong tài liệu lệnh, không kiểm câu mà chủ kho thực sự nhận. Nếu câu thật đổi sang đường dẫn không dùng được sau khi đổi tài khoản thì phép thử vẫn xanh.
  file: `tests/dieu-phoi/doi-tai-khoan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp): ca đỏ DP4-15-do chỉ ghim tiền tố 'câu 6', nên phép kiểm ánh xạ nhánh không có chiều đỏ**
  Người dùng thấy gì: Phép thử đối chiếu kết quả đo ban đầu với nhánh đã chọn chỉ kiểm chữ 'câu 6', chưa chứng minh bước so nhánh bắt được lệch. Nếu bỏ phần so nhánh đi thì phép thử vẫn xanh.
  file: `tests/dieu-phoi/doi-tai-khoan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): DP4-07 dau-phien-cu chỉ kiểm «HEAD không đổi» trên một hook nuốt mọi lỗi và luôn thoát 0**
  Người dùng thấy gì: Phép thử 'phiên cũ chết thì không lưu việc của thợ mới' chỉ kiểm không có bản lưu mới. Lưới an toàn bỏ qua đúng và lưới an toàn lỗi giữa chừng cho cùng một kết quả xanh, nên không biết nó đang tắt đúng hay hỏng.
  file: `tests/dieu-phoi/doi-tai-khoan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: DP4-01 bang-chuyen xếp mọi ô thoát khác 0 (băm không đổi) là «tu-choi», không ghim mã 1 hay thông điệp bảng chuyển**
  Người dùng thấy gì: Phép thử các chuyển trạng thái bị cấm coi mọi lỗi như 'bị từ chối đúng'. Một ô bị chặn vì lý do khác với bảng chuyển vẫn qua, nên không chứng minh chính bảng chuyển là thứ chặn.
  file: `tests/dieu-phoi/doi-tai-khoan.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (đường dẫn hardcode, đo checkout của máy tác giả): vế 5 của chay.sh đọc $HOME/dev/<kho> và im lặng bỏ qua khi vắng**
  Người dùng thấy gì: Bản kiểm cuối đọc hai kho theo đường cố định trên máy của tác giả và lặng lẽ bỏ qua khi vắng. Chạy trên máy khác vẫn báo xanh dù không đo kho nào.
  file: `_acceptance/xuat-du-lieu-lo-trinh/uat/chay.sh`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 5: quet-ma-lt1 tuyên quét MỌI dòng, nhưng danh sách cho-phép không tách theo loại và một mảnh rỗng miễn trọn tệp ngay.ts**
  Người dùng thấy gì: Bộ quét mã của phiên nghiệm thu xuất dữ liệu lộ trình miễn trừ trọn một tệp và không tách theo loại dấu hiệu, nên một dòng ghi hoặc đọc sai có thể lọt mà không bị bắt.
  file: `_acceptance/xuat-du-lieu-lo-trinh/uat/quet-ma-lt1.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 7/26 lỗi rơi vào file không bộ đo nào phủ (_acceptance/xuat-du-lieu-lo-trinh/uat/chay.sh, dieu-phoi/scripts/moi-truong.mjs, dieu-phoi/scripts/goi-dot.mjs, feature-loop/scripts/trong-dot.mjs, _acceptance/xuat-du-lieu-lo-trinh/uat/quet-ma-lt1.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
