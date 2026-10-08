# Review findings: xuat-du-lieu-lo-trinh (round 1)

## Trong hợp đồng

- **Tài liệu bảo «chép thẳng» docDuLieu, nhưng hàm phụ thuộc bảy ký hiệu khác trong module**
  AC: AC-11
  file: `skills/acceptance/references/lo-trinh-du-lieu.md:28`
  severity: medium
  source: conventions
  detail: Bước 3 viết: «Bản viết bằng JavaScript có thể chép thẳng bộ đọc mẫu `docDuLieu(html)` của `scripts/lo-trinh.mjs`». Thực tế `docDuLieu` (khối «Bộ đọc mẫu, KHOAN DUNG» trong scripts/lo-trinh.mjs) gọi `ID_DU_LIEU`, `PHIEN_BAN_DU_LIEU`, `vaKhuon`, `KHUON_DU_LIEU`, `rongCua`, `RONG` và `tienDoRong`, đều khai ở cấp module. Chép riêng hàm thì gặp ReferenceError ngay lần gọi đầu, trái lời hứa «không cần đọc mã kit» và trái mục «Đọc khoan dung» (bộ đọc không bao giờ được làm vỡ trang). Hướng sửa: (a) gói bộ đọc thành một khối tự đủ, đặt trong marker ở tài liệu kèm ca round-trip như khối LUAT-NGAY, hoặc (b) liệt kê đủ các ký hiệu phải chép kèm. Hướng (a) đúng nếp «marker một nguồn, writer/reader cùng rút» của CLAUDE.md.
  lý do vào hợp đồng: AC-11 đòi tài liệu đủ để kỹ sư kho khác làm mà không đọc mã kit; tài liệu bảo chép một hàm mà chép riêng thì chạy lỗi, buộc phải đọc mã kit.

- **Shape 3 (khẳng định có chuỗi/thuộc tính trong khi lời hứa là một quan hệ): LT-118 dung-khuon chỉ kiểm bộ đọc mẫu docDuLieu trả bao nhiêu lộ trình, không kiểm nó trả đúng dữ liệu của khối**
  AC: AC-9
  file: `tests/scripts/lo-trinh.test.mjs:1964`
  severity: high
  source: measurement
  detail: AC-9 hứa trên trang đúng khuôn, docDuLieu trả «dữ liệu đủ». Đó là một quan hệ: đầu ra của docDuLieu phải bằng khối bộ viết đã ghi. Assert chỉ là `x.duLieu && x.duLieu.lo_trinh.length === 3 && x.canhBao.length === 0` và không so với `khoiCua(tot)`, dù `const k = khoiCua(tot)` đã có sẵn trong phạm vi. docDuLieu chỉ được gọi ở LT-118 (grep trên tests/ và scripts/). Bốn ca còn lại chỉ kiểm canhBao và vài giá trị mặc định (hang[0].co == [], tien_do.tong == 0). Ví dụ: một mutant trong vaKhuon ghi đè mọi khoá ở cấp `hang` hoặc `tien_do` bằng giá trị rỗng (`if (!(k in ra) || cap === 'hang') ra[k] = rongCua(k)`) làm trống trang_thai, nhom_trang_thai và ho_so của mọi hàng. Cả năm ca LT-118 vẫn xanh vì số lộ trình vẫn là 3, cảnh báo vẫn 0, co vẫn [] và tien_do.tong vẫn 0. Trong khi tài liệu bảo kho tiêu thụ chép docDuLieu nguyên văn. Quan hệ cần assert là deq(x.duLieu, k) (khối có đủ khoá nên vaKhuon phải là phép đồng nhất).
  lý do vào hợp đồng: AC-9 hứa bộ đọc mẫu trả «dữ liệu đủ» với trang đúng khuôn, nhưng ca đo chỉ đếm số lộ trình và không so với khối; ca đo không chứng minh được vế này của AC-9.

