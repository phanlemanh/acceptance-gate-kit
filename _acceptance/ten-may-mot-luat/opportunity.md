---
schema_version: 1
slug: ten-may-mot-luat
feature: Một luật tên máy cho kênh liên máy — tin gửi tới một tên máy không nhận vai được thì bị từ chối ngay lúc gửi, không nằm chết trên kênh
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-31T14:00:00Z   # chủ kho «Mở cả bốn» ở phiên điều phối kit — bốn vòng vá cho bản 2.36.2 (#468, #463, #467, #464)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Trên kênh liên máy, ba chỗ dùng ba luật cho cùng một tên máy: nhận vai (`tin vai --may`) chỉ nhận chữ và số; bên
viết tin (`tin GIAO|HỎI|BÁO <đích> --kenh …`) không kiểm đích gì; bên đọc dòng đầu không nhận khoảng trắng trong tên.
Ngày 31/10 một tin GIAO gửi tới «Mac Studio» (có dấu cách) được đăng thành công, nhưng bên đọc trả `null` cho dòng
đầu ấy: sổ vòng không thấy nó, bộ canh không báo nó, và không máy nào nhận vai được bằng đúng tên ấy. Tin nằm chết
trên kênh mà không ai được báo.

Gốc: acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/

Vì sao: issue phanlemanh/acceptance-gate-kit#464 — hạt giống từ đợt crm ngày 31/10 (máy Mac Studio), dựng lại vòng
viết→đọc bằng chính `vietDongDau` và `docDongDau`: «MacStudio» đọc ra đúng, «Mac Studio» đọc ra `null`. Hồ sơ trỏ ở
dòng Gốc là hồ sơ đã dựng lệnh `tin` và kênh liên máy.

Người hưởng: các phiên điều phối trên kênh liên máy (hôm nay MBP và MacStudio trên crm-onehub#375 và kit#308) — một
lời giao việc sai tên bị chặn ngay lúc gõ, kèm cách sửa, thay vì mất lặng; và chủ kho — không phải tự phát hiện một
việc đã giao mà không ai nhận. Nguyên tố 2: máy không được tin rằng «đã đăng» nghĩa là «đã tới».

Quyết định thiết kế đã có (chủ kho chấp nhận khuyến nghị 31/10, đảo được):

- GIỮ luật chữ-và-số cho tên máy — tên máy còn là tiền tố mã tin.
- Bên viết hỏng to: `tin GIAO|HỎI|BÁO <đích>` ở chế độ kênh kiểm đích theo đúng luật ấy, sai thì dừng với thông điệp nêu luật và gợi ý tên bỏ dấu cách.
- Không được làm gãy hai tên MBP và MacStudio đang dùng trên crm-onehub#375 và kit#308.

## Ngưỡng chết / ngưỡng UAT

Việc nội bộ của bộ công cụ, không có người dùng cuối. Reality đọc ở kênh crm-onehub#375: bình luận đăng SAU ngày máy
nhận bản 2.36.2 mà bộ đọc dòng đầu trả `null` = 0. Tin GIAO tới «Mac Studio» ngày 31/10 là ngoại lệ có tên (đăng trước
bản vá; dọn nó ngoài phạm vi).

- Timebox: 2026-11-02 — bản vá 2.36.2 cắt khi bốn vòng vá gộp.
