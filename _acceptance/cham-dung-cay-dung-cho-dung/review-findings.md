## Trong hợp đồng

- **s4-args.mjs drops `steps` of ui-check evals — the mandated one-command path cannot produce valid args for any profile with a ui-check eval**
  file: `feature-loop/scripts/s4-args.mjs:77`
  severity: high
  source: conventions
  AC: AC-1
  parseEvals is called with fields ['criterion','executor','cmd','expected','runs','question'] (line 77) and the local list-field scanner only handles ['inputs','paths','evidence_required'] (line 80) — `steps`, the canonical block-list field of ui-check evals (see skills/acceptance/references/eval-executors.md E3 example), is extracted by neither, so it is silently omitted from the generated args. acceptance-verify.js requires a non-empty steps array for ui-check ('ui-check': { arr: ['steps'] } in the EVAL-REQUIRED-FIELDS marker, line 292), so every run built by s4-args for such a profile goes BLOCKED at eval sanitize — and the new S4-ARGS-CLAUSE in feature-loop/skills/feature-loop/SKILL.md forbids falling back to hand-built args, making ui-check profiles un-runnable through the only permitted path. No test catches it: lane-pin.test.mjs builds its ui eval fixture with steps already inline (reader-shaped fixture, bypassing the writer), and rang.sh's fixture has no ui-check eval — precisely the "bên VIẾT và bên ĐỌC trôi khỏi nhau vì test tự dựng fixture đúng khuôn bên đọc" class CLAUDE.md names. Verify: add a ui-check eval with a `steps:` block to the rang.sh fixture and inspect the generated args.json.

- **wont-fix added to triage but the synthesize prompt's OOC-ITEM-TEMPLATE gloss still enumerates only known-limits|new-contract — the new bucket can be rewritten before it ever reaches the Gate 2 card**
  file: `feature-loop/workflows/acceptance-verify.js:926`
  severity: high
  source: conventions
  AC: AC-10
  Commit f150ca15 (P201) extends proposal to 'wont-fix' in the TRIAGE_SCHEMA (line 183), the triage prompt (line 665), and the gate-card renderer (scripts/gate-card.js line 702). But the synthesize agent — the actual WRITER of review-findings.md that gate-card later reads — is still instructed on line 926: "{proposal} la known-limits (ghi han che da biet roi ship) hoac new-contract (dang mot feature rieng)". An agent handed a triaged finding with proposal='wont-fix' plus an instruction saying the value is one of two other strings may coerce or drop it, and lib/out-of-contract.js then never sees 'wont-fix', so the new "Máy đề xuất: không sửa" line never renders. This is the LLM-writes→machine-reads seam CLAUDE.md requires to live in ONE templated place with a round-trip test; P201's review-findings.md fixture is hand-written in the reader's shape, so the drift is invisible to the suite. Fix side: update the gloss on line 926 to include wont-fix (and ideally extend P201/P55-style round-trip to pull the allowed values from one marker shared by schema, prompt, and renderer).

- **s4-args.mjs bỏ rơi field `steps` — mọi hồ sơ có eval ui-check sinh args mà workflow chắc chắn BLOCK, script vẫn exit 0**
  file: `feature-loop/scripts/s4-args.mjs:77`
  severity: high
  source: bugs
  AC: AC-1
  parseEvals được gọi với fields ['criterion','executor','cmd','expected','runs','question'] và bộ quét list cục bộ chỉ có LIST_KEYS ['inputs','paths','evidence_required'] (dòng 80) — không chỗ nào rút `steps`. Trong khi acceptance-verify.js (bảng EVAL_REQUIRED, dòng 292) bắt buộc ui-check có `steps` là mảng chuỗi không rỗng, thiếu là return BLOCKED trước fan-out. Đã kiểm chứng bằng fixture: evals.yaml có eval ui-check với steps đầy đủ → s4-args exit 0, args ra chỉ còn {id, criterion, executor, expected}. Vì SKILL.md giờ CẤM fallback soạn tay (khối S4-ARGS-CLAUSE) nên mọi vòng S4 của hồ sơ có ui-check là ngõ cụt đốt round — đúng lớp lỗi hạ-tầng-đốt-round mà chính hồ sơ này mở ra để đóng. Vi phạm AC-1 ("chứa đủ các trường hợp đồng của acceptance-verify.js") và triết lý fail-CLOSED của chính script (đáng lẽ hoặc sinh đủ trường hoặc exit 2 có tên, không sinh tệp thiếu trường mà exit 0).

