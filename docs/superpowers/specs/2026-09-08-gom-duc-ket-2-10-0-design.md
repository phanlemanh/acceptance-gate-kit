# Gom đúc kết 08/09 thành một vòng T3 trước mốc 2.10.0 — thiết kế

Ngày 08/09/2026. Đầu vào duy nhất: đúc kết bản 3 (F1–F8, N/K/C), tổng kết số đo §1–§9, CLAUDE.md.
Owner gọi tên tối 08/09: «Gom hết cả K3–K8, tạo lại chip» — một vòng meta duy nhất trước mốc,
đúng luật (b). Vòng này đồng thời là chỗ ĐO nếp N1–N7 (mốc cùng hạng T3: 55,6M / 3,25 round).

## Vì sao một hợp đồng, không tách

K4 chạm `lib/evidence-core.cjs` + `scripts/pre-merge-check.sh` (t3_paths) nên cả gói là T3.
Tách thành nhiều hợp đồng T2 = nhiều Cổng Phạm vi + nhiều Cổng Bằng chứng = nhiều lượt gọi
người cho cùng một quyết định («kit đúng north star»). Một hợp đồng, một Gate 1.5, chia S3 theo
nhóm để mỗi nhóm có commit + eval riêng — lỗi ở nhóm nào không kéo nhóm khác vào round.

## Chín nhóm — vật giao, chỗ chạm, chiều đỏ

| Nhóm | Vật giao (hành vi) | Chỗ chạm | Chiều đỏ có sẵn |
|---|---|---|---|
| C1-đo | LNT1 ghim dấu hiệu bản sao mutant ĐÃ CHẠY (gate-card bản sao trả `token_la` chứa `web`); LNT6 (iv)(vi) đo QUAN HỆ: cặp alias rút từ CONTEXT.md == `SURFACE_ALIAS` của lib; đoạn 3b acceptance-init: câu nhắc `@playwright/cli` nằm cùng đoạn với `capture.ui` và lệnh ba dòng chứa `playwright-cli` | `tests/plugins/lop-nhin-thay.test.mjs` | bản test cũ pass trên baseline — eval ghim CỤM CHỮ mới của thông điệp PASS |
| C1-nhỏ | (a) gỡ `LNT_AVAILABLE`; (b) NOTE pre-merge tách ba nguyên nhân (thiếu node · thiếu lib · lib exit N); (c) MỘT hàm cắt chú thích YAML `stripComment` trong `lib/eval-yaml.cjs`, ba bộ đọc surfaces (lib lop-nhin-thay · lint · gate-card) dùng chung; (d) `html()` trong ca kiểm bỏ mã thoát ANSI; (e) chiều đỏ có sẵn của LNT1 neo mốc cố định `BASE-LNT` thay `main` | `lib/nguong-o-co-hoi.cjs`, `scripts/pre-merge-check.sh`, `lib/eval-yaml.cjs`, `lib/lop-nhin-thay.cjs`, `scripts/eval-coverage-lint.js`, `scripts/gate-card.js`, test | file test mới vắng trên baseline |
| K1 | agent `capture:provenance` chết → workflow TRẢ VỀ verdict BLOCKED với `blocked[].reason` = `capture:provenance agent bi skip/chet — khong co ket qua, khong duoc tinh la pass`, không ném TypeError | `feature-loop/workflows/acceptance-verify.js:1022-1044` | W37 trên bản cũ: harness ghi nhận throw |
| K2 | khối `IDENTITY-ECHO-RULE` (nguồn + 2 bản chép byte-đúng): suy xong → GHI THẲNG ở MỌI ca có ≥1 nguồn, một dòng «với danh tính: <tên> <ngày> (từ <nguồn>)», người sửa bằng một câu bất kỳ lúc nào sau; chỉ CẠN mới hỏi; bỏ CẢNH BÁO «không có trong `signoff.approvers`»; nấc mới: tên ở cổng trước của cùng hồ sơ (`approved_by`) thắng git config khi tác giả commit ghi `approved_by` == `git user.name` hiện tại; không chiến dịch sửa config/hồ sơ | `skills/acceptance/references/human-facing-language.md`, `commands/approve.md`, `commands/signoff.md`, neo P191/P194 trong `tests/plugins/run-tests.sh` | mutant tiêm «— Enter xác nhận» / «CẢNH BÁO … approvers» vào bản sao → checker đỏ đích danh |
| K3 | W6 chỉ quét `## Criteria`; định danh gạch nối (`ui-check`, `pre-merge`) là một từ — `-` vào lớp ký tự từ; `_Allow_` cho từ đa nghĩa trong CONTEXT.md (thẻ · hook · engine · test · check · tag); W8 BỎ nhánh token-lạ (giữ nghĩa vụ + lạc chỗ); một dòng `revisit` vào sổ `lop-bang-chung-nhin-thay` (không sửa file khác của hồ sơ đã ký) | `lib/context-glossary.js`, `scripts/eval-coverage-lint.js`, `CONTEXT.md`, `tests/scripts/run-tests.sh` (L47 gỡ, L42m viết lại) | số dòng trên ba cây thật: kit W6 127 → ≤10; AP W8-token 140 → 0 (nghĩa vụ giữ 16); oneflow 15 → 0 (2); crm 4 → 0 (9) |
| K4 | stale theo `paths:`: hồ sơ mà MỌI eval máy/ui (test · script · ui-check) khai `paths` → file đổi sau `verified_commit` chỉ làm hồ sơ hoá cũ khi khớp ∪paths (ngoài `_acceptance/`, ngoài t1); một eval thiếu `paths` → luật cũ (cả cây) — đường đọc-cũ; thiếu node/lib → luật cũ (chặt hơn, không fail-open). Vật: `staleScope(evalsText)` + CLI trong `lib/evidence-core.cjs`, `pathsOf` (inline + block) trong `lib/eval-yaml.cjs`, `pre-merge-check.sh` gọi qua node; câu Staleness guard của SKILL feature-loop nói cùng luật | `lib/evidence-core.cjs`, `lib/eval-yaml.cjs`, `scripts/pre-merge-check.sh`, SKILL | fixture git: đổi `tests/x.sh` ngoài paths → bản cũ VIOLATION, bản mới sạch; đổi file trong paths → cả hai VIOLATION |
| K5 | S5 mặc định mở PR, KHÔNG bày menu ba lối của `finishing-a-development-branch`; chỉ hỏi khi `feature_loop.ship_default` khai `ask` (giá trị: `pr` mặc định · `merge` · `branch` · `ask`); khối marker `S5-SHIP-DEFAULT` trong SKILL; khoá khai trong khuôn config của `acceptance-init` | `feature-loop/skills/feature-loop/SKILL.md`, `commands/acceptance-init.md` | bản sao gỡ khối → đỏ nêu tên khối |
| K6 | `scripts/loop-health.mjs --root <repo> [--all] [--json] [--exclude-slug s]`: ba dòng số luật (c) cho cửa sổ (`--since <ref>`): làm-xong→quyết-được mỗi vòng (git log: commit đầu ghi `status: implemented` → commit đầu ghi `status: signed-off`/`machine-cleared`), lượt gọi người/vòng (đọc dòng `human_calls:` hồ sơ nếu có, không thì «đếm tay»), vòng bị hạ tầng đốt (round BLOCKED trong Iterations + dòng repin); mốc cùng hạng theo tier: round TB (usage-report S4 · Iterations), token S4 TB, ghim lại, fix S4; `--all` quét `/Users/…/dev/*` khử trùng remote | `scripts/loop-health.mjs` (mới), `tests/scripts/loop-health.test.mjs` | script vắng trên baseline; số thật khớp đếm tay ±sai số |
| K7 | triage: máy tính `inPaths` (file finding ∈ ∪paths của evals hồ sơ); agent thêm trường `harm: behavior|measure`; luật: `behavior ∧ inPaths` → `inContract=true`, `acRef` = criterion của eval có paths khớp (máy gán) → vào vòng vá; `measure` → được phép `known-limits`; khuôn OOC-ITEM thêm dòng `Tác hại: {harm}`; `lib/out-of-contract.js` đọc `harm` (vắng → `''`, đọc-cũ); thẻ Cổng 2 xếp `behavior` trước `measure` | `acceptance-verify.js` (TRIAGE_SCHEMA, prompt, triaged, synthesize), `lib/out-of-contract.js`, `scripts/gate-card.js` | W38 bản cũ không có harm; thẻ bản cũ giữ thứ tự viết |
| K8 | làn `conventions` nhận `args.deltaFiles` (round ≥2, `s4-args --carry-anchor` đã tính) → prompt giới hạn «chỉ chấm file CHỮ trong danh sách»; vắng deltaFiles → toàn diff như cũ | `acceptance-verify.js` REVIEWERS, `feature-loop/scripts/s4-args.mjs` (thêm `deltaFiles` vào args) | W39 bản cũ: prompt không chứa danh sách |

