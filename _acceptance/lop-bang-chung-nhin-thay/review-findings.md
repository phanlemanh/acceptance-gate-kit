## Trong hợp đồng

- **Hình dạng 3 — assert «có dòng W8» trong khi lời hứa là QUAN HỆ alias web→ui→nghĩa vụ ui-check (L42/L42b)**
  file: `tests/scripts/run-tests.sh:1211`
  severity: high
  AC: AC-2
  L42 và L42b (dòng 1211–1212) chỉ khớp `*"[feat-lnt] W8 "*` — bất kỳ dòng W8 nào. W8 có BA nhánh trong eval-coverage-lint.js (token-lạ · nhãn lạc chỗ · nghĩa vụ ui-check). Khi alias `web` bị gỡ khỏi SURFACE_ALIAS thì `web` thành token lạ, nhánh token-lạ nổ và L42 vẫn XANH dù đúng cái nó hứa đo (alias web → ui → đòi ui-check) đã chết. Đã kiểm thực nghiệm trên bản sao lib bỏ `web: 'ui'`: lint in dòng `W8 surfaces carry token(s) outside the enum: web`, mẫu L42 vẫn PASS. Chính test.mjs LNT1 dòng 103–104 đã nhận ra bẫy này và ghim dòng NGHĨA VỤ (`\] W8 surfaces include a human-visible UI`) — run-tests.sh không làm thế. evals.yaml E2 hứa «(c) [web]/[web-ui] → như (a)» tức phải ghim cụm «không có eval» — L42/L42b không ghim. So sánh: L50 (dòng 1228) và L51 (1229) cùng mẫu `*W8*` nhưng fixture `ui` không có token lạ nên chỉ nhánh nghĩa vụ nổ được — hai ca đó không mắc; chỉ hai ca alias mắc. Rationale: AC-2(c) yêu cầu rõ với surfaces [web]/[web-ui] phải xử lý «như (a)» tức có đúng cụm thông điệp «không có eval ui-check»; hai case này chỉ khớp bất kỳ dòng W8 nào nên không thực sự xác minh đúng nghĩa vụ mà AC-2(c) hứa, để lọt một hình dạng lỗi làm sai chính quan hệ alias mà AC yêu cầu.

- **Hình dạng 5 — lời hứa hai điều kiện (exit_code ≠ 0 HOẶC thiếu screenshot) nhưng chỉ có một điểm-case gộp cả hai (LNT4 a)**
  file: `tests/plugins/lop-nhin-thay.test.mjs:151`
  severity: medium
  AC: AC-4
  AC-4(a) và evals.yaml E4 hứa ui-check KHÔNG đạt khi «exit_code ≠ 0 hoặc không có screenshot:» — lớp có 2 phần tử độc lập. `uiBlock(..., {pass:false})` (dòng 151) làm CẢ HAI cùng lúc: đặt exit_code 4 VÀ xoá dòng screenshot/observed. Không có ca «exit 0 nhưng thiếu screenshot» hay «có screenshot nhưng exit ≠ 0». Hệ quả đo được: mutant gate-card.js đổi `=== '0' && !!(e.screenshot…)` thành `|| ` (uiPassed, dòng ~736) → LNT4 vẫn PASS (đã chạy trên bản sao: `PASS: [LNT4]`, exit 0). Số assert (1 ca âm) < số phần tử lớp (2) — thiếu ma trận toàn phần viết trước. Rationale: AC-4(a) đặc tả rõ ràng hai điều kiện độc lập (không đạt vì verdict/exit khác 0 HOẶC vì thiếu ảnh chụp) nhưng test chỉ có một ca gộp cả hai cùng lúc, nên nhánh 'exit 0 nhưng thiếu ảnh chụp' và nhánh 'có ảnh nhưng exit khác 0' của chính AC-4(a) chưa được xác minh riêng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Docs and lib comment assert a hook tooth that does not exist (frame required on every ui-check block)**
  Người dùng thấy gì: Tài liệu nội bộ nói rằng một bước tự động đã bắt buộc phải có ảnh chụp màn hình cho mọi kiểm tra giao diện, nhưng thực tế bước đó chưa làm việc này — người đọc tài liệu có thể yên tâm nhầm rằng đã được bảo vệ sẵn.
  file: `skills/acceptance/references/eval-executors.md`
  severity: medium
  Đề xuất: known-limits

