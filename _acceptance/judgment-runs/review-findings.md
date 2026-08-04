## Trong hợp đồng

- **Inert warning cannot be turned off when the same round is re-run (filter keys on round, not batch)**
  file: `scripts/gate-card.js:398`
  severity: medium
  AC: AC-14
  detail: `const inertLine = lines.filter(e => e.kind === 'inert' && e.round === maxRound).pop()` discriminates only by round number, but run-log.jsonl is append-only AND the S4 skill documents re-running the SAME round after BLOCKED ("BLOCKED → khắc phục nguyên nhân, chạy lại CÙNG round"), with `result.runLog` appended on every verdict. Reproduced: a round-4 batch containing a kind:"inert" line, followed by a second round-4 batch written after the human removed `runs` from evals.yaml (no inert line), still renders the yellow flag — `.pop()` picks the stale inert line because it is the last inert entry whose round === maxRound. This is precisely the "cảnh báo không bao giờ tắt được" failure AC-14(b) was written to prevent, only at same-round instead of cross-round granularity, so the round-filter mutation in mutation-check.mjs does not catch it. Fix: pick the newest BATCH (latest `ts` among round === maxRound, or the index of the last line with round === maxRound) and accept an inert line only if it belongs to that batch. Applies identically to the mirror at plugins/acceptance-gate/scripts/gate-card.js:398.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Cảnh báo ô-inert biến mất im lặng khi args.round không phải number — không có validation ở biên LLM→script**
  Người dùng thấy gì: Nếu bước ghi nhật ký nội bộ vô tình bỏ trống hoặc ghi sai kiểu số vòng chạy, cờ cảnh báo 'field khai nhưng máy không dùng' có thể biến mất khỏi thẻ quyết định mà không ai được báo.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **scripts/evidence-page.js là bên đọc cùng hình dạng chưa được quét — vẫn dán nhãn đỏ 'eval ngẫu nhiên' và không mang kênh inert nào**
  Người dùng thấy gì: Trang bằng chứng đầy đủ (được dẫn link nổi bật từ thẻ quyết định) vẫn có thể dán nhãn sai cảnh báo 'field khai mà máy không dùng' thành lỗi ngẫu nhiên, và hoàn toàn không hiện cảnh báo này ở nơi khác trên trang đó.
  file: `scripts/evidence-page.js`
  severity: medium
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Biến inertNoteShown gán rồi không ai đọc — đọc như thể nhánh phương-sai có tham chiếu nó**
  Người dùng thấy gì: Có một đoạn mã nội bộ không còn tác dụng nằm lẫn trong logic cảnh báo, dễ khiến người sửa code sau này hiểu nhầm và sửa nhầm chỗ — không ảnh hưởng trực tiếp tới người dùng hiện tại nhưng tăng rủi ro cho lần sửa kế tiếp.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **INERT_DECLARED.paths là nhánh chết — không hàng nào trong bảng dùng field paths**
  Người dùng thấy gì: Có một đoạn kiểm tra cho field 'paths' không bao giờ được máy gọi tới trong thực tế, có thể khiến người đọc code sau này lầm tưởng field này đang được xử lý trong khi không phải vậy.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **mutation_check không nằm trong feature_loop.suite_keys — chốt bằng-chứng-phân-biệt sẽ ngủ sau khi workspace này ký**
  Người dùng thấy gì: Bài kiểm tra đột biến chuyên biệt cho các file cảnh báo này chỉ chạy trong workspace hiện tại; sau khi ký xong, các thay đổi sau này vào cùng những file đó sẽ không còn tự động được bài kiểm tra này canh giữ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Sole channel for the inert warning fails silent on unreadable/malformed run-log**
  Người dùng thấy gì: Nếu tệp sổ ghi log nội bộ bị hỏng hoặc bị cắt giữa dòng, cảnh báo 'field khai mà máy không dùng' có thể lặng lẽ biến mất khỏi thẻ quyết định mà không có dấu hiệu nào cho biết log bị lỗi.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).