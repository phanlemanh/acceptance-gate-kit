## Trong hợp đồng

(không có finding nào ánh xạ vào AC trong round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **MM12m là mutant test rỗng — không mutate gì, chỉ assert chuỗi-có-mặt**
  Người dùng thấy gì: Một bài kiểm tra được đặt tên là kiểm tra quan hệ giữa nguồn và tài liệu sinh ra, nhưng thực chất chạy trên nguồn nguyên vẹn và chỉ so một đoạn chữ có sẵn trong bài kiểm tra. Nếu công cụ sinh tài liệu sau này bị viết cứng nội dung thay vì đọc đúng nguồn, hệ thống vẫn báo đạt.
  file: `tests/workflows/measure-law-mutants.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — MM12m tuyên 'mutant đổi writer → fixture đổi theo' nhưng assert chỉ là chuỗi-có-mặt, không có mutant nào được dựng**
  Người dùng thấy gì: Một bài kiểm tra tự nhận là chứng minh 'sửa nguồn thì tài liệu sinh ra phải đổi theo' nhưng thực tế không hề thử sửa gì — nó chỉ so khớp một đoạn chữ định sẵn. Nếu công cụ sinh tài liệu ngừng đọc đúng nguồn thật, phép kiểm tra này không phát hiện ra và vẫn báo đạt.
  file: `tests/workflows/measure-law-mutants.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 + 4 — phép đo 'ba-chiều' chỉ có mutant cho chiều const; chiều prompt chưa từng được chứng minh biết đỏ và tự-degrade im lặng khi promptText falsy**
  Người dùng thấy gì: Phép đo được thiết kế để kiểm tra theo nhiều hướng khác nhau (cả nội dung nguồn lẫn nội dung nhắc việc cho người thực thi), nhưng bài kiểm tra hiện tại chỉ thử một hướng. Nếu thiếu sót chỉ xảy ra ở hướng còn lại — ví dụ nội dung nhắc việc bị bỏ trống — hệ thống có thể không phát hiện ra và vẫn báo đạt.
  file: `tests/workflows/measure-pins.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture RED-probe tuyên 'SINH từ writer thật' nhưng khối A/B (vật critic chấm) là YAML viết tay tĩnh; chỉ 1 dòng blockquote thật sự rút từ writer**
  Người dùng thấy gì: Bộ dữ liệu mẫu dùng để thử khả năng bắt lỗi tài liệu phần lớn là nội dung viết sẵn tay, không thực sự lấy từ tài liệu nguồn hiện hành — chỉ một phần rất nhỏ được lấy tự động. Nếu tài liệu nguồn thay đổi, bộ dữ liệu mẫu này sẽ không cập nhật theo, khiến kết quả kiểm tra không còn phản ánh đúng tài liệu thật.
  file: `tests/workflows/gen-red-probe.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

### MM12m la 'mutant' khong mutate — assert chuoi-co-mat trong khi ten check hua quan he writer→fixture
- file: `tests/workflows/measure-law-mutants.test.mjs:120`
- severity: medium
- source: conventions

Check MM12m ('doi shape 4 cua writer → noi dung sinh phai DOI theo (quan he writer→fixture)') khong thuc hien mutation nao: body chi la `return generate().includes(shape4)` voi `shape4` la chuoi CHEP TAY (khong lay tu PIN_SHAPES cua measure-pins.mjs, khong doc tu writer). Day la dung hai hinh dang bi CLAUDE.md cam va bi chinh feature nay ma hoa: (3) 'Assert chuoi co mat trong khi loi hua la QUAN HE' va mutant-khong-mutate. Kich ban fail: mot generate() bi sua de bo qua writer (tra ve template tinh chua san van ban shape 4, hoac trich sai phan tu mien la chuoi shape4 xuat hien dau do trong dau ra) van XANH o MM12m — quan he writer-thay-doi ⇒ fixture-thay-doi chua bao gio duoc do. MM12 (byte-equality voi file da commit) chi bat droi cua file commit, khong bat generator dut round-trip. Cung la vi pham luat quet-LOP cua CLAUDE.md: S4-r1/r2 da sua cac case cung hinh dang (MM6m, MM7+) nhung case nay lot luoi. Sua toi thieu: mutate ban sao SRC (doi/xoa shape 4), goi lai logic generate tren ban mutant, assert dau ra KHAC dau ra tu nguon that — hoac it nhat lay expected tu PIN_SHAPES[3] thay vi chep tay.

### 7 regex cau doi chieu VI + 7 EN bi copy-paste giua hai test file thay vi single-source qua measure-pins.mjs
- file: `tests/workflows/measure-law-mutants.test.mjs:87`
- severity: low
- source: conventions

Danh sach VI (line 87) va EN (line 100) trong measure-law-mutants.test.mjs la ban sao nguyen van cua MEASURE_CLAUSES_VI/MEASURE_CLAUSES_EN trong tests/workflows/skill-claims.test.mjs:63-81. Chinh diff nay tao tests/workflows/measure-pins.mjs voi ly do 'MOT CHO... dung chung boi acceptance-verify.test.mjs va measure-law-mutants.test.mjs' — tuc pattern single-source da co san trong cung feature nhung 14 regex nay khong di qua no. Droi giua hai ban sao se do to (moi ban deu co mutant per-clause) nen khong silent, nhung khi sua mot cau SKILL phai sua regex o HAI cho — dung lop 'ban VIET va ban DOC troi khoi nhau' ma CLAUDE.md neu. De xuat: don 2 danh sach ve measure-pins.mjs (hoac mot pins module chung) va import tu ca hai test.

## Chưa adversarial-verify (refuter chết)

(không có finding nào ở trạng thái refuter chết trong round này)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).