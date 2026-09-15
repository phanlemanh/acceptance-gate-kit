## Trong hợp đồng

Findings: []

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **rang-ton-dong.sh KHÔNG đọc $@ — cờ `--chan ghim-lai` mà config truyền bị nuốt im lặng (fail-open đúng lớp rang-p200.sh vừa vá)**
  Người dùng thấy gì: Nếu sau này cấu hình đổi tùy chọn truyền cho phép kiểm tra hồ sơ cũ, hệ thống có thể vẫn báo 'đạt' một cách im lặng dù đang kiểm sai thứ được yêu cầu, khiến người ký duyệt tin nhầm vào bằng chứng.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hai răng MỚI thiếu «dấu bản răng» mà hai răng chép đều có — output ghim trong evidence-report KHÔNG phân biệt được bản nào đã chạy**
  Người dùng thấy gì: Khi phép kiểm tra hồ sơ cũ được sửa lại nhiều lần, bằng chứng lưu lại không cho biết lần chạy nào dùng phiên bản kiểm tra nào, nên về sau khó xác minh bằng chứng cũ còn đúng với hệ thống hiện tại hay không.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Lời khai toàn xưng «13–17 M ở MỌI lượt lành của cùng vòng» bị chính nguồn được trích phản chứng (lượt PASS = 50,2 M), và đã lan sang CHANGELOG**
  Người dùng thấy gì: Bản ghi thay đổi (CHANGELOG) và hồ sơ phát hành có một câu so sánh chi phí xử lý bị chọn lọc thiếu công bằng, có thể khiến người đọc hiểu nhầm mức tăng chi phí nhỏ hơn thực tế.
  file: `_acceptance/release-2-14-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **rang-ton-dong.sh nuốt trọn tham số — cờ `--chan ghim-lai` trong config là trang trí, rơi khỏi config vẫn xanh**
  Người dùng thấy gì: Nếu cấu hình sau này đổi hoặc bỏ tùy chọn khi gọi phép kiểm tra hồ sơ cũ, hệ thống vẫn âm thầm báo 'đạt' dù đang kiểm sai thứ được yêu cầu, khiến người ký duyệt tin nhầm vào bằng chứng không đúng.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: high
  Đề xuất: known-limits

- **`so_stale_toan_kho` không được đo với lưới — số sai vẫn xanh, và còn NỚI bộ lọc một-nguồn**
  Người dùng thấy gì: Một trong hai con số thống kê hồ sơ cũ (tổng số toàn kho, 71) là số ghi tay chưa từng được máy đối chiếu lại — nếu con số đó sai thì hiện chưa có cách nào tự động phát hiện.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **rang-moc.sh chỉ đo lịch sử đã commit — sửa diagram-design/ chưa commit vẫn cho PASS**
  Người dùng thấy gì: Nếu có thay đổi chưa lưu (chưa commit) trong phần thiết kế sơ đồ, phép kiểm 'không đổi gì' vẫn có thể báo đạt vì nó chỉ nhìn lịch sử đã lưu, bỏ sót thay đổi thật đang nằm trên máy người thao tác.
  file: `_acceptance/release-2-14-0/rang-moc.sh`
  severity: medium
  Đề xuất: known-limits

- **rang-so-tang.sh cũng không có chốt tham số — cùng lớp fail-open, chưa nổ vì config đang gọi trần**
  Người dùng thấy gì: Giống một lỗi khác trong cùng đợt: nếu sau này cấu hình truyền thêm tùy chọn cho phép kiểm tra số phiên bản tăng, hệ thống có thể âm thầm bỏ qua tùy chọn đó mà vẫn báo đạt.
  file: `_acceptance/release-2-14-0/rang-so-tang.sh`
  severity: low
  Đề xuất: known-limits

- **opportunity.md chép «42 hồ sơ» trong khi răng của cùng cửa sổ đo được 45**
  Người dùng thấy gì: Một tài liệu tham khảo nền (không thuộc phần việc của đợt phát hành này) đang ghi con số hồ sơ cũ đã lỗi thời (42 thay vì 45 hiện tại), có thể gây hiểu nhầm cho người đọc tài liệu đó sau này.
  file: `_acceptance/mot-nguon-tai-gui-triage/opportunity.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — lời khai của rang-ton-dong.sh vẫn tuyên quét LỚP ở header + bảng mã thoát, trong khi phép đo chỉ soi hai literal neo**
  Người dùng thấy gì: Phần mô tả trong công cụ kiểm tra tuyên bố soi toàn bộ văn bản hồ sơ, nhưng thực tế chỉ soi một phần nhỏ; nếu số liệu sai xuất hiện ở chỗ khác trong văn bản, phép kiểm có thể không phát hiện được dù mô tả nói là có kiểm.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — đối chứng dương (c) không ghim THÔNG ĐIỆP mà phép đếm phụ thuộc; nhánh «0 = 0» vẫn là đường xanh**
  Người dùng thấy gì: Phép kiểm 'phải phát hiện được lỗi' của công cụ chỉ chứng minh có dòng kết quả in ra, chứ không chứng minh đúng nội dung cần tìm — nếu hệ thống nền đổi cách báo lỗi, phép kiểm này có thể im lặng bỏ qua một trường hợp đáng lẽ phải báo lỗi mà không ai nhận ra.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Thước neo vào HEAD di động — con số 45 ghim trong hợp đồng đo trên cửa sổ moc..HEAD, hồ sơ đã ký sẽ đỏ ở lượt ghim lại kế (đúng lớp owner đã TRỪ khỏi rang-moc.sh)**
  Người dùng thấy gì: Cách đo cho hồ sơ này dùng mốc thời gian trôi theo hiện tại, nên một hồ sơ đã được duyệt xong có thể bị báo lỗi trở lại ở đợt kiểm tiếp theo dù không có gì sai thật với nội dung đã ký.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Fail-open ở lớp cấu hình — rang-ton-dong.sh nuốt im cờ `--chan ghim-lai` mà config và hợp đồng đều khai**
  Người dùng thấy gì: Nếu cấu hình sau này đổi tùy chọn truyền cho phép kiểm tra hồ sơ cũ, hệ thống vẫn có thể âm thầm báo 'đạt' mà không kiểm đúng thứ được yêu cầu.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Bằng chứng không tự phân biệt bản — hai răng mới thiếu DẤU BẢN RĂNG, và output E5 đã ghim là của một thân script không còn tồn tại**
  Người dùng thấy gì: Bằng chứng đã lưu cho một phép kiểm ghi lại đúng câu chữ của một phiên bản công cụ cũ, trong khi công cụ hiện tại đã đổi câu chữ — người đọc bằng chứng sau này có thể không biết mình đang xem kết quả của phiên bản nào.
  file: `_acceptance/release-2-14-0/evidence-report.md`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).