# Review findings: ho-so-da-ky-giu-tuoi (round 1)

## Trong hợp đồng

- **Băm thông điệp đỏ không thấy ca đỏ MỚI khi eval đã có ≥10 dòng ca đỏ, hoặc khi bộ chạy không in tên ca theo khuôn: một hồi quy mới vẫn được nhãn «đỏ sẵn trên nền» và lọt qua cổng**
  AC: AC-6
  file: `lib/do-san-tren-nen.cjs:67`
  severity: high
  source: bugs
  detail: bamThongDiep chỉ băm đoạn quanh các tên ca do rutTenCa trả về. rutTenCa (feature-loop/scripts/lib/chay-lai.mjs:52) dừng ở 10 dòng khớp. Bun in mỗi ca đỏ hai lần (một lần tại chỗ, một lần ở phần tổng kết), nên chỉ cần 5 ca đỏ là đầy 10 chỗ. Từ đó mọi ca đỏ thêm vào, kể cả với lỗi hoàn toàn mới, đều không vào băm. Dòng tổng kết «N fail» nằm ngoài cửa sổ ±6 dòng nên cũng không đổi được băm. Khi không rút được tên ca nào (ví dụ khuôn «FAIL: GTn» của chính kit), băm chỉ lấy 20 dòng cuối, nên một dòng FAIL mới in ra sớm hơn cũng lọt. Đã chạy thử: log kiểu bun có 12 ca đỏ và log có thêm '(fail) ca-MOI' kèm 'TypeError: boom totally new', số tổng kết 12→13, cho CÙNG một băm. Log khuôn FAIL: thêm 'FAIL: GT9' ở đầu cũng cho CÙNG một băm. Hệ quả: lượt ghim lại thấy kiemDoSan đạt, gắn do_san, và lưới trước-gộp cùng kiểm lại đều chấp nhận. Một PR làm hỏng thêm ca ở eval đã đỏ sẵn đi qua cổng. Điều này trái AC-6 («E1 đỏ ở ca khác → thoát 1»), và Known limits chỉ khai trường hợp ĐÚNG ca, ĐÚNG thông điệp.
  Căn cứ phân loại: AC-6 đòi «E1 đỏ ở ca khác → thoát 1», và finding tái hiện ca đỏ mới cho cùng băm nên cổng cho qua, tức vế này thất bại ngoài các ô nhỏ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Base-line rule accepts 'ha-tang' lines, so infrastructure or flaky reds become «đỏ sẵn trên nền»**
  Người dùng thấy gì: Một lỗi do máy chạy hỏng hoặc chập chờn có thể bị coi như «đỏ sẵn trên nền», nên vòng khác có thể đi tiếp dù cái đỏ không thật sự nằm trên nhánh chính.
  Căn cứ: Hậu quả nhẹ đến vừa vì chỉ xảy ra khi cùng một lỗi hạ tầng lặp lại đúng nguyên văn, thẻ vẫn hiện đỏ để người thấy, và dòng sổ cho phép lần ngược; sửa sau vẫn rẻ.
  file: `lib/do-san-tren-nen.cjs`
  severity: medium
  Đề xuất: known-limits

