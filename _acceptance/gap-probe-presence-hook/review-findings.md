# Review Findings: gap-probe-presence-hook (round 3)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2.

Đây là round 3 — GHI ĐÈ danh sách round 2 (9 finding: 2 high/5 medium/2 low).
5/9 finding round 2 đã sửa xong (+ descope N3 được cho dấu vết) tại git commit
`9447c6a` ("fix(s3-r3): 5 finding của S4 round 2 + descope N3 có dấu vết")
trước khi round này bắt đầu; lịch sử round 1/round 2 xem tại commit `a2947d5`
và section `## Iterations` của `evidence-report.md`. Round 3 chạy
adversarial-verify LẠI trên diff sau fix (bao gồm case mới `t76` thêm ở commit
`987fd83`) và tìm ra 9 finding MỚI dưới đây — tách biệt hoàn toàn với 9
finding round 2 (không finding nào trong 9 cái này trùng lại danh sách round
2, kể cả 4 finding round 2 chưa được sửa).

9/9 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần theo đúng thứ tự nhận
từ review pass. Hai cặp finding trùng vị trí code
(`hooks/acceptance-evidence-gate.js` mục 1 và 5; `lib/evidence-core.js:46x`
mục 2/3/4 và mục 9) đến từ các lens review khác nhau (`conventions` vs
`bugs`) và được giữ NGUYÊN VẸN như các finding riêng biệt — không gộp, không
viết lại — vì mỗi finding nêu một khía cạnh/tái hiện thực nghiệm riêng của
cùng một vùng code (mục 5 là bản dịch/tái xác nhận độc lập của mục 1 do lens
`bugs` chạy sau lens `conventions`; mục 2, 3, 4 mỗi mục soi một trục lỗi khác
nhau quanh cùng biến `risk_tier`).

## High severity (2)

### 1. The whole "nhắc" half of the guard (AC-3/AC-5/AC-7) rides a channel the PreToolUse contract discards: stderr + exit 0

- title: The whole "nhắc" half of the guard (AC-3/AC-5/AC-7) rides a channel the PreToolUse contract discards: stderr + exit 0
  file: /Users/manhphan/dev/acceptance-gate-kit/hooks/acceptance-evidence-gate.js
  line: 156
  severity: high
  source: conventions
  detail: The new NOTE channel does `process.stderr.write(...)` and then always falls through to `process.exit(0)` (line 162 on the pass path, or the block/warn paths below). Under the Claude Code hook contract, exit 0 surfaces only stdout (transcript mode); stderr is fed back to the model only on exit 2 and shown to the user only on other non-zero exits. So the NOTE — whose entire payload is the remediation ("Chạy bước S1#7 … HOẶC ghi vào decisions.jsonl một entry descope") — reaches neither the acting agent nor the human in a normal session. NOTE is the ONLY signal for three of this feature's criteria: T2 missing gap-probe, legacy contracts with no marker, and verdict `probe-failed`. The evidence file `_acceptance/gap-probe-presence-hook/evidence/hook-messages.txt` shows the text only because `tests/hooks/run-tests.sh` captures it with `2>"$GPD/$1.err"`; every T6x assertion greps that captured file, so the suite cannot distinguish "user sees it" from "nobody sees it". The pre-existing `enforcement: warn` path has the same shape, so the diff inherits the convention rather than inventing it — but it is the first time a feature's advisory half depends on it end-to-end. This is item #7 of the diff's own `_acceptance/gap-probe-presence-hook/review-findings.md`, shipped with no fix, no ledger `descope`, and no README known-limitation entry (unlike N3, which got d-20260726T160000Z-113). Fix shape used elsewhere for advisory output: exit 1 (stderr is shown, execution continues) or emit PreToolUse JSON on stdout.

### 2. Hạ risk_tier trong chính lần ghi tiến cổng tháo sạch guard, KHÔNG dấu vết (lỗ song sinh của lỗ marker vừa được vá)

