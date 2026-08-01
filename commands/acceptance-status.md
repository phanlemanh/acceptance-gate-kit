---
description: Show acceptance gate status for all features in this repo
disable-model-invocation: true
---

Scan `_acceptance/*/contract.md` in the current repository and print a status
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
   - `implemented`, chưa có báo cáo bằng chứng → "Chờ chấm bằng chứng — chạy Phase 3 của skill acceptance"
   - PASS, chưa có chữ ký → "Chờ người ký sau khi đọc bằng chứng"
   - PENDING-JUDGMENT → "Chờ người phán các mục cần quyết nghiệp vụ, rồi nâng lên đạt (điền `human_override`)"
   - REJECT → "Cần sửa code — xem danh sách phép đo đã trượt (`failed_evals`)"
   - BLOCKED → "Môi trường hỏng, chưa chấm được — xem lý do"
6. If `_acceptance/` does not exist → suggest `/acceptance-init`.