- **Reader accepts a `do_san` entry that has no `run_id`: it matches ANY base line**
  Người dùng thấy gì: Nếu ai đó sửa tay dòng ghim lại và bỏ mã lượt nền, cổng vẫn có thể trao nhãn «đỏ sẵn trên nền» cho một cái đỏ chưa được đối chiếu đúng lượt.
  Căn cứ: Chỉ xảy ra khi dòng sổ bị sửa tay (công cụ ghi luôn điền đủ), nhãn vẫn hiện trên thẻ nên không âm thầm, và người dùng không mất dữ liệu.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **The «không chữ ĐẠT» assertion for the map and the card is a negative-only check that can never go red**
  Người dùng thấy gì: Kiểm tra rằng thẻ và bản đồ không ghi «ĐẠT» cho hồ sơ đỏ sẵn thì không bao giờ báo đỏ được, nên nếu sau này bản đồ ghi nhầm kiểu «xanh sạch» thì không ai biết.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì vật hiện chưa in chữ đó; chỉ là lưới an toàn yếu cho các lần sửa sau, tự phát hiện được khi đọc thẻ.
  file: `tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bước chạy lại ở <từ> dùng cây tạm không có phụ thuộc đã cài, nên ở kho có node_modules mọi eval đỏ đều bị quy nhầm về PR**
  Người dùng thấy gì: Ở kho thật có thư viện cài sẵn, lệnh giữ tươi có thể kết luận sai là một PR vô tội đã làm đỏ hồ sơ, vì lần chạy thử ở điểm gốc luôn lỗi thiếu thư viện.
  Căn cứ: Hậu quả khá nặng vì gọi tên nhầm PR làm mất lòng tin vào bảng quy lỗi và có thể khiến người đi tìm sai chỗ; không mất dữ liệu, nhưng sửa cần một vòng riêng vì phải đo trên kho có phụ thuộc thật.
  file: `feature-loop/scripts/giu-tuoi.mjs`
  severity: medium
  Đề xuất: new-contract

- **Phía đọc (lưới trước-gộp, kiểm lại) không đòi dòng nền phải nằm trên nhánh chính: một dòng nen-do ghi ngay trên nhánh vòng vẫn được nhãn**
  Người dùng thấy gì: Một dòng nền do chính nhánh vòng tự ghi có thể được lưới trước-gộp chấp nhận như thể cái đỏ đã nằm sẵn trên nhánh chính.
  Căn cứ: Cần cố ý ghi dòng nền trên nhánh hoặc sửa tay mới xảy ra, thẻ vẫn hiện nhãn cho người thấy, và gỡ chỉ cần xoá dòng đó; rủi ro thấp trong vận hành bình thường.
  file: `lib/do-san-tren-nen.cjs`
  severity: medium
  Đề xuất: known-limits

- **Băm «định nghĩa eval» bỏ sót lệnh thật khi eval khai `cmd: config:…`**
  Người dùng thấy gì: Nếu ai đổi lệnh đo ở nơi khác với eval khai kiểu tham chiếu, hệ thống vẫn coi phép đo là không đổi và có thể giữ nhãn «đỏ sẵn trên nền» cho một phép đo đã khác.
  Căn cứ: Khả năng xảy ra thấp (phải đổi lệnh đo giữa lúc đang đỏ sẵn), kết quả vẫn hiện đỏ trên thẻ, và sửa sau không đắt.
  file: `lib/do-san-tren-nen.cjs`
  severity: low
  Đề xuất: known-limits

- **Không có ứng viên nào vẫn bị xếp `nhieu-pr` với danh sách rỗng**
  Người dùng thấy gì: Trong ca hiếm, bảng báo «nhiều PR cùng chạm» nhưng danh sách trống, làm người đọc khó hiểu vì sao hồ sơ đỏ.
  Căn cứ: Chỉ là câu chữ gây bối rối trong ca rất hiếm, không quy lỗi nhầm cho PR nào và không mất dữ liệu nên chi phí sửa vượt hậu quả.
  file: `feature-loop/scripts/giu-tuoi.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (ma trận lớp không đủ phần tử): bảng đếm tệp chạm sổ chạy khai 20 nhưng HEAD có 21 — lệnh giữ tươi là bên đọc sổ chạy chưa khai, ca đang ĐỎ**
  Người dùng thấy gì: Bộ kiểm tra chung của kho đang đỏ một ca vì lệnh mới chưa được khai vào bảng, nên bản phát hành kế tiếp sẽ bị chặn cho đến khi bảng được cập nhật.
  Căn cứ: Không ảnh hưởng người dùng cuối nhưng làm đỏ bộ kiểm tra chung nên chặn gộp; sửa rẻ và chắc chắn nhưng nằm ngoài các tiêu chí đã ký.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 (ma trận lớp không đủ phần tử): bảng BEN_DOC thiếu giu-tuoi.mjs, LB1 đỏ và mất luôn đối chứng dương của LB2**
  Người dùng thấy gì: Hai ca của bộ kiểm tra chung đang đỏ vì lệnh mới chưa được xếp vào bảng phân loại, và lưới bắt lỗi đọc thiếu cũng mất đối chứng đúng của nó.
  Căn cứ: Không ảnh hưởng người dùng cuối nhưng làm đỏ bộ kiểm tra chung nên chặn gộp và làm yếu lưới an toàn; sửa rẻ, nằm ngoài tiêu chí đã ký.
  file: `tests/scripts/evals-sat-le.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ca GT7 và GT9 đo bốn bên đọc trên dòng nen-do do fixture ráp, không do lệnh giữ tươi viết**
  Người dùng thấy gì: Hai phép kiểm đọc nhãn dùng dòng nền dựng tay chứ không phải dòng do lệnh thật ghi, nên nếu hai bên lệch khuôn thì các phép kiểm này không thấy.
  Căn cứ: Rủi ro thấp vì các ca khác đã so khuôn bên viết thật, người dùng không bị ảnh hưởng trực tiếp và sửa sau không đắt.
  file: `tests/scripts/giu-tuoi-fixture.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/11 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/finding-line-bo-doc.test.mjs, tests/scripts/evals-sat-le.test.mjs, tests/scripts/giu-tuoi-fixture.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
