## Trong hợp đồng

### round-tally: bên VIẾT sinh round:null, bên ĐỌC fail-closed đòi number — một lượt BLOCKED sớm làm hỏng vĩnh viễn bộ đọc của cả hồ sơ
- file: `feature-loop/workflows/acceptance-verify.js:61`
- severity: high
- AC: AC-9
- source: conventions

`tallyLine()` ghi `round: (args && typeof args.round === 'number') ? args.round : null`, còn `round-tally-read.mjs:25` khai `REQUIRED = [['round','number'], …]` và exit 2 cho CẢ FILE khi gặp dòng sai kiểu, với đúng thông điệp «writer và reader đã trôi khỏi nhau, không đoán».

Kịch bản: args truyền vào là chuỗi JSON hỏng → `args = null` (dòng 54-56) → `blockedEarly()` → dòng tally có `round: null`. SKILL.md bước «Mọi verdict» (dòng 228) bắt main loop LUÔN append `result.runLog` vào `_acceptance/<slug>/run-log.jsonl`, kể cả BLOCKED. Run-log là append-only, nên từ lượt đó trở đi mọi lần chạy `round-tally-read.mjs --run-log <ws>/run-log.jsonl` đều exit 2 — phép đếm 5-vòng-kế mà AC-9 dựng ra để khỏi khảo cổ tự tắt, đúng với hồ sơ đã cháy vì hạ tầng.

Đã dựng lại được: ghi một dòng `{"ts":"","round":null,"kind":"round-tally","verdict":"BLOCKED","expected":0,"returned":0,"blocked":1}` → reader exit 2, ghim khoá "round".

Đây đúng hình dạng (3) trong CLAUDE.md («bên VIẾT và bên ĐỌC của một artifact trôi khỏi nhau vì mọi test tự dựng fixture đúng khuôn bên đọc»): RS2 round-trip qua reader THẬT chỉ chạy trên ca có `round: 1`; RS4 (RS4a dùng `args = {}`, cũng cho round null) chỉ đếm số dòng tally, không cho qua reader. Chiều đỏ của cặp writer/reader chưa phủ chính đường mà `blockedEarly` mới mở.

Rationale: AC-9 đòi round-tally của MỌI verdict kể cả BLOCKED sớm phải round-trip qua chính bộ đọc; ở đây dòng do writer sinh cho ca BLOCKED sớm bị chính reader từ chối (exit 2), đúng thất bại AC-9 mô tả.

### normInfra nhận diện hạ tầng bằng cách dò chuỗi trong output tự do — lỗi sản phẩm có in chữ «cd: … No such file or directory» bị nuốt thành BLOCKED
- file: `feature-loop/workflows/acceptance-verify.js:560`
- severity: medium
- AC: AC-12
- source: conventions

`CD_FAIL_RE` quét `r.outputTail` (~10 dòng cuối stdout của lệnh). Chú thích ngay trên khẳng định «exit 1 thường KHÔNG bị đụng: phân loại không được nuốt lỗi thật» — nhưng mã KHÔNG giữ được lời hứa đó: bất kỳ lệnh fail nào mà đuôi output có chuỗi khớp đều bị đổi sang `cannotRun: true` bất kể exit code.

Ca cụ thể trên chính kho này: `tests/workflows/round-signal.test.mjs` RS3a/RS5 in `reason` chứa nguyên văn «Dau vet: sh: line 0: cd: /repo: No such file or directory» khi ca ĐỎ. Nếu suite `node tests/workflows/round-signal.test.mjs` fail thật ở ca đó, exit ≠ 0 và đuôi output mang chuỗi khớp → normInfra biến một REJECT thật thành BLOCKED «hạ tầng chấm», và người đi khắc phục hạ tầng cho một lỗi sản phẩm.

Đây là lớp «đo từ vựng thay vì quan hệ» / blacklist trên không gian mở: tín hiệu chỗ-đứng-hỏng cần đến từ trường có cấu trúc (ví dụ verifier khai riêng bước cd fail, hoặc wrapper trả mã thoát dành riêng), không từ việc dò chữ trong văn bản do lệnh được chấm tự in ra.

