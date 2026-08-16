# Cổng chặn nhầm chỗ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lưới trước-merge cho làn V qua đúng như hook (mo + T2 + vết + (xanh-sạch ∨ đã ký)); gỡ lớp chứng-minh-chữ-ký-bằng-commit, thay bằng NOTE chiều-ghi + provenance forge; văn chỉ dẫn/scaffold/tests/ADR theo.

**Architecture:** Một hàm `xanh_sach_check` trong `pre-merge-check.sh` (rút từ khối đợt 2, KHÔNG viết bản hai) dùng ở hai chỗ: luật Gate-1 (mới) và luật chữ-ký-rỗng (cũ). Khối provenance commit → một NOTE. Lưới mới NOTE chiều-ghi so BASE. Răng hồ sơ `ccnc-rang.sh` 8 chân dựng fixture git code-sinh và chạy CHÍNH pre-merge/hook/recheck.

**Tech Stack:** bash + node (lib/md-section.cjs) + python3 (checker).

**Spec:** `docs/superpowers/specs/2026-08-16-cong-chan-nham-cho-design.md` · contract `_acceptance/cong-chan-nham-cho/contract.md` · hình `figures/01`, `figures/02`.

## Global Constraints

- T3: KHÔNG chạm `lib/`, `hooks/` (hook đã hiểu V; `human_signoff` khác rỗng + không giữ-chỗ vẫn là điều kiện `signed-off`). Chỉ chạm `scripts/pre-merge-check.sh` trong lõi.
- KHÔNG thêm khoá config mới. `placeholder_signoff` giữ nguyên.
- Thông điệp ghim đúng evals.yaml (E1–E11). Số ca: scripts 686→691, plugins 145→145 (SO-CA-PHAN-RA).
- MEASURE-BIRTH-CLAUSE: mỗi ca/chân mới có cặp hai chiều trên cùng fixture.

---

### Task 1: pre-merge — hàm xanh-sạch dùng chung + luật Gate-1 hiểu làn V

**Files:** Modify `scripts/pre-merge-check.sh` (Gate-1 rule ~578–590; khối xanh-sạch ~766–806)

- [ ] Rút khối xanh-sạch thành `xanh_sach_check() { # $1 report → 0 sạch / 1 không; đặt CLEAN_WHY }` (giữ nguyên từng điều kiện + thông điệp), gọi lại tại chỗ cũ.
- [ ] Trong luật Gate-1: khi `approved_by` rỗng và không `gate1_skipped`: đọc `veto_state`, `veto_opened_at`, `risk_tier`; `mo` → nếu tier ≠ T2 → VIOLATION «approved_by is empty — làn V chỉ T2 …»; nếu vết không parse (`date -j`/`node -e Date.parse`) → VIOLATION «… veto_opened_at không đọc được»; else nếu report tồn tại và (`human_signoff` khác rỗng ∨ `xanh_sach_check`) → `echo "NOTE [$slug]: làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở"` và KHÔNG continue; else VIOLATION «approved_by is empty — làn V đòi xanh-sạch hoặc chữ ký ($CLEAN_WHY)». Vắng khoá → nhánh cũ nguyên văn.
- [ ] Chạy `bash scripts/pre-merge-check.sh --base origin/main` trên repo → còn xanh (cat-khoi đã có approved_by).

### Task 2: pre-merge — khối provenance → NOTE hết-hiệu-lực; NOTE chiều-ghi

**Files:** Modify `scripts/pre-merge-check.sh` (~223–235 đọc khoá; ~836–890 khối provenance; sau vòng per-slug: NOTE tổng)

- [ ] Giữ đọc `REQ_HUMAN_COMMIT`/`AGENT_AUTHORS` (đường đọc-cũ). Thay toàn khối provenance bằng: nếu một trong hai khoá set → đặt `LEGACY_SIGN_KNOB=1`. Sau vòng per-slug in đúng MỘT dòng `NOTE: signoff.require_human_commit/agent_authors đã hết hiệu lực từ 2.1 — provenance chữ ký lấy từ forge (PR approval / người bấm merge); gỡ khoá khỏi config.yaml`. Allowlist khai-in-ra: comment `# CCNC-ALLOWLIST: 4 dòng` ngay trên.
- [ ] NOTE chiều-ghi: trong per-slug, khi có `--base` và `human_signoff` khác rỗng: `base_sig="$(git show "$BASE:$rel_report" 2>/dev/null | front_field_stdin human_signoff)"`; rỗng→khác rỗng → `echo "NOTE [$slug]: chữ ký mới trong diff — $signoff — provenance ở forge: người bấm merge xác nhận đây là quyết định của người"`.
- [ ] Sanity: chạy trên repo → NOTE hết-hiệu-lực xuất hiện (config kit còn khoá) và không VIOLATION.

### Task 3: văn chỉ dẫn + scaffold + ADR

