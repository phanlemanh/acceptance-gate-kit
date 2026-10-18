# Review findings: ho-so-da-ky-giu-tuoi (round 3)

## Trong hợp đồng

Không có phát hiện nào map được vào AC ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lần chạy lại lưới không kiểm vượt trần — luật «vượt trần thì FAIL, không xanh» đã khai bị bỏ qua ở nhánh thử lại**
  Người dùng thấy gì: Khi máy quá tải đến mức cả hai bản cùng bị ngắt giữa chừng ở chính chỗ nhau, phép so sánh trên các kho thật có thể báo «giống nhau» dù chưa chạy xong lần nào. Trường hợp thường gặp hơn là chỉ một bản bị ngắt: vẫn báo đỏ nhưng nêu sai lý do.
  Căn cứ: Màu xanh giả chỉ xảy ra khi cả hai bản cùng bị ngắt giống hệt nhau, rất hiếm. Phép so này người chạy lại được, và không ảnh hưởng gì tới người dùng cuối của bản phát hành.
  file: `tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Phần mô tả phép đo và nhãn dòng kết quả chưa cập nhật theo bộ lọc Broken pipe và lượt chạy lại tuần tự**
  Người dùng thấy gì: Người đọc bản ghi kết quả có thể hiểu sai thời gian chạy (tưởng chạy song song trong khi có cả lượt chạy lại nối tiếp) và không biết bộ đo đã bỏ qua những dòng nhiễu nào. Kết quả pass/fail không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ: chỉ gây hiểu sai con số thời gian khi đọc, không làm sai phán quyết, và chữa sau rất rẻ nếu có ai vướng.
  file: `tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs`
  severity: low
  Đề xuất: wont-fix

- **Lượt chạy lại lưới bỏ qua kiểm hết giờ (hetGio): hai lượt cùng bị cắt ở trần có thể so bằng nhau và đếm là xanh**
  Người dùng thấy gì: Khi máy quá tải đến mức cả hai bản cùng bị cắt giống hệt nhau, phép so sánh trên kho thật có thể báo xanh dù lưới chưa từng chạy xong. Nếu chỉ một bản bị cắt thì vẫn đỏ nhưng nêu sai nguyên nhân.
  Căn cứ: Lỗi trùng với mục trên, chỉ xảy ra khi máy quá tải và cả hai bản bị cắt giống nhau; người chạy lại được và người dùng cuối không bị ảnh hưởng.
  file: `tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **E5 now tests the 'infrastructure baseline never counts' rule, but its paths omit the files that hold that rule (r2)**
  Người dùng thấy gì: Nếu sau này một thay đổi làm hỏng đúng luật «đỏ do hạ tầng không bao giờ làm nền», hệ thống vẫn báo đỏ nhưng không chỉ đúng thay đổi gây ra, mà liệt kê mọi thay đổi đã gộp là nghi can.
  Căn cứ: Chỉ làm báo lỗi kém chính xác về thủ phạm chứ không để lọt lỗi hay mất dữ liệu, người dùng vẫn thấy đỏ và tự lần được, sửa sau rẻ.
  file: `_acceptance/ho-so-da-ky-giu-tuoi/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Header of evals.yaml describes the red-direction baseline differently from the code (r2)**
  Người dùng thấy gì: Người đọc ghi chú đầu bộ kiểm có thể dựng lại chiều đỏ trên nhầm bản gốc nên thấy kết quả khác với báo cáo. Hành vi của sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ gây nhầm cho người kiểm tra lại, không đụng tới người dùng cuối, không mất dữ liệu, và sửa một dòng chú thích là xong.
  file: `_acceptance/ho-so-da-ky-giu-tuoi/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Liên kết node_modules vào cây tạm làm lần chạy lại ở <từ> dùng mã gói nội bộ của đỉnh, nên lỗi do PR bị ghi thành «đỏ sẵn trước khoảng» (r2)**
  Người dùng thấy gì: Ở kho nhiều gói nội bộ, một thay đổi làm hỏng gói có thể bị ghi nhầm là «đỏ sẵn từ trước», không gọi tên thay đổi gây lỗi. Về sau các vòng khác gặp đúng lỗi đó sẽ được cho đi tiếp như thể lỗi cũ, nên lỗi thật lọt qua mà không báo.
  Căn cứ: Hậu quả nặng vì lỗi lọt về phía xanh trong im lặng và làm mờ cổng chặn ở các kho nhiều gói, người dùng không tự phát hiện được; nhưng chỉ xảy ra ở loại kho này và cần thiết kế riêng nên không vá gọn trong vòng này.
  file: `feature-loop/scripts/giu-tuoi.mjs`
  severity: high
  Đề xuất: new-contract

