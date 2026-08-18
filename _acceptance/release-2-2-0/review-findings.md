## Trong hợp đồng

- **evidence-report.md ghim verifier key đã bị TRỪ khỏi config (`plugins_release`) + tiêu đề P200 cũ + verified_commit stale**
  file: `_acceptance/release-2-2-0/evidence-report.md:35`
  severity: medium
  AC: AC-3
  detail: Báo cáo trên nhánh (vòng 4, verified_commit 50a5e85) vẫn ghi `verifier: config:executors.test.plugins_release` (3 chỗ: dòng 35/46/101) và output «quan he voi base (7 dot bien)» — cả khoá executor lẫn vế số-phải-tăng đã bị gỡ ở D17/commit 15af234; `_acceptance/config.yaml` hiện không còn khoá `plugins_release`. run-log.jsonl vòng 5 chỉ có E3/E3b/E3d (suite plugins bị giết ở 118 s theo D19) nên chưa có gói bằng chứng nào khớp P200 bản TRỪ. Theo bất biến «verified_commit phải trỏ sha làn» + «bằng chứng không tự dối», report này phải được sinh lại trọn ở vòng 5 lượt 2 (P200 title mới, verifier `plugins`, sha HEAD) trước khi mở biên merge — trạng thái hiện tại là bằng chứng của một phép đo không còn tồn tại.
  source: conventions
  rationale: AC-3 đòi cả bốn suite XANH tại cây đã sửa; evidence-report là bằng chứng cho điều đó nhưng ghim verifier trỏ vào một khoá config đã bị xoá và một phiên bản case đã đổi hình, nên chưa chứng minh được AC-3 đúng tại HEAD.

- **Evidence report tại HEAD ghim bằng chứng của một P200 không còn tồn tại (round 4 @50a5e85), verifier key đã bị xoá khỏi config, còn run-log round 5 cho cùng eval là exit khác 0**
  file: `_acceptance/release-2-2-0/evidence-report.md:31`
  severity: medium
  AC: AC-3
  detail: Report có verified_commit 50a5e85 (round 4) và các khối E1/E2/E6 in output «PASS: P200 … · quan he voi base (7 dot bien)» với verifier `config:executors.test.plugins_release`. Ở HEAD (sau commit 15af234 «bản TRỪ»): (a) P200 chỉ còn 5 đột biến, tiêu đề ca khác hẳn — chạy `ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh` tại HEAD in «5/5 dot bien chay that», không có «quan he voi base»; (b) `_acceptance/config.yaml` không còn khoá `plugins_release` (chỉ còn `plugins`), nên verifier ghi trong report trỏ vào executor không tồn tại; (c) evals.yaml E1 expected «5/5 dot bien chay that» — không khớp output đang ghim trong report; (d) run-log.jsonl dòng round 5 (sha 15af234, lượt 1 — bị công cụ dừng ở ~118 s theo D19) cho E1/E2/E3c/E6 khác exit 0, trong khi bảng report vẫn PASS với run_id r4. Hệ quả: bằng chứng trong report không do vật ở HEAD sinh ra — bất kỳ ai đọc report tại HEAD (hoặc pre-merge đọc verified_commit) đang tin một lượt đo của vật cũ. Vòng 5 lượt 2 (sha 11e5f17, được main loop chạy và ghi log SAU report này) đã cho bốn suite xanh thật — nội dung report ở field "report" của lượt tổng hợp này đã thay bằng bảng bằng chứng của lượt 2, khớp verifier `plugins` và sha HEAD; nhưng bản evidence-report.md hiện đang nằm trên đĩa (vòng 4) vẫn là lời-khai-sai cho tới khi main loop ghi đè nó.
  source: bugs
  rationale: AC-3 đòi chạy đủ bốn suite và cả bốn XANH tại cây đã sửa; run-log của chính vòng mới nhất (round 5, sha hiện tại) không xanh cho các eval liên quan trong khi evidence-report vẫn in PASS từ một commit cũ, nên AC-3 chưa được chứng minh đúng tại HEAD bằng bản báo cáo đang nằm trên đĩa.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Đột biến «GUIDE giu so cu» không neo vào câu dẫn xuất — replace() lần xuất hiện ĐẦU của `acceptance-gate <V>` trong toàn GUIDE**
  Người dùng thấy gì: Bài kiểm tra tự động cho việc đóng số phát hành có thể báo sai là lỗi trong những trường hợp hiếm khi tài liệu hướng dẫn nhắc tới số phiên bản cũ ở một câu khác — rủi ro nằm ở chính bài kiểm, không phải ở bản phát hành đang xét.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **«MỘT lối thoát duy nhất» chưa bọc ngoại lệ — manifest thiếu/khác kiểu `description` làm script ném lỗi không có tên thay vì vế đỏ có tên**
  Người dùng thấy gì: Nếu tệp mô tả một plugin bị thiếu thông tin hoặc sai định dạng, bài kiểm tra có thể dừng với một thông báo lỗi khó hiểu thay vì chỉ rõ vấn đề — bản phát hành vẫn bị chặn đúng, chỉ là lý do chặn sẽ khó đọc hơn.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «mỗi vế» có chiều đỏ nhưng chỉ có 5 điểm-case; số đột biến là hằng 5, không suy từ tập vế đỏ của kiem()**
  Người dùng thấy gì: Bài kiểm tra vĩnh viễn mới thử nghiệm một phần các tình huống có thể sai khi đóng số phát hành; một số tình huống lỗi khác chưa từng được thử nên chưa chắc bài kiểm sẽ bắt được nếu chúng xảy ra trong các lần phát hành sau.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — lối-thoát-duy-nhất chỉ được canh bằng comment + «đã chạy tay 18/08»; đường cây-thật-đỏ → thoát khác thành công không có ca máy**
  Người dùng thấy gì: Lời cam kết rằng bài kiểm sẽ báo lỗi rõ ràng khi có bản phát hành sai thật sự mới được xác nhận một lần bằng tay và ghi lại trong tài liệu, chưa có bước tự động lặp lại việc xác nhận đó cho các lần sau.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
