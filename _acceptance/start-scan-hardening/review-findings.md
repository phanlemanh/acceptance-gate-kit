# Review Findings: start-scan-hardening (round 4)

## Trong hợp đồng

### Guard I/O evidence-report.md quyết định ô của slug ở CẢ status không đọc file đó — đúng lớp lỗi vừa vá cho opportunity.md 5 dòng trên, chưa quét lớp
- file: `scripts/start-scan.mjs:117`
- severity: high
- AC: AC-1
- source: conventions

Commit f9bd06b sửa đúng lớp lỗi này cho `opportunity.md` (dời việc đọc xuống nhánh không-có-contract, kèm comment "Lỗi của file KHÔNG dùng tới thì không được quyết định ô của slug"), nhưng để nguyên hình dạng y hệt cho `evidence-report.md`: dòng 116-117 đọc + bail TRƯỚC khi dispatch theo status, trong khi các status `draft` / `approved` không bao giờ dùng tới file đó.

Đã chạy thật (fixture code sinh, root=cây tạm):
  contract status=draft + evidence-report.md nguyên vẹn
    → gates:[{slug:"draft-slug",gate:"pham-vi",tier:"T2"}]  broken:[]
  chmod 000 evidence-report.md (file KHÔNG được nhánh draft đọc)
    → gates:[]  broken:[{slug:"draft-slug",file:"evidence-report.md",reason:"không đọc được (EACCES)"}]

Hậu quả: một việc đang chờ Cổng Phạm vi (hoặc `approved` đang chờ S2/S3) biến khỏi nhóm "Chờ chữ ký của anh" / "Đang dở" trên thẻ /start chỉ vì một artifact bên cạnh không liên quan bị lỗi quyền — chính hướng thiệt hại mà AC-1 nói phải chặn ("slug giữ nguyên chỗ ... thay vì bị phân ô theo artifact bên cạnh").

Đây là bản REGRESSION do chính diff này gây: base f907ae1 có `read()` nuốt mọi lỗi nên `eTxt=null` và slug draft vẫn vào `gates`. CLAUDE.md nêu đích danh: "sửa phải theo LỚP: quét cả file tìm mọi case cùng hình dạng, đừng chỉ vá case bị nêu tên".

Ghi chú kèm: guard `!fmOrNull(eTxt,'verdict')` ở dòng 123 cũng cùng hình dạng (draft có evidence-report.md thiếu verdict → broken, mất khỏi gates) nhưng cái đó có sẵn từ base.

Mirror `plugins/acceptance-gate/scripts/start-scan.mjs:117` giống hệt.

Rationale: Slug bị đẩy khỏi ô đúng vì lỗi đọc của một artifact không thuộc luồng kiểm của status đó — đúng kịch bản AC-1 cấm ("slug ... thay vì bị phân ô theo artifact bên cạnh").

### Guard I/O + guard verdict của evidence-report.md chạy cho cả status không đọc file đó — slug lành biến khỏi ô đúng (đúng lớp lỗi r3 vừa sửa cho opportunity.md)
- file: `scripts/start-scan.mjs:116`
- severity: high
- AC: AC-1
- source: bugs

Hunk mới đặt `const eRead = read(...); if (eRead.err) {broken.push(...); continue;}` (116-117) và `if (eTxt != null && !fmOrNull(eTxt,'verdict')) {broken.push(...); continue;}` (123) TRƯỚC chỗ rẽ nhánh theo `status` (125-145). Nhưng evidence-report.md chỉ được dùng ở hai nhánh `verified` và `implemented`. Với `draft`, `approved`, `signed-off` thì file đó không bao giờ được đọc tới, vậy mà lỗi của nó vẫn quyết định ô của slug — đúng kịch bản mà AC-1 cấm ("slug giữ nguyên chỗ ... thay vì bị phân ô theo artifact bên cạnh") và đúng lớp lỗi mà round S4-r3 vừa sửa cho opportunity.md, chỉ dời một file mà bỏ file kia.

Đã chạy thật trên fixture code-sinh (3 slug: contract status approved / draft / signed-off, mỗi slug kèm một evidence-report.md):
  baseline: gates=[{s-draft,pham-vi}] inProgress=[{s-approved,S2}] done=[{s-signed,signed-off}] broken=[]
  chmod 000 evidence-report.md: gates=[] inProgress=[] done=[]
    broken=[{s-approved,evidence-report.md,"không đọc được (EACCES)"},{s-draft,...},{s-signed,...}]

