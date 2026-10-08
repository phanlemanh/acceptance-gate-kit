---
slug: doc-ghi-troi-mang-sang-run-id
at: 2026-10-08T11:15:21Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap-probe — doc-ghi-troi-mang-sang-run-id

Phản biện context sạch (tác tử con chỉ đọc contract.md, evals.yaml, khoá executor dgt_* và tệp claim-scan).
Chạy sau khi vật đã có (vòng sửa lỗi do giám sát đợt crm chuyển, owner đồng ý). Không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | AC-7 hứa bốn bộ CI xanh nhưng E7 chỉ chạy bộ workflows | Ca ở bộ scripts đỏ vì đổi evidence-core mà E7 vẫn xanh | Eval cho cả bốn bộ | rejected: feature_loop.suite_keys của kho chạy đủ bốn bộ (scripts 4 mảnh, hooks, plugins 3 vùng, workflows, product_map) ở MỌI lượt S4 — suite đỏ thì lượt không PASS được |
| P1 | contract+evals | Bước chèn của workflow chỉ thử nhãn (r1); DG2 so văn bản marker, không chứng minh workflow chạy bằng nó | Tác tử chép nhãn biến thể, workflow in hai lần mà DG2/DG3 xanh | Ma trận nhãn qua harness workflow + đột biến | fixed: ca DG3c chạy CHÍNH workflow với năm dạng nhãn — bắt được lỗi thật «(R1)» in hai lần (so startsWith chữ thường), đã sửa; DG7 là đột biến phía workflow |
| P1 | evals | Fixture tưởng tượng hình dạng, không lấy từ vật làm lộ lỗi | Dòng thật ở crm khác bảng 11 dòng, thẻ crm vẫn giấu mục | Hàng nguyên văn ẩn danh từ crm be8abc7e4 | fixed: DG1 thêm hai dòng giữ nguyên hình từ be8abc7e4 (backtick, hai chấm, «—», nháy đơn trong sao), DG1b 10/13 |
| P1 | evals | DR2b/DR4 chỉ so bằng với bản đủ; fixture chỉ một eval rỗng | Fixture hỏng làm cả hai bản cùng đỏ, so bằng vẫn xanh; bộ đọc dừng sau eval rỗng đầu | Ghim tuyệt đối + hai eval rỗng không liền nhau | fixed: DR2a bản đủ anyFailure=false (cấu hình khai verifier); DR2/DR4 hai eval rỗng E3, E7 (E5 thật ở giữa), recheck thoát 0 và in «E3, E7» |
| P2 | contract | Bên đọc chỉ thử "" và trống trơn, bên viết xử lý bốn dạng | Báo cáo mang run_id ' ' không được gọi tên | Đủ bốn dạng ở bên đọc | fixed: DR2 lặp qua "", '', ' ', trống trơn |
