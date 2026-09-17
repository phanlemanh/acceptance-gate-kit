---
schema_version: 1
slug: bo-qua-phai-thay-dinh-nghia-phep-do
feature: Vị từ bỏ qua phải THẤY định nghĩa phép đo — _acceptance/config.yaml và evals.yaml là ĐẦU VÀO của làn, không phải vật hồ sơ
owner: phanlemanh@gmail.com
stage: archived            # gộp vào vòng thuoc-co-cua (AC-3, AC-4, AC-5) — sổ quyết định của nó, dòng 6
decision: kill              # không mở vòng riêng — nội dung sống tiếp trong _acceptance/thuoc-co-cua/ (gộp, không mất)
decided_by: Mạnh
decided_at: 2026-09-17T08:59:56Z   # Cổng Phạm vi của thuoc-co-cua duyệt gói có dòng gộp này, máy ghi hộ
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Làn ghim lại với cờ bỏ-qua-khi-không-đổi loại trừ mọi đường dẫn có phân đoạn
`_acceptance`, nên sửa một giá trị `executors` trong `_acceptance/config.yaml` hoặc
`evals.yaml` của hồ sơ sau verify thì làn vẫn bỏ qua — lệnh MỚI không bao giờ chạy trước
chữ ký, mà bằng chứng đã ghim mang mã thoát của lệnh CŨ. Người trả giá: owner ký trên
bằng chứng không còn đo thứ đang ship. Hồ sơ mở ở `draft` tại Cổng Bằng chứng của
`chu-ky-khong-tu-lam-hoa-cu` (15/09) và chưa từng chạy vòng; ngày 17/09 ba tiêu chí của
nó được gộp vào vòng `thuoc-co-cua` thành AC-3 đến AC-5 (sổ quyết định
`_acceptance/thuoc-co-cua/decisions.jsonl`, dòng 6: một vòng, một chữ ký thay vì hai).
Hợp đồng và evals gốc giữ nguyên văn làm sử liệu ở `su-lieu/`.

## Ngưỡng chết / ngưỡng UAT

Không đo được theo phiên nghiệm thu — vòng nội bộ engine, không có người dùng cuối. Thước
thành công sống ở hồ sơ `thuoc-co-cua` (E4 đến E7).
