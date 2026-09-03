# Review findings — vu-trang-goal-luc-goi-ten (round 2)

## Trong hợp đồng

- **AC-7 script không thể đỏ khi một eval MẤT kết quả — dòng `kind: vang-mat` của bên viết bị bộ lọc `!r.kind` loại bỏ, eval biến mất khỏi phép kiểm và script vẫn in «AC-7 OK», exit 0** (`tests/scripts/run-log-minted.mjs:40`, severity medium, nguồn bugs) — Bên viết (feature-loop/workflows/acceptance-verify.js ~L955-965, AC-8 cham-dung-cay-dung-cho-dung) cố ý ghi một dòng `{evalId, kind: 'vang-mat', reason}` KHÔNG có run_id cho mỗi eval mà agent chết/skip — đúng để «vắng mặt không tàng hình». Bộ đọc mới lọc `rows.filter(r => r.evalId && !r.kind)` nên dòng đó bị bỏ, và vì mọi phép kiểm (1)(2)(3) chỉ duyệt các dòng CÓ MẶT trong `last` chứ không bao giờ đối chiếu ngược tập id của evals.yaml, eval mất kết quả đơn giản không tồn tại với script. Đây chính là nhánh duy nhất của bên viết mà run_id thật sự RỖNG — trường hợp thông điệp ghim «run_id rong: <evalId>» được dựng ra để bắt — nhưng nó không bao giờ nổ được. Tái hiện đã chạy (fixture trong scratchpad): evals.yaml có E1,E2; run-log chỉ có `{evalId:E1, kind:vang-mat}` + dòng E2 bình thường → in `AC-7 OK: 1 dong, vong r1, ...`, exit 0. Cùng gốc: E1 không có dòng nào trong vòng cuối → cũng `AC-7 OK: 1 dong`, exit 0. (Đối chiếu: eval bị công cụ giết `cannot_run:true` nhưng có run_id đúc thì PASS theo đúng giới hạn đã khai trong AC-7 — không tính là lỗi; điểm lệch là bộ đọc đối xử «agent chết» và «agent chạy nhưng bị cắt» theo hai cách, một cái biến mất, một cái qua.) Sửa một chỗ đóng cả lớp: sau khi lấy `last`, đòi mọi id trong `ids` (trừ eval carried/SUITE) có đúng một dòng eval trong vòng cuối, và coi dòng `kind: vang-mat` của vòng cuối là «run_id rong: <evalId>» → exit 1. Test hiện tại (run-log-minted.test.mjs) không có ca nào cho hai hình dạng này. Đã xác nhận tại HEAD: suite plugins đầy đủ và suite scripts (797/0) đều xanh — phát hiện này là lỗ lưới, không phải test đỏ. Vì sao tính vào hợp đồng: AC-7 nêu rõ 'mọi dòng eval có run_id KHÁC RỖNG' và liệt kê 'run_id rỗng' là điều kiện phải thoát 1; dòng vang-mat đúng là hình dạng run_id-rỗng đó nhưng bị lọc mất trước khi kiểm nên script không bao giờ bắt được. AC: AC-7

- **Hình dạng 3 — --usage đo «chuỗi S4 round k có mặt» ở bất kỳ đâu, trong khi AC-7 hứa MỤC do wf-usage.mjs sinh từ transcript (vết máy-giữ)** (`tests/scripts/run-log-minted.mjs:58`, severity medium, nguồn measurement) — Dòng 58 `new RegExp(`S4 round ${lastRound}\b`).test(u)` khớp chuỗi ở bất kỳ vị trí nào của usage-report.md — không đòi heading, không đòi run id. Bên viết feature-loop/scripts/wf-usage.mjs:137 in `### <title> — <runId> (<n> agent, <out> out-tok)` với runId = tên thư mục transcript (`wf_…`); bản thật của chính hồ sơ này: `### S4 round 1 (BLOCKED — …) — wf_cafcaf03-0d8 (25 agent, …)`. AC-7 gọi mục này là «vết máy-giữ của việc đi qua Workflow» và hợp đồng khai thẳng «hình dạng run_id KHÔNG chứng minh được nguồn gốc — vết mạnh là usage-report», nhưng một dòng prose gõ tay «S4 round 1» cũng qua: quan hệ được hứa (mục cho vòng k ↔ run workflow sinh từ transcript) chỉ được đo bằng sự có mặt của chuỗi. Neo rẻ có sẵn trên cùng dòng heading: `### S4 round <k>` + ` — wf_`. Vì sao tính vào hợp đồng: AC-7 gọi thẳng usage-report là 'vết máy-giữ'/'vết mạnh' đúng vì run_id không chứng minh được nguồn gốc workflow; một phép so khớp chuỗi bất kỳ-vị-trí (kể cả prose gõ tay) không giữ được tính chất 'vết mạnh' đó nên không đạt lời hứa AC-7. AC: AC-7

