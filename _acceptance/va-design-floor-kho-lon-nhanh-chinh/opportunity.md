---
schema_version: 1
slug: va-design-floor-kho-lon-nhanh-chinh
feature: Sàn thiết kế xếp đúng bậc ở kho lớn (danh sách tệp git trên 1 MiB) và chạy được S3/S4 ở kho có nhánh chính tên khác main/master; git hỏng thì nói lỗi thật, không đổi thành «không khớp tệp nào»
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-31T09:30:00Z   # chủ kho gõ «Mở vòng vá #460» ở phiên điều phối kit 31/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Chủ kho quyết ở phiên điều phối kit ngày 31/10, chữ nguyên văn: «Mở vòng vá #460». Vòng vá vào bản 2.36.1.

Gốc: acceptance-gate-kit/_acceptance/design-floor-moc-s3-s4/ — hai lệnh của hồ sơ ấy (bậc S0 và móc S3/S4) hỏng ở kho
tiêu thụ thật; số đo ở issue phanlemanh/acceptance-gate-kit#460 và ở phát hiện của crm
`docs/findings/2026-10-31-design-floor-crm/README.md` mục 3.1, 3.2, 6 (PR crm-onehub #597, đã gộp vào nhánh chính của
crm 9c637d1e).

Ai gặp: mọi kho tiêu thụ có danh sách tệp git trên 1 MiB (crm: 18 463 tệp, 1 057 605 byte) — khai `design.surface_globs`
rồi mà vẫn bị xếp M0 với lý do sai «không khớp tệp nào», nên S1, S3, S4 của sàn thiết kế im lặng; và mọi kho có nhánh
chính tên khác main/master (crm: `onehub`) — sửa lỗi thứ nhất xong thì S3 thoát 1, mà khối gọi S3 nằm trong SKILL của
kit nên kho không tự vá được. Ở crm, sàn thiết kế chưa bật được M1 cho tới khi hai lỗi này sửa.

Ràng buộc: khoá DO1 — không đổi cách S4 chấm trong 10 vòng thí điểm ở invest. invest dùng `main` (origin/HEAD →
origin/main) và danh sách tệp ~249 KB, nên kết quả ở đó phải y như hôm nay.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi crm nhận 2.36.1 và khai `design.surface_globs`, bậc S0 ra M1 và một vòng giao diện
  ở crm chạy qua S3 không thoát 1?
- Kết quả nào là SỐNG: bậc M1 ở crm; S3 của vòng giao diện đầu tiên ở crm thoát 0 không cần `--base`; invest không đổi
  một dòng nào ở S0/S3/S4.
- Kết quả nào là CHẾT: crm vẫn M0 hoặc S3 vẫn thoát 1 sau khi nhận bản vá; hoặc invest đổi kết quả.
- Timebox: bản 2.36.1.
