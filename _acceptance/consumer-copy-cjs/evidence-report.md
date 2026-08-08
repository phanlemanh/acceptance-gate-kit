---
schema_version: 2
feature_slug: consumer-copy-cjs
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 20715437f042df1b1041b46782b9b3ae139057a5
human_signoff:
---

# Evidence Report: consumer-copy-cjs

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
| E11 | AC-11 | test | PASS |
| E12 | AC-11 | test | PASS |
| E13 | AC-11 | test | PASS |
| E14 | AC-11 | test | PASS |
| E15 | AC-11 | script | PASS |

Vòng 3 chạy tests-only theo phê duyệt vượt trần của owner (entry
`d-20260809T0200Z-ccc5` trong decisions.jsonl). Hai eval đỏ ở vòng trước (E6,
E13) nay xanh; E13 lấy bằng chứng từ làn máy phê duyệt tại commit cha — xem
block E13 để đọc nguyên do và bằng chứng diff-trống.

## Evidence

- eval: E1
  run_id: consumer-copy-cjs-E1-5-r3-1786232248
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T23:37:28Z
  output: |
    PASS: CE3 recheck (.cjs) exit 0 trên evidence lành trong repo type:module
    Results: 9 passed, 0 failed
    (baseline red — đo ở vòng trước: chép test của nhánh sang worktree
    origin/main → 0 passed, 9 failed, vì marker INIT-CI-COPY-LIST chưa tồn tại
    và scripts/recheck-evidence.cjs chưa có)

