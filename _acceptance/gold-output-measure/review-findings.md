## Trong hợp đồng

(không có finding nào ánh xạ được vào AC vòng này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hồ sơ xuất xứ ghi sai repo_sha, và đó đúng là trường P160 không đo**
  Người dùng thấy gì: Nhãn ghi 'phiên bản mã nào đã tạo ra tệp bằng chứng này' có thể sai mà không ai phát hiện, vì hiện chưa có gì kiểm tra nhãn đó đúng sự thật hay không.
  file: `_acceptance/gold-output-measure/evidence/gold-stdout.provenance.json:4`
  severity: high
  Đề xuất: known-limits

- **P160 ghim cứng SHA 04d3413 làm chân so-bản-base trong test vĩnh viễn**
  Người dùng thấy gì: Phép kiểm 'bản mới không đổi so với bản cũ' đang neo vào một mốc lịch sử cố định; nếu lịch sử đó bị dọn dẹp, squash, hoặc tải về không đầy đủ, việc kiểm tra có thể báo lỗi dù sản phẩm không hề có vấn đề gì.
  file: `tests/plugins/run-tests.sh:6582`
  severity: medium
  Đề xuất: known-limits

- **P160 ghi file tạm vào cây nguồn scripts/ — nơi bị rsync nguyên khối sang mirror**
  Người dùng thấy gì: Nếu quá trình kiểm tra bị ngắt giữa chừng (mất điện, dừng đột ngột), một tệp tạm có thể bị bỏ quên lại trong mã nguồn và vô tình lọt vào bản phát hành sau này.
  file: `tests/plugins/run-tests.sh:6596`
  severity: medium
  Đề xuất: known-limits

- **E10 hứa byte-compare gold-stdout.txt, phép đo chỉ so 3 khối và bỏ đúng khối số liệu**
  Người dùng thấy gì: Phần mô tả nói số liệu đồng thuận của hội đồng được so sánh chặt để không lệch, nhưng phép kiểm thực tế lại bỏ qua đúng phần số liệu đó — nên số liệu cũ có thể lọt qua mà không ai nhận ra.
  file: `_acceptance/gold-output-measure/evals.yaml:77`
  severity: medium
  Đề xuất: known-limits

- **Sổ vàng khẳng định sai "không có biên bản hội đồng nào" khi mọi panel là carried (hoặc <2 phiếu)**
  Người dùng thấy gì: Khi mọi lượt chấm của một việc đều là 'giữ nguyên từ vòng trước' (không chấm lại), sổ vàng có thể hiển thị nhầm là 'chưa có ai chấm việc này' dù thực ra đã có biên bản chấm — gây hiểu lầm cho người đọc báo cáo.
  file: `scripts/acceptance-gold.mjs:219`
  severity: medium
  Đề xuất: known-limits

- **P160 ghi file .mjs tạm vào thư mục nguồn `scripts/` của cây làm việc thật**
  Người dùng thấy gì: Nếu quá trình kiểm tra bị ngắt giữa chừng, một tệp tạm có thể bị bỏ quên lại trong mã nguồn và vô tình lọt vào bản phát hành sau này.
  file: `tests/plugins/run-tests.sh:6596`
  severity: medium
  Đề xuất: known-limits

- **P160 ghim cứng SHA `04d3413` làm mốc "bản trước-diff"**
  Người dùng thấy gì: Phép kiểm 'bản mới không đổi so với bản cũ' đang neo vào một mốc lịch sử cố định; nếu lịch sử đó thay đổi, việc kiểm tra có thể báo lỗi dù sản phẩm không có vấn đề gì.
  file: `tests/plugins/run-tests.sh:6582`
  severity: low
  Đề xuất: known-limits

- **P160 (3) gắn snapshot `gold-stdout.txt` vào TOÀN BỘ nội dung `_acceptance/` của repo**
  Người dùng thấy gì: Phép kiểm so sánh bảng vàng dựa trên toàn bộ dữ liệu chấm điểm hiện có trong kho; mỗi lần có thêm một quyết định ký duyệt mới, phép kiểm này có thể tự báo lỗi dù không có gì sai, tạo áp lực chép đè mẫu mà không kiểm tra kỹ.
  file: `tests/plugins/run-tests.sh:6657`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture VIẾT TAY đúng khuôn bên đọc, không round-trip từ JUDGMENT-BLOCK-TEMPLATE**
  Người dùng thấy gì: Dữ liệu mẫu dùng để kiểm tra sổ vàng được gõ tay theo đúng khuôn mà bộ đọc mong đợi, thay vì lấy từ đúng mẫu chuẩn mà người viết báo cáo thực tế sẽ dùng; nếu mẫu chuẩn đổi định dạng, phép kiểm này có thể không phát hiện ra sổ vàng bị đọc sai.
  file: `tests/plugins/run-tests.sh:6212`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 — 'mỗi góc nhìn một dòng' tuyên quan hệ nhưng ma trận thiếu đúng ô phân biệt được**
  Người dùng thấy gì: Phép kiểm 'mỗi góc nhìn của giám khảo hiện một dòng riêng' hiện không có ca thử nào chứng minh được điều đó thật sự đúng; nếu phần mềm vô tình gộp sai nhiều phiếu vào một dòng, phép kiểm vẫn báo đạt.
  file: `tests/plugins/run-tests.sh:6342`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — comment tuyên 'đo PROPERTY' nhưng thân là blacklist 4 chuỗi điểm-case**
  Người dùng thấy gì: Phép kiểm 'không suy đoán nguyên nhân thiếu dữ liệu' hiện chỉ chặn được đúng bốn câu chữ cụ thể; nếu sổ vàng viết một câu suy đoán khác bằng lời khác, phép kiểm này sẽ không phát hiện ra.
  file: `tests/plugins/run-tests.sh:6359`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — SHA base hardcode: đường đọc-cũ neo vào lịch sử nhánh của tác giả, không suy từ cây đang kiểm**
  Người dùng thấy gì: Phép kiểm 'đường đọc phiên bản cũ' đang neo vào đúng lịch sử nhánh lúc viết test thay vì cây mã đang được kiểm; sau khi nhánh được gộp hoặc lịch sử thay đổi, việc kiểm tra có thể báo lỗi dù sản phẩm không có vấn đề gì.
  file: `tests/plugins/run-tests.sh:6582`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 2/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/gold-output-measure/evidence/gold-stdout.provenance.json, _acceptance/gold-output-measure/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.