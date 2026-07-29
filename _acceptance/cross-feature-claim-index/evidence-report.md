---
schema_version: 2
feature_slug: cross-feature-claim-index
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 35ec5b1c2efd6e790f35f623cb554760c3f027ee
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
| E10 | AC-10 | judgment | UNCERTAIN |
| E11 | AC-11 | judgment | UNCERTAIN |
| E12 | AC-12 | script | PASS |
| E13 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cross-feature-claim-index-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E2
  run_id: minted-cross-feature-claim-index-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E3
  run_id: minted-cross-feature-claim-index-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E4
  run_id: minted-cross-feature-claim-index-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E5
  run_id: minted-cross-feature-claim-index-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-cross-feature-claim-index-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E7
  run_id: minted-cross-feature-claim-index-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-cross-feature-claim-index-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E9
  run_id: minted-cross-feature-claim-index-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

- eval: E10
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  proposal: FAIL
  rationale: |
    - domain-correctness: FAIL — Schema JSON trong design doc (dòng 76-88) có trường `serves` (vd `["AC-4"]`), nhưng AC-6 của contract — nơi liệt kê đủ trường bắt buộc — chỉ đòi `id/source/slug/kind/stage/sev/at/claim/lesson/pointer` (đúng 10, không có `serves`), và bản markdown nạp cho agent (bullet `- [<id>] (<slug> · <stage|sev> · <kind>) <claim> — <lesson>`) cũng không render `serves`. Không đoạn nào trong design doc mô tả pipeline parse (decisions.jsonl fix/descope, gap-probe.md bảng Findings) sinh ra giá trị cho `serves` — không có producer lẫn consumer nào cho trường này trong V1, đúng hình hài "trường để dành" mà câu hỏi cảnh báo. Phần còn lại của schema (id ổn định qua dedupe, pointer trỏ về file nguồn) đủ cho truy nguồn G5, nhưng `serves` là điểm phình chưa được biện minh nên không thể PASS.
    - operational-feasibility: FAIL — Khối JSON schema trong design doc (dòng 76-88) có 11 trường, gồm "serves":["AC-4"] — nhưng AC-6 (đặc tả bắt buộc) chỉ liệt kê 10 trường (id/source/slug/kind/stage/sev/at/claim/lesson/pointer), không có "serves"; trường này cũng không xuất hiện trong định dạng markdown nạp cho agent (dòng 90-92), không có nguồn sinh ra nó từ decisions.jsonl/gap-probe.md, và không được test nào ở mục Testing kiểm tra. Đây đúng là một trường "để dành" chưa có người tiêu thụ nào được mô tả — vi phạm trực tiếp điều kiện AC-10 đặt ra ("không trường thừa để dành"), dù phần còn lại (id ổn định, pointer truy nguồn) đáp ứng tốt yêu cầu đọc-lại của G5.
    - spec-alignment: FAIL — Schema claim trong design doc (mục 2) thực ra có 11 trường chứ không phải 10: ngoài id/source/slug/kind/stage/sev/at/claim/lesson/pointer còn "serves":["AC-4"] — trường này không có bước nào trong pipeline (parse→...→serialize) mô tả cách sinh giá trị, không xuất hiện trong khối markdown nạp cho agent, và không nằm trong danh sách 10 trường mà chính contract AC-6 yêu cầu kiểm. Đây đúng là trường "để dành" cho việc semantic-match claim↔AC mà mục Out of scope của design doc tự nhận là chưa cần ở V1 ("Semantic matching claim ↔ surfaces/paths ... chưa cần"), nên nó phình V1 đúng như AC-10 cấm, đồng thời gây lệch giữa design (11 trường) và contract (10 trường).
  human_override:

