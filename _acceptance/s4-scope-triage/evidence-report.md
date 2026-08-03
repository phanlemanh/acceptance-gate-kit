---
schema_version: 2
feature_slug: s4-scope-triage
verdict: PASS
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict   # the `enforcement` value from _acceptance/config.yaml (default strict). CI pre-merge BLOCKS off; warn only warns.
bypass_used: false              # true iff ACCEPTANCE_GATE_BYPASS=1 at verify. CI pre-merge BLOCKS true unless a human records bypass_ack.
verified_commit: 62444dfd5f6ce79836034b2695bc69f87425495d
# bypass_ack:              # OPTIONAL "<name> <ISO date>" — a human consciously releasing a bypassed PASS (audit trail)
human_signoff: Manh Phan 2026-07-28
---

# Evidence Report: s4-scope-triage

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | judgment | PASS |
| E12 | AC-11 | script | PASS |
| E13 | AC-12 | script | PASS |
| E14 | AC-13 | script | PASS |
| E15 | AC-14 | script | PASS |
| E16 | AC-15 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-s4-scope-triage-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E2
  run_id: minted-s4-scope-triage-E2-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E3
  run_id: minted-s4-scope-triage-E3-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E4
  run_id: minted-s4-scope-triage-E4-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E5
  run_id: minted-s4-scope-triage-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E6
  run_id: minted-s4-scope-triage-E6-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E7
  run_id: minted-s4-scope-triage-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E8
  run_id: minted-s4-scope-triage-E8-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-s4-scope-triage-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-s4-scope-triage-E10-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — Khối thẻ (dòng 7-19) dùng ngôn ngữ business thuần: nêu rõ "lỗi... là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — máy cố ý không tự sửa", mỗi finding mô tả hậu quả thực tế (mất tiện ích khi mạng hỏng, bị nhận nhầm là dời chỗ) không có code, biến, stack trace hay thuật ngữ lập trình nào lọt vào. Ba lựa chọn "ghi Known limits / mở hợp đồng mới / nâng phạm vi sửa ngay" lặp lại nhất quán dưới mỗi finding, đủ để phân biệt ba hướng xử lý; các từ "Cổng 1", "hợp đồng", "phạm vi" là thuật ngữ quy trình nghiệp vụ của chính hệ thống duyệt (đã được giải thích ngay trong câu mở đầu), không phải jargon kỹ thuật.
    - operational-feasibility: PASS — Dòng mở đầu "Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — máy cố ý không tự sửa" nói thẳng bằng ngôn ngữ kinh doanh rằng finding là thật-nhưng-ngoài-scope, không cần đọc code để hiểu. Ba lựa chọn hiện rõ dưới mỗi finding ("ghi Known limits" / "mở hợp đồng mới" / "nâng phạm vi sửa ngay") khớp đúng 3 nhánh câu hỏi, và mô tả tác động (mất tiện ích khi mạng hỏng giữa chừng, bị nhận nhầm là đã dời chỗ) là ngôn ngữ hậu quả người dùng, không phải thuật ngữ code/stack-trace. Điểm trừ nhỏ: nhãn "Known limits" để nguyên tiếng Anh không dịch, và "Cổng 1" là thuật ngữ quy trình nội bộ — nhưng không đủ để cản một người quyết kinh doanh hiểu và phân biệt 3 lựa chọn.
    - spec-alignment: PASS — Card nói rõ bằng ngôn ngữ thường: heading "Ngoài hợp đồng — bạn quyết" + câu giải thích "là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — máy cố ý không tự sửa" nêu đúng ý thật-nhưng-ngoài-scope. Mỗi finding có mô tả hậu quả cụ thể (mất tiện ích khi mạng hỏng, bị gỡ nhầm ở lần cập nhật sau) không dùng thuật ngữ kỹ thuật, và 3 nút hành động "ghi Known limits / mở hợp đồng mới / nâng phạm vi sửa ngay" khớp chính xác 3 lựa chọn trong câu hỏi AC-11. Không thấy jargon kỹ thuật (code, API, schema...) lọt vào; "Cổng 1" là thuật ngữ quy trình của chính hệ thống này, không phải jargon kỹ thuật lập trình.
  human_override: Manh Phan 2026-07-28

- eval: E12
  run_id: minted-s4-scope-triage-E12-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E13
  run_id: minted-s4-scope-triage-E13-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-28T09:00:00Z
  output: |
    Results: 16 passed, 0 failed (execute-parallel)

    Results: all workflow tests passed

