# judge-required-evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** required_evidence chảy trọn 5 chặng judge→memo→report→gate-card→
round-fix; gold set + G3 dẫn xuất từ corpus, không file mới.

**Architecture:** VERDICT_SCHEMA thêm field optional; nghi thức bắt buộc ở
prompt/persona; dấu-thiếu là TOKEN trong khuôn template một-chỗ; gold/G3 là
script đọc-thuần. Hook/evidence-core/lib KHÔNG chạm.

**Global Constraints:**
- Token dấu-thiếu (một chuỗi duy nhất, mọi task dùng nguyên văn): `(judge không nêu bằng-chứng-thiếu)`.
- Khuôn dòng trong block judgment của template: `  required_evidence:` + các dòng `    - <mục>` (hoặc token dấu-thiếu thay danh sách khi judge bỏ trống). Không token L1 CONSISTENCY.
- Stub test SINH TỪ VERDICT_SCHEMA đọc từ source; fixture report SINH TỪ khuôn template (marker `JUDGMENT-BLOCK-TEMPLATE` thêm vào template).
- lib/** + hooks/** không đổi (J11 đo). Bump acceptance-gate 1.33.0 (3 manifest) + feature-loop 1.24.0 (2 manifest); mirror sync; git add đích danh; RED-test từng bản vá.

### Task 1 — acceptance-verify.js: schema + prompt + memo + synthesize (J1,J2,J3)
Modify `feature-loop/workflows/acceptance-verify.js`; Test `tests/workflows/acceptance-verify.test.mjs` (case JR1/2/3, stub sinh-từ-schema qua đọc source). Steps: RED → schema thêm `required_evidence` (array string, description "BẮT BUỘC khi verdict != PASS…"); judge prompt thêm quy định; memo panel lines + carried giữ field; synthesize prompt thêm chỉ dẫn render dòng theo khuôn + token dấu khi vote không-PASS thiếu danh sách → GREEN → commit.

### Task 2 — template + marker (J4)
Modify `skills/acceptance/references/evidence-report-template.md` (block judgment: thêm dòng required_evidence + token dấu, bọc marker `JUDGMENT-BLOCK-TEMPLATE`); Test tests/plugins (JR4: fixture sinh-từ-marker → chạy hooks/acceptance-evidence-gate.js thật → allow; mutant thêm token cấm → hook chặn). independent: false (Task 1 dùng khuôn).

### Task 3 — personas (J7)
Modify `skills/acceptance/references/judge-personas.md` (persona v1 output + luật actionable + calibration chống evidence-shopping); Test tests/plugins JR7 (clauses + mutants).

### Task 4 — gate-card (J5)
Modify `scripts/gate-card.js` (khối "Bằng chứng còn thiếu" cho judgment item — qua tầng tiếng người); Test tests/plugins JR5: fixture-từ-khuôn có danh sách → khối hiện; report cũ → stdout == stdout của gate-card TẠI BASE COMMIT (git show base:script chạy trong test).

### Task 5 — acceptance-gold.mjs + stdout evidence (J8,J9,J13-input)
Create `scripts/acceptance-gold.mjs` (gold từ human_override; G3 từ kind:panel; stdout tiếng người); Test tests/plugins JR8/JR9 (corpus thật ≥7 điểm + ≥5 panel, fixture 2 chiều, ma trận 3 hình dạng đồng thuận, grandfather); sinh `_acceptance/judge-required-evidence/evidence/gold-stdout.txt` bằng chính script (input J13).

### Task 6 — acceptance-report command (J10)
Modify `commands/acceptance-report.md` (bước gọi gold + 2 khối in mẫu tiếng người); Test tests/plugins JR10 (clauses + mutant).

### Task 7 — SKILL 2 harness round-fix (J6)
Modify 2 SKILL (mệnh đề: panel FAIL → đọc required_evidence trước, cấm đoán-mò khi danh sách tồn tại); Test skill-claims JR6 (2 clause + 2 mutant).

### Task 8 — JR11 lõi bất động (tests/scripts)
Test mới `tests/scripts/core-untouched.test.mjs`: git diff base → lib/**+hooks/** 0 đổi (sanity >0 file); recheck corpus == baseline viết-trước (0); tiêm 1 vi phạm vào bản sao → đỏ đúng thông điệp.

### Task 9 — đóng gói
Bump acceptance-gate 1.33.0 (root .claude-plugin + root .codex-plugin + codex/acceptance-gate) + feature-loop 1.24.0 (2 manifest, description nhắc required_evidence/gold); sync mirror; product-map; đủ 4 suite; P88 keyword nếu cần.

### Task 10 — khép S3
Suite cuối + implemented + commit + dispatch S4 NGAY (script nguồn, invokedSha, P2/P3).

## Self-review
AC-1→T1; AC-2→T1+T2; AC-3→T1; AC-4→T2; AC-5→T4; AC-6→T7; AC-7→T3; AC-8/9→T5; AC-10→T6; AC-11→T8; AC-12/13/14 judgment S4 (J13 input từ T5). Đủ 14.
