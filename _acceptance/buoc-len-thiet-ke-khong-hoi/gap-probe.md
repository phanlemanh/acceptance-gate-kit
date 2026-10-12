---
slug: buoc-len-thiet-ke-khong-hoi
at: 2026-10-11T09:36:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

# Phản biện context sạch — buoc-len-thiet-ke-khong-hoi

Đầu vào: design doc · contract.md · evals.yaml · decisions.jsonl (11 dòng lúc probe) · bài học xuyên hồ sơ
(claim-scan, 12 dòng) · opportunity.md. Tác tử tươi, không đọc mã, không chạy lệnh. Thêm vào ý (4) đúng
luật vòng này tự dựng: soi câu trích của dòng nguồn mục-tiêu.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Chỉ dòng nguồn mục-tiêu được phản biện soi; `kho_dao:false` và `loi_chet` của dòng một-lối là nhãn máy tự gán mà không lưới, không giới hạn khai, không ngưỡng | Vòng crm ghi «xoá bản ghi cũ khi chuyển khuôn» là `mot-loi`, `kho_dao:false` → lớp da-quyet, thẻ để vào khối «anh lật được», một chữ «duyệt» cho việc khó-đảo qua cổng chưa từng thành câu hỏi; E1 và E4 vẫn xanh | §3.6 và E1 mở rộng ra MỌI dòng máy đã quyết: chạm khó-đảo mà ghi false → P0; lối khác có thật chết không; §4 khai thêm giới hạn + ngưỡng | fixed: §3.6 soi mọi dòng máy đã quyết (khó-đảo · câu trích quyết · lối chết thật · chỉ-người bị ghi máy quyết), P0 xử lý bằng dòng S1 mới mang supersedes; §4 + Notes khai giới hạn «kho_dao, loi_chet là nhãn máy tự gán» với ngưỡng ≥ 1 dòng máy đã quyết chạm khó-đảo bị lật; AC-1 và E1 thêm vế |
| P0 | contract | Hai dòng nguồn mục-tiêu có câu trích chỉ liên quan, không quyết: d-4 (mô-đun ở scripts/, trích lý do T3 của vòng X2 trong khi vòng này đã T3) và d-8 (bỏ design-pass, trích «≤3 lượt gọi» — vòng T3 bốn cổng đã vượt mức đó; đánh đổi khoảnh khắc nhìn lấy lượt gọi là loại chỉ người có) | Thẻ in hai dòng ở khối «Máy đã quyết» kèm câu trích như luật đã quyết; E10 xanh vì câu trích có thật; một chữ «duyệt» thành ký hộ | Đổi hai dòng thành chi-nguoi, hoặc thay câu trích quyết được | fixed: d-12 thay d-4 (nguồn một-lối — lib/ ngoài ranh giới tệp lời giao); d-14 thay d-8 thành câu hỏi (chi-nguoi: khuyến nghị bỏ, lối khác chạy design-pass bất đồng bộ kèm giá); bộ phân loại thêm lớp `bi-thay`; AC-4, AC-10 cập nhật |
| P1 | contract + evals | (a) Không lời dặn nào bắt lối «sửa:» ở Cổng Phạm vi ghi dòng gate1 mang supersedes — bên viết của cột «máy quyết bị lật» không tồn tại, kho thử AC-7 dựng đúng khuôn bên đọc; (b) luật `sinh-trong-vong` chỉ chạy khi thẻ nhận gốc nhánh, không gì bắt lệnh dựng thẻ ở S1 mục 5 truyền nó | (a) Chủ kho lật bằng «sửa:», máy ghi dòng S1 mới không kèm dòng gate1 → `--dem` đọc 0 mãi, phiên nghiệm thu đọc SỐNG khi ngưỡng CHẾT đã chạm; (b) vòng crm thêm câu vào CONTEXT.md trong nhánh rồi trỏ vào → thẻ không cờ gốc ra da-quyet kèm ghi chú | (a) khuôn dòng lật sau marker + ca rút từ SKILL ghi bằng DEC-ID-RECIPE rồi đếm; AC-6 in số dòng gate1 có supersedes trên hồ sơ có sẵn; (b) thẻ nháp thiếu gốc → cờ vàng, không chỉ ghi chú | fixed: (a) khối khuôn `DEC-LAT-GATE1` + lời dặn ghi trước khi soạn lại (§3.8, AC-1); E7 thêm ca khuôn-lat rút từ SKILL qua DEC-ID-RECIPE + mũi tiêm đổi stage; AC-6/E6 in số dòng gate1 có supersedes; (b) bước 3 của lệnh dựng thẻ truyền gốc khi sổ có dòng mang can_cu; thẻ nháp có dòng mục-tiêu mà thiếu gốc → đúng một cờ vàng (AC-5 ca khong-goc) |
| P1 | contract | Ô có 11 ứng viên; hợp đồng bỏ 3 mà không cái nào thành câu hỏi — ứng viên 9 (áp lối khác trong lượt ký) ghi máy quyết một-lối bằng ranh giới tệp, trong khi ô đã đo 0/8 câu theo khuyến nghị; ứng viên 8 và 10 ra Out of scope không có dòng descope | Thẻ chỉ có Hỏi-1; một chữ «duyệt» thu hẹp phạm vi ô đã ký mà chủ kho chưa được hỏi; mỗi câu chỉ-người sau phát hành thành «sửa:» → ký lại, lượt gọi chỉ dời chỗ | Ứng viên 9 thành câu hỏi; hai dòng descope có can_cu cho ứng viên 8 và 10 | fixed: d-13 thay d-6 thành câu hỏi (khuyến nghị hàng riêng ngay sau; lối khác làm ngay — chạm lệnh duyệt, ngoài ranh giới lời giao); d-15 (ứng viên 8, một-lối: bộ phân loại không đọc nghĩa câu, phát lại qua model là hàng G3); d-16 (ứng viên 10, mục-tiêu: «TRỪ tự đi; CỘNG cần owner phê duyệt»); thẻ nay có ba câu hỏi |
| P2 | design | §6 còn khuôn cũ (khoá executor mới trong config.yaml, tệp .test.mjs) trái Notes, d-10 và evals; §3.7 gắn ngưỡng vào AC-8 thay AC-7 | Kế hoạch dựng theo §6 → sửa config.yaml làm cũ hồ sơ khác; tệp .test.mjs không được phần bash gọi → E2–E7, E10 thiếu dòng PASS, đốt một lượt chấm | Sửa §6, §3.7 cho khớp hợp đồng | fixed: §6 liệt `tests/scripts/can-cu-s1.ca.mjs` gọi từ phần bash, ghi rõ KHÔNG chạm config.yaml; §3.7 trỏ AC-7 |
