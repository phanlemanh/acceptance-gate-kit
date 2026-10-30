---
description: Ghi nghiên cứu hay thảo luận của phiên vào kho tri thức — lưu tài liệu thô bất biến kèm băm, viết hay bổ sung trang tóm, commit tại máy, in đường trỏ ghim. Tài liệu thô không bao giờ vào chỗ công khai.
argument-hint: "<loại nguồn> <gốc> — phiên chat, artifact, issue, tệp ở máy này, tệp trong kho"
---

Ghi vào gốc tri thức kho đã khai trong `_acceptance/config.yaml` (khối `tri_thuc`; khuôn:
`skills/acceptance/references/tri-thuc-template.md` của gói acceptance-gate). Giải `$AG` như `/tri-thuc:kiem` (kho tự
host kit đặt `AG=.`).

1. **Gom nguồn ra tệp tạm** ở thư mục nháp của phiên — KHÔNG trong kho tiêu thụ: trích đoạn phiên chat nguyên văn, nội
   dung artifact, nội dung issue; tệp ở máy này hay tệp trong kho thì dùng thẳng đường của nó. Loại nguồn là một trong năm
   loại của khối `TRI-THUC-NGUON` trong khuôn: `phien` · `artifact` · `issue` · `tep-may` · `tep-kho`.
2. **Viết thân trang tóm** ra một tệp tạm: điều rút ra, viết lại bằng lời của mình — không chép lời nguyên văn của người,
   không số liệu nội bộ, không ảnh có tên người. Bổ sung một trang đã có thì bỏ `--than` để giữ thân cũ.
3. **Chạy đúng dòng dưới**, thay các ô `<…>`: `--tep` lặp lại cho mỗi tệp; `<trang>` là `<loại trang>/<tên>.md` (loại
   trang: `nen` · `chu-de` · `dot`); `--ma` là các mã hàng trang mang, cách nhau bằng dấu phẩy (bỏ khi không có).

<!-- <<<TT-GHI-LENH -->
```
node "$AG/scripts/tri-thuc-ghi.mjs" --root . --loai <loai> --goc '<goc>' --ten <ten> --tep <tep> --trang <trang> --than <than> --ma <ma>
```
<!-- TT-GHI-LENH>>> -->

Đọc mã thoát:
- 0 — đã ghi: in nguyên văn các dòng `raw:` và `trang:` (đường trỏ ghim theo băm, dán được vào bản phạm vi hay hồ sơ) và
  dòng `commit:`. Lệnh KHÔNG đẩy — đẩy kho giữ tri thức là bước riêng, `/tri-thuc:kiem` nhắc khi còn commit chưa đẩy.
- 2 — đầu vào sai, không chạy được, hay commit hỏng (đã hoàn lại): in nguyên văn câu lỗi, sửa đúng đối số nó gọi tên.
- 3 — không đọc được ở đây: kho khai kho riêng mà máy này chưa có bản — in nguyên dòng, trong đó có lệnh `git clone`.
- 4 — câu hỏi khó-đảo cho người về riêng tư: kho công khai chưa có kho riêng, nơi giữ tài liệu thô đang công khai trên
  GitHub, hay không kiểm được nó có riêng tư không. Trình NGUYÊN VĂN câu lệnh in cho người và dừng — không tự chọn lối,
  không tạo kho, không đổi cấu hình thay người. Đẩy tài liệu thô lên chỗ công khai không thu hồi được.

Mã khác 0: lệnh không ghi tệp nào.
