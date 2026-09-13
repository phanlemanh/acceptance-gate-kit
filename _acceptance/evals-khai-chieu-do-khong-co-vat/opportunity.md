---
schema_version: 1
slug: evals-khai-chieu-do-khong-co-vat
feature: evals.yaml khai chiều đỏ mà tệp ca không có mũi tiêm nào — lời khai không có vật
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

`_acceptance/lan-doc-status-not-run/evals.yaml` khai chiều đỏ cho `E5/L05` và
`E9/L08`, nhưng tệp ca không có mũi tiêm nào cho hai ô ấy. Lời khai đứng một mình.

Đây đúng lớp mà vòng `cong-nguoi-doc-du-nguon` vừa đo được ở CHÍNH nó tại lượt chấm
5: năm trong bảy ca chỉ có assert dương trong khi `evals.yaml` khai từng mũi tiêm
kèm thông điệp ghim. Vòng ấy đã vá cho mình; hồ sơ `lan-doc-status-not-run` thì
chưa, và nó ĐÃ KÝ.

**Người trả giá:** người đọc `evals.yaml` để biết một phép đo mạnh tới đâu. Hai ô
này nói mạnh hơn sự thật.

**Phát hiện ở:** vòng `cong-nguoi-doc-du-nguon` lượt chấm 8, định đoạt Ngoài-8 tại
Cổng Bằng chứng 13/09/2026.

## Ngả sửa (chưa quyết)

1. Dựng mũi tiêm thật cho L05 và L08 bằng khuôn `banTiem()` đã chạy thật ở
   `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`.
2. Hoặc sửa `evals.yaml` để nó khai đúng những gì ca đang làm — phép TRỪ, rẻ hơn,
   nhưng bỏ mất lớp bảo vệ mà lời khai hứa.

RÀNG BUỘC: hồ sơ `lan-doc-status-not-run` đã ký. Sửa `evals.yaml` của một hồ sơ đã
ký là chạm sử liệu — cùng lớp «bất biến không được nằm trong hồ sơ đã ký». Vòng nào
nhận việc này phải khai đường đi trước.

## Ô cùng họ

Cùng lớp với `chieu-do-xanh-vi-ban-tiem-sap`; cân nhắc gộp một vòng «quét lớp
chiều-đỏ trên toàn bộ tệp ca».
