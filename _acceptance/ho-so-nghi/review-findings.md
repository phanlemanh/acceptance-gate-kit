## Trong hợp đồng

### HSN9 assert «0 hồ sơ hỏng» tuyệt đối trên cây kit thật — chặt hơn AC-9, đỏ oan về sau
- file: `tests/scripts/ho-so-nghi.test.mjs:224`
- severity: low
- AC: AC-9
- detail: `check('HSN9 tập hồ sơ hỏng rỗng như hôm nay', (j.broken || []).length === 0, …)` gắn kết quả của suite này vào trạng thái toàn bộ `_acceptance/` của kho, trong khi AC-9 chỉ hứa «không hồ sơ nào rơi vào hồ sơ hỏng mà hôm nay không hỏng». Một hồ sơ khác về sau có frontmatter hỏng hay lỗi quyền đọc sẽ làm `hsn_rang` đỏ và trỏ nhầm vào tính năng này. Đo bằng QUAN HỆ (tập hỏng ⊆ tập hỏng ở sha nền) thay vì hằng số 0.
- source: conventions

### Assert một HẰNG trong khi lời hứa là QUAN HỆ với bản trước vòng (HSN9 / E9)
- file: `tests/scripts/ho-so-nghi.test.mjs:224`
- severity: medium
- AC: AC-9
- detail: E9 (`_acceptance/ho-so-nghi/evals.yaml`:116-117) hứa: «tập slug ở "hồ sơ hỏng" bằng tập trước vòng (so bằng nhau với danh sách rút từ HEAD~ qua git, không gõ tay)» — một QUAN HỆ giữa hai giá trị: tập broken của cây đang kiểm vs tập broken trước vòng.

  Test viết: `check('HSN9 tập hồ sơ hỏng rỗng như hôm nay', (j.broken || []).length === 0, …)` (dòng 224). Không có lần chạy nào trên bản trước vòng, không có danh sách rút từ git — chỉ một hằng `0`, kèm chú thích tự khai «rỗng như hôm nay». Phép đo vì thế (a) không chứng được điều nó tuyên (bản vá không làm hỏng thêm hồ sơ nào), (b) sẽ đỏ oan ngay khi kho có một hồ sơ hỏng vì lý do hoàn toàn khác. Đối chứng đúng tầng đã có sẵn ngay trên đó — dòng 220 đã rút `merge-base HEAD origin/main` — nhưng chỉ dùng cho ca cờ, không dùng cho tập broken.
- source: measurement

### Tập mong đợi rút từ CHÍNH hằng của vật bị đo → assert «không đẻ khối mới» không thể đỏ (HSN5-map / E5)
- file: `tests/scripts/ho-so-nghi.test.mjs:166`
- severity: medium
- AC: AC-5
- detail: Dòng 162-167 rút `TEN_KHOI` bằng regex trên chính `scripts/product-map.mjs` (`const SECTIONS = […]`), rồi assert `[mdNen, mdA, mdB].flatMap(khoi).filter(k => !TEN_KHOI.has(k)).length === 0`.

  Nhưng `renderProductMap` chỉ in tiêu đề `## ` từ đúng vòng lặp `for (const [key, title] of SECTIONS)` (scripts/product-map.mjs:302-304) — không có nguồn `## ` nào khác. Hai vế của phép so vì thế lấy từ MỘT nguồn và dịch chuyển cùng nhau: ai thêm một khối riêng cho trạng thái nghỉ sẽ thêm nó vào `SECTIONS`, `TEN_KHOI` lập tức chứa nó, `la` vẫn rỗng, ca vẫn xanh. Phép đo không có chiều đỏ cho đúng lớp nó gọi tên trong nhãn («trạng thái nghỉ không đẻ khối mới»).

  E5 (`evals.yaml`:66-67) hứa một QUAN HỆ giữa hai ĐẦU RA — «tập tiêu đề khối BẰNG tập khối của bản đồ fixture HSN0» — và `mdNen` (dòng 155) đã được dựng sẵn cho đúng phép so ấy; test lại thay nó bằng phép thuộc-tập lấy từ mã nguồn. Chú thích dòng 159-161 giải thích vì sao so hai bản đồ một-hồ-sơ là vô nghĩa, nhưng lối thoát đúng là fixture nhiều hồ sơ, không phải đổi sang một assert không đỏ được.