- eval: E11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  proposal: FAIL
  rationale: |
    - domain-correctness: FAIL — Tiêu chí GO #1 đòi "được người xác nhận đáng" — đây là phán đoán giá trị của người, không phải giá trị đọc được bằng grep trên decisions.jsonl/gap-probe.md; NO-GO "probe hỏng vì input 5 không vá được trong 1 lần" cũng là nhận định chủ quan, không có lệnh/ngưỡng đo cụ thể. Chính mục "Đo lường" của doc còn ghi scorecard GO/NO-GO là "điền tay" chứ không phải suy ra thuần túy từ grep, mâu thuẫn với tuyên bố "đo được thuần từ artifact". Tiêu chí GO #3 (scan < 5 giây) cũng đòi chạy thực script đo thời gian, không phải chỉ grep hai file artifact như luật đo tuyên bố.
    - operational-feasibility: FAIL — Tiêu chí (1) đòi "Xử lý `human-gate1` được người xác nhận đáng" nhưng doc không chỉ ra field/giá trị cụ thể nào trong gap-probe.md hay decisions.jsonl mã hoá "đáng" — đây là phán đoán người đọc, không phải giá trị grep được. Tiêu chí (2) đếm tỉ lệ "rejected" nhưng không định nghĩa trạng thái này được ghi ở đâu (cột nào trong Findings, hay entry nào trong ledger) — chỉ có `Xử lý ∈ {fixed, descope}` được nêu, "rejected" chưa map vào enum nào. Chính §4 "Đo lường" của doc cũng tự thừa nhận scorecard GO/NO-GO "điền tay" cuối cửa sổ đo, mâu thuẫn với tuyên bố đo thuần từ grep — chỉ tiêu chí (3) (đếm claim, scan time) là đo được thuần cơ học.
    - spec-alignment: FAIL — Tiêu chí (3) có lệnh đo cụ thể (chạy claim-scan.mjs, đếm claim/token/giây), nhưng tiêu chí (1) và luật NO-GO đòi hỏi phân loại "được người xác nhận đáng" và "bị human bác ở Gate 1" — đây là phán đoán người tại thời điểm đo, không có field/pattern grep cụ thể nào trong gap-probe.md hay decisions.jsonl ánh xạ tới trạng thái "rejected"/"đáng" (schema chỉ có kind: fix|descope|finding, không có nhãn rejected). Mục "Đo lường" tự thừa nhận "scorecard GO/NO-GO điền tay" — tức bước cuối vẫn cần người đọc và tự kết luận, không phải thuần grep như tuyên bố.
  human_override:

- eval: E12
  run_id: minted-cross-feature-claim-index-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-29T14:20:00Z
  output: |
    plugins/ mirror in sync.

- eval: E13
  run_id: minted-cross-feature-claim-index-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:20:00Z
  output: |
    Results: 9 passed, 0 failed

    Results: all workflow tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay

- E1, E2, E3, E4, E5, E6, E7, E8, E9, E13 (cmd: `bash tests/workflows/run-tests.sh`) — green trên cả HEAD lẫn diffBase baseline (đo ở round 1, không đo lại round này): non-discriminating, chứng minh harness chạy được chứ chưa chứng minh riêng tính năng cross-feature-claim-index. Cần xem lại các case này có nên viết lại để assert hành vi mới (claim-scan.mjs) hay đây là regression-guard có chủ đích của bộ workflows.
- E12 (cmd: `bash scripts/sync-plugin-packages.sh --check`) — green trên cả HEAD lẫn baseline (đo ở round 1, không đo lại round này): non-discriminating theo cùng lý do (mirror-sync check không đổi hành vi giữa hai tree trong lần đo đó).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10, E11 (judgment) FAIL theo panel 3 lens — E10: trường "serves" trong schema design doc không nằm trong 10 trường AC-6 chốt, không có người tiêu thụ nào trong V1 (trường để dành, vi phạm AC-10). E11: mục "Đo lường" của AC-11 chỉ cho một lệnh grep cụ thể nhưng 2/3 tiêu chí GO không quy về lệnh/vật đo nào trên artifact — vẫn cần người điền scorecard tay. 11 eval máy (E1-E9, E12, E13) PASS. Verdict tổng: REJECT. Trả về thiết kế/contract để thu hẹp/định nghĩa lại trường "serves" và bổ sung lệnh đo cho AC-11.
Round 2: 11 eval máy (E1-E9, E12, E13) vẫn PASS (baseline không đo lại — carried round 1, P2 evals.yaml không đổi từ lần baseline cuối). Panel 3 lens tái thẩm E10, E11: cả hai vẫn đề xuất FAIL với lý do gần như không đổi (trường "serves" chưa có consumer trong V1 vi phạm AC-10; mục "Đo lường" của AC-11 vẫn thiếu lệnh/vật đo cho 2/3 tiêu chí GO). Vì đây là judgment item nên verdict tổng ghi PENDING-JUDGMENT thay vì tự REJECT — chờ người xác nhận trực tiếp E10/E11 và điền `human_override` tại Gate 2 trước khi verdict được nâng lên PASS hoặc chốt REJECT.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract