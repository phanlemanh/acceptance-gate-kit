# Review Findings: judgment-runs (round 6)

## Trong hợp đồng

- **Lọc-theo-vòng không tắt được cảnh báo khi CHẠY LẠI CÙNG round — đúng lỗ mà comment tuyên bố đã bịt**
  file: `scripts/gate-card.js:398`
  severity: high
  AC: AC-14
  source: conventions
  detail: `lines.filter(e => e.kind === 'inert' && e.round === maxRound).pop()` mã hoá "vòng này sạch" bằng SỰ VẮNG MẶT của dòng inert trong vòng mới nhất. Nhưng sổ chạy là append-only và SKILL.md feature-loop chỉ thị chạy lại CÙNG round ở ít nhất hai chỗ (BLOCKED → "chạy lại CÙNG round"; PASS mà `result.report` rỗng → "chạy lại S4 cùng round"). Sau lần chạy lại, dòng inert CŨ của cùng round đó vẫn nằm trong sổ, `maxRound` không đổi, nên `.pop()` vẫn nhặt đúng nó.

    Đã tái hiện trên cây đang kiểm: sổ chạy chỉ gồm 2 dòng — `{round:3,kind:"inert",note:…}` rồi `{round:3,kind:"baseline"}` (lần chạy lại đã sạch, không sinh dòng inert) — `node scripts/gate-card.js --slug rt` VẪN in cờ vàng "Field khai mà máy không dùng". Người sửa `evals.yaml` đúng như cảnh báo bảo, chạy lại round, và cảnh báo không bao giờ tắt cho tới khi số round tăng.

    Cùng round lặp lại là chuyện có thật trong repo này, không phải giả định: `_acceptance/start-command/run-log.jsonl` có 3 dòng `kind:"baseline"` trên 2 round riêng biệt (round 1 xuất hiện hai lần); `_acceptance/gap-probe-presence-hook/run-log.jsonl` có round 1,2,3 rồi lại 1,2,3.

    Case WI6 `[vòng sau đã sạch]` (tests/workflows/acceptance-verify.test.mjs:977) chỉ dựng dòng sạch ở round 2 — tức chỉ phủ nhánh round TĂNG, không phủ nhánh round LẶP. Đột biến "bỏ LOC THEO VONG" trong mutation-check.mjs cũng chỉ đo được nhánh đã phủ đó.

    Sửa cần một tín hiệu "vòng này đã sạch" tường minh (vd dòng `kind:"inert"` với `fields: []`, hoặc so vị trí dòng inert với dòng `kind:"baseline"` cuối cùng của cùng round) thay vì suy từ sự vắng mặt. Áp cho cả `plugins/acceptance-gate/scripts/gate-card.js` qua sync.

- **Gate-2 card silently drops the inert-field warning on BLOCKED/REJECT verdicts**
  file: `scripts/gate-card.js:313`
  severity: medium
  AC: AC-12
  source: bugs
  detail: The non-approvable branch (`if (!approvable) { ... process.exit(0) }` at lines 313-327) returns before the new inert block at lines 390-409, so the `kind:"inert"` run-log line is never read for a BLOCKED or REJECT card. The writer side was explicitly hardened for exactly this (feature-loop/workflows/acceptance-verify.js:350-351 — "Canh bao o inert phai song sot CA nhanh thoat som"), the reader side was not, and no WI6 case renders a non-PASS fixture (every `card()` fixture in tests/workflows/acceptance-verify.test.mjs hardcodes `verdict: PASS`).

    Reproduced on the shipped workspace: `_acceptance/judgment-runs/run-log.jsonl:80` carries a round-5 `kind:"inert"` line for E10, and `_acceptance/judgment-runs/evidence-report.md` is `verdict: BLOCKED`. `node scripts/gate-card.js --slug judgment-runs` emits exactly one flag (`flag fred`, the BLOCKED reason) and zero occurrences of the warning sentence. Same code in the mirror at plugins/acceptance-gate/scripts/gate-card.js:313.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Đường đọc-cũ của mục ## Variance nuốt IM LẶNG cờ đỏ phương sai, không có cờ vàng thay thế**
  Người dùng thấy gì: Nếu một báo cáo cũ đã ghi sẵn câu cảnh báo về field không dùng, và cùng lúc có một eval AI thật đang cho kết quả không ổn định, thẻ quyết định có thể không hiện cảnh báo nào cho cả hai vấn đề — người ký sẽ không biết có eval đang chập chờn.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Biến `inertNoteShown` gán rồi không ai đọc**
  Người dùng thấy gì: Đây là mã dư bên trong không ảnh hưởng gì tới nội dung hay cảnh báo mà người dùng thấy trên thẻ quyết định.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Vị từ `INERT_DECLARED.paths` không hàng nào trong bảng dùng tới**
  Người dùng thấy gì: Đây là mã nội bộ chưa được dùng tới — không ảnh hưởng tới cảnh báo người dùng thấy hiện tại, nhưng có thể khiến người sửa sau vô tình bật lại một cảnh báo sai cho field khác trong tương lai.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Report carrying the inert sentence loses BOTH flags — real variance disappears with no replacement**
  Người dùng thấy gì: Nếu một báo cáo cũ mang câu cảnh báo về field không dùng, và đồng thời có một eval AI thật đang cho kết quả không ổn định, nhưng nhật ký chạy không còn dòng ghi khớp (ví dụ báo cáo cũ được tái tạo lại), thẻ quyết định có thể im lặng hoàn toàn về cả hai vấn đề — người ký không biết có eval đang chập chờn.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Malformed `runs` value is silently ignored by both the runner and the new inert reporter**
  Người dùng thấy gì: Nếu người viết eval khai một giá trị lặp-lại không hợp lệ (ví dụ số dạng chữ, số 0, số âm, hoặc số thập phân) thay vì một số nguyên hợp lệ, hệ thống lặng lẽ chạy đúng 1 lần mà không báo cho người viết biết giá trị họ khai đã bị bỏ qua.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