- source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bản đồ nhận dòng nghỉ THIẾU VẾ là nghỉ — hai bộ đọc trôi khỏi nhau, chiều sai là fail-open**
  Người dùng thấy gì: Một hồ sơ nghỉ ghi thiếu thông tin có thể khiến bản đồ tổng quan hiển thị nhầm là đã đóng trong khi hồ sơ thực ra vẫn đang mở, dễ gây hiểu lầm về tiến độ.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: known-limits

- **Đối chứng HSN9 ghim vào merge-base origin/main — chết ngay sau khi nhánh gộp, suite đỏ vĩnh viễn**
  Người dùng thấy gì: Bộ kiểm tự động dùng để xác nhận tính năng này có thể tự báo lỗi vĩnh viễn ngay sau khi mã được gộp vào nhánh chính, làm chậm các lần xác nhận sau này dù sản phẩm không hề có lỗi.
  file: `tests/scripts/ho-so-nghi.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Dòng nghỉ đặt TRƯỚC chốt «lời khai phải có vật» — một dòng sổ rửa sạch lời tự khai machine-cleared**
  Người dùng thấy gì: Một dòng ghi 'nghỉ' có thể vô tình xác nhận một kết quả kiểm tra tự động chưa từng đạt đủ điều kiện, khiến hồ sơ trông như đã hoàn tất trong khi bằng chứng thực sự chưa đủ.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bản đồ nhận dòng nghỉ THIẾU VẾ là nghỉ — hai bộ đọc lại trôi khỏi nhau**
  Người dùng thấy gì: Một hồ sơ nghỉ ghi thiếu thông tin có thể khiến bản đồ tổng quan hiển thị nhầm là đã đóng trong khi hồ sơ thực ra vẫn đang mở.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: known-limits

- **Dòng nghỉ miễn hồ sơ khỏi TOÀN BỘ lưới trước-merge, không phải ba luật như lời khai**
  Người dùng thấy gì: Một dòng ghi 'nghỉ' cho một hồ sơ có thể vô tình bỏ qua luôn cả bước phê duyệt ban đầu bắt buộc, không chỉ những quy định đã công bố, khiến một hồ sơ chưa từng được phê duyệt vẫn trôi qua như đã được chấp thuận.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **recheck-evidence.cjs sập (exit 1, MODULE_NOT_FOUND) khi kho tiêu thụ không vendor workspace-record.cjs**
  Người dùng thấy gì: Ở một số cách cài đặt khác nhau, công cụ kiểm tra lại bằng chứng có thể bị dừng đột ngột và báo hồ sơ không đạt dù bằng chứng thực ra hợp lệ, chỉ vì thiếu một thành phần phụ trợ nội bộ không bắt buộc.
  file: `scripts/recheck-evidence.cjs`
  severity: high
  Đề xuất: known-limits

- **Dòng nghỉ không có `id` được nhận là nghỉ nhưng KHÔNG BAO GIỜ mở lại được**
  Người dùng thấy gì: Một dòng ghi 'nghỉ' viết tay mà thiếu định danh có thể khiến hồ sơ vĩnh viễn không thể mở lại được, kể cả khi người phụ trách sau này muốn kích hoạt lại nó.
  file: `lib/workspace-record.cjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion ghim mã thoát, không ghim thông điệp — chín eval script cùng một lệnh trần, chỉ exit 0 được máy kiểm**
  Người dùng thấy gì: Một số phép kiểm tự động của tính năng này chỉ xác nhận rằng chương trình không báo lỗi, chứ không thực sự xác nhận đúng nội dung mong đợi — dễ để lọt những trường hợp tưởng đã kiểm đúng nhưng thực ra chưa kiểm gì cả.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: known-limits

