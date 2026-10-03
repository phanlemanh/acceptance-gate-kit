# Review findings: lan-ghim-lai-theo-paths (round 1)

## Trong hợp đồng

- **The paths filter in the pre-merge gate fails open: if the second parse crashes, the list of stale files is wiped and the gate goes green**
  AC: AC-5
  file: `scripts/pre-merge-check.sh:1378`
  severity: medium
  source: bugs
  detail: The first node call captures stdout and stderr together (`2>&1`). The guard only checks that some line starts with `{` (`grep -q '^{'`), but the second node call runs JSON.parse on the whole captured text. If node writes anything to stderr (for example a process warning from NODE_OPTIONS or a deprecation notice), the JSON is followed by `(node:PID) Warning: ...`. The parse then throws and `_sbp_out` is empty. The branch only tests `= "APPLY=0"`, so an empty result falls into the APPLY=1 `else` branch. There `_sbp_n` is empty, so `[ "" -gt 0 ]` errors quietly, and `stale="$(... sed -n '4,$p')"` sets `stale` to empty. No `evidence is stale` VIOLATION is printed, so the gate passes with no NOTE. Reproduced with the exact snippet, a file inside paths (`src/a.js`) and `NODE_OPTIONS=--require w.js`, where w.js calls `process.emitWarning`. Result: ok=1, _sbp=`{...}(node:62323) Warning: x`, out=[], stale=[]. Expected stale=[src/a.js]. This breaks the design claim that a failed filter keeps the old rule and prints a NOTE explaining why. Fix: drop `2>&1` from the first call, or capture stderr separately. In the second branch, require the first line to equal exactly `APPLY=1`, and treat anything else, including empty output or a parse failure, as "keep the old rule" plus a NOTE.
  rationale: AC-5 đòi khi bộ lọc không chạy được thì giữ nguyên danh sách luật cũ và in NOTE, không im, không thoát sạch nhờ lỗi; finding cho thấy đúng kết cục ngược lại (danh sách rỗng, không NOTE, cổng xanh).

