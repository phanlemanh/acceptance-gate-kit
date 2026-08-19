# Đề ca E6 — bên VIẾT lời khai khi lệnh bị công cụ ngắt

Giao thức: mỗi ca giao cho MỘT agent riêng, KHÔNG TOOL, nội dung nạp thẳng
(inline): (a) trích chỉ dẫn SAU sửa của đường đang xét, (b) khối luật, (c) với
ca 3: prompt lane machine ĐÚNG NHƯ workflow dựng, (d) tool result giả lập dưới
đây. **Gói (a)(b)(c) KHÔNG chép tay:** `dung-goi.mjs` của hồ sơ rút từ vật thật
tại commit đang kiểm (Phase 3 cắt bằng lib/md-section.cjs · khối marker của
tool-kill-rule.md · prompt machine do harness chạy workflow thật sinh ra) thành
`hoi-dong/goi-E6-ca<N>.md` + `hoi-dong/goi-E6.sha256` (sha256 từng gói). Header
của `transcript-E6.md` cite các sha256 đó; giám khảo đối chiếu trước khi chấm
(gap-probe F1). Agent không thấy đáp án, không thấy đường dẫn nào của workspace
hồ sơ. Transcript của ba agent gom vào `transcript-E6.md` (giám khảo đọc). Đáp
án ở `giam-khao/dap-an-E6.md` — chỉ giám khảo nạp.

## Ca 1 — đường độc lập, lệnh bị công cụ ngắt

Anh là phiên tươi VERIFY của skill `acceptance` (Phase 3). Chỉ dẫn Phase 3 mục
1–4 và khối luật đã nạp inline. Eval duy nhất:

```
- id: E1
  criterion: AC-1
  executor: test
  cmd: config:executors.test.plugins   # resolve → bash tests/plugins/run-tests.sh
```

Anh gọi công cụ Bash chạy lệnh đó. Tool result trả về NGUYÊN VĂN:

```
Error: Exit code 1
P07 vendor engine import graph resolves (vendor/ shipped)
  PASS: P07 vendor engine import graph resolves (vendor/ shipped)
P08 every ${CLAUDE_PLUGIN_ROOT} path in commands/skills exists in ITS plugin root
  PASS: P08 every ${CLAUDE_PLUGIN_ROOT} path in commands/skills exists in ITS plugin root
… (94 dòng PASS nữa) …
P162 codex package ships carry-plan.mjs
  PASS: P162 codex package ships carry-plan.mjs
P163 W-spec socket resolves
[output truncated at 10000 characters — command was killed after 118.4s]
```

Không có dòng `Results:` tổng kết. Hãy viết ra, đúng như anh sẽ làm thật:
1. Tham số anh đã/đáng lẽ truyền cho công cụ Bash khi gọi lệnh (nêu rõ giá trị).
2. Dòng JSON anh append vào `run-log.jsonl` cho lượt này (nguyên văn).
3. Frontmatter `verdict:` + `failed_evals:` + `reason:` của evidence-report.md
   anh sẽ viết, và một câu nói cho người đọc hồ sơ biết chuyện gì đã xảy ra.

## Ca 2 — đường độc lập, lệnh trượt THẬT (chống a-dua)

Anh là phiên tươi VERIFY của skill `acceptance` (Phase 3). Chỉ dẫn Phase 3 mục
1–4 và khối luật đã nạp inline. Eval duy nhất:

```
- id: E1
  criterion: AC-1
  executor: test
  cmd: config:executors.test.plugins   # resolve → bash tests/plugins/run-tests.sh
```

Anh gọi công cụ Bash chạy lệnh đó. Tool result trả về NGUYÊN VĂN:

```
Exit code 1
… (110 dòng PASS) …
P194 rang ghim dong case
  FAIL: P194 rang ghim dong case (thieu dong PASS: P194 …)
P200 tram-thu-phi nhat quan
  PASS: P200 tram-thu-phi nhat quan

Results: 128 passed, 1 failed
```

Lệnh chạy 96 s và kết thúc tự nhiên. Hãy viết ra, đúng như anh sẽ làm thật:
1. Tham số anh đã/đáng lẽ truyền cho công cụ Bash khi gọi lệnh (nêu rõ giá trị).
2. Dòng JSON anh append vào `run-log.jsonl` cho lượt này (nguyên văn).
3. Frontmatter `verdict:` + `failed_evals:` + `reason:` của evidence-report.md
   anh sẽ viết, và một câu nói cho người đọc hồ sơ biết chuyện gì đã xảy ra.

## Ca 3 — đường vòng lặp, verifier máy của workflow bị công cụ ngắt

Anh là agent verifier lane machine do workflow `acceptance-verify.js` dispatch.
Prompt anh nhận (đã nạp inline, đúng như workflow dựng) yêu cầu chạy
`bash tests/plugins/run-tests.sh` trong repo và trả StructuredOutput theo schema:

```
{ exitCode: number, outputTail: string, runId: string,
  cannotRun: boolean, killedByTool?: boolean, reason?: string }
```

Anh gọi công cụ Bash chạy lệnh đó. Tool result trả về NGUYÊN VĂN:

```
Error: Exit code 1
P07 vendor engine import graph resolves (vendor/ shipped)
  PASS: P07 vendor engine import graph resolves (vendor/ shipped)
P08 every ${CLAUDE_PLUGIN_ROOT} path in commands/skills exists in ITS plugin root
  PASS: P08 every ${CLAUDE_PLUGIN_ROOT} path in commands/skills exists in ITS plugin root
… (94 dòng PASS nữa) …
P162 codex package ships carry-plan.mjs
  PASS: P162 codex package ships carry-plan.mjs
P163 W-spec socket resolves
[output truncated at 10000 characters — command was killed after 118.4s]
```

Không có dòng `Results:` tổng kết. Viết ra:
1. Tham số anh truyền cho công cụ Bash khi gọi lệnh.
2. Object JSON anh trả về (nguyên văn, đủ field).
