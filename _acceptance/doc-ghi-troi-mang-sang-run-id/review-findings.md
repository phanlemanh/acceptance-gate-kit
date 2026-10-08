# Review findings: doc-ghi-troi-mang-sang-run-id (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bộ dò run_id rỗng mới dùng định nghĩa «rỗng» khác với bộ đọc nó bổ sung và khác bên viết, nên một khối bị bỏ qua lặng vẫn không được gọi tên**
  Người dùng thấy gì: Nếu một báo cáo ghi mã chạy theo một dạng nháy lồng lạ, hệ thống vẫn coi như có mã và không nhắc người đọc rằng mã đó thực ra trống. Các dạng thường gặp ở kho tiêu thụ đều đã được nhắc.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **NHAN_LUOT_RE là bản chép tay nhóm nhãn của OOC_TITLE_RE, nằm ngoài khối marker nên DG2 không giữ được**
  Người dùng thấy gì: Hôm nay thẻ duyệt hiển thị đúng. Nhưng nếu sau này có người mở rộng cách nhận nhãn lượt ở một chỗ mà quên chỗ kia, một mục ngoài hợp đồng có thể lại hiện hai lần trên thẻ mà không có kiểm tra nào báo.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **A carried eval with run_id `""` is now dropped one at a time inside the workflow, which splits the atomic pair of a cross-layer AC**
  Người dùng thấy gì: Với một tiêu chí cần hai phép kiểm đi cùng nhau, nếu báo cáo lượt trước do bản cũ viết và chỉ một phép bị mất mã chạy, hệ thống chạy lại phép đó còn phép kia giữ kết quả cũ. Kết quả có thể ghép từ hai lượt khác nhau mà không ai được báo.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét LỚP «mọi dạng nhãn bộ đọc thẻ nhận» nhưng ma trận DG3c viết tay riêng và thiếu `(r?)`**
  Người dùng thấy gì: Bộ kiểm tra chưa thử dạng nhãn lượt chưa rõ số. Nếu sau này cách nhận dạng nhãn đó bị hỏng, mục tương ứng có thể hiện hai lần trên thẻ duyệt mà kiểm tra vẫn xanh.
  file: `tests/workflows/doc-ghi-troi.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