- title: Hạ risk_tier trong chính lần ghi tiến cổng tháo sạch guard, KHÔNG dấu vết (lỗ song sinh của lỗ marker vừa được vá)
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 463
  severity: high
  source: bugs
  detail: |
    `const tier = (frontmatterField(newPayload, 'risk_tier') || '').toUpperCase()` đọc tier CHỈ từ payload sau-ghi. Diff này vừa vá đúng lớp lỗi đó cho `gap_probe_expected` (dòng 490 `markerBefore`, test T76, commit 987fd83, lý do ghi rõ trong comment: 'chính lần ghi tiến cổng có thể xoá dòng marker để tự tháo răng, không dấu vết') nhưng bỏ sót `risk_tier`, vốn là điều kiện CỔNG NGOÀI của guard — hạ tier thì guard không chạy chút nào, kể cả nhánh NOTE ghi vết.

    Tái hiện trên hook đã ship (cả Write lẫn Edit):
    - disk: `risk_tier: T3`, `gap_probe_expected: true`, `status: draft`; không có gap-probe.md, không có decisions.jsonl.
    - (A) ghi `status: approved` GIỮ `risk_tier: T3` → exit 2, chặn đúng.
    - (B) payload y hệt nhưng đổi 1 dòng `risk_tier: T3` → `T1` → **exit 0, stderr RỖNG**.
    - (C) payload y hệt nhưng XOÁ hẳn dòng `risk_tier` → **exit 0, stderr RỖNG**.
    - (D) dạng Edit (old_string chứa cả `risk_tier` + `status`, new_string hạ tier + approve) → **exit 0, stderr RỖNG**.

    So với case marker: xoá `gap_probe_expected` vẫn CHẶN + in NOTE 'TỪNG KHAI ... đã gỡ marker đi'. Hạ tier thì im lặng tuyệt đối — trái hẳn luật bất thành văn mà comment dòng 484-491 tự nêu ('mọi lối thoát khác của kit đều để lại vết').

    Sức công phá lớn hơn riêng gap-probe: `risk_tier` là khoá lọc của backstop merge-boundary (`scripts/pre-merge-check.sh:170` — `case "$REQUIRED_FOR" in *"$tier"* ) ;; *) continue`, mặc định `REQUIRED_FOR="T2 T3"`) và của luật T3-judgment (`lib/evidence-core.js:357`). Một dòng sửa duy nhất, trong đúng lần ghi mà cổng tồn tại để soi, tắt cùng lúc cả ba răng — và vì luật gap-probe không có lớp CI (đã descope ở d-20260726T160000Z-113) nên không còn tầng nào bắt lại.

    Không test nào phủ: `mk_gp` trong tests/hooks/run-tests.sh luôn ghi cùng một tier cho cả disk lẫn payload, nên trục 'tier đổi giữa oldPayload và newPayload' chưa từng được chạy.

    Hình dạng fix ăn khớp với fix marker đã có: so `frontmatterField(oldPayload,'risk_tier')` với bản mới; nếu tier tụt (T3→T2/T1/vắng) trong đúng bước tiến cổng thì áp tier CAO HƠN (hoặc chí ít push một note ghi vết như nhánh `markerBefore && !markerNow`).

## Medium severity (3)

### 3. risk_tier escalation after the Gate-1 crossing permanently disarms the gap-probe guard, silently and with no second layer

