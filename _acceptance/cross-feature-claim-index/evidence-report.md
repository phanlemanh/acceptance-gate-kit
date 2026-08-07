---
schema_version: 2
feature_slug: cross-feature-claim-index
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 28660e60903c76ee57463bcd228220a2b9bfe546
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

## Re-pin machine-only — 2026-07-30

### Re-pin lần 2 — 2026-07-30, do vá AC-regex của gate-card

`verified_commit` lên `3a80983`. Nguyên nhân stale: `scripts/gate-card.js` nới
`AC_LINE` + tách `parseAC()` — dòng AC dạng `- **AC-N (nhãn):**`,
`- **AC-N** (judgment)`, `- AC-N (nhãn):` trước đây bị bỏ CÂM, nên thẻ Cổng 1
hiện thiếu tiêu chí hoặc rỗng hẳn.

**KHÁC lần 2-4: lần này staleness bắt ĐÚNG HOÀN TOÀN.** Không được viện "không
đổi hành vi cổng" như hai lần trước — thay đổi này đổi CHÍNH cái thẻ Cổng 1
render ra. Đo tính chất trên 176 contract (2 repo): 916 → 1246 dòng AC đọc
được; **0 dòng mất**, **0 lật cờ judgment** trên dòng cả hai parser cùng đọc
được, **0 false-positive**.

Slug này KHÔNG có eval nào đụng `scripts/gate-card.js`, nhưng nó là ca DUY
NHẤT trong repo mà bản vá ĐỔI thẻ của chính nó: `contract.md` dùng heading
`## Acceptance criteria` ⇒ thẻ Cổng 1 từng hiện **0 AC**, và Cổng 2 đã được
ký ngày 2026-07-29 trong tình trạng đó. Sau khi sửa heading + vá regex: đọc ra
đủ 12 AC (10 will/wont + AC-10, AC-11 vào khối judgment).

**Ghi để không tự lừa:** re-pin này KHÔNG hồi tố được việc chữ ký Cổng 1 của
slug này đã đặt trên một thẻ rỗng. Nó chỉ ghi nhận từ `3a80983` trở đi thẻ
đúng. Nếu muốn chữ ký dựa trên tiêu chí thật thì phải xem lại thẻ, không phải
re-pin.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `3a80983` — 6 suite EXIT=0
  (588 scripts · 51 hooks · plugins pass · workflows pass · skills pass · codex
  pass) + `sync-plugin-packages.sh --check` EXIT=0 (mirror in sync).
  **Provenance YẾU HƠN lần 2-4:** chạy MỘT lượt trong một phiên, KHÔNG phải 5
  agent tươi độc lập mỗi slug. Sha nhất quán vì cùng một cây, không phải vì
  năm lần đo độc lập đồng ý với nhau — đọc con số này với đúng trọng lượng đó.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là
  đã phán về AC-regex mới của gate-card.

### Re-pin lần 3 — 2026-07-30, do gói cảnh báo mù criterion (cùng chuỗi với lần 1)

