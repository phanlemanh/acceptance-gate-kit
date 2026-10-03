# Review findings: lan-ghim-lai-theo-paths (round 2)

## Trong hợp đồng

- **Several 'red direction' mutant checks in the teeth conclude red from a missing message alone (negative-alone assertion)**
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs:151` — severity: medium — AC: AC-2 — source: conventions
  detail: This is the class that CLAUDE.md's invariant 'Assertion âm-tính-một-mình là assertion không sống' forbids: a mutant case must prove the mutant actually ran and must pin the expected message. These checks pass only because something is absent from the mutant's output. chan-premerge.mjs:67 (E2 drop the NOTE: `!coStale && !noteBoQua`), :135 (E5 s4 `!coStale`), :139 (E5 s3 `!coStale`), :151 (E6 s1 `!coStale` with --stale-all), :153 (E6 s2 `!/VIOLATION [config]/`). chan-lan.mjs:66 (E7 red 2 `!boQua(...)`), and the E7 'vế riêng' check just after it (`!boQua(...)` on KIT, with no pin on the 'KHÔNG bỏ qua — tệp định nghĩa phép đo đổi' line). chan-song-song.mjs:87 (E9 `!(khoi(A) && khoi(B))`). In the bash mutants (pre-merge-check.sh with code injected via `banSao`), a syntax error or early exit in the copy gives empty output, and the case still turns green as 'red direction seen'. `banSao` only guards against an injection that missed its target, not against a copy that fails to run. The same suite already does this correctly elsewhere: E8 in chan-song-song checks that the copy 'chạy trọn (mã)' and is a permutation, and E2 s1, E3 and E10 assert a positive message. The fix should cover the whole class: each red case should assert a positive marker that the mutant reached the slug step (for example the 'bỏ qua theo paths: N tệp' NOTE, a 'NOTE [feat]' line for the slug, or an exact exit code).
  Lý do vào hợp đồng: AC-2 (cùng AC-4/5/6/7/9) đòi chiều đỏ trên bản sao phải ghim thông điệp cụ thể; các ca này chỉ kết luận đỏ từ việc vắng thông điệp nên không chứng minh bản sao đã chạy.

- **The paths filter drops changed files whose names git prints in quotes, so stale evidence passes**
  file: `lib/evidence-core.cjs:364` — severity: medium — AC: AC-2 — source: bugs
  detail: `staleByPaths` matches each name from `git diff --name-only` (via `stale_files` in pre-merge-check.sh, and `gitRaw('diff','--name-only',vc)` in repin-lane.mjs) against `pathGlobToRe(glob)`. With git's default `core.quotepath=true`, a file with a non-ASCII name (for example a Vietnamese filename) comes out as `"src/t\303\240i.js"`, with literal quotes and octal escapes. That string never matches `^src/.*$`, so the file goes to `skipped` even though it is inside the eval's `paths`. Reproduced: a diff touching `src/a.js` and `src/tài.js` with `paths: ["src/**"]` gives `kept:["src/a.js"]` and `skipped:["\"src/t\\303\\240i.js\""]`. Effect: under `stale_scope: paths`, if only such a file changed inside `paths`, pre-merge-check prints only a NOTE (bỏ qua theo paths) and no stale VIOLATION. That is a false green against the contract's own promise that the filter only removes files outside `paths`. repin `--skip-unchanged` would also skip the lane. Fix: run diff with `-c core.quotepath=off`, or use `-z`, or unquote C-style names before matching.
  Lý do vào hợp đồng: AC-2(a) đòi tệp đổi khớp paths vẫn bị hoá cũ; tệp tên có dấu bị git in trong ngoặc kép nên bị lọc nhầm là ngoài paths và hồ sơ cũ lọt qua.

- **Shape 4 (assertion âm-tính-một-mình): many red-direction checks on mutated copies only assert ABSENCE and never pin that the mutated copy actually ran**
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs:153` — severity: medium — AC: AC-6 — source: measurement
  detail: This repeats across both new tooth suites (rang). In each case below, the red direction only checks that something is absent, or that some output differs, on the run of the mutated copy. Nothing checks the mutated copy's exit code or one of its own positive messages. So a copy that crashes (bash syntax error after injection, a missing require, exit 127) leaves the same trace as 'the mutant was caught', and the case goes green. lan-ghim-lai-theo-paths/rang/chan-premerge.mjs: :48 (E1, only `!==` against base), :67 (E2 `!coStale && !noteBoQua`), :108 (E4: `t !== muon(...)`, where t comes from coStale alone, so a crash gives 'loc' and passes for M4/M6/M8/M12), :135 and :139 (E5 `!coStale`), :151 (E6 `!coStale`), :153 (E6 `!/VIOLATION \[config\]/`). chan-lan.mjs:66 (E7 red 2, `!boQua` only, while boQua requires status 0 plus "skipped": true, so any crash counts as 'lane ran'). chan-song-song.mjs:87 (E9 `!(khoi A && khoi B)`, empty stderr passes). lan-ghim-lai-giu-tron-loi-loi/rang: chan-nhat-ky.mjs:35 (`!==` KY_VONG) and :54 (`thieu.length > 0`, with no log file thieu = 200); chan-dau-do.mjs:79-80 (mutants 'đỏ không vết' and 'thiếu dấu ở slug' only check that no new line appeared) and :142 (`thayDoi` = m !== c.ma, so any crash exit code counts); chan-tai-may.mjs:63 (`!(status===1 && repin-do)`). The correct pattern already exists in the same suites, which shows the gap is visible: chan-thoi-luong.mjs:33 pins `b.r.status === 0 && m.do(...)` and chan-song-song.mjs:61 pins `m.st === r.st` plus a permutation. The CLAUDE.md rule requires pinning the expected message; these cases only have green controls on KIT, not on the copy.
  Lý do vào hợp đồng: phần thuộc hợp đồng này (E6 dòng 151/153 và các ca E2/E4/E5/E7/E9) vi phạm yêu cầu ghim thông điệp ở chiều đỏ, ví dụ AC-6 đòi VIOLATION [config] gọi tên giá trị mà ca chỉ kiểm sự vắng mặt; phần ở bộ răng của ô giữ-trọn-lời-lỗi không thuộc hợp đồng này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The 'paths' reader was copied into lib instead of moved; the lane now has two hand-written readers with no parity check**
  Người dùng thấy gì: Hai chỗ trong làn ghim lại đọc cùng một khai báo phạm vi bằng hai đoạn mã viết tay, chưa có phép so để giữ chúng khớp nhau. Hiện hai bên cho cùng kết quả, nhưng về sau có thể lệch mà không ai hay.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Parallel suite path decodes each output chunk separately, so the 'full log' can garble multi-byte UTF-8 where the serial path does not**
  Người dùng thấy gì: Khi bật chạy song song và bộ kiểm thử đỏ có nhật ký rất lớn, vài chữ có dấu tiếng Việt trong file nhật ký có thể bị hỏng thành ký tự lạ. Kết quả xanh/đỏ không đổi, chỉ khó đọc lời lỗi.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Parallel suite mode decodes each output chunk separately, corrupting multi-byte UTF-8 in the full log**
  Người dùng thấy gì: Khi chạy song song với bộ kiểm thử rất lớn, file nhật ký đầy đủ có thể mất hoặc hỏng một vài chữ có dấu. Người đọc lời lỗi có thể thấy ký tự lạ ở vài chỗ.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **evalPathsOf reads the eval id differently from parseEvals, so an id with a trailing comment never matches**
  Người dùng thấy gì: Nếu tên một phép đo trong hồ sơ có kèm chú thích cuối dòng, bộ lọc theo phạm vi sẽ không bao giờ áp dụng cho hồ sơ đó và làn vẫn chạy đầy đủ như cũ. Không sai kết quả, chỉ mất phần tiết kiệm và thông báo nêu sai lý do.
  file: `lib/evidence-core.cjs`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims a sweep of the whole CLASS but extracts readers by vocabulary): E4 'every run-log reader' only catches files that contain the literal "run-log.jsonl"**
  Người dùng thấy gì: Phép kiểm tra rằng mọi nơi đọc nhật ký lượt chấm đều chịu được dòng mới chỉ quét những file nhắc đúng tên nhật ký. Một vài nơi đọc nhật ký qua tham số có thể chưa được kiểm, dù hiện nay chúng vẫn chạy đúng.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (count not written in advance): LT-AC7 checks string count = an expected count derived from the very object being checked**
  Người dùng thấy gì: Một phép đếm trong bộ kiểm thử thẻ lối ra tự so với chính dữ liệu của nó nên không bao giờ báo sai. Nếu thiếu một lối ra, các phép kiểm khác vẫn bắt được.
  file: `tests/scripts/lmtl-the.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Shape 4 (the 'missing node' leg can go green without measuring): an OR in the assert lets E5(iii) skip itself**
  Người dùng thấy gì: Trên một số máy có sẵn công cụ chạy ở vị trí hệ thống, phép thử giả lập thiếu công cụ đó tự bỏ qua mà vẫn hiện là đạt. Người đọc kết quả có thể tưởng trường hợp thiếu công cụ đã được kiểm.
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 5/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs, tests/scripts/lmtl-the.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