- eval: E14
  run_id: minted-s4-scope-triage-E14-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E15
  run_id: minted-s4-scope-triage-E15-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E16
  run_id: minted-s4-scope-triage-E16-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

## Analyst

carried tu round 4 — baseline khong do lai round nay

- bash tests/workflows/run-tests.sh: E1, E2, E3, E4, E5, E6, E7, E10, E13
- bash tests/plugins/run-tests.sh: E8, E9, E12, E14, E15, E16

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: verdict REJECT — không có eval máy nào đỏ (E1-E10, E12-E14 đều PASS, baseline green), nhưng review (conventions + bugs) tìm thấy 5 finding trong hợp đồng (3 high: AC-11 card overlay-key không render, AC-5 và AC-1 cùng gốc triageByTitle join theo `title` gây cross-classification; 2 medium: AC-4 contract-unreadable chưa cài, AC-7 globToRe `**` sai lệch coverage-cluster) — vào rejectFindings; đồng thời judge panel E11 (AC-11, không-jargon) đề xuất FAIL 3/3 lens vì dòng cảnh báo cuối card lộ đường dẫn file mã nguồn. Trả về implementation.

Round 2: verdict REJECT — carried baseline round 1 (không đo lại round này); toàn bộ eval máy (E1-E10, E12-E14) tiếp tục PASS trên `tests/workflows/run-tests.sh` (16 passed) + `tests/plugins/run-tests.sh` (P54 xanh), cộng ba lệnh phụ trợ `tests/scripts/run-tests.sh` (497 passed), `tests/hooks/run-tests.sh` (51 passed) và `sync-plugin-packages.sh --check` (mirror in sync) đều xanh nhưng không gắn eval. Judge panel E11 (AC-11, không-jargon) đảo từ đề xuất FAIL round 1 sang đề xuất PASS 3/3 lens sau khi dòng cảnh báo cuối card bỏ đường dẫn file thô. REJECT của round này đến từ review findings MỚI phát hiện (xem review-findings.md, mục "Trong hợp đồng"): 2 high (AC-7 — `f.file` do reviewer agent sinh chưa được chuẩn hoá/kiểm biên trước khi so glob, nửa xử lý round 1 chỉ vá `**` zero-segment chứ chưa vá boundary-validation; AC-11 — card in nguyên văn title kỹ thuật của reviewer agent ra khối "Ngoài hợp đồng", chứng minh bằng fixture thật của chính repo) + 1 medium (AC-11 — triage trả về thiếu mục khiến `unclassified` bật cho một phần findings, card ẩn toàn bộ khối out-of-contract dù vẫn còn finding đã phân loại). Trả về implementation.

Round 3: verdict BLOCKED — toàn bộ 13 eval máy (E1-E10, E12-E14) tiếp tục PASS trên `tests/workflows/run-tests.sh` (16 passed) + `tests/plugins/run-tests.sh` (P54 xanh); `tests/scripts/run-tests.sh` (497 passed) và `tests/hooks/run-tests.sh` (51 passed) đều xanh nhưng không gắn eval nào. Judge panel E11 (AC-11) đề xuất PASS 2/3 lens (domain-correctness, spec-alignment) nhưng `operational-feasibility` bỏ phiếu FAIL vì nhãn nút "Known limits" còn lai tiếng Anh trong khi câu gợi ý bên cạnh đã dịch sang tiếng Việt — dissent này CHƯA được giải quyết trong round này. Nguyên nhân BLOCKED: `bash scripts/sync-plugin-packages.sh --check` không chạy được do Bash tool safety classifier (claude-sonnet-5) tạm thời không khả dụng — hạ tầng, không phải lỗi script hay thiếu dependency; verifier không thể hoàn tất round này. Chưa trả về implementation — chờ hạ tầng khôi phục để chạy lại lệnh bị chặn rồi re-verify.

