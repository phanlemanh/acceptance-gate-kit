---
slug: cau-tin-hieu-nguoi-gui
at: 2026-10-12T10:20:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Phản biện context sạch — cau-tin-hieu-nguoi-gui

Một tác tử tươi đọc design + contract + evals + sổ quyết định + ô cơ hội + bài học xuyên hồ sơ (claim-scan,
12 dòng). Không đọc mã. Một lượt (không re-probe).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Phép so «trường cũ không đổi byte» ghim vào cả cây kit ở mốc `294b29db`, không có ca im cho thay đổi đến từ main — cùng lớp [eval-goi-model-that-khong-chay#F1] | PR #324/#325 sửa `scripts/lo-trinh.mjs` gộp vào nhánh trước S4 → trang của kho không khai khác base → ca đỏ dù vòng không chạm, đốt một lượt chấm; sau khi ký mọi lượt ghim lại đều đỏ | Base rút trong lượt; thêm ca im có thay đổi phía base | fixed: base = cây đang kiểm với RIÊNG `scripts/tin-hieu.mjs` lấy từ `294b29db` (tệp mã duy nhất của vòng); ca im tiêm `lo-trinh.mjs` phía base vẫn xanh; vế «kho không khai giống byte» bỏ khỏi AC-2 vì ca TH-2 của hồ sơ L3 đã giữ — AC-2, E2, design §8 |
| P1 | evals | «đã giao ngày …» cần bộ đọc mới cho chữ ký, nhưng ca dựng báo cáo bằng một dòng viết tay đúng khuôn bên đọc; bản sao crm không kiểm ngày; múi giờ không chốt | Chữ ký thật khác khuôn → bộ đọc không rút được ngày → rơi lặng về «đã giao» không ngày, mọi eval vẫn xanh | Chép báo cáo đã ký thật; ngày rút độc lập; ca đỏ chữ ký có mà không ngày | fixed: CN-1 dùng bản chép nguyên văn báo cáo đã ký của hồ sơ `cua-tin-hieu-gom-nhom`, ngày mong đợi rút độc lập; `--cau` đỏ khi chữ ký có mà không đọc được ngày (AC-5); E9 kiểm ngày của hồ sơ đã giao thật ở crm; design §3 chốt «YYYY-MM-DD đầu tiên, đúng như người ký ghi» (đo 12/10: mọi chữ ký kit và crm dạng «<tên> YYYY-MM-DD», không giờ) — AC-1, AC-5, AC-9, E1, E5, E9 |
| P2 | design | Nhánh «đã phủ» của bảng câu chưa xác định đủ (câu dự phòng không suy được) và nhánh «đã phủ bởi việc chưa giao» không ca nào chạm | S3 tự chọn câu rồi chép vào ca → tiêu chí xanh trên câu chưa ai duyệt; tín hiệu phủ bởi việc đang làm nói sai «đã giao» | Bảng nguyên văn theo tổ hợp; đo đủ tổ hợp | fixed: «đã phủ» dùng chung khuôn «— <tình trạng>» với chỗ «thành việc»; design §3 thêm bảng nguyên văn sáu tổ hợp; AC-1 thêm tín hiệu phủ bởi việc chưa giao, AC-4 thêm ca việc phủ đã giao không chữ ký — AC-1, AC-4, E1, E4 |
| P2 | design | Cụm tình trạng do kit viết nhưng §5 coi mọi chỗ trống là dữ liệu → từ khung trong cụm tình trạng không bị kiểm; mutant chỉ đặt ở chỗ không có chỗ trống | Sửa sau này đổi «tạm hoãn» thành «… xếp lại hàng sau» → câu mang «hàng» mà phép kiểm vẫn thoát 0 | Cụm tình trạng thuộc phần kit viết; mutant trong cụm; đếm số câu đỏ | fixed: design §5 — dấu canh chỉ dùng cho chữ lấy từ dữ liệu; E6 thêm CN-6-do-tt (chèn «hồ sơ» vào cụm «tạm hoãn»); CN-6-do2 đòi số câu đỏ == số câu chứa từ mới — AC-6, E6 |
| P2 | contract | Coverage gán «tiếng Việt có dấu (NFC)» mà không ca nào có chữ dạng tổ hợp; so từ cấm không chuẩn hoá | Lý do gõ bằng bảng mã tổ hợp chứa «lượt gom» → không khớp từ cấm → câu lọt | Ca NFD + mutant bỏ chuẩn hoá | fixed: design §5 chuẩn hoá NFC cả câu và từ/mã trước khi so; E6 thêm ca NFD và CN-6-do4; Coverage gán AC-6 — AC-6, E6 |
