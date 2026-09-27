# Review Findings: cham-khong-tu-dot-luot (round 3)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **scope_plain: the writer now says it never replaces the items, but the Gate 2 reader still uses it in place of them**
  Người dùng thấy gì: Ở bước xác nhận bằng chứng, khi người dùng bấm "Đồng ý cắt / Không, kéo vào" cho các phần đã cắt/hoãn, màn hình có thể chỉ hiện một câu tóm tắt ngắn thay vì đầy đủ danh sách các phần đó, khiến người xác nhận mà không thấy hết những gì đang bị loại ra.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **nhanLyDo: two branches are now dead and the laEval parameter is unused**
  Người dùng thấy gì: Đây là phần mã nội bộ dùng để phân loại nguyên nhân lỗi, không hiển thị ra ngoài — không ảnh hưởng gì tới trải nghiệm hay kết quả mà người dùng nhìn thấy.
  file: `lib/nhan-canh-gay.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (lời hứa là QUAN HỆ giữa hai làn, assert chỉ đọc một phía): CK-AC2-ui không còn phân biệt được từ khi đổi luật hàng 7**
  Người dùng thấy gì: Bài kiểm tra hiện tại không thực sự chứng minh được rằng việc chuẩn hoá kết quả chỉ áp dụng cho nhóm việc do máy chạy mà không lan sang nhóm việc do người chấm bằng mắt — nếu sau này có thay đổi vô tình khiến nó lan sang, hệ thống sẽ không phát hiện và báo lỗi.
  file: `tests/scripts/ckdl-cham.test.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).