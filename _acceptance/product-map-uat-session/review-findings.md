## Trong hợp đồng

### ALLOW_EMPTY is unreachable in practice — an empty nav field swallows the NEXT frontmatter line, so an unsigned UAT session is reported as "hồ sơ hỏng"

- file: `lib/workspace-record.js:48`
- severity: high
- AC: AC-10
- source: bugs

`fieldProblem` treats `raw === ''` as the legal "chưa ký" state for `verdict`/`decision`. But `frontmatterField` (lib/evidence-core.js:83) builds the regex `^<key>\s*[:=]\s*(.*)$` — `\s` matches newline, so for an empty value the `\s*` after `[:=]` eats the line break and `(.*)` captures the FOLLOWING frontmatter line. It therefore returns `''` only when the empty key happens to be the last line of the frontmatter (or is followed by an inline `#` comment, which `.replace(/^#.*$/,'')` blanks).

Reproduced on the real scripts. Workspace: contract `status: signed-off`, opportunity `decision: build`, and a `uat-session.md` written exactly as skills/uat-session/SKILL.md §1 instructs ("`verdict` để TRỐNG") but without the template's inline `#` comment:

```
verdict:
decided_by:
```

`node scripts/start-scan.mjs` → `broken: [{slug:"foo", file:"uat-session.md", reason:"verdict không nhận diện được: decided_by:"}]`, and `renderProductMap` puts it under `## Hồ sơ hỏng`. The slug disappears from the `gia-tri` gate entirely — the pending human gate becomes invisible on /start, and the map calls a healthy record corrupt. Same for `decision:` in opportunity.md.

Why every test is still green: all fixtures come from `fileFromTemplate(...)` on the canonical templates, and `uat-session-template.md:15` happens to carry `# release | iterate | kill …` right after `{verdict}`. P108's `uat("b-cho-co-uat", "")` and P110's "uat verdict rong (chua ky)" case pass only because that comment absorbs the swallow. Nothing in the templates or SKILL requires the human to keep those `#` comments (contract-template.md even tells the copier to strip marker comments).

Same root cause hits `since()`: `node -e` on `approved_at:` (empty) followed by `time_human_minutes: {gate1: 0, gate2: 0}` returns the literal string `"time_human_minutes: {gate1: 0, gate2: 0}"`, so start-scan.mjs:101 uses that as the gate's `since` instead of falling back to mtime, garbling gate ordering. Line 92's `fmOrNull(uTxt, 'decided_at')` has the identical exposure.

Fix belongs in `frontmatterField` (`[ \t]*` instead of `\s*` after the separator), plus a round-trip case that builds an empty-value fixture WITHOUT an inline comment. Mirror copy: plugins/acceptance-gate/lib/workspace-record.js.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **product-map.mjs không có chốt tham số lạ — lỗi gõ biến lệnh KIỂM thành lệnh GHI rồi báo thành công (fail-open đúng lớp đã có invariant)**
  Người dùng thấy gì: Nếu người dùng gõ sai tên tuỳ chọn dòng lệnh (ví dụ gõ nhầm cờ kiểm tra), công cụ có thể âm thầm GHI ĐÈ lại file bản đồ sản phẩm thay vì chỉ kiểm tra, và vẫn báo thành công — không có cảnh báo nào cho biết lệnh đã bị hiểu sai.
  file: `scripts/product-map.mjs:162`
  severity: high
  Đề xuất: known-limits

- **Điểm làm mới bản đồ thiếu ở CẢ HAI bản feature-loop — đường đóng cổng chính của kit để PRODUCT-MAP.md trôi rồi CI đỏ**
  Người dùng thấy gì: Khi một tính năng được duyệt hoặc ký thông qua lệnh /feature-loop (đường dùng hằng ngày của kit) thay vì các lệnh /approve, /signoff riêng lẻ, bản đồ sản phẩm sẽ KHÔNG được cập nhật lại theo trạng thái mới nhất — có thể khiến CI báo lỗi oan ở một PR sau đó mà không có hướng dẫn nào để sửa.
  file: `feature-loop/skills/feature-loop/SKILL.md:97`
  severity: high
  Đề xuất: new-contract

- **Codex start route sang uat-session, nhưng bản Codex của skill đó là bản Claude nguyên xi: ${CLAUDE_PLUGIN_ROOT} không tồn tại và không có agents/openai.yaml**
  Người dùng thấy gì: Khi chạy phiên nghiệm thu bằng Codex (thay vì Claude Code), bước cập nhật lại bản đồ sản phẩm sau khi ký có thể chạy sai đường dẫn và thiếu cấu hình dành riêng cho Codex, nên bước làm mới bản đồ ở phiên bản Codex có thể không chạy đúng như mong đợi.
  file: `codex/acceptance-gate/skills/start/SKILL.md:67`
  severity: medium
  Đề xuất: known-limits

- **Khuôn uat-session không dặn bỏ marker + fence ```yaml khi chép — chép nguyên văn là hồ sơ hỏng ở CẢ HAI reader**
  Người dùng thấy gì: Nếu người dùng chép nguyên cả khuôn mẫu phiên nghiệm thu — kể cả dòng đánh dấu và khung mã — thay vì chỉ phần nội dung bên trong, hồ sơ tạo ra sẽ bị hệ thống coi là hỏng, và màn hình quyết định (Cổng Giá trị) sẽ không hiện ra cho tới khi người dùng tự phát hiện và sửa lại thủ công.
  file: `skills/acceptance/references/uat-session-template.md:5`
  severity: low
  Đề xuất: known-limits

- **classify() đọc `stage` thẳng bằng frontmatterField thay vì qua navValues — đi vòng qua chính luật-một-chỗ vừa dựng**
  Người dùng thấy gì: Hiện tại không có ảnh hưởng nào tới người dùng; đây là một chỗ trong mã nguồn có nguy cơ lệch kết quả trong tương lai nếu có người sửa cách đọc trạng thái ở một chỗ mà quên sửa ở chỗ còn lại.
  file: `scripts/product-map.mjs:96`
  severity: low
  Đề xuất: known-limits

- **The two readers still disagree about "hồ sơ hỏng" — evidence-report.md problems are scanner-only, and P110 asserts the invariant without testing them**
  Người dùng thấy gì: Có một số trường hợp hồ sơ nghiệm thu máy bị hỏng hoặc thiếu mà bản đồ sản phẩm và màn hình /start có thể kết luận khác nhau về việc hồ sơ đó có hỏng hay không — cùng một hồ sơ nhưng hai nơi hiển thị hai kết quả trái ngược.
  file: `scripts/product-map.mjs:78`
  severity: medium
  Đề xuất: known-limits

- **start-scan silently drops a workspace that has uat-session.md but no contract.md/opportunity.md — not in any group, not in broken[]**
  Người dùng thấy gì: Một hồ sơ xưởng chỉ có phiên nghiệm thu mà chưa từng có hợp đồng hay cơ hội đi kèm có thể biến mất hoàn toàn khỏi cả bản đồ sản phẩm lẫn màn hình /start — không hiển thị ở đâu và cũng không được báo là hồ sơ hỏng.
  file: `scripts/start-scan.mjs:109`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).