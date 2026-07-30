# Review Findings: design-pass-skill — round 1

## Trong hợp đồng

- **P66 self-scan region silently truncates at its own literal — P67 and tail of P66 never scanned**
  AC: AC-9
  file: `tests/plugins/run-tests.sh:1413`
  severity: medium
  P66 (eval E9 / AC-9 engine-clean + one-work-plane) builds the scanned test region with `b = rt.find("# --- design-pass cases (P58-P67) begin ---")` and `e = rt.find("# --- design-pass cases end ---")`. The FIRST occurrence of the end string in the file is the find() call's own literal on line 1413 (inside P66's heredoc), not the real region-end comment on line 1444. Verified: e resolves to line 1413 while the real marker is line 1444, so the scanned region excludes the rest of P66 (the CONSUMER/SURFACE pattern definitions and check()) and ALL of P67 (lines 1433-1443). The `assert b != -1 and e != -1 and e > b` and the `len > 200` sanity both pass, so the truncation is invisible. This under-delivers AC-9/E9's own claim ("0 hit ... trên SKILL.md + test mới") and is exactly the CLAUDE.md invariant class 'thước phải gắn vào vật được giao' — a measurement that silently measures less than declared. The authors clearly intended full-region coverage (that is why CONSUMER/SURFACE strings are built via string concatenation like "one"+"hub" to avoid self-hits), but a consumer/surface string added to P67 or after line 1413 would never be caught. Fix direction: use rfind for the end marker, or anchor on "\n# --- design-pass cases end ---" at line start, and add a sanity assert that the region contains a known tail anchor (e.g. the P67 run line).
  source: conventions

- **P66 self-scan region truncated: end-marker find() matches its own source literal**
  AC: AC-9
  file: `tests/plugins/run-tests.sh:1413`
  severity: medium
  P66 computes the design-pass region with `b = rt.find("# --- design-pass cases (P58-P67) begin ---")` and `e = rt.find("# --- design-pass cases end ---")`. The end-marker string occurs FIRST as a literal inside P66's own source (line 1413), not at the real closing comment (line 1444). Verified: rt.find returns offset at line 1413 vs real marker at line 1444, and the scanned region excludes the CONSUMER/SURFACE pattern definitions, the rest of P66, and all of P67. The sanity guard `len(x) > 200` does not catch it, so the engine-clean scan (AC-9/E9 claims to cover "SKILL.md + test moi") silently covers only part of the test region — a consumer/surface string added in P67 or the tail of P66 would pass green. Fix: use rt.rfind for the end marker, or split the marker literals in P66's source (e.g. "# --- design-pass cases " + "end ---") the same way the CONSUMER patterns are already split to avoid self-match.
  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **SKILL.md sample config-patch command contradicts its own 'dry-run mặc định' claim**
  Người dùng thấy gì: Nếu bạn dán nguyên lệnh mẫu trong tài liệu skill để thêm cấu hình, thay đổi sẽ được ghi vào file cấu hình ngay lập tức — dù tài liệu nói lệnh này chỉ xem trước, chưa ghi gì.
  file: `skills/design-pass/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **SKILL.md says config-patch sample is 'dry-run mac dinh' but the printed sample includes --write**
  Người dùng thấy gì: Nếu bạn dán nguyên lệnh mẫu trong tài liệu skill để thêm cấu hình, thay đổi sẽ được ghi vào file cấu hình ngay lập tức — dù tài liệu nói lệnh này chỉ xem trước, chưa ghi gì.
  file: `skills/design-pass/SKILL.md`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).