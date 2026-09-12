## Trong hợp đồng

- **`inContract` bóc bằng khuôn OOC-ITEM-TEMPLATE mà bên VIẾT không bao giờ dùng cho mục «Trong hợp đồng» — đọc ra 0 trên hồ sơ thật, im lặng**
  file: `lib/out-of-contract.cjs:132`
  severity: high
  source: bugs
  AC: AC-14
  `inContract: inLines ? parseFindings(inLines) : []` dùng CHÍNH parseFindings của mục «Ngoài hợp đồng», với chú thích «hai mục dùng chung khuôn OOC-ITEM-TEMPLATE ở bên viết». Bên viết KHÔNG như vậy: prompt synthesize trong feature-loop/workflows/acceptance-verify.js:1163 chỉ áp OOC-ITEM-TEMPLATE (`- **{title}**` + 4 dòng trường) cho mục «Ngoài hợp đồng»; với «Trong hợp đồng» nó chỉ dặn «mỗi dòng ghi thêm "AC: <acRef>"». Đo trên chính _acceptance của kho này: cong-dang-co-cua, codex-script-packaging, dac-ta-ux-vat-hoa-cau-truc viết mục đó dạng `### <title>` + `- file:` / `- severity:` / `- AC:`; lenh-in-ra-phai-bam-duoc và loi-moi-cong-may-sinh viết dạng `- **title** · severity: … · AC-n`. Cả 5 hồ sơ cho `inContract.length === 0` (chạy thật: `ooc.parse` → trong=0, ngoai=8/5/8/…). Hệ quả kép, cả hai đều LẶNG: (1) khối thẻ mới «Lỗi TRONG hợp đồng CHƯA sửa» ở scripts/gate-card.js:964 không bao giờ hiện trên đúng hồ sơ nó sinh ra để cứu; (2) `mucChoNguoi` cộng `trong = 0` nên điều kiện xanh-sạch thứ bảy trả SẠCH cho hồ sơ còn lỗi trong phạm vi đã duyệt. Lưới ngờ-sai-khuôn không cứu được: `suspect_empty` (dòng 138) chỉ tính trên `outLines`, mục «Trong hợp đồng» không có bộ dò điểm mù nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **xanhSach nhận «phụ» tuỳ chọn — product-map và start-scan vẫn chấm SÁU điều kiện**
  Người dùng thấy gì: Bấm xem trạng thái hồ sơ trên bản đồ sản phẩm hoặc máy quét đầu phiên có thể báo một tính năng là đã xong dù vẫn còn việc chờ người duyệt, vì hai công cụ đó chưa áp dụng điều kiện mới.
  file: `scripts/khong-can-nguoi.mjs`
  severity: high
  Đề xuất: new-contract

- **Không mã nào ghi findings_open — khoá của điều kiện mới chỉ sống trong lời dặn khuôn**
  Người dùng thấy gì: Báo cáo bằng chứng mới có thể luôn thiếu con số 'còn bao nhiêu việc chờ người duyệt' vì không có bước máy nào tự điền nó — hồ sơ sẽ chỉ nhận cảnh báo nhẹ thay vì bị chặn, ngay cả khi vẫn còn việc dở dang.
  file: `skills/acceptance/references/evidence-report-template.md`
  severity: high
  Đề xuất: new-contract

- **`mucChoNguoi` trừ MỌI dòng sổ `stage:"gate2"`, kể cả veto/revisit không dính tới finding → đếm hụt, trả sạch giả**
  Người dùng thấy gì: Một ghi chú không liên quan tới lỗi cụ thể nào (như lời phủ quyết hay ghi chú xem lại) trong sổ quyết định có thể bị tính nhầm là 'đã xử lý xong' một phát hiện, khiến hồ sơ còn lỗi thật vẫn hiện ra là sạch và được phép đi tiếp mà không cần người duyệt.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: new-contract

- **`contentLines` nhánh văn xuôi biến mục Coverage CHƯA ĐIỀN của chính khuôn thành «có độ phủ» — tắt cờ vàng Cổng 1**
  Người dùng thấy gì: Khi hợp đồng chưa thực sự điền phần 'Độ phủ tiêu chí' và vẫn để nguyên hướng dẫn mẫu, thẻ có thể hiểu nhầm là đã điền đầy đủ và không cảnh báo, khiến người duyệt không biết phần đó còn bỏ trống.
  file: `lib/md-section.cjs`
  severity: medium
  Đề xuất: known-limits