## Quyết định thiết kế đáng ghi (→ sổ quyết định)

- **K4 — «một eval thiếu paths → luật cũ»** (thay vì «eval thiếu paths thì bỏ qua nó»): fail-safe
  về phía chặt; hồ sơ cũ không đổi hành vi; hồ sơ mới muốn hưởng thì khai đủ. Đường đo:
  kit 277 ghim lại — hồ sơ mới của kit đều khai paths.
- **K6 — dòng lượt gọi người không đếm bằng máy** từ bản ghi phiên (ngoài repo, không gán được
  cho slug): script đọc dòng `human_calls:` nếu hồ sơ mốc khai, không thì in «đếm tay». Khai
  giới hạn thay vì bịa số.
- **K7 — máy gán `acRef` từ eval có paths khớp**, không để agent suy diễn AC «gần giống» (luật
  cũ vẫn cấm). Tác hại (`harm`) là phán đoán của agent; phạm vi (`inPaths`) là của máy.
- **K2 (c)** chỉ áp khi tác giả commit ghi `approved_by` == `git user.name` hiện tại — cùng
  người mới được kế thừa tên; khác người thì nấc git config như cũ.
- **Brainstorm Q&A bỏ**: đề bài đã được owner grill ở phiên đúc kết; mỗi câu hỏi thêm là một lượt
  ngoài thiết kế.
- **K7/K8 bằng chứng chỉ ở kit** → khai trong Notes, ngưỡng đếm ở repo tiêu thụ (2 mốc).

## Ngoài phạm vi

Xem `## Out of scope` của contract. Riêng: `carry-plan.mjs` có parser `paths` inline-only riêng
— hợp nhất về `lib/eval-yaml.cjs` là việc kế (ô), không kéo vào vòng này.
