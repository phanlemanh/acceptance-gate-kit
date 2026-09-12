## Trong hợp đồng

- **Lưới THƯỜNG TRỰC import fixture từ thư mục hồ sơ `_acceptance/` — đúng lớp coupling ADR 0015 đã trả giá**
  file: `tests/scripts/cua-veto-sau-chu-ky.test.mjs:13`
  severity: high
  source: conventions
  AC: AC-12
  `const F = await import(path.join(HERE, '..', '..', '_acceptance', 'cua-veto-sau-chu-ky', 'fixture.mjs'))` — ca này được `tests/scripts/run-tests.sh` tự nạp (vòng `for _f in "$HERE"/*.test.mjs`, dòng 2769) nên nó nằm trong CI thường trực, trong khi vật nó phụ thuộc nằm trong thư mục hồ sơ. ADR 0011 chốt thẳng: răng-hồ-sơ là lớp RẺ dùng-rồi-bỏ, mọi bảo đảm DÀI HẠN phải vào lưới thường trực NGAY TỪ LƯỢT ĐẦU. ADR 0015 đã trả giá đúng lớp này: khi `git rm` 24 thư mục `_acceptance/<slug>/`, bốn răng từng đọc vật hồ sơ lưu kho phải đổi sang hồ sơ sống, và artifact của `delta-verify-repin` phải chép NGUYÊN VĂN vào `tests/plugins/fixtures/luu-kho-2026-09-08/` («bản đông lạnh có tên, không viết tay»). Lần này hướng ngược lại: hồ sơ khép/lưu kho → `fixture.mjs` biến mất → `tests/scripts/run-tests.sh` đỏ toàn bộ ở bước «scripts suite» của `.github/workflows/gate.yml`, tức CI chết cứng chứ không suy giảm mềm. Chú thích ở đầu file có nêu và hoãn quyết (sổ `d-20260912T024254Z-14`), nhưng việc hoãn chính là chỗ ADR 0011 cấm: quyết «chuyển fixture.mjs về tests/ hay nhân bản» phải làm trong lượt này, không phải sau khi hồ sơ khép.
  Vì sao trong hợp đồng: AC-12 nói rõ mục đích của ca thường trực này là "để luật còn răng SAU KHI răng hồ sơ chết theo hồ sơ"; ca lấy fixture trực tiếp từ thư mục hồ sơ `_acceptance/` sẽ hỏng ngay khi hồ sơ đó được lưu kho, tức làm hỏng chính điều kiện AC-12 yêu cầu.

- **Hình dạng 5 — chốt «một nguồn» tuyên quét LỚP «mọi tệp dưới scripts/» nhưng vế biểu thức chỉ là điểm-case một tệp**
  file: `_acceptance/cua-veto-sau-chu-ky/chan-dang-thuc.mjs:49`
  severity: medium
  source: measurement
  AC: AC-6
  evals.yaml E6 khai lớp: «(0) Chứng một nguồn: không tệp nào dưới scripts/ giữ bảng giữ-chỗ hay biểu thức đọc human_signoff riêng». Vế BẢNG được quét theo lớp thật (`quetBang()` dòng 35–41 `readdirSync(scripts)` rồi lọc mọi `.sh/.mjs/.cjs/.js`). Vế BIỂU THỨC thì chỉ có một dòng điểm-case: `const scanSrc = readFileSync(path.join(F.ROOT, 'scripts/start-scan.mjs'), 'utf8');` + `if (/human_signoff[^\n]*(\/|match\(|RegExp)/.test(scanSrc))` — chỉ đọc ĐÚNG MỘT tệp. Trên chính cây đang kiểm có 4 tệp dưới `scripts/` nhắc `human_signoff`, trong đó `scripts/evidence-page.js:54` (`const signoff = clean(rfm.human_signoff);`) là một bộ đọc thứ ba của cùng trường, dùng bộ giải frontmatter riêng, và không lượt quét nào chạm tới nó. Số assert không bằng số phần tử của lớp đã tuyên (1 thay vì số tệp dưới `scripts/`), nên một bản dựng thứ hai mọc ở bất kỳ tệp nào khác `start-scan.mjs` vẫn cho màu xanh.
  Vì sao trong hợp đồng: AC-6(0) đòi "không tệp nào dưới scripts/ giữ ... biểu thức đọc human_signoff của riêng nó", nhưng eval kiểm điều này chỉ quét đúng một tệp (start-scan.mjs) trong khi scripts/evidence-page.js cũng tự đọc human_signoff bằng bộ giải riêng — tức AC-6 không thật sự được bảo đảm trên cây hiện tại.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bảng giữ-chỗ dựng LẦN HAI trong bash, và phép đo giữ hai bản khớp nhau đã chết (không eval nào, không lưới thường trực nào chạy nó)**
  Người dùng thấy gì: Nếu sau này có ai thêm hoặc sửa một kiểu chữ ký giữ-chỗ, phần kiểm tra dự phòng dùng khi máy thiếu công cụ hỗ trợ có thể không được cập nhật theo, và hiện không có cảnh báo nào cho biết điều đó — rủi ro này đã được ghi nhận là giới hạn đã biết, chưa sửa trong vòng này.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: known-limits

