# Review findings: cua-tin-hieu-gom-nhom (round 3)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (âm-tính-một-mình): E10 hứa ba vế KÍN ĐÁP ÁN, nhưng đối chứng dương và ca đỏ chỉ phủ vế «tên hồ sơ». Vế «tiêu đề trùng câu giao» và vế «kho không có tệp đáp án» chưa từng được chứng là đỏ được**
  Người dùng thấy gì: Kiểm tra «phiên gom không được thấy đáp án» hiện mới chứng minh được việc bắt lộ tên hồ sơ. Hai kiểu lộ còn lại (tiêu đề giống hệt câu giao việc, hoặc để lọt tệp đáp án trong kho) chưa có lần nào được thử cho báo đỏ, nên nếu chúng xảy ra thì có thể vẫn hiện màu xanh mà không ai biết. Hiện chưa thấy kho nào bị lộ như vậy, nhưng độ tin cậy của lời «kín đáp án» chỉ mới được chứng một phần.
  file: `_acceptance/cua-tin-hieu-gom-nhom/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): AC-10 hẹp hứa lệnh chấm kiểm «hồ sơ đã giao ra đã phủ» trên bộ vàng thứ hai, nhưng chỉ vế «cặp trùng tách» có ca đỏ**
  Người dùng thấy gì: Lệnh chấm bản gom trên bộ mẫu thứ hai mới chứng minh được trường hợp đúng: việc đã giao được ghi «đã phủ». Nếu lệnh chấm sai ở chỗ này (ví dụ xếp nhầm một ý của việc chưa giao vào «đã phủ», hoặc bỏ qua việc đã giao), kiểm tra hiện tại vẫn báo xanh. Người dùng có thể nhận một bản chấm trông ổn nhưng chưa được thử bắt lỗi ở đúng chỗ này.
  file: `_acceptance/cua-tin-hieu-gom-nhom/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **The engine drift check still cannot see the three new orchestration files or the signal template that this round added to the CI copy list (r2)**
  Người dùng thấy gì: Kho nào dùng cửa tín hiệu mà giữ bản cũ của vài tệp phụ trợ vẫn được báo «engine xanh», dù phiên bản các tệp không khớp nhau. Người dùng có thể tin nhầm là bản cài đã đồng bộ trong khi có tệp cũ.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: high
  Đề xuất: new-contract

- **The new 'answer key committed before the grouping, from real kit history' check in TH-10 has no case in the suite that shows it turning red (r2)**
  Người dùng thấy gì: Phép kiểm «đáp án phải được ghi trước khi gom» chưa từng được thử cho thấy nó báo đỏ khi đáp án bị ghi cùng lúc hoặc sửa sau. Nếu nó hỏng im lặng, kết quả chấm bộ vàng có thể được tin hơn mức đáng có.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Engine-drift check in the baseline step silently skips the 4 vendored files this round added to the CI copy list (r2)**
  Người dùng thấy gì: Bốn tệp mới của cửa tín hiệu có thể nằm cũ trong kho dùng kit mà bước kiểm đường nền vẫn báo khớp. Người dùng không được cảnh báo khi bản cài lệch.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: medium
  Đề xuất: new-contract

- **New dieu-phoi entries in INIT-CI-COPY-LIST break the engine-hash leg of duong-nen; NEN7 is now red (r1)**
  Người dùng thấy gì: Phần kiểm tra «máy của kho tiêu thụ có đúng bản gói đang dùng không» bị mù với ba tệp mới của gói Điều phối, nên kho cài gói có thể lệch bản mà không ai được báo. Một bài kiểm có sẵn của kit đang đỏ vì chuyện này, và hai phép đo mà hồ sơ đã ký đang dựa vào cũng đỏ theo.
  file: `commands/acceptance-init.md`
  severity: high
  Đề xuất: new-contract

- **tin-hieu.test.mjs hardcodes the literal "signed-off" — RT13 is red (r1)**
  Người dùng thấy gì: Bộ kiểm tra chung của kit đang đỏ vì tệp kiểm tra của tính năng mới viết cứng một tên trạng thái thay vì lấy từ nơi định nghĩa chuẩn. Tính năng vẫn chạy đúng nhưng không thể gộp khi bộ kiểm tra chung còn đỏ.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Two red-direction checks assert on exit code alone, with no pinned message (r1)**
  Người dùng thấy gì: Hai bài kiểm «máy phải báo đỏ khi sai» chỉ xác nhận có báo đỏ, chưa xác nhận đỏ đúng lý do. Nếu bản thử hỏng vì lỗi khác thì bài kiểm vẫn xanh, nên màu xanh ở hai chỗ này tin được kém hơn vẻ ngoài.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Kit repo now carries verbatim consumer (crm) contracts as fixtures (r1)**
  Người dùng thấy gì: Kho của kit đang giữ bản sao nguyên văn nhiều hồ sơ công việc thật của một khách hàng, kèm email người phụ trách và tên nhánh, đường dẫn nội bộ của họ. Ai dùng kit ở công ty khác cũng sẽ nhận các bản sao này.
  file: `_acceptance/cua-tin-hieu-gom-nhom/mau/ho-so/kiem-cheo-sau-gop/contract.md`
  severity: medium
  Đề xuất: new-contract

- **Coverage check accepts a summary file that is staged but never committed (and committed files with uncommitted edits) (r1)**
  Người dùng thấy gì: Chủ kho có thể thấy «bản gom đạt» khi bản gom mới chỉ được đánh dấu chuẩn bị lưu hoặc còn sửa dở, chưa được lưu vào lịch sử. Khi đó mốc để đếm số lần chủ kho chỉnh tay có thể bị tính lệch.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **Signal-path output silently drops malformed signals and missing sources (roadmap page and --duong --id) (r1)**
  Người dùng thấy gì: Một tín hiệu nằm trong tệp bị hỏng sẽ biến mất khỏi trang lộ trình mà không có lời báo nào. Người gửi hỏi tín hiệu của mình sẽ được trả lời «không có tín hiệu này», dù thật ra nó đã gửi nhưng bị hỏng khuôn.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): TH-3-do ghim «lẻ thành mã» nhưng bắt được nhờ một assert khác. Assert «lẻ không thành mã» thật ra không thể đỏ (r1)**
  Người dùng thấy gì: Bài kiểm «mục để riêng không được biến thành một nhóm» có thể vẫn xanh trong vài kiểu lỗi, nên màu xanh ở đó chưa chắc chứng minh được điều nó tuyên bố.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): «0 câu khớp mẫu cấm» của TH-9 không có đối chứng dương, và regex không phủ đúng mẫu cấm mà eval khai (r1)**
  Người dùng thấy gì: Phép quét «hướng dẫn không được bảo kit giữ kho tín hiệu» chỉ bắt vài cách diễn đạt, nên một câu viết khác đi vẫn lọt mà bài kiểm vẫn xanh. Hiện chưa thấy câu nào như vậy trong hướng dẫn, nhưng rào chắn này mỏng hơn vẻ ngoài.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (_acceptance/cua-tin-hieu-gom-nhom/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
