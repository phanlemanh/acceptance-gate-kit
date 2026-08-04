# Review Findings: judgment-runs (round 8)

## Trong hợp đồng

### 1. Nhánh BLOCKED "không có gì để verify" không ghi dòng run-log kind:inert — bên đọc (thẻ Cổng 2) mất kênh duy nhất
- file: `feature-loop/workflows/acceptance-verify.js:351`
- severity: medium
- source: conventions
- AC: AC-13

Vòng lặp sửa ở S4-r7 đặt hai bất biến đối xứng: bên viết "LUÔN ghi dòng kind:inert MỖI VÒNG, kể cả khi sạch" (comment dòng 700-711), và bên đọc `scripts/gate-card.js` lấy cảnh báo ô-inert CHỈ từ `run-log.jsonl` (dòng 313-333), tính sớm để sống sót ở cả BLOCKED/REJECT. Nhưng nhánh thoát sớm BLOCKED "không có gì để verify" (dòng 347-351) return TRƯỚC chỗ push dòng inert (dòng ~712) và không có field `runLog` — chỉ mang `inertFields`.

Đã kiểm chứng bằng cách chạy workflow thật qua tests/workflows/harness.mjs với 1 judgment eval mang `runs: 3` + suiteCommands rỗng + panel carried: verdict=BLOCKED, inertFields có 1 mục, `runLog` = undefined.

Hai hệ quả:
(1) Main loop không có gì để append → run-log.jsonl không có dòng inert cho vòng đó → gate-card tính `maxRound` từ log sẽ rơi về vòng TRƯỚC và trình trạng thái inert của vòng cũ (hoặc không trình gì) trên đúng cái thẻ mà commit 25cd6d9 vừa gia cố để "sống sót ở BLOCKED/REJECT".
(2) Đúng chế độ hỏng mà comment dòng 705-711 tuyên bố đã diệt: SKILL chỉ thị chạy lại CÙNG round khi BLOCKED; nếu lần chạy lại rơi vào nhánh này thì không có dòng mới, dòng inert CŨ của cùng round vẫn là dòng inert cuối → cảnh báo không bao giờ tắt được dù người đã sửa evals.yaml.

Đây là cùng LỚP lỗi mà review vòng 7 đã quét hai lần ở phía đọc (gate-card thoát sớm, lọc theo vòng) nhưng chưa quét hết ở phía viết — đúng dạng CLAUDE.md yêu cầu "sửa phải theo LỚP: quét cả file tìm mọi case cùng hình dạng". Case WI10 (tests/workflows/acceptance-verify.test.mjs:1155) chỉ ghim `result.inertFields` ở nhánh này, không ghim dòng run-log, nên phép đo không phân biệt được.

### 2. Nhánh BLOCKED thoát sớm mang `inertFields` nhưng KHÔNG mang dòng run-log — kênh máy của thẻ trống
- file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/distracted-pike-08aa6f/feature-loop/workflows/acceptance-verify.js:351`
- severity: low
- source: bugs
- AC: AC-13

Comment ngay trên dòng 351 khẳng định "Canh bao o inert phai song sot CA nhanh thoat som — im lang o ca hiem van la im lang", và return có thêm `inertFields`. Nhưng `runLogLines` chỉ được dựng ở dòng 474 và dòng `kind:'inert'` chỉ được push ở dòng 711 — cả hai nằm SAU chỗ return này. Nhánh này không trả field `runLog` nào cả.

Sau khi diff chuyển kênh cảnh báo sang sổ chạy (scripts/gate-card.js:314-318 đọc `run-log.jsonl`, KHÔNG còn đọc `## Variance`), hệ quả là: vòng đi qua nhánh thoát sớm không ghi được dòng inert nào, nên (a) thẻ Cổng 2 không có dữ liệu mới về ô inert cho vòng đó, và (b) bất biến "chạy lại CÙNG vòng đã sạch thì cảnh báo TẮT" mà case WI12 ghim bị thủng ở đúng nhánh này — dòng inert BẨN của vòng trước vẫn là dòng inert cuối của `maxRound` nên cờ vàng không tắt được dù người đã sửa evals.yaml. Dòng log runtime `if (inertFields.length) log('O inert: ...')` (dòng ~358) cũng nằm sau return nên cũng không in.

WI10 có kiểm nhánh này nhưng chỉ assert `result.inertFields`, không assert kênh sổ chạy — nên phép đo không phân biệt được hai đường.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **expected của eval E15 lệch khỏi vật nó đo: nói 7 đột biến (thực tế 14) và mô tả sai đột biến phía VIẾT**
  Người dùng thấy gì: Bản báo cáo bằng chứng có thể ghi sai số lượng và cách thức các phép kiểm tra tự động đã chạy để chứng minh tính năng hoạt động đúng, khiến người ký duyệt hiểu nhầm về mức độ đầy đủ của bằng chứng trước khi quyết định.
  file: `_acceptance/judgment-runs/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Cảnh báo ô-inert không tới trang evidence-page — consumer thứ hai bị bỏ sót**
  Người dùng thấy gì: Khi người duyệt mở trang chi tiết bằng chứng (evidence-page) thay vì thẻ quyết định nhanh, họ có thể không thấy cảnh báo rằng máy đã bỏ qua một tùy chọn khai trong cấu hình kiểm tra, và có nguy cơ trang này hiển thị nhầm cảnh báo đó thành một lỗi kiểm tra ngẫu nhiên nghiêm trọng hơn thực tế.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/distracted-pike-08aa6f/scripts/evidence-page.js`
  severity: medium
  Đề xuất: new-contract

- **Chốt prov-chết trả `report: ''` — main loop theo bước "Mọi verdict" sẽ ghi rỗng đè evidence-report.md**
  Người dùng thấy gì: Nếu bước ghi bằng chứng gặp một lỗi tạm thời của mô hình AI, vòng chạy đó có thể ghi đè báo cáo bằng chứng của vòng trước thành trống, khiến người ký mất nội dung đã xem và làm sai số vòng đã chạy được hiển thị cho họ.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/distracted-pike-08aa6f/feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