**Files:** `commands/signoff.md` (frontmatter, đoạn mở, bước 1 và 7, SIGNATURE-OWNER-CLAUSE) · `skills/acceptance/SKILL.md` (~294–323) · `feature-loop/skills/feature-loop/SKILL.md` (~186 S4, ~211 Gate 2, ~31 re-pin «không đụng dòng human-owned») · `GUIDE.md` (596–597, 762–764, 790, 820, 855, 918) · `README.md` (36–41, 179) · `QUICKSTART.md` (136) · `CONTEXT.md` (85, 164–165) · `commands/acceptance-init.md` (84–92) · Create `docs/adr/0012-chu-ky-la-quyet-dinh-provenance-tu-forge.md`

- [ ] `SIGNATURE-OWNER-CLAUSE` mới (nguồn signoff.md, chép nguyên văn sang SKILL): «Chữ ký là quyết định của người: người phát ngôn «Ký» hay «Trả lại»; máy ghi hộ vào hồ sơ và commit cùng lượt; máy không bao giờ tự phát ngôn Ký (ADR 0002). Provenance nằm ở forge — người approve/merge PR — không ở lịch sử commit.»
- [ ] signoff.md: bước 1 «Machine-evidence commit first» → «Đảm bảo gói bằng chứng máy đã commit (không bắt buộc tách)»; bước 7 → «Ghi và commit: sau khi người phát ngôn, ghi human_override/human_signoff/verdict/status: signed-off, vẽ lại bản đồ nếu repo bật, commit MỘT lượt». Xoá mọi «human-fields-only», «own commit», `require_human_commit`.
- [ ] Các file còn lại: thay câu nghi lễ bằng «provenance ở forge»; GUIDE §7.1 re-pin bỏ vế «không đụng dòng human-owned» → «không đụng chữ ký người»; init scaffold bỏ 2 khoá; CONTEXT.md mục `signoff` viết lại; README dòng 39–41 và 179.
- [ ] ADR 0012 một đoạn: khó đảo (đội đã quen nghi thức; gỡ rồi khó dựng lại tin) · bất ngờ (chữ ký không còn cần commit riêng, squash được) · trade-off (mất chuỗi chứng cứ git; đổi lấy provenance forge + NOTE chiều-ghi; điều kiện: repo >1 người nên bật require approval).
- [ ] `grep -rn "require_human_commit\|agent_authors\|human-fields-only\|human-owned\|commit RIÊNG" commands skills feature-loop scripts lib hooks GUIDE.md QUICKSTART.md README.md CONTEXT.md` → chỉ còn allowlist trong pre-merge.

### Task 4: tests

**Files:** `tests/scripts/run-tests.sh` (H01–H06 ~1954–2060; UJ3 ~3418; thêm V01–V05) · `tests/plugins/run-tests.sh` (P24 ~121–128; P30 ~208; P194 ~9629)

- [ ] H01–H06 đổi kỳ vọng: H02/H03/H06 → clean + hasout NOTE hết-hiệu-lực; H04 clean; H05 → NOTE hết-hiệu-lực, không «unverifiable». Sửa tiêu đề echo.
- [ ] UJ3: fixture bỏ nghi thức hai commit (một commit), kỳ vọng vẫn VIOLATION placeholder.
- [ ] Thêm `mk_v` fixture (contract mo/vết/T2 + report sạch qua `uj_full`-style) và V01–V05 theo SO-CA-PHAN-RA, mỗi ca `check`/`hasout` đúng thông điệp.
- [ ] P24 needle: bỏ `require_human_commit: true`, giữ `recheck: strict`, thêm chiều đỏ «scaffold còn require_human_commit → đỏ». P30 needle: `require_human_commit`,`own commit` → `provenance`,`forge`. P194: gỡ chân «than signoff thieu require_human_commit».
- [ ] Chạy 4 suite → xanh; scripts `Results: 691 passed`; plugins 145.

### Task 5: răng hồ sơ + executor keys + bản đồ

**Files:** Create `_acceptance/cong-chan-nham-cho/ccnc-rang.sh` (chân lan-v · lan-v-do · provenance · giu-cho · nghi-le · clause · so-ca [--log] · chieu-ghi · adr; `--tu-kiem`) · Modify `_acceptance/config.yaml` (9 khoá `ccnc_*`)

- [ ] Fixture git code-sinh (hàm `dung_ho_so <dir> <opts>`), chạy CHÍNH `$ROOT/scripts/pre-merge-check.sh --base <sha0>`; base worktree cho đối chứng dương.
- [ ] Mỗi chân in đúng pinned của evals; `--tu-kiem` chạy mutant qua chính checker.
- [ ] `config-patch.mjs` thêm 9 khoá; `product-map.mjs` vẽ lại + `--check`.
- [ ] Commit; `status: implemented`; dispatch S4.
