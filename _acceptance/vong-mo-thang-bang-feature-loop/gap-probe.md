---
slug: vong-mo-thang-bang-feature-loop
at: 2026-10-12T09:20:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Phản biện context sạch — vong-mo-thang-bang-feature-loop

Tác tử tươi, chỉ đọc design doc + contract + evals + sổ quyết định (bản nháp S1) + bài học xuyên vòng
(claim-scan, input 5) + `opportunity.md` (input 6). Một lượt, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E5 chỉ đo chuỗi có mặt trong khối CO-HOP-DONG-CHAN («co_hop_dong.chan», «làn V», «mời người») trong khi lời hứa là QUAN HỆ (khoá đúng thì làn V lẫn mời người đều chưa được) — cùng lớp [ci-cua-kho-bo-job-nang#F1]; khối S1#5 là răng duy nhất của làn V | Khối viết «khoá đúng → không cần mời người, đi làn V» vẫn chứa đủ chuỗi nên E5 xanh; phiên S1#5 đưa hợp đồng 14 tiêu chí qua làn V | Dòng điều kiện có cấu trúc rút bằng marker, so từng cặp khoá–giá trị; mutant đảo lan_v phải đỏ; khai giới hạn đo chỉ dẫn | fixed: AC-5 + E5 đòi dòng `khi: co_hop_dong.chan = true → lan_v: khong · moi_nguoi: khong · loi_ra: tach, giu` (lệnh duyệt: `ghi_duyet: khong · loi_ra: tach, giu`), so cặp khoá–giá trị, thêm AC-5-do-nghia; Notes + design §7 khai giới hạn đo chỉ dẫn kèm ngưỡng |
| P1 | evals | AC-2 hứa NỘI DUNG cờ (số, ngưỡng, mã + lý do dòng giữ, chuỗi giữ nguyên văn) nhưng E2 chỉ so loại cờ/vị trí/chữ quyết/extract; hai bên ghi khác (chuỗi trên thẻ đỏ, bước 4 lệnh duyệt) không có round-trip tới bộ đọc | Thẻ in «giữ cỡ - …» hay sai số tiêu chí mà E2 vẫn xanh; người gõ gạch thường ở lệnh duyệt, bộ đọc không nhận, thẻ đỏ lại — thêm một lượt gọi người | Assert văn cờ theo hằng ma trận và docKhoang; round-trip chuỗi rút từ HTML thẻ đỏ → sổ → thẻ xanh; bước 4 khoan dung hoặc trỏ khối | fixed: AC-2 thêm vế văn cờ + round-trip AC-2-vong; bộ đọc dòng giữ khoan dung dấu gạch (—, –, -), AC-3 thêm hai hàng gạch ngắn/gạch thường |
| P1 | evals | Chiều phủ định của E6 là danh sách đóng (chỉ «5-15», chỉ bốn tệp); cách viết cũ thứ hai «Core >15 → hợp nhất» lọt; «≥ 2 lần» không chứng mỗi bước có một lần | Người sửa giữ nguyên «Core >15 → hợp nhất», E6 xanh, Feature Loop vẫn dạy ngưỡng 15 | Quét theo lớp trên cả cây dạy, đòi 0; mutant chèn «Core >15» vào tệp ngoài danh sách phải đỏ; rút từng đoạn S1#3, S1#4 | fixed: AC-6 + E6 quét lớp ngưỡng cũ trên skills/ feature-loop/ commands/ dieu-phoi/ GUIDE README QUICKSTART, rút từng đoạn S1#3/S1#4, mutant AC-6-do-lop ở skills/morphological-scan/SKILL.md |
| P1 | contract | Trục A khai «không đọc được tiêu chí» và «mã trùng» gán AC-2 nhưng ma trận AC-2 không có hai giá trị đó | Hợp đồng viết AC theo dạng bộ đọc không nhận → n = 0, không cờ, đi làn V — sống giả im lặng; mã trùng đếm dòng thì thẻ và đồng hồ lệch nhóm | Thêm hai hàng viết trước vào ma trận AC-2 | fixed: AC-2 thêm hai ca biên (cờ vàng «không đọc được tiêu chí» + `loi`; 13 dòng 12 mã → n 12, cho-phep), ma trận 34 ca |
| P2 | contract | Đường đo dùng `--tu` mà không ghim trường ngày (chốt phạm vi hay ký) | Hồ sơ ≥ 13 chốt dưới engine cũ, ký trong cửa sổ 30 ngày → phiên nghiệm thu đọc CHẾT oan | Hàng AC-7 viết trước: chốt trước mốc, ký sau mốc → không đếm; Đường đo ghi đích danh trường ngày | fixed: AC-7 thêm hàng + nêu `approved_at`/`veto_opened_at`; Đường đo và design §4 ghi trường ngày |
