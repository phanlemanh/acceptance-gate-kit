## Trong hợp đồng

_(rỗng — scope-triage không chạy được round này; không finding nào được máy xác nhận là trong hợp đồng. Xem mục "Chưa phân loại (triage-failed)" bên dưới.)_

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E7/E4 ghim dòng PASS mà `output` của chính eval không thể chứa — cửa sổ `tail -n 25` bị các ca mới của lượt này đẩy trôi**
  Người dùng thấy gì: Bảng bằng chứng cho ca kiểm tra baseline hiển thị không đủ những dòng mà nó tuyên đã xác nhận, nên người xem bằng chứng có thể tưởng đã thấy tận mắt điều được kiểm dù màn hình bằng chứng thực tế không chứa nó.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Bản chép tay thứ năm của `globToRe` trong ca — đúng lớp lỗi lượt này vừa gỡ ở tệp bên cạnh**
  Người dùng thấy gì: Nếu quy tắc xác định 'file nào tính là hồ sơ' được sửa sau này, một phần kiểm tra có thể âm thầm dùng lại quy tắc cũ mà không ai biết, dẫn tới lọt hoặc chặn nhầm nội dung không đáng.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **W47 là ca hằng-đúng: tự truyền đáp án `fileDoTrongDiff` rồi assert `length > 0` — chú thích tuyên một luật không còn sống ở tệp nó soi**
  Người dùng thấy gì: Một phần kiểm tra tuyên là đang canh giữ tính năng đo lường thật ra không còn khả năng phát hiện lỗi ở đó nữa, nên nếu tính năng này hỏng sau này, phần kiểm tra sẽ không báo động.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **`finders` chỉ có ở đường trả về thành công — ba đường BLOCKED mất đúng cái vết mà nó sinh ra để để lại**
  Người dùng thấy gì: Khi một lượt kiểm tra bị chặn giữa chừng, hồ sơ không ghi rõ được các bước tìm lỗi đã thật sự bỏ qua hay chưa từng chạy — người xem hồ sơ khó phân biệt 'không có lỗi' với 'chưa kiểm tra'.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Không eval nào khai `_acceptance/config.yaml` trong `paths`, nhưng mọi `cmd` sống ở đó → carry-forward + baseline-once mang màu xanh CŨ qua đúng vòng vừa đổi lệnh**
  Người dùng thấy gì: Khi một vòng sau chỉ sửa câu lệnh chạy kiểm tra mà không sửa danh sách tiêu chí, hệ thống có thể báo lại kết quả XANH cũ dù câu lệnh mới chưa hề được chạy thật, khiến người duyệt tin nhầm vào một kết quả đã lỗi thời.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Miền MỞ của bộ lọc ngoài-vật tắt IM LẶNG khi `ngoaiVatGlobs` rỗng/vắng, và chú thích bên VIẾT tuyên trường đó không còn là đầu vào của bên đọc**
  Người dùng thấy gì: Khi cấu hình loại-trừ bị để trống, các tệp ngoài phạm vi thay đổi có thể lại được đưa vào xét lỗi như bình thường mà không có ghi chú cảnh báo nào, nên người xem hồ sơ không biết được lượt đó có đang lọc đúng ý định hay không.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **`expected` của E7 (và phần W41 của E4) ghim bốn dòng PASS mà bằng chứng eval ghi lại KHÔNG THỂ chứa — `tail -n 25` cắt mất chính điều kiện xanh**
  Người dùng thấy gì: Bảng bằng chứng cho một phần kiểm tra không hiển thị đủ những dòng mà nó tuyên đã xác nhận, nên người xem bằng chứng có thể tưởng đã thấy tận mắt điều được kiểm dù màn hình bằng chứng thực tế không chứa nó.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): W49/W49b tuyên «vùng phủ cũng chia miền» nhưng chỉ truyền coverageFiles rỗng — nhánh miền ĐÓNG của bên đọc không có phép đo nào**
  Người dùng thấy gì: Phần đo 'vùng đã có sẵn phép đo' chưa có bài kiểm tra nào thật sự canh giữ nó — nếu phần này hỏng sau này, người duyệt sẽ không nhận được cảnh báo, dù hồ sơ trông như đã được kiểm đủ.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: high
  Đề xuất: new-contract

- **SKILL.md khai thiếu bốn trường args mới — hợp đồng writer/reader của chính seam vừa dựng lại (r2)**
  Người dùng thấy gì: Tài liệu hướng dẫn nội bộ chưa mô tả đúng các trường dữ liệu mới, có thể khiến người đọc sau này hiểu sai cách hệ thống vận hành.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Hai tệp ca chép tay bản thứ ba/thứ tư của globToRe thay vì import bản nguồn (r2)**
  Người dùng thấy gì: Một phần logic đối chiếu được chép tay ở nhiều nơi trong bộ kiểm thử; nếu định nghĩa gốc đổi sau này, các bản chép này có thể lệch mà không ai biết.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Đối chứng có lối thoát — VV-mau tự miễn trừ phần tử `docs/`, và không có đối chứng âm (r2)**
  Người dùng thấy gì: Một bài kiểm thử tự bỏ qua kiểm tra cho các tệp nằm trong thư mục tài liệu, và không có phép thử đối chứng để chắc rằng nó thực sự phân biệt đúng-sai, làm giảm độ tin cậy của phép kiểm.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: cả tệp finding-line-bo-doc xanh khi ba bộ đọc KHÔNG hề chạy (r1)**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo các báo cáo cũ vẫn đọc được sau khi thêm dữ liệu mới sẽ báo 'đạt' ngay cả khi công cụ đọc báo cáo bị hỏng hoàn toàn — người xem có thể tin nhầm rằng mọi thứ vẫn ổn trong khi chưa có gì được kiểm chứng thật.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — tuyên quét LỚP «không bộ đọc nào» nhưng chỉ có 3 điểm-case trên 8 bộ đọc (r1)**
  Người dùng thấy gì: Bài kiểm tra tuyên bố đã kiểm tra toàn bộ các nơi đọc dữ liệu nhật ký, nhưng thực tế chỉ kiểm một phần nhỏ — các nơi còn lại có thể hỏng mà không ai biết.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Tuyên quét LỚP nhưng phép đếm chỉ phủ một phần lớp — grep bỏ đúng thư mục chứa bên ghi run-log (r1)**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để cảnh báo khi có thêm chỗ mới đọc sổ ghi lại đang bỏ sót đúng khu vực mã nguồn liên quan nhất, nên cảnh báo đó có thể không kêu khi cần.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

### 1. Hình dạng 4 (ghim thông điệp mà bằng chứng không bao giờ chứa): `expected` của E7 ghim bốn dòng PASS nằm ngoài cửa sổ `tail -n 25` mà chính eval ghi lại làm evidence
- file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml:130`
- severity: high
- source: measurement

E7 (`expected`, dòng 124-130) tuyên «bốn dòng dưới đây có mặt NGUYÊN VĂN trong đầu ra» và liệt kê «PASS: W44 triage duoc goi TRUOC khi baseline tra ve», «PASS: W44 ca hai lane deu that su chay...», «PASS: W44b verdict van la REJECT...», «PASS: W44c nonDiscriminating chua E1/E2...»; `evidence_required` gồm `output`. Nhưng `cmd` của E7 (`_acceptance/config.yaml` dòng 297, `ktl_w44_baseline_roi_gang`) chỉ ghi lại `tail -n 25` của đầu ra. Đo thật: đầu ra của `node tests/workflows/acceptance-verify.test.mjs` có 649 dòng, cửa sổ tail-25 là dòng 625-649; «PASS: W44c nonDiscriminating chua E1/E2» nằm ở dòng 619, ba dòng W44/W44b còn sớm hơn. Tức KHÔNG dòng nào trong bốn dòng được ghim có mặt trong `output` mà eval nộp làm bằng chứng — người/judge chấm E7 theo `expected` đọc một bản tail chỉ chứa W47/W48/W49. Đây là hồi quy do chính lượt này gây ra: trước lượt chấm 4, W44c là ca cuối cùng của tệp và nằm trong cửa sổ; năm khối W48/W48b/W48c/W49/W49b vừa thêm (khoảng 23 dòng in) đã đẩy nó ra ngoài. E4 dính cùng lớp một nửa: `expected` dòng 64 ghim «PASS: W41 triage KHONG nhan finding ho so/tai lieu», dòng đó ở vị trí 562 — cũng ngoài cửa sổ (chỉ các dòng W48/W48b/W48c mà E4 mới thêm là thấy được).

Bước phân loại phạm vi (scope-triage) chết trước khi xử lý xong finding này nên máy không xác nhận được nó có nằm trong AC-7 hay không — người quyết tại Gate 2.

## Ngoài vùng phủ

⚠ Cụm ngoài vùng phủ: 4/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.