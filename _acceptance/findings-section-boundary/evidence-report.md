---
schema_version: 2
feature_slug: findings-section-boundary
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 23b8dc67e9386bd137690cd8eabc4129fee42e72
human_signoff: Manh Phan 2026-07-29
---

# Evidence Report: findings-section-boundary

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
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | test | PASS |
| E13 | AC-8 | test | PASS |
| E14 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-findings-section-boundary-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E2
  run_id: minted-findings-section-boundary-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E3
  run_id: minted-findings-section-boundary-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E4
  run_id: minted-findings-section-boundary-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E5
  run_id: minted-findings-section-boundary-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E6
  run_id: minted-findings-section-boundary-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E7
  run_id: minted-findings-section-boundary-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T23:55:00Z
  output: |
    execute-parallel: 16 passed
    skill-claims: 10 passed
    Total: 227 tests, 0 failed

- eval: E8
  run_id: minted-findings-section-boundary-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E9
  run_id: minted-findings-section-boundary-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T23:55:00Z
  output: |
    execute-parallel: 16 passed
    skill-claims: 10 passed
    Total: 227 tests, 0 failed

- eval: E10
  judged_by: judge panel (3 lenses, fresh context)
  verdict: PASS
  rationale: Round 3 — đồng thuận tuyệt đối 3/3 (khác round 2, nơi operational-feasibility dissent UNCERTAIN). Cả ba lens xác nhận grep cho thấy gate-card.js và evidence-page.js đều require('../lib/md-section.js') và không còn `function section(` riêng; bảng SECTION_BOUNDARY tự-parse từ marker trong chính lib/md-section.js chứ không phải hằng số chép tay. Ba ngoại lệ còn giữ luật riêng (eval-coverage-lint.js sectionLines, lib/out-of-contract.js HEAD_ANY, claim-scan.mjs cross-package) đều được khai tên tường minh trong "Out of scope" của contract/design; claim-scan còn được ghim thêm bằng round-trip test thật (AC-7, FSB7). operational-feasibility đổi từ UNCERTAIN (round 2) sang PASS: không phải vì có thêm quyền đọc scripts/evidence-page.js trong input, mà vì chấp nhận việc xác nhận grep cho reader thứ hai được giao cho AC-6/AC-11 (machine eval) — nhất quán với vai trò AC-10 là đánh giá tính mạch lạc thiết kế single-source, không phải lặp lại phép grep của machine eval. Vì risk_tier là T3, verdict tổng của report VẪN là PENDING-JUDGMENT — luật T3 đòi hỏi human tự xác nhận trực tiếp trên MỌI judgment item bất kể panel đồng thuận PASS hay không; `human_override` dưới đây còn để trống chờ Gate 2.
  votes:
    - domain-correctness: PASS — gate-card.js va evidence-page.js deu xoa dinh nghia section() rieng va require('../lib/md-section.js') duy nhat (grep xac nhan khong con `function section(` nao khac ngoai lib/md-section.js); bang SECTION_BOUNDARY tu-parse tu marker trong chinh file, khong bi chep tay ra hang so roi. Ba ngoai le con lai (eval-coverage-lint.sectionLines, lib/out-of-contract.js HEAD_ANY, claim-scan.mjs cross-package) deu duoc khai ten trong contract muc Out of scope, dung khop danh sach cau hoi neu; rieng claim-scan duoc ghim bang round-trip test that (FSB7, tests/workflows/claim-scan.test.mjs) co ca doi chung duong va dot bien. Khong tim thay call-site nao khac tu che luat ranh gioi section ngoai cac ngoai le da khai.
    - operational-feasibility: PASS — lib/md-section.js dung bang marker that (tu parse chinh no) va gate-card.js da chuyen sang require no, khong con dinh nghia section() rieng. Bo input van khong kem evidence-page.js/claim-scan.mjs de tu grep, nhung phan R-axis cua Coverage trong contract da liet ke du 4 ban cai dat that va giao viec grep xac nhan cho AC-6/AC-11 (machine eval) — nhat quan voi vai tro AC-10 (judgment) la danh gia tinh mach lac cua thiet ke single-source, khong phai lap lai phep grep.
    - spec-alignment: PASS — gate-card.js và evidence-page.js đều require lib/md-section.js, không còn function section( riêng (grep xác nhận). Hai ngoại lệ còn giữ luật riêng — eval-coverage-lint.js sectionLines và lib/out-of-contract.js HEAD_ANY — đều được khai tên tường minh trong Out of scope của contract.md và design.md; claim-scan.mjs cross-package được ghim bằng round-trip AC-7. Không thấy call-site nào khác tự chế luật ranh giới ngoài các ngoại lệ đã khai.
  human_override: Manh Phan 2026-07-29
- eval: E11
  run_id: minted-findings-section-boundary-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-29T23:55:00Z
  output: |
    plugins/ mirror in sync.

- eval: E12
  run_id: minted-findings-section-boundary-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: UJ16e

    Results: 590 passed, 0 failed

- eval: E13
  run_id: minted-findings-section-boundary-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: T42

    Results: 51 passed, 0 failed

- eval: E14
  run_id: minted-findings-section-boundary-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-29T23:55:00Z
  output: |
    PASS: P57 acceptance-init noi DUNG muc cuong che cua approvers (CA HAI harness)

    Results: all plugin tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay (P2, evals.yaml khong doi tu lan baseline cuoi). Danh sach eval khong-phan-biet round nay: none — moi block eval may deu ghi baseline: n-a vi round nay khong do lai; trang thai non-discriminating gan nhat duoc xac nhan o round 2 la [] (evals_hash khong doi so voi round 1, carried_from_round: 1). Chi tiet baseline round 1 (13/13 eval may green-on-both, phan lon la suite tong quat/regression-guard co chu y, cac bien the dot bien trong E5/E6/E7/E12 co doi chung am/duong that nen khong tu dong coi la false-green) van con hieu luc, khong co gi moi de bao cao them.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 trong round này).

