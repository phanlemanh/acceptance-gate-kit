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

**Nấc ngữ cảnh (context:)**:
Khoá `context:` trong sổ phiên design-pass — chỗ bản mẫu SỐNG, 3 nấc:
`standalone` (đứng một mình) / `static-frame` (khung giả tĩnh) /
`host-embedded` (nhúng host thật). Chiều thứ hai độc lập với thang vật liệu
(`material:`): vật là gì ⟂ vật sống ở đâu. Thẻ Cổng 1 render nấc bằng tiếng
người; đường nhúng rẻ per-repo khai ở khoá config `design_pass.host_embed`.
_Avoid_: environment, embed mode, host mode.

**Cảnh ngữ-cảnh**:
Bằng chứng đi kèm bản mẫu `standalone`: khung host thật dạng tĩnh bọc vật +
storyboard hành trình vào–ra, liệt trong khoá `context_scenes:` của sổ phiên.
Thiếu nó mà không có entry descope `bỏ cảnh ngữ-cảnh — ` là cờ vàng trên thẻ
Cổng 1.
_Avoid_: mockup ngữ cảnh, screenshot host.

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

**Tên bốn cổng (mặt người, tiếng Việt)**:
`Gate 1`/`Gate 2` là tên MÁY-ĐỌC của điểm dừng; khi trình cho người, mỗi cổng
có một tên nói *câu hỏi cổng đó hỏi*. Bốn tên này viết hoa cả cụm và dùng
nguyên văn trên mọi mặt người (thẻ `/start`, bản đồ sản phẩm, thân lệnh cổng):

| Tên mặt người | Câu hỏi | Mã máy | Ghi ở |
|---|---|---|---|
| **Cổng Đáng** | Việc này có đáng làm không? | `dang` | `opportunity.md` — `decision` |
| **Cổng Phạm vi** | Bộ tiêu chí đã đủ và đúng chưa? | `pham-vi` | `contract.md` — `approved_by` (= Gate 1) |
| **Cổng Bằng chứng** | Đã làm đúng thứ đã hứa chưa? | `bang-chung` | `evidence-report.md` — `human_signoff` (= Gate 2) |
| **Cổng Giá trị** | Thứ đã giao có ăn thua không? | `gia-tri` | `uat-session.md` — `verdict` |

Một tên cổng đứng MỘT MÌNH ở mặt người mà không có bảng/chú giải quanh nó là
vi phạm N6: người đọc lần đầu không suy ra được "Đáng" nghĩa là gì. Hình có
nhãn cổng thì ngay dưới hình phải có dòng giải nghĩa.
_Avoid_: gọi Cổng Bằng chứng là "Gate 2" trong văn mặt người; đặt tên cổng mới
mà không thêm hàng vào bảng này.

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

### Song diện

**Mặt người**:
Nửa artifact dành cho người đọc và quyết: thẻ cổng, bảng tóm tắt kế hoạch, báo
cáo checkpoint, tin nhắn tại điểm quyết định. Chịu luật ngôn ngữ mặt người
(`skills/acceptance/references/human-facing-language.md`).
_Avoid_: UI (đó là surface của sản phẩm tiêu thụ), bản đẹp.

**Mặt máy**:
Nửa artifact dành cho hook/CI/script đọc: frontmatter, `evals.yaml`,
`run-log.jsonl`, mã nguồn. Ở đây tên chính xác là bắt buộc — luật ngôn ngữ mặt
người KHÔNG áp vào đây.
_Avoid_: backend, internal.

**Mặt phẳng**:
Nơi một thứ trình cho người được HIỂN THỊ: khung hội thoại, panel bên, terminal
thuần, tài liệu trong kho. Quyết định hình ở điểm quyết định vẽ bằng cơ chế nào
(bảng tra `DECISION-DIAGRAM-SURFACES`).
⚠️ Khác **Surface**: Surface là nơi *feature* lộ ra với người dùng (enum
frontmatter `surfaces:` — web, mobile, api); mặt phẳng là nơi *một thông điệp*
được hiển thị. Một feature `surfaces: [cli]` vẫn trình qua nhiều mặt phẳng.
_Avoid_: màn hình.
<!-- KHÔNG liệt "surface" ở đây: nó là term CHUẨN của kit (xem mục Surface), nên
parser coi là allow-span và alias không bao giờ bắn — một luật không thể đỏ.
Phân biệt hai khái niệm đã nằm ở câu cảnh báo ngay trên, và có răng canh ở P96. -->

