## Trong hợp đồng

### 1. Hồi quy: frontmatter thiếu rào đóng thì human_override / verified_at thụt lề trong khối evidence lọt khỏi chốt
- file: `feature-loop/workflows/acceptance-verify.js:157`
- severity: high
- source: conventions
- AC: AC-1
- rationale: Repro trên mã thật cho thấy human_override có giá trị trong khối judgment không bị rỗng hoá sau khi chốt chạy, đúng Given/Then của AC-1.

Khuôn mới coi mọi dòng trong (fmDau, fmHet) là frontmatter, và khi thiếu rào đóng thì fmHet = n, tức cả tệp. Nhánh `if (trongFm && m[1] !== '') return l` (khoảng dòng 157) vì thế bỏ qua MỌI dòng thụt lề, kể cả `  human_override:` và `  verified_at:` nằm trong khối `- eval:` ở thân. Bên đọc L3 (lib/evidence-core.cjs:920, `/human_override\s*[:=]\s*[^#\s]/gi` quét trên toàn payload) vẫn đếm dòng đó. Đã chạy lại bằng napChot: với `---\nverdict: PASS\n\n## Evidence\n\n- eval: E4\n  run_id: r4\n  verified_at: 2099-01-01T00:00:00Z\n  human_override: Bot\n` thì bản HEAD trả doi={human_override:0, verified_at:0} và giữ nguyên «human_override: Bot» cùng giờ 2099. Bản ở dd34710a trên cùng đầu vào thì xoá override và ép giờ carry (doi human_override:1, verified_at:1). Nghĩa là tác tử quên dòng `---` đóng là tự giải được một UNCERTAIN ở L3, đúng lớp lỗi ADR 0002 mà vòng này đi chặn. Bảng vi phân không thấy lỗi này: trục B (bangViPhan) chỉ dựng rào ĐÓNG, còn biến thể 'khong-dong' chỉ có ở trục A (human_signoff ở cột 0).

### 2. When the closing frontmatter fence is missing, the whole file counts as frontmatter, and every indented human_override and verified_at line is skipped without any signal
- file: `feature-loop/workflows/acceptance-verify.js:160`
- severity: high
- source: bugs
- AC: AC-1
- rationale: Repro byte-for-byte trên mã thật cho thấy human_override có giá trị trong khối judgment không bị rỗng hoá — vi phạm trực tiếp Then của AC-1.

With no closing `---`, fmHet = n (line 120), so trongFm is true for every line after the opening fence, including the body. Line 160, `if (trongFm && m[1] !== '') return l`, then returns early for every line that has indentation or a `- ` prefix. That covers all human_override and verified_at lines inside eval blocks, for every key and not only human_signoff/bypass_ack. The reader still accepts this report. isPassFamily falls back to CLAIM_RE. L3 counts `human_override\s*[:=]\s*[^#\s]` across the whole payload, and HAS_VERIFIED_AT also matches anywhere. Reproduced with napChot on the real source. Input: `---\nverdict: PASS\n\n- eval: E4\n  run_id: run-goc-E4\n  verified_at: 2099-01-01T00:00:00Z\n\n- eval: E3\n  verdict: UNCERTAIN\n  human_override: Bot\n`. Output is identical byte for byte. doi = all 0. L3 counts 1 before and 1 after. No run-log `chot-truong-nguoi` line is written. Result: an agent-written override satisfies the UNCERTAIN check, the 2099 timestamp survives, and nothing is reported. The code comment and the design doc («Đổi khuôn 23/09») both say the chốt treats a missing closing fence as frontmatter to end of file, and that human_override/verified_at are rewritten 'mọi dòng, mọi cột'. The same line also skips indented or dashed human_override in a properly closed frontmatter. Examples are `judgments:\n  - eval: E3\n    human_override: Bot` and `- human_override: Bot`. L3 counts both and the chốt leaves both untouched (verified: doi 0, L3 1→1). The column-0 restriction should apply only to human_signoff/bypass_ack. Differential table B covers only `fm-cot0` inside frontmatter and never an unclosed fence, so all 282 cells pass.

### 3. A block-scalar opener on a dash line (`- output: |`) makes the rest of the record count as scalar content, so verified_at/human_override there are not rewritten
- file: `feature-loop/workflows/acceptance-verify.js:132`
- severity: medium
- source: bugs
- AC: AC-1
- rationale: Repro cho thấy human_override có giá trị trong một bản ghi judgment vẫn còn nguyên sau khi chốt chạy — vi phạm Then của AC-1.