Round 4: verdict BLOCKED — release 1.22.1 đã ship (contract nay thêm E15/E16 phủ AC-14/AC-15). Toàn bộ 15 eval máy (E1-E10, E12-E16) PASS trên `tests/workflows/run-tests.sh` (16 passed) + `tests/plugins/run-tests.sh` (P56 xanh, thêm P51/P55/P56 so round 3); `tests/hooks/run-tests.sh` (51 passed, T42 mới) và `scripts/sync-plugin-packages.sh --check` (mirror in sync — lệnh từng chặn round 3 nay chạy xanh) đều xanh nhưng không gắn eval nào trong evals.yaml. Judge panel E11 (AC-11) đề xuất PASS 3/3 lens lần này — dissent `operational-feasibility` từ round 3 (nhãn nút "Known limits" lai tiếng Anh) đã được giải quyết hoặc không còn tái hiện trong bản render hiện tại. Nguyên nhân BLOCKED lần này: `bash tests/scripts/run-tests.sh` — lệnh phụ trợ khác (không phải lệnh chặn round 3) — không chạy được vì claude-sonnet-5 classifier tạm thời không khả dụng, khiến Bash tool không thực thi được lệnh này; lệnh này không gắn eval nào trong evals.yaml nên không đưa vào `failed_evals`, nhưng verifier vẫn không thể xác nhận repo-wide script suite round này. Chưa trả về implementation — chờ hạ tầng khôi phục để chạy lại lệnh bị chặn rồi re-verify.

Round 5: verdict BLOCKED — re-pin sau round 4 (không có thay đổi code mới; `verified_commit` cập nhật lên `96b97796eba3f56d54f6ff78a4d70f7c7cd5e4c3`). evals.yaml không đổi từ baseline round 4 nên round này KHÔNG đo lại baseline (P2 carried); toàn bộ 15 eval máy (E1-E10, E12-E16) tiếp tục PASS trên `tests/workflows/run-tests.sh` (16 passed) + `tests/plugins/run-tests.sh` (P56 xanh) — carry trọn từ round 4, cộng `bash tests/scripts/run-tests.sh` (497 passed — lệnh từng chặn round 4 nay chạy xanh) và `bash scripts/sync-plugin-packages.sh --check` (mirror in sync) đều xanh nhưng không gắn eval nào. Judge panel E11 (AC-11) chấm lại (không carried) và tiếp tục đề xuất PASS 2/3 lens (domain-correctness, operational-feasibility) — nhưng `spec-alignment` bỏ phiếu FAIL lần này vì jargon "Known limits" và "ship" lọt vào nội dung thẻ mà người quyết kinh doanh không đọc code có thể không nắm chắc nghĩa; dissent MỚI, khác dissent round 3 (đã giải quyết), CHƯA được giải quyết trong round này. Nguyên nhân BLOCKED: `bash tests/hooks/run-tests.sh` không chạy được vì Bash tool execution classifier (claude-sonnet-5) tạm thời không khả dụng — hạ tầng, không phải lỗi script hay thiếu dependency; lệnh này không gắn eval nào trong evals.yaml nên không đưa vào `failed_evals`, nhưng verifier vẫn không thể xác nhận repo-wide hook suite round này. Chưa trả về implementation — chờ hạ tầng khôi phục để chạy lại lệnh bị chặn rồi re-verify.

Round 6: chạy ở phiên mới — toàn bộ eval PASS, judge panel E11 PASS không dissent.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

## Re-pin machine-only — 2026-07-29

`verified_commit` được cập nhật lên `ee6b72b` **mà KHÔNG chạy lại vòng verify
đầy đủ**. Lý do và mức phủ, để người đọc sau không hiểu rộng hơn:

- Feature `premerge-unjudged-pass` chạm `scripts/pre-merge-check.sh` và
  `tests/scripts/run-tests.sh`, làm evidence của slug này stale theo luật
  staleness. Đây là **staleness coupling** ở nội bộ kit: mọi thay đổi lõi cổng
  làm hết hạn evidence của mọi feature cũ, không liên quan tới chất lượng thay
  đổi. Người duyệt chọn re-pin machine-only thay vì 4 vòng S4 (đúng nguyên tắc
  đã duyệt trong kế hoạch loop-economics, mục `s4-stop-rule`).
- **ĐÃ chạy lại:** toàn bộ eval MÁY của slug này. Machine lane ở `ee6b72b` do 5
  agent tươi chạy, sha nhất quán cả 5, tất cả exit 0 —
  `tests/scripts/run-tests.sh` (588 case), `tests/plugins/run-tests.sh`,
  `tests/workflows/run-tests.sh`, `tests/hooks/run-tests.sh`,
  `sync-plugin-packages.sh --check`.
- **KHÔNG chạy lại:** eval `judgment` và vòng review/refute. `human_override` +
  `human_signoff` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã
  phán về mã mới của cổng.

