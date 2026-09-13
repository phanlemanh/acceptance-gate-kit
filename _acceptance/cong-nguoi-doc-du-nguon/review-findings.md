## Trong hợp đồng

- **contentLines table branch leaks raw markdown headings and splits wrapped prose — the two defects rounds 6/7 fixed in the prose branch**
  file: `lib/md-section.cjs:121`
  severity: low
  source: bugs
  AC: AC-15

  `contentLines` has two exits for a section with no bullets. The prose exit deliberately drops headings and separators and joins 80-column wrapped lines (`if (!l.trim() || laTieuDe(l) || LA_PHAN_CACH.test(l)) { dangMo = false; continue; }`). The table exit above it returns `con` untouched — `con` filters only blanks and separator rows, so headings and wrapped prose fall straight through.

  Verified in the worktree:
  `## Coverage` + `### Trục A` + table + `### Trục B` + table
    -> ['### Trục A', '| Trục | Giá trị |', '| A | 1 |', '### Trục B', '| B | 2 |']
  `## Coverage` + table + wrapped note ("…không đo được" / "trong vòng này.")
    -> [… , 'Ghi chú: trục C bỏ vì không đo được', 'trong vòng này.']

  These lines go to `covLines` in gate-card.js:421 and are rendered one `<p class="li">` each at line 647 and emitted as `coverage` in `--extract`. So a mixed table+prose Coverage section puts literal `### …` and `| … |` markup on the human decision card and cuts a sentence in half — the same shape the file's own comments call "bịa ra một hàng" and the 05/08 findings class the prose branch was fixed for.

  Failure scenario: A contract writes Coverage as `### Trục A` sub-headings over small tables plus an 80-column-wrapped note. The Gate 1 card shows `### Trục A` as if it were a coverage claim, shows raw pipe rows, and renders the note as two fragments, the first ending mid-sentence at 'không đo được'. The human approves coverage on a mangled rendering.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **contentLines re-inlines the heading regex that laTieuDe was just created to be the single source of**
  Người dùng thấy gì: Nếu sau này quy tắc nhận diện dòng tiêu đề trong tài liệu được thu hẹp lại, một phần của thẻ quyết định có thể vẫn dùng quy tắc cũ trong khi phần còn lại đã đổi, khiến nội dung hiển thị không đồng nhất giữa các phần của cùng một thẻ.
  file: `lib/md-section.cjs`
  severity: medium
  Đề xuất: known-limits

- **contentLines duplicates gate-card's bullets(); two copies of the wrap-joining rule now exist**
  Người dùng thấy gì: Nếu quy tắc gộp các dòng gạch đầu dòng bị sửa ở một chỗ, một vài mục khác trên cùng thẻ quyết định có thể vẫn hiển thị theo quy tắc cũ, làm nội dung không đồng nhất trên cùng một thẻ.
  file: `lib/md-section.cjs`
  severity: medium
  Đề xuất: known-limits

- **Cross-layer teeth in pre-merge-check.sh still parse criteria line-by-line (declared out of scope — informational)**
  Người dùng thấy gì: Với những hợp đồng khai tiêu chí theo kiểu tiêu đề, một lớp kiểm tra chặn hợp nhất mã ở biên giữa các kho vẫn chưa đọc được các tiêu chí đó, nên lớp chặn này coi như không hoạt động với các hợp đồng dạng đó — điều này đã được ghi nhận và hoãn sang một đợt vá riêng.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **pre-merge cross-layer teeth still read criteria line-by-line — heading-form / `Acceptance Criteria` contracts now pass silently**
  Người dùng thấy gì: Một số hợp đồng khai tiêu chí theo kiểu tiêu đề có thể được hợp nhất vào mã chính chỉ dựa trên bằng chứng hiển thị trên giao diện, vì lớp kiểm tra chặn tự động ở biên giữa các kho không nhìn thấy các tiêu chí đó và bỏ qua trong im lặng, trong khi trước đây từng có cảnh báo rõ ràng cho đúng trường hợp này — đây là khoảng hở đã được ghi nhận và hoãn sang một đợt vá riêng.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: known-limits

- **`status: not-run` with a trailing YAML comment is silently ignored**
  Người dùng thấy gì: Khi người viết ghi thêm lý do ngay trên cùng dòng khai một hạng mục là 'chưa chạy', hệ thống có thể hiểu nhầm thành 'đã chạy', khiến báo cáo bằng chứng ghi nhận một phép kiểm chưa từng thực hiện mà không có cảnh báo nào.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 — assertion âm-tính-một-mình: chiều đỏ GL04 xanh vì bản tiêm SẬP (TypeError), không vì cổng thôi chặn**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để canh giữ một cổng an toàn của kit có thể báo 'cổng vẫn giữ đúng' ngay cả khi phần cần kiểm chưa từng chạy thật do lỗi hạ tầng bên trong, khiến người vận hành tin nhầm là cổng còn hoạt động trong khi bài kiểm không thật sự chứng minh điều đó.
  file: `tests/scripts/repin-lane-lop-cu.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — bảng quan hệ `qh` của CN15 không có hằng đếm NGOÀI bảng, xoá một hàng là mất assert lặng lẽ**
  Người dùng thấy gì: Bài kiểm tra tự động cho một khía cạnh của tính năng này có thể tiếp tục báo 'đạt' ngay cả khi một trường hợp kiểm tra bị vô tình xoá mất, vì không có con số canh giữ độc lập nhắc rằng phải kiểm đủ bốn trường hợp.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — evals.yaml khai chiều đỏ mà tệp ca không có vật (E5/L05, E9/L08)**
  Người dùng thấy gì: Trong một tính năng khác đang chờ duyệt riêng, lời khai trong hồ sơ đánh giá về cách phép thử sẽ phát hiện lỗi không khớp với bài kiểm tra thật đang chạy, dù bài kiểm tra vẫn phân biệt đúng/sai bằng một cách khác trong thực tế.
  file: `_acceptance/lan-doc-status-not-run/evals.yaml`
  severity: low
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 5/9 lỗi rơi vào file không bộ đo nào phủ (scripts/pre-merge-check.sh, lib/evidence-core.cjs, tests/scripts/repin-lane-lop-cu.test.mjs, _acceptance/lan-doc-status-not-run/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.