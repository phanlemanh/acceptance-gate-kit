## Trong hợp đồng

(Không có phát hiện nào map được vào một AC của hợp đồng ở round này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Thẻ Cổng 1 không còn đọc bảng gap-probe 6 cột đời cũ dù đọc được trước đây; phát hiện bị bỏ và cờ báo sai lý do**
    Người dùng thấy gì: Thẻ quyết định (Gate 1) có thể im lặng bỏ sót các phát hiện phản biện quan trọng — kể cả loại nghiêm trọng nhất — nếu hồ sơ dự án dùng định dạng bảng cũ hơn, và còn hiện một lý do sai khiến người xem khó nhận ra vấn đề thật.
    file: `scripts/gate-card.js`
    severity: high
    Đề xuất: new-contract

- **MACHINE_SCHEMA.outputTail description still says '~10 dong cuoi output lien quan', which contradicts the new rule to keep the __EXIT= line verbatim**
    Người dùng thấy gì: Nếu mô hình làm theo đúng mô tả hướng dẫn hiện tại thay vì bám sát yêu cầu thực, một lượt chấm thực ra đã đạt có thể bị báo nhầm là bị chặn, khiến người phải xem lại dù kết quả không có lỗi thật.
    file: `feature-loop/workflows/acceptance-verify.js`
    severity: low
    Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính đứng một mình): phép E7 untraceable() không còn chiều đỏ nào sau khi gỡ assert bad_mut**
    Người dùng thấy gì: Một phép kiểm tự động dùng để phát hiện nội dung bịa đặt (ví dụ tên vì sao không có thật) trong báo cáo có thể không còn khả năng bắt lỗi đó, nhưng vẫn luôn báo "đạt", nên lỗi loại này có thể lọt qua mà không ai hay biết.
    file: `tests/plugins/run-tests.sh`
    severity: high
    Đề xuất: new-contract

- **Hình dạng 4 (assertion âm tính đứng một mình): CK-AC6-dot-bien xanh cả khi bản sao gate-card chết**
    Người dùng thấy gì: Một trong các bài kiểm tự động dùng để xác nhận thẻ quyết định hiện đủ các mục "sẽ không làm" có thể báo "đạt" ngay cả khi phần mã đang được kiểm không chạy được, khiến người khó tin cậy hoàn toàn vào kết quả đạt của bài kiểm đó.
    file: `tests/scripts/ckdl-the.test.mjs`
    severity: high
    Đề xuất: new-contract

- **Hình dạng 6 (thước gắn vào đường dẫn sai): paths của E1–E9 trỏ tới tests/scripts/ckdl.test.mjs, tệp không tồn tại**
    Người dùng thấy gì: Ở những lượt chấm lại sau khi sửa lỗi, hệ thống có thể lầm tưởng một số phần đã kiểm không cần chạy lại, nên giữ nguyên kết quả "đạt" cũ dù mã liên quan vừa thay đổi, làm giảm độ tin cậy của lượt chấm lại đó.
    file: `_acceptance/cham-khong-tu-dot-luot/evals.yaml`
    severity: medium
    Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính đứng một mình): CK-AC8-dot-bien không kiểm bản sao wf-usage đã in ra hàng nào**
    Người dùng thấy gì: Một bài kiểm tự động cho tính năng gộp nhãn chi phí có thể không phát hiện được nếu phần mã liên quan ngừng chạy đúng, dù hiện tại nó vẫn đang hoạt động bình thường.
    file: `tests/scripts/ckdl-do.test.mjs`
    severity: low
    Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/6 lỗi rơi vào file không bộ đo nào phủ (tests/plugins/run-tests.sh, tests/scripts/ckdl-the.test.mjs, _acceptance/cham-khong-tu-dot-luot/evals.yaml, tests/scripts/ckdl-do.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
