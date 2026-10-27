---
slug: design-floor-vendor-va-ban-va-a
at: 2026-10-27T05:00:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-20261027T035402Z-6 ghi nguồn mot-loi nhưng lối «trường băm-sau sinh từ sổ» vẫn sống, và lựa chọn lệch câu chữ kế hoạch bước 4 «tệp khoá ghi cả hai băm» mà không khai | Cổng Phạm vi ký mà không thấy lệch kế hoạch; FL3–FL5 tìm băm sau trong tệp khoá không thấy | Dòng sổ mới thay d-6, nguồn muc-tieu trích luật MỘT cây nguồn, khai lệch kế hoạch; design ghi dòng lệch | fixed: dòng d-20261027T035837Z-15 (supersedes d-6, muc-tieu CLAUDE.md «MỘT cây nguồn…»), design doc thêm đoạn «Lệch kế hoạch bước 4» |
| P1 | evals | E5 chỉ kiểm chuỗi XFAIL: FN-02 có mặt trong khi AC-5 hứa quan hệ tập vi_pham = bốn cặp figma và gioi_han không còn DF-07, DF-08 | Khối máy giữ 16 cặp memory mà E5 vẫn xanh | So tập bằng nhau + đột biến thêm lại một cặp memory phải đỏ | fixed: AC-5 + E5 so TẬP bốn cặp viết độc lập trong executor, kiểm gioi_han; đột biến BAN-VA-A thêm lại cặp memory → FAIL «đã khai mà KHÔNG còn» |
| P1 | contract | BG-01 đo tất định bằng hai lần dựng cùng đường dẫn, không đo phụ thuộc chỗ checkout | Bản gói mang đường tính theo thư mục dựng → CI ở đường khác hoặc dong-bo --kiem trong thư mục tạm lệch byte | Lần dựng thứ hai từ bản sao ở đường tuyệt đối khác, so byte | fixed: AC-3 + E3 — lần dựng thứ hai từ bản sao nguồn ở thư mục tạm cùng bố cục, cả hai bằng tệp commit |
| P1 | evals | Đối chứng của DESIGN_FLOOR_KHONG_MANG chỉ chạy trên dong-bo --kiem, không trên đường run-tests.sh đi qua | chuanBiNguon còn nhánh lấy mạng → E4 xanh mà CI vẫn lấy upstream | Đối chứng trên chuanBiNguon (gốc không có vendored → ném lỗi) + gate.yml đặt biến | fixed: AC-4 + E4 — ca tu-thu nhãn MANG (chuanBiNguon ném «thiếu bản vendored», layUpstream ném «KHONG_MANG»), grep gate.yml có DESIGN_FLOOR_KHONG_MANG |
| P2 | contract | Thiếu đột biến: xoá một tệp vendored, giới hạn thiếu can_upstream, dòng A thiếu lam_xanh; ngưỡng 124 ở ô lệch 126 ở hợp đồng | Bộ đọc bỏ sót tệp thiếu hoặc trường thiếu mà E1, E7 vẫn xanh | Ba đột biến mang thông điệp ghim + dòng sổ cầu nối ngưỡng | fixed: AC-1/E1 thêm đột biến xoá tệp và thiếu lam_xanh; AC-7/E7 thêm thiếu can_upstream; dòng d-20261027T035837Z-16 nối ngưỡng 124 → 126 |
