# Review Findings: delta-verify-repin (round 3)

## Trong hợp đồng

- **extractEvalBlockRunIds: dòng trống trong eval block tắt lưới chặn mượn run_id repin (fail-open)**
  file: `/Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js:158`
  severity: low
  detail: `if (inBlock && !/^\s+\S/.test(line)) inBlock = false` — một dòng TRỐNG giữa các field của eval block kết thúc block, nên `run_id:` đứng sau dòng trống không được thu → lưới AC-11 (chặn eval block mượn run_id của dòng {"kind":"repin"}) bị vô hiệu im lặng cho block đó, trong khi check unlogged vẫn xanh vì id repin CÓ trong run-log (loadRunLogIds gom mọi dòng). DV12b của chính feature này đã công nhận "dòng trống sau heading" là biến thể writer hợp lý và sửa recheck khỏi fail-open cùng hình dạng — nhưng reader eval-block bên hook chưa quét theo lớp đó. Tầng này tự khai chống lazy-fabrication chứ không chống adversary, nên xếp low; fix rẻ: chỉ đóng block khi gặp dòng KHÔNG-trống dedent (bỏ qua dòng trắng), như cách các parser section đã thống nhất.
  source: bugs
  AC: AC-11

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **carry-plan globToRe lệch chuẩn matcher paths của kit dù comment tuyên bố 'cùng ngữ nghĩa'**
  Người dùng thấy gì: Nếu cách xác định 'file nào coi là đã sửa' trôi khỏi chuẩn của công cụ, một số vòng sửa lỗi có thể chạy lại nhiều việc hơn mức cần thiết (tốn thời gian chờ) — hiện chưa gây bỏ sót lỗi, nhưng chưa có phép kiểm nào giữ nó khớp chuẩn lâu dài.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hai reader cưỡng chế đọc dòng repin của run-log.jsonl bằng hai ngữ pháp khác nhau (grep -F chuỗi cố định vs JSON.parse)**
  Người dùng thấy gì: Nếu dòng ghi nhận việc re-pin được lưu ở định dạng có khoảng trắng thay vì cô đặc, hai bước kiểm tra có thể không đồng thuận: một bên coi là hợp lệ, bên kia báo 'không tìm thấy re-pin' dù dữ liệu đúng — có thể khoá merge oan, không phải lọt lỗi thật.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **P146/P147 ghim chuỗi nguyên văn từ workspace sống _acceptance/delta-verify-repin — sửa contract của slug đó sau này là suite plugins đỏ**
  Người dùng thấy gì: Nếu nội dung tài liệu chấp thuận của một tính năng cụ thể được chỉnh sửa lại sau này, bộ kiểm thử tổng thể của công cụ có thể báo đỏ dù không có gì thực sự hỏng — gây mất thời gian điều tra nhầm.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **carry-plan.mjs không được ship vào gói feature-loop-codex dù SKILL chỉ thị chạy nó**
  Người dùng thấy gì: Người dùng chạy vòng sửa lỗi qua trợ lý Codex (thay vì trợ lý mặc định) có thể gặp lỗi dừng đột ngột khi hệ thống cố tái dùng kết quả kiểm tra của vòng trước, vì một phần cần thiết không được đóng gói cho họ — vòng sửa lỗi có thể phải làm lại thủ công từ đầu.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/sync-plugin-packages.sh`
  severity: high
  Đề xuất: known-limits

- **stripMd nuốt glob `**` và `*` — thẻ cổng đổi nghĩa văn bản im lặng**
  Người dùng thấy gì: Trên thẻ quyết định hiển thị cho người duyệt, các mẫu loại trừ/khớp tệp kiểu '**/...' hoặc '*.js' có thể bị hiển thị sai (mất dấu sao) khi hai mẫu như vậy nằm cùng một dòng, khiến người duyệt đọc nhầm phạm vi áp dụng của một quy tắc.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **pre-merge repin đối chiếu run-log bằng grep -F chuỗi JSON cứng — lệch với recheck/hook dùng JSON.parse**
  Người dùng thấy gì: Nếu dòng ghi nhận việc re-pin được lưu ở định dạng có khoảng trắng thay vì cô đặc, bước kiểm tra cuối trước khi merge có thể báo lỗi sai bản chất ('chưa từng re-pin') dù dữ liệu đúng và các bước kiểm khác đã chấp nhận nó — gây khoá merge oan.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
