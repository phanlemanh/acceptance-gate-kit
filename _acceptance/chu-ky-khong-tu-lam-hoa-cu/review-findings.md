# Review Findings: chu-ky-khong-tu-lam-hoa-cu (round 3)

## Trong hợp đồng

### Hình dạng 1/3: assert số đo «1 ph 45 s» quét TRỌN tệp trong khi lời hứa là «bước 6b nêu số đo của CHÍNH NÓ»
- file: `tests/scripts/routing-baseline-t1.test.mjs:207`
- severity: low
- AC: AC-3
- source: measurement

Dòng 203–206 làm đúng nghi thức: neo đoạn từ `**7a-bis — bản ghi mốc` tới `**7b — làn máy TRƯỚC chữ ký`, kiểm neo trước rồi mới `assert.doesNotMatch(so.slice(a,b), /vài giây/)`. Nhưng dòng 207 kế bên — `assert.match(so, /1 ph 45 s/, 'bước 6b phải nêu số đo thật của chính nó')` — bỏ neo và grep trọn `commands/signoff.md`. Chuyển con số sang bất kỳ bước nào khác của tệp (hoặc để nó lại trong một ghi chú trong khi bước 6b bị viết lại không còn số) vẫn XANH, dù lời hứa trong thông điệp assert là về ĐOẠN của bước sinh. Cùng một lớp lỗi «neo trôi → assert hoá vô nghĩa» mà comment ngay trên đó tuyên đã đo được ở lượt chấm 2, chỉ chừa lại đúng một assert không neo.

AC-3 yêu cầu rõ "neo đoạn văn phải được kiểm trước khi assert đọc nó (neo trôi → assert hoá rỗng im lặng)"; finding cho thấy đúng assert đo con số thời gian không áp dụng neo đó, khác với assert liền kề đã được neo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tệp untracked vô hình với vị từ bỏ qua, trong khi 7b tự khai là đo CÂY LÀM VIỆC**
  Người dùng thấy gì: Một tệp mới vừa thêm vào nhưng chưa được lưu vào hệ thống quản lý phiên bản có thể bị bỏ sót khi hệ thống quyết định có cần kiểm tra lại hay không.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khối SIGNOFF-LANE-CLAUSE vẫn khẳng định vô điều kiện «commit chữ ký chạm file ngoài T1» và bắt chạy `--write` 13 phút sau commit**
  Người dùng thấy gì: Hướng dẫn ký duyệt có thể vẫn yêu cầu chạy lại một bước tốn nhiều phút ngay sau khi đã ký — đúng phần chi phí mà thay đổi lần này định loại bỏ.
  file: `commands/signoff.md`
  severity: medium
  Đề xuất: known-limits

- **`signoff.md` tham chiếu «bước 6b» — bước đó không tồn tại trong lệnh (khối thật tên 7a-bis)**
  Người dùng thấy gì: Hướng dẫn ký duyệt trỏ tới một bước không tồn tại, nên người thực hiện có thể hiểu nhầm điều kiện và bỏ sót một tệp cần đưa vào lần ký.
  file: `commands/signoff.md`
  severity: medium
  Đề xuất: known-limits

- **Bước 7a-bis nhét đường dẫn kit-nội-bộ vào `commands/signoff.md` — lệnh SHIP cho mọi repo tiêu thụ**
  Người dùng thấy gì: Lệnh ký có thể chạy hỏng hoặc bị dừng nhầm khi dùng ở một dự án khác, không phải chính kho chứa bộ công cụ này.
  file: `commands/signoff.md`
  severity: high
  Đề xuất: known-limits

- **Hai vòng meta trong cùng cửa sổ chưa phát hành 2.12→2.13, và CHANGELOG mang hai câu «vòng meta duy nhất» chọi nhau**
  Người dùng thấy gì: Ghi chú phát hành có thể đang mô tả không khớp số vòng làm nội bộ đã chạy trong cùng một kỳ, khiến người đọc khó biết chính xác điều gì đã thay đổi.
  file: `CHANGELOG.md`
  severity: medium
  Đề xuất: known-limits

- **LMCMS_ONLY khớp 0 ca vẫn exit 0 — đối chứng dương của bước ký hoá rỗng im lặng**
  Người dùng thấy gì: Bước kiểm tra trước khi ký có thể báo "đạt" dù thực chất chưa kiểm tra gì, nếu tên bộ lọc kiểm tra bị gõ sai.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: high
  Đề xuất: known-limits

