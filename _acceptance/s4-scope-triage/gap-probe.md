---
slug: s4-scope-triage
at: 2026-07-27T11:52:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|-----|----------|----------|---------------|----------|-------|
| P1 | evals | AC-4 khai 2 trigger (agent chết · contract.md không đọc được) nhưng E4 chỉ đo trigger agent-chết | contractPath hỏng → agent triage trên scope rỗng xếp finding in-contract thật thành out-of-contract → PASS sai, máy không fix | Case WT-T4c: contractPath không tồn tại → triageFailed:true, không REJECT | fixed: thêm WT-T4c vào E4 |
| P1 | contract | Trục verdict waive BLOCKED nhưng vế REJECT-từ-finding là code MỚI — không gì ghim BLOCKED dominates vế mới | Vế else-if đặt sai tầng: BLOCKED + finding high in-contract → REJECT → fan-out fix trên môi trường hỏng, đốt round cap 3 | AC + case WT: BLOCKED + high in-contract → verdict BLOCKED; đối chứng: bỏ điều kiện → REJECT | fixed: thêm AC-12 + eval E13 |
| P1 | evals | E10 là assertion vắng-mặt-một-mình (grep thiếu chuỗi) — đúng lớp CLAUDE.md #4 cấm | Implement thêm section triage vào prompt bằng wording khác → E10 xanh, report đổi shape, hook đổi hành vi — vỡ AC-10 không cờ nào bật | Đổi sang golden closed-list section/field của prompt synthesize + đối chứng dương tiêm chỉ dẫn vào bản sao → đỏ | fixed: viết lại E10 |
| P2 | contract | Biên cluster count=1 không đặc tả — AC-7 chỉ phủ ≥2, n-a, in-coverage | Flag ở ≥1 → cờ "dừng và quyết" bật sai vì 1 finding lẻ, human bị đẩy quyết định không đáng mỗi round | Case WT-T7d: đúng 1 finding ngoài vùng phủ → null, không cờ | fixed: thêm WT-T7d vào E7 + 1 câu biên vào AC-7 |
| P2 | evals | Wiring gate.yml khai in-scope nhưng không eval nào đo (config key tự-cưỡng-chế, gate.yml thì không) | Quên step gate.yml → mọi eval vẫn xanh, suite WT không bao giờ chạy CI, regression về sau vô hình | Case plugins: grep gate.yml có step + suite_keys có key; đối chứng: xoá dòng bản sao → đỏ | fixed: thêm AC-13 + eval E14 |

Đã cân nhắc và LOẠI (không đủ kịch bản fail Gate): E2 đo prompt-synthesize thay vì file render (seam sâu nhất harness đo được); proposal null cho finding out-of-contract (hệ quả nhỏ). Không finding nào lật 3 quyết định đã ghi ledger.
