## Trong hợp đồng

### 1. Dòng quan sát thiếu `id` làm khoá việc thước (AC-10) mở im lặng
- file:line: `lib/workspace-record.cjs:734`
- severity: high
- AC: AC-10
- source: conventions
- detail: `THUC_TE_VE = ['by','at','build_sha','decision']` không đòi `id`, nên một dòng `thuc-te` không có id vẫn được `thucTe()` nhận là `kieu: 'dong-so'` hợp lệ. Sau đó `checkThucTe` gọi `git log ... -S tt.id` với `tt.id === ''`. Git từ chối chạy (tôi đã đo: `error: -S requires a non-empty argument`), `catch` nuốt lỗi, `moc = ''`, và cả nhánh kiểm «thước đổi sau dòng quan sát» bị bỏ qua. Hàm trả `code 0 OK`, nên pre-merge in NOTE xanh và recheck exit 0 dù evals.yaml hoặc rang/ đã đổi sau lúc quan sát. Đây là thiếu validation ở ranh giới hệ thống (dòng sổ do người hoặc máy viết tay theo khuôn THUC-TE-LINE, mà khuôn đó cũng không có trường id). Lỗi nuốt câm cũng biến «khoá» thành fail-open, trái với luật xử lý lỗi và nguyên tắc «thiếu lớp thì ĐÓNG» chính các khối mới tự tuyên bố. Hướng sửa: thêm `id` vào THUC_TE_VE (hoặc vào khối THUC-TE-LINE của commands/observed.md), và coi trường hợp không tìm được mốc là KHOA hoặc THIEU chứ không phải OK.
- rationale: AC-10 yêu cầu khi evals.yaml hoặc rang/** đổi sau dòng quan sát phải ra VIOLATION «khoá việc thước»; finding cho thấy điều kiện này lặng lẽ trả OK, tức đúng phần AC-10 thất bại.

### 2. Khoá việc thước của hồ sơ «đã chấm bởi thực tế» tắt im lặng khi dòng thuc-te không có id
- file:line: `lib/workspace-record.cjs:525`
- severity: high
- AC: AC-10
- source: bugs
- detail: `checkThucTe` tìm commit ghi dòng quan sát bằng `git log -S tt.id`. `thucTe()` không đòi `id` (THUC_TE_VE = by/at/build_sha/decision), nên dòng thiếu id vẫn hợp lệ và trả `id: ''`. Gặp `-S ''`, git thoát 129 (`error: -S requires a non-empty argument`). Lỗi này bị `catch { moc = ''; }` nuốt, nên nhánh KHOA bị bỏ qua và hàm trả OK. Tôi tái hiện trong một kho tạm: dòng thuc-te không có id, rồi commit sửa `_acceptance/x/evals.yaml` sau dòng quan sát. Kết quả là `OK a5c290a 2026-09-20 M`, rc=0. Đối chứng dương: cùng kịch bản nhưng có `"id":"d-1"` thì ra `KHOA _acceptance/x/evals.yaml`, rc=4. Hệ quả: lưới trước-merge (mã 0 → NOTE + continue) và recheck-evidence đều cho qua một hồ sơ đã sửa thước sau khi reality chấm. Khối THUC-TE-LINE trong commands/observed.md cũng không có khoá id (chỉ dặn bằng lời là lấy id từ DEC-ID-RECIPE). Cách sửa: đưa `id` vào THUC_TE_VE, hoặc để id rỗng / git lỗi trả mã khác 0 (đóng), không phải OK.
- rationale: Cùng cơ chế thất bại với finding #1 trên chính yêu cầu «khoá việc thước» của AC-10 — một dòng thuc-te thiếu id khiến VIOLATION bắt buộc không xuất hiện.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hồ sơ nhảy thẳng draft → da-cham-boi-thuc-te qua cả Cổng 1 lẫn Cổng 2; câu «never from draft» của hook không có mã nào giữ**
  Người dùng thấy gì: Một hồ sơ có thể bị đánh dấu 'đã chấm bởi thực tế' và gộp vào sản phẩm chính mà chưa từng qua bước phê duyệt ban đầu, nên có nguy cơ một thay đổi chưa kiểm tra kỹ lọt vào bản phát hành.
  file: `hooks/acceptance-evidence-gate.js`
  severity: high
  Đề xuất: known-limits

- **Hook tự khai «never from draft» cho da-cham-boi-thuc-te nhưng evaluateContractWrite không chặn; lưới trước-merge còn bỏ qua mọi luật Cổng 1**
  Người dùng thấy gì: Một luật bảo vệ mà tài liệu nói đang bật thực ra không chặn được gì, nên hồ sơ chưa qua vòng duyệt đầu tiên vẫn có thể được đưa thẳng vào sản phẩm chính.
  file: `hooks/acceptance-evidence-gate.js`
  severity: medium
  Đề xuất: known-limits

- **thuoc-vat --write bỏ qua phép so thước chỉ-đọc khi đọc hoặc parse tệp args lỗi, kể cả khi --args được truyền tường minh**
  Người dùng thấy gì: Nếu tệp cấu hình phụ trợ bị hỏng hoặc trỏ sai đường dẫn, công cụ kiểm tra độ lệch dữ liệu có thể im lặng bỏ qua việc so sánh thay vì báo lỗi, khiến một số thay đổi ngoài ý muốn không bị phát hiện.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): mutant «một nguồn» của NL-AC10-lanh đo trên bản sao kit nhưng không có đối chứng dương trên chính bản sao đó và không ghim thông điệp**
  Người dùng thấy gì: Một số bài kiểm tra tự động nội bộ có thể báo 'đạt' ngay cả khi bản sao dùng để kiểm tra bị hỏng vì lý do khác, nên không thể chắc chắn tính năng thật sự hoạt động đúng như mô tả.
  file: `tests/scripts/ntr-luoi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): NL-AC8-mot-nguon (a) chỉ xét mã thoát trên bản sao kit bị tiêm, còn (b) chỉ ghim chuỗi «E2»**
  Người dùng thấy gì: Một bài kiểm tra tự động khác cũng có thể báo 'đạt' dù không thực sự chứng minh được lỗi đã được phát hiện đúng, làm giảm độ tin cậy của bằng chứng trước khi phát hành.
  file: `tests/scripts/ntr-luoi.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có mục nào trong vòng này.

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (hooks/acceptance-evidence-gate.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
