## Trong hợp đồng

- **Hình dạng 2 — kỳ vọng GL01 chép NGUYÊN VĂN công thức thay của bên viết, chỉ đổi nguồn khuôn**
  file: `tests/scripts/gate-card-goal.test.mjs:36`
  severity: low
  AC: AC-2
  detail: `expectLine = slug => SKILL_TPL.trim().split('\n').join(' ').split('<slug>').join(slug)` giống từng ký tự với `goalLine = s => GOAL_TEMPLATE.trim().split('\n').join(' ').split('<slug>').join(s)` ở scripts/gate-card.js:110. Comment dòng 31–33 nói đã thoát hình dạng 2 bằng cách lấy khuôn từ SKILL thay vì hằng gate-card, nhưng AC-2 ghi rõ «không chép hàm thay của bên viết» và phép biến đổi vẫn là bản chép — lỗi chung trong công thức (vd. cách gộp dòng) không bao giờ đỏ. Hai assert độc lập bên dưới (không còn `<slug>`, không còn `\n`) chỉ phủ một phần.
  rationale: AC-2 yêu cầu rõ "test dựng kỳ vọng bằng phép thay độc lập... không chép hàm thay của bên viết" — finding chỉ ra đúng công thức thay bị chép giống hệt bên viết, làm thất bại điều kiện này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thẻ bằng chứng của hồ sơ đã ký khoi-viec-cua-anh được sinh lại nhưng chưa ghim lại — pre-merge-check báo VIOLATION stale, CI job gate sẽ đỏ**
  Người dùng thấy gì: Gộp thay đổi này vào bản phát hành có thể khiến cổng kiểm tra tự động chặn việc hợp nhất, vì bằng chứng đã duyệt của một tính năng khác (đã ký trước đó) giờ bị coi là lỗi thời và cần được ký lại riêng trước khi gộp.
  file: `_acceptance/khoi-viec-cua-anh/evidence/p185-card-gate1.html`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ ĐÃ KÝ loi-moi-cong-may-sinh bị kéo vào diff (2 file dời đi) mà không để lại con trỏ «thay thế»**
  Người dùng thấy gì: Một hồ sơ bằng chứng đã được duyệt trước đây trỏ tới hai tệp tham chiếu vừa bị dời chỗ mà không để lại ghi chú thay thế, nên người đọc lại hồ sơ đó sau này có thể tìm không thấy tệp và không rõ vì sao.
  file: `_acceptance/loi-moi-cong-may-sinh/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Hợp đồng vu-trang-goal-luc-goi-ten còn ghi «điểm in S0» trong khi thiết kế đã bác S0 và AC-4/SKILL đặt điểm in ở S1#1**
  Người dùng thấy gì: Một dòng mô tả bối cảnh trong hồ sơ vẫn ghi vị trí cũ (đã bị bác khi thiết kế) thay vì vị trí thật sự áp dụng, có thể khiến người đọc thẻ quyết định hiểu nhầm chỗ tính năng thực sự có hiệu lực.
  file: `_acceptance/vu-trang-goal-luc-goi-ten/contract.md`
  severity: low
  Đề xuất: known-limits

- **LM20/LM13: bộ lọc «đã chốt» đứng TRƯỚC răng bắt sập → hồ sơ đang mở làm gate-card.js sập bị bỏ qua im lặng**
  Người dùng thấy gì: Nếu một hồ sơ đang trong quá trình xử lý (chưa ký xong) khiến bộ dựng thẻ bị lỗi, hệ thống kiểm tra tự động có thể không phát hiện ra và báo xanh nhầm, khiến lỗi đó lọt qua.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — P85b tuyên «13 vế nằm đúng mục» nhưng vòng kiểm vị trí bỏ qua im lặng vế không có trong VI_TRI; số 9+4 gõ tay**
  Người dùng thấy gì: Bài kiểm tự động tuyên đã kiểm đủ toàn bộ nội dung nhưng thực ra bỏ sót một phần — nếu sau này có người thêm nội dung mới vào tài liệu hướng dẫn mà quên cập nhật đúng chỗ, sai sót đó có thể không bị phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — bộ lọc `settled` mới trong LM13/LM20 fail-open (try/catch → false, `continue` im lặng), không có ca đối chứng riêng**
  Người dùng thấy gì: Phần lọc hồ sơ 'đã ký xong' trong bài kiểm tự động có thể âm thầm bỏ qua một hồ sơ nếu chữ ký của hồ sơ đó được ghi khác định dạng thường gặp, mà chưa có phép thử nào chứng minh điều đó không xảy ra.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
