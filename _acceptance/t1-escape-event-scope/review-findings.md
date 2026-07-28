## Trong hợp đồng

(none)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

(none)

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **Bước "Mọi verdict" ra lệnh Write report/findings vô điều kiện, nhưng nhánh BLOCKED không trả hai field đó → ghi rỗng lên gói evidence round trước**
  file: `feature-loop/skills/feature-loop/SKILL.md:135`
  severity: high
  detail: Bullet "**Mọi verdict:**" nói: append `result.runLog` TRƯỚC, "rồi Write evidence-report.md = `result.report` và review-findings.md = `result.findings`" — không có mệnh đề bảo vệ nào. Hai bullet lân cận thì CÓ: nhánh PASS/PENDING kiểm "`result.report` có nội dung", nhánh REJECT ghi "nếu có nội dung". Nhưng `acceptance-verify.js` có hai đường thoát sớm BLOCKED (dòng 55: args sai shape; dòng 300: không có gì FRESH để verify) và cả hai trả về object KHÔNG có `report`, `findings`, `runLog`. Main loop đọc SKILL theo đúng chữ trên BLOCKED sẽ Write nội dung undefined/rỗng lên `_acceptance/<slug>/evidence-report.md` và `review-findings.md`. Hậu quả không phải cosmetic: BLOCKED được chỉ dẫn "chạy lại CÙNG round", nhưng `round` lại suy từ "có `evidence-report.md` rồi → đếm số round trong `## Iterations` + 1" — file vừa bị xoá trắng nên round tụt về 1, đúng cái mà chính SKILL cảnh báo ở bullet REJECT ("cap 3 round bị reset và run_id mint trùng"). Sửa: đưa mệnh đề "chỉ ghi khi `result.report`/`result.findings` không rỗng" vào chính bullet "Mọi verdict" (hoặc để hai nhánh BLOCKED trả `report: ''`/`findings: ''` và cấm ghi khi rỗng).
  source: conventions

