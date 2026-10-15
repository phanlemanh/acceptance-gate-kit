---
slug: ap-chinh-sach-lo-trinh
at: 2026-10-15T01:25:50Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Hai dòng sổ máy tự quyết «trả lại thì ghim luôn» và «ghim là khoá trên hàng» ghi lý do loại lối khác, nhưng chính thiết kế phủ định lý do ấy. Sổ đã biết trạng thái trả lại, nên lối «chặn theo sổ tới khi đề xuất đổi» vẫn sống. Trang và cắt lượt cũng không cần đọc ghim trong vòng này | Một hàng bị trả lại khi đang đề xuất «chờ điều kiện» thì bị ghim vĩnh viễn. Về sau hồ sơ của nó bị bác, nhưng máy im. Mỗi lần trả lại còn sửa tệp, nên tuổi hàng bị đặt lại | Hai dòng sổ mới thay hai dòng cũ (supersedes), kèm ca «trả lại rồi đề xuất đổi» | fixed: hai dòng sổ mới thay d-…-6 và d-…-7. Trả lại chỉ chặn đúng đề xuất bị trả, theo câu B′ §11 «Veto một lần tự áp», và không ghim. Ghim chỉ sống trong sổ, tệp lộ trình không đổi, nên không đặt lại tuổi. AC-6 thêm ca (c) đề xuất đổi sau khi trả lại, và chiều đỏ «lệnh ghim đổi tệp lộ trình» |
| P1 | contract | AC-6 (d) đòi bỏ ghim xong thì báo trước lại T, nhưng thiết kế nói ghim đặt lại tuổi; hợp đồng cũng không nói có commit giữa các bước hay không | Ca có commit sau mỗi lần ghi thì T không còn quá tuổi, nên bộ máy đúng thiết kế lại ĐỎ. Ca không commit thì xanh, nhưng lời hứa «ghim đặt lại tuổi» chưa từng chạy | Ghim rõ việc commit giữa các bước; thêm ca đo tuổi sau ghim | fixed: ghim không còn đổi tệp nên không đặt lại tuổi. AC-6 ghim «mỗi lệnh ghi theo sau bởi một commit ghim ngày», và đo tuổi T/M trước và sau lệnh ghim bằng nhau |
| P1 | design | Lệnh mở việc áp chính sách TRƯỚC khi mở ô, nhưng không xét ca hàng sắp mở chính là hàng có báo trước đã qua nhịp | Chủ kho mở vòng cho hàng X; máy áp trước nên X bị chuyển sang «chờ điều kiện» trong khi vòng của X đang chạy | Thêm vế vào AC-10: hàng đang được mở thì huỷ báo trước và giữ chỗ cũ, kèm chiều đỏ | fixed: thiết kế §4 thêm bước 5 «hàng đang được mở thì không áp, ghi huỷ». AC-10 thêm hàng H cùng chiều đỏ «áp hàng đang mở: H» |
| P1 | contract | Thước «0 lần dời bằng tay» trừ commit máy chỉ nhờ tiêu đề commit, mà tiêu đề do lời dặn trong SKILL tạo ra | Kho gộp PR bằng squash, hoặc phiên gộp commit máy với commit khác: thước đếm các lần máy dời thành dời tay, ngưỡng đọc ra CHẾT dù máy làm đúng | Trừ bằng dòng `ap` của sổ; thêm ca commit lẫn và ca squash | fixed: thước trừ bằng sổ (mã + ngày + khối đích), tiêu đề chỉ là đường phụ (dòng sổ S1 mới). AC-10 thêm ca commit không tiêu đề, ca commit lẫn, và chiều đỏ «trừ theo tiêu đề». Giới hạn khai ở Notes |
| P1 | evals | Thiết kế chỉ áp khi đề xuất còn nguyên lúc áp, nhưng không ca nào đo ca đề xuất ĐỔI giữa lúc báo trước và lúc áp | X được báo trước «chờ điều kiện»; hôm sau hồ sơ X bị bác; bản máy chỉ so mã thì áp «bác» ngay, mà hành động ấy chưa từng được báo trước | Ca đề xuất đổi: huỷ cái cũ, báo trước cái mới, áp ngày sau; kèm chiều đỏ | fixed: thiết kế §4 bước 3 thêm nhánh «đổi». AC-2/E2 thêm ca AP-2-doi và chiều đỏ AP-2-do4 «áp đề xuất chưa báo trước: X bac» |
