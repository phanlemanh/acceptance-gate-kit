---
schema_version: 1
slug: the-cong-2-giau-loi-trong-hop-dong
feature: Thẻ Cổng 2 không có làn nào cho lỗi TRONG hợp đồng chưa sửa — nó im lặng, và thẻ vẫn ghi "Bằng chứng đầy đủ"
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

`gate-card.js` đọc `review-findings.md` và render khối «Ngoài hợp đồng». Nó KHÔNG
có khối nào cho section `## Trong hợp đồng`. Giả định ngầm là tới lúc trình Cổng 2
thì mọi lỗi trong hợp đồng đã được vòng sửa dọn hết, nên section đó luôn rỗng.

Giả định đó vỡ ở một ca thật và ca đó hợp lệ: **luật STOP-PATCHING**. Máy cạn lượt
sửa (hai vòng trượt cùng lớp lỗi), người chọn đường, máy hứa lượt chấm vừa rồi là
lượt cuối. Kết quả: `verdict: PENDING-JUDGMENT`, 0 phép đo trượt, 0 chân bị chặn —
nhưng còn MỘT lỗi trong hợp đồng chưa sửa, có mã AC hẳn hoi.

Thẻ dựng ra từ trạng thái đó:

- đầu thẻ ghi «Bằng chứng đầy đủ — ảnh chụp + chạy thật»
- khối «Ngoài hợp đồng — bạn quyết (21)» hiện đủ 21 mục
- lỗi trong hợp đồng: **không xuất hiện ở bất kỳ đâu trên thẻ**
- dòng lệnh điền sẵn không có ô nào cho nó

Người ký nhìn thẻ thấy một hồ sơ sạch hơn hồ sơ thật. Đó đúng là bất biến thẻ tự
khai ở đầu file: *"the card must NEVER make a bad/incomplete state look approvable"*.

**Người trả giá:** người ký ở Cổng Bằng chứng — ký một hồ sơ có lỗ mà thẻ không nói.
Ca này chỉ không nổ vì máy nói bằng miệng trong tin mời cổng; lần sau máy quên nói
thì không có gì bắt.

**Ca thật đo được:** kho `crm-onehub`, hồ sơ `tiep-thi-tuyen-doi-tac`, thẻ dựng
2026-09-05 ở commit `6abfc19` bằng kit 2.8.0. Lỗi bị giấu: «Lỗi giữa lô nạp trả 500
trắng và để lại phần đã ghi», `severity: medium`, `AC: AC-3`.

## Ngả sửa (chưa quyết)

1. Thẻ render một khối «Trong hợp đồng — CHƯA SỬA» phía TRÊN khối ngoài hợp đồng,
   màu cảnh báo, kèm mã AC, và bỏ câu «Bằng chứng đầy đủ» khi khối đó không rỗng.
2. Thêm ô vào dòng lệnh điền sẵn cho từng mục — nhưng KHÔNG điền sẵn khuyến nghị,
   vì «lỗi trong hợp đồng chưa sửa» là ca người phải tự chấm.
3. Cân nhắc: có nên để nó chặn `approvable` hẳn không, hay chỉ hạ cờ. Ca STOP-PATCHING
   là ca hợp lệ để trình cho người, nên chặn hẳn có thể là cửa không lối ra.

Phép đo hai chiều bắt buộc: một hồ sơ mẫu có `## Trong hợp đồng` rỗng → thẻ như cũ;
một hồ sơ mẫu có đúng một mục ở đó → thẻ hiện mục ấy VÀ không còn câu «Bằng chứng đầy đủ».
