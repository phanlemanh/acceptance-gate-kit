## Trong hợp đồng

- **Gate emits contradictory approvers guidance in one run: "declared but resolves to no approver name" plus "approvers is not declared"**
  file: `scripts/pre-merge-check.sh:957`
  severity: medium
  AC: AC-4
  detail: `ADVISE_APPROVERS` is set only inside the `elif placeholder_signoff` branch (line 740) and the final NOTE (lines 957-958) is not gated on `APPROVERS_DECLARED`. When approvers is declared-but-empty AND a slug carries a placeholder signature, both fire.

  Verified live with `approvers: []` + `human_signoff: PENDING`:
  ```
  VIOLATION [config]: signoff.approvers is declared but resolves to no approver name …
  NOTE: signature checking fell back to the placeholder net because signoff.approvers is not declared … Consider declaring signoff.approvers: ["<name>"] …
  ```
  The NOTE tells the operator to do the thing they already did, and asserts a fact the line above contradicts. Per the repo's own standard (AC-13: "Tài liệu nói sai (hoặc câm) về mức cưỡng chế là lỗi cùng hạng với cổng thủng") the gate stating a false fact about its own configuration is not a cosmetic issue.

  The suite cannot see it because the Coverage cell (axis C = "khai mà rỗng") × (axis B = "chữ ký giữ-chỗ") is never built: UJ4 uses a real signature, UJ5 uses an undeclared config. Guard should be `[ -n "$ADVISE_APPROVERS" ] && [ "$APPROVERS_DECLARED" != true ]`, or the NOTE text must branch.
  rationale: AC-4 explicitly requires that when approvers is declared but resolves to 0 names, the run must NOT silently fall through to the "not declared" branch ("KHÔNG được âm thầm tụt xuống nhánh không khai") — the reported NOTE claiming approvers is undeclared while a VIOLATION [config] line says it IS declared-but-empty is exactly that forbidden fall-through.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **acceptance-init scaffold emits an angle-bracket placeholder into the now-enforced approvers allowlist, hard-blocking every genuine signature**
  Người dùng thấy gì: Nếu bạn tạo hồ sơ acceptance mới bằng lệnh khởi tạo, file cấu hình mẫu có sẵn một tên giữ chỗ trong danh sách người duyệt; nếu quên thay tên đó, mọi chữ ký thật hợp lệ sau này đều bị cổng từ chối merge, và thông báo lỗi lại đổ lỗi cho chữ ký thay vì cho file cấu hình mẫu.
  file: `codex/acceptance-gate/skills/acceptance-init/SKILL.md`
  severity: high
  Đề xuất: new-contract

- **GUIDE.md config reference and troubleshooting table not updated for the newly enforced signoff.approvers**
  Người dùng thấy gì: Tài liệu hướng dẫn đầy đủ (GUIDE.md) chưa được cập nhật để nói về cách khai người duyệt và các thông báo lỗi mới, nên người chỉ đọc tài liệu này có thể không biết cách bật kiểm tra chặt hoặc không hiểu các lỗi mới gặp phải.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: new-contract

- **signoff.approvers block-list parse slurps following list items — fail-open on the new signature rule**
  Người dùng thấy gì: Nếu file cấu hình khai danh sách người duyệt theo kiểu gạch đầu dòng và có một dòng chú thích ngay sau đó (đúng như mẫu file cấu hình được cấp sẵn), cổng có thể vô tình coi những người hoặc email không được duyệt — kể cả người nằm trong danh sách cấm — là hợp lệ, khiến một bản chưa được ai duyệt thật sự vẫn lọt qua mà không có cảnh báo nào.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **Unquoted $APPROVERS in the for-loop is subject to pathname expansion**
  Người dùng thấy gì: Trong một trường hợp hiếm, nếu tên người duyệt chứa ký tự đặc biệt như dấu sao (*), cổng có thể âm thầm đổi tên đó thành tên tệp tình cờ trùng khớp trong thư mục đang chạy, khiến danh sách người duyệt thực tế không còn đúng như đã khai báo.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).