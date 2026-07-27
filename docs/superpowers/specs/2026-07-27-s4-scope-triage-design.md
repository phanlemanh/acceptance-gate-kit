# Design: Scope-triage cho review findings ở S4 (s4-scope-triage)

**Ngày:** 2026-07-27 · **Tier:** T2 · **Slug:** `s4-scope-triage`

## Vấn đề

S4 hiện chỉ có HAI ngăn cho một confirmed finding: *thật → sửa* hoặc *không thật →
loại*. Thiếu ngăn thứ ba: **thật nhưng ngoài hợp đồng**. Hệ quả thực chứng (repo
OneFlow, 2026-07): 7 round, ~14M token, mọi round PASS toàn bộ eval nhưng reviewer
liên tục tìm ra lỗi thật trong vùng KHÔNG có AC/eval nào phủ — mỗi bản fix trong
vùng-không-đặc-tả lại đẻ ra lựa chọn không-đặc-tả mới, vòng lặp không thể hội tụ.
12/12 finding rơi vào file ngoài vùng phủ eval mà không có tín hiệu nào nói ra
điều đó.

Cơ chế gốc: reviewer là *finder không giới hạn phạm vi*, gate là *thước có giới
hạn phạm vi* — khi lệch vùng phủ, bên không giới hạn dẫn dắt công việc. Gap-probe
(S1) đã có scope guard; S4 thì chưa.

## Quyết định đã chốt (Gate hỏi-đáp trước design)

1. **Finding CONFIRMED mức high + in-contract ĐƯỢC quyền kéo verdict REJECT** —
   máy tự quay S3 fix cái đã bounded bởi contract (không spiral được); người chỉ
   quyết cái ngoài hợp đồng. Trade-off nhận: finding LLM-confirmed sai vẫn đốt
   1 round (đã có adversarial-verify + cap 3 round chặn).
2. **1 agent triage cả danh sách** (không per-finding, không mở rộng refuter) —
   fresh agent, input = contract.md nguyên văn + danh sách confirmed findings.
   Agent chết sau retry → mọi finding `unclassified`: KHÔNG ai được REJECT từ
   findings, cờ vàng lên card (fail-toward-human).

## Kiến trúc

### 1. `feature-loop/workflows/acceptance-verify.js`

- **Stage TRIAGE mới** sau adversarial-verify, trước verdict routing.
  `TRIAGE_SCHEMA` per finding: `{title, inContract: bool, acRef: string|null,
  rationale, proposal: 'known-limits'|'new-contract'|null}`. Input: contract.md
  (đọc từ `args.contractPath` — SKILL truyền thêm) + confirmed findings.
  Findings rỗng → skip stage (0 token). Retry 1; vẫn chết → `triageFailed: true`.
- **Verdict routing** thêm đúng một vế, đặt SAU failed-eval check:
  `else if (confirmed findings nào severity high ∧ inContract) verdict = 'REJECT'`.
  Unverified và unclassified và out-of-contract KHÔNG BAO GIỜ vào vế này.
- **Fix-list**: result trả `rejectFindings` = in-contract findings (mọi severity)
  để SKILL đưa vào fan-out fix khi REJECT (vì eval fail hay vì finding high);
  out-of-contract TUYỆT ĐỐI không nằm trong đó.
- **Cluster signal** (JS thuần, không agent): union mọi glob trong `paths` của
  evals; confirmed finding có `file` không khớp glob nào → đếm. `count ≥ 2` →
  `coverageCluster: {count, total, files}`; không eval nào có `paths` →
  `coverageCluster: null` + note "n-a". Dùng matcher glob sẵn có của script
  (P1 carry-forward đã có logic match paths — tái dùng, không viết matcher mới).
- **Synthesize**: `review-findings.md` đổi thành 3 section: `## Trong hợp đồng`
  (kèm acRef) / `## Ngoài hợp đồng — human quyết ở Gate 2` (kèm proposal) /
  `## Chưa phân loại (triage-failed)` + section cũ "Chưa adversarial-verify"
  giữ nguyên + dòng cluster. **evidence-report.md KHÔNG thêm field/section mới**
  — thông tin triage chỉ sống trong review-findings.md (ngoài hook), hook
  evidence-gate giữ nguyên shape, zero rủi ro L1/L2/L3.

