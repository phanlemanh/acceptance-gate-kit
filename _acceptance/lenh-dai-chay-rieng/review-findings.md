# Review findings: lenh-dai-chay-rieng (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Orphan cleanup kills processes by a stale PID file with no identity check, and never retires the file**
  Người dùng thấy gì: Khi một lượt chấm bị gián đoạn rồi chạy lại trong cùng vòng, kit có thể dừng nhầm một chương trình khác của người dùng đang đúng mã tiến trình cũ, và lần chạy lại sau đó có thể làm vậy thêm lần nữa. Xác suất thấp vì chỉ xảy ra khi lượt chấm bị cắt ngang rồi thử lại.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Comment says the writer reads model_evals via docKhoa, but s4-args now uses docModelEvals**
  Người dùng thấy gì: Không ảnh hưởng người dùng cuối: chỉ có một ghi chú nội bộ mô tả sai cách kit đọc danh sách eval chạy riêng, có thể làm người bảo trì hiểu nhầm.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Cleanup of leftover runs kills whatever process now has a recorded PID, with no check that it is still the old command**
  Người dùng thấy gì: Nếu lượt chấm bị huỷ giữa chừng rồi thử lại, bước dọn của kit có thể dừng nhầm một chương trình không liên quan đang mang mã tiến trình cũ cùng các tiến trình con của nó. Hiếm gặp nhưng hậu quả là mất công việc của người dùng ngoài kit.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (asserts presence when the promise is a relation): LN6 checks that the .bat-dau file exists, not that the deadline stays bounded**
  Người dùng thấy gì: Phép kiểm cho việc lệnh dài luôn có hạn chót mới chỉ kiểm một cách làm hỏng. Một thay đổi sau này có thể khiến lượt chấm chờ mãi mà phép kiểm vẫn báo xanh.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims a class but tests one point): SC5 tests only repin_retry while docKhoa has three lane-only keys that throw**
  Người dùng thấy gì: Chỉ một trong ba cài đặt riêng của làn ghim lại được kiểm là không làm dừng lượt chấm. Nếu sau này hai cài đặt kia bị đọc nhầm vào lượt chấm, một giá trị sai ở đó có thể chặn lượt chấm mà không ai hay.
  file: `tests/scripts/s4-args-lenh-dai-chay-rieng.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
