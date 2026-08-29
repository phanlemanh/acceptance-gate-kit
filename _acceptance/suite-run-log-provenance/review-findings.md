## Trong hợp đồng

- **AC-2 «mã không theo thứ tự khai» không có phép đo nào — nhưng E5 khai là có, kèm chiều đỏ**
  file: `_acceptance/suite-run-log-provenance/evals.yaml:52`
  severity: high
  AC: AC-2
  AC-2 (contract.md:39) đòi: «cùng một danh sách lệnh suite khai theo HAI thứ tự khác nhau → mã của mỗi lệnh giống hệt nhau ở cả hai lượt». E5 là eval DUY NHẤT phủ AC-2, và `expected` của nó mở đầu bằng chân (1): «THỨ TỰ: … tập (cmd → run_id) BẰNG NHAU, ghim 'PASS: doi thu tu -> ma khong doi'; chiều đỏ cùng fixture: bản tiêm đúc mã theo chỉ số mảng ('SUITE-0/1/2') → phép so ĐỎ ghim 'DO: ma doi theo thu tu'».

  Không có gì trong cây thực hiện chân đó: chân `thu-tu` của rang.sh (rang.sh:118-131) chỉ ghim W29 (round) + W30 (tên), không hoán vị thứ tự và KHÔNG dựng bản tiêm nào; grep W28–W33 trong tests/workflows/acceptance-verify.test.mjs cho thấy không ca nào chạy cùng bộ `suiteCommands` theo hai thứ tự. Cả hai chuỗi ghim mà `expected` hứa ('doi thu tu -> ma khong doi', 'ma doi theo thu tu') không tồn tại trong repo.

  Đây đúng lớp «thước không gắn vào vật» / «đo chỉ dẫn thay vì đầu ra»: eval-coverage-lint vẫn xanh (AC-2 có eval trỏ tới), người ở Cổng 2 đọc `expected` sẽ tin lời hứa bất-biến-thứ-tự đã được chứng — trong khi nó chưa bao giờ chạy. Lời hứa này cũng được nêu thành cam kết trong chính comment engine (acceptance-verify.js:574-575, 588-589), nên nó là mệnh đề sống, không phải văn trang trí. Sửa: thêm ca hoán vị `suiteCommands` + chiều đỏ đúc-mã-theo-chỉ-số, hoặc thu `expected`/AC-2 về đúng thứ đã dựng.

- **run_id do verifier khai bỏ qua hoàn toàn lưới chống va chạm của lệnh suite**
  file: `feature-loop/workflows/acceptance-verify.js:609`
  severity: medium
  AC: AC-3
  Dòng 609: `const rid = (m.runId && String(m.runId).trim()) || `minted-${args.slug}-SUITE-${ten}-r${args.round}``. Toàn bộ máy chống va chạm vừa dựng (`tenSuite` → `demTenSuite` → `tenDuyNhat` → `bamSuite`) CHỈ chạy ở nhánh đúc mã. Khi agent verifier trả `runId` khác rỗng — đúng thứ prompt máy dặn nó làm: «run_id neu stdout co in» — giá trị đó được dùng nguyên văn và lưới không bao giờ chạy.

  Đã chạy thật qua harness (fixture: 2 lệnh suite `cd apps/web && pnpm build` / `cd apps/api && pnpm build`, agent cùng khai `runId: 'harness-42'`):

      {"evalId":"SUITE-build__afbae1","run_id":"harness-42","exit_code":0,"cmd":"cd apps/web && pnpm build"}
      {"evalId":"SUITE-build__2db2d5","run_id":"harness-42","exit_code":1,"cmd":"cd apps/api && pnpm build"}

  `evalId` phân biệt được, nhưng `run_id` — trường DUY NHẤT mà `loadRunLogIds` + `extractRunIds` trong `lib/evidence-core.cjs` đọc — thì trùng. AC-3 khai «hai dòng sổ mang HAI mã khác nhau và mỗi mã trỏ về đúng `cmd` của nó»; ở nhánh này lời hứa đó không giữ. Đây đúng hình dạng false-green mà chính khối chú thích ở dòng 578-586 nói nó sinh ra để vá («một lệnh ĐỎ có thể nấp sau một lệnh XANH»).

  Lưới không bắt được: mọi fixture W28/W29/W30/W31 trong tests/workflows/acceptance-verify.test.mjs đều trả `runId: ''` (responder mặc định dòng 40), nên chỉ nhánh đúc mã từng được đo. Thêm một ô ma trận «agent khai runId trùng cho hai lệnh suite» là đủ để lộ.

