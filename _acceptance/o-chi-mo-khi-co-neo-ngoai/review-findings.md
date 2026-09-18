# Review Findings: o-chi-mo-khi-co-neo-ngoai (round 3)

## Trong hợp đồng

### Bộ đọc frontmatter viết tay trong VC8/VC9 chép lại lib và tái sinh hai lớp lỗi lib đã vá
- file: `tests/plugins/vao-co-o.test.mjs:68`
- severity: medium
- source: conventions
- AC: AC-3

`const fmv = (t, k) => t.match(new RegExp(\`^${k}:\\s*(.*?)\\s*(#.*)?$\`, 'm'))…` là bộ đọc frontmatter tự dựng, dùng cho CẢ HAI răng mới: `hangCho` (line 93, đọc `stage`/`decision`) và `khoErrs` (line 122, đọc `status` để quyết grandfather).

Kit đã có MỘT nguồn cho seam này: `frontmatterField` export ở `lib/evidence-core.cjs:1204`, và chú thích ngay trên nó (lib/evidence-core.cjs:110-122) tuyên đúng ca này — «kit giải lớp MỘT LẦN rồi không lan sang bộ đọc kế bên — đó là lý do lần này đi bằng một hàm dùng chung thay vì lại sửa một chỗ». Trớ trêu là chính file này, ở line 22-24, viết «Trạng thái «đã thông Cổng Bằng chứng» HỎI lib, không chép» rồi 45 dòng sau chép bộ đọc.

Hai chỗ trôi đã đo được (chạy trực tiếp `fmv`):
1. `\s*` sau dấu hai chấm khớp cả xuống dòng — đúng lỗi S4-r2 mà `frontmatterField` dùng `[ \t]*` để chặn. Với `---\nslug: x\nstage:\ndecision: build\n---`, `fmv(t,'stage')` trả `"decision: build"` chứ không phải `""`.
2. Không neo vào khối `---` đầu tệp — `frontmatterField` cố ý chỉ đọc khối dẫn đầu để «a body excerpt (pasted log) cannot poison the read». Với một contract có frontmatter thiếu `status:` và trong thân có dòng `status: signed-off` (trích log, ví dụ, bảng), `fmv(t,'status')` trả `"signed-off"` → `khoErrs` cho mốc đó qua cửa grandfather và VC9 IM trên một mốc chưa ký thiếu «Kho chờ nhận:». Đó là fail-open của chính răng vừa dựng.

Sửa: `require('lib/evidence-core.cjs').frontmatterField` thay cho `fmv`, giống cách file đã hỏi `DA_THONG_CONG_2`.

Vì sao trong hợp đồng: AC-3 đòi mốc chưa ký (status ≠ signed-off) phải bị gọi đỏ khi thiếu dòng Kho chờ nhận; bộ đọc trạng thái có thể lấy nhầm giá trị 'signed-off' từ một đoạn văn khác trong hồ sơ khiến mốc đó lọt qua thành im, vi phạm trực tiếp yêu cầu này.

### Chân «hạt giống mồ côi IM» của VC8 là assertion rỗng — không phép đo nào đọc docs/plans
- file: `tests/plugins/vao-co-o.test.mjs:366`
- severity: medium
- source: bugs
- AC: AC-2

Đảo chiều lớn nhất của vòng này là bỏ luật cũ «mọi hạt giống phải có ô»; chiều ĐẶC HIỆU của nó (hạt giống mồ côi → máy phải IM) được AC-2 gọi tên («hạt giống `docs/plans/*-hat-giong-*` không có ô → IM (đảo chiều VC8 cũ)»), được E2 kể trong ma trận («(im 1) hạt giống mồ côi → im») và được in ra trong dòng PASS của VC8 («hạt giống mồ côi im»).

Nhưng dòng 366 `W(r, 'docs/plans/2026-01-01-hat-giong-mo-coi.md', …)` ghi file vào fixture rồi KHÔNG ai đọc: phép đo duy nhất của VC8 sau đó là `neoErrs(accDir, tpl)` (dòng 96-110), và `neoErrs` chỉ `readdirSync(accDir)` — nó không bao giờ chạm `docs/plans`. Chân (v) cuối ca chạy `scan(ROOT)` trên cây thật, cũng không liên quan fixture `r`.

Failure scenario: xoá hẳn dòng 366, hoặc ngược lại thêm lại một bộ đếm «hạt giống mồ côi» vào bất kỳ bên đọc nào — VC8 vẫn XANH và vẫn in «hạt giống mồ côi im». Đúng lớp lỗi «assertion âm-tính-một-mình / hằng-đúng» mà CLAUDE.md và nghi thức hai chiều 14/09 sinh ra để chặn: chiều 2 (độ đặc hiệu) của luật mới hoàn toàn không có vật.

