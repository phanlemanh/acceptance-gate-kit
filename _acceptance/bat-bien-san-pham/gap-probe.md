---
slug: bat-bien-san-pham
at: 2026-10-11T13:26:20Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — bat-bien-san-pham

Một tác tử tươi, đọc đúng sáu tệp (design doc · hợp đồng · evals · sổ · bài học xuyên feature · ô cơ
hội), không đọc mã. Một lượt, không phản biện lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ bỏ «bộ rà nhận tệp luật» (nguồn một-lối) chưa giết được lối «hợp đồng chở mục luật đã nạp» mà giả định 4 của ô cơ hội nêu; phép thử của giả định 4 chưa chạy | Một vòng crm viết lại hàm giờ VN không chứa dấu hiệu; bộ rà thấy nhưng không gọi được mã luật; khối luật trống — đúng vế CHẾT | Chạy phép thử giả định 4, ghi kết quả vào design §4/§5; sổ thêm dòng cho lối đó | fixed: soi mã bộ chấm — hợp đồng chỉ đến bộ phân loại phạm vi (acceptance-verify.js dòng 1529), bộ tìm lỗi chỉ đọc CLAUDE.md (dòng 1097) → lối «hợp đồng chở luật» chết, ghi design §4; dòng sổ cũ được thay bằng dòng có lối chết đúng; thêm lối sống: thẻ gắn nhãn luật cho mục ngoài hợp đồng nhắc SP-n + kho trỏ tệp luật trong CLAUDE.md (AC-8, AC-9) |
| P0 | design | Dòng «ô SP để trống, máy không khuyến nghị» ghi máy quyết bằng câu trích chỉ quyết vế «câu hỏi trên thẻ có sẵn»; vế không khuyến nghị là khẩu vị chỉ người có | Ba mã chạm, ô trống không khuyến nghị → vượt một chạm mỗi lượt; Cổng Phạm vi không thấy lựa chọn này | Tách dòng; vế khuyến nghị thành câu chỉ-người lên thẻ | fixed: dòng cũ được thay bằng hai dòng — mục-tiêu cho «câu hỏi trên thẻ có sẵn», chỉ-người (Hỏi trên thẻ Cổng Phạm vi) cho «điền sẵn khuyến nghị sửa vật»; design §3.4, AC-8, E8 theo khuyến nghị |
| P1 | evals | E9 đưa design doc vào inputs (đáp án viết sẵn); nối dây S4 không có ca máy | SKILL quên gọi bộ soi ở S4; hội đồng đọc design chấm PASS; crm mọi thẻ cờ vàng, thêm lượt gọi người | Bỏ design khỏi E9; ca máy rút khối S4 từ SKILL, mutant xoá dòng phải đỏ | fixed: bỏ design doc khỏi inputs E9; AC-9 nêu S1 mục 7 của SKILL; thêm E12 (LS-09) kiểm nối dây S4 có chiều đỏ |
| P1 | contract | Đường đo chỉ đo một phần: --dem chỉ chạy trên ca nạp; mẫu số «sau ngày khai» chưa định nghĩa; cột sửa tệp luật không tách máy/người | Cổng Giá trị đọc cột chạm ra 0 oan, hoặc commit riêng của chủ kho bị đếm thành máy sửa luật | Ca đếm đủ cột trên kho thử sáu hồ sơ; tách commit máy theo dòng đồng tác giả | fixed: thêm AC-11 + E13 (LS-11) đủ sáu cột, --tu ngày khai; sua_tep_luat tách may/nguoi theo dòng Co-Authored-By: Claude (AC-7, design §3.4, giới hạn §4) |
| P1 | evals | E2 so vi phân với crm bằng đường có thể cứng, FAIL khi crm vắng, ghim ngưỡng số, gốc cố định, nằm trong suite thường trực | CI/máy khác không có crm → PR đỏ dù vật đúng; vòng sau đổi thẻ → đỏ vĩnh viễn | Đường crm từ biến/khoá; vắng thì bỏ qua có tên; gốc đọc từ Notes; chỉ chạy khi hồ sơ chưa ký | fixed: LS_CRM_ROOT, vắng → «crm=vang»; gốc đọc từ Notes hợp đồng; ca in «da-ky» khi hồ sơ đã ký; n đếm trong ca, không ghim số; chân crm chạy tay một lần, bản chụp trong evidence/ (giới hạn §4) |
