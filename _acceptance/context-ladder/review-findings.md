## Trong hợp đồng

### Placeholder context_scenes chưa điền được đếm là 1 cảnh — false green đúng seam writer→reader
- file: `scripts/gate-card.js:214`
- severity: high
- AC: AC-6
- source: conventions
- detail: Filter `!/^</.test(s)` định loại placeholder sống, nhưng placeholder trong chính khuôn writer (skills/design-pass/SKILL.md: `[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]`) CHỨA DẤU PHẨY — split(',') tách đôi, nửa sau 'trống nếu không standalone hoặc đã descope>' không bắt đầu bằng '<' nên sống sót → scenes.length=1. Đã tái hiện end-to-end: sổ phiên `context: standalone` + placeholder nguyên trạng → cờ vàng 'chưa có cảnh ngữ-cảnh' KHÔNG hiện, và thẻ còn khẳng định '1 cảnh ngữ-cảnh'. Đây đúng lớp false-green seam LLM-viết→máy-đọc mà CLAUDE.md ghim (khuôn một marker + round-trip); P135 cố tình assert fixture không còn placeholder sống nên suite không bao giờ đi qua nhánh này — thiếu 1 case tiêm placeholder nguyên trạng. Fix gợi ý: parse list trước rồi loại phần tử chứa '<'/'>' ở bất kỳ vị trí, hoặc loại cả list nếu chuỗi gốc chứa '<'. Mirror plugins/ cùng lỗi. Rationale: AC-6 đòi cờ vàng phải hiện khi khai standalone mà không có cảnh ngữ-cảnh thật; finding cho thấy placeholder chưa điền từ khuôn writer bị đếm thành cảnh thật nên cờ vàng bị nuốt — đúng nhánh AC-6 thất bại.

### Parser design_pass hand-rolled thứ 5 thay vì resolveConfigKey của lib — blank line trong block gây cờ vàng oan
- file: `scripts/gate-card.js:218`
- severity: medium
- AC: AC-4
- source: conventions
- detail: Khối mới regex-parse `^design_pass:\n((?:[ \t]+.*\n?)*)` thay vì dùng resolveConfigKey đã export từ lib/evidence-core.js (dòng 41, xử lý đúng blank line + comment). Chính gate-card.js có comment ở phần glossary: kit đã có 4 parser hand-rolled và 1.20.1 phải vá cùng bug ở cả 4 — 'this is not the place to grow a fifth'. Đã tái hiện: config.yaml hợp lệ có dòng trống trong block design_pass trước `host_embed:` → regex cắt block tại dòng trống, he.present=false → cờ vàng oan 'Repo chưa khai đường nhúng' trong khi resolveConfigKey(cfg,'design_pass.host_embed.guide') giải ra đúng 'docs/nhung.md'. Regex cũng fail trên CRLF (`design_pass:\r\n`) và match `guide:` ĐẦU TIÊN ở bất kỳ độ sâu nào trong block (sẽ bắt nhầm nếu design_pass sau này có sub-key khác chứa guide). Warn-only nên không chặn ai, nhưng là sai pattern có sẵn + thông điệp cờ nói sai sự thật về config của consumer. Mirror plugins/ cùng lỗi. Rationale: AC-4 yêu cầu khi khoá host_embed CÓ và con trỏ giải được thì không được báo như thể chưa khai; finding cho thấy dòng trống trong block khiến hệ thống báo sai 'chưa khai đường nhúng' dù khoá thực sự có mặt.

