---
slug: ma-so-quyet-dinh-duy-nhat
at: 2026-09-11T09:10:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + evals | approve.md (seal) và signoff.md (veto) được nói là trỏ về DEC-ID-RECIPE nhưng không AC/eval nào chạm hai file — cùng hình dạng [eval-khai-ma-thoat-mong-doi#F2] | approve.md giữ dạng mã cũ, lượt seal kế ghi mã trùng mà E1 vẫn xanh vì chỉ đo khối SKILL | Rút chữ hai lệnh, đòi trỏ DEC-ID-RECIPE và 0 dạng cũ; bản sao chèn dạng cũ → đỏ ghim | fixed: AC-8 + E11 + DK10 |
| P1 | evals | Overlay trong E3/E5 do test sinh theo khuôn bên đọc; bên viết thật (acceptance-card.md) không có khuôn phần tử máy đọc — lớp [eval-khai-ma-thoat-mong-doi#F1] | LLM viết thẻ đặt khoá vào trường `key` thay `id`, mọi dòng mất câu dịch mà DK02/DK04 vẫn xanh | Khối marker khuôn phần tử trong acceptance-card.md; test rút khuôn, điền từ extract, render; đổi tên trường → đỏ ghim | fixed: khối DEC-PLAIN-ITEM-TEMPLATE + AC-9 + E12 + DK11 |
| P1 | contract + evals | AC-7 lấy bằng chứng ở commit đã kiểm, không ở cây mang chữ ký — tiền lệ [release-2-10-0#F1] (LM20 đòi dòng routing-baseline khi hồ sơ thành settled) | Commit chữ ký làm hồ sơ settled mà thiếu dòng routing-baseline → CI đỏ sau khi ký | Given của AC-7 là cây sau chữ ký; thêm dòng baseline trong commit chữ ký | rejected: hồ sơ đi làn V (machine-cleared, không human_signoff); settled() của LM13/LM20 chỉ nhận human_signoff khác rỗng (tests/scripts/gate-card-lmcms.test.mjs:199) nên hồ sơ không vào hai phép quét; ai ký sau thì nghi thức signoff hiện hành đã thêm dòng baseline |
| P2 | evals | Không fixture nào có mã trùng vắt qua dấu niêm Cổng 1 — k theo thứ tự sổ chưa được đo trên tập đã lọc | Đếm k theo từng khối → khối đã duyệt và Treo cùng bắt đầu từ #1, câu dịch sai dòng mà E2 vẫn xanh | Fixture hai dòng trước seal + một dòng sau; đẳng thức khoá hai khối; đột biến thứ tự đếm → đỏ | fixed: AC-2 mở rộng + DK12 (đột biến đếm Treo trước ra đúng [DUP#2, DUP#3]) |
| P2 | design + evals | Khuôn nói xử lý dòng cuối thiếu xuống dòng nhưng AC-1 chỉ đo sổ rỗng | Sổ có dòng cuối thiếu xuống dòng → append dính vào dòng cũ, mất cả hai quyết định | Sổ K dòng thiếu xuống dòng cuối; đòi K+1 dòng parse được | rejected: lệnh ghi luôn kết dòng; dòng thiếu xuống dòng chỉ đến từ bên ghi khác và làm hỏng sổ bất kể mã — bên đọc đã báo «dòng ledger hỏng» (ca D04); grep -c chỉ để n đúng, không hứa sửa dòng hỏng |
