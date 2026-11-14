# Review findings: goi-cheo-loi-dieu-phoi (round 1)

## Trong hợp đồng

- **E8 ghim một dòng PASS mà BC-8 không bao giờ in ra; vế «bố cục cũ vẫn dùng gốc kho» của AC-8 không được đo**
  file: `_acceptance/goi-cheo-loi-dieu-phoi/evals.yaml:82`
  severity: high
  AC: AC-8
  source: conventions
  detail: AC-8 có hai vế: «cả ba dùng lõi plugins/acceptance-gate/ của chính kho» và «ở bố cục cũ vẫn dùng gốc kho». Kỳ vọng của E8 ghim nguyên văn `PASS: BC-8 feature-loop tự host — giu-tuoi, thuoc-vat, carry-plan dùng <kho mới>/plugins/acceptance-gate; bố cục cũ dùng gốc kho`. Nhưng BC-8 trong rang/bo-cuc-moi.mjs chỉ chạy trên kho mới và in `... dùng <kho mới>/plugins/acceptance-gate (bộ đệm rỗng)`; chạy thật bộ dựng thấy đúng dòng này nên đầu ra không khớp kỳ vọng. Ma trận VP-1…VP-16 của E1 cũng không chạy giu-tuoi, thuoc-vat hay carry-plan. Hệ quả: vế bố cục cũ của AC-8 không có phép đo nào, và người chấm theo kỳ vọng sẽ gặp dòng PASS lệch hoặc cho qua một vế chưa ai đo. Cạnh Hạng mục↔Thước bị gãy.

- **VP-HT kết luận chiều đỏ chỉ từ «exit khác 0», không ghim thông điệp**
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs:152`
  severity: medium
  AC: AC-1
  source: conventions
  detail: Sau khi phá scripts/hop-thu/cua-tin-hieu.mjs trên bản sao, ca chỉ kiểm `pha.status !== 0 ? ok('VP-HT', ...)`. Có đối chứng dương nhưng không ghim tên ca con đỏ hay dòng FAIL mong đợi của cua-tin-hieu-goc-moi-worktree.test.mjs. Bất biến «assertion âm-tính-một-mình» đòi cả đối chứng dương và đúng thông điệp. Bản sao đỏ vì lý do khác (ném lúc nạp, hạ tầng git trong clone, ca con khác đỏ) vẫn in «PASS: VP-HT … ca cửa tín hiệu đỏ». Cùng tệp, VP-DO và BC-9-do có ghim thông điệp nên ca này lệch nếp.

- **Vế xanh của BC-8 chỉ dựa vào chỗ vắng chuỗi lỗi, không kiểm mã thoát hay bằng chứng dương**
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs:172`
  severity: low
  AC: AC-8
  source: conventions
  detail: BC-8 cho PASS khi không dòng nào của stdout/stderr khớp regex `HONG` (các chuỗi «không tìm được bộ máy», «không resolve được…», «không nạp được lib/evidence-core.cjs», «thiếu nguồn»). Không kiểm `status`, không kiểm đầu ra JSON, không chứng minh agRoot là `<kho mới>/plugins/acceptance-gate`. Khi giu-tuoi/thuoc-vat chết vì lỗi khác (`--ag-root` không tồn tại, SyntaxError, cờ đổi tên) BC-8 vẫn xanh. Chạy tay hôm nay cả hai thoát 0 với JSON hợp lệ, vật đúng, nhưng thước không phân biệt «chạy đúng» với «chết lý do khác». Nên thêm `status === 0` cùng một dấu dương, ví dụ parse được JSON.

- **VP-HT báo xanh giả: ca cửa tín hiệu đỏ chỉ vì nhát tiêm GW-1-do2 lệch, không phải vì bắt được lỗi hộp thư**
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs:151`
  severity: high
  AC: AC-1
  source: bugs
  detail: VP-HT dùng đúng nhát sửa mà GW-1-do2 của tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs tự tiêm (dòng 289): `if (fs.existsSync(tep)) return { ket: soSanh(tep, than), tep };` → ghi đè. Từ vòng này banSao() áp mỗi nhát vào CẢ HAI bản qua haiBan() và đòi chuỗi cũ khớp đúng 1 lần; ở bản hop-thu đã bị sửa trước, chuỗi khớp 0 lần nên banSao ném lỗi hạ tầng. Dựng lại trên clone --shared ở HEAD với đúng nhát phá của VP-HT cho `Results: 20 passed, 1 failed`, FAIL duy nhất là `GW-1-do2 — Error: nhát tiêm lệch … khớp 0 lần trong scripts/hop-thu/cua-tin-hieu.mjs`. Không ca lành nào bắt được việc hộp thư ghi đè ý cũ. VP-HT chỉ xét `pha.status !== 0` (dòng 156) nên luôn PASS khi lần lành xanh. Dòng «PASS: VP-HT … ca cửa tín hiệu đỏ» mà E1 ghim là chiều đỏ chưa từng đo gì. Sửa: chọn nhát phá không trùng chuỗi bộ test tự tiêm, ghim đúng thông điệp đỏ của ca lành (ví dụ «ý bị ghi đè» của ca GW-1).

- **BC-8 chỉ kiểm vắng mặt của vài chuỗi lỗi: script sập vì lỗi khác vẫn PASS**
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs:158`
  severity: medium
  AC: AC-8
  source: bugs
  detail: BC-8 chỉ đỏ khi đầu ra của giu-tuoi, thuoc-vat, carry-plan khớp HONG. Không xét mã thoát, không có bằng chứng dương cho thấy lõi `<kho mới>/plugins/acceptance-gate` được dùng. Script sập vì lỗi khác vẫn in PASS; ví dụ thiếu feature-loop/scripts/goc-loi-tu-host.mjs thì Node in `Cannot find module …goc-loi-tu-host.mjs`, hoặc SyntaxError. carry-plan còn bọc mọi lỗi thành `khác: …` (dòng 162), cũng không khớp HONG. Đây là lớp «assertion âm-tính-một-mình». CD-8 ghim chiều đỏ nhưng chiều xanh của BC-8 không phân biệt được. Chạy hôm nay: cả ba thoát 0 với đầu ra hợp lệ, vật không sai; vấn đề là thước. Sửa: đòi status 0 và một mảnh đầu ra dương cho từng script, ví dụ JSON có khoá `tu`/`vat`/`noCarry`.

