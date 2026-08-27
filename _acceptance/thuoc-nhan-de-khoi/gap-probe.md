---
slug: thuoc-nhan-de-khoi
at: 2026-08-27T03:15:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Phản biện context sạch — thuoc-nhan-de-khoi

Critic fresh, input 4 artifact + claims xuyên feature (claim-scan exit 0).
One-pass, sửa xong không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Vế «không xoá mask» của AC-3 không có eval đo — E3 chỉ grep chuỗi nhãn, thước tự khai mù với nhãn mất mask | Sửa 3 ca bằng cách xoá rect-mask: nhãn vô hình với thước → exit 0, chuỗi còn → E3 xanh, Gate 2 ký trên tiền đề sai | Thước mode `--list`; E3 thêm chân: 3 nhãn phải nằm trong danh sách thấy-được; chiều đỏ = bản sao xoá mask | fixed: AC-3 + E3 thêm lớp (b) `--list`, chiều đỏ xoá-mask riêng |
| P1 | evals | Không phép đo nào phân biệt «figures sạch» với «thước mù toàn phần» — mọi chiều đỏ là fixture tự dựng đúng khuôn thước đọc; neo writer-thật (E2) rời suite theo rang.sh [lan-may-song-qua-bo-phan-loai#F1] | Skill đổi khuôn xuất → heuristic bắt 0 nhãn → case vĩnh viễn xanh vì không còn gì để đo | Case assert tổng nhãn phát hiện trên figures thật ≥ SÀN khai trong case | fixed: AC-6 + E7 thêm dòng sàn-phát-hiện |
| P1 | evals | Hành vi WARN khi gặp scale/rotate không có eval ghim | Mutant xoá nhánh WARN → cây con transform bị bỏ qua IM LẶNG, mọi eval vẫn xanh — giới hạn khai thành mù câm | Chân mới: fixture scale → exit 0 + WARN ghim; chiều đỏ trên output giả thiếu WARN | fixed: AC-1 thêm vế And; E1 thêm chân 'scale -> warn co tieng' |
| P1 | evals | E9 dùng BASE-TNK làm comparand cho diff nhánh | PR khác merge main chạm figures/assets → diff so BASE-TNK gom thay đổi người khác → đỏ oan vì hạ tầng → phản xạ nới tay | So diff với `git merge-base HEAD origin/main`; BASE-TNK chỉ giữ vai đối chứng đỏ AC-2 | fixed: E9 đổi comparand |
| P2 | evals | E9 chỉ đối chiếu số file với ls, không đối chiếu số ca/danh sách với lần chạy thật | Evidence viết «0 ca» tay (fixture-viết-tay-đúng-khuôn-bên-đọc, chính evidence là fixture) [het-gio-khong-phai-truot#F1] → owner quyết trên dữ liệu bịa | Răng tự chạy thước lại lúc verify, so số ca + danh sách với báo cáo | fixed: E9 thêm vế tái-lập |
