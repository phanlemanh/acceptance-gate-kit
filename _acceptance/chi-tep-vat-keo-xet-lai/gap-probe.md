---
slug: chi-tep-vat-keo-xet-lai
at: 2026-10-31T15:37:43Z
verdict: findings
p0: 3
p1: 1
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Đổi mặc định cho mọi kho (lưới bằng chứng cũ lỏng hơn) mà sổ không có câu «mặc định hay bật theo khoá» — khẩu vị rủi ro, chỉ người có | Cổng Phạm vi ký mà không thấy lối bật theo lựa chọn; kho không vấp mất một lưới không ai chọn | Dòng sổ S1 nguồn chỉ-người, hai lối kèm giá, lên lời mời Cổng Phạm vi | human-gate1: dòng sổ chỉ-người «Áp luật mới cho MỌI kho» — Hỏi-1 ở Cổng Phạm vi |
| P0 | design | Bỏ quét độ phủ bằng khẳng định; sót ô tệp thư mục con trùng tên tệp chữ và đường lùi khi không phân được [kiem-ban-cai-loi-sua-chay-duoc#F2] | Bản cài so theo basename vẫn qua năm AC; rang/opportunity.md bị coi là chữ, bỏ xét im lặng | Thêm ô rang/opportunity.md vào AC-2; đổi căn cứ dòng bỏ quét | fixed: ô rang-trung-ten trong AC-2/E2 (TV2 9 ô) + AC-6/E6 (TV6) + dòng sổ bỏ quét mới supersedes dòng cũ |
| P0 | design | Dòng sổ hạng T3 trích t3_paths nhưng còn vế gom Gate 1.5 mà câu trích không quyết [cong-cu-xet-tep-ton-tai#F1] | Người ký đọc việc gom hai cổng như có mục tiêu chống lưng | Tách hai dòng | fixed: hai dòng mới supersedes dòng cũ — hạng T3 (mục tiêu) · gom Gate 1.5 (một lối, nói rõ chủ kho đảo được ở lượt ấy) |
| P1 | contract | Lối lùi khi bộ phân tệp hỏng (design §5) không có AC; nếu node lỗi làm vị từ trả khác 0 thì nhánh NOTE chạy — fail-open | Kho có lib lệch bản: mọi hồ sơ cũ có PR chạm hồ sơ được NOTE, bỏ xét | AC-6 + E6 ma trận hàm vắng · đầu ra hỏng, đối chứng bản lành | fixed: AC-6, E6, ca TV6 (thiếu hẳn node: khai giới hạn ở trục G — lưới cần node ở nhiều luật khác) |
| P2 | contract | Given của AC-1 không nói evals.yaml của từng ô | Ô B1 không còn ô đo, hoặc chiều đỏ hỏng vì hạ tầng | Ghi trục B từng ô và assert trên kho thử | fixed: Given AC-1 + expected E1 ghi trục B từng ô; TV1 assert vắng/có evals.yaml trước khi chạy lưới |
