# Review findings: can-cu-s1-chay-moi-kho (round 2)

## Trong hợp đồng

Không có phát hiện nào trong hợp đồng ở lượt này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A comment above KK-6 so-that still says the check counts through the classifier, which it no longer does**
  Người dùng thấy gì: Một dòng ghi chú trong bộ kiểm tra còn nói ngược với cách kiểm tra chạy thật. Người dùng không thấy gì khác; chỉ người sửa bộ kiểm tra sau này có thể đọc nhầm rồi đưa lại lỗi cũ vào.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: low
  Đề xuất: known-limits

- **KK-6 so-that counts red ledger rows the card correctly leaves out, so rewording any quoted file breaks the suite and blames the card**
  Người dùng thấy gì: Sau này, nếu ai đó sửa chữ trong một tài liệu mà bước thiết kế đã trích dẫn, bộ kiểm tra sẽ báo đỏ và đổ lỗi cho thẻ duyệt dù thẻ vẫn in đúng. Người làm việc sẽ mất thời gian đi tìm lỗi không có thật.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **KK-6-do so-that has no positive control on the copied card and does not pin which row is missing; a copy that loses the classifier also passes**
  Người dùng thấy gì: Phép thử kiểm tra việc thẻ có thiếu dòng hay không có thể báo xanh dù thực tế nó chưa chạy đúng, nên màu xanh ở đó tin được kém hơn vẻ ngoài. Thẻ người dùng thấy không bị ảnh hưởng ngay.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: low
  Đề xuất: known-limits

- **KK-8: đường «lịch sử» (sau khi gộp) vẫn lấy gốc = merge-base hai cha, tức đúng luật mà commit 3f86664c vừa thay ở đường chưa gộp; gộp PR này trước A2 thì KK-8 đỏ mãi trên main (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bản sửa này được đưa vào nhánh chính trước bản sửa nền mà nó xếp chồng lên, một phép kiểm thẻ trên hồ sơ cũ sẽ báo đỏ mãi dù thẻ không hỏng thật. Người duyệt cần biết thứ tự gộp quan trọng, hoặc ghi rõ đây là hạn chế đã biết.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **E9 (ui-check) khai paths chỉ gate-card.js, trong khi bước dựng thẻ chạy bộ sinh hồ sơ trong can-cu-s1.ca.mjs (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ở lượt chấm sau, nếu chỉ chữ trong dữ liệu mẫu của thẻ bị đổi, hệ thống có thể dùng lại ảnh chụp cũ thay vì chụp lại, nên người duyệt có thể xem một ảnh không còn khớp với nội dung thẻ.
  file: `_acceptance/can-cu-s1-chay-moi-kho/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **KK-8 picks the wrong starting commit (and can pass falsely) when the latest merge on the branch is not a merge from upstream (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi làm việc trên hai máy, phép kiểm xem thẻ của hồ sơ cũ có bị đổi không có thể so nhầm với chính bản mới và báo xanh mà không đo gì. Người duyệt sẽ tin nhầm rằng hồ sơ cũ không đổi.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình 5 (tuyên MỌI lệnh nhưng chiều đỏ chỉ có một điểm): mũi tiêm KK-1-do chỉ đổi lệnh thứ nhất trong hai lệnh (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm chỉ chứng minh được rằng lời dặn kiểu cũ ở một trong hai lệnh sẽ bị bắt. Nếu lệnh thứ hai quay lại dùng đường cũ thì chưa chắc có phép kiểm nào báo đỏ.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình 5 (tuyên quét LỚP, ma trận không phủ phần tử của lớp): KK-4-do không có ca nào cho `sh` hay dạng có dấu nháy (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ quét lời gọi đường tương đối có thể không bắt được lời gọi viết theo cách khác (dùng sh hoặc có dấu nháy), nên một lời dặn sai kiểu đó vẫn lọt qua mà không báo đỏ.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
