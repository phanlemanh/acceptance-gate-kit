## Trong hợp đồng

(không có phát hiện nào map được vào một AC ở vòng này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hợp đồng mốc ở `status: approved` trong khi đã có evidence-report — chính lưới trước-merge của kit gọi nó là hồ sơ «tàng hình»**
  Người dùng thấy gì: Trạng thái xét duyệt của hồ sơ phát hành chưa được cập nhật đúng bước dù việc kiểm tra đã có kết quả, nên hồ sơ có thể bị hệ thống chặn khi đưa lên nhánh chính.
  file: `_acceptance/release-2-14-0/contract.md`
  severity: high
  Đề xuất: new-contract

- **Hai usage-report.md mới đổi khuôn tiêu đề section nên `loop-health.mjs` đọc ra 0 round / 0 token — đúng dòng số mà luật (c) khai là «máy đo»**
  Người dùng thấy gì: Báo cáo chi phí chạy máy của hai vòng làm việc gần đây có thể bị công cụ tổng hợp đọc ra bằng 0, khiến số liệu chi phí hiển thị sai ở các bảng theo dõi sau này.
  file: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/usage-report.md`
  severity: high
  Đề xuất: new-contract

- **`rang-ton-dong.sh` không đọc `$@` — cờ `--chan ghim-lai` mà config truyền bị nuốt im, đúng lớp fail-open hai răng anh em vừa vá**
  Người dùng thấy gì: Nếu ai đó gõ sai hoặc bỏ sót tuỳ chọn kiểm tra khi chạy công cụ này, hệ thống vẫn báo 'đạt' như bình thường, nên có thể bỏ lọt lỗi cấu hình mà không ai biết.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Số mục Known limits của `do-tin-tram-phan-loai` nói ba con số khác nhau ở ba bề mặt trong vùng vật: 6 · 7 · 8**
  Người dùng thấy gì: Số lượng giới hạn đã biết được ghi khác nhau ở vài nơi trong tài liệu, nên người đọc có thể thấy thông tin không khớp nhau.
  file: `feature-loop/.claude-plugin/plugin.json`
  severity: medium
  Đề xuất: known-limits

- **rang-ton-dong.sh không đọc $@ — cờ `--chan ghim-lai` config truyền bị nuốt im lặng (fail-open)**
  Người dùng thấy gì: Nếu ai đó gõ sai hoặc bỏ sót tuỳ chọn kiểm tra khi chạy công cụ này, hệ thống vẫn báo 'đạt' như bình thường, nên có thể bỏ lọt lỗi cấu hình mà không ai biết.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: high
  Đề xuất: known-limits

- **Chốt AC-5 neo `moc_so` cứng vào một sha, nên con số 45 tương đối với HEAD — hồ sơ ĐÃ KÝ sẽ đỏ ở mọi lượt chạy lại**
  Người dùng thấy gì: Nếu sau này chạy lại đợt cập nhật hàng loạt, hồ sơ đã được duyệt trước đó có thể bị báo lỗi giả dù không có gì thay đổi thật, vì con số so sánh phụ thuộc vào thời điểm chạy.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **`so_stale_toan_kho: 71` chỉ được dùng để NỚI danh sách chấp nhận, không bao giờ được đối chiếu với phép đếm nào**
  Người dùng thấy gì: Một con số quan trọng dùng để nới lỏng điều kiện chấp nhận không được đối chiếu với bất kỳ phép đo nào, nên nó có thể bị gõ sai mà không ai phát hiện.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Số mục Known limits của `do-tin-tram-phan-loai` lệch ở bốn bề mặt (6 · 7 · 7 · 8), và con số sai đã vào manifest gửi tới repo tiêu thụ**
  Người dùng thấy gì: Số lượng giới hạn đã biết được ghi khác nhau ở nhiều nơi, kể cả trong bản mô tả gửi cho người dùng bên ngoài, nên người đọc có thể thấy thông tin không khớp nhau.
  file: `feature-loop/.claude-plugin/plugin.json`
  severity: medium
  Đề xuất: known-limits

- **rang-so-tang.sh cũng không có chốt tham số lạ — cùng lớp fail-open, chỉ khác bán kính**
  Người dùng thấy gì: Kiểm tra cho việc tăng số phiên bản cũng có thể bỏ qua tuỳ chọn truyền vào mà không báo lỗi, cùng kiểu rủi ro như một công cụ kiểm tra khác trong cùng bộ.
  file: `_acceptance/release-2-14-0/rang-so-tang.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — đo CHỈ DẪN thay vì ĐẦU RA: config truyền `--chan ghim-lai` mà rang-ton-dong.sh không bao giờ đọc $@**
  Người dùng thấy gì: Nếu ai đó gõ sai hoặc bỏ sót tuỳ chọn kiểm tra khi chạy, hệ thống vẫn báo 'đạt' như bình thường, nên có thể bỏ lọt lỗi cấu hình mà không ai biết.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — đối chứng dương không ghim ĐÚNG THÔNG ĐIỆP mà phép đếm phụ thuộc: lưới đổi chữ sẽ bị khai thành «hai số lệch»**
  Người dùng thấy gì: Nếu thông điệp lỗi trong công cụ kiểm tra đổi cách diễn đạt sau này, phép kiểm tra liên quan có thể báo sai loại lỗi, khiến người xem hiểu nhầm nguyên nhân.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ: `so_stale_toan_kho: 71` được khai rồi tự cho phép chính mình**
  Người dùng thấy gì: Một con số quan trọng dùng để nới lỏng điều kiện chấp nhận không hề được đối chiếu với bất kỳ phép đo nào, nên nó có thể bị gõ sai mà không ai phát hiện.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP nhưng chỉ có điểm-case: header và bảng mã thoát còn phát biểu «mọi lần con số xuất hiện» sau khi ĐỔI KHUÔN**
  Người dùng thấy gì: Phần mô tả đầu công cụ kiểm tra nói rộng hơn những gì phép kiểm tra thực sự làm, nên người đọc có thể tin nhầm là mọi trường hợp đều đã được rà soát kỹ.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có mục nào ở vòng này.)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
