# Review findings: dieu-phoi-dong-goi-loi (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Test lõi chép từ crm mang chuỗi riêng của kho tiêu thụ (onehub, prisma, kho 'crm'). Phép quét AC-7 không phủ thư mục này**
  Người dùng thấy gì: Một số bài kiểm tra đi kèm gói vẫn còn nhắc tên nhánh và đường dẫn riêng của kho sản phẩm cũ. Người dùng gói không bị ảnh hưởng, nhưng lời hứa gói không chứa gì riêng của một kho chưa được kiểm ở phần bài kiểm tra.
  file: `tests/dieu-phoi/loi/mau-thu.mjs`
  severity: medium
  Đề xuất: known-limits

- **DP1-11: vế «khoá s4 đang giữ bị cấp lại» không bao giờ đỏ được, vì không có đơn s4 nào trong xin/**
  Người dùng thấy gì: Bài kiểm tra nói rằng khoá chấm S4 đang có người giữ sẽ không bị đem cho người khác sau khi gói bị xoá giữa đợt, nhưng thực tế bài kiểm tra không có ai xếp hàng xin khoá đó nên nó không thể báo lỗi. Nếu lỗi thật xảy ra, hai lượt chấm có thể chạy chồng nhau mà không ai biết.
  file: `tests/dieu-phoi/dong-goi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **nhanhMo fails open: when gh/git fails, cham-tep requests are approved with the reason that no open branch touches the file**
  Người dùng thấy gì: Khi công cụ kiểm tra các nhánh đang mở bị lỗi (chưa đăng nhập, hết thời gian chờ), hệ thống vẫn tự duyệt cho phiên khác sửa tệp mà không báo gì. Hai phiên có thể sửa cùng một tệp, và lý do ghi lại nói ngược với điều thực sự đã kiểm.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: high
  Đề xuất: new-contract

- **nhanhCua is stubbed to always return null, so a session's own open PR branch counts as a conflict and escalates its own cham-tep**
  Người dùng thấy gì: Khi một phiên làm việc xin sửa lại tệp mà chính nhánh đang mở của nó đã sửa, hệ thống coi như xung đột và gọi người hoặc giám sát vào xử lý. Người dùng phải trả lời những câu hỏi lẽ ra không cần hỏi.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **Heartbeat hook stops entirely on any stray file in khoa/ (e.g. .DS_Store), the error is swallowed, and the active S4 lock gets revoked**
  Người dùng thấy gì: Nếu máy tự tạo một tệp lạ (như .DS_Store của Finder) trong thư mục khoá, tín hiệu còn sống của phiên chấm S4 ngừng được ghi mà không báo lỗi. Hết hạn thuê, khoá bị thu hồi khi lượt chấm còn đang chạy, và hai lượt chấm có thể chạy đè lên nhau.
  file: `dieu-phoi/scripts/hook-nhip.mjs`
  severity: medium
  Đề xuất: new-contract

- **pid-file liveness check trusts any live process with that pid: after pid reuse, `chay` refuses to start and `dung`/`dong` SIGTERM an unrelated process**
  Người dùng thấy gì: Sau khi máy khởi động lại hoặc bộ phát lịch chết đột ngột, nếu số hiệu tiến trình cũ được gán cho một chương trình khác thì lệnh bắt đầu đợt sẽ từ chối chạy, và lệnh dừng có thể tắt nhầm chương trình đó. Trường hợp này hiếm nhưng khi xảy ra thì không ai được cấp khoá nữa.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (và 3): E3 nói «chạy trọn 84 ca lõi» nhưng chỉ so tổng «# pass ≥ 84» trên một suite có cả ~30 ca DP1**
  Người dùng thấy gì: Cổng kiểm tra chỉ đếm tổng số bài đạt, nên nếu một nhóm bài kiểm tra lõi bị đổi tên hoặc xoá thì cổng vẫn xanh nhờ các bài khác bù vào. Lỗi trong phần lõi có thể lọt qua mà không ai thấy.
  file: `tests/dieu-phoi/chay-buoc-ci.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): DP1-11 ban-theo-dot kiểm «khoá s4 đang giữ không bị cấp lại» nhưng phép đo không thể đỏ**
  Người dùng thấy gì: Bài kiểm tra khẳng định khoá chấm S4 đang giữ không bị cấp cho người khác, nhưng không có ai xin khoá đó nên bài luôn xanh dù hệ thống đúng hay sai. Lời bảo đảm này chưa được chứng minh.
  file: `tests/dieu-phoi/dong-goi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: DP1-04 an-danh lấy danh sách tệp và luật đổi tên khoá từ chính module bị đo, không ghim số tệp mình đã dựng**
  Người dùng thấy gì: Bài kiểm tra bản chụp đợt cũ tự lấy danh sách tệp cần chép và cách đổi tên từ chính chương trình đang được kiểm. Nếu chương trình đó bỏ sót một thư mục thì bài vẫn xanh, và một bản chụp thiếu dữ liệu có thể trông như hợp lệ.
  file: `tests/dieu-phoi/dong-goi.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