- **E7 khai grep hai chuỗi PASS nhưng cmd chỉ chạy suite trần — chiều đỏ đã khai không thể xảy ra**
  Người dùng thấy gì: Một bài kiểm tra có thể báo đạt ngay cả khi các ca kiểm thử mới bị đổi tên và không còn được chạy, khiến lỗi thật bị bỏ lọt.
  file: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **RB2c là assertion không sống: chuỗi thay thế không khớp nên `doi === KHAC`, ca không thể đỏ**
  Người dùng thấy gì: Một bài kiểm tra dùng để phát hiện lỗi ghi đè dữ liệu của hồ sơ khác thực chất không có khả năng phát hiện lỗi đó, dù luôn báo đạt.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **routing thiếu/đổi tên trong JSON của gate-card bị nuốt thành dòng rỗng thay vì exit 2**
  Người dùng thấy gì: Nếu dữ liệu định tuyến bị thiếu hoặc đổi tên trường, công cụ có thể âm thầm ghi một dòng trống thay vì báo lỗi, khiến bước kiểm tra sau đó cũng xanh nhầm.
  file: `tests/scripts/routing-baseline.mjs`
  severity: medium
  Đề xuất: known-limits

- **signoff.md trỏ «bước 6b» — bước đó không tồn tại (khối tên là 7a-bis)**
  Người dùng thấy gì: Hướng dẫn ký duyệt trỏ tới một bước không tồn tại, nên người thực hiện có thể hiểu nhầm điều kiện và bỏ sót một tệp cần đưa vào lần ký.
  file: `commands/signoff.md`
  severity: medium
  Đề xuất: known-limits

- **Vị từ --skip-unchanged mù với tệp untracked, trong khi nó chạy trên cây bẩn cục bộ**
  Người dùng thấy gì: Một tệp mới vừa thêm vào nhưng chưa được lưu vào hệ thống quản lý phiên bản có thể bị bỏ sót khi hệ thống quyết định có cần kiểm tra lại hay không.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 + ca chiều-im rỗng: phép "sửa tay dòng hồ sơ khác" của RB2c là no-op, assert hoá tautology**
  Người dùng thấy gì: Một bài kiểm tra dùng để phát hiện lỗi ghi đè dữ liệu của hồ sơ khác thực chất không có khả năng phát hiện lỗi đó, dù luôn báo đạt.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4: `LMCMS_ONLY` fail-OPEN — 0 ca khớp vẫn exit 0, mà signoff dùng chính nó làm ĐỐI CHỨNG DƯƠNG**
  Người dùng thấy gì: Bước kiểm tra trước khi ký có thể báo "đạt" dù thực chất chưa kiểm tra gì, nếu tên bộ lọc kiểm tra bị gõ sai.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3: eval E7 hứa «pipefail + grep hai dòng PASS» nhưng cmd chỉ là suite trần — chiều đỏ được khai là bịa**
  Người dùng thấy gì: Một bài kiểm tra có thể báo đạt ngay cả khi các ca kiểm thử mới bị đổi tên và không còn được chạy, khiến lỗi thật bị bỏ lọt.
  file: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3: assert CHANGELOG của SK6 ghim chuỗi đã có sẵn ở cây gốc — không bao giờ đỏ được**
  Người dùng thấy gì: Một bài kiểm tra về ghi chú phát hành luôn báo đạt dù nội dung ghi chú thật chưa chắc đã được cập nhật đúng.
  file: `tests/scripts/repin-lane-skip-unchanged.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 1: ca chiều-im RB3-IM đo một mảnh regex chép lại, không đo phán quyết của chính RB3**
  Người dùng thấy gì: Một bài kiểm tra dùng để bắt lỗi sao chép sai không thực sự chạy lại phép so sánh gốc, nên loại lỗi đó có thể lọt qua mà không bị phát hiện.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1: RB2e tự xưng «import thật, không grep» nhưng mắt xích duy nhất tới LM20 là một grep mã nguồn**
  Người dùng thấy gì: Một bài kiểm tra tuyên bố đang xác nhận hai bộ phận dùng chung một nguồn logic, nhưng thực chất chỉ đang tìm một đoạn văn bản trong mã nguồn, nên có thể báo đạt nhầm.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/18 lỗi rơi vào file không bộ đo nào phủ (_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
