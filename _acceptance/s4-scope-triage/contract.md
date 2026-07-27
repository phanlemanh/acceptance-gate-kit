---
schema_version: 1
feature: Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng"
slug: s4-scope-triage
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-07-27T12:16:56Z
owner: phanlemanh@gmail.com
---

## Criteria

- AC-1: Given một round S4 mà mọi eval/suite xanh nhưng có ≥1 confirmed finding severity `high` được triage `inContract: true` (kèm `acRef`), When verdict routing chạy, Then verdict là `REJECT` và finding đó nằm trong `rejectFindings` của result — máy tự quay S3 fix cái đã bounded bởi contract, không chờ human. Đối chứng dương: cùng round đó nếu finding là `medium` thì verdict giữ `PASS`.
- AC-2: Given cùng round mọi eval xanh và confirmed finding severity `high` được triage `inContract: false`, When verdict routing chạy, Then verdict giữ nguyên `PASS` (finding KHÔNG đổi verdict), finding KHÔNG nằm trong `rejectFindings`, và xuất hiện trong section `## Ngoài hợp đồng` của review-findings.md kèm `proposal` (`known-limits` | `new-contract`) — ngăn thứ ba tồn tại và không kéo máy đi sửa.
- AC-3: Given confirmed finding severity `medium`/`low` triage `inContract: true`, When round kết thúc, Then không REJECT vì nó, finding ghi trong section `## Trong hợp đồng` kèm `acRef` — informational, ngưỡng REJECT chỉ dành cho `high`.
- AC-4: Given triage agent chết cả lần retry (hoặc contract.md không đọc được), When verdict routing chạy, Then KHÔNG có REJECT nào bắt nguồn từ findings (kể cả high), result mang `triageFailed: true`, mọi confirmed finding vào section `## Chưa phân loại (triage-failed)` — fail-toward-human, không đoán scope. Đối chứng dương: triage sống → không có section đó và cờ false.
- AC-5: Given round có eval FAIL (REJECT sẵn) VÀ hỗn hợp findings in-contract + out-of-contract, When result trả về, Then `rejectFindings` chứa ĐÚNG các finding in-contract và KHÔNG chứa finding out-of-contract nào — dù round REJECT vì lý do khác, out-of-contract không bao giờ lọt vào fix-list. Đây là chốt chặn spiral OneFlow.
- AC-6: Given round có finding `unverified: true` (refuter chết), When triage chạy, Then finding unverified KHÔNG được đưa vào input triage và vẫn liệt kê ở section "Chưa adversarial-verify" như hành vi hiện tại — regression guard.
- AC-7: Given ≥2 confirmed findings có `file` không khớp bất kỳ glob nào trong union `paths` của mọi eval, When result trả về, Then `coverageCluster = {count, total, files}` và review-findings.md có dòng cờ "dừng và quyết: mở rộng contract hay rút scope"; Given ĐÚNG 1 finding ngoài vùng phủ, Then `coverageCluster` là null — cờ đòi cụm (≥2), 1 finding lẻ không đẩy human vào quyết định mở-rộng-hay-rút-scope; Given không eval nào khai `paths`, Then `coverageCluster` là null và review-findings.md ghi 1 dòng "cluster: n-a" — không flag, không fail.
- AC-8: Given review-findings.md thế hệ CŨ (không có section Trong/Ngoài hợp đồng), When card Cổng 2 render theo chỉ dẫn mới (cả `commands/acceptance-card.md` lẫn bản codex), Then chỉ dẫn card có nhánh tường minh "không có section → render như cũ" — backward-tolerant, workspace cũ không lỗi.
- AC-9: Given SKILL feature-loop-codex vùng S4, When soi text, Then có bước triage tương đương: 3 ngăn (in-contract / out-of-contract / unclassified), quyền REJECT chỉ cho in-contract high, fail-toward-human khi triage hỏng — parity hai harness, không lệch ngữ nghĩa.
- AC-10: Given evidence-report.md của round có triage (mọi verdict), When soi shape, Then KHÔNG có field/section triage mới nào trong evidence-report.md — thông tin triage chỉ sống trong review-findings.md (ngoài hook); hook evidence-gate L1/L2/L3 giữ nguyên hành vi trên report cũ lẫn mới.
- AC-11: (judgment) Given khối "Ngoài hợp đồng" trên card Cổng 2 render từ fixture mẫu, When một người quyết kinh doanh (không đọc code) đọc khối đó, Then họ hiểu finding là thật-nhưng-ngoài-phạm-vi-đã-duyệt và phân biệt được 3 lựa chọn: ghi Known limits / mở contract mới / nâng scope sửa ngay — bằng ngôn ngữ sản phẩm, không jargon.
- AC-12: Given round BLOCKED (suite/eval không chạy được) VÀ có confirmed finding severity `high` triage `inContract: true`, When verdict routing chạy, Then verdict vẫn là `BLOCKED` — vế REJECT-từ-finding là vế mới nhưng đứng DƯỚI BLOCKED check như mọi nguồn REJECT khác; không fan-out fix nào từ findings trên môi trường hỏng. Đối chứng dương: cùng fixture không BLOCKED → `REJECT`.
- AC-13: Given repo kit, When soi CI và config, Then `.github/workflows/gate.yml` có step chạy `tests/workflows/run-tests.sh` VÀ `_acceptance/config.yaml` có `executors.test.workflows` + key đó trong `feature_loop.suite_keys` — wiring là deliverable của feature, không phải lời hứa.

