---
slug: nen-cong-cu-lenh-shell
at: 2026-09-19T01:15:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Không AC nào buộc bản vá vào TRIỆU CHỨNG đã khai (crm nhánh onehub tắt cờ vàng); design tự mâu thuẫn khi nói khoá ngoài `feature_loop.suite_keys` thì «không chân nào của nền chạm tới» | Ship đúng vị từ, 8 eval xanh, owner ký; chạy lại đường nền trên crm thì `nen: do` VẪN bật vì khoá gây đỏ nằm ngoài tập chân cong_cu duyệt. Người hưởng nêu trong Context không nhận được gì mà không phép đo nào phát hiện | Ca fixture chép NGUYÊN VĂN dòng executor đang làm crm đỏ; trước vá ≥1 bullet, sau vá 0 bullet. AC nói rõ tập khoá chân cong_cu duyệt | fixed: xác minh trên `~/dev/crm` nhánh `onehub` — ĐÚNG MỘT executor có từ đầu mở bằng `${`: `executors.design.ui_check` dòng 425; `khoaExecutor()` duyệt MỌI khoá `executors.<loại>.<tên>` nên chân cong_cu CÓ chạm khoá ngoài suite_keys (câu «không chạm» chỉ đúng cho chân suite). Thêm AC-9 + E9 (ca NEN-TD6 chép nguyên văn chuỗi ấy, hai chiều); sửa §Vấn đề và §Giới hạn của design doc |
| P1 | evals | E8 hứa 13 ca cũ vẫn PASS nhưng phán quyết chỉ là mã thoát 0 của trọn suite — trái chính luật ghi ở đầu evals.yaml | Ca cũ bị đổi tên, bị return sớm nuốt, hoặc rơi khỏi vòng quét `*.test.mjs`; suite vẫn thoát 0; AC-8 PASS trong khi răng hồi quy đã biến mất | E8 assert số dòng PASS mang tiền tố NEN bằng ĐÚNG 13 và liệt kê đủ 13 tên; thiếu tên nào là đỏ gọi tên ca vắng | fixed: đổi E8 sang executor riêng `ncc_hoi_quy_nen` ghim đủ 13 tên + đếm bằng đúng 13; suite đầy đủ vẫn chạy qua `feature_loop.suite_keys` |
| P1 | evals | E6 (ca đột biến) kết luận từ MÀU: không ghim thông điệp đỏ, không đối chứng dương rằng bản chép CHƯA TIÊM chạy xanh | Bản chép hỏng vì hạ tầng (thiếu module, sai đường dẫn) → thoát khác 0 → ca đọc «ĐỎ» → AC-6 PASS trong khi luật `CONG-CU-TU-DAU` chưa bao giờ được chạy tới | E6 chạy HAI lượt trên cùng bản chép: chưa tiêm phải XANH, đã tiêm phải ĐỎ ghim đúng chuỗi cụt `THIEU ${BIEN_KHONG_CO:-$(` | fixed: NEN-TD5 dựng hai lượt trên cùng bản chép, lượt chưa tiêm không xanh thì ca tự đỏ với thông điệp «ban chep hong» |
| P1 | evals | E7 tự khai chiều đỏ không chạy trong eval, và assert là chuỗi-có-mặt trên toàn tệp thay vì neo vào ô `cong_cu` của bảng | `duong-nen-template.md` vốn đã nói «stderr» ở mô tả chân luoi/engine, nên lệnh thoát 0 ngay cả khi ô `cong_cu` không được sửa một chữ | Bóc ô của hàng `cong_cu` rồi mới khớp; bản sao gỡ từng vế khỏi riêng ô ấy phải thoát khác 0 có thông điệp gọi tên vế vắng | fixed: `rang-khuon.sh` đã bóc đúng hàng và đã chạy chiều đỏ trong cùng lượt — `expected` của E7 viết sai so với vật, đã sửa lại cho khớp; thêm ghim thông điệp vế vắng và ghim bản đột biến phải khác bản gốc |
| P2 | contract | AC-5 chỉ có chiều NHẠY, thiếu chiều ĐẶC HIỆU (im khi không bỏ tra); E5 bỏ ca mở-nhóm của AC-4 | S3 in dòng lý do cho MỌI khoá cho chắc; E5 vẫn xanh; stderr thành nhiễu ở mọi kho tiêu thụ mà không ca nào bắt được | Ở lượt của NEN0 và NEN1 stderr KHÔNG chứa dòng lý do nào; số dòng lý do bằng đúng số khoá bị bỏ tra; ghim thêm stderr cho NEN-TD3 | fixed: AC-5 thêm vế đặc hiệu; NEN-TD4 đếm đúng số dòng lý do và kiểm im ở NEN0/NEN1, kiểm có ở NEN-TD1 và NEN-TD3 |
