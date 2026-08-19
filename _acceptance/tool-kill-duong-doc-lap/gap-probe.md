---
slug: tool-kill-duong-doc-lap
at: 2026-08-19T03:40:00Z
verdict: findings
p0: 0
p1: 2
p2: 2
---

# Phản biện context sạch — tool-kill-duong-doc-lap

Critic phiên sạch, 4 file artifact + input 5 (claims từ 12 hồ sơ trước, advisory)
+ 2 file phụ trợ hội đồng. Cả 4 finding đã ĐỊNH ĐOẠT trước Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals (E6 + giao thức ca-E6) | Gói nạp inline cho agent hành động (Phase 3 SAU sửa · khối luật · prompt lane machine «như workflow dựng») không bắt buộc CODE-SINH từ vật thật; transcript không ghi dấu vết nguồn — lớp «fixture viết tay đúng khuôn bên đọc» ngay trên bộ đo hành vi DUY NHẤT của đường độc lập (cùng họ [doi-hanh-vi-cong-nguoi#F1]) | Phiên điều phối chép tay/gọn lại đoạn Phase 3 → 3 agent viết đúng đáp án → E6 PASS trong khi SKILL.md ship thiếu mục 4 → repo tiêu thụ vẫn REJECT oan; E5 grep chuỗi không bắt | Chân sinh gói từ file thật tại commit + sha256 từng phần vào transcript; giám khảo đối chiếu, lệch → UNCERTAIN | fixed: thêm `dung-goi.mjs` (rút Phase 3 bằng lib/md-section.cjs · khối marker · prompt machine do harness sinh) → `hoi-dong/goi-E6-ca<N>.md` + `goi-E6.sha256`; header transcript cite sha; đáp án + question E6 có điều kiện tiên quyết; AC-6 sửa khớp |
| P1 | evals (E4, E5) | Chân răng N phần tử nhưng MỘT chiều đỏ; E5 ghim «BLOCKED đi kèm killed» là chuỗi-có-mặt toàn file trong khi lời hứa AC-5 là QUAN HỆ ở đúng mục 4 | Thi công thêm mục 2 + template mà quên routing mục 4 (chính lỗ gốc) — 'BLOCKED' và 'killed' đã có chỗ khác trong file → E5 xanh trên vật thiếu phần quan trọng nhất | Ma trận toàn phần: mỗi phần tử một mutant code-sinh cùng lượt, đếm mutant đỏ = số phần tử; E5 cắt đúng section Phase 3 và ghim quan hệ trong cùng gạch đầu dòng mục 4 | fixed: E4 2 mutant (--require · toolKillRule); E5 cắt section bằng md-section, ghim theo mục 1/2/4 + template, 4 mutant, răng in số mutant đỏ = 4 |
| P2 | design #4 + evals E2 | Phép rút khối marker ở HAI nơi (JS + W25) không ràng buộc — hai regex cùng lỗi (chỉ lấy dòng đầu) thì «nguyên văn» thành trùng lỗi | JS rút cụt, test chép cùng regex → prompt.includes xanh ba lane trong khi verifier chỉ nhận một dòng luật cụt | W25 tách theo DÒNG giữa hai marker, assert mọi dòng không rỗng (kể cả dòng cuối) có trong từng prompt; đường dẫn suy từ import.meta.url | fixed: E2 expected ghi luật tách-theo-dòng + assert từng dòng + không regex + đường dẫn từ import.meta.url |
| P2 | evals E1 | Phạm vi «đúng 1 lần» loại tests/ và không nói vendor/ → bản chép fallback trong harness không bị đếm; «không fallback chuỗi cứng» chỉ đo trong JS | Harness try/catch trả literal luật → file nguồn dời chỗ, suite vẫn xanh trong khi main loop thật BLOCKED — Gate 2 tin 7 dòng PASS W25 | Mở E1 sang toàn cây git trừ docs/ và _acceptance/ (kể cả tests/ + vendor/); harness đọc file phải THROW khi thiếu | fixed: E1 quét `git ls-files` trừ docs/ + _acceptance/, harness.mjs 0 hit; E2 expected ghi «đọc lỗi → THROW, không fallback» |
