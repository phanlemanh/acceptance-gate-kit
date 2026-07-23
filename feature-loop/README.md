# feature-loop

Vòng lặp chuẩn phát triển 1 tính năng từ ý tưởng đến PR, điều phối **acceptance-gate** + **superpowers** + **Workflow orchestration** thành một loop với đúng 2 điểm dừng human.

```
/feature-loop <mô tả tính năng | slug để resume>
│
├─ S0 INTAKE      risk tier từ _acceptance/config.yaml (T1 thoát loop)
├─ S1 DESIGN      brainstorm → design doc + contract.md + evals.yaml (cùng lúc)
■  GATE 1         human duyệt qua THẺ quyết định (/acceptance-card): design + contract + evals
├─ S2 PLAN        writing-plans (task có cờ independent)  ■ T3: +Gate 1.5 duyệt plan
├─ S3 EXECUTE     tuần tự main loop; ≥2 task độc lập → workflow execute-parallel (worktree/task)
├─ S4 VERIFY      workflow acceptance-verify: machine evals (dedupe theo lệnh)
│                 + 3 blind judges/judgment item + review adversarial → evidence-report.md
│                 REJECT → quay S3, max 3 round
■  GATE 2         human duyệt qua THẺ quyết định: resolve UNCERTAIN + human_signoff → signed-off
└─ S5 SHIP        finishing-a-development-branch → PR
```

Ở cả 2 cổng, feature-loop **mặc định render thẻ quyết định** (`/acceptance-card <slug>`) — trình việc-chỉ-người-quyết bằng ngôn ngữ sản phẩm + luôn kèm đảo-ngược; gói text đầy đủ vẫn đính kèm để soi sâu. Thẻ chỉ trình bày, KHÔNG quyết — verdict/hook/evidence vẫn là nguồn-sự-thật.

Trạng thái loop sống trong frontmatter `status` của `_acceptance/<slug>/contract.md` (lifecycle của acceptance-gate) — resume được giữa các session, kể cả round verify (đọc từ section Iterations của evidence-report).

## Cài đặt

```bash
claude marketplace add phanlemanh/acceptance-gate-kit   # nếu chưa add
claude plugin install acceptance-gate@acceptance-gate-kit
claude plugin install feature-loop@acceptance-gate-kit
# + plugin superpowers (marketplace claude-plugins-official)
```

## Setup mỗi repo đích

1. Chạy `/acceptance-init` → sinh `_acceptance/config.yaml` (executors, risk tiers).
2. Thêm vào `_acceptance/config.yaml` danh sách lệnh verify suite chạy mỗi round S4 (key trỏ vào `executors.*` của chính repo đó — Node thì build/typecheck, Python thì lint/mypy...):

```yaml
feature_loop:
  suite_keys:            # dotted keys trỏ vào executors.* ở trên
    - executors.test.build
    - executors.test.typecheck
```

   (Thiếu section này → lần chạy S4 đầu tiên skill sẽ DỪNG hỏi bạn chọn từ `executors.*` rồi tự ghi vào config.yaml — hỏi đúng 1 lần. KHÔNG khai toàn bộ itest của mọi feature — itest feature khác flaky sẽ đốt round verify.)
3. (Tùy chọn) Repo có skill review invariant riêng → skill sẽ truyền path của nó vào `reviewSkillPath` của workflow verify; không có thì review theo CLAUDE.md/CONTRIBUTING.md.

## Ghi chú runtime (quan trọng)

- **Invoke workflow bằng `scriptPath`** (abs path vào `workflows/` của plugin), KHÔNG bằng `name` — registry theo tên có thể cache bản script cũ.
- **`args` có thể đến script dạng JSON string** tùy harness — cả 2 script đã tolerant-parse, không cần xử lý gì thêm.
- Debug fan-out không tốn agent: thêm `dryRun: true` vào args của acceptance-verify → trả về `distinctCommands`/`judgePanels`.
- Syntax-check script khi sửa: dùng AsyncFunction constructor (strip `export `), KHÔNG dùng `node --check` (top-level return hợp lệ trong Workflow runtime).

## Model routing (chi phí token)

Agent trong Workflow mặc định kế thừa model của phiên chính — phiên chạy model lớn thì mọi verifier/judge cũng chạy model lớn. Từ v1.1.0, `acceptance-verify.js` route từng nhóm agent theo bản chất công việc:

| Agent | Model | Lý do |
|---|---|---|
| machine verifier | `haiku` | Chạy 1 lệnh, capture exit code + output — thuần cơ học |
| ui-check verifier | `sonnet` | Nhiều bước (server lifecycle, assertion, evidence) nhưng không cần suy luận sâu |
| judge (×3/panel) | `sonnet` | Verdict scoped trên input đã resolve; majority 2/3 của panel bù sai số từng judge |
| refuter | `sonnet` | Kiểm 1 finding cụ thể đã có file:line |
| synthesize | `sonnet` | Điền template từ verdict đã tính sẵn bằng JS thuần; hook evidence-gate chặn nếu sai shape |
| review finder | (kế thừa phiên) | Tìm bug trong diff — chỗ trí tuệ tạo giá trị, KHÔNG hạ |
| execute-parallel task | (kế thừa phiên) | Agent code thật — lỗi code đắt hơn token tiết kiệm được |

Nguyên tắc chung: **model lớn cho việc tạo phán đoán** (tìm bug, viết code), **model nhỏ cho việc thực thi có schema + chốt chặn máy kiểm** (chạy lệnh, điền template, vote trên căn cứ hẹp).

### Đo cái ĐÃ chạy thật: `scripts/wf-usage.mjs` (v1.15)

`/workflows` cho xem token per agent lúc đang chạy nhưng không cho biết model; bảng route ở trên là cái *config hứa*. Nguồn sự thật là transcript per-agent mà harness ghi lại (`~/.claude/projects/<proj>/<session>/subagents/workflows/wf_*/agent-*.jsonl` — mỗi API call mang `message.model` + `message.usage`):

```bash
node <plugin>/scripts/wf-usage.mjs --latest            # run mới nhất của repo hiện tại
node <plugin>/scripts/wf-usage.mjs <wf-dir> --md       # bảng markdown để append vào report
```

Ra bảng per-agent `label · model · calls · out/in/cache token · giây` + tổng theo model. Hai chỗ dễ sai script đã xử lý: (1) một API call ghi nhiều dòng transcript cùng `message.id` — phải dedupe lấy max, cộng ngây thơ phồng 2-3×; (2) `opts.label` không được ghi xuống file — 2 workflow của kit nhúng tag `[wf-label: <label>]` vào dòng đầu prompt từ v1.15 để map lại. Skill feature-loop tự chạy script này sau mỗi Workflow run (S1/S3/S4) và append vào `_acceptance/<slug>/usage-report.md` — 0 token, chỉ parse file; đây là chỗ kiểm chứng `feature_loop.models` có hiệu lực thật.

## Nguồn gốc

Thiết kế + build trong repo artifact-platform (2026-06-11), qua subagent-driven development với 2-stage review per task + final holistic review + dry-run e2e. Bản plugin này là bản generalized (suite keys theo config, review skill tùy chọn).
