# Review findings: cau-tin-hieu-nguoi-gui (round 1)

## Trong hợp đồng

- **Shape 4 (assertion with no real message pin): CN-6-do-tt's «hồ sơ» pin is matched by the control message, not by --cau**
  file: `tests/scripts/tin-hieu.test.mjs:758`
  severity: high
  AC: AC-6
  CN-6-do-tt injects 'tạm hoãn' → 'tạm hoãn hồ sơ', then chayDo (line 53) takes the first message containing 'hồ sơ'. But that same injection always fires the control check at line 747 (`endsWith('— tạm hoãn')`). Its message runs JSON.stringify over every sentence, including the delivery sentence «Mở hồ sơ khách hàng nhanh» (line 742), so it contains 'hồ sơ' whether or not --cau caught anything. Measured on a scratch copy: with only the khung path for the status phrase removed in scripts/tin-hieu.mjs:340 (`tinhTrang: SENT`), --cau exits 0, yet CN-6-do-tt PASSes with the message «đối chứng: không có câu của việc xếp lại [...]». All 20 cases CN-1…CN-8-do except CN-2 were also green on that mutant. So the AC-6 clause «chèn 'hồ sơ' vào … một cụm tình trạng → câu đang xanh thành đỏ» has no red direction anywhere in the suite. The pin needs to come from a --cau line (e.g. `sạch: exit 1` + «hồ sơ» + the sentence carrying 'tạm hoãn hồ sơ'), or the control check must not dump sentences that contain the pin word.
  Vì sao thuộc hợp đồng: vế «chèn «hồ sơ» vào cụm tình trạng → câu đang xanh thành đỏ nêu câu» của AC-6 không có chiều đỏ thật trong bộ kiểm (đã đo: bỏ đường đó khỏi vật mà ca vẫn qua), nên AC-6 chưa được chứng minh.
  source: measurement

