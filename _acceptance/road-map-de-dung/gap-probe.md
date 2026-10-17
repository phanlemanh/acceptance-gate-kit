---
slug: road-map-de-dung
at: 2026-10-17T12:52:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap-probe — road-map-de-dung

Phản biện context sạch (tác tử chấm-đọc, bốn tệp + claims làm input thứ 5). Một lượt, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Khoá mới `vi_sao` trên mốc là CỘNG mà phần A xếp TRỪ; sổ ghi một-lối trong khi lối `ly_do` của `da_bac` vẫn sống; không AC nào đo trang hiện `vi_sao` | Chủ kho ký A = TRỪ mà không thấy khoá schema mới; trang vẽ hay không vẽ `vi_sao` đều xanh | Dòng sổ thay d-4; nếu giữ khoá thì ca RD-5-vi-sao có chiều đỏ | fixed: bỏ khoá `vi_sao`, lý do hạn ở `ly_do` của `da_bac` (sổ d-10 supersedes d-4, nguồn mục-tiêu «TRỪ tự đi; CỘNG cần owner»); AC-1/AC-3/E3 và design §4.1 sửa theo |
| P0 | design | Sổ d-1 ghi một-lối cho chỗ thứ ba = `da_bac`, nhưng lối khoá mới chỉ đắt hơn; chữ «Đã bác» mà đội kho tiêu thụ đọc là nghĩa sản phẩm — chỉ người có [cham-lai-khong-tu-doi#F1] [cua-tin-hieu-giua-chien-dich#F1] | crm chuyển 17 mốc ngoài, việc của đội hiện dưới «Đã bác», đội đọc thành kit bác việc | Câu hỏi ở Cổng Phạm vi + ca đo chữ tiêu đề mục trên trang vẽ từ khuôn | human-gate1: sổ d-11 (chi-nguoi, supersedes d-1) — khuyến nghị dùng `da_bac`, tiêu đề trang «Không làm trong kho», mỗi mục kèm `ly_do`; ca RD-3-trang ghim chữ tiêu đề + `ly_do` nhìn thấy |
| P1 | evals | Đáp án E4 viết tay không qua răng; ba tệp chữ của E7 xuất một lần không kiểm lại [lo-trinh-gio-may#F2] | Đáp án đặt mã ở hai chỗ mà giám khảo vẫn PASS; lượt sửa đổi khối Mốc mà giám khảo đọc chữ cũ | RD-4-dap-an + RD-7-tuoi có chiều đỏ | fixed: thêm E11 (RD-4-dap-an, round-trip qua răng) và E12 (RD-7-tuoi, vẽ lại trong lượt so từng byte, code chọn ba mốc); AC-4, AC-7 thêm vế |
| P1 | contract | `surfaces: [ui, cli]` mà không eval ui-check và sổ không có dòng bỏ ui-observed | Thẻ Cổng Bằng chứng cờ mặt ui không quan sát, chủ kho hỏi lại ngoài thiết kế | Dòng sổ `descope` «bỏ ui-observed — …» | fixed: sổ d-12 «bỏ ui-observed» trỏ E6 (Chrome thật LTT-ten/LTT-san) + E7 |
| P1 | evals | E9 lệch AC-9 (ô còn hàng chưa giao), RD-9-crm xanh khi tập rỗng, RD-9-trang không ghim vắng dòng gom | Bốn mốc qua ngày của hạt giống là mốc ngoài nên tập rỗng vẫn PASS; hai ngày cùng tập mốc che dòng gom trên trang | Bảng kỳ vọng 36 ô; ô còn hàng so vi phân bộ máy cũ; RD-9-crm gán mỗi mốc vào đúng một dòng, rỗng = FAIL; RD-9-trang ghim vắng chuỗi, hai tập khác nhau | fixed: AC-9 + E9 viết lại đúng các vế đề xuất |