Rationale: AC-12 cam kết rõ 'lệnh thoát 1 thường vẫn là FAIL sản phẩm — phân loại không nuốt lỗi thật'; finding cho thấy một lỗi sản phẩm thật (exit 1) có thể bị phân loại nhầm thành hạ tầng chỉ vì trùng chữ trong output, đúng thất bại AC-12 nêu.

### Early-BLOCKED round-tally line writes round:null, which its own reader rejects with exit 2 — poisoning run-log.jsonl permanently
- file: `feature-loop/workflows/acceptance-verify.js:61`
- severity: high
- AC: AC-9
- source: bugs

tallyLine() emits `round: (args && typeof args.round === 'number') ? args.round : null`. On the `!args` / malformed-args early return (blockedEarly at line 69) `args` is null or lacks a numeric round, so the emitted line is `{"ts":"","round":null,"kind":"round-tally","verdict":"BLOCKED","expected":0,"returned":0,"blocked":1}` (verified by running runWorkflow(WF, {}, …)). The paired reader feature-loop/scripts/round-tally-read.mjs:25 declares REQUIRED = [['round','number'], …] and, on any tally line failing that type check, prints the drift message and process.exit(2) for the ENTIRE read, not just that line (verified: exit=2). SKILL.md:228 instructs the main loop to append `result.runLog` on every verdict, and run-log.jsonl is append-only, so a single such round makes round-tally-read.mjs fail-closed forever for that workspace — every later well-formed tally becomes unreadable too. The 5-round threshold counter that AC-9 exists to feed goes dark precisely on the infra-broken rounds it needs to count. Test coverage misses it: RS4a only asserts the line exists; only RS2 round-trips through the real reader, and only on the healthy path where args.round is a number. Fix: emit a number (fall back to 0 or -1) or make `round` optional/nullable in the reader's REQUIRED table — one side must move, currently the writer emits a shape the reader is guaranteed to reject.

Rationale: Cùng hiện tượng với finding round-tally tiếng Việt ở trên: AC-9 đòi dòng tally của MỌI verdict (kể cả BLOCKED sớm) phải đọc lại được bằng chính bộ đọc, nhưng ở đây bộ đọc từ chối dòng do writer sinh.

### CD_FAIL_RE does not match zsh's cd error format, so AC-12 infra classification is dead on the shell the verifier agents actually run
- file: `feature-loop/workflows/acceptance-verify.js:560`
- severity: high
- AC: AC-12
- source: bugs

CD_FAIL_RE = `/(?:^|[\s:])cd:\s+(?:line \d+:\s*)?(?:can'?t cd to\b|\S.*?(?:No such file or directory|Not a directory|Permission denied))/i` requires whitespace right after `cd:` AND a non-space token between `cd:` and the error phrase. zsh emits neither: it prints `(eval):cd:1: no such file or directory: /path` (reason first, no space after `cd:`). Verified live in this environment — `cd /nope-xyz-123 && echo hi` returns `(eval):cd:1: no such file or directory: /nope-xyz-123`, and CD_FAIL_RE.test() on that string is false; `zsh -c 'cd /nope-xyz && echo hi'` → `zsh:cd:1: no such file or directory: /nope-xyz` → also false; the zsh permission form `cd: permission denied: /root` → false. Only the bash/dash forms match. The code comment explicitly claims to cover the «bash/zsh» family, and the whole change (lanes now hand agents `cd <repoRoot> && <cmd>` and `cd "$WT" && <cmd>`) depends on this detection. Since a failed `cd` in an `&&` chain exits 1, not 127, the sibling `r.exitCode === 127` branch does not catch it either — a dropped worktree or wrong repoRoot under zsh still yields the fake REJECT that AC-12 was written to prevent, burning a round. Tests RS3a and RS5 pass only because their fixtures are hand-written `sh:`/`bash:` strings rather than output produced by a real shell in the run.

Rationale: AC-12 hứa lệnh hỏng vì bước cd thất bại phải đi nhánh BLOCKED hạ tầng; trên shell zsh — shell mà agent thực sự chạy — biểu thức nhận diện không bao giờ khớp, nên nhánh cd-fail của AC-12 không hoạt động, đúng thất bại AC nêu.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Lane baseline có cd nhưng không qua normInfra: cd hỏng trong worktree bị đọc thành «eval CÓ phân biệt»**
  Người dùng thấy gì: Khi hạ tầng dựng bản so sánh (worktree) hỏng, hệ thống có thể báo nhầm rằng bản cũ chạy khác bản mới, khiến người đọc báo cáo tưởng phép so sánh đã diễn ra trong khi nó chưa từng chạy thật.
  file: `feature-loop/workflows/acceptance-verify.js:634`
  severity: medium
  Đề xuất: new-contract

