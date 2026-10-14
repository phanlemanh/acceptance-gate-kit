---
slug: bang-ngoai-n-co-can-cu
at: 2026-10-14T10:18:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Gap probe: bang-ngoai-n-co-can-cu

Phản biện context sạch một lượt (tác tử tươi, chỉ đọc design + contract + evals + decisions + bài học xuyên vòng).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Chặng tác tử tổng hợp không có trên trục A; AC-2 (iv) chỉ đo mục MÁY chèn ở lượt 2 | Dữ liệu đưa prompt synthesize không mang can_cu nên mọi mục lượt 1 ở mọi kho hiện «chưa có căn cứ» mà E1–E8 vẫn xanh | Vế (v) của AC-2/E2: prompt synthesize lượt 1 chứa can_cu cạnh mục + dòng khuôn; đỏ: bản sao bỏ can_cu khỏi dữ liệu đưa synthesize | fixed: AC-2 (v) + E2 vế (v) + chiều đỏ «tổng hợp không thấy căn cứ»; trục A thêm chặng tác tử tổng hợp |
| P1 | evals | E3 đo chuỗi có mặt trong hàng, không đo ô khớp cột; data-cot không được so | Tráo hai cột cuối: người ký đọc lý do dưới tiêu đề Máy đề xuất mà E3 E6 vẫn xanh | Ô thứ i = trường cột thứ i và data-cot = tiêu đề cột thứ i; đỏ: bản sao tráo hai ô cuối | fixed: AC-3 + E3 so ô theo cột và data-cot; chiều đỏ «ô lệch cột» |
| P1 | design | Bỏ ba nút từng mục, thêm hàng tiêu đề nhóm, thẻ màn hẹp — không có dòng sổ S1 | Cổng Phạm vi duyệt mà không thấy lựa chọn bỏ nút; nếu nút là lối chọn thì người ký mất đường đảo từng mục | Dòng sổ S1 với nguồn đúng; nếu nút có chức năng thì đo | fixed: dòng sổ S1 nguồn mot-loi — nút là chữ trình bày không hành vi, quyết định từng mục đi qua câu gộp ký mà AC-4 giữ nguyên byte |
| P1 | design | Không AC đo bộ đọc CŨ (lớp CI vendored chưa chép lại) đọc tài liệu khuôn MỚI | Bộ đọc cũ dính dòng Căn cứ vào plain hoặc lệch khoá, pre-merge của kho tiêu thụ đếm sai mục chưa định tuyến | Bộ đọc base đọc tài liệu mới = chính nó trên tài liệu gỡ dòng Căn cứ, kể cả mucChuaDinhTuyen | fixed: AC-1 thêm vế base + E1 «PASS: BN-1-cu» |
| P2 | evals | can_cu RỖNG qua bên viết (chèn mục mang sang) chưa đo vòng ghi-rồi-đọc | Dòng Căn cứ trống làm bộ đọc lệch trường kế, thẻ in đường dẫn tệp vào cột Căn cứ | BN-5-rong qua dungMucCarry thật + bộ đọc thật, đối chứng dương | fixed: AC-2 (vi) + E2 «PASS: BN-2-rong» (đi qua chèn máy thật trong harness) |