- **Hình dạng 2 — fixture usage-report gõ tay theo regex bên đọc, không round-trip qua wf-usage.mjs dù wf-usage.test.mjs đã có sẵn đường round-trip** (`tests/scripts/run-log-minted.test.mjs:71`, severity low, nguồn measurement) — Dòng 71 `'## S4 round 1\n| model | agents |\n'` — heading H2 và bảng `| model | agents |` không trùng bất kỳ đầu ra nào của bên viết (wf-usage.mjs --md in H3 `### S4 round 1 — wf_<id> (…)` và bảng `| label | model | calls | out | in | cache_read | s |`). tests/scripts/wf-usage.test.mjs:76-77 đã chạy `wf-usage.mjs --md --title 'S4 round 1'` trong tiến trình và nhận `### S4 round 1 — wf_test-run` — round-trip rẻ, không được dùng. Hệ quả đúng lớp «bên viết/bên đọc trôi»: nếu bên đọc siết theo finding trên (heading + wf_), fixture này đỏ trong khi bản thật của writer vẫn xanh; hiện tại bên đọc xanh trên một hình dạng writer không bao giờ sinh. Sổ cái #5 chỉ khai fixture run-log (dòng eval), chưa khai fixture usage-report. Vì sao tính vào hợp đồng: AC-7 đòi hỏi rõ 'đối chứng hai chiều trên fixture code-sinh'; fixture usage-report trong test là gõ tay chứ không sinh từ wf-usage.mjs, và phần Known limits đã khai sẵn trong Notes của hợp đồng chỉ trích dẫn acceptance-verify.js (fixture run-log), không phủ usage-report. AC: AC-7

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thẻ Cổng 1 có thông điệp/khoá mới ở bên VIẾT (goal_line + .mach.goal) nhưng bên ĐỌC commands/acceptance-card.md không có dòng thuật — đúng lớp «đổi chữ bên viết mà quên bên đọc» vừa sửa ở 9f76d6d3, và răng round-trip không nhìn thấy nó**
  Người dùng thấy gì: Khi mở lại thẻ quyết định Cổng 1 qua lệnh xem thẻ, tin nhắn hiển thị cho người dùng có thể không kèm sẵn dòng lệnh /goal để dán chạy tiếp, dù dữ liệu thẻ đã có sẵn dòng đó — người dùng phải tự tìm hoặc gõ lại thay vì được đưa sẵn.
  file: `commands/acceptance-card.md`
  severity: medium
  Đề xuất: known-limits

- **`catch {}` nuốt dòng run-log hỏng JSON — script vẫn exit 0 với «AC-7 OK … (bo qua N dong hong)», nên dòng eval bị cắt/hỏng không phân biệt được với pass sạch qua mã thoát**
  Người dùng thấy gì: Nếu tệp lịch sử chạy máy-giữ bị hỏng hoặc ghi dở giữa chừng, bước kiểm bằng chứng vẫn có thể báo "đạt" và cho qua cổng dù một dòng ghi nhận đã âm thầm mất, khiến người ký không biết bằng chứng thật ra đã thiếu.
  file: `tests/scripts/run-log-minted.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — E4/E5/E6 ghim tên ca KHÔNG tồn tại trong suite; pin duy nhất có sức phân biệt không bám được vào stdout**
  Người dùng thấy gì: Một số phép kiểm tự động cho phần sửa văn bản hướng dẫn có thể báo "đạt" mà không thực sự khớp đúng vào kết quả kiểm tra cụ thể tương ứng, nên dấu xanh ở bước này chưa chắc chắn xác nhận đúng nội dung đã sửa.
  file: `_acceptance/vu-trang-goal-luc-goi-ten/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture run-log viết tay luôn có `sha`; nhánh KHÔNG-sha mà bên viết cho phép chưa từng đi qua bộ đọc, phép «cùng round cùng sha» đúng-rỗng ở nhánh đó**
  Người dùng thấy gì: Một nhánh hiếm khi tệp lịch sử chạy không kèm mã định danh phiên bản chưa từng được kiểm thử — nếu nhánh đó xảy ra thật, phép kiểm có thể bỏ qua mà không báo, nhưng đây là phần cùng nhóm với một giới hạn đã được ghi nhận trước, chưa xác nhận là sai lệch tồn tại trong thực tế.
  file: `tests/scripts/run-log-minted.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **Hình dạng 3 — neo vị trí (VI_TRI) chỉ phủ 9 vế SKILL; 3 vế GUIDE vẫn tìm trên TOÀN file dù AC-5 Given «GUIDE mục /goal» — sửa #8 mới nửa lớp** (`tests/plugins/run-tests.sh:1487`, severity low, nguồn measurement) — `VI_TRI` (1487-1489) chỉ có khoá cho các vế `which == "skill"`; vòng 1471-1473 assert `needle in TXT[which]` trên trọn GUIDE.md cho «**Làn V T2 không chạm UI:**», «**Brainstorm không hỏi gì**», «ba bản được test P85 giữ khớp» (chỉ `khi_nao` dòng 1494 có cắt đoạn). AC-5: «Given GUIDE mục `/goal` sau sửa, When đọc đoạn «Khi nào», Then … câu «làn V T2…» và câu «brainstorm không hỏi gì → chưa phủ»» — quan hệ VỊ TRÍ được hứa cho GUIDE y như AC-4 cho SKILL. Sổ cái #8 sửa đúng hình dạng này nhưng chỉ cho SKILL (S1 · GATE 1 · S2 · bất biến dừng); CLAUDE.md đòi sửa theo LỚP. Hôm nay ba câu đều nằm trong `## Chạy không-người-trông đoạn máy với /goal` (GUIDE.md:296–343; dòng 303, 312) nên chưa có xanh-giả sống; dời câu sang mục khác vẫn xanh. Sửa: `sec(guide, "## Chạy không-người-trông đoạn máy với /goal", "## Model theo giai đoạn")` rồi thêm 3 khoá GUIDE vào VI_TRI.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
