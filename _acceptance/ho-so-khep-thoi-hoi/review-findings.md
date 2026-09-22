## Trong hợp đồng

(không có phát hiện nào được ánh xạ vào một AC của hợp đồng trong vòng này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Gate-card dung rieng mot dinh nghia «da khep» cho thuc-te, lech voi vi tu hoSoDaKhep va mo lo fail-open**
  Người dùng thấy gì: Thẻ hồ sơ cho người ký có thể báo 'đã xong, hết câu hỏi' ngay cả khi hồ sơ đó thực ra còn thiếu thông tin quan sát, khiến người xem không thấy câu hỏi cần trả lời.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **Bang nguon duy nhat EVIDENCE-XANH-SACH-BLOCK khong khai ve moi cua dieu kien «Ngoai hop dong»**
  Người dùng thấy gì: Tài liệu hướng dẫn cách viết báo cáo bằng chứng chưa nói rõ một điều kiện mới, có thể khiến người soạn báo cáo hiểu nhầm khi nào báo cáo được coi là đạt.
  file: `skills/acceptance/references/evidence-report-template.md`
  severity: medium
  Đề xuất: known-limits

- **gate-card treats a record as closed from the scanner's cell name alone, even when the observation line is missing or incomplete**
  Người dùng thấy gì: Thẻ hồ sơ cho người ký có thể ẩn mất câu hỏi cần trả lời khi một hồ sơ chưa có đủ thông tin quan sát, vì hệ thống đọc nhầm nó là đã xong.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **The new `ctx` signature of xanhSach breaks mutant 2 in the signed record lan-v-khong-phai-cho-ky (its evals list khong-can-nguoi.mjs in paths)**
  Người dùng thấy gì: Một tính năng khác đã được duyệt trước đây (lan-v-khong-phai-cho-ky) có thể báo lỗi giả khi chạy lại kiểm tra định kỳ, do thay đổi lần này chưa cập nhật hết những nơi cũ còn dùng cách gọi kiểu trước.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh`
  severity: high
  Đề xuất: known-limits

- **The «Ngoài hợp đồng» check fails open when review-findings.md exists but cannot be read, despite the comment claiming fail-closed**
  Người dùng thấy gì: Nếu tệp ghi các phát hiện ngoài hợp đồng gặp lỗi đọc bất thường (không phải do thiếu tệp), hệ thống có thể coi nhầm là 'không có phát hiện nào' và cho qua thay vì báo cần người kiểm tra.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion, no pinned message): HK-AC4-bash accepts a VIOLATION raised for any reason on rows 1, 2 and 6**
  Người dùng thấy gì: Một phần bài kiểm thử tự động chỉ xác nhận 'có báo lỗi' mà chưa xác nhận 'báo đúng lý do', nên trong tương lai có thể bỏ sót trường hợp hệ thống báo lỗi nhưng sai nguyên nhân.
  file: `tests/scripts/hskt.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (asserting set membership when the promise is a relation): HK-AC5-im explains a change by slug membership alone, ignoring its direction**
  Người dùng thấy gì: Một phần bài kiểm thử tự động kiểm tra thay đổi hồ sơ chỉ nhìn xem có đổi hay không, chưa nhìn đổi theo chiều nào, nên có thể bỏ sót một số thay đổi sai chiều trong tương lai.
  file: `tests/scripts/hskt.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 1 (measuring a stored file instead of output from this run): HK-AC6-baseline reads the committed routing-baseline.txt instead of regenerating it with gate-card**
  Người dùng thấy gì: Một phần bài kiểm thử tự động đang so sánh với một tệp mẫu đã lưu sẵn thay vì tạo lại từ công cụ hiện tại, nên nếu công cụ có lỗi mới, bài kiểm thử này có thể không phát hiện ra.
  file: `tests/scripts/hskt.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 6 (measuring something other than the tree under test): NS-AC9-cu now compares two frozen historical snapshots and no longer runs the scanner and map on the current tree**
  Người dùng thấy gì: Một bài kiểm thử liên quan không còn chạy trên mã nguồn hiện tại mà chỉ so hai bản cũ đã đóng băng, nên một lỗi mới phát sinh trong mã nguồn hiện tại có thể không bị bài kiểm thử này phát hiện.
  file: `tests/scripts/ntr-trang-thai.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims a class sweep but the sweep has a hole): HK-AC8 extracts callers of the xanh-sạch rule only from .mjs/.cjs/.js files, so the bash caller in pre-merge-check.sh never enters the matrix**
  Người dùng thấy gì: Danh sách tự động 'mọi nơi gọi quy tắc xanh-sạch' đang chỉ tìm trong tệp JavaScript nên bỏ sót nơi gọi bằng bash, khiến nơi đó không được đưa vào bộ kiểm thử chung.
  file: `tests/scripts/hskt.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (skills/acceptance/references/evidence-report-template.md, _acceptance/lan-v-khong-phai-cho-ky/rang.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
