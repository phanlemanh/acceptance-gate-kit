# Review Findings: codex-script-packaging (round 4)

## Trong hợp đồng

### P162 E4 pins only exit code 2 on three fail-loud cases — violating the repo's message-pinning invariant, and one case demonstrably fires for the wrong reason
- file: `tests/plugins/run-tests.sh:7166`
- severity: high
- AC: AC-4
- source: conventions

The negative matrix at lines 7161-7167 asserts `rr.returncode == 2` for "bo han co", "go sai ten co", "chuoi rong" with no message assertion. CLAUDE.md states the requirement literally: every such case must have (a) a positive control — present here, lines 7168-7172 — **and (b) ghim đúng thông điệp mong đợi, không chỉ mã thoát**. (b) is missing.

The consequence is not hypothetical. `carry-plan.mjs` uses exit 2 for at least five distinct paths (`__error` from parseArgs, missing required flags, the delta/no-delta XOR, empty `--delta-files`, unreadable input, bad `--round`), so exit code alone cannot tell "caught the intended error" from "blew up earlier for an unrelated reason". Run empirically:

    $ node feature-loop/scripts/carry-plan.mjs --run-log … --contract … --round 4 --delta_files "src/a.js"
    carry-plan: tham số lạ (không phải cờ): src/a.js
    exit=2

The intended `cờ không nhận diện được: --delta_files` branch never runs — see the companion finding on `carry-plan.mjs:29` below (out-of-contract). The typo case therefore passes P162 while exercising a different code path than the one the case name and the S4-r3 comment claim it covers. Pinning the expected substring (`cờ không nhận diện được`, `phải nêu ĐÚNG MỘT`, `--delta-files rỗng`) would have surfaced this at authoring time.

Per CLAUDE.md this must be fixed as a *lớp*, not a single case: sweep the new P162 block for every assertion that concludes from a bare exit code.

Rationale: AC-4 yêu cầu rõ — thiếu tham số phải trả mã thoát 2 KÈM thông điệp hướng dẫn được ghim; ba ca này chỉ ghim mã thoát nên không chứng minh được vế thông điệp mà AC-4 đòi hỏi.

### P162 silently skips any script reference whose filename has `_`, uppercase, or a non-(mjs|js|sh) extension — dead pointers stay invisible
- file: `tests/plugins/run-tests.sh:7053`
- severity: high
- AC: AC-2
- source: bugs

AC-2 promises the gate extracts EVERY `<prefix>/scripts/<name>` form and classifies it, with unclassified prefixes going RED ("không được im lặng bỏ qua"). But `ANY_REF = re.compile(r"([^\s\`\"'()\[\]]{1,60})/scripts/([a-z0-9-]+\.(?:mjs|js|sh))")` constrains the *filename* to `[a-z0-9-]+` and three extensions, so non-matching names never reach `classify()` at all — they land in neither `refs` nor `unknown`. This is exactly the blacklist-on-open-space shape the kit's own doctrine warns about, and the escape hatch is in the filename half of the regex where the AC's reasoning never looked.

Proof (temp copy of plugins/, injected one line into feature-loop-codex SKILL.md, ran the P162 extract+dead_pointers logic verbatim):

    ${PLUGIN_ROOT}/scripts/khong_ton_tai.mjs  -> dead=[] unknown=[]   (GREEN, file does not exist)
    ${PLUGIN_ROOT}/scripts/KhongTonTai.mjs    -> dead=[] unknown=[]   (GREEN)
    ${PLUGIN_ROOT}/scripts/khong-ton-tai.py   -> dead=[] unknown=[]   (GREEN)
    ${PLUGIN_ROOT}/scripts/khong-ton-tai.mjs  -> dead=[('feature-loop-codex','khong-ton-tai.mjs')]  (RED, correct)

Only the all-lowercase `.mjs` mutant is caught. The E3 mutation legs all use `khong-ton-tai-{a,b,c}.mjs`, so the whole matrix probes only inside the regex's blind spot.

This is not hypothetical for this repo: `/Users/manhphan/dev/acceptance-gate-kit/plugins/acceptance-gate/GUIDE.md:411` already references `skills/ux-ui-craft/scripts/measure_layout.js`, and `plugins/acceptance-gate/skills/ux-ui-craft/scripts/` is a real second scripts directory. That line is invisible to the gate today purely because of the underscore — had it matched, its prefix `skills/ux-ui-craft` is in neither `NOTSELF` nor the PLUGIN_ROOT branch, so it would have gone to `unknown` and turned P162 red. The gate is green by accident, and the next tool added with an underscored or `.py`/`.ts` name gets no coverage — precisely the regression P162 exists to prevent.

Fix: widen the name group to `[A-Za-z0-9._-]+\.[a-z]{1,4}` (or drop the extension whitelist) and let `classify()` decide, adding a NOTSELF row for `skills/ux-ui-craft`. Add a mutation leg using an underscored name so the matrix covers the character class itself.

