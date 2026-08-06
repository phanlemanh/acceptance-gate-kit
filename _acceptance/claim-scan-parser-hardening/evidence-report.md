---
schema_version: 2
feature_slug: claim-scan-parser-hardening
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 451840967a9ef3726e953246da03225504c71675
human_signoff: Manh Phan 2026-07-29
---

# Evidence Report: claim-scan-parser-hardening

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | judgment | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-claim-scan-parser-hardening-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E2
  run_id: minted-claim-scan-parser-hardening-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E3
  run_id: minted-claim-scan-parser-hardening-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E4
  run_id: minted-claim-scan-parser-hardening-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E5
  run_id: minted-claim-scan-parser-hardening-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-claim-scan-parser-hardening-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E7
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: |
    Panel đề xuất PASS 2/3 lens (domain-correctness, spec-alignment): cả 5 lỗ
    liệt kê trong design (section-capture-tới-EOF, id-sai-khuôn, id-trùng-xuyên-feature,
    frontmatter-không-đọc-được, ledger-thiếu-decision/impact) đều có warn đếm-được
    đúng văn bản design, và hai bỏ-qua-chủ-đích (verdict hợp lệ ≠ findings; dedupe
    cùng slug) đúng như design đặt tên. operational-feasibility giữ nguyên FAIL —
    cùng lý do đã nêu ở round 1: nhánh lọc `type` ngoài fix/descope tại
    ledgerClaims (feature-loop/scripts/claim-scan.mjs:32) vẫn loại entry câm lặng,
    không đếm/không warn, và không nằm trong hai loại bỏ-qua-chủ-đích được design
    đặt tên. Dissent còn nguyên — xem votes.
  votes:
    - domain-correctness: PASS — Đối chiếu design với code: cả 5 lỗ (section-capture-tới-EOF, id-sai-khuôn, id-trùng-xuyên-feature, frontmatter-không-đọc-được, ledger-thiếu-decision/impact) đều có warn đếm-được đúng văn bản design (dòng 41, 54, 60, 116, 123), cộng warn thêm cho "nhánh câm thứ ba" (bảng Findings rỗng, dòng 87) và badRows per-file (dòng 84) — vượt cả 5 lỗ liệt kê. Hai bỏ-qua-chủ-đích còn lại đúng như design: verdict hợp lệ≠findings im lặng (dòng 63, khớp design dòng 24) và dedupe cùng slug im lặng (dòng 117, khớp design). Các nhánh im lặng còn sót (lọc type fix|descope dòng 32, exclude-self dòng 95, non-directory dòng 97, cap-10 truncation) đều là lọc cấu trúc/định nghĩa phạm vi (được đặt tên ngay trong pipeline docstring "lọc loại…cap" hoặc trong "Hành vi GIỮ NGUYÊN" của design), không cùng lớp dữ-liệu-hỏng-bị-nuốt mà 5 lỗ này nhắm tới — nên không phải nhánh câm ngoài hai loại (a)/(b).
    - operational-feasibility: FAIL — Trong ledgerClaims(), dòng `if (e.type !== 'fix' && e.type !== 'descope') continue;` drop mọi entry có type khác fix/descope hoàn toàn câm lặng — không có warn đếm được, và cũng không nằm trong hai bỏ-qua-chủ-đích được nêu tên trong design (verdict hợp lệ ≠ findings; dedupe cùng slug). Vì header của chính file ghi rõ decisions.jsonl chỉ nên chứa (fix|descope), một entry type khác thực chất là data lệch schema — cùng hình dạng với lỗ #5 (thiếu decision/impact, đã được sweep bắt và warn) nhưng nhánh filter theo `type` này lại lọt khỏi sweep, để lại một đường drop thứ ba ngoài hai loại được cho phép. Ngoài ra `!statSync(d).isDirectory()` cũng skip câm lặng nhưng đó là filter cấu trúc thư mục (không có "dữ liệu claim" nào bị bỏ), nên không tính là vi phạm cùng mức.
    - spec-alignment: PASS — Rà từng nhánh return/continue trong claim-scan.mjs: ledger (JSON lỗi, thiếu decision/impact) gộp vào 1 counter `bad` → warn "skipped N malformed lines"; gap-probe (frontmatter hỏng, verdict lạ, thiếu at, section không match, 0 hàng dữ liệu) đều có warn riêng; hàng bảng cells≠6 đếm vào badRows → warn. Hai bỏ-qua-chủ-đích còn lại đúng như design: verdict hợp lệ≠findings (dòng 63, im lặng) và dedupe id trùng cùng slug (dòng 117, comment "cùng slug: dedupe im lặng chủ đích"). Nhánh id sai khuôn/id trùng-khác-slug đều warn đúng thông điệp ghim trong design. Riêng filter `e.type!=='fix'&&e.type!=='descope'` (dòng 32) và exclude-self (dòng 95) là câm nhưng đây là tiêu chí LỌC LOẠI/phạm vi đã khai ở pipeline comment đầu file và header "(fix|descope)" — không phải nhánh dữ liệu-hỏng/bất-ngờ mà design nhắm tới, nên không tính là lỗ câm-lặng còn sót.
  human_override:

- eval: E8
  run_id: minted-claim-scan-parser-hardening-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-29T10:15:00Z
  output: |
    plugins/ mirror in sync.

- eval: E9
  run_id: minted-claim-scan-parser-hardening-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay

- `bash tests/workflows/run-tests.sh` → E1, E2, E3, E4, E5, E6, E9: pass trên CẢ HEAD lẫn baseline (diffBase) — carried từ round 1 (xem `baseline: green` ở round 1). Các eval này không tự phân biệt code cũ/mới; cần xác nhận đây là quyết định có chủ đích (suite chạy trên fixture cố định không phụ thuộc thay đổi của round này) hoặc viết lại để assert hành vi mới do hardening đưa vào.
- `bash scripts/sync-plugin-packages.sh --check` → E8: pass trên CẢ HEAD lẫn baseline — carried từ round 1; không tự phân biệt; xác nhận là regression-guard có chủ đích (mirror đã sync sẵn trước khi feature này chạm vào) hoặc viết lại để assert riêng nội dung mirror của round này (bump version + description).

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 hay `variance: true`).

## Iterations

Round 1: E7 (AC-7, judgment) FAIL đồng thuận 3/3 lens — nhánh drop dữ liệu thứ ba tại `ledgerClaims` (feature-loop/scripts/claim-scan.mjs:32, lọc `type` ngoài fix/descope) bị loại âm thầm, không đếm/không warn, và không nằm trong hai loại bỏ-qua-chủ-đích mà design/AC-7 đặt tên; E1-E6, E8, E9 đều PASS. Trả về implementation.
Round 2: baseline không đo lại (P2 — evals.yaml không đổi từ lần baseline cuối, round 1); 8 eval máy (E1-E6, E8, E9) tiếp tục PASS nguyên vẹn trên `bash tests/workflows/run-tests.sh` (10 passed, 0 failed) và `bash scripts/sync-plugin-packages.sh --check` (mirror in sync), cộng ba suite phụ trợ `bash tests/scripts/run-tests.sh` (588 passed), `bash tests/hooks/run-tests.sh` (51 passed) và `bash tests/plugins/run-tests.sh` (all green, đến P57) đều xanh nhưng không gắn eval cụ thể. Panel 3 lens tái thẩm E7: domain-correctness và spec-alignment đảo từ FAIL sang PASS (nhánh lọc `type` ngoài fix/descope tại claim-scan.mjs:32 được nhìn nhận là tiêu chí lọc phạm vi/định nghĩa, đã đặt tên trong pipeline docstring và header "(fix|descope)", không cùng lớp dữ-liệu-hỏng-bị-nuốt mà 5 lỗ design nhắm tới); operational-feasibility giữ nguyên FAIL với đúng lý do round 1 — dissent còn nguyên, chưa được vá trong code. Đề xuất chung của panel: PASS 2/3 lens. Verdict tổng: PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

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

### Re-pin lần 12 — 2026-08-05, do feature delta-verify-repin (nghi thức 1-lane: 1 lượt machine-lane cho cả sự kiện)
run_id: repin-20260805-delta-verify-repin-lane1
sha: c1f781d9ccb880091988a9612f2dd0a5b72d3b82 · suites: 6 lệnh exit 0

### Re-pin lần 13 — 2026-08-05, do feature matrix-measure-law + hotfix luật repin (nghi thức 1-lane)
run_id: repin-20260805-matrix-measure-law-lane2
sha: 5ec937c0746dfeaa3c554f5c44b224954ae989ae · suites: 6 lệnh exit 0

### Re-pin lần 14 — 2026-08-05, do feature judge-required-evidence (nghi thức 1-lane)
run_id: repin-20260805-judge-required-evidence-lane1
sha: e6dad45a6169d17c59ac85a95c6d58924c14ffff · suites: 6 lệnh exit 0

### Re-pin lần 5 — 2026-08-05, do engine đổi ở vòng gold-output-measure (sổ vàng + tài liệu luật + bộ kiểm)
run_id: repin-20260805-gold-output-measure-lane1
sha: 9962888ed8058d1cec02fe737ff2b22ac80d84bb · suites: 6 lệnh exit 0

### Re-pin lần 6 — 2026-08-06, do engine đổi ở vòng card-text-fidelity (hàm lột định dạng của thẻ + bộ kiểm)
run_id: repin-20260806-card-text-fidelity-lane1
sha: 2b01e982116f80b50828d30cb2d593025c918dbe · suites: 6 lệnh exit 0

### Re-pin lần 7 — 2026-08-06, do engine đổi ở vòng codex-script-packaging (công cụ mang-kết-quả + hàm dựng gói + chỉ dẫn 2 bản)
run_id: repin-20260806-codex-script-packaging-lane1
sha: 451840967a9ef3726e953246da03225504c71675 · suites: 6 lệnh exit 0
