# Acceptance-Gate Kit v1 — Design Spec

> Ngày: 2026-06-10 · Trạng thái: DRAFT chờ user review
> Repo: `~/dev/acceptance-gate-kit/` (standalone, plugin-shaped từ ngày 1)
> Consumer đầu tiên: OneHub Artifact Platform

---

## 1. Vấn đề & Mục tiêu

**Vấn đề:** Thời gian đội ngũ review code/tính năng do Claude Code tạo ra là bottleneck của quy trình phát triển OneHub. Khâu nặng nhất theo ưu tiên: (c) acceptance/QA → (b) architecture review. Hiện trạng acceptance: click tay qua UI, ad-hoc, chưa có quy trình rõ — 100% chi phí là thời gian con người (~1-2h/feature), và là khâu dễ bị bỏ qua khi bận.

**Mục tiêu v1:** Giảm ≥50% thời gian người cho khâu acceptance mà không giảm chất lượng gate, bằng cách dịch chuyển human attention từ "tự click toàn bộ" sang "duyệt tiêu chí trước khi code + đọc evidence report sau khi code".

**Cảm hứng:** Pattern self-generated evals + self-evaluation của Skill Creator, tổng quát hóa — KHÔNG sao chép rập khuôn. Căn cứ ngành: lỗi AI-generated code cluster quanh vi phạm spec (spec-as-quality-gate); review sandwich giảm 30-50% thời gian human review; doer ≠ grader là best practice chính thức của Anthropic.

**Phạm vi v1:** Gate (c) acceptance/QA. Gate (b) architecture là Phase 2.

## 2. Bối cảnh consumer (OneHub)

- **Đầu vào hỗn hợp:** feature lớn có spec/PRD, feature nhỏ là prompt trực tiếp, có khi là ticket ngắn → cần bước normalize ở đầu phễu.
- **Đa bề mặt:** API / backend / SDK / CLI / web UI → evals cần nhiều loại executor; phần API/CLI/SDK máy chấm được 100%.
- **Acceptance hiện tại:** thủ công, ad-hoc.

## 3. Nguyên tắc thiết kế

1. **Doer ≠ grader** — agent viết code không tự chấm. Verification chạy bằng subagent context tươi.
2. **Evidence over assertion** — mọi verdict PASS kèm evidence block `{run_id, exit_code, verifier, verified_at}` do máy tạo. Hook chặn ở write-time (port từ `no-self-verdict.js` của Skill Factory).
3. **Người gác 2 cổng đòn bẩy cao** — duyệt contract+evals trước khi code (sửa 1 dòng tiêu chí ở đây rẻ hơn 10 lần phát hiện sai sau khi code), và sign-off trên evidence report sau khi code.
4. **Không bureaucratize việc vặt** — risk tier T1 bỏ qua kit hoàn toàn.

## 4. Kiến trúc 3 lớp (engine / binding / data)

| Lớp | Gồm gì | Sống ở đâu |
|---|---|---|
| **Engine** (portable) | Skill `acceptance` 3-phase, hook evidence-gate, templates, quy ước 4 executor, judge personas | Kit repo này — đóng gói plugin, dùng chung mọi repo |
| **Binding** (per-repo) | Lệnh chạy test từng surface, cách start dev server, risk tier overrides, glob T1-skip, ai được sign-off | `_acceptance/config.yaml` trong từng consumer repo |
| **Data** (per-feature) | `contract.md`, `evals.yaml`, `evidence-report.md`, `evidence/` | `_acceptance/{feature-slug}/` trong consumer repo — không bao giờ rời repo |

**Lý do tách:** kit "không mở rộng được" qua repo khác hầu như luôn do trộn binding vào engine (hardcode `npm test`, đường dẫn, tên service). Tách từ ngày 1 → mở rộng = thêm 1 file config.

## 5. Cấu trúc kit repo (plugin-shaped từ ngày 1)

```
acceptance-gate-kit/
  .claude-plugin/plugin.json        # plugin metadata (Cowork V0-V7 compliant)
  skills/acceptance/
    SKILL.md                        # skill 3-phase: normalize → eval-gen → verify
    references/
      contract-template.md
      eval-executors.md             # quy ước 4 loại executor
      evidence-report-template.md
      judge-personas.md             # persona cho judgment items
  hooks/
    hooks.json
    acceptance-evidence-gate.js     # port logic no-self-verdict.js
  commands/
    acceptance-init.md              # scaffold _acceptance/ + config.yaml cho repo mới
    acceptance-status.md            # trạng thái gate các feature đang mở
  scripts/
    pre-merge-check.sh              # consumer repo copy vào CI
  docs/specs/                       # spec này
```

## 6. Flow — 6 bước, 2 cổng người

