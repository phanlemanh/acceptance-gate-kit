# feature-loop

Vòng lặp chuẩn phát triển 1 tính năng từ ý tưởng đến PR, điều phối **acceptance-gate** + **superpowers** + **Workflow orchestration** thành một loop với đúng 2 điểm dừng human.

```
/feature-loop <mô tả tính năng | slug để resume>
│
├─ S0 INTAKE      risk tier từ _acceptance/config.yaml (T1 thoát loop)
├─ S1 DESIGN      brainstorm → design doc + contract.md + evals.yaml (cùng lúc)
■  GATE 1         human duyệt 1 gói: design + contract + mapping evals
├─ S2 PLAN        writing-plans (task có cờ independent)  ■ T3: +Gate 1.5 duyệt plan
├─ S3 EXECUTE     tuần tự main loop; ≥2 task độc lập → workflow execute-parallel (worktree/task)
├─ S4 VERIFY      workflow acceptance-verify: machine evals (dedupe theo lệnh)
│                 + 3 blind judges/judgment item + review adversarial → evidence-report.md
│                 REJECT → quay S3, max 3 round
■  GATE 2         human resolve UNCERTAIN + human_signoff → status: signed-off
└─ S5 SHIP        finishing-a-development-branch → PR
```

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

## Nguồn gốc

Thiết kế + build trong repo artifact-platform (2026-06-11), qua subagent-driven development với 2-stage review per task + final holistic review + dry-run e2e. Bản plugin này là bản generalized (suite keys theo config, review skill tùy chọn).
