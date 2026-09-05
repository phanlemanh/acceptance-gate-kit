## Trong hợp đồng

- **Assertion âm-tính-một-mình — vế «tập file mã đổi = {s4-args.mjs}» của check_lane không có đối chứng dương**
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:78`
  severity: medium
  AC: AC-6
  detail: E6 hứa hai vế: (a) acceptance-verify.js diff rỗng, (b) tập file đổi sau khi lọc `grep -vE '^(tests/|docs/|skills/|feature-loop/skills/|_acceptance/|\.github/|PRODUCT-MAP\.md$)'` BẰNG đúng {feature-loop/scripts/s4-args.mjs}. Chiều đỏ trên clone (dòng 139–140) chỉ tiêm vào acceptance-verify.js, và vì check_lane `return 1` ngay ở vế (a) nên vế (b) không bao giờ được chạy trong chiều đỏ. Vế (b) là một khẳng định âm tính («không có file mã nào khác đổi») chỉ được đo trên cây thật: nếu bộ lọc `grep -vE` quá rộng (vd một mẫu khớp nhầm cả `feature-loop/scripts/…` hay `lib/…`), `changed` vẫn rút về đúng một phần tử và chân vẫn xanh. Không có mũi tiêm nào (thêm một file ngoài tập trắng, vd `lib/x.mjs`, vào clone) chứng minh bộ lọc BẮT được file lạ, cũng không ghim thông điệp «tập file mã đổi ≠» cho vế này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **New glossary term «dossier» introduced in engine docs without a CONTEXT.md entry; established English term is «workspace»**
  Người dùng thấy gì: Tài liệu dùng một từ mới chưa được định nghĩa ở nơi tra cứu chung, người đọc sau có thể hiểu nhầm khái niệm.
  file: `skills/acceptance/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **New permanent test never removes its tmpdir, unlike its sibling**
  Người dùng thấy gì: Mỗi lần chạy kiểm thử để lại một thư mục tạm không bị xoá, tích luỹ dần và có thể làm đầy ổ đĩa máy chạy theo thời gian.
  file: `tests/scripts/s4-args-judgment-inputs.test.mjs`
  severity: low
  Đề xuất: known-limits

- **existsSync cho thư mục đi lọt — input trỏ vào thư mục vẫn sinh args, hội đồng nhận đường không đọc được**
  Người dùng thấy gì: Nếu ai khai nhầm một thư mục thay vì tên file làm input, hệ thống vẫn chạy tiếp và báo thành công thay vì báo lỗi, khiến hội đồng chấm âm thầm nhận dữ liệu không đọc được.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).