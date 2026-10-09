---
slug: tac-tu-cham-chi-cham-khong
at: 2026-10-09T14:12:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Phản biện context sạch — tac-tu-cham-chi-cham-khong

Một tác tử tươi đọc đúng sáu đầu vào: design doc · contract · evals · decisions · claims của vòng trước · opportunity. Không đọc mã, không đọc hội thoại. Phản biện một lượt; sau khi sửa thì không chạy lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Hàng 4 và hàng 7 của AC-5 đòi hai kết quả khác nhau cho cùng một hình dạng (transcript đọc được, không ai bị quy). Hàng 4 đòi không có dòng, hàng 7 đòi có dòng kèm `tep_khong_ro`. Design không nêu luật «khi nào ghi dòng». Cùng lớp với [loc-paths-dong-mac-dinh#F1] | Người làm phải tự đặt một luật ngầm; hội đồng Cổng 2 chấm hai hàng theo hai cách hiểu | Viết rõ luật ghi dòng; hàng 4 ghim một dạng duy nhất | fixed: design §3.2 thêm «Luật ghi dòng» — mỗi dòng `cay-doi` có đúng một dòng `ghi-boi` ngay sau; AC-5 hàng 4 đổi thành dòng có `tac_tu` rỗng, tệp ở `tep_khong_ro`; mọi hàng ghim «đúng một dòng sau mỗi `cay-doi`» |
| P1 | contract | Đường đo chỉ đếm dòng có `tac_tu` không rỗng. Lệnh grep bỏ im dòng `khong_doc_duoc` và dòng chỉ có `tep_khong_ro`. N không trừ lượt `loai-tac-tu-vang`. «0 lần» không có chiều đỏ cho trường hợp «không đọc được» | Ở crm, cwd khác `--root` làm tự tìm trượt; mọi dòng thành `khong_doc_duoc`; lệnh đếm ra 0, N > 400; phiên nghiệm thu đọc thành SỐNG | Bốn số thêm và một luật đọc; N trừ lượt `loai-vang` | fixed: Đường đo nay có sáu số G·C·K·R·V·N và luật đọc «SỐNG chỉ khi G = 0, K = 0, mỗi `cay-doi` có đúng một `ghi-boi`, N ≥ 400; R > 0 phải đọc từng dòng»; tự tìm transcript không còn neo vào mã hoá của `--root` (quét mọi thư mục dự án, lọc theo thời gian + đường tuyệt đối của `--root` trong đề bài); AC-5 thêm hàng 10 (cwd khác `--root`) |
| P1 | contract | AC-1 chỉ đo frontmatter (lời khai), không đo tác dụng. Giả định 1 chỉ thử dạng danh sách cho phép; dạng `disallowedTools` cho 6/9 vai chưa có phép thử. Hai ứng viên đo tác dụng ở opportunity bị bỏ mà sổ không ghi | Harness bỏ qua `disallowedTools` của tác tử plugin; E1 xanh, Cổng 2 ký; 6 vai (gồm machine, finder của ca 07/10) không được bảo vệ | Ghi bỏ có ngưỡng, hoặc phép kiểm có tên ở phiên đầu tiên sau khi cài | fixed: thử dạng danh sách cấm bằng phiên chạy nền → không đăng nhập được (09/10), nên đổi khuôn: năm vai chạy lệnh sang `cham-lenh` dạng cho phép (đã chứng tác dụng), chỉ vai ui giữ dạng cấm (`cham-ui`); Notes ghim phép kiểm có tên chạy ở phiên đầu tiên sau khi cài, trước khi đếm cửa sổ (sổ `d-20261009T141853Z-5`) |
| P1 | contract | Hàng `sed -i` là dòng do code sinh, cùng trí tưởng tượng với luật quy trách nhiệm; không thử `cd` rồi tên trần, hay `git -C dir commit`. Cùng lớp với [mot-so-ba-ve#F1] | Tác tử chạy `cd feature-loop/scripts && sed -i … thuoc-vat.mjs` hoặc `git -C . commit` → tệp rơi vào `tep_khong_ro`, ngưỡng mở lối B/C không bao giờ nổ | Trích nguyên văn ca 21/09; thêm hai hàng có tên | fixed một phần: luật quy trách nhiệm phủ `cd` + tên trần và `git … commit` trong cùng lệnh con; AC-5 thêm hàng 8, 9 kèm đột biến «bỏ nhánh cd». deferred: bản trích thật ca 21/09 nằm ở máy khác, không có ở đây — khai giới hạn ở Notes; dạng lệnh chưa phủ đếm vào R kèm ngưỡng nới luật |
| P2 | contract | Vế tự lành của AC-6 chỉ có assertion âm tính đứng một mình («s4-args không thoát 2») | s4-args sập với mã 1 hoặc 127, hoặc tăng round; E6 vẫn PASS | Ghim mã 0 + cùng round; đột biến tăng round | fixed: AC-6 ghim `s4-args` thoát 0 với round BẰNG round lượt vô hiệu; thêm đột biến «AT6 cung round» |
