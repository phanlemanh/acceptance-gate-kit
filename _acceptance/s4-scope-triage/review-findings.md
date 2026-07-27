# Review Findings: s4-scope-triage (round 2)

Informational — outside the hook-enforced evidence-report schema. Chia theo
kết quả SCOPE-TRIAGE (in-contract / out-of-contract), không phải theo
reviewer lane.

## Trong hợp đồng

- **`f.file` do reviewer agent sinh không được chuẩn hoá/kiểm ở biên trước khi so glob — đường dẫn tuyệt đối làm cờ cụm-ngoài-vùng-phủ bịa ra ở MỌI round**
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/feature-loop/workflows/acceptance-verify.js:554`
  severity: high
  source: conventions
  AC: AC-7
  detail: `coverageRes` (dòng 554) build regex neo `^...$` từ glob
  repo-relative trong evals.yaml, rồi `outsideCoverage` (dòng 560) test thẳng
  `f.file` — giá trị do agent reviewer trả về tự do.

  FINDINGS_SCHEMA (dòng 96-114) khai `file: { type: 'string' }` KHÔNG
  description, và cả hai prompt reviewer (dòng 315-317) đều mở đầu bằng
  "trong repo ${args.repoRoot}" với repoRoot là đường dẫn TUYỆT ĐỐI, không
  một chữ nào yêu cầu trả path repo-relative. Một reviewer trả
  `/Users/.../acceptance-gate-kit/src/x.ts` là hoàn toàn hợp lệ theo schema,
  và khi đó mọi finding đều rớt khỏi mọi glob →
  `outsideCoverage.length === triagedDistinct.length` → `coverageCluster`
  bật ở mọi round có ≥2 finding.

  Hệ quả trực tiếp lên cổng người: gate-card.js:361 in cờ đỏ "⚠ Nhiều lỗi
  rơi ngoài vùng các bộ đo đang phủ — dừng và quyết: mở rộng hợp đồng hay rút
  phạm vi", và synthesize được lệnh ghi dòng cờ "⚠ Cụm ngoài vùng phủ: N/M
  lỗi rơi vào file không bộ đo nào phủ" vào review-findings.md. Người duyệt
  bị đẩy vào quyết định mở-rộng-hay-rút-phạm-vi trên một phép đo sai hoàn
  toàn, không có gì trên thẻ để nghi ngờ.

  Round 1 đã nêu đúng phơi nhiễm này (review-findings.md:191-197, "Related
  exposure ... A reviewer that returns /repo/src/x.ts puts every finding
  outside coverage and flags the cluster on every round") nhưng round 2 chỉ
  vá nửa `**` zero-segment; nửa boundary-validation không được chạm. Sửa:
  thêm description "repo-relative path" vào FINDINGS_SCHEMA.file + nhắc
  trong prompt reviewer, VÀ chuẩn hoá phòng thủ trước khi so (strip prefix
  `args.repoRoot`, bỏ `./` dẫn đầu) — chuẩn hoá một mình là đủ và không phụ
  thuộc agent nghe lời.
  rationale: AC-7 định nghĩa coverageCluster phải chỉ bật khi finding THẬT SỰ
  ngoài vùng phủ glob; vì schema/prompt cho phép reviewer trả path tuyệt đối
  nên phép so glob luôn trượt, khiến cờ bật sai ở mọi round ≥2 finding — cơ
  chế AC-7 mô tả không còn đúng như đặc tả.

- **Gate-2 card prints the reviewer's verbatim engineering title — E11's judged fixture is not what renders**
  file: `scripts/gate-card.js:344`
  severity: high
  source: bugs
  AC: AC-11
  detail: Khối "Ngoài hợp đồng" render `esc(f.title)` — title tự do do agent
  reviewer (`bugs`/`conventions`) sinh ra, chép nguyên văn vào
  review-findings.md và được `lib/out-of-contract.js` parse lại. Render thử
  card bằng đúng `_acceptance/s4-scope-triage/review-findings.md` của round
  trước cho ra, làm text-quyết-định-của-người:

    <p class="q">`globToRe` leaves `?` unescaped — an eval `paths` glob with
    a leading `?` throws an uncaught SyntaxError and destroys the whole S4
    round</p>
    <p class="q">Mutation controls in P51–P54 are tautological — they pass
    even when the source file does not exist</p>

  Fixture mà E11/AC-11 chấm
  (`_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md`)
  không chứa gì như thế — đó là ngôn ngữ sản phẩm dịch tay
  ("Bấm 'Cập nhật' có thể làm mất tiện ích đang cài."). Nên artifact mà judge
  panel chấm và artifact mà script thực sự xuất ra là hai tài liệu khác
  nhau, và PASS của E11 là bằng chứng về một file không code path nào sinh
  ra.

  Không còn seam dịch nào: `commands/acceptance-card.md:46-56` và Codex
  `acceptance-card/SKILL.md` đều chỉ dẫn model KHÔNG thêm overlay key cho
  khối này, nên title thô là văn bản duy nhất có thể tới được card. P52
  (`tests/plugins/run-tests.sh:947-950`) chỉ khoá field `file:` đã parse
  (`grep -q 'src/install.ts'`) — thứ renderer không bao giờ in ra — trong khi
  đường dẫn file, tên symbol và jargon regex/`?` thường xuyên nằm trong
  title và lọt qua.

  Cùng dòng ở mirror: `plugins/acceptance-gate/scripts/gate-card.js:344`.
  rationale: AC-11 đòi khối "Ngoài hợp đồng" phải đọc được bằng ngôn ngữ sản
  phẩm, không jargon, cho người quyết kinh doanh; finding chứng minh bằng ví
  dụ thật là renderer in nguyên văn title kỹ thuật (regex, tên hàm) — trực
  tiếp phá vỡ tiêu chí đó trên card thật.

- **Partial triage failure silently suppresses the whole out-of-contract block on the card**
  file: `scripts/gate-card.js:335`
  severity: medium
  source: bugs
  AC: AC-11
  detail: |
    `if (ooc.unclassified) { …amber flag… } else if (ooc.findings.length)
    { …block… }` coi "có bất kỳ finding unclassified nào" là "triage không
    chạy". Nhưng unclassified một phần là trạng thái được hỗ trợ tường minh:
    `feature-loop/workflows/acceptance-verify.js:520` ghi chú "Finding gửi đi
    mà agent KHÔNG trả về → unclassified", và `triaged` gán
    `unclassified: !ok` theo từng finding, nên agent trả về 3/5 mục sẽ cho ra
    3 classified + 2 unclassified. Prompt synthesize sau đó viết CẢ HAI
    `## Ngoài hợp đồng` (có item out-of-contract thật) lẫn
    `## Chưa phân loại (triage-failed)`.

    Tái hiện bằng fixture chứa cả ba section: `--extract` →
    `out_of_contract.findings = [{title:'Out of contract A',
    proposal:'known-limits'}]`, `unclassified:true` → render HTML chỉ còn
    'Phân loại phạm vi hỏng'; heading 'Ngoài hợp đồng — bạn quyết', finding và
    3 nút quyết định biến mất.

    Hai hệ quả: lựa chọn 3 nhánh theo từng finding (deliverable chính của
    feature) biến mất khỏi mặt mà người ký tên, và dòng cờ khẳng định "Bước
    phân loại phạm vi không chạy được" trong khi triage thực ra đã chạy và
    phân loại được các finding đó. Render cả hai section (cờ VÀ khối) mới đúng
    hành vi fail-toward-human mà comment của module tự nhận.

    Cùng dòng ở mirror: `plugins/acceptance-gate/scripts/gate-card.js:335`.
  rationale: Khi có finding unclassified xen lẫn out-of-contract, card ẩn
  toàn bộ khối quyết-định-của-người dù review-findings.md có đủ dữ liệu —
  người đọc card không còn cơ hội hiểu/hành động như AC-11 đòi hỏi, dù dữ
  liệu vẫn tồn tại trong file (AC-2 vẫn đúng ở tầng file).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **E8 (AC-8) mô tả một phép kiểm P52 không còn thực hiện — nửa codex của AC-8 hoàn toàn không có ai đo, và gate-card.js/out-of-contract.js nằm ngoài mọi `paths`**
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/_acceptance/s4-scope-triage/evals.yaml:46`
  severity: high
  source: conventions
  Đề xuất: known-limits
  detail: |
    evals.yaml chưa được đụng từ commit Gate 1 (3f168b7), trong khi
    P52 đã bị viết lại hoàn toàn ở round 2.

    E8.expected vẫn ghi: "case P52: cả commands/acceptance-card.md lẫn codex
    acceptance-card SKILL.md chứa nhánh backward tường minh (chuỗi chỉ dẫn
    'không có section' → render như cũ)". P52 hiện tại
    (tests/plugins/run-tests.sh:~843-910) KHÔNG grep một chuỗi nào trong hai
    file đó — nó dựng workspace tạm rồi chạy
    `node scripts/gate-card.js --root ... --slug demo` và đo ĐẦU RA render.
    Hệ quả cụ thể: xoá sạch đoạn nhánh-backward vừa thêm vào
    codex/acceptance-gate/skills/acceptance-card/SKILL.md thì không case nào
    đỏ, nhưng evidence-report.md sẽ chép nguyên văn `expected` của E8 và tuyên
    bố đúng phép kiểm đó đã chạy. Đây là false-green đúng hình dạng mà chính
    round 1 đã bắt được ở bản P52 cũ.

    Song song, E8.paths = [commands/acceptance-card.md,
    codex/acceptance-gate/skills/acceptance-card/SKILL.md, tests/plugins/**]
    không chứa hai file mà P52 thực sự vận hành: scripts/gate-card.js và
    lib/out-of-contract.js. Không eval nào trong evals.yaml khai hai file này.
    Theo luật carry-forward P1 (feature-loop/skills/feature-loop/SKILL.md:128
    — deltaFiles không khớp glob nào của `paths` + round trước exit_code 0 →
    carry), một round sau chỉ sửa gate-card.js hoặc out-of-contract.js sẽ
    carry E8 sang PASS mà không chạy lại, kể cả khi khối "Ngoài hợp đồng" đã
    hỏng hẳn.

    Cùng lớp, nhẹ hơn: E12 (dòng 69, paths dòng 74) chạy P53 vốn đọc
    _acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md,
    nhưng fixture đó không nằm trong `paths` — sửa fixture bỏ một nhãn cũng
    carry qua.

    Sửa theo LỚP: rà mọi eval trong file, đối chiếu `paths` với tập file mà
    case tương ứng thật sự đọc/chạy, và cập nhật `expected` của E8 cho khớp
    implementation round 2 (hoặc thêm lại phép kiểm chuỗi trên bản codex nếu
    AC-8 vẫn muốn ràng buộc cả hai harness).
  rationale: Đây là lỗ hổng chất lượng của eval (expected text lỗi thời,
  paths thiếu file P52 thực chạy) chứ không phải bằng chứng AC-8 tự nó sai —
  không AC nào ràng buộc 'paths phải khớp file eval thực chạy' hay 'expected
  phải khớp implementation hiện tại'.

- **Triage trả về THIẾU mục cho một finding → `triageFailed` vẫn false nhưng thẻ Cổng 2 nuốt trọn khối "Ngoài hợp đồng"**
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/feature-loop/workflows/acceptance-verify.js:523`
  severity: medium
  source: conventions
  Đề xuất: known-limits
  detail: |
    `triaged` (dòng 523-534) đặt `unclassified: !ok` với
    `ok = !triageFailed && !!t`. Khoá ghép là `${file} :: ${title}` chép
    nguyên văn bởi LLM, nên agent bỏ sót một finding — hoặc chép lệch một ký
    tự trong file/title — cho ra `unclassified: true` trong khi `triageFailed`
    vẫn là `false`. Nhánh này không được AC-4 phủ (AC-4 chỉ nói agent chết cả
    retry / contract không đọc được).

    Hai hệ quả hợp lại thành mất thông tin âm thầm ở đúng chỗ feature này sinh
    ra để bảo vệ:

    1. Workflow trả `triageFailed: false`, nên cả hai chỉ dẫn harness đều im:
    feature-loop/skills/feature-loop/SKILL.md:135 chỉ báo user khi
    `triageFailed: true`, codex SKILL.md tương tự.

    2. Prompt synthesize (dòng 685) bật section
    "## Chưa phân loại (triage-failed)" chỉ cần
    `triaged.some(f => f.unclassified)`. gate-card.js:337-339 thấy heading đó
    là vào nhánh `if (ooc.unclassified)` và thay TOÀN BỘ khối bằng một cờ
    vàng — các finding đã được phân loại out-of-contract (kèm proposal) biến
    mất khỏi khối quyết-định-của-người, dù chúng vẫn nằm trong file.

    Đồng thời `rejectFindings` vẫn chứa các finding in-contract mà agent có
    trả về, nên máy vẫn tự quay S3 sửa dựa trên một kết quả phân loại KHÔNG
    đầy đủ — lệch với doctrine fail-toward-human mà chính khối này khai. Đề
    nghị: partial-return kéo `triageFailed = true` (nhất quán với "không chắc
    chắn → không REJECT"), hoặc tách tín hiệu `triagePartial` và để gate-card
    render cờ vàng CỘNG khối out-of-contract thay vì thay thế.
  rationale: Finding tự nhận nhánh partial-return không được AC-4 phủ (AC-4
  chỉ nói agent chết cả retry hoặc contract không đọc được) — đây là khoảng
  trống ngoài đặc tả hiện có, không phải AC-4 thất bại.

- **Ba nhãn lựa chọn được khai là "giữ NGUYÊN VĂN" nhưng renderer in khác chỉ dẫn, và không phép kiểm nào khoá renderer vào chỉ dẫn**
  file: `/Users/manh-macmini/dev/acceptance-gate-kit/scripts/gate-card.js:344`
  severity: low
  source: conventions
  Đề xuất: known-limits
  detail: |
    commands/acceptance-card.md:50 (và bản codex tương ứng) khai ba
    nhãn phải giữ NGUYÊN VĂN: "ghi Known limits" / "mở hợp đồng mới" /
    "nâng phạm vi sửa ngay". gate-card.js:344 in ra "Ghi Known limits" /
    "Mở hợp đồng mới" / "Nâng phạm vi, sửa ngay" — nhãn thứ ba có thêm dấu
    phẩy, tức khác chỉ dẫn ở mức ký tự chứ không chỉ hoa/thường.

    Quan trọng hơn cái sai chính tả là chỗ trống trong lưới bảo vệ: P53
    (tests/plugins/run-tests.sh:~912-960) rút ba nhãn TỪ
    commands/acceptance-card.md rồi bắt
    _acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md phải
    chứa đủ — nó khoá FIXTURE vào chỉ dẫn. Không case nào khoá RENDERER vào
    chỉ dẫn, mà renderer mới là thứ người duyệt thật sự nhìn. P52 có grep
    chuỗi 'Nâng phạm vi, sửa ngay' nhưng hardcode ngay trong test, nên chỉ tự
    khớp với chính nó — đúng anti-pattern mà comment của P53 cảnh báo.

    Hệ quả: chỉ dẫn card đổi nhãn → fixture đỏ (P53 bắt), judge E11 chấm
    đúng, nhưng thẻ production vẫn in nhãn cũ và không ai biết. Sửa: cho P52
    rút nhãn từ commands/acceptance-card.md giống cách P53 làm, rồi so với
    đầu ra render.
  rationale: Sai lệch chỉ là một dấu phẩy, không AC nào đòi nhãn khớp
  nguyên văn ký tự; AC-11 chỉ yêu cầu người đọc phân biệt được 3 lựa chọn
  bằng ngôn ngữ sản phẩm, và tiêu chí đó vẫn đạt dù có dấu phẩy lệch.

- **E8/E12 `paths` omit the renderer they now test — P1 carry-forward can keep AC-8/AC-11 green after gate-card.js changes**
  file: `_acceptance/s4-scope-triage/evals.yaml:51`
  severity: medium
  source: bugs
  Đề xuất: known-limits
  detail: |
    Round 2 rewrote P52 từ "grep hai file chỉ dẫn" thành "chạy
    `node $ROOT/scripts/gate-card.js` và assert đầu ra render"
    (`tests/plugins/run-tests.sh:875-960`). Hành vi của nó giờ phụ thuộc
    `scripts/gate-card.js` và `lib/out-of-contract.js`. `paths` của E8 chưa
    được cập nhật, vẫn đọc
    `[commands/acceptance-card.md,
    codex/acceptance-gate/skills/acceptance-card/SKILL.md, tests/plugins/**]`.

    P1 carry-forward (`feature-loop/skills/feature-loop/SKILL.md:128`) carry
    một eval sang PASS khi `deltaFiles` không khớp glob nào trong `paths` và
    dòng run-log trước đó có `exit_code: 0`. Nên một round sau chỉ sửa
    `scripts/gate-card.js` hoặc `lib/out-of-contract.js` — chính xác đoạn code
    AC-8 ("card render khối") và AC-11 ("người có thể hành động trên nó") nói
    tới — sẽ carry E8 sang mà không chạy lại P52, và Gate 2 vẫn thấy evidence
    xanh cho một khối có thể không còn render nữa. Đây là đúng lớp
    stale-evidence mà guard P1 sinh ra để chặn, nhưng bị đảo ngược.

    E12 (dòng 74) cùng hình dạng: `paths: [commands/acceptance-card.md,
    tests/plugins/**]`, trong khi P53 đọc
    `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md` —
    chỉ sửa fixture cũng để E12 carry được.

    Trôi dạt phụ trên cùng entry: `expected:` của E8 vẫn mô tả phép kiểm
    grep-chỉ-dẫn của round 1 ("chứa nhánh backward tường minh (chuỗi chỉ
    dẫn …)"), không phải phép kiểm render-đầu-ra mà P52 hiện làm.
  rationale: Đây là rủi ro về ĐỘ TIN CẬY của bằng chứng cho AC-8/AC-11 trong
  các round sau (carry-forward có thể bỏ qua re-run), không phải bằng chứng
  AC-8/AC-11 đang thất bại NGAY round này — không AC nào ràng buộc cấu hình
  paths của eval.

## Chưa adversarial-verify (refuter chết)

(không có)

---

⚠ Cụm ngoài vùng phủ: 5/7 lỗi rơi vào file không bộ đo nào phủ (/Users/manh-macmini/dev/acceptance-gate-kit/_acceptance/s4-scope-triage/evals.yaml, /Users/manh-macmini/dev/acceptance-gate-kit/feature-loop/workflows/acceptance-verify.js, /Users/manh-macmini/dev/acceptance-gate-kit/scripts/gate-card.js, _acceptance/s4-scope-triage/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
