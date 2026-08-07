---
name: acceptance-report
description: Aggregate Acceptance Gate metrics across all features on Codex — human-touch frequency from git (new KPI), verdict mix, gate hygiene (skips, bypasses, stale evidence). Read-only. Use when the user asks whether the gate pays off, báo cáo hiệu quả gate, or wants acceptance metrics.
---

# Acceptance Report for Codex

Answer "is the gate paying for itself?" from what the gates already recorded.
KPI phía người (charter tái lập 2026-08-07): **tần suất sự-kiện-cần-người** —
đếm từ git bằng lệnh chuẩn (chạy được nguyên văn):
`git log --format=%H -G'human_signoff|human_override|approved_by' -- _acceptance/<slug>/`
(đếm dòng = số lần người ra tay tại cổng). `time_human_minutes` cũ là dữ liệu
TỰ KHAI — KHÔNG ĐÁNG TIN ("tự khai — không đáng tin", 2026-08-07): chỉ trình
dưới nhãn đó, không trích làm bằng chứng hiệu quả, không coi thiếu-nó là lỗ
vệ sinh. This skill reads them. Read-only: modify nothing while reporting.

Optional arg `--since YYYY-MM-DD`: include only features whose `approved_at`
or `verified_at` is on/after that date.

## 1. Scan

Scan `_acceptance/*/` (skip `config.yaml`, `README.md`). Parse:

- `contract.md` frontmatter: `slug`, `risk_tier`, `status`, `approved_by`,
  `approved_at`, `gate1_skipped` (va `time_human_minutes` {gate1, gate2};
- `evidence-report.md` frontmatter when present: `verdict`, `human_signoff`,
  `verified_at`, `verified_commit`, `enforcement_mode`, `bypass_used`,
  `bypass_ack`, `failed_evals`;
- `run-log.jsonl` when present: line count, plus the report's Iterations
  section for verify rounds when cheap;
- `evidence-report.md` body when present: every `network_observed:` value —
  first token after the colon, quotes stripped; values starting `n-a` all
  count into the `n-a` bucket (covers `n-a (driver)` and `n-a (tool-error: …)`);
- `_acceptance/config.yaml`: `baseline_minutes`.

## 2. Compute per feature

Total human minutes (gate1+gate2; absent/0 → "chưa ghi"), verify rounds, and
flags:

- `gate1_skipped` (audited Gate-1 escape);
- un-acked bypass (`bypass_used: true` without `bypass_ack`);
- `enforcement_mode` ≠ strict;
- evidence age: when `verified_commit` is a real SHA, count later non-gate
  commits — `git rev-list --count <sha>..HEAD -- . ':!_acceptance'` — and flag
  "N commits after evidence" when N > 0 (cheap staleness signal; the
  authoritative check stays in `pre-merge-check.sh`).

## 3. Print

**Load the language rules first.** Read
`${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
(six rules N1–N6, two quick tests, the presentation templates) TRƯỚC khi viết
bất kỳ câu nào sẽ hiện cho người — the summary table is the human face, not the
machine face. Every render re-reads the file.

- Table: `| Slug | Tier | Status | Verdict | G1 min | G2 min | Rounds | Flags |`
- Headline: signed-off count; median + mean total minutes over features with
  recorded minutes; baseline median from `baseline_minutes` (empty → "chưa ghi
  mốc so sánh trước khi có cổng — điền vào cấu hình nghiệm thu, khoá
  `baseline_minutes`"); % reduction vs the ≥50% target → ĐẠT / CHƯA ĐẠT /
  KHÔNG ĐO ĐƯỢC (state which inputs are missing).
- Vệ sinh cổng — mỗi dòng một ý, tên trường máy để trong ngoặc:
  - N việc bỏ qua cổng duyệt tiêu chí (`gate1_skipped`)
  - N việc dùng đường thoát mà chưa ai xác nhận (bypass chưa `bypass_ack`)
  - N báo cáo chạy ở mức lỏng hơn chặt nhất (`enforcement_mode` ≠ strict)
  - N việc có bằng chứng cũ hơn mã nguồn
- Sự thật mạng (chỉ để tham khảo, không chặn): đếm theo bảy nhóm, mỗi mã kèm
  nghĩa ngay lần đầu — `clean` (sạch) · `app-fail` (chính app lỗi) ·
  `no-app-traffic` (app không gọi mạng) · `third-party-only` (chỉ bên thứ ba) ·
  `n-a` (không đo được) · `unscoped` (ngoài phạm vi app) · `unscoped-partial`
  (ngoài phạm vi một phần) — kèm số việc có dữ liệu. Một dòng hành động cho mỗi
  việc có "chính app lỗi", hoặc "app không gọi mạng" trên một tiêu chí xuyên
  lớp. Từ 5 việc có dữ liệu trở lên, thêm: "đủ mẫu vận hành — cân nhắc máy-kiểm
  hóa network (schema v3, spec wave 2 §5)".
- Việc cần làm: mỗi dấu hiệu mất vệ sinh một dòng, viết bằng tiếng người —
  nói việc phải làm, tên khoá máy để trong ngoặc. KHÔNG bao giờ liệt kê
  "chưa ghi số phút" là việc cần làm — trường đó tuỳ chọn; nếu trình số phút
  cũ thì luôn kèm nhãn "tự khai — không đáng tin".

`_acceptance/` missing → suggest the `acceptance-init` skill. No features →
say so.

## 4. Read-only guarantee

Never edit contracts, reports, or config from this skill — read and print
only.
