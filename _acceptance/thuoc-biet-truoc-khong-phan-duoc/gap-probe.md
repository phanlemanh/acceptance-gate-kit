---
slug: thuoc-biet-truoc-khong-phan-duoc
at: 2026-10-01T02:30:00Z
verdict: findings
p0: 0
p1: 1
p2: 4
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E5 chạy nhóm JI12 và đột biến ban-sao-khuon nhưng bảng design §3 chỉ khai JI7–JI11; JI12 chỉ dò mảnh khuôn «hỏi diff», không dò khuôn «bảo chạy lệnh»; thư mục quét bỏ sót lib/ skills/ hooks/ | Một bản sao khuôn «bảo chạy lệnh» dán vào scripts/eval-coverage-lint.js (đúng đường W9 đã hẹn ngưỡng) hoặc vào lib/ để JI12 xanh — lời hứa «đúng một module» không được đo | JI12 dò cả hai mảnh trên mọi thư mục nguồn; thêm đột biến dán khuôn lệnh vào lint; bảng design ghi JI12 + hai đột biến | fixed: design §3 thêm JI12, ban-sao-khuon, ban-sao-lenh, nguyên văn phép thay ở rang.sh là một nguồn; JI12 dò hai mảnh trên feature-loop scripts lib hooks skills commands docs/findings/assets; nhóm `--only` không tồn tại đã đỏ có tên sẵn trong harness |
| P2 | evals | JI11 chỉ có đột biến gỡ vế «KHONG doc diff»; assert là chuỗi-có-mặt trên toàn tệp chứ không trên lời giao việc thật | Ai đó nới hội đồng cho đọc thêm tệp mà giữ «KHONG doc diff», hoặc dời chuỗi vào chú thích — JI11 vẫn xanh | Đột biến thứ hai gỡ vế «CHI duoc doc…»; assert trên dòng mẫu dựng lời giao việc, không trên chú thích | fixed: thêm noi-hoi-dong-2; JI11 chỉ nhận dòng chứa mẫu (có backtick, không mở đầu bằng chú thích) — đột biến dời-vào-chú-thích không dựng, bộ lọc dòng là chốt |
| P2 | evals | Ma trận E2 bỏ biến thể «Chạy `…`»; chiều đỏ duy nhất bo-rang giết mọi dạng cùng lúc | Khuôn thiếu nhánh «Chạy `…`» mà E2 vẫn xanh | Ma trận bốn hàng có tên; mỗi hàng một đột biến gỡ đúng một nhánh | fixed: JI8 bốn hàng có tên (Run · Chạy · grep -n · git -C). deferred: đột biến từng nhánh — khuôn chép nguyên văn từ bản đã đo, bốn hàng có tên đã bắt nhánh thiếu |
| P2 | design | Đột biến khong-gop chỉ đỏ được nếu bộ đọc trả xuống dòng thật cho khối gấp; tiền đề chưa được đo trên đường s4-args | Bộ đọc đã gấp khối thì khong-gop là đột biến tương đương, chân E1 đỏ trên bản cài đúng | JI7 assert tiền đề trên fixture YAML thật đọc qua parseEvals | fixed: JI7 thêm ca tiền đề «parseEvals trả khối gấp còn xuống dòng» (đọc mã lib/eval-yaml.cjs: khối nối bằng \n); design §3 ghi tiền đề |
| P2 | contract | Design hứa ô `status: not-run` không bị chặn mà không AC nào đo; round-trip so tập trong khi s4-args dừng ở eval vi phạm đầu tiên | Một judgment tự khai not-run hỏi diff chặn trọn lượt sinh args; fixture hai vi phạm làm round-trip đỏ oan | Thêm vế AC cho ô not-run; định nghĩa round-trip theo từng hồ sơ | rejected (một nửa): bộ lọc not-run của s4-args chỉ loại ô MÁY (machineEvalIdsSkipped) — judgment tự khai not-run VẪN tới hội đồng, nên chặn nó là đúng; câu sai trong design đã sửa. fixed (nửa kia): design ghi s4-args dừng ở vi phạm đầu tiên; fixture JI12 mỗi hồ sơ một vi phạm, so theo hồ sơ |
