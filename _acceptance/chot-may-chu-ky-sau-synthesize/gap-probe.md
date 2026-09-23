---
slug: chot-may-chu-ky-sau-synthesize
at: 2026-09-23T04:13:40Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — chot-may-chu-ky-sau-synthesize

Phản biện context sạch trên bốn artifact S1 + tệp bài học claim-scan (12 dòng). Không finding
nào dựa vào claim. Sửa artifact xong không probe lại (one-pass).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + evals | Phép chiều im tự lặp lại vật: luật khớp khoá không phụ thuộc vị trí nên dòng hình khoá trong khối output cũng bị viết lại, và «mọi dòng đổi mang khoá» không bao giờ đỏ | S4 của chính vòng này in «human_signoff: …» trong output của test; chốt xoá nó, báo cáo ghi output mà test chưa từng in; E6 và E7 vẫn xanh | Chiều im so với vị trí trường của bên viết; fixture khối vô hướng giữ nguyên byte; mutant khớp mọi cột | fixed: luật chỉ áp ở vị trí trường (frontmatter cấp 0 + dòng trường khối); AC-3 thêm khối vô hướng + văn xuôi; AC-6 đòi dòng đổi nằm ở vị trí trường; AC-8 thêm mutant «khớp mọi cột»; giới hạn L3 của bên đọc khai ở Notes kèm ngưỡng |
| P1 | design + contract | Thiếu trục trạng thái hồ sơ khi S4 chạy; hồ sơ đã ký chạy lại S4 sẽ mất chữ ký | Chiến dịch ghim lại chạy S4 trên hồ sơ đã ký, chốt xoá chữ ký thật hàng loạt | Khai rõ đường nào chạy S4 trên hồ sơ đã ký | fixed: thêm trục F ở Coverage + đoạn «Hồ sơ đã ký chạy lại S4» có nguồn — ghim lại đi repin-lane (không chạm chữ ký); S4 trên hồ sơ đã ký chỉ qua bảo vệ hết-hạn, chữ ký cũ mất là đúng ý |
| P2 | contract + evals | W14 bị trình như tương thích ngược trong khi báo cáo thật luôn có verified_at | Kho tự dựng args thiếu invokedAt bị BLOCKED mọi lượt, Gate 1 hiểu sai | Kiểm bên dựng args | fixed: Notes + design nói rõ W14 chỉ đúng cho báo cáo không verified_at; bên dựng args duy nhất là s4-args.mjs (luôn ghi invokedAt); thêm ca CTN-AC4-ben-goi |
| P2 | evals + design | AC-2 chỉ phủ một khuôn khối, không ghim verifiedAt carry khác invokedAt | Khối carry mở bằng khoá khác bị coi ngoài khối, bằng chứng cũ khai là mới đo | Ma trận toàn phần khuôn khối × tươi/carry; mutant carry lấy invokedAt | fixed: AC-2 thành ma trận viết trước, số assert = số ô; CTN-AC2-carry-khac; mutant CTN-AC8-carry |
| P2 | contract + evals | AC-7 hứa bốn nhánh mà E7 chỉ đo một; ca đỏ nằm dưới E8; không đòi k ≥ 1 | Nhánh crm gộp rồi xoá, script vẫn thoát 0 mà không thấy hồ sơ gốc | Ca từng nhánh trên kho git tạm | fixed: E9 mới (AC-7) năm ca trên kho tạm do code sinh; E7 đòi k ≥ 1; bỏ CTN-AC7-vang khỏi E8 |
