---
schema_version: 1
slug: pre-merge-doc-lib-theo-kit
feature: Bộ kiểm trước gộp đọc thư viện của kit theo chỗ cài kit, không theo gốc kho tiêu thụ
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-31T09:00:00Z   # chủ kho gõ «Mở vòng vá» ở phiên điều phối kit, trả lời câu «Mở vòng vá kit và cắt bản 2.36.1?»
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Kho tiêu thụ cài kit theo đường plugin và KHÔNG chép lớp CI (không có `lib/` ở gốc kho) thì mọi hồ sơ
`machine-cleared` bị bộ kiểm trước gộp chặn với VIOLATION «không đọc được mục «Known limits» (fail-closed)»:
`scripts/pre-merge-check.sh` đọc `lib/md-section.cjs` và `lib/out-of-contract.cjs` theo GỐC KHO đang kiểm thay vì
theo chỗ đặt chính script — khác mọi chỗ đọc thư viện còn lại trong cùng tệp. Hai kho có lớp chép CI không vấp vì
bản chép có sẵn hai tệp ấy. Lỗi có từ 2f8de63a (16/08); xác nhận trên main `c8870a49`.

Gốc: onehub-quy-hang/_acceptance/bao-ro-ngay-ban-sai/

Vì sao: hàng 57 của kho onehub-quy-hang, PR onehub-quy-hang #30 — hồ sơ máy-thông đầu tiên của kho cài theo đường
plugin bị lưới trước gộp chặn oan; kho không gộp được kết quả nào đi làn V cho tới khi bản vá 2.36.1 về.

Người hưởng: chủ kho của mọi kho tiêu thụ cài kit theo đường plugin — vòng máy-thông gộp được, không phải mở tay
một ngoại lệ ở mỗi PR (North Star: đích là GỘP ĐƯỢC). Nguyên tố 2: một VIOLATION sai lý do là cờ người học cách bỏ
qua.

## Ngưỡng chết / ngưỡng UAT

Không đo được — việc nội bộ của bộ công cụ, không có người dùng cuối; reality đọc ở kho onehub-quy-hang: PR #30
(hoặc PR máy-thông kế của kho) qua lưới trước gộp sau khi kho nhận 2.36.1.

- Timebox: 2026-11-02 — bản vá 2.36.1 cắt ngay sau khi vòng này gộp.
