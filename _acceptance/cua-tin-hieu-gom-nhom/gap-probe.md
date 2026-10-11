---
slug: cua-tin-hieu-gom-nhom
at: 2026-10-11T09:07:21Z
verdict: findings
p0: 1
p1: 2
p2: 2
claims_input: ok
---

# Phản biện context sạch — cua-tin-hieu-gom-nhom

Một tác tử tươi, chỉ đọc design + contract + evals + sổ quyết định + bài học xuyên vòng (claim-scan) + ô cơ hội. Không re-probe sau khi sửa (one-pass).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Bộ vàng lộ đáp án: nhãn tín hiệu mang «sinh từ <slug>», tín hiệu thứ nhất lấy nguyên câu feature — trùng câu giao mà --chua-gom in cho hồ sơ đã giao | Tác tử gom theo slug trong nhãn: 10/10 cặp, 8/8 đã phủ, E10 PASS mà trục A chưa từng chạy — giả định 3 báo «đã đo» bằng phép đo không thể đỏ ở vế gom | Nhãn chỉ «giả» + sha; đáp án chỉ ở bo-vang.json vắng khỏi kho thử; E10 thêm ca kín-đáp-án (quét slug, quét tiêu đề trùng câu giao) có đối chứng dương và chiều đỏ | fixed: design §4 (bộ sinh không lấy câu feature, phien trung tính, id xáo, đáp án chỉ ở bo-vang.json), AC-10 + E10 thêm vế kín đáp án, đối chứng dương, TH-10-do2 |
| P1 | contract | Lời hứa «kho không khai → khối không có khoá» chưa có phép đo; E2 so hai phía cùng lo-trinh.mjs, E8 chỉ đòi bộ đọc ra [] | Thợ viết tin_hieu: khai ? … : [] — mọi kho không khai đổi byte LO-TRINH.html khi nâng mốc, E2 và E8 vẫn xanh | Vế quan hệ trên khối THÔ: tập khoá == bảng khoá trừ tin_hieu; chiều đỏ tiêm đối xứng | fixed: AC-2 + E2 thêm vế khối thô, TH-2-do tiêm đối xứng; design §4 hai vế |
| P1 | evals | E11 hỏi tiêu đề tín hiệu và ánh xạ cụm mà inputs không chứa — câu hỏi nói bo-vang.json chứa 20 tín hiệu, design nói không | Hội đồng UNCERTAIN đốt một lượt chấm, hoặc PASS chỉ dựa tên nhóm (tin-suông) | bo-vang.json bắt buộc 20 mục {id, tieu_de, ho_so, cum}; E10 round-trip mục == tệp | fixed: design §4 khuôn bo-vang.json 20 mục, E10 round-trip 20 mục == 20 tệp, câu hỏi E11 nêu đúng tệp chứa tiêu đề |
| P2 | evals | E8 «danh sách cảnh báo == bản trước khi thêm khoá» không nói bản trước lấy từ đâu — merge-base sống vô hiệu, sha cố định thành lệnh cấm | Sau gộp TH-8 tự so với chính nó, hoặc đỏ ở mọi vòng sau đổi cảnh báo | So quan hệ trên cây đang kiểm: cùng trang có/không khoá chèn bằng mã | fixed: E8 so trang (a) với (b) chèn tin_hieu: [] cùng bản chép rời, thêm TH-8-do2 |
| P2 | contract | Đường đo trỏ thứ vòng không giao: bộ chấm cặp chỉ là ca TH-10; mốc đếm «sửa dưới 1/5» tính cả lượt máy sửa cho răng xanh | Cổng Giá trị không có lệnh chạy trên crm; đọc CHẾT oan khi máy tự sửa 2 nhóm | Bộ chấm thành lệnh nhận đường dẫn + kiểm khai-trước; mốc đếm = commit đầu tiên răng xanh | fixed: rang/cham-bo-vang.mjs là lệnh (AC-10, E10 chạy trên bộ vàng thứ hai + đảo thứ tự commit), Đường đo và SKILL bước 4 neo mốc răng xanh |
