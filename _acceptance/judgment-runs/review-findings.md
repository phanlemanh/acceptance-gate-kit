## Trong hợp đồng

- **inertFields bị rơi ở nhánh return sớm BLOCKED "không có gì để verify" (và ở dryRun) — cảnh báo mất im lặng**
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/distracted-pike-08aa6f/feature-loop/workflows/acceptance-verify.js:345`
  severity: low
  AC: AC-6
  source: bugs
  detail: `inertFields` được tính ở dòng ~289, nhưng dòng log ô-inert nằm ở dòng 352 — SAU cả hai nhánh return sớm: `if (args.dryRun) return {...}` (dòng 326) và `if (!distinctCmds.length && !freshJudgmentEvals.length && !uiEvals.length) return { verdict: 'BLOCKED', ... }` (dòng 345). Cả hai object trả về đều không có field `inertFields`, và dòng log cũng chưa chạy.

  Đường đi tới: mọi judgment eval đều có carriedPanel (freshJudgmentEvals rỗng, dòng 296) + suiteCommands rỗng + không eval máy/ui — nhưng judgmentEvals vẫn mang `runs: 3`. Khi đó `inertFields` có mục thật mà cả `/workflows` log lẫn `result` đều không nhắc, nên bước "Mọi verdict" của SKILL không có gì để trình. Tác động thấp vì verdict là BLOCKED (người đã bị chặn), nhưng nó phá đúng lời hứa "không mặt nào của máy im lặng" của feature. Sửa: chuyển hai dòng log lên trước các return sớm và thêm `inertFields` vào cả hai object trả về.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Bảng INERT_FIELD_TABLE khai `paths` trên judgment là inert, nhưng coverage-cluster VẪN đọc nó — làm theo lời khuyên trên thẻ Cổng 2 sẽ tắt câm một cờ đỏ**
  Người dùng thấy gì: Nếu làm theo gợi ý bỏ field "paths" khỏi loại đánh giá judgment trên thẻ quyết định, cảnh báo về cụm lỗi nằm ngoài vùng được kiểm tra có thể biến mất mà không ai nhận ra.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **gate-card.js tách section Variance theo VỊ TRÍ chuỗi — note inert nằm trước làm cờ đỏ phương-sai biến mất hoàn toàn**
  Người dùng thấy gì: Khi câu giải thích "giá trị bị bỏ qua" được đặt trước phần nói kết quả đo không ổn định trong báo cáo, thẻ quyết định có thể mất hẳn cảnh báo "kết quả không ổn định" mà người ký không hề biết.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **`paths` trên judgment KHÔNG inert — nó vẫn nuôi coverageRes, nên bảng inert nói sai với người ký**
  Người dùng thấy gì: Nếu làm theo gợi ý bỏ field "paths" khỏi loại đánh giá judgment trên thẻ quyết định, cảnh báo về cụm lỗi nằm ngoài vùng được kiểm tra có thể biến mất mà không ai nhận ra.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/distracted-pike-08aa6f/feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Bộ tách Variance ở thẻ Cổng 2 phụ thuộc THỨ TỰ do LLM viết — phương sai thật bị nuốt vào cờ vàng, mất hẳn cờ đỏ**
  Người dùng thấy gì: Khi câu giải thích "giá trị bị bỏ qua" được đặt trước phần nói kết quả đo không ổn định trong báo cáo, thẻ quyết định có thể mất hẳn cảnh báo "kết quả không ổn định" mà người ký không hề biết.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/distracted-pike-08aa6f/scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).