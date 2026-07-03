# Đợt 3 — Observed Evidence + VLM Second-Opinion Seam — Design Spec

> Ngày: 2026-07-03 · Trạng thái: DRAFT chờ user review
> Phạm vi: acceptance-gate 1.9.2 → 1.10.0 · feature-loop 1.9.0 → 1.10.0
> Không đụng: feature-loop-codex (WIP, pin 1.5.0) · design-loop 0.1.0

---

## 1. Vấn đề

**Failure mode thực tế (video plugin, 2026-07):** verify agent chụp screenshot làm evidence
nhưng **không mở ảnh ra xem**, viết PASS; chỉ khi user chỉ ra "screenshot khác thực tế"
mới bắt đầu kiểm tra → **ảo giác hoàn tất**.

**Root cause cấu trúc:** hook + CI hiện enforce *"evidence đã được THU"*
(`run_id + exit_code + verifier + verified_at + screenshot`) nhưng không có field nào
ép *"evidence đã được XEM"*. Block ui-check trong template chỉ có `screenshot:` (path) —
sự tồn tại file được kiểm, nội dung file thì không ai bị buộc nhìn.

**Chẩn đoán model:** đây là workflow gap, không phải model gap — đổi model grader mà
không ép hành vi "nhìn" thì model nào cũng viết PASS không cần mở ảnh. Cross-family
grader (Gemini) chỉ có giá trị SAU khi hành vi nhìn đã bị cưỡng chế → V1 trước, V2 sau.

**Ràng buộc kiến trúc:** harness `agent()` chỉ nhận model Claude
(`sonnet|opus|haiku|fable`) — không thể route Gemini qua seam `feature_loop.models`.
Chỗ cắm đúng cho model ngoài là **executor** (script eval, exit code là evidence),
giữ nguyên engine/binding split.

## 2. Quyết định đã chốt (Gate brainstorm 2026-07-03)

| # | Quyết định | Lựa chọn |
|---|---|---|
| Q1 | Backward-tolerance cho `observed:` | **Bump `schema_version` 1→2** — core enforce chỉ khi schema_version ≥ 2; report v1 CI chỉ NOTE |
| Q2 | Provider reference script V2 | **Gemini REST + env `GEMINI_API_KEY`** — fetch built-in Node, zero npm dependency, đổi provider = sửa 1 URL + 1 payload |
| — | Phạm vi enforce | Mọi evidence block chứa `screenshot:` (kể cả fallback `.html`), 1 `observed:`/block |
| — | V2 advisory | Opt-in per eval — EVAL-GEN không tự thêm; chỉ câu hỏi đóng |

## 3. V1 — Luật enforce `observed:` (L2 OBSERVED)

### 3.1 Luật

Trong report **PASS-family** có **`schema_version: 2`** (frontmatter): mọi evidence
block chứa `screenshot:` phải có `observed:` **thực chất**. Thiếu/rỗng/placeholder →
hook chặn lúc ghi, CI recheck chặn lúc merge — chung một core, không thể drift.

### 3.2 Cơ chế parse (line-based, không YAML lib — đúng phong cách evidence-core)

- **Block boundary:** payload tách theo dòng khớp `/^\s*-\s+eval\s*[:=]/` — mỗi block
  chạy từ dòng đó tới trước dòng `- eval:` kế / hết section.
- **Trigger:** block có dòng khớp `/^\s*screenshot\s*[:=]/`.
- **Nội dung observed:** dòng khớp `/^\s*observed\s*[:=]\s*(.*)$/i`; giá trị = phần
  inline + các dòng tiếp theo cho tới dòng field kế (`/^\s*(?:-\s+)?[\w-]+\s*[:=]/`)
  hoặc hết block (hỗ trợ `observed: |` đa dòng).
- **Thực chất:** sau khi strip comment (`#...`) và placeholder (`{{...}}`), phần còn
  lại ≥ 20 ký tự (trim). Dưới ngưỡng = coi như thiếu.
- **Kết quả:** field mới `observedFailures[]` trong kết quả `evaluateEvidence`; tính
  vào `anyFailure`. Hook + `recheck-evidence.js` surface message mới này.

### 3.3 Tolerance & rollout

- `schema_version` < 2 hoặc vắng → **skip check** (report cũ của artifact-platform /
  horizon không bị chặn oan khi nâng plugin).
- `pre-merge-check.sh`: **NOTE** (không block) khi report schema v1 có `screenshot:`
  mà không có `observed:` — "khuyên re-verify để nâng schema v2". Mirror pattern
  run-log tolerance hiện có.
- `PENDING-JUDGMENT` không phải PASS-family → không enforce ngay (đúng hành vi hiện
  tại); khi human nâng lên PASS ở Gate 2, hook re-validate lần ghi đó — gồm cả
  observed. Không có đường vòng.

### 3.4 Chuỗi hành vi ép "đã xem" (điểm chạm ngoài core)

| Điểm chạm | Thay đổi |
|---|---|
| `references/evidence-report-template.md` | Template frontmatter `schema_version: 2`; block ui-check mẫu thêm `observed:`; Field notes: observed = mô tả nội dung frame ĐÃ ĐỌC (multimodal Read), đối chiếu expected, không thuật lại lệnh |
| `feature-loop/workflows/acceptance-verify.js` — `UI_SCHEMA` | Thêm property `observed` (string): "mô tả NỘI DUNG nhìn thấy trong từng frame đã lưu, đối chiếu expected". Không vào `required[]` (case `cannotRun` không có frame); prompt + hook là 2 tầng ép |
| Prompt ui agent (cùng file) | Bước bắt buộc sau lưu frame: MỞ từng frame bằng Read (multimodal), ghi `observed` cụ thể; KHÔNG viết từ trí nhớ lệnh; frame `.html` fallback → đọc file, mô tả nội dung asserted. **Mô tả khác expected → assertion FAIL dù exit code 0** |
| Prompt synthesize (cùng file) | Ghi `observed` từ kết quả ui agent vào block ui-check; report `schema_version: 2` |
| `skills/acceptance/SKILL.md` Phase 3 | Cùng chỉ thị cho verify subagent (đường chạy không qua Workflow) |
| Gate 2 (không đổi code) | Human đối chiếu `observed` vs slideshow — mô tả bịa cụ thể sẽ lộ, thành bằng chứng tamper |

## 4. V2 — Seam `executors.ui.vlm_assert`

### 4.1 Reference script `skills/acceptance/references/vlm-assert.reference.mjs`

- Interface: `node scripts/vlm-assert.mjs <image> "<câu hỏi đóng YES/NO>"`.
- Exit code: **0** = YES · **1** = NO · **2** = không chạy được (thiếu
  `GEMINI_API_KEY`, lỗi mạng, file ảnh không đọc được — stderr ghi lý do; machine
  agent map thành `cannotRun` → BLOCKED, không bao giờ false-green).
- Gọi Gemini REST `generateContent`: `fetch` built-in (Node ≥ 18), ảnh inline
  base64, ép trả lời một từ YES/NO; parse chặt — không phải YES/NO rõ ràng → exit 2.
- Script sống ở **REPO tiêu thụ** (scaffold như `ui-capture.reference.mjs` — kit
  không ôm dependency/API key).

### 4.2 Wiring

- `commands/acceptance-init.md`: bước tùy chọn **3c** — copy reference thành
  `scripts/vlm-assert.mjs`, hướng dẫn set `GEMINI_API_KEY`, thêm config
  `executors.ui.vlm_assert: "node scripts/vlm-assert.mjs"` (entry chuẩn để gọi
  tay/CI; eval không dùng trực tiếp key này vì thiếu chỗ truyền args per-eval).
- **Wiring per eval (pattern wrapper):** ảnh + câu hỏi là per-eval, mà eval
  `script` chỉ có `cmd` → mỗi assertion là một wrapper mỏng của repo
  (`scripts/vlm/<slug>-<eval>.sh`, 1-2 dòng gọi
  `node scripts/vlm-assert.mjs <ảnh> "<câu hỏi>"`); `cmd`/`verifier` của eval =
  path wrapper — script path là authentic verifier hợp lệ per L2 (tiền lệ:
  `verifier: scripts/verify-ui-login.sh` trong template hiện hành). Zero thay
  đổi engine.
- `references/eval-executors.md`: subsection mới "External VLM second-opinion
  (optional)" — eval `script` opt-in theo pattern wrapper trên, kèm ví dụ shape.

### 4.3 Ranh giới triết lý (ghi thẳng vào docs)

- **Chỉ câu hỏi đóng** (assertion): "frame có hiển thị video player ≥300px không?".
- **Cấm câu hỏi mở** ("nhìn có đẹp/ổn không") — đó là địa hạt judgment/design-loop;
  giữ nguyên nguyên tắc *No blind VLM judge*.
- Opt-in per eval; EVAL-GEN không tự sinh eval VLM (khác design 2b default-on).

## 5. Test plan (TDD — RED trước)

| Suite | Case |
|---|---|
| `tests/hooks` | PASS v2 + screenshot + không observed → **BLOCK** · PASS v2 + observed đủ → pass · PASS v2 + observed `{{placeholder}}`/<20 ký tự → **BLOCK** · PASS v1 (schema_version vắng/1) + screenshot không observed → **tolerated** · block judgment không screenshot → không đòi observed · fallback `.html` + không observed → **BLOCK** |
| `tests/scripts` | `recheck-evidence.js` cùng luật (chung core) · `pre-merge-check.sh` NOTE case v1 · `vlm-assert.reference.mjs`: thiếu args → exit 2 + usage; thiếu `GEMINI_API_KEY` → exit 2 + stderr rõ; ảnh không tồn tại → exit 2 (không gọi mạng trong test) |
| `tests/workflows` | Pin `UI_SCHEMA` có property `observed` · prompt ui agent chứa chỉ thị đọc-frame/observed · prompt synthesize chứa observed + schema_version 2 (pattern W10/E05 — AI đổi phải chủ động sửa test) |
| `tests/plugins` | Packaging sync `plugins/acceptance-gate/` mirror root (sync-plugin-packages.sh) |

## 6. Versioning & quy trình

- **acceptance-gate 1.10.0** (minor: template schema v2 + check core mới + scaffold V2).
- **feature-loop 1.10.0** (minor: UI_SCHEMA + 2 prompt).
- Nếp thực hiện: preflight main+pull+suite xanh → TDD RED→GREEN → bump version +
  `sync-plugin-packages.sh` + suite xanh toàn bộ → **DỪNG chờ user xác nhận** →
  commit/push theo nhóm logic.
- Docs kèm: GUIDE.md thêm mục ngắn Đợt 3 (observed + vlm-assert).

## 7. Out of scope

- Không route Gemini qua `feature_loop.models` (harness không hỗ trợ model ngoài).
- Không thêm field `advisory:` vào schema evals (YAGNI — opt-in đã đủ).
- Không per-frame observed (1 observed/block đủ cho Gate 2 đối chiếu slideshow).
- Không đụng feature-loop-codex, design-loop.
- Không auto-thêm eval VLM ở EVAL-GEN.
