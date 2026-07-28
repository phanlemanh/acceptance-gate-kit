## Trong hợp đồng

### signoff.approvers block-list parser still slurps unrelated list items — fail-open allowlist and suppressed AC-4 config violation
- file: `scripts/pre-merge-check.sh:293`
- severity: medium
- source: bugs
- AC: AC-4

The block-list branch ends its sed range at `/^  [a-zA-Z0-9_-]*:/` — a key at *exactly* two-space indent. Commit 1da6cf6 fixed the indent-2-sibling-with-comment case (UJ1x), but the range still runs to EOF whenever the next key is at indent 0 (or any indent != 2), swallowing every `- item` line encountered before the first indent-2 key.

Repro 1 (fail-open): config with `signoff:` → `approvers:` block list `- "Alice"`, followed by top-level `agent_authors:` / `  - "ci-bot@corp.com"`. Evidence `human_signoff: ci-bot@corp.com 2026-07-28` →
`OK [feat-a]: PASS, signed off by ci-bot@corp.com 2026-07-28` / `pre-merge-check: clean`, exit 0. The blocked bot identity became an approver.

Repro 2 (AC-4 suppressed): `approvers:` with zero items, followed by top-level `baseline_minutes:` / `  - 90`. APPROVERS resolves to `90`, so the new `VIOLATION [config]: signoff.approvers is declared but resolves to no approver name` never fires; instead an unrelated per-slug violation is emitted. Verified: grepping the whole run shows no `VIOLATION [config]` line at all.

A robust fix is to bound the range by indentation relative to the `approvers:` line (only lines more-indented than the key are list items), not by a fixed two-space sibling pattern. Same defect shape exists in the mirrored copy plugins/acceptance-gate/scripts/pre-merge-check.sh.

rationale: Repro 2 dựng đúng fixture AC-4 (approvers khai nhưng tách ra 0 tên) và cho thấy dòng VIOLATION [config] bắt buộc theo AC-4 không xuất hiện vì bộ tách bị trôi sang khoá kế tiếp — đúng hành vi mà AC-4 cấm ("KHÔNG được âm thầm tụt xuống nhánh không khai").

### Mutation harness uj_mut() passes when the mutation filter fails and produces an empty script
- file: `tests/scripts/run-tests.sh:3141`
- severity: medium
- source: bugs
- AC: AC-14

`uj_mut <label> <filter> <fixture>` does `eval "$2" > "$UJMUT"`, guards only with `diff -q "$CHECK" "$UJMUT"` ("mutant must differ from the original"), then asserts the mutant exits **0** on the fixture.

A filter that errors out — awk/sed syntax error, a renamed variable, a source refactor that breaks the script pipeline — leaves `$UJMUT` empty or truncated because the `>` redirect truncates regardless of the command's exit status. An empty file trivially differs from the original (guard passes) and `bash <empty file>` exits 0 (verified: exit=0), which is exactly the asserted value. So all six UJ14 mutation cases turn green while measuring nothing.

This is the CLAUDE.md "assertion âm-tính-một-mình" shape aimed at the very harness built to prevent it: the only signal distinguishing "mutation correctly disabled the rule" from "mutation never ran" is an exit code that a broken filter also produces. Guard should additionally require the mutant to be non-empty and to still be a runnable gate — e.g. assert `bash -n "$UJMUT"` passes and that the mutant is still RED on an unrelated fixture that the mutated branch does not cover.

rationale: AC-14 yêu cầu phép tiêm đột biến phải phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy"; harness uj_mut() mô tả trong finding chính là cơ chế đo cho AC-14 và bị chứng minh cho kết quả xanh giả khi mutant hỏng, nên đây là chính AC-14 thất bại chứ không phải một tiêu chí khác.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **GUIDE.md không cập nhật cho `signoff.approvers` đã được cưỡng chế + 3 lớp VIOLATION mới**
  Người dùng thấy gì: Tài liệu hướng dẫn cấu hình đầy đủ của gói vẫn im lặng về việc danh sách người duyệt giờ bắt buộc và về ba loại cảnh báo mới, nên người vận hành đọc đúng theo tài liệu này có thể cấu hình thiếu mà không biết mình đang bỏ sót bước quan trọng.
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/GUIDE.md:537`
  severity: medium
  Đề xuất: known-limits

- **Bump 1.24.0 không kèm câu "v1.24 …" trong description của 3 manifest — phá nếp release đang có**
  Người dùng thấy gì: Ghi chú phát hành đi kèm bản cập nhật mới không nhắc gì tới thay đổi quan trọng về xác nhận người duyệt, nên người chuẩn bị nâng cấp sẽ không biết cần xem lại cấu hình của mình trước khi lên bản mới.
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/.claude-plugin/plugin.json:4`
  severity: medium
  Đề xuất: known-limits

- **Không có ADR cho quyết định fail-closed "khai approvers mà rỗng = VIOLATION"**
  Người dùng thấy gì: Lý do đổi cách xử lý một mục cấu hình quan trọng chỉ nằm rải rác trong mã nguồn thay vì ở nơi người vận hành thường tra cứu quyết định, nên người sau muốn hiểu vì sao hành vi thay đổi sẽ khó tìm được câu trả lời đầy đủ.
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/scripts/pre-merge-check.sh:300`
  severity: low
  Đề xuất: known-limits

- **acceptance-init scaffolds an angle-bracket placeholder into the now-enforced approvers allowlist — blocks every genuine signature**
  Người dùng thấy gì: Làm đúng theo hướng dẫn khởi tạo mặc định sẽ để sót một giá trị mẫu chưa điền trong danh sách người duyệt; hậu quả là mọi chữ ký thật sau này đều bị từ chối, và thông báo lỗi lại đổ lỗi cho chữ ký chứ không chỉ ra chỗ cấu hình cần sửa, khiến người dùng có thể loay hoay không hiểu vì sao được duyệt vẫn không qua cổng.
  file: `commands/acceptance-init.md:64`
  severity: high
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 2/6 lỗi rơi vào file không bộ đo nào phủ (GUIDE.md, .claude-plugin/plugin.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
