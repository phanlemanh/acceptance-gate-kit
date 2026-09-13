---
slug: cong-nguoi-doc-du-nguon
at: 2026-09-12T00:00:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
claims_input: ok
---

# Phản biện context sạch

Phiên tươi, đọc đúng năm tệp (design · contract · evals · sổ quyết định · bài học feature
trước). Không đọc mã nguồn — đây là phản biện KẾ HOẠCH.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Định nghĩa «một mục CHỜ NGƯỜI» không có ở đâu. Design viết «không còn mục nào chờ người», AC chỉ viết «n mục dưới hai tiêu đề» — không vế nào nói mục ĐÃ ĐƯỢC QUYẾT có bị đếm không | S3 chọn đếm trần vì AC viết vậy. Mọi hồ sơ từng có phát hiện rồi đã xử ở Cổng Bằng chứng — gồm `ghim-lai-tren-lop-cu` vừa gộp — vĩnh viễn KHÔNG-sạch, kit tự khoá mọi PR. Đúng hệ quả mà đường đọc-cũ dựng ra để tránh, và số «5 hồ sơ» ở Đường đo hoá vô nghĩa vì đo bằng một định nghĩa khác | Contract khai thẳng vị từ bằng dấu hiệu trên vật; ma trận thêm ô «đã định đoạt hết» và ô «định đoạt một phần»; đo lại Đường đo bằng đúng vị từ đó trước Cổng Phạm vi | fixed: vị từ khai ở mục Context — số mục trừ số dòng sổ `stage: "gate2"`. AC-1 và AC-4 viết lại thành ma trận 6 ô có cả hai ô đó. Đo lại corpus: **4** hồ sơ còn treo, không phải 5 — `ghim-lai-tren-lop-cu` có 2 mục và 5 dòng định đoạt nên SẠCH, đúng ra phải sạch |
| P0 | evals | Mọi fixture `review-findings.md` do tệp ca tự dựng theo khuôn BÊN ĐỌC. Không ca nào rút khuôn mục từ writer thật rồi đọc lại. Mục `Trong hợp đồng` là bề mặt CHƯA từng có bộ đọc nào nên khuôn của nó chưa ai chốt | Writer thật in mục dưới một khuôn khác, bộ đọc mới đếm 0 trên vật thật, luật thứ bảy im. Mọi eval XANH vì fixture viết đúng khuôn bên đọc, hồ sơ được ký, bốn hồ sơ đang treo vẫn đi làn V — đúng lớp lỗi bên-đọc-hẹp-hơn-bên-viết mà vòng này sinh ra để đóng, chỉ đổi da. Cite bài học [eval-khai-ma-thoat-mong-doi#F1] | Ca round-trip: rút khuôn mục từ chỗ có marker của writer trong chính lượt chạy, sinh fixture từ marker đó, đếm bằng bộ đọc mới, ghim n. Chiều đỏ: đổi marker ở writer mà bộ đọc vẫn ra n cũ thì ĐỎ. Áp cho cả hai mục | fixed: AC-14 mới + eval E14. Marker vắng hoặc rút ra rỗng làm ca ĐỎ có tên, không xanh lặng |
| P1 | contract | Không AC nào phủ ca VẮNG NODE ở nhánh bash. Vị từ thứ bảy sống trong một tệp `.cjs` cần node, trong khi lưới có nhánh awk dự phòng chạy được khi không có node. AC-3 chỉ phủ vắng TỆP | Lưới chạy ở runner hoặc hook không có node, rơi vào nhánh awk. Sáu điều kiện cũ vẫn chấm, điều kiện thứ bảy im lặng bỏ qua — fail-OPEN đúng bề mặt vừa vá. Mọi eval xanh vì chúng chạy node trực tiếp. Người duyệt đọc AC-3 tưởng đã phủ hết chiều fail-closed | Chạy lưới trên cùng kho tạm với PATH đã gỡ node, hồ sơ có 2 mục. Đối chứng dương chạy trước là cùng kho có node. Vắng node phải vẫn KHÔNG-sạch với thông điệp nêu đích danh thiếu thông dịch | fixed: AC-3 nay có hai hình dạng thiếu; E3 chạy cả hai ô với hai mũi tiêm độc lập |
| P1 | evals | Trục BÊN-đọc của Coverage liệt năm bên nhưng `evidence-page.js` không có ca nào chạy, và `eval-coverage-lint.js` chỉ có một eval «thoát 0». Coverage biện minh bằng câu «đi chung bộ đọc nên phủ qua AC khác» mà hai AC được dẫn không nói về bên gọi nào | S3 chuyển hai trong ba bên gọi sang bộ đọc mới rồi bỏ sót bên thứ ba. Eval vẫn xanh vì lint thoát 0 cả TRƯỚC bản vá — khẳng định không phân biệt được hai bản. Kho tiêu thụ nâng bản xong, trang bằng chứng vẫn hiện 0 tiêu chí, lỗ gốc còn nguyên ở một trong ba bề mặt người đọc | Ca sinh bằng code một hợp đồng dạng tiêu đề n tiêu chí, chạy cả bốn bên, ghim SỐ mỗi bên nhìn thấy bằng n. Đối chứng dương là cùng nội dung viết dạng gạch đầu dòng. Chiều đỏ hoàn nguyên đúng một bên gọi | fixed: AC-13 mới + eval E13 với BỐN mũi tiêm độc lập, mỗi mũi phải làm đúng một bên ra số khác trong khi ba bên kia giữ nguyên |
| P1 | contract | Chỉ đo bán kính bật-ra-đỏ cho một răng, không đo cho bộ dò điểm mù và cảnh báo lint mà bản vá làm hiện lên ở 11 kho. Không AC nào hứa số sau bản vá, trong khi một eval lại đòi ngưỡng hằng 0 | Sau khi widen, 35 hồ sơ đang im hoá KÊU và 1 491 tiêu chí hoá nhìn thấy với lint ở kho tiêu thụ. Nếu một cảnh báo làm lint thoát khác 0, chiến dịch ghim lại 2.12.0 đỏ hàng loạt kho ngoài ý muốn. Chiều ngược cũng đau: corpus còn một hình dạng khai ngoài ma trận thì eval bán kính đỏ ở S4 với một ngưỡng không AC nào hứa, buộc mở lượt gọi người ngoài thiết kế | Chạy phép đo bán kính với bộ đọc MỚI trên cả 11 kho trước Cổng Phạm vi, in ba số, đưa vào Đường đo kèm ngưỡng; ngưỡng của eval bán kính về đúng số đo được thay vì hằng | fixed một phần: Đường đo thêm dòng thứ năm «cảnh báo lint MỚI ở 11 kho» là **nợ đo có tên, đo ở S3 TRƯỚC khi khai implemented**, kèm luật «>0 thì vào Known limits kèm số và tên kho». Không đo được trước Cổng Phạm vi vì bộ đọc mới chưa tồn tại — đo trước là đo một vật chưa có |
