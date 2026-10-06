---
slug: loc-paths-dong-mac-dinh
at: 2026-10-06T09:47:53Z
verdict: findings
p0: 1
p1: 2
p2: 1
---

# Gap probe: loc-paths-dong-mac-dinh

Phản biện context sạch (một tác tử tươi, sáu đầu vào: design · contract · evals · sổ quyết định ·
bài học xuyên feature · ô cơ hội). Không đọc code repo.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + design | Lưới crm báo LỖI cho thư mục trần, bảng bảy bước NHẬN thư mục trần có thật (D4); AC-2 chỉ khai ngoại lệ chiều chặt hơn | Vật đúng theo design làm E2 đỏ ngay trên bản lành; sửa vật cho E2 xanh thì E1 và AC-3a đỏ — hai AC không cùng xanh được | Khai D4 là ngoại lệ có tên chiều ngược; E2 assert hai hiệu tập bằng đúng hằng viết trước | fixed: AC-2 và E2 assert (lưới − bộ lọc) = {D4}, (bộ lọc − lưới) = {D15, D17}; design sửa câu đối chiếu; sổ quyết định ghi cách đọc hai luật owner (cửa veto ở Cổng Phạm vi) |
| P1 | contract + evals | Tệp đổi không cố định từng ô; các ô nhận D1, D3, D5, D6 có thể cho kept rỗng mà vẫn khớp | Bộ khớp hỏng với `[slug]`, `(app)` hay tên có dấu vẫn cho E1 18/18 vì tệp đích không có trong diff | Mỗi ô một diff riêng (đích + mồi), kept bằng đúng tập viết trước; mutant khớp-glob-trả-rỗng | fixed: ma trận D thêm cột Tệp đổi và kept bằng đúng; AC-1/E1 thêm mutant «kept rỗng» phải lật D1, D3, D5, D6 |
| P1 | contract + evals | Tập ô đỏ của mutant viết tay, mâu thuẫn với fixture (AC-1 thật lật nhiều hơn bốn ô; AC-5 không lệch được ở D2, D4 khi diff luôn chạm đích) | Chân đỏ không bao giờ đạt hoặc đạt vì thước, lượt chấm cháy | Tập ô lật do code tính, chỉ ghim tập tối thiểu viết trước | fixed: AC-1/E1 và AC-5/E5 tính tập lệch trong lượt và chỉ đòi chứa tập tối thiểu (D4, D12 · D1, D3, D5, D6 · (D4, chỉ mồi)); AC-5 chạy hai diff mỗi ô (36 lượt) |
| P2 | contract | Ngưỡng phát lại ≥ 33 % chỉ có phương pháp, không có định nghĩa mẫu số và lệnh | Hai lần đọc lúc cắt mốc cho hai con số, ngưỡng không quyết được | Khuôn lệnh và định nghĩa mẫu số trong Đường đo | fixed: Đường đo định nghĩa tử số, mẫu số, cây và evals tại sha; lệnh một dòng đi vào ghi chú mốc |
