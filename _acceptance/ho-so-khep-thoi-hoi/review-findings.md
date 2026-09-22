## Trong hợp đồng

(không có phát hiện nào map được vào một AC ở vòng này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E9 expected describes a four-record fixture, but the test builds only three**
    Người dùng thấy gì: Mô tả bộ kiểm nói dùng bốn hồ sơ mẫu, nhưng thực tế nó chỉ dựng ba — người đọc báo cáo có thể tưởng nhầm có thêm một phép kiểm không tồn tại.
    file: `_acceptance/ho-so-khep-thoi-hoi/evals.yaml`
    severity: low
    Đề xuất: known-limits

- **gate-card bỏ qua cờ thuc-te-vang / thuc-te-thieu-ve của bộ quét: thẻ mời «ký hay trả» nhưng không nói dòng quan sát bị vắng hay thiếu vế**
    Người dùng thấy gì: Khi một hồ sơ có dữ liệu thực tế bị thiếu hoặc vắng, thẻ chỉ báo chung chung là cần người ký hay trả lại mà không nói rõ lý do, nên người ký có thể ký duyệt rồi vẫn bị chặn lại ở bước kiểm sau vì đúng lỗi đó.
    file: `scripts/gate-card.js`
    severity: medium
    Đề xuất: known-limits

- **Mô tả E9 khai kho fixture bốn hồ sơ (kể cả «sống»), nhưng khoThucTe chỉ dựng ba**
    Người dùng thấy gì: Mô tả bộ kiểm nói có bốn hồ sơ mẫu bao gồm một hồ sơ đang hoạt động bình thường, nhưng hồ sơ đó không thực sự được tạo ra khi kiểm tra chạy, nên tài liệu không khớp với những gì thực sự được kiểm.
    file: `_acceptance/ho-so-khep-thoi-hoi/evals.yaml`
    severity: low
    Đề xuất: known-limits

- **Bang nguon duy nhat EVIDENCE-XANH-SACH-BLOCK khong khai ve moi cua dieu kien «Ngoai hop dong» (r1)**
    Người dùng thấy gì: Tài liệu hướng dẫn cách viết báo cáo bằng chứng chưa nói rõ một điều kiện mới, có thể khiến người soạn báo cáo hiểu nhầm khi nào báo cáo được coi là đạt.
    file: `skills/acceptance/references/evidence-report-template.md`
    severity: medium
    Đề xuất: known-limits

- **The new `ctx` signature of xanhSach breaks mutant 2 in the signed record lan-v-khong-phai-cho-ky (its evals list khong-can-nguoi.mjs in paths) (r1)**
    Người dùng thấy gì: Một tính năng khác đã được duyệt trước đây (lan-v-khong-phai-cho-ky) có thể báo lỗi giả khi chạy lại kiểm tra định kỳ, do thay đổi lần này chưa cập nhật hết những nơi cũ còn dùng cách gọi kiểu trước.
    file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh`
    severity: high
    Đề xuất: known-limits

- **The «Ngoài hợp đồng» check fails open when review-findings.md exists but cannot be read, despite the comment claiming fail-closed (r1)**
    Người dùng thấy gì: Nếu tệp ghi các phát hiện ngoài hợp đồng gặp lỗi đọc bất thường (không phải do thiếu tệp), hệ thống có thể coi nhầm là 'không có phát hiện nào' và cho qua thay vì báo cần người kiểm tra.
    file: `scripts/pre-merge-check.sh`
    severity: medium
    Đề xuất: known-limits

- **Shape 6 (measuring something other than the tree under test): NS-AC9-cu now compares two frozen historical snapshots and no longer runs the scanner and map on the current tree (r1)**
    Người dùng thấy gì: Một bài kiểm thử liên quan không còn chạy trên mã nguồn hiện tại mà chỉ so hai bản cũ đã đóng băng, nên một lỗi mới phát sinh trong mã nguồn hiện tại có thể không bị bài kiểm thử này phát hiện.
    file: `tests/scripts/ntr-trang-thai.test.mjs`
    severity: low
    Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ho-so-khep-thoi-hoi/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
