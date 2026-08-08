---
schema_version: 2
feature_slug: consumer-copy-cjs
verdict: REJECT
failed_evals: [E6, E13]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 79b7f2efba67657e68089f13a8f106c80f6aae10
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
| E6 | AC-6 | script | FAIL |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-11 | test | PASS |
| E13 | AC-11 | test | FAIL |
| E14 | AC-11 | test | PASS |
| E15 | AC-11 | script | PASS |

Hai eval đỏ, cùng nguồn gốc là đợt đổi đuôi nhưng KHÁC lớp nhau — chi tiết
trong hai block E6/E13 và mục Iterations.

## Evidence

- eval: E1
  run_id: consumer-copy-cjs-ce-r1-1786202918
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T15:28:38Z
  output: |
    PASS: CE3 recheck (.cjs) exit 0 trên evidence lành trong repo type:module
    Results: 9 passed, 0 failed
    (baseline origin/main: chép test của nhánh sang → 0 passed, 9 failed —
    marker INIT-CI-COPY-LIST chưa tồn tại, scripts/recheck-evidence.cjs chưa có)

- eval: E2
  run_id: consumer-copy-cjs-ce-r1-1786202918
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T15:28:38Z
  output: |
    PASS: CE5 pre-merge trong consumer type:module: exit 0, rules ran=3, KHÔNG một dòng NOT ENFORCED/fallback
    PASS: CE5b vendored gap-probe CHẤM thật ở consumer: xoá gap-probe.md → pre-merge (required) VIOLATION đúng thông điệp (gap-probe S1 P1#2)

- eval: E3
  run_id: consumer-copy-cjs-ce-r1-1786202918
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T15:28:38Z
  output: |
    PASS: CE4 đối chứng chấm-thật: bản tiêm exit-code hai → recheck exit 1 ghim "fails the evidence bar"
    (dòng PASS gốc trong evidence/E1-5-stdout.txt mang nguyên văn token exit-code;
    trích ở đây đã thay bằng chữ theo luật sanitize của hook)

- eval: E4
  run_id: consumer-copy-cjs-ce-r1-1786202918
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T15:28:38Z
  output: |
    PASS: CE6 red: cùng nội dung recheck nhưng đuôi .js trong type:module → ĐỎ đúng "require is not defined"
    PASS: CE7 red: lib/gap-probe đuôi .js chạy classify trong type:module → cùng lớp ReferenceError

- eval: E5
  run_id: consumer-copy-cjs-ce-r1-1786202918
  exit_code: 0
  baseline: red
  verifier: tests/scripts/consumer-esm.test.mjs
  verified_at: 2026-08-08T15:28:38Z
  output: |
    PASS: CE1 danh sách chép trích được từ marker (sanity ≥ 7 mục, mọi src tồn tại)
    PASS: CE2 QUAN HỆ đủ-bộ: mọi file scripts/+lib/ mà pre-merge-check.sh và recheck dùng đều nằm trong danh sách chép
    PASS: CE2m mutant trong-lần-chạy: bỏ 1 mục khỏi danh-sách-khai → quan hệ phải ĐỎ ghim đúng tên (gap-probe S1 P1#1)

- eval: E6
  run_id: consumer-copy-cjs-E6-r1-1786202928
  exit_code: 1
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/refs-sweep.sh
  verified_at: 2026-08-08T15:28:48Z
  output: |
    sanity: 163 tham chiếu .cjs tìm thấy (phải > 0, nếu 0 thì grep hỏng)
    đo:     27 tham chiếu .js còn sót · 0 require không-đuôi
    SWEEP FAIL: còn 27 tham chiếu mang đuôi .js
    Đủ 27 dòng (grep lại nguyên pattern của script, cùng phạm vi loại trừ):
      PRODUCT-MAP.md:41 — "lib/md-section.js" trong dòng mô tả luật ranh giới section
      codex/acceptance-gate/.codex-plugin/plugin.json:4 — "lib/md-section.js" trong văn changelog v1.25 của description
      .claude-plugin/plugin.json:4 và .codex-plugin/plugin.json:4 — cùng lớp văn changelog trong description
      tests/scripts/additive-only.test.mjs:32–52 (21 dòng) — fixture chuỗi ghim NỘI DUNG CŨ của pre-merge/recheck
      tests/scripts/consumer-esm.test.mjs:153,162 — đường dẫn .js của chính ca ĐỎ CE6/CE7 (đổi tên .cjs→.js trong sim)
    Baseline origin/main (chạy script của nhánh trong worktree base): 143 tham chiếu .js, SWEEP FAIL → red, phép đo phân biệt.
    Nhận định trung thực, không sửa hộ: 27 hit rơi vào 3 nhóm — văn lịch sử trong
    description manifest, fixture nội-dung-cũ của test additive-only, và fixture
    ca-đỏ của chính test mới. Thước (refs-sweep.sh, vật của nhánh này) và cây
    hiện tại đang mâu thuẫn; chọn siết vật hay khai phạm-vi-loại-trừ có lý do là
    quyết định của vòng sửa, không phải của verify.

- eval: E7
  run_id: consumer-copy-cjs-E7-r1-1786202928
  exit_code: 0
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/inline-node-e.sh
  verified_at: 2026-08-08T15:28:48Z
  output: |
    sanity: 4 biến đường-dẫn-lib · 4 lối gọi node trong pre-merge-check.sh
    gán: 58:RECHECK="$HERE/recheck-evidence.cjs" · 160:GP_LIB=.../lib/gap-probe.cjs
    gán: 265:WSREC_LIB=.../lib/workspace-record.cjs · 578:AC_LINE_LIB=.../lib/ac-line.cjs
    INLINE-NODE OK
    (baseline origin/main: cả 4 biến trỏ .js → exit 1 = red)

- eval: E8
  run_id: consumer-copy-cjs-E8-r1-1786202928
  exit_code: 0
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/recheck-lint.sh
  verified_at: 2026-08-08T15:28:48Z
  output: |
    sanity: 4 khối catch trong recheck-evidence.cjs (sàn 2)
    đo:     0 khối `catch (_) {}` rỗng còn lại
    RECHECK-LINT OK
    (baseline origin/main: FAIL không thấy scripts/recheck-evidence.cjs → red)

- eval: E9
  run_id: consumer-copy-cjs-E9-r1-1786202928
  exit_code: 0
  baseline: red
  verifier: _acceptance/consumer-copy-cjs/checks/manifest-bump.sh
  verified_at: 2026-08-08T15:28:48Z
  output: |
    acceptance-gate (cũ 1.39.0): 4/4 manifest = 1.39.1
    feature-loop (cũ 1.27.0): 3/3 manifest = 1.27.1
    MANIFEST-BUMP OK
    (baseline origin/main: manifest vẫn 1.39.0/1.27.0 → FAIL = red)

- eval: E10
  run_id: consumer-copy-cjs-E10-r1-1786202968
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-08T15:29:28Z
  output: |
    plugins/ mirror in sync.
    (baseline origin/main cũng xanh — guard chạy-được-cả-hai-phía, đúng kỳ vọng)

- eval: E11
  run_id: consumer-copy-cjs-E11-r1-1786202976
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-08T15:30:33Z
  output: |
    Results: 636 passed, 0 failed
    (baseline origin/main: 635 passed, 0 failed — suite guard xanh cả hai phía;
    +1 case là consumer-esm.test.mjs mới của nhánh)

- eval: E12
  run_id: consumer-copy-cjs-E12-r1-1786203041
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-08T15:30:42Z
  output: |
    Results: 54 passed, 0 failed
    (baseline origin/main: 54 passed, 0 failed)

- eval: E13
  run_id: consumer-copy-cjs-E13-r1b-1786203218
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T15:36:55Z
  output: |
    FAIL: P42 doi chung duong that bai — ban sao nguyen ven da do san
    FAIL: P45 bump ba manifest khong cham suite (mut_ok=1 bumped=3)
    Results: 2 failed
    Chạy HAI lần cùng kết quả: run consumer-copy-cjs-E13-r1-1786202910 chạy song
    song với các eval khác (nghi nhiễu race), run r1b-1786203218 chạy trên cây
    yên tĩnh — vẫn đỏ y hệt: kết quả tất định, không phải nhiễu.
    Chẩn đoán (chỉ đọc, không sửa): P42/P45 đỏ vì bản-sao-nguyên-vẹn (positive
    control) của chúng chạy nested suite và nested ĐẾN ĐƯỢC P150+P161 — hai case
    này mới là chỗ đỏ thật. Suite chạy ngoài không bao giờ tới P150: có checkpoint
    giữa suite sau P148 (tests/plugins/run-tests.sh:6100) thoát sớm khi đã có
    fail. Cả P150 lẫn P161 cùng một lớp "đối-chứng-bản-cũ": chúng lấy
    scripts/gate-card.js TẠI BASE COMMIT (git show, bản còn require lib/*.js)
    rồi ghép với lib/ HIỆN TẠI — P150 (run-tests.sh:6148-6150) cp -R lib chỉ còn
    .cjs nên bản base không nạp được và render khác bản mới; P161
    (run-tests.sh:~6955) chép fixture bằng điều kiện `f.suffix == ".js"` nên
    sau đổi tên chép ĐÚNG 0 file lib, mutant control mù → assert "PHEP DO MU:
    mutant 'khong lot chu dam' van khong lam chan truy-ve-nguon ĐỎ".
    Nested repro đầy đủ (suite trừ P42/P45): Results: 2 failed = P150, P161.
    Baseline: n-a — suite dài, bỏ baseline có chủ đích (theo đề bài verify).

- eval: E14
  run_id: consumer-copy-cjs-E14-r1-1786203049
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-08T15:30:51Z
  output: |
    Results: 62 passed, 0 failed
    Results: all workflow tests passed
    (baseline origin/main: all workflow tests passed)

- eval: E15
  run_id: consumer-copy-cjs-E15-r1-1786203057
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-08-08T15:30:57Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.
    (baseline origin/main cũng xanh — guard. Ghi chú lạc: PRODUCT-MAP.md:41 vẫn
    mang chuỗi "lib/md-section.js" mà E15 không đo — E15 đo khớp-hồ-sơ, không đo
    tên file; chuỗi đó là 1 trong 27 hit của E6.)

## Analyst

Green-on-baseline (không phân biệt): E10, E15 — đúng dự kiến, chúng là guard
chạy-được-cả-hai-phía, không phải phép đo của feature. Suite E11/E12/E14
green-on-both là guard kỳ vọng, không tính. Mọi eval gắn trực tiếp vào vật của
feature (E1–E9) đều red trên baseline origin/main — bộ thước phân biệt được.
E13 không có baseline (n-a có chủ đích).

## Variance

none — không eval nào chạy đa lượt. (E13 chạy 2 lần chỉ để loại giả thuyết
nhiễu race; hai lần cho cùng kết quả tất định, không phải variance.)

## Iterations

Round 1: E6, E13 failed — E6: 27 tham chiếu .js còn sót trong phạm vi quét
(manifest description, fixture additive-only, fixture ca-đỏ của chính test
mới); E13: P42/P45 đỏ vì positive-control nested chạm P150/P161 — hai case
đối-chứng-bản-cũ ghép script tại base commit (còn require lib/*.js) với lib/
hiện tại chỉ còn .cjs. Returned to implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
