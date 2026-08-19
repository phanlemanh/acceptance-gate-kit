---
schema_version: 1
feature: Verifier bị công cụ giết ≠ suite fail — luật timeout trong prompt 3 lane, field killedByTool, routing ép về BLOCKED thay vì REJECT giả
slug: het-gio-khong-phai-truot
owner: manh.phan@onemount.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: ""
approved_at: ""
veto_state: mo
veto_opened_at: 2026-08-18T08:17:17Z
---

# Acceptance Contract: het-gio-khong-phai-truot

## Context

Vấp thật hồ sơ release-2-2-0 S4 vòng 5 (18/08): verifier máy chạy
`bash tests/plugins/run-tests.sh` không truyền `timeout` cho Bash; dưới tải 4
suite song song lệnh vượt trần mặc định ~120 s → công cụ giết ở 118 s, tool
result «Error: Exit code 1» + output cắt ở 10 000 ký tự, không dòng FAIL nào;
verifier khai `exitCode=1, cannotRun=false` → workflow REJECT giả 4 eval. Vòng
4 cùng lệnh truyền `timeout: 600000` → xanh. Lớp lỗi: hạ tầng mạo danh vật —
exit code của CÔNG CỤ bị đọc như exit code của LỆNH.

Vật: `feature-loop/workflows/acceptance-verify.js` (prompt machine ~422, prompt
ui ~430, prompt baseline ~474, schema, verdict routing). Phép đo:
`tests/workflows/acceptance-verify.test.mjs`. Design:
`docs/superpowers/specs/2026-08-18-het-gio-khong-phai-truot-design.md`.

## Criteria

### AC-1 — Luật một nguồn trong marker, prompt machine chứa nó
Given acceptance-verify.js có khối marker `TOOL-KILL-RULE` chứa luật «đặt
timeout ≥ 600000 ms cho lệnh suite» + «lệnh bị công cụ dừng (timeout tool /
output cắt) → KHÔNG phải exit code thật → cannotRun=true + killedByTool=true +
reason khuôn "bi cong cu giet o <so giay> giay"»,
When workflow build prompt cho verifier máy,
Then prompt chứa NGUYÊN VĂN khối luật rút từ marker (một nguồn, không chép tay).

### AC-2 — Prompt verifier UI chứa cùng luật
Given cùng marker,
When workflow build prompt cho verifier ui-check,
Then prompt chứa nguyên văn cùng khối luật.

### AC-3 — Prompt baseline chứa cùng luật
Given cùng marker,
When workflow build prompt cho agent baseline,
Then prompt chứa nguyên văn cùng khối luật (baseline khai `cannotRun=true` +
`killedByTool=true` khi bị giết — xem AC-4).

### AC-4 — Schema khai killedByTool ở CẢ BA lane
Given MACHINE_SCHEMA, UI_SCHEMA và item của BASELINE_SCHEMA.results,
When verifier trả StructuredOutput,
Then cả ba nơi có field optional `killedByTool` (boolean) với description
nói rõ «lệnh bị CÔNG CỤ dừng — exit code không phải của lệnh»; field không
thuộc `required` (tương thích ngược). Ba lane cùng field cấu trúc — không
lane nào cần fixture tự chế field ngoài schema.

### AC-5 — Routing: killedByTool ⇒ BLOCKED, không bao giờ REJECT
Given kết quả machine hoặc ui có `killedByTool=true` — KỂ CẢ khi agent khai
`cannotRun=false` và `exitCode=1` (đúng hình dạng sự cố),
When workflow gộp kết quả và tính verdict,
Then lệnh đó vào `blocked` với reason chứa «bi cong cu giet», verdict round là
BLOCKED, eval của lệnh KHÔNG xuất hiện trong `failedEvals`/`failedCommands`.
Hai nhánh reason đo RIÊNG từng nhánh: agent có reason → giữ NGUYÊN VĂN;
reason trống → JS điền đúng khuôn ghim.

### AC-6 — Baseline bị giết → n-a, không red giả
Given kết quả baseline có `killedByTool=true` (hoặc `cannotRun=true`),
When tính `baselineStatus`,
Then status là `n-a` — không được đọc thành `red` (phân biệt giả) hay `green`;
đối chứng: baseline exit 1 thật vẫn là `red`.

### AC-7 — Tương thích ngược
Given kết quả verifier KHÔNG có field `killedByTool` (agent cũ / flow cũ),
When workflow xử lý,
Then hành vi y nguyên: exit 1 thường → REJECT, cannotRun=true → BLOCKED, và
suite tồn kho `tests/workflows` chạy THẬT (mã thoát 0 + dòng tổng kết
`Results: N passed, 0 failed`) với đủ 18 dòng ca của hồ sơ này khớp trọn dòng.
Vế «không một case cũ nào bị sửa» KHÔNG còn là lời hứa máy đo — xem Known
limits: chốt cho vế đó là người đọc diff PR.

## Coverage