- **PM-LNT-dv5 measures git branch state against local `main`, not the delivered artifact**
  Người dùng thấy gì: Một phép kiểm tra nội bộ so sánh với nhánh chính hiện tại của máy phát triển; sau khi gộp vào nhánh chính hoặc ở một số môi trường kiểm tra khác, phép kiểm này có thể không còn phát hiện đúng vấn đề — nhưng đây là cách đo được chấp nhận có chủ đích, không ảnh hưởng người dùng cuối.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **New human-facing script messages use CONTEXT.md `_Avoid_` terms (màn hình, bare ledger)**
  Người dùng thấy gì: Một vài dòng thông báo mới trong công cụ dùng từ ngữ chưa đúng chuẩn thuật ngữ nội bộ đã quy định, có thể hơi khó hiểu cho người đọc báo cáo nhưng không ảnh hưởng tới kết quả hay quyết định của họ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **PM-LNT-dv5 is a permanent ratchet: any future deletion in pre-merge-check.sh fails the suite**
  Người dùng thấy gì: Một phép kiểm tra nội bộ so sánh với nhánh chính có thể tự động báo lỗi trong các thay đổi hợp lệ ở tương lai không liên quan tới tính năng này — đây là cách đo có chủ đích trong thiết kế hiện tại, không phải sự cố ảnh hưởng người dùng ngay bây giờ.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Gate-1 card ignores a named ui-observed descope when evals.yaml is absent**
  Người dùng thấy gì: Trong một tình huống hiếm — khi hồ sơ tính năng chưa có danh sách kiểm tra cụ thể — hệ thống có thể vẫn hiện cảnh báo thiếu bằng chứng hình ảnh dù người phụ trách đã khai rõ lý do bỏ qua, khiến người duyệt thấy một cảnh báo không cần thiết.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **pre-merge NOTE lane swallows lib errors and mislabels them as «thiếu node hoặc lib»**
  Người dùng thấy gì: Trong một tình huống hiếm khi công cụ kiểm tra nội bộ gặp trục trặc kỹ thuật khác (không phải do thiếu tệp), thông báo hiển thị vẫn ghi là 'thiếu tệp', khiến người vận hành khó tìm đúng nguyên nhân thật — nhưng đây không phải lỗi chặn việc bàn giao.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (biến thể) — phép đo so với nhánh `main` của checkout tác giả, tự im lặng khi không có/đã merge (LNT1 chiều-đỏ-có-sẵn)**
  Người dùng thấy gì: Một phần kiểm tra tự động dựa vào trạng thái nhánh chính hiện có trên máy người viết mã; trong vài tình huống hiếm (không có nhánh chính cục bộ, hoặc thay đổi đã được gộp), phần kiểm này có thể lặng lẽ bỏ qua — nhưng đây là cách đo hợp đồng đã chấp nhận, không ảnh hưởng người dùng cuối.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (biến thể) — PM-LNT-dv5 đo `git diff main` của checkout tác giả, xanh rỗng sau merge và bỏ qua có tiếng ở checkout thiếu `main`**
  Người dùng thấy gì: Một phép kiểm tra nội bộ so sánh với nhánh chính có thể trở nên vô nghĩa sau khi thay đổi được gộp, hoặc lặng lẽ bỏ qua ở môi trường kiểm tra thiếu nhánh chính cục bộ — đây là cách đo có chủ đích của thiết kế hiện tại, không phải sự cố ảnh hưởng người dùng.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — evals.yaml E6 tuyên «bảy mệnh đề (i)–(vii), 7 bản sao» nhưng reader LNT6 chỉ có 6 mệnh đề / 6 mutant**
  Người dùng thấy gì: Một tệp mô tả kỹ thuật nội bộ ghi nhầm số lượng mục kiểm tra (nói bảy nhưng thực tế sáu), một sai sót nhỏ trong tài liệu không ảnh hưởng tới việc kiểm tra thực tế hay tới người dùng.
  file: `_acceptance/lop-bang-chung-nhin-thay/evals.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).