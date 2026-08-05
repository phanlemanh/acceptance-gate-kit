---
slug: gold-output-measure
at: 2026-08-05T12:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | E3 tự mâu thuẫn AC-3: contract ghim ma trận hình-dạng × chiều-đếm nhưng E3 chỉ khai 6 assert — per-lens dồn về một hình dạng, đúng lớp "tuyên lớp nhưng điểm-case" mà feature này sinh ra để đóng | agreement() đếm lensUncertain sai riêng nhánh chẵn 2/2 (nhánh mới, chưa từng có test) mà suite vẫn xanh → Gate 2 tuyên đã đóng finding MEDIUM trong khi chính nhánh được nêu tên còn hở | Ma trận toàn phần 4 hình dạng × 3 chiều = 12 assert, 1 assert/ô | fixed: E3 viết lại 4×3=12, per-lens kiểm trên TỪNG hình dạng |
| P1 | evals | J1 không ghim provenance của evidence/gold-stdout.txt — câu hỏi tự tuyên "STDOUT thật" nhưng không phép đo nào ép file do node sinh trong round (hình dạng 2 của luật thước-gắn-vào-vật) | Round sau copy nhầm bản cũ hoặc agent viết tay bản "đẹp"; 3 lượt judge PASS trên văn render() không in ra → AC-11 PASS giả | Máy sinh lại STDOUT trong phép đo rồi byte-compare với file judge đọc | fixed: nhét vào E10 — vắng/lệch → đỏ |
| P1 | design | Không chốt máy SIGNOFF-JARGON-GLOSS ⊆ HFL-GLOSSARY-TERMS — render đọc marker mới, P96 chỉ đọc marker cũ ↔ CONTEXT.md; phụ thuộc người viết nhớ thêm cả hai chỗ [matrix-measure-law#F1] | Term tương lai chỉ thêm vào gloss marker: sổ in chú giải, P96 xanh vì không thấy term, CONTEXT.md không có mục → lời hứa single-source âm thầm gãy | Assert tập-con đọc cả hai marker từ file thật + đối chứng tiêm term lạ | fixed: nhét vào E9 |
| P1 | evals | AC-7 hứa 2 surface (lời người + hạng mục) nhưng E7 chỉ tiêm vào human_override — nửa lời hứa không có ô đo | Reader chỉ quét lời người; hạng mục mang "dogfood" không vào Từ điển → E7 xanh, AC-7 PASS trong khi nửa lời hứa chưa chạy | Ma trận 2 surface × 2 chiều | fixed: E7 mở rộng đủ 4 ô |
| P2 | evals | Đối chứng âm E1 chỉ kiểu XOÁ (hàng biến mất) — chứng minh đường lọc, không chứng minh assert 4-cột so nội dung | Assert lỏng thành chuỗi-có-mặt; render tráo nội dung 2 cột vẫn xanh — lớp đo-chuỗi-thay-quan-hệ tái diễn | Đối chứng ĐỔI-GIÁ-TRỊ từng trường đủ 4 cột | fixed: E1 thêm đối chứng đổi-giá-trị per-cột |