- eval: E2
  run_id: consumer-copy-cjs-E1-5-r3-1786232248
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T23:37:28Z
  output: |
    PASS: CE5 pre-merge trong consumer type:module: exit 0, rules ran=3, KHÔNG một dòng NOT ENFORCED/fallback
    PASS: CE5b vendored gap-probe CHẤM thật ở consumer: xoá gap-probe.md → pre-merge (required) VIOLATION đúng thông điệp (gap-probe S1 P1#2)
    (baseline red — đo ở vòng trước)

- eval: E3
  run_id: consumer-copy-cjs-E1-5-r3-1786232248
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T23:37:28Z
  output: |
    PASS: CE4 đối chứng chấm-thật: bản tiêm exit-code hai → recheck ĐỎ, ghim đúng "fails the evidence bar"
    (dòng PASS gốc trong evidence/E1-5-r3-stdout.txt mang nguyên văn token
    exit-code; trích ở đây đã viết thành chữ theo luật sanitize của hook —
    verdict KHÔNG đổi, chỉ excerpt đổi)
    (baseline red — đo ở vòng trước)

- eval: E4
  run_id: consumer-copy-cjs-E1-5-r3-1786232248
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T23:37:28Z
  output: |
    PASS: CE6 red: cùng nội dung recheck nhưng đuôi .js trong type:module → ĐỎ đúng "require is not defined"
    PASS: CE7 red: lib/gap-probe đuôi .js chạy classify trong type:module → cùng lớp ReferenceError
    (đối chứng dương nằm trong chính ca: bản .cjs cùng nội dung, cùng repo sim, xanh ở CE3/CE5)
    (baseline red — đo ở vòng trước)

- eval: E5
  run_id: consumer-copy-cjs-E1-5-r3-1786232248
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T23:37:28Z
  output: |
    PASS: CE1 danh sách chép trích được từ marker (sanity ≥ 7 mục, mọi src tồn tại)
    PASS: CE2 QUAN HỆ đủ-bộ: mọi file scripts/+lib/ mà pre-merge-check.sh và recheck dùng đều nằm trong danh sách chép
    PASS: CE2m mutant trong-lần-chạy: bỏ 1 mục khỏi danh-sách-khai → quan hệ phải ĐỎ ghim đúng tên (gap-probe S1 P1#1)
    (baseline red — đo ở vòng trước)

- eval: E6
  run_id: consumer-copy-cjs-E6-r3-1786232256
  exit_code: 0
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/refs-sweep.sh
  verified_at: 2026-08-08T23:37:36Z
  output: |
    sanity: 163 tham chiếu .cjs tìm thấy (phải > 0, nếu 0 thì grep hỏng)
    đo:     0 tham chiếu .js còn sót · 0 require không-đuôi
    SWEEP OK
    (vòng 1 phép đo này ĐỎ với 27 hit; nay 0 hit trong khi sanity counter vẫn
    163 — grep còn chạy thật, không phải grep hỏng thành 0-0.
    baseline red — đo ở vòng trước: script của nhánh chạy trong worktree
    origin/main cho 143 tham chiếu .js, SWEEP FAIL)

- eval: E7
  run_id: consumer-copy-cjs-E7-r3-1786232256
  exit_code: 0
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/inline-node-e.sh
  verified_at: 2026-08-08T23:37:36Z
  output: |
    sanity: 4 biến đường-dẫn-lib · 4 lối gọi node trong pre-merge-check.sh
    gán:  58:RECHECK="$HERE/recheck-evidence.cjs"
    gán:  160:GP_LIB=.../lib/gap-probe.cjs
    gán:  265:WSREC_LIB=.../lib/workspace-record.cjs
    gán:  578:AC_LINE_LIB=.../lib/ac-line.cjs
    INLINE-NODE OK
    (baseline red — đo ở vòng trước: trên origin/main cả 4 biến trỏ .js)

- eval: E8
  run_id: consumer-copy-cjs-E8-r3-1786232256
  exit_code: 0
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/recheck-lint.sh
  verified_at: 2026-08-08T23:37:36Z
  output: |
    sanity: 4 khối catch trong recheck-evidence.cjs (sàn 2)
    đo:     0 khối `catch (_) {}` rỗng còn lại
    RECHECK-LINT OK
    (baseline red — đo ở vòng trước: trên origin/main không thấy
    scripts/recheck-evidence.cjs nên phép đo ĐỎ)

- eval: E9
  run_id: consumer-copy-cjs-E9-r3-1786232256
  exit_code: 0
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/manifest-bump.sh
  verified_at: 2026-08-08T23:37:36Z
  output: |
    acceptance-gate (cũ 1.39.0): 4/4 manifest = 1.39.1
    feature-loop (cũ 1.27.0): 3/3 manifest = 1.27.1
    MANIFEST-BUMP OK
    (baseline red — đo ở vòng trước: trên origin/main manifest vẫn giữ số cũ)

- eval: E10
  run_id: consumer-copy-cjs-E10-r3-1786232264
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-08T23:37:44Z
  output: |
    plugins/ mirror in sync.
    (baseline green (guard) — đo ở vòng trước: origin/main cũng xanh, đây là
    guard chạy-được-cả-hai-phía, đúng kỳ vọng)

- eval: E11
  run_id: consumer-copy-cjs-E11-r3-1786232264
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-08T23:38:42Z
  output: |
    PASS: consumer-esm.test.mjs
    Results: 636 passed, 0 failed
    (bao gồm DV5 additive-only và 9 case CE mới của nhánh.
    baseline green (guard) — đo ở vòng trước: origin/main cho 635 passed,
    0 failed; +1 là file test consumer-esm.test.mjs mới)

- eval: E12
  run_id: consumer-copy-cjs-E12-r3-1786232322
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-08T23:38:43Z
  output: |
    Results: 54 passed, 0 failed
    (hook đọc lib/evidence-core.cjs sau đợt đổi tên.
    baseline green (guard) — đo ở vòng trước: 54 passed, 0 failed)

- eval: E13
  run_id: consumer-copy-cjs-E13-r3-lane
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T23:35:26Z
  output: |
    PASS: P30 plugins/ mirror in sync with sources (sync --check)
    PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    PASS: P45 bump ba manifest khong cham suite
    PASS: P150 required_evidence tren the + report cu render y het ban base
    PASS: P161 strip-md giu duong dan + ma tran toan phan
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    Results: all plugin tests passed
    (162 dòng PASS, 0 dòng FAIL trong toàn bộ stdout — lưu ở
    evidence/E13-r3-lane-stdout.txt)

    PROVENANCE — ghi trung thực: suite này KHÔNG chạy lại ở vòng 3. Nó chạy
    trong LÀN MÁY PHÊ DUYỆT tại commit 5f38521fae43348f8bad029a52a48cf302be3ee9,
    là CHA TRỰC TIẾP của commit được ghim (`git rev-parse HEAD^` = 5f38521).
    Bằng chứng diff-trống, tự kiểm trong lần verify này:
      git diff --name-only 5f38521 HEAD  →  61 file, TẤT CẢ nằm dưới _acceptance/
      git diff --name-only 5f38521 HEAD | grep -v '^_acceptance/' | wc -l  →  0
    Tức giữa hai commit chỉ có re-pin hồ sơ bằng chứng; 0 file engine
    (skills/, lib/, scripts/, hooks/, tests/, plugins/, commands/) thay đổi,
    nên kết quả suite tại 5f38521 áp dụng nguyên vẹn cho cây được ghim.
    Lý do không chạy lại: suite dài ~25 phút và đề bài vòng 3 là tests-only.
    Baseline: n-a — suite dài, bỏ baseline có chủ đích.

- eval: E14
  run_id: consumer-copy-cjs-E14-r3-1786232323
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-08T23:38:45Z
  output: |
    Results: 324 passed, 0 failed (acceptance-verify)
    Results: 62 passed, 0 failed
    Results: all workflow tests passed
    (baseline green (guard) — đo ở vòng trước: all workflow tests passed)

- eval: E15
  run_id: consumer-copy-cjs-E15-r3-1786232325
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-08-08T23:38:45Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.
    (baseline green (guard) — đo ở vòng trước: origin/main cũng xanh.
    Ghi chú vòng 1 nay đã hết hiệu lực: chuỗi "lib/md-section.js" trong
    PRODUCT-MAP.md từng là 1 trong 27 hit của E6, nay E6 đo 0 hit)

## Analyst

Green-on-baseline (guard, không phân biệt feature): E10, E11, E12, E14, E15 —
đây là các suite/guard chạy-được-cả-hai-phía, chúng chứng minh harness còn
sống chứ không chứng minh feature; đúng kỳ vọng, không phải lỗi thước.

Mọi eval gắn trực tiếp vào vật của feature (E1–E9) đều red trên baseline
origin/main — bộ thước phân biệt được bản trước và bản sau bản vá. E13 không có
baseline (n-a có chủ đích, suite dài).

## Variance

none — không eval nào chạy đa lượt.

## Iterations

Round 1: E6, E13 failed — E6: 27 tham chiếu .js còn sót trong phạm vi quét
(manifest description, fixture additive-only, fixture ca-đỏ của chính test
mới); E13: P42/P45 đỏ vì positive-control nested chạm P150/P161 — hai case
đối-chứng-bản-cũ ghép script tại base commit (còn require lib/*.js) với lib/
hiện tại chỉ còn .cjs. Returned to implementation.

Round 2: E13 failed — E6 đã xanh sau khi vòng sửa siết vật; E13 còn đỏ ở chân
mutant P161: điều kiện chép fixture `f.suffix == ".js"` chép ĐÚNG 0 file lib
sau đợt đổi tên nên mutant control mù, phép đo tự báo "PHEP DO MU". Returned to
implementation.

Round 3 (tests-only, owner phê duyệt vượt trần — d-20260809T0200Z-ccc5): 15/15
xanh. E6 giữ xanh với sanity counter 163 (grep còn chạy thật); chân mutant P161
đã được sửa nên P150/P161 xanh, kéo theo P42/P45 xanh trở lại. E13 lấy từ làn
máy phê duyệt tại commit cha 5f38521 với bằng chứng diff-trống (0 file ngoài
_acceptance/ đổi giữa 5f38521 và commit ghim); 13 eval còn lại chạy tươi tại
commit ghim trong lần verify này.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