- **Hình dạng 4 (âm-tính-một-mình, không ghim thông điệp): ô M8 «evals.yaml hỏng» và SBP5 xanh nhờ nhánh hop-paths-rong, không phải nhánh evals-hong**
  AC: AC-4
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs:90`
  severity: high
  source: measurement
  detail: E4 chỉ chấm M8 bằng `ketLuan` → 'stale' và 'loc' (dòng 90–94). Nó không ghim lý do mà lưới đã in ra trong `NOTE [feat]: bộ lọc paths không áp (<reason>)`. Tôi chạy thử: `staleByPaths(['lib2/b.js'], <evalsYaml của M8 ở ma-tran.mjs:21>)` trả `{apply:false, reason:'hop-paths-rong'}`. Bộ đọc YAML đọc chuỗi hỏng thành `{id:'E1', executor:'[script'}`; executor khác rỗng nên chốt `evals-hong` trong lib/evidence-core.cjs không bao giờ bắn. Ô 'evals.yaml hỏng' vì vậy đang xanh nhờ nhánh 'hợp paths rỗng'. Nếu gỡ chốt evals-hong, M8 vẫn xanh. Mutant «hợp rỗng thành im» (dòng 99) chỉ tiêm vào dòng `hop-paths-rong` và chỉ chạy trên M12, dù AC-4 trong contract nói nó phủ M8/M12. Ca SBP5 ở tests/scripts/stale-by-paths.test.mjs:28 có cùng hình dạng: `assert.equal(core.staleByPaths(['x'], 'evals:\n  - id: E1\n   executor: [\n').apply, false)` không ghim `reason` (thực tế ra 'hop-paths-rong'). Hệ quả mà phép đo không thấy: tôi đã đo được rằng một tệp evals.yaml hỏng ở một eval nhưng có thêm một eval lành khai paths cho ra `apply:true`, tức là bộ lọc vẫn bỏ qua tệp, đúng chiều fail-open mà M8 được dựng để chặn. Cả hai ca cần ghim `reason === 'evals-hong'` (hoặc ghim dòng NOTE tương ứng) thay vì chỉ ghim kết luận stale/apply.
  rationale: AC-4 đòi mỗi vế có cặp đỏ riêng ghim thông điệp riêng, mutant «hợp rỗng thành im» phủ cả M8 lẫn M12; finding cho thấy ô M8 xanh nhờ nhánh khác và mutant chỉ chạy trên M12.

- **Hình dạng 4: chiều đỏ E10 chỉ ghim mã thoát 2, chiều đỏ E8 so «khác» và vẫn xanh khi bản sao không in JSON**
  AC: AC-10
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/chan-lan.mjs:97`
  severity: high
  source: measurement
  detail: E10 chiều đỏ là `ok(rS.status === 2, ...)`: không ghim stderr. Ca anh em ngay trên (dòng 95) có ghim `/staleByPaths/.test(rP.stderr)`, ca này thì không. Bất kỳ lần thoát 2 nào của làn (thiếu bảng bộ máy khác, cổng cây bẩn, đối số) đều tính là đã thấy «khoá vắng mà đòi lib mới». Ở chan-song-song.mjs:60, chiều đỏ E8 là `JSON.stringify(m.suites) !== JSON.stringify(r.suites)`. Trong `chay`, `suites` là null khi stdout không parse được, nên một bản sao làm làn sập hoặc in hỏng cho `"null" !== "[4,5,0]"`, tức XANH. Không có kiểm `m.suites` là một hoán vị của `r.suites`, cũng không kiểm `m.st`. Cả hai ca không phân biệt được «bắt đúng lỗi» với «bản sao không chạy».
  rationale: AC-10 đòi chiều đỏ ghim «khoá vắng mà đòi lib mới»; E10 chỉ ghim mã thoát 2 nên không phân biệt được lỗi đó với các lần thoát 2 khác (E8 của AC-8 cũng cùng hình dạng).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The paths reader was copied into lib instead of moved, leaving two readers of the same evals.yaml field with no test tying them together**
  Người dùng thấy gì: Hai chỗ trong hệ thống cùng đọc một khai báo phạm vi đo của hồ sơ bằng hai cách viết riêng. Hôm nay chúng cho kết quả khớp nhau, nhưng về sau sửa một chỗ mà quên chỗ kia thì làn ghim lại và cổng trước-merge có thể kết luận khác nhau về cùng một hồ sơ.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: new-contract

- **SKILL.md documents a log directory path the lane never writes**
  Người dùng thấy gì: Hướng dẫn cho phiên làm việc chỉ sai tên thư mục chứa nhật ký đầy đủ của lần ghim lại. Người đọc làm theo chữ sẽ không thấy thư mục, nhưng đường dẫn đúng vẫn được in ngay khi làn báo lỗi.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **pre-merge-check.sh gained a new flag that the usage header does not list**
  Người dùng thấy gì: Cờ ép dùng luật cũ cho chiến dịch phát hành chưa được ghi vào phần giới thiệu cách dùng ở đầu công cụ. Kho nào đọc bản chép sẽ khó biết có cờ này để tắt bộ lọc khi chạy chiến dịch.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (lớp): nhiều chiều đỏ trên bản sao chỉ đòi VẮNG hoặc KHÁC, không chứng bản sao đã chạy tới đúng chỗ**
  Người dùng thấy gì: Nhiều bài thử kiểm tra cố tình làm hỏng bản sao để xem hệ thống có báo đỏ không, nhưng chỉ cần bản sao tự sập là bài thử cũng báo đỏ. Vì vậy màu đỏ chưa chắc chứng minh hệ thống bắt đúng lỗi, và một lỗi thật có thể lọt qua mà vẫn trông như được kiểm tra.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 4/7 lỗi rơi vào file không bộ đo nào phủ (feature-loop/skills/feature-loop/SKILL.md, _acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs, _acceptance/lan-ghim-lai-theo-paths/rang/chan-lan.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
