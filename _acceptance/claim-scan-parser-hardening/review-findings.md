# Review Findings: claim-scan-parser-hardening (round 1)

## Trong hợp đồng

### verdict: findings with an empty/dataless Findings section yields zero claims with zero warn — silent path not among the two named intentional silences
- file:line: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs:63`
- severity: low
- AC: AC-7
- source: conventions

Detail: The '(malformed table)' warn at line 62 fires only when the `## Findings` heading is absent. When the heading exists but the captured section has no `|` rows (or fewer than 3), `rows.slice(2)` is empty, `badRows` stays 0, and the file yields zero claims silently despite frontmatter promising `verdict: findings`. The new bounded capture `(?=\n## |$)` enlarges this path: a table accidentally placed after the next `## ` heading previously produced (wrong) claims, now produces silent zero. Design/AC-7 enumerate exactly two intentional silences (verdict ≠ findings; same-slug dedupe); this third silent outcome under a findings verdict is neither warned nor named. Suggest a warn when verdict is findings but the section produces 0 rows, or naming it in the design as intentional.

Rationale (map vào AC): Đây là một nhánh drop dữ liệu thứ ba không có warn và không nằm trong đúng hai loại bỏ-qua-chủ-đích mà design/AC-7 liệt kê — khớp trực tiếp câu chữ "không còn nhánh drop nào ngoài hai loại đó" của AC-7.

### Ghost claims still produced when tail section uses non-h2 heading
- file:line: `feature-loop/scripts/claim-scan.mjs:61`
- severity: high
- AC: AC-1
- source: bugs

Detail: The E1 fix changed the Findings capture to `/## Findings([\s\S]*?)(?=\n## |$)/`, which only stops at an h2 heading ('\n## '). Contract AC-1 (`_acceptance/claim-scan-parser-hardening/contract.md`) explicitly promises zero ghost claims for a trailing section with "bất kỳ heading nào", but a section headed '### Notes' or '# Appendix' after `## Findings` is still swallowed into the capture. Verified repro: a gap-probe.md with '### Notes' containing a 6-column table emits ghost claim `h3tail#F4` ("ghost-gap — ghost-fail", sev P0, citable id) AND two garbage claims from the tail table's header and separator rows ("Thiếu gì — Kịch bản fail" and "--- — ---"), all silently with exit 0 and no warn. This is the same HIGH-severity poisoned-advisory-channel bug (claim ma có id citable) the feature was opened to fix, still reachable one heading level away; the ghost P0 sorts to the top of the advisory list. Test PH1 only covers a '## Notes' tail, so the suite stays green. Fix: stop the lookahead at any heading, e.g. `(?=\n#{1,6} |$)`.

Rationale (map vào AC): AC-1 hứa zero claim từ section sau Findings với "bất kỳ heading nào", nhưng finding chứng minh heading không phải h2 (### Notes) vẫn lọt qua và sinh ghost claim — thất bại trực tiếp câu chữ AC-1.

### Invalid/typo'd verdict value is silently dropped, not warned
- file:line: `feature-loop/scripts/claim-scan.mjs:57`
- severity: medium
- AC: AC-7
- source: bugs

Detail: `probeClaims` treats any `meta.verdict !== 'findings'` as the intentional silent skip. The design doc and the code's own invariant comment (lines 93-95: "verdict hợp lệ ≠ findings") scope the silent path to VALID non-findings verdicts, and the verdict enum written by the SKILL is `clean|findings|probe-failed` (`feature-loop/skills/feature-loop/SKILL.md:89`). But a typo'd value ('verdict: findigns') or empty value ('verdict:' → `meta.verdict === ''`) passes the PH4 'verdict' in meta check and then falls into the silent-skip branch: verified repro shows a gap-probe with verdict 'findigns' and a real P0 finding produces zero claims, zero stderr, exit 0. That is a residual member of exactly the silent-drop class this feature claims to have closed (AC-7: every drop path must either warn or be a named intentional skip). Fix: validate `meta.verdict` against the enum and route unknown values to the 'unreadable frontmatter' (or a dedicated 'unknown verdict') warn path.

Rationale (map vào AC): Một finding thật bị rơi rụng im lặng vì giá trị verdict gõ sai không khớp enum — đây là nhánh drop dữ liệu thứ ba nằm ngoài hai loại bỏ-qua-chủ-đích được đặt tên, khớp trực tiếp câu chữ AC-7.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hollow gap-probe row still emits empty claim — PH5 class member left open on the probe side**
  Người dùng thấy gì: Một hàng dữ liệu trống trong file gap-probe vẫn bị biến thành một mục khuyến nghị (claim) rỗng có thể trích dẫn, làm nhiễu danh sách bằng nội dung trống thay vì bị loại bỏ.
  file: `/Users/manhphan/dev/acceptance-gate-kit/feature-loop/scripts/claim-scan.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
