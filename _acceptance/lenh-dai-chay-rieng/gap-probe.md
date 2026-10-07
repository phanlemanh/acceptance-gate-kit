---
slug: lenh-dai-chay-rieng
at: 2026-10-07T01:58:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Gap-probe — lenh-dai-chay-rieng

Phản biện context sạch (một tác tử tươi, chỉ đọc design + contract + evals + decisions + claims). One-pass: sửa artifact, không probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + contract AC-3 | Đuôi nhật ký in ở __CHUA_XONG và __QUA_HAN vẫn mang dòng __EXIT= giả của lệnh; normDau cho dấu thắng lời khai | Lệnh in __EXIT=0 giữa chừng rồi quá hạn; tác tử dán đuôi kèm cannotRun; normDau đọc 0 → PASS thay vì BLOCKED | Ca LN4 hai biến thể (quá hạn + cannotRun, chưa xong + killedByTool) → blocked; mutant không che dấu → đỏ | fixed: CHO_NEN che mọi dòng __EXIT= trong đuôi chưa-xong; AC-3 + E3 thêm LN4 và chiều đỏ «dấu giả thắng khi chưa xong» |
| P1 | design §A + contract AC-2 | TRAN_LAN=540 cần tác tử truyền timeout; trần mặc định công cụ 120 s | Tác tử quên timeout → lệnh chờ bị đẩy sang nền ở 120 s, tệp trống, tái hiện đúng sự cố 1 | Assert TRAN_LAN đọc từ prompt ≤ 110 | fixed: TRAN_LAN=100 (máy giữ, không dặn bằng lời); đuôi chưa-xong rút còn 5 dòng để nhiều lần chờ không phình ngữ cảnh; AC-2 + E2 assert ≤ 110 |
| P1 | contract AC-7 + evals E7 | Base = merge-base trùng cây sau khi gộp → vi phân rỗng vĩnh viễn | Chạy lại trên main: hai bên cùng tệp, xanh mà không so gì | Base mốc cố định + đối chứng «nguồn base khác nguồn cây» | fixed: base = tag v2.24.0 (CI fetch-depth 0 có tag); trùng nguồn → ĐỎ «base trùng cây»; tag không giải được → ĐỎ gọi tên hạ tầng |
| P2 | contract AC-3 + evals E3 LN2 | «pid không còn sống» không nói pid nào; giết vỏ thì cháu mồ côi vẫn xanh | Bản dựng chỉ kill pid vỏ, sleep 60 sống, ca vẫn xanh | Pid canh do chính cháu ghi + mutant chỉ giết pid vỏ | fixed: LN2 dùng pid canh của cháu (exec sleep), chờ có trần; chiều đỏ «cây con sống sót sau __QUA_HAN» |
| P2 | contract Coverage + evals E2/E6 | Ô «cả hai» (chạy-riêng + dài — đúng ca crm E6/E7) không có phép đo | Nhóm chạy-riêng đi bộ dựng prompt thường → BLOCKED như crm lượt 2–3 mà E2, E6 vẫn xanh | Ca CR5 + mutant nhóm chạy-riêng dùng khung thường | fixed: AC-6 + E6 thêm CR5 và chiều đỏ «chạy-riêng mất khung nền»; Coverage trỏ AC-6 |

Vết nhỏ ngoài bảng (E4 hỏi «luật cũ còn nguyên» mà hội đồng không có bản cũ): fixed — câu hỏi đổi thành «luật lệnh-bị-giết-thật vẫn có mặt, không mâu thuẫn».
