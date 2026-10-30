---
slug: thiet-ke-nap-tri-thuc
at: 2026-10-24T14:05:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Hai hàng của bảng thẻ đá nhau: ô có «Nguồn:» trỏ trang kho riêng mà dòng tra mang khong_doc — chặn vì thiếu trang hay không chặn vì không đọc được | Máy ở máy không có kho riêng tự gỡ mãi không xong, rơi về gọi người — trái ngưỡng «không đọc được thì nhãn, không chặn» | AC-3 thêm hàng ba (ô do lệnh mở ô sinh, dòng tra khong_doc) kèm đối chứng không khong_doc và mutant bỏ phép miễn | fixed: design khai thứ tự ưu tiên (khong_doc thắng thiếu trang); AC-3 hàng ba + đối chứng + mutant; dòng sổ mới d-…-14 |
| P0 | contract | Vòng là CỘNG (thêm khoá chặn Cổng Phạm vi) mà sổ không khai, không đưa thành câu hỏi cho chủ kho | Thẻ đi làn V, khoá chặn mới phát hành tới mọi kho đã khai tri_thuc mà chủ kho chưa phê | Thẻ Cổng Phạm vi có Hỏi-1 về CỘNG, không ra làn V | fixed: dòng sổ chi-nguoi «Đây là một CỘNG …» (Hỏi-1) + mục CỘNG trong design |
| P0 | contract | Dòng d-10 trích luật đọc-cũ thiếu vế «cờ vàng», chốt hồ sơ approved không cờ | Lựa chọn «im» đi qua cổng với căn cứ sai; vật làm đúng luật bị AC-7 chấm đỏ | AC-7 đòi đúng một cờ vàng đọc-cũ ở hồ sơ approved | fixed: dòng mới supersedes d-10 trích «nhánh đọc bản cũ + cờ vàng»; AC-7 và design sửa theo |
| P1 | contract | Không AC nào có hồ sơ mang hai dòng tra, dù đường tự gỡ dựa vào luật «dòng cuối còn hiệu lực» | Bộ đọc lấy dòng đầu: máy ghi dòng đủ mà thẻ vẫn chặn, tự gỡ không dứt | AC-1 hàng năm, sáu + mutant lấy dòng đầu | fixed: AC-1 thêm hai hàng ghi bằng khối DEC-TRI-THUC-TRA thật và mutant TN-1-mutant-dau |
| P1 | design | --clone không ràng đích clone nằm ngoài cây kho công khai | Kho khai đường kho riêng trong cây; clone đặt raw nhạy cảm vào cây crm, một lần git add là lộ không đảo được | AC-4 thêm hàng đường trong cây → thoát 3, không thư mục, git status trước = sau | fixed: --clone từ chối đường trong cây (dòng sổ mot-loi mới); AC-4 thêm hàng |

Ngoài năm mục: khoá executor E10 chưa khai ở đầu evals (fixed: thêm dòng khai `thiet_ke_nap_hoi_quy`); AC-1 hàng 3–4 chưa ghim «không cờ tri thức» (fixed: AC-1 và E1 ghim 0 cờ tri thức).
