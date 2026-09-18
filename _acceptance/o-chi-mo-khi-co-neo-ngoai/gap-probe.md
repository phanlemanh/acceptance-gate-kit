---
slug: o-chi-mo-khi-co-neo-ngoai
at: 2026-09-18T14:40:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract + evals (AC-2 / E2) | VC8 không có chiều đỏ cho dòng `Gốc:` CÓ MẶT nhưng không phải neo (rỗng · placeholder · văn tự do) — allowlist thiếu RED ngoài danh sách | Rà tồn kho ghi «Gốc: ca thật trong thân bài» hoặc ô mới để nguyên placeholder → VC8 im, AC-4 xanh, luật chỉ còn «có một dòng» | Hai regex hợp lệ đặt cạnh marker, writer/reader cùng rút; E2 thêm ba ca đỏ 3a/3b/3c ghim lý do | fixed: AC-2 viết lại vị từ hợp lệ; E2 ma trận 11 ca viết trước |
| P1 | design §6 + AC-3 + E3 | `Kho chờ nhận:` không có bên viết; fixture E3 dựng tay; «≥1 kho» không định nghĩa máy [lan-doc-status-not-run#F2] [cong-nguoi-doc-du-nguon#F1] | Người viết `**Kho chờ nhận:**` ở Notes → VC9 đỏ vì hạ tầng; `Kho chờ nhận: (chưa có)` → im, mốc không kho nhận vẫn qua | Dòng vào `contract-template.md` giữa marker `KHO-CHO-NHAN-LINE`; E3 rút fixture từ khuôn; vị từ = ≥1 token dạng tên kho, bác placeholder/«chưa có» | fixed: AC-3 + E3 + design §3 §6; giới hạn «không kiểm kho tồn tại» khai ở AC-3 và Out of scope (kit không chứa danh mục kho — PR #173 chỉ là hình) |
| P1 | AC-7 / E7 + phạm vi AC-2 | «ô của chính vòng có Gốc (VC8 im)» là hằng đúng vì ô này `decided` mà VC8 miễn `decided` [release-2-16-0#F1] | S3 quên thêm Gốc vào ô này → E7 vẫn PASS; ô mở thẳng ở decided không bao giờ gặp răng | Phạm vi VC8 gồm `decided build` chưa có contract; E2 có ca đỏ 4 cho lớp đó; AC-7 đòi cây thật im + fixture đỏ | fixed: phạm vi răng mở rộng (design §2, AC-2, E2 đỏ 4); AC-7/E7 viết lại; entry sổ supersedes hướng C phần phạm vi |
| P1 | contract §Đường đo | Ngưỡng CHẾT (Known limits gấp đôi · lỗi thật mất chỗ ghi) và timebox 21 ngày không có đường đo, không số nền | UAT không kill được vì «gấp đôi» so với số nền không tồn tại | Số nền đếm hôm nay: 8·0·12·15·0 → 7/vòng; lỗi mất chỗ = hạt giống Gốc→kho chưa có ô sau 21 ngày; timebox = 2026-10-09 | fixed: ba dòng thêm vào Đường đo |
| P2 | E5 (LB3) | LB3 đo chuỗi-có-mặt trên cả tệp, không đòi câu cũ vắng — đo từ vựng thay quan hệ | Câu mới thêm ở SKILL nhưng câu cũ còn ở acceptance-card → xanh, máy chọn câu cũ, tạo thư mục | Khối lối (b) giữa marker `OOC-LOI-B` ở ba tài liệu; LB3 rút khối, đòi câu mới có + câu cũ vắng; mutant chèn câu cũ → đỏ | fixed: AC-5 + E5 viết lại; ba tài liệu nhận marker ở S3 |
