## Trong hợp đồng

### P160 never compares against the pre-diff script — E10's "đường đọc-cũ" measurement does not exist
- file: `tests/plugins/run-tests.sh:6510`
- severity: high
- source: bugs
- AC: AC-10

Eval E10 (AC-10) states the measurement as: "--json của bản mới == --json bản TRƯỚC-diff sinh trong chính lần chạy (git show/worktree tại base, không golden tĩnh)", and plan step 1 spells out `git show <base>:scripts/acceptance-gold.mjs` into a temp file. The implemented P160 does none of that — `grep -n 'git show|merge-base|rev-parse'` over the whole added block (lines 6120-6588) returns zero hits. What P160 actually does is (1) run the CURRENT script on a hand-built old-shape fixture, and (2) assert internal consistency between the current script's own `--json` and its own text output. Both legs are self-consistent by construction: if the parser silently changed, section (1) only catches it when the author happened to hand-write a fixture exercising the changed branch, and section (2) compares the new script to itself and is green no matter what. The grandfather claim therefore reports PASS while never having been measured. (I did the comparison manually — `node <base copy> --root . --json` vs `node scripts/acceptance-gold.mjs --root . --json` is byte-identical today, so the underlying behavior is fine; the defect is that the eval will stay green if it ever stops being.) This is the repo's own "assertion âm-tính-một-mình / hạ thước cho vừa vật" class: the measurement named in the contract was replaced by a weaker one that cannot fail for the reason it claims to guard.

rationale: AC-10 nêu rõ Then: "--json giữ nguyên từng byte so bản trước khi sửa" — phép đo hiện chỉ so script hiện tại với chính nó nên không thực sự chứng minh đúng điều AC-10 hứa.

### AC-5 causal claim survives on the zero-panel path; E5's pinned string misses it by two words
- file: `scripts/acceptance-gold.mjs:215`
- severity: medium
- source: bugs
- AC: AC-5

AC-5 requires "câu giải thích trung tính — KHÔNG khẳng định nguyên nhân thiếu dữ liệu", and the noPanel block was duly rewritten. But the sibling `!g.sample` branch still prints: `Chưa có hội đồng chấm nào được ghi lại — các việc cũ chấm trước khi máy bắt đầu ghi biên bản hội đồng.` That is the same unfounded causal assertion, and it fires exactly in the most common consumer case: a repo where NO workspace has a panel line (fresh repo running the kit for the first time, or run-logs lost). The human then reads a confident, possibly false explanation of why data is missing. Reproduced with a one-workspace fixture (empty run-log.jsonl): both the neutral noPanel block AND the old causal sentence print together, contradicting each other. P157/E5 does not catch this because it pins the literal `"chấm trước khi máy bắt đầu ghi chép"` while line 215 reads `"...bắt đầu ghi biên bản hội đồng"` — the assert measures a string, not the property ("no causal claim about missing panel data"), so it passes vacuously against the surviving branch. Same line in the mirror at plugins/acceptance-gate/scripts/acceptance-gold.mjs:215.

rationale: AC-5 Then cấm rõ "KHÔNG khẳng định nguyên nhân thiếu dữ liệu", nhưng nhánh !g.sample vẫn in một câu khẳng định nguyên nhân — vi phạm trực tiếp điều AC-5 cấm.

### Hình dạng 3 — assert enum VERDICT_VI chỉ đo 'có chuỗi dạng X (MÃ)' trong khi lời hứa là quan hệ mã ⇒ chữ tiếng người trong map
- file: `tests/plugins/run-tests.sh:6331`
- severity: medium
- source: measurement
- AC: AC-2