- **`CLEAN_DOI_CU` là biến toàn cục không reset đầu vòng lặp; `xanh_sach_check` có đường về sớm không đặt nó → hồ sơ sau thừa hưởng «đọc-cũ» của hồ sơ trước**
  Người dùng thấy gì: Khi kiểm nhiều hồ sơ liên tiếp trong một lần chạy, kết quả của hồ sơ trước có thể rò sang hồ sơ sau — một hồ sơ thực sự có vấn đề có thể bị báo nhầm thành 'chỉ là hồ sơ cũ, không cần chặn' thay vì bị chặn đúng như phải có.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: new-contract

- **Điều kiện thứ bảy là đối số TUỲ CHỌN nên hai bộ đọc trong kho (start-scan, product-map) không bao giờ chạy nó — đúng lớp lệch mà đầu file cảnh báo**
  Người dùng thấy gì: Hai nơi hiển thị trạng thái hồ sơ (bản đồ sản phẩm và máy quét đầu phiên) có thể xếp một hồ sơ là đã xong trong khi công cụ chặn hợp nhất mã vẫn đang chặn nó — người dùng nhìn hai nơi sẽ thấy hai kết quả khác nhau.
  file: `scripts/khong-can-nguoi.mjs`
  severity: medium
  Đề xuất: new-contract

- **Tuyên quét LỚP nhưng chỉ có điểm-case: luật «hai chiều / mũi tiêm» khai ở đầu tệp và trong 11 eval, nhưng 11/15 ca không có mũi tiêm nào**
  Người dùng thấy gì: Bộ kiểm thử tự động cho tính năng này chưa thực sự chứng minh phần lớn các trường hợp bảo vệ hoạt động đúng — nhiều ca chỉ kiểm tra bề mặt mà không thử phá để xem có bắt được lỗi thật hay không, nên có nguy cơ những vấn đề tương tự lọt qua kiểm thử mà không ai biết.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Chiều đỏ khai trong eval không chạy và khai NGƯỢC số: E17 nói lớp cũ trả 221, phép đo trả 0 theo cấu trúc**
  Người dùng thấy gì: Một trong các phép đo minh chứng cho tính năng này không thực sự chạy được chiều kiểm chứng ngược đã hứa, và con số kỳ vọng ghi trong đó bị đảo ngược so với thực tế — người đọc báo cáo có thể tin nhầm vào một con số không phản ánh đúng thực trạng.
  file: `_acceptance/cong-nguoi-doc-du-nguon/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Đường dẫn suy từ máy tác giả: do-ban-kinh.cjs mặc định quét ~/dev, trái với chính dòng khai ở đầu tệp**
  Người dùng thấy gì: Công cụ tính ra các con số minh chứng cho tính năng này chỉ chạy đúng trên máy của người viết nó; người khác chạy lại hoặc chạy trên máy kiểm tra sẽ ra số khác hoặc bị lỗi, nên các con số này không ai khác kiểm chứng lại được.
  file: `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion không có đối chứng âm + ghim lỏng: CN11 chỉ dò chuỗi trên TOÀN output, trong khi nhánh awk luôn in sẵn chữ «cross-layer»**
  Người dùng thấy gì: Bài kiểm thử cho tính năng phát hiện lỗi xuyên lớp hiện đang xác nhận đúng, nhưng cách viết khá lỏng lẻo nên trong tương lai có thể vô tình báo 'đạt' ngay cả khi tính năng đó đã hỏng, mà không ai nhận ra.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đối chứng dương ghi lại mà không cưỡng chế: khẳng định «thẻ thôi nói Bằng chứng đầy đủ» của CN10 tự tắt lặng lẽ**
  Người dùng thấy gì: Một phần kiểm tra cho thấy thẻ không khẳng định 'bằng chứng đã đầy đủ' khi thực ra còn thiếu đang dựa vào đúng một câu chữ cụ thể trên thẻ; nếu câu chữ đó đổi sau này, phần kiểm tra sẽ ngừng phát hiện lỗi mà không ai biết, dù kết quả vẫn báo đạt.
  file: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).