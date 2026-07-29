---
schema_version: 2
feature_slug: cross-feature-claim-index
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5055cedd7b265e1f819e455e1811f29167d886eb
# bypass_ack:
human_signoff:
---

# Evidence Report: cross-feature-claim-index

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | judgment | FAIL |
| E11 | AC-11 | judgment | FAIL |
| E12 | AC-12 | script | PASS |
| E13 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cross-feature-claim-index-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E2
  run_id: minted-cross-feature-claim-index-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E3
  run_id: minted-cross-feature-claim-index-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E4
  run_id: minted-cross-feature-claim-index-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E5
  run_id: minted-cross-feature-claim-index-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-cross-feature-claim-index-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E7
  run_id: minted-cross-feature-claim-index-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-cross-feature-claim-index-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E9
  run_id: minted-cross-feature-claim-index-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E10
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: FAIL
  rationale: |
    - domain-correctness: FAIL — Schema claim trong design doc có 11 trường (bao gồm "serves":["AC-4"]) nhưng AC-6 — nơi chốt hợp đồng output — chỉ liệt kê 10 trường bắt buộc (id/source/slug/kind/stage/sev/at/claim/lesson/pointer), không có "serves". Không có đoạn nào trong pipeline (component 1: parse→lọc→exclude-self→dedupe→sort→cap→serialize) giải thích "serves" được suy ra từ đâu (ledger/gap-probe không có cột AC tường minh), và không có người tiêu thụ nào cho nó trong V1 — mục G5 đọc lại chỉ nói tới truy nguồn qua "pointer" và "id ổn định", không nhắc "serves". Đây đúng là một trường "để dành" chưa có người tiêu thụ mà câu hỏi AC-10 yêu cầu phải không tồn tại.
    - operational-feasibility: FAIL — Schema mẫu trong design doc (dòng 76-88) có 11 trường, gồm cả `"serves":["AC-4"]`, nhưng AC-6 của contract lại chốt đúng 10 trường (id/source/slug/kind/stage/sev/at/claim/lesson/pointer) — KHÔNG có `serves`. Trường `serves` không xuất hiện ở đâu khác trong design doc (không trong khối markdown nạp cho agent, không trong Testing, không trong bảng error-handling) nên không có người tiêu thụ nào được định nghĩa — đúng hình hài "trường để dành" mà chính AC-10 cấm. Đây là một khoảng hở thật giữa hai input được giao (design vs contract), nên chưa thể coi schema V1 là sạch/đủ nền mà không phình.
    - spec-alignment: FAIL — Schema JSON ở design doc mục 2 có 11 trường (thêm "serves":["AC-4"] so với 10 trường mà AC-6 liệt kê: id/source/slug/kind/stage/sev/at/claim/lesson/pointer). Trường "serves" không xuất hiện trong định dạng markdown nạp cho agent (`- [<id>] (<slug> · <stage|sev> · <kind>) <claim> — <lesson>`), không được nhắc trong pipeline claim-scan.mjs (parse→lọc loại→exclude-self→dedupe→sort→cap→serialize→exit), không có mô tả nguồn sinh giá trị từ decisions.jsonl/gap-probe.md, và không được AC nào yêu cầu kiểm tra — đúng hình hài "trường để dành chưa có người tiêu thụ" mà câu hỏi AC-10 hỏi có hay không. Các trường còn lại (pointer cho truy nguồn G5, id ổn định cho dedupe/cite, sev/at cho sort, stage/kind/claim/lesson cho render) đều có consumer rõ trong chính design doc.
  human_override:

- eval: E11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: FAIL
  rationale: |
    - domain-correctness: FAIL — Mục "Đo lường" chỉ cho đúng một lệnh cụ thể — grep pattern id trích dẫn trên gap-probe.md — nhưng hai trong ba tiêu chí GO (Xử lý `fixed`/`human-gate1`/`rejected` gắn với "được người xác nhận đáng", và ngưỡng ≤10 claim/~2k token/scan<5s) không có lệnh hay vật đo nào được chỉ ra để tách trạng thái đó từ artifact. Chính văn bản gọi bước cuối là "scorecard GO/NO-GO điền tay" — tức khâu quyết định GO/NO-GO không hoàn toàn tự động từ artifact như tuyên bố, mà cần con người tổng hợp/diễn giải thủ công.
    - operational-feasibility: FAIL — DP-1 tự nhận "chỉ đếm từ gap-probe.md + decisions.jsonl của slug mới" nhưng ít nhất 2 trong 3 tiêu chí GO không quy về lệnh/vật đo cụ thể trên hai file đó: tiêu chí (1) đòi "được người xác nhận đáng" — không có field/pattern nào trong schema claim hay decisions.jsonl biểu diễn "đáng", nên đây là phán đoán người mới tại thời điểm đo, không phải grep; tiêu chí (3) "scan < 5 giây, ≤10 claim/~2k token mỗi lần nạp" là đo hiệu năng chạy `claim-scan.mjs` trực tiếp (thời gian, token), hoàn toàn khác kênh với grep nội dung gap-probe.md/decisions.jsonl mà mục "Đo lường" mô tả. Mục "Đo lường" cũng tự thừa nhận "scorecard GO/NO-GO điền tay" và tiêu chí NO-GO "probe hỏng vì input 5 không vá được trong 1 lần" không có ngưỡng/lệnh đo, chỉ dựa đánh giá người — nên tuyên bố "đo được thuần từ artifact, không tiêu chí nào phải hỏi agent hay dựa hồi ức người" không đúng như thiết kế hiện tại.
    - spec-alignment: FAIL — Mục "Đo lường" (dòng 108-112) chỉ đưa ra MỘT lệnh cụ thể — grep pattern id trích dẫn `[<id>]` trên gap-probe.md — rồi để "scorecard GO/NO-GO điền tay"; không có lệnh/pattern nào đo trạng thái Xử lý (`fixed`/`human-gate1`/`rejected`) cần cho tiêu chí (1) và (2), nên phần đó vẫn phải đọc tay từng dòng bảng, không phải grep thuần. Tiêu chí (1) còn thêm cụm định tính "được người xác nhận đáng" không gắn với field/giá trị cụ thể nào trong schema claim hay bảng Findings, tức vẫn cần phán đoán của người chứ không chỉ đối chiếu artifact. Do đó tuyên bố "đo được thuần từ artifact, không tiêu chí nào phải hỏi agent hay dựa hồi ức người" không khớp với chính phần "Đo lường" và "Luật đo" trong doc.
  human_override:

- eval: E12
  run_id: minted-cross-feature-claim-index-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-29T00:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E13
  run_id: minted-cross-feature-claim-index-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T00:00:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

## Analyst

- E1, E2, E3, E4, E5, E6, E7, E8, E9, E13 (cmd: `bash tests/workflows/run-tests.sh`) — green trên cả HEAD lẫn diffBase baseline: non-discriminating, chứng minh harness chạy được chứ chưa chứng minh riêng tính năng cross-feature-claim-index. Cần xem lại các case này có nên viết lại để assert hành vi mới (claim-scan.mjs) hay đây là regression-guard có chủ đích của bộ workflows.
- E12 (cmd: `bash scripts/sync-plugin-packages.sh --check`) — green trên cả HEAD lẫn baseline: non-discriminating theo cùng lý do (mirror-sync check không đổi hành vi giữa hai tree trong lần đo này).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10, E11 (judgment) FAIL theo panel 3 lens — E10: schema claim trong design doc có trường "serves" không xuất hiện trong 10 trường AC-6 chốt và không có người tiêu thụ nào trong V1 (trường để dành, vi phạm AC-10). E11: mục "Đo lường" của AC-11 chỉ cho một lệnh grep cụ thể, nhưng 2/3 tiêu chí GO (trạng thái xử lý "được người xác nhận đáng", ngưỡng hiệu năng scan<5s/≤10 claim) không quy về lệnh/vật đo nào trên artifact — vẫn cần con người điền scorecard tay. Toàn bộ 11 eval máy (E1-E9, E12, E13) PASS, không có failed_evals máy. Verdict tổng: REJECT do hai eval judgment FAIL. Trả về thiết kế/contract để thu hẹp hoặc định nghĩa lại trường "serves" và bổ sung lệnh/vật đo cho các tiêu chí GO còn thiếu ở mục "Đo lường".

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