## Iterations

Round 1: Tất cả 13 eval máy PASS (588+16+10+ suite plugins/hooks/mirror xanh), nhưng verdict tổng là REJECT vì hai lý do độc lập: (1) judgment E10/AC-10 — panel FAIL 2/3 (domain-correctness, spec-alignment): lib/out-of-contract.js tự định nghĩa ranh giới section riêng bằng regex cứng thay vì tra bảng SECTION_BOUNDARY của lib/md-section.js, và call-site này chưa được khai trong "Out of scope" của design; (2) review phát hiện finding trong hợp đồng map vào AC-3 (severity high) — contract.md dùng heading `## Acceptance criteria` mà không reader máy nào khớp (mọi reader match `Criteria` không có tiền tố "Acceptance"), khiến gate-card/eval-coverage-lint đọc ra 0 AC trên chính contract này. Trả về implementation để: sửa lib/out-of-contract.js dùng chung bảng SECTION_BOUNDARY (hoặc khai rõ ngoại lệ trong design), và sửa heading contract.md về đúng `## Criteria` theo contract-template.md.

Round 2: Tất cả 13 eval máy PASS trở lại (588 scripts + 10 workflows + mirror sync + 51 hooks + suite plugins xanh), không failed_evals. Panel E10/AC-10 vote lại: domain-correctness và spec-alignment chuyển sang PASS (grep xác nhận gate-card.js/evidence-page.js không còn `function section(` riêng, đều require lib/md-section.js chung; ba ngoại lệ đã khai tên trong Out of scope của contract, claim-scan.mjs được ghim bằng round-trip AC-7). operational-feasibility không còn FAIL nhưng chuyển UNCERTAIN — thiếu bằng chứng trực tiếp về scripts/evidence-page.js (không nằm trong input được giao đọc lần này) để xác nhận chắc chắn claim single-source cho toàn package. Verdict tổng round này là PENDING-JUDGMENT — chờ human tự kiểm scripts/evidence-page.js và điền `human_override` cho E10 tại Gate 2 (bắt buộc với T3 dù panel không FAIL).

Round 3: Tất cả 14 eval máy PASS (590 scripts + 227 workflows + mirror sync + 51 hooks + suite plugins xanh — E8 nay chạy trong tests/scripts/run-tests.sh cùng E1-E6/E12), không failed_evals. Panel E10/AC-10 lần này đồng thuận tuyệt đối 3/3 PASS — operational-feasibility bỏ dissent UNCERTAIN của round 2, chấp nhận việc xác nhận grep cho reader thứ hai (evidence-page.js) được giao cho AC-6/AC-11 (machine eval) thay vì tự đọc trực tiếp. Verdict tổng vẫn là PENDING-JUDGMENT: risk_tier T3 đòi hỏi human tự điền `human_override` trực tiếp trên MỌI judgment item ở Gate 2, bất kể panel đã đồng thuận PASS — chưa có override nào được điền nên chưa thể lên PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

## Re-pin machine-only — 2026-07-30

### Re-pin lần 1 — 2026-07-30, do merge origin/main vào nhánh gate-card-ac-visibility

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