- **Shape 3 (string presence where the promise is a relation): the CN-5 summary never checks the number of codes checked**
  file: `tests/scripts/tin-hieu.test.mjs:695`
  severity: medium
  AC: AC-5
  AC-5/E5 promise one summary line giving the number of sentences, the number of codes checked and the number skipped. Line 695 only asserts `tom[0].includes('4 câu')` and `includes('bỏ qua')`: the codes-checked value is asserted nowhere, and on the clean repo the skipped count is not compared with anything (only the quy-4 case checks `bq >= 1`). Measured on a scratch copy: changing dongTomTatCau (scripts/tin-hieu.mjs:415) to print `kiểm 0 mã của kho` leaves CN-5 and CN-8 PASS. The number should be compared with the codes extracted from the test repo itself (ids, G1/G2, gom-1, K2/H7/H8, giao-x, after filtering out text-like codes).
  Vì sao thuộc hợp đồng: AC-5 đòi dòng tóm tắt nêu số câu, số mã đã kiểm và số mã bỏ qua; số mã đã kiểm không được kiểm ở đâu (đã đo: in sai thành 0 mà ca vẫn qua), nên vế này của AC-5 chưa được chứng minh.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bước kiểm câu đứng SAU mốc đếm «chủ kho sửa bao nhiêu nhóm»: máy đổi tên nhóm sẽ bị đếm thành người sửa, làm nhiễu ngưỡng UAT của L3**
  Người dùng thấy gì: Khi phiên gom nhóm tự đổi lại tên nhóm sau bước kiểm câu, lần sửa của máy có thể bị tính là chủ kho sửa. Số đo «chủ kho sửa bao nhiêu nhóm» của lần nghiệm thu tính năng gom nhóm vì vậy có thể cao hơn thực tế và làm lệch kết luận sống hay chết.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Cờ đọc-cũ và tài liệu kho tiêu thụ ghi «kit ≥ 2.28», nhưng vòng đã dời khỏi 2.28 và v2.28.0 đã phát hành mà không có tính năng này**
  Người dùng thấy gì: Trang lộ trình của kho khác sẽ bảo người dùng «vẽ lại bằng bản 2.28 trở lên» để có câu mới, nhưng bản 2.28 đã phát hành mà chưa có tính năng này. Kho nâng lên 2.28 làm theo lời dặn vẫn không thấy câu mới và cảnh báo không tự hết.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hướng dẫn xử lý `--cau` thoát 1 trong SKILL bỏ sót hai lớp lỗi phiên gom không tự sửa được: chữ ký không có ngày, và câu giao lấy từ `feature` của hồ sơ đã giao**
  Người dùng thấy gì: Khi phép kiểm câu báo đỏ vì ngày ký của hồ sơ không đọc được, hoặc vì câu giao trong hồ sơ đã ký chứa mã nội bộ, phiên gom nhóm không có cách nào tự sửa và hướng dẫn không dặn báo chủ kho. Phiên có thể chạy lại mãi không xanh, hoặc tự ý sửa vào hồ sơ người đã ký.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **tinhTrangCua chép lại phép phân nhóm tiến độ thay vì dùng chung `nhomTienDo` mà lo-trinh.mjs khai là MỘT hàm cho trang và khối dữ liệu**
  Người dùng thấy gì: Hôm nay câu cho người gửi và màu, số đếm trên trang lộ trình nói cùng một tình trạng. Nếu sau này cách chia «đã giao · đang làm · chưa bắt đầu» của trang đổi, hai bên có thể lệch nhau và người gửi thấy câu nói khác với trang.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **CN-6-do3 kết luận đỏ từ mã thoát 2 trên một kho mà bản lành chưa từng chạy, trái bất biến «đối chứng dương» và nếp ghi ở đầu tệp ca**
  Người dùng thấy gì: Ca kiểm «thiếu khối từ cấm thì báo lỗi» chưa từng chạy bản nguyên vẹn trên cùng dữ liệu để chứng minh nó xanh trước. Thông báo lỗi được ghim đúng nên nguy cơ xanh giả thấp, nhưng bằng chứng yếu hơn mức kit tự đặt.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Chữ ký thật của crm ở dạng ngày/tháng/năm bị coi là «không đọc được ngày»: câu cho người gửi mất ngày giao và `--cau` đỏ**
  Người dùng thấy gì: Một số hồ sơ thật của kho khách ghi ngày ký theo kiểu ngày/tháng/năm, ví dụ «10/09/2026». Với hồ sơ đó câu cho người gửi mất ngày giao và phép kiểm câu báo đỏ mà phiên gom không sửa được (chữ ký là của người), nên lượt gom thật đầu tiên của kho khách có thể bị kẹt.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phép đo trên dữ liệu crm thật lọc bỏ đúng những hồ sơ có ngày ký không theo dạng ISO, nên E9 xanh mà không chạm ca đỏ thật**
  Người dùng thấy gì: Phép đo trên dữ liệu thật của kho khách chỉ chọn hồ sơ có ngày ký đúng một kiểu, nên bỏ qua đúng loại hồ sơ gây đỏ ở kho thật. Kết quả «xanh trên dữ liệu thật» vì vậy chưa chứng minh được kho khách không bị đỏ.
  file: `_acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs`
  severity: medium
  Đề xuất: new-contract

