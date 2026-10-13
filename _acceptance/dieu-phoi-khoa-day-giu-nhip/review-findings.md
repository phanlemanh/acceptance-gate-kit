## Trong hợp đồng

- **Hình dạng 5 — ma trận tự đếm chính nó: «10 hàng» của E2 không được ghim ở đâu**
  file: tests/dieu-phoi/on-dinh-r2.test.mjs:816
  severity: medium
  AC: AC-2
  source: measurement
  detail: E2 hứa ma trận MA_TRAN_VIEC_NEN viết sẵn 10 hàng (2 người giữ × 5 nguồn nhịp). Hai phép đếm trong code đều là hằng đúng theo cấu tạo: DP8-09 viec-nen có `assert.equal(ra.length, MA_TRAN_VIEC_NEN.length)`, mà `ra` được push đúng một lần cho mỗi hàng của chính MA_TRAN_VIEC_NEN. DP10-02 có `assert.equal(ket.length, 2 * n)` với `n = NGUON_NHIP.length`, trong khi MA_TRAN_VIEC_NEN là flatMap 2 × NGUON_NHIP. Con số 10 chỉ được in ra (`số hàng: …`), không có chỗ nào so với hằng 10. Bỏ một hàng khỏi NGUON_NHIP (ví dụ hàng «worktree khác chạm nhịp khoá», tức đối chứng chamNhip chỉ chạm khoá của chu.worktree) thì ma trận còn 8 hàng mà mọi assert vẫn xanh. Đây là lời tuyên «ma trận toàn phần» nhưng số assert không bị buộc vào số phần tử viết trước (mẫu P105).
  rationale: AC-2 đòi đích danh «số hàng in ra bằng 10» và «đủ mười hàng»; con số 10 không được so với hằng nào, nên bỏ một hàng mà phép đo vẫn xanh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 — đối chứng đầu vào «vắng nhịp phiên» là kiểm âm tính một mình, không có đối chứng dương**
  Người dùng thấy gì: Bước kiểm «dãy chưa từng gọi công cụ nào» có thể luôn báo ổn dù bản sửa có vô tình làm dãy bị coi là đang hoạt động. Khi đó một lỗi kiểu này có thể lọt qua mà không ai biết.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — lời hứa tài liệu DP10-05 là một quan hệ («khoá của dãy cũng tính nhịp khoá như việc nền») nhưng chỉ đo bằng có/vắng chuỗi**
  Người dùng thấy gì: Tài liệu hướng dẫn có thể viết ngược với hành vi thật của hệ thống mà bước kiểm vẫn không phát hiện, nếu câu chữ không trùng đúng cụm cũ. Người đọc tài liệu có thể bị dặn sai về việc dãy chạy lượt dài có được giữ khoá hay không.
  file: `tests/dieu-phoi/on-dinh-r2.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
