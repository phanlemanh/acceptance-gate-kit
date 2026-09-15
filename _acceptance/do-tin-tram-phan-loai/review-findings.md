## Trong hợp đồng

- **Assertion âm-tính-một-mình: đối chứng dương của loop-health là chuỗi tĩnh, không chứng bộ đọc đã đọc run-log**
  file: `tests/workflows/triage-do-tin.test.mjs:373`
  severity: high
  source: measurement
  AC: AC-7
  Trong ma trận CHAY của chân bo-doc-bo-qua, ghim cho scripts/loop-health.mjs là `o => /\|\s*T2\s*\|\s*1\s*\|/.test(o) && /ghim lại/.test(o)`. «ghim lại» là tiêu đề cột cố định trong loop-health.mjs (dòng 184: `'| tier | hồ sơ | ... | ghim lại | fix S4 |'`) — có mặt trong MỌI đầu ra bất kể run-log; còn `| T2 | 1 |` là hai ô đầu (tier từ contract.md, số hồ sơ = 1) cũng không đến từ run-log. Cột thật sự đọc run-log là ô `repin` (dòng 106: đếm `"kind":"repin"`), ghim không chạm ô đó. Hệ quả: nếu loop-health không đọc được run-log (rd.read trả '' → repin=0) thì ghim vẫn true và hai bên ws/wsB vẫn «giống» → xanh. Chú thích dòng 367 hứa «mỗi bộ … thấy dòng run_id (đối chứng dương)» nhưng ghim này không phân biệt được «đọc thật» với «không đọc gì».

- **Assertion âm-tính-một-mình: đối chứng dương của acceptance-gold là tín hiệu VẮNG (noPanel) — đúng cả khi run-log không được đọc**
  file: `tests/workflows/triage-do-tin.test.mjs:372`
  severity: high
  source: measurement
  AC: AC-7
  Ghim cho scripts/acceptance-gold.mjs là `JSON.parse(o).noPanel.includes('demo')`. Trong acceptance-gold.mjs dòng 53–67, slug được đẩy vào `noPanel` khi `found === false`, và `found` chỉ thành true khi gặp dòng kind panel — tức run-log KHÔNG tồn tại, KHÔNG đọc được, hay bị lọc hết đều cho `noPanel.includes('demo') === true`. Đây là quan sát vắng-mặt được dùng làm đối chứng dương: bộ đọc bỏ hẳn bước đọc run-log thì ghim vẫn xanh và phép so ws/wsB vẫn giống. Không có tín hiệu «đã đọc dòng có run_id» nào cho bộ này, trái với điều chú thích dòng 367 hứa.

- **Assertion âm-tính-một-mình: carry-plan chỉ so bằng hai đầu ra, không có ghim đối chứng dương**
  file: `tests/workflows/triage-do-tin.test.mjs:370`
  severity: high
  source: measurement
  AC: AC-7
  Mục `'feature-loop/scripts/carry-plan.mjs': JSON.stringify(cp.plan(cpArgs(withRepin))) === JSON.stringify(cp.plan(cpArgs(khongTriage)))` là phép so «có triage = không triage» thuần âm tính: nếu plan() không đọc runLogText (hay đọc rồi bỏ toàn bộ dòng — ví dụ bộ lọc `l.evalId && !l.kind` ở carry-plan.mjs dòng 142 bị phá thành lọc-hết) thì hai vế bằng nhau trống rỗng và mục này vẫn true. Mọi mục khác trong CHAY đều đi qua `giong(rel, mk, ghim)` có vế ghim; riêng mục này không có vế nào chứng rằng plan đã thấy dòng E1 mang run_id/sha của chân dong-so (ví dụ carriedEvals chứa E1). Chú thích dòng 367 «mỗi bộ: bỏ qua dòng triage VÀ thấy dòng run_id (đối chứng dương)» không đúng với mục này.

- **Assertion âm-tính-một-mình: đối chứng dương của recheck-evidence chỉ là VẮNG chuỗi lỗi, không ghim tín hiệu đã đọc**
  file: `tests/workflows/triage-do-tin.test.mjs:374`
  severity: medium
  source: measurement
  AC: AC-7
  Ghim cho scripts/recheck-evidence.cjs là `o => !/REPIN x|L2 PROVENANCE|fails the evidence bar/.test(o)` — toàn bộ là phủ định. Khối đọc run-log của recheck (dòng 66–113) chỉ chạy khi `cited.length > 0`, tức khi regex `secRe` (dòng 59) khớp được heading `### Re-pin` trong evidence-report viết tay ở dòng 351; nếu heading/khuôn không khớp thì `cited` rỗng, khối run-log bị bỏ qua hoàn toàn, exit 0, không có chuỗi lỗi nào → ghim true, hai bên «giống» → xanh. Không có vế dương nào (ví dụ chứng rằng section Re-pin đã được bóc và run_id RID được tra trong run-log) để phân biệt «đọc run-log và thấy dòng repin» với «không bao giờ đi tới bước đọc».

- **Đo CHỈ DẪN thay vì ĐẦU RA: bộ đọc «không chạy» được chứng bằng grep nguồn, gồm một điều kiện VẮNG chuỗi**
  file: `tests/workflows/triage-do-tin.test.mjs:377`
  severity: low
  source: measurement
  AC: AC-7
  KHONG_CHAY chứng ba bộ đọc bằng regex trên văn bản nguồn thay vì chạy chúng trên run-log thật: `pre-merge-check.sh` được coi là bỏ qua dòng triage vì nguồn có `"kind":"repin"` VÀ KHÔNG có `"kind":"triage"` — vắng một chuỗi trong nguồn không chứng minh hành vi (một `tail -1 run-log.jsonl` thêm vào sau này không nhắc «triage» vẫn qua, còn thêm xử lý triage ĐÚNG lại làm mục này đỏ). `s4-args.mjs` đọc run-log trực tiếp (dòng 410–413 `runLogLines`) và lọc `l.kind === 'baseline'` / `l.kind === 'panel'` — đây là bộ đọc chạy được bằng mã (import hoặc execFileSync như các mục CHAY) nhưng chỉ được grep. Chân tự khai giới hạn («lý do máy kiểm được trên nguồn») nhưng vẫn in PASS «ma tran bo doc TOAN PHAN … moi bo bo qua dong kind triage» gộp cả ba bộ chưa từng chạy.

- **Assert đếm trong khi lời hứa là QUAN HỆ: «refute chỉ trong hợp đồng» không phân biệt được với «refute toàn bộ»**
  file: `tests/workflows/triage-do-tin.test.mjs:188`
  severity: low
  source: measurement
  AC: AC-4
  Chân hoi-lai ghim `refuteCalls(that.calls).length === 3` và dòng PASS tuyên «bac bo chi chay tren phat hien trong hop dong». Nhưng phản hồi `du(sent)` cho cả ba finding `inContract: true` (row() mặc định, dòng 50), nên «chỉ trong hợp đồng» = 3 = «toàn bộ» — chân van-thieu (dòng 219) và hoi-lai-chet (dòng 233) cũng ghim cùng số 3 cho đường refute-TOÀN-BỘ. Cùng một con số cho hai hành vi trái ngược: phép đo không thể đỏ nếu refute chạy lên finding ngoài hợp đồng. Muốn đo quan hệ cần ít nhất một finding inContract=false trong tập và ghim tập refute là tập con đúng.

- **Assert «chuỗi có mặt» trong khi lời hứa là quan hệ: «không ghép đè t1» chỉ đo dòng log**
  file: `tests/workflows/triage-do-tin.test.mjs:254`
  severity: low
  source: measurement
  AC: AC-9
  Chú thích dòng 249 hứa «xử như mã lạ, không ghép đè t1, t3 vẫn thiếu», nhưng `ntOk = nt.result.triageFailed === true && nt.logs.some(l => /ma la t1/i.test(l))` chỉ đo chuỗi log và cờ thất bại; không có assert nào trên `nt.result.triaged` chứng rằng t1 (a.js) vẫn giữ phân loại lượt 1 (inContract:true, acRef AC-1) thay vì nhận dòng lượt 2 (inContract:false, known-limits). Phép đo cho vế «không ghép đè» vì thế không tồn tại — phá vế ấy (dòng lượt 2 ghi đè byFinding của t1) mà vẫn in log «ma la t1» thì ca vẫn xanh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **triagePromptFor dùng String.replace với chuỗi thay thế chưa thoát `$` — tải Findings bị biến dạng lặng lẽ ngay lượt 1 khi detail/title chứa `$&`, `$'`, `` $` ``, `$$`**
  Người dùng thấy gì: Nếu nội dung một phát hiện lỗi chứa một số ký tự đặc biệt, gói thông tin gửi cho bước phân loại có thể bị xáo trộn ngay từ đầu mà không có cảnh báo, khiến việc phân loại tự động cho ra kết quả sai hoặc thiếu.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **Fixture của chân bộ-đọc nằm ở đường tmp CỐ ĐỊNH dùng chung (os.tmpdir()/do-tin-tram-ca) trong khi config.yaml đấu 14 executor + E11 chạy song song ở S4 — race ghi/đọc cùng tệp, vi phạm luật «fixture do code sinh trong chính lần chạy»**
  Người dùng thấy gì: Khi nhiều việc kiểm tra chạy cùng lúc, chúng có thể vô tình đọc nhầm dữ liệu tạm của nhau, khiến kết quả kiểm tra báo đạt hoặc không đạt không phản ánh đúng thực tế.
  file: `tests/workflows/triage-do-tin.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lời nhắc triage bị biến dạng khi finding chứa `$'`, `` $` ``, `$&` hoặc `$$` — String.replace diễn giải mẫu `$` trong chuỗi thay thế**
  Người dùng thấy gì: Ngay ở lần phân loại đầu tiên, nếu một phát hiện lỗi chứa một số ký tự đặc biệt, dữ liệu gửi đi có thể bị hỏng âm thầm, khiến phân loại tự động sai lệch mà không ai nhận ra.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
