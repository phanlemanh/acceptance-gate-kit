---
slug: workspace-reader-unification
at: 2026-08-05T00:00:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

# Phản biện context sạch — workspace-reader-unification

Critic đọc đúng ba file (contract · evals · bài học xuyên feature), không đọc mã
nguồn. One-pass: artifact đã sửa theo cột Xử lý, KHÔNG probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals | Trục file khai 5 file nhưng chỉ `evidence-report.md` có bộ hình-dạng-hỏng trong AC-1; `opportunity.md` không xuất hiện ở AC nào. Lời hứa trung tâm chỉ được ghim cho ĐÚNG MỘT file. | Workspace có `opportunity.md` frontmatter hỏng: bản đồ gọi lành, bộ quét gọi hỏng — lệch đúng như vòng trước, mà E1–E3 vẫn XANH vì fixture chỉ tiêm `evidence-report`. Cổng 2 ký "đã gom trọn" trong khi mới vá file thứ năm. | Given của AC-1 thành tích Descartes tập-file × hình-dạng-hỏng, tập file RÚT từ bảng luật chứ không chép tay; thêm ca đỏ: thêm file vào bảng luật mà thiếu ca thì E1 phải đỏ. | fixed: viết lại AC-1 + E1/E2 theo tập-file-rút-từ-bảng-luật, thêm E16 đột biến thêm-file |
| P0 | contract + evals | Trục bên đọc khai "hook/CI" nhưng không AC nào nêu bên đọc hook/bash; AC-3 hứa card nói đúng điều CI nói mà không ca nào dựng điều kiện CI. E8 chạm bản bash lại treo dưới AC-3. | Trên CI checkout nông (không có commit chứa `PRODUCT-MAP.md`), reader không thấy lịch sử nên trả "chưa dựng", chốt xoá-bản-đồ tắt tín hiệu — đúng regression `daBat` ghi ở Notes round 16 — mà E6/E7/E8 vẫn XANH. | Thêm AC cho bên đọc hook/CI; E6/E7 sinh fixture ở CẢ hai dạng cây trong chính lần chạy, assert nhãn giống nhau giữa hai dạng cây và giữa hai bên đọc, rút từ cùng bảng nhãn. | fixed: thêm AC-7 + E17/E18 hai-dạng-cây; E8 chuyển sang AC-7 |
| P1 | evals | E9 nói thi hành chỉ dẫn chép BẰNG CODE nhưng không nói rút chỉ dẫn từ đâu. Chỉ KHUÔN được ghim một-chỗ-có-marker; THỦ TỤC CHÉP vẫn là văn xuôi, nên test tự cài lại — seam LLM-viết→máy-đọc y lớp lỗi `[context-ladder#F1]`. | Ai đó sửa chỉ dẫn chép trong thân skill; code E9 vẫn strip theo bản cài cứng nên E9/E10 XANH, còn người chép tay theo văn mới ra hồ sơ HỎNG — đúng thứ AC-4 hứa chặn. | Đặt thủ tục chép vào khối có marker; E9 rút khối rồi thi hành, assert số bước khớp; sửa khối trong bản sao mà kết quả không đổi là ĐỎ. | fixed: AC-4 đòi thủ tục ở khối có marker; E9 rút-rồi-thi-hành + E19 đột biến |
| P1 | evals | E1 là ca duy nhất chỉ LOG số tổ hợp mà không ASSERT nó, trong khi mọi ca anh em đều có bộ đếm chặn rỗng. | Bước dựng fixture cho hình dạng "khai đã xong mà thiếu hẳn file" hỏng im lặng; vòng lặp duyệt 3/4 hình dạng, in số 3, exit 0 — E1 XANH. Hình dạng nguy hiểm nhất chưa từng chạy lần nào. | E1 assert số tổ hợp == tích số đã khai và in DANH SÁCH id từng tổ hợp; nhỏ hơn kỳ vọng là ĐỎ kèm tên tổ hợp vắng. | fixed: E1 assert tích số + in danh sách id |
| P2 | evals | E14 gắn AC-1 và E15 gắn AC-3 trong khi nội dung không dính hai AC đó; không có AC ranh-giới để neo. | Ở Cổng 2, E14 đỏ vì `codex/` còn mô tả trỏ tới nghi thức chưa ship `[d-20260804T150301Z-31750]` nhưng báo quy lỗi cho AC-1, người ký sửa nhầm `lib/`. Ở Cổng 1, bảng phủ khiến AC-1/AC-3 trông dày hơn thực tế. | Thêm AC ranh-giới rồi trỏ E14/E15 vào đó. | fixed: thêm AC-8 (biên out-of-scope không rò rỉ), E14/E15 chuyển sang AC-8 |