Rationale: AC-2 nêu rõ — tiền tố không thuộc cả hai danh sách (trỏ-gói-mình / NOTSELF) phải ĐỎ, "không được im lặng bỏ qua"; finding chứng minh bằng tham chiếu thật (skills/ux-ui-craft) rằng tham chiếu bị bỏ qua hoàn toàn thay vì bị đánh dấu, vi phạm trực tiếp câu chữ AC-2.

### Hình dạng 4 — ma trận fail-open 3 ca chỉ ghim MÃ THOÁT 2, không ghim thông điệp
- file: `tests/plugins/run-tests.sh:7167`
- severity: medium
- AC: AC-4
- source: measurement

Ba ca "bo han co" / "go sai ten co" / "chuoi rong" (7161-7167) đều kết luận bằng `assert rr.returncode == 2`. carry-plan.mjs có ≥5 đường thoát 2 khác nhau (tham số lạ không phải cờ; cờ thiếu giá trị; cờ không nhận diện được; thiếu run-log/evals/contract/round; vi phạm đúng-một-trong-delta-files/no-delta; --delta-files rỗng; đọc file lỗi; --round không hợp lệ). Assert không phân biệt được guard nào nổ, nên nó không đo được ca nào trong ba ca đó.

Đối chứng dương thì có (7168-7172 chạy hai ca exit 0 + json.loads), nhưng vế (b) của bất biến CLAUDE.md — ghim ĐÚNG THÔNG ĐIỆP — thiếu. Lưu ý ca không-tham-số ngay trên (7154) LÀM đúng: nó assert `"usage" in (stdout+stderr)`. Ba ca này bỏ mất.

Đã chứng minh bằng mutant: gỡ nguyên dòng `if (unknown.length) return { __error: \`cờ không nhận diện được: ...\` };` khỏi plugins/feature-loop-codex/scripts/carry-plan.mjs — tức gỡ đúng bản vá đầu bài của diff này (KNOWN_FLAGS) — thì `--delta_files src/a.js` vẫn thoát mã 2, nhưng qua guard KHÁC (token `src/a.js` không bắt đầu bằng `--` → "tham số lạ"), và P162 VẪN XANH.

Rationale: Cùng finding với ca "P162 E4 pins only exit code 2..." ở trên — vi phạm trực tiếp vế "kèm thông điệp hướng dẫn ghim" của AC-4, có kèm chứng minh bằng mutant rằng bài kiểm không phân biệt được đường lỗi nào đã nổ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P162 relation guard is structurally blind to the prefix-less `scripts/<name>` shape — vacuous for design-loop-codex while the PKG list advertises coverage**
  Người dùng thấy gì: Khi chỉ dẫn của một gói Codex nêu tên công cụ theo kiểu không kèm tên gói ở phía trước, cổng kiểm không phát hiện được công cụ đó có tồn tại hay không — người dùng làm theo chỉ dẫn có thể chạy phải một lệnh không có trong gói mà không nhận được cảnh báo nào.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: new-contract

- **parseArgs reports the wrong token for a mistyped flag: the unknown-flag branch is unreachable whenever the bad flag carries a value**
  Người dùng thấy gì: Khi gõ nhầm tên một tuỳ chọn dòng lệnh mà tuỳ chọn đó có kèm theo giá trị, thông điệp lỗi hiển thị lại chỉ ra sai giá trị thay vì chỉ ra đúng tuỳ chọn bị gõ sai — người dùng phải đoán mới tìm ra chỗ cần sửa.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Delta list from `git diff --name-only <sha>` omits untracked files, so a fix round that adds new files carries stale green evidence forward**
  Người dùng thấy gì: Nếu một vòng sửa lỗi tạo thêm tệp mới thay vì chỉ sửa tệp có sẵn, hệ thống có thể không nhận ra các tệp mới đó và báo lại kết quả kiểm tra của vòng trước (có khi báo "không có gì thay đổi"), dù mã mới chưa từng được kiểm — người duyệt có thể ký một bản chưa thực sự được kiểm.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: high
  Đề xuất: new-contract

- **`_acceptance/**` is filtered out of the delta, so an evals.yaml edit during a fix round carries the old result under the redefined eval**
  Người dùng thấy gì: Nếu một vòng sửa lỗi đổi định nghĩa của một mục kiểm (ví dụ đổi lệnh chạy kiểm) mà không đổi tên mục đó, hệ thống có thể gắn nhầm kết quả kiểm của định nghĩa CŨ cho mục đã được định nghĩa LẠI — báo cáo trông như đã kiểm nhưng thực chất chưa kiểm đúng nội dung mới.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **Assert vô điều kiện đúng — không bao giờ đỏ được**
  Người dùng thấy gì: Một dòng kiểm tra nội bộ trong bộ kiểm không bao giờ có thể tự phát hiện lỗi — không gây hậu quả trực tiếp cho người dùng vì phần kiểm thật đã nằm ở dòng ngay bên cạnh, nhưng khiến bộ kiểm trông kỹ hơn thực tế.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).