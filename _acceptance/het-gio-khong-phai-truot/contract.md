---
schema_version: 1
feature: Verifier bị công cụ giết ≠ suite fail — luật timeout trong prompt 3 lane, field killedByTool, routing ép về BLOCKED thay vì REJECT giả
slug: het-gio-khong-phai-truot
owner: manh.phan@onemount.com
risk_tier: T2
surfaces: [cli]
status: implemented
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

### AC-7 — Tương thích ngược từng bit
Given kết quả verifier KHÔNG có field `killedByTool` (agent cũ / flow cũ),
When workflow xử lý,
Then hành vi y nguyên: exit 1 thường → REJECT, cannotRun=true → BLOCKED, suite
tồn kho `tests/workflows` xanh nguyên KHÔNG sửa case cũ nào — vế «không sửa»
có phép đo riêng phủ MỌI khuôn đặt tên của bản diffBase (`git show`, đếm nguồn,
không hardcode): tên nháy đơn assert nguyên văn + dòng `PASS: <tên>` khớp trọn
dòng; tên template literal assert thân template nguyên văn; và một đẳng thức
đóng không gian «tổng callsite = nháy đơn + backtick» để khuôn thứ ba chưa phủ
thì ĐỎ (kèm tự-phá-thử chạy cùng lượt).

## Coverage

Trục quét (Zwicky test-matrix, design doc §Quét không gian): **lane chạy lệnh
dài** (machine · ui-check · baseline — thước CE: grep mọi `agentT` có lệnh
Bash trong prompt, 3/3 lane phủ bởi AC-1/2/3) × **phòng tuyến** (phòng ngừa ·
nhận diện · routing-JS — AC-1..4 phủ hai lớp đầu, AC-5/6 phủ lớp routing) ×
**kết cục** (BLOCKED · REJECT · n-a — AC-5/6/7 ghim đủ ba). Lane judge/triage/
refute/provenance/synthesize không chạy lệnh dài → ngoài không gian (thước:
cùng grep). Ma trận đo trong test phải toàn phần: 3 lane × chứa-rule + 3 lane
× schema + **3 mutant cô lập lớp (một mutant mỗi lane)** (W25) + routing 2
chiều × 2 nhánh reason trên cùng fixture (W26) + 2 chiều baseline (W27) +
chân tồn-kho đếm-nguồn cho AC-7 (E8).

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

Known limits (điền ở Gate 2 nếu có).
