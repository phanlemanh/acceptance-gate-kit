# Review Findings: ngon-ngu-mat-nguoi (round 1)

## Trong hợp đồng

### 1. Vùng quét "một nguồn" của P93 là allowlist thư mục — bản sao nguyên văn đặt trong design-loop/ vẫn XANH toàn suite
- file: `tests/plugins/run-tests.sh:2300`
- severity: high
- source: conventions
- AC: AC-10

P93 (phục vụ E8/E11 → AC-7/AC-10) quét bằng allowlist `SCAN = ["skills", "commands", "feature-loop", "codex", "lib", "scripts", "hooks", "docs"]`. AC-10 lại phát biểu "toàn bộ cây nguồn (trừ mirror `plugins/`, `_acceptance/`, `tests/`)", và CLAUDE.md liệt kê `design-loop/` (cùng `vendor/`) là nguồn sự thật ngang hàng với 8 thư mục kia. `design-loop/` không có trong allowlist và không có entry ledger nào thu hẹp nó (ledger chỉ ghi việc loại `docs/superpowers/**` — d-20260801T103556Z-25387).

Chân âm-tính đi kèm cũng không chạm biên allowlist: `c2 = count(extra=("gia-file-thu-hai.md", COL + DIAG + LAW))` (dòng 2330) chỉ nối MỘT TÊN GIẢ vào danh sách đã đếm — nó kiểm logic đếm, không hề ghi file thật ra ngoài vùng quét. Đúng lớp "allowlist biến fail-loud thành fail-silent" và "đột biến phải phá vật thật".

Đã kiểm bằng tay trong worktree (rồi hoàn nguyên, `git status` sạch): chép nguyên văn `skills/acceptance/references/human-facing-language.md` (đủ cả bảng luật N1–N6, `PLAN-SUMMARY-TABLE-TEMPLATE`, `DECISION-DIAGRAM-TEMPLATE`) thành `design-loop/skills/design-subtrack/COPY-TEST.md`, chạy `scripts/sync-plugin-packages.sh` (bước bắt buộc theo CLAUDE.md) rồi `bash tests/plugins/run-tests.sh` → "Results: all plugin tests passed", P93 PASS. Tức bản luật thứ ba + bản khuôn thứ hai sống được trong cây nguồn mà không phép đo nào đỏ — đúng chế độ hỏng AC-7/AC-10 sinh ra để chặn.

Rationale (map vào AC): AC-10 đòi quét toàn bộ cây nguồn trừ đúng 3 thư mục (plugins/, _acceptance/, tests/); P93 dùng allowlist hẹp hơn bỏ sót design-loop/, đã kiểm chứng bằng mutation thật (bản sao sống sót toàn suite).

### 2. P93's one-source scan is an allowlist narrower than the invariant it claims; design-loop/ and vendor/ are silently outside it
- file: `tests/plugins/run-tests.sh:2300`
- severity: high
- source: bugs
- AC: AC-10

AC-10 in _acceptance/ngon-ngu-mat-nguoi/contract.md states the invariant over "toàn bộ cây nguồn (trừ mirror plugins/, _acceptance/, tests/)" — a denylist. P93 implements it as an allowlist: SCAN = ["skills","commands","feature-loop","codex","lib","scripts","hooks","docs"] plus root *.md, minus docs/superpowers. Two first-party source trees are missing: design-loop/ (16 .md/.js files, a real place for human-facing plan summaries — design-subtrack renders them) and vendor/. VERIFIED by mutation: I appended a verbatim copy of both PLAN-SUMMARY-TABLE-TEMPLATE and DECISION-DIAGRAM-TEMPLATE to design-loop/skills/design-subtrack/SKILL.md and re-ran tests/plugins/run-tests.sh — "Results: all plugin tests passed". The template now lives in two places and the gate says nothing. The sanity counter cannot rescue this: `assert len(files) >= 40` (line 2306) is checked on the aggregate, and the 8 listed dirs yield 123 files, so a typo'd or deleted directory contributes 0 files silently and the assertion still passes — Path.rglob on a nonexistent directory returns an empty generator without raising. This is the exact failure shape memory note "Allowlist phải có RED ngoài danh sách" describes: the RED case must be planted OUTSIDE the list, and it currently is not. Fix: derive the scan from a denylist (iterate root, skip plugins/_acceptance/tests/.git/docs-superpowers), and add a per-directory existence assertion so a missing SCAN entry is RED rather than 0 files. Note E8/E11 in evals.yaml were written to match the implementation's narrower region, not AC-10 — the eval expectation drifted to the code, so the contract's own wording is not what got measured (and neither AC-10 nor E8/E11 mentions the docs/superpowers carve-out that the code applies).

Rationale (map vào AC): Finding trích đúng nguyên văn AC-10 ("toàn bộ cây nguồn trừ mirror plugins/, _acceptance/, tests/") và chỉ ra allowlist của P93 hẹp hơn, bỏ sót design-loop/ và vendor/ — cùng một chế độ hỏng AC-10 với finding allowlist ở trên.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **feature-loop 1.20.0 thêm phụ thuộc cứng vào acceptance-gate ≥1.28.0 ở S2 nhưng không khai ở preflight S0, và không có nhánh xử lý khi bộ giải thoát khác 0**
  Người dùng thấy gì: Nếu người dùng chưa cập nhật plugin lên bản mới nhất, vòng lặp tính năng có thể chạy qua được bước kiểm tra đầu tiên rồi mới dừng đột ngột giữa chừng với thông báo khó hiểu, thay vì được nhắc cập nhật ngay từ đầu.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: high
  Đề xuất: known-limits

- **P88 (chốt "release có chủ đích") không được cập nhật cho 1.28.0/1.20.0 — hoàn nguyên bản phát hành vẫn XANH**
  Người dùng thấy gì: Nếu một bản phát hành sau này lỡ quên mang theo bộ quy tắc ngôn ngữ mặt người mới, không có cảnh báo tự động nào bắt được — người dùng có thể nhận một bản cập nhật tưởng có tính năng mới nhưng thực ra không có.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **feature-loop preflight --require list not extended for the new hard dependency; the new resolver call site is the only one in either harness with no failure handling**
  Người dùng thấy gì: Người dùng dùng bản plugin cũ có thể không được cảnh báo sớm — feature-loop chạy dở dang rồi mới gặp lỗi khó hiểu ở giữa quy trình, thay vì dừng sớm kèm hướng dẫn cập nhật rõ ràng.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **acceptance-card fallback resolves with the wrong --require, so it can hand back a version that lacks the rules file**
  Người dùng thấy gì: Trong một số tình huống, thẻ quyết định có thể được dựng từ phiên bản phần mềm thiếu bộ quy tắc ngôn ngữ mặt người mới nhất, khiến nội dung trình cho người duyệt không được áp luật mới mà không có cảnh báo nào.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: known-limits

- **P95: two distinct conditions emit the identical message, so the anti-dead-pointer check has no independent negative control**
  Người dùng thấy gì: Đây là một khoảng hở trong chính bộ kiểm thử nội bộ: nếu sau này một trong hai cơ chế chống "trỏ vào chỗ hỏng" bị lỗi, hệ thống kiểm tra vẫn báo an toàn, nên một đường dẫn tham chiếu bị hỏng có thể lọt qua mà không ai biết.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).