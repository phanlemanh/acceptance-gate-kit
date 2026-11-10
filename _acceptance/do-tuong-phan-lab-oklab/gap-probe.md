---
slug: do-tuong-phan-lab-oklab
at: 2026-11-09T22:30:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch

Một tác tử mới chỉ đọc design, contract, evals, sổ quyết định và tệp bài học. Xử lý xong không phản biện lại lần hai.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Lời hứa của đề bài là đọc màu Chrome thật trả về, nhưng không tiêu chí hay eval nào chạy Chrome thật; hai ca tái lập gốc không thành tiêu chí | Chuỗi Chrome thật khác chuỗi viết tay, cả bộ jsdom xanh mà hai trang gốc vẫn đạt, kho tiêu thụ vẫn phải chạy axe | Eval chạy một lần ở bước chấm trên Chromium với hai trang Tailwind 4, đối chiếu bộ máy gốc | fixed: AC-8 và E11 mới, chạy Chromium thật, đo lại bảng điểm ảnh; việc đưa vào CI để Later có dòng sổ |
| P0 | design | Hai dòng sổ máy quyết thiếu căn cứ: câu trích của d-3 quyết một ca khác, d-4 bỏ sót lối giữa cho tác tử sạch viết tiêu chí từ đề bài | Cổng 1 đọc chủ kho đã chốt nên không ai cân lối từ chối; người duyệt ký qua việc hợp đồng T3 có thể chỉ chép lại code | Dòng sổ mới có supersedes, câu trích đúng việc; d-4 thành câu chỉ người có | fixed: dòng sổ thay d-3 trích đúng luật thoát của màu không đo được và nêu lối từ chối; d-4 thành Hỏi-3 kèm lối giữa |
| P1 | evals | Khai áp mọi ô nhưng không có ma trận viết trước; hở color(srgb), gradient họ lab khác và gradient trong suốt, nền trong suốt lab, alpha 0 oklab, không có nhát phá thứ tự thắng | Nhánh phát hiện chỉ khớp display-p3 hay gradient from-black/50 bị coi là đục mà không ca nào đỏ | Ma trận trong evals, thêm ca và nhát phá đảo thứ tự, ghim mã thoát | fixed: ma trận ở đầu evals.yaml, tám ca mới, MD-11 và MD-12, ghim thoát 2 khi đòi đo đủ; color-mix đo ở E11 vì jsdom không tính nó |
| P1 | evals | Thiết kế hứa chuỗi được giữ nhưng chiều đỏ chỉ một hướng, không có hướng cắt quá tay của bộ lọc chú thích | Dòng có // trong chuỗi rồi hex thật bị cắt mất, bước chấm thoát 0 mà E10 vẫn xanh | Thêm hàng chuỗi, khối nhiều dòng, JSX, đột biến cắt quá tay | fixed: AC-10 và E10 thêm các hàng này và đột biến S4-CHU-THICH-CAT |
| P1 | contract | AC-6 hứa bộ ca cũ vẫn đạt trong khi hàng oklch-toi của KD9 đã đổi trang thử; E6b không nêu KD9 | Người duyệt tin hồi quy còn nguyên trong khi một ca cũ đã đổi đầu vào để qua | Khai ngoại lệ, eval ghim KD9, ca giữ hành vi mới cho nền oklch trực tiếp | fixed: AC-6 khai ngoại lệ, E6c ghim KD9, ca mới nen-oklch-truc-tiep đối chiếu bộ máy gốc |
