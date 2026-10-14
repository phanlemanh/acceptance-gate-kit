---
slug: dinh-tuyen-theo-ma-muc
at: 2026-10-13T10:15:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Mốc «dòng cũ» chỉ dựa `at` viết tay; giới hạn khai chỉ chiều `at` sớm, bỏ chiều `at` muộn và múi giờ `+07:00`; lối «giờ máy trong mã d-<UTC>-<n>» chưa bị giết | Người ký 09:58, tác tử ghi `at` 11:00, lượt delta 10:30 chèn mục → dòng đọc thành ký-sau, mục mới coi như đã quyết; E2 vẫn xanh | Ma trận AC-3 thêm hàng `at` muộn/mã sớm và hàng `+07:00`; dòng S1 thay d-2 | fixed: mốc = giờ sớm nhất giữa `at` và giờ trong mã, so bằng Date.parse (design §3.2); AC-3 hàng 13, 14; E3 thêm chiều đỏ DM3-do thoi-diem; sổ d-20261013T100237Z-8 supersedes d-20261013T095808Z-2 |
| P0 | design | Căn cứ d-1 trích câu chỉ LIÊN QUAN (neo khuôn kit), không quyết «tiêu đề + tệp» hơn «mã do bên viết phát» | Cổng Phạm vi đọc d-1 là máy đi tiếp có căn cứ, không ai cân khoá định tuyến | Dòng S1 thay d-1 với lối chết nêu được | fixed: d-20261013T095825Z-7 supersedes d-20261013T095807Z-1, nguồn một-lối — mã do bên viết đòi đổi OOC-ITEM-TEMPLATE + bước mang-sang + bộ đọc mọi kho (vượt vòng vá) và hồ sơ hiện có không mang mã |
| P1 | design | Tin tiêu đề hơn số không xét thời điểm: chép lệch một hàng gán quyết định sai mục; mục tươi cùng mã thừa kế quyết định cũ | Lệnh ký chép tiêu đề mục 4 vào dòng «Ngoài-3» → mục 4 thành đã quyết không ai ra; lượt sau mục tươi «Thiếu kiểm lỗi» cùng tệp thừa kế | Ma trận AC-3 thêm hai hàng + chiều đỏ | fixed: dòng không cũ mà số mâu thuẫn tiêu đề → mồ côi; dòng cũ chỉ khớp mục mang nhãn mang-sang `(rN…)` (design §3.2); AC-3 hàng 5, 6; AC-1 + DM1 tuoi; DM3-do so-tieu-de |
| P1 | contract | Không chứng đường S4 delta thật sự ghi round-tally; «không round-tally → theo số» là chiều nguy hiểm chưa khai | Đường nào đó viết lại review-findings.md không phát round-tally → lỗi #375 tái diễn, E1/E2 xanh vì fixture tự chèn round-tally | Số đo ca gốc; ca chứng mọi đường S4 phát round-tally hoặc khai giới hạn | fixed: design §3.2 dẫn khối ROUND-TALLY-SCHEMA + ca W32/W37 (round-tally ở MỌI verdict) và luật «Mọi verdict» ghi run-log trước review-findings; §2 ghi số đo ca gốc trên origin (r4 chưa đẩy); §5 khai chiều nguy hiểm còn lại kèm ngưỡng |
| P1 | evals | E10 so với merge-base trôi theo trạng thái gộp; luoi-cay quét cây sống; paths `_acceptance/**/decisions.jsonl` làm hồ sơ hoá cũ ở mọi lần ký | Sau gộp merge-base = HEAD → DM9 đỏ vĩnh viễn trên main; mọi lần ký vòng khác làm hồ sơ này stale | Mốc cố định rút bằng lệnh; thu luoi-cay về tập khai; thu paths | fixed: mốc = cha commit đầu đưa ganDinhTuyen vào lib (cùng nếp HK-AC5), ca DM9 chon-moc; vi-phân chạy trên cây mốc; luoi-cay chỉ xét tập khai; paths chỉ giữ ledger tac-tu |
