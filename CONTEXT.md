# Acceptance-Gate Kit

Evidence-backed acceptance gate cho feature do AI code. File này là **glossary
phát triển của kit** — ngôn ngữ dùng khi viết SKILL.md, docs, script và commit
message của chính kit (authoring-time). Nó KHÔNG được skill nạp lúc runtime;
repo tiêu thụ có `CONTEXT.md` riêng cho domain sản phẩm của họ. Term chuẩn giữ
tiếng Anh (khớp code/frontmatter), định nghĩa tiếng Việt. Chỉ term riêng của
kit — khái niệm chung (subagent, worktree, frontmatter…) không vào đây.

## Language

### Artifacts

**Contract**:
Bản chuẩn hoá yêu cầu của một feature (`_acceptance/<slug>/contract.md`) —
frontmatter lifecycle + `## Criteria`. Nguồn sự thật của phạm vi; card chỉ là
lớp trình bày.
_Avoid_: spec, PRD (đó là *input* của Phase 1), thẻ.

**Criterion (AC)**:
Một mục Given/When/Then trong `## Criteria`, định danh `AC-n` — đơn vị mà eval
phải phủ.
_Avoid_: requirement, user story, test (criterion là *điều phải đúng*, không
phải cách chứng minh).

**Dấu**:
Hậu tố trong ngoặc mà contract gắn vào một criterion để ĐỔI CÁCH MÁY XỬ LÝ nó —
`(judgment)` (cần người phán) và `(cross-layer)` (đòi eval `layer:
backend-effect`). Chốt 2026-07-30 vì repo chưa có từ cho khái niệm này.
_Avoid_: thẻ, tag

**Nhãn**:
Phần mô tả tự do trong ngoặc giữa id và nội dung criterion — `- AC-1 (biên
dịch): …`. Đối lập với **Dấu**: nhãn KHÔNG đổi hành vi máy, chỉ là chú thích
cho người đọc; parser nuốt nó vào `gwt`.

**Eval**:
Một entry trong `evals.yaml` sinh evidence cho ≥1 criterion, chạy bởi đúng một
executor.
_Avoid_: test case (chỉ đúng khi executor là `test`), check.

**Executor**:
Một trong 4 loại máy chạy eval: `test` / `script` / `ui-check` / `judgment`.
_Avoid_: runner, engine.

**Driver**:
Công cụ điều khiển surface bên trong `ui-check` (browser, mobile simulator).
Nghĩa hẹp — không dùng cho executor.
_Avoid_: tool (chung chung).

**Evidence**:
Vết máy đã đối chiếu được: `run_id` (khớp `run-log.jsonl`) + `exit_code` +
`verifier` + `verified_at` (+ `verified_commit`). Không có evidence thì không
có PASS.
_Avoid_: proof, log (log là nguồn thô; evidence là vết đã đối chiếu).

**Evidence report**:
Tài liệu Gate 2 (`evidence-report.md`): verdict + bảng per-eval + các trường
human-owned.
_Avoid_: test report, báo cáo QA.

**Verdict**:
Kết luận CẤP REPORT: `PASS` / `REJECT` / `BLOCKED` (± `PENDING-JUDGMENT`).
Eval riêng lẻ KHÔNG có verdict — nó có `expected`/actual; đừng dùng từ này cho
một eval đơn lẻ.
_Avoid_: outcome, result

### Gates & verbs

**Gate**:
Viết hoa, CHỈ điểm dừng con người: Gate 1 (duyệt contract+evals), Gate 1.5
(T3 — duyệt plan), Gate 2 (signoff evidence). Máy móc không phải Gate: hook
ghi-thời-điểm gọi là **the hook**, CI gọi là **pre-merge check** (tên file
`acceptance-evidence-gate.js` giữ nguyên — glossary trị văn, không trị tên file).
_Avoid_: evidence gate, merge gate, quality gate (khi chỉ hook/CI).

*Ngoại lệ có chủ đích — **P0 design gate***: là máy móc nhưng GIỮ chữ "gate",
vì đây là **tên riêng của một tính năng** đã lộ ra ngoài (mô tả plugin
design-loop trên marketplace), không phải văn xuôi mô tả máy móc — cùng lý do
tên file được miễn. Viết thường, luôn kèm định tố (`P0 design gate`,
`design-quality gate`); không bao giờ viết trơ "the Gate". Lint W6 (Đợt 2)
phải allowlist cụm này. Muốn bỏ ngoại lệ thì đó là một lần đổi tên tính năng
(8 chỗ, chạm marketplace description), không phải một lần sweep từ vựng.

**Ngoại lệ tiếng Việt — "cổng" (thường):** văn tiếng Việt của kit dùng "cổng"
làm danh từ chung cho CẢ cơ chế nghiệm thu (tên sản phẩm là Acceptance-Gate
Kit), kể cả khi câu đang nói về lớp máy. `_Allow_: cổng` — nhưng CHỈ ở dạng
thường và chỉ trong văn tiếng Việt; "Cổng 1"/"Cổng 2" viết hoa vẫn dành riêng
cho điểm dừng con người, và văn tiếng Anh vẫn theo luật cũ (**the hook** /
**pre-merge check**, không "evidence gate"). Quyết ngày 2026-07-26 sau khi
review S4 đếm được 15 lượt drift qua ADR 0004/0005 và README — hoặc ghi ngoại
lệ, hoặc sweep mãi mà lần sau lại tái diễn.

