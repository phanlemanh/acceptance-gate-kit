---
slug: dai-tom-tat-dem-dung-vi-sao-tron
at: 2026-10-12T04:13:33Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract (AC-9), evals (E9) | Trên dữ liệu thật E9 chỉ đo phần đầu ≤ 400 ký tự của trang (dài hơn 400, không kết «…», chứa đơn vị của dải) — không đòi câu cuối của đoạn hay mục cuối sau câu dẫn | Vật đặt trần thứ hai ~1 500 ký tự cho trang: sáu ca AC-8 ngắn hơn nên xanh, 301 hồ sơ thật vẫn dài hơn 400 nên E9 xanh — Ngoài-9 tái phát mà cổng ký xanh | So mục vi-sao với đoạn trang in trước khi có trần (bộ vẽ 7f65e5a0) — câu cuối + mục cuối; mutant trần thứ hai lớn hơn mọi ca AC-8 phải đỏ nêu tên hồ sơ thật | fixed: AC-9 và E9 đòi câu cuối (tham chiếu 7f65e5a0) + mục cuối (bộ tách độc lập), thêm DD-9-do-tran2 |
| P1 | contract | Không có mục Đường đo cho ngưỡng nghiệm thu; E7/E9 ghim crm 4c440ab1 + danh sách 91 nên không chạy lại được trên crm đã nhận mốc | 01/11 crm vẽ lại có hồ sơ mới — không lệnh nào đọc được ngưỡng, người phải tự đếm khối: một lượt gọi người ngoài thiết kế | Mục Đường đo gán từng vế ngưỡng cho một lệnh có tên in số | fixed: thêm mục «Đường đo» — chế độ --hien-tai của dai-tom-tat-sau-kho.mjs in bốn số (i)–(iv), kèm giới hạn khai thẳng |
| P1 | contract (AC-7), evals (E7) | Bảng 91 hồ sơ đổi là đầu ra của bản thử (tự đo chính bản thử); giá trị mới chỉ ghim cho hồ sơ đã soi tay, không đòi đủ 18 ca nhiều nhóm nói chưa đọc được | Vật tách dòng tiếp thụt 4 thành mục riêng: một hồ sơ cơ chế 3 ra 9 thay vì 7, vẫn trong tập 91, không trong nhóm soi tay → DD-7 xanh với số sai | Ghim giá trị cho đủ 91 từ nguồn không phải bản thử; assert đủ nhóm chưa đọc được; mutant tách dòng tiếp phải đỏ nêu hồ sơ thật | fixed: AC-7/E7 so MỌI hồ sơ đổi với bộ đếm và bộ dò độc lập của ca (không require mô-đun dải), assert 15/15 (số sau khi sửa bản thử ở khối ghim lại), thêm DD-7-do |
| P2 | evals (E10) | inputs của hội đồng thiếu lib/md-section.cjs (cắt mục) và scripts/lo-trinh.mjs [d-20261012T025950Z-13] | Hội đồng không thấy thân hàm cắt mục, không chắc tiêu đề Re-pin có trong mục → UNCERTAIN, owner quyết ở Cổng Bằng chứng | Thêm hai tệp vào inputs, câu hỏi nói rõ phần nào ở tệp nào | fixed: thêm lib/md-section.cjs + scripts/lo-trinh.mjs vào inputs/paths, question chỉ rõ vai từng tệp |
| P2 | contract (AC-5), evals (E5) | AC-5 chỉ dựng chiều hợp đồng hỏng + báo cáo đọc được; thiếu chiều gương — đúng ca thật cong-nguoi-doc-du-nguon | Vật chỉ xét hợp đồng; báo cáo hỏng vẫn in số hợp đồng — DD-5 xanh, trái lời giao | Ca gương + mutant chỉ xét nguồn hợp đồng | fixed: AC-5/E5 thêm chiều gương và DD-5-do-bao-cao |