| # | Bước | Ai | Thời gian người |
|---|------|----|----|
| 1 | **Normalize**: input bất kỳ (prompt/ticket/PRD) → `contract.md`: context, 5-15 tiêu chí Given/When/Then, out-of-scope, risk tier, surfaces (api/cli/sdk/ui) | Máy | 0 |
| 2 | **Eval-gen**: contract → `evals.yaml`; mỗi eval: id, criterion ref, executor type, steps, expected, evidence requirement | Máy | 0 |
| 3 | 🚪 **Cổng #1 — duyệt contract + evals**. Approve = thêm `approved_by` + date vào frontmatter contract | **Người** | 5-10 phút |
| 4 | **Implement**: Claude Code code, biết trước evals phải pass | Máy | 0 |
| 5 | **Verify**: subagent tươi chạy từng eval → `evidence-report.md` (mỗi eval 1 verdict + link evidence; verdict tổng PASS / PENDING-JUDGMENT khi machine evals pass nhưng judgment items chờ người / REJECT + failed_evals[] / BLOCKED + reason). FAIL → quay bước 4, tối đa 3 vòng rồi escalate | Máy | 0 |
| 6 | 🚪 **Cổng #2 — sign-off**: đọc report, spot-check 1-2 evidence, click tay CHỈ judgment items máy đánh UNCERTAIN. Ký `human_signoff` | **Người** | 5-10 phút |

Tổng thời gian người: ~15-20 phút có cấu trúc, so với 1-2h click tay hiện tại.

## 7. Bốn loại executor

| Executor | Bề mặt | Cơ chế chấm |
|---|---|---|
| `test` | API / backend / SDK | Chạy test runner / integration test; verdict = exit code. Máy 100%. |
| `script` | CLI | Chạy lệnh thật, so output với expected. Máy 100%. |
| `ui-check` | Web UI | Subagent drive browser (Claude Preview MCP local / Chrome MCP staging); assertion + screenshot evidence. Máy chấm, người liếc screenshot. |
| `judgment` | Mọi bề mặt ("đúng ý nghiệp vụ?") | Judge subagent context tươi đọc contract + evidence → PASS / FAIL / **UNCERTAIN** kèm lý do. UNCERTAIN bắt buộc đẩy lên người — judge không được đoán. |

## 8. Enforcement — 2 lớp

1. **Hook write-time** (`acceptance-evidence-gate.js`): đọc verdict TỔNG từ frontmatter của report (tránh false-block khi REJECT/PENDING chứa per-eval PASS); chặn ghi verdict PASS/ACCEPTED thiếu evidence block, có UNCERTAIN chưa được người resolve qua `human_override`, hoặc — với T3 — judgment item thiếu human verdict trực tiếp (hook đọc `risk_tier` từ contract cạnh report). Verdict hợp lệ thay thế: PENDING-JUDGMENT (chờ Gate 2), REJECT + failed_evals[], BLOCKED + reason. Hook đọc ngưỡng enforcement từ `config.yaml` của consumer repo (chính sách per-repo), không hardcode trong plugin.
2. **Pre-merge check** (`pre-merge-check.sh` trong CI consumer): branch không merge nếu `_acceptance/{slug}/evidence-report.md` thiếu `human_signoff` (feature T2/T3).

## 9. Risk tiers

- **T1** (typo, copy, config nhỏ — match glob trong config.yaml): bỏ qua kit hoàn toàn.
- **T2** (feature thường): full flow 6 bước.
- **T3** (auth, data, breaking API): full flow + judgment items **bắt buộc người trực tiếp**, không nhận verdict judge.

Định nghĩa tier cụ thể (glob, path patterns) là binding per-repo trong `config.yaml`.

## 10. Schema versioning & cross-repo

- Mọi artifact (contract/evals/report) có `schema_version` trong frontmatter — engine nâng cấp thì artifacts cũ của repo khác vẫn parse được (bài học migration shim seedance v3→v8).
- Lệnh `/acceptance-init` scaffold `_acceptance/config.yaml` + cấu trúc thư mục cho repo mới trong 1 phút.
- Kit phát triển tại repo này; pilot tích hợp vào OneHub qua install plugin (hoặc symlink/copy trong giai đoạn calibrate để vòng lặp sửa-thử nhanh).

## 11. Đo lường pilot

- Ghi `time_human_minutes` per cổng vào frontmatter contract.
- Baseline: ước lượng thời gian acceptance của 3 feature gần nhất trước pilot.
- **Tiêu chí thành công pilot (2-3 feature trên OneHub):** thời gian người giảm ≥50% VÀ 0 defect nghiệp vụ lọt qua gate.

## 12. Lộ trình

1. **Build kit v1** (repo này): SKILL.md + templates ~0.5-1 ngày · hook port ~1-2h · commands + scripts ~0.5 ngày.
2. **Pilot trên OneHub:** 2-3 feature thật, calibrate contract/eval shapes, đo metrics.
3. **Phase 2** (sau khi shape ổn định): gate (b) architecture (contract thêm section constraints + ADR refs, judge persona architecture-fit) · golden dataset regression từ bug thực · package chính thức qua BSA pipeline · risk-tier auto-routing.

## 13. Out of scope v1

- Gate (b) architecture review.
- Golden dataset / regression evals trong CI.
- Metrics dashboard.
- Multi-repo rollout (chỉ chuẩn bị nền móng qua kiến trúc 3 lớp; rollout thật là Phase 2).
