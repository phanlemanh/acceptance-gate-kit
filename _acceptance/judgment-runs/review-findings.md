## Trong hợp đồng

- **Thẻ Cổng 2 không tắt được cảnh báo ô-inert khi chạy lại CÙNG round**
  file: `scripts/gate-card.js:398`
  severity: high
  AC: AC-14
  `lines.filter(e => e.kind === 'inert' && e.round === maxRound).pop()` mã hoá "vòng này sạch" bằng SỰ VẮNG MẶT của dòng inert ở vòng mới nhất. Sổ chạy là append-only, và SKILL.md feature-loop chỉ thị chạy lại CÙNG round ở ít nhất hai chỗ (BLOCKED → "chạy lại CÙNG round"; PASS mà result.report rỗng → "chạy lại S4 cùng round"). Sau lần chạy lại đã sạch, dòng inert CŨ của cùng round vẫn nằm trong sổ, maxRound không đổi, nên .pop() vẫn nhặt đúng nó.

  ĐÃ TÁI HIỆN trên cây đang kiểm: workspace tạm với run-log.jsonl gồm đúng 2 dòng — {round:3,kind:"inert",note:…} rồi {round:3,kind:"baseline"} (lần chạy lại không sinh dòng inert) — `node scripts/gate-card.js --slug rt` VẪN in cờ vàng "Field khai mà máy không dùng" (1 lần, đúng ra phải 0). Người sửa evals.yaml đúng như cảnh báo bảo sẽ thấy cảnh báo không bao giờ tắt cho tới khi số round tăng.

  Cùng-round-lặp-lại là chuyện có thật trong repo: _acceptance/start-command/run-log.jsonl có round 1 xuất hiện hai lần; _acceptance/gap-probe-presence-hook/run-log.jsonl có 1,2,3 rồi lại 1,2,3.

  WI6 case [vòng sau đã sạch] (tests/workflows/acceptance-verify.test.mjs:977) chỉ dựng dòng sạch ở round 2 — phủ nhánh round TĂNG, không phủ nhánh round LẶP; đột biến "bỏ LOC THEO VONG" trong mutation-check.mjs cũng chỉ đo được nhánh đã phủ đó. Đây đúng lớp "assertion âm-tính-một-mình" mà CLAUDE.md cấm: phép đo hiện không phân biệt được hai trường hợp.

  Sửa cần tín hiệu "vòng này đã sạch" TƯỜNG MINH (vd luôn ghi dòng kind:"inert" với fields: [] khi sạch, hoặc so vị trí dòng inert với dòng kind:"baseline" cuối cùng của cùng round) thay vì suy từ sự vắng mặt. Áp cả cho plugins/acceptance-gate/scripts/gate-card.js qua sync.

  rationale: AC-14(b) đòi cơ chế 'vòng này sạch' không được mã hoá bằng sự vắng mặt tới mức cảnh báo hiện mãi khi người sửa evals.yaml — case tái hiện cho thấy re-run CÙNG round vẫn giữ cảnh báo, đúng thất bại AC-14(b) mô tả và cấm.

- **Nhánh non-approvable của thẻ thoát TRƯỚC khối ô-inert — cảnh báo mất đúng ở BLOCKED/REJECT**
  file: `scripts/gate-card.js:313`
  severity: high
  AC: AC-12
  `if (!approvable) { … process.exit(0) }` (dòng 313-327) trả về trước khối đọc ô-inert (dòng ~380-409), nên dòng run-log kind:"inert" KHÔNG BAO GIỜ được đọc cho thẻ BLOCKED hoặc REJECT.

  Bên VIẾT đã được gia cố tường minh đúng cho trường hợp này — feature-loop/workflows/acceptance-verify.js:350 ghi "Canh bao o inert phai song sot CA nhanh thoat som — im lang o ca hiem van la im lang" và nhánh BLOCKED sớm mang theo inertFields. Bên ĐỌC thì không, nên bất đối xứng viết/đọc đúng hình dạng (3) trong CLAUDE.md ("bên VIẾT và bên ĐỌC của một artifact trôi khỏi nhau").

  ĐÃ TÁI HIỆN trên gói đang ship: _acceptance/judgment-runs/run-log.jsonl mang dòng kind:"inert" cho E10 và _acceptance/judgment-runs/evidence-report.md là verdict: BLOCKED. `node scripts/gate-card.js --slug judgment-runs | grep -c 'Field khai mà máy không dùng'` → 0.

  Không case WI6 nào render fixture non-PASS: mọi fixture card() trong tests/workflows/acceptance-verify.test.mjs hardcode `verdict: PASS`, nên toàn bộ ma trận WI6 mù nhánh này. Cùng mã ở mirror plugins/acceptance-gate/scripts/gate-card.js:313.

  rationale: AC-12 đòi trình-cho-người ở Cổng 2 hiện cờ khi inertNote có mặt trong Variance của evidence-report.md; nhánh non-approvable bỏ qua khối đọc đó nên cờ không hiện, tái hiện đúng trên workspace dogfood mà Notes của contract nói signer phải thấy tại Cổng 2.

