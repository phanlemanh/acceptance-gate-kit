---
slug: release-2-1-0
at: 2026-08-16T13:20:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

# Phản biện context sạch — release-2-1-0

Critic: subagent tươi, 4 input (contract · evals · decisions · claims). One-pass.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | AC-4 + Coverage; E4/E7 | Vế «CI clean với human_signoff rỗng» không có eval, và không định nghĩa đường đi khi E7 UNCERTAIN — cùng lớp [cong-chan-nham-cho#F1] | E7 UNCERTAIN → làn V đóng → AC-4 FAIL vòng tròn, hoặc retry-until-green | UNCERTAIN → chạy lại đúng 1 lần; còn UNCERTAIN → đường chữ ký, M1=1 (dữ liệu); vế biên thật rời Then sang Notes/M1 | fixed: AC-4 rút vế; AC-7 + E7 khai đường UNCERTAIN; Notes ghi cách đo M1 |
| P1 | AC-6 + Out of scope; E6 | tree-hash==NOTICE là tự-nhất-quán (sửa tay + chạy lại hash vẫn xanh); Out of scope tuyên «P196 canh» sai về răng; chân version-vs-hash hoãn không mutant | bản vá tay lọt gói với NOTICE «đúng» | P196 canh DRIFT; known-limit khai rõ (kho private); mutant version-vs-hash NGAY qua chính hàm so | fixed: AC-6 viết lại (drift + known-limit); P196 thêm so_ver_hash + MUTANT-VERSION + chân âm hooks/.mcp/thư mục lạ |
| P1 | AC-5; E5 | Contract và eval khai hai allowlist khác nhau; run-tests.sh và config.yaml nằm trọn trong allowlist → sửa P32/t3_paths lọt | đổi engine cổng qua tests/config mà E5 xanh | một allowlist (contract trỏ eval); chân âm: run-tests chỉ THÊM; config chỉ thêm khoá executor | fixed: AC-5/E5 một danh sách + hai chân âm với mutant |
| P1 | AC-7; E7 inputs; đề ca 1 | Then thiếu vế «không lấy gì trong skill làm nguồn» trong khi đề ca mớm nội dung skill; inputs không tách agent/giám khảo | UNCERTAIN vì ô không neo, hoặc PASS oan vì mớm | thêm vế có neo «Nothing else is consulted»; đề ca chỉ mô tả repo; inputs tách | fixed: AC-7 + đề ca + đáp án + chú thích inputs |
| P2 | AC-8; Out of scope | đường đọc-cũ symlink + plugin → trigger đôi, AC-8 chưa đo dòng «gỡ symlink» | hai skill trùng tên, bản symlink thắng lặng lẽ | E8 needle «gỡ symlink» | fixed: AC-8 + chân docs kiểm «gỡ symlink» (đã có, nay khai) |
