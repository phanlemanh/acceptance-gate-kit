## Trong hợp đồng

### 1. AC-5 hứa lane ui nhưng normKill ở lane ui không có chiều đỏ nào — xoá nó vẫn 340/0 xanh
- file: `tests/workflows/acceptance-verify.test.mjs:1529`
- severity: high
- AC: AC-5
- source: conventions

AC-5 khai «kết quả machine HOẶC ui có killedByTool=true → BLOCKED», design table đánh ✅ routing cho cả 3 lane, nhưng W26 chỉ dựng fixture lane machine và W27 chỉ lane baseline. Không case nào đi qua nhánh ui.

Đo thật (mutant trên bản sao, đã khôi phục cây):
- xoá `.map(normKill)` ở lane ui — `feature-loop/workflows/acceptance-verify.js:542` `machine.push(...(uiRaw || []).filter(Boolean).map(normKill).map(...))` → `node tests/workflows/acceptance-verify.test.mjs` = «Results: 340 passed, 0 failed», và `bash _acceptance/het-gio-khong-phai-truot/rang.sh` vẫn in «RANG-HGKPT OK (16 pin + 273 ton kho)».
- đối chứng dương: cùng phép xoá ở lane machine → 4 failed; ở lane baseline → 1 failed.

Nghĩa là: thi công có thể bỏ hẳn phòng thủ tool-kill cho ui-check mà E1–E8 đều PASS — đúng lớp «REJECT giả» mà hồ sơ này sinh ra để chặn, chỉ đổi lane. Đây là bất biến CLAUDE.md «mutant phải có ca cô lập lớp» + «ma trận toàn phần viết-trước (số assert = số phần tử)»: gap-probe P1 của chính hồ sơ đã chữa đúng lớp này cho W25 (3 mutant = 3 lane) nhưng W26 vẫn 1/2 lane. Chữa theo lớp: thêm sub-case W26 dựng ui result {exitCode:1, cannotRun:false, killedByTool:true} → blocked chứa `ui-check:E5`, verdict BLOCKED, E5 không vào failedEvals; và ghim dòng đó vào rang.sh + expected của E5.

*Vì sao tính là trong hợp đồng:* AC-5 khai routing killedByTool áp dụng cho cả machine LẪN ui, và Coverage hứa 3 mutant cô lập lớp (một mutant mỗi lane, W25); mutant thật trên lane ui không làm suite đỏ, tức nhánh ui của AC-5 chưa được xác nhận.

### 2. Đẳng thức «đóng không gian» của chân tồn-kho trộn đơn vị: grep -c đếm DÒNG, grep -o đếm LƯỢT
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:94`
- severity: medium
- AC: AC-7
- source: conventions

`N_CALL="$(... | grep -c "check(")"` đếm số DÒNG chứa `check(`, còn `N_SQ`/`N_BT` dùng `grep -o ... | wc -l` đếm số LƯỢT xuất hiện. Đẳng thức `N_CALL == N_SQ + N_BT` chỉ tình cờ đúng vì bản origin/main hiện không có dòng nào chứa 2 callsite (đo được: 284 dòng = 284 lượt = 273 + 11).

Hệ quả: tính chất được tuyên — «khuôn thứ ba chưa phủ thì ĐỎ» — không thành lập. Counterexample chạy thật: một dòng `check("x", 1); check('y', 2);` cho N_CALL=1, N_SQ=1, N_BT=0 → 1 == 1+0 vẫn xanh trong khi khuôn nháy-kép hoàn toàn không được phủ. Tự-phá-thử ở dòng 106 không chạm ca này vì nó nối `check("khuon thu ba", true);` thành MỘT DÒNG RIÊNG — mutation không đi qua chính lối thoát mà đẳng thức để hở (đúng lớp «phép đo chỉ được có MỘT lối thoát»). Chữa: đổi `grep -c` thành `grep -o "check(" | wc -l` cho cùng đơn vị, và thêm mutation tiêm callsite khuôn-thứ-ba vào CUỐI một dòng đã có `check('`.

*Vì sao tính là trong hợp đồng:* AC-7 nêu đích danh yêu cầu «đẳng thức đóng không gian tổng callsite = nháy đơn + backtick... kèm tự-phá-thử chạy cùng lượt»; phép đếm lệch đơn vị khiến đẳng thức này không thật sự đóng không gian như AC-7 mô tả.

### 3. rang.sh nuốt mã thoát của suite; chân tồn-kho không ghim dòng PASS cho case tên-động (mutation matrix đỏ vẫn xanh)
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:14`
- severity: high
- AC: AC-7
- source: bugs

Dòng 14 `OUT="$(node "$TEST_FILE" 2>&1)"` bỏ hoàn toàn `$?` (script chỉ `set -u`, không `set -e`). Vòng lặp lớp-2 (dòng 81–90) chỉ assert thân template còn nguyên văn TRONG SOURCE, không hề grep dòng `  PASS: <tên>` trong stdout — nên 11 callsite `check(`...`)` không có phép ghim runtime nào. Trong số đó có ma trận mutation WT-T19+ (tests/workflows/acceptance-verify.test.mjs:972, 977, 978) — chính lớp mà comment của script gọi là «lớp phòng thủ đắt nhất của suite». RED-TEST ĐÃ CHẠY: tiêm `check(`${name}`, false, 'INJECTED RED')` vào dòng 978 → `node tests/workflows/acceptance-verify.test.mjs` exit 1, nhưng `bash _acceptance/het-gio-khong-phai-truot/rang.sh` in `RANG-HGKPT OK (16 pin + 273 ton kho)` và exit 0 (đã khôi phục file). Đây đúng lớp «runner nuốt mã thoát» đã ghi sổ. E7 (config:executors.test.workflows) có bắt ở tầng eval, nhưng bản thân răng báo xanh trên suite đỏ, và AC-7/E8 khai chân tồn-kho phủ «MỌI khuôn đặt tên case». Chữa: kiểm `$?` của node ngay sau dòng 14 (hoặc ghim dòng `Results: N passed, 0 failed`), và với case backtick thì ghim dòng PASS đã giải chuỗi thay vì chỉ kiểm source.

*Vì sao tính là trong hợp đồng:* AC-7 yêu cầu rõ «suite tồn kho tests/workflows xanh nguyên» phải được đo, và Coverage gắn chân tồn-kho này trực tiếp với AC-7 (E8); việc rang.sh không đọc mã thoát của suite khiến lời hứa đó không thực sự được xác nhận — RED-TEST đã chứng minh suite đỏ vẫn báo OK.

### 4. Đẳng thức «đóng không gian» trộn đếm-DÒNG với đếm-LƯỢT — khuôn tên thứ ba vẫn lọt
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:94`
- severity: medium
- AC: AC-7
- source: bugs

Dòng 94 dùng `grep -c "check("` (đếm số DÒNG có match) trong khi dòng 95–96 dùng `grep -o ... | wc -l` (đếm số LƯỢT xuất hiện). Hai ngữ nghĩa khác nhau nên đẳng thức N_CALL == N_SQ + N_BT không thật sự đóng không gian như comment dòng 92–93 tuyên bố. RED-TEST ĐÃ CHẠY: nối thêm vào BASE_SRC đúng MỘT dòng chứa hai callsite `  check('a', 1); check("khuon thu ba", 2);` → N_CALL=285, N_SQ=274, N_BT=11 → 285 == 285, đẳng thức VẪN XANH dù có callsite khuôn nháy-kép chưa ai phủ. Tự-phá-thử ở dòng 105 không bắt được vì nó tiêm khuôn thứ ba trên MỘT DÒNG RIÊNG, tức chỉ đi qua nhánh dễ. Chữa: đổi dòng 94 thành `grep -o "check(" | wc -l | tr -d ' '` cho cùng ngữ nghĩa, và thêm một lượt tự-phá-thử tiêm khuôn thứ ba CHUNG DÒNG với một callsite đã phủ.

*Vì sao tính là trong hợp đồng:* Cùng cơ chế đẳng thức đóng không gian mà AC-7 nêu đích danh; đếm sai đơn vị làm khuôn đặt tên thứ ba có thể lọt qua mà không bị phát hiện, trái với «khuôn thứ ba chưa phủ thì ĐỎ» trong AC-7.

### 5. Hình dạng 5 — tuyên «đóng không gian» nhưng đẳng thức đếm SAI ĐƠN VỊ (dòng vs lượt), lọt khuôn thứ ba
- file: `_acceptance/het-gio-khong-phai-truot/rang.sh:94`
- severity: medium
- AC: AC-7
- source: measurement

Chân TON-KHO-MA-TRAN tự khai là phép đóng không gian cho «mọi khuôn đặt tên case» (comment dòng 88–92, và evals.yaml E8 hứa «khuôn thứ ba chưa phủ thì ĐỎ»). Nhưng ba bộ đếm không cùng đơn vị:

  N_CALL="$(printf '%s\n' "$BASE_SRC" | grep -c "check(")"      # grep -c đếm DÒNG có match
  N_SQ="$(... | grep -o "check('" | wc -l ...)"                  # đếm LƯỢT xuất hiện
  N_BT="$(... | grep -o 'check(`' | wc -l ...)"                  # đếm LƯỢT xuất hiện

Đẳng thức N_CALL == N_SQ + N_BT chỉ đúng khi mỗi dòng có ĐÚNG một callsite — hiện base đúng như vậy (284 = 273 + 11) nên nó xanh do may, không do luật. Đã chạy thật để chứng: thêm vào bản sao base MỘT dòng chứa hai callsite `  check("khuon thu ba", true); check('ke ben', true);` → N_CALL=285, N_SQ=274, N_BT=11, tổng=285 ⇒ ĐẲNG THỨC VẪN CÂN, khuôn nháy-kép LỌT. Tức mọi callsite khuôn-thứ-ba nằm chung dòng với một callsite đã phủ đều vô hình với phép đo — đúng lớp lỗi mà chân này được sinh ra để chữa ở vòng r1 (lọc theo hình-dạng-cú-pháp là blacklist).

Tự-phá-thử ở dòng 104–112 không bắt được lỗ này vì nó tiêm callsite thứ ba trên MỘT DÒNG RIÊNG (MUT_SRC = BASE_SRC + '\n  check("khuon thu ba", true);') — trường hợp duy nhất mà lệch đơn vị tình cờ không xảy ra. Nên nó là điểm-case, không phải ma trận: hai vế của không gian (khuôn-thứ-ba-riêng-dòng · khuôn-thứ-ba-chung-dòng) chỉ có một vế được viết ra, và vế còn lại là vế đỏ thật.

*Vì sao tính là trong hợp đồng:* Trùng cơ chế đẳng thức đóng không gian mà AC-7 mô tả nguyên văn; RED-TEST chứng minh callsite khuôn nháy-kép chung dòng với callsite đã phủ vẫn lọt qua, vi phạm trực tiếp yêu cầu «khuôn thứ ba chưa phủ thì ĐỎ» của AC-7.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **«Tự-phá-thử» của răng là hằng đúng — mutation là nghịch đảo chính xác của assertion, không bao giờ đỏ được**
  Người dùng thấy gì: Một vòng tự-kiểm-tra trong quy trình duyệt tự động không bao giờ có thể phát hiện lỗi dù có, nên báo cáo vẫn ghi 'đã kiểm chứng' trong khi một lớp bảo vệ thực chất không hoạt động.
  file: `_acceptance/het-gio-khong-phai-truot/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Plan của hồ sơ không được commit trong khi mọi hồ sơ trước đều commit**
  Người dùng thấy gì: Tài liệu kế hoạch của tính năng này chưa được lưu vào lịch sử commit; nếu nhánh làm việc bị dọn hoặc gộp, nội dung kế hoạch có thể mất dấu mà không ai nhận ra.
  file: `docs/superpowers/plans/2026-08-18-het-gio-khong-phai-truot.md`
  severity: low
  Đề xuất: known-limits

- **Chú thích W26 nói «cùng fixture, chỉ field cấu trúc đổi» nhưng đối chứng đổi hai biến**
  Người dùng thấy gì: Một dòng ghi chú giải thích trong bộ kiểm thử mô tả không đúng cách phép so sánh được thực hiện, có thể khiến người bảo trì sau này hiểu nhầm mức độ chặt chẽ của phép kiểm — kết quả kiểm thử hiện tại vẫn đáng tin.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — «tự-phá-thử» từng pin là tautology: nhánh do_fail không thể chạy, chiều đỏ được khai là giả**
  Người dùng thấy gì: Một bước 'tự kiểm tra xem phép kiểm có hoạt động không' trong quy trình duyệt tự động về mặt toán học không bao giờ có thể phát hiện lỗi, dù báo cáo vẫn ghi là đã chạy thử chiều thất bại.
  file: `_acceptance/het-gio-khong-phai-truot/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — chân TON-KHO-TPL đo NGUỒN thay vì ĐẦU RA: 11 case tên-động chỉ được grep trong source, không có bằng chứng đã CHẠY**
  Người dùng thấy gì: Với một nhóm trường hợp kiểm thử được đặt tên theo khuôn thứ hai, công cụ chỉ xác nhận đoạn mã có mặt trong nguồn chứ không xác nhận trường hợp đó thực sự đã chạy và pass — nếu một trong số đó ngừng chạy vì lỗi cấu hình, hệ thống có thể vẫn báo xanh.
  file: `_acceptance/het-gio-khong-phai-truot/rang.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