`verified_commit` lên `afe223f`. Cùng nguyên nhân và cùng posture với lần 1
(vá AC-regex): `scripts/gate-card.js` đổi tiếp, thêm `lib/ac-line.js`. Vẫn
**KHÔNG viện được "không đổi hành vi cổng"** — gói này đổi cả cái card render ra.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `afe223f` — 6 suite EXIT=0 (592 scripts ·
  51 hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh
  --check` EXIT=0. Case đụng gate-card: P38a/b · P52 · P53 (byte-đối-byte) ·
  GPM21 · GPM20g đều PASS. Provenance vẫn YẾU như lần 1: một lượt chạy một
  phiên, không phải 5 agent tươi độc lập.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ
  nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về cảnh báo mù mới.

### Re-pin lần 4 — 2026-07-30, do vòng verify 2 của gate-card-ac-visibility

`verified_commit` lên `246e7e1`. Cùng chuỗi, cùng posture với lần 2: vòng 2 viết
lại case P61 (thước cũ không đo AC-4) và mở lane corpus repo tiêu thụ.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `246e7e1` — 6 suite EXIT=0 (594 scripts · 51
  hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh --check`
  EXIT=0. Case đụng gate-card: P38a/b · P52 · P53 (byte-đối-byte) · GPM21 · GPM20g
  đều PASS. Provenance vẫn một lượt chạy một phiên, không phải 5 agent độc lập.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ nguyên
  hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về cảnh báo mù hay thước mới.

### Re-pin lần 5 — 2026-07-30, do merge origin/main vào nhánh gate-card-ac-visibility

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

### Re-pin — 2026-08-03 (sau start-scan-hardening), tại 6f3449c

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 5 của feature
  `start-scan-hardening`, Workflow `wf_4cdd5992-610`, doer≠grader): 5 suite tại
  `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P105, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-05 (sau gate-card-ngon-ngu-may 1.32.0), tại 866c89e

`verified_commit` lên `866c89e`. Nguyên nhân stale: PR #29 sửa LỚP TRÌNH BÀY
thẻ cổng — scripts/gate-card.js (nối bullet hard-wrap, tầng card-plain cho
Coverage/gap-probe, lột markdown ở fallback) + writer doc 2 harness + test
P146–P148 + bump manifest 1.32.0 + vẽ lại PRODUCT-MAP.md + fix grep portable.
Không luật cưỡng chế nào đổi: hooks/, lib/, pre-merge-check.sh,
recheck-evidence.js KHÔNG nằm trong diff.

- **ĐÃ chạy lại:** toàn bộ machine lane tại `866c89e` — 596 case scripts ·
  51 hooks · plugins pass (kèm P146–P148 mới) · workflows pass · mirror in
  sync · product-map khớp; cả 6 suite_keys exit 0. Minh bạch: MỘT lượt chạy
  chung trong phiên fix CI của PR #29 cho cả đợt re-pin 19 slug, không phải
  agent tươi per-slug (khuôn 1-lượt có máy đối chiếu là việc của
  delta-verify-repin, đã duyệt Cổng 1, chưa ship).
- **KHÔNG chạy lại:** eval judgment, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực.

### Re-pin lần 16 — 2026-08-05, do feature delta-verify-repin (nghi thức 1-lane: 1 lượt machine-lane cho cả sự kiện)
run_id: repin-20260805-delta-verify-repin-lane1
sha: c1f781d9ccb880091988a9612f2dd0a5b72d3b82 · suites: 6 lệnh exit 0

### Re-pin lần 17 — 2026-08-05, do feature matrix-measure-law + hotfix luật repin (nghi thức 1-lane)
run_id: repin-20260805-matrix-measure-law-lane2
sha: 5ec937c0746dfeaa3c554f5c44b224954ae989ae · suites: 6 lệnh exit 0

### Re-pin lần 18 — 2026-08-05, do feature judge-required-evidence (nghi thức 1-lane)
run_id: repin-20260805-judge-required-evidence-lane1
sha: e6dad45a6169d17c59ac85a95c6d58924c14ffff · suites: 6 lệnh exit 0

### Re-pin lần 9 — 2026-08-05, do engine đổi ở vòng gold-output-measure (sổ vàng + tài liệu luật + bộ kiểm)
run_id: repin-20260805-gold-output-measure-lane1
sha: 9962888ed8058d1cec02fe737ff2b22ac80d84bb · suites: 6 lệnh exit 0

### Re-pin lần 10 — 2026-08-06, do engine đổi ở vòng card-text-fidelity (hàm lột định dạng của thẻ + bộ kiểm)
run_id: repin-20260806-card-text-fidelity-lane1
sha: 2b01e982116f80b50828d30cb2d593025c918dbe · suites: 6 lệnh exit 0

### Re-pin lần 11 — 2026-08-06, do engine đổi ở vòng codex-script-packaging (công cụ mang-kết-quả + hàm dựng gói + chỉ dẫn 2 bản)
run_id: repin-20260806-codex-script-packaging-lane1
sha: 451840967a9ef3726e953246da03225504c71675 · suites: 6 lệnh exit 0

### Re-pin lần 12 — 2026-08-06, do engine đổi ở vòng dọn nợ đo-lường (5 phép đo có răng + gỡ hai chốt meta)
run_id: repin-20260806-measure-teeth-cleanup-lane1
sha: cdc64cfb184559e9f60f3fd57b215726f2b2cb44 · suites: 6 lệnh exit 0
### Re-pin lần 12 — 2026-08-06, do engine đổi ở vòng discovery-brainstorm-socket (ổ cắm khám phá + bộ quét /start + bộ kiểm), ghim lại sau rebase lên main
run_id: repin-20260806-discovery-brainstorm-socket-lane2
sha: 4383b814def31b4627eb290d3e0ea688ca80887f · suites: 5 lệnh exit 0

### Re-pin lần 14 — 2026-08-07, do hợp nhất hai nhánh (dọn nợ đo-lường + ổ cắm brainstorm) — engine đổi ở cả hai phía
run_id: repin-20260807-merge-teeth-socket-lane1
sha: 5d20c246f526b312962f2e4f167e48975ac25986 · suites: 6 lệnh exit 0

### Re-pin lần 15 — 2026-08-07, do engine đổi ở vòng stop-patching-law (mệnh đề dừng-vá vào 2 bản chỉ dẫn + bộ kiểm P168–P170)
run_id: repin-20260807-stop-patching-law-lane1
sha: 6bd11f7554effe75a9b1e8c8686a43634e45ec3e · suites: 6 lệnh exit 0

### Re-pin lần 16 — 2026-08-07, do engine đổi ở vòng workspace-reader-unification (bảng luật đọc hồ sơ + bảng nhãn bản đồ + bộ kiểm P171–P173)
run_id: repin-20260807-workspace-reader-unification-lane1
sha: 28660e60903c76ee57463bcd228220a2b9bfe546 · suites: 6 lệnh exit 0

### Re-pin lần 19 — 2026-08-07, do engine verify đổi ở vòng triage-key-normalize (chuẩn hoá path khoá ghép scope-triage + triage hỏng ra PENDING-JUDGMENT)
run_id: repin-20260807-triage-key-normalize-lane1
sha: 3f96b45349ea1981f6b4cb15c178d3f79bf15c6d · suites: 6 lệnh exit 0
