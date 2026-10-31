---
schema_version: 1
slug: chi-tep-vat-keo-xet-lai
feature: Luật bằng chứng cũ chỉ kéo hồ sơ vào xét khi PR chạm tệp vật của hồ sơ, không phải khi chỉ sửa tệp chữ
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-31T12:00:00Z   # chủ kho gõ «Mở cả bốn» ở phiên điều phối kit (bốn vòng vá cho bản 2.36.2)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Một PR chỉ sửa tệp chữ của hồ sơ — `opportunity.md` (timebox, ngưỡng) hay `decisions.jsonl` (sổ quyết định) — làm
hồ sơ ấy bị lưới trước gộp xét lại «bằng chứng cũ»: `scripts/pre-merge-check.sh` coi mọi tệp dưới
`_acceptance/<slug>/` là «hồ sơ trong diff» rồi soi `verified_commit` theo toàn bộ mã đã trôi kể từ lần ghim, dù
PR không chạm thứ bằng chứng đo. Ở kho crm, hai việc dọn chữ (lùi timebox 52 hồ sơ, chốt ngưỡng 51 hồ sơ) kéo
111 hồ sơ phải ghim lại — khoảng 1 098 lệnh eval, ước 13 giờ máy — chỉ để gộp được một PR không đổi hành vi.

Gốc: crm/_acceptance/gon-dau-trang-lay-y-kien/

Vì sao: issue phanlemanh/acceptance-gate-kit#468 (đo ở crm 31/10 — PR chỉ sửa dòng Timebox của hồ sơ
`gon-dau-trang-lay-y-kien` bị VIOLATION «evidence is stale»); crm đang chờ bản kit này thay vì ghim lại.

Người hưởng: chủ kho của mọi kho tiêu thụ — PR dọn chữ hồ sơ gộp được mà không trả giờ máy ghim lại (North Star:
đích là GỘP ĐƯỢC; đây đúng đoạn ký→gộp). Nguyên tố 2: một VIOLATION đòi bằng chứng tươi cho thứ bằng chứng không
ghim là cờ sai lý do.

## Ngưỡng chết / ngưỡng UAT

Không đo được — việc nội bộ của bộ công cụ, không có người dùng cuối; reality đọc ở kho crm: PR dọn chữ hồ sơ kế
tiếp (lùi timebox / chốt ngưỡng) qua lưới trước gộp mà không ghim lại hồ sơ nào sau khi kho nhận 2.36.2.

- Timebox: 2026-11-02 — bản vá 2.36.2 cắt ngay sau khi bốn vòng vá gộp.
