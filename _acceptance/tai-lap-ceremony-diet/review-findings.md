## Trong hợp đồng

### sign-batch.mjs bypass_used check is strict `=== 'true'` while pre-merge accepts case-insensitive true|1|yes — ack requirement silently skipped
- file: `scripts/sign-batch.mjs:64`
- severity: medium
- source: bugs
- AC: AC-3

Line 64-65: `const bypass = (report.match(/^bypass_used:[ \t]*([^\s#]+)/m) || [, ''])[1]; if (bypass === 'true' && ...)`. The reference parser pre-merge-check.sh:711 normalizes with `tr '[:upper:]' '[:lower:]'` and matches `true|1|yes` — so a report with `bypass_used: True`, `YES`, or `1` (all valid YAML truthy, and evidence reports are LLM-written) is treated as bypassed by the rest of the engine, but sign-batch treats it as non-bypassed, skips the bypass_ack requirement, and signs blind — the exact ký-mù fail-open class AC-3 targets and that r3/r4 were closing. Downstream pre-merge-check will later flag the un-acked bypass, but by then sign-batch has already mutated evidence-report.md and flipped the contract to signed-off, breaking its own 'từ chối cả lô trước khi ghi' guarantee. The P187 ack matrix only exercises lowercase `true`, so this shape is untested. Mirror copy plugins/acceptance-gate/scripts/sign-batch.mjs has the same code.

Rationale: AC-3 buộc: hồ sơ verified có bypass_used true mà chưa có bypass_ack phải bị TỪ CHỐI cả lô; với bypass_used ghi dạng truthy khác 'true' thường, helper không nhận diện là bypass nên bỏ qua yêu cầu ack và ký mù — vi phạm trực tiếp lời hứa 'không ký mù' của AC-3.


## Ngoài hợp đồng — người quyết ở Gate 2

- **Lệnh KPI đếm-từ-git bỏ sót commit chữ ký Cổng 2 dạng không-nháy (dạng chiếm đa số hồ sơ thật)**
  file: `commands/acceptance-report.md:35`
  severity: high
  Lệnh chuẩn khai trong chỉ dẫn là `git log --format=%H -G'human_signoff: \"|human_override: \"|approved_by: [A-Za-z]' -- _acceptance/<slug>/` — hai vế đầu đòi dấu nháy kép ngay sau `human_signoff: ` / `human_override: `. Nhưng chỉ sign-batch.mjs (mới, 2.0.0) ghi dạng có nháy `human_signoff: "Manh Phan 2026-08-07"`; toàn bộ hồ sơ cũ VÀ chính chỉ dẫn /signoff + GUIDE.md hiện hành bảo người ghi `human_signoff: <Tên> <ngày>` KHÔNG nháy (kiểm thật: 20/21 record trong _acceptance/ không nháy). Đo sống: với slug claim-scan-parser-hardening, lệnh as-written đếm 1 (chỉ commit approved_by Cổng 1) và BỎ S

- **P186 chỉ thi hành lệnh KPI trên measure-birth-certificate — slug duy nhất ký dạng có-nháy, nên phép đo không thể bắt lỗi undercount ở trên**
  file: `tests/plugins/run-tests.sh:9319`
  severity: medium
  P186 làm đúng nếp round-trip (rút lệnh từ chính chỉ dẫn rồi chạy), nhưng slug mẫu duy nhất là measure-birth-certificate — hồ sơ duy nhất trong repo có `human_signoff: "..."` dạng nháy (ký bằng sign-batch), nên assertion n>=1 xanh trong khi lệnh miss commit chữ ký của mọi hồ sơ dạng không-nháy. Đây đúng lớp bất biến CLAUDE.md 'thước phải gắn vào vật được giao': mẫu đo phải đại diện định dạng mà code path/nghi thức thật sinh ra (ở đây /signoff + GUIDE sinh dạng không-nháy). Nghi thức 'phá vật thật trong bản sao xem phép đo có đỏ không' áp lên một slug ký tay (vd claim-scan-parser-hardening) sẽ l

- **New KPI pickaxe regex misses unquoted human_signoff/human_override — systematic undercount of Gate-2 human-touch events**
  file: `commands/acceptance-report.md:35`
  severity: high
  The documented KPI command `git log --format=%H -G'human_signoff: \"|human_override: \"|approved_by: [A-Za-z]' -- _acceptance/<slug>/` requires a literal double quote after `human_signoff:` / `human_override:`. But the manual /signoff flow (commands/signoff.md:32) dictates `human_signoff: <name> <date>` UNQUOTED, and that is the dominant real shape: 26 of 29 signed reports in _acceptance/ are unquoted. Verified empirically: for slug premerge-unjudged-pass (signed `human_signoff: Manh Phan 2026-07-29`) the documented regex finds 0 signoff commits — its KPI count of 1 comes solely from the appro

- **sign-batch.mjs regexes scan the WHOLE file, not the leading frontmatter — body text can satisfy/poison the checks, diverging from front_field's explicitly guarded scope**
  file: `scripts/sign-batch.mjs:59`
  severity: medium
  All frontmatter reads in sign-batch (lines 51, 59, 62, 64, 65, 78, 79) are `/^key:.../m` over the entire file, whereas pre-merge-check.sh's front_field (line 295) reads ONLY the leading `---` block, with an explicit comment that 'a body excerpt cannot poison the read'. Concrete fail-open: a bypassed report whose frontmatter `bypass_ack:` is empty but whose body contains a column-0 line `bypass_ack: <name> <date>` (e.g. quoting the release instruction that pre-merge itself prints) passes the line-65 test `/^bypass_ack:[ \t]*[^\s#]/m` and gets signed. Similarly a body line `human_signoff:` (empt

- **sign-batch.mjs default discovery silently drops verified contracts whose status value is quoted**
  file: `scripts/sign-batch.mjs:40`
  severity: low
  Line 40 selects the default batch with `/^status:[ \t]*verified[ \t]*$/m`. front_field strips single/double quotes, so `status: "verified"` is valid and accepted everywhere else in the engine — but sign-batch's default (no --slugs) run silently omits such a record from the batch with no message (other records sign fine, so the omission is invisible; if it were the only record the generic 'không có hồ sơ nào ở trạng thái verified' fires, which misdiagnoses). Same quote-intolerance on line 62 makes `verdict: "PASS"` a wrongful whole-batch rejection (noisy fail-closed, lesser concern). Same diver

- **Hình dạng 3 — assert chuỗi-có-mặt + n≥1 trong khi lời hứa E2 là quan hệ loại-trừ (dòng khoá rỗng máy thêm KHÔNG đếm)**
  file: `tests/plugins/run-tests.sh:9339`
  severity: medium
  evals.yaml E2 hứa KPI 'đếm commit chạm GIÁ-TRỊ human-owned đã điền … dòng khoá rỗng máy thêm KHÔNG đếm'. P186 chỉ đo: (a) nhãn LABEL và regex CMD_RE có mặt trong 2 file (dòng 9329–9330), (b) chạy lệnh rút từ chỉ dẫn trên repo thật rồi assert exit 0 và n>=1 (dòng 9339). Không có vế nào chứng minh quan hệ loại-trừ: không fixture nào có commit-máy chỉ thêm dòng khoá rỗng để assert count KHÔNG tăng, và measure() cũng không kiểm doc có nêu mệnh đề loại-trừ đó. Một pattern -G sai (đếm cả dòng khoá rỗng) vẫn cho n>=1 và xanh y hệt. Mutation 'xoá định nghĩa' mà E2 liệt kê cũng không có case tương ứng 
