Review Findings: gom-duc-ket-2-10-0 (Round 2)

## Trong hợp đồng

### Dòng round-tally ghi verdict CŨ khi lane xuất-xứ chết — vật đo tự dối đúng chỗ nó sinh ra để đo
- file: `feature-loop/workflows/acceptance-verify.js:1067`
- severity: high
- AC: AC-10, AC-3, AC-9
- source: conventions

Dòng `kind: round-tally` được push ở dòng 1042 (`runLogLines.push(tallyLine(verdict, blocked.length, expected, returned))`), TRƯỚC bước `capture:provenance`. Nhánh null-guard mới ở 1067 sau đó gán `verdict = 'BLOCKED'` và `blocked.push({cmd:'capture:provenance', …})` rồi return, nhưng KHÔNG sinh lại dòng tally. Chạy thật qua harness (tests/workflows/harness.mjs, args mẫu, responder trả null cho capture:provenance) cho ra: `result.verdict = BLOCKED`, `result.blocked` có 1 mục, còn `result.runLog` chứa `{"kind":"round-tally","verdict":"PASS","expected":2,"returned":2,"blocked":0}`. SKILL.md dòng 228 buộc main loop append `result.runLog` ở MỌI verdict, nên run-log.jsonl trên đĩa sẽ khai một vòng PASS/blocked=0 cho đúng cái vòng bị hạ tầng giết. Đây chính là lớp lỗi mà khối ROUND-TALLY-SCHEMA (dòng 56–72) và AC-9 «dòng tổng kết lượt phải có ở MỌI verdict» dựng ra để chặn, và là nguồn số cho ngưỡng 5-vòng-kế đọc qua feature-loop/scripts/round-tally-read.mjs — số «vòng cháy vì hạ tầng» sẽ đếm hụt đúng những vòng cần đếm. Đường `blockedEarly` (dòng 73–76) làm đúng: nó tự dựng `runLog: [tallyLine('BLOCKED', 1)]`. Test W37 mới chỉ kiểm verdict + reason + không-gọi-synthesize, không kiểm dòng tally, nên lỗi lọt.

**Kịch bản lộ lỗi:** S4 round 1, mọi eval xanh, agent capture:provenance chết vì hạn mức phiên → workflow trả verdict=BLOCKED nhưng append vào `_acceptance/<slug>/run-log.jsonl` dòng `{"kind":"round-tally","verdict":"PASS","blocked":0}`; `round-tally-read.mjs` đọc lại thấy một vòng PASS sạch, phép đếm lượt-cháy-vì-hạ-tầng cho 0 trong khi thực tế là 1.

Rationale phạm vi: AC-3 chỉ đòi verdict=BLOCKED, mục blocked đúng reason, và synthesize:report không được gọi — không có câu nào trong AC-3 ràng buộc nội dung dòng round-tally trong runLog phải khớp verdict cuối.

### pathsOf quét cả THÂN block scalar → staleScope fail-open, phá đúng lời khai «không có đường fail-open nào ở đây»
- file: `lib/eval-yaml.cjs:76`
- severity: high
- AC: AC-6
- source: conventions

`pathsOf` là một bộ quét dòng thuần, không hiểu block scalar (`expected: >` / `cmd: |`), trong khi header của chính file này (dòng 2–14) khai luật số 2: «dòng THÂN block không bao giờ được quét key» — `parseEvals` cùng file có `blk`/`closeBlk` để giữ luật đó, `pathsOf` thì không. Hệ quả: một dòng trong thân `expected: >` viết `paths: [docs/**]` bị đọc thành lời khai paths của eval đó. Chạy thật: `staleScope(y)` với eval E1 (executor test, KHÔNG khai paths, có `expected: >` mà thân chứa dòng `paths: [docs/**]`) + eval E2 (script, `paths: [lib/x.js]`) → `staleScope = ["docs/**","lib/x.js"]`. Theo hợp đồng khai ở lib/evidence-core.cjs:672–685 («Một eval thiếu → trả null → bên gọi giữ nguyên luật cũ, cả cây») kết quả đúng phải là `null`. Vì `staleScope` là thứ duy nhất quyết phạm vi hoá-cũ ở scripts/pre-merge-check.sh (stale_files, dòng ~505), hồ sơ đó sẽ chỉ hoá cũ khi diff chạm `docs/**` hoặc `lib/x.js` — mọi thay đổi code khác sau verify đi qua cổng mà không ai biết. Bộ test mới tests/scripts/stale-paths.test.mjs (SP1–SP6) không có ca nào có block scalar nên không bắt được. Lớp gốc: `paths:` nay có BA bộ đọc tolerance khác nhau (feature-loop/scripts/s4-args.mjs:107–130, feature-loop/scripts/carry-plan.mjs:75, `pathsOf` mới) — trái invariant «khuôn của seam phải đặt MỘT chỗ có marker rồi test round-trip» trong CLAUDE.md.

**Kịch bản lộ lỗi:** Hồ sơ có eval E1 executor=test không khai paths nhưng `expected: >` có một dòng thân bắt đầu bằng `paths: [docs/**]` (rất thường gặp khi AC nói về chính luật paths, ví dụ E6 của hồ sơ này). staleScope trả globs thay vì null → pre-merge-check.sh thu phạm vi hoá-cũ; sau khi ký, ai đó sửa lib/evidence-core.cjs → evidence KHÔNG bị đánh stale, PR gộp với bằng chứng đã lỗi thời.

Rationale phạm vi: AC-6(e) yêu cầu staleScope trả null khi một eval máy/ui thiếu khai paths; ca tái lập cho thấy một eval thật sự thiếu paths (chỉ có chuỗi 'paths:' tình cờ nằm trong thân block scalar của trường khác) lại khiến staleScope trả về mảng glob thay vì null — vi phạm trực tiếp câu chữ của AC-6(e).

### Làn review conventions mất toàn bộ file CODE từ round 2 trở đi
- file: `feature-loop/workflows/acceptance-verify.js:491`
- severity: medium
- AC: AC-10, AC-3, AC-9
- source: conventions

`conventionScope` (dòng 491–493) dựng tiền tố «CHI cham file CHU (.md) trong danh sach da doi so round truoc» và chỉ liệt `args.deltaFiles.filter(f => /\.md$/i.test(f))`. Từ round ≥2 có `--carry-anchor` (s4-args.mjs:299–305 nay truyền `deltaFiles`), làn `conventions` — làn DUY NHẤT có nhiệm vụ «vi pham invariant kien truc, sai pattern co san, thieu validation o system boundary» — bị chỉ thị bỏ qua mọi file .js/.mjs/.cjs/.sh. Test W39 pin đúng hành vi này. Hai làn còn lại không lấp chỗ trống: `bugs` chỉ săn correctness/silent failure, `measurement` chỉ đọc file test/eval. Kết quả: code viết ra trong round fix (thường là code rủi ro nhất của cả vòng) không còn làn nào chấm nó theo CLAUDE.md. Sửa đúng tầng là lọc theo «file có trong deltaFiles» (mọi đuôi), không phải theo đuôi .md.

**Kịch bản lộ lỗi:** Round 1 REJECT → S3 sửa lib/evidence-core.cjs và scripts/pre-merge-check.sh → S4 round 2 chạy với --carry-anchor. Làn conventions nhận danh sách chỉ gồm file .md nên trả findings rỗng cho hai file code vừa sửa; một vi phạm invariant kiến trúc mới trong lib/evidence-core.cjs đi thẳng tới Cổng 2 mà không làn nào chấm.

Rationale phạm vi: Hành vi tái lập (prompt chỉ chấm file .md trong danh sách deltaFiles) khớp đúng câu chữ AC-10 yêu cầu — đây là thiết kế đã chốt trong hợp đồng, không phải lệch khỏi AC nào.

### Nhánh return sớm của provenance lệch khuôn với blockedEarly có sẵn
- file: `feature-loop/workflows/acceptance-verify.js:1074`
- severity: low
- AC: AC-10, AC-3, AC-9
- source: conventions