### 2. `feature-loop/skills/feature-loop/SKILL.md`

- Chuẩn bị args S4: thêm `contractPath` (abs path contract.md).
- Routing REJECT: fix-list = `failedEvals + failedCommands + rejectFindings`
  (thay `confirmedFindings`); ghi rõ out-of-contract findings KHÔNG sửa trong
  round — chúng đi Gate 2.
- Gate 2 gói: khối "Ngoài hợp đồng" trình như việc-của-người với 3 lựa chọn
  human: Known limits (ghi vào contract Notes) / contract mới (feature sau) /
  nâng scope sửa ngay (amend contract + re-approve → round mới). Cluster flag
  → dòng "dừng và quyết: mở rộng contract hay rút scope".

### 3. Card hai harness

`commands/acceptance-card.md` + `codex/acceptance-gate/skills/acceptance-card/SKILL.md`:
Cổng 2 — nếu review-findings.md có section "Ngoài hợp đồng" → render khối đó lên
phần việc-của-người (trên judgment items), kèm cluster flag nếu có; file cũ không
section → render như cũ, không lỗi (backward-tolerant, cùng nếp gate-card 1.18.0).

### 4. Codex parity

`codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` vùng S4 (~dòng 422):
port 3 ngăn + quyền REJECT cho in-contract high + fail-toward-human dạng text
(codex không có Workflow JS — `acceptance_refuter` xong thì thêm 1 lượt
`acceptance_triage` role, model theo bảng routing codex).

### 5. Wiring tests/workflows (phát hiện trong S1)

`tests/workflows/run-tests.sh` (harness vm-realm chạy file thật, stand-in agent)
tồn tại từ Đợt 5 nhưng CHƯA wire vào CI/config. Feature này cần nó làm executor:
- `_acceptance/config.yaml`: thêm `executors.test.workflows: "bash tests/workflows/run-tests.sh"`
  + thêm vào `feature_loop.suite_keys`.
- `.github/workflows/gate.yml`: thêm step chạy suite này.

### 6. Tests & mirror

- `tests/workflows/acceptance-verify.test.mjs`: case `WT*` mới pin triage/verdict/
  cluster qua harness. Mọi assertion âm tính theo bất biến CLAUDE.md #4: đối chứng
  dương + ghim đúng thông điệp.
- `tests/plugins/run-tests.sh`: case text-presence cho card 2 harness + codex parity.
- `scripts/sync-plugin-packages.sh` chạy sau khi sửa nguồn; mirror commit cùng lượt.
- Bump: feature-loop minor (Claude) + feature-loop-codex minor (lệch cố ý như nếp),
  acceptance-gate minor (card).

## Error handling

| Tình huống | Hành vi |
|---|---|
| Triage agent chết (cả retry) | unclassified toàn bộ; không REJECT-từ-finding; `triageFailed: true`; cờ vàng card |
| contract.md không đọc được | như triage chết (skip + cờ) — không đoán scope |
| Findings rỗng sau verify | skip stage, không spawn agent |
| Không eval nào có `paths` | cluster = n-a, 1 dòng note, không flag |
| BLOCKED round | BLOCKED dominates như cũ; triage kết quả vẫn ghi vào review-findings.md nếu đã chạy |

## Out of scope (tóm tắt — contract là nguồn sự thật)

Auto-fix out-of-contract findings; heuristic/regex triage; ngưỡng severity
configurable; triage cho suite-command failures; auto-draft contract mới.

## Morphological scan (Coverage nguồn)

Trục: A loại-finding (confirmed-high | confirmed-med/low | unverified) ×
B kết-quả-triage (in-contract | out-of-contract | unclassified) ×
C bối-cảnh-verdict (evals xanh | evals đỏ | BLOCKED) + D cluster (computable | n-a).
Cross-cutting: harness parity · backward-compat · hook-shape nguyên vẹn ·
doer≠grader. Chân ngành: [NGÀNH: SonarQube Quality Gate "Clean as You Code"]
(gate chỉ tính finding trong new-code = biên phạm vi) + [NGÀNH: SARIF
baseline/suppression] (phân loại finding là trạng thái máy-đọc được lưu).
