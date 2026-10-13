# Review findings — cau-tin-hieu-nguoi-gui (round 3)

## Trong hợp đồng

Không có phát hiện trong hợp đồng ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Old-drawing flag and consumer docs say «kit ≥ 2.28», but 2.28.0 is already released without cau_nguoi_gui**
  Người dùng thấy gì: Nếu một kho cài bản 2.28.0 rồi vẽ lại trang lộ trình, trang vẫn chưa có câu cho người gửi nên cờ vàng vẫn báo «hãy vẽ lại bằng bản từ 2.28». Người dùng làm đúng lời cờ mà cờ không tắt. Cách sửa là ghi đúng số bản sẽ phát hành tính năng này vào lúc cắt mốc.
  file: `scripts/tin-hieu.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP «bộ mã của kho» nhưng ma trận đỏ chỉ có điểm-case: slug việc và mã chân trời không ca nào đo**
  Người dùng thấy gì: Phép kiểm chặn câu cho người gửi lọt mã nội bộ chưa được thử riêng với hai loại mã là mã việc và mã mốc lộ trình. Nếu một câu lọt hai loại mã đó thì có thể vẫn qua phép kiểm mà không báo đỏ, và người gửi sẽ đọc thấy chữ nội bộ.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Consumer docs point to `scripts/tin-hieu.mjs` as if the consumer repo had it**
  Người dùng thấy gì: Hướng dẫn gửi kèm cho kho dùng kit chỉ đường tới một lệnh kiểm mà kho đó không có sẵn. Ai làm đúng từng chữ sẽ gặp lỗi «không tìm thấy» và phép kiểm câu cho người gửi không chạy được.
  file: `skills/acceptance/references/tin-hieu-template.md`
  severity: low
  Đề xuất: known-limits

- **CN-6-do3 concludes from exit 2 with no positive control of its own**
  Người dùng thấy gì: Một phép kiểm báo lỗi khi khuôn thiếu danh sách từ cấm chưa có lượt đối chứng cho thấy bản nguyên vẹn chạy xanh. Hiện không có hành vi sai nào, nhưng nếu bộ dữ liệu thử hỏng thì phép kiểm vẫn báo đỏ và người đọc không phân biệt được.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — CN-6-do3 kết luận từ thoát 2 trên bản sao mà không có đối chứng dương trên cùng kho**
  Người dùng thấy gì: Hai phép kiểm báo lỗi khi khuôn thiếu khối từ cấm chưa chạy thử bản nguyên vẹn trên cùng dữ liệu. Chưa có lỗi thật nào, nhưng nếu dữ liệu thử hỏng thì phép kiểm vẫn báo đỏ và khó biết nó có bắt đúng lỗi hay không.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): lớp «mã giống chữ thường» có ba loại cộng ranh ALL-CAPS, nhưng CN-5 chỉ thử «chỉ chữ số» (r2)**
  Người dùng thấy gì: Bộ kiểm câu mới chỉ được thử kỹ với mã toàn chữ số như «4». Các loại mã khác (một chữ cái như «M», chữ thường liền như «cb», chữ hoa như «CK») chưa có ca thử riêng. Nếu sau này quy tắc kiểm bị sửa nhầm, một tên nhóm chứa mã nội bộ có thể lọt tới người gửi, hoặc một câu sạch bị báo nhầm, mà không ai hay.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bước kiểm câu đứng SAU mốc đếm «chủ kho sửa bao nhiêu nhóm»: máy đổi tên nhóm sẽ bị đếm thành người sửa, làm nhiễu ngưỡng UAT của L3 (r1)**
  Người dùng thấy gì: Khi phiên gom nhóm tự đổi lại tên nhóm sau bước kiểm câu, lần sửa của máy có thể bị tính là chủ kho sửa. Số đo «chủ kho sửa bao nhiêu nhóm» của lần nghiệm thu tính năng gom nhóm vì vậy có thể cao hơn thực tế và làm lệch kết luận sống hay chết.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Cờ đọc-cũ và tài liệu kho tiêu thụ ghi «kit ≥ 2.28», nhưng vòng đã dời khỏi 2.28 và v2.28.0 đã phát hành mà không có tính năng này (r1)**
  Người dùng thấy gì: Trang lộ trình của kho khác sẽ bảo người dùng «vẽ lại bằng bản 2.28 trở lên» để có câu mới, nhưng bản 2.28 đã phát hành mà chưa có tính năng này. Kho nâng lên 2.28 làm theo lời dặn vẫn không thấy câu mới và cảnh báo không tự hết.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hướng dẫn xử lý `--cau` thoát 1 trong SKILL bỏ sót hai lớp lỗi phiên gom không tự sửa được: chữ ký không có ngày, và câu giao lấy từ `feature` của hồ sơ đã giao (r1)**
  Người dùng thấy gì: Khi phép kiểm câu báo đỏ vì ngày ký của hồ sơ không đọc được, hoặc vì câu giao trong hồ sơ đã ký chứa mã nội bộ, phiên gom nhóm không có cách nào tự sửa và hướng dẫn không dặn báo chủ kho. Phiên có thể chạy lại mãi không xanh, hoặc tự ý sửa vào hồ sơ người đã ký.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **tinhTrangCua chép lại phép phân nhóm tiến độ thay vì dùng chung `nhomTienDo` mà lo-trinh.mjs khai là MỘT hàm cho trang và khối dữ liệu (r1)**
  Người dùng thấy gì: Hôm nay câu cho người gửi và màu, số đếm trên trang lộ trình nói cùng một tình trạng. Nếu sau này cách chia «đã giao · đang làm · chưa bắt đầu» của trang đổi, hai bên có thể lệch nhau và người gửi thấy câu nói khác với trang.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **CN-6-do3 kết luận đỏ từ mã thoát 2 trên một kho mà bản lành chưa từng chạy, trái bất biến «đối chứng dương» và nếp ghi ở đầu tệp ca (r1)**
  Người dùng thấy gì: Ca kiểm «thiếu khối từ cấm thì báo lỗi» chưa từng chạy bản nguyên vẹn trên cùng dữ liệu để chứng minh nó xanh trước. Thông báo lỗi được ghim đúng nên nguy cơ xanh giả thấp, nhưng bằng chứng yếu hơn mức kit tự đặt.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Chữ ký thật của crm ở dạng ngày/tháng/năm bị coi là «không đọc được ngày»: câu cho người gửi mất ngày giao và `--cau` đỏ (r1)**
  Người dùng thấy gì: Một số hồ sơ thật của kho khách ghi ngày ký theo kiểu ngày/tháng/năm, ví dụ «10/09/2026». Với hồ sơ đó câu cho người gửi mất ngày giao và phép kiểm câu báo đỏ mà phiên gom không sửa được (chữ ký là của người), nên lượt gom thật đầu tiên của kho khách có thể bị kẹt.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phép đo trên dữ liệu crm thật lọc bỏ đúng những hồ sơ có ngày ký không theo dạng ISO, nên E9 xanh mà không chạm ca đỏ thật (r1)**
  Người dùng thấy gì: Phép đo trên dữ liệu thật của kho khách chỉ chọn hồ sơ có ngày ký đúng một kiểu, nên bỏ qua đúng loại hồ sơ gây đỏ ở kho thật. Kết quả «xanh trên dữ liệu thật» vì vậy chưa chứng minh được kho khách không bị đỏ.
  file: `_acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs`
  severity: medium
  Đề xuất: new-contract

- **SKILL gom không có cách xử lý cho dòng đỏ «chữ ký không đọc được ngày» hay mã lọt qua `feature` của hồ sơ phủ (r1)**
  Người dùng thấy gì: Khi phép kiểm câu đỏ vì chữ ký của người không đọc được ngày, hoặc vì câu giao trong hồ sơ đã ký có mã nội bộ, hướng dẫn gom không nói phiên phải làm gì. Phiên làm theo hướng dẫn sẽ không bao giờ về xanh và có thể tự sửa nhầm vào hồ sơ người đã ký.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (class claimed, only point cases): the code set has 7 kinds but the CN-5 red matrix covers only 4 (r1)**
  Người dùng thấy gì: Phép kiểm chặn mã nội bộ lọt vào câu mới mới được chứng minh trên 4 trong 7 loại mã. Ba loại còn lại (mã đợt, tên rút gọn của việc, mã chân trời) nếu bị bỏ khỏi phép kiểm thì không ca nào báo đỏ, nên mã nội bộ có thể lọt tới người gửi mà không ai hay.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (no real message pin): CN-8-do's pin 'GOM-CAU' is the prefix of every message cn8 can return (r1)**
  Người dùng thấy gì: Ca kiểm «lệnh kiểm câu trong hướng dẫn gom được chạy đúng nguyên văn» chỉ bắt được «có lỗi gì đó», không phân biệt lỗi nằm ở lệnh hay ở chỗ khác. Hướng dẫn gom có thể hỏng ở khâu chạy lệnh mà ca vẫn báo đúng.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): CN-6-do3 has no positive control on the same repo (r1)**
  Người dùng thấy gì: Một ca kiểm lỗi chưa chạy bản nguyên vẹn trên cùng dữ liệu để chứng minh bản lành xanh trước. Nguy cơ xanh giả thấp vì thông báo lỗi được ghim đúng, nhưng ca này là ca đỏ duy nhất trong nhóm thiếu đối chứng đó.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 2 (hand-written oracle, no round-trip): CN-3's progress-group matrix compares against a copy of the code's own formula (r1)**
  Người dùng thấy gì: Ca kiểm khớp tình trạng giữa câu và trang chỉ so với một bản tính chép lại, và chỉ thử thật trên ba nhóm. Các tình trạng thuộc nhóm «khác» (xếp lại, đã bác, ngoài phạm vi, hỏng, chữ lạ) chưa từng được so với trang thật, nên nếu trang đổi cách xếp chúng, câu có thể lệch mà không ai báo.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 2 (hand-written): CN-1's code set hard-codes group codes and the batch instead of extracting them from the test repo (r1)**
  Người dùng thấy gì: Ca kiểm «câu không lọt mã nội bộ» dùng danh sách mã nhóm và mã đợt viết tay thay vì đọc từ dữ liệu thử. Nếu dữ liệu thử đổi tên nhóm, ca sẽ bỏ sót mã đó một cách lặng lẽ.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
