## Trong hợp đồng

### Regex section Re-pin chỉ bắt được MỘT dòng đầu body — run_id không nằm dòng đầu là bị grandfather âm thầm
- file: `scripts/recheck-evidence.js:53`
- severity: high
- AC: AC-2
- rationale (vì sao map vào AC): AC-2 hứa mọi section Re-pin khuôn mới bị mismatch (kể cả không đọc được run_id do lệch định dạng) phải thành VIOLATION chứ không được lặng lẽ coi là clean/grandfathered; bug khiến đúng trường hợp này lọt lưới.
- detail: `/^###\s+Re-pin\b[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n*$)/gm` — với flag `m`, `$` khớp ở CUỐI MỖI DÒNG, nên nhánh lookahead `\n*$` thỏa ngay tại end-of-line đầu tiên và quantifier lazy dừng: m[1] chỉ chứa đúng 1 dòng body (đã kiểm chứng bằng node: header + dòng trống + `run_id:` → capture = "" rỗng). Hệ quả: section kiểu MỚI mà có dòng trống sau heading (chính là style markdown mặc định — fixture oldStyleSection trong tests/scripts/repin-fixture.mjs cũng viết `### Re-pin...\n\n...`) hoặc run_id không phải dòng đầu → recheck coi là grandfather, toàn bộ luật fraud TẮT IM LẶNG (fail-open), trong khi awk của pre-merge-check.sh quét TRỌN section và vẫn enforce — hai bộ cưỡng chế của cùng một luật T1 (AC-15) cho kết luận ngược nhau trên cùng một report. Vi phạm bất biến CLAUDE.md về seam LLM-viết→máy-đọc: round-trip DV12 chỉ phủ đúng hình dạng không-dòng-trống của template, không phủ biến thể writer hợp lý. Intent của regex rõ ràng là 'tới heading kế hoặc hết văn bản' — cần bỏ nhánh `\n*$` (hoặc dùng `$(?![\s\S])`) và thêm case round-trip có dòng trống.

### Pre-merge fail-open khi dòng repin THIẾU hẳn field suites_exit — lệch với recheck, và round-trip DV12 chỉ phủ 1 trong 2 reader
- file: `scripts/pre-merge-check.sh:795`
- severity: high
- AC: AC-15
- rationale (vì sao map vào AC): AC-15 yêu cầu CẢ recheck và pre-merge đều bắt dòng kind:repin có suites_exit thiếu/không hợp lệ là VIOLATION đích danh; pre-merge bỏ sót trường hợp thiếu hẳn field là vi phạm trực tiếp một nửa yêu cầu song-cưỡng-chế đó.
- detail: Pre-merge chỉ grep tìm phần tử KHÁC 0 (`grep -Eq '"suites_exit":...[1-9]'`) mà không kiểm tra field CÓ MẶT: dòng `{"kind":"repin","run_id":...,"sha":<vc>}` không có suites_exit đi qua pre-merge sạch, trong khi recheck-evidence.js:78 (`!Array.isArray(e.suites_exit) || ...`) từ chối cùng dòng đó. Đường threat đúng của feature này (hand-edit ngoài harness → PR, hook không chạy) chỉ còn pre-merge chặn → lane chưa từng ghi suites vẫn back được chữ ký. Test DV12m (đột biến khuôn suites_exit→suites) chỉ round-trip qua recheck-evidence.js; đưa mutant đó qua pre-merge thì XANH — seam REPIN-TEMPLATE có HAI reader nhưng round-trip theo bất biến CLAUDE.md ('rút-từ-writer-đọc-bằng-reader') mới phủ một. Cần thêm nhánh 'thiếu suites_exit = VIOLATION' cho pre-merge và một leg DV12 chạy qua pre-merge-check.sh.

### crossLayerACs là parser AC thứ hai, lệch khỏi parser chuẩn (eval-coverage-lint parseACs) — atomic-pair có thể tắt im lặng đúng lớp false-green bị cấm
- file: `feature-loop/scripts/carry-plan.mjs:63`
- severity: medium
- AC: AC-9
- rationale (vì sao map vào AC): AC-9 hứa mọi criterion mang dấu cross-layer thì atomic-pair phải giữ nguyên (chạy lại cả cặp); parser lệch khiến một số dạng đánh dấu cross-layer hợp lệ (mà lint chuẩn công nhận) bị bỏ sót nên luật atomic-pair không áp dụng cho chúng.
- detail: Parser chuẩn scripts/eval-coverage-lint.js:100-101 nhận `^\s*[-*]\s*(AC-\d+)\s*[:.]` và tag `/\(cross-layer\)/i` (case-INsensitive, bullet `*`, cho phép thụt đầu dòng và `.` thay `:`). crossLayerACs của carry-plan chỉ nhận `^-\s+(AC-\d+):` và tag case-SENSITIVE. Một criterion mà lint công nhận là cross-layer (vd `* AC-3: ... (Cross-layer) ...` hay dòng thụt lề) bị carry-plan bỏ sót → luật atomic-pair AC-9 tắt im lặng → bằng chứng backend round cũ được carry trong khi eval UI chạy lại — chính xác kiểu ghép round bị P1/AC-9 cấm, và fail theo hướng false-green (nguy hiểm), không phải hướng over-rerun. Contract findings-section-boundary đã ghi nhận đúng lớp lỗi này ('răng cross-layer pairing tắt im lặng'). Nên rút detection về dùng chung parseACs (hoặc tối thiểu đồng bộ regex + /i và thêm eval hai-chiều so hai parser trên cùng corpus contract thật).

