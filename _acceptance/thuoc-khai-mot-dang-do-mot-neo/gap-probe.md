---
slug: thuoc-khai-mot-dang-do-mot-neo
at: 2026-09-06T07:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Không ô nào chạy chính khoá đang ĐỎ. E1–E4 gọi khoá mới `tkm_lane`, trong khi vật hỏng khai ở Context là standing executor `itgk_lane_doc_khong_doi` và là E6 của hồ sơ đã ký. | Khoá mới viết đúng nên xanh; khoá cũ vẫn có thể hỏng ở tầng GIẢI CHUỖI chứ không ở hàm kiểm — đúng lớp lỗi đã xảy ra một lần với `cqt_o_khong_doi` [d-20260906T054932Z-6990]. Cổng đọc bốn ô xanh và ký; đợt re-pin kế tiếp vẫn vấp đúng chỗ cũ. | Ô đo chạy CHÍNH khoá `itgk_lane_doc_khong_doi` qua đường giải config, không gõ lại lệnh tay. | fixed: bỏ hẳn khoá `tkm_lane`; E1–E5 nay trỏ `config:executors.script.itgk_lane_doc_khong_doi` — đúng khoá đang đỏ, không sinh khoá song song |
| P0 | contract | AC-2 và AC-3 chỉ đỏ được khi `tip` là HEAD của clone, mà lời gọi THẬT truyền hai hằng. Commit tiêm nằm SAU mốc ngọn nên ngoài khoảng đã neo: với đối số thật, hàm kiểm cho câu trả lời HẰNG. | Người duyệt đọc AC-2/AC-3 là «thước vẫn bắt được lane hội đồng đổi» và duyệt; thực tế lệnh standing chỉ còn xanh-hoặc-mốc-mất, không bao giờ đỏ vì nội dung — đổi một chân đỏ vĩnh viễn lấy một chân xanh vĩnh viễn, đúng bệnh vòng này chữa. | Ghi rõ ô nào đo hàm có tham số, ô nào đo lời gọi thật; và cho lời gọi thật một chiều đỏ SỐNG. | fixed: tách hai vế. Vế lane nay SỐNG — so `acceptance-verify.js` tại HEAD với bản tại mốc đã ký, ai sửa workflow là đỏ ngay trên cây thật. Vế tập-file giữ khoảng cố định, và contract khai thẳng nó là chứng-một-lần + fail-closed |
| P1 | evals | E5 khẳng định bằng CHUỖI-CÓ-MẶT (`VI 3/4/1`) trong khi AC-5 hứa số in ra là số máy trích. Không ô nào buộc con số IN RA đổi theo vật. | Người cài viết phép so quan hệ đúng nhưng để nguyên câu tổng kết in chuỗi hằng `3/4/1`; E5 xanh, E6/E7 cũng xanh vì chúng chỉ đòi ĐỎ. AC-5 PASS trong khi câu PASS vẫn tự khai một đằng. | Ô đột biến assert dòng in ra hiện đúng số đã đột biến trước khi báo đỏ. | fixed: AC-6 nay đòi mỗi dòng đỏ NÊU SỐ THẬT đã trích (`9 != 4 - 1`), và E6 ghim con số đột biến — số là dữ liệu, không phải chữ |
| P1 | contract | AC-8 hứa bốn suite cộng `product-map --check` nhưng chỉ có E8 (một suite) và E9 (bảy nhóm). Ba suite còn lại và lệnh bản đồ không ô nào đo, dù thay đổi chạm `config.yaml` và thêm nguyên một thư mục hồ sơ. | Bằng chứng ghi AC-8 PASS = «không hồi quy» trong khi 3/4 suite chưa chạy. Cổng đếm của kho rất nhạy với việc thêm hồ sơ và khoá config; đỏ chỉ lộ ở pre-merge SAU khi đã ký. | Mỗi suite một ô, cộng ô riêng cho bản đồ. | fixed: thêm E10 chạy ba suite còn lại cộng `product-map --check` |
| P1 | evals | AC-1 hứa bất biến theo CÂY và theo NGÀY nhưng E1 chạy đúng một lượt trên một cây; vế «trước khi vá 0 pass 3 do» là số đo tay, không phải khẳng định máy. | Bản cài còn sót một đường phụ thuộc HEAD; trên nhánh đang làm E1 xanh và được ký, merge xong standing executor lại đỏ trên `main` như cũ — lần này có chữ ký xanh che. | Chạy nhóm hai lượt ở hai cây khác nhau rồi so đầu ra giống nhau từng byte. | fixed: thêm ca «hai lượt một kết quả» vào nhóm và AC-1 nay đòi nó; ca chạy lượt hai trong clone detached ở commit khác |
