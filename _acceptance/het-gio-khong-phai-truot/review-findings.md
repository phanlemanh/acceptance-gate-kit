## Trong hợp đồng

(không có — round này không finding nào map được vào một AC cụ thể; cả bảy finding đều rơi vào "Ngoài hợp đồng" bên dưới)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **normKill chuẩn hoá ở 3 chỗ ĐỌC thay vì ở BIÊN — trái đúng pattern mà chính file này viết ra 80 dòng bên dưới**
  Người dùng thấy gì: Nếu sau này có thêm một nơi mới đọc kết quả kiểm tra mà quên xử lý riêng dấu hiệu 'bị công cụ dừng', tính năng có thể lại báo từ chối oan mà không ai nhận ra ngay, vì phần xử lý đó hiện nằm rải rác chứ không gom một chỗ.
  file: `feature-loop/workflows/acceptance-verify.js:509`
  severity: medium
  Đề xuất: known-limits

- **Phép rút RULE từ marker cắt tại backtick đầu tiên — thước tự cụt mà vẫn xanh**
  Người dùng thấy gì: Nếu sau này luật kiểm tra được viết lại và tình cờ chứa một dấu backtick, phần kiểm tra tự động có thể âm thầm bỏ sót đoạn luật phía sau dấu đó mà không báo lỗi, khiến người đọc lầm tưởng luật vẫn được kiểm đầy đủ.
  file: `tests/workflows/acceptance-verify.test.mjs:1482`
  severity: low
  Đề xuất: known-limits

- **TOOL-KILL-RULE chỉ vá lane trong workflow — đường verify của skill acceptance (standalone) vẫn nguyên lớp lỗi**
  Người dùng thấy gì: Khi chạy kiểm tra chấp nhận qua đường độc lập (không qua vòng lặp tính năng chính), một lệnh kiểm tra chạy lâu vẫn có thể bị hệ thống ngắt ngang chừng và bị hiểu nhầm thành lỗi thật, dẫn đến từ chối oan — đúng sự cố ban đầu đã xảy ra, chỉ là ở một đường vận hành khác chưa được vá cùng lượt này.
  file: `skills/acceptance/SKILL.md:220`
  severity: medium
  Đề xuất: new-contract

- **gap-probe.md P1 vẫn khai fixed bằng E8 — vật đã bị gỡ ở commit cuối**
  Người dùng thấy gì: Hồ sơ đang ghi rằng một biện pháp bảo vệ tự động vẫn còn tồn tại, trong khi thực tế nó đã được gỡ bỏ theo quyết định trước đó; người đọc hồ sơ này để ra quyết định có thể tin nhầm là vẫn còn máy kiểm tra khi thực ra chỉ còn lại lời cam kết của người.
  file: `_acceptance/het-gio-khong-phai-truot/gap-probe.md:16`
  severity: medium
  Đề xuất: known-limits

- **evidence-report r3 mô tả một cây không còn tồn tại (E8 PASS, chuỗi output rang.sh không thể in ra)**
  Người dùng thấy gì: Báo cáo bằng chứng của một lần kiểm tra trước đang mô tả một kết quả không còn khớp với mã nguồn hiện tại; nếu ai đó vô tình đọc đúng báo cáo cũ này để quyết định, họ có thể tin nhầm vào một phép kiểm không còn tồn tại.
  file: `_acceptance/het-gio-khong-phai-truot/evidence-report.md:25`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: E1 khai một chiều đỏ «chạy cùng lượt» mà vật đo không còn có**
  Người dùng thấy gì: Tài liệu mô tả bài kiểm đang khai rằng nó tự chạy thử một tình huống lỗi (đổi tên hạng mục) ngay trong lần kiểm này, nhưng thực tế lần kiểm gần nhất không còn làm việc đó; người đọc có thể tin nhầm khả năng bắt lỗi đã được tự chứng minh, trong khi nó chỉ được xác nhận thủ công một lần trước đó.
  file: `_acceptance/het-gio-khong-phai-truot/evals.yaml:14`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP «mọi lane chạy lệnh dài» nhưng chỉ có điểm-case trên danh sách 3 lane viết cứng**
  Người dùng thấy gì: Nếu sau này có thêm một nơi mới chạy lệnh kiểm tra dài mà người viết quên gắn luật 'không tính nhầm giờ công cụ giết là lỗi thật', bộ kiểm tra tự động hiện tại sẽ không phát hiện ra thiếu sót đó, và lỗi từ chối oan ban đầu có thể tái diễn ở nơi mới mà không ai biết.
  file: `tests/workflows/acceptance-verify.test.mjs:1519`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/7 lỗi rơi vào file không bộ đo nào phủ (skills/acceptance/SKILL.md, _acceptance/het-gio-khong-phai-truot/gap-probe.md, _acceptance/het-gio-khong-phai-truot/evidence-report.md, _acceptance/het-gio-khong-phai-truot/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