### Untouched context_scenes placeholder counts as a real scene — standalone-missing-scenes yellow flag silently suppressed
- file: `scripts/gate-card.js:214`
- severity: high
- AC: AC-6
- source: bugs
- detail: The scenes parser splits on ',' BEFORE filtering placeholders: `clean(...).replace(/^\[|\]$/g,'').split(',').map(trim).filter(s => s && !/^</.test(s))`. The writer template placeholder `[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]` contains a comma, so it splits into two parts and the second part ('trống nếu không standalone hoặc đã descope>') does not start with '<' and survives the filter. Reproduced end-to-end: a design-pass.md generated from the SKILL template with `context: standalone` filled in but context_scenes left as the raw placeholder renders exit 0, NO 'chưa có cảnh ngữ-cảnh' yellow flag, and the card shows 'sống ở: đứng một mình · 1 cảnh ngữ-cảnh'. This is a silent false-negative on the exact flag this feature adds and violates the file's stated trust invariant (card must never make an incomplete state look approvable). It evades P136 because every test substitutes the placeholder before rendering. Fix must be layered per CLAUDE.md: filter placeholder before splitting (or drop any part containing '<'/'>'), sync the mirror plugins/acceptance-gate/scripts/gate-card.js, and add a test case that renders the template with the placeholder left untouched. Rationale: Cùng lỗi và cùng vi phạm AC-6 như finding tiếng Việt tương ứng (khoá theo (file,title), tiêu đề khác nhau nên tách mục riêng).

### Trailing YAML comment on design_pass.host_embed.guide breaks resolvability check — spurious 'con trỏ không giải được' flag
- file: `scripts/gate-card.js:223`
- severity: medium
- AC: AC-4
- source: bugs
- detail: '`he.guide = g[1].trim().replace(/^["\']|["\']$/g, \'\')` strips quotes but NOT a trailing `# comment`, unlike the script''s own `clean()` helper (line 92, documented as ''matches hook tolerance'') and the hook''s config parsing (hooks/acceptance-evidence-gate.js:56 uses `(?:#.*)?$`). Reproduced: config `guide: docs/nhung.md  # đường nhúng` with docs/nhung.md present yields the yellow flag ''Đường nhúng đã khai nhưng con trỏ không giải được: "docs/nhung.md  # đường nhúng"'' — a false dead-pointer warning that names a mangled pointer, on a config style the kit elsewhere accepts. Advisory-only (non-blocking) but tells the reviewer to ''sửa con trỏ'' that is actually fine. Same code in mirror plugins/acceptance-gate/scripts/gate-card.js.' Rationale: AC-4 nhánh 'khoá CÓ và con trỏ giải được' không được phép báo cờ 'không giải được'; comment cuối dòng YAML hợp lệ khiến hệ thống báo sai là con trỏ hỏng dù file đích tồn tại.

### CRLF config.yaml silently fails design_pass block match — host_embed declared but reported as absent
- file: `scripts/gate-card.js:218`
- severity: low
- AC: AC-4
- source: bugs
- detail: The block regex `/^design_pass:\n((?:[ \t]+.*\n?)*)/m` requires a bare \n after the key; a config.yaml with CRLF line endings ('design_pass:\r\n') never matches, so `he.present` stays false and the card emits the spurious flag 'Repo chưa khai đường nhúng (design_pass.host_embed)' even though the socket is fully declared and the guide file exists (reproduced). The kit is CRLF-aware elsewhere in this same file (frontmatter regex uses \r?\n at line 91), so this is an inconsistency that will surface on Windows-authored consumer configs. Non-blocking (yellow flag only). Same code in mirror plugins/acceptance-gate/scripts/gate-card.js. Rationale: Cùng nhánh AC-4 (khoá CÓ và con trỏ giải được không được báo như chưa khai); CRLF hợp lệ khiến hệ thống báo sai 'Repo chưa khai đường nhúng' dù khoá và con trỏ đều đúng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Chuỗi từ artifact/config chèn thẳng vào HTML thẻ không qua esc()**
  Người dùng thấy gì: Nếu ghi chú thiết kế hoặc file cấu hình của repo chứa đoạn mã HTML/script, thẻ quyết định Cổng 1 có thể chạy đoạn mã đó ngay khi người duyệt mở xem, thay vì chỉ hiển thị dưới dạng chữ.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).