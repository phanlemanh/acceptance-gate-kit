---
schema_version: 2
feature: "judgment-question-guard — acceptance-verify.js DỪNG fail-closed khi eval thiếu field mà prompt fan-out phụ thuộc (question/expected/steps/cmd/id/criterion/executor); judgment thiếu inputs hạ về UNCERTAIN cơ học thay vì chấm mù"
slug: judgment-question-guard
risk_tier: T3
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-04T12:30:00Z
human_signoff: Manh Phan 2026-08-04
owner: omre.cnsp4@onemount.com
source: docs/superpowers/specs/2026-08-04-judgment-question-guard-design.md
time_human_minutes:
  gate1: 10
  gate2: 10
---

# Acceptance contract — judgment-question-guard

Bối cảnh: S4 của `motion-floor` (T2) đo được — eval `executor: judgment` thiếu
`question` thì `acceptance-verify.js:346` nối chuỗi thẳng, hội đồng nhận literal
`"undefined"` làm câu hỏi, và round 2 panel E6 trả PASS 3/3 vào
`evidence-report.md`. Ở T2 routing `:655` không đẩy panel-toàn-PASS về người,
nên một tiêu chí được tuyên ĐẠT mà chưa ai từng đặt câu hỏi.

Quét lớp tìm ra cơ chế thứ hai, đã đo bằng harness: eval có `executor` sai
chính tả hoặc vắng thì không khớp bộ lọc nào ở `:243-245`, bị bỏ rơi im lặng, và
run trả về `verdict = PASS` với `blocked = []`, `failedEvals = []`.

Guard kiểm `args.evals` NGUYÊN BỘ, trước mọi lọc carried và trước `dryRun` —
soi eval "tươi" thôi là tự mở lại đúng cửa vừa đóng.

## Criteria

- AC-1: Given eval `executor: judgment` mà `question` ở một trong 5 hình dạng
  hỏng (khoá vắng · `null` · chuỗi rỗng · chỉ khoảng trắng · không phải chuỗi),
  When chạy acceptance-verify, Then trả `verdict: BLOCKED` với 0 agent judge
  được spawn, và `blocked[].reason` nêu ĐÍCH DANH id của eval đó cùng tên field
  `question`; VÀ đối tượng trả về có ĐỦ key đúng kiểu của shape guard args hiện
  hành (`blocked[]` · `failedEvals[]` · `failedCommands[]` · `panels[]` ·
  `confirmedFindings[]` · `reviewIncomplete[]`) — downstream đọc các key đó để
  định tuyến, trả gọn `{verdict, blocked}` là vỡ ở lớp tiêu thụ chứ không vỡ ở
  đây; đối chứng dương: CÙNG bộ args chỉ khác `question` là chuỗi thật → chạy
  bình thường, spawn đủ 3 judge, verdict KHÔNG phải BLOCKED.

- AC-2: Given eval `executor: ui-check` thiếu `expected` (năm hình dạng hỏng
  giống AC-1), hoặc `steps` rỗng/không phải mảng/mảng có phần tử không phải chuỗi,
  When chạy, Then BLOCKED nêu tên eval + field; đối chứng dương: bản đủ
  `steps` + `expected` chạy bình thường và spawn agent `ui:<id>`.

- AC-3: Given eval `executor: test`/`script` thiếu `cmd`, hoặc eval bất kỳ
  thiếu `id` hoặc `criterion`, When chạy, Then BLOCKED nêu tên eval (eval
  thiếu `id` thì nêu vị trí index) + field; đối chứng dương: bản đủ field chạy
  bình thường.

- AC-4: Given eval có `executor` vắng hoặc không thuộc `{test, script,
  ui-check, judgment}` (vd typo `judgement`), When chạy, Then BLOCKED nêu tên
  eval + giá trị executor lạ — KHÔNG còn bị bỏ rơi im lặng; đối chứng đột
  biến ĐINH: bản HÔM NAY của script trên cùng args đó trả `verdict: PASS` với
  `blocked` rỗng, và ca đo phải chứng minh được sự đảo chiều đó.

- AC-5: Given judgment eval hỏng khuôn (AC-1) mà round này có `carriedPanels`
  trỏ đúng eval đó (kịch bản E6 motion-floor: panel PASS 3/3 giả carry sang
  round sau), When chạy, Then vẫn BLOCKED — panel carried KHÔNG miễn kiểm; đối
  chứng dương: cùng args với `question` hợp lệ → panel carried được dùng lại
  bình thường, 0 judge spawn.