- **Assertion âm-tính-một-mình (hình dạng 4): VP-HT kết luận «ca cửa tín hiệu đỏ» chỉ từ mã thoát, không ghim thông điệp, và màu đỏ thật ra đến từ hạ tầng tiêm của chính test**
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs:156`
  severity: high
  AC: AC-1
  source: measurement
  detail: Dòng 156: `pha.status !== 0 ? ok('VP-HT', 'phá scripts/hop-thu/cua-tin-hieu.mjs trên bản sao → ca cửa tín hiệu đỏ') : bad(...)`. Có đối chứng dương nhưng không ghim thông điệp. Nhát phá ở dòng 151/154 dùng đúng chuỗi mà GW-1-do2 (dòng 289 của cua-tin-hieu-goc-moi-worktree.test.mjs) tiêm. `haiBan` áp nhát của GW-1-do2 lên cả `scripts/hop-thu/cua-tin-hieu.mjs`, nên trên bản sao đã bị VP-HT phá, `banSao` ném «nhát tiêm lệch … khớp 0 lần». Tái lập trên clone --shared ở HEAD: `Results: 20 passed, 1 failed`, FAIL duy nhất là `GW-1-do2 — Error: nhát tiêm lệch`. Không ca hành vi nào (kể cả GW-1 lành) bắt được hộp thư hỏng. VP-HT in PASS nhưng điều nó định chứng minh («ca cửa tín hiệu chạm hộp thư», E1) chưa được đo: đỏ do lỗi hạ tầng bộ tiêm, không do vật.

- **Assertion âm-tính-một-mình (hình dạng 4) và chuỗi vắng thay cho quan hệ (hình dạng 3): BC-8 xanh khi cả ba script feature-loop sập**
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs:164`
  severity: high
  AC: AC-8
  source: measurement
  detail: Dòng 158–166: ca xanh chỉ khi KHÔNG dòng nào khớp `HONG = /không tìm được bộ máy|không resolve được plugin acceptance-gate|không nạp được lib\/evidence-core\.cjs|thiếu nguồn/`. Không kiểm mã thoát, đầu ra dương, hay gốc lõi đã chọn. Thông điệp PASS và E8 hứa «giu-tuoi, thuoc-vat, carry-plan dùng <kho mới>/plugins/acceptance-gate», còn E8 hứa thêm «dùng lõi khác → FAIL». Lời hứa là một QUAN HỆ (agRoot = <kho mới>/plugins/acceptance-gate) mà không phép đo nào chạm tới. Tái lập: dựng kho mới bằng dungKhoMoi rồi xoá plugins/feature-loop/scripts/goc-loi-tu-host.mjs (tệp mới của vòng); cả ba lệnh thoát 1 với ERR_MODULE_NOT_FOUND, không dòng nào khớp HONG, BC-8 vẫn in PASS. CD-8 chỉ ghim chiều đỏ trên bản gốc 593e6837, không bù được chiều xanh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bảng tên không phải một nguồn: tên chợ và nguồn chợ còn hai bản trong lõi, NGUON_CHO không có bên đọc nào**
  Người dùng thấy gì: Tên và địa chỉ chợ plugin còn được khai ở hai nơi trong kit; nếu sau này sửa một nơi mà quên nơi kia thì không có gì báo, và người dùng có thể nhận địa chỉ chợ sai.
  Căn cứ: Hiện hai nơi đang khớp nhau nên người dùng chưa bị ảnh hưởng, và nếu lệch thì chỉ cần sửa lại, không mất dữ liệu.
  file: `lib/ho-goi.cjs`
  severity: medium
  Đề xuất: known-limits

- **GN-1 tự chép quy tắc dấu bật-theo-lựa-chọn thay vì gọi bộ đọc thật của plugin-declare**
  Người dùng thấy gì: Phép kiểm bảng tên tự chép quy tắc nhận biết plugin chọn thêm thay vì dùng quy tắc thật; nếu quy tắc thật đổi, phép kiểm vẫn báo xanh trong khi người dùng thấy danh sách plugin lệch.
  Căn cứ: Rủi ro chỉ xuất hiện khi quy tắc đổi, hiếm và người dùng tự thấy ngay danh sách sai rồi sửa được; sửa sau không đắt.
  file: `tests/scripts/mot-nguon-ten-va-hop-thu.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Đo checkout thay vì cây đang kiểm (gần hình dạng 6): VP-HT và vế «bố cục cũ» của BC-7 đọc commit HEAD của KIT, không đọc cây làm việc**
  Người dùng thấy gì: Nếu có sửa đổi chưa lưu vào lịch sử khi chạy kiểm, hai phép kiểm sẽ đo bản đã lưu chứ không phải bản đang sửa, nên có thể báo xanh cho thứ chưa được kiểm.
  Căn cứ: Chỉ xảy ra khi chạy kiểm trên cây còn sửa dở; người dùng cuối không gặp, và chỉ cần lưu thay đổi rồi chạy lại là đúng.
  file: `_acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
