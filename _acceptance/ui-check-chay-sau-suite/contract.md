---
schema_version: 1
feature: Eval ui-check có id trong feature_loop.model_evals chạy SAU chuỗi suite ở lượt chấm S4 — tuần tự, cùng hàng đợi với eval test/script chạy riêng — để tiến trình nó dựng không bị một lệnh suite ghi đè giữa chừng
slug: ui-check-chay-sau-suite
owner: manh.phan@onemount.com
risk_tier: T2
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-10-19-ui-check-chay-sau-suite-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-19T14:34:51Z
---

# Acceptance Contract: ui-check-chay-sau-suite

Gốc: crm/_acceptance/hoi-dap-okr

## Context

crm-onehub, hồ sơ `hoi-dap-okr`, S4 round 1 (15/10/2026) bị REJECT: eval E10 (`ui-check`) dựng `eve dev` trong
`apps/agent-okr` đúng lúc chuỗi suite chạy `turbo run build --force` → `eve build` ghi lại
`.eve/compile/compiled-agent-manifest.json` và `module-map.mjs` mà `eve dev` đang nạp; luồng trả lời đứt
(`ERR_INCOMPLETE_CHUNKED_ENCODING`). Chạy riêng: 7/7 ĐẠT. Nguồn: `crm/.acceptance-runs/dieu-phoi-r2/yeu-cau/P1-17.json`.

`eval-executors.md` hứa mọi eval trong `feature_loop.model_evals` chạy riêng, sau mọi lệnh máy khác. Vật giữ lời hứa
chỉ cho `test`/`script`: `s4-args.mjs` lọc bỏ ui-check khỏi `evalsChayRieng`, và nhánh ui-check của
`acceptance-verify.js` luôn chạy song song với chuỗi suite. Kiểm 19/10: v2.30.0 và `main` đều còn khe hở.

## Criteria

- AC-1: Given kho mẫu có `feature_loop.model_evals: [demo/E1, demo/E2, demo/E3]` với E1 `script`, E2 `ui-check`, E3
  `judgment`, cùng E4 `ui-check` KHÔNG khai, When `s4-args.mjs` thật sinh tệp args, Then `evalsChayRieng` BẰNG đúng
  `["E1","E2"]` (so trọn mảng). And kho không khai `model_evals` → khoá `evalsChayRieng` vắng hẳn. Chiều đỏ: bản sao
  `s4-args.mjs` với bộ lọc cũ (chỉ test/script) → ca đỏ với thông điệp ghim «ui-check vắng khỏi evalsChayRieng».
- AC-2: Given args có ba lệnh suite, hai lệnh eval song song, ui-check E10 trong `evalsChayRieng` và ui-check E11 không
  khai (tác tử giả ghi cờ bắt đầu/kết thúc), When workflow chạy, Then `ui:E10` bắt đầu SAU khi mọi lệnh suite, mọi
  lệnh eval song song và `ui:E11` đã kết thúc; And `ui:E11` bắt đầu TRƯỚC khi lệnh suite cuối kết thúc (ui không khai
  vẫn song song). Chiều đỏ: bản sao đưa ui chạy-riêng về nhánh song song → thông điệp ghim «ui chạy-riêng chồng chuỗi
  suite».
- AC-3: Given args có lệnh chạy-riêng `nang-1` (eval script trong `evalsChayRieng`), hai ui-check chạy-riêng E10,
  E12 và một ui-check song song E11 chạy lâu hơn mọi lệnh, When workflow chạy, Then ba tác tử chạy-riêng không chồng
  nhau từng cặp, `ui:E10` và `ui:E12` bắt đầu sau khi `nang-1` và `ui:E11` kết thúc; And `nang-1` vẫn bắt đầu TRƯỚC
  khi `ui:E11` kết thúc (lệnh chạy-riêng giữ nhịp 2.28, không chờ ui song song). Chiều đỏ: bản sao chạy ui chạy-riêng
  đồng thời → «hai eval chạy-riêng chồng nhau».
- AC-4: Given ui-check E10 chạy-riêng, When tác tử ui của nó trả (a) exit 0, (b) exit 1, (c) ném lỗi, Then verdict
  lần lượt là (a) `PASS`, (b) `REJECT` với `failedEvals` chứa E10, (c) `BLOCKED` với mục `cmd: ui-check:E10` — kết quả
  ui chạy-riêng đi đúng đường định tuyến của ui-check như trước. And ở (b), (c), khi lệnh suite `suite-a` cùng lượt
  thoát 1: `failedCommands` chứa `suite-a` và ui song song E11 xanh không nằm trong `failedEvals` hay `blocked` — kết
  quả các nhánh khác còn nguyên. Chiều đỏ: bản sao bỏ kết quả ui chạy-riêng khỏi
  `uiRaw` → ca (a) ra BLOCKED, thông điệp ghim «kết quả ui chạy-riêng rơi».
- AC-5: Given args khai E10 (ui-check) trong `evalsChayRieng`, When workflow chạy `dryRun: true`, Then kết quả có
  `uiChayRieng` BẰNG `["E10"]` và `uiCheckEvals` vẫn liệt mọi ui-check; And args không khai → khoá `uiChayRieng` vắng.
