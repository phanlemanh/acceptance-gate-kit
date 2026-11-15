---
slug: phan-du-bo-cuc-moi
at: 2026-11-15T02:30:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | «Lũy đẳng» sai với chuỗi nói về commit lịch sử phẳng: luật bước 6 đổi `scripts/x` thành `plugins/<lõi>/scripts/x` ở mọi chỗ, bộ dịch để `plugins/…` đi nguyên nên đường ra không có thật; d-6 ghi một-lối trong khi lối dùng bước 6 không chết và ô đã ký chốt thước có bước 6 | `--moi` không bước 6 cho E3–E11 PASS, kịch bản thật làm mọi ca `git show <ref phẳng>:plugins/…` đỏ — SỐNG trượt sau ký | Ma trận AC-2 có ô `plugins/…` × cây phẳng/commit trước #503 ra đường có thật; thước kho mới chạy cả biến thể có luật chung bước 6 | fixed: design §2 chuẩn hoá hai chiều, AC-2 + E2 thêm ô `plugins/…` × cây phẳng, design §7 + E-moi hai biến thể (có bước 6 chép ở `rang/buoc6-chep.mjs`); sổ d-12 thay d-2, d-14 thay d-6 (nguồn mục tiêu, trích ô đã ký) |
| P1 | evals | E1 rút tệp kiểm chỉ từ `tests/` nên bỏ sót tệp kiểm điều phối (E8 khai `dieu-phoi/tests/**`) | Vòng xoá một ca DP6 mà E1 vẫn in «0 khoá mất» | Danh sách tệp phủ mọi tệp kiểm điều phối; CU-DO thứ hai trên một tệp điều phối | fixed: tệp kiểm điều phối thật nằm ở `tests/dieu-phoi/` (đường sai là của E8, đã sửa); AC-1 nêu rõ `tests/dieu-phoi/`, E1 thêm CU-DO trên một tệp ở đó |
| P1 | contract | AC-4 hứa đầu ra bố cục cũ bằng từng byte mà không nói nhánh nào; nhánh dự phòng ở bố cục cũ đổi đầu ra có chủ ý | E4 chỉ chạy nhánh chính, nhánh dự phòng đổi đầu ra không ai thấy — hoặc E4 đỏ vì AC tự mâu thuẫn | Ma trận viết trước {cũ, mới} × {có, thiếu tệp khai} cho hai lệnh, kỳ vọng ghim từng ô, đối chứng nhánh dự phòng thật sự chạy | fixed: AC-4 + E4 thành ma trận 8 ô; ô cũ+thiếu khác bản gốc đúng chữ tên gói, nêu lý do ở design §4 (bản cài cũ luôn có tệp khai cạnh lõi) |
| P1 | design | d-5 (miễn mọi ngày trong fixture) ghi nguồn mục tiêu bằng câu trích chỉ liên quan, và cách sửa nới một ca canh | LT-94-do mất khả năng bắt một ngày viết cứng trùng ngày fixture; CHẾT xảy ra không ai thấy | Dòng sổ mới nguồn một-lối; một ca đo chốt ngày chạy còn sống | fixed: đổi cách sửa — dời mốc «Tới» sang 2026-10-20 (ngày đã qua), danh sách miễn không nới (d-13 thay d-5); E1 thêm CU-LT94 chạy dưới đồng hồ ghim ở 2026-10-20 phải đỏ |
| P1 | contract | Hỏi-2 khuyên gom giới hạn nạp cứng nhưng không AC/eval nào cho lối được khuyên | Chủ kho chọn theo khuyến nghị, hành vi T3 mới không thước nào đo, hoặc máy thêm AC sau cổng | AC có điều kiện + eval: kho thiếu `lib/ho-goi.cjs` nạp êm, lỗi có tên; đối chứng kho đủ | fixed: AC-12 (chỉ khi Hỏi-2 chọn gom) + E13, cả hai dời Out of scope cùng lượt nếu chọn không gom |