- **Khuôn out-of-contract cho harness Codex là bản sao thứ hai của seam LLM-viết→máy-đọc, không có round-trip; P56 chỉ ghim 3 chuỗi, không ghim thụt đầu dòng mà reader đòi**
  file: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:469`
  severity: medium
  detail: CLAUDE.md (bất biến "Thước phải gắn vào vật được giao", hình dạng 3): khuôn của seam LLM-viết→máy-đọc phải đặt MỘT chỗ có marker rồi test round-trip rút-từ-writer-đọc-bằng-reader. Diff làm đúng việc đó cho writer Claude (`OOC-ITEM-TEMPLATE` + case P55), nhưng writer Codex là một khuôn thứ hai viết tay trong fenced block, và bộ đo duy nhất gắn vào nó là P56 (run-tests.sh:1123-1129) — grep ba chuỗi `Người dùng thấy gì`, `- **<title>**`, `Đề xuất:`. Reader `lib/out-of-contract.js:34` đòi các dòng key PHẢI thụt vào (`/^\s+(file|severity|Đề xuất|proposal|Người dùng thấy gì)\s*:/`); không grep nào ghim điều kiện này. Đã điền khuôn Codex hiện tại và cho reader thật đọc: parse đúng cả 5 trường; nhưng nếu bỏ hai space thụt đầu dòng (hoặc dán khuôn không thụt vào bản sửa sau), reader trả `findings: []` — khối "Ngoài hợp đồng" biến mất im lặng khỏi thẻ Cổng 2 cho mọi người dùng Codex, trong khi P54/P56 và cả hai suite vẫn XANH. Sửa: thêm case round-trip cho khuôn Codex (rút fenced block từ SKILL.md, điền, cho `lib/out-of-contract.js` đọc, so 5 trường) — hoặc đưa cả hai harness về đọc cùng một file khuôn có marker.
  source: conventions

- **Bước đóng gói Cổng 2 trong SKILL vẫn chỉ dẫn đọc `reportPath` / `findingsPath` — hai field bị chính diff này bỏ; GUIDE.md (ship trong package) còn tả agent scribe đã xoá**
  file: `feature-loop/skills/feature-loop/SKILL.md:151`
  severity: medium
  detail: "`REPORT_SCHEMA` đổi từ `{reportPath, findingsPath}` sang `{report, findings}` (acceptance-verify.js:56-66) và return block chỉ còn `report`/`findings` (dòng 723-725). Nhưng dòng 151 vẫn viết: \"bảng per-eval (đọc từ `reportPath` = evidence-report.md) ... review findings (đọc từ `findingsPath` = review-findings.md)\" — chỉ dẫn trỏ vào field không tồn tại, đúng ở bước đóng gói Cổng 2 nơi người quyết đọc. Cùng lớp: `GUIDE.md:246-250` còn vẽ sequence \"scribe APPEND run-log.jsonl\", \"F->>H: Write evidence-report.md\", \"verdict + reportPath + runLog (+ cảnh báo nếu scribe fail)\" — và GUIDE.md được `scripts/sync-plugin-packages.sh:47-49` rsync vào mirror, tức tài liệu sai này SHIP trong gói acceptance-gate. Hai chỗ này đã nằm trong `_acceptance/s4-scope-triage/review-findings.md` như known-limits đã ký, nên đây là nhắc nợ chứ không phải phát hiện mới — nhưng nợ đang ở trên đường chạy của Cổng 2."
  source: conventions

- **Card Cổng 2: chip "máy đã xong — ký nhanh" và số "Việc chỉ mình bạn quyết được — N việc" đều không tính khối Ngoài-hợp-đồng vừa thêm**
  file: `scripts/gate-card.js:354`
  severity: medium
  detail: "`yourCount = decisions.length + (oos.length ? 1 : 0)` — không cộng `ooc.findings.length`, và `chip` (dòng ~329) vẫn là `verdict === 'PASS' ? 'máy đã xong — ký nhanh'`. Với một round PASS có 3 finding high ngoài hợp đồng + cờ cụm-ngoài-vùng-phủ, thẻ mở đầu bằng \"máy đã xong — ký nhanh\" rồi hiện nhãn \"Việc chỉ mình bạn quyết được — 0/1 việc\" phía DƯỚI một khối 3 quyết định chỉ người làm được. Điều này đi ngược invariant đã khai ngay trong header của chính file (dòng 12-17: \"the card must NEVER make a bad/incomplete state look approvable\"; \"every judgment item a human still owes ... is surfaced\") và ngược lý do khối được đặt lên trước (comment dòng 333-336: \"nếu người duyệt bỏ qua thì không ai bắt lại\"). Khối có count riêng nên không phải sai số học, nhưng hai tín hiệu tóm tắt mà người quyết đọc trước đang hạ thấp lượng việc còn lại của họ."
  source: conventions

- **`.codex-plugin/plugin.json` ở gốc repo bump 1.23.0 nhưng description thiếu ghi chú đợt v1.23 mà 3 manifest còn lại đều có**
  file: `.codex-plugin/plugin.json:4`
  severity: low
  detail: Diff cập nhật description kèm blurb "v1.23 ..." cho `.claude-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json` và `feature-loop/.claude-plugin/plugin.json`, nhưng `.codex-plugin/plugin.json` ở gốc chỉ đổi `version` (1.22.1 → 1.23.0), description dừng ở "v1.22.1 hardening wave". Kiểm bằng máy: `/v1\.23/.test(description)` = false ở manifest gốc, true ở bản `codex/acceptance-gate`. Nếp của repo là mỗi bump ghi một câu "vX.Y adds ..." vào description của TẤT CẢ manifest liên quan (description hai file này đã lệch nhau từ trước nên không có test nào so được).
  source: conventions

- **Malformed out-of-contract items are silently dropped: renderer never uses `present`, so the whole block vanishes with no flag and exit 0**
  file: `scripts/gate-card.js:340`
  severity: high
  detail: "`lib/out-of-contract.js:parseFindings` (line 27, `/^-\s+\*\*(.+?)\*\*\s*$/`) requires the title line to end immediately after the closing `**`; any bullet that drifts (one trailing token, a different bullet char, a missing indent on the `Người dùng thấy gì:` line) yields no `cur`, so the item AND its key/value lines are discarded without a counter. `parse()` computes `present` (line 72) but `gate-card.js` branches only on `ooc.findings.length` (line 340) and `ooc.unclassified` (line 337) — never on `present` — so `{present:true, findings:[]}` renders nothing: no block, no amber flag, no stderr, exit 0. Reproduced: with a valid heading, valid plain/file/severity/Đề xuất lines and one drift bullet, `--extract` returned `{\"present\": true, \"findings\": [], \"unclassified\": false, \"cluster\": null}` and the card HTML contained zero occurrences of 'Ngoài hợp đồng — bạn quyết'. The sibling reader this code claims parity with does the opposite: gap-probe counts `gpDropped` (gate-card.js:199) and raises three distinct amber flags (lines 241-243). P55 only round-trips the pristine template, so it cannot see drift, and the legitimate empty case ('(none)') is indistinguishable from the drift case. Failure scenario: the synthesizer writes one malformed bullet for a real high-severity out-of-contract defect; the Gate 2 card shows a 'máy đã xong — ký nhanh' chip with no out-of-contract block, and the human signs off on a defect the machine deliberately did not fix. Applies identically to plugins/acceptance-gate/lib/out-of-contract.js and plugins/acceptance-gate/scripts/gate-card.js."
  source: bugs

- **'Mọi verdict' instruction unconditionally writes result.report / result.findings — blanks the previous round's evidence on BLOCKED or a dead synthesizer**
  file: `feature-loop/skills/feature-loop/SKILL.md:135`
  severity: medium
  detail: "This diff moved file writing out of the workflow (REPORT_SCHEMA now returns content strings; the synthesize agent is told 'KHONG ghi file nao ca'). SKILL.md:135 is the authoritative step and says, for every verdict: append runLog, then 'Write evidence-report.md = `result.report` và review-findings.md = `result.findings`' — with no emptiness guard. But both early BLOCKED returns (acceptance-verify.js:55 for bad args, :300 for 'nothing to verify') return objects with NO `report`/`findings` keys at all, and the normal return coerces a dead synthesizer to `''`. The PASS/PENDING-JUDGMENT bullet at line 133 does guard ('rỗng → chạy lại S4') and the REJECT bullet at 132 adds 'nếu có nội dung', so the three bullets contradict each other and the unconditional one is the general rule. Failure scenario: a BLOCKED round on a feature that already has round-1..N evidence — the main loop follows line 135, writes an empty/undefined evidence-report.md and review-findings.md, destroying the Iterations history and the findings list; gate-card.js then reads an empty report and renders 'verdict không xác định'."
  source: bugs

- **Unguarded `prov.enforcement_mode` / `prov.bypass_used` deref throws out of the workflow after every other agent has run**
  file: `feature-loop/workflows/acceptance-verify.js:694`
  severity: medium
  detail: "`const prov = await agentT(...)` (line 672, rewritten by this diff) has no `.catch` and no null guard. Three lines below, `verified_commit` IS guarded defensively (`String((prov && prov.verified_commit) || '')`), but the synthesize prompt at line 694 interpolates `${prov.enforcement_mode}` and `${prov.bypass_used}` bare. Every other agent result in this file is treated as possibly-null (`(machineRaw || []).filter(Boolean)`, `(uiRaw || [])`, `triageRaw = await triageOnce().catch(() => null)`). Failure scenario: the provenance agent dies or is skipped and resolves null; the template literal throws TypeError at the very last step, after all machine/ui/judge/refuter/baseline/triage agents have already run. The caller sees a crash instead of a BLOCKED verdict, so `result.runLog`, `result.report` and `result.triaged` never reach the main loop and the entire round's agent spend is lost — and since the workflow no longer writes any file, nothing at all landed on disk."
  source: bugs

- **Coverage-cluster flag is matched by a brittle literal and silently absent for `⚠️`, a bullet prefix, or bold wrapping**
  file: `lib/out-of-contract.js:18`
  severity: medium
  detail: "`CLUSTER_RE = /^⚠\s*Cụm ngoài vùng phủ:\s*(.+)$/` requires a bare U+26A0 at line start followed by whitespace. Verified against the real parser: bare U+26A0 → cluster parsed; '⚠️ …' (U+26A0 U+FE0F, the emoji-presentation form LLMs routinely emit) → null; '- ⚠ …' → null; '**⚠ Cụm ngoài vùng phủ:** …' → null. The writer side is prose only — the Claude prompt (acceptance-verify.js:699) and the Codex SKILL both just ask for the literal line, and P56 only greps that the SKILL *contains* the string; nothing checks the writer's actual output. This flag is the sole card-level signal for 'stop and decide: widen the contract or narrow the scope' (gate-card.js:370). Failure scenario: the synthesizer writes '⚠️ Cụm ngoài vùng phủ: 8/10 …'; the workflow correctly computed `coverageCluster`, review-findings.md shows the warning to a human reading raw markdown, but the Gate 2 card omits the flag entirely — the convergence signal that the whole cluster-detection feature exists to deliver never reaches the decider."
  source: bugs

- **triaged is deduped for the cluster count but not for the fix list or the human-facing bins**
  file: `feature-loop/workflows/acceptance-verify.js:543`
  severity: low
  detail: "`distinctKey`/`dedupe` (lines 576-577) exist precisely because 'hai reviewer cùng thấy một lỗi là chuyện thường, và nó KHÔNG được tự nhân đôi thành cụm', but `triagedDistinct` (line 578) feeds only `outsideCoverage`/`coverageCluster`. `rejectFindings` (line 543) and all three review-findings bins in the synthesize prompt use the raw `triaged`. Failure scenario: the conventions lane and the bugs lane both report the same defect (same file+title, which is exactly the duplicate `distinctKey` was written to collapse). It counts once toward the >=2 cluster threshold, but is printed twice as two separate decision items with two sets of buttons under 'Ngoài hợp đồng — bạn quyết (2)' on the Gate 2 card, and queued twice in the S3 fix list."
  source: bugs

- **Choice-label drift: feature-loop SKILL says 'mở contract mới' while the renderer and both card instructions say 'mở hợp đồng mới'**
  file: `feature-loop/skills/feature-loop/SKILL.md:153`
  severity: low
  detail: "The three Gate-2 choice labels are specified as verbatim across all surfaces. `scripts/gate-card.js:351` emits the button 'mở hợp đồng mới'; `commands/acceptance-card.md:50` and `codex/acceptance-gate/skills/acceptance-card/SKILL.md:53` agree; P52 pins the renderer against `commands/acceptance-card.md` only. The new block at SKILL.md:153 says '(b) **mở contract mới**'. No test reads that file for labels, so the drift is invisible to the suite. Failure scenario: the main loop narrates the Gate-2 package from its own SKILL and offers the human 'mở contract mới' while the rendered card button next to it reads 'mở hợp đồng mới' — two differently-named options for one choice on the same screen."
  source: bugs

⚠ Cụm ngoài vùng phủ: 11/11 lỗi rơi vào file không bộ đo nào phủ (feature-loop/skills/feature-loop/SKILL.md, codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md, scripts/gate-card.js, .codex-plugin/plugin.json, feature-loop/workflows/acceptance-verify.js, lib/out-of-contract.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