P157 mục (a) rút map từ source đúng (6316-6318) nhưng chỉ giữ KHÓA: `enum_keys = re.findall(r"(\w+):", mm.group(1))` — vế giá trị ('đạt', 'chưa đạt', 'chưa chắc') nằm sẵn trong `mm.group(1)` bị vứt đi. Assert ở 6331 là `re.fullmatch(r"[^()]+ \(%s\)" % code, cell)`: lớp `[^()]+` nhận BẤT KỲ chữ nào không có ngoặc. Quan hệ thật cần ghim là VERDICT_VI[code] ⇒ nội dung ô, nhưng phép đo chỉ ghim hình dạng chuỗi. Kịch bản fail: tráo giá trị trong acceptance-gold.mjs thành `PASS: 'chưa đạt', FAIL: 'đạt'` — sổ vàng in "chưa đạt (PASS)" cho việc người đã cho qua, đúng lớp lỗi tiếng-người mà AC-2 sinh ra để chặn, mà P157 vẫn xanh vì 'chưa đạt' khớp `[^()]+`. Nhánh WEIRD ở 6329 ngược lại có so nội dung đầy đủ, cho thấy so-nội-dung là làm được ở đây.

rationale: AC-2 yêu cầu ma trận toàn phần chứng minh đúng quan hệ mã⇒chữ tiếng người từ map một-nguồn, nhưng assert hiện chỉ kiểm tra hình dạng chuỗi (bất kỳ chữ nào cũng khớp) nên không thực sự chứng minh được quan hệ mà AC-2 hứa.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **P160 pins a committed snapshot against the LIVE kit corpus — the next Gate-2 signoff anywhere turns this test red**
  Người dùng thấy gì: Bài kiểm tra tự động của tính năng này có thể tự nhiên báo lỗi ở một đợt duyệt hoàn toàn không liên quan trong tương lai, khiến người xem tưởng nhầm là tính năng đang hỏng trong khi không phải vậy.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **New single-source marker SIGNOFF-JARGON-GLOSS is not registered in the marker-uniqueness registry**
  Người dùng thấy gì: Nếu sau này có người sao chép phần giải nghĩa biệt ngữ sang một tài liệu khác, hai bản có thể lệch nội dung theo thời gian mà không có cảnh báo nào, khiến lời giải thích hiển thị cho người đọc bị sai mà không ai hay biết.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **P160 provenance check will go red on any unrelated future signoff, with a message that names the wrong cause**
  Người dùng thấy gì: Bài kiểm tra sổ vàng của tính năng này có thể tự động chuyển sang màu đỏ ở một đợt duyệt không liên quan sau này, và thông báo lỗi lúc đó sẽ chỉ sai nguyên nhân, khiến người xử lý mất thời gian tìm nhầm chỗ.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **`--root` with a missing value silently falls back to cwd, defeating the new fail-loud guard**
  Người dùng thấy gì: Nếu ai đó gõ lệnh thiếu giá trị sau tuỳ chọn chỉ định thư mục, công cụ sẽ âm thầm chuyển sang đọc thư mục hiện tại thay vì báo lỗi rõ ràng, có thể khiến người dùng nhận báo cáo tính sai chỗ mà không hay biết.
  file: `scripts/acceptance-gold.mjs`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **/acceptance-report still instructs copying only two blocks, so the new glossary never reaches the human surface**
  Người dùng thấy gì: Hướng dẫn hiện tại cho người tạo báo cáo bỏ sót đúng khối giải nghĩa biệt ngữ mới thêm, nên người ra quyết định cuối cùng vẫn có thể nhìn thấy các thuật ngữ khó hiểu trong lời ký mà không có chú giải đi kèm.
  file: `commands/acceptance-report.md`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 2 — fixture evidence-report.md VIẾT TAY đúng khuôn bên ĐỌC, không round-trip từ JUDGMENT-BLOCK-TEMPLATE**
  Người dùng thấy gì: Các bài kiểm tra cho phần này tự viết tay dữ liệu mẫu đúng theo cách máy đọc, thay vì lấy từ đúng khuôn mẫu gốc mà con người dùng để viết báo cáo thật; nếu khuôn mẫu gốc thay đổi sau này, báo cáo thật có thể không còn được tính điểm đúng mà không có cảnh báo nào phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 2 — phép đo xuất xứ của gold-stdout.txt bỏ trống đúng khối mà judge J1 được hỏi (khối đồng thuận + khối chưa-có-biên-bản)**
  Người dùng thấy gì: Phần số liệu đồng thuận của hội đồng chấm — đúng phần mà người giám khảo sẽ đọc để ra quyết định — không được xác minh là bản do máy vừa in ra, nên nếu số liệu đó bị sửa tay hoặc hiển thị sai, không có cảnh báo nào bắt được.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).