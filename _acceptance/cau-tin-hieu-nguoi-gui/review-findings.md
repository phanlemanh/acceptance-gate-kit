# Review findings: cau-tin-hieu-nguoi-gui (round 2)

## Trong hợp đồng

Không có phát hiện nào ánh xạ được vào tiêu chí ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): lớp «mã giống chữ thường» có ba loại cộng ranh ALL-CAPS, nhưng CN-5 chỉ thử «chỉ chữ số»**
  Người dùng thấy gì: Bộ kiểm câu mới chỉ được thử kỹ với mã toàn chữ số như «4». Các loại mã khác (một chữ cái như «M», chữ thường liền như «cb», chữ hoa như «CK») chưa có ca thử riêng. Nếu sau này quy tắc kiểm bị sửa nhầm, một tên nhóm chứa mã nội bộ có thể lọt tới người gửi, hoặc một câu sạch bị báo nhầm, mà không ai hay.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bước kiểm câu đứng SAU mốc đếm «chủ kho sửa bao nhiêu nhóm»: máy đổi tên nhóm sẽ bị đếm thành người sửa, làm nhiễu ngưỡng UAT của L3 (r1)**
  Người dùng thấy gì: Khi phiên gom nhóm tự đổi lại tên nhóm sau bước kiểm câu, lần sửa của máy có thể bị tính là chủ kho sửa. Số đo «chủ kho sửa bao nhiêu nhóm» của lần nghiệm thu tính năng gom nhóm vì vậy có thể cao hơn thực tế và làm lệch kết luận sống hay chết.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Cờ đọc-cũ và tài liệu kho tiêu thụ ghi «kit ≥ 2.28», nhưng vòng đã dời khỏi 2.28 và v2.28.0 đã phát hành mà không có tính năng này (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trang lộ trình của kho khác sẽ bảo người dùng «vẽ lại bằng bản 2.28 trở lên» để có câu mới, nhưng bản 2.28 đã phát hành mà chưa có tính năng này. Kho nâng lên 2.28 làm theo lời dặn vẫn không thấy câu mới và cảnh báo không tự hết.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hướng dẫn xử lý `--cau` thoát 1 trong SKILL bỏ sót hai lớp lỗi phiên gom không tự sửa được: chữ ký không có ngày, và câu giao lấy từ `feature` của hồ sơ đã giao (r1)**
  Người dùng thấy gì: Khi phép kiểm câu báo đỏ vì ngày ký của hồ sơ không đọc được, hoặc vì câu giao trong hồ sơ đã ký chứa mã nội bộ, phiên gom nhóm không có cách nào tự sửa và hướng dẫn không dặn báo chủ kho. Phiên có thể chạy lại mãi không xanh, hoặc tự ý sửa vào hồ sơ người đã ký.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **tinhTrangCua chép lại phép phân nhóm tiến độ thay vì dùng chung `nhomTienDo` mà lo-trinh.mjs khai là MỘT hàm cho trang và khối dữ liệu (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hôm nay câu cho người gửi và màu, số đếm trên trang lộ trình nói cùng một tình trạng. Nếu sau này cách chia «đã giao · đang làm · chưa bắt đầu» của trang đổi, hai bên có thể lệch nhau và người gửi thấy câu nói khác với trang.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **CN-6-do3 kết luận đỏ từ mã thoát 2 trên một kho mà bản lành chưa từng chạy, trái bất biến «đối chứng dương» và nếp ghi ở đầu tệp ca (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ca kiểm «thiếu khối từ cấm thì báo lỗi» chưa từng chạy bản nguyên vẹn trên cùng dữ liệu để chứng minh nó xanh trước. Thông báo lỗi được ghim đúng nên nguy cơ xanh giả thấp, nhưng bằng chứng yếu hơn mức kit tự đặt.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Chữ ký thật của crm ở dạng ngày/tháng/năm bị coi là «không đọc được ngày»: câu cho người gửi mất ngày giao và `--cau` đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một số hồ sơ thật của kho khách ghi ngày ký theo kiểu ngày/tháng/năm, ví dụ «10/09/2026». Với hồ sơ đó câu cho người gửi mất ngày giao và phép kiểm câu báo đỏ mà phiên gom không sửa được (chữ ký là của người), nên lượt gom thật đầu tiên của kho khách có thể bị kẹt.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phép đo trên dữ liệu crm thật lọc bỏ đúng những hồ sơ có ngày ký không theo dạng ISO, nên E9 xanh mà không chạm ca đỏ thật (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép đo trên dữ liệu thật của kho khách chỉ chọn hồ sơ có ngày ký đúng một kiểu, nên bỏ qua đúng loại hồ sơ gây đỏ ở kho thật. Kết quả «xanh trên dữ liệu thật» vì vậy chưa chứng minh được kho khách không bị đỏ.
  file: `_acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs`
  severity: medium
  Đề xuất: new-contract

- **SKILL gom không có cách xử lý cho dòng đỏ «chữ ký không đọc được ngày» hay mã lọt qua `feature` của hồ sơ phủ (r1)**
  Người dùng thấy gì: Khi phép kiểm câu đỏ vì chữ ký của người không đọc được ngày, hoặc vì câu giao trong hồ sơ đã ký có mã nội bộ, hướng dẫn gom không nói phiên phải làm gì. Phiên làm theo hướng dẫn sẽ không bao giờ về xanh và có thể tự sửa nhầm vào hồ sơ người đã ký.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (class claimed, only point cases): the code set has 7 kinds but the CN-5 red matrix covers only 4 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm chặn mã nội bộ lọt vào câu mới mới được chứng minh trên 4 trong 7 loại mã. Ba loại còn lại (mã đợt, tên rút gọn của việc, mã chân trời) nếu bị bỏ khỏi phép kiểm thì không ca nào báo đỏ, nên mã nội bộ có thể lọt tới người gửi mà không ai hay.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (no real message pin): CN-8-do's pin 'GOM-CAU' is the prefix of every message cn8 can return (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ca kiểm «lệnh kiểm câu trong hướng dẫn gom được chạy đúng nguyên văn» chỉ bắt được «có lỗi gì đó», không phân biệt lỗi nằm ở lệnh hay ở chỗ khác. Hướng dẫn gom có thể hỏng ở khâu chạy lệnh mà ca vẫn báo đúng.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): CN-6-do3 has no positive control on the same repo (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một ca kiểm lỗi chưa chạy bản nguyên vẹn trên cùng dữ liệu để chứng minh bản lành xanh trước. Nguy cơ xanh giả thấp vì thông báo lỗi được ghim đúng, nhưng ca này là ca đỏ duy nhất trong nhóm thiếu đối chứng đó.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 2 (hand-written oracle, no round-trip): CN-3's progress-group matrix compares against a copy of the code's own formula (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ca kiểm khớp tình trạng giữa câu và trang chỉ so với một bản tính chép lại, và chỉ thử thật trên ba nhóm. Các tình trạng thuộc nhóm «khác» (xếp lại, đã bác, ngoài phạm vi, hỏng, chữ lạ) chưa từng được so với trang thật, nên nếu trang đổi cách xếp chúng, câu có thể lệch mà không ai báo.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 2 (hand-written): CN-1's code set hard-codes group codes and the batch instead of extracting them from the test repo (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ca kiểm «câu không lọt mã nội bộ» dùng danh sách mã nhóm và mã đợt viết tay thay vì đọc từ dữ liệu thử. Nếu dữ liệu thử đổi tên nhóm, ca sẽ bỏ sót mã đó một cách lặng lẽ.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chi tiết kỹ thuật của các mục ngoài hợp đồng (tham khảo, không phải thẻ Cổng 2)

Phần này chỉ ghi vị trí dòng, nguồn và diễn giải kỹ thuật gốc của mục mới ở round 2. Mười ba mục ngoài hợp đồng của round 1 không được chấm lại ở round này; khi có mặt ở mục trên chúng mang nhãn (r1).

### Mục 1 (mới ở round 2) — Lớp «mã giống chữ thường» chỉ có điểm-case «chỉ chữ số»
Vị trí: `tests/scripts/tin-hieu.test.mjs:727` · Nguồn: measurement
Chi tiết: Vật khai một LỚP ranh giới kiểm/bỏ qua. `kiemDuoc` cùng `loaiMa` (scripts/tin-hieu.mjs) có ba nhãn bỏ qua: 'chỉ chữ số', 'một chữ cái', 'chữ thường liền'; mã ALL-CAPS từ hai chữ trở lên (`/^\p{Lu}{2,}$/`) thì vẫn được kiểm. Design §5 kê đủ ba loại («4», «M», «zalo») và AC-5 hứa dòng tóm tắt nêu «số mã bỏ qua kèm lý do». Thế nhưng cả bộ ca CN chỉ có MỘT ca chạm ranh này: ca im quy-4 ở dòng 727–729, với `ma: '4'`, assert `includes('chỉ chữ số')`. Không kho thử nào có mã một chữ cái, mã chữ thường liền hay mã ALL-CAPS không số: bộ mã của khoCan chỉ gồm id có gạch, G1/G2, gom-1, K2/H7/H8, giao-x. Số assert là 1 trong khi lớp có 4 vùng; ma trận viết trước cho từng loại (mẫu P105) không có.
Đo trên bản sao cây ở scratchpad, chạy cả 22 ca CN (trừ CN-2) và do-crm.mjs trên crm @06e34d26, với bốn đột biến: M1 `kiemDuoc = m => /^\p{L}$/u.test(m) || …` (mã một chữ cái bị kiểm); M2 `/^\p{Ll}+$/u.test(m) || …` (mã chữ thường liền bị kiểm); M3 bỏ vế `|| /^\p{Lu}{2,}$/u.test(m)` (mã ALL-CAPS không còn được kiểm và lọt im); M4 đổi nhãn 'một chữ cái'. Cả bốn đều XANH toàn bộ (22/22 CN, do-crm «all passed»).
Không phải lý thuyết: ở sha crm đã ghim, docs/plan/lo-trinh-okr.json có 8 mã một chữ cái (M, H, K, S, D, C, L, T) và 5 mã ALL-CAPS (CK, MK, KN, KG, ZT); lo-trinh-kho-tai-lieu.json có mã chữ thường liền «cb». Với M3, một tên nhóm chứa «CK» lọt tới người gửi mà `--cau` vẫn thoát 0. Với M1, mã «M»/«T» làm `--cau` báo nhầm, đúng lớp báo nhầm mà design §5 dựng bộ lọc để chặn.
Thêm một điểm: bộ đếm «độc lập» `demMa` (dòng 700) lọc bằng biểu thức chép NGUYÊN VĂN `kiemDuoc`, nên phép so quan hệ của CN-5 chỉ phát hiện được vật lệch khỏi bản chép, không lệch khỏi luật. Kỳ vọng cho từng loại nên viết sẵn trong ma trận (mã → kiểm/bỏ qua + nhãn), không suy từ công thức của vật.
Vì sao ngoài hợp đồng: AC-5 chỉ đòi đúng một ca im là mã «4» và ca đó đã có; mã một chữ cái, chữ thường liền và ALL-CAPS không được AC nào nêu thành điều kiện nên không AC nào bị làm thất bại. Đây là độ mạnh của bộ ca thử, không phải hành vi sai của vật.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