## Coverage

- Trục loại finding: confirmed-high | confirmed-med/low | unverified [thước CE: AC-1/AC-3/AC-6]
- Trục kết quả triage: in-contract | out-of-contract | unclassified [thước CE: AC-1/AC-2/AC-4 — SARIF baseline: phân loại là trạng thái máy-đọc]
- Trục bối cảnh verdict: evals xanh | evals đỏ | BLOCKED (dominates cả vế REJECT-từ-finding MỚI — ghim bằng AC, không waive) [thước CE: AC-1/AC-2/AC-5/AC-12]
- Trục cluster: computable-có-cụm (≥2) | computable-1-finding-lẻ (không cờ) | computable-không-cụm | n-a-không-paths [thước CE: AC-7 — SonarQube Clean-as-You-Code: biên phạm vi của finding]
- Trục tương thích ngược: file findings cũ không section | hook shape nguyên vẹn [thước CE: AC-8/AC-10]
- Trục harness parity: Claude workflow JS | codex text [thước CE: AC-9]
- Trục người-đọc-gate: khối Ngoài-hợp-đồng đọc được bằng ngôn ngữ sản phẩm [thước CE: AC-11]

## Out of scope

- **Auto-fix out-of-contract findings.** Chính là bệnh OneFlow mà feature này chữa — máy sửa hành-vi-không-đặc-tả dưới áp lực review. Không bao giờ.
- **Triage bằng heuristic/regex thay LLM.** Finding là văn tự nhiên; map vào AC là việc ngữ nghĩa.
- **Ngưỡng severity configurable per-repo** (vd cho med/low cũng REJECT). Chờ dữ liệu vận hành; mở contract sau nếu cần.
- **Triage cho suite-command failures.** Suite fail là REJECT vô điều kiện như cũ — đó là thước của repo, không phải finding của reviewer.
- **Auto-draft contract mới từ out-of-contract findings.** Đề xuất `new-contract` chỉ là chữ trên card; việc mở contract là của human.

## Notes

- Verdict enum KHÔNG đổi (PASS / PENDING-JUDGMENT / REJECT / BLOCKED) — vế REJECT mới chỉ thêm nguồn, không thêm giá trị; hooks và pre-merge không cần biết feature này tồn tại (AC-10).
- Case suite workflows dùng tiền tố `WT*`; case plugins dùng tiếp dải `P49`+.
- MỌI assertion âm tính theo bất biến CLAUDE.md #4: đối chứng dương + ghim đúng thông điệp.
- Feature kèm wiring `tests/workflows/run-tests.sh` vào `executors.test.workflows` + `feature_loop.suite_keys` + gate.yml (suite tồn tại từ Đợt 5 nhưng mồ côi — evals feature này cần nó làm executor).
