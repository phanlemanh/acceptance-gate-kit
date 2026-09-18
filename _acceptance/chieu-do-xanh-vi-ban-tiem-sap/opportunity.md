---
schema_version: 1
slug: chieu-do-xanh-vi-ban-tiem-sap
feature: Lời khai không mạnh hơn vật — chiều đỏ phải có mũi tiêm THẬT và bản tiêm phải CHẠY; quét theo LỚP, không vá ca bị nêu tên
owner: phanlemanh@gmail.com
stage: archived
decision:
decided_by:
decided_at:
---

> **Về hạt giống 18/09 (luật «ô chỉ mở khi có neo ngoài»).** Chưa kho nào gọi tên ô này —
> chữ giữ nguyên, không xoá. Mở lại = thêm dòng `Gốc:` vào section «Vấn đề & ai gặp» và
> đổi `stage:` về `discovery`.

## Vấn đề & ai gặp

Ca `GL04` trong `tests/scripts/repin-lane-lop-cu.test.mjs` kết luận «bắt được» từ
việc bản tiêm KHÔNG chạy, chứ không từ việc bản tiêm chạy và cho kết quả khác. Bản
tiêm sập bằng `TypeError` cũng cho đúng màu ấy.

Đây là LỚP mà hiến pháp kit gọi tên: *«Assertion âm-tính-một-mình là assertion
không sống … case không phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy"»*, và
luật ghi rõ phải sửa theo LỚP — quét cả tệp tìm mọi ca cùng hình dạng, đừng chỉ vá
ca bị nêu tên.

**Người trả giá:** mọi vòng dựa vào làn ghim lại. Một lớp bảo vệ tự khai là đang
canh, nhưng phép đo của nó không phân biệt được vật lành với vật hỏng.

**Phát hiện ở:** vòng `cong-nguoi-doc-du-nguon` lượt chấm 8, định đoạt Ngoài-6 tại
Cổng Bằng chứng 13/09/2026.

### Mặt thứ hai của cùng lớp — gộp vào 16/09

Ô `evals-khai-chieu-do-khong-co-vat` xếp lại vào ô này ngày 16/09 (rà 28 ô theo
North Star). Hai mặt của MỘT lớp «lời khai mạnh hơn vật»:

| Mặt | Lời khai | Vật | Đo được |
|---|---|---|---|
| bản tiêm SẬP | ca khai «bắt được» | mũi tiêm có, nhưng không chạy | `GL04`, 13/09 |
| **không có vật** | `evals.yaml` khai chiều đỏ cho hai ô | tệp ca **không có mũi tiêm nào** | `_acceptance/lan-doc-status-not-run`, hồ sơ ĐÃ KÝ |

Cùng vòng `cong-nguoi-doc-du-nguon` đã đo đúng lớp này ở CHÍNH nó tại lượt chấm 5:
**năm trong bảy ca** chỉ có assert dương trong khi bản khai nêu từng mũi tiêm kèm
thông điệp ghim. Vòng ấy đã vá cho mình; hồ sơ kia thì chưa.

**Người trả giá của mặt thứ hai:** người đọc bản khai eval để biết một phép đo mạnh
tới đâu — hai ô ấy nói mạnh hơn sự thật.

Hệ quả cho phạm vi: phép quét phải chấm được CẢ HAI mặt — «khai có mà vật không có»
và «vật có mà không chạy» — nếu không nó lại là một lời khai nữa không có vật.

## Ngả sửa (chưa quyết)

1. Bản tiêm phải qua `node --check` trước khi tin màu của nó, và ca phải ghim ĐÚNG
   THÔNG ĐIỆP mong đợi chứ không chỉ mã thoát — đúng khuôn `banTiem()` mà hồ sơ
   `cong-nguoi-doc-du-nguon` vừa dựng và đã chạy thật.
2. Quét CẢ tệp `repin-lane-lop-cu.test.mjs` tìm mọi ca cùng hình dạng, không chỉ GL04.
3. Đối chiếu bản khai chiều đỏ với vật: mỗi ô khai có mũi tiêm thì tệp ca phải có
   mũi tiêm thật — quét cả corpus, không chỉ hồ sơ bị nêu tên.

Phép đo hai chiều bắt buộc: một bản tiêm SẬP phải làm ca ĐỎ CÓ TÊN («bản tiêm không
qua node --check»), khác hẳn màu của một bản tiêm chạy được và cho kết quả khác; và
một bản khai chiều đỏ KHÔNG có mũi tiêm phải ĐỎ CÓ TÊN, trong khi hồ sơ khai đúng
phải IM.
