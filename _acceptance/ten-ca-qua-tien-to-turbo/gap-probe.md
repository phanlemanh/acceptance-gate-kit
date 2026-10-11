---
slug: ten-ca-qua-tien-to-turbo
at: 2026-10-11T09:20:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — ten-ca-qua-tien-to-turbo

Phản biện ngữ cảnh sạch một lượt (tác tử tươi, chỉ đọc design + contract + evals + sổ quyết định +
bài học claim-scan làm input thứ 5). Không re-probe sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Chiều đỏ chạy trên bản sao trong thư mục tạm mà không có đối chứng dương cho chính bản sao — đổi hai biến cùng lúc (vị trí và phép tiêm); phạm vi chép của E4 không suy từ đồ thị nạp của repin-lane.mjs | Bản sao sập lúc nạp hoặc nhật ký lần đỏ rỗng; rutTenCa nhận chuỗi rỗng và trả đúng câu dự phòng trùng thông điệp chiều đỏ — chiều đỏ «xác nhận» mà phép tiêm chưa có tác dụng | Chạy bản sao NGUYÊN VẸN dựng cùng thủ tục trước mutant, phải xanh; ở E4 ghim thêm nhật ký lần đỏ chứa dòng (fail) | fixed: mỗi ca chạy cùng hàm kiểm trên bản sao nguyên vẹn trọn thư mục feature-loop/scripts trước bản phá (đồ thị nạp của repin-lane nằm trọn trong thư mục, engine qua --ag-root gốc kho); E4 kiểm nhật ký lần đỏ mà dòng pin trỏ tới chứa (fail) trước khi so tên; expected của E1–E4 ghi rõ |
| P1 | design | Không ghim quan hệ giữa bản ghi thước và Gốc: lệnh suite thật của crm và đường spawn của làn không được trích; nhật ký 07/10 đã mất nên «tiền tố turbo là nguyên nhân ở crm» là suy luận | crm chạy turbo với cờ hay biến màu khác; dòng thật mang ANSI hay tiền tố khác; E1–E4 xanh trên bản ghi kho tạm mà lần chạy lại kế ở crm vẫn ghi câu dự phòng | NGUON.md trích lệnh suite crm ở sha của dòng repin 07/10 cạnh lệnh ghi, ghi từng chỗ khác; bản ghi sinh qua cùng đường spawn của làn; thêm dòng quan sát reality có ngưỡng | fixed: bản ghi sinh lại bằng ghi-ban-ghi.mjs qua chính chayLenh của làn, lệnh hình dạng crm (--concurrency=1 --filter), tệp là out rồi err như làn ghép; NGUON.md có bảng đối chiếu với crm sha 6d454331 (lệnh, bản turbo, ui tui, env màu và CI); Notes của hợp đồng thêm dòng quan sát reality kèm N |
| P2 | contract | Ngưỡng mở lại phần ngoài phạm vi đòi đọc nhật ký trọn — thứ mất khi dọn worktree | Kho chạy pnpm đệ quy nhận câu dự phòng, worktree bị dọn trước khi ai mở nhật ký, ngưỡng không bao giờ nổ | Đổi ngưỡng sang thứ còn sống sau khi dọn worktree: dòng repin có chap_chon mang câu dự phòng ở kho đã cài mốc | fixed: Notes, design và trường revisit của sổ d-20261011T092244Z-2 đổi sang ngưỡng đó, đếm bằng grep trên run-log |
| P2 | evals | paths của E4 thiếu tệp sinh kho fixture và các lib khác repin-lane.mjs nạp; E1–E3 thiếu thư mục fixtures (cùng hình dạng [gia-lan-ghim-lai#F1]) | Lượt sửa chạm mkKho hay một lib anh em; bộ mang sang thấy paths không đổi nên mang E4 sang mà không chạy lại | Thêm tệp chứa mkKho và trọn thư mục feature-loop/scripts vào paths E4; thêm thư mục fixtures vào E1–E3 | fixed: paths E4 có feature-loop/scripts (trọn thư mục) và gia-lan-fixture.mjs; E1–E4 có thư mục fixtures/ten-ca-turbo |
| P2 | evals | Chiều im AC-3 thiếu chiều nhạy: không mutant nào bóc QUÁ RỘNG, bản ghi không có dòng nào để bộ bóc tham đọc nhầm | Vật viết bóc tham tới dấu «: » cuối dòng; dòng ca xanh có tên chứa «: (fail) » bị đọc thành ca đỏ; E1–E4 vẫn xanh | Thêm vào bản ghi thật một ca xanh tên chứa «: (fail) »; mutant tham phải làm E3 đỏ có ghim; đối chứng E1 thành «đúng một dòng (fail) đứng ngay sau tiền tố» | fixed: bản ghi có ca xanh «doc: (fail) dong le»; mutant bóc tham làm E3 đỏ với thông điệp ghim; đối chứng E1 đổi như đề xuất |
