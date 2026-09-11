## Trong hợp đồng

- **The 2.11.0 manifest never tells consumers that the release adds expected_exit, and credits the eval-yaml.cjs change to the resolver fix**
  file: `.claude-plugin/plugin.json`
  severity: medium
  AC: AC-6
  Người dùng thấy gì: The v2.11.0 block of `description` still calls this "a ONE-fix release" and refers to "the `expected_exit` rule shipped the day before". The repo history says otherwise. The 2.10.0 cut is 04069351 (PR #164). Round #165 (`expected_exit` / `expectedExits`, commits 89c7b8db, 5db0c448, 2ac48abd, cf11d920) landed after it, in d1d36479, so it belongs to 2.11.0. No earlier version block of the description mentions `expected_exit` at all. The same block also says "`lib/evidence-core.cjs` and `lib/eval-yaml.cjs` carry the fix". But `git diff --numstat d1d36479...HEAD` shows eval-yaml.cjs, pre-merge-check.sh and recheck-evidence.cjs are unchanged by this round's fix. Their changes (48/1, 1/1, 1/1) all come from #165. Result: the release notes that ship to 7 consuming repos never announce a new evals.yaml field and a new exit-code acceptance rule, and they blame those file changes on the resolver fix. That is the same class as the "manifest declares the wrong mechanism" finding just fixed this round, now on the other half of the release. The re-copy-all-9 conclusion still holds, so the damage is to what the text says, not to the copy list. This round only removed the typed line counts from that sentence; the misattribution and the missing #165 line were already there. Fix direction: add one clause for #165 (the `expected_exit` field and rule, banned codes 97/127) and attribute the eval-yaml.cjs, pre-merge-check.sh and recheck-evidence.cjs diffs to it. Checked and ruled out this round: stripYamlComment `(^|\s)#` (matches eval-yaml `stripComment`); models `(.*)$` (an empty value is now emitted as "" but `sanitizeModels` drops it in both workflows); BG8_MUTANTS=7 written by hand against a guard that can fail; BG4=14 and BG7=20 match the pushes. The bo-giai-nhay suite passes, all 9 legs.

- **Shape 1 + shape 5: path 9 of the AC-4 table (carry-plan `cmd:`) is measured only by grepping source, never by output**
  file: `tests/scripts/bo-giai-nhay.test.mjs:488`
  severity: medium
  AC: AC-12
  Người dùng thấy gì: AC-4 (contract.md:77-90) is a class claim: all nine paths 'trả chuỗi đúng như người viết nó' (return the string as written). Row 9 of DUONG is `['9 carry-plan cmd', CP, 'cur.cmd = R.parseFlowValue(f[1]).value', null, null]`. `cu` is null, so BG8 and BG5 never mutate it. BG4 has no assertion for it. BG9's only fixture uses the plain `cmd: echo ok` (line 411, no quotes or escapes), so carry-plan never reads a quoted cmd. The only measurement of path 9 is BG6(d) at line 305, `src.includes(neo)`: a check that a source string is present, which is shape 1 (measuring the instruction instead of the output). The regex also changed materially in this diff, from `"?([^"\n]+)"?` to `(\S.*)$` + parseFlowValue (carry-plan.mjs:106), and `e.cmd` feeds the `cmd` of carried entries (carry-plan.mjs:165). If path 9 returned a malformed string, every eval would stay green. This is also shape 5: the matrix claims nine paths but has behaviour cells for only 7+1.

- **Shape 3: BG9 declares a relation ('carry-plan and s4-args agree on paths') but runs only one side**
  file: `tests/scripts/bo-giai-nhay.test.mjs:442`
  severity: medium
  AC: AC-10
  Người dùng thấy gì: AC-10 (contract.md:177-179) says s4-args and carry-plan read THE SAME `paths:` line and return THE SAME string. BG9 (lines 404-443) runs only carry-plan.mjs, on the fixture `src/§"E7 — render thật".js`. s4-args is never run on that evals.yaml, and no assertion compares the two outputs. The PASS line at 442 says 'carry-plan va s4-args dong y ve paths (2 chieu tren cung fixture)', but the 'two directions' are carry vs rerun, not two readers. The s4-args side is measured separately in BG4 on a different string (`evidence-report.md §"E7 — render thật"`, line 175). Agreement is therefore inferred transitively across two different inputs, not measured on the same line as the promise requires.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.
- **Shape 6: BG5/BG8 red directions run on HEAD's copy of the code under test, and the guard hashes only the test file**
  Người dùng thấy gì: Nếu ai đó sửa mã lõi xử lý cấu hình nhưng chưa lưu (commit) thay đổi đó, bài kiểm tra nội bộ có thể vẫn báo "đạt" vì nó âm thầm so sánh với bản mã cũ đã lưu trước đó, không phải bản vừa sửa — kết quả "đạt" trong trường hợp đó không đáng tin.
  file: `tests/scripts/bo-giai-nhay.test.mjs:506`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: rang-moc.sh concludes 'diagram-design unchanged' from an empty diff, but the positive control never exercises the pathspec being measured**
  Người dùng thấy gì: Phép kiểm "thư mục diagram-design không đổi" có thể báo đạt ngay cả khi có lỗi đánh máy trong đường dẫn nó đang kiểm tra, vì phép kiểm chưa từng thử với một thay đổi thật trong đúng thư mục đó để chắc chắn nó có thể phát hiện ra thay đổi.
  file: `_acceptance/release-2-11-0/rang-moc.sh:80`
  severity: medium
  Đề xuất: known-limits

- **Shape 2 (partial round-trip): BG3 takes the string from the real writer but simulates the reader with a hand-written comparison**
  Người dùng thấy gì: Phép kiểm chuỗi lỗi bốn bước chỉ xác nhận hai bước cuối bằng một bản mô phỏng riêng của bài kiểm tra, không chạy qua đúng bộ máy thật dùng khi vận hành — nếu bộ máy thật có thêm một lỗi tương tự ở bước đó, bài kiểm tra này sẽ không phát hiện ra (giới hạn này đã được ghi nhận sẵn trong hồ sơ, có bài kiểm khác làm lưới dự phòng).
  file: `tests/scripts/bo-giai-nhay.test.mjs:160`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).