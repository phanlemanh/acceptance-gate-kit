---
slug: nen-cong-cu-gan-bang-lenh-con
at: 2026-09-24T09:40:00Z
verdict: findings
p0: 0
p1: 2
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Vế «0 dòng bỏ-tra» của AC-1/AC-5 là assertion âm tính một mình — không đối chứng dương cho bộ dò dòng bỏ-tra, định dạng dòng chưa ghim; lập luận cặp của E2 sai (LC2 không có phép gán) | Bản vá gom `B=$(git …)` thành một từ rồi trả nguyên từ ấy, luật tenChuongTrinh bỏ tra — LC1 xanh 0 bullet trong khi triệu chứng chỉ đổi từ đỏ nhầm thành im nhầm | Khoá đối chứng chắc chắn bỏ-tra trong CÙNG lượt, ghim nguyên văn dòng của nó trước khi tin «0 dòng»; sửa câu E2 | fixed: khoá `lc_doi_chung` = `${X_KHONG_CO:-git} --version` trong lượt LC1 và LC3, ca ghim đúng 1 dòng nguyên văn cho nó; E2 viết lại — chiều nhạy có phép gán nằm ở 4 khoá thiếu của LC3 |
| P1 | contract | Cầu nối về triệu chứng thật chỉ là chuỗi chép tay; round-trip chỉ chứng YAML đọc lại đúng thứ tác giả gõ; phép quét trước/sau chỉ nằm ở Notes | Hằng số lệch dòng thật của crm, sáu eval vẫn xanh, sau phát hành crm vẫn đỏ | Ghim sha crm + sha256 giá trị thô; ca assert sha256 của hằng số; kết quả quét trước/sau thành vật bắt buộc | fixed: contract ghi crm@onehub `64d7c593` + sha256 `652e6ecc…` của giá trị YAML thô, NEN-LC1 assert sha256 trước khi chạy. deferred: phép quét 5 113 khoá đọc máy tác giả nên không thành eval — S3 ghi kết quả + lệnh tái lập vào Notes, Cổng Bằng chứng đọc nó |
| P2 | evals | Ma trận 8 khoá chưa viết trước nguyên văn; ranh giới `;` và xuống dòng design hứa mà không ca nào đo | Ma trận dùng `&&` cho mọi dạng, bản vá quên `;`, hàng backtick của bảng tái hiện vẫn đọc sai mà E5 xanh | Ghim nguyên văn 8 chuỗi + 4 bullet vào expected, có hàng `;` và nháy lồng | fixed: E3–E5 ghim nguyên văn 8 chuỗi + 4 bullet, ba khoá dùng `;`, hai khoá có nháy lồng; lời hứa «xuống dòng» gỡ khỏi design (config một dòng, không đo) |
