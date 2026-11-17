---
slug: phan-du-bo-cuc-moi-vong-bon
at: 2026-11-17T01:40:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ d-20261117T011306Z-2 ghi nguồn muc-tieu cho lối «sửa hai tệp kiểm K4-TB ở kho này», câu trích chỉ tả cơ chế boPhan + pathspec, không quyết «sửa ở đây hay ở B2»; lối «B2 đặt origin/main = nguồn» còn sống (design §2). Cùng lớp [phan-du-bo-cuc-moi-vong-ba#F2] [mc11-ten-kho#F1]. | Chủ kho đọc K4-TB như mục tiêu đã quyết, duyệt AC-1 mà chưa từng được chọn lối «không sửa tệp kiểm». | Một dòng sổ supersedes d-2 dạng chi-nguoi + Hỏi-4 ở design §5. | fixed: dòng sổ Hỏi-4 (thứ 9 của sổ) thay d-2 — khuyến nghị, lối khác và giá; design §3.1 và §5 thêm Hỏi-4 |
| P1 | evals | Bốn ca DV5q chạy measure với cờ «qua lần dọn nhà» được tiêm; phép TÍNH cờ (hai lần gọi boCuc) không có ca nào đo chiều «không áp»; ma trận bản gốc × cây ba ô chưa viết trước. | Mã viết cờ chỉ xét «bản gốc phẳng»: E2, E3, E7 vẫn xanh; ở cây phẳng sửa dòng road-map@ thì DV5 thật im — chiều đỏ có sẵn thôi đỏ. | Ca DV5q-co gọi đúng hàm tính cờ trên ba cặp gốc/cây do mã sinh; mutant ở cây phẳng dùng cờ THẬT. | fixed: AC-2 + E2 thêm DV5q-co (một hàm quaDonNha, ma trận ba ô, hai cây do haiCay sinh); DV5q-im/-do/-ngoai dùng cờ hàm TÍNH từ cặp cây, không phải hằng |
| P1 | evals | AC-3 hứa quan hệ «thẻ dựng bằng MÃ của cây đang kiểm, --root là cây phẳng lịch sử»; E4 chỉ đo khoá có mặt + bản GOC_VONG đỏ; không phép phá nào phân biệt mã đang kiểm với mã trong bản bung. | Ca gọi gate-card.js nằm trong bản bung cây phẳng: mọi dòng E4 vẫn PASS, ở kho mới ca đo một bản mã đóng băng. | Tiêm vào mã thẻ của cây đang kiểm → ca phải đỏ; ghim dòng «gốc đọc sổ». | fixed: AC-3 + E4 thêm «DO so-that mã thẻ» (phá gate-card.js của kho mới → KK-6 so-that đỏ) và dòng ghim «gốc đọc sổ: cây phẳng lịch sử <sha>»; chiều im (phá bản bung) không dựng — bản bung sinh lúc chạy từ lịch sử, một chiều đỏ đã đủ phân biệt |
| P1 | evals | Luật đề nghị tui-cu-suc-chua chở 43 khoá mà lời khẳng định chính là âm tính («thiếu 0»); không đối chứng dương trên túi THẬT; «ba hình» không khai nguồn. | Luật quá khoan dung (bỏ khoá đổi tên hết chỗ khỏi phép so) vẫn qua E6; B2 nhận thì thước B2 mù, B2 từ chối thì 43 khoá vẫn thiếu. | Xoá một ca mỗi dạng tên khỏi túi kho mới → luật đề nghị phải báo thiếu đúng tên; vi phân hai luật trên túi mọi tệp vòng khai lệch đúng 43. | fixed: AC-4 + E6 thêm «MP đối chứng» (hai khẳng định trên túi thật) và «MP vi phân» (túi thật của mọi tệp vòng khai, ba hình phải có mặt — vắng thì FAIL); design §3.4 ghi số đo trên TRỌN hai túi của lượt đo B2: 57 → 14 thiếu, 43 → 0 thừa |
| P1 | contract | AC-6 hứa «HEAD bất kỳ» mà tệp vòng sửa tính bằng git diff 3341b8dc..HEAD; gộp nhánh chính vào nhánh PR hay ghim lại sau gộp làm tập ấy phình. Vòng ba đã phải vá [d-20261116T154730Z-21]. | Một vòng khác gộp vào nhánh chính sửa tệp tests/ ngoài khối: E8 đỏ trên tệp vòng này không chạm; hồ sơ đã ký hoá đỏ ở đoạn ký→gộp. | Tập tệp tính từ merge-base với nhánh chính tới HEAD; hai ca tự kiểm im/đỏ trên bản sao do mã sinh. | fixed: AC-6 + E8 — danh sách đóng TEP_VONG; trên nhánh riêng so tệp nhánh đổi từ merge-base; HEAD đã trên nhánh chính thì TIN, không chấm; hai ca tự kiểm im/đỏ. Vế --cu (E7) so HEAD sống: deferred — khai giới hạn + ngưỡng ở Notes hợp đồng |
