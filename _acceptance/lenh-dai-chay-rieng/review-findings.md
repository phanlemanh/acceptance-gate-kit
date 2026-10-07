## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **songMau's process check matches samples from the other three copies of this test file that run at the same time, so pid reuse still misfires**
  Người dùng thấy gì: Khi bốn lượt kiểm tra cùng chạy một lúc, hệ điều hành có thể giao lại mã tiến trình của lượt này cho lượt kia. Khi đó một lượt có thể giết nhầm tiến trình mẫu của lượt khác (hoặc của bộ kiểm tra khác) và báo đỏ giả, dù tính năng chạy lệnh dài vẫn đúng. Hiếm xảy ra, nhưng nếu xảy ra thì lượt chấm bị đỏ oan và phải chạy lại.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **songMau swallows ps errors and returns false (dead), so chetTrong can show a false green**
  Người dùng thấy gì: Khi máy đang quá tải và không đọc được trạng thái tiến trình, bài kiểm tra có thể coi tiến trình còn sống là đã chết và báo xanh. Màu xanh đó khi ấy chưa chứng minh được lệnh dài thật sự đã bị dừng, nên có thể còn sót tiến trình ngủ chạy nền sau lượt kiểm tra.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
