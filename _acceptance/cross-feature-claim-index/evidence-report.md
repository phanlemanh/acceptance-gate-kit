---
schema_version: 2
feature_slug: cross-feature-claim-index
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3ab4ee6cc0ea51ea4516595018fd74a4017ffbec
# bypass_ack:
human_signoff: Manh Phan 2026-07-29
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
| E10 | AC-10 | judgment | PASS |
| E11 | AC-11 | judgment | PASS |
| E12 | AC-12 | script | PASS |
| E13 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cross-feature-claim-index-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E2
  run_id: minted-cross-feature-claim-index-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E3
  run_id: minted-cross-feature-claim-index-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E4
  run_id: minted-cross-feature-claim-index-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E5
  run_id: minted-cross-feature-claim-index-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-cross-feature-claim-index-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E7
  run_id: minted-cross-feature-claim-index-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-cross-feature-claim-index-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E9
  run_id: minted-cross-feature-claim-index-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E10
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  proposal: PASS
  rationale: |
    - domain-correctness: PASS — Schema có đúng 10 trường bắt buộc (id/source/slug/kind/stage/sev/at/claim/lesson/pointer, theo AC-6) và mỗi trường có người tiêu thụ cụ thể trong V1: id là đơn vị trích dẫn agent cite nguyên văn, pointer là đường truy nguồn về decisions.jsonl/gap-probe.md (đúng nhu cầu "đọc lại, truy nguồn" của G5), stage/sev/kind/claim/lesson hiện diện trong bullet markdown nạp cho probe. Trường duy nhất có thể ngờ là "reserved" — `serves` — được khai rõ là tùy chọn với người tiêu thụ ngay từ V1 (critic gap-probe nối AC cũ), không phải trường để-dành; id ổn định vì nguồn gốc-sự-thật là append-only nên thứ tự dòng bảng (cơ sở tính `<slug>#F<n>`) không bị xáo trộn giữa các lần chạy. Vì V1 là view dẫn xuất không persist (Approach A), không phát sinh nghĩa vụ migrate — thỏa đúng điều kiện "không migrate" trong câu hỏi.
    - operational-feasibility: FAIL — Pointer + id-ổn-định (dedupe theo id ledger, `<slug>#F<n>` cho finding) đủ cho truy nguồn G5, nhưng schema JSON (design doc dòng 76-88) có 11 trường gồm `serves`, trong khi AC-6 chỉ chốt đúng 10 trường bắt buộc và bản markdown nạp cho agent (dòng 95-97, bullet `- [<id>] (<slug> · <stage|sev> · <kind>) <claim> — <lesson>`) không render `serves` ở đâu cả. Design doc tự nhận "KHÔNG phải trường để-dành" và gán consumer là "critic gap-probe", nhưng không mô tả bước nào trong pipeline (S1#7, error-handling, testing) thực sự đọc lại `serves` từ output JSON — về mặt vận hành nó tồn tại trong output nhưng không có đường tiêu thụ được nối dây trong V1, đúng hình hài trường thừa mà câu hỏi cảnh báo. Vì vậy schema chưa đủ gọn cho G5 mà không phình.
    - spec-alignment: PASS — Spec liệt kê đúng 10 trường bắt buộc (id…pointer) và tách rõ `serves` là trường tùy chọn có consumer ngay từ V1 (critic gap-probe nối claim về AC của feature cũ), không phải trường "để dành" — đúng khớp câu hỏi AC-10. `pointer` cho truy nguồn (path vào decisions.jsonl/gap-probe.md), `id` ổn định qua tái dùng id ledger sẵn có hoặc suy ra tất định từ thứ tự dòng bảng gap-probe (nguồn append-only) — đủ cơ sở cho G5 đọc lại mà không cần migrate. Các trường còn lại (source/slug/kind/stage/sev/at/claim/lesson) đều có ít nhất một tiêu thụ đã nêu (lọc AC-1, exclude-self AC-3, sort AC-5, hiển thị bullet advisory), không thấy trường thừa không người dùng.
  human_override:

- eval: E11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  proposal: PASS
  rationale: |
    - domain-correctness: PASS — Bảng "Đo lường — mỗi tiêu chí một lệnh, một vật" ánh xạ đủ 5 nhánh GO/NO-GO sang lệnh grep/wc/time cụ thể trên gap-probe.md, decisions.jsonl và frontmatter contract của đúng slug mới; ngay cả "human xác nhận đáng" cũng được quy về đọc chữ ký approved_by sẵn có, không phỏng vấn lại. Dòng chốt "Không tiêu chí nào hỏi agent hay dựa hồi ức" khớp với nội dung bảng phía trên, kể cả nhánh yếu nhất (NO-GO probe hỏng, chỉ nói "đối chiếu ledger") vẫn trỏ về artifact (decisions.jsonl) chứ không cần hỏi ai.
    - operational-feasibility: FAIL — GO-1 và GO-3 có lệnh backtick cụ thể (grep, wc -c, time), nhưng GO-2 chỉ mô tả "đếm rejected:/tổng — bằng grep cột Xử lý" không đưa regex/lệnh thật, và NO-GO "probe hỏng vì input 5" đòi "đối chiếu ledger fix có vá trong 1 lần không" — không có lệnh/tiêu chí máy đo cho "vá trong 1 lần", đây là phán đoán ngữ nghĩa trên các entry ledger chứ không phải một grep/đếm xác định. Do đó không phải MỌI tiêu chí GO/NO-GO đều quy về lệnh/vật đo cụ thể như tuyên bố ở đầu mục 4.
    - spec-alignment: PASS — Bảng "Đo lường" liệt đủ 5 tiêu chí (GO-1, GO-2, GO-3, NO-GO zero-cite, NO-GO probe hỏng) mỗi dòng đều ghi lệnh cụ thể (grep pattern, wc -c, time, chạy lại claim-scan.mjs) và vật đo cụ thể (gap-probe.md, frontmatter contract, decisions.jsonl, output scan) — không dòng nào chỉ nói "kiểm tra" chung chung. Dòng chốt của mục ("Không tiêu chí nào hỏi agent hay dựa hồi ức; 'xác nhận đáng' đọc từ chữ ký approved_by sẵn có") khớp đúng tuyên bố của câu hỏi. Điểm hơi mềm duy nhất là NO-GO "probe hỏng" dùng cụm "đối chiếu ledger" thay vì một lệnh grep tường minh, nhưng vẫn quy về đọc decisions.jsonl (artifact), không đòi hỏi agent trả lời hay người nhớ lại — không đủ để lật verdict.
  human_override:

- eval: E12
  run_id: minted-cross-feature-claim-index-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-29T14:50:00Z
  output: |
    plugins/ mirror in sync.

- eval: E13
  run_id: minted-cross-feature-claim-index-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T14:50:00Z
  output: |
    Results: 10 passed, 0 failed

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
Round 3: theo lệnh human tại Gate 2 (decisions.jsonl d-20260729T073800Z-16526), sửa 2 in-contract (SKILL đủ 7 ý + ngoại lệ input 5 khi corpus rỗng; sắp claim `at: null` xuống cuối nhóm severity) và 2 artifact cho panel (design doc: `serves` khai tường minh optional-có-consumer từ V1; mục Đo lường viết lại thành bảng tiêu-chí→lệnh→vật cho AC-11). Panel 3 lens chấm lại trên inputs mới: E10 và E11 đều đề xuất PASS 2/3 lens (domain-correctness, spec-alignment); operational-feasibility vẫn giữ FAIL trên cả hai — dissent còn nguyên nhưng đề xuất chung đã chuyển PASS. 11 eval máy (E1-E9, E12, E13) tiếp tục PASS (baseline carried từ round 1, không đo lại — P2 evals.yaml không đổi). Verdict tổng: PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-07-29, do feature claim-scan-parser-hardening

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
