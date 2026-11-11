---
slug: doc-jsx-va-ban-do-hong
at: 2026-11-10T07:40:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | AC-6 dựng trên hồ sơ có eval khuôn, trong khi lỗi xảy ra khi hồ sơ thiếu eval khuôn; đối chứng bộ máy gốc vì thế rỗng | Lệnh dừng đặt trong nhánh có eval khuôn, ca đo vẫn xanh mà lỗi Ngoài-5 còn nguyên | Bốn lỗi mất nhóm × chạm thiếu eval, không chạm; đối chứng cặp trên bộ máy gốc; ca tiêm chỉ dừng khi có eval khuôn | fixed: AC-6 và E6 viết lại thành tám ô, thêm DJ-6-do2 |
| P0 | design | Câu trích fail-closed không quyết ranh giới mất nhóm thì dừng, lỗi còn lại đi tiếp; tiền đề bước chấm đã báo chưa có AC đo | Chủ kho tưởng ranh giới đã có luật quyết; lỗi lọt cả hai lớp nếu bước chấm không báo | Dòng sổ thay thế và ba hàng chạm vùng có eval khuôn | fixed: dòng sổ thay thế trỏ luật trạm thu phí trong CLAUDE.md, AC-7 đo bước chấm thật thoát 1 |
| P0 | design | Lối thoát 1 cho thẻ không đọc được chưa bị loại bằng ràng buộc | Tệp không được chấm mà cổng xanh | Dòng sổ thay thế nêu ràng buộc; AC-4 ghim mã thoát | fixed: dòng sổ thay thế trỏ luật không đo được không bao giờ chặn, AC-4 ghim thoát 0 |
| P1 | contract | Thiếu hai dấu nháy lẻ cùng dòng trong JSX lồng và dấu chia; sổ khẳng định sai là không chấm sai | Cặp nháy nuốt khe, báo oan thiếu title | Thêm hàng DJ-2, sửa cost_if_wrong | fixed: thêm hàng và luật nháy sau chữ, dòng sổ thay thế sửa cost_if_wrong, dạng hiếm còn lại vào Out of scope |
| P1 | evals | Ma trận không khớp ba nơi, một đột biến cho nhiều nhánh bỏ qua | Xoá một nhánh bỏ qua mà ca đo vẫn xanh | Bảng hàng viết sẵn, mỗi nhánh một đột biến ghim hàng đỏ | fixed: E2 kê đủ 24 hàng và chín nhát tiêm cô lập |
