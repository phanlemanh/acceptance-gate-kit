---
slug: duong-do-trong-dinh-nghia-xong
at: 2026-08-22T02:05:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | Design §3 nói R0 «không cờ, không khối», AC-3/E3 nói «khối vẫn in» — hai nguồn trái nhau | Thi công theo design → DD3 đỏ trên vật đúng-theo-design; hoặc Gate 1 duyệt hai lời hứa mâu thuẫn | Chốt một chiều theo AC-3 (khối in khi có dòng thật; R0 chỉ nói về cờ), sửa design; E3 ghim khối in ở cả (a)(b) | fixed: design §3 + AC-3 + E3 chốt «khối in, không cờ» |
| P1 | contract | Dòng mẫu bỏ `Bỏ đường-đo — …` nằm trong section nhưng «dòng thật» = «không còn {{» → dòng Bỏ bị đếm là đường đo; RK thiếu chân «section chỉ có dòng Bỏ» | Gõ dòng Bỏ vào section mà không entry ledger → khối xanh, 0 cờ → cửa bỏ có tên vô hiệu, Gate 1 duyệt tưởng có đường đo | Dòng bắt đầu tiền tố bỏ KHÔNG vào lines; DD2 thêm (c) chỉ dòng Bỏ + không entry → vàng; DD4 thêm (d) chỉ dòng Bỏ + entry → info | fixed: AC-1/AC-2(c)/AC-4(d) + E2/E4 |
| P1 | evals | d-4303 hứa «áp dụng» = vị từ ut của khối Ngưỡng nhưng E1/E3 chỉ đo hai đầu mút — không eval nào ghim quan hệ applicable ⇔ khối Ngưỡng in | Thi công viết vị từ riêng (đòi mọi dòng không «…») → hồ sơ điền 1–2 dòng: thẻ in Ngưỡng nhưng applicable:false → không cờ vàng dù vắng section | Mọi fixture DD1–DD4 assert applicable === (HTML có khối Ngưỡng nghiệm thu); fixture biên 1 thật + 3 «…» | fixed: AC-1/AC-3 + E1/E3 |
| P2 | evals | E6 đo bằng kim chuỗi mà SKILL có thể chứa ở chỗ khác; không đối chứng đếm-hit-trong-phạm-vi; mutant chỉ mô tả — [cat-khoi-viec-cua-anh-tren-tin#F1] | Mệnh đề bị gỡ khỏi ý (4) nhưng «opportunity.md» còn ở dòng khác → E6 xanh | Cắt phạm vi đúng bullet S1#4 / ý (4) S1#7; đếm hit == 1; reader chạy trên bản sao mutant và ASSERT đỏ | fixed: AC-6 + E6 |
| P2 | evals | Tiền tố bỏ sống ba chỗ (khuôn · gate-card · SKIL auto-draft) nhưng round-trip chỉ hai; E6 ghim SKILL bằng literal = bản sao thứ tư | Đổi tiền tố ở khuôn + gate-card, quên SKILL → máy auto-draft tiền tố cũ → cờ vàng giả dù đã bỏ có tên | DD6 rút tiền tố từ SKILL, so bằng DUONG_DO_DESCOPE rút từ gate-card; bản sao SKILL đổi tiền tố → đỏ | fixed: AC-6 round-trip ba đầu + E6 |