cotVh is set to the column of the first non-space character. When the opener line is `- output: |`, that character is the `-` (column 0), not the key (column 2). The record's sibling fields at column 2 (`  run_id:`, `  verified_at:`, `  human_override:`) satisfy c > cotVh and are marked voHuong, so line 147 (`if (voHuong[j]) return l`) returns them unchanged. Reproduced with napChot. Input: `- output: |\n    all green\n  eval: E4\n  run_id: run-goc-E4\n  verified_at: 2099-01-01T00:00:00Z\n  human_override: Bot\n`. Output is unchanged and doi = 0. L3 still counts the override (1→1), and the 2099 timestamp survives. Under YAML rules the scalar content must be indented deeper than the key column (cot+2), not the dash column. The D cells of the differential table only place the opener as a non-dash line (`  output: |`), so this shape is never exercised.

### 4. Hình dạng 5 — tuyên quét LỚP «L3 đếm human_override ở mọi nơi» nhưng trục vị trí của ma trận B lấy từ ngữ pháp của CHỐT chứ không phải của bên đọc, nên thiếu những ô chốt bỏ sót
- file: `tests/workflows/chot-truong-nguoi.test.mjs:465`
- severity: high
- source: measurement
- AC: AC-1
- rationale: Repro bằng hàm chốt thật cho thấy human_override có giá trị trong frontmatter không bị rỗng hoá — vi phạm Then của AC-1 dù nằm ở vị trí mà Coverage khai là 'toàn phần' cho Trục B.

Chú thích đầu khối vi phân nói bảng được «viết trước từ ngữ pháp bên đọc», trong đó «L3 đếm human_override ở mọi nơi». Biểu thức L3 rút từ lib/evidence-core.cjs:920 là `/human_override\s*[:=]\s*[^#\s]/gi`: nó KHÔNG neo đầu dòng và không bị giới hạn cột. Vậy mà `VT` chỉ có 6 vị trí, cả 6 đều có dạng `^\s*(-\s+)?khoá:` (fm-cot0, khoi-cot2/4, khoi-hai-cach, khoi-long, than-cot0), tức là đúng hình dạng mà RE_TRUONG của chốt đã nhận sẵn. Kiểm tra trực tiếp bằng napChot trên vật hiện tại cùng L3 thật: `---\nverdict: PASS\n  human_override: Bot\n---\n` (override thụt lề trong frontmatter) có L3 trước = 1, sau = 1, vì chốt dừng ở acceptance-verify.js:160 `if (trongFm && m[1] !== '') return l`. Dòng thân `  verdict: UNCERTAIN  human_override: Bot` cũng cho L3 1 → 1. Hai ô ấy không nằm trong bảng, nên CTN-AC1-vi-phan vẫn xanh (đã chạy: 96/96 PASS) trong khi bên đọc thật vẫn đếm một chữ ký override do tác tử bịa. Phép kiểm số ô `SO_O.AC1 = 84 + 12` (dòng 509) tự quy chiếu: nó đếm đúng danh sách gõ tay, không đếm ngữ pháp của bên đọc, nên dù mang dạng P105 nó không bắt được một trục bị thiếu. Đây chính là lớp «chốt hẹp hơn bên đọc» mà vòng đổi khuôn tuyên đóng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lời khai «nhận đúng ngữ pháp bên đọc» sai với L3: overrideCount không neo đầu dòng, bảng vi phân chỉ lấy mẫu hình dạng đầu dòng**
  Người dùng thấy gì: Nếu một tác tử tự chèn cụm 'human_override: Tên' ở giữa dòng, trong ngoặc chú thích hay trong bảng, chữ ký giả đó có thể không bị máy phát hiện, nên người ký vẫn cần tự soát các báo cáo dạng này.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **A human_override in the middle of a line is counted by L3 but never cleared by the chốt, and this limit is not declared**
  Người dùng thấy gì: Một dòng trong bảng hay đoạn văn của báo cáo có chứa cụm 'human_override: Tên Ai Đó' ở giữa dòng có thể lọt qua bước dọn tự động, nên người ký vẫn cần tự soát các báo cáo dạng này.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (thước viết cùng khuôn với vật): kiemIm chuyển sang dùng đúng RE_TRUONG của chốt nên chiều im trên corpus thật hết thấy việc chạm vào nội dung khối vô hướng**
  Người dùng thấy gì: Bài kiểm chất lượng dùng để phát hiện khi máy tự làm giả kết quả kiểm thử hiện không còn bắt được kiểu làm giả đó trên báo cáo thật, nên một lỗi loại này có nguy cơ lọt qua mà không ai cảnh báo.
  file: `tests/workflows/chot-truong-nguoi-corpus.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2: vế «sau» của trục AC-2 trong phép vi phân đọc verified_at bằng một regex do test tự viết, không đi qua bộ đọc thật nào**
  Người dùng thấy gì: Phần kiểm tra giờ xác minh trong bộ kiểm thử không đọc y hệt cách các trang mà người ký thật sự nhìn đọc giờ đó, nên có thể có chênh lệch nhỏ giữa điều bài kiểm tra đã xác nhận và điều người ký nhìn thấy trên Cổng Bằng chứng.
  file: `tests/workflows/chot-truong-nguoi.test.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).