- **Chân «thu-tu» không đo gì về thứ tự — mệnh đề đầu của AC-2 không có phép đo nào**
  file: `_acceptance/suite-run-log-provenance/rang.sh:118`
  severity: medium
  AC: AC-2
  AC-2 trong contract.md khai: «Given cùng một danh sách lệnh suite khai theo hai thứ tự khác nhau, When chạy hai vòng cùng số round, Then mã của mỗi lệnh giống hệt nhau ở cả hai lượt». E5 (evals.yaml dòng 52-56) khai chân này ghim NGUYÊN VĂN dòng `PASS: doi thu tu -> ma khong doi` và có chiều đỏ `DO: ma doi theo thu tu`.

  Cả hai chuỗi đó không tồn tại ở đâu trong kho — `grep -n 'doi thu tu\|thu tu' _acceptance/suite-run-log-provenance/rang.sh tests/workflows/acceptance-verify.test.mjs` trả rỗng (exit 1). Chân `thu-tu` (rang.sh dòng 118-128) chỉ grep sáu dòng PASS của W29 (vòng) và W30 (tên); không có lượt chạy nào đảo thứ tự.

  Kiểm độc lập trên lưới thường trực: không một ca nào trong tests/workflows/acceptance-verify.test.mjs chạy cùng một danh sách `suiteCommands` theo hai thứ tự (mọi lượt truyền `suiteCommands` đều là danh sách một chiều — dòng 1691, 1700, 1730, 1756).

  Hệ quả: E5 XANH mà mệnh đề nó tuyên chưa từng được chạy. Hành vi hiện tại tình cờ đúng (tên + băm đều suy từ chuỗi lệnh), nên đây không phải lỗi hành vi — nhưng nó là ô trống trong ma trận mà hợp đồng khai là đã đóng, và người ký ở Cổng 2 đọc E5 sẽ tin ngược lại. Hoặc thêm ô đo thật (chạy `[a,b]` rồi `[b,a]`, so tập cmd→run_id), hoặc sửa E5 để thôi khai một dòng ghim không tồn tại.

- **Bộ đếm va chạm dùng object trần — khoá kế thừa prototype làm lưới tắt im lặng**
  file: `feature-loop/workflows/acceptance-verify.js:600`
  severity: low
  AC: AC-3
  `const demTenSuite = {}` (dòng 596) rồi `demTenSuite[t] = (demTenSuite[t] || 0) + 1` (dòng 600), đọc lại bằng `demTenSuite[t] > 1` (dòng 604). Với `t` là khoá kế thừa từ `Object.prototype` — `constructor`, `toString`, `valueOf`, `hasOwnProperty`, `toLocaleString` — lượt đọc đầu trả về HÀM chứ không phải undefined, nên `(fn || 0) + 1` cho một CHUỖI, và phép so `> 1` là false mãi mãi.

  Kiểm bằng node: `dem['constructor']` sau hai lượt tăng = "function Object() { [native code] }11", và `dem['constructor'] > 1` → false. Nghĩa là hai lệnh suite thật sự trùng tên `constructor`/`toString` sẽ KHÔNG được gắn hậu tố băm và dùng chung một mã — đúng lớp false-green khối này sinh ra để vá, mà lại tắt không báo gì.

  Khả năng chạm thấp (cần script gói tên đúng bằng một khoá prototype; `__proto__` không tới được vì bộ vệ sinh cắt gạch dưới đầu/cuối). Nhưng CHÍNH file này đã dựng lưới cho đúng lớp đó ở dòng 310-317 — `Object.prototype.hasOwnProperty.call(EVAL_REQUIRED, e.executor)` kèm chú thích nêu đích danh `constructor`/`__proto__`/`toString` — nên nếp của file là dùng `Map` hoặc `Object.create(null)`, và khối mới trôi khỏi nếp đó. `suiteRunIds` (dòng 565) cùng hình dạng.

- **Hình dạng 2 — fixture VIẾT TAY đúng khuôn bên đọc (W33 «dây khép» chỉ chạy nửa bên ĐỌC)**
  file: `tests/workflows/acceptance-verify.test.mjs:1779`
  severity: high
  AC: AC-5
  `khoiEval` (dòng 1779) và `banCham` (1780–1783) dựng bản chấm bằng chuỗi viết tay `- eval: ${id}\n  run_id: ${runId}\n  exit_code: 0\n…` — đúng khuôn mà `extractRunIds` trong lib/evidence-core.cjs bắt (regex `^\s*(?:-\s+)?run_id\s*[:=]`). Comment ngay trên (dòng 1765–1767) khai ngược lại: «khong dung fixture viet tay dung khuon ben DOC, vi do la kieu do tu chung minh chinh no». Chỉ nửa SỔ là code-sinh (lấy từ `result.runLog`); nửa BẢN CHẤM — thứ mà bên VIẾT thật sự là agent `synthesize:report` — hoàn toàn do test bịa ra.

  Điều này đắt vì bên viết KHÔNG có khuôn: `skills/acceptance/references/evidence-report-template.md` không hề có mục nào cho lệnh suite (grep chỉ ra đúng một dòng nhắc 'Suite commands green-on-both'), còn prompt ở acceptance-verify.js:938 lại trỏ tới «muc «Lenh suite regression-guard»» — một mục không tồn tại trong bản mẫu; hồ sơ thật (_acceptance/ngon-ngu-mat-nguoi/evidence-report.md:200) ghi lệnh suite dưới heading tự chế `### Lệnh hồi quy khác`. Nếu máy soạn ghi mã suite ở dạng bảng, dạng văn xuôi, hay bất kỳ dạng nào không phải khối `- eval:` thụt lề, `extractRunIds` không rút được — lỗi gốc (bản chấm không khớp sổ) quay lại nguyên vẹn mà W33 vẫn xanh, vì nó chỉ đo lại chính cái khuôn nó tự viết.

  Kho ĐÃ có cơ chế đúng và không dùng: `tests/plugins/ra-co-ten.test.mjs:105` gọi `blockFromTemplate(EVID_TPL, 'JUDGMENT-BLOCK-TEMPLATE')` để rút khuôn khối từ chính bản mẫu (mẫu marker + round-trip mà CLAUDE.md gọi là `OOC-ITEM-TEMPLATE` + P55). Ở đây không có marker nào cho khối suite nên seam LLM-viết→máy-đọc không được ghim một chỗ, và test tự do trôi khỏi bên viết.

