# Review Findings: ngon-ngu-mat-nguoi (round 2)

## Trong hợp đồng

### 1. Luật "một nguồn" không được đo: bản sao thứ ba thật sự tồn tại trong vùng vừa bị loại khỏi phép quét
- file: `tests/plugins/run-tests.sh:2305`
- severity: high
- source: conventions
- AC: AC-7

P93 quét toàn kho để chứng minh bảng luật chỉ nằm 2 chỗ và mỗi khuôn chỉ nằm 1 chỗ, nhưng `SKIP_SUB = {("docs", "superpowers")}` loại đúng vùng đang chứa bản sao thứ ba.

SỰ THẬT TRÊN CÂY (grep, không phải suy đoán):
- Thân luật `"Mã số là tra cứu, không phải nội dung."` có ở 3 file nguồn: `skills/acceptance/references/human-facing-language.md`, `docs/specs/workflow-v2-spec.md`, VÀ `docs/superpowers/plans/2026-08-01-ngon-ngu-mat-nguoi.md`.
- File plan chứa NGUYÊN cặp marker: `plan.count("<<<PLAN-SUMMARY-TABLE-TEMPLATE") == 2` và `plan.count("<<<DECISION-DIAGRAM-TEMPLATE") == 2` — tức khuôn có marker nằm ở 2 file, không phải 1.

Điều này phủ định trực tiếp AC-8 (contract.md:42 — "mỗi cặp marker chỉ xuất hiện đúng một lần trong toàn kho nguồn") và AC-7 (contract.md:41 — "tìm nó trên toàn kho... chỉ nằm ở đúng hai chỗ"), trong khi E8/E9/E11 vẫn báo PASS. Mô tả plugin 1.28.0 cũng bán ra lời hứa này ("byte-identical across its two homes").

ĐỐI CHỨNG ÂM ĐÃ CHẠY (bản sao `scratchpad/repo2`, baseline XANH trước khi tiêm):
1. Sửa lệch một câu luật trong bản sao ở file plan → `Results: all plugin tests passed`.
2. Trồng NGUYÊN file `human-facing-language.md` thành `docs/superpowers/specs/BAN-SAO-THU.md` → vẫn `all plugin tests passed`.

Đây đúng lớp lỗi mà bên soi round 1 đã chứng minh một lần rồi (chép ra `design-loop/` mà suite vẫn xanh): bản vá đổi allowlist→denylist nhưng khoét lại một lỗ cùng hình dạng, và lần này lỗ đó đang chứa hàng thật. Khớp bất biến CLAUDE.md "allowlist biến fail-loud thành fail-silent" và "thước phải gắn vào vật được giao".

Hướng xử lý (không tự sửa): hoặc gỡ bản sao khỏi file plan và để plan trỏ tới marker theo tên, hoặc bỏ `SKIP_SUB` và chấp nhận phép đo đỏ cho tới khi bản sao được gỡ.

Rationale (map vào AC): AC-7 (contract.md:41) yêu cầu nội dung sáu luật chỉ nằm ở đúng hai chỗ trên toàn kho, nhưng finding chứng minh bằng grep + đối chứng âm rằng vùng quét hiện tại loại trừ đúng nơi đang chứa bản sao thứ ba, nên AC-7 thất bại.

### 2. Phạm vi đo đã duyệt của AC-10 bị thu hẹp bằng entry ledger thay vì sửa contract
- file: `tests/plugins/run-tests.sh:2304`
- severity: high
- source: conventions
- AC: AC-10

AC-10 (`_acceptance/ngon-ngu-mat-nguoi/contract.md:44`) khai chính xác ba vùng loại trừ: "trừ mirror `plugins/`, `_acceptance/`, `tests/`". Bản thi hành loại BỐN vùng — thêm `docs/superpowers/**`.

Cách hợp thức hoá là một entry `fix` trong `_acceptance/ngon-ngu-mat-nguoi/decisions.jsonl`: "Thu hẹp vùng quét một-nguồn: loại thêm docs/superpowers/** (design doc + plan) so với AC-10 đã duyệt vốn chỉ loại plugins/, _acceptance/, tests/". Đây là dùng sổ quyết định để đè contract — điều mà chính kit cấm: CONTEXT.md định nghĩa Contract là "Nguồn sự thật của phạm vi", và `docs/specs/workflow-v2-spec.md` §4.1 (file feature này vừa thêm) viết "Sổ quyết định `decisions.jsonl`: rationale KHÔNG override contract".

Hệ quả đo được: `evidence-report.md` vẫn ghi E11 (AC-10) PASS trong khi tiêu chí được duyệt không còn được đo như đã duyệt.

Còn một chỗ chú thích sai ngay tại hiện trường: dòng 2304 ghi `# dung 3 muc AC-10 khai` trong khi dòng 2305 ngay dưới thêm vùng loại trừ thứ tư — người đọc sau sẽ tin phép đo khớp contract.

Đường đúng theo nghi thức repo: hoặc sửa AC-10 rồi duyệt lại ở Cổng 1, hoặc đẩy thành mục "Ngoài hợp đồng" cho Cổng 2 quyết (ghi Known limits / mở hợp đồng mới / nâng phạm vi) — không phải hạ thước rồi ghi ledger.

Rationale (map vào AC): AC-10 (contract.md:44) khai đích danh đúng ba vùng loại trừ; bản thi hành loại thêm một vùng thứ tư chưa qua Cổng 1, nên phép đo không còn đúng với AC-10 đã duyệt dù được hợp thức hoá bằng ledger.

### 3. E8/E11 expected text describes the pre-fix allowlist scan region, not the denylist P93 actually implements
- file: `_acceptance/ngon-ngu-mat-nguoi/evals.yaml:96`
- severity: medium
- source: bugs
- AC: AC-7