### Re-pin lần 2 — 2026-07-29, do đổi `description` của manifest

`verified_commit` lên `29356bb`. Nguyên nhân stale lần này **không đổi hành vi
nào của cổng**: commit `29356bb` chỉ thêm một câu release-notes vào trường
`description` của 3 manifest. Không code path nào đọc trường đó.

Luật staleness lọc theo **đường dẫn**, và `plugin.json` cố ý KHÔNG nằm trong
`t1_skip_globs` (manifest khai được `hooks`, nên miễn trừ trọn file là mở lỗ —
đề xuất đó đã bị từ chối, hồ sơ ở `.out-of-scope/`). Nên nó không phân biệt được
"đổi lõi cổng" với "sửa một dòng quảng cáo".

- **ĐÃ chạy lại:** toàn bộ eval MÁY, machine lane ở `29356bb` do 5 agent tươi
  chạy, sha nhất quán cả 5, tất cả exit 0 (588 case scripts · 51 hooks ·
  plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký + `human_override`
  sẵn có giữ nguyên hiệu lực.

### Re-pin lần 3 — 2026-07-29, do fix loop-stall của feature-loop (1.17.1)

`verified_commit` lên `57bff68`. Nguyên nhân stale: commit `57bff68` sửa
SKILL.md của feature-loop (cả hai harness) để vòng lặp tự đi — bất biến dừng,
S3 dispatch S4 ngay, REJECT tự động 3 round, in `/goal` bắt buộc — kèm bump
manifest 1.17.0→1.17.1 và re-pin 3 literal version trong
`tests/plugins/run-tests.sh` (P04/P22).

Khác lần 2, lần này staleness **bắt đúng một nửa**: SKILL.md là văn xuôi điều
phối (không code path nào của cổng đọc nó), nhưng `tests/plugins/run-tests.sh`
là một phần machine lane THẬT — suite đổi thì bằng chứng suite phải chạy lại.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `57bff68` do 5 agent tươi
  chạy (mỗi slug một agent), sha nhất quán cả 5, tất cả exit 0 (588 case
  scripts · 51 hooks · plugins pass · workflows 159+16 · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã
  phán về hành vi mới của feature-loop 1.17.1.

### Re-pin lần 4 — 2026-07-29, do feature cross-feature-claim-index

`verified_commit` lên `58b613d`. Nguyên nhân stale: feature
cross-feature-claim-index thêm `feature-loop/scripts/claim-scan.mjs`, sửa
SKILL.md feature-loop (input thứ 5 cho gap-probe, 1.18.0), thêm 2 file test
mới trong `tests/workflows/` và bump manifest. Staleness bắt ĐÚNG MỘT NỬA
như lần 3: SKILL/scanner không chạm hành vi cổng, nhưng suite workflows +
plugins đổi thật nên bằng chứng suite phải chạy lại.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `58b613d` do 5 agent
  tươi chạy (mỗi slug một agent), sha nhất quán cả 5, tất cả exit 0
  (588 scripts · 51 hooks · plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là
  đã phán về claim-scan hay feature-loop 1.18.0.

### Re-pin lần 5 — 2026-07-29, do feature claim-scan-parser-hardening

`verified_commit` lên `69e797a`. Nguyên nhân stale: feature
claim-scan-parser-hardening sửa `feature-loop/scripts/claim-scan.mjs` (đóng
lớp câm-lặng parser), thêm case test trong `tests/workflows/`, bump manifest
1.18.1 + description. Suite workflows/plugins đổi thật nên bằng chứng suite
chạy lại là đúng việc.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `69e797a` do 6 agent
  tươi chạy (mỗi slug một agent), sha nhất quán cả 6, tất cả exit 0
  (588 scripts · 51 hooks · plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên; chữ ký cũ KHÔNG được hiểu là đã phán về
  claim-scan 1.18.1.

### Re-pin — 2026-07-29, do feature findings-section-boundary

`verified_commit` lên `9d01b83`. Nguyên nhân stale: feature
findings-section-boundary thêm `lib/md-section.js` (luật ranh giới
per-section), gỡ bản sao `section()` khỏi gate-card + evidence-page, wire
runner `tests/scripts` chạy mọi `*.test.mjs`, bump acceptance-gate 1.25.0.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `9d01b83` do 7 agent
  tươi chạy (mỗi slug một agent), sha nhất quán cả 7, tất cả exit 0
  (590 scripts · 51 hooks · plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên; chữ ký cũ KHÔNG được hiểu là đã phán về
  luật ranh giới mới.

### Re-pin lần 6 — 2026-07-30, do vá AC-regex của gate-card

`verified_commit` lên `3a80983`. Nguyên nhân stale: `scripts/gate-card.js` nới
`AC_LINE` + tách `parseAC()` — dòng AC dạng `- **AC-N (nhãn):**`,
`- **AC-N** (judgment)`, `- AC-N (nhãn):` trước đây bị bỏ CÂM, nên thẻ Cổng 1
hiện thiếu tiêu chí hoặc rỗng hẳn.

**KHÁC lần 2-4: lần này staleness bắt ĐÚNG HOÀN TOÀN.** Không được viện "không
đổi hành vi cổng" như hai lần trước — thay đổi này đổi CHÍNH cái thẻ Cổng 1
render ra. Đo tính chất trên 176 contract (2 repo): 916 → 1246 dòng AC đọc
được; **0 dòng mất**, **0 lật cờ judgment** trên dòng cả hai parser cùng đọc
được, **0 false-positive**.

**Slug này có eval ĐỤNG THẲNG gate-card** (E8/P52 đo đầu ra render, E11/P53 so
BYTE-ĐỐI-BYTE bản render sinh lại bằng chính gate-card.js): cả hai đã chạy lại
ở `3a80983` và PASS — tức bản vá KHÔNG làm trôi khuôn render. Thẻ Cổng 1 của
chính slug này: 14 AC trước và sau — không đổi.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `3a80983` — 6 suite EXIT=0
  (588 scripts · 51 hooks · plugins pass · workflows pass · skills pass · codex
  pass) + `sync-plugin-packages.sh --check` EXIT=0 (mirror in sync).
  **Provenance YẾU HƠN lần 2-4:** chạy MỘT lượt trong một phiên, KHÔNG phải 5
  agent tươi độc lập mỗi slug. Sha nhất quán vì cùng một cây, không phải vì
  năm lần đo độc lập đồng ý với nhau — đọc con số này với đúng trọng lượng đó.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là
  đã phán về AC-regex mới của gate-card.

### Re-pin lần 7 — 2026-07-30, do gói cảnh báo mù criterion (cùng chuỗi với lần 5)

`verified_commit` lên `afe223f`. Cùng nguyên nhân và cùng posture với lần 5
(vá AC-regex): `scripts/gate-card.js` đổi tiếp, thêm `lib/ac-line.js`. Vẫn
**KHÔNG viện được "không đổi hành vi cổng"** — gói này đổi cả cái card render ra.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `afe223f` — 6 suite EXIT=0 (592 scripts ·
  51 hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh
  --check` EXIT=0. Case đụng gate-card: P38a/b · P52 · P53 (byte-đối-byte) ·
  GPM21 · GPM20g đều PASS. Provenance vẫn YẾU như lần 5: một lượt chạy một
  phiên, không phải 5 agent tươi độc lập.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ
  nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về cảnh báo mù mới.

### Re-pin lần 8 — 2026-07-30, do vòng verify 2 của gate-card-ac-visibility

`verified_commit` lên `246e7e1`. Cùng chuỗi, cùng posture với lần 6: vòng 2 viết
lại case P61 (thước cũ không đo AC-4) và mở lane corpus repo tiêu thụ.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `246e7e1` — 6 suite EXIT=0 (594 scripts · 51
  hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh --check`
  EXIT=0. Case đụng gate-card: P38a/b · P52 · P53 (byte-đối-byte) · GPM21 · GPM20g
  đều PASS. Provenance vẫn một lượt chạy một phiên, không phải 5 agent độc lập.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ nguyên
  hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về cảnh báo mù hay thước mới.

### Re-pin lần 9 — 2026-07-30, do merge origin/main vào nhánh gate-card-ac-visibility

`verified_commit` lên `23b8dc6`. Nguyên nhân stale: đợt tích hợp gộp nhánh
`fix/ac-bullet-regex-widen` với main — `lib/md-section.js` thêm `sectionLines()`
và `section()` thành lớp mỏng trên nó, `lib/ac-line.js` bỏ bản duyệt ranh giới
riêng, `scripts/gate-card.js` + suite đổi theo.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `23b8dc6` — 6 suite EXIT=0 (596 scripts ·
  51 hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh
  --check` EXIT=0. Kèm phép kiểm hồi quy `section()` trước/sau refactor trên
  686 file × 1.731 heading = 1.187.466 phép so → **0 lệch**, harness tự falsify
  được (đổi `lv>=2`→`lv>=3` cho 1.626 lệch). Provenance: một lượt chạy một
  phiên, không phải agent độc lập mỗi slug.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ
  nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về mã sau merge.

### Re-pin — 2026-07-30, do feature design-pass-skill

`verified_commit` lên `3ab4ee6`. Nguyên nhân stale: feature design-pass-skill
thêm skill `skills/design-pass/` (nghi thức thiết kế in-harness S1-D) + 10
case P58–P67 trong `tests/plugins/run-tests.sh` + bump acceptance-gate
1.26.0 (3 manifest) + mirror sync.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `3ab4ee6` do 3 agent
  tươi chạy độc lập, sha nhất quán cả 3, tất cả exit 0 (590 scripts ·
  51 hooks · plugins pass gồm P58–P67 · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên; chữ ký cũ KHÔNG được hiểu là đã phán về
  design-pass 1.26.0.

### Re-pin — 2026-07-30 (lần 2), do amendment worked-example của design-pass-skill

`verified_commit` lên `a8f0d70`. Nguyên nhân stale: amendment sau signoff của
design-pass-skill (lệnh owner trong chat — skill-creator audit mục 1): thêm
worked example vào SKILL.md; description GIỮ NGUYÊN (trigger-eval 3 iteration
không dịch chuyển điểm).

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `a8f0d70` do 3 agent
  tươi chạy độc lập, sha nhất quán cả 3, tất cả exit 0 (590 scripts ·
  51 hooks · plugins pass gồm P58–P67 · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-07-30 (sau merge hai nhánh), tại 8ee3f4c

`verified_commit` lên `8ee3f4c` — merge commit tích hợp design-pass-skill
(1.26.0, case đánh lại số P72–P81) với gate-card-ac-visibility (PR 18) trên
origin/main. Machine lane ở `8ee3f4c` do 3 agent tươi chạy độc lập, sha nhất
quán cả 3, tất cả exit 0 (596 scripts · 51 hooks · plugins pass gồm case của
CẢ HAI feature · workflows pass · mirror in sync). Judgment + chữ ký giữ
nguyên như các lần re-pin trước.


### Re-pin — 2026-07-30 (sau pha3-goi-luoi), tại f929ceb

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 3 của feature
  `pha3-goi-luoi`, Workflow `wf_cfa3bb5d-5df`, doer≠grader): 5 suite tại
  `f929ceb553b3ea4d0d4204907ed8c1c291241a9e` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P88, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `f929ceb553b3ea4d0d4204907ed8c1c291241a9e` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-01 (sau ngon-ngu-mat-nguoi), tại b7f658d

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 4 của feature
  `ngon-ngu-mat-nguoi`, Workflow `wf_65b38963-25c`, doer≠grader): 5 suite tại
  `b7f658d42b6a8a72d6ef0a1310bac28127364423` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P96, gồm case của slug này) · workflows 10 pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `b7f658d42b6a8a72d6ef0a1310bac28127364423` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-02 (sau hinh-theo-mat-phang), tại 2b6823d

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 6 của feature
  `hinh-theo-mat-phang`, Workflow `wf_69f3bf7a-1a6`, doer≠grader): 5 suite tại
  `2b6823d400df3360975c9029b120ac5871e36bbf` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P97, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `2b6823d400df3360975c9029b120ac5871e36bbf` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-08-03 (sau start-command), tại b2d2eac

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 2 của feature
  `start-command`, Workflow `wf_73dc61df-6d8`, doer≠grader): 5 suite tại
  `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P101, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-08-03 (sau product-map-uat-session), tại 62444df

Machine lane do agent TƯƠI của S4 round 11 (`wf_7c6d877e-022`, doer≠grader)
chạy tại đúng sha `62444dfd5f6ce79836034b2695bc69f87425495d`: 5 suite exit 0 —
scripts 596 pass · hooks 51 pass · plugins pass (P01–P127, gồm case của slug
này) · workflows pass · mirror `sync-plugin-packages.sh --check` in sync. Bản
đồ sản phẩm `--check` exit 0 cùng lượt. Judgment + chữ ký của slug này GIỮ
NGUYÊN — chỉ đổi mốc ghim của làn máy.
