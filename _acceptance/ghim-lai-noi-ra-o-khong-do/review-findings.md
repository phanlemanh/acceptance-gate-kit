## Trong hợp đồng

- **Đo VẬT KHÁC với lời hứa (hình dạng 1): AC-4 hứa hậu tố trong section Re-pin, GN06 chỉ đo khoá JSON trong run-log**
  file: `tests/scripts/repin-lane-noi-ra.test.mjs:434`
  severity: high
  AC: AC-4
  source: measurement
  detail: AC-4 (contract.md dòng 51) và evals.yaml E6 (dòng 113-114) đều hứa: «section mang ` · diff chạm vật đo ngoài làn máy: E6 — chưa chứng lại, đi vòng S4 delta`». GN06 — eval DUY NHẤT của AC-4 — chỉ đọc `dongRepinCuoi(f.logPath)` và ghim `d.evals_not_machine_touched`; nó KHÔNG gọi `sectionCuoi()` lần nào. `grep -rn "diff chạm vật" tests/` trả 0 dòng: không ca nào trong kho ghim chuỗi này. Đã chứng minh bằng tiêm: thay `const veCham = chamNgoaiMay.length ? ... : ''` (repin-lane.mjs:462) bằng `const veCham = ''` — GN01, GN03, GN04, GN06, GN07, GN09 đều PASS. Tức là dòng chữ mà NGƯỜI đọc trong evidence-report có thể biến mất hoàn toàn mà mọi phép đo vẫn xanh; phép đo đang đứng trên proxy (khoá máy trong run-log) thay vì trên đầu ra đã hứa.
  rationale: AC-4 hứa nguyên văn chuỗi '· diff chạm vật đo ngoài làn máy: E6 — chưa chứng lại, đi vòng S4 delta' trong section Re-pin, nhưng GN06 — eval duy nhất của AC-4 — không hề đọc section này; tiêm xoá trắng chuỗi đó cho mọi ca liên quan vẫn PASS, tức AC-4 không được xác minh như đã viết.

- **Assert «chuỗi có mặt» ở bất kỳ đâu trong file hướng dẫn (hình dạng 3): vế GUIDE của GN05 tự thoả bằng chính dòng lệnh đếm**
  file: `tests/scripts/repin-lane-noi-ra.test.mjs:391`
  severity: high
  AC: AC-3
  source: measurement
  detail: "`if (!/evals_not_machine_touched/.test(guide)) errs.push('GUIDE thieu cau touched');`" quét tên khoá trên TOÀN BỘ GUIDE.md (~1200 dòng), trong khi AC-3 hứa một QUAN HỆ hẹp: câu giới hạn ở §7.1 phải nói làn GHI khoá đó khi diff chạm `paths`. Tên khoá còn nằm trong chính dòng lệnh `grep -l '"evals_not_machine_touched"' …` mà ca kiểm ở dòng 392, nên vế này đúng vô điều kiện khi lệnh đếm còn sống. Đã chứng minh bằng tiêm: xoá trọn đoạn văn §7.1 mới thêm (GUIDE.md dòng 1131-1138) và thay bằng «Khong noi gi ca.» — GN05 vẫn PASS. Đối chiếu: vế SKILL ngay bên trên (dòng 384-390) làm ĐÚNG — neo vào câu `Giới hạn khai: …` rồi đòi ba mệnh đề trong CHÍNH câu đó, và mutant của nó bắt được; vế GUIDE thiếu đúng cái neo ấy.
  rationale: AC-3 yêu cầu GUIDE §7.1 phải nói rõ làn ghi khoá mới khi diff chạm paths và mang lệnh đếm ngưỡng, với chiều đỏ 'gỡ lệnh đếm → đỏ'; GN05 chỉ quét tên khoá trên toàn GUIDE.md nên tự thoả nhờ chính dòng lệnh đếm, và xoá trọn đoạn văn/lệnh đếm §7.1 vẫn PASS — đúng chiều đỏ AC-3 yêu cầu phải đỏ.

- **Ghim NHÃN cờ thay vì NỘI DUNG cờ (hình dạng 3): GN09/GN10 không đo `ac_khong_mo` và danh sách id trong cờ vàng**
  file: `tests/scripts/repin-lane-noi-ra.test.mjs:588`
  severity: medium
  AC: AC-7
  source: measurement
  detail: AC-7/AC-8 hứa nguyên văn hai cờ với QUAN HỆ AC→eval→kiểu: «AC không có chốt máy khi ghim lại: AC-b (E2 script not-run), AC-c (E6 ui-check, E7 ui-check not-run)» và «pin hiện tại: diff đã chạm vật E6 đo». GN09 chỉ assert `html.includes('AC không có chốt máy khi ghim lại')` (dòng 588) và `html.includes('diff đã chạm vật')` (dòng 589) — hai tiền tố NHÃN, không chứa id nào; `--extract` chỉ được so ở `chot_may.ac_khong` và `chot_may.touched` (dòng 581-582), còn `chot_may.ac_khong_mo` — trường mang đúng phần diễn giải người đọc — không xuất hiện trong bất kỳ assert nào (grep `ac_khong_mo` trong tests/ chỉ ra hai dòng, đều là chuỗi trong mutant). Đã chứng minh bằng hai mũi tiêm độc lập: (a) `kieuCua` (gate-card.js:271) trả hằng 'XXBROKENXX' → GN09 và GN10 vẫn PASS; (b) rút gọn cờ fwarn thành «Pin hiện tại: diff đã chạm vật gì đó đo.» (bỏ `esc(cm.touched.join(', '))`, gate-card.js:1125) → GN09 vẫn PASS. Người ký có thể đọc một thẻ nói sai eval/kiểu nào gây ra cờ mà lưới không kêu.
  rationale: AC-7 hứa nguyên văn cờ finfo/fwarn với đúng id AC và loại eval kèm theo (ví dụ 'AC-b (E2 script not-run)'), nhưng GN09 chỉ so nhãn tiền tố; tiêm hỏng phần phân loại kiểu eval hoặc cắt cụt nội dung fwarn vẫn PASS, tức nội dung đúng-như-hứa của AC-7 không được xác minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Cờ vàng «pin đã chạm vật ngoài làn máy» tự tắt khi chạy làn ghim lần hai — chạy thêm một lượt thành đường né đo**
  Người dùng thấy gì: Khi bấm ghi lại lần thứ hai mà commit mới không đổi gì liên quan tới phần giao diện, cảnh báo 'phần giao diện có thay đổi chưa được kiểm lại' sẽ tự biến mất theo đúng thiết kế hiện tại — dù lần thay đổi giao diện trước đó vẫn chưa từng được kiểm lại thật.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: known-limits

- **chotMay fail-OPEN lặng khi không đọc được evals.yaml / run-log.jsonl, lệch nếp fail-closed của chính tệp**
  Người dùng thấy gì: Nếu tệp dữ liệu của tính năng bị hỏng, thiếu, hoặc quá lớn, hệ thống sẽ âm thầm coi như mọi thứ đã được kiểm đủ mà không báo cho người xem biết là nó không đọc được dữ liệu để kiểm.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **evals_not_machine_touched đo diff tới CÂY LÀM VIỆC sau khi executor đã chạy, không phải tới HEAD như SKILL/GUIDE khai**
  Người dùng thấy gì: Việc đo 'phần nào chưa được kiểm lại' có thể bị lẫn với những thay đổi tạm sinh ra trong lúc chính hệ thống đang chạy kiểm tra, khiến kết quả cảnh báo không hoàn toàn đáng tin trong một số tình huống hiếm.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **pathsCuaEval bỏ im lặng cả khối `paths:` khi block-seq có dòng chú thích / dòng trắng**
  Người dùng thấy gì: Nếu tệp cấu hình eval có dòng chú thích hoặc dòng trống nằm giữa danh sách đường dẫn theo dõi, hệ thống có thể bỏ sót một phần hoặc toàn bộ danh sách đó mà không báo lỗi, và báo cáo đã ký có thể ghi sai là một mục 'không khai đường dẫn' trong khi thực ra có khai.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lưới GN13 phát hiện được lần ghi đè tệp nguồn nhưng KHÔNG khôi phục được — nhánh khôi phục chết trên đường chạy thật**
  Người dùng thấy gì: Trong một tình huống hiếm khi có tiến trình khác chạy cùng lúc, nếu bộ kiểm tra tự phát hiện có tệp mã nguồn bị ghi đè ngoài ý muốn, nó báo lỗi đúng nhưng không dọn lại được — người chạy kiểm tra phải tự khôi phục tay.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