- **Shape 5 (nói phủ cả ma trận nhưng ô thật khác): LT-120 công bố ngày trước · đúng ngày · ngày sau × hai múi giờ, nhưng đồng hồ 20:00Z đẩy mọi ca UTC+7 tới trước một ngày, nên UTC+7 không bao giờ thử ngày trước mốc**
  AC: AC-12
  file: `tests/scripts/lo-trinh.test.mjs:2029`
  severity: medium
  source: measurement
  detail: AC-12 và E12 hứa «hôm nay» cố định ở D−1, D và D+1, «mỗi ngày ở TZ=UTC và TZ=Asia/Ho_Chi_Minh (6 ca)». Vòng lặp dựng đồng hồ bằng `${ngay}T20:00:00Z` với ngay là 2030-03-14/15/16 và D = 2030-03-15. Ở Asia/Ho_Chi_Minh (+7), 20:00Z là 03:00 ngày kế, nên homNay cục bộ của tham chiếu (và của trang) là 15, 16 và 17, tức D, D+1 và D+2. Ô (D−1, UTC+7) không bao giờ chạy, thay vào đó chạy (D+2, UTC+7). Không assert nào kiểm tập homNay thực sự phủ so với ma trận đã khai (o.homNay chỉ được in ở `bang`), nên dòng PASS tuyên bố sáu ô mà có ô không được đo. Đối chứng dương `duong` đếm bất kỳ ca nào trang tô «Mốc Một», không phải riêng D+1 mỗi bên như E12 nêu.
  lý do vào hợp đồng: AC-12 nêu rõ sáu ca gồm ngày trước mốc ở cả hai múi giờ; ca ở UTC+7 không bao giờ rơi vào ngày trước mốc nên ma trận AC-12 không được đo đủ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tài liệu cho kho tiêu thụ nói sai cách thoát ký tự: «mọi `<` đã được viết thành `<`»**
  Người dùng thấy gì: Tài liệu hướng dẫn cho kho khác có một câu giải thích cách trang bảo vệ dữ liệu bị mất đúng ký hiệu then chốt, nên người đọc không hiểu vì sao cách cắt khối an toàn. Họ vẫn đọc được dữ liệu bằng cách thông thường, chỉ là phần giải thích bị khó hiểu.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: medium
  Đề xuất: known-limits

- **Phép chia nhóm tiến độ vẫn dựng hai lần, dù chú thích tuyên «MỘT hàm»**
  Người dùng thấy gì: Cách chia nhóm tiến độ đang được tính ở hai chỗ giống hệt nhau. Hiện hai chỗ khớp nhau và người xem không thấy khác biệt, nhưng sau này sửa một chỗ mà quên chỗ kia thì trang và dữ liệu đi kèm có thể lệch.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **LT-119 kiểm GUIDE trên cây KIT, không trên cây `kit` đang đo, và vế GUIDE không có chiều đỏ**
  Người dùng thấy gì: Việc kiểm tra rằng sổ tay hướng dẫn có trỏ tới tài liệu mới chưa từng được thử theo chiều ngược lại. Nếu ai đó xoá dòng trỏ đó đi, bộ kiểm tra có thể vẫn báo ổn.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Consumer doc says '<' is written as '<' (escape sequence lost)**
  Người dùng thấy gì: Tài liệu hướng dẫn cho kho khác có một câu giải thích cách trang bảo vệ dữ liệu bị mất đúng ký hiệu then chốt. Người viết bộ đọc bằng ngôn ngữ khác sẽ không biết quy tắc thật, dù việc đọc dữ liệu thông thường vẫn làm được.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: low
  Đề xuất: known-limits

- **E2/E8 say the comparison goes through docDuLieu, but the tests parse the block with their own JSON.parse**
  Người dùng thấy gì: Lời mô tả của bộ kiểm tra nói việc so sánh đi qua bộ đọc mẫu, nhưng thực tế kiểm tra đọc dữ liệu bằng cách riêng. Kết quả xanh có thể bị hiểu rộng hơn những gì đã thật sự được thử.
  file: `_acceptance/xuat-du-lieu-lo-trinh/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Shape 2 (round trip not read by the shipped reader): LT-117 parses the block with the test's own JSON.parse while E8 claims docDuLieu returns the original string**
  Người dùng thấy gì: Phép thử chuỗi có ký tự nguy hiểm đọc dữ liệu bằng cách riêng, không qua bộ đọc mẫu giao cho các kho khác. Nếu bộ đọc mẫu sau này đổi cách cắt khối, phép thử vẫn báo ổn.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (pinned message missing part of the promise): LT-111-do doi-trang-thai pins only the row code, not the two status words E2 requires**
  Người dùng thấy gì: Khi một hàng bị đổi trạng thái, thông báo lỗi chắc chắn nêu đúng hàng nhưng bộ kiểm tra không ép phải nêu cả hai trạng thái cũ và mới. Thông báo hiện tại vẫn đủ rõ, chỉ là chưa có gì giữ cho nó luôn như vậy.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
