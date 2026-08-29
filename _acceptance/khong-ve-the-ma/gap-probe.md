---
slug: khong-ve-the-ma
at: 2026-08-30T00:00:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Nhánh Cổng Bằng chứng không có ca đo. Bộ dựng tự đoán cổng từ trạng thái hợp đồng, else sự hiện diện của bản báo cáo bằng chứng — hai đường vào thẻ, mà giả định đã khai ở Notes chỉ được chứng ở một đường | Chốt cài SAU bước đoán cổng. Thư mục chỉ có evidence-report.md → đoán Cổng 2, vẽ trọn thẻ bằng chứng, mã thoát 0, người vẫn ký trên hư không. E1–E10 xanh mà lỗ chính vẫn mở | Ma trận viết-trước: ba fixture code-sinh (thư mục rỗng · chỉ evidence-report.md · chỉ evals.yaml) × hai lượt gọi (tự đoán cổng · `--gate 2` tường minh) = 6 assert, cùng ghim chuỗi rút từ hằng; đối chứng dương hợp-đồng-cộng-bằng-chứng vẫn vẽ Cổng 2 | fixed: E3 nâng thành ma trận 6 ô + đối chứng dương Cổng 2; thêm giá trị «có bằng chứng, vắng hợp đồng» vào trục trạng thái ở Coverage. Đã kiểm hành vi thật trong cùng lượt: chốt nằm TRƯỚC bước đoán cổng nên cả hai đường đều thoát 2 — đây là lỗ của PHÉP ĐO, không phải của vật |
| P1 | evals | E7 đo CHỈ DẪN chứ không đo đầu ra; không phép đo nào chạm việc card.html có bị ghi hay không, và AC-7 tự hạ lời hứa từ hành vi xuống văn bản mà Notes không khai giới hạn | Bước tiền đề viết đủ ba mệnh đề nhưng đặt SAU khối render. E7 xanh, người đi qua lệnh vẫn thấy thẻ ma và card.html vẫn được ghi | Đo QUAN HỆ THỨ TỰ máy đọc được: dòng khối tiền đề phải nhỏ hơn mọi dòng ra lệnh render và mọi dòng ghi card.html; cộng mutant hoán vị dời khối xuống cuối phải ĐỎ. Không đo được hành vi thật thì khai thẳng giới hạn | fixed: E7 thêm assert thứ tự dòng + mutant hoán vị; giới hạn khai tường minh ở Notes hợp đồng và ở Known limits của báo cáo |
| P1 | evals | E8 đo chuỗi-CÓ-MẶT trong khi lời hứa là QUAN HỆ ghép cặp — ba thông điệp phải ứng với ba lời thuật KHÁC NHAU cho người | Người cài dán ba hằng vào một khối chú thích cuối thân lệnh, phần thuật cho người chỉ một câu chung. E8 xanh, mutant đổi chuỗi vẫn đỏ, nhưng người vẫn không phân biệt được ca vắng-hồ-sơ với ca chưa-mở-xưởng | Ghim CẶP không ghim TẬP: mỗi chuỗi phải nằm cùng dòng với một lời thuật riêng; số lời thuật bằng đúng số hằng rút được. Ba mutant riêng, mỗi mutant chỉ làm đỏ đúng cặp của nó | fixed: E8 chuyển sang ghim cặp một-đối-một + đẳng thức số lượng + ba mutant riêng |
| P1 | evals | E9 tuyên «ghim số case mới khai tường minh» nhưng không nơi nào khai TÊN case; ma trận toàn phần được hứa mà chưa viết trước | Bản vá thêm case cho hai ca, bỏ ca chưa-mở-xưởng và ca --extract. Người viết ghim đúng những dòng đang có → xanh. Hai AC mất lưới thường trực, refactor sau làm chốt rơi mà bộ kiểm im | Liệt TÊN case ngay trong evals.yaml; E9 assert BẰNG NHAU hai chiều giữa danh sách khai và dòng case đọc từ stdout — thiếu đỏ, thừa cũng đỏ. Không dùng số đếm trần | fixed: sáu tên case khai tường minh trong `expected` của E9, assert hai chiều |
| P2 | evals | E10 chỉ tin mã thoát của trọn bộ kiểm, không ghim đầu ra, không đối chứng dương — trong khi chính E9 khai suite xanh cả trên origin/main | Một tệp case ngưng nạp, runner bỏ qua và vẫn thoát 0 với ít case hơn. E10 xanh, thực tế mất trọn một tệp case | Ghim dòng tổng số case và so với cùng con số đo trên bản `git archive origin/main` trọn thư mục trong chính lần chạy; số mới phải ≥ base, 0 case fail | fixed: E10 dựng bản base bằng `git archive` TRỌN thư mục (không chép danh sách file tay) và so tổng số case hai đầu |
