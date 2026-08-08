---
description: Aggregate acceptance metrics across all features — human-touch frequency from git (new KPI), verdict mix, gate hygiene (skips, bypasses, stale evidence). Read-only.
disable-model-invocation: true
---

Answer "is the gate paying for itself?" from what the gates already recorded.
KPI phía người (charter tái lập 2026-08-07): **tần suất sự-kiện-cần-người** —
counted from git, not from self-reported minutes. Any `time_human_minutes`
found in old contracts is SELF-REPORTED, UNTRUSTED data ("tự khai — không
đáng tin", owner admission 2026-08-07): report it only under that label,
never cite it as efficiency evidence, never flag its absence as a hygiene gap.
It is read-only: modify nothing while reporting.

Optional arg `--since YYYY-MM-DD`: include only features whose `approved_at`
or `verified_at` is on/after that date.

Steps:

1. **Scan** `_acceptance/*/` (skip `config.yaml`, `README.md`). Parse:
   - `contract.md` frontmatter: `slug`, `risk_tier`, `status`, `approved_by`,
     `approved_at`, `gate1_skipped` (và `time_human_minutes` nếu có — chỉ để
     trình dưới nhãn tự-khai);
   - `evidence-report.md` frontmatter when present: `verdict`,
     `human_signoff`, `verified_at`, `verified_commit`, `enforcement_mode`,
     `bypass_used`, `bypass_ack`, `failed_evals`;
   - `run-log.jsonl` when present: line count (machine-run volume) and, when
     cheap, the report's Iterations section for verify rounds;
   - `evidence-report.md` body when present: every `network_observed:` value —
     first token after the colon, quotes stripped; values starting `n-a` all
     count into the `n-a` bucket (covers `n-a (driver)` and `n-a (tool-error:
     …)`);
   - `_acceptance/config.yaml`: `baseline_minutes`.
2. **Per feature compute:** human-touch count — số commit chạm dòng
   human-owned của hồ sơ, đếm từ git (lệnh chuẩn, chạy được nguyên văn):
   `git log --format=%H -G'human_signoff: \"|human_override: \"|approved_by: [A-Za-z]' -- _acceptance/<slug>/`
   rồi đếm dòng (pickaxe theo GIÁ TRỊ đã điền — commit máy chỉ thêm dòng khoá rỗng KHÔNG được đếm; mỗi commit khớp = một lần người ra tay thật).
   Kèm verify rounds, and flags:
   - `gate1_skipped` (audited Gate-1 escape),
   - un-acked bypass (`bypass_used: true` without `bypass_ack`),
   - `enforcement_mode` ≠ strict,
   - evidence age: when `verified_commit` is a real SHA, count later non-gate
     commits — `git rev-list --count <sha>..HEAD -- . ':!_acceptance'` — and
     flag "N commits after evidence" when N > 0 (cheap staleness signal; the
     authoritative check stays in `pre-merge-check.sh`).
3. **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu nào
   sẽ hiện cho người — bảng tổng kết là mặt người, không phải mặt máy.

3b. **Gold set + đồng thuận giám khảo (judge-required-evidence):** chạy
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/acceptance-gold.mjs --root .` và chép
   nguyên văn hai khối nó in — khối "Sổ vàng" (mỗi dòng: việc gì, máy đề xuất
   gì, người đã quyết gì và vì sao — rút từ chữ ký tại Cổng 2, không bịa) và
   khối "Các giám khảo đồng thuận tới đâu" (bao nhiêu phần chấm 3/3 cùng ý,
   bao nhiêu 2/1, bao nhiêu phân kỳ; góc nhìn nào hay nói "chưa chắc" nhất).
   Script lỗi → in một dòng "sổ vàng chưa đọc được" + lý do, không chặn báo
   cáo.

4. **Print:**
   - Table: `| Slug | Tier | Status | Verdict | G1 min | G2 min | Rounds | Flags |`
   - Headline: signed-off count; median + mean total minutes over features
     with recorded minutes; baseline median from `baseline_minutes` (empty →
     "chưa ghi mốc so sánh trước khi có cổng — điền vào cấu hình nghiệm thu,
     khoá `baseline_minutes`");
     % reduction vs the ≥50% target → ĐẠT / CHƯA ĐẠT / KHÔNG ĐO ĐƯỢC (state
     which inputs are missing).
   - Vệ sinh cổng — mỗi dòng một ý, tên trường máy để trong ngoặc:
     - N việc bỏ qua cổng duyệt tiêu chí (`gate1_skipped`)
     - N việc dùng đường thoát mà chưa ai xác nhận (bypass chưa `bypass_ack`)
     - N báo cáo chạy ở mức lỏng hơn chặt nhất (`enforcement_mode` ≠ strict)
     - N việc có bằng chứng cũ hơn mã nguồn
   - Sự thật mạng (chỉ để tham khảo, không chặn): đếm theo bảy nhóm, mỗi mã kèm
     nghĩa ngay lần đầu — `clean` (sạch) · `app-fail` (chính app lỗi) ·
     `no-app-traffic` (app không gọi mạng) · `third-party-only` (chỉ bên thứ ba) ·
     `n-a` (không đo được) · `unscoped` (ngoài phạm vi app) · `unscoped-partial`
     (ngoài phạm vi một phần) — kèm số việc có dữ liệu. Một dòng hành động cho
     mỗi việc có "chính app lỗi", hoặc "app không gọi mạng" trên một tiêu chí
     xuyên lớp (dấu hiệu nút bấm chết). Từ 5 việc có dữ liệu trở lên, thêm: "đủ
     mẫu vận hành — cân nhắc máy-kiểm hóa network (schema v3, spec wave 2 §5)".
   - Việc cần làm: mỗi dấu hiệu mất vệ sinh một dòng, viết bằng tiếng người.
     KHÔNG bao giờ liệt kê "chưa ghi số phút" là việc cần làm — trường đó là
     tuỳ chọn; nếu trình số phút cũ thì luôn kèm nhãn "tự khai — không đáng tin".
5. `_acceptance/` missing → suggest `/acceptance-init`. No features → say so.

Read-only guarantee: this command never edits contracts, reports, or config —
it only reads and prints.
