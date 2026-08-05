---
slug: context-ladder
at: 2026-08-04T15:10:00Z
verdict: findings
p0: 1
p1: 1
p2: 2
---

# Gap-probe: context-ladder

Critic fresh-context, 5 input (design + contract + evals + ledger + claims
xuyên feature). Cross-check còn lại của critic: mọi AC có ≥1 eval; surfaces
[cli] không có criterion cross-layer thiếu tag; AC đo-văn-bản-skill có chân
reader làm chân hành-vi; không finding nào lật descope trong ledger.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Ba seam LLM-viết→máy-đọc nhưng chỉ khoá context: được ép khuôn-một-marker; khuôn cảnh ngữ-cảnh + chuỗi descope sống rời ở hai phép đo (E2 ghim SKILL, E6 ghim reader) không marker chung; E6 không bắt fixture sinh-từ-khuôn-writer. Lớp [findings-section-boundary#F1]. | Reader dò cảnh bằng heading tự đặt mà skill không bao giờ sinh ra: E2 xanh, E6 xanh vì fixture tự khớp reader — phiên thật có cảnh vẫn cờ vàng oan, hoặc standalone-thiếu-cảnh KHÔNG cờ và Gate 1 duyệt thẳng (vết 4-round s4-scope-triage). | Khuôn cảnh + chuỗi descope vào CHÍNH DESIGN-PASS-NOTE-TEMPLATE; AC-5/E5 round-trip phủ cả hai; AC-6/E6 fixture 3 nhánh rút từ khuôn writer bằng code. | fixed: sửa AC-2/5/6 + E2/E5/E6 — khuôn một chỗ có marker, round-trip toàn khuôn, fixture-từ-writer cả 3 nhánh |
| P1 | evals | AC-10 hứa "4 suite xanh" nhưng không eval nào chạy 4 suite (E10 chỉ plugins). | Sửa feature-loop SKILL làm đỏ suite khác ngoài plugins; E10/E11/E12 vẫn xanh → evidence xanh trong khi repo đỏ suite. | Thêm eval config-ref cho đủ 4 suite (dedupe cmd ở S4 nên không tốn thêm lần chạy). | fixed: thêm E14 (scripts) + E15 (hooks) + E16 (workflows) — cùng E10 plugins là đủ 4 suite |
| P2 | evals | E12 nhét phép kiểm docs vào cmd coverage_lint — executor không đọc docs; ghi chú mâu thuẫn cmd. | Chạy đúng cmd E12: coverage-lint xanh, amendment §2.2 + term CONTEXT.md không tồn tại mà AC-10 vẫn báo đạt. | Tách eval test riêng ghim chuỗi amendment + tên file design + term; E12 thuần coverage-lint. | fixed: E12 thuần coverage-lint; thêm E13 docs-pin (test plugins, có mutation + đối chứng dương) |
| P2 | contract | Trục B thiếu tình trạng key-CÓ-mà-con-trỏ-rác cho host_embed — AC-4 chỉ đặc tả nhánh vắng khoá. Lớp [ngon-ngu-mat-nguoi#F1]: con trỏ phải GIẢI ĐƯỢC. | Repo tiêu thụ điền host_embed trỏ file đã đổi tên: thẻ không cờ, phiên theo hướng dẫn ma → kẹt hoặc tự chế đường nhúng; Gate 1 duyệt trên tín hiệu sai. | Thêm nhánh AC-4: con trỏ không giải được → cờ vàng nêu tên, không chặn; eval fixture 2 nhánh giải-được/không. | fixed: AC-4 thêm nhánh con-trỏ-không-giải-được; E4 thêm nhánh (c) + đối chứng dương |
