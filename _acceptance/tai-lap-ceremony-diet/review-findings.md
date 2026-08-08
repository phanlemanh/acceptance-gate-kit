## Trong hợp đồng

### sign-batch: blank bypass_ack passes the ack gate (fail-open, signs a bypassed report)
- file: `scripts/sign-batch.mjs:62`
- severity: high
- source: bugs
- AC: AC-3

The ack check `/^bypass_ack:\s*[^\s#]/m` uses `\s`, which matches newlines. On a report with an uncommented but EMPTY line `bypass_ack:` the `\s*` crosses the line break and `[^\s#]` matches the first character of the NEXT line (`h` of `human_signoff:`, or `-` of the closing `---`), so the regex returns true. Confirmed live: `bypass_ack:\n---` and `bypass_ack:\nhuman_signoff:` both test true, while `bypass_ack: # comment` correctly tests false. Failure scenario: report has `verdict: PASS`, `bypass_used: true`, and a blank `bypass_ack:` (e.g. an agent uncommented the mold line but the human never filled it) → sign-batch signs the batch and prints the one-shot commit command, violating its own 'không ký mù' atomic-reject contract — the exact sibling of the comment-only shape fixed in 30312af (ledger tai-lap-ceremony-diet#1). pre-merge-check.sh still blocks at merge (front_field returns empty ack → VIOLATION), so it is backstopped, but the helper has already written signatures + `status: signed-off` across the whole batch and the state must be manually unwound. The new P187 case tests comment-only ack and filled ack but NOT the blank-uncommented shape, which is how this escaped. Fix by class: replace `\s*` with horizontal whitespace (`[ \t]*`) in this check — and audit the sibling regexes on lines 59/61 (`verdict:`, `bypass_used:`) which have the same newline-crossing property (currently masked only because the mold happens to put comment lines after them). Same bug ships in the mirror at /Users/manh-macmini/dev/acceptance-gate-kit/plugins/acceptance-gate/scripts/sign-batch.mjs (same line).

Rationale: AC-3 hứa từ chối cả lô khi một hồ sơ có bypass_used=true mà chưa có bypass_ack; finding chứng minh trường hợp bypass_ack để trống (chưa điền) vẫn lọt qua và được ký, đúng là AC-3 thất bại.


## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **sign-batch: slug/duong-dan khong duoc soat nhu --name truoc khi in vao lenh shell mot-phat**
  file: `scripts/sign-batch.mjs:84`
  severity: medium
  AC-3 chỉ hứa từ chối lô chưa verified / verdict khác PASS / bypass_used thiếu bypass_ack, và cấm helper tự chạy git commit — không hứa gì về việc soát ký tự đặc biệt trong slug hay đường dẫn trước khi in vào lệnh.

- **P187 mk_repo: nhanh printf dau luon fail, xa noise 'No such file or directory' vao stderr cua run xanh**
  file: `tests/plugins/run-tests.sh:9358`
  severity: low
  Đây là nhiễu trong log của bộ kiểm thử nội bộ dùng để phát triển kit, không phải hành vi sản phẩm mà bất kỳ AC nào mô tả.

- **sign-batch: human_signoff replace can span into a following comment line and silently delete it**
  file: `scripts/sign-batch.mjs:75`
  severity: low
  AC-3 hứa về quyết định ký/từ chối lô (verified, PASS, bypass_ack) và cấm tự commit; không hứa giữ nguyên các dòng ghi chú lân cận khi ghi chữ ký, và bản thân finding xác nhận không có quyết định ký sai — chỉ mất nội dung ghi chú.

- **Assert "chuỗi có mặt" trong khi lời hứa là QUAN HỆ giữa các giá trị (shape 3) — P186 không đo tính chọn lọc của KPI pickaxe**
  file: `tests/plugins/run-tests.sh:9325`
  severity: medium
  Finding chỉ ra bộ kiểm thử nội bộ (S4 eval) chưa chứng minh được tính chọn lọc của KPI, không phải bằng chứng cho thấy lệnh thật trong acceptance-report.md đang đếm sai; AC-2 nói về nội dung và tính thi-hành-được của lệnh, không phải độ mạnh của phép kiểm nó.
