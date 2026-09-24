---
slug: nen-cong-cu-gan-mo-thay-the
at: 2026-09-24T09:45:00Z
verdict: findings
p0: 0
p1: 1
p2: 3
claims_input: failed
---

## Findings

Ghi chú: input thứ 5 (claims) KHÔNG tới critic — lời gọi của phiên chính truyền sai đường dẫn tệp claims (lỗi soạn lời gọi, không phải claim-scan). Critic chạy trên 4 input.

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Không ca nào có phép gán ĐÃ ĐÓNG mà giá trị chứa phép thay thế (`B=$(pwd) cmd`); GM2 dùng `B=1` nên không tách được phép CÂN ngoặc khỏi phép DÒ có mặt `$(` | Vị từ viết thành `t.includes('$(')`: GM1/GM2/GM3 vẫn xanh, nhưng `B=$(pwd) khong-co-lenh` bị bỏ tra, cong_cu xanh — im oan đúng chiều AC-2 giữ | Ca GM4 `B=$(pwd) khong-co-lenh` phải đỏ ghim tên, 0 dòng bo qua; mutant `/\$\(/` làm GM4 mất đèn | fixed: thêm AC-6 + E7 (ca GM4) và GM6 (đột biến «có mặt `$(`» → GM4 bị bỏ tra, mất dòng ghim); lệnh `ngm_gan_mo` đếm đúng 6 dòng PASS GM |
| P2 | contract | Trục A khai ba dạng mở (`(`, `{`, backtick) nhưng chỉ nhánh `(` có ca; GM3 gỡ cả vị từ một lượt | Nhánh backtick đếm chẵn thay vì lẻ: `` B=`git rev-parse x` && … `` vẫn đỏ oan `THIEU rev-parse`, mọi eval xanh | Mỗi dạng mở có một ca IM, hoặc mutant riêng từng nhánh | fixed: thêm AC-7 + E8 (ca GM5 hai lượt: backtick lẻ và `{` dư, mỗi lượt xanh + đúng 1 dòng bo qua gọi đúng token đầu); GM6 chứng cả hai lượt đỏ dưới vị từ hời hợt |
| P2 | evals | «Nguyên văn» của AC-1 là chuỗi chép tay, không có gì ràng với giá trị resolveConfigKey đọc từ config crm | Mất một dấu nháy khi dán; GM1 xanh trên chuỗi đã lệch còn crm vẫn đỏ sau khi cài mốc | Ghim sha256 của giá trị crm; GM1 so băm, lệch thì đỏ «chuoi khong con nguyen van» | fixed: đo sha256 trên CẢ HAI worktree crm (goi-thu-hong-man-noi-that, noi-zalo-cho-nguoi-moi) = `00d9d863…975917`, khớp chuỗi test; GM1 so băm; AC-1 + E1 nêu vế này |
| P2 | contract | Then của AC-1 lấy «cong_cu XANH» làm đạt trong khi khoá bị BỎ TRA — bỏ tra chỉ ra stderr, không vào duong-nen.md; vòng này chuyển chính hai khoá thật của crm sang nhánh ấy | Ở crm `bun` vắng trên máy: người ký Cổng Phạm vi vẫn đọc `nen: xanh` cho zqw_giu_nqz và nzm_giu_da_ky, lỗi chỉ lộ ở S4 | Ghi dòng bỏ tra vào duong-nen.md; hoặc đưa giới hạn lên khối CHƯA duyệt kèm tên hai khoá | deferred: giữ AC-1; ghi Notes «giới hạn CHẠM CỔNG THẬT» nêu đích danh hai khoá crm. Sửa đúng tầng là đổi khuôn tệp + bên đọc thẻ (nếp bo-qua của chân luoi/engine) — ngoài phạm vi, kế thừa Ngoài-1 của nen-cong-cu-lenh-shell |