- AC-6: Given eval máy/ui hỏng khuôn mà round này có `carriedEvals` trỏ đúng
  eval đó, When chạy, Then vẫn BLOCKED — carry-forward P1 KHÔNG miễn kiểm; đối
  chứng dương: cùng args với field đủ → eval được carry bình thường, không
  spawn agent cho nó.

- AC-7: Given `dryRun: true` và bộ evals có eval hỏng khuôn, When chạy, Then
  trả BLOCKED chứ KHÔNG trả kế hoạch fan-out (`distinctCommands`/`judgePanels`
  vắng); đối chứng dương: `dryRun: true` với evals hợp lệ vẫn trả kế hoạch đầy
  đủ như trước và spawn 0 agent.

- AC-8: Given nhiều eval hỏng ở nhiều field và nhiều executor khác nhau trong
  cùng một lần chạy, When chạy, Then TẬP id nêu trong reason — trích theo ranh
  giới token, KHÔNG bằng substring — BẰNG ĐÚNG tập id đã tiêm hỏng, và tập tên
  field nêu ra bằng đúng tập field đã tiêm; người sửa `evals.yaml` một lượt,
  không phải sửa-chạy-lại N vòng. Ca đo CỐ Ý dùng cặp id lồng tiền tố (`E1` và
  `E11`) để phép đo tự chứng minh nó phân biệt được: đếm bằng substring sẽ thấy
  "E1" khớp bên trong "E11" và cho 2 == 2 dù guard chỉ nêu một cái.

- AC-9: Given judgment eval có `question` hợp lệ nhưng `inputs` vắng hoặc là
  mảng rỗng, When chạy, Then KHÔNG spawn judge nào cho eval đó, panel của nó
  có `proposal: UNCERTAIN` với rationale nêu rõ "không khai input", và verdict
  tổng là PENDING-JUDGMENT (người quyết ở Cổng 2) — KHÔNG phải BLOCKED, để
  workspace đã ký như `gate-card-ac-visibility` còn đường đọc-cũ; đối chứng
  phân biệt: `inputs` sai kiểu (không phải mảng, hoặc mảng chứa phần tử không
  phải chuỗi) thì vẫn BLOCKED, không rơi vào nhánh UNCERTAIN.

- AC-10: (judgment) Đọc prompt hội đồng THẬT do script sinh (xem AC-15 cho
  phép đo bảo đảm file này là bản dump chính danh): một hội đồng viên đọc xong
  có hiểu rằng mình CHỈ được đọc các input đã liệt kê, và khi cần thứ ngoài
  danh sách thì việc đúng là trả UNCERTAIN chứ không phải tự đi tìm file khác
  để tự cứu, không? Hay câu chữ vẫn để ngỏ đường tự cứu như lens round 3 của
  motion-floor đã làm với `contract.md`?

- AC-11: Given bộ args hợp lệ đầy đủ có cả 4 executor (test, script, ui-check,
  judgment) cùng chạy, When chạy, Then hành vi giống hệt bản trước guard:
  đúng số agent mỗi loại, đúng dedupe lệnh, đúng verdict, `blocked` rỗng —
  guard KHÔNG chặn oan trường hợp bình thường; và eval thiếu các field OPTIONAL
  (`runs`, `ref`, `paths`, `evidence_required`) vẫn chạy bình thường.

- AC-12: Given toàn bộ suite hiện hành (scripts/hooks/plugins/workflows) và
  cổng chống trôi mirror, When chạy sau thay đổi, Then tất cả xanh — 4 case cũ
  đang dùng `inputs: []` (`acceptance-verify.test.mjs` dòng 190, 252, 336, 337)
  phải được cập nhật cho khớp hành vi mới ở AC-9 chứ không bị nới thước, và
  `plugins/` mirror khớp nguồn.

- AC-13: Given judgment eval `question` hợp lệ nhưng `inputs` vắng/rỗng (nhánh
  UNCERTAIN của AC-9), When chạy với (a) `carriedPanels` trỏ đúng eval đó và
  (b) `dryRun: true`, Then nhánh UNCERTAIN vẫn thắng ở CẢ HAI đường: panel cuối
  cùng của eval đó là `proposal: UNCERTAIN` (panel carried KHÔNG ghi đè được),
  0 judge spawn, và kế hoạch dryRun KHÔNG liệt eval đó vào `judgePanels`; đối
  chứng dương: cùng args nhưng `inputs` có phần tử thật → panel carried được
  dùng lại nguyên vẹn với proposal gốc của nó. Không có AC này thì lối cài
  tự nhiên nhất ("đã có panel carried rồi thì bỏ qua vòng chèn UNCERTAIN") làm
  panel PASS 3/3 giả carry vô hạn — đúng kịch bản E6 motion-floor.

