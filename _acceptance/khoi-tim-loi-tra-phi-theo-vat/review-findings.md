# Review Findings: khoi-tim-loi-tra-phi-theo-vat (round 1)

## Trong hợp đồng

(rỗng — bước phân loại phạm vi không chạy được, không finding nào được máy map vào AC ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **_acceptance/config.yaml không còn là YAML hợp lệ — 6 khoá executor mới chứa ": " trong plain scalar**
  Người dùng thấy gì: Tệp cấu hình mới có thể không mở được bằng các công cụ đọc YAML thông thường (trình soạn thảo, script kiểm tra ngoài), dù kit vẫn tự chạy được — rủi ro âm thầm làm hỏng công cụ khác đọc cùng tệp này.
  file: `_acceptance/config.yaml:294`
  severity: high
  Đề xuất: new-contract

- **Làn finder bị cố ý bỏ không để lại vết máy-đọc-được trong result — «0 finding» giống hệt «không làn nào chạy»**
  Người dùng thấy gì: Khi hệ thống bỏ qua một số bước rà soát để tiết kiệm chi phí, người duyệt kết quả không có cách nào biết bước đó đã bị bỏ qua — báo cáo có thể trông như đã kiểm tra kỹ dù thực ra chưa kiểm tra gì.
  file: `feature-loop/workflows/acceptance-verify.js:564`
  severity: medium
  Đề xuất: new-contract

- **laFileDo (bên ĐỌC) và vùng vật (bên VIẾT) bất đồng về «mã đo» — _acceptance/config.yaml không kích hoạt lens measurement**
  Người dùng thấy gì: Khi một lần thay đổi chỉ sửa cách đo (lệnh kiểm tra) mà không sửa file nào khác, hệ thống có thể không tự kiểm tra lại xem phép đo mới còn đúng không.
  file: `feature-loop/workflows/acceptance-verify.js:522`
  severity: medium
  Đề xuất: new-contract

- **byRole đếm (agent × model) nhưng gọi là «agents» — số đếm của dòng 4–5 sai khi một agent dùng hai model**
  Người dùng thấy gì: Trong trường hợp hiếm một phiên làm việc đổi mô hình AI giữa chừng, số liệu thống kê chi phí dùng để ra quyết định phát hành có thể bị đếm cao hơn thực tế.
  file: `feature-loop/scripts/wf-usage.mjs:148`
  severity: low
  Đề xuất: known-limits

- **Finding `unverified` (refuter chết) nay lọt vào khối «## Trong hợp đồng» của review-findings.md, mâu thuẫn với rejectFindings và với verdict PASS**
  Người dùng thấy gì: Trong một số trường hợp, cùng một lỗi có thể xuất hiện hai lần trong báo cáo với hai trạng thái khác nhau (một chỗ ghi là lỗi đã xác nhận, một chỗ ghi là chưa kiểm chứng được), khiến người đọc báo cáo khó biết nên tin phần nào.
  file: `feature-loop/workflows/acceptance-verify.js:1313`
  severity: high
  Đề xuất: new-contract

- **`_acceptance/config.yaml` không được coi là «file đo» nên lens `measurement` không spawn khi vòng đổi chính định nghĩa lệnh đo**
  Người dùng thấy gì: Khi một lần thay đổi chỉ sửa cách đo mà không sửa file kiểm tra nào khác, hệ thống có thể bỏ qua việc kiểm tra lại phép đo đó.
  file: `feature-loop/workflows/acceptance-verify.js:523`
  severity: medium
  Đề xuất: new-contract

- **Hai bản `globToRe` (bên VIẾT s4-args/carry-plan vs bên ĐỌC acceptance-verify) vẫn lệch nhau ở mẫu `**/<chữ>`; ma trận VV4b không phủ hình dạng đó**
  Người dùng thấy gì: Với một số cách viết mẫu loại-trừ tệp khá đặc biệt, hệ thống có thể không loại đúng tệp đó ở mọi nơi, khiến vài cảnh báo không liên quan vẫn lọt vào báo cáo.
  file: `feature-loop/scripts/carry-plan.mjs:83`
  severity: medium
  Đề xuất: known-limits

- **Finding ngoài hợp đồng trên tệp NGOÀI-VẬT được carry vĩnh viễn: `deltaFiles` không còn chứa tệp đó nên «file đã đổi» không bao giờ phát hiện được**
  Người dùng thấy gì: Một cảnh báo không thuộc phạm vi xét duyệt (ví dụ ghi chú trên tài liệu) có thể bị lặp lại mãi trong báo cáo ở mọi lần chấm sau, kể cả sau khi tài liệu đó đã được viết lại xong, vì hệ thống không nhận ra tài liệu đã đổi.
  file: `feature-loop/scripts/carry-plan.mjs:187`
  severity: medium
  Đề xuất: new-contract

- **`byRole[*].agents` và `agentsKhongCoThoiGian` đếm HÀNG (agent × model), không đếm agent**
  Người dùng thấy gì: Trong trường hợp hiếm một phiên đổi mô hình AI giữa chừng, số liệu thống kê dùng để ra quyết định phát hành có thể bị đếm cao hơn thực tế.
  file: `feature-loop/scripts/wf-usage.mjs:146`
  severity: low
  Đề xuất: known-limits

- **Assert "chuỗi có mặt" trong khi lời hứa là QUAN HỆ (bỏ câu cũ + thêm câu mới) — W40 chỉ kiểm nửa còn lại**
  Người dùng thấy gì: Bộ kiểm tra tự động hiện chưa chắc chắn phát hiện được nếu sau này có người vô tình để sót câu văn cũ (mâu thuẫn với câu mới) quay lại — rủi ro nằm ở tương lai, không phải ở bản hiện tại.
  file: `tests/workflows/acceptance-verify.test.mjs:2272`
  severity: high
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng phép đếm chỉ phủ một phần lớp — grep bỏ đúng thư mục chứa bên ghi run-log**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để cảnh báo khi có thêm chỗ mới đọc sổ ghi lại đang bỏ sót đúng khu vực mã nguồn liên quan nhất, nên cảnh báo đó có thể không kêu khi cần.
  file: `tests/scripts/finding-line-bo-doc.test.mjs:150`
  severity: medium
  Đề xuất: known-limits

- **Chiều đỏ và thông điệp ghim trong `expected` là tuyên khống — mô tả PASS-line và assert không tồn tại trong tệp ca**
  Người dùng thấy gì: Phần mô tả trong hồ sơ kiểm thử ghi những điều bài kiểm tra thực tế không làm, khiến người đọc hồ sơ để duyệt có thể hiểu nhầm là bài kiểm tra chứng minh nhiều hơn thực tế.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml:113`
  severity: medium
  Đề xuất: known-limits

- **Bằng chứng ghi lại (`output`) không chứa chính dòng mà eval dùng làm điều kiện xanh**
  Người dùng thấy gì: Bản ghi bằng chứng lưu lại cho người duyệt có thể không chứa đúng dòng chứng minh mà báo cáo hứa hẹn, khiến người duyệt khó tự đối chiếu bằng mắt dù kết quả cuối cùng vẫn đúng.
  file: `_acceptance/config.yaml:294`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **Vùng vật rỗng → KHÔNG lane tìm-lỗi nào chạy, nhưng `result` không mang dấu hiệu nào; Cổng 2 thấy một vòng PASS sạch**
  file: `feature-loop/workflows/acceptance-verify.js:564`
  severity: medium
  source: bugs
  detail: `REVIEWERS_ACTIVE` rỗng khi `coVungVat && vungVat.length === 0` (và measurement cũng bị loại vì `chamFileDo` false). Khi đó: `reviewResults` rỗng → vòng lặp ở dòng 880 duyệt `REVIEWERS_ACTIVE` (rỗng) nên `reviewIncomplete` cũng rỗng; `boNgoaiVat` rỗng; kết quả trả về (dòng 1317+) KHÔNG có trường `finders` hay `vungVat` — hai trường đó chỉ tồn tại trong nhánh `dryRun` (dòng 575–576). Dấu vết duy nhất là `log('Vung vat rong — khong spawn finder bugs/conventions (0 token)')`, tức dòng log của harness, KHÔNG phải trường hợp đồng kết quả mà main loop của SKILL đọc. SKILL.md chỉ được dặn báo `boNgoaiVat` và `reviewIncomplete`. Đường tới trạng thái này không hiếm: `s4-args.mjs` cố ý CHO PHÉP `--diff-base` khai tường minh trùng HEAD đi tiếp (ca VV6c) và sinh args với `vungVat: []`; một mốc so neo sai theo cách khác cũng cho cùng hình dạng. Đã chạy thật: `vungVat: []` → finder spawn = [], `verdict = PASS`, `reviewIncomplete = []`, `boNgoaiVat = []`, `'finders' in result === false`. Sửa: trả `finders` (lane thật sự chạy) + `vungVat` ở cả đường không-dryRun, và để SKILL nêu một dòng ở gói Cổng 2 khi danh sách lane rỗng.
  failure_scenario: Chạy S4 với `--diff-base <sha trùng HEAD>` (hoặc mốc so neo sai theo cách khác): args mang `vungVat: []`; workflow bỏ cả ba lane finder; verdict PASS; result không có trường nào nói ra điều đó; gói Cổng 2 in ra một vòng xanh sạch dù chưa lane nào đọc code.

## Chưa adversarial-verify (refuter chết)

(rỗng — không finding nào ghi nhận refuter chết trong lượt này)

⚠ Cụm ngoài vùng phủ: 4/14 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, tests/scripts/finding-line-bo-doc.test.mjs, _acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.