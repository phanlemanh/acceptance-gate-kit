---
schema_version: 1
slug: de-xuat-tieng-viet-khong-doc-duoc
feature: Thẻ Cổng 2 in nút bằng tiếng Việt nhưng chỉ đọc được từ khoá tiếng Anh trong «Đề xuất:» — người viết đúng chữ trên nút thì thẻ báo không đọc được
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

`gate-card.js` đọc dòng `Đề xuất:` của mỗi mục trong `review-findings.md` và ánh xạ
sang một khuyến nghị. Bộ từ nó nhận là **tiếng Anh**: `known-limits`, `new-contract`,
`wont-fix`. Nhưng chính thẻ đó lại in ba nút bằng **tiếng Việt**: «ghi Known limits»,
«mở hợp đồng mới», «nâng phạm vi sửa ngay».

Nên có đúng một ngả sai mà người dùng rơi vào một cách tự nhiên: viết vào
`review-findings.md` đúng chữ mình đọc thấy trên nút. Thẻ trả lại:

```
đề xuất không đọc được: «hợp đồng mới» — dùng một trong: known-limits · new-contract · wont-fix
```

và ô tương ứng trong dòng lệnh điền sẵn bỏ trống (`Ngoài-1: ___`), trong khi hai mục
viết `known-limits` thì được điền sẵn bình thường.

**Người trả giá:** người ký ở Cổng Bằng chứng. Thẻ trông như thể máy không có khuyến
nghị cho mục đó, trong khi làn phản biện đã nêu khuyến nghị rất rõ. Mục nặng nhất của
một hồ sơ là mục dễ được viết bằng chữ đầy đủ nhất, nên lỗi này nhắm đúng vào mục
quan trọng nhất.

Nặng hơn: `known-limits` trùng chữ với nút «ghi Known limits» nên ai viết theo nút
vẫn may mà trúng; `hợp đồng mới` và `sửa ngay` thì không. Bộ từ khoá do đó **im lặng
một phần** — hai trong ba ngả gãy, một ngả chạy, nên lỗi không lộ ra ngay.

**Ca thật đo được:** kho `crm-onehub`, hồ sơ `gieo-rai-deu-danh-ba`, thẻ dựng
2026-09-07 bằng kit 2.8.0. Mục `Ngoài-1` («ở cấu hình đang ship, vòng sửa không đổi
một địa chỉ nào cho lệnh chạy thật», severity high) viết `Đề xuất: hợp đồng mới` →
không đọc được. Đổi sang `Đề xuất: new-contract` → thẻ in «Máy đề xuất: tách thành
một việc riêng» và điền sẵn «Ngoài-1: mở hợp đồng mới».

Cũng vướng: `sửa ngay` — chữ khớp nút «nâng phạm vi sửa ngay» — không nằm trong bộ
từ nhận. Ba mục dùng nó trong cùng hồ sơ, nhưng đều ở section `## Trong hợp đồng`
nên thẻ không render, và lỗi ẩn luôn.

## Ngả sửa (chưa quyết)

1. Bộ đọc nhận cả hai ngôn ngữ: thêm bí danh `hợp đồng mới`/`hợp đồng-mới` →
   `new-contract`, `sửa ngay` → nâng phạm vi, `hạn chế đã biết`/`Known limits` →
   `known-limits`, không dấu cũng nhận.
2. Hoặc ngược lại: thẻ in đúng từ khoá máy nhận, để nút và văn bản nói cùng một
   thứ tiếng. Rẻ hơn nhưng đẩy tiếng Anh ra mặt người, ngược luật ngôn ngữ mặt người.
3. Dù chọn ngả nào, câu báo lỗi nên nêu **bí danh gần nhất** thay vì chỉ liệt ba từ
   khoá: «không đọc được «hợp đồng mới» — có phải ý bạn là `new-contract`?».

Phép đo hai chiều bắt buộc: một `review-findings.md` mẫu viết `Đề xuất: hợp đồng mới`
→ thẻ in khuyến nghị «tách thành một việc riêng» VÀ điền sẵn ô lệnh; một mẫu viết
`Đề xuất: xyz` → thẻ vẫn báo không đọc được, kèm dòng gợi ý bí danh gần nhất.
