## Trong hợp đồng

- **featureOf drops the main clause of `feature:` — 'Việc' column renders meaningless fragments**
  file: `scripts/acceptance-gold.mjs:104`
  severity: high
  AC: AC-13
  featureOf assumes the contract's `feature:` value starts with the slug and unconditionally discards everything before the first ' — ' (parts.slice(1)). Most real contracts instead use '<human description> — <subtitle>', so the load-bearing clause is thrown away. Compounding it, the regex /^feature:\s*"?([^"\n]+)/m truncates at any interior double-quote. Verified on the real corpus (`node scripts/acceptance-gold.mjs --root .`): s4-scope-triage ('Scope-triage cho review findings ở S4 — ngăn thứ ba "thật…"') renders as just 'ngăn thứ ba'; gate-card-ac-visibility renders as 'hoặc kêu to khi không đọc được'; premerge-rules-ledger as '`clean` phải được chứng minh, không phải mặc định'. The gold-book table — the human-facing deliverable this feature's S4-r1 fix was specifically about — silently shows nonsense for every contract not in slug-first format. Same bug in the mirror plugins/acceptance-gate/scripts/acceptance-gold.mjs (fix source, re-run sync).
  (nguồn: bugs; rationale: Bằng chứng chạy trên corpus thật cho thấy bảng Gold set hiện mảnh câu vô nghĩa, trực tiếp thất bại điều kiện 'người đọc hiểu' của AC-13.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Dấu MISSING_EVIDENCE_MARK sống ở 4 chỗ nhưng không có test ghim byte-identical giữa các nhà**
  Người dùng thấy gì: Nếu dấu hiệu "thiếu bằng chứng" bị sửa chữ ở một nơi mà quên các nơi khác trong hệ thống, người đọc báo cáo có thể không thấy cảnh báo dù bằng chứng thực sự đang thiếu.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **P149 nhánh mutant chỉ ghim mã thoát, không ghim thông điệp — vi phạm trực tiếp bất biến assertion âm tính**
  Người dùng thấy gì: Phép kiểm tự động cho việc chặn báo cáo mang từ ngữ cấm chỉ xem có báo lỗi hay không, không xem lỗi có đúng lý do hay không — nếu về sau báo cáo lỗi vì nguyên nhân khác, phép kiểm này vẫn báo "ổn", che giấu khả năng máy không còn chặn đúng nội dung giả mạo nữa.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **P150 so đường đọc-cũ với `git merge-base HEAD origin/main` — vacuous sau merge và hardcode ref không fallback**
  Người dùng thấy gì: Phép kiểm chứng minh báo cáo cũ vẫn hiển thị đúng chỉ có giá trị trong lúc thay đổi đang chờ duyệt; sau khi thay đổi được gộp vào nhánh chính, phép kiểm này tự động mất tác dụng mà không ai biết, nên các hỏng hóc sau này ở tính năng hiển thị báo cáo cũ sẽ không bị phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **glossOf only matches `question: >` folded style — inline-quoted questions silently fall back to generic placeholder**
  Người dùng thấy gì: Cột tóm tắt câu hỏi trong bảng kết quả tổng hợp có thể chỉ hiện chữ chung chung thay vì nội dung câu hỏi thật, với một số định dạng câu hỏi phổ biến, khiến người đọc khó biết mục đó thực sự đang hỏi gì.
  file: `scripts/acceptance-gold.mjs`
  severity: medium
  Đề xuất: known-limits

- **P150 back-compat leg self-neuters after merge: compares gate-card against merge-base, which becomes HEAD**
  Người dùng thấy gì: Bảo đảm rằng báo cáo cũ hiển thị đúng chỉ được xác minh trong lúc nhánh thay đổi chưa được gộp; sau khi gộp, phép kiểm này luôn báo ổn bất kể mã nguồn có bị hỏng sau đó hay không, nên mất hết tác dụng bảo vệ.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Shape 2 — fixture viết tay đúng khuôn bên đọc: P150 hand-writes the gate-card report while eval J5 promises 'SINH TỪ khuôn template'**
  Người dùng thấy gì: Phép kiểm cho khối "Bằng chứng còn thiếu" trên màn quyết định dùng dữ liệu mẫu soạn tay đúng ý người đọc, thay vì dữ liệu do chính hệ thống tạo ra từ khuôn báo cáo thật — nếu khuôn báo cáo thật đổi hình dạng, màn quyết định có thể âm thầm ngừng hiển thị đúng khối này mà không ai phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 — assert 'chuỗi có mặt' thay vì quan hệ: JR1's judge-prompt check is two independent substring tests for a conditional obligation**
  Người dùng thấy gì: Phép kiểm cho lời nhắc gửi tới máy chấm chỉ xem có xuất hiện vài từ khoá riêng lẻ hay không, chứ không xem các từ khoá đó có ràng buộc đúng quy tắc với nhau hay không — một lời nhắc nói ngược ý vẫn có thể được phép kiểm này chấp nhận là hợp lệ.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4(b) — mutant leg pins only exit code, no message: P149's injected-violation check accepts any exit-1 failure**
  Người dùng thấy gì: Phép kiểm mô phỏng lỗi vi phạm chỉ xem máy có báo lỗi (bất kỳ lý do gì) hay không, không xem lỗi có đúng nội dung mong đợi hay không — điều này có thể che giấu việc máy không còn phát hiện đúng loại vi phạm cụ thể mà nó được kỳ vọng bắt.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Shape 1 — đo chỉ dẫn thay vì đầu ra: JR2 asserts the missing-mark reaches the synthesize PROMPT, while the promised template round-trip of the mark is absent**
  Người dùng thấy gì: Phép kiểm cho việc dấu "thiếu bằng chứng" truyền tới báo cáo chỉ xem dấu đó có được đưa vào lời hướng dẫn gửi cho máy chấm hay không, chứ chưa từng xem dấu đó có thực sự xuất hiện trong báo cáo hoàn chỉnh mà người dùng đọc — nếu một bước xử lý sau đó làm rơi mất dấu, phép kiểm này sẽ không phát hiện.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 — mutant discrimination self-neutralizes on duplicate clauses: P154's `or len(findall)>1` branch makes the deletion check vacuous**
  Người dùng thấy gì: Phép kiểm việc xoá một bước hướng dẫn phải làm cảnh báo đỏ có một lối thoát: khi một câu hướng dẫn xuất hiện lặp lại nhiều lần trong tài liệu, phép kiểm coi như vẫn ổn dù bước đó đã bị xoá, khiến khả năng phát hiện xoá nhầm bước bị suy yếu cho những câu lặp lại.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).