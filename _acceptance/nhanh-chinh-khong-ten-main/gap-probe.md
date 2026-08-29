---
slug: nhanh-chinh-khong-ten-main
at: 2026-08-29T15:05:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

# Gap-probe — phản biện ngữ cảnh sạch (S1, one-pass)

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | §Đường đo trích ba ngưỡng không có trong ô, và khai «Cổng Đáng đã ký» trong khi ô còn `stage: discovery` | Người ký tin có chữ ký đứng sau, thực ra ngưỡng do máy tự soạn — mọi kết quả tự biện minh | Ngưỡng phải có mặt nguyên văn trong ô; ô phải `decided` + có người ký | fixed: nguyên nhân là NHÁNH CẮT TỪ MAIN CŨ (ô đã ký nằm ở PR #124 vừa merge). Đã gộp main; ô trên nhánh nay `stage: decided`, `decision: build`, ký Manh Phan 29/08, ba ngưỡng khớp nguyên văn |
| P0 | contract + evals | Trục Coverage khai «remote trả lời» nhưng không AC/eval nào chạm; đó lại là đường phổ biến nhất ở repo tiêu thụ | Bước bóc kết quả remote trôi → mọi eval vẫn xanh (đều không remote), repo có remote khai nhánh ngoài bốn tên chết như cũ | AC + eval với bare repo local làm remote thật, `origin/HEAD` ngoài bốn tên; ghi nguồn giải tên để phân biệt hai đường | fixed: thêm AC-6 + E6 + chân `remote-tra-loi`; mã ghi `mainBranchSource` (remote/fallback); chiều đỏ phá bước bóc remote |
| P0 | evals (E5) | AC-5 hứa QUAN HỆ thời gian nhưng E5 đo hình dạng mã (grep tham số) + fixture hỏng-nhanh; chiều đỏ là tautology | `timeout: 0` (không giới hạn) vẫn qua grep; consumer có remote bị nuốt gói treo tới khi công cụ giết → REJECT giả | Fixture remote TREO thật, assert đồng hồ tường < trần + biên, biên tính theo trần rút từ nguồn | fixed: chân `remote-co-tran` dùng `git://192.0.2.1/...` (IP không định tuyến); đo 10s < 30s và exit 0 |
| P1 | contract + evals | Thước CE tuyên «bốn nhánh phân biệt được» nhưng chỉ một tên được chạy thật — đúng bệnh đang chữa | Danh sách rút còn hai tên, hoặc `break` sai chỗ → `master` xanh, `develop`/`trunk` vẫn chết | Tham số hoá trên danh sách RÚT từ marker, assert độ dài, mutant cắt danh sách | fixed: E1 chạy cả bốn tên từ marker `MAIN-BRANCH-CANDIDATES`, assert độ dài = 4, mutant cắt còn một tên |
| P1 | evals (E4) | E4 assert vắng-mặt trên vùng mã không có marker → có thể xanh rỗng khi vùng đổi tên/đổi dạng | S3 tách vòng dò ra hàm khác → bộ dò khớp 0 vùng, «mọi phần tử tập rỗng» đúng → xanh dù lỗi còn | Neo vùng bằng marker; không tìm thấy marker là ĐỎ; đếm lời gọi và in số | fixed: marker `PROBE-REGION` trong nguồn; chân kiểm ba vế + hai mutant (gỡ marker · khôi phục lời gọi cũ) |