**Nhìn-thấy-hình**:
Phép thử một câu tại điểm quyết định: thứ người nhận nhận được có phải là HÌNH
chưa? Ca trượt điển hình là dán khối mã vào mặt phẳng thiếu bộ vẽ.
_Avoid_: kiểm hình, visual check.

**Lỗ-kit**:
Vi phạm luật ngôn ngữ mặt người bị người duyệt bắt tại cổng, ghi vào sổ quyết
định bằng entry `revisit` có `decision` mở đầu `lỗ-kit — ngôn ngữ mặt người`.
Là lỗ của bộ công cụ chứ không phải lỗi của người viết — đếm được để đợt nâng
bộ thẻ đọc lại bằng số.
_Avoid_: bug, lỗi trình bày.

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

**known-limits**:
Giới hạn đã biết của một vòng: khiếm khuyết người ký ĐỌC và CHẤP NHẬN tại Cổng
2 trước khi phát hành, ghi thành bullet trong `## Notes` của contract. Khác
"bug chưa biết" (chưa ai thấy) và khác "nợ kỹ thuật" (không qua cổng người).
_Avoid_: "hạn chế" trơ (không nói ai đã chấp nhận).

**dogfood**:
Chính đội làm ra bộ công cụ đem nó áp lên công việc của mình — kit tự chạy cổng
của chính kit. Giá trị: lỗi lộ ra ở lần dùng thật đầu tiên thay vì ở repo tiêu
thụ. Khác "test" (dựng tình huống) — dogfood là việc thật.
_Avoid_: "ăn thức ăn cho chó" (dịch thô), "self-test".

**single-source**:
Một chỗ duy nhất giữ sự thật của một luật/khuôn/số; mọi nơi khác ĐỌC LẠI chứ
không chép. Chép là mở đường cho bên-viết và bên-đọc trôi khỏi nhau — lớp lỗi
đã đốt nhiều vòng. Hiện thân trong kit: khối marker + phép đo round-trip.
_Avoid_: "nguồn duy nhất" trơ khi đang nói về CHÉP vs ĐỌC LẠI.

**run_id**:
Mã định danh MỘT lượt chạy máy. Mọi dòng bằng chứng của lượt đó mang cùng mã,
nên người soi đối chiếu được "bằng chứng này ra từ lần chạy nào". Khác `sha`
(mã bản mã nguồn) — một `sha` có thể có nhiều lượt chạy.
_Avoid_: "id chạy" trơ (không phân biệt được với id việc).

**machine-lane**:
Làn chạy trọn bộ phép kiểm bằng máy, không người can thiệp giữa chừng — đơn vị
của nghi thức ghim lại bằng chứng (một làn, nhiều chữ ký). Khác "suite" (tập
lệnh) — làn là một LƯỢT chạy tập đó.
_Avoid_: "lane" trơ.

**fixture**:
Hồ sơ/dữ liệu dựng sẵn để phép đo chạy trên đó, KHÔNG phải hồ sơ thật của sản
phẩm. Luật kit: fixture phải do code sinh trong chính lần chạy, không viết tay
theo khuôn của bên đọc.
_Avoid_: "dữ liệu mẫu" khi đang nói về luật sinh-fixture.

**carry**:
Mang kết quả xanh của lượt trước sang lượt sau thay vì chạy lại, khi phần được
đo không đổi. Tiết kiệm thật nhưng phải MINH BẠCH: lượt nào carry gì đều hiện
trong báo cáo và gói trình người.
_Avoid_: "cache" (gợi ý máy tự lo, giấu người).

**kind:panel**:
Dòng biên bản hội đồng trong sổ chạy của máy — ghi mỗi giám khảo bỏ phiếu gì và
đòi thêm bằng chứng nào. Nguồn của báo cáo "các giám khảo đồng thuận tới đâu".
_Avoid_: dán tên field trần vào câu trình người mà không chú giải.

## Rejected framings

- **"Gate" cho máy móc** — hook/CI từng được gọi "evidence gate"/"merge gate";
  loại vì `gate` đang gánh 3–4 nghĩa và làm mờ điểm bán chính của kit: Gate
  là chỗ DUY NHẤT cần con người.
- **"Test" thay cho eval** — loại vì eval có 4 executor; gọi "test" khiến
  ui-check/judgment bị đọc nhầm thành unit test.