E8's `expected` pins the scan region as "(skills/ commands/ feature-loop/ codex/ lib/ scripts/ hooks/ docs/ + md gốc; trừ plugins,_acceptance,tests)" and E11 says "cùng vùng quét … như E8". P93 was rewritten in S4-r1 (ledger d-20260801T110823Z-21458) to a denylist: `SKIP_TOP = {plugins,_acceptance,tests}`, `SKIP_SUB = {(docs,superpowers)}`, plus a skip of every dot-prefixed path segment (run-tests.sh:2304-2320). The evals were never updated.

This is not cosmetic drift: `docs/superpowers/plans/2026-08-01-ngon-ngu-mat-nguoi.md` contains a verbatim third copy of the law table AND a second copy of both templates (confirmed by grep — LAW string appears in docs/specs/workflow-v2-spec.md, docs/superpowers/plans/…, plugins mirror, and the reference file). Under E8's own written region ("docs/" included), that copy makes the criterion fail; under the implemented region it is carved out and the test is green. The measure and the thing it claims to measure disagree, and the exclusion is invisible to anyone reading AC-7/AC-10 or the eval. Also unscanned by the dot rule: .out-of-scope/, .github/, .agents/.

Rationale (map vào AC): Finding cho thấy chính eval E8 — phép đo của AC-7 — không còn phản ánh đúng vùng quét thật đang thi hành, khiến AC-7 được báo PASS dù bản sao thứ ba (đã nêu ở finding 1) vẫn tồn tại trong vùng bị loại; đây là cùng một thất bại AC-7, nhìn từ phía evals.yaml.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bản phát hành 1.28.0/1.20.0 không có phép đo nào ghim — gỡ bump vẫn xanh toàn suite**
  Người dùng thấy gì: Nếu ai đó lỡ gỡ ngược bản phát hành vừa ra mắt của luật ngôn ngữ mặt người, bộ kiểm tra tự động sẽ không phát hiện ra, và tính năng có thể âm thầm biến mất mà không ai được cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **verified_commit ghim cây TRƯỚC các sửa đổi mà chính báo cáo mô tả**
  Người dùng thấy gì: Báo cáo bằng chứng đưa cho người duyệt đang được đóng dấu ở một thời điểm trước khi các bản vá cuối cùng được thêm vào, nên người duyệt có thể đang tin vào một báo cáo không phản ánh đúng bản thi hành thật hiện có.
  file: `_acceptance/ngon-ngu-mat-nguoi/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **11 feature cũ bị đẩy thành stale-evidence; nghi thức re-pin đã có tiền lệ không được thực hiện**
  Người dùng thấy gì: Khi nhánh này được gộp vào nhánh chính, 11 tính năng đã duyệt trước đó sẽ bị đánh dấu là bằng chứng cũ và có thể chặn đỏ cổng kiểm tra tự động cho tới khi có người ghim lại thủ công.
  file: `_acceptance/pha3-goi-luoi/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Evidence blocks for E1–E14 all quote the same unrelated case (P95), so no eval is individually evidenced**
  Người dùng thấy gì: Báo cáo bằng chứng gửi cho người duyệt trích dẫn cùng một đoạn kết quả chạy test cho gần hết các tiêu chí, nên người duyệt không thực sự thấy bằng chứng riêng cho tiêu chí mình đang xét — chỉ đang tin vào một dòng tóm tắt chung.
  file: `_acceptance/ngon-ngu-mat-nguoi/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **feature-loop 1.20.0 adds a hard acceptance-gate ≥1.28.0 dependency at S2 with no preflight declaration and no non-zero-exit branch**
  Người dùng thấy gì: Nếu người dùng đã cập nhật công cụ vòng lặp tính năng nhưng chưa cập nhật gói duyệt lên bản mới nhất, hệ thống có thể âm thầm bỏ qua luật ngôn ngữ mặt người khi trình kế hoạch mà không báo lỗi gì cho họ biết.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: high
  Đề xuất: known-limits

- **acceptance-card's PLUGIN_ROOT fallback resolves with the wrong --require and can return a version lacking the rules file**
  Người dùng thấy gì: Trên máy có cài nhiều phiên bản gói duyệt cùng lúc, lệnh dựng thẻ quyết định có thể vô tình dùng bản cũ chưa có luật ngôn ngữ mặt người mà không báo cho người dùng biết thẻ đang thiếu luật.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: known-limits

- **P88 (the "release có chủ đích" guard) was not updated for 1.28.0/1.20.0, so reverting the release bump stays green**
  Người dùng thấy gì: Nếu bản phát hành của luật ngôn ngữ mặt người bị gỡ ngược phiên bản, không phép kiểm tra tự động nào báo động — việc quên nâng cấp khi phát hành có thể trôi qua mà không ai hay biết.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **P95's two failure conditions emit an identical message, and it never asserts the rules file is absent from the feature-loop-codex package**
  Người dùng thấy gì: Một phép kiểm tra tự động đang bảo vệ tính năng này có thể ngừng hoạt động đúng lúc mà không ai nhận ra, vì hai lỗi khác nhau nó cần bắt lại đang báo cùng một thông điệp.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **P93 reads scanned files with errors="ignore", silently discarding decode failures in an exact-count check**
  Người dùng thấy gì: Nếu có một bản sao luật bị lưu với mã hoá ký tự lỗi, phép kiểm tra "chỉ một nguồn" có thể lặng lẽ bỏ qua bản sao đó và vẫn báo mọi thứ ổn dù thực ra không phải vậy.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ngon-ngu-mat-nguoi/evidence-report.md, _acceptance/pha3-goi-luoi/evidence-report.md, _acceptance/ngon-ngu-mat-nguoi/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
