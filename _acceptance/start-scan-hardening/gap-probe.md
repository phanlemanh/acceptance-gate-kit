---
slug: start-scan-hardening
at: 2026-08-03T07:05:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | AC-1 Given nêu cả opportunity/evidence-report nhưng E1 chỉ tiêm lỗi vào contract.md — kịch bản đầu đề (evidence-report không đọc được trên slug implemented) không có chân đo | Implementer vá theo call-site: bọc lượt đọc contract, để nguyên lượt đọc evidence → E1 xanh nhưng evidence EACCES vẫn nuốt thành file-vắng | E1 thêm chân (c): implemented + chmod 000 evidence-report.md → broken kèm EACCES + đúng tên file | fixed: E1 expected thêm chân (c) |
| P1 | evals | AC-3 Given có lối "--root trỏ đường-dẫn-không-phải-thư-mục" nhưng E3 chỉ ghim 4 lối chết | Kiểm mỗi existsSync là lọt: --root <file> đọc config thất bại → config:false — lỗi gõ lệnh đổi nghĩa thành "repo chưa init" | E3 thêm lối chết 5: --root <file thường> → exit 2 nêu đường dẫn | fixed: E3 expected 5 lối chết |
| P2 | evals | E4 chân âm chỉ mutant GUIDE; nửa README của check_docs không chân âm [findings-section-boundary#F2] | check_docs quên nhánh README: chân dương rỗng oan, mutant GUIDE vẫn đỏ đúng → E4 xanh trọn | Chân âm cho TỪNG file: mutant GUIDE và mutant README riêng, cùng hàm, ghim thông điệp riêng | fixed: E4 expected 2 mutant |
| P2 | contract | AC-5 Then đòi 4 suite + mirror nhưng eval chỉ đo plugins + mirror — 3 suite là Then không thước | Sync mirror cuốn đổi vào plugins/** làm đỏ suite ngoài plugins; E5/E6 xanh, AC-5 báo PASS trên bằng chứng thiếu | Thêm eval cho 3 suite còn lại (không hạ Then cho vừa thước) | fixed: thêm E7/E8/E9 (scripts/hooks/workflows) |
| P2 | evals | AC-2 chỉ luật cho verdict LẠ; verdict VẮNG trên implemented không chân nào ghim [gate-card-ac-visibility#F2] | Evidence có frontmatter nhưng dòng verdict vắng (S4 chết giữa chừng) → null không khớp so-sánh chuỗi, slug lặng lẽ sang bước kế | E2 thêm chân: evidence thiếu verdict → broken "thiếu verdict" (hành vi đặt tên đã có trong reader, ghim lại bằng thước) | fixed: E2 expected thêm chân verdict-vắng |