### Re-pin section regex in recheck-evidence.js only reads the FIRST line after the heading — new-form re-pins silently grandfathered, hook bypassable
- file: `scripts/recheck-evidence.js:53`
- severity: high
- AC: AC-2
- rationale (vì sao map vào AC): Cùng lỗi với finding regex ở trên diễn giải chi tiết hơn bằng tiếng Anh: phá vỡ đúng cam kết của AC-2 rằng mismatch phải thành VIOLATION thay vì bị coi là grandfathered.
- detail: The section matcher `/^###\s+Re-pin\b[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n*$)/gm` has the `m` flag, so `$` in the `\n*$` alternative matches at EVERY line end. The lazy `[\s\S]*?` therefore stops at the first end-of-line: the captured section body is only the single line immediately after the heading. Empirically verified: with a blank line after `### Re-pin ...` the capture is `""`; with a prose line first (e.g. `Suite chạy lại xanh tại HEAD.` then `run_id: ...`) the capture is the prose line — in both cases `run_id:` is never seen and the section is silently treated as grandfathered (exit 0). Meanwhile the awk in scripts/pre-merge-check.sh:776 scans the WHOLE section, so the two enforcers the comments claim implement the same rule disagree. Consequence: a hand-minted/fraudulent `run_id` cited in a `### Re-pin` section passes the recheck hook (the write-time first line of defense) whenever the writer inserts a blank line after the heading or any line before `run_id:` — a trivially common markdown deviation from REPIN-TEMPLATE. The round-trip test (tests/scripts/repin-roundtrip.test.mjs) only exercises the exact template shape (run_id on line 1), so this never turns red. Same divergence class: recheck's `/^\s*run_id\s*[:=]\s*([^\s·,]+)\s*$/im` requires nothing after the id, while pre-merge strips trailing ` · ...` — a line like `run_id: X · note` is enforced by pre-merge but invisible to recheck. Fix: end-anchor should be end-of-string, e.g. `(?=\n#{1,3}\s|$(?![\s\S]))`, and scan the full body for run_id lines like the awk does. Mirror copy plugins/acceptance-gate/scripts/recheck-evidence.js has the identical bug (fix source then sync per CLAUDE.md).

### pre-merge-check.sh silently passes a repin line whose suites_exit field is MISSING or malformed — diverges from recheck-evidence.js on the same rule
- file: `scripts/pre-merge-check.sh:795`
- severity: medium
- AC: AC-15
- rationale (vì sao map vào AC): Cùng lỗi với finding suites_exit ở trên diễn giải chi tiết hơn bằng tiếng Anh: vi phạm trực tiếp yêu cầu song-cưỡng-chế của AC-15 giữa recheck và pre-merge.
- detail: The red-lane check is `grep -Eq '"suites_exit":[[:space:]]*\[[0-9, ]*[1-9]'` — it only fires when a nonzero digit is PRESENT inside the array. A repin line with no `suites_exit` key at all (or a non-array/garbage value) does not match, so pre-merge raises no violation, even though the stated rule is "every suites_exit element must be 0". Empirically verified: `{"kind":"repin","run_id":"r1","sha":"aaa"}` → pre-merge passes silently, while recheck-evidence.js:78 (`!Array.isArray(e.suites_exit) || ...`) flags the same line. Consequence: a repin line appended without ever running the suites (the exact fraud this net exists to block — 'ký mù' without lane evidence) backs a signature straight through CI; the only remaining net is the recheck hook, which per finding 1 is itself bypassable via section formatting — combined, a fully unverified re-pin can pass both enforcers. Fix: add an explicit check that the repin line contains a well-formed `"suites_exit":[...]` array (e.g. `grep -Eq '"suites_exit":[[:space:]]*\[[0-9, ]+\]'` as a presence gate) and VIOLATION when absent, matching recheck-evidence.js. Mirror copy plugins/acceptance-gate/scripts/pre-merge-check.sh has the identical gap.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **globToRe của carry-plan tự nhận 'cùng ngữ nghĩa với matcher của kit' nhưng lệch: `?` là wildcard trong khi matcher chuẩn cố tình escape `?` thành literal**
  Người dùng thấy gì: Một số đường dẫn tệp có ký tự '?' hiếm gặp có thể khiến hệ thống thận trọng chạy lại kiểm tra nhiều hơn cần thiết ở vòng sửa lỗi tiếp theo — tốn thêm thời gian chờ nhưng không bỏ sót kiểm tra nào.
  file: `feature-loop/scripts/carry-plan.mjs:30`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).