Trục quét (Zwicky test-matrix, design doc §Quét không gian): **lane chạy lệnh
dài** (machine · ui-check · baseline — thước CE: grep mọi `agentT` có lệnh
Bash trong prompt, 3/3 lane phủ bởi AC-1/2/3) × **phòng tuyến** (phòng ngừa ·
nhận diện · routing-JS — AC-1..4 phủ hai lớp đầu, AC-5/6 phủ lớp routing) ×
**kết cục** (BLOCKED · REJECT · n-a — AC-5/6/7 ghim đủ ba). Lane judge/triage/
refute/provenance/synthesize không chạy lệnh dài → ngoài không gian (thước:
cùng grep). Ma trận đo trong test phải toàn phần và **ma trận lane của routing
bằng ma trận lane của prompt**: 3 lane × chứa-rule + 3 lane × schema + 3 mutant
cô lập lớp, một mutant mỗi lane (W25) · routing 2 lane (machine, ui) × 2 chiều
(bị-giết, exit-thật) + 2 nhánh reason trên cùng fixture (W26) · lane baseline 2
chiều (W27) · răng hồ sơ ghim mã thoát + dòng tổng kết + 18 dòng ca (E1–E6),
ba chiều đỏ đã chạy thật (đổi tên ca · một ca đỏ · suite chết). Bài học r2:
thiếu một lane trong ma trận routing thì gỡ phòng thủ lane đó vẫn 100% xanh.
Bài học r3 (owner gật thu phạm vi 18/08): chân tồn-kho «không sửa case cũ» đã
GỠ cùng eval E8 — nó là chốt cưỡng chế cần chốt cho chính nó, ba vòng liền đẻ
lỗ cùng họ; vế đó nay là Known limit 1.

## Out of scope

- Lane executor của `execute-parallel.js` (S3) — không sinh verdict cổng,
  fail đã có đường tự-fix tuần tự; mở hồ sơ riêng nếu vấp thật.
- Heuristic JS đọc nội dung `outputTail` (grep «Results»/«FAIL») để đoán
  tool-kill — chuỗi tổng kết là của suite từng repo; engine không chứa
  consumer-specific (bất biến «kit là engine»).
- Nâng trần timeout/giới hạn output của harness Claude Code — vật ngoài kit.
- Retry tự động lệnh bị giết — BLOCKED sẵn có nghĩa «khắc phục rồi chạy lại
  cùng round», thêm retry trong workflow là giấu tín hiệu hạ tầng.

## Notes

Known limits:

1. **«Không case cũ nào bị sửa» không có thước máy.** Ba vòng S4 liên tiếp,
   mọi biến thể của chân tồn-kho (liệt kê theo khuôn cú pháp → đẳng thức số ca
   neo `origin/main` → mutant tự dựng) đều đẻ một lỗ cùng họ: hoặc đo tập con,
   hoặc xanh cả khi phép đo chưa từng chạy, hoặc tự chết ngay sau merge vì mốc
   di động. Owner chốt 18/08: **gỡ**, theo bài học đã ghi trong kit — chốt
   cưỡng chế mà cần chốt cho chính nó thì bỏ. Còn lại: suite phải chạy thật và
   xanh, 18 ca của hồ sơ phải có mặt; ai xoá một ca cũ thì răng KHÔNG bắt —
   chốt là người đọc diff PR (diff của hồ sơ này chỉ THÊM ca, không sửa ca cũ).
2. **Bên VIẾT của `killedByTool` chưa có bộ đo hành vi.** Đường sống là
   prompt → verifier tự khai → routing; chỉ mắt xích routing có răng máy.
   Nếu chữ trong luật không đổi được hành vi verifier (hoặc model đổi làm xói
   mòn nó), mọi eval vẫn xanh. Bằng chứng vận hành thay thế trong vòng này: ba
   vòng verify chạy `tests/plugins/run-tests.sh` dưới tải song song, không lần
   nào bị công cụ giết (trước đó vòng 5 của release-2-2-0 bị giết ở 118 s).
   Bộ đo hội đồng phiên sạch cho lời hứa hành vi là hồ sơ riêng nếu vấp lại.
3. **Chuẩn hoá dấu-bị-ngắt nằm ở ba chỗ đọc, chưa gom về một biên.** Thêm một
   nơi đọc kết quả kiểm mà quên xử lý dấu đó thì lỗi từ-chối-oan tái diễn ở nơi
   mới, và bộ kiểm hiện tại không thấy (`normKill` gọi rời tại ba consumer trong
   `feature-loop/workflows/acceptance-verify.js`).
4. **Danh sách nhánh chạy lệnh dài là danh sách viết cứng trong bài kiểm.** Bài
   kiểm đếm đúng ba lượt gắn luật; thêm nhánh thứ tư mà quên gắn thì không phép
   đo nào kêu.
5. **Phép rút luật từ mốc trong mã cắt tại ký tự backtick đầu tiên.** Hôm nay
   luật không chứa ký tự đó nên phép đo đủ răng; ngày ai viết lại luật có
   backtick, phần sau bị bỏ sót âm thầm.
6. **Hai chỗ trong hồ sơ mô tả lệch cây hiện tại:** ô P1 của bản phản biện còn
   khai biện pháp máy đã gỡ, và mô tả bài kiểm E1 còn nhắc một lượt tự-phá-thử
   không còn chạy. Chữ trong hồ sơ, không phải hành vi sản phẩm — sửa ở vòng
   chạm hồ sơ này lần tới.
7. **Đường kiểm tra chạy độc lập chưa được vá cùng lượt** — đã tách thành việc
   riêng, hạt giống ở `docs/plans/2026-08-18-hat-giong-tool-kill-duong-doc-lap.md`.