- **s4-args.mjs: mọi lệnh git đều không bọc — ref hỏng cho exit 1 kèm stack trace, phá hợp đồng exit-code script tự khai**
  Người dùng thấy gì: Nếu người vận hành gõ sai một tham số tham chiếu tới lịch sử commit, công cụ sinh dữ liệu chấm điểm có thể dừng với một thông báo lỗi kỹ thuật khó hiểu thay vì nói rõ tham số nào sai, làm mất thời gian dò lỗi.
  file: `feature-loop/scripts/s4-args.mjs:190`
  severity: medium
  Đề xuất: known-limits

- **Chuỗi cd ghim vào prompt verifier không đặt trong nháy — repoRoot có khoảng trắng thì lệnh vỡ**
  Người dùng thấy gì: Nếu đường dẫn tới dự án chứa khoảng trắng, lệnh gửi cho máy chấm điểm có thể chạy sai vị trí, khiến kết quả chấm không còn đáng tin mà không có cảnh báo nào báo trước.
  file: `feature-loop/workflows/acceptance-verify.js:479`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — assertion không thể đỏ: «chiều đỏ vế tệp» không đo vật nào**
  Người dùng thấy gì: Phép kiểm dùng để xác nhận tính năng phát hiện dữ liệu đã cũ hoạt động thật ra không có khả năng phát hiện lỗi — nếu tính năng đó âm thầm hỏng, sẽ không có cảnh báo nào xuất hiện.
  file: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh:219`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — chiều đỏ tự thoả: chèn đúng chuỗi rồi grep chính chuỗi đó**
  Người dùng thấy gì: Phép kiểm nhằm đảm bảo hướng dẫn không dạy cách làm tắt thủ công thực ra không kiểm tra được điều đó — nếu hướng dẫn vô tình dạy lại cách làm tắt bằng câu chữ khác, lỗi sẽ không bị phát hiện.
  file: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh:248`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — mutant không bao giờ được chạy; assert lại chính chuỗi vừa xoá**
  Người dùng thấy gì: Phép kiểm nhằm đảm bảo khi xoá một lựa chọn khỏi hệ thống thì mọi nơi liên quan đều mất lựa chọn đó thực ra không thử tình huống này trên hệ thống thật — nếu tính năng hỏng, phép kiểm vẫn báo đạt.
  file: `tests/workflows/round-signal.test.mjs:170`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 1 — đo văn bản NGUỒN thay vì ĐẦU RA (prompt sinh ra)**
  Người dùng thấy gì: Phép kiểm đảm bảo ba nơi dùng chung một danh sách lựa chọn chỉ soi mã nguồn chứ chưa xác nhận nội dung thực tế gửi tới các bên dùng có đồng nhất hay không — nếu chúng lệch nhau lúc chạy thật, sẽ không bị phát hiện.
  file: `tests/workflows/round-signal.test.mjs:158`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — nhận exit≠0 bất kỳ làm bằng chứng phân biệt, không ghim thông điệp**
  Người dùng thấy gì: Phép kiểm coi bất kỳ lỗi nào cũng là bằng chứng tính năng hoạt động đúng, kể cả khi lỗi đó chỉ do trục trặc không liên quan — có thể khiến người quyết định tin nhầm tính năng đã được kiểm chứng khi thực ra chưa được thử đúng cách.
  file: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh:131`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — phép HOẶC làm mất quan hệ agent↔lệnh của chính nó**
  Người dùng thấy gì: Phép kiểm không phân biệt được việc mỗi máy chấm chạy đúng lệnh của chính mình hay tất cả vô tình chạy nhầm cùng một lệnh — một lỗi ghép nhầm lệnh giữa các máy chấm có thể lọt qua mà không bị phát hiện.
  file: `tests/workflows/lane-pin.test.mjs:51`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/13 lỗi rơi vào file không bộ đo nào phủ (_acceptance/cham-dung-cay-dung-cho-dung/rang.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
