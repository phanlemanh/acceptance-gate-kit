---
name: acceptance-status
description: Show the Acceptance Gate status and next action for every feature workspace in the current repository. Use when the user asks for gate progress, pending approvals, verification state, or signoff status.
---

# Acceptance Status for Codex

Scan `_acceptance/*/contract.md`. If `_acceptance/` is missing, direct the user
to the `acceptance-init` skill.

One-shot answer + `--repo` (shared clause, copied verbatim from the law):

Ba lệnh có-câu-hỏi (`/approve` · `/signoff` · `/start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người; còn việc kế thì kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE.

This skill is NOT one of the three one-shot commands (a read-only status
table has no gate question to fold); what applies here is the `--repo
<path>` flag: scan `<path>/_acceptance/` instead of the current directory.

For each feature, parse contract frontmatter fields `slug`, `risk_tier`, and
`status`. When `evidence-report.md` exists, also parse `verdict`,
`human_signoff`, and `reason`.

**Load the language rules first.** Read
`${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
(six rules N1–N6, two quick tests, the presentation templates) TRƯỚC khi viết
bất kỳ câu nào sẽ hiện cho người. Every render re-reads the file — the rules do
not live in memory.

Print:

| Slug | Tier | Contract status | Verdict | Signoff |
|---|---|---|---|---|
| login-flow | T2 | verified | PASS | — |

Nêu việc cần làm — mỗi dòng một ý, tên trường máy để trong ngoặc:

- `draft`: chờ người duyệt bộ tiêu chí trước khi code.
- `approved`, chưa có bằng chứng: chờ code.
- `implemented`, chưa có bằng chứng: code xong rồi, chưa ai chấm — chạy bước
  nghiệm thu (Phase 3 của skill acceptance).
- `PASS`, chưa có chữ ký: chờ người ký ở Gate 2 sau khi đọc bằng chứng.
- `PENDING-JUDGMENT`: Gate 2 phải phán các mục cần quyết nghiệp vụ hoặc mục dao
  động giữa các lượt chạy, rồi mới nâng lên đạt.
- `REJECT`: cần sửa code — liệt kê các phép đo đã trượt (`failed_evals`).
- `BLOCKED`: môi trường hoặc cấu hình hỏng, chưa chấm được — in nguyên lý do.
- `signed-off`: xong; vẫn phải báo nếu bằng chứng cũ hơn mã nguồn hiện tại.

Do not modify artifacts while reporting status.
