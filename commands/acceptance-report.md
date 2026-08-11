---
description: Aggregate acceptance metrics across all features — human minutes vs baseline (KPI ≥50% reduction), verdict mix, gate hygiene (skips, bypasses, stale evidence). Read-only.
disable-model-invocation: true
---

Answer "is the gate paying for itself?" from what the gates already recorded.
The kit's stated KPI is ≥50% human-time reduction vs baseline; the fields exist
(`time_human_minutes` per contract, `baseline_minutes` in config) — this
command reads them. It is read-only: modify nothing while reporting.

Optional arg `--since YYYY-MM-DD`: include only features whose `approved_at`
or `verified_at` is on/after that date.

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/approve` · `/signoff` · `/start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người; còn việc kế thì kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE.

Lệnh này KHÔNG nằm trong ba lệnh có-câu-gộp (báo cáo read-only, không có câu
hỏi cổng nào để gộp); phần áp dụng ở đây là cờ `--repo <path>`: quét
`<path>/_acceptance/` và chạy `acceptance-gold.mjs --root <path>`; kể cả đếm
tuổi bằng chứng (`git rev-list`) cũng chạy `git -C <path>`.

Steps:

1. **Scan** `_acceptance/*/` (skip `config.yaml`, `README.md`). Parse:
   - `contract.md` frontmatter: `slug`, `risk_tier`, `status`, `approved_by`,
     `approved_at`, `gate1_skipped`, `time_human_minutes` {gate1, gate2};
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
2. **Per feature compute:** total human minutes (gate1+gate2; absent/0 →
   "chưa ghi"), verify rounds, and flags:
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
     - N việc chưa ghi số phút của người
   - Sự thật mạng (chỉ để tham khảo, không chặn): đếm theo bảy nhóm, mỗi mã kèm
     nghĩa ngay lần đầu — `clean` (sạch) · `app-fail` (chính app lỗi) ·
     `no-app-traffic` (app không gọi mạng) · `third-party-only` (chỉ bên thứ ba) ·
     `n-a` (không đo được) · `unscoped` (ngoài phạm vi app) · `unscoped-partial`
     (ngoài phạm vi một phần) — kèm số việc có dữ liệu. Một dòng hành động cho
     mỗi việc có "chính app lỗi", hoặc "app không gọi mạng" trên một tiêu chí
     xuyên lớp (dấu hiệu nút bấm chết). Từ 5 việc có dữ liệu trở lên, thêm: "đủ
     mẫu vận hành — cân nhắc máy-kiểm hóa network (schema v3, spec wave 2 §5)".
   - Việc cần làm: mỗi dấu hiệu mất vệ sinh một dòng, viết bằng tiếng người
     (vd "2 việc chưa ghi số phút của người — điền lúc duyệt và lúc ký, khoá
     `time_human_minutes`; thiếu nó thì không đo được cổng có đáng không").
5. `_acceptance/` missing → suggest `/acceptance-init`. No features → say so.

Read-only guarantee: this command never edits contracts, reports, or config —
it only reads and prints.