- **Lớp hạ tầng xét theo từng eval nhưng ket_cuc của dòng nền xét theo cả hồ sơ, nên eval chập chờn hoặc mã 127 vẫn được làm nền (r2)**
  Người dùng thấy gì: Khi một hồ sơ có một mục đỏ thật do thay đổi và một mục khác đỏ chập chờn vì hạ tầng, mục chập chờn vẫn có thể được ghi làm nền. Vòng sau gặp lại đúng lỗi chập chờn ấy sẽ được cho qua với nhãn «đỏ sẵn trên nền» dù luật nói đỏ hạ tầng không bao giờ làm nền.
  Căn cứ: Làm cổng nới lỏng sai chỗ cho lỗi chập chờn, nhưng chỉ khi hồ sơ trộn nhiều lớp lỗi cùng lúc, và người dùng vẫn thấy mục ấy đỏ trên thẻ; sửa cần quyết định lại cách ghi nền theo từng mục.
  file: `lib/do-san-tren-nen.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case) và 3: ca băm thêm «ca đỏ thứ 13» bị nhiễu vì số đếm tổng kết cũng đổi, nên không ca nào canh việc nhận dòng (fail) của bun (r2)**
  Người dùng thấy gì: Một ca đỏ mới nằm ngoài danh sách tên được ghi nhận có thể không bị bộ kiểm bắt nếu chỉ khác ở một kiểu dòng báo hỏng của một trình chạy test. Khi đó lỗi mới có thể lọt qua dưới nhãn «đỏ sẵn trên nền».
  Căn cứ: Là lỗ hổng của chính bộ kiểm ở một biến thể hiếm, người dùng chưa gặp trực tiếp, và theo luật kit không mở vòng đo-thước-của-thước nên ghi lại là đủ.
  file: `tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert «có mặt» trong khi lời hứa là QUAN HỆ): lỗi môi trường ở đầu khoảng chỉ được đo phía «có ở <từ>», chưa đo phía «đỉnh cũng có» (r2)**
  Người dùng thấy gì: Một lỗi đỏ thật có thể bị xếp nhầm là «hạ tầng» nên không gọi tên thay đổi gây ra, nếu lời lỗi giống một mẫu thiếu tệp phổ biến và đỉnh cũng in đúng dòng đó. Bộ kiểm hiện chưa canh trường hợp này.
  Căn cứ: Mức nhẹ, chưa chạy thử xác nhận, hậu quả chỉ là báo kém chính xác thủ phạm chứ không để lọt lỗi lên sản phẩm, người dùng vẫn thấy đỏ và sửa sau rẻ.
  file: `tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Base-line rule accepts 'ha-tang' lines, so infrastructure or flaky reds become «đỏ sẵn trên nền» (r1)**
  Người dùng thấy gì: Một lỗi do máy chạy hỏng hoặc chập chờn có thể bị coi như «đỏ sẵn trên nền», nên vòng khác có thể đi tiếp dù cái đỏ không thật sự nằm trên nhánh chính.
  Căn cứ: Hậu quả nhẹ đến vừa vì chỉ xảy ra khi cùng một lỗi hạ tầng lặp lại đúng nguyên văn, thẻ vẫn hiện đỏ để người thấy, và dòng sổ cho phép lần ngược; sửa sau vẫn rẻ.
  file: `lib/do-san-tren-nen.cjs`
  severity: medium
  Đề xuất: known-limits

- **Reader accepts a `do_san` entry that has no `run_id`: it matches ANY base line (r1)**
  Người dùng thấy gì: Nếu ai đó sửa tay dòng ghim lại và bỏ mã lượt nền, cổng vẫn có thể trao nhãn «đỏ sẵn trên nền» cho một cái đỏ chưa được đối chiếu đúng lượt.
  Căn cứ: Chỉ xảy ra khi dòng sổ bị sửa tay (công cụ ghi luôn điền đủ), nhãn vẫn hiện trên thẻ nên không âm thầm, và người dùng không mất dữ liệu.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **The «không chữ ĐẠT» assertion for the map and the card is a negative-only check that can never go red (r1)**
  Người dùng thấy gì: Kiểm tra rằng thẻ và bản đồ không ghi «ĐẠT» cho hồ sơ đỏ sẵn thì không bao giờ báo đỏ được, nên nếu sau này bản đồ ghi nhầm kiểu «xanh sạch» thì không ai biết.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì vật hiện chưa in chữ đó; chỉ là lưới an toàn yếu cho các lần sửa sau, tự phát hiện được khi đọc thẻ.
  file: `tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bước chạy lại ở <từ> dùng cây tạm không có phụ thuộc đã cài, nên ở kho có node_modules mọi eval đỏ đều bị quy nhầm về PR (r1)**
  Người dùng thấy gì: Ở kho thật có thư viện cài sẵn, lệnh giữ tươi có thể kết luận sai là một PR vô tội đã làm đỏ hồ sơ, vì lần chạy thử ở điểm gốc luôn lỗi thiếu thư viện.
  Căn cứ: Hậu quả khá nặng vì gọi tên nhầm PR làm mất lòng tin vào bảng quy lỗi và có thể khiến người đi tìm sai chỗ; không mất dữ liệu, nhưng sửa cần một vòng riêng vì phải đo trên kho có phụ thuộc thật.
  file: `feature-loop/scripts/giu-tuoi.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phía đọc (lưới trước-gộp, kiểm lại) không đòi dòng nền phải nằm trên nhánh chính: một dòng nen-do ghi ngay trên nhánh vòng vẫn được nhãn (r1)**
  Người dùng thấy gì: Một dòng nền do chính nhánh vòng tự ghi có thể được lưới trước-gộp chấp nhận như thể cái đỏ đã nằm sẵn trên nhánh chính.
  Căn cứ: Cần cố ý ghi dòng nền trên nhánh hoặc sửa tay mới xảy ra, thẻ vẫn hiện nhãn cho người thấy, và gỡ chỉ cần xoá dòng đó; rủi ro thấp trong vận hành bình thường.
  file: `lib/do-san-tren-nen.cjs`
  severity: medium
  Đề xuất: known-limits

- **Băm «định nghĩa eval» bỏ sót lệnh thật khi eval khai `cmd: config:…` (r1)**
  Người dùng thấy gì: Nếu ai đổi lệnh đo ở nơi khác với eval khai kiểu tham chiếu, hệ thống vẫn coi phép đo là không đổi và có thể giữ nhãn «đỏ sẵn trên nền» cho một phép đo đã khác.
  Căn cứ: Khả năng xảy ra thấp (phải đổi lệnh đo giữa lúc đang đỏ sẵn), kết quả vẫn hiện đỏ trên thẻ, và sửa sau không đắt.
  file: `lib/do-san-tren-nen.cjs`
  severity: low
  Đề xuất: known-limits

- **Không có ứng viên nào vẫn bị xếp `nhieu-pr` với danh sách rỗng (r1)**
  Người dùng thấy gì: Trong ca hiếm, bảng báo «nhiều PR cùng chạm» nhưng danh sách trống, làm người đọc khó hiểu vì sao hồ sơ đỏ.
  Căn cứ: Chỉ là câu chữ gây bối rối trong ca rất hiếm, không quy lỗi nhầm cho PR nào và không mất dữ liệu nên chi phí sửa vượt hậu quả.
  file: `feature-loop/scripts/giu-tuoi.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (ma trận lớp không đủ phần tử): bảng đếm tệp chạm sổ chạy khai 20 nhưng HEAD có 21 — lệnh giữ tươi là bên đọc sổ chạy chưa khai, ca đang ĐỎ (r1)**
  Người dùng thấy gì: Bộ kiểm tra chung của kho đang đỏ một ca vì lệnh mới chưa được khai vào bảng, nên bản phát hành kế tiếp sẽ bị chặn cho đến khi bảng được cập nhật.
  Căn cứ: Không ảnh hưởng người dùng cuối nhưng làm đỏ bộ kiểm tra chung nên chặn gộp; sửa rẻ và chắc chắn nhưng nằm ngoài các tiêu chí đã ký.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 (ma trận lớp không đủ phần tử): bảng BEN_DOC thiếu giu-tuoi.mjs, LB1 đỏ và mất luôn đối chứng dương của LB2 (r1)**
  Người dùng thấy gì: Hai ca của bộ kiểm tra chung đang đỏ vì lệnh mới chưa được xếp vào bảng phân loại, và lưới bắt lỗi đọc thiếu cũng mất đối chứng đúng của nó.
  Căn cứ: Không ảnh hưởng người dùng cuối nhưng làm đỏ bộ kiểm tra chung nên chặn gộp và làm yếu lưới an toàn; sửa rẻ, nằm ngoài tiêu chí đã ký.
  file: `tests/scripts/evals-sat-le.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ca GT7 và GT9 đo bốn bên đọc trên dòng nen-do do fixture ráp, không do lệnh giữ tươi viết (r1)**
  Người dùng thấy gì: Hai phép kiểm đọc nhãn dùng dòng nền dựng tay chứ không phải dòng do lệnh thật ghi, nên nếu hai bên lệch khuôn thì các phép kiểm này không thấy.
  Căn cứ: Rủi ro thấp vì các ca khác đã so khuôn bên viết thật, người dùng không bị ảnh hưởng trực tiếp và sửa sau không đắt.
  file: `tests/scripts/giu-tuoi-fixture.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