- **AC-9 round-tally vắng ở mọi đường BLOCKED early-return — đúng các lượt cháy vì args/hạ tầng mà ngưỡng 5-vòng-kế cần đếm lại không để vết**
  file: `feature-loop/workflows/acceptance-verify.js:56`
  severity: medium
  source: bugs
  AC: AC-9
  Dòng round-tally chỉ được push trên đường chạy chính (dòng ~877, sau khi tính verdict). Bốn đường return sớm với verdict BLOCKED — args.evals/suiteCommands sai (dòng 56), toolKillRule thiếu marker (dòng 80), evalProblems (return trong khối validation ~dòng 328), không-gì-để-verify (dòng 417) — trả object KHÔNG có field runLog, nên main loop không có gì để append: lượt đó 0 dòng tally, 0 dòng vang-mat. Contract AC-9 ghi "kết thúc với BẤT KỲ verdict nào... đúng MỘT dòng round-tally", và giới hạn đã khai trong Notes chỉ chừa ca "main loop chết trước khi ghi" — không chừa các ca này. Hậu quả đo được: Đường đo "5 vòng S4 kế: 0 lượt hỏng vì hình dạng cwd/args" đọc số từ round-tally + vang-mat, mà lượt BLOCKED-vì-args-hỏng (chính lớp cần đếm) lại vô hình với bộ đọc.

- **CD_FAIL_RE không khớp thông điệp cd-fail của POSIX sh/dash — cd thất bại ở shell đó vẫn thành REJECT giả**
  file: `feature-loop/workflows/acceptance-verify.js:532`
  severity: low
  source: bugs
  AC: AC-12
  Regex đòi một trong ba chuỗi 'No such file or directory' | 'Not a directory' | 'Permission denied' sau 'cd:'. bash/zsh khớp, nhưng dash/BusyBox sh in `cd: can't cd to /path` — không chuỗi nào khớp → kết quả đi nhánh FAIL sản phẩm (REJECT giả) thay vì BLOCKED, đúng hành vi mà AC-12 tuyên bố chặn cho dấu hiệu "bước cd thất bại". Mức độ thấp vì verifier agent trên môi trường hiện tại chạy bash/zsh; nêu để hoặc thêm nhánh `can't cd to` vào regex, hoặc ghi rõ vào giới-hạn-đã-khai của Đường đo (hiện giới hạn khai chỉ nói "các hình dạng hạ tầng KHÁC hai dấu hiệu", trong khi đây vẫn là dấu hiệu cd-fail).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **s4-args.mjs: invalid --carry-anchor / --diff-base refs crash with an uncaught git exception instead of the script's own fail-closed exit-2-with-named-part contract**
  Người dùng thấy gì: Khi người dùng gõ sai mốc so sánh (nhánh/commit) để đối chiếu thay đổi, công cụ có thể dừng với một thông báo lỗi kỹ thuật khó hiểu thay vì một câu giải thích ngắn gọn nêu đúng chỗ sai.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **s4-args.mjs không strip quote YAML (không truyền normalize cho parseEvals) — cmd bọc nháy thành lệnh hỏng, bị normInfra chấm nhầm thành BLOCKED hạ tầng**
  Người dùng thấy gì: Một cấu hình chấm điểm hoàn toàn hợp lệ có thể bị hệ thống báo nhầm là gặp sự cố kỹ thuật và bị chặn oan, dù nội dung khai báo không có gì sai.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: nhánh «mutant chết sớm» tính là PASS, không ghim thông điệp, không chạy lại phép đo thật**
  Người dùng thấy gì: Một phần của bộ kiểm tra tự động có thể báo "đạt" ngay cả khi phép kiểm tra thật chưa từng thực sự chạy, nên nếu lỗi tương ứng xảy ra sau này, nó có thể không bị phát hiện.
  file: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 — fixture args VIẾT TAY đúng khuôn bên đọc; writer s4-args.mjs sinh ra trong cùng diff nhưng không có round-trip writer→reader**
  Người dùng thấy gì: Bộ kiểm tra tự động hiện chưa đối chiếu dữ liệu thật do công cụ sinh ra với phần đọc dữ liệu đó, nên nếu hai phía lệch nhau trong tương lai, hệ thống kiểm tra có thể vẫn báo đạt nhầm.
  file: `tests/workflows/lane-pin.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» với một giá trị cố định, trong khi lời hứa AC-6 là QUAN HỆ cd <repoRoot> && <cmd>**
  Người dùng thấy gì: Bài kiểm tra tự động hiện chỉ xác nhận đúng một trường hợp cố định cho việc đặt đúng thư mục làm việc, nên nếu tính năng này hỏng ở những trường hợp khác, hệ thống kiểm tra có thể không phát hiện ra.
  file: `tests/workflows/lane-pin.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — đo CHỈ DẪN thay vì ĐẦU RA: vế «schema triage nhận wont-fix» của P201 chỉ grep chuỗi trong nguồn workflow, không lượt triage nào chạy**
  Người dùng thấy gì: Một phần bài kiểm tra chỉ soát chữ trong tài liệu hướng dẫn nội bộ, không thực sự chạy thử luồng phân loại — nên nếu luồng đó ngừng hoạt động đúng nhưng tài liệu không đổi, bài kiểm tra vẫn có thể báo đạt.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
