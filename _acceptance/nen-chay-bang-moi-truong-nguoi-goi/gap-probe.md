---
slug: nen-chay-bang-moi-truong-nguoi-goi
at: 2026-09-24T15:40:00Z
verdict: findings
p0: 0
p1: 1
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract + evals + design | Fixture chỉ mô phỏng ca công cụ VẮNG khi dùng shell đăng nhập; không có ca công cụ CÓ ở cả hai nơi mà profile tìm bản khác trước — hình dạng thật của crm (chân công cụ xanh, suite đỏ đúng một dòng mã 1). Câu «ENV1 đỏ đúng hai dòng của báo động giả» sai hình dạng | Bản vá yếu giữ `-lc` rồi nối PATH người gọi vào CUỐI: ENV1 và ENV2 xanh, ở crm node 22 vẫn được tìm trước, báo động giả quay lại; chỉ lượt kiểm chuỗi `['-c',` của E3 chặn — đo hình dạng mã, không đo hành vi | Ca NEN-ENV4: profile đặt thư mục «hệ thống» tạm chứa bản mồi `exit 42` lên đầu PATH đăng nhập; bản thật xanh, bản đột biến `-lc` cho `cong_cu: xanh` + đúng một dòng `DO SAN … ma 42`; thêm giá trị trục C; sửa câu design | fixed: thêm AC-6 + E6 + ca NEN-ENV4 (bản thật xanh, đột biến đỏ đúng một dòng mã 42); trục C thêm «có ở cả hai nơi»; câu design viết lại. Phá thử tay đúng bản vá yếu nêu trong kịch bản: fixture ENV1 mã 0, fixture ENV4 mã 1 «DO SAN … ma 42» — ghi sổ |
| P2 | evals | Ca ENV ghi đè HOME cho cả lượt nhưng E1 chỉ kiểm hai chân; E2/E3 kiểm bullet CHỨA thay vì BẰNG | HOME tạm đổi màu chân lưới/engine trên CI, ENV1 đỏ chập chờn; ở ENV2/ENV3 bullet thừa của chân khác bị phép chứa che | ENV1: bốn chân BẰNG NEN0; ENV2/ENV3: tập bullet BẰNG đúng hai dòng | fixed: ENV1 và ENV4 so bốn chân bằng NEN0 (NEN0 phải xanh trước) và tập bullet bằng `không có`; ENV2, ENV3, ENV4 so tập bullet bằng nhau |
| P2 | design + contract | «Đường nền là chỗ DUY NHẤT gọi `bash -lc`» không ghi lệnh, mẫu hay số đếm; mẫu `-lc` sót `--login`, `-ilc`, `'-l'`, `sh`/`zsh` | Một chỗ khác gọi `bash --login -c` hay `zsh -lc`, cùng lớp báo động giả sống ở đó mà người ký đọc «duy nhất» như đã kiểm | Ghi lệnh quét + số đếm vào Notes, mẫu phủ các dạng trên | fixed: Notes ghi nguyên lệnh (bash/sh/zsh × `-lc`, `-ilc`, `'-l'`, `--login` trên scripts lib hooks feature-loop workflows commands skills) → 1 dòng, là chú thích của khối mới; khai giới hạn «không bắt tham số dựng động» |
