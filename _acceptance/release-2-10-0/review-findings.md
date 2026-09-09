## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **K8 thu hẹp làn conventions là fail-open không để lại vết: bỏ chấm file mà không hỏi round trước có thật sự chấm chưa**
  Người dùng thấy gì: Nếu một vòng rà soát trước đó bị lỗi hạ tầng và không chạy xong, các phần mã không đổi file có thể không bao giờ được rà soát lại trong suốt vòng lặp, nhưng hệ thống vẫn báo đạt — người quyết có thể tin nhầm một phần mã chưa từng được kiểm thật.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **`feature_loop.ship_default` là khoá config không bộ đọc máy nào đọc, và phép đo của nó chỉ grep chính tài liệu hướng dẫn**
  Người dùng thấy gì: Người dùng thiết lập tuỳ chọn cách ship mặc định trong file cấu hình, nhưng chưa có phần nào của hệ thống thực sự đọc và áp dụng lựa chọn đó — hành vi ship tự động có thể không theo đúng thiết lập đã khai.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **gate-card.js đọc `surfaces` bằng HAI parser frontmatter khác nhau trong cùng một thẻ, phá lời khai «một nguồn» của lop-nhin-thay.cjs**
  Người dùng thấy gì: Với vài cách viết hợp đồng rất hiếm gặp (ví dụ khoảng trắng thừa trước dấu hai chấm), hai phần của công cụ có thể đưa ra hai kết luận khác nhau về việc tính năng có cần kiểm giao diện hay không, gây nhầm lẫn nhỏ khi người ký đọc thẻ quyết định.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: wont-fix

- **Gate-2 card silently skips the ui-observed check when lib/lop-nhin-thay.cjs is missing (Gate 1 and pre-merge both warn)**
  Người dùng thấy gì: Nếu một kho dự án chưa cập nhật đủ file mới của bản phát hành, bước kiểm ở Cổng 2 sẽ âm thầm bỏ qua việc kiểm bằng chứng giao diện thay vì báo không kiểm được, khiến người ký có thể tưởng nhầm là tính năng đó không cần kiểm.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **lop-nhin-thay.frontLine cannot read frontmatter preceded by a blank line, unlike evidence-core.frontmatterField — the whole ui-observed law goes quiet**
  Người dùng thấy gì: Nếu tài liệu mô tả một tính năng có một dòng trống thừa ở đầu file, công cụ kiểm có thể âm thầm coi tính năng đó là không có giao diện người dùng cần kiểm và không báo lỗi gì — bỏ sót một bước kiểm quan trọng trong im lặng.
  file: `lib/lop-nhin-thay.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 — chiều đỏ của PV5 là assert vô điều kiện (không bao giờ đỏ được)**
  Người dùng thấy gì: Một bài kiểm tra nội bộ của bộ công cụ hiện không thực sự phát hiện được khi phép quét lỗi bị hỏng — nó luôn báo đạt bất kể phép quét có hoạt động đúng hay không; hạn chế này đã được ghi sổ để xử lý ở đợt sau.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 — fixture usage-report viết tay đúng khuôn bên đọc, không round-trip từ wf-usage.mjs**
  Người dùng thấy gì: Dữ liệu mẫu dùng để kiểm công cụ đo hiệu suất được viết tay thay vì lấy từ đầu ra thật của hệ thống, nên nếu định dạng đầu ra thật thay đổi, số liệu hiệu suất hiển thị cho người dùng có thể âm thầm sai mà bài kiểm tra này không phát hiện ra.
  file: `tests/scripts/loop-health.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — lời khai của E11 neo `origin/main` (ref trôi) trong khi mã đo neo SHA cố định**
  Người dùng thấy gì: Tài liệu mô tả cách một bài kiểm tra cũ (đã được ký duyệt) chạy không còn khớp với cách nó thực sự chạy trong mã; ai đọc lại tài liệu đó để dựng một kiểm tra tương tự trong tương lai có thể vô tình tái tạo đúng lỗi đã được sửa trước đó.
  file: `_acceptance/duong-lui-phai-song/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — mệnh đề (iii) của LNT6 có một vế luôn đúng, section rỗng vẫn xanh**
  Người dùng thấy gì: Một bài kiểm tra nội bộ vẫn có thể báo đạt ngay cả khi nội dung hướng dẫn quan trọng trong tài liệu bị xoá trống, do cách so khớp văn bản chưa đủ chặt — rủi ro thực tế thấp vì tình huống này hiếm khi xảy ra.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
