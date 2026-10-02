---
slug: lan-ghim-lai-theo-paths
at: 2026-10-02T22:06:05Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

# Gap-probe — lan-ghim-lai-theo-paths

Phản biện context sạch, một lượt (03/10). Input: design doc · contract · evals · decisions · claims · opportunity.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | AC-7 chỉ đo tệp lib có trong danh sách chép — chuỗi có mặt, không phải quan hệ «bộ lọc CHẠY được ở kho tiêu thụ» | lib nạp globToRe của feature-loop theo đường tương đối; ở cây kit mọi eval xanh, sang crm nạp gãy → fail-closed chỉ in NOTE, crm bật khoá mà không bớt làn nào | kho tiêu thụ fixture dựng bằng chính lệnh chép của acceptance-init, plugin feature-loop ở chỗ riêng; mutant lib nạp tệp ngoài danh sách chép | fixed: AC-7 + E7 thêm vế kho tiêu thụ và mutant «lib không tự đứng ở kho tiêu thụ»; thiết kế: lib mang bản khớp glob riêng có ca so bằng nhau với carry-plan (sổ d-…-7) |
| P1 | contract | Đường đo không đọc được hai dòng CHẾT: NOTE không mang slug, chỉ nằm ở log CI; mã thoát song song sau khi bật không còn gì để so | sau 30 ngày log CI hết hạn → ca bỏ lỡ đếm ra 0 vì mù, ngưỡng đọc thành SỐNG | NOTE mang slug + tệp; nơi lưu bền + lệnh đếm; khai giới hạn cho song song sau khi bật | fixed: NOTE mang slug + tối đa 10 tệp (AC-2); Đường đo đếm ca bỏ lỡ bằng tính lại vị từ trên lịch sử git ở hồ sơ đỏ của làn chiến dịch; song song sau bật khai giới hạn kèm ngưỡng |
| P1 | evals | Không có răng «kho không bật khoá không đổi byte» phía làn; lib vắng/ném lỗi phía làn chưa phủ | dời bộ đọc paths vào lib đổi evals_not_machine_touched khi khoá vắng, hoặc lib mới thành bắt buộc làm làn sập mọi kho | vi phân làn với base git archive gồm feature-loop/scripts; ô lib vắng/ném lỗi | fixed: AC-10 + E10 mới (vi phân 12 ô với base, lib vắng/ném lỗi, mutant «khoá vắng mà đòi lib mới») |
| P1 | evals | E3/E7 «ca tự đếm số ô» — số ô và số assert từ cùng vòng lặp nên không thể đỏ | bỏ sót ô khó khỏi bộ sinh, E3/E7 vẫn xanh | ma trận có tên, số ô viết trước, mutant xoá một ô | fixed: ma trận M 12 ô viết trước trong contract; E3/E4/E7/E10 assert đúng 12; mutant xoá M8 → «số ô lệch» |
| P1 | evals | AC-4 vế «tệp đọc lỗi» không có ô; không có ca hợp paths rỗng; mutant chỉ có cho hai vế | evals.yaml hỏng đọc thành 0 eval → hợp rỗng → bộ lọc bỏ mọi dòng, hồ sơ không bao giờ hoá cũ | ô YAML hỏng code-sinh, ô hợp rỗng, mutant mỗi vế | fixed: M8 + M12 (giữ luật cũ), thiết kế khai hợp rỗng ≠ không vật; E4 năm mutant, thông điệp ghim riêng |