- AC-6: Given cùng args không khai `evalsChayRieng` (có lệnh eval, suite, ui-check, judgment), When chạy workflow của
  cây và của mốc cố định `v2.33.0`, Then chuỗi lời gọi `machine:*` và `ui:*` (nhãn + prompt, theo thứ tự) BẰNG HỆT,
  verdict và dry-run bằng hệt — trên đường xanh VÀ trên đường lỗi (một suite exit 1, `ui:E11` ném lỗi: `verdict`,
  `failedEvals`, `blocked` bằng hệt). And args chỉ khai một eval script trong `evalsChayRieng` (không ui-check) →
  chuỗi lời gọi và kết quả bằng hệt `v2.33.0`. And khi khai E10, prompt của `ui:E10` BẰNG HỆT prompt `ui:E10` ở
  `v2.33.0`. Chiều đỏ: bản sao coi mọi ui-check là chạy-riêng → «thứ tự lời gọi đổi».
- AC-7: Given kho mẫu có `model_evals: [demo/E2]` với E2 `ui-check` và một suite, When tệp args do `s4-args.mjs` THẬT
  sinh được nạp vào `acceptance-verify.js` THẬT (harness), Then `ui:E2` bắt đầu sau khi lệnh suite kết thúc. Chiều
  đỏ: cùng kho, args sinh bởi bản sao `s4-args.mjs` bộ lọc cũ → «ui chạy-riêng chồng chuỗi suite».
- AC-8 (judgment): Given `CHANGELOG.md`, `GUIDE.md` và `skills/acceptance/references/eval-executors.md` sau sửa, When
  người nhận kit đọc, Then mục «Chưa phát hành» của CHANGELOG có mục riêng cho hồ sơ này nói: đổi gì · kho nào bị ảnh
  hưởng (kho khai ui-check trong `model_evals`; kho chỉ khai test/script thì không đổi) · làm gì khi nhận (không
  migrate; muốn ui-check nào chạy riêng thì liệt nó vào `model_evals`); GUIDE §7.1 và `eval-executors.md` nói rõ
  ui-check thuộc diện và chạy sau cả ui-check song song lẫn lệnh chạy-riêng, judgment không thuộc diện.

## Coverage

| Trục | Giá trị | AC |
|---|---|---|
| A. Executor của eval có id trong `model_evals` | script · test (cùng nhánh với script) · ui-check · judgment | AC-1 |
| B. Khai | trong `model_evals` · không khai · khoá vắng | AC-1, AC-2, AC-5, AC-6 |
| C. Quan hệ thứ tự của ui chạy-riêng với | lệnh eval song song · chuỗi suite · ui song song · lệnh chạy-riêng · ui chạy-riêng khác | AC-2, AC-3 |
| C'. Nhịp của lệnh chạy-riêng (không đổi) | với ui song song · khi chỉ khai lệnh | AC-3, AC-6 |
| D. Kết cục tác tử ui chạy-riêng | xanh · đỏ · chết | AC-4 |
| D'. Đường lỗi khi không khai | suite đỏ · ui song song chết | AC-6 |
| E. Đường | bên viết · bên đọc · round-trip viết→đọc · dry-run · tài liệu | AC-1, AC-2, AC-7, AC-5, AC-8 |

`test` và `script` đi chung một nhánh lọc ở bên viết (một biểu thức), nên AC-1 dùng `script` làm đại diện.
Thước CE: lời hứa ở `skills/acceptance/references/eval-executors.md` («after every other machine command … one at a
time») [SUY-TỪ-REPO: skills/acceptance/references/eval-executors.md]. Quét không gian bằng tay, không qua skill —
xem sổ quyết định (`bỏ coverage-scan`).

## Out of scope

- Cờ riêng trên eval (`run_alone`…) thay cho `model_evals` — hai nguồn cho cùng một thuộc tính.
- `judgment` trong `model_evals` vẫn chạy song song — hội đồng chỉ đọc tệp, không dựng tiến trình.
- Làn ghim lại (`repin-lane.mjs`) — không chạy ui-check, không đổi.
- Sửa hay chấm lại bất cứ gì ở crm.

## Notes

- Kiểm ngoài (không phải AC — vật ở crm): sau khi crm nhận mốc mang bản sửa VÀ liệt `hoi-dap-okr/E10` vào
  `feature_loop.model_evals` (hôm nay danh sách có `hoi-dap-okr/E8`, `E9`, chưa có E10), round kế của `hoi-dap-okr`
  không cần bản chép acceptance-verify đổi thứ tự (lối A trong P1-17).
- Đo 19/10 trên mọi kho ở `~/dev`: chỉ crm khai `model_evals` — 29 test/script, 6 ui-check (bị lặng lẽ chạy song song
  tới nay), 0 judgment. Sáu ui-check ấy sẽ chạy riêng sau mốc — lượt chấm các hồ sơ đó dài hơn.
- Lệnh chạy-riêng vẫn có thể chồng một ui-check song song như 2.28–2.33 (sổ, dòng thay d-2): nghiệm là kho khai
  ui-check ấy vào `model_evals`, không đổi mặc định cho mọi kho.
