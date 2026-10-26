---
slug: trao-vai-va-do-sau-gop
at: 2026-10-26T07:33:27Z
verdict: findings
p0: 1
p1: 2
p2: 2
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract · evals · design | Phép đo mới vẫn mắc bất biến lúc gộp ở vế trước gộp: mốc trước gộp là sha ghim..cây làm việc | CI của PR checkout cây = nhánh + main; ca đổi thân của vòng khác trên main rơi vào tập, CI đỏ giả | Mốc trước gộp từ merge-base, thêm hàng nhánh đã nhận main | fixed: đổi nghiệm — TC1-09/TC1-06 so lịch sử hai đầu cố định (45e9f2cf đến sha chấm TC1), không đọc cây làm việc; bỏ ca tập-đổi-thân-của-PR khỏi suite; AC-5, AC-7, AC-8 viết lại; dòng sổ mới supersedes d-3 |
| P1 | design · decisions d-3 · contract AC-5 | mocSo chỉ nhận một dạng thông điệp gộp, rơi im về sha ghim với squash, gộp tay, fast-forward hay gộp TC1b trước #419 | TC1-09/TC1-06 quay về sha ghim mãi, TC2 đỏ giả | Hàng cho các kiểu gộp, cờ vàng thay rơi im | fixed: bỏ mocSo; phép so lịch sử không phụ thuộc kiểu gộp; sha chấm vắng thì bỏ qua có tên (AC-5) |
| P1 | contract · evals E8b | Tập so của AC-8 không xác định (ca mới, nguồn sổ, sổ đọc từ cây làm việc) | TC1-09 đỏ vì ca mới; E8b đỏ hay phải ghi bịa dòng fix | Một luật cho ca mới, một nguồn sổ, sổ đọc tại sha cố định | fixed: Context định nghĩa ca đổi thân chỉ tính ca có ở mốc đầu; sổ TC1 đọc tại sha chấm; AC-8 chỉ còn suite xanh hai môi trường, ca đổi thân của vòng khai trong sổ để đọc, không răng |
| P2 | design · contract | Sau đổi, TC1-06 thành phép so hằng — lưới hồi quy đọc-cũ thôi canh cây làm việc mà không khai | Vòng sau làm hỏng bộ đọc cũ, TC1-06 vẫn xanh | Khai trong Notes kèm ca còn canh | fixed: Notes của hợp đồng và design §2.3 khai TC1-06/TC1-09 là bằng chứng lịch sử; lưới sống DP3-09, TC1-03 |
| P2 | design · contract AC-2 | Trục B «mã CLI vắng» khi tự nhận lại không có AC | Lệnh chạy không biến xoá phien_cli của giám sát đang sống | Thêm hàng AC-2b | fixed: AC-2 thêm vế môi trường đã xoá hai biến → vai vẫn giữ phien_cli |