- AC-14: Given TẤT CẢ `_acceptance/*/evals.yaml` đang có thật trong repo (đọc
  file thật, KHÔNG dựng fixture), When cho từng eval đi qua ĐÚNG bảng field bắt
  buộc của guard — bảng rút từ marker trong `acceptance-verify.js`, không chép
  tay sang test — Then 0 eval rơi vào nhánh BLOCKED, và mọi eval rơi vào nhánh
  UNCERTAIN phải nằm trong danh sách miễn trừ khai đích danh ở Notes (đo tại
  S1: đúng 2 ca — `gate-card-ac-visibility` E11 và E12); đối chứng đột biến:
  tiêm một field rỗng vào BẢN SAO của một evals.yaml sinh trong chính lần chạy
  → phép đo phải đỏ và nêu đúng slug + id + field.

- AC-15: Given `evidence/judge-prompt.txt` bị xoá trước khi chạy, When chạy
  script qua harness, Then file được sinh lại trong chính lần chạy đó và nội
  dung BẰNG ĐÚNG prompt của agent nhãn `judge:` trong lần chạy đó (có chứa id
  eval + danh sách inputs của lần chạy) — fixture của hội đồng AC-10 là bản
  dump chính danh, không phải văn viết tay; đối chứng đột biến: đổi chuỗi prompt
  trong bản sao script sinh bằng code → nội dung dump phải đổi theo.

## Coverage

Quét hình thái 4 trục (chi tiết + nhãn nguồn trong design doc):

- **Trục A — executor**: `machine{test,script}` | `ui-check` | `judgment` |
  `không-khớp-bộ-nào` [SP]. Giá trị thứ 4 là cơ chế B, bỏ nó là bỏ nửa lỗ.
- **Trục B — field bắt buộc**: phổ quát `id`/`criterion`/`executor`; machine
  `cmd`; ui-check `steps`/`expected`; judgment `question`/`inputs`. [SP]
- **Trục C — hình dạng vắng**: khoá thiếu | `null` | chuỗi rỗng | chỉ khoảng
  trắng | sai kiểu | mảng rỗng | mảng có phần tử không phải chuỗi.
  [CE: ngành JSON Schema draft 2020-12 — `required` / `type` / `minLength`
  `minItems` là ba từ khoá riêng vì đó là ba kiểu hỏng riêng]
- **Trục D — đường vào**: fan-out tươi | `dryRun` | eval carried P1 | panel
  carried P3. [SP] Trục cửa hậu — cùng eval hỏng, khác đường code; đây là trục
  quyết định vị trí đặt guard (AC-5/6/7).

Thước CE nội bộ: lịch sử lỗi của chính kit — motion-floor r1-r2 (đo được) và
gate-card-ac-visibility (ca thoát nhờ T3, không nhờ guard).

Không gian đầy đủ ≈ 220 ô, không cắt bằng pairwise (preset dành full matrix cho
luồng tiền/pháp lý; đây là lõi cưỡng chế = tương đương luồng tiền của kit). Cắt
bằng **một luật đồng nhất phủ cả 220 ô** (một bảng khai báo, một vòng kiểm),
rồi chọn ca đo phủ: mọi ô trục D + mỗi hình dạng trục C ≥1 lần + đối chứng dương.

## Out of scope

- `scripts/eval-coverage-lint.js` — cố ý miễn trừ AC judgment và không đọc
  `question`/`inputs`; nó là opt-in per-repo (không có trong `suite_keys` của
  chính kit) nên không chịu lực được. Guard S4 phủ mọi repo tiêu thụ bất kể có
  chạy lint hay không. Một cơ chế chịu lực, một chỗ.
- Field `ref` — không nội suy vào prompt fan-out; hook L2 đã chặn fail-closed
  report có `verifier:` không phải `config:` ref hay script path. Khác cơ chế,
  đã đóng.
- `risk_tiers.t3_paths` trong `_acceptance/config.yaml` — xem Notes.
- Không đổi routing verdict, carry-forward, hay schema `evals.yaml`.

## Notes

### Quyết định Cổng 2 — 2026-08-04, Manh Phan

- **Thời gian người, ghi đủ:** Cổng 1 = 10 phút · **Cổng 1.5 = 10 phút** · Cổng 2
  = 10 phút. Tổng 30 phút cho một thay đổi T3 chạm lõi cưỡng chế. Lược đồ
  `time_human_minutes` CHỈ có khoá `gate1`/`gate2` nên 10 phút của Cổng 1.5 ghi
  ở đây thay vì trong frontmatter — cộng nó vào `gate1` sẽ báo sai một điểm
  dừng thành hai. Mọi feature T3 đều có Cổng 1.5, nên đây là lỗ nhỏ của lược đồ.

