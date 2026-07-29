## Trong hợp đồng

- **probeClaims: warn nói 'skipped <file>' nhưng vẫn emit claim từ chính file đó, và F-index bị lệch khỏi hàng bảng**
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs:55`
  severity: medium
  AC: AC-2
  detail: Khi bảng Findings có hàng hỏng xen giữa hàng lành, code chỉ bỏ hàng hỏng (`malformed = true; continue`) nhưng warn ở dòng 62 lại nói 'skipped <file> (malformed table)' — cùng một thông điệp với nhánh dòng 50 nơi CẢ FILE thật sự bị bỏ. Repro: bảng 2 hàng, hàng 1 lệch cột, hàng 2 lành → stderr báo 'skipped .../gap-probe.md (malformed table)' NHƯNG hàng 2 vẫn được emit, và emit với id `mix#F1` (n chỉ tăng cho hàng lành) trong khi nó là hàng 2 của bảng. Hệ quả: (a) thông điệp đã ghim trong AC-2/CS2 mô tả sai hành vi thật — CS2 chỉ test bảng có ĐÚNG 1 hàng hỏng nên không phát hiện; (b) id `<slug>#F<n>` sai vị trí phá AC-10 ('mỗi claim truy về nguồn qua pointer, id ổn định') và phá đường cite `[<id>]` mà SKILL.md coi là 'đường đo việc dùng lại bài học' — critic cite F1 nhưng người mở gap-probe.md sẽ đọc nhầm hàng khác. Nên hoặc bỏ cả file khi có hàng hỏng (khớp thông điệp), hoặc đánh n theo vị trí hàng thật và đổi thông điệp thành skip-per-row.
  source: conventions
  rationale: AC-2 xác định rõ Given là gap-probe.md có bảng Findings lệch khuôn với phần hỏng bị bỏ qua và stderr phải in đúng thông điệp đếm skipped cho từng file hỏng — finding chứng minh thông điệp sai (nói 'skipped file' dù chỉ một hàng bị bỏ), đúng khuôn Given/Then của AC-2.

- **isMain dùng URL.pathname không decode — path chứa khoảng trắng làm CLI thành no-op exit 0, feature tắt im lặng**
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs:106`
  severity: medium
  AC: AC-4
  detail: '`new URL(import.meta.url).pathname` trả về path còn percent-encoding (khoảng trắng → %20), trong khi `process.argv[1]` là path đã decode, nên `isMain` = false khi đường dẫn script chứa khoảng trắng (hoặc ký tự nào bị encode trong file URL). Repro: copy script vào ''dir with space/'' rồi chạy → stdout RỖNG, exit 0. Đây là fail-open đúng lớp mà kit cấm (xem doctrine trong scripts/sync-plugin-packages.sh): SKILL.md S1#7 quy ước ''exit 0 + file trống → corpus rỗng, không note'', nên toàn bộ input thứ 5 tắt im lặng không dấu vết — kể cả nhánh validate args (thiếu --slug lẽ ra exit 2 + usage, CS4d) cũng bị bypass. Đồng thời sai pattern có sẵn của repo: scripts/build-design-scan.mjs:13 và lib/design-detect.mjs:14 đều dùng `fileURLToPath(import.meta.url)`. Sửa: so sánh qua `fileURLToPath`.'
  source: conventions
  rationale: AC-4 yêu cầu rõ ràng — thiếu tham số bắt buộc (--slug) hoặc root sai PHẢI exit khác 0 kèm thông điệp usage, không được rơi vào nhánh im lặng hợp lệ — finding chứng minh có điều kiện (đường dẫn cài đặt chứa khoảng trắng) khiến toàn bộ nhánh validate/usage này không bao giờ chạy, exit 0 im lặng bất kể tham số.

- **isMain check breaks on paths with spaces/unicode — CLI silently outputs nothing, exit 0**
  file: `feature-loop/scripts/claim-scan.mjs:106`
  severity: high
  AC: AC-4
  detail: 'Confirmed by repro. `const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)` — URL.pathname is percent-encoded (space → %20), while process.argv[1] is not. If the kit/plugin is installed under any path containing a space or non-ASCII char, isMain is false: the script parses nothing, validates nothing, prints nothing, and exits 0. Repro: copied the script to a dir with a space and ran `node .../claim-scan.mjs --root /nonexistent --slug x` → exit 0, no output (expected exit 2 ''root not found''). Per the SKILL.md step-7 integration (''Exit 0 và file CÓ nội dung → input 5; file trống → corpus rỗng, không note''), this is indistinguishable from an empty corpus, so cross-feature claims are silently disabled with no claims_input:failed flag. Fix: use fileURLToPath(import.meta.url) (node:url, already used in both test files) instead of new URL(...).pathname.'
  source: bugs
  rationale: Cùng bug với bản tiếng Việt — AC-4 yêu cầu exit khác 0 kèm thông điệp usage khi thiếu tham số hoặc root sai; finding chứng minh điều kiện đường dẫn khiến nhánh này không bao giờ chạy, vi phạm trực tiếp Then của AC-4.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Lớp skip-im-lặng còn sót: entry fix/descope thiếu/hỏng id và frontmatter không parse được bị drop không warn**
  Người dùng thấy gì: Một số bài học đã ghi (sửa lỗi/giới hạn phạm vi) từ feature trước có thể biến mất khỏi gợi ý mà không có cảnh báo nào, khiến người xem lầm tưởng không có bài học liên quan để tham khảo.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **Doc-truth: 'Prompt giữ đủ 6 ý' nhưng liệt kê 7 ý sau khi thêm (7)**
  Người dùng thấy gì: Tài liệu hướng dẫn cho công cụ AI ghi sai số lượng nội dung cần giữ nguyên, có thể khiến bước tích hợp sau này vô tình hiểu nhầm và bỏ sót một yêu cầu khi làm theo tài liệu.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Ledger entries with missing/invalid id silently dropped without warning**
  Người dùng thấy gì: Một mục ghi trong sổ quyết định (sửa lỗi/giới hạn phạm vi) có định dạng nhận diện không chuẩn sẽ bị loại âm thầm khỏi danh sách gợi ý, không để lại dấu vết cảnh báo nào.
  file: `feature-loop/scripts/claim-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **gap-probe finding ids shift when an earlier row is malformed; Findings regex captures to EOF**
  Người dùng thấy gì: Khi một phần dữ liệu bị lỗi định dạng, các gợi ý bài học còn lại có thể bị đánh số nhầm hoặc trỏ sai vị trí, khiến người bấm theo trích dẫn tìm nhầm nội dung; cũng có thể phát sinh cảnh báo giả hoặc gợi ý bịa từ phần văn bản không liên quan.
  file: `feature-loop/scripts/claim-scan.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