- **Hình dạng 5 — tuyên quét LỚP nhưng ô «đổi thứ tự khai» KHÔNG có assert nào (chân `thu-tu` xanh mà không đo thứ tự)**
  file: `_acceptance/suite-run-log-provenance/rang.sh:118`
  severity: high
  AC: AC-2
  AC-2 hứa rành mạch «cùng một danh sách lệnh suite khai theo hai thứ tự khác nhau … mã của mỗi lệnh giống hệt nhau ở cả hai lượt», và evals.yaml:52 (E5, chân 1) khai luôn thông điệp ghim: 'PASS: doi thu tu -> ma khong doi' và chiều đỏ 'DO: ma doi theo thu tu'. Cả hai chuỗi đó KHÔNG tồn tại ở bất kỳ file nào (`grep -n 'thu tu'` trong rang.sh và trong acceptance-verify.test.mjs đều rỗng), và không có ca nào trong test đảo thứ tự phần tử `suiteCommands`. Chân `thu-tu` (rang.sh:118–128) — chân mang đúng tên ô này — chỉ grep bảy dòng PASS của W29/W30 từ lần chạy cây nguyên vẹn, rồi exit 0. Đã chạy: `bash rang.sh --chan thu-tu` → 'Results: chan thu-tu passed' với 0 phép đo về thứ tự.

  Lỗ này chui lọt được thật, không phải giả định: nếu `tenDuyNhat` (acceptance-verify.js:594–597) đổi hậu tố chống va chạm từ `bamSuite(cmd)` sang chỉ số mảng — `demTenSuite[t] > 1 ? `${t}__${idx}` : t` — thì W28 vẫn xanh (hai lệnh va chạm nhận idx 0 và 1, `idA !== idB` vẫn đúng), W30 vẫn xanh (mỗi ca chỉ khai MỘT lệnh nên không bao giờ va chạm, tên giữ nguyên), W29/W32/W03 không đụng tới. Toàn bộ lưới xanh trong khi đúng điều AC-2 cấm — mã đúc theo chỉ số mảng — đã xảy ra.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Ba chân hứa chiều đỏ bằng bản tiêm mà rang.sh không dựng — quét lớp dừng giữa chừng sau 46f828e3**
  Người dùng thấy gì: Một số tình huống của lệnh kiểm tra hồi quy — kết quả riêng từng lệnh, thứ tự khai báo, không ghi đè kết quả — hiện chỉ được xác nhận bằng cách chạy lại bản đúng, chứ chưa có phép thử chủ động chèn lỗi để chứng minh hệ thống thực sự bắt được sai sót.
  file: `_acceptance/suite-run-log-provenance/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Định danh tiếng Việt lạc khỏi khuôn của chính file engine**
  Người dùng thấy gì: Một vài tên biến nội bộ trong mã nguồn dùng tiếng Việt thay vì tiếng Anh như phần còn lại của file — không ảnh hưởng gì tới kết quả kiểm tra, chỉ là thiếu nhất quán khi đọc mã.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **args.suiteCommands không có kiểm phần tử ở biên, trong khi giá trị của nó nay thành DANH TÍNH của dòng sổ kiểm toán**
  Người dùng thấy gì: Nếu cấu hình lệnh kiểm tra hồi quy bị khai thiếu hoặc sai, hệ thống vẫn tạo ra một dòng nhật ký trông hợp lệ thay vì báo lỗi ngay, có thể khiến người xem nhầm tưởng lệnh đã chạy đúng.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — ba chân răng chỉ có chiều DƯƠNG: chiều đỏ đã khai trong `expected` không được cài**
  Người dùng thấy gì: Ba tình huống của lệnh kiểm tra hồi quy — kết quả riêng, thứ tự khai báo, không ghi đè kết quả cũ — hiện chỉ được xác nhận bằng cách chạy lại bản đúng, chưa có phép thử chủ động chèn lỗi để chứng minh hệ thống thực sự phát hiện được sai sót.
  file: `_acceptance/suite-run-log-provenance/rang.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/suite-run-log-provenance/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
