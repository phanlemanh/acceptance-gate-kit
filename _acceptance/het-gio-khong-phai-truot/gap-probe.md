---
slug: het-gio-khong-phai-truot
at: 2026-08-18T00:00:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design + contract | Mâu thuẫn lane baseline: AC-4 chỉ thêm killedByTool vào MACHINE/UI schema, design tuyên «baseline giữ schema cũ», nhưng AC-6/normKill giả định baseline result mang killedByTool — fixture W27 viết tay đúng khuôn bên đọc mà writer thật không sinh nổi | Baseline bị giết, agent khai cannotRun=false + exit 1 → không field nào để normKill bám → red giả; W27 vẫn xanh trên fixture tự chế | Chọn một đường, sửa 3 artifact khớp | fixed: chọn đường (a) — thêm killedByTool optional vào item của BASELINE_SCHEMA.results; AC-4/AC-6/design sửa khớp; W27 fixture đúng khuôn schema thật |
| P1 | evals | Vế «không sửa case cũ» của AC-7 không có phép đo — E7 chỉ treo exit 0 | Thi công sửa expected case cũ cho khớp hành vi mới → suite vẫn exit 0, AC-7 duyệt oan | Răng đối chiếu case cũ với diffBase, đếm nguồn trong cùng lần chạy | fixed: thêm E8 → rang chân tồn-kho: rút danh sách tên case W* từ bản diffBase của test file (git show), assert từng tên còn NGUYÊN VĂN trong file hiện tại và xuất hiện «PASS: <tên>» trong stdout — không hardcode số |
| P1 | evals | Chiều đỏ W25 chỉ có mutant lane machine — ma trận tuyên 3 lane nhưng số mutant 1/3 | Assert lane ui grep nhầm biến prompt machine, thi công sót nội suy ở ui → 3 dòng PASS vẫn in, REJECT giả tái diễn ở lane ui | Số mutant = số lane, ca cô lập lớp | fixed: W25 chạy 3 mutant srcOverride, mỗi cái xoá nội suy khỏi ĐÚNG một lane (theo thứ tự xuất hiện), assert lane bị xoá đỏ + 2 lane kia còn rule; E2/E3 expected ghim dòng mutant theo lane |
| P2 | contract + evals | AC-5 hứa hai nhánh reason nhưng W26/E5 đo một hình dạng | normKill ghi đè reason agent hoặc quên điền khi trống → card BLOCKED reason rỗng, E5 vẫn xanh | Mỗi nhánh một sub-case một dòng PASS | fixed: W26 thêm 2 sub-case (reason có → giữ nguyên văn; reason trống → khuôn ghim); E5 expected ghim cả hai dòng |
| P2 | evals | E1–E6 trỏ key rang_hgkpt chưa đăng ký trong config.yaml, không ai cam kết tạo | S4 vòng 1 không resolve được ref → DỪNG, đốt round chỉ để phát hiện thiếu dây | Đăng ký key là task thi công tường minh | fixed: plan S2 có task riêng «đăng ký executors.script.rang_hgkpt vào _acceptance/config.yaml» (nếp răng hồ sơ, không vào suite vĩnh viễn); design doc ghi rõ |
