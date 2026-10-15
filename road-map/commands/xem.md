---
description: Bản đồ lộ trình của kho hiện tại — xong · đang dở · kế, rà soát kèm căn cứ, và các lần máy tự áp. Chỉ đọc.
argument-hint: (không đối số)
---

Chỉ đọc, chạy được ở mọi phiên trong kho. Giải `$AG` bằng `resolve-plugin.mjs` của feature-loop
(`--plugin acceptance-gate --require scripts/lo-trinh.mjs`, như bước 1 của `/acceptance-gate:acceptance-card`), rồi
chạy đúng dòng trong khối dưới và in NGUYÊN VĂN kết quả. Kết quả là bản đồ của mỗi lộ trình: dòng đếm
`Xong · Đang dở · Kế`, việc đang dở, việc kế, khối «Rà soát» (mỗi dòng một đề xuất kèm căn cứ; hàng ghim mang
«(ghim — máy không tự áp)»), và — chỉ khi chiến dịch đang chạy bật tự áp — khối «Tự áp» (việc máy sẽ dời và từ ngày nào,
việc máy vừa dời kèm lệnh trả lại). Cuối mỗi lộ trình có mốc là khối «Giờ máy theo mốc»: mỗi mốc còn việc một dòng — bắt đầu dự kiến · giờ máy ·
% hạn mức tuần · hoàn tất dự kiến · mục tiêu; mốc dự kiến trễ hơn mục tiêu mang «(quá tải — …)», và «(chưa có giờ chờ đo)»
nghĩa là ngày dự kiến còn là cận sớm vì chưa vòng nào đo giờ chờ. Dòng có `!` là cảnh báo (máy không đọc được tuổi hàng, lịch sử git bị cụt, tệp lộ trình
chưa từng commit, sổ tự áp hỏng…) — in nguyên văn, đừng bỏ. Thoát 1 thì KHÔNG được nói «không có đề xuất»: hoặc kho chưa
khai lộ trình (nói đúng một dòng, kèm chỗ khai `lo_trinh.tep` trong `_acceptance/config.yaml`), hoặc một tệp lộ trình không
đọc được — in nguyên văn dòng lỗi «không đọc được tệp ý định — …» cùng phần bản đồ của các tệp còn lại. Lệnh không ghi tệp
nào và không đổi kế hoạch. Muốn miễn trừ một hàng khỏi tự áp: `/road-map:ghim <mã>`; trả lại một lần máy đã dời:
`/road-map:tra-lai <mã>` (hai lệnh chỉ người gõ).

<!-- <<<RM-XEM-LENH -->
```
node "$AG/scripts/lo-trinh.mjs" --root . --xem
```
<!-- RM-XEM-LENH>>> -->
