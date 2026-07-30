---
slug: pha3-goi-luoi
at: 2026-07-30T07:11:49Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — pha3-goi-luoi

Critic fresh, input 5 file (design + contract + evals + ledger + claims). Không finding nào lật ledger.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E8 không ghim vế "in mặc định đã điền slug" của AC-8 — chỉ ghim nội dung khối, không ghim lệnh in. Lớp [findings-section-boundary#F1] | Implementer nhúng khối GOAL-TEMPLATE nhưng mục GATE 1 rớt lệnh in-mặc-định → P85 xanh mà bệnh B4 tái diễn | Siết E8/P85: grep-pin mệnh đề in-mặc-định-đã-điền-slug trong mục GATE 1, tham chiếu đích danh khối marker | fixed: E8 expected đã siết |
| P1 | evals | Đối chứng âm E9 kết luận chỉ từ "so sánh đỏ", không ghim thông điệp, không có đối chứng dương cùng bản sao. Lớp [findings-section-boundary#F2] | Bước dựng bản sao hỏng (cp lỗi, path sai, marker không rút được) → "đỏ" vì chưa bao giờ chạy, case vẫn xanh; 2 bản trôi thật không bắt | E9 ghim thông điệp mismatch (tên 2 file + nhãn GOAL-TEMPLATE) + thứ tự: nguyên vẹn XANH trước rồi đột biến ĐỎ | fixed: E9 expected + AC-9 đã siết |
| P2 | contract | Món 4 × Codex xếp Later "không phá" mà không có phép đo, trong khi feature sửa cùng file codex SKILL | Sửa step 8 + S1 codex vô tình cắt dòng /goal native → mọi eval xanh, B4 tái sinh ở Codex | Grep-pin dòng /goal native codex trong P85; nâng ô Later → Core | fixed: AC-9 + E9 thêm đối chứng không-phá; Coverage đã nâng |
| P2 | evals | E3 rớt mệnh đề răng "không phân loại = chưa đủ điều kiện ký Cổng 0" của design | Template ship bảng phân loại nhưng thiếu câu chặn-ký → bảng trống vẫn ký được, tái hiện mắt xích B1 | P83 thêm anchor nguyên văn mệnh đề chặn-ký | fixed: AC-3 + E3 đã thêm anchor |
| P2 | contract | Version bump + description 2 plugin.json không có AC/eval phủ | Quên bump → mọi eval xanh, Gate 2 ký, consumer không bao giờ nhận lưới (release có chủ đích) — ship mà hiệu lực bằng 0 | AC-12 + eval P88: semver >= 1.27.0 / 1.19.0 + description có từ khoá hành vi mới | fixed: AC-12 + E12 (P88) đã thêm |
