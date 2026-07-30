---
slug: design-pass-skill
at: 2026-07-30T03:20:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E15 judgment hardcode input đường phương án A trong khi vị trí skill là quyết định mở Gate 1; đường `../../` là hình dạng 4 của thước-gắn-vào-vật | Gate 1 chốt B → E15 đọc file không tồn tại: panel chấm 2/3 input (PASS giả) hoặc S4 đỏ vì hạ tầng | inputs sửa theo vị trí đã chốt TẠI Gate 1 trước approve, kèm note tường minh | fixed: E15 thêm notes bắt sửa input tại Gate 1 khi chốt B — sửa-evals-trước-approve là phần của gói duyệt |
| P1 | evals | E4/E5/E6 nói "đỏ khớp nguyên văn" mà không ghi chuỗi nào + thiếu đối chứng dương cùng harness — đúng lớp [findings-section-boundary#F2] | Bản sao tmp hỏng (cp lỗi, exit 127) → mọi exit≠0 đếm là đỏ-khớp → 3 case đột biến xanh vĩnh viễn | Ghim chuỗi nguyên văn + câu đối-chứng-dương vào expected | fixed: E4/E5/E6 (và E2 cùng lớp) siết expected — chuỗi ghim + bản nguyên vẹn xanh |
| P2 | evals | Đột biến E7 chỉ phủ nửa lệnh cấm AC-7 — vế cấm provenance.json không có đột biến riêng | Skill quên vế provenance.json → E7 vẫn xanh → chạy thật bật nhầm làn CT2 | Lớp đột biến thứ hai, hai lớp hai assert (mẫu E9) | fixed: E7 expected thêm lớp đột biến provenance.json riêng |
| P2 | evals | Không gì buộc THÂN nghi thức (kết phiên) trỏ tới khuôn trong marker — lớp khối-marker-trang-trí [findings-section-boundary#F1] | Bước kết-phiên hướng dẫn ghi chỗ khác, template mồ côi cuối file → E7/E8 xanh, pilot r2 không sinh design-pass.md đúng khuôn | Assert section kết-phiên chứa đường design-pass.md + tên marker; đột biến xoá → đỏ | fixed: E8 thêm assert nối thân↔marker + đột biến thứ hai |
| P2 | contract | AC-2 không ghim hành xử DỪNG của hàng degrade 1 (thiếu proto_route) | SKILL.md fail-open "dùng localhost mặc định chạy tiếp" → E2 xanh, vi phạm "không lỗi mờ" của chính design §2.4 | AC-2 thêm vế Then DỪNG + in key đích danh; E2 thêm đối chứng đổi-DỪNG-thành-chạy-tiếp | fixed: AC-2 + E2 siết |

Cross-check: 12/12 AC có eval; GWT đo được ở tầng cấu-trúc (hành-vi-model = known-limit khai trước); 4 trục Coverage đều có AC; surfaces [cli] — không lỗ cross-layer. 3 entry ledger không bị lật.
