---
slug: moc-la-chien-dich
at: 2026-10-14T09:05:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Phản biện context sạch — moc-la-chien-dich

Một tác tử tươi (feature-loop:cham-doc) đọc design doc + contract + evals + sổ quyết định + ô cơ hội + bài học
từ feature trước (advisory). Không đọc code.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Không AC nào đo tên kho trên một worktree thật; AC-10 so tên với chính hàm tenKho | Bản dựng lấy tên theo gốc cây làm việc → phiên mở trong worktree ra «(vibrant-chatterjee-5d468b)» mà E6, E9, E10 vẫn xanh | Ca worktree trong MC-6 + chiều đỏ bản sao dùng --show-toplevel; E10 đổi sang chuỗi viết sẵn | fixed: AC-6 thêm vế worktree + thư mục con + chiều đỏ; AC-10 và E10 ghim «(acceptance-gate-kit)» viết sẵn |
| P1 | evals | MC-2-byte so bằng byte mà không có đối chứng dương | Bộ máy gốc chết khi chạy, hai đầu ra rỗng vẫn bằng nhau → «như cũ» xanh mà không phép so nào chạy | Ghim mã thoát 0 + tệp có mặt, khác rỗng, chứa mã hàng ở mỗi bên; chiều đỏ chèn một byte | fixed: AC-2 và E2 thêm đối chứng dương ghim «đối chứng gốc không chạy» + ca MC-2-byte-do |
| P1 | contract | Ngưỡng «mọi vòng mở sau ngày gộp có nhóm theo mốc» không có đường đo đầu ra; AC-8 chỉ đo chỉ dẫn; cạnh mù không khai | Phiên chỉ in tên mà không xếp nhóm, mọi eval vẫn xanh, Cổng Phạm vi tin nhóm đã bảo đảm | Known limit nhãn «mù» + số đọc reality ở hồ sơ mốc kế; sửa Đường đo dòng 2 | fixed: Đường đo dòng 2 trỏ số phiên trong nhóm / tổng phiên; Notes khai cạnh mù |
| P2 | evals | Vế «không xếp khi nhom rỗng» chỉ đo chuỗi có mặt | SKILL viết «nhom null thì xếp vào nhóm Chưa gắn mốc», MC-8 vẫn xanh | Luật ca rỗng máy đọc trong khối S0-TEN-CHIEN-DICH + chiều đỏ | fixed: AC-8 và E8 thêm dòng luật «nhom-rong: khong-xep» + ca MC-8-do3 |
| P2 | contract | Ma trận thiếu nhánh: hàng nhận qua lo_trinh_ma, trạng thái không suy được, dấu tách «; » «: », thư mục không phải kho git | Bản dựng xét hồ sơ chỉ theo thư mục slug → hàng như MC1 không bao giờ bị cờ, AC-1 vẫn xanh | Thêm hàng vào ma trận MC-1 và MC-5, chiều đỏ bỏ nhánh lo_trinh_ma | fixed: AC-1 thêm hai hàng (5 cờ / 15 không) + MC-1-do2; AC-5 thêm «; », «: », thư mục không phải kho git |

> Sau lượt phản biện, điều phối chuyển ADR 0025 (chủ kho duyệt 14/10): thêm AC-3 (cờ hồ sơ đang mở không thuộc việc
> nào) và AC-4 (cờ kho chưa khai lộ trình), gộp AC-3 + AC-4 cũ thành AC-5, đánh số lại AC-5…AC-10 cũ thành AC-6…AC-11.
> Hai tiêu chí mới CHƯA qua phản biện context sạch (luật một lượt) — người duyệt soi chúng trực tiếp.