- **Cờ `NARROW_NET_BLIND` đặt trong `chu_ky_gia_tri` chết trong subshell — khối NOTE mới không bao giờ in cho đường này**
  Người dùng thấy gì: Trên một máy thiếu công cụ hỗ trợ đi kèm, người có thể bị báo sai là 'chưa ký' dù đã ký hợp lệ, mà không có cảnh báo nào cho biết máy đang chạy ở chế độ kiểm tra bị thu hẹp — giới hạn này đã được ghi nhận và tạm chưa sửa.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **`DV5u-mutant` chấm trên BẢN CHÉP thân DV5u chứ không gọi DV5u — làm yếu luật thật vẫn xanh**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để bảo vệ quy tắc 'chỉ được thêm, không được bớt luật chặn' có thể vẫn báo đạt ngay cả khi quy tắc đó bị nới lỏng thật sự, khiến người xem báo cáo yên tâm nhầm — giới hạn này đã được ghi nhận, chưa sửa trong vòng này.
  file: `tests/scripts/additive-only.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **NARROW_NET_BLIND=1 trong chu_ky_gia_tri() nằm trong subshell — cờ khai-báo-bản-lùi bị mất**
  Người dùng thấy gì: Trên một máy thiếu công cụ hỗ trợ đi kèm, một hồ sơ đã ký hợp lệ có thể bị lưới báo nhầm là 'chưa ký, còn mở', mà không có dòng cảnh báo nào cho biết máy đang chạy kiểu kiểm tra thu hẹp — giới hạn này đã được ghi nhận, chưa sửa trong vòng này.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — hai chiều đỏ của chan-lui-engine.mjs là assertion âm-tính-một-mình (không có bằng chứng bản tiêm chạy trọn)**
  Người dùng thấy gì: Một kiểm tra tự động cho chế độ dự phòng khi thiếu công cụ hỗ trợ có thể báo 'đạt' ngay cả khi phần bị thử lỗi chưa từng thực sự chạy, nên một lỗi thật ở chế độ đó có thể lọt qua mà không ai biết.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-lui-engine.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — chiều đỏ DV5u-mutant chép tay lại vị từ bên đọc thay vì chạy chính chốt DV5u**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để bảo vệ quy tắc 'chỉ được thêm, không được bớt luật chặn' có thể vẫn báo đạt ngay cả khi quy tắc đó bị nới lỏng thật sự — giới hạn này đã được ghi nhận, chưa sửa trong vòng này.
  file: `tests/scripts/additive-only.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **INIT-CI-COPY-LIST khai thiếu hệ quả mới của `lib/evidence-core.cjs` — nay nó chống lưng một luật CHẶN và vị từ cửa veto**
  file: `commands/acceptance-init.md:154`
  severity: medium
  source: conventions
  Mục `lib/evidence-core.cjs` vẫn ghi «the evidence bar shared with the hook; the re-check cannot load without it». Sau diff này file đó còn là NGUỒN của: (a) luật CHẶN giữ-chỗ chữ ký (`placeholder_signoff` → `node "$CHU_KY_LIB" giu-cho`, pre-merge-check.sh:443); (b) giá trị chữ ký của luật Cổng 2 (`chu_ky_gia_tri`, dòng 1061); (c) vị từ cửa veto (`signoff_that`, dòng 486). Khuôn của chính danh sách này là mỗi mục KHAI hệ quả khi thiếu (xem entry `ac-line.cjs` «possible spurious blocks», `lop-nhin-thay.cjs` «never blocks»), nên mục understated ở đây làm consumer đọc danh sách quyết sai mức ưu tiên. Hệ quả thiếu file, đo thật ở lượt chấm 4 và khai ở Known limits của hợp đồng: `signoff_that` trả «chưa ký» cho MỌI hồ sơ và KHÔNG bật cờ nào → hồ sơ ĐÃ KÝ bị in lại «làn V — cửa veto mở» và bị đếm vào `VETO_OPEN_N`; `chu_ky_gia_tri` lùi về `front_field` (ngữ pháp hẹp hơn) → hồ sơ ký bằng `human_signoff = <tên>` bị chặn với lý do SAI («is empty»). Bán kính là repo tiêu thụ mang cổng vào mà chép thiếu `lib/` — đúng đối tượng danh sách này phục vụ.

⚠ Cụm ngoài vùng phủ: 3/9 lỗi rơi vào file không bộ đo nào phủ (commands/acceptance-init.md, _acceptance/cua-veto-sau-chu-ky/chan-lui-engine.mjs, _acceptance/cua-veto-sau-chu-ky/chan-dang-thuc.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