- title: risk_tier escalation after the Gate-1 crossing permanently disarms the gap-probe guard, silently and with no second layer
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 464
  severity: medium
  source: conventions
  detail: The guard is keyed on the transition — `ADVANCED.test(status) && !ADVANCED.test(oldStatus || '') && (tier === 'T2' || tier === 'T3')` — and `tier` is read from the new payload at that one moment. Once a contract sits at any ADVANCED status the guard never runs again, so a contract that crosses Gate 1 while `risk_tier` is T1 (or absent) and is escalated afterwards is never re-evaluated. Reproduced against the shipped hook: contract on disk `risk_tier: T1, status: approved`; a Write changing only `risk_tier: T1 -> T3` with `gap_probe_expected: true`, no `gap-probe.md`, no descope entry -> exit 0 with completely empty stderr — no block, no NOTE. Post-Gate-1 tier bumps are a real path in this very repo: `_acceptance/gap-probe-presence-hook/decisions.jsonl` entry d-20260726T090100Z-105 records "risk_tier T2 lên T3". There is no backstop to catch it (see finding #4), so the escalated T3 contract merges with zero signal. The transition-keyed design was a deliberate fix for round-1 F2/F6, but the hole it opens is unguarded, untested, and undocumented (review-findings.md #6 round 2 shipped unresolved and unledgered — carried into round 3 unfixed).

### 4. Guard bám bước-tiến nên leo tier SAU khi qua Cổng 1 không bao giờ được xét lại — im lặng hoàn toàn

- title: Guard bám bước-tiến nên leo tier SAU khi qua Cổng 1 không bao giờ được xét lại — im lặng hoàn toàn
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 462
  severity: medium
  source: bugs
  detail: |
    Điều kiện `ADVANCED.test(status) && !ADVANCED.test(oldStatus || '') && (tier === 'T2' || tier === 'T3')` chỉ đánh giá đúng MỘT khoảnh khắc chuyển trạng thái. Contract qua Cổng 1 lúc còn T1 (hoặc chưa khai risk_tier) rồi mới leo lên T3 sau đó thì guard không chạy lần nào nữa.

    Tái hiện: disk `risk_tier: T1, status: approved, approved_by: X`; ghi đổi đúng một dòng `risk_tier: T1` → `T3` kèm `gap_probe_expected: true`, không gap-probe.md, không descope → **exit 0, stderr rỗng**. Không chặn, không NOTE.

    Đây là đường đi có thật trong chính repo này: ledger `_acceptance/gap-probe-presence-hook/decisions.jsonl` có entry `d-20260726T090100Z-105` ghi 'risk_tier T2 lên T3' xảy ra sau `stage: gate1`. Và không có lớp thứ hai: `evaluateContractWrite` chỉ được gọi từ 2 bản sao hook, `grep -n 'gap-probe\|gap_probe' scripts/pre-merge-check.sh` không ra gì.

    Đổi sang bám-bước-tiến là chủ ý (d-20260726T140000Z-110, để chữa F2/F6 vòng 1) nên đừng quay lại bám-trạng-thái; nhưng lỗ leo tier cần một điều kiện phụ riêng: khi `oldStatus` đã ADVANCED mà tier tăng T1/vắng → T2/T3, xét lại guard (chí ít là NOTE). Finding này đã nằm ở review-findings.md #6 round 2 và vẫn chưa được vá — tôi kiểm chứng lại chứ không chép.

### 5. Kênh NOTE ghi stderr rồi exit 0 — nửa "nhắc" của tính năng (AC-3/AC-5/AC-7) nhiều khả năng không tới được ai

- title: Kênh NOTE ghi stderr rồi exit 0 — nửa "nhắc" của tính năng (AC-3/AC-5/AC-7) nhiều khả năng không tới được ai
  file: /Users/manhphan/dev/acceptance-gate-kit/hooks/acceptance-evidence-gate.js
  line: 157
  severity: medium
  source: bugs
  detail: |
    `process.stderr.write('\nNOTE from acceptance-evidence-gate ...')` rồi luôn luôn rơi xuống `process.exit(0)`. Trong hợp đồng hook của Claude Code, exit 0 chỉ surface stdout (và chỉ ở transcript mode); stderr được nạp ngược cho agent ở exit 2, và hiện cho user ở các mã khác 0. Nên NOTE — vốn là tín hiệu DUY NHẤT của 3 ca nghiệm thu: T2 thiếu gap-probe (AC-3), workspace legacy không có marker (AC-7), verdict probe-failed (AC-5) — không tới agent lẫn user trong phiên bình thường.

    Tái hiện: T2 + marker + thiếu gap-probe → exit 0, NOTE nằm gọn trong stderr. `_acceptance/gap-probe-presence-hook/evidence/hook-messages.txt` đọc được text chỉ vì harness bắt bằng `2>file`.

    Lưu ý cân bằng: nhánh `enforcement: warn` sẵn có cũng đúng hình dạng này (stderr + exit 0), nên đây là convention diff KẾ THỪA chứ không phát minh — nhưng diff làm cho toàn bộ nửa 'nhắc, không chặn' phụ thuộc vào nó. Nếu nhóm đã xác nhận stderr-exit-0 có hiển thị trong setup của mình thì finding này rụng; nếu chưa, cần một lần kiểm chứng thực tế (không phải qua test harness) trước khi tính AC-3/5/7 là xanh. Hình dạng fix: exit 1 cho output khuyến cáo, hoặc phát NOTE qua stdout dạng PreToolUse JSON `hookSpecificOutput`.

## Low severity (4)

### 6. Hook and Gate-1 card disagree on "gap-probe.md present but verdict unreadable + descope entry" — the exact two-signal conflict AC-4's parity rule exists to prevent

- title: Hook and Gate-1 card disagree on "gap-probe.md present but verdict unreadable + descope entry" — the exact two-signal conflict AC-4's parity rule exists to prevent
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 470
  severity: low
  source: conventions
  detail: The parity work in this diff aligned only the descope regex (`/^\s*bỏ gap-probe/i` in both `scripts/gate-card.js:203` and `lib/evidence-core.js:428`), but the two sides classify presence differently: the hook folds "file exists, verdict unrecognised" into `'missing'` and then consults the ledger, while the card keeps `gpPresent = !!probeT.trim()` and therefore never reaches its descope branch (gate-card.js:235 is `if (!gpPresent && gpDescope)`). Reproduced on one workspace (gap-probe.md with `verdict: rác` + a valid `{"type":"descope","decision":"bỏ gap-probe — nhỏ"}` entry, T3 + marker, draft -> approved): the hook exits 0 and prints the reassuring NOTE "Phản biện context sạch đã được BỎ có chủ đích theo ledger d-1 — … không phải sơ suất", while `gate-card.js` on the same directory raises the yellow flag "gap-probe.md không đọc được (verdict lạ/thiếu: \"rác\") — coi như CHƯA có phản biện". Two Gate-1 signals contradict each other on the same artifact, which is precisely what the new comment at gate-card.js:199-202 says must never happen.

### 7. Block/NOTE message tells the user to write a ledger entry that violates the documented decisions.jsonl schema

- title: Block/NOTE message tells the user to write a ledger entry that violates the documented decisions.jsonl schema
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 495
  severity: low
  source: bugs
  detail: The `how` string instructs: `ghi vào decisions.jsonl một entry {"type":"descope","decision":"bỏ gap-probe — <lý do>"}`. The ledger schema of record (`feature-loop/skills/feature-loop/SKILL.md:31`) requires `id` (`d-<UTC>-<rand>`), `type`, `stage`, `at`, `decision`, `impact`, and S1#7 (line 87) additionally mandates the impact text "đổi lại không có phản biện context sạch trước duyệt" for exactly this AUTO-DRAFT descope. A user who follows the hook's instruction literally produces a non-conforming entry — the card then renders it through the `gpDescope.id || 'entry descope'` fallback and the hook reports it as "(entry không có id)", i.e. an escape hatch whose audit trail has no id, no timestamp and no trade-off. Same string is mirrored at plugins/acceptance-gate/lib/evidence-core.js:495. Related doc drift in the same diff: the new GUIDE.md:673 row states the rule as "Contract T3 có `gap_probe_expected: true` … TIẾN QUA Cổng 1", but the shipped rule also blocks when the marker exists only in the pre-write file and the advancing write deletes it (the `markerBefore && !markerNow` path, test T76) — a case the table's condition does not cover.

### 8. Dòng ledger hỏng bị nuốt im lặng — descope viết sai JSON biến thành 'không có entry descope' và chặn oan, không hề nhắc ledger hỏng

- title: Dòng ledger hỏng bị nuốt im lặng — descope viết sai JSON biến thành 'không có entry descope' và chặn oan, không hề nhắc ledger hỏng
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 427
  severity: low
  source: bugs
  detail: |
    `try { e = JSON.parse(s); } catch (_) { continue; }` bỏ qua dòng hỏng và không đếm, không báo. Comment nói chủ ý ('một dòng lỗi không được biến thành chặn cổng') nhưng hệ quả thực tế ngược lại ở đúng ca quan trọng: nếu chính dòng descope 'bỏ gap-probe' bị hỏng JSON (thiếu dấu ngoặc, dán lẫn dòng), `findGapProbeDescope` trả null và contract T3 bị CHẶN với thông điệp 'ledger không có entry descope "bỏ gap-probe"' — bảo người dùng thêm cái họ vừa thêm rồi.

    Đối chiếu: `scripts/gate-card.js` có `ledger.broken` và phất cờ '⚠ N dòng ledger hỏng, đã bỏ qua.' Hook thì không có kênh tương đương, nên thẻ và hook nói hai chuyện khác nhau về cùng một file — đúng loại bất đồng mà thay đổi regex descope ở gate-card.js:199 vừa được thực hiện để tránh.

    Đề xuất rẻ: đếm số dòng hỏng và nối vào thông điệp block/NOTE ('… (ledger có N dòng hỏng, đã bỏ qua — kiểm tra decisions.jsonl)').

### 9. Cùng field risk_tier, hai parser khác nhau trong cùng một file

- title: Cùng field risk_tier, hai parser khác nhau trong cùng một file
  file: /Users/manhphan/dev/acceptance-gate-kit/lib/evidence-core.js
  line: 463
  severity: low
  source: bugs
  detail: |
    Guard gap-probe mới đọc tier bằng `frontmatterField(newPayload, 'risk_tier')` — chỉ khối `---` mở đầu, khớp `fm_field` của pre-merge-check.sh. Nhưng luật T3-judgment ở dòng 357 trong chính file này đọc bằng regex toàn-file `/^risk_tier\s*[:=]\s*["']?(T[123])["']?\s*(#.*)?$/mi`, không neo frontmatter.

    Hệ quả: một contract có `risk_tier: T3` nằm trong THÂN bài (ví dụ trích log, bảng, đoạn dán lại) mà frontmatter không khai → dòng 357 coi là T3 (siết judgment) còn guard gap-probe coi như không khai tier (im lặng hoàn toàn, kể cả NOTE). Ngược lại nếu frontmatter T3 nhưng thân có `risk_tier: T1` xuất hiện trước thì dòng 357 lấy nhầm bản trong thân.

    `frontmatterField` là bản đúng (comment của nó nêu rõ 'a body excerpt (pasted log) cannot poison the read'); diff này chọn đúng, nhưng để dòng 357 lệch lại. Không phải lỗi diff gây ra, mà là lệch nay đã hiện hình vì hai luật cùng chi phối một field.

## Chưa adversarial-verify (refuter chết)

none — cả 9 finding round 3 đều đã qua adversarial-verify thành công (không
có finding nào gắn `unverified: true`).
