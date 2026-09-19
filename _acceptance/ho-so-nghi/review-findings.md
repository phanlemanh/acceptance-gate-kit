## Trong hợp đồng

### Bản đồ và bộ quét xếp cùng một hồ sơ nghỉ vào HAI nhóm khác nhau — vị từ nghỉ đặt ở hai vị trí khác nhau trong hai pipeline
- file: `scripts/product-map.mjs:226`
- severity: high
- AC: AC-5
- detail: start-scan.mjs runs the nghi predicate at line ~318, immediately after reading `status` and BEFORE the UAT-verdict branch and before opportunity/uat record-problem checks. product-map.mjs runs it at line 226, AFTER `recordProblem() || missingArtifact() || conflictProblem()` and AFTER `if (verdict) return { key: 'da-nghiem-thu' … }`. Same predicate, same inputs, two different answers — exactly the two-reader drift lib/workspace-record.cjs's own header says it exists to close ("BỐN bên đọc … phải cho CÙNG một câu trả lời").

  Two reachable shapes, both reproduced on code-generated fixtures:

  (1) signed-off record + uat-session.md `verdict: release` + signed evidence-report.md + a valid nghi line in decisions.jsonl:
      start-scan → `done demo da-nghi` (bucket da-ship, "Đã giao")
      product-map → PRODUCT-MAP.md prints it under "## Đã nghiệm thu giá trị"
      gate-card follows start-scan (it reads scanHit), so the card says "đã nghỉ" while the map says "đã nghiệm thu — giao rộng".

  (2) signed-off record + signed report + valid nghi line + opportunity.md with `stage: bung-bét` (bad enum):
      start-scan → `done demo da-nghi`, `broken: []`
      product-map → "- `demo` — không đọc được hồ sơ (`opportunity.md`): stage không nhận diện được: bung-bét"

  The HSN5-map case in tests/scripts/ho-so-nghi.test.mjs only covers the two shapes where the two readers happen to agree (plain signed / unsigned), so the matrix is green while the invariant is broken. Fix: call hoSoNghi at the same point in both pipelines (either both before the verdict/problem checks, or both after).
- source: bugs

### Hình dạng 4 — HSN10 chiều «mở-lại» đo thẻ bằng MỘT assert vắng-mặt, thẻ vỡ đọc thành «đã lật»
- file: `tests/scripts/ho-so-nghi.test.mjs:426`
- severity: low
- AC: AC-10
- detail: Dòng 426–427, ô `mở-lại`, vế thẻ là `!ha10.includes('đã nghỉ')` — thuần vắng mặt. `the()` (dòng 108–110) trả `stdout || ''` và KHÔNG xem mã thoát, nên gate-card.js chết (lib ném lỗi, sai slug, exit khác 0 với stdout rỗng) cũng cho `''`, và `''.includes('đã nghỉ') === false` → ô này XANH.

  Ba bộ đọc kia trong cùng ô đều có vế dương ghim thông điệp (`ga.out.includes(CHUOI.eval)`, `ra.out.includes('REPIN x')`, `sa.stateKey === 'da-giao'`); riêng bộ đọc thứ tư thì không. Khuôn đúng đã có sẵn trong chính tệp — `bonBoDoc` ở HSN7 (dòng ~487) phân biệt `'mời-ký'` với `'RỖNG-HOẶC-LẠ'`, và HSN11 (dòng 404–406) đòi `h.includes(MOI_KY_HANG)`. HSN10 là chỗ duy nhất bỏ vế ấy, trong khi E11 tuyên «bốn bộ đọc cho đúng kết quả HSN0(c) (… · thẻ mời ký)» — thẻ MỜI KÝ là điều E11 khai nhưng không dòng nào assert.