- **Thẻ Cổng 2 verdict REJECT/BLOCKED thoát sớm trước khối cờ, nên cảnh báo ô-inert không bao giờ hiện**
  file: `scripts/gate-card.js:313`
  severity: low
  AC: AC-12
  Nhánh `if (!approvable)` (REJECT / BLOCKED / verdict lạ) render thẻ 'CHƯA ký được' rồi `process.exit(0)` ở dòng ~326 — TRƯỚC khối đọc `run-log.jsonl` và đẩy cờ vàng ô-inert (dòng 388-410). Vậy kênh máy-viết → thẻ chỉ sống trên thẻ approvable.

  Ca sống ngay trong chính commit này: `_acceptance/judgment-runs/evidence-report.md` có `verdict: BLOCKED`, còn run-log có dòng `kind:"inert"` ở cả 6 vòng (E10 khai `runs: 3` trên eval judgment). Render thẻ Cổng 2 cho chính workspace của feature này sẽ KHÔNG in ra cảnh báo mà feature sinh ra để in.

  Còn kênh `result.inertFields` qua SKILL nên không mất trắng, nhưng khối comment mới trong gate-card.js mô tả kênh sổ-chạy như đường bất biến tới mặt người ký mà không nêu giới hạn này — ít nhất nên ghi rõ, hoặc đẩy cờ vào cả nhánh non-approvable.

  rationale: Cùng gốc với nhánh non-approvable: cờ ô-inert không hiện cho thẻ BLOCKED/REJECT, vi phạm đúng yêu cầu 'trình-cho-người ở Cổng 2 hiện một cờ' của AC-12, tái hiện trên workspace dogfood chính contract này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **E15 expected trôi khỏi vật được giao: khai 7 đột biến, script có 11; mô tả sai đột biến phía VIẾT**
  Người dùng thấy gì: Hồ sơ kiểm tra mô tả sai số lượng và loại phép thử mà máy dùng để chứng minh tính năng hoạt động đúng, nên người duyệt có thể hiểu nhầm mức độ đã được kiểm tra thực tế.
  file: `_acceptance/judgment-runs/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **mutation-check.mjs không nằm trong bất kỳ suite thường trực nào — bằng chứng phân biệt tắt ngay sau khi feature này ký**
  Người dùng thấy gì: Bộ kiểm chứng minh tính năng này hoạt động đúng có thể ngừng tự chạy ngay sau khi được duyệt, nên các thay đổi mã nguồn sau này có thể làm hỏng tính năng mà không ai phát hiện.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Mã chết mới ở cả hai bên seam ô-inert: inertNoteShown và INERT_DECLARED.paths**
  Người dùng thấy gì: Có phần cấu hình cảnh báo dư thừa không thực sự được dùng, làm tăng rủi ro là cảnh báo mới thêm sau này có thể bị bỏ sót âm thầm mà không ai biết.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Nhánh BLOCKED khi provenance chết vứt mất toàn bộ `blocked[]` thật**
  Người dùng thấy gì: Khi hệ thống theo dõi nguồn gốc gặp lỗi cùng lúc với các nguyên nhân chặn khác (như thiếu cấu hình môi trường), người dùng chỉ được báo một lý do và mất hết các lý do chặn thật khác, nên sửa xong vẫn bị chặn lại mà không rõ vì sao.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **Responder triage của WI9 dùng sai khoá (`triage` thay vì `triaged`) — cả làn triage chết im lặng trong phép đo**
  Người dùng thấy gì: Một phần của bộ kiểm tra dùng để bảo đảm việc phân loại lỗi tự động hoạt động đúng lại không thực sự kiểm tra đúng thứ nó khai báo, nên lỗi trong đường phân loại đó có thể lọt qua mà không bị phát hiện.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/judgment-runs/evals.yaml, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