- **VIỆC RIÊNG (chưa làm, quyết ở Cổng 2):** bảng field bắt buộc chặn đúng bộ
  eval thiết kế mà chính kit hướng dẫn viết. `skills/acceptance/SKILL.md` rule
  2b (mặc định bật cho mọi surface web-UI) + `references/design-ui-check.md`
  kê ba eval KHÔNG có `criterion`, bản `ui-check` KHÔNG có `expected` lẫn
  `steps`. Reviewer S4-r3 dựng lại nguyên văn ba eval đó qua harness thật →
  `BLOCKED`, nêu tên cả ba. Hệ quả: repo tiêu thụ có surface web-UI sẽ BLOCKED
  MỌI round, không tự khỏi, không có đường đọc-cũ. Gốc rễ: `criterion` bị đòi
  cho `test`/`script` NGOÀI nguyên tắc đã khai của chính bảng ("field mà prompt
  fan-out nội suy thẳng vào") — prompt máy không hề nội suy `criterion`. Sửa
  đúng nghĩa phải quyết hai việc (`criterion` có bắt buộc thật không · tài liệu
  design-ui-check có phải đổi không) nên nó là một hợp đồng riêng, không phải
  một bản vá. **Chưa mở workspace — việc kế tiếp.**
- **Known limit 1:** bản "trước guard" của đối chứng đột biến W-G6b là chương
  trình hỏng (regex gỡ trọn khối marker nên mất `isUngroundedInputs` mà dòng
  dùng nó vẫn còn). Hôm nay xanh vì eval tiêm cố ý sai chính tả `executor` nên
  nhánh đó không chạy; ai mở rộng W-G6b sang ca judgment hợp lệ sẽ nhận
  `ReferenceError`. Không ảnh hưởng hành vi cổng ở trạng thái hiện tại.
- **Known limit 2:** thông điệp "không có gì để verify" ưu tiên nhánh
  carry-forward, nên khi một round vừa có carry-forward vừa có judgment không
  khai `inputs` thì phần thứ hai bị im lặng bỏ qua trong thông điệp.
- **Known limit 3 (từ S4-r2, đã ghi):** phép đo tồn kho chưa từng gặp một eval
  `ui-check` thật — kho này có 0 cái, nên nhánh ràng buộc nặng nhất của bảng
  chưa chạm dữ liệu do người viết. Đây là điểm mù "đo ở phía tiêu thụ" và nó
  chính là lý do lỗ VIỆC RIÊNG ở trên lọt qua tới tận vòng 3.

### Đo tại S1

- **Danh sách miễn trừ của AC-14 (đo tại S1, không phải giả định).** Cho toàn
  bộ 18 workspace hiện có đi qua bảng field bắt buộc: **0 eval rơi vào nhánh
  BLOCKED**. Đúng **2 eval** rơi vào nhánh UNCERTAIN, khai đích danh ở đây:
  `gate-card-ac-visibility/E11` và `gate-card-ac-visibility/E12` — hai judgment
  eval không khai `inputs`, workspace đã ký. Cả hai vốn đã là UNCERTAIN +
  `human_override` trên trang bằng chứng của nó (T3 đẩy mọi judgment item về
  người), nên guard KHÔNG đổi kết cục của workspace đó — chỉ làm điều đã đúng
  trở nên cơ học thay vì may nhờ hạng rủi ro. Phơi nhiễm thật của bản vá = 0.
- **Known issue trình Cổng 1 (không sửa ở đây):** `feature-loop/workflows/**`
  KHÔNG nằm trong `risk_tiers.t3_paths`, nên máy derive feature này ra T2
  (owner khai T3, tôi theo T3). Nhưng lý do `t3_paths` tồn tại — comment ngay
  trên nó khai rằng lỗi ở đó biến thành false-green im lặng trên MỌI repo tiêu
  thụ — mô tả
  `acceptance-verify.js` chính xác hơn mô tả phần lớn thứ đang trong danh sách,
  và chính feature này là bằng chứng. Sửa danh sách là quyết định chính sách
  cổng, thuộc người, không gộp vào diff cơ chế.
- Sửa `feature-loop/workflows/` sẽ stale-cascade toàn bộ workspace cũ của repo
  self-host này (tiền lệ xử lý: commit f1287bb). Tính ở S5.
