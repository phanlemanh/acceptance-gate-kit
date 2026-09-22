## Trong hợp đồng

(không có phát hiện nào ánh xạ được vào một AC ở round này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **HK-AC5-note chọn hồ sơ bằng regex viết tay, không dùng bộ đọc của lưới, trong khi chú thích nói «đúng khoá lưới đọc»**
    Người dùng thấy gì: Nếu một hồ sơ đã ghi trạng thái veto theo cách viết khác thường (chữ hoa, có ngoặc kép, hoặc kèm chú thích), bài kiểm tra tốc độ nhanh có thể bỏ sót hồ sơ đó — khiến việc xác minh tự động không thực sự chạy trên đúng hồ sơ cần kiểm, dù hôm nay chưa có hồ sơ nào viết như vậy.
    file: `tests/scripts/hskt.test.mjs`
    severity: medium
    Đề xuất: known-limits

- **Vế HEAD của HK-AC5-note chỉ khẳng định âm tính, thiếu đối chứng dương rằng lưới HEAD thật sự chạy tới dòng NOTE trên bản sao**
    Người dùng thấy gì: Nếu bước kiểm tra tự động bị thoát sớm hoặc gặp lỗi ở đúng công đoạn kiểm hồ sơ đã đóng, bài kiểm có thể vẫn báo "ổn" dù thực ra nó chưa chạy xong việc cần chạy — tạo cảm giác yên tâm giả trong khi chưa thật sự xác nhận được điều đó.
    file: `tests/scripts/hskt.test.mjs`
    severity: low
    Đề xuất: known-limits

- **Hình dạng 4, assertion chỉ âm tính: HK-AC5-note vẫn xanh khi HEAD không in dòng NOTE nào**
    Người dùng thấy gì: Nếu bước kiểm tra tự động bị thoát sớm hoặc gặp lỗi ở đúng công đoạn kiểm hồ sơ đã đóng, bài kiểm có thể vẫn báo "ổn" dù thực ra nó chưa chạy xong việc cần chạy — tạo cảm giác yên tâm giả trong khi chưa thật sự xác nhận được điều đó.
    file: `tests/scripts/hskt.test.mjs`
    severity: medium
    Đề xuất: known-limits

- **Hình dạng 2, bên đọc bị viết lại bằng tay: bộ lọc chép hồ sơ dùng regex riêng dù chú thích nói «đúng khoá lưới đọc»**
    Người dùng thấy gì: Nếu một hồ sơ đã ghi trạng thái veto theo cách viết khác thường (chữ hoa, có ngoặc kép, hoặc kèm chú thích), bài kiểm tra tốc độ nhanh có thể bỏ sót hồ sơ đó — khiến việc xác minh tự động không thực sự chạy trên đúng hồ sơ cần kiểm, dù hôm nay chưa có hồ sơ nào viết như vậy.
    file: `tests/scripts/hskt.test.mjs`
    severity: low
    Đề xuất: known-limits

- **Gate-card dung rieng mot dinh nghia «da khep» cho thuc-te, lech voi vi tu hoSoDaKhep va mo lo fail-open (r1)**
    Người dùng thấy gì: Thẻ hồ sơ cho người ký có thể báo 'đã xong, hết câu hỏi' ngay cả khi hồ sơ đó thực ra còn thiếu thông tin quan sát, khiến người xem không thấy câu hỏi cần trả lời.
    file: `scripts/gate-card.js`
    severity: high
    Đề xuất: new-contract

- **Bang nguon duy nhat EVIDENCE-XANH-SACH-BLOCK khong khai ve moi cua dieu kien «Ngoai hop dong» (r1)**
    Người dùng thấy gì: Tài liệu hướng dẫn cách viết báo cáo bằng chứng chưa nói rõ một điều kiện mới, có thể khiến người soạn báo cáo hiểu nhầm khi nào báo cáo được coi là đạt.
    file: `skills/acceptance/references/evidence-report-template.md`
    severity: medium
    Đề xuất: known-limits

- **gate-card treats a record as closed from the scanner's cell name alone, even when the observation line is missing or incomplete (r1)**
    Người dùng thấy gì: Thẻ hồ sơ cho người ký có thể ẩn mất câu hỏi cần trả lời khi một hồ sơ chưa có đủ thông tin quan sát, vì hệ thống đọc nhầm nó là đã xong.
    file: `scripts/gate-card.js`
    severity: high
    Đề xuất: new-contract

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

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).