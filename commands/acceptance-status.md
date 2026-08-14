---
description: Show acceptance gate status for all features in this repo
disable-model-invocation: true
---

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/approve` · `/signoff` · `/start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người; tin mời cổng kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE, tin chỉ-báo không đeo khối mà nói thẳng máy đang làm gì tiếp.

Lệnh này KHÔNG nằm trong ba lệnh có-câu-gộp (bảng trạng thái read-only,
không có câu hỏi cổng nào để gộp); phần áp dụng ở đây là cờ `--repo <path>`:
quét `<path>/_acceptance/` thay vì thư mục hiện tại.

Scan `_acceptance/*/contract.md` in the current repository (or under
`--repo <path>` when given) and print a status
table. For each feature directory (skip `config.yaml` and `README.md`):

1. Parse contract frontmatter: `slug`, `risk_tier`, `status`.
2. If `evidence-report.md` exists, parse: `verdict`, `human_signoff`.
3. **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu nào
   sẽ hiện cho người.
4. Print:

| Slug | Tier | Contract status | Verdict | Signoff |
|---|---|---|---|---|
| login-flow | T2 | verified | PASS | — |

5. Dưới bảng, nêu việc cần làm — mỗi dòng một ý, tên trường máy để trong ngoặc:
   - `draft` → "Chờ người duyệt bộ tiêu chí trước khi code"
   - `approved`, chưa có báo cáo bằng chứng → "Chờ code"
   - `implemented`, chưa có báo cáo bằng chứng → "Code xong rồi, chưa ai chấm — chạy bước nghiệm thu (Phase 3 của skill acceptance)"
   - PASS, chưa có chữ ký → "Chờ người ký sau khi đọc bằng chứng"
   - PENDING-JUDGMENT → "Chờ người phán các mục cần quyết nghiệp vụ, rồi nâng lên đạt (điền `human_override`)"
   - REJECT → "Cần sửa code — xem danh sách phép đo đã trượt (`failed_evals`)"
   - BLOCKED → "Môi trường hỏng, chưa chấm được — xem lý do"
6. If `_acceptance/` does not exist → suggest `/acceptance-init`.