Object trả về ở nhánh `!prov` thiếu `runLogWriteFailed`, `confirmedFindings`, `rejectFindings`, `nonDiscriminating`, `variance` — đo thật qua harness: `result.runLogWriteFailed === undefined`, `result.confirmedFindings === undefined`, `result.rejectFindings === undefined`. Khuôn có sẵn cho đường BLOCKED trong chính file này (`blockedEarly`, dòng 73–76) luôn khai `confirmedFindings: []` và `runLogWriteFailed: true`. Ba đường trả về (blockedEarly · nhánh provenance mới · return chính dòng 1114) nay là ba khuôn khác nhau cho cùng một hợp đồng kết quả; bên đọc nào lỡ `.length`/`.filter` trên các field đó sẽ ném TypeError.

**Kịch bản lộ lỗi:** Bất kỳ bên đọc nào của result (main loop hoặc bộ đọc gói Gate 2 tương lai) làm `result.confirmedFindings.length` trên đường provenance-chết sẽ ném «Cannot read properties of undefined», thay vì nhận [] như hai đường BLOCKED còn lại.

Rationale phạm vi: AC-3 chỉ đòi các trường verdict/blocked/không-gọi-synthesize; không có câu nào yêu cầu object trả về phải đủ mọi trường như đường blockedEarly.

### Provenance-death early return ships a round-tally line that claims the pre-BLOCKED verdict (PASS) and drops runLogWriteFailed
- file: `feature-loop/workflows/acceptance-verify.js:1063`
- severity: medium
- AC: AC-10, AC-3, AC-9
- source: bugs

`runLogLines.push(tallyLine(verdict, blocked.length, expected, returned))` runs at line ~1041, before the new K1 guard. The K1 guard (line 1063-1084) then does `blocked.push({cmd:'capture:provenance',...}); verdict = 'BLOCKED'` and returns `runLog: runLogLines` — the already-pushed tally line still carries the OLD verdict and OLD blocked count. Reproduced with the test harness (responder overriding `capture:provenance` to null): `result.verdict = "BLOCKED"`, `result.blocked = [{cmd:"capture:provenance",...}]`, nhưng `result.runLog` last line = `{"round":2,"kind":"round-tally","verdict":"PASS","expected":2,"returned":2,"blocked":0}`. The main loop appends `result.runLog` verbatim to run-log.jsonl, and round-tally-read.mjs is the machine reader for "vòng bị hạ-tầng đốt". Secondary: the K1 return object omits `runLogWriteFailed` (undefined), while both the normal return and `blockedEarly` set it to `true`.

**Kịch bản lộ lỗi:** The `capture:provenance` agent dies (session limit — the very case K1 was added for). The workflow correctly returns verdict BLOCKED, but the run-log line the main loop persists says `{"kind":"round-tally","verdict":"PASS","blocked":0}`. Any later count of infrastructure-burned rounds (round-tally-read.mjs, loop-health) reads that round as a clean pass.

Rationale phạm vi: AC-3 không ràng buộc nội dung dòng round-tally trong runLog phải khớp verdict cuối, và không đòi trường runLogWriteFailed cho nhánh này — cùng lớp lỗi với finding round-tally ở trên nhưng không có AC nào phủ.

### Gate-2 card: «Ngoài-N» labels desync — displayed block is harm-sorted, the pre-filled sign-off line and the "việc của anh" block are not
- file: `scripts/gate-card.js:929`
- severity: high
- AC: AC-2, AC-9
- source: bugs

K7 (AC-9d) sorts the out-of-contract block by `harm` and renumbers the items from the SORTED position (`oocSorted.forEach((f, fi) => ... 'Ngoài-${fi + 1}'`, line 931/949). But two other renderers still number the same findings from the UNSORTED `ooc.findings` array: line 834-838 (the machine-composed one-liner / routing table, using `g = OOC_GLOSS_NGUOI[f.proposal]`), and line 1015-1019 (the "👉 VIỆC CỦA ANH" block). So as soon as findings are not already in harm order, `Ngoài-N` in the block the human reads points at a different finding than `Ngoài-N` in the line the human is told to paste — the pre-filled recommendation is attached to the wrong item. Reproduced on a fixture (AAA `harm: measure`/known-limits, then BBB `harm: behavior`/new-contract): display block → `Ngoài-1 · mo ta B`, `Ngoài-2 · mo ta A`; one-liner → `Ngoài-1: ghi Known limits; Ngoài-2: mở hợp đồng mới` — exactly swapped. If the owner pastes the machine-composed line, the behavior bug is filed as a Known limit and the measure bug gets a new contract. TH2/TH3 in tests/scripts/ooc-tac-hai.test.mjs only assert the display ORDER, so nothing pins the label↔one-liner alignment.