- **SKILL gom không có cách xử lý cho dòng đỏ «chữ ký không đọc được ngày» hay mã lọt qua `feature` của hồ sơ phủ**
  Người dùng thấy gì: Khi phép kiểm câu đỏ vì chữ ký của người không đọc được ngày, hoặc vì câu giao trong hồ sơ đã ký có mã nội bộ, hướng dẫn gom không nói phiên phải làm gì. Phiên làm theo hướng dẫn sẽ không bao giờ về xanh và có thể tự sửa nhầm vào hồ sơ người đã ký.
  file: `skills/gom-tin-hieu/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (class claimed, only point cases): the code set has 7 kinds but the CN-5 red matrix covers only 4**
  Người dùng thấy gì: Phép kiểm chặn mã nội bộ lọt vào câu mới mới được chứng minh trên 4 trong 7 loại mã. Ba loại còn lại (mã đợt, tên rút gọn của việc, mã chân trời) nếu bị bỏ khỏi phép kiểm thì không ca nào báo đỏ, nên mã nội bộ có thể lọt tới người gửi mà không ai hay.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (no real message pin): CN-8-do's pin 'GOM-CAU' is the prefix of every message cn8 can return**
  Người dùng thấy gì: Ca kiểm «lệnh kiểm câu trong hướng dẫn gom được chạy đúng nguyên văn» chỉ bắt được «có lỗi gì đó», không phân biệt lỗi nằm ở lệnh hay ở chỗ khác. Hướng dẫn gom có thể hỏng ở khâu chạy lệnh mà ca vẫn báo đúng.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion): CN-6-do3 has no positive control on the same repo**
  Người dùng thấy gì: Một ca kiểm lỗi chưa chạy bản nguyên vẹn trên cùng dữ liệu để chứng minh bản lành xanh trước. Nguy cơ xanh giả thấp vì thông báo lỗi được ghim đúng, nhưng ca này là ca đỏ duy nhất trong nhóm thiếu đối chứng đó.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 2 (hand-written oracle, no round-trip): CN-3's progress-group matrix compares against a copy of the code's own formula**
  Người dùng thấy gì: Ca kiểm khớp tình trạng giữa câu và trang chỉ so với một bản tính chép lại, và chỉ thử thật trên ba nhóm. Các tình trạng thuộc nhóm «khác» (xếp lại, đã bác, ngoài phạm vi, hỏng, chữ lạ) chưa từng được so với trang thật, nên nếu trang đổi cách xếp chúng, câu có thể lệch mà không ai báo.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 2 (hand-written): CN-1's code set hard-codes group codes and the batch instead of extracting them from the test repo**
  Người dùng thấy gì: Ca kiểm «câu không lọt mã nội bộ» dùng danh sách mã nhóm và mã đợt viết tay thay vì đọc từ dữ liệu thử. Nếu dữ liệu thử đổi tên nhóm, ca sẽ bỏ sót mã đó một cách lặng lẽ.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chi tiết kỹ thuật của các mục ngoài hợp đồng (tham khảo, không phải thẻ Cổng 2)

Phần này chỉ ghi vị trí dòng, nguồn và diễn giải kỹ thuật gốc của từng mục ở trên, theo cùng thứ tự. Các mục cùng lớp: mục 3 và mục 8 (hướng dẫn SKILL không có lối ra cho dòng đỏ không tự sửa được); mục 5 và mục 11 (CN-6-do3 thiếu đối chứng dương); mục 6 và mục 7 (ngày ký ngày/tháng/năm).

### Mục 1 — Bước kiểm câu đứng SAU mốc đếm
Vị trí: `skills/gom-tin-hieu/SKILL.md:87` · Nguồn: conventions · Đề xuất: known-limits
Chi tiết: Dòng 84 SKILL định nghĩa MỐC = «Commit ĐẦU TIÊN của bản gom mà răng xanh», và chỉ miễn «các lượt máy sửa cho răng xanh». Khối GOM-CAU mới (dòng 87–100) chạy SAU khi răng đã xanh, và khi thoát 1 thì dặn máy «viết lại tên nhóm hoặc lý do…, commit». Các commit máy đổi tên ấy vì vậy nằm SAU mốc. Ngưỡng UAT của hồ sơ cua-tin-hieu-gom-nhom (opportunity.md dòng 68–69: sửa dưới 1/5 số nhóm là SỐNG, từ 2/5 là CHẾT, «đổi tên … tính là sửa một nhóm») sẽ đếm chúng thành chủ kho sửa. Kịch bản: ở lượt gom thật của crm, máy viết một lý do lẻ kiểu «trùng nhóm G2», hoặc một tên nhóm có mã việc, thì `--cau` thoát 1, máy sửa rồi commit, và số «chủ kho sửa» tăng trong khi người chưa chạm gì. Cách sửa đúng tầng: dời mốc thành «commit đầu tiên mà cả răng lẫn `--cau` xanh», hoặc chạy GOM-CAU trước khi chốt mốc. Design 2026-10-12 và hồ sơ không có chỗ nào bàn tới mốc này (grep «MỐC», «1/5» đều rỗng).
Vì sao ngoài hợp đồng: mốc đếm và ngưỡng UAT thuộc hồ sơ cua-tin-hieu-gom-nhom (L3); AC-8 của hợp đồng này chỉ đòi khối lệnh chạy đúng, đúng vị trí, và SKILL nói tên nhóm/lý do hiện nguyên văn.

### Mục 2 — Cờ đọc-cũ và tài liệu ghi «kit ≥ 2.28»
Vị trí: `scripts/tin-hieu.mjs:276` · Nguồn: conventions · Đề xuất: new-contract
Chi tiết: Chuỗi CO_BAN_VE_CU là cờ vàng mà bản chiếu của kho tiêu thụ hiện cho người. Nó dặn «vẽ lại bằng kit ≥ 2.28». skills/acceptance/references/lo-trinh-du-lieu.md dòng 135, 143, 145 cũng ghi «(kit ≥ 2.28)», «Trang vẽ bằng kit cũ (trước 2.28)», «Vẽ lại trang bằng kit ≥ 2.28 thì cờ tự hết». Nhưng sổ quyết định d-20261012T102941Z-9 ghi «Vòng dời từ mốc 2.28 sang mốc sau». Tag v2.28.0 trỏ đúng commit base 72eb55f3, và `git show v2.28.0:scripts/tin-hieu.mjs | grep -c cau_nguoi_gui` = 0. Hệ quả: kho đã nâng lên 2.28 rồi vẽ lại trang vẫn không có `cau_nguoi_gui`, cờ không hết, mà cờ và tài liệu lại bảo 2.28 là đủ. Đây là chỉ dẫn sai giao cho kho tiêu thụ. CN-7 chỉ ghim «bản vẽ cũ» nên không bắt được. Nên ghi đúng mốc sẽ cắt, hoặc bỏ số phiên bản khỏi chuỗi cờ. Phần contract §Mốc «2.28» cũng đã cũ.
Vì sao ngoài hợp đồng: không AC nào ghim số phiên bản trong chữ cờ vàng hay tài liệu (AC-7 chỉ ghim «bản vẽ cũ»); số mốc 2.28 chỉ nằm ở mục Notes, không phải tiêu chí.

### Mục 3 — SKILL bỏ sót hai lớp lỗi phiên gom không tự sửa được
Vị trí: `skills/gom-tin-hieu/SKILL.md:96` · Nguồn: conventions · Đề xuất: known-limits
Chi tiết: kiemCau (scripts/tin-hieu.mjs:410) đẩy thêm lỗi «hồ sơ X có chữ ký mà không đọc được ngày «…»» vào cùng mã thoát 1. Câu «đã phủ» lại lấy câu giao từ `feature` trong contract của hồ sơ đã giao (ca CN-5 'feature-ho-so' chứng nó làm đỏ). SKILL dòng 96–100 chỉ dặn hai đường: «viết lại tên nhóm hoặc lý do… chạy lại… tới xanh», và báo chủ kho khi câu giao trong TỆP LỘ TRÌNH lọt. Cả hai lớp kể trên đều không sửa được bằng cách đổi tên nhóm hay lý do, và nguồn của chúng là hồ sơ đã ký (không được kéo vào diff). Phiên theo SKILL sẽ lặp «chạy lại tới xanh» không bao giờ hội tụ, hoặc sửa nhầm hồ sơ đã ký. Khuôn tín hiệu (tin-hieu-template.md §«Câu cho người gửi») cũng không nêu lớp chữ ký. Nên thêm cùng lối ra «báo chủ kho» cho hai lớp này.
Vì sao ngoài hợp đồng: AC-8 không đòi SKILL liệt kê các lối ra khi phép kiểm đỏ; AC-5 chỉ đòi phép kiểm thoát 1 ở các ca đó, và nó đang làm đúng như vậy.

### Mục 4 — tinhTrangCua chép lại phép phân nhóm tiến độ
Vị trí: `scripts/tin-hieu.mjs:253` · Nguồn: conventions · Đề xuất: known-limits
Chi tiết: scripts/lo-trinh.mjs:426–429 ghi rõ: «Nhóm tiến độ của một chữ trạng thái — MỘT hàm cho thanh tiến độ của thẻ và cho khối dữ liệu … trang và dữ liệu không thể chia khác nhau». tinhTrangCua dựng lại đúng biểu thức ấy (DA_GIAO_O → DANG_LAM_O → CHUA_MO/CHUA_LAM_O → khác) bằng hằng số import về, trong khi hàm gốc (không export) dùng `kq.daGiao`, `nhom.dangLam`, `nhom.chuaLam`. Hôm nay hai bên cho cùng kết quả. Nhưng `cau_nguoi_gui` nằm trong CHÍNH khối dữ liệu lộ trình, cạnh `hang.nhom_trang_thai`: hễ ai đổi `nhomTienDo` thì câu cho người gửi và màu/đếm của hàng trôi khỏi nhau. CN-3 chỉ so trên ba nhóm của kho thử và so với bản tính độc lập trong ca, không so với chính `nhomTienDo`. Cách này trái nếp «import, không chép» mà chính tệp này áp cho DA_THONG_CONG_2 và boNgoacNgoai. Nên export `nhomTienDo` (hoặc một vị từ chung) rồi gọi. Phụ: `KHONG_SUY` được import ở dòng 29 nhưng không dùng.
Vì sao ngoài hợp đồng: hôm nay hai bên cho cùng kết quả nên AC-3 không hỏng; sửa đúng tầng cần export từ scripts/lo-trinh.mjs, thứ mà mục Out of scope đã loại.

### Mục 5 — CN-6-do3 thiếu đối chứng dương
Vị trí: `tests/scripts/tin-hieu.test.mjs:773` · Nguồn: conventions · Đề xuất: known-limits
Chi tiết: Đầu tệp ca ghi «Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO … SAU khi bản lành xanh». CLAUDE.md đòi mọi ca kết luận từ «exit khác 0» phải có (a) bản nguyên vẹn XANH trước và (b) ghim đúng thông điệp. CN-6-do3 chỉ chạy bản sao đã xoá khối TIN-HIEU-CAU-CAM rồi ghim stderr; nó không chạy `th(KIT, r, '--cau')` trên cùng kho `r` để chứng kho ấy xanh với vật lành. CN-6-do2 (dòng 760) cũng có câu PASS «N câu đang xanh thành đỏ», nhưng chưa từng chạy bản lành trên kho `r` của nó: bản lành `cn6(KIT)` chạy trên một kho khác. Thông điệp được ghim nên rủi ro xanh giả thấp, nhưng vế (a) vắng hẳn. Theo luật «sửa theo LỚP», nên thêm lượt bản lành trên cùng kho cho cả hai ca.
Vì sao ngoài hợp đồng: thông điệp lỗi được ghim đúng tên khối nên vế «khối vắng → thoát 2 nêu tên khối» của AC-6 vẫn được chứng minh; thiếu đối chứng dương là lệch nếp kiểm của kho, không phải AC hỏng.

### Mục 6 — Chữ ký crm dạng ngày/tháng/năm bị coi là không đọc được ngày
Vị trí: `scripts/tin-hieu.mjs:266` · Nguồn: bugs · Đề xuất: new-contract
Chi tiết: `ngayKy` và `chuKyKhongNgay` (dòng 266–274) chỉ nhận ngày dạng `YYYY-MM-DD`. Thiết kế dựa trên một số đo ghi «mọi chữ ký của kit và crm đều dạng này», nhưng số đo đó sai ngay ở sha crm đã ghim (06e34d26): hồ sơ `_acceptance/nen-chat-ai-elements/` có `status: signed-off` và chữ ký `human_signoff: Mạnh 10/09/2026 — ký lại trên bằng chứng vòng 7 …`. Tôi đã chạy lại trên bản sao crm dựng bằng git archive, thêm một tín hiệu và dòng bản gom «đã phủ `crm-u7-1` — nen-chat-ai-elements». Kết quả: `--duong` cho câu `đã có trong việc "Nền chat AI Elements — …" — đã giao`, mất ngày dù người đọc vẫn đọc được ngày đó. `--cau` thoát 1 với dòng `hồ sơ nen-chat-ai-elements có chữ ký mà không đọc được ngày «Mạnh 10/09/2026 — …»`, và dòng tóm tắt in «1 câu lọt» dù câu đó không lọt mã nào. Hồ sơ này nằm trong danh sách việc đã giao mà `--chua-gom` đưa cho phiên gom để chọn đích «đã phủ», nên ca này xảy ra được ngay ở lượt gom thật đầu tiên của crm. Theo SKILL gom, lỗi đỏ kiểu này không sửa được (chữ ký là của người), nên lệnh không thể về xanh. Ngoài ra, phép kiểm chữ ký áp lên mọi hồ sơ `hoSoKy` chứ không chỉ hồ sơ đã giao như design §3 ghi.
Vì sao ngoài hợp đồng: hành vi đang đúng chữ AC-5 (không đọc được ngày thì thoát 1) và AC-9 chỉ đòi một hồ sơ đã giao thật có ngày đọc được; chỗ sai là giả định «mọi chữ ký dạng ISO» của thiết kế, tức hợp đồng thiếu chứ không phải AC hỏng.

### Mục 7 — Phép đo crm thật lọc bỏ hồ sơ có ngày ký không theo dạng ISO
Vị trí: `_acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs:82` · Nguồn: bugs · Đề xuất: new-contract
Chi tiết: Đích «đã phủ» được chọn bằng điều kiện `st.daGiao && st.feature && ngayDocLap(ev)`, trong đó `ngayDocLap` (dòng 44) chỉ khớp `YYYY-MM-DD` trên dòng human_signoff. Vì vậy hồ sơ crm đã ký `nen-chat-ai-elements` (chữ ký «Mạnh 10/09/2026 — …») bị bỏ qua lặng lẽ, và AC-9 («đo trên DỮ LIỆU THẬT») báo PASS: CRM-xanh dù cùng bản sao đó có một đích đã phủ làm `--cau` thoát 1 (xem mục 6). Bộ đo dùng chung giả định của vật về định dạng ngày, nên chiều đỏ có thật trên crm không bao giờ vào phép đo.
Vì sao ngoài hợp đồng: AC-9 chỉ đòi «một hồ sơ đã giao thật» và phép đo đã đạt đúng chữ đó; chiều đỏ trên chữ ký kiểu ngày/tháng/năm là phần hợp đồng chưa nêu, đi cùng mục 6.

### Mục 8 — SKILL gom không có cách xử lý dòng đỏ chữ ký / mã lọt qua `feature`
Vị trí: `skills/gom-tin-hieu/SKILL.md:96` · Nguồn: bugs · Đề xuất: known-limits
Chi tiết: Đoạn hướng dẫn khi `--cau` thoát 1 chỉ nêu hai cách sửa: viết lại tên nhóm hoặc lý do, và báo chủ kho sửa câu giao trong tệp lộ trình. Rồi nó bảo phiên «chạy lại răng và lệnh này tới xanh». Nhưng `kiemCau` còn đỏ ở hai ca khác. Một là `hồ sơ <slug> có chữ ký mà không đọc được ngày` (tin-hieu.mjs dòng 410), là trường Cổng Bằng chứng của người. Hai là mã lọt từ `feature` trong hợp đồng của hồ sơ phủ, là tệp ý định của người chứ không phải câu giao trong lộ trình. Gặp hai ca này, phiên gom làm theo SKILL không thể về xanh: hoặc lặp mãi, hoặc tự xoay xở, kể cả sửa `human_signoff`. Trên crm ở sha đã ghim, ca thứ nhất tái hiện được (xem mục 6).
Vì sao ngoài hợp đồng: trùng lớp với mục 3: không AC nào đòi SKILL nêu lối ra cho các ca đỏ không tự sửa được; AC-8 chỉ đòi chạy khối, vị trí khối và việc hiện nguyên văn.

### Mục 9 — Ma trận đỏ CN-5 chỉ phủ 4 trong 7 loại mã
Vị trí: `tests/scripts/tin-hieu.test.mjs:696` · Nguồn: measurement · Đề xuất: known-limits
Chi tiết: boMa (scripts/tin-hieu.mjs:384) and the template's policy text (tin-hieu-template.md: «mã của kho (id tín hiệu, mã nhóm, mã/slug việc, tên hồ sơ…)») declare one class of repo codes: signal id · group code · batch (dot) · row code · row slug · horizon code · case-folder name. The CN-5 red matrix (lines 696-702) has 5 point cases covering only signal id, case folder, group code and row code. The only red mutant on the code set, CN-5-do, removes the case folders. Measured on a scratch copy: removing `them(bg.dot)`, `them(h.slug)` and `them(c.ma)` from boMa leaves CN-1, CN-4, CN-5, CN-5-do, CN-5-do2, CN-6, CN-8 and CN-8-do all green. CN-1 scans for codes with the test's own MA list, so it checks the sentence builder, not the --cau checker. No matrix over the full class is written in advance (count of asserts = count of code kinds).
Vì sao ngoài hợp đồng: ma trận đỏ viết sẵn trong AC-5 chỉ kê năm ca (id tín hiệu, tên hồ sơ, mã nhóm, mã việc) và bộ kiểm phủ đúng các ca đó; ba loại mã còn lại nằm ngoài danh sách AC.

### Mục 10 — CN-8-do ghim 'GOM-CAU' là tiền tố của mọi thông điệp
Vị trí: `tests/scripts/tin-hieu.test.mjs:825` · Nguồn: measurement · Đề xuất: known-limits
Chi tiết: chayDo('CN-8-do', …, 'GOM-CAU') accepts any message containing 'GOM-CAU'. Every message cn8 returns starts with 'GOM-CAU:' (lines 812 missing block, 817 clean run exits non-zero, 818 red run is wrong, 820 ordering, 821 surrounding text). The pin is therefore equivalent to 'some failure'. It cannot tell «the command in the block fails to run» (the promise: the block is run verbatim) apart from any other failure in the case. Pin the specific signal instead, e.g. 'xanh thoát' plus the exit code or the 'tham số lạ' stderr.
Vì sao ngoài hợp đồng: các vế chính của AC-8 (khối chạy xanh trên kho sạch, đỏ trên kho lọt mã, đúng vị trí) đã có ca kiểm riêng; chỉ ca đột biến phụ có điểm ghim lỏng.

### Mục 11 — CN-6-do3 không có đối chứng dương trên cùng kho
Vị trí: `tests/scripts/tin-hieu.test.mjs:773` · Nguồn: measurement · Đề xuất: known-limits
Chi tiết: CN-6-do3 does not go through chayDo. It builds repo r and runs --cau only on the template copy with the marker removed, asserting exit 2 + stderr containing 'TIN-HIEU-CAU-CAM'. It never runs the intact template on that same r to confirm --cau exits 0 first. The message pin is specific, which reduces the risk, but the repo invariant requires both a positive control and a pinned message for every exit-non-zero case built on a copy. This case is the only CN red case without a green baseline (the other inline case, CN-6-do2, does run `cn6(KIT)` first).
Vì sao ngoài hợp đồng: trùng mục 5: thông điệp được ghim đúng tên khối nên AC-6 vẫn được chứng minh, chỉ thiếu đối chứng dương theo nếp của kho. (Lưu ý: mục 5 nêu CN-6-do2 cũng chưa chạy bản lành trên cùng kho `r` của nó; mục này nói CN-6-do2 có chạy `cn6(KIT)` trước. Hai nhận định lệch nhau về CN-6-do2, người quyết đọc lại hai ca khi xử lý.)

### Mục 12 — Ma trận nhóm tiến độ CN-3 so với bản chép công thức của chính mã
Vị trí: `tests/scripts/tin-hieu.test.mjs:624` · Nguồn: measurement · Đề xuất: known-limits
Chi tiết: AC-3 promises that the group of each phrase equals the progress group the data block computes for that status text. The block writes nhom_trang_thai with the private nhomTienDo (scripts/lo-trinh.mjs:428). The matrix's oracle `nhomDocLap` (line 624) is a character-for-character copy of the formula in tinhTrangCua (scripts/tin-hieu.mjs:253), so `r.nhom !== nhomDocLap(...)` compares the code with a copy of itself. A real round-trip (draw LO-TRINH.html, read nhom_trang_thai) happens only in the repo part, and only for 3 groups (line 648 `nhomGap.size !== 3`). Every member of the 'khac' group (xep-lai, da-bac, ngoai-pham-vi, hong, KHONG_SUY, unknown text) is never round-tripped through the block. If lo-trinh changes how nhomTienDo groups those statuses, CN-3 stays green.
Vì sao ngoài hợp đồng: AC-3 đã nêu rõ phép đi-về thật chỉ trên ba nhóm (đã giao · đang làm · chưa bắt đầu) và bộ kiểm làm đúng như vậy; nhóm «khác» chưa đi-về là ngoài chữ AC.

### Mục 13 — Bộ mã của CN-1 viết tay mã nhóm và mã đợt
Vị trí: `tests/scripts/tin-hieu.test.mjs:570` · Nguồn: measurement · Đề xuất: known-limits
Chi tiết: E1 says «tập mã rút từ chính kho thử trong ca». Line 570 does extract signal ids, roadmap and folders from the repo, but writes `'G1', 'G2', 'G3', 'G6', 'gom-1'` by hand instead of reading docs/gom/gom-1.md in r. If khoCau (line 539) gains or renames a group, the code-leak scan in CN-1 silently misses that code.
Vì sao ngoài hợp đồng: kho thử vẫn do mã sinh và hôm nay danh sách mã viết tay khớp với kho; AC-1 không hỏng, chỉ có rủi ro lệch khi sau này đổi dữ liệu thử.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
