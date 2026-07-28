# Bàn giao sang tài khoản khác (cùng máy) — 2026-07-28

**Cho ai:** phiên Claude chạy dưới tài khoản khác trên cùng máy này. Memory của
phiên cũ **KHÔNG đi theo** — file này là nguồn bàn giao duy nhất; mọi thứ cần
biết nằm ở đây hoặc trong repo.
**Việc:** đóng blocker stale-evidence để push được 25 commit đang nằm local.

## Trạng thái lúc bàn giao

Repo `acceptance-gate-kit`, nhánh `main`, cây làm việc **sạch**,
**25 commit local CHƯA PUSH** (`git rev-list --count origin/main..HEAD` = 25).
Người duyệt: `Manh Phan` (`signoff.approvers` trong `_acceptance/config.yaml`).
Git identity trên máy: `Phan Le Manh <phanlemanh@gmail.com>`.

| Slug | Status | Ghi chú |
|---|---|---|
| `s4-scope-triage` | **signed-off** | round 6 PASS, ký 2026-07-28, evidence pin `1efcbe7` — XONG, không còn việc |
| `gap-probe-presence-hook` | signed-off | evidence pin `e5377543` — **STALE** (blocker) |
| `premerge-rules-ledger` | signed-off | evidence pin `26af2297` — **STALE** (blocker) |
| `t1-escape-event-scope` | signed-off | evidence pin `c09533b6` — **STALE** (blocker) |

Hai commit cuối của đợt 8, tách đúng luật `signoff.require_human_commit`:

- `3a4aa7c` — bằng chứng máy-viết (run-log +17 dòng round 6, evidence-report,
  review-findings, usage-report, `status: verified`)
- `b195a26` — chữ ký người (chỉ chạm dòng `human_signoff` trong report;
  `status: signed-off`; section `## Known limits`; entry ledger `gate2`)

## Blocker duy nhất: 3 feature cũ hết hiệu lực bằng chứng

```bash
bash scripts/pre-merge-check.sh . --base "$(git rev-parse HEAD~1)" --no-t1-escape
```

→ 3 `VIOLATION ... evidence is stale`. `OK [s4-scope-triage]` — slug của đợt 8
sạch, blocker hoàn toàn nằm ở ba slug cũ.

**Nguyên nhân:** đợt `s4-scope-triage` sửa các file gated dùng chung sau
`verified_commit` của cả ba: `feature-loop/skills/feature-loop/SKILL.md`,
`commands/acceptance-card.md`, `codex/acceptance-gate/skills/acceptance-card/SKILL.md`,
`codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`,
`.github/workflows/gate.yml`, 4 manifest plugin.

**Đây là nợ MỚI, không phải nợ có sẵn** — đã kiểm chứng, đừng kiểm lại:
dựng worktree tại `d676a17` (commit đã push cuối) và chạy cùng lệnh trên →
`pre-merge-check: clean`. Push lúc này ⇒ job `gate` trên `main` ĐỎ.

**Tiền lệ xử lý đúng cách nằm ngay trong lịch sử:** commit `d676a17` chính là
`signoff(t1-escape-event-scope): ký lại sau release 1.22.1`. Đường đi là
re-verify + ký lại, không phải bypass.

## Việc kế tiếp, theo thứ tự

1. Với **từng** slug trong ba slug trên: hạ `contract.status` về `implemented`,
   chạy `/feature-loop <slug>` → vào S4 round mới.
   - Round delta ⇒ **dùng carry-forward P1**: `deltaFiles` = `git diff --name-only
     <verified_commit>` (bỏ `_acceptance/**`); eval nào có `paths` không giao
     delta và round trước `exit_code: 0` thì carry, **giữ nguyên `runId` gốc**.
   - P2: so `shasum -a 256 _acceptance/<slug>/evals.yaml` với dòng
     `"kind":"baseline"` cuối trong `run-log.jsonl`; trùng ⇒ `runBaseline: false`.
   - P3: panel carry nếu `inputsHash` không đổi.
   - Phần **buộc** chạy lại: suite commands + review + refute. Đó là chi phí thật.