- source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **recheck-evidence.cjs require lib/workspace-record.cjs KHÔNG bọc — trái nếp của chính tệp và trái lưới vừa dựng ở pre-merge cùng lượt**
  Người dùng thấy gì: Ở một số kho chỉ cài đặt phần tối giản của công cụ, bước kiểm bằng chứng có thể dừng đột ngột với lỗi khó hiểu thay vì một cảnh báo rõ ràng, khiến người tưởng nhầm là bằng chứng có vấn đề thật sự.
  file: `scripts/recheck-evidence.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hai cờ mới của bộ quét (nghi-chua-ky, nghi-kieu-cu) không bộ đọc mặt người nào in ra**
  Người dùng thấy gì: Khi một hồ sơ nghỉ chưa hội đủ điều kiện, người xem màn hình chờ ký có thể không thấy lý do vì sao hồ sơ đó vẫn bị chặn, dù máy đã biết lý do.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Loại dòng sổ `nghi` và trường `by` không có trong lược đồ đã khai; lời khai «ledger không bao giờ override» nay sai**
  Người dùng thấy gì: Tài liệu hướng dẫn viết dòng sổ quyết định ở một số nơi chưa được cập nhật, nên người đọc đúng chỗ đó có thể không biết cách ghi hồ sơ nghỉ hoặc hiểu nhầm sổ quyết định không bao giờ ảnh hưởng tới phán quyết.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **`id` không nằm trong NGHI_VE nhưng đường mở lại phụ thuộc nó — dòng nghỉ không id miễn cổng vĩnh viễn**
  Người dùng thấy gì: Nếu người ghi dòng cho một hồ sơ nghỉ mà quên điền mã nhận diện, sau này có thể không có cách nào mở lại hồ sơ đó bằng thao tác thông thường, dù đã hết lý do tạm nghỉ.
  file: `lib/workspace-record.cjs`
  severity: medium
  Đề xuất: known-limits

- **Khoá eval `hsn_rang` không ghim dòng PASS của ca nó gọi tên, khác mọi khoá láng giềng cùng khối**
  Người dùng thấy gì: Nếu một phần chức năng nghỉ hồ sơ bị xóa nhầm sau này, bộ kiểm tra tự động của tính năng này có thể vẫn báo ổn, khiến lỗi lọt qua mà không ai nhận ra ngay.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **recheck-evidence.cjs now hard-requires lib/workspace-record.cjs — every PASS report crashes with exit 1 in repos that vendored only evidence-core**
  Người dùng thấy gì: Ở kho chỉ cài phần tối giản của công cụ, việc kiểm lại bằng chứng cho một báo cáo đạt có thể dừng đột ngột với lỗi khó hiểu, khiến người tưởng nhầm là bằng chứng có vấn đề thật sự.
  file: `scripts/recheck-evidence.cjs`
  severity: high
  Đề xuất: new-contract

- **Dòng nghỉ không có `id` được chấp nhận nhưng KHÔNG BAO GIỜ gỡ bỏ được — miễn cổng vĩnh viễn, im lặng**
  Người dùng thấy gì: Một dòng cho một hồ sơ nghỉ mà thiếu mã nhận diện sẽ khiến hồ sơ đó không bao giờ mở lại được bằng thao tác bình thường, ngay cả khi lý do tạm nghỉ đã hết hiệu lực.
  file: `lib/workspace-record.cjs`
  severity: medium
  Đề xuất: known-limits

- **Cờ `nghi-chua-ky` và `nghi-kieu-cu` không có bộ đọc mặt người nào — sinh ra rồi rơi im lặng**
  Người dùng thấy gì: Khi một hồ sơ được ghi là nghỉ nhưng chưa có chữ ký hợp lệ, hoặc thuộc kiểu lưu trữ cũ, người xem màn hình trạng thái sẽ không thấy dòng giải thích vì sao — dễ hiểu nhầm về tình trạng thật của hồ sơ.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — phép đo bản đồ không có chiều đỏ: gỡ TRỌN nhánh nghỉ của product-map.mjs, HSN5-map vẫn xanh**
  Người dùng thấy gì: Nếu phần xử lý hồ sơ nghỉ trong bản đồ tổng quan bị xoá nhầm ở một lần sửa sau này, bộ kiểm tự động sẽ không phát hiện ra, khiến lỗi có thể lọt đến người dùng mà không ai hay biết.
  file: `tests/scripts/ho-so-nghi.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — đối chứng nền của HSN9 KHÔNG BAO GIỜ CHẠY: start-scan bản nền exit 2, stdout rỗng, phép so thành hằng đúng**
  Người dùng thấy gì: Phép kiểm dùng để bảo đảm không có hồ sơ nào bị hỏng thêm hiện không thực sự chạy được, nên lời cam kết đó chưa có bằng chứng thật kiểm chứng.
  file: `tests/scripts/ho-so-nghi.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 + 5 — executor `hsn_rang` chỉ đọc mã thoát: mười eval dùng CHUNG một lệnh nhưng KHÔNG ghim dòng PASS nào như evals.yaml tự khai**
  Người dùng thấy gì: Nếu một phần bài kiểm tra của tính năng nghỉ hồ sơ bị xóa nhầm, hệ thống kiểm tra tổng thể vẫn có thể báo mọi thứ ổn, nên lỗi có nguy cơ không được phát hiện kịp thời.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

Carried từ round 2 (T5 — tệp không đổi, KHÔNG chấm lại round này):

- **Assertion ghim mã thoát, không ghim thông điệp — chín eval script cùng một lệnh trần, chỉ exit 0 được máy kiểm (r2)**
  Người dùng thấy gì: Một số phép kiểm tự động của tính năng này chỉ xác nhận rằng chương trình không báo lỗi, chứ không thực sự xác nhận đúng nội dung mong đợi — dễ để lọt những trường hợp tưởng đã kiểm đúng nhưng thực ra chưa kiểm gì cả.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/13 lỗi rơi vào file không bộ đo nào phủ (feature-loop/skills/feature-loop/SKILL.md, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
