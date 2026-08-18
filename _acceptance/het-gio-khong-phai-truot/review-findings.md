## Trong hợp đồng

### Mutant leg of rang.sh is a false green: it passes even when the mutation never happens
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:138`
- severity: high
- source: bugs
- AC: AC-7

The `python3 - "$TEST_FILE" "$MUT_FILE" <<'EOF_PY'` step has its exit code unchecked, and nothing asserts that `$MUT_FILE` exists or actually ran. The three "needle" greps (lines 164-169) all fire on an *absent* file, so the leg reports success for the wrong reason:

- `SO-CA lech` fires because `passed` falls back to 0 when no `Results:` line can be parsed;
- `TON-KHO: case cu bi sua/xoa: W01` fires because `grep -qF "check('$nm'" "$file"` exits 2 (file not found) — `! grep` is true for every base case name;
- `thieu dong PASS: W26 killedByTool -> BLOCKED` fires because the pin loop greps empty output.

Verified empirically: with a `python3` stub that exits 127 on PATH, the script prints seven `grep: tests/workflows/acceptance-verify.mut.mjs: No such file or directory` lines, then `PASS: TU-PHA-THU ban sao tiem 3 loi -> 294 loi, du 3 mui` and `RANG-HGKPT OK`, exit 0. The same holds for a partial mutation: if the `str.replace("import { runWorkflow, check, summary }", ...)` no-ops (import line reworded), `noop` is undefined, the mutant dies with a ReferenceError before printing anything, and all three needles still fire — the exact "mutant chết vì lý do khác" hazard the file's own comment warns about.

This is the repo's `assertion âm-tính-một-mình` class: the leg cannot distinguish "the measure has teeth" from "the mutant was never built". Minimal fix: check the python exit code and `[ -s "$MUT_FILE" ]`, and add a positive control on the mutant lane — require its output to still contain a parseable `Results: N passed` line with `N` strictly between 1 and the clean expectation, so a crashed/absent mutant is red instead of green.

Rationale (AC ánh xạ): AC-7 đích danh đòi "chiều đỏ chạy cùng lượt qua chính hàm kiểm: bản sao tiêm 3 mũi phải đỏ đủ 3 lý do" — finding chứng minh chân này xanh kể cả khi bản sao tiêm chưa từng chạy, tức đúng phần Then của AC-7 thất bại.

### Assertion âm-tính-một-mình: chân TU-PHA-THU xanh kể cả khi bản sao tiêm KHÔNG BAO GIỜ chạy
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:160`
- severity: high
- source: measurement
- AC: AC-7

Chân chứng-minh-phân-biệt của E8/AC-7 chỉ đòi (1) N_MUT != 0 và (2) ba chuỗi lý do có mặt trong MUT_OUT: 'SO-CA lech' (dòng 165), 'TON-KHO: case cu bi sua/xoa: W01' (167), 'thieu dong PASS: W26 killedByTool -> BLOCKED' (169). Cả ba đều là kết luận rút từ VẮNG MẶT, nên chúng cùng bật khi bản sao chết vì lý do khác — không có đối chứng dương nào bắt bản sao phải CHẠY ĐƯỢC trước khi tin nó đỏ. Cụ thể: nếu heredoc python3 không chạy (python3 vắng, pattern check\('W01 hay check\(` không còn khớp sau một lần đổi tên/refactor, ghi file lỗi), MUT_FILE không tồn tại → node exit 1 (a bật), không đọc được dòng Results → passed=0 (b bật 'SO-CA lech'), grep -qF trên file không tồn tại trả khác 0 → (c) in 'TON-KHO: case cu bi sua/xoa: <mọi tên base>', (d) in 'thieu dong PASS: <mọi pin>'.

Đã tự phá thử: chạy một bản sao rang.sh bỏ nguyên khối tiêm (mutant file không bao giờ được tạo) vẫn in 'PASS: TU-PHA-THU ban sao tiem 3 loi -> 294 loi, du 3 mui' và 'RANG-HGKPT OK', exit 0. Tức chiều đỏ mà hồ sơ tuyên là 'kết quả chạy, không phải lời hứa trong chú thích' (chú thích đầu file, dòng 14–19) hiện không phân biệt được 'phép đo bắt đúng 3 mũi' với 'bước tiêm chưa bao giờ chạy'. Dấu hiệu phụ cùng chỗ: lượt mutant thật cho 337 ca thay vì 342−2=340 như khuôn 3-mũi mô tả (mũi check(` rơi vào một callsite trong vòng lặp, tắt 3 ca), nên số ca lệch cũng không ghim được biên độ mong đợi.

Rationale (AC ánh xạ): cùng phần Then của AC-7 ('chiều đỏ ... bản sao tiêm 3 mũi phải đỏ đủ 3 lý do') — finding này chứng minh bằng thực nghiệm ba tín hiệu đỏ đều bật do VẮNG MẶT file mutant, không phân biệt được 'bắt đúng lỗi' với 'chưa từng tiêm', nên AC-7 thất bại.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **rang.sh neo vào mốc DI ĐỘNG `origin/main` — trái nếp đã viết thành chữ trong răng anh em, và đẳng thức số ca tự chết ngay khi hồ sơ này lên main**
  Người dùng thấy gì: Bài kiểm định lùi có thể tự báo lỗi giả sau khi tính năng này được gộp vào nhánh chính, hoặc khi có một nhánh làm việc khác đổi số lượng ca kiểm song song — gây chặn nhầm dù thay đổi thực chất vẫn đúng.
  file: `_acceptance/het-gio-khong-phai-truot/rang.sh:29`
  severity: high
  Đề xuất: known-limits

- **Bên VIẾT của `killedByTool` không có phép đo nào — mọi fixture là văn viết tay đúng khuôn bên ĐỌC, W25 đo CHỈ DẪN chứ không đo đầu ra**
  Người dùng thấy gì: Chưa có cách xác nhận rằng công cụ chấm điểm tự động thật sự nhận biết đúng khi bị hạ tầng ngắt giữa chừng — nếu khả năng đó về sau suy yếu, hệ thống có thể lại báo lỗi giả cho các thay đổi hợp lệ mà không ai phát hiện.
  file: `tests/workflows/acceptance-verify.test.mjs:1484`
  severity: medium
  Đề xuất: known-limits

- **rang.sh sinh file máy vào thư mục suite được track, tên cố định, chỉ dọn bằng trap EXIT**
  Người dùng thấy gì: Khi hai lượt kiểm tra chạy cùng lúc, chúng có thể ghi đè file tạm của nhau và gây ra kết quả lỗi ngẫu nhiên không liên quan tới chất lượng thực của thay đổi.
  file: `_acceptance/het-gio-khong-phai-truot/rang.sh:26`
  severity: low
  Đề xuất: known-limits

- **Failure detail for the real-tree pass is swallowed by command substitution**
  Người dùng thấy gì: Khi bài kiểm định phát hiện lỗi thật, thông báo không cho biết cụ thể ca nào hỏng, buộc người xem phải tự dò lại toàn bộ để tìm nguyên nhân.
  file: `_acceptance/het-gio-khong-phai-truot/rang.sh:129`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP 'mọi lane chạy lệnh dài' nhưng ma trận là danh sách 3 lane viết cứng**
  Người dùng thấy gì: Nếu sau này có thêm một luồng xử lý mới chạy lệnh dài mà quên gắn quy tắc an toàn, bài kiểm định hiện tại sẽ không tự phát hiện ra thiếu sót đó.
  file: `tests/workflows/acceptance-verify.test.mjs:1519`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).