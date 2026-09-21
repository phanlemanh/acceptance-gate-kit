---
slug: ho-so-khep-thoi-hoi
at: 2026-09-22T00:40:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | E4 chỉ đo mjs, bash, gate-card; năm bên gọi của xanhSach (start-scan, product-map, gate-card, trang-thai-ho-so, CLI) không ca nào bắt bên QUÊN truyền findings — vế «tệp vắng → im» làm bên quên trông như hồ sơ đời trước triage | product-map hoặc trang-thai-ho-so vẫn gọi xanhSach hai đối số → bản đồ in máy-thông cho ca khai-lang; E4, E5 xanh | ma trận bên gọi RÚT bằng grep, mỗi bên gọi chạy fixture khai-lang, mutant bỏ đối số từng bên → đỏ gọi tên | fixed: thêm AC-8 + E8 (danh sách bên gọi rút bằng grep xanhSach/khongCanNguoi, số assert = số bên gọi, rỗng thì đỏ, mutant từng bên) |
| P1 | contract | Đường đo bỏ sót vế «crm CI xanh lượt đầu, 0 commit vá tay»; số «12 tệp» và «diff 2 tệp» của ô lệch với 15; lối chặt làm CI crm đỏ | đọc đúng chữ ngưỡng thì vòng CHẾT ở Cổng Giá trị; owner không thấy trên hợp đồng | thêm dòng Đường đo cho CI crm lượt đầu + số tệp do CE2 sinh | fixed: bỏ lối chặt — vị từ đọc dòng sổ gate2 (định hướng phiên điều phối), `quyen-luot-mang-theo` có đủ dòng nên CI crm giữ xanh; Đường đo thêm hai dòng (CI crm lượt đầu · số tệp = độ dài bao đóng CE2) |
| P1 | evals | HK-AC6-baseline chỉ một chiều (dòng đổi ⊆ khép), thiếu chiều ngược (mọi khép có hoi= rỗng) | V4 không nhận một hồ sơ nghỉ → dòng giữ nguyên hoi=veto, không đổi nên không bị soi; ngưỡng thật > 0 mà ca xanh | quan hệ hai chiều với tập --da-khep, tập ≥ 16 | fixed: AC-6 và E6 đổi thành quan hệ hai chiều, in «khép: N · hoi rỗng: N», tập < 16 thì đỏ |
| P1 | design | Đổi tên lib/out-of-contract.js → .cjs không có AC/trục Coverage | một bên nạp chưa cập nhật (acceptance-verify.js, bản vendored) chết MODULE_NOT_FOUND ở lượt S4 kế hoặc CI kho tiêu thụ | grep 0 tham chiếu .js + mutant khôi phục require .js | fixed: AC-3 thêm vế grep 0 tham chiếu `.js` trên scripts lib skills feature-loop commands tests, E3 ca CE6-ooc có mutant |
| P2 | evals | Không eval nào chạy pre-merge-check.sh trên cây `_acceptance/` thật; ngưỡng «NOTE veto kit 1 → 0» không đo trước Cổng Bằng chứng | dòng quan sát thật của release-2-0-0 khác fixture → fixture xanh, NOTE kit vẫn đếm | E5 chạy pre-merge trên bản sao cây thật, giao với --da-khep rỗng, đối chứng bản base | fixed: AC-5 + E5 thêm HK-AC5-note (HEAD ∩ --da-khep = ∅; bản base có release-2-0-0) |