Biến thể thứ hai (cùng guard, dòng 123): đổi `== null` → `!` ở bản vá S4-r1 làm vùng bắn rộng thêm sang giá trị rỗng — evidence-report.md có `verdict:` rỗng (hoặc thiếu dòng verdict) nằm cạnh contract `status: draft` cũng đẩy slug khỏi gates:
  broken=[{s-draft,evidence-report.md,"frontmatter không parse được hoặc thiếu verdict"}]

Thiệt hại: một việc đang chờ NGƯỜI ở Cổng 1 (draft) hoặc một việc đã ký xong (signed-off) rời khỏi danh sách chọn của /start chỉ vì một artifact không liên quan đến ô của nó. Sửa: dời cả hai guard vào trong hai nhánh `verified`/`implemented` (giống cách r3 đã làm với opportunity.md), hoặc chỉ đọc evidence-report.md khi status ∈ {verified, implemented}.

Mirror `plugins/acceptance-gate/scripts/start-scan.mjs:116-123` giống hệt từng ký tự.

Rationale: Cùng lớp lỗi với finding trên: slug bị phân ô sai vì lỗi của một artifact không thuộc luồng kiểm của status đó, đúng điều AC-1 cấm.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P102 gặp môi trường root thì exit 0 sau case (a) — bỏ 6 case còn lại nhưng bảng kết quả vẫn báo PASS**
  Người dùng thấy gì: Trên một số môi trường chạy bằng quyền quản trị, bài kiểm tra bảo vệ cho trường hợp kết quả thẩm định ghi sai định dạng có thể báo đạt dù phần lớn các tình huống lỗi chưa từng được thử thật — một lỗi thật trong tương lai có thể lọt qua mà không ai biết.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Evidence của chính slug này đã cũ so với cây: verified_commit ghim 428bfdb, code sửa tiếp ở f9bd06b mà không re-verify**
  Người dùng thấy gì: Báo cáo bằng chứng của tính năng này đang xác nhận cho một phiên bản mã cũ hơn phiên bản hiện có — một sửa lỗi sau đó chưa được thẩm định lại, nên kết quả đạt hiện ghi trên báo cáo chưa chắc còn đúng với mã hiện tại.
  file: `_acceptance/start-scan-hardening/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Bảng phân ô trong spec — được khai là "nguồn sự thật cho scan + test" — không được cập nhật khi hành vi verdict BLOCKED đổi**
  Người dùng thấy gì: Tài liệu mô tả cách phân loại công việc mà sản phẩm coi là nguồn tham chiếu chính xác đã lỗi thời so với hành vi mới — người đọc tài liệu này để hiểu quy trình sẽ bị dẫn sai.
  file: `docs/specs/2026-08-03-start-command-design.md`
  severity: medium
  Đề xuất: known-limits

- **VERDICT_OK là code chết — không nơi nào tham chiếu sau khi gộp về bảng tra**
  Người dùng thấy gì: Có một đoạn khai báo còn sót lại từ phiên bản cũ, không còn ai dùng — không gây lỗi hiện tại, nhưng dễ khiến người sửa sau lầm tưởng vẫn cần cập nhật ở đó, dẫn tới sửa nhầm chỗ về sau.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **P102 báo PASS khi chmod không chặn được đọc — process.exit(0) bỏ TOÀN BỘ assertion, kể cả 5 case không dùng chmod**
  Người dùng thấy gì: Trên một số môi trường chạy bằng quyền quản trị, bài kiểm tra bảo vệ cho trường hợp kết quả thẩm định ghi sai định dạng báo đạt dù gần như toàn bộ các tình huống cần thử đều bị bỏ qua — một lỗi thật có thể lọt qua mà không bị phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **VERDICT_OK là hằng chết sau khi gộp về bảng tra — không còn ai đọc**
  Người dùng thấy gì: Có một đoạn khai báo còn sót lại từ phiên bản cũ, không còn ai dùng — không gây lỗi hiện tại, nhưng dễ khiến người sửa sau lầm tưởng vẫn cần cập nhật ở đó, dẫn tới sửa nhầm chỗ về sau.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/start-scan-hardening/evidence-report.md, docs/specs/2026-08-03-start-command-design.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
