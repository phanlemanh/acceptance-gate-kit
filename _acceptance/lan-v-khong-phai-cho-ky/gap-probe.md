---
slug: lan-v-khong-phai-cho-ky
at: 2026-08-21T09:52:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Phản biện context sạch — lan-v-khong-phai-cho-ky

Critic: agent tươi, 5 input (design doc · contract · evals · decisions · claims từ 10 hồ sơ trước). One-pass; mọi finding đã định đoạt trong S1, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals (E8) + contract (AC-8, Coverage) | Ma trận chỉ ghim QUAN HỆ done ⇔ da-ship — vì hai bộ đọc dùng MỘT vị từ, quan hệ đúng theo cấu trúc bất kể vị từ đúng hay sai; ô REJECT/BLOCKED/vắng-evidence dưới V bị đẩy sang Later với lý do từ luật cũ trong khi rủi ro nằm ở vị từ mới. Cùng lớp [veto-co-dau-vet#F2] | Vị từ viết `verdict !== 'PENDING-JUDGMENT'` thay vì `=== 'PASS'` → hồ sơ V + REJECT hiện «Đã giao»; LV1–LV6 xanh, E8 xanh (hai bên khớp), E10 xanh | Bảng sự-thật viết trước: đúng 1 ô đã giao, còn lại không; assert giá trị từng bộ đọc rồi mới quan hệ; mutant gỡ điều kiện PASS | fixed: AC-8 + Coverage viết lại thành bảng sự-thật 100 ô (thêm trục chữ ký); E8 ghim giá trị từng bộ đọc + toạ độ; E11 thêm đột biến LAN-V-PASS |
| P1 | design + contract Notes + decisions vs evals | Mâu thuẫn số ca: bốn nơi nói 6 ca / 6 dòng run, E8 khai LV7, E12 ghim 7 dòng | Thi công theo design viết 6 ca → E8/E12 đỏ oan một vòng S4; hoặc tự thêm LV7 → spec lệch vật | Một con số ở cả bốn nơi | fixed: 7 ca / 7 dòng run ở design, contract Notes, E12; entry `fix` trong sổ thay entry nói 6 |
| P1 | evals (E11) | Chân mutant chỉ ghim `FAIL: LV1` không ghim thông điệp; đối chứng dương chạy trên cây thật (có .git, node_modules) chứ không trên bản sao cùng cách chép — «bản sao tiêm đỏ» không được đối chứng bởi «bản sao không tiêm xanh» | Bản sao thiếu thứ gì đó → ca ném lỗi và in FAIL vì lý do khác → răng thấy FAIL, báo MUTANT OK trong khi vị từ chưa chạy; hoặc răng đỏ vĩnh viễn | Đối chứng dương = cùng rsync + cùng lệnh trên bản A không tiêm; bản B ghim đúng câu; sed kiểm ≥1 dòng đổi | fixed: E11 viết lại — bản A xanh trước, bản B hai đột biến có marker, sed đếm dòng, marker vắng là đỏ riêng |
| P2 | contract (Cross-cutting) + evals (E8, E10) | Chữ ký là cross-cutting «không đổi» nhưng không nằm trong ma trận và không LV nào ghim; E10 không nhìn hồ sơ đã ký | Vị từ V đặt TRƯỚC nhánh chữ ký → hồ sơ V + đã ký hiện «cửa veto mở» thay vì đã ký; mọi LV xanh | Thêm trục chữ ký; E10 assert một slug đã ký giữ signed-off không chú thích | fixed: trục E chữ ký vào Coverage + AC-8 (100 ô); E10 thêm release-2-2-0 giữ signed-off, không chú thích |
| P2 | evals (E10) + design (răng) | Gốc cây suy từ cwd (`--root .`); không nơi nào nói răng suy ROOT từ vị trí script | S4 gọi cmd từ cwd khác gốc → chân ban-do đo cây khác cây đang kiểm; chân mutant có thể đo script thật thay vì bản sao | ROOT = dirname $0/../..; mọi lệnh truyền --root tường minh; răng tự kiểm $0 ∈ $ROOT | fixed: contract Notes + design + E10 ghi luật ROOT; không còn `--root .` |