2. Cả ba đều **T3** ⇒ ở Cổng 2 người duyệt phải điền `human_override` cho
   **từng** judgment item, không chỉ một chữ ký. Đừng nâng PENDING-JUDGMENT lên
   PASS thay người.
3. Mỗi slug: commit bằng chứng máy TRƯỚC, commit chữ ký người RIÊNG (luật
   `require_human_commit`).
4. Khi cả hai chế độ đều sạch thì push:
   ```bash
   bash scripts/pre-merge-check.sh . --base "$(git rev-parse HEAD~1)" --no-t1-escape
   bash scripts/pre-merge-check.sh --base <merge-base với origin/main>
   ```

## Nợ đã khai khi ký s4-scope-triage (người duyệt chấp nhận 2026-07-28)

Nguồn đầy đủ: `_acceptance/s4-scope-triage/contract.md` § `## Known limits`
(12 mục, đã chốt gom vào **một** hợp đồng kế tiếp `s4-doc-truth-guard`).
Đáng chú ý nhất:

1. **high — `scripts/gate-card.js`**: renderer chỉ đọc `ooc.findings.length`,
   **không** đọc `ooc.present`. Writer viết lệch khuôn (`*` thay `-`, sai thụt,
   `###` thay `##`) ⇒ khối "Ngoài hợp đồng" biến mất im lặng, không cờ,
   exit 0. Mẫu guard cần dùng **đã có sẵn trong cùng file** — nhánh cảnh báo
   cho `gap-probe.md` ("khai findings nhưng không đọc được dòng nào").
2. **medium — `lib/out-of-contract.js`**: ba marker máy-đọc (`## Ngoài hợp đồng`,
   `## Chưa phân loại`, dòng cờ cụm) chỉ có khuôn item được round-trip bởi P55;
   cờ cụm và heading chưa có case nối writer↔reader.
3. **medium — `feature-loop/workflows/acceptance-verify.js:539`** (AC-4, TRONG
   hợp đồng, chưa sửa): nhánh partial-triage bật `triageFailed` và ép
   `rejectFindings` rỗng đúng, nhưng không hạ `inContract: true` trên từng
   finding ⇒ `review-findings.md` vẫn in section "## Trong hợp đồng" cho round
   mà máy thực tế đã fail-toward-human.
4. Doc-truth trôi theo chính đợt refactor này: `SKILL.md` + `GUIDE.md` còn trỏ
   `reportPath`/`findingsPath` đã bỏ; `commands/acceptance-init.md` còn quảng
   cáo role `scribe` đã xoá; role `triage` mới chưa được khai ở tài liệu nào bên
   Claude (bản codex đã khai đủ).
5. Bốn ứng viên treo từ round trước: escape `?` trong `globToRe` (chưa có case
   ghim) · P53 bỏ 6 dòng header khỏi so byte · `CLUSTER_RE` không nhận biến thể
   emoji `⚠️` U+FE0F · hint sửa lỗi của P53 in công thức `{ head -6 f; …; } > f`
   **tự huỷ fixture**.

## Bẫy đã dẫm — đọc trước khi chạy S4

1. **Số round lấy từ `## Iterations`, không từ trí nhớ.** Công thức của skill:
   đếm số đoạn `Round N` trong `evidence-report.md` + 1. Ghi chú phiên trước nói
   "chạy round 5" trong khi report đã có đoạn Round 5 (BLOCKED) ⇒ lần chạy thật
   là round 6. Sai chỗ này thì `run_id` mint trùng.
2. **Agent synthesize viết ĐÈ `## Iterations` và làm mất lịch sử.** Round 6 nó
   trả về một Iterations chỉ còn 3 dòng, mô tả sai round 4 là "all evals green"
   trong khi round 4 là BLOCKED. Phiên trước phải ghép tay nguyên văn round 1-5
   từ `git show HEAD:_acceptance/<slug>/evidence-report.md` rồi nối câu round
   mới. **Luôn so `## Iterations` trước khi ghi đè bằng `result.report`.**
   (Đây là ứng viên cho `s4-doc-truth-guard`.)
3. **Trỏ workflow vào NGUỒN, không vào plugin cache.** Kit là nguồn của chính
   plugin nó publish; cache thường tụt version.
   `scriptPath: <repo>/feature-loop/workflows/acceptance-verify.js`.
   Tương tự `personasPath`/`templatePath` lấy từ `skills/acceptance/references/`
   trong repo, không lấy từ `~/.claude/plugins/cache/`.
4. **Thứ tự ghi bắt buộc:** append `result.runLog` vào `run-log.jsonl` **TRƯỚC**,
   rồi mới Write `evidence-report.md`, rồi `review-findings.md`. Workflow trả về
   `runLogWriteFailed: true` là đường bình thường (agent scribe đã bị bỏ hẳn) —
   main loop tự append là đường DUY NHẤT. Đừng dựng lại agent ghi file audit
   dưới bất kỳ hình thức nào: nó bị safety classifier chặn 3 lần liên tiếp và
   chặn lan sang cả synthesize.
5. **`rejectFindings` ≠ "danh sách gây REJECT".** Nó chứa mọi finding
   in-contract (fix-list cho S3); thứ quyết định verdict là
   `triageHighInContract`. Round 6 có 1 phần tử trong `rejectFindings` mà verdict
   vẫn PASS — đúng AC-3, không phải lỗi.
6. **Bất biến CLAUDE.md "thước phải gắn vào vật được giao"** — mọi phép đo mới
   phải phá-vật-thật-một-lần xem nó có đỏ không. Đã thủng ≥9 lượt.

## Công thức dựng args S4 (khỏi suy lại từ đầu)

Main loop đọc file rồi truyền vào `Workflow({scriptPath, args})`:

- `evals`: parse `_acceptance/<slug>/evals.yaml`; resolve `cmd: config:a.b.c`
  theo `_acceptance/config.yaml`, **giữ ref gốc vào field `ref`** (hook L2 không
  nhận lệnh đã resolve).
- `suiteCommands`: resolve `feature_loop.suite_keys` (kit hiện có 5 key).
- `diffBase`: `git merge-base HEAD origin/main`.
- `invokedAt`: `date -u +%Y-%m-%dT%H:%M:%SZ` (script bị cấm `Date`).
- `contractPath`, `repoRoot`, `riskTier` (từ frontmatter contract).
- `inputs` của judgment eval phải là abs path.
- Chạy `dryRun: true` một lần trước — trả fan-out plan, **không tốn agent nào**.

Chi phí tham chiếu (round 6 của `s4-scope-triage`, 16 eval): 21 agent,
145k out-token, ~18 phút. Review (`opus`) và refute là phần đắt nhất; eval máy
chạy `haiku` và rẻ.

## Kiểm tra nhanh khi mở phiên mới

```bash
cd /Users/manh-macmini/dev/acceptance-gate-kit
git status --short && git rev-list --count origin/main..HEAD
grep -m1 '^status' _acceptance/*/contract.md
bash scripts/pre-merge-check.sh . --base "$(git rev-parse HEAD~1)" --no-t1-escape
```

## Preflight cho tài khoản mới

Skill `/feature-loop` và `/acceptance-card` đến từ plugin, mà plugin cache nằm
ở `~/.claude/plugins/` — **cùng người dùng macOS thì dùng chung, khác người
dùng macOS thì phải cài lại**:

```bash
ls -d "$HOME/.claude/plugins/cache"/*/acceptance-gate/*/skills/acceptance/references/
ls -d "$HOME/.claude/plugins/cache"/*/feature-loop/*/workflows/
```

Không thấy ⇒ cài `acceptance-gate` + `feature-loop` từ marketplace
`acceptance-gate-kit`, và cài `superpowers` (feature-loop gọi
`brainstorming` / `writing-plans` / `finishing-a-development-branch`).

Lưu ý: **thiếu plugin không chặn được việc chính** — mọi script chấm điểm
(`pre-merge-check.sh`, `gate-card.js`, `acceptance-verify.js`) đều nằm trong
repo và kit cố ý tự host (xem ghi chú đầu `_acceptance/config.yaml`). Plugin chỉ
cần cho phần điều phối bằng slash command.
