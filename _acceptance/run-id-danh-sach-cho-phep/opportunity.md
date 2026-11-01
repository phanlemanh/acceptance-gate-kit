---
schema_version: 1
slug: run-id-danh-sach-cho-phep
feature: Mã lượt chạy (run_id) chỉ được ghi khi đúng hình dạng mã — mã rác của tác tử (dấu huyền, chữ không có số, chuỗi có khoảng trắng) thành mã máy đúc, và lượt sau không mang sang eval có mã rác trong sổ cũ
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-31T14:30:00Z   # chủ kho gõ «Mở cả bốn» ở phiên điều phối kit 31/10 (bốn vòng vá #468 #463 #467 #464), máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Kho tiêu thụ crm, hồ sơ `rang-hang-cong-cu`, kit 2.36.0: lượt chấm 1 ghi `run_id` của E9 là một dấu huyền «`».
Tác tử chạy lệnh máy trả dấu ấy thay cho chuỗi rỗng khi lệnh không in run_id; bên viết của bộ chấm chỉ bóc nháy
`"`/`'` nên giữ nó, rồi bước tính mang sang của lượt 2 mang nguyên mã hỏng sang. Phiên crm phải xoá tay E9 khỏi đối
số lượt 2 để eval chạy lại. Cùng lớp với bản vá #284 (chỉ bóc nháy): một ký tự rác khác lọt qua đúng lối cũ.

Gốc: crm-onehub/_acceptance/rang-hang-cong-cu

Vì sao: issue phanlemanh/acceptance-gate-kit#467 — mỗi lần tác tử trả một mã rác mới, phiên tiêu thụ phải tự sửa
đối số lượt chấm bằng tay (một lượt gọi người ngoài thiết kế), và bằng chứng lượt 1 mang mã mà thẻ Cổng Bằng chứng
coi là thiếu.

Người hưởng: chủ kho của mọi kho tiêu thụ — lượt chấm lại không cần sửa tay đối số; trace nguyên tố 2 (bằng chứng
không tự dối: mã lượt trong sổ phải là mã của một lần chạy thật hoặc mã máy đúc, không phải rác tác tử khai).

## Ngưỡng chết / ngưỡng UAT

Không đo được — việc nội bộ của bộ công cụ, không có người dùng cuối; reality đọc ở kho crm: lượt chấm lại kế tiếp
của một hồ sơ có lệnh không in run_id không phải sửa tay `s4-args-r<N>.json` sau khi kho nhận 2.36.2.

- Timebox: 2026-11-02 — bản vá 2.36.2 cắt ngay sau khi bốn vòng vá gộp.