Vì sao trong hợp đồng: AC-2 liệt kê rõ ràng hành vi «hạt giống mồ côi → IM» là một tiêu chí phải được xác minh, nhưng phép thử được viết ra không có đường nào thực sự chạm tới dữ liệu đó nên tiêu chí này chưa từng được chứng minh giữ đúng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **neoErrs mặc định IM khi không đọc được hồ sơ — ngược luật «đảo chiều mặc định»**
  Người dùng thấy gì: Khi một hồ sơ đang chờ duyệt bị lỗi định dạng hoặc không đọc được, máy có thể âm thầm bỏ qua việc kiểm tra ô đó thay vì báo cho người biết, nên một ô thiếu thông tin nguồn gốc có thể lọt qua mà không ai hay.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Răng không kiểm VỊ TRÍ dòng Gốc dù khuôn và start.md đều khai «mở đầu section»**
  Người dùng thấy gì: Dòng khai nguồn gốc có thể được đặt sai vị trí trong hồ sơ mà máy vẫn chấp nhận, nên không có gì bảo đảm dòng đó thực sự mở đầu đúng mục cần thiết như tài liệu hướng dẫn mô tả.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits

- **neoErrs nuốt mọi lỗi đọc hồ sơ và miễn lặng ô đó (fail-open)**
  Người dùng thấy gì: Khi một hồ sơ đang chờ duyệt bị hỏng hoặc không đọc được, ô đó có thể bị bỏ qua hoàn toàn khỏi việc kiểm tra mà không có cảnh báo nào, khiến người ký tưởng lầm mọi thứ đã sạch.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Luật «section MỞ bằng dòng Gốc:» không có phép đo; bên đọc nhận Gốc ở bất kỳ đâu và chỉ đọc dòng ĐẦU TIÊN**
  Người dùng thấy gì: Máy hiện chấp nhận dòng khai nguồn gốc ở bất kỳ đâu trong hồ sơ và chỉ nhìn dòng đầu tiên tìm thấy, nên một hồ sơ có nhiều dòng khai nguồn gốc mâu thuẫn nhau vẫn được coi là hợp lệ.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ (dòng Gốc phải MỞ section «Vấn đề & ai gặp»)**
  Người dùng thấy gì: Yêu cầu rằng dòng khai nguồn gốc phải mở đầu đúng mục vấn đề chưa được máy kiểm tra thật sự — một hồ sơ đặt dòng đó sai chỗ, kể cả một hồ sơ đang có thật trong kho hiện nay, vẫn được máy coi là hợp lệ dù tài liệu hướng dẫn viết khác.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Bộ lọc hàng chờ FAIL-OPEN — đọc frontmatter vắt qua dòng, ô đọc không ra lặng lẽ được miễn răng**
  Người dùng thấy gì: Khi một trường trạng thái trong hồ sơ được để trống theo một cách viết tay thông thường, máy có thể đọc nhầm sang giá trị của dòng kế bên, để lại rủi ro cho những cách viết khác chưa được kiểm hết.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP «đã thông Cổng Bằng chứng» nhưng chỉ có điểm-case (1 ca / 2 phần tử)**
  Người dùng thấy gì: Một trong hai cách đánh dấu 'đã hoàn tất kiểm chứng' của hồ sơ mốc phát hành chưa được thử nghiệm riêng, nên chưa có bằng chứng độc lập rằng nhánh đó thực sự được máy nhận diện đúng.
  file: `tests/plugins/vao-co-o.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — eval E1 khai một chiều đỏ («khuôn hai dòng thì VC8 đỏ») mà không ca nào chạy nó**
  Người dùng thấy gì: Bộ kiểm tra tuyên bố sẽ báo lỗi khi khuôn mẫu bị viết sai dạng, nhưng chưa có phép thử nào thực sự tạo ra tình huống sai đó để xác nhận lời tuyên là đúng.
  file: `_acceptance/o-chi-mo-khi-co-neo-ngoai/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **PR kéo hai hồ sơ vòng khác vào diff → pre-merge chặn merge (2 VIOLATION stale) (r2)**
  Người dùng thấy gì: PR này kéo theo hai hồ sơ của vòng khác không liên quan, có thể khiến việc gộp mã bị chặn lại giữa chừng vì hệ thống kiểm tra tưởng nhầm hai hồ sơ đó đã lỗi thời.
  file: `_acceptance/release-2-0-0/contract.md`
  severity: high
  Đề xuất: known-limits

- **Luật (b) đổi mẫu số sang «mốc được kho nhận» nhưng bộ đếm máy vẫn neo vào lần cắt số (r2)**
  Người dùng thấy gì: Bộ đếm giới hạn số vòng chỉnh luật kit vẫn tính theo lần đổi số phiên bản thay vì theo lần một sản phẩm bên ngoài thật sự nhận bản cập nhật, nên quy tắc vừa đổi có thể không có tác dụng thực tế như đã hứa.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: new-contract

- **Khuôn hợp đồng giao cho repo tiêu thụ nhận thêm dòng chỉ dành cho mốc phát hành của kit (r1)**
  Người dùng thấy gì: Mỗi hợp đồng mới tạo cho một tính năng bất kỳ đều có thêm một dòng ghi chú chỉ dành riêng cho các đợt phát hành của kit, dù tính năng đó không phải là một đợt phát hành.
  file: `skills/acceptance/references/contract-template.md`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ ĐÃ KÝ vao-co-o-ra-co-ten còn ghim VC8 theo nghĩa đã bị đảo, re-check vẫn xanh (r1)**
  Người dùng thấy gì: Một hồ sơ đã được duyệt trước đó vẫn hiển thị đạt trong các lần kiểm tra lại sau này, dù tiêu chí thật sự đứng sau kết quả đó đã bị thay đổi.
  file: `_acceptance/vao-co-o-ra-co-ten/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).