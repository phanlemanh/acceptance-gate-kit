## Trong hợp đồng

### 1. Chân tồn-kho mù với case đặt tên bằng template literal — vế «không sửa case cũ» của AC-7 có lớp bypass
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:67`
- severity: medium
- AC: AC-7
- source: conventions

Phép rút tên case từ diffBase dùng `grep -o "check('[^']*'"` — chỉ bắt được tên viết bằng nháy đơn. Bản origin/main của tests/workflows/acceptance-verify.test.mjs có 11 call-site `check(\`...\`)` (template literal, tên sinh lúc chạy): họ WT-T19+ (chính là các mutation-probe — lớp phòng thủ giá trị nhất của suite), W-G1, W-G2, W-G7b/c... Kiểm đếm thực tế: suite in 340 dòng PASS, răng chỉ phủ 273 tồn-kho + 16 pin mới = 289; ~51 dòng runtime-named nằm ngoài lưới. Hệ quả: XOÁ hoặc ĐỔI TÊN một case cũ thuộc lớp này → suite vẫn exit 0 (E7 xanh), rang.sh vẫn xanh (E8 xanh) — trong khi contract AC-7 và expected của E8 tuyên «sửa/xoá một case cũ → răng đỏ ghim tên case bị lệch». Đây đúng lớp «thước không gắn vào vật được giao» / «lọc theo hình-dạng-cú-pháp là blacklist» mà CLAUDE.md ghim. Sanity counter hiện có (N_OLD ≥ 1) không bắt được vì 273 tên nháy-đơn vẫn rút được. Gợi ý thước (không tự fix): đối chiếu SỐ dòng PASS tổng của bản diffBase với bản hiện tại (chạy suite trên cả hai như nếp so-ca.sh của hồ sơ lưu-kho), hoặc rút thêm lớp tên literal-template tĩnh, và hạ lời hứa trong E8/AC-7 xuống đúng vùng phủ nếu chấp nhận known-limit.

*Vì sao tính là trong hợp đồng:* AC-7 đích danh mô tả đúng cơ chế này (chân tồn-kho rút tên case từ diffBase, assert từng tên còn nguyên văn, đếm nguồn) và Coverage section ghim rõ nó là phép đo của E8 cho AC-7; finding chỉ ra cơ chế đó không phủ hết «từng tên» như AC-7 tuyên.

### 2. Chân tồn-kho của rang.sh bỏ sót âm thầm 11 case cũ đặt tên bằng template literal
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:67`
- severity: medium
- AC: AC-7
- source: bugs

Phép rút danh sách case cũ từ diffBase dùng `grep -o "check('[^']*'"` nên chỉ bắt các lời gọi check() dùng nháy đơn. Bản origin/main của tests/workflows/acceptance-verify.test.mjs có 273 case nháy đơn nhưng còn 11 lời gọi `check(\`...\`)` tên động (đã xác minh: các case WT-T19+ mutant matrix ~dòng 972–978, W-G1 ~1003–1006, W-G2 ~1019, W-G7b ~1178, W-G7c ~1190–1191 của bản base). 11 case này nằm ngoài pin: sửa hoặc xoá hẳn một case trong nhóm đó thì rang.sh vẫn xanh (sanity counter chỉ đòi N_OLD ≥ 1, và 273 case nháy đơn vẫn đủ) và E7 vẫn exit 0 — đúng kịch bản «thi công sửa case cũ cho khớp hành vi mới» mà AC-7/E8 tuyên là chặn được. Đây là under-coverage âm thầm của chính phép đo tương thích, không phải bug runtime của workflow; contract/E8 nên khai rõ giới hạn (chỉ phủ case tên tĩnh) hoặc thêm chân đếm số lời gọi check() template-literal giữa base và hiện tại để ít nhất phát hiện xoá.

*Vì sao tính là trong hợp đồng:* Cùng cơ chế đếm-nguồn mà AC-7 định nghĩa cho vế «không sửa case cũ»; finding cho thấy phép đo không đạt lời hứa «assert từng tên còn nguyên văn» của chính AC-7.

### 3. Tuyên quét LỚP nhưng chỉ có điểm-case (hình dạng 5): chân tồn-kho của rang.sh mù với 11 callsite check(`...`) — xoá cả khối ma trận mutation vẫn xanh
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:67`
- severity: high
- AC: AC-7
- source: measurement

Chân 2 (tồn-kho) rút tên case cũ từ origin/main bằng `grep -o "check('[^']*'"` (dòng 67) — pattern này CHỈ bắt check có tên là chuỗi nháy-đơn literal. Trên origin/main:tests/workflows/acceptance-verify.test.mjs có 284 callsite check() nhưng chỉ 273 dùng nháy đơn; 11 callsite dùng backtick với nội suy `${...}` (dòng 972, 977–978 — chính là vòng ma trận mutation WT-T19+ probe, 1003–1006 vòng W-G1 blocked-input, 1019 W-G2, 1178, 1190–1191 W-G7c) hoàn toàn vô hình với phép rút tên. Eval E8 (_acceptance/het-gio-khong-phai-truot/evals.yaml) tuyên chiều đỏ: «sửa/xoá một case cũ → răng đỏ ghim tên case bị lệch», nhưng xoá nguyên khối mutation-matrix hay vòng W-G1 khỏi file test hiện tại: suite vẫn exit 0 (E7 xanh), rang.sh vẫn in PASS TON-KHO (E8 xanh) — đúng lớp «tuyên quét toàn bộ case cũ, thực đo tập con». Sanity counter chỉ chặn N_OLD < 1, không đối chiếu N_OLD với tổng số callsite thật của bản base (số assert ≠ số phần tử, thiếu ma trận toàn phần viết-trước kiểu P105 — ví dụ đếm tổng `grep -c "check("` của base và đòi N_OLD + số-backtick-đã-khai = tổng, hoặc đỏ khi thấy bất kỳ `check(` nào ngoài hai khuôn đã bắt).

*Vì sao tính là trong hợp đồng:* Cùng vị trí (rang.sh dòng 67) và cùng cơ chế đếm-nguồn mà AC-7/E8 đặt tên trực tiếp; finding chứng minh cơ chế đó không giữ đúng lời hứa «đếm nguồn, không hardcode số ca, assert từng tên» của AC-7.

## Ngoài hợp đồng — người quyết ở Gate 2

Không có finding nào ngoài hợp đồng ở vòng này.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
