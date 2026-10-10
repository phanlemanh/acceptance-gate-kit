---
slug: dieu-phoi-mo-dot-mot-lenh
at: 2026-10-10T07:05:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap-probe — dieu-phoi-mo-dot-mot-lenh

Phản biện context sạch: một tác tử mới chỉ đọc design doc (và spec workflow mà nó trỏ về), contract, evals,
sổ quyết định và bài học từ claim-scan. Một lượt, không chạy lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-10 chỉ thu hồi khoá máy khi thư mục đợt vắng; đợt đã đóng vẫn giữ thư mục và `dong` không đòi `dang-dong`, nên không AC nào gỡ khoá máy của đợt đã đóng | Kho A giữ khoá s4 cấp máy rồi `dong`; bộ phát lịch A dừng, thư mục đợt còn; kho B không bao giờ được cấp s4 nữa — đúng đợt thử chung Mac mini 26–27/10 | Ca `dong` khi đang giữ khoá máy; đối chứng A còn mở thì B không cấp | fixed: AC-10 thêm «`dong` gỡ khoá máy của đợt» và thu hồi khi symlink kho kia không còn trỏ đợt; E10 thêm DP2-10 dong-khi-giu + biến thể gỡ symlink + đối chứng |
| P1 | evals | Fixture E9 không tách «thư mục có mặt» khỏi «đã có quyết định» | Máy mở ô discovery ở lượt thẻ khởi tạo, phiên chạy lại `mo-dot` trước khi người gõ build; bản dựng kiểm thư mục có mặt làm hàng rơi khỏi danh sách chờ và vào đợt khi chưa có chữ quyết | Thêm ô discovery chưa decision và ô decision khác build vào ma trận; mutant «thư mục có mặt là đã quyết» | fixed: AC-9 nêu rõ thư mục có mặt không phải quyết định; E9 ma trận 5 hàng (số assert = 5) + mutant DP2-09-do thu-muc |
| P1 | evals | E13 tự dựng su-kien.jsonl theo khuôn `dem` đọc, không round-trip từ bên viết thật | Bên viết dùng tên loại khác; E13 xanh mà `dem` trên đợt thật in 0 — số nền SỐNG/CHẾT (T14) sai im lặng | Round-trip: hook thật + nhịp thật sinh sự kiện, `dem` đọc; mutant đổi tên loại ở bên viết | fixed: AC-13 viết lại theo bên viết thật (sự kiện hang-gop, cho-nguoi, một sự kiện mỗi lần chuyển); E13 DP2-13 round-trip + DP2-13-do doi-ten; vế chạy trên fixture dot-crm-0910 không làm vì fixture không giữ su-kien.jsonl (sổ DP1 d-…-14) |
| P1 | contract | Trình tự sáu bước của lệnh người không nằm trong AC nào; E1c đo điều criterion không hứa và thiếu contract/design trong inputs; câu hỏi E1c mâu thuẫn với chỗ nối 2 (máy ghi hộ decided_by) | Hội đồng chỉ đọc spec: thân đúng bị chấm thiếu bước hạn mức (đã dời DP4), hoặc «chép chữ người vào decided_by» bị đọc là máy viết hộ; ngược lại thân bỏ chẩn đoán trước vẫn PASS | Trình tự vào AC; inputs thêm contract + design; câu hỏi tách chép-chữ-người khỏi tự-sinh | fixed: AC-1 thêm vế trình tự hai lệnh, liệt kê hai bước đã dời khỏi DP2, và «máy chép chữ người gõ vào decided_by, không tự sinh»; E1c inputs thêm contract.md và design doc, câu hỏi tách hai việc |
| P2 | contract | Cross-cutting khai mọi lệnh chạy lại được nhưng chỉ AC-2, AC-6 có vế; AC-4 xếp ô cùng pha vào ô bị từ chối | Giám sát chết giữa bước 5, chạy lại `mo-dot` → `pha dang-chay` trên đợt đã dang-chay thoát 1; `hang them` hai lần nhân đôi hàng mà E7 vẫn xanh | Ô cùng pha là no-op thoát 0; vế chạy lần hai cho năm lệnh của AC-7 | fixed: AC-4 ô cùng pha = no-op (16 = 5 + 4 + 7); AC-7 và E7 thêm DP2-07 chay-lai; Cross-cutting liệt đúng các AC mang vế chạy lại |