**Kịch bản lộ lỗi:** review-findings.md lists an OOC item with `Tác hại: measure` before one with `Tác hại: behavior`. gate-card renders the behavior item as `Ngoài-1` in the block the human reads, but emits the sign-off one-liner `Ngoài-1: ghi Known limits; Ngoài-2: mở hợp đồng mới` — the recommendations belong to the other items. Pasting the machine-composed line records the wrong disposition for both findings.

Rationale phạm vi: AC-9(d) chỉ yêu cầu khối hiển thị xếp behavior trước measure; không có câu nào ràng buộc số nhãn Ngoài-N phải đồng bộ giữa khối hiển thị, dòng một-câu và khối việc-của-anh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hình dạng 4 — «chiều đỏ» tautology: assert không bao giờ đỏ được (PV5)**
  Người dùng thấy gì: Một phép kiểm tra tự động được viết ra để bảo đảm luôn phát hiện một loại lỗi cụ thể, nhưng cách viết khiến phép kiểm đó không bao giờ báo sai dù công cụ thật đằng sau có ngừng hoạt động. Người đọc báo cáo có thể yên tâm nhầm vào một phép kiểm không thực sự kiểm tra gì.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs:142`
  severity: high
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 1 — NO4 đo CHỈ DẪN (chữ trong file test) thay vì ĐẦU RA của html(); đối chứng dương/âm mà hợp đồng hứa không tồn tại**
  Người dùng thấy gì: Một bài kiểm tra được đặt tên là kiểm tra 'đầu ra đã được làm sạch khỏi mã màu' thực chất chỉ đọc chữ trong file mã nguồn của bài kiểm khác, không chạy thử và xem kết quả thật. Nếu chức năng làm sạch đó thực sự hỏng, bài kiểm này sẽ không phát hiện ra.
  file: `tests/scripts/lnt-no.test.mjs:178`
  severity: high
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 4 — evals.yaml E2 ghim mốc đối chứng dương ĐÃ CHẾT (334d5d52 không có LNT_AVAILABLE)**
  Người dùng thấy gì: Tài liệu mô tả cách kiểm chứng cho một hạng mục ghi sai mốc commit dùng để đối chứng — mốc ghi trong tài liệu không hề chứa dấu hiệu cần tìm, nên nếu ai đó làm lại đúng theo tài liệu sẽ nhận một phép kiểm không phân biệt được đúng sai. Bài kiểm thật trong mã nguồn vẫn đang dùng đúng mốc, chỉ tài liệu mô tả bị sai.
  file: `_acceptance/gom-duc-ket-2-10-0/evals.yaml:31`
  severity: high
  Tác hại: measure
  Đề xuất: known-limits

- **Ngưỡng trong evals.yaml E8b lệch khỏi mốc máy thực kiểm (mocs-tay.json / AC-8b) — thước nói khác vật**
  Người dùng thấy gì: Tài liệu mô tả ngưỡng số dùng để so sánh hiệu suất giữa các vòng ghi một bộ số khác với bộ số thực sự đang được dùng để so sánh. Dữ liệu thật vẫn đúng, nhưng ai đọc tài liệu mô tả sẽ thấy một bộ số sai.
  file: `_acceptance/gom-duc-ket-2-10-0/evals.yaml:137`
  severity: high
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 5 — E9 tuyên ma trận toàn phần «4 finding × 2 trường = 8 assert» nhưng W38 chỉ có điểm-case cho acRef (1/4)**
  Người dùng thấy gì: Tài liệu mô tả tuyên bố một bài kiểm tra bao quát đầy đủ mọi trường hợp cần kiểm, nhưng bài kiểm thật chỉ kiểm một phần nhỏ trong số đó. Một lỗi gán sai nhãn cho các trường hợp còn lại có thể lọt qua mà không ai phát hiện.
  file: `_acceptance/gom-duc-ket-2-10-0/evals.yaml:153`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/gom-duc-ket-2-10-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
