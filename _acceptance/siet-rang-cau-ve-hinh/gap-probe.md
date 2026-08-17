---
slug: siet-rang-cau-ve-hinh
at: 2026-08-17T07:20:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Phản biện context sạch — siet-rang-cau-ve-hinh

Critic tươi, 4 artifact + input 5 (claim-scan). One-pass.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract+evals AC-3/E3 | Chiều đỏ của răng đi sai hướng: bịt dòng `P197-M:` chỉ làm tập K nhỏ đi, mọi phần tử còn lại vẫn có `DO dung` → răng không đỏ-ghim-tên | Thi công đúng lời AC → đột biến xanh hoặc đỏ vì sàn, không phải vì tên msg | Đột biến xoá dòng `DO dung (msg)` → đỏ ghim msg; xoá dòng `P197-M:` → đỏ ghim `so P197-M < san` | **fixed:** AC-3/E3 hai chiều đỏ, hai thông điệp |
| P1 | design+contract §2.1/AC-1 | Anchor = prefix văn bản → sửa chữ trong prefix làm n_anchor giảm chứ không lệch → xanh mù | Sửa chữ thứ 3 của bản S2 → mọi phép đo xanh, Cổng 2 sau ký thêm KL cùng lớp | Neo hai đầu (max của prefix/suffix) + ca fixture sửa trong prefix và trong suffix | **fixed:** AC-1 sáu ca (thêm c/d), design §2.1 neo hai đầu; điểm mù còn lại «sửa cả hai đầu cùng lúc» ghi Known limits |
| P1 | evals+design E3/§5 | Không đường lấy stdout thật của P197 cho P198 → dễ trượt về fixture viết tay đúng khuôn bên đọc | Định dạng P197-M đổi thì rang lệch mà P198 xanh | rang.sh nhận `RANG_STDOUT_FILE`; răng của hồ sơ này ghi stdout thật rồi sed một dòng; cấm literal P197-M viết tay | **fixed:** AC-3 `RANG_STDOUT_FILE` + chiều đỏ từ stdout thật; chuyển toàn bộ kiểm răng ra khỏi P198 |
| P1 | contract AC-7/AC-8/Out-of-scope | P198 (suite vĩnh viễn) grep `_acceptance/**` + worktree hardcode 8d1e135 — mâu thuẫn nếp p194 và luật không hardcode | Hồ sơ lưu kho hoặc shallow clone → P198 đỏ oan; ai bỏ chân đó → mất đối chứng | Dời chân rang.sh + diffBase sang răng của hồ sơ này; P198 chỉ fixture + kiểm cấu trúc P90/P197 | **fixed:** AC-7 P198 không đụng `_acceptance/**`; AC-8 răng của hồ sơ này gánh; Out-of-scope viết lại |
| P2 | contract AC-6/AC-2 | AC-6 mơ hồ chạy trên khối hay toàn văn; P90 chỉ sửa bản ĐẦU trong khi lỗ KL1 là bản S2 | Thi công gọi trên khối → đỏ oan; P90 chưa từng phá bản S2 | AC-6 ghi «toàn văn»; AC-2 thêm m3b sửa bản CUỐI | **fixed:** AC-6 toàn văn; AC-2 m3b |