- **Tuyên quét LỚP «không nhánh nào đánh rơi cờ» nhưng chỉ có hai điểm-case trên chín nhánh**
  Người dùng thấy gì: Một số trạng thái hồ sơ ít gặp, ví dụ hồ sơ còn ở giai đoạn nháp, chưa được kiểm tra đầy đủ khi có dòng ghi 'nghỉ', nên hành vi thực tế ở những trạng thái đó chưa được xác nhận chắc chắn.
  file: `tests/scripts/ho-so-nghi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bản base tiêm mutant dựng bằng danh sách tệp GÕ TAY chồng lên `git archive HEAD` — đo cây đã commit, không đo cây đang kiểm**
  Người dùng thấy gì: Một số bài kiểm mô phỏng lỗi có thể so sánh với phiên bản mã đã lưu chính thức thay vì phiên bản đang chỉnh sửa thực tế, khiến kết quả kiểm đôi khi không phản ánh đúng thay đổi mới nhất.
  file: `tests/scripts/ho-so-nghi.test.mjs`
  severity: medium
  Đề xuất: known-limits

Carried từ round 1 (T5 — tệp không đổi, KHÔNG chấm lại round này):

- **Dòng nghỉ miễn hồ sơ khỏi TOÀN BỘ luật của cổng, không phải ba luật như lời khai (r1)**
  Người dùng thấy gì: Khi một hồ sơ được đánh dấu 'nghỉ', hệ thống có thể vô tình bỏ qua luôn cả các kiểm tra bắt buộc phải có người ký duyệt, không chỉ ba lý do đã công bố — một hồ sơ chưa từng được duyệt có thể lọt qua mà không ai hay.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: known-limits

- **recheck-evidence.cjs require thẳng workspace-record.cjs — kho thiếu tệp đó hoá ĐỎ giả ở mọi hồ sơ PASS (r1)**
  Người dùng thấy gì: Nếu một kho không có sẵn một tệp thư viện tùy chọn, mọi hồ sơ đã đạt bằng chứng có thể bị báo lỗi giả và bị chặn gộp, dù kết quả thật vẫn đúng.
  file: `scripts/recheck-evidence.cjs`
  severity: high
  Đề xuất: known-limits

- **Dòng nghỉ không có `id` vẫn hợp lệ và KHÔNG BAO GIỜ mở lại được (r1)**
  Người dùng thấy gì: Một hồ sơ 'nghỉ' viết thiếu một mục thông tin vẫn được chấp nhận, nhưng sau đó sẽ không ai có thể mở lại hồ sơ đó được nữa.
  file: `lib/workspace-record.cjs`
  severity: medium
  Đề xuất: known-limits

- **recheck-evidence.cjs crashes (exit 1 = false VIOLATION) when lib/workspace-record.cjs is not vendored (r1)**
  Người dùng thấy gì: Nếu một kho không có sẵn một tệp thư viện tùy chọn, mọi hồ sơ đã đạt bằng chứng có thể bị báo lỗi giả và bị chặn gộp, dù kết quả thật vẫn đúng.
  file: `scripts/recheck-evidence.cjs`
  severity: high
  Đề xuất: known-limits

- **A nghi line without `id` is accepted but can never be reopened — permanent, irreversible gate exemption (r1)**
  Người dùng thấy gì: Một hồ sơ 'nghỉ' viết thiếu một mục thông tin vẫn được chấp nhận, nhưng sau đó sẽ không ai có thể mở lại hồ sơ đó được nữa.
  file: `lib/workspace-record.cjs`
  severity: high
  Đề xuất: known-limits

- **Pre-merge nghi NOTE claims three laws are dropped while the `continue` exempts every remaining rule, including bypass_used and human_signoff (r1)**
  Người dùng thấy gì: Dòng thông báo khi miễn một hồ sơ chỉ kể ba lý do, trong khi thực tế có thể đã bỏ qua nhiều kiểm tra khác — người đọc dễ hiểu nhầm mức độ miễn.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
