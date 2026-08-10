## Trong hợp đồng

- **Khối VIỆC CỦA ANH trỏ mã eval/quyết-định không hiện ở đâu trên thẻ**
  file: `scripts/gate-card.js:507`
  severity: medium
  AC: AC-2
  Khối 👉 VIỆC CỦA ANH trên thẻ Cổng 2 ký được bảo người đọc "đọc câu hỏi E9 ở khối 'Việc chỉ mình bạn quyết được'" và trả lời «E9 Đạt», nhưng item của khối đó (dòng 470) chỉ render câu hỏi (`plainDec(d.id) || stripMd(d.q)`) — KHÔNG in mã eval. Đã tái hiện bằng fixture 2 judgment items: thân thẻ hiện hai câu hỏi không nhãn ('Given a…', 'Given d…') trong khi mẫu trả lời gộp là «E9 Đạt; E12 Đạt» — người ký không cách nào map mã vào câu hỏi, dễ chấm nhầm mục. Cùng lớp: mục «không phê: nêu mã» (dòng 511) đòi nêu mã quyết định treo, nhưng item 'Quyết định CHƯA duyệt' render qua `plDec2(e.id) || decLine(e)` và `decLine` (dòng 185) cũng không in `e.id`. Chỉ mỗi Ngoài-n được thêm prefix nhãn tra cứu (dòng 461, comment N3 nói rõ 'khối VIỆC CỦA ANH trỏ về nó'); design spec (docs/superpowers/specs/2026-08-10-khoi-viec-cua-anh-design.md dòng 36) khai 'mẫu build động từ đúng các mã ĐANG HIỆN' — mã eval và mã quyết định không 'hiện'. Test P186 không bắt được vì chỉ kiểm chuỗi 'E9' có trong khối YM, không kiểm quan hệ mã-hiện-trong-khối-được-trỏ (đúng lớp 'đo từ vựng thay vì quan hệ'). Sửa cả bản mirror plugins/acceptance-gate/scripts/gate-card.js.
  (source: bugs; rationale: AC-2 đòi rõ 'judgment theo mã eval' và dòng Trả lời mẫu 'nêu đủ các mã/nhãn đang hiện' — finding cho thấy mã eval không hiện ở mục judgment trên thẻ, vi phạm trực tiếp câu chữ AC-2.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Mutant-leg P185/P186/P186b không kiểm mutant-phải-chạy-được — script chết vẫn được đếm là 'mutant bị bắt'**
  Người dùng thấy gì: Bộ kiểm tra tự động của kit có thể báo 'đạt' ngay cả khi chính phép kiểm tra đó bị hỏng ngầm, khiến các lỗi thật phát sinh sau này không bị phát hiện — không ảnh hưởng người dùng ngay lúc này nhưng làm giảm độ tin cậy của các lần kiểm tra kế tiếp.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Ba chân mutant P185/P186/P186b không kiểm mutant-chạy-được — crash cho xanh giả**
  Người dùng thấy gì: Bộ kiểm tra tự động của kit có thể báo 'đạt' ngay cả khi chính phép kiểm tra đó bị hỏng ngầm, khiến các lỗi thật phát sinh sau này không bị phát hiện — không ảnh hưởng người dùng ngay lúc này nhưng làm giảm độ tin cậy của các lần kiểm tra kế tiếp.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ (shape 3): P188 dùng containment `clause in t` trong khi lời hứa là MỌI bản chép khớp từng ký tự**
  Người dùng thấy gì: Phép kiểm tra tự động cho việc đồng bộ nội dung giữa các bản sao có thể bỏ sót trường hợp một bản sao bị lệch nội dung nằm cạnh một bản còn đúng, nên một sai lệch nhỏ có thể lọt qua mà không bị cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' trong khi lời hứa là QUAN HỆ (shape 3): P187 ba nhánh verdict assert y hệt nhau, không ghim câu máy-đang-làm-gì-tiếp ĐÚNG TỪNG verdict**
  Người dùng thấy gì: Phép kiểm tra tự động không phân biệt được câu hướng dẫn 'bước tiếp theo' có đúng cho từng loại kết quả (bị từ chối / bị chặn / kết quả lạ) hay không, nên nếu sau này thông điệp bị nhầm giữa các trường hợp, việc kiểm tra có thể không phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Fixture không round-trip trong lần chạy đo (shape 2): E7 chấm judge trên 3 snapshot HTML đóng băng, không gì ghim chúng vào gate-card.js của cây đang kiểm**
  Người dùng thấy gì: Phần chấm bằng người-máy-mô-phỏng cho một số nội dung đang dùng ảnh chụp cũ đã đóng băng thay vì nội dung mới nhất do phần mềm tạo ra ngay lúc kiểm tra, nên nếu phần mềm đổi cách hiển thị sau này, phép kiểm tra vẫn có thể báo 'đạt' dù thực tế đã sai.
  file: `_acceptance/khoi-viec-cua-anh/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).