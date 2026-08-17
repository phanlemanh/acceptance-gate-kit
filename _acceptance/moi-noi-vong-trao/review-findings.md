# Review Findings: moi-noi-vong-trao

## Trong hợp đồng

### opportunity.md quá cỡ MAX bị read() trả rỗng → thẻ khẳng định sai «không hồ sơ cơ hội → ship thẳng»
- file: `scripts/gate-card.js:304`
- severity: low
- source: conventions
- AC: AC-2
- detail: `read()` (dòng 57) trả '' cho cả file vắng lẫn file > MAX (chỉ ghi stderr). Dòng 305 suy `opportunity_present` từ chuỗi rỗng → dòng 351 in cờ finfo «Vòng này không có hồ sơ cơ hội → … ship thẳng, không phiên nghiệm thu» — một tuyên bố định tuyến sai trên thẻ người duyệt, đúng lớp «máy tin nhầm chính nó». Nên phân biệt vắng (statSync ném) với bị bỏ qua vì quá cỡ và bắn cờ vàng riêng thay vì dòng sự kiện.

### §0 uat-session so `ran_at` với «verified_at của evidence-report.md» nhưng file đó chỉ có verified_at theo từng eval, không có trường cấp hồ sơ
- file: `skills/uat-session/SKILL.md:27`
- severity: low
- source: conventions
- AC: AC-4
- detail: evidence-report-template.md khai `verified_at` bên trong từng block `- eval:` (dòng 146, 154), không có frontmatter cấp report. Luật «ran_at không cũ hơn verified_at» là phép so máy-đọc nhưng không nói lấy giá trị nào (max? của eval nào?); phiên khác nhau sẽ diễn giải khác → cờ vàng «nhật-ký cũ hơn bản chấm» bật/tắt tuỳ người đọc. Nên ghi rõ «verified_at MUỘN NHẤT trong evidence-report» hoặc trỏ tới trường cấp hồ sơ nếu có.

### Hình 5 — quan hệ ĐỌC ⊆ KHUÔN chỉ đo trên allowlist viết tay KNOWN; mutant được tinh chỉnh vào allowlist
- file: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh:324`
- severity: medium
- source: measurement
- AC: AC-3
- detail: keysRead() (dòng 327) chỉ giữ khoá backtick nằm trong KNOWN=['chan','blocked','slug',...] (dòng 324). Nên «ĐỌC» không phải tập khoá §0 thực sự đọc mà là giao với một danh sách đóng viết tay: SKILL §0 gọi `chan_count`, `blockers`, hay bất kỳ tên ngoài KNOWN đều bị lọc im lặng và assert ĐỌC ⊆ KHUÔN vẫn xanh. Mutant B (dòng 335) chỉ bị bắt vì 'blocked' được đặt sẵn vào KNOWN — đổi mutant thành `chan`→`chan_count` là qua. Đây là allowlist biến fail-loud thành fail-silent; lời hứa E3 («rút bằng regex trên đúng hai section, không chép tay») không đúng với code.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Chiều đỏ của 4 chân rang-mnvt (uat-needle · s5-needle · spec · hinh) không chạy checker trên bản đột biến — evals hứa thông điệp ghim mà script không bao giờ phát**
  Người dùng thấy gì: Các bài kiểm 'phải báo lỗi khi thiếu nội dung' cho một số phần (cờ vàng, dòng bàn giao, đoạn đặc tả, tên hình) hiện chỉ xác nhận là đã xoá được chữ, chưa thực sự chạy lại phép kiểm để chắc nó bắt được lỗi — nên nếu phép kiểm chính có hỏng âm thầm, các bài kiểm này sẽ không phát hiện ra.
  file: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh`
  severity: high
  Đề xuất: known-limits

- **gate-card.js dựng matcher heading thứ hai lệch ngữ nghĩa với section() của lib/md-section.cjs**
  Người dùng thấy gì: Nếu tiêu đề mục ngưỡng nghiệm thu trong hồ sơ cơ hội được đặt hơi khác chữ mẫu (ví dụ có thêm hậu tố), thẻ Cổng Phạm vi có thể báo nhầm 'chưa khai ngưỡng' dù nội dung ngưỡng thực ra đã có, hoặc ngược lại.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **E1 và E2 trỏ hai executor key khác tên nhưng cùng một nhánh case → né dedupe cmd của S4, chạy P197 hai lần và «chân đỏ» không phải chiều đỏ riêng**
  Người dùng thấy gì: Không ảnh hưởng người dùng sản phẩm — một bài kiểm thử nội bộ bị đặt trùng tên nên chạy lặp lại chính nó, khiến người đọc báo cáo kiểm thử tưởng có hai phép kiểm độc lập trong khi chỉ có một.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Mutant «đổi màu» trong rang-mnvt.sh là tautology — không đi qua phép đo**
  Người dùng thấy gì: Bài kiểm 'phải báo lỗi khi xoá nội dung bắt buộc' cho các mục nhật-ký-vấp, dòng bàn giao, đặc tả và hình hiện chỉ xác nhận đã xoá được chữ chứ chưa chạy lại phép kiểm thật, nên nếu phép kiểm chính bị hỏng âm thầm sẽ không ai phát hiện.
  file: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh`
  severity: medium
  Đề xuất: known-limits

- **Chân the-nguong-do trùng hệt the-nguong — E2 «chiều đỏ» không phải phép đo riêng**
  Người dùng thấy gì: Không ảnh hưởng người dùng — hai tên bài kiểm nội bộ nghe như kiểm hai điều khác nhau nhưng thực chất chạy đúng một phép kiểm, dễ gây hiểu nhầm khi đọc báo cáo kiểm thử.
  file: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh`
  severity: low
  Đề xuất: known-limits

- **Hình 4 — chiều đỏ tautology: mutant chỉ kiểm «đã xoá chuỗi», không chạy lại thước trên bản mutant, không ghim thông điệp**
  Người dùng thấy gì: Bốn bài kiểm cho các thông điệp cảnh báo (thiếu cờ vàng, thiếu dòng bàn giao, thiếu lái-thử ở hàng A, thiếu nhãn ĐỀ XUẤT) chỉ xác nhận đã xoá được chữ, không chạy lại phép kiểm thật và không so đúng nội dung thông điệp cảnh báo — nên nếu phép kiểm chính hỏng âm thầm, các bài kiểm này vẫn báo 'ổn'.
  file: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh`
  severity: high
  Đề xuất: known-limits

- **Hình 5 — ô «đời-cũ» trùng fixture với ô «khong»: tuyên thêm ca nhưng không đo gì mới**
  Người dùng thấy gì: Trường hợp hồ sơ cơ hội 'đời cũ' đang được kiểm bằng đúng dữ liệu mẫu của trường hợp 'không có hồ sơ', nên chưa có bằng chứng độc lập là sản phẩm thực sự xử lý đúng riêng trường hợp hồ sơ đời cũ, dù kết luận hiện tại (xử lý giống nhau) khớp với thiết kế.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình 3 — mutant m1 đổi tên nhãn thay vì gỡ khối render; has_block là assert 2 chuỗi có mặt**
  Người dùng thấy gì: Bài kiểm 'phải báo lỗi khi khối ngưỡng nghiệm thu bị gỡ khỏi thẻ' hiện mới chỉ thử đổi tên nhãn hiển thị, chưa thử thật sự gỡ cả khối — nên chưa có bằng chứng chắc chắn thẻ sẽ báo lỗi đúng khi toàn bộ khối ngưỡng biến mất.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 6/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/moi-noi-vong-trao/rang-mnvt.sh, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
