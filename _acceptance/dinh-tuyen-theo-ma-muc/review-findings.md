## Trong hợp đồng

- **Lưới bash (vế hai) vẫn gọi bộ phân giải KHÔNG có run-log nên chặn hồ sơ mà khong-can-nguoi.mjs coi là sạch: hai bản dựng xanh-sạch không còn cùng câu trả lời**
  file: `scripts/pre-merge-check.sh:469`
  severity: high
  AC: AC-4
  source: conventions
  detail: Khối «vế hai» được giữ nguyên và vẫn gọi `mucChuaDinhTuyen(rd(argv[2]), rd(argv[3]))` với hai đối số. «Vế ba» chỉ chạy khi vế hai đã cho `clean_ok=1`. Chú thích của vế ba nói «khối này chỉ chặt hơn», nhưng điều đó sai. Khi thiếu runLog thì `cuoi == null`, nên `laCu` luôn false. Lúc đó một dòng có mã ghi TRƯỚC lượt chấm rơi vào nhánh `so.length` và bị đòi số phải trỏ đúng mục cùng mã. Mục đã lùi số nên dòng thành mồ côi (`so-lech-tieu-de`). Có run-log thì cũng dòng đó khớp mục mang nhãn `(r1)` theo mã.

  Tôi đã chạy lại trên lib HEAD với ca đúng luồng AC-1: 3 dòng có mã ghi lúc 10:00, lượt chấm lúc 11:00 chèn «Mục mới» lên đầu và các mục cũ mang `(r1)`, rồi người ghi dòng có mã cho mục mới lúc 12:00. Gọi `mucChuaDinhTuyen(after, ledger, runLog)` ra `chua: []`, tức sạch: bản mjs, start-scan và product-map đều xếp «máy đi tiếp». Gọi `mucChuaDinhTuyen(after, ledger)` (đúng như vế hai gọi) ra `chua: [Ngoài-2, Ngoài-3, Ngoài-4]`. Hệ quả: `xanh_sach_check` trượt. Làn V bị chặn, và hồ sơ `khong-can-nguoi --write` đã ghi `machine-cleared` thì bị VIOLATION «status machine-cleared nhưng hồ sơ còn cần người — … chưa người định tuyến», dù mọi mục đã có dòng sổ người theo mã.

  Việc này vi phạm bất biến «MỘT hàm, hai bản dựng cùng câu trả lời» mà chú thích lib và AC-4 («đẳng thức hai bản dựng») khai. Nó cũng phá đúng luồng mà vòng này dựng ra: người định tuyến theo mã sau khi mục đổi số. Ma trận DM4 không có hàng nào đi qua ca này. Các hàng 2, 3, 4 và 6 có dòng có mã cũ thì đều còn mục chưa định tuyến, nên cả hai bản dựng cùng chặn, chỉ khác lý do. Hàng 12 và 15 có dòng có mã ghi SAU lượt chấm. Vì thế DM4 vẫn xanh.

  Hướng sửa: vế hai cần truyền run-log (khi tệp có), hoặc gộp vế hai và vế ba thành một lần gọi ba đối số giống bản mjs.

- **pre-merge xanh_sach_check vẫn đọc theo số 2 đối số (vế 2) trước vế 3: hai bản dựng luật xanh-sạch cho kết quả khác nhau khi mục mang tiêu đề bị đổi số**
  file: `scripts/pre-merge-check.sh:464`
  severity: high
  AC: AC-4
  source: bugs
  detail: Vế 2 (khối có sẵn, không đổi) gọi `mucChuaDinhTuyen(findings, ledger)` không có run-log, và vế 3 chỉ chạy khi `clean_ok` còn 1. Bản mjs (`khong-can-nguoi.mjs`, start-scan, product-map) gọi ba đối số. Khi không có run-log thì `cuoi == null`, nên một dòng có mã (`tieu_de`) ghi trước lượt chấm không bao giờ bị coi là cũ. Nó đi vào nhánh `so.find(n => ung.includes(n-1))`, mà mục đã lùi số nên dòng thành mồ côi ('so-lech-tieu-de'). Có run-log thì cùng dòng ấy rơi vào nhánh `laCu` và khớp mục mang nhãn `(r1)`. Đã chạy lại: findings [«Mới», «X (r1)»], dòng `Ngoài-1` có `tieu_de:X` ghi lúc 10:00, dòng `Ngoài-1` có `tieu_de:Mới` ghi lúc 12:00, round-tally lúc 11:00. Gọi 2 đối số (vế 2 của bash) ra chua=['Ngoài-2']; gọi 3 đối số (mjs) ra chua=[]. Kết quả: lưới trước-gộp chặn bằng VIOLATION «chưa người định tuyến: Ngoài-2» trong khi bộ quét và product-map xếp hồ sơ vào máy-thông. Đây đúng là ca đổi số mà vòng này định sửa, và nó phá đẳng thức hai bản dựng (LV5/DM4). Ma trận DM4 không bắt được vì không có hàng nào mà 3 đối số ra sạch còn 2 đối số ra bẩn; hàng 2 chỉ kiểm có hay không có VIOLATION, không kiểm danh sách mục. Cách sửa: vế 2 truyền run-log, hoặc bỏ vế 2 khi có run-log.

- **Hình dạng 5 (ma trận khai trước, số assert = số phần tử): eval E3 ghim «14/14 hàng» trong khi test assert và in 18/18, còn số 14 của AC-3 là hằng tự suy**
  file: `_acceptance/dinh-tuyen-theo-ma-muc/evals.yaml:47`
  severity: medium
  AC: AC-3
  source: measurement
  detail: E3 khai dòng «PASS: DM3 ma-tran — 14/14 hàng» và «số hàng chạy == 14». Test ở dòng 131-136 assert `MA_TRAN.length !== 18` và in «— 18/18 hàng» (chạy thật: «PASS: DM3 ma-tran — 18/18 hàng»). Dòng mà eval ghim không bao giờ xuất hiện. Phần «AC-3: 14» được in là hằng SO_HANG_AC3 = 14 (dòng 99), và số Review Focus được tính bằng `n - SO_HANG_AC3`, nên không có assert nào đối chiếu số phần tử với mười bốn hàng của AC-3. Ma trận khai trước và số assert đã trôi khỏi nhau.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chú thích cờ dòng máy lệch trên thẻ còn ghi «lưới trước-merge không bắt ca này», nhưng lib nay đã bắt**
  Người dùng thấy gì: Một dòng ghi chú trong mã nói sai về giới hạn cũ; người dùng không thấy gì khác đi, chỉ người đọc mã có thể bị nhầm.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: wont-fix
- **Dòng máy mồ côi thành «lệch» vĩnh viễn: dinh-tuyen-may thoát 2 mãi và thẻ cắm cờ mãi, kể cả khi người đã định tuyến lại**
  Người dùng thấy gì: Sau khi một mục tự động đã được người quyết lại, hệ thống vẫn báo lỗi và cắm cờ cảnh báo ở mỗi lần chạy sau, và không ghi thêm gợi ý tự động cho mục mới. Người dùng sẽ thấy cảnh báo không bao giờ tắt dù đã xử lý xong.
  file: `scripts/dinh-tuyen-may.cjs`
  severity: medium
  Đề xuất: new-contract
- **Hình dạng 4 (assertion âm-tính-một-mình): DM9 luoi-cay xanh rỗng, lưới chưa từng chạy tới khối định tuyến**
  Người dùng thấy gì: Một phép kiểm tự động báo xanh mà thực ra chưa chạm tới phần cần kiểm, nên nó chưa chứng minh được là hồ sơ đã ký không bị chặn nhầm. Hành vi thật không bị chứng minh sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: high
  Đề xuất: known-limits
- **Hình dạng 4 (không ghim thông điệp): chiều đỏ DM1-do theo-so nhận mọi lỗi, và kết quả quan sát được trái với lý do ca tự in**
  Người dùng thấy gì: Một phép thử phá thử có thể báo đỏ vì lý do khác với lý do nó tự ghi, nên độ tin của phép thử này thấp hơn vẻ ngoài. Người dùng không thấy hành vi sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: high
  Đề xuất: known-limits
- **Hình dạng 3 (assert chuỗi có mặt thay vì quan hệ): DM1 doi-so tuyên «mục DUY NHẤT chưa định tuyến» nhưng chỉ loại trừ Ngoài-2**
  Người dùng thấy gì: Phép thử chưa đủ chặt để bắt trường hợp có thêm mục bị báo chưa định tuyến nhầm. Hiện chưa thấy hệ thống báo sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 3 (chuỗi có mặt thay vì quan hệ): DM7 co-vang đếm nhãn trên cả dòng cờ, không phân biệt danh sách «dòng cũ» với danh sách «hỏi lại»**
  Người dùng thấy gì: Phép thử cờ cảnh báo trên thẻ có thể vẫn xanh dù danh sách mục cũ trên cờ bị rỗng hay sai. Cờ thật hiện chưa thấy hiển thị sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 4 (không ghim thông điệp): DM4 luoi nhận VIOLATION bất kỳ cho hàng khai «còn mục chưa định tuyến»**
  Người dùng thấy gì: Phép thử chỉ kiểm lưới có chặn hay không mà không kiểm lý do chặn, nên một lý do chặn khác vẫn được tính là đúng. Hành vi thật chưa thấy sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: low
  Đề xuất: known-limits
- **Hình dạng 4 (đối chứng không thể đỏ): DM9-do so lib mốc với chính nó, nên tập đổi rỗng theo cấu tạo**
  Người dùng thấy gì: Một phép đối chứng so một bản với chính nó nên không thể đỏ; nó chỉ làm phép kiểm trông chắc hơn thực tế. Người dùng không bị ảnh hưởng.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
