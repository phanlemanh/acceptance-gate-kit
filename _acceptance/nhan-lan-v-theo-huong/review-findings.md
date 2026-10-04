# Review findings: nhan-lan-v-theo-huong (round 2)

## Trong hợp đồng

(không có finding nào)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 6 (biến thể): NC-AC4-cu so một bản chụp cố định chứ không so vật mà vòng ntr giao, nên hai commit gate-card sau của vòng nằm ngoài phép so**
  Người dùng thấy gì: Một phép kiểm cũ của vòng trước chỉ đối chiếu thẻ duyệt với trạng thái ở lần sửa đầu tiên, chưa bao hết các lần sửa thẻ sau đó của vòng ấy. Nếu một lần sửa như vậy vô tình làm đổi thẻ của hồ sơ bình thường thì phép kiểm cũ vẫn báo xanh. Thẻ mà người ký đọc ở vòng này không đổi, nên không ảnh hưởng người dùng hiện tại; chỉ là một chỗ phép kiểm cũ chưa đủ chặt.
  file: `tests/scripts/ntr-the-canh-gay.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
