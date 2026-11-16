---
slug: phan-du-bo-cuc-moi-vong-ba
at: 2026-11-16T08:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ d-4 ghi nguồn mot-loi cho lối «cây phẳng lấy từ lịch sử», trong khi chính design nói bộ đổi ngược còn sống (chỉ đắt hơn); giới hạn chưa có ngưỡng đếm. Cùng lớp [phan-du-bo-cuc-moi#F1]. | Cổng Phạm vi đọc như không còn lối nào khác; sau cắt sang cột «cũ» chạy trên mã đóng băng mà không thước nào báo. | Thay d-4 bằng dòng có giá; khai ngưỡng mở lại đếm được ở Notes hợp đồng. | fixed: d-20261116T080534Z-11 thay d-4, thành câu hỏi Hỏi-2 (khuyến nghị + lối khác + giá); design §3.2, §5 và Notes hợp đồng khai ngưỡng «≥ 1 commit kho mới chạm plugins/acceptance-gate/{lib,scripts} sau commit dọn nhà». |
| P0 | design | Sổ d-6 ghi muc-tieu với câu trích chỉ kể sự kiện nghi thức ký, không quyết lối «loại cả tệp»; luật mù với sửa khác trên routing-baseline.txt. Cùng lớp [mc11-ten-kho#F1] [luot-kiem-nhe#F1]. | Vòng sửa routing-baseline.txt ngoài dòng ký mà --tinh vẫn PASS — mù đúng tệp vòng hai đã đỏ. | Thay d-6; E10 thêm chiều đỏ «sửa dòng không thuộc hồ sơ → FAIL», đối chứng dương «thêm đúng dòng → PASS». | fixed: d-20261116T080534Z-12 thay d-6 (mot-loi, nêu hai lối chết); AC-10, E10, design §3.4 chỉ bỏ qua tệp khi mọi dòng đổi là dòng thêm mở đầu bằng slug vòng; ba ca hai chiều vào bộ tự kiểm của thước. |
| P1 | evals | E3 không ghim sha(cha commit dọn nhà) = HEAD; design không nói kho mới là commit con của HEAD có lịch sử thật. | haiCay chọn nhầm một lần dọn nhà cũ mà E3 vẫn xanh; hoặc kho mới không có lịch sử nên E4 chết ở HẠ TẦNG. | AC-3/E3 ghim sha cha = HEAD; mutant dọn nhà hai lần. | fixed: AC-3, E3 thêm ô «dọn nhà hai lần» (cha của lần mới nhất) và ghim sha cha = HEAD bản sao; design §3.4 nêu kho mới của --moi là commit con của HEAD (khoMoi vòng hai), như cây kịch bản B2. |
| P1 | evals | Tập --sau-gop rút từ grep ở HEAD + bảng do tác tử viết: tệp đã thôi gọi merge-base rơi khỏi tập; RA-LOP chỉ đo «đã xếp», không đo «xếp đúng»; đường đo SỐNG không quy AC-2. | Tác tử xếp nhầm một tệp A vào B → E2 xanh, gộp xong nhánh chính lại đỏ; bang-ten thôi gọi merge-base thì chân «sau gộp» của AC-1 không ai chạy. | Tập = grep ở GOC_VONG ∪ HEAD, chạy MỌI tệp sau gộp; so túi hai lần chạy; SỐNG thêm AC-2. | fixed: AC-2, E2, design §3.1 — tập là hợp hai grep, mọi tệp chạy sau gộp đòi thoát 0 (xếp sai lộ ra thành đỏ); SAU-GOP-TUI so túi bằng nhau cho tệp vòng chạm; Đường đo SỐNG thêm AC-2. |
| P1 | contract | AC-7 ghim RG-2 vào 644e9b49 trước khi rà lớp xếp nhóm; RG-2 mang triệu chứng nhóm tương đối; «bản gốc ghim» mang hai giá trị. | Ghim RG-2 thì PR sau đổi hành vi hợp lệ bị đỏ (giá mà d-3 cảnh báo); hoặc người làm hiểu nhầm mốc. | Tách d-2; đặt tên hai mốc; E7 ghim sha. | fixed: d-20261116T080534Z-10 thay d-2 — chỉ ma trận bang-ten ghim (trích chú thích dòng 41 của tệp); RG-2 giữ merge-base sống (nhóm B), AC-7 và Out of scope ghi rõ; hai mốc đặt tên GOC_VONG 795baf96 và MOC_MA_TRAN 644e9b49. |
