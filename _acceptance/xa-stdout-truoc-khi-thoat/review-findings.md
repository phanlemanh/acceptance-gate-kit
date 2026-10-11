# Review findings: xa-stdout-truoc-khi-thoat

## Trong hợp đồng

Không có finding nào nằm trong hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khoá xuat_du_qua_pipe chạy trần, nên mã thoát không mang phán quyết của từng eval: ca in «KHÔNG ĐO ĐƯỢC» vẫn cho thoát 0**
  Người dùng thấy gì: Khi máy không đo được chiều đỏ trên nền không cắt, lệnh kiểm vẫn báo hoàn tất bình thường. Vì vậy một đợt ghim lại hồ sơ sau này có thể ghi xanh cho những ca thật ra chưa từng được thử chiều đỏ, và người xem chỉ thấy màu xanh mà không biết nó chưa được chứng minh.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Dòng PASS và dòng dò in «exitCode: mã 1», dễ khiến tác tử máy đọc nhầm mã thoát**
  Người dùng thấy gì: Một vài dòng kết quả của bộ kiểm có thể khiến công cụ chấm tự động đọc nhầm trạng thái của lệnh và khai sai, sinh ra một lần chấm đỏ giả. Hậu quả chỉ là thêm một vòng chấm lại, kết quả thật của tính năng không bị sai.
  file: `tests/scripts/xuat-du-qua-pipe.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim quá rộng): chiều đỏ của XD-5 chỉ ghim tiền tố chung «lệch byte», nên không chứng được phép so «bản sửa == bản hoàn nguyên» còn sống**
  Người dùng thấy gì: Hôm nay phép so sánh vẫn chạy đúng. Nhưng nếu về sau một nửa phép so ấy hỏng thì bộ kiểm vẫn báo xanh nhờ nửa còn lại, nên người dùng có thể tin nhầm rằng việc «hoàn nguyên bản cũ không đổi gì» vẫn đang được đo.
  file: `tests/scripts/xuat-du-qua-pipe.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
