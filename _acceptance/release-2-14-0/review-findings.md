## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **rang-ton-dong.sh nuốt im cờ `--chan ghim-lai` mà config truyền — fail-open đúng lớp mà rang-p200.sh vừa vá**
  Người dùng thấy gì: Bước kiểm 'đã ghim lại đúng số' có thể vẫn báo đạt (xanh) ngay cả khi tham số cấu hình truyền vào bị gõ sai hoặc bị rơi mất, khiến người xem báo cáo tin nhầm rằng bước kiểm đã chạy đúng theo cấu hình trong khi thực tế nó bỏ qua tham số đó.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: high
  Đề xuất: known-limits

- **Số mục known-limits của `do-tin-tram-phan-loai` nói BA con số khác nhau ở ba tệp: 6 · 7 · 8**
  Người dùng thấy gì: Tài liệu phát hành ghi số lượng hạn chế đã biết của một vòng làm việc không khớp nhau giữa các nơi (khi thì 6, khi thì 7, khi thì 8), khiến người đọc không biết nên tin theo con số nào.
  file: `_acceptance/release-2-14-0/contract.md`
  severity: high
  Đề xuất: known-limits

- **opportunity.md mới thêm chép «42 hồ sơ» trong khi cùng cửa sổ đo được 45 (và 71 toàn kho)**
  Người dùng thấy gì: Một tài liệu nội bộ ghi số hồ sơ đang tồn đọng là 42, trong khi số đo thực tế tại cùng thời điểm là 45 (và 71 tính toàn bộ kho); ai dựa vào tài liệu này sẽ dùng nhầm số cũ.
  file: `_acceptance/mot-nguon-tai-gui-triage/opportunity.md`
  severity: medium
  Đề xuất: known-limits

- **Hai răng VIẾT MỚI thiếu «dấu bản răng» mà hai răng CHÉP đều có — output ghim trong evidence-report không phân biệt được bản**
  Người dùng thấy gì: Hai công cụ kiểm tra mới không ghi lại phiên bản của chính mình trong kết quả xuất ra, nên nếu sau này công cụ được sửa, báo cáo cũ và mới có thể trông giống hệt nhau dù chạy bằng bản khác nhau, gây khó khi cần tra lại đúng bản đã chạy.
  file: `_acceptance/release-2-14-0/rang-so-tang.sh`
  severity: medium
  Đề xuất: known-limits

- **rang-ton-dong.sh không đọc $@ và không có chốt cờ lạ — `--chan ghim-lai` mà config truyền bị nuốt im lặng**
  Người dùng thấy gì: Bước kiểm 'đã ghim lại đúng số' chấp nhận bất kỳ giá trị cấu hình nào được truyền vào, kể cả giá trị sai, mà không báo lỗi — nên một lần gõ nhầm cấu hình sẽ không bị phát hiện và báo cáo vẫn hiện đạt.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Số mục known-limits của vòng do-tin-tram-phan-loai lệch nhau ở ba bề mặt: contract nói 6, CHANGELOG nói 7, nguồn thật là 8**
  Người dùng thấy gì: Số lượng hạn chế đã biết của cùng một vòng làm việc được ghi khác nhau ở tài liệu phát hành (6) và ở nhật ký thay đổi (7), trong khi nguồn dữ liệu gốc thực có 8 mục — không nơi nào khớp với con số thật.
  file: `_acceptance/release-2-14-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA) — rang-ton-dong.sh không đọc $@, cờ `--chan ghim-lai` config truyền là trang trí**
  Người dùng thấy gì: Cấu hình khai báo tham số cho bước kiểm 'đã ghim lại đúng số', nhưng bước kiểm đó thực ra không đọc tham số ấy — nên tham số chỉ mang tính trang trí, không bảo vệ được điều người đọc tưởng nó đang bảo vệ.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (assert «chuỗi có mặt» thay vì QUAN HỆ giữa các giá trị) — `so_stale_toan_kho: 71` chỉ dùng để NỚI allowlist, không hề được đo**
  Người dùng thấy gì: Trong cặp số mà hồ sơ khai (số trong cửa sổ và số toàn kho), chỉ số thứ nhất thực sự được đối chiếu với số đo thật; số thứ hai không hề được kiểm chứng, chỉ dùng để nới điều kiện cho qua — nên nếu số thứ hai sai, bước kiểm vẫn báo đạt.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case) — header và bảng mã thoát của rang-ton-dong.sh vẫn phát biểu toàn xưng sau khi ĐỔI KHUÔN thu hẹp phép đo**
  Người dùng thấy gì: Phần mô tả của bước kiểm 'đã ghim lại đúng số' vẫn tuyên bố nó rà soát toàn bộ tài liệu, dù sau một lần chỉnh sửa gần đây nó chỉ còn rà những dòng viết theo đúng một khuôn cụ thể — mô tả rộng hơn thực tế công cụ làm, dễ khiến người đọc tin nhầm phạm vi kiểm tra.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (đối chứng dương không ghim ĐÚNG THÔNG ĐIỆP mà phép đếm phụ thuộc) — chốt (c) của rang-ton-dong.sh ghim một mẫu khác hẳn mẫu đếm**
  Người dùng thấy gì: Bằng chứng dùng để chứng minh bước kiểm 'đã ghim lại đúng số' hoạt động đúng lại không thực sự khớp với cách bước kiểm đó tính ra kết quả cuối; nếu thông điệp mà công cụ dựa vào để đo bị đổi, bước kiểm có thể âm thầm báo đạt thay vì báo lỗi.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (cùng lớp cờ fail-open) — rang-so-tang.sh cũng không có chốt tham số**
  Người dùng thấy gì: Một bước đo khác (kiểm tra số phiên bản có tăng) cũng chấp nhận bất kỳ tham số nào được truyền vào mà không báo lỗi; hiện chưa gây hậu quả vì chưa có tham số nào được truyền, nhưng cùng dạng hở như đã nêu ở các mục trên.
  file: `_acceptance/release-2-14-0/rang-so-tang.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).