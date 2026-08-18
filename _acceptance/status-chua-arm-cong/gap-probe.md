---
slug: status-chua-arm-cong
at: 2026-08-18T07:58:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Phản biện context sạch — status-chua-arm-cong

Critic: 1 agent tươi, input 5 file (design · contract · evals · decisions ·
claim-scan). One-pass; mọi finding sửa ngay trong artifact, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + evals | Ma trận «toàn phần» ARM01–08 chỉ phủ 8 trong ~16 ô: (b) chỉ đo ở draft; (a) chỉ đo khi PR cũng chạm code; nhánh (b) qua t3_paths không có ca | Thi công (b) như `case draft)` hoặc gộp (a) vào «có DIFF_GATED_HITS» → 8 ca xanh mà approved không evidence kèm code, hoặc approved+REJECT kèm PR chỉ docs vẫn tàng hình | Lưới đầy đủ status × evidence × diff; thêm ARM09 (approved · không ev · code → b), ARM10 (approved · REJECT · chỉ docs → a), ARM11 (draft · không ev · t3_paths → b) | fixed: design ma trận 13 ca; E1 ghim ARM10, E2 ghim ARM09+ARM11 |
| P1 | design + evals | ARM04/05/07 âm tính một mình (không dấu dương cổng đã chạy); ARM01 ghim lỏng hai lựa chọn thông điệp | Fixture git thiếu config / slug không được nhận → pre-merge clean exit 0 → ARM04/05/07 xanh oan; ARM01 khớp chuỗi bất kỳ | Thêm assert dương cùng lượt: dòng sổ luật `expected=4`; ARM05 thêm dòng chấm slug armed; ARM01 ghim MỘT thông điệp verdict nguyên văn | fixed: design + E1/E2/E3 ghim `expected=4`, `[feat-arm]`, `verdict=REJECT (must be PASS to merge)` |
| P1 | contract + evals | AC-4 hứa hoist không đổi hành vi cho cả hai nhánh T1-escape nhưng chỉ ghim nhánh non-T1 | Hoist tính t3_hits sai → thông điệp T3 paths biến mất, ARM08 vẫn xanh | Thêm ARM08b ghim nguyên văn `T3 paths (t3_paths) changed …` + expected=4 | fixed: design ARM08b; E4 ghim ARM08b |
| P2 | design + evals | Trục tier vắng: hồ sơ ngoài required_for chưa arm có evidence phải im lặng, không ca canh; vị trí nhánh mới so với `case REQUIRED_FOR` không được đo | Nhánh mới đặt TRƯỚC continue theo tier → hồ sơ T1 có evidence cũ ở repo tiêu thụ nổ mỗi PR (nhất là DIFF_READY=0) | ARM12: tier T1 + approved + evidence + trong diff + code → exit 0 + dấu dương | fixed: design ARM12; contract Coverage trục D; E3 ghim ARM12 |
| P2 | evals | E5e răng GUIDE chỉ có chiều đỏ cho gạch §7.1; hàng bảng §7 không có chiều đỏ và phạm vi đếm không cắt khối | grep sai phạm vi đếm cả chỗ khác → GUIDE thiếu hàng bảng mà răng vẫn 1 hit | Chiều đỏ thứ hai: gỡ hàng → `GUIDE 7: 0 hàng «chưa arm cổng»`; cắt đúng khối §7 → §7.1 | fixed: E5e + design mục GUIDE |

Claims input 5: không finding nào phải cite claim — bài học liên quan
([cong-chan-nham-cho#F1] đo quan-hệ thay chuỗi) đã nằm trong khuôn cặp
hai-chiều của ma trận.
