## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Standing executor itgk_lane_doc_khong_doi encodes the authoring branch's topology and is already red on this branch; permanently red on main**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để bảo vệ chất lượng release có thể báo lỗi liên tục sau khi nhánh này được gộp vào nhánh chính, dù tính năng đang xét không sai — điều này có thể làm chậm hoặc gây nhiễu cho các đợt xác nhận phát hành sau này.
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:72`
  severity: high
  Đề xuất: new-contract

- **Third clause of cqt_o_khong_doi cannot go red for the claim it makes — product-map.mjs --check never writes the map**
  Người dùng thấy gì: Một điều kiện kiểm tra tự động khó có thể tự phát hiện ra lỗi vì cách nó được viết, nên nếu sau này bản đồ sản phẩm bị ghi sai theo đúng hướng đó, hệ thống vẫn có thể báo là ổn.
  file: `_acceptance/config.yaml:223`
  severity: low
  Đề xuất: known-limits

- **Contract Note claims da-nghiem-thu-* can now carry mien-do-co-nguoi-dung, but the code path passes oTxt=null after a verdict so it never can**
  Người dùng thấy gì: Ghi chú nội bộ mô tả rằng một mục kết quả có thể mang thêm một nhãn phụ trong vài trường hợp, nhưng mã hiện tại không bao giờ thực sự gắn nhãn đó trong tình huống ấy — người đọc tài liệu nội bộ có thể hiểu nhầm về hành vi thật, dù người dùng cuối không bị ảnh hưởng.
  file: `scripts/start-scan.mjs:341`
  severity: low
  Đề xuất: known-limits

- **Eval itgk_lane_doc_khong_doi (AC-6 teeth) is a one-PR snapshot and is already red on HEAD; check_lane also anchors on stale local `main`**
  Người dùng thấy gì: Một bài kiểm tra tự động cho một tính năng khác đã bị hỏng và báo đỏ ngay trên nhánh hiện tại, không phải do tính năng đang xét gây ra; nếu gộp vào nhánh chính, nó có thể tiếp tục báo đỏ ở mọi lần kiểm tra phát hành sau này cho tới khi được sửa riêng.
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:85`
  severity: medium
  Đề xuất: new-contract

- **Shape 3 — assert 'chuỗi có mặt' cho ngân sách 3/4/1 trong khi lời hứa là quan hệ giá trị; chữ số «3» và «1» không thể vắng**
  Người dùng thấy gì: Một phép kiểm ngân sách nội bộ chỉ xem một vài chữ số có xuất hiện ở đâu đó trong tài liệu, nên nếu con số ngân sách thật sự bị ghi sai, phép kiểm này có thể vẫn không phát hiện ra.
  file: `tests/plugins/run-tests.sh:11000`
  severity: high
  Đề xuất: new-contract

- **Shape 3 — eval ghim chuỗi HẰNG trong câu PASS của RT13 thay vì kết quả ma trận; đổi MA_TRAN không làm token đổi**
  Người dùng thấy gì: Một phần của bộ kiểm tra xác nhận so khớp một câu thông báo cố định thay vì kiểm đúng toàn bộ các trường hợp cần kiểm, nên nếu sau này có trường hợp bị bỏ sót khỏi phạm vi kiểm tra, phép đo này có thể vẫn báo là mọi thứ ổn.
  file: `_acceptance/co-qua-timebox-nhom-da-xong/evals.yaml:15`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 — `"copy" in r_t` grep toàn file README; chuỗi có mặt ở ba chỗ không liên quan nên xoá câu tự khai vẫn xanh**
  Người dùng thấy gì: Một phép kiểm tài liệu chỉ tìm một từ khoá xuất hiện ở bất kỳ đâu trong toàn bộ tệp thay vì đúng đoạn cần kiểm, nên nếu câu tự khai quan trọng bị xoá, phép kiểm này có thể vẫn không phát hiện ra.
  file: `tests/plugins/run-tests.sh:11029`
  severity: low
  Đề xuất: wont-fix

⚠ Cụm ngoài vùng phủ: 6/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/inputs-tinh-tu-goc-kho/rang.sh, _acceptance/config.yaml, tests/plugins/run-tests.sh, _acceptance/co-qua-timebox-nhom-da-xong/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
