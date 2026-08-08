## Trong hợp đồng

### acceptance-report Print section still mandates the abolished minutes-vs-baseline ≥50% KPI, contradicting the same file's 2.0.0 charter rules
- file: `commands/acceptance-report.md:60`
- severity: high
- source: conventions
- AC: AC-2

The file's header (lines 8-13) states the 2.0.0 charter: time_human_minutes is self-reported/untrusted, 'never cite it as efficiency evidence, never flag its absence as a hygiene gap', and the KPI is human-touch frequency from git (computed in step 2, line 35). But step 4 'Print' (lines 59-65) was never swept: the Headline still orders 'median + mean total minutes ... baseline median from baseline_minutes (empty → "chưa ghi mốc so sánh ... điền vào cấu hình nghiệm thu, khoá baseline_minutes") ... % reduction vs the ≥50% target → ĐẠT / CHƯA ĐẠT'. That (a) presents untrusted minutes as the headline efficiency verdict without the required 'tự khai — không đáng tin' label, (b) flags missing baseline_minutes as something to go fill — exactly what lines 78-80 of the same file forbid, and (c) the new human-touch count computed in step 2 never appears anywhere in the Print spec (table columns are still 'G1 min | G2 min'). Identical stale block in the Codex twin codex/acceptance-gate/skills/acceptance-report/SKILL.md:58-63 and its mirror plugins/acceptance-gate/skills/acceptance-report/SKILL.md:58-63. This is the same incomplete-layer-sweep class as ledger entry tai-lap-ceremony-diet#3 (GUIDE/QUICKSTART/README minutes sweep, closed_by 30312af) — the sweep missed the report command's own output spec, and eval P186 cannot catch it because it only asserts the label and the git command EXIST somewhere in the file, not that the Print instructions stopped using the old KPI (CLAUDE.md: 'sửa phải theo LỚP' / 'thước phải gắn vào vật được giao').

Rationale: AC-2 requires old minutes data be labeled 'tự khai — không đáng tin' and the printed human-side KPI be git-derived event frequency; the Print section of this same file still headlines the old minutes-vs-50% KPI unlabeled and never surfaces the new KPI, directly failing that requirement.


## Ngoài hợp đồng — người quyết ở Gate 2

- **All 7 plugin manifests still advertise the deleted sign-batch.mjs in their v2.0 description**
  file: `.claude-plugin/plugin.json:4`
  severity: medium
  Commit ff345f1 executed the pre-declared descope of 1b: scripts/sign-batch.mjs and its mirror were deleted, AC-3 descoped, CHANGELOG.md:9 explicitly says 'Món ký gộp một lệnh (sign-batch) RÚT khỏi bản này'. But the v2.0 sentence in the description field of all 7 manifests (source .claude-plugin/plugin.json, .codex-plugin/plugin.json, codex/acceptance-gate/.codex-plugin/plugin.json, feature-loop/.claude-plugin/plugin.json, codex/feature-loop-codex/.codex-plugin/plugin.json, plus both plugins/ mirrors) still claims 'sign-batch.mjs signs a whole batch with ONE human-run commit' — a current-state 

- **Human-touch KPI pickaxe omits bypass_ack, undercounting a documented human-owned gate event — same undercount class as ledger #17**
  file: `commands/acceptance-report.md:35`
  severity: medium
  The standard KPI command `git log --format=%H -G'human_signoff: ["A-Za-z]|human_override: ["A-Za-z]|approved_by: [A-Za-z]' -- _acceptance/<slug>/` defines the KPI as commits touching human-owned lines, but the kit's own enumeration of human-owned lines includes bypass_ack: commands/signoff.md step 7 ('human_signoff, human_override, the verdict upgrade, bypass_ack') and QUICKSTART.md describes bypass_ack as a standalone human responsibility act that can land outside the signoff commit (a person acking a bypass to unblock CI). A commit that only fills bypass_ack matches none of the three alterna

- **KPI pickaxe regex misses quoted approved_by — Gate-1 events silently uncounted**
  file: `commands/acceptance-report.md:35`
  severity: medium
  The human-touch KPI command shipped in this diff is `git log --format=%H -G'human_signoff: ["A-Za-z]|human_override: ["A-Za-z]|approved_by: [A-Za-z]' -- _acceptance/<slug>/`. The r4 undercount fix (ff345f1, 'regex pickaxe nhận cả chữ ký không-nháy') added the `"` alternative to the human_signoff and human_override character classes but NOT to approved_by, which still only accepts an unquoted letter. Reproduced live: in a scratch repo, a commit writing `approved_by: "Manh Phan"` (valid YAML; the write-time hook via lib/evidence-core.js:457 only requires non-empty, so quoted values pass) yields 

- **KPI pickaxe counts line REMOVALS as human-touch events**
  file: `commands/acceptance-report.md:35`
  severity: low
  git log -G selects commits whose diff has an added OR removed line matching the regex. A machine-authored commit that deletes or resets a previously-filled human-owned line — e.g. an S4 report regeneration after a Gate-2 round wiping filled `human_override: <name> <date>` items, or a revert of a signature commit — is counted as a human-touch event, inflating the KPI. The -G semantics are certain; frequency depends on workflow (no current _acceptance record exhibits it, so flagged low). Applies equally to the codex twin skill and both mirror copies. If precision matters, the instruction could t

- **Hình dạng 3 — assert needle toàn-file trong khi lời hứa là 'món nằm TRONG mục 2.0.0' (P188)**
  file: `tests/plugins/run-tests.sh:9373`
  severity: medium
  AC-4/E4 hứa 'tồn tại mục 2.0.0 ... ĐỦ 3 món'. measure(t) kiểm '## 2.0.0' in t rồi kiểm từng needle ('Bỏ điền phút', 'Re-pin theo release', 'RÚT khỏi bản này', GUARD 'chuẩn bằng chứng giữ nguyên') trên TOÀN VĂN CHANGELOG.md, không cắt riêng section 2.0.0. Quan hệ món∈mục-2.0.0 không được đo. Kịch bản đỏ-mà-vẫn-xanh cụ thể và đã được lên lịch: chính CHANGELOG khai 1b sign-batch sẽ 'làm lại ở 2.1' — khi mục 2.1.0 được thêm lên đầu file và nhắc lại bất kỳ needle nào (rất dễ với 'Re-pin theo release' hay 'chuẩn bằng chứng giữ nguyên'), việc món đó bị xoá khỏi mục 2.0.0 sẽ không làm test đỏ. Mutant 

- **Hình dạng 5 — tuyên bảng KHUÔN-CẤM 8 mẫu nhưng mutation chỉ chứng minh 2 mẫu biết đỏ, 6 mẫu chưa bao giờ được chứng minh sống (P185)**
  file: `tests/plugins/run-tests.sh:9292`
  severity: low
  Ma trận mutant có assert đếm cho chiều FILE (hit == len(FILES) == 9, đúng mẫu P105) nhưng chiều MẪU-CẤM không có ma trận: cả 9 lượt đều tiêm cùng MỘT chuỗi cố định 'Ask how many minutes Gate 1 took → `time_human_minutes.gate1`' (dòng 9292). Chuỗi này chỉ khớp 2/8 phần tử FORBIDDEN ('Ask how many minutes', 'how many minutes'); nó KHÔNG khớp 'minutes → `time_human_minutes' (văn tiêm là 'took → `time_...'), không khớp 'time_human_minutes: {gate1' (văn tiêm dùng '.gate1'), và không đụng 'hỏi user số phút', 'minutes spent →', 'provide `time_human_minutes.gate2`', 'chưa ghi số phút của người'. 6 mẫu
