---
slug: stop-patching-law
at: 2026-08-07T02:30:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals | Dòng mô tả hứa HÀNH VI ("vòng lặp biết tự nhận ra… thì dừng") nhưng 5/5 phép đo chỉ đo chữ có mặt; 0 phép đo phân biệt "mực đã in" với "vòng lặp đổi hành vi" | Mệnh đề viết xong nhưng đặt giọng khuyến nghị hoặc chìm trong khối dài; ship; việc kế lại chạy đủ ba vòng y như cũ. Cả 5 phép đo XANH, Cổng 1 duyệt vì đọc lời hứa hành vi, Cổng 2 ký vì lưới xanh — feature trượt đúng mục đích sinh ra nó | Thêm chân hội đồng: agent context sạch đọc chỉ dẫn + biên bản vòng-2 do chính lần chạy sinh, hỏi "bước kế tiếp?"; bản có mệnh đề phải DỪNG + nêu ba đường, bản đã xoá phải dispatch vòng ba | fixed: AC-6 + J1 (4 lượt), biên bản sinh trong lần chạy |
| P0 | contract + evals | Không có mốc định danh cho khối mệnh đề: ba phép đo (nội dung, vị trí, đột biến) tham chiếu ba vật khác nhau | Người cài đặt rải ý khắp tệp: tám biểu thức vẫn trúng → XANH dù không có mệnh đề mạch lạc nào; phép đo vị trí lấy khớp đầu tiên; đột biến xoá khối này trong khi phép đo đọc chữ chỗ khác | Mốc `STOP-PATCHING-CLAUSE` mở/đóng ở cả hai bản; mọi phép đo rút và đo TRONG khối; mốc phải xuất hiện đúng một lần | fixed: khuôn mốc khai trong contract, E1/E3/E4 đo trong khối |
| P1 | evals | Ma trận đột biến chỉ có ca xoá-trọn-khối — không ô nào trong tám ô nội dung được chứng minh là sống | Biểu thức của một ý viết lỏng và trúng nhầm câu định nghĩa nằm cạnh; bỏ hẳn ý đó khỏi mệnh đề vẫn XANH cả hai phép đo; mệnh đề ship thiếu ý quan trọng nhất mà lưới không thấy | Ma trận toàn phần: 4 ý × 2 bản + 2 vế + 2 ca xoá-trọn + 2 ca trần-3-vòng, mỗi ca ĐỎ nêu đích danh | fixed: bảng `STOP-PATCH-MUTANTS` + AC-4/E4 |
| P1 | contract + evals | Lời hứa là quan hệ CHỨA ("cùng nhánh") nhưng phép đo là chỉ số ký tự toàn tệp | Mệnh đề đặt ở phần tổng quan đầu tệp (chỉ số nhỏ hơn hẳn), trần-3-vòng vẫn ở nhánh cuối tệp: phép đo XANH, nhưng agent đọc nhánh bị-trả-lại không bao giờ gặp mệnh đề mới | So tiêu đề bao ngoài gần nhất của hai mệnh đề phải bằng nhau; đối chứng: dời khối ra khỏi nhánh (giữ thứ tự tệp) → ĐỎ | fixed: AC-3/E3 đổi sang quan hệ chứa |
| P2 | evals | Đột biến ghim "thông điệp KHÁC nhau" thay vì ghim nguyên văn từng cụm; và định nghĩa hai vế không có đột biến nào | Hai chốt gộp thành vòng lặp vẫn cho thông điệp khác nhau ở số dòng — phép đo XANH trong khi khả năng phân biệt đã mất | Bảng khai cụm phải chứa cho từng ca; assert nguyên văn; thêm hai đột biến cho hai vế định nghĩa | fixed: cột ba của bảng + E2 hai mutant |
