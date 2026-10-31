---
slug: va-design-floor-kho-lon-nhanh-chinh
at: 2026-10-31T09:58:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng bỏ quét độ phủ có lý do vòng tròn, bỏ sót trục trạng thái origin/HEAD (hợp lệ · treo còn nhánh cục bộ · treo mất nhánh cục bộ · có origin mà không origin/HEAD); số «bốn ô do AC-1..5» không khớp. Cùng lớp [cong-cu-xet-tep-ton-tai#F1] [kiem-ban-cai-loi-sua-chay-duoc#F2] | Cổng ký trên Coverage máy tự khẳng định; ô origin/HEAD → origin/master khi origin/main còn đổi kết quả mà không ai khai | Chạy morphological-scan preset test-matrix trên ba trục; viết lại Coverage; thay dòng sổ bỏ quét | fixed: Coverage viết lại ba trục, ô khác 2.36.0 có chủ ý khai tên; dòng sổ mới supersedes dòng bỏ quét; sinh thêm ca CU-DOI-TEN và CU-CI |
| P1 | design | Thứ tự origin/X rồi X chọn nhánh cục bộ X đã cũ khi remote đổi master→main rồi fetch --prune | S4 so diff với master cũ, diff phình, lệch 2.36.0 trong khi cổng ký «lùi như 2.36.0» | Ca CU-DOI-TEN: master cục bộ còn, origin/master mất; bản sửa = bản 2.36.0 | fixed: thiết kế chỉ thử origin/X; ca CU-DOI-TEN thêm vào AC-4/E4 (chiều đỏ: thiết kế đầu lệch); dòng sổ cũ được thay |
| P1 | evals | Thông điệp ghim LON-DOT «ra M0» mâu thuẫn thiết kế bỏ catch→[] | Đột biến đỏ với thông điệp khác, E1 fail | Ghim «LON-SUA: thoát 1» kèm «không đọc được danh sách tệp git» | fixed: E1 ghim «LON-SUA: thoát 1 — design-floor-bac: không đọc được danh sách tệp git (» |
| P1 | contract | Giới hạn chỉ khai «không remote», bỏ sót checkout kiểu CI (init + remote add + fetch, không origin/HEAD) | crm ở CI vẫn thoát 1 trong khi người ký tin đã đi được | Ca CI vào AC-4, khai ở Out of scope kèm đường gỡ | fixed: ca CU-CI (bằng 2.36.0, thoát 1) + Out of scope nêu `git remote set-head origin -a` hoặc `--base` |
| P2 | evals | LOP-QUET chỉ đo chuỗi maxBuffer có mặt, một đột biến | Bỏ sót lời gọi nhiều dòng, execSync, trần nhỏ hơn | Đếm độc lập, đột biến từng lời gọi, ghim giá trị trần | fixed: quét cả execSync, đòi đúng «maxBuffer: 64 * 1024 * 1024», đoạn lời gọi cắt bằng đếm ngoặc; ma trận đột biến một cho mỗi lời gọi |