**Approve**:
Động từ của Gate 1 — người thật ghi `approved_by`/`approved_at` sau một câu
YES tường minh trong chat.
_Avoid_: sign (đó là Gate 2), duyệt tự động.

**Signoff**:
Động từ của Gate 2 + trường `human_signoff`; khi `require_human_commit`, chữ
ký nằm trong commit human-fields-only riêng. Viết liền.
_Avoid_: sign-off, approval (đó là Gate 1).

### Classification

**Risk tier**:
`T1`/`T2`/`T3` — mức nghi thức của feature; T1 thoát gate có xác nhận. Từ
"tier" chỉ dành cho trục này, không dùng cho **Layer**.
_Avoid_: level, priority

**Surface**:
Nơi feature lộ ra với người dùng — enum frontmatter `surfaces:` (`web`,
`mobile`, `api`…). Quyết định làn evidence. Không dùng từ này cho bề mặt
interface của code.
_Avoid_: platform
_Allow_: artifact-platform
# `artifact-platform` là TÊN RIÊNG của repo tiêu thụ đầu tiên — nó xuất hiện
# trong contract/evidence mỗi lần ta dẫn số đo thật từ đó. Carve-out đích danh
# cụm, KHÔNG nới "platform" trơ: dùng sai từ ở chỗ khác vẫn phải kêu.

**Layer**:
Trường cấp eval (`layer: backend-effect`) — tầng hệ thống mà evidence chạm
tới. Luật cặp cross-layer: criterion `(cross-layer)` phải có ≥1 eval
backend-effect. Đừng gọi "tầng" chung chung khi không nói về trường này.
_Avoid_: tier

**Lane (làn)**:
Tuyến xử lý một surface: làn design (mockup/fidelity — CT1/CT2) vs làn test
(e2e). Mobile đi làn test, không kích hoạt làn design.
_Avoid_: flow, track.

### Evidence vocabulary

**Residual**:
Nhiễu in-scope còn lại sau khi eval chạy (console error, request fail thuộc
app) — là FAIL máy theo §3.4.2-r5/§7.4, không phải việc của `human_override`.
_Avoid_: noise (chung chung), warning.

**False-green**:
PASS nói dối — evidence xanh nhưng feature không giao đúng (vd UI xanh, backend
không có hiệu ứng). Kẻ thù trung tâm của kit.
_Avoid_: false positive (giữ cho W-warning của lint).

**network_observed**:
Từ vựng evidence advisory của ui-check: 7 bucket (`clean`, `app-fail`,
`no-app-traffic`, `third-party-only`, `n-a`, `unscoped`, `unscoped-partial`)
ghi sự thật network trong app-origin scope.

**Mobile backend target**:
Dòng `## Notes` của contract mobile khai `local|staging|mock` để human liếc
rủi ro tại Gate 1; W5 nhắc khi thiếu.

**Sổ quyết định (decisions ledger)**:
`_acceptance/<slug>/decisions.jsonl` — append-only, ghi *vì sao* của các quyết
định (approach/descope/fix/revisit/seal). KHÔNG bao giờ override contract.
Xuất hiện trong output pre-merge dưới dạng `theo ledger <id>` và trong
`gate-card.js` dưới khoá `ledger.broken`.

**Sổ luật-đã-chạy (rules ledger)**:
Kế toán trong `pre-merge-check.sh`: mỗi khối luật ghi `ran <tên>` hoặc
`declared-off <tên>` qua `ledger_mark`, so với EXPECTED ở điểm nghẽn trước khi
kết luận. Lệch → `VIOLATION [ledger]` + exit 2 = lỗi NỘI TẠI của cổng.
⚠️ Hai nghĩa của "ledger" cùng xuất hiện được trong output MỘT lần chạy. Khi
viết message/doc mới, gọi tên đầy đủ ("sổ luật-đã-chạy" / "sổ quyết định");
đừng dùng "ledger" trần. Nhãn `[ledger]` hiện tại là literal đã ghim trong
contract `premerge-rules-ledger` (AC-2/AC-7d) nên đổi nó là một lần sửa
contract, không phải một lần sửa chữ.
_Avoid_: "ledger" trần trong văn bản mới.

## Rejected framings

- **"Gate" cho máy móc** — hook/CI từng được gọi "evidence gate"/"merge gate";
  loại vì `gate` đang gánh 3–4 nghĩa và làm mờ điểm bán chính của kit: Gate
  là chỗ DUY NHẤT cần con người.
- **"Test" thay cho eval** — loại vì eval có 4 executor; gọi "test" khiến
  ui-check/judgment bị đọc nhầm thành unit test.
