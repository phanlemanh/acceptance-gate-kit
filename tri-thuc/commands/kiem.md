---
description: Kiểm kho tri thức của kho hiện tại — sáu lỗi cấu trúc (trang thiếu nguồn, nguồn không có, raw bị sửa, mã không có trang, kho riêng chưa đẩy, raw trong kho công khai). Chỉ đọc.
argument-hint: "[--pham-vi <tệp bản phạm vi>]"
---

Chỉ đọc, chạy được ở mọi phiên trong kho. Giải `$AG` bằng `resolve-plugin.mjs` của feature-loop
(`--plugin acceptance-gate --require scripts/tri-thuc.mjs`, như bước 1 của `/acceptance-gate:acceptance-card`; kho tự host
kit đặt `AG=.`), rồi chạy đúng dòng trong khối dưới — thêm `--pham-vi <tệp>` khi người gõ đối số ấy — và in NGUYÊN VĂN
kết quả.

Đọc mã thoát:
- 0 — xanh: dòng cuối «tri thức: <n> trang, <m> raw, 0 lỗi».
- 1 — đỏ: mỗi dòng `lỗi: [<mã>] <tệp>: <câu>` một lỗi; in hết, không tóm.
- 2 — không chạy được: kho chưa khai `tri_thuc` trong `_acceptance/config.yaml` hay khối sai khuôn — nói đúng câu lỗi và
  chỗ khai (khuôn: `skills/acceptance/references/tri-thuc-template.md` của gói acceptance-gate).
- 3 — không đọc được ở đây: kho khai kho riêng mà máy này chưa có bản — in nguyên dòng, trong đó có lệnh `git clone`. Đây
  không phải xanh cũng không phải đỏ.

Lệnh không ghi tệp nào.

<!-- <<<TT-KIEM-LENH -->
```
node "$AG/scripts/tri-thuc.mjs" --root . --kiem
```
<!-- TT-KIEM-LENH>>> -->
