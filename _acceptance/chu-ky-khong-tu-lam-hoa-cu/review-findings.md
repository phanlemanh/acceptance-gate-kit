## Trong hợp đồng

### 1. Bước 6b đứng TRƯỚC 7a nhưng routing-baseline.mjs bắt buộc human_signoff phải có sẵn → quy trình ký tự chặn chính nó
- file: `commands/signoff.md:159`
- severity: medium
- AC: AC-3
- source: bugs

Thứ tự trong văn bản: bước 6b (dòng 159) chạy `node tests/scripts/routing-baseline.mjs --root . --slug <slug> --write`, rồi mới tới bước 7a (dòng 180) — chính là bước «ghi các dòng thuộc về người trong evidence-report.md (`human_signoff`, …)».

Nhưng `tests/scripts/routing-baseline.mjs` CLI có tiền điều kiện cứng:
  if (!settled(root, slug)) die(`hồ sơ «${slug}» chưa ký (human_signoff rỗng…) — … KHÔNG ghi gì`);  // exit 2
và `settled()` đòi `^human_signoff:[ \t]*(\S.*)$` khác rỗng trong evidence-report.md.

Chính 6b lại khai: «Lệnh sinh thoát ≠ 0 (hồ sơ chưa ký, …) → DỪNG, in nguyên văn, không commit chữ ký.» Nên một agent đi đúng thứ tự đánh số (…6 → 6b → 7a) sẽ luôn gặp exit 2 ở 6b và phải DỪNG — chữ ký không bao giờ commit được. Bước 6 (bản đồ) tránh được vì nó nói rõ «run … after `human_signoff` is written»; 6b chỉ nói «cùng lượt với bản đồ, TRƯỚC làn 7b» nên tiền điều kiện đó không được nêu lại.

Ca SK5 và RB2* đều dựng fixture với `human_signoff` ĐÃ ghi sẵn, nên không ca nào phủ thứ tự thật của văn bản; RB3 chỉ assert signoff.md CÓ CHỨA chuỗi lệnh, không assert vị trí tương đối với 7a.

Sửa: ghi rõ trong 6b «chạy SAU khi 7a đã ghi `human_signoff`» (hoặc dời khối xuống giữa 7a và 7b).

Rationale (khớp AC): AC-3 nêu rõ bước 6 phải chạy lệnh sinh "sau khi human_signoff đã ghi"; nếu văn bản đặt 6b trước 7a (nơi ghi human_signoff), điều khoản này của AC-3 bị vi phạm trực tiếp.

### 2. Hình dạng 2 — fixture VIẾT TAY đúng khuôn bên đọc trong ca SK5 (eval E6 khai là do writer sinh)
- file: `tests/scripts/repin-lane-skip-unchanged.test.mjs:187`
- severity: high
- AC: AC-6
- source: measurement

Dòng 187: `writeFileSync(BASE, '# moc dinh tuyen\nfeat\thoi=ký hay trả\tbao=cắt/hoãn\n')` — dòng bản ghi mốc được GÕ TAY đúng khuôn mà bên đọc mong đợi. Eval E6 (_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml:91-93) hứa ngược lại từng chữ: «dòng baseline vừa sinh bằng chính routing-baseline.mjs --write CHƯA commit (không gõ tay)». Bằng chứng trong chính tệp ca: `RB` được khai ở dòng 22 nhưng chỉ dùng ở SK6 dòng 203 cho `existsSync(RB)` — writer thật KHÔNG hề chạy trong SK5. Hệ quả đo lường: SK5 chứng «trạng thái hậu-bước-6 → skipped» trên một trạng thái do chính test dựng theo khuôn nó tưởng tượng, nên nếu `routing-baseline.mjs --write` sinh ra một khuôn khác (thêm cột, đổi thứ tự hoi/bao, ghi vào đường dẫn khác), SK5 vẫn XANH — đúng seam writer→reader mà CLAUDE.md gọi tên. Đối chiếu: các ca khác trong cùng tệp (SK0 dòng 64, và RB-pin ở routing-baseline-t1.test.mjs:62) đã làm đúng bằng cách cho writer thật ghi pin.

Rationale (khớp AC): AC-6 Given nêu rõ nguyên văn: 'dòng baseline vừa sinh bằng chính routing-baseline.mjs --write chưa commit'; finding cho thấy ca SK5 gõ tay dòng này thay vì để writer thật sinh ra, vi phạm trực tiếp điều khoản này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bước 6b nhét đường dẫn kit-nội-bộ vào lệnh SHIP cho repo tiêu thụ (vi phạm «Kit là engine»)**
  Người dùng thấy gì: Lệnh hướng dẫn ký duyệt có thể chứa một bước chỉ dành cho kho nội bộ của kit nhưng áp dụng cho mọi dự án dùng kit, có nguy cơ khiến người ký ở dự án khác gặp một lệnh vô nghĩa hoặc thông báo lỗi khó hiểu.
  file: `commands/signoff.md`
  severity: high
  Đề xuất: new-contract

- **LMCMS_ONLY không khớp ca nào vẫn exit 0 — «đối chứng dương» của bước 6b có thể xanh mà chưa bao giờ chạy**
  Người dùng thấy gì: Nếu tên ca kiểm tra đối chứng trước khi ký bị đổi hoặc gõ sai, hệ thống có thể báo 'đã kiểm tra xong' dù thực ra chưa kiểm tra gì, khiến người ký tin nhầm là đã có bằng chứng xác minh.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Nhánh fail-closed «pin vắng» của --skip-unchanged là code chết, và ca SK4 xanh qua đường khác**
  Người dùng thấy gì: Một nhánh xử lý dự phòng khi thiếu thông tin xác nhận phiên bản không bao giờ được kích hoạt trong thực tế; hệ thống vẫn dừng đúng nhưng báo thông điệp không khớp với lý do thật, có thể gây khó hiểu khi có sự cố.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **evals.yaml E3 khai một dòng PASS không tồn tại nguyên văn**
  Người dùng thấy gì: Hồ sơ mô tả kết quả kiểm tra ghi một câu chữ không khớp đúng với câu thật mà hệ thống in ra, khiến người đọc hồ sơ đối chiếu bằng tay có thể không tìm thấy bằng chứng dù việc kiểm tra thực sự đã chạy đúng.
  file: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **LMCMS_ONLY biến cả suite gate-card-lmcms thành xanh câm (0 ca chạy → exit 0)**
  Người dùng thấy gì: Nếu tên ca kiểm tra bị đổi hoặc biến môi trường đặt sai, cả bộ kiểm tra trước khi ký có thể báo 'qua' mà không chạy ca nào, làm giảm độ tin cậy của bước xác nhận trước khi ký duyệt.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: high
  Đề xuất: known-limits

- **E7 khai «pipefail + grep PASS: RB1/PASS: SK1» nhưng lệnh thật không grep gì — chiều đỏ đã khai không tồn tại**
  Người dùng thấy gì: Một dòng mô tả trong hồ sơ nói rằng hệ thống sẽ phát hiện khi tệp kiểm tra bị đặt sai tên quy cách, nhưng lệnh thật không làm việc đó — nếu tình huống ấy xảy ra, hồ sơ vẫn báo bình thường mà không cảnh báo gì.
  file: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Regex verified_commit dùng \s* nuốt xuống dòng — nhánh «không có verified_commit» chết, và --write làm hỏng dòng kế**
  Người dùng thấy gì: Trong một số định dạng hồ sơ, công cụ ghim phiên bản có thể vô tình ghi đè và xoá mất dòng chữ ký của người phê duyệt ở ngay dòng kế bên khi cập nhật thông tin phiên bản — rủi ro làm mất chữ ký đã ký.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: new-contract

- **isMain của routing-baseline.mjs gọi realpathSync không bọc try/catch — ném lúc import**
  Người dùng thấy gì: Trong một tình huống hiếm gặp, công cụ nội bộ có thể dừng đột ngột với lỗi kỹ thuật khó hiểu thay vì báo lỗi rõ ràng — chỉ ảnh hưởng người vận hành kit, không ảnh hưởng người dùng sản phẩm.
  file: `tests/scripts/routing-baseline.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — đột biến của RB2c là NO-OP, «chiều im» không có đột biến nào chạy**
  Người dùng thấy gì: Một phép kiểm tra được thiết kế để phát hiện lỗi 'ghi đè nhầm dòng của hồ sơ khác' thực ra không thử được đúng tình huống đó, nên nếu lỗi ấy xảy ra trong tương lai, phép kiểm tra sẽ không phát hiện ra.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 — «chiều IM» của RB3 là tautology: không đột biến nào được chấm lại bằng chính phép đo**
  Người dùng thấy gì: Một phần của phép kiểm tra 'hai nơi văn bản phải giống hệt nhau' không thực sự thử trường hợp sai để xác nhận nó còn hoạt động, nên độ tin cậy của phép kiểm tra này chưa được chứng minh đầy đủ.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assert CHANGELOG của SK6 đã XANH sẵn trên cây gốc, và không ghim chuỗi mà eval hứa**
  Người dùng thấy gì: Phép kiểm tra xác nhận nhật ký thay đổi có ghi mục mới cho lần này thực ra khớp với một câu chữ đã có sẵn từ trước, nên nó không thực sự chứng minh mục ghi chú cho thay đổi lần này đã được thêm vào đúng.
  file: `tests/scripts/repin-lane-skip-unchanged.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — RB2e chứng «một nguồn writer/reader» bằng GREP mã nguồn, dù eval khai «kiểm bằng import thật, không grep»**
  Người dùng thấy gì: Phép kiểm tra xác nhận hai nơi dùng chung một nguồn logic chỉ soi chữ trong mã nguồn thay vì thử thật, nên nếu sau này có người vô tình viết lại logic đó lần thứ hai, phép kiểm tra sẽ không phát hiện ra sự trôi lệch đó.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assert «bước 6b không khai vài giây» hoá rỗng im lặng nếu neo văn bản trôi**
  Người dùng thấy gì: Phép kiểm tra xác nhận lời hướng dẫn ký có ghi đúng số đo thời gian thật, thay vì ghi mơ hồ kiểu 'vài giây', có thể ngừng phát hiện lỗi này một cách âm thầm nếu tiêu đề của bước trong tài liệu bị đổi chữ sau này.
  file: `tests/scripts/routing-baseline-t1.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/15 lỗi rơi vào file không bộ đo nào phủ (_acceptance/chu-ky-khong-tu-lam-hoa-cu/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
