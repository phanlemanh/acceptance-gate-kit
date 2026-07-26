---
schema_version: 1
feature: Pre-merge enforce gap-probe presence (merge-boundary, thay cho hook write-time)
slug: gap-probe-presence-hook
risk_tier: T3
surfaces: [cli]
status: approved
approved_by: Manh Phan
approved_at: 2026-07-26T21:45:00Z
owner: manh@mstar.vn
---

## Criteria

- AC-1: Given `_acceptance/config.yaml` khai `gap_probe: required`, một contract T2/T3 ở `status` implemented/verified/signed-off KHÔNG có `gap-probe.md` lẫn entry ledger descope, VÀ slug đó có file nằm trong diff của PR (`--base`), When chạy `pre-merge-check.sh`, Then in VIOLATION nêu slug + cách khắc phục và thoát khác 0 (chặn merge).
- AC-2: Given config khai `gap_probe: advisory` HOẶC không khai khoá `gap_probe` (mặc định), cùng tình huống thiếu như AC-1, When chạy pre-merge, Then in NOTE nêu slug nhưng KHÔNG tính là violation (thoát 0 nếu không còn lỗi khác).
- AC-3: Given config khai `gap_probe: off`, cùng tình huống thiếu, When chạy pre-merge, Then KHÔNG in gì về gap-probe và không ảnh hưởng exit code.
- AC-4: Given contract T1 (hoặc risk tier nằm ngoài `signoff.required_for`) thiếu gap-probe, khi `gap_probe: required`, When chạy pre-merge, Then KHÔNG xét gap-probe cho slug đó — luật thừa hưởng đúng vòng lọc risk tier sẵn có.
- AC-5: Given `gap-probe.md` tồn tại và `verdict` đọc từ KHỐI FRONTMATTER đầu file (đúng thứ feature-loop S1#7 ghi ra) có giá trị `clean` hoặc `findings`, When chạy pre-merge ở bất kỳ mode nào, Then không in gì về gap-probe cho slug đó.
- AC-6: Given `gap-probe.md` TỒN TẠI nhưng frontmatter không có `verdict`, hoặc giá trị ngoài tập `clean|findings|probe-failed`, hoặc file không có khối frontmatter, When chạy pre-merge ở mode `required`, Then coi như THIẾU và in VIOLATION — một lệnh `touch` rỗng không vượt được chốt. Một dòng `verdict:` nằm trong THÂN BÀI (vd trích trong bảng finding) KHÔNG được tính.
- AC-7: Given `decisions.jsonl` có entry `type: descope` với `decision` mở đầu `bỏ gap-probe` (không phân biệt hoa/thường, khoan dung khoảng trắng đầu), When chạy pre-merge ở mode `required` mà thiếu file, Then KHÔNG violation, chỉ NOTE nêu `id` của entry — và phải dùng CHUNG MỘT bản cài đặt với `scripts/gate-card.js`, không phải một bản viết lại (xem ## Notes).
- AC-8: Given `gap-probe.md` có `verdict: probe-failed`, When chạy pre-merge ở mode `required`, Then NOTE ("phản biện không chạy được") chứ KHÔNG violation — probe đã chạy, chỉ là hỏng.
- AC-10: Given contract T3 ở `status` `draft` hoặc `approved` (chưa tới lượt phải có phản biện) thiếu gap-probe, khi mode `required`, When chạy pre-merge, Then KHÔNG in gì và không ảnh hưởng exit code — luật chỉ xét sau bước lọc `status implemented+`.
- AC-11: Given `_acceptance/config.yaml` khai `gap_probe` với giá trị KHÔNG nhận dạng được, When chạy pre-merge, Then đó là VIOLATION CẤU HÌNH (thoát khác 0) nêu giá trị đọc được và ba mode hợp lệ — KHÔNG rơi về `advisory` dù có in cảnh báo: fail-open có tiếng động vẫn là fail-open. Script phải chạy TIẾP hết các luật khác. Giá trị hợp lệ có nháy hoặc khác hoa-thường vẫn phải nhận đúng.
- AC-12: Given mode `required` và một slug T3 thiếu gap-probe nhưng KHÔNG có file nào của slug đó trong diff PR, When chạy pre-merge có `--base`, Then KHÔNG in gì cho slug đó — luật là về PR này, không phải về nợ lịch sử. Và khi chạy KHÔNG có `--base`, Then bỏ qua toàn bộ phần gap-probe kèm NOTE nói rõ đã bỏ qua (cùng lối với răng T1-escape), không im lặng.
- AC-13: Given `decisions.jsonl` có dòng JSON HỎNG mà nội dung thô trông giống entry descope gap-probe, When chạy pre-merge ở mode `required` mà thiếu `gap-probe.md`, Then dòng đó KHÔNG mở van thoát — vẫn VIOLATION, đúng như decision card Cổng 1 loại dòng hỏng. Van thoát fail-CLOSED, không fail-open.
- AC-14: Given luật KHÔNG cưỡng chế được (vắng `node`, hoặc thiếu `lib/gap-probe.js`), When chạy ở mode `required`, Then đó là VIOLATION (thoát khác 0) — mode `required` có SÀN fail-CLOSED: không cưỡng chế được thì không cho merge. Ở mode `advisory`/`off`: chỉ NOTE.
- AC-16: Given luật bị tắt hoặc bỏ qua vì bất kỳ lý do gì (thiếu node, thiếu lib, thiếu `--base`, `git diff` lỗi), When chạy pre-merge, Then stdout PHẢI có đúng một dòng marker máy-đọc-được dạng `GAP-PROBE: NOT ENFORCED reason=<lý do>` VÀ dòng tổng kết cuối phải khai là đã tắt — để CI grep được, không phải để người tự nhận ra giữa đám NOTE.
- AC-17: Given `--base` có mặt nhưng resolve base sha thất bại HOẶC `git diff` thoát khác 0, When chạy ở mode `required`, Then TUYỆT ĐỐI không được coi danh sách file rỗng là "không slug nào liên quan" — phải phát marker AC-16 và VIOLATION. Ở `advisory`: marker + NOTE.
- AC-18: Given `_acceptance/` KHÔNG nằm ở git root (monorepo: `pkg/_acceptance/`), và một slug T3 trong diff thiếu gap-probe, When chạy ở mode `required`, Then luật VẪN chạy và VIOLATION — hình dạng path không được làm luật tắt im lặng.
- AC-15: Given một repo chạy `acceptance-init` trên harness Codex, When đọc `_acceptance/config.yaml` sinh ra, Then thấy khoá `gap_probe` với chú thích 3 mode — y hệt bản Claude (invariant parity 2 harness của CLAUDE.md).
- AC-19: Given `scripts/gate-card.js` và lối vào pre-merge, When soi mã, Then gate-card `require` `lib/gap-probe.js` và KHÔNG còn literal regex khớp descope của riêng nó — parity phải kiểm được bằng máy, không phải bằng comment.
- AC-20: Given một BẢNG đầu vào phủ hoa/thường, khoảng trắng, dòng JSON hỏng, verdict lạ, When chạy CÙNG bảng đó qua CẢ HAI lối vào (decision card và pre-merge), Then hai bên cho kết luận GIỐNG NHAU ở TỪNG ca — không phải chỉ một ca đại diện.
- AC-9: Given thông điệp VIOLATION và NOTE mà luật này in ra, When một người chưa từng đọc kit đọc chúng, Then hiểu được đang thiếu gì và bước tiếp theo phải làm gì. (judgment)

## Coverage

- Trục mode config: `required` (chặn) | `advisory` (nhắc) | `off` (im) | khoá vắng (= advisory) [thước CE: 4 nhánh đều có AC — AC-1/2/3, mặc định gộp vào AC-2]
- Trục trạng thái probe: verdict clean/findings | vắng file | verdict thiếu-rác | probe-failed | có entry descope [thước CE: AC-5/1/6/8/7, khớp 5 trạng thái đã liệt ở tài liệu thiết kế §5]
- Trục status: draft & approved (chưa xét) | implemented/verified/signed-off (xét) [thước CE: AC-10 + bước lọc `status implemented+` sẵn có]
- Trục giá trị config: 3 mode hợp lệ | biến thể nháy-hoa-thường | giá trị lạ [thước CE: AC-1/2/3 + AC-11]
- Trục tính toàn vẹn ledger: entry JSON hợp lệ | dòng HỎNG trông giống descope | thiếu file [thước CE: AC-7/AC-13 + hành vi loại-dòng-hỏng của gate-card.js]
- Trục hình dạng path: `_acceptance/` ở git root | nằm sâu (monorepo) [thước CE: AC-18 — đúng chỗ v2 tắt im lặng]
- Trục tín hiệu khi tắt: có marker máy-đọc-được + dòng tổng kết khai | im lặng [thước CE: AC-16, và nó là điều kiện để CI grep được]
- Trục khả dụng runtime: có node (cưỡng chế) | vắng node (NOTE, không im) [thước CE: AC-14 + tiền lệ recheck-evidence.js]
- Trục bán kính: slug trong diff PR (xét) | slug ngoài diff (không xét) | không có `--base` (bỏ qua có NOTE) [thước CE: AC-1 + AC-12]
- Trục risk tier: T1 & ngoài `required_for` (không xét) | T2/T3 (xét) [thước CE: AC-4 + vòng lọc `REQUIRED_FOR` sẵn có của `pre-merge-check.sh`]

## Out of scope

- **Cài đặt lại luật bằng bash/awk trong `pre-merge-check.sh`.** ĐÃ THỬ, thất bại qua 3 round S4 (contract v2): mỗi round lộ một chỗ hai bản cài đặt lệch nhau — thứ tự khởi tạo biến, neo path, nuốt mã lỗi `git diff`, và cuối cùng là dòng JSON hỏng mở được van thoát trong khi decision card loại nó. Parity giữ bằng comment là parity không có răng. Xem `review-findings.md` + ledger d-125/d-126.
- **Hook write-time.** Đã thử và GỠ sau 3 vòng S4 (19 finding, 2 lỗ HIGH còn mở): mọi đầu vào của guard nằm trong artifact đang bị ghi, do chính agent bị ràng buộc viết; và kênh "nhắc" (stderr + exit 0) không giao được cho ai. Xem `decisions.jsonl` d-20260726T180000Z-114 và `review-findings.md`.
- **Tự chạy gap-probe.** Luật chỉ kiểm sự CÓ MẶT; sinh ra phản biện là việc của feature-loop S1#7.
- **Xác thực NỘI DUNG gap-probe.** Máy không chấm được findings có thật/đủ hay không — đó là việc của human tại Cổng 1 và của khối "Phản biện context sạch" trên decision card.
- **Phân giải per-AC cho eval.** Cả 8 eval máy dùng chung `bash tests/scripts/run-tests.sh`, nên bằng chứng máy chứng minh "suite xanh", không phân giải từng AC (độ phân giải nằm ở tên case `GP*`). Baseline round 1 đã tự đánh dấu `non_discriminating` cho đúng hình dạng này. Sửa được bằng cách cho suite một cờ lọc theo tên case, nhưng đó là scope riêng.

## Notes

- **MỘT bản cài đặt duy nhất.** Luật gap-probe (đọc verdict, khớp van thoát
  descope) sống ở `lib/gap-probe.js`; `scripts/gate-card.js` `require` nó, và
  `scripts/pre-merge-check.sh` gọi qua một node helper y hệt cách nó đã gọi
  `scripts/recheck-evidence.js` (kèm NOTE degrade khi vắng node). Parity thành
  BẤT KHẢ LỆCH THEO CẤU TRÚC, không phải theo lời hứa trong comment — đó là
  bài học đắt nhất của contract v2. Khuôn này lặp lại đúng `lib/evidence-core.js`
  (dùng chung bởi hook + recheck) mà kit đã có.
- **Bán kính đã chốt tại Cổng 1 (2026-07-26):** chỉ xét slug có file trong diff PR. Lý do: quét toàn bộ `_acceptance/` khiến repo tiêu thụ có lịch sử nhận hàng chục VIOLATION không liên quan diff ở PR đầu tiên → đội hạ mode → luật chết y như kênh NOTE của bản hook. Đánh đổi đã nhận: slug cũ chưa từng có phản biện sẽ không bị soi cho tới khi có người chạm vào nó — một luật bị tắt thì bảo vệ 0%.
- Luật sống trong vòng lặp per-slug sẵn có của `scripts/pre-merge-check.sh`, SAU hai bước lọc `REQUIRED_FOR` và `status implemented+` — nhờ vậy AC-4 đúng theo cấu trúc chứ không phải nhờ một nhánh `if` riêng.
- Mode đọc từ `_acceptance/config.yaml` khoá `gap_probe`. Khoá vắng → `advisory`: giữ tinh thần "bỏ qua phải thấy được", và khác hẳn kênh NOTE đã chết của bản hook ở chỗ CI THẬT SỰ in ra cho người đọc.
- Luật khớp descope phải giống hệt `scripts/gate-card.js:203` (`/^\s*bỏ gap-probe/i`). Case `GPP2` đang ghim vế decision card; vế pre-merge phải khớp, nếu không hai tín hiệu Cổng 1 lại mâu thuẫn nhau — đúng lỗi F4 của round 1.
