# Model theo giai đoạn (docs-only 1.11.2) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tài liệu hóa "model theo giai đoạn" — mục GUIDE về `feature_loop.models` (syntax + cảnh báo alias + giới hạn phạm vi) + combo đổi-ca-tại-Gate-1 + 1 vế nối câu SKILL /goal, đúng spec `docs/specs/2026-07-08-model-switchpoint-design.md`.

**Architecture:** Docs-only, zero cơ chế. GUIDE mang source-of-truth (mục 4.7 mới + combo trong 4.6); SKILL nối 1 vế mềm vào câu /goal 1.11.1. Package acceptance-gate sinh bằng sync script.

**Tech Stack:** Markdown VN + `scripts/sync-plugin-packages.sh` + 3 bash test suites.

## Global Constraints

- Docs-only; KHÔNG đụng bảng route `MODEL_ROUTES`, script, hay `/acceptance-init` (spec §6 bác cross-plugin coupling).
- Alias model hợp lệ = tier alias `sonnet | opus | haiku | fable` — chuỗi version ("opus-4.8", "sonnet-5") bị harness từ chối; cảnh báo này là source-of-truth ở GUIDE mục 4.7 (spec §3 khối 3).
- Vế SKILL viết MỀM, KHÔNG nhánh if theo tên model (spec C2: self-identify không tin cậy, model tương lai tên khác → câu im lặng chết); đi BÊN TRONG câu /goal 1.11.1 vốn conditional theo "user muốn rời máy".
- Đóng khung: cost-optimization, KHÔNG phải correctness-fix (spec §1, Skeptic surprise) — giọng docs không nghiêm trọng hóa.
- Chỉ sửa bản ROOT; `plugins/acceptance-gate/` sinh qua `bash scripts/sync-plugin-packages.sh`. KHÔNG đụng `plugins/feature-loop-codex`, `design-loop/`.
- Commit tiếng Việt `<type>(<scope>): ...`, KHÔNG Co-Authored-By, KHÔNG push (user duyệt cuối rồi mới push).
- L1 (pin config artifact-platform) đã đi riêng PR #155 — NGOÀI phạm vi plan này.

---

### Task 1: GUIDE — mục 4.7 "Model theo giai đoạn" + combo trong 4.6 + TOC

**Files:**
- Modify: `GUIDE.md` (mục mới sau "## Chạy không-người-trông đoạn máy với /goal", ~sau dòng 220 hiện tại; sửa trong mục /goal; TOC ~dòng 9-19)

**Interfaces:**
- Produces: heading `## Model theo giai đoạn (feature_loop.models) (1.11.2)` — Task 2 cross-ref ("GUIDE mục 'Model theo giai đoạn'").

- [ ] **Step 0: Preflight.** `git status --porcelain | wc -l` → 0; baseline `bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh && bash tests/plugins/run-tests.sh` → 51/0 · 151/0 · all pass. Đỏ → DỪNG báo user. Xác nhận mục "/goal" hiện có: `grep -c '## Chạy không-người-trông' GUIDE.md` → 1.

- [ ] **Step 1: Chèn mục 4.7 mới** NGAY SAU toàn bộ mục "## Chạy không-người-trông đoạn máy với /goal (1.11.1 …)" (trước heading kế "## 5. Cài đặt"), nguyên văn:

```markdown
## Model theo giai đoạn (feature_loop.models) (1.11.2)

Một feature đi qua nhiều loại việc: **thiết kế** (S1 brainstorm, S2 plan — giải-không-gian
mở, sai số compound xuống dưới), **săn bug** (S4 finder — recall, không có lưới đỡ),
**thực thi + chấm scoped** (S3 coding, judge, ui — có lưới: verify per-task + S4 re-grade +
majority + người ở Gate 2), và **cơ học** (machine chạy lệnh, scribe chép log). Nguyên tắc
xếp model: **đắt nhất nơi không-có-lưới và sai số compound · vừa nơi có lưới · rẻ nơi cơ học.**

Bảng route mặc định của kit **đã encode sẵn** nguyên tắc này — machine/scribe→haiku,
ui/judge/refute/baseline/provenance/synthesize→sonnet — và **chỉ 2 vai kế thừa model
phiên**: `finder` (S4 bug-recall) và `executor` (S3 nhánh song song). Muốn ghim khác
mặc định, khai trong `_acceptance/config.yaml`:

```yaml
feature_loop:
  models:
    finder: opus      # S4 bug-recall — không kế thừa model phiên nữa
    executor: opus    # S3 nhánh song song (muốn rẻ hơn: sonnet)
```

Vai nhận override: `machine · ui · judge · finder · refute · baseline · provenance ·
scribe · synthesize` (S4 verify) + `executor` (S3 execute). Giá trị `session` = kế thừa
model phiên (mặc định của `finder`/`executor`).

**⚠ Alias model:** harness CHỈ nhận **tier alias** — `sonnet` · `opus` · `haiku` · `fable`
— alias tự trỏ bản mới nhất của tier đó. Chuỗi có số version (kiểu `opus-4.8`, `sonnet-5`)
bị harness **từ chối** khi spawn agent. Luôn dùng alias trần.

**Giới hạn phạm vi:** pin `executor` chỉ cắn nhánh S3 **song song** (khi plan có ≥2 task
`independent`). S3 **tuần tự** (đường mặc định) code ngay trong main loop = **model phiên** —
config không với tới; muốn đổi phải đổi ca model tại Gate 1 (xem mục /goal ở trên).
```

- [ ] **Step 2: Sửa mục 4.6 (/goal) — thêm combo.** Trong mục "## Chạy không-người-trông…", tìm dòng `**Khi nào:** ngay sau khi bạn duyệt Gate 1, trước khi rời máy.` và chèn NGAY SAU nó (trước khối `**Template…`) đoạn:

```markdown
**Combo rời-máy trọn bộ (phiên đang chạy model đắt cho phần thiết kế):** duyệt Gate 1 →
`/model claude-opus-4-8` (đoạn máy S2→S4 không cần tier thiết kế — S3 tuần tự + điều phối
S4 chạy model phiên) → dán `/goal` theo template dưới → rời máy. Các vai agent-hóa được đã
ghim qua `feature_loop.models` (xem mục "Model theo giai đoạn" ngay dưới).
```

- [ ] **Step 3: Entry mục lục.** Trong "## Mục lục", NGAY SAU dòng entry `4.6. [Chạy không-người-trông…]`, thêm dòng — sao chép ĐÚNG FORMAT anchor-link của entry 4.6 liền trên, title `Model theo giai đoạn (feature_loop.models) (1.11.2)`, anchor GitHub tương ứng `#model-theo-giai-đoạn-feature_loopmodels-1112`. (Anchor GitHub: hạ chữ thường, space→`-`, bỏ ký tự đặc biệt trừ gạch nối/gạch dưới; `.`→bỏ, `()`→bỏ.)

- [ ] **Step 4: Verify.** `grep -c 'Model theo giai đoạn' GUIDE.md` → **2** (TOC + heading); `grep -c 'feature_loop.models' GUIDE.md` → ≥ 1; `grep -c 'claude-opus-4-8' GUIDE.md` → 1 (combo); `grep -cE 'opus-4\.8|sonnet-5' GUIDE.md` → ≥ 1 (cảnh báo alias có nêu chuỗi cấm — đúng chủ đích); mục /goal cũ còn nguyên (`grep -c 'Chạy không-người-trông' GUIDE.md` → 2).

- [ ] **Step 5: Commit.** `git add GUIDE.md && git commit -m "docs(guide): mục Model theo giai đoạn — feature_loop.models + cảnh báo alias + combo đổi-ca Gate 1 (1.11.2)"`

---

### Task 2: feature-loop SKILL — nối vế /model vào câu /goal Gate 1

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (section `## GATE 1`)

**Interfaces:**
- Consumes: heading GUIDE 4.7 của Task 1 (cross-ref "Model theo giai đoạn").

- [ ] **Step 1: Nối vế.** Trong section GATE 1, câu /goal 1.11.1 hiện KẾT THÚC bằng `…(hook chặn chữ ký máy → spin vô hạn).` Nối NGAY SAU dấu chấm đó (cùng đoạn), nguyên văn:

```markdown
Kèm theo: nếu phiên đang chạy model đắt hơn mức đoạn máy cần (vd tier thiết kế), in thêm gợi ý `/model claude-opus-4-8` TRƯỚC dòng /goal — S3 tuần tự + điều phối S4 chạy model phiên nên đổi ca ở Gate 1 là điểm rẻ nhất (GUIDE mục "Model theo giai đoạn"); KHÔNG tự đổi model (là lệnh của user).
```

- [ ] **Step 2: Verify.** `grep -c 'claude-opus-4-8' feature-loop/skills/feature-loop/SKILL.md` → 1; `grep -c 'Model theo giai đoạn' ...SKILL.md` → 1; các bar cũ nguyên: `grep -c '/goal' ...SKILL.md` → 2 (câu 1.11.1), `grep -c '^| \*\*CT' ...` → 2, `grep -c 'decisions.jsonl' ...` → 5, `grep -c 'signed-off' ...` → 3.

- [ ] **Step 3: Commit.** `git add feature-loop/skills/feature-loop/SKILL.md && git commit -m "feat(feature-loop): gợi ý đổi ca /model sau Gate 1 — đoạn máy không cần tier thiết kế"`

---

### Task 3: Bump 1.11.2 + sync + suites + release

**Files:**
- Modify: `.claude-plugin/plugin.json` (`1.11.1` → `1.11.2`), `feature-loop/.claude-plugin/plugin.json` (`1.11.1` → `1.11.2`)
- Generated: `plugins/acceptance-gate/**` qua sync script

- [ ] **Step 1:** Sửa field `version` trong 2 file trên (CHỈ field version). design-loop KHÔNG đổi (0.2.0).
- [ ] **Step 2:** `bash scripts/sync-plugin-packages.sh` — Expected: `Synced ... (version 1.11.2)`.
- [ ] **Step 3:** Chạy CẢ BA suite — Expected: hooks 51/0 · scripts 151/0 · plugins all pass (P03 canh 4 manifest acceptance-gate cùng 1.11.2; P06 design-loop khớp nhau, không đổi → xanh). Đỏ → DỪNG, không release.
- [ ] **Step 4:** `git status` soát: 2 manifest + plugins/acceptance-gate (GUIDE + manifests) — file lạ → DỪNG.
- [ ] **Step 5: Release commit.** `git add -A && git commit -m "Release: acceptance-gate 1.11.2 / feature-loop 1.11.2 — model theo giai đoạn: đổi ca tại Gate 1 + docs feature_loop.models (docs-only)"` — thân 3 ý: mục GUIDE 4.7 (syntax models + cảnh báo alias + giới hạn executor) · combo /model+/goal sau Gate 1 · docs-only, L1 pin đã đi riêng PR #155 artifact-platform. KHÔNG push.

---

## Self-review đã chạy (khi viết plan)

- **Spec coverage:** §3 (GUIDE 4.7, 4 khối) → T1 Step 1 · §4 (sửa 4.6 combo) → T1 Step 2 · "entry mục lục 4.7" → T1 Step 3 · §5 (vế SKILL) → T2 · §6 đã-bác (acceptance-init/if-Mythos/đổi-route/auto-switch) → không task nào làm · §7 (nơi chạm + release) → T3. Không gap.
- **Placeholder scan:** T1 Step 3 "sao chép đúng format anchor entry 4.6" + công thức anchor GitHub tường minh — chỉ dẫn đọc-rồi-khớp có chủ đích (format anchor phụ thuộc convention file thật); còn lại nguyên văn.
- **Type consistency:** heading GUIDE "Model theo giai đoạn (feature_loop.models) (1.11.2)" trong T1 = chuỗi T2 cross-ref; version 1.11.2 nhất quán T1-heading/T3/commit; alias `opus`/`sonnet`/`haiku`/`fable` (trần) khớp constraint; câu SKILL không nhánh if (đúng C2).
