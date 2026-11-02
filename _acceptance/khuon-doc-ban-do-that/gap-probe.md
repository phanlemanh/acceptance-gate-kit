---
slug: khuon-doc-ban-do-that
at: 2026-11-02T05:05:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-3 ghi nguồn mục-tiêu cho L2 (miễn khuôn cho tệp dựng thẳng lớp trình bày) nhưng câu trích chỉ mô tả vấn đề, không quyết lối; L2 tự khai một đánh đổi khẩu vị rủi ro (tệp lẽ ra dựng khuôn đầy đủ sẽ lọt) và gán nghĩa cho một khoá dùng chung mọi kho. Cùng lớp [ten-may-mot-luat#F2], [khuon-loi#F2]. | Chủ kho ký Cổng Phạm vi tưởng «Vá trước» đã chọn cách miễn; sau 2.37.0 kho thứ hai khai lop_trinh_bay theo nghĩa «chỉ lớp con» và mọi tệp màn dựng thẳng lớp con lọt bước chấm mà không ai được hỏi. | Dòng S1 mới mang supersedes d-3, nguồn chỉ-người, nêu khuyến nghị và giá lối kia. | human-gate1: dòng sổ d-20261102T043717Z-8 (Hỏi) thay d-3 — khuyến nghị miễn đúng tên đã khai; lối khác giữ báo lệch hoặc hạ cờ vàng, kèm giá. |
| P1 | evals | E1 chỉ dựng một cách viết khoi: [A, B]; trục Coverage nối danh sách khối vào AC-1 mà không ma trận viết trước. | Bộ đọc tách đúng ở mapping khối nhưng cắt sai danh sách lồng trong mapping một dòng, hoặc đọc danh sách khối thành rỗng; KD-1 vẫn xanh. | E1 thành ma trận viết sẵn ≥6 hàng (cách viết khoi × kiểu mục) + một hàng ly_do có dấu phẩy, in số hàng. | fixed: AC-1 viết lại phủ các cách viết khoi × hai kiểu mục + ly_do có dấu phẩy; E1 ma trận «số hàng: 7» (danh sách khối trong mapping một dòng không phải YAML), so cả bộ đọc lẫn CLI --json. |
| P1 | evals | Ma trận E4 3 hàng thiếu ô cấp đầu danh sách, ca khai cả hai chỗ (hợp lại), và các dạng nhập (as, mặc định, ns.X) design hứa. | Một tệp nhập lớp trình bày bằng as hay ns.L vẫn bị báo khuôn; khai cả hai chỗ thì một chỗ đè chỗ kia; E4 vẫn xanh. | E4 ≥4 ô chỗ × kiểu + hàng hợp hai chỗ + bốn dạng nhập, in số hàng hằng. | fixed: AC-4 nêu hợp hai chỗ và bốn dạng nhập; E4 ma trận «số hàng: 8» (4 ô chỗ × kiểu, 1 hàng hợp, 3 dạng nhập — tên gốc đã ở 4 ô đầu). |
| P1 | contract | Triệu chứng đo trên crm là đường NỢ CŨ nhưng AC-2, AC-3 chỉ dựng T là tệp mới; không AC nào ghim chiều xanh và đỏ của đường nợ cũ. | Đường nợ cũ đọc ngoại lệ ở nhánh khác vẫn so chuỗi cũ; KD-2/3/7 xanh mà crm vẫn thấy nợ cũ cho khối đã khai. | Thêm hàng T có sẵn ở base cho AC-2, AC-3; E7 khai rõ tệp nào ở base. | fixed: AC-2, AC-3 hai hàng (T mới · T có ở base, nhánh chạm T) với chiều xanh và chiều đỏ «nợ cũ: T · B»; E7 base có ba tệp ngăn mang khối ngoại lệ (hai dạng danh sách), nhánh thêm ba (một dạng danh sách). |
| P1 | contract | Ô cơ hội hỏi trên bản đồ thật của crm nhưng Đường đo thay bằng kho mẫu viết tay theo hình dạng, không có lượt đo nào trên tệp thật cho số SAU so mốc gốc. | Tệp crm có chi tiết kho mẫu bỏ sót (chú thích sau […], nháy, thụt lề); KD-7 xanh, 2.37.0 cắt, crm vẫn báo oan — phải có 2.37.1. | Chạy bộ đọc và bước chấm trên bản sao crm 7341a193 với hai cấu hình mốc gốc, ghi số SAU vào hồ sơ trước Cổng Bằng chứng, không commit tệp crm. | fixed: mục Đường đo thêm dòng «số SAU trên tệp thật của crm» (bản sao dùng một lần, hai cấu hình mốc gốc, ghi ở design.md §5 trước Cổng Bằng chứng); KD-7 vẫn là thước của lượt chấm vì kho crm riêng tư không có ở CI. |
