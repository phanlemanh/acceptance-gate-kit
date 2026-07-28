
# Review Findings: s4-scope-triage — round 6

## Trong hợp đồng

- **Partial triage keeps `inContract: true` on findings, so review-findings.md publishes a "## Trong hợp đồng" section for findings that were never fixed and never triggered REJECT**
  AC: AC-4
  file: `feature-loop/workflows/acceptance-verify.js:539`
  severity: medium
  When the triage agent returns entries for only some findings, line 539-542 flips `triageFailed = true` AFTER `triaged` has already been built at line 520-533. `rejectFindings` and `triageHighInContract` are then correctly forced to `[]` (lines 543-544), but the per-finding `inContract: true` flags set at line 525 are left intact.

  The synthesize prompt keys off those stale flags: `- "## Trong hợp đồng" — findings da map duoc vao AC ... Findings: ${JSON.stringify(triaged.filter(f => f.inContract))}` (line 699). So the emitted `review-findings.md` gets a "## Trong hợp đồng" heading listing findings with their `AC: <acRef>`, asserting they were classified as in-contract — while the run actually treated the whole round as fail-toward-human, fixed none of them, and did not REJECT. The same items also feed the `## Chưa phân loại` section only if they were the *dropped* ones, so the two sections disagree with each other about the same round.

  Downstream this matters because `scripts/gate-card.js` renders only the `## Ngoài hợp đồng` section — nothing on the card lists the "## Trong hợp đồng" items, and `rejectFindings` (what S3 fixes per SKILL.md step 3) is empty. The only signal the approver gets is the generic amber "Phân loại phạm vi chưa đầy đủ" flag.

  Fix: when the partial-coverage branch fires, rebuild `triaged` with `inContract: false, acRef: null, unclassified: true` for every entry (i.e. degrade uniformly, the same way the agent-dead / contract-unreadable branches already do), so the artifact matches what the machine actually did.

  Failure scenario: 5 confirmed findings go to triage; the agent returns 4 entries (one title copied with a trailing space, so `triageKey` misses). Line 539 sets `triageFailed = true`, `rejectFindings = []`, verdict stays PASS. `review-findings.md` is written with a `## Trong hợp đồng` section listing 2 findings mapped to `AC-2`/`AC-3` — findings the machine never fixed and that no verdict reflects — plus a `## Chưa phân loại` section holding the 5th. A reader (or the next round's S3 fix step, which consumes the empty `rejectFindings`) concludes the in-contract findings were handled.

  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Seam LLM-viết→máy-đọc chỉ được round-trip cho MỘT trong ba marker — cờ cụm và heading không có ràng buộc nào**
  Người dùng thấy gì: Cảnh báo "có việc ngoài phạm vi cần người quyết" trên thẻ duyệt có thể biến mất mà không ai nhận ra, nếu cách máy viết văn bản đó xê dịch một chút so với trước — người duyệt tưởng không có gì cần quyết trong khi thực ra có.
  file: `lib/out-of-contract.js`
  severity: medium
  Đề xuất: new-contract

- **SKILL feature-loop vẫn chỉ dẫn đọc `reportPath` / `findingsPath` — hai field workflow đã bỏ**
  Người dùng thấy gì: Hướng dẫn cho bước duyệt Cổng 2 trỏ người thực hiện tới hai nguồn dữ liệu đã không còn tồn tại, có thể khiến người vận hành tìm nhầm chỗ lấy báo cáo bằng chứng và danh sách review khi làm theo tài liệu.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Bảng vai-trò model trôi khỏi MODEL_ROUTES: `scribe` đã xoá vẫn được quảng cáo, `triage` mới thêm không được khai ở đâu**
  Người dùng thấy gì: Tài liệu hướng dẫn cấu hình mô hình cho các bước tự động liệt kê một vai trò đã bị bỏ và bỏ sót vai trò phân loại phạm vi mới, khiến đội vận hành dễ cấu hình sai hoặc bỏ lỡ cơ hội tinh chỉnh chi phí/chất lượng cho bước mới này.
  file: `commands/acceptance-init.md`
  severity: medium
  Đề xuất: known-limits

- **Out-of-contract block vanishes silently when the writer's item shape drifts (present=true, findings=0 → no block, no flag)**
  Người dùng thấy gì: Nếu bước viết kết quả tạo văn bản hơi lệch khuôn khi ghi một phát hiện là "ngoài phạm vi đã duyệt", thẻ quyết định Cổng 2 có thể không hiển thị bất kỳ cảnh báo nào về phát hiện đó — người duyệt sẽ không biết có việc thật nhưng ngoài phạm vi đang chờ họ quyết định, và có thể duyệt nhầm.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **New `triage` model role missing from the SKILL's `feature_loop.models` role enumeration**
  Người dùng thấy gì: Tài liệu cấu hình mô hình cho các bước tự động không liệt kê vai trò "phân loại phạm vi" mới được thêm, nên đội vận hành muốn đổi mô hình cho bước này (để tiết kiệm chi phí hay tăng chất lượng) sẽ không biết có tùy chọn đó.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **SKILL Gate 2 packaging step still reads removed result keys `reportPath` / `findingsPath`**
  Người dùng thấy gì: Bước đóng gói kết quả để trình lên Cổng 2 trong tài liệu hướng dẫn vẫn chỉ tới hai nguồn dữ liệu đã bị bỏ, khiến người làm theo hướng dẫn dễ lấy nhầm hoặc không lấy được báo cáo bằng chứng và danh sách review cần duyệt.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **GUIDE.md still documents the removed `scribe` agent and the removed `reportPath` return value**
  Người dùng thấy gì: Tài liệu hướng dẫn tổng thể đi kèm gói cài đặt vẫn mô tả một bước xử lý và một phần dữ liệu đã bị bỏ khỏi tính năng này ở nhiều chỗ, có thể khiến người đọc tài liệu hiểu sai quy trình đang thực sự chạy.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 5/8 lỗi rơi vào file không bộ đo nào phủ (feature-loop/skills/feature-loop/SKILL.md, commands/acceptance-init.md, GUIDE.